# Research — Conan Exiles UI colour scheme: Funcom's FS_ style system, read from the game

> **Created:** 2026-11-10 · on the owner's word: `[OWNER]` 2026-11-10 13:18–13:19 «неужели ты не видишь, как ты не соблюдаешь цветовую схему???» · «тебе пипетку дать?» ·
> «у конана есть конкретная цветовая дизайн схемма» · «давай-ка ты ещё нагуглишь и напишешь себе конспукт» (after a grey-tint «+» mockup turned the game's olive
> texture into a cold pale green beside our warm gold page arrow)
> **Parent:** plan 49 (the «+» brightness, review folder 82), bug 91 (the corruption label plate)
> **Status:** 🔧 the palette read 2026-11-10 13:2x from the 3.0.1 paks; applied to the «+» mockups G1 / G2; our own widgets to be checked against it (below)
> **Outbound:** every new widget of ours on a game screen takes its colours from this table; the owner judges the look

## Rule (read before any colour of ours on a game screen)

1. **Take a colour from the game's own styles, never invent one.** The table below is the game's palette; a new element maps to the ROLE it plays (an interactive
   gold, a text, a selection) and takes that role's colour and its state ladder (normal → hovered → pressed / dragged).
2. **Brighten a game texture by a WARM per-channel tint matched to the palette, never by a grey tint.** The game's UI textures are olive / desaturated and the
   game darkens them by a grey tint (the «+»: 0.495); a grey gain above that turns the olive into cold cream (the owner's 13:18 crop). Match the rim to the
   role's colour per channel (linear gains), like `_config/mockups/plus_brightness_mockup.py` WARM.
   **A gain above 1.0 cannot be a brush tint — bake it into our own texture** (2026-11-14, the 3.1.0 build): on screen a Slate brush tint is clamped at 1.0
   per channel — the live «+» with tint R 1.5623 and 1.0 read the same rim pixels (188, 194, 141), a control R 0.3 changed them (133, 182, 131). So the warm
   gain goes into a copy of the game's texture (`_config/branding/make_plus_gold.py`: linear × gain, clamp, alpha kept) drawn at tint 1.0; tints ≤ 1 stay tints.
3. **Measure before you colour:** sample the element and its neighbours on a 4K frame (the brightest 40 pixels in a diamond / box) and state the numbers.

## Sources

- **Web (2026-11-10, two searches):** no published Conan Exiles UI palette — only generic «gold» palette sites and press about the Enhanced UI overhaul (UE5,
  May 2026: «revamped user interface», «complete overhaul of the UI presentation»), no colours. Not usable as a source.
- **The game itself (authoritative):** Funcom's style system `/Game/UI/Styling/**/FS_*` — 59 data assets: 21 button styles (`ButtonStyleDataAssetBase`), 27 text
  styles (`TextStyleDataAsset`), 5 sliders (`SliderStyleDataAsset`: Default, Blue, Green, Red, Clear), 1 dropdown, 5 editable texts; widgets point to them by
  `TextStyleAssetClass` (e.g. the attribute row's `CorruptionLabel` → `FS_Text_Heading_5`). Plus `/Game/UI/Data/DataTables/DT_RichTextStyles` (rich-text tags).
  Extracted: `retoc-5.8 to-legacy --filter FS_` → `uaj tojson` → `ConanExiles/_config/devkit/ui-style-colors.py` → `fs-style-colors.tsv` (135 colour rows, next to
  this file). The kit's Python cannot `export_text()` these data assets (13:2x) — read the cooked JSON.

## The palette (sRGB hex from the linear values; count = rows in the styles)

| Role | Colour | Where in FS_ | Count |
|---|---|---|---|
| **Body / button text, normal** | `#EEE4D1` ivory parchment | FontColor of buttons, text styles | 39 |
| **Text hovered / pressed** | `#F4D1B3` warm peach-cream | `FontColorHovered…` / `FontColorPressed` of the buttons | 36 |
| **Interactive gold, normal** | `#E9C27A` | scrollbar `NormalThumbImage` tint (editable texts) | 5 |
| **Interactive gold, hovered** | `#ECD97C` light gold | scrollbar `HoveredThumbImage` | 5 |
| **Interactive gold, dragged / pressed** | `#5E4A1F` dark old gold | scrollbar `DraggedThumbImage` | 5 |
| **Selection background** | `#7F5222` bronze | `TextSelectedBackgroundTint` | 5 |
| **Text outline (buttons)** | `#3D392C` dark olive | `FontOutlineSettings/OutlineColor` of `FS_Text_Button_*` | 2 |
| **Dropdown active item** | `#6D8E87` muted teal (the ONLY cold accent) | `FS_Dropdown_Default` ActiveBrush / hovered / drop indicator | 8 |
| neutrals | `#FFFFFF`, `#D9D9D9`, `#C0C0C0`, `#B7B7B7`, `#595959`, `#000000` | tints of textured brushes (white = the texture's own colour) | — |

Texture-borne colours are not in the table (the «+» `T_Attributes_perk_button_default` is olive, tinted 0.495 grey; hover `_hover` at 0.724; pressed 0.384) —
`kit-probe-plus-button.json`.

## Our widgets against the palette (2026-11-10)

| Ours | Now | Palette role | Verdict |
|---|---|---|---|
| Page arrows (rim / triangle) | `#DEB266` / `#FFE2A0` | interactive gold normal `#E9C27A` / hovered `#ECD97C` | close — the owner likes their brightness (13:13) |
| Page numbers | `#C88746` (the owner's «больше в бронзу», 11:01) | between bronze `#7F5222` and gold | the owner's own pick — kept |
| Perk column scrollbar `SB_KrinikPerkScroll` | the engine's default grey bar | scrollbar thumb `#E9C27A` / `#ECD97C` / `#5E4A1F` | **to do** — take the FS_ thumb tints |
| Corruption label plate (bug 91 V1) | fill `#161514` 0.9, rim `#967A50` | the game's dark panel + bronze rim | rim near bronze; check by eye in game |
| «+» brightness (review 82) | game olive at 0.495 | interactive gold `#E9C27A` (G1) / `#ECD97C` (G2) | mockups G1 / G2 — the owner's pick |
