# Run report — Conan: the «ОТЗЫВ» plate in the Esc menu, the 63 ms click, three worker-thread delays, the notification window

**Work.** Plan 36 W37 cases F5–F11, M0, M1, N1, P1 of `testcases/TC_conan_feedback_button_2026-10-31.md` (run 2), after the fixes: the collector by
`io.popen`; `ExecuteInGameThreadWithDelay` in `krinik_feedback` and `krinik_pause_in_menu`; `KrinikMenuProbe` read-only again; the collector's address
box `MB_TOPMOST`. Basis — the owner's words in the case file; «после рабочего стола беремся за конана в автономном режиме» · 2026-10-31 07:40.

**Contour.** Game `D:\Games\Conan Exiles 3.0.1`, window 1920×1080 (the owner watches over the Vibepollo stream; `query session` — console only), pack
`ConanExiles` at `80e7b9a` + the uncommitted fixes deployed by `Deploy-ModPack.ps1 -Deploy -Only KrinikConanUI,KrinikConanHarness` 07:44; save — the
oasis save, copied first to `D:\Games\Conan Exiles Mods\_save-backup\2026-10-31_0744-before-feedback-esc` and restored from it after each game exit
(`save-restore.sh`, integrity ok). Machine lock `kumm` 07:44:51–07:56.

**Runs.**
- 07:44:59 `launch-fg.ps1` (PID 23228) → 07:46:36 `mouse-seq.ps1 -Seq "move:0.378/0.311,wait:600,lclick,wait:4000"` (main-menu plate) →
  07:48:38 `enter-world-remote.sh` under the window the collector had minimized → **crash 07:49:03** (D3D12, below); `CrashReportClient` PID 21028 closed.
- 07:50:30 `launch-bg.ps1` (PID 35600) → `enter-world-remote.sh` (not minimized, 22 s) → 07:52:41 minimize 10 s / restore (scratch `minimize-test.ps1`) →
  07:53 `esc-when-idle.ps1 -Min 4` → `capture-window.ps1` → 07:53:31 `mouse-seq.ps1 -Seq "move:0.5425/0.341,…,lclick"` (Esc-menu plate) → 07:54
  `pult.sh 'lua … 1000 × IsVisible + IsHovered …'` → `pult.sh "lua …ActivateModule(FName('ExilesFishingTuning'), true, false)…"` → 07:55
  `close-game.ps1` (closed cleanly 6.2 s, no crash reporter).

**Checks.**
- Hygiene: `check-lua-game-thread.py` on the game folder — 0 (F8); `PSParser` on `collect-report.ps1` — 0 errors; the mirror pair `cmp` — equal.
- Functional run: both menus walked by real Esc and real mouse clicks on the plate at 1080p over the stream; read — `UE4SS.log` lines of the section,
  the desktop zip, the collector's windows (`EnumWindows` by PID: title, topmost), a screen frame, the remote's results.
- F9 pass — the main-menu click: «slow click check: 3.000 ms» (was 63). F10 pass. F5b pass — the plate under «1.0.0» under our logo, left of the game
  logo. F6b pass — «click in W_IngameMenu_C», 4 ms, zip 879 KB, game minimized, Explorer with the zip, the box in front. F7b pass — 0.009 ms per check.
  F11 pass (top) — box `topmost=True` after the foreground went back to the owner's window. N1 pass in the menu (`vis=4`). M1 pass. P1 pass. M0 skipped
  (reasoned in the case file).

**Found.**
1. The address box was NOT on top (F9, 07:47): `topmost=False` — a hidden TopMost WinForms owner does not pass the flag; it slid under VS Code when the owner
   typed, and the mail waits behind it. Fixed (`MessageBoxW` + `MB_TOPMOST | MB_SETFOREGROUND`), F11.
2. World entry under a minimized game window crashed the game (07:49:03): «Check 'DestX + (CopyBox.right - CopyBox.left) <= SubresourceWidth' failed …
   [8, 8, 1] … [1920, 1080, 1]» → D3D12 `E_INVALIDARG` fatal. The agent's path only; `enter-world-remote.sh` now restores the window first (case G1).
3. `KrinikMenuProbe` collapsed the game's queued-notification window after every start since 2026-10-25 (EXP-0401). Removed.
4. Three worker-thread delays live in the game (EXP-0400). Fixed.
5. Bug 64 item 8 is back at 1080p: the Simple Modlist «ID модов» box over «Играть без подключения» (frame 07:53). Reopened in `bugs/64`.

**Traces.** `UE4SS.log` and `ConanSandbox.log` of the runs (lines quoted in the case file); frames — review folder 21 (`D:\Games\Conan Exiles Mods\НА
ОТСМОТР НИКОЛАЕМ\21 …`): the main menu 07:45 and the Esc menu 07:53 at 1080p; the screen frame of the Esc-menu click.

**Verdict.** pass — the plate works end to end in both menus; the click no longer stalls the game; findings 1–4 fixed in the same run, 5 reopened.

## Run 3 — the plate 10 lower, the enter-world guard (08:01–08:05)

- Kit `FEEDBACK_BELOW_VERSION` 34 → 44 (`[OWNER]` «10 пикселей» · 07:47): `kit-conanui-edit.py` ok=True 07:58 (main menu plate at top 326.9, Esc menu 325.2),
  `kit-buildmod.py` 08:01, 8 overrides in the pak (`mod-overrides.py`), deployed `-Only KrinikConanUI` 08:01.
- 08:01:26 `launch-bg.ps1` (PID 36552) → frame → `mouse-seq.ps1 -Seq "move:0.378/0.321,…,lclick"` 08:03:24 → `enter-world-remote.sh` under the minimized
  window → `esc-when-idle.ps1` → frame 08:05.
- Functional run: L1 pass (10.8 px at 1080p), L2 pass (12 px, ±1 measuring), L3 pass (click 6 ms at the new place), G1 pass (window restored, world in 22 s,
  0 RHI errors). The owner 08:22: «отступ на 10 ниже хорошо, нравится». Pairs «было | стало» — review folder 21, files 4–5.
