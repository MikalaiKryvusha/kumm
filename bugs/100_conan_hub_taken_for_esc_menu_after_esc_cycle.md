# Bug 100 — Conan: after an Esc-menu cycle the next hub opening is taken for the Esc menu (world at 0.0001 in the hub)

**Status:** 🔧 fixed 11:35 (the Esc flag cleared on the full-screen close edge; run B100b), judge round running · was: found 2026-11-14 11:24 +03:00 during bug 94's tests · **Severity:** S2 (the hub runs at the Esc menu's 0.0001 — bug 12 says clicks die at that
dilation; the craft multiplier follows it) · **Version/build:** 3.1.0, KrinikConanUI `krinik_pause_in_menu.lua` 0.17.0 + the bug 94 rescale (working tree) ·
**When/context:** the agent's remote run, the owner's world · **Fixing:** after bug 94's commit (next session if this one closes)

## Symptom (UE4SS.log, 2026-11-14)

- 11:20:56 «ESC-меню открыто: 0.0001» (the Esc menu opened by the remote `GUIModuleController:ActivateModule(FName('IngameMenu'), true, false)` — the log names the
  module `SML_ModList`), 11:21:04 «модуль SML_ModList: закрыт … меню закрыто: 1.0» (closed by `W_IngameMenu_C:TryCloseWindow()`).
- 11:21:23 the hub opened by `ActivateModule(FName('Inventory'))` + `SetCarouselIndex(0)`: «полноэкранный интерфейс: ОТКРЫТ» → **«ESC-меню открыто: замедление
  времени 0.0001»** → «модуль XCS_Panel: открыт». The hub ran at 0.0001.
- Not known: whether the owner's own path (the real Esc key into Simple Mod List's menu and out) leaves the same state, or only the remote close does.

## Cause and fix — 2026-11-14 11:35 +03:00

- **Cause (code read):** `esc_open` is keyed by module name, set / cleared by the `ActivateModule` hook (:457). The remote activated `IngameMenu`; the game showed
  `SML_ModList` (Simple Mod List's menu) and deactivated only `SML_ModList` → `esc_open.IngameMenu` stuck → every later full-screen UI ran at 0.0001. Whether the
  owner's real Esc path can leave the same stuck entry is not known — the remote's `IngameMenu` activation is the likely trigger; the fragility is real either way.
- **Fix** (`poll`): when the full-screen UI goes from open to closed (`fullscreen_was and not on`, no modal) `esc_open` is cleared — log «признак ESC-меню сброшен».
  A first version cleared on any «not on» and fired between the Esc module's activation and the full-screen flag rising — the Esc menu itself got 0.03 (run B100a);
  the edge fixed it.
- **Run B100b (11:34, game PID 38224):** remote Esc open → «ESC-меню открыто: 0.0001»; close → «признак ESC-меню сброшен»; hub → «меню открыто: 0.03»; hub closed → 1.0.

- **Committed:** pack `4a08d5e` (judge round: no blocking defect). **Known limits (judge F1, F2):** (1) a hub closed and an Esc menu opened inside ONE 250 ms poll —
  the new Esc state is cleared before the full-screen flag rises, the Esc menu runs at 0.03 (a weakening, not a breakage); (2) a stuck entry survives one
  full-screen session when no poll sees the closed state between two menus (a fast close-then-Tab, or one remote call). A complete fix asks the game which module
  is shown at poll time instead of keeping event flags — not done.

## First steps (done)

1. Read the section's Esc detection (`ESC_MODULES` :72, the `esc` decision near :612, the module hook near :713) — which flag stays set after the close.
2. Reproduce by the player's path when the PC is free: real Esc → menu → real Esc out → open the inventory (Tab) → the log line must say the menu's 0.03.
3. Fix at the cause; a case in a TC.

## Links

bug 94 (the craft rescale relies on the menu kind), bug 12 (0.0001 in a menu kills clicks)
