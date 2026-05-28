# WHO // ARE // YOU?
## Final Presentation & Study Guide
*Prepare to ace your final project presentation and Q&A session.*

---

## 1. The 30-Second Elevator Pitch
> *"Our project, **WHO // ARE // YOU?**, is an interactive philosophical game that explores the question: **What remains of the human self when you strip away all external labels, memories, and social structures?** Instead of writing a dry essay, we built a 2D choice-based platformer that turns theories of personal identity into playable mechanics. Players define their initial 'Mask,' navigate moral choices that build an invisible profile, experience their identity glitching away in a void, and face a historical philosopher AI in a deductive card duel. Ultimately, the game acts as a mirror, showing that identity is not a static label, but an active process of self-authoring."*

---

## 2. The Core Question & Potential Answers
* **The Question:** *"Who are you at heart? If you lost your name, your memories, your relationships, and your physical form, would 'you' still exist?"*
* **Potential Answers (The Stances):**
  1. **The Essentialist View (Jackson & Emerson):** Yes. A private, irreducible inner consciousness (*qualia*) and the capacity for self-reliant choice remain.
  2. **The Social Construct View (Hobbes & Nelson):** No. The self is entirely constructed by social contracts, fear, and collective rules. Strip those away, and you return to raw animal survival.
  3. **The Bundle / No-Self View (Hume/Pike & Buddhism):** No. The self was an illusion to begin with. You are simply a shifting bundle of sensory impressions and thoughts with no permanent core.
  4. **The Continuity View (Locke & Olson):** Identity is a chain. As long as there is physical or psychological/memory continuity, you are the same person; break the chain, and the self is lost.

---

## 3. The 7 Sources Explained Simply

### 1. Ralph Waldo Emerson: *Self-Reliance* (1841)
* **His Stance:** Trust your inner voice. Nonconformity is key to finding the true self.
* **Key Quote:** *"Nothing is at last sacred but the integrity of your own mind."*
* **Game Connection:** Inspires **The Independent** archetype, who rejects the crowd to author their own path.

### 2. Thomas Hobbes: *Leviathan* (1651)
* **His Stance:** Without laws and society, humans live in a state of constant fear and war. The self is molded by the state's rules for survival.
* **Key Quote:** *"The life of man [is] solitary, poor, nasty, brutish, and short."*
* **Game Connection:** Inspires **The Citizen** archetype, who prioritizes security and social contracts over chaos.

### 3. Frank Jackson: *Epiphenomenal Qualia* (1982)
* **His Stance:** Subjective experience (what red *feels* like, or what pain *feels* like) cannot be explained by physical science alone.
* **Key Quote:** *"There is something it is like to be a conscious being..."*
* **Game Connection:** Inspires **The Experiencer** archetype, who holds that raw subjective consciousness remains even in a void.

### 4. Adrian D. Nelson: *Maslow's Matrix* (2014)
* **His Stance:** Explores the movie *The Matrix* as an allegory for self-actualization. To find your true self, you must unplug from simulated realities.
* **Key Quote:** *"Neo’s choice to unplug... represents the painful but necessary journey towards self-actualization."*
* **Game Connection:** Inspires **The Dreamer** archetype, who treats identity as a simulation that must be shattered.

### 5. Eric T. Olson: *Personal Identity* (2023)
* **His Stance:** Evaluates what makes us the "same person" over time (memory chain vs. biological continuity).
* **Key Quote:** *"The question of personal identity is the question of what it takes for a past or future person to be you."*
* **Game Connection:** Forms the foundation of **The Human** (biological/social) and **The Chronicler** (memory chain) archetypes.

### 6. Nelson Pike: *Hume's Bundle Theory* (1967)
* **His Stance:** Defends David Hume's view that there is no solid "soul" or "self." We are just a "bundle" of temporary thoughts and feelings.
* **Key Quote:** *"The self is nothing but a bundle or collection of different perceptions..."*
* **Game Connection:** Inspires **The Bundle** (flux of senses) and **The Illusion** (Buddhist void) archetypes.

### 7. Neil Roughley: *Human Nature* (2021)
* **His Stance:** Examines how human identity is shaped by a mix of biological boundaries and cultural environments.
* **Key Quote:** *"Any account of human nature must address both the biological boundaries and the cultural malleability of our species."*
* **Game Connection:** Informs the overall gameplay, where context (world type) shapes how the player behaves.

---

## 4. The Game Journey: Connecting Gameplay to Philosophy
The game is structured as a psychological experiment divided into 6 phases:

```
  Phase I: The Mask       --> Define your initial traits (Your Costume)
        │
  Phase II: The World     --> Run twilight tests (Hidden choices shape your vectors)
        │
  Phase III: The Shift    --> Experience pressures in a specialized environment
        │
  Phase IV: The Glitch    --> Names, titles, and platforms dissolve in the void
        │
  Phase V: The Mirror     --> Review your alignment graph (Self-Reflection)
        │
  Phase VI: The Trial     --> Duel a Philosopher AI using strategic abilities
```

* **The Metaphor of the Platformer:** The platforms represent our social frameworks. The glowing choice orbs represent the path of self-authoring. The unlock crystal represents the moments of awareness needed to see our path clearly.

---

## 5. Development & Mechanics: How it Works
Explain the technology simply to show organization and technical polish:
* **The Web Framework:** Built using HTML5, CSS3, and JavaScript, bundled with Vite. It runs smoothly on any local or web host.
* **Dynamic Physics:** Standard keyboard mapping (`A/D` or arrows to move, `Space` to jump). Features "coyote-time" (letting you jump a fraction of a second after leaving a ledge) and jump-buffering.
* **Synthesizer Engine:** Uses the browser's built-in **Web Audio API** to generate sound frequencies on the fly instead of playing static MP3s. Choosing different aesthetics adjusts the frequency and waves (e.g. Neon is a bright triangle wave; Midnight is a deep sine wave).
* **Philosopher AI Deduction:** In Phase VI, the AI opponent uses a binary search algorithm to analyze your answers and eliminate cards, simulating real-time human strategy.

---

## 6. How to Answer Presentation Questions (Q&A Prep)

### Q1: *"How does the game choose your starting character?"*
> **Answer:** *"We built a weighted compatibility system. Each starting choice—your traits, value, and fear—adds points to a compatibility index. The algorithm calculates the highest-matching archetype and reveals it as your initial 'Mask.'"*

### Q2: *"Why did you choose a retro 2D platformer instead of a film or slides?"*
> **Answer:** *"We chose this medium to explore Frank Jackson's concept of qualia. A slide presentation only gives you physical data. An interactive game gives you the raw, subjective experience of *making* decisions under pressure. The low-fidelity visuals are intentional: they strip away cosmetic distractions so you focus purely on the choices."*

### Q3: *"What is the main conclusion of your project?"*
> **Answer:** *"Our main conclusion is that identity is not a static noun to be found; it is an active verb. When you strip away all labels (Phase IV), what remains is raw consciousness and the freedom to choose. You are the author of your own identity."*

### Q4: *"If you had more time, what would you add or improve?"*
> **Answer:** *"We would expand the platformer environments to have more complex puzzles, and build a local database so players could compare their Mirror profiles with other students in real time."*
