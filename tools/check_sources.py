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
        ('L9', '<id="formContact"'),
        ('L9', 'we will get back to you soon'),
        ('L10', 'swiftpro corporation ltd'),
        ('L11', 'self-guided demo, with no registration required'),
        ('L12', 'start a free trial by registering your details, with no credit card required'),
        ('L13', 'simple pricing is available in multiple currencies'),
    ]),
    ('APP', ZEDX + 'Applications/index.html', [
        ('W2', 'flexible kanban boards'),
        ('A5', 'automated stand-up reporting'),
        ('L3', 'designed to provide useful functionality independently'),
        ('L3', 'shared organisational structures, user management, permissions and platform services'),
        ('L8', 'apps on demand'),
    ]),
    ('GW', ZEDX + 'GroupWorkStreams/Index.html', [
        ('W1', 'each representing a functional area, service, or operational activity'),
        ('W1', 'grouping related workstreams by department, function or business activity'),
        ('W2', 'create and manage independent kanban boards, each with its own work items, workflow stages, team members'),
        ('W3', 'without the overhead of formal project management or agile ceremonies'),
        ('W3', 'administrative, operational, service and departmental teams'),
        ('W3', 'routine activities and unexpected requests'),
        ('W5', 'set priorities and difficulty points'),
        ('W9', 'high-level progress can be referenced within project portfolios'),
        ('W10', 'simple lists, kanban-style boards, or timeline views'),
        ('W10', 'stages, fields, and priorities can be adapted'),
        ('W11', 'visibility of workload, progress, and bottlenecks across work streams'),
        ('W11', 'without repeatedly requesting updates from individual team members'),
        ('W11', 'without interfering in how teams organise their work'),
        ('W12', 'control access using role-based permissions'),
        ('W12', 'manage team membership and access to individual workstreams'),
        ('W13', 'individual work streams can be linked to the zedx agile sprints application'),
        ('W13', 'without duplicating data'),
        ('W14', 'audit recommendations, governance actions, or control improvement'),
        ('W15', 'zedx study planner'),
        ('W16', 'switch between backlog, current stages, epic and archived views'),
        ('W17', 'create and manage epics to organise related work items'),
        ('W18', 'can group workstreams replace excel spreadsheets used for tracking team activities'),
        ('W18', 'reduces reliance on spreadsheets, email updates and manually maintained task lists'),
        ('W19', 'delayed, blocked or accumulating at particular points in a workflow'),
        ('W20', 'explore workstream information and maintain conversations'),
        ('W20', 'group workstreams benefits from cloe ai'),
    ]),
    ('AS', ZEDX + 'AgileSprints/Index.html', [
        ('A1', 'scrum and sprint-based agile methods'),
        ('A1', 'software development, technology projects and other work using agile methods'),
        ('A2', 'epics and user stories within a prioritised product backlog'),
        ('A2', 'clear relationship between larger requirements and the individual items of work'),
        ('A3', 'visibility of scope, capacity, and sprint goals before work begins'),
        ('A3', 'avoid overcommitting resources'),
        ('A4', 'visualise work using configurable sprint boards'),
        ('A4', 'planned, in progress, blocked or completed'),
        ('A5', 'support daily stand-ups and sprint reviews'),
        ('A6', 'track sprint progress in real time'),
        ('A7', 'manage releases across one or more sprints'),
        ('A7', 'assign stories to planned release versions'),
        ('A8', 'sprint completion, velocity, and carried-over work'),
        ('A9', 'inform teams and encourage learning'),
        ('A9', 'improve estimation accuracy'),
        ('A10', 'control access using role-based permissions'),
        ('A10', 'view-only permissions'),
        ('A11', 'sprint progress is summarised through periodic updates without exposing task-level detail'),
        ('A13', 'each containing multiple workstreams (agile boards)'),
        ('A13', 'manage their own backlogs, sprints and delivery activities'),
        ('A14', 'assign owners, set priorities and delivery dates'),
        ('A14', 'interactive gantt charts'),
        ('A15', 'plan and manage timeboxed sprints'),
        ('A15', 'track velocity targets and actual performance, and formally close completed sprints'),
        ('A16', 'backlog, current sprint, planned sprints, historic sprints, epics and archived views'),
        ('A17', 'identify workstreams requiring management attention'),
        ('A18', 'agile sprints benefits from cloe ai'),
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
        ('P5', 'manage and track project benefits after delivery'),
        ('P6', 'periodic reporting rather than task-level detail'),
        ('P7', 'project management offices (pmos), programme managers and senior leadership teams'),
        ('P8', 'automated reminders help encourage timely reporting and reduce the administrative '
               'effort involved in chasing updates'),
        ('P9', 'financial management capabilities at project, programme and portfolio levels'),
        ('W9', 'project workstreams can be linked to group workstreams'),
    ]),
    ('PLAT', ZEDX + 'Platform/index.html', [
        ('L1', 'microsoft entra id provides single sign-on'),
        ('L2', 'teams can work within their own areas while authorised users retain visibility '
               'across departments, business units or the wider organisation'),
        ('L2', 'role-based access controls and granular permissions'),
        ('L3', 'one login. one user experience.'),
        ('L3', 'applications can be introduced around specific teams or business requirements'),
        ('L4', 'react for its web-based user interfaces, c# and .net for backend processing, '
               'and microsoft sql server'),
        ('L4', 'operates on microsoft azure and uses apis'),
        ('L7', 'enterprise deployments can integrate zedx with existing applications and data sources'),
        ('L7', 'specific integrations are assessed and agreed'),
        ('L8', 'apps on demand'),
        ('L8', 'without separate software development charges'),
        ('L11', 'self-service demo without registering'),
        ('L12', 'trial account without providing a credit card'),
        ('L14', "enterprise can be hosted within the customer's own microsoft azure environment"),
        ('L14', 'other editions are hosted by zedx apps'),
        ('L14', 'greater control over infrastructure, integration and data'),
        ('L15', 'cloe ai, an assistant integrated into the platform using openai technology'),
        ('L15', 'ask questions, obtain guidance, prepare summaries'),
        ('L15', 'available ai capabilities depend on the application and the information accessible to the user'),
        ('L15', 'support productivity and professional judgement rather than replace human '
                'responsibility for important decisions'),
    ]),
    ('ED', ZEDX + 'Editions/index.html', [
        ('L5', 'six editions: home, professional, group, corporate, enterprise and enterprise plus'),
        ('L5', 'users can invite friends and family'),
        ('L5', 'ideally suited to groups of 1-50 users'),
        ('L5', 'ideally suited to 1-50 users'),
        ('L6', 'home, professional and group use per-user subscriptions'),
        ('L6', 'corporate combines user licensing with application-specific usage allowances'),
        ('L6', 'enterprise provides unlimited users, with subscriptions based on the selected '
               'applications and their usage capacity'),
        ('L6', 'enterprise plus removes application usage limits across the portfolio'),
        ('L6', 'a defined number of projects, workstreams or other application-specific units'),
        ('L14', 'home, professional, group and corporate are provided through zedx-hosted services'),
        ('L14', "enterprise and enterprise plus support deployment within the customer's own "
                'microsoft azure subscription or other agreed infrastructure'),
        ('L16 W21', 'currently including cloe ai and group workstreams'),
        ('L16 W21 A19', 'currently including cloe ai, agile sprints and group workstreams'),
        ('L16', 'includes all current and future zedx applications'),
    ]),
    ('TRY', ZEDX + 'Try/index.html', [
        ('L11', 'your demo account is created automatically'),
        ('L12', 'simple registration wizard'),
        ('L12', 'choose the applications you want to explore'),
        ('L12', 'no credit card required. available from nov 2026.'),
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
