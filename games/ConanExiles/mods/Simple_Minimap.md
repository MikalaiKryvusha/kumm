# Mod notes — Simple Minimap (another author's; KRINIK MODIFIED)

> **Created:** 2026-10-31 · **Parent:** plan 36 W4, bugs/64 items 3, 4, 5, 19, 25, 31 (the facts below were scattered there)
> **Status:** living notes — the ONE place for this mod's internals
> **Outbound:** —

**What it is.** A round minimap top right with coordinates, the server clock, ± zoom and a settings gear; a helper row on the full map
(`SM_UI_MapHelper`); its own tutorial and settings windows. Pak `Simple_Minimap`, assets under `/Game/Mods/Simple_Minimap/`.

## Widget tree (live, remote 2026-10-31 09:4x)

`SM_UI_Minimap_C` (`/Game/Mods/Simple_Minimap/UI/SM_UI_Minimap.SM_UI_Minimap_C`) → `MinimapScale` → `MinimapOverlay` (Overlay), children in order:
`PictureBorder` (Border), `SizeBox_3`, `SizeBox_0`, `Clock` (SizeBox, slot centre/bottom) → `ClockBorder` (Border: red ring plate) → `clockInner`
(Border: dark middle, padding 0) → `ServerTime` (TextBlock, size 15); `plusInner`, `minusInner`, `settingsInner` (Borders), `ScaleBox_0`,
`Coordinates` (TextBlock, size 10, slot centre/TOP, padding 0 — above the red ring). `MinimapOverlay` is not a BP variable everywhere — reach it as
`Coordinates:GetParent()`.

## Our edits

| Where | Edit | Why |
|---|---|---|
| `SM_UI_MapHelper` pak | `AddMarkerSection.HorizontalBoxSlot_5/Padding/Left` 30 → 355 | the SMM hint lay over the 3.0 vanilla «Сброс маркеров» (bugs/64 item 5) |
| positioning bytecode | `dbl:LoadSettings` 0.5 → 0.52 | the coordinate line was cut by the screen top at 4K (item 19; the mod places the map at run time, `w_Position` drag offset in `SM_BP_SaveGame`) |
| strings | «Ясно», «Настройки миникарты», «Донат», tutorial rows | Russian fit (items 3, 25) |
| KrinikConanUI Lua `krinik_minimap_coords` (2026-10-31) | at each minimap creation (+600 ms): `Coordinates` moved into our `Border_KrinikCoords` (brush of `ClockBorder`) → `Border_KrinikCoordsInner` (brush of `clockInner`, padding 8/1) in `MinimapOverlay`, slot centre/top, top inset 60, font = the clock's (15); hidden coordinates keep the plate hidden | the owner 2026-10-27: «в миникарте коардинаты нужно будет переместить внутрь круга, сделать им подложку» (item 31); a new widget cannot be added by a pak property edit |

## Open

- «и всю миникарту правее и выше» (item 31, the owner's second word) — the `LoadSettings` constants are the knob.
- Marker tutorial: bullet lines late, «NEW:» English, black slides (item 4).
- If the player toggles `bShowCoordinates` in the mod settings while playing, the plate does not follow until the minimap is re-created.
