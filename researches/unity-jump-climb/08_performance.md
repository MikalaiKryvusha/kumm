# 08 — Performance: main-thread cost of jump, fall and climb queries

> Sources: Unity 2020.3 Scripting API and Manual (fetched as text on 2026-10-14), the current Unity 6 manual pages on
> physics optimization (no 2020.3 equivalent exists beyond an iOS-titled page), the C# reference source
> `UnityCsReference` branch 2020.3, Unity's Mono fork (`Unity-Technologies/mono`, branch `unity-2020.3-mbe`), Microsoft
> Learn (Stopwatch, QueryPerformanceCounter, ConditionalAttribute), the unity.com article "Enhanced physics performance
> for smooth gameplay" (read through WebFetch's summarizer: quotes are as returned) and forum threads. Extra label:
> **(project)** = read in our game's files (read-only) or stated in the task brief.

---

## What "1 ms for all mods" means
TAG: perf.budget.frame
SOURCE: https://docs.unity3d.com/2020.3/Documentation/Manual/performance-incremental-garbage-collection.html

**(project)** Budget: all mods together under 1 ms of main-thread time per frame, peaks included. Manual (GC page): a
spike "pushes the frame in which garbage collection happens over the 16 millisecond limit required to maintain 60fps."
**(derived)** At 60 fps 1 ms is 6% of the frame; at 144 fps (6.9 ms) it is 14%. The budget is a worst-frame number, so
every per-frame cost below is judged by its maximum, not its average.

## What makes a physics query expensive
TAG: perf.physics.cost-drivers
SOURCE: https://docs.unity3d.com/2020.3/Documentation/Manual/iphone-Optimizing-Physics.html
SOURCE: https://docs.unity3d.com/Manual/physics-optimization-cpu-collider-types.html
SOURCE: https://discussions.unity.com/t/how-expensive-is-ray-casting/8591

2020.3 (iOS page, the only 2020.3 physics-optimization page): "Mesh colliders have a much higher performance overhead
than primitive colliders, so use them sparingly." "The total amount of physics calculation depends on the number of
non-sleeping rigid bodies and colliders in the scene and the complexity of the colliders." Unity 6 table, most to least
performant: Sphere "The simplest and most efficient collider", Capsule "Slightly more complex than a Sphere Collider, but
still efficient", Box, Convex Mesh, Non-convex Mesh "The most resource-intensive collider type". **(secondary)**
(2010 answer) "Simple object's have much simpler intersection algorithms." "Raycasts that are far enough away from an
object being checked should not check against the object"; layer masks named as the answer to the cost question.
**(derived)** The levers we control per cast: a short `maxDistance`, a `layerMask` that keeps only ground/climbable
layers, and the cast shape (ray < sphere < capsule). The world's colliders (terrain, mesh colliders) are fixed by the
game.

## Non-allocating queries and garbage
TAG: perf.physics.nonalloc-gc
SOURCE: https://docs.unity3d.com/2020.3/Documentation/Manual/BestPracticeUnderstandingPerformanceInUnity7.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Physics.RaycastNonAlloc.html
SOURCE: https://docs.unity3d.com/Manual/physics-optimization-raycasts-queries.html
SOURCE: https://unity.com/how-to/enhanced-physics-performance-smooth-gameplay
SOURCE: https://raw.githubusercontent.com/Unity-Technologies/UnityCsReference/2020.3/Modules/Physics/ScriptBindings/Dynamics.bindings.cs

2020.3: "In Unity 5.3 and onwards, non-allocating versions of all Physics query APIs have been introduced. Replace
RaycastAll calls with RaycastNonAlloc, SphereCastAll calls with SphereCastNonAlloc." RaycastNonAlloc: "Like
Physics.RaycastAll, but generates no garbage." OverlapCapsuleNonAlloc: "does not allocate anything on the managed heap."
unity.com: "The NonAlloc method works without generating garbage." "The buffer does not grow if it runs out of space."
**(source)** `public struct RaycastHit`; `RaycastAll(...)` returns `RaycastHit[]` from native `Internal_RaycastAll`;
single-hit `Raycast(..., out RaycastHit hitInfo, ...)` returns `bool`. **(derived)** Single-hit `Raycast`,
`SphereCast`, `CapsuleCast` with `out RaycastHit` fill a struct and allocate no array; only the `*All` and
`Overlap*` (non-NonAlloc) forms allocate. The Unity 6 page's sentence "Standard physics queries, such as
Physics.Raycast ... allocate memory on the heap for their results" does not match the 2020.3 signatures; trust the
source. Keep one `static readonly RaycastHit[]` / `Collider[]` buffer per query kind, sized once.

## NonAlloc buffer semantics
TAG: perf.physics.nonalloc-buffer
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Physics.RaycastNonAlloc.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Physics.SphereCastNonAlloc.html
SOURCE: https://docs.unity3d.com/Manual/physics-optimization-raycasts-queries.html

RaycastNonAlloc: "The order of the results is undefined. When a full buffer is returned it is not guaranteed that the
results are the closest hits and the length of the buffer is returned. If a null buffer is passed in, no results are
returned and no errors or exceptions are thrown." SphereCastNonAlloc: "It will only compute as many hits as fit into the
buffer, and store them in no particular order. It's not guaranteed that it will store only the closest hits." Unity 6:
"make it large enough to capture the maximum expected hits in typical scenarios". **(derived)** Need only the nearest
hit? Use the single-hit form: it returns the first hit along the sweep and needs no sorting loop.

## RaycastHit accessors are not free
TAG: perf.physics.hit-accessors
SOURCE: https://raw.githubusercontent.com/Unity-Technologies/UnityCsReference/2020.3/Modules/Physics/ScriptBindings/Dynamics.bindings.cs

**(source)** Fields stored in the struct: `m_Point`, `m_Normal`, `m_FaceID`, `m_Distance`, `m_UV`, `m_Collider` (an
`int`). `public Collider collider { get { return Object.FindObjectFromInstanceID(m_Collider) as Collider; } }`;
`transform` calls `rigidbody` (which calls `collider` and `attachedRigidbody`) and then `collider.transform`;
`textureCoord` calls native `CalculateRaycastTexCoord(collider, ...)`. **(derived)** In the per-frame path read only
`point`, `normal`, `distance`. Touch `collider` once, when a decision needs the object (climbable tag, layer), and cache
the answer by instance id.

## Casts that start inside a collider
TAG: perf.physics.start-inside
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Physics.Raycast.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Physics.SphereCast.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Physics.CapsuleCast.html

"Raycasts will not detect Colliders for which the Raycast origin is inside the Collider." "SphereCast will not detect
colliders for which the sphere overlaps the collider. Passing a zero radius results in undefined output and doesn't
always behave the same as Physics.Raycast." CapsuleCast: same note; "Hits are returned for the first collider which
would collide against this capsule if the capsule was moved along `direction`." **(derived)** A sweep started inside the
hero's own collider will not report it, but the hero's layer still costs broad-phase work: exclude it in `layerMask`.
A sweep that starts already touching the ground misses that ground: start the down-sweep a little above the feet.

## Physics.autoSyncTransforms and SyncTransforms
TAG: perf.physics.autosync
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Physics-autoSyncTransforms.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Physics.SyncTransforms.html
SOURCE: https://docs.unity3d.com/Manual/physics-optimization-cpu-transform-sync.html
SOURCE: https://unity.com/how-to/enhanced-physics-performance-smooth-gameplay

2020.3: "When set to false, synchronization only occurs prior to the physics simulation step during the Fixed Update."
"Note: When autoSyncTransforms is set to true, repeatedly changing a Transform and then performing a physics query can
cause performance loss." "For projects made in Unity 2017.2 onwards, turn this option off." SyncTransforms: "Apply
Transform changes to the physics engine." Unity 6: "If you enable it, you add implicit synchronization points before
every physics query". unity.com: "Each physics-related API call forces a sync, which can degrade performance".
**(derived)** Read `Physics.autoSyncTransforms` once and log it; never change it (it is global to the game). Our casts
take explicit origins computed from the hero's position, so they do not need the hero's own collider synced; call
`Physics.SyncTransforms()` only if a query must see a collider we moved this frame (it flushes every dirty transform).

## Batched casts: RaycastCommand, SpherecastCommand, CapsulecastCommand, BoxcastCommand
TAG: perf.physics.batch-commands
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/RaycastCommand.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/RaycastCommand.ScheduleBatch.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/SpherecastCommand.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/CapsulecastCommand.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/BoxcastCommand.html
SOURCE: https://raw.githubusercontent.com/Unity-Technologies/UnityCsReference/2020.3/Modules/Physics/ScriptBindings/QueryCommand.bindings.cs

"When you use this struct to schedule a batch of raycasts, they will be performed asynchronously and in parallel to each
other." "the results buffer cannot be accessed until the job has been completed." "The result for a command at index N
in the command buffer will be stored at index N * maxHits in the results buffer." "The first invalid result is
identified by the collider being null." Sphere/Capsule/Box: "The result for a command at index N in the command buffer
is stored at index N in the results buffer." ScheduleBatch: `minCommandsPerJob` "The minimum number of jobs which should
be performed in a single job." Doc samples use `Allocator.Temp` and `handle.Complete()` right after scheduling.
**(source)** RaycastCommand ctor `(from, direction, distance = float.MaxValue, layerMask = Physics.DefaultRaycastLayers,
maxHits = 1)`; Sphere/Capsule/Box set `internal int maxHits` to 1 (one hit per command in 2020.3); scheduling uses
`ScheduleMode.Parallel`. **(project)** The game's `UnityEngine.PhysicsModule.dll` contains all four command types and
`UnityEngine.CoreModule.dll` contains `NativeArray`1`; no Burst assembly is shipped.

## Job scheduling rules that bite a mod
TAG: perf.jobs.schedule-complete
SOURCE: https://docs.unity3d.com/2020.3/Documentation/Manual/JobSystemOverview.html
SOURCE: https://docs.unity3d.com/2019.4/Documentation/Manual/JobSystemTroubleshooting.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/Manual/JobSystemJobDependencies.html

Overview: "Unity uses its own native job system to process its own native code over multiple worker threads".
Troubleshooting (2019.4 page; no 2020.3 copy): "You can only call Schedule and Complete from the main thread." "Not
flushing the batch delays the scheduling until the main thread waits for the result." "calling this method
[ScheduleBatchedJobs] can negatively impact performance." "It is not enough to check JobHandle.IsCompleted. You must call
the method JobHandle.Complete to regain ownership". "if ... a one frame latency is acceptable, you can schedule the job
towards the end of a frame and use its results in the following frame." "the marker 'WaitForJobGroup' on the main thread
indicates that Unity is waiting for a job on a worker thread to complete." **(derived)** Schedule-then-Complete in the
same call moves no time off the main thread: it waits for the workers. Batching pays when there are many casts (the
Unity 6 page: "many independent raycasts") or when one-frame-late results are fine (a ledge scan ahead of the hero). A
jump needs 1–3 casts with answers this frame: plain `Physics.*` calls. Keep the NativeArrays alive across frames
(allocate at start, Dispose on unload) so the batch path does not allocate per frame.

## NavMesh query costs
TAG: perf.navmesh.queries
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AI.NavMesh.SamplePosition.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AI.NavMesh.CalculatePath.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AI.NavMesh-pathfindingIterationsPerFrame.html

SamplePosition: "This function may reduce the frame rate if a large search radius is specified. To avoid frame rate
issues, it is recommended that you specify a maxDistance of twice the agent height." "If you are trying to find a random
point on the NavMesh, you should use the recommended radius and perform the find multiple times instead of using a very
large radius." CalculatePath: "This function is synchronous. It performs path finding immediately which can adversely
affect the frame rate when processing very long paths." pathfindingIterationsPerFrame: "The iteration count only affects
asynchronous pathfinding. This method of pathfinding is used when the NavMesh Agent destination is set with
NavMeshAgent.SetDestination or NavMeshAgent.destination." "The default value is 100. An ideal value is between 50 and
500." **(derived)** Landing costs one SamplePosition at `2 * agent.height`; the SetDestination that restores
click-to-move is spread over the engine's own pathfinding frames, not billed to our call. Avoid CalculatePath per frame.

## Agent count, avoidance and carving
TAG: perf.navmesh.agents
SOURCE: https://docs.unity3d.com/2020.3/Documentation/Manual/class-NavMeshAgent.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AI.NavMeshAgent-obstacleAvoidanceType.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/Manual/nav-InnerWorkings.html

Manual: "If you have high number of agents you can save CPU time by reducing the obstacle avoidance quality."
obstacleAvoidanceType: "This property lets you trade off the precision of obstacle avoidance againt the processor load
required to achieve it." Inner workings: "Finding a path across the world is a costly operation requiring quite a lot of
processing power and memory." Carving: "This is computationally expensive operation, which is yet another compelling
reason, why moving obstacles should be handled using collision avoidance." **(derived)** The mod adds no agents and no
carving NavMeshObstacle; the hero's agent stays one crowd member whether it is on or off the mesh.

## Incremental GC and per-frame allocations
TAG: perf.gc.incremental
SOURCE: https://docs.unity3d.com/2020.3/Documentation/Manual/performance-incremental-garbage-collection.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Scripting.GarbageCollector-incrementalTimeSliceNanoseconds.html

"Incremental mode doesn't make garbage collection faster overall, but because it distributes the workload over multiple
frames, GC-related performance spikes are reduced." Time slice: "The default value of 3 ms (3000000 nanoseconds) is a good
starting point". "The garbage collector might still choose to perform a regular, non-incremental collection cycle if your
application runs low on memory or if the incremental steps cannot keep up". **(project)** The game's `boot.config` has
`gc-max-time-slice=3`. **(derived)** Every byte our per-frame code allocates feeds a collector that may take up to 3 ms of
a frame, three times the whole mod budget. Target: zero allocations per frame in OnMesh, Air and Climb (no LINQ, no
closures, no string building except on log lines that are rate-limited).

## Timing our own code: Stopwatch in Unity's Mono
TAG: perf.timing.stopwatch
SOURCE: https://raw.githubusercontent.com/Unity-Technologies/mono/unity-2020.3-mbe/mcs/class/System/System.Diagnostics/Stopwatch.cs
SOURCE: https://raw.githubusercontent.com/Unity-Technologies/mono/unity-2020.3-mbe/mono/utils/mono-time.c
SOURCE: https://raw.githubusercontent.com/Unity-Technologies/mono/unity-2020.3-mbe/mono/metadata/icall-def.h
SOURCE: https://learn.microsoft.com/en-us/dotnet/api/system.diagnostics.stopwatch.frequency
SOURCE: https://learn.microsoft.com/en-us/dotnet/api/system.diagnostics.stopwatch.ishighresolution
SOURCE: https://learn.microsoft.com/en-us/windows/win32/sysinfo/acquiring-high-resolution-time-stamps

**(source)** Unity's Mono: `public static readonly long Frequency = 10000000;` and `public static readonly bool
IsHighResolution = true;` (constants, not probed); `GetTimestamp` is an internal call mapped in `icall-def.h` to
`mono_100ns_ticks`, which on Windows reads `QueryPerformanceCounter` and scales by `MTICKS_PER_SEC / freq` (100 ns
units). Microsoft: "a timer frequency of 2 million ticks per second equals a timer resolution of 500 nanoseconds per tick."
QPC: "When you need time stamps with a resolution of 1 microsecond or better ... choose QueryPerformanceCounter". Call
cost: with the TSC "This time ranges from 10s of CPU cycles to several hundred CPU cycles"; with a platform timer
"frequently in the vicinity of 0.8 - 1.0 microseconds". "(or always in some newer versions of Windows), the
performance counter frequency is fixed to 10 MHz." Managed sample: `long StartingTime = Stopwatch.GetTimestamp();` ...
`ElapsedTime * (1.0 / Stopwatch.Frequency)`. **(derived)** In this game one Stopwatch tick = 100 ns, so 1 ms = 10,000
ticks; read `Stopwatch.GetTimestamp()` at entry and exit of the mod's Update, add to a per-frame sum, keep the max over
the last 300 frames, log one line every few seconds (max, mean, frames over 1 ms). Two timestamps per frame cost at most
about 2 µs even on a platform timer.

## Profiler markers from a mod in a release player
TAG: perf.profiler.markers
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Profiling.Profiler.BeginSample.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Unity.Profiling.ProfilerMarker.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Unity.Profiling.ProfilerRecorder.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Profiling.Recorder.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/Manual/profiler-markers.html
SOURCE: https://raw.githubusercontent.com/Unity-Technologies/UnityCsReference/2020.3/Runtime/Profiler/ScriptBindings/Profiler.bindings.cs
SOURCE: https://raw.githubusercontent.com/Unity-Technologies/UnityCsReference/2020.3/Runtime/Profiler/ScriptBindings/ProfilerMarker.bindings.cs
SOURCE: https://learn.microsoft.com/en-us/dotnet/api/system.diagnostics.conditionalattribute

BeginSample: "Profiler.BeginSample is conditionally compiled away using ConditionalAttribute. Thus it will have zero
overhead, when it is deployed in non-Development Build." ProfilerMarker: "Methods Begin and End are marked with
ConditionalAttribute. They are conditionally compiled away and thus have zero overhead in non-Developmenet (Release)
builds." **(source)** both carry `[Conditional("ENABLE_PROFILER")]`. Microsoft: the attribute tells compilers "that a
call to the method should not be compiled into Microsoft intermediate language (MSIL) unless the conditional
compilation symbol ... is defined." Recorder: "At the moment Samplers are available only in the Editor and Development
Players." ProfilerRecorder: "You can use this API in Editor and Player builds, including Release Players." Its sample
reads `ProfilerRecorder.StartNew(ProfilerCategory.Internal, "Main Thread", 15)`. Manual markers: `PlayerLoop`,
`Update.ScriptRunBehaviourUpdate` ("Contains all samples of MonoBehaviour.Update and Coroutines"). **(derived)** A mod
compiled without `ENABLE_PROFILER` has no marker calls at all; compiled with it, the calls reach a release player that
collects nothing. Our own numbers come from Stopwatch. ProfilerRecorder may expose engine markers in the release game:
check `recorder.Valid` before trusting it. **(project)** `UnityEngine.CoreModule.dll` contains `ProfilerRecorder`.

## Budget table: per-frame targets for the jump/climb mod
TAG: perf.budget.table
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AI.NavMesh.SamplePosition.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Physics.CapsuleCast.html

**(derived)** Targets, not measurements: no fetched source gives a PhysX per-cast time. Replace each estimate with the
Stopwatch max from the game (300-frame window) before trusting the table. Share: the jump/climb mod gets at most
0.5 ms of the 1 ms in its worst frame; the other half stays for the remaining mods.

| State | Queries per frame | Allocations | Target mean | Hard cap (max) |
|---|---|---|---|---|
| OnMesh | 0 casts; read `agent.velocity`/`hasPath`; input check | 0 B | ≤ 0.02 ms | 0.05 ms |
| Air | 1 capsule (or sphere) sweep along velocity·dt + 1–2 rays (ground, head) | 0 B | ≤ 0.10 ms | 0.25 ms |
| Climb | 1 grip cast toward the wall + 2–3 ledge rays (top, sides), short distance | 0 B | ≤ 0.15 ms | 0.30 ms |
| Landing (1 frame) | 1 SamplePosition (`2 * agent.height`) + Warp + SetDestination | 0 B | ≤ 0.20 ms | 0.40 ms |
| Take-off (1 frame) | state switch on the agent; 1 sweep for headroom | 0 B | ≤ 0.10 ms | 0.20 ms |

Rules behind the numbers: one state per frame (never Air and Landing casts in the same frame plus a retry); SamplePosition
at most once per frame, retried next frame on false; every cast has a finite `maxDistance` and an explicit `layerMask`
without the hero's layer; no `*All` queries; `hit.collider` only on decision frames; log lines rate-limited. If the
Stopwatch max of a state passes its cap, cut casts before anything else (ledge rays every 2nd frame, then fewer rays).

## Not fetched / gaps
TAG: perf.gaps
SOURCE: https://docs.unity3d.com/2020.3/Documentation/Manual/iphone-Optimizing-Physics.html

- No 2020.3 manual page "Physics optimization" exists under that name (404 for physics-optimization and variants); the
  2020.3 iOS page and the Unity 6 pages were used. Unity 6 statements may not hold for 2020.3's PhysX 4 integration.
- No official or reliable PhysX per-raycast or per-sweep time was found. The thread
  https://discussions.unity.com/t/slow-raycasts/825857 (0.012 ms sphere cast, 0.14 ms raycast) measures DOTS Unity
  Physics `collisionWorld.CastRay` in Burst jobs, not PhysX: not used.
- No source gives the break-even batch size for RaycastCommand versus plain calls; measure if batching is considered.
- RaycastCommand in 2020.3 takes no QueryTriggerInteraction; whether it follows `Physics.queriesHitTriggers` was not
  checked.
- The job-system troubleshooting page exists for 2019.4 only (2020.3 URL returns 404).
- Whether ProfilerRecorder's "Main Thread" marker is valid in this release game was not tested.
- The `gc-max-time-slice=3` key is read from `boot.config`; its mapping to `incrementalTimeSliceNanoseconds` is inferred
  from the matching 3 ms default, not from a page.
- The unity.com physics article was read only through a summarizer; its full paragraphs were not available verbatim.
