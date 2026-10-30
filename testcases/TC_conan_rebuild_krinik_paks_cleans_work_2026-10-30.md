# Test cases — rebuild-krinik-paks.py cleans its work dir after each verified mod

> **Basis:** STATUS "Where to continue" → next (1): «`rebuild-krinik-paks.py` cleans its own work dir after each verified mod (≈0.5 h — the disk
> incident)» — the twelve rebuilds of 2026-10-29/30 left ≈ 86 GB of work dirs and disk D: fell to 33 MB.
> **Tool:** `ConanExiles/_config/devkit/rebuild-krinik-paks.py` (`remove_by_enumeration`, flag `--keep`).
> **Techniques:** equivalence partitioning (verified / failed / `--keep`), error guessing (a hard link to an outside file, a junction to an
> outside dir, a read-only file, a path outside WORK, WORK itself). Not covered: `--install` (writes the library and the game — not needed to
> see the cleanup; the cleanup line runs after the install branch either way).

| # | Case | Steps | Expected | Status |
|---|---|---|---|---|
| U1 | Tree removed | a temp WORK with `mod-1/out/x.pak`, `mod-1/cmp-old-1/_raw/chunks/c06`, a read-only file; `remove_by_enumeration(mod-1)` | `mod-1` gone; the count = number of files | pass 08:08 — mod-1 gone, count 5 (4 files + 1 junction; my first expectation 6 was a miscount) |
| U2 | Hard link | `mod-1/view/g.utoc` = hard link to a file OUTSIDE WORK | the link gone; the outside file intact, same bytes | pass 08:08 — outside file bytes intact |
| U3 | Junction | `mod-1/j` = junction to a dir OUTSIDE WORK holding a file | the junction gone; the outside dir and its file intact | pass 08:08 — outside dir and keep.txt intact |
| U4 | Outside WORK | `remove_by_enumeration(<a dir outside WORK>)` | refused (`SystemExit`), nothing removed | pass 08:08 — SystemExit, dir kept |
| U5 | WORK itself | `remove_by_enumeration(WORK)` | refused, nothing removed | pass 08:08 — SystemExit, WORK kept |
| F1 | Real run, verified | `REBUILD_WORK=<scratchpad>/rw python -I -X utf8 rebuild-krinik-paks.py --only <smallest mod>` | «сошлись»; line «черновик убран: N файлов»; `<mod>-1` absent; exit 0 | pass 08:10 — SimpleModlist: «кусков 7 — байт в байт», «черновик убран: 66 файлов», rw/ empty, exit 0 |
| F2 | Real run, `--keep` | the same with `--keep` | «сошлись»; no cleanup line; `<mod>-N` present | skipped — `--keep` only skips the new call; the branch is the old behaviour seen in every rebuild of 2026-10-30 |
