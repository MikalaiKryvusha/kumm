# TC — KrinikConanUI: four interface mods as one (plan 36 W31)

> **Created:** 2026-10-30 · **Parent:** plan 36 W31, W34; `[OWNER]` «KrinikUIFixes - переименовать в KrinikConanUI» · «KrinikFpsCounter - идет в мод UI» ·
> 2026-10-30 ≈13:0x; the approved set of five shipped Krinik mods (13:02)
> **Status:** cases written 2026-10-30 14:1x, before the run; run 14:10–14:14 — U1–U8 pass (report testcases/reports/2026-10-30_conan-krinik-conan-ui-merge.md)
> **Outbound:** —

**Goal (Maintain).** After the merge the player sees exactly what he saw with the five old mods: the kit pak overrides the same four vanilla widgets
under the new name, and the four Lua parts run as sections of one Lua mod. Nothing of the old names stays in the game folder.

**Stand.** The owner's save copied before the launch; world entry by `enter-world-remote.sh`; god by `bash _config/god-on.sh`; no creature needed
for U1–U5; the game in front for frames (`capture-window.ps1`), the HUD woken by a real Shift tap before each frame (the idle camera hides it).
Techniques: smoke by eye (U1), state checks by the log and the remote (U2, U5, U6), observation of the visible part (U3, U4), control (U7).

| # | Case | Steps | Expected | Status |
|---|---|---|---|---|
| U1 | Smoke — the game reaches the menu | launch after the deploy; frame of the main menu by eye | the main menu, no crash reporter | pass — main menu frame 14:11 by eye, no crash reporter |
| U2 | Pak mounted under the new name | `ConanSandbox.log` after world entry; `Mods/modlist.txt` | `KrinikConanUI.pak` in modlist before `KrinikLevelUncapped.pak` (last); the log mounts it; no `KrinikUIFixes` | pass — `LogModManager: Mounting mod pak file … KrinikConanUI.pak` 14:11:06; modlist ends `KrinikConanArchery.pak, KrinikConanUI.pak, KrinikLevelUncapped.pak`; the stale `KrinikUIFixes.pak` line dropped by the deploy (engine fix of the same day) |
| U3 | Four sections load | `UE4SS.log` | «[KrinikConanUI] section krinik_ui_fixes: loaded» and the same for fps_counter, hud_outline, pause_in_menu; no «FAILED» | pass — four «section …: loaded» lines 14:10:49, no FAILED |
| U4 | FPS counter and HUD outline | world, HUD awake; frame of the top right corner and the Hosav bars | the frames-per-second number top right over the minimap; the Hosav text with a black outline | pass — frame 14:12:23: «63» top right over the minimap; Hosav text bold with outline, F1 under the damage meter; log: counter and outline set on `W_NewHealthUI_C` by the creation event |
| U5 | Pause in the menu | the remote opens the inventory (`ActivateModule`), reads `GetGlobalTimeDilation`; closes it, reads again | 0.03 open (the inventory slows time ×33 — the guide; the first draft said 0.0001, the Esc menu value), 1.0 closed; the section's log line with the module name | pass — open 0.0300, closed 1.0000; «меню закрыто: замедление времени 1.0» in the log |
| U6 | Kit overrides alive | the remote reads the template of an overridden widget: `WBP_ContainerInfo_C:WidgetTree.Overlay_Main.OverlaySlot_5` padding | 120 left and right (vanilla 20 — the kit report «before» on a fresh mod) | pass — L/R 120, `OverlaySlot_3` L 500; `W_ItemIconTooltipView` `Text_Content.AutoWrapText` false is NOT decisive (the kit read false before the edit too) |
| U7 | Control — no old mods | list `ue4ss/Mods` and `Mods/` | no `KrinikUIFixes`, `KrinikFpsCounter`, `KrinikHudOutline`, `KrinikPauseGameInMenu` folders or pak; no log lines with the old prefixes | pass — removed file by file before the deploy; 0 lines with the old prefixes, 0 starts of the old mods |
| U8 | No crash, no Lua errors | the whole run | no crash, no `[Lua] error` lines from KrinikConanUI | pass — 0 Lua error lines; closed cleanly 14:13:57 by `close-game.ps1`, no crash reporter |
