# Plan 45 — reconcile EVERY overlap between the mods of the Conan 3.0.1 build

> **Created:** 2026-11-06 · on the owner's word `[OWNER]` 2026-11-06 09:40 «Ты понимаешь что нужно будет разобраться и поршать ВСЕ конфликты?» (with the table of
> the 143 shared rows pasted)
> **Parent:** `researches/mod-reconciliation/GUIDE.md` (the method, `HOUSE_RULES.md` rule 27); `researches/conan-table-conflicts/README.md` (the findings);
> `MASTER_PLAN.md` acceptance criterion 2 of the build
> **Status:** 🔧 started 2026-11-06 09:40 +03:00; steps 1–4 done, step 6 waits for interview #032 (2026-11-06 11:41 +03:00); next — step 5, then 7–12
> **Outbound:** outcome C of each group → the owner, one question per group (scenario of what the player sees)

## Goal vector (Maintain)

The build's mods are consistent: every overlap between two mods — in tables, code, assets, resources, mechanics and any other kind the guide's open list grows
to — carries a judged and applied outcome. **Acceptance:** (1) `who-overwrites-table.py --shared-rows` on a world start: every listed row is in the guide's
register as A (identical) or resolved B / C / D, live values match the merge; (2) the other kinds' detectors (steps 6–10) — each finding in the register;
(3) no outcome «not judged».

## Steps — table rows (kind 1; the 143 rows of 2026-11-06, by group)

Each group by the guide: read original + both sides → classify per field → resolve → verify in game → register.

- [x] 1. **DONE 2026-11-06 10:08 +03:00 (pack `f4a56e1`, cases G1–G3 pass, report `2026-11-06_conan-grey-one-mask-merge.md`): in game the mask is a breather («Использовать (F)»),
      armour 38, «Легкий доспех»; repair XP 3 710.** Control 2026-11-06 11:15 +03:00 (case M0, original Mines of Set): the live row is the plain armour — the loss was real, the
      item table replaces whole rows; the merge stands. `Items/ItemTable` 51420 — SevereWeatherEnhanced → Mines_of_Set (1 row; a vanilla armour piece both re-declare). Notes: `SevereWeatherEnhanced.md`,
      `CavernsOfSet.md`. **Read 2026-11-06 09:43 +03:00 — outcome C:** the Grey One Mask is a sandstorm breather in Severe Weather, a plain mask with a text fix in Mines of Set;
      Mines of Set wins → the breather is lost. Proposed merge — Severe Weather's row + Mines of Set's text; `RepairXP` (12665 vs 3710) → the owner.
      `[OWNER]` 09:53 «С нашей ускоренной прокачкой, с нашей новой кривой - что предлагаешь?» → `[AI]` proposed 3 710: the value Mines of Set gives the whole Grey One
      set (51420–51424); vanilla caps the field at 2000, 12 665 is above every vanilla item; on our curve 3 710 ≈ 0.9 of a level at 72, ½ at 200 — PER REPAIR
      (the field is the XP for repairing the item — Funcom's «Item Table Primer», game map; 12 665 per repair would make repairing the mask an XP farm).
      **DECIDED** `[OWNER]` 2026-11-06 09:55 «Предлагаю 3 710». Merge built as six `copyprop:` lines in `ConanExiles/_config/krinik_patches/Mines_of_Set__Caverns_of_Set_Item_Table.tsv`
      (`ItemClass`, `ArmourValue`, `FirstModifier`, `Icon`, `IconLayers`, `GameplayTags` ← `SevereWeatherEnhanced:LFS_ItemTable:51420`; the new `patch-mod-asset.py`
      operation); `RepairXP` 3 710 and the texts stay Mines of Set's. Next: the rebuild, a world start, the live row, the mask's tooltip. Then: a
      `patch-mod-asset.py` map on Mines of Set's table (number field support needed), a world start, the live row, the mask's tooltip.
- [x] 2. **DONE 2026-11-06 10:19 +03:00 — outcome A** (the rows sit in the shared `Xevyr_Shared` tables every Xevyr mod ships, identical; all 26 shared Xevyr files identical
      across the four containers — `REGISTER.md`). Xevyr's shared UI rows `XCS_Panel`, `Xev_MouseInteraction` (`DT_UIModuleTable`) — ProximityParty → Simple_Minimap → LLHighlight → AlMerayah_Reborn
      (2 rows; likely A).
- [x] 3. **DONE 2026-11-06 10:22 +03:00 — outcome A** (RSP's 8 rows equal the game's; only EAA, the winner, changes them; `row-diff.py` now knows the load order — a loser's
      change under a winner that keeps the original is reported «B — LOST»). Werewolf / werehyena harvest loot (`Gathering_v2/LootTable_Resource`, 8 rows) — ResourceStimulusPackage → EnhancedArmoryAndArsenal.
- [x] 4. **DONE 2026-11-06 11:09 +03:00 — outcome B, MERGED BY THE GAME ITSELF, nothing to build** (live `SpawnDataTable` with the ORIGINAL Heritage, `_config/live-rows.lua`:
      BMNB's `ProfessionTemplate` / `StatTemplate` / `StatModifierTemplate` / `NPCClass` SAME on 17 of 17 rows, Heritage's races on 17 of 17; report
      `testcases/reports/2026-11-06_conan-boss-rows-heritage-bmnb-live.md`). **CORRECTED:** the file-level «LOST» below was FALSE — the game merges rows field by
      field, as `ConanExiles/docs/17` item 3 had shown on 2026-10-26 (KUMM EXP-0458); the merge built on it (two maps, a KRINIK MODIFIED Heritage) is reverted and
      `row-diff.py` no longer prints «LOST» for that case. **The rest of the group, 2026-11-06 11:41 +03:00:** Heritage → EraOfTrials (2 dialogue NPCs) — B, Era of Trials merges
      by field, both live; BMNB → EAA (7: Silent Legion ×3, Siptah devolved bosses ×3, white tiger) — B LOST (EAA replaces whole rows, the SAME table) → merged
      by 21 `copyprop:` into `DT_EAA_Spawntable` (EAA `krinikBuild`), live after: both mods' fields 7/7 (report `2026-11-06_conan-religion-and-eaa-rows-live.md`).
      Step 4 is closed: 24 of 24 rows judged. History of the step: (start here: notes `BossesMyNewBesties.md`, `Heritage.md`, `EraOfTrials.md` created 2026-11-06 10:35 +03:00 — read them first; expectation to CHECK, not a finding:
      BMNB makes bosses recruitable, Heritage gives them faces → likely different fields → a B merge; Heritage's rows — `HeritageSpawnDataUniques` (17 bosses are
      named characters → most likely here) and `HeritageSpawnDataMasses`; PARTIAL 2026-11-06 10:37 +03:00 (`row-diff.py` vanilla · BMNB · Heritage Uniques, 17 rows): 3 rows —
      C on `LootTable` (both change the boss's loot table differently); 14 rows are ABSENT from `HeritageSpawnDataUniques` → Heritage writes them from
      `HeritageSpawnDataMasses` — re-run with that table as the last side before judging (the 14 «A» lines were computed without Heritage's row — invalid);
      RE-RUN 2026-11-06 10:38 +03:00 with both Heritage tables (14 rows in Masses, 3 in Uniques): on each row BMNB changes `ProfessionTemplate` («BMNB_OriginalStats_<Boss>»),
      `StatTemplate` («All Thralls Base»), `NPCClass` (the knockable `…_nok…` class — the mod's recruitability), and `LootTable`; Heritage changes
      `MaleRaceTemplate` / `FemaleRaceTemplate` and `LootTable`. Heritage loads later → **[FALSE — see the head of this step] BMNB's three recruitability fields are most likely LOST on all 17
      bosses** → outcome B (merge: `copyprop:` of the three into Heritage's rows) — to confirm in game (knock out one of them). The `LootTable` «C» is most
      likely FALSE: it is an object reference and `row-diff.py` compares the raw import index (−67 vs −14, per file) — teach it to resolve imports to paths first;
      DONE 2026-11-06 10:47 +03:00: `row-diff.py` resolves object references → `LootTable` identical; **[FALSE — the live table keeps them] all 17 rows — B, LOST** (BMNB's `ProfessionTemplate`, `StatTemplate`
      ×17, `StatModifierTemplate` ×10, `NPCClass` ×11 under Heritage). [superseded — not needed] NEXT: the merge maps for Heritage's two tables, `rebuild-krinik-paks.py` (Heritage has
      no `krinikBuild` yet — add one), a world start, knock out a boss (e.g. the Keymaster) — recruitable after, not before; BMNB's table is
      `/Game/Mods/BossesMyNewBesties/BMNB_SpawnDataTable`; Heritage's spawn table is not named «*spawn*table*» — list its container; vanilla
      `Systems/SpawnTable/SpawnDataTable` by `retoc to-legacy --filter SpawnDataTable` + `uaj tojson`; then `row-diff.py` in load order.) Boss / elite spawns (`SpawnTable/SpawnDataTable`, 24 rows) — BossesMyNewBesties → Heritage (17), → EnhancedArmoryAndArsenal (7); Heritage → EraOfTrials
      (2 dialogue NPCs).
- [x] 5. **DONE 2026-11-06 11:49 +03:00 — outcome B, merged by TDI itself:** both mods' appends (Ancient Civilization's crafting groups, TDI's repair kits) live on 47/47
      crafter rows; the file «C» ×47 was TDI's empty placeholders; Ancient Civilization's `ThrallGroup` «Warrior» not applied (vanilla «Crafter» — right for
      a crafter). Armourer templates (`ProfessionTemplateDataTable`, 47 rows) — Asghaard_Ancient_Civilization → TDI_LegendaryRepair.
- [ ] 6. Religious items and recipes (`Items/ItemTable` 54, `RecipesTable` 5) — LegitReligious_Enhanced → EraOfTrials. **2026-11-06 11:41 +03:00:** the 54 weapons — B, Era of Trials
      merges its ammo by field (`EoT_DT_BowCompatableAmmunitions_Merge`): LR's stamina / container / repair / descriptions live 54/54, every ammo list = LR's +
      Era of Trials' arrow 47210132; the 5 Zathite dancer recipes — C (LR fixes a vanilla zero «Venom-purified blood», Era of Trials redesigns the recipe
      whole; live = Era of Trials) → interview #032. Also found: LegitReligious ships the WHOLE vanilla `Items/ItemStatModificationTable` (kind 3 — step 8).
      Closes when #032 is answered and applied.
- [x] 7. The rows the log cannot show — «added by A, overwritten by B»: for every pair of mods merging into the same game table (the `owntable` rows of
      `mod-overrides.py`), compare their row KEYS offline (their own tables' row names) — the full list of shared keys, beyond the log's 143.
      **Tool 2026-11-06 11:53 +03:00:** `python -X utf8 ConanExiles/_config/hidden-row-pairs.py` — logged single-writer rows (3 599 in 43 tables) that are not vanilla keys
      (`uaj rows`, a new command); first table: `ProfessionTemplateDataTable` — 3 (EAA's own pets, likely EAA's two tables). **DONE 2026-11-06 12:21 +03:00:** 392 hidden rows,
      `--index` of `mod-table-keys.py` (39 664 keys of 43 mods' own tables) names the adder: one real cross-mod pair — MSCasaDesFlores Weapons → Nails (item
      147483093 + 17 stat rows; one author) — A in effect, seen live; the rest are a mod's own second table, DLC rows (merged before mods, not in the base
      tables) or key-only coincidences. Register lines.

## Steps — the other kinds (the guide's open list)

- [ ] 8. **Assets:** `mod-overrides.py` over the build — every vanilla path shipped by two paks (first run 2026-11-06: `BP_ThrallSystemComponent`,
      `WBP_BuffIcon` in two mods each; `Dev/AlmostEmpty.umap` in six). **2026-11-06 12:09 +03:00:** `WBP_BuffIcon` — A (same hash); `AlmostEmpty` — A in effect (empty kit
      map); `BP_ThrallSystemComponent` — C (BMNB's boss placement-ghost scale lost under LBPR) → interview #033; and a MOD-vs-GAME case: LegitReligious's stale
      whole copy of `Items/ItemStatModificationTable` hid 51 rows of 3.0.1 → replaced by the game's version (`vanilla:`), live 51/51. Single-mod whole
      tables re-checked against 3.0.1 (2026-11-06 12:15 +03:00): `HairColorSelections` (MSCasaDesFlores Nails) — identical, A; `CustomConsoleCommandsDataTable`
      (StorageReachExpanded) — 5 game console commands missing, its own 3 kept → MERGED 2026-11-06 12:21 +03:00 (`vanilla+own:`), live 8/8; ours —
      KrinikConanGameplay's `DT_AttributeSystem`, `DT_ExperienceSystemLevel`, `DT_FeatsPerLevel` (built by us from the 3.0.1 kit — check the row sets once). Closes when #033 is answered and the re-checks done.
- [x] 9. **Code:** every UE4SS `RegisterHook` target and `RegisterKeyBind` key in the build's Lua mods (ours and others'), and the blueprint mod controllers'
      overrides of the same game function — pairs listed. **DONE 2026-11-06 12:24 +03:00** (`ConanExiles/_config/lua-hook-pairs.py`): 11 hook targets, 2 shared (ours only;
      UE4SS's two stock enablers), 4 key binds, 1 shared (ours) — B, nothing to merge; blueprint overrides of one vanilla class — the thrall system (step 8).
- [ ] 10. **Resources:** the A-B-A flight with the full build (plan 34 / acceptance criterion 3) — the mods' cost per frame; pairs that spend the same budget.
- [ ] 11. **Mechanics:** the build's features done twice (ambushes: Night Terrors + PvE Plus Ambush; loot boosts; XP pop-ups; weather) — from the mods' notes
      and descriptions; the stacking numbers. **2026-11-06 12:26 +03:00:** swept by keyword over the manifest (register line): only the ambush pair is a doubled feature —
      waits for the owner's interview #025; levels / storage / loot / fishing / thrall extras — A or B (the off mods excluded; `DT_AttributeSystem` row 7 — only
      EAA). Closes with #025.
- [ ] 12. **Other kinds found on the way** (screen places, localization keys, author-demanded load order, saves, `Engine.ini` keys) — each gets a row in the
      guide's list and a step here. **2026-11-06 12:28 +03:00:** localization — no mod ships a `Localization/` path (override matrix), the build's only `Game.locres` is ours
      (Krinik Russian Translation) — nothing shared; `Engine.ini` keys set at runtime — the deploy's `-Verify` warning (Phase 1 slice, `source.folder` mods);
      a NEW kind met in step 8 — **a mod vs the GAME** (a stale whole copy of a vanilla table; EXP-0460) — two found and fixed. Open: screen places of HUD
      widgets (the UI epic's frames), author-demanded load order (Hosav last of UI mods — `modlist.txt` order checked by hand when a UI mod is added).

## Verification

After each resolved group: a world start, `--shared-rows`, the live value of one merged row by the remote, one in-game look of what the player sees. Run report
per batch in `testcases/reports/`.

## Risks

- A merged row inside another author's pak is lost on that mod's update — the map next to the pak re-applies it (`patch-mod-asset.py build`).
- Number fields in rows are not yet writable by `patch-mod-asset.py` — extend it at the first B case that needs one.
- Outcome D on an item id changes players' saves — none expected so far (51420 is a vanilla id).
