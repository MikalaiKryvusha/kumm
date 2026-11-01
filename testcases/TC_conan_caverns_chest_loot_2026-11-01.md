# TC — the Caverns of Set chests get loot from our table (option 2)

> **Created:** 2026-11-01 · **Basis:** `[OWNER]` 2026-11-01 08:58 «делаем сейчас 2» (interview #029; notes `games/ConanExiles/mods/CavernsOfSet.md` → Decision);
> the table `/Game/Mods/Mines_of_Set/Tables/Caverns_of_Set_Loot_Chest_Table` shipped in the KrinikConanGameplay pak (`_config/caverns_loot.py`, builder step 3b)

## Stand

- The build with the rebuilt KrinikConanGameplay pak; background launch; the owner's save; god on.
- The chest `BP_PL_CoS_Loot_Chest_C` `_7` at (-154486, 6216, 4768) (notes → positions); the hero teleported beside it by the remote.
- Loot is spawned by the chest's `BP_AC_LootSpawner` — triggered by the remote (its own spawn function, read by `funcs`), never searched in the world.

## Cases

| ID | Situation | Action | Expected | Status | Observed |
|---|---|---|---|---|---|
| K1 | world loaded | the remote reads chest `_7`'s spawner `LootTableFromSpawnTable.DataTable` and the chest's `LootTable` | both = `Caverns_of_Set_Loot_Chest_Table` (was nil) | pass | 09:53, the hero teleported into the caverns: all 16 chests loaded; `_0`, `_1`, `_10` read both = our table (05:2x: nil) |
| K2 | K1 holds | trigger the spawner's loot spawn; read the chest's inventory | ≥ 1 item; items match the recipe (T3/T4 general loot, repair kits, coins, Set's items rarely) | pass | the nearest chest `_7` filled BY ITSELF (6 items before any call; `SpawnLoot` takes 11 parameters — not needed): clay pot, war paint ×2, great banner, painting, master's armour repair kit (T4) — rows 1–5 of the recipe; the 15 farther chests 0 (the spawner fills near the player) |
| K3 | K2 holds | the hero at the chest, open it | the items visible in the chest window (frame) | skipped | the item list read by the remote (`ItemInventory:GetItemList`) instead; opening needs real input on the owner's screen |
| K4 | the game log | read `[Error]`/`LogStreaming` lines naming the table | no load error for our package | pass | `ConanSandbox.log` 09:54: no line names our package; the mod's «ToBeAddedDataTable is null» of docs/17 is gone |
| K6 | the modified mod pak (`tag:` rows) deployed | the remote reads the live merged item table rows 77991106 and 77991133 | `GameplayTags` hold `Loot.General` + `Loot.T4` / `Loot.T2` | pass | 10:05 the live merged ItemTable (18 153 rows): 77991104 Item.Weapon, Loot.General, Loot.T3 · 77991106 … Loot.T4 · 77991133 Item.Healing, Loot.General, Loot.T2 |
| K7 | K6 holds | the hero near another, never-filled caverns chest (`_5`) | it fills; with three T4 rolls a Set weapon is likely among the items (a probability — 0 Set items is not a fail by itself) | pass | 10:06–10:08, 12 chests filled, 80 items: Grey Ancients weapons (sword, hammer, mace, bow, axe, daggers, shield) in nearly every chest, Set's Divine Restraints ×2, Set's Fang, the Sacred Shemagh, Set's Healing Tincture — the mod's items come from the shared T4 pool |
| K5 | control | the vanilla Relic T4 chest of the same level | still reads `DT_LC_RelicHunter` (our copy did not replace the vanilla table) | pass | `relic T4 LootTable = DT_LC_RelicHunter` |
