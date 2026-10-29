# TC — the hub bottom bar keeps its button widths when a tab opens (bug 64 item 17, class A)

> **Created:** 2026-10-29 · **Parent:** bug 64 item 17 class A; recon `researches/conan-ui-text-relayout/README.md` (the bottom bar row, plan step 4)
> **Status:** run 2026-10-29 21:4x–22:0x — B0 pass, B1 reproduced, B2 cause found, B3 pass with the shipped fix; waits for the owner's eye
> **Outbound:** —

**Basis.** `[OWNER]` «книзу кнопки прыгают» · 2026-10-29 21:38 (after the tooltip fix); earlier «почти на всех страницах его что-то да пляшет · особенно
внизу, где кнопки» (16:1x). Read from the assets: `WBP_ButtonBar` (left and right `HorizontalBox`, `CloseButton`) → `WBP_ButtonBase`
(`ContentContainer`: `HotkeyIcon` · `ImgIcon` · `TxtLabel`, padding 20/10) → `W_HotkeyIcon` (`TextBlockBindingName` · `TextBlockHoldPrompt` ·
two `SizeBox` 24 wide with the glyph images, `AnimFadeIn`). Hypothesis: the key's name shows as TEXT until the glyph arrives (≈170 ms, the birth probe
of 17:55), so the button is wider for a few frames and then shrinks.

**Stand.** The hero in the world, 4K, the hub open by the remote; `exec t.MaxFPS 60` for the run (a jump of 3–6 frames lasts 50–100 ms — two
captures or more). The tab switch — the remote (`W_Carousel_C:NextCarouselWindow()` / `PrevCarouselWindow()`, the same native calls as E/Q) written
at t=0 by `hover-watch.ps1 -PultCmd`, the cursor parked away; frames — the screen strip of the bottom bar, game in front only for the watch, after
`wait-input-idle.ps1 -Min 10`. Techniques: state transitions (tab A → tab B), three tab pairs, control — the same strip with no tab switch.

| # | Case | Steps | Expected | Status |
|---|---|---|---|---|
| B0 | Control — no switch | watch the strip 800 ms with no command | every frame the same (the counter of changed columns ≈ 0) | pass 21:4x: 52 frames, 0 changed columns |
| B1 | Repro — «Хар-ки» → «Таланты» | `PrevCarouselWindow` at t=0, strip 800 ms | the bar's buttons change width/position for ≥ 1 frame and then settle — or «not reproduced» over three tab pairs | reproduced 21:4x («Хар-ки» → «Таланты»): frame 226 ms «Закрыть» and «DLC» ≈ 90 px of 1920 wider, frame 267 ms settled (sheet `bb_b1.webp`); other tab pairs not yet |
| B2 | Cause | read the first frames of B1 | which element differs: the key's name as text vs the glyph, a missing button, other | found 21:4x by the per-frame probe: the key glyph's ScaleBox is 128 wide on the first frame (unscaled texture), 42.7 after; the key-name text stays collapsed (hypothesis refuted) |
| B3 | The fix | the native edit chosen after B2; B1 again on three tab pairs | the first frame of the new tab = the settled frame (button edges in the same columns), 3 of 3 | experiment pass 21:5x with the cap on the class TEMPLATE (remote): 5 of 5 switches, one change each, «F» does not move (sheets `bb_b3_*.webp`); NOT shippable as is — the template cap would shrink `W_ActionTutorial` glyphs (height 38, settled 50.7); the shipped form (cap only inside `WBP_ButtonBase`, Lua on birth): pass 22:0x after a relaunch (the owner's word «гоу» 21:5x): `KrinikUIFixes` loaded 1.2.0, cost line «glyph boxes born 111, capped 43, handler sum 0.000 ms, worst 0.000 ms» (below the clock's resolution); four tab switches from «Снаряжение» rightwards — buttons never move after they appear (sheets `bb_m_*.webp`; switch 1 also shows the hub background fading above the bar, not a shift); all 15 live button glyphs capped. NOT observed: a tutorial prompt glyph (none existed in this session) — out of scope by the owner-class check |
