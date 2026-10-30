# The game's own settings widgets (Conan 3.0.1) — what they are made of

> **Created:** 2026-10-30 · **Parent:** plan 38 phase 0 step 1 (`plans/38_epic38_phase0_widget_spike.md`)
> **Status:** assets read 2026-10-30 15:0x (`retoc-5.8 to-legacy --version UE5_7 --no-shaders --filter <name> _paksview-3.0.1` → `uaj exports` + name
> tables); the native classes' functions — next, live by the remote `funcs`
> **Outbound:** —

| Widget (`/Game/…`) | Native base (`/Script/ConanSandbox`) | Inner input widget | Hookable BP functions |
|---|---|---|---|
| `UI/Widgets/MainMenu/Settings/WBP_Setting_Checkbox` | `SettingsCheckboxWidgetBase` ← `SettingsWidgetBase` | `ButtonCheckbox` = `/Game/UI/Widgets/Buttons/WBP_ButtonCheckbox` (on `FLXButtonBase`) | `Construct`, `PreConstruct`, `BndEvt__…ButtonCheckbox…SignalKeyNavSelectionChanged` (focus only); a dispatcher `OnWidgetSelected`; label `DisplayLabel`, `SizeBoxSettingName`, `RightAlignCheckbox` |
| `UI/Widgets/MainMenu/Settings/WBP_Setting_Dropdown` | `SettingsDropdownWidgetBase` ← `SettingsWidgetBase` | `Dropdown` = `/Game/UI/Framework/W_FCComboBoxString` (UMG `ComboBoxString`) | `Construct`, `PreConstruct`, `On_ComboBox_GenerateWidget`, `BndEvt__…Dropdown…SignalKeyNavSelectionChanged`; `CustomTextboxPadding`, `ComboBoxStyle` |
| `UI/Widgets/MainMenu/Settings/WBP_Settings_Subheader` | (UserWidget) | — | `PreConstruct`; variable `Label` (Text) → `TXT_SubheadingLabel` (style `FS_Text_Heading_4`, centred) |
| `UI/Framework/W_EditableLabeledSlider` | `EditableLabeledSlider` | `S_Value` = `/Game/UI/Framework/W_FCSlider`, `TXT_Value` = `W_FCEditableTextBlock` | **`BndEvt__S_Value_K2Node_ComponentBoundEvent_0_OnFloatValueChangedEvent__DelegateSignature`** — fires on a value change: the hook point; `DisplayLabel` |
| `UI/Framework/WBP_ResetableEditableLabeledSlider` | `EditableLabeledSlider` | the same + `ButtonReset` (`T_RevertBinding` icon) | the same `OnFloatValueChanged` BP event; `HandleAnySubWidgetSelected` |

All text uses the game's styles (`FS_Text_Body_3`, `FS_Text_Heading_4`) — rows built from these look like the game's «Настройки» by construction.
**Native API (live 2026-10-30 15:04, `StaticFindObject('/Script/ConanSandbox.<Class>'):ForEachFunction / ForEachProperty`):**
- `SettingsWidgetBase` — F: `UpdateTooltipInfo`, `UpdateFocusAnimation`, `IsDirty`, `HandleWidgetSelected`; P: `OnWidgetSelected`, `OnTooltipRequested`, `SettingName`, `TextSettingName`, `SizeBoxSettingName`, `TextColor`, `TooltipInfo`, `TextBoxLengthOverride`, `ImageBackground`, `AnimFocused`.
- `SettingsCheckboxWidgetBase` — F: `SetIsToggledOn`, `GetIsToggledOn`, `HandleCheckboxToggled` (the hook point); P: `OnCheckboxToggled`, `OnCheckboxToggledWithInstance`, `ButtonCheckbox`.
- `SettingsDropdownWidgetBase` — F: `AddOption`, `RemoveOption`, `RemoveOptionByID`, `ClearOptions`, `SetSelectedOption`, `SelectedOptionByID`, `GetSelectedOption`, `GetSelectedOptionID`, `GetOptionCount`, `GetOptionAtIndex`, `FindOptionIndex`, `ClearSelection`, `HandleSelectionChanged` (the hook point); P: `OnSelectionChanged`, `Dropdown`.
- `EditableLabeledSlider` — F: `SetValue`, `GetValue`, `SetValueFromSlider`, `SetValueFromText`, `UpdateTextValue`, `UpdateSliderStepSize`, `GetValueFromSliderValue`, `GetSliderValueFromValue`, `HandleResetButtonClicked`; P: `SignalSliderRealValueChanged`, `SignalSliderRealValueChangedWithInstance`, `MinValue`, `MaxValue`, `StepValue`, `SliderStepType`, `MinFractionalDigits`, `MaxFractionalDigits`, `DisplayValueScale`, `Value`, `OnSliderReset`, `ButtonReset`.

- `FLXButtonBase` (live 2026-10-30 15:24) — F: `SetIsToggledOn`, `InstantSetIsToggledOn`, `InstantSetIsEnabled`, `SetToggleBehaviour`, `SetInputAction`,
  `SetKeyShortcutName`, `SetLabel`, `SetIcon*`, `Get/SetUserDataAs*`; P: `SignalClicked/Pressed/Released/Toggled/MouseEnter/MouseLeave`, `StyleAsset(Class)`,
  `ToggleBehaviour`, `IsToggledOn`, `KeyShortcutName`, `Anim*`, `ImageBackground/Frame/Icon`. The button itself is `SelfHitTestInvisible` (4); the click lands on its
  Visible `ImgBackground` and bubbles to it. A created checkbox's `ButtonCheckbox` and the live hub `CloseButton` carry the same flags (enabled, not focusable,
  own StyleAsset instance) — the dead click is not a flag on the button (spike run 2, S10). Run 3 (15:3x): a SLOT parent is not enough — a created
  checkbox put inside the live vanilla popup `W_InventorySettings_C` stays dead while the popup's own FLX «Отмена» clicks. The OUTER differs: 48 of 49 live
  FLX buttons live in some window's `WidgetTree`; ours (`Create(pc, class, pc)`) live under the GameInstance. `WidgetBlueprintLibrary:Create(<window>, class,
  nil)` creates INSIDE `<window>.WidgetTree` (UE5 owning-widget path) — whether such a row clicks is untested: adding it crashed the game (S11).

Next (superseded by the line above for the API): `pult.sh "funcs SettingsWidgetBase"` / `SettingsCheckboxWidgetBase` / `SettingsDropdownWidgetBase` / `EditableLabeledSlider` for their setters,
getters and delegates; how `W_Settings_Gameplay` feeds one row (its assets are unpacked in the session scratchpad by the same command).
