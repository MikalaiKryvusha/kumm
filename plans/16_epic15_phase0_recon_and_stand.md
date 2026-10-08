# Plan 16 (epic 15, phase 0) — Medieval Dynasty living world: live recon and the stand

> **Created:** 2026-10-08 · **Parent:** `plans/15_EPIC_medieval_dynasty_living_world.md`, phase 0 row («Разведка устройства и
> стенд») · **Status:** 📐 drafted 2026-10-08 00:31; in progress since the night of 2026-10-08 (steps below carry their own
> marks — the earlier «not started» was stale); interview #008 answered — world server in **C#** (Q6), so step 0.7 measures
> a C# prototype; step 0.11 added for item properties (Q5) · **Outbound:** phase report + the measured check of the path
> «C# world server + file bridge» → back into the epic
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
- [x] **0.2 Census of far villagers** — DONE 2026-10-08 on Oxbow: far villagers (97) are in memory AND frozen — 0 of 97 moved in ≈40 game minutes while near NPCs walked (report `testcases/reports/2026-10-08_md-phase0-far-villagers-move.md`). HOW (01:42): `BP_BoostComponent` puts every NPC beyond `ActiveRadius` 120 m on stage 4 → `DeactivateNPC` → actor tick, timers and nav invoker off; live 97/97 on stage 4, tick off — one property is the wake lever (report `testcases/reports/2026-10-08_md-phase0-optimization-stages.md`, `game-internals.md`). WAKE PROVEN (01:46, mod `KrinikWake`): `ActiveRadius` 2000 m → 97/97 tick on, 80 of 97 walked within ≈23 s; control before write 0 of 97 (report `testcases/reports/2026-10-08_md-phase0-wake-far-villagers.md`); frame cost of 97 woken 2.5–4 ms (step 0.6). STEERING (02:04–02:08): quest path and the cheat-menu `AI_SetPath` do not lead a far villager (reports `…-lead-villager-questpath.md`, `…-lead-villager-setpath.md`); the behavior-tree service takes `TargetLocation` from the current schedule slot, so the wheel is the schedule (91 villagers × 4 seasons × ≈19 slots with absolute places) — next live test: put a far slot into a woken villager’s activity list. READ OK (02:16, bridge v9): woken villagers 5/5 have a current activity and stand 0–4 m from its place; frozen ones report none (report `…-read-current-activity.md`). Home half: `BP_NPC_C` 184, of them `BP_NPC_Multi_Village_C` 97 (other villages) in memory with the hero at home, own population 80; far-village half (walk there) open — anchor: «если жители чужих деревень уже есть в памяти, мост … **ведёт
  существующих**». `census` counts NPC actors by owning village and distance to the hero; run at home and at a far village.
  Verify: criterion 2.
- [~] **0.2b Steer by schedule — operational sub-plan (2026-10-08, autonomous hour)** — S6/S7 10:24–10:35: beyond 150 m the game routes along ROADS (`BP_NPC:SetPath` → `GetPathToTarget`), so distance-to-hero wobbles; furniture slots ignore the place (v6 writes `IsFurniture=false`); next: criterion «arrival / path progress», long run on ONE fixed save copy (autosaves carry each run into the next). RUN 10:08–10:14: WORKS, 5/5 led walked 455 → 237 m in 6 min, control 456 → 458; start delay ≈3 min (criterion «≥ 100 m in 120 s» failed) — next: find what triggers the re-pick (service tick / half-hour slot) (report `testcases/reports/2026-10-08_md-phase0-steer-by-schedule.md`). Anchor: «Руль жителя — следующий
  живой шаг … записать разбуженному жителю занятие с дальним местом в его копию `ActivitiesBySeason` … и проверить, что
  он пойдёт» (STATUS, Where to continue, item 2) and the epic's «Обоз — это занятие «работа на рынке деревни B» в
  распорядке; живьём ещё не проверено».
  - Goal (Achieve): a far villager walks to a place WE choose, using the game's own AI and pathfinding — the steering
    wheel every caravan, trader and ranger of the epic will use.
  - Mechanism (offline, `BP_NPC_Multi_Village` bytecode `AIMulti_CheckActivitiesTime`): the villager keeps
    `ActivitiesBySeason` (season → `Activities_7_…` array of slots: `StartTime_14_…`, `EndTime_15_…`, `DailyMode_2_…`,
    `TransformLocation_13_F837…`) and `CurrentActivityID`; an invalid index forces a re-pick, and the behavior-tree service
    then copies the slot's place into `TargetLocation`.
  - Steps: (1) `KrinikWake` v4 — `goto <Class> <N> sched`: 2N nearest woken, odd ones get every slot place of every season
    = the hero's location and `CurrentActivityID = -1`, even ones are the control; read-back of the first written place is
    logged; (2) stand `tools/test-wake.lua` gains the case and a mutant; (3) live run: hero at home, `goto
    BP_NPC_Multi_Village_C 5 sched`, `track` at +30 s, +60 s, +120 s.
  - Acceptance (scenario): Situation — Oxbow, owner's save, hero in his village, 10 nearest multi-villagers 300–500 m away.
    Action — the agent steers 5 of them by schedule. Result — led villagers' distance to the hero drops by ≥ 100 m in
    120 s, the control's does not. Check — `KrinikWake` `track` lines (led vs control) in `wake-out.txt`; cases
    `testcases/TC_md_phase0_steer_schedule_2026-10-08.md`.
  - Risk: TMap/TArray-of-struct writes from UE4SS Lua may not stick (EXP-0177 class) → read-back line decides; a
    villager walking 500 m takes minutes (≈1.5 m/s) → the check is the drop, not the arrival.
- [~] **0.3 How the game ticks** — LIVE 2026-10-08 01:16 (`KrinikProbe`, report `testcases/reports/2026-10-08_md-hdr-intro-faststart-probe.md`): `village.time` 10 Hz timer, `npc.timeofday` fired, `village.minute` silent in ~110 s — FALSE ALARM, corrected 01:24: v1 logged every 60th call and a game minute = 2 s; v2 sees #1, #10 (1 game hour = 120 s real). Offline half done 2026-10-08: nobody listens to `OnTimeUpdate_Hours`; hook `BP_VillageManager:OnMinuteUpdate` (count to 60) / `BP_NPC_Manager:OnTimeOfDayChanged` / `BP_EconomyManager:DayChanged` (`game-internals.md`); live half open — anchor: «**Часы** | такт минута/час/день/сезон | делегаты `BP_TimeManager`». Delegates
  cannot be hooked (UE4SS docs); find hourly BP functions (`UpdateWaggoners`, `UpdateVendors`, `OnTimeUpdate` callers) and
  hook them post-call; log game time per call. Verify: criterion 3 (tick half).
- [~] **0.4 Save/load hooks** — LIVE: `village.load` fires 2 s after map load; quitting without saving fires no save; agent-made save not yet tried. Offline half done 2026-10-08: slot = `<slot>.sav` + `<slot>_Label.sav`, Oxbow `_Ox`, autosave rotation; book file `<slot>_KrinikWorld.*` (`game-internals.md`); live half open — anchor: «**Хранилище** | файл книги рядом со слотом сохранения». Hook
  `SaveDataFromSystemToFile` / `LoadSaveFileIntoSystem` of one manager; log slot name. **Owner's saves are copied before
  any run** (`%LOCALAPPDATA%\Medieval_Dynasty\Saved\SaveGames` → `D:\Games\Medieval Dynasty Mods\_save-backup\<stamp>\`).
  Verify: criterion 3 (save half).
- [ ] **0.5 Spawn test** — LEAD 2026-10-08 02:08: the developers' own cheat menu `UI_CheatMenu` holds the game's spawn recipes (`SpawnBandit` 73 ops, `SpawnAnimal` 162, `Force spawn selected POI` 344, `SpawnPresetConfirm` 112, `TeleportToLocation` 281) — copy their calls instead of inventing ours (`game-internals.md`, «Steering a villager»). Anchor: «Крэш спавна UE4SS (#527) — фаза 0 первой же проверкой, спавн функциями игры». Risky
  stage (it makes the game DO something): separate run, own test case, crash watch via `AbortHandler` grep against older
  logs (EXP-0059). Verify: criterion 4.
- [~] **0.6 Budgets** — PARTLY UNBLOCKED 2026-10-08 01:53: bridge v8 `frames` counts engine frames over real time from inside the game (no admin). First reading, Oxbow, hero at home: frozen 108–120 FPS (8.4–9.3 ms; first window 119.6 — likely a 120 cap, not verified) → 97 woken villagers 75–77 FPS (13.1–13.3 ms) → refrozen 92–94 FPS (10.7–10.8 ms): **97 woken cost 2.5–4 ms per frame**, scene drift ≈1.5–2 ms (report `testcases/reports/2026-10-08_md-phase0-wake-frame-cost.md`). Still open: game thread vs render split (PresentMon / `stat unit` need admin or console), a busy-village scene. Earlier: BLOCKED — session not elevated, PresentMon (ETW) needs admin — anchor: «**Цена кадра** … база — фаза 0». PresentMon (elevated shell, `AGENT_GUIDE` dossier) 60 s
  in the owner's village, three configurations; `nvidia-smi` VRAM. Verify: criterion 5.
- [~] **0.7 Tick benchmark and bridge round trip** — C# PROTOTYPE 2026-10-08 10:18 (`MedievalDynasty/server/WorldBench`, .NET 8): 500 subj 0.009 ms/hour on 1 thread (Lua 0.056), 20 000 0.18 ms (Lua 2.08); 16 threads pay off only from tens of thousands (×0.5 at 500, ×5.6 at 200 000 — capped by 11 villages); 1 == 16 threads bit-exact; bread leak 0 (report `testcases/reports/2026-10-08_md-phase0-world-server-bench.md`); bridge round trip open. IN-GAME 2026-10-08 01:26: tick 500 subj 0.047 ms on the game thread; reading 184 NPC positions 6–8 ms (report `testcases/reports/2026-10-08_md-phase0-tick-cost-in-game.md`); world-server prototype and bridge round trip open. Offline lower bound: pure Lua 5.4 tick 500 subjects 0.054 ms, 20 000 1.99 ms, ledger leak 0 (pack `tools/bench-tick.lua`; report `testcases/reports/2026-10-08_md-phase0-offline-bridge-stand-and-tick-bench.md`); in-UE4SS and world-server halves open — anchor: «Окончательно — по замерам фазы 0». Synthetic 500-subject
  hourly tick (eat from market, wear tools, one recipe) in Lua via the bridge, and in the world-server prototype (language
  per #008 Q6) on 1/16 threads; round trip = write request → read reply. Verify: criterion 6.
- [~] **0.8 Map graph** — Oxbow roads DONE 2026-10-08 01:30: 197 roads live, one connected network, village distances 1.1–2.3 km (pack `data/road_graph_oxbow.json`, report `testcases/reports/2026-10-08_md-phase0-roads-oxbow.md`); Valley roads open (needs a Valley game). Villages half done 2026-10-08 (enum gap fixed; pack `data/villages_valley.csv` 11 villages, `data/villages_oxbow.csv` 4); roads open — anchor: «**Карта** | граф деревень, лагерей, логов, дорог». Fix enum printing in
  `tools/dt-summary.py`; export `DT_VillagesOriginAndRange` / `DT_MultiVillagesOriginAndRange` origins; roads from the map
  (`ST_RoadList`, spline structures) — offline first (EXP-0057: disk before memory), live `find` only for what the disk
  does not give. Verify: criterion 7.
- [~] **0.9 Durability** — offline half done 2026-10-08 (no field in `DT_ListOfItems`; reflected `ABaseEconomyManager` UFUNCTIONs `GetDurability`… — `researches/medieval-dynasty/game-internals.md`); live half open — anchor: «**Износ и ремесло** | … прочность `Add Used Durability`». Offline search in item
  structures and `BP_EconomyManager`; live `get` on an equipped tool if needed. Verify: criterion 8.
- [~] **0.11 Where an item instance can carry a property** — LIVE READ 2026-10-08 10:21 (bridge v10 `inv`): `Inventory_New` = item ID → array of `ST_ItemInventorys`; per-instance `MaxHP` differs (500 / 1000 / 200), `NoteDetailsRowName` free (None) — carriers found; write + save→load survival open (report `testcases/reports/2026-10-08_md-phase0-item-instance.md`). (added 2026-10-08 after interview #008 Q5 «Б» — track В of the
  epic) — anchor: «**где у экземпляра вещи можно хранить свойство** (для дорожки В)». Offline first: the inventory slot
  struct (`Comp/Inventory/InventoryStructs.h` in the PDB, `ST_*` item structs in the pak), what of it reaches the save
  file; then live `get` on a carried tool's slot (bridge, read-only). Also name where tool damage / work speed is computed
  (what a «Sharp» property would have to change). Verify: a quoted field that survives save → load, or the verdict «no
  room — properties live in our book by instance key».
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

- [~] **0.2c Free pathfinding, not only roads** — LIVE 2026-10-08 11:28: 3/3 led villagers reached an OFF-ROAD point (120 m from the hero, 125 m from any road) — from 140 m directly in ≈110 s, from 251 and 327 m road first then straight into the field (1 and 3 m); ground height by a ray (`KrinikWake` v7 `ground`); waypoints not needed; open: a point FAR from the hero (navmesh) (report `testcases/reports/2026-10-08_md-phase0-free-path.md`). (owner's question in chat, recorded 2026-10-08 11:09: «мы сможем сделать, чтобы они могли
  ходить не только по дорогам? Свободный поиск пути реализуем?») — anchor: 0.2b finding «beyond 150 m the game routes along
  ROADS». Plan: (1) live: a woken villager gets a schedule place 100–140 m away OFF the road (below the 150 m threshold the
  game calls a direct navmesh move) — does he walk there? (2) is there navmesh far from the hero (nav invokers are switched
  off for frozen villagers — offline: the nav settings of the map; live: the same test 400 m from the hero); (3) waypoints:
  a 400 m off-road trip as a chain of places ≤ 140 m apart, the next one written when the villager arrives. Acceptance —
  the villager reaches an off-road point 400 m away; Check — bridge distance to the point < 5 m.
