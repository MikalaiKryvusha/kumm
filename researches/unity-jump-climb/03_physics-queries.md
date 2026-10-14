# 03 — Physics queries and collide-and-slide

> The PhysX scene queries a mod uses to move a hero by hand (approach b: casts + collide-and-slide) or to classify what
> a CharacterController touched (approach a): Raycast / SphereCast / CapsuleCast, Overlap / Check, ComputePenetration,
> ClosestPoint, RaycastHit fields, the "starts inside" rule, triggers, back faces, layer masks, terrain vs
> `Terrain.SampleHeight`, convex vs concave MeshCollider, NonAlloc variants; then collide-and-slide from Fauerby's paper,
> the Kinematic Character Controller motor and Catlike Coding's ground snapping, and a derived one-frame loop.
> Fetched 2026-10-14 (Unity 2020.3 docs, UnityCsReference 2020.3, primary papers and code).

---

## Physics.Raycast
TAG: phys.raycast
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Physics.Raycast.html
SOURCE: https://raw.githubusercontent.com/Unity-Technologies/UnityCsReference/2020.3/Modules/Physics/ScriptBindings/Dynamics.bindings.cs (L1245-1338)

`Raycast(Vector3 origin, Vector3 direction, out RaycastHit hitInfo, float maxDistance = Mathf.Infinity,
int layerMask = DefaultRaycastLayers, QueryTriggerInteraction queryTriggerInteraction = QueryTriggerInteraction.UseGlobal)`
(also `Ray` overloads). Returns the closest hit only. "Casts a ray, from point `origin`, in direction `direction`, of
length `maxDistance`, against all colliders in the Scene." "**Notes: Raycasts will not detect Colliders for which the
Raycast origin is inside the Collider.**" The doc examples run in FixedUpdate and point to "Order of Execution".
Linecast(start, end, out hit, layerMask, qti) = the same with an end point.

## Physics.SphereCast
TAG: phys.spherecast
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Physics.SphereCast.html

`SphereCast(Vector3 origin, float radius, Vector3 direction, out RaycastHit hitInfo, float maxDistance = Mathf.Infinity,
int layerMask = DefaultRaycastLayers, QueryTriggerInteraction qti = UseGlobal)`. "Think of the sphere cast like a thick
raycast." "**Notes: SphereCast will not detect colliders for which the sphere overlaps the collider. Passing a zero
radius results in undefined output and doesn't always behave the same as Physics.Raycast.**" **(derived)** a cheap
ground probe: cast the capsule's bottom sphere straight down from slightly above the feet.

## Physics.CapsuleCast and building the capsule points
TAG: phys.capsulecast
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Physics.CapsuleCast.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Physics.CapsuleCastAll.html

`CapsuleCast(Vector3 point1, Vector3 point2, float radius, Vector3 direction, out RaycastHit hitInfo,
float maxDistance = Mathf.Infinity, int layerMask = DefaultRaycastLayers, QueryTriggerInteraction qti = UseGlobal)`.
`point1`/`point2`: "The center of the sphere at the `start`/`end` of the capsule." "Hits are returned for the first
collider which would collide against this capsule if the capsule was moved along `direction`." "**Notes: CapsuleCast will
not detect colliders for which the capsule overlaps the collider.**"
The doc example builds points from a CharacterController as `p1 = pos + center + up * -height * 0.5F; p2 = p1 + up *
height`. **(derived)** Those are the capsule's END points, not sphere centers, so that capsule is taller by `2*radius`.
Correct for a capsule of `height` h, `radius` r, local `center` c (upright):
```csharp
float half = Mathf.Max(0f, h * 0.5f - r);
Vector3 mid = pos + c;
Vector3 p1 = mid - Vector3.up * half;   // bottom sphere center
Vector3 p2 = mid + Vector3.up * half;   // top sphere center
```

## The "starts inside" rule and initial-overlap hits
TAG: phys.start-inside-rule
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Physics.Raycast.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Physics.CapsuleCastAll.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Physics.SphereCastAll.html

- Single-result casts skip what they start in: Raycast "will not detect Colliders for which the Raycast origin is inside
  the Collider"; SphereCast / CapsuleCast "will not detect colliders for which the sphere/capsule overlaps the collider".
- Multi-result casts report them with sentinel values: "For colliders that overlap the capsule at the start of the sweep,
  RaycastHit.normal is set opposite to the direction of the sweep, RaycastHit.distance is set to zero, and the zero vector
  gets returned in RaycastHit.point. You might want to check whether this is the case in your particular query and perform
  additional queries to refine the result." (same sentence on SphereCastAll).
- **(derived)** A slide loop must (1) start each sweep slightly behind the capsule (KCC backstep 0.002) so touching
  contacts are reported with distance > 0, (2) treat `distance <= 0` hits as "already overlapping" and resolve them with
  `ComputePenetration` (`phys.compute-penetration`), never as a wall normal.

## OverlapCapsule, CheckCapsule, CheckSphere
TAG: phys.overlap-check
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Physics.OverlapCapsule.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Physics.CheckCapsule.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Physics.CheckSphere.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Physics.OverlapCapsuleNonAlloc.html

- `OverlapCapsule(point0, point1, radius, int layerMask = **AllLayers**, qti)` → `Collider[]` "Colliders touching or inside
  the capsule." `OverlapCapsuleNonAlloc(point0, point1, radius, Collider[] results, layerMask = AllLayers, qti)` →
  count, "does not allocate anything on the managed heap."
- `CheckCapsule(start, end, radius, int layerMask = **DefaultRaycastLayers**, qti)` → bool, "Checks if any colliders
  overlap a capsule-shaped volume in world space." `CheckSphere(position, radius, layerMask = DefaultRaycastLayers, qti)`.
- **(derived)** Default masks differ: Overlap* includes the Ignore Raycast layer, Check*/casts exclude it. Always pass an
  explicit mask and `QueryTriggerInteraction.Ignore`. `CheckCapsule` is the cheap "is this pose free?" test for mantle
  targets and for the start pose before enabling a CharacterController (`cc.overlap-recovery`).

## Physics.ComputePenetration (depenetration)
TAG: phys.compute-penetration
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Physics.ComputePenetration.html

`bool ComputePenetration(Collider colliderA, Vector3 positionA, Quaternion rotationA, Collider colliderB, Vector3
positionB, Quaternion rotationB, out Vector3 direction, out float distance)`. "Translating the first collider by direction
* distance will separate the colliders apart if the function returned true." "One of the colliders has to be
BoxCollider, SphereCollider CapsuleCollider or a convex MeshCollider. The other one can be any type." "Passing position
or rotation that is different from the currently set one doesn't have an effect of physically moving any colliders".
"Doesn't depend on any spatial structures to be updated first". "Ignores backfaced triangles and doesn't respect
Physics.queriesHitBackfaces." Intended use: "first query for the colliders nearby using OverlapSphere and then adjust the
character's position using the data returned by ComputePenetration." **(derived)** Approach (b) therefore needs a real
`CapsuleCollider` component as `colliderA` (CharacterController is not in the list); filter it out of your own casts by
reference or by layer.

## Physics.ClosestPoint and Collider.ClosestPoint
TAG: phys.closest-point
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Physics.ClosestPoint.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Collider.ClosestPoint.html

- `Physics.ClosestPoint(Vector3 point, Collider collider, Vector3 position, Quaternion rotation)`: "in case the specified
  location is inside the collider, or exactly on the boundary of it, the input location is returned instead." "**The
  collider can only be BoxCollider, SphereCollider, CapsuleCollider or a convex MeshCollider.**"
- `Collider.ClosestPoint(Vector3 position)`: "Same as Physics.ClosestPoint but doesn't allow passing a custom position and
  rotation." "If `location` is in the collider the `closestPoint` will be inside." Differs from `ClosestPointOnBounds`
  ("the returned point is actually on the collider instead of on the bounds").
- **(derived)** Useless on level geometry made of concave MeshColliders or terrain; find ledge tops with casts instead.

## RaycastHit fields
TAG: phys.raycasthit
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/RaycastHit.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/RaycastHit-distance.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/RaycastHit-collider.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/RaycastHit-triangleIndex.html
SOURCE: https://raw.githubusercontent.com/Unity-Technologies/UnityCsReference/2020.3/Modules/Physics/ScriptBindings/Dynamics.bindings.cs (L55-111)

| Field | Text (quoted) / source |
|---|---|
| `point` | "The impact point in world space where the ray hit the collider." (zero vector for initial overlaps) |
| `normal` | "The normal of the surface the ray hit." |
| `distance` | "In the case of a swept volume or sphere cast, the distance represents the magnitude of the vector from the origin point to the translated point at which the volume contacts the other collider." |
| `collider` | "This property is null if the ray hit nothing". **(source)** `Object.FindObjectFromInstanceID(m_Collider) as Collider` — a lookup on every get. |
| `triangleIndex` | "Triangle index is only valid if the collider that was hit is a MeshCollider." **(source)** `(int)m_FaceID`. |
| `rigidbody`, `transform` | **(source)** derived from `collider` (`attachedRigidbody`; rigidbody's transform else collider's). |

**(derived)** `RaycastHit` is a struct; read `hit.collider` once into a local. For a sweep, the new capsule position is
`origin + dir * distance` (minus your skin), not `hit.point`.

## Sweep normal is the contact normal, not the face normal
TAG: phys.sweep-normal
SOURCE: https://www.peroxide.dk/papers/collision/collision.pdf (section 4.1)
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/ControllerColliderHit-normal.html

Fauerby, 4.1 "The sliding plane": the two sliding planes of his Figure 4.2 "are both the tangent plane to the sphere in
the point where it'll collide with the triangle", computed as `planeNormal = newPosition - intersectionPoint`. Unity on
the CCT: at "an edge or a corner rather than a flat surface, the reported normal may be different when colliding with
BoxColliders than when colliding with MeshColliders." **(derived)** At an edge (ledge lip, stair nose) a sphere/capsule
sweep returns a slanted normal. Use it for sliding; for "is this walkable / is this a wall / is this a ledge top" fire a
short `Raycast` at the hit point to read the face normal (the KCC does this, `phys.slide-kcc`).

## Triggers: QueryTriggerInteraction and Physics.queriesHitTriggers
TAG: phys.triggers
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/QueryTriggerInteraction.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Physics-queriesHitTriggers.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/Manual/class-PhysicsManager.html
SOURCE: https://raw.githubusercontent.com/Unity-Technologies/UnityCsReference/2020.3/Modules/Physics/Managed/Dynamics.cs (L341-346)

Enum **(source)** `UseGlobal = 0, Ignore = 1, Collide = 2`: "UseGlobal: Queries use the global Physics.queriesHitTriggers
setting." "Ignore: Queries never report Trigger hits." "Collide: Queries always report Trigger hits."
`queriesHitTriggers`: "Specifies whether queries (raycasts, spherecasts, overlap tests, etc.) hit Triggers by default."
Physics Manager: "Queries Hit Triggers ... By default, this setting is enabled." **(derived)** Every movement query of the
mod passes `QueryTriggerInteraction.Ignore` (quest zones, aggro spheres and water volumes are triggers); never change the
global flag.

## Back faces: Physics.queriesHitBackfaces
TAG: phys.backfaces
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Physics-queriesHitBackfaces.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/Manual/class-MeshCollider.html

"By default, all physics queries such as a raycast or a shape sweep (e.g. SphereCastAll) won't detect hits with back-face
triangles." Physics Manager: "Queries Hit Backfaces ... By default, this setting is disabled." Mesh Collider manual:
"Faces in collision meshes are one-sided. This means GameObjects can pass through them from one direction, but collide
with them from the other." **(derived)** A cast that starts behind a one-sided wall or under a floor passes through it:
start ground probes from inside the capsule (above the feet), never from below the floor.

## LayerMask: GetMask, NameToLayer, ~mask, built-in constants
TAG: phys.layermask
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/LayerMask.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/LayerMask.GetMask.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/LayerMask.NameToLayer.html
SOURCE: https://raw.githubusercontent.com/Unity-Technologies/UnityCsReference/2020.3/Modules/Physics/ScriptBindings/Dynamics.bindings.cs (L1169-1171)

- 32 layers; "The first 8 of these `Layers` are specified by Unity; the following 24 are controllable by the user."
- `GetMask(params string[] layerNames)` → int mask; example: layers 10 and 11 → "2^10 + 2^11 = 3072".
- `NameToLayer(string)` → layer index; "Returns -1 if not found." (`1 << -1` is garbage: check for -1).
- Raycast doc example: `int layerMask = 1 << 8;` then "The ~ operator does this, it inverts a bitmask." `~layerMask`.
- **(source)** `IgnoreRaycastLayer = 1 << 2; DefaultRaycastLayers = ~IgnoreRaycastLayer; AllLayers = ~0;`
- **(derived)** Build the mod's mask once from the game's real layer names (log `LayerToName(0..31)` at start), exclude
  the hero's own layer, characters/NPCs if they must not be climbed, and triggers by flag.

## IgnoreLayerCollision vs query masks
TAG: phys.ignore-layer-vs-mask
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Physics.IgnoreLayerCollision.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Physics.IgnoreCollision.html

`IgnoreLayerCollision(int layer1, int layer2, bool ignore = true)`: "Makes the collision detection system ignore all
collisions between any collider in `layer1` and any collider in `layer2`." "Note that IgnoreLayerCollision will reset the
trigger state of affected colliders, so you might receive OnTriggerExit and OnTriggerEnter messages". "You can set the
default values for your project for any layer combinations in the Physics inspector." `IgnoreCollision(c1, c2, ignore)`:
"is not persitent". **(derived)** These rule the simulation (contacts between bodies); the query pages filter only by
their `layerMask` argument and trigger flag, so for casts use masks. Calling `IgnoreLayerCollision` from a mod changes
the game's global matrix and fires trigger events — avoid.

## TerrainCollider vs Terrain.SampleHeight
TAG: phys.terrain
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/TerrainCollider.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/Manual/class-TerrainCollider.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Terrain.SampleHeight.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Terrain.GetPosition.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/TerrainData.GetInterpolatedNormal.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/TerrainData.GetSteepness.html

- TerrainCollider: "A heightmap based collider." Manual: "implements a collision surface with the same shape as the
  Terrain object"; option "Enable Tree Colliders".
- `Terrain.SampleHeight(Vector3 worldPosition)`: "Samples the height at the given position defined in world space,
  **relative to the Terrain space**." "This method automatically clamps the world position to the Terrain boundaries."
- `TerrainData.GetInterpolatedNormal(x, y)` / `GetSteepness(x, y)` ("Gets the gradient of the terrain"): "The `x` and
  `y` values are normalized coordinates in the range 0..1."
- **(derived)** World ground height = `terrain.SampleHeight(p) + terrain.GetPosition().y` (the doc example omits the
  offset). SampleHeight sees only the heightmap: no rocks, houses, trees, holes, and it clamps outside the tile, so it is
  a cheap hint (fall-height estimate), not a ground test. Casts hit the TerrainCollider like any collider; but
  CCT overlap recovery ignores heightfields (`cc.overlap-recovery`) and ClosestPoint does not accept terrain.

## MeshCollider: convex vs concave limits
TAG: phys.meshcollider
SOURCE: https://docs.unity3d.com/2020.3/Documentation/Manual/class-MeshCollider.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/MeshCollider-convex.html

- "Convex Mesh Colliders are limited to 255 triangles." "GameObjects that have a Rigidbody component only support Mesh
  Colliders that have Convex option enabled". Flat convex meshes get thickness "up to 0.05 of its longest dimension".
- Manual: "Cooking builds the spatial search structures for the physics queries, such as Physics.Raycast".
  **(derived)** concave MeshColliders are valid targets of casts/overlaps and valid `colliderB` of ComputePenetration
  ("The other one can be any type"), but not of `ClosestPoint` (convex only).
- One-sided faces + back faces ignored (`phys.backfaces`). `triangleIndex` is valid only on MeshColliders.
- **(derived)** "Inside" a concave mesh is undefined (it is a triangle soup): a capsule fully inside a closed concave
  building mesh overlaps no triangle and reports nothing. Never let the capsule tunnel: cap per-iteration travel.

## NonAlloc variants and why
TAG: phys.nonalloc
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Physics.RaycastNonAlloc.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Physics.SphereCastNonAlloc.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Physics.CapsuleCastNonAlloc.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Physics.RaycastAll.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/Manual/performance-garbage-collection-best-practices.html

- `RaycastNonAlloc`: "Like Physics.RaycastAll, but generates no garbage." "The order of the results is undefined. When a
  full buffer is returned it is not guaranteed that the results are the closest hits".
- `SphereCastNonAlloc`: "It will only compute as many hits as fit into the buffer, and store them in no particular order.
  It's not guaranteed that it will store only the closest hits. Generates no garbage."
- `CapsuleCastNonAlloc(point1, point2, radius, direction, RaycastHit[] results, maxDistance = Mathf.Infinity, layerMask =
  DefaultRaycastLayers, qti)`: "Like Physics.CapsuleCastAll, but generates no garbage."
- `RaycastAll` returns a new array each call ("Note that the order of the results is undefined").
- Manual, "Alternative non-allocating APIs": "Some Unity APIs have alternative versions that don't cause memory
  allocations. You should use these when possible." Table row: `Physics.RaycastAll` → `Physics.RaycastNonAlloc`.
- **(derived)** Single-hit `Raycast/SphereCast/CapsuleCast(out hit)` do not return arrays; the All variants allocate
  every call. Pre-allocate `RaycastHit[16]` / `Collider[16]` once (KCC: `MaxHitsBudget = 16`, `MaxCollisionBudget = 16`),
  loop over `count` to pick the closest valid hit, and treat `count == buffer.Length` as "maybe missed one" (log it).

## Collide-and-slide: Fauerby, "Improved Collision detection and Response" (2003)
TAG: phys.slide-fauerby
SOURCE: https://www.peroxide.dk/papers/collision/collision.pdf (chapter 4, appendix code pp. 44-47)

- Ch. 4: "what we want to do if we collide with a triangle in our world is to move close to it, change the direction of
  our velocity vector and then continue movement in a new direction."
- 4.2 steps: "Move our sphere as close as possible to the triangle"; "Calculate the sliding plane based on this new
  position"; "Project the original velocity vector to the sliding plane to get a new destination"; "Make a new velocity
  vector by subtracting the polygon intersection point from the new destination point"; "Recursively call the entire
  collision detection routine with the new position and the new velocity vector." Stop when "We do not hit anything" or
  "The velocity vector gets very small." Projection: `newDestinationPoint = destination - distance*planeNormal`.
- 4.3 Gravity: "each frame you just make two calls to the collision detection routines - one time with the player
  velocity and another time with a gravity vector." Combining them "will make climbing stairs become more difficult".
- 4.4: "the code included might slide a bit too much - even the smallest slope and the gravity vector might cause the
  player to slide. You should implement code to detect when the player is on an almost flat surface and only let gravity
  slide when the slope is really steep."
- Appendix code: `if (collisionRecursionDepth>5) return pos;` `veryCloseDistance = 0.005f * unitScale` (in his
  ellipsoid-space units, `unitScale = unitsPerMeter / 100.0f`); move only to `nearestDistance - veryCloseDistance`;
  shift `intersectionPoint -= veryCloseDistance * V` "so sliding plane will be unaffected"; recurse unless
  `newVelocityVector.length() < veryCloseDistance`.

## Collide-and-slide: Kinematic Character Controller motor (Philippe St-Amand)
TAG: phys.slide-kcc
SOURCE: https://raw.githubusercontent.com/BLaZeKiLL/VloxyEngine/ccdacaeadc045b9fb7361b7c8900500a53bfe369/Assets/Plugins/KinematicCharacterController/Core/KinematicCharacterMotor.cs
SOURCE: https://discussions.unity.com/t/released-kinematic-character-controller/678434

Read in a GitHub copy (MIT-licensed host repo) of the free Asset Store package; line numbers refer to that file.
- Constants (L512-529): `MaxHitsBudget = 16`, `MaxCollisionBudget = 16`, `MaxGroundingSweepIterations = 2`,
  `MaxSteppingSweepIterations = 3`, `CollisionOffset = 0.01f`, `GroundProbeReboundDistance = 0.02f`,
  `MinimumGroundProbingDistance = 0.005f`, `SweepProbingBackstepDistance = 0.002f`, `SecondaryProbesVertical = 0.02f`,
  `SecondaryProbesHorizontal = 0.001f`, `MinVelocityMagnitude = 0.01f`, `MinDistanceForLedge = 0.05f`.
  Fields: `MaxMovementIterations = 5`, `MaxDecollisionIterations = 1`, `CheckMovementInitialOverlaps = true`,
  `MaxStableSlopeAngle = 60f`, `MaxStepHeight = 0.5f`, `MinRequiredStepDepth = 0.1f`.
- Phase 1 (L768-930): decollide first — `CharacterCollisionsOverlap` (`OverlapCapsuleNonAlloc`, triggers ignored, own
  capsule filtered) then `Physics.ComputePenetration` per overlap, move by `direction * (distance + CollisionOffset)`.
  Then ground probe: distance `Max(CapsuleRadius, MaxStepHeight)` (step handling on; `CapsuleRadius` if off) when it was
  stable last tick or the last move found ground, else `MinimumGroundProbingDistance` 0.005.
- `ProbeGround` (L1263-1335): capsule sweep down; stable hit → snap to `hit.distance - CollisionOffset`; unstable hit →
  re-aim along the slope (`ProjectOnPlane(dir, normal)`) for up to 2 more sweeps.
- `InternalCharacterMove` (L1366-1611): `while (remaining > 0 && sweepsMade <= MaxMovementIterations && hitSomething)`:
  optional overlap check → `ComputePenetration` normal as a zero-distance hit; else `CharacterCollisionsSweep`
  (`CapsuleCastNonAlloc` started `SweepProbingBackstepDistance` behind, `distance + CollisionOffset`, drops hits with
  `distance <= 0`); move `max(0, hit.distance - CollisionOffset)`; evaluate stability; try a step; else project velocity
  and rescale `remainingMovementMagnitude *= newSpeed / oldSpeed`. Over the iteration cap: kill remaining movement and
  velocity. Leftover movement after the loop is applied unchecked.
- Projection (L1665-1823): 1st blocking hit → `ProjectOnPlane(velocity, obstructionNormal)` (airborne case);
  2nd → `EvaluateCrease`: if both planes block, velocity becomes `Project(velocity, Cross(n1, n2))` (airborne) or zero
  (grounded corner); 3rd → zero. Grounded stable hits keep speed: `GetDirectionTangentToSurface(v, n) * v.magnitude` with
  `Cross(n, Cross(v, up)).normalized` (no sideways drift on slopes).
- Stability (L1207, L2021-2111): `Vector3.Angle(up, normal) <= MaxStableSlopeAngle`; ledge test raycasts down 0.02 above
  the hit point, 0.001 to the inner and outer side; different stability = ledge (gives `LedgeFacingDirection`,
  `DistanceFromLedge`) — the same probe finds a mantle/climb edge.

## Ground snapping: Catlike Coding, "Surface Contact"
TAG: phys.ground-snap-catlike
SOURCE: https://catlikecoding.com/unity/tutorials/movement/surface-contact/

Made with Unity 2019.2.14f1 (Rigidbody sphere, but the snapping logic is controller-agnostic). `SnapToGround` runs only
when contact was just lost: "we should only try to snap once directly after we lost contact" (`stepsSinceLastGrounded >
1` → abort); not right after a jump (`stepsSinceLastJump <= 2` → abort); not above `maxSnapSpeed`; ray down with
`probeDistance` (default 1) and `probeMask`; reject if `hit.normal.y < minGroundDotProduct`; then keep speed and turn
the velocity along the ground only "when the dot product of it and the surface normal is positive":
`velocity = (velocity - hit.normal * dot).normalized * speed`. Warning: "a tiny deep crack could cause this to fail if the
ray happened to be cast into it." Steep contacts (walls) are counted separately; several steep normals summed can form
"virtual ground" in a crevasse.

## Minimal collide-and-slide loop for one frame
TAG: phys.slide-minimal
SOURCE: derived from phys.slide-fauerby, phys.slide-kcc, phys.ground-snap-catlike, phys.start-inside-rule, phys.nonalloc

**(derived)** Upright capsule, feet pivot; `self` = the mod's own CapsuleCollider (needed by ComputePenetration);
`mask` excludes the hero layer; all buffers pre-allocated; no LINQ, no lambdas, no allocations.
```csharp
const int MaxIter = 4; const float Skin = 0.01f, Back = 0.002f;   // KCC: 5 iterations, 0.01, 0.002
Vector3 Step(Vector3 pos, ref Vector3 vel, float dt, bool wasGrounded, out bool grounded, out Vector3 gN)
{
    grounded = false; gN = Vector3.up;
    pos = Depenetrate(pos);                    // OverlapCapsuleNonAlloc + ComputePenetration, 1-2 passes
    Vector3 delta = vel * dt, n0 = Vector3.zero;
    for (int i = 0; i < MaxIter && delta.sqrMagnitude > 1e-8f; i++) {
        float dist = delta.magnitude; Vector3 dir = delta / dist;
        Caps(pos - dir * Back, out var p1, out var p2);
        int n = Physics.CapsuleCastNonAlloc(p1, p2, r, dir, hits, dist + Skin + Back, mask, QueryTriggerInteraction.Ignore);
        int best = -1; float bestD = float.MaxValue;
        for (int k = 0; k < n; k++) { float d = hits[k].distance - Back;
            if (d > 0f && d < bestD && hits[k].collider != self) { bestD = d; best = k; } }
        if (best < 0) { pos += delta; break; }                   // free: take the rest
        Vector3 nrm = hits[best].normal;
        float go = Mathf.Max(0f, bestD - Skin); pos += dir * go;  // stop a skin short
        bool walk = Vector3.Angle(nrm, Vector3.up) <= maxWalk;
        if (walk) { grounded = true; gN = nrm; }
        Vector3 rest = dir * (dist - go);
        if (walk) {                       // KCC stable landing: drop vertical, follow slope, no slide-down (Fauerby 4.4)
            Vector3 h = Vector3.ProjectOnPlane(rest, Vector3.up);
            rest = Vector3.Cross(nrm, Vector3.Cross(h, Vector3.up)).normalized * h.magnitude;
            vel = Vector3.ProjectOnPlane(vel, Vector3.up);
        } else if (i > 0 && Vector3.Dot(Vector3.ProjectOnPlane(rest, nrm), n0) < 0f) {   // crease: 2 blocking planes
            Vector3 c = Vector3.Cross(n0, nrm).normalized;
            rest = Vector3.Project(rest, c); vel = Vector3.Project(vel, c);
        } else { rest = Vector3.ProjectOnPlane(rest, nrm); vel = Vector3.ProjectOnPlane(vel, nrm); }
        n0 = nrm; delta = rest;
    }
    if (!grounded && wasGrounded && vel.y <= 0f) {               // snap down (stairs, slope crest)
        Caps(pos + Vector3.up * Back, out var b1, out var b2);
        if (Physics.CapsuleCast(b1, b2, r, Vector3.down, out var g, Mathf.Max(r, stepH) + Back, mask,
                                QueryTriggerInteraction.Ignore) && Vector3.Angle(g.normal, Vector3.up) <= maxWalk) {
            pos += Vector3.down * Mathf.Max(0f, g.distance - Back - Skin); grounded = true; gN = g.normal;
        }
    }
    if (grounded && vel.y < 0f) vel.y = 0f;                       // landed: keep horizontal speed
    return pos;
}
```
Rules carried from the sources: gravity is integrated into `vel` before `Step` (Fauerby allows two passes; one pass
keeps cost bounded); `vel` is projected together with `rest` so the next frame does not push into the wall again; over
the iteration cap the rest is dropped (KCC); hits with distance <= 0 go to depenetration, not to sliding; classify
walls/ledges with a face-normal raycast (`phys.sweep-normal`); the snap probe is skipped while rising (`vel.y > 0`),
as Catlike skips it right after a jump. Cost per frame: 1 overlap + <= 4 capsule casts + 1 snap cast + optional
raycasts; measure with `Stopwatch` against the 1 ms budget for all mods.

## Not fetched / gaps
TAG: phys.gaps
SOURCE: (this file)

- The KCC was read from a third-party GitHub copy (VloxyEngine, commit ccdacae) of the free Asset Store package; the
  author's original package and its exact version were not opened. Philippe St-Amand's own GitHub has no KCC repository.
- Catlike Coding "Physics" (contact-plane projection) and the Fauerby 2000 tutorial [Fau00] were not read; only "Surface
  Contact" and the 2003 paper.
- No official Unity page says in words that `Physics.IgnoreLayerCollision` does not filter scene queries (derived from
  the query signatures).
- Whether `ComputePenetration` accepts a disabled `CapsuleCollider` as `colliderA`, and whether a CharacterController is
  accepted there, is not documented; test in game.
- No Unity 2020.3 page gives a cost per query; the 1 ms budget must be measured in game.
- 404 in 2020.3 manual: `collider-types-introduction.html`, `physics-optimization.html` (newer-manual pages).
