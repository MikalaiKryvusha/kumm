# Run report — the launcher's judge-round-2 fixes on the stand (re-run on a free machine)

- **Work:** the ten findings of `reports/2026-11-18_judge_launcher_round2.md`, fixed in the pack's working tree by the helper of 2026-11-18 (stopped before
  it could run its stand on a free machine), plus the stand's new machine guard. Basis: the round-2 report (expected behaviour per finding), plan 57
  (`plans/57_EPIC_conan_launcher_self_sufficient.md`) cases G0–G5, N1–N4, U1, H1, D1–D6b, LG1–LG4, C1, C12, RC.
- **Contour:** the launcher stand of the pack (`ConanExiles/_config/launcher/test/self.mjs`, `feed.mjs`, `stand.mjs`, `offscreen.ps1`): fake game copies
  on fake drives, a local feed on 127.0.0.1, the frames stand keeps every window off the monitors. Launcher under test: a fresh
  `make_variant.py` build, launcher 1.0.0 (`KUMM/.work/launcher_r3/build/KrinikConanLauncher.exe`, 5 534 KB, build 0.9.1). Stand bundle 1.0.0 / 1.0.1
  rebuilt with that exe (`stand.mjs … --launcher <exe>`: 89 volumes, Zip64 tail). Control exe: the pre-fix build `KUMM/.work/rcorder/build/` (pack
  `50b4bce` sources). No Conan process on the machine (checked by `tasklist` before every case).
- **Runs:**
  1. 2026-11-20 09:14:51–09:20:32 — `bash KUMM/.work/launcher_r3/batch.sh` (every case: none steam steam-old games pf many refused rc never removing
     title scan unknown around fresh-feed fresh-beside fresh-cut fresh-stop fresh-416 fresh-429 fresh-local offline lang).
  2. 2026-11-20 09:21:02–09:29:54 — control on the pre-fix exe: `EXE=<rcorder exe> TAG=old CASES="never title removing fresh-stop fresh-416 fresh-429" bash batch.sh`.
  3. 2026-11-20 ≈09:30 — the machine guard: `node self.mjs none …` with a hidden stub `ConanSandbox.exe` running (`Start-Process -WindowStyle Hidden`), then
     the same case after `Stop-Process -Id <pid>`.
- **Checks:**
  - Hygiene: none separate (the stand IS the functional run).
  - Functional run: the real launcher exe driven by the stand through the player's path (search, feed, buttons by BM_CLICK, dialogs, downloads, install,
    uninstall), its log and the window title READ by the checks; on the stand contour, not on the owner's game.
  - Run 1: 24 cases, 330 checks PASS, 0 FAIL — `ALL PASS` on every case, including the four that failed on 2026-11-18 (fresh-cut, fresh-stop, fresh-416,
    fresh-429) and the new N3, N4, H1, D5b, D6, D6b.
  - Run 2 (control): the new checks FAIL on the pre-fix exe — N3 ×3, N4 ×2 (never.txt quotes, the forbidden game around the launcher), H1 (title «1.0.0 для
    Conan Exiles Enhanced 3.2.0»), D5b (screen «unfinished» after the refusal), D6 (`dlerror` on 416), D6b (`dlerror` on 429): 31 FAIL in all, the rest
    their consequences. U1 passes on the old exe too: finding 7 was a weakness of the test, the code was right.
  - Run 3: with the stub running — one line `FAIL stand: no Conan game runs on this machine … — ConanSandbox.exe pid 25852`, exit 1, no window started;
    without it — `ALL PASS`.
  - Not run: `make_release.sh` / `make_volumes.sh` (`pipefail`, the volumes as release parts) — read only; they run at the RC1 build.
- **Found:** the four failures of the batch of 2026-11-18 (between 21:19 and 21:36 that evening) were the stand, not the fixes: the main session's <!-- claim-ok: times of 2026-11-18 -->
  real Conan game ran on the machine at the time, and `BuildUpdate.GameRunning()` looks for the game's processes machine-wide (`GAME_PROCESSES`), so every
  download was refused before its first request (`feed.log` of that run: only `GET /releases`, no file request). Fixed by the stand's machine guard. No
  defect of the launcher found.
- **Traces:** `KUMM/.work/launcher_r3/batch_new.txt`, `batch_old.txt`, the per-case folders `KUMM/.work/launcher_r3/new_*`, `old_*`, `guard_on`, `guard_off`
  (their `tmp/KrinikConanLauncher.log`, `tmp/feed.log`, frames); the failing run of 2026-11-18 — `KUMM/.work/launcher_r2/batch_new.txt`, `run_fresh-cut/fresh-cut/tmp/feed.log`.
- **Verdict:** pass — the ten round-2 findings are fixed and each new check can fail; the release scripts are not yet run.
