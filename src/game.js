// WHO//ARE//YOU? : Game Engine (Full-Screen Platformer)
import {
  TRAITS, INTERESTS, CORE_VALUES, FEARS, AESTHETICS, ARCHETYPES,
  TRAIT_INSIGHTS, VALUE_INSIGHTS, AESTHETIC_INSIGHTS, PHASE2_SCENARIOS, WORLDS, SHIFT_SCENARIOS,
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
  gwOver: false,

  // Soul Shop and Choice Log extensions
  fragments: 0,
  purchased: { wings: false, shield: false, prism: false, elixir: false },
  choiceHistory: [],
  activeFilter: 'none'
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

  // Initialize Qualia Sandbox (Secret click trigger on the title question mark)
  const sandbox = new QualiaSandbox('sandbox-canvas');
  let secretClicks = 0;
  
  const ts = $('title-secret');
  if (ts) {
    ts.addEventListener('click', () => {
      secretClicks++;
      ts.classList.add('glitch-active');
      setTimeout(() => ts.classList.remove('glitch-active'), 300);
      
      if (secretClicks >= 3) {
        secretClicks = 0;
        $('sandbox-modal').classList.remove('hidden');
        $('qualia-fragment-reward').classList.add('hidden');
        sandbox.start();
      }
    });
    
    ts.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        ts.click();
      }
    });
  }

  $('btn-sandbox-close').addEventListener('click', () => {
    const rewardVisible = !$('qualia-fragment-reward').classList.contains('hidden');
    if (rewardVisible || sandbox.nodes.length < 11) {
      $('sandbox-modal').classList.add('hidden');
      $('qualia-fragment-reward').classList.add('hidden');
      sandbox.stop();
    } else {
      const qQuotes = [
        "Is the red you see the same red that paints my mind, or is it a color name for two different worlds?",
        "If a machine mimics every spark of my brain, does it feel the warmth of the sun, or is it forever cold?",
        "We are not built of static bricks, but of the moving water of our perceptions: a bundle of experiences flowing through time.",
        "What is it like to be a bat? To map the night with echoes, and feel a space we can never imagine.",
        "The scent of rain, the weight of a memory: these are the qualitative fabrics of the self, invisible to all but you."
      ];
      if (!state.qualiaFragment) {
        state.qualiaFragment = qQuotes[Math.floor(Math.random() * qQuotes.length)];
      }
      $('fragment-text').textContent = state.qualiaFragment;
      $('qualia-fragment-reward').classList.remove('hidden');
      if (state.sandboxCloseTimeout) clearTimeout(state.sandboxCloseTimeout);
      state.sandboxCloseTimeout = setTimeout(() => {
        $('sandbox-modal').classList.add('hidden');
        $('qualia-fragment-reward').classList.add('hidden');
        sandbox.stop();
      }, 5000);
    }
  });

  $('btn-sandbox-clear').addEventListener('click', () => {
    sandbox.clear();
  });

  $('sandbox-modal').addEventListener('click', e => {
    if (e.target === $('sandbox-modal')) {
      $('sandbox-modal').classList.add('hidden');
      $('qualia-fragment-reward').classList.add('hidden');
      sandbox.stop();
    }
  });

  // Keyboard accessibility: Escape key closes modals
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      $('rulebook-modal').classList.add('hidden');
      const sm = $('settings-modal');
      if (sm) sm.classList.add('hidden');
      if (sandbox.active) {
        $('sandbox-modal').classList.add('hidden');
        sandbox.stop();
      }
    }
  });

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
  setupShop();
  setupVictoryTreat();
  setupReflectionEasterEgg();
  $('btn-restart').addEventListener('click', () => location.reload());
}

// ---- SETTINGS ----
function setupSettings() {
  const toggle = $('settings-toggle'), modal = $('settings-modal'), close = $('settings-close');
  toggle.addEventListener('click', () => { modal.classList.toggle('hidden'); });
  if (close) close.addEventListener('click', () => { modal.classList.add('hidden'); });
  modal.addEventListener('click', e => { if (e.target === modal) modal.classList.add('hidden'); });
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
    c.addEventListener('click', () => {
      g.querySelectorAll('.aesthetic-card').forEach(x => x.classList.remove('selected'));
      c.classList.add('selected');
      state.aesthetic = a.name;
      $('btn-aesthetic-next').disabled = false;
      if (_titleAudio) _titleAudio.startMusic(a.name);
    });
    g.appendChild(c);
  });
}
function revealArchetype() {
  const tv = { Creative:{curiosity:1},Analytical:{logicalReasoning:1},Empathetic:{empathy:1},Ambitious:{ambition:1},Curious:{curiosity:1},Loyal:{conformity:1,empathy:1},Independent:{independence:1},Optimistic:{emotionalReasoning:1},Cautious:{logicalReasoning:1,riskTolerance:-1},Passionate:{emotionalReasoning:1,riskTolerance:1},Resilient:{independence:1,riskTolerance:1},Honest:{independence:1},Adaptable:{conformity:1,curiosity:1},Confident:{ambition:1,independence:1},Patient:{logicalReasoning:1},Spontaneous:{riskTolerance:1,curiosity:1},Thoughtful:{empathy:1,logicalReasoning:1},Determined:{ambition:1,riskTolerance:1},Gentle:{empathy:1,emotionalReasoning:1},Bold:{riskTolerance:1,independence:1} };
  state.traits.forEach(t => { if (tv[t]) addVectors(tv[t]); });
  
  let bestArch = ARCHETYPES[0];
  let maxScore = -999;
  ARCHETYPES.forEach(a => {
    const s = a.score(state.vectors, state);
    if (s > maxScore) {
      maxScore = s;
      bestArch = a;
    }
  });
  state.archetype = bestArch;
  
  const arch = bestArch;
  $('archetype-sil-wrap').innerHTML = ''; $('archetype-sil-wrap').appendChild(createGlowSilhouette('#c9b8ff', 0.7));
  $('archetype-info').innerHTML = `<div class="archetype-name">${arch.name}</div><div class="archetype-title-line">${arch.title}</div><div class="archetype-backstory">${arch.backstory}</div><div class="archetype-stats">${Object.entries(arch.stats).map(([k,v]) => `<div class="arch-stat">${k}: <span>${v}</span></div>`).join('')}</div>`;
  const traitInsight = TRAIT_INSIGHTS[state.traits[0]] || 'Your chosen qualities guide your path.';
  const valueInsight = VALUE_INSIGHTS[state.coreValue] || 'Your core value anchors your decisions.';
  const aestheticInsight = AESTHETIC_INSIGHTS[state.aesthetic] || 'Your aesthetic colors your worldview.';
  
  $('commonality-reveal').innerHTML = `
    <div class="soul-tarot-deck">
      <div class="tarot-card trait-card">
        <div class="tarot-glow-effect"></div>
        <div class="tarot-header">
          <span class="tarot-label">Primary Trait</span>
        </div>
        <div class="tarot-value">${traitInsight}</div>
      </div>
      <div class="tarot-card principle-card">
        <div class="tarot-glow-effect"></div>
        <div class="tarot-header">
          <span class="tarot-label">Core Principle</span>
        </div>
        <div class="tarot-value">${valueInsight}</div>
      </div>
      <div class="tarot-card aesthetic-card-soul">
        <div class="tarot-glow-effect"></div>
        <div class="tarot-header">
          <span class="tarot-label">Aesthetic Vibe</span>
        </div>
        <div class="tarot-value">${aestheticInsight}</div>
      </div>
    </div>
  `;
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
  if (state.archetype) {
    plat.setArchetype(state.archetype.id);
  }
  // Sync active Soul Shop items
  plat.hasWings = state.purchased.wings;
  plat.hasShield = state.purchased.shield;
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
    registerChoice(plat.orbs[idx]);
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
    registerChoice(plat.orbs[idx]);
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
    registerChoice(plat.orbs[idx]);
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
  
  const qmf = $('qualia-mirror-fragment');
  if (state.qualiaFragment && qmf) {
    qmf.innerHTML = `<span class="fragment-sparkle">✦</span> <strong>Qualia Fragment:</strong> "${state.qualiaFragment}"`;
    qmf.classList.remove('hidden');
  } else if (qmf) {
    qmf.classList.add('hidden');
  }

  $('narrator-mirror-text').innerHTML = '"Ah, see, there you are: not who you said you were, and not even who the world made you. Rather, something in between. Dare we say, something <em>real</em>"';
}
function genProfile(n) {
  const p = [];
  if (n.empathy > 65) p.push('You are deeply attuned to others.'); else if (n.empathy < 35) p.push('You chart your own emotional course.'); else p.push('You balance empathy with self-preservation.');
  if (n.independence > 65) p.push('You resist the crowd.'); else if (n.independence < 35) p.push('You find strength in belonging.');
  if (n.curiosity > 65) p.push('Questions drive you more than answers.'); else if (n.curiosity < 35) p.push('You trust what you know.');
  if (n.emotionalReasoning > n.logicalReasoning + 15) p.push('Your heart leads.'); else if (n.logicalReasoning > n.emotionalReasoning + 15) p.push('Your mind leads.'); else p.push('You navigate between heart and mind.');
  if (n.riskTolerance > 65) p.push('You leap, standing still feels like surrender.'); else if (n.riskTolerance < 35) p.push('Every step is intentional.');
  return p.join(' ');
}
function genInsights(n) {
  const ins = [];
  if (n.empathy > 60 && n.independence > 60) ins.push('You care deeply yet insist on your own path.');
  if (n.conformity > 55 && n.curiosity > 55) ins.push('You question everything but still seek belonging.');
  if (n.riskTolerance > 60 && n.emotionalReasoning > 55) ins.push('Your courage comes from feeling, not calculation.');
  const wn = {strict:'The Iron Republic',chaotic:'The Unbound',collectivist:'The Collective',individualistic:'The Mirror City'};
  ins.push(`In ${wn[state.worldType]}, your identity shifted: context reshapes who we become.`);
  if (n.independence > 60) ins.push('Emerson: "Trust thyself: every heart vibrates to that iron string."');
  if (n.empathy > 60) ins.push('Your pattern echoes Jackson\'s qualia, the irreducible reality of subjective experience.');
  if (n.conformity > 55) ins.push('Hobbes: your instinct for order reflects humanity\'s deepest need.');
  if (n.curiosity > 60) ins.push('Hume: the self is "a bundle of perceptions", always shifting.');
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

  // Assign player secret identity from their Phase 1 archetype
  const archName = state.archetype ? state.archetype.name : '';
  const matchedIdx = GW_SUSPECTS.findIndex(s => s.name === archName);
  state.gwPlayerSecret = matchedIdx !== -1 ? matchedIdx : 0;

  // Choose AI secret card randomly (different from player)
  let aiIdx;
  do {
    aiIdx = Math.floor(Math.random() * GW_SUSPECTS.length);
  } while (aiIdx === state.gwPlayerSecret);
  state.gwAiSecret = aiIdx;

  // Initialize game state
  state.gwEliminated = new Set();
  if (state.purchased.elixir) {
    // Socratic Elixir: pre-eliminate 1 random incorrect suspect (excluding AI secret)
    const candidates = [];
    for (let i = 0; i < GW_SUSPECTS.length; i++) {
      if (i !== state.gwAiSecret) {
        candidates.push(i);
      }
    }
    if (candidates.length > 0) {
      const randIdx = candidates[Math.floor(Math.random() * candidates.length)];
      state.gwEliminated.add(randIdx);
    }
  }
  state.gwUsedQs = new Set();
  state.gwGuessing = false;
  state.gwAbilityUsed = false;
  state.gwTurn = 'player';
  state.gwAiPossibleSuspects = GW_SUSPECTS.map((_, i) => i);
  state.gwOver = false;

  // Render Displays
  const playerCard = GW_SUSPECTS[state.gwPlayerSecret];
  $('gw-secret-display').textContent = `${playerCard.name}`;
  $('gw-opponent-display').textContent = `${state.gwOpponent.name}`;
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
    } else {
      card.title = `Belief: ${s.belief}`;
    }

    card.innerHTML = `
      <div class="gw-card-header-accent"></div>
      <div class="gw-card-icon-wrap">
        <span class="gw-card-icon">${s.icon}</span>
      </div>
      <div class="gw-card-name">${s.name}</div>
      <div class="gw-card-theory">${s.theory}</div>
      <div class="gw-card-details">
        <div class="gw-card-detail"><span>Value:</span> ${s.value}</div>
        <div class="gw-card-detail"><span>Traits:</span> ${s.traits.join(', ')}</div>
        <div class="gw-card-detail"><span>Fear:</span> ${s.fear}</div>
        <div class="gw-card-detail"><span>Theme:</span> ${s.aesthetic}</div>
        <div class="gw-card-detail"><span>Source:</span> ${s.source}</div>
      </div>
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
          Answer: <strong>${answer ? 'YES' : 'NO'}</strong>: <em>${q.label}</em>
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
      // Hobbes Order: Eliminate 2 random wrong suspects automatically
      const wrongSuspects = [];
      for (let i = 0; i < GW_SUSPECTS.length; i++) {
        if (i !== state.gwAiSecret && !state.gwEliminated.has(i)) {
          wrongSuspects.push(i);
        }
      }
      const toEliminate = [];
      while (wrongSuspects.length > 0 && toEliminate.length < 2) {
        const randIndex = Math.floor(Math.random() * wrongSuspects.length);
        const [chosen] = wrongSuspects.splice(randIndex, 1);
        toEliminate.push(chosen);
      }
      const eliminatedNames = [];
      toEliminate.forEach(idx => {
        state.gwEliminated.add(idx);
        eliminatedNames.push(GW_SUSPECTS[idx].name);
      });
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
  const diff = opp.difficulty || 'Normal';

  // AI Strategic deduction: finds a question it hasn't used that splits its remaining suspects closest to 50/50
  let bestQIdx = -1;
  
  // Create a list of questions that AI has not asked yet (simulated by checking index)
  const unasked = GUESS_QUESTIONS.map((_, i) => i).filter(i => !state.gwUsedQs.has(i));
  
  if (unasked.length === 0) {
    // Fallback: pick a random question
    bestQIdx = Math.floor(Math.random() * GUESS_QUESTIONS.length);
  } else {
    // Strategy: evaluate how well each question splits the remaining possibilities
    const candidates = [];
    unasked.forEach(qIdx => {
      const q = GUESS_QUESTIONS[qIdx];
      let yesCount = 0;
      state.gwAiPossibleSuspects.forEach(sIdx => {
        if (q.check(GW_SUSPECTS[sIdx])) yesCount++;
      });
      const diffVal = Math.abs(state.gwAiPossibleSuspects.length / 2 - yesCount);
      candidates.push({ qIdx, diff: diffVal });
    });
    
    // Sort candidates so the ones that split closest to 50/50 are first
    candidates.sort((a, b) => a.diff - b.diff);
    
    // Adjust choice pool size and random chance based on difficulty
    if (diff === 'Easy') {
      // Easy: 50% chance to pick a completely random question, or pick from top 5 splits
      if (Math.random() > 0.5) {
        bestQIdx = unasked[Math.floor(Math.random() * unasked.length)];
      } else {
        const poolSize = Math.min(5, candidates.length);
        const chosenCandidate = candidates[Math.floor(Math.random() * poolSize)];
        bestQIdx = chosenCandidate.qIdx;
      }
    } else if (diff === 'Hard') {
      // Hard: 85% chance to pick the absolute best split, otherwise top 2
      if (Math.random() < 0.85 && candidates.length > 0) {
        bestQIdx = candidates[0].qIdx;
      } else {
        const poolSize = Math.min(2, candidates.length);
        const chosenCandidate = candidates[Math.floor(Math.random() * poolSize)];
        bestQIdx = chosenCandidate.qIdx;
      }
    } else {
      // Normal: 15% chance to pick a completely random question, or pick from top 3 splits
      if (Math.random() < 0.15) {
        bestQIdx = unasked[Math.floor(Math.random() * unasked.length)];
      } else {
        const poolSize = Math.min(3, candidates.length);
        const chosenCandidate = candidates[Math.floor(Math.random() * poolSize)];
        bestQIdx = chosenCandidate.qIdx;
      }
    }
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
          // AI guessed wrong (safeguard)
          state.gwAiPossibleSuspects = state.gwAiPossibleSuspects.filter(id => id !== finalGuessIdx);
          returnToPlayerTurn();
        }
      } else if (state.gwAiPossibleSuspects.length === 2) {
        // Risk assessment based on difficulty
        const riskChance = diff === 'Hard' ? 0.75 : (diff === 'Easy' ? 0.15 : 0.4);
        if (Math.random() < riskChance) {
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

    // Show Victory Treat Modal after a short delay!
    setTimeout(() => {
      const certPlayer = $('cert-player-name');
      const certOpp = $('cert-opp-name');
      if (certPlayer) certPlayer.textContent = state.name || 'The Wanderer';
      if (certOpp) certOpp.textContent = opp.name;

      // Unlock golden filter option
      const filterSelect = $('prism-filter');
      if (filterSelect && !filterSelect.querySelector('option[value="gold"]')) {
        const opt = document.createElement('option');
        opt.value = 'gold';
        opt.textContent = '🌟 Golden Transcendence';
        filterSelect.appendChild(opt);
      }
      if (state.purchased.prism) {
        const prismRow = $('prism-settings-row');
        if (prismRow) prismRow.style.display = 'flex';
      }

      $('treat-modal').classList.remove('hidden');
    }, 3000);

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
  $('final-message').querySelector('.final-narrator').textContent = `"There is no single '${state.name || 'you'}.' You are a shifting collection of choices, contexts, and stories."`;
  $('philosophical-quotes').innerHTML = [...PHILOSOPHICAL_QUOTES]
    .sort(() => Math.random() - 0.5)
    .slice(0, 4)
    .map((q, i) => `<div class="phil-quote" style="animation-delay:${i * 0.3}s">${q.text}<span class="quote-source">${q.source}</span></div>`)
    .join('');
}

class QualiaSandbox {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.nodes = [];
    this.ripples = [];
    this.active = false;
    this.mouse = { x: null, y: null };
    this.notesScale = [220, 246.9, 277.2, 329.6, 369.9, 440, 493.9, 554.4, 659.3, 739.9, 880]; // Ethereal pentatonic scale

    window.addEventListener('resize', () => {
      if (this.active) this.resize();
    });
    this.canvas.addEventListener('mousemove', e => this.onMouseMove(e));
    this.canvas.addEventListener('mouseleave', () => this.onMouseLeave());
    this.canvas.addEventListener('mousedown', e => this.onMouseDown(e));
  }

  start() {
    this.active = true;
    this.resize();
    this.nodes = [];
    this.ripples = [];
    // Spawn 8 starting random thought nodes
    for (let i = 0; i < 8; i++) {
      this.spawnNode(
        Math.random() * this.canvas.width,
        Math.random() * this.canvas.height,
        false
      );
    }
    this.loop();
  }

  stop() {
    this.active = false;
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  }

  spawnNode(x, y, playSound = true) {
    const normalizedY = 1 - (y / this.canvas.height);
    const scaleIndex = Math.min(
      this.notesScale.length - 1,
      Math.max(0, Math.floor(normalizedY * this.notesScale.length))
    );
    const freq = this.notesScale[scaleIndex];

    const node = {
      x,
      y,
      vx: (Math.random() * 2 - 1) * 0.4,
      vy: (Math.random() * 2 - 1) * 0.4,
      radius: 6 + Math.random() * 5,
      color: `hsla(${240 + Math.random() * 60}, 100%, 80%, 0.85)`,
      freq
    };
    this.nodes.push(node);

    this.ripples.push({
      x,
      y,
      radius: 5,
      maxRadius: 60,
      opacity: 1,
      color: node.color
    });

    if (playSound && _titleAudio) {
      _titleAudio.playSandboxNote(freq);
    }
  }

  onMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = e.clientX - rect.left;
    this.mouse.y = e.clientY - rect.top;
  }

  onMouseLeave() {
    this.mouse.x = null;
    this.mouse.y = null;
  }

  onMouseDown(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let clickedExisting = false;
    for (const node of this.nodes) {
      const dist = Math.hypot(node.x - x, node.y - y);
      if (dist < node.radius + 15) {
        if (_titleAudio) {
          _titleAudio.playSandboxNote(node.freq);
        }
        this.ripples.push({
          x: node.x,
          y: node.y,
          radius: node.radius,
          maxRadius: 80,
          opacity: 1,
          color: node.color
        });
        node.vx += (Math.random() * 2 - 1) * 1.5;
        node.vy += (Math.random() * 2 - 1) * 1.5;
        clickedExisting = true;
        break;
      }
    }

    if (!clickedExisting) {
      this.spawnNode(x, y, true);
    }
  }

  clear() {
    this.nodes = [];
    this.ripples = [];
  }

  loop() {
    if (!this.active) return;
    this.update();
    this.draw();
    requestAnimationFrame(() => this.loop());
  }

  update() {
    for (const node of this.nodes) {
      node.x += node.vx;
      node.y += node.vy;

      if (node.x - node.radius < 0) { node.x = node.radius; node.vx *= -1; }
      if (node.x + node.radius > this.canvas.width) { node.x = this.canvas.width - node.radius; node.vx *= -1; }
      if (node.y - node.radius < 0) { node.y = node.radius; node.vy *= -1; }
      if (node.y + node.radius > this.canvas.height) { node.y = this.canvas.height - node.radius; node.vy *= -1; }

      if (this.mouse.x !== null && this.mouse.y !== null) {
        const dx = this.mouse.x - node.x;
        const dy = this.mouse.y - node.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 180) {
          const force = (180 - dist) / 1500;
          node.vx += (dx / dist) * force;
          node.vy += (dy / dist) * force;

          const speed = Math.hypot(node.vx, node.vy);
          if (speed > 1.8) {
            node.vx = (node.vx / speed) * 1.8;
            node.vy = (node.vy / speed) * 1.8;
          }
        }
      }

      node.vx *= 0.985;
      node.vy *= 0.985;
    }

    for (let i = this.ripples.length - 1; i >= 0; i--) {
      const rip = this.ripples[i];
      rip.radius += 2.5;
      rip.opacity -= 0.035;
      if (rip.opacity <= 0 || rip.radius >= rip.maxRadius) {
        this.ripples.splice(i, 1);
      }
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.lineWidth = 1;
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        const n1 = this.nodes[i];
        const n2 = this.nodes[j];
        const dist = Math.hypot(n1.x - n2.x, n1.y - n2.y);
        if (dist < 140) {
          const alpha = (140 - dist) / 140 * 0.35;
          this.ctx.strokeStyle = `rgba(201, 184, 255, ${alpha})`;
          this.ctx.beginPath();
          this.ctx.moveTo(n1.x, n1.y);
          this.ctx.lineTo(n2.x, n2.y);
          this.ctx.stroke();
        }
      }
    }

    for (const rip of this.ripples) {
      this.ctx.strokeStyle = rip.color.replace('0.85', rip.opacity);
      this.ctx.lineWidth = 1.5;
      this.ctx.beginPath();
      this.ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
      this.ctx.stroke();
    }

    for (const node of this.nodes) {
      this.ctx.shadowBlur = 15;
      this.ctx.shadowColor = node.color;
      this.ctx.fillStyle = node.color;
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.shadowBlur = 0;
      this.ctx.shadowColor = 'transparent';
    }

    if (this.mouse.x !== null && this.mouse.y !== null) {
      this.ctx.strokeStyle = 'rgba(201, 184, 255, 0.08)';
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.arc(this.mouse.x, this.mouse.y, 180, 0, Math.PI * 2);
      this.ctx.stroke();
    }
  }
}

function registerChoice(orb) {
  if (!orb) return;
  state.choiceHistory.push(orb.fullText);
  state.fragments++;
  updateShopUI();
}

function setupShop() {
  const toggle = $('shop-toggle');
  const modal = $('shop-modal');
  const close = $('shop-close');
  if (!toggle || !modal) return;
  
  toggle.addEventListener('click', () => {
    modal.classList.toggle('hidden');
    updateShopUI();
  });
  if (close) {
    close.addEventListener('click', () => modal.classList.add('hidden'));
  }
  modal.addEventListener('click', e => {
    if (e.target === modal) modal.classList.add('hidden');
  });
  
  const buyWings = $('btn-buy-wings');
  const buyShield = $('btn-buy-shield');
  const buyPrism = $('btn-buy-prism');
  const buyElixir = $('btn-buy-elixir');
  
  const buyItem = (item, cost, btn) => {
    if (state.fragments >= cost && !state.purchased[item]) {
      state.fragments -= cost;
      state.purchased[item] = true;
      if (plat) {
        plat.audio.playCollect();
        if (item === 'wings') { plat.hasWings = true; plat._renderPowerupBadge(); }
        if (item === 'shield') { plat.hasShield = true; plat._renderPowerupBadge(); }
      }
      if (item === 'prism') {
        const prismRow = $('prism-settings-row');
        if (prismRow) prismRow.style.display = 'flex';
      }
      updateShopUI();
    }
  };
  
  buyWings.addEventListener('click', () => buyItem('wings', 2, buyWings));
  buyShield.addEventListener('click', () => buyItem('shield', 2, buyShield));
  buyPrism.addEventListener('click', () => buyItem('prism', 3, buyPrism));
  buyElixir.addEventListener('click', () => buyItem('elixir', 4, buyElixir));
  
  const filterSelect = $('prism-filter');
  if (filterSelect) {
    filterSelect.addEventListener('change', e => {
      const filter = e.target.value;
      state.activeFilter = filter;
      document.body.classList.remove('filter-dreamy', 'filter-vintage', 'filter-glitched', 'filter-gold');
      if (filter !== 'none') {
        document.body.classList.add(`filter-${filter}`);
      }
    });
  }
}

function updateShopUI() {
  const display = $('shop-fragments-count');
  if (display) display.textContent = state.fragments;
  
  const items = ['wings', 'shield', 'prism', 'elixir'];
  items.forEach(item => {
    const btn = $(`btn-buy-${item}`);
    if (!btn) return;
    const cost = parseInt(btn.getAttribute('data-cost'));
    if (state.purchased[item]) {
      btn.disabled = true;
      btn.textContent = 'Owned';
      btn.classList.add('owned');
    } else {
      btn.disabled = state.fragments < cost;
      btn.textContent = `Buy (${cost} Frags)`;
      btn.classList.remove('owned');
    }
  });

  const canBuyAny = Object.entries(state.purchased).some(([item, owned]) => {
    if (owned) return false;
    const cost = { wings: 2, shield: 2, prism: 3, elixir: 4 }[item];
    return state.fragments >= cost;
  });
  const shopToggle = $('shop-toggle');
  if (shopToggle) {
    if (canBuyAny) {
      shopToggle.classList.add('shop-pulse-glow');
    } else {
      shopToggle.classList.remove('shop-pulse-glow');
    }
  }
  
  const list = $('shop-choice-history');
  if (list) {
    if (state.choiceHistory.length === 0) {
      list.textContent = 'Make choices in the platformer to build history...';
    } else {
      list.innerHTML = state.choiceHistory.map((c, i) => {
        let phaseLabel = 'Phase II';
        if (i >= 3 && i < 5) phaseLabel = 'Phase III';
        if (i >= 5) phaseLabel = 'Phase IV';
        return `<div class="history-item"><span class="history-phase-tag">${phaseLabel}</span> ${c}</div>`;
      }).join('');
    }
  }
}

function setupVictoryTreat() {
  const modal = $('treat-modal');
  const close = $('treat-close');
  if (close && modal) {
    close.addEventListener('click', () => modal.classList.add('hidden'));
  }
  if (modal) {
    modal.addEventListener('click', e => {
      if (e.target === modal) modal.classList.add('hidden');
    });
  }
}

function setupReflectionEasterEgg() {
  const btn = $('btn-submit-reflection');
  const modal = $('reflection-modal');
  const close = $('reflection-close');
  const okBtn = $('btn-reflection-modal-ok');
  const text = $('reflection-input');
  
  if (!btn || !modal) return;
  
  btn.addEventListener('click', () => {
    if (!text.value.trim()) return;
    modal.classList.remove('hidden');
    if (plat) plat.audio.playCollect();
  });
  
  const closeModal = () => modal.classList.add('hidden');
  if (close) close.addEventListener('click', closeModal);
  if (okBtn) okBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', e => {
    if (e.target === modal) closeModal();
  });
}

