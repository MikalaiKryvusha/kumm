# Test cases — Conan: the corpse strip's dark backing covers the line ends (plan 36 W6)

> **Created:** 2026-10-30 · **Parent:** plan 36 W6 (centred two-line corpse prompt), `[OWNER]` «темную подложку нужно расширить, чтобы края строк
> покрывало» · «сейчас они висят в воздухе - и плохо читаемы» · «нужно пересчитать как у подложки размеры задаются от текста» · 2026-10-30 21:40–21:45
> **Status:** written 2026-10-30 22:07 +03:00, before the run · run 1 22:13–22:24 (U1 fail → cause found) · run 2 22:27–22:34 all pass · report `testcases/reports/2026-10-30_conan-corpse-strip-backing.md`
> **Outbound:** the owner's eye on the before/after pair

**Basis.** The owner's three lines above. Probe `_config/devkit/kit-probe-underlay.py` (22:0x): `Border_Underlay` brush `DrawAs=Box`,
`ImageSize=(356,168)`, `Margin=(0,0.3,0,0.3)`, material `MI_UI_InteractionBlossomFade` over `T_UI_InteractionUnderlay` 687×185 whose alpha is ≥ 90 % of
its peak only from 40 % to 60 % of the width. No side margins → the gradient stretches over the strip, the fade grows with it; padding 70 left the line
ends on ≈ 37 % darkness (frame `w6/wide.jpg` 21:4x). **Fix:** brush side margins 0.40 (fixed fade ≈ 142 units per side, the dark middle stretches),
Content padding L/R 140.

**Stand.** Oasis save copy (`_save-backup/2026-10-30_1831-…`), `launch-bg.ps1` (background, the owner's word 18:23), mixer 1 %, god mode, a corpse by
`corpse-prompt-shot.sh` (kill by code), the strip opened BY CODE — `_config/strip-open.sh` (`[OWNER]` «саму плашку кодом открывай» · 21:14), frames 4K
in the background, edges by the remote (`corpse-loot-geom.sh noaim` readout).

Dimensions: the two-line corpse strip (the long case) · a short one-line strip (a chest — our line must stay collapsed) · the strip with the quick-loot
window beside it (overlap). Not covered: 1080p (UI units, scale-free), the strip the game opens itself on a real look (W6 caveat, a separate case).

| # | Case | Steps | Expected | Status |
|---|---|---|---|---|
| K1 | Kit edit | `kit-conanui-edit.py` in the kit, read `kit-conanui-edit.json` | brush `Margin` (0, 0.3, 0, 0.3) → (0.4, 0.3, 0.4, 0.3), `ImageSize` 356×168 unchanged; Content padding L/R → 140 | **pass** 22:09 (margin and slot padding as expected); build 2 22:2x adds the Border's own padding 12 → 140 (see U1 run 1) |
| D1 | The pak carries the widget | `mod-overrides.py` on the built pak | one `override` row for `WBP_ContainerInfo` | **pass** 22:12 and 22:25: 5 overrides, `WBP_ContainerInfo` among them; version 3.0.1 |
| U1 | Two-line corpse strip | corpse by code, `strip-open.sh u1`, 4K frame, crop next to `w6/wide.jpg` | both prompt lines end on the dark part of the backing, the fade starts outside the text; text unchanged (two centred lines, one size, one colour) | run 1 22:17 **fail**: the kit's slot padding 140 drew the box of padding 12 to the pixel (white line 377–1273 in both) — the game applies `Border_Underlay`'s OWN Padding; a live `BorderSlot:SetPadding(140)` widened it. Run 2 22:32 (build 2) **pass**: line ends on 88–98 % of the backing's centre darkness (live padding 12 on the same frame place: −9 … 69 %), white line 404–1834; two centred lines, one size, one colour |
| U2 | Short strip on a chest | `strip-open.sh u2 <chest class>`, frame | the chest's lines on the dark part, no empty corpse line; the backing not wider than text + the two fades | **pass (campfire)** 22:33: no chest in the oasis save (nearest placeable 845 m); a campfire `BP_PL_Crafting_CampFire_C` at 1064 m (`MAXD_M=2000`) — «Костер / Удерживайте E… / Открыто / Владелец…» all on the dark part, our corpse line absent. A chest proper — not run |
| U3 | Strip beside the quick-loot window | the U1 strip with `W_QuickLootPanel` visible, edges readout | `gap` ≥ 0 (the strip's right edge left of the window's left edge) — or, if the window is not shown by a code-opened strip, `blocked` with the reason | **pass (by frame)** 22:32: the window shows with a code-opened strip; strip's right white-line end 1834, window's left edge ≈ 2226 (4K frame of the 1080p window) → gap ≈ 390 px ≈ 178 units. The remote's edge readout returns zeros (`GetCachedGeometry` — «strip nil», loot 0) — the frame decided |
