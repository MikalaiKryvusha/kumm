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
| N1 | Neighbours (HOUSE_RULES 39): switches to and from «Карта» and «Путешествие» by mouse, Q / E and Tab; Esc and Tab close the hub from both | no frame of the bare world, the dark backing as on the game's own pages, the hub closes | — |
| N2 | Neighbours: Simple Minimap's helper row on the map, the minimap's own markers | the row in its place (the mod adds it to the game's page itself) | — |
| N3 | Neighbours: the other five copied tabs («Таланты», «Хар-ки», «Клан», «Спутники», «Базар») — every button of each page by a real click | each button does what it does in the game without our controller; a dead one is a new issue | — |
