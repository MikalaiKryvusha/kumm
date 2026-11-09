# Research — Conan 3.0.1: what the engine does inside a hitch frame (per-hitch ETW profile)

> **Created:** 2026-11-09 · **Parent:** the owner's question 2026-11-09 19:39 «можно будет профайлером померить фризы? найти бутылочное горлышко - что делает движок в
> моменты фризных кадров» · **Status:** method written 2026-11-09 19:57; first try (WPR `CPU+GPU`, 19:41) dropped 5 038 727 events in a 23 GB file — void, deleted ·
> **Outbound:** the per-hitch table → the owner (chat)

## Goal vector (Achieve)
For every frame ≥ 50 ms of a `krinik-show` flight: which thread held it (game thread, render thread, RHI, workers, driver) and in which module (the game exe,
`nvwgf2umx.dll`, `ntoskrnl.exe` file I/O, `UE4SS.dll` / our Lua), so the next quick win targets the real bottleneck instead of a guess.
Acceptance: a table «hitch time · duration · top thread · top modules with sample share» for ≥ 20 hitches of one flight, from a trace with 0 lost events (or the
loss stated and below 1 %).

## What is already known (do not repeat)
- `researches/conan-main-thread/README.md` §2А: one whole-flight WPR (`wpr -start CPU`) — 6 GB / 3 min, 71 508 events lost; by module over the whole flight: exe 57 %
  of the game, NVIDIA driver 15 %, kernel 14 %, `UE4SS.dll` 3.4 %. No per-thread, no per-hitch split. `xperf` needs `-tle` when events were lost, or it prints nothing.
- The Shipping exe has no PDB: functions inside the exe are not named (module level only); Windows and NVIDIA modules resolve through the MS symbol server.
- `stat` commands and Unreal Insights are compiled out of this build (§2 of the same file).

## Method (one flight, ≈ 60 s of capture to keep the file small)
1. Kernel logger with big buffers, sampled profile at 1 ms + context switches with stacks:
   `xperf -on PROC_THREAD+LOADER+PROFILE+CSWITCH+DISPATCHER -stackwalk Profile+CSwitch+ReadyThread -BufferSize 1024 -MinBuffers 512 -MaxBuffers 2048 -f <k.etl>`
2. A user session for the frames (present events only):
   `xperf -start kumm-present -on Microsoft-Windows-DXGI+Microsoft-Windows-DxgKrnl:0x1 -BufferSize 1024 -MinBuffers 64 -f <u.etl>`
3. The flight (`bench-flight.sh krinik-show <label>`), then `xperf -stop kumm-present -stop -d <merged.etl>`.
4. Hitches from the SAME trace: `PresentMon --etl_file <merged.etl> --process_name ConanSandbox-Win64-Shipping.exe --output_file <p.csv>` → frames ≥ 50 ms with their
   start time (alignment with xperf's µs clock checked on the first frame before trusting it).
5. Per hitch: `xperf -tle -i <merged.etl> -a profile -detail -range <T1> <T2>` (modules) and `-a activityintervals -thread -range <T1> <T2>` (threads).

## Run 1 — 2026-11-09 20:21–20:3x, front path, warm game (launch 20:18), one `krinik-show` flight

- Tools: `ConanExiles/_config/hitch-trace.ps1 -Label hitch-2` (kernel PROFILE+CSWITCH+DISPATCHER with stacks, 1024 KB × 512–2048 buffers) → 8.56 GB for ≈ 4 min;
  `ConanExiles/_config/hitch-analyze.py <etl> <live csv> <offset_us> <out.md> --top 30` — ONE xperf pass with 30 `-a profile -detail -range` actions.
- **PresentMon `--etl_file` found no presents** in this trace (the user session `DXGI + DxgKrnl:0x1` lacks what it needs). Alignment used instead: the live
  PresentMon CSV of `bench-flight.sh` + the PresentMon process start on the trace clock (`xperf -a process`: 41 443 705 µs; ran 175 s = the flight); window =
  [TimeInMs − MsBetweenPresents − 20 ms, TimeInMs + 20 ms] + offset.
- Flight: 55.7 FPS, 67 hitches ≥ 50 ms, worst 196.4 ms (tracing on — not comparable with untraced flights).
- **By module, the 30 longest hitches** (`_bench/wpr/2026-11-09_202122_hitch-2_breakdown.md`): the game exe ≈ 60 % of the game's samples in the window, `ntoskrnl.exe`
  ≈ 13 %, `nvwgf2umx.dll` (NVIDIA user driver) ≈ 12 %, `UE4SS.dll` 1–5 %, `D3D12Core` / `vcruntime140` / `ntdll` a few each — the SAME mix as the whole-flight average
  (exe 57 %, driver 15 %, kernel 14 %, UE4SS 3.4 %). No foreign module appears in a hitch: the hitch is the engine's own work being longer that frame.
- The module split cannot say which ENGINE work (no PDB). Next: (a) per-thread split in the hitch windows vs normal frames (`-a activityintervals -thread -range`
  or `-a cswitch`), to see whether the game thread computes or waits; (b) `ntoskrnl` functions with MS symbols (`-symbols`, `_NT_SYMBOL_PATH`) — page faults /
  file reads vs scheduling; (c) a baseline of normal 16 ms windows in the same pass.

## Run 1, deeper — the 196 ms hitch at flight 99.3 s (2026-11-09 20:3x)

- Thread split (`xperf -a dumper -range` over the window, `SampledProfile` rows by `ThreadID`): thread **29376 has 234 samples in the 236 ms window — busy the whole
  hitch** (computing, not waiting); every other game thread 34–81. 29376's start address is the exe's thread entry `+0x8988060` (the game thread by its load — to
  confirm by name: `ThreadName` rundown events are not in the window).
- 29376 by module: exe 173 · ntoskrnl 25 · UE4SS 13 · nvlddmkm 7 · vcruntime140 6 · ntdll 5. **102 of the 234 samples fall in ONE 256-byte loop** at
  exe RVA `0x26EEC30 … 0x26EEC67` (image base `0x7FF6950E0000` of the live process; `ConanExiles/_config/disasm-rva.py`, capstone 5.0.7):
  `subsd`/`mulsd` × 3 + `addsd` = **squared distance of two FVectors (3 doubles)**, `jb` against a threshold, `add rdx, 0x18` (stride 24 bytes = one FVector),
  `cmp rdx, rax; jne` — a **brute-force linear scan over an array of positions: "is any point within radius R"**, on the game thread, ~100 ms of one frame.
  A second block `+0x29F6DA0` (22 samples).
- **NAMED (2026-11-09 20:4x) — the AI navigation mesh (Recast) rebuild.** All 101 hot samples share ONE 14-frame call stack (the trace's `Stack` rows); the strings each
  caller references (`disasm-rva.py` around each return address) name the chain: `FRecastNavMeshGenerator::ProcessTileTasksAndGetUpdatedTiles` → tile build
  (`CreateHeightField: …`, `URecastNavMeshDataChunk::DetachTiles`) → `UNavigationSystemBase` / `UAISystemBase::InitializeActorsForPlay` → `UNavCollisionBase::ExportGeometry`
  → the squared-distance loop. The game rebuilds navmesh tiles as the world streams, and the geometry gathering for them runs ON THE GAME THREAD.
- Thread 29376 is the game thread: it is the busiest thread in a NORMAL 200 ms stretch too (195 of 200 samples), and **47 of those 195 (≈ 24 %) are the same
  navmesh loop** — on the flight the navmesh rebuild eats about a quarter of the game thread all the time, and a hundred milliseconds in the worst frame.
- `ai.nav.GNavmeshSynchronousTileGeneration` = 0 (read live 20:39, `LastSetBy: Constructor`) — the tile build itself is async; the game-thread part is the geometry
  gathering (UE: `ARecastNavMesh::bDoFullyAsyncNavDataGathering`, default false → gathering on the game thread). Levers to check next: that property (config of
  `/Script/NavigationSystem.RecastNavMesh`), `MaxSimultaneousTileGenerationJobsCount`, the runtime generation mode, `ai.navigation.MaxDirtyAreasCountWhileSuspended`.
  Caveat: the flight streams the world faster than a running hero — the share in real play is to be measured.
- The owner's questions 20:42 («навигационная сетка - это по которой мобы ходят?» · «поиск пути?» · «на CUDA её можно переписать? она к решению СЛАУ и перемножение
  матриц сводится?» · «или к работе с изображениями?») — answered: the navmesh is what NPCs walk on; path search over it is cheap and NOT the hot spot — BUILDING it
  is. Recast's build is voxel/image-like (rasterize triangles into a span heightfield → walkability filters → distance field → watershed regions → contours →
  polygons), not linear algebra; steps 1–2 are GPU-friendly (published GPU navmesh builders exist). Our hot spot comes before the build: the geometry gathering's
  O(n²)-looking squared-distance scan — a spatial grid / hash fixes such a loop on the CPU. Replacing a native function of the Shipping exe needs a UE4SS C++
  native hook (no source). Order (Pareto): engine settings first (async gathering, generation only around navigation invokers, rebuild budget per frame), the
  native rewrite only if they fail.
- **Live navmesh settings (remote read 2026-11-09 20:4x, `RecastNavMesh-Default` of `ConanSandbox`):** `RuntimeGeneration` 2 (Dynamic) · `MaxSimultaneousTileGenerationJobsCount`
  1024 · `TileSizeUU` 988 · `CellSize` 19 · `CellHeight` 10 · `AgentRadius` 32 · `TileNumberHardLimit` 1 048 576 · `bFixedTilePoolSize` true; `NavigationSystemV1`:
  `bGenerateNavigationOnlyAroundNavigationInvokers` **true** (already invokers-only) · `DataGatheringMode` 2 (**Lazy** — geometry gathered at tile-build time) ·
  `bAutoCreateNavigationData` true. Not readable by the remote (`?`): `bDoFullyAsyncNavDataGathering`, `bUseVirtualGeometryFilteringAndDirtying`, `bForceRebuildOnLoad`
  (absent in this build, or a bitfield the remote cannot read — check first: the class's property list).
- The owner 20:46 «ближе к работе с изображениями - ну так это щейдером решается» · «Аааааа, это RAM и L3 ?» — answered: the voxel / filter steps suit a compute
  shader, but that is a rewrite of UE's Recast inside the exe with no source (a project, not a quick win), and the hot spot is earlier (gathering). RAM / L3 —
  *hypothesis, not measured:* the loop streams an array of 24-byte points; the hottest sample sits right after the load (`subsd xmm2, [rdx+8]` → `add rdx, 0x18`
  holds 44 of 102 — load-latency skid); if the array exceeds the 5700G's 16 MB L3 the loop is memory-bound, which fits KAGO's RAM-timing gain on the flight
  (+2…+8 %). The fix is fewer comparisons (a spatial grid) or the gathering off the game thread (N1), not faster RAM. To measure: the array length (REA/Ghidra on
  the caller) or a PMU cache-miss counter (WPR has no PMU here; `xperf -pmc` LLC misses on the thread).
- **Read again 20:4x with `GetPropertyValue` (the bitfields):** `bDoFullyAsyncNavDataGathering` **false**, `bUseVirtualGeometryFilteringAndDirtying` false,
  `bForceRebuildOnLoad` false, `bRebuildAtRuntime` false (the earlier «?» was the reader's `ok and v or …` swallowing a `false`). The class has the property
  (`ForEachProperty`: also `InvokerTilePriorityBumpDistanceThresholdInTileUnits`, `InvokerTilePriorityBumpIncrease`, `bUseVirtualFilters`) → **quick-win candidate N1:**
  `[/Script/NavigationSystem.RecastNavMesh] bDoFullyAsyncNavDataGathering=True` in the game's Engine.ini before launch (the generator reads it at creation),
  A-B over launches like A1; read back live by `GetPropertyValue`; NPC pathing by eye (tiles may arrive a little later).
- **N1 first try 2026-11-09 20:49–20:53** (front path, the line appended to the game's `Saved/Config/Windows/Engine.ini`, read back live `true`; traced flight
  `hitch-3-n1`, 8.55 GB): hitches **39 vs 67** of the traced base `hitch-2` (−42 %), FPS 53.1 vs 55.7 (−5 %), worst frame **356 vs 196 ms**, CPU 16.84 vs 15.59 ms.
  ONE traced flight per side — not a verdict. The ini restored from the backup after (hash `E337D3FD9EE7…`, no `bDoFullyAsyncNavDataGathering` line); NOT shipped.
  Open: where the navmesh loop went (the game thread's share in `hitch-3-n1`: `hitch-analyze.py` with the PresentMon start of that trace) and what the 356 ms frame is.
- **N1 per-thread read (2026-11-09 21:0x, `ConanExiles/_config/hitch-threads.py`, the loop found by its low 16 address bits `0xEC30…0xEC67` — ASLR moves the image by
  64 KB; control: the base trace's 196 ms window → thread 29376, 102 in the loop ✓):** with N1 the navmesh loop has **0 samples on every thread** in both a normal
  200 ms window and the worst frame (base: 47 of the game thread's 195 in a normal window). The game thread (1148, busiest — 195 of 200) no longer runs it.
- **The N1 worst frame (356 ms at flight 106.05 s) is a different hitch — a whole-process freeze:** the game thread worked only ≈ 75 ms of the ≈ 396 ms window;
  at 147.202 s (trace clock) it switched out `Waiting / WrResource` and did not run again for ≈ 320 ms, and ALL game threads fell to 3–6 samples per 50 ms. Its
  last stack (147 201 524): exe → `UE4SS.dll` (≈ 28 frames, the Lua VM's nested calls — one of our Lua mods) → `ntdll`. *Hypothesis, not proven:* a synchronous
  write of a Lua mod (a log line) blocked on a file-system resource while the 8.5 GB ETL trace was being written to the same disk D: — an artifact of tracing,
  AND a real risk: our mods' detailed logs are written on the game thread. To check: the same window's `FileIo` events (add `FILE_IO+FILE_IO_INIT` to the kernel
  flags), the trace written to another disk (C: or F:), and which mod logs at that moment (UE4SS.log line times).
- **Next (a new chat):** (1) N1: untraced A-B-A-B launches (background path, as A1) — the per-thread read is DONE above; (2) candidates to A-B on flights AND on a running-hero route:
  `DataGatheringMode` Instant vs Lazy, async gathering on, fewer simultaneous jobs, a smaller invoker radius (the invokers' `TileGenerationRadius` /
  `TileRemovalRadius` on the hero and NPCs); (3) only then REA + Ghidra (`_tools/node24/rea/rea.cmd`, REA 6.8.0 installed; Ghidra 12.2 in `_tools/ghidra`) on
  `ExportGeometry` and the scan at RVA `0x26EEC30`.

## REA — the tool the owner pointed to (2026-11-09 20:35–20:36)
`[OWNER]` «найди в ГитХаб инструменты по статической рекомпиляции. Рея там есть, она тебе поможет» · «ты работаешь с бинарными вызовами» · «там почти 400000 звезд»
→ **`morluto/rea`** (≈ 446 k stars, MIT, npm `rea-agents`): «Reverse engineer anything with agents, from app behavior down to native binaries» — one MCP server +
CLI; native binaries → pseudocode, assembly, strings, symbols, calls and references through a provider: Hopper, **Ghidra**, IDA or Kuna. Needs Node 24.x ≥ 24.22.1
(this machine: 24.15.0 global — the owner's pm2 production server runs on it, so a PORTABLE Node in `_tools` for REA, the global one untouched). Java 21 is
installed (`C:\Program Files\Microsoft\jdk-21.0.11.10-hotspot`); Ghidra is not. Steps: portable Node → `npm i -g rea-agents` into its prefix → Ghidra from
the NSA GitHub release → `rea` native provider → the function at RVA `0x26EEC30`, its callers, its strings. `npx rea-agents setup` (the MCP for Claude Code) —
loads at the next session start.

## Gaps
- Alignment of PresentMon's frame times with xperf's `-range` clock — to be checked on the trace (step 4).
- Function names inside the exe are not available; a hot exe region can only be named by address range.
