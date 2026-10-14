# Research — Svarog's Dream: climbing and physical jump (Conan Exiles, Palworld, Oblivion, Unity practice)

> **Created:** 2026-10-14 · **Parent:** KUMM ideas/16 (climbing), ideas/17 (jump) · **Status:** recon done 2026-10-14 ·
> **Outbound:** conclusions to the owner in chat (Russian)

Owner's words behind this recon (verbatim): «странно, что есть нейкая дуга, какой-то поиск приземления. Разве это не просто физика
решает? в Обливионе разве не физикой сделано?» · «мы же будем делать механику лазания» · «как в Palworld, как в Conan Exiles» · «если
прыгнул на склон, или камень - то должен прицепиться в позу лазания, и должна начать уменьшаться выносливость, пока висит» · «как в
Обливион, высота прыжка и время в воздухе росло от ловкости» · (Q6) «как это сделать на нашем Юнити» · «минимальными но достаточными
усилиями» · «может нужно будет сетку на склонах и на камнях и на прочих отвесных объектах нарисовать».

Source tags `[Cn]`, `[Pn]`, `[On]`, `[Un]`, `[Ln]` → list at the end. "Snippet" means the claim was seen only in a search-engine
summary of the page (the page itself did not load); treat it as unconfirmed.

## Bottom line

- **Oblivion jump height comes from the Acrobatics skill. Agility plays no part.** `JumpHeight = fJumpHeightMin + (fJumpHeightMax −
  fJumpHeightMin) × Acrobatics/100`, defaults 64 / 164 units, which works out to `64 + Acrobatics` [O1][O2][O3]. Acrobatics is governed
  by **Speed**, not Agility [O1]. The game has no air-time setting. Air time follows from height under one fixed gravity (derivation
  below).
- **Conan Exiles:** you press Space at a steep surface, or jump at a wall, and the hero grabs it. Climbing costs stamina. At 0 stamina
  you can't climb any more and fall. **Taking damage while climbing drops you at once.** Heavier armour drains stamina faster, and
  climbing gloves and boots reduce the drain [C1][C2].
- **Palworld has climbing.** Moving on a wall costs stamina. **Hanging still costs nothing.** At 0 stamina you lose grip and fall
  [P1][P2].
- **Unity:** a NavMesh can't hold walls. The valid `agentSlope` range is 0–60°, and above 45° "a steep slope cannot be distinguished
  from a wall" [U15]. So a NavMesh drawn on cliffs and rock sides is not possible. A runtime NavMesh can extend walking only up to 60°.
- **Recommendation (agent):** use one "off-mesh physical mode" for jump, fall and climb. It needs per-frame gravity plus one collision
  sweep, a grab on surfaces steeper than the climb threshold, and a return to the agent on walkable ground. Slope slow-down stays on
  the existing NavMesh. Do not build a new NavMesh (§5, §6).

## 1. Conan Exiles climbing

**Short answer.** Climbing is a contact mode that you start yourself. Funcom's notes say: "Just hit space when you reach a steep surface
and you will start climbing" [C1]. Mein-MMO says that if you jump in front of a wall, the character grabs it and climbs freely [C2].
Climbing works almost anywhere: "mountain sides, ruins, walls or trees" [C1].

| Aspect | What the sources say |
|---|---|
| Start | Space at a steep surface [C1]; jump at a wall → hold on [C2]. No auto-grab on simple contact found in any source. |
| Let go | The installed game's `Input.ini` has the action `ExitClimbing` bound to **C** (pad: face button right) [L4]. |
| Stamina | "It costs stamina to climb though, and if you run out you can't climb anymore" [C1]. No per-second number is published. |
| Hanging still | Not documented. Whether idle hanging drains stamina is **unverified**. |
| Zero stamina | You fall: "plummeting to your death if you run out of stamina before reaching the top" [C1]. |
| Damage | "If you take damage while climbing you will immediately fall down." Spiked walls and archers are the counter [C1]. |
| Armour, gear | "The heavier armor you wear the quicker you use up your stamina while climbing". Climbing boots and gloves "greatly increase the distances you can climb" [C1]. Gloves −25% and boots −25% stamina burn, total reduction capped at −90%. Armor Flexibility Kits reduce it further [C3] (snippet). |
| Perks | 2017 system: Grit was a factor in climbing stamina (dev quote, snippet only [C4]). Age of Sorcery (3.x): the perk **Quickfooted** makes climbing, jogging, jumping, sprinting and swimming cost less stamina and run faster [C5] (snippet). In the current English build it was **moved from Agility to Grit** (forum, 2026-06-04, the poster then corrected the wiki; not staff) [C6]. The official AoS post names no climbing perk [C7]. |
| Mantling | No official description found. Player complaints about topping ledges exist (unverified, page did not load). |
| Speed | No numbers found. |

Local notes: `games/ConanExiles/README.md` and `researches/conan-*` hold nothing on climbing (grep `climb|stamina|jump`). They cover
only our run/jump mod `KrinikOblivionLocomotion` and the JumpZ and fall-damage chain (`researches/conan-devkit/bp_export_combat.py`) [L5].

## 2. Palworld climbing

**Short answer: yes, Palworld has climbing.** It works on "pretty much any vertical surface", in four directions. "Moving costs
stamina", "Stamina isn't lost if the player isn't moving", and at zero the player "will lose grip and fall" [P1]. The Stamina page says
regeneration happens only "on the ground (not falling)" [P2]. Max stamina grows only from stat points spent at level-up [P2]. Players
find "the right spot to rest near the top" when they lack stamina, so resting on ledges is part of play [P3].

- **Start:** the wiki doesn't say. A guide (snippet, unverified) says you press Jump while pressed against the wall.
- **Grab from a glide:** no source found. The Grappling Gun is the documented emergency grab near the ground [P1].
- **Version that added it:** not found in any patch note. Players climb in threads from August 2024 [P3], and Early Access started on
  2024-01-19. Climbing at EA launch is likely but **unverified**.
- **Numbers:** none published (cost per second, climb speed).

## 3. Oblivion and Oblivion Remastered jumping

**Short answer.** The jump is a physics jump in a Havok game. Its **height is set by the Acrobatics skill**, not by Agility. Air time
is not a setting: it comes out of the height.

- **Engine.** Oblivion uses "an improved Havok physics engine" [O4]. Remastered is "built upon a modified version of the original
  Gamebryo engine", with UE5 for graphics [O4][O5]. A secondary write-up says Havok physics still runs in the legacy code [O6]
  (snippet). That the player is a Havok character controller (`bhkCharacterController`) is engine lore. No source was found, so it is
  **unverified**.
- **Formula (Construction Set wiki):** `JumpHeight = fJumpHeightMin + (fJumpHeightMax − fJumpHeightMin) × Acrobatics/100` [O2][O3].
  `fJumpHeightMax` is "the height of a jump made by a character with an Acrobatics skill of 100", default **164**. `fJumpHeightMin`
  defaults to **64** [O2]. UESP condenses this to `JumpHeight = 64 + AcrobaticsSkill`. The skill isn't limited to 100: Fortify
  Acrobatics keeps raising the jump, with an internal cap of 255 [O1].
- **In metres** (64 units = 1 yard, 7 units ≈ 10 cm [O7], snippet): skill 0 → 0.91 m, skill 100 → 2.34 m, skill 255 → ≈4.56 m. That
  is a linear rise of ≈1.43 cm per skill point.
- **What doesn't matter:** CS-wiki experiments found that "Fatigue has no effect on jumping height" and "Luck has no effect" [O3].
  Agility appears nowhere in the jump sources. Acrobatics' governing attribute is **Speed** [O1]. Encumbrance: not documented.
- **Fatigue and attacks:** Expert (original) halves the Fatigue cost of a jump. Remastered: Journeyman −50%, Master a further −25%.
  Novice can't attack in the air in the original, but can in Remastered [O1].
- **Fall damage** is based on fall **time**. Base damage comes from `fJumpFallTime*` "most notably fJumpFallTimeMult", and "a certain
  threshold of vertical distance has to be passed before it's considered a fall" [O8][O9]. Then `final = base × (fJumpFallSkillBase +
  Acrobatics × fJumpFallSkillMult / 100)`, with defaults 1.25 and −0.01, so only 1% less at skill 100: a bug [O9]. Remastered changed
  it to about 62.5% less at 100 [O1].
- **Air control:** `fJumpMoveBase` and `fJumpMoveMult` exist, but testers saw no effect [O3].

**Air time from height (agent's derivation, not a UESP statement).** With one gravity `g`, take-off speed is `v₀ = √(2gH)` and air time
on flat ground is `T = 2√(2H/g)`. Air time therefore grows as √H whenever height grows, which is the owner's "время в воздухе росло".
Our tuned jump (H = 2, T = 0.7 s) means `g = 8H/T² ≈ 32.65` units/s² and `v₀ ≈ 11.43`. If g stays fixed and H follows our pending
proposal `H = 1 + Agility/25`: Agility 0 → H 1, T ≈ 0.49 s · 25 → 2, 0.70 s · 50 → 3, 0.86 s · 100 → 5, 1.11 s. The Oblivion
analogue would key H to a skill, but Svarog has no Acrobatics. Agility is the agent's stand-in, and the owner decides.

## 4. Unity practice: NavMeshAgent hero plus off-mesh physical movement

**Short answer.** Let one system own the transform at a time. While off the mesh, stop the agent driving the transform
(`updatePosition = false`, `isStopped`). Move the hero yourself with gravity and a collision sweep. When you land on walkable ground,
`Warp` back onto the mesh. OffMeshLinks suit AI jumps between fixed points, not a player who can jump anywhere.

- **Ownership rule** (Unity manual): an agent and a non-kinematic Rigidbody together make a "race condition". Pushing physics needs
  "Is Kinematic". With root motion, "Information should always flow in one direction" [U1].
- **`updatePosition = false`**: "the simulated position will not be applied to the transform position and vice-versa", meant for
  "explicit control of the transform position via script" [U2]. When it turns back on, the transform jumps to `nextPosition`. Setting
  `nextPosition` is constrained by NavMesh connectivity and boundaries. Use `Warp` for teleports [U3][U4].
  - *Agent's note:* while `updatePosition` is false, the internal agent stays at take-off. Other agents avoid that ghost, and a game
    click (`SetDestination`) still moves it, and the animator reads `agent.velocity`. Hence also set `isStopped = true` or block clicks
    while off-mesh. Our R6 case already showed that `Warp` drops the path [L1].
- **`NavMesh.SamplePosition`**: "may reduce the frame rate if a large search radius is specified". Recommended `maxDistance` is
  "twice the agent height", and `hit.normal` "is never computed" [U5]. Our `NavSampleRadius = 2.5` is in that spirit [L1].
- **OffMeshLink pattern:** Unity's own sample `AgentLinkMover` sets `autoTraverseOffMeshLink = false`, then on `isOnOffMeshLink` moves
  the transform along `height·4·(t − t²)` and calls `CompleteOffMeshLink()` [U8]. It is the same precomputed parabola as our first jump,
  with endpoints fixed by links. 2020.3 runtime build settings have no drop-height or jump-distance fields [U14], so runtime builds
  don't auto-generate links.
- **Collision while off-mesh** (two cheap options):
  - **`CharacterController`**, added by the mod and enabled only off-mesh: it "is not affected by forces and will only move when you
    call the Move function". You get `slopeLimit`, `stepOffset`, `isGrounded`, `collisionFlags` and `OnControllerColliderHit` (with
    the hit normal) for free [U6]. This is the least custom collision code.
  - **Manual sweep**: a `SphereCast` or `CapsuleCast` from the old position to the new one, one per frame. Note: SphereCast "will not
    detect colliders for which the sphere overlaps the collider", so start the sweep from a non-penetrating position [U7].
    `SpherecastCommand` batches exist if many are ever needed.
- **Climbing controller pattern** (Catlike Coding, "Climbing") [U10]:
  - A surface is climbable when its normal lies within a max climb angle, and ceilings are excluded. A `climbMask` marks
    unclimbable layers.
  - While climbing: gravity off, and a **grip** acceleration pulls the body into the wall along the normal.
  - Input axes are re-based on the wall: Z = up, X = cross(normal, up).
  - Climbing is cancelled for a couple of steps after a jump, so a jump off the wall isn't re-grabbed.
  - Outer corners work because the grip keeps pulling the body to the surface. In crevasses, the last climb normal is used.
  - Ledge mantle is not in that tutorial. The common pattern is a forward ray at head height that misses, plus a downward ray from
    above-front that hits walkable ground; then a short scripted move up and over (agent's summary, no single canonical source).

## 5. Q6: a second "climbable" NavMesh built at runtime?

**Short answer.** It is possible with the core API for slopes up to 60° only. It is not possible for cliffs, rock sides or walls. It is
also the most expensive and riskiest path. The minimal sufficient path is no new NavMesh plus a physics/raycast climbing mode.

- **API availability:** `NavMeshBuilder.CollectSources`, `BuildNavMeshData`, `UpdateNavMeshDataAsync`, `NavMesh.AddNavMeshData` and
  `NavMesh.CreateSettings` are in `UnityEngine.AI` (AIModule) [U11][U12][U13][U17]. The game ships `UnityEngine.AIModule.dll` and **no**
  `Unity.AI.Navigation` (NavMeshComponents) assembly [L3]. The package isn't needed: its `LocalNavMeshBuilder` sample only wraps the
  core calls. It keeps an 80×20×80 box around a tracked object, does an initial sync build, then async rebuilds, re-centring on a 10%
  grid [U9].
- **Slope limit:** `agentSlope` valid range is **0–60°**. Above 45° voxelisation gives artifacts, "a steep slope cannot be
  distinguished from a wall" [U15]. The tracker says the clamp was relaxed only for the editor bake; no runtime confirmation above 60°
  was found [U18] (snippet). A NavMesh is a surface of walkable floors, so vertical faces can't be on it.
- **Second agent type:** `NavMesh.CreateSettings()` returns settings with a new unique `agentTypeID`, "useful … for different sized
  characters" [U17]. The hero's agent would be switched to that type and would path only on our data, while NPCs keep the baked mesh.
  Our data must then cover everywhere the hero goes: a world build at load, or a local box that follows him.
- **Threads and cost:**
  - The build runs on job workers (`NavMeshBuildSettings.maxJobWorkers`: "maximum number of worker threads that the build process can
    utilize") [U14].
  - `CollectSources` runs on the main thread; one report gives 0.5 ms [U19].
  - Integration also lands on the main thread. Reports show `NavMesh.Integrate.RemoveTiles` up to 5.5 s on huge meshes, and stalls in
    `ExtractTileMesh` and `RasterizeTriangles` [U20]. Another report shows frames waiting on the build's jobs; mitigations were
    `maxJobWorkers = 1` and skipping overlapping updates [U19].
  - The docs say nothing about threading [U12]. **Against our 1 ms worst-frame budget this is the main risk.**
- **Geometry:** "at runtime, any meshes with read/write access disabled will not be processed" [U16]. Rocks and props in a shipped game
  are likely non-readable, so they would silently vanish from the build. Static batching triggers the same error [U21] (snippet). This
  is **unverified** for Svarog: a console probe of `Mesh.isReadable` on rock colliders would settle it. Terrain sources are separate
  shapes and don't need mesh readability [U16].
- **Memory:** no published figures. Measure `Profiler.GetRuntimeMemorySizeLong(navMeshData)` if this path is ever taken.
- **Alternatives:** sample collider surfaces with rays on demand, or a precomputed "climbable grid". On-demand sampling is exactly what
  the climb controller does anyway: one cast per frame toward the wall. A precomputed grid or graph pays off only for AI that plans
  routes over cliffs, which no idea asks for.

**Ranked by effort (agent's recommendation):**

| # | Path | Gives | Cost / risk | Verdict |
|---|---|---|---|---|
| A | Slope slow-down on the **existing** mesh: terrain normal under the hero (`TerrainData.GetInterpolatedNormal`, about 10 Hz) → multiply `agent.speed` where `PlayerController` writes it (`PlayerController.cs:149, :265` per [L2]) | idea 16a | µs, no physics | **do** |
| B | **Off-mesh physical mode** (§6): jump, fall, grab, climb, mantle, stamina | ideas 16b and 17, the owner's words | 1 sweep and 1–2 rays per frame, only while off-mesh | **do** — minimal sufficient |
| C | Runtime second NavMesh, agentSlope ≤ 60, hero switched to it | click-to-path on 45–60° slopes only | main-thread integration spikes, unreadable meshes vanish, the hero's whole range must be covered | only if the owner asks after B; build once at load, measured |
| D | Climbable surface graph or grid | AI climbing, auto-routes over cliffs | high | not needed |

## 6. Synthesis: one off-mesh physical mode (agent's proposal)

**States:** `OnMesh` (the game's agent moves the hero, as now) · `Air` · `Climb` · `Mantle` · `StandOffMesh` (on top of a rock without
mesh).

1. **Air** (entered by Space, or by walking off an edge):
   - Each frame: `v.y −= g·dt`, then one sweep from the old position to the new (`CharacterController.Move` or `CapsuleCast`).
   - `g` is constant and only take-off speed scales (§3), so air time comes out of the physics. The landing point is no longer
     searched ahead along the arc, which answers the owner's «просто физика».
   - Hit with normal angle ≤ walkable (the baked mesh slope, read at runtime via `NavMesh.GetSettingsByID(agent.agentTypeID)`, still
     **unknown**): `SamplePosition` with a small radius. Mesh found → `Warp`, `updatePosition = true`, `OnMesh`. No mesh →
     `StandOffMesh`.
   - Hit with angle ≥ climb threshold (≈50°, idea 16): **grab** → `Climb`. Ceiling → `v.y = min(v.y, 0)`.
2. **Climb:**
   - No gravity. Each frame a cast toward −normal re-sticks the hero to the wall (Catlike's grip).
   - W/S moves up and down, A/D sideways in the wall plane.
   - Energy drains per second **also while still**: the owner's «пока висит». This follows Conan, not Palworld, whose idle costs nothing.
   - Svarog's pool is **energy**: sprint (Shift) needs it, Endurance gives +1 max energy [L2].
   - Ends:
     - energy 0 → `Air` (fall);
     - **any damage → `Air`** (Conan's rule, which also stops the "climb out of enemy reach" exploit);
     - Space → push off the wall;
     - a let-go key (Conan uses C) → `Air`;
     - top reached (head-height forward ray misses, down ray from above-front hits walkable) → `Mantle`.
3. **Mantle:** a short scripted move up and over (≈0.3–0.5 s, taste), then `OnMesh` or `StandOffMesh`.
4. **Walking into a wall from `OnMesh`** (idea 16b): the click-to-move hero can't path onto a cliff. The trigger is a fork for the
   owner: the hero is held at the mesh edge while the player keeps steering into a steep surface, or a click on a cliff collider.
5. **Fall damage:** Oblivion bases it on fall time with a minimum-height threshold [O8][O9]. Whether Svarog gets one is idea 16 fork 4.

**Main-thread budget** (all mods ≤ 1 ms in the worst frame):

- `OnMesh` costs 0 casts per frame, plus the slope check at about 10 Hz.
- Off-mesh costs 1 sweep plus 1–2 short rays per frame, and `SamplePosition` only on a landing candidate.
- Reference: the current whole-arc search (≈14 raycasts + `SamplePosition`) was measured at 0.021–0.290 ms once per jump [L1].
- Log the per-frame cost with a `Stopwatch`, as `Jump.cs` does.
- No NavMesh building at runtime.

**Risks:**

1. **Animation:**
   - No climb, hang or ledge clip is known. The idea-17 bundle scan looked for jump clips only, so the next step is a UnityPy scan for
     `climb|hang|ledge|wall`.
   - Fallbacks: a held pose (the jump take-off pose), or bones posed in `LateUpdate`. The controller's IK pass can't be switched on
     from a mod (agent's understanding, unverified).
   - The animator reads `agent.velocity`, so the agent must be stopped off-mesh, or the hero "runs" on the wall.
2. **Camera:** on a cliff the orbit camera can sit inside the rock or behind it. The camera mod's ground-distance ray is a partial
   guard. Turning the camera to face the wall is a possible step, and a question of taste.
3. **Game assumptions:**
   - Enemies path on the mesh and won't reach a hero on a wall. The damage→fall rule covers this.
   - **Autosave on a timer while off-mesh** (the Iron Man save writes itself) could load the hero on a cliff with no mesh. Either
     save the last on-mesh point or block saving off-mesh.
   - The added `CharacterController` collider must be on a layer the game's mouse-pick and `Ground` rays ignore, and enabled only
     off-mesh.
4. **Water and long falls:** Svarog's NavMesh lies on pond beds (bug 38), so landing in water is not "no mesh". Check this case.

**Forks for the owner:**

- climb control (WASD on the wall, or click);
- drain while hanging still (he said yes);
- fall damage;
- climb threshold vs the baked mesh slope;
- mantle look;
- jump formula: Oblivion uses a skill, our proposal uses Agility.

## 7. Not verified

- Conan: idle-hang drain, climb speed, how mantling works, an exact stamina number.
- Palworld: version that added climbing, how a grab starts.
- Oblivion: the player as a Havok `bhkCharacterController`, whether encumbrance affects jump height.
- Unity: `agentSlope > 60` at runtime, exact main-thread share of `UpdateNavMeshDataAsync` in 2020.3, readability of Svarog's rock
  meshes, the baked mesh slope of Svarog.

## Sources

- [C1] Funcom, "Update 28 – Climbing and Exploration System" — https://www.conanexiles.com/?p=2640
- [C2] Mein-MMO, "Conan Exiles: Climbing Feature" — https://mein-mmo.de/en/conan-exiles-kletter-feature,160595/
- [C3] Conan Exiles Wiki, Climbing Gloves / Reinforced Climbing Gloves / Armor Flexibility Kit (snippet; fetch HTTP 402) —
  https://conanexiles.fandom.com/wiki/Climbing_Gloves · https://conanexiles.fandom.com/wiki/Reinforced_Climbing_Gloves ·
  https://conanexiles.fandom.com/wiki/Armor_Flexibility_Kit
- [C4] 3DTested, "New Climbing, Exploration Systems Arrive" (snippet; fetch HTTP 523) —
  https://www.3dtested.com/news/conan-exiles-climbing-exploration-update,34986.html
- [C5] Ginx, Lone Samurai build (Quickfooted text; snippet) — https://www.ginx.tv/en/samurai-build
- [C6] Funcom forums, "Which information is correct?" (2026-06-04) — https://forums.funcom.com/t/which-information-is-correct/299585
- [C7] Funcom, "Attributes, Perks, and Corruption in the Age of Sorcery Update" — https://www.conanexiles.com/?p=11451
- [P1] Palworld Wiki, Climbing — https://palworld.wiki.gg/wiki/Climbing
- [P2] Palworld Wiki, Stamina — https://palworld.wiki.gg/wiki/Stamina
- [P3] Steam, Palworld discussion (Aug 2024) — https://steamcommunity.com/app/1623730/discussions/0/4509877188788618874
- [O1] UESP, Oblivion:Acrobatics — https://en.uesp.net/wiki/Oblivion:Acrobatics
- [O2] CS Wiki, fJumpHeightMax — https://cs.uesp.net/wiki/FJumpHeightMax (and https://cs.uesp.net/wiki/FJumpHeightMin)
- [O3] CS Wiki, Category:Jumping and its talk page — https://cs.uesp.net/wiki/Category:Jumping ·
  https://cs.uesp.net/wiki/Category_talk:Jumping
- [O4] Wikipedia, The Elder Scrolls IV: Oblivion — https://en.wikipedia.org/wiki/The_Elder_Scrolls_IV:_Oblivion
- [O5] Wikipedia, Oblivion Remastered — https://en.wikipedia.org/wiki/The_Elder_Scrolls_IV:_Oblivion_Remastered
- [O6] GameGPU, Oblivion Remastered benchmark (snippet) —
  https://en.gamegpu.com/test-gpu/action-fps-tps/the-elder-scrolls-iv-oblivion-remastered-itogovyj-godovoj-benchmark-2025
- [O7] CS Wiki, Oblivion Units (snippet) — https://cs.uesp.net/wiki/Oblivion_Units
- [O8] CS Wiki, fJumpFallTimeBase — https://cs.uesp.net/wiki/FJumpFallTimeBase
- [O9] CS Wiki, fJumpFallSkillMult — https://cs.uesp.net/wiki/FJumpFallSkillMult
- [U1] Unity 2020.3 Manual, Using NavMesh Agent with Other Components —
  https://docs.unity3d.com/2020.3/Documentation/Manual/nav-MixingComponents.html
- [U2] NavMeshAgent.updatePosition — https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AI.NavMeshAgent-updatePosition.html
- [U3] NavMeshAgent.nextPosition — https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AI.NavMeshAgent-nextPosition.html
- [U4] NavMeshAgent.Warp — https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AI.NavMeshAgent.Warp.html
- [U5] NavMesh.SamplePosition — https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AI.NavMesh.SamplePosition.html
- [U6] CharacterController — https://docs.unity3d.com/2020.3/Documentation/ScriptReference/CharacterController.html
- [U7] Physics.SphereCast — https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Physics.SphereCast.html
- [U8] Unity NavMeshComponents sample AgentLinkMover —
  https://github.com/Unity-Technologies/NavMeshComponents/blob/master/Assets/Examples/Scripts/AgentLinkMover.cs
- [U9] Unity NavMeshComponents sample LocalNavMeshBuilder —
  https://github.com/Unity-Technologies/NavMeshComponents/blob/master/Assets/Examples/Scripts/LocalNavMeshBuilder.cs
- [U10] Catlike Coding, Movement: Climbing — https://catlikecoding.com/unity/tutorials/movement/climbing/
- [U11] NavMeshBuilder.CollectSources — https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AI.NavMeshBuilder.CollectSources.html
- [U12] NavMeshBuilder.UpdateNavMeshDataAsync —
  https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AI.NavMeshBuilder.UpdateNavMeshDataAsync.html
- [U13] NavMeshBuilder.BuildNavMeshData —
  https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AI.NavMeshBuilder.BuildNavMeshData.html
- [U14] NavMeshBuildSettings — https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AI.NavMeshBuildSettings.html
- [U15] NavMeshBuildSettings.agentSlope — https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AI.NavMeshBuildSettings-agentSlope.html
- [U16] NavMeshBuildSource — https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AI.NavMeshBuildSource.html
- [U17] NavMesh.CreateSettings — https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AI.NavMesh.CreateSettings.html
- [U18] Unity Issue Tracker, "navmesh slope is clamped to 60 since unity 5" (snippet) —
  https://issuetracker.unity3d.com/issues/navmesh-slope-is-clamped-to-60-since-unity-5
- [U19] Unity Discussions, "UpdateNavMeshDataAsync Locking Main Thread" —
  https://discussions.unity.com/t/updatenavmeshdataasync-locking-main-thread/911940
- [U20] Unity Discussions, "Updating a huge NavMesh with many build sources asynchronously" (2019) —
  https://discussions.unity.com/t/updating-a-huge-navmesh-with-many-build-sources-asynchronously/764343
- [U21] Unity Issue Tracker, RuntimeNavMeshBuilder "Combined Mesh does not allow read access" with static batching (snippet) —
  https://issuetracker-mig.prd.it.unity3d.com/issues/navmesh-runtimenavmeshbuilder-source-mesh-combined-mesh-does-not-allow-read-access-when-batching-static-is-turned-on
- [L1] `SvarogsDream/src/KrinikFixes/Jump.cs` (arc search 0.021–0.290 ms; R6 path drop on `Warp`) ·
  `testcases/reports/2026-10-14_svarog-jump-arc-r3-r7.md`
- [L2] `researches/svarogs-dream/inventory-stats-mechanics.md` (agent speed, sprint energy, Endurance → max energy)
- [L3] Game folder `Svarog's Dream_Data/Managed/`: `UnityEngine.AIModule.dll` present, no `Unity.AI.Navigation*` (listing, 2026-10-14)
- [L4] Conan Exiles install, `ConanSandbox/Saved/Config/Windows/Input.ini`: `ActionName="ExitClimbing"`, `Key=C` (read 2026-10-14)
- [L5] `games/ConanExiles/README.md`, `researches/conan-*` (grep `climb|stamina|jump`, 2026-10-14)
