# Research — how an AI agent plays a game: frameworks and what the field does

> **Created:** 2026-11-20 · on the owner's word 2026-11-20 20:40 («поищи в интернете, как тебе - ИИ агенту - играть в игру» · «как такое решают» · «какие
> фреймворки есть для этого»), after his correction 20:37 that the retest of a fixed bug is the agent's own play (HOUSE_RULES 44.4)
> **Parent:** plan 59 (the play report gate: an hour of play per release), issues #3, #6 (cases the agent could not reach)
> **Status:** 🔬 first web sweep 2026-11-20 20:40 (six searches); no framework installed or tried
> **Outbound:** the summary was given to the owner in chat; a choice of what to build is the agent's (engineering), shown to him with the first play run

## 1. Two families

| Family | How it sees | How it acts | Who | State of the art |
|---|---|---|---|---|
| **A. General computer control — pixels in, keyboard and mouse out** | screenshots / video (2–5 fps) | key presses, holds, mouse moves, clicks — generated code or tokens | Cradle (ICML 2025; RDR2, Cities: Skylines, Stardew Valley), Google DeepMind SIMA 2 (2025), Lumine (Qwen2-VL-7B, pixels at 5 Hz, actions at 30 Hz, hours-long missions in 3D open worlds) | general, needs no game API — and weak: on VideoGameBench (DOS / Game Boy games) the best frontier VLMs finished 0.48 % (1.6 % on the Lite version that PAUSES the game while the model thinks); the «knowing-doing gap» (the right goal, the wrong input) and misread game state |
| **B. Engine-integrated testing agents — game state in, game actions out** | the game's state through an API / plugin / telemetry | calls into the game (move to, use, open, click by widget) or a scripted input layer | Filuta (IJCAI 2025, PDDL planner, Unity and Unreal plugins, regression testing), TITAN (LLM agent for MMORPG QA, in 8 commercial QA pipelines), Aura Autopilot (open source, UE5 / Unity / Godot plugin playtester — vendor claims unverified), Unreal's own Gauntlet (headless runs with automated inputs), Unreal MCP servers (Epic's in-editor plugin; `remiphilippe/mcp-unreal` with PIE start / stop and viewport capture) | the practical QA path: reliable, fast, repeatable — but needs a hook into the game; the MCP and Gauntlet tools work on a project with sources / the editor, not on a shipped game |

## 2. The patterns the field converges on

1. **A slow planner and a fast executor.** The LLM decides what to do (goals, the next case); a fast layer does the reflexes — a trained policy, or scripted skills
   (TypeGo: a reflex layer, an action streamer, a task decomposer, a scheduler over a «skill kernel»; JEV-Star in StarCraft II: a fast action selector under a
   strategic model). The LLM is too slow for a 15–30 Hz control loop.
2. **A skills library.** Repeated actions become named skills the planner calls (Cradle's «Skill Curation»; Voyager in Minecraft): «walk to X», «talk to the
   nearest NPC», «open tab N», «attack until hit» — written once, reused, improved after failures.
3. **Hide or stop time while thinking.** VideoGameBench Lite pauses the game while the model thinks; real-time agents queue several actions ahead and replan only
   on drift (input prediction and mishit correction, arXiv 2512.17250).
4. **Input that a DirectX game accepts.** PyAutoGUI fails in many DirectX games; Cradle uses PyDirectInput (scan codes) and a low-level mouse layer.
5. **Pixels for what only pixels show.** State comes from the game where it can; screenshots are kept for what the player sees (UI, text, visual defects).

## 3. Where KUMM already stands (own work)

We are already a family-B hybrid on a SHIPPED game, without sources or the editor: the UE4SS remote `KrinikAgentRemote` (`cmd.txt` → Lua in the game thread) is
our «game API» (state reads, game functions: teleport, god mode, `ActivateModule`, `CloseAndReturnToMainMenu`); real input by `input.ps1` (SendInput) and
`mouse-seq.ps1`, background keys by `post-key.ps1` (PostMessage — the game acts on them); perception by `capture-window.ps1` (PrintWindow), clips by `rec_clip.sh`;
stands as small Lua scripts (`dialogue-stand.lua`, `tp_ground.sh`, `freeze-npcs.lua`). What we lack against the field: a NAMED skills library the planner calls
(today every stand is written per case), a play loop that walks the play matrix by itself, and a run log that a play report can be built from.

## 4. What to build next (the agent's engineering choice — FORK recorded when taken)

- A skills library over the remote: `skills/*.lua` with one entry per player activity of the play matrix (walk to a point, sprint, crouch, draw the bow, shoot at
  a target, talk to the nearest talker and pick a reply, open each hub tab and press each button, eat, die and respawn without god mode), each returning what it
  observed (state + a frame path). The planner (the agent) composes cases from them; a failure becomes a skill fix, not a new one-off script.
- A play driver that walks the matrix rows, writes the play report's table as it goes and records the session video — the play report of the release gate
  (`ConanExiles/_config/release/check_play_report.py`) is then produced by the run itself.
- Keep pixels for the UI and visual rows; never let a pixel-only agent judge game state the remote can read.

## Sources

- Cradle — https://arxiv.org/abs/2403.03186 · ICML 2025 poster https://icml.cc/virtual/2025/poster/46393
- VideoGameBench — https://arxiv.org/html/2505.18134v3 · https://opencv.org/videogamebench/
- Lumine — https://arxiv.org/abs/2511.08892 · SIMA 2 tech report — https://storage.googleapis.com/deepmind-media/DeepMind.com/Blog/sima-2-an-agent-that-plays-reasons-and-learns-with-you-in-virtual-3d-worlds/SIMA_Tech_Report_2025.pdf
- Filuta, planning for automated testing (IJCAI 2025) — https://ijcai.org/proceedings/2025/1250
- TITAN, LLM agents for game testing — https://arxiv.org/html/2509.22170v1
- Aura Autopilot review — https://dev.to/ishank-dev/aura-autopilot-review-an-open-source-ai-agent-that-playtests-your-godot-unity-and-unreal-games-1omf
- UE5 AI QA and Gauntlet (tutorial) — https://www.strayspark.studio/blog/ai-powered-qa-testing-ue5
- Unreal MCP in the editor (Epic) — https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-mcp-in-unreal-editor · mcp-unreal — https://mcpservers.org/servers/remiphilippe/mcp-unreal
- Slow-fast agents: TypeGo https://arxiv.org/pdf/2607.05482 · input prediction https://arxiv.org/html/2512.17250 · survey https://arxiv.org/pdf/2404.02039
