# Run report — Conan: the «ОТЗЫВ» button, the game logo override, the gold-run intro wheel

**Work.** Plan 36 W37 (the «ОТЗЫВ» plate, the owner's rounds 00:41–01:04, accepted «высота 40 принята») against
`testcases/TC_conan_feedback_button_2026-10-31.md` (F1–F7); W26 the game logo (the owner's upscale, crisp ®, 01:09) and the intro wheel (01:12).

**Contour.** Game `D:\Games\Conan Exiles 3.0.1`, FOREGROUND path (`[OWNER]` «экран твой» · 00:52), real mouse by `_config/mouse-seq.ps1`; kit
`F:\CEUE5Devkit` (`-ModDevKit`, KrinikConanUI); pack `D:\work\ai_sandbox\ConanExiles`; machine lock `kumm` 01:15–01:36.

**Runs.**
- 01:15:02 — `launch-fg.ps1` (Image build) → `capture-burst.ps1 -Count 45 -IntervalMs 1000` → `capture-window.ps1 -Width 3840`; `mouse-seq.ps1 -Seq "move:0.380/0.310,…,lclick"`; remote `pult.sh "lua RegisterKeyBind(Key.LEFT_MOUSE_BUTTON, …)"` probe 01:17.
- 01:24:55–01:30:45 — `kit-conanui-edit.py` × 2 (stop on `ok: false`) + `kit-buildmod.py` → `Deploy-ModPack.ps1 -Deploy -Only KrinikConanUI`.
- 01:31:07 — `launch-fg.ps1` (Button build): hover pair, two clicks (01:32), one click (01:33).
- 01:34–01:35 — `collect-report.ps1 -GameDir … -Feedback` run directly (the address box order).

**Checks.**
- Hygiene: kit report `ok: true` (pass 2 — 0 GUID notes); pak 11 assets (8 vanilla overrides incl. the game logo, 3 own textures, no placeholder);
  `collect-report.ps1` keeps its BOM and parses (0 errors).
- Functional run: the real main menu by the player's path, frames and logs READ: F1 pass (plate under «1.0.0», crisp game logo), F2 pass (luma 56.6
  vs 45.9), F3 pass (log, zip 785 KB, game minimized, Explorer with the zip, the address box on top), F4 blocked, F5/F6 not run (need the world),
  F7 partial (63 ms on the menu click). The intro: both logos + the wheel on screen during the load, ≈ 3 s black, then the live backdrop.

**Found.**
- UE4SS hooks on `/Script/UMG.UserWidget:OnMouseButtonDown` / `:OnMouseMove` never fire → Button + LMB key bind (EXP-0399).
- `SlateBrush.image_size` rejects `Vector2D` in kit Python; the first chain built a pak from the previous save (now the chain stops on `ok: false`).
- The collector's Explorer and mail opened BEHIND the fullscreen game → the game is minimized first; the address box opened under Outlook → it is
  TopMost and comes before the mail.
- On this machine `mailto:` opens new Outlook at a sign-in screen — the box with the address is what a player can rely on.
- A gameplay LMB is also a click: the section keeps the menus from creation events, no scene search on the click.

**Traces.** Session scratchpad `w37/` (run/ sheet, menu4k.jpg, hover_pair2.webp, edit3_*.log, build3.log); `UE4SS.log` lines «[KrinikConanUI:Feedback]»
01:31–01:33; test zips, windows and screenshots with the owner's screen removed (PIDs 37464, 37284, 17928, 23788, 36752, 38088, 24500). Crash window: none.

**Verdict.** partial — the main-menu button works end to end (F1–F3); the Esc menu (F5, F6), the debounce (F4) and the gameplay-click cost (F7) are next.
