# Run report — 2026-11-13 — Conan 3.1.0: mods' stale whole copies of vanilla assets (plan 53 step 12)

## Work

What was tested: the reading of the 11 vanilla assets the 3.1.0 patch changed under mods' whole copies, and the fixes of three of them. Basis: plan 53 step 12
(`plans/53_conan_move_3.1.0.md`), `researches/mod-reconciliation/GUIDE.md` kind 6, the patch-rollback list (`ConanExiles/_config/patch-rollback.py`, 11 «ИЗМЕНЁН
ПАТЧЕМ» + 1 «НЕТ В НОВОЙ»). New instruments under test: `ConanExiles/_config/stale-copy-check.py` (tables, exports, imports, bytecode by meaning) and the plan line
`game-chunk:<sha1>` of `ConanExiles/_config/devkit/patch-mod-asset.py`.

## Contour

The 3.1.0 target `D:\Games\Conan Exiles 3.1.0` (CL-383024) with the build's 66 paks installed; the 3.0.1 install `D:\Games\Conan Exiles 3.0.1` as the old game; the
2.2.3 view `D:/work/ai_sandbox/_paksview-2.2.3` (containers only) as an older reference; the authors' originals in `D:\Games\Conan Exiles Mods\_patch-originals`. No game
running; machine lock «kumm» taken at 21:18 for 40 minutes.

## Runs

- 21:1x `python -I -X utf8 _config/mod-overrides.py _scratch/overrides/mods-3.1.0-now.tsv "D:/Games/Conan Exiles 3.1.0/ConanSandbox/Mods"` and `python -I -X utf8 _config/patch-rollback.py _scratch/overrides/mods-3.1.0-now.tsv "D:/Games/Conan Exiles 3.0.1" "D:/Games/Conan Exiles 3.1.0" _scratch/overrides/rollback-now.tsv` — exit 1 (the same 11 + 1).
- 21:2x `python -I -X utf8 _config/devkit/rebuild-krinik-paks.py --only StorageReachExpanded --against-original --install` and the same `--only LegitReligious_Enhanced` — exit 0 each.
- 21:2x `python -I -X utf8 _config/stale-copy-check.py <Mod> <table>` on the installed pak and with `"D:/Games/Conan Exiles Mods/_patch-originals/<Mod>.pak"` (controls).
- 21:2x–21:3x `stale-copy-check.py EnhancedArmoryAndArsenal /Content/Systems/Building/Placeables/BP_PL_Crafting_Station.uasset --old "D:/Games/Conan Exiles 3.0.1" [--show …]`, the same with `--old "D:/work/ai_sandbox/_paksview-2.2.3"`.
- 21:3x `rebuild-krinik-paks.py --only EnhancedArmoryAndArsenal --against-original --install` with the new recipe line (`game-chunk:`), then `stale-copy-check.py` on the built pak.
- 21:4x `stale-copy-check.py BossesMyNewBesties /Content/Systems/Building/Placeables/BP_PL_Crafting_Station_AnimalPen.uasset --old …`; the same for LBPR's `BP_BuildSystem_v2` and `BP_Master_Placeables`.
- 21:5x after the judge's round 1: `rebuild-krinik-paks.py --only EnhancedArmoryAndArsenal --against-original` without the sha1 (expected stop), with it (built), `stale-copy-check.py` on the built pak, on the author's original, on a mod that does not ship the path, and the table branch again.

## Checks

Hygiene: both tools exit as their headers say; the drafts removed file by file (counts printed).
Functional run: the tools read the real installed paks of the build on the real 3.1.0 game and the real 3.0.1 game; what was READ is in the table. In game
(added 22:1x): the 3.1.0 world entered 22:01 (`launch-fg.ps1`, `_config/enter-world-remote.sh`), `_config/move310-checks.lua` by the remote — the live console table
holds `FollowerPerk`, `SRE.show`, `Grimoire` (129 rows: other mods merge into it at world load; the script's «want 29» was the file's count, a wrong expectation),
the live stat table 3425 rows = the 3.0.1 world's 3404 + 21; EAA's station class loaded — which copy is NOT shown by that (`BindRunningState` exists in 3.0.1 too);
a crafting queue pausing on a full output — not walked; `UE4SS.log` no Lua error, `ConanSandbox.log` 0 «too old» / fatal / missing imports; my game closed 22:02.

| Case | Expected | Seen | Status |
|---|---|---|---|
| T1 Storage Reach table on 3.1.0 after the rebuild | every game row + the mod's own | game 26 · copy 29, lacks 0, own 3 (`SRE.*`), other values 0 — exit 0 | pass |
| T1c the author's original (control) | red | lacks 6 (`Corruption`, `FollowerPerk`, `Grimoire`, `GrimoireEldritch`, `LoadoutGranter`, `SetDurability`) — exit 1 | pass |
| T2 LegitReligious stat table after the rebuild | = the game | 1725 = 1725, 0 / 0 / 0, imports 5 = 5 — exit 0 | pass |
| T2c the author's original (control) | red | lacks 72 game rows, 1 row other values — exit 1 | pass |
| B1 EAA station read three ways | the mod's own edit named | only the «crafting ended» sound switch lacks recipe categories 13–15 (3.0.1 and 2.2.3 have 8 cases, EAA 5); every other export = 3.0.1; 3.1.0 rewrote the event graph +108 −89 ~47 of 262. By raw bytes the patch «changed» 60 of 70 exports (the name map shifted) — by meaning 19 functions, 17 of them entry-offset stubs | pass (read) |
| B1v a view of global + the mod only (the first version) | — | `/Engine/UnknownPackage` in the mod's copy and false «edits» in two thrall-bonus functions → the view rebuilt as game + `<Mod>_P`; the false edits gone | defect found and fixed |
| B2 EAA rebuilt with `game-chunk:` | the station = 3.1.0 | built pak: imports 192 = 192 equal, IDENTICAL — exit 0; the installed pak: imports 192 = 192, none unresolved | pass |
| B2c EAA's original (control) | differs | imports equal, «differs» — exit 1 | pass |
| B3 the pin | a build without the judged sha1 stops | stopped, printed `30d0413c97bd1daf8da1564e9a942c38202ce781`; with it — built | pass |
| B4 a mod that does not ship the path (control) | exit 2, no false «identical» | «StorageReachExpanded does not ship … (7 packages)» — exit 2 | pass |
| R1 BMNB animal pen | — | every export = 3.0.1 = 3.1.0 by bytes and meaning; only the package header differs | read |
| R2 LBPR `BP_Master_Placeables` | — | the mod edits `CanBePlaced`, `PreCanBePlacedSuccess`; `SetupForBrush` differs from 3.0.1 as 3.1.0 does | read |
| R3 LBPR `BP_BuildSystem_v2` | — | the mod's event graph +87 −82 ~96 of 899; the patch ~8 statements there | read, not resolved |

## Found

- The first `stale-copy-check.py` view (global + the mod's container) printed `/Engine/UnknownPackage` and false edits — fixed (game + `<Mod>_P`).
- Git Bash rewrote `/Content/…` arguments into `C:/Program Files/Git/Content/…` — the tool undoes it; `MSYS_NO_PATHCONV=1` in the commands.
- The judge's round 1 on the pack tools: a false docstring claim (`pack-raw` keeps the OLD store entry of a replaced chunk — imports must be checked), no pin to
  the judged chunk, `.m.ubulk` missed, a false «identical» when the mod does not ship the path, the stub label too broad, crash exit 1 — all fixed and re-run above.
- `retoc list` prints chunk ids only; the «does the mod ship the path» check reads `retoc manifest` (`pakstore.json`).

## Traces

`ConanExiles/_scratch/overrides/rollback-now.tsv`, `rollback-now.log` (git-ignored scratch); `_scratch/rebuild-*.log`; the per-asset notes in
`games/ConanExiles/mods/{EnhancedArmoryAndArsenal,StorageReachExpanded,LegitReligious_Enhanced,BossesMyNewBesties,No_Building_Placement_Restrictions}.md`; plan 53 step 12.

## Verdict

partial — the three fixes pass every file-level check and control; in game the two tables are seen live (22:01); the crafting queue pausing on a full output is
not walked; 8 of the 11 assets are parked by the owner's word (21:44).
