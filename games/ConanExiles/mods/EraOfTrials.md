# Mod notes — Era of Trials (Workshop 3744562094, Orero; KRINIK MODIFIED)

> **Created:** 2026-11-06 · **Parent:** plan 45 steps 4 and 6, the knowledge-hook lock; facts from `ConanExiles/modpack.json` and bugs/64 item 17
> **Status:** living notes — the ONE place for this mod's internals
> **Outbound:** —

**What it is.** Vanilla+ religions (version 1.2.1, kit 1002): seven religions with light / medium / heavy armour sets and six-plus weapon kinds each, religious
perks, shrine desecration targets, magic-school icons on «Снаряжение». Taken 2026-10-25: `[OWNER]` «Era of Trials - давай берём, но будет встраивать в сборку так.
чтобы все моды работали корректно» (manifest).

## Assets merged into the game's tables

`EoT_DT_Religious_ItemTable_MergeControl`, `EoT_DT_Religious_Feat_MergeControl`, `EoT_DT_Religious_NPCDialogues_MergeControl`,
`EoT_DT_Religious_SpawnData_MergeControl`, `EoT_DT_Religious_WeightedSpawnTable_Add` (their tables → the game's item, feat, dialogue, spawn tables).

## Our edits — KRINIK MODIFIED

Religious perks in Russian (`EoT_DT_ReligiousPerkData`, 17 perks), shrine desecration places (`EoT_DT_DesecrationTargets`, 47 names); the magic-school icons on
«Снаряжение» (since 2026-10-29) and on «Параметры» (since 2026-11-07) injected on the event, not after `Delay 0.1` (bugs/64 item 17, KrinikConanUI — table below).

## The magic-school icons — `EoT_AC_InterfaceInjectorComponent` (bytecode read 2026-11-07 10:2x, `kismet-trace.py` on `ExecuteUbergraph_…`)

| Event (its own function) | Delay (game seconds) | Resume point | What the resume does | Ours |
|---|---|---|---|---|
| «Character Inventory Activated» (`CharacterInventory.SignalActivated`) | 0.1 → **1e9** (KRINIK MODIFIED since 2026-10-29) | 15 | `module:GetWindowRoot()` → cast `Crafting_GUI` → paperdoll → `Create(EoT_W_CharInfoMagicDisplay)` + `AddChild` | KrinikConanUI `krinik_pause_in_menu` calls 15 on the hero portrait's birth on «Снаряжение» |
| «Character Stats Window Activated» (`CharacterStatsWindow.SignalActivated`) | 0.1 → **1e9** (since 2026-11-07) | 1060 | `module:GetWindowRoot()` → cast `W_CharacterStatsWindow_C` → `W_PaperdollPanel.UICharacterDisplay` → the same icons | the same section, `inject_eot_stats`: sets the component's `K2Node_CustomEvent_module` (the stats module) and `_isActive` true, then calls 1060; skips a window that already holds the icons |
| `CharacterPossessed` | 0.2 | 1860 | — | untouched |
| «GUI Carousel Activated» | 0.1 | 2380 | the carousel button | untouched |

Under the hub's world time 0.03 (KrinikConanUI pause) a Delay 0.1 is ≈ 3.3 s: the icons on «Параметры» came between 0.3 and 1.5 s after the tab (frames 2026-11-07
10:2x; `[OWNER]` ≈10:10 «все еще с большой задеркой показываются свойства одоного мода на экране, где героя вигурка»). After the fix: on the 0.3 s frame, one set
per visit (4 visits), 4–8 ms per call. **Trap:** the three events SHARE the locals `K2Node_CustomEvent_module` / `K2Node_CustomEvent_isActive` — a resume point
called from outside reads whatever event wrote last; set them before the call. The map line order matters — `@n` counts the CURRENT bytecode, so `@2` stands
before `@1` (`_config/localization/asset-strings/EraOfTrials__EoT_AC_InterfaceInjectorComponent.tsv`); the built pak read back: 1e9→15, 1e9→1060, 0.2→1860, 0.1→2380.

## Its tables — two kinds, two merges (listed 2026-11-06 11:41 +03:00, `retoc to-legacy --filter DT_`, 78 tables under `/Game/Mods/EraOfTrials/Systems/DataTables/…`)

- **`*_Merge` + `*_MergeControl`** (`EoT_DT_Religious_ItemTable_Merge` — 1 row, 53501; `EoT_DT_BowCompatableAmmunitions_Merge` — 86 rows, all fields empty
  but `CompatableAmmunitions`; `EoT_DT_Religious_SpawnData_Merge` — 7 dialogue NPCs; `…_Feat_Merge`, `…_NPCDialogues_Merge`, `EoT_DT_ItemStatModificationDisplay_Merge`):
  merged FIELD BY FIELD — empty fields leave the earlier value, arrays are appended (seen live: every bow keeps LegitReligious's ammo list + this mod's arrow
  47210132; Muriela and Yakira keep Heritage's faces and get this mod's vendor class).
- **`*_Add`** (`EoT_DT_Religious_Item_Add` 343 rows, `…_Recipe_Add` 323, `…_SpawnData_Add` 64 priests, `…_Feat_Add`, `…_EquipmentTemplate_Add`, …): whole
  rows — the 5 Zathite dancer recipes live are this mod's rows on all 43 fields (interview #032).

## Open

- 2026-11-06 (plan 45): over LegitReligious_Enhanced — 54 weapons judged B (both kept), 5 recipes C → interview #032; over Heritage — 2 dialogue NPCs B (both kept).
