# Test run report — Conan: «All» (ModControlPanel) and the Damage Meter corners in Russian

**Created:** 2026-11-01 12:38 +03:00 · **Run by:** the agent (Claude Opus 5.5) · **Version/build:** Conan 3.0.1 build; ModControlPanel and DamageNumber rebuilt 12:3x by `patch-mod-asset.py`

## 1. Work

Bug 64 items 47 and 49 — on the owner's 1.0.0 list (STATUS 2026-11-01 09:01). Cases D1–D3, M1–M2 of `testcases/TC_conan_dropdowns_all_topleft_ru_2026-11-01.md`.

## 2. Contour

The owner's machine, the live build, game behind (`launch-bg.ps1`), world entered by the remote, the windows opened by `ActivateModule`; frames by
`capture-window.ps1`. REAL WORLD: accumulated — the owner's install and save; data and machine — his PC; path — the mods' own settings windows. Verified on the real world.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | ≈ 2026-11-01 12:27 +03:00 | `patch-mod-asset.py build DamageNumber DN_SG_SaveSettings <w> …SaveSettings.tsv …SettingsWindow.tsv DN_UI_SettingsWindow` | 10 literals replaced |
| 2 | ≈ 2026-11-01 12:29 +03:00 | `patch-mod-asset.py build ModControlPanel W_CP <w> ModControlPanel__W_CP.tsv` (properties only) | 2 strings |
| 3 | 2026-11-01 12:32 +03:00 | deploy both, `launch-bg.ps1`, `ActivateModule(DN_UI_Settings)`, `ActivateModule(ModControlPanel)`, frames | DM: «Вверху слев» cut; MCP: still «All» |
| 4 | ≈ 2026-11-01 12:35 +03:00 | MCP: all five assets (`lit:` in W_CP ×4, W_MCP_SettingsWidget ×2; defaults in MDC_MCP, MCP_SaveData_v1/v2); DM: `prop:SizeBox_6/WidthOverride 150` | built |
| 5 | 2026-11-01 12:36–12:38 +03:00 | deploy, relaunch, frames of both windows; remote `GetAnchorIndex(GetOptionAtIndex(i))` for i = 0…3 | «Все»; «Вверху слева» whole; `0:0 1:1 2:2 3:3` |

## 4. Checks

Hygiene: the build tool's own guard — a no-edit round trip byte-equal before each patch (passed for all seven assets).
Functional run: both windows opened in the live game, their top-right / corner rows read on frames; the corner switch called directly on the live window.

| Case | Status | Observed |
|---|---|---|
| D1 corners in Russian | pass (run 5) | «Вверху слева» whole in the field; run 3 cut it to «Вверху слев» (field 120 → 150) |
| D2 the choice still works | partial (direct call) | the live window's `GetAnchorIndex` maps the four Russian options to 0, 1, 2, 3 (the saved number unchanged in meaning) |
| D3 control | partial | selected index 0 = «Вверху слева», our default `RestoreAnchor` 0 |
| M1 «Все» | pass (run 5) | «Все» at the top right; run 3 (properties only) still read «All» — the list is filled by code |
| M2 the panel as before | pass | «Нет доступных виджетов» — the same as case U3 on 2026-10-31 12:20, before any edit |

## 5. Found

- My first reading of W_CP («a code-less combo») was wrong: UAssetAPI leaves several 5.8 functions as `RawExport`, so the JSON showed no code; the raw
  `.uexp` held four `0x1F "All"` constants. Lesson: count raw string constants in the `.uexp` before calling a widget code-less.
- ModControlPanel keeps the selected category as a STRING in its save (`DefaultSelectedCat`): a player whose old save holds «All» picks «Все» once again.
  No such save on this machine.

## 6. Traces

Frames in the session scratchpad; the owner's review folder `D:\Games\Conan Exiles Mods\НА ОТСМОТР НИКОЛАЕМ\46_vse_i_ugly_po_russki\`; tsv recipes
`ConanExiles/_config/localization/asset-strings/ModControlPanel__*.tsv`, `DamageNumber__DN_UI_SettingsWindow.tsv`. Crash-report window: none.

## 7. Verdict

pass for the Russian text (D1, M1, M2); partial for the choice (D2, D3): the switch maps the Russian options by a direct call, the save and the meter move were not walked.
