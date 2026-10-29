# Run report — 2026-10-29 — Conan quick batch: «XP :» gap, locomotion and FPS counter on events

## 1. Work

Cases `testcases/TC_conan_quick_batch_xp_space_locomotion_fps_events_2026-10-29.md` (X1, L1–L5, F1, F2, G1) against plan 36 W5 (a) and plan 34 W16
(`[OWNER]` «да, но аккуратно. чтобы не сломать... нужно будет ретестировать после рефакторинга их» · 2026-10-29).

## 2. Contour

Conan Exiles 3.0.1, the owner's save (level-50 hero, the beach), 4K full screen, the Conan build (64 paks + Lua mods), game in the background.
Changed: `Game.locres` (one entry), `KrinikOblivionLocomotion` 0.3.0, `KrinikFpsCounter` (event attach); deployed by `Deploy-ModPack.ps1 -Only`.

## 3. Runs

- 15:3x `python -X utf8 _config/devkit/locres-set-tr.py _config/localization/Game/ru/Game.locres _config/localization/locres-fixes-2026-10-29.tsv`
  then `python -X utf8 _config/devkit/locres-regress.py <before> _config/localization/Game/ru/Game.locres` → 54 441 / 54 441, lost 0, changed 1
- 15:34:17 `node _tools/machine-lock.mjs take --who kumm …`; `Deploy-ModPack.ps1 -PackDir ConanExiles -Deploy -Only KrinikOblivionLocomotion,KrinikFpsCounter,"Krinik Russian Translation"` → 3/3, verify 99/0
- 15:34:34 `_config/launch-bg.ps1`; 15:35:42 `_config/enter-world-remote.sh` (22 s)
- 15:36 `_config/pult.sh "lua return dofile(<heroes.lua / stats.lua>)"`; `capture-window.ps1 -Width 3840`
- 15:37 `esc-when-idle` (then a scratch script, now `_config/esc-when-idle.ps1`); 15:38:08 `pult.sh "call W_IngameMenu_C_2147453746 CloseAndReturnToMainMenu"`;
  15:38:17 `enter-world-remote.sh`; 15:38:39 `pult.sh 'lua … h:Jump() …'`; `capture-window.ps1 -Width 3840`
- 15:39:16 `_config/close-game.ps1`; `machine-lock.mjs release`; `deploy-config.py GameUserSettings.ini`

## 4. Checks

Hygiene: `luac -p` both mods OK; `check-lua-game-thread.py` — 0 worker-thread calls; `lua-globals.py` — only the UE4SS global `ExecuteInGameThreadWithDelay` (was there before).
Functional run: the game on the owner's save, entered and re-entered by the agent; `UE4SS.log` and two 4K frames read.

- X1 pass — «XP : 119,43k / 119,51k (81)», thin gap, no box glyph.
- L1, L2 pass — subscribed; the law applied on entry.
- L3 pass — «поисков героя по сцене 2» through reports #1–#3 (3 min in the world).
- L4 pass — a new hero object after re-entry, by the event.
- L5 pass — a remote jump counted.
- F1, F2 pass — the counter attached on both HUD creations; «61», «60» on the frames.
- G1 pass — no error lines of both mods; clean close, no crash reporter.

## 5. Found

- The hero's Agility reads 0 (every int stat 14–40 is 0) on the owner's level-50 hero — the Agility law of `KrinikOblivionLocomotion` may be dead in 3.0.1
  (pre-existing: the 25.10 move test passed the same 0). Open — KUMM plans/36, W16 row.

## 6. Traces

`D:\Temp\claude\d--work-ai-sandbox-KUMM\00d3c311-6415-462a-936e-eddd796d0d57\scratchpad\x1_crop.webp`, `f1_crop.webp`, `f2_crop.webp`; `UE4SS.log` of the run
(game folder, overwritten by the next launch).

## 7. Verdict

pass — all nine cases; one pre-existing finding filed.
