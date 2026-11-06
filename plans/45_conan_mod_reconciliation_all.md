# Plan 45 — reconcile EVERY overlap between the mods of the Conan 3.0.1 build

> **Created:** 2026-11-06 · on the owner's word `[OWNER]` 2026-11-06 09:40 «Ты понимаешь что нужно будет разобраться и поршать ВСЕ конфликты?» (with the table of
> the 143 shared rows pasted)
> **Parent:** `researches/mod-reconciliation/GUIDE.md` (the method, `HOUSE_RULES.md` rule 27); `researches/conan-table-conflicts/README.md` (the findings);
> `MASTER_PLAN.md` acceptance criterion 2 of the build
> **Status:** 🔧 started 2026-11-06 09:40 +03:00 — group 1 (row 51420) being read
> **Outbound:** outcome C of each group → the owner, one question per group (scenario of what the player sees)

## Goal vector (Maintain)

The build's mods are consistent: every overlap between two mods — in tables, code, assets, resources, mechanics and any other kind the guide's open list grows
to — carries a judged and applied outcome. **Acceptance:** (1) `who-overwrites-table.py --shared-rows` on a world start: every listed row is in the guide's
register as A (identical) or resolved B / C / D, live values match the merge; (2) the other kinds' detectors (steps 6–10) — each finding in the register;
(3) no outcome «not judged».

## Steps — table rows (kind 1; the 143 rows of 2026-11-06, by group)

Each group by the guide: read original + both sides → classify per field → resolve → verify in game → register.

- [ ] 1. `Items/ItemTable` 51420 — SevereWeatherEnhanced → Mines_of_Set (1 row; a vanilla armour piece both re-declare). Notes: `SevereWeatherEnhanced.md`,
      `CavernsOfSet.md`. **Read 2026-11-06 09:43 +03:00 — outcome C:** the Grey One Mask is a sandstorm breather in Severe Weather, a plain mask with a text fix in Mines of Set;
      Mines of Set wins → the breather is lost. Proposed merge — Severe Weather's row + Mines of Set's text; `RepairXP` (12665 vs 3710) → the owner.
      `[OWNER]` 09:53 «С нашей ускоренной прокачкой, с нашей новой кривой - что предлагаешь?» → `[AI]` proposed 3 710: the value Mines of Set gives the whole Grey One
      set (51420–51424); vanilla caps the field at 2000, 12 665 is above every vanilla item; on our curve 3 710 ≈ 0.9 of a level at 72, ½ at 200 — PER REPAIR
      (the field is the XP for repairing the item — Funcom's «Item Table Primer», game map; 12 665 per repair would make repairing the mask an XP farm).
      **DECIDED** `[OWNER]` 2026-11-06 09:55 «Предлагаю 3 710». Merge built as six `copyprop:` lines in `ConanExiles/_config/krinik_patches/Mines_of_Set__Caverns_of_Set_Item_Table.tsv`
      (`ItemClass`, `ArmourValue`, `FirstModifier`, `Icon`, `IconLayers`, `GameplayTags` ← `SevereWeatherEnhanced:LFS_ItemTable:51420`; the new `patch-mod-asset.py`
      operation); `RepairXP` 3 710 and the texts stay Mines of Set's. Next: the rebuild, a world start, the live row, the mask's tooltip. Then: a
      `patch-mod-asset.py` map on Mines of Set's table (number field support needed), a world start, the live row, the mask's tooltip.
- [ ] 2. Xevyr's shared UI rows `XCS_Panel`, `Xev_MouseInteraction` (`DT_UIModuleTable`) — ProximityParty → Simple_Minimap → LLHighlight → AlMerayah_Reborn
      (2 rows; likely A).
- [ ] 3. Werewolf / werehyena harvest loot (`Gathering_v2/LootTable_Resource`, 8 rows) — ResourceStimulusPackage → EnhancedArmoryAndArsenal.
- [ ] 4. Boss / elite spawns (`SpawnTable/SpawnDataTable`, 24 rows) — BossesMyNewBesties → Heritage (17), → EnhancedArmoryAndArsenal (7); Heritage → EraOfTrials
      (2 dialogue NPCs).
- [ ] 5. Armourer templates (`ProfessionTemplateDataTable`, 47 rows) — Asghaard_Ancient_Civilization → TDI_LegendaryRepair.
- [ ] 6. Religious items and recipes (`Items/ItemTable` 54, `RecipesTable` 5) — LegitReligious_Enhanced → EraOfTrials.
- [ ] 7. The rows the log cannot show — «added by A, overwritten by B»: for every pair of mods merging into the same game table (the `owntable` rows of
      `mod-overrides.py`), compare their row KEYS offline (their own tables' row names) — the full list of shared keys, beyond the log's 143.

## Steps — the other kinds (the guide's open list)

- [ ] 8. **Assets:** `mod-overrides.py` over the build — every vanilla path shipped by two paks (first run 2026-11-06: `BP_ThrallSystemComponent`,
      `WBP_BuffIcon` in two mods each; `Dev/AlmostEmpty.umap` in six).
- [ ] 9. **Code:** every UE4SS `RegisterHook` target and `RegisterKeyBind` key in the build's Lua mods (ours and others'), and the blueprint mod controllers'
      overrides of the same game function — pairs listed.
- [ ] 10. **Resources:** the A-B-A flight with the full build (plan 34 / acceptance criterion 3) — the mods' cost per frame; pairs that spend the same budget.
- [ ] 11. **Mechanics:** the build's features done twice (ambushes: Night Terrors + PvE Plus Ambush; loot boosts; XP pop-ups; weather) — from the mods' notes
      and descriptions; the stacking numbers.
- [ ] 12. **Other kinds found on the way** (screen places, localization keys, author-demanded load order, saves, `Engine.ini` keys) — each gets a row in the
      guide's list and a step here.

## Verification

After each resolved group: a world start, `--shared-rows`, the live value of one merged row by the remote, one in-game look of what the player sees. Run report
per batch in `testcases/reports/`.

## Risks

- A merged row inside another author's pak is lost on that mod's update — the map next to the pak re-applies it (`patch-mod-asset.py build`).
- Number fields in rows are not yet writable by `patch-mod-asset.py` — extend it at the first B case that needs one.
- Outcome D on an item id changes players' saves — none expected so far (51420 is a vanilla id).
