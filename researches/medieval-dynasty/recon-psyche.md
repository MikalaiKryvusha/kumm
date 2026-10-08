Recon — NPC psyche as numbers: established models and how games use them (2026-10-08)

Scope: which established models turn a person's psychological state into a few numbers that drive behaviour, judged by the owner's criterion, and how shipped games wire such numbers into mechanics. Input for the "Воля" (Will) module of epic 15 (`plans/15_EPIC_medieval_dynasty_living_world.md`, section «Психика»).

The owner's words this recon answers (chat, 2026-10-08):
- `[OWNER]` «У нпс должны быть базовые психологические показатели, как у людей, которые можно цифрой измерить» · «нпапуган, зол, сексуален, дружелюбен, подавлен, дружелюбен, агрресивен» · «Наверняка уже есть такие устоявшиеся системы, которые "отцифровывают" состояние психики человека с достаточной точностью приближения, но без чрезмерного переусложения».
- The selection criterion, said at the start of this recon (≈13:00): `[OWNER]` «нужна простая в использовании система, мощная, но простая, без переусложения, на простых показателях, формулах, механиках, но чтобы совокупность давала огромное разнообразие и покрытие человеческой психологии мотивации и поведения, достаточного для игры. чтобы это органично в код игры можно было интегрировать и в игровые механики» · «KISS + Окамм».

Already in the project and not repeated here: the decision layer (Utility AI, response curves, IAUS, "personality = weights", Sims smart objects, Radiant AI's lesson) — `D:\work\unliminiumProject\researches\04_game_ai_utility.md` (read-only neighbour corpus); Erenshor's personality type nice / tryhard / mean — `recon-erenshor.md`; Wayward Realms' "array of stats that drives everything" — `recon-wayward-realms.md`; the essence rule 11 "a trait lives only if something visible reads it" and rule 18 "short memory + one relationship number" — `essence.md`. In Medieval Dynasty itself: village mood exists only as aggregates (`LowMood_People`, kingdom `MoodModifier`, event `MoodyVillagers`) — `game-internals.md`.

Conventions:
- Quotes are verbatim. PDFs were read as text with `pdftotext`; where the PDF's own scan garbled a character, the value was cross-checked against a second source and the check is named.
- `[AI]` marks the agent's own conclusion.

---

## 1. PAD — three numbers for any affective state (Mehrabian & Russell)

**What it is.** Three nearly independent axes, each −1…+1:
- Pleasure: "how pleasant or unpleasant one feels about something" (https://en.wikipedia.org/wiki/PAD_emotional_state_model).
- Arousal: "how energized or soporific one feels" (same).
- Dominance: how controlling or controlled a person feels (same; the page says it in paraphrase).

**Why it matters for the owner's list.** One axis separates fear from anger, which share valence and arousal: "anger is a dominant emotion, while fear is a submissive emotion" (Wikipedia, same page). Mehrabian 1996 gives the classic placements: "Excitement, elation, or jubilation, for instance, consist of pleasure, high arousal, and dominance: loneliness and depression consist of displeasure, low arousal, and submissiveness. Anxiety, pain, and discomfort involve displeasure, high arousal, and submissiveness, whereas anger and hostility include displeasure, high arousal, and dominance." (Mehrabian, A. "Analysis of the Big-five Personality Factors in Terms of the PAD Temperament Model", Australian Journal of Psychology 48(2), 1996, pp. 86–87; https://www.cs.uky.edu/~sgware/reading/papers/mehrabian1996analysis.pdf).

**State vs trait — the same three axes twice.** "He defined emotional traits or temperament as characteristic individual emotional predispositions that could be assessed, for example, by averaging an individual's emotional states across a representative sample of everyday situations." (Mehrabian 1996, p. 86). So a character's temperament is simply its resting PAD point; its current mood is a PAD point that drifts around it.

## 2. ALMA — emotions → mood → personality on the PAD space (Gebhard, AAMAS 2005)

Source: Gebhard, P. "ALMA — A Layered Model of Affect", AAMAS 2005 (text read from the PDF at https://cs.huji.ac.il/course/2005/aisemin/articles2006/docs/pa1a3_29.pdf). Project page: https://alma.dfki.de/ ("24 emotion types, 8 mood types, and 5 personality types").

**Three time scales.** "Emotions reflect short-term affect, which is usually bound to a specific event, action or object, which is the cause of this emotion. After its elicitation emotions usually decay and disappear of the individual's focus." Mood is medium-term; personality long-term.

**Mood octants (Table 1).** "+P+A+D Exuberant · +P+A-D Dependent · +P-A+D Relaxed · +P-A-D Docile · -P-A-D Bored · -P-A+D Disdainful · -P+A-D Anxious · -P+A+D Hostile".
Strength without numbers: "We define the strength of a current mood by its distance to the zero point of the PAD mood space … we divide the longest distance into three parts and call them: slightly, moderate, and fully. If, for example, the mood of a person has the values: 0.25 pleasure, -0.18 arousal, 0.12 dominance, its discrete mood description is slightly relaxed."

**Default mood from the Big Five.** Quoted as printed:
```
Pleasure  := 0.21·Extraversion + 0.59·Agreeableness + 0.19·Neuroticism
Arousal   := 0.15·Openness + 0.30·Agreeableness − 0.57·Neuroticism
Dominance := 0.25·Openness + 0.17·Conscientiousness + 0.60·Extraversion − 0.32·Agreeableness
```
(the AffectML config in the same paper: `<ArousalRelation open="0.15" agree="0.30" neur="-0.57"/>`, `<PleasureRelation extra="0.21" agree="0.59" neur="0.19"/>`).

⚠️ **Trap — the fifth term is emotional STABILITY, not neuroticism.** With "Neuroticism" as printed, a more neurotic person gets MORE pleasure and LESS arousal — the opposite of the source psychology. Mehrabian's own regression for the factor: "Emotional Stability = 0.50P − 0.55A" (equation 4 of Mehrabian 1996; read through the reproduction in Barteneva, Lau, Reis, arXiv 0809.4784, https://arxiv.org/pdf/0809.4784, because the 1996 scan garbles the digits), and the 1996 abstract: "Emotional stability involved almost equal degrees of pleasant and unarousable characteristics". So the signs of the 0.19 and −0.57 terms fit stability (= 1 − neuroticism on a 0…1 scale, or −N on −1…+1). `[AI]` Use `S = −N` in any port of these formulas. Note also that Mehrabian regressed the Big Five ON PAD (`Extraversion = .29P + .59D`, equation 1C); the PAD-from-Big-Five direction ALMA uses is a convenience mapping, good enough for a game's resting point, not a law.

**OCC emotions as PAD points (Table 2, selected rows; P · A · D → octant).**

| Emotion | P | A | D | Octant |
|---|---|---|---|---|
| Anger | −0.51 | 0.59 | 0.25 | Hostile |
| Hate | −0.6 | 0.6 | 0.3 | Hostile |
| Fear | −0.64 | 0.60 | −0.43 | Anxious |
| FearsConfirmed | −0.5 | −0.3 | −0.7 | Bored |
| Distress | −0.4 | −0.2 | −0.5 | Bored |
| Disappointment | −0.3 | 0.1 | −0.4 | Anxious |
| Shame | −0.3 | 0.1 | −0.6 | Anxious |
| Reproach | −0.3 | −0.1 | 0.4 | Disdainful |
| Joy | 0.4 | 0.2 | 0.1 | Exuberant |
| Love | 0.3 | 0.1 | 0.2 | Exuberant |
| Gratitude | 0.4 | 0.2 | −0.3 | Dependent |
| Pride | 0.4 | 0.3 | 0.3 | Exuberant |
| Relief | 0.2 | −0.3 | 0.4 | Relaxed |
| Satisfaction | 0.3 | −0.2 | 0.4 | Relaxed |

(All 24 rows are in the paper; the two-column PDF interleaves them — rows above were re-paired in reading order and each one checked against its printed octant.)

**How emotions move mood — "pull and push".** "All active emotions are used as input of the pull and push mood change function. It first computes the virtual emotion center of all currently active emotions in the PAD space … If the current mood position is between the PAD space's zero point and the virtual emotion center, the current mood is attracted towards the virtual emotion center. This is called pull phase. If the current mood is beyond (or at) the virtual emotion center the current mood is pushed away, further into the current mood octant … The push phase realizes the concept that a person's mood gets more intense the more experiences the person make that are supporting this mood."
Return to rest: "the current mood has a tendency to slowly move back to the default mood … Currently this is 20 minutes." Emotion decay in their config: `<EmotionDecay time="20000" period="500" function="linear"/>` (20 s), usual mood change time "10 minutes".

**How it drives behaviour (their example).** "Sven is in a slightly hostile mood … Sven's mood causes him to give rare and rude answers. But the encouragement from Valerie makes him slightly exuberant, which results in the fact that Sven produces more and more friendly answers."

`[AI]` What ALMA gives the "Воля" module: one 3-number state per NPC (cheap to store and tick hourly), a resting point from personality, events as points that pull the state, decay back to rest, and eight named octants × three strengths = 24 readable labels for the tooltip, the chronicle and the rumour text. Real-time scale (20 s / 10 min / 20 min) was for a conversation; a world ticked by game hours stretches the same constants to game hours and days.

## 3. RimWorld — mood as a sum of timed "thoughts", breaks by threshold, opinion as one number

Sources: https://rimworldwiki.com/wiki/Mood · https://rimworldwiki.com/wiki/Mental_break · https://rimworldwiki.com/wiki/Thoughts · https://rimworldwiki.com/wiki/Social (community wiki, values from the game's XML defs).

**Mood = base + sum of thoughts.** "Mood as a percentage is calculated by adding the overall difference between positive and negative thoughts to the 'Base mood'." Base mood depends on difficulty (Peaceful 42 … Losing is Fun 22). The bar does not jump: the target "changes instantly. The Mood bar follows it gradually" — at most +12 per game hour rising, −8 per hour falling; frozen while asleep.

**A thought is a row of four numbers:** mood effect · expiry (days) · stack limit · stacking multiplier. Examples from the Thoughts page:

| Thought | Mood | Days | Stack | Mult. |
|---|---|---|---|---|
| Ate without table | −3 | 1 | 1 | — |
| Slept in the cold | −4 | 1 | 1 | — |
| Observed corpse | −4 | 0.5 | 3 | 0.5 |
| Ate raw food | −7 | 1 | 1 | — |
| Ate fine meal | +5 | 1 | 1 | — |
| Insulted | −5 | 2 | 10 | 0.9 |
| Rebuffed by <name> | −5 | 3 | 5 | 0.9 |
| Witnessed ally's death | −5 | 2 | 5 | 0.75 |
| My friend died | −10 | 20 | 5 | 0.75 (scaled by the relationship) |
| Got some lovin' | +8 | 3 | 10 | 0.6 |
| Attended party | +8 | 10 | 10 | 0.75 |
| Killed someone (Bloodlust only) | +12 | 4 | 5 | 0.75 |

Traits gate thoughts: "Ate without table" is "Nullified by the Ascetic trait"; "Killed someone" exists only for Bloodlust. That is how one table of events yields different people.

**Breaks — three thresholds, mean time between, weighted pick.** "Base minor break threshold is 35%. Major is 4/7 of the minor threshold (20%), and extreme is 1/7 of the minor threshold (5%)." MTB below the threshold: minor 4 days, major 0.8, extreme 0.5. Break types are drawn by weight, e.g. minor: Food binge 0.8, Sad wander 0.5, Hide in room 0.5, Insulting spree 0.5; major: Tantrum 0.333, Daze 1; extreme: Berserk 1, Fire starting spree 1, Murderous rage 1, Run wild 0.5, Given up and leaving 1. Traits move thresholds additively ("the minor break threshold is capped between 1% and 50%") and swap the menu (Pyromaniac: "Fire starting sprees replace the pawn's extreme breaks"; Teetotaler never drug-binges). After a break: "a 40-point Catharsis thought lasting 3 days" — the valve that stops a death spiral.

**Opinion — one number per ordered pair.** Rival "-100 to -20", acquaintance "-20 to 20", friend "20 to 100". Components: beauty (±20 per level, cap ±40), traits, interactions, relations. Interactions are weighted random picks with opinion memories: Chitchat +10, Deep talk +15 for 20 days (weight 0.075 × compatibility), Slight −5 / 20 days (0.02), Insult −15 / 20 days (0.007; "×2.3 for abrasive initiators"), Kind words +15 / 20 days (kind initiators only). Escalation: "Every insult has a 4 % chance of starting social fight, slights 0.5 %", multiplied by hunger, drink, Bloodlust (×4). Romance needs "a high-enough opinion".

`[AI]` What RimWorld proves: a single scalar mood built from a TABLE of timed events (data, not code), plus thresholds with mean-time-between rolls, gives years of emergent stories in a shipped hit — exactly the owner's "простые показатели, формулы … совокупность даёт разнообразие". Its two weaknesses for us: mood is one-dimensional (fear and anger are both "−", so it cannot say WHICH break or WHICH path) — PAD's dominance axis fixes that; and thoughts are colonist-centric (the player's base), while our world ticks hundreds of villagers off-screen — the table must be cheap to aggregate (sum of active rows, hourly).

## 4. The Sims — needs that decay, objects that advertise, personality that scales both

Sources: Forbus, K. & Wright, W. "Some notes on programming objects in The Sims" (Northwestern QRG course notes, 13 pp., https://www.qrg.northwestern.edu/papers/Files/Programming_Objects_in_The_Sims.pdf) — primary, co-written by the designer. The Sims Wiki pages "Personality" and "Emotion" (read as wikitext through `https://sims.fandom.com/api.php?action=parse&page=<P>&format=json&prop=wikitext`; the HTML page refuses automated readers with 402).

**The choice rule (primary).** "Sims (not under direct player control) choose what to do by selecting, from all of the possible behaviors in all of the objects, the behavior that maximizes their current happiness." The needs list in the notes: "energy, comfort, hunger, hygiene, bladder, room, social, fun, mood".

**Personality scales the advertisement linearly (primary).** "a toilet advertises to Bladder, in a range from 0 to 70 (set by the Min and Max boxes). If there is no variation by personality, the Max is used. If it does vary by personality, then the motive is scaled linearly according to the number of points for that aspect of the personality. For instance, the aquarium's Feed Fish interaction provides between 1 and 11 on Fun, depending on the Playful personality component. You'll notice that the personality list actually includes polar opposites for each trait (i.e., nice/grouchy, active/lazy, etc.) This is an intuitive way of handling a change of sign".

**Balance warning (primary).** "Creating addictive objects is relatively easy — give some object's behavior high advertisements along some dimension, and you'll see that behavior chosen over and over again … Early versions of the Joy Booth were so addictive that Sims would continue using it until they collapsed." And the designers' own suggestion for trust: "Skeptical Sims: Objects advertise, to be sure, but currently Sims have no way of knowing whether or not the experience was worth it … store all of the relevant variables … before executing a behavior, and comparing them afterwards … use this information to scale the advertisements". `[AI]` That is exactly our rumour-trust edge seen from the object side: a source that lied is believed less next time.

**Personality = five bipolar sliders 0–10 (Sims 1 and 2).** "split into 5 sections: niceness, neatness or cleanliness, outgoingness, activeness, and playfulness, using a scale zero-to-ten." The sliders act mostly THROUGH NEED DECAY RATES and thresholds, not through special code:
- "The social bar of outgoing Sims decays rapidly, as they desire social interaction" · shy: "a Sim's social bar decays more slowly".
- Neat: "their hygiene decays slower" · Sloppy: "their hygiene decays faster, though they seem to care less about it" and "may autonomously eat rotten food".
- Active: "lose energy slower than anyone … their hunger decays faster too" · Lazy: "Their energy motive is quick to decay … their hunger decays more slowly".
- Nice: "If a Sim with 5 nice points or more is insulted, they will usually cry, rather than insult back" · Grouchy: "more likely to initiate negative interactions … may come onto a residential lot to steal the newspaper or kick over the garbage can".

**Sims 4 emotion = argmax of summed moodlet strengths.** "Each moodlet corresponds to a certain emotion and has specific causes, strength values, and duration. To calculate the Sim's emotional state, the game adds up the strength value of all moodlets and the emotion with the highest total value takes precedence … In the case of a tie, the current emotion will generally be prioritized." Default with no moodlets: "Fine". Stages by total ("Most emotions have two stages, with a few having three"); extreme stages can kill ("Being enraged can cause death", "Being mortified can cause death"). Emotions gate the action menu: Angry "Sims tend to be more aggressive which decreases the relationship with other Sims … Anger prevents certain interactions while allowing some unique to the emotion"; remedies are ordinary objects ("A punching bag, a cold shower, kicking a garbage can").

`[AI]` What The Sims adds to the hybrid: (1) needs as decaying counters whose urgency is a curve, the world advertising what satisfies them — the right home for «сексуален», hunger, sleep, warmth, company; (2) personality acting through RATES and SCALES of existing numbers, so one slider changes rhythm and choice with zero new code; (3) emotion as "sum per bucket, highest wins, ties keep the current one" — a discrete label that is stable and cheap. Its weakness for us: built for a household under the player's eye, the needs set is domestic (bladder, room); a medieval world needs the outdoor set (food, water, sleep, warmth, safety, company, desire) and the economy's own sinks (essence E6).

## 5. Crusader Kings III — traits as weight vectors, stress from acting against yourself

Sources: https://ck3.paradoxwikis.com/Traits · https://ck3.paradoxwikis.com/Attributes (section "Stress", "Mental Breaks") — the official Paradox wiki, values from the game files.

**A trait is a vector added to a few AI numbers.** AI personality values (Boldness, Compassion, Greed, Energy, Honor, Rationality, Sociability, Vengefulness, Zeal) are sums over the character's traits, and "For AI characters, it also determines their behavior". Examples (Traits page):
- Brave: +200 Boldness, +20 Energy, +20 Sociability, −20 Rationality · Craven: −200 Boldness, −20 Energy, −20 Sociability, +10 Rationality
- Calm: +75 Rationality, −20 Boldness, −10 Energy, −10 Vengefulness · Wrathful: +35 Boldness, +20 Vengefulness, +10 Energy, −35 Rationality, −20 Compassion
- Vengeful: +200 Vengefulness … −20 Compassion · Forgiving: +35 Compassion, +20 Honor, +10 Rationality, −10 Energy, −200 Vengefulness
- Compassionate: +200 Compassion, +35 Honor, +35 Sociability, −20 Greed · Callous: −200 Compassion, −35 Honor · Sadistic: −200 Compassion, −75 Honor
- Greedy: +200 Greed, −10 Honor, −20 Compassion · Generous: −200 Greed, +35 Compassion, +20 Honor, +10 Sociability

Rules of composition: "Characters tend not to have more than 3 personality traits." "A character cannot have two opposing traits". Traits also feed opinion: Brave "+10 Same Trait Opinion, −10 Opposite Trait Opinion", Compassionate "−15 Opposite Trait Opinion", Sadistic "−10 General Opinion".

**Stress — a 0–400 store filled by acting against your traits.** "Stress ranges from 0 to 400." It is gained when a character answers an event or decision against their personality (and when "someone they're close to dies", imprisonment, torture). Levels: 0 (0–99) · 1 (100–199) · 2 (200–299, health −1) · 3 (300–399, health −2, suicide decision unlocked). The stressful interactions are a table per trait, e.g. Compassionate: "kick from court, disinherit, denounce, break up with lover, dismiss concubine"; Just: "execution (w/out reason)" and "imprison (w/out reason)"; Greedy: "grant independence, gift, grant titles"; Honest: "invite agent to scheme, elope, fabricate hook, start murder, start abduct".

**Mental break = a fork that rewrites the person.** "A character breaching the threshold of 100, 200, or 300 stress for the first time will immediately suffer a Mental Break." The choice is to "lose some stress with a choice of gaining one of two traits" (a Coping Mechanism or worse) or "gain additional stress"; level 3 outcomes include Wrathful, Lunatic, Melancholic, Murderer, Death, Abdication. "If a character reaches 400 Stress, it will trigger a level 3 mental break event and they will lose 100 Stress." Cooldown "once every 5 years". Coping traits give "+20% Stress Loss" and a stress-relief decision.

`[AI]` What CK3 adds to the hybrid: (1) personality as a handful of opposite-pair traits, each a SMALL VECTOR over a fixed set of drive numbers — the designer writes a table row, not code; (2) the price of acting against yourself (stress) — the mechanism by which a kind villager forced to rob becomes, over months, a bitter or a drinking one; a character arc out of two numbers and a table; (3) the break as a branch that changes traits, so life leaves marks. Off-screen it is cheap: stress is one counter per subject, a break is a roll at a threshold crossing.

## 6. Dwarf Fortress — the rich pole: 50 facets, two-layer stress, re-lived memories

Sources: https://dwarffortresswiki.org/index.php/Personality_trait · https://dwarffortresswiki.org/index.php/Stress (the Stress page carries "migrated from v0.47 and may be inaccurate for the current version").

**50 facets, mostly invisible.** Each facet is 0–100; "40−60 range does not cause a report" — about 78% of creatures sit there on any facet (bands: 91–100 Highest 0.4% · 76–90 Very High 2% · 61–75 High 8.5% · 25–39 Low 8.5% · 10–24 Very Low 2% · 0–9 Lowest 0.4%). The wiki: "many of the gameplay effects of personality facets are as yet unknown". The facets with known teeth are few: ANGER_PROPENSITY 91–100 → "more likely to throw tantrums and go berserk"; DEPRESSION_PROPENSITY → depression and melancholy; ANXIETY_PROPENSITY → oblivious stumbling and madness; STRESS_VULNERABILITY 91–100 "becomes completely helpless in stressful situations" (50% catatonia), 0–9 "impervious to the effects of stress"; FRIENDLINESS and HUMOR gate social skills. GREED, BRAVERY, LUST_PROPENSITY — descriptive only on that page.

**Stress in two layers.** Short-term stress "directly correlates with a creature's mood"; long-term stress has statuses "stressed" +25000, "haggard" +50,000, "harrowed" +100,000. Breakdowns (tantrum, depression, oblivious) "require both short-term and long-term stress to be high"; a harrowed dwarf who sees death can go insane. Under ideal conditions long-term stress rises at most 20,160 and falls at most 43,564 per year — "becoming haggard takes several years". Personality acts on RATES: bravery → how fast stress builds, stress vulnerability → how much before breaking, anxiety → how fast it dissipates.

**Memories re-lived.** Stress is added "whether from an immediate experience or from revisiting a long-term memory"; the strongest emotions become long-term memories and are the ones revisited; "Dwarves can hold only one short-term thought per group" so small happy thoughts crowd out weak bad ones; some memories later turn to acceptance. Needs work only through emotions ("lack of decent meals" → dejection, "starving/dehydrated" → panic).

`[AI]` What DF teaches: (1) the counter-example to the owner's "без переусложнения" — 50 facets whose effects even its own community cannot list fail essence rule 11, "a trait lives only if something visible reads it"; (2) but two of its mechanisms are cheap and strong: a SLOW second layer under the fast mood (long-term stress / temperament drift) so lives differ over years, and a few strong memories that re-fire their emotion (a grudge, a trauma, a beloved lost) — which is our knowledge graph's `обидел(…)` edge doing double duty as the source of recurring anger. Personality again acts on rates, not on new code — the same lesson as The Sims.

## 7. GAMYGDALA — appraisal for game designers: goals × events → OCC emotions → PAD

Source: Popescu, A., Broekens, J., van Someren, M. "GAMYGDALA: an Emotion Engine for Games", IEEE Transactions on Affective Computing 5(1), 2014, pp. 32–44 (preprint read in full: https://ii.tudelft.nl/~joostb/files/Popescu_Broekens_Someren_2013.pdf). Project: https://ii.tudelft.nl/~joostb/gamygdala/ (JavaScript, MIT, Phaser plugins).

**Position.** "positioned between event coding of affect, where individual events have predetermined annotated emotional consequences for NPCs, and a full blown cognitive appraisal model. Instead, for an NPC that needs emotions the game developer defines goals, and annotates game events with a relation to these goals." It deliberately leaves out decision making and expression: "AI specific functionality such as decision making and action selection is not included".

**Inputs — three small records.**
- Goal: owner · utility ∈ [−1, 1] ("Utility values of 1 or −1 should be used for major goals … finding gold is not as important as staying alive").
- Belief (an event as the NPC knows it): likelihood ∈ [0, 1] · causal agent · affected goals with congruence ∈ [−1, 1]. "The event likelihood gives the game developer the possibility to implement concepts such as rumors (event was not witnessed but the NPC has heard of it) or credibility (the NPC does not entirely believe the information because it was delivered by another unknown NPC)."
- Relation: `like(p, q)`, asymmetric, grows by itself: "An event caused by q that facilitates a desirable goal for p, increases the value of like(p, q). Likewise, if the goal is blocked then the value of like(p, q) decreases."

**The whole math.**
```
desirability(b, g, p) = congruence(b, g) · utility(g)                      (1)
likelihood(g)         = (congruence(b, g) · likelihood(b) + 1) / 2         (2)
intensity(e)          = |des(b, g, self) · Δlikelihood(g)|                  (3)  internal emotions
intensity(e)          = |des(b, g, q) · Δlikelihood(g) · like(self, q)|     (4)  social emotions
PAD                   = 0.1 · log2( Σ_e 2^(10 · PAD(e) · intensity(e)) )    (5)  per axis
```
Eliciting rules in words: "hope: a desirable uncertain goal increases in likelihood of success …"; "fear: an undesirable uncertain goal increases in likelihood of success or a desirable uncertain goal decreases"; "joy: a desirable goal succeeds or an undesirable goal fails"; "distress: an undesirable goal succeeds or a desirable goal fails"; "anger: an undesirable event is caused by another NPC"; "gratitude: a desirable event is caused by another NPC"; "pity: an undesirable event happens to a liked NPC"; "gloating: an undesirable event happens to a disliked NPC"; "resentment: a desirable event happens to a disliked NPC". Sixteen of OCC's 24 emotions are supported.

**Personality = resting point + decay.** "The default emotional state, the default social stance and the decay functions are used by the game designer to create individual differences in emotion dynamics between NPCs. They represent an NPC's personality … The NPC's emotional state is initialized to the default emotional state, it changes due to events that affect it and decays back towards the default emotional state." Combination is Reilly's logarithm — "not being strictly additive, using all emotions (and not only the strongest), and being at least as intense as the most intense component".

**A village example from the paper (worth copying as a test).** The blacksmith likes the village that gave him a house (Joy + Gratitude); the belief "village is unarmed" gives Pity 0.85; providing weapons gives Gratification 0.85 + HappyFor 0.85; "if we were to model the village with its own emotional brain at the same time, then after the second step it would generate Fear and at the end Relief, Joy and Gratitude towards the blacksmith" — a village can be an agent too.

**Cost (measured by the authors).** "GAMYGDALA allows simulation of up to 35,000 NPCs, 2 goals and 2 beliefs per NPC, with a total computing time of less than one second … When the number of goals and beliefs increases to a more realistic amount (5 goals and 20 beliefs per NPC), GAMYGDALA can still compute the appraisal for 5,000 NPCs … in just 0.816 seconds" (3 GHz, single thread); the XNA sandbox kept "about 60FPS" with 5,000 NPCs where each wave hits only part of them. Behaviour hooks in their RTS: "individual fleeing units might trigger mass fleeing of all AI-controlled units through the generation of fear, and, (b) high arousal produces errors in planning."

`[AI]` What GAMYGDALA gives: the missing ENTRY of the hybrid — how an event in our world book becomes an emotion WITHOUT hand-writing a reaction per event per NPC: tag events by which goals they help or hurt (a table), keep a few goals per role, and the same "bear seen at the marsh" yields fear in the herb-gatherer, hope in the hunter. Its likelihood field is our rumour layer exactly (heard ≠ seen; a friend's word is believed more). Its `like(p, q)` is the trust edge on which rumours and food travel. It does no choosing — that stays with the Will layer (Utility AI, Unliminium 04).

## 8. Considered and set aside

- **Plutchik's wheel (8 basic emotions × 3 intensities).** Not read in depth this session. Set aside by the owner's criterion: 8 axes where PAD's 3 already separate everything the owner named (fear vs anger by dominance), and ALMA's octants give 8 labels for free.
- **Full OCC (24 emotions with standards and praiseworthiness).** GAMYGDALA's 16 goal-based emotions cover the world events; the one OCC branch worth adding later is **standards** — a witnessed crime (theft, assault) gives Reproach in witnesses and Shame in the culprit — because the epic has crime and law (module «Разбой и закон»). One extra tag on an event, not a new engine.
- **Dwarf Fortress' 50 facets.** Fails essence rule 11 (§6).
- **Scherer's sequential appraisal checks.** Its "control / coping potential" check is what PAD's dominance already carries (§1); the stepwise process itself is not needed for an hourly tick.

## 9. Synthesis — the hybrid the sources point to

`[AI]` A proposal for discussion, not a decision. Every layer below is taken from a shipped game or a published model above; nothing is invented except the joints between them.

**Per subject: 15 numbers + a sparse list of relations.**

| Layer | Numbers | Changes | Taken from |
|---|---|---|---|
| Character (traits) | 5 bipolar sliders −1…+1 | almost never (breaks may shift one) | Sims 1 sliders, CK3 opposite pairs |
| Mood | P, A, D ∈ −1…+1 | every game hour: pulled by emotions, drifts back to rest | PAD, ALMA |
| Needs | 6 counters 0…1: food, water, sleep, warmth, company, intimacy | decay per hour, rate scaled by traits; refilled by actions | The Sims motives |
| Stress | 1 counter 0…400 | grows from acting against own traits, long unmet needs, low mood; slow decay | CK3 stress, DF long-term stress |
| Relations | `like(p,q)` −100…+100 per known person (and per village) | events caused by q; deep talk, insults, gifts | RimWorld opinion, GAMYGDALA `like` |
| Memories | a few strong edges of the world book (`обидел`, `дал`, `спас`) | re-fire their emotion now and then; fade with time | DF re-lived memories, essence p. 5, 18 |

**The hourly loop (one pass over arrays, server-side, essence p. 2 and 21).**
1. **Appraise new events** the subject saw or heard (GAMYGDALA): each event row carries which role-goals it helps or hurts (congruence) — a table, written once. `desirability = congruence × utility`, weighted by likelihood: seen = 1, heard = the teller's trust (`like`) — the rumour layer. Event caused by someone → anger/gratitude and `like` moves.
2. **Emotions → mood**: each emotion is a PAD point (ALMA Table 2), intensity pulls the mood (ALMA pull/push); mood decays toward the resting point computed from traits (ALMA's formula with S = −N, or a simpler direct map from our 5 sliders).
3. **Needs decay** at trait-scaled rates; unmet needs emit their emotions (DF: "lack of decent meals" → dejection; starving → panic).
4. **Stress** += acting against traits (CK3 table) + time in a negative octant; on crossing 100/200/300 → a **break** drawn by weight from the menu of the CURRENT octant (RimWorld weights, CK3 trait outcomes): Anxious → hide, flee home, refuse the forest road; Hostile → brawl, theft, revenge on the remembered offender; Bored/depressed → drink, idle, leave the village. After a break — catharsis (RimWorld +40 for 3 days) so there is no death spiral.
5. **Will** picks the action (Utility AI from Unliminium 04): scores = need curves × trait weights × mood modifiers. Mood speaks to choice through a few named knobs only.

**The owner's words → numbers → visible behaviour (essence rule 11: no reader, no number).**

| Owner's word | Where it lives | Who reads it (visible) |
|---|---|---|
| напуган | mood octant Anxious (−P +A −D); trait Смелость lowers D | road over forest, flee from a bandit, avoid the place where a bear was rumoured, lock up at night |
| зол | emotion Anger/Hate (−P +A +D), aimed at q via `like(p,q)` | revenge on the offender, refuse trade, insult; the forest shortcut "when angry" (owner, 2026-10-08) |
| агрессивен | octant Hostile + trait Вспыльчивость (and Kindness low) | brawl chance per insult (RimWorld 4% × modifiers), robbery, break outcomes |
| подавлен | octant Bored/depressed (−P −A −D), long stress | work slower, drink, skip the tavern, leave the village |
| дружелюбен | `like(p,q)` > +20 and trait Доброта | shares food and rumours only along such edges (owner, 2026-10-08), helps in work |
| сексуален | need «близость» (intimacy), decay scaled by traits | courtship, marriage, births in the life-cycle module; jealousy as Anger at a rival |

**What it costs.** 15 floats × 500 subjects = 7,500 numbers plus a few thousand relation edges — the C# world-server bench already ticks 500 subjects in 0.009 ms per game hour (`testcases/reports/2026-10-08_md-phase0-world-server-bench.md`, row 500: 0.0090 ms); GAMYGDALA's measured 5,000 NPCs × 5 goals × 20 beliefs in 0.816 s single-threaded is the worst-case ceiling for appraisal, and we appraise only NEW events once per hour.

**Integration points in Medieval Dynasty (hypotheses for phase 0 — not yet checked in the game):** village aggregates `LowMood_People` and kingdom `MoodModifier` can be FED from our per-subject moods; work speed (`Talent_ProductionModificator`-like fields) as the reader of mood/needs; the event `MoodyVillagers` as an existing display hook; path choice road vs chain-of-points from step 0.2c as the reader of fear and urgency.

**Risks (Murphy, tiered).**
- (a) **Runaway emergence** — Radiant AI's beta NPCs "crали ради еды и убивали ради нужного предмета" (Unliminium 04 §6); The Sims' addictive Joy Booth. Defence: vetoes in the Will layer (no murder for a loaf), caps and cooldowns on breaks (CK3: once per 5 years), catharsis.
- (a) **Numbers nobody sees** (DF's facets). Defence: the reader table above is the gate — a number without a reader is not added.
- (b) **Tuning drift** — many curves. Contingency: all constants in data tables (RimWorld's thought rows, CK3's trait vectors), a ledger of mood/stress per village per day (essence E12) to see drift.
- (b) **The ALMA sign trap** (§2). Contingency: a unit case "neurotic subject rests in an unpleasant, aroused mood".
- (c) Save size, thread cost — negligible at our scale (numbers above).

## 10. Aims — strategy, tactics, operation (added 2026-10-08 on the owner's request)

The owner's ask (chat, 2026-10-08): `[OWNER]` «в модели KARMA нужно добавить амбиции, мечты и "цель жизни" - похожее было в Sims 3 … Типа три уровня, как СТРАТЕГИЯ - смысл и цель всей жизни. ТАКТИКА - долгосрочные мотивы и цели для продвижения себяи своей жизни к стратегии. ОПЕРАЦИЯ - то, чем занимаюсь прямо сейчас, что нужно, для выполнения ТАКЦИЧЕСКИХ планов».

**The Sims 3 — lifetime wish + wishes** (Sims Wiki via the MediaWiki API, pages "Lifetime wish", "Lifetime happiness", "Wish"):
- "A lifetime wish is a Sim's ultimate goal that they aim to accomplish within their lifetime … A Sim's lifetime wish is related to the traits they have. For example, a Flirty Sim may want to have the Heartbreaker Lifetime Wish." Chosen when growing from teen to young adult; a child's experiences can seed it: "being mean to another Sim and/or beating them up will trigger the Emperor of Evil or Super Popular wishes. Watching a Sim die will trigger Emperor of Evil, World Renowned Surgeon …"
- 86 lifetime wishes across the game and expansions (32 in the base game).
- Short wishes: "Wishes are based on a Sim's traits, their job, their skills, their friends or coworkers, their current action or the environment they are in." Fulfilling one gives lifetime happiness and "a positive "Fulfilled" moodlet". Nesting bonus: "Wishes that are related to a Sim's lifetime wish will provide 50% more lifetime happiness points than usual."
- A life is measured: "Achieving lifetime happiness is a measure of a Sim's life … memorialized by the size of their gravestone." Points also accrue from good mood: "They begin accumulating when the Sim's moodlets measure +50 combined or more".

**The Sims 2 — wants and FEARS** (page "Wants and fears"): "a Sim is born with four want slots and three fear slots"; when one is fulfilled "the slot it occupies … will be re-rolled", and all "are also re-rolled completely at the end of the day"; one can be locked against re-rolls. "Fulfilling wants will increase the aspiration bar … Fulfilling fears will, similarly, decrease the aspiration bar by a set amount, even to the point of aspiration failure". What rolls: "mostly based on Sims' aspiration, age, and personality … relationship, events, seasons". A fulfilled lifetime want once gave "permanent Platinum mood", later a Platinum mood that "will decay very slowly".

**The Sims 4 — aspiration as milestones** (page "Aspiration (The Sims 4)"): "Aspirations are lifelong goals"; "Most aspirations have four milestones that must be achieved in order to complete the aspiration"; "Once all milestones of an aspiration are completed, that Sim will be given a reward trait … Once an aspiration is completed, the player can select another aspiration".

**Dwarf Fortress — dreams** (https://dwarffortresswiki.org/index.php/Personality_goal): a list of life goals with in-game text and a realisation condition — START_A_FAMILY "dreams of raising a family" (realised on a birth), CREATE_A_GREAT_WORK_OF_ART / CRAFT_A_MASTERWORK (realised on an artifact or masterpiece), MASTER_A_SKILL (Legendary skill), MAKE_A_GREAT_DISCOVERY, ATTAIN_RANK_IN_SOCIETY (becoming a noble), RULE_THE_WORLD, BRING_PEACE_TO_THE_WORLD, BECOME_A_LEGENDARY_WARRIOR, FALL_IN_LOVE, SEE_THE_GREAT_NATURAL_SITES, BATHE_WORLD_IN_CHAOS, IMMORTALITY ("has become obsessed with his/her own mortality; leads to necromancy"). On success a happy thought and the description gains "and this dream was realized". Goals can be re-evaluated by events in world generation.

**The owner's own corpus — Unliminium research 37** (`D:/work/unliminiumProject/researches/37_strategy_tactics_operation_goal_setting.md`): "Уровни различаются НАЗНАЧЕНИЕМ, а не сроком … Нижний уровень всегда говорит, ЧЕМУ служит: «…, чтобы <цель уровня выше>»"; "Каждый уровень формулируется условием, которое можно проверить «выполнено / не выполнено»"; the owner's order strategy → tactics → operation is the management order (Hoshin: "company goals (Strategy)… middle management (Tactics)… work performed by employees (Operations)"); stage changes are "usually driven by events rather than time" (JP 3-0); Moltke: "no plan of operations extends with any certainty beyond the first contact".

`[AI]` **What this gives KARMA — almost no new machinery.** A dream, a milestone and a wish are all GAMYGDALA goals (§7) with a LEVEL, a utility and a "чтобы" link upward; a fear is a goal with negative utility (GAMYGDALA's ghost already has "get eaten" with utility −1). Appraisal then yields hope, joy, disappointment and fear about one's own life for free. What is new: (1) the dream is chosen from traits and seeded by memories (Sims 3, DF), (2) milestones are checkable conditions with "чтобы" (Sims 4, Unliminium 37), (3) wishes and fears are re-rolled daily from traits, role, place and friends (Sims 2/3), (4) nesting bonus — an action that serves a milestone that serves the dream is worth more (Sims 3: +50%), (5) life drifting away from the dream feeds stress; realising it gives a long-lasting strong positive emotion and a reward trait (Sims 2 Platinum, Sims 4), (6) events, not the calendar, change plans — a murdered family turns «большая семья» into «месть».
