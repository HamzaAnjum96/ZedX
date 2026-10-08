#!/usr/bin/env python3
"""Check that the official ZedX pages still say what this site repeats.
Standard library only.

    python3 tools/check_sources.py            # report missing phrases
    python3 tools/check_sources.py --verbose  # also list the phrases found

Every phrase below backs one or more rows of replica/claims.md (the ID is
shown next to it). The script fetches each official page, flattens it to
lower-case text and reports any phrase that has gone. When one is missing,
re-read that page, then update claims.md and the site copy that uses the row.

Exit 0 when every phrase is found, 1 when any is missing, 2 when a page
cannot be fetched.
"""

import html
import re
import sys
import urllib.error
import urllib.request

ZEDX = 'https://www.zedxapps.com/'

# (source label, URL, [(claim IDs, phrase), ...])
# A phrase that starts with "<" is looked for in the raw HTML instead of the text.
SOURCES = [
    ('HOME', ZEDX + 'index.html', [
        ('L5', 'home for individual use, professional for smes, group for unrelated teams, '
               'corporate for medium-sized businesses, and enterprise for government, '
               'education and larger organisations'),
        ('L6', 'saas editions are licensed per user, while enterprise provides unlimited users'),
        ('L6', "customer's own microsoft azure account"),
        ('L9', '<id="formContact"'),
        ('L9', 'we will get back to you soon'),
        ('L10', 'swiftpro corporation ltd'),
        ('L11', 'self-guided demo, with no registration required'),
        ('L12', 'start a free trial by registering your details, with no credit card required'),
        ('L13', 'simple pricing is available in multiple currencies'),
    ]),
    ('APP', ZEDX + 'Applications/index.html', [
        ('W1', 'each workflow serves a dedicated and specific function within the organisation'),
        ('W2', 'tasks within each workflow are arranged as kanban boards'),
        ('A5', 'online automated stand-ups reporting'),
    ]),
    ('GW', ZEDX + 'GroupWorkStreams/Index.html', [
        ('W3', 'without the overhead of formal project management or agile ceremonies'),
        ('W3', 'operational, administrative, and service-based teams'),
        ('W9', 'high-level progress can be referenced within project portfolios'),
        ('W10', 'simple lists, kanban-style boards, or timeline views'),
        ('W10', 'stages, fields, and priorities can be adapted'),
        ('W11', 'visibility of workload, progress, and bottlenecks across work streams'),
        ('W12', 'control access using role-based permissions'),
        ('W13', 'individual work streams can be linked to the zedx agile sprints application'),
        ('W13', 'without duplicating data'),
        ('W14', 'audit recommendations, governance actions, or control improvement'),
        ('W15', 'zedx study planner'),
    ]),
    ('AS', ZEDX + 'AgileSprints/Index.html', [
        ('A1', 'scrum and sprint-based agile methods'),
        ('A2', 'epics and user stories within a prioritised product backlog'),
        ('A3', 'visibility of scope, capacity, and sprint goals before work begins'),
        ('A4', 'visualise work using configurable sprint boards'),
        ('A4', 'work in progress, completed items, and blocked work'),
        ('A5', 'support daily stand-ups and sprint reviews'),
        ('A6', 'track sprint progress in real time'),
        ('A7', 'manage releases across one or more sprints'),
        ('A7', 'assign stories to planned release versions'),
        ('A8', 'sprint completion, velocity, and carried-over work'),
        ('A9', 'inform teams and encourage learning'),
        ('A10', 'control access using role-based permissions'),
        ('A11', 'sprint progress is summarised through periodic updates without exposing task-level detail'),
        ('W8', 'operational and ad-hoc work to be managed separately'),
    ]),
    ('PP', ZEDX + 'ProjectPortfolios/Index.html', [
        ('P1', 'portfolios, programmes, and projects'),
        ('P2', 'monthly or quarterly'),
        ('P3', 'delivery confidence using rag status, narrative progress, key achievements, '
               'blockers, risks, dependencies, and support required'),
        ('P4', 'improving, stable, or deteriorating'),
        ('P5', 'portfolio-level gantt view'),
        ('P5', 'export project and portfolio data to excel'),
        ('P5', 'send automatic reminders for project updates'),
        ('P5', 'manage and track project benefits after delivery'),
        ('P6', 'periodic reporting rather than task-level detail'),
        ('W9', 'project workstreams can be linked to group workstreams'),
    ]),
    ('PLAT', ZEDX + 'Platform/index.html', [
        ('L1', 'microsoft entra id provides single sign-on'),
        ('L2', 'teams can work within their own areas while authorised users retain visibility '
               'across departments, business units or the wider organisation'),
        ('L3', 'one login. one user experience.'),
        ('L3', 'applications can be introduced around specific teams or business requirements'),
        ('L4', 'react, apis, microsoft sql server and microsoft azure'),
        ('L6', 'saas editions provide straightforward per-user access'),
        ('L6', "enterprise can be hosted within the customer's own microsoft azure environment"),
        ('L6', 'greater control over infrastructure, integration and data'),
        ('L7', 'enterprise deployments can integrate zedx with existing applications and data sources'),
        ('L8', 'apps on demand'),
        ('L11', 'self-service demo without registering'),
        ('L12', 'trial account without providing a credit card'),
    ]),
    ('PRIVACY', ZEDX + 'PrivacyPolicy.html', [('R3', 'privacy')]),
    ('TERMS', ZEDX + 'WebsiteTerms.html', [('R3', 'terms')]),
    ('GITHUB', 'https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages', [
        ('R1', "the visitor's ip address is logged and stored for security purposes"),
    ]),
]


def fetch(url):
    request = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (claims check for an independent ZedX promotional site)'})
    with urllib.request.urlopen(request, timeout=30) as response:
        return response.read().decode('utf-8', 'replace')


def flatten(raw):
    text = re.sub(r'<(script|style|noscript|svg)\b.*?</\1>', ' ', raw, flags=re.S | re.I)
    text = html.unescape(re.sub(r'<[^>]+>', ' ', text))
    text = text.replace('’', "'").replace('‘', "'").replace('“', '"').replace('”', '"')
    return ' '.join(text.split()).lower()


def main():
    verbose = '--verbose' in sys.argv
    missing, unreachable = [], []
    for label, url, phrases in SOURCES:
        try:
            raw = fetch(url)
        except (urllib.error.URLError, TimeoutError, OSError) as error:
            unreachable.append(f'{label}: {url} ({error})')
            continue
        text = flatten(raw)
        found = 0
        for ids, phrase in phrases:
            here = phrase[1:] in raw if phrase.startswith('<') else ' '.join(phrase.split()) in text
            if here:
                found += 1
                if verbose:
                    print(f'  found   {label} {ids}: {phrase}')
            else:
                missing.append(f'{label} {ids}: "{phrase}"  ({url})')
        print(f'{label:8} {found}/{len(phrases)} phrases found')

    for line in unreachable:
        print(f'UNREACHABLE {line}')
    for line in missing:
        print(f'MISSING {line}')
    if unreachable:
        return 2
    if missing:
        print('\nRe-read the page, then update replica/claims.md and the copy that uses those rows.')
        return 1
    print('every phrase behind replica/claims.md is still on the official pages')
    return 0


if __name__ == '__main__':
    sys.exit(main())
