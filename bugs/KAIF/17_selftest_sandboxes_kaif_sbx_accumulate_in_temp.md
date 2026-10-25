# KAIF bug: self-test sandboxes `kaif-sbx-*` accumulate in the OS temp — 757 folders, 44.5 GB in two weeks on one machine

kaif-fp: tools/lib/temp-root.mjs :: kaif-sbx-leak :: v2.9
**Delivered upstream:** https://github.com/MikalaiKryvusha/KAIF/issues/177
**Autocapture:** KAIF 2.9 · project KUMM (the leak itself comes from the KAIF origin repo's own suites run on this machine) · agent system claude-code (Claude Opus 5.5) · OS Windows 11 Pro 10.0.26200
**Dedup attestation:** `grep -ril "kaif-sbx" bugs/KAIF/` → none; `gh issue list -R MikalaiKryvusha/KAIF --state all --search "kaif-sbx"` → checked before filing.

## Symptom

A disk audit on 2026-10-25 found 757 folders `%TEMP%\kaif-sbx-*`, 44.5 GB, dated 2026-10-11 … 2026-10-24 (84 on 10-11, 215 on 10-14,
432 on 10-16, then 4–10 a day). By suite: `hooks` 488 · `budgets` 119 · `update-route` 39 · `field` 17 · `anon-legacy` 16 ·
`contour-shipped` 12 · `l2-faces` 8 · `l3-cli` 7 · `translated` 6 · `s27-rename` 6 · `verify-qa7-tab` 5 · `verify-qa7-shot` 5. All carry
the random `mkdtemp` suffix — no fixed-name roots. On this machine the temp lives on the system drive, which had 28.9 GB free that morning.

## Root cause (read from `tools/lib/temp-root.mjs`, last change 85fb9cc 2026-08-08)

`tempRoot()` removes the root only in a `process.on('exit')` handler with `code === 0`. Three paths leave it forever:
1. **a red run keeps the root by design** ("улика лежит там, где она нужна") — and nothing ever sweeps old evidence;
2. **a run killed from outside** (a parent's timeout, a closed terminal, a crash) never reaches the `exit` handler;
3. **on Windows `rmSync` fails with EPERM** while any handle is open, and the failure is swallowed silently.
The peaks (432 on one day) match update-test days, when suites are re-run many times while red.

## Expected

Evidence of a red run lives until it is looked at, not forever: the temp stays bounded no matter how many red or killed runs happen.

## Proposed fix (one place — the helper every suite already uses)

1. At the start of `tempRoot()`: sweep `kaif-sbx-*` roots older than N days (e.g. 3; `KAIF_TMP_KEEP_DAYS`) and print one line
   «swept K old sandboxes (S MB)»; never touch roots younger than N or the explicit-path variant.
2. The red-run message names the size of the kept root and the sweep age, so the operator knows it is temporary.
3. A guard proved red: create 5 aged fake roots + 1 fresh, call `tempRoot()`, expect 5 removed and 1 kept.

## Local remediation

None in KUMM (the helper is origin code). The 757 folders sit in the old user temp that the scheduled post-reboot cleanup empties; TEMP on
this machine moved to another drive, so the leak will continue there until the origin fixes it.

## Same class, other project

The same day the owner ordered a project rule «чистить за собой!» after the Unliminium project's interview-page tool left 40 browser
profiles (13.6 GB) — a different tool, the same missing «the tool removes what it created».
