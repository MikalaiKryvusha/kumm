# Run report — Conan: the corpse strip's dark backing covers the line ends (plan 36 W6)

**Work.** The owner's ask 2026-10-30 21:40–21:45 («темную подложку нужно расширить, чтобы края строк покрывало» · «нужно пересчитать как у
подложки размеры задаются от текста»), cases `testcases/TC_conan_corpse_strip_backing_2026-10-30.md` (K1, D1, U1–U3).

**Contour.** KrinikConanUI kit pak (`WBP_ContainerInfo`: `Border_Underlay` brush side margins 0.40, the Border's own padding and the Content
slot padding L/R 140); Conan 3.0.1 with the full pack, background launch (`launch-bg.ps1`, the game window 1920×1080, frames scaled to 3840 by
`capture-window.ps1`; UI scale 1.10 → 2.2 frame px per unit); the oasis save copy `_save-backup/2026-10-30_1831-before-w6-corpse-prompt`; god mode.
The owner's live save backed up first (`_save-backup/2026-10-30_2212-before-strip-backing`) and restored after (integrity ok).

**Runs.**
- 22:01–22:05 kit probe ×3: `UnrealEditor-Cmd … -Script=_config/devkit/kit-probe-underlay.py -ModDevKit -NullRHI` → the brush and material facts, `T_UI_InteractionUnderlay` exported and measured.
- 22:09 kit edit + 22:12 `python -I -X utf8 _config/devkit/kit-buildmod.py KrinikConanUI <out>` + `Deploy-ModPack.ps1 -Deploy -Only KrinikConanUI` (verify 105/105).
- Run 1 22:13–22:24 (PID 7096): `enter-world-remote.sh`, `corpse-prompt-shot.sh pre` (kill by code), `strip-open.sh u1 Corpse_C`, live
  `BorderSlot:SetPadding` 400 / 12 / 140 with `capture-window.ps1` frames, `MAXD_M=2000 strip-open.sh u2 BP_PL_Crafting_CampFire_C`.
- 22:24–22:26 kit edit 2 (the Border's own padding) + build + deploy (105/105).
- Run 2 22:27–22:34 (PID 33168): `corpse-prompt-shot.sh pre`, `strip-open.sh u1b Corpse_C`, live padding 12 + frame `u1b_pad12`, `MAXD_M=2000 strip-open.sh u2b BP_PL_Crafting_CampFire_C`.

**Checks.**
- Hygiene: `kit-conanui-edit.json` steps read (margin, both paddings); `mod-overrides.py` 5 overrides; `set-pak-version.py --dry-run` 3.0.1.
- Functional run: the strip opened by code on a fresh `Corpse_C` and on a campfire in the live game, 4K frames read by eye and by a column-darkness
  measure on a sand background (darkness = (background − pixel) / (background − backing centre), the band between line 2 and «Труп»).
- K1 pass · D1 pass · U1 run 1 fail (cause below), run 2 pass — line ends on 88–98 % (was −9 … 69 % at padding 12 on the same place) · U2 pass on a
  campfire (no chest in reach) · U3 pass by frame, gap ≈ 178 units to the quick-loot window.

**Found.**
1. The brush had no side margins: the soft gradient of its texture (≥ 90 % of peak alpha only at 40–60 % of the width) stretched over the whole
   strip, the fade grew with it — fixed by Box margins 0.40.
2. The kit's Content-slot padding never reached the game: `UBorder` keeps its OWN `Padding` (12/12/12/8) and applies it; `set_editor_property` on the
   slot bypasses the setter that syncs the two. This is also why the 21:4x «padding 70» changed nothing. Fixed by setting the Border's padding too.
3. The remote's `GetCachedGeometry` readout of `corpse-loot-geom.sh` returns zeros in this run (strip nil, loot 0) — frames decided U3.
4. The camera can turn between frames of one run (background differs, run 1) — the before/after pair of run 2 was shot back to back.

**Traces.** Session scratchpad `run/` and `run2/` (frames `u1b.jpg`, `u1b_pad12.jpg`, `u2b.jpg`); review folder
`НА ОТСМОТР НИКОЛАЕМ\12 подложка над трупом закрывает строки` (three WebP + «что смотреть.md»); `_config/devkit/kit-probe-underlay.json`,
`kit-conanui-edit.json`. Crash window: none. Game closed by PID both times.

**Verdict.** pass — the line ends sit on the dark part; taste (the strip's width) waits for the owner's eye.
