// Drawn manuscript figures with painted faces cropped from the course artwork.
// Every figure is an SVG in a 120 x 220 box, feet on y = 214. CSS (world.css, ".fig") supplies the walk cycle.
(function (root) {
  'use strict';

  const SKIN = '#e2bf98';
  const GOLD = '#c9a13b';

  // Robe colors are taken from each figure's painting.
  const SPECS = {
    francis:   { head: 'francis',   tunic: '#9a7a4f', mantle: null,      hood: '#8a6a40', cord: true, halo: true },
    adam:      { head: 'adam',      tunic: '#b08d5c', mantle: null,      skins: true },
    moses:     { head: 'moses',     tunic: '#3d5f8f', mantle: '#b0473b', halo: true, staff: true },
    damascene: { head: 'damascene', tunic: '#5a3a28', mantle: '#b8862e', halo: true, scroll: true },
    magus:     { head: 'magus',     tunic: '#c9a43a', mantle: '#e6cf73', gift: true },
    disciple:  { head: 'disciple',  tunic: '#55634a', mantle: '#c99a3c' },
    menas:     { head: 'menas',     tunic: '#b98a3a', mantle: '#d3cdb9', halo: true },
    cash:      { head: 'cash',      tunic: '#1b1b1d', mantle: '#2a2a2e', guitar: true },
    christ:    { head: 'christ',    tunic: '#4a2a35', mantle: '#2f1d29', halo: true, cross: true, book: true },
    buddy:     { head: 'buddy',     tunic: '#efe3b5', mantle: '#b5452f', heart: true, thumbs: true },
  };

  let uid = 0;

  function arm(cls, color, opts) {
    // Pivot at the shoulder (60,72); the arm hangs down 56 units. CSS rotates .arm groups for the walk.
    const hand = `<circle cx="60" cy="128" r="6.5" fill="${SKIN}"/>`;
    const mark = opts.stigmata ? '<circle cx="60" cy="128" r="2.6" fill="#b3261e"/>' : '';
    const holding = opts.holding || '';
    return `<g class="${cls}"><rect x="53" y="70" width="14" height="58" rx="7" fill="${color}"/>${hand}${mark}${holding}</g>`;
  }

  // Returns an <svg> string. opts: { facing: 1|-1, stigmata, pose: 'shoulder'|'thumbs', small, className }
  function figure(id, opts) {
    opts = opts || {};
    // opts.divine adds the cruciform nimbus, which iconography reserves for Christ as God.
    const s = Object.assign({}, SPECS[id] || SPECS.francis, opts.divine ? { halo: true, cross: true } : null);
    const n = ++uid;
    const clip = `fh${n}`;
    const sleeve = s.mantle || s.tunic;
    const feet = opts.stigmata ? '#b3261e' : SKIN;
    const parts = [];

    if (s.guitar) parts.push('<g transform="rotate(-24 60 120)"><ellipse cx="74" cy="138" rx="17" ry="21" fill="#7a4a22"/><rect x="71" y="70" width="6" height="56" fill="#2a1a0e"/><circle cx="74" cy="138" r="5" fill="#2a1a0e"/></g>');
    if (s.staff) parts.push('<rect x="88" y="58" width="5" height="156" rx="2" fill="#6b4a2b"/>');
    // back arm, behind the body
    parts.push(arm('arm arm-b', sleeve, { stigmata: opts.stigmata }));
    // feet
    parts.push(`<g class="foot foot-a"><ellipse cx="50" cy="210" rx="10" ry="5" fill="${feet === SKIN ? '#7a5a3a' : feet}"/><ellipse cx="52" cy="208" rx="7" ry="4" fill="${SKIN}"/>${opts.stigmata ? '<circle cx="52" cy="207" r="2.2" fill="#b3261e"/>' : ''}</g>`);
    parts.push(`<g class="foot foot-b"><ellipse cx="70" cy="210" rx="10" ry="5" fill="#7a5a3a"/><ellipse cx="72" cy="208" rx="7" ry="4" fill="${SKIN}"/>${opts.stigmata ? '<circle cx="72" cy="207" r="2.2" fill="#b3261e"/>' : ''}</g>`);
    // body
    parts.push(`<g class="robe"><path d="M38 66 Q60 58 82 66 L93 200 Q60 209 27 200 Z" fill="${s.tunic}"/>`);
    if (s.skins) parts.push('<g fill="#8a6a40" opacity=".7"><circle cx="48" cy="100" r="3.5"/><circle cx="70" cy="122" r="4"/><circle cx="55" cy="150" r="3"/><circle cx="76" cy="170" r="3.5"/><circle cx="42" cy="180" r="3"/></g>');
    if (s.mantle) parts.push(`<path d="M80 64 Q94 128 76 200 L50 202 Q74 132 40 70 Z" fill="${s.mantle}"/>`);
    if (s.cord) parts.push('<path d="M34 116 Q60 122 86 116" stroke="#efe6cf" stroke-width="3" fill="none"/><path d="M54 120 Q52 150 56 176" stroke="#efe6cf" stroke-width="2.5" fill="none"/><circle cx="56" cy="160" r="2.4" fill="#efe6cf"/>');
    if (s.heart) parts.push(`<g transform="translate(60 98)"><circle r="15" fill="none" stroke="${GOLD}" stroke-width="3" stroke-dasharray="3 3"/><path d="M0 7 C-12 -2 -7 -12 0 -5 C7 -12 12 -2 0 7Z" fill="#c4231d"/></g>`);
    parts.push(`<path d="M40 200 Q60 207 80 200" stroke="rgba(0,0,0,.25)" stroke-width="2" fill="none"/></g>`);
    // head
    if (s.halo) parts.push(`<circle cx="60" cy="38" r="31" fill="${GOLD}" opacity=".95"/><circle cx="60" cy="38" r="31" fill="none" stroke="#8a6a1c" stroke-width="1.5"/>`);
    if (s.cross) parts.push('<g stroke="#b3261e" stroke-width="5"><path d="M60 7 V18"/><path d="M29 38 H38"/><path d="M82 38 H91"/></g>');
    if (s.hood) parts.push(`<path d="M34 46 Q34 10 60 10 Q86 10 86 46 L84 70 Q60 76 36 70 Z" fill="${s.hood}"/>`);
    parts.push(`<rect x="54" y="56" width="12" height="10" fill="${SKIN}"/>`);
    parts.push(`<clipPath id="${clip}"><circle cx="60" cy="38" r="23"/></clipPath><image href="assets/heads/${s.head}.jpg" x="37" y="15" width="46" height="46" clip-path="url(#${clip})" preserveAspectRatio="xMidYMid slice"/><circle cx="60" cy="38" r="23" fill="none" stroke="#5a3d16" stroke-width="1.6"/>`);
    // front arm and things held
    let holding = '';
    if (s.book) holding = `<rect x="50" y="112" width="22" height="28" rx="2" fill="${GOLD}" stroke="#8a6a1c"/><circle cx="61" cy="126" r="3.5" fill="#b3261e"/><circle cx="55" cy="118" r="2" fill="#2f5f8f"/><circle cx="67" cy="134" r="2" fill="#2f5f8f"/>`;
    if (s.scroll) holding = '<rect x="46" y="120" width="28" height="34" fill="#f3ead2" stroke="#8a6a40"/><path d="M50 128h20M50 134h20M50 140h16" stroke="#6b4a2b" stroke-width="1.4"/>';
    if (s.gift) holding = `<path d="M54 116 h12 l-2 16 h-8 z" fill="${GOLD}" stroke="#8a6a1c"/><ellipse cx="60" cy="116" rx="7" ry="2.5" fill="#f1d77c"/>`;
    if (opts.pose === 'thumbs' || s.thumbs) {
      parts.push(`<g><rect x="70" y="40" width="14" height="40" rx="7" fill="${sleeve}" transform="rotate(30 76 74)"/><circle cx="92" cy="44" r="7" fill="${SKIN}"/><rect x="89" y="30" width="5" height="12" rx="2.5" fill="${SKIN}"/></g>`);
    } else if (opts.pose !== 'shoulder') {
      parts.push(arm('arm arm-f', sleeve, { stigmata: opts.stigmata, holding }));
    } else if (holding) {
      parts.push(`<g transform="translate(-6 -22)">${holding}</g>`);
    }

    const flip = opts.facing === -1 ? ' style="transform:scaleX(-1)"' : '';
    return `<svg class="fig ${opts.className || ''}" viewBox="0 0 120 220" aria-hidden="true"${flip}>${parts.join('')}</svg>`;
  }

  // Christ's arm, drawn separately so it can rest on the shoulder of the figure in front of him.
  function shoulderArm() {
    return `<svg class="fig shoulder-arm" viewBox="0 0 120 220" aria-hidden="true"><path d="M30 74 Q70 64 104 76" stroke="${SPECS.christ.mantle}" stroke-width="15" stroke-linecap="round" fill="none"/><ellipse cx="106" cy="78" rx="8" ry="6.5" fill="${SKIN}"/></svg>`;
  }

  // A brother: a small friar in a hooded habit with a cord. No painted face; the brothers are anonymous.
  function friar(i) {
    const hues = ['#8a6a40', '#7d5f39', '#94744a', '#866642'];
    const c = hues[i % hues.length];
    return `<svg class="fig friar-fig" viewBox="0 0 120 220" aria-hidden="true">
      <g class="arm arm-b"><rect x="53" y="70" width="14" height="54" rx="7" fill="${c}"/><circle cx="60" cy="124" r="6" fill="${SKIN}"/></g>
      <g class="foot foot-a"><ellipse cx="50" cy="210" rx="9" ry="4.5" fill="${SKIN}"/></g>
      <g class="foot foot-b"><ellipse cx="70" cy="210" rx="9" ry="4.5" fill="${SKIN}"/></g>
      <g class="robe"><path d="M38 66 Q60 58 82 66 L93 202 Q60 210 27 202 Z" fill="${c}"/><path d="M34 116 Q60 122 86 116" stroke="#efe6cf" stroke-width="3" fill="none"/></g>
      <path d="M34 46 Q34 12 60 12 Q86 12 86 46 L84 70 Q60 76 36 70 Z" fill="${c}"/>
      <circle cx="60" cy="42" r="17" fill="${SKIN}"/><path d="M52 40 h4 M64 40 h4" stroke="#3a2a1a" stroke-width="2"/><path d="M55 50 q5 3 10 0" stroke="#7a3a2a" stroke-width="1.6" fill="none"/>
      <g class="arm arm-f"><rect x="53" y="70" width="14" height="54" rx="7" fill="${c}"/><circle cx="60" cy="124" r="6" fill="${SKIN}"/></g>
    </svg>`;
  }

  root.Figures = { figure, shoulderArm, friar, SPECS };
})(this);
