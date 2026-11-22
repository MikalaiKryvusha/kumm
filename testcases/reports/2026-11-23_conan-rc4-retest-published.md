# Run report — Conan 0.9.1-RC4 retest after the publication; the engine's install fixes on the fixture stand

**Work.** The retest of the RC4 issues on the published build (HOUSE_RULES 44.4) by `testcases/TC_conan_rc4_retest_published_2026-11-23.md` (#48 the death
error, #4 the sheathed bow in first person, #53 the view switch cost); the launcher 1.1.1 feedback plate (#43) on the owner's machine; the engine changes of
the same loop — `install.ps1` keeps exit 0 when only the desktop shortcut fails, `Invoke-FileRetry` for the upgrade's rename and the backup removal.

**Contour.** The working game `D:\Games\Conan Exiles 3.1.1` with the RC4 mods (`pack_version.txt` 0.9.1-RC4), background path, the owner's save; the launcher
1.1.1 there (updated from the real GitHub feed 00:33), the owner's 4K TV at 300 %; the fixture stand `tools/fixture-pack.mjs` (fake pack in `.work/tmp`).

**Runs.**
- 01:05 `node .work/rc4/retest43.mjs`; 01:07 `node .work/rc4/ab43.mjs` (stopped on a copy lock after run 2; launcher 1.1.0 has no plate perf spans).
- 00:55–01:18 `node tools/fixture-pack.mjs` ×9 (logs `.work/rc4/logs/fixture_*.log`): before the retry two of three runs with the new case failed in the upgrade
  section, the control without the change passed, a run with the case moved last failed in the same section; after `Invoke-FileRetry` 3 of 3 clean (74 checks).
- 01:21–01:26 the game: `launch-bg.ps1` (PID 24144), `enter-world-remote.sh`, the remote calls of the case file, `capture-window.ps1`, `exec suicide`;
  closed by PID 01:26, no crash window.

**Checks.**
- Hygiene: the PowerShell parser over `Deploy-ModPack.ps1` (0 errors), `node --check` of the stand; judge rounds 4 and 5 (round 5: no confirmed defect).
- Functional run: the published launcher on the owner's machine (#43); the game by the case file — the death, the frames, the log read (#48, #4, #53); the
  fixture stand's install / uninstall / upgrade paths through the exported `install.ps1` (the shortcut cases, the upgrade section).

| # | Result |
|---|---|
| #43 | a repeated plate open 20–38 ms, the first open 134–390 ms; the stand's numbers in the notes corrected (standing falsehood, 01:1x); the owner 01:09 confirms the first open is a bug — open |
| R48 | pass — 0 Locomotion error lines from the death 01:25:14 to 25 s after; the respawn's Agility line present (N1 pass) → #48 closed |
| R4 | pass — no bow in the first-person frame looking up 60°; control frame: the bow on her back in third person → #4 closed |
| R53 | confirms #53 — the first switch after world entry 4.5 ms of camera lines («2 мс» by the mod), the second 1.7 ms («0 мс») |
| R13 | pass (the second run from 01:32, PID 47500) — 10:00, first person, pitch −55 with the sun behind: the shadow has the head and the shoulders → #13 closed |
| N2 | not run — the slot-2 remote call left no weapon line; in the second run the quick slots were empty (the gear stayed on R48's corpse) |
| shortcut | missing folder and missing drive Z: — exit 0 with «Desktop shortcut not created»; the uninstaller returns the game folder (3 runs) |
| retry | the upgrade section 3 / 3 clean after the fix (before: «Access denied» on `_kumm_player.partial`, «being used» on `_kumm_backup`) |

**Found.** (1) The feedback plate's first open in launcher 1.1.1 (#43, open). (2) The first view switch after world entry costs 2–4.5 ms (#53). (3) The
engine's upgrade rename / backup removal failed intermittently on a freshly written folder — fixed by `Invoke-FileRetry`. (4) Judge round 5's older risk, not
introduced here: if every retry of the backup removal fails, `files\` may be half deleted while `journal.txt` stays, and the next run refuses; the fix (delete
the journal first) is owed. (5) The clean-instance read of the two retest comments (#48, #4) was skipped — said here, not done.

**Traces.** `.work/rc4/logs/retest43.log`, `ab43.log`, `r48_death.log`, `fixture_*.log`; frames `.work/rc4/frames/r4_fp_up.webp`, `r4_tp_control.webp`,
`owner_launcher_111.webp`.

**Verdict.** partial — #48, #4 and #13 pass and are closed; #43 stays open on the first open (the owner's word); #53 confirmed; N2 owed.
