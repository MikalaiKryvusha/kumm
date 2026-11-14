# Run report — Conan: the Esc-menu flag cleared on the full-screen close (bug 100)

## Work

Bug 100 (found during bug 94's tests): after a remote Esc-menu cycle the next hub opening ran at the Esc menu's 0.0001. Basis — the bug document (symptom from
the UE4SS log, the cause read in `krinik_pause_in_menu.lua`).

## Contour

The 3.1.0 game, the owner's world `Game_1`, machine lock «kumm»; KrinikConanUI deployed by `Deploy-ModPack.ps1 -Deploy -Only KrinikConanUI` (+ `set-pak-modinfo.py`);
the remote `pult.sh`: the Esc menu by `GUIModuleController:ActivateModule(FName('IngameMenu'), true, false)`, closed by `W_IngameMenu_C:TryCloseWindow()`, the hub by
`.work/arrows/open-tab.lua`, closed by `CraftingGUI_C:TryCloseWindow()`. No real input.

## Runs

- 2026-11-14 11:31–11:32 — run B100a (game PID 16444), the first version (clear on any «not open»).
- 11:33–11:35 — run B100b (game PID 38224), the edge version (`fullscreen_was and not on`, no modal).

## Checks

- Hygiene: an independent judge round on the diff.
- Functional run: the real game, read in `UE4SS.log`: B100a — «модуль IngameMenu: открыт», «SML_ModList: открыт», «признак ESC-меню сброшен», then «меню открыто:
  0.03» for the Esc menu itself — FAIL (the reset fired before the full-screen flag rose); B100b — «ESC-меню открыто: 0.0001», «SML_ModList: закрыт», «признак
  ESC-меню сброшен», «меню закрыто: 1.0», then the hub «меню открыто: 0.03», «меню закрыто: 1.0» — PASS.

## Found

- The first version's race (fixed by the edge before the commit).
- Not checked: the owner's real Esc key path (whether it ever leaves a stuck module) — the fix covers it either way.

## Traces

The game's `UE4SS.log` lines of 11:32 and 11:34 (`[KrinikConanUI:PauseGameInMenu]`). Window closures: both games closed by PID, no crash-report window.

## Verdict

pass — B100b; the owner's own play is the final check.
