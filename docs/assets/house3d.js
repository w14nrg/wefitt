/* We Fitt — walk-through 3D house. three.js r128 (global THREE). */
(function () {
'use strict';
const WA = '442073860000';
const LINK = window.WEFITT_LINK || (s => '../' + s + '/');
const PRICES = window.WEFITT_PRICES || {};
const elLoad = document.getElementById('h3-loading');

if (!window.THREE) { if (elLoad) elLoad.textContent = 'The 3D house could not load on this device. Use the list of rooms below instead.'; return; }
const testCanvas = document.createElement('canvas');
if (!(testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl'))) { if (elLoad) elLoad.textContent = 'Your device does not support 3D. Use the list of rooms below instead.'; return; }

/* ------------------------------------------------------------------ items */
const L = {
  app: 'plumbing-fittings/appliance-fitting', kit: 'kitchen-fitting-fulham', wt: 'doors-joinery/worktop-fitting',
  sink: 'plumbing-fittings/basins-sinks', tap: 'plumbing-fittings/tap-fitting', tile: 'floors-walls-tiling/tiling',
  floor: 'floors-walls-tiling/flooring', ext: 'doors-joinery/external-door-fitting', int: 'doors-joinery/internal-door-fitting',
  skirt: 'doors-joinery/skirting-architraves', stairs: 'doors-joinery/staircases', stud: 'floors-walls-tiling/stud-walls',
  ward: 'doors-joinery/fitted-wardrobes', rad: 'plumbing-fittings/radiators-towel-rails', sock: 'electrics/sockets',
  down: 'electrics/downlights', fan: 'electrics/extractor-fans', plas: 'floors-walls-tiling/plastering', bath: 'bathroom-fitting-fulham',
  shower: 'plumbing-fittings/shower-fitting', wc: 'plumbing-fittings/toilet-fitting', mirror: 'plumbing-fittings/mirrors-cabinets',
  ens: 'en-suite-fitting-fulham', roof: 'loft-windows/roof-window-fitting', gut: 'outside/guttering', fence: 'outside/fencing-gates',
  patio: 'outside/patios', deck: 'outside/decking', shed: 'outside/sheds-summer-houses', store: 'bike-and-bin-stores'
};
const ITEMS = {
  washer: ['Washing machine', 'Plumbed into the supply and waste, levelled so it doesn\'t walk across the floor, and tested with a run.', L.app],
  dishwasher: ['Dishwasher', 'Freestanding or integrated, plumbed in, with the door panel lined up with the kitchen doors.', L.app],
  fridge: ['Fridge freezer', 'Integrated fridges fixed into their housing with the doors aligned, or freestanding ones moved and levelled.', L.app],
  oven: ['Oven', 'Built in and connected to the right electrical supply for that model.', L.app],
  hob: ['Hob', 'Electric and induction hobs connected. Gas hobs must be connected by a Gas Safe registered engineer.', L.app],
  hood: ['Cooker hood', 'Fitted above the hob and ducted outside, so steam and smells leave the house.', L.fan],
  kitchen: ['Full kitchen', 'The kitchen you have bought, built and fitted, or designed, supplied and fitted by us.', L.kit],
  island: ['Kitchen island', 'Built, levelled and fixed down, with power run in if you want sockets on it.', L.kit],
  worktop: ['Worktops', 'Laminate, wood and compact worktops cut, jointed and sealed on site. Units prepared for stone templating.', L.wt],
  sink: ['Kitchen sink', 'Inset, undermount or Belfast, fixed solid and connected to the waste without strain on the joints.', L.sink],
  tap: ['Kitchen tap', 'Matched to your water pressure, fitted with isolation valves so it can be serviced easily.', L.tap],
  splashback: ['Splashback tiles', 'Set out so the cuts are even at both ends, grouted and sealed.', L.tile],
  kitchenfloor: ['Kitchen floor tiles', 'Laid on a properly prepared base with flexible adhesive, so they don\'t crack.', L.tile],
  frontdoor: ['Front door', 'Timber or composite, hung, sealed against weather and fitted with proper locks. Signed off under the Building Regulations.', L.ext],
  frenchdoors: ['French doors', 'Garden doors hung in pairs, weathertight, with the threshold and seals done properly.', L.ext],
  intdoor: ['Internal door', 'Measured for its own frame, trimmed, hung on hinges and fitted with latch and handles.', L.int],
  architrave: ['Architraves', 'The trim round each door frame, matched to the skirting and scribed tight.', L.skirt],
  skirting: ['Skirting boards', 'Period or modern profiles, corners scribed and fitted to uneven floors.', L.skirt],
  hallfloor: ['Victorian hall tiles', 'Geometric hall floors laid or repaired on a sound base.', L.tile],
  stairs: ['Staircase', 'New treads, re-treading, creaks fixed or a whole new staircase built to the regulations.', L.stairs],
  banister: ['Banister & spindles', 'Handrails, spindles and newel posts replaced, with gaps that meet the safety rules.', L.stairs],
  nosing: ['Stair nosing', 'Worn, split or loose nosings replaced so every step is safe and looks crisp.', L.stairs],
  stairrunner: ['Stair carpet', 'Runners and fitted stair carpet laid tight on every step.', L.floor],
  understairs: ['Understairs cupboard or cloakroom', 'A cupboard with shelves, a door and a light, or a small cloakroom with a toilet and basin where the drainage allows.', L.stud],
  woodfloor: ['Wood flooring', 'Engineered wood, laminate or LVT on a prepared subfloor, with doors trimmed to clear it.', L.floor],
  carpet: ['Carpet', 'Fitted on proper underlay, stretched and finished neatly at the doors.', L.floor],
  alcove: ['Alcove units', 'Cupboards and shelving built into the alcoves beside the chimney breast, scribed to the walls.', L.ward],
  wardrobe: ['Fitted wardrobes', 'Built in floor to ceiling, or flat-pack fitted properly and fixed to the wall.', L.ward],
  radiator: ['Radiator', 'Swapped, moved or upgraded, sized for the room, then the system refilled and balanced.', L.rad],
  socket: ['Sockets', 'Extra sockets, doubles and USB sockets, with the cables in the wall, tested and certified.', L.sock],
  downlight: ['Downlights', 'LED downlights laid out evenly, fire-rated and bathroom-rated where needed.', L.down],
  plaster: ['Walls & ceilings', 'Skimming, re-plastering and patch repairs, including old lath and plaster.', L.plas],
  bath: ['Bath', 'Levelled, supported and sealed once filled with water, so the seal doesn\'t split.', L.bath],
  shower: ['Shower & screen', 'Valve set at the right depth, the area tanked before tiling, the screen fixed into solid wall.', L.shower],
  toilet: ['Toilet', 'Set out to your soil pipe, fixed down so it never rocks, connected and leak-tested.', L.wc],
  basin: ['Basin & vanity unit', 'Fixed level into proper fixings, with the waste lined up so nothing strains.', L.sink],
  bathtap: ['Basin & bath taps', 'Matched to your water system and fitted with isolation valves.', L.tap],
  mirror: ['Mirror cabinet', 'Fixed safely through tiles into proper fixings. Illuminated mirrors wired and certified.', L.mirror],
  towelrail: ['Heated towel rail', 'On the heating, electric or dual fuel, sized for the room.', L.rad],
  fan: ['Extractor fan', 'Sized for the room and ducted all the way outside.', L.fan],
  bathtiles: ['Bathroom tiles', 'Wet areas on tile backer board and tanked before tiling.', L.tile],
  ensuite: ['En-suite', 'A shower room built into a bedroom or loft: drainage, stud walls, extraction and tiling.', L.ens],
  roofwindow: ['Roof window', 'Daylight into the loft, flashed properly into the roof and lined inside.', L.roof],
  gutter: ['Guttering', 'Leaks fixed, gutters cleared, and uPVC, aluminium or cast iron replaced.', L.gut],
  fence: ['Fencing', 'Slatted, closeboard or panel fencing on posts set deep so it stays straight.', L.fence],
  gate: ['Front wall & gate', 'Gates hung on solid posts, with latches and bolts that work.', L.fence],
  path: ['Front path', 'Tiled or stone paths laid on a proper base, falling away from the house.', L.patio],
  patio: ['Patio', 'Porcelain or stone on a compacted sub-base and full mortar bed.', L.patio],
  decking: ['Decking', 'Timber or composite decks on frames with ventilation and drainage underneath.', L.deck],
  shed: ['Shed / garden room', 'Built on a level base, with power and insulation if you want it.', L.shed],
  binstore: ['Bike & bin store', 'Built to measure for your bins and bikes, with lockable doors and an optional living sedum roof.', L.store],
  decorating: ['Decorating – plastering & painting', 'Cracked or blown plaster cut out and made good, or the whole wall re-skimmed, then a mist coat and finish coats so the repair disappears.', L.plas],
  walkin: ['Walk-in shower', 'Low-profile tray or wet-room floor, fully tanked before tiling, with a fixed glass panel and a ceiling rain head.', L.shower],
  fuseboard: ['Fuse board (consumer unit)', 'Old fuse boards replaced with a modern consumer unit with RCD protection, then the circuits tested and certified.', 'electrics'],
  boiler: ['Boiler & central heating', 'New combi or system boilers, radiators and full central heating systems, flushed and balanced. Gas work is done by a Gas Safe registered engineer.', 'plumbing-fittings'],
  eaves: ['Eaves storage', 'Cupboards built into the low space under the roof slope, lined, with doors to match the room.', L.ward],
  outsidetap: ['Outside tap', 'With a double check valve to protect your drinking water.', L.tap],
  outdoorsocket: ['Outdoor socket', 'Weatherproof and RCD protected, tested and certified.', L.sock]
};

/* ------------------------------------------------------------------ renderer */
const stage = document.getElementById('h3-stage');
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.matchMedia('(pointer: coarse)').matches ? 1.5 : 1.75));
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = .98;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
stage.prepend(renderer.domElement);
const MAXANI = renderer.capabilities.getMaxAnisotropy();
const LOW = window.matchMedia('(pointer: coarse)').matches || (navigator.hardwareConcurrency || 8) <= 4;

const scene = new THREE.Scene();
scene.background = new THREE.Color('#c9dbe8');
scene.fog = new THREE.Fog('#c9dbe8', 35, 90);
const camera = new THREE.PerspectiveCamera(70, 1, 0.05, 200);
/* soft image-based lighting so metal, glass and gloss reflect something real */
(function () {
  const env = new THREE.Scene();
  const geo = new THREE.SphereGeometry(50, 32, 16); const cols = []; const pos = geo.attributes.position;
  const top = new THREE.Color('#dfeaf5'), mid = new THREE.Color('#f3efe8'), bot = new THREE.Color('#7d705f');
  for (let i = 0; i < pos.count; i++) { const y = pos.getY(i) / 50; const c = y > 0 ? mid.clone().lerp(top, y) : mid.clone().lerp(bot, -y); cols.push(c.r, c.g, c.b); }
  geo.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
  env.add(new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide })));
  const panel = (x, y, z, w, h, k) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(k, k, k * .95), side: THREE.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 0, 0); env.add(m); };
  panel(0, 30, 0, 30, 30, 2.2); panel(30, 12, 10, 18, 12, 1.6); panel(-25, 10, -20, 14, 10, 1.2);
  const pm = new THREE.PMREMGenerator(renderer);
  scene.environment = pm.fromScene(env, .03).texture;
})();
camera.rotation.order = 'YXZ';

/* ------------------------------------------------------------------ textures */
function rnd(seed) { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; }
function tex(size, draw, opts) {
  const c = document.createElement('canvas'); c.width = c.height = size;
  const g = c.getContext('2d'); draw(g, size);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = MAXANI;
  if (!(opts && opts.linear)) t.encoding = THREE.sRGBEncoding;
  return t;
}
function noise(g, s, base, amt, n, seed) {
  g.fillStyle = base; g.fillRect(0, 0, s, s);
  const r = rnd(seed || 7);
  for (let i = 0; i < n; i++) {
    const v = (r() - .5) * amt; g.fillStyle = v > 0 ? `rgba(255,255,255,${v})` : `rgba(0,0,0,${-v})`;
    g.fillRect(r() * s, r() * s, 1 + r() * 2, 1 + r() * 2);
  }
}
const T = {
  plaster: tex(256, (g, s) => noise(g, s, '#efe9e0', .06, 6000, 3)),
  ceiling: tex(256, (g, s) => noise(g, s, '#f6f3ee', .04, 4000, 5)),
  wood: tex(512, (g, s) => {
    const r = rnd(11); const pw = s / 6;
    for (let row = 0; row < 6; row++) {
      let x = -r() * s;
      while (x < s) {
        const len = s * (.5 + r() * .6); const tone = 120 + r() * 40;
        g.fillStyle = `rgb(${tone + 40},${tone},${tone - 50})`; g.fillRect(x, row * pw, len, pw);
        for (let k = 0; k < 14; k++) { g.strokeStyle = `rgba(70,40,15,${.05 + r() * .12})`; g.lineWidth = 1 + r(); g.beginPath(); const yy = row * pw + r() * pw; g.moveTo(x, yy); g.bezierCurveTo(x + len * .3, yy + r() * 6 - 3, x + len * .6, yy + r() * 6 - 3, x + len, yy); g.stroke(); }
        g.fillStyle = 'rgba(40,25,10,.55)'; g.fillRect(x, row * pw, 2, pw);
        x += len;
      }
      g.fillStyle = 'rgba(40,25,10,.5)'; g.fillRect(0, row * pw, s, 1.5);
    }
  }),
  oak: tex(256, (g, s) => { const r = rnd(4); g.fillStyle = '#b98a57'; g.fillRect(0, 0, s, s); for (let i = 0; i < 70; i++) { g.strokeStyle = `rgba(90,55,25,${.08 + r() * .15})`; g.beginPath(); const y = r() * s; g.moveTo(0, y); g.bezierCurveTo(s * .3, y + r() * 8 - 4, s * .7, y + r() * 8 - 4, s, y); g.stroke(); } }),
  victorian: tex(512, (g, s) => {
    const n = 8, c = s / n; const cols = ['#a8442f', '#1d1d1d', '#e9dcc3', '#2f4a6b'];
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      g.fillStyle = cols[(i + j) % 2 ? 0 : 2]; g.fillRect(i * c, j * c, c, c);
      g.fillStyle = cols[(i + j) % 2 ? 1 : 3]; g.beginPath(); g.moveTo(i * c + c / 2, j * c + 6); g.lineTo(i * c + c - 6, j * c + c / 2); g.lineTo(i * c + c / 2, j * c + c - 6); g.lineTo(i * c + 6, j * c + c / 2); g.closePath(); g.fill();
      g.strokeStyle = '#cfc6b4'; g.lineWidth = 2; g.strokeRect(i * c, j * c, c, c);
    }
  }),
  metro: tex(512, (g, s) => {
    g.fillStyle = '#d9d6cf'; g.fillRect(0, 0, s, s);
    const h = s / 16, w = s / 4; const r = rnd(9);
    for (let row = 0; row < 16; row++) for (let k = -1; k < 5; k++) {
      const x = k * w + (row % 2 ? w / 2 : 0); const v = 242 + r() * 10;
      g.fillStyle = `rgb(${v},${v},${v - 3})`; g.fillRect(x + 2, row * h + 2, w - 4, h - 4);
      g.fillStyle = 'rgba(255,255,255,.5)'; g.fillRect(x + 4, row * h + 3, w - 10, 2);
    }
  }),
  bigtile: tex(512, (g, s) => {
    g.fillStyle = '#9a958d'; g.fillRect(0, 0, s, s); const r = rnd(21); const n = 2, c = s / n;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { const v = 170 + r() * 14; g.fillStyle = `rgb(${v},${v - 2},${v - 6})`; g.fillRect(i * c + 2, j * c + 2, c - 4, c - 4); }
    noise(g, 0, 'rgba(0,0,0,0)', 0, 0); const r2 = rnd(5); for (let k = 0; k < 4000; k++) { g.fillStyle = `rgba(0,0,0,${r2() * .05})`; g.fillRect(r2() * s, r2() * s, 2, 2); }
  }),
  carpet: tex(256, (g, s) => noise(g, s, '#b8ab98', .14, 16000, 13)),
  carpet2: tex(256, (g, s) => noise(g, s, '#8f9aa1', .14, 16000, 17)),
  runner: tex(256, (g, s) => { noise(g, s, '#28374a', .12, 12000, 19); g.fillStyle = '#c9a46a'; g.fillRect(0, 0, 10, s); g.fillRect(s - 10, 0, 10, s); }),
  brick: tex(512, (g, s) => {
    g.fillStyle = '#b8ad97'; g.fillRect(0, 0, s, s); const r = rnd(31);
    const rows = 13, bh = s / rows, bw = s / 4.4;
    for (let row = 0; row < rows; row++) for (let k = -1; k < 6; k++) {
      const x = k * bw + (row % 2 ? bw / 2 : 0); const base = r();
      const cr = 196 + base * 30, cg = 168 + base * 26, cb = 112 + base * 22;
      g.fillStyle = `rgb(${cr | 0},${cg | 0},${cb | 0})`; g.fillRect(x + 3, row * bh + 3, bw - 6, bh - 6);
      for (let q = 0; q < 30; q++) { g.fillStyle = `rgba(${r() > .5 ? '90,70,40' : '255,240,210'},${r() * .25})`; g.fillRect(x + 3 + r() * (bw - 8), row * bh + 3 + r() * (bh - 8), 2, 2); }
      if (r() > .86) { g.fillStyle = 'rgba(60,40,20,.25)'; g.fillRect(x + 3, row * bh + 3, bw - 6, bh - 6); }
    }
  }),
  grass: tex(256, (g, s) => { noise(g, s, '#4f7a37', .25, 20000, 41); const r = rnd(43); for (let i = 0; i < 1500; i++) { g.strokeStyle = `rgba(${r() > .5 ? '120,170,80' : '40,70,25'},.5)`; g.beginPath(); const x = r() * s, y = r() * s; g.moveTo(x, y); g.lineTo(x + r() * 3 - 1.5, y - 3 - r() * 4); g.stroke(); } }),
  paving: tex(512, (g, s) => { g.fillStyle = '#8b857c'; g.fillRect(0, 0, s, s); const r = rnd(51); const c = s / 4; for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { const v = 175 + r() * 25; g.fillStyle = `rgb(${v},${v - 6},${v - 16})`; g.fillRect(i * c + 3, j * c + 3, c - 6, c - 6); } const r2 = rnd(52); for (let k = 0; k < 6000; k++) { g.fillStyle = `rgba(0,0,0,${r2() * .06})`; g.fillRect(r2() * s, r2() * s, 2, 2); } }),
  decking: tex(512, (g, s) => { const r = rnd(61); const n = 8, w = s / n; for (let i = 0; i < n; i++) { const v = 120 + r() * 30; g.fillStyle = `rgb(${v + 30},${v + 5},${v - 30})`; g.fillRect(0, i * w, s, w - 4); g.fillStyle = 'rgba(30,20,10,.7)'; g.fillRect(0, i * w + w - 4, s, 4); for (let k = 0; k < 6; k++) { g.fillStyle = 'rgba(60,35,15,.2)'; g.fillRect(0, i * w + 4 + k * 6, s, 1); } } }),
  slate: tex(512, (g, s) => { g.fillStyle = '#2f3236'; g.fillRect(0, 0, s, s); const r = rnd(71); const rows = 10, h = s / rows, w = s / 6; for (let row = 0; row < rows; row++) for (let k = -1; k < 7; k++) { const x = k * w + (row % 2 ? w / 2 : 0); const v = 60 + r() * 22; g.fillStyle = `rgb(${v},${v + 3},${v + 8})`; g.fillRect(x + 2, row * h + 2, w - 4, h - 3); } }),
  shaker: tex(256, (g, s) => { g.fillStyle = '#3f5b4c'; g.fillRect(0, 0, s, s); g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = 6; g.strokeRect(30, 30, s - 60, s - 60); g.strokeStyle = 'rgba(255,255,255,.12)'; g.lineWidth = 3; g.strokeRect(36, 36, s - 72, s - 72); g.fillStyle = 'rgba(0,0,0,.6)'; g.fillRect(0, 0, s, 3); g.fillRect(0, 0, 3, s); }),
  quartz: tex(256, (g, s) => { noise(g, s, '#efede8', .08, 5000, 81); const r = rnd(83); for (let i = 0; i < 12; i++) { g.strokeStyle = `rgba(150,150,150,${.1 + r() * .15})`; g.beginPath(); g.moveTo(r() * s, 0); g.bezierCurveTo(r() * s, s * .3, r() * s, s * .7, r() * s, s); g.stroke(); } }),
  fence: tex(256, (g, s) => { const r = rnd(91); const n = 10, w = s / n; for (let i = 0; i < n; i++) { const v = 105 + r() * 25; g.fillStyle = `rgb(${v + 20},${v},${v - 25})`; g.fillRect(i * w, 0, w - 3, s); g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(i * w + w - 3, 0, 3, s); } }),
  washer: tex(256, (g, s) => { g.fillStyle = '#f3f3f1'; g.fillRect(0, 0, s, s); g.fillStyle = '#d8d8d4'; g.fillRect(0, 0, s, 46); g.fillStyle = '#2a2d30'; g.fillRect(150, 12, 80, 20); g.beginPath(); g.arc(s / 2, s * .6, 80, 0, Math.PI * 2); g.fillStyle = '#c2c6c9'; g.fill(); g.beginPath(); g.arc(s / 2, s * .6, 62, 0, Math.PI * 2); g.fillStyle = '#2b3a45'; g.fill(); g.beginPath(); g.arc(s / 2 - 18, s * .6 - 18, 18, 0, Math.PI * 2); g.fillStyle = 'rgba(255,255,255,.25)'; g.fill(); }),
  oven: tex(256, (g, s) => { g.fillStyle = '#1b1c1e'; g.fillRect(0, 0, s, s); g.fillStyle = '#c9c9c9'; g.fillRect(20, 30, s - 40, 10); g.fillStyle = '#0c0d0f'; g.fillRect(30, 60, s - 60, s - 90); g.fillStyle = 'rgba(255,170,80,.25)'; g.fillRect(40, 70, s - 80, s - 110); }),
  hob: tex(256, (g, s) => { g.fillStyle = '#111214'; g.fillRect(0, 0, s, s); g.strokeStyle = '#555'; g.lineWidth = 3; [[64, 64, 40], [190, 64, 30], [64, 190, 30], [190, 190, 40]].forEach(([x, y, r]) => { g.beginPath(); g.arc(x, y, r, 0, 7); g.stroke(); }); }),
  sedum: tex(256, (g, s) => { noise(g, s, '#5f8f47', .3, 15000, 101); const r = rnd(103); for (let i = 0; i < 300; i++) { g.fillStyle = ['#a3c96b', '#c98b6b', '#7db86a', '#d9c36a'][i % 4]; g.beginPath(); g.arc(r() * s, r() * s, 2 + r() * 3, 0, 7); g.fill(); } }),
  road: tex(256, (g, s) => noise(g, s, '#45474a', .2, 20000, 111)),
  render: tex(256, (g, s) => noise(g, s, '#e8e2d6', .07, 6000, 121)),
  damaged: tex(512, (g, s) => {
    noise(g, s, '#efe9e0', .06, 9000, 3);
    const r = rnd(131), cx = s * .5, cy = s * .56;
    const blob = (sc, col, seed) => { const q = rnd(seed); g.fillStyle = col; g.beginPath(); for (let i = 0; i <= 28; i++) { const a = i / 28 * Math.PI * 2, rr = s * sc * (.75 + q() * .4); const x = cx + Math.cos(a) * rr * 1.25, y = cy + Math.sin(a) * rr; i ? g.lineTo(x, y) : g.moveTo(x, y); } g.closePath(); g.fill(); };
    const grd = g.createRadialGradient(cx, cy + s * .08, 10, cx, cy + s * .08, s * .48); grd.addColorStop(0, 'rgba(150,115,70,.28)'); grd.addColorStop(1, 'rgba(150,115,70,0)'); g.fillStyle = grd; g.fillRect(0, 0, s, s);
    blob(.24, '#d6c4ad', 133); blob(.17, '#b9a088', 137); blob(.09, '#a2715a', 139);
    for (let i = 0; i < 90; i++) { const a = r() * Math.PI * 2, rr = s * (.19 + r() * .09); g.fillStyle = `rgba(255,251,244,${.6 + r() * .4})`; g.fillRect(cx + Math.cos(a) * rr * 1.25, cy + Math.sin(a) * rr, 4 + r() * 12, 3 + r() * 8); g.fillStyle = 'rgba(80,60,40,.35)'; g.fillRect(cx + Math.cos(a) * rr * 1.25, cy + Math.sin(a) * rr + 6, 6, 1.5); }
    g.strokeStyle = 'rgba(60,45,32,.85)'; g.lineWidth = 2.2;
    for (let k = 0; k < 6; k++) { let x = cx + (r() - .5) * s * .25, y = cy + (r() - .5) * s * .15; const dx = (r() - .5) * 2, dy = k % 2 ? -1 : 1; g.beginPath(); g.moveTo(x, y); for (let j = 0; j < 12; j++) { x += dx * 14 + (r() - .5) * 18; y += dy * (8 + r() * 16); g.lineTo(x, y); } g.stroke(); g.lineWidth = 1.2; }
  })
};

/* ------------------------------------------------------------------ materials */
function M(o) { const m = new THREE.MeshStandardMaterial(Object.assign({ roughness: .8, metalness: 0 }, o)); if (o.envMapIntensity === undefined) m.envMapIntensity = (o.metalness || 0) > .5 ? .8 : .25; return m; }
const MAT = {
  plaster: M({ map: T.plaster, color: '#e4d3bb', roughness: .95 }), ceiling: M({ map: T.ceiling, roughness: .95 }),
  wood: M({ map: T.wood, roughness: .55 }), oak: M({ map: T.oak, roughness: .5 }), victorian: M({ map: T.victorian, roughness: .35 }),
  metro: M({ map: T.metro, roughness: .25 }), bigtile: M({ map: T.bigtile, roughness: .4 }), carpet: M({ map: T.carpet, roughness: 1 }),
  carpet2: M({ map: T.carpet2, roughness: 1 }), runner: M({ map: T.runner, roughness: 1 }), brick: M({ map: T.brick, roughness: .9 }),
  grass: M({ map: T.grass, roughness: 1 }), paving: M({ map: T.paving, roughness: .85 }), decking: M({ map: T.decking, roughness: .7 }),
  slate: M({ map: T.slate, roughness: .6 }), shaker: M({ map: T.shaker, roughness: .55 }), quartz: M({ map: T.quartz, roughness: .2 }),
  fence: M({ map: T.fence, roughness: .9 }), sedum: M({ map: T.sedum, roughness: 1 }), road: M({ map: T.road, roughness: .95 }), render: M({ map: T.render, roughness: .9 }),
  white: M({ color: '#f4f2ee', roughness: .45 }), gloss: M({ color: '#fbfaf8', roughness: .15 }), porcelain: M({ color: '#ffffff', roughness: .08, metalness: .05 }),
  chrome: M({ color: '#e4e7ea', roughness: .14, metalness: 1, envMapIntensity: .85 }), copper: M({ color: '#d0905a', roughness: .28, metalness: .95, envMapIntensity: .85 }), black: M({ color: '#1a1a1a', roughness: .5 }),
  steel: M({ color: '#c8ccd0', roughness: .28, metalness: .9, envMapIntensity: .85 }), glass: M({ color: '#bcd9e6', roughness: .05, metalness: 0, transparent: true, opacity: .28 }),
  frosted: M({ color: '#e6eef2', roughness: .3, transparent: true, opacity: .7 }), frame: M({ color: '#f7f6f2', roughness: .4 }),
  green: M({ color: '#1f4f3a', roughness: .35 }), navy: M({ color: '#26364a', roughness: .5 }), sofa: M({ color: '#7d8b86', roughness: .95 }),
  rug: M({ color: '#b5866a', roughness: 1 }), linen: M({ color: '#ece7df', roughness: .95 }), throw: M({ color: '#2f5d4a', roughness: .95 }),
  timber: M({ color: '#8a6a48', roughness: .8 }), shed: M({ color: '#55665d', roughness: .8 }), leaf: M({ color: '#2d5524', roughness: .85 }), leaf2: M({ color: '#3d6e2c', roughness: .85 }),
  trunk: M({ color: '#5b4632', roughness: 1 }), soil: M({ color: '#4a3a2b', roughness: 1 }), gutter: M({ color: '#2b2e31', roughness: .4, metalness: .3 }),
  light: M({ color: '#ffffff', emissive: '#fff3dd', emissiveIntensity: 1.2 }), screen: M({ color: '#111', roughness: .2 }),
  washer: M({ map: T.washer, roughness: .3 }), oven: M({ map: T.oven, roughness: .3 }), hob: M({ map: T.hob, roughness: .1 }),
  stone: M({ color: '#d7cfc0', roughness: .8 }),
  metroSage: M({ map: T.metro, color: '#a9c2b2', roughness: .25 }), matBlack: M({ color: '#1d1e20', roughness: .35, metalness: .4 }),
  brass: M({ color: '#c9a45c', roughness: .25, metalness: 1, envMapIntensity: .9 }), sinkIn: M({ color: '#6d7276', roughness: .3, metalness: .8 }),
  string: M({ color: '#6b7a71', roughness: .5 }),
  sage: M({ map: T.plaster, color: '#b4c2a6', roughness: .95 }),
  dGreen: M({ color: '#3d5547', roughness: .45 }), dNavy: M({ color: '#2c3b52', roughness: .45 }), dGrey: M({ color: '#6f7b80', roughness: .45 }),
  dCharcoal: M({ color: '#36383b', roughness: .45 }), dOak: M({ map: T.oak, roughness: .5 }), dPlum: M({ color: '#5b3d45', roughness: .45 }),
  damaged: M({ map: T.damaged, roughness: .95 }), tray: M({ color: '#ebe8e2', roughness: .35 }),
  sky: M({ color: '#dcebf7', emissive: '#b9d6ee', emissiveIntensity: .9, roughness: .2 }),
  bike: M({ color: '#a8362a', roughness: .35, metalness: .3 }), felt: M({ color: '#2a2b2d', roughness: .7 }), pot: M({ color: '#a8553a', roughness: .8 }),
  binBlack: M({ color: '#222426', roughness: .55 }), binGreen: M({ color: '#2f6b3c', roughness: .55 }), binBlue: M({ color: '#2c5a8c', roughness: .55 })
};

/* ------------------------------------------------------------------ helpers */
const picks = [];
const groupsByKey = {};
function scaleUV(geo, w, h, d, s) {
  const uv = geo.attributes.uv; const dims = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];
  for (let f = 0; f < 6; f++) for (let v = 0; v < 4; v++) { const i = f * 4 + v; uv.setXY(i, uv.getX(i) * dims[f][0] / s, uv.getY(i) * dims[f][1] / s); }
  uv.needsUpdate = true;
}
function tag(mesh, key) {
  if (!key) return mesh;
  mesh.material = Array.isArray(mesh.material) ? mesh.material.map(m => m.clone()) : mesh.material.clone();
  mesh.userData.key = key; picks.push(mesh); (groupsByKey[key] = groupsByKey[key] || []).push(mesh);
  return mesh;
}
// box from min corner (x0,y0,z0) with size (w,h,d)
function box(x0, y0, z0, w, h, d, mat, key, o) {
  o = o || {};
  const g = new THREE.BoxGeometry(w, h, d);
  if (o.uv !== false) scaleUV(g, w, h, d, o.uv || 1);
  const m = new THREE.Mesh(g, mat);
  m.position.set(x0 + w / 2, y0 + h / 2, z0 + d / 2);
  m.castShadow = o.cast !== false; m.receiveShadow = true;
  (o.parent || scene).add(m); return tag(m, key);
}
function cyl(x, y, z, r, h, mat, key, o) {
  o = o || {};
  const g = new THREE.CylinderGeometry(o.r2 !== undefined ? o.r2 : r, r, h, o.seg || 20);
  const m = new THREE.Mesh(g, mat); m.position.set(x, y + h / 2, z);
  if (o.rx) m.rotation.x = o.rx; if (o.rz) m.rotation.z = o.rz;
  m.castShadow = true; m.receiveShadow = true; scene.add(m); return tag(m, key);
}
function bush(x, y, z, r, key) {
  const n = 7; for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2, rr = r * (.45 + (i % 3) * .12); sphere(x + Math.cos(a) * r * .45, y + (i % 2) * r * .25, z + Math.sin(a) * r * .45, rr, i % 2 ? MAT.leaf : MAT.leaf2, key, .85); }
  sphere(x, y + r * .35, z, r * .55, MAT.leaf2, key, .9);
}
function rod(a, b, r, mat, key) {
  const dx = b[0] - a[0], dy = b[1] - a[1], dz = b[2] - a[2], len = Math.hypot(dx, dy, dz); const v = new THREE.Vector3(dx / len, dy / len, dz / len);
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 8), mat);
  m.position.set((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), v);
  m.castShadow = true; scene.add(m); return tag(m, key);
}
function sphere(x, y, z, r, mat, key, sy) {
  const m = new THREE.Mesh(new THREE.SphereGeometry(r, 18, 14), mat); m.position.set(x, y, z); if (sy) m.scale.y = sy;
  m.castShadow = true; m.receiveShadow = true; scene.add(m); return tag(m, key);
}

/* collision: list of AABBs per level (0 ground/outside, 1 first floor) */
const SOLID = [[], [], []];
function solid(level, x0, z0, x1, z1) { SOLID[level].push([Math.min(x0, x1), Math.min(z0, z1), Math.max(x0, x1), Math.max(z0, z1)]); }

/* wall along X at depth z (thickness t centred on z) between x0..x1, y0..y1, with gaps [a,b,gy0,gy1] */
function wallX(z, x0, x1, y0, y1, gaps, mat, key, level, o) {
  o = o || {}; const t = o.t || .12; gaps = (gaps || []).slice().sort((a, b) => a[0] - b[0]);
  let cur = x0; const pieces = [];
  gaps.forEach(([a, b, gy0, gy1]) => {
    if (a > cur) pieces.push([cur, a, y0, y1, true]);
    if (gy0 > y0) pieces.push([a, b, y0, gy0, true]);
    if (gy1 < y1) pieces.push([a, b, gy1, y1, false]);
    cur = b;
  });
  if (cur < x1) pieces.push([cur, x1, y0, y1, true]);
  pieces.forEach(([a, b, ya, yb, ground]) => {
    box(a, ya, z - t / 2, b - a, yb - ya, t, mat, key);
    if (ground && level !== undefined && ya <= y0 + .01) solid(level, a, z - t / 2, b, z + t / 2);
    if (o.skirt && ground && ya <= y0 + .01) o.skirt.forEach(side => box(a, y0, side > 0 ? z + t / 2 : z - t / 2 - .02, b - a, .14, .02, MAT.white, 'skirting', { uv: false }));
  });
}
function wallZ(x, z0, z1, y0, y1, gaps, mat, key, level, o) {
  o = o || {}; const t = o.t || .12; gaps = (gaps || []).slice().sort((a, b) => a[0] - b[0]);
  let cur = z0; const pieces = [];
  gaps.forEach(([a, b, gy0, gy1]) => {
    if (a > cur) pieces.push([cur, a, y0, y1, true]);
    if (gy0 > y0) pieces.push([a, b, y0, gy0, true]);
    if (gy1 < y1) pieces.push([a, b, gy1, y1, false]);
    cur = b;
  });
  if (cur < z1) pieces.push([cur, z1, y0, y1, true]);
  pieces.forEach(([a, b, ya, yb, ground]) => {
    box(x - t / 2, ya, a, t, yb - ya, b - a, mat, key);
    if (ground && level !== undefined && ya <= y0 + .01) solid(level, x - t / 2, a, x + t / 2, b);
    if (o.skirt && ground && ya <= y0 + .01) o.skirt.forEach(side => box(side > 0 ? x + t / 2 : x - t / 2 - .02, y0, a, .02, .14, b - a, MAT.white, 'skirting', { uv: false }));
  });
}
function shellWall(z, gaps) {
  wallX(z, 0, W, 0, G1, gaps.filter(g => g[3] <= G1 + .01), MAT.brick, null, 0, { t: .2 });
  box(0, G1, z - .1, W, F1 - G1, .2, MAT.brick, null, { uv: 1 });
  wallX(z, 0, W, F1, C1, gaps.filter(g => g[2] >= F1), MAT.brick, null, undefined, { t: .2 });
  box(0, C1, z - .1, W, TOP - C1, .2, MAT.brick, null, { uv: 1 });
}
/* window: glass + frame in a wall opening on plane z (alongX) or x */
function windowX(z, a, b, y0, y1, frosted) {
  box(a, y0, z - .03, b - a, y1 - y0, .02, frosted ? MAT.frosted : MAT.glass, null, { uv: false, cast: false });
  const f = .06; box(a, y0, z - .06, b - a, f, .12, MAT.frame, null, { uv: false }); box(a, y1 - f, z - .06, b - a, f, .12, MAT.frame, null, { uv: false });
  box(a, y0, z - .06, f, y1 - y0, .12, MAT.frame, null, { uv: false }); box(b - f, y0, z - .06, f, y1 - y0, .12, MAT.frame, null, { uv: false });
  const n = Math.max(1, Math.round((b - a) / 1.2)); for (let i = 1; i < n; i++) box(a + (b - a) * i / n - f / 2, y0, z - .05, f, y1 - y0, .1, MAT.frame, null, { uv: false });
  box(a, (y0 + y1) / 2 - .02, z - .05, b - a, .04, .1, MAT.frame, null, { uv: false });
  box(a - .04, y0 - .04, z - .2, b - a + .08, .04, .3, MAT.stone, null, { uv: false });
}
/* doors that open and close: click one, or walk into a closed one.
   ax 'x' = door in a wall running along x at depth p, opening a..b; ax 'z' = wall along z at x=p.
   side +1 swings towards +z (ax x) or +x (ax z). hingeB hangs it on the b end. */
const DOORS = [];
function makeDoor(o) {
  const w = o.b - o.a, h = o.h || 2.03, t = o.t || .045, dir = o.hingeB ? -1 : 1;
  const pivot = new THREE.Group(), inner = new THREE.Group(); pivot.add(inner);
  if (o.ax === 'x') pivot.position.set(o.hingeB ? o.b : o.a, o.y0, o.p);
  else { pivot.position.set(o.p, o.y0, o.hingeB ? o.b : o.a); inner.rotation.y = -Math.PI / 2; }
  scene.add(pivot);
  const d = { o, pivot, level: o.level, open: !!o.open, key: o.key, ang: o.side * (o.ax === 'x' ? -1 : 1) * dir * Math.PI / 2 };
  d.box = o.ax === 'x' ? [o.a, o.p - .07, o.b, o.p + .07] : [o.p - .07, o.a, o.p + .07, o.b];
  const x0 = dir > 0 ? 0 : -w, P = { parent: inner, uv: false };
  const add = (x, y, z, ww, hh, dd, mat) => { const m = box(x, y, z, ww, hh, dd, mat, o.key, P); m.userData.door = d; return m; };
  d.add = add;
  if (o.glazed) {
    const f = .085, kick = .42, gw = w - 2 * f, gh = h - kick - f;
    add(x0, 0, -t / 2, f, h, t, o.mat); add(x0 + w - f, 0, -t / 2, f, h, t, o.mat);
    add(x0 + f, 0, -t / 2, gw, kick, t, o.mat); add(x0 + f, h - f, -t / 2, gw, f, t, o.mat);
    add(x0 + f, kick, -.006, gw, gh, .012, MAT.glass);
    add(x0 + f + gw / 2 - .016, kick, -.022, .032, gh, .044, o.mat);
    for (let i = 1; i < 4; i++) add(x0 + f, kick + gh * i / 4 - .016, -.022, gw, .032, .044, o.mat);
  } else if (o.slatted) {
    add(x0, 0, -.008, w, h, .016, MAT.timber);
    for (let x = .03; x < w - .06; x += .115) add(x0 + x, .03, -t / 2, .085, h - .06, t, MAT.oak);
  } else {
    add(x0, 0, -t / 2, w, h, t, o.mat);
    [[.14, .8], [1.0, h - .14]].forEach(([ya, yb]) => [-1, 1].forEach(sd => add(x0 + .12, ya, sd > 0 ? t / 2 : -t / 2 - .008, w - .24, yb - ya, .008, o.mat)));
  }
  if (!o.slatted) {
    const hx = dir > 0 ? w - .1 : -w + .04, hm = o.handle || MAT.chrome;
    [-1, 1].forEach(sd => { add(hx, .96, sd > 0 ? t / 2 : -t / 2 - .045, .06, .03, .045, hm); add(dir > 0 ? hx - .08 : hx, .965, sd > 0 ? t / 2 + .03 : -t / 2 - .045, .14, .02, .015, hm); });
  }
  d.cur = d.open ? d.ang : 0; pivot.rotation.y = d.cur;
  DOORS.push(d); return d;
}
function pair(a, b) { a.pair = b; b.pair = a; }
function architraveX(z, a, b, y0) { [-1, 1].forEach(s => { const zz = s > 0 ? z + .06 : z - .08; box(a - .07, y0, zz, .07, 2.1, .02, MAT.white, 'architrave', { uv: false }); box(b, y0, zz, .07, 2.1, .02, MAT.white, 'architrave', { uv: false }); box(a - .07, y0 + 2.05, zz, b - a + .14, .07, .02, MAT.white, 'architrave', { uv: false }); }); }
function architraveZ(x, a, b, y0) { [-1, 1].forEach(s => { const xx = s > 0 ? x + .06 : x - .08; box(xx, y0, a - .07, .02, 2.1, .07, MAT.white, 'architrave', { uv: false }); box(xx, y0, b, .02, 2.1, .07, MAT.white, 'architrave', { uv: false }); box(xx, y0 + 2.05, a - .07, .02, .07, b - a + .14, MAT.white, 'architrave', { uv: false }); }); }
function radiatorX(z, a, len, y0, side) { const zz = side > 0 ? z + .08 : z - .18; const g = new THREE.Group(); box(a, y0 + .15, zz, len, .6, .1, MAT.gloss, 'radiator', { uv: false }); for (let x = a + .05; x < a + len; x += .08) box(x, y0 + .15, side > 0 ? zz + .1 : zz - .01, .02, .6, .01, MAT.white, 'radiator', { uv: false }); cyl(a + .03, y0, zz + .05, .015, .15, MAT.chrome, 'radiator'); }
function radiatorZ(x, a, len, y0, side) { const xx = side > 0 ? x + .08 : x - .18; box(xx, y0 + .15, a, .1, .6, len, MAT.gloss, 'radiator', { uv: false }); for (let z = a + .05; z < a + len; z += .08) box(side > 0 ? xx + .1 : xx - .01, y0 + .15, z, .01, .6, .02, MAT.white, 'radiator', { uv: false }); }
function socketX(z, x, y0, side) { box(x, y0 + .3, side > 0 ? z + .06 : z - .075, .14, .085, .015, MAT.white, 'socket', { uv: false }); }
function socketZ(x, z, y0, side) { box(side > 0 ? x + .06 : x - .075, y0 + .3, z, .015, .085, .14, MAT.white, 'socket', { uv: false }); }
function downlights(x0, z0, x1, z1, y, nx, nz) { for (let i = 0; i < nx; i++) for (let j = 0; j < nz; j++) cyl(x0 + (x1 - x0) * (i + .5) / nx, y - .012, z0 + (z1 - z0) * (j + .5) / nz, .045, .012, MAT.light, 'downlight'); }
function pointLight(x, y, z, i, d) { if (LOW) return; const l = new THREE.PointLight('#ffe7c4', i, d, 2); l.position.set(x, y, z); scene.add(l); }

/* ------------------------------------------------------------------ dimensions */
// House: x 0..8 (width), z 0..12 (depth). Ground floor 0..2.5, slab 2.5..2.7, first floor 2.7..5.2, slab 5.2..5.4, roof above.
const W = 8, D = 12, G1 = 2.5, F1 = 2.7, C1 = 5.2, TOP = 5.4;
const STAIR = { x0: .12, x1: 1.1, z0: 1.5, z1: 5.5 };
const STAIRS = [Object.assign({ from: 0, to: 1, base: 0, rise: F1, blockTo: 6 }, STAIR),
  { x0: 4.1, x1: 4.93, z0: 7.6, z1: 10.6, from: 1, to: 2, base: F1, rise: TOP - F1, blockTo: D }];

/* ------------------------------------------------------------------ outside: street, gardens, neighbours */
box(-30, -.1, -40, 70, .1, 30, MAT.road, null, { uv: 4 });
box(-30, -.05, -9.4, 70, .1, 2.4, MAT.paving, null, { uv: 2.4 });
box(-30, -.05, -10, 70, .15, .15, MAT.stone, null, { uv: false });
// front garden
box(0, -.1, -7, W, .1, 7, MAT.grass, null, { uv: 2 });
box(.85, -.05, -7, 1.2, .07, 7, MAT.victorian, 'path', { uv: .8 });
box(2.3, -.05, -5.85, 5.4, .06, 1.25, MAT.paving, 'patio', { uv: 1.2 });
// front wall + gate
wallX(-7, 0, W, -.05, .75, [[.85, 2.05, -.05, 2]], MAT.brick, 'gate', 0, { t: .25 });
box(.85, 0, -7.03, .05, 1, .06, MAT.black, 'gate', { uv: false });
for (let x = .9; x < 2.05; x += .09) box(x, .05, -7.02, .025, .9, .025, MAT.black, 'gate', { uv: false });
box(.85, .9, -7.03, 1.2, .04, .05, MAT.black, 'gate', { uv: false });
// bike & bin store: open fronted bays with doors, bins and a bike inside, sedum roof
function wheelieBin(cx, cz, mat) {
  const k = 'binstore';
  box(cx - .29, .08, cz - .34, .58, .92, .64, mat, k, { uv: false });
  box(cx - .31, 1.0, cz - .37, .62, .05, .72, mat, k, { uv: false });
  box(cx - .26, .9, cz + .3, .52, .04, .07, mat, k, { uv: false });
  [-1, 1].forEach(sd => cyl(cx + sd * .32, .07, cz + .24, .1, .06, MAT.black, k, { rz: Math.PI / 2 }));
}
function bikeAt(cx, cz) {
  const k = 'binstore', fr = MAT.bike;
  const RW = [cx - .53, .34, cz], FW = [cx + .53, .34, cz], BB = [cx - .08, .3, cz], S = [cx - .2, .86, cz], H = [cx + .38, .84, cz];
  [RW, FW].forEach(p => {
    const w = new THREE.Mesh(new THREE.TorusGeometry(.31, .026, 8, 36), MAT.black); w.position.set(p[0], p[1], p[2]); w.castShadow = true; scene.add(w); tag(w, k);
    for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI; rod([p[0] + Math.cos(a) * .29, p[1] + Math.sin(a) * .29, p[2]], [p[0] - Math.cos(a) * .29, p[1] - Math.sin(a) * .29, p[2]], .004, MAT.steel, k); }
  });
  rod(RW, BB, .018, fr, k); rod(RW, S, .016, fr, k); rod(BB, S, .022, fr, k); rod(S, H, .022, fr, k); rod(BB, H, .026, fr, k); rod(H, FW, .018, MAT.steel, k);
  rod([S[0], S[1], cz], [S[0] - .03, S[1] + .12, cz], .014, MAT.steel, k); box(S[0] - .16, S[1] + .12, cz - .06, .24, .05, .12, MAT.black, k, { uv: false });
  rod(H, [H[0] - .04, H[1] + .15, cz], .016, MAT.steel, k); rod([H[0] - .04, H[1] + .15, cz - .24], [H[0] - .04, H[1] + .15, cz + .24], .014, MAT.black, k);
  rod([BB[0], BB[1], cz - .12], [BB[0], BB[1], cz + .12], .012, MAT.steel, k);
}
(function () {
  const x0 = 3.0, x1 = 7.6, z0 = -6.85, z1 = -5.85, h = 1.4, k = 'binstore';
  box(x0, 0, z0, x1 - x0, .05, z1 - z0, MAT.paving, k, { uv: .6 });
  box(x0, 0, z0, x1 - x0, h, .04, MAT.timber, k, { uv: .5 });
  [3.0, 4.9, 5.8, 6.7, x1 - .05].forEach(a => box(a, 0, z0, .05, h, z1 - z0, MAT.timber, k, { uv: .5 }));
  for (let y = .06; y < h; y += .11) { box(x0 - .03, y, z0, .03, .07, z1 - z0, MAT.oak, k, { uv: false }); box(x1, y, z0, .03, .07, z1 - z0, MAT.oak, k, { uv: false }); }
  box(x0 - .06, h, z0 - .04, x1 - x0 + .12, .06, z1 - z0 + .1, MAT.black, k, { uv: false });
  box(x0, h + .06, z0, x1 - x0, .08, z1 - z0, MAT.sedum, k, { uv: .5 });
  for (let i = 0; i < 40; i++) sphere(x0 + .1 + (i * .113) % (x1 - x0 - .2), h + .16, z0 + .12 + ((i * 37) % 8) / 10, .06, i % 3 ? MAT.leaf : MAT.sedum, k, .6);
  solid(0, x0 - .03, z0, x1 + .03, z1);
  const zp = z1 + .03, dy = .05, dh = h - .1;
  pair(makeDoor({ ax: 'x', p: zp, a: 3.05, b: 3.95, y0: dy, h: dh, side: 1, key: k, level: 0, open: true, slatted: true }),
       makeDoor({ ax: 'x', p: zp, a: 3.95, b: 4.85, y0: dy, h: dh, side: 1, key: k, level: 0, open: true, slatted: true, hingeB: true }));
  [[4.95, 5.75], [5.85, 6.65], [6.75, 7.55]].forEach(([a, b]) => makeDoor({ ax: 'x', p: zp, a, b, y0: dy, h: dh, side: 1, key: k, level: 0, open: true, slatted: true }));
  bikeAt(3.95, -6.4);
  wheelieBin(5.35, -6.4, MAT.binBlack); wheelieBin(6.25, -6.4, MAT.binGreen); wheelieBin(7.15, -6.4, MAT.binBlue);
})();
// hedges + plants front
bush(7.3, .45, -2.2, .6); bush(3, .35, -1, .45); bush(6.4, .3, -.9, .38);
// rear garden
box(0, -.06, D, W, .06, 2.6, MAT.paving, 'patio', { uv: 1.2 });
box(0, -.1, D + 2.6, W, .1, 6.4, MAT.grass, null, { uv: 2 });
box(4.6, 0, D + 2.6, 3.4, .16, 2.8, MAT.decking, 'decking', { uv: 1.2 });
for (let x = 4.7; x < 8; x += .6) box(x, 0, D + 2.62, .08, .14, 2.76, MAT.timber, 'decking', { uv: false });
// fences
[[0, D, 0, D + 9], [W, D, W, D + 9]].forEach(([x, za, , zb]) => { box(x - .04, 0, za, .04, 1.8, zb - za, MAT.fence, 'fence', { uv: 1 }); solid(0, x - .05, za, x + .05, zb); });
box(0, 0, D + 9, W, 1.8, .04, MAT.fence, 'fence', { uv: 1 }); solid(0, 0, D + 9 - .05, W, D + 9 + .05);
for (let z = D; z <= D + 9; z += 2.25) { box(-.06, 0, z - .05, .1, 1.9, .1, MAT.timber, 'fence', { uv: false }); box(W - .04, 0, z - .05, .1, 1.9, .1, MAT.timber, 'fence', { uv: false }); }
// shed
(function () {
  const x0 = .4, z0 = D + 6.3, w = 2.6, d = 2.2;
  box(x0, 0, z0, w, 2.1, d, MAT.shed, 'shed', { uv: .3 }); solid(0, x0, z0, x0 + w, z0 + d);
  box(x0 + .9, 0, z0 - .02, .85, 1.85, .03, MAT.navy, 'shed', { uv: false });
  box(x0 + .2, 1.1, z0 - .02, .55, .55, .02, MAT.glass, 'shed', { uv: false });
  const roof = box(x0 - .15, 2.1, z0 - .15, w + .3, .08, d + .3, MAT.black, 'shed', { uv: false }); roof.rotation.x = -.06;
})();
// tree + beds
cyl(6.6, 0, D + 7.6, .14, 2.4, MAT.trunk); bush(6.6, 2.9, D + 7.6, 1.5); bush(6.1, 2.5, D + 7.2, 1.0);
box(.1, 0, D + 2.7, .8, .3, 3.4, MAT.soil); for (let z = D + 3; z < D + 6; z += .7) bush(.5, .4, z, .35);
// garden table
box(1.8, .72, D + .8, 1.2, .04, .8, MAT.timber); [[1.85, D + .85], [2.9, D + .85], [1.85, D + 1.5], [2.9, D + 1.5]].forEach(([x, z]) => box(x, 0, z, .05, .72, .05, MAT.black, null, { uv: false }));
// neighbours (solid shells either side)
[[-8.2, -.2], [W + .2, W + 8.2]].forEach(([a, b]) => {
  box(a, 0, 0, b - a, TOP, D, MAT.brick, null, { uv: 1 });
  const roofG = new THREE.Mesh(new THREE.CylinderGeometry(.01, 6.6, 3.2, 4, 1, false, Math.PI / 4), MAT.slate); roofG.position.set((a + b) / 2, TOP + 1.6, D / 2); roofG.scale.set((b - a) / 9.3, 1, D / 9.3); roofG.castShadow = true; scene.add(roofG);
  box(a, -.05, -7, b - a, .06, 7, MAT.paving, null, { uv: 1.2 });
  wallX(-7, a, b, -.05, .75, [], MAT.brick, null, 0, { t: .25 });
});
box(-.2, 0, -7, .2, 1, 7, MAT.brick, null, { uv: 1 }); solid(0, -.3, -7, 0, 0);
box(W, 0, -7, .2, 1, 7, MAT.brick, null, { uv: 1 }); solid(0, W, -7, W + .3, 0);

/* ------------------------------------------------------------------ house shell (party walls, front, back) */
// party walls x=0 and x=W (plaster inside, brick outside the house line)
wallZ(-.06, 0, D, 0, TOP, [], MAT.sage, 'plaster', 0, { t: .12 }); solid(1, -.12, 0, 0, D);
wallZ(W + .06, 0, D, 0, TOP, [], MAT.plaster, 'plaster', 0, { t: .12 }); solid(1, W, 0, W + .12, D);
// front wall z=0: brick outer skin + plaster inner
const FRONT_G = [[.9, 1.9, 0, 2.2], [3.4, 7, .75, 2.25], [.5, 1.6, F1 + 1, F1 + 2.05], [3.4, 7, F1 + .85, F1 + 2.2]];
shellWall(-.16, FRONT_G);
wallX(-.03, 0, W, 0, G1, FRONT_G.filter(g => g[2] < G1), MAT.plaster, 'plaster', undefined, { t: .06, skirt: [1] });
wallX(-.03, 0, W, F1, C1, FRONT_G.filter(g => g[2] > G1), MAT.plaster, 'plaster', 1, { t: .06, skirt: [1] });
windowX(-.12, 3.4, 7, .75, 2.25); windowX(-.12, .5, 1.6, F1 + 1, F1 + 2.05); windowX(-.12, 3.4, 7, F1 + .85, F1 + 2.2);
// fanlight + front door (open inward)
box(.9, 2.05, -.14, 1, .15, .02, MAT.glass, null, { uv: false, cast: false });
const FRONT = makeDoor({ ax: 'x', p: -.12, a: .9, b: 1.9, y0: 0, h: 2.03, t: .06, side: 1, mat: MAT.green, key: 'frontdoor', level: 0, open: false, handle: MAT.copper });
FRONT.add(.3, 1.05, -.042, .4, .07, .012, MAT.copper); FRONT.add(.44, 1.5, -.045, .12, .16, .015, MAT.copper);
box(.82, 0, -.3, 1.16, .12, .3, MAT.stone, 'frontdoor', { uv: false });
// porch light
sphere(2.2, 2.2, -.32, .08, MAT.light);
// back wall z=D
const BACK_G = [[1.5, 3, .9, 2.2], [5, 7, 0, 2.2], [2.2, 3.2, F1 + 1.1, F1 + 2.0], [5.2, 6.8, F1 + .9, F1 + 2.1]];
shellWall(D + .16, BACK_G);
wallX(D + .03, 0, W, 0, G1, BACK_G.filter(g => g[2] < G1), MAT.plaster, 'plaster', undefined, { t: .06 });
wallX(D + .03, 0, W, F1, C1, BACK_G.filter(g => g[2] > G1), MAT.plaster, 'plaster', 1, { t: .06 });
windowX(D + .12, 1.5, 3, .9, 2.2); windowX(D + .12, 2.2, 3.2, F1 + 1.1, F1 + 2.0, true); windowX(D + .12, 5.2, 6.8, F1 + .9, F1 + 2.1);
// French doors (open outward)
box(5, 0, D + .02, .07, 2.2, .22, MAT.frame, 'frenchdoors', { uv: false }); box(6.93, 0, D + .02, .07, 2.2, .22, MAT.frame, 'frenchdoors', { uv: false });
box(5, 2.12, D + .02, 2, .08, .22, MAT.frame, 'frenchdoors', { uv: false });
box(4.95, 0, D + .02, 2.1, .03, .32, MAT.stone, 'frenchdoors', { uv: false });
pair(makeDoor({ ax: 'x', p: D + .14, a: 5.07, b: 6.0, y0: .03, h: 2.09, t: .056, side: 1, mat: MAT.frame, key: 'frenchdoors', level: 0, glazed: true }),
     makeDoor({ ax: 'x', p: D + .14, a: 6.0, b: 6.93, y0: .03, h: 2.09, t: .056, side: 1, mat: MAT.frame, key: 'frenchdoors', level: 0, glazed: true, hingeB: true }));
// outside tap + socket + light
box(4.3, .55, D + .26, .06, .12, .1, MAT.copper, 'outsidetap', { uv: false }); cyl(4.33, .42, D + .33, .015, .14, MAT.copper, 'outsidetap');
box(4.6, .5, D + .26, .12, .14, .06, MAT.white, 'outdoorsocket', { uv: false });
sphere(7.4, 2.3, D + .35, .08, MAT.light);

/* ------------------------------------------------------------------ floors + ceilings */
function slab(x0, z0, w, d, top, topMat, key, bottomMat, uv) {
  const g = new THREE.BoxGeometry(w, .2, d); scaleUV(g, w, .2, d, uv || 1);
  const mats = bottomMat ? [MAT.plaster, MAT.plaster, topMat, bottomMat, MAT.plaster, MAT.plaster] : topMat;
  const m = new THREE.Mesh(g, mats); m.position.set(x0 + w / 2, top - .1, z0 + d / 2); m.receiveShadow = true; m.castShadow = true; scene.add(m);
  if (key) { m.userData.key = key; m.material = Array.isArray(mats) ? mats.map(x => x.clone()) : mats.clone(); picks.push(m); (groupsByKey[key] = groupsByKey[key] || []).push(m); }
  return m;
}
// ground floor
slab(0, 0, 2.2, 6, 0, MAT.victorian, 'hallfloor', null, .8);
slab(2.2, 0, W - 2.2, 6, 0, MAT.wood, 'woodfloor', null, 1.4);
slab(0, 6, W, D - 6, 0, MAT.bigtile, 'kitchenfloor', null, 1.2);
// first floor (with stair void), underside = ceiling of ground floor
slab(0, 0, 2.2, STAIR.z0, F1, MAT.carpet, 'carpet', MAT.ceiling);
slab(STAIR.x1, STAIR.z0, 2.2 - STAIR.x1, STAIR.z1 - STAIR.z0, F1, MAT.carpet, 'carpet', MAT.ceiling);
slab(0, STAIR.z1, 2.2, 6 - STAIR.z1, F1, MAT.carpet, 'carpet', MAT.ceiling);
slab(0, STAIR.z0, STAIR.x0, STAIR.z1 - STAIR.z0, F1, MAT.carpet, null, MAT.ceiling);
slab(2.2, 0, W - 2.2, 6, F1, MAT.carpet, 'carpet', MAT.ceiling);
slab(0, 6, 4, 1.4, F1, MAT.carpet, 'carpet', MAT.ceiling);
slab(0, 7.4, 4, D - 7.4, F1, MAT.bigtile, 'bathtiles', MAT.ceiling, .8);
slab(4, 6, 4, D - 6, F1, MAT.carpet2, 'carpet', MAT.ceiling);
// loft floor (stair void x 4.1..4.93, z 7.6..10.6); underside is the first-floor ceiling
slab(0, 0, W, 7.6, TOP, MAT.carpet, 'carpet', MAT.ceiling);
slab(0, 7.6, 4.1, D - 7.6, TOP, MAT.carpet, 'carpet', MAT.ceiling);
slab(4.93, 7.6, W - 4.93, D - 7.6, TOP, MAT.carpet, 'carpet', MAT.ceiling);
slab(4.1, 10.6, .83, D - 10.6, TOP, MAT.carpet, 'carpet', MAT.ceiling);
// roof: front slope up to the ridge at z=6, full-width flat-roofed rear dormer behind it
const ROOF = { rise: 2.6, half: D / 2 + .45 };
ROOF.ang = Math.atan2(ROOF.rise, ROOF.half);
function roofY(z) { return TOP + ROOF.rise * (z + .45) / ROOF.half; }
(function () {
  const { rise, half, ang } = ROOF; const len = Math.hypot(half, rise);
  const g = new THREE.BoxGeometry(W + .4, .14, len); scaleUV(g, W + .4, .14, len, 1.2);
  const m = new THREE.Mesh(g, [MAT.slate, MAT.slate, MAT.slate, MAT.ceiling, MAT.slate, MAT.slate]); m.castShadow = true; m.receiveShadow = true;
  m.position.set(W / 2, TOP + rise / 2, D / 2 - half / 2); m.rotation.x = -ang; scene.add(m);
  box(-.1, TOP + rise - .05, D / 2 - .1, W + .2, .14, .2, MAT.black, null, { uv: false });
  // dormer roof
  const dg = new THREE.BoxGeometry(W + .3, .15, D + .35 - 5.9);
  const dm = new THREE.Mesh(dg, [MAT.felt, MAT.felt, MAT.felt, MAT.ceiling, MAT.felt, MAT.felt]); dm.position.set(W / 2, TOP + 2.525, (5.9 + D + .35) / 2); dm.castShadow = dm.receiveShadow = true; scene.add(dm);
  box(-.15, TOP + 2.42, D + .3, W + .3, .2, .05, MAT.white, null, { uv: false });
  // party walls up into the loft (brick outside, plaster inside)
  const gable = (x, depth, mat, key) => {
    const sh = new THREE.Shape(); sh.moveTo(0, TOP); sh.lineTo(0, roofY(0)); sh.lineTo(6, TOP + 2.6); sh.lineTo(D + .26, TOP + 2.6); sh.lineTo(D + .26, TOP); sh.lineTo(0, TOP);
    const gm = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth, bevelEnabled: false }), mat); gm.rotation.y = -Math.PI / 2; gm.position.set(x, 0, 0); gm.castShadow = gm.receiveShadow = true; scene.add(gm); if (key) tag(gm, key);
  };
  gable(0, .2, MAT.brick); gable(W + .2, .2, MAT.brick); gable(.02, .02, MAT.sage, 'plaster'); gable(W, .02, MAT.plaster, 'plaster');
  // dormer face with windows
  const DG = [[.6, 1.6, TOP + 1.0, TOP + 2.05], [5.2, 7.2, TOP + .8, TOP + 2.1]];
  wallX(D + .16, 0, W, TOP, TOP + 2.45, DG, MAT.brick, null, undefined, { t: .2 });
  wallX(D + .03, 0, W, TOP, TOP + 2.45, DG, MAT.plaster, 'plaster', undefined, { t: .06, skirt: [-1] });
  windowX(D + .12, .6, 1.6, TOP + 1.0, TOP + 2.05, true); windowX(D + .12, 5.2, 7.2, TOP + .8, TOP + 2.1);
  // roof windows on the front slope (seen from outside and from the loft)
  [1.9, 5.6].forEach(cx => {
    const cz = 4.75, yl = roofY(cz);
    const out = new THREE.Group(); out.position.set(cx, yl + .075, cz); out.rotation.x = -ang;
    const f = new THREE.Mesh(new THREE.BoxGeometry(.9, .06, 1.2), MAT.black); const gl = new THREE.Mesh(new THREE.BoxGeometry(.76, .066, 1.04), MAT.glass);
    out.add(f, gl); tag(f, 'roofwindow'); tag(gl, 'roofwindow'); scene.add(out);
    const inn = new THREE.Group(); inn.position.set(cx, yl - .088, cz); inn.rotation.x = -ang;
    const sky = new THREE.Mesh(new THREE.BoxGeometry(.76, .01, 1.04), MAT.sky); inn.add(sky); tag(sky, 'roofwindow');
    [[.9, .08, 0, .56], [.9, .08, 0, -.56], [.08, 1.2, .42, 0], [.08, 1.2, -.42, 0]].forEach(([w, d, x, z]) => { const b = new THREE.Mesh(new THREE.BoxGeometry(w, .03, d), MAT.frame); b.position.set(x, -.008, z); inn.add(b); tag(b, 'roofwindow'); });
    box(cx + .25, roofY(cz + .5) - .2, cz + .45, .02, .12, .02, MAT.chrome, 'roofwindow', { uv: false });
    scene.add(inn);
  });
  // gutters + downpipes
  box(-.1, TOP - .12, -.51, W + .2, .1, .12, MAT.gutter, 'gutter', { uv: false }); cyl(W - .25, 0, -.45, .05, TOP - .1, MAT.gutter, 'gutter');
  box(-.1, TOP + 2.32, D + .35, W + .2, .1, .12, MAT.gutter, 'gutter', { uv: false }); cyl(W - .25, 0, D + .42, .05, TOP + 2.35, MAT.gutter, 'gutter');
  // chimney stack above the living-room breast
  box(W - .8, TOP, 2.6, .7, 2.5, .75, MAT.brick, null, { uv: 1 }); box(W - .84, TOP + 2.45, 2.56, .78, .08, .83, MAT.stone, null, { uv: false });
  [W - .62, W - .3].forEach(x => cyl(x, TOP + 2.53, 2.97, .08, .32, MAT.pot, null, { r2: .065 }));
})();

/* ------------------------------------------------------------------ ground floor interior */
// hall | living wall x=2.2 (door z 4.4..5.3)
wallZ(2.2, 0, 6, 0, G1, [[4.4, 5.3, 0, 2.05]], MAT.plaster, 'plaster', 0, { skirt: [-1, 1] });
architraveZ(2.2, 4.4, 5.3, 0); makeDoor({ ax: 'z', p: 2.2, a: 4.4, b: 5.3, y0: 0, side: 1, mat: MAT.dOak, key: 'intdoor', level: 0, open: true });
// hall | kitchen z=6 (door x 1.2..2.1); living | kitchen z=6 wide opening x 4.4..7
wallX(6, 0, 2.2, 0, G1, [[1.2, 2.1, 0, 2.05]], MAT.plaster, 'plaster', 0, { skirt: [-1, 1] });
architraveX(6, 1.2, 2.1, 0); makeDoor({ ax: 'x', p: 6, a: 1.2, b: 2.1, y0: 0, side: 1, mat: MAT.dGreen, key: 'intdoor', level: 0, open: true });
wallX(6, 2.2, W, 0, G1, [[4.4, 7, 0, 2.15]], MAT.plaster, 'plaster', 0, { skirt: [-1, 1] });
// stairs: 14 steps rising +z
(function () {
  const n = 14, rise = F1 / n, go = (STAIR.z1 - STAIR.z0) / n, w = STAIR.x1 - STAIR.x0;
  for (let i = 0; i < n; i++) {
    const z = STAIR.z0 + i * go, y = i * rise;
    box(STAIR.x0, y, z, w, rise, go, MAT.oak, 'stairs', { uv: .5 });
    box(STAIR.x0 + .18, y + rise, z, w - .36, .012, go, MAT.runner, 'stairrunner', { uv: .6 });
    box(STAIR.x0, y + rise - .03, z - .015, w, .035, .04, MAT.oak, 'nosing', { uv: false });
    box(STAIR.x0 + .18, y + rise - .04, z - .02, w - .36, .05, .03, MAT.runner, 'stairrunner', { uv: false });
  }
  // stringer / understairs panel under the stairs on hall side (x=1.1)
  const sh = new THREE.Shape(); sh.moveTo(STAIR.z0, 0); sh.lineTo(4.28, 0); sh.lineTo(4.28, 1.74); sh.lineTo(4.92, 1.74); sh.lineTo(4.92, 0); sh.lineTo(STAIR.z1 + .5, 0); sh.lineTo(STAIR.z1 + .5, G1); sh.lineTo(STAIR.z0 + (G1 / F1) * (STAIR.z1 - STAIR.z0), G1); sh.lineTo(STAIR.z0, 0);
  const pg = new THREE.ExtrudeGeometry(sh, { depth: .06, bevelEnabled: false });
  const panel = new THREE.Mesh(pg, MAT.string); panel.rotation.y = -Math.PI / 2; panel.position.set(STAIR.x1 + .06, 0, 0); panel.castShadow = panel.receiveShadow = true; scene.add(panel); tag(panel, 'understairs');
  makeDoor({ ax: 'z', p: STAIR.x1 + .09, a: 4.28, b: 4.92, y0: 0, h: 1.72, t: .035, side: 1, mat: MAT.dPlum, key: 'understairs', level: 0, open: true });
  // cloakroom under the stairs: toilet, small basin, tiles and a light
  const k = 'understairs';
  box(.12, 0, 4.1, .02, 1.2, 1.88, MAT.metro, k, { uv: .6 });
  box(.14, .35, 5.2, .18, .5, .42, MAT.porcelain, k, { uv: false }); box(.32, 0, 5.24, .46, .4, .34, MAT.porcelain, k, { uv: false }); box(.3, .4, 5.22, .5, .04, .38, MAT.gloss, k, { uv: false });
  box(.14, .78, 4.38, .32, .12, .4, MAT.porcelain, k, { uv: false }); box(.2, .86, 4.44, .2, .03, .28, MAT.frosted, k, { uv: false });
  cyl(.17, .9, 4.58, .013, .16, MAT.matBlack, k); box(.17, 1.05, 4.57, .12, .02, .02, MAT.matBlack, k, { uv: false });
  box(.14, 1.0, 4.38, .02, .5, .4, M({ color: '#e8f1f5', roughness: .04, metalness: 1, envMapIntensity: .85 }), k, { uv: false });
  for (let yy = .7; yy < 1.2; yy += .1) box(.5, yy, 5.94, .4, .02, .03, MAT.copper, k, { uv: false });
  sphere(.6, 2.1, 5.6, .05, MAT.light, k); pointLight(.6, 1.9, 5.1, .45, 3);
  [[4.23, 4.25], [4.95, 4.97]].forEach(([a]) => box(STAIR.x1 + .07, 0, a, .02, 1.78, .03, MAT.white, 'understairs', { uv: false }));
  // banister (hall side) + newel posts
  const slope = F1 / (STAIR.z1 - STAIR.z0);
  box(STAIR.x1 - .05, 0, STAIR.z0 - .12, .1, 1.1, .1, MAT.oak, 'banister', { uv: false });
  const hr = new THREE.Mesh(new THREE.BoxGeometry(.06, .07, Math.hypot(STAIR.z1 - STAIR.z0, F1)), MAT.oak.clone());
  hr.position.set(STAIR.x1, .95 + F1 / 2, (STAIR.z0 + STAIR.z1) / 2); hr.rotation.x = -Math.atan(slope); hr.castShadow = true; scene.add(hr); tag(hr, 'banister');
  for (let z = STAIR.z0 + .06; z < STAIR.z1; z += .12) { const yb = (z - STAIR.z0) * slope + rise; box(STAIR.x1 - .015, yb, z, .03, .93 - rise + .02, .03, MAT.white, 'banister', { uv: false }); }
  // landing balustrade around the void on the first floor
    const bal = (x0, z0, x1, z1) => {
    const len = Math.hypot(x1 - x0, z1 - z0);
    if (x0 === x1) { box(x0 - .03, F1 + .9, z0, .06, .06, len, MAT.oak, 'banister', { uv: false }); for (let z = z0 + .06; z < z1; z += .12) box(x0 - .015, F1, z, .03, .9, .03, MAT.white, 'banister', { uv: false }); }
    else { box(x0, F1 + .9, z0 - .03, len, .06, .06, MAT.oak, 'banister', { uv: false }); for (let x = x0 + .06; x < x1; x += .12) box(x, F1, z0 - .015, .03, .9, .03, MAT.white, 'banister', { uv: false }); }
  };
  bal(STAIR.x1, STAIR.z0 - .03, STAIR.x1, 3.85);
  box(STAIR.x1 - .05, F1 - .35, 3.8, .1, 1.4, .1, MAT.oak, 'banister', { uv: false });
  box(STAIR.x1 - .055, F1 - .02, STAIR.z1 - .1, .11, 1.07, .11, MAT.oak, 'banister', { uv: false }); box(STAIR.x1 - .07, F1 + 1.05, STAIR.z1 - .115, .14, .05, .14, MAT.oak, 'banister', { uv: false });
  bal(0, STAIR.z0 - .03, STAIR.x1, STAIR.z0 - .03);
  box(STAIR.x1 - .05, F1, STAIR.z0 - .08, .1, 1.05, .1, MAT.oak, 'banister', { uv: false });
})();
// hall radiator, socket, lights
radiatorZ(2.2, 1.6, .9, 0, -1); socketX(.0, 1.95, 0, 1);
box(2.2 - .06 - .11, 1.75, .3, .11, .32, .5, MAT.gloss, 'fuseboard', { uv: false }); box(2.2 - .06 - .115, 1.8, .34, .006, .2, .42, M({ color: '#cfd6d9', roughness: .2, transparent: true, opacity: .75 }), 'fuseboard', { uv: false });
for (let i = 0; i < 9; i++) box(2.2 - .06 - .1, 1.86, .37 + i * .042, .01, .07, .03, i === 0 ? MAT.bike : MAT.white, 'fuseboard', { uv: false });
box(2.2 - .06 - .1, 1.62, .48, .1, .13, .14, MAT.white, 'fuseboard', { uv: false });
downlights(1.2, 0, 2.2, 6, G1, 1, 3); pointLight(1.6, 2.2, 2.5, .7, 7);
// living room
(function () {
  // chimney breast + alcoves on x=W wall
  box(W - .45, 0, 2.1, .45, G1, 1.8, MAT.plaster, 'plaster', { uv: 1 }); solid(0, W - .45, 2.1, W, 3.9);
  box(W - .52, 0, 2.5, .07, 1.15, 1.0, MAT.black); box(W - .6, 1.1, 2.0, .15, .08, 2.0, MAT.oak);
  [[.3, 2.0], [3.95, 5.7]].forEach(([a, b]) => {
    box(W - .45, 0, a, .45, .85, b - a, MAT.navy, 'alcove', { uv: false }); box(W - .47, .85, a, .47, .04, b - a, MAT.oak, 'alcove', { uv: false });
    for (let y = 1.3; y < 2.4; y += .4) box(W - .3, y, a, .3, .03, b - a, MAT.oak, 'alcove', { uv: false });
    solid(0, W - .45, a, W, b);
  });
  // sofa facing fireplace
  box(3.2, 0, 1.8, .9, .45, 2.4, MAT.sofa); box(3.2, .45, 1.8, .25, .45, 2.4, MAT.sofa); box(3.2, 0, 1.6, .9, .65, .22, MAT.sofa); box(3.2, 0, 4.2, .9, .65, .22, MAT.sofa);
  solid(0, 3.2, 1.6, 4.1, 4.42);
  box(4.6, 0, 1.9, 2.3, .01, 2.2, MAT.rug, null, { uv: false });
  box(5.2, 0, 2.6, 1.0, .4, .6, MAT.oak); solid(0, 5.2, 2.6, 6.2, 3.2);
  bush(2.7, 1.05, .6, .28); cyl(2.7, 0, .6, .2, .5, MAT.white);
})();
// damaged plaster in the lounge -> decorating
box(2.262, .75, .7, .006, 1.4, 1.8, MAT.damaged, 'decorating', { uv: false });
radiatorX(0, 4.4, 1.5, 0, 1); socketX(0, 2.6, 0, 1); socketZ(W - .45, 1.2, 0, -1); socketZ(W - .45, 4.6, 0, -1);
downlights(2.2, 0, W, 6, G1, 2, 2); pointLight(5, 2.2, 3, .9, 9);
// kitchen
(function () {
  const bh = .9, wt = .04;
  // run along x=0 wall z 6.2..11.4 (depth .6)
  const unitsZ = [[6.9, 7.5, 'unit'], [7.5, 8.1, 'dishwasher'], [8.1, 8.7, 'washer'], [8.7, 9.3, 'unit'], [9.3, 9.9, 'oven'], [9.9, 10.5, 'unit'], [10.5, 11.4, 'unit']];
  unitsZ.forEach(([a, b, k]) => {
    if (k === 'washer') { const g = new THREE.BoxGeometry(.6, .85, b - a); const mats = [MAT.washer, MAT.white, MAT.white, MAT.white, MAT.white, MAT.white]; const m = new THREE.Mesh(g, mats); m.position.set(.3, .45, (a + b) / 2); m.castShadow = m.receiveShadow = true; scene.add(m); tag(m, 'washer'); m.rotation.y = 0; }
    else if (k === 'oven') { const g = new THREE.BoxGeometry(.6, .8, b - a); const m = new THREE.Mesh(g, [MAT.oven, MAT.black, MAT.black, MAT.black, MAT.black, MAT.black]); m.position.set(.3, .45, (a + b) / 2); m.castShadow = true; scene.add(m); tag(m, 'oven'); }
    else box(0, .1, a, .6, bh - .1, b - a, MAT.shaker, k === 'dishwasher' ? 'dishwasher' : 'kitchen', { uv: .62 });
    box(.03, 0, a, .55, .1, b - a, MAT.black, 'kitchen', { uv: false });
    if (k === 'unit') box(.6, .78, (a + b) / 2 - .08, .02, .02, .16, MAT.copper, 'kitchen', { uv: false });
  });
  // fridge freezer tall
  box(0, 0, 6.15, .65, 2.1, .7, MAT.shaker, 'fridge', { uv: .7 }); box(.65, 1.0, 6.2, .02, .4, .02, MAT.copper, 'fridge', { uv: false });
  solid(0, 0, 6.1, .65, 11.4);
  // worktop
  box(0, bh, 6.9, .64, wt, 4.5, MAT.oak, 'worktop', { uv: .8 });
  box(0, bh, 11.4, 4.1, wt, .64, MAT.oak, 'worktop', { uv: .8 });
  // hob + hood
  box(.08, bh + wt, 9.35, .5, .006, .5, MAT.hob, 'hob', { uv: false });
  box(.0, 1.6, 9.3, .5, .12, .6, MAT.steel, 'hood', { uv: false }); box(.05, 1.72, 9.45, .28, .78, .3, MAT.steel, 'hood', { uv: false });
  // wall units
  [[6.9, 7.7], [7.7, 8.5], [10.3, 11.1]].forEach(([a, b]) => box(0, 1.45, a, .34, .72, b - a - .02, MAT.shaker, 'kitchen', { uv: .7 }));
  // splashback tiles
  box(0, bh + wt, 6.9, .02, .55, 4.5, MAT.metro, 'splashback', { uv: .6 });
  box(0, bh + wt, D - .02, 4.1, .55, .02, MAT.metro, 'splashback', { uv: .6 });
  // rear run along z=D (under window) x 0.64..4.1, sink at 1.8..2.6
  [[.64, 1.5], [1.5, 2.9], [2.9, 3.5], [3.5, 4.1]].forEach(([a, b], i) => { box(a, .1, D - .6, b - a, bh - .1, .6, MAT.shaker, 'kitchen', { uv: .62 }); box(a, 0, D - .57, b - a, .1, .55, MAT.black, 'kitchen', { uv: false }); });
  solid(0, 0, D - .65, 4.1, D);
  box(1.74, bh + wt, D - .56, .92, .012, .46, MAT.steel, 'sink', { uv: false });
  box(1.79, bh + wt + .004, D - .52, .38, .012, .38, MAT.sinkIn, 'sink', { uv: false }); box(2.21, bh + wt + .004, D - .52, .4, .012, .38, MAT.sinkIn, 'sink', { uv: false });
  cyl(1.98, bh + wt + .012, D - .33, .025, .003, MAT.black, 'sink'); cyl(2.41, bh + wt + .012, D - .33, .025, .003, MAT.black, 'sink');
  cyl(2.2, bh + wt, D - .1, .022, .42, MAT.brass, 'tap'); rod([2.2, bh + wt + .42, D - .1], [2.2, bh + wt + .44, D - .25], .02, MAT.brass, 'tap'); rod([2.2, bh + wt + .44, D - .25], [2.2, bh + wt + .3, D - .33], .018, MAT.brass, 'tap');
  box(2.26, bh + wt + .22, D - .12, .07, .025, .025, MAT.brass, 'tap', { uv: false });
  // island with stools
  box(3, .1, 8.2, 1.8, bh - .1, .9, MAT.shaker, 'island', { uv: .62 }); box(2.95, bh, 8.15, 1.9, wt, 1.15, MAT.quartz, 'island', { uv: .8 }); solid(0, 2.95, 8.15, 4.85, 9.3);
  [3.3, 3.9, 4.5].forEach(x => { cyl(x, 0, 9.55, .02, .65, MAT.black); cyl(x, .65, 9.55, .17, .05, MAT.oak); });
  // dining table near French doors
  box(6.1, .74, 8.6, 1.5, .04, .9, MAT.oak); [[6.15, 8.65], [7.5, 8.65], [6.15, 9.4], [7.5, 9.4]].forEach(([x, z]) => box(x, 0, z, .05, .74, .05, MAT.oak, null, { uv: false })); solid(0, 6.1, 8.6, 7.6, 9.5);
  [[6.35, 8.2], [7.15, 8.2], [6.35, 9.75], [7.15, 9.75]].forEach(([x, z]) => { box(x, 0, z, .42, .45, .42, MAT.oak, null, { uv: false }); box(x, .45, z + (z > 9 ? .36 : 0), .42, .45, .05, MAT.oak, null, { uv: false }); });
  sphere(6.85, .95, 9.05, .12, MAT.leaf);
})();
// wall-hung boiler with pipes
box(W - .34, 1.35, 10.2, .34, .72, .44, MAT.gloss, 'boiler', { uv: false }); box(W - .345, 1.55, 10.3, .005, .12, .24, MAT.screen, 'boiler', { uv: false });
box(W - .346, 1.58, 10.33, .003, .05, .08, M({ color: '#2a6', emissive: '#3c8', emissiveIntensity: .8 }), 'boiler', { uv: false });
[10.25, 10.33, 10.41, 10.49, 10.57].forEach((z, i) => cyl(W - .12 - (i % 2) * .05, .3, z, .011, 1.05, MAT.copper, 'boiler'));
box(W - .3, .15, 10.15, .3, .15, .5, MAT.white, 'boiler', { uv: false });
radiatorZ(W, 7, 1.2, 0, -1); socketZ(0, 7.6, bhOffset(), 1); socketZ(0, 10.7, bhOffset(), 1); socketX(D, 3.7, bhOffset(), -1);
function bhOffset() { return .7; }
downlights(0, 6, W, D, G1, 3, 2); pointLight(2.5, 2.2, 9, 1.0, 9); pointLight(6, 2.2, 9, .8, 8);

/* ------------------------------------------------------------------ first floor */
// landing | front bedroom x=2.2 (door z 4.4..5.3)
wallZ(2.2, 0, 6, F1, C1, [[4.4, 5.3, F1, F1 + 2.05]], MAT.plaster, 'plaster', 1, { skirt: [-1, 1] });
architraveZ(2.2, 4.4, 5.3, F1); makeDoor({ ax: 'z', p: 2.2, a: 4.4, b: 5.3, y0: F1, side: 1, mat: MAT.dNavy, key: 'intdoor', level: 1, open: true });
// front bedroom | rear z=6 x 2.2..8 solid; corridor top wall z=6 x 0..2.2 open (landing continues)
wallX(6, 2.2, W, F1, C1, [], MAT.plaster, 'plaster', 1, { skirt: [-1, 1] });
// corridor | bathroom z=7.4 x 0..4 (door 1.2..2.0)
wallX(7.4, 0, 4, F1, C1, [[1.2, 2.0, F1, F1 + 2.05]], MAT.plaster, 'plaster', 1, { skirt: [-1, 1] });
architraveX(7.4, 1.2, 2.0, F1); makeDoor({ ax: 'x', p: 7.4, a: 1.2, b: 2.0, y0: F1, side: 1, mat: MAT.dGrey, key: 'intdoor', level: 1, open: true });
// bathroom | loft stairs wall x=4 (the corridor runs on into the stair lobby x 4..5)
wallZ(4, 7.4, D, F1, C1, [], MAT.plaster, 'plaster', 1);
// stair lobby | bedroom 2 wall x=5 (door z 6.5..7.3)
wallZ(5, 6, D, F1, C1, [[6.5, 7.3, F1, F1 + 2.05]], MAT.plaster, 'plaster', 1, { skirt: [-1, 1] });
architraveZ(5, 6.5, 7.3, F1); makeDoor({ ax: 'z', p: 5, a: 6.5, b: 7.3, y0: F1, side: 1, mat: MAT.dCharcoal, key: 'intdoor', level: 1, open: true });
// stair void protection for level 1 (balustrade lines)
solid(1, STAIR.x1 - .03, STAIR.z0 - .06, STAIR.x1 + .03, STAIR.z1 - .9);
solid(1, 0, STAIR.z0 - .06, STAIR.x1 + .03, STAIR.z0);
solid(1, STAIR.x0, STAIR.z0, STAIR.x1, STAIR.z1 - .05);
downlights(1.1, 0, 2.2, 7.4, C1, 1, 3); pointLight(1.6, F1 + 2.2, 4, .6, 7); radiatorZ(2.2, .6, .7, F1, -1);
// front bedroom
(function () {
  const y = F1;
  box(3.8, y, 3.85, 2.0, .45, 2.05, MAT.timber); box(3.85, y + .45, 3.9, 1.9, .18, 1.95, MAT.linen); box(3.85, y + .58, 3.9, 1.9, .06, .8, MAT.throw);
  box(3.7, y, 5.82, 2.2, 1.15, .12, MAT.navy); [4.05, 4.95].forEach(x => box(x, y + .63, 5.25, .6, .12, .4, MAT.linen));
  solid(1, 3.7, 3.8, 5.9, 5.94);
  [3.2, 5.95].forEach(x => { box(x, y, 5.45, .45, .5, .42, MAT.oak, 'wardrobe', { uv: false }); box(x + .02, y + .3, 5.44, .41, .015, .01, MAT.black, null, { uv: false }); sphere(x + .22, y + .62, 5.66, .1, MAT.light); });
  solid(1, 3.2, 5.45, 3.65, 5.9); solid(1, 5.95, 5.45, 6.4, 5.9);
  box(4.3, y, 1.6, 1.2, .01, 1.6, MAT.rug, null, { uv: false });
  // fitted wardrobes on x=W wall
  box(W - .62, y, .3, .62, 2.45, 5.4, MAT.white, 'wardrobe', { uv: false }); solid(1, W - .62, .3, W, 5.7);
  for (let z = .3; z < 5.69; z += .6) { box(W - .64, y + .05, z + .02, .02, 2.35, .56, MAT.gloss, 'wardrobe', { uv: false }); box(W - .66, y + 1.0, z + .5, .02, .3, .02, MAT.copper, 'wardrobe', { uv: false }); }
})();
radiatorX(0, 4.4, 1.5, F1, 1); socketX(0, 2.7, F1, 1); socketZ(W - .62, .2, F1, -1);
downlights(2.2, 0, W, 6, C1, 2, 2); pointLight(5, F1 + 2.2, 3, .8, 8);
// bathroom x 0..4, z 7.4..12
(function () {
  const y = F1;
  // tiled walls
  box(.0, y, 7.45, .02, 2.4, D - 7.45, MAT.metroSage, 'bathtiles', { uv: .6 });
  box(0, y, D - .02, 4, 2.4, .02, MAT.metroSage, 'bathtiles', { uv: .6 });
  box(3.92, y, 7.45, .02, 2.4, D - 7.45, MAT.metroSage, 'bathtiles', { uv: .6 });
  // bath along rear wall + shower + screen
  box(.02, y, D - .78, 1.75, .56, .76, MAT.porcelain, 'bath', { uv: false }); box(.1, y + .45, D - .7, 1.6, .12, .6, MAT.frosted, 'bath', { uv: false });
  solid(1, 0, D - .8, 1.8, D);
  // walk-in shower in the far corner: low tray, fixed glass panel, ceiling rain head
  box(2.35, y, 10.45, 1.55, .04, D - .02 - 10.45, MAT.tray, 'walkin', { uv: false });
  box(2.5, y + .041, D - .3, 1.25, .004, .07, MAT.steel, 'walkin', { uv: false });
  box(2.35, y + .04, 10.43, .85, 1.95, .015, MAT.glass, 'walkin', { uv: false, cast: false });
  box(2.35, y + .04, 10.415, .85, .03, .045, MAT.chrome, 'walkin', { uv: false }); box(3.17, y + .04, 10.415, .03, 1.95, .045, MAT.chrome, 'walkin', { uv: false });
  box(3.175, y + 1.95, 10.43, .015, .015, D - 10.45, MAT.chrome, 'walkin', { uv: false });
  cyl(3.1, C1 - .3, 11.25, .012, .3, MAT.chrome, 'walkin'); cyl(3.1, C1 - .32, 11.25, .16, .015, MAT.chrome, 'walkin', { seg: 32 });
  box(2.95, y + 1.0, D - .05, .3, .22, .03, MAT.chrome, 'walkin', { uv: false }); cyl(3.0, y + 1.08, D - .03, .03, .04, MAT.chrome, 'walkin', { rx: Math.PI / 2 }); cyl(3.2, y + 1.08, D - .03, .03, .04, MAT.chrome, 'walkin', { rx: Math.PI / 2 });
  cyl(3.6, y + .9, D - .04, .012, .7, MAT.chrome, 'walkin'); box(3.57, y + 1.45, D - .14, .06, .2, .06, MAT.chrome, 'walkin', { uv: false });
  solid(1, 2.35, 10.38, 3.2, 10.5);
  cyl(1.3, y + .56, D - .08, .016, .2, MAT.matBlack, 'bathtap'); cyl(1.5, y + .56, D - .08, .016, .2, MAT.matBlack, 'bathtap'); box(1.36, y + .7, D - .2, .08, .04, .16, MAT.matBlack, 'bathtap', { uv: false });
  // toilet on x=0 wall
  box(.02, y + .35, 8.4, .18, .5, .45, MAT.porcelain, 'toilet', { uv: false }); box(.2, y, 8.45, .5, .4, .36, MAT.porcelain, 'toilet', { uv: false }); box(.18, y + .4, 8.43, .55, .04, .4, MAT.gloss, 'toilet', { uv: false });
  solid(1, 0, 8.4, .75, 8.9);
  // vanity + basin + taps + mirror cabinet
  box(.02, y + .15, 9.5, .48, .55, .9, MAT.green, 'basin', { uv: false }); box(.02, y + .7, 9.5, .5, .1, .9, MAT.porcelain, 'basin', { uv: false }); box(.12, y + .78, 9.65, .32, .03, .6, MAT.frosted, 'basin', { uv: false });
  cyl(.08, y + .8, 9.95, .018, .26, MAT.matBlack, 'bathtap'); box(.08, y + 1.04, 9.94, .2, .025, .025, MAT.matBlack, 'bathtap', { uv: false }); box(.06, y + .96, 10.05, .05, .02, .1, MAT.matBlack, 'bathtap', { uv: false });
  solid(1, 0, 9.5, .55, 10.4);
  box(.02, y + 1.15, 9.5, .14, .7, .9, MAT.white, 'mirror', { uv: false }); box(.16, y + 1.18, 9.53, .01, .64, .84, M({ color: '#e8f1f5', roughness: .04, metalness: 1, envMapIntensity: .85 }), 'mirror', { uv: false });
  // towel rail on x=4 wall
  for (let yy = y + .4; yy < y + 1.5; yy += .12) box(3.88, yy, 8.4, .04, .025, .55, MAT.copper, 'towelrail', { uv: false });
  box(3.86, y + .35, 8.38, .06, 1.2, .03, MAT.copper, 'towelrail', { uv: false }); box(3.86, y + .35, 8.95, .06, 1.2, .03, MAT.copper, 'towelrail', { uv: false });
  // extractor fan on ceiling
  cyl(2, C1 - .02, 10, .12, .02, MAT.white, 'fan'); cyl(2, C1 - .03, 10, .08, .01, MAT.black, 'fan');
  bush(3.6, y + .3, 7.75, .2); cyl(3.6, y, 7.75, .14, .28, MAT.white);
})();
downlights(0, 7.4, 4, D, C1, 2, 2); pointLight(2, F1 + 2.2, 9.7, .7, 6);
// bedroom 2 x 5..8, z 6..12
(function () {
  const y = F1;
  box(5.9, y, 8.2, 2.0, .45, 2.0, MAT.timber); box(5.95, y + .45, 8.25, 1.9, .18, 1.9, MAT.linen); box(5.95, y + .58, 8.25, .8, .06, 1.9, MAT.throw);
  box(W - .12, y, 8.1, .1, 1.1, 2.2, MAT.navy); [8.45, 9.35].forEach(z => box(W - .55, y + .63, z, .4, .12, .6, MAT.linen));
  solid(1, 5.9, 8.1, W, 10.3);
  box(6.2, y, 6.06, 1.8, 2.3, .6, MAT.white, 'wardrobe', { uv: false }); for (let i = 0; i < 3; i++) { box(6.22 + i * .6, y + .05, 6.66, .57, 2.2, .02, MAT.gloss, 'wardrobe', { uv: false }); box(6.7 + i * .6, y + 1.0, 6.68, .02, .3, .02, MAT.copper, 'wardrobe', { uv: false }); }
  solid(1, 6.2, 6.06, W, 6.7);
  box(W - .45, y, 7.5, .4, .5, .4, MAT.oak); sphere(W - .25, y + .65, 7.7, .1, MAT.light);
})();
radiatorX(D, 5.3, 1.2, F1, -1); socketZ(W, 10.8, F1, -1); socketX(D, 7.4, F1, -1);
downlights(5, 6, W, D, C1, 2, 2); pointLight(6.5, F1 + 2.2, 9, .7, 7);

/* ------------------------------------------------------------------ loft conversion */
// second staircase: first-floor lobby up to the loft, rising +z between the x=4 and x=5 walls
(function () {
  const S = STAIRS[1], n = 13, rise = S.rise / n, go = (S.z1 - S.z0) / n, w = S.x1 - S.x0;
  for (let i = 0; i < n; i++) {
    const z = S.z0 + i * go, y = S.base + i * rise;
    box(S.x0, y, z, w, rise, go, MAT.oak, 'stairs', { uv: .5 });
    box(S.x0 + .12, y + rise, z, w - .24, .012, go, MAT.runner, 'stairrunner', { uv: .6 });
    box(S.x0, y + rise - .03, z - .015, w, .035, .04, MAT.oak, 'nosing', { uv: false });
  }
  rod([S.x0 + .06, S.base + .95, S.z0 - .2], [S.x0 + .06, S.base + S.rise + .95, S.z1], .025, MAT.oak, 'banister');
  // balustrade round the stairwell in the loft
  const y = TOP;
  const rail = (x0, z0, x1, z1) => {
    if (x0 === x1) { box(x0 - .03, y + .9, z0, .06, .06, z1 - z0, MAT.oak, 'banister', { uv: false }); for (let z = z0 + .08; z < z1; z += .12) box(x0 - .015, y, z, .03, .9, .03, MAT.white, 'banister', { uv: false }); }
    else { box(x0, y + .9, z0 - .03, x1 - x0, .06, .06, MAT.oak, 'banister', { uv: false }); for (let x = x0 + .08; x < x1; x += .12) box(x, y, z0 - .015, .03, .9, .03, MAT.white, 'banister', { uv: false }); }
  };
  rail(4.05, 7.58, 4.05, 10.6); rail(4.98, 7.58, 4.98, 10.6); rail(4.05, 7.58, 4.98, 7.58);
  [[4.05, 7.58], [4.98, 7.58], [4.05, 10.6], [4.98, 10.6]].forEach(([x, z]) => box(x - .05, y, z - .05, .1, 1.05, .1, MAT.oak, 'banister', { uv: false }));
  solid(2, 3.99, 7.52, 4.11, 10.65); solid(2, 4.92, 7.52, 5.04, 10.65); solid(2, 3.99, 7.52, 5.04, 7.64); solid(2, 4.11, 7.64, 4.92, 10.5);
})();
// loft room
(function () {
  const y = TOP;
  // knee wall under the front slope with eaves cupboards
  wallX(3.5, 0, W, y, y + 1.5, [], MAT.plaster, 'plaster', undefined, { skirt: [1] });
  [.5, 2.3, 4.6, 6.5].forEach(a => { box(a, y + .12, 3.56, .75, .95, .02, MAT.gloss, 'eaves', { uv: false }); box(a + .64, y + .55, 3.58, .025, .12, .025, MAT.chrome, 'eaves', { uv: false }); });
  // bed with headboard on the party wall
  box(5.9, y, 6.9, 2.0, .45, 2.0, MAT.oak); box(5.95, y + .45, 6.95, 1.9, .18, 1.9, MAT.linen); box(5.95, y + .58, 6.95, .8, .06, 1.9, MAT.throw);
  box(W - .12, y, 6.8, .1, 1.1, 2.2, MAT.green); [7.15, 8.05].forEach(z => box(W - .55, y + .63, z, .4, .12, .6, MAT.linen));
  solid(2, 5.9, 6.8, W, 9.0);
  box(W - .45, y, 9.2, .4, .5, .4, MAT.oak); sphere(W - .25, y + .65, 9.4, .1, MAT.light);
  // reading corner
  box(.8, y, 5.4, 2.4, .01, 2.0, MAT.rug, null, { uv: false });
  box(1.0, y, 5.0, .8, .42, .8, MAT.sofa); box(1.0, y + .42, 5.0, .8, .45, .2, MAT.sofa); solid(2, 1.0, 5.0, 1.8, 5.8);
  // en-suite in the rear corner x 0..2.6, z 9.6..12
  wallX(9.6, 0, 2.6, y, y + 2.45, [[1.5, 2.3, y, y + 2.05]], MAT.plaster, 'ensuite', 2, { t: .1, skirt: [-1] });
  wallZ(2.6, 9.6, D, y, y + 2.45, [], MAT.plaster, 'ensuite', 2, { t: .1, skirt: [1] });
  architraveX(9.6, 1.5, 2.3, y); makeDoor({ ax: 'x', p: 9.6, a: 1.5, b: 2.3, y0: y, side: 1, mat: MAT.dOak, key: 'intdoor', level: 2, open: true });
  box(.02, y + .001, 9.65, 2.53, .008, D - 9.65, MAT.bigtile, 'ensuite', { uv: .8 });
  box(.02, y, 9.65, .02, 1.2, D - 9.65, MAT.metroSage, 'ensuite', { uv: .6 });
  box(1.72, y, D - .02, .83, 2.2, .02, MAT.metroSage, 'ensuite', { uv: .6 }); box(2.53, y, 10.95, .02, 2.2, D - 10.95, MAT.metroSage, 'ensuite', { uv: .6 });
  box(1.75, y, 10.95, .78, .05, D - .02 - 10.95, MAT.tray, 'shower', { uv: false });
  box(1.73, y + .05, 10.95, .015, 1.95, D - 10.97, MAT.glass, 'shower', { uv: false, cast: false });
  box(1.725, y + .05, 10.93, .025, 1.95, .03, MAT.chrome, 'shower', { uv: false });
  cyl(2.15, y + 2.15, 11.5, .012, .3, MAT.chrome, 'shower'); cyl(2.15, y + 2.13, 11.5, .13, .015, MAT.chrome, 'shower', { seg: 32 });
  box(2.0, y + 1.0, D - .05, .26, .2, .03, MAT.chrome, 'shower', { uv: false });
  solid(2, 1.7, 10.93, 1.77, D);
  box(.02, y + .35, 10.0, .18, .5, .45, MAT.porcelain, 'toilet', { uv: false }); box(.2, y, 10.05, .5, .4, .36, MAT.porcelain, 'toilet', { uv: false }); box(.18, y + .4, 10.03, .55, .04, .4, MAT.gloss, 'toilet', { uv: false });
  solid(2, 0, 10.0, .75, 10.5);
  box(.02, y + .78, 11.05, .42, .13, .5, MAT.porcelain, 'basin', { uv: false }); box(.1, y + .86, 11.12, .28, .03, .36, MAT.frosted, 'basin', { uv: false });
  cyl(.07, y + .91, 11.3, .016, .2, MAT.matBlack, 'bathtap'); box(.07, y + 1.09, 11.29, .16, .022, .022, MAT.matBlack, 'bathtap', { uv: false });
  box(.02, y + 1.2, 11.0, .03, .65, .6, M({ color: '#e8f1f5', roughness: .04, metalness: 1, envMapIntensity: .85 }), 'mirror', { uv: false });
  solid(2, 0, 11.05, .45, 11.55);
  for (let yy = y + .5; yy < y + 1.5; yy += .12) box(.25, yy, 9.66, .5, .025, .04, MAT.copper, 'towelrail', { uv: false });
  cyl(1.2, y + 2.43, 10.6, .12, .02, MAT.white, 'fan');
})();
radiatorZ(W, 9.6, 1.0, TOP, -1); socketZ(W, 6.5, TOP, -1); socketX(D, 3.5, TOP, -1); socketZ(.0, 7.5, TOP, 1);
downlights(2.6, 6, W, D, TOP + 2.45, 2, 2); downlights(0, 9.6, 2.6, D, TOP + 2.45, 1, 1); downlights(0, 6, 2.6, 9.6, TOP + 2.45, 1, 1);
pointLight(4.5, TOP + 2.1, 8.2, .9, 10); pointLight(1.3, TOP + 2.1, 10.8, .5, 5); pointLight(3.5, TOP + 1.6, 5.0, .5, 6);

/* ------------------------------------------------------------------ lighting */
scene.add(new THREE.HemisphereLight('#e8f1fa', '#7a6a55', LOW ? .5 : .28));
const sun = new THREE.DirectionalLight('#fff1dc', 1.6);
sun.position.set(-14, 22, -10); sun.target.position.set(4, 0, 6); scene.add(sun.target);
sun.castShadow = true; sun.shadow.mapSize.set(LOW ? 1024 : 2048, LOW ? 1024 : 2048); sun.shadow.bias = -.0004; sun.shadow.normalBias = .02;
Object.assign(sun.shadow.camera, { left: -18, right: 18, top: 22, bottom: -22, near: 1, far: 70 }); scene.add(sun);
scene.add(new THREE.AmbientLight('#fff6ea', .12));

/* ------------------------------------------------------------------ player + movement */
const EYE = 1.6, R = .22;
const player = { x: 1.4, z: -6.2, level: 0, stairs: false, st: 0, y: 0, yaw: Math.PI, pitch: -.05 };
const BOUNDS = { x0: .25, x1: W - .25, z0: -9.2, z1: D + 8.75 };
const LEVEL_Y = [0, F1, TOP];
function onRamp(S, z) { return S.base + Math.max(0, Math.min(1, (z - S.z0) / (S.z1 - S.z0))) * S.rise; }
function doorAt(x, z, level) {
  for (const d of DOORS) { if (d.open || d.level !== level) continue; const b = d.box; if (x + R > b[0] && x - R < b[2] && z + R > b[1] && z - R < b[3]) return d; }
  return null;
}
function setDoor(d, open) { d.open = open; if (d.pair) d.pair.open = open; }
function playerIn(d) { return !player.stairs && player.level === d.level && player.x + R > d.box[0] && player.x - R < d.box[2] && player.z + R > d.box[1] && player.z - R < d.box[3]; }
function toggleDoor(d) { if (d.open && (playerIn(d) || (d.pair && playerIn(d.pair)))) return; setDoor(d, !d.open); }
function blocked(x, z, level) {
  if (x < BOUNDS.x0 || x > BOUNDS.x1 || z < BOUNDS.z0 || z > BOUNDS.z1) return true;
  if (level >= 1 && (x < .1 || x > W - .1 || z < .1 || z > D - .1)) return true;
  if (level === 2 && z < 3.95) return true;
  const list = SOLID[level];
  for (let i = 0; i < list.length; i++) { const b = list[i]; if (x + R > b[0] && x - R < b[2] && z + R > b[1] && z - R < b[3]) return true; }
  return !!doorAt(x, z, level);
}
function tryMove(dx, dz) {
  if (player.stairs) {
    const S = STAIRS[player.st];
    const nx = Math.min(S.x1 - .2, Math.max(S.x0 + .2, player.x + dx)), nz = player.z + dz;
    if (nz < S.z0 - R - .06) { if (!blocked(nx, nz, S.from)) { player.stairs = false; player.level = S.from; } else return; }
    else if (nz > S.z1 + R + .06) { if (!blocked(nx, nz, S.to)) { player.stairs = false; player.level = S.to; } else return; }
    player.x = nx; player.z = nz; return;
  }
  const lvl = player.level, nx = player.x + dx, nz = player.z + dz;
  for (let i = 0; i < STAIRS.length; i++) {
    const S = STAIRS[i]; if (!(nx > S.x0 && nx < S.x1)) continue;
    if ((lvl === S.from && nz > player.z && nz >= S.z0 - R - .03 && player.z < S.z0) || (lvl === S.to && nz < player.z && nz <= S.z1 + R && player.z > S.z1 - .05)) {
      player.stairs = true; player.st = i; player.x = Math.min(S.x1 - .2, Math.max(S.x0 + .2, nx)); player.z = nz; return;
    }
  }
  const sb = (x, z) => STAIRS.some(S => lvl === S.from && x + R > S.x0 && x - R < S.x1 + .06 && z + R > S.z0 && z - R < S.blockTo);
  const dr = doorAt(nx, nz, lvl); if (dr) setDoor(dr, true);   // walking into a closed door opens it
  if (!blocked(nx, player.z, lvl) && !sb(nx, player.z)) player.x = nx;
  if (!blocked(player.x, nz, lvl) && !sb(player.x, nz)) player.z = nz;
}
function targetY() { if (player.stairs) return onRamp(STAIRS[player.st], player.z); if (player.level) return LEVEL_Y[player.level]; return (player.z > D + 2.6 && player.x > 4.6 && player.z < D + 5.4) ? .16 : 0; }

/* input */
const keys = {};
addEventListener('keydown', e => { if (e.target.tagName === 'INPUT') return; keys[e.code] = true; if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) e.preventDefault(); });
addEventListener('keyup', e => { keys[e.code] = false; });
const cvs = renderer.domElement; cvs.style.touchAction = 'none';
let drag = null; const joy = { id: null, x: 0, y: 0, cx: 0, cy: 0 };
const joyEl = document.getElementById('h3-joy'), knob = document.getElementById('h3-knob');
/* zoom: pinch on touch screens, scroll wheel on a computer */
const ptrs = new Map(); let pinch = null, fov = 70, zoomed = false;
function setFov(v) { fov = Math.max(32, Math.min(105, v)); camera.fov = fov; camera.updateProjectionMatrix(); }
function spread() { const [a, b] = [...ptrs.values()]; return Math.hypot(a.x - b.x, a.y - b.y); }
cvs.addEventListener('wheel', e => { e.preventDefault(); zoomed = true; setFov(fov * Math.exp(e.deltaY * .0012)); }, { passive: false });
cvs.addEventListener('pointerdown', e => {
  ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (ptrs.size === 2) { pinch = { d: Math.max(20, spread()), fov }; drag = null; zoomed = true; return; }
  if (ptrs.size > 2) return;
  drag = { id: e.pointerId, x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY, moved: 0 }; cvs.setPointerCapture(e.pointerId);
});
const ptrUp = e => { ptrs.delete(e.pointerId); if (ptrs.size < 2) pinch = null; };
cvs.addEventListener('pointerup', ptrUp); cvs.addEventListener('pointercancel', ptrUp);
cvs.addEventListener('pointermove', e => {
  if (ptrs.has(e.pointerId)) ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (pinch && ptrs.size === 2) { setFov(pinch.fov * pinch.d / Math.max(20, spread())); return; }
  if (drag && drag.id === e.pointerId) {
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y; drag.x = e.clientX; drag.y = e.clientY; drag.moved += Math.abs(dx) + Math.abs(dy);
    player.yaw -= dx * .0042; player.pitch = Math.max(-1.2, Math.min(1.2, player.pitch - dy * .0036));
  } else if (e.pointerType === 'mouse') hoverAt(e.clientX, e.clientY);
});
cvs.addEventListener('pointerup', e => { if (drag && drag.id === e.pointerId) { if (drag.moved < 8) pickAt(e.clientX, e.clientY); drag = null; } });
cvs.addEventListener('pointercancel', () => { drag = null; });
if (joyEl) {
  joyEl.addEventListener('pointerdown', e => { e.stopPropagation(); const r = joyEl.getBoundingClientRect(); joy.id = e.pointerId; joy.cx = r.left + r.width / 2; joy.cy = r.top + r.height / 2; joyEl.setPointerCapture(e.pointerId); joyMove(e); });
  joyEl.addEventListener('pointermove', e => { if (e.pointerId === joy.id) joyMove(e); });
  const end = e => { if (e.pointerId === joy.id) { joy.id = null; joy.x = joy.y = 0; knob.style.transform = ''; } };
  joyEl.addEventListener('pointerup', end); joyEl.addEventListener('pointercancel', end);
}
function joyMove(e) { let dx = e.clientX - joy.cx, dy = e.clientY - joy.cy; const m = Math.hypot(dx, dy), max = 46; if (m > max) { dx *= max / m; dy *= max / m; } joy.x = dx / max; joy.y = dy / max; knob.style.transform = `translate(${dx}px,${dy}px)`; }

/* picking + panel */
const ray = new THREE.Raycaster(); const ndc = new THREE.Vector2();
const panel = document.getElementById('h3-panel');
let hovered = null, selected = null;
const GLOW = new THREE.Color('#1F7A4D');
function setGlow(key, on, strength) { (groupsByKey[key] || []).forEach(m => { (Array.isArray(m.material) ? m.material : [m.material]).forEach(mt => { if (!mt.emissive) return; if (on) { if (!mt.userData.base) mt.userData.base = mt.emissive.clone(); mt.emissive.copy(GLOW).multiplyScalar(strength); } else if (mt.userData.base) mt.emissive.copy(mt.userData.base); }); }); }
function hit(x, y) {
  const r = cvs.getBoundingClientRect(); ndc.set(((x - r.left) / r.width) * 2 - 1, -((y - r.top) / r.height) * 2 + 1);
  ray.setFromCamera(ndc, camera); ray.far = 12;
  const all = ray.intersectObjects(scene.children, true);
  for (const h of all) { if (h.object.userData.key) return h.object; if (h.object.material && h.object.material.transparent) continue; return null; }
  return null;
}
let hoverT = 0;
function hoverAt(x, y) { const now = performance.now(); if (now - hoverT < 60) return; hoverT = now; const o = hit(x, y), k = o ? o.userData.key : null; if (k !== hovered) { if (hovered && hovered !== selected) setGlow(hovered, false); hovered = k; if (k && k !== selected) setGlow(k, true, .35); cvs.style.cursor = k ? 'pointer' : 'grab'; } }
function pickAt(x, y) { const o = hit(x, y); if (!o) return; if (o.userData.door) toggleDoor(o.userData.door); show(o.userData.key); }
function price(k) { const p = PRICES[k]; return (typeof p === 'number' && p > 0) ? 'We fit from £' + p : 'Ask us for a price'; }
function show(k) {
  if (selected) setGlow(selected, false); selected = k; setGlow(k, true, .6);
  const [n, t, l] = ITEMS[k];
  panel.querySelector('h2').textContent = n;
  panel.querySelector('.h3-price').textContent = price(k);
  panel.querySelector('.h3-price').classList.toggle('ask', !(typeof PRICES[k] === 'number' && PRICES[k] > 0));
  panel.querySelector('p').textContent = t;
  panel.querySelector('.h3-more').href = LINK(l);
  panel.querySelector('.h3-wa').href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent('Hi We Fitt, I\'m interested in: ' + n + '.');
  panel.classList.add('open');
}
panel.querySelector('.h3-close').addEventListener('click', () => { panel.classList.remove('open'); if (selected) setGlow(selected, false); selected = null; });

/* teleport menu */
const SPOTS = {
  'Front garden': [1.4, -6.2, 0, Math.PI, -.05], 'Bike & bin store': [5.3, -3.2, 0, 0, -.25], 'Hall': [1.6, .9, 0, Math.PI, -.05], 'Living room': [3.4, 5.2, 0, -2.4, -.1],
  'Kitchen': [3.0, 6.9, 0, Math.PI * .85, -.15], 'Rear garden': [4, D + 7.5, 0, 0, -.05], 'Landing': [1.7, 5.7, 1, 0, -.05],
  'Bathroom': [2.6, 8.0, 1, Math.PI * .75, -.15], 'Front bedroom': [2.9, 5.0, 1, -2.2, -.1], 'Bedroom 2': [5.6, 7.6, 1, -2.5, -.1],
  'Loft & en-suite': [3.3, 6.3, 2, Math.PI, -.12]
};
const nav = document.getElementById('h3-rooms');
Object.keys(SPOTS).forEach(name => { const b = document.createElement('button'); b.type = 'button'; b.textContent = name; b.addEventListener('click', () => { const [x, z, lv, yaw, pitch] = SPOTS[name]; Object.assign(player, { x, z, level: lv, stairs: false, yaw, pitch }); player.y = targetY(); }); nav.appendChild(b); });

/* resize + loop */
function resize() { const w = stage.clientWidth, h = stage.clientHeight; renderer.setSize(w, h, false); camera.aspect = w / h; if (!zoomed) fov = w / h < .9 ? 88 : 70; camera.fov = fov; camera.updateProjectionMatrix(); }
new ResizeObserver(resize).observe(stage); resize();
player.y = targetY();
let last = performance.now();
const fwd = new THREE.Vector3();
function loop(now) {
  const dt = Math.min(.05, (now - last) / 1000); last = now;
  let mf = 0, ms = 0;
  if (keys.KeyW || keys.ArrowUp) mf += 1; if (keys.KeyS || keys.ArrowDown) mf -= 1;
  if (keys.KeyD) ms += 1; if (keys.KeyA) ms -= 1;
  if (keys.ArrowLeft) player.yaw += 1.8 * dt; if (keys.ArrowRight) player.yaw -= 1.8 * dt;
  if (joy.id !== null) { mf -= joy.y; ms += joy.x; }
  const speed = (keys.ShiftLeft || keys.ShiftRight ? 3.6 : 2.0) * dt;
  if (mf || ms) {
    const sx = -Math.sin(player.yaw), sz = -Math.cos(player.yaw);
    const rx = Math.cos(player.yaw), rz = -Math.sin(player.yaw);
    const n = Math.hypot(mf, ms) > 1 ? Math.hypot(mf, ms) : 1;
    tryMove((sx * mf + rx * ms) / n * speed, (sz * mf + rz * ms) / n * speed);
  }
  for (const d of DOORS) { const t = d.open ? d.ang : 0; if (Math.abs(t - d.cur) > 1e-3) { d.cur += (t - d.cur) * Math.min(1, dt * 7); d.pivot.rotation.y = d.cur; } }
  const ty = targetY(); player.y += (ty - player.y) * Math.min(1, dt * 12);
  camera.position.set(player.x, player.y + EYE, player.z);
  camera.rotation.y = player.yaw; camera.rotation.x = player.pitch;
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}
if (elLoad) elLoad.remove();
document.body.classList.add('h3-ready');
requestAnimationFrame(loop);
window.__h3 = { player, scene, picks: () => picks.length, show, tryMove, targetY, SOLID, DOORS, STAIRS, setDoor, toggleDoor, groupsByKey };
})();
