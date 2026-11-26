# Builds the category pages and item pages from items_a / items_b.
from html import escape
from pages_content import CATEGORIES, ITEMS, BIG, _faqs, _crumbs
from items_a import ITEMS_A
from items_b import ITEMS_B

ALL_ITEMS = ITEMS_A + ITEMS_B
LOOKUP = dict(ITEMS); LOOKUP.update(BIG)
CAT_BY_SLUG = {c['slug']: c for c in CATEGORIES}

CAT_INFO = {
 'doors-joinery': {
  'h1': 'Doors and joinery in Fulham',
  'title': 'Doors & Joinery Fulham, Hammersmith, Chelsea & Kensington | We Fitt',
  'desc': 'Internal and front doors, staircases, skirting, fitted wardrobes and worktops in Fulham, Hammersmith, Kensington and Chelsea. Carpentry done properly.',
  'lead': 'Doors that close properly, stairs that feel solid, trim with joints you can\'t see. Joinery is what makes a house feel well finished, and it is the trade our carpenters live for.',
  'why': ('Why joinery in older houses takes care', 'Almost nothing in a hundred-year-old London house is square. Frames lean, floors dip and walls bow. Good joinery means measuring every opening, scribing every piece to the wall it meets, and never assuming two doors are the same size. That is the difference between trim that looks fitted and trim that looks added.'),
  'faqs': [('Can you fit doors, skirting or wardrobes I have bought?', 'Yes. Much of our joinery work is fitting things customers have already bought. Send us the sizes or links first and we\'ll check they suit your rooms.'), ('Do you paint as well?', 'We can leave everything primed and ready for your decorator, or finish it ourselves.')],
  'areas': 'We do joinery across Fulham, Hammersmith, Kensington and Chelsea, from Victorian terraces with original features to mansion flats with building rules on working hours.'},
 'loft-windows': {
  'h1': 'Loft windows and skylights in Fulham',
  'title': 'Loft Windows & Skylights Fulham, Hammersmith, Chelsea & Kensington | We Fitt',
  'desc': 'Roof windows and flat roof skylights fitted in Fulham, Hammersmith, Kensington and Chelsea. Structure, flashing, planning checks and inside lining.',
  'lead': 'Daylight from above changes a room more than anything else. We fit roof windows in pitched roofs and rooflights in flat roofs, from the structure to the plastered reveals.',
  'why': ('Why fitting roof glazing is a specialist job', 'Cutting into a roof means trimming the structure, waterproofing the opening and making good the covering, then lining it all inside. Each step matters, because a small shortcut with the flashing or upstand is where leaks come from. It also means checking planning and Building Regulations first, especially in conservation areas.'),
  'faqs': [('Do I need planning permission for a roof window?', 'Often not on a house, but conservation areas, listed buildings and flats change that. We check before any work.'), ('Can you replace old roof windows?', 'Yes, like for like or upgraded, usually without disturbing the inside finish much.')],
  'areas': 'Large parts of Fulham, Chelsea and Kensington are conservation areas, so we check planning before every new opening. In Hammersmith we fit many rooflights over kitchen extensions.'},
 'outside': {
  'h1': 'Outside building work in Fulham',
  'title': 'Fencing, Decking, Patios & Garden Building Fulham & Chelsea | We Fitt',
  'desc': 'Bike and bin stores, fencing and gates, decking, sheds, patios and guttering in Fulham, Hammersmith, Kensington and Chelsea.',
  'lead': 'Small London gardens work hard. We build the things that make them usable: stores for bikes and bins, fences that stay up, decks and patios that drain, and gutters that keep the walls dry.',
  'why': ('Why outside work fails, and how we stop it', 'Almost every outdoor job fails from the bottom up. Fence posts not set deep enough, patios laid on sand, decks with no air underneath, sheds on bare soil. We spend the time on bases, falls and drainage, because that is what decides whether it lasts.'),
  'faqs': [('Do I need planning permission for garden work?', 'Most back garden work is allowed, but there are limits on fence heights, raised decks, outbuildings and front garden paving, and conservation areas add more. We check for each job.'), ('Can everything come through the house?', 'In most terraces it has to. We protect floors and plan deliveries and waste so it is done in as few trips as possible.')],
  'areas': 'We work in gardens across Fulham, Hammersmith, Kensington and Chelsea. Planning questions go to Hammersmith & Fulham Council or the Royal Borough of Kensington and Chelsea depending on where you are.'},
 'plumbing-fittings': {
  'h1': 'Plumbing and bathroom fittings in Fulham',
  'title': 'Taps, Toilets, Showers & Bathroom Fittings Fulham & Chelsea | We Fitt',
  'desc': 'Taps, toilets, showers, basins, radiators, mirrors and appliances fitted in Fulham, Hammersmith and Chelsea. Matched to your water system and tested.',
  'lead': 'The single jobs that make a bathroom or kitchen work: a new tap, a toilet, a shower, a radiator, the washing machine. Each one fitted to suit your water system and tested before we leave.',
  'why': ('Why your water system matters', 'Plenty of fittings bought online are made for high-pressure systems and barely run on a gravity tank in the loft, which many Fulham houses still have. Before we fit anything, we check your system, pressure and pipe positions, so what you\'ve bought works as it should.'),
  'faqs': [('Can you fit things I have bought myself?', 'Yes. Send us the links before you buy if you can, and we\'ll check they suit your water system and pipework.'), ('Do you fix as well as fit?', 'Yes. Dripping taps, running toilets and weak showers are often a part, not a replacement.')],
  'areas': 'We fit taps, toilets, showers and bathroom fittings across Fulham, Hammersmith and Chelsea, from terraces on gravity systems to flats on pumped and communal supplies.'},
 'floors-walls-tiling': {
  'h1': 'Floors, walls and tiling in Fulham',
  'title': 'Tiling, Flooring, Stud Walls & Plastering Fulham & Chelsea | We Fitt',
  'desc': 'Tiling, wood and LVT flooring, stud walls and plastering in Fulham, Hammersmith, Kensington and Chelsea. Prepared properly, finished flat.',
  'lead': 'Floors, walls and ceilings are the surfaces you see every day. We tile, lay floors, build walls and plaster, and the preparation underneath is where we put the effort.',
  'why': ('Why preparation is everything', 'Tiles crack on floors that flex. Wood floors squeak on loose boards. Skim coats crack over failing plaster. Almost every surface problem is a preparation problem, so we check and fix what\'s underneath before the finish goes on.'),
  'faqs': [('Can you do several of these in one job?', 'Yes. A stud wall, plastering, flooring and tiling often go together, and one team doing them all keeps it simple.'), ('Do you work in flats?', 'Yes. We check lease rules on hard floors and alterations before starting.')],
  'areas': 'Across Fulham, Hammersmith, Kensington and Chelsea we work on everything from Victorian lath and plaster to concrete-floored mansion flats.'},
 'electrics': {
  'h1': 'Electrical fitting in Fulham',
  'title': 'EV Chargers, Sockets, Downlights & Fans Fulham, Hammersmith & Chelsea | We Fitt',
  'desc': 'Home EV chargers, extra sockets, LED downlights and extractor fans fitted in Fulham, Hammersmith, Kensington and Chelsea. Tested and certified.',
  'lead': 'Home chargers for electric cars, more sockets where you need them, better light and fans that actually clear the steam. Done neatly, with cables in the walls, tested and certified.',
  'why': ('Why electrical work is certified', 'Electrical work in homes in England has to meet the wiring regulations, and some of it, like new circuits and work around baths and showers, is notifiable under Part P of the Building Regulations. Every job we do is tested, and you get the certificate.'),
  'faqs': [('Will I get a certificate?', 'Yes, for every job, and notifiable work is registered so it shows when you sell the house.'), ('Can you do electrics alongside other work?', 'Yes. Moving sockets and lights before plastering or a new kitchen is the best time to do it.')],
  'areas': 'We do electrical work across Fulham, Hammersmith, Kensington and Chelsea, in houses and in flats where wiring often runs in concrete.'},
}


def link(label):
    return LOOKUP.get(label)


def side(item):
    lis = ''.join(f'<li><a href="{{{{link:{link(l)}}}}}">{escape(l)}</a></li>' for l in item['related'] if link(l))
    cat = CAT_BY_SLUG[item['cat']]
    return f'''<aside class="side">
<div class="side-box"><h3>Talk to us</h3><p class="muted" style="font-size:15px;margin-bottom:14px">Send a photo on WhatsApp and talk the job through. We'll come and have a look before giving you a price.</p>
<button class="btn btn-go" style="width:100%" data-picker="{escape(item['job'])}">Talk to us on WhatsApp</button>
<a class="btn btn-line" style="width:100%;margin-top:10px" href="tel:{{{{TEL}}}}">Call {{{{PHONE}}}}</a></div>
<div class="side-box"><h3>Related jobs</h3><ul>{lis}</ul></div>
<div class="side-box"><h3>More in {escape(cat['name'])}</h3><ul>''' + ''.join(
        f'<li><a href="{{{{link:{s}}}}}">{escape(l)}</a></li>' for l, s in cat['parts'] if s != item['slug']) + '</ul></div>\n</aside>'


def item_page(it):
    cat = CAT_BY_SLUG[it['cat']]
    areas_kicker = 'Fulham, Hammersmith &amp; Chelsea' if it.get('plumb') else 'Fulham, Hammersmith, Kensington &amp; Chelsea'
    facts = ''.join(f'<div><b>{escape(b)}</b><span>{escape(s)}</span></div>' for b, s in it['facts'])
    types = ''.join(f'<li><strong>{escape(n)}.</strong> {escape(t)}</li>' for n, t in it['types'])
    steps = ''.join(f'<h3>{i}. {escape(t)}</h3><p>{escape(d)}</p>' for i, (t, d) in enumerate(it['steps'], 1))
    ct, cl = it['check']
    check = f'<div class="check"><h3>{escape(ct)}</h3><ul>' + ''.join(f'<li>{escape(x)}</li>' for x in cl) + '</ul></div>'
    rules = f'<h2>Rules and regulations</h2><p>{escape(it["rules"])}</p>' if it.get('rules') else ''
    faqs = [(escape(q), escape(a)) for q, a in it['faqs']]
    name_l = it['name'][0].lower() + it['name'][1:]
    area_h = f'{it["name"]} in Fulham, Hammersmith and Chelsea' if it.get('plumb') else f'{it["name"]} in Fulham, Hammersmith, Kensington and Chelsea'
    body = _crumbs([(cat['name'], cat['slug']), (it['name'], it['slug'])]) + f'''
<section class="wrap" style="padding-top:28px">
<div class="stack" style="gap:20px;max-width:860px">
<p class="kicker">{escape(cat['name'])} · {areas_kicker}</p>
<h1 class="h-xl">{escape(it['h1'])}</h1>
<p class="lead">{escape(it['lead'])}</p>
<div class="row"><button class="btn btn-go" data-picker="{escape(it['job'])}">Talk to us on WhatsApp</button><a class="btn btn-line" href="tel:{{{{TEL}}}}">Call {{{{PHONE}}}}</a></div>
</div>
<div class="facts" style="margin-top:32px">{facts}</div>
</section>
<div class="wrap article band" style="padding-top:24px">
<div class="prose">
<h2>What we fit</h2>
<ul>{types}</ul>
<h2>What's involved, step by step</h2>
{steps}
{check}
<h2>How long does it take?</h2>
<p>{escape(it['time'])}</p>
{rules}
<h2>Questions people ask</h2>
{_faqs(faqs)}
<h2>{escape(area_h)}</h2>
<p>{escape(it['areas'])}</p>
<p>Our shop is at 287 Munster Road, Fulham. Pop in with a photo or the product you've bought and we'll talk you through it.</p>
</div>
{side(it)}
</div>'''
    return {'slug': it['slug'], 'title': it['title'], 'description': it['desc'], 'faqs': it['faqs'],
            'crumbs': [(cat['name'], cat['slug']), (it['name'], it['slug'])], 'body': body}


def cat_page(slug):
    c = CAT_BY_SLUG[slug]; info = CAT_INFO[slug]
    cards_by = {it['slug']: it for it in ALL_ITEMS}
    cards = ''
    for label, s in c['parts']:
        it = cards_by.get(s)
        blurb = it['card'] if it else 'Timber stores built to measure, with an optional living sedum roof.'
        cards += f'<a class="cat reveal" href="{{{{link:{s}}}}}"><h3>{escape(label)}</h3><p class="muted" style="font-size:15px">{escape(blurb)}</p><span class="go">What\'s involved →</span></a>'
    faqs = [(escape(q), escape(a)) for q, a in info['faqs']]
    wt, wd = info['why']
    body = _crumbs([(c['name'], slug)]) + f'''
<section class="wrap" style="padding-top:28px">
<div class="stack" style="gap:20px;max-width:860px">
<p class="kicker">{escape(c['name'])} · Fulham, Hammersmith, Kensington &amp; Chelsea</p>
<h1 class="h-xl">{escape(info['h1'])}</h1>
<p class="lead">{escape(info['lead'])}</p>
<div class="row"><button class="btn btn-go" data-picker="">Talk to us on WhatsApp</button><a class="btn btn-line" href="tel:{{{{TEL}}}}">Call {{{{PHONE}}}}</a></div>
</div>
</section>
<section class="wrap band"><div class="grid">{cards}</div></section>
<div class="wrap band" style="padding-top:0">
<div class="prose" style="max-width:780px">
<h2>{escape(wt)}</h2>
<p>{escape(wd)}</p>
<h2>Questions people ask</h2>
{_faqs(faqs)}
<h2>Where we work</h2>
<p>{escape(info['areas'])}</p>
</div>
</div>'''
    return {'slug': slug, 'title': info['title'], 'description': info['desc'], 'faqs': info['faqs'],
            'crumbs': [(c['name'], slug)], 'body': body}


ITEM_PAGES = [cat_page(c['slug']) for c in CATEGORIES] + [item_page(it) for it in ALL_ITEMS]

# sanity: every category part has a page (or is a big page)
_have = {p['slug'] for p in ITEM_PAGES} | set(BIG.values()) | {'bike-and-bin-stores'}
_missing = [s for c in CATEGORIES for _, s in c['parts'] if s not in _have]
assert not _missing, _missing
_bad = [(it['slug'], l) for it in ALL_ITEMS for l in it['related'] if not link(l)]
assert not _bad, _bad
