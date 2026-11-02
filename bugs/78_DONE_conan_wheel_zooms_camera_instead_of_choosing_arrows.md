# Bug 78 — in the bow aim the mouse wheel zooms our camera instead of choosing arrows

**Status:** ✅ DONE · **Severity:** S2 (a mod feature unusable: the arrow choice of Arrow Quick Swap) · **Version/build:** pack ConanExiles `40db56d`
(KrinikConanCamera wheel zoom; Arrow Quick Swap + KrinikConanArchery `on_aqs_display`) · **When/context:** 2026-11-02 14:23 +03:00, the owner's play
**Fixing:** the next chat, right after bug 77

`[OWNER]` «а как выбирать стрелы при натяжении?» · (answer: the wheel in the aim) · «зум камеры меняется» · 2026-11-02 14:22–14:23.

## Symptom

RMB held (aim), mouse wheel: the camera zoom of KrinikConanCamera changes; the arrow kind is expected to change (Arrow Quick Swap's wheel path), the list
right of the crosshair to show it.

## Fix plan

Recon first (`games/ConanExiles/mods/KrinikConanCamera.md` and `ArrowQuickSwap.md`): where our camera mod reads the wheel (key bind or axis) — while the hero
aims with a bow (substate 16, or the archery mod's aim state), the camera mod leaves the wheel to the game/mods (no zoom step); check that Arrow Quick Swap
then receives it (`InpAxisKeyEvt_MouseWheelAxis`), the control case with our camera section off. Cases: aim + wheel → the arrow kind changes, zoom unchanged;
no aim + wheel → zoom as before.

## Forensics (2026-11-02 14:52–15:08, the live game, recorder every 100 ms, real RMB + wheel in ONE `mouse-seq.ps1` sequence)

- Repro: in the aim (`AllowShowingUI` true) two wheel clicks moved the arm 273 → 299 → 329 → 294; `ActiveAmmo` stayed 51184 — the arrow never changed.
- AQS's wheel axis event fired every frame with 0 (another mod, `EAA_MC_C`, has input on and eats `MouseWheelAxis`; with its input off AQS got the clicks) — but
  the axis event is EMPTY in AQS's graph (entry = pop flow): arrows cycle only by the actions `CycleArrow_UP/DOWN`.
- `CheckCustomBindings` (AQS bytecode): `Key_GetDisplayName(GetFirstKeyForActionMapping("CycleArrow_DOWN")) == "None"` → `AddActionMapping(CycleArrow_DOWN =
  MouseScrollDown)` (UP likewise + `Gamepad_DPad_Up`). The literal «None» is a localizable text (key `D71D7D204737C8044CCD97BC0B6B9301`), and OUR translation
  turned it into «Нет» through the shared row 3464 of `dm-fish-ru.tsv` (an EoT enum «None»): the check never passed in the Russian build, the actions had no
  key. The two mappings added by the remote → the wheel in the aim cycled the arrow (51184 → 53612 → 51184).
- Wheel UP still stalled: `GetCurrentAmmoInventory` puts one entry per STACK into `CurrentAmmo` ([51184, 51184, 53612]); `CycleAmmoSelection` finds the current
  id's FIRST index and steps ±1 — up from a bone stack lands on the next bone stack. The window builds 3 rows per entry (`CreateAmmoWidgets`, a wrap ring): 18 rows
  from 6 stacks. The same per-stack count made our «≥ 2 kinds» rule (the list on a draw) count stacks.

## The fix (2026-11-02, pack `a848a58`)

1. The translation keeps the service string: `key:D71D7D204737C8044CCD97BC0B6B9301\tNone` in `dm-fish-ru.tsv` (source) and the built `Game.locres`
   (`locres-set-tr.py` learned key rows: `locres-fixes-2026-11-02.tsv`; its source guard demands the same key row in `dm-fish-ru.tsv`, code 3 otherwise).
2. KrinikConanCamera: while the hero aims (AQS's own `AllowShowingUI`, read in its `UpdateDisplayUI` — an event), the game's zoom step `CameraZoomAmount` is 0.
3. KrinikConanArchery `one_row_per_kind`: right after AQS's `GetCurrentAmmoInventory` (only `UpdateDisplayUI` calls it), one entry per arrow kind; the window is
   rebuilt by its own `ClearVBoxAmmoWidgets` / `CreateAmmoWidgets` when stacks were merged. The asset does not yield a same-size patch (no `Array_AddUnique`
   import) — HOUSE_RULES rule 8's Lua exception: once per aim entry, no polling, 0.20 ms with AQS's own refill.

## ✅ STATUS: DONE (2026-11-02 15:11 +03:00)

Hygiene: `luac -p` of both Lua files, `check-lua-game-thread.py` 0, `check-lua-shadow.py` 0; `locres-set-tr.py` guard red on a key row absent from the source (code 3).
Functional run: the live game, cases W0–W6 of `testcases/TC_conan_wheel_in_bow_aim_2026-11-02.md` — after the fix AQS binds the wheel itself; in the aim every
wheel click, up and down, changes the arrow and the arm stays (230, step 0); out of the aim the wheel zooms (230 → 250); with 6 stacks «стопок 6, видов 2»,
the window 6 rows. Report `testcases/reports/2026-11-02_conan-wheel-in-bow-aim.md`.
REAL WORLD: accumulated — the owner's game folder, his save and inventory (two bone stacks after the test spawn), his camera `config.lua` (byte-equal); data and
machine — his; path — RMB held + the wheel, as he plays. Verified on the real world.

## Decisions made without the owner

- `[AI]` In the aim the wheel never zooms, even with one arrow kind (nothing to choose then — the wheel does nothing). Alternative: zoom when there is one kind.
- `[AI]` The zoom block keys on AQS's flag: without Arrow Quick Swap the wheel zooms in the aim as in the game.
- `[AI]` `EAA_MC_C`'s input left as it is — it eats only the wheel axis, which nothing of the build needs now.
- `[AI]` The AQS window shows its wrap ring (with two kinds: «Железная · Костяная · Железная») — the author's design, kept.
