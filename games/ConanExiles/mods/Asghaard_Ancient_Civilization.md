# Mod notes — Ancient Civilization (Asghaard; Workshop 3721996090)

> **Created:** 2026-11-06 11:45 +03:00 · **Parent:** plan 45 step 5, the knowledge-hook lock; facts from `ConanExiles/modpack.json` and the container listed the same day
> **Status:** living notes — the ONE place for this mod's internals
> **Outbound:** —

**What it is.** Buildings and decorations of an ancient under-mountain civilization with its own production chain: the ancient mill and furnace make its own
materials (dark powder from crystal, sulphur and coal; dark stone); thralls can stand at the stations, only the mill, furnace and forge are useful (the owner's
pick of 2026-09-09; manifest). 1.17 GB — the third largest mod of the build.

## Assets merged into the game's tables

`/Game/Mods/Asghaard_Ancient_Civilization/Tables/AC_ProfessionTemplateDataTable` (crafter templates — merged into `SpawnTable/ProfessionTemplateDataTable` by
`AC_MergeControl_Profession`; e.g. its crafting group 3780759 is added to the vanilla `Armorer_4`, live 2026-10-26, `ConanExiles/docs/17` item 2).

## How to look inside

`python -I -X utf8 ConanExiles/_config/devkit/patch-mod-asset.py extract Asghaard_Ancient_Civilization AC_ProfessionTemplateDataTable <work>`.

## Open

- plan 45 step 5, judged live 2026-11-06 11:49 +03:00: on the 47 tier-4 crafter rows it shares with TDI_LegendaryRepair its crafting group lives (3780759 on 34 armorers,
  3780751 on 13 blacksmiths); its `ThrallGroup` «Warrior» on those rows is NOT applied (live «Crafter») — most likely the author's slip, left as is.
