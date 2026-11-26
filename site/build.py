#!/usr/bin/env python3
"""We Fitt site builder.

Writes plain static HTML pages into ../dist (clean URLs, for GitHub Pages)
and ../preview (index.html links, for the draft preview).
Run:  python3 build.py
"""
import json, os, re, shutil
from pages_content import PAGES, CATEGORIES, ITEMS, ROOMS
from pages_items import ITEM_PAGES
PAGES = PAGES + ITEM_PAGES

SITE = 'https://www.wefitt.uk'
PHONE = '020 7386 0000'
TEL = '+442073860000'
WA = 'https://wa.me/442073860000'
ADDRESS = '287 Munster Road, Fulham, London SW6 6BW'
# Keep the draft out of Google until launch day. Set to False to go live.
NOINDEX = True

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)

PICKER_JOBS = [
    ('The big jobs', ['Kitchen fitting', 'Bathroom fitting', 'En-suite fitting']),
    ('Doors & joinery', ['Internal doors', 'Front or back door', 'Staircase', 'Skirting & architraves', 'Fitted wardrobes', 'Worktops']),
    ('Windows', ['Loft or roof window', 'Skylight']),
    ('Outside', ['Bike or bin store', 'Fencing & gates', 'Decking', 'Shed or summer house', 'Patio', 'Guttering']),
    ('Plumbing & bathroom', ['Taps', 'Toilet', 'Shower', 'Basin or sink', 'Radiator or towel rail', 'Mirror or cabinet', 'Appliance fitting']),
    ('Floors, walls & tiling', ['Tiling', 'Flooring', 'Stud wall', 'Plastering']),
    ('Electrics', ['Sockets', 'Downlights', 'Extractor fan']),
]

NAV = [
    ('Kitchens', 'kitchen-fitting-fulham'),
    ('Bathrooms', 'bathroom-fitting-fulham'),
    ('En-suites', 'en-suite-fitting-fulham'),
    ('What we fit', '#building'),
    ('Visit us', 'contact'),
]


def href(target, depth, mode):
    """Link from a page `depth` folders deep to `target` (a slug, '' for home, or 'slug#anchor')."""
    if target.startswith(('http', 'tel:')):
        return target
    anchor = ''
    if '#' in target:
        target, anchor = target.split('#', 1)
        anchor = '#' + anchor
    up = '../' * depth
    if target == '':
        if mode == 'preview':
            return up + 'index.html' + anchor
        return (up or './') + anchor if not (anchor and depth == 0) else anchor
    return up + target + ('/index.html' if mode == 'preview' else '/') + anchor


def asset(name, depth):
    return '../' * depth + 'assets/' + name


def schema(page):
    base = {
        '@context': 'https://schema.org',
        '@type': 'HomeAndConstructionBusiness',
        'name': 'We Fitt',
        'legalName': 'En-Suites & Bathrooms Ltd',
        'url': SITE + '/',
        'telephone': TEL,
        'address': {'@type': 'PostalAddress', 'streetAddress': '287 Munster Road', 'addressLocality': 'London',
                    'addressRegion': 'Fulham', 'postalCode': 'SW6 6BW', 'addressCountry': 'GB'},
        'openingHoursSpecification': [
            {'@type': 'OpeningHoursSpecification', 'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], 'opens': '07:00', 'closes': '20:00'},
            {'@type': 'OpeningHoursSpecification', 'dayOfWeek': 'Saturday', 'opens': '08:00', 'closes': '18:00'},
            {'@type': 'OpeningHoursSpecification', 'dayOfWeek': 'Sunday', 'opens': '10:00', 'closes': '18:00'},
        ],
        'areaServed': ['Fulham', 'Hammersmith', 'Kensington', 'Chelsea', 'Parsons Green', 'Putney', 'Wandsworth', 'West Kensington', "Earl's Court", 'Barons Court'],
    }
    out = [base]
    if page.get('faqs'):
        out.append({'@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
            {'@type': 'Question', 'name': q, 'acceptedAnswer': {'@type': 'Answer', 'text': re.sub('<[^>]+>', '', a)}}
            for q, a in page['faqs']]})
    if page.get('crumbs'):
        items = [{'@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': SITE + '/'}]
        for i, (name, slug) in enumerate(page['crumbs'], start=2):
            items.append({'@type': 'ListItem', 'position': i, 'name': name, 'item': SITE + '/' + slug + '/'})
        out.append({'@context': 'https://schema.org', '@type': 'BreadcrumbList', 'itemListElement': items})
    return '\n'.join('<script type="application/ld+json">' + json.dumps(s, ensure_ascii=False) + '</script>' for s in out)


def header(page, depth, mode):
    links = []
    for label, t in NAV:
        cur = ' aria-current="page"' if t == page['slug'] else ''
        links.append(f'<a href="{href(t, depth, mode)}"{cur}>{label}</a>')
    return f'''<a class="sr-only" href="#main">Skip to content</a>
<header class="site-head">
<div class="wrap head-in">
<a class="logo" href="{href('', depth, mode)}" aria-label="We Fitt, En-Suites and Bathrooms, Kitchens – home">
<b>We Fitt<span>…</span></b><span class="l2">En-Suites &amp; Bathrooms</span><span class="l3">Kitchens</span>
</a>
<nav class="nav" id="nav" aria-label="Main">{''.join(links)}</nav>
<div class="head-cta">
<a class="btn btn-go" href="tel:{TEL}">Call {PHONE}</a>
<button class="menu-btn" aria-controls="nav" aria-expanded="false" aria-label="Menu">☰</button>
</div>
</div>
</header>'''


def picker():
    groups = ''.join(
        f'<div class="group"><b>{g}</b><div class="seg">' + ''.join(f'<button type="button" data-job="{j}" aria-pressed="false">{j}</button>' for j in jobs) + '</div></div>'
        for g, jobs in PICKER_JOBS)
    return f'''<button class="btn btn-go picker-fab" data-picker="">What needs fitting?</button>
<div class="picker" id="picker" role="dialog" aria-modal="false" aria-labelledby="pk-title">
<button class="x" type="button" aria-label="Close">×</button>
<h2 id="pk-title">What needs fitting?</h2>
<p class="muted" style="margin-top:6px;font-size:15px">Tap everything you need. We'll open WhatsApp with your message ready to send.</p>
<form novalidate>
{groups}
<label for="pk-postcode">Your postcode</label>
<input id="pk-postcode" autocomplete="postal-code" placeholder="SW6 6BW">
<label for="pk-note">Anything else? <span class="muted" style="font-weight:400">(optional)</span></label>
<input id="pk-note" placeholder="I've already bought the doors">
<p class="err" role="alert"></p>
<button class="btn btn-go" type="submit" style="width:100%;margin-top:6px">Send on WhatsApp</button>
<p class="alt">Rather call? <a href="tel:{TEL}">{PHONE}</a> · WhatsApp {PHONE}</p>
</form>
</div>'''


def footer(depth, mode):
    cats = ''.join(f'<li><a href="{href(c["slug"], depth, mode)}">{c["name"]}</a></li>' for c in CATEGORIES)
    return f'''<section class="contact-band" aria-labelledby="cb-title">
<div class="wrap band row" style="justify-content:space-between;gap:24px">
<h2 id="cb-title" class="h-l">What needs fitting?</h2>
<div class="row">
<a class="btn btn-dark" href="tel:{TEL}">Call {PHONE}</a>
<button class="btn btn-line" data-picker="">WhatsApp us</button>
</div>
</div>
</section>
<footer class="site-foot">
<div class="wrap">
<div class="foot-grid">
<div>
<a class="logo" href="{href('', depth, mode)}" style="align-items:flex-start"><b>We Fitt<span>…</span></b></a>
<p style="margin-top:14px">{ADDRESS}<br><a href="tel:{TEL}">{PHONE}</a></p>
<p style="margin-top:10px">Mon–Fri 7am–8pm<br>Sat 8am–6pm · Sun 10am–6pm</p>
</div>
<div><h3>The big jobs</h3><ul>
<li><a href="{href('kitchen-fitting-fulham', depth, mode)}">Kitchen fitting</a></li>
<li><a href="{href('bathroom-fitting-fulham', depth, mode)}">Bathroom fitting</a></li>
<li><a href="{href('en-suite-fitting-fulham', depth, mode)}">En-suite fitting</a></li>
<li><a href="{href('bike-and-bin-stores', depth, mode)}">Bike &amp; bin stores</a></li>
</ul></div>
<div><h3>Building &amp; fitting</h3><ul>{cats}</ul></div>
<div><h3>We Fitt</h3><ul>
<li><a href="{href('about', depth, mode)}">About us</a></li>
<li><a href="{href('contact', depth, mode)}">Visit the shop</a></li>
<li><a href="{href('privacy', depth, mode)}">Privacy</a></li>
</ul></div>
</div>
<p class="legal">We Fitt is a trading name of En-Suites &amp; Bathrooms Ltd, {ADDRESS}. For full design-and-build renovations, visit <a href="https://www.en-suite.co.uk">en-suite.co.uk</a>. © <span class="year">2026</span></p>
</div>
</footer>'''


def render(page, mode):
    slug = page['slug']
    depth = 0 if slug == '' else slug.count('/') + 1
    body = page['body']
    # resolve internal links written as {{link:slug}} and {{link:slug#anchor}}
    def repl(m):
        t = m.group(1)
        if '#' in t and not t.startswith('#'):
            s, a = t.split('#', 1)
            return href(s, depth, mode) + '#' + a
        return href(t, depth, mode)
    body = re.sub(r'\{\{link:([^}]*)\}\}', repl, body)
    body = body.replace('{{PHONE}}', PHONE).replace('{{TEL}}', TEL).replace('{{WA}}', WA)
    canonical = SITE + '/' + (slug + '/' if slug else '')
    robots = '<meta name="robots" content="noindex, nofollow">' if NOINDEX else ''
    extra = page.get('extra_head', '')
    return f'''<!DOCTYPE html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{page['title']}</title>
<meta name="description" content="{page['description']}">
<link rel="canonical" href="{canonical}">
{robots}
<meta property="og:title" content="{page['title']}">
<meta property="og:description" content="{page['description']}">
<meta property="og:url" content="{canonical}">
<meta property="og:type" content="website">
<meta name="theme-color" content="#141414">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="{asset('site.css', depth)}">
{schema(page)}
{extra}
</head>
<body>
{header(page, depth, mode)}
<main id="main">
{body}
</main>
{footer(depth, mode)}
{picker()}
<script src="{asset('site.js', depth)}"></script>
</body>
</html>
'''


def build(mode):
    out = os.path.join(ROOT, 'docs' if mode == 'dist' else 'preview')
    if os.path.exists(out):
        shutil.rmtree(out)
    os.makedirs(out)
    shutil.copytree(os.path.join(HERE, 'assets'), os.path.join(out, 'assets'))
    for page in PAGES:
        d = os.path.join(out, page['slug']) if page['slug'] else out
        os.makedirs(d, exist_ok=True)
        with open(os.path.join(d, 'index.html'), 'w') as f:
            f.write(render(page, mode))
    if mode == 'dist':
        with open(os.path.join(out, 'robots.txt'), 'w') as f:
            f.write('User-agent: *\n' + ('Disallow: /\n' if NOINDEX else 'Allow: /\n') + f'Sitemap: {SITE}/sitemap.xml\n')
        urls = ''.join(f'<url><loc>{SITE}/{p["slug"] + "/" if p["slug"] else ""}</loc></url>' for p in PAGES if p['slug'] != '404')
        with open(os.path.join(out, 'sitemap.xml'), 'w') as f:
            f.write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + urls + '</urlset>\n')
        with open(os.path.join(out, '.nojekyll'), 'w') as f:
            f.write('')
        with open(os.path.join(out, 'CNAME'), 'w') as f:
            f.write('www.wefitt.uk\n')
    return out


if __name__ == '__main__':
    for m in ('dist', 'preview'):
        print('built', build(m))
