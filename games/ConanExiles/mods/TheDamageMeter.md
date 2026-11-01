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
3. Rebuild after a mod update: `python -I -X utf8 _config/devkit/patch-mod-asset.py build DamageNumber DN_SG_SaveSettings <work>
   _config/localization/asset-strings/DamageNumber__DN_SG_SaveSettings.tsv _config/localization/asset-strings/DamageNumber__DN_UI_SettingsWindow.tsv
   DN_UI_SettingsWindow` → `<work>/out/DamageNumber.pak` into `_krinik-modified/3719585133`.

## Checked

- DM0 2026-10-31 22:57 (4K): the expanded meter's top stands ≈ 35 px under the last line of Hosav's HUD text — nothing covered.

## Open

- bug 64 item 21 — the slider in the settings window.
