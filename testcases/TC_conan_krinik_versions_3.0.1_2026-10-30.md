# TC — Krinik mods show version 3.0.1 in the pause-menu mod list (plan 36 W11, half «versions»)

> **Created:** 2026-10-30 · **Parent:** plan 36 W11; `[OWNER]` «все моды Krinik... получают версию 3.0.1» · 2026-10-28 (PROJECT_HISTORY.md, the evening's queue)
> **Status:** cases written 16:26 before the run
> **Outbound:** —

**Basis.** Simple Modlist's `AppendModlist(ModName, Version)` gets the version from the mod's info (`games/ConanExiles/mods/SimpleModlist.md`); our kit paks
carried `modinfo.json` 1.0.0. `set-pak-version.py` set 3.0.1 in the wrappers of KrinikConanUI, KrinikConanArchery, KrinikConanGameplay (checks: list
equal, other files byte-equal, read back 3.0.1). Techniques: the three changed paks (equivalence: one per build route — kit, kit, level builder), a control
(a foreign mod keeps its own version), smoke (the mods still load).

**Stand.** Background launch path (the owner's word 16:18 «работай в фоне»); the owner's save copied before and restored by `save-restore.sh` after; no
remote probes beyond `ActivateModule('IngameMenu')` and reading the list text.

| # | Case | Steps | Expected | Status |
|---|---|---|---|---|
| V1 | Deploy | `Deploy-ModPack.ps1 -PackDir ConanExiles -Deploy -Only <Mod>` for the three | three paks copied, verify green | pass — «verify 105 present, 0 missing» ×3 |
| V2 | The game loads them | launch, world entry; `ConanModPackStatus` line in UE4SS.log | all mods mounted (the same count as before), no «Mod is too old» / mount error for the three | pass — «СБОРКА: моды 66/66», 0 «too old» |
| V3 | Versions in the list | `ActivateModule('IngameMenu')`; read `modlistText` of the live `SML_UI_ModList_C`; frame | KrinikConanUI, KrinikConanArchery, KrinikConanGameplay with 3.0.1 | pass — list text: all three «v3.0.1»; they stand at the bottom |
| V4 | Control | the same text | a foreign mod (e.g. Simple Modlist itself) keeps its own version | pass — Simple Modlist v5.1.1, Hosav v2.5.4 |
| V5 | Gameplay half still works | `[KrinikConanGameplay:…]` and `[KrinikConanUI:…]` log lines after world entry | sections loaded as before | pass — the 16:26:59 session log: [KrinikConanGameplay:…] 12 lines (Jump hook set), [KrinikConanUI:…] 43 lines, 0 error lines (read after the run) |
