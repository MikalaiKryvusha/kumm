# Engine.ini for Conan Exiles Enhanced 3.0.1 (UE 5.8): keep the picture, win CPU frame time

> **Created:** 2026-10-30 · **Parent:** the owner's request (2026-10-30, verbatim) «еще разведку в сети, как можно Engine.ini
> оптимизировать, на крутую графику, но чтобы выиграть FPS по процессору» · **Status:** recon done, not applied ·
> **Outbound:** candidates for an A-B bench run (`ConanExiles/_config/bench-batches/`, route `krinik-show`)

Scope: web recon (Epic docs, Epic release notes via Tom Looman's annotated digests, Epic issue tracker, community) plus the build's own
evidence (cvar registry, help texts read from the 3.0.1 exe, the 2026-10-30 11:46 game log). Nothing was run in the game, nothing was
written to the game or the pack. Every number has a source, or is labelled *hypothesis*.

## 0. Bottom line

1. **The GPU is not idle in the case that matters.** In the bench flight, CPU busy is 15.0 ms and GPU busy is 13.6 ms (`docs/18`,
   2026-10-26 01:05–01:12). Standing in the desert the GPU is the limit (96 %, 10.96 of 11.09 ms;
   `researches/conan-performance-mods-2026-10/README.md`). So "move work to the GPU" has about **1.4 ms** of room in flight. Every
   GPU-shift candidate must be judged on GPU busy as well as CPU busy. Some GPU-side savings below are there only to win back that room.
2. **The measured CPU costs are content, not cvars.** NPC spawning costs about half of the flight hitches and ≈1.2 ms of CPU per frame
   (one flight, needs A-B-A-B). Deferred PostLoad costs 6–8 ms in the frames it lands in. Our Lua mods cost ≈0.4 ms
   (`researches/conan-main-thread/README.md` §0, §4). The queued batches q2 (`s.AsyncPostLoadEnabled`), q3
   (`p.Chaos.EnableAsyncInitBody`) and q4 (no mod paks) target exactly these costs and **have not been run yet**. They come first.
3. **New for 5.6–5.8 and absent from our earlier notes:** Funcom **disables** UE 5.7's raw-input worker thread
   (`WindowsApplication.UseWorkerThreadForRawInput:0` in the game's `[ConsoleVariables]`, log 2026-10-30). The Cine shadow group sets
   `r.Shadow.RadiusThreshold 0`, which turns off CPU culling of small shadow casters. 5.6–5.8 added `tick.IdleTaskWorkMS`,
   `s.UseUnifiedTimeBudgetForStreaming` and `r.SceneCulling.HierarchicalCPUCulling`. Funcom also ships an `ai.needs.tickinterval0..3`
   family that no earlier note covers. All of these are in the 3.0.1 registry.
4. **Most "multithreading" lines from the web are already on, dead, or commands** (`researches/ue5-cvars/threading.md`). No ini line
   spreads the game thread over cores. Write a candidate only after checking it against the registry and the section priority (§1.3).

## 1. What we already know (cite, do not repeat)

### 1.1 Measurements

| Fact | Where |
|---|---|
| Flight: CPU 15.0 ms, GPU 13.6 ms, 38–46 hitches ≥ 50 ms per warm flight; A-A noise 36–52 hitches. Only A-B-A-B pairs decide | `ConanExiles/docs/18-бенч-облёт.md`; EXP-0335 |
| `dw.EnableAISpawning 0`: 65.3 fps, 20 hitches, CPU −1.2 ms (one flight) | `researches/conan-main-thread/README.md` §4 |
| `s.WarnIfTimeLimitExceeded 1`: 105 warnings, `Event_DeferredPostLoadExportBundle` 82, `CreateAsyncPackagesFromQueue` 19, 6–8 ms per frame | same, §4 |
| Level streaming profiler: `Heightmap_X4_Y2b` 1.4–1.7 s and `Caverns_of_Set_Level` 1.05–1.26 s to add to the world | same, §4 |
| WPR by module: exe 57 % of the game's CPU, NVIDIA driver 15 %, kernel 14 %, `UE4SS.dll` 3.4 % | same, §4 |
| Measured, no effect (in noise): `s.AsyncLoadingTimeLimit 2` + `s.PriorityAsyncLoadingExtraTime 5`; `r.Streaming.PoolSize 8000` (+0.4 ms GPU); `p.ClothPhysics 0` (refuted on repeat); fog on/off | `docs/18`; `_config/bench-batches/` |
| Lua mods ≈0.4 ms CPU; UE4SS global hooks ≈0 | `docs/18`, `plans/34` |

### 1.2 Earlier candidate lists (this file does not repeat their rows)

- `researches/conan-main-thread/README.md` §1: 14 candidates (async body init, cloth, incremental pre-register, adaptive AddToWorld,
  distance price, `tick.AllowConcurrentTickQueue` / `AllowAsyncTickDispatch`, `a.Budget.BudgetMs`, Funcom AI LOD, Lua mods,
  `r.Visibility.TaskSchedule` / `r.AsyncCacheMeshDrawCommands` / `r.GPUScene.ParallelUpdate`, incremental GC,
  `r.Nanite.Streaming.NumInitialRootPages`). It also has the "not candidates" list and the WPR/journal instruments (§2).
- `researches/conan-performance-mods-2026-10/README.md`: LTSharpe's UE5 levers (Oblivion Remastered), and what they measured and
  dropped.
- `researches/ue5-cvars/threading.md`: engine-wide mechanics. The game thread cannot be parallelised. `r.RHIThread.Enable` is a command.
  `r.RHICmdBypass` does nothing in Shipping with an RHI thread. `r.OneFrameThreadLag 0` turns the frame into GT + RT. Most `r.Parallel*`
  lines are already on by default.
- `ConanExiles/docs/dw-cvars/ai-lod.md`, `spawn-ai.md`, `stream.md`: Funcom's own `dw.*` levers.
- `researches/conan-shadow-flicker/2026-10-29_light-rotation-cache.md`: VSM cache vs the sun's rotation, and ray-traced sun shadows as
  the flicker cure.

### 1.3 How settings reach the game (traps that decide where a line must go)

- The game applies `[ConsoleVariables]` (Funcom's `a.Budget.*`, `tick.AllowBatchedTicks`, `WindowsApplication.UseWorkerThreadForRawInput`,
  log lines 984–1010), then `[/Script/ConanSandbox.SystemSettings]` last (log line 1816). In UE's priority ladder the `[ConsoleVariables]`
  source outranks `[SystemSettings]` (ladder: `researches/ue5-cvars/threading.md`, «Как считается»). The same log shows device-profile values beating `SetBySystemSettingsIni` («…was ignored as it is
  lower priority…», lines ≈1000–1003). **So a cvar that Funcom sets in `[ConsoleVariables]` must be overridden in a `[ConsoleVariables]`
  section of our Engine.ini, or by console `exec`. A `[SystemSettings]` line for it will be silently ignored.** After the first start,
  check that the log line `Set CVar [[name:value]]` shows our value.
- The game itself runs `r.ViewDistanceScale=…`, `r.Shadow.DistanceScale=…` and similar from its menu code at console priority. It also
  rewrites the config files on exit (comments in the pack's `Engine.ini`; `docs/01`).
- Owner decisions that bound this recon: frame generation is rejected (`docs/01`, 2026-09-08: «генерация кадров НЕ НУЖНА»). Fog and
  motion blur are off. Draw distance ×2 is his taste, so its price is measured, not cut (main-thread §1 row 7). The sun step stays at
  `DynamicSky.SolarUpdateAngleDelta 2.0` (bug 67).

### 1.4 What the game sets today (log `ConanSandbox.log`, start 2026-10-30 11:46, `LogConfig: Set CVar`)

- Animation budget: `a.Budget.Enabled 1`, `a.Budget.BudgetMs 2.0`, `a.Budget.MaxTickRate 5`, `a.Budget.InterpolationTickMultiplier 0.5`,
  `a.ForceParallelAnimUpdate 1`. Epic's defaults are BudgetMs 1.0 and MaxTickRate 10 (Epic doc, §5), so Funcom **raised** the game-thread
  animation budget.
- GC: `gc.TimeBetweenPurgingPendingKillObjects 61.1`, `gc.MaxObjectsNotConsideredByGC 42000`, `gc.CreateGCClusters 1`,
  `gc.ActorClusteringEnabled 1`, `gc.AssetClustreringEnabled 0`. Log: «CloseDisregardForGC: 50251/50251 objects in disregard for GC pool».
  The pool already holds every initial-load object, so raising `gc.MaxObjectsNotConsideredByGC` gains nothing (observed).
- Rendering: VSM on (`r.Shadow.Virtual.UseHZB 0`, `NonNanite.IncludeInCoarsePages 0`, `MarkCoarsePagesDirectional 1`,
  `UseReceiverMaskDirectional 1`, `UseFarShadowCulling 0`). Device profile `Windows_HighVRAM` sets `MaxPhysicalPagesScale 2.0`.
  `ShadowQuality@Cine` sets `r.Shadow.RadiusThreshold 0`. Nanite landscape with tessellation (`landscape.RenderNanite 1`,
  `r.Nanite.Tessellation 1`). Lumen, software tracing (`r.Lumen.TraceMeshSDFs.Allow 0`). Ray tracing compiled but off
  (`r.RayTracing 1`, `r.RayTracing.Enable 0`). `r.DistanceFieldShadowing 1`, `r.DistanceFieldAO 1`, `r.CapsuleShadows 1`,
  `r.AllowOcclusionQueries 1`.
- Frame pacing (pack `GameUserSettings.ini`): `FrameRateLimit=141`, `NvidiaReflex=1`, `bUseVSync=False`, `DLSSFrameGen=0`.
- CPU: «Cores=8» (log); Audio «Number of Async Source Workers: 4».

## 2. Candidate table

Tags: `[safe]` = no visual change, no known failure mode; try live with `exec` and keep if it is not worse. `[measure]` = needs an A-B-A-B
flight because of visual cost or a doubtful gain. `[risky]` = known crashes or behaviour changes; A-B-A-B plus 30 min of normal play
before it goes into the pack. "Registry" = `ConanExiles/_config/cvars-registered.txt` (3.0.1), checked 2026-10-30. "Help" = text read
from `ConanSandbox-Win64-Shipping.exe` 2026-10-30 (a UE help string sits right before the name).

### 2.1 Game thread

| # | cvar → value | what it does | expected CPU effect | visual cost | tag | source |
|---|---|---|---|---|---|---|
| G1 | `WindowsApplication.UseWorkerThreadForRawInput 0 → 1` (Funcom sets 0) | Help: «Use a worker thread for raw input messages to remove processing from game thread. Mice with high polling rates can take multiple milliseconds per frame even on fast CPUs. When the cvar is changed a CVarSinkHandler will attempt to switch the thread…» | Epic 5.7 (via Looman): «up to 0.5 ms saved on redundant API calls … fewer game-thread stalls, especially for high-poll-rate mice». The gain depends on the mouse's polling rate (unknown here) | none | `[measure]`: Funcom turned it off on purpose (reason unknown). Check mouse look, the camera mod, menus, the gamepad and remote-desktop input. Must go in `[ConsoleVariables]` or `exec` (§1.3) | help text; Looman, UE 5.7 highlights |
| G2 | `tick.IdleTaskWorkMS` (read first, then try 1–2) | Help: «If > 0, when the game thread is idle waiting for other threads to complete tasks it will try to spend this much time in milliseconds processing other tasks … If < 0 this will use the UE 5.5 behavior … stall the game thread entirely» | GT does queued work instead of stalling on workers (anim, cloth, physics). *Hypothesis:* small median gain on a listen server with many NPCs | none | `[measure]` | help text; Looman, UE 5.6 highlights |
| G3 | `s.UseUnifiedTimeBudgetForStreaming 0 → 1` | Help: «If 1, the time budgets are added together … and asset streaming will run immediately before level streaming with a shared budget» (0 = separate `s.AsyncLoadingTimeLimit` / `s.LevelStreamingActorsUpdateTimeLimit`) | *Hypothesis:* the 6–8 ms PostLoad frames and the 3 ms level budget stop stacking in one frame. Run after q2, because both touch the same phase | pop-in may come later | `[measure]`: replaces Funcom's per-phase budgets (`s.LevelStreamingActorsUpdateTimeLimit 3`, `s.PriorityAsyncLoadingExtraTime 15`) | help text; Looman, UE 5.6 highlights |
| G4 | `ai.needs.tickinterval0..3` (read the four values first) | Help: «AI Needs tick interval at AILOD 0» … «at AILOD 3. Only relevant if AILOD does not suspend the actor» | Funcom's NPC "needs" logic, per AI LOD. *Hypothesis:* raising the LOD1/LOD2 intervals cuts GT cost in towns and camps | none on screen; NPC needs update less often | `[measure]` (behaviour); pair with `dw.NpcLOD*` from `docs/dw-cvars/ai-lod.md` | help text (exe) |
| G5 | `a.Budget.BudgetMs 2.0 → 1.5 / 1.0` (refines main-thread §1 row 9) and `a.Budget.MaxTickedOffsreen` (Epic default 4) | Epic: «The time in milliseconds that we allocate for Skeletal Mesh work»; when over budget, less significant meshes tick less often and are interpolated | Caps animation GT time in crowds. Epic's own default is 1.0, so 1.0 is "Epic stock", not an extreme | far NPCs animate at a lower rate | `[measure]`; in `[ConsoleVariables]` (Funcom's section). Epic: `a.Budget.Enabled` «Should be set when there are no running Skeletal Meshes», so never toggle Enabled live | Epic, Animation Budget Allocator |
| G6 | `s.GroupedComponentMovement.Enable 1` | Help: deferred propagation of component transforms in scoped movements | Looman 5.6: «Character and Projectile Movement Components don't use it yet», and Conan's NPCs are characters. *Expect ≈0* | none | `[risky]` low value; last in the queue | help text; Looman 5.6 |
| G7 | `LevelStreaming.VisibilityPrioritySort` (0 default; 1/2/3) | Help: sort order of add/remove requests: removes first, or interleave | memory and ordering, not ms. *Hypothesis:* a removal no longer waits behind a big `AddToWorld` | none | `[measure]`, low | help text |
| G8 | `Async.ParallelFor.DisableOversubscription 1` | Help: «do not enable new threads to handle tasks while waiting for a ParallelFor to finish, because new threads can decrease overall performance» | helps when cores are saturated. Our WPR shows the game at 46 % of the CPU across 16 threads, so *expect ≈0* | none | `[measure]`, low | help text; Looman 5.7 |
| G9 | `s.ContinuouslyIncrementalGCWhileActorsPendingPurge 1` (5.8) | Help: «repeatedly kick off incremental GC when there are actors (from levels) still waiting to be purged» | only if GC shows up in hitches. The flight maps show no ~61 s period (main-thread §1 row 13) | none | `[measure]`, after a GC hitch is proven | help text; Looman 5.8 |
| G10 | `gc.MaxObjectsNotConsideredByGC` up | objects excluded from reachability | **0**: the log shows the pool at 50251/50251, auto-grown | — | not a candidate (observed) | log 2026-10-30 |

### 2.2 Render thread (draw calls, culling, shadows)

| # | cvar → value | what it does | expected CPU effect | visual cost | tag | source |
|---|---|---|---|---|---|---|
| R1 | `r.Shadow.RadiusThreshold 0 → 0.01 … 0.03` (the game's `ShadowQuality@Cine` sets 0; its `@3` group sets 0.04, log lines 721 and 964) | Help: «Cull shadow casters if they are too small, value is the minimal screen space bounding sphere radius» | Epic VSM doc: «Non-Nanite objects still respect the regular shadow CPU culling settings, such as `r.Shadow.RadiusThreshold`. Use it to control the cost of small distant objects». At 0, every non-Nanite caster goes into the VSM passes. *Hypothesis:* fewer shadow draw calls on RT plus less VSM GPU work, so this one wins on both sides | tiny distant props lose their shadows; at 0.01 it should be hard to see | `[measure]`: must go in the last-applied section (Cine re-applies it on every settings change) | help text; Epic, Virtual Shadow Maps |
| R2 | `r.SceneCulling.HierarchicalCPUCulling 0 → 1` (5.8; `.ProjectEnabled` is a read-only gate) | Help: «hierarchical CPU culling, which works for instanced things that have pre computed instance bounds» (non-Nanite ISMs: foliage, rocks) | culls instance groups on the CPU before GPU instance culling. The CPU-vs-GPU trade is unknown; Epic ships it off | none expected | `[measure]` | help text; Looman, UE 5.8 highlights |
| R3 | `r.ParallelShadowsNonWholeScene 0 → 1` | Help: «parallel shadow rendering for non whole-scene shadows» (point and spot lights: torches, braziers, base lights) | threading.md: the only `r.Parallel*` that ships off. Helps only with several shadowed local lights, each with enough draws | none | `[measure]`: test at night in a town or our base | help text; `ue5-cvars/threading.md` §3 |
| R4 | `r.Visibility.TaskSchedule 1` (main-thread §1 row 12) | Help: «0: Work is primarily done on the render thread …; 1: Work is done on an async task graph» | moves visibility off RT; useful only if RT is the limit | none | `[measure]` after a per-thread WPR | help text |
| R5 | Occlusion: keep `r.AllowOcclusionQueries 1` | turning queries off stops `LastRenderTime` updating in 5.5, and visibility-based anim tick then misbehaves | — | — | **do not** (0 is `[risky]`) | Steve Streeting, «UE 5.5 Skeletal Animation / LastRenderTime bug» (search snippet; the page returned 403); Epic issue UE-85356 (4.22–4.25 stall, fixed) |
| R6 | `r.HZBOcclusion 1` | HZB variant of hardware occlusion, «more conservative, so it culls fewer objects» (Epic) | *Hypothesis:* fewer query read-back stalls on RT, but more objects drawn. Net effect unknown | none, or more pop-in | `[risky]` low | Epic, Visibility and Occlusion Culling; UE forum «RenderQuery Result» |
| R7 | **Price of ray tracing** (if the ray-traced sun shadow from bug 67 is ever tried) | Epic: «The Top Level Acceleration Structure is rebuilt every frame, and has a cost on the Rendering Thread, RHI Thread, and the GPU»; budget «100,000 instances or fewer … after culling» | adds CPU. One field case: ≈2.7 ms «Finish Gather Ray Tracing Instances» at ≈150k active instances (dense forest). Limits: `r.RayTracing.Culling.Radius` (help: default 30000 = 300 m), `r.RayTracing.Geometry.SkeletalMeshes.LODBias` (Epic 60 fps preset: 2) | — | not a CPU win; know the price before the flicker fix | Epic, Ray Tracing Performance Guide; real-mrbeam blog (2026-01) |
| R8 | Distance price (main-thread §1 row 7): `r.ViewDistanceScale`, `foliage.LODDistanceScale`, `grass.CullDistanceScale` 2.0 and `r.StaticMeshLODDistanceScale 0.75` | draw distance | Epic: «Visible Static Mesh Elements» is «the single biggest contributor to rendering thread time». Grass and foliage area grows with the square of the radius | the owner's taste | `[measure]` only. Soft options without losing distance: `grass.MaxCreatePerFrame`, `grass.TickInterval` (help texts in the exe) | Epic, Visibility and Occlusion Culling |

### 2.3 Work moved to the GPU, or GPU room won back for it

| # | lever | effect | tag | source |
|---|---|---|---|---|
| U1 | `r.Shadow.Virtual.UseHZB 0 → 1` (Nanite VSM) and `r.Shadow.Virtual.NonNanite.UseHZB` | Help: «Enables two pass occlusion culling for (Nanite) Virtual Shadow Maps». A GPU saving, not a CPU one: it buys back GPU room (§0.1) | `[measure]`; watch for shadow pops after camera cuts | help text |
| U2 | Frame generation (DLSS-G, already in the build) | the only lever that turns a CPU-bound 60 fps into more displayed frames | **rejected by the owner**, 2026-09-08 (`docs/01`) | — |
| U3 | Nanite foliage (`r.Nanite.Foliage`, 5.7+ experimental) and Nanite for buildings | Nanite draws are GPU-driven (no per-mesh CPU draw call). It needs Nanite-built assets: content work, not an ini line | not an ini candidate | Looman 5.7/5.8; Epic VSM doc («Enable Nanite on as much geometry as possible») |
| U4 | Lumen hardware ray tracing | moves Lumen tracing to RT cores, but adds the TLAS cost of R7 to RT and RHI | **not** a CPU win | Epic, Ray Tracing Performance Guide |
| U5 | `r.SkinCache.Mode`, DLSS mode, render resolution | skinning is already on the GPU, and resolution does not change GT or RT work (threading.md, "Symptom → cause") | not CPU levers | `ue5-cvars/threading.md` |
| U6 | `r.Streaming.PoolSize` | measured: in noise for hitches, +0.4 ms GPU | done | `docs/18` |

### 2.4 Frame pacing (leave as is)

| lever | why | tag |
|---|---|---|
| `r.OneFrameThreadLag 1` | 0 makes the frame GT + RT instead of max(GT, RT); this is the worst choice on a CPU-bound scene (`threading.md` §1) | `[safe]` keep |
| `r.GTSyncType 0` | Epic: 0 is the default and syncs with the render thread; 2 is a latency mode tied to vsync | `[safe]` keep |
| `FrameRateLimit 141` + Reflex (`t.Streamline.Reflex.HandleMaxTickRate`, help: «Streamline Reflex handles frame rate limiting instead of the engine (default = true)») | at ≈60 fps CPU-bound the limiter never engages | `[safe]` keep |

### 2.5 Engine changes that are already in 5.8 (do not chase them by ini)

- Game, Render and RHI threads run at AboveNormal priority since 5.7 (Looman 5.7). Tuning priority by hand would undo that.
- `r.Shadow.Virtual.Cache.StaticSeparate` «can no longer be disabled» since 5.6 (Looman 5.6). This is why the name vanished from the
  registry (pack `Engine.ini` comment, 2026-09-08).
- Tick batching (`tick.AllowBatchedTicks 1`) is already set by Funcom (log).
- 5.6 RHI refactor for render-thread parallelism: one third-party CPU-limited test reports «up to 30 % faster than 5.4» (TweakTown, via
  search). It is in the engine and needs no switch.

## 3. Try first (ranked)

1. **Run the queued batches q2, q3, q4** (`_config/bench-batches/README.md`). They attack the two measured costs: PostLoad 6–8 ms and NPC
   spawning ≈1.2 ms. Nothing below beats them on expected value.
2. **G1** `WindowsApplication.UseWorkerThreadForRawInput 1`: live `exec`, zero visual cost; then test input in all modes.
3. **R1** `r.Shadow.RadiusThreshold 0.01`, then 0.02: live `exec`. Look at CPU and GPU busy, and check by eye for lost distant shadows.
4. **G5** `a.Budget.BudgetMs 1.0` (Epic stock), over the ruins and in town; read the `ai.needs.tickinterval*` values (G4) in the same run.
5. **G2** `tick.IdleTaskWorkMS`: read the value, then try 1.
6. **G3** `s.UseUnifiedTimeBudgetForStreaming 1`, after q2, with `s.WarnIfTimeLimitExceeded 1` on in both A and B.
7. **Split GT from RT first** (WPA thread view, main-thread §2A). Only if RT is the limit: **R4**, **R3**, **R2**, one at a time.
8. **U1** `r.Shadow.Virtual.UseHZB 1`, to win back GPU room before any GPU-heavier change.
9. **R8** distance price as a number for the owner's decision (not a cut). <!-- attribution-ok: names a decision still open for the owner, no decision of his is claimed -->
10. `tick.AllowConcurrentTickQueue` / `tick.AllowAsyncTickDispatch` (main-thread §1 row 8, `[risky]`: tick order changes).

Protocol: the one in `researches/conan-main-thread/README.md` §3 (warm flights only, A-B-A-B, the owner's word «кино выключено», machine
lock). Each value must be confirmed by the log line `Set CVar [[…]]`, or by `exec <name>` with no value, before the flight counts.

## 4. Conan-specific community findings

- No measured Engine.ini results for Enhanced were found. Funcom's Enhanced launch notes (2026-05-05) list engine-side fixes
  («Numerous performance fixes targeting 60+ fps…», «Improved hitches in multiplayer combat», «Significantly increased render distance of
  distant terrain HLODs», «Added prelim region extension in Engine.ini»). They name no client cvars, and the region key is for dedicated
  servers.
- Nexus "Lossless Engine Tweaks" (conanexiles 153) promises streaming, async loading, shader cache and GC tweaks. It has no
  measurements, and the author has hidden it as outdated (earlier recon). Users report that «the game deletes this Engine.ini file», which
  matches our observation that the game rewrites its configs. "Yerts Conan Lumen Enhanced" (conanexilesenhanced 37) targets Lumen quality,
  not CPU. Both pages refused the fetch (403); their contents are not read.
- Pre-Enhanced forum advice (`gc.BlueprintClusteringEnabled=False`, AMD audio `bDisableMasterEQ`) is UE4-era. `gc.BlueprintClusteringEnabled`
  is **not in the 3.0.1 registry**.

## 5. Gaps

- The mouse's polling rate is unknown, so G1's gain is unknown.
- Default values in this build of `tick.IdleTaskWorkMS`, `ai.needs.tickinterval*`, `r.SceneCulling.HierarchicalCPUCulling` and
  `r.Visibility.TaskSchedule` were not read. Read them with `exec <name>` in the first run.
- Ari Arnbjörnsson's «The Great Hitch Hunt» is known only from a retelling (earlier recon).
- GT vs RT split: never measured per thread. WPR was read by module only.

## Sources

- Epic, Animation Budget Allocator — https://dev.epicgames.com/documentation/en-us/unreal-engine/animation-budget-allocator-in-unreal-engine
- Epic, Animation Optimization — https://dev.epicgames.com/documentation/en-us/unreal-engine/animation-optimization-in-unreal-engine
- Epic, Virtual Shadow Maps — https://dev.epicgames.com/documentation/en-us/unreal-engine/virtual-shadow-maps-in-unreal-engine
- Epic, Visibility and Occlusion Culling — https://dev.epicgames.com/documentation/en-us/unreal-engine/visibility-and-occlusion-culling-in-unreal-engine
- Epic, Ray Tracing Performance Guide — https://dev.epicgames.com/documentation/en-us/unreal-engine/ray-tracing-performance-guide-in-unreal-engine
- Epic, Low Latency Frame Syncing — https://dev.epicgames.com/documentation/en-us/unreal-engine/low-latency-frame-syncing-in-unreal-engine
- Epic, Incremental Garbage Collection — https://dev.epicgames.com/documentation/en-us/unreal-engine/incremental-garbage-collection-in-unreal-engine
- Epic issue UE-85356 (occlusion queries 0 → stall, 4.22–4.25) — https://issues.unrealengine.com/issue/UE-85356
- UE forum, «RenderQuery Result» — https://forums.unrealengine.com/t/383754
- Tom Looman, UE 5.6 performance highlights — https://tomlooman.com/unreal-engine-5-6-performance-highlights/
- Tom Looman, UE 5.7 performance highlights — https://tomlooman.com/unreal-engine-5-7-performance-highlights/
- Tom Looman, UE 5.8 performance highlights — https://tomlooman.com/unreal-engine-5-8-performance-highlights/
- TweakTown, UE 5.6 «up to 30 % more performance» (third-party CPU-limited test) — https://www.tweaktown.com/news/105960/unreal-engine-5-6-update-on-track-to-deliver-up-to-30-more-performance-in-games/index.html
- Steve Streeting, UE 5.5 skeletal animation / LastRenderTime bug — https://www.stevestreeting.com/2025/05/22/ue-5.5-skeletal-animation-/-lastrendertime-bug/ (403; search snippet only)
- real-mrbeam, Managing HWRT in instance-heavy scenes (2026-01-20) — https://real-mrbeam.github.io/2026/01/20/Managing-HWRT-in-Instance-Heavy-Scenes.html (via search summary)
- Funcom, Conan Exiles Enhanced patch notes — https://forums.funcom.com/t/conan-exiles-enhanced-patch-notes/296991
- Nexus, Lossless Engine Tweaks — https://www.nexusmods.com/conanexiles/mods/153 · Yerts Conan Lumen Enhanced — https://www.nexusmods.com/conanexilesenhanced/mods/37 (both 403)
- Build evidence: `D:\Games\Conan Exiles 3.0.1\ConanSandbox\Saved\Logs\ConanSandbox.log` (start 2026-10-30 11:46); help strings from
  `ConanSandbox-Win64-Shipping.exe`, read with `D:\Temp\claude\d--work-ai-sandbox-KUMM\b46b10e8-23d7-452e-8032-fb1b9928ad65\scratchpad\cvh\cvarhelp.py`;
  `D:\work\ai_sandbox\ConanExiles\_config\cvars-registered.txt`; `D:\work\ai_sandbox\ConanExiles\_config\GameUserSettings.ini`;
  `D:\work\ai_sandbox\ConanExiles\_unpacked\KrinikConanGraphics\Engine.ini`.
