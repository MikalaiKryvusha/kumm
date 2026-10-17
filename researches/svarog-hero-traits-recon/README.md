# Recon — hero trait systems in other games and new trait ideas for Svarog's Dream

> **Created:** 2026-10-17 · **Parent:** ideas/19_svarog_new_hero_traits_50.md, owner's request in chat · **Status:** recon done ·
> **Outbound:** new trait ideas → owner via chat

**What this gives.** Other games tie each trait to one system the player already touches: food, sleep, prices, gods, prison and so on.
This file lists the systems in Svarog's Dream that a trait can hook into, what nine other games do with traits, and 40 new trait
ideas plus 10 "earned in play" ideas. None of them repeats the 95 talents in the game data or the 50 drafted in idea 19. Every idea
here is a `[AI]` proposal. Nothing goes into the game without the owner's yes on that trait.

**Key finding: the game already adds traits during play.** `TalentsManager.TryDiscoverTalent(PlayerTalentId, float chance)`
(`TalentsManager.cs:305`, decompilation 2026-10-17) is called from about 180 places: drinking, eating, fishing, crime, quests, combat,
taking damage, a new in-game year. Chance multipliers already exist: Generosity (light) ×1.5 for positive talents, Antler Helmet ×3
for negative ones, Jaga Curse ×1.5, Doomed ×10, ×2 for positive talents below Challenging difficulty. Traumatized has a 50% veto on
positive talents. The game also has `AddRandomTalent(isPositive)`, `AddRandomCurse()`, `RemoveOneCurse()`, `RemoveRandomNegativeTalent()`
(the Faith Confessor trainer) and `RemoveRandomPositiveTalent()`. Opposite talents block each other through `PlayerTalent.oppositeOf`
(`IsTalentAdditionValid`). Section 5 builds on this. The internal map does not record it yet: it should get a §3.7 about talents.

**Counting note.** `SvarogsDream/translation/talents_en.tsv` (extracted from the game's `PlayerTalent` data) has 95 talents. Two of
them, Generosity and Gluttony, are virtue talents (`isVirtue`), so the "93" probably leaves them out. Heroes carry 78 different ones
(plan 27).

## 1. Our mechanics a trait can hook

The "Existing" and "Idea 19" columns show whether a talent already modifies this system. Code addresses come from
`games/SvarogsDream/GAME_ARCHITECTURE_INTERNAL_MAP.md` (marked *map*) or from the 2026-10-17 decompilation I read for this recon
(marked *decomp*).

| # | Mechanic | Class / field / address | Existing 95 | Idea 19 |
|---|---|---|---|---|
| M1 | Attribute growth and caps | `HandleTalentStats`, `PlayerTalent.statChangeAmount` (*decomp*) | many (Strong, Bright, Old…) | Книжник, Неграмотный |
| M2 | Melee, ranged and spell damage; crits; weapon masteries | `CharacterStats`, `CharacterCombat` | many | many |
| M3 | Damage taken, by type | `CharacterStats.cs:464` armour curve (*map*) | curses, Butcher, Philosopher | Каменная Кожа |
| M4 | Night: beasts and undead +50% dmg / −25% taken outdoors | `CharacterStats.cs:386–405, 1378` (*map*) | Vampire Blood (own dmg) | Солнечный |
| M5 | Night halves max Bravery outdoors | `PlayerStats.cs:1854–1863` (*map*) | Night Owl cancels it | — |
| M6 | Silver ×1.5 vs `IsBeast()` | `CharacterStats.cs:1465–1470` (*map*) | — | — |
| M7 | Vampire bite → Vampire Blood / Vampirism | `AIVampire.cs:127–135` (*map*) | Vampire Blood, Vampirism (the results) | — |
| M8 | Wet / Frozen weather states | `CastSpell.cs:957–1008`, `WorldWeatherManager.cs:254–286` (*map*) | — | Неженка, Закалённый (Wet only) |
| M9 | Winter: shorter day, no planting, no honey | `WorldTime.cs:141–152`, `Planting.cs:100`, `BeeHouse.cs:13` (*map*) | Beekeeper (honey) | — |
| M10 | Hunger | `PlayerStats.currentHunger`, `GetMaxHunger`, `HealHunger` (*decomp*) | Spartan, Eater, Hunger Curse, Missing Teeth, Quick Eater, Gluttony | Железный Желудок, Лакомка |
| M11 | Sleep: cures poison and plague, sobers, Well Rested 5/10 min | `GameUI/SleepingManager.cs:52–130` (*map*) | Insomniac Curse | Ранняя Пташка, Соня, Бессонный |
| M12 | Drunk: +50% melee miss, 60 s | `CharacterCombat.cs:368–375`, `ConsumeManager.cs:76–83` (*map*) | Drunkard, Poor Drinker, Tipsy Brawler | — |
| M13 | Energy (stamina) regen and sprint | `PlayerStats.cs:290–330` (*map*) | Old Infection, Berserker, Pathseeker | Неутомимый, Одышка |
| M14 | Camouflage and vision cone | `PlayerStats.cs:1618`, `AIDecisionMaker.cs:234` (*map*) | Prominent, Clumsy | Тихий Шаг, Лесовик |
| M15 | Trader ×5 markup, trader purse limit | `ItemStats.cs:567–572`; `StorageManager.cs:4785, 4796` (*map*) | Vulgar (markup) | Торгаш, Скопидом, Горожанин |
| M16 | Carry weight; overloaded fast travel ×1.5 hunger, ×1.25 hours | `PlayerStats.cs:155`; `WorldMap.cs:3091, 3121` (*map*) | Pack-Hauler (weight only) | — |
| M17 | Fast travel | `WorldMap` | Broken Leg, Worldbound Curse, Spartan, Eater | Ходок |
| M18 | Forge upgrade price and cap (9/10/11/12) | `StaticForgeInterface.cs:165, 555` (*map*) | — | Кузнечья Хватка (price only) |
| M19 | Cooking and alchemy; extra-portion roll; failed potion 50/50 ±100 | `CookingManager.cs:378, 579–585, 641–647`; `ConsumeManager.cs:456–477` (*map*) | Alchemist, Bad Cook | — |
| M20 | Fishing: cast, rare catch | `FishingRod.cs:352–366`, `FishingManager.cs:214–235` (*map*) | Fisherman | Рыбацкая Удача |
| M21 | Planting, gardens | `Planting.cs`, `ProgressManager.RecordGardenPlanted` (*decomp*) | — | — |
| M22 | Petting and befriending animals: 25% + hunting bonus | `LevelUpManager.cs:250`, `AIAnimal.cs:160, 207` (*map*) | — | Звериный Друг (aggression, not befriending) |
| M23 | Followers: named followers (slaves, the Swamp Beggar), mercenaries, animal followers | `SummonsManager._followers`, `AddMercenary`, `AddAnimalFollower` (*decomp*) | — (Puppet Lord covers summons; whether it covers followers is unchecked) | — |
| M24 | Gods' Mercy (Божья Милость) from deeds and Dream Flowers | `GodsFavorsManager.cs:365–519, 655–688`, `ProgressManager.RecordGodsFavor` (*map*, *decomp*) | — | — |
| M25 | God punishment (Высокая difficulty, soul level > 10, relation < 3) | `GodsInterventionManager.cs:267–322` (*map*) | — | — |
| M26 | Order/Chaos shifts god relations | `DevotionManager.cs:753–795` (*map*) | Honest (order XP) | Праведник, Безумец (XP, not god relations) |
| M27 | Faction entry thresholds (Order ≥ 40%, Chaos ≥ 30/40/90%) | `FactionsManager.cs:100–106` (*map*) | — | — |
| M28 | Gods' Favor shop (buys a random positive talent, among other things) | `GameUI/UIGodsFavorShop.cs:363` (*decomp*) | — | — |
| M29 | Prison: days = fine / 50, −1 attribute per 10 days | `CrimeManager.cs:789–810` (*map*) | — | — |
| M30 | Caught stealing with no money: freed for all your gold | `CrimeQuestioning.cs:22–36` (*map*) | Thief, Honest, Forgettable Face | — |
| M31 | Credit (loan), daily update, bounty hunters for debt | `CreditManager.UpdateCreditForNewDay`, `GetMaxCreditAmount`, `IncreaseBountyHunterLevels` (*decomp*) | — | — |
| M32 | Gambling | `GameUI/GamblingScreen.cs:440–447`, `ProgressManager.RecordGoldEarnedGambling` (*decomp*) | Lucky (only gained there) | — |
| M33 | Death Pits arena: 13 500 coins | `DeathPitsQuest.cs:97–235` (*map*) | Prominent (gained there) | — |
| M34 | Caves and dungeons; cleared cave → `CaveHaste` (max 3); no night bonus underground | `DungeonsManager`, `GodsFavorsManager.cs:627` (*map*) | — | — |
| M35 | Tavern (`WorldState.isInTavern`), indoors (`SetIndoors`) | `HouseVisibility.cs` (*map*) | — | — |
| M36 | Sailing between ports (price) | `SailingManager.Sail`, `sailingPrice` (*decomp*) | — | — |
| M37 | Ageing: +1 year per 12 months; `Old` rolled at age > 50 | `WorldDateTime.cs:70–90`, `CharacterInitialAge` (*decomp*) | Old, Forever Young | — |
| M38 | World events and holidays: `Dziady`, `KupalaNight`, `PerunsDay`, `SvetovidDay`, `BloodMoon1–5`, `PlagueSpread`, `Flood*`, `MonthlyFestival` | `WorldEventEnum`, `WorldEventsManager` (*decomp*; how to ask "is the event active now" is unchecked) | — | — |
| M39 | Dream Flowers, Philosopher notes, Fragments of Memory | `ProgressManager.RecordDreamFlowerPick`, `RecordPhilosopherNotePick`, `RecordFragmentOfMemory` (*decomp*) | — | — |
| M40 | Talent gain itself (chances, removal, curses) | `TalentsManager.TryDiscoverTalent`, `AddRandomCurse`, `RemoveRandomNegativeTalent` (*decomp*) | Jaga Curse, Doomed, Traumatized, Generosity | Оберег |
| M41 | Death → new hero; reroll costs 3 Mercy | `UnderworldManager`, `CharacterSelectionManager.RerollCharacters` (*map*) | — | — |
| M42 | Animal form, spirit-scout form, summons | `AnimalFormManager`, `SummonsManager` | Bestial, Wild-Blooded, Sixth Sense, Puppet Lord | Медвежья Сила |

## 2. Per-game findings

### 2.1. Darkest Dungeon — quirks
- **Acquired:** recruits start with at least one positive and one negative quirk. Heroes gain more from curios and on the
  post-expedition screen. After a successful expedition the chance of a positive quirk is 50 − 0.10 × Stress and of a negative one
  30 + 0.20 × Stress; after a failed expedition, 40 − 0.15 × Stress and 40 + 0.30 × Stress. The tavern and abbey can also grant quirks.
- **Balance:** up to 5 positive and 5 negative quirks; a sixth replaces a random unlocked one. The Sanitarium (gold, scales with level)
  removes one quirk or locks a positive one per week. Each negative quirk has a 25% chance to lock after a mission.
- **Traits and hooks:**
  - Warrior of Light: +10% damage when the torch is above 75 (light level).
  - Lurker: +10% damage when the torch is below 26 (light level).
  - Photomania: −20% stress when the torch is above 75; Phengophobia: +20% stress at the same level (stress × light).
  - Ruins Tactician: +15% damage in the Ruins (location).
  - Weald Phobe: +20% stress in the Weald (location).
  - Kleptomaniac: 35% chance to grab Treasure curios on its own and keep the loot (loot, loss of control).
  - Curious: 20% chance to touch any curio. Dark Temptation: 40% chance to touch Unholy curios with no item, risking disease (exploration).
- Source: https://darkestdungeon.wiki.gg/wiki/Quirks

### 2.2. Battle Brothers — traits, permanent injuries
- **Acquired:** recruits get 0–2 random traits, filtered by background and by conflicts (Strong/Weak, Eagle Eyes/Short Sighted).
  Events and event choices add new traits (Fat, Drunkard, Greedy). A brother killed in battle survives with a random permanent injury
  33% of the time, 90% with Survivor. That never happens after a fatality, while retreating, or from damage over time.
- **Balance:** traits are mostly single-sided. Many traits unlock or block event outcomes rather than change stats.
- **Traits and hooks:**
  - Addict: −10% to two stats. Gained after 4+ drug doses with one in the last 3 days; lost after 14 days without potions; may steal
    a potion (consumables).
  - Drunkard: gained in an event after several brothers die; may lose an item; +20% chance to get drunk in the tavern (alcohol, events).
  - Gluttonous: eats 3 food a day instead of 2. Spartan: eats 1 and ignores food variety (food).
  - Greedy: +15% wages and may demand a raise; refusing can make the brother Disloyal (money, loyalty).
  - Superstitious: −10 Resolve against fear and mind control; can turn Afraid after Bad Omen events or Hexen contracts (morale, events).
  - Fear of Undead: −10 Resolve in battles with undead; Hate for Undead is the opposite (enemy type).
  - Night Owl and Night Blind: +1 / −1 vision at night (day/night).
  - Optimist and Pessimist: ±5 at morale checks, 33% more positive or negative mood (morale).
  - Irrational: a random +10 or −10 at every morale check (morale, chance).
  - Iron Jaw: +25% injury threshold (injuries). Permanent injury Missing Eye: −50% ranged skill, −2 vision (injury).
- Sources: https://battlebrothers.fandom.com/wiki/Traits · https://battlebrothers.fandom.com/wiki/Permanent_Injuries

### 2.3. RimWorld — traits, spectrum traits, needs
- **Acquired:** 1–3 traits by age, from the pawn kind, backstory and random fill weighted by commonality. Adults never gain or lose
  traits.
- **Balance:** conflicting pairs (Kind / Abrasive), spectrum groups (one trait per scale: work speed, base mood, beauty), and a ban on
  traits that would push the minor mental-break threshold above 50%.
- **Traits and hooks:**
  - Night Owl: +16 mood awake 23:00–06:00, −10 awake 11:00–18:00, no darkness penalty (time of day, sleep).
  - Gourmand: +4 Cooking, +50% hunger rate, food binges about every 50 days (hunger, mental break).
  - Ascetic: meal quality never affects mood; −5 mood in an impressive bedroom (comfort reversed).
  - Undergrounder: indoors need instead of outdoors; +4 mood underground, −3 outdoors (location).
  - Pyromaniac: mood from fire weapons, random fire-starting sprees (fire, loss of control).
  - Masochist: pain gives +5 to +20 mood (pain reversed).
  - Tough: ×50% incoming damage. Nimble: +15 melee dodge, ×10% trap chance (combat).
  - Jealous: −8 mood unless the pawn has the best bedroom (comparison with others).
  - Chemical interest: a drug need from −2 to −6 mood (addiction).
- Source: https://rimworldwiki.com/wiki/Traits

### 2.4. Wartales — traits, inborn and acquired
- **Acquired:** "New recruit or starting companion" traits are inborn. Most others unlock in play: an action counter reaches a
  threshold, a chance is rolled, and the counter resets on failure.
- **Balance:** every trait is small (±3–10%) and conditional. Some traits come and go: Drunkard is gained with 5% after 5 rests in a
  row with alcohol and lost after 10 sober rests.
- **Traits and hooks (trigger → effect):**
  - Ascetic: rested without enough food → eats 1 food less (food).
  - Like a Horse: event after 2+ rests without enough food → +20% carry capacity (hunger turned into strength).
  - Duellist / Tormentor: 100 attacks with a one-handed / two-handed weapon → +5% crit chance and crit damage with it (weapon use).
  - Tough: suffered an injury → 25% chance to avoid injuries (injury).
  - Instinctive: took a critical hit → −25% chance to be crit (combat).
  - Haemophiliac: took bleeding damage several times → bleeding +5% (damage over time).
  - Superstitious: entered ruins → −5 Willpower in the Tombs of the Ancients (location).
  - Strategist: fled a battle → retreat penalty −50% (retreat).
  - Valiant / Immovable: landed the killing blow on a Region Champion → Valour points / immune to Terror (boss kill).
  - Delicate: ate raw food → 5% chance of indigestion (food quality). Carnivorous / Vegetarian: must eat meat / vegetables to be content.
  - Altruistic and Tyrannical: prisoners → recruit chance +20% / Willpower +2 while there are prisoners (prisoners).
  - Sore Loser: worse relationships during dice games (gambling).
- Source: https://wartales.fandom.com/wiki/Traits

### 2.5. Crusader Kings 3 — personality, congenital, lifestyle, stress
- **Acquired:** personality traits come with childhood and change mostly in a mental break at Stress level 2+. Congenital traits are
  inherited (50% to rise a tier when both parents share one). Lifestyle traits level up with XP (Hunter → Venator, Pilgrim, Herbalist).
  Coping traits are gained in a mental break (up to two).
- **Balance:** acting against your personality adds Stress. Every coping trait has +20% Stress loss and a penalty, and unlocks a
  decision that relieves stress.
- **Traits and hooks:**
  - Drunkard (coping): −2 Stewardship, −2 Prowess, −0.15 Health, +20% Stress loss; "Indulge in Drink" (stress, alcohol, health).
  - Flagellant (coping): −2 Prowess, −0.15 Health; "Flagellate" (+Zeal) (religion, self-harm).
  - Comfort Eater / Inappetetic (coping): food-based stress relief (food).
  - Improvident (coping): −15% monthly income, +0.5 piety; "Donate to Charity" (money → faith).
  - Reclusive (coping): +10 plague resistance; "Seclude Yourself" (solitude).
  - Paranoid: +100% Stress gain, +25% Dread gain, better scheme defence (stress, intrigue).
  - Pilgrim (lifestyle): +5% monthly piety, +5 travel speed, +5 travel safety (travel, faith).
  - Herbalist (lifestyle): +0.5 Health (disease resistance) (healing).
  - Scarred: prestige and attraction changes; the higher tier adds +10% Dread (injury → reputation).
- Source: https://ck3.paradoxwikis.com/Traits

### 2.6. Kingdom Come: Deliverance I and II — Hardcore negative perks
- **Acquired:** chosen at the start of Hardcore mode (at least 2 in KCD, 3 in KCD2). They stay all game; Lethean Water does not reset them.
- **Balance:** pure drawbacks that buy difficulty. The reward is an achievement for taking them all.
- **Perks and hooks:**
  - Somnambulant: chance to wake up somewhere else; KCD2 adds −40% energy (sleep, position).
  - Nightmares: −2 to all stats for a while after waking (sleep).
  - Tapeworm: +50% hunger drain. Hangry Henry: +25% hunger drain, −50% food value, social skills up to −90% when hungry (hunger, speech).
  - Picky Eater: food spoils 25% faster, gutting gives 75% less meat (food, hunting).
  - Claustrophobia: −15% attack with a closed visor (equipment).
  - Consumption: −15% stamina regen. Haemophilia: bleeding ×2 (body).
  - Bashful: −25% Speech XP, cannot ask for directions or use the bathhouse (social, services).
  - Menace: permanent criminal brand, next major crime means execution, 2× random searches (crime, law).
  - Heavy-Footed: minimum noise 25, shoes wear 2× faster (stealth, gear).
  - Punchable Face: +10% damage taken, enemies stronger (combat).
- Sources: https://kingdomcomedeliverance.fandom.com/wiki/Hardcore_Mode · https://kingdomcomedeliverance.fandom.com/wiki/Hardcore_Mode/KCD2

### 2.7. Stoneshard — traits, injuries, psyche
- **Acquired:** each preset hero has one unique trait. Injuries come from damage to a body part: Mild at 50% of that part's health,
  normal at 25%, Severe at 0%. Mental conditions roll from the Sanity × Morale quadrant plus a trigger.
- **Balance:** traits scale with the situation. Severe injuries have one special effect each and heal with the body part.
- **Traits and hooks:**
  - Vow of the Feat (Arna): per enemy in view −5% cooldowns, −5% energy cost, −2.5% damage taken (number of enemies).
  - Sharp Eye (Dirwin): an enemy first entering view gets −20% dodge, +20% damage taken for 10 turns (first sight).
  - Berserker Frenzy (Jorgrim): per kill +10% weapon damage, +15% crit efficiency for 10 turns (kill chain).
  - Artifact Knowledge (Verren): 1% per turn to identify a random item (inventory).
  - Severe injuries: hands → drop held items; legs → chance of Immobilized each turn; head → no spells, no energy regen, chance of
    coma; torso → chance of bleeding (body parts).
  - Psyche: darkness, uncanny monsters, head injuries, pain and heavy drinking lower Sanity; hunger, thirst and low health lower Morale.
    High Morale with low Sanity unlocks Frenzy, Sadism, Masochism, Megalomania; low Morale with high Sanity unlocks Anxiety, Apathy,
    Despair, Hypochondria.
- Sources: https://stoneshard.fandom.com/wiki/Traits · https://stoneshard.fandom.com/wiki/Injuries · https://stoneshard.fandom.com/wiki/Psyche

### 2.8. Mount & Blade II: Bannerlord — personality traits
- **Acquired:** five scales (Mercy, Valor, Honor, Generosity, Calculating) collect trait XP from the hero's deeds. Levels sit at
  −4000 (−2), −1000 (−1), 1000 (+1) and 4000 (+2).
- **Balance:** a spectrum, so one scale cannot be both Merciful and Cruel. Traits mostly change how lords and companions regard you,
  and their combination makes the reputation line in the encyclopedia ("Brave but headstrong", "Icy").
- **Hook:** reputation and relations. The pattern for us: the hero's deeds move a scale, and the scale moves a relation.
- Source: https://mountandblade.fandom.com/wiki/Personality_Traits

### 2.9. Project Zomboid — point-cost traits
- **Acquired:** bought at character creation. Positive traits cost points and negative ones give points back. Adaptive traits come
  and go in play: High Weight above 85 kg, Weak/Strong by Strength level, fitness and panic traits.
- **Balance:** a point budget. A negative trait lost in play does not return its points.
- **Traits and hooks (cost):**
  - Light Eater (−2): 75% hunger. Hearty Appetite (+4): 150% hunger, small foraging bonus (hunger).
  - Wakeful (−3): −30% fatigue rate, +10% sleep efficiency. Restless Sleeper (+6): slow rest and wakes more easily (sleep).
  - Inconspicuous (−4): 50% chance zombies spot you. Conspicuous (+4): 200% (stealth).
  - Fast Healer (−6) / Slow Healer (+3): injury severity and recovery (healing).
  - Iron Gut (−2) / Weak Stomach (+2): food illness chance 50% / 200% (food quality).
  - Agoraphobic (+4): panic outdoors. Claustrophobic (+4): panic in small rooms (location).
  - Smoker (+3): stress rises until you smoke (addiction).
  - Cat's Eyes (−3): +20% night vision, better foraging (night).
  - Desensitized (Veteran job): no panic, 200% nightmares (morale vs sleep).
- Source: https://pzwiki.net/wiki/Traits

### 2.10. Kenshi and Fallout 2 — supporting references
- **Kenshi** has no trait list. Its personality tags (Honorable, Traitorous, Smart, Dumb, Brave, Fearful, Maniacal) steer dialogue,
  bribe-taking and prison escapes. Its real "traits" are learn-by-doing stats: Toughness grows from being hurt, losing fights and getting
  back up. Lost limbs can be replaced with robotic ones, which also stop martial-arts recoil. Pattern: suffering is the training.
  Sources: https://kenshi.fandom.com/wiki/Personality · https://kenshi.fandom.com/wiki/Toughness
- **Fallout 2** traits are double-edged at creation: Chem Reliant (2× addiction chance, faster recovery), Chem Resistant (half
  addiction, chems last half as long), Fast Metabolism (+2 healing rate, poison and radiation resistance start at 0), Heavy Handed
  (+4 melee damage, −30% on crit tables), Good Natured (+15% social skills, −10% combat skills), Gifted (+1 SPECIAL, fewer skill points).
  Source: https://fallout.fandom.com/wiki/Fallout_2_traits

### 2.11. Slavic folklore — flavour sources
- **Domovoy:** the household spirit of a kin; it rewards a kept house. https://en.wikipedia.org/wiki/Domovoy
- **Kikimora:** a female house (later swamp) spirit, good or bad depending on how the household behaves; tied to night and sleep.
  https://en.wikipedia.org/wiki/Kikimora
- **Leshy:** the forest and hunting spirit. https://en.wikipedia.org/wiki/Leshy
- **Vodyanoy:** the water spirit who drowns people and wrecks mills. Fishermen poured butter into the river for a good catch, and
  bee-keepers dipped honeycomb at midnight. https://en.wikipedia.org/wiki/Vodyanoy
- **Rusalka:** a water entity, often hostile to people. https://en.wikipedia.org/wiki/Rusalka
- **Poludnitsa (Lady Midday):** the noon demon of the fields who strikes those who work at midday. https://en.wikipedia.org/wiki/Lady_Midday
- **Bannik:** the bathhouse spirit; the bathhouse was a place of divination. https://en.wikipedia.org/wiki/Bannik
- **Likho:** one-eyed personified misfortune: «Не буди лихо, пока оно тихо». https://en.wikipedia.org/wiki/Likho
- **Volkhv:** the pagan priest. https://en.wikipedia.org/wiki/Volkhv
- **Kupala Night:** the summer-solstice night (fern flower, herbs, water). https://en.wikipedia.org/wiki/Kupala_Night
- **Dziady:** rites of communion with the ancestors' spirits. https://en.wikipedia.org/wiki/Dziady
- Common knowledge, not fetched this time: the changeling (подменыш), the idiom «в рубашке родился» (born lucky), dual faith
  (двоеверие), skomorokhi (wandering minstrels), garlic and aspen against the upyr.
- Not covered: the Witcher 3 wiki. The folklore above gives the same flavour from primary summaries.

## 3. Patterns

**How traits tie to mechanics.**
1. **One system, one number.** The best traits change one value the player already watches: hunger rate (Gourmand, Tapeworm), damage
   at a light level (DD), wages (BB Greedy). Svarog's existing talents mostly work this way.
2. **Conditional by place or time.** Damage or stress in a given region (DD Ruins Tactician, Weald Phobe), mood by hour (RimWorld
   Night Owl), indoors or underground (Undergrounder, Agoraphobic). Svarog has these conditions in code: night, winter, wet and
   frozen, indoors, tavern, dungeons, holidays (M4, M8, M9, M34, M35, M38).
3. **Reversal of a normal rule.** Ascetic dislikes comfort, Masochist likes pain, Like a Horse grows from hunger. Cheap to make, and
   players remember them.
4. **Loss of control.** Kleptomaniac, Curious, Pyromaniac, Somnambulant: the game acts for the hero now and then. Strong stories,
   but they need a rare trigger so they do not annoy.
5. **Social and economic hooks.** Wages, prices, loans, prison, reputation (BB, KCD2 Menace, CK3 Improvident, Bannerlord). In
   Svarog, M15, M27, M29–M33 and M31 credit are free.

**Acquisition.**
- Birth or recruit roll (all games). Svarog: hero data, and the planned random pool (plan 27).
- Counter plus chance (Wartales; Svarog already does it with `TryDiscoverTalent` at 0.01–5% per event).
- Injury on near-death (BB, Stoneshard). Svarog already has it: Broken Hand, Broken Leg, Missing Eye… (`CharacterStats.cs:1979–1994`,
  `PlayerStats.cs:2114–2126`).
- Mental break or stress (CK3, DD after expeditions). Svarog has no stress meter. Morale (`MoraleBuff`) and Bravery are the nearest.
- Event or quest reward (BB events, Wartales Region Champion). Svarog: Mokosh's Pantheon quest gives Attractive and Forever Young at 100%.
- Removal through a service or abstinence (DD Sanitarium, BB Addict, Wartales Drunkard). Svarog has the Faith Confessor and the curse
  remover; removal by abstinence is missing.

**Balance.**
- A point budget (PZ) or a ± pair in one trait (Fallout 2, Svarog's Vulgar, Butcher, Philosopher).
- Conflict pairs and spectrums (RimWorld, BB, Bannerlord). Svarog: `PlayerTalent.oppositeOf`, one opposite per talent.
- Slot caps with replacement (DD 5+5). Svarog has no cap; a Steam stat fires at 15+ talents.
- Small, conditional numbers (Wartales ±5%) let many traits coexist.

## 4. New trait ideas

All rows are `[AI]` proposals. Numbers are first guesses for tuning in game. "+" good, "−" bad, "0" double-edged. "Hook" names the
class and field from section 1. None repeats the 95 talents or the 50 of idea 19. Where one is close, the last column says which.

| # | Trait (EN) | Черта (RU) | ± | Effect (one line) | Hook | Inspired by | Icon (one object) | Close to / opposite of |
|---|---|---|---|---|---|---|---|---|
| 1 | Usurer's Darling | Любимец Ростовщика | 0 | The credit limit is twice as high, but overdue debt sends bounty hunters twice as fast. | M31 `CreditManager.GetMaxCreditAmount`, `IncreaseBountyHunterLevels` | CK3 Improvident (money ↔ penalty) | a promissory note with a wax seal | — |
| 2 | Dice Devil | Костяной Чёрт | 0 | Gambling wins pay 25% more, but each loss costs Mokosh 1 point of relation. | M32 `GamblingScreen`, `RecordGoldEarnedGambling`; `DevotionManager` | Wartales Sore Loser | three bone dice | Lucky |
| 3 | Ataman | Атаман | + | Followers and mercenaries deal 20% more damage and have 20% more health. | M23 `SummonsManager._followers`, `AddMercenary` | Wartales Natural Born Leader | a mace with a horsetail tassel (bunchuk) | Puppet Lord (summons) |
| 4 | Beast Tamer | Укротитель | + | Petting a wild animal makes it a friend twice as often. | M22 `LevelUpManager.cs:250`, `AIAnimal.cs:160` | Wartales Raised by Boars, Owner | a rope halter | opposite: Fear of Animals, Beastbound Curse |
| 5 | God-Fearing | Богобоязненный | 0 | The gods never punish the hero, but Mercy for deeds comes half as often. | M25 `GodsInterventionManager.cs:267–322`; M24 `GodsFavorsManager` | CK3 Zealous / piety | bowed head before a wooden idol | — |
| 6 | Dual-Faithed | Двоеверец | + | Order and Chaos no longer change the gods' relation to the hero; joining a faction does not anger them either. | M26 `DevotionManager.cs:753–795`; `FactionsManager.cs:121–157` | folklore (двоеверие) | a cross and a lunnitsa on one cord | opposite: Fanatic (by spirit) |
| 7 | Penitent | Кающийся | + | Each night slept in a bed gives a 3% chance to lose one random negative talent. | M40 `RemoveRandomNegativeTalent`; M11 `SleepingManager` | DD Sanitarium, CK3 Contrite | a knotted penance cord | Оберег (prevents, this one cures) |
| 8 | Stubborn | Упрямец | 0 | The hero never develops new talents, good or bad. | M40 `TryDiscoverTalent` (early return) | RimWorld (adults never change), DD locked quirks | an oak stump with an axe stuck in it | opposite: Jaga Curse, Doomed |
| 9 | Changeling | Подменыш | 0 | Every 7 days one random talent of the hero turns into another random talent of the same sign. | M40 `RemoveRandomTalent` + `AddRandomTalent`; `WorldDateTime` day | folklore (подменыш) | an empty cradle | Stubborn |
| 10 | Late Bloomer | Поздний Цвет | + | Every new year of age raises the hero's weakest attribute by 2. | M37 `WorldDateTime.cs:70–90`; same rule as `HandleDoomBringerSkill` | CK3 ageing, BB Old (reversed) | a flowering branch on an old trunk | opposite: Forever Young |
| 11 | Jailbird | Острожник | 0 | Prison terms are half as long and cost no attributes, but fines for crimes are 50% higher. | M29 `CrimeManager.cs:789–810` | KCD2 Menace, Wartales prisoners | a broken shackle | Honest |
| 12 | Silver Tongue | Златоуст | + | Caught stealing, the hero buys freedom for a quarter of his gold instead of all of it. | M30 `CrimeQuestioning.cs:22–36` | KCD speech, Fallout 2 Good Natured | a golden tongue on a coin | opposite: Vulgar |
| 13 | Seafarer | Корабельщик | + | Sailing between ports costs half. | M36 `SailingManager.Sail`, `sailingPrice` | CK3 Pilgrim (travel) | a ship's prow carved as a horse head | — |
| 14 | Night-Hag Rider | Ночница | − | Sleep never gives Well Rested; for 5 min after waking the hero deals 10% less damage. | M11 `SleepingManager.cs:52–130` (Well Rested) | KCD Nightmares; folklore (kikimora, ночница) | a hag's hand on a pillow | opposite: Ранняя Пташка; Бессонный |
| 15 | Sleepwalker | Лунатик | − | After sleep the hero wakes up to 50 m from the bed in 20% of cases (sometimes outdoors in the rain). | M11 `SleepingManager`; `PlayerController` warp | KCD Somnambulant | a candle on a windowsill under the moon | tech risk: warp off the navmesh |
| 16 | Hearth-Friend | Домовитый | + | Sleeping in a tavern bed doubles Well Rested. | M35 `WorldState.isInTavern`; M11 Well Rested | folklore (домовой) | a bast shoe with a little domovoy in it | — |
| 17 | Winter-Born | Зимник | + | Frozen does not weaken the hero's fire spells; in winter Energy regenerates 25% faster. | M8 `CastSpell.cs:957–1008`; M9 `WorldTime.cs:141–152` | folklore (Морозко, Морана) | an icicle with a red thread | Закалённый (wet) |
| 18 | Noonwraith's Mark | Меченый Полуденницей | − | From 12:00 to 14:00, outdoors and in summer, Energy drains twice as fast. | M13 `PlayerStats.cs:290–330`; `WorldTime` hour, indoors flag | folklore (полудница); DD location quirks | a sickle against the noon sun | opposite: Солнечный (idea 19) |
| 19 | Blood-Moon Child | Дитя Кровавой Луны | 0 | During a Blood Moon the hero deals 30% more damage, but healing on him is 30% weaker. | M38 `WorldEventEnum.BloodMoon1–5` | DD light quirks | a red crescent moon | — |
| 20 | Kupala Seeker | Купальский Искатель | + | On Kupala Night every plant the hero picks comes in threes. | M38 `KupalaNight`; `GroundItemInteraction` plant pick | folklore (Kupala Night, fern flower) | a glowing fern flower | Herbalist (33% double) |
| 21 | Ancestor-Keeper | Поминальщик | + | During Dziady the undead deal half damage to the hero. | M38 `Dziady`; `Fractions.Undead` | folklore (Dziady) | a bowl of kutia with a candle | — |
| 22 | Unclean-Bane | Нечистобой | + | Silver hurts beasts (`IsBeast`) ×2 instead of ×1.5 in the hero's hands. | M6 `CharacterStats.cs:1465–1470` | Witcher-style silver; folklore | a silver nail | — |
| 23 | Garlic-Eater | Чесночник | + | A vampire's bite never gives the hero Vampire Blood or Vampirism. | M7 `AIVampire.cs:127–135` | folklore (garlic against the upyr) | a garlic braid | opposite: Vampire Blood, Vampirism |
| 24 | Teetotaler | Трезвенник | 0 | The hero never gets drunk, but drinks give him no other effect. | M12 `ConsumeManager.cs:76–83` (Drunk buff) | RimWorld Teetotaler, CK3 Temperate | an overturned mug | opposite: Drunkard, Poor Drinker, Tipsy Brawler |
| 25 | Faster | Постник | + | While hungry (hunger below half), the hero's Mana regenerates 25% faster. | M10 `currentHunger`; mana regen | CK3 Inappetetic, Wartales Ascetic; Orthodox fasts | a crust of bread on an empty plate | opposite: Hunger Curse |
| 26 | Merchant's Son | Купеческий Сын | + | Traders hold twice as much gold when dealing with the hero, so they accept bigger sales. | M15 `StorageManager.cs:4785, 4796` (trader purse) | KCD barter | a fat purse with a merchant's tamga | Торгаш (prices, not purse) |
| 27 | Iron-Sinewed | Двужильный | + | Overloaded fast travel costs no extra food or time. | M16 `WorldMap.cs:3091, 3121` | Wartales Like a Horse | a yoke with two buckets | Ходок (all travel) |
| 28 | Smith's Apprentice | Подмастерье | + | Every forge can upgrade the hero's items one level higher. | M18 `StaticForgeInterface.cs:165, 555` | Wartales professions | a pair of tongs | Кузнечья Хватка (price) |
| 29 | Lucky Brewer | Удачливый Варщик | + | A Failed Potion always heals the hero 100 health and never takes it. | M19 `ConsumeManager.cs:456–477` | Fallout 2 Chem Resistant (reversed risk) | a cracked flask with a four-leaf clover | Bad Cook |
| 30 | Pit Fighter | Ямный Боец | + | Death Pits pay 50% more; inside the pits the hero deals 10% more damage. | M33 `DeathPitsQuest.cs:97–235` | BB Pit Fighter, Arena Veteran | a bloody sand-pit rope | Prominent (gained there) |
| 31 | Green Thumb | Огородник | + | The hero's plantings grow twice as fast and can be planted in winter. | M21 `Planting.cs:100`, `RecordGardenPlanted` | PZ Gardener | a seedling in a clay pot | Herbalist (picking) |
| 32 | Cave-Delver | Пещерник | + | In caves and dungeons the hero deals 10% more damage; Cave Haste lasts twice as long. | M34 `DungeonsManager`; `CaveHaste` (`GodsFavorsManager.cs:627`) | DD Ruins Tactician, Warrens Explorer | a miner's lamp | opposite: #33 |
| 33 | Fear of the Deep | Боязнь Подземелий | − | In caves and dungeons the hero's maximum Bravery is halved. | M34; Bravery cap as in `PlayerStats.cs:1854–1863` | KCD Claustrophobia, DD Lygophobia, PZ Claustrophobic | a hand clawing at a cave wall | opposite: #32 |
| 34 | Skomorokh | Скоморох | + | Each hour in a tavern the hero earns 10 coins by playing for the guests. | M35 `isInTavern`; `WorldTime` hour | Wartales Bard; folklore (скоморохи) | a gusli | — |
| 35 | Vodyanoy's Debtor | Должник Водяного | 0 | Rare catches come twice as often, but at night deep water drains 2% of the hero's health per second. | M20 `FishingManager.cs:214–235`; deep-water swim; night | folklore (vodyanoy) | a fish with a green beard | Fisherman, Swimmer |
| 36 | Volkhv's Pupil | Ученик Волхва | + | Everything in the Gods' Favor shop costs the hero 1 Mercy less. | M28 `UIGodsFavorShop` | CK3 Mystic | a carved staff with a bird on top | — |
| 37 | Born in a Shirt | В Рубашке Родился | + | Once per in-game day a lethal blow leaves the hero with 1 health instead. | `CharacterStats` death check (like Velesov demigod, `CharacterStats.cs:2289`) | BB Survivor; Russian idiom | a white linen shirt | Survivor (30% per blow, this one is certain but once a day) |
| 38 | Dreamer | Сновидец | + | Each Dream Flower counts as two for Mercy. | M24 `GodsFavorsManager.cs:655–688`; M39 `RecordDreamFlowerPick` | the game's own dream theme | a blue dream flower | — |
| 39 | Kleptomaniac | Клептоман | − | When the hero trades, an item from the counter slips into his bag 5% of the time. That counts as a theft and the trader may notice. | M15 `StaticTradeInterface`; M30 `CrimeManager` | DD Kleptomaniac | a hand in a sleeve with a spoon | Thief |
| 40 | Turncoat | Перебежчик | + | Faction entry thresholds for Order and Chaos are halved for the hero. | M27 `FactionsManager.cs:100–106` | Kenshi Traitorous, Bannerlord Honor −2 | a two-coloured banner torn in half | Honest |

**Notes on the table.**
- Rows 15 (warp after sleep) and 39 (theft in the trade window) touch fragile code. They need a technical check before the owner judges
  the idea.
- Rows 19–21 rely on knowing that a world event is active now. `WorldEventEnum` lists the events; the query is not read yet.
- Row 3 depends on whether Puppet Lord already buffs followers (`SummonsManager` keeps summons and followers apart: `GetAllSummons` vs
  `_followers`). That needs reading `Puppet Lord` in `CharacterStats`.

## 5. Earned-in-play ideas

**Is runtime adding proven? Yes, by decompilation, not by the map.** `TryDiscoverTalent` adds a talent mid-game and shows "Talent
developed: …" (`TalentsManager.cs:305–371`). The talent lives in the save (plan 27: "talents live in the save"). Open questions:
1. **New ids.** `PlayerTalentId` is a game enum. Our talents need ids outside its range. Check that the save writes an unknown int and
   reads it back, and that `availablePlayerTalents` (a `List<PlayerTalent>` with an icon `Sprite`) accepts our entries at start.
   **Answered 2026-10-17 (decompilation, `sv_full` + `Assembly-CSharp-firstpass.dll`):**
   - *Write/read — yes.* `SaveFile.cs:491` fills `playerTalentIds` from `TalentsManager.GetPlayerTalentIds()` (the keys of
     `aquiredPlayerTalents`); the serializer is `Plugins.SaveGame.Serializers.SaveGameBinarySerializer` = plain `BinaryFormatter`, which
     stores an enum as its int and reads any int back (no range check).
   - *Load — breaks without our entry.* `LoadSaveGameManager.cs:318` → `InitializePlayerTalents` → `AddPlayerTalent` (`TalentsManager.cs:626`):
     `availablePlayerTalents.Where(id).FirstOrDefault()` returns null for an unknown id and line 631 reads `playerTalent.playerTalentId` —
     NullReferenceException. The load sequence has no try/catch there, so the steps after line 318 (almanac, progress, achievements) never
     run. A save holding our id therefore needs our `PlayerTalent` registered in `availablePlayerTalents` BEFORE line 318, and it is broken
     the day the mod is off. `HandleTalentStats` (`:758`) is a `switch` — an unknown id falls through harmlessly.
   - *Design consequence `[AI]` (to confirm with the owner when new traits are picked):* keep our traits OUT of the game's list — our own
     per-slot file written in the same moment as the game's save (postfix on the `SaveFile` build at `:491`), loaded after line 318; plus a
     prefix on `InitializePlayerTalents` that drops ids it cannot resolve (insurance for a save that already holds one). The save stays
     loadable with the mod removed. Pitfall: a new file next to `saveFile-0` — `tools/save-check.sh` compares 7 named files; teach it the
     new name before the first run.
2. **Counters.** Each idea below needs a counter. `ProgressManager.Record*` (31 methods: kills, crafts, fish, plants, hours slept,
   gold gambled, stolen items, corpses looted, weapons used, gods' favors…) is the natural place to patch; our counters go into our own
   save file.

The game's own rate is 0.1–5% per event. A counter plus a chance per step (the Wartales pattern) keeps the "developed" moment rare and
earned.

| # | Trait | How it is earned (trigger → chance) | Native hook | Pattern from |
|---|---|---|---|---|
| E1 | Dreamer / Сновидец (#38) | every Dream Flower after the 21st → 5% | `RecordDreamFlowerPick` | Wartales counter |
| E2 | Pit Fighter / Ямный Боец (#30) | all Death Pits fights won → 50% | `DeathPitsQuest.cs:238` (already rolls Prominent at 0.5 there) | BB Arena Veteran |
| E3 | Jailbird / Острожник (#11) | each completed prison term after the second → 20% | `CrimeManager.SetupPrison`, `:822–824` (already rolls Prominent, Fate's Gambit, Spartan after a term) | Wartales prisoners |
| E4 | Unclean-Bane / Нечистобой (#22) | each kill of an `IsBeast()` enemy with a silver weapon after the 50th → 1% | `RecordKill` + `IsBeast()` | Wartales Duellist (100 attacks) |
| E5 | Cave-Delver / Пещерник (#32) | the third cleared cave → 30% | `GodsFavorsManager.cs:627` (CaveHaste counter) | DD location quirks |
| E6 | Beast Tamer / Укротитель (#4) | each petting after the 20th → 2% | `AIAnimal.cs:160` (petting XP) | Wartales Raised by Boars |
| E7 | Teetotaler / Трезвенник (#24), and loss of Drunkard | 30 in-game days without a drink → 10% per day; the same streak removes Drunkard | `RecordDayPass` + `ConsumeManager` drink | BB Addict, Wartales Drunkard (lost by abstinence) |
| E8 | Night-Hag Rider / Ночница (#14), negative | each conversation with a rusalka or fight with a Screamer → 5% | `ConversationRusalka.cs:31–33`, `AIScreamer.cs:97–98` (already roll Traumatized) | DD stress quirks |
| E9 | Iron-Sinewed / Двужильный (#27) | each overloaded fast travel after the 10th → 3% | `WorldMap.cs:3091` overload check + `WorldMap.cs:3154` (rolls Spartan after every long fast travel; the overload condition is ours to add) | Wartales Like a Horse |
| E10 | Penitent / Кающийся (#7) | the third visit to the Faith Confessor → 25% | `TrainersFaithConfessor.cs:42` | CK3 Contrite |

## 6. Sources

**Our side (read-only):**
- `KUMM/games/SvarogsDream/GAME_ARCHITECTURE_INTERNAL_MAP.md` (sections 1, 3.1–3.3, 3.6)
- `KUMM/ideas/19_svarog_new_hero_traits_50.md` · `KUMM/plans/27_svarog_random_hero_traits.md`
- `SvarogsDream/translation/talents_en.tsv` (95 talents with descriptions) · `SvarogsDream/translation/glossary_talents.tsv` (Russian names)
- Decompilation of `Assembly-CSharp.dll` (scratchpad of an earlier session, not in the repo): `TalentsManager.cs`, `PlayerTalent.cs`,
  `ProgressManager.cs`, `WorldDateTime.cs`, `CreditManager.cs`, `SummonsManager.cs`, `Follower.cs`, `FollowerName.cs`, `SailingManager.cs`,
  `Virtues.cs`, `WorldEventEnum.cs`, `GameSave/SaveFile.cs`, plus a grep of every `TryDiscoverTalent` call

**Games:**
- Darkest Dungeon — https://darkestdungeon.wiki.gg/wiki/Quirks
- Battle Brothers — https://battlebrothers.fandom.com/wiki/Traits · https://battlebrothers.fandom.com/wiki/Permanent_Injuries
- RimWorld — https://rimworldwiki.com/wiki/Traits
- Wartales — https://wartales.fandom.com/wiki/Traits
- Crusader Kings 3 — https://ck3.paradoxwikis.com/Traits
- Kingdom Come: Deliverance — https://kingdomcomedeliverance.fandom.com/wiki/Hardcore_Mode · https://kingdomcomedeliverance.fandom.com/wiki/Hardcore_Mode/KCD2
- Stoneshard — https://stoneshard.fandom.com/wiki/Traits · https://stoneshard.fandom.com/wiki/Injuries · https://stoneshard.fandom.com/wiki/Psyche
- Mount & Blade II: Bannerlord — https://mountandblade.fandom.com/wiki/Personality_Traits
- Project Zomboid — https://pzwiki.net/wiki/Traits
- Kenshi — https://kenshi.fandom.com/wiki/Personality · https://kenshi.fandom.com/wiki/Toughness
- Fallout 2 — https://fallout.fandom.com/wiki/Fallout_2_traits

**Folklore (Wikipedia):** https://en.wikipedia.org/wiki/Domovoy · https://en.wikipedia.org/wiki/Kikimora ·
https://en.wikipedia.org/wiki/Leshy · https://en.wikipedia.org/wiki/Vodyanoy · https://en.wikipedia.org/wiki/Rusalka ·
https://en.wikipedia.org/wiki/Lady_Midday · https://en.wikipedia.org/wiki/Bannik · https://en.wikipedia.org/wiki/Likho ·
https://en.wikipedia.org/wiki/Volkhv · https://en.wikipedia.org/wiki/Kupala_Night · https://en.wikipedia.org/wiki/Dziady

Fandom pages block the WebFetch tool (HTTP 402). They were read through the MediaWiki API (`api.php?action=parse`) with curl.
