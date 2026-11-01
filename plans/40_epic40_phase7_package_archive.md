# Plan 40.7 — package and archive: volumes, install on a clean game, spot checks, uninstall; then the documents

> **Created:** 2026-11-01 · **Parent:** `plans/40_EPIC_conan_1.0.0_unfinished_six.md` phase 7 (criterion 7); plan 39 B6, A2, A3; plan 35 item 6; STATUS «Earlier FIRST list» item 2
> **Status:** written 2026-11-01 by a helper agent; not started; LAST by the owner's order — after phases 1–6 close
> **Outbound:** the public 1.0.0 release (a push to the public repo) only by the owner's word after this phase's report — an outward action

Basis, verbatim: `[OWNER]` 2026-11-01 11:11–11:12 «да не нужно архив собирать!! Сборка же еще не готова!!» · «релизный архив соберем и все документы обновим,
когда сборку сделаем и протестируем на всех разрешениях 16 к 9»; 2026-10-26 «пока ее разбиваем локально на архивы не более 700мб веса каждый, зип, чтобы побить
на несколько малых архивов».

## Goal vector (Achieve)

`make_volumes.sh` was never run to the end (the 11:10 run was stopped, 16 GB removed); `install.cmd` was proven only on 2.2.3 (2026-10-02) and on the engine's
fixture stand; the desktop shortcut and the uninstaller line exist only on the fixture stand (plan 39 A3); the guide and README feature lists were written from
the work log (A2). Where we want to be: the volumes made and self-checked; a player's install from them on a clean 3.0.1 game — `-Verify` green, the shortcut on
the desktop, the world entered, phases 1–6 spot-checked in THAT install; the uninstaller returns the game to its clean file set and removes the shortcut; then the
guide and README refreshed from the phase reports, not the work log.

## Acceptance criteria (scenario form)

1. **Volumes.**
   - Situation. Phases 1–6 closed and pushed; the game closed; ≥ 60 GB free on D: (213 GB free on 2026-11-01).
   - Action. The agent runs `bash D:/work/ai_sandbox/ConanExiles/_config/release/make_volumes.sh D:/Temp/krinik_release_<YYYYMMDD>`.
   - Result. Parts `Krinik_Mod_Pack_1_0_0.zip.001…` each ≤ 700 MiB; the unpacked copy's SHA-256 list equals the export's.
   - Check. Exit 0 and the line `OK: <N> files, hashes equal`.
2. **Clean game.** Situation: the real game after `uninstall_krinik_build.cmd` (the player's path). Action: the agent lists the game folder. Result: no Krinik /
   UE4SS / mod files. Check: `find "D:/Games/Conan Exiles 3.0.1" -type f | sort > clean.txt`; `grep -ci "krinik\|ue4ss" clean.txt` = 0; the file count and the
   SHA-256 of `ConanSandbox/Binaries/Win64/ConanSandbox-Win64-Shipping.exe` recorded.
3. **Install from the volumes.**
   - Situation. The clean game; the volumes unpacked by 7-Zip from part 001 into a fresh folder (as the README tells the player).
   - Action. The agent runs `install.cmd` from the unpacked bundle.
   - Result. The installer ends without error; the desktop shortcut «Krinik Conan» exists.
   - Check. `powershell -File D:/work/ai_sandbox/KUMM/Deploy-ModPack.ps1 -Verify -PackDir <unpacked bundle or pack>` exit 0;
     `Test-Path (Join-Path ([Environment]::GetFolderPath('Desktop')) 'Krinik Conan.lnk')` True.
4. **World entry in that install.** Situation: the installed game, the dev remote added (step 6). Action: launch, world entry. Result: the world loads; the build's
   mod count line. Check: `UE4SS.log` «СБОРКА: моды N/N» and `LoadMap(ConanSandbox)`; a frame of the HUD.
5. **Spot checks of phases 1–6 in that install** (one scenario each): a vignette at its default; one hub row per page saved and seen; the «Настройки модов»
   button and one entry; arrows on a corpse; one section's minute summary ≤ 1 ms; the hub at 720p. Check: the named frame / log number per phase in the report.
6. **Uninstall.** Situation: the installed game, the dev remote removed again. Action: `uninstall_krinik_build.cmd` in the game root. Result: the game's file set
   equals `clean.txt`; the shortcut is gone. Check: `find … | sort > after.txt; diff clean.txt after.txt` empty (save files excepted, listed);
   `Test-Path <Desktop>/Krinik Conan.lnk` False.
7. **Documents from the reports.** Check: every feature line of the guide (`ConanExiles/docs/guide/guide-3.0.1.html`) and of the public README template carries a
   phase report path or a `seen` row of plan 39's table; `python -I -X utf8 _config/release/guide_lint.py` (recon its arguments) passes; the PDF rebuilt by
   `build_docs_and_launcher.cmd`.

## The stand (HOUSE_RULES rule 11)

| Part | Value | Set up by |
|---|---|---|
| Game | the real 3.0.1 at `D:/Games/Conan Exiles 3.0.1` brought clean by the build's own uninstaller (the player's path); the save `Saved/` kept (rule 6 — no copy needed) | `uninstall_krinik_build.cmd` |
| Work dir | `D:/Temp/krinik_release_<YYYYMMDD>` (empty; export + volumes + check ≈ 3× the bundle) | created by the script |
| Remote | NOT in the export (`KrinikConanHarness` `"export": false`) → for steps 5 only: `Deploy-ModPack.ps1 -Deploy -Only KrinikConanHarness`, removed before step 6 | engine |
| Hero | god on, food / water 100 for the spot checks | `god-on.sh` |
| Machine | the KAGO lock for the install / launch steps | `machine-lock.mjs take --who kumm --what "epic40 p7 install" --minutes 120` |

## Steps

- [ ] 0. **Gate:** phases 1–6 reports exist and their acceptance tables are all `seen` (`ls testcases/reports/*vignettes* *hub-rows-audit* *mods-menu-button*
      *arrows-in-corpse* *frame-cost* *16x9-gate*`); `git status` clean in the pack and pushed (`git log origin/main..main` empty).
- [ ] 1. **Recon:** `install.cmd` and the uninstaller as exported (`Deploy-ModPack.ps1` lines ≈ 44–45, 987–1012; manifest `uninstall.cmd`, `shortcut`);
      the README's unpacking text; `guide_lint.py` usage; the Desktop path (`[Environment]::GetFolderPath('Desktop')` — may be OneDrive).
- [ ] 2. **Cases** into `testcases/TC_conan_release_1.0.0_archive_install_<YYYY-MM-DD>.md` (Z1–Z7 = criteria 1–7; spot checks Z5a–Z5f), stand block.
- [ ] 3. **Volumes (machine time):** game closed; `bash _config/release/make_volumes.sh D:/Temp/krinik_release_<YYYYMMDD>` in the BACKGROUND (memory:
      long runs in background); its log read once at the end; remove the `[NOT-TESTED]` mark in the script header with the report path (rule 20).
- [ ] 4. **Clean game:** run the current install's `uninstall_krinik_build.cmd`; `clean.txt`; criterion 2.
- [ ] 5. **Install:** unpack part 001 by `"/c/Program Files/7-Zip/7z.exe" x -o<D:/Temp/krinik_player_<YYYYMMDD>> <volumes>/…zip.001`; run `install.cmd`
      (no argument — the 2026-10-02 report says that path was «Не пройдено»); `-Verify`; the shortcut; a frame of the desktop shortcut icon.
- [ ] 6. **World entry and spot checks:** `-Deploy -Only KrinikConanHarness`; `launch-bg.ps1` (or fg by the owner's word); `enter-world-remote.sh`;
      Z5a–Z5f; `close-game.ps1`; the harness removed (file by file — recursive delete is denied; or the engine's restore) and `-Verify` 0 again.
- [ ] 7. **Uninstall:** `uninstall_krinik_build.cmd`; `after.txt`; diff; shortcut gone; then re-install the build for the owner by
      `Deploy-ModPack.ps1 -Deploy -PackDir D:/work/ai_sandbox/ConanExiles` + `-Verify` (his working state back; his camera `config.lua` carried over).
- [ ] 8. Report `testcases/reports/<YYYY-MM-DD>_conan-release-1.0.0-archive-install.md`; work trees removed file by file (rule 15) except the volumes (kept until
      the owner's word on publishing).
- [ ] 9. **Documents:** the guide's feature list re-checked line by line against the phase reports and plan 39's table (a line without a `seen`
      report is removed or rewritten); `build_docs_and_launcher.cmd` (guide → PDF → launcher); the public README by the `_config/public_release/` route
      (`mods-table.mjs` → `README.draft.md` → `make_public_tree.py <fresh dir>` exit 0 — NOT pushed); plan 39 A2, A3, B6 → seen; plan 35 item 6.
- [ ] 10. **Release** — only on the owner's word: the volumes uploaded / the public repo commit + tag by `/release`. Not part of this phase's gate.

### Packaging into the build

The build itself is the package here: the pack commit carries the `make_volumes.sh` header update, the guide HTML / PDF, the launcher sources if rebuilt, the
README template; `modpack.json` `packVersion` checked = 1.0.0 (`grep -n packVersion modpack.json`). KUMM commit: the cases, the report, plans 35 / 39 / 40 rows.
Each: `git add <files one by one>` · `git commit -F <msg>` · `git push`.

## Risks

- (a) A pak over 700 MB cannot be split per file → the script makes one multi-volume zip (by design, header); the README must say «open part 001» — checked in Z3.
- (a) `install.cmd` without an argument never passed (2026-10-02) — if it fails, the fix is in the engine (`Deploy-ModPack.ps1` install script), a fixture-stand
  re-run (`node tools/fixture-pack.mjs`, 21 checks), then the volumes REBUILT.
- (b) The uninstaller leaves a file or removes a game file → a defect of the engine; the game is repaired from Steam's file check only by the owner's word.
- (b) The owner's working install is torn down for this phase — step 7 restores it the same session; his camera `config.lua` copied out first.
- (c) Disk: export + volumes + check ≈ 3 × bundle (the stopped run held 16 GB) — 213 GB free is enough; the work dir removed after the owner's word.
