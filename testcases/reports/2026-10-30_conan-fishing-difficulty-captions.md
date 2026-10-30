# Run report — Conan: fishing panel difficulty captions on one line with bars (plan 36 W18a)

**Work.** `KrinikConanUI:PauseGameInMenu` 0.14.0 `fix_fishing_captions`; cases `testcases/TC_conan_fishing_difficulty_captions_2026-10-30.md` C1–C4;
basis — the owner's word 2026-10-30 ≈08:15 (in the case file).

**Contour.** Conan Exiles 3.0.1 with the build; the background launch path; the owner's save copied to `_save-backup/2026-10-30_1642-before-w18a-2` and
restored by `save-restore.sh` (integrity ok); locks 16:38–16:40 (look) and 16:42–16:47 (run).

**Runs.**
- 16:39 `launch-bg.ps1` · `enter-world-remote.sh` · `ActivateModule('ExilesFishingTuning')` · frame — the BEFORE state; the captions' justification set live to
  Left · Center · Center · Right — no visible change (already so); `close-game.ps1`, restore.
- 16:43 deploy `-Only KrinikConanUI` (separator of three spaces) · launch · open · frame — one line, but wider than the slider (left edge 17 px past the column).
- 16:44 live `SetText` with one space, two spaces, a space + thin space each side of the bar · frames — only one space fits the slider width.
- 16:46 separator one space, deploy · launch · open · frame (C1) · `TryCloseWindow` of the live panel · open again · frame (C3) · UE4SS.log (C2) · `close-game.ps1` · restore.

**Checks.**
- Hygiene: `luac -p` ok.
- Functional run: the real game, the real panel opened twice; read — two frames and the before frame cropped side by side, the log lines.
- C1 pass · C2 pass («одной строкой через черты в 1 панелях» on each open, no error) · C3 pass · C4 pass.

**Found.** none. Note for the owner's eye: with equal gaps the middle words no longer stand exactly under the slider's stops (the ends do).

**Traces.** The strip `D:\Games\Conan Exiles Mods\НА ОТСМОТР НИКОЛАЕМ\9 рыбалка — подписи сложности\было-стало-переоткрытие.webp` with `0 ЧТО СМОТРЕТЬ.txt`;
UE4SS.log of the 16:46 session. No crash-report window («none of the agent's run»).

**Verdict.** pass — the look waits for the owner's eye.
