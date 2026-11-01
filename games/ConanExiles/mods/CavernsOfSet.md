# Mod notes — Caverns of Set (Workshop 3722525736, PNutt)

> **Created:** 2026-11-01 · **Parent:** case C1 of `testcases/TC_conan_build_stability_compat_perf_2026-10-26.md`; pack `docs/17-совместимость-3.0.1-по-журналу.md`
> **Status:** living notes — the ONE place for this mod's internals
> **Outbound:** — (the loot choice → the owner, see «Open»)

**What it is.** A cave level of the Mines of Set under the Exiled Lands with its own chests, teachers and journal. Pak `Mines_of_Set.pak` (1.66 GB wrapper; inner
`Mines_of_Set-Windows.utoc` also in `_paksview-3.0.1`), level `/Game/Mods/Mines_of_Set/Caverns_of_Set_Level`.

## How to look inside

`retoc-5.8 to-legacy --version UE5_7 --no-shaders --filter Caverns_of_Set_Level D:/work/ai_sandbox/_paksview-3.0.1 <work>` (the FOLDER, not the utoc: the converter
needs `global.utoc` for script objects) → `UAssetGUI tojson <umap> <json> VER_UE5_8` (70 MB) → exports by `ClassIndex` (2026-11-01).

## The chests (level file, 2026-11-01 05:2x)

- 60 loot spawners in the level; 16 chests are the MOD's `BP_PL_CoS_Loot_Chest_C`, the rest vanilla (`BP_PL_LootChest_Coins` 10, `…_Legendaries` 7,
  `…_Relic_T4` 7, `…_Blackhand_T5` 3, `…_Dogs_T3` 3, `…_Dogs_T4`, `…_Exiles_T3/T4`, `…_Generic_T4`).
- **No placed chest overrides its loot table**: the level's name table holds no `LootTable`, and every chest's `BP_AC_LootSpawner` instance sets only
  `UCSSerializationIndex`, `bNetAddressable`, `CreationMethod`. So the 16 mod chests take the class default — `Default__BP_PL_CoS_Loot_Chest_C.LootTable` and the
  spawner's `LootTableFromSpawnTable` → `/Engine/UnknownPackage` (docs/17): the table they wait for, `/Game/Mods/Mines_of_Set/Tables/Caverns_of_Set_Loot_Chest_Table`,
  is in neither the author's pak nor the game. **CONFIRMED LIVE 2026-11-01 05:2x:** all 16 mod chests are in the world (always loaded); chest `_7` at (-154486, 6216, 4768) — the file's
  position is the world's — reads `BP_AC_LootSpawner.LootTableFromSpawnTable` = nil / row None and `LootTable` = nil, while the vanilla chests of the same level
  read `DT_LC_Exiles` (Exiles T4) and `DT_LC_RelicHunter` (Relic T4): **the 16 mod chests spawn no loot.**
- Positions (world units, `RootComponent.RelativeLocation`): `_0` (-131073, 55022, -15454) · `_1` (-142784, 41510, -13842) · `_2` (-144182, 41063, -13842) ·
  `_3` (-143853, 41721, -12790) · `_4` (-133645, 61810, -15444) · `_5` (-111565, 84263, -3764) · `_6` (-116426, 18006, -3366) · `_7` (-154486, 6216, 4768) ·
  `_8` (-156362, 30024, 3722) · `_9` (-125416, 86215, -11780) · `_10` (-122381, 82233, -11780) · `_11` (-126670, 48511, -12827) · `_12` (-126138, 47030, -12827) ·
  `_13` (-120266, 18372, -12299) · `_14` (-135600, 33539, -12593) · `_15` (-129815, 40185, -10337).

## Fix route (2026-11-01 08:4x, `[AI]` — not started, waits for the owner's loot choice, interview #029)

- `/Engine/UnknownPackage` is how `retoc to-legacy` prints an import whose package is NOT in the containers it was given; the cooked chest refers to the table by its
  package id (`128043E70D476916` = `/Game/Mods/Mines_of_Set/Tables/Caverns_of_Set_Loot_Chest_Table`, docs/17). So the cheapest fix needs no edit of the author's
  pak: ship a DataTable at EXACTLY that path from our kit (the kit already saves assets outside its own folder — `KIT_TEX_DIR`, the game logo override) with the
  row struct of the vanilla loot tables; the chest and the mod's merge (`ToBeAddedDataTable is null` in the log) should then find it. Check first in the kit:
  the chest BP's import of the table (struct name), then a live read of `LootTableFromSpawnTable` after the ship.
- Content options for the owner: rows copied from `DT_LC_RelicHunter` / `DT_LC_Exiles`, or the mod's OWN items (`Caverns_of_Set_Item_Table` is in the pak) mixed
  with relic rows — the closest to what the author likely meant; an older (pre-Enhanced) version of the mod may still hold his original table.
- Tell the author (PNutt) on the Workshop page — an outward message, only by the owner's word.
- **What the author meant — the sources (2026-11-01 08:4x):** the Workshop description (Steam `GetPublishedFileDetails`) says nothing about chests; it names a
  «higher mid-game to end-game dungeon» and feats / craftables «spread out within the mod area for players to find and learn» (the level's 21
  `feat_teacher` interactables). The mod's own `Caverns_of_Set_Item_Table` (47 rows): Set's Divine Touch / Restraints / Sedation Arrow / Fang
  (77991101–104), Grey One armour set (51420–51424), 12 Grey Ancients weapons and a shield (77991106–117), Sacred Eldarium (77991105), Altar of Tranquility,
  Blessed Forge and Smelting Furnace of Set, Grey One Banner (80718), dragon trophies and heads, Set's Healing Tincture (77991133), Set's Sacred Shemagh
  (77991140), plus `XX_*` creature attack rows. The chest table itself is lost, so its exact contents are NOT known from any source.

## Open

- The fix needs the owner's choice of WHAT the chests hold (the author's own table is lost): a vanilla table of the same level (the T4 chests beside them) or a
  table of our own at the expected path (kit).

## The author's side (checked 2026-11-01 08:5x, Steam API + the Workshop pages)

- No newer version: the Workshop item was last updated 2026-09-16 («Ver 2.6», the port to the UE 5.8 dev kit); its file size 1 659 155 549 equals our copy.
- The changelog shows the author fought this before: an early-summer update «revised custom mod chest loot so they hopefully spawn items correctly»; another
  «added mod specific loot chest to grey lotus data table drops, added back in mod loot chests and base game loot chests»; 2.5 (Jul 23) «added back in loot
  chests in the outpost and inside the caverns area». 2.6 (Sep 16) says nothing about chests — the table most likely fell out in that port.
- Comments (16 k characters) and discussions: no report of empty chests. The author's Discord (from the description) was not read.
