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
| KrinikConanUI Lua `krinik_minimap_coords` (2026-10-31) | at each minimap creation (+600 ms): `Coordinates` moved into our `Border_KrinikCoords` (plain black 0.55, RoundedBox r 6, padding 4/0) in `MinimapOverlay`, slot centre/top, top inset 46, font 13 (ACCEPTED by the owner 10:09 «вот теперь хорошо»); `MinimapScale` RenderTranslation (+16.0, −16.3) — into the corner with an 8 px gap to the top and the right at 1080p (the owner 09:58–10:25: 4 px, then «может увеличить до 8 пкс»; cases C7–C11). The gap is in UI units: the engine's DPI scale turns them into pixels by the screen height, so it is a share of the screen (≈ 0.74 % of the height; ≈ 16 px at 4K) — the owner's question 10:24 «наверное отступы в процентах нужно считать»; to be confirmed on frames at 720p / 2K / 4K in the plan 35 release gate. Measuring tool: a band at the ring's vertical centre (other red things at the screen edge spoil a whole-column scan); sub-pixel shifts snap — steps under ≈ 0.5 unit may not move a pixel; hidden coordinates keep the plate hidden. The look is the owner's pick 09:54 (`[OWNER]` «простая демная подложка, шрифт коардинат больше, плашку выше»; the clock-style plate of 09:48 was the rejected B) | the owner 2026-10-27: «в миникарте коардинаты нужно будет переместить внутрь круга, сделать им подложку» (item 31); a new widget cannot be added by a pak property edit |

## Open

- «и всю миникарту правее и выше» (item 31, the owner's second word). **Tried 2026-10-31 09:51 and reverted:** the author's `LoadSettings` 0.5 (our
  row removed, pak rebuilt without `SM_UI_Minimap`) did NOT put the map into the corner — on the same 1080p frame the ring came out SMALLER (≈ 275 px
  across instead of ≈ 295) and its top ≈ 15 px LOWER; live `MinimapScale.Slot:GetPosition()` read (1595.4, 150.0). So this constant feeds the size, not
  only the place (the 26.10 note «× 0.5 of its size» was read as place only). The pak was restored byte-identical.
  **`LoadSettings` traced the same day** (`patch-mod-asset.py extract Simple_Minimap SM_UI_Minimap <work>` → `uaj exports <legacy uasset> VER_UE5_6`
  (the version argument is required — without it uaj throws IndexOutOfRange) → `kismet-trace.py … LoadSettings`): `UIscale` from the save →
  `MinimapScale:SetUserSpecifiedScale`; `half = CanvasSlot(MinimapScale):GetSize() × UIScale × K` (K = the `Double 0.5 @uexp+40467`, our row 0.52);
  position = `MakeVector2D(ViewportSize.X / ViewportScale − half.X, half.Y)` (alignment 0.5 → the ring touches the right and top edges at K 0.5), then the
  drag offset `SaveGame.w_Position` when it is not (0, 0). Live 09:58 (one launch, A-B by the remote): K 0.52 → slot (1589.4, 156.0), size 353, UIScale
  0.85 → half 150 units drawn, the ring's right edge 6 units from the screen edge; `SetPosition(1595.4, 150.0)` (= K 0.5) left the ring's right edge at
  the same pixel (x ≈ 1900 of 1920) and drew the ring SMALLER and lower — the map is clamped by the screen edge, it does not slide past it. So the
  09:51 «smaller and lower» frame was right (a line written here at 09:53 called it suspect — corrected 09:59), and the map is already in the corner:
  «правее и выше» cannot be had from K; frames `cmp_k` → review folder 26 file 5.
- **The «Показ времени» dropdown reads English «Server» / «Game» / «Client» (bugs/64 item 48) — traced 2026-11-01 05:5x, NOT fixed.** `SM_UI_Settings`:
  `InitCombobox` → `timeSelector:ClearOptions` + `AddOption` ×3 with string literals; the choice is read in `ExecuteUbergraph_SM_UI_Settings` by a
  switch-on-string (`NotEqual_StriStri` of `SelectedItem` with the same literals) that writes the INT `timeDisplay` 0 / 1 / 2 — the string is never
  saved, so translating every literal together would be safe. Blocked by the tool: `patch-mod-asset.py build … lit:Server\tСервер` stops with
  «ExecuteUbergraph_SM_UI_Settings: литерал в графе событий — правка не поддержана» (kismet.py cannot lengthen a literal inside the event graph — the
  events' entry offsets would shift), and `prop:timeSelector/SelectedOption` is not found. Next: either teach `kismet.py` the ubergraph (shift the
  `ExecuteUbergraph(EntryPoint)` constants of every event stub) or a Lua display fix (rule 8, once per window open). Recipe of the trace:
  `patch-mod-asset.py extract Simple_Minimap SM_UI_Settings <work>` → `uaj exports <legacy uasset> VER_UE5_6 > exports.tsv` → `kismet-trace.py <uasset>
  exports.tsv <json> ExecuteUbergraph_SM_UI_Settings` (string constants print as `0x1f` without their text).
- Marker tutorial: bullet lines late, «NEW:» English, black slides (item 4).
- If the player toggles `bShowCoordinates` in the mod settings while playing, the plate does not follow until the minimap is re-created.
