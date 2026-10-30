# Run report — Conan: HUD hunger/thirst/weight blink early, dim → full, 20 % faster (plan 36 W36)

**Work.** Plan 36 W36 — the owner's word 2026-10-30 ≈14:23 (verbatim in the case file); basis `testcases/TC_conan_hud_blink_early_2026-10-30.md`
(H1–H10). Two changes: Hosav's own blink speed 0.25 → 0.30 (pak rows `flt:Progress_Food|Progress_Drink|Get_WeightText 1.0 0.30` in
`_config/localization/asset-strings/UIMod_Hosav__W_SmoothHP.tsv`), and the new Lua section `KrinikConanUI:HudBlink` for the zone before the limit.

**Contour.** Conan Exiles 3.0.1 with the build; Hosav pak rebuilt by `rebuild-krinik-paks.py --only UIMod_Hosav` — its identity guard refused the install
(1 of 228 chunks differs — the intended `W_SmoothHP` change), so the built pak `D:\Temp\kumm-rebuild-krinik\UIMod_Hosav-2\out\UIMod_Hosav.pak` was
copied into the library and the game by hand (the previous pak kept in the session scratchpad); `KrinikConanUI` deployed by `-Only`; the owner's save
copied to `Conan Exiles Mods/_save-backup/2026-10-30_1443-before-hudblink-run` and restored after; lock 14:43–14:51.

**Runs.**
- 14:43:35 launch (`launch-bg.ps1`, `enter-world-remote.sh`, `god-on.sh`) — water 2.2 % and no section line: the first build took the class TEMPLATE
  (`FindFirstOf('W_SmoothHP_C')` → `…W_NewHealthUI_C:WidgetTree.W_SmoothHP`); fixed to the live `hud.W_SmoothHP` from the creation event.
- 14:46:09 relaunch with the fix; the remote set `BP_HungerSystem.FoodCurrent` 50 → 9 → 1 → 0 → 50, `DrinkCurrent` 9 → 0 → 50, `exec MakeMeAdmin` +
  `exec SpawnItem 51405 4` ×3 for weight; reads `IsAnimationPlaying`, `In…Animation`, `GetAnimationCurrentTime`, `Border_EatImage.ContentColorAndOpacity`;
  `capture-burst.ps1 -Count 28 -IntervalMs 130` (food 2 %, water 8 %, weight 100.7 %).
- 14:50 relaunch on the restored save (weight 68.9 %) — the weight animation's idle state read; 14:51 `close-game.ps1`.

**Checks.**
- Hygiene: none beyond the load line.
- Functional run: the live HUD — the section's lines, the remote's animation reads and a frame sheet read by eye.
- H1–H10 pass. Frames: food at 2 % blinks white ↔ strong red, water at 8 % white ↔ pale pink (dim), weight at 100.7 % Hosav's red.

**Found.** The template-instead-of-instance trap of `FindFirstOf` for a widget that lives in another widget's tree (fixed; lesson EXP-0385). The weight
animation reports «playing» at its end with alpha 0 below the zone — Hosav's idle state, invisible, no effect. Cost per poll unmeasured (os.clock 1 ms step).

**Traces.** `UE4SS.log` lines `[KrinikConanUI:HudBlink]` 14:46:17–14:50; the frame sheet `blink-sheet.webp` in the session scratchpad.

**Verdict.** pass — the early dim blink, the full blink at the limit and the 0.30 speed work as the owner asked; the look of the dim step (start 0.25) is
the owner's eye.
