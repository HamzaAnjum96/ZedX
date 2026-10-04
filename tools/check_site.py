#!/usr/bin/env python3
"""Static checks for the GitHub Pages site. Standard library only, so CI
needs nothing installed.

    python3 tools/check_site.py docs

For every HTML page under the folder:
  - <html lang>, <title>, meta description and exactly one <h1>
  - every local href/src/srcset points at a file that exists
  - every #anchor exists in the page it points at
  - every icon in the sprite that a page uses exists
  - every screenshot viewer link has its full-size images
  - every <img> has alt text and width/height (the viewer's empty <img> aside)
  - no element id is used twice on a page
  - the copy avoids filler and ownership claims the site must not make
Plus: the files the pages promise (brochure.pdf, og-image.png, ...) exist.

Exit 1 with a list of problems, 0 when clean.
"""

import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit


# Words and claims the brief rules out (case-insensitive, visible text only).
BANNED = ['unlock', 'revolutionis', 'seamless', 'all-in-one', 'our software',
          'our platform', 'we built', 'jira', 'trello', 'atlassian']


class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.lang = None
        self.title = ''
        self.in_title = False
        self.description = None
        self.h1 = 0
        self.ids = []
        self.refs = []  # (attr, value)
        self.base = None
        self.viewers = []
        self.imgs = []  # attribute dicts
        self.text = []
        self.skip = 0

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'html':
            self.lang = a.get('lang')
        elif tag == 'title':
            self.in_title = True
        elif tag == 'meta' and a.get('name') == 'description':
            self.description = a.get('content', '')
        elif tag == 'h1':
            self.h1 += 1
        elif tag == 'base':
            self.base = a.get('href')
        if tag in ('script', 'style'):
            self.skip += 1
        if 'id' in a:
            self.ids.append(a['id'])
        for attr in ('href', 'src'):
            if a.get(attr) and tag != 'base':
                self.refs.append((tag, a[attr]))
        if a.get('srcset'):
            for candidate in a['srcset'].split(','):
                url = candidate.strip().split(' ')[0]
                if url:
                    self.refs.append((tag + ' srcset', url))
        if a.get('data-viewer'):
            self.viewers.append(a['data-viewer'])
        if tag == 'img':
            self.imgs.append(a)

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag in ('script', 'style'):
            self.skip -= 1

    def handle_endtag(self, tag):
        if tag == 'title':
            self.in_title = False
        if tag in ('script', 'style'):
            self.skip -= 1

    def handle_data(self, data):
        if self.in_title:
            self.title += data
        if not self.skip:
            self.text.append(data)


def parse(path):
    page = Page()
    page.feed(path.read_text(encoding='utf-8'))
    return page


def ids_in(path, cache):
    if path not in cache:
        if path.suffix == '.svg':
            cache[path] = set(parse_svg_ids(path))
        else:
            cache[path] = set(parse(path).ids)
    return cache[path]


def parse_svg_ids(path):
    import re
    return re.findall(r'\bid="([^"]+)"', path.read_text(encoding='utf-8'))


def main(argv):
    root = Path(argv[1] if len(argv) > 1 else 'docs').resolve()
    site_base = '/ZedX/'
    problems = []
    cache = {}

    pages = sorted(root.rglob('*.html'))
    if not pages:
        print('no HTML pages under %s' % root)
        return 1

    for path in pages:
        rel = path.relative_to(root)
        page = parse(path)
        where = str(rel)
        if page.lang != 'en-GB':
            problems.append('%s: <html lang> should be en-GB, is %r' % (where, page.lang))
        if not page.title.strip():
            problems.append('%s: missing <title>' % where)
        if page.description is None or len(page.description) < 50:
            problems.append('%s: missing or short meta description' % where)
        if page.h1 != 1:
            problems.append('%s: expected one <h1>, found %d' % (where, page.h1))
        for img in page.imgs:
            if 'data-viewer-img' in img:
                continue
            if not (img.get('alt') or '').strip():
                problems.append('%s: <img src=%s> has no alt text' % (where, img.get('src')))
            if not img.get('width') or not img.get('height'):
                problems.append('%s: <img src=%s> has no width/height' % (where, img.get('src')))
        for name in page.viewers:
            for size in (1600, 2400):
                full = root / 'assets' / 'img' / 'screens' / ('%s-full-%d.webp' % (name, size))
                if not full.exists():
                    problems.append('%s: viewer image missing: %s' % (where, full.relative_to(root)))
        text = ' '.join(page.text).lower()
        for word in BANNED:
            if word in text:
                problems.append('%s: copy uses "%s"' % (where, word))
        dupes = {i for i in page.ids if page.ids.count(i) > 1}
        if dupes:
            problems.append('%s: duplicate ids %s' % (where, ', '.join(sorted(dupes))))

        for tag, ref in page.refs:
            parts = urlsplit(ref)
            if parts.scheme in ('http', 'https', 'mailto', 'tel', 'data'):
                continue
            target_path = parts.path
            if page.base and target_path and not target_path.startswith('/'):
                # 404.html uses <base href="/ZedX/">: resolve from the site root
                target_path = page.base + target_path
            if target_path.startswith('/'):
                if not target_path.startswith(site_base):
                    problems.append('%s: absolute path outside the site: %s' % (where, ref))
                    continue
                target = root / target_path[len(site_base):]
            elif target_path:
                target = (path.parent / target_path)
            else:
                target = path
            if target.is_dir() or str(target).endswith('/'):
                target = target / 'index.html'
            target = target.resolve()
            if not target.exists():
                problems.append('%s: <%s> points at a missing file: %s' % (where, tag, ref))
                continue
            if parts.fragment and target.suffix in ('.html', '.svg'):
                if parts.fragment not in ids_in(target, cache):
                    problems.append('%s: #%s not found in %s' % (where, parts.fragment, target.relative_to(root)))

    for promised in ('brochure.pdf', 'assets/img/og-image.png', 'assets/img/favicon.svg',
                     'assets/img/apple-touch-icon.png', '.nojekyll'):
        if not (root / promised).exists():
            problems.append('missing %s' % promised)

    if problems:
        print('%d problem(s):' % len(problems))
        for line in problems:
            print('  - ' + line)
        return 1
    print('site check passed: %d pages; links, anchors, icons, images and copy rules all clean' % len(pages))
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv))
