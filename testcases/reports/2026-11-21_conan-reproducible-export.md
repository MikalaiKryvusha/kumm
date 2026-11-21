# Run report — the build's paks are byte-reproducible (the launcher's delta update, step 0)

> **Created:** 2026-11-21 · on the owner's words 2026-11-21 00:28–00:30 (verbatim — `PROJECT_HISTORY.md` entry 2026-11-21 00:28)
> **Parent:** `testcases/TC_conan_reproducible_export_2026-11-21.md` · `researches/conan-launcher-delta-update/README.md` §5 step 0
> **Status:** written 2026-11-21 10:32 +03:00
> **Outbound:** —

## Work

Step 0 of the delta update: the same input folder must pack into the same pak bytes, so an update can skip every file whose source did not change. Basis —
the cases R1–R5, N1–N3 of `testcases/TC_conan_reproducible_export_2026-11-21.md`; the requirement of the recon §5 step 0 («the same inputs → the same file
bytes»). The change under test: `ConanExiles/_config/devkit/repak_tool.py` (new: `ENV` with `RAYON_NUM_THREADS=1`) and the `run()` of `set-pak-modinfo.py`,
`set-pak-version.py`, `kit-buildmod.py`, `build-level-mod.py`, `patch-mod-asset.py` passing it (`make-info-pak.py` reuses `set-pak-modinfo.py`'s `run`).

## Contour

The build machine (Windows 11, repak_cli 0.2.3, Python 3.14, retoc-5.8 local build). Inputs: the library originals
`ConanExiles/_library/mods/_workshop/<id>/<Mod>.pak` and `…/_krinik-modified/3741684658/Emberlight.pak`; the RC2 bundle unpacked on the update stand
`KUMM/.work/rc1_install/Conan_311/Krinik_Mod_Pack_0_9_1_RC2`; the working game `D:/Games/Conan Exiles 3.1.1` read only (N3). All outputs under `KUMM/.work/repro/`.
The game was not running; nothing was written under a game folder.

## Runs

1. 2026-11-21 ≈10:24–10:26 +03:00 — R1: `repak unpack -q -o repro/emb <RC2 Emberlight.pak>`, then 3× `repak pack -q --version V11 --mount-point ../../../ConanSandbox/Mods/ repro/emb repro/emb_<i>.pak`
   and 3× the same under `RAYON_NUM_THREADS=1`; `time` of one pack each way.
2. 2026-11-21 10:28:08–10:28:59 +03:00 — R2, R3 (first form), R4, N2: `bash KUMM/.work/repro/run_r2.sh` (log `KUMM/.work/repro/run_r2.log`).
3. 2026-11-21 ≈10:29 +03:00 — R3 again with the right original: `set-pak-modinfo.py repro/C/Emberlight --only Emberlight.pak` on a copy of the `_krinik-modified`
   pak, then `repak hash-list` against the RC2 pak.
4. 2026-11-21 ≈10:29 +03:00 — N3: `python -I -X utf8 _config/devkit/set-pak-modinfo.py "D:/Games/Conan Exiles 3.1.1/ConanSandbox/Mods" --check-krinik`.
5. 2026-11-21 10:30:11–10:31:10 +03:00 — N1b: 2× `python -I -X utf8 _config/devkit/build-level-mod.py --name KrinikConanGameplay --work repro/blm_w<A|B> --out repro/blm_out<A|B>`,
   SHA-256 of both paks, `repak hash-list` against `ConanExiles/_unpacked/KrinikConanGameplay/KrinikConanGameplay.pak`.
6. N1: a parse of every `_config/devkit/*.py` (93 files) by a scratch script (`compile()` without writing `__pycache__`).
7. 2026-11-21 10:36:24–10:39:04 +03:00 — M1–M3: `bash KUMM/.work/repro/run_manifest.sh` (log `run_manifest.log`): `make_manifest.py` twice on the RC2 bundle, once on RC1,
   RC2 `--check-only --previous <RC1 manifest>`, `7z t` of the group zip; the counts of M2 recomputed from the two manifests by a `node -e` one-liner (the script's own
   counter read a file `head` had cut short).
8. 2026-11-21 ≈10:41 +03:00 — M4: `bash KUMM/.work/repro/run_4c.sh` — the real step 4c cut out of `make_release.sh` by its markers, the RC2 bundle as a «0.9.1-RC3»
   export, `published_0_9_1-RC2/manifest.json` (computed from the RC2 bundle, the launcher's marker left out) as the previous manifest.

9. 2026-11-21 10:45:18–10:46:59 +03:00 — after judge round 1 (`repak_tool.env_for`: one thread only for `repak pack` and `retoc to-zen`; `make-loc-mod.py` covered;
   the guard `t_repak_one_thread.py`): `bash KUMM/.work/repro/run_round2.sh` (log `run_round2.log`) — G1 the guard's selftest, G2 the guard on the live `_config`, G3
   `env_for` on nine commands, R2 / R4 / N2 again (`run_r2.sh`, its old first form of R3 still inside and still «DIFFERS» — the script's overall FAIL comes from that line
   only), N1b the gameplay pak twice; G4 the guard on the pre-fix `make-loc-mod.py` (`git show HEAD:…` into `repro/guard_red`).

10. 2026-11-21 10:54:54–10:57:14 +03:00 — after the manifest judge's round 1 (1 defect, 6 risks, 5 cosmetic; `make_manifest.py` rewritten: the check-only estimate
    counts the group, the previous release picked by version, paths compared case-insensitively, stale assets removed, the BOM accepted, the parts read back,
    the zip attributes set, THE GUARD: an unexpected third-party pak stops the run; `make_release.sh` 4c uses `--previous-from` / `--allow-changed`, logs stderr;
    the RC2 manifest rewritten files-only): `bash KUMM/.work/repro/run_round3.sh` (log `run_round3.log`) — S the new self-test
    `ConanExiles/_config/release/t_make_manifest.py`, M1, M2, M2b, M4.

## Checks

- **Hygiene:** N1 — 93 devkit scripts parse, 0 failed.
- **Functional run:** the real tools on real library paks, by the path the release export walks (`set-pak-modinfo.py` over a folder of paks) and the path a Krinik
  pak build walks (`build-level-mod.py`); every hash READ and compared.

| ID | Status | Observed |
|---|---|---|
| R1 | pass | default threads: three SHA-256 (`994a8e15…`, `dff1e610…`, `6517e5a6…`); one thread: three equal `7e8ac284…`; 0.58 s vs 0.55 s per pack |
| R2 | pass | Frequent_meteors 0.35 MB `4011c59a…` A = B; SevereWeatherEnhanced 24 MB `d31dd171…` A = B; Emberlight 370 MB `36dc9575…` A = B; HighmanesArsenal 1.3 GB `1f7fcb3b…` A = B; every run «written», exit 0 |
| R3 | pass (second form) | first form compared the `_workshop` original with RC2 and differed in `-Windows.ucas/.utoc` — RC2 ships the KRINIK MODIFIED Emberlight, my case named the wrong source. With the `_krinik-modified` original: `repak hash-list` equal to RC2 in all 11 entries; the file `0631ac1f…` vs RC2's `e58c51ce…` (RC2 was packed on many threads) |
| R4 | pass | the second run printed «Emberlight — already equal»; SHA-256 `36dc9575…` before and after |
| R5 | not run | waits for the next release (the «changed vs the previous release» line, plan 57 phase 6) |
| N1 | pass | 93 / 93 parse |
| N1b | pass | two builds of KrinikConanGameplay: `d8c62a30…` both; the three platform paks equal to the shipped pak (hash-list), `modinfo.json` / `manifest.json` differ as expected — the shipped pak carries the fields `set-pak-modinfo.py` adds after the build; every builder check ✅ (3 × 10 000 rows, the blueprints 2 of 2 per platform) |
| N2 | pass | `set-pak-version.py` on two copies of ChestLabels.pak → `45bc83de…` both; «list equal: True · other files byte-equal: True · version read back: 9.9.9» |
| N3 | pass | 4 / 4 Krinik paks ok, «release 0.9.1 · found 4 · failed 0» |
| G1–G4 (round 2) | pass | selftest PASS; live `_config` 228 scripts, 0 writers without `env_for`; `env_for` 9 / 9; the pre-fix `make-loc-mod.py` flagged (line 42) — red on the named broken version |
| R2 / R4 / N2 (round 2) | pass | the same hashes as round 1 (`4011c59a…`, `d31dd171…`, `36dc9575…`, `1f7fcb3b…`; R4 unchanged; N2 `45bc83de…`) |
| N1b (round 2) | pass | `d8c62a30…` twice — the same bytes as round 1, now with `retoc pack-raw` on its default threads |
| M1 | pass | two runs on the RC2 bundle: `manifest.json` byte-equal, 73 / 73 assets equal; 188 files hashed in 8–11 s (1.2–1.7 GB/s) |
| M2 | pass | «changed vs 0.9.1-RC1: 74 files, 13592.8 MB to download»; from the manifests: 62 third-party paks / 13.56 GB + 12 files / 37.3 MB — the recon's numbers, the guard red on the real broken pair |
| M3 | pass | `7z t`: 118 files, 10 567 307 B |
| S (round 3) | pass | `t_make_manifest.py` 14 / 14: determinism, parts at PART / 2·PART+1, the group's members, the check-only group estimate, a case-only rename, stale assets, a BOM, the previous by release order (RC2 < RC3 < RC10 < final), the guard red / allowed / Krinik exempt. Two of my own case expectations were wrong on the first runs (the MB rounding of a 238 B group, then the OLD group's size instead of the new one) — the code was right, the expectations were rewritten with the reason in the case |
| M1 (round 3) | pass | two runs on RC2: `manifest.json` and 73 / 73 files equal; 72 assets (69 hardlinks, 2 parts, the group `small-b7ab3639…` — a new hash since the zip attributes are set explicitly) |
| M2 (round 3) | pass | RC1 → RC2 with no allow file: «changed vs 0.9.1-RC1: 74 files, 13603.4 MB (13603380277 B)», `[fail] 62 third-party pak(s)`, 62 «NOT EXPECTED» lines, exit 1 — the guard stops on the real broken pair; the estimate now carries the 10.6 MB group |
| M2b (round 3) | pass | the same with `pack/src/*   # …` in the allow file: 62 «[allowed: …]» lines, exit 0 |
| M4 (round 3) | pass | the real step 4c: «previous manifest: …published_0_9_1-RC2\manifest.json» picked by version for 0.9.1-RC3, «changed vs 0.9.1-RC2: 1 files, 10.6 MB (10588533 B; added 1)» — the launcher's marker, not a pak; exit 0 |
| M4 | pass | the step found `published_0_9_1-RC2/manifest.json`; «changed vs 0.9.1-RC2: 1 files, 10.6 MB (added 1)» — the launcher's marker `pack/.krinik_unpacked`, present in the stand bundle only; exit 0 |

Not run functionally: `kit-buildmod.py` (needs the kit cook) and `patch-mod-asset.py` (the KRINIK MODIFIED builder) — the same one-line `env=` change as the
three twins above; both are owed a run at their next use.

## Found

1. The cause of the 13.56 GB re-download: repak_cli 0.2.3 `pack` writes entries in the order its threads finish (R1). Fixed by `repak_tool.ENV`.
1a. Judge round 1 (0 defects, 3 risks, 5 cosmetic), each checked: the env reached every child and made `retoc pack-raw` ≈ 4× slower with equal bytes —
   fixed by `env_for`; `make-loc-mod.py` packed without it — fixed and the class guarded; `make-info-pak.py` cannot run since `KRINIK_NOTE` / `KRINIK_AUTHOR` /
   `NEXUS` moved to `krinik_modinfo.py` (an AttributeError before any repak call; older than this change, the script has no caller) — owed; four comment
   overclaims fixed; `build-level-mod.py`'s `setdefault` kept with a comment (no caller passes its own env).
1b. The manifest judge's round 1 (1 defect, 6 risks, 5 cosmetic), each checked against the code: DEFECT — `--check-only --previous` left the group out of
   the estimate (13592.8 MB printed vs 13603.4 MB) — fixed (the group is built in a temp folder); risks fixed — the previous manifest by file date (now by
   version), case-sensitive paths, stale assets on a rerun, the guard that only printed (now exit 1), the group entries' root (the contract written), a BOM;
   cosmetic fixed — comments, the never-copying `link`, the asset counts and the per-path estimate, the inconsistent RC2 manifest (now files-only), stderr
   missing from the log. Round 2 — running.
2. My case R3 named the wrong original (`_workshop` instead of `_krinik-modified`) — corrected in the run, no defect of the code.
3. Consequence for the players: RC2's third-party paks were packed on many threads, so the first update after this change still downloads them once
   (≈ 13.6 GB); from then on only changed files.

## Traces

`KUMM/.work/repro/run_r2.sh`, `run_r2.log`, `blm_A.log`, `blm_B.log`, `r3_new.txt`, `r3_rc2.txt`; the paks under `KUMM/.work/repro/{A,B,C,N2A,N2B,blm_outA,blm_outB}`
(deleted after the commit).

## Verdict

**partial** — reproducibility is observed on the release export's tool (four paks, 0.35 MB – 1.3 GB) and on one Krinik pak builder; the whole export run twice
(R5) and the two builders not run (`kit-buildmod.py`, `patch-mod-asset.py`) remain.
