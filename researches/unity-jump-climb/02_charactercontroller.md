# 02 — CharacterController: members, defaults, grounding, teleport, NavMeshAgent

> Everything about Unity's built-in `CharacterController` (PhysX CCT) that matters for a BepInEx mod which adds one to a
> NavMeshAgent-driven hero and enables it only while the hero is off the NavMesh (air, climb, mantle): every member with
> its documented default and units, `Move` vs `SimpleMove`, when `isGrounded` / `collisionFlags` are updated,
> `OnControllerColliderHit` fields, how it treats Rigidbodies, why setting `transform.position` "does nothing"
> (`Physics.autoSyncTransforms`), how it coexists with a NavMeshAgent, the `isGrounded` flicker, and a derived recipe.
> Pages fetched 2026-10-14 from the Unity 2020.3 docs and the 2020.3 branch of UnityCsReference.

---

## What a CharacterController is
TAG: cc.overview
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/CharacterController.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/Manual/class-CharacterController.html
SOURCE: https://raw.githubusercontent.com/Unity-Technologies/UnityCsReference/2020.3/Modules/Physics/ScriptBindings/Dynamics.bindings.cs (L372-388)

- API: "A CharacterController allows you to easily do movement constrained by collisions without having to deal with a
  rigidbody." "A CharacterController is not affected by forces and will only move when you call the Move function."
- Manual: "It is simply a capsule shaped Collider which can be told to move in some direction from a script. The Controller
  will then carry out the movement but be constrained by collisions. It will slide along walls, walk up stairs (if they
  are lower than the Step Offset) and walk on slopes within the Slope Limit."
- `class CharacterController : Collider` — it IS a collider (inherits `enabled`, `isTrigger`, `bounds`, `ClosestPoint`,
  `Raycast`, `contactOffset`). **(source)** the whole binding is 14 members, all `extern` (native PhysX code):
  `SimpleMove`, `Move`, `velocity {get;}`, `isGrounded {get;}`, `collisionFlags {get;}`, `radius`, `height`, `center`,
  `slopeLimit`, `stepOffset`, `skinWidth`, `minMoveDistance`, `detectCollisions`, `enableOverlapRecovery`.
  `velocity`, `isGrounded`, `collisionFlags` have **no setter**: you cannot reset them, only call `Move` again.
- Manual hint: "The Character Controller can not be affected by objects through physics."
- **(derived)** Because it is a Collider, while enabled it is also a target for every game raycast (camera collision, AI
  line of sight, mouse picking) on its layer; `Collider.enabled = false` removes it ("Enabled Colliders will collide with
  other Colliders, disabled Colliders won't."). Disable it whenever the hero is back on the NavMesh.

## Properties, units and documented defaults
TAG: cc.properties-defaults
SOURCE: https://docs.unity3d.com/2020.3/Documentation/Manual/class-CharacterController.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/uploads/Main/Inspector-CharacterController.png
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/CharacterController-slopeLimit.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/CharacterController-stepOffset.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/CharacterController-skinWidth.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/CharacterController-minMoveDistance.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/CharacterController-center.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/CharacterController-detectCollisions.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/CharacterController-enableOverlapRecovery.html

No 2020.3 page (nor the 6000.0 manual) gives a table of `AddComponent` defaults. The only numbers are in the manual's
Inspector screenshot (column "Screenshot"), which is an old-UI image (it shows Height **1**) — treat it as an example, not
as what `AddComponent<CharacterController>()` returns in 2020.3.

| Member | Units / type | Screenshot | Documented text (quoted) |
|---|---|---|---|
| `slopeLimit` | degrees, float | 45 | "Limits the collider to only climb slopes that are less steep (in degrees) than the indicated value." |
| `stepOffset` | meters, float | 0.3 | "The character will step up a stair only if it is closer to the ground than the indicated value. This should not be greater than the Character Controller's height or it will generate an error." |
| `skinWidth` | float | 0.08 | "Two colliders can penetrate each other as deep as their Skin Width. Larger Skin Widths reduce jitter. Low Skin Width can cause the character to get stuck. A good setting is to make this value 10% of the Radius." API: "should be a small, positive non zero value." |
| `minMoveDistance` | float | 0 | "If the character tries to move less than this distance, it will not move at all. ... In most situations this value should be left at 0." |
| `center` | Vector3, local | (0,0,0) | "The center of the character's capsule relative to the transform's position." Manual: "won't affect how the Character pivots." |
| `radius` | float | 0.5 | "Length of the Capsule Collider's radius. This is essentially the width of the collider." |
| `height` | float | 1 | "Changing this will scale the collider along the Y axis in both positive and negative directions." |
| `detectCollisions` | bool | — | "(by default this is always enabled)" |
| `enableOverlapRecovery` | bool | — | "By default, overlap recovery is enabled." |

**(derived)** Read and log all nine values once right after `AddComponent` (the mod's journal is the only proof of the
real defaults in this game), then assign every one explicitly. The API pages' examples set
`center = new Vector3(0, 1, 0)` and `height = 2.0f` (separate pages); together that is a capsule standing on a pivot at
the feet.

## Tuning guidance (skin width, step offset, slope limit)
TAG: cc.tuning-guidance
SOURCE: https://docs.unity3d.com/2020.3/Documentation/Manual/class-CharacterController.html

- "It is recommended to always use around 2 meters for a human-like character."
- "Step Offset can affect this too, make sure that this value is between 0.1 and 0.4 for a 2 meter sized human."
- "Slope Limit should not be too small. Often using a value of 90 degrees works best. The Character Controller will not
  be able to climb up walls due to the capsule shape."
- "The Skin Width is one of the most critical properties to get right ... If your character gets stuck it is most likely
  because your Skin Width is too small." "It's good practice to keep your Skin Width at least greater than 0.01 and more
  than 10% of the Radius." "We recommend keeping Min Move Distance at 0."
- Hints: "changing Character Controller properties in the inspector will recreate the controller in the scene, so any
  existing Trigger contacts will get lost, and you will not get any OnTriggerEntered messages until the controller is
  moved again." "The Character Controller's capsule used in queries such as raycast might shrink by a small factor."
- **(derived)** For this mod `slopeLimit` decides what the CCT walks up by itself while airborne/landing; the
  "walkable vs climbable" decision belongs to the mod (compare the hit normal with its own angle), so keep slopeLimit at the
  NavMesh agent's max slope rather than 90. Whether a property write from script also "recreates" the controller is not
  documented (only "in the inspector"): do not write `height`/`center` every frame; set them on mode entry (crouch/climb
  shapes) and check the journal.

## Move
TAG: cc.move
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/CharacterController.Move.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/CharacterController.SimpleMove.html

- `public CollisionFlags Move(Vector3 motion);`
- "The given direction requires absolute movement delta values. A collision constrains the Move from taking place. The
  return, CollisionFlags, indicates the direction of a collision: None, Sides, Above, and Below.
  **CharacterController.Move does not use gravity.**" — you integrate gravity yourself and pass `velocity * dt` (meters
  this frame, not m/s).
- The page's own example calls `Move` **twice per frame** (horizontal, then `playerVelocity * Time.deltaTime`) while the
  SimpleMove page says: "It is recommended that you make only one call to Move or SimpleMove per frame."
- The example's jump is `playerVelocity.y += Mathf.Sqrt(jumpHeight * -3.0f * gravityValue);` with
  `gravityValue = -9.81f`. **(derived)** Apex height of a launch speed v is v^2/(2g), so `-3.0f` gives 1.5 x jumpHeight;
  the exact formula is `Mathf.Sqrt(2f * g * h)` (Starter Assets uses `Mathf.Sqrt(JumpHeight * -2f * Gravity)`, see
  `cc.grounded-flicker`).
- **(derived)** Use ONE `Move(totalDelta)` per frame so that `isGrounded`/`collisionFlags` describe the whole frame.

## SimpleMove
TAG: cc.simple-move
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/CharacterController.SimpleMove.html

`public bool SimpleMove(Vector3 speed);` — "Velocity along the y-axis is ignored. Speed is in units/s. Gravity is
automatically applied. Returns if the character is grounded." **(derived)** Useless for a jump (vertical speed is
dropped, gravity strength not configurable); the mod uses `Move` only.

## isGrounded, collisionFlags, CollisionFlags
TAG: cc.isgrounded
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/CharacterController-isGrounded.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/CharacterController-collisionFlags.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/CollisionFlags.html
SOURCE: https://raw.githubusercontent.com/Unity-Technologies/UnityCsReference/2020.3/Modules/Physics/Managed/Dynamics.cs (L329-339)

- `isGrounded`: "Was the CharacterController touching the ground during the last move?"
- `collisionFlags`: "What part of the capsule collided with the environment during the last CharacterController.Move call."
- Enum **(source)**: `None = 0, Sides = 1, Above = 2, Below = 4` (aliases `CollidedSides/Above/Below` = same values).
  It is a bitmask: test with `(flags & CollisionFlags.Below) != 0`.
- **(derived)** Both are a record of the last `Move`/`SimpleMove`, nothing else refreshes them: not a ground probe. A
  `Move` with zero or upward vertical motion cannot touch the ground below, so it returns without `Below` and
  `isGrounded` becomes false even when standing. After the controller is disabled and re-enabled they still hold the
  values of the last Move; never trust them on the first frame of the mode.

## velocity
TAG: cc.velocity
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/CharacterController-velocity.html

"The velocity returned is simply the difference in distance for the current timestep before and after a call to
CharacterController.Move or CharacterController.SimpleMove." "when it is stuck at a wall this value will be the zero
vector." "it won't track movements to the transform that happen outside of the CharacterController". **(derived)** It is
the post-slide displacement / dt: after a `Sides` hit, `controller.velocity` gives the slid velocity to carry into the
next frame; after a `Below` hit its y is the clipped fall speed.

## Rigidbodies, pushing and detectCollisions
TAG: cc.rigidbodies
SOURCE: https://docs.unity3d.com/2020.3/Documentation/Manual/class-CharacterController.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/CharacterController-detectCollisions.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/CharacterController.OnControllerColliderHit.html

- Manual: "The Controller does not react to forces on its own and it does not automatically push Rigidbodies away. If you
  want to push Rigidbodies or objects with the Character Controller, you can apply forces to any object that it collides
  with via the OnControllerColliderHit() function through scripting."
- **(derived from the two quotes around it)** a Rigidbody collider in the way is an obstacle for `Move` (it blocks; the
  CCT does not move it); any push is the mod's own code in `OnControllerColliderHit`.
- `detectCollisions`: "This method does not affect collisions detected during the character controller's movement but
  rather decides whether an incoming collider will be blocked by the controller's collider. For example, a box collider in
  the Scene will block the movement of the controller, but the box may still fall through the controller if
  detectCollisions is false."
- The official push example skips `body == null || body.isKinematic`, skips hits below (`hit.moveDirection.y < -0.3`),
  and sets `body.velocity = pushDir * pushPower` with `pushDir = (moveDirection.x, 0, moveDirection.z)`.

## enableOverlapRecovery (and why terrain is special)
TAG: cc.overlap-recovery
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/CharacterController-enableOverlapRecovery.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/TerrainCollider.html

"Overlap recovery can be used to depenetrate character controllers (CCTs) from static objects when an overlap is detected.
This can happen in three main cases: when the CCT is directly spawned or teleported in another object; when the CCT
algorithm fails due to limited FPU accuracy; when the "up vector" is modified ..." "This only concerns static objects,
dynamic objects are ignored by overlap recovery." "When overlap recovery is not activated, it is possible for the CCTs to
go through static objects." "**Overlap recovery currently works with all geometries except heightfields.**"
TerrainCollider is "A heightmap based collider". **(derived)** Enabling the controller with its capsule inside a
TerrainCollider is not repaired: check `Physics.CheckCapsule` (see `phys.overlap-check`) at the start pose and lift the
pose before enabling.

## OnControllerColliderHit and ControllerColliderHit
TAG: cc.controller-collider-hit
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/MonoBehaviour.OnControllerColliderHit.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/ControllerColliderHit.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/ControllerColliderHit-normal.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/ControllerColliderHit-moveDirection.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/ControllerColliderHit-moveLength.html
SOURCE: https://raw.githubusercontent.com/Unity-Technologies/UnityCsReference/2020.3/Modules/Physics/Managed/Dynamics.cs (L201-225)

"OnControllerColliderHit is called when the controller hits a collider while performing a Move." It is a MonoBehaviour
message, so **(derived)** the mod must put its own MonoBehaviour on the hero's GameObject to receive it.

| Field | Text (quoted) |
|---|---|
| `collider` | "The collider that was hit by the controller." |
| `controller` | "The controller that hit the collider." |
| `gameObject` / `transform` / `rigidbody` | of the hit collider (source: `m_Collider.gameObject`, `.transform`, `.attachedRigidbody`) |
| `normal` | "The normal of the surface we collided with in world space." Note: "When the CharacterController is colliding with an edge or a corner rather than a flat surface, the reported normal may be different when colliding with BoxColliders than when colliding with MeshColliders." |
| `point` | "The impact point in world space." |
| `moveDirection` | "not necessarily the same as the movement vector passed to CharacterController.Move ... The CharacterController uses a sequence of motions to perform a move in accordance with the move direction and the step Offset" |
| `moveLength` | "How far the character has travelled until it hit the collider." "the initial movement vector is decomposed into a set of movements, according to CharacterController.stepOffset." |

**(source)** `ControllerColliderHit` is a `class` (not a struct) with private `m_Push`. **(derived, not measured)** a
managed object per hit may mean GC pressure; if the journal shows allocations, drop the callback and use
`collisionFlags` + own casts (`phys.*`) for wall/ledge classification.

## Setting transform.position: autoSyncTransforms, SyncTransforms, teleport
TAG: cc.teleport-sync
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Physics-autoSyncTransforms.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Physics.SyncTransforms.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/Manual/class-PhysicsManager.html
SOURCE: https://discussions.unity.com/t/character-controller-ignores-transform-position/729515
SOURCE: https://issuetracker.unity3d.com/issues/charactercontroller-overrides-objects-position-when-teleporting-with-transform-dot-position

- `autoSyncTransforms`: "When set to false, synchronization only occurs prior to the physics simulation step during the
  Fixed Update. You can also manually synchronize transform changes using Physics.SyncTransforms." "For projects made in
  Unity 2017.2 onwards, turn this option off." Physics Manager: "Auto Sync Transforms ... By default, this setting is
  disabled."
- `SyncTransforms`: "Apply Transform changes to the physics engine. ... Use this function to flush those changes to the
  physics engine manually."
- **(secondary)** forum, Baste (2019-01-22): "The character controller has it's own internal definition of what position
  it has, and will set the transform's position" (to that every frame); "the character controller checks it's starting
  position in OnEnable." Fixes reported in the thread: disable controller, set `transform.position`, re-enable;
  `Physics.SyncTransforms()` right after the assignment (Reverie_Wisp 2021-09-19); turning Auto Sync Transforms on
  (lukasz13 2019-06-10). Baste 2021-09-20: "SyncTransforms syncs all transforms"; Reverie_Wisp's profiling: cost of
  either method "relatively low if not slightly in favor of using Physics.SyncTransforms()". MonkeyZero: rotation "is still
  ignored completely even when wrapping it in the enabled switches".
- **(snippet)** Unity issue "CharacterController overrides object's position when teleporting with transform.position"
  was closed "By Design" with auto sync disabled (search summary only; the tracker page now returns 404).
- **(derived)** Do not flip the global `Physics.autoSyncTransforms` from a mod (it changes the whole game's cost).
  Teleport = `transform.position = p; Physics.SyncTransforms();` before the next `Move`.

## isGrounded flicker and the small constant downward velocity
TAG: cc.grounded-flicker
SOURCE: https://discussions.unity.com/t/collision-flags-on-character-controller-flip-between-below-and-none/38513
SOURCE: https://discussions.unity.com/t/how-to-keep-charactercontroller-grounded-without-constantly-applying-gravity/53602
SOURCE: https://paste.myst.rs/raw/srbokf3x/lfb49bsq
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/CharacterController.Move.html

- **(secondary)** Avaista 2012-03-19: "the character Controller's collision flags seem to jump between
  CollisionFlags.Below and CollisionFlags.None." Diagnosis: "But the collision flags are based off of the movement."
  "When the controller moved with 0 in the y, it did not hit the object beneath it"; next frame gravity is applied
  because it was not grounded, and the cycle repeats. Workaround: "verticalSpeed = -.001".
- **(secondary)** aldonaletto 2012-10-16: "Usually, the gravity is continuously applied in order to keep the CC grounded,
  and there's nothing wrong with this." PhobicGunner: "-0.1*Time.deltaTime gravity - very small".
- **(secondary)** Unity Starter Assets `ThirdPersonController.cs` (read from a third-party paste copy): when grounded,
  "// stop our velocity dropping infinitely when grounded" `if (_verticalVelocity < 0.0f) _verticalVelocity = -2f;`;
  jump "// the square root of H * -2 * G = how much velocity needed to reach desired height"
  `_verticalVelocity = Mathf.Sqrt(JumpHeight * -2f * Gravity);` (`Gravity = -15.0f`, `JumpHeight = 1.2f`); ground is
  NOT `isGrounded` but its own `Physics.CheckSphere(transform.position - (0, GroundedOffset, 0), GroundedRadius,
  GroundLayers, QueryTriggerInteraction.Ignore)` with `GroundedOffset = -0.14f`, `GroundedRadius = 0.28f`
  ("Not part of the CharacterController built in grounded check"); `FallTimeout = 0.15f` "Useful for walking down stairs".
- **(derived)** The same file's clamp `if (_verticalVelocity < _terminalVelocity)` with `_terminalVelocity = 53.0f` is
  always true while falling (negative speed), so it never limits the fall; clamp with `Mathf.Max(v.y, -terminal)`.
- **(derived)** Rule for the mod: while "on ground" inside the physical mode keep `v.y = -2` (or similar small negative)
  so every `Move` touches ground, and use the mod's own probe for decisions (`phys.slide-minimal`).

## CharacterController together with a NavMeshAgent
TAG: cc.navmeshagent
SOURCE: https://docs.unity3d.com/2020.3/Documentation/Manual/nav-MixingComponents.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AI.NavMeshAgent-updatePosition.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AI.NavMeshAgent-nextPosition.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AI.NavMeshAgent.Warp.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AI.NavMeshAgent-isStopped.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AI.NavMeshAgent.ResetPath.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AI.NavMesh.SamplePosition.html
SOURCE: https://discussions.unity.com/t/using-a-navmeshagent-with-a-charactercontroller/662015

- Manual (Rigidbody case, same logic for any second mover): "If both NavMesh Agent and Rigidbody (non-kinematic) are
  active at the same time, you have race condition"; "Both components may try to move the agent at the same which leads
  to undefined behavior". "Information should always flow in one direction". "Disable NavMeshAgent.updatePosition and
  NavMeshAgent.updateRotation to detach the simulation from the game objects locations".
- `updatePosition`: "The default value is true." "When true: changing the transform position will affect the simulated
  position and vice-versa." "When false: the simulated position will not be applied to the transform position and
  vice-versa." "When enabling the updatePosition (from previously being disabled), the transform will be moved to the
  simulated position."
- `nextPosition`: "By setting nextPosition you can directly control where the internal agent position should be. The
  agent will be moved towards the position, but is constrained by the navmesh connectivity and boundaries." Doc pattern
  for "controlled by something else": `agent.updatePosition = false; agent.nextPosition = transform.position;` each Update.
  "See Also: Warp for teleporting a navmesh agent."
- `Warp(Vector3)`: "Warps agent to the provided position. Returns true if successful".
- `isStopped`: "If set to True, the NavMesh agent's movement will be stopped along its current path."
- `ResetPath`: "if the agent is on an OffMeshLink when this function is called, it will complete the link immediately."
- `NavMesh.SamplePosition`: "The value of `hit.normal` is never computed. It is always (0,0,0)." "This function does not
  consider obstructions" (may return the floor above). "it is recommended that you specify a maxDistance of twice the
  agent height."
- **(secondary)** ChazBass 2017-04-18: `updatePosition = false; updateRotation = false;`
  `_charControl.Move(_desVelocity.normalized * _speed * Time.deltaTime);` then `_agent.velocity = _charControl.velocity;`
  — "If you do not update the nav mesh agent with the velocity of the character controller post move, unpredictable
  behavior results."

## Recipe: enable a CharacterController only while off-mesh
TAG: cc.recipe-offmesh-mode
SOURCE: derived from cc.teleport-sync, cc.navmeshagent, cc.isgrounded, cc.overlap-recovery, cc.grounded-flicker

**(derived)** — verify each step in the game journal (position before/after, flags, agent state).
1. **Once** (hero spawn): `cc = hero.AddComponent<CharacterController>()`; log its defaults; set `radius`, `height`,
   `center` (feet pivot: `center.y = height/2`), `skinWidth = max(0.011, 0.1*radius)`, `stepOffset` (< height),
   `slopeLimit`, `minMoveDistance = 0`; `cc.enabled = false`. Pre-allocate any query buffers (`phys.nonalloc`).
2. **Enter** (jump key, walked off a ledge, climb start), in this order:
   `agent.isStopped = true;` → `agent.updatePosition = false; agent.updateRotation = false;` →
   if `Physics.CheckCapsule` at the current pose hits terrain/static, lift the pose → `cc.enabled = true;` →
   `Physics.SyncTransforms();` → seed velocity `v = agent.velocity` (+ jump: `v.y = Mathf.Sqrt(2f*g*h)`).
3. **Each Update in the mode** (one `Move` only): `v.y = Mathf.Max(v.y - g*dt, -terminal)`;
   `flags = cc.Move(v*dt)`; if `Above` and `v.y > 0` → `v.y = 0`; if `Sides` → `v = cc.velocity` (slid);
   record peak height / impact speed for fall damage; optionally `agent.nextPosition = transform.position`.
4. **Landing test**: `(flags & Below) != 0 && v.y <= 0` + the mod's own ground probe says "walkable" +
   `NavMesh.SamplePosition(transform.position, out hit, 2*agentHeight, NavMesh.AllAreas)` succeeds and
   `hit.position` is within a small distance of the feet.
5. **Hand back**: `cc.enabled = false;` → `agent.Warp(hit.position);` → `agent.updatePosition = true;
   agent.updateRotation = true;` (transform snaps to the warped simulated position, not the take-off point) →
   `agent.isStopped = false` or keep it stopped until the next player order; feed the landing to fall damage.
6. **Never** in the mode: `SimpleMove`; two `Move` calls per frame; writing `transform.position` without
   `Physics.SyncTransforms()`; flipping `Physics.autoSyncTransforms`. Game scripts that write the hero transform or call
   `agent.SetDestination` during the mode must be suppressed (Harmony) — otherwise the race condition above.

## Not fetched / gaps
TAG: cc.gaps
SOURCE: (this file)

- `AddComponent<CharacterController>()` defaults in 2020.3: no doc page states them; only an old Inspector screenshot
  (Height 1). Log them in game.
- The Unity issue-tracker page for the teleport bug returned 404 after the tracker migration; "By Design" is from a
  search summary only.
- Whether `CharacterController.Move` honours the Layer Collision Matrix / `Physics.IgnoreLayerCollision`: no official
  text found; forum answers (discussions.unity.com/t/86489) only suggest it. Verify in game.
- Whether a script write to `height`/`center`/`radius` recreates the controller (doc says "in the inspector"): unknown.
- Whether `OnControllerColliderHit` allocates per hit: not determined.
- Cost of one `Move` in this game: no official number; measure with `Stopwatch` against the 1 ms budget.
- "CharacterController.Move called on inactive controller" warning exists (forum thread titles, snippet only): call
  `Move` only after `enabled = true`.
- Starter Assets code was read from a third-party paste (paste.myst.rs), not from Unity's package.
- Issue "navmeshagent updates position even when updateposition is false" (issuetracker, Postponed) — snippet only.
