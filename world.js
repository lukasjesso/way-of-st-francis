// The side-scrolling world: Giotto-style backdrops, a building with three doors per station,
// the walking procession (brothers, Christ, the player), and the controller that moves it.
(function (root) {
  'use strict';
  const F = root.Figures;

  const W = 1206, H = 430, GROUND = 372;           // world size; feet stand on GROUND
  const DOOR_X = [560, 800, 1040];                 // door centres
  const DOOR_W = 112, DOOR_H = 168;
  const MIN_X = 70, MAX_X = 1150, SPEED = 230;
  const NEAR = 62;

  // ---------- backdrop ----------
  function rand(seed) { let a = seed * 9301 + 49297; return () => ((a = (a * 9301 + 49297) % 233280) / 233280); }

  function hills(seed, y0, color, light, height, width) {
    const r = rand(seed); let x = -40, d = `M-40 ${H}`;
    const pts = [];
    while (x < width + 80) {
      const w = 90 + r() * 120, top = y0 - r() * height;
      pts.push([x, top, w]);
      x += w * 0.8;
    }
    // Giotto's rocks: flat-topped stepped plateaus with a lit face on one side.
    let body = '', facets = '', trees = '';
    pts.forEach(([px, top, w]) => {
      body += `<path d="M${px} ${y0 + 40} L${px + w * 0.18} ${top + 10} L${px + w * 0.3} ${top} L${px + w * 0.62} ${top} L${px + w * 0.72} ${top + 14} L${px + w} ${y0 + 40} Z"/>`;
      facets += `<path d="M${px + w * 0.3} ${top} L${px + w * 0.62} ${top} L${px + w * 0.5} ${top + 22} L${px + w * 0.22} ${top + 30} Z"/>`;
      if (r() > 0.55) trees += `<g><rect x="${px + w * 0.45}" y="${top - 18}" width="3" height="16" fill="#4a3420"/><ellipse cx="${px + w * 0.45 + 1.5}" cy="${top - 22}" rx="8" ry="11" fill="#33502e"/></g>`;
    });
    return `<g fill="${color}">${body}</g><g fill="${light}" opacity=".55">${facets}</g>${trees}`;
  }

  const SKIES = {
    day: ['#24428f', '#4f72b8'],
    night: ['#0c1233', '#1d2a5c'],
    dawn: ['#2b2550', '#c47d5c'],
    dusk: ['#232655', '#d69a58'],
  };

  function sky(kind) {
    const [top, bottom] = SKIES[kind] || SKIES.day;
    let extra = '';
    if (kind === 'night' || kind === 'dawn' || kind === 'dusk') {
      const r = rand(7);
      for (let i = 0; i < 40; i++) extra += `<circle cx="${(r() * W).toFixed(0)}" cy="${(r() * 170).toFixed(0)}" r="${(r() * 1.6 + 0.4).toFixed(1)}" fill="#f1d77c" opacity="${(r() * 0.6 + 0.3).toFixed(2)}"/>`;
    }
    return `<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/></linearGradient></defs>
      <rect width="${W}" height="${H}" fill="url(#sky)"/>${extra}`;
  }

  function road() {
    return `<rect y="${GROUND - 6}" width="${W}" height="${H - GROUND + 6}" fill="#b89a62"/>
      <rect y="${GROUND - 6}" width="${W}" height="6" fill="#8f7444"/>
      <g fill="#a3864f">${Array.from({ length: 30 }, (_, i) => `<ellipse cx="${i * 43 + 12}" cy="${GROUND + 22 + (i % 3) * 9}" rx="9" ry="3"/>`).join('')}</g>`;
  }

  function recesses() { // dark openings behind each door
    return DOOR_X.map(x => `<path d="M${x - DOOR_W / 2 - 6} ${GROUND} V${GROUND - DOOR_H + 44} C${x - DOOR_W / 2 - 6} ${GROUND - DOOR_H - 4} ${x - 20} ${GROUND - DOOR_H - 14} ${x} ${GROUND - DOOR_H - 20} C${x + 20} ${GROUND - DOOR_H - 14} ${x + DOOR_W / 2 + 6} ${GROUND - DOOR_H - 4} ${x + DOOR_W / 2 + 6} ${GROUND - DOOR_H + 44} V${GROUND} Z" fill="#1d130b" stroke="#c9a13b" stroke-width="3"/>`).join('');
  }

  const L = 430, R = 1160; // facade extent
  const BUILDINGS = {
    town() { // Assisi: pink stone wall, a bell tower, roofs behind
      const merlons = Array.from({ length: 19 }, (_, i) => `<rect x="${L + i * 39}" y="168" width="24" height="22"/>`).join('');
      const roofs = [480, 610, 760, 900, 1050].map((x, i) => `<path d="M${x - 50} 190 L${x} ${142 - (i % 2) * 18} L${x + 50} 190 Z" fill="#b5523a"/>`).join('');
      return `${roofs}<g fill="#e3b3a0" stroke="#b07a68" stroke-width="2"><rect x="${L}" y="188" width="${R - L}" height="${GROUND - 188}"/>${merlons}
        <rect x="372" y="60" width="64" height="${GROUND - 60}"/><path d="M366 60 L404 18 L442 60 Z" fill="#b5523a"/></g>
        <g fill="#5a3a2a"><path d="M392 92 h24 v30 h-24z"/><path d="M392 150 h24 v30 h-24z"/></g>`;
    },
    ruin() { // a ruined church, with the crucifix Francis prayed before
      return `<path d="M${L - 50} ${GROUND} V170 L470 150 L520 178 L600 140 L690 172 L760 128 L850 168 L930 150 L1010 176 L1090 138 L${R} 168 V${GROUND} Z" fill="#d8c6a0" stroke="#9c8a62" stroke-width="2"/>
        <g stroke="#9c8a62" stroke-width="2" fill="none"><path d="M650 176 l14 30 -8 22"/><path d="M915 160 l-10 26 12 18"/></g>
        <g fill="#c9b58b" stroke="#9c8a62"><rect x="470" y="${GROUND - 10}" width="22" height="12"/><rect x="1110" y="${GROUND - 14}" width="26" height="14"/><rect x="1132" y="${GROUND - 8}" width="16" height="8"/></g>
        <g transform="translate(442 206)"><rect x="-4" y="0" width="8" height="96" fill="#7a2a20"/><rect x="-30" y="22" width="60" height="9" fill="#7a2a20"/><rect x="-2.5" y="8" width="5" height="70" fill="#f1d77c"/><rect x="-24" y="24" width="48" height="5" fill="#f1d77c"/><circle cy="12" r="7" fill="#c9a13b"/></g>`;
    },
    arcade() { // a rustic loggia with a tiled roof
      return `<path d="M${L - 20} 168 L${R + 20} 168 L${R} 150 L${L} 150 Z" fill="#b5523a"/>
        <rect x="${L}" y="168" width="${R - L}" height="${GROUND - 168}" fill="#dcc596" stroke="#a88d5a" stroke-width="2"/>
        <g fill="#cdb37f">${[L + 10, 680, 920, R - 26].map(x => `<rect x="${x}" y="168" width="16" height="${GROUND - 168}"/>`).join('')}</g>`;
    },
    palace() { // the Lateran: marble, columns, pediment with a mosaic band
      return `<path d="M${L} 120 L795 36 L${R} 120 Z" fill="#efe3d0" stroke="#b9a586" stroke-width="2"/>
        <circle cx="795" cy="88" r="20" fill="#2f4f9a" stroke="#c9a13b" stroke-width="3"/>
        <rect x="${L}" y="120" width="${R - L}" height="14" fill="#c9a13b"/>
        <g>${Array.from({ length: 36 }, (_, i) => `<rect x="${L + i * 20.3}" y="123" width="10" height="8" fill="${['#b3261e', '#2f4f9a', '#f1d77c'][i % 3]}"/>`).join('')}</g>
        <rect x="${L}" y="134" width="${R - L}" height="${GROUND - 134}" fill="#f2e6d2" stroke="#b9a586" stroke-width="2"/>
        <g fill="#e2d2b8" stroke="#b9a586">${[L + 8, 670, 910, R - 30].map(x => `<rect x="${x}" y="134" width="22" height="${GROUND - 134}"/>`).join('')}</g>`;
    },
    forest() { // the woods where Francis met Lady Poverty
      const trunks = [L + 10, 670, 910, R - 20].map(x => `<rect x="${x}" y="110" width="20" height="${GROUND - 110}" fill="#5a3a22"/>`).join('');
      const crowns = Array.from({ length: 11 }, (_, i) => `<ellipse cx="${L - 10 + i * 72}" cy="${90 + (i % 3) * 22}" rx="66" ry="${54 + (i % 2) * 14}" fill="${i % 2 ? '#2f4a2a' : '#3b5a32'}"/>`).join('');
      return `${crowns}<rect x="${L}" y="186" width="${R - L}" height="${GROUND - 186}" fill="#3f5a2e"/>${trunks}
        <g fill="#56763e">${Array.from({ length: 24 }, (_, i) => `<circle cx="${L + i * 31}" cy="${190 + (i % 2) * 6}" r="14"/>`).join('')}</g>`;
    },
    meadow() { // Brother Sun and Sister Moon over a garden wall with vine arbors
      const rays = Array.from({ length: 16 }, (_, i) => { const a = i * Math.PI / 8; return `<path d="M${200 + Math.cos(a) * 46} ${82 + Math.sin(a) * 46} L${200 + Math.cos(a + 0.1) * 72} ${82 + Math.sin(a + 0.1) * 72} L${200 + Math.cos(a - 0.1) * 72} ${82 + Math.sin(a - 0.1) * 72}Z"/>`; }).join('');
      return `<g fill="#f1d77c">${rays}</g><circle cx="200" cy="82" r="42" fill="#f6dc7a" stroke="#c9a13b" stroke-width="3"/>
        <path d="M1110 46 a34 34 0 1 0 22 60 a28 28 0 1 1 -22 -60z" fill="#efe6cf"/>
        <rect x="${L}" y="226" width="${R - L}" height="${GROUND - 226}" fill="#cbb48a" stroke="#9c8a62" stroke-width="2"/>
        <g fill="none" stroke="#3f6a32" stroke-width="10" stroke-linecap="round">${DOOR_X.map(x => `<path d="M${x - 78} ${GROUND} V196 Q${x} 120 ${x + 78} 196 V${GROUND}"/>`).join('')}</g>
        <g fill="#c4231d">${DOOR_X.map(x => `<circle cx="${x - 60}" cy="174" r="5"/><circle cx="${x + 40}" cy="150" r="5"/><circle cx="${x + 72}" cy="200" r="5"/>`).join('')}</g>`;
    },
    stable() { // Greccio: Giotto's thatched shed, and the star
      return `<g transform="translate(250 60)"><path d="M0 0 l10 -26 l10 26 l26 6 l-26 6 l-10 26 l-10 -26 l-26 -6z" fill="#f1d77c"/><path d="M-20 4 Q-90 -10 -150 30" stroke="#f1d77c" stroke-width="3" fill="none" opacity=".7"/></g>
        <path d="M${L - 30} 168 L795 96 L${R + 30} 168 Z" fill="#d9b25a" stroke="#9c7a2c" stroke-width="2"/>
        <g stroke="#b08a3a" stroke-width="2">${Array.from({ length: 30 }, (_, i) => `<path d="M${L - 20 + i * 25} 166 l12 -${18 + (i % 3) * 8}"/>`).join('')}</g>
        <rect x="${L}" y="168" width="${R - L}" height="${GROUND - 168}" fill="#8a5a32"/>
        <g stroke="#6b4426" stroke-width="3">${Array.from({ length: 24 }, (_, i) => `<path d="M${L + i * 31} 168 V${GROUND}"/>`).join('')}</g>`;
    },
    mountain() { // La Verna: a grey crag with a chapel cut into it
      return `<path d="M330 ${GROUND} L380 150 L470 120 L540 60 L640 90 L720 30 L830 70 L930 40 L1040 96 L1130 70 L1206 120 V${GROUND} Z" fill="#7d7b84" stroke="#5c5a62" stroke-width="2"/>
        <g fill="#9c9aa3" opacity=".7"><path d="M540 60 L600 80 L560 130 Z"/><path d="M720 30 L790 60 L740 110 Z"/><path d="M930 40 L1000 70 L950 120 Z"/></g>
        <rect x="${L}" y="200" width="${R - L}" height="${GROUND - 200}" fill="#a39f98" stroke="#6f6c66" stroke-width="2"/>
        <g fill="none" stroke="#8a8780" stroke-width="2">${Array.from({ length: 5 }, (_, i) => `<path d="M${L} ${220 + i * 32} H${R}"/>`).join('')}</g>`;
    },
    chapel() { // the Portiuncula: a small chapel, a bell-cote, the evening light
      return `<path d="M${L} 196 L795 70 L${R} 196 Z" fill="#e6d6b4" stroke="#a8926a" stroke-width="2"/>
        <rect x="783" y="34" width="24" height="40" fill="#e6d6b4" stroke="#a8926a" stroke-width="2"/><path d="M779 34 L795 18 L811 34Z" fill="#b5523a"/><circle cx="795" cy="56" r="6" fill="#5a3a2a"/>
        <circle cx="795" cy="150" r="22" fill="#f1d77c" stroke="#c9a13b" stroke-width="3"/>
        <rect x="${L}" y="196" width="${R - L}" height="${GROUND - 196}" fill="#ecdfc2" stroke="#a8926a" stroke-width="2"/>`;
    },
  };

  function backdrop(station, opts) {
    opts = opts || {};
    const kind = station ? station.sky || 'day' : 'day';
    const seed = station ? station.numeral.length * 13 + station.title.length : 3;
    const span = opts.travel ? W * 2 : W;
    const building = station && !opts.travel && BUILDINGS[station.scenery] ? BUILDINGS[station.scenery]() + recesses() : '';
    return `<svg class="backdrop" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true">
      ${sky(kind)}
      <g class="far">${hills(seed, 250, '#c9a56a', '#ead2a0', 90, span)}</g>
      <g class="near">${hills(seed + 5, 320, '#a9824c', '#d8bd86', 70, span)}</g>
      ${building}
      ${road()}
    </svg>`;
  }

  // ---------- the procession ----------
  function party(charId, brothers, stigmata, opts) {
    opts = opts || {};
    const shown = Math.min(brothers || 0, 7);
    const friars = Array.from({ length: shown }, (_, i) =>
      `<div class="slot friar${opts.fresh && i >= shown - opts.fresh ? ' joining' : ''}" style="left:${-150 - i * 34}px;animation-delay:${i * 90}ms">${F.friar(i)}</div>`).join('');
    return `${friars}
      <div class="slot christ" style="left:-108px">${F.figure('christ', { pose: 'shoulder' })}</div>
      <div class="slot player">${F.figure(charId, { stigmata })}</div>
      <div class="slot christ-arm" style="left:-108px">${F.shoulderArm()}</div>`;
  }

  // ---------- controller ----------
  const ctl = { x: 140, target: null, dir: 1, keys: { l: false, r: false }, el: null, onArrive: null, raf: 0, last: 0, near: -1, locked: false, onNear: null, sealed: [] };

  function mount(el, x, onNear) {
    ctl.el = el; ctl.x = x; ctl.target = null; ctl.onArrive = null; ctl.locked = false; ctl.onNear = onNear; ctl.near = -2;
    place(false);
    if (!ctl.raf) { ctl.last = performance.now(); ctl.raf = requestAnimationFrame(tick); }
  }

  function unmount() { ctl.el = null; ctl.keys.l = ctl.keys.r = false; }

  function place(walking) {
    if (!ctl.el) return;
    ctl.el.style.transform = `translateX(${ctl.x.toFixed(1)}px) scaleX(${ctl.dir})`;
    ctl.el.classList.toggle('walking', !!walking);
    const near = DOOR_X.findIndex(dx => Math.abs(dx - ctl.x) < NEAR);
    if (near !== ctl.near) { ctl.near = near; if (ctl.onNear) ctl.onNear(near); }
  }

  function tick(now) {
    const dt = Math.min(0.05, (now - ctl.last) / 1000); ctl.last = now;
    if (ctl.el && !ctl.locked) {
      let moved = false;
      if (ctl.target != null) {
        const d = ctl.target - ctl.x;
        if (Math.abs(d) < 3) { ctl.x = ctl.target; ctl.target = null; const cb = ctl.onArrive; ctl.onArrive = null; place(false); if (cb) cb(); }
        else { ctl.dir = d > 0 ? 1 : -1; ctl.x += Math.sign(d) * Math.min(Math.abs(d), SPEED * dt); moved = true; }
      } else {
        const v = (ctl.keys.r ? 1 : 0) - (ctl.keys.l ? 1 : 0);
        if (v) { ctl.dir = v; ctl.x = Math.min(MAX_X, Math.max(Math.min(ctl.x, MIN_X), ctl.x + v * SPEED * dt)); moved = true; }
      }
      if (moved || ctl.target != null) place(true);
      else if (ctl.el.classList.contains('walking') && !ctl.keys.l && !ctl.keys.r) place(false);
    }
    ctl.raf = requestAnimationFrame(tick);
  }

  function walkTo(x, cb) { ctl.target = Math.max(MIN_X - 200, Math.min(MAX_X + 200, x)); ctl.onArrive = cb; }

  root.World = { W, H, GROUND, DOOR_X, DOOR_W, DOOR_H, backdrop, party, mount, unmount, walkTo, ctl, place };
})(this);
