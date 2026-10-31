# Run report — Conan: «ОТЗЫВ» minimizes the game at the click and shows a waiting window

**Work.** Plan 36 W37, run 4 of `testcases/TC_conan_feedback_button_2026-10-31.md` (cases W1–W4). Basis — the owner's words after his own click in the Esc
menu at 11:05: `[OWNER]` «нажатие на ОТЗЫВ в меню паузы не сворачивает игру на рабочий стол - а надо бы? чтобы игрок видел? что что-то происходит» ·
2026-10-31 11:06. His click (UE4SS.log 11:05:35) ran the collector 22 s with the game full-screen; a second click at 11:05:41 started a second collector.

**Contour.** Game `D:\Games\Conan Exiles 3.0.1`, desktop 1920×1080 (the stream's display at this hour); pack `ConanExiles` at `46e2069` + the collector edit
(`_config/player-report/collect-report.ps1`, copied to `_unpacked/KrinikConanUI/ue4ss/feedback/` and deployed by `Deploy-ModPack.ps1 -Deploy -Only KrinikConanUI`
11:10, then hot-copied twice into the game folder after each fix); save — the oasis save, restored from `_save-backup/2026-10-31_1004-before-w13-arrows` after the
game closed. Machine lock `kumm` 11:10:28–11:20.

**Runs.**
- 11:10:35 `launch-bg.ps1` → main menu (log 11:10:59) → 11:11:27 `mouse-seq.ps1 -Seq "move:0.378/0.321,wait:600,lclick,wait:300"` → screen frame 11:11:36.
- 11:12:41 the collector started as the game starts it (`cmd /c start "" /min powershell … -Feedback`), frames 11:12:44 / 11:12:47 with `IsIconic`.
- 11:13:44 and 11:14:47 real clicks on the plate after each fix (game restored by `ShowWindow 4` first), screen frames 11:13:54 / 11:14:59.
- 11:19:58 two collectors 1.5 s apart, process count at +3 s; 11:20:4x `close-game.ps1` (clean, 4.1 s, no crash reporter), `save-restore.sh`.

**Checks.**
- Hygiene: `PSParser` on the collector — 0 errors after each edit; the mirror pair and the game copy — `cmp` equal.
- Functional run: the plate clicked by the real mouse in the main menu; read — `UE4SS.log` click lines, `IsIconic` of the game and of the collector's window, the
  screen frames, the desktop zips and their times.
- W1 pass (third try): the game minimized at the click, the waiting window centred in front. W2 partial (1080p only). W3 pass. W4 pass for the zip and the address box.

**Found.**
1. The waiting window came up minimized: `start "" /min` gives «minimized» to the process's first shown window (`IsIconic` true, 11:12:44). Fixed by
   `WindowState Normal` + `ShowWindow(SW_RESTORE)` after `Show()`.
2. The text sat against the left edge and the window off centre: a form's `Padding` applies only to docked controls; `CenterScreen` places the window before
   its size is set. Fixed: size from the label + 1.2 × font height margins, centred on the work area.

**Traces.** Frames in the session scratchpad `fb/` (`w1_screen.jpg`, `w5_*.jpg`, `w7_screen.jpg`, `w8_box.jpg`, `w4_box.jpg`); `UE4SS.log` lines 11:11:27, 11:13:44,
11:14:47. Window of crash reports: none appeared.

**Verdict.** partial — W1, W3, W4 pass at 1080p; the waiting window at 4K / 300 % not seen.
