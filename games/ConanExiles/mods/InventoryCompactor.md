# Mod notes — Inventory Compactor (Workshop 3718614759, Xevyr)

> **Created:** 2026-11-07 · on the owner's word 2026-11-07 10:58 (his frame of the «Выберите стопку…» tooltip: «эти поп-апы тоже перевести в вид как у игры») ·
> **Parent:** bug 64 (the build's mod UI) · **Status:** living notes · **Outbound:** —

**What it is.** Two buttons in the inventory's filter row — «Разделить стопку» (split a stack by an exact amount) and «Сжать» (compact: stack and close the
holes) — and the same command in the radial menu of any container (manifest: «Кнопка 'уплотнить' в инвентаре … Крошечный, 331 КБ»; the author declares no
vanilla asset touched).

## Its UI

- `/Game/Mods/Inventory_compactor/IC_UI_CompactButton2.IC_UI_CompactButton2_C` (parent the native `WindowRoot`), placed into `W_CharacterInventoryView`'s
  `FilterSelector`; children `btn_Split`, `btn_Compact` — plain UMG `Button`s with `ToolTipText` only (the Russian texts come from our translation table:
  «Выберите стопку и нажмите, чтобы отделить нужное количество», «Нажмите, чтобы собрать предметы в стопки и убрать пустые ячейки»).
- A plain `ToolTipText` is drawn by Slate's default tooltip — a light grey box, not the game's look. The game draws its own tooltips with
  `/Game/UI/Framework/W_TooltipWidget.W_TooltipWidget_C` (native parent `TooltipWidget`, one field `Text_Content`) — the class `RootWidget.TooltipWidgetClass` of
  `WBP_ButtonBase` and `W_TooltipOverlay` (read live 2026-11-07 12:2x).

## Our edit (KrinikConanUI `krinik_ui_fixes` 1.7.0, 2026-11-07)

On the birth of `IC_UI_CompactButton2_C` (+ one tick) each of the two buttons gets `SetToolTip(<W_TooltipWidget with the button's own ToolTipText>)` — the game's
tooltip look, the mod's own text. Why Lua and not the pak: a UMG tooltip WIDGET is set only by a binding function (bytecode) or at run time; the asset stores
`ToolTipText` alone (HOUSE_RULES rule 8: Lua only when the asset will not yield — once, no polling). Seen live 12:2x: a real hover shows the dark game tooltip
(frame `hov2`).

## Open

—
