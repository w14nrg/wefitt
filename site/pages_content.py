# Page content for the We Fitt site. Every page's wording is unique to that page.
# Internal links: {{link:slug}}  ·  phone: {{PHONE}} {{TEL}}

CATEGORIES = [
    {'name': 'Doors & joinery', 'slug': 'doors-joinery', 'parts': [
        ('Internal doors', 'doors-joinery/internal-door-fitting'), ('Front & back doors', 'doors-joinery/external-door-fitting'),
        ('Staircases & balustrades', 'doors-joinery/staircases'), ('Skirting & architraves', 'doors-joinery/skirting-architraves'),
        ('Fitted wardrobes', 'doors-joinery/fitted-wardrobes'), ('Worktops', 'doors-joinery/worktop-fitting')]},
    {'name': 'Loft windows & windows', 'slug': 'loft-windows', 'parts': [
        ('Loft & roof windows', 'loft-windows/roof-window-fitting'), ('Skylights', 'loft-windows/skylights')]},
    {'name': 'Outside', 'slug': 'outside', 'parts': [
        ('Bike & bin stores', 'bike-and-bin-stores'), ('Fencing & gates', 'outside/fencing-gates'), ('Decking', 'outside/decking'),
        ('Sheds & summer houses', 'outside/sheds-summer-houses'), ('Patios', 'outside/patios'), ('Guttering', 'outside/guttering')]},
    {'name': 'Plumbing & bathroom fittings', 'slug': 'plumbing-fittings', 'parts': [
        ('Taps', 'plumbing-fittings/tap-fitting'), ('Toilets', 'plumbing-fittings/toilet-fitting'), ('Showers', 'plumbing-fittings/shower-fitting'),
        ('Basins & sinks', 'plumbing-fittings/basins-sinks'), ('Radiators & towel rails', 'plumbing-fittings/radiators-towel-rails'),
        ('Mirrors & cabinets', 'plumbing-fittings/mirrors-cabinets'), ('Appliance fitting', 'plumbing-fittings/appliance-fitting')]},
    {'name': 'Floors, walls & tiling', 'slug': 'floors-walls-tiling', 'parts': [
        ('Tiling', 'floors-walls-tiling/tiling'), ('Flooring', 'floors-walls-tiling/flooring'),
        ('Stud walls', 'floors-walls-tiling/stud-walls'), ('Plastering', 'floors-walls-tiling/plastering')]},
    {'name': 'Electrics', 'slug': 'electrics', 'parts': [
        ('Sockets', 'electrics/sockets'), ('Downlights', 'electrics/downlights'), ('Extractor fans', 'electrics/extractor-fans'),
        ('EV chargers', 'electrics/ev-chargers')]},
]

ITEMS = {label: slug for c in CATEGORIES for label, slug in c['parts']}

ROOMS = {
    'loft': {'job': 'Loft or roof window', 'title': 'In the loft', 'short': 'loft work', 'text': 'Bring daylight into the top of the house and turn a dark loft into a usable room.',
             'items': ['Loft & roof windows', 'Skylights', 'Stud walls', 'Plastering']},
    'bathroom': {'job': 'Bathroom fitting', 'title': 'In the bathroom', 'short': 'bathroom fitting', 'text': 'A whole new bathroom, or just the one thing that has stopped working.',
                 'items': ['Bathroom fitting', 'Showers', 'Toilets', 'Taps', 'Basins & sinks', 'Mirrors & cabinets', 'Tiling', 'Radiators & towel rails', 'Extractor fans']},
    'bedroom': {'job': 'En-suite fitting', 'title': 'In the bedroom', 'short': 'en-suite fitting', 'text': 'Squeeze a shower room in, or build the storage the room is missing.',
                'items': ['En-suite fitting', 'Fitted wardrobes', 'Flooring', 'Sockets', 'Downlights']},
    'hall': {'job': 'Internal doors', 'title': 'Hall and stairs', 'short': 'door fitting', 'text': 'The first thing anyone sees: doors that close properly, stairs that feel solid, clean joinery.',
             'items': ['Front & back doors', 'Internal doors', 'Staircases & balustrades', 'Skirting & architraves', 'Flooring']},
    'kitchen': {'job': 'Kitchen fitting', 'title': 'In the kitchen', 'short': 'kitchen fitting', 'text': 'Fit the kitchen you have bought, or let us design, supply and fit one for you.',
                'items': ['Kitchen fitting', 'Worktops', 'Appliance fitting', 'Taps', 'Basins & sinks', 'Tiling', 'Sockets', 'Downlights', 'Extractor fans']},
    'garden': {'job': 'Bike or bin store', 'title': 'In the garden', 'short': 'garden work', 'text': 'Tidy away the bins and bikes, and build the outside space properly.',
               'items': ['Bike & bin stores', 'EV chargers', 'Fencing & gates', 'Decking', 'Sheds & summer houses', 'Patios', 'Guttering']},
}
BIG = {'Bathroom fitting': 'bathroom-fitting-fulham', 'Kitchen fitting': 'kitchen-fitting-fulham', 'En-suite fitting': 'en-suite-fitting-fulham'}


def _ph(title, text, h='320px'):
    return f'<div class="ph" role="img" aria-label="Photo to come: {title}" style="min-height:{h}"><strong>{title}</strong><span>{text}</span></div>'


def _faqs(faqs):
    return '<div class="faq">' + ''.join(f'<details><summary>{q}</summary><p>{a}</p></details>' for q, a in faqs) + '</div>'


def _side(title, links, cta_pre):
    lis = ''.join(f'<li><a href="{{{{link:{s}}}}}">{l}</a></li>' for l, s in links)
    return f'''<aside class="side">
<div class="side-box"><h3>Talk to us</h3><p class="muted" style="font-size:15px;margin-bottom:14px">Send a photo on WhatsApp and talk the job through. We'll come and have a look before giving you a price.</p>
<button class="btn btn-go" style="width:100%" data-picker="{cta_pre}">Talk to us on WhatsApp</button>
<a class="btn btn-line" style="width:100%;margin-top:10px" href="tel:{{{{TEL}}}}">Call {{{{PHONE}}}}</a></div>
<div class="side-box"><h3>{title}</h3><ul>{lis}</ul></div>
</aside>'''


def _crumbs(trail):
    parts = ['<a href="{{link:}}">Home</a>'] + [f'<a href="{{{{link:{s}}}}}">{n}</a>' for n, s in trail[:-1]] + [f'<span aria-current="page">{trail[-1][0]}</span>']
    return '<nav class="crumbs wrap" aria-label="Breadcrumb">' + ' / '.join(parts) + '</nav>'


# ---------------- house SVG ----------------
HOUSE_SVG = '''<svg viewBox="0 0 640 500" role="group" aria-label="A house cut open. Choose a room to see what we fit there.">
<rect x="0" y="440" width="640" height="60" fill="#1C2A22"/>
<rect x="0" y="440" width="640" height="6" fill="#2F4A3A"/>
<path d="M26 166 L245 22 L464 166 Z" fill="#3A3631"/>
<rect x="36" y="160" width="418" height="282" fill="#3A3631"/>
<g class="room" data-room="loft" tabindex="0" role="button" aria-pressed="false" aria-label="Loft">
<path class="fill" d="M66 158 L245 44 L424 158 Z" fill="#26231F"/>
<path d="M318 92 L352 114 L340 132 L306 110 Z" fill="#5BA0C8" opacity=".85"/>
<path d="M318 92 L352 114" stroke="#C9874A" stroke-width="3"/>
<rect x="170" y="140" width="60" height="18" fill="#4A453F" rx="2"/>
<text x="245" y="128" text-anchor="middle">Loft</text>
</g>
<g class="room" data-room="bathroom" tabindex="0" role="button" aria-pressed="false" aria-label="Bathroom">
<rect class="fill" x="46" y="168" width="190" height="130" fill="#26231F"/>
<rect x="58" y="262" width="96" height="28" rx="12" fill="#CFC8BE"/>
<rect x="64" y="268" width="84" height="16" rx="8" fill="#9BC7DD"/>
<rect x="196" y="252" width="22" height="38" rx="6" fill="#CFC8BE"/>
<rect x="192" y="240" width="30" height="14" rx="3" fill="#CFC8BE"/>
<rect x="168" y="214" width="20" height="4" fill="#C9874A"/>
<path d="M176 214 v-12 h8" stroke="#C9874A" stroke-width="3" fill="none"/>
<text x="141" y="198" text-anchor="middle">Bathroom</text>
</g>
<g class="room" data-room="bedroom" tabindex="0" role="button" aria-pressed="false" aria-label="Bedroom and en-suite">
<rect class="fill" x="244" y="168" width="200" height="130" fill="#26231F"/>
<rect x="258" y="258" width="104" height="32" rx="4" fill="#6B6259"/>
<rect x="258" y="248" width="30" height="16" rx="4" fill="#CFC8BE"/>
<rect x="378" y="190" width="6" height="108" fill="#4A453F"/>
<rect x="392" y="272" width="44" height="18" rx="2" fill="#CFC8BE"/>
<path d="M414 210 v14 M406 226 h16" stroke="#C9874A" stroke-width="3"/>
<path d="M402 232 l-4 30 M414 232 v30 M426 232 l4 30" stroke="#9BC7DD" stroke-width="2" stroke-dasharray="4 5"/>
<text x="312" y="198" text-anchor="middle">Bedroom</text>
<text x="412" y="198" text-anchor="middle" style="font-size:12px">En-suite</text>
</g>
<g class="room" data-room="hall" tabindex="0" role="button" aria-pressed="false" aria-label="Hall and stairs">
<rect class="fill" x="46" y="306" width="122" height="134" fill="#26231F"/>
<path d="M92 440 h76 v-16 h-14 v-16 h-14 v-16 h-14 v-16 h-14 v-16 h-14 v-16 h-6 z" fill="#6B6259"/>
<path d="M92 342 L168 430" stroke="#C9874A" stroke-width="3"/>
<rect x="52" y="356" width="32" height="84" fill="#1F7A4D"/>
<circle cx="78" cy="400" r="3" fill="#C9874A"/>
<text x="107" y="330" text-anchor="middle">Hall</text>
</g>
<g class="room" data-room="kitchen" tabindex="0" role="button" aria-pressed="false" aria-label="Kitchen">
<rect class="fill" x="176" y="306" width="268" height="134" fill="#26231F"/>
<rect x="196" y="352" width="160" height="26" fill="#4A453F"/>
<rect x="196" y="402" width="236" height="38" fill="#4A453F"/>
<rect x="192" y="396" width="244" height="8" fill="#C9874A"/>
<rect x="300" y="390" width="36" height="6" fill="#CFC8BE"/>
<path d="M318 390 v-14 h10" stroke="#CFC8BE" stroke-width="3" fill="none"/>
<rect x="232" y="390" width="40" height="6" fill="#141414"/>
<path d="M212 352 v-16 h28 v16" fill="#6B6259"/>
<line x1="246" y1="402" x2="246" y2="440" stroke="#26231F" stroke-width="2"/>
<line x1="296" y1="402" x2="296" y2="440" stroke="#26231F" stroke-width="2"/>
<line x1="346" y1="402" x2="346" y2="440" stroke="#26231F" stroke-width="2"/>
<line x1="396" y1="402" x2="396" y2="440" stroke="#26231F" stroke-width="2"/>
<text x="400" y="330" text-anchor="middle">Kitchen</text>
</g>
<g class="room" data-room="garden" tabindex="0" role="button" aria-pressed="false" aria-label="Garden">
<rect class="fill" x="468" y="250" width="166" height="190" fill="#1F2E25" rx="6"/>
<g fill="#6B5A44"><rect x="474" y="372" width="8" height="68"/><rect x="620" y="372" width="8" height="68"/><rect x="474" y="384" width="154" height="6"/><rect x="474" y="414" width="154" height="6"/></g>
<rect x="500" y="356" width="104" height="84" fill="#B98A5A"/>
<g fill="#9C7146"><rect x="504" y="366" width="96" height="5"/><rect x="504" y="380" width="96" height="5"/><rect x="504" y="394" width="96" height="5"/><rect x="504" y="408" width="96" height="5"/><rect x="504" y="422" width="96" height="5"/></g>
<rect x="494" y="346" width="116" height="10" fill="#3A3631"/>
<g fill="#7DB86A"><ellipse cx="502" cy="344" rx="8" ry="6"/><ellipse cx="516" cy="342" rx="8" ry="7"/><ellipse cx="530" cy="344" rx="8" ry="6"/><ellipse cx="544" cy="341" rx="8" ry="7"/><ellipse cx="558" cy="344" rx="8" ry="6"/><ellipse cx="572" cy="342" rx="8" ry="7"/><ellipse cx="586" cy="344" rx="8" ry="6"/><ellipse cx="600" cy="342" rx="8" ry="6"/></g>
<g fill="#C98B6B"><circle cx="522" cy="338" r="3"/><circle cx="566" cy="337" r="3"/><circle cx="594" cy="338" r="3"/></g>
<text x="551" y="282" text-anchor="middle">Garden</text>
</g>
</svg>'''


def rooms_json():
    import json
    out = {}
    for k, r in ROOMS.items():
        items = []
        for label in r['items']:
            slug = BIG.get(label) or ITEMS.get(label)
            items.append([label, '{{link:' + slug + '}}'])
        out[k] = {'job': r['job'], 'title': r['title'], 'short': r['short'], 'text': r['text'], 'items': items}
    return json.dumps(out, ensure_ascii=False)


# ---------------- HOME ----------------
cat_cards = ''.join(
    f'''<a class="cat reveal" href="{{{{link:{c['slug']}}}}}"><h3>{c['name']}</h3><span class="chips">''' +
    ''.join(f'<span class="chip">{l}</span>' for l, _ in c['parts']) +
    '</span><span class="go">See what\'s involved →</span></a>' for c in CATEGORIES)

HOME = {
    'slug': '', 'title': 'Kitchen & Bathroom Fitters in Fulham, Chelsea & Kensington | We Fitt',
    'description': 'Kitchen fitting, bathroom fitting, en-suites, doors, loft windows and bike & bin stores across Fulham, Hammersmith, Kensington and Chelsea, from our shop on Munster Road.',
    'body': f'''
<section class="wrap hero">
<div class="stack" style="gap:22px">
<h1 class="tag">Kitchen fitters &amp; bathroom fitters in Fulham</h1>
<p class="big" aria-hidden="true">We fit<span class="dots"><span>.</span><span>.</span><span>.</span></span><br><span class="rotor"><span class="word" data-words='["kitchens","bathrooms","en-suites","doors","loft windows","bike stores","almost anything"]'>kitchens</span><span class="caret"></span></span></p>
<p class="sr-only">We fit kitchens, bathrooms, en-suites, doors, loft windows, bike stores and almost anything else.</p>
<p class="lead">Bought it already? We'll fit it. Starting from scratch? We'll design, supply and fit it. A new tap or a whole new kitchen across Fulham, Hammersmith, Kensington and Chelsea, it's the same team from the shop on Munster Road.</p>
<div class="row">
<button class="btn btn-go" data-picker="">Talk to us on WhatsApp</button>
<a class="btn btn-line" href="tel:{{{{TEL}}}}">Call {{{{PHONE}}}}</a>
</div>
</div>
{_ph('Shopfront photo', '287 Munster Road. Swap for the new We Fitt sign photo once it is up.', '440px')}
</section>

<section class="band raised" aria-labelledby="house-title">
<div class="wrap">
<div class="stack reveal" style="max-width:720px;margin-bottom:32px">
<p class="kicker">Room by room</p>
<h2 id="house-title" class="h-l">Pick a room. See what we fit.</h2>
</div>
<div class="house-wrap">
<div class="house reveal">{HOUSE_SVG}<p class="house-hint">Tap a room on the house</p></div>
<div class="room-card reveal" aria-live="polite">
<h3 class="h-m">In the kitchen</h3>
<p class="muted" style="margin-top:8px"></p>
<ul></ul>
<button class="btn btn-go room-go" data-picker="Kitchen fitting">Talk to us about this</button>
<a class="btn btn-line" href="{{{{link:3d-house}}}}" style="margin-top:10px">Walk through the house in 3D →</a>
</div>
</div>
</div>
<script type="application/json" id="rooms-data">{rooms_json()}</script>
</section>

<section class="stone band" id="big" aria-labelledby="big-title">
<div class="wrap stack" style="gap:36px">
<div class="stack reveal" style="max-width:720px">
<p class="kicker">The big jobs</p>
<h2 id="big-title" class="h-l">Kitchen, bathroom &amp; en-suite fitting</h2>
<p class="lead">Two ways in, whichever suits you.</p>
</div>
<div class="grid">
<article class="card reveal"><h3>Bathroom fitting</h3><p>Full bathrooms, shower rooms and bath-to-shower swaps.</p>
<p class="route"><strong>Already bought it?</strong> We'll fit the lot.</p><p class="route"><strong>Not yet?</strong> We'll design, supply and fit.</p>
<a class="more" href="{{{{link:bathroom-fitting-fulham}}}}">Bathroom fitting →</a></article>
<article class="card reveal"><h3>Kitchen fitting</h3><p>A flat-pack or showroom kitchen sitting in boxes? We build and fit it, worktops and all.</p>
<p class="route"><strong>Already bought it?</strong> We'll fit it.</p><p class="route"><strong>Not yet?</strong> We'll design, supply and fit.</p>
<a class="more" href="{{{{link:kitchen-fitting-fulham}}}}">Kitchen fitting →</a></article>
<article class="card reveal"><h3>En-suite fitting</h3><p>A shower room squeezed into a bedroom or a box room.</p>
<p class="route"><strong>Already bought it?</strong> We'll fit it.</p><p class="route"><strong>Not yet?</strong> We'll design, supply and fit.</p>
<a class="more" href="{{{{link:en-suite-fitting-fulham}}}}">En-suite fitting →</a></article>
</div>
<div class="renov reveal">
<p style="font-size:18px;max-width:640px">Planning a full renovation from scratch? We do that too, as <a class="inline" href="https://www.en-suite.co.uk">En-Suites &amp; Bathrooms</a>. Same team, same shop.</p>
<button class="btn btn-go" data-picker="Kitchen fitting">Book a free design visit</button>
</div>
</div>
</section>

<section class="wrap band" id="building" aria-labelledby="bf-title" >
<div class="stack reveal" style="max-width:760px;margin-bottom:36px">
<p class="kicker">Building &amp; fitting in Fulham</p>
<h2 id="bf-title" class="h-l">We fit<span style="color:var(--go)">…</span></h2>
<p class="lead">Big or small, inside or out. One team, one call.</p>
</div>
<div class="grid">{cat_cards}</div>
<p class="lead" style="margin-top:28px">Something not on the list? Ask us. If it goes in a home or a garden, chances are we fit it.</p>
</section>

<section class="wrap band" aria-labelledby="ev-title" style="padding-top:0">
<div class="ev-band reveal">
<div class="ev-text stack" style="gap:18px">
<p class="kicker">New at We Fitt</p>
<h2 id="ev-title" class="h-l">EV chargers fitted at home</h2>
<p class="lead">Charge overnight on cheap home electricity. Smart 7kW chargers on their own circuit, on the house wall or on a post by the front wall.</p>
<div class="row"><a class="btn btn-go" href="{{{{link:electrics/ev-chargers}}}}">EV chargers</a><a class="btn btn-line ev-wa" href="https://wa.me/442073860000?text=Hi%20We%20Fitt%2C%20I%27m%20interested%20in%20an%20EV%20charger." rel="noopener">Talk to us on WhatsApp</a></div>
</div>
<div class="ev-draw" aria-hidden="true">
<svg viewBox="0 0 560 300" role="img">
<rect x="300" y="20" width="240" height="210" rx="4" fill="#9a5b43"/>
<g fill="#874d38"><rect x="300" y="20" width="240" height="2"/><rect x="300" y="38" width="240" height="2"/><rect x="300" y="56" width="240" height="2"/><rect x="300" y="74" width="240" height="2"/><rect x="300" y="92" width="240" height="2"/><rect x="300" y="110" width="240" height="2"/><rect x="300" y="128" width="240" height="2"/><rect x="300" y="146" width="240" height="2"/><rect x="300" y="164" width="240" height="2"/><rect x="300" y="182" width="240" height="2"/><rect x="300" y="200" width="240" height="2"/><rect x="300" y="218" width="240" height="2"/></g>
<rect x="330" y="60" width="70" height="90" rx="3" fill="#cfe3ef"/><rect x="333" y="63" width="64" height="40" fill="#e6f1f7"/>
<rect x="440" y="96" width="62" height="134" rx="3" fill="#1f4f3a"/><circle cx="492" cy="166" r="4" fill="#C9874A"/>
<rect x="420" y="40" width="102" height="14" fill="#e9e1d4"/>
<rect x="0" y="230" width="560" height="10" fill="#b9b2a6"/><rect x="0" y="240" width="560" height="26" fill="#8d877d"/><rect x="0" y="266" width="560" height="34" fill="#3d3f42"/>
<rect x="280" y="200" width="280" height="30" fill="#8d5a46"/>
<rect x="300" y="150" width="12" height="80" rx="2" fill="#2b2d30"/><rect x="292" y="132" width="28" height="40" rx="6" fill="#f2f2ef"/>
<circle class="ev-led" cx="306" cy="150" r="7" fill="none" stroke="#3ddc84" stroke-width="3"/>
<path class="ev-cable" d="M306 172 L306 236 L306 252 C 306 262, 250 262, 232 250" fill="none" stroke="#3ddc84" stroke-width="5" stroke-linecap="round"/>
<rect x="296" y="244" width="20" height="6" fill="#2b2d30"/>
<g class="ev-car">
<path d="M20 252 L30 214 Q40 196 70 192 L120 170 Q140 162 170 162 L220 162 Q246 164 260 190 L272 214 L272 252 Z" fill="#2d4b6b"/>
<path d="M108 192 L132 172 Q144 168 160 168 L200 168 Q220 168 232 190 Z" fill="#cfe3ef"/>
<rect x="150" y="168" width="5" height="24" fill="#2d4b6b"/>
<circle cx="78" cy="256" r="24" fill="#1d1e20"/><circle cx="78" cy="256" r="11" fill="#b9bfc4"/>
<circle cx="220" cy="256" r="24" fill="#1d1e20"/><circle cx="220" cy="256" r="11" fill="#b9bfc4"/>
<rect x="22" y="222" width="20" height="7" rx="3" fill="#fff6d8"/><rect x="262" y="220" width="10" height="9" rx="2" fill="#d0473b"/>
<rect x="226" y="236" width="10" height="10" rx="2" fill="#3ddc84"/>
</g>
<g class="ev-batt" transform="translate(120 70)"><rect x="0" y="0" width="80" height="36" rx="7" fill="none" stroke="#E6F0E9" stroke-width="3"/><rect x="80" y="11" width="6" height="14" rx="2" fill="#E6F0E9"/><rect class="ev-fill" x="5" y="5" width="70" height="26" rx="4" fill="#3ddc84"/></g>
</svg>
</div>
<div class="ev-extra"><div class="ticks">
<p><strong>Driveway or front garden</strong>On the house wall or a post, with the cable kept tidy.</p>
<p><strong>Street parking?</strong>Pavement cable channels, where your council allows them.</p>
<p><strong>Grants checked</strong>We'll tell you if a government grant could apply.</p>
<p><strong>Paperwork done</strong>Tested, certified, notified and set up on the app.</p>
</div></div>
</div>
</section>

<section class="wrap band" aria-labelledby="stores-title" style="padding-top:0">
<div class="garden garden-grid reveal">
<div class="g-text stack" style="gap:20px">
<p class="kicker">New at We Fitt</p>
<h2 id="stores-title" class="h-l">Bike &amp; bin stores with a living roof</h2>
<p class="lead" style="color:#D6D0C7">Hide the wheelie bins and lock the bikes away, with a roof of growing sedum on top. Built to measure for Fulham front and back gardens.</p>
</div>
<div class="mini-store g-draw" data-store>
<div class="stage"><svg viewBox="0 0 520 300" role="img" aria-label="Drawing of a bike and bin store"></svg></div>
<div class="row" style="justify-content:center;gap:16px;margin-top:14px">
<div class="seg" data-key="roof" aria-label="Roof"><button data-v="Green sedum roof" aria-pressed="true">Green roof</button><button data-v="Plain roof" aria-pressed="false">Plain roof</button></div>
<div class="seg" data-key="mix" aria-label="What goes in it"><button data-v="Bikes" aria-pressed="false">Bikes</button><button data-v="Bins" aria-pressed="false">Bins</button><button data-v="Both" aria-pressed="true">Both</button></div>
</div>
</div>
<div class="g-extra stack" style="gap:20px"><div class="ticks">
<p><strong>Built to measure</strong>Made on site to fit your space.</p>
<p><strong>Bikes, bins or both</strong>Lockable doors, room for what you need.</p>
<p><strong>Green roof option</strong>Sedum planting that softens the look.</p>
<p><strong>Planning checked</strong>We check what your street needs first.</p>
</div>
<div class="row"><a class="btn btn-go" href="{{{{link:bike-and-bin-stores}}}}">Design your store</a></div>
</div>
</div>
</section>

<section class="raised band" aria-label="How it works">
<div class="wrap steps">
<div class="reveal"><span class="n">1</span><h3>Talk to us</h3><p>WhatsApp a picture of the job, call, or pop into the shop.</p></div>
<div class="reveal"><span class="n">2</span><h3>We come and look</h3><p>We visit, measure up and give you a proper price.</p></div>
<div class="reveal"><span class="n">3</span><h3>We fit it</h3><p>Our own team, the same people from the shop.</p></div>
</div>
</section>

<section class="wrap band" aria-labelledby="visit-title">
<div class="hero" style="padding:0">
<div class="stack reveal">
<h2 id="visit-title" class="h-l">Pop into the shop</h2>
<p class="lead">287 Munster Road, Fulham, London SW6 6BW</p>
<p class="muted">Mon–Fri 7am–8pm · Sat 8am–6pm · Sun 10am–6pm</p>
<p class="muted">Covering Fulham, Hammersmith, Kensington, Chelsea and the areas around them: Parsons Green, Putney, Wandsworth, West Kensington, Earl's Court and Barons Court.</p>
<div class="row"><a class="btn btn-line" href="https://www.google.com/maps/search/?api=1&amp;query=287+Munster+Road+London+SW6+6BW">Open in Google Maps</a></div>
</div>
{_ph('Map of Munster Road', 'A simple drawn map of the shop and nearby streets goes here.', '320px')}
</div>
</section>
'''}

# ---------------- KITCHEN ----------------
KITCHEN_FAQ = [
    ('Will you fit a kitchen I bought from IKEA, Howdens or online?', 'Yes. Most of our kitchen work is fitting kitchens customers have already bought. IKEA wall cabinets hang on a steel suspension rail, Howdens and most trade kitchens come as rigid built units, and online flat-pack is assembled on site. Each needs a slightly different approach, and we have fitted them all.'),
    ('Do you take the old kitchen out?', 'Yes, stripping out the old kitchen is part of the job. Tell us if you want anything kept, such as an appliance you are reusing.'),
    ('Who templates stone or quartz worktops?', 'Stone and quartz are measured by the worktop company once the base units are fitted and level, then made and fitted by them a week or two later. We get the units ready for the template visit and fit everything around the tops.'),
    ('Can you move the sink or the cooker?', 'Usually, yes. Moving a sink means re-running the water and the waste, and the waste needs a fall back to the drain. Moving a cooker can mean a new circuit. We check both at the survey.'),
    ('Do I need to be in?', 'Only at the start and the end, and for any decisions on the day. Plenty of customers leave us a key.'),
]
KITCHEN = {
    'slug': 'kitchen-fitting-fulham', 'title': 'Kitchen Fitters Fulham, Hammersmith, Chelsea & Kensington | We Fitt',
    'description': 'Kitchen fitters in Fulham, Hammersmith, Kensington and Chelsea. We fit IKEA, Howdens, Wickes and online kitchens, or design, supply and fit. Shop on Munster Road.',
    'faqs': KITCHEN_FAQ, 'crumbs': [('Kitchen fitting', 'kitchen-fitting-fulham')],
    'body': _crumbs([('Kitchen fitting', 'kitchen-fitting-fulham')]) + f'''
<section class="wrap hero" style="padding-top:28px">
<div class="stack" style="gap:20px">
<p class="kicker">Kitchen fitting · Fulham, Hammersmith, Kensington &amp; Chelsea</p>
<h1 class="h-xl">Kitchen fitters in Fulham</h1>
<p class="lead">Got a kitchen sitting in boxes? We build it, fit it and finish it, worktops and all. Haven't bought one yet? We'll design, supply and fit it for you.</p>
<div class="row"><button class="btn btn-go" data-picker="Kitchen fitting">Talk to us on WhatsApp</button><a class="btn btn-line" href="tel:{{{{TEL}}}}">Call {{{{PHONE}}}}</a></div>
</div>
{_ph('Finished kitchen photo', 'A kitchen we have fitted goes here.', '400px')}
</section>
<div class="wrap article band" style="padding-top:24px">
<div class="prose">
<div class="facts">
<div><b>Any make</b><span>IKEA, Howdens, Wickes, B&amp;Q, Magnet, online</span></div>
<div><b>Worktops</b><span>Cut, jointed and sealed on site</span></div>
<div><b>Plumbing &amp; electrics</b><span>Moved and connected by our own team</span></div>
<div><b>Old kitchen</b><span>Stripped out first</span></div>
</div>

<h2>What's involved in fitting a kitchen</h2>
<p>A kitchen looks simple on the plan. The work is in making flat, square units sit perfectly in a room that usually isn't. This is how we do it.</p>
<h3>1. Survey and measure</h3>
<p>We check your kitchen plan against the real room. Walls in London houses are rarely straight, floors are rarely level, and the pipes and sockets are rarely where the plan assumes. Finding that out before the fit day is what stops gaps, odd filler panels and units that won't fit.</p>
<h3>2. Strip out and prepare</h3>
<p>The old kitchen comes out, the water and power are made safe, and the walls are made good. If the floor needs levelling or the walls need plastering, it happens now, while the room is empty.</p>
<h3>3. First fix: pipes, waste and power</h3>
<p>Water and waste pipes are moved to where the new sink, dishwasher and washing machine will sit. New sockets and circuits go in for the appliances, and the extractor duct is run to the outside wall.</p>
<h3>4. Build and hang the units</h3>
<p>Base units are set on adjustable legs and levelled across the whole run. Wall units are fixed into solid brick or timber, not just plasterboard. Where a unit meets a crooked wall, the filler panel is scribed to the wall's shape so there is no gap.</p>
<h3>5. Worktops</h3>
<p>Laminate and wood worktops are cut and jointed on site, with every cut edge sealed so water can't swell the core. Solid wood is oiled before it goes down. Stone and quartz are measured by the worktop company once the units are in, then made and fitted by them.</p>
<h3>6. Sink, tap and appliances</h3>
<p>The sink and tap go in and are connected and tested. Integrated appliances are fitted into their housings and their doors are lined up with the kitchen doors. A gas hob or cooker must be connected by a Gas Safe registered engineer by law.</p>
<h3>7. Finish</h3>
<p>Plinths, end panels and cornice go on, the doors and drawers are adjusted until the gaps are even, and the splashback or tiles go up. Then everything is sealed, cleaned and checked with you.</p>

<div class="check">
<h3>Bought your kitchen already? Check these first</h3>
<ul>
<li><strong>Check the delivery against the order</strong> before the fit day. A missing hinge pack or panel can stop the job for days.</li>
<li><strong>Keep flat-pack boxes dry and flat.</strong> Chipboard carcasses swell if they get damp in a shed or garage.</li>
<li><strong>Know which appliances you're using.</strong> Integrated appliances need the right size housing, and the fitting instructions help.</li>
<li><strong>Decide on the worktop early.</strong> Stone takes a week or two after the template visit.</li>
<li><strong>Send us the kitchen plan with measurements.</strong> We'll check it against the room before you order anything else.</li>
</ul>
</div>

<h2>Not bought a kitchen yet?</h2>
<p>We'll design, supply and fit it. We measure up, talk through how you use the room, and put together a layout and a price. If the job grows into a full renovation, with walls moving or a kitchen-diner, we do that too as <a href="https://www.en-suite.co.uk">En-Suites &amp; Bathrooms</a>. Same team, same shop.</p>

<h2>How long does it take?</h2>
<p>A straightforward fit into the same layout usually takes about one to two weeks. Moving the sink, adding circuits, levelling floors or waiting for stone worktops all add time. We give you a clear timeline after the survey.</p>

<h2>Electrics and gas in a kitchen</h2>
<p>New circuits for ovens, hobs and appliances are notifiable electrical work under Part P of the Building Regulations in England, and are tested and certified once they're in. Gas hobs and cookers must be connected by a Gas Safe registered engineer.</p>

<h2>Questions people ask</h2>
{_faqs(KITCHEN_FAQ)}

<h2>Kitchen fitters in Fulham, Hammersmith, Kensington and Chelsea</h2>
<p>Most of our kitchen fitting is within a couple of miles of the shop on Munster Road, and every area brings its own quirks.</p>
<ul>
<li><strong>Fulham and Parsons Green.</strong> Victorian terraces where the kitchen often sits in the back addition, so long, narrow layouts and walls that aren't square are normal. Scribing filler panels to those walls is everyday work for us.</li>
<li><strong>Hammersmith.</strong> A mix of terraced houses and converted flats. In a flat, the new sink and appliances have to connect to a shared waste stack, so we plan the layout around it.</li>
<li><strong>Kensington and Chelsea.</strong> Mansion blocks and tall period houses. Managing agents often set working hours, lift bookings and floor-protection rules, and parking needs a permit. We sort that out before the fit day, not on it.</li>
</ul>
<p>We also fit kitchens in Putney, Wandsworth, West Kensington, Earl's Court and Barons Court. Pop into the shop at 287 Munster Road to talk it through.</p>
</div>
''' + _side('Kitchen jobs we fit', [('Worktops', 'doors-joinery/worktop-fitting'), ('Taps', 'plumbing-fittings/tap-fitting'), ('Basins & sinks', 'plumbing-fittings/basins-sinks'), ('Tiling', 'floors-walls-tiling/tiling'), ('Sockets', 'electrics/sockets'), ('Extractor fans', 'electrics/extractor-fans'), ('Bathroom fitting', 'bathroom-fitting-fulham')], 'Kitchen fitting') + '</div>'}

# ---------------- BATHROOM ----------------
BATH_FAQ = [
    ('Will you fit a bathroom suite I have bought myself?', 'Yes. Send us the product list or links before you order if you can. We check the shower valve, tray and toilet against your water pressure, your waste pipe position and the room size, which saves expensive returns.'),
    ('Can you swap my bath for a walk-in shower?', 'Yes, it is one of the jobs we do most. The main questions are where the waste can run, how low a tray we can fit, and whether your water pressure suits the shower you want.'),
    ('Do you tile as well?', 'Yes, tiling is part of a full bathroom fit. Order about 10% more tiles than the area needs, to allow for cuts and breakages.'),
    ('Do you need to turn the water off for the whole house?', 'Only for short periods while the new pipework is connected. We cap off the bathroom so the rest of the house keeps water while we work.'),
    ('Does a new bathroom need an extractor fan?', 'A bathroom with a bath or shower needs mechanical extraction under Part F of the Building Regulations when the room is newly formed or the fan is replaced. Even where it is not required, a good fan is the best defence against mould.'),
]
BATHROOM = {
    'slug': 'bathroom-fitting-fulham', 'title': 'Bathroom Fitters Fulham, Hammersmith, Chelsea & Kensington | We Fitt',
    'description': 'Bathroom fitters in Fulham, Hammersmith, Kensington and Chelsea. We fit the suite you have bought, or design, supply and fit. Showers, tiling and waterproofing.',
    'faqs': BATH_FAQ, 'crumbs': [('Bathroom fitting', 'bathroom-fitting-fulham')],
    'body': _crumbs([('Bathroom fitting', 'bathroom-fitting-fulham')]) + f'''
<section class="wrap hero" style="padding-top:28px">
<div class="stack" style="gap:20px">
<p class="kicker">Bathroom fitting · Fulham, Hammersmith, Kensington &amp; Chelsea</p>
<h1 class="h-xl">Bathroom fitters in Fulham</h1>
<p class="lead">You've chosen the suite and now you need it fitted properly. Or you're starting from nothing. Either way it's the same team, from stripping out the old bathroom to the last bead of sealant.</p>
<div class="row"><button class="btn btn-go" data-picker="Bathroom fitting">Talk to us on WhatsApp</button><a class="btn btn-line" href="tel:{{{{TEL}}}}">Call {{{{PHONE}}}}</a></div>
</div>
{_ph('Finished bathroom photo', 'A bathroom we have fitted goes here.', '400px')}
</section>
<div class="wrap article band" style="padding-top:24px">
<div class="prose">
<div class="facts">
<div><b>Fit only</b><span>The suite you've already bought</span></div>
<div><b>Supply &amp; fit</b><span>Designed and sourced for you</span></div>
<div><b>Waterproofed</b><span>Showers tanked before tiling</span></div>
<div><b>Bath to shower</b><span>Walk-in and low-profile trays</span></div>
</div>

<h2>What's involved in fitting a bathroom</h2>
<p>What you see at the end is the tiles and the taps. What decides whether a bathroom lasts is underneath: the falls on the waste, the board behind the tiles, and the waterproofing in the shower.</p>
<h3>1. Survey</h3>
<p>We check your water pressure, the position of the soil pipe and wastes, the floor and the walls. A rainfall shower on low-pressure gravity water, or a toilet whose outlet doesn't line up with the soil pipe, are problems to solve before you order.</p>
<h3>2. Strip out</h3>
<p>The old suite, tiles and often the old plaster come off. Water is capped so the rest of the house carries on as normal.</p>
<h3>3. First fix plumbing</h3>
<p>New supply pipes and wastes are run, and the shower valve is set in the wall at the right depth. Waste pipes need a steady fall to drain properly, and that often decides where the shower tray can go.</p>
<h3>4. Boards and waterproofing</h3>
<p>Wet areas are lined with tile backer board rather than plasterboard, and the shower area is tanked: a waterproof membrane with taped joints and corners, so water that gets through the grout can't reach the wall.</p>
<h3>5. Tray, bath and tiling</h3>
<p>The shower tray is bedded solid and level so it never flexes and cracks the seal. Baths are levelled and supported. Then the tiling, set out from the centre lines so the cuts are even on both sides.</p>
<h3>6. Second fix</h3>
<p>Toilet, basin, taps, screen, towel rail and extractor go on. Everything is tested under pressure and checked for leaks, then the sealant goes on last.</p>

<div class="check">
<h3>Buying your own suite? Check these first</h3>
<ul>
<li><strong>Your water pressure.</strong> Many modern showers and taps need high pressure (a combi boiler or unvented cylinder). On a gravity system you need low-pressure rated fittings or a pump.</li>
<li><strong>Toilet set-out.</strong> The distance from the wall to the soil pipe has to suit the pan, especially with back-to-wall toilets.</li>
<li><strong>Tray size against the room.</strong> Allow for the screen, the door swing and somewhere to stand.</li>
<li><strong>Vanity units and basins.</strong> Check the waste position and the tap holes match the tap you've chosen.</li>
<li><strong>Tiles.</strong> Order about 10% extra for cuts and breakages, all from the same batch.</li>
</ul>
</div>

<h2>Electrics in a bathroom</h2>
<p>Bathrooms are a special location in the wiring regulations. Electrical work in the zones around a bath or shower is notifiable under Part P in England, and must be tested and certified. That covers lights, extractor fans, electric towel rails and shaver points.</p>

<h2>How long does it take?</h2>
<p>A straightforward bathroom refit usually takes around one to two weeks, depending on tiling and how much needs moving. A bath-to-shower swap in the same footprint can be quicker. You get a clear timeline after the survey.</p>

<h2>Starting from scratch?</h2>
<p>We'll design the room, source the suite and fit it. For bigger projects, such as moving walls or creating a new bathroom from another room, see <a href="https://www.en-suite.co.uk">En-Suites &amp; Bathrooms</a>. Same team, same shop.</p>

<h2>Questions people ask</h2>
{_faqs(BATH_FAQ)}

<h2>Bathroom fitters in Fulham, Hammersmith, Kensington and Chelsea</h2>
<p>We fit bathrooms from our shop at 287 Munster Road, mostly within a couple of miles of it.</p>
<ul>
<li><strong>Fulham and Parsons Green.</strong> Many terraces still have the bathroom in the back addition, often with a gravity hot water system. That decides which showers and taps will work well, so we check pressure before you buy.</li>
<li><strong>Hammersmith.</strong> Plenty of flat conversions, where the bathroom has been squeezed in. Getting the waste to fall properly to the stack is usually the main puzzle.</li>
<li><strong>Kensington and Chelsea.</strong> In mansion blocks your bathroom usually sits over a neighbour's ceiling. Waterproofing, tanking and pressure-testing every joint matter even more, and building managers often want to see how it is done.</li>
</ul>
<p>We also cover Putney, Wandsworth, West Kensington, Earl's Court and Barons Court.</p>
</div>
''' + _side('Bathroom jobs we fit', [('Showers', 'plumbing-fittings/shower-fitting'), ('Toilets', 'plumbing-fittings/toilet-fitting'), ('Taps', 'plumbing-fittings/tap-fitting'), ('Basins & sinks', 'plumbing-fittings/basins-sinks'), ('Radiators & towel rails', 'plumbing-fittings/radiators-towel-rails'), ('Tiling', 'floors-walls-tiling/tiling'), ('En-suite fitting', 'en-suite-fitting-fulham')], 'Bathroom fitting') + '</div>'}

# ---------------- EN-SUITE ----------------
ENS_FAQ = [
    ('How small can an en-suite be?', 'Smaller than most people think. With a compact toilet, a small basin and an 800 × 800 mm shower, a usable en-suite can fit into roughly the floor area of a single wardrobe run plus a little more. We check your room and show you the options.'),
    ('What if there is no drain near the bedroom?', 'Gravity drainage to the existing soil stack is always the first choice. If the run is too long or there is no fall, a pumped system can lift the waste, but it is the backup plan, not the starting point.'),
    ('Does an en-suite need planning permission?', 'An en-suite inside an existing house does not normally need planning permission, but the drainage, ventilation and electrics come under the Building Regulations, so the work needs to be signed off. Flats and listed buildings have extra rules.'),
    ('Will it make the bedroom noisy or damp?', 'Not if it is built right. We insulate the stud walls for sound, and fit an extractor ducted to the outside, so steam goes out rather than into the bedroom.'),
]
ENSUITE = {
    'slug': 'en-suite-fitting-fulham', 'title': 'En-Suite Fitting Fulham, Hammersmith, Chelsea & Kensington | We Fitt',
    'description': 'En-suite fitting in Fulham, Hammersmith, Kensington and Chelsea. Shower rooms built into bedrooms and box rooms: drainage, stud walls, extraction and tiling.',
    'faqs': ENS_FAQ, 'crumbs': [('En-suite fitting', 'en-suite-fitting-fulham')],
    'body': _crumbs([('En-suite fitting', 'en-suite-fitting-fulham')]) + f'''
<section class="wrap hero" style="padding-top:28px">
<div class="stack" style="gap:20px">
<p class="kicker">En-suite fitting · Fulham, Hammersmith, Kensington &amp; Chelsea</p>
<h1 class="h-xl">En-suite fitting in Fulham</h1>
<p class="lead">A shower room in the bedroom changes how a house works in the morning. We find the space, solve the drainage, build the walls and fit it out.</p>
<div class="row"><button class="btn btn-go" data-picker="En-suite fitting">Talk to us on WhatsApp</button><a class="btn btn-line" href="tel:{{{{TEL}}}}">Call {{{{PHONE}}}}</a></div>
</div>
{_ph('En-suite photo', 'An en-suite we have built goes here.', '400px')}
</section>
<div class="wrap article band" style="padding-top:24px">
<div class="prose">
<div class="facts">
<div><b>Drainage solved</b><span>Gravity first, pumped if needed</span></div>
<div><b>New walls</b><span>Insulated stud walls and a door</span></div>
<div><b>Extraction</b><span>Ducted to outside</span></div>
<div><b>Fit only or supply</b><span>Your suite or ours</span></div>
</div>

<h2>The three questions every en-suite starts with</h2>
<h3>Where does the waste go?</h3>
<p>This decides more than anything else. A toilet needs a large waste pipe running with a steady fall to the soil stack. If the bedroom backs onto the existing bathroom or the stack, it is usually straightforward. If it is on the far side of the house, we look at routing under the floor, boxing in, or as a last resort a pumped waste system.</p>
<h3>Where does the steam go?</h3>
<p>Most en-suites have no window, so an extractor fan, ducted all the way to the outside, isn't optional. It's what stops the bedroom next door from getting damp.</p>
<h3>Is the water pressure good enough?</h3>
<p>A shower on the top floor of an older house can be weak. We check the pressure and flow at the survey, and pick the shower to suit, or add a pump where it is allowed.</p>

<h2>What's involved, step by step</h2>
<ol>
<li><strong>Survey and layout.</strong> We mark out the room on the floor so you can see how much bedroom you keep.</li>
<li><strong>Stud walls and door.</strong> Timber or metal studs, sound insulation between them, boarded with moisture-resistant board in the wet areas.</li>
<li><strong>First fix.</strong> Drainage, water supplies, the shower valve, the extractor duct and the electrics for the fan and lights.</li>
<li><strong>Waterproofing.</strong> The shower area is tanked before any tiles go on.</li>
<li><strong>Tiling and fit-out.</strong> Tray, toilet, basin, screen and fittings, then testing and sealing.</li>
</ol>

<h2>Rules that apply</h2>
<p>An en-suite inside a house doesn't normally need planning permission. The new drainage, ventilation and electrics do come under the Building Regulations, so the work has to be signed off. Electrical work in a room with a shower is notifiable under Part P. We tell you exactly what applies to your job.</p>

<h2>Questions people ask</h2>
{_faqs(ENS_FAQ)}

<h2>En-suites in Fulham, Hammersmith, Kensington and Chelsea</h2>
<ul>
<li><strong>Fulham and Parsons Green.</strong> In most terraces the back bedroom sits next to the bathroom or over the back addition, close to the soil stack. That often makes an en-suite simpler than people expect.</li>
<li><strong>Hammersmith.</strong> In converted flats, new drainage usually needs the freeholder's consent under the lease, so we help you check that early.</li>
<li><strong>Kensington and Chelsea.</strong> Tall houses mean top-floor en-suites, where water pressure is the thing to plan around. In mansion flats, the building's rules on wet rooms and drainage come first.</li>
</ul>
<p>We also build en-suites in Putney, Wandsworth, West Kensington, Earl's Court and Barons Court.</p>

<h2>Bigger plans?</h2>
<p>If the en-suite is part of a wider renovation, such as a loft conversion layout or moving bedrooms around, our full renovation side <a href="https://www.en-suite.co.uk">En-Suites &amp; Bathrooms</a> handles the design and build. Same team, same shop.</p>
</div>
''' + _side('Related jobs', [('Bathroom fitting', 'bathroom-fitting-fulham'), ('Stud walls', 'floors-walls-tiling/stud-walls'), ('Showers', 'plumbing-fittings/shower-fitting'), ('Extractor fans', 'electrics/extractor-fans'), ('Tiling', 'floors-walls-tiling/tiling'), ('Fitted wardrobes', 'doors-joinery/fitted-wardrobes')], 'En-suite fitting') + '</div>'}

# ---------------- BIKE & BIN STORES ----------------
STORE_FAQ = [
    ('Do I need planning permission for a bike or bin store?', 'Often not in a back garden, but it depends. Under the householder permitted development rules, outbuildings in front of the house generally are not covered, so a front-garden store can need planning permission, especially in a conservation area or for a flat. We check with Hammersmith &amp; Fulham before we build.'),
    ('How heavy is a green roof?', 'Heavier than felt, especially when wet, which is why we build the roof deck and frame for it from the start rather than adding sedum to a shed roof not designed for it.'),
    ('Does the sedum need looking after?', 'Very little. Sedum is a drought-tolerant succulent. It may need a water in a long dry spell in its first summer, and an occasional weed. That is about it.'),
    ('Can it fit around steps, walls or a slope?', 'Yes. That is the point of building it on site. Fulham front gardens are rarely square, and a store made to measure uses space a shop-bought one cannot.'),
    ('Can bikes be locked inside?', 'Yes. We fit lockable doors, and can add a ground anchor or wall rail inside for locking the bikes themselves.'),
]
STORES = {
    'slug': 'bike-and-bin-stores', 'title': 'Bike & Bin Stores with Green Roofs – Fulham, Chelsea & Kensington | We Fitt',
    'description': 'Bike and bin stores built to measure in Fulham, Hammersmith, Kensington and Chelsea, with an optional sedum green roof. Design yours online.',
    'faqs': STORE_FAQ, 'crumbs': [('Outside', 'outside'), ('Bike & bin stores', 'bike-and-bin-stores')],
    'body': _crumbs([('Outside', 'outside'), ('Bike & bin stores', 'bike-and-bin-stores')]) + f'''
<section class="wrap hero" style="padding-top:28px">
<div class="stack" style="gap:20px">
<p class="kicker" style="color:var(--leaf)">Bike &amp; bin stores</p>
<h1 class="h-xl">Bike &amp; bin stores with a living roof, built in Fulham</h1>
<p class="lead">Wheelie bins on show and bikes in the hallway are a London front-garden problem. We build timber stores to measure, with lockable doors and an optional roof of growing sedum.</p>
<div class="row"><a class="btn btn-go" href="#builder">Design your store</a><a class="btn btn-line" href="tel:{{{{TEL}}}}">Call {{{{PHONE}}}}</a></div>
</div>
{_ph('Bike / bin store photo', 'Your first finished store with its green roof goes here.', '400px').replace('class="ph"', 'class="ph" style="background:#243A2E;border-color:#4E7A60"')}
</section>

<section class="wrap" id="builder" aria-labelledby="builder-title">
<div class="builder" data-store>
<div class="stage"><svg viewBox="0 0 520 300" role="img" aria-label="Drawing of your bike and bin store"></svg></div>
<div>
<h2 id="builder-title" class="h-m" style="margin-bottom:6px">Design your store</h2>
<p class="summary-line" aria-live="polite"></p>
<div class="opt"><span>Bikes</span><div class="seg" data-key="bikes"><button data-v="0" aria-pressed="false">None</button><button data-v="2" aria-pressed="true">2</button><button data-v="3" aria-pressed="false">3</button><button data-v="4" aria-pressed="false">4</button></div></div>
<div class="opt"><span>Wheelie bins</span><div class="seg" data-key="bins"><button data-v="0" aria-pressed="false">None</button><button data-v="1" aria-pressed="false">1</button><button data-v="2" aria-pressed="true">2</button><button data-v="3" aria-pressed="false">3</button></div></div>
<div class="opt"><span>Roof</span><div class="seg" data-key="roof"><button data-v="Green sedum roof" aria-pressed="true">Green sedum</button><button data-v="Plain roof" aria-pressed="false">Plain</button></div></div>
<div class="opt"><span>Cladding</span><div class="seg" data-key="clad"><button data-v="Natural larch" aria-pressed="true">Natural larch</button><button data-v="Black stained" aria-pressed="false">Black stained</button><button data-v="Painted grey" aria-pressed="false">Painted grey</button></div></div>
<button class="btn btn-go send-store" style="width:100%">Send this design on WhatsApp</button>
<p class="muted" style="font-size:14px;margin-top:10px">We'll reply with a few questions about your space and arrange a visit to measure up. Every store is built to measure, so the drawing is a starting point.</p>
</div>
</div>
</section>

<div class="wrap article band">
<div class="prose">
<h2>Why a living roof?</h2>
<p>A sedum roof turns the top of a store into a small patch of planting. It softens how the store looks from the street and from the windows above, holds back some rainwater, and gives insects somewhere to feed. Sedum is a low-growing succulent that copes with shallow soil and dry spells, which is why it suits roofs.</p>

<h2>What's involved in building one</h2>
<h3>1. Measure and check access</h3>
<p>We measure the space, the bins you have (council bins vary in size), the bikes and how the doors will open past steps, walls and gates. Then we check whether planning permission is needed.</p>
<h3>2. A solid base</h3>
<p>Paving or a small concrete pad, level and draining away from the house, so the store doesn't rot from the bottom or rock on uneven ground.</p>
<h3>3. Frame and cladding</h3>
<p>Treated timber frame, clad in larch or stained or painted boards, with lockable doors sized for a bike's handlebars or a full wheelie bin and its lid open.</p>
<h3>4. The roof</h3>
<p>For a green roof, the deck is built strong enough for wet soil, then covered with a waterproof membrane, a drainage layer, a thin growing layer and a ready-grown sedum mat. A plain roof gets a durable membrane instead.</p>
<h3>5. Finishing</h3>
<p>Drip edges to throw water clear, hooks or a rail for locking bikes, and handles and hinges that cope with daily use.</p>

<div class="check">
<h3>Planning in Fulham</h3>
<p>Under the householder permitted development rules, outbuildings in front of a house generally aren't covered, and flats have no permitted development rights at all. Much of Fulham is also in conservation areas. That means a front-garden store can need planning permission. We check with Hammersmith &amp; Fulham Council before building, so you're not caught out.</p>
</div>

<h2>Bike and bin stores across Fulham, Hammersmith, Kensington and Chelsea</h2>
<ul>
<li><strong>Fulham and Hammersmith.</strong> Small front gardens with wheelie bins in full view of the street are the norm, and both are in the London Borough of Hammersmith &amp; Fulham, so planning questions go to H&amp;F.</li>
<li><strong>Kensington and Chelsea.</strong> Much of the borough is covered by conservation areas, so materials and height matter more, and planning questions go to the Royal Borough of Kensington and Chelsea. A living roof often helps a store sit better in the street.</li>
</ul>
<p>We also build stores in Putney, Wandsworth, West Kensington, Earl's Court and Barons Court.</p>

<h2>Questions people ask</h2>
{_faqs(STORE_FAQ)}
</div>
''' + _side('More outside jobs', [('Fencing & gates', 'outside/fencing-gates'), ('Decking', 'outside/decking'), ('Sheds & summer houses', 'outside/sheds-summer-houses'), ('Patios', 'outside/patios'), ('Guttering', 'outside/guttering')], 'Bike or bin store') + '</div>'}

# ---------------- ABOUT ----------------
ABOUT = {
    'slug': 'about', 'title': 'About We Fitt – Same Team, Same Shop, Munster Road | We Fitt',
    'description': 'We Fitt is the fitting side of En-Suites & Bathrooms, from the shop at 287 Munster Road, Fulham. One trade team for kitchens, bathrooms, doors and more.',
    'crumbs': [('About', 'about')],
    'body': _crumbs([('About', 'about')]) + f'''
<section class="wrap hero" style="padding-top:28px">
<div class="stack" style="gap:20px">
<p class="kicker">About us</p>
<h1 class="h-xl">Same team, same shop</h1>
<p class="lead">We Fitt is the fitting side of En-Suites &amp; Bathrooms. The shop at 287 Munster Road, the people who answer the phone and the team who turn up are all the same.</p>
</div>
{_ph('Photo of Nicholas', 'A photo of Nicholas in the shop goes here.', '400px')}
</section>
<div class="wrap band" style="padding-top:24px">
<div class="prose" style="max-width:760px">
<h2>Why We Fitt?</h2>
<p>People walked past the shop and asked if we could fit a door, a tap, a kitchen they'd already bought. The answer was always yes. En-Suites &amp; Bathrooms does full renovations; We Fitt is for everything else, from a single job to a whole kitchen.</p>
<h2>Nicholas</h2>
<p>Nicholas has lived in Kensington all his life and has worked in the plumbing and building trade since 1998. He grew up in a building family and was on site as a young boy, learning to plaster. Customers deal with him directly.</p>
<h2>The team</h2>
<p>Carpenters, plumbers, electricians, a plasterer, a decorator and a tiler, all on our own team, so one call covers the whole job. Each trade does its own part, and nobody leaves a job half-finished for someone else to sort out.</p>
<h2>Come and see us</h2>
<p>The shop is on Munster Road in Fulham. Come in, bring photos or measurements, and talk the job through. <a href="{{{{link:contact}}}}">Opening hours and directions</a>.</p>
</div>
</div>'''}

# ---------------- CONTACT ----------------
CONTACT = {
    'slug': 'contact', 'title': 'Visit the We Fitt Shop – 287 Munster Road, Fulham | We Fitt',
    'description': 'Visit We Fitt at 287 Munster Road, Fulham SW6 6BW. Open 7 days. Call or WhatsApp 020 7386 0000.',
    'crumbs': [('Visit the shop', 'contact')],
    'body': _crumbs([('Visit the shop', 'contact')]) + f'''
<section class="wrap hero" style="padding-top:28px">
<div class="stack" style="gap:20px">
<p class="kicker">Visit the shop</p>
<h1 class="h-xl">287 Munster Road, Fulham</h1>
<p class="lead">Bring photos, measurements or the product you've bought. We'll talk you through what's involved and what it costs.</p>
<div class="facts" style="margin:8px 0 0">
<div><b>Call or WhatsApp</b><span><a href="tel:{{{{TEL}}}}">{{{{PHONE}}}}</a></span></div>
<div><b>Address</b><span>287 Munster Road<br>London SW6 6BW</span></div>
</div>
<div class="row"><button class="btn btn-go" data-picker="">WhatsApp us</button><a class="btn btn-line" href="https://www.google.com/maps/search/?api=1&amp;query=287+Munster+Road+London+SW6+6BW">Open in Google Maps</a></div>
</div>
<div class="side-box">
<h2 class="h-m" style="margin-bottom:12px">Opening hours</h2>
<table style="width:100%;border-collapse:collapse;font-size:16px">
<tr><td style="padding:8px 0;border-bottom:1px solid var(--black-3)">Monday – Friday</td><td style="text-align:right;border-bottom:1px solid var(--black-3)">7am – 8pm</td></tr>
<tr><td style="padding:8px 0;border-bottom:1px solid var(--black-3)">Saturday</td><td style="text-align:right;border-bottom:1px solid var(--black-3)">8am – 6pm</td></tr>
<tr><td style="padding:8px 0">Sunday</td><td style="text-align:right">10am – 6pm</td></tr>
</table>
<p class="open-badge" style="margin-top:14px"><i aria-hidden="true"></i><span>Shop hours</span></p>
</div>
</section>
<div class="wrap band" style="padding-top:0">
<div class="prose" style="max-width:760px">
<h2>Areas we cover</h2>
<p>Fulham first, as it's on our doorstep, then Hammersmith, Kensington and Chelsea. We also cover Parsons Green, Sands End, Putney, Wandsworth, West Kensington, Earl's Court and Barons Court.</p>
<h2>Full renovations</h2>
<p>For a full design-and-build renovation, see <a href="https://www.en-suite.co.uk">En-Suites &amp; Bathrooms</a>. It's the same company, the same team and the same shop.</p>
</div>
</div>'''}

PRIVACY = {
    'slug': 'privacy', 'title': 'Privacy | We Fitt', 'description': 'How We Fitt handles your information.',
    'body': '''<div class="wrap band"><div class="prose" style="max-width:760px">
<h1 class="h-l">Privacy</h1>
<p style="margin-top:16px">We Fitt is a trading name of En-Suites &amp; Bathrooms Ltd, 287 Munster Road, London SW6 6BW, which is responsible for your information.</p>
<h2>What this website collects</h2>
<p>This website doesn't use advertising or tracking cookies. When you use the "What needs fitting?" picker or the store designer, your choices stay in your browser until you press send. Then WhatsApp opens with the message, and you decide whether to send it.</p>
<h2>When you contact us</h2>
<p>If you message or call us, we use your name, number, address and job details to reply, price and carry out the work, and keep them for as long as we need to for the job, guarantees and our accounts. WhatsApp is run by Meta, and its own privacy policy applies to messages sent through it.</p>
<h2>Your rights</h2>
<p>You can ask to see, correct or delete the information we hold about you by calling {{PHONE}} or visiting the shop. You can also complain to the Information Commissioner's Office.</p>
</div></div>'''}

PAGES = [HOME, KITCHEN, BATHROOM, ENSUITE, STORES, ABOUT, CONTACT, PRIVACY]
