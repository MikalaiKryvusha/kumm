# Run report — ConanModPackStatus main-thread freeze (bug 68)

## 1. Work

 The fix of bug 68 against `testcases/TC_conan_modpackstatus_main_thread_freeze_2026-10-29.md` (cases F1–F5).

## 2. Contour

 Conan Exiles Enhanced 3.0.1, the 3.0.1 build (66 paks), `ConanModPackStatus` from pack commit `891c038` copied into
`ue4ss/Mods`; the owner's save, hero idle on the beach; 3840×2160; the owner watching (no movie word asked — the comparison is spikes, not medians).

## 3. Runs


- 2026-10-29 10:4x (before, old mod): `PresentMon-2.5.1-x64.exe --process_name ConanSandbox-Win64-Shipping.exe --output_file pm_freeze.csv --timed 30 --terminate_after_timed`
- 2026-10-29 10:44:58 launch (`launch-bg.ps1`), 10:46:10 world (`enter-world-remote.sh`), 10:47:00 the same PresentMon command → `pm_after.csv`
- 10:47:3x `capture-window.ps1 -Width 3840` → HUD frame, compared with the 10:28 frame

## 4. Checks


Hygiene: `luac -p main.lua` OK; `check-lua-game-thread.py` — 0 worker-thread calls.
Functional run: the game with the fixed mod on the owner's save (3.0.1 build, 4K) — frame times by PresentMon, the HUD frame and `UE4SS.log` read.

- F1 pass — before: 14 spikes 107–124 ms every 2.12 s, max 123.9 ms; after: 0 spikes, p99 19.2 ms, p99.9 20.5 ms, max 20.9 ms.
- F2 pass — «наблюдение окончено: СБОРКА: моды 66/66 · самый долгий тик 141.0 мс» at 10:46:50 (the worst tick is in the first minute — menu and loading).
- F3 pass — «HUD W_SmoothHP_C: живых на экране 2, масштаб выставлен на 2 (x1.25)»; per creation 0–3 ms; the HUD frame matches the 10:28 frame in size and layout.
- F4 pass — the "before" run is the control.
- F5 partial — the main menu at startup: «меню: найдено элементов к гашению 2 из 2», «меню по созданию: 57.0 мс» (in the menu, outside the gameplay budget); exit from the world to the menu — not run.

## 5. Found

- The first-minute tick still costs up to 141 ms (log scan + modal search while the world loads) — inside loading, not gameplay; noted, not fixed.

## 6. Traces

 `ue4ss/UE4SS.log` 10:45:08–10:46:50; scratchpad `pm_freeze.csv`, `pm_after.csv`, `hud_scale_ab.webp`.

## 7. Verdict

 pass (F5 partial: exit-to-menu path not walked).
