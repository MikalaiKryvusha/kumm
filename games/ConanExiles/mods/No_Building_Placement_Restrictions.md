# Mod notes — Less Building Placement Restrictions (LBPR; container `No_Building_Placement_Restrictions`, Workshop 3755091710)

> **Created:** 2026-11-06 11:55 +03:00 · **Parent:** plan 45 step 8, the knowledge-hook lock; facts from `ConanExiles/modpack.json` and the build's override matrix
> **Status:** living notes — the ONE place for this mod's internals
> **Outbound:** —

**What it is.** Lifts the vanilla «cannot build here» refusals on flat free ground (the owner's pick of 2026-09-09). Its own settings window `W_LBPRMenu`
(module row `LBPRWidgetID`), opened from «Настройки модов → Прочее» (KrinikConanUI); ModControlPanel removed from the build 2026-11-03 (manifest).

## Assets

- **`/Game/Systems/Thrall/BP_ThrallSystemComponent`** — a VANILLA path shipped whole (override matrix 2026-11-06 11:55 +03:00, `mod-overrides.py`); Bosses My New Besties ships the
  same path. Load order: BMNB 3rd, this mod 15th in `modlist.txt` → this mod's copy is the one the game loads (kind 3 — plan 45 step 8, being judged).

## Open

- plan 45 step 8, read 2026-11-06 12:09 +03:00 (`uaj exports` sizes against the game's copy; names of the two copies): this mod changes 6 functions — `CanBePlaced`,
  `CheckTargetLocationForBuildings`, `CheckValidPlacement`, `PlaceThrallImplementation`, `ServerTeleportThrallInternal`, `ShowThrallPlaceable` — reading its
  config `ST_LBPRConfig` (`ThrallPlaceAnywhereAdmin/Everyone`, `OverlappingFollower`, `PlacementofFollowersNextToOthersRadius`, `InsideCollisionCavesDungeons`,
  `PlacementOnLandClaim`, walkable-floor toggles). BMNB's change in `ShowThrallPlaceable` (a boss's ghost scale) is lost under this copy — C, interview #033.
