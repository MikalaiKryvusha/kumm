# Research — jump, fall and climbing handbook for a Unity 2020.3 mod (Svarog's Dream)

> **Created:** 2026-10-14 (owner's order, chat)
> **Parent:** `researches/svarogs-dream/climbing-jump-recon.md`; KUMM ideas 16 (climbing) and 17 (jump)
> **Status:** reference — 2026-10-14: 8 topic files by four research agents + pitfalls checklist; quote spot-check by an
> independent verifier against live pages: 24 of 24 confirmed, 0 refuted (`VERIFY_2026-10-14.md`)
> **Outbound:** —

A local, grep-first handbook for writing a physical jump, fall and climbing mode **in C# at runtime** inside a BepInEx
mod for a Unity 2020.3.49 Mono game whose hero is moved by a `NavMeshAgent` (Svarog's Dream). Built from fetched pages,
reference source and our own probes, not from memory. Owner's order, verbatim (`[OWNER]` · chat 2026-10-14):
«ресерч документ, методическое пособие по прыжкам, разанью - напишешь?» Model: `researches/unity-ugui-layout/`.

## How to use it

- Every section: `## <title>`, then `TAG: <prefix>.<topic>`, then one or more `SOURCE: <url>` lines.
- Find a topic: `grep -rn "TAG: nav.recipe" researches/unity-jump-climb/` · read a section:
  `grep -n -A30 "TAG: pitfall.start-inside-skipped" researches/unity-jump-climb/12_pitfalls.md`.
- Before changing `KrinikFixes/Jump.cs` or building climbing, read **`12_pitfalls.md`** top to bottom.
- Tag prefixes: `jump.*` arc math · `fall.*` fall damage · `cc.*` CharacterController · `phys.*` physics queries and
  collide-and-slide · `nav.*` NavMeshAgent hand-over · `climb.*` climbing and mantle · `anim.*` Animator from a mod ·
  `perf.*` main-thread cost · `pitfall.*` the checklist.
- Trust labels: quoted text = the fetched page; **(source)** = C# reference source; **(derived)** = the author's
  conclusion; **(secondary)** = forum, blog, wiki; **(snippet)** = search summary only; **(project)** = our own probe.
- Each topic file ends with "Not fetched / gaps" — what could not be sourced. Nothing here was tested in the game
  except the **(project)** lines.
- Lint: `python -I researches/unity-jump-climb/tools/check_tags.py [--index]` (TAG + SOURCE per section, no duplicate or
  dangling tag references; exit 1 on problems; proven red on a broken file 2026-10-14).

## Files

| File | Covers |
|---|---|
| `01_jump-arc-math.md` | g and v0 from height and time (Pittman GDC 2016), piecewise gravity, exact per-frame step vs Euler, coyote time, buffering, air control, terminal speed, Oblivion/Skyrim jump height, MVP table |
| `02_charactercontroller.md` | CharacterController members and defaults, isGrounded, teleport and SyncTransforms, overlap recovery, with a NavMeshAgent, off-mesh recipe |
| `03_physics-queries.md` | Raycast/SphereCast/CapsuleCast, start-inside rule, ComputePenetration, ClosestPoint limits, triggers, back faces, masks, terrain, collide-and-slide (Fauerby, KCC, Catlike) |
| `04_navmeshagent-handover.md` | updatePosition, nextPosition, Warp, path state, SamplePosition, build settings, pitfalls, hand-over recipe |
| `05_climbing-mantle.md` | Catlike climbing, BotW / Conan / Palworld stamina rules, ledge detection and room check, mantle motion, state machine |
| `06_animation-in-mod.md` | Animator API from a mod, MatchTarget, IK limits, execution order, HumanPoseHandler, override controllers, fallbacks without a climbing clip |
| `07_fall-damage.md` | height / time / speed models, Oblivion, Skyrim, Minecraft, Half-Life, Terraria, BG3, conversions, MVP mapping |
| `08_performance.md` | what 1 ms means, query cost drivers, NonAlloc, batch commands, NavMesh costs, GC, Stopwatch, profiler markers, budget table |
| `12_pitfalls.md` | the checklist: symptom → cause → fix, with Svarog-specific traps at the end |
| `tools/check_tags.py` | the lint above |

## TAG INDEX

| Tag | File | Meaning |
|---|---|---|
| `jump.pittman.premise` | 01_jump-arc-math.md | Talk premise and assumptions |
| `jump.pittman.height-time` | 01_jump-arc-math.md | g and v0 from jump height and time to apex |
| `jump.pittman.height-distance` | 01_jump-arc-math.md | g and v0 from height and horizontal distance at foot speed |
| `jump.pittman.piecewise-gravity` | 01_jump-arc-math.md | Piecewise gravity: fast fall, variable height, heavier fall |
| `jump.variable-height` | 01_jump-arc-math.md | Variable jump height in shipped code |
| `jump.integration` | 01_jump-arc-math.md | Integration: Euler, velocity Verlet, exact constant-acceleration step |
| `jump.unity-cc-example` | 01_jump-arc-math.md | Unity's CharacterController.Move example uses 3, not 2 |
| `jump.coyote-time` | 01_jump-arc-math.md | Coyote time |
| `jump.jump-buffer` | 01_jump-arc-math.md | Jump buffering |
| `jump.air-control` | 01_jump-arc-math.md | Air control |
| `jump.terminal-velocity` | 01_jump-arc-math.md | Max fall speed / terminal velocity |
| `jump.oblivion-height` | 01_jump-arc-math.md | The Elder Scrolls IV: Oblivion jump height |
| `jump.skyrim-height` | 01_jump-arc-math.md | The Elder Scrolls V: Skyrim jump height |
| `jump.mvp-table` | 01_jump-arc-math.md | MVP worked example: tuned 2 m in 0.7 s, then H from Agility |
| `cc.overview` | 02_charactercontroller.md | What a CharacterController is |
| `cc.properties-defaults` | 02_charactercontroller.md | Properties, units and documented defaults |
| `cc.tuning-guidance` | 02_charactercontroller.md | Tuning guidance (skin width, step offset, slope limit) |
| `cc.move` | 02_charactercontroller.md | Move |
| `cc.simple-move` | 02_charactercontroller.md | SimpleMove |
| `cc.isgrounded` | 02_charactercontroller.md | isGrounded, collisionFlags, CollisionFlags |
| `cc.velocity` | 02_charactercontroller.md | velocity |
| `cc.rigidbodies` | 02_charactercontroller.md | Rigidbodies, pushing and detectCollisions |
| `cc.overlap-recovery` | 02_charactercontroller.md | enableOverlapRecovery (and why terrain is special) |
| `cc.controller-collider-hit` | 02_charactercontroller.md | OnControllerColliderHit and ControllerColliderHit |
| `cc.teleport-sync` | 02_charactercontroller.md | Setting transform.position: autoSyncTransforms, SyncTransforms, teleport |
| `cc.grounded-flicker` | 02_charactercontroller.md | isGrounded flicker and the small constant downward velocity |
| `cc.navmeshagent` | 02_charactercontroller.md | CharacterController together with a NavMeshAgent |
| `cc.recipe-offmesh-mode` | 02_charactercontroller.md | Recipe: enable a CharacterController only while off-mesh |
| `phys.raycast` | 03_physics-queries.md | Physics.Raycast |
| `phys.spherecast` | 03_physics-queries.md | Physics.SphereCast |
| `phys.capsulecast` | 03_physics-queries.md | Physics.CapsuleCast and building the capsule points |
| `phys.start-inside-rule` | 03_physics-queries.md | The "starts inside" rule and initial-overlap hits |
| `phys.overlap-check` | 03_physics-queries.md | OverlapCapsule, CheckCapsule, CheckSphere |
| `phys.compute-penetration` | 03_physics-queries.md | Physics.ComputePenetration (depenetration) |
| `phys.closest-point` | 03_physics-queries.md | Physics.ClosestPoint and Collider.ClosestPoint |
| `phys.raycasthit` | 03_physics-queries.md | RaycastHit fields |
| `phys.sweep-normal` | 03_physics-queries.md | Sweep normal is the contact normal, not the face normal |
| `phys.triggers` | 03_physics-queries.md | Triggers: QueryTriggerInteraction and Physics.queriesHitTriggers |
| `phys.backfaces` | 03_physics-queries.md | Back faces: Physics.queriesHitBackfaces |
| `phys.layermask` | 03_physics-queries.md | LayerMask: GetMask, NameToLayer, ~mask, built-in constants |
| `phys.ignore-layer-vs-mask` | 03_physics-queries.md | IgnoreLayerCollision vs query masks |
| `phys.terrain` | 03_physics-queries.md | TerrainCollider vs Terrain.SampleHeight |
| `phys.meshcollider` | 03_physics-queries.md | MeshCollider: convex vs concave limits |
| `phys.nonalloc` | 03_physics-queries.md | NonAlloc variants and why |
| `phys.slide-fauerby` | 03_physics-queries.md | Collide-and-slide: Fauerby, "Improved Collision detection and Response" (2003) |
| `phys.slide-kcc` | 03_physics-queries.md | Collide-and-slide: Kinematic Character Controller motor (Philippe St-Amand) |
| `phys.ground-snap-catlike` | 03_physics-queries.md | Ground snapping: Catlike Coding, "Surface Contact" |
| `phys.slide-minimal` | 03_physics-queries.md | Minimal collide-and-slide loop for one frame |
| `nav.agent.update-position` | 04_navmeshagent-handover.md | updatePosition: the coupling switch |
| `nav.agent.update-rotation-upaxis` | 04_navmeshagent-handover.md | updateRotation and updateUpAxis |
| `nav.agent.next-position` | 04_navmeshagent-handover.md | nextPosition and Move: on-mesh only |
| `nav.agent.warp` | 04_navmeshagent-handover.md | Warp: teleport the simulated agent |
| `nav.agent.velocity` | 04_navmeshagent-handover.md | velocity and desiredVelocity |
| `nav.agent.path-state` | 04_navmeshagent-handover.md | Path state: destination, hasPath, pathPending, isPathStale, remainingDistance |
| `nav.agent.set-destination` | 04_navmeshagent-handover.md | SetDestination and its "not on a NavMesh" error |
| `nav.agent.is-stopped-reset-path` | 04_navmeshagent-handover.md | isStopped and ResetPath |
| `nav.agent.is-on-navmesh` | 04_navmeshagent-handover.md | isOnNavMesh |
| `nav.agent.offmesh-links` | 04_navmeshagent-handover.md | Off-mesh links on the agent |
| `nav.sample.agent-link-mover` | 04_navmeshagent-handover.md | Unity sample AgentLinkMover.cs |
| `nav.agent.base-offset-type-avoidance` | 04_navmeshagent-handover.md | baseOffset, agentTypeID, avoidance |
| `nav.agent.enabled-toggle` | 04_navmeshagent-handover.md | enabled = false / true |
| `nav.manual.mixing-components` | 04_navmeshagent-handover.md | Manual: Using NavMesh Agent with Other Components |
| `nav.manual.coupling-animation` | 04_navmeshagent-handover.md | Manual: Coupling Animation and Navigation (LocomotionSimpleAgent) |
| `nav.navmesh.sample-position` | 04_navmeshagent-handover.md | NavMesh.SamplePosition |
| `nav.navmesh.raycast-edge-path` | 04_navmeshagent-handover.md | NavMesh.Raycast, FindClosestEdge, CalculatePath |
| `nav.navmesh.build-settings` | 04_navmeshagent-handover.md | NavMeshBuildSettings via GetSettingsByID |
| `nav.navmesh.query-filter` | 04_navmeshagent-handover.md | NavMeshQueryFilter and AllAreas |
| `nav.navmesh.height-and-links` | 04_navmeshagent-handover.md | The mesh height is approximate; auto jump/drop links |
| `nav.pitfall.updateposition-snapback` | 04_navmeshagent-handover.md | Pitfall: snap-back when updatePosition is turned on again |
| `nav.pitfall.warp-off-mesh` | 04_navmeshagent-handover.md | Pitfall: Warp or binding fails far from the mesh |
| `nav.pitfall.ghost-avoidance` | 04_navmeshagent-handover.md | Pitfall: other agents avoid the ghost |
| `nav.recipe.handover` | 04_navmeshagent-handover.md | Recipe: take the hero off the mesh and hand it back |
| `climb.catlike.climbable-test` | 05_climbing-mantle.md | Catlike "Climbing": which surface is climbable |
| `climb.catlike.climb-mask` | 05_climbing-mantle.md | Catlike: climbMask and unclimbable layers |
| `climb.catlike.grip-speed` | 05_climbing-mantle.md | Catlike: grip, speed, gravity while climbing |
| `climb.catlike.wall-relative-input` | 05_climbing-mantle.md | Catlike: input relative to the wall |
| `climb.catlike.jump-cancel` | 05_climbing-mantle.md | Catlike: cancel climbing right after a jump |
| `climb.catlike.corners-crevasses` | 05_climbing-mantle.md | Catlike: outer corners, inner corners, crevasses |
| `climb.botw.stamina` | 05_climbing-mantle.md | Breath of the Wild: stamina while climbing, exhaustion, regeneration |
| `climb.botw.climb-jump-rain` | 05_climbing-mantle.md | Breath of the Wild: the climbing jump, gear, rain, a cut rest mechanic |
| `climb.conan.numbers` | 05_climbing-mantle.md | Conan Exiles: numbers the recon did not have |
| `climb.palworld.extra-rules` | 05_climbing-mantle.md | Palworld: rules the recon did not have |
| `climb.aaa.ac-shadows` | 05_climbing-mantle.md | Assassin's Creed Shadows: handholds, not free climbing |
| `climb.aaa.pandora-mantle` | 05_climbing-mantle.md | Avatar: Frontiers of Pandora: markup-free stepups and mantles (GDC 2024) |
| `climb.ledge.detect-pattern` | 05_climbing-mantle.md | Ledge detection: the ALS-Community MantleCheck |
| `climb.ledge.room-check` | 05_climbing-mantle.md | Room check and the Unity 2020.3 query set |
| `climb.ledge.mantle-motion` | 05_climbing-mantle.md | Mantle motion: how ALS moves the body, and what we copy |
| `climb.stamina.table` | 05_climbing-mantle.md | Stamina rules side by side |
| `climb.state.machine` | 05_climbing-mantle.md | State machine for our off-mesh mode |
| `climb.state.budget` | 05_climbing-mantle.md | Per-frame cost of the states |
| `anim.local.hero-animator` | 06_animation-in-mod.md | What we already know about the hero's Animator (local) |
| `anim.play` | 06_animation-in-mod.md | Play and PlayInFixedTime |
| `anim.crossfade` | 06_animation-in-mod.md | CrossFade and CrossFadeInFixedTime |
| `anim.hash` | 06_animation-in-mod.md | Hashes and state lookup |
| `anim.stateinfo` | 06_animation-in-mod.md | Reading state progress |
| `anim.speed` | 06_animation-in-mod.md | speed |
| `anim.rootmotion` | 06_animation-in-mod.md | Root motion: applyRootMotion and OnAnimatorMove |
| `anim.matchtarget` | 06_animation-in-mod.md | MatchTarget |
| `anim.ik` | 06_animation-in-mod.md | IK: OnAnimatorIK needs an IK Pass we cannot set |
| `anim.disable-keep-state` | 06_animation-in-mod.md | Disabling the Animator without losing its state |
| `anim.manual-update` | 06_animation-in-mod.md | Stepping the Animator by hand: Animator.Update |
| `anim.override-controller` | 06_animation-in-mod.md | AnimatorOverrideController: runtime clip swap |
| `anim.culling` | 06_animation-in-mod.md | Culling and update mode |
| `anim.execution-order` | 06_animation-in-mod.md | Frame order: why LateUpdate posing wins |
| `anim.humanposehandler` | 06_animation-in-mod.md | HumanPoseHandler: muscle-space pose read and write |
| `anim.find-clips` | 06_animation-in-mod.md | Finding clips and states at runtime |
| `anim.playables` | 06_animation-in-mod.md | Playables: a foreign clip on the game's Animator |
| `anim.fallbacks` | 06_animation-in-mod.md | Three fallbacks for a climbing look without a climbing clip |
| `fall.models` | 07_fall-damage.md | Three models: height, time, impact speed |
| `fall.oblivion.settings` | 07_fall-damage.md | Oblivion: fall-damage settings |
| `fall.oblivion.formula` | 07_fall-damage.md | Oblivion: the formula and the Acrobatics bug |
| `fall.skyrim.formula` | 07_fall-damage.md | Skyrim: formula, settings, modifiers |
| `fall.skyrim.metres` | 07_fall-damage.md | Skyrim: the same numbers in metres |
| `fall.minecraft.formula` | 07_fall-damage.md | Minecraft: formula |
| `fall.minecraft.reduction` | 07_fall-damage.md | Minecraft: what reduces it |
| `fall.halflife.speed-linear` | 07_fall-damage.md | Half-Life: damage linear in impact speed |
| `fall.terraria` | 07_fall-damage.md | Terraria: linear in distance |
| `fall.bg3.percent-linear` | 07_fall-damage.md | Baldur's Gate 3: share of max HP, linear in height |
| `fall.conversion` | 07_fall-damage.md | Converting height, air time and impact speed (constant gravity) |
| `fall.terminal-cap-trap` | 07_fall-damage.md | Terminal-velocity trap |
| `fall.measure-from-apex` | 07_fall-damage.md | Measure the fall from the apex |
| `fall.mvp-mapping` | 07_fall-damage.md | MVP mapping: safe and deadly heights as impact speeds |
| `perf.budget.frame` | 08_performance.md | What "1 ms for all mods" means |
| `perf.physics.cost-drivers` | 08_performance.md | What makes a physics query expensive |
| `perf.physics.nonalloc-gc` | 08_performance.md | Non-allocating queries and garbage |
| `perf.physics.nonalloc-buffer` | 08_performance.md | NonAlloc buffer semantics |
| `perf.physics.hit-accessors` | 08_performance.md | RaycastHit accessors are not free |
| `perf.physics.start-inside` | 08_performance.md | Casts that start inside a collider |
| `perf.physics.autosync` | 08_performance.md | Physics.autoSyncTransforms and SyncTransforms |
| `perf.physics.batch-commands` | 08_performance.md | Batched casts: RaycastCommand, SpherecastCommand, CapsulecastCommand, BoxcastCommand |
| `perf.jobs.schedule-complete` | 08_performance.md | Job scheduling rules that bite a mod |
| `perf.navmesh.queries` | 08_performance.md | NavMesh query costs |
| `perf.navmesh.agents` | 08_performance.md | Agent count, avoidance and carving |
| `perf.gc.incremental` | 08_performance.md | Incremental GC and per-frame allocations |
| `perf.timing.stopwatch` | 08_performance.md | Timing our own code: Stopwatch in Unity's Mono |
| `perf.profiler.markers` | 08_performance.md | Profiler markers from a mod in a release player |
| `perf.budget.table` | 08_performance.md | Budget table: per-frame targets for the jump/climb mod |
| `pitfall.start-inside-skipped` | 12_pitfalls.md | A cast does not see what the capsule already touches |
| `pitfall.sweep-normal-at-edge` | 12_pitfalls.md | The sweep normal at an edge is slanted |
| `pitfall.updateposition-snapback` | 12_pitfalls.md | The hero pops back when the agent takes over again |
| `pitfall.warp-unchecked` | 12_pitfalls.md | Warp fails silently |
| `pitfall.warp-drops-path` | 12_pitfalls.md | Warp drops the click-to-move path |
| `pitfall.sampleposition-floor-above` | 12_pitfalls.md | SamplePosition returns the floor above, and no normal |
| `pitfall.agent-ghost` | 12_pitfalls.md | The agent's ghost keeps walking while the hero flies |
| `pitfall.cc-teleport-overridden` | 12_pitfalls.md | A CharacterController puts the hero back where it was |
| `pitfall.cc-isgrounded-flicker` | 12_pitfalls.md | isGrounded flickers |
| `pitfall.cc-overlap-terrain` | 12_pitfalls.md | CharacterController overlap recovery ignores terrain |
| `pitfall.global-physics-settings` | 12_pitfalls.md | Changing a global physics setting from a mod |
| `pitfall.queries-hit-triggers` | 12_pitfalls.md | Queries hit trigger volumes |
| `pitfall.backfaces-concave` | 12_pitfalls.md | One-sided faces and the inside of concave meshes |
| `pitfall.closestpoint-limits` | 12_pitfalls.md | ClosestPoint on terrain or a concave mesh |
| `pitfall.sampleheight-offset` | 12_pitfalls.md | Terrain.SampleHeight without the terrain offset |
| `pitfall.nonalloc-unordered` | 12_pitfalls.md | NonAlloc results are unordered |
| `pitfall.hit-collider-lookup` | 12_pitfalls.md | RaycastHit.collider is a lookup |
| `pitfall.euler-framerate` | 12_pitfalls.md | Jump height depends on the frame rate |
| `pitfall.unity-example-constant` | 12_pitfalls.md | Copying Unity's CharacterController example |
| `pitfall.terminal-cap` | 12_pitfalls.md | A fall speed cap stops speed-based damage from growing |
| `pitfall.fall-from-takeoff` | 12_pitfalls.md | Fall measured from the take-off point |
| `pitfall.ik-pass-unavailable` | 12_pitfalls.md | Hand IK from a mod |
| `pitfall.rootmotion-toggle` | 12_pitfalls.md | Toggling root motion |
| `pitfall.matchtarget-limits` | 12_pitfalls.md | MatchTarget does nothing |
| `pitfall.posing-order` | 12_pitfalls.md | A bone pose is overwritten |
| `pitfall.regrab-after-pushoff` | 12_pitfalls.md | Re-grabbing the wall right after a push-off |
| `pitfall.mantle-room` | 12_pitfalls.md | Mantle into a wall or a ceiling |
| `pitfall.profiler-markers-stripped` | 12_pitfalls.md | Profiler markers vanish in the game build |
| `pitfall.per-frame-alloc` | 12_pitfalls.md | Per-frame allocations |
| `pitfall.svarog-cliffs-no-collider` | 12_pitfalls.md | Svarog: cliffs have no collider |
| `pitfall.svarog-layers-command` | 12_pitfalls.md | Svarog: the console command `layers` is not about physics |
| `pitfall.svarog-mask-as-distance` | 12_pitfalls.md | Svarog: the game's mouse rays pass a mask as the distance |
