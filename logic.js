// Pure game state for "The Way of St. Francis". No DOM here: ui.js renders whatever these return.
// Phases: intro -> station -> (fallen -> station)* -> passed -> next station ... final: buddy -> gate -> ending
(function (root) {
  'use strict';

  function rng(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function doorOrder(state, content, stationIdx) {
    const n = content.stations[stationIdx].doors.length;
    const order = Array.from({ length: n }, (_, i) => i);
    if (state.shuffle === false) return order;
    const r = rng(state.seed * 31 + stationIdx);
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(r() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    return order;
  }

  function enter(content, state, stationIdx) {
    const st = content.stations[stationIdx];
    const next = Object.assign({}, state, {
      station: stationIdx,
      phase: st.intro ? 'intro' : 'station',
      sealed: [],
      helpUsed: false,
      lastMiss: null,
    });
    next.order = doorOrder(next, content, stationIdx);
    return next;
  }

  function initState(content, charId, opts) {
    opts = opts || {};
    const base = {
      charId,
      seed: opts.seed == null ? Math.floor(Math.random() * 1e9) : opts.seed,
      shuffle: opts.shuffle !== false,
      rank: 'Servant',
      brothers: 0,
      stigmata: false,
      falls: 0,
      helps: 0,
    };
    const start = Math.max(0, Math.min(opts.startAt || 0, content.stations.length - 1));
    for (let i = 0; i < start; i++) {
      const st = content.stations[i];
      if (st.brothersAfter != null) base.brothers = st.brothersAfter;
      if (st.grantsStigmata) base.stigmata = true;
    }
    return enter(content, base, start);
  }

  function beginStation(content, state) {
    if (state.phase !== 'intro') return state;
    const st = content.stations[state.station];
    return Object.assign({}, state, { phase: 'station', stigmata: state.stigmata || !!st.grantsStigmata });
  }

  function choose(content, state, slot) {
    if (state.phase !== 'station') return state;
    const doorIdx = state.order[slot];
    if (doorIdx == null || state.sealed.includes(doorIdx)) return state;
    const st = content.stations[state.station];
    const door = st.doors[doorIdx];
    if (!door.best) {
      return Object.assign({}, state, {
        phase: 'fallen',
        lastMiss: doorIdx,
        sealed: state.sealed.concat(doorIdx),
        falls: state.falls + 1,
      });
    }
    if (st.final) return Object.assign({}, state, { phase: 'buddy', chosen: doorIdx });
    return Object.assign({}, state, {
      phase: 'passed',
      chosen: doorIdx,
      brothers: st.brothersAfter != null ? st.brothersAfter : state.brothers,
    });
  }

  function climbBack(state) {
    if (state.phase !== 'fallen') return state;
    return Object.assign({}, state, { phase: 'station' });
  }

  function callOnChrist(content, state) {
    if (state.phase !== 'station' || state.helpUsed) return state;
    const doors = content.stations[state.station].doors;
    const target = state.order.find(i => !doors[i].best && !state.sealed.includes(i));
    if (target == null) return state;
    return Object.assign({}, state, {
      helpUsed: true,
      helps: state.helps + 1,
      sealed: state.sealed.concat(target),
    });
  }

  function advance(content, state) {
    if (state.phase !== 'passed') return state;
    if (state.station + 1 >= content.stations.length) return state;
    return enter(content, state, state.station + 1);
  }

  function openGate(state) {
    if (state.phase !== 'buddy') return state;
    return Object.assign({}, state, { phase: 'gate', rank: 'Friend' });
  }

  function finish(state) {
    if (state.phase !== 'gate') return state;
    return Object.assign({}, state, { phase: 'ending' });
  }

  function validateContent(content) {
    const errs = [];
    if (!content || !Array.isArray(content.stations)) return ['content has no stations array'];
    if (!Array.isArray(content.roster) || content.roster.length === 0) errs.push('roster is empty');
    content.stations.forEach((st, si) => {
      const where = `station ${si + 1} (${st.id || '?'})`;
      if (!Array.isArray(st.doors) || st.doors.length !== 3) { errs.push(`${where}: needs exactly 3 doors`); return; }
      if (st.intro && !st.introText) errs.push(`${where}: intro station missing introText`);
      const best = st.doors.filter(d => d.best).length;
      if (best !== 1) errs.push(`${where}: needs exactly one best door, has ${best}`);
      st.doors.forEach((d, di) => {
        if (!d.label) errs.push(`${where} door ${di + 1}: missing label`);
        if (!d.cite) errs.push(`${where} door ${di + 1}: missing cite`);
        if (!d.best && !d.correction) errs.push(`${where} door ${di + 1}: lesser door missing correction`);
        if (d.best && !d.pass && !st.final) errs.push(`${where} door ${di + 1}: best door missing pass`);
      });
    });
    return errs;
  }

  const api = { initState, beginStation, choose, climbBack, callOnChrist, advance, openGate, finish, validateContent };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.GameLogic = api;
})(this);
