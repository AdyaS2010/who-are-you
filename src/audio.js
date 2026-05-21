// WHO//ARE//YOU? — Audio Engine
// Calm mystical ambient music + SFX, all settings-compliant
export class AudioEngine {
  constructor() {
    this.ctx = null; this.initialized = false;
    this.musicVol = 0.5; this.sfxVol = 0.7; this.muted = false;
    this._amb = null; this._music = null; this._musicPhase = 0;
  }

  init() {
    if (this.initialized) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.master = this.ctx.createGain(); this.master.gain.value = 0.3;
      this.musicBus = this.ctx.createGain(); this.musicBus.gain.value = this.musicVol;
      this.sfxBus  = this.ctx.createGain(); this.sfxBus.gain.value  = this.sfxVol;
      this.musicBus.connect(this.master); this.sfxBus.connect(this.master);
      this.master.connect(this.ctx.destination);
      this.initialized = true;
    } catch(e) {}
  }

  resume() { if (this.ctx?.state === 'suspended') this.ctx.resume(); }

  setMusicVol(v) {
    this.musicVol = v;
    if (this.musicBus) this.musicBus.gain.value = this.muted ? 0 : v;
  }
  setSfxVol(v) {
    this.sfxVol = v;
    if (this.sfxBus) this.sfxBus.gain.value = this.muted ? 0 : v;
  }
  setMute(m) {
    this.muted = m;
    if (this.master) this.master.gain.value = m ? 0 : 0.3;
  }

  // ─── CALM MYSTICAL BACKGROUND MUSIC ─────────────────────────────────────────
  // Layered sine/triangle drones + slow melodic arpeggios + subtle reverb
  startMusic() {
    if (!this.ctx) return;
    this.stopMusic();

    const t = this.ctx.currentTime;

    // --- Reverb convolver for warmth ---
    const revLen  = this.ctx.sampleRate * 2.5;
    const revBuf  = this.ctx.createBuffer(2, revLen, this.ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = revBuf.getChannelData(ch);
      for (let i = 0; i < revLen; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / revLen, 2.5);
    }
    const reverb = this.ctx.createConvolver(); reverb.buffer = revBuf;
    const revGain = this.ctx.createGain(); revGain.gain.value = 0.35;
    reverb.connect(revGain); revGain.connect(this.musicBus);

    // Dry gain path
    const dryGain = this.ctx.createGain(); dryGain.gain.value = 0.65;
    dryGain.connect(this.musicBus);

    // Helper: create a sustained drone oscillator
    const drone = (freq, type, vol, attack = 3) => {
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      const f = this.ctx.createBiquadFilter();
      o.type = type; o.frequency.value = freq;
      f.type = 'lowpass'; f.frequency.value = 600; f.Q.value = 0.8;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(vol, t + attack);
      o.connect(f); f.connect(g);
      g.connect(dryGain); g.connect(reverb);
      o.start(t); return { o, g };
    };

    // Root drone chord — Am/C/G ethereal cluster (mystical, open-ended)
    const nodes = [
      drone(55,  'sine',     0.055, 4),  // A1  sub-bass
      drone(110, 'sine',     0.07,  3),  // A2  bass
      drone(165, 'triangle', 0.05,  4),  // E3
      drone(220, 'sine',     0.06,  5),  // A3
      drone(261, 'triangle', 0.04,  5),  // C4
      drone(330, 'sine',     0.035, 6),  // E4
    ];

    // Slow, barely perceptible vibrato on mid drones for life
    nodes.slice(2).forEach(({ o }, i) => {
      const lfo = this.ctx.createOscillator();
      const lfoG = this.ctx.createGain();
      lfo.frequency.value = 0.18 + i * 0.04;
      lfoG.gain.value = 0.8;
      lfo.connect(lfoG); lfoG.connect(o.frequency);
      lfo.start(t);
      nodes.push({ o: lfo, g: lfoG }); // track for cleanup
    });

    // --- Melodic arpeggio layer (soft triangle, slow loop) ---
    const scale = [220, 261.6, 293.7, 329.6, 392, 440, 523.3]; // A minor pentatonic+
    let step = 0;
    const arpSpeed = 2.1; // seconds per note

    const scheduleArp = () => {
      if (!this._music) return;
      const freq = scale[step % scale.length];
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      const now = this.ctx.currentTime;
      o.type = 'triangle'; o.frequency.value = freq;
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(0.028, now + 0.4);
      g.gain.linearRampToValueAtTime(0.012, now + arpSpeed * 0.8);
      g.gain.linearRampToValueAtTime(0, now + arpSpeed);
      o.connect(g); g.connect(reverb); g.connect(dryGain);
      o.start(now); o.stop(now + arpSpeed + 0.1);
      step++;
    };
    scheduleArp();
    const arpTimer = setInterval(scheduleArp, arpSpeed * 1000);

    // --- High shimmer sparkles (rare, crystal-like) ---
    const shimmerNotes = [880, 1047, 1319, 1568];
    let shimmerStep = 0;
    const shimmerTimer = setInterval(() => {
      if (!this._music || Math.random() > 0.45) return;
      const freq = shimmerNotes[shimmerStep % shimmerNotes.length];
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      const now = this.ctx.currentTime;
      o.type = 'sine'; o.frequency.value = freq;
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(0.015, now + 0.08);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);
      o.connect(g); g.connect(reverb);
      o.start(now); o.stop(now + 1.5);
      shimmerStep++;
    }, 3400);

    this._music = { nodes, arpTimer, shimmerTimer, reverb, revGain, dryGain };
  }

  stopMusic() {
    if (!this._music) return;
    const { nodes, arpTimer, shimmerTimer } = this._music;
    clearInterval(arpTimer);
    clearInterval(shimmerTimer);
    const now = this.ctx.currentTime;
    nodes.forEach(({ o, g }) => {
      try {
        g.gain.cancelScheduledValues(now);
        g.gain.linearRampToValueAtTime(0, now + 1.5);
        setTimeout(() => { try { o.stop(); } catch(e) {} }, 1800);
      } catch(e) {}
    });
    this._music = null;
  }

  // Adjust music to phase character (more unsettling for phase 4, etc.)
  setMusicPhase(phase) {
    this._musicPhase = phase;
    if (!this._music) return;
    // Phase 4 (Glitch): add tension by slightly detuning drones
    if (phase === 4) {
      this._music.nodes.slice(0, 3).forEach(({ o }) => {
        try {
          const cur = o.frequency.value;
          o.frequency.linearRampToValueAtTime(cur * 1.012, this.ctx.currentTime + 3);
        } catch(e) {}
      });
    } else {
      // restore warmth
      this._music.nodes.slice(0, 3).forEach(({ o }) => {
        try {
          o.frequency.cancelScheduledValues(this.ctx.currentTime);
        } catch(e) {}
      });
    }
  }

  // ─── PLATFORMER AMBIENT (phase-specific atmosphere on top of music) ─────────
  startAmbient(phase) {
    this.stopAmbient();
    if (!this.ctx) return;
    this.setMusicPhase(phase);
    // Additional thin texture layer per phase
    const chords = { 2: [110, 165], 3: [98, 131], 4: [55] };
    const notes  = chords[phase] || [];
    this._amb = notes.map(freq => {
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      const f = this.ctx.createBiquadFilter();
      o.type = phase === 4 ? 'sawtooth' : 'sine';
      o.frequency.value = freq;
      f.type = 'lowpass'; f.frequency.value = phase === 4 ? 150 : 400;
      g.gain.value = 0;
      g.gain.linearRampToValueAtTime(0.03, this.ctx.currentTime + 3);
      o.connect(f); f.connect(g); g.connect(this.musicBus);
      o.start(); return { o, g };
    });
  }

  stopAmbient() {
    if (!this._amb) return;
    this._amb.forEach(({ o, g }) => {
      g.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1);
      setTimeout(() => { try { o.stop(); } catch(e){} }, 1200);
    }); this._amb = null;
  }

  // ─── SFX ───────────────────────────────────────────────────────────────────
  _noise(dur, freq, vol) {
    if (!this.ctx) return;
    const len = this.ctx.sampleRate * dur;
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (len * 0.1));
    const s = this.ctx.createBufferSource(); s.buffer = buf;
    const g = this.ctx.createGain(); g.gain.value = vol;
    const f = this.ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = freq;
    s.connect(f); f.connect(g); g.connect(this.sfxBus); s.start();
  }
  playFootstep() { this._noise(0.04, 500 + Math.random() * 400, 0.08); }
  playLand()     { this._noise(0.06, 300, 0.12); }
  playJump() {
    if (!this.ctx) return;
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = 'sine'; o.frequency.value = 250;
    o.frequency.linearRampToValueAtTime(500, this.ctx.currentTime + 0.1);
    g.gain.value = 0.08; g.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.12);
    o.connect(g); g.connect(this.sfxBus); o.start(); o.stop(this.ctx.currentTime + 0.15);
  }
  playCollect() {
    if (!this.ctx) return;
    [523, 659, 784, 1047].forEach((f, i) => {
      const o = this.ctx.createOscillator(), g = this.ctx.createGain();
      o.type = 'sine'; o.frequency.value = f; g.gain.value = 0;
      g.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + i * 0.07 + 0.01);
      g.gain.linearRampToValueAtTime(0, this.ctx.currentTime + i * 0.07 + 0.2);
      o.connect(g); g.connect(this.sfxBus);
      o.start(this.ctx.currentTime + i * 0.07);
      o.stop(this.ctx.currentTime + i * 0.07 + 0.25);
    });
  }
  playCrystal() {
    if (!this.ctx) return;
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = 'triangle'; o.frequency.value = 880; g.gain.value = 0.1;
    g.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.5);
    o.connect(g); g.connect(this.sfxBus); o.start(); o.stop(this.ctx.currentTime + 0.6);
  }
  playGlitch() { this._noise(0.15, 3000, 0.12); }

  // Card flip sound for Guess Who
  playCardFlip() {
    if (!this.ctx) return;
    this._noise(0.05, 1200, 0.07);
    setTimeout(() => this._noise(0.03, 2400, 0.04), 55);
  }
}
