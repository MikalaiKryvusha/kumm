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
| K1 | Main menu: a real click on the feedback plate | the section logs the click in `W_MainMenu_MainMenu_C`, the collector starts once; a second click within 5 s is ignored | — |
| K2 | Esc menu: a real click on the feedback plate | the same in `W_IngameMenu_C` | — |
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
| N1 | Main menu: «Продолжить», «Новая игра», «Настройки», the mod list (Simple Modlist) — real clicks (the kit added nodes to the menu's Construct chain) | each opens as before; the backdrop movie plays (bug 71) | — |
| N2 | Esc menu: «Вернуться», «Настройки», «Выйти в меню» — real clicks; the Krinik mods at the top of the mod list | as before | — |
| N3 | Inventory: the world slows (0.03) and returns to 1.0 on close; craft at real speed | the pause section's log lines as before | — |
| N4 | Hub: tab switches by mouse, Q / E; close by Esc, Tab and the close button | our pages collapse on every close (log «хаб закрыт»), no bare-world frame | — |
| N5 | The inventory's bottom bar: the other buttons (Hosav «Настройки интерфейса» collapsed, Inventory Compactor) click as before beside our wrapped button | as before; the wrap takes no extra width | — |
| N6 | Our window: drag a slider, pick a key in the key selector — the preview mouse / key overrides return Unhandled | the slider moves, the key is taken (the busy plate for a taken key) | — |
| N7 | Our window over the hub: Esc closes it, the camera / pack-manager hooks see the close (a camera row change applies at once) | as before (H1–H8 of `TC_conan_hub_rows_audit_2026-11-01.md`) | — |
| N8 | A mod window from the list (EAA) — closes by its own close button; Esc does nothing (bug 108, known) | no crash, the hub stays | — |
| N9 | 10 min of gameplay with LMB attacks and Esc / Tab in and out of menus | no crash, no new Lua error in UE4SS.log | — |
