# 12 — Pitfalls checklist (symptom → cause → fix)

> Run this list before declaring a jump, fall or climb change done, and again when the log or a frame looks wrong. Each
> entry points to the handbook section that holds the evidence (quotes and sources live there, not here). Causes are from
> the quoted pages or source; fixes are conclusions from them unless the section quotes them. The last block is specific
> to Svarog's Dream and comes from our own probes.

---

## A cast does not see what the capsule already touches
TAG: pitfall.start-inside-skipped
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Physics.CapsuleCastAll.html

- **Symptom:** the hero passes through a tree trunk or a wall he was standing against at take-off; landing on a slope
  sinks the capsule into the ground.
- **Cause:** single-hit casts skip colliders they start inside or touching; the multi-hit forms report them with
  `distance == 0` and a normal opposite to the sweep (`phys.start-inside-rule`, `perf.physics.start-inside`).
- **Fix:** start every sweep a little behind the capsule (a back step of a few centimetres, as the KCC motor does) and
  subtract it from the hit distance; treat `distance <= 0` as "overlapping" and resolve it with `ComputePenetration`
  (`phys.compute-penetration`), never as a wall normal. Keep the terrain safety net (`phys.terrain`).

## The sweep normal at an edge is slanted
TAG: pitfall.sweep-normal-at-edge
SOURCE: https://www.peroxide.dk/papers/collision/collision.pdf

- **Symptom:** landing on the lip of a rock or a step is taken for a wall (the hero slides off); a wall corner reads as
  walkable floor.
- **Cause:** a sphere or capsule sweep returns the contact normal (sphere centre minus contact point), not the face
  normal (`phys.sweep-normal`).
- **Fix:** use the sweep normal for sliding; for "floor, wall or ledge top" decisions fire one short `Raycast` at the
  hit point and read the face normal (`phys.slide-kcc`).

## The hero pops back when the agent takes over again
TAG: pitfall.updateposition-snapback
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AI.NavMeshAgent-updatePosition.html

- **Symptom:** at landing the hero jumps back to the take-off spot or to where a mid-air click sent the agent.
- **Cause:** re-enabling `updatePosition` moves the transform to the simulated agent position, and the simulated agent
  stayed behind or kept walking its path (`nav.agent.update-position`, `nav.pitfall.updateposition-snapback`).
- **Fix:** `Warp` to the landing point first, then set `updatePosition = true` in the same frame
  (`nav.recipe.handover`).

## Warp fails silently
TAG: pitfall.warp-unchecked
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AI.NavMeshAgent.Warp.html

- **Symptom:** after a landing the hero stands, clicks do nothing, the log shows "SetDestination can only be called on an
  active agent that has been placed on a NavMesh".
- **Cause:** `Warp` returns `false` for a point off the mesh; what it resets is undocumented (`nav.agent.warp`,
  `nav.pitfall.warp-off-mesh`).
- **Fix:** never Warp to a raw physics point: `SamplePosition` first, Warp to `hit.position`, check the bool, log a
  refusal, retry next frame.

## Warp drops the click-to-move path
TAG: pitfall.warp-drops-path
SOURCE: D:\work\ai_sandbox\SvarogsDream\src\KrinikFixes\Jump.cs (case R6, 2026-10-14)

- **Symptom:** the hero ran to a clicked point, jumped on the way, and stops where he lands.
- **Cause:** our observation (case R6): after `Warp` the agent has no path (`nav.agent.warp`, project note).
- **Fix:** read `hasPath`, `destination` before Warp and call `SetDestination(dest)` after, if the target is still ahead
  (`nav.recipe.handover`, step 9).

## SamplePosition returns the floor above, and no normal
TAG: pitfall.sampleposition-floor-above
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AI.NavMesh.SamplePosition.html

- **Symptom:** a landing under an overhang puts the hero on top of it; code reading `hit.normal` sees `(0,0,0)`.
- **Cause:** "does not consider obstructions"; `hit.normal` "is never computed" (`nav.navmesh.sample-position`).
- **Fix:** accept a sampled point only if it is not higher than the touch point plus a small margin; take normals from
  physics casts. Radius about twice the agent height (the doc's cost advice).

## The agent's ghost keeps walking while the hero flies
TAG: pitfall.agent-ghost
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AI.NavMeshAgent-velocity.html

- **Symptom:** a mid-air click moves something invisible; other characters step around an empty spot; the run animation
  plays in the air or on the wall.
- **Cause:** with `updatePosition = false` the simulated agent still exists, follows its path and feeds `velocity`,
  which the game's animator reads (`nav.agent.velocity`, `nav.pitfall.ghost-avoidance`).
- **Fix:** `isStopped = true` and `velocity = Vector3.zero` at take-off, restore them at landing; the mod drives the air
  and climb pose itself (`nav.recipe.handover`).

## A CharacterController puts the hero back where it was
TAG: pitfall.cc-teleport-overridden
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Physics.SyncTransforms.html

- **Symptom:** `transform.position = p` "does nothing" while a CharacterController is on the hero.
- **Cause:** the controller keeps its own position and applies it; `autoSyncTransforms` is off by default
  (`cc.teleport-sync`).
- **Fix:** `transform.position = p; Physics.SyncTransforms();` before the next `Move`, or disable, move, enable. Do not
  flip `Physics.autoSyncTransforms` from a mod.

## isGrounded flickers
TAG: pitfall.cc-isgrounded-flicker
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/CharacterController-isGrounded.html

- **Symptom:** the grounded state toggles every other frame; landing logic fires twice.
- **Cause:** `isGrounded` and `collisionFlags` record only the last `Move`; a move with no downward part cannot touch
  the floor (`cc.isgrounded`, `cc.grounded-flicker`).
- **Fix:** keep a small constant downward speed while grounded and make decisions from the mod's own ground probe.

## CharacterController overlap recovery ignores terrain
TAG: pitfall.cc-overlap-terrain
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/CharacterController-enableOverlapRecovery.html

- **Symptom:** a controller enabled on a slope sinks into the terrain or falls through it.
- **Cause:** "Overlap recovery currently works with all geometries except heightfields" (`cc.overlap-recovery`).
- **Fix:** `CheckCapsule` the start pose before enabling the controller and lift it clear (`phys.overlap-check`).

## Changing a global physics setting from a mod
TAG: pitfall.global-physics-settings
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Physics-autoSyncTransforms.html

- **Symptom:** the whole game slows down, triggers fire OnTriggerExit/Enter, NPC logic changes.
- **Cause:** `autoSyncTransforms`, `queriesHitTriggers`, `IgnoreLayerCollision` are global to the game
  (`perf.physics.autosync`, `phys.triggers`, `phys.ignore-layer-vs-mask`).
- **Fix:** read and log them once; pass masks and `QueryTriggerInteraction.Ignore` to each query instead.

## Queries hit trigger volumes
TAG: pitfall.queries-hit-triggers
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/QueryTriggerInteraction.html

- **Symptom:** the hero "lands" in mid-air on a quest zone, an aggro sphere or a water volume.
- **Cause:** queries hit triggers by default (`phys.triggers`).
- **Fix:** every movement query passes `QueryTriggerInteraction.Ignore`.

## One-sided faces and the inside of concave meshes
TAG: pitfall.backfaces-concave
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Physics-queriesHitBackfaces.html

- **Symptom:** a ground probe started under a floor finds nothing; a hero inside a building mesh walks through walls.
- **Cause:** back faces are ignored by default; a concave mesh has no inside (`phys.backfaces`, `phys.meshcollider`).
- **Fix:** start ground probes from inside the capsule, above the feet; cap the travel per iteration so the capsule
  never tunnels.

## ClosestPoint on terrain or a concave mesh
TAG: pitfall.closestpoint-limits
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Physics.ClosestPoint.html

- **Symptom:** a distance to a cliff or the terrain comes out as zero, or a warning appears.
- **Cause:** "The collider can only be BoxCollider, SphereCollider, CapsuleCollider or a convex MeshCollider"
  (`phys.closest-point`).
- **Fix:** use casts against level geometry; for a rough distance `collider.bounds.ClosestPoint` (our `colliders` console
  command does so).

## Terrain.SampleHeight without the terrain offset
TAG: pitfall.sampleheight-offset
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Terrain.SampleHeight.html

- **Symptom:** ground height off by the terrain tile's Y; heights at the tile border repeat the edge value.
- **Cause:** the height is "relative to the Terrain space" and the position is clamped to the tile (`phys.terrain`).
- **Fix:** add `terrain.GetPosition().y`, pick the tile that contains the point, and use it only as a hint or a safety
  net — it sees no rocks, houses or trees.

## NonAlloc results are unordered
TAG: pitfall.nonalloc-unordered
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Physics.CapsuleCastNonAlloc.html

- **Symptom:** the "first" hit in the buffer is not the nearest; with a full buffer the nearest hit is missing.
- **Cause:** "The order of the results is undefined" (`phys.nonalloc`, `perf.physics.nonalloc-buffer`).
- **Fix:** loop for the minimum distance; size the buffer for the worst case; use the single-hit form when only the
  nearest hit matters and nothing must be filtered out.

## RaycastHit.collider is a lookup
TAG: pitfall.hit-collider-lookup
SOURCE: https://raw.githubusercontent.com/Unity-Technologies/UnityCsReference/2020.3/Modules/Physics/ScriptBindings/Dynamics.bindings.cs

- **Symptom:** a per-frame loop over hits costs more than the casts.
- **Cause:** `collider` calls `FindObjectFromInstanceID` on every get; `transform` goes through it too
  (`perf.physics.hit-accessors`).
- **Fix:** read `point`, `normal`, `distance` in the hot path; touch `collider` once per decision and cache by id;
  exclude the hero's own layer in the mask rather than filtering hits by object.

## Jump height depends on the frame rate
TAG: pitfall.euler-framerate
SOURCE: http://www.mathforgameprogrammers.com/gdc2016/GDC2016_Pittman_Kyle_BuildingABetterJump.pdf

- **Symptom:** the same jump is about 9 % lower at 30 FPS than at 144 FPS (or higher, with the other Euler order).
- **Cause:** Euler stepping in `Update` (`jump.integration`).
- **Fix:** step position with `v·dt − ½·g·dt²`, then `v −= g·dt` — exact for constant gravity.

## Copying Unity's CharacterController example
TAG: pitfall.unity-example-constant
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/CharacterController.Move.html

- **Symptom:** a "1 m" jump peaks at 1.5 m.
- **Cause:** the example's jump line uses `-3.0f` where the height formula needs `-2` (`jump.unity-cc-example`).
- **Fix:** `v0 = sqrt(2·g·H)`, derived, not copied (`jump.mvp-table`).

## A fall speed cap stops speed-based damage from growing
TAG: pitfall.terminal-cap
SOURCE: https://en.wikipedia.org/wiki/Terminal_velocity

- **Symptom:** above some height every fall does the same damage; a high-Agility hero can never die from a fall.
- **Cause:** with a cap every long fall lands at the cap speed (`fall.terminal-cap-trap`).
- **Fix:** base damage on fall height (apex minus touch point); if a cap is added, keep it above the largest deadly
  impact speed.

## Fall measured from the take-off point
TAG: pitfall.fall-from-takeoff
SOURCE: https://cs.uesp.net/wiki/FJumpFallTimeBase

- **Symptom:** a jump up a ledge and a fall from it give the wrong damage; a flat jump "falls" 0 m.
- **Cause:** the fall starts at the highest point, not at take-off (`fall.measure-from-apex`).
- **Fix:** track `apex = max(y)` in flight; `fall = apex − touchY`. Flat jumps (1 + A/25 m) stay below the safe height
  (4 + A/10 m) at every Agility.

## Hand IK from a mod
TAG: pitfall.ik-pass-unavailable
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/MonoBehaviour.OnAnimatorIK.html

- **Symptom:** `OnAnimatorIK` is never called; `SetIKPosition` warns.
- **Cause:** it runs only for layers with the IK pass, a flag that lives in `UnityEditor.Animations` and cannot be set
  in a player (`anim.ik`).
- **Fix:** probe once whether the game's controller has an IK layer; otherwise pose bones in `LateUpdate` or through
  `HumanPoseHandler` (`anim.humanposehandler`, `anim.fallbacks`).

## Toggling root motion
TAG: pitfall.rootmotion-toggle
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Animator-applyRootMotion.html

- **Symptom:** the hero's animation restarts or snaps each time the mode changes.
- **Cause:** "Changing the value of applyRootMotion at runtime will re-initialize the animator" (`anim.rootmotion`).
- **Fix:** never toggle it per frame; an `OnAnimatorMove` component added only while off-mesh takes the root motion
  instead.

## MatchTarget does nothing
TAG: pitfall.matchtarget-limits
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Animator.MatchTarget.html

- **Symptom:** a mantle with `MatchTarget` ignores the ledge point.
- **Cause:** base layer only, one match at a time, and the state must be the current one (`anim.matchtarget`).
- **Fix:** call it once the target state is current and not in transition; without a mantle clip with root motion it
  has nothing to match — move the body by script.

## A bone pose is overwritten
TAG: pitfall.posing-order
SOURCE: https://docs.unity3d.com/2020.3/Documentation/Manual/ExecutionOrder.html

- **Symptom:** a held climbing pose flickers or never shows.
- **Cause:** the Animator writes bones after `Update`; two components with the same execution order run in no fixed order
  (`anim.execution-order`).
- **Fix:** pose in `LateUpdate`, on a component with an explicit late execution order.

## Re-grabbing the wall right after a push-off
TAG: pitfall.regrab-after-pushoff
SOURCE: https://catlikecoding.com/unity/tutorials/movement/climbing/

- **Symptom:** a jump off the wall sticks the hero back to the same wall.
- **Cause:** contact with the climbable surface is still there in the first frames (`climb.catlike.jump-cancel`).
- **Fix:** ignore grabs for a short time after a push-off (≈0.15 s, or until a distance from the wall).

## Mantle into a wall or a ceiling
TAG: pitfall.mantle-room
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Physics.CheckCapsule.html

- **Symptom:** the hero mantles into a roof, a tree crown or another rock.
- **Cause:** a ledge was found but the space on top was not checked (`climb.ledge.room-check`).
- **Fix:** `CheckCapsule` the standing pose on the ledge before the move; name the blocker in the log with
  `OverlapCapsuleNonAlloc`.

## Profiler markers vanish in the game build
TAG: pitfall.profiler-markers-stripped
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Profiling.ProfilerMarker.html

- **Symptom:** `Profiler.BeginSample` or `ProfilerMarker` in the mod shows nothing.
- **Cause:** both are `[Conditional("ENABLE_PROFILER")]` (`perf.profiler.markers`).
- **Fix:** time the mod's own code with `Stopwatch` (100 ns ticks in this Mono, `perf.timing.stopwatch`) and the
  `modcost` console command.

## Per-frame allocations
TAG: pitfall.per-frame-alloc
SOURCE: https://docs.unity3d.com/2020.3/Documentation/Manual/performance-incremental-garbage-collection.html

- **Symptom:** occasional multi-millisecond spikes in an otherwise cheap mod.
- **Cause:** every allocated byte feeds the incremental collector; the game's `boot.config` sets `gc-max-time-slice=3`
  (`perf.gc.incremental`).
- **Fix:** NonAlloc queries with buffers allocated once; no LINQ, no string building, no `new` arrays in the flight loop.

---

## Svarog: cliffs have no collider
TAG: pitfall.svarog-cliffs-no-collider
SOURCE: D:\work\ai_sandbox\SvarogsDream\src\KrinikCameraRework\RockProxies.cs (EXP-0256)

- **Symptom:** the hero flies into a cliff face; the camera ends up inside the rock.
- **Cause:** the models `SM_Cliff_*` carry no collider; no game query sees them.
- **Fix:** query the camera mod's own physics scene `KrinikCameraRockProxies` as well
  (`SceneManager.GetSceneByName(...).GetPhysicsScene()`); it exists only while that mod's `AvoidRocks` is on.

## Svarog: the console command `layers` is not about physics
TAG: pitfall.svarog-layers-command
SOURCE: D:\work\ai_sandbox\SvarogsDream\src\KrinikDevHarness\Plugin.cs (case "layers", case "colliders")

- **Symptom:** a recon of collider layers prints terrain texture layers with smoothness and metallic.
- **Cause:** `layers` lists `TerrainLayer` assets.
- **Fix:** use `colliders [radius] [N]`: colliders around the hero by physics layer, kinds, triggers, the hero's layer
  and its ignore list.

## Svarog: the game's mouse rays pass a mask as the distance
TAG: pitfall.svarog-mask-as-distance
SOURCE: D:\work\ai_sandbox\KUMM\bugs\34_DONE_svarog_far_clicks_ray_150m_short_of_view.md

- **Symptom:** a ray "on the Ground layer" in the game's code hits any layer, out to 256 m (or 1 m for `Default`).
- **Cause:** `Physics.Raycast(ray, out hit, LayerMask.GetMask(...))` binds the int to `maxDistance`; the mask stays
  default (bug 34, `PlayerController.cs:411` and ≈15 more sites).
- **Fix:** when copying the game's logic, pass the distance and the mask as separate arguments.
