// basic game data stuff

export const TRAITS = [
  'Creative','Analytical','Empathetic','Ambitious','Curious',
  'Loyal','Independent','Optimistic','Cautious','Passionate',
  'Resilient','Honest','Adaptable','Confident','Patient',
  'Spontaneous','Thoughtful','Determined','Gentle','Bold'
];
export const INTERESTS = [
  'Music','Science','Art','Philosophy','Sports','Technology',
  'Nature','Literature','Film','Travel','Cooking','Politics',
  'History','Gaming','Fashion'
];
export const CORE_VALUES = ['Freedom','Justice','Knowledge','Love','Authenticity','Security','Community','Growth','Creativity','Truth'];
export const FEARS = ['Being forgotten','Losing control','Being alone','Being ordinary','Being misunderstood','Failing','Being trapped','Losing loved ones'];
export const AESTHETICS = [
  {name:'Midnight',icon:'🌙'},{name:'Sunrise',icon:'🌅'},{name:'Storm',icon:'⛈️'},
  {name:'Ocean',icon:'🌊'},{name:'Forest',icon:'🌿'},{name:'Neon',icon:'💜'}
];

// startup characters aligned with guess who
export const ARCHETYPES = [
  {
    id: 'alex',
    name: 'The Human',
    title: 'Social Node',
    backstory: 'You anchor your identity in social structures, relationships, and roles. Remove the names, roles, and community, and the self loses its frame.',
    stats: { Security: 'High', Roles: 'Max', Conformity: 'High' },
    score: (v, s) => {
      let pt = 0;
      if (s.coreValue === 'Community') pt += 3;
      if (s.aesthetic === 'Midnight') pt += 2;
      if (s.fear === 'Being forgotten') pt += 1.5;
      s.traits.forEach(t => { if (['Analytical', 'Confident', 'Loyal', 'Adaptable'].includes(t)) pt += 1; });
      return pt + (v.conformity || 0);
    }
  },
  {
    id: 'mira',
    name: 'The Chronicler',
    title: 'Continuous Memory',
    backstory: 'You believe identity is a chain of memories. If you cannot remember yesterday, you are a different person today. Consciousness is held together by recollection.',
    stats: { Continuity: 'Max', Reflection: 'High', Adaptability: 'Moderate' },
    score: (v, s) => {
      let pt = 0;
      if (s.coreValue === 'Truth') pt += 3;
      if (s.aesthetic === 'Ocean') pt += 2;
      if (s.fear === 'Losing loved ones') pt += 1.5;
      s.traits.forEach(t => { if (['Thoughtful', 'Patient', 'Creative', 'Cautious'].includes(t)) pt += 1; });
      return pt + (v.empathy || 0);
    }
  },
  {
    id: 'riley',
    name: 'The Bundle',
    title: 'Perceptual Flux',
    backstory: 'There is no fixed core. You are a bundle of sensations, thoughts, and moods passing through time. You change constantly and accept the flux.',
    stats: { Fluidity: 'Max', Consistency: 'Low', Spontaneity: 'Very High' },
    score: (v, s) => {
      let pt = 0;
      if (s.coreValue === 'Freedom') pt += 3;
      if (s.aesthetic === 'Storm') pt += 2;
      if (s.fear === 'Being trapped') pt += 1.5;
      s.traits.forEach(t => { if (['Spontaneous', 'Adaptable', 'Optimistic', 'Bold'].includes(t)) pt += 1; });
      return pt + (v.riskTolerance || 0);
    }
  },
  {
    id: 'solara',
    name: 'The Experiencer',
    title: 'Raw Qualia',
    backstory: 'Even if memory and roles vanish, raw subjective experience remains. There is a private, irreducible "what it is like to be you" at the center of consciousness.',
    stats: { InnerCore: 'Max', Subjectivity: 'High', Resilience: 'High' },
    score: (v, s) => {
      let pt = 0;
      if (s.coreValue === 'Authenticity') pt += 3;
      if (s.aesthetic === 'Sunrise') pt += 2;
      if (s.fear === 'Being misunderstood') pt += 1.5;
      s.traits.forEach(t => { if (['Gentle', 'Resilient', 'Honest', 'Thoughtful'].includes(t)) pt += 1; });
      return pt + (v.emotionalReasoning || 0);
    }
  },
  {
    id: 'dylan',
    name: 'The Citizen',
    title: 'Social Contract',
    backstory: 'The self is a product of social contracts, laws, and collective safety. Strip away the social framework, and you return to raw survival instinct.',
    stats: { Conformity: 'High', SystemReliance: 'Max', Autonomy: 'Moderate' },
    score: (v, s) => {
      let pt = 0;
      if (s.coreValue === 'Justice' || s.coreValue === 'Security') pt += 3;
      if (s.aesthetic === 'Midnight') pt += 1.5;
      if (s.fear === 'Losing control') pt += 1.5;
      s.traits.forEach(t => { if (['Analytical', 'Independent', 'Determined', 'Cautious'].includes(t)) pt += 1; });
      return pt + (v.logicalReasoning || 0);
    }
  },
  {
    id: 'axel',
    name: 'The Dreamer',
    title: 'Simulation',
    backstory: 'You treat the self as a mental projection, a simulation to help the mind interact with the world. Break the projection to see what is real.',
    stats: { Skepticism: 'Max', Perception: 'High', Grounding: 'Low' },
    score: (v, s) => {
      let pt = 0;
      if (s.coreValue === 'Knowledge' || s.coreValue === 'Creativity') pt += 3;
      if (s.aesthetic === 'Neon') pt += 2;
      if (s.fear === 'Being ordinary') pt += 1.5;
      s.traits.forEach(t => { if (['Curious', 'Bold', 'Creative', 'Passionate'].includes(t)) pt += 1; });
      return pt + (v.curiosity || 0);
    }
  },
  {
    id: 'skyler',
    name: 'The Independent',
    title: 'Self-Reliance',
    backstory: 'Identity is a series of self-reliant choices. You are not found; you are built in each moment through direct action.',
    stats: { Autonomy: 'Max', Willpower: 'Very High', Adaptability: 'High' },
    score: (v, s) => {
      let pt = 0;
      if (s.coreValue === 'Growth' || s.coreValue === 'Love') pt += 3;
      if (s.aesthetic === 'Forest') pt += 2;
      if (s.fear === 'Being forgotten') pt += 1.5;
      s.traits.forEach(t => { if (['Confident', 'Passionate', 'Bold', 'Determined'].includes(t)) pt += 1; });
      return pt + (v.independence || 0);
    }
  },
  {
    id: 'illusion',
    name: 'The Illusion',
    title: 'Shimmering Mirage',
    backstory: 'The self is a conceptual fiction. There is no observer, only observation; no thinker, only thoughts. You accept the void.',
    stats: { Dissolution: 'Max', Detachment: 'High', Realism: 'High' },
    score: (v, s) => {
      let pt = 0;
      if (s.coreValue === 'Truth') pt += 2.5;
      if (s.aesthetic === 'Midnight') pt += 2;
      if (s.fear === 'Being trapped') pt += 1.5;
      s.traits.forEach(t => { if (['Thoughtful', 'Curious', 'Patient'].includes(t)) pt += 1; });
      return pt + (v.curiosity || 0);
    }
  }
];

export const TRAIT_INSIGHTS = {
  Creative: 'You see your life as a canvas, refusing to accept that your identity is fixed. To you, selfhood is an active, ongoing creation.',
  Analytical: 'You look for the underlying rules of who you are, dissecting your thoughts rather than just feeling them.',
  Empathetic: 'Your boundary between "self" and "other" is fluid. You find parts of who you are reflected in the experiences of people around you.',
  Ambitious: 'You define yourself by what you can become, moving forward and shaping your future self through pure willpower.',
  Curious: 'You care more about asking questions than finding final, static answers. Your identity is a state of constant questioning.',
  Loyal: 'You anchor your sense of self in relationships, finding stability and purpose in the commitments you make to others.',
  Independent: 'You trust your own internal compass above all else, believing that a self must be self-authored to be real.',
  Optimistic: 'You build your identity around potential and hope, choosing to believe in growth even when the present feels heavy.',
  Cautious: 'You tread carefully, reflecting before you act, knowing that every choice leaves a permanent mark on who you are.',
  Passionate: 'You are driven by intensity, allowing your emotions to direct your path rather than cold, calculated logic.',
  Resilient: 'Your identity is forged through adversity; you are defined not by what breaks you, but by how you put yourself back together.',
  Honest: 'Honesty prioritizes transparency and alignment between your inner self and external actions.',
  Adaptable: 'You are comfortable shifting with your surroundings, recognizing that a fluid self is often the most resilient one.',
  Confident: 'You carry a quiet trust in your own value, refusing to let external validation define your core worth.',
  Patient: 'You understand that finding yourself takes time, allowing your identity to unfold slowly without forcing it into rigid boxes.',
  Spontaneous: 'You live in the immediate moment, viewing the self as a shifting stream of impulses rather than a rigid plan.',
  Thoughtful: 'You spend time in the quiet spaces of your own mind, constructing an identity built on deep, slow reflection.',
  Determined: 'You set your jaw against obstacles, finding that your true character is revealed when you refuse to back down.',
  Gentle: 'You treat the fragile, subjective world of consciousness with care, moving through the lives of others with quiet respect.',
  Bold: 'You assert your presence clearly, willing to stand out and challenge the world\'s expectations of who you should be.'
};

export const VALUE_INSIGHTS = {
  Freedom: 'You believe that a self only exists when it is free to choose. To you, constraint is a form of non-existence.',
  Justice: 'You view your identity through the lens of duty and fairness, believing that who we are is defined by how we treat others.',
  Knowledge: 'You search for objective truth, believing that to find the self, one must first understand the reality of the world.',
  Love: 'You define your existence through vulnerability and connection, believing we only become real in the eyes of someone else.',
  Authenticity: 'You refuse to wear the masks society hands you, searching for the raw, unpolished truth of who you are underneath.',
  Security: 'You value stability and order, believing that a safe foundation is required before a self can truly grow.',
  Community: 'You find your reflection in the group, believing that individuals are shaped by and responsible to the collective.',
  Growth: 'Growth means you view the self as a continuous, evolving journey of improvement.',
  Creativity: 'You find meaning in self-expression, believing that to live is to actively bring new things into the world.',
  Truth: 'You search for absolute clarity, refusing comforting illusions in favor of what is real, no matter how difficult.'
};

export const AESTHETIC_INSIGHTS = {
  Midnight: 'Your choice of Midnight reflects a quiet, introspective nature, comfortable in the shadow and mystery of the unknown.',
  Sunrise: 'Choosing Sunrise suggests a spirit oriented toward beginnings, warmth, and the hopeful potential of a new dawn.',
  Storm: 'A Storm aesthetic reveals that you find beauty in conflict, motion, and the electric energy of dramatic change.',
  Ocean: 'Your affinity for the Ocean points to a deep, fluid inner life, vast and comfortable with the slow pull of consciousness.',
  Forest: 'A Forest aesthetic points to an organic, grounded, and living connection to nature.',
  Neon: 'A Neon aesthetic signals a vibrant, expressive nature, comfortable in the artificial, electric pulse of modern life.'
};

// phase 2 choice stuff
export const PHASE2_SCENARIOS = [
  {
    env:'twilight',
    narrator:'"The world is quiet. A path stretches ahead. Let\'s see how you walk it."',
    text:'A blank book lies in a clearing. As you touch it, another person\'s complete memory of their first love floods your consciousness, feeling exactly as if it were your own. The memory is clear, but there is no owner\'s name.',
    choices:[
      {text:'Adopt the memory. If memory is what constructs a person\'s continuity, you are now partly them.',vectors:{empathy:2,curiosity:1}},
      {text:'Discard it. A memory is just an image; it cannot capture the raw, private qualia of who they actually are.',vectors:{logicalReasoning:1,independence:1}},
      {text:'Acknowledge it as just another transient perception in your shifting bundle of experiences.',vectors:{riskTolerance:1,curiosity:2}}
    ]
  },
  {
    env:'urban',
    narrator:'"Comfort or truth. Everyone has a preference, even if they deny it."',
    text:'In a society of performances, a friend adopts a synthetic, highly praised persona that completely overwrites their original behavior. They confess they feel happier playing this fabricated character.',
    choices:[
      {text:'Urge them to stop. An identity built on conforming to society\'s applause is a slow death of the true self.',vectors:{independence:2,conformity:-1}},
      {text:'Support the performance. If the social role maintains harmony and peace, the original self is a useless construct.',vectors:{conformity:2,empathy:1}},
      {text:'Observe it. Perhaps the original was also just a set of programming, and this new script is no less real.',vectors:{curiosity:2,logicalReasoning:1}}
    ]
  },
  {
    env:'crossroads',
    narrator:'"Loyalty or independence. Which one do you reach for first?"',
    text:'Your community adopts a collective consciousness algorithm that ensures perfect social order but suppresses all dissenting personal thoughts. You must decide whether to link your mind to it.',
    choices:[
      {text:'Refuse the link. You would rather suffer the isolation of the wilderness than surrender the autonomy of your thoughts.',vectors:{independence:2,conformity:-2,riskTolerance:1}},
      {text:'Submit to the link. Personal thoughts are a small price to pay to escape the brutal, chaotic state of nature.',vectors:{conformity:2,logicalReasoning:1,empathy:1}},
      {text:'Link partially. If the self is merely a shifting bundle of relations, then blending with the collective is simply expanding the bundle.',vectors:{curiosity:2,empathy:1}}
    ]
  }
];

// the cool worlds
export const WORLDS = [
  {name:'The Iron Republic',description:'A society built on absolute order. Rules are everything. Safety is guaranteed, at the cost of freedom.',type:'strict',env:'iron',
    narrator:'"Welcome to a world that values structure above all else. Let\'s see if you bend or break."'},
  {name:'The Unbound',description:'A world with no rules, no structure, no safety net. Everyone is free. Everyone is alone.',type:'chaotic',env:'chaos',
    narrator:'"No rules. No one to catch you. Just you and infinite possibility, and danger."'},
  {name:'The Collective',description:'A society where individuality dissolves. Everyone shares thoughts, resources, identity. The group is all.',type:'collectivist',env:'collective',
    narrator:'"Here, there is no \'you.\' Only \'us.\' Does that comfort you, or terrify you?"'},
  {name:'The Mirror City',description:'A hyper-individualistic world where worth is measured by how different you are.',type:'individualistic',env:'mirror',
    narrator:'"In this world, being ordinary is the only sin. You must be unique, or invisible."'}
];

// phase 3 shift choice stuff
export const SHIFT_SCENARIOS = {
  strict:[
    {text:'The Iron Republic\'s stability requires reporting a colleague who expressed private, unmonitored thoughts. Refusing to report them threatens the safety of the entire sector.',
      choices:[
        {text:'Report them. The social contract dictates that our very identities belong to the sovereign state that keeps us safe.',vectors:{conformity:2,logicalReasoning:1,empathy:-1}},
        {text:'Remain silent. There is an inner sanctuary of consciousness that no political authority can claim.',vectors:{independence:2,empathy:1,riskTolerance:1}},
        {text:'Engage in double-think. Report a fabricated infraction to satisfy the system while keeping their true thoughts secret.',vectors:{curiosity:1,logicalReasoning:1,empathy:1}}
      ]},
    {text:'You are offered a high seat of authority in the Republic, allowing you to eventually reform it, but you must first enforce its oppressive laws of mental containment.',
      choices:[
        {text:'Accept. True agency is exercised by manipulating the levers of power, not by standing outside in useless protest.',vectors:{ambition:2,logicalReasoning:2,conformity:1}},
        {text:'Decline. To enforce compliance is to destroy the very self-reliance that makes you human.',vectors:{independence:2,emotionalReasoning:1,riskTolerance:1}},
        {text:'Accept, but commit sabotage from within. Let your outer actions conform while your inner self rebels.',vectors:{curiosity:2,riskTolerance:2,independence:1}}
      ]}
  ],
  chaotic:[
    {text:'In the lawless expanse of The Unbound, an old man steals your water filter. You track him down and discover he is using it to sustain a group of dying refugees.',
      choices:[
        {text:'Leave it with them. Compassion is the primary raw impression of a shared humanity.',vectors:{empathy:2,emotionalReasoning:1}},
        {text:'Take it back. In the state of nature, your survival is your only true duty. Self-preservation is paramount.',vectors:{independence:2,riskTolerance:1,empathy:-1}},
        {text:'Dismantle the filter and share its parts. You must survive, but you cannot ignore the pain of others.',vectors:{logicalReasoning:1,empathy:1,curiosity:1}}
      ]},
    {text:'A ruthless militia offers you protection in The Unbound. In exchange, they demand you brand your flesh with their crest and execute their enemies on command.',
      choices:[
        {text:'Join. Autonomy is a luxury of the safe. Survival is the absolute foundation of any possible identity.',vectors:{conformity:2,logicalReasoning:1,independence:-2}},
        {text:'Refuse. Better to die in the wilderness as a self-governed soul than to live as a weapon for another\'s will.',vectors:{independence:2,riskTolerance:2}},
        {text:'Infiltrate them temporarily. Gain their protection while secretly plotting your escape to the next world.',vectors:{curiosity:2,logicalReasoning:1,independence:1}}
      ]}
  ],
  collectivist:[
    {text:'The Collective\'s neural grid requires you to merge your memories, dissolving all boundaries between your history and the group\'s history.',
      choices:[
        {text:'Merge fully. Personal memory is a wall of separation. In unity, we find a grander, collective self.',vectors:{conformity:2,empathy:2,emotionalReasoning:1}},
        {text:'Guard your memory. If memory continuity is the thread of personal identity, merging is suicide.',vectors:{independence:2,riskTolerance:1,conformity:-2}},
        {text:'Upload a superficial sequence. Protect your core qualia while presenting a compliant facade.',vectors:{curiosity:1,logicalReasoning:1,independence:1}}
      ]},
    {text:'The group mind decides to exile a damaged member whose erratic thoughts disrupt the harmony. Your neural dissent would immediately alert the Collective.',
      choices:[
        {text:'Dissent openly. The moral worth of a collective is measured by how it treats its most vulnerable parts.',vectors:{independence:2,riskTolerance:2,conformity:-2}},
        {text:'Acquiesce. The group\'s survival outweighs the suffering of a single, fragmented consciousness.',vectors:{conformity:2,empathy:1,independence:-1}},
        {text:'Quietly buffer the outcast\'s mind from the exile signal, working at the edges of the grid.',vectors:{logicalReasoning:1,empathy:1,curiosity:1}}
      ]}
  ],
  individualistic:[
    {text:'Your highly curated personal aesthetic is cloned by millions in The Mirror City, rendering your once-unique persona common and commercialized.',
      choices:[
        {text:'Reinvent yourself. Strip away the old style. Your identity is a state of constant, aggressive self-authoring.',vectors:{ambition:2,independence:2,conformity:-1}},
        {text:'Do nothing. The self is not a commodity or a performance; it is the quiet, private experience of being.',vectors:{empathy:1,emotionalReasoning:1,independence:1}},
        {text:'Abandon all aesthetics. Realize that searching for uniqueness is just another way of letting the crowd define you.',vectors:{curiosity:2,logicalReasoning:1}}
      ]},
    {text:'You encounter a clone of yourself with identical memories, physical form, and habits. The Mirror City\'s law dictates only one of you can hold your legal identity.',
      choices:[
        {text:'Duel. There can only be one original self; the copy is an existential threat to your existence.',vectors:{ambition:2,independence:1,empathy:-2}},
        {text:'Collaborate. The clone shares your subjective qualia. Together, you form a unique, expanded agency.',vectors:{empathy:2,curiosity:1,conformity:1}},
        {text:'Renounce the legal name and walk away. You do not need a state-sanctioned label to know who you are.',vectors:{independence:2,emotionalReasoning:1}}
      ]}
  ]
};

// phase 4 glitchy choice stuff
export const GLITCH_SCENARIOS = [
  {
    narrator:'"No name. No traits. No story. Just... you. If there is a you."',
    text:'Your memories are erased. Your name is gone. In the empty void, a voice asks: do you cling to the comfort of a defined role, or the cold truth of nothingness?',
    choices:[
      {text:'Cling to safety. Even a fabricated mask is better than the terror of absolute exposure.',vectors:{conformity:1,emotionalReasoning:1}},
      {text:'Embrace the void. The self was always an illusion, a temporary pattern of thoughts that has now scattered.',vectors:{curiosity:2,independence:1}},
      {text:'Listen to the silence. Even without names or thoughts, the raw feeling of existing remains.',vectors:{logicalReasoning:1,empathy:1}}
    ]
  },
  {
    narrator:'"Stripped of everything, what impulse survives?"',
    text:'A distant consciousness is crying out in agony within the void. Reaching it requires leaving your path toward the light of the exit, risking permanent deletion.',
    choices:[
      {text:'Navigate toward the cry. Subjective pain must be witnessed, even if it costs your own survival.',vectors:{empathy:2,emotionalReasoning:1,riskTolerance:1}},
      {text:'Move toward the exit. If you dissolve, you can help no one. Self-preservation is the only logical choice.',vectors:{logicalReasoning:2,independence:1,riskTolerance:-1}},
      {text:'Call out into the dark. Weave a temporary thread of voice to let them know a witness exists.',vectors:{empathy:1,curiosity:1}}
    ]
  }
];

// the sus cards sus cards
export const GW_SUSPECTS = [
  {
    name: 'The Human',
    icon: '🏷️',
    theory: 'Label-Only Identity',
    traits: ['Analytical', 'Confident'],
    value: 'Community',
    fear: 'Being forgotten',
    aesthetic: 'Midnight',
    source: 'Olson / Personal Identity',
    belief: 'I am a student, a daughter, a friend. Remove the labels and there is nothing left to define.',
    response: '"Without my roles and relationships, there is simply nothing to identify. Labels are not limitations, they are the self."'
  },
  {
    name: 'The Chronicler',
    icon: '🧠',
    theory: 'Memory-Based Self',
    traits: ['Thoughtful', 'Patient'],
    value: 'Truth',
    fear: 'Losing loved ones',
    aesthetic: 'Ocean',
    source: 'Locke / Memory Continuity',
    belief: 'I am the accumulation of everything I remember happening in my life. If I forget everything, I stop being me.',
    response: '"Memory is the thread that makes me continuous. Without it, I would be a stranger, even to myself."'
  },
  {
    name: 'The Bundle',
    icon: '🌊',
    theory: 'Bundle Theory',
    traits: ['Spontaneous', 'Adaptable'],
    value: 'Freedom',
    fear: 'Being trapped',
    aesthetic: 'Storm',
    source: 'Hume / Bundle Theory',
    belief: 'There is no "I", only a collection of past experiences loosely strung together. I am always shifting.',
    response: '"Ask me who I am tomorrow and I will give you a different answer. There is no fixed point. Only flux."'
  },
  {
    name: 'The Experiencer',
    icon: '✨',
    theory: 'Essential Self',
    traits: ['Gentle', 'Resilient'],
    value: 'Authenticity',
    fear: 'Being misunderstood',
    aesthetic: 'Sunrise',
    source: 'Jackson / Epiphenomenal Qualia',
    belief: 'Even if everything is removed: labels, memories, roles: something still remains. A raw, private core.',
    response: '"There is something it is like to be me. That feeling cannot be taken away. It is what I am, at heart."'
  },
  {
    name: 'The Citizen',
    icon: '⚙️',
    theory: 'Society-Constructed Self',
    traits: ['Analytical', 'Independent'],
    value: 'Justice',
    fear: 'Losing control',
    aesthetic: 'Midnight',
    source: 'Hobbes / Leviathan',
    belief: 'Who I am is built entirely by society, fear, rules, and expectations. Remove the system and nothing remains.',
    response: '"Strip away society and you strip away me. Identity is not discovered, it is manufactured by the world around us."'
  },
  {
    name: 'The Dreamer',
    icon: '🪞',
    theory: 'Illusion / Simulation',
    traits: ['Curious', 'Bold'],
    value: 'Knowledge',
    fear: 'Being ordinary',
    aesthetic: 'Neon',
    source: 'The Matrix / Simulated Self',
    belief: 'The self is a mental illusion created by the brain to construct a false sense of reality.',
    response: '"What if the you asking this question is itself the illusion? I cannot answer what remains, because nothing was ever really there."'
  },
  {
    name: 'The Independent',
    icon: '🔥',
    theory: 'Self-Creator / Existential',
    traits: ['Confident', 'Passionate'],
    value: 'Growth',
    fear: 'Being forgotten',
    aesthetic: 'Forest',
    source: 'Emerson / Self-Reliance',
    belief: 'Identity is actively chosen, not discovered. I am what I choose to become in each moment.',
    response: '"I am not something to be found, I am something to be made. Every choice is an act of self-creation."'
  },
  {
    name: 'The Illusion',
    icon: '🌀',
    theory: 'No-Self Theory',
    traits: ['Thoughtful', 'Curious'],
    value: 'Truth',
    fear: 'Being trapped',
    aesthetic: 'Midnight',
    source: 'Buddhism / No-Self',
    belief: 'There is no fixed subject of experience, no permanent soul. The self is a convenient fiction.',
    response: '"Look closely: there is no observer, only observation. The self is an illusion constructed by thought."'
  }
];

// questions for the board
export const GUESS_QUESTIONS = [
  { q: 'Does this character believe a core self survives if everything is removed?', check: s => ['The Experiencer'].includes(s.name), field: 'theory', label: 'Essential Self' },
  { q: 'Is their identity defined primarily by social labels and roles?', check: s => ['The Human'].includes(s.name), field: 'theory', label: 'Label Identity' },
  { q: 'Do they believe identity is constructed by society and fear?', check: s => ['The Citizen'].includes(s.name), field: 'theory', label: 'Society-Constructed' },
  { q: 'Is their sense of self always shifting and inconsistent?', check: s => ['The Bundle'].includes(s.name), field: 'theory', label: 'Bundle/Flux' },
  { q: 'Do they lead with memory as the foundation of who they are?', check: s => ['The Chronicler'].includes(s.name), field: 'theory', label: 'Memory-Based' },
  { q: 'Do they treat identity as something actively chosen, not inherited?', check: s => ['The Independent'].includes(s.name), field: 'theory', label: 'Self-Creator' },
  { q: 'Do they believe the self is a mental illusion or simulation?', check: s => ['The Dreamer'].includes(s.name), field: 'theory', label: 'Illusion Theory' },
  { q: 'Do they believe the self is a complete illusion with no underlying entity?', check: s => ['The Illusion'].includes(s.name), field: 'theory', label: 'No-Self' },
  { q: 'Do they value Freedom or Growth above all else?', check: s => ['Freedom', 'Growth'].includes(s.value), field: 'value', label: 'Values Freedom/Growth' },
  { q: 'Are they Analytical or Confident in their personality?', check: s => s.traits.includes('Analytical') || s.traits.includes('Confident'), field: 'traits', label: 'Analytical/Confident' },
  { q: 'Is their aesthetic warm (Sunrise, Neon, Forest, Storm)?', check: s => ['Sunrise', 'Neon', 'Forest', 'Storm'].includes(s.aesthetic), field: 'aesthetic', label: 'Warm Aesthetic' }
];

// player powerups
export const ROLES = [
  {
    name: 'Rationalist (Hobbes)',
    icon: '⚙️',
    description: 'Use strict deductive logic to instantly eliminate 2 incorrect suspects at the start of the game.',
    abilityId: 'rationalism'
  },
  {
    name: 'Empiricist (Hume)',
    icon: '🔍',
    description: 'Examine sensory impressions. Look at 1 card of the AI\'s eliminated suspects to see what questions they\'ve answered.',
    abilityId: 'empiricism'
  },
  {
    name: 'Existentialist (Emerson)',
    icon: '⚡',
    description: 'Trust your own path. Check whether the target card represents an Independent or Bold suspect.',
    abilityId: 'existentialism'
  },
  {
    name: 'Subjectivist (Jackson)',
    icon: '🎨',
    description: 'Sense raw feeling (qualia). Ask the AI if the target\'s aesthetic is warm (Sunrise, Neon, Storm) or cool (Midnight, Ocean, Forest).',
    abilityId: 'subjectivism'
  }
];

// robot brains
export const PHILOSOPHERS = [
  {
    name: 'Thomas Hobbes',
    avatar: '🦁',
    school: 'Social Contract Theory / Leviathan',
    difficulty: 'Normal',
    intro: 'Human life in a state of nature is solitary, poor, nasty, brutish, and short. We require order. Let us see if your mind is structured enough to discover the truth.',
    dialogueAsk: [
      '"In the state of nature, the life of man is \'solitary, poor, nasty, brutish, and short.\' Do you choose security under the sovereign, or do you cling to chaos?"',
      '"Is your character governed by rules? \'Covenants, without the sword, are but words and of no strength to secure a man at all.\'"',
      '"Does your persona seek protection under a unified social structure, or do they wander in the lawless wilderness?"'
    ],
    defeat: 'You let your thoughts run wild. Deductive failure.',
    victory: 'Clean deduction. You\'ve structured your search well.'
  },
  {
    name: 'David Hume',
    avatar: '🌊',
    school: 'Empiricism / Bundle Theory',
    difficulty: 'Hard',
    intro: 'You search for a stable, permanent "self," but I see only a bundle of changing perceptions. If identity shifts like water, how can you locate me?',
    dialogueAsk: [
      '"I venture to affirm that we are \'nothing but a bundle or collection of different perceptions, which succeed each other with an inconceivable rapidity.\' Does your character shift in this flow?"',
      '"Does your suspect lead with their feelings? All knowledge arises from raw impressions, \'fluid, unstable, and always in motion.\'"',
      '"Do you claim a permanent identity? The self is a convenient fiction—a theatre where perceptions make their appearance."',
      '"Does your persona believe in a unified self, or do they accept that there is no observer, only observation?"'
    ],
    defeat: 'You were looking for a solid core. I told you: there is only the flow.',
    victory: 'You managed to pin down the stream of perceptions. Well played.'
  },
  {
    name: 'Ralph Waldo Emerson',
    avatar: '🌲',
    school: 'Transcendentalism / Self-Reliance',
    difficulty: 'Normal',
    intro: 'Do not follow where the path may lead. Go instead where there is no path and leave a trail. Trust yourself: can you find my independent spirit?',
    dialogueAsk: [
      '"Remember: \'Trust thyself: every heart vibrates to that iron string.\' Does your character stand autonomous?"',
      '"To find yourself, \'whoso would be a man, must be a nonconformist.\' Does your suspect run with the herd or walk their own path?"',
      '"Does your character fear conforming? \'Nothing is at last sacred but the integrity of your own mind.\'"'
    ],
    defeat: 'You conformed too closely to obvious patterns. You must trust your own intuition next time.',
    victory: 'You conformed too closely to obvious patterns. You must trust your own intuition next time.'
  },
  {
    name: 'Frank Jackson',
    avatar: '👁️',
    school: 'Qualia / Physicalist Critique',
    difficulty: 'Easy',
    intro: 'A scientist could know every physical fact about red, yet still not know what it feels like to actually see it. Let us explore the subjective nature of identity.',
    dialogueAsk: [
      '"Mary knew all the physical facts about color, yet learned something new when she saw a red rose. What is the raw, subjective feel of your character?"',
      '"Does your persona value the raw experience of love and compassion? \'Physical information does not capture the qualitative character of experience.\'"',
      '"Is your character defined by raw, private consciousness? There is \'something it is like\' to be them that cannot be reduced to physical facts."'
    ],
    defeat: 'You gathered the facts but missed the feeling. A physicalist trap.',
    victory: 'You grasped the qualia. Not everything can be reduced to data.'
  }
];


// smart quotes

export const PHILOSOPHICAL_QUOTES = [
  {text:'"Trust thyself: every heart vibrates to that iron string."',source:'Emerson, Self-Reliance'},
  {text:'"There is something it is like to be a conscious being, something it is like for the being itself."',source:'Frank Jackson, Epiphenomenal Qualia'},
  {text:'"The life of man: solitary, poor, nasty, brutish, and short."',source:'Thomas Hobbes, Leviathan'},
  {text:'"What I call \'the self\' is nothing but a bundle of perceptions."',source:'David Hume, A Treatise of Human Nature'},
  {text:'"Have you ever had a dream that you were so sure was real?"',source:'The Matrix (1999)'},
  {text:'"The unexamined life is not worth living."',source:'Plato, Apology'},
  {text:'"Human nature is not a machine to be built after a model."',source:'John Stuart Mill, On Liberty'},
  {text:'"There is no single, unified self, only a constantly shifting stream of consciousness."',source:'The No-Self Theory'}
];

export const VECTOR_DESCRIPTIONS = {
  empathy:{label:'Empathy',low:'self-focused',high:'deeply attuned to others'},
  conformity:{label:'Conformity',low:'defiant of norms',high:'aligned with the group'},
  independence:{label:'Independence',low:'rooted in community',high:'fiercely autonomous'},
  curiosity:{label:'Curiosity',low:'content with the known',high:'driven to question everything'},
  emotionalReasoning:{label:'Emotional Reasoning',low:'logic-first',high:'guided by feeling'},
  logicalReasoning:{label:'Logical Reasoning',low:'instinct-driven',high:'analytical and systematic'},
  riskTolerance:{label:'Risk Tolerance',low:'cautious and careful',high:'bold and unafraid'},
  ambition:{label:'Ambition',low:'present-focused',high:'driven to achieve'}
};
