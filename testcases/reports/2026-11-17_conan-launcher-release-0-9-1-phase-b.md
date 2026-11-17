# Test run report — the Krinik Conan launcher and installer, epic 55 phase B (update cases, the player's settings)

**Created:** 2026-11-17 21:16 +03:00 · **Run by:** the agent (Claude Opus 5.5) ·
**Version/build:** launcher 1.0.0 (pack `2f62b52`), engine KUMM `d1aac90`

## 1. Work

Epic 55 phase B (`plans/55_EPIC_conan_build_0_9_1_for_3_1_1.md`, criteria 2–7) against `testcases/TC_conan_launcher_release_0_9_1_2026-11-17.md` and plan 54's regression.

## 2. Contour

The launcher stand (`ConanExiles/_config/launcher/test/`: a local GitHub-like feed, a fake Conan folder with bundles exported by the real engine); the engine's
fixture stand (`KUMM/tools/fixture-pack.mjs`); the REAL build `D:\Games\Conan Exiles 3.1.1` for the upgrade (M0).

## 3. Runs

- 2026-11-17 20:49–21:10 — `node tools/fixture-pack.mjs` four times (67 → 69 checks after judge round 1); 21:0x the same against the old engine (`KUMM_DEPLOY=<HEAD copy>`) — 9 new checks red.
- 20:55, 20:58, 21:04, 21:11 (B2 alone), 21:12–21:15 — `bash KUMM/.work/launcher54/batch55.sh` (the final run on the final build: 88 checks).
- 21:04 — `powershell -File ConanExiles/_config/launcher/test/window_icon.ps1 -Exe <bin exe> -Out <dir>`.
- 21:13–21:14 — `Deploy-ModPack.ps1 -Deploy -Upgrade -WithEngineIni` on the real build, SHA-256 of the world and markers before / after; 21:15 `-Verify`.

## 4. Checks

Hygiene: PowerShell parse 0 errors; `node --check` of the stand drivers; the launcher compiled by `build-docs.py`.
Functional run: the launcher driven on live windows (buttons pressed by BM_CLICK, message boxes read, the log read), the installer run on fake and real game folders, the files read back.

| Case | Status | Observation |
|---|---|---|
| notes / offline / S1–S3 (plan 54) | pass | final batch ALL PASS; S1 now proves the handshake (the old exits after «окно живо — сигнал …») and `.old` kept until the second start |
| L4 a new launcher that starts and dies | pass | «запустился, но не открыл окно» box, the old exe back, the old window open |
| L5 two unfinished starts | pass | the old launcher back, `.bad` aside then removed |
| B1, B2 (stop + resume), B4 (broken install), B5 (close mid-download) | pass | final batch; B2 failed once in batch 3 (the install never reported), passed alone 21:11 and in the final batch — cause not found |
| B6 a release without its last part | pass | «не хватает частей» before any download, no parts folder |
| the previous-bundle offer | pass | the new launcher asks, «Да» deletes the old bundle folder, the game stays |
| W1 the window icon | pass | WM_GETICON — the gold «K»; the owner 21:05 «да, вижу, сейчас наша красивая К» |
| engine fixture (upgrade, strip, never, running game, failing mod mid-upgrade) | pass | 69 / 69 |
| M0 REAL WORLD upgrade of the 3.1.1 build | pass | 75 / 75, verify 114 / 0, Game_0/1.db, the minimap markers, a damage log BYTE-IDENTICAL |

## 5. Found

1. Judge round 1 on the engine: 13 findings — 10 fixed, the TC table aligned, the stand strengthened, 3 deferred (in `d1aac90`'s message).
2. A stand launcher left running sat on the owner's taskbar (7 min) — the batch now closes its own processes by PID (EXP-0553).
3. The window showed the generic WinForms icon — fixed (EXP-0553).
4. B2's one batch miss (above) — not reproduced on two runs; watch it.

## 6. Traces

`KUMM/.work/launcher54/batch55_out*.txt`, `b2_alone2.txt`; the stand folders under `KUMM/.work/launcher54/`; `KUMM/.work/tmp/real_before.txt` / `real_after.txt`.

## 7. Verdict

pass for phase B on the stands and the real build's upgrade; open: judge round 2 (engine) and a judge round on the launcher diff; the deferred items.
