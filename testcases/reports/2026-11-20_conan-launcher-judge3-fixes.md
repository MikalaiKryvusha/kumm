# Run report — judge round 3 fixes: the launcher, the release scripts, the pak modinfo guard

- **Work:** the findings of `reports/2026-11-20_judge_round3_launcher_and_pak_modinfo.md` (2 defects, 5 risks, cosmetics) fixed in the pack working tree;
  basis — the judge's failure scenarios, plan 57's cases, HOUSE_RULES 40.
- **Contour:** the launcher stand (`ConanExiles/_config/launcher/test/self.mjs`, the stand bundle of `KUMM/.work/launcher_r3/st.json`); the round-3 exe
  `KUMM/.work/launcher_r4/build/KrinikConanLauncher.exe` (make_variant, build 0.9.1-RC1, launcher 1.0.0); the control exe `KUMM/.work/launcher_r3/build/`
  (pack `d473023`); the release scripts read and their lines run in `bash -c`; the pak guard on copies of the four source paks.
- **Runs** (2026-11-20):
  1. 10:14–10:35 — `EXE=<r4 exe> TAG=r4new bash KUMM/.work/launcher_r3/batch.sh` (24 cases): 327 PASS, 3 FAIL.
  2. 10:35–10:37 — control `EXE=<r3 exe> TAG=r4old CASES="never title fresh-429" bash batch.sh`: 53 PASS, 2 FAIL.
  3. ≈10:16 — the release lines: the stem / notes mapping for 0.9.1-RC1 and 0.9.1; the running-game refusal with a hidden stub named
     `ConanSandbox-Win64-Shipping.exe`; `hash_control.py` (one Krinik pak copy with modinfo.json changed by a byte, the manifest kept);
     `set-pak-modinfo.py _unpacked --check-krinik`; `dash_lint --only krinik_change_notes` + its control; `bash -n` of both scripts.
  4. after 10:38 — the re-run of the cases run 1 failed for stand reasons (`r4b`: steam title fresh-cut fresh-stop) and the H2 control (`r4c`: title on the
     old exe) — results appended below.
- **Checks:**
  - Hygiene: `node --check self.mjs`, `bash -n` make_release.sh / make_volumes.sh, the C# compiled by make_variant.
  - Functional run: the real launcher exe by the stand (feed, search, buttons, window title, logs READ); the release-script lines and the guard run on
    real files (the source paks, a fake game process), outputs READ.
  - Finding 1 (RC part names): `0.9.1-RC1` → `Krinik_Mod_Pack_0_9_1_RC1`, `0.9.1` → `Krinik_Mod_Pack_0_9_1`, notes `draft_0_9_1/…` exists; the launcher's part
    pattern matches the RC name. PASS.
  - Finding 2 (game running): with the stub running — the old line silent, the new line fires; after the stop — silent. PASS (control red as expected).
  - Finding 4 (N5): fixed exe — `installed`, no update plate; old exe — FAIL «экран: update». PASS.
  - Finding 5 (hash): the byte-changed copy — `[fail] … manifest hash of modinfo.json`, the other three `[ok]`, exit 1; the four source paks — 0 failed. PASS.
  - Finding 6 (error responses closed): fresh-429 with four error answers in a row passes on BOTH exes — NOT reproduced on the stand (the feed is on
    127.0.0.1; the per-host connection limit of .NET most likely does not apply to loopback — a hypothesis, not checked). The fix (closing
    `WebException.Response` in both catches) stands by the API's contract; verified by reading only.
  - Finding 7 (Range check): the new filter on the saved feed logs — fresh-cut / fresh-stop found a mid-part Range, fresh-feed none; run 1's fresh-stop
    showed a stop between two parts (rightly no mid-part Range) — the check is asked in the cut case only.
  - Run 1's three FAILs: `steam` — the stand's machine guard caught MY stub process of run 3 (the guard working); H2 — the case reused H1's remembered copy
    (its own state folder added); fresh-stop — the Range check above.
- **Found:** two stand defects of my own (H2's state, the Range check in the stop case), fixed; finding 6 not reproducible on this stand.
- **Traces:** `KUMM/.work/launcher_r3/batch_r4new.txt`, `batch_r4old.txt`, `batch_r4b.txt`, `batch_r4c.txt`, the case folders `r4new_*`, `r4old_*`, `r4b_*`,
  `r4c_*`; `KUMM/.work/rc1/hash_control.py`, `KUMM/.work/rc1/fake_ship/`.
- **Verdict:** partial until the re-run (run 4) is read — see below.

## Run 4 — the re-run (10:38–10:42)

- `r4b` on the round-3 exe: steam, title (H1 + H2), fresh-cut (the mid-part Range found), fresh-stop — 66 PASS, 0 FAIL. H2: «Сборка модов Krinik Mod Pack
  0.9.1-RC1 для Conan Exiles Enhanced 3.1.1».
- `r4c` the H2 control on the pre-fix exe: FAIL «… 0.9.1-RC1 для Conan Exiles Enhanced 3.2.0» — the defect of finding 3, as the judge described.
- **Verdict:** pass — findings 1–5 and 7 fixed and each seen to fail on the old code where a control exists (1 by the pattern, 2 by the stub, 3 by H2, 4 by N5,
  5 by the byte-changed copy, 7 by the saved logs); finding 6 fixed by reading, not reproducible here; the release scripts' full run waits for RC1.
