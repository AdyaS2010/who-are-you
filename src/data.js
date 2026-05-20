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

// ---- CHARACTER ARCHETYPES ----
export const ARCHETYPES = [
  {
    id:'seeker', name:'The Seeker', title:'Wanderer of Questions',
    match: v => v.curiosity >= 2 && v.independence >= 1,
    backstory: `Born restless, the Seeker has never been satisfied with easy answers. They wander not because they are lost, but because they believe the journey itself is the destination. Every locked door is an invitation, every stranger a potential teacher. They carry a quiet fire — the kind that doesn't burn others, but lights the way forward into the unknown.`,
    stats: {openness:'High',resolve:'Moderate',attachment:'Low',intuition:'High'}
  },
  {
    id:'guardian', name:'The Guardian', title:'Shield of the Unseen',
    match: v => v.empathy >= 2 && v.emotionalReasoning >= 1,
    backstory: `The Guardian feels the world more deeply than most. They sense tension in a room before anyone speaks, and carry the weight of others' pain as if it were their own. Their strength isn't in force — it's in presence. They are the one who stays when everyone else leaves, the one who remembers what others forget. Their weakness? They sometimes forget to guard themselves.`,
    stats: {empathy:'Very High',resilience:'High',boundaries:'Low',perception:'High'}
  },
  {
    id:'architect', name:'The Architect', title:'Builder of Hidden Worlds',
    match: v => v.logicalReasoning >= 2 && v.ambition >= 1,
    backstory: `The Architect sees patterns where others see chaos. They build — not just things, but systems, ideas, futures. Every problem is a puzzle, every failure a data point. They move through life with a blueprint in their mind, always three steps ahead. But sometimes they forget that not everything worth building can be planned, and that the most beautiful structures are the ones that surprise their creator.`,
    stats: {strategy:'Very High',creativity:'High',spontaneity:'Low',focus:'Very High'}
  },
  {
    id:'rebel', name:'The Rebel', title:'Voice Against the Tide',
    match: v => v.independence >= 2 && v.conformity <= -1,
    backstory: `The Rebel doesn't break rules for the thrill — they break them because the rules were wrong. They carry a moral compass that doesn't point north, but points toward truth. Every institution is questioned, every authority challenged. They walk alone often, but when they find their people, the bond is fierce. Their gift is courage; their burden is isolation.`,
    stats: {conviction:'Very High',adaptability:'Moderate',conformity:'Very Low',courage:'Very High'}
  },
  {
    id:'mirror', name:'The Mirror', title:'Reflection of All Things',
    match: v => v.empathy >= 1 && v.conformity >= 1,
    backstory: `The Mirror becomes what they need to be. In a room full of strangers, they are everyone's friend. In conflict, they are the peacemaker. They absorb the world and reflect it back — transformed, softened, made beautiful. But late at night, alone, they sometimes wonder: if I am everyone's reflection, who am I when no one is looking? The question haunts them like a song they can't quite remember.`,
    stats: {adaptability:'Very High',empathy:'High',identity:'Fluid',perception:'Very High'}
  },
  {
    id:'flame', name:'The Flame', title:'Light That Cannot Be Contained',
    match: v => v.riskTolerance >= 2 && v.emotionalReasoning >= 1,
    backstory: `The Flame burns bright and unapologetically. They feel everything at full volume — joy is ecstasy, anger is a storm, love is a wildfire. They move through life with an intensity that draws people in and sometimes pushes them away. They are the first to leap, the first to speak, the first to feel. Their power is their passion; their risk is burnout. But even ashes can reignite.`,
    stats: {intensity:'Very High',passion:'Very High',stability:'Low',impact:'Very High'}
  },
  {
    id:'sage', name:'The Sage', title:'Keeper of Quiet Truths',
    match: v => v.logicalReasoning >= 1 && v.curiosity >= 1,
    backstory: `The Sage doesn't seek the spotlight — they seek understanding. While others argue, they listen. While others react, they observe. They carry a library in their mind and a stillness in their heart. People come to them for answers, but the Sage knows the best answer is usually another question. They are patient, deliberate, and sometimes mistaken for cold — when in truth, they simply feel at a frequency others can't hear.`,
    stats: {wisdom:'Very High',patience:'Very High',expressiveness:'Low',depth:'Very High'}
  },
  {
    id:'dreamer', name:'The Dreamer', title:'Architect of the Impossible',
    match: () => true, // default fallback
    backstory: `The Dreamer lives between worlds — the one that is, and the one that could be. They see beauty in broken things and possibility in dead ends. Their imagination is both their greatest gift and their deepest escape. They create not because they must, but because the world inside them is so vivid it demands to be shared. The question they carry: is the dream more real than the waking world?`,
    stats: {imagination:'Very High',grounding:'Low',vision:'Very High',sensitivity:'High'}
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

// ---- SUSPECTS FOR GUESS WHO (Associated with Philosophical Authors & Quotes) ----
export const GW_SUSPECTS = [
  {name:'The Scholar',icon:'📚',traits:['Analytical','Curious'],value:'Knowledge',fear:'Irrelevance',source:'Thomas Hobbes',quote:'"Order is the foundation of thought."',aesthetic:'Midnight'},
  {name:'The Guardian',icon:'🛡️',traits:['Loyal','Empathetic'],value:'Justice',fear:'Betrayal',source:'Thomas Hobbes',quote:'"We protect the collective peace."',aesthetic:'Storm'},
  {name:'The Rebel',icon:'⚡',traits:['Bold','Independent'],value:'Freedom',fear:'Confinement',source:'Ralph Waldo Emerson',quote:'"Whoso would be a man must be a nonconformist."',aesthetic:'Storm'},
  {name:'The Maverick',icon:'🔥',traits:['Passionate','Bold'],value:'Authenticity',fear:'Conformity',source:'Ralph Waldo Emerson',quote:'"To be yourself is the greatest accomplishment."',aesthetic:'Neon'},
  {name:'The Dreamer',icon:'🌙',traits:['Creative','Optimistic'],value:'Authenticity',fear:'Mediocrity',source:'Frank Jackson',quote:'"What is the feeling of color in the dark?"',aesthetic:'Sunrise'},
  {name:'The Empath',icon:'💜',traits:['Gentle','Empathetic'],value:'Compassion',fear:'Isolation',source:'Frank Jackson',quote:'"We experience the world, not just analyze it."',aesthetic:'Neon'},
  {name:'The Explorer',icon:'🧭',traits:['Curious','Spontaneous'],value:'Freedom',fear:'Stagnation',source:'David Hume',quote:'"We are bundles of perceptions in motion."',aesthetic:'Sunrise'},
  {name:'The Catalyst',icon:'✨',traits:['Confident','Adaptable'],value:'Growth',fear:'Stagnation',source:'David Hume',quote:'"Nothing is constant but change."',aesthetic:'Forest'},
  {name:'The Sage',icon:'🔮',traits:['Patient','Honest'],value:'Truth',fear:'Deception',source:'Thomas Hobbes',quote:'"Rules keep the chaos of nature at bay."',aesthetic:'Midnight'},
  {name:'The Strategist',icon:'♟️',traits:['Analytical','Ambitious'],value:'Knowledge',fear:'Failure',source:'David Hume',quote:'"Reason is, and ought only to be the slave of the passions."',aesthetic:'Ocean'},
  {name:'The Healer',icon:'🌿',traits:['Thoughtful','Resilient'],value:'Compassion',fear:'Helplessness',source:'Frank Jackson',quote:'"Pain and healing cannot be reduced to physical facts."',aesthetic:'Forest'},
  {name:'The Hermit',icon:'🛖',traits:['Independent','Patient'],value:'Truth',fear:'Conformity',source:'Ralph Waldo Emerson',quote:'"I walk alone to find what is true."',aesthetic:'Ocean'}
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

// ---- PHASE 6 BOARD GAME QUESTIONS ----
export const GUESS_QUESTIONS = [
  {q:'Are they a nonconformist (Independent/Bold)?',check:s=>s.traits.includes('Independent')||s.traits.includes('Bold'),field:'traits',label:'Nonconformist'},
  {q:'Do they value Knowledge or Truth above all?',check:s=>s.value==='Knowledge'||s.value==='Truth',field:'value',label:'Intellectual Value'},
  {q:'Do they fear Stagnation or Mediocrity?',check:s=>s.fear==='Stagnation'||s.fear==='Mediocrity',field:'fear',label:'Fear of Stagnation'},
  {q:'Are they an Empathetic or Loyal soul?',check:s=>s.traits.includes('Empathetic')||s.traits.includes('Loyal'),field:'traits',label:'Altruistic'},
  {q:'Do they seek Freedom or Autonomy?',check:s=>s.value==='Freedom',field:'value',label:'Freedom Seekers'},
  {q:'Do they fear isolation or being alone?',check:s=>s.fear==='Being alone'||s.fear==='Isolation',field:'fear',label:'Fear of Solitude'},
  {q:'Do they have a warm color aesthetic?',check:s=>['Sunrise','Neon','Storm'].includes(s.aesthetic),field:'aesthetic',label:'Warm Aesthetic'},
  {q:'Is their source Ralph Waldo Emerson?',check:s=>s.source==='Ralph Waldo Emerson',field:'source',label:'Emerson\'s Influence'},
  {q:'Is their source David Hume?',check:s=>s.source==='David Hume',field:'source',label:'Hume\'s Influence'},
  {q:'Is their source Thomas Hobbes?',check:s=>s.source==='Thomas Hobbes',field:'source',label:'Hobbes\' Influence'}
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
