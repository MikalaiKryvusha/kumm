# Plan 16 (epic 15, phase 0) — Medieval Dynasty living world: live recon and the stand

> **Created:** 2026-10-08 · **Parent:** `plans/15_EPIC_medieval_dynasty_living_world.md`, phase 0 row («Разведка устройства и
> стенд») · **Status:** 📐 drafted 2026-10-08 00:31; not started; waits for the owner's "yes" on the meta-plan (discussion
> 2026-10-08) · **Outbound:** phase report + the `FORK` decision «где считается мир» → back into the epic
>
> Executor steps in English (Languages canon); everything the owner reads about this phase — the report — in Russian.

## Goal vector (Achieve)

Replace the open questions of the meta-plan with measurements on the owner's machine and game, so phase 1 is planned
against facts: where the world is computed, whether far villagers already live in memory, how the game ticks and saves,
what spawning costs, what the frame and VRAM budgets are.

## Acceptance criteria

1. **The bridge answers.** Situation: game running with UE4SS 1161, the bridge mod enabled. Action: the agent writes
   `?time` into the bridge input file. Result: the output file holds the in-game time and the same value is visible on the
   in-game clock. Check: `cat <bridge>/out.txt` + screenshot.
2. **Far villagers census.** Scale: count of NPC actors per village with the hero at home vs at the far side of the map;
   Meter: bridge command `census`; Target: a table in the phase report — the answer to «живы ли дальние жители в памяти».
3. **Tick and save hooks proven.** An hourly hook and a save/load hook fire — log lines with game time, two in-game hours
   and one save → load, read in the UE4SS log.
4. **Spawn cost known.** N waggoners spawned through the game's own `BP_NPC_Manager:SpawnWaggoner` (N from 1 up to 50 in
   steps) with no crash; or the crash point recorded (issue #527 class).
5. **Budgets measured.** FPS (PresentMon, 60 s, village scene) vanilla vs UE4SS-only vs bridge-on; game VRAM (`nvidia-smi`
   while the game runs).
6. **FORK decided by numbers.** A synthetic hourly tick of 500 subjects: time per tick in UE4SS Lua on the game thread vs
   the world-server prototype in the language chosen by the owner (interview #008 Q6) on 1 and 16 threads; bridge
   round-trip time. The decision line `FORK: …` closes in the epic with these numbers.
7. **Map graph as data.** Villages of both maps (Valley, Oxbow) with origin and range, plus roads, as one data file per map
   in the pack repo; enum gap of `tools/dt-summary.py` fixed (village enum printed, not `None`).
8. **Durability located.** Where tool/clothing durability lives (item table field, component, save) — named with a quote of
   the asset/class.

Every run leaves a report in `testcases/reports/` (`TESTING_FRAMEWORK.md`); cases are written first in
`testcases/TC_md_phase0_*.md` (hook `testcase-gate` applies to game runs).

## Steps

Each step quotes its anchor in the epic («…»).

- [~] **0.1 Bridge mod** — RUN IN THE GAME 2026-10-08 00:46–00:54 (report `testcases/reports/2026-10-08_md-phase0-live-bridge-census.md`): loads, answers; control C3 failed — menu has a pawn, switch the «world loaded» test to `BP_PlayerCharacter_C`. Written 2026-10-08: pack `_unpacked/KrinikBridge` v1 (read-only: `where`, `count`, `get`), manifest entry, stand `tools/test-bridge.lua` 11/11 green + mutant red (hygiene); NOT run in the game, not deployed — anchor: «**Пульт** | файловый мост команд (как ConsoleBridge Palworld, EXP-0020)». Port
  `D:\work\ai_sandbox\Palworld\_unpacked\ConsoleBridge\Scripts\main.lua` into the pack repo as `mods/KrinikBridge/`
  (game-thread timer `ExecuteInGameThreadWithDelay`, re-armed at the END of processing — EXP-0020); commands: `?time`,
  `census`, `find <class>`, `get <object> <prop>`, `call <object> <func>`. Read-only commands first (EXP-0059: recon asks
  the game to DO nothing). Deploy via the pack manifest. Verify: criterion 1 (positive control).
- [x] **0.2 Census of far villagers** — DONE 2026-10-08 on Oxbow: far villagers (97) are in memory AND frozen — 0 of 97 moved in ≈40 game minutes while near NPCs walked (report `testcases/reports/2026-10-08_md-phase0-far-villagers-move.md`). HOW (01:42): `BP_BoostComponent` puts every NPC beyond `ActiveRadius` 120 m on stage 4 → `DeactivateNPC` → actor tick, timers and nav invoker off; live 97/97 on stage 4, tick off — one property is the wake lever (report `testcases/reports/2026-10-08_md-phase0-optimization-stages.md`, `game-internals.md`). Home half: `BP_NPC_C` 184, of them `BP_NPC_Multi_Village_C` 97 (other villages) in memory with the hero at home, own population 80; far-village half (walk there) open — anchor: «если жители чужих деревень уже есть в памяти, мост … **ведёт
  существующих**». `census` counts NPC actors by owning village and distance to the hero; run at home and at a far village.
  Verify: criterion 2.
- [~] **0.3 How the game ticks** — LIVE 2026-10-08 01:16 (`KrinikProbe`, report `testcases/reports/2026-10-08_md-hdr-intro-faststart-probe.md`): `village.time` 10 Hz timer, `npc.timeofday` fired, `village.minute` silent in ~110 s — FALSE ALARM, corrected 01:24: v1 logged every 60th call and a game minute = 2 s; v2 sees #1, #10 (1 game hour = 120 s real). Offline half done 2026-10-08: nobody listens to `OnTimeUpdate_Hours`; hook `BP_VillageManager:OnMinuteUpdate` (count to 60) / `BP_NPC_Manager:OnTimeOfDayChanged` / `BP_EconomyManager:DayChanged` (`game-internals.md`); live half open — anchor: «**Часы** | такт минута/час/день/сезон | делегаты `BP_TimeManager`». Delegates
  cannot be hooked (UE4SS docs); find hourly BP functions (`UpdateWaggoners`, `UpdateVendors`, `OnTimeUpdate` callers) and
  hook them post-call; log game time per call. Verify: criterion 3 (tick half).
- [~] **0.4 Save/load hooks** — LIVE: `village.load` fires 2 s after map load; quitting without saving fires no save; agent-made save not yet tried. Offline half done 2026-10-08: slot = `<slot>.sav` + `<slot>_Label.sav`, Oxbow `_Ox`, autosave rotation; book file `<slot>_KrinikWorld.*` (`game-internals.md`); live half open — anchor: «**Хранилище** | файл книги рядом со слотом сохранения». Hook
  `SaveDataFromSystemToFile` / `LoadSaveFileIntoSystem` of one manager; log slot name. **Owner's saves are copied before
  any run** (`%LOCALAPPDATA%\Medieval_Dynasty\Saved\SaveGames` → `D:\Games\Medieval Dynasty Mods\_save-backup\<stamp>\`).
  Verify: criterion 3 (save half).
- [ ] **0.5 Spawn test** — anchor: «Крэш спавна UE4SS (#527) — фаза 0 первой же проверкой, спавн функциями игры». Risky
  stage (it makes the game DO something): separate run, own test case, crash watch via `AbortHandler` grep against older
  logs (EXP-0059). Verify: criterion 4.
- [ ] **0.6 Budgets** — BLOCKED 2026-10-08: session not elevated, PresentMon (ETW) needs admin — run from an elevated shell or ask the owner for an NVIDIA overlay reading — anchor: «**Цена кадра** … база — фаза 0». PresentMon (elevated shell, `AGENT_GUIDE` dossier) 60 s
  in the owner's village, three configurations; `nvidia-smi` VRAM. Verify: criterion 5.
- [~] **0.7 Tick benchmark and bridge round trip** — IN-GAME 2026-10-08 01:26: tick 500 subj 0.047 ms on the game thread; reading 184 NPC positions 6–8 ms (report `testcases/reports/2026-10-08_md-phase0-tick-cost-in-game.md`); world-server prototype and bridge round trip open. Offline lower bound: pure Lua 5.4 tick 500 subjects 0.054 ms, 20 000 1.99 ms, ledger leak 0 (pack `tools/bench-tick.lua`; report `testcases/reports/2026-10-08_md-phase0-offline-bridge-stand-and-tick-bench.md`); in-UE4SS and world-server halves open — anchor: «Окончательно — по замерам фазы 0». Synthetic 500-subject
  hourly tick (eat from market, wear tools, one recipe) in Lua via the bridge, and in the world-server prototype (language
  per #008 Q6) on 1/16 threads; round trip = write request → read reply. Verify: criterion 6.
- [~] **0.8 Map graph** — Oxbow roads DONE 2026-10-08 01:30: 197 roads live, one connected network, village distances 1.1–2.3 km (pack `data/road_graph_oxbow.json`, report `testcases/reports/2026-10-08_md-phase0-roads-oxbow.md`); Valley roads open (needs a Valley game). Villages half done 2026-10-08 (enum gap fixed; pack `data/villages_valley.csv` 11 villages, `data/villages_oxbow.csv` 4); roads open — anchor: «**Карта** | граф деревень, лагерей, логов, дорог». Fix enum printing in
  `tools/dt-summary.py`; export `DT_VillagesOriginAndRange` / `DT_MultiVillagesOriginAndRange` origins; roads from the map
  (`ST_RoadList`, spline structures) — offline first (EXP-0057: disk before memory), live `find` only for what the disk
  does not give. Verify: criterion 7.
- [~] **0.9 Durability** — offline half done 2026-10-08 (no field in `DT_ListOfItems`; reflected `ABaseEconomyManager` UFUNCTIONs `GetDurability`… — `researches/medieval-dynasty/game-internals.md`); live half open — anchor: «**Износ и ремесло** | … прочность `Add Used Durability`». Offline search in item
  structures and `BP_EconomyManager`; live `get` on an equipped tool if needed. Verify: criterion 8.
- [ ] **0.10 Phase report and judge** — anchor: «Каждая фаза закрывается отчётом прогона … и проверкой `/fable-judge`».
  Russian report for the owner; `FORK` line closed in the epic; phase 1 plan written only then.

## Risks

- **(a)** Crash from spawning (#527) or a recon call that loads assets (EXP-0059) → risky steps isolated (0.5), read-only
  first; owner's saves copied before any run.
- **(a)** The owner is often in the game (2026-10-07: he was in its settings) → game runs only when the owner is not playing;
  never close his game (memory `dont-kill-game-owner-is-in`); voice notice before a run (memory
  `narrate-by-voice-while-game-open`).
- **(b)** Remote-desktop resolution: agent runs may rewrite the game's settings (Conan precedent, `games/ConanExiles` dossier)
  → back up `GameUserSettings.ini` before the first run, restore after.
- **(c)** UE4SS hot reload can deadlock (#1445) → off (`EnableHotReloadSystem = 0`, as the Shapeshifter mod advises).

## Decisions made without the owner

Filled at closing.
