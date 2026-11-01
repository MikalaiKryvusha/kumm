# Run report — 2026-11-01 · Simple Minimap «Показ времени» in Russian (kismet.py learns the event graph)

## 1. Work

Bug 64 item 48: the minimap settings dropdown read English «Server» / «Game» / «Client». The literals sit in `SM_UI_Settings` bytecode, the choice is parsed
by a switch-on-string in `ExecuteUbergraph_SM_UI_Settings` that writes the int `timeDisplay`; `kismet.py` refused literals inside the event graph. Basis —
the notes `games/ConanExiles/mods/Simple_Minimap.md` → Open.

## 2. Contour

Pack tools `_config/devkit/kismet.py` (now patches the event graph and shifts the event stubs' `ExecuteUbergraph(EntryPoint)` constants, self-check: every new
entry is a statement start), `patch-mod-asset.py build`; Conan 3.0.1 with the full build, background launch, the owner's save copied before and restored after.

## 3. Runs

- 2026-11-01 05:44–05:46 — regression `python -I -X utf8 _config/devkit/rebuild-krinik-paks.py --only <mod>` for JaarFishing, Simple_Minimap, UIMod_Hosav.
- 05:46 — `patch-mod-asset.py build Simple_Minimap SM_UI_Minimap <work> …SM_UI_Settings.tsv SM_UI_Settings …` with `lit:Server\tСервер`, `lit:Game\tИгра`,
  `lit:Client\tКомпьютер`; pak into the library `_krinik-modified/3719513784` (the old one kept in the session scratchpad), `Deploy-ModPack.ps1 -Deploy -Only "Simple Minimap"`.
- 05:47–05:50 — game: `launch-bg.ps1`, `enter-world-remote.sh`, `walk-mod-windows.sh <dir> SM_UI_Settings`, `pult.sh` calls on `SM_UI_Settings_C`
  (`GetOptionAtIndex`, the bound `OnSelectionChanged` handler, `timeDisplay`), `close-game.ps1`, `save-restore.sh`.

## 4. Checks

Hygiene: `py_compile`; the regression rebuilds — 3 of 3 byte-equal to the installed paks (the old `lit:` and `dbl:` edits unchanged).
Functional run: the settings window opened in the live world; its frame read; the dropdown driven by the remote through the mod's own handler.

| Case | Status |
|---|---|
| build | pass — each literal replaced in 3 places, 20 event entry points shifted by 25, self-checks green |
| the window | pass — «Показ времени: Сервер» (frame `w_SM_UI_Settings.jpg`), no crash |
| the options | pass — 3 options, 12 / 18 / 8 bytes of UTF-8 = «Сервер», «Компьютер», «Игра» |
| the switch | pass — the handler with «Игра» → `timeDisplay` 2, «Компьютер» → 1, «Сервер» → 0 |
| script errors | pass — none from the minimap in `ConanSandbox.log` |
| the open list by the mouse | not observed — the combo popup is a separate Slate window: PrintWindow does not capture it and the focus return closes it |

## 5. Found

1. `kismet.py` could not lengthen a literal inside `ExecuteUbergraph_*` — fixed (event stubs' entry constants shifted, self-check on statement starts).
2. The knowledge-hook took «Simple» from `-Only "Simple Minimap"` and demanded `Simple.md` — fixed (quoted names; the notes file by `_` or no spaces; selftest all ok).

## 6. Traces

Session scratchpad `smb2.log` (the build), `smw/` (frames), `Simple_Minimap.before.pak` (rollback copy); regression logs `reg_*.log`.

## 7. Verdict

pass — the dropdown reads Russian and the choice still maps to the same `timeDisplay`; the open list itself not seen by eye (popup capture).
