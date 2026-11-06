# Oblivion Remastered Performance Fix — what Conan can take as a Quick Win

**Created:** 2026-11-06 · **Parent:** owner's word «нужно будет изучить проект … и понять, если в нём наработки, который мы можем легко и просто как Quick Win взять в конан» · **Status:** recon done, nothing applied, nothing measured on Conan · **Outbound:** —

Source: https://github.com/LTSharpe/OblivionRemasteredPerformanceFix (MIT), read-only via raw.githubusercontent.com, HEAD of 2026-11-06. Nothing from the repo was downloaded as a binary or run. Read: `README.md`, `docs/porting.md`, `src/OblivionPerfFix/OblivionPerfFix.ini` (every switch), the relevant sections of `docs/how-it-works.md` and `docs/research.md`, `docs/benchmark.md` (UE4SS), `CHANGELOG.md` (grep), `src/OblivionPerfFix/src/core/common.h` / `main.cpp` (grep), `src/OblivionPerfFix/src/physics/chaos_payload.cpp` (header comment).

**Prior KUMM recon of the same repo exists — this file extends it, it does not repeat it:** `researches/conan-performance-mods-2026-10/README.md` (2026-10-25) already carried four engine levers — `r.RHICmd.ParallelTranslate.Enable`, `r.Nanite.Streaming.NumInitialRootPages=3072`, `r.pso.PrecompileThreadPoolSize`, `r.GPUScene.ParallelUpdate` — into `plans/33_conan_pereezd_3.0.1.md` item 4b ("сначала прочитать значения в игре"); none of them is in our Engine.ini yet and none was benched. **New in this pass:** `p.MaxPayloadSize` (main thread, every collision query), `p.Chaos.AccelerationStructureTimeSlicingMaxQueueSizeBeforeForce` (streaming hitch), the repo's "Tried and not shipped" list mapped onto our queued candidates, and the UE4SS leak check.

## 1. What the project is

1. One native DLL (`version.dll` proxy, or an OBSE64 plugin) for Oblivion Remastered, Steam build 19115871, engine **UE 5.3** (`docs/porting.md` → top and "3. Find the same code" item 4). Conan 3.0.1 is **UE 5.8** (`researches/conan-main-thread/README.md`).
2. About fifty fixes; each finds its code site in the exe by a byte pattern plus structural checks (call targets, offsets, a cvar's registration `lea r8,[value]; lea rdx,[name]`), patches it in memory, and switches itself off with a log line if anything differs (`README.md` → "What it does", "Is it safe?").
3. Rule of the project: "never change the look" — part 1 of the ini is same-picture speed-ups, part 2 game-bug fixes, part 3 optional tweaks that may change the look (`OblivionPerfFix.ini` header).
4. Most fixes target the **old Oblivion engine (Altar/Gamebryo) half** or UE 5.3 bugs fixed in later UE; a handful are just UE cvars written early (the DLL writes the cvar's bound value before the ini is read; the ini says the same `Engine.ini` line works and wins).
5. Measured on one PC (Ryzen 7 5800X, RX 9070 XT): Imperial City flight 72 → 102 fps, hitches ≥ 50 ms 19.5 → 4.8 per flight (`README.md` → "Results", version 1.0.0-beta).

## 2. Every fix and switch

Legend. **How:** cvar = the DLL only writes an engine console variable (an `Engine.ini` line does the same); patch = byte patch at a pattern; hook = detour of a function. **Kind:** OBL = Oblivion/Altar code or this game's content/menus; UE = generic UE engine code. **Ours?** = already in our `Engine.ini` (`ConanExiles/_unpacked/KrinikConanGraphics/Engine.ini`, the file `modpack.json` → `engineIni.file` names); it holds only look lines (motion blur, view distance ×2, foliage/grass ×2, LOD 0.75, DLSS on, fog off, VSM shadows, `DynamicSky.SolarUpdateAngleDelta=2.0`), so the answer is **no** for every row. **Conan:** YES-trivial (a cvar line) / MAYBE (needs code: our own DLL or a UE4SS C++ mod) / NO / NATIVE (UE 5.5–5.8 already does it). Gains are the repo's own numbers; "ini" = the switch's comment in `OblivionPerfFix.ini`, "hiw" = `docs/how-it-works.md`, "res" = `docs/research.md` (section = the switch name).

### 2.1 Performance improvements (ini part 1)

| Switch | What it does | How | Kind | Conan | Their gain | Risk for us |
|---|---|---|---|---|---|---|
| `BoneUploadStores` | bone matrices copied to GPU memory with plain stores instead of a slow instruction | patch | UE (5.3 code) | MAYBE | "+22-25% fps where the CPU is the limit" for the rendering group (README "What it does"), not split per fix | code port; may be fixed in 5.8 |
| `AtmosphereDirtyFilter` | sun/moon/fog/sky rebuilt only when a value changed | hook | OBL (Altar weather drives UE atmosphere every frame) | NO (Conan's own sky code; would need its own profile) | in the rendering group number above | — |
| `AtmosphereLightFastPath`, `AtmosphereLightCloudPath` | light colour/brightness updated the way the engine setters do | hook | OBL | NO | same group | — |
| `RdgParallelTranslate` | RHI translation on all cores | patch (`setne r8b` → `mov r8b,1`) | UE 5.3 | NATIVE likely: "Unreal 5.5 made this the default"; Conan registers `r.RHICmd.ParallelTranslate.Enable` | "RHI thread ~90% → ~55% busy, +22-25% fps in CPU-bound spots" (hiw) | read the value only; +0.4-1 GB VRAM in 5.3 |
| `RdgSubmitBatch` | ~115 → ~25 submissions per frame | hook | UE 5.3 | MAYBE / NATIVE (Conan has `r.RHICmd.ParallelTranslate.BatchSubmissions`) | GPU time "canal noon 15.7 → 12.2-12.6 ms" (hiw) | AMD-driver cost per submission; owner is NVIDIA |
| `GpuSceneParallelUpload` | GPU-scene upload batches on all helpers | **cvar** `r.GPUScene.ParallelUpdate` | UE | YES-trivial, but in 5.8 it is a threshold N ("run it in parallel by default once there is enough work", hiw) → read first | "Kvatch C, the arrival's worst frame 50-55 -> 38-43 ms"; "Imperial City flight -5.5 % ms over budget" (hiw) | none to the image (each batch writes its own slots, hiw) |
| `ClothConfigCache` | skip an identical cloth-config copy per frame | hook | UE (ChaosCloth) | MAYBE | not measured there separately | code port |
| `WaterCaptureFsrSkip`, `…NoRhiFlush`, `…NoOcclusionWait`, `…FastMeshScan` | trim work inside the game's "water info" captures | hooks | OBL (UE Water plugin used by this game) | NO (Conan's water differs; unknown) | not split in the docs read | — |
| `RayTracingBuildBatch` | new objects' RT structures built together | hook | UE 5.3 | NO (owner runs DLSS; HW RT on Conan not established) | "that frame took 20-40 ms longer on the graphics card" before (ini) | — |
| `PhysAnimNoEmptyLock` | skip a physical-animation update that drives nothing | hook | UE (PhysicalAnimationComponent) | MAYBE | corral "10.6 -> 9.2 ms" main thread with `RigTraceReuse` (hiw) | code port; horses-specific content |
| `RigTraceReuse` | reuse identical Control Rig traces in one step | hook | UE (Control Rig) | NO (Conan's mounts are not known to run such rigs) | "main thread's pre-physics work -0.5 ms" (hiw) | changes a race result in theory |
| **`ChaosMaxPayloadSize`** | huge collision shapes filed in the tree instead of a list every query walks | **cvar** `p.MaxPayloadSize` 100000 → 10000000 | **UE (Chaos)** | **YES-trivial** (registered in Conan) | game-thread tick "9.7 -> 8.5 ms" (`sk-d`), "8.8 -> 7.6 ms" (Vilverin); "shapes tested per check 385 -> 14" (hiw); "query time on the game thread 3.07 -> 1.32 ms per frame" (res) | gain depends on how many > 1 km shapes the map holds — Oblivion had ~730 columns; Conan unknown; exact-tie order only (res) |
| `LumenKeepArrayCapacity` | Lumen's lists keep capacity | hook | UE 5.3 | MAYBE | "25-40 ms each time" before (ini) | code port |
| `UploadMemoryKeep` | keep D3D12 upload pools for the session | hook | UE 5.3 | MAYBE (the cvar `d3d12.FastAllocator.MinPagesToRetain`, 5 by default, covers one of the three allocators only, res "UploadMemoryKeep") | "up to 30 ms per block" before (ini) | +0.1-0.5 GB RAM |
| `GpuSceneKeepCapacity` | GPU-scene buffers shrink at ¼, not ½ | hook | UE | MAYBE | "about 100 ms" per re-make before (ini) | code port |
| `RtSceneBufferKeep` | RT scene buffer never shrinks | hook | UE | NO (RT not ours) | "a freeze of a fraction of a second" (ini) | — |
| `NaniteInitialRootPages` | Nanite root-page buffer starts at its first growth size | **cvar** `r.Nanite.Streaming.NumInitialRootPages` 2048 → 3072 | UE | YES-trivial (registered), but 5.8 also has `…DynamicallyGrowAllocations` and `…Debug.ReservedResource*` names: the growth copy may not exist there | stock: "four of five runs froze past the bridge (… 121, 952, 1,333 and 1,739 ms)"; with it "no freeze" (hiw) | +32 MB VRAM; ReadOnly → ini only |
| `InstanceClearReserve` | reserve the grass "hide" list once | hook | UE (ISM) | MAYBE | "about 20 ms" before (ini) | code port |
| `OsPageCache` | keep 64 MB of freed blocks | hook | OBL/allocator | MAYBE | not measured there as a frame number | code port |
| `NavmeshBuildNoBusyWait` | navmesh tile tasks flagged "do not run inside a busy wait" | patch (one flag byte) | UE (Recast + task graph) | MAYBE | stalls "up to about 100 ms" before (ini) | code port; 5.8 task system differs |
| `BusyWaitFlagCheck` | close the gap in that check | patch (four jumps) | UE 5.3 | MAYBE | "tiles built inside a wait 6 in 10 flights … 0 in 7" (hiw) | code port |
| `NavLinkFast` | link only bordering navmesh tiles | hook | UE (Recast) | MAYBE | not measured there as a frame number | code port |
| `PhysicsTreeTimeSlicing` (part 1) | don't force a whole-tree rebuild above 1000 queued changes | **cvar** `p.Chaos.AccelerationStructureTimeSlicingMaxQueueSizeBeforeForce` 1000 → 100000 | **UE (Chaos)** | **YES-trivial** (registered) | "hitch time 48 -> 21 ms (two runs each)" (hiw/res) | same tree, built over more frames (res) |
| `PhysicsTreeTimeSlicing` (part 2) | bigger rebuild slices: `p.IterationsPerTimeSlice` 4000 → 40000, `p.Chaos.AccelerationStructureTimeSlicingMaxBytesCopy` 100000 → 1000000, adaptive per step | cvars + hook (the adaptive switch is a detour of `ComputeIntermediateSpatialAcceleration`) | UE | MAYBE (fixed values are cvar lines; the "only while a backlog" part is code) | "the largest catch-up 9.6-12.8 ms" vs "25-44 ms" (res) | static big slices cost every quiet step too — that is why they made it adaptive |
| `PhysicsFlushParallel`, `ParallelStaticBodies`, `PipelinedBodyCreation`, `DirtyTreeQuickInsert`, `BulkIndexInsert`, `PhysicsInternalFlushParallel`, `PhysicsPushParallel`, `PhysicsQueueShrinkOnce`, `PhysicsDestroyBatch` | Chaos streaming-in/out work on helpers, in batches | hooks | UE (Chaos 5.3) | MAYBE (each is a C++ port against Conan's 5.8 Chaos) | e.g. "about 170 ms over a few seconds below Kvatch's north cliff" before (ini, `ParallelStaticBodies`) | high: threading changes in physics |
| `NpcFadeInNoRebuild` | fade value sent instead of rebuilding proxies | hook | UE + OBL fade | MAYBE | "more than a gigabyte of extra video memory" before (ini) | code port |
| `NpcCreationPacing`, `PacingLeanFlowDrain`, `ClothBuildDefer` | far, unseen NPCs created a piece per frame | hooks | OBL (Altar creation) | NO (the idea fits our spawn hitches, the code does not) | "Peryite-short … 181 -> 110 ms" (README "New in 1.2.4") | timing of spawns |
| `ClothRegisterLite` | thrown-away cloth builds skip constraints | hook | UE (ChaosCloth) + OBL flow | MAYBE | not split | code port |
| `RigVmHashMemo`, `RigLogicMapCache` | memoise rig set-up | hooks | UE (RigVM, RigLogic) | MAYBE | not split | code port |
| `NpcBodiesOneLock` | one physics lock per new character | hook | UE | MAYBE | not split | code port |
| `AnimTeardownParallel`, `CellBufferPacedEvict` | old cells unloaded on helpers / over frames | hooks | OBL | NO | "5-20 ms at Kvatch" before (ini, `CellBufferPacedEvict`) | — |
| `PrepareCollisionBehindLoadingScreen`, `StreamBehindLoadingScreen` | door work behind the loading screen | hooks | OBL | NO | door worst frame "187 ms → 95 ms" (README "Results") | — |
| `PsoPrecompileFast` (+ `…BudgetMs`, `…ColdQueue`, `…InGameMenus`) | fast PSO precompile in menus/loading | hook | UE + OBL menus | NO for a Quick Win (Conan shaders = SCSKiller topic) | precompile "22-25 seconds after launch" (res "Game behaviour worth knowing") | — |
| `DisplayModeCache`, `MenuScreenshotFilter`, `ScreenshotReadbackConvert`, `ScreenshotParallel` | Oblivion's menus | hooks | OBL | NO | menu "0.74 s → 0.43 s", "0.36 s → 0.20 s" (README "Results") | — |
| `SaveBytesBulk`, `SaveThumbnailAsync`, `SaveRefIdIndex` | Oblivion's save code | hooks | OBL | NO | "about 30 ms … per save" before (ini) | — |
| `FrameGenAsyncCompute` | AMD FSR3 FI on async compute | **cvar** `r.FidelityFX.FI.AllowAsyncWorkloads` | UE plugin (AMD) | NO for us (owner: NVIDIA + DLSS, no frame generation) | "+22-29 % rendered fps" with FSR FG (ini) | — |
| `FrameGenPacingTuning`, `FrameGenCameraInfo` | AMD FSR FG pacing / camera | hooks | AMD plugin | NO | — | — |
| `MemoryRelief`, `SharedMemoryGpu`, `CommandAllocatorTrim` | safety valves for the memory-keeping fixes | code | — | NO (nothing to guard) | — | — |

### 2.2 Game bug fixes and tweaks (ini parts 2–3) and diagnostics

| Switch | How | Kind | Conan | Note |
|---|---|---|---|---|
| `NameLookupCrashGuard`, `TrapCrashGuard`, `HavokPickWarningGuard`, `BowSneakAttackFix`, `RestoreFsrAfterAltTab`, `MenuOpenFlashFix`, `FrameRateLimitAtStart`, `AutosaveFollowsMenu`, `ShaderScreenAfterDriverChange`, `VramCounterFix`, `MonitorNativeFromWindows`, `FullscreenAllResolutions`, `HdrGamma22`, `HdrMenuBackground`, `HdrSaveThumbnail`, `HdrMenuRows`, `HudAspectRow`, `DlssRayReconstruction`, `UnfreezeBehindLoadingScreen(FastTravel)` | hooks | OBL | NO | this game's own bugs and menus |
| `ObjectReplaceCrashGuard` | hook | UE (UObjectArray) | NO | no such crash seen on Conan |
| `ViewRenameGuard` | hook | UE 5.3 bug UE-217692 | NATIVE ("fixed in Unreal Engine 5.5", hiw) | — |
| `FrameGenCrashGuard` | hook | AMD FSR 3.1.0 DLL | NO | Conan ships the SDK 2.x loader files already (`amd_fidelityfx_loader_dx12.dll` in `Binaries/Win64`), and the owner uses DLSS |
| `TaskWaitDeadlockGuard` + `PsoCompileThreadPool` | hook + cvar `r.pso.PrecompileThreadPoolSize` | UE 5.3 | NO as a Quick Win | the pool "alone hung 125 s in the deadlock" without the guard (res); warm cache: "no difference beyond noise" (res) — gain only on a cold driver cache |
| `FrozenClothStretchFix` | hook | UE cloth + OBL | NO | — |
| `SeparableSkinAbove4K` | cvar `r.SSS.Burley.Quality 0` while render > 3840 px | UE | NO | changes the look; Oblivion-specific magenta bug |
| `VtStreamingUploads` (tweak) | cvar `r.VT.MaxUploadsPerFrame.Streaming`, re-written whenever the game puts its 4 back | UE + OBL scalability | NO | "No Engine.ini line can set this" (ini) → it is a re-setting crutch; also more upload work per frame |
| `FadeVtFlushSkip` (tweak) | hook (skips `r.VT.Flush`) | OBL | NO | — |
| `HitchLedger`, `HitchLedgerTickSplit` (diagnostics) | hooks | OBL + UE ticks | MAYBE as a **method** | per-class tick time CSV, "about 0.4 ms per frame in a big crowd" when on (README "Help improve it"); our WPR route covers the same question |

### 2.3 Their measured "no" list — what it says about our queued candidates

From `docs/research.md` → "Tried and not shipped" (Oblivion, UE 5.3):

| Their test | Their result | Bearing on Conan |
|---|---|---|
| `p.Chaos.EnableAsyncInitBody=0` ("the game ships 1") | "AddToWorld and physics-state samples about doubled, worst present 41 ms" | **supports our queued batch q3** (`ConanExiles/_config/bench-batches/q3-asyncinitbody.txt`): a shipped UE5 game runs with async body init on, and turning it off hurt |
| `tick.AllowAsyncTickDispatch`, `tick.AllowAsyncTickCleanup`, `a.ForceParallelAnimUpdate` | "≤ 0.07 ms" | lowers the priority of `conan-main-thread` §1 row 8 |
| `s.AdaptiveAddToWorld.AddToWorldTimeSliceMax 2`, `s.LevelStreamingComponentsRegistrationGranularity 2` | "within run-to-run noise" | lowers `conan-main-thread` §1 row 6 |
| `p.Chaos.AccelerationStructureUseDirtyTreeInsteadOfGrid 0`, `p.aabbtree.DynamicTreeLeafCapacity 32` | "within the defaults' spread" | do not try |
| `r.Streaming.PoolSize 6000`, `p.EnableDeferredPhysicsCreation 1`, finer level-streaming budgets | "No effect on travel hitches" | matches our own q1 result |
| "UE 5.4+ defaults: PSO precompile pool, `r.RayTracing.AsyncBuild`, …" | "Nothing beyond noise" | do not try |
| `r.RDG.Events=0` | "RenderThread -0.3 ms per frame", "No fps change" | not a main-thread lever |
| `D3D12.ResidencyManagement=0` | submission thread −16..−21 %, "No fps change" | risky; skip |
| `r.Lumen.HardwareRayTracing.LightingMode 0`, `r.RayTracing.Culling.Radius 5000`, HW RT off | +8 % / +10 % / +39-46 % fps | change the look — out by the owner's rule |
| "Internet 'Engine.ini tweak packs'" | — | "Many keys don't exist in UE5 … comments after a value aren't comments in Unreal ini files" |

**UE4SS memory leak** (`docs/benchmark.md` → "Which UE4SS"; `docs/research.md` → "Game behaviour worth knowing"): every Lua call of a game function with an `Out` parameter kept its table, "about 1 GB per hour for a mod that does it every frame"; fixed upstream by PR #1452 in experimental build 1181 (`UE4SS_v3.0.1-1181-g83330635`). Our install's `ue4ss/UE4SS.log` (2026-11-06 15:32) reads `UE4SS - v3.0.1 Beta #0 - Git SHA #83330635` — **we already run the fixed build**; nothing to do.

## 3. Quick-Win shortlist (cvar-level, generic UE5, same picture)

All of them are one line in our `Engine.ini` under `[SystemSettings]`, all names exist in the 3.0.1 registry (`ConanExiles/_config/cvars-registered.txt`, exact-name match), none changes what is drawn. **Conan's current values are not known** (the registry holds names only; Funcom may already set some): step 0 of every measurement is a `#read`.

### 3.1 `p.MaxPayloadSize=10000000` — the one main-thread lever

- **Line:** `p.MaxPayloadSize=10000000` (cm; engine default 100000 = 1 km).
- **Why it should help us:** every Chaos scene query — character movement sweeps, overlaps, line-of-sight traces, NPC AI traces — first walks the tree's `GlobalPayloads` list of all shapes whose bounds exceed 1 km, then walks the tree (`chaos_payload.cpp` header; res "Large collision shapes filed in the search tree"). That is pure **game-thread** cost proportional to (queries per frame × count of > 1 km shapes). Our flight is CPU-bound (CPU ~15 ms vs GPU ~12-13.6 ms) with many NPCs and AI traces in the listen-server game thread. Candidates for > 1 km shapes in Conan: World Composition landscape tiles' heightfield collision (`Heightmap_X*_Y*`), map-wide blocking/kill/water volumes. **Unknown how many exist** — in Oblivion the 730 columns were a content quirk. The gain can be anything from zero to the ~1.2 ms they saw.
- **Risk:** the same objects are found; only visit order changes, which matters only for exact ties at distance 0 (res: 0.278 % vs 0.287 % of raycast visits). Trees read the value when created → set it in the ini before launch, not live. Their doors showed "no added hitch". Low risk, re-appliable, native.
- **Measure:** start-up key → per-launch A-B-A-B. Before each B launch `python _config/ini-temp.py add <Saved/Config/Windows/Engine.ini> q6 p.MaxPayloadSize=10000000`, after it `ini-temp.py revert <ini> q6`. Batch file (e.g. `bench-batches/q6-payload.txt`): `#read p.MaxPayloadSize`, then `q6-warmup`, `q6-B1`, `q6-B2`; the A launches use the same file with A labels. Decide on median `MsCPUBusy` first (the expected effect is steady per-frame CPU, not hitches), then hitches ≥ 50 ms; success = both B below both A by more than the A-A spread (`researches/conan-main-thread/README.md` §3). The `#read` line in the game log must show `10000000` in B.

### 3.2 `p.Chaos.AccelerationStructureTimeSlicingMaxQueueSizeBeforeForce=100000` — streaming hitch

- **Line:** as written (engine default 1000).
- **Why it should help us:** above 1000 queued collision changes Chaos rebuilds the whole acceleration structure in one go and the game thread waits at the end of the physics step; with the limit raised the same tree is built over more frames, and queries meanwhile use the current tree plus the dirty tree (hiw/res "Physics search tree rebuilt a little at a time"). Our hitches line up with world-tile arrivals (`Heightmap_X4_Y2b` 1.4–1.7 s to add) and NPC spawns, both of which queue collision changes. Their gain: "48 -> 21 ms" at one spot.
- **Risk:** low; same tree. Read whether the value is live: if `exec` changes it in a running game (the batch `#read` after the `exec` shows it), it can be A-B-A'd in one launch.
- **Measure:** runtime batch, e.g. `q7-tree.txt`: `#read p.Chaos.AccelerationStructureTimeSlicingMaxQueueSizeBeforeForce p.IterationsPerTimeSlice p.Chaos.AccelerationStructureTimeSlicingMaxBytesCopy`, then `q7-warmup`, `q7-A1`, `q7-B1<TAB>exec p.Chaos.AccelerationStructureTimeSlicingMaxQueueSizeBeforeForce 100000`, `q7-A2<TAB>exec … 1000` (the value read at step 0), `q7-B2<TAB>exec … 100000`. Look at hitches ≥ 50 ms and the worst frame, in the seconds of tile arrivals. If no effect, the **second tier** is the slice pair `p.IterationsPerTimeSlice 40000` + `p.Chaos.AccelerationStructureTimeSlicingMaxBytesCopy 1000000` as fixed values — but watch median `MsCPUBusy`: their DLL made these adaptive precisely because bigger slices cost every quiet step.

### 3.3 `r.GPUScene.ParallelUpdate` — read first, set only if off

- **Line:** in 5.8 the value is a threshold (items above which the upload runs in parallel; `conan-main-thread` §1 row 12), so the line is chosen after reading it: if Conan reads `0`, try a positive threshold such as the engine's newer default; if it is already non-zero, nothing to do.
- **Why it should help us:** the GPU-scene upload of a streamed-in wood or rock field ran on one helper and the render thread, then the game thread, waited for it (hiw). Their gain: worst arrival frame "50-55 -> 38-43 ms". It helps the frame only where the render thread is in the critical path — our flight is game-thread-bound on average, so expect hitch-frame gains, not median.
- **Measure:** add the name to the `#read` line of any batch (zero cost); if it is off, a runtime A-B-A-B batch with `exec r.GPUScene.ParallelUpdate <N>`; metric — hitches ≥ 50 ms and worst frame.

### 3.4 `r.Nanite.Streaming.NumInitialRootPages=3072` — only if the growth happens on Conan

- **Line:** as written (default 2048); `ECVF_ReadOnly` → ini before launch (`researches/ue5-cvars/lod-viewdistance.md`).
- **Why:** it removes one deterministic buffer re-creation + GPU copy the first time a session needs more than 2048 Nanite root pages; in Oblivion at 4K with VRAM nearly full that froze up to ~1.7 s (hiw). It is a once-per-session freeze, not a per-frame cost, and it hits only if Conan's Nanite content crosses 2048 root pages and 5.8 still grows that buffer by copy (5.8 registers `r.Nanite.Streaming.DynamicallyGrowAllocations` and `…Debug.ReservedResourceRootPageGrowOnly`, which suggests a reserved-resource path). Cost +32 MB VRAM.
- **Measure:** `#read r.Nanite.Streaming.NumInitialRootPages r.Nanite.Streaming.DynamicallyGrowAllocations` first. If the bench flights show one long frame at the same place in the first flight after launch only, A-B over launches with `ini-temp.py add … q8 r.Nanite.Streaming.NumInitialRootPages=3072`, metric — the worst frame of the **first** (cold) flight; warm flights cannot show it.

**Read-only, no line:** `r.RHICmd.ParallelTranslate.Enable` and `r.RHICmd.ParallelTranslate.BatchSubmissions` — add to a `#read`; expected already on in 5.8. If either reads 0, it becomes a candidate (watch VRAM).

**Not Quick Wins** despite being cvars: `r.pso.PrecompileThreadPoolSize` (needs their deadlock guard in 5.3; warm cache — no gain), `r.FidelityFX.FI.AllowAsyncWorkloads` (AMD FG, unused), `r.VT.MaxUploadsPerFrame.Streaming` (needs re-setting at runtime), `r.SSS.Burley.Quality` (look change).

## 4. What porting the DLL itself would take

Their DLL cannot be dropped into Conan: every fix is keyed to byte patterns and struct offsets of the Oblivion Remastered Steam exe 19115871 (UE 5.3), and two thirds of the fixes live in the Altar half of that game, which Conan does not have. `docs/porting.md` describes the per-fix loop even for a *new build of the same game*: run `tools/find_patterns.py` to see which patterns moved, run `build.ps1 -SelfTest` against the exe, read each fix's header comment for the expected instructions, re-find the site from surviving anchors (a shorter pattern, a neighbour pattern, strings/imports, or the public UE source of the named function), keep literal every byte the fix's correctness depends on, update struct-offset checks, then verify in game and with image comparisons — "some x64 assembly reading" assumed. For Conan that becomes: pick only the UE-generic hooks (the Chaos streaming batch, upload/Lumen/GPU-scene capacity keeping, navmesh busy-wait), read UE 5.8 source to see which bugs Epic already fixed (parallel translation, UE-217692, GPU-scene parallel upload are fixed or defaulted after 5.3), find each site in `ConanSandbox-Win64-Shipping.exe` without PDBs, and ship a native module (a UE4SS C++ mod or our own proxy DLL next to UE4SS's `dwmapi.dll`) — per fix a reverse-engineering task, plus BattlEye/online considerations. That is an epic with a profile-first phase (WPR → which hook pays on Conan), not a Quick Win.

## 5. Sources

Repository (HEAD 2026-11-06):
- `README.md` — "Results", "What it does", "OBSE64 route: what stays off", "Is it safe?", "FAQ".
- `src/OblivionPerfFix/OblivionPerfFix.ini` — every switch comment, parts 1–3 and Diagnostics.
- `docs/how-it-works.md` — "The big picture"; "Parallel command translation (`RdgParallelTranslate`)"; "Submission batching (`RdgSubmitBatch`)"; "Scene data uploaded on helper threads (`GpuSceneParallelUpload`)"; "No exclusive physics lock … (`PhysAnimNoEmptyLock`)"; "A horse's repeated ground checks … (`RigTraceReuse`)"; "Collision checks no longer walk a list of the whole map first (`ChaosMaxPayloadSize`)"; "Nanite's page block starts big enough (`NaniteInitialRootPages`)"; "Navigation tiles built only by free threads (`NavmeshBuildNoBusyWait`)"; "The navigation wait check completed (`BusyWaitFlagCheck`)"; "Walls and roofs sharp sooner after a door (`VtStreamingUploads`)"; "Physics search tree rebuilt a little at a time (`PhysicsTreeTimeSlicing`)".
- `docs/research.md` — "Scene data uploaded on helper threads"; "Large collision shapes filed in the search tree (`ChaosMaxPayloadSize`, 1.2.3)"; "Upload memory kept between streaming bursts"; "Nanite's page block starts big enough"; "Streamed virtual texture pages per frame"; "Physics search tree rebuilt a little at a time"; "Graphics pipelines prepared on the engine's own pipeline threads (`PsoCompileThreadPool`)"; "Tried and not shipped"; "What still limits the game"; "Game behaviour worth knowing".
- `docs/porting.md` — whole file (8 KB).
- `docs/benchmark.md` — "Which UE4SS".
- `CHANGELOG.md` — 1.2.3 `ChaosMaxPayloadSize` entry; UE4SS build 1181 entry.
- `src/OblivionPerfFix/src/physics/chaos_payload.cpp` — header comment; `src/OblivionPerfFix/src/core/common.h` — `FindChaosMaxPayloadVar`, `FindChaosTimeSlicing`, `FindGpuSceneParallelUpload`, `FindNaniteRootPagesVar` declarations (cvars found through their registration).

Ours:
- `D:\work\ai_sandbox\ConanExiles\modpack.json` → `engineIni`; `D:\work\ai_sandbox\ConanExiles\_unpacked\KrinikConanGraphics\Engine.ini`.
- `D:\work\ai_sandbox\ConanExiles\_config\cvars-registered.txt` (registry, 2026-10-25); `…\_config\bench-batches\README.md`, `q1-runtime.txt`, `q3-asyncinitbody.txt`; `…\_config\bench-batch.sh` header (batch format: `label<TAB>cmd; cmd`, `#read <names>`).
- `D:\Games\Conan Exiles 3.0.1\ConanSandbox\Binaries\Win64\ue4ss\UE4SS.log` (read only) — UE4SS Git SHA 83330635.
- KUMM: `researches/conan-main-thread/README.md`, `researches/conan-performance-mods-2026-10/README.md`, `researches/conan-engine-ini-cpu/README.md`, `researches/ue5-cvars/lod-viewdistance.md`, `plans/33_conan_pereezd_3.0.1.md` item 4b.
