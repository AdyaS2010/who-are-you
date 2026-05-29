// noise maker module
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

  // background tunes
  startMusic(aestheticName) {
    if (!this.ctx) return;
    this.stopMusic();

    if (aestheticName) this.activeAesthetic = aestheticName;
    const aes = this.activeAesthetic || 'Ocean';

    const t = this.ctx.currentTime;

    // defaults
    let filterFreq = 600;
    let basePitchMultiplier = 1.0;
    let arpSpeed = 2.1;
    let mainOscType = 'triangle';
    let droneOscType = 'sine';
    let dryVol = 0.65;
    let revVol = 0.35;

    // visual filters mapping to noise
    if (aes === 'Midnight') {
      filterFreq = 260;
      basePitchMultiplier = 0.75;
      arpSpeed = 2.4;
      mainOscType = 'sine';
      droneOscType = 'sine';
      dryVol = 0.55;
    } else if (aes === 'Sunrise') {
      filterFreq = 1000;
      basePitchMultiplier = 1.25;
      arpSpeed = 1.6;
      mainOscType = 'triangle';
      droneOscType = 'triangle';
    } else if (aes === 'Storm') {
      filterFreq = 420;
      basePitchMultiplier = 0.85;
      arpSpeed = 2.5;
      mainOscType = 'triangle';
      droneOscType = 'triangle';
      revVol = 0.45;
    } else if (aes === 'Ocean') {
      filterFreq = 480;
      basePitchMultiplier = 1.0;
      arpSpeed = 2.2;
      mainOscType = 'sine';
      droneOscType = 'sine';
      dryVol = 0.5;
      revVol = 0.5;
    } else if (aes === 'Forest') {
      filterFreq = 720;
      basePitchMultiplier = 1.05;
      arpSpeed = 1.9;
      mainOscType = 'triangle';
      droneOscType = 'sine';
    } else if (aes === 'Neon') {
      filterFreq = 1200;
      basePitchMultiplier = 1.2;
      arpSpeed = 1.4;
      mainOscType = 'triangle';
      droneOscType = 'triangle';
      dryVol = 0.7;
    }

    // echoes for warm vibes
    const revLen  = this.ctx.sampleRate * 2.5;
    const revBuf  = this.ctx.createBuffer(2, revLen, this.ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = revBuf.getChannelData(ch);
      for (let i = 0; i < revLen; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / revLen, 2.5);
    }
    const reverb = this.ctx.createConvolver(); reverb.buffer = revBuf;
    const revGain = this.ctx.createGain(); revGain.gain.value = revVol;
    reverb.connect(revGain); revGain.connect(this.musicBus);

    // dry path
    const dryGain = this.ctx.createGain(); dryGain.gain.value = dryVol;
    dryGain.connect(this.musicBus);

    // make a hummer
    const drone = (freq, type, vol, attack = 3) => {
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      const f = this.ctx.createBiquadFilter();
      o.type = type; o.frequency.value = freq * basePitchMultiplier;
      f.type = 'lowpass'; f.frequency.value = filterFreq; f.Q.value = 0.8;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(vol, t + attack);
      o.connect(f); f.connect(g);
      g.connect(dryGain); g.connect(reverb);
      o.start(t); return { o, g };
    };

    // starting hums
    const nodes = [
      drone(55,  'sine',        0.055, 4),  // note 1
      drone(110, droneOscType,  0.07,  3),  // note 2
      drone(165, mainOscType,   0.05,  4),  // note 3
      drone(220, droneOscType,  0.06,  5),  // note 4
      drone(261, mainOscType,   0.04,  5),  // note 5
      drone(330, droneOscType,  0.035, 6),  // note 6
    ];

    // wiggle the mid notes
    nodes.slice(2).forEach(({ o }, i) => {
      const lfo = this.ctx.createOscillator();
      const lfoG = this.ctx.createGain();
      lfo.frequency.value = 0.18 + i * 0.04;
      lfoG.gain.value = 0.8;
      lfo.connect(lfoG); lfoG.connect(o.frequency);
      lfo.start(t);
      nodes.push({ o: lfo, g: lfoG }); // bin it later
    });

    // slow bleep bloops
    const scale = [220, 261.6, 293.7, 329.6, 392, 440, 523.3].map(p => p * basePitchMultiplier); // notes pool of notes
    let step = 0;

    const scheduleArp = () => {
      if (!this._music) return;
      const freq = scale[step % scale.length];
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      const now = this.ctx.currentTime;
      o.type = mainOscType; o.frequency.value = freq;
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

    // high twinkles
    const shimmerNotes = [880, 1047, 1319, 1568].map(p => p * basePitchMultiplier);
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

  // change tunes for the phase
  setMusicPhase(phase) {
    this._musicPhase = phase;
    if (!this._music) return;
    // glitchy detune tension
    if (phase === 4) {
      this._music.nodes.slice(0, 3).forEach(({ o }) => {
        try {
          const cur = o.frequency.value;
          o.frequency.linearRampToValueAtTime(cur * 1.012, this.ctx.currentTime + 3);
        } catch(e) {}
      });
    } else {
      // standard vibes
      this._music.nodes.slice(0, 3).forEach(({ o }) => {
        try {
          o.frequency.cancelScheduledValues(this.ctx.currentTime);
        } catch(e) {}
      });
    }
  }

  // background humming
  startAmbient(phase) {
    this.stopAmbient();
    if (!this.ctx) return;
    this.setMusicPhase(phase);
    // background layer
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

  // sound effects
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

  // card flip click
  playCardFlip() {
    if (!this.ctx) return;
    this._noise(0.05, 1200, 0.07);
    setTimeout(() => this._noise(0.03, 2400, 0.04), 55);
  }

  // sandpit bleep bloop
  playSandboxNote(freq) {
    if (!this.ctx) return;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    const now = this.ctx.currentTime;
    const aes = this.activeAesthetic || 'Ocean';
    o.type = (aes === 'Neon' || aes === 'Sunrise' || aes === 'Storm') ? 'triangle' : 'sine';
    o.frequency.value = freq;
    
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.05, now + 0.12);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);
    
    if (this._music && this._music.reverb) {
      o.connect(g);
      g.connect(this._music.reverb);
      g.connect(this.musicBus);
    } else {
      o.connect(g);
      g.connect(this.musicBus);
    }
    o.start(now);
    o.stop(now + 1.6);
  }
}
