// Every sound is synthesized here with WebAudio, so the game ships with no audio files.
(function (root) {
  'use strict';
  let ctx = null, master = null, drone = null, muted = false;

  function ensure() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return true; }
    const AC = root.AudioContext || root.webkitAudioContext;
    if (!AC) return false;
    // Browsers refuse audio before the first click or key press; wait for one rather than log warnings.
    if (navigator.userActivation && !navigator.userActivation.hasBeenActive) return false;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : 0.8;
    master.connect(ctx.destination);
    return true;
  }

  function tone(freq, start, dur, type, gain, dest) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, start);
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(gain, start + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    o.connect(g); g.connect(dest || master);
    o.start(start); o.stop(start + dur + 0.05);
    return o;
  }

  function noise(start, dur, from, to, gain) {
    const len = Math.ceil(ctx.sampleRate * dur), buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    src.buffer = buf; f.type = 'bandpass'; f.Q.value = 6;
    f.frequency.setValueAtTime(from, start); f.frequency.exponentialRampToValueAtTime(to, start + dur);
    g.gain.setValueAtTime(gain, start); g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    src.connect(f); f.connect(g); g.connect(master); src.start(start);
  }

  function bell(base, t, gain) {
    [1, 2.0, 2.76, 5.4].forEach((r, i) => tone(base * r, t, 2.4 - i * 0.4, 'sine', gain / (i + 1)));
  }

  const sfx = {
    door() { const t = ctx.currentTime; noise(t, 0.7, 380, 900, 0.25); tone(70, t, 0.4, 'triangle', 0.25); },
    fall() { const t = ctx.currentTime; const o = tone(420, t, 1.0, 'sine', 0.3); o.frequency.exponentialRampToValueAtTime(55, t + 1.0); noise(t + 0.15, 0.9, 1200, 150, 0.18); },
    bell() { bell(523.25, ctx.currentTime, 0.22); },
    buddy() { const t = ctx.currentTime; bell(783.99, t, 0.16); bell(1046.5, t + 0.12, 0.12); },
    seal() { const t = ctx.currentTime; tone(110, t, 0.5, 'triangle', 0.35); bell(659.25, t + 0.05, 0.1); },
    seraph() { const t = ctx.currentTime; [261.63, 329.63, 392, 523.25].forEach((f, i) => tone(f, t + i * 0.35, 3.5, 'sine', 0.08)); },
    gate() {
      const t = ctx.currentTime, lp = ctx.createBiquadFilter();
      lp.type = 'lowpass'; lp.frequency.value = 1800; lp.connect(master);
      [130.81, 196, 261.63, 329.63, 392, 523.25].forEach(f => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'sawtooth'; o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.045, t + 0.8); g.gain.exponentialRampToValueAtTime(0.0001, t + 5.5);
        o.connect(g); g.connect(lp); o.start(t); o.stop(t + 5.6);
      });
      bell(523.25, t + 1.8, 0.2);
    },
  };

  function play(name) {
    if (!ensure() || !sfx[name]) return;
    try { sfx[name](); } catch (e) { /* sound is decoration; never block the game on it */ }
  }

  function startDrone() {
    if (!ensure() || drone) return;
    const g = ctx.createGain(); g.gain.value = 0.0001; g.connect(master);
    g.gain.exponentialRampToValueAtTime(0.03, ctx.currentTime + 3);
    [110, 164.81, 110.4].forEach(f => { const o = ctx.createOscillator(); o.type = 'triangle'; o.frequency.value = f; o.connect(g); o.start(); });
    drone = g;
  }

  function toggleMute() {
    muted = !muted;
    if (master) master.gain.setTargetAtTime(muted ? 0 : 0.8, ctx.currentTime, 0.05);
    return muted;
  }

  root.GameAudio = { play, startDrone, toggleMute, isMuted: () => muted };
})(this);
