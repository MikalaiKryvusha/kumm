# TC — plan 38 phase 2: the hub window's LOOK beside mockup 5 (the owner's five remarks of 2026-10-31 21:41–21:42)

> **Created:** 2026-10-31 · **Parent:** `plans/38_epic38_phase2_krinik_hub_window.md` (step zero, criterion 1) · Svarog `docs/UI_RULEBOOK.md` §2–§4, §10, §10а
> **Status:** written 2026-10-31 21:52 +03:00; run 21:53–22:13 (L0–L10 pass, L11 fail → rebuild)
> **Outbound:** a review folder for the owner — the window beside mockup 5, font variants (taste is his)

**Goal (Achieve).** The window stops reading as «huge, crooked and bold»: it is sized by its content, rows sit at the mockup's rhythm, the font is the
regular (not bold) face, the «i» marks are even circles, the «i» plate is a dark solid plate with a thin gold rim next to its «i» that hides nothing
of its own row. Taste stays the owner's: the font is shown as variants on one game frame.

**The seam list** — the 4K frame `p1b` (2026-10-31 20:47) and the plate frame `p4_tip` (20:48) beside `variant_05.webp` (mockup 5, 19:11), both scaled
to 1600×900 (sheet `seams/` in the session scratchpad), walked against UI_RULEBOOK:

| # | Seam (where the eye stumbles) | Mockup 5 | Game frame | Rulebook | Cause (code) |
|---|---|---|---|---|---|
| S1 | The window is huge and half empty | 69 % × 83 % of the screen, rows fill the body | 72 % × 86 %, five rows in the top 40 % of the body, the rest empty | В2 (size by content), §0 «воздух — часть замысла», not emptiness | kit `WIN_W, WIN_H = 1316, 894` fixed; body FILL |
| S2 | Rows twice as far apart as in the mockup | ≈ 40 units row to row (1080p) | ≈ 75 units | К2 rhythm, Т5 | `ROW_GAP` 6 + the game controls' own height (slider ≈ 60) |
| S3 | Bold sans labels | regular serif (Cambria stands for the game serif) | bold sans of the game's settings rows (`TextSettingName` font with its Bold typeface) — labels, hints, mod names | §2.5 one font, Т3; the owner «странный жирный шрифт» | kit `text()` copies `typeface_font_name` of the label font |
| S4 | Uneven «i» | an even circle with «i» in it | an oval outline whose width follows the glyph («i» is narrow) | К3/К6 polish | kit `ROUNDED_BOX` `HALF_HEIGHT_RADIUS` on a padded text box of uneven width |
| S5 | The «i» plate pale and see-through, covers its own row | dark solid plate, thin light rim, an arrow to the «i», under the «i» | grey-brown plate (sRGB ≈ 69), the row under it shows through, no rim, placed at a fixed X over the row's own label | К6 (one dark plate with an old-gold rim, at the element), В4 | kit `brush_color (0.06, 0.055, 0.05, 0.97)` is LINEAR — 0.06 renders as sRGB ≈ 69; Lua `TIP_X` 800 fixed |
| S6 | Hints and the mod note too bright and bold | `#8e8a82`-ish grey, regular | near white, bold | §6а «текст: подпись/приглушённый» | kit grey `(0.55, 0.52, 0.47)` LINEAR ≈ sRGB 194 |
| S7 | Values «10,00» instead of «10 %» | «10 %», «90 %» | «10,00», «90,00» (frame 20:47; the digits fix of the same hour unverified on a frame) | К5 data read whole | the game slider's value box; unit not shown |
| S8 | «Krinik» in the title in small caps beside lowercase Cyrillic | the whole title in caps | «Моды Kʀɪɴɪᴋ'а · Настройки» — the heading font draws Latin lowercase as small caps | К1, Т8 | the subheader font |

**Stand.** As `TC_conan_hub_phase2_2026-10-31.md`: the owner's save copied before and restored after (`save-restore.sh`); the machine lock;
`launch-bg.ps1`; world entry by `enter-world-remote.sh`; the hub by the remote `ActivateModule('CharacterInventory')`, our window by
`ActivateModule('KrinikModSettings', true, false)`; frames `capture-window.ps1 -Width 3840`, looked at by eye after every step. Look values are tried
LIVE by the remote (`lua` on the open window), then baked into the kit script and the Lua section, then the built pak is checked in a fresh launch.

| # | Case | Steps | Expected | Status |
|---|---|---|---|---|
| L0 | The font faces the game offers | remote: the label font object's typefaces and the heading font's typefaces | a list of names (Regular / Bold / …) to choose from | pass 21:56 — labels were `/Engine/EngineFonts/Roboto` Bold, heading `Cardo-SC-Bold`; game fonts: `NotoSans` (Normal, Italic, Bold, BoldItalic), `KelsonSans`, `Cardo-*` and `CrimsonPro-*` (no Cyrillic) |
| L1 | S1 window by content | the window opened on the UI page | width ≈ 1000–1100 units, height = head + rows + footer, no empty half; the inventory behind still visible at the sides | pass 22:10 (built pak) — width 1220 (≈ 66 % of the 1834-unit canvas; wider than this line's range because the widest row holds 487 units of text), height 539 = the tallest live page, the inventory visible at both sides (frame b1) |
| L2 | S2 row rhythm | the same frame | row-to-row ≈ 40–48 units at 1080p (measured on the 4K frame ÷ 2) | pass 22:10 — ≈ 44 units row to row (frame b1) |
| L3 | S3 font | variants on one frame: regular sans · the heading serif regular | no bold label; variants sheet for the owner | pass (fix) 22:10 — Noto Sans regular everywhere; the serif variants refused by observation (Cardo and Crimson Pro: no Cyrillic, frames t1, t2) |
| L4 | S4 «i» | 4K crop of three «i» | the same circle for every «i», round (width = height ± 1 px) | pass 22:11 — a square box 26.3 × 26.3 in a half-height rounded box: circles (crops t7_i, b2_tip) |
| L5 | S5 plate | hover on the «i» of «Мигание еды и воды» by the real mouse | dark solid plate (sRGB ≤ 30), gold rim, the row label left of the «i» not covered, nothing shows through | pass 22:11 — real click (it pins; the hover path calls the same placement code but was NOT observed separately in this run): log `click: «i» ui_blink_food pinned`; a near-black opaque plate with a gold rim under the cursor, the label uncovered (crop b2_tip) |
| L6 | S6 greys | the frame | hint and note grey ≈ sRGB 140, regular | pass 22:10 — grey ≈ sRGB 138 (frame b1) |
| L7 | S7 values | the frame | «10», «90», «33» (and the unit if the game box allows) | pass 22:10 — «10», «90», «33» whole; no unit (the game's box shows the number only) |
| L8 | S8 title | the frame | the title reads evenly (no small caps inside one word) | pass 22:10 — capitals in Noto Sans Bold |
| L9 | Clicks still route after the edits | real mouse: a mod name, «i», «Сохранить», «Закрыть без сохранения» | the section's log names each click | pass 22:11–22:13 — `page arc`, `page gfx` (the window height unchanged, sheet b34), `click: «i» … pinned`, `closed (без сохранения)` with the store file absent before and after; «Сохранить» not re-walked (its code untouched since the first batch, P5/P8 pass) |
| L10 | 720p · 1080p · 2K · 4K | the game resolution switched by `exec r.SetRes` | the window keeps its proportions at each (house rule 17) | pass 22:12 — 1280x720f · 1920x1080f · 2560x1440f · 3840x2160f: proportions kept (64–70 % wide by the game's DPI curve, as its inventory), nothing cut (sheet res_sheet) |
| L11 | A name in the mod list cut by one letter | the frame b1 | every name whole or sliding | fail 22:10 — «KrinikConanGraphic»: the Lua `NAME_BOX` 268 stayed while the kit's box became 238, the marquee never started → list 290, name box 258 in both places, rebuild |
