# Research — which authors of the Conan 3.0.1 build get a settings hub

> **Created:** 2026-10-31 · **Parent:** plan 38, the owner's word 19:10 «и так по всем авторам, чьи моды есть в сборке и имеют настройки» (a hub «Моды <Author>'а»
> per author) · **Status:** first pass from files 19:1x — the «has settings» column is evidence-graded; the live check (the module table scan) is open
> · **Outbound:** the list of hub entries for phase 1 of plan 38

**How it was built.** `ConanExiles/modpack.json` enabled mods (78 entries) grouped by the Workshop `creator` (`_catalog/details.json`); our `Krinik…` mods as one
author; mods without a Workshop page apart. «Has settings» evidence, strongest first: **[module]** — a settings UI module of the mod seen live
(`researches/conan-mod-settings-hub/README.md` §2, STATUS «the AMR, Emberlight, Pickup+, Horti windows»); **[save]** — its settings save in the manifest's
`exportConfig`; **[text]** — settings strings in our translation (`_config/localization/kit-saved-loc/KrinikRU/ru_table.lua`); **[plan]** — our own mods, rows
planned in plan 38 phase 2. Author names: the ones the project already uses; the rest read from the Workshop page at phase 1 (`TO FILL`).

## Hubs (authors with at least one mod with settings)

| Hub (list entry) | Author's mods with settings | Evidence | Other mods of the author in the build (no settings found) |
|---|---|---|---|
| «Моды Krinik'а» | KrinikConanCamera, KrinikConanUI, KrinikConanModPackManager, KrinikConanGraphics (blood hold), KrinikConanArchery | [plan] | KrinikConanGameplay, KrinikConanRussianTranslation (KrinikConanHarness is dev-only, not shipped) |
| «Моды Xevyr'а» | The Damage Meter (`DN_UI_Settings`), Proximity Party (`PrP_Settings`), Simple Minimap (`SM_UI_Settings`), Lore & Loot Highlight (`LLH_Settings`), Al-Merayah Reborn (`AMR_Settings`) | [module]; Proximity Party, Simple Minimap also [save] | Simple Modlist ([save] — verify), Inventory Compactor, Chest Labels, Reliable Meteor Showers |
| «Моды Hosav'а» | Hosav's Custom UI (`HosavUIsettings`) | [module], [save] | — |
| fishing (the owner: its window stays as is, 18:54) | Exiles Fishing (`ExilesFishingTuning`) | [module] | — |
| author of Night Terrors — `TO FILL` | Night Terrors (`NightTerrorsSettings`) | [module] | Diverse Barkeeps |
| author of EAA — `TO FILL` | Enhanced Armory and Arsenal (`EAA_*`) | [module] | EAA Lv50 Thralls |
| author of PvE Plus Ambush — `TO FILL` | PvE Plus Ambush | [text] (ambush settings strings) | Less Building Placement Restrictions |
| author of Emberlight — `TO FILL` | Emberlight | [module] (STATUS) | — |
| author of Pickup+ — `TO FILL` | Pickup+ | [module] (STATUS) | — |
| author of ModControlPanel — `TO FILL` | ModControlPanel — itself a settings panel of other mods | [module] | — |

**Single-mod authors → one hub «Прочее»** (`[OWNER]` 2026-10-31 19:14 «если у автора один мод - ему отдельную кнопку не делаем, а объединяем их в Прочее»).
So the entries are «Моды Krinik'а», «Моды Xevyr'а» and «Прочее» (Hosav's Custom UI, Exiles Fishing, Night Terrors, Enhanced Armory and Arsenal, PvE Plus Ambush,
Emberlight, Pickup+, ModControlPanel). An author whose second configurable mod turns up in the live scan moves out of «Прочее» into a hub of his own.

## Open — the live check

1. Scan the merged `DT_UIModuleTable` in a running game (the remote: the table's row names) for rows whose name holds `Settings|Config|Tuning|Panel|Options`,
   map each row's widget path `/Game/Mods/<Mod>/…` to the mod — the full, not the remembered, list.
2. «Horti» (STATUS) is not a mod name of the manifest — find which mod owns that window.
3. Author names for the `TO FILL` rows from the Workshop pages (`https://steamcommunity.com/sharedfiles/filedetails/?id=<workshopId>`), one page each.
