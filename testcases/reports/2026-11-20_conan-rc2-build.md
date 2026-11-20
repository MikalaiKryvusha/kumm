# Test run report — Conan build 0.9.1-RC2: the UI kit pak, the release ritual, the release parts

**Created:** 2026-11-20 23:11 +03:00 · **Run by:** the agent (Claude Opus 5.5, the chat of 22:07) ·
**Version/build:** Krinik Mod Pack 0.9.1-RC2 for Conan Exiles Enhanced 3.1.1 (CL-383549); pack `1bc593d`

## 1. Work

The build of the release candidate 0.9.1-RC2 by the release ritual (KUMM HOUSE_RULES 42, `ConanExiles/_config/release/release_checklist.py`): the KrinikConanUI
kit pak rebuilt so the main-menu line under our logo reads «0.9.1-RC2» (it read «0.9.1-RC1» in the stopped run of 21:14); every shipped Krinik mod at version
0.9.1-RC2; the user guide edited against the owner's remarks on the RC1 notes (2026-11-20 16:19–16:25) and given the RC2 block; the public README at RC2;
`make_release.sh` into an empty work dir. Basis: the ritual's stages A–D, the RC2 notes `ConanExiles/_config/release/draft_0_9_1/github_release_notes_0_9_1_RC2.md`.
The publication (stage E) and the update RC1 → RC2 through the launcher follow in their own report.

## 2. Contour

The pack repo `D:\work\ai_sandbox\ConanExiles`; the Dev Kit `F:\CEUE5Devkit` (UE5 editor, commandlet runs); the working game `D:\Games\Conan Exiles 3.1.1`
(the build, `targets.json`); the release work dir `KUMM/.work/rc2_release`. REAL WORLD: accumulated — the owner's working game holds the dev harness
(KrinikAgentRemote and the menu probes since 19:57) and the save the agent uses; data and machine — the owner's PC under the machine lock `kumm`; path — the
main menu after a background launch (the owner plays other games on this PC). The player's path (download the parts, install, update RC1 → RC2) is not
in this report.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-11-20 21:34–21:38 +03:00 | `UnrealEditor-Cmd.exe ConanSandbox.uproject -run=PythonScript -Script=_config/devkit/kit-conanui-edit.py -EnablePlugins=PythonScriptPlugin -ModDevKit` (the previous chat) | 0 · «Success - 0 error(s)», `kit-conanui-edit.json` `"ok": true` |
| 2 | 2026-11-20 22:24–22:42 +03:00 | `bash KUMM/.work/rc2/kit_chain.sh` (kit-krinik-modsettings ×2, kit-krinik-click-events ×2, `kit-buildmod.py KrinikConanUI`) | 0 · every step «Success - 0 error(s)»; pak 12 710 188 B |
| 3 | 2026-11-20 22:44 +03:00 | `repak list` old vs new pak; `grep -c -a 0.9.1-RC2` / `0.9.1-RC1` | 8 = 8 files, equal lists; «0.9.1-RC2» ×4, «0.9.1-RC1» ×0 |
| 4 | 2026-11-20 22:44 +03:00 | `Deploy-ModPack.ps1 -PackDir ConanExiles -Deploy -Only KrinikConanUI` | 1 · KrinikConanUI deployed; verify 110 present, 4 missing — all four of KrinikConanMusic (`export: false`, not deployed in this game) |
| 5 | 2026-11-20 22:45 +03:00 | `set-pak-modinfo.py "<game>/ConanSandbox/Mods" --only KrinikConanUI.pak`, then `--check-krinik` | 0 · written; 4 Krinik paks found, 0 failed |
| 6 | 2026-11-20 22:45–22:47 +03:00 | `launch-bg.ps1` → `capture-window.ps1 -Out KUMM/.work/rc2/menu_rc2.jpg -Width 3840` → `Stop-Process -Id 33196` | 0 · the main menu at 22:46; the frame read; the game closed, no crash-report window |
| 7 | 2026-11-20 23:00 +03:00 | `python -I -X utf8 ConanExiles/_config/release/release_checklist.py` | 0 · 0 TODO, 13 MANUAL, 6 OK |
| 8 | 2026-11-20 22:57–23:07 +03:00 | `bash KUMM/.work/rc2/run_release.sh` (`make_release.sh KUMM/.work/rc2_release <RC2 notes>`, the play gate waived by the owner's words of 21:12) | 0 · «OK: release 0.9.1-RC2»; 7 parts, launcher, guide PDF, SHA256SUMS.txt |
| 9 | 2026-11-20 23:09 +03:00 | `pymupdf` over `release/Krinik-Conan-3.1.1-guide.pdf`: page 1 rendered, strings counted | 18 pages; the new texts present, the criticised ones absent |

## 4. Checks

Hygiene: the ritual script tested by its real output on the pack and by synthetic verdict lines (6 forms) and a git failure outside a repo; 4 judge rounds on
it; `bash -n` / the PowerShell parser on the edited dev tools.
Functional run: the main menu of the working game after a background launch — the frame `KUMM/.work/rc2/menu_rc2.webp` READ: «0.9.1-RC2» under the KRINIK MOD
PACK logo, «3.1.1» under the game's logo, the «ОТЗЫВ» plate; the release parts produced by `make_release.sh` (its own steps: 7z test of the parts, the unpack,
the modinfo check of the export) and the guide PDF read on page 1.

| Case | Status | Observation |
|---|---|---|
| The menu line reads the RC2 version | pass | the frame of run 6 |
| The UI pak carries the same files as the RC1 build | pass | run 3 |
| Krinik paks carry author, URL, change note | pass | run 5 |
| The ritual has no TODO | pass | run 7 |
| The release parts and their checksums exist | pass | run 8, `SHA256SUMS.txt` 9 lines |
| The guide PDF carries the RC2 edits and none of the criticised phrases | pass | run 9: «0.9.1-RC2» ×3, «Исправлено в тестовой сборке 0.9.1-RC2» ×1, «говорят по-русски» ×0, «учит героя» ×0 |
| Install from the parts, update RC1 → RC2 by the launcher | blocked | waits for the publication (the launcher reads the GitHub feed) |

## 5. Found

- The ritual's judge check took «review: … owed» and «… the push waits for its verdict» for done reviews (judge round 1) — fixed in `1bc593d`.
- The UI kit pak of the stopped run of 21:14 carried «0.9.1-RC1» — rebuilt (run 2).
- `game-front.ps1` and nine more dev scripts still enforced the cancelled busy-keyboard rule; `palm-shadow-series.sh` passed a `-MinIdle` that `mouse-seq.ps1`
  no longer declares (a silent binding error) — fixed, at the judge.
- README mods table and the guide's table 2 had drifted for KrinikConanGraphics after the guide edit — `mods-table.mjs` synced; the in-game mod list of the
  RC2 parts keeps the earlier (shorter) Graphics description.

## 6. Traces

`KUMM/.work/rc2/logs/` (01–07: kit steps, buildmod, make_release), `KUMM/.work/rc2/menu_rc2.webp`, `KUMM/.work/rc2/guide_p1.jpg`, `KUMM/.work/rc2_release/release/`
(the assets and `SHA256SUMS.txt`), the pack commits `3ac54fc`, `1bc593d` and their git notes.

## 7. Verdict

partial — the build of RC2 passes every case it could walk; the player's path (install from the parts, the update RC1 → RC2) is blocked until the
publication and goes into the next report.
