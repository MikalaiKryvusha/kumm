# TC — bosses keep Bosses My New Besties' recruitability under Heritage (plan 45 step 4)

> **Created:** 2026-11-06 · **Parent:** `plans/45_conan_mod_reconciliation_all.md` step 4; `researches/mod-reconciliation/GUIDE.md` step 5
> **Status:** cases written 2026-11-06 10:59 +03:00; run 2026-11-06 11:16 +03:00 — H0, H1 pass, M0 the finding, H2, H3 skipped; R0, R1, D0 pass, E0 the finding, fixed and passed (reports `testcases/reports/2026-11-06_conan-boss-rows-heritage-bmnb-live.md`)
> **Outbound:** —

## Test basis

- `[OWNER]` the build's criterion 2 (`MASTER_PLAN.md`): no row where a mod silently loses its change.
- Claim under test (previous chat, file-level `row-diff.py`): Heritage, loaded later, wipes BMNB's `ProfessionTemplate` / `StatTemplate` /
  `StatModifierTemplate` / `NPCClass` on 17 boss rows. Counter-evidence: `ConanExiles/docs/17`, item 3 — the live table of 2026-10-26 showed 3 of
  these bosses with BMNB's fields AND Heritage's races (the game merges rows field by field).

## Stand

Conan 3.0.1 working install, background path (`launch-bg.ps1`), the remote `KrinikAgentRemote`, world entered by `enter-world-remote.sh`. Paks: H0 — the
ORIGINAL Heritage pak (`_workshop/3726392245`, 2026-10-02) in `ConanSandbox/Mods`; H2 — the merged pak only if H0 fails. Read-only reads: `_config/live-rows.lua`.
Boss case: god mode, the boss spawned by the remote's `Summon` before the hero (class from the live row's `NPCClass`), knocked out by the remote.

## Cases

| Case | Dimension | Steps | Expected | Status |
|---|---|---|---|---|
| H0 | control: the ORIGINAL Heritage | world start; `live-rows.lua` over the 17 rows, fields ProfessionTemplate, StatTemplate, StatModifierTemplate, NPCClass vs `BMNB_SpawnDataTable` | if the field merge holds: SAME on every BMNB field of every row (17 × 4) | **pass** — 17 × 4 SAME (11:06) |
| H1 | the same start, Heritage's side | `live-rows.lua` with `mod` = `HeritageSpawnDataMasses` / `…Uniques`, field MaleRaceTemplate | SAME — Heritage's races live | **pass** — 14 + 3 SAME; control vs BMNB DIFF 16 / 13 |
| H2 | only if H0 shows DIFF: the merged pak | install the merged pak, a world start, H0 again | SAME 17 × 4 | **skipped** — H0 passed, merge reverted |
| M0 | control for plan 45 step 1 (same mechanism): the ORIGINAL Mines of Set | world start; `live-rows.lua` on `Items/ItemTable` row 51420, fields ItemClass, ArmourValue, FirstModifier, Icon, IconLayers, GameplayTags, RepairXP vs Severe Weather's `LFS_ItemTable` | field merge holds → SAME on the breather fields Mines of Set keeps vanilla (ItemClass, ArmourValue…); DIFF on RepairXP (both change it) | **fail of the expectation = the finding** — every breather field DIFF: the item table replaces whole rows; the 51420 merge is needed |
| R0 | plan 45 step 6: the 54 bows/weapons LegitReligious re-declares, Era of Trials merges ammo into (`EoT_DT_BowCompatableAmmunitions_Merge`, its rows empty but `CompatableAmmunitions`) | world start (the build as shipped); `live-rows.lua` on `Items/ItemTable` the 54 rows, fields WeaponStaminaAttackSingleBasic, WeaponStaminaAttackSingleSpecial, ItemContainerSize, RepairItem3, CompatableAmmunitions vs `LegitReligiousItemTable` | LegitReligious's stamina / container / repair SAME on 54; ammo — LR's list plus EoT's arrow (DIFF to LR's table, check the text holds both) | **pass** — LR's fields SAME 54/54; ammo = LR's list + 47210132 on 54/54 |
| R1 | plan 45 step 6: the 5 Zathite dancer recipes (52645–52648, 52659) | `live-rows.lua` on `RecipesTable`, all 43 fields, vs LegitReligious and vs Era of Trials (`EoT_DT_Religious_Recipe_Add`) | live = Era of Trials' whole row (the later); LegitReligious's one change (ingredient 2 quantity 0 → 5) — absent | **pass (as a reading)** 11:3x — 43 fields SAME to Era of Trials ×5; outcome C on the recipe (owner's choice) |
| E0 | plan 45 step 4: BMNB → EAA, 7 rows (Silent Legion ×3, Siptah devolved bosses ×3, white tiger) | `live-rows.lua` on `SpawnDataTable` vs BMNB (StatTemplate, StatModifierTemplate, NPCClass, ProfessionTemplate) and vs `DT_EAA_Spawntable` (NpcTags, LootTable) | both SAME 7 / 7 (field merge) | **fail → the finding**: BMNB's fields vanilla on 7/7 (EAA replaces whole rows); after the merge (E1) — BMNB 4 fields SAME 7/7, EAA's SAME 7/7 — **pass** |
| D0 | plan 45 step 4: Heritage → Era of Trials, 2 dialogue NPCs (Muriela, Yakira) | `live-rows.lua` vs `HeritageSpawnDataUniques` (FemaleRaceTemplate) and vs `EoT_DT_Religious_SpawnData_Merge` (NPCClass) | both SAME 2 / 2 | **pass** |
| P0 | plan 45 step 5: 47 crafter rows of `ProfessionTemplateDataTable` (Ancient Civilization → TDI) | `live-rows.lua` vs `TDI_Legin_TemplateTableProfession`, fields CraftingGroups, BonusRecipes, ThrallGroup; check every live CraftingGroups holds 3780759 and every BonusRecipes holds 22120501 | both appends live on 47/47 | **pass** — crafting group 47/47, repair kit 47/47 (34 armorers + 13 blacksmiths, their own ids); ThrallGroup «Crafter» 47/47 |
| S0 | plan 45 step 8: LegitReligious ships a stale WHOLE copy of `Items/ItemStatModificationTable` (1 653 rows, identical values; 51 rows of 3.0.1 missing — Derketo Acolyte set, Anvil Keeper armour) | world start (as shipped); count the live rows and which of the 51 are present | if the stale copy wins: live lacks the 51 | **fail → the finding**: 0/51 live; after the fix (S1, `vanilla:`) 51/51, 3 404 rows — **pass** |
| C0 | plan 45 step 8: Storage Reach Expanded's console table rebuilt as the game's + its own 3 (`vanilla+own:`) | world start; the live table's rows and the 8 keys | 28 rows; the 5 commands of 3.0.1 and the 3 `SRE.*` present | **pass** — all 8 present (128 rows: other mods add their own commands too) |
| N0 | plan 45 step 7: item 147483093 (Harley Quinn nails) in MSCasaDesFlores Weapons AND Nails (loads later) | live `EquipmentVariationTable` MalePath / FemalePath / PhysicalMaterial, `RecipesTable` CraftingStations, `ItemTable` Icon of 147483093 | whose values are live — Weapons' mesh or Nails' None | **pass (a reading)** — Nails' whole row: female mesh `SK_Nails_HQ`, male None, its own station 147483104 and icon — the dedicated mod's coherent version; A in effect |
| G0 | bug 82 study: nests in the loaded region (the oasis save) | `nest_scan.lua` — StaticMeshActors with a nest/egg mesh, actors whose class names a nest/egg, with distances | a list of nests with positions, or 0 here | **pass (a reading)** — 31 nest meshes; the takeable eggs are `SM_KappaEggs_Blueprint_C` actors (3, nearest 70 m) — bug 82 |
| G1 | bug 82: the plate's probe at a nest egg | `egg_stand.lua` (hero 150 cm from egg 0, view on it), `egg_probe.lua` (re-aim, `PickupGatheringOneInstance` as the plate) | true → the plate would show (then the cause is elsewhere); false → the eggs are outside this probe | **pass** (corrected): probe TRUE; the first frame was taken too early — the second run shows «E Взять» at the crosshair, the plate's log «в прицеле», gates false (`egg-gate.lua`) |
| H3 | the function the player sees | a boss of the list summoned by its live class, knocked out (not killed) | lies unconscious, «Взять в рабы» offered | **skipped** — BMNB's own function, owed under criterion 2 |
