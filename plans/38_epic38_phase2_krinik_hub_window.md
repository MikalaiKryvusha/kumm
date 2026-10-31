# Plan 38 · phase 2 — the «Моды Krinik'а» hub window by mockup 5, live rows and a settings store

> **Created:** 2026-10-31 · **Parent:** `plans/38_EPIC_conan_mod_settings_hub.md` phase 2 row; phase 0 closed 2026-10-31 19:37 (kit window, a live checkbox)
> **Status:** written 20:22; step 1 (inventory) running; the dayloop takes it by «работай автономно» (2026-10-31 19:19, again 20:12)
> **Outbound:** the look — frames to the owner's eye against mockup 5 (review folder); taste stays his

## Goal vector (Achieve)

The skeleton window shows one checkbox that drives nothing and a «Закрыть» that does not click. The player should open «Моды Krinik'а» and see mockup 5
(approved 19:09): the title alone at the top, «Закрыть без сохранения» top right, our mods with settings on the left (full names, a long name slides
left-right), ONLY the selected mod's rows on the right, each row with an «i» that explains it, «Сбросить к исходным» bottom left, «Сохранить» and
«Сохранить и закрыть» bottom right — and a saved value must change the mod and survive a restart.

## Acceptance criteria (scenario form; anchors — the epic's criteria 3, 4, 5, 6)

1. **The look.** Situation: the hub (inventory) open, the window opened. Action: the player looks at it. Result: the parts of mockup 5 in its places
   (title, close-without-saving, mod list, the selected mod's name, rows, footer buttons); 1080p and 4K frames side by side with `variant_05_final.webp`.
   Check: frames at 1080p and 4K looked at by eye; the remote reads the widget names of the tree.
2. **Selection.** Situation: the window open on the first mod. Action: a real click on the second mod's name. Result: the right side shows only that
   mod's rows; the name is highlighted. Check: the remote reads `WidgetSwitcher:GetActiveWidgetIndex()` = 1; a frame.
3. **The «i».** Situation: a row with an «i». Action: the mouse over the «i» (or a click on it). Result: a plate with the option's name and explanation
   next to it; the mouse away (or a second click) hides it. Check: the plate's visibility read by the remote; a frame.
4. **Save applies and persists.** Situation: the FPS counter is on. Action: untick it, «Сохранить». Result: the counter disappears at once; after a
   game restart it stays off. Check: the store file before and after; the section's log line «fps counter off (store)»; a frame of the corner.
5. **Close without saving.** Situation: a row changed, not saved. Action: «Закрыть без сохранения». Result: the window closes, the store file is byte-equal
   to before, the mod unchanged; reopening shows the saved value. Check: `cmp` of the store; the row read by the remote.
6. **Reset.** Action: «Сбросить к исходным». Result: every row of the shown mod returns to its default (not saved until «Сохранить»). Check: the rows read.
7. **No cost in play.** With the window closed nothing of the hub runs (no timer); the LMB bind returns after one boolean. Check: the section's minute
   summary 0 calls while closed; `os.clock` of 1000 bind calls by the remote < 0.02 ms each.

## Steps

- [x] 1. **Inventory** of our mods' settings — DONE 20:30: `researches/conan-mod-settings-hub/krinik-settings-inventory.md` (17 file-backed rows — Camera 16,
      ModPackManager 1; 30 code constants as candidates; the vignette has no code). **The window's rows** `[AI]` (live-applicable only; restart-only rows
      wait): Camera A1, A2, A4, A5, A6, A7, A9, A10 · UI C1 (FPS counter — a flag added), C3, C4, C10, C12 · Graphics C13 · Archery C15, C16, C19 ·
      ModPackManager A17. A mod enters the left list only when its apply works in game; the vignette rows come with the vignette code (plan 36 W23).
- [x] 2. **The slider row** — DONE 20:26 by the existing recon (`researches/conan-mod-settings-hub/vanilla-settings-widgets.md`) and one kit probe
      (`KIT_WIDGETS=W_Settings_Audio kit-probe-tree.py`, 94 s): the game's sound screen uses `W_EditableLabeledSlider_C` (`/Game/UI/Framework/
      W_EditableLabeledSlider`, native `EditableLabeledSlider`: `SetValue`, `GetValue`, `MinValue`, `MaxValue`, `StepValue`, `DisplayValueScale`;
      a change fires the BP event `BndEvt__S_Value_…OnFloatValueChangedEvent…` and the native `SetValueFromSlider`) in a plain `ScrollBox`. The FLX
      button: `label` and `key_shortcut_name` set in the kit; `TryCloseWindow` closes the window; no click event Lua can hook → the LMB bind route.
- [ ] 3. **The store.** `FORK: options <one file Saved/KrinikSettings.lua for all mods | per-mod files> · price of error <a format change later =
      every mod's reader edited; a mod folder file is wiped by a redeploy> · consulted <the inventory §D–E: Camera and ModPackManager already read a
      config.lua once at load and fall back to code values; UE4SS ModRef:SetSharedVariable in our build (UEHelpers.lua:18,23)>` → `[AI]` ONE file
      outside the mod folders, written only by the hub on «Сохранить», read by each mod at load; live apply: the UI sections directly (same Lua state),
      the other mods check a shared version number at a moment they already run (no new timer); the camera merges its keys and calls its own `apply()`
      (it rewrites its `config.lua` itself — the hub never writes that file). **DONE 21:08:** the shared number carries a number — the hub's
      `ModRef:SetSharedVariable("KrinikSettingsVersion", n)` on save, KrinikConanGraphics re-read at its next stain (pack `6ef5a08`, report G1). The reader
      pattern for the other mods: `read_store()` at load + `settings_check()` at a moment the mod already runs (see `KrinikConanGraphics/…/main.lua`).
> **First game batch 21:01 (pack `75ef09f`, report `testcases/reports/2026-10-31_conan-hub-phase2-first-batch.md`, partial):** steps 3 (store), 4 (kit),
> 5 (section) built and walked with a real mouse on the KrinikConanUI page — fill, «i», reset, save, save-and-close, the FPS switch both ways, a restart; six
> defects found and fixed in the run. Next: P3/P4 re-observation, P6 byte check, P11; the camera, archery, pack manager and graphics readers (step 6); the
> sheet beside mockup 5 at 1080p and 4K for the owner; the Simple Minimap drawn over our window once (ZOrder 99 vs ours 101 — unexplained).
> **THE OWNER'S REMARKS on the look in game, 2026-10-31 21:41–21:42 — job one of the next chat** (verbatim): «хаб настроек модов какой-то огромный» ·
> «кривые кнопки инфо» · «большие расстояния между опциями» · «странный жирный шрифт» · «некрасивый поп-ап при ховере». Routes `[AI]`: the window size —
> `SB_KrinikWindow` width/height overrides set by Lua at fill (no kit rebuild), variants on one game frame for his eye; «i» — the kit's rounded-box outline
> (HALF_HEIGHT radius on a text box of uneven width) → a fixed square box or a game icon; row gaps — `ROW_GAP` 6 + the game rows' own 60-unit height;
> the font — `TextSettingName`'s font copied with its bold typeface → the regular typeface of the game's settings rows; the plate — a dark solid Border →
> the game's tooltip widget or the fishing panel frame. Each fix — frames beside mockup 5 in a review folder; taste is his (house rule: look, then show).
- [x] 4. **Kit window by mockup 5** — rewrite `kit-krinik-modsettings.py` (widgets reused by name, never removed — the GUID trap; run twice): head row
      (title TextBlock + `B_KrinikCloseNoSave`), body (left `SC_KrinikMods` with one name button per mod, clipped name boxes; right — mod name + note,
      `WS_KrinikPages` with one page per mod: per row an HB of our label + «i» button + the game row with an empty label as the control), the «i» plate
      (hidden Border over the canvas), the footer (`B_KrinikReset`, `B_KrinikSave`, `B_KrinikSaveClose`). Sizes from mockup 5 (window ≈ 69 % × 83 %
      of the 1080p screen). Exit: report json «0 errors» on the second run; `mod-overrides.py` lists our two assets; the pak built.
- [ ] 5. **Lua section** `krinik_mod_settings.lua`: one `RegisterKeyBind(LEFT_MOUSE_BUTTON)` that returns at once unless our window is open, then routes
      the hovered button (close-without-save, save, save-and-close, reset, a mod name, an «i»); while the window is open ONLY: a 50 ms watch for the «i»
      hover and the marquee of a long name; labels and «i» texts from one table; pending values kept until «Сохранить»; Save writes the store and calls
      each mod's apply. Exit: `check-lua-game-thread.py` 0; the section's log names every routed click.
- [ ] 6. **The mods read the store** (only those whose rows exist): at start and on the apply call. Exit: each mod's log line with the value it took.
- [ ] 7. **Test batch in the game** (machine lock, save copy, background launch, real mouse by `mouse-seq.ps1`): cases of criteria 1–7 written first into
      `testcases/TC_conan_hub_phase2_<date>.md`; frames at 1080p and 4K; video of the clicks (house rule 4). Exit: every case with a status.
- [ ] 8. **Show and record**: review folder with the frames beside mockup 5; the mod notes, bug 64 / plan 36 rows, the guide section (house rule 20).

## Risks

- (a) The vanilla slider row may not fire a hookable native function from a kit tree (the checkbox did) — step 2 decides before the kit work.
- (a) A cross-mod live apply: UE4SS mods are separate Lua states — step 3 records how one mod tells another (a console command handler, a shared
      UFunction hook, or re-read at an event); until then «Сохранить» may need the mod's next event to take effect.
- (b) A static row set in the kit means a new setting needs a kit rebuild (≈ 6 min) — acceptable for our own mods.
- (b) Kit GUID trap on new widgets — run twice; never delete a widget from the tree.
- (c) The marquee timer runs while the window is open only — the window-open lag is allowed by the owner's 2026-10-14 rule.

## Decisions made without the owner

(filled at the phase's close)
