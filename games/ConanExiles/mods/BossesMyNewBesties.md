# Mod notes — Bosses My New Besties (Nexus 18)

> **Created:** 2026-11-06 · **Parent:** plan 45 step 4, the knowledge-hook lock; facts from `ConanExiles/modpack.json`
> **Status:** living notes — the ONE place for this mod's internals
> **Outbound:** —

**What it is.** Bosses, minibosses and unique NPCs can be knocked out and recruited as thralls. With the 100-follower limit it loads the game thread — if
stutters come, check this pair first (manifest).

## Assets

`/Game/Mods/BossesMyNewBesties/BMNB_SpawnDataTable` — its spawn rows, merged into the game's `Systems/SpawnTable/SpawnDataTable` (the boss rows it makes
recruitable).

`/Game/Systems/Thrall/BP_ThrallSystemComponent` — a vanilla path shipped whole; its only change against the game — `ShowThrallPlaceable`, read byte-exact
2026-11-06 13:49 +03:00 from THIS mod's container (`kismet-trace.py` on a view «game + this mod as `<Mod>_P`»): the vanilla code gives the placement ghost the thrall's
`GetActorScale3D`; BMNB adds `GetActorGameplayTags(GetOwnerCharacter)` → `HasTag Npc.Boss.Miniboss` OR `HasTag Npc.Boss.WorldBoss` → `SelectVector((1.2, 1.2, 1.2),
thrall scale, isBoss)` → `SetActorScale3D`: a boss's ghost is a FIXED 1.2 (its recruited NPC class is «20percentbigger»), every other thrall's ghost as in the game.
(Corrected: «gives the placement ghost its own actor scale» of 12:09 was false — the constant was not read.) Less Building Placement Restrictions ships the same path
and loads later; the change is GRAFTED into LBPR's copy (plan 45 step 8a, `ConanExiles/_config/devkit/kismet-graft.py`; see LBPR's notes); recruitment itself is
in the spawn tables.
How to read this asset of this mod: `patch-mod-asset.py extract` returns the GAME's copy for a vanilla path (retoc ranks the game's containers higher) — use the
`_P` view instead (`researches/mod-reconciliation/GUIDE.md` step 2, the read-a-mod's-vanilla-path note).

`/Game/Systems/Building/Placeables/BP_PL_Crafting_Station_AnimalPen` — a second vanilla path shipped whole (read 2026-11-13 21:4x, plan 53 step 12): every export
equals 3.0.1 AND 3.1.0, by bytes and by bytecode meaning; only the cooked package's header differs from 3.1.0's (its parent `BP_PL_Crafting_Station` changed in 3.1.0).
A passenger, not an edit: the game's chunk should win (`game-chunk:`) — needs a `krinikBuild` for this mod first (it has none: original pak into `_patch-originals`,
library copy into `_krinik-modified/`, KRINIK MODIFIED). Parked with plan 53 step 12.

## How to look inside

`python -I -X utf8 ConanExiles/_config/devkit/patch-mod-asset.py extract BossesMyNewBesties BMNB_SpawnDataTable <work>`.

## Open

- 2026-11-06 (plan 45 step 4): 17 of its boss / elite spawn rows are also written by Heritage, 7 by EAA (both load later). **Heritage — judged 2026-11-06 11:10 +03:00:** the game
  merges the rows field by field; the live `SpawnDataTable` keeps this mod's `ProfessionTemplate`, `StatTemplate`, `StatModifierTemplate`, `NPCClass` on 17 of 17
  rows (e.g. `Aesir_Boss` → `/Game/Mods/BossesMyNewBesties/HumanoidNPCCharacter_20percentbigger_noknockout`) beside Heritage's races — nothing lost, nothing
  built. (Corrected: «`LootTable` C» and «LOST» of the file-level reading were false — the import index, then whole-row thinking; KUMM EXP-0458.) **EAA's 7 — judged
  2026-11-06 11:41 +03:00:** EAA replaces whole rows, so this mod's fields were LOST on the Silent Legion warriors 1–3, the Siptah devolved bird / demon-spider / werewolf
  bosses and the white tiger; merged into EAA's table (EAA's notes), live after: 7/7. The mod's own function (knock a boss out, recruit him) — not run in
  game yet.
