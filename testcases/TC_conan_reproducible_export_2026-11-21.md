# Test cases — the release export writes the same pak bytes for the same inputs (the launcher's delta update, step 0)

> **Created:** 2026-11-21 · on the owner's words 2026-11-21 00:28–00:30 (verbatim — `PROJECT_HISTORY.md` entry 2026-11-21 00:28)
> **Parent:** `researches/conan-launcher-delta-update/README.md` §1 and §5 step 0 · `plans/57_EPIC_conan_launcher_self_sufficient.md` phase 6
> **Status:** cases written 2026-11-21 10:27 +03:00 before the run; M1–M4 entered here AFTER their run (≈10:42; designed before it in plan 57 phase 6 step 1 and in the run script `KUMM/.work/repro/run_manifest.sh`); run 10:24–10:41 — report `testcases/reports/2026-11-21_conan-reproducible-export.md`
> **Outbound:** —

## Test basis

- The recon (§1): RC1 → RC2 changed 12 files / 37.3 MB of content, but 62 third-party paks (13.56 GB) differ byte-wise with equal entry lists — the export's
  `set-pak-modinfo.py` rewrites every wrapper, and the result is not byte-reproducible. Requirement: the same library pak and the same README row give the
  same output bytes on every export (step 0: «the same inputs → the same file bytes»).
- Cause observed 2026-11-21 10:2x: repak_cli 0.2.3 `pack` of one folder three times → three SHA-256; with `RAYON_NUM_THREADS=1` → one.

## Dimensions

- Partitions: pak size (0.35 MB · 24 MB · 370 MB · 1.3 GB); pak state (an original without our fields → rewritten; a pak already carrying them → left alone).
- Not covered on purpose: the whole 13.7 GB export run twice (needs 2 × 13.7 GB free on D:, 36 GB today, and the game closed) — replaced by case R5 at the
  next release (the «changed vs the previous release» line).

## Stand

`KUMM/.work/repro/` (git-ignored): copies of library originals from `ConanExiles/_library/mods/_workshop/<id>/<Mod>.pak`, two folders A and B; the game is not
touched; nothing under the game folder is written.

## Cases

| ID | Steps | Expected | Status | Observed |
|---|---|---|---|---|
| R1 | the same unpacked folder packed 3× by repak with the default threads, then 3× with `RAYON_NUM_THREADS=1` | default: hashes differ (the control); one thread: one hash | pass | default: 3 SHA-256; one thread: 1 (the run report, run 1) |
| R2 | four originals copied into A and B; `set-pak-modinfo.py A --only <pak>` and the same for B, each pak | SHA-256 of A/<pak> = B/<pak> for every pak; exit 0 | pass | 4 / 4 paks A = B (0.35 MB – 1.3 GB) |
| R3 | `repak hash-list` of the new Emberlight.pak vs the RC2 bundle's Emberlight.pak | the same entries and content hashes (the fields are what RC2 shipped) | pass | with the `_krinik-modified` original: 11 / 11 entries equal to RC2 (the first form named the `_workshop` original — RC2 ships the KRINIK MODIFIED pak) |
| R4 | `set-pak-modinfo.py A --only <pak>` again on the written pak | «already equal», the pak's SHA-256 unchanged | pass | «already equal», `36dc9575…` before and after |
| R5 | the next release: the export's per-file SHA-256 vs the previous release's manifest | the changed files are only those whose source changed | not run | waits for the next release |
| M1 | `make_manifest.py` twice on the RC2 bundle into two release dirs | `manifest.json` byte-equal; every asset byte-equal | pass | manifest equal; 73 / 73 assets equal (69 hardlinks, 2 parts of Shemite, the group zip, the manifest) |
| M2 | `make_manifest.py` on the RC1 bundle, then RC2 `--check-only --previous <RC1 manifest>` | the 74 byte-different files of the recon: 62 third-party paks (13.56 GB) + 12 real changes (37.3 MB) | pass | «changed vs 0.9.1-RC1: 74 files, 13592.8 MB»; recounted from the manifests: 62 paks / 13.56 GB + 12 files / 37.3 MB — the guard is red on the real broken pair |
| M3 | `7z t` of the group zip | 118 entries, no error | pass | «Files: 118», size 10 567 307 |
| M4 | the real step 4c cut out of `make_release.sh`, the RC2 bundle as a «0.9.1-RC3» export | the previous manifest `published_0_9_1-RC2/manifest.json` found; the diff names only the launcher's marker | pass | «previous manifest: …published_0_9_1-RC2/manifest.json» · «changed vs 0.9.1-RC2: 1 files, 10.6 MB (added 1)» `+ pack/.krinik_unpacked`; exit 0 |

## Neighbours (HOUSE_RULES 39)

| ID | Steps | Expected | Status | Observed |
|---|---|---|---|---|
| N1 | the other five scripts that now pass the one-thread env load and compile: `py_compile` of `set-pak-version.py`, `kit-buildmod.py`, `build-level-mod.py`, `patch-mod-asset.py`, `make-info-pak.py` | no error | pass | 93 / 93 parse; `build-level-mod.py` built twice → one SHA-256 `d8c62a30…` |
| N2 | `set-pak-version.py` (the twin rewrite path) on a copy of an original, twice into A and B | equal SHA-256, its own checks pass | pass | `45bc83de…` both; «list equal: True · other files byte-equal: True» |
| N3 | `set-pak-modinfo.py <working game Mods> --check-krinik` (read-only) | the same verdict as before the change | pass | 4 / 4 Krinik paks ok, failed 0 |
