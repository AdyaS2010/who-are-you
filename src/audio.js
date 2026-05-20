// WHO//ARE//YOU? — Audio Engine with volume controls
export class AudioEngine {
  constructor() {
    this.ctx = null; this.initialized = false;
    this.musicVol = 0.5; this.sfxVol = 0.7; this.muted = false;
  }
  init() {
    if (this.initialized) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.master = this.ctx.createGain(); this.master.gain.value = 0.3;
      this.musicBus = this.ctx.createGain(); this.musicBus.gain.value = this.musicVol;
      this.sfxBus = this.ctx.createGain(); this.sfxBus.gain.value = this.sfxVol;
      this.musicBus.connect(this.master); this.sfxBus.connect(this.master);
      this.master.connect(this.ctx.destination); this.initialized = true;
    } catch(e) {}
  }
  resume() { if (this.ctx?.state === 'suspended') this.ctx.resume(); }
  setMusicVol(v) { this.musicVol = v; if (this.musicBus) this.musicBus.gain.value = v; }
  setSfxVol(v) { this.sfxVol = v; if (this.sfxBus) this.sfxBus.gain.value = v; }
  setMute(m) { this.muted = m; if (this.master) this.master.gain.value = m ? 0 : 0.3; }

  startAmbient(phase) {
    this.stopAmbient(); if (!this.ctx) return;
    const chords = { 2:[110,165,220], 3:[98,131,196], 4:[55,73] };
    const notes = chords[phase] || chords[2];
    this._amb = notes.map(freq => {
      const o = this.ctx.createOscillator(), g = this.ctx.createGain(), f = this.ctx.createBiquadFilter();
      o.type = phase === 4 ? 'sawtooth' : 'sine'; o.frequency.value = freq;
      f.type = 'lowpass'; f.frequency.value = phase === 4 ? 200 : 500;
      g.gain.value = 0; g.gain.linearRampToValueAtTime(0.06, this.ctx.currentTime + 3);
      o.connect(f); f.connect(g); g.connect(this.musicBus); o.start();
      return { o, g };
    });
  }
  stopAmbient() {
    if (!this._amb) return;
    this._amb.forEach(({ o, g }) => {
      g.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1);
      setTimeout(() => { try { o.stop(); } catch(e){} }, 1200);
    }); this._amb = null;
  }
  _noise(dur, freq, vol) {
    if (!this.ctx) return;
    const len = this.ctx.sampleRate * dur, buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (len * 0.1));
    const s = this.ctx.createBufferSource(); s.buffer = buf;
    const g = this.ctx.createGain(); g.gain.value = vol;
    const f = this.ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = freq;
    s.connect(f); f.connect(g); g.connect(this.sfxBus); s.start();
  }
  playFootstep() { this._noise(0.04, 500 + Math.random() * 400, 0.08); }
  playLand() { this._noise(0.06, 300, 0.12); }
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
      o.connect(g); g.connect(this.sfxBus); o.start(this.ctx.currentTime + i * 0.07);
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
}
