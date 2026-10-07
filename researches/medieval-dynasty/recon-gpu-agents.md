# Recon — GPU agent simulation beside a game (2026-10-08)

> Conspect of the GPU sub-agent's hand-back (helper of `recon-gpu-graph-bridge.md`, whose §1 was written before this
> arrived). 38 quoted facts; the sub-agent reports each quote confirmed by fetching the page itself (WebFetch, or raw
> page/PDF text via curl/pdftotext + grep). Not re-verified by the main session except where marked. Living-world epic —
> `plans/15_EPIC_medieval_dynasty_living_world.md`, fork «где считается мир» (`living-world.md` §5а).

## Bottom line for the decision

- **Too few agents for the GPU.** 5k–20k subjects at one thread each is a small population by FLAME GPU 2's own standard:
  the mapping "is unable to provide sufficient parallelism for modern GPUs" (§4.4).
- **Mixed, branchy per-agent logic is the GPU's weak spot** — divergent paths run one after another (§4.1–4.5).
- **Sharing the GPU with a game on Windows costs**: separate CUDA contexts time-slice (§5.1); MPS is Linux/QNX only
  (§5.3); GeForce has no TCC (§5.4); NVIDIA's own way to run AI beside rendering needs a D3D12 queue and hardware GPU
  scheduling (§5.7–5.8). UE 4.27 commonly runs D3D11 — **not checked for Medieval Dynasty** (it offers a DirectX 12
  rendering mode in its graphics menu — seen on the owner's screen 2026-10-07 23:41, «Режим рендеринга DirectX 12»).
- **FLAME GPU 2 is AGPL-3.0** (§1.5) — matters if shipped inside a mod.
- **Commercial precedent is "fields + AI level of detail", not GPU agents**: Supreme Commander 2 shared flow fields on the
  CPU; influence maps compute once for all; Assassin's Creed Unity — 10,000 crowd NPCs with 40 real AIs (§2, §3.4).

## 1. FLAME GPU 2
- 1.1 https://github.com/FLAMEGPU/FLAMEGPU2 — "FLAME GPU is a GPU accelerated agent-based simulation library for domain
  independent complex systems simulations."
- 1.2 https://eprints.whiterose.ac.uk/199416/ (Richmond et al., SPE 53(8):1659-1680, doi 10.1002/spe.3207): "a benchmark
  model with millions of agents is used to explore the use of simulation ensembles" · "Performance speedups are
  demonstrated of 3.5 and 10 respectively over a baseline GPU implementation." · "a classical socio-economics model,
  Sugarscape, with populations of up to 16M agents."
- 1.3 README: "`>= 12.0` (Linux) or `>= 12.4` (Windows)" · "A Compute Capability `>= 5.0` (CUDA 12.x) or `>= 7.5` (CUDA
  13.x) NVIDIA GPU is required for execution." · "Microsoft Visual Studio 2022/2026 (Windows)"
- 1.4 README: "FLAME GPU 2 is currently in an pre-release (release candidate) state"
- 1.5 https://raw.githubusercontent.com/FLAMEGPU/FLAMEGPU2/master/LICENSE.md — "GNU AFFERO GENERAL PUBLIC LICENSE Version 3"
- 1.6 https://docs.flamegpu.com/ lists "Function flamegpu::detail::wddm::deviceIsWDDM()"

## 2. Flow fields and "maps as textures"
- 2.1 Emerson, Supreme Commander 2 — http://www.gameaipro.com/GameAIPro/GameAIPro_Chapter23_Crowd_Pathfinding_and_Steering_Using_Flow_Field_Tiles.pdf:
  "solves the computational problem of moving hundreds to thousands of individual agents across massive maps" · "all
  without the heavy CPU burden of repeatedly rebuilding individual paths for each agent."
- 2.2 Same: "each grid square is 1 × 1 meter and each sector holds 10 × 10 grid squares" · "The integration field is a 24-bit
  field where the first 16 bits is the total integrated cost amount and the second 8 bits are used for integration flags"
- 2.3 Same: "You can enforce low CPU usage by capping the number of tiles or grid squares you commit to per tick." · future
  work: "Build out the flow field using the GPU instead of the CPU [Ki Jeong 07]." · "this method is computationally
  cheap, compared with individual unit pathfinding requests"
- 2.4 Continuum Crowds (Treuille, Cooper, Popović 2006) — https://grail.cs.washington.edu/projects/continuum-crowds — "a
  dynamic potential field simultaneously integrates global navigation with moving obstacles such as other people,
  efficiently solving for the motion of large crowds without the need for explicit collision avoidance."
- 2.5 Dave Mark, Game AI Pro 2 ch. 30 — http://www.gameaipro.com/GameAIPro2/GameAIPro2_Chapter30_Modular_Tactical_Influence_Maps.pdf:
  "By calculating and storing this information once for all characters, it prevents the expensive and possibly redundant
  calculation of information by each individual agent." · "we updated tactical influence maps once per second" ·
  "influence maps can be used on a variety of scales for things such as strategic or ecological uses--for example, the
  positioning of armies on a map or guiding the habitats and migrations of creature" · "a small change in the
  granularity of cells can result in a massive change in the number of cells (and therefore the memory footprint and
  calculation time)"
- 2.6 https://github.com/nathanrun1/NativeFlowField — "generating 2D navigation flow fields on the GPU using compute shaders
  and native collections ... suitable for thousands of agents operating in dynamic environments." · "flow fields ...
  allow multiple agents to navigate towards a shared target without making individual pathfinding requests."
- 2.7 https://github.com/unitycoder/BoidsUnity — "brute force method would cap out at around 50k entities even on GPU" ·
  on a "9700k/2070 Super": "Burst/Jobs: ~150k", "GPU 3D: ~500k when rendering 3d models", "GPU 2D: ~16 million".

## 3. Commercial crowd tech
- 3.1 Unity Megacity — https://www.dsogaming.com/news/unity-engine-megacity-tech-demo-is-now-available-for-download/ —
  "Megacity contains 4.5 million mesh renderers, 5000 dynamic vehicles and 200,000 unique building objects." · "there are
  100,000 unique audio sources"
- 3.2 Cities: Skylines limits (a player's in-game readout, not official) —
  https://steamcommunity.com/app/255710/discussions/0/152390648082792963 — "Citizen Instances [65536]" · "Citizens
  [1048576]" · "Vehicles Active [16384]".
- 3.3 Same thread — agents "are constantly monitored by the game and use up all of your computer's resources" — WebFetch
  summary wording, not re-confirmed.
- 3.4 Assassin's Creed Unity, GDC 2015 — https://gdcvault.com/play/1022141/Massive-Crowd-on-Assassin-s — "a new technique of
  AI level of detail that has allowed us to create thousands of replicated, persistent, interactive NPCs" · "With the
  limit of 40 real AIs and 120 high resolution models, we could successfully create a scene where 10,000 crowd NPCs are on
  screen at the same time."

## 4. What the GPU is bad at
- 4.1 CUDA C++ Programming Guide 12.6, SIMT — https://docs.nvidia.com/cuda/archive/12.6.0/cuda-c-programming-guide/index.html —
  "If threads of a warp diverge via a data-dependent conditional branch, the warp executes each branch path taken,
  disabling threads that are not on that path." · "the warp serially executes each branch disabling threads not on that path."
- 4.2 Best Practices Guide — https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/index.html — "If this happens, the
  different execution paths must be executed separately; this increases the total number of instructions executed for
  this warp."
- 4.3 FLAME GPU 2 paper (heterogeneous models): "Heterogeneity is problematic for GPU simulation as it has the potential to
  introduce code divergence within the vector lanes (warps)."
- 4.4 Same: "the traditional mapping of a single agent to a single GPU thread is unable to provide sufficient parallelism
  for modern GPUs when considering small populations sizes." · fix: "FLAME GPU 2 allows the specification of model ensembles."
- 4.5 Richmond & Chimeh 2018 — https://eprints.whiterose.ac.uk/128797/ — "the divergence problem, i.e. the challenge of
  executing the behaviour of non-homogeneous individuals on vectorised GPU processors"; fix: "a measured speedup of over 4x".
- 4.6 https://n8cir.org.uk/case-studies/bede/paul-richmond/ — challenges: "Agents are heterogeneous", "Agents are born or
  die, leading to sparse data layouts", "GPU programming is hard".

## 5. CUDA beside a game on the same GPU (Windows)
- 5.1 CUDA Guide 12.6 — "A kernel from one CUDA context cannot execute concurrently with a kernel from another CUDA
  context. The GPU may time slice to provide forward progress to each context. If a user wants to run kernels from
  multiple process simultaneously on the SM, one must enable MPS."
- 5.2 Same — "there will be context switch overheads associated with Compute Preemption, which is automatically enabled on
  those devices for which support exists."
- 5.3 https://docs.nvidia.com/deploy/pdf/CUDA_Multi_Process_Service_Overview.pdf — "MPS is only supported on the Linux and
  QNX operating systems. The MPS server will fail to start when launched on an operating system other than Linux."
- 5.4 https://docs.nvidia.com/cuda/cuda-installation-guide-microsoft-windows/index.html — "The WDDM driver model is used for
  display devices." · "NVIDIA GeForce GPUs (excluding GeForce GTX Titan GPUs) do not support TCC mode." · CUDA Guide: "TCC
  mode removes support for any graphics functionality."
- 5.5 https://devblogs.microsoft.com/directx/hardware-accelerated-gpu-scheduling/ — "Windows continues to control
  prioritization and decide which applications have priority among contexts. We offload high frequency tasks to the GPU
  scheduling processor, handling quanta management and context switching of various GPU engines."
- 5.6 https://learn.microsoft.com/en-us/windows-hardware/drivers/display/timeout-detection-and-recovery — "The default
  timeout period in Windows is two seconds."
- 5.7 NVIGI "GPU Scheduling for AI" — https://docs.nvidia.com/nvigi-sdk/1.3.0/docs/nvigi_core/docs/GpuSchedulingForAI.html —
  "when you add AI compute to a game it is essential to configure the GPU scheduler to minimize the effect on the game's
  frame rate." · "NVIGI's GPU scheduling uses D3D async compute for D3D plugins and CUDA in Graphics (CIG) for CUDA
  plugins." · "(*) CUDA requires that Hardware scheduling be enabled in Windows 10 and 11. Windows 11 has hardware
  scheduling enabled by default." · "CUDA Compute In Graphics contexts are not compatible with compute-only CUDA
  contexts... So using multiple CUDA contexts in a game is not recommended."
- 5.8 https://developer.nvidia.com/blog/bring-nvidia-ace-ai-characters-to-games-with-the-new-in-game-inference-sdk — "AI
  workloads in games run alongside rendering tasks, so effective GPU scheduling is crucial to maintain frame rates." ·
  sample calls "enableComputeInGraphics(d3d12Params)".
- 5.9 https://raw.githubusercontent.com/ggml-org/llama.cpp/master/tools/quantize/README.md — "memory and disk requirements
  are the same." · Llama 3.1 row: "8B | 32.1 GB | 4.9 GB" (original | Q4_K_M).
- 5.10 https://ollama.com/library/llama3.2 — "llama3.2:3b 2.0GB", "llama3.2:1b 1.3GB" (download sizes; context cache extra).

## Not found or unverified
- Planet Coaster crowd simulation (fluid dynamics instead of pathfinding): only search snippets; sources returned 403.
- Total War unit counts / GPU statements: only snippets.
- FLAME GPU 2 speedup over CPU at 5k–20k agents: not found; one small-population result: "a maximum speedup of 14× is
  achieved for a population size of 2048 with 25 species" (vs GPU baselines).
- First-hand report of frame drops from CUDA or a local LLM during a game: not found; only NVIGI guidance (5.7).
- UE 4.27 default D3D11 for this game: not checked (see the bottom line).
- Tozour influence maps (2001): cited inside Dave Mark's chapter only.
- CUDA quotes are from the 12.6 archive; the 13.x guide is reorganised.

## Essence (Pareto) — [AI] synthesis of the main session
- **Movement of crowds → shared fields, not per-agent paths** (flow fields, influence maps — Supreme Commander 2, Dave Mark):
  one computation serves everyone; CPU is enough at our scale.
- **Visible crowd ≫ thinking agents** (AI level of detail — AC Unity 40 real AIs for 10,000 NPCs): only those near the hero
  get the game's full AI.
- **GPU agents only if the population grows past ~100k and the rules are uniform** — at 5k–20k branchy subjects it loses
  (FLAME GPU 2 §4.4, CUDA divergence §4.1).
- **Over-engineering traps:** a CUDA context beside the game on Windows (time-slicing, no MPS, NVIGI needs D3D12 + hardware
  scheduling); AGPL library inside a shipped mod; GPU for branchy decisions.
