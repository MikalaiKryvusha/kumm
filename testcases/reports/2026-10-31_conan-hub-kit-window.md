# Run report — Conan: the «Моды Krinik'а» hub skeleton as a kit window; a game settings checkbox inside it takes a REAL click

**Work.** Plan 38 phase 0, the ROUTE of 19:11 (steps 1 and 3): a native module window of our own in the `KrinikConanUI` kit pak, our module table merged
into the game's at runtime from Lua, and the epic's main risk — a game settings checkbox row that never took a real click when created from Lua (spike S6,
S11) — tested inside OUR window's WidgetTree. Cases K1–K9, K2b, K8b of `testcases/TC_conan_hub_kit_window_2026-10-31.md`.

**Contour.** Conan Exiles Enhanced 3.0.1 with the build; the kit `F:\CEUE5Devkit` (active mod `KrinikConanUI`); background launch path `launch-bg.ps1` both
runs; real input by `mouse-seq.ps1` after `wait-input-idle.ps1` — it brings the game in front only for the sequence and hands the foreground back; the
owner's save copied (scratch `save-backup-1931`, 19:29) and restored after each run by `save-restore.sh` (the game writes `Game_0.db` on exit), integrity ok;
machine lock 19:16 → released 19:37.

**Runs.**
- Kit (19:16–19:28): `kit-krinik-modsettings.py` ×4 — run 1 no root (Python reaches neither `WidgetTree.RootWidget` nor the factory's root class), run 2
  `unreal.UMGEditorProjectSettings` not wrapped, run 3 `load_class('/Script/UMGEditor.UMGEditorProjectSettings')` CDO `DefaultRootWidget = CanvasPanel` → root
  `CanvasPanel_0`, the tree built, 378 «was added but did not get a GUID» errors (the known first-run trap), run 4 «Success - 0 error(s)»; CookInfo +2 lines
  (kit + `kit/CookInfo.ini`); `kit-buildmod.py KrinikConanUI` 2 min 32 s → 9 076 671 bytes; `mod-overrides.py`: 13 assets, 8 vanilla paths, own table
  `DT_KrinikUIModule`.
- Run 1 (19:29–19:34, PID 37392): deploy `-Only KrinikConanUI`; main menu — the section's merge failed (`LoadAsset` with the package path), the same merge by
  the remote passed; world; hub; our window; real clicks on the box ×2, on empty space ×1, on «Закрыть» ×1; a real Esc; `TryCloseWindow` by the remote.
- Run 2 (19:35–19:37, PID 2692): the fixed section and the Esc map deployed; main menu merge by the section; world; hub; our window; a real click; a real Esc.

**Checks.**
- Hygiene: `check-lua-game-thread.py` 0 calls; the kit's report `kit-krinik-modsettings.json` (the table reads back: Modal, None, ZOrder 101, CloseOnESC
  True, WidgetClass → `/Game/Mods/KrinikConanUI/W_KrinikModSettings.W_KrinikModSettings_C`).
- Functional, by the user's path with a real mouse: **the checkbox INSIDE our window takes a real click** — `UE4SS.log` 19:32:38
  `[KrinikConanUI:ModSettings] checkbox Chk_KrinikFps HandleCheckboxToggled (post) args [UObject: 000002C88FA45E38, true] GetIsToggledOn true`, the remote
  `open=true on=true`, the tick on the frame; the second click 19:32:57 `… false`; a click on empty space — no line (control); repeated in run 2 at
  19:37:24 (`true`). The runtime merge: remote 19:30 `mc=true ok=true rows 117->118 has false->true`; section 19:36:10 `merge (main menu): call ok; rows
  117 -> 118; KrinikModSettings present false -> true; 11.00 ms`; in the world `rows 256 has true` after 3 896 merge lines of the mods. Esc: run 1 fail (the
  row's `CloseOnESC` does not close a mod Modal window), run 2 pass — `Esc: окно KrinikModSettings закрыто, хаб под ним остаётся`, ours `open=0 hub=true`.

**Found.**
- The decisive one: a `WBP_Setting_Checkbox` placed by the kit in the WidgetTree of a `WindowRoot` blueprint is a live, clickable game settings row — the
  dead click of the spike was the Lua-created widget's outer, not the row. The route of the epic stands: kit window + the game's rows.
- The registration needs NO ModController blueprint and no editor graph: `MergeDataTables` called on the native `ModController` CDO
  (`/Script/DreamworldMods.Default__ModController`) from Lua works, at the main menu, before the mods' own merges (the table has 117 rows there, 255 + 1 in
  the world) — our row survives their merges.
- Kit Python traps: a new Widget Blueprint gets its root only from `UMGEditorProjectSettings.DefaultRootWidget` (set on the CDO loaded by path, session only);
  `SettingName` of a settings row is instance-only («cannot be edited on templates»), `DisplayLabel` protected → the label is written by Lua into the live
  row's `TextSettingName` at activation; UE4SS `LoadAsset` needs the full object path `Pkg.Obj`.
- Open: a click on «Закрыть» does nothing — a bare `WBP_ButtonBase` in our window has no click handler (the vanilla popups bind theirs natively). The row
  label wraps to two lines in the row's own name box (look — phase 2). No crash-report window in either run.

**Traces.** Frames (WebP, 1920 wide from 3840) in the session scratchpad `…\scratchpad\hubwin\`: `k4a_hub`, `k4b_window`, `k5_click_on` (+ `_crop`),
`k6_click_off` (+ `_crop`), `k8_esc`, `k8b_tryclose`, `r2_window`, `r2_esc`; kit logs `kitms1–4.log`; build `kcui-build\`. Looked at by eye at every step.

**Verdict.** pass — the main risk of epic 38 is retired: a game settings checkbox inside our kit window receives a real mouse click, its own handler fires,
the state flips both ways; the module table merges at runtime from Lua; Esc closes only our window. Next: the close button's click (plan 38 phase 1/2).
