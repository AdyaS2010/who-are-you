// ============================================
// WHO // ARE // YOU? — Expanded Game Data
// Character archetypes, deeper scenarios, worlds
// ============================================

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

// ---- CHARACTER ARCHETYPES (aligned with 7 Guess Who suspect characters) ----
export const ARCHETYPES = [
  {
    id: 'alex',
    name: 'Alex Mercer',
    title: 'The Label-Only Identity',
    backstory: 'You define yourself through your relationships, titles, and community. To you, labels are not chains - they are the very structure that gives you shape. Without them, there is nothing to identify.',
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
    name: 'Mira Lockwood',
    title: 'The Memory-Based Self',
    backstory: 'You are defined by the accumulation of your memories and experiences. To you, personal identity is a continuous chain of conscious recollection. If the thread of memory breaks, the self ceases to exist.',
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
    name: 'Riley Flux',
    title: 'The Flowing Stream',
    backstory: 'You believe there is no fixed, permanent "you." Instead, you are a shifting bundle of fleeting perceptions, experiences, and impulses. You embrace change and refuse to be pinned down.',
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
    name: 'Solara Vale',
    title: 'The Inner Qualia',
    backstory: 'You believe that even if every label, memory, and physical description is stripped away, a raw, private core of subjective consciousness remains. There is a fundamental "what it is like to be you" that can never be reduced or explained away.',
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
    name: 'Dylan Ward',
    title: 'The Social Contract',
    backstory: 'You view the self as fully constructed and molded by the social systems, laws, and pressures around you. Strip away society\'s scaffolding, and you are left only with raw survival instincts.',
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
    name: 'Axel Mirage',
    title: 'The Glitched Mind',
    backstory: 'You question the reality of the self itself, viewing it as a sophisticated mental illusion or simulation constructed by the brain to navigate existence. Break out of the illusion to discover who you truly are.',
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
    name: 'Skyler Drew',
    title: 'The Self-Author',
    backstory: 'You believe identity is an active choice, not a discovery. You are what you choose to become in each moment through your actions and radical nonconformity. You author your own path.',
    stats: { Autonomy: 'Max', Willpower: 'Very High', Adaptability: 'High' },
    score: (v, s) => {
      let pt = 0;
      if (s.coreValue === 'Growth' || s.coreValue === 'Love') pt += 3;
      if (s.aesthetic === 'Forest') pt += 2;
      if (s.fear === 'Being forgotten') pt += 1.5;
      s.traits.forEach(t => { if (['Confident', 'Passionate', 'Bold', 'Determined'].includes(t)) pt += 1; });
      return pt + (v.independence || 0);
    }
  }
];

export const COMMONALITY_MESSAGES = [
  t => `"${t}" was also chosen by 34% of players.`,
  t => `${t}? That's the most popular choice today.`,
  t => `Interesting. 1 in 3 people pick "${t}" too.`,
  t => `"${t}" — shared by 12,847 other players.`
];

// ---- PHASE 2 SCENARIOS (Streamlined to 3) ----
export const PHASE2_SCENARIOS = [
  {
    env:'twilight',
    narrator:'"The world is quiet. A path stretches ahead. Let\'s see how you walk it."',
    text:'You find a journal on a bench. Inside: someone\'s deepest fears, dreams, and secrets. No name. No way to return it.',
    choices:[
      {text:'Read it. Understanding someone\'s inner world feels important.',vectors:{curiosity:2,empathy:1,independence:1}},
      {text:'Leave it. Those thoughts were private. You have no right to them.',vectors:{empathy:1,logicalReasoning:1,conformity:1}},
      {text:'Take it with you. Maybe you\'ll find the owner. Maybe you\'ll learn.',vectors:{curiosity:1,riskTolerance:1,empathy:1}}
    ]
  },
  {
    env:'urban',
    narrator:'"Comfort or truth. Everyone has a preference — even if they deny it."',
    text:'A close friend has been living a lie — presenting a version of themselves that you know isn\'t real. Everyone else believes the performance. They seem happier this way.',
    choices:[
      {text:'Say nothing. If the mask brings them peace, leave it be.',vectors:{empathy:1,conformity:1,emotionalReasoning:1}},
      {text:'Gently confront them. Living as a fiction is its own prison.',vectors:{independence:1,empathy:1,curiosity:1}},
      {text:'Ask: is the "real self" actually more valid than the chosen one?',vectors:{curiosity:2,logicalReasoning:1}}
    ]
  },
  {
    env:'crossroads',
    narrator:'"Loyalty or independence. Which one do you reach for first?"',
    text:'Everyone in your community has adopted a belief you find deeply wrong. Speaking up would make you an outcast. Staying silent feels like betrayal.',
    choices:[
      {text:'Speak. Integrity is not negotiable, even when it is lonely.',vectors:{independence:2,conformity:-2,riskTolerance:1}},
      {text:'Stay silent. Change happens slowly, from within.',vectors:{conformity:1,logicalReasoning:1,empathy:1}},
      {text:'Find others who agree. Rebellion does not have to be solo.',vectors:{empathy:1,curiosity:1,independence:1}}
    ]
  }
];

// ---- WORLDS ----
export const WORLDS = [
  {name:'The Iron Republic',description:'A society built on absolute order. Rules are everything. Safety is guaranteed — at the cost of freedom.',type:'strict',env:'iron',
    narrator:'"Welcome to a world that values structure above all else. Let\'s see if you bend — or break."'},
  {name:'The Unbound',description:'A world with no rules, no structure, no safety net. Everyone is free. Everyone is alone.',type:'chaotic',env:'chaos',
    narrator:'"No rules. No one to catch you. Just you and infinite possibility — and danger."'},
  {name:'The Collective',description:'A society where individuality dissolves. Everyone shares thoughts, resources, identity. The group is all.',type:'collectivist',env:'collective',
    narrator:'"Here, there is no \'you.\' Only \'us.\' Does that comfort you — or terrify you?"'},
  {name:'The Mirror City',description:'A hyper-individualistic world where worth is measured by how different you are.',type:'individualistic',env:'mirror',
    narrator:'"In this world, being ordinary is the only sin. You must be unique — or invisible."'}
];

// ---- PHASE 3 SCENARIOS (Streamlined to 2 per path) ----
export const SHIFT_SCENARIOS = {
  strict:[
    {text:'The Iron Republic demands you report a friend who broke a minor rule. If you don\'t, you both face punishment.',
      choices:[
        {text:'Report them. The system works because everyone follows it.',vectors:{conformity:2,empathy:-1,logicalReasoning:1}},
        {text:'Refuse. Some bonds transcend systems.',vectors:{independence:2,empathy:1,riskTolerance:1}},
        {text:'Find a loophole. Protect them without breaking rules.',vectors:{curiosity:1,logicalReasoning:1,empathy:1}}
      ]},
    {text:'You\'re offered power — a position that lets you change the system, but requires enforcing laws you find unjust for now.',
      choices:[
        {text:'Take it. Change requires compromise. The long game matters.',vectors:{ambition:2,logicalReasoning:1,conformity:1}},
        {text:'Refuse. Becoming what you oppose is surrender.',vectors:{independence:2,emotionalReasoning:1,riskTolerance:1}},
        {text:'Accept and subvert quietly. Let them think you comply.',vectors:{curiosity:2,riskTolerance:1,independence:1}}
      ]}
  ],
  chaotic:[
    {text:'In The Unbound, someone steals your only food. You track them and find they\'re feeding a child. There is no law here.',
      choices:[
        {text:'Let them keep it. The child\'s hunger matters more.',vectors:{empathy:2,emotionalReasoning:1}},
        {text:'Take it back. You didn\'t choose to be a martyr.',vectors:{independence:2,riskTolerance:1,empathy:-1}},
        {text:'Share it. Set a boundary: "Next time, ask first."',vectors:{empathy:1,logicalReasoning:1,curiosity:1}}
      ]},
    {text:'A group offers protection in exchange for absolute loyalty. Alone, you are vulnerable. With them, you lose your autonomy.',
      choices:[
        {text:'Join. Freedom means nothing if you\'re dead.',vectors:{conformity:2,logicalReasoning:1,independence:-1}},
        {text:'Stay alone. I\'d rather risk everything than surrender judgment.',vectors:{independence:2,riskTolerance:2}},
        {text:'Negotiate. "I\'ll contribute, but I won\'t surrender my mind."',vectors:{curiosity:1,logicalReasoning:1,independence:1}}
      ]}
  ],
  collectivist:[
    {text:'The Collective asks you to share your most private memory. Everyone shares. Refusal marks you as... other.',
      choices:[
        {text:'Share it. If this is how they build trust, I\'ll try.',vectors:{conformity:1,empathy:1,emotionalReasoning:1}},
        {text:'Refuse. My inner world is the last thing that is mine.',vectors:{independence:2,riskTolerance:1,conformity:-1}},
        {text:'Share something meaningful, but guard the deepest core.',vectors:{curiosity:1,logicalReasoning:1,independence:1}}
      ]},
    {text:'A collective decision is being made that you believe is wrong. Your dissent would be visible and deeply unwelcome.',
      choices:[
        {text:'Speak up. Even in unity, truth matters.',vectors:{independence:2,riskTolerance:1,conformity:-2}},
        {text:'Accept it. The group\'s harmony is more important than my opinion.',vectors:{conformity:2,empathy:1,independence:-1}},
        {text:'Privately find allies. Build consensus first.',vectors:{logicalReasoning:1,empathy:1,curiosity:1}}
      ]}
  ],
  individualistic:[
    {text:'Your "unique" identity is trending. Thousands copy you. In The Mirror City, being copied means being erased.',
      choices:[
        {text:'Reinvent immediately. Stay ahead. Uniqueness is survival.',vectors:{ambition:2,independence:1,conformity:-1}},
        {text:'Let them. My identity is not a brand to protect.',vectors:{empathy:1,emotionalReasoning:1,independence:1}},
        {text:'Question the game. Why is originality the only value?',vectors:{curiosity:2,logicalReasoning:1}}
      ]},
    {text:'You meet someone almost identical to you. In this world, that makes one of you redundant. They suggest collaborating.',
      choices:[
        {text:'Compete. There can only be one original.',vectors:{ambition:2,independence:1,empathy:-1}},
        {text:'Collaborate. Together we become more than we could alone.',vectors:{empathy:2,curiosity:1,conformity:1}},
        {text:'Walk away. I don\'t need to define myself against anyone.',vectors:{independence:2,emotionalReasoning:1}}
      ]}
  ]
};

// ---- PHASE 4 SCENARIOS (Streamlined to 2) ----
export const GLITCH_SCENARIOS = [
  {
    narrator:'"No name. No traits. No story. Just... you. If there is a you."',
    text:'You wake in absolute darkness. No memory. No name. Two voices echo: one whispers "safety," the other "truth."',
    choices:[
      {text:'Move toward safety. The body knows what it needs.',vectors:{conformity:1,emotionalReasoning:1}},
      {text:'Move toward truth. Knowing what is real is all I have.',vectors:{curiosity:2,independence:1}},
      {text:'Stay still. Listen to what the silence has to say.',vectors:{logicalReasoning:1,empathy:1}}
    ]
  },
  {
    narrator:'"Stripped of everything, what impulse survives?"',
    text:'Something is suffering in the dark nearby. Moving toward it means moving further from any exit. There is no reward.',
    choices:[
      {text:'Move toward it. Pain deserves witness, even in the dark.',vectors:{empathy:2,emotionalReasoning:1,riskTolerance:1}},
      {text:'Move toward the exit. Self-preservation isn\'t selfish.',vectors:{logicalReasoning:1,independence:1,riskTolerance:-1}},
      {text:'Call out. Let whatever it is know: "You\'re not alone."',vectors:{empathy:1,curiosity:1}}
    ]
  }
];

// ---- SUSPECTS FOR GUESS WHO (7 philosophy-linked characters) ----
export const GW_SUSPECTS = [
  {
    name: 'Alex Mercer',
    icon: '🏷️',
    theory: 'Label-Only Identity',
    traits: ['Analytical', 'Confident'],
    value: 'Community',
    fear: 'Being forgotten',
    aesthetic: 'Midnight',
    source: 'Olson / Personal Identity',
    belief: 'I am a student, a daughter, a friend. Remove the labels and there is nothing left to define.',
    response: '"Without my roles and relationships, there is simply nothing to identify. Labels are not limitations — they are the self."'
  },
  {
    name: 'Mira Lockwood',
    icon: '🧠',
    theory: 'Memory-Based Self',
    traits: ['Thoughtful', 'Patient'],
    value: 'Truth',
    fear: 'Losing loved ones',
    aesthetic: 'Ocean',
    source: 'Olson / Personal Identity',
    belief: 'I am the accumulation of everything I remember happening in my life. If I forget everything, I stop being me.',
    response: '"Memory is the thread that makes me continuous. Without it, I would be a stranger — even to myself."'
  },
  {
    name: 'Riley Flux',
    icon: '🌊',
    theory: 'Bundle Theory',
    traits: ['Spontaneous', 'Adaptable'],
    value: 'Freedom',
    fear: 'Being trapped',
    aesthetic: 'Storm',
    source: 'Pike / Hume Bundle Theory',
    belief: 'There is no "I" — only a collection of past experiences loosely strung together. I am always shifting.',
    response: '"Ask me who I am tomorrow and I will give you a different answer. There is no fixed point. Only flux."'
  },
  {
    name: 'Solara Vale',
    icon: '✨',
    theory: 'Essential Self',
    traits: ['Gentle', 'Resilient'],
    value: 'Authenticity',
    fear: 'Being misunderstood',
    aesthetic: 'Sunrise',
    source: 'Jackson / Epiphenomenal Qualia',
    belief: 'Even if everything is removed — labels, memories, roles — something still remains. A raw, private core.',
    response: '"There is something it is like to be me. That feeling cannot be taken away. It is what I am, at heart."'
  },
  {
    name: 'Dylan Ward',
    icon: '⚙️',
    theory: 'Society-Constructed Self',
    traits: ['Analytical', 'Independent'],
    value: 'Justice',
    fear: 'Losing control',
    aesthetic: 'Midnight',
    source: 'Hobbes / Leviathan',
    belief: 'Who I am is built entirely by society, fear, rules, and expectations. Remove the system and nothing remains.',
    response: '"Strip away society and you strip away me. Identity is not discovered — it is manufactured by the world around us."'
  },
  {
    name: 'Axel Mirage',
    icon: '🪞',
    theory: 'Illusion / Simulation',
    traits: ['Curious', 'Bold'],
    value: 'Knowledge',
    fear: 'Being ordinary',
    aesthetic: 'Neon',
    source: 'Nelson / Maslow\'s Matrix',
    belief: 'The self is a mental illusion created by the brain to construct a false sense of reality.',
    response: '"What if the you asking this question is itself the illusion? I cannot answer what remains — because nothing was ever really there."'
  },
  {
    name: 'Skyler Drew',
    icon: '🔥',
    theory: 'Self-Creator / Existential',
    traits: ['Confident', 'Passionate'],
    value: 'Growth',
    fear: 'Being forgotten',
    aesthetic: 'Forest',
    source: 'Emerson / Self-Reliance',
    belief: 'Identity is actively chosen, not discovered. I am what I choose to become in each moment.',
    response: '"I am not something to be found — I am something to be made. Every choice is an act of self-creation."'
  }
];

// ---- PHASE 6 BOARD GAME QUESTIONS (tailored to the 7 characters) ----
export const GUESS_QUESTIONS = [
  { q: 'Does this character believe a core self survives if everything is removed?', check: s => ['Solara Vale'].includes(s.name), field: 'theory', label: 'Essential Self' },
  { q: 'Is their identity defined primarily by social labels and roles?', check: s => ['Alex Mercer'].includes(s.name), field: 'theory', label: 'Label Identity' },
  { q: 'Do they believe identity is constructed by society and fear?', check: s => ['Dylan Ward'].includes(s.name), field: 'theory', label: 'Society-Constructed' },
  { q: 'Is their sense of self always shifting and inconsistent?', check: s => ['Riley Flux'].includes(s.name), field: 'theory', label: 'Bundle/Flux' },
  { q: 'Do they lead with memory as the foundation of who they are?', check: s => ['Mira Lockwood'].includes(s.name), field: 'theory', label: 'Memory-Based' },
  { q: 'Do they treat identity as something actively chosen, not inherited?', check: s => ['Skyler Drew'].includes(s.name), field: 'theory', label: 'Self-Creator' },
  { q: 'Do they believe the self is a mental illusion or simulation?', check: s => ['Axel Mirage'].includes(s.name), field: 'theory', label: 'Illusion Theory' },
  { q: 'Do they value Freedom or Growth above all else?', check: s => ['Freedom', 'Growth'].includes(s.value), field: 'value', label: 'Values Freedom/Growth' },
  { q: 'Are they Analytical or Confident in their personality?', check: s => s.traits.includes('Analytical') || s.traits.includes('Confident'), field: 'traits', label: 'Analytical/Confident' },
  { q: 'Is their aesthetic warm (Sunrise, Neon, Forest, Storm)?', check: s => ['Sunrise', 'Neon', 'Forest', 'Storm'].includes(s.aesthetic), field: 'aesthetic', label: 'Warm Aesthetic' }
];

// ---- STRATEGIC PLAYER ROLES ----
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

// ---- PHILOSOPHER AI OPPONENTS ----
export const PHILOSOPHERS = [
  {
    name: 'Thomas Hobbes',
    avatar: '🦁',
    school: 'Social Contract Theory / Leviathan',
    difficulty: 'Normal',
    intro: 'Human life in a state of nature is solitary, poor, nasty, brutish, and short. We require order. Let us see if your mind is structured enough to discover the truth.',
    dialogueAsk: [
      '"Do you value the security of the group over the chaos of independence?"',
      '"Is your logic governed by rules, or do you wander unchecked?"',
      '"Tell me, does your persona fear betrayal? It is the inevitable result of lawlessness."'
    ],
    defeat: 'A predictable result. Without structured rules, your deduction fell into chaos.',
    victory: 'Impressive. You have successfully structured your inquiry. Perhaps there is hope for order.'
  },
  {
    name: 'David Hume',
    avatar: '🌊',
    school: 'Empiricism / Bundle Theory',
    difficulty: 'Hard',
    intro: 'You search for a stable, permanent "self," but I see only a bundle of changing perceptions. If identity shifts like water, how can you locate me?',
    dialogueAsk: [
      '"Is your persona driven by constant change, or do they cling to a static core?"',
      '"Does your suspect lead with their feelings? All knowledge arises from raw impressions."',
      '"Do you fear stagnation? The mind must always be in motion."'
    ],
    defeat: 'The self you sought has slipped through your fingers. It was but a passing shadow of perceptions.',
    victory: 'Remarkable. You traced my bundle of perceptions despite their constant flow. You found me.'
  },
  {
    name: 'Ralph Waldo Emerson',
    avatar: '🌲',
    school: 'Transcendentalism / Self-Reliance',
    difficulty: 'Normal',
    intro: 'Do not follow where the path may lead. Go instead where there is no path and leave a trail. Trust yourself: can you find my independent spirit?',
    dialogueAsk: [
      '"Is your character a nonconformist, or do they follow the herd?"',
      '"Does your persona value freedom above all else? Confinement is the death of the soul."',
      '"Do you fear conforming to what society expects of you?"'
    ],
    defeat: 'You conformed too closely to obvious patterns. You must trust your own intuition next time.',
    victory: 'Splendid! You stood firm in your own judgment and found my hidden trail. You trusted yourself.'
  },
  {
    name: 'Frank Jackson',
    avatar: '👁️',
    school: 'Qualia / Physicalist Critique',
    difficulty: 'Easy',
    intro: 'A scientist could know every physical fact about red, yet still not know what it feels like to actually see it. Let us explore the subjective nature of identity.',
    dialogueAsk: [
      '"Does your character lead with empathy and raw feeling, or dry logical facts?"',
      '"Does your persona value the raw experience of love and compassion?"',
      '"Do you fear isolation? The feeling of being cut off from others\' subjective experiences is a heavy burden."'
    ],
    defeat: 'You relied too much on dry facts, forgetting the subjective feeling of the game.',
    victory: 'Wonderful. You understood that identity is lived and felt, not just measured. You found me.'
  }
];


// ---- QUOTES ----

export const PHILOSOPHICAL_QUOTES = [
  {text:'"Trust thyself: every heart vibrates to that iron string."',source:'— Emerson, Self-Reliance'},
  {text:'"There is something it is like to be a conscious being — something it is like for the being itself."',source:'— Frank Jackson, Epiphenomenal Qualia'},
  {text:'"The life of man: solitary, poor, nasty, brutish, and short."',source:'— Thomas Hobbes, Leviathan'},
  {text:'"What I call \'the self\' is nothing but a bundle of perceptions."',source:'— David Hume, A Treatise of Human Nature'},
  {text:'"Have you ever had a dream that you were so sure was real?"',source:'— The Matrix (1999)'},
  {text:'"The unexamined life is not worth living."',source:'— Plato, Apology'},
  {text:'"Human nature is not a machine to be built after a model."',source:'— John Stuart Mill, On Liberty'},
  {text:'"There is no single, unified self — only a constantly shifting stream of consciousness."',source:'— The No-Self Theory'}
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
