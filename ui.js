// Renders each screen from GAME_CONTENT + GameLogic state, and turns clicks and keys into logic calls.
// Stations are a walkable world (world.js); everything else is a page of the manuscript.
(function () {
  'use strict';
  const C = window.GAME_CONTENT, L = window.GameLogic, A = window.GameAudio, Wd = window.World, F = window.Figures;
  const leaf = document.getElementById('leaf');
  const stage = document.getElementById('stage');
  const muteBtn = document.getElementById('mute');

  const app = { screen: 'title', selected: null, game: null, busy: false, joined: 0, entry: 'walk-in', travelTimer: 0 };

  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const player = () => C.roster.find(r => r.id === app.selected) || C.roster[0];
  const station = () => C.stations[app.game.station];
  const fmt = n => n.toLocaleString('en-US');
  const wait = ms => new Promise(r => setTimeout(r, ms));

  function setLeaf(cls, html) {
    Wd.unmount();
    leaf.className = cls || '';
    leaf.innerHTML = '<div class="screen">' + html + '</div>';
    const primary = leaf.querySelector('[data-primary]');
    if (primary) primary.focus({ preventScroll: true });
  }

  // ---------- manuscript pages ----------
  function renderTitle() {
    setLeaf('', `
      <section class="title-screen">
        <div class="title-initial"><span class="gilt">W</span></div>
        <div>
          <h1>${esc(C.title)}</h1>
          <h2>${esc(C.subtitle)}</h2>
          <p class="colophon">${esc(C.course)}</p>
          <button class="btn" data-action="begin" data-primary>Begin the journey<span class="key">Enter</span></button>
        </div>
      </section>`);
  }

  function renderSelect() {
    const cards = C.roster.map((r, i) => `
      <button class="card${r.id === app.selected ? ' walking' : ''}" data-action="pick" data-id="${esc(r.id)}" aria-pressed="${r.id === app.selected}">
        <span class="card-fig">${F.figure(r.id)}</span>
        <span class="card-text"><b>${esc(r.name)}</b><small>${esc(r.caption)}</small><small>${esc(r.session)}</small></span>
        <span class="card-key">${i + 1}</span>
      </button>`).join('');
    const line = !app.selected ? 'Pick a figure, or press 1–8.'
      : app.selected === 'francis' ? 'Francis will walk his own way, in the footsteps of Christ.'
      : esc(player().name) + ' will follow in the footsteps of Francis.';
    setLeaf('', `
      <section class="select-screen">
        <h1>Choose who walks the Way</h1>
        <p class="sub">Francis walked in the footsteps of Christ. Anyone may walk in his. Each face comes from a work of art in the course.</p>
        <div class="roster">${cards}</div>
        <div class="select-foot">
          <p>${line}</p>
          <button class="btn" data-action="walk" ${app.selected ? 'data-primary' : 'disabled'}>Walk the Way<span class="key">Enter</span></button>
        </div>
      </section>`);
  }

  function renderGuide() {
    const g = C.guideIntro;
    setLeaf('', `
      <section class="guide-screen">
        <figure><img src="${esc(g.img)}" alt="Christ and Abba Menas, a sixth-century Coptic icon"><figcaption class="cite">${esc(g.caption)}</figcaption></figure>
        <div>
          <h1>${esc(g.heading)}</h1>
          <p>${esc(g.text)}</p>
          <p class="verse">${esc(g.verse)}</p>
          <p class="cite">${esc(g.verseCite)}</p>
          <div class="guide-party"><div class="party walking" style="transform:translateX(150px)">${Wd.party(app.selected, 0, false)}</div></div>
          <p><button class="btn" data-action="setout" data-primary>Set out<span class="key">Enter</span></button></p>
        </div>
      </section>`);
  }

  // ---------- the walkable station ----------
  function hud() {
    const g = app.game, st = station();
    const noHelp = g.helpUsed || st.doors.every((d, i) => d.best || g.sealed.includes(i));
    return `<div class="hud">
      <div>Rank: <b>${esc(g.rank)}</b></div>
      <div>Brothers: ${g.brothers ? fmt(g.brothers) : 'none yet'}</div>
      ${g.stigmata ? '<div>Bears the marks <span class="wounds" title="The stigmata"><i></i><i></i><i></i><i></i><i></i></span></div>' : ''}
      <button class="btn call" data-action="help" ${noHelp ? 'disabled' : ''}>Call on Christ<span class="key">H</span></button>
      <div class="controls">Walk to a door, then press ↑<br>(or click a door)</div>
    </div>`;
  }

  function doorsHtml() {
    const g = app.game, st = station();
    return g.order.map((di, slot) => {
      const d = st.doors[di], sealed = g.sealed.includes(di), x = Wd.DOOR_X[slot];
      return `<div class="plaque${sealed ? ' sealed' : ''}" data-action="door" data-slot="${slot}" style="left:${x - 110}px;bottom:${Wd.H - (Wd.GROUND - Wd.DOOR_H) + 14}px"><span class="num">${slot + 1}</span>${esc(d.label)}</div>
        <button class="door2${sealed ? ' sealed' : ''}" data-action="door" data-slot="${slot}" style="left:${x - Wd.DOOR_W / 2}px;top:${Wd.GROUND - Wd.DOOR_H}px" aria-label="Door ${slot + 1}: ${esc(d.label)}${sealed ? ' (sealed)' : ''}">
          <span class="glow"></span><span class="leafwood"></span>
        </button>`;
    }).join('');
  }

  function renderStation() {
    const g = app.game, st = station();
    const keep = { t: Wd.ctl.target, l: Wd.ctl.keys.l, r: Wd.ctl.keys.r };
    const where = [st.place, st.date].filter(Boolean).map(esc).join(' · ');
    setLeaf('world-leaf', `
      <section class="station2">
        <header class="scroll">
          <div class="scroll-text">
            <div class="head-line"><span class="numeral">${esc(st.numeral)}</span><h1>${esc(st.title)}</h1><span class="where">${where} <span class="cite">${esc(st.cite)}</span></span></div>
            <p class="scene initial">${esc(st.scene)}</p>
            <p class="guide-line"><span class="who">Christ beside you:</span> <span class="words">${esc(st.guide.text)}</span> <span class="cite">${esc(st.guide.cite)}</span></p>
            ${g.helpUsed ? `<p class="help-note">You called on Christ, and He sealed a false door: ${esc(C.helpLine.text)} <span class="cite">${esc(C.helpLine.cite)}</span></p>` : ''}
          </div>
          ${hud()}
        </header>
        <div class="world" id="world">
          ${Wd.backdrop(st)}
          ${doorsHtml()}
          <div class="trap" id="trap"></div>
          <div class="party" id="party">${Wd.party(app.selected, g.brothers, g.stigmata, { fresh: app.joined })}</div>
        </div>
      </section>`);
    app.joined = 0;
    const partyEl = document.getElementById('party');
    const onNear = i => leaf.querySelectorAll('.plaque').forEach((p, k) => p.classList.toggle('near', k === i));
    if (app.entry === 'walk-in') {
      Wd.mount(partyEl, -80, onNear);
      Wd.ctl.dir = 1;
      Wd.walkTo(380);
    } else if (app.entry === 'climb') {
      Wd.mount(partyEl, 400, onNear);
    } else {
      Wd.mount(partyEl, Wd.ctl.x, onNear);
      if (keep.t != null) Wd.walkTo(keep.t);
      Wd.ctl.keys.l = keep.l; Wd.ctl.keys.r = keep.r;
    }
    app.entry = 'stay';
  }

  function enterDoor(slot) {
    const g = app.game;
    if (app.busy || app.screen !== 'game' || g.phase !== 'station') return;
    const di = g.order[slot];
    if (di == null || g.sealed.includes(di)) return;
    app.busy = true;
    const x = Wd.DOOR_X[slot];
    Wd.walkTo(station().final && station().doors[di].best ? x - 110 : x, async () => {
      Wd.ctl.locked = true;
      const door = leaf.querySelector(`.door2[data-slot="${slot}"]`);
      if (door) door.classList.add('open');
      A.play('door');
      await wait(650);
      const before = app.game.brothers;
      const next = L.choose(C, app.game, slot);
      const partyEl = document.getElementById('party');
      if (next.phase === 'fallen') {
        const trap = document.getElementById('trap');
        if (trap) { trap.style.left = (x - 62) + 'px'; trap.classList.add('open'); }
        partyEl.classList.add('falling');
        A.play('fall');
        await wait(1300);
        app.game = next; app.busy = false; app.entry = 'climb';
        return renderFallen();
      }
      if (next.phase === 'buddy') {
        if (door) door.insertAdjacentHTML('beforeend', `<span class="buddy-in-door">${F.figure('buddy', { pose: 'thumbs' })}</span>`);
        A.play('buddy');
        await wait(1900);
        app.game = next; app.busy = false;
        return render();
      }
      partyEl.classList.add('entering');
      A.play('bell');
      await wait(900);
      app.game = next; app.joinedNow = next.brothers - before; app.busy = false;
      showPassCard();
    });
  }

  function showPassCard() {
    const g = app.game, st = station(), d = st.doors[g.chosen];
    const world = document.getElementById('world');
    const art = st.art ? `<figure class="pass-art"><img src="${esc(st.art.img)}" alt="${esc(st.art.caption)}"><figcaption class="cite">${esc(st.art.caption)}</figcaption></figure>` : '';
    world.insertAdjacentHTML('beforeend', `
      <div class="pass-card${art ? ' with-art' : ''}">
        ${art}
        <div>
          <h2>The door opens</h2>
          <p class="cite">You chose: ${esc(d.label)}</p>
          <p class="gloss initial">${esc(d.pass)}</p>
          <p class="cite">${esc(d.cite)}</p>
          ${app.joinedNow ? `<p class="joiners">New brothers will join the procession. Now there are ${fmt(g.brothers)}.</p>` : ''}
          <button class="btn" data-action="continue" data-primary>Continue on the Way<span class="key">Enter</span></button>
        </div>
      </div>`);
    const b = world.querySelector('[data-primary]'); if (b) b.focus({ preventScroll: true });
  }

  // ---------- travel between stations ----------
  function renderTravel() {
    const g = app.game, st = station();
    const where = [st.place, st.date].filter(Boolean).map(esc).join(' · ');
    setLeaf('world-leaf', `
      <section class="travel">
        <div class="world" id="world">
          ${Wd.backdrop(st, { travel: true })}
          <div class="banner"><span class="numeral">${esc(st.numeral)}</span><span class="t">${esc(st.title)}</span><span class="w">${where}</span></div>
          <div class="party walking" id="party">${Wd.party(app.selected, g.brothers, g.stigmata, { fresh: app.joined })}</div>
          <p class="skip">Enter to skip</p>
        </div>
      </section>`);
    const partyEl = document.getElementById('party');
    partyEl.style.transform = 'translateX(470px)';
    clearTimeout(app.travelTimer);
    app.travelTimer = setTimeout(endTravel, 3400);
  }

  function endTravel() {
    clearTimeout(app.travelTimer);
    if (app.screen !== 'travel') return;
    app.screen = 'game'; app.entry = 'walk-in';
    if (app.game.phase === 'intro') A.play('seraph');
    render();
  }

  // ---------- other pages ----------
  function renderFallen() {
    const g = app.game, st = station(), d = st.doors[g.lastMiss];
    const opener = C.buddyOpeners[(g.falls - 1) % C.buddyOpeners.length];
    setLeaf('dark', `
      <section class="pit">
        <div><div class="roundel"><img src="assets/buddy.jpg" alt="Buddy Christ, a statue of a grinning Christ giving a thumbs-up"></div><p class="cite pit-caption">${esc(C.buddyPitCaption)}</p></div>
        <div>
          <h1>Through the trap door</h1>
          <p class="chosen">You chose: ${esc(d.label)}</p>
          <p class="opener">${esc(opener)}</p>
          <p class="correction">${esc(d.correction)}</p>
          <p class="cite">${esc(d.cite)}</p>
          ${g.falls === 1 ? `<div class="motto">${esc(C.buddyMotto.text)}<div class="cite">${esc(C.buddyMotto.cite)}</div></div>` : ''}
          <p style="margin-top:16px"><button class="btn" data-action="climb" data-primary>Climb back up<span class="key">Enter</span></button></p>
        </div>
      </section>`);
  }

  function renderStigmata() {
    const t = station().introText;
    // Six wings (Isa 6:2): a pair over the face, a pair over the feet, a pair spread to fly.
    const wings = [-48, -4, 40].map(a => {
      const r = a * Math.PI / 180, cx = 210 + 98 * Math.cos(r), cy = 226 + 98 * Math.sin(r);
      const one = (x, rot) => `<ellipse cx="${x.toFixed(1)}" cy="${cy.toFixed(1)}" rx="98" ry="28" transform="rotate(${rot} ${x.toFixed(1)} ${cy.toFixed(1)})" fill="url(#plume)"/>`;
      return one(cx, a) + one(420 - cx, 180 - a);
    }).join('');
    setLeaf('night', `
      <section class="laverna">
        <svg class="seraph" viewBox="0 0 420 460" role="img" aria-label="A seraph with six wings, and between them the crucified Christ">
          <defs><linearGradient id="plume" x1="0" x2="1"><stop offset="0" stop-color="#8e1610"/><stop offset=".6" stop-color="#d9473d"/><stop offset="1" stop-color="#f1d77c"/></linearGradient><radialGradient id="halo"><stop offset="0" stop-color="#fff3c4"/><stop offset=".6" stop-color="#f1d77c" stop-opacity=".6"/><stop offset="1" stop-color="#f1d77c" stop-opacity="0"/></radialGradient></defs>
          <circle cx="210" cy="230" r="200" fill="url(#halo)" opacity=".35"/>
          <g class="wings">${wings}</g>
          <g stroke="#f1d77c" stroke-width="10" stroke-linecap="round"><path d="M210 150 V330"/><path d="M160 190 H260"/></g>
          <g fill="#ff5a4e"><circle cx="164" cy="190" r="6"/><circle cx="256" cy="190" r="6"/><circle cx="210" cy="322" r="6"/><circle cx="222" cy="232" r="5"/></g>
        </svg>
        <div>
          <h1>La Verna, September 1224</h1>
          <p>${esc(t.lead)}</p>
          <p class="verse">${esc(t.bonaventure)}</p>
          <p class="cite">${esc(t.bonaventureCite)}</p>
          <p class="verse">${esc(t.paul)}</p>
          <p class="cite">${esc(t.paulCite)}</p>
          <p style="font-size:18px">${esc(t.seal)} <span class="cite">(Pelikan 136)</span></p>
          <p style="margin-top:14px"><button class="btn" data-action="receive" data-primary>Receive the marks<span class="key">Enter</span></button></p>
        </div>
      </section>`);
  }

  function renderBuddy() {
    const g = C.gate;
    setLeaf('', `
      <section class="buddy-screen">
        <div><span class="arch" style="display:block"><img src="assets/buddy.jpg" alt="Buddy Christ, a statue of a grinning Christ pointing and giving a thumbs-up"></span><p class="cite" style="margin-top:8px">${esc(g.buddyCaption)}</p></div>
        <div>
          <h1>A friend was waiting behind the door</h1>
          <p class="verse">${esc(g.buddyLine)}</p>
          <p class="cite">${esc(g.buddyCite)}</p>
          <p style="font-size:21px;margin-top:16px">${esc(g.gregory)}</p>
          <p class="cite">${esc(g.gregoryCite)}</p>
          <p style="margin-top:20px"><button class="btn" data-action="gate" data-primary>Walk through the gate with Him<span class="key">Enter</span></button></p>
        </div>
      </section>`);
  }

  function renderGate() {
    const g = C.gate, gm = app.game;
    setLeaf('gold', `
      <section class="gate-screen">
        <div class="gates" id="gates"><div class="glow"></div>
          <div class="gate-walkers walking"><span class="gw">${F.figure(app.selected, { stigmata: gm.stigmata })}</span><span class="gw buddy">${F.figure('buddy', { pose: 'thumbs' })}</span></div>
          <div class="bar l"></div><div class="bar r"></div></div>
        <div>
          <p>The gate that would not open from your side opens from His.</p>
          <p class="rank-flip"><span class="was">Servant</span><span class="now">Friend</span></p>
          <p class="verse">${esc(g.brethren)}</p>
          <p class="cite">${esc(g.brethrenCite)}</p>
          <p style="margin-top:22px"><button class="btn" data-action="finish" data-primary>Continue<span class="key">Enter</span></button></p>
        </div>
      </section>`);
    requestAnimationFrame(() => requestAnimationFrame(() => { const el = document.getElementById('gates'); if (el) el.classList.add('open'); }));
  }

  function renderEnding() {
    const e = C.ending, g = app.game;
    setLeaf('', `
      <section class="ending">
        <p class="lead">${esc(e.lead)}</p>
        <p class="big">${esc(e.verse)}</p>
        <p class="cite">${esc(e.verseCite)}</p>
        <p class="stats">${esc(player().name)} reached the end of the Way as a friend of Christ, after ${g.falls} trap door${g.falls === 1 ? '' : 's'} and ${g.helps} call${g.helps === 1 ? '' : 's'} for help.</p>
        <div class="credits">${e.credits.map(c => `<p>${esc(c)}</p>`).join('')}</div>
        <button class="btn" data-action="again" data-primary>Walk the Way again<span class="key">Enter</span></button>
        <div class="ending-party"><div class="party walking" style="transform:translateX(330px)">${Wd.party(app.selected, g.brothers, g.stigmata)}</div></div>
      </section>`);
  }

  function render() {
    if (app.screen === 'title') return renderTitle();
    if (app.screen === 'select') return renderSelect();
    if (app.screen === 'guide') return renderGuide();
    if (app.screen === 'travel') return renderTravel();
    const ph = app.game.phase;
    if (ph === 'intro') return renderStigmata();
    if (ph === 'station') return renderStation();
    if (ph === 'fallen') return renderFallen();
    if (ph === 'passed') { renderStation(); return showPassCard(); }
    if (ph === 'buddy') return renderBuddy();
    if (ph === 'gate') return renderGate();
    if (ph === 'ending') return renderEnding();
  }

  // ---------- actions ----------
  function startGame(startAt) {
    app.game = L.initState(C, app.selected, { startAt });
    app.screen = 'game';
    app.joined = 0;
    app.entry = 'walk-in';
    if (app.game.phase === 'intro') A.play('seraph');
  }

  const actions = {
    begin() { A.startDrone(); A.play('bell'); app.screen = 'select'; render(); },
    pick(el) { app.selected = el.dataset.id; A.play('seal'); render(); },
    walk() { if (!app.selected) return; app.screen = 'guide'; render(); },
    setout() { startGame(0); render(); },
    door(el) { enterDoor(Number(el.dataset.slot)); },
    help() {
      if (app.busy || !app.game || app.game.phase !== 'station') return;
      const next = L.callOnChrist(C, app.game);
      if (next === app.game) return;
      const slot = next.order.indexOf(next.sealed[next.sealed.length - 1]);
      app.game = next; A.play('seal'); app.entry = 'stay'; render();
      leaf.querySelectorAll(`[data-slot="${slot}"]`).forEach(el => el.classList.add('pulse'));
    },
    climb() { app.game = L.climbBack(app.game); app.entry = 'climb'; render(); },
    continue() {
      app.joined = app.joinedNow || 0; app.joinedNow = 0;
      app.game = L.advance(C, app.game);
      app.screen = 'travel';
      render();
    },
    receive() { app.game = L.beginStation(C, app.game); A.play('seal'); app.entry = 'walk-in'; render(); },
    gate() { app.game = L.openGate(app.game); A.play('gate'); render(); },
    finish() { app.game = L.finish(app.game); A.play('bell'); render(); },
    again() { app.game = null; app.screen = 'select'; render(); },
  };

  leaf.addEventListener('click', e => {
    if (app.screen === 'travel') { endTravel(); return; }
    const el = e.target.closest('[data-action]');
    if (!el || el.disabled) return;
    const fn = actions[el.dataset.action];
    if (fn) fn(el);
  });

  const inStation = () => app.screen === 'game' && app.game && app.game.phase === 'station' && !app.busy;

  document.addEventListener('keydown', e => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    const k = e.key.toLowerCase();
    if (k === 'm') { toggleMute(); return; }
    if (app.screen === 'travel' && (k === 'enter' || k === ' ')) { e.preventDefault(); endTravel(); return; }
    if (k === 'enter' || k === ' ') {
      const f = document.activeElement;
      if (e.repeat) { e.preventDefault(); return; }
      if (f && f.tagName === 'BUTTON' && !f.hasAttribute('data-primary')) return; // a focused button activates itself
    }
    if (app.screen === 'select' && /^[1-8]$/.test(k)) {
      const r = C.roster[Number(k) - 1]; if (r) { app.selected = r.id; A.play('seal'); render(); } return;
    }
    if (inStation()) {
      if (k === 'arrowleft' || k === 'a') { Wd.ctl.keys.l = true; Wd.ctl.target = null; e.preventDefault(); return; }
      if (k === 'arrowright' || k === 'd') { Wd.ctl.keys.r = true; Wd.ctl.target = null; e.preventDefault(); return; }
      if (/^[1-3]$/.test(k)) { enterDoor(Number(k) - 1); return; }
      if (k === 'h') { actions.help(); return; }
      if (k === 'arrowup' || k === 'w' || k === 'enter' || k === ' ') {
        e.preventDefault();
        if (Wd.ctl.near >= 0) enterDoor(Wd.ctl.near); else showHint();
        return;
      }
    }
    if (k === 'enter' || k === ' ') {
      const p = leaf.querySelector('[data-primary]');
      if (p) { e.preventDefault(); p.click(); }
    }
  });
  document.addEventListener('keyup', e => {
    const k = e.key.toLowerCase();
    if (k === 'arrowleft' || k === 'a') Wd.ctl.keys.l = false;
    if (k === 'arrowright' || k === 'd') Wd.ctl.keys.r = false;
  });

  window.addEventListener('blur', () => { Wd.ctl.keys.l = Wd.ctl.keys.r = false; });

  function showHint() {
    const w = document.getElementById('world');
    if (!w) return;
    const old = w.querySelector('.hint'); if (old) old.remove();
    w.insertAdjacentHTML('beforeend', '<div class="hint">Walk up to a door first, or click one.</div>');
    setTimeout(() => { const h = w.querySelector('.hint'); if (h) h.remove(); }, 1800);
  }

  function toggleMute() {
    const m = A.toggleMute();
    muteBtn.classList.toggle('off', m);
    muteBtn.setAttribute('aria-label', m ? 'Unmute sound' : 'Mute sound');
  }
  muteBtn.addEventListener('click', () => { toggleMute(); muteBtn.blur(); });

  function fit() {
    const s = Math.min(window.innerWidth / 1280, window.innerHeight / 720);
    stage.style.transform = `scale(${s})`;
  }
  window.addEventListener('resize', fit);
  fit();

  // ?station=N&char=id jumps straight to a station, for testing and re-recording.
  const q = new URLSearchParams(location.search);
  if (q.has('station')) {
    app.selected = q.get('char') || 'francis';
    startGame(Math.max(0, Number(q.get('station')) - 1));
  }
  render();
  window.__game = app; // for automated play-through checks
  window.__enterDoor = enterDoor;
})();
