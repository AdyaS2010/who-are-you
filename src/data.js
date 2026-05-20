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

// ---- PHASE 2 SCENARIOS (expanded with environment keys) ----
export const PHASE2_SCENARIOS = [
  {
    env:'twilight',
    narrator:'"The world is quiet. A path stretches ahead. Let\'s see how you walk it."',
    text:'You\'re walking alone at dusk when you find a journal on a bench. Inside: someone\'s deepest fears, dreams, and secrets. No name. No way to return it.',
    choices:[
      {text:'Read it. Understanding someone\'s inner world — even a stranger\'s — feels important.',vectors:{curiosity:2,empathy:1,independence:1}},
      {text:'Leave it. Those thoughts were private. You have no right to them.',vectors:{empathy:1,logicalReasoning:1,conformity:1}},
      {text:'Take it with you. Maybe you\'ll find the owner. Maybe you\'ll learn something.',vectors:{curiosity:1,riskTolerance:1,empathy:1}}
    ]
  },
  {
    env:'urban',
    narrator:'"Comfort or truth. Everyone has a preference — even if they deny it."',
    text:'A close friend has been living a lie — presenting a version of themselves that you know isn\'t real. Everyone else believes the performance. Your friend seems happier this way.',
    choices:[
      {text:'Say nothing. If the mask brings them peace, who are you to remove it?',vectors:{empathy:1,conformity:1,emotionalReasoning:1}},
      {text:'Gently confront them. Living as a fiction is its own kind of prison.',vectors:{independence:1,empathy:1,curiosity:1}},
      {text:'Ask yourself first: are you sure their "real self" is more valid than the one they chose?',vectors:{curiosity:2,logicalReasoning:1}}
    ]
  },
  {
    env:'crossroads',
    narrator:'"Loyalty or independence. Which one do you reach for first?"',
    text:'Everyone in your community has adopted a belief you find deeply wrong. Speaking up would make you an outcast. Staying silent feels like betrayal — of yourself.',
    choices:[
      {text:'Speak. Integrity isn\'t negotiable, even when it\'s lonely.',vectors:{independence:2,conformity:-2,riskTolerance:1}},
      {text:'Stay silent for now. Change happens slowly, from within.',vectors:{conformity:1,logicalReasoning:1,empathy:1}},
      {text:'Find even one person who agrees. Rebellion doesn\'t have to be solo.',vectors:{empathy:1,curiosity:1,independence:1}}
    ]
  },
  {
    env:'storm',
    narrator:'"Logic or emotion — which one leads when the stakes are real?"',
    text:'A stranger collapses on the street. You\'re late for the most important moment of your career — an opportunity that will never come again. No one else is stopping.',
    choices:[
      {text:'Stop. A human life outweighs any opportunity. Always.',vectors:{empathy:2,emotionalReasoning:1,riskTolerance:1}},
      {text:'Keep walking. You can\'t save everyone, and this moment defines your future.',vectors:{logicalReasoning:2,ambition:1,empathy:-1}},
      {text:'Call for help as you walk. Do what you can without sacrificing everything.',vectors:{logicalReasoning:1,empathy:1,curiosity:1}}
    ]
  },
  {
    env:'twilight',
    narrator:'"This one cuts close. There\'s no safe answer."',
    text:'You can live one of two lives: a life where you achieve everything but no one truly knows you, or a life where you achieve nothing but are deeply, unconditionally known and loved.',
    choices:[
      {text:'Achievement. My legacy is what I leave behind — connection fades.',vectors:{independence:2,ambition:2,empathy:-1}},
      {text:'Connection. Being known is the whole point of being alive.',vectors:{empathy:2,emotionalReasoning:1,independence:-1}},
      {text:'Neither. I refuse a world where these are mutually exclusive.',vectors:{curiosity:1,independence:1,riskTolerance:1}}
    ]
  },
  {
    env:'forest',
    narrator:'"You carry more than you realize. Let\'s see what you set down — and what you hold onto."',
    text:'You discover you have the power to forget one painful memory permanently. The pain shaped you, taught you something, but it still hurts. Every day.',
    choices:[
      {text:'Forget it. The lesson is learned. The pain serves no further purpose.',vectors:{logicalReasoning:1,riskTolerance:1,independence:1}},
      {text:'Keep it. Pain is part of me. Erasing it would erase who I became because of it.',vectors:{empathy:1,emotionalReasoning:2,curiosity:1}},
      {text:'Keep the lesson, forget the feeling. If that\'s possible.',vectors:{logicalReasoning:1,curiosity:1,empathy:1}}
    ]
  },
  {
    env:'urban',
    narrator:'"Who you protect reveals who you are."',
    text:'A child asks you: "Is the world a good place?" You know the honest answer is complicated. The child is looking at you with complete trust.',
    choices:[
      {text:'"Yes. And it needs good people like you to keep it that way."',vectors:{empathy:2,emotionalReasoning:1,conformity:1}},
      {text:'"It\'s complicated. But that means you get to help decide what it becomes."',vectors:{curiosity:1,logicalReasoning:1,empathy:1}},
      {text:'"Sometimes. And when it isn\'t, that\'s when we matter most."',vectors:{independence:1,emotionalReasoning:1,riskTolerance:1}}
    ]
  }
];

// ---- WORLDS ----
export const WORLDS = [
  {name:'The Iron Republic',description:'A society built on absolute order. Rules are everything. Deviation is punished. Safety is guaranteed — at the cost of freedom.',type:'strict',env:'iron',
    narrator:'"Welcome to a world that values structure above all else. Your freedom has been traded for security. Let\'s see if you bend — or break."'},
  {name:'The Unbound',description:'A world with no rules, no structure, no safety net. Everyone is free. Everyone is alone.',type:'chaotic',env:'chaos',
    narrator:'"No rules. No one to catch you. No one to blame. Just you and infinite possibility — and infinite danger."'},
  {name:'The Collective',description:'A society where individuality dissolves. Everyone shares thoughts, resources, identity. The group is all.',type:'collectivist',env:'collective',
    narrator:'"Here, there is no \'you.\' Only \'us.\' Your thoughts belong to everyone. Does that comfort you — or terrify you?"'},
  {name:'The Mirror City',description:'A hyper-individualistic world where everything is competition. Your worth is measured by how different you are.',type:'individualistic',env:'mirror',
    narrator:'"In this world, being ordinary is the only sin. You must be unique — or be invisible."'}
];

export const SHIFT_SCENARIOS = {
  strict:[
    {text:'The Iron Republic demands you report a friend who broke a minor rule. If you don\'t, you both face punishment. The rule itself seems pointless — but the system doesn\'t care about your opinion.',
      choices:[
        {text:'Report them. The system works because everyone follows it.',vectors:{conformity:2,empathy:-1,logicalReasoning:1}},
        {text:'Refuse. Some bonds transcend systems.',vectors:{independence:2,empathy:1,riskTolerance:1}},
        {text:'Find a loophole. Protect them without technically breaking anything.',vectors:{curiosity:1,logicalReasoning:1,empathy:1}}
      ]},
    {text:'You\'re offered power — a position that could let you change the system from within. But holding it requires enforcing laws you find unjust. For now.',
      choices:[
        {text:'Take it. Change requires compromise. The long game matters more.',vectors:{ambition:2,logicalReasoning:1,conformity:1}},
        {text:'Refuse. Becoming what you oppose is not progress — it\'s surrender.',vectors:{independence:2,emotionalReasoning:1,riskTolerance:1}},
        {text:'Accept it and subvert quietly. Let them think you\'re compliant.',vectors:{curiosity:2,riskTolerance:1,independence:1}}
      ]},
    {text:'A citizen is being publicly punished for expressing an idea. The crowd watches in silence. You could intervene — but the last person who did disappeared.',
      choices:[
        {text:'Intervene. Some moments define who you are forever.',vectors:{independence:2,riskTolerance:2,empathy:1,conformity:-2}},
        {text:'Stay silent. You can\'t help anyone if you disappear too.',vectors:{logicalReasoning:2,conformity:1,empathy:-1}},
        {text:'Bear witness. Remember their face. Write it down later.',vectors:{curiosity:1,empathy:1,logicalReasoning:1}}
      ]}
  ],
  chaotic:[
    {text:'In The Unbound, someone steals your only food. You track them and find they\'re feeding a child. There is no law here. Only choices.',
      choices:[
        {text:'Let them keep it. The child\'s hunger matters more than yours.',vectors:{empathy:2,emotionalReasoning:1}},
        {text:'Take it back. You didn\'t choose to be a martyr.',vectors:{independence:2,riskTolerance:1,empathy:-1}},
        {text:'Share it. Set a boundary: "Next time, ask."',vectors:{empathy:1,logicalReasoning:1,curiosity:1}}
      ]},
    {text:'A group offers protection in exchange for absolute loyalty. Alone, you\'re vulnerable. With them, you survive — but lose your autonomy.',
      choices:[
        {text:'Join. Freedom means nothing if you\'re dead.',vectors:{conformity:2,logicalReasoning:1,independence:-1}},
        {text:'Stay alone. I\'d rather risk everything than belong to someone else.',vectors:{independence:2,riskTolerance:2}},
        {text:'Negotiate. "I\'ll contribute, but I won\'t surrender my judgment."',vectors:{curiosity:1,logicalReasoning:1,independence:1}}
      ]},
    {text:'You find a safe place — truly safe. But it\'s small, isolated, and nothing grows there. Beyond it: danger, but also possibility.',
      choices:[
        {text:'Stay. Safety is not nothing. It\'s everything.',vectors:{conformity:1,logicalReasoning:1,riskTolerance:-1}},
        {text:'Leave. A life without growth isn\'t really living.',vectors:{independence:2,riskTolerance:2,curiosity:1}},
        {text:'Fortify it. Make the safe place bigger. Bring others in.',vectors:{empathy:1,ambition:1,logicalReasoning:1}}
      ]}
  ],
  collectivist:[
    {text:'The Collective asks you to share your most private memory. Everyone shares. It\'s how connection works here. Refusal would mark you as... other.',
      choices:[
        {text:'Share it. If this is how they build trust, I\'ll try.',vectors:{conformity:1,empathy:1,emotionalReasoning:1}},
        {text:'Refuse. My inner world is the last thing that\'s truly mine.',vectors:{independence:2,riskTolerance:1,conformity:-1}},
        {text:'Share something meaningful, but not the deepest truth. Guard the core.',vectors:{curiosity:1,logicalReasoning:1,independence:1}}
      ]},
    {text:'A collective decision is being made that you believe is wrong. Your dissent would be visible to everyone — and deeply unwelcome.',
      choices:[
        {text:'Speak up. Even in unity, truth matters.',vectors:{independence:2,riskTolerance:1,conformity:-2}},
        {text:'Accept it. The group\'s harmony is more important than my opinion.',vectors:{conformity:2,empathy:1,independence:-1}},
        {text:'Privately find allies. Build consensus before going public.',vectors:{logicalReasoning:1,empathy:1,curiosity:1}}
      ]},
    {text:'You begin to forget where "you" end and "the group" begins. Your thoughts feel shared. Your emotions feel collective. It\'s peaceful... but something is fading.',
      choices:[
        {text:'Let it happen. Maybe the self was always an illusion.',vectors:{conformity:2,emotionalReasoning:1,empathy:1}},
        {text:'Fight it. I refuse to dissolve. I am someone.',vectors:{independence:2,riskTolerance:1,conformity:-2}},
        {text:'Observe it. Don\'t resist or surrender. Just watch what happens.',vectors:{curiosity:2,logicalReasoning:1}}
      ]}
  ],
  individualistic:[
    {text:'Your "unique" identity is trending. Thousands copy you. In The Mirror City, being copied means being erased.',
      choices:[
        {text:'Reinvent immediately. Stay ahead. Uniqueness is survival.',vectors:{ambition:2,independence:1,conformity:-1}},
        {text:'Let them. My identity isn\'t a brand to protect.',vectors:{empathy:1,emotionalReasoning:1,independence:1}},
        {text:'Question the game. Why is originality the only value here?',vectors:{curiosity:2,logicalReasoning:1}}
      ]},
    {text:'You meet someone almost identical to you. In this world, that makes one of you redundant. They suggest working together instead.',
      choices:[
        {text:'Compete. There can only be one original.',vectors:{ambition:2,independence:1,empathy:-1}},
        {text:'Collaborate. Together we become something neither of us could be alone.',vectors:{empathy:2,curiosity:1,conformity:1}},
        {text:'Walk away. I don\'t need to define myself against — or with — anyone.',vectors:{independence:2,emotionalReasoning:1}}
      ]},
    {text:'The Mirror City offers you fame — but only if you perform a version of yourself that isn\'t quite real. The audience loves the performance. You hate it.',
      choices:[
        {text:'Perform. The world only sees what you show it anyway.',vectors:{conformity:1,ambition:1,logicalReasoning:1}},
        {text:'Refuse. I\'d rather be invisible than be a lie.',vectors:{independence:2,riskTolerance:1,emotionalReasoning:1}},
        {text:'Perform — then slowly introduce the real version. Bait and switch.',vectors:{curiosity:2,riskTolerance:1,ambition:1}}
      ]}
  ]
};

// ---- PHASE 4: Glitch Scenarios ----
export const GLITCH_SCENARIOS = [
  {
    narrator:'"No name. No traits. No story. Just... you. If there is a you."',
    text:'You wake in absolute darkness. No memory. No name. Two voices echo: one whispers "safety," the other whispers "truth." You can only follow one. The darkness is patient.',
    choices:[
      {text:'Move toward safety. Even without memory, the body knows what it needs.',vectors:{conformity:1,emotionalReasoning:1}},
      {text:'Move toward truth. If I don\'t know who I am, knowing what\'s real is all I have.',vectors:{curiosity:2,independence:1}},
      {text:'Stay still. Wait. Listen to what the silence has to say.',vectors:{logicalReasoning:1,empathy:1}}
    ]
  },
  {
    narrator:'"Stripped of everything, what impulse survives?"',
    text:'Something is suffering nearby. You can feel it — a presence in pain. Moving toward it means moving further from any exit. There is no reward. No one will know. The only reason to help is that the pain exists.',
    choices:[
      {text:'Move toward it. Pain deserves witness, even in the dark.',vectors:{empathy:2,emotionalReasoning:1,riskTolerance:1}},
      {text:'Move toward the exit. Self-preservation isn\'t selfishness.',vectors:{logicalReasoning:1,independence:1,riskTolerance:-1}},
      {text:'Call out. Let whatever it is know: "You\'re not alone."',vectors:{empathy:1,curiosity:1}}
    ]
  },
  {
    narrator:'"The void has one last question."',
    text:'A mirror appears in the darkness. It doesn\'t show your face. It shows a feeling — warm, familiar, unmistakable. The feeling says: you have always been exactly this. Not your labels. Not your history. Just this quiet center. Do you believe it?',
    choices:[
      {text:'Yes. Something in me recognizes this as true.',vectors:{emotionalReasoning:2,empathy:1}},
      {text:'No. I am what I choose, not some predetermined essence.',vectors:{independence:2,logicalReasoning:1}},
      {text:'I don\'t know. And that honesty might be the most "me" answer of all.',vectors:{curiosity:2,empathy:1}}
    ]
  },
  {
    narrator:'"One more. From the deepest part of the void."',
    text:'You are offered the chance to be reborn as someone entirely new — different memories, different personality, different life. The catch: the current "you" ceases to exist entirely. No one remembers you. Not even you.',
    choices:[
      {text:'Accept. If I\'m more than my memories, then I\'ll survive the change.',vectors:{riskTolerance:2,curiosity:1,independence:1}},
      {text:'Refuse. I am my memories. Without them, "I" am nothing.',vectors:{emotionalReasoning:2,conformity:1}},
      {text:'Ask: "Would the new version of me be happy?" — and choose based on that.',vectors:{empathy:2,logicalReasoning:1}}
    ]
  }
];

// ---- Phase 6: Guess Questions ----
export const GUESS_QUESTIONS = [
  'How would this person react if they woke up and discovered their entire life was a simulation?',
  'If forced to choose: save a stranger or preserve an important personal truth?',
  'Would this person break a just law to help someone they love?',
  'Does this person trust their gut or their logic more?',
  'If they could know one absolute truth about the universe, would they choose to know — or stay wondering?',
  'In a group of strangers, would this person lead, observe, or leave?',
  'If their identity was completely erased, would they rebuild the same one — or start fresh?',
  'Does this person believe in a fixed core self, or that identity is always changing?'
];

// ---- Quotes ----
export const PHILOSOPHICAL_QUOTES = [
  {text:'"Trust thyself: every heart vibrates to that iron string."',source:'— Emerson, Self-Reliance'},
  {text:'"There is something it is like to be a conscious being — something it is like for the being itself."',source:'— Frank Jackson, Epiphenomenal Qualia'},
  {text:'"The life of man: solitary, poor, nasty, brutish, and short."',source:'— Thomas Hobbes, Leviathan'},
  {text:'"What I call \'the self\' is nothing but a bundle of perceptions."',source:'— David Hume, A Treatise of Human Nature'},
  {text:'"Have you ever had a dream that you were so sure was real?"',source:'— The Matrix (1999)'},
  {text:'"The unexamined life is not worth living."',source:'— Plato, Apology'},
  {text:'"Human nature is not a machine to be built after a model."',source:'— Stanford Encyclopedia of Philosophy'},
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
