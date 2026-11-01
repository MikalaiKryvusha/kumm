# Run report — the Caverns of Set chests get loot from the build's table

## Work

The 16 chests of the mod Caverns of Set spawned no loot (case C1 of the stability TC, notes `games/ConanExiles/mods/CavernsOfSet.md`); the owner chose option 2
(`[OWNER]` 2026-11-01 08:58 «делаем сейчас 2»): our random recipe at the path the chest expects. Basis: `testcases/TC_conan_caverns_chest_loot_2026-11-01.md` (K1–K5).

## Contour

Conan Exiles Enhanced 3.0.1 with the build; the KrinikConanGameplay pak rebuilt 09:4x by `build-level-mod.py` (step 3b: `Caverns_of_Set_Loot_Chest_Table`, 12 rows
from `_config/caverns_loot.py`); background launch; the owner's save; god on; the hero teleported into the caverns by the remote.

## Runs

1. 2026-11-01 09:44–09:48 — `python -I -X utf8 _config/devkit/build-level-mod.py --name KrinikConanGameplay --work <scratch>/glvl4 --out _unpacked/KrinikConanGameplay`
   (three earlier tries in the same 10 minutes: 2.2.3 view → unresolved imports; 5.6 shim → UAssetGUI refused; a 5.8-written asset → old retoc to-zen refused).
2. 2026-11-01 09:50 — `Deploy-ModPack.ps1 -PackDir . -Deploy -Only KrinikConanGameplay`; `launch-bg.ps1`; `enter-world-remote.sh`; `god-on.sh`.
3. 2026-11-01 09:52–09:54 — `pult.sh "lua return dofile('<chest_probe.lua>')"` (tables), `K2_SetActorLocation` into the caverns, `chest_inv.lua`, `chest_items.lua`,
   `ItemInventory:GetItemList` of chest `_7`; `ConanSandbox.log` grepped.

## Checks

- Hygiene: builder step 6 — 12 rows = the recipe, the table in the container at `/Game/Mods/Mines_of_Set/Tables/`, data = written, name map covers the rows; the
  three progression tables unchanged (values = generators, imports = MrS).
- Functional run: the live game by the remote, values read from the live objects.
- K1 pass — all 16 chests loaded; `LootTable` and the spawner's `LootTableFromSpawnTable.DataTable` = our table (05:2x the same reads were nil).
- K2 pass — chest `_7` (nearest, 89 m) filled by itself: 6 items — clay pot, war paint (strength), war paint (endurance), great banner, painting, master's armour
  repair kit — rows 1–5 of the recipe; the 15 farther chests hold 0 (the spawner fills near the player).
- K3 skipped — opening the chest needs real input on the owner's screen; the item list was read instead.
- K4 pass — no log line names our package; the mod's «ToBeAddedDataTable is null» is gone.
- K5 pass — the vanilla Relic T4 chest still reads `DT_LC_RelicHunter`.

## Found

none — the chests work with the shipped table. Process findings (not defects of the build): the builder's view `_paksview-2.2.3` is stale for vanilla imports;
UAssetGUI reads retoc-5.8 output only as `VER_UE5_8`; the old retoc packs only the 5.6 object version — all three written into `build-level-mod.py` comments.

## Traces

Probes `chest_probe.lua`, `chest_inv.lua`, `chest_items.lua` in the session scratchpad; the remote's `result.txt`; `ConanSandbox.log` 09:54; builder output
(step 6 lines) in the pack commit `c590f36` message.

## Verdict

pass — K1, K2, K4, K5 pass; K3 skipped with the reason named (the item list read instead).
