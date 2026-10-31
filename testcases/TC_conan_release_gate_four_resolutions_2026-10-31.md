# Test cases — Conan build release gate: every changed screen at 720p, 1080p, 2K, 4K (plan 35, HOUSE_RULES §1 rule 17)

> **Created:** 2026-10-31 · **Parent:** plan 35 release gate (the owner's words 07:51 and 09:31–09:32, verbatim in plan 35 «Release gate» and
> `HOUSE_RULES.md` §1 rule 17)
> **Status:** written 2026-10-31 10:4x, before any run
> **Outbound:** the four review folders → the owner's eye

**Stand.** Full screen (never a window — the Svarog lesson, `SvarogsDream/docs/UI_RULEBOOK.md`, the scale row of the layout table), resolution set in
the game's settings or `GameUserSettings.ini` before the launch and restored after; frames by `capture-window.ps1 -Width <the resolution's width>`,
WebP, one review folder per resolution. Measures (Svarog rulebook, text rules 1 and 2): main text letter height ≥ 36 px at 4K (≥ 24 px at 2K,
≥ 18 px at 1080p, ≥ 12 px at 720p); contrast ≥ 4.5 : 1; nothing clipped, overlapping or blurry.

| # | Screen / element | Expected at each of 720p · 1080p · 2K · 4K | Status | Observation |
|---|---|---|---|---|
| G1 | main menu: both logos, versions 3.0.1 · 1.0.0, the feedback plate | the same share of the screen, logos crisp, the plate under the version | — | |
| G2 | Esc menu: our logo, versions, the feedback plate, Simple Modlist panel | the mod list clear of the game's rows (bug 64 item 8) | — | |
| G3 | intro wheel and the game logo at a start | crisp, centred | — | |
| G4 | Hosav HUD (outline, temperature colour, blink), FPS counter | text ≥ the measure, outline 1 pt, nothing cut at the edges | — | |
| G5 | minimap: ring gap 8 px top/right at 1080p, the same SHARE elsewhere; coordinates inside the ring on the plate | gap ≈ 0.74 % of the height | — | |
| G6 | enemy shout subtitles | in place, fade in/out, readable | — | |
| G7 | corpse strip and the quick-loot window | one size, centred, the dark backing behind the lines | — | |
| G8 | action prompts (two-line corpse prompt) | glyph and text on one baseline | — | |
| G9 | hub tabs and the mod windows of bugs/64 | no clipped titles, buttons fit their text | — | |
| G10 | fishing captions and buttons | one line, inside their boxes | — | |
