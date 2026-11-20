# TC — KrinikConanUI without key binds: clicks and Esc / Tab on game-thread events (bug 85)

> **Created:** 2026-11-18 · **Parent:** `bugs/85_conan_crash_keybind_lua_races_game_thread.md` (the five KrinikConanUI binds), STATUS item 3 (critical bugs of 0.9.1)
> **Status:** recon cases R1–R2 first, then the functional cases after the kit and Lua change · **Outbound:** —

## Test basis

- Bug 85, root cause: a `RegisterKeyBind` callback runs Lua on UE4SS's event-loop thread while the same mod runs game-thread Lua — one `lua_State`, no lock;
  the heap is corrupted and a later table fill crashes the game (crashes 2026-11-07 21:17 and 2026-11-10 19:17).
- Requirement: WHEN the player clicks or presses Esc / Tab, KrinikConanUI shall run its Lua only on the game thread; the guard
  `python -I -X utf8 _config/check-lua-game-thread.py` shall print the line of zero worker-thread calls.
- Every behaviour the five binds served stays as it is today (the mod notes `games/ConanExiles/mods/KrinikConanUI.md`): the feedback plate in both menus, the
  clicks of our settings window, the mods-settings button and its list (a click outside closes it), Esc closing a mod window over the hub, our hub pages
  collapsed when the hub closes.

## Stand

Build `D:\Games\Conan Exiles 3.1.1` (targets.json), the owner's world save (rule 6 — free to use). Game by `launch-bg.ps1` for remote cases; real clicks and keys only
with `owner-idle.ps1` FREE and the game in front (`launch-fg.ps1`). God on (`god-on.sh`), the hub opened by the remote (`hubswitch/open-tab.lua`) or by a real Tab.
No creature near the hero (`stand-keeper.sh`) for the real-input cases.

## Dimensions

Input source (real mouse / real key · the remote) × place (main menu · Esc menu · hub tab «Снаряжение» · our window · a mod window over the hub · gameplay) × state
(window open · closed). Not covered: gamepad (B = the input action `Escape`) — named, not run.

## Cases

| ID | Case | Expected | Status |
|---|---|---|---|
| R1 | Recon by the remote: the UFunctions of `WindowRoot`, `GUIModuleController`, `FLXButtonBase` whose names hold close / shortcut / signal / module | a list in the bug document | — |
| R2 | Recon by real keys: with probe hooks on the candidates of R1, Esc and Tab close the hub; Esc closes our window | the hooks that fire on each path, in the bug document | — |
| K1 | Main menu: a real click on the feedback plate | the section logs the click in `W_MainMenu_MainMenu_C`, the collector starts once; a second click within 5 s is ignored | PASS 2026-11-18 21:30 on the pak with the double-click overrides — UE4SS.log 21:30:46.92 «click in W_MainMenu_MainMenu_C -> start … collect_report.ps1», 21:30:47.15 «click ignored (debounce)» (read 2026-11-20 from the log of that session; report `2026-11-18_conan-keybinds-judge2-run.md`, run 2) |
| K2 | Esc menu: a real click on the feedback plate | the same in `W_IngameMenu_C` | PASS 2026-11-18 21:17 — a real click on «ОТЗЫВ» in the Esc menu: the collector started, the second press 0.25 s later «click ignored (debounce)»; the collector stopped by PID, the desktop unchanged (report `2026-11-18_conan-keybinds-judge2-run.md`) |
| K3 | Gameplay: 20 real LMB attacks | no line of the feedback, settings-window or mods-button sections; the guard prints zero | — |
| K4 | Our window: real clicks on a checkbox, a mod name, an «i», the reset, save, save-and-close and close buttons | each does what it did with the key bind; the close button closes the window (new: it did nothing before) | — |
| K5 | Our window over the hub: a real Esc | the window closes, the hub stays | — |
| K6 | The mods-settings button: click it, click an entry, open again, click outside, click the button twice | the list opens; the entry's window opens; the outside click closes the list; the second button click closes it | — |
| K7 | The fishing panel and Hosav's window over the hub: a real Esc (changed 20:3x: their Esc dropped, bug 108) | nothing happens, no crash; their close button closes them | — |
| K8 | Hub close by a real Esc, a real Tab, the close button | the hub-close log line within one frame of the close; no page of ours over the bare world on a frame | — |
| K9 | The guard on the source tree | zero worker-thread calls | — |
| C1 | Control: K3 on the build before the change | the feedback section's key bind is registered (its ready line), the bind path runs on every LMB | — |

## Neighbours (HOUSE_RULES rule 39 — the new function AND a small regression next door)

| ID | Case | Expected | Status |
|---|---|---|---|
| N1 | Main menu: «Продолжить», «Новая игра», «Настройки», the mod list (Simple Modlist) — real clicks (the kit added nodes to the menu's Construct chain) | each opens as before; the backdrop movie plays (bug 71) | PASS 2026-11-18 21:3x — the main menu's buttons by real clicks, the world entered (the inventory's mods button placed 21:31:33); recorded in that chat's closing message, the clicks themselves leave no log line |
| N2 | Esc menu: «Вернуться», «Настройки», «Выйти в меню» — real clicks; the Krinik mods at the top of the mod list | as before | PARTIAL 2026-11-18 21:3x — «Настройки» and «Выйти» by real clicks (closing message of that chat); the Krinik mods on top: UE4SS.log 21:32:52 and 21:33:45 «список модов: Криник наверху (4 из 66 строк)»; «Продолжить игру» NOT pressed — owed |
| N3 | Inventory: the world slows (0.03) and returns to 1.0 on close; craft at real speed | the pause section's log lines as before | — |
| N4 | Hub: tab switches by mouse, Q / E; close by Esc, Tab and the close button | our pages collapse on every close (log «хаб закрыт»), no bare-world frame | PASS 2026-11-18 21:24 — a tab by the mouse (Хар-ки), E then Q twice (Параметры → Хар-ки → Таланты), a real Esc closed the hub: «хаб закрыт», the world 1.0 |
| N5 | The inventory's bottom bar: the other buttons (Hosav «Настройки интерфейса» collapsed, Inventory Compactor) click as before beside our wrapped button | as before; the wrap takes no extra width | — |
| N6 | Our window: drag a slider, pick a key in the key selector — the preview mouse / key overrides return Unhandled | the slider moves, the key is taken (the busy plate for a taken key) | PASS 2026-11-18 21:22 — a real drag moved «Высота камеры» 75 → 140 (frame `r2_n6.jpg`); the key selector not run |
| N7 | Our window over the hub: Esc closes it, the camera / pack-manager hooks see the close (a camera row change applies at once) | as before (H1–H8 of `TC_conan_hub_rows_audit_2026-11-01.md`) | PASS 2026-11-18 21:23 — a real Esc: «closed (Esc)», the module close seen by the pause section, the hub stayed; the unsaved changes dropped |
| N8 | A mod window from the list (EAA) — closes by its own close button; Esc does nothing (bug 108, known) | no crash, the hub stays | — |
| N9 | 10 min of gameplay with LMB attacks and Esc / Tab in and out of menus | no crash, no new Lua error in UE4SS.log | — |

## After judge round 2 (2026-11-18 21:1x) — the fixes and their cases

| ID | Case | Expected | Status |
|---|---|---|---|
| J1 | Our window: a real double click (two presses < 300 ms) on one checkbox | it toggles twice — ends as it started; two log lines «click: check …» | FAIL 2026-11-18 21:21 on the 20:38 pak — one «click: check cam_sharp» for two presses 120 ms apart (judge finding 1 confirmed); a re-run on the pak with the double-click overrides owed. FAIL again 2026-11-18 21:31:56 on that pak — one «click: check cam_sharp → true» for the double click (UE4SS.log): the window's own double-click path does not reach the click handler → bug 109, RC2 |
| J2 | The mods button: two presses < 300 ms | the list opens and closes (the second press lands on the catcher as a double click) | FAIL 2026-11-18 21:20 on the 20:38 pak — the list opened and stayed open (judge finding 1 confirmed). PASS 2026-11-18 21:31:38 on the pak with the double-click overrides — UE4SS.log 21:31:37.91 «список построен…», 21:31:38.06 «щелчок мимо списка — список закрыт» (the second press reached the catcher) |
| J3 | The guard on the pre-fix tree (bddc495) | exit 1, all five binds listed, the `pcall(RegisterKeyBind, …)` form among them | PASS 2026-11-18 21:1x — bddc495: exit 1, five binds, the pcall form among them |
| J4 | The guard on `_unpacked` (the `ue4ss/Scripts` layout) | KrinikConanUI and the other Krinik mods scanned, 0 in them | PASS 2026-11-18 21:1x — `_unpacked`: the Krinik mods scanned (ue4ss/Scripts), 0 in them |
| J5 | The mods button after a world re-entry (exit to the menu, Continue): open the list twice | the list opens each time (a handler is never erased by the old window's late off) | — |
| J6 | The inventory bar on another tab («Хар-ки») | no gap where the hidden mods button stood (the wrap collapses, not the button) | PASS (weak) 2026-11-18 21:23 — «Хар-ки»: no mods button, no gap seen; this tab has no other button in the left container, so a gap could not show either way |
| J7 | K1 / K2 run: a real click on the feedback plate starts the collector; a second press 0.2 s later is ignored; the collector is stopped by PID before its zip (no window, no zip on the owner's desktop) | log «click» once, «ignored» once; the collector PID seen and stopped; the desktop unchanged | K2 part PASS (above); the K1 part owed |

## After judge round 5 (2026-11-20 14:3x) — the old window's widgets are forgotten, never called

The mods button keeps raw pointers to its button, wrap, list and catcher; after a world re-entry another object can live at an old address. Since the fix
`krinik_ui_fixes` counts the inventory window's births (`_G.__krinik_hub_gen`), and `krinik_mods_button` forgets the older window's widgets when the number
changes (handlers removed by their tokens). Stand: the working game 3.1.1, the owner's save, the background path or the game in front when the PC is free.

| ID | Case | Expected | Status |
|---|---|---|---|
| G1 | Open the inventory («Снаряжение»), then close it | the mods button stands in the bar; no line «родилось заново» on the first opening of the session; no Lua error | — |
| G2 | Exit to the main menu, «Продолжить», open the inventory again | UE4SS.log «окно инвентаря родилось заново (поколение A → B): виджеты прежнего окна забыты…» then «кнопка «Настройки модов» поставлена…»; the button stands | — |
| G3 | After G2: open the list by a real click, then close the inventory with the list open | the list opens (J5); the close collapses the list and the button wrap; no error | — |
| G4 | After G2: close the inventory WITHOUT opening it on «Снаряжение» first (Tab straight to «Хар-ки», then Esc) | no call on an old widget: no Lua error, no crash | — |
| G5 | Neighbours: the Hosav «Настройки интерфейса» button and the Inventory Compactor buttons in the same bar | click as before | — |
