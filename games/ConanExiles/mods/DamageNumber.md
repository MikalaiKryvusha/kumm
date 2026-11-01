# Mod notes — The Damage Meter (Workshop 3719585133, KRINIK MODIFIED)

> **Created:** 2026-11-01 · **Parent:** the owner's correction of DM0 (chat 2026-11-01 04:43 +03:00); facts from the manifest entry (`ConanExiles/modpack.json`), the run report `testcases/reports/2026-10-31_conan-dm0-c1-probes.md` and bug 64 items 1, 21
> **Status:** living notes — the ONE place for this mod's internals
> **Outbound:** —

**What it is.** A live damage and DPS meter for the hero, the companions and other players: damage by type on hover, a combat log of 1 000 events, the last
10 fights plus a total; data stays on the client. For us it is an INSTRUMENT: it shows whether a combat change (ours or another author's) works at all.
Pak `DamageNumber.pak`, original in `D:\Games\Conan Exiles Mods\_patch-originals\DamageNumber.pak`.

## How the player uses it

- **Hold F1 → the mouse cursor appears over the game.** With that cursor the player clicks the meter's buttons — **the expand button expands the
  collapsed meter**, and drags the window. `[OWNER]` «F1 нужен для того, чтобы курсор отображался» · «При удержании F1, поверх игры появляется курсор мыши, и им
  можно кликнуть по кнопке разворачивания ДПС» · 2026-11-01. F1 alone, without a click, changes nothing visible — the 2026-10-31 22:52 tries read that wrongly
  as «F1 only moves the window».
- F1 is shared: Simple Minimap and Proximity Party also take the cursor on it (the manifest's `$comment_keys`).
- The collapsed meter sits in the top-left corner (our default, below).

## Assets and functions

| Asset | What | Our use |
|---|---|---|
| `DN_UI_DmgWidget` (`DN_UI_DmgWidget_C`) | the meter window | `Restore()` expands it, `Minimize()` collapses it — by the remote, read by `ForEachFunction` 2026-10-31 22:5x; `ActivateModule(DN_UI_DmgWidget)` only answers «open» and leaves it collapsed |
| `DN_SG_SaveSettings` | the mod's saved settings | `RestoreAnchor` default 2 → 0 (our edit) |
| `DN_UI_SettingsWindow` | the settings window | Russian labels at size 10 (our edit) |
| `Saved/SaveGames/DamageMeter.sav` | the player's meter state | **a remote `Restore()` is SAVED here** — the owner's next launch comes up expanded; copy `Saved/SaveGames/` before any remote call on the mod (EXP-0417) |

## Our edits (KRINIK MODIFIED)

1. The collapsed meter goes to the TOP-left corner: `DN_SG_SaveSettings.RestoreAnchor` 2 → 0 (`[OWNER]` «нужно сворачивать не в левый нижний угол, а в левый
   верний» · 2026-10-26). A player with saved settings changes it himself: the mod's settings → Minimize to corner.
2. Settings window (bug 64 item 21, 2026-10-26 18:19): «Непрозрачность» and «Масштаб» at size 10 instead of 13, «Сохранить» / «Отмена» at 10 instead of 12.
3. The «Сворачивать в угол» list in Russian (bug 64 item 49, 2026-11-01): `lit:` «Top Left» → «Вверху слева», «Top Right» → «Вверху справа», «Bottom Left» →
   «Внизу слева», «Bottom Right» → «Внизу справа» in `DN_UI_SettingsWindow` — `PopulateControls` (AddOption ×4, SetSelectedOption) and the switch-on-string
   `GetAnchorIndex(AnchorName)`; the save keeps the NUMBER `RestoreAnchor`, so the change is safe; the field `SizeBox_6` 120 → 150 (run 1 cut «Вверху слев»).
   Live 12:37: the live window's `GetAnchorIndex(GetOptionAtIndex(i))` = 0…3 (report `2026-11-01_conan-dropdowns-all-topleft-ru.md`).
4. The settings window over the inventory (2026-11-01, plan 40.3): `DN_DT_UIModule` row `DN_UI_Settings` Category Popup → Modal, CloseOnESC false → true
   (`_config/krinik_patches/DamageNumber__DN_DT_UIModule.tsv`) — Esc closed the inventory under the window; it opens from «Настройки модов» → «Моды Xevyr'а».
5. The opacity preview after a colour pick (author bug, found by the recon `researches/conan-mod-settings-hub/xevyr-settings-recon.md`, 2026-11-01 18:12 +03:00): the event
   graph's `ThemeColorChanged` / `ThemeColorCancelled` call `dmgWidget:ApplyTheme(colour, 0.30 + v·0.55)` while the slider saves `w_Opacity = 0.30 + v·0.65`
   (and `InitializeControls` reads it back with 0.65) — row `dbl:ExecuteUbergraph_DN_UI_SettingsWindow\t0.550000011920929\t0.6499999761581421` (float-widened
   doubles, 2 places) in `DamageNumber__DN_UI_SettingsWindow.tsv`. Seen: the remote set the slider to 1 and called `ThemeColorChanged` with a post-hook on
   `DN_UI_DmgWidget_C:ApplyTheme` — opacity 0.95 (0.85 before). The call rewrites `DamageMeter.sav` (18:09) but keeps the saved theme colour and values (read
   back and compared with the recon dump).
6. Rebuild after a mod update: the manifest recipe `krinikBuild` (four assets, the last pair `DN_DT_UIModule`) — `python -I -X utf8
   _config/devkit/patch-mod-asset.py build DamageNumber DN_SG_SaveSettings <work> <tables and assets as in krinikBuild>` → `<work>/out/DamageNumber.pak` into
   `_krinik-modified/3719585133`.

## The collapsed button's look (2026-11-01 15:2x, `[OWNER]` «в свернутом состоянии dps мод нужно сделать прозрачным, оставить полоску, и дать белый контур, и
прозрачность процентов 80» · «чтобы не так сильно был заметен, как сейчас» · «а был ненавязчивый минусик в углу» · «словно часть мода худа»)

- Tree after our F1 section (`krinik_hud_outline.lua` `f1_label`): `RestoreWindow` (Border, transparent) → `KrinikF1Box` (HorizontalBox) → `KrinikF1Plate` (Border, the
  mod's dark brush, `DrawAs` 3 = Image, BrushColor white) → `RestoreBtn` (the white minus) + `KrinikF1Label` «F1».
- Live by the remote: the plate's brush `DrawAs = 4` (RoundedBox) with `TintColor` alpha 0 and `OutlineSettings` (Width, white Color, CornerRadii) draws ONLY a rim.
  **The rim ignores the widget's `RenderOpacity`** (frames 15:30: the minus dimmed, the rim stayed bright) — dim it by the outline colour's own alpha.
- Review folder 49 (variants 50 / 35 / 20 % of the whole button); the owner 15:31: «минус у тебя прозрачным стал. а контур слишком резкий».
- **Shipped 2026-11-01 15:38** (variant 5, `[OWNER]` 15:34–15:35 «вот второй слека вкрасиво» · «20% который»): minus and «F1» solid; the plate RoundedBox, fill black
  alpha 0.20, rim white alpha 0.25 width 1, radius 3; the OUTER `RestoreWindow` brush `DrawAs = 0` (its `Background` comes back by REFERENCE — an edit of the plate
  brush gave it a rim too). Seen after Restore → Minimize. Constants `DPS_*` in `krinik_hud_outline.lua`.

## Checked

- DM0 2026-10-31 22:57 (4K): the expanded meter's top stands ≈ 35 px under the last line of Hosav's HUD text — nothing covered.

## Open

- bug 64 item 21 — the slider in the settings window.
