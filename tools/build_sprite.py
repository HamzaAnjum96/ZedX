"""Build docs/assets/img/icons.svg from Phosphor icons (regular weight, MIT).

    npm pack @phosphor-icons/core@2.1.1 --pack-destination /tmp/phosphor
    tar -xzf /tmp/phosphor/phosphor-icons-core-2.1.1.tgz -C /tmp/phosphor
    python3 -I tools/build_sprite.py /tmp/phosphor/package/assets/regular . --prune

To add an icon, map a new "i-name" id to its Phosphor file name in ICONS
below, reference it in the HTML as assets/img/icons.svg#i-name, then run the
command. With --prune, only icons referenced in docs/*.html,
docs/assets/js/*.js or tools/*.html are written, and a referenced id that is
not mapped stops the build.
"""
import re
import sys
from pathlib import Path

ICONS = {
    'i-arrow-right': 'arrow-right',
    'i-arrow-down': 'arrow-down',
    'i-external-link': 'arrow-up-right',
    'i-x': 'x',
    'i-log-in': 'sign-in',
    'i-file-down': 'file-arrow-down',
    'i-expand': 'arrows-out-simple',
    'i-zoom-in': 'magnifying-glass-plus',
    'i-zoom-out': 'magnifying-glass-minus',
    'i-caret-down': 'caret-down',
    'i-kanban': 'kanban',
    'i-sprint': 'arrows-clockwise',
    'i-fingerprint': 'fingerprint-simple',
    'i-cloud': 'cloud',
    'i-sparkle': 'sparkle',
    'i-monitor-play': 'monitor-play',
    'i-check': 'check',
    'i-chart-bar': 'chart-bar',
    'i-users': 'users-three',
    'i-gauge': 'gauge',
    'i-tray': 'tray',
    'i-stack': 'stack',
    'i-flag': 'flag',
    'i-columns': 'columns',
    'i-list-checks': 'list-checks',
    'i-flag-checkered': 'flag-checkered',
}

src = Path(sys.argv[1])
root = Path(sys.argv[2])
used = None
if '--prune' in sys.argv:
    used = set()
    for path in list((root / 'docs').glob('*.html')) + list((root / 'docs/assets/js').glob('*.js')) + list((root / 'tools').glob('*.html')):
        used |= set(re.findall(r"icons\.svg#(i-[a-z0-9-]+)", path.read_text(encoding='utf-8')))
        used |= set(re.findall(r"'#(i-[a-z0-9-]+)'", path.read_text(encoding='utf-8')))
    missing = used - set(ICONS)
    if missing:
        sys.exit('referenced but not mapped: %s' % ', '.join(sorted(missing)))

out = ['<svg xmlns="http://www.w3.org/2000/svg">',
       '<!-- Icons: Phosphor Icons v2.1.1, regular weight (https://phosphoricons.com), MIT License. See docs/assets/img/LICENSE-phosphor.txt -->']
for icon_id, name in ICONS.items():
    if used is not None and icon_id not in used:
        continue
    svg = (src / (name + '.svg')).read_text(encoding='utf-8')
    view = re.search(r'viewBox="([^"]+)"', svg).group(1)
    inner = re.sub(r'^.*?<svg[^>]*>|</svg>\s*$', '', svg, flags=re.S).strip()
    out.append('<symbol id="%s" viewBox="%s">%s</symbol>' % (icon_id, view, inner))
out.append('</svg>')
(root / 'docs/assets/img/icons.svg').write_text('\n'.join(out) + '\n', encoding='utf-8')
print('wrote %d icons' % (len(out) - 3))
