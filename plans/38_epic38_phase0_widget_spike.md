# Plan 38 · phase 0 — spike: a window from the game's own settings widgets, driven from Lua

> **Created:** 2026-10-30 · **Parent:** `plans/38_EPIC_conan_mod_settings_hub.md` → phase 0 («Lua builds a window from the game's own widgets … their change
> events reach Lua; the window opens over the hub, Esc closes it»)
> **Status:** written 2026-10-30 15:0x; steps 1–2 done 15:08 (API read, rows created and set); step 3 FAILED ×3 for the checkbox (real clicks do not reach a created row — viewport Z 50/10000, the hub Overlay); S5 the slider drag PASSED 15:13 (UMG input works; the FLX button does not); next: the checkbox inside a module window or a UMG CheckBox of our own (our WindowRoot in the KrinikConanUI kit + a module row) — report testcases/reports/2026-10-30_conan-settings-hub-spike.md; run 2 (15:24): S10 the FLX flags are the same on a created and a live button (not the cause); S11 (the row inside a vanilla popup) not done — my FindAllOf(WindowRoot) probe crashed the game (EXP-0386); next: S11–S14 of the TC, the window found by a concrete class
> **Outbound:** —

## Goal vector (Achieve)

Retire the epic's main risk: prove that our Lua can build a window out of the game's own settings widgets (section header, checkbox, slider,
dropdown in a scroll), that a player's change of a row reaches Lua, and that the window lives over the hub and closes on Esc. If the widgets will not
cooperate, decide the fallback (our kit widget pak) with evidence — not by taste.

## Acceptance criteria

1. Situation: the hub is open. Action: the remote runs the spike section's «open» command. Result: a window with a header «Проба настроек» and three
   rows (checkbox, slider, dropdown) built from `WBP_Settings_Subheader`, `WBP_Setting_Checkbox`, a vanilla slider row, `WBP_Setting_Dropdown`.
   Check: a frame; the remote lists the row widgets' classes.
2. Situation: the window is open. Action: a REAL click on the checkbox and a real drag of the slider (`mouse-seq.ps1`). Result: the section logs the new
   values. Check: `UE4SS.log` lines «spike: checkbox → true», «spike: slider → N».
3. Situation: the window is open over the hub. Action: a real Esc. Result: the window closes, the hub stays. Check: frames before/after; `IsOpen` reads.
4. Side by side with the game's own «Настройки» screen the rows look alike. Check: one sheet of two crops (ours / the game's), by eye.

## Steps

- [x] 1. **Read the widgets** (anchor: «Lua builds a window from the game's own widgets»): unpack to legacy the vanilla assets `WBP_Setting_Checkbox`,
      `WBP_Setting_Dropdown`, `WBP_Settings_Subheader`, `W_EditableLabeledSlider`, `WBP_ResetableEditableLabeledSlider`, `W_FCSlider`, `W_Settings_Gameplay`
      (`retoc-5.8 to-legacy --version UE5_7 --no-shaders --filter <name> <_paksview-3.0.1> <scratch>` → `uaj exports` → JSON); write down per widget:
      its setup function (label/value), its event dispatchers (OnValueChanged …), the child that takes input. **How the game's own screen feeds them**
      — trace `W_Settings_Gameplay` building one row. Into `researches/conan-mod-settings-hub/vanilla-settings-widgets.md` and the game map.
- [x] 2. **Create one row live** (anchor: «their change events reach Lua»): through the remote — `WidgetBlueprintLibrary:Create(world, <class>, pc)`, its
      setup call, `AddToViewport`; a frame. One remote call per step (the 2026-10-30 00:22 crash: an Overlay + a brush copy in one call).
- [ ] 3. **Receive the change** — `RegisterHook` on the row's change path found in step 1 (a BP event or the inner `Slider`/`CheckBox` native
      `OnValueChanged` delegate); a real click; the log line. If nothing fires — try binding the inner native widget's delegate; three variants written
      down before the fallback (TESTING_FRAMEWORK → hunt the reproduction).
- [ ] 4. **The window** — a `ScrollBox` with a `VerticalBox` of rows inside a vanilla-looking frame (the fishing panel's frame or `W_Settings`' frame);
      over the hub; Esc closes it (the `TryCloseWindow` route of `KrinikConanUI:PauseGameInMenu`, or the row widget's own Esc shortcut).
- [ ] 5. **Cases and run** — `testcases/TC_conan_settings_hub_spike_2026-10-30.md` before the run; run report; the comparison sheet.
- [ ] 6. **Decide** — works → phase 1's operational plan; does not → the fallback with its evidence, the meta-plan's phase 0 row updated.

## Risks

- The widgets may expect their parent screen (a settings object, a style asset) — step 1 reads `W_Settings_Gameplay` first.
- `WidgetBlueprintLibrary:Create` of a mod widget once produced a dead button (2026-10-29) — step 3 tries three variants.
- A crash from a Lua-built widget tree — one call per step, the save copied, the game ours (`launch-bg.ps1`).
