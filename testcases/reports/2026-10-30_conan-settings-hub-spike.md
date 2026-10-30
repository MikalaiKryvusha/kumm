# Run report — Conan: plan 38 phase 0 spike, the game's settings widgets from Lua

**Work.** Plan 38 phase 0 (`plans/38_epic38_phase0_widget_spike.md`), cases `testcases/TC_conan_settings_hub_spike_2026-10-30.md` S1–S9.

**Contour.** Conan Exiles 3.0.1 with the build; the owner's save copied to `Conan Exiles Mods/_save-backup/2026-10-30_1502-before-spike` and restored
after; lock 15:02–15:08; all widget work through the remote (`KrinikConanHarness/KrinikAgentRemote`), one call per step.

**Runs.**
- 15:01 `retoc-5.8 to-legacy --version UE5_7 --no-shaders --filter <WBP_Setting_Checkbox|…> _paksview-3.0.1 <scratch>` + `uaj exports` (six assets).
- 15:03 launch, world entry, god; `StaticFindObject('/Script/ConanSandbox.<Class>'):ForEachFunction/ForEachProperty` for the four native bases.
- 15:04–15:06 `WidgetBlueprintLibrary:Create` of `WBP_Settings_Subheader_C`, `W_EditableLabeledSlider_C`, `WBP_Setting_Checkbox_C`, `WBP_Setting_Dropdown_C`;
  setters; `AddToViewport`; the hub by `ActivateModule('CharacterInventory')`; `RegisterHook` on `HandleCheckboxToggled`, `HandleSelectionChanged`,
  `SetValueFromSlider`, the slider's BP `OnFloatValueChangedEvent`.
- 15:06–15:08 `mouse-seq.ps1 -Seq "move:0.5711/0.2792,wait:400,lclick,…"` (the new `move:` step) ×2, control click on the hub tab, the checkbox moved into
  the hub's root Overlay and clicked again; `capture-window.ps1` frames; `close-game.ps1`.

**Checks.**
- Hygiene: none.
- Functional run: the live hub with the created rows; read — the remote's values, the hooks' log lines (none), frames, the cursor position.
- S1 pass · S2 partial · S3 pass · S4 pass · S5 blocked · S6 fail ×3 · S7 pass (control) · S8, S9 skipped.

**Found.** Real mouse clicks do not reach a vanilla settings checkbox created from Lua — on the viewport (Z 50, Z 10000) or inside the hub's Overlay —
while the same click switches a hub tab. Hypotheses for the next run: (1) the game's FLX buttons take input through the GUI module system / KeyNav, so a
row works only inside a module window (the kit route: our own WindowRoot widget + a module row); (2) the created checkbox's inner `ButtonCheckbox` is
not hit-testable until its parent screen initialises it; (3) the slider (a UMG `Slider` inside) may take a drag where the FLX button does not — S5 next.
`tools`: `mouse-seq.ps1` gained `move:<fx>/<fy>` (proven: the cursor read 2192×603 after `move:0.5711/0.2792`; the tab click worked).

**Traces.** `UE4SS.log` (no `[SPIKE]` hook line); frames `spike1.webp`, `spike4.webp` in the session scratchpad; the recon doc
`researches/conan-mod-settings-hub/vanilla-settings-widgets.md`.

**Verdict.** partial — creation and setting work; the input path into created rows is NOT proven (fails in 3 placements); phase 0 stays open.
