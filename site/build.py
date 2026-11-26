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
    ('Electrics', ['EV charger', 'Sockets', 'Downlights', 'Extractor fan']),
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


import time
VERSION = str(int(time.time()))


def asset(name, depth):
    return '../' * depth + 'assets/' + name + '?v=' + VERSION


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


H3_ROOMS = [
    ('Front garden', ['EV charger & car', 'Front path', 'Front wall & gate', 'Bike & bin store (bins and bike inside)', 'Front door', 'Guttering']),
    ('Hall & stairs', ['Victorian hall tiles', 'Staircase', 'Banister & spindles', 'Stair nosing', 'Stair carpet', 'Understairs cloakroom (toilet & basin)', 'Internal doors', 'Fuse board (consumer unit)', 'Radiator', 'Skirting & architraves']),
    ('Living room', ['Wood flooring', 'Alcove units', 'Decorating – plastering & painting', 'Radiator', 'Sockets', 'Downlights']),
    ('Kitchen', ['Full kitchen', 'Worktops', 'Kitchen sink', 'Kitchen tap', 'Washing machine', 'Dishwasher', 'Fridge freezer', 'Oven', 'Hob', 'Cooker hood', 'Splashback tiles', 'Kitchen island', 'Boiler & central heating', 'French doors']),
    ('Bathroom', ['Bath', 'Walk-in shower', 'Toilet', 'Basin & vanity unit', 'Taps', 'Mirror cabinet', 'Heated towel rail', 'Extractor fan', 'Bathroom tiles']),
    ('Bedrooms', ['Fitted wardrobes', 'Carpet', 'Internal doors', 'Sockets', 'Downlights']),
    ('Loft room', ['Loft staircase', 'Roof windows', 'En-suite', 'Shower', 'Eaves storage', 'Carpet']),
    ('Rear garden', ['Patio', 'Decking', 'Fencing', 'Shed / garden room', 'Outside tap', 'Outdoor socket']),
]


def render_3d(mode):
    depth = 1
    link_js = "s => '../' + s + '/index.html'" if mode == 'preview' else "s => '../' + s + '/'"
    robots = '<meta name="robots" content="noindex, nofollow">' if NOINDEX else ''
    rooms = ''.join(f'<div><h3>{r}</h3><ul>' + ''.join(f'<li>{i}</li>' for i in items) + '</ul></div>' for r, items in H3_ROOMS)
    return f"""<!DOCTYPE html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Walk Through Our House in 3D – Everything We Fit | We Fitt</title>
<meta name="description" content="Walk round a house in 3D and tap anything – kitchens, bathrooms, stairs, doors, floors, gardens – to see what we fit across Fulham, Hammersmith, Kensington and Chelsea.">
<link rel="canonical" href="{SITE}/3d-house/">
{robots}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<style>
:root{{--bg:#141414;--ink:#F2EEE8;--muted:#B8B1A7;--copper:#C9874A;--go:#1F7A4D;--panel:#201E1B;--line:#3A3631}}
*{{box-sizing:border-box;min-width:0}}
html,body{{margin:0;background:var(--bg);color:var(--ink);font:16px/1.5 Inter,system-ui,sans-serif}}
a{{color:var(--copper)}}
.h3-bar{{height:58px;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:0 16px;border-bottom:1px solid #2A2724}}
.h3-logo{{color:var(--ink);text-decoration:none;font-family:"Space Grotesk",sans-serif;font-weight:700;font-size:24px;white-space:nowrap}}
.h3-logo span{{color:var(--go)}}
.h3-bar .btn{{display:inline-flex;align-items:center;min-height:42px;padding:8px 16px;border-radius:999px;font-weight:600;font-size:15px;text-decoration:none;white-space:nowrap}}
.btn-go{{background:var(--go);color:#fff}} .btn-line{{border:1.5px solid var(--ink);color:var(--ink)}}
#h3-stage{{position:relative;height:calc(100vh - 58px);height:calc(100dvh - 58px);overflow:hidden;background:#c9dbe8}}
#h3-stage canvas{{display:block;width:100%;height:100%;cursor:grab}}
#h3-loading{{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;text-align:center;padding:24px;color:#2a2d30;font-weight:600;font-size:18px}}
#h3-rooms{{position:absolute;left:0;right:0;top:0;display:flex;gap:8px;overflow-x:auto;padding:12px;scrollbar-width:none}}
#h3-rooms::-webkit-scrollbar{{display:none}}
#h3-rooms button{{flex:none;min-height:40px;padding:8px 14px;border-radius:999px;border:0;background:rgba(20,20,20,.78);color:#fff;font:inherit;font-size:14px;font-weight:600;cursor:pointer;backdrop-filter:blur(6px)}}
#h3-rooms button:hover{{background:var(--go)}}
.h3-hint{{position:absolute;left:50%;bottom:16px;transform:translateX(-50%);background:rgba(20,20,20,.72);color:#fff;padding:8px 16px;border-radius:999px;font-size:14px;white-space:nowrap;pointer-events:none}}
.h3-cross{{position:absolute;left:50%;top:50%;width:6px;height:6px;margin:-3px 0 0 -3px;border-radius:50%;background:rgba(255,255,255,.85);box-shadow:0 0 0 2px rgba(0,0,0,.25);pointer-events:none}}
#h3-joy{{position:absolute;left:22px;bottom:70px;width:120px;height:120px;border-radius:50%;background:rgba(20,20,20,.35);border:2px solid rgba(255,255,255,.55);display:none;touch-action:none}}
#h3-knob{{position:absolute;left:50%;top:50%;width:50px;height:50px;margin:-25px 0 0 -25px;border-radius:50%;background:rgba(255,255,255,.85);pointer-events:none}}
@media (pointer:coarse){{#h3-joy{{display:block}} .h3-keys{{display:none}}}}
@media (pointer:fine){{.h3-touch{{display:none}}}}
#h3-panel{{position:absolute;right:16px;bottom:16px;width:min(380px,calc(100% - 32px));background:var(--panel);border:1px solid var(--line);border-radius:20px;padding:22px;box-shadow:0 20px 50px rgba(0,0,0,.45);transform:translateY(20px);opacity:0;pointer-events:none;transition:transform .25s,opacity .25s}}
#h3-panel.open{{transform:none;opacity:1;pointer-events:auto}}
#h3-panel h2{{font-family:"Space Grotesk",sans-serif;font-size:26px;margin:0 40px 6px 0;line-height:1.1}}
.h3-price{{display:inline-block;background:var(--go);color:#fff;font-weight:700;border-radius:999px;padding:6px 14px;font-size:16px;margin:6px 0 10px}}
.h3-price.ask{{background:#2C2925;color:#E4DED5}}
#h3-panel p{{color:#D6D0C7;margin:0 0 16px;font-size:15px}}
#h3-panel .row{{display:flex;gap:8px;flex-wrap:wrap}}
#h3-panel .row a{{flex:1 1 140px;justify-content:center;display:inline-flex;align-items:center;min-height:46px;border-radius:999px;font-weight:600;text-decoration:none;font-size:15px}}
.h3-close{{position:absolute;right:10px;top:10px;width:44px;height:44px;border:0;background:none;color:var(--muted);font-size:26px;cursor:pointer}}
@media (max-width:600px){{#h3-panel{{left:12px;right:12px;width:auto;bottom:12px}} .h3-bar .btn-line{{display:none}} #h3-joy{{bottom:60px}}}}
.h3-list{{max-width:1240px;margin:0 auto;padding:56px 24px 80px}}
.h3-list h2{{font-family:"Space Grotesk",sans-serif;font-size:clamp(28px,4vw,44px);margin:0 0 10px}}
.h3-list .grid{{display:grid;gap:20px;grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr));margin-top:28px}}
.h3-list h3{{font-family:"Space Grotesk",sans-serif;margin:0 0 8px;color:var(--copper)}}
.h3-list ul{{margin:0;padding-left:18px;color:#D6D0C7}}
</style>
</head>
<body>
<header class="h3-bar">
<a class="h3-logo" href="{href('', depth, mode)}">We Fitt<span>…</span></a>
<div style="display:flex;gap:8px">
<a class="btn btn-line" href="{href('', depth, mode)}">Back to the website</a>
<a class="btn btn-go" href="tel:{TEL}">Call {PHONE}</a>
</div>
</header>
<main>
<h1 style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">Walk through our house in 3D and see everything we fit</h1>
<div id="h3-stage">
<div id="h3-loading">Loading the house…</div>
<nav id="h3-rooms" aria-label="Jump to a room"></nav>
<div class="h3-cross" aria-hidden="true"></div>
<div id="h3-joy" aria-label="Walk"><div id="h3-knob"></div></div>
<div class="h3-hint"><span class="h3-keys">Drag to look · W A S D or arrows to walk · scroll to zoom · click anything, doors open</span><span class="h3-touch">Drag to look · pinch to zoom · tap anything</span></div>
<aside id="h3-panel" aria-live="polite">
<button class="h3-close" type="button" aria-label="Close">×</button>
<h2>Item</h2>
<span class="h3-price">Ask us for a price</span>
<p></p>
<div class="row"><a class="h3-more btn-line" href="#">What's involved</a><a class="h3-wa btn-go" href="#">Talk to us on WhatsApp</a></div>
</aside>
</div>
<section class="h3-list">
<h2>Everything in this house, we fit</h2>
<p style="color:#D6D0C7;max-width:62ch">Walk round the house above and tap anything to see what's involved. Or browse it room by room here. Same team, from the shop at 287 Munster Road, Fulham.</p>
<div class="grid">{rooms}</div>
</section>
</main>
<script src="{asset('prices.js', depth)}"></script>
<script>window.WEFITT_LINK = {link_js};</script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script src="{asset('house3d.js', depth)}"></script>
</body>
</html>
"""


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
    os.makedirs(os.path.join(out, '3d-house'), exist_ok=True)
    with open(os.path.join(out, '3d-house', 'index.html'), 'w') as f:
        f.write(render_3d(mode))
    if mode == 'dist':
        with open(os.path.join(out, 'robots.txt'), 'w') as f:
            f.write('User-agent: *\n' + ('Disallow: /\n' if NOINDEX else 'Allow: /\n') + f'Sitemap: {SITE}/sitemap.xml\n')
        urls = ''.join(f'<url><loc>{SITE}/{p["slug"] + "/" if p["slug"] else ""}</loc></url>' for p in PAGES if p['slug'] != '404') + f'<url><loc>{SITE}/3d-house/</loc></url>'
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
