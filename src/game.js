// WHO//ARE//YOU? — Game Engine (Full-Screen Platformer)
import {
  TRAITS, INTERESTS, CORE_VALUES, FEARS, AESTHETICS, ARCHETYPES,
  COMMONALITY_MESSAGES, PHASE2_SCENARIOS, WORLDS, SHIFT_SCENARIOS,
  GLITCH_SCENARIOS, GUESS_QUESTIONS, PHILOSOPHICAL_QUOTES, VECTOR_DESCRIPTIONS,
  ROLES, PHILOSOPHERS, GW_SUSPECTS
} from './data.js';
import { ParticleSystem, triggerGlitch, createGlowSilhouette } from './effects.js';
import { Platformer } from './platformer.js';
import { AudioEngine } from './audio.js';

let _titleAudio = null;

const state = {
  phase:0, name:'', traits:[], interests:[], coreValue:'', fear:'', aesthetic:'',
  archetype:null,
  vectors:{empathy:0,conformity:0,independence:0,curiosity:0,emotionalReasoning:0,logicalReasoning:0,riskTolerance:0,ambition:0},
  scenarioIndex:0, shiftScenarioIndex:0, glitchScenarioIndex:0, worldType:'', guessQuestionIndex:0,
  
  // Trial of Personas (Guess Who Duel) state
  gwRole: null,
  gwOpponent: null,
  gwPlayerSecret: null,
  gwAiSecret: null,
  gwTurn: 'player', // 'player' or 'ai'
  gwAiPossibleSuspects: [],
  gwAbilityUsed: false,
  gwEliminated: new Set(),
  gwUsedQs: new Set(),
  gwGuessing: false,
  gwOver: false
};
let particles, plat;
const $ = id => document.getElementById(id);

function show(id) { $(id).classList.remove('hidden'); $(id).classList.add('active','fade-in'); setTimeout(() => $(id).classList.remove('fade-in'), 800); window.scrollTo({top:0}); }
function hide(id) { $(id).classList.add('fade-out'); setTimeout(() => { $(id).classList.remove('active','fade-out'); $(id).classList.add('hidden'); }, 600); }
function switchScreen(a, b) { hide(a); setTimeout(() => show(b), 500); }
function setTheme(n) {
  document.body.className = `phase-theme-${n}`;
  const c = {1:[201,184,255],2:[126,184,224],3:[255,126,179],4:[136,136,136],5:[168,230,195],6:[255,209,126]};
  if (particles && c[n]) particles.setColor(...c[n]);
}
function addVectors(v) { for (const k in v) if (state.vectors[k] !== undefined) state.vectors[k] += v[k]; }

// ---- INIT ----
export function initGame() {
  particles = new ParticleSystem('particles-canvas');
  setTheme(1);
  setupSettings();
  setupRulebook();

  // Start calm mystical music on first user gesture
  const startMusic = () => {
    if (!_titleAudio) {
      _titleAudio = new AudioEngine();
      _titleAudio.init();
      _titleAudio.setMusicVol($('vol-music').value / 100);
      _titleAudio.setSfxVol($('vol-sfx').value / 100);
      _titleAudio.setMute($('mute-all').checked);
      _titleAudio.startMusic();
    }
  };
  document.addEventListener('click', startMusic, { once: true });
  document.addEventListener('keydown', startMusic, { once: true });

  $('btn-start').addEventListener('click', () => { switchScreen('screen-title','screen-phase1'); state.phase = 1; });
  setupPhase1();
  $('btn-phase2-begin').addEventListener('click', startPlatformer2);
  $('btn-phase3-begin').addEventListener('click', startPlatformer3);
  setupPhase6();
  $('btn-restart').addEventListener('click', () => location.reload());
}

// ---- SETTINGS ----
function setupSettings() {
  const toggle = $('settings-toggle'), panel = $('settings-panel');
  toggle.addEventListener('click', () => panel.classList.toggle('hidden'));
  document.addEventListener('click', e => { if (!panel.contains(e.target) && e.target !== toggle) panel.classList.add('hidden'); });
  $('vol-music').addEventListener('input', e => {
    const v = e.target.value / 100;
    if (plat) plat.audio.setMusicVol(v);
    if (_titleAudio) _titleAudio.setMusicVol(v);
  });
  $('vol-sfx').addEventListener('input', e => {
    const v = e.target.value / 100;
    if (plat) plat.audio.setSfxVol(v);
    if (_titleAudio) _titleAudio.setSfxVol(v);
  });
  $('mute-all').addEventListener('change', e => {
    const m = e.target.checked;
    if (plat) plat.audio.setMute(m);
    if (_titleAudio) _titleAudio.setMute(m);
  });
}

// ---- RULEBOOK ----
function setupRulebook() {
  const toggle = $('rulebook-toggle'), modal = $('rulebook-modal'), close = $('rulebook-close');
  toggle.addEventListener('click', () => { modal.classList.toggle('hidden'); });
  close.addEventListener('click', () => { modal.classList.add('hidden'); });
  modal.addEventListener('click', e => { if (e.target === modal) modal.classList.add('hidden'); });
  
  const tabs = modal.querySelectorAll('.rulebook-tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.getAttribute('data-tab');
      modal.querySelectorAll('.rulebook-tab-content').forEach(content => {
        content.classList.toggle('active', content.id === target);
      });
    });
  });
}

// ---- PHASE 1 ----
function setupPhase1() {
  const ni = $('input-name'), bn = $('btn-name-next');
  ni.addEventListener('input', () => { bn.disabled = !ni.value.trim(); });
  ni.addEventListener('keydown', e => { if (e.key === 'Enter' && !bn.disabled) bn.click(); });
  bn.addEventListener('click', () => { state.name = ni.value.trim(); step('step-name','step-traits'); });
  buildChips('traits-grid', TRAITS, 3, 'traits', 'traits-count', 'btn-traits-next');
  $('btn-traits-next').addEventListener('click', () => step('step-traits','step-interests'));
  buildChips('interests-grid', INTERESTS, 2, 'interests', 'interests-count', 'btn-interests-next');
  $('btn-interests-next').addEventListener('click', () => step('step-interests','step-value'));
  buildChips('values-grid', CORE_VALUES, 1, 'coreValue', null, 'btn-value-next', true);
  $('btn-value-next').addEventListener('click', () => step('step-value','step-fear'));
  buildChips('fears-grid', FEARS, 1, 'fear', null, 'btn-fear-next', true);
  $('btn-fear-next').addEventListener('click', () => step('step-fear','step-aesthetic'));
  buildAesthetics();
  $('btn-aesthetic-next').addEventListener('click', () => { step('step-aesthetic','step-archetype'); revealArchetype(); });
  $('btn-phase1-complete').addEventListener('click', () => { switchScreen('screen-phase1','screen-phase2-intro'); setTheme(2); });
}
function step(a, b) { $(a).classList.remove('active'); $(b).classList.add('active'); }
function buildChips(gid, items, max, key, cid, bid, single = false) {
  const g = $(gid);
  items.forEach(item => {
    const c = document.createElement('button'); c.className = 'chip'; c.textContent = item;
    c.addEventListener('click', () => {
      if (single) { g.querySelectorAll('.chip').forEach(x => x.classList.remove('selected')); c.classList.add('selected'); state[key] = item; $(bid).disabled = false; }
      else {
        if (c.classList.contains('selected')) { c.classList.remove('selected'); state[key] = state[key].filter(t => t !== item); }
        else if (state[key].length < max) { c.classList.add('selected'); state[key].push(item); }
        if (cid) $(cid).textContent = state[key].length;
        $(bid).disabled = state[key].length !== max;
        g.querySelectorAll('.chip').forEach(x => { if (!x.classList.contains('selected')) x.classList.toggle('disabled', state[key].length >= max); });
      }
    });
    g.appendChild(c);
  });
}
function buildAesthetics() {
  const g = $('aesthetic-grid');
  AESTHETICS.forEach(a => {
    const c = document.createElement('div'); c.className = 'aesthetic-card';
    c.innerHTML = `<div class="aesthetic-icon">${a.icon}</div><div class="aesthetic-name">${a.name}</div>`;
    c.addEventListener('click', () => { g.querySelectorAll('.aesthetic-card').forEach(x => x.classList.remove('selected')); c.classList.add('selected'); state.aesthetic = a.name; $('btn-aesthetic-next').disabled = false; });
    g.appendChild(c);
  });
}
function revealArchetype() {
  const tv = { Creative:{curiosity:1},Analytical:{logicalReasoning:1},Empathetic:{empathy:1},Ambitious:{ambition:1},Curious:{curiosity:1},Loyal:{conformity:1,empathy:1},Independent:{independence:1},Optimistic:{emotionalReasoning:1},Cautious:{logicalReasoning:1,riskTolerance:-1},Passionate:{emotionalReasoning:1,riskTolerance:1},Resilient:{independence:1,riskTolerance:1},Honest:{independence:1},Adaptable:{conformity:1,curiosity:1},Confident:{ambition:1,independence:1},Patient:{logicalReasoning:1},Spontaneous:{riskTolerance:1,curiosity:1},Thoughtful:{empathy:1,logicalReasoning:1},Determined:{ambition:1,riskTolerance:1},Gentle:{empathy:1,emotionalReasoning:1},Bold:{riskTolerance:1,independence:1} };
  state.traits.forEach(t => { if (tv[t]) addVectors(tv[t]); });
  const arch = ARCHETYPES.find(a => a.match(state.vectors)) || ARCHETYPES[ARCHETYPES.length - 1];
  state.archetype = arch;
  $('archetype-sil-wrap').innerHTML = ''; $('archetype-sil-wrap').appendChild(createGlowSilhouette('#c9b8ff', 0.7));
  $('archetype-info').innerHTML = `<div class="archetype-name">${arch.name}</div><div class="archetype-title-line">${arch.title}</div><div class="archetype-backstory">${arch.backstory}</div><div class="archetype-stats">${Object.entries(arch.stats).map(([k,v]) => `<div class="arch-stat">${k}: <span>${v}</span></div>`).join('')}</div>`;
  const rm = () => COMMONALITY_MESSAGES[Math.floor(Math.random() * COMMONALITY_MESSAGES.length)];
  $('commonality-reveal').innerHTML = [rm()(state.traits[0]), rm()(state.coreValue), rm()(state.aesthetic)].map(m => `<p>${m}</p>`).join('');
}

// ---- PLATFORMER PHASES ----
function ensurePlatformer() {
  if (!plat) {
    plat = new Platformer($('game-canvas'), $('game-hud'));
    plat.audio.setMusicVol($('vol-music').value / 100);
    plat.audio.setSfxVol($('vol-sfx').value / 100);
    plat.audio.setMute($('mute-all').checked);
    // Seamlessly hand off music from title engine to platformer engine
    if (_titleAudio) { _titleAudio.stopMusic(); }
    plat.audio.init();
    plat.audio.startMusic();
  }
  $('game-screen').classList.remove('hidden');
}

function startPlatformer2() {
  hide('screen-phase2-intro');
  setTimeout(() => {
    ensurePlatformer(); plat.setPhase(2);
    state.scenarioIndex = 0;
    loadP2(); plat.start();
  }, 500);
}
function loadP2() {
  const sc = PHASE2_SCENARIOS[state.scenarioIndex];
  if (!sc) { plat.stop(); $('game-screen').classList.add('hidden'); setTimeout(() => { show('screen-phase3-intro'); setTheme(3); initPhase3(); }, 300); return; }
  plat.loadScenario(sc, sc.env);
  plat.onChoice((idx, vectors) => {
    addVectors(vectors); triggerGlitch($('glitch-overlay'));
    state.scenarioIndex++;
    setTimeout(loadP2, 1200);
  });
}

function initPhase3() {
  const types = ['strict','chaotic','collectivist','individualistic'];
  let wt;
  if (state.vectors.independence > state.vectors.conformity) wt = Math.random() > 0.5 ? 'strict' : 'collectivist';
  else wt = Math.random() > 0.5 ? 'chaotic' : 'individualistic';
  state.worldType = wt;
  const world = WORLDS.find(w => w.type === wt);
  $('world-name').textContent = world.name;
  $('world-description').textContent = world.description;
  triggerGlitch($('glitch-overlay'));
}
function startPlatformer3() {
  const world = WORLDS.find(w => w.type === state.worldType);
  hide('screen-phase3-intro');
  setTimeout(() => {
    ensurePlatformer(); plat.setPhase(3);
    state.shiftScenarioIndex = 0;
    loadP3(world); plat.start();
  }, 500);
}
function loadP3(world) {
  const scenarios = SHIFT_SCENARIOS[state.worldType];
  const sc = scenarios[state.shiftScenarioIndex];
  if (!sc) { plat.stop(); $('game-screen').classList.add('hidden'); setTimeout(() => { show('screen-phase4-intro'); setTheme(4); initPhase4(); }, 300); return; }
  plat.loadScenario({ ...sc, narrator: sc.narrator || world?.narrator || '' }, world?.env || 'iron');
  plat.onChoice((idx, vectors) => {
    addVectors(vectors); triggerGlitch($('glitch-overlay'));
    state.shiftScenarioIndex++;
    setTimeout(() => loadP3(world), 1200);
  });
}

function initPhase4() {
  $('dissolving-identity').innerHTML = [`Name: ${state.name}`,`Traits: ${state.traits.join(', ')}`,`Value: ${state.coreValue}`,`Archetype: ${state.archetype?.name || '???'}`].map(l => `<p>${l}</p>`).join('');
  triggerGlitch($('glitch-overlay'));
  setTimeout(() => triggerGlitch($('glitch-overlay')), 600);
  setTimeout(() => triggerGlitch($('glitch-overlay')), 1400);
  setTimeout(() => {
    hide('screen-phase4-intro');
    setTimeout(() => {
      ensurePlatformer(); plat.setPhase(4);
      state.glitchScenarioIndex = 0;
      loadP4(); plat.start();
    }, 500);
  }, 3800);
}
function loadP4() {
  const sc = GLITCH_SCENARIOS[state.glitchScenarioIndex];
  if (!sc) { plat.stop(); $('game-screen').classList.add('hidden'); setTimeout(() => { show('screen-phase5'); setTheme(5); initPhase5(); }, 300); return; }
  plat.loadScenario(sc, 'void');
  plat.onChoice((idx, vectors) => {
    addVectors(vectors); triggerGlitch($('glitch-overlay'));
    state.glitchScenarioIndex++;
    setTimeout(loadP4, 1200);
  });
}

// ---- PHASE 5: MIRROR ----
function initPhase5() {
  $('mirror-silhouette').innerHTML = ''; $('mirror-silhouette').appendChild(createGlowSilhouette('#a8e6c3', 0.7));
  const mx = Math.max(1, ...Object.values(state.vectors).map(Math.abs));
  const n = {}; for (const k in state.vectors) n[k] = Math.round(((state.vectors[k] / mx) * 50) + 50);
  const pe = $('identity-profile');
  pe.innerHTML = `<h3>Your Identity Profile</h3><p class="profile-text">${genProfile(n)}</p>`;
  const vd = document.createElement('div'); vd.className = 'profile-vectors';
  for (const k in VECTOR_DESCRIPTIONS) {
    const v = n[k] || 50, d = VECTOR_DESCRIPTIONS[k], it = document.createElement('div'); it.className = 'vector-item';
    it.innerHTML = `<span class="vector-label">${d.label}</span><div class="vector-bar-bg"><div class="vector-bar" style="width:0%"></div></div>`;
    vd.appendChild(it); setTimeout(() => { it.querySelector('.vector-bar').style.width = v + '%'; }, 500);
  }
  pe.appendChild(vd);
  $('identity-insights').innerHTML = genInsights(n).map(i => `<p class="insight-item">→ ${i}</p>`).join('');
  $('narrator-mirror-text').textContent = '"There you are. Not who you said you were. Not who the world made you. Something in between. Something real."';
}
function genProfile(n) {
  const p = [];
  if (n.empathy > 65) p.push('You are deeply attuned to others.'); else if (n.empathy < 35) p.push('You chart your own emotional course.'); else p.push('You balance empathy with self-preservation.');
  if (n.independence > 65) p.push('You resist the crowd.'); else if (n.independence < 35) p.push('You find strength in belonging.');
  if (n.curiosity > 65) p.push('Questions drive you more than answers.'); else if (n.curiosity < 35) p.push('You trust what you know.');
  if (n.emotionalReasoning > n.logicalReasoning + 15) p.push('Your heart leads.'); else if (n.logicalReasoning > n.emotionalReasoning + 15) p.push('Your mind leads.'); else p.push('You navigate between heart and mind.');
  if (n.riskTolerance > 65) p.push('You leap — standing still feels like surrender.'); else if (n.riskTolerance < 35) p.push('Every step is intentional.');
  return p.join(' ');
}
function genInsights(n) {
  const ins = [];
  if (n.empathy > 60 && n.independence > 60) ins.push('You care deeply yet insist on your own path.');
  if (n.conformity > 55 && n.curiosity > 55) ins.push('You question everything but still seek belonging.');
  if (n.riskTolerance > 60 && n.emotionalReasoning > 55) ins.push('Your courage comes from feeling, not calculation.');
  const wn = {strict:'The Iron Republic',chaotic:'The Unbound',collectivist:'The Collective',individualistic:'The Mirror City'};
  ins.push(`In ${wn[state.worldType]}, your identity shifted — context reshapes who we become.`);
  if (n.independence > 60) ins.push('Emerson: "Trust thyself: every heart vibrates to that iron string."');
  if (n.empathy > 60) ins.push('Your pattern echoes Jackson\'s qualia — the irreducible reality of subjective experience.');
  if (n.conformity > 55) ins.push('Hobbes: your instinct for order reflects humanity\'s deepest need.');
  if (n.curiosity > 60) ins.push('Hume: the self is "a bundle of perceptions" — always shifting.');
  return ins;
}

// ---- PHASE 6: TRIAL OF PERSONAS (GUESS WHO DUEL) ----

function setupPhase6() {
  $('btn-phase5-complete').addEventListener('click', () => {
    switchScreen('screen-phase5', 'screen-phase6');
    setTheme(6);
    initGuessWhoSetup();
  });
}

function initGuessWhoSetup() {
  state.gwRole = null;
  state.gwOpponent = null;
  state.gwOver = false;
  
  // Render Roles
  const roleGrid = $('gw-role-selection');
  roleGrid.innerHTML = '';
  ROLES.forEach(r => {
    const card = document.createElement('div');
    card.className = 'gw-setup-card';
    card.innerHTML = `
      <div class="card-select-icon">${r.icon}</div>
      <div class="card-select-info">
        <span class="card-select-name">${r.name}</span>
        <span class="card-select-desc">${r.description}</span>
      </div>
    `;
    card.addEventListener('click', () => {
      roleGrid.querySelectorAll('.gw-setup-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      state.gwRole = r;
      checkSetupReady();
      if (plat) plat.audio.playClick ? plat.audio.playClick() : plat.audio.playFootstep();
    });
    roleGrid.appendChild(card);
  });

  // Render Opponents
  const oppGrid = $('gw-opponent-selection');
  oppGrid.innerHTML = '';
  PHILOSOPHERS.forEach((p, idx) => {
    const card = document.createElement('div');
    card.className = 'gw-setup-card';
    card.innerHTML = `
      <div class="card-select-icon">${p.avatar}</div>
      <div class="card-select-info">
        <span class="card-select-name">${p.name}</span>
        <span class="card-select-meta">${p.school}</span>
        <span class="card-select-desc">Difficulty: ${p.difficulty}</span>
      </div>
    `;
    card.addEventListener('click', () => {
      oppGrid.querySelectorAll('.gw-setup-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      state.gwOpponent = p;
      checkSetupReady();
      if (plat) plat.audio.playClick ? plat.audio.playClick() : plat.audio.playFootstep();
    });
    oppGrid.appendChild(card);
  });

  $('gw-setup-panel').classList.remove('hidden');
  $('gw-game-panel').classList.add('hidden');
  $('gw-btn-start-duel').disabled = true;

  $('gw-btn-start-duel').onclick = startGuessWhoDuel;
}

function checkSetupReady() {
  $('gw-btn-start-duel').disabled = !(state.gwRole && state.gwOpponent);
}

function startGuessWhoDuel() {
  if (plat) plat.audio.playCrystal();
  
  $('gw-setup-panel').classList.add('hidden');
  $('gw-game-panel').classList.remove('hidden');

  // Match player secret identity closest to their Phase 1 archetype and traits
  const pTraits = new Set(state.traits);
  const pValue = state.coreValue;
  const pFear = state.fear;
  let bestScore = -1, bestIdx = 0;
  GW_SUSPECTS.forEach((s, i) => {
    let score = 0;
    s.traits.forEach(t => { if (pTraits.has(t)) score += 3; });
    if (s.value === pValue) score += 2;
    if (s.fear === pFear) score += 2;
    if (score > bestScore) { bestScore = score; bestIdx = i; }
  });
  state.gwPlayerSecret = bestIdx;

  // Choose AI secret card randomly (different from player)
  let aiIdx;
  do {
    aiIdx = Math.floor(Math.random() * GW_SUSPECTS.length);
  } while (aiIdx === state.gwPlayerSecret);
  state.gwAiSecret = aiIdx;

  // Initialize game state
  state.gwEliminated = new Set();
  state.gwUsedQs = new Set();
  state.gwGuessing = false;
  state.gwAbilityUsed = false;
  state.gwTurn = 'player';
  state.gwAiPossibleSuspects = GW_SUSPECTS.map((_, i) => i);
  state.gwOver = false;

  // Render Displays
  const playerCard = GW_SUSPECTS[state.gwPlayerSecret];
  $('gw-secret-display').textContent = `${playerCard.icon} ${playerCard.name}`;
  $('gw-opponent-display').textContent = `${state.gwOpponent.avatar} ${state.gwOpponent.name}`;
  $('gw-ai-dialogue').textContent = `"${state.gwOpponent.intro}"`;

  // Turn tracker
  updateTurnUI();

  // Ability Button
  const ab = $('gw-ability-btn');
  ab.disabled = false;
  ab.querySelector('.ability-icon').textContent = state.gwRole.icon;
  ab.querySelector('.ability-name').textContent = `Use ${state.gwRole.name}`;
  ab.querySelector('.ability-desc').textContent = state.gwRole.description;
  ab.onclick = activateAbility;

  // Reset actions
  $('gw-final-guess').classList.remove('hidden');
  $('gw-continue').classList.add('hidden');
  $('gw-answer-box').innerHTML = '';
  
  $('gw-final-guess').onclick = () => {
    if (state.gwTurn !== 'player' || state.gwOver) return;
    startFinalGuess();
  };
  $('gw-continue').onclick = () => {
    switchScreen('screen-phase6', 'screen-final');
    document.body.className = 'phase-theme-5';
    initFinal();
  };

  renderBoard();
  renderQuestions();
  updateStatusText();

  // Continue music in platformer context
  if (plat) { plat.audio.resume(); plat.audio.startMusic(); }
}

function updateTurnUI() {
  const indicator = $('gw-turn-indicator');
  if (state.gwTurn === 'player') {
    indicator.textContent = 'Your Turn';
    indicator.classList.remove('ai-turn');
  } else {
    indicator.textContent = `${state.gwOpponent.name}'s Turn`;
    indicator.classList.add('ai-turn');
  }
}

function updateStatusText() {
  if (state.gwOver) return;
  const remaining = GW_SUSPECTS.length - state.gwEliminated.size;
  const aiRemaining = state.gwAiPossibleSuspects.length;
  $('gw-status').textContent = `You: ${remaining} characters left · Philosopher: ${aiRemaining} possibilities left.`;
}

function renderBoard() {
  const board = $('gw-board');
  board.innerHTML = '';
  GW_SUSPECTS.forEach((s, i) => {
    const card = document.createElement('div');
    const isEliminated = state.gwEliminated.has(i);
    card.className = 'gw-card' + (isEliminated ? ' eliminated' : '');

    if (i === state.gwPlayerSecret) {
      card.style.border = '2px solid rgba(201,184,255,0.5)';
      card.title = 'This is your secret identity';
    }

    card.innerHTML = `
      <div class="gw-card-icon">${s.icon}</div>
      <div class="gw-card-name">${s.name}</div>
      <div class="gw-card-trait">${s.theory}</div>
      <div class="gw-card-belief">${s.belief}</div>
    `;

    card.addEventListener('click', () => {
      if (state.gwOver) return;
      if (state.gwGuessing) {
        revealGuess(i);
      } else {
        if (state.gwEliminated.has(i)) {
          state.gwEliminated.delete(i);
        } else {
          state.gwEliminated.add(i);
          if (plat) plat.audio.playCardFlip();
        }
        renderBoard();
        updateStatusText();
        const remaining = GW_SUSPECTS.length - state.gwEliminated.size;
        if (remaining <= 2) $('gw-final-guess').classList.remove('hidden');
      }
    });
    board.appendChild(card);
  });
}

function renderQuestions() {
  const bar = $('gw-question-bar');
  bar.innerHTML = '';
  GUESS_QUESTIONS.forEach((q, i) => {
    const btn = document.createElement('button');
    const isUsed = state.gwUsedQs.has(i);
    btn.className = 'gw-q-btn' + (isUsed ? ' used' : '');
    btn.textContent = q.q;
    
    btn.addEventListener('click', () => {
      if (state.gwTurn !== 'player' || isUsed || state.gwOver) return;
      state.gwUsedQs.add(i);
      btn.classList.add('used');
      
      // Get answer based on AI's secret card
      const target = GW_SUSPECTS[state.gwAiSecret];
      const answer = q.check(target);
      
      if (plat) plat.audio.playCollect();

      $('gw-answer-box').innerHTML = `
        <div class="gw-answer">
          Answer: <strong>${answer ? 'YES' : 'NO'}</strong> — <em>${q.label}</em>
          <button id="gw-btn-end-turn" class="gw-final-btn" style="margin: 0.5rem auto 0; font-size: 0.75rem; padding: 0.4rem 1rem;">End Turn & Let AI Move</button>
        </div>
      `;

      $('gw-status').textContent = 'Eliminate suspects on your board, then click "End Turn & Let AI Move".';
      
      // Disable further questions until turn ends
      bar.querySelectorAll('.gw-q-btn').forEach(b => b.disabled = true);
      $('gw-final-guess').classList.add('hidden');
      
      $('gw-btn-end-turn').onclick = () => {
        $('gw-answer-box').innerHTML = '';
        passTurnToAi();
      };
    });
    bar.appendChild(btn);
  });

  // Keep disabled if it's not player turn
  if (state.gwTurn !== 'player') {
    bar.querySelectorAll('.gw-q-btn').forEach(b => b.disabled = true);
  }
}

function activateAbility() {
  if (state.gwTurn !== 'player' || state.gwAbilityUsed || state.gwOver) return;
  state.gwAbilityUsed = true;
  $('gw-ability-btn').disabled = true;

  if (plat) plat.audio.playCrystal();

  const target = GW_SUSPECTS[state.gwAiSecret];
  let message = '';

  switch (state.gwRole.abilityId) {
    case 'rationalism':
      // Hobbes Order: Eliminate 2 wrong suspects automatically
      let count = 0, eliminatedNames = [];
      for (let i = 0; i < GW_SUSPECTS.length; i++) {
        if (i !== state.gwAiSecret && !state.gwEliminated.has(i)) {
          state.gwEliminated.add(i);
          eliminatedNames.push(GW_SUSPECTS[i].name);
          count++;
          if (count >= 2) break;
        }
      }
      renderBoard();
      message = `Deduction completed. Eliminated: ${eliminatedNames.join(', ')}`;
      break;

    case 'empiricism':
      // Hume Impressions: Reveal AI's secret card's core value
      message = `Sensory Impression: The target identity values <strong>${target.value}</strong>.`;
      break;

    case 'existentialism':
      // Emerson Self-reliance: Reveal if AI target is a nonconformist (Independent/Bold)
      const isNC = target.traits.includes('Independent') || target.traits.includes('Bold');
      message = `Intuition Sense: The target is ${isNC ? '<strong>a Nonconformist</strong> (Independent/Bold)' : '<strong>not a Nonconformist</strong>'}.`;
      break;

    case 'subjectivism':
      // Jackson Qualia: Sense if aesthetic is warm or cool
      const isWarm = ['Sunrise', 'Neon', 'Storm'].includes(target.aesthetic);
      message = `Qualia Sense: The target card has a <strong>${isWarm ? 'Warm' : 'Cool'}</strong> aesthetic tone (${isWarm ? 'Sunrise/Neon/Storm' : 'Midnight/Ocean/Forest'}).`;
      break;
  }

  $('gw-answer-box').innerHTML = `<div class="gw-answer" style="border-left-color: #ffd17e;">✨ Ability: ${message}</div>`;
  updateStatusText();
}

function passTurnToAi() {
  state.gwTurn = 'ai';
  updateTurnUI();
  renderQuestions();
  updateStatusText();

  // Philosopher speaks during turn
  const opp = state.gwOpponent;
  const qQuotes = opp.dialogueAsk;
  const quote = qQuotes[Math.floor(Math.random() * qQuotes.length)];
  $('gw-ai-dialogue').textContent = `"${quote}"`;

  setTimeout(() => {
    runAiTurnLogic();
  }, 2000);
}

function runAiTurnLogic() {
  if (state.gwOver) return;
  
  const opp = state.gwOpponent;
  const pCard = GW_SUSPECTS[state.gwPlayerSecret];

  // AI Strategic deduction: finds a question it hasn't used that splits its remaining suspects closest to 50/50
  let bestQIdx = -1;
  let bestQDiff = 999;
  
  // Create a list of questions that AI has not asked yet (simulated by checking index)
  // Let's pick a random unasked question to keep it simple but realistic, or strategic
  const unasked = GUESS_QUESTIONS.map((_, i) => i).filter(i => !state.gwUsedQs.has(i));
  
  if (unasked.length === 0) {
    // Fallback: pick a random question
    bestQIdx = Math.floor(Math.random() * GUESS_QUESTIONS.length);
  } else {
    // Strategy: find the question that splits the possible suspects best
    unasked.forEach(qIdx => {
      const q = GUESS_QUESTIONS[qIdx];
      let yesCount = 0;
      state.gwAiPossibleSuspects.forEach(sIdx => {
        if (q.check(GW_SUSPECTS[sIdx])) yesCount++;
      });
      const diff = Math.abs(state.gwAiPossibleSuspects.length / 2 - yesCount);
      if (diff < bestQDiff) {
        bestQDiff = diff;
        bestQIdx = qIdx;
      }
    });
  }

  const chosenQ = GUESS_QUESTIONS[bestQIdx];
  const answer = chosenQ.check(pCard);

  // AI dialogues its question
  $('gw-ai-dialogue').textContent = `"${opp.name} asks: ${chosenQ.q}"`;

  setTimeout(() => {
    // AI processes answer
    if (plat) plat.audio.playGlitch();

    // AI filters its suspects list
    state.gwAiPossibleSuspects = state.gwAiPossibleSuspects.filter(sIdx => {
      return chosenQ.check(GW_SUSPECTS[sIdx]) === answer;
    });

    $('gw-answer-box').innerHTML = `
      <div class="gw-answer" style="border-left-color: #ff9966;">
        Philosopher deduced: <strong>${answer ? 'YES' : 'NO'}</strong>.<br/>
        <em>"${opp.name} has narrowed their list to ${state.gwAiPossibleSuspects.length} possibilities."</em>
      </div>
    `;

    setTimeout(() => {
      // AI checks for final guess
      if (state.gwAiPossibleSuspects.length === 1) {
        // AI makes final guess
        const finalGuessIdx = state.gwAiPossibleSuspects[0];
        if (finalGuessIdx === state.gwPlayerSecret) {
          triggerAiWin();
        } else {
          // AI guessed wrong (should not happen with perfect logic, but safeguard)
          state.gwAiPossibleSuspects = state.gwAiPossibleSuspects.filter(id => id !== finalGuessIdx);
          returnToPlayerTurn();
        }
      } else if (state.gwAiPossibleSuspects.length === 2 && Math.random() > 0.6) {
        // AI takes a risk on hard/normal
        const finalGuessIdx = state.gwAiPossibleSuspects[Math.floor(Math.random() * 2)];
        if (finalGuessIdx === state.gwPlayerSecret) {
          triggerAiWin();
        } else {
          // AI guessed wrong
          state.gwAiPossibleSuspects = state.gwAiPossibleSuspects.filter(id => id !== finalGuessIdx);
          $('gw-ai-dialogue').textContent = `"${opp.name}: 'Blast! My deduction was imperfect. I assumed you were ${GW_SUSPECTS[finalGuessIdx].name}.'"`;
          setTimeout(returnToPlayerTurn, 2000);
        }
      } else {
        returnToPlayerTurn();
      }
    }, 1500);

  }, 1500);
}

function returnToPlayerTurn() {
  if (state.gwOver) return;
  state.gwTurn = 'player';
  updateTurnUI();
  renderQuestions();
  updateStatusText();
  
  // Re-enable final guess
  $('gw-final-guess').classList.remove('hidden');
}

function startFinalGuess() {
  state.gwGuessing = true;
  $('gw-answer-box').innerHTML = '<div class="gw-answer">Click on a suspect card to make your Final Guess!</div>';
  $('gw-final-guess').classList.add('hidden');
  $('gw-status').textContent = 'Make your final guess...';
}

function revealGuess(idx) {
  state.gwGuessing = false;
  state.gwOver = true;
  
  const correct = idx === state.gwAiSecret;
  const target = GW_SUSPECTS[state.gwAiSecret];
  const opp = state.gwOpponent;

  // Reveal correct card
  const cards = $('gw-board').querySelectorAll('.gw-card');
  cards[state.gwAiSecret].classList.add('target-reveal');

  if (correct) {
    if (plat) plat.audio.playCollect();
    // Explode particles
    for (let i = 0; i < 40; i++) {
      particles.particles.push({
        x: window.innerWidth / 2 + (Math.random() - 0.5) * 200,
        y: window.innerHeight / 2 + (Math.random() - 0.5) * 200,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 6,
        speedY: (Math.random() - 0.5) * 6,
        opacity: 0.9
      });
    }

    $('gw-answer-box').innerHTML = `
      <div class="gw-answer" style="border-left-color: #ffd17e; background: rgba(255, 209, 126, 0.08);">
        🎉 <strong>VICTORY!</strong> You guessed correctly.<br/>
        The philosopher's secret identity was <strong>${target.name}</strong> (${target.source}).
      </div>
    `;
    $('gw-ai-dialogue').textContent = `"${opp.name}: '${opp.victory}'"`;
    $('gw-status').textContent = 'Deduction Successful. You found the true self.';
  } else {
    if (plat) plat.audio.playGlitch();
    $('gw-answer-box').innerHTML = `
      <div class="gw-answer" style="border-left-color: #ff3333; background: rgba(255, 50, 50, 0.08);">
        💀 <strong>DEFEAT!</strong> Your guess was incorrect.<br/>
        You guessed <strong>${GW_SUSPECTS[idx].name}</strong>, but the philosopher was <strong>${target.name}</strong> (${target.source}).
      </div>
    `;
    $('gw-ai-dialogue').textContent = `"${opp.name}: '${opp.defeat}'"`;
    $('gw-status').textContent = 'Trial Failed. The self remains hidden.';
  }

  $('gw-final-guess').classList.add('hidden');
  $('gw-continue').classList.remove('hidden');
}

function triggerAiWin() {
  state.gwOver = true;
  if (plat) plat.audio.playGlitch();

  const opp = state.gwOpponent;
  const target = GW_SUSPECTS[state.gwAiSecret];
  const pCard = GW_SUSPECTS[state.gwPlayerSecret];

  // Reveal correct card
  const cards = $('gw-board').querySelectorAll('.gw-card');
  cards[state.gwAiSecret].classList.add('target-reveal');

  $('gw-answer-box').innerHTML = `
    <div class="gw-answer" style="border-left-color: #ff3333; background: rgba(255, 50, 50, 0.08);">
      💀 <strong>DEFEAT!</strong> The philosopher guessed your identity first.<br/>
      ${opp.name} deduced that you were <strong>${pCard.name}</strong>.<br/>
      The philosopher's secret identity was <strong>${target.name}</strong> (${target.source}).
    </div>
  `;

  $('gw-ai-dialogue').textContent = `"${opp.name}: 'Aha! I have deduced your pattern. ${opp.defeat}'"`;
  $('gw-status').textContent = 'Trial Failed. The philosopher found you first.';

  $('gw-final-guess').classList.add('hidden');
  $('gw-continue').classList.remove('hidden');
}

// ---- FINAL ----
function initFinal() {
  const sil = $('final-silhouette');
  sil.innerHTML = '';
  sil.appendChild(createGlowSilhouette('#c9b8ff', 0.6));
  $('final-message').querySelector('.final-narrator').textContent = `"There is no single '${state.name || 'you'}.' You are a shifting constellation of choices, contexts, and stories."`;
  $('philosophical-quotes').innerHTML = [...PHILOSOPHICAL_QUOTES]
    .sort(() => Math.random() - 0.5)
    .slice(0, 4)
    .map((q, i) => `<div class="phil-quote" style="animation-delay:${i * 0.3}s">${q.text}<span class="quote-source">${q.source}</span></div>`)
    .join('');
}

