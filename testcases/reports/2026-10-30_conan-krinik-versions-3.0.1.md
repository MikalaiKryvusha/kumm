# Run report — Conan: Krinik mods version 3.0.1 in the pause-menu mod list

**Work.** Plan 36 W11, half «versions» (`[OWNER]` «все моды Krinik... получают версию 3.0.1» · 2026-10-28); cases `testcases/TC_conan_krinik_versions_3.0.1_2026-10-30.md` V1–V5;
the new tool `ConanExiles/_config/devkit/set-pak-version.py`.

**Contour.** Conan Exiles 3.0.1 with the build (66 mods); the background launch path; the owner's save copied to
`Conan Exiles Mods/_save-backup/2026-10-30_1626-before-w11` and restored by `save-restore.sh` (integrity ok); lock 16:26–16:29.

**Runs.**
- 16:2x `set-pak-version.py <copy of KrinikConanUI.pak> 3.0.1 --dry-run`, real, repeat («already at that version»), a bad version (rc 2), a `.utoc` (rc 3 «not a pak repak
  can read»), no work folder left beside the input or in TEMP.
- 16:2x `set-pak-version.py _unpacked/<Mod>/<Mod>.pak 3.0.1` for KrinikConanUI, KrinikConanArchery, KrinikConanGameplay — each «list equal: True · other files
  byte-equal: True · version read back: 3.0.1 · manifest md5 of modinfo: True»; kit sources `F:\CEUE5Devkit\UE4\Content\Mods\{KrinikConanUI,KrinikConanArchery}\modinfo.json`,
  `_unpacked/*/kit/modinfo.json` and `build-level-mod.py` (writes 3.0.1) changed the same way.
- 16:2x `Deploy-ModPack.ps1 -PackDir ConanExiles -Deploy -Only <Mod>` ×3 — «verify 105 present, 0 missing».
- 16:27 `launch-bg.ps1` · `enter-world-remote.sh` (world in 26 s) · UE4SS.log · `ActivateModule('IngameMenu')` · `modlistText` of the live `SML_UI_ModList_C` · frame
  `menu.webp` · `close-game.ps1` · `save-restore.sh`.

**Checks.**
- Hygiene: none beyond the tool's own read-back checks.
- Functional run: the real game on the background path; read — `ConanModPackStatus` line, the game log, the mod list text, one frame of the pause menu.
- V1 pass · V2 pass («СБОРКА: моды 66/66», 0 «too old») · V3 pass («KrinikConanArchery - v3.0.1 | KrinikConanUI - v3.0.1 | KrinikConanGameplay - v3.0.1») · V4 pass
  (foreign mods keep theirs: «Simple Modlist (by Xevyr) - v5.1.1», «Hosav's Custom UI Enhanced - v2.5.4») · V5 pass (the session log read after the run: `[KrinikConanGameplay:…]` 12 lines incl. the Jump hook, `[KrinikConanUI:…]` 43, 0 error lines).

**Found.**
- Our mods stand at the BOTTOM of the list (the frame shows the top only; the list's `ModListBox` is a text field, not a scroll box — `ScrollToEnd` is not
  callable, «TrivialObject»). The «top of the list» half of W11 is open (a bytecode branch in `AppendModlist`, `games/ConanExiles/mods/SimpleModlist.md`).
- No crash-report window («none of the agent's run since 16:26:59»).

**Traces.** Frame `menu.webp` (session scratchpad, deleted after the commit); UE4SS.log of the 16:27 session.

**Verdict.** pass — the three Krinik paks show 3.0.1; the order half of W11 stays open.
