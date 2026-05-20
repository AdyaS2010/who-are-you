// WHO//ARE//YOU? — Game Engine (Full-Screen Platformer)
import {
  TRAITS, INTERESTS, CORE_VALUES, FEARS, AESTHETICS, ARCHETYPES,
  COMMONALITY_MESSAGES, PHASE2_SCENARIOS, WORLDS, SHIFT_SCENARIOS,
  GLITCH_SCENARIOS, GUESS_QUESTIONS, PHILOSOPHICAL_QUOTES, VECTOR_DESCRIPTIONS
} from './data.js';
import { ParticleSystem, triggerGlitch, createGlowSilhouette } from './effects.js';
import { Platformer } from './platformer.js';

const state = {
  phase:0, name:'', traits:[], interests:[], coreValue:'', fear:'', aesthetic:'',
  archetype:null,
  vectors:{empathy:0,conformity:0,independence:0,curiosity:0,emotionalReasoning:0,logicalReasoning:0,riskTolerance:0,ambition:0},
  scenarioIndex:0, shiftScenarioIndex:0, glitchScenarioIndex:0, worldType:'', guessQuestionIndex:0
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
  $('vol-music').addEventListener('input', e => { if (plat) plat.audio.setMusicVol(e.target.value / 100); });
  $('vol-sfx').addEventListener('input', e => { if (plat) plat.audio.setSfxVol(e.target.value / 100); });
  $('mute-all').addEventListener('change', e => { if (plat) plat.audio.setMute(e.target.checked); });
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
    // Apply current settings
    plat.audio.setMusicVol($('vol-music').value / 100);
    plat.audio.setSfxVol($('vol-sfx').value / 100);
    plat.audio.setMute($('mute-all').checked);
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

// ---- PHASE 6: GUESS WHO BOARD GAME ----
const GW_SUSPECTS = [
  {name:'The Scholar',icon:'📚',traits:['Analytical','Curious'],value:'Knowledge',fear:'Irrelevance'},
  {name:'The Guardian',icon:'🛡️',traits:['Loyal','Empathetic'],value:'Justice',fear:'Betrayal'},
  {name:'The Rebel',icon:'⚡',traits:['Bold','Independent'],value:'Freedom',fear:'Confinement'},
  {name:'The Dreamer',icon:'🌙',traits:['Creative','Optimistic'],value:'Authenticity',fear:'Mediocrity'},
  {name:'The Strategist',icon:'♟️',traits:['Analytical','Ambitious'],value:'Knowledge',fear:'Failure'},
  {name:'The Empath',icon:'💜',traits:['Gentle','Empathetic'],value:'Compassion',fear:'Isolation'},
  {name:'The Explorer',icon:'🧭',traits:['Curious','Spontaneous'],value:'Freedom',fear:'Stagnation'},
  {name:'The Builder',icon:'🏗️',traits:['Determined','Patient'],value:'Legacy',fear:'Irrelevance'},
  {name:'The Healer',icon:'🌿',traits:['Thoughtful','Resilient'],value:'Compassion',fear:'Helplessness'},
  {name:'The Maverick',icon:'🔥',traits:['Passionate','Bold'],value:'Authenticity',fear:'Conformity'},
  {name:'The Sage',icon:'🔮',traits:['Patient','Honest'],value:'Truth',fear:'Deception'},
  {name:'The Catalyst',icon:'✨',traits:['Confident','Adaptable'],value:'Growth',fear:'Stagnation'}
];
const GW_QUESTIONS = [
  {q:'Do they value independence over belonging?',check:v=>v.independence>v.conformity,trait:'Independent',anti:'Loyal'},
  {q:'Do they lead with emotion over logic?',check:v=>v.emotionalReasoning>v.logicalReasoning,trait:'Empathetic',anti:'Analytical'},
  {q:'Are they risk-takers?',check:v=>v.riskTolerance>50,trait:'Bold',anti:'Cautious'},
  {q:'Do they seek knowledge above all?',check:v=>v.curiosity>55,trait:'Curious',anti:'Patient'},
  {q:'Are they driven by ambition?',check:v=>v.ambition>50,trait:'Ambitious',anti:'Gentle'},
  {q:'Do they prioritize others\' feelings?',check:v=>v.empathy>55,trait:'Empathetic',anti:'Independent'},
  {q:'Do they embrace change easily?',check:v=>v.curiosity>50&&v.riskTolerance>45,trait:'Adaptable',anti:'Determined'},
  {q:'Do they fear being alone?',check:v=>v.conformity>50,trait:'Loyal',anti:'Bold'},
];
let gwTarget=null, gwEliminated=new Set(), gwUsedQs=new Set(), gwGuessing=false;

function setupPhase6() {
  $('btn-phase5-complete').addEventListener('click', () => { switchScreen('screen-phase5','screen-phase6'); setTheme(6); initGuessWho(); });
}

function initGuessWho() {
  // Find closest suspect to player's actual profile
  const pTraits=new Set(state.traits), pValue=state.coreValue, pFear=state.fear;
  let bestScore=-1, bestIdx=0;
  GW_SUSPECTS.forEach((s,i)=>{
    let score=0;
    s.traits.forEach(t=>{if(pTraits.has(t))score+=3;});
    if(s.value===pValue)score+=2;
    if(s.fear===pFear)score+=2;
    if(score>bestScore){bestScore=score;bestIdx=i;}
  });
  gwTarget=bestIdx; gwEliminated=new Set(); gwUsedQs=new Set(); gwGuessing=false;
  renderBoard(); renderQuestions();
  $('gw-status').textContent=`${12-gwEliminated.size} suspects remain. Ask questions to narrow it down.`;
  $('gw-final-guess').classList.add('hidden');
  $('gw-continue').classList.add('hidden');
  $('gw-final-guess').onclick=()=>startFinalGuess();
  $('gw-continue').onclick=()=>{ switchScreen('screen-phase6','screen-final'); document.body.className='phase-theme-5'; initFinal(); };
}

function renderBoard(){
  const board=$('gw-board'); board.innerHTML='';
  GW_SUSPECTS.forEach((s,i)=>{
    const card=document.createElement('div');
    card.className='gw-card'+(gwEliminated.has(i)?' eliminated':'');
    card.innerHTML=`<div class="gw-card-icon">${s.icon}</div><div class="gw-card-name">${s.name}</div><div class="gw-card-trait">${s.traits.join(' · ')}</div><div class="gw-card-trait">${s.value}</div>`;
    card.addEventListener('click',()=>{
      if(gwGuessing){
        // Final guess mode
        revealGuess(i);
      } else {
        // Eliminate mode
        if(gwEliminated.has(i)){gwEliminated.delete(i);} else {gwEliminated.add(i);}
        renderBoard();
        const remaining=12-gwEliminated.size;
        $('gw-status').textContent=`${remaining} suspect${remaining!==1?'s':''} remain${remaining===1?'s':''}.`;
        if(remaining<=3) $('gw-final-guess').classList.remove('hidden');
      }
    });
    board.appendChild(card);
  });
}

function renderQuestions(){
  const bar=$('gw-question-bar'); bar.innerHTML='';
  GW_QUESTIONS.forEach((q,i)=>{
    const btn=document.createElement('button');
    btn.className='gw-q-btn'+(gwUsedQs.has(i)?' used':'');
    btn.textContent=q.q;
    btn.addEventListener('click',()=>{
      if(gwUsedQs.has(i))return;
      gwUsedQs.add(i);
      // Answer based on player's ACTUAL vectors
      const mx=Math.max(1,...Object.values(state.vectors).map(Math.abs));
      const norm={}; for(const k in state.vectors) norm[k]=((state.vectors[k]/mx)*50)+50;
      const answer=q.check(norm);
      $('gw-answer-box').innerHTML=`<div class="gw-answer">${answer?'Yes':'No'} — <em>${answer?q.trait+' aligns':q.anti+' is closer'}</em></div>`;
      btn.classList.add('used');
      // Auto-suggest: highlight suspects that match
      $('gw-status').textContent=`${12-gwEliminated.size} suspects remain. Click cards to eliminate them based on the answer.`;
    });
    bar.appendChild(btn);
  });
}

function startFinalGuess(){
  gwGuessing=true;
  $('gw-answer-box').innerHTML='<div class="gw-answer">Click on the suspect you think is the real identity!</div>';
  $('gw-final-guess').classList.add('hidden');
  $('gw-status').textContent='Make your final guess...';
}

function revealGuess(idx){
  gwGuessing=false;
  const correct=idx===gwTarget;
  const target=GW_SUSPECTS[gwTarget];
  // Highlight the correct card
  const cards=$('gw-board').querySelectorAll('.gw-card');
  cards[gwTarget].classList.add('target-reveal');
  if(correct){
    $('gw-answer-box').innerHTML=`<div class="gw-answer">🎉 Correct! The identity was <strong>${target.name}</strong> — ${target.traits.join(', ')}, driven by ${target.value}.</div>`;
  } else {
    $('gw-answer-box').innerHTML=`<div class="gw-answer">Not quite! You guessed <strong>${GW_SUSPECTS[idx].name}</strong>, but the real identity was <strong>${target.name}</strong> — ${target.traits.join(', ')}, driven by ${target.value}.</div>`;
  }
  $('gw-status').textContent=correct?'Identity found! You understood the pattern.':'The self is harder to pin down than we think.';
  $('gw-continue').classList.remove('hidden');
}

// ---- FINAL ----
function initFinal() {
  const sil = $('final-silhouette'); sil.innerHTML = ''; sil.appendChild(createGlowSilhouette('#c9b8ff', 0.6));
  $('final-message').querySelector('.final-narrator').textContent = `"There is no single '${state.name || 'you'}.' You are a shifting constellation of choices, contexts, and stories."`;
  $('philosophical-quotes').innerHTML = [...PHILOSOPHICAL_QUOTES].sort(() => Math.random() - 0.5).slice(0, 4).map((q, i) => `<div class="phil-quote" style="animation-delay:${i * 0.3}s">${q.text}<span class="quote-source">${q.source}</span></div>`).join('');
}
