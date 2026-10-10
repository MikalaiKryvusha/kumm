# Recon — GPU simulation, graph DBs and the mod↔process bridge (2026-10-08)

Scope: the open fork "compute the living world of Medieval Dynasty (UE 4.27, UE4SS Lua) **A: inside the game in Lua** or
**B: in a separate world-server process bridged to the game**". Machine: Windows 11, RTX 5070 Ti 16 GB (observed
`nvidia-smi` 2026-10-08 00:18: 16 303 MiB total, 3 865 MiB used with no game running), Ryzen 7 5700G 8C/16T, 32 GB.

Quote discipline: text in «» or "…" is verbatim from the source **as returned by the fetch tool**. Where only a search-engine
summary was available, the item is marked `[summary]` — treat it as a lead, not as a quote. Facts read directly from
source code are marked `[code]` with the file and tag.

> **Completeness note.** §2 (graph DBs), §3 (bridge) and §3a (CPU parallelism, folded in from a sub-research) are complete.
> §1 (GPU) is covered only to the depth I verified myself: the GPU sub-research with verbatim crowd-tech / CUDA-coexistence
> quotes had not returned when this file was handed back; its gaps are listed in "What I could not find".

---

## 1. GPU agent simulation

### 1.1 What exists
- **FLAME GPU 2** — general agent-based-modelling framework on CUDA. Paper: Richmond et al., *Software: Practice and
  Experience* 2023. `[summary]` "A benchmark model with millions of agents is used to explore the use of simulation
  ensembles"; "a billion simultaneously simulated individual agents is not beyond the realms of possibility"; and, key for
  us, a sub-modelling mechanism "essential in providing a mechanism to resolve competition for resources between agents
  within a parallel environment which would otherwise introduce race conditions".
  https://eprints.whiterose.ac.uk/199416/
  → Reading: even the GPU-ABM framework needs a special mechanism for *agents competing for the same resource* — exactly
  what a supply-chain economy is made of (two buyers, one sack of grain).
- **Flow fields** (Supreme Commander 2 origin) — `[summary]` "The algorithm computes a vector for every tile, such that a unit
  can follow the vectors and will end up at the goal"; flow fields "allow multiple agents to navigate towards a shared
  target without making individual pathfinding requests, making them ideal for crowd simulation".
  https://wildfiregames.com/forum/topic/16018-supreme-commander-2-pathfinding/ ·
  https://discussions.unity.com/t/nativeflowfield-gpu-powered-flow-field-generation/1676407
- **GPU flow-field generation in a game engine** — NativeFlowField (Unity): `[summary]` "generating 2D navigation flow
  fields on the GPU using compute shaders". https://github.com/nathanrun1/NativeFlowField
- **"Maps as textures" (influence maps / density / diffusion)** — the owner's "NPC movement across the world as an image on
  the GPU" is this family: a world grid where each cell holds a value (density, danger, scent of trade) and a stencil
  diffuses it every step. **Not verified in this pass with a quote** (see "What I could not find").

### 1.2 Good at / bad at (engineering reading, marked `[AI]`)
- `[AI]` Good: the *same* small rule over *many* cells or agents — diffusion of influence, density, flow to a common goal,
  crowd steering. Cost is per cell, independent of how many agents follow the field.
- `[AI]` Bad: branchy, heterogeneous per-agent decisions (a merchant choosing between 30 recipes, a lord weighing an alliance)
  and *contested resources* (FLAME GPU 2 itself needed sub-models for this — quote above). GPU warps execute in lock-step;
  divergent branches serialize. **Verbatim NVIDIA source for divergence not obtained in this pass.**
- `[AI]` Scale mismatch: our target is 5 000–20 000 subjects ticked **once per in-game hour**. A modern CPU core does millions
  of simple updates per second; 20 000 × a few hundred operations per tick is well inside one core per hour of game time.
  The GPU wins at 10⁶–10⁹ agents per frame, which is not our problem.

### 1.3 Cost of CUDA beside the game on the same GPU
- Observed: the card already holds 3.9 GB with no game; Medieval Dynasty's own VRAM use on the owner's settings is not
  measured yet (phase-0 measurement in `living-world.md` §5а).
- `[AI]` A CUDA context and the game's D3D context time-slice the same SMs; under WDDM a compute burst can delay a frame.
  A small LLM (3–8 B, 4-bit) needs several GB of VRAM and bursts the GPU during generation. **No verbatim source for
  frame-time impact obtained in this pass** — this must be *measured* (PresentMon, EXP-0019 tooling) rather than assumed.

---

## 2. Graph databases for game-world state

### 2.1 Candidates usable from a local process
| Engine | Status | What the source says |
|---|---|---|
| **Kuzu** (embedded, Cypher, C++) | **Archived** | `[summary]` "The GitHub repository was archived on October 10, 2025, the same day version 0.11.3 shipped as a final release"; Apple "had agreed on October 9, 2025 to acquire Kùzu Inc." https://www.puppygraph.com/blog/what-is-kuzudb · Fetched: "The Kuzu repository was archived on October 10, 2025, and is now read-only. The final release is v0.11.3" https://oneuptime.com/blog/post/2026-08-12-kuzu-archived-pin-0-11-3-fork-or-migrate/view |
| **RyuGraph** (Kuzu fork) | active | "Ryu is a fork of Kuzu, an embedded graph database originally developed by Kuzu Inc." · "it runs within your application process" · "Ryu maintains Kuzu's MIT license" https://docs.ryugraph.io |
| **LadybugDB** (Kuzu fork) | active | "LadybugDB is a embedded graph-oriented DBMS." https://dbdb.io/db/ladybugdb · "Ladybug's official repository explicitly says the database was formerly known as Kuzu" (quoted in the oneuptime article above) |
| **SQLite** recursive CTE | stable, everywhere | "A recursive common table expression can be used to write a query that walks a tree or graph." https://sqlite.org/lang_with.html · in-memory mode: "The database ceases to exist as soon as the database connection is closed." https://www.sqlite.org/inmemorydb.html |
| **DuckDB** recursive CTE + `USING KEY` | stable | "Semantically, `USING KEY` operates the union table as keyed state: the declared key columns identify a row…" https://duckdb.org/2026/08/25/how-duckdb-runs-recursive-ctes-faster · `[summary]` reachability query 4.051 s → 0.095 s (v1.5.5 → v2.0 preview), graph size not stated in what I read |
| **Neo4j** | server; embedded only for JVM | "This section describes how to use Neo4j embedded in Java applications" https://neo4j.com/docs/java-reference/current/java-embedded/ |
| **Memgraph** | server (Bolt), Linux; Windows via Docker/WSL | "Memgraph is an open-source in-memory graph database…" · "Memgraph uses two mechanisms to ensure the durability of stored data: write-ahead logging (WAL) and periodic snapshot creation." No embedded mode found. https://memgraph.com/docs/help-center/faq |

### 2.2 Latency (what numbers exist)
- kuzudb-study, **100 K nodes / ~2.4 M edges**, M3 MacBook Pro: second-degree path query Neo4j 3.2203 s vs Kuzu 0.0086 s;
  query 1: 1.7267 s vs 0.1603 s. https://github.com/prrao87/kuzudb-study
- `[AI]` Our world (≈20 000 subjects, maybe 100 000–300 000 edges: kinship, debts, routes, recipe inputs) is one to two orders
  of magnitude smaller than that dataset. At this size any of them — and a plain hash-map adjacency list in RAM — answers a
  2–3-hop query in micro- to milliseconds. **No benchmark at exactly our size found; measure.**

### 2.3 Games / sims that used a graph DB for world state
- **Brierley 2023 (Calgary thesis)**: "This thesis uses graph databases to enhance non-player character (NPC) behavior in
  computer games. The approach is tested in three discrete projects by developing and using the Neo4jConnector, a custom
  toolkit enabling novel bi-directional communication between real-time simulation data and server-based graph database
  long-term storage." https://ucalgary.scholaris.ca/items/61b8968d-8177-4814-a726-02413303c9db — note the split it names:
  **real-time simulation data** in the sim, the graph DB as **long-term storage**. Engine, NPC counts and latency are not on
  the landing page (the full PDF is ~260 MB, not read).
- **Gamesys, "Here Be Monsters" (MMORPG)**: "5000 items", "800 recipes", "500 locations", "1500 quests"; Neo4j was used to
  "model the in-game economy … and automate the balancing process" — by the fetched article, as an **offline designer tool**
  ("every item's intrinsic value in the game can be evaluated based on the values of its inputs"), not in the live game.
  https://www.theburningmonk.com/2015/04/modelling-game-economy-with-neo4j/ ·
  https://archive.oredev.org/2016/2016/sessions/modelling-game-economy-with-neo4j.html
  → Direct relevance: their recipe graph is the same shape as our "chains come from the game's recipe graph" rule (epic 15).
- **The Wayward Realms** — **CORRECTED 2026-10-08 00:23 (main session): wrong.** The devs state a graph database "built directly into Realm Engine … for handling quests" and GPU NPC movement (devlog https://www.youtube.com/watch?v=nuNqB2450go; see `recon-wayward-realms.md` and `../svarogs-dream/living-world/02b_rpg_worlds.md` §1). Original line: searched again — no source links it to a graph database; the only hit pairing the name with
  "graph" is Brierley's thesis, which does not mention it.

### 2.4 Would a plain in-memory graph do the same job?
- `[AI]` Yes for runtime. What a graph DB adds is a *query language* (Cypher) and *persistence*; what the living world needs
  each hour is "for each subject, look at neighbours, decide, write". That is an adjacency list + arrays. NetworkX-style
  libraries ("a Python package for the creation, manipulation, and study of the structure, dynamics, and functions of
  complex networks" https://networkx.org/documentation/stable/index.html) or hand-rolled maps are enough.
- `[AI]` A graph DB earns its place as the **designer's microscope** (Gamesys pattern: query the recipe/economy graph offline,
  find knock-on effects) and as **save/long-term store** (Brierley pattern), not as the hot loop.
- `[AI]` SQLite is already the safest "graph DB" for a single-user Windows tool: one file, recursive CTE for walks, no
  server, no abandoned-vendor risk (Kuzu).

---

## 3. Bridge: UE4SS Lua mod ↔ external process

### 3.1 What the UE4SS Lua runtime actually is (read from source)
- `[code]` Lua version at tag **v3.0.1**: `LUA_VERSION_MINOR "4"`, `LUA_VERSION_RELEASE "4"` → **PUC Lua 5.4.4**, not LuaJIT
  (`deps/first/LuaRaw/include/lua.h@v3.0.1`; main branch is 5.4.7). Lua is built as a **static** library
  (`deps/first/LuaRaw/xmake.lua`: `set_kind("static")`) and `LUA_BUILD_AS_DLL` is not defined, so `UE4SS.dll` does not
  export the Lua C API.
- `[code]` **All standard libraries are opened**: `Lua::open_all_libs()` calls `luaL_openlibs` (LuaMadeSimple.cpp), whose
  table includes `luaopen_package`, `luaopen_io`, `luaopen_os`, `luaopen_debug` (linit.c). `LuaMod.cpp@v3.0.1:3284`
  `lua.open_all_libs();`.
- `[code]` **`io.popen` exists on Windows**: `liolib.c` — `#elif defined(LUA_USE_WINDOWS)` → `#define l_popen(L,c,m) (_popen(c,m))`,
  and `luaconf.h` defines `LUA_USE_WINDOWS` for `_WIN32`. `[AI]` `_popen` spawns a console child and blocks the calling thread
  on reads — usable to *launch* the world server, not as a per-tick channel on the game thread.
- `[code]` **C modules (DLLs) are loadable via `require`**: `luaconf.h` sets `LUA_DL_DLL` under Windows, and UE4SS v3.0.1 appends
  to `package.cpath`: `;{mods}\{mod}\Scripts\?.dll` and `;{mods}\{mod}\?.dll` (`LuaMod.cpp@v3.0.1:825-831`). Changelog
  v2.5.1: "Fix typo in Lua cpath causing DLLs to not get found (Praydog)". https://github.com/UE4SS-RE/RE-UE4SS/blob/main/assets/Changelog.md

### 3.2 LuaSocket inside a UE4SS mod — field proof
- **MotorTownMods** (UE4SS Lua, dedicated-server tooling) ships a Lua HTTP server on LuaSocket: "For a full functionality of
  the mod, download and extract luasocket to `path/to/ue4ss/Mods/shared` directory to use the HTTP server." The binary is
  "luasocket 3.1 compiled for Windows with lua 5.4.7 libraries and includes".
  https://github.com/drpsyko101/MotorTownMods · https://github.com/alain-riedinger/luasocket/releases/tag/3.1-5.4.7
- Its loop (`Scripts/Webserver.lua`): `g_server:settimeout(0.05)` then `LoopAsync(1, function() … process(0.1) … end)` with
  the comment "Increasing the amount of process further decreases total latency but will block async thread by the amount
  * timeout". README: "Due to the webserver being ran on a separate thread, a stop command must be issued before reloading
  the mods." It also says "This mod uses a forked UE4SS release".
- **Risk I found by inspection** `[code/observed]`: the x64 `socket/core.dll` from that release imports only
  `KERNEL32`, `WS2_32`, the CRT — **no `lua54.dll`** — and contains `lua_newstate`, i.e. it carries **its own statically
  linked copy of Lua 5.4.7** and will operate on UE4SS's 5.4.4 state with a second copy of the Lua core. `[AI]` It works in
  the field for MotorTown, but it is a two-runtimes-one-state setup with a version mismatch; and it runs on `LoopAsync`,
  which UE4SS issue #168 calls crash-prone ("All async APIs will eventually crash because of this", quoted in
  `web-recon.md`). If we use a socket from Lua, poll it **non-blocking (`settimeout(0)`) from a game-thread timer**, never
  from `LoopAsync`.

### 3.3 C++ mods (CppMods) — the clean socket/pipe route
- A C++ mod is a DLL deriving from `RC::CppUserModBase`; build needs CMake/xmake, VS 2022 and "an Epic Games account linked
  to GitHub with access to Unreal Engine source code" (docs). https://docs.ue4ss.com/dev/guides/creating-a-c++-mod.html
- `[code]` `CppUserModBase.hpp@v3.0.1` offers `on_update()`, `on_unreal_init()` and `on_lua_start(…)` — the latter hands the
  C++ mod "the main Lua thread instance", the async instance and "a container of Lua instances that are used for game-thread
  hooks like ExecuteInGameThread". → `[AI]` a C++ mod can own a named pipe / socket / shared-memory ring buffer on its own
  thread and **register plain Lua functions** (`WorldBridge.poll()`, `WorldBridge.send(json)`) into our Lua mod — no
  foreign Lua copy, no LuaSocket.
- `[code]` `UE4SSProgram.cpp@v3.0.1:865-936`: `on_update` is fired from the thread named `"UE4SS-UpdateThread"` in a loop
  ending with `std::this_thread::sleep_for(std::chrono::milliseconds(5))` — **not the game thread**. Anything touching
  UObjects must still be marshalled to the game thread.

### 3.4 Game-thread timers available in the build Medieval Dynasty mods ship
- Mods on Nexus bundle "UE4SS v3.0.1-1152-ge3ba1016" (web-recon.md). `[code]` commit `e3ba1016` is dated 2026-09-29 and its
  `LuaMod.cpp` contains `ExecuteInGameThreadWithDelay` (15 matches). Changelog (v4.0.0-rc1 section): "Added comprehensive
  Delayed Action System for game-thread timer management" incl. `LoopInGameThreadWithDelay(delayMs, callback)` and
  `ExecuteInGameThreadAfterFrames(frames, callback)`. → the polling pattern of our ConsoleBridge v2 is available there.
  Plain tag v3.0.1 has only `ExecuteInGameThread`, `ExecuteAsync`, `ExecuteWithDelay`, `LoopAsync`.

### 3.5 Our own proven channel: the file bridge (EXPERIENCE.md EXP-0020)
- ConsoleBridge (Palworld): every 2 s reads `in.txt`, executes lines, writes `out.txt`. v1 on `LoopAsync` was replaced
  because a neighbour mod documented Lua-state corruption from async loops; v2 runs on `ExecuteInGameThreadWithDelay` with
  the timer re-armed **at the end** of processing; positive control passed ("движок вернул наши неванильные 2.6/6.0").
  Source: `D:\work\ai_sandbox\Palworld\_unpacked\ConsoleBridge\Scripts\main.lua`. Latency = poll period (2–4 s observed).
- `[AI]` For an hourly in-game tick (Medieval Dynasty's game hour is minutes of real time) a 1–2 s file poll is **already
  fast enough**; the bridge's latency is not the bottleneck.

### 3.6 Latency of each channel (orders of magnitude)
| Channel | Number | Source |
|---|---|---|
| File poll (our bridge) | 2–4 s (poll period) | EXP-0020 |
| TCP loopback | 70 221 msg/s at 100 B (≈14 µs/msg) | ipc-bench, "Intel(R) Core(TM) i5-4590S … Ubuntu 20.04.1 LTS" https://github.com/goldsborough/ipc-bench |
| Named pipes (FIFO) | 265 823 msg/s at 100 B | same, Linux |
| Shared memory | 4 702 557 msg/s at 100 B | same, Linux |
| Windows-specific numbers | not verified | — |

`[AI]` Every channel except the file poll is microseconds; the real cost is the **game-thread work** of applying the result
(spawning/teleporting actors, writing properties), which is identical in A and B.

---

## 3a. CPU-side parallel simulation on 16 threads (owner's requirement: never choke the game thread)

### (a) UE4SS Lua threading — verified facts
- `[code]` One Lua state per mod plus helper states: `on_lua_start` documents "the main Lua thread instance", "the Lua
  instance for asynchronous things like ExecuteAsync and ExecuteWithDelay" and "Lua instances that are used for
  game-thread hooks like ExecuteInGameThread" (`CppUserModBase.hpp@v3.0.1`).
- Async APIs share state across OS threads and crash — issue #168: "Currently async APIs will execute the same lua_state in a
  separate OS thread. … All async APIs will eventually crash because of this." https://github.com/UE4SS-RE/RE-UE4SS/issues/168
  · issue #1345: "Lua runs concurrently from the async thread and the game thread". https://github.com/UE4SS-RE/RE-UE4SS/issues/1345
- `ExecuteInGameThread` "executes code on the game thread using either the ProcessEvent hook or the EngineTick hook";
  `LoadAsset` "Must only be called from within the game thread." (both quoted in `web-recon.md`).
- `[AI]` Consequence: **option A has exactly one usable thread for simulation — the game thread.** Lua coroutines are
  cooperative (same thread), so the only A-side defence is *time-slicing*: process N subjects per frame within a budget
  (e.g. ≤1 ms), spreading the hourly tick across many frames. There is no way to use the other 15 hardware threads from
  UE4SS Lua safely.

More on UE4SS (sub-research, quotes as returned by the fetch tool):
- #168 adds: "Two instances of lua_newthread for the same lua_state cannot be safely used from two OS threads, as you corrupt
  memory if a simultaneous allocation, GC occurs, or access occurs." https://github.com/UE4SS-RE/RE-UE4SS/issues/168
- #1345: "`main_lua`, `hook_lua` and `async_lua` are all `lua_newthread()` coroutines off one lua_State, so they share one
  global_State and one GC… Two threads in one global_State, no lock." https://github.com/UE4SS-RE/RE-UE4SS/issues/1345
- `[code]` v3.0.1 `LuaMod.cpp`: `m_lua(LuaMadeSimple::new_state())` per mod; `mod->m_async_lua = &lua.new_thread();` — one
  state per mod, async/main/hook are coroutines of it.
- Main-branch docs (planned 4.x): LoopAsync "is deprecated in favor of `LoopInGameThreadWithDelay`"; "All delayed actions
  execute on the game thread". https://raw.githubusercontent.com/UE4SS-RE/RE-UE4SS/main/docs/lua-api/global-functions/delayedactions.md
- Lua 5.4 manual: "Unlike threads in multithread systems, however, a coroutine only suspends its execution by explicitly
  calling a yield function." https://www.lua.org/manual/5.4/manual.html

### (b) Parallel patterns in an external process
| Pattern | Quote | Source |
|---|---|---|
| Unity Job System | "lets you create multithreaded code so that your application can use all available CPU cores"; "The job system sends each job a copy of the data it needs … which eliminates the race condition." | https://docs.unity3d.com/Manual/job-system-overview.html |
| Burst | "Compile compatible sections of your C# code into highly-optimized native CPU code." | https://docs.unity3d.com/Packages/com.unity.burst@1.8/manual/index.html |
| Bevy ECS | "uses this 'data access' information to determine what Systems can run in parallel with each other"; the parallel executor runs "as many of them in parallel as possible" | https://docs.rs/bevy_ecs/latest/bevy_ecs/ |
| flecs | "divides the number of matched entities across the threads"; "The same entity is always processed by the same thread, until the next sync point"; writes "are enqueued as commands" flushed at sync points | https://www.flecs.dev/flecs/Systems.html |
| EnTT | "the entire registry is not thread safe as it is"; views can be combined "with std::for_each and std::execution::par" | https://github.com/skypjack/entt/wiki/Entity-Component-System |
| Rust rayon | "a data-parallelism library that makes it easy to convert sequential computations into parallel"; "guarantees data-race free executions" | https://docs.rs/rayon/latest/rayon/ |
| C# Parallel.For | "When the matrix is small, the sequential version will run faster because of the overhead in setting up the parallel loop." | https://learn.microsoft.com/en-us/dotnet/standard/parallel-programming/how-to-write-a-simple-parallel-for-loop |
| Python GIL | "only one thread executes Python bytecode at a time… at the expense of much of the parallelism"; 3.14: "PEP 779: Free-threaded Python is officially supported", single-thread penalty "roughly 5-10%"; multiprocessing is "side-stepping the Global Interpreter Lock by using subprocesses" | https://docs.python.org/3/glossary.html · https://docs.python.org/3/whatsnew/3.14.html · https://docs.python.org/3/library/multiprocessing.html |
| Double Buffer | "Cause a series of sequential operations to appear instantaneous or simultaneous."; "We want to prevent the code that's accessing the state from seeing the work in progress." | https://gameprogrammingpatterns.com/double-buffer.html |
| Counter-based RNG (Random123) | "Most pseudorandom number generators (PRNGs) scale poorly to massively parallel high-performance computation because they are designed as sequentially dependent state transformations… independent, keyed transformations of counters produce a large alternative class of PRNGs" | https://hgpu.org/?p=6092 (abstract, Salmon et al. SC11) |

`[AI]` The design these converge on, for our scale: **double-buffered state** (read tick *t*, write tick *t+1*) so every
subject's update is independent; **partition by village/region** (flecs/Factorio: groups that do not interact run in
parallel) for writes that cross subjects — market clearing per settlement in parallel, then a short sequential exchange
step between settlements; **per-subject RNG keyed by (world seed, subject id, tick)** (Random123 idea) so a parallel run
replays bit-for-bit regardless of scheduling. And per the C# note: at 20 000 subjects/hour, *measure before parallelising*
— overhead can exceed the work.

### (c) How shipped games multithread their simulations
- **Factorio** — FFF #215: updating trains, electric network and belts in parallel: "the parallel version didn't speed
  things up, it was actually even slower" because "the threads are invalidating each others cache all the time"
  (https://factorio.com/blog/post/fff-215). FFF #271: fluids parallelised once "independent and fluid flow doesn't interfere
  with anything else in the map" (https://factorio.com/blog/post/fff-271). FFF #364: belts grouped so "lines from one group
  don't interact with any line from any other group"; "Transport belt update times dropped from 4ms to 1.6ms"
  (https://factorio.com/blog/post/fff-364). FFF #421 (2.0 electric network): "the electric network update time remained the
  same while the CPU usage went significantly up"; "the game needs to remain fully deterministic or a desync would happen"
  (https://factorio.com/blog/post/fff-421). **Could not parallelise:** memory-bound and cross-coupled systems.
- **Dwarf Fortress** — Tarn Adams 2021: "If we're talking about asynchronous as in multithreading, then no, we don't do any of
  that, aside from the graphical display itself."; "We are certainly at the edge of what we can currently support in terms
  of agents and map complexity" (https://stackoverflow.blog/2021/07/28/700000-lines-of-code-20-years-and-one-developer-how-dwarf-fortress-is-built/).
  v50: "there will also be a multithreading option. It's off by default…" (https://www.bay12games.com/dwarves/); 50.09:
  "Experimental multithreading is available from game settings." (https://lemmy.world/post/848045). Which systems it covers —
  unverified.
- **X4: Foundations** — PCGH (German): only near units get "High Attention Mode"; for all others "wird die Präzision der
  Simulation und deren Aktualisierungsrate reduziert ("Low Attention Mode")"
  (https://www.pcgameshardware.de/X4-Foundations-Spiel-61270/Specials/Timelines-DLC-Update-Vulkan-Tech-Test-Release-1449923/galerie/3896065/).
  Egosoft: "We do strive to keep IS and OOS calcuations as close as they can be (usually limited by performance)."
  (https://forum.egosoft.com/viewtopic.php?p=4658338). X Rebirth (predecessor): "two cores can crunch on our two main
  threads … More cores will unfortunately not help much at this point in time." (https://forum.egosoft.com/viewtopic.php?p=4199428).
- **Cities: Skylines 1** — modding API: `OnBeforeSimulationTick` "Thread: Simulation … 60 times per second"; `OnUpdate`
  "Thread: Main Called once per rendered frame"; hand-off via `QueueMainThread()` / `QueueSimulationThread()`
  (https://skylines.paradoxwikis.com/Modding_API). → a separate simulation thread exchanging work with the main thread is
  exactly our option B in-process.
- **Cities: Skylines 2** — "seems to use DOTS to great effect as the game makes use of multiple CPU cores much more
  efficiently than its predecessor"; launch problems were GPU ("121 million input vertices…")
  (https://blog.paavo.me/cities-skylines-2-performance/). CO's CTO: "What matters more with this type of game is to avoid
  stutters, and have responsive UI." (https://insider-gaming.com/why-isnt-cities-skylines-2-60-fps/).
- **Bannerlord** — patch notes 2020-06-21: "Better balanced resource usage of parallel tasks has led to increased multi-core
  performance and much smoother gameplay." (https://www.gamebanshee.com/3dh6p). No statement on a campaign-map thread found.

---

## 4. Synthesis `[AI]` — A: all in Lua vs B: world server + bridge

Assumptions: 5 000–20 000 subjects, ticked once per in-game hour; the game shows only the subjects near the player
(A-Life two-tier pattern, `web-recon.md` recommendation 1).

| Criterion | A: all in UE4SS Lua | B: world server + bridge |
|---|---|---|
| Threads available for the sim | **1 (game thread)**; async Lua crashes (#168) | all 16; game thread only applies results |
| FPS risk | tick must be time-sliced across frames, else a hitch every game hour | near zero for the sim; same apply-cost on game thread as A |
| Raw speed | PUC Lua 5.4.4 interpreter (no JIT) | native / JIT language, 10–100× more per core [AI estimate, unmeasured] |
| Install / ship | one mod folder | mod + exe + launch (io.popen can start it) + crash handling |
| Determinism & testing | needs the game running | "run 100 game-days headless" test bench without the game |
| Graph DB / GPU / LLM | none | any (SQLite/Ryu/Ladybug; CUDA; llama.cpp) |
| Save sync | lives in game save / mod files | **two sources of truth** — must be versioned with the game save |
| Bridge | none | file poll (proven, EXP-0020) → C++ mod pipe if needed |
| Parallelism model | time-slicing on one thread only (coroutines are cooperative) | double buffer + region partitions + keyed RNG on a job system (rayon / flecs / Bevy / Unity Jobs / .NET) — Factorio shows gains come only from *non-interacting* groups |
| Precedent | DF: single-threaded for 20 years, "at the edge" of agent count | CS1 separate sim thread at 60 ticks/s; X4 low-attention OOS sim; CS2 DOTS multi-core |

**Recommendation (for this scale):** B with the *simplest* parts — a native world-server process, plain in-memory arrays +
adjacency lists, double-buffered tick, SQLite file as the save/long-term store, file bridge first. Keep A as a *fallback*
only if the 20 000-subject hourly tick in Lua fits in ≤1 ms per frame when sliced. GPU and graph-DB server are **not**
needed at 20 000 subjects/hour; the LLM, if any, belongs to the world's *speech* (rumours, chronicle), not to the economy
(see `living-world.md` §5а).

**What to measure first (phase 0), in this order:**
1. Medieval Dynasty frame time and VRAM on the owner's settings (PresentMon, `_tools/`) — baseline; decides whether any GPU
   co-tenant (CUDA, LLM) is even on the table.
2. Lua cost: a synthetic 20 000-subject tick in UE4SS Lua 5.4 on the game thread (pure tables, no UObject calls) — ms per
   tick; then per-frame slice budget.
3. Same tick in the candidate server language on 1 and 16 threads.
4. Bridge round trip: file poll at 250 ms / 1 s vs a C++-mod named pipe — only if the file poll proves too slow.
5. Apply-cost on the game thread: spawning/moving N actors near the player (the true FPS risk in both A and B; spawn crash
   issue #527 in `web-recon.md`).

---

## What I could not find
- ~~Any source tying **The Wayward Realms** to graph databases or to GPU movement simulation~~ — CORRECTED 2026-10-08 00:23: found, see `recon-wayward-realms.md`.
- Verbatim NVIDIA text on warp divergence, WDDM time-slicing of CUDA vs D3D, frame-time impact of CUDA/LLM beside a game.
- Verbatim crowd-tech sources for Total War, Planet Coaster, Cities: Skylines, Unity DOTS scale numbers (GPU sub-research not returned).
- Official X4 statement on its own threading (only X Rebirth's); Bannerlord campaign-map thread; CS2 official dev diary on
  DOTS; which DF v50 systems are multithreaded; rayon ordering/determinism statement; EnTT "no scheduler" sentence.
- Any UE4SS statement that Lua mods can create worker threads (none exists in docs; source shows they cannot safely).
- Windows-specific IPC latency benchmark (only a Linux one found).
- Brierley thesis internals (engine, NPC count, latency) — full PDF ~260 MB not read.
- A graph-DB benchmark at our size (~20 k nodes).

## Sources
- https://eprints.whiterose.ac.uk/199416/ (FLAME GPU 2)
- https://wildfiregames.com/forum/topic/16018-supreme-commander-2-pathfinding/ · https://discussions.unity.com/t/nativeflowfield-gpu-powered-flow-field-generation/1676407 · https://github.com/nathanrun1/NativeFlowField
- https://www.puppygraph.com/blog/what-is-kuzudb · https://oneuptime.com/blog/post/2026-08-12-kuzu-archived-pin-0-11-3-fork-or-migrate/view
- https://docs.ryugraph.io · https://dbdb.io/db/ladybugdb
- https://sqlite.org/lang_with.html · https://www.sqlite.org/inmemorydb.html
- https://duckdb.org/2026/08/25/how-duckdb-runs-recursive-ctes-faster
- https://neo4j.com/docs/java-reference/current/java-embedded/ · https://memgraph.com/docs/help-center/faq
- https://github.com/prrao87/kuzudb-study
- https://ucalgary.scholaris.ca/items/61b8968d-8177-4814-a726-02413303c9db
- https://www.theburningmonk.com/2015/04/modelling-game-economy-with-neo4j/ · https://archive.oredev.org/2016/2016/sessions/modelling-game-economy-with-neo4j.html
- https://networkx.org/documentation/stable/index.html
- https://github.com/UE4SS-RE/RE-UE4SS (source read at tag v3.0.1, commit e3ba1016 and main: `deps/first/LuaRaw/*`, `deps/first/LuaMadeSimple/src/LuaMadeSimple.cpp`, `UE4SS/src/Mod/LuaMod.cpp`, `UE4SS/include/Mod/CppUserModBase.hpp`, `UE4SS/src/UE4SSProgram.cpp`, `assets/Changelog.md`)
- https://github.com/UE4SS-RE/RE-UE4SS/issues/168 · https://github.com/UE4SS-RE/RE-UE4SS/issues/1345
- https://docs.ue4ss.com/dev/guides/creating-a-c++-mod.html
- https://github.com/drpsyko101/MotorTownMods · https://github.com/alain-riedinger/luasocket/releases/tag/3.1-5.4.7
- https://github.com/goldsborough/ipc-bench
- Local: `D:\work\ai_sandbox\KUMM\EXPERIENCE.md` EXP-0020 · `D:\work\ai_sandbox\Palworld\_unpacked\ConsoleBridge\Scripts\main.lua` · `researches/medieval-dynasty/web-recon.md` · `researches/medieval-dynasty/living-world.md`

---

## Essence (Pareto)
- **Two tiers: abstract records far away, real actors only near the player** · cost scales with what is *visible*, not with world size · A-Life pattern, `web-recon.md` rec. 1; Dwarf Fortress off-screen sim (`living-world.md`).
- **Coarse tick (once per game hour) over plain arrays** · 20 000 × simple update/hour is trivial for one CPU core · `[AI]` arithmetic; Gamesys modelled a 5 000-item/800-recipe economy as one graph (theburningmonk).
- **Double-buffered state + per-subject keyed RNG** · independent updates parallelise and replay bit-for-bit · Nystrom "Double Buffer"; Random123 (Salmon et al.); Factorio determinism rule (FFF #421).
- **Parallelise only non-interacting groups (villages/regions)** · no cache ping-pong, no locks · Factorio FFF #364 (belts 4 ms → 1.6 ms) vs FFF #215 (parallel slower).
- **Low-attention far simulation** · fewer, coarser updates where nobody looks · X4 "Low Attention Mode" (PCGH), Egosoft OOS.
- **Time-slice whatever runs on the game thread** · bounded ms per frame, no hourly hitch · UE4SS: only the game thread is safe (#168, `ExecuteInGameThread` docs).
- **Process outside, apply inside** · sim gets all cores; game thread only applies diffs · UE4SS `on_update` runs on its own "UE4SS-UpdateThread" (`UE4SSProgram.cpp@v3.0.1`).
- **File bridge first** · zero dependencies, already proven with positive control · EXP-0020.
- **Graph as a design microscope, SQLite as the store** · queries/knock-on analysis offline, durable single-file save · Gamesys (offline Neo4j), Brierley (graph DB as "long-term storage"), SQLite recursive CTE docs.
- **Flow/influence fields for crowd movement only if crowds appear** · cost per cell, not per agent · Supreme Commander 2 flow fields `[summary]`.

## Over-engineering traps
- **Graph DB in the hot loop** — sources use it for long-term storage (Brierley) or offline balancing (Gamesys), not per-tick.
- **Betting on Kuzu** — archived 2025-10-10; only community forks continue.
- **CUDA for 20 000 hourly subjects** — GPU ABM pays off at millions of agents; contested resources need special machinery even in FLAME GPU 2.
- **LuaSocket via `LoopAsync`** — async Lua state crashes (#168); the field build also carries a second Lua runtime.
- **A C++ mod before the file bridge is measured too slow** — needs UE source access and a toolchain; latency is not our bottleneck at hourly ticks.
- **LLM deciding the economy** — economy must balance by accounting; LLM belongs to the world's speech (`living-world.md` §5а).
- **Parallelising coupled systems** — Factorio's parallel trains/power/belts ran slower; 2.0 power network burned CPU for no gain.
- **Threads for tiny workloads** — Microsoft: small loops run faster sequentially; measure the single-thread tick first.
- **Python threads for the sim** — GIL unless the free-threaded 3.14 build; use processes or a compiled language.
