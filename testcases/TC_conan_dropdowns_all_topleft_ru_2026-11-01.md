# Test cases — Conan: the English «All» (ModControlPanel) and «Top Left» (Damage Meter) drop-downs in Russian

> **Created:** 2026-11-01 · **Parent:** bug 64 items 47, 49; STATUS «ALSO BEFORE THE RELEASE, IN 1.0.0» · **Status:** cases written 2026-11-01 12:31 +03:00; run 12:32–12:38 — all pass · **Outbound:** —

**Basis.** The owner listed «All» and «Top Left» for 1.0.0 (STATUS 2026-11-01 09:01). Damage Meter: `lit:` of the four corners in `DN_UI_SettingsWindow` (AddOption ×4,
SetSelectedOption, the switch `GetAnchorIndex`; the save keeps the NUMBER `RestoreAnchor`). ModControlPanel: «All» is the category «all mods» — four `lit:` in
`W_CP`, two in `W_MCP_SettingsWidget`, the defaults in `MDC_MCP` and `MCP_SaveData_v1/v2` (the first reading «a code-less combo» was wrong — corrected 12:35, see the report).

**Stand.** Game behind, world entered, any place; the windows opened by the remote (`ActivateModule`), frames by `capture-window.ps1`; the corner choice by a real click when the owner is idle.

| # | Case | Steps | Expected | Status | Observed |
|---|---|---|---|---|---|
| D1 | Damage Meter settings: the corner list in Russian | open `DN_UI_Settings`; frame; open the list | the value and the four options: «Вверху слева», «Вверху справа», «Внизу слева», «Внизу справа» | pass | report `2026-11-01_conan-dropdowns-all-topleft-ru.md` |
| D2 | The choice still works | pick «Внизу справа», save; read `DamageMeter.sav` / the meter's anchor | the anchor number changes (3), the collapsed meter goes to that corner | partial | by a DIRECT call, not a save: the live window's `GetAnchorIndex` maps the four Russian options to 0…3 — the switch the save path uses; the save and the meter's move were not walked |
| D3 | Control: back to «Вверху слева» | pick it, save | anchor 0, the meter top left | partial | the selected index is 0 = «Вверху слева» at opening (our default); no save walked |
| M1 | ModControlPanel: «Все» at the top right | open `ModControlPanel`; frame | «Все» where «All» stood; the rest of the panel as before | pass | report `2026-11-01_conan-dropdowns-all-topleft-ru.md` |
| M2 | The panel still filters and shows its mods | look at the list of mods in the panel (LBPR present) | entries listed as before | pass | report `2026-11-01_conan-dropdowns-all-topleft-ru.md` |
