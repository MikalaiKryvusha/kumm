# Bug 100 — Conan: after an Esc-menu cycle the next hub opening is taken for the Esc menu (world at 0.0001 in the hub)

**Status:** 🔴 OPEN — found 2026-11-14 11:24 +03:00 during bug 94's tests, cause not read · **Severity:** S2 (the hub runs at the Esc menu's 0.0001 — bug 12 says clicks die at that
dilation; the craft multiplier follows it) · **Version/build:** 3.1.0, KrinikConanUI `krinik_pause_in_menu.lua` 0.17.0 + the bug 94 rescale (working tree) ·
**When/context:** the agent's remote run, the owner's world · **Fixing:** after bug 94's commit (next session if this one closes)

## Symptom (UE4SS.log, 2026-11-14)

- 11:20:56 «ESC-меню открыто: 0.0001» (the Esc menu opened by the remote `GUIModuleController:ActivateModule(FName('IngameMenu'), true, false)` — the log names the
  module `SML_ModList`), 11:21:04 «модуль SML_ModList: закрыт … меню закрыто: 1.0» (closed by `W_IngameMenu_C:TryCloseWindow()`).
- 11:21:23 the hub opened by `ActivateModule(FName('Inventory'))` + `SetCarouselIndex(0)`: «полноэкранный интерфейс: ОТКРЫТ» → **«ESC-меню открыто: замедление
  времени 0.0001»** → «модуль XCS_Panel: открыт». The hub ran at 0.0001.
- Not known: whether the owner's own path (the real Esc key into Simple Mod List's menu and out) leaves the same state, or only the remote close does.

## First steps

1. Read the section's Esc detection (`ESC_MODULES` :72, the `esc` decision near :612, the module hook near :713) — which flag stays set after the close.
2. Reproduce by the player's path when the PC is free: real Esc → menu → real Esc out → open the inventory (Tab) → the log line must say the menu's 0.03.
3. Fix at the cause; a case in a TC.

## Links

bug 94 (the craft rescale relies on the menu kind), bug 12 (0.0001 in a menu kills clicks)
