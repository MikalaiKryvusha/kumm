# 05 — Climbing and mantle: wall grab, wall-relative movement, ledge detection, stamina rules

> Climbing for the player hero of a Unity 2020.3 game, written from a BepInEx mod. Covers: what makes a surface climbable and how
> a body sticks to it and moves on it (Catlike Coding "Climbing", read in full); how a ledge is found and topped (the open-source
> ALS-Community mantle component, read in source, plus the Unity 2020.3 queries that replace its traces); how Conan Exiles,
> Palworld and Breath of the Wild spend stamina on a wall (side-by-side table); two AAA statements (Assassin's Creed Shadows,
> Avatar: Frontiers of Pandora at GDC 2024); a derived state machine `OnMesh · Air · Climb · Mantle · StandOffMesh` with the
> per-frame queries of each state. It EXTENDS `researches/svarogs-dream/climbing-jump-recon.md` ([recon]) without repeating it.
> Pages fetched 2026-10-14. Animation for all of this: `06_animation-in-mod.md`.

---

## Catlike "Climbing": which surface is climbable
TAG: climb.catlike.climbable-test
SOURCE: https://catlikecoding.com/unity/tutorials/movement/climbing/

- A Rigidbody sphere (Unity 2019.2.21f1); climbing is a contact category next to ground and steep.
- `"[SerializeField, Range(90, 180)] float maxClimbAngle = 140f;"`: 140 is "just a bit beyond a 45° overhang"; 90 is the vertical
  wall ("Steep surfaces are climbable, but that gets us only up to perfectly vertical walls"). The fetch summary noted the prose
  says 90°–170° while the attribute says 90–180; the code wins.
- `"minClimbDotProduct = Mathf.Cos(maxClimbAngle * Mathf.Deg2Rad);"` in `OnValidate`. A non-ground contact is climbable when
  `"upDot >= minClimbDotProduct"`, `upDot = Dot(upAxis, normal)`; at 140° that is upDot ≥ −0.766.
- "We disallow climbing ceilings because that would represent hanging more than climbing."
- Final contact test:
  `if (desiresClimbing && upDot >= minClimbDotProduct && (climbMask & (1 << layer)) != 0) { climbContactCount += 1;
  climbNormal += normal; lastClimbNormal = normal; connectedBody = collision.rigidbody; }`
- **(derived)** For our hero "steep" already means `normal.y < cos(WalkableDeg)` (`Jump.cs`: `WalkableDeg = 50`,
  `CeilingNormalY = -0.5`). Climbable = steeper than walkable AND `normal.y >= cos(maxClimbAngle)`. Catlike's 140° allows overhangs
  to −0.766; `Jump.cs`'s ceiling cut −0.5 (120°) is stricter. One number, owner's taste.

## Catlike: climbMask and unclimbable layers
TAG: climb.catlike.climb-mask
SOURCE: https://catlikecoding.com/unity/tutorials/movement/climbing/

- `"LayerMask probeMask = -1, stairsMask = -1, climbMask = -1;"`: all climbable by default; filter `"(climbMask & (1 << layer))
  != 0"`. The tutorial adds an *Unclimbable* layer (kept in the Probe Mask so it stays walkable, and in the camera's Obstruction Mask).
- Falling off an unclimbable patch: "Because we use physics for movement the sphere just goes where you direct it", hence
  "climbable and unclimbable areas are visually different."
- **(derived)** We cannot add a layer to the game's assets. Our `climbMask` is a subset of existing layers (`Jump.cs` config
  `SolidLayers` = `Default,Ground,WoodPlatform,Storage`, what the hero hits in flight) plus a per-collider filter (NPCs, doors).

## Catlike: grip, speed, gravity while climbing
TAG: climb.catlike.grip-speed
SOURCE: https://catlikecoding.com/unity/tutorials/movement/climbing/

| Field | Default | Note |
|---|---|---|
| `maxSpeed` / `maxClimbSpeed` | 10 / 2 | "low speed and high acceleration"; climb doubled to 4 for testing |
| `maxClimbAcceleration` | 20 | 40 for testing; high value "needed to reliably cling to surfaces" |
| grip factor | 0.9 | grip = 90 % of climb acceleration |
| still threshold | `velocity.sqrMagnitude < 0.01f` | speed under 0.1 |

```csharp
if (Climbing) { velocity -= contactNormal * (maxClimbAcceleration * 0.9f * Time.deltaTime); }   // grip, NO gravity
else if (OnGround && velocity.sqrMagnitude < 0.01f) {
    velocity += contactNormal * (Vector3.Dot(gravity, contactNormal) * Time.deltaTime); }      // stand still on a slope
else if (desiresClimbing && OnGround) { ... }                                                 // gravity minus grip
else { velocity += gravity * Time.deltaTime; }
```
- "Climb Desire Slows Movement": `speed = OnGround && desiresClimbing ? maxClimbSpeed : maxSpeed;` to "slow down to anticipate a
  climb". The grip also stops the body "launching itself after reaching the top of a wall".
- **(derived)** Climb speed is 2/10 = 0.2 of walk here and 100/450 = 0.22 of a run in Conan (`climb.conan.numbers`): two sources
  agree on about one fifth. Our hero runs ≈11.5 u/s (`Jump.cs` comment), so ≈2.3–2.5 u/s is a sourced first value.

## Catlike: input relative to the wall
TAG: climb.catlike.wall-relative-input
SOURCE: https://catlikecoding.com/unity/tutorials/movement/climbing/

- Climbing: `"xAxis = Vector3.Cross(contactNormal, upAxis);"`, `"zAxis = upAxis;"`; otherwise camera right/forward; both projected
  onto the contact plane. `AdjustVelocity` then uses `maxClimbAcceleration` / `maxClimbSpeed`.
- "the orientation of the controls switches when touching a wall"; "The best way to climb is with the camera facing the wall";
  automatic camera control is "very hard to get right in arbitrary situations".
- **(derived)** WASD on the wall: `up = ProjectOnPlane(Vector3.up, n).normalized`, `right = Cross(n, up)`, `move = (W−S)·up +
  (D−A)·right` (signs checked in game). Independent of the orbit camera.

## Catlike: cancel climbing right after a jump
TAG: climb.catlike.jump-cancel
SOURCE: https://catlikecoding.com/unity/tutorials/movement/climbing/

- `"bool Climbing => climbContactCount > 0 && stepsSinceLastJump > 2;"`: off for two physics steps after a jump, because "the grip
  acceleration slows down jumps away from the wall".
- `CheckClimbing` sets `groundContactCount = 1` and `contactNormal = climbNormal`: climbing counts as ground. No changed `Jump`
  method and no wall-jump direction are given.
- **(derived)** Frame-based: after a push-off ignore grabs for ≈0.15 s or until 0.5 u from the wall, whichever is later.

## Catlike: outer corners, inner corners, crevasses
TAG: climb.catlike.corners-crevasses
SOURCE: https://catlikecoding.com/unity/tutorials/movement/climbing/

- Outer corners: "moving past them causes the sphere to lose contact with the wall and fall"; the constant grip keeps contact.
- Inner corners: full grip "would cause us to get stuck in 90° inner corners", hence "90% of the max acceleration, which would only
  slow us down but no longer stop us in inner corners".
- Crevasses, in `CheckClimbing`: with `climbContactCount > 1`, `climbNormal.Normalize(); float upDot = Vector3.Dot(upAxis,
  climbNormal); if (upDot >= minGroundDotProduct) { climbNormal = lastClimbNormal; }`: a summed normal that looks like ground is
  replaced by the last single wall normal.
- Priority: `CheckClimbing() || OnGround || SnapToGround() || CheckSteepContacts()`, "climbing overrules everything else". The word
  "ledge" never appears; the wall top is handled only by the grip (see `climb.ledge.*`).
- **(derived)** With casts instead of contacts: two re-stick rays (left/right hand height) averaged; if the average is walkable,
  keep the previous frame's normal.

## Breath of the Wild: stamina while climbing, exhaustion, regeneration
TAG: climb.botw.stamina
SOURCE: https://zeldawiki.wiki/wiki/Climbing (wikitext via `https://zeldawiki.wiki/w/api.php?action=parse&page=Climbing&prop=wikitext&format=json`; HTML returns 403)
SOURCE: https://zeldawiki.wiki/wiki/Stamina_Wheel (same API route)
SOURCE: https://zeldawiki.wiki/wiki/Stamina (same API route)

- "While Climbing, in most scenarios, Link will have his Stamina meter to be used up continuously if he climbs, at a linear rate."
- "Link does not use up his stamina while climbing ladders, however, jumping still uses up his stamina, and unlike climbing other
  surfaces, Link can still climb slowly when his stamina is drained completely."
- "Link cannot climb on Sheikah technology such as Ancient Shrines and Divine Beasts."
- Zero: "he will become exhausted until his Stamina recovers. This forces Link to walk very slowly and disables him from certain
  actions, such as using the Paraglider or climbing."
- "Stamina automatically replenishes when not being used"; Energizing/Enduring food or elixirs "will speed this process up". Size:
  "a maximum of three full rings and two temporary rings acquired from food".

## Breath of the Wild: the climbing jump, gear, rain, a cut rest mechanic
TAG: climb.botw.climb-jump-rain
SOURCE: https://zeldawiki.wiki/wiki/Climb_Jump_Stamina_Up · https://zeldawiki.wiki/wiki/Climbing_Set · https://zeldawiki.wiki/wiki/Rain (API route)
SOURCE: https://www.destructoid.com/you-could-originally-regain-stamina-while-climbing-in-zelda-breath-of-the-wild-but-miyamoto-nixed-it/
SOURCE: https://critpoints.net/2017/06/04/making-botw-climbing-more-dynamic/

- The set bonus "decreases the Stamina used when jumping while Climbing by 50%"; each Climbing Set piece "increases Link's movement
  speed while climbing". No base jump cost was found.
- Rain makes surfaces "slick. This makes them difficult to Climb, as Link will periodically slip and fall"; the Climbing Set "will
  not prevent Link from slipping when climbing during rainy weather."
- **(secondary)** Design blog: wants cheaper jumps so you don't get "like 3 jumps"; shallow surfaces give some stamina back but you
  "can't stop on them"; full refill needs "flat ground to rest on".
- **(secondary)** Cut mechanic (GameSpot via Destructoid): "When your stamina gauge was dwindling you could stab the weapon and kind
  of hang out and rest there"; dropped after Miyamoto objected and because swords are hard to stab into rock.
- **(derived)** BotW's pressure is three timers on stamina: linear drain, an expensive burst (climbing jump), environmental slips.

## Conan Exiles: numbers the recon did not have
TAG: climb.conan.numbers
SOURCE: https://conanexiles.fandom.com/wiki/Movement_Speed (wikitext via `https://conanexiles.fandom.com/api.php?action=parse&page=Movement_Speed&prop=wikitext&format=json`; HTML returns 402)
SOURCE: https://conanexiles.fandom.com/wiki/Climbing_Gloves · .../Spiderclimb_Boots · .../Armor_Flexibility_Kit · .../Gliding_Joints · .../Attribute (API route)

**(secondary)** Fan wiki; [recon] had [C3] only as a snippet. Peak speeds, "centimeters per second": walk 150, run 450, sprint
773, swim 350; **climbing 100** (same when sprinting); + Quickfooted 120; + Spiderclimb Boots 125; + Wanderlust 200.
- Gloves and boots each "reduce stamina burn while climbing by -25%. Note that the cap for climbing stamina reduction is -90%".
  Boots "increase climbing speed by 25 (base speed is 100). This is not a multiplier", so `(100 * 1.2) + 25 = 145`.
- Armor Flexibility Kit: "10% per equipped item ... up to a maximum of -50% with five pieces"; Gliding Joints: "40% per item ... up
  to the stamina reduction cap of -90% with three pieces".
- Quickfooted: "Jogging, sprinting, jumping, swimming, and climbing cost less stamina and are faster": "Climbing speed +20%",
  "Climbing stamina -10%". Pool: base 100; Grit "+3 stamina per point", Agility "+1 stamina per point".
- A per-second base drain is still unpublished.

## Palworld: rules the recon did not have
TAG: climb.palworld.extra-rules
SOURCE: https://palworld.wiki.gg/wiki/Stamina · https://palworld.wiki.gg/wiki/Climbing (wikitext via `https://palworld.wiki.gg/api.php?action=parse&page=<Page>&prop=wikitext&format=json`)

**(secondary)** Fan wiki.
- Lockout: "If you deplete your stamina, you won't be able to use any stamina-consuming actions anymore, until the entire bar has
  been refilled."
- Costs list "running, rolling, climbing, gliding, swimming, flying, jumping, and attacking"; no separate climbing-jump cost.
- "Since stamina isn't gained while falling, it isn't possible to break the fall damage with a glider"; the Grappling Gun costs no
  stamina and can "clasp to a wall near the ground and reset the momentum". "Climbing can be used to avoid fall damage."
- On the wall "the inventory can be opened"; the player "isn't able to open the build menu or throw Pal Spheres".

## Assassin's Creed Shadows: handholds, not free climbing
TAG: climb.aaa.ac-shadows
SOURCE: https://www.ubisoft.com/en-us/game/assassins-creed/news/4TA6gKaTvtOC1mOjZIxCZd/assassins-creed-shadows-parkour-system-overview

Ubisoft, "Assassin's Creed Shadows – Parkour System Overview" (2025-01-07, quoting the Associate Game Director):
- "Naoe and Yasuke will not be able to climb on surfaces that do not have physical handholds for them to grab onto."
- Dropping off a high structure "will result in the character holding on to that ledge and hanging there".
- "she can perform a very cool wall eject by tapping the parkour up button at the apex of a wall run." No stamina mentioned.
- **(derived)** Two families: authored handholds (AC) vs climb-anywhere with stamina (BotW, Conan, Palworld). The owner's references
  are the second; it needs no authored data, a normal-angle test is enough.

## Avatar: Frontiers of Pandora: markup-free stepups and mantles (GDC 2024)
TAG: climb.aaa.pandora-mantle
SOURCE: https://gdcvault.com/play/1034304/Obstacle-Traversal-in-the-Organic

Joel Nilsson, Massive Entertainment, GDC 2024, Programming: "with increasingly complex game worlds traditional markup solutions have
become increasingly cumbersome. ... we created a highly generic and (almost) markup-free system for stepups and mantling relying on
a minimum of assumptions while trying to maximize freedom of movement." Abstract only; the talk is behind the Vault.

## Ledge detection: the ALS-Community MantleCheck
TAG: climb.ledge.detect-pattern
SOURCE: https://raw.githubusercontent.com/dyanikoglu/ALS-Community/main/Source/ALSV4_CPP/Private/Components/ALSMantleComponent.cpp (`MantleCheck`, `TickComponent`, `OnOwnerJumpInput`)
SOURCE: https://raw.githubusercontent.com/dyanikoglu/ALS-Community/main/Source/ALSV4_CPP/Public/Components/ALSMantleComponent.h
SOURCE: https://raw.githubusercontent.com/dyanikoglu/ALS-Community/main/Source/ALSV4_CPP/Public/Library/ALSCharacterStructLibrary.h (`FALSMantleTraceSettings`)

ALS V4 community C++ port (Unreal, cm, Z up). Trace sets `GroundedTraceSettings`, `AutomaticTraceSettings`,
`FallingTraceSettings`, each `MaxLedgeHeight, MinLedgeHeight, ReachDistance, ForwardTraceRadius, DownwardTraceRadius` (values in
Blueprint assets; `0.0f` in C++). Runs every tick while `InAir` with movement input ("Perform a mantle check if falling while
movement input is pressed") and on jump input (grounded with input → grounded set; in air → falling set).
1. Forward sweep, "Trace forward to find a wall / object the character cannot walk on": capsule of `ForwardTraceRadius`, half-height
   `1 + (Max − Min)/2`, from 30 cm BEHIND the capsule base raised to `(Max + Min)/2`, swept `ReachDistance`. Reject: no blocking
   hit, `IsWalkable(hit)`, or the hit component faster than `AcceptableVelocityWhileMantling = 10.0f`.
2. Downward sweep, "determine if the hit location is walkable": sphere of `DownwardTraceRadius` from `impact − normal·15 cm`,
   `MaxLedgeHeight + radius + 1` above the base, down to the base. Reject unless walkable.
3. "Check if the capsule has room to stand at the downward trace's location" (`CapsuleHasRoomCheck`).
4. Target faces the wall (`InitialTraceNormal * (-1, -1, 0)`); `MantleHeight = target.z − actor.z`.
5. Type: `InAir` → `FallingCatch`; else `MantleHeight > 125.0f ? HighMantle : LowMantle`.

**(derived)** ALS's first sweep is a band test (one capsule covers min..max ledge height), not "a head ray that misses". In our
`Climb` the wall is known, so a head-height ray that MISSES means the wall ends below the head; step 2 then confirms a top.

## Room check and the Unity 2020.3 query set
TAG: climb.ledge.room-check
SOURCE: https://raw.githubusercontent.com/dyanikoglu/ALS-Community/main/Source/ALSV4_CPP/Private/Library/ALSMathLibrary.cpp (`CapsuleHasRoomCheck`)
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Physics.CheckCapsule.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Physics.OverlapCapsuleNonAlloc.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Physics.CapsuleCast.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Physics.Raycast.html

- ALS: a sphere of the capsule radius swept from `target + halfHeightWithoutHemisphere` down to `target − ...`; room =
  `!(HitResult.bBlockingHit || HitResult.bStartPenetrating)`.
- `Physics.CheckCapsule(start, end, radius, layerMask, queryTriggerInteraction)`: "Checks if any colliders overlap a capsule-shaped
  volume in world space"; start/end are the end-sphere centres; returns bool, the cheapest room test.
  `OverlapCapsuleNonAlloc` "does not allocate anything on the managed heap": use it to name the blocker in the log.
- "CapsuleCast will not detect colliders for which the capsule overlaps the collider." "Raycasts will not detect Colliders for which
  the Raycast origin is inside the Collider." Start rays outside the rock; lift the room capsule by a skin (`Jump.cs`:
  `Skin = 0.05f`).
- **(derived)** Hero on ledge point `p` (agent radius r, height h, skin s): room iff
  `!Physics.CheckCapsule(p + up·(r + s), p + up·(h − r), r − s, solidMask, QueryTriggerInteraction.Ignore)`.

## Mantle motion: how ALS moves the body, and what we copy
TAG: climb.ledge.mantle-motion
SOURCE: https://raw.githubusercontent.com/dyanikoglu/ALS-Community/main/Source/ALSV4_CPP/Private/Components/ALSMantleComponent.cpp (`MantleStart`, `MantleUpdate`, `MantleEnd`)
SOURCE: https://raw.githubusercontent.com/dyanikoglu/ALS-Community/main/Source/ALSV4_CPP/Public/Library/ALSCharacterStructLibrary.h (`FALSMantleAsset`)

- Start: movement mode `MOVE_None` (physics off), state `Mantling`; play rate and start position mapped linearly from `MantleHeight`
  between `LowHeight` and `HighHeight` (`LowPlayRate/HighPlayRate`, `LowStartPosition/HighStartPosition`).
- Duration: the timeline is "the same length as the Lerp/Correction curve minus the starting position, and plays at the same speed as
  the animation": `(curveLength − startPosition) / playRate`. Numbers live in assets (not read).
- Update: a vector curve gives `X` = position blend to target, `Y` = horizontal correction, `Z` = vertical correction; the target is
  kept in the ledge component's local space to "follow along with moving objects"; a `BlendIn` curve "prevents pops when mantling an
  object lower than the animated mantle". End: `MOVE_Walking`.
- **(derived)** Without a mantle clip keep the shape, drop the asset: raise the body to ledge height close to the wall (vertical
  ease-out), then move it onto the ledge (horizontal ease-in), total 0.35–0.5 s scaled by height ([recon] §6: 0.3–0.5 s by taste).

## Stamina rules side by side
TAG: climb.stamina.table
SOURCE: [recon] §1–§2 (Conan [C1][C2], Palworld [P1][P2]) and the pages under climb.botw.*, climb.conan.numbers, climb.palworld.extra-rules

| Rule | Conan Exiles | Palworld | Breath of the Wild | Ours (derived proposal) |
|---|---|---|---|---|
| Drain while moving | "It costs stamina to climb"; heavier armour faster | "Moving costs stamina" | "used up continuously ... at a linear rate" | yes, per second |
| Drain while still | not documented | none: "Stamina isn't lost if the player isn't moving" | not found in a fetched source | yes, lower rate (owner: drains "while hanging") |
| Jump on the wall | not documented | jumping costs stamina (generic) | expensive; set bonus −50 % | one lump cost |
| Regeneration | not found | "slowly regenerated when not consuming any stamina, and on the ground (not falling)" | "automatically replenishes when not being used" | only in `OnMesh` / `StandOffMesh` |
| At zero | fall | "lose grip and fall"; locked "until the entire bar has been refilled" | exhausted: no climbing, slow walk | → `Air` (fall) |
| Damage while climbing | "you will immediately fall down" | not documented | not found | → `Air` |
| Modifiers | gear −25 % each, kits; cap −90 %; Quickfooted −10 % | max stamina from level points | Climbing Set speed; rain slips | Endurance → max energy ([recon] L2) |

## State machine for our off-mesh mode
TAG: climb.state.machine
SOURCE: derived from climb.catlike.*, climb.ledge.*, climb.stamina.table and [recon] §6
SOURCE: local D:/work/ai_sandbox/SvarogsDream/src/KrinikFixes/Jump.cs (Air step, `Warp`, `updatePosition`, constants)

**(derived)** One owner of `player.position` at a time: the NavMeshAgent in `OnMesh`, the mod elsewhere
(`agent.updatePosition = false`, agent stopped, as `Jump.cs` already does in flight).

| State | Enter when | Leave → to | Per-frame queries | Animation (06) |
|---|---|---|---|---|
| `OnMesh` | `Warp` onto the mesh done | Space or walking off an edge → `Air`; steering into a steep surface (owner's fork) → `Climb` | 0 casts; slope check ≈10 Hz | game controller |
| `Air` | jump, edge, push-off, energy 0, damage, let-go key | walkable hit + `SamplePosition` finds mesh → `OnMesh`; walkable, no mesh → `StandOffMesh`; climbable hit (steeper than walkable, within `maxClimbAngle`, passes the collider filter, grab cooldown over) → `Climb` | 1 capsule sweep (`Jump.cs` `Step`); `SamplePosition` only on a landing candidate | held take-off pose |
| `Climb` | grab from `Air` | energy 0 / damage / let-go → `Air`; Space → `Air` with push-off `n·v + up·v`; head ray misses AND down ray finds walkable AND room → `Mantle`; feet ray finds walkable while moving down → `OnMesh` / `StandOffMesh` | 1–2 re-stick rays toward −n; 1 head-height ray; on miss only 1 down ray + 1 `CheckCapsule`; moving down: 1 feet ray | held pose or bone posing |
| `Mantle` | ledge confirmed | timer done → `SamplePosition` → `OnMesh` or `StandOffMesh` | none (target fixed at entry) | pose blend |
| `StandOffMesh` | walkable, no mesh within the sample radius | step off or Space → `Air`; mesh within radius → `OnMesh` | 1 down ray; `SamplePosition` ≈5 Hz | controller, agent stopped |

Climb step: `move = (W−S)·up + (D−A)·right`, speed ≈0.2 of run; then `pos = hit.point + n·(r + skin)` from the re-stick ray
(Catlike's grip done kinematically); face `−n` flattened. Energy: `−drainMove·dt` when moving, `−drainIdle·dt` when still,
`−jumpCost` once on push-off.

## Per-frame cost of the states
TAG: climb.state.budget
SOURCE: [recon] §6 "Main-thread budget" (whole-arc search ≈14 raycasts + `SamplePosition` measured 0.021–0.290 ms once per jump, [L1])
SOURCE: local D:/work/ai_sandbox/KUMM/plans/24_svarog_cpu_budget_1ms.md

- **(derived)** Worst case is `Climb` at a wall top: 2 re-stick + 1 head + 1 down ray + 1 `CheckCapsule` = 5 short queries; 14 rays
  plus `SamplePosition` peaked at 0.29 ms, so expect well under 0.1 ms. Measure per state with a `Stopwatch` (worst/mean, as
  `Jump.cs` logs).
- Fixed buffers (`RaycastNonAlloc`, `CheckCapsule`), cached mask: zero allocations per frame. `OnMesh` adds nothing; the `Air`
  grab test reuses the sweep hit already computed.

## Not fetched / gaps
TAG: climb.gaps
SOURCE: this file

- BotW: no fetched page says whether hanging still drains stamina, the base climbing-jump cost, or damage-while-climbing behaviour.
  Zelda Dungeon wiki, zelda.fandom.com and Twinfinite returned 403/402; `zelda.nintendo.com/breath-of-the-wild/` is client-rendered.
- Conan: per-second drain, regeneration rule, idle-hang drain: still unpublished (recon gap stands).
- Palworld: climbing-jump cost and climb speed: not documented.
- GDC 2024 Pandora talk: abstract only. No Assassin's Creed or Uncharted climbing talk with a readable primary page was found on GDC
  Vault (searches returned none).
- ALS trace values and mantle durations are in `.uasset` files, not read; only the C++ algorithm is quoted.
- Catlike gives no jump-while-climbing direction; our push-off vector is derived. Nothing here was tested in Svarog's Dream.
