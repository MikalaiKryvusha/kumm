# Run report — bug 85 after judge round 2: the fixes, the remaining cases (K1, K2, N1, N2, N6–N9) and the new J1–J7

## Work

`testcases/TC_conan_keybinds_to_game_events_2026-11-18.md`: the remaining cases of the wrap design and the cases J1–J7 born from judge round 2 (8 findings:
`reports/` — the judge's report is quoted in the chat of 2026-11-18 21:08; verified one by one below).

## Contour

The build `D:\Games\Conan Exiles 3.1.1`; KrinikConanUI pak of 20:38 (no double-click overrides yet) + the Lua of the working tree after the judge-2 fixes
(deployed 21:13 by `Deploy-ModPack.ps1 -Deploy -Only KrinikConanUI`, 114 / 0); the owner's world save; the game in front (`launch-fg.ps1`), real mouse and
keys by `mouse-seq.ps1` only while `owner-idle.ps1` read FREE (the owner came and went during the run — every BUSY refusal kept).

## Runs

1. 2026-11-18 21:13:53 — `launch-fg.ps1` (PID 28080); the main menu at 21:14:34 («menu W_MainMenu_MainMenu_C: hook KrinikFeedbackClicked set»).
2. 2026-11-18 21:15 — K1 attempt: `feedback_click.ps1` (KUMM `.work/bug85/`) failed in my own script (the ru-RU culture wrote «0,3797» — nothing sent), then a BUSY
   refusal (the owner at the keyboard) — K1 not run.
3. 2026-11-18 21:16 — `enter-world-remote.sh` (world in 10 s).
4. 2026-11-18 21:17:05–21:17:23 — a real Esc → the Esc menu; K2: `feedback_click.ps1 -X 0.5797 -Y 0.3347` (two presses 150 ms apart on «ОТЗЫВ»).
5. 2026-11-18 21:18 — `game-front.ps1` then a click on «Настройки» of the Esc menu: the game stayed MINIMIZED (the collector had minimized it; `game-front.ps1`
   called SW_SHOW) — the click went to the owner's screen under the cursor (right side, ≈ 61 % of the height). Tool defect, fixed (Found 3).
6. 2026-11-18 21:19:47 — real Esc (closes the Esc menu) + Tab → the hub (frame `r2_inv.jpg`).
7. 2026-11-18 21:20:13 — J2: two presses 120 ms apart on «Настройки модов» (frame `r2_j2.jpg`).
8. 2026-11-18 21:21:00 — the entry «Моды Krinik'а» → our window (frame `r2_win.jpg`); 21:21:14 — J1: two presses 120 ms apart on «Резкий зум».

## Checks

Hygiene: the game-thread guard after its fix — the pre-fix tree bddc495: exit 1, all 5 binds (the `pcall(RegisterKeyBind, …)` form among them, missed before);
the install: 0; `_unpacked`: KrinikConanUI and the other Krinik mods (the `ue4ss/Scripts` layout, skipped before) — 0; hits only in the switched-off probes and
the folder HosavRU outside the manifest. `luac -p` on the four changed Lua files.
Functional run: the real game by the player's path, the real mouse and keys, the UE4SS log and the frames READ:

- J7 / K2 — PASS: «click in W_IngameMenu_C -> start … collect_report.ps1» at 21:17:22.81, «click ignored (debounce)» at 21:17:23.06; the collector PID 38068 seen 4.0 s
  after the click and stopped by PID; desktop zips 0 → 0; the game alive.
- N2 — partial: the Esc menu opens by the real Esc, the hook of W_IngameMenu set, «Продолжить игру» area and the mod list drawn; the list shows ONE Krinik mod on top
  (Found 4); the «Настройки» click lost to the minimized window (run 5) — not run.
- J2 — FAIL (judge finding 1 confirmed): two presses 120 ms apart on «Настройки модов» — the list opened and STAYED open; the second press produced no event.
- J1 — FAIL (judge finding 1 confirmed): two presses 120 ms apart on «Резкий зум» — ONE line «click: check cam_sharp → true».
- Focus at the window's opening (judge finding 4 fix): no «focus step … failed» line at 21:21:00.

## Found

1. Judge finding 1 (a quick second press is lost — Slate sends it as a double click) — CONFIRMED in the game (J1, J2). The kit fix (an `OnMouseButtonDoubleClick`
   override calling the same event) crashed the kit editor twice in `AddCallFunctionNode` (runs 21:13 and 21:14, `.work/bug85/kit_dbl_run1.log`, `run2.log`).
2. Judge findings 2, 7 (the guard) — confirmed by reading, fixed, proven red on bddc495 (above).
3. Tool defect: `game-front.ps1` (SW_SHOW) and `mouse-seq.ps1` (the focus proof) passed a MINIMIZED game as «in front» — a real click reached the owner's screen.
   Fixed: both restore a minimized game (SW_RESTORE) and refuse when it stays minimized. Also seen: `game-front.ps1`'s F24 tap makes `owner-idle.ps1` read BUSY
   for 10 s (my own input, not the owner's).
4. `krinik_pause_in_menu.lua` `krinik_mods_on_top`: «the text starts with Krinik → done» — since KrinikConanGraphics loads first, the other eight Krinik mods stay at
   the bottom of Simple Modlist's list (a visual defect, the owner's interview 027). Fixed: compare the sorted text with the shown one. Not yet seen in the game.

## Traces

`D:/Games/Conan Exiles 3.1.1/ConanSandbox/Binaries/Win64/ue4ss/UE4SS.log` (21:13–21:22); frames `KUMM/.work/bug85/r2_menu.jpg`, `r2_esc.jpg`, `r2_inv.jpg`,
`r2_j2.jpg`, `r2_win.jpg`; kit logs `KUMM/.work/bug85/kit_dbl_run1.log`, `kit_dbl_run2.log`.

## Verdict

partial — in progress (K1, N1, N2, N4–N9, J5, J6 and the double-click fix owed).
