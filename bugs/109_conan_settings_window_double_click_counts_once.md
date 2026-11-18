# Bug 109 — a fast double click inside the «Моды Krinik'а» settings window counts as ONE click

**Status:** 🔴 OPEN · **Severity:** S3-class papercut by impact, filed as a document because it is a judge finding with a confirmed run · **Fixing:** RC2 (after 0.9.1-RC1)
**Version/build:** 0.9.1 working tree, KrinikConanUI pak of 2026-11-18 21:28 (with the double-click overrides) · **When/context:** 2026-11-18 21:31, bug 85 judge round 2, case J1

## Symptom

Two real left presses 120 ms apart on a checkbox of our settings window (e.g. «Резкий зум») toggle it ONCE: the UE4SS log has one line «click: check cam_sharp → true».
The player who double-clicks a checkbox, a mod name or an «i» sees one action instead of two. Not critical by HOUSE_RULES 38 (a single click works; no crash, no dead end).

## Repro

The hub open → «Настройки модов» → «Моды Krinik'а» → `mouse-seq.ps1 -KeepFront -Seq "move:0.778/0.4986,wait:300,lclick,wait:120,lclick,wait:700"` (the checkbox at 4K
full screen) → one «click: check» line.

## Forensics

- Windows sends the second press of a quick pair at one spot as WM_LBUTTONDBLCLK; Slate routes it only as `OnMouseButtonDoubleClick` (bubble, no preview, no
  `OnMouseButtonDown`). The bug 85 design takes our window's clicks from `OnPreviewMouseButtonDown` — the second press never reaches it (judge round 2, finding 1).
- The kit fix (`kit-krinik-click-events.py`, `double_click()`: an `OnMouseButtonDoubleClick` override calling the same event) WORKS for `W_KrinikClickCatcher`
  (case J2: the second press closed the mods list, «щелчок мимо списка — список закрыт» 21:31:38) but NOT for `W_KrinikModSettings` (J1, 21:31:56).
- The checkbox is a `UBorder` (`Brd_KrinikChk_*`), whose double-click handler returns Unhandled — the bubble should reach the window. The window's parent class is the
  game's native `WindowRoot`: the working hypothesis is that `WindowRoot` consumes the double click in its native handler before the blueprint event (not verified).

## Root cause / Hypotheses

1. (most likely) `WindowRoot::NativeOnMouseButtonDoubleClick` returns Handled without calling the blueprint event. Check: a probe — the same override on a plain
   UserWidget child placed inside the window's content (a `W_KrinikClickWrap` around `VB_KrinikContent` in the kit) and see whether ITS double click fires.
2. A hit-testable widget between the checkbox and the window handles the double click (a Button style row) — the kit tree has Borders only on that path.

## Fix plan

Put a `W_KrinikClickWrap` (its double-click override already calls KrinikPreview) around the window's content in `kit-krinik-modsettings.py`, route its event in
`krinik_mod_settings.lua` like `KrinikMouseDown`; case J1 with two presses < 300 ms on a checkbox, a mod name and an «i»; the neighbours K4, N6, N7.

## Decisions made without the owner

- `[AI]` Deferred to RC2: by HOUSE_RULES 38 it is cosmetic-level input loss, not a critical bug of 0.9.1; RC1 is the owner's test of the install path (his word 20:54).

## Links

`bugs/85_conan_crash_keybind_lua_races_game_thread.md`; `testcases/TC_conan_keybinds_to_game_events_2026-11-18.md` J1, J2; run report
`testcases/reports/2026-11-18_conan-keybinds-judge2-run.md`.
