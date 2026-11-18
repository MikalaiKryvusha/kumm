# Run report — the Conan launcher: version line, judge round 4 fixes, the stand kept out of the owner's folders

**Work:** epic 55 B8 judge round 4 (`plans/55_EPIC_conan_build_0_9_1_for_3_1_1.md`) and the owner's version line «Лаунчер: 1.1.0» (`[OWNER]` 2026-11-18 08:13, 08:20 —
`PROJECT_HISTORY.md` entry 2026-11-18 08:11). Basis: the stand cases of `ConanExiles/_config/launcher/test/live.mjs` (plan 54 / 55 regression, B16′ crash offer
C1–C6) plus the new check «the owner's %LOCALAPPDATA%\KrinikConanLauncher is untouched» after every case.

**Contour:** the stand of `KUMM/.work/launcher54/batch58.sh` — the launcher source of the pack working tree (uncommitted fixes) built as 1.0.0 (exe `03a5fe75c478…`),
the local feed, fake game folders under `.work/launcher54/r/`, the launcher dry (links and programs only logged), no real GitHub. Version line: three mock builds
`KUMM/.work/launcher_mock/{A,B,C}` snapshotted at 384 dpi in a folder with no game.

**Runs:**
- 2026-11-18 08:18, 08:21, 08:33 — `python -I -X utf8 .work/launcher_mock/build_variants.py` (snapshot `KRINIK_LAUNCHER_SNAPSHOT=…;384`), the top-right corner cropped and looked at.
- 2026-11-18 08:49:42–08:54:29 — `bash .work/launcher54/batch58.sh > .work/launcher54/batch58_r5.txt`.

**Checks:**
- Hygiene: `node --check live.mjs`; the C# compile inside `build_variants.py` and `batch58.sh` (exit 0).
- Functional run: the stand drove the built launcher through its cases and READ its log and window state; the 4K snapshots of the window were read by eye.
- Version line: «Лаунчер: 1.1.0» under «Свернуть» / «Закрыть», centred on the pair after the owner's 08:20 remark, small Inter in the path colour — pass (frames 08:21, 08:33).
- Stand batch: 191 PASS / 0 FAIL, cases with no output 0 — pass. Of them 16 new: the owner's state folder «absent -> absent» after every case — pass;
  C3 now asserts the product path: `запустил бы …\b16\collect_report.cmd -GameDir "…\b16"` — pass.
- Control: the stand before this fix created `%LOCALAPPDATA%\KrinikConanLauncher` with 8 `crashes-*.seen` (run of 2026-11-18 01:28–01:35, found by the judge) —
  the new check would have read «absent -> crashes-…» there.
- Not covered: R2's box on a failed report start and R1's guard (no stand case makes `Process.Start` or the folder creation fail); the drive-root `D:\.` form
  (no stand game at a drive root).

**Found:** the stand's isolation gap (fixed, EXP-0560); judge findings R1, R2, R4, R5, the Dry-only C3 branch — fixed; R3 (two launchers, two boxes) — not fixed.

**Traces:** `KUMM/.work/launcher54/batch58_r5.txt`; `KUMM/.work/launcher_mock/B/top_B.webp`, `B/nogame_B.png` (work files).

**Verdict:** pass for the cases above; partial for R1 / R2 / the drive root (compiled, no failing-path case).
