# Run report — Conan: Krinik mods show the build version 1.0.0 in the pause-menu mod list

**Work.** Cases `testcases/TC_conan_krinik_versions_1.0.0_2026-10-31.md` V1–V5 (`[OWNER]` «в сбоке моды Krinik ставим по версии сборки 1.0.0» · 2026-10-31 15:39).

**Contour.** Conan Exiles 3.0.1 with the build (66 mods); background launch path; the owner's save copied to
`Conan Exiles Mods/_save-backup/2026-10-31_1549-before-versions-1.0.0` and restored by `save-restore.sh` (integrity ok); machine lock 15:48–15:52.

**Runs.**
- 15:4x `set-pak-version.py _unpacked/<Mod>/<Mod>.pak 1.0.0` for KrinikConanUI, KrinikConanArchery, KrinikConanGameplay — each «list equal: True · other files
  byte-equal: True · version read back: 1.0.0 · manifest md5 of modinfo: True» (copies of the 3.0.1 paks kept in the session scratchpad until the commit).
- 15:4x `Deploy-ModPack.ps1 -PackDir ConanExiles -Deploy -Only <Mod>` for the three + KrinikConanGraphics.
- 15:49 `launch-bg.ps1` (PID 28180) · 15:50 `enter-world-remote.sh` (world in 24 s) · `pult.sh` `ActivateModule(FName('IngameMenu'), true, false)` and
  `FindFirstOf('SML_UI_ModList_C').modlistText` · `close-game.ps1` (clean, 6.2 s) · `save-restore.sh` · lock released 15:52.

**Checks.**
- Hygiene: `build-level-mod.py`'s new `pack_version_fields()` returns `{1, 0, 0}` from the manifest.
- Functional run: the real game on the background path; read — the `ConanModPackStatus` line, the mod list text of the live widget, the Lua mods' log lines.
- V1–V5 pass (statuses in the case file). The list was read as text, no frame taken (the text is what the widget shows; the 3.0.1 run had the frame).

**Found.** none. No crash-report window («none of the agent's run since 15:49:24»).

**Traces.** UE4SS.log of the 15:49 session; the list text quoted in the case file.

**Verdict.** pass — the three Krinik paks show v1.0.0; the manifest versions of all seven Krinik mods start with 1.0.0.
