# Recon — Svarog's Dream: what each inventory stat does (for the «?» tooltips, ideas/07 p. 32)

> **Created:** 2026-10-07 · **Parent:** ideas/07 p. 32 · **Status:** recon done · **Outbound:** tooltip texts to the owner
>
> Source: the decompiled game code (ilspycmd of `Assembly-CSharp.dll`) in the session scratchpad `acs/`. Every `File.cs:N` below
> is a line in that dump that was actually read. Game strings quoted as "game's own text" come from game assets captured by
> XUnity AutoTranslator into the build repo `D:\work\ai_sandbox\SvarogsDream\translation\` and `_config\xunity\` (cited by file:line),
> or from string literals in the code. Nothing here was checked in a running game. Anything not read directly is marked
> **inferred**.

## How the panel is filled

`GameUI/UserInterface.cs:113-192` `WritePlayerStats()` runs when the inventory opens (`:106`) and after equipment slot updates
(`:439`, `:574-636`, `:692`). The numbers are therefore a snapshot of the moment: state that changes while the panel is open
(walking, drawing the weapon, day/night) does not refresh them on its own.

## The shared hit pipeline (needed to read every stat)

One auto-attack (melee swing, arrow, staff bolt) sends a `Damage` struct with four parts (blunt, slashing, piercing, magic) to
`CharacterStats.TakeDamage` (`CharacterStats.cs:1205`). The struct is `GetAverageDamage()` (`CharacterCombat.cs:296`, `:413`;
arrows `:706-715`). Order inside `TakeDamage`:

1. **Block roll.** Only for non-spell damage, only if the defender's block chance > 0 (`CharacterStats.cs:1243-1258`). A block
   cancels the whole hit (see Block chance).
2. **Per-type class bonuses** (flat, player as attacker or receiver), e.g. Blademaster +2 slashing per point (`:1317-1320`),
   Defender −1% blunt taken per point (`:1290-1293`).
3. **Armor per type.** Each damage part is cut by the defender's reduction % for the same type:
   `part × (1 − GetDamageReductionPercentage(armorOfThatType)/100)` (blunt `:1299`, slashing `:1326`, piercing `:1339`,
   magic `:1374`). The four results are summed.
4. Beasts/undead at night (outside dungeons) take ×0.75 (`:1376-1379`, `:403-410`).
5. **Random spread ±10%**: `AddOrRemovePercentageToNumber(num, 10f)` (`:1380`; `UtilMethods.cs:35-40`).
6. `IgnoreDamageBuff` % reduction (buffs) (`:1394`), round to int (`:1395`).
7. If the player is the attacker: a long chain of multipliers (sigils, talents, elements), **including the crit roll ×2**
   (`:1497-1505`) (`:1402-1905`).
8. If the player is the receiver: stagger (`:1930-1933`), shield HP absorbs (`:1944-1958`), Iron Will etc.

The same `TakeDamage` serves spells and abilities (with `isSpellDamage = true`), so armor applies to them too; only the block roll
is skipped for spells.

---

## 1. Movement speed (`PlayerMovementSpeed`)

**Display.** `Math.Round(GetMovementSpeed(), 1)` with no unit (`UserInterface.cs:122`).

**Formula.** `PlayerStats.GetMovementSpeed()` (`PlayerStats.cs:1627-1732`):
- dead or disabled → 0 (`:1629-1636`);
- animal form → animal speed × animal buff + terrain buff + bonuses (`:1654-1672`);
- deep water → 4 (9 with the Natural Swimmer talent) × (1 + Floater sigil + Swimming Ring) (`:1673-1689`);
- weapon drawn (`WorldState.isEquiped`): `defaultMovementSpeed × EquipedArmorMovementSpeedMultiplier + MovementSpeedBuff +
  TerrainSpeedBuff + bonuses` (`:1714-1721`);
- weapon hidden: the same **+1**, plus Traveler sigil (on a road) and Runner sigil (`:1722-1731`).
- `defaultMovementSpeed = 9f` (`CharacterStats.cs:196`). That is the field default; the player prefab could override it (not
  checked).
- Gear: each item adds `(MovementSpeedMultiplier − 1)` to the armor multiplier, which starts at 1.0 (`EquipmentHandler.cs:839`,
  `:939`). The item tooltip shows it as `Movement Speed: N%` (multiplier ×100) (`GameUI/ItemToolTip.cs:204`).
- Bonuses (`PlayerStats.cs:1637-1713`): Shadow Jump +10, cave exit +8, Rogue points/5 at night, Trapper points/20 by day, Speedy
  sigil/10, Rapid sigil, Perun's buff up to +10 by missing HP, out-of-combat bonus +5, Stone Skin −1, `isIncreasedSpeed` +5; with
  the weapon drawn and in combat, Rogue points/10 (integer division).

**Use in play.** The number is the NavMeshAgent speed, in world units per second (`PlayerController.cs:149`, `:265`). The game calls
its distances meters ("scout your surroundings, up to 150m", `LoadingScreen.cs:33`), so this is **≈ m/s (inferred)**. Modifiers
that are applied on top and **not shown** in the panel:
- sprint (hold Shift, needs energy) ×1.5 (`PlayerController.cs:231-234`);
- walk mode (hold N, key `SwapWalk`) = `GetDefaultMovementSpeed()/3`, so 3 (`PlayerController.cs:147-157`;
  `ControllsManager.cs:35`, `:168-183`);
- 0 during an attack animation or spell channel (`:158-165`);
- ×0.5 while staggered (`:186-190`); 0 while stunned or resting (`:250-257`).

**Caps.** None in the formula; no floor or ceiling.

**Game's own text.** "When moving around, you will move faster with the weapon removed (Caps Lock)"
(Help, `SvarogsDream/_config/xunity/zz_krinik_help.txt:6`). "The player character moves 10% faster out of combat."
(`LoadingScreen.cs:32`). "You move faster by walking on roads and slower by going through water." (`LoadingScreen.cs:30`). The
code gives "+1" when the weapon is hidden, which is about 11% of 9.

---

## 2. Max health (`MaxHealth`)

**Display.** `GetMaxHealth()` as an integer (`UserInterface.cs:124`).

**Formula.** Human form (`PlayerStats.cs:1471-1491`):
`50 + 10·Strength + 20·Endurance + gear Bonus HP + extras`, where Strength includes item bonuses (`GetStrength()`,
`PlayerStats.cs:138-141`). Endurance has no item buff field. Extras:
- Colossus talent +300;
- **+1000 when the difficulty is none of Challenging / Hard / Challenging+** (`:1478-1481`; `DifficultyManager.cs:83-90`);
- Defender class +10 per point;
- Dolorous Endurance × number of negative talents.

Animal form: the animal's health, plus Endurance/30 scaling under Feral Rage, ×2 with Wild Blooded (`:1460-1469`). Gear Bonus HP
grows with quality (`ItemStats.cs:168-178`).

**Use in play.** The size of the health pool; incoming damage after the pipeline above is subtracted from current health. The
health-to-damage ratio also scales Endurance XP gain and blood/voice effects (`CharacterStats.cs:1934-1943`).

**Caps.** None.

**Game's own text.** "Benefits per point: +0.5 blunt and slashing damage / +10 maximum health / +Boosts warrior skills / +2 carry
weight" (Strength) and "+20 maximum health / +1 maximum energy" (Endurance) (`SvarogsDream/translation/untranslated.txt:9051`,
`:9057`). The older code tooltip `GameUI/UIAttribute.cs:19` says "+10 Max Health / +5 Weight carry / +1 Slashing damage". The
code gives +2 carry per Strength (`PlayerStats.cs:155`), so that older tooltip is wrong on weight.

---

## 3. Block chance (`BlockChance`)

**Display.** `GetBlockChance()` + "%", grey if 0, green otherwise (`UserInterface.cs:125-126`).

**Formula.** Sum of `blockChance + quality` over every equipped **armor-slot** item that has block (shields, possibly other gear)
(`EquipmentHandler.cs:935`, `:981`; `ItemStats.cs:128-135`). 0 in animal form (`PlayerStats.cs:1845-1852`). No attribute or
class term.

**Use in play.** In `TakeDamage`, if the hit is **not spell damage** and block > 0:
`hit = Random.Range(1,101) > block` (`CharacterStats.cs:1243-1245`), i.e. exactly `block`% chance to block. Extra forced blocks
for the player: Shield Expert talent 10% (`:1248-1251`) and Shield Up buff (`:1252-1256`). Both live inside the same
`block > 0` check, so they need some block chance first.

A blocked hit is **fully negated**. Everything (damage, stagger, morale loss, on-hit effects) sits inside `if (flag)`. The else
branch only shows the "blocked" pop-up and plays the shield sound (`:2484-2491`).
- Blockable: melee auto-attacks (`CharacterCombat.cs:413`), arrows (`Arrow.cs:326`, `:362`, `:371`, all `isSpellDamage: false`),
  staff bolts (`Spell.cs:151`).
- Not blockable: abilities/spells (`isSpellDamage: true`).
- Enemies use the same rule with their own block value (`CharacterStats.cs:472-475`).
- Side effect: while a block item is equipped, the Prescient sigil adds its level to **armor** (`CharacterStats.cs:454-457`).

**Caps.** No cap in code. Block ≥ 100 means every non-spell hit is blocked (the roll tops out at 100).

**Game's own text.** "Shields give you the chance to block attacks, but they reduce your damage and attack speed. Using a shield
trades a percentage of your offense for defense." (Help damage page, `SvarogsDream/translation/translated.tsv:53`). The code
formulas have no shield penalty term, so the penalty would come from the shield items' own attack-speed or damage multipliers
(**inferred**, item data not read). "Defender gains a bonus to blocking chances with shields and gear that provides block
chances." (`untranslated.txt:9236`). The Defender class code read here (`PlayerStats.cs:1482-1485`, `CharacterStats.cs:1290-1293`)
gives HP and blunt resistance, not block. Where that text's effect lives was not found.

---

## 4–7. Blunt / Slashing / Piercing / Magic armor (`BluntArmor` … `MagicArmor`)

**Display.** `GetDamageReductionPercentage(armor)` + "%". It is a float, so values like "47.5%" are possible
(`UserInterface.cs:127-134`). Grey if the **raw armor** is 0.

**Formula.** Raw armor per type = sum of the equipped items' `BonusXArmor + (quality·Bonus)·0.05 + quality`
(`EquipmentHandler.cs:931-934`; `ItemStats.cs:194-201`). Reduction curve (`CharacterStats.cs:450-470`), piecewise linear with
diminishing returns:

| raw armor | reduction % |
|---|---|
| ≤ 20 | = armor (1 : 1) |
| 20 – 60 | 20 + (a − 20)·0.5 → 40 at 60 |
| 60 – 140 | 40 + (a − 60)·0.25 → 60 at 140 |
| 140 – 300 | 60 + (a − 140)·0.125 → 80 at 300 |
| 300 – 460 | 80 + (a − 300)·0.0625 → 90 at 460 |
| > 460 | 90 (flat) |

Player additions inside the same function: Prescient sigil adds its level to armor while a block item is worn (`:454-457`).
Perun's buff adds `(int)(protection × missingHP%) × 100` armor (`:458-461`). Because of the `(int)` cast that term is 0 until the
product reaches 1 (**code reading; looks like a bug**). Armor penetration stacks on the defender (`armorPiercingCounter`) cut the
reduction by 10% per stack (`:465-468`). For the player these are 0, since they are applied to enemies by the player's Marksman
points and Overwhelming sigil (`:1700-1707`).

**Use in play.** Each incoming damage part is reduced by the % of the **matching** armor type only (pipeline step 3). Armor of one
type does nothing against another type. A mixed hit (e.g. slashing + magic) is reduced part by part. Applies to auto-attacks and
spells alike. The same curve applies to enemies: your blunt damage against a skeleton is cut by the skeleton's blunt-armor %.
Negative raw armor gives a negative % (≤ 20 branch returns `armor` itself), so damage taken goes **up** (code reading).

**Caps.** 90% at raw armor ≥ 460, and it never grows further.

**Game's own text.** "Enemies have specific types of armor, and certain damage types will work better against them. For instance,
skeletons will be weak to blunt damage and strong against piercing damage. You can also have your own armor, which depends on the
gear you are wearing. Armor is scaled, and it becomes less effective the more you have. It can never reach 100% immunity on its
own." (`translated.tsv:53`). The item tooltip shows raw armor ("Blunt Armor: N", `ItemToolTip.cs:180-192`), while the panel shows
the resulting %.

---

## 8. Attack range (`AttackRange`)

**Display.** `GetAttackRange()` as an integer, grey if < 3, green if ≥ 3 (`UserInterface.cs:135-136`).

**Formula.** `2 + EquipedWeaponRange + AttackRangeBuff + talents` (`PlayerStats.cs:1803-1834`):
- weapon `range` from the main-hand item (`EquipmentHandler.cs:848`);
- with a ranged or mage stance and weapon range > 3: Missing Eye −2, Sixth Sense +2, Distant Hunter +7 (bow stance only)
  (`:1814-1828`);
- dual wield: the shorter of the two weapons' ranges (`:1829-1832`);
- animal form: the animal's range (`:1809-1812`).

The item tooltip shows the weapon part as "Range: N" (`ItemToolTip.cs:176`).

**Use in play.**
- **Approach distance:** when you click an enemy, the player walks until `distance ≤ enemy body radius + AttackRange`, then
  attacks (`PlayerMotor.cs:262` stopping distance; `Interactable.cs:26`). Units are world units, ≈ meters (**inferred**, see
  Movement speed).
- **Bow/staff:** when the arrow or bolt is released and the target is farther than `AttackRange`, the shot animation is stopped
  (`CharacterCombat.cs:663-666`, `:717-720`). Whether that also cancels the projectile was not traced.
- **Player melee:** no distance check once the swing lands, except against the Witch (`CharacterCombat.cs:83`, `:299`).
- **Enemy melee on the player:** misses if the player is outside a circle centered `range/2` in front of the attacker with
  radius `range/2 + bodySize + 1` (`CharacterCombat.cs:376`), so stepping back dodges. NPC vs NPC works the same way (`:449`).

**Caps.** None.

**Game's own text.** "Range equals the shorter weapon's range." (dual wield, `untranslated.txt:10731`). No general text found.

---

## 9. Attack speed (`AttackSpeed`)

**Display.** `Math.Round(GetAttackSpeed(), 2)`, with "*" appended when dual-wielding (`UserInterface.cs:137-144`).

**Formula.** `PlayerStats.GetAttackSpeed()` (`PlayerStats.cs:1743-1801`):
`0.5 + Dexterity/50 + EquipedAttackSpeedMultiplier + AttackSpeedBuff + misc`.
- `EquipedAttackSpeedMultiplier` starts at 1.0 and every item adds `(AttackSpeedMultiplier − 1)` (`EquipmentHandler.cs:838`,
  `:938`), so a naked hero with 0 Dexterity is 1.5.
- Dexterity includes item bonuses (`PlayerStats.cs:148-151`).
- Misc: unarmed +1; Berserk potion +0.5; Berserker talent while berserking +0.5; Vampire Blood +0.3 at night / −0.1 by day;
  Broken Hand −0.1; Fencer sigil (one-hander without shield) +level%.
- Floor: **0.33** (`:1791-1794`).
- Dual wield, after the floor: `× (0.4 + DualWieldingUpgrade1/100)` (`:1795-1799`).
- Animal form: the animal's attack speed + night/Feral Rage bonuses (`:1746-1765`).

**Use in play.** The time between auto-attacks is `defaultWaitTime / attackSpeed` with `defaultWaitTime = 2` s
(`CharacterCombat.cs:15`; `UtilMethods.cs:42-45`):
- melee `2/AS` s (`CharacterCombat.cs:135-137`);
- bow `2/AS − 0.15` s (`:113-119`);
- staff/mage stance `2/(0.8·AS)` s (`:127-129`).

So **AS = 1 means one attack every 2 s; AS = 2 means one per second**: attacks per second = AS/2. AS also speeds up the swing
animation itself (`AnimationController.cs:130-149`) and the bow draw (`PlayerRangedCombat.cs:233`, `:260`). For the player the
pending countdown is clipped to 4 s whenever `Attack()` is called (`CharacterCombat.cs:79-82`). If `Attack()` is called repeatedly
while engaging, intervals above 4 s (AS below 0.5) are shortened to 4 s (**inferred**, call frequency not traced).

**Caps.** Floor 0.33 before the dual-wield penalty, so dual wield can go lower. No ceiling. Animation variety drops above AS 4
(`CharacterCombat.cs:188-195`).

**Game's own text.** Dexterity: "Benefits per point: +2% attack speed / +1 piercing damage / +Boosts hunter skills"
(`untranslated.txt:9056`). +2% is relative to 1.0, which matches `Dexterity/50`. The older code tooltip says "+1 Attack Speed"
(`GameUI/UIAttribute.cs:25`), which is wrong. Dual wield: "Combined damage and attack speed are reduced by 60%. … When
dual-wielding, instead of attacking once, the character randomly slashes 2-3 times." (`untranslated.txt:10731`). Item tooltip:
"Attack Speed: N%" = item multiplier ×100 (`ItemToolTip.cs:194-197`).

---

## 10–13. Blunt / Slashing / Piercing / Magic damage (`BluntDamage` … `MagicDamage`)

**Display.** The four parts of `GetAverageDamage()`, `Math.Round(x, 2)`, grey if 0 (`UserInterface.cs:117`, `:146-153`). Unarmed:
the blunt number is redrawn with the Brawler sigil, Brawler Ring ×2 and Tipsy Brawler (drunk) ×2 applied (`:158-177`).

**Formula** (`PlayerStats.cs:1493-1555`). `W_x` is the weapon's damage multiplier for that type (tooltip "Blunt Damage: x1.2",
`ItemToolTip.cs:158-173`). It grows +5% per quality step, or +2.5% for multi-type weapons (`ItemStats.cs:74-81`). Skills are the
four weapon masteries (`BluntDamage`… fields on the player = mastery levels; `CharacterSelectionManager.cs:196-199`):
- **Blunt** = `W_blunt × (2·BluntMastery + 0.5·Strength + buff + 3·bluntPotion)`
- **Slashing** = `W_slash × (2·SlashMastery + 0.5·Strength + buff + 3·slashPotion)`
- **Piercing** = `W_pierce × (3·PierceMastery + 1·Dexterity + buff + 4·piercePotion)`
- **Magic** = `W_magic × (3·MagicMastery + Intelligence + buff + 3·magicPotion)`
- Unarmed: blunt only = `0.3 × (2·BluntMastery + Strength) + BluntDamageBuff` (`:1521-1527`).
- Berserk potion ×1.5 blunt and slashing (`:1535-1539`). Dual wield: every part × `(0.4 + DualWieldingUpgrade2/100)`, and ×0.5
  more with Injured Shoulder (`:1540-1553`).
- Animal form: the animal's base damage + Strength/2 blunt + SlashingMastery/2 + soul level to slashing, with Feral Rage scaling
  (`:1499-1520`).

A weapon only deals the types it has a multiplier for (`W = 0` → 0).

**Use in play.** This struct is the **per-hit** damage of each auto-attack before the enemy's armor (`CharacterCombat.cs:296`,
`:413`; arrows `:706-715`). After it come the flat class bonuses, the target's matching armor %, ±10% spread, crit and the many
talent/sigil multipliers (pipeline above). Many abilities also start from it (e.g. `CastSpell.cs:1259`, `:1304`, `:4319`). Damage
type matters only through the target's armor of the same type: a blunt hit on a skeleton is weakly reduced, a piercing one
strongly (game text below).

**Caps.** None.

**Game's own text.** "Damage can come in four types: blunt, slashing, piercing, and magic. The final damage is calculated based on
your attribute skill with certain types of weapons multiplied by the weapon multiplier. For example, you can possess the best bow
in the world and still deal more damage with a wooden sword because you are proficient with slashing and not with bows. Each skill
can be improved through the use of a weapon of that type." (`translated.tsv:53`). Mastery per point: "+2 blunt damage", "+2
slashing damage", "+3 piercing damage", "+3 magic damage" (`untranslated.txt:9054`, `:9055`, `:9059`, `:9058`). These match the
code coefficients.

---

## 14. Critical chance (`CriticalChance`)

**Display.** `GetCriticalChance()` as an integer + "%", grey if 0 (`UserInterface.cs:154-156`).

**Formula** (`PlayerStats.cs:1557-1586`):
`item crit (each: criticalChance + 2·quality, ItemStats.cs:119-126) + Fanatic stance 50 + Fate's Gambit 10·negativeTalents +
Fortune class points + Vulgar 5`. `isSureCritical` (set by an ability, `CastSpell.cs:1341`) returns 100.

**Use in play.** Only when **the player** deals the hit (melee, arrows, abilities alike; summons do not crit):
`Roll(crit/100)` → final hit **×2** (`CharacterStats.cs:1497-1505`). It is applied after armor and most multipliers, so it
doubles the final number.
- It can stack with the Projectile Velocity sigil ×2 (20% at > 7 m) and the Precise sigil ×2 on bleeding targets. Two doubles show
  "CRITICAL X2" (`:1492-1514`, `:1733-1739`).
- A crit also triggers Overkill bonus % and Critical Hit bleeding (`:1721-1732`).
- The "revenge critical" is a separate roll (`:1758-1762`), not part of this stat.

**Caps.** No cap in code. `Roll` draws from `Random.Range(0, 1.01)` (`UtilMethods.cs:58-62`), so the real chance is ≈ crit/101:
100% shown is ≈ 99%, and ≥ 101 is guaranteed.

**Game's own text.** Fortune: "+N% critical chance" (`GameUI/UIMainMasteryPage.cs:263-268`). Revenge: "If you die to an enemy,
the next time you face the same enemy, you get a 10% revenge critical chance for each death." (`zz_krinik_help.txt:8`). The code
rolls `0.25 × revengeCounter` (`CharacterStats.cs:1758`), and the counter goes up by 1 per event, +3 for the God of War quest target
(`:3048-3054`). So the code gives about 25% per death, not 10%; which event increments it was not traced.

---

## 15. Resulting damage (`ResultingDamage`, «Суммарный урон»)

**Display.** (`UserInterface.cs:157-186`)
```
num = (blunt + slashing + piercing + magic) * GetAttackSpeed() * (float)(1 + criticalChance / 100)
```
Then, unarmed only: Brawler sigil +level%, Brawler Ring ×2, Tipsy Brawler while drunk ×2 (`:158-175`). Round to 2 decimals. Then
**not** dual-wielding: show `num / 2`; dual-wielding: show `num` with "*" (`:178-186`).

**What it means.** Since one attack takes `2/AS` s, `sum × AS / 2` is the **damage per second of auto-attacks before enemy armor**.
Dual wield is not halved because each dual swing lands 2–3 slashes (game text in Attack speed). So the "*" value assumes about 2
hits per swing (**inferred**).

**Bug.** `criticalChance / 100` is **integer division**: for any crit below 100 it is 0, so the factor is 1. **The shown number
ignores crit chance** until crit reaches 100 (then ×2). The game text says crit is included.

Not included: enemy armor, ±10% spread, flat class bonuses (Blademaster, Marksman, Berserker …), talents, sigils, elements, crit
(see bug).

**Caps.** None.

**Game's own text.** "The resulting damage is the average damage per second, calculated by the formula (attack speed * critical
chance * weapon damage * attributes). It does not account for passives, talents, or enemy defense." (`translated.tsv:2583`;
likely the panel's own hover tip; its prefab/object was not identified).

---

## 16. Camouflage (`Camouflage`)

**Display.** `GetCamouflage()` as a float, shown as e.g. "-9" or "15" (`UserInterface.cs:188`).

**Formula** (`PlayerStats.cs:1597-1625`):
`Σ armor items' Camouflage (EquipmentHandler.cs:946, armor slots only) + extras`:
- Prominent talent −20;
- Hunter class +2 per point;
- Stealthy sigil +level at night;
- walking (hold N) **+15**, and +50 more with Elusive Step.

Animal form: the animal's camouflage + terrain bonus (grass/water +20…+50, some surfaces −5) (`AnimationFootstepSounds.cs:205-252`).
Negative values come from gear with negative Camouflage and/or Prominent. The item tooltip shows "Camouflage: N"
(`ItemToolTip.cs:256`).

**Use in play.**

1. **Noticing a hostile player** (`AIDecisionMaker.cs:229-237`; same rule in `AIAnimal.cs:394-409`, `AIUnderworld.cs:323-339`).
   An enemy learns of you through its trigger collider (`AIDecisionMaker.cs:533-552`) and keeps tracking you within its track
   radius: 20 m for human AI, 30 m for animals by default, +10 when alert (`AIDecisionMaker.cs:17`, `:450-457`; `AIAnimal.cs:37`,
   `:472-482`). While you are not "properly detected", each decision tick checks:
   `angle(enemy facing, direction to you) < 120 − (Camouflage + Clumsy(−20) [+ −20 if alert, underworld AI]) +
   enemy.bonusCamouflageDetection`.
   - It is a **vision cone, not a distance**. At 0 the enemy sees you anywhere within ±120° of its facing, with a 120° blind
     wedge behind it.
   - Each point of camouflage narrows the cone by 1° per side.
   - At about 120 the cone closes and you are never noticed by sight. Scripts, being hit and quests still force detection
     (`TrackPlayer`/`DetectPlayer`, `AIDecisionMaker.cs:505-514`).
   - **Negative** values widen the cone: −9 → ±129°, a 102° blind wedge. At ≤ −60 you are seen from every angle.
2. **Stealing** (`CrimeManager.cs:720-772`). A soldier or watcher catches you when you are within a distance band and inside its
   cone, the cone shrinking by camouflage/3:

   | distance | cone half-angle |
   |---|---|
   | < 5 m | 90° − C/3 |
   | < 10 m | 70° − C/3 |
   | < 15 m | 60° − C/3 |
   | < 20 m | 50° − C/3 |

   Bands are +5 m by day, −4 m with Thief, +4 m with Honest.
3. **Hunter first strike:** Unexpected sigil, damage + `Camouflage% × itemLevel` against a full-HP enemy
   (`CharacterStats.cs:1696-1699`).
4. Headhunter: heal on kill `100 × (1 + Camouflage/5)` (`CharacterStats.cs:2394-2400`).

**Caps.** None in the formula. Above ≈120 sight detection is impossible; below −60 sight detection is total (both follow from the
cone math, not from an explicit clamp).

**Game's own text.** "Your camouflage stat makes enemies harder to notice you initially. It also aids you in stealing. The
hunter's first attack also scales with camouflage." (`translated.tsv:53`). "With higher camouflage, you will have an easier time
stealing, and enemies will find it harder to notice you. On top of that, the damage of the first attack for the hunter class
scales with camouflage." (`zz_krinik_help.txt:7`). "Increased camouflage when walking." / "Has 20 lower camouflage, and villagers
will remember your crimes longer." (skill/talent texts, `translation/` dumps). Loading tip "Press caps lock to hide or show your
weapon for better stealth or combat." (`LoadingScreen.cs:29`) is **not supported by `GetCamouflage`**: hiding the weapon changes
speed, not camouflage. Walking (N) is what adds +15.

---

## Unknowns

- Whether the player prefab overrides `defaultMovementSpeed = 9` (`CharacterStats.cs:196`); the inventory number already includes
  it, so tooltips need not cite 9.
- Whether a bow/staff shot released beyond `AttackRange` is cancelled or only its animation stops (`CharacterCombat.cs:663-666`).
- How often `CharacterCombat.Attack()` is called while engaging, so whether the 4 s countdown clip really makes AS < 0.5 useless.
- How many hits a dual-wield swing really lands (game text: 2–3); the "*" ResultingDamage assumes 2.
- Where the "Defender … bonus to blocking chances" text is implemented; no such code was found in the methods read.
- Which event increments `revengeCounter` (`CharacterStats.cs:3048-3054`); the code reads as 25% per count against the "10% per
  death" text.
- Which UI object shows the "resulting damage is the average damage per second…" text (`translated.tsv:2583`); it is in assets,
  not in code.
- Shield items' own attack-speed or damage multipliers (the help says shields cost offense); item data was not read.
