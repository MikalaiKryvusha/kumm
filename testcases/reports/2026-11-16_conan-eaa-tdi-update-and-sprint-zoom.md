# Run report — EAA and TDI_LegendaryRepair on their 2026-11 uploads; the aim zoom vs the sprint (remote half)

## 1. Work

`testcases/TC_conan_mod_updates_and_sprint_zoom_2026-11-16.md` (U1–U4, Z0–Z6) — the owner's orders 18:40 (zoom vs sprint, bug 93) and 18:47 (take the authors' updates,
adapt them to the build, no more waiting for other authors — plan 53 step 12 unparked).

## 2. Contour

Conan Exiles Enhanced 3.1.0 (`D:\Games\Conan Exiles 3.1.0`, CL 383024) with the build; the owner's last save (Continue), background path, machine lock 18:52–19:00, god on.
EAA 3718199031 upload of 2026-11-16 11:57 (v1.3.13), TDI 3723127994 upload of 2026-11-13 23:34; KrinikConanArchery `main.lua` md5 after the fix — deployed by `-Only`.

## 3. Runs

1. 2026-11-16 18:49 — `steamcmd.exe +force_install_dir "D:\Games\Conan Exiles Mods\workshop-2026-11-16" +login anonymous +workshop_download_item 440900 3718199031 validate +workshop_download_item 440900 3723127994 validate +quit`.
2. 18:50 — `python -I -X utf8 workshop-swap.py <…\content\440900> before-2026-11-16 3718199031 3723127994` (plan) then `--apply`; `check-mod-updates.py --since 2026-11-03 --all` → «Новее наших копий: 0».
3. 18:50 — `Deploy-ModPack.ps1 -PackDir … -Deploy -Only TDI_LegendaryRepair`; `-Only KrinikConanArchery`.
4. 18:5x — `rebuild-krinik-paks.py --only EnhancedArmoryAndArsenal --against-original`, then the same with `--install`.
5. 18:52 — `launch-bg.ps1` (PID 27536), Continue by the remote; logs read 18:54.
6. 18:55 — `pult.sh "lua return dofile('…/KUMM/.work/sprint-zoom-probe.lua')"` (first build: FAILED — see Found); 18:56 a clean run probe; game closed by PID.
7. 18:57 — the fixed Lua deployed, `launch-bg.ps1` (PID 34504), Continue; 18:59 the probe again (native `FieldOfViewChange`); 19:00 the game closed by PID 34504, no crash window, lock released.

## 4. Checks

Hygiene: `luac -p` clean; main-chunk locals 196 (`luac -l`); `check-lua-game-thread.py` — 0 worker-thread calls.
Functional run: the build launched on 3.1.0 and READ — `ConanSandbox.log` mount lines and counters, `UE4SS.log` lines of KrinikConanModPackManager and KrinikConanArchery;
the FOV controller's mode and target read by the remote at fixed moments around a remote forward sprint.

| Case | Status | Observation |
|---|---|---|
| U1 | pass | 1474 chunks byte for byte vs the NEW original, 5 intentionally changed (the recipe's assets), installed |
| U2 | pass | «СБОРКА: моды 66/66»; EAA v1.3.13 and TDI mounted; «too old» 0, missing imports 0 |
| U3 | partial | by the build only (the spawn table among the recipe's changed chunks) |
| U4 | not run | — |
| Z0 | pass | the BaseBPCombat_C path hooked |
| Z1, Z2, Z4 | pass by the remote | mode 1 / 75.0° · mode 2 / 102.1° · the aim asked in a sprint: 102.1° kept, mode 2 within 0.3 s |
| Z3, Z5, Z6 | not run | the remote run never releases the sprint key — real keys on a FREE PC |

## 5. Found

- the first sprint-zoom build used `FieldOfViewReset()` (a toggle back to the PREVIOUS target, game map) and a bare `SetFieldOfViewTarget`: the controller stuck in mode 1 with
  the normal angle and the sprint FOV lost — fixed in the same session (EXP-0540);
- the controller has a third mode, 2 = sprint (×0.95) — written into the game map.

## 6. Traces

`D:\Games\Conan Exiles 3.1.0\ConanSandbox\Saved\Logs\ConanSandbox.log` and `…\Binaries\Win64\ue4ss\UE4SS.log` (overwritten at the next launch — the key lines are quoted here);
the probe `KUMM/.work/sprint-zoom-probe.lua`; EAA originals `D:\Games\Conan Exiles Mods\_patch-originals\EnhancedArmoryAndArsenal{,.before-2026-11-16}.pak`.

## 7. Verdict

partial — the updates are in and mount clean (U1, U2 pass); the zoom's remote half passes; Z3, Z5, Z6 and the live table reads (U3, U4) are owed.
