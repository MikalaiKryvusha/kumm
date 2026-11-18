# Run report — bug 85: KrinikConanUI without key binds (the wrap design) by the player's path

## Work

Cases K3, K4, K5, K6, K8, K9 and the neighbour N3 of `testcases/TC_conan_keybinds_to_game_events_2026-11-18.md` on the wrap design (bug 85 after judge round 1).

## Contour

The build `D:\Games\Conan Exiles 3.1.1`, KrinikConanUI pak built 20:38 (`kit-buildmod.py`: W_KrinikClickWrap, W_KrinikClickCatcher, our window's KrinikMouseDown / KrinikEsc,
the menus' KrinikFeedbackClicked) and the Lua of the pack commit `fix(KrinikConanUI): bug 85 …` plus the focus fix; the owner's world save; runs 1–2 in the background
with keys posted by `post-key.ps1`, run 3 with the game in front and the real mouse and keyboard under the owner's word 20:41 «комп и клава твои».

## Runs

1. 2026-11-18 20:39–20:40 — `Deploy-ModPack.ps1 -PackDir D:/work/ai_sandbox/ConanExiles -Deploy -Only KrinikConanUI` (114 / 0); `launch-bg.ps1`; `enter-world-remote.sh`;
   `pult.sh "… open-tab.lua"`; `ActivateModule('KrinikModSettings', true)`; `post-key.ps1 -Key Escape` ×2.
2. 2026-11-18 20:41–20:42 — after the focus fix: the same, then `post-key.ps1 -Key Tab` ×2.
3. 2026-11-18 20:43–20:44 — `game-front.ps1`; `capture-window.ps1 -Width 1280`; `mouse-seq.ps1 -Seq "move:0.0766/0.961,lclick"` (the mods button), `move:0.55/0.35,lclick`
   (outside), `move:0.0766/0.739,lclick` (the entry «Моды Krinik'а»), `move:0.778/0.5,lclick` ×2 (a checkbox), `move:0.242/0.285,lclick` (a mod name),
   `kdown:0x1B,kup:0x1B` (Esc), then Esc + ten `lclick` in gameplay; `close-game.ps1` (no crash reporter).

## Checks

Hygiene: `python -I -X utf8 _config/check-lua-game-thread.py` — 0 worker-thread calls on the install (K9) and on `_unpacked/KrinikConanUI`; every changed Lua file parses.
Functional run: the real game, the owner's world, by the player's path (run 3 — the real mouse and keyboard); the UE4SS log and the frames READ.

- K5 — run 1 FAIL: a posted Esc did not reach our window (`bIsFocusable` false, no focus) → the fix: the window is made focusable and focused at its opening;
  run 2 PASS (posted Esc: ours false, hub true); run 3 PASS by the REAL Esc (log «closed (Esc)», the hub stays).
- K8 — PASS: Esc and Tab close the hub; the hub controller logs «хаб закрыт» (its ActivateModule hook alone).
- K6 — PASS by the real mouse: the button opens the list (frame `k6a.jpg`: «Моды Krinik'а · Моды Xevyr'а · Рыбалка · Прочее» above the button); a press outside
  closes it (log «щелчок мимо списка — список закрыт»); the entry opens our window (log «пункт «Моды Krinik'а» — открыто окно KrinikModSettings»).
- K4 — PASS by the real mouse: the checkbox «Резкий зум» → true → false (log «click: check cam_sharp»); the mod name → «page ui».
- K3 — PASS: ten gameplay LMB presses — the game alive, 0 lines of the feedback, mods-button and settings sections, 0 errors.
- N3 — PASS: the hub slows the world (0.03, the craft multiplier 0.03) and the close returns 1.0.
- Not run: K1, K2 (a real press on the feedback plate starts the collector — a zip on the owner's desktop and windows; the hook line «menu W_MainMenu_MainMenu_C: hook
  KrinikFeedbackClicked set» seen), K7 (by decision — bug 108), C1, N1, N2, N4 (the mouse / Q / E part), N5–N9.

## Found

1. Our window was not focusable: a key never reached its OnPreviewKeyDown — fixed in `krinik_mod_settings.lua` (focus at the opening), re-run PASS.
2. The kit editor crashed once in `AddCallFunctionNode` (run 7) right after a kit asset was deleted from disk; the next run was green.

## Traces

`D:/Games/Conan Exiles 3.1.1/ConanSandbox/Binaries/Win64/ue4ss/UE4SS.log` (20:39–20:44); frames `KUMM/.work/bug85/inv.jpg`, `k6a.jpg`, `k4.jpg`; kit logs `KUMM/.work/bug85/kit-run7.log`
… `kit-run9.log`, `buildmod2.log`.

## Verdict

partial — K3, K4, K5, K6, K8, K9 and N3 pass on the real game by the player's path; K1, K2, N1, N2, N4–N9 are owed (the next chat), and judge round 2 on the diff.
