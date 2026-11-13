# Mod notes — Less Building Placement Restrictions (LBPR; container `No_Building_Placement_Restrictions`, Workshop 3755091710)

> **Created:** 2026-11-06 11:55 +03:00 · **Parent:** plan 45 step 8, the knowledge-hook lock; facts from `ConanExiles/modpack.json` and the build's override matrix
> **Status:** living notes — the ONE place for this mod's internals
> **Outbound:** —

**What it is.** Lifts the vanilla «cannot build here» refusals on flat free ground (the owner's pick of 2026-09-09). Its own settings window `W_LBPRMenu`
(module row `LBPRWidgetID`), opened from «Настройки модов → Прочее» (KrinikConanUI); ModControlPanel removed from the build 2026-11-03 (manifest).

## Assets

- **`/Game/Systems/Thrall/BP_ThrallSystemComponent`** — a VANILLA path shipped whole (override matrix 2026-11-06 11:55 +03:00, `mod-overrides.py`); Bosses My New Besties ships the
  same path. Load order: BMNB 3rd, this mod 15th in `modlist.txt` → this mod's copy is the one the game loads (kind 3 — plan 45 step 8, being judged).

- **Two more vanilla paths shipped whole** (found by `patch-rollback.py` on 3.1.0, read 2026-11-13 21:4x by `stale-copy-check.py --old`, plan 53 step 12):
  `/Game/Systems/Building/Placeables/BP_Master_Placeables` — the mod edits `CanBePlaced` (+306 −77 ~493 of 583 statements against 3.0.1) and `PreCanBePlacedSuccess`
  (+5); its `SetupForBrush` differs from 3.0.1 exactly as 3.1.0's does (the author took the patch's change there). `/Game/Systems/Building/BP_BuildSystem_v2` — the
  mod's event graph +87 −82 ~96 of 899 against 3.0.1; 3.1.0 changed ~8 statements of it — whether the author's copy holds them is not read yet. Parked with step 12.

## Open

- plan 45 step 8, read 2026-11-06 12:09 +03:00 (`uaj exports` sizes against the game's copy; names of the two copies): this mod changes 6 functions — `CanBePlaced`,
  `CheckTargetLocationForBuildings`, `CheckValidPlacement`, `PlaceThrallImplementation`, `ServerTeleportThrallInternal`, `ShowThrallPlaceable` — reading its
  config `ST_LBPRConfig` (`ThrallPlaceAnywhereAdmin/Everyone`, `OverlappingFollower`, `PlacementofFollowersNextToOthersRadius`, `InsideCollisionCavesDungeons`,
  `PlacementOnLandClaim`, walkable-floor toggles). BMNB's change in `ShowThrallPlaceable` (a boss's ghost scale) is lost under this copy — C, interview #033.
- **KRINIK MODIFIED 2026-11-06 14:16 +03:00 (plan 45 step 8a, `[OWNER]` interview #034 Q2 = A + «если получится, то в LBPR нужно затянуть модельки из Bosses My New Besties»):**
  BMNB's lines are GRAFTED into this mod's `ShowThrallPlaceable` — after the vanilla `GetActorScale3D` statement: `GetActorGameplayTags(GetOwnerCharacter)`, two
  `HasTag` (`Npc.Boss.Miniboss`, `Npc.Boss.WorldBoss`), `BooleanOR`, `SelectVector((1.2,1.2,1.2), thrall scale, isBoss)` → `SetActorScale3D`; this mod's own edits
  untouched (28 of 29 exports byte-identical, only `ShowThrallPlaceable` changed). Recipe: `ConanExiles/_config/krinik_patches/No_Building_Placement_Restrictions__BP_ThrallSystemComponent.tsv`
  (`graft:ShowThrallPlaceable\tBossesMyNewBesties`), built by `patch-mod-asset.py` → `kismet-graft.py`; manifest `krinikBuild` / `krinikModified`; original pak in
  `_patch-originals`. Live: loads, the five grafted locals in the live UFunction; seven ordinary placements without a script warning, the ghost's scale not read (report
  `testcases/reports/2026-11-06_conan-thrall-ghost-graft.md`). Open: the boss ghost's 1.2 itself — needs a recruited boss thrall item (BMNB's own function);
  LBPR's toggles not walked in game after the edit.
- On a mod update: put the new pak into `_patch-originals`, rebuild by the recipe — the graft stops (exit 3) if the author changed the statements it lands on.
