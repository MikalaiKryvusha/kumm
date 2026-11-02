# Mod notes — Arrow Quick Swap (another author's; KRINIK MODIFIED)

> **Created:** 2026-11-02 · **Parent:** bug 64 item 29, the owner's words of 2026-11-02 12:49–12:55 · **Status:** living notes — the ONE place for this mod's internals
> **Outbound:** —

**What it is.** A Workshop pak (`ConanSandbox/Mods/ArrowQuickSwap.pak`, the build's container 3724971404 in `_krinik-modified/`) that lets the player cycle the
arrow kind by the mouse wheel / gamepad while the bow is in hand, with a list window `UI_AmmoDisplay` right of the crosshair («54x Костяная стрела · 2x Железная
стрела»; place in a 4K frame ≈ 2390–3040 × 900–1260, seen 2026-11-02 12:53).

## Assets and functions (live remote dump 2026-11-02 12:55, `scratchpad aqs_props.lua`)

- `AQS_Actor_Component_C` on the hero (`BasePlayerChar_C`): `ShowingUI`, `InputCoolDown`, `AmmoUI` (the window), `CurrentAmmo` (array — one entry per
  arrow kind in the inventory; 2 at the oasis save), `AmmoCount` (map), `ActiveAmmo` / `PreviousAmmo` (item template id, 53612), `EquiptBow`, `UIPopup`,
  `AllowShowingUI` (false while aiming at the dump), `MinDisplayTime` 1.5, `UsingUP/DOWNDefaultInput`. Functions: `UpdateDisplayUI`, `RevealDisplay`,
  `OnCharacterSubstateChanged_Event`, `CycleAmmoSelection`, `TryCycleAmmo`, `PopupUIOnAutoChange`, `GetCurrentAmmoInventory`, `OnSettignsActivatedEvent`,
  input events (RMB, LMB, wheel axis, CycleArrow UP/DOWN, gamepad).
- `UI_AmmoDisplay_C` (created under the game instance): `VBox_Ammo`, `ScrollBox_Ammo`, animation `Reveal`, `InUseWidgets` (6 rows), `DisplayHidden`,
  `VisibleOffset` 90; functions `HideDisplay`, `RevealDisplay`, `PopupAutoSelectedAmmo`, `CreateAmmoWidgets`, `Tick`.
- Flow (game map, bytecode 2026-10-29): `UpdateDisplayUI` adds the window to the viewport on substate 16 (aiming) and removes it on exit; the wheel path is
  `HideDisplay` → `RevealDisplay` (animation `Reveal` on `CanvasPanel_32.RenderOpacity`), auto-hide after `MinDisplayTime`.

- **`UpdateDisplayUI` bytecode (2026-11-02 12:5x, `patch-mod-asset.py extract ArrowQuickSwap AQS_Actor_Component` → `uaj exports … VER_UE5_6` →
  `kismet-trace.py … UpdateDisplayUI`; 413 bytes in memory, the asset's exports at uexp 19737, 30 exports):** `NewDisplay = (CharacterSubState == 16)`; when it
  differs from `AllowShowingUI`, `AllowShowingUI = NewDisplay`; then, if true: `GetCurrentAmmoInventory()` (fills `CurrentAmmo`), locally controlled →
  `UIPopup = false`, `GetAmmoUI()`, `AmmoUI:AddToViewport(0)`; if false: locally controlled and `AmmoUI` valid → `AmmoUI:RemoveFromParent()`. No reveal on aim:
  the list appears only by `RevealDisplay` (wheel, auto-change popup).

- **How the wheel reaches the arrows (bytecode 2026-11-02 14:5x, `ExecuteUbergraph_AQS_Actor_Component`, `CycleAmmoSelection`, `GetCurrentAmmoInventory` by
  `kismet-trace.py`; KUMM bug 78):** the axis event `InpAxisKeyEvt_MouseWheelAxis` is EMPTY (its ubergraph entry 1895 pops the flow at once). Arrows cycle only by the
  actions `CycleArrow_UP` / `CycleArrow_DOWN` → `TryCycleAmmo(±1)` → `CycleAmmoSelection`. `CheckCustomBindings` (called with the Settings module bind) adds
  `CycleArrow_DOWN = MouseScrollDown`, `CycleArrow_UP = MouseScrollUp` and `Gamepad_DPad_Up` through `GetInputSettings():AddActionMapping(…, true)` ONLY when
  `Key_GetDisplayName(GetFirstKeyForActionMapping(pc, <action>)) == "None"` — and «None» is a LOCALIZABLE text literal (key `D71D7D204737C8044CCD97BC0B6B9301`,
  `.uexp` offsets 9223 / 9985). A translation of that key breaks the binding: the build's Russian had «Нет» there (fixed 2026-11-02, see Our edits).
- **Per-stack list (the author's bug):** `GetCurrentAmmoInventory` walks the hotbar and backpack and `Array_Add`s EVERY bow-projectile stack to `CurrentAmmo`
  (`AmmoCount` map is per template — the counts are right); `CycleAmmoSelection` builds `AmmoIDArray` of template ids by `Array_Add`, finds the active id's FIRST
  index, `NewIndex = (i + dir + len) % len`, `SetAmmo` on the bow, `ActiveAmmo = GetIntStat(40)`. Two stacks of one kind → «up» lands on the same kind forever.
  The window `UI_AmmoDisplay_C` (`/Game/Mods/ArrowQuickSwap/UserInterface/UI_AmmoDisplay`): `CreateAmmoWidgets` (no parameters) makes 3 rows per `CurrentAmmo`
  entry — a wrap ring (6 stacks → 18 rows). The asset imports `Array_Add`, `Array_Find`, `Map_Add`, `Map_Find` — no `Array_AddUnique`, so no same-size patch.
- `EAA_MC_C` (another mod's actor) has input enabled and consumes `MouseWheelAxis` — AQS's axis event sees 0; harmless, the axis path is empty anyway.

## Our edits

- 2026-10-29 (bug 64 item 29): the window flashed for a moment on every draw — it is born opaque and the hide animation came a frame later. `addprop:
  CanvasPanel_32/RenderOpacity 0` (`_config/localization/asset-strings/ArrowQuickSwap__UI_AmmoDisplay.tsv`, pack `4931d0a`) — born invisible; the list then shows
  only on the wheel. Cases `testcases/TC_conan_arrow_choice_no_flash_on_draw_2026-10-29.md`.
- 2026-11-02 13:0x (`[TESTED: 2026-11-02 · L1–L4 pass, a per-frame bright-text meter over the list box: 102/403 frames shown with 2 kinds, 0/495 with one kind, 0/503 with the row off · testcases/reports/2026-11-02_conan-arrow-choice-and-bow-stance.md]`, cases L1–L4 of `TC_conan_aim_flicker_and_stamina_2026-11-02.md`): KrinikConanArchery `on_aqs_display` — a post-hook of
  `UpdateDisplayUI` (registered at the component's birth or at the first aim): when `AllowShowingUI`, the window's OWN `SetRenderOpacity` = 1 if the hub row
  `arc_ammo_list` is on and `CurrentAmmo` has ≥ 2 kinds, else 0 (the `Reveal` animation drives only `CanvasPanel_32`, so a 0 on the root hides the wheel's
  reveal too); when shown, the component's own `RevealDisplay` (auto-hide by `MinDisplayTime`). Row in the hub — kit `kit-krinik-modsettings.py` PAGES `arc`
  and the Lua `krinik_mod_settings.lua`, default on.

- 2026-11-02 (KUMM bug 78, `[TESTED: 2026-11-02 · W0–W6 · testcases/reports/2026-11-02_conan-wheel-in-bow-aim.md]`): (1) the translation keeps the service
  «None» untranslated (`dm-fish-ru.tsv` key row + `Game.locres`) — AQS binds the wheel itself again; (2) KrinikConanCamera holds the game's zoom step at 0 while
  `AllowShowingUI` — the wheel in the aim no longer moves the camera; (3) KrinikConanArchery `one_row_per_kind` after `GetCurrentAmmoInventory` — one entry per
  kind and the window rebuilt by its own functions.

## How to look inside

Remote dump of properties/functions — `aqs_props.lua` pattern (`ForEachProperty` / `ForEachFunction` on `FindFirstOf`). Bytecode: `python -I -X utf8
_config/devkit/patch-mod-asset.py extract ArrowQuickSwap <Asset> <work>` → `kismet-trace.py <asset.uasset> <exports.tsv> <asset.json> <function>`.

## Open

- **The owner's word 2026-11-02 12:49–12:55:** `[OWNER]` «и все ещё мерцает выбор стрел чуть-чуть при причеливании - давно просил починить это» · «вообще - выбор
  стрел при натяжении - хорошая фича» · «но если в инвентаре только один тип стрел. и выбирать не из чего - нет смысл его показывать» · «даже нет смысла мерцать
  им» · «если есть из чего выбирать - показывается, если не из чего выбирать - не показывается» · «в принципе эта фича - включается или выключается целиком через
  настройки стрельбы мода Krinik Archery» · 12:56 «если выключена - то он никогда не показывается, даже не мерцает ни чуть-чуть». To build: on a draw, the list shows when `CurrentAmmo` holds ≥ 2 kinds and never (not one frame) with one kind; a hub
  row on the KrinikConanArchery page turns the feature on/off — OFF: the window never shows, not one frame, the wheel still cycles (`[AI]` the wheel keeps working silently) (`[AI]` default on — «хорошая фича»; duration — the author's `MinDisplayTime`).
  The residual «чуть-чуть» flicker was not seen in a 120 fps capture of one aim entry (12:52, TC `TC_conan_aim_flicker_and_stamina_2026-11-02.md` F1).
