# TC — Conan: the attribute page arrows draw EVEN diamonds, not squashed (plan 49, the owner's check of 2026-11-14)

> **Created:** 2026-11-14 · **Parent:** `plans/49_conan_endless_attributes.md` (G1 accepted 10:00) · **Status:** written 10:00, desk measurement done, live part next ·
> **Outbound:** — (a 4K frame pair to the owner's eye)

**Test basis:** `[OWNER]` 2026-11-14 09:55 «наши стрелки листания проверь чтобы ромбы были ровными, не сплющенными» (verbatim in plan 49). The texture
`T_KrinikPageArrow*` is square (128 × 128, the diamond's half-diagonal 57.2 px both ways — `_config/branding/make-page-arrows.py`); the button draws it as an
IMAGE brush stretched over the button's geometry. The button's width = the emptied TextBlock's `min_desired_width` (`ARROW_BOX`), its height = that TextBlock's
LINE HEIGHT at font size `round(ARROW_BOX × 0.72)` = 19 (`_config/devkit/kit-attribute-paging-look.py` `style_arrow`) — two unrelated numbers, so the diamond
is as square as the line height happens to equal the width.
**Desk measurement (09:5x, last night's native 4K frame `KUMM/.work/kit310/frames/k7_arrows.jpg`, `.work/craft94/diamond_native.py`):** the game's own «+» diamond
70 × 70 px (h/w 1.00); our Next arrow ≈ 54 × 61 px by eye on a 5× zoom (h/w ≈ 1.13; pixel bbox at threshold 80: 55 × 61, h/w 1.11) — taller than wide, squashed from the sides.
**Stand:** the 3.1.0 target, machine lock «kumm», the owner's world `Game_1`, background or front launch per the owner's presence (`owner-idle.ps1`); «Хар-ки» by
`ActivateModule(Inventory)` + `SetCarouselIndex(2)`; the arrows shown by `_config/attr-arrows-show.lua` (no row past 20 in this save); live sizes by the remote
(`GetDesiredSize`, the glyph's font); frames by `capture-window.ps1 -Width 3840`.
**Dimensions covered:** both arrows (Prev — the Dim brush, Next — normal) · hover brush (same geometry — by the remote style, one frame) · 4K and 1080p (rule 17:
the shape must hold at both). Not covered: 720p / 2K (the UI scales uniformly — the ratio is resolution-free; one frame pair proves the units).

| # | Case | Expected | Status | Observed |
|---|---|---|---|---|
| Q1 | before: the arrow button is not square | remote: `Btn_KrinikPageNext:GetDesiredSize()` X ≠ Y (the desk frame says Y/X ≈ 1.1) | **pass (defect confirmed)** | 10:03 `.work/arrows/arrow-size.lua`: both arrows desired 34.27 × 39.08 (Y/X 1.140), glyph 26.27 × 35.08 (font 19, min width 26.27), the button slot adds 8 × 4 |
| Q2 | the line height per font point | remote: the glyph's font size set live to 17, 18, 19 → the button's desired Y each time; Y linear in the size | **fail (expectation wrong) — informative** | 10:04 sizes 16 / 16.4 / 17 / 18 / 19 → glyph Y 29.99 / 30.55 / 31.12 / 32.82 / 35.08: NOT linear — snapped to whole device pixels (≈ 53 / 54 / 55 / 58 / 62 px at 4K); size 0 → 1.13 (2 px), size 1 → 2.26; hidden rows (scale 1) read 2.00. A font fit is off by up to a pixel at other resolutions — rejected |
| Q3 | the fix in the kit | the button made square; kit build; deploy | in work | 10:05 live A: font 0 + slot padding 16.57 → 34.27 × 34.27 on visible rows (2-px line minimum — off at other scales); live B: content removed + brush ImageSize 34.27² → 34.27 × 34.27 on visible AND hidden rows (`arrow-nochild-live.lua`) — B taken: `kit-attribute-paging-look.py` removes the glyph, brushes `ARROW_BTN` square; live 4K frame of B `.work/arrows/after_live_4k.jpg`: Next 55 × 54 px, Prev 73 × 73 (with its backing), «+» 70 × 70 |
| Q4 | after: square button | remote: desired X = Y within 0.3 unit, both arrows | **pass** | 10:2x after the kit build (run 3) and deploy: both arrows `kids=0`, `ImageSize` 34.27 × 34.27, desired 34.27 × 34.27 (hidden rows 0 × 0 — collapsed) |
| Q5 | after: even diamond on screen, 4K | native 4K frame: the arrow diamond's width = height within 2 px (5× zoom by eye + the pixel bbox), beside the game's «+» (70 × 70) | **pass** | `.work/arrows/q5_after_4k.jpg`: Next 55 × 54 px (was 55 × 61), Prev with its backing 73 × 73, «+» 70 × 70; even by eye on `q5_zoom.webp` |
| Q6 | after: even diamond, 1080p | the same at 1920 × 1080: width = height within 1 px | **pass** | `exec r.SetRes 1920x1080f`, native frame `q6_1080.jpg` (1920 wide): Next ≈ 26 × 26 px by eye on an 8× zoom (`q6_zoom.webp`; the pixel box caught the neighbour pip); 4K restored after |
| Q7 | nothing else moved | the arrows keep their places under the scale (centre within 3 px of the before frame), the numbers untouched | **pass** | Next centre (2217, 611) before and (2217, 611.5) after on the 4K frames; the page numbers not touched by the edit |
| Q8 | the kit scripts stay in step | step2 then look on the square asset: no glyph re-added, ImageSize read back | **pass** | 10:3x `.work/arrows/run-step2-look.sh`: step2 «draws the diamond — no glyph» ×2, graph parts skipped; look «image_size set: 34.27 × 34.27» ×8; both exit 0, no GUID ensure (judge round 1 P1–P3 fixed) |
