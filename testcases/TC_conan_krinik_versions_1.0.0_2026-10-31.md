# TC — Krinik mods show the build version 1.0.0 in the pause-menu mod list

> **Created:** 2026-10-31 · **Parent:** `[OWNER]` «в сбоке моды Krinik ставим по версии сборки 1.0.0» · 2026-10-31 15:39 (supersedes «все моды Krinik... получают
> версию 3.0.1» of 2026-10-28; previous run — `TC_conan_krinik_versions_3.0.1_2026-10-30.md`)
> **Status:** cases written 15:48 before the run; run 15:49–15:52, all pass — report `testcases/reports/2026-10-31_conan-krinik-versions-1.0.0.md`
> **Outbound:** —

**Basis.** `set-pak-version.py <wrapper> 1.0.0` on KrinikConanUI, KrinikConanArchery, KrinikConanGameplay (15:4x: list equal, other files byte-equal, read back
1.0.0); kit sources and `_unpacked/*/kit/modinfo.json` 1.0.0; `build-level-mod.py` now writes `packVersion` of the manifest; manifest `version` of every Krinik
mod starts with 1.0.0. Techniques as in the 3.0.1 run: one pak per build route, a control (a foreign mod keeps its version), smoke (the mods still load).

**Stand.** Background launch path; the owner's save copied before and restored by `save-restore.sh` after; the machine lock; no remote probes beyond
`ActivateModule('IngameMenu')` and reading the list text.

| # | Case | Steps | Expected | Status |
|---|---|---|---|---|
| V1 | Deploy | `Deploy-ModPack.ps1 -PackDir ConanExiles -Deploy -Only <Mod>` for KrinikConanUI, KrinikConanArchery, KrinikConanGameplay, KrinikConanGraphics | copied, verify 0 missing | pass — «verify 106 present, 0 missing» ×4 |
| V2 | The game loads them | launch, world entry; `ConanModPackStatus` line in UE4SS.log | all mods mounted (66/66), no «Mod is too old» | pass — «СБОРКА: моды 66/66», 0 «too old» |
| V3 | Versions in the list | `ActivateModule('IngameMenu')`; read `modlistText` of the live `SML_UI_ModList_C` | the three Krinik paks with «v1.0.0» | pass — «KrinikConanArchery - v1.0.0 · KrinikConanUI - v1.0.0 · KrinikConanGameplay - v1.0.0» (still at the bottom) |
| V4 | Control | the same text | Simple Modlist v5.1.1, Hosav v2.5.4 unchanged | pass |
| V5 | Lua halves still work | `[KrinikConanGameplay:…]`, `[KrinikConanUI:…]`, `[KrinikConanArchery:…]` lines after world entry | sections loaded, 0 error lines | pass — log lines Gameplay 14, UI 66, Archery 13, Graphics 10; 0 error lines naming Krinik |
