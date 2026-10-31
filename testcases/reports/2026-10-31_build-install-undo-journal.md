# Run report — the build install undone to the pre-build state (bug 72)

**Work.** Cases `testcases/TC_build_install_undo_journal_2026-10-31.md` U1–U9 against bug 72 (the owner's words of 2026-10-31 15:50–15:53 quoted there).

**Contour.** `Deploy-ModPack.ps1` (this commit) on the fixture stand `tools/fixture-pack.mjs` in the OS temp (a fake game with vanilla files); the launcher
`ConanExiles/_config/launcher/bin/KrinikLauncher.exe` rebuilt by `build-docs.py`. No live game run.

**Runs.**
- 15:58 `node tools/fixture-pack.mjs` — 3 undo checks red (the `$target` / `$Target` case clash in `Write-EngineIniFile`; deploy exit 1 from the
  pre-existing «pak not in modlist» verify line for the player's own pak).
- 15:59 a direct `Deploy-ModPack.ps1 -PackDir <undopack> -Deploy -WithEngineIni -NoVerify` — uninstaller and Engine.ini journaled after the rename to `-GameTarget`.
- 16:00 and 16:02 `node tools/fixture-pack.mjs` — all 34 checks pass (27 older + 7 undo).
- 16:02 `python -I _config/release/build-docs.py` (PDF + launcher with «Удалить сборку»); 16:0x `shot-launcher.ps1` from `bin/` (no game).

**Checks.**
- Hygiene: `PSParser::Tokenize` of the engine — 0 errors.
- Functional run: the stand drives the engine as a player would — deploy, the uninstaller `.cmd` run by `cmd /c` with Enter for its pauses, a byte-wise tree
  compare; the launcher window looked at. U1–U9 pass; U10 (the live Conan folder) not run.

**Found.**
- Fixed in the run: a parameter `$Target` silently overwritten by a local `$target` in the same function (PowerShell names are case-insensitive).
- Kept as is: while the build is installed, `-Verify` flags the player's own pak «not in modlist (will NOT load)» — true; the uninstall returns it.

**Traces.** The fixture folders `D:\Temp\kumm-fixture-*` (OS temp); frame `shotC/launcher-1.jpg` in the session scratchpad (deleted after the commit).

**Verdict.** partial — the engine path is proven on the stand by the player's path; the live Conan folder (U10) waits.
