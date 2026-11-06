# Mod notes — MSCasaDesFlores Nails Enhanced (and its sibling MSCasaDesFlores Weapons Enhanced)

> **Created:** 2026-11-06 12:22 +03:00 · **Parent:** plan 45 steps 7–8, the knowledge-hook lock; facts from the build's override matrix and the live tables the same day
> **Status:** living notes — the ONE place for this mod's internals (the sibling `MSCasaDesFlores_Weapons_Enhanced` has no notes of its own — see below)
> **Outbound:** —

**What it is.** Cosmetic nails for the hero (items, recipes at its own station 147483104, equipment variations, stat modifications) by the author
MSCasaDesFlores; the same author's Weapons mod carries an older copy of some of these items.

## Assets

- Own tables: `dt_Ma_Table` (items, 64), `dt_Recipe_Table` (64), `dt_EquipementVariation_Table` (59), `dt_ItemStatModif` (75), `dt_ItemName_ToTemplateID` (64)
  (`mod-table-keys.py`, 2026-11-06 12:22 +03:00).
- `/Game/UI/Widgets/CharacterCreation/DataTables/HairColorSelections` — a VANILLA table shipped whole: 18 rows identical to 3.0.1 (harmless, A).

## Shared with MSCasaDesFlores_Weapons_Enhanced (loads earlier)

Item 147483093 «Nails Harley Quinn» and 17 stat rows: the stat rows identical; the item's rows differ (Weapons: a male mesh, the vanilla station 18523), and
the live rows are this mod's whole version — female mesh `SK_Nails_HQ`, male None, station 147483104, its icon `HQHand` (live 2026-11-06 12:22 +03:00) — A in effect.

## Open

- none.
