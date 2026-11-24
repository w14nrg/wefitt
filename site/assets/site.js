{
const WA = '442073860000';
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* mobile menu */
const menuBtn = document.querySelector('.menu-btn');
const nav = document.querySelector('.nav');
if (menuBtn && nav) {
  menuBtn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
}

/* open now badge — shop hours, London time */
const hours = {1:[7,20],2:[7,20],3:[7,20],4:[7,20],5:[7,20],6:[8,18],0:[10,18]};
function londonNow(){
  const parts = new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/London',weekday:'short',hour:'2-digit',minute:'2-digit',hour12:false}).formatToParts(new Date());
  const get = t => parts.find(p => p.type === t)?.value;
  const days = {Sun:0,Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6};
  return {d: days[get('weekday')], h: parseInt(get('hour'),10) % 24, m: parseInt(get('minute'),10)};
}
function fmt(h){ return h === 12 ? '12pm' : h > 12 ? (h-12)+'pm' : h+'am'; }
function updateBadge(){
  const n = londonNow(); const [o,c] = hours[n.d]; const now = n.h + n.m/60;
  let text, open = false;
  if (now >= o && now < c) { open = true; text = 'Open now · until ' + fmt(c); }
  else if (now < o) { text = 'Closed · opens ' + fmt(o); }
  else { const t = hours[(n.d+1)%7]; text = 'Closed · opens ' + fmt(t[0]) + ' tomorrow'; }
  document.querySelectorAll('.open-badge').forEach(b => {
    b.classList.toggle('is-open', open);
    const s = b.querySelector('span'); if (s) s.textContent = text;
  });
}
updateBadge(); setInterval(updateBadge, 60000);

/* scroll animations — tag content automatically on every page */
document.documentElement.classList.add('js');
const AUTO = [
  ['main h1, main .kicker, main .lead, main .crumbs, main .row', 'up'],
  ['.prose > h2, .prose > h3, .prose > p, .prose > ul, .prose > ol, .prose > .check, .prose > .faq', 'up'],
  ['.facts > div, .grid > *, .steps > div, .ticks p, .faq details, .side-box, .room-card li', 'pop'],
  ['.house, .mini-store, .builder, .renov, .card, .cat, .garden, .ph, .contact-band h2', 'up'],
];
AUTO.forEach(([sel, kind]) => document.querySelectorAll(sel).forEach(el => {
  if (el.closest('.site-head, .picker') || el.classList.contains('reveal')) return;
  el.classList.add('reveal', 'rv-' + kind);
}));
// ripple: siblings that animate together get a short stagger
document.querySelectorAll('.reveal').forEach(el => {
  const sibs = [...el.parentElement.children].filter(c => c.classList.contains('reveal'));
  const i = sibs.indexOf(el);
  if (sibs.length > 1) el.style.transitionDelay = Math.min(i, 6) * 70 + 'ms';
});
const revealEls = document.querySelectorAll('.reveal');
if (!reduce && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), {rootMargin: '0px 0px -6% 0px', threshold: 0.08});
  revealEls.forEach(el => io.observe(el));
} else { revealEls.forEach(el => el.classList.add('in')); }

/* rotating headline */
const rotor = document.querySelector('.rotor .word');
if (rotor) {
  const words = JSON.parse(rotor.dataset.words);
  if (!reduce) {
    let i = 0, ch = words[0].length, deleting = true;
    const tick = () => {
      const w = words[i];
      if (deleting) { ch--; rotor.textContent = w.slice(0, ch); if (ch <= 0) { deleting = false; i = (i+1) % words.length; } setTimeout(tick, 45); }
      else { const nw = words[i]; ch++; rotor.textContent = nw.slice(0, ch); if (ch >= nw.length) { deleting = true; setTimeout(tick, 1700); } else setTimeout(tick, 75); }
    };
    setTimeout(tick, 2200);
  }
}

/* house cut-away */
const house = document.querySelector('.house');
if (house) {
  const card = document.querySelector('.room-card');
  const data = JSON.parse(document.getElementById('rooms-data').textContent);
  const show = key => {
    const r = data[key]; if (!r) return;
    house.querySelectorAll('.room').forEach(g => { const on = g.dataset.room === key; g.classList.toggle('on', on); g.setAttribute('aria-pressed', String(on)); });
    card.querySelector('h3').textContent = r.title;
    card.querySelector('p').textContent = r.text;
    const ul = card.querySelector('ul'); ul.innerHTML = '';
    r.items.forEach(([label, href]) => { const li = document.createElement('li'); const a = document.createElement('a'); a.textContent = label; a.href = href; li.appendChild(a); ul.appendChild(li); });
    const go = card.querySelector('.room-go'); go.textContent = 'Talk to us about ' + r.short;
    go.dataset.pre = r.job;
  };
  house.querySelectorAll('.room').forEach(g => {
    g.addEventListener('click', () => show(g.dataset.room));
    g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(g.dataset.room); } });
  });
  show('kitchen');
}

/* job picker -> WhatsApp */
const picker = document.getElementById('picker');
const chosen = new Set();
function openPicker(pre){
  if (!picker) return;
  if (pre) { chosen.add(pre); syncPicker(); }
  picker.classList.add('open');
  picker.querySelector('button.x').focus();
}
function syncPicker(){
  picker.querySelectorAll('.seg button').forEach(b => b.setAttribute('aria-pressed', String(chosen.has(b.dataset.job))));
}
if (picker) {
  picker.querySelectorAll('.seg button').forEach(b => b.addEventListener('click', () => {
    chosen.has(b.dataset.job) ? chosen.delete(b.dataset.job) : chosen.add(b.dataset.job);
    syncPicker(); picker.querySelector('.err').textContent = '';
  }));
  picker.querySelector('button.x').addEventListener('click', () => picker.classList.remove('open'));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') picker.classList.remove('open'); });
  picker.querySelector('form').addEventListener('submit', e => {
    e.preventDefault();
    const err = picker.querySelector('.err');
    if (!chosen.size) { err.textContent = 'Pick at least one job first.'; return; }
    const pc = picker.querySelector('#pk-postcode').value.trim();
    const note = picker.querySelector('#pk-note').value.trim();
    let msg = 'Hi We Fitt, I need: ' + [...chosen].join(', ') + '.';
    if (pc) msg += ' Postcode: ' + pc + '.';
    if (note) msg += ' ' + note;
    window.location.href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(msg);
  });
  document.querySelectorAll('[data-picker]').forEach(b => b.addEventListener('click', e => { e.preventDefault(); openPicker(b.dataset.pre || b.dataset.picker || ''); }));
}

/* bike & bin store builder (full on the stores page, mini on the home page) */
document.querySelectorAll('[data-store]').forEach(builder => {
  const st = {bikes: 2, bins: 2, roof: 'Green sedum roof', clad: 'Natural larch'};
  const mixes = {Bikes: [3, 0], Bins: [0, 2], Both: [2, 2]};
  const clads = {'Natural larch':['#B98A5A','#9C7146'], 'Black stained':['#2B2B2B','#1E1E1E'], 'Painted grey':['#8C918E','#727875']};
  const svg = builder.querySelector('svg');
  const summary = builder.querySelector('.summary-line');
  function draw(){
    const bikeW = st.bikes ? 70 + st.bikes * 46 : 0;
    const binW = st.bins * 78;
    const gap = bikeW && binW ? 10 : 0;
    const W = bikeW + binW + gap; const X0 = (520 - W) / 2; const H = 150; const base = 260;
    const [c1, c2] = clads[st.clad];
    let s = `<rect x="0" y="${base}" width="520" height="40" fill="#24382C"/>`;
    const unit = (x, w, label) => {
      let u = `<rect x="${x}" y="${base-H}" width="${w}" height="${H}" fill="${c1}" rx="3"/>`;
      for (let y = base - H + 12; y < base; y += 14) u += `<rect x="${x+4}" y="${y}" width="${w-8}" height="6" fill="${c2}" rx="1"/>`;
      u += `<text x="${x + w/2}" y="${base + 26}" text-anchor="middle" fill="#E6F0E9" font-size="17" font-weight="600" font-family="Inter,sans-serif">${label}</text>`;
      return u;
    };
    let x = X0;
    if (bikeW) { s += unit(x, bikeW, st.bikes + ' bikes'); x += bikeW + gap; }
    for (let b = 0; b < st.bins; b++) { s += unit(x, 72, 'Bin'); s += `<rect x="${x+30}" y="${base-H+50}" width="12" height="4" fill="#C9874A"/>`; x += 78; }
    const rx = X0 - 8, rw = W + 16, ry = base - H - 16;
    s += `<rect x="${rx}" y="${ry}" width="${rw}" height="16" fill="#3A3631" rx="2"/>`;
    if (st.roof === 'Green sedum roof') {
      for (let i = 0; i < rw; i += 9) {
        const h = 8 + ((i * 7) % 11);
        const col = ['#5E9C55','#7DB86A','#A3C96B','#C98B6B'][(i / 9) % 4 | 0];
        s += `<ellipse cx="${rx + 4 + i}" cy="${ry - 2}" rx="7" ry="${h/2}" fill="${col}"/>`;
      }
    }
    svg.innerHTML = s;
    if (summary) summary.textContent = (st.bikes ? st.bikes + ' bikes' : 'No bikes') + ' · ' + (st.bins ? st.bins + (st.bins > 1 ? ' bins' : ' bin') : 'no bins') + ' · ' + st.roof.toLowerCase() + ' · ' + st.clad.toLowerCase();
  }
  builder.querySelectorAll('.seg').forEach(seg => {
    seg.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
      const k = seg.dataset.key; let v = b.dataset.v;
      if (k === 'mix') { [st.bikes, st.bins] = mixes[v]; }
      else {
        if (k === 'bikes' || k === 'bins') v = parseInt(v, 10);
        if (k === 'bikes' && v === 0 && st.bins === 0) return;
        if (k === 'bins' && v === 0 && st.bikes === 0) return;
        st[k] = v;
      }
      seg.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      draw();
    }));
  });
  const send = builder.querySelector('.send-store');
  if (send) send.addEventListener('click', () => {
    const msg = 'Hi We Fitt, I\'d like to talk about a garden store: ' + summary.textContent + '.';
    window.location.href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(msg);
  });
  draw();
});

document.querySelectorAll('.year').forEach(y => y.textContent = new Date().getFullYear());
}
