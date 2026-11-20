# TC — the hub's «Карта» and «Путешествие» tabs on the game's own pages (bug 113 / issue #12, bug 112 / issue #11, issue #33)

> **Created:** 2026-11-20 · **Parent:** `bugs/113_conan_map_markers_offset_reset_dead.md`, `bugs/112_conan_start_adventure_button_dead.md`, `plans/59_…` (the matrix)
> **Status:** written 2026-11-20 19:28 +03:00 — not run (the owner plays the working game); the control case M0 first
> **Outbound:** the results go to the issues #12, #11, #33 as comments after the retest

## Test basis

- The owner 2026-11-20 18:38 (verbatim in bug 113): the first map marker lands away from the click, a second is not placed, the reset does nothing; 19:20
  «карта нахуй тоже сломана» · «полагаю, это наш контроллер хаба».
- Code (bug 113 forensics): `krinik_hub_controller.lua` shows OUR standalone copies of seven tabs (`WidgetBlueprintLibrary:Create` + `AddToViewport(40)`), the
  game's own newborn page at opacity 0 and `HitTestInvisible`; the mod notes list «the helper's «Свои маркеры» click on our map» as never tested.
- The change under test: `GAME_PAGE` gets tab 5 (`W_NewJourneyWindow_C`, «Путешествие») and tab 8 (`W_FullscreenMap_C`, «Карта») — the game's own page is
  shown after the hold, as for «Снаряжение» and «Параметры».

## Stand

The working game `D:\Games\Conan Exiles 3.1.1` on 0.9.1-RC1 (the owner's save, HOUSE_RULES 6 — the save is free to use; `god-on.sh off` and its line read before
leaving). Real mouse and keys only with `owner-idle.ps1` FREE and the game in front (`launch-fg.ps1`); a 60 fps clip of every case (HOUSE_RULES 4). Display
3840 × 2160 at 300 % (the owner's). God mode on for M/J cases (none is about damage), named in the report. The dev harness for setup only
(`Deploy-ModPack.ps1 -Deploy -Only KrinikConanHarness`), never during a case's own clicks.

## Dimensions

Map host (the hub's «Карта» tab · the full-screen map by its own key) × action (place one marker · place a second · reset) × build (current = control · changed);
journeys (the tab's buttons, the journey that is open) × the same two builds. Not covered: gamepad; resolutions other than 4K (the release gate's own run).

## Cases

| ID | Case | Expected | Status |
|---|---|---|---|
| M0 | CONTROL, the current build: the hub, tab «Карта», a real click at a named map point (a landmark), then a second click elsewhere, then the reset control | reproduces the owner's report: the first marker away from the click, no second marker, the reset does nothing — if it does NOT reproduce, stop: the cause is elsewhere | — |
| M1 | The changed build: the same three actions on the «Карта» tab | each marker at its click point (frame: marker over the landmark), the second marker placed, the reset removes them | — |
| M2 | The full-screen map by its own key, both builds | the same as M1 on both (a defect here on the changed build means the cause is not the hub copy) | — |
| J0 | CONTROL, the current build: tab «Путешествие» — an open journey, its buttons (track / start), and whether «Начать приключение (Пробел)» lives here | the button's window named; its state on the current build recorded | — |
| J1 | The changed build: the same | the journey buttons act; a journey opened during the session shows open at once | — |
| D0 | CONTROL, the current build: talk to an NPC (`NPCDialogueWindow`), watch the world behind the dialogue (an animal, water, an NPC walking) and read the log | the log line «меню открыто: замедление времени 0.03» at the dialogue's opening (seen in the owner's session 18:39:48) | **fail as expected → it found that the first fix missed** (2026-11-20 20:01, build `dc79053` with its `NO_SLOW_MODULES = { NPCDialogueWindow }`): the oasis campfire talk («Поборник Внешней тьмы», real E) opened `NPCDialogueWindow2`, log «меню открыто: замедление времени 0.03» at 20:01:13, the remote read dilation 0.0300 and the time of day +0.0005 h in 2.5 s |
| D1 | The changed `krinik_pause_in_menu.lua` (since 20:04: the poll asks the game `IsModuleActive` for both NPC talk windows of the live UI table, `NPCDialogueWindow` and `NPCDialogueWindow2`): the same dialogue; then the hub opened right after it | no slowdown line while the dialogue is open, the world moves at its pace; the hub after it still slows to 0.03 | **pass** (20:06–20:07): real E → log «модуль NPCDialogueWindow2: открыт», no slowdown line until «закрыт» at 20:07:05 (the «Попрощаться» click); dilation 1.0000, the time of day +0.0221 h in 3.05 s (the game hour lasts ≈ 2.3 min — the full pace); then a real Tab → dilation 0.0300, Tab again → 1.0000. Clip `d1_dialogue_fix.mkv` (16 s, sheet watched: the dialogue window from ≈ 8 s, the campfire smoke changes between frames) |
| D2 | The owner's 2026-11-20 20:02 report: in a talk with reply options, a chosen reply «did nothing», the NPC's voice played but no text came | the reply's text appears after the choice while the world runs at 1.0 | **blocked** (20:08): no talker with reply options within reach of the owner's save — the campfire NPC has only «Siptah» (DLC) and «Попрощаться», the nearest other one (`BP_HumanoidDialogueNPC_Sorcerer_Companion_C` «Лю Фэй», 4.5 km) sits in a corruption plant and opens no window. The likely shared cause (a hypothesis, not observed: the reply waits on game time slowed 33×) is removed by D1; my retest owed: I find a talker with reply options and walk it (issue #3). **Run 20:47 — NOT the case (the owner 20:52: «ты выбрал плохого нпц и плохую реплику-функцию»): the only reply of this talker is an ACTION (a travel),
not a reply that shows the NPC's answer as text; D2 stays blocked — I owe a talker with text replies.** What the run did show: the talk's own handler `W_NPCDialogue2_C:HandleButtonClicked(<the reply button>)` (the function the click's bound event calls; params read live: `Button`, then `IsReadyForPlayerInput` — the talk accepts the player's choice only when READY, so at 0.03 a click before the NPC's line ends in game time is dropped: the mechanism of the owner's report, read from the handler, not yet reproduced) at dilation 1.0 → within 2 s the reply «Отправь меня на остров Сиптаха.» acted: the travel's loading screen («Вино текло…», 38 % → 69 %), the heroine on the island, the game alive (the in-game loading screen after a talk did not freeze — bug 79's class). The save put back from the 20:47 backup |
| D2b | The owner 20:52–20:53: the reply that «just led the talk on inside the open talk» — the merchant «Байбар Подонок» in Iruk (−245522, −26201; `W_NPCDialogue_C`), reply «Говорить» (`BndEvt__W_NPCDialogue_ButtonTalk…SignalClicked`, the click's own event) | the NPC's answer appears as text | **fail → cause found → pass.** 20:56 at dilation 1.0: no text on frames at 1 s and 3 s; the line exists (`W_SubtitleEntryView_C` «Решайся уже, я не могу ждать весь день!») with RenderOpacity 0.00 and no mirror. CONTROL 21:00 (`krinik_shout_fade` off in the game copy of main.lua): a 150 ms burst shows «Байбар Подонок — Можешь выйти отсюда с покупкой, а можешь — с кислой рожей. Решать тебе.» from ≈ 1 050 ms on. Probe: SetTextActive is never called for a talk line (0 calls) — my section hid the line at birth and waited for that event. Fix (21:03): a line born while a talk module is open is left to the game. Retest 21:05: «Байбар Подонок — Что тебе предложить?» from ≈ 1 050 ms (sheet `KUMM/.work/d1/burst_fix2_sheet.webp`). Neighbour 21:06: the oasis boss's «Умри!», «Чтоб тебя!» still hidden and shown by the mirror («зеркало построено», «фраза снята через 1.07 с») |
| D3 | Judge round 1 (R2): a talk open, then Esc pressed over it | either the Esc menu opens over the talk and the world goes to ≈ 0.0001 (the exemption yields to Esc), or Esc closes the talk and the world stays 1.0 — the log names which | **pass** (20:24, the build with the judge's guard, background keys by `post-key.ps1`): the first Esc CLOSES the talk («модуль NPCDialogueWindow2: закрыт» 20:24:36), dilation 1.0000; the second Esc opens the Esc menu — 0.0001; the third closes it — «меню закрыто: … 1.0». The game never shows the Esc menu over a talk, so the guard is a safety net on this path. D1 re-run on the same build: a background E opened the talk, dilation 1.0000, the time of day +0.0371 h in 5.1 s |
| N1 | Neighbours (HOUSE_RULES 39): switches to and from «Карта» and «Путешествие» by mouse, Q / E and Tab; Esc and Tab close the hub from both | no frame of the bare world, the dark backing as on the game's own pages, the hub closes | — |
| N2 | Neighbours: Simple Minimap's helper row on the map, the minimap's own markers | the row in its place (the mod adds it to the game's page itself) | — |
| N3 | Neighbours: the other five copied tabs («Таланты», «Хар-ки», «Клан», «Спутники», «Базар») — every button of each page by a real click | each button does what it does in the game without our controller; a dead one is a new issue | — |
