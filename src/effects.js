// ============================================
// WHO // ARE // YOU? — Visual Effects
// Particles, silhouettes, scene management
// ============================================

export class ParticleSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.color = {r:201,g:184,b:255};
    this.running = true;
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.init();
    this.animate();
  }
  resize() { this.canvas.width = window.innerWidth; this.canvas.height = window.innerHeight; }
  init() {
    this.particles = [];
    const count = Math.min(50, Math.floor(window.innerWidth / 30));
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width, y: Math.random() * this.canvas.height,
        size: Math.random() * 1.5 + 0.5, speedX: (Math.random() - 0.5) * 0.25,
        speedY: (Math.random() - 0.5) * 0.25, opacity: Math.random() * 0.4 + 0.1
      });
    }
  }
  setColor(r, g, b) { this.color = {r, g, b}; }
  animate() {
    if (!this.running) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const {r, g, b} = this.color;
    this.particles.forEach(p => {
      p.x += p.speedX; p.y += p.speedY;
      if (p.x < 0) p.x = this.canvas.width; if (p.x > this.canvas.width) p.x = 0;
      if (p.y < 0) p.y = this.canvas.height; if (p.y > this.canvas.height) p.y = 0;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${r},${g},${b},${p.opacity})`;
      this.ctx.fill();
    });
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const d = Math.sqrt(dx*dx + dy*dy);
        if (d < 100) {
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.strokeStyle = `rgba(${r},${g},${b},${0.04 * (1 - d/100)})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.stroke();
        }
      }
    }
    requestAnimationFrame(() => this.animate());
  }
}

export function triggerGlitch(el, dur = 300) {
  if (!el) return;
  el.classList.remove('hidden');
  el.classList.add('active');
  setTimeout(() => { el.classList.remove('active'); el.classList.add('hidden'); }, dur);
}

// Create a black silhouette SVG for game scenes
export function createSceneSilhouette(color = '#000', glow = false) {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 200 340');
  svg.style.width = '100%';
  svg.style.height = '100%';

  const defs = document.createElementNS(ns, 'defs');
  const fId = 'g' + Math.random().toString(36).slice(2, 7);
  if (glow) {
    const filter = document.createElementNS(ns, 'filter');
    filter.setAttribute('id', fId);
    const blur = document.createElementNS(ns, 'feGaussianBlur');
    blur.setAttribute('stdDeviation', '4');
    blur.setAttribute('result', 'b');
    const merge = document.createElementNS(ns, 'feMerge');
    const mn1 = document.createElementNS(ns, 'feMergeNode'); mn1.setAttribute('in', 'b');
    const mn2 = document.createElementNS(ns, 'feMergeNode'); mn2.setAttribute('in', 'SourceGraphic');
    merge.append(mn1, mn2);
    filter.append(blur, merge);
    defs.append(filter);
  }
  svg.append(defs);

  // Head
  const head = document.createElementNS(ns, 'ellipse');
  head.setAttribute('cx', '100'); head.setAttribute('cy', '55');
  head.setAttribute('rx', '28'); head.setAttribute('ry', '32');
  head.setAttribute('fill', color);
  if (glow) head.setAttribute('filter', `url(#${fId})`);

  // Neck
  const neck = document.createElementNS(ns, 'rect');
  neck.setAttribute('x', '92'); neck.setAttribute('y', '85');
  neck.setAttribute('width', '16'); neck.setAttribute('height', '15');
  neck.setAttribute('fill', color);
  neck.setAttribute('rx', '3');

  // Body (torso)
  const body = document.createElementNS(ns, 'path');
  body.setAttribute('d', 'M60 105 Q60 95,80 92 L120 92 Q140 95,140 105 L145 200 Q145 210,135 210 L65 210 Q55 210,55 200 Z');
  body.setAttribute('fill', color);
  if (glow) body.setAttribute('filter', `url(#${fId})`);

  // Left arm
  const lArm = document.createElementNS(ns, 'path');
  lArm.setAttribute('d', 'M60 108 Q45 110,38 145 Q35 165,40 180 Q42 185,48 183 Q55 175,55 155 L58 125');
  lArm.setAttribute('fill', color);

  // Right arm
  const rArm = document.createElementNS(ns, 'path');
  rArm.setAttribute('d', 'M140 108 Q155 110,162 145 Q165 165,160 180 Q158 185,152 183 Q145 175,145 155 L142 125');
  rArm.setAttribute('fill', color);

  // Left leg
  const lLeg = document.createElementNS(ns, 'path');
  lLeg.setAttribute('d', 'M70 208 L65 290 Q64 305,72 310 L85 310 Q90 310,88 305 L90 210');
  lLeg.setAttribute('fill', color);

  // Right leg
  const rLeg = document.createElementNS(ns, 'path');
  rLeg.setAttribute('d', 'M130 208 L135 290 Q136 305,128 310 L115 310 Q110 310,112 305 L110 210');
  rLeg.setAttribute('fill', color);

  svg.append(head, neck, body, lArm, rArm, lLeg, rLeg);
  return svg;
}

// Glowing accent silhouette for mirror/archetype
export function createGlowSilhouette(color = '#c9b8ff', opacity = 0.7) {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 200 300');
  svg.style.width = '100%'; svg.style.height = '100%';

  const defs = document.createElementNS(ns, 'defs');
  const fId = 'glow' + Math.random().toString(36).slice(2, 7);
  const filter = document.createElementNS(ns, 'filter');
  filter.setAttribute('id', fId);
  const blur = document.createElementNS(ns, 'feGaussianBlur');
  blur.setAttribute('stdDeviation', '3'); blur.setAttribute('result', 'b');
  const merge = document.createElementNS(ns, 'feMerge');
  const mn1 = document.createElementNS(ns, 'feMergeNode'); mn1.setAttribute('in', 'b');
  const mn2 = document.createElementNS(ns, 'feMergeNode'); mn2.setAttribute('in', 'SourceGraphic');
  merge.append(mn1, mn2); filter.append(blur, merge); defs.append(filter); svg.append(defs);

  const grad = document.createElementNS(ns, 'linearGradient');
  grad.setAttribute('id', fId + 'g'); grad.setAttribute('x1', '0%'); grad.setAttribute('y1', '0%');
  grad.setAttribute('x2', '0%'); grad.setAttribute('y2', '100%');
  const s1 = document.createElementNS(ns, 'stop');
  s1.setAttribute('offset', '0%'); s1.setAttribute('style', `stop-color:${color};stop-opacity:${opacity}`);
  const s2 = document.createElementNS(ns, 'stop');
  s2.setAttribute('offset', '100%'); s2.setAttribute('style', `stop-color:${color};stop-opacity:${opacity * 0.4}`);
  grad.append(s1, s2); defs.append(grad);

  const head = document.createElementNS(ns, 'ellipse');
  head.setAttribute('cx', '100'); head.setAttribute('cy', '70');
  head.setAttribute('rx', '35'); head.setAttribute('ry', '40');
  head.setAttribute('fill', `url(#${fId}g)`); head.setAttribute('filter', `url(#${fId})`);

  const body = document.createElementNS(ns, 'path');
  body.setAttribute('d', 'M50 120Q50 100,70 95Q90 90,100 90Q110 90,130 95Q150 100,150 120L160 280Q160 300,140 300L60 300Q40 300,40 280Z');
  body.setAttribute('fill', `url(#${fId}g)`); body.setAttribute('filter', `url(#${fId})`);

  svg.append(head, body);
  return svg;
}

// Animate silhouette reaction
export function reactSilhouette(silEl, direction = 'left', duration = 600) {
  silEl.classList.add(`react-${direction}`);
  silEl.classList.add('react-glow');
  setTimeout(() => {
    silEl.classList.remove(`react-${direction}`, 'react-glow');
  }, duration);
}

// Set environment class on scene
export function setEnvironment(envEl, envClass) {
  // Remove all env- classes
  envEl.className = envEl.className.replace(/env-\w+/g, '').trim();
  envEl.classList.add('scene-environment');
  if (envClass) envEl.classList.add(`env-${envClass}`);
}
