# Run report — rebuild-krinik-paks.py cleans the work dir of each verified mod

- **Work:** `ConanExiles/_config/devkit/rebuild-krinik-paks.py` — `remove_by_enumeration` after a verified (and installed) mod, `--keep` to
  skip; cases `testcases/TC_conan_rebuild_krinik_paks_cleans_work_2026-10-30.md`. Basis — STATUS "Where to continue", next (1).
- **Contour:** this machine, Python 3 (`-I -X utf8`), the Conan pack `D:/work/ai_sandbox/ConanExiles` at `2941d60` + the edit; the game not
  running; machine lock taken 08:09:35–08:10 (`machine-lock.mjs`, released).
- **Runs:** 2026-10-30 08:08 +03:00 — `python -I -X utf8 t_cleanup.py <tool>` (scratchpad script: a temp WORK with a hard link to an outside
  file, a junction to an outside dir, a read-only file); 2026-10-30 08:10 — `REBUILD_WORK=<scratchpad>/rw python -I -X utf8
  _config/devkit/rebuild-krinik-paks.py --only SimpleModlist`.
- **Checks:**
  - Hygiene: none separate (the unit cases U1–U5 call the real function on a built tree).
  - Functional run: the real tool on the real library pak SimpleModlist — «кусков 7 — байт в байт, файлов обёртки 5 — равны», «черновик убран:
    66 файлов», `rw/` empty afterwards, exit 0 — pass. U1–U5: tree removed (5 entries), the hard-linked outside file and the junction's target
    intact, a path outside WORK and WORK itself refused — pass. F2 (`--keep`) skipped: it only skips the new call.
- **Found:** none in the tool; my own first expectation in U1 (6 entries) was a miscount — the tree held 4 files and 1 junction.
- **Traces:** `D:/Temp/claude/d--work-ai-sandbox-KUMM/1b272a24-53f7-47dc-b6a6-0eecc7fc7750/scratchpad/t_cleanup.py`; console output quoted above.
- **Verdict:** pass — the large mods (IMM_WAR, Era of Trials) were not rebuilt again; the cleanup code path is the same for every mod.
