# Run report — the Conan 3.0.1 build released as 0.9.0

> **Created:** 2026-11-02 · **Parent:** `plans/43_conan_release_0.9.0.md`, cases `testcases/TC_conan_release_0.9.0_2026-11-02.md`
> **Status:** done 2026-11-02 19:35 +03:00 — every case pass; the GitHub release refused by the permission classifier (outward), waits for the owner
> **Outbound:** the PlayGround page (the owner uploads); the GitHub release v0.9.0 (refused for the agent)

## Work

The release of the build as 0.9.0 by the owner's order 2026-11-02 18:40 (verbatim in plan 43): every Krinik mod and the build at 0.9.0, the guide chapter
«Известные проблемы и планы на 1.0.0», the launcher showing both versions under the logos (18:47), the cover at 0.9.0, the PlayGround material, the volumes,
install and uninstall on the clean copy (house rule 25). Basis — plan 43 criteria 1–6, the case file V1–V6, S1–S2, Z1–Z3.

## Contour

Pack `ConanExiles` `d329e2e` → `6f85cb6`; the working game `D:/Games/Conan Exiles 3.0.1` (deployed `-Only KrinikConanUI,KrinikConanArchery,KrinikConanGameplay,
KrinikConanGraphics`); the clean copy `D:/Games/Conan_Exiles_3_0_1_clean_test`; the kit `F:\CEUE5Devkit`; machine lock `kumm` 18:46–.

## Runs

- 2026-11-02 18:47–18:52 kit: `UnrealEditor-Cmd … -Script=_config/devkit/kit-conanui-edit.py -ModDevKit` (ok, «versions under both») → `kit-buildmod.py KrinikConanUI <out>`.
- 2026-11-02 18:49–18:50 `python -I -X utf8 _config/devkit/build-level-mod.py --name KrinikConanGameplay --work <scratch> --out _unpacked/KrinikConanGameplay`.
- 2026-11-02 18:53 Archery: unpack → `modinfo.json` 0.9.0 → `manifest.json` MD5 → `repak pack --version V11` (scratch `repak_modinfo.py`); `repak hash-list` old vs new.
- 2026-11-02 18:52 `make-wallpapers.py top-centre <source> <out> --pack 0.9.0` ×3; 18:53–18:58 `build-docs.py` (PDF + launcher), launcher snapshots `KRINIK_LAUNCHER_SNAPSHOT=<png>;288|144|96`.
- 2026-11-02 18:55 `Deploy-ModPack.ps1 -PackDir ConanExiles -Deploy -Only …` — 4/4 mods, verify 108 present, 0 missing; `launch-bg.ps1`, main-menu frame `capture-window.ps1 -Width 3840`.
- 2026-11-02 18:59–19:16 the screenshot stand: `enter-world-remote.sh`, `tp_ground.sh`, `terrain-probe.sh`, scouting frames, the vista table `MapMarkers_ConanSandbox`; 19:11 the game
  crashed by the agent's inventory sweep (EXP-0448), relaunched `launch-fg.ps1` 19:12; quick bar one slot per step (`RemoveItem` + `exec SpawnItem`); 4K frames 19:15–19:16.
- 2026-11-02 19:20 `close-game.ps1` (the owner's word «закрывай игру»), clean, no crash reporter.
- 2026-11-02 19:21 and 19:26 `bash _config/release/make_volumes.sh D:/Temp/krinik_release_20261102[b] Krinik_Mod_Pack_0_9_0`.
- 2026-11-02 19:31 `7z x …zip.001 -o<clean copy>`; `install.ps1`; `Deploy-ModPack.ps1 -Verify -PackDir <bundle>/pack -GameDir <copy>`; `uninstall_krinik_build.cmd`; `find` lists.
- 2026-11-02 19:30 public repo `make_public_tree.py <scratch>/public_tree_090` (557 kept, scan 0) → clone → commit `def3b3f` → push; README read back by `gh api …/readme`.

## Checks

Hygiene: the paks' modinfo read back by `repak get`; the volumes' hash compare; the public tree's pattern scan and `scrub-identity.mjs` (only the published author
address and the font authors' addresses).
Functional run: the main menu of the working game seen at 4K with «0.9.0» under our logo; the launcher rendered by its own snapshot path at three DPI; the guide PDF
pages rendered and read; the player's install from the volumes on the clean copy (unpack, `install.ps1`, `-Verify`, the uninstaller) — every case of the TC file pass:
V1–V6, S1–S2, Z1–Z3 (observations in the TC table).

## Found

- The volumes step 1 (`deploy-config.py` etalon) overwrote the working game's `Game.ini` / `GameUserSettings.ini` — the owner's files restored from
  `_config/backup/2026-11-02_192117` after the runs (sha `a93fe088…`, `5e9667dc…` back). The script does it by design; a release run on the owner's game must restore them.
- The installer's desktop shortcut and the uninstaller's removal hit the owner's own «Krinik Conan» shortcut (one name) — re-made to his launcher after Z3.
- The proofread found a stale plan line in the new chapter (the Xevyr pages — already done) — rewritten before the volumes of run 2.
- The agent crashed the owner's game (EXP-0448).

## Traces

`ConanExiles/docs/guide/screens_0.9.0/`, `D:\Games\Conan Exiles Mods\Krinik_Mod_Pack_0_9_0_PlayGround\` (frames, cover, title page, PDF, 19 volumes,
`playground_post.txt`), the scratchpad logs `make_volumes.log`, `make_volumes_b.log`, `install_clean.log`, `uninstall_clean.log`, `clean_before.txt`, `clean_after.txt`.

## Verdict

pass — the build 0.9.0 is packed, its install and uninstall work by the player's path on a clean game. Not done by the agent: the GitHub release v0.9.0 with the
volumes (refused by the permission classifier as a public publication) and the PlayGround upload (the owner's account).
