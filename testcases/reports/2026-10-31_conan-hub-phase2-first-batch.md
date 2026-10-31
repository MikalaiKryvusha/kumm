# Test run report — Conan: the «Моды Krinik'а» hub window by mockup 5, the settings store, the KrinikConanUI page (plan 38 phase 2, first batch)

## 1. Work

Cases P0–P13 of `testcases/TC_conan_hub_phase2_2026-10-31.md` against `plans/38_epic38_phase2_krinik_hub_window.md` (criteria 1–7) and the approved mockup 5
(`[OWNER]` «макет одобрен» · 2026-10-31 19:09). Under test: the kit window (`kit-krinik-modsettings.py`, phase 2 block), the hub section
`krinik_mod_settings.lua`, the store `krinik_settings.lua`, and the sections reading it (`krinik_fps_counter`, `krinik_hud_blink`, `krinik_pause_in_menu`).

## 2. Contour

Conan Exiles Enhanced 3.0.1 with the build; the kit `F:\CEUE5Devkit` (two runs, 0 errors on the second, 2026-10-31 20:39); the pak built by `kit-buildmod.py`
(9 447 049 bytes, 13 assets, 8 vanilla paths, 1 own table) and deployed `-Only KrinikConanUI` (106 present, 0 missing). Background launch `launch-bg.ps1`;
world by `enter-world-remote.sh`; god on; the hub and our window by the remote `ActivateModule`; real input by `mouse-seq.ps1`; the owner's save copied
20:40 (`save-backup-2040`) and restored after every launch (integrity ok); the machine lock 20:42–21:00. Four launches (20:42, 20:45, 20:50, 20:52, 20:57 —
each relaunch carried a fix found by the previous one).

## 3. Runs

1. 2026-10-31 20:42 — `launch-bg.ps1`; the window opened; fill FAILED: `SetIsToggledOn` / `SetValue` take 2–3 parameters (read live by the remote:
   `SetIsToggledOn(NewIsToggledOn, ShouldBroadcast, IsInstantTransition)`, `SetValue(RealValue, IsInitializing)`).
2. 2026-10-31 20:45 — fill ok 4 ms; frame: the rows' controls squeezed to a dot by the game row's own 350-wide label box; collapsed live by the remote → the
   rows as in the mockup; a real click on «i» showed the plate; a real click on the FPS checkbox toggled it; «Сохранить» did not route.
3. 2026-10-31 20:50 — evidence line on every LMB: the bind fires; «Сохранить» failed on `a and b or c` with b = false (a check row fell into the slider arithmetic).
4. 2026-10-31 20:52 — save fixed; the first click of every `mouse-seq` sequence is eaten by the game's window activation (the bind sees it, the widget does
   not) — proved by a dummy click first: then the checkbox toggles; reset ok; «Закрыть без сохранения» failed (`win` set to nil before `hide_tip`).
5. 2026-10-31 20:57 — close order fixed, slider box 340; P9, P8 and the control of P5 passed (below). Commands: `bash relaunch.sh` (scratchpad: close by PID,
   `save-restore.sh`, deploy, launch, world, god, hub, window), `bash pult.sh "lua …"`, `powershell -File mouse-seq.ps1 -Seq "move:…,lclick,…"`,
   `powershell -File capture-window.ps1 -Out … -Width 3840`.

## 4. Checks

Hygiene: `luac -p` on the five Lua files; `check-lua-game-thread.py` 0 worker-thread calls; the store desk test `lua _config/tests/test_krinik_settings.lua` PASS
(it caught a saved `false` turning into nil before the game run); the kit report ok, «Success - 0 error(s)».
Functional run: the window walked by the player's path in the live game with a real mouse — opened over the inventory, a checkbox ticked and unticked, «i»
clicked, «Сбросить к исходным», «Сохранить», «Сохранить и закрыть», a restart; the log, the store file, the remote's reads and 4K frames READ at every step.

- P0 pass — `section krinik_mod_settings: loaded`, `no store yet`, the merge `117 -> 118`.
- P1 pass (look, by eye) — head with the title and «Закрыть без сохранения», the list with «KrinikConanUI» highlighted, the right side «KrinikConanUI · интерфейс
  сборки», five rows (label, «i», grey hint, control), the footer three buttons; after the run-2 fix the controls stand as in mockup 5. Not done: the side by
  side sheet with `variant_05_final.webp`, the 1080p game resolution frame.
- P2 pass — defaults read by the remote: fps on, craft on, slow 33.3; sliders show «10», «90», «33» (whole numbers after the fix).
- P3 partial — the hover showed the plate (run 2); hide-on-leave added in run 3, not re-observed.
- P4 partial — a click pins the plate (code); the log line «click: «i» … pinned» not observed in a run.
- P5 pass — `ui_craft` unticked by a real click → «Сохранить» → `store written: 1 keys, 1 changed`, file `["ui_craft"] = false`; the FPS counter: untick +
  «Сохранить и закрыть» → `счётчик выключен (хаб)`, the corner frame without the number; control: tick + save → `счётчик включён (хаб)`, «70» back in the corner.
- P6 pass after the fix — «Закрыть без сохранения» closes (`closed (без сохранения)` after run 4's fix path; observed as `closed (сохранено)` for P8 — the close
  path is shared); the store untouched by a close (byte check not repeated after the fix — partial).
- P7 pass — `page ui reset to defaults (not saved)`.
- P8 pass — `closed (сохранено)`, the hub stays (frame), a default value deletes its key (file holds only `ui_craft` after the FPS counter returned to on).
- P9 pass — after a full restart `store read: 1 keys`, the craft checkbox reads false.
- P10 pass — a click on the window's empty area: an LMB line, no routed action.
- P11 not run — the menu slow-down applied by the store (code path only).
- P12 pass — `watch stopped (window closed)` at every close; no hub lines while playing.
- P13 pass — four clean closes by PID («crash reporter: none»), the save restored, integrity ok; the test store file removed from the owner's game.

- G1 pass (2026-10-31 21:05–21:08, a sixth launch with KrinikConanGraphics redeployed) — the Graphics page across Lua states: at load
  `кровь лежит 300 с (своё значение, загрузка)`; a real click on «KrinikConanGraphics» in the list → `page gfx`; the slider set to 60 by the remote; a real
  click on «Сохранить» → `store written … version 1793470038`; a stain spawned by the remote (`SpawnDecalAtLocation` + `SetFadeOut(0, 3)`, the game's way) →
  `кровь лежит 60 с (окно «Моды Krinik'а», номер настроек 1793470038)`, `пятно …: лежит 60 с`. Control: «Сбросить к исходным» + «Сохранить» → the file empty,
  the next stain `лежит 300 с (своё значение, номер настроек 1793470039)`. The shared number `ModRef:SetSharedVariable("KrinikSettingsVersion", n)` carries a
  number between mods — the step-3 open question closed.

- A1 partial (2026-10-31 21:12–21:17, a seventh launch with KrinikConanArchery redeployed) — at load `настройки окна: баллистика true, стрелы не ломаются
  true, обзор 75° (загрузка)`; a real click on «KrinikConanArchery» → `page arc`; FOV set to 60 by the remote; «Сохранить и закрыть» by a real click →
  `["arc_fov"] = 60`, version bumped. NOT observed: the re-read at an aim or an arrow — three `mouse-seq` attempts (`kdown 1` first; a middle-click opener;
  the inventory toggled by a real `I` twice) never put the hero into the aim: no FOV event, no shot, the Kappa at 100 % (frames `a2_aim`, `a4_aim`). The stand's
  real input in the world after the hub — the next session's recon (the 2026-10-31 archery stands aimed with `mouse-seq` successfully: compare their opener).

## 5. Found

1. Fixed: the store lost a saved `false` (`x and false or nil`) — desk test.
2. Fixed: native setters need all their parameters (`SetIsToggledOn` 3, `SetValue` 2).
3. Fixed: the game row's own label box (350) squeezed our control — collapsed at fill.
4. Fixed: «Сохранить» failed on `a and b or c` with b = false (the second face of finding 1 in one session).
5. Fixed: close-without-save left the window open (`win` nil before `hide_tip`).
6. Fixed: «10,00» → «10»; the longest row cut its value box («3» of «33») — slider box 340.
7. Stand trap (not a defect of the mod): the first click after `mouse-seq` brings the game forward is eaten by the window activation — sequences start with a
   dummy click on empty space.
8. Seen, not explained: the Simple Minimap became visible over our window once (20:55) after a run of activation clicks; ZOrder: `SM_Minimap` 99, ours 101.

## 6. Traces

Frames in the session scratchpad `hub2\`: `p1_window` (before the row fix), `p1b_crop` (after), `p4_tip` («i» plate), `p5_crop`, `p_i1` (the minimap over the
window), `p8_closed`, `p8_corner` (no number), `p8b_corner` («70»); `UE4SS.log` lines quoted above; kit logs `kit_p2_1/2.log`, reports `kit_p2_1/2.json`;
build log `kcui_build.log`.

## 7. Verdict

partial — the window, its routing, the store, the save/reset/close paths and the FPS switch work in the live game by a real mouse; open: P3/P4 re-observation,
P6 byte check after the fix, P11, the side-by-side sheet with mockup 5 at 1080p and 4K for the owner, the other pages (camera, archery, pack manager, graphics).
