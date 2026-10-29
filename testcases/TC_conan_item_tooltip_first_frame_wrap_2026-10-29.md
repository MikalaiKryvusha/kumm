# TC — the item hover tooltip keeps one layout from its first frame (bug 64 item 17, class A)

> **Created:** 2026-10-29 · **Parent:** bug 64 item 17 class A; recon `researches/conan-ui-text-relayout/README.md` (step 1 — proof on the tooltip)
> **Status:** run 2026-10-29 21:12–21:3x — T0–T4 pass (T1 reproduced 3 of 3 before the fix)
> **Outbound:** —

**Basis.** `[OWNER]` «поп-апы при ховеве тоже мерцают. Открываются в одну строку, а затем становятся в две» · «прыгающее это все» · 2026-10-29 18:0x.
The widget (`UI/Inventory/W_ItemIconTooltipView`, read from the asset): `Border_Background` → `Border_Frame` (padding 20/12) → `Text_Content`
(`AutoWrapText` True, `WrapTextAt` 800); nothing gives the tooltip a width, so the auto-wrap width comes from the previous frame's layout.

**Stand.** The owner's save, the hero in the world, 4K full screen, `KrinikAgentRemote`; the hub opened by the remote on «Снаряжение»
(`ActivateModule CharacterInventory`); item cells located on a `capture-window.ps1` frame. The hover — the REAL cursor by
`_config/hover-watch.ps1 -At <x/y>` right after `wait-input-idle.ps1 -Min 10` (the owner's hands off), the game in front only for the
0.8–1.5 s of the watch, the foreground handed back. The measurement — screen-region frames around the cursor (≈45/s; in full screen the tooltip is
drawn inside the game window, not as a window of its own — the first plan here was wrong) and the tooltip's rectangle per frame by `tooltip-bbox.py`. Control — `Text_Content.AutoWrapText` set False by the remote on the class
template and on live instances. Techniques: state transitions (no tooltip → tooltip → settled), control case, three items as partitions (short
name only; a name with a one-line description; a long description).

| # | Case | Steps | Expected | Status |
|---|---|---|---|---|
| T0 | The instrument sees the tooltip | hover a filled cell with `hover-watch.ps1` | the tooltip on the region frames within 1 s of the move | pass 21:2x (second version): the window-polling version found NO tooltip window (full screen draws it inside the game window) → region frames; tooltip on frame 136 ms |
| T1 | Vanilla repro | hover «Грубая повязка» (or the nearest item with a two-line description), three times | the logged width/height at first appearance differ from the settled ones on ≥ 1 of 3 hovers (the bug as the owner sees it) — or «not reproduced» with the three variants written | reproduced 3 of 3 (21:2x): first frame 405×127 (one-line box, text already two lines hanging below it — frame pair `hw_t1b_pair.webp`), next frame 274×165 (two lines) |
| T2 | Control — auto-wrap off | remote: `AutoWrapText` False on the template and live tooltips; repeat T1 | first logged rectangle = settled rectangle on 3 of 3 hovers; the grab is readable (no text past the frame) | pass 3 of 3: 405×107 from the first frame to the last, «Грубая повязка» in one line inside the frame (live tooltips 0 — a new widget per hover) |
| T3 | Three partitions with the control | T2 on a short-name item, a one-line-description item, a long-description item | first = settled for each; the long description wraps (height of ≥ 2 lines), width ≤ 800 units + padding | pass by frame pairs (first / last): «Камень», «[EAA] Опыт класса», «Рецепт: Грубая рубаха» — same box, one line; the counter's later growth was the living world inside the ROI. NOT covered: a text longer than 800 units — the hover tooltip shows the name only, none found that long |
| T4 | The fix shipped | the kit/pak edit of `Text_Content` (route chosen after T1–T3), no remote; T1 again | first = settled on 3 of 3; same look as T2 | pass 21:3x: KrinikUIFixes 1.2.0 deployed (verify 99/0), template read by the remote AutoWrapText=false WrapTextAt 800 (nothing set by the remote); 404×107 / 403×107 / 404×107 from the first frame to the last, 3 of 3; frame pair `t4_pair.webp` — «Грубая повязка» in one line inside the frame; the owner's eye 21:38: `[OWNER]` «поп-апы описания предметов не дёргаются» |
