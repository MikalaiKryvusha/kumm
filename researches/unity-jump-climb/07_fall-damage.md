# 07 — Fall damage: height, time and impact-speed models

> Published fall-damage rules from real games: Oblivion (time-based, settings from the CS wiki), Skyrim (height-based,
> power law), Minecraft (height-based, 1 HP per block over 3), Half-Life (linear in impact speed, from the SDK source),
> Terraria and Baldur's Gate 3 (linear in height, BG3 as a share of max HP), plus the ways each game reduces damage. Then
> **(derived)** sections: converting between height, air time and impact speed under constant gravity, the
> terminal-velocity trap, measuring the fall from the apex, and our MVP numbers (safe 4 + Agility/10 m, deadly
> 24 + Agility/5 m, linear between) as impact speeds with the g from `jump.mvp-table` (32.653 m/s²). Fetched 2026-10-14.

---

## Three models: height, time, impact speed
TAG: fall.models
SOURCE: https://minecraft.wiki/w/Fall_damage
SOURCE: https://cs.uesp.net/wiki/FJumpFallTimeMin
SOURCE: https://raw.githubusercontent.com/ValveSoftware/halflife/master/dlls/singleplay_gamerules.cpp (L192-198)

- Height: Minecraft "Fall damage is based on the change in an entity's Y coordinate, and not how fast the entity is
  moving." Skyrim, Terraria and BG3 also take a height (`fall.skyrim.formula`, `fall.terraria`, `fall.bg3.percent-linear`).
- Time: Oblivion "Falling damage is calculated by time in seconds spent falling" (`fall.oblivion.settings`).
- Impact speed: Half-Life "// subtract off the speed at which a player is allowed to fall without being hurt, // so
  damage will be based on speed beyond that, not the entire fall" (`fall.halflife.speed-linear`).
- **(derived)** Summary:

| Game | Input | Free below | Shape above the threshold | Lethal / cap |
|---|---|---|---|---|
| Oblivion | air time t | fJumpFallTimeMin 0.2 s (+ an unknown distance filter) | linear in t: 80 HP/s x 1.25 | no cap stated |
| Skyrim | height | 600 units = 8.57 m (player) | ((h - 600)·0.1)^1.45 | 100 HP at 12.0 m |
| Minecraft | Y drop | 3 blocks | 1 HP per block | 23.5 blocks kill the player |
| Half-Life | landing speed v | 580 units/s | 100/(1024 - 580) HP per unit/s | 100 HP at 1024 units/s |
| Terraria | distance | 25 tiles | 10 damage per tile | no cap stated |
| BG3 | height | 4 m | (maxHP)·(h - 4)/17 + 1 | just under 21 m |

## Oblivion: fall-damage settings
TAG: fall.oblivion.settings
SOURCE: https://cs.uesp.net/wiki/Category:Jumping
SOURCE: https://cs.uesp.net/wiki/FJumpFallTimeBase
SOURCE: https://cs.uesp.net/wiki/FJumpFallTimeMin
SOURCE: https://cs.uesp.net/wiki/FJumpFallTimeMult
SOURCE: https://cs.uesp.net/wiki/FJumpFallVelocityMin
SOURCE: https://cs.uesp.net/wiki/FJumpFallRiderMult

| Setting | Default | Page text |
|---|---|---|
| fJumpFallTimeMult | 80.0000 | "The base amount of damage taken per second of falling. This is adjusted by fJumpFallSkillBase and fJumpFallSkillMult." |
| fJumpFallTimeMin | 0.2000 | "This setting appears to be the minimum time spent falling before damage is assigned at all. However, setting it to 0.0 does not cause you to take damage by stepping off a curb, so there must be an additional factor" |
| fJumpFallTimeBase | 0.0000 | "Appears to be the minimum amount of damage taken in a fall, regardless of time spent falling. Note that a certain threshold of vertical distance has to be passed before it's considered a fall." |
| fJumpFallSkillBase | 1.2500 | skill multiplier base (`fall.oblivion.formula`) |
| fJumpFallSkillMult | -0.0100 | skill multiplier slope (`fall.oblivion.formula`) |
| fJumpFallVelocityMin | 600.0000 | "This seems to influence how quickly actors fall through the air." |
| fJumpFallRiderMult | 0.0000 | no description |

- No fJumpFallTimeExponent appears: the Category:Jumping list has exactly 12 settings (fJumpDoubleMult,
  fJumpFallRiderMult, fJumpFallSkillBase, fJumpFallSkillMult, fJumpFallTimeBase, fJumpFallTimeMin, fJumpFallTimeMult,
  fJumpFallVelocityMin, fJumpHeightMax, fJumpHeightMin, fJumpMoveBase, fJumpMoveMult). The category page itself says the
  fall settings "are not known yet" in detail.

## Oblivion: the formula and the Acrobatics bug
TAG: fall.oblivion.formula
SOURCE: https://cs.uesp.net/wiki/FJumpFallSkillMult
SOURCE: https://cs.uesp.net/wiki/FJumpFallSkillBase
SOURCE: https://en.uesp.net/w/index.php?title=Oblivion:Acrobatics&action=raw

- fJumpFallSkillMult page: `final damage = base damage * (fJumpFallSkillBase + (Acrobatics * fJumpFallSkillMult / 100))`;
  "damage is multiplied by 1.25 at Acrobatics of 0, and by 1.24 at Acrobatics of 100. It is very likely that the
  intended result was 0.25 at Acrobatics of 100, which would require a value of -1.0 here".
- The fJumpFallSkillBase page writes the same formula with `-` instead of `+`; with the default -0.01 only the `+` form
  gives the stated 1.25 → 1.24. UESP Acrobatics: `FinalDamage = BaseDamage * (1.25 - AcrobaticsSkill/10000)`.
- Unofficial Oblivion Patch: "Acrobatics is internally capped at 255 instead of at 100 like other skills"; "He recommends
  -0.4902 (i.e. 125/255), which does not negate all damage until the 255 cap is reached. The UOP sets fJumpFallSkillMult
  to -0.4902 starting with version 2.2." **(derived)** UOP multiplier: 1.25 at 0, 0.76 at 100, 0.00 at 255.
- Oblivion Remastered (UESP): "At an Acrobatics skill of 100, fall damage is reduced by ~62.5%"; Master perk: "You also
  suffer a further ~42.5% less Health loss when taking fall damage."
- UESP tips: "starting the fall in sneak mode reduces damage a little. Also not moving (walking/running) while landing
  reduces the damage some." Landing on "narrow ledges, diagonal slopes and such ... even if you slip off them
  immediately, significantly reduces falling damage." "Saving and reloading will keep your character's location intact,
  but will reset the velocity." Acrobatics XP: "3.0 experience points each time you take damage from falling".
- **(derived)** Base damage per second of fall = 80, so 100 HP per second at Acrobatics 0 (x1.25). Under constant g,
  t = sqrt(2h/g), so damage grows as sqrt(h). Oblivion's own gravity is not in these sources, so no metre table here.

## Skyrim: formula, settings, modifiers
TAG: fall.skyrim.formula
SOURCE: https://en.uesp.net/w/index.php?title=Skyrim:Damage&action=raw
SOURCE: https://steamcommunity.com/sharedfiles/filedetails/comments/19343

- "Player falling damage = ((height - 600) * 0.1)^1.45 * modifiers"; "NPC falling damage = ((height - 450) * 0.1)^1.65 *
  modifiers". With settings: "falling damage = ((height - fJumpFallHeightMin) * fJumpFallHeightMult)^fJumpFallHeightExponent
  * modifiers" ("adding "NPC" to the end of each setting name when dealing with NPCs").
- "The internal height units are 64 per yard. The second story of a house is about 4 yards up." "A fall of up to about
  9 yards will not hurt you; however, the range of heights from which falling will hurt but not kill you is fairly
  narrow. In general, falling more than three stories is potentially fatal."
- Modifiers: "The Cushioned Heavy Armor perk reduces falling damage by half." "Fall damage is decreased on difficulties
  below Adept, but is not increased on difficulties above Adept." Avoided by "landing in moderately deep water", the
  Become Ethereal shout, or "being paralyzed on impact".
- **(secondary)** Steam comment: defaults "fJumpFallHeightMin 600", "fJumpFallHeightMult 0.1", "fJumpFallVelocityMin 700".

## Skyrim: the same numbers in metres
TAG: fall.skyrim.metres
SOURCE: derived by hand from fall.skyrim.formula (64 units = 1 yard = 0.9144 m; computed in Python)

- **(derived)** Player threshold 600 units = 8.57 m. Damage at 9 m: 4.9; 10 m: 28.1; 12 m: 100.2; 15 m: 249.4.
- **(derived)** Lethal height from full health: 100 HP → 839.5 units = 12.0 m; 200 HP → 14.1 m; 300 HP → 15.9 m.
  Cushioned (x0.5) moves 100 HP lethality to 14.1 m. NPC with 100 HP: 613 units = 8.76 m.
- **(derived)** Convex: from the threshold to lethal (100 HP) is only 3.4 m, matching "fairly narrow".

## Minecraft: formula
TAG: fall.minecraft.formula
SOURCE: https://minecraft.wiki/w/Fall_damage

- "Most mobs take fall damage after falling more than 3 blocks." Mobs take "about 1HP" for each block "over their safe
  fall distance". "The amount of fall damage a mob takes is determined by the formula:" (rendered as math; the fetch
  tool transcribed it as `Max(0, Floor[(fall distance − safe_fall_distance) × fall_damage_multiplier])`), "where the
  Floor function rounds the answer down to the nearest whole number." The threshold and multiplier are the per-mob
  attributes `safe_fall_distance` and `fall_damage_multiplier`.
- "a fall of at least 23.5 blocks is required to kill the player". **(derived)** floor(23.5 - 3) = 20 = full health.
- Motion (from `https://minecraft.wiki/w/Entity`): gravity -0.08 m/tick², drag 0.98, terminal 78.4 m/s. **(derived)**
  With drag, `v = sqrt(2gh)` does not hold, which is one reason a distance rule is simpler there.

## Minecraft: what reduces it
TAG: fall.minecraft.reduction
SOURCE: https://minecraft.wiki/w/Fall_damage
SOURCE: https://minecraft.wiki/w/Feather_Falling

- Verbatim: "Hay bales and honey blocks decrease fall damage to 20% of normal." "Beds decrease fall distance to 50% of
  the actual distance fallen," Jump Boost: "In addition to increasing jump height, it also reduces fall damage by 1HP"
  "per level". Feather Falling "reduces fall damage by (12 x level)%", "up to a maximum of 48% with Feather Falling IV";
  protection enchantments stack "up to an upper limit cap of 80%".
- Fetch-tool summary (not verbatim): Resistance -20% per level; Slow Falling negates all fall damage; landing in water,
  cobweb or powder snow resets the fall; slime blocks and sweet berry bushes negate it; ladders and vines reset fall
  distance; lava halves the accumulated distance each tick.

## Half-Life: damage linear in impact speed
TAG: fall.halflife.speed-linear
SOURCE: https://raw.githubusercontent.com/ValveSoftware/halflife/master/dlls/player.h (L22-26)
SOURCE: https://raw.githubusercontent.com/ValveSoftware/halflife/master/dlls/player.cpp (L2102-2105, L2726-2745)
SOURCE: https://raw.githubusercontent.com/ValveSoftware/halflife/master/dlls/singleplay_gamerules.cpp (L192-198)
SOURCE: https://raw.githubusercontent.com/ValveSoftware/halflife/master/dlls/multiplay_gamerules.cpp (L463-477)

```c
#define PLAYER_FATAL_FALL_SPEED     1024// approx 60 feet
#define PLAYER_MAX_SAFE_FALL_SPEED  580// approx 20 feet
#define DAMAGE_FOR_FALL_SPEED       (float) 100 / ( PLAYER_FATAL_FALL_SPEED - PLAYER_MAX_SAFE_FALL_SPEED )// damage per unit per second.
#define PLAYER_FALL_PUNCH_THRESHHOLD (float)350 // won't punch player's screen/make scrape noise unless player falling at least this fast.
```
- Speed capture while airborne: `if ( !FBitSet ( pev->flags, FL_ONGROUND ) ) { m_flFallVelocity = -pev->velocity.z; }`.
  On landing, if `m_flFallVelocity > PLAYER_MAX_SAFE_FALL_SPEED`: "// after this point, we start doing damage"; a water
  landing (`pev->watertype == CONTENT_WATER`) skips it.
- Damage: `pPlayer->m_flFallVelocity -= PLAYER_MAX_SAFE_FALL_SPEED; return pPlayer->m_flFallVelocity *
  DAMAGE_FOR_FALL_SPEED;`. Multiplayer cvar `falldamage`: `case 1://progressive` (the same) or `case 0:// fixed`
  `return 10;`.
- **(derived)** 0.2252 HP per unit/s. With g = 800 units/s² (the jump code's literal), the safe speed is reached after
  580²/1600 = 210 units of free fall and the fatal one after 655 units; at 1 unit ≈ 1 inch that is 17.5 ft and 54.6 ft,
  matching the comments' "approx 20 feet" / "approx 60 feet" (the unit size itself is not stated in these files).
  Damage at 300 / 400 / 655 units of drop: 25 / 50 / 100 HP: concave in height.

## Terraria: linear in distance
TAG: fall.terraria
SOURCE: https://terraria.wiki.gg/wiki/Fall_damage

- "fall damage = 10 * ( fall distance - maximum safe falling distance )"; "10 damage is sustained for each tile
  traveled" beyond the safe distance, which defaults to 25 tiles (fetch-tool summary for the 25). Lucky Horseshoe:
  "Negates fall damage."

## Baldur's Gate 3: share of max HP, linear in height
TAG: fall.bg3.percent-linear
SOURCE: https://bg3.wiki/w/index.php?title=Falling_damage&action=raw

- "Falls of less than 4 m deal no damage." "Falls over 4 m deal damage starting at 2% of the creature's maximum health
  and increasing by an additional 1% for every additional 0.2m fallen." (the page's `{{dist|m=4}}` template = 4 m).
- "The exact formula based on extensive experimentation seems to be": `Fall damage = (Maximum HP + Temporary HP) x
  (Height - 4) / 17 + 1`, for Height ≥ 4 m. "a fall of just shy of 21 m will be lethal even from full HP."
- Prone: "A fall will always cause a creature to be knocked prone if it deals more than 25% of their maximum HP",
  "meaning falls of around 8m / 27ft". Resistances: bludgeoning and falling resistance "will stack, granting a 75%
  reduction"; Feather Fall gives immunity.
- **(derived)** 100/17 = 5.9% of max HP per metre; lethal at 4 + 17·(1 - 1/maxHP) ≈ 20.8 m. Closest published match to
  our MVP: same 4 m safe height at Agility 0, linear, lethal near 21 m (ours 24 m).

## Converting height, air time and impact speed (constant gravity)
TAG: fall.conversion
SOURCE: derived by hand (kinematics as in jump.pittman.height-time; numbers computed in Python)

- **(derived)** Falling from rest under constant g: `h = v²/(2g) = g·t²/2`, `v = sqrt(2gh) = g·t`, `t = sqrt(2h/g)`.
- **(derived)** Linear in height = linear in v² (kinetic energy) = linear in t²:
  `D/Dmax = (h - hs)/(hd - hs) = (v² - vs²)/(vd² - vs²) = (t² - ts²)/(td² - ts²)`.
- **(derived)** Linear in speed (Half-Life) and linear in time (Oblivion) have the same shape under constant g
  (`v = g·t`): `D ∝ sqrt(h) - sqrt(hs)`, concave. Skyrim's power 1.45 is convex.
- **(derived)** Same endpoints (0% at 4 m, 100% at 24 m, g = 32.653 m/s²), share of the damage range:

| fall h (m) | impact v (m/s) | air time (s) | linear in h | linear in v or t | power 1.45 in h |
|---|---|---|---|---|---|
| 6 | 19.79 | 0.606 | 10.0% | 15.5% | 3.5% |
| 8 | 22.86 | 0.700 | 20.0% | 28.6% | 9.7% |
| 14 | 30.24 | 0.926 | 50.0% | 60.1% | 36.6% |
| 20 | 36.14 | 1.107 | 80.0% | 85.3% | 72.4% |

- **(derived)** The equivalence breaks when: the fall starts with vertical speed (a jump: count from the apex, or use
  `h_eq = v_impact²/(2g)`); gravity changes mid-air (a fall multiplier m makes `v = sqrt(2·m·g·h)` and shortens t); drag
  or a speed cap applies (`fall.terminal-cap-trap`). Height measured from the apex is immune to all three.

## Terminal-velocity trap
TAG: fall.terminal-cap-trap
SOURCE: derived by hand from jump.terminal-velocity and fall.conversion

- **(derived)** With a cap v_c, every fall above `h_c = v_c²/(2g)` lands at v_c. Speed-based damage then stops growing:
  at g = 32.653 m/s² a 40 m/s cap is reached after 24.5 m, so with speed-based damage the Agility 100 hero (deadly
  impact 53.6 m/s) could never die from a fall. Time-based damage keeps growing but turns linear in h after the cap.
- **(derived)** Rule: with speed-based damage the cap must exceed the largest deadly impact speed (53.6 m/s at Agility
  100, more for higher Agility since the MVP formula has no cap); height-based damage needs no such rule.
  References: Celeste caps at 160 px/s after 0.18 s; Minecraft 78.4 m/s; a real skydiver ~55 m/s.

## Measure the fall from the apex
TAG: fall.measure-from-apex
SOURCE: derived by hand from fall.conversion and jump.mvp-table

- **(derived)** Track `apexY = max(y)` from the moment the hero leaves the ground or a climb hold; on landing,
  `fall = apexY - landY`. A rising phase never counts, and gravity multipliers or caps do not change the result.
- **(derived)** Flat jumps never hurt: jump height 1 + A/25 is below safe height 4 + A/10 for every A ≥ 0 (gap
  3 + 0.06·A m: 3 m at A = 0, 9 m at A = 100). Jumping off a 3 m ledge at A = 0: apex 1 m above takeoff, fall 4 m =
  exactly the safe edge.
- **(derived)** Half-Life skips damage on water landings and Skyrim/Minecraft name water as a cushion: decide water
  landings explicitly.

## MVP mapping: safe and deadly heights as impact speeds
TAG: fall.mvp-mapping
SOURCE: derived by hand from jump.mvp-table (g = 32.653 m/s²) and the MVP formulas (numbers computed in Python)

- **(derived)** Safe `hs = 4 + A/10`, deadly `hd = 24 + A/5`, damage linear between (deadly = 100% of max health).

| Agility | safe hs (m) | deadly hd (m) | v at hs (m/s) | v at hd (m/s) | fall time hs (s) | fall time hd (s) | v at hs / hd if g = 9.81 |
|---|---|---|---|---|---|---|---|
| 0 | 4 | 24 | 16.16 | 39.59 | 0.495 | 1.212 | 8.86 / 21.70 |
| 30 | 7 | 30 | 21.38 | 44.26 | 0.655 | 1.356 | 11.72 / 24.26 |
| 100 | 14 | 44 | 30.24 | 53.60 | 0.926 | 1.642 | 16.57 / 29.38 |

- **(derived)** Agility 30 examples: 10 m → 13.0% (lands at 25.56 m/s); 18.5 m → 50% (34.76 m/s); 30 m → 100%.
- **(derived)** In speed terms the same rule is `D/maxHP = clamp01((v² - vs²)/(vd² - vs²))`, valid only for a fall from
  rest under the same g; with a fall multiplier m every v above scales by sqrt(m), heights do not.
```csharp
float fall   = apexY - landY;                         // fall.measure-from-apex
float safe   = 4f + agility / 10f, deadly = 24f + agility / 5f;
float share  = Mathf.Clamp01((fall - safe) / (deadly - safe));
float damage = share * maxHealth;                      // 1.0 = lethal from full health
```

## Not fetched / gaps
TAG: fall.gaps
SOURCE: none (the pages below failed or were not found)

- Oblivion: no page gives the complete base-damage formula (whether fJumpFallTimeMin is subtracted, the vertical-distance
  filter, what fJumpFallVelocityMin does), nor Oblivion's gravity, so damage per metre is not given. No
  fJumpFallTimeExponent exists in the CS wiki list. `en.uesp.net` has no Oblivion:Falling page (404).
- Skyrim: the CK wiki game-settings pages (`ck.uesp.net`) sit behind a Cloudflare challenge (403); defaults beyond the
  UESP formula come from a Steam comment (secondary). Exponent defaults are inferred from the UESP formula, not read as
  settings.
- Minecraft: the wiki returns a JavaScript wait page to curl; it was read through WebFetch's summarizer, which quoted
  sentences but transcribed the formula from rendered math. Resistance / Slow Falling / water details are summary text.
- Conan Exiles: no published fall formula found (search found only forum reports; `conanexiles.fandom.com/wiki/Falling`
  returned 402). Valheim (`valheim.fandom.com/wiki/Fall_damage`): 402. Zelda BotW: no formula or datamine page found.
- BG3's formula is the wiki's experimental fit ("seems to be"), not game data. Half-Life's unit size (1 unit ≈ 1 inch)
  is inferred from the code comments, not stated.
- Nothing here was tested in the game.
