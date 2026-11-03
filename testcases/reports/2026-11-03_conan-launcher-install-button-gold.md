# Test run report — the launcher's «Установить сборку» stays gold without install.cmd beside it

**Created:** 2026-11-03 22:00 +03:00 · **Run by:** the agent (Claude Opus 5.5) · **Version/build:** pack ConanExiles, `_config/launcher/KrinikConanLauncher.cs` after the edit,
built by `python -I -X utf8 _config/release/build-docs.py --no-pdf` (exe 2026-11-03 21:57, pack version 0.9.0)

## 1. Work

`[OWNER]` 2026-11-03 20:54 «почему в лаунчере кнопка Установить сборку - серого цвета? Если же это основная CTA кнопка». Cause (read 20:56 in the previous
chat): `install.Enabled = File.Exists(install.cmd beside the launcher)`; the desktop shortcut «Krinik Conan» points to the launcher in the GAME root
(`D:\Games\Conan Exiles 3.0.1\KrinikConanLauncher.exe`, read from the .lnk), where install.cmd never lies — so there the main button was grey whenever the build
was not installed. Change: the button is always enabled (gold); a click without install.cmd shows a box telling the player where to run the launcher from.

## 2. Contour

A copy of the built exe alone in a scratch folder (no install.cmd, no game beside it), state forced «fresh» by `KRINIK_LAUNCHER_STATE=fresh`; desktop at 300 %.
REAL WORLD: accumulated — not the owner's game folder (the working game has the build installed, so the launcher there shows «Играть»); data and machine —
his machine; path — the same exe and the same click handler a player runs.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-11-03 21:57 +03:00 | `KRINIK_LAUNCHER_STATE=fresh KRINIK_LAUNCHER_SNAPSHOT=<dir>\fresh.png;192 <dir>\KrinikConanLauncher.exe` | the snapshot written (converted to WebP) |
| 2 | 2026-11-03 21:59 +03:00 | `powershell -File launcher_click.ps1 -Dir <dir>` (UI Automation finds the button, `PostMessage BM_CLICK`, reads the box) | «button enabled: True», the box «Установить сборку» with its text, closed |

## 4. Checks

Hygiene: the C# compiled (build-docs «лаунчер: … 4326 КБ»).
Functional run: the launcher window read by eye on the snapshot (the main button gold, «Установить сборку»); a real button message to the live window, the
message box read through UI Automation.

| Case | Status | Observed |
|---|---|---|
| L1 the main button without install.cmd | pass | snapshot: «Установить сборку» painted gold, like «Играть» (was grey) |
| L2 a click without install.cmd | pass | box «Установить сборку»: «Установщик сборки лежит в папке, куда распакован архив сборки. Откройте эту папку и запустите KrinikConanLauncher.exe оттуда — рядом с ним лежит install.cmd.» |
| L3 a click WITH install.cmd | not run this time | the handler's branch is unchanged (it ran install.cmd on 2026-10-31, report `2026-10-31_conan-launcher-main-button-by-state.md`) |

## 5. Found

none

## 6. Traces

`fresh.webp` and the click script in the session scratchpad (deleted after the commit).

## 7. Verdict

pass — L1, L2. The box's wording waits for the owner's eye.
