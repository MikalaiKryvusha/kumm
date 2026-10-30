# TC — plan 38 phase 0: a window from the game's own settings widgets, driven from Lua (spike)

> **Created:** 2026-10-30 · **Parent:** `plans/38_epic38_phase0_widget_spike.md` (criteria 1–4)
> **Status:** cases written 15:0x; run 15:02–15:08 — creation and setting PASS; a real DRAG reaches a created slider (S5 pass, 15:13); real CLICKS do not reach a created FLX checkbox (S6 fail ×3) (report testcases/reports/2026-10-30_conan-settings-hub-spike.md)
> **Outbound:** the look side by side with the game's «Настройки» — the owner's eye

**Goal (Achieve).** Prove or refute that Lua can create `WBP_Settings_Subheader`, `WBP_Setting_Checkbox`, `W_EditableLabeledSlider`, `WBP_Setting_Dropdown`,
receive their changes, show them over the hub and close them on Esc.

**Stand.** The owner's save copied; world entry by the remote; the hub opened by `ActivateModule('CharacterInventory')`; the game in front for real
clicks (`mouse-seq.ps1`, `wait-input-idle.ps1` first); one remote call per widget step (the 2026-10-30 00:22 crash lesson). Techniques: probe of
the API (S1), creation (S2–S4), event path by a real click (S5, S6), control — a click outside the widget logs nothing (S7), Esc (S8), look (S9).

| # | Case | Steps | Expected | Status |
|---|---|---|---|---|
| S1 | Native API | `funcs SettingsWidgetBase`, `…CheckboxWidgetBase`, `…DropdownWidgetBase`, `EditableLabeledSlider` | setters/getters/delegates named in the recon doc | pass — the native API read live (ForEachFunction/ForEachProperty), written in researches/conan-mod-settings-hub/vanilla-settings-widgets.md; signatures: SetValue(v, broadcast), SetIsToggledOn(on, ?, ?), AddOption(FText, id), SelectedOptionByID(id, ?) |
| S2 | Create a header | `WidgetBlueprintLibrary:Create(…WBP_Settings_Subheader_C…)`, `Label` set, `AddToViewport` | «Проба настроек» on screen in the game's heading style | partial — created and shown by WidgetBlueprintLibrary:Create + AddToViewport; the label shows «EXAMPLE TEXT»: PreConstruct copies the Label variable — set Label BEFORE adding (next run) |
| S3 | Create a slider row | the same for `W_EditableLabeledSlider_C`, label and range set | a slider row on screen | pass — created, MinValue/MaxValue/StepValue/SetValue(300, false) took, «300,00» on screen; the slider row has NO label of its own (a label is the row container's) |
| S4 | Create a checkbox and a dropdown row | the same | both rows on screen | pass — checkbox created and toggled on by SetIsToggledOn(true,false,false) (tick on screen); dropdown: three options added, GetOptionCount 3; SelectedOptionByID(10,false) left -1 |
| S5 | Slider change reaches Lua | `RegisterHook` on its `BndEvt__S_Value…OnFloatValueChangedEvent`; a real drag | a log line with the new value | pass (run 15:13–15:16) — a REAL drag (mouse-seq ldown, move 0.775→0.66, lup) on a slider created from Lua over the hub: the BP OnFloatValueChangedEvent and SetValueFromSlider both fired (1.0 → 0.0, the slider's 0..1), GetValue 0.0. The UMG slider takes the mouse where the FLX checkbox (S6) does not |
| S6 | Checkbox change reaches Lua | the hook found by S1; a real click | a log line with the new state | fail ×3 — a REAL click (mouse-seq move+lclick, cursor read 2192×603 = on the checkbox by frame) did not toggle it and no hook fired, in three placements: viewport Z 50, viewport Z 10000, child of the hub's root Overlay (W_Carousel_C). Control: the same real click on the hub tab «Таланты» switched the tab |
| S7 | Control | a real click on empty screen | no log line | pass by the S6 control — the input path works for the game's own widgets |
| S8 | Esc | a real Esc with the rows over the hub | the rows go, the hub stays | skipped — next run |
| S9 | Look | a crop of ours next to a crop of the game's «Настройки» screen | the same fonts, frames, colours | skipped — next run (frames spike1/spike4 show the game's fonts and frames on our rows) |

## Run 2 (chat 5db69748, 2026-10-30 15:3x) — why a real click does not reach a created FLX checkbox

**Basis.** S6 failed ×3; the game map (hub bottom row, 2026-10-29) holds the same class twice: Hosav's `WBP_ButtonBase` (native `FLXButtonBase`) moved into
the hub bar or created a second time by `WidgetBlueprintLibrary:Create` never fires its handler, while UMG widgets (the fishing `Btn_Open`, the slider of
S5) take the mouse. Hypotheses: (H1) an FLX button takes the click only inside a live module window (`WindowRoot`); (H2) a flag on the FLX button
(enabled / interactable / input mode) is off on a created instance; (H3) UMG is the only route — then the row's look stays vanilla and the input is a UMG
widget under our control. Techniques: state transitions (outside / inside a module window), a control (the vanilla popup's own button clicks), error guessing (H2 flags).

**Stand.** As run 1: the owner's save copied before and restored after; world entry by the remote; god on; the hub open; the game in front for real
clicks (`wait-input-idle.ps1` first); one remote call per widget step.

| # | Case | Steps | Expected | Status |
|---|---|---|---|---|
| S10 | FLX flags (H2) | `ForEachFunction/ForEachProperty` of `/Script/ConanSandbox.FLXButtonBase`; read on the created checkbox's `ButtonCheckbox` every bool/enum property and `GetIsEnabled`, `GetVisibility` | the list written; a flag that differs from a live vanilla button (a hub bar button) named | pass (15:24) — H2 NOT confirmed: FLXButtonBase F: SetIsToggledOn, InstantSetIsEnabled, SetToggleBehaviour, SetInputAction, SetKeyShortcutName… P: SignalClicked/Pressed/Released/Toggled/MouseEnter/Leave, StyleAsset(Class), ToggleBehaviour, KeyShortcutName, Anim*; created `ButtonCheckbox` vs the live hub `CloseButton`: the same Visibility 4 (SelfHitTestInvisible — the click lands on its Visible `ImgBackground` and bubbles), bIsEnabled true, bIsFocusable false, a StyleAsset instance each; differ only by design (ToggleBehaviour 1 vs 0, KeyShortcutName None vs Escape). Row tree: SizeBox → Overlay → ImageBackground (Visible) + HorizontalBox → name text, ButtonCheckbox — nothing lies over the button |
| S11 | Inside a module window (H1) — attempt 1 crashed the game 15:25:25 by MY probe (FindAllOf(WindowRoot) + IsOpen over templates, EXP-0386), not by the popup; crash window closed, PID 21336; save restored | open the vanilla popup `InventorySettingsPopup` over the hub; create a `WBP_Setting_Checkbox`; add it into a panel of the popup's live tree; a real click on it | `HandleCheckboxToggled` hook prints; `GetIsToggledOn` flips | fail (run 3, 15:37) — the popup is `W_InventorySettings_C` (tree: PanelContent VerticalBox, `Setting_ShareContentsButton`, `B_Apply`, `B_Close`; PanelContent only by `GetWidgetFromName`); a checkbox created by `Create(pc, class, pc)` added into PanelContent shows inside the popup, a real click: no hook, `on=false`. H4 (owner chain): of 49 live `WBP_ButtonBase_C` 48 live in some window's `WidgetTree`, the 1 under the GameInstance is our own dead fishing look. `Create(window, class, nil)` builds the widget INSIDE `<window>.WidgetTree` (UE5 owning-widget path) — but `AddChildToVerticalBox` of it + `SetText` in ONE call crashed the game 15:38:55 (ACCESS_VIOLATION 0x0, no stack; crash window PID 6124 closed; save restored). Not narrowed which of the two actions crashed |
| S12 | Control for S11 | a real click on the popup's own checkbox or button | its own handler reacts (state read by the remote or a frame) | pass (15:36) — the popup's own share toggle did not react, but it is DISABLED (`GetIsEnabled` false, not in a clan); the popup's own FLX «Отмена» closed the popup on a real `mouse-seq` click (`IsOpen` false) — real clicks reach vanilla FLX buttons |

**Run 3 stopped by the owner 15:5x.** After the 15:38 crash the restored save (15:34 copy, 663 552 bytes) was rewritten by the game at its next start
(15:40:05, 659 456 bytes) and world entry stopped working — «Продолжить» pressed by the remote ×3 and by a real click, the world never loads. Cause (found
15:50): the bare `cp` of `Game_0.db` left the crash's stale `Game_0.db-wal`, the game replayed it → malformed save; repaired by `save-restore.sh`, world entry
passes on both launch paths (`testcases/reports/2026-10-30_conan-save-restore-wal.md`). Lesson: two crashes in a row = stop experimenting and repair the stand (EXP-0387).
| S13 | UMG checkbox (H3) | `StaticConstructObject` a UMG `CheckBox` into the viewport over the hub; a real click | `IsChecked()` flips false → true | |
| S14 | Dropdown by real clicks | the created `WBP_Setting_Dropdown` (3 options) over the hub; a real click opens the list, a real click picks «20 %» | `HandleSelectionChanged` hook prints; `GetSelectedOptionID` = 20 | |
