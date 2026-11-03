# Bug 81 — the quick-loot window lies over the journey tracker, and the tracker's text shows through the window's grid

**Status:** ✅ DONE 2026-11-03 22:57 +03:00 (way A, KrinikConanUI `krinik_ui_fixes` 1.4.0) · **Severity:** S3 visual (the agent's own find, filed as a document by the 1.0.0 list in STATUS) · **Version/build:** pack ConanExiles
`068b935`, KrinikConanUI 0.9.0 · **When/context:** seen by the agent 2026-11-03 20:13 +03:00 on the bug 75 stand; recorded in STATUS «NEW owner remarks (2)»;
this document 2026-11-03 22:29 +03:00
**Fixing:** after the HUD weight icon (this chat's dayloop)

## Goal vector (Achieve)

The quick-loot window is read on its own: no text of another panel shows through its grid.
Acceptance: a 4K frame of the window open over a corpse while the journey tracker shows a step — no tracker letters inside the window's rectangle.

## Symptom

The right-hand journey tracker (`WBP_JourneyTracker_C`, owned by the game instance — «Выживший · Потратьте очки характеристик · На каждом уровне вы
получаете одно очко…») stays on screen when the quick-loot window opens; the window (`W_QuickLootPanel` in `WBP_ContainerInfo`, centred at ≈ x 2966 of
3840 by our kit edit) covers the tracker, and its semi-transparent grid lets the tracker's text through (frames of 2026-11-03 21:1x–21:4x: «характеристик»,
«На каждом уровне вы…» inside the empty cells).

## Repro

`_config/loot-stand.sh` + `_config/loot-aim.sh` (the humanoid corpse stand), the game in front: the window opens over the corpse; the tracker shows a step
(the owner's save has «Потратьте очки характеристик» pending).

## Forensics

- Read-only remote 2026-11-03 22:3x: the tracker's TextBlocks «Выживший», «Потратьте очки характеристик» → outer chain `WBP_JourneyTracker_C` <
  `BP_ConanGameInstance_C` (a viewport widget of its own, not in the HUD tree).
- The window's backing (live, the same minute): root `Border_2` — `T_UIPanelBG_Tile` tiled (DrawAs 3), tint white at 1.0, so the see-through is the
  texture's own alpha; `Border_1` — `T_UI_GeneralWindow_Border` (Box) — the frame; `Border_0` (the title row) — `M_UI_PanelBackground` (Image). Way B is an
  opaque layer under `Border_2`'s content or a darker tint — a kit edit of `W_QuickLootPanel`.
- Our kit edit put the window on the quest panel's edge on purpose (`kit-conanui-edit.py`: «one width on the quest edge», bug 64 items 32–35) — the overlap
  is where the window stands, not a drift.

## Ways (not chosen yet)

- A — hide the tracker while the quick-loot window shows (the same moment `krinik_ui_fixes.align` already reads: the window's visibility), back after.
- B — an opaque backing under the window's grid (kit edit of `W_QuickLootPanel`): nothing shows through, the tracker stays.
- C — the window further left (kit slot `OverlaySlot_3` padding) so it never reaches the tracker — the corpse strip and the «E Взять» places were tuned
  against it (bug 64, plan 36 W6).
The look is the owner's eye: a frame of A and B on the same corpse before the choice.

## The fix (2026-11-03 22:5x)

Frames of the three ways on one corpse 22:49: as is · A (the tracker not drawn) · B (the window's tile tinted 0.35) — A clean, B no help (the see-through
is the tile texture's own alpha). `krinik_ui_fixes` 1.4.0: `align` (the window's own events) sets the tracker's RENDER opacity 0 while the window shows;
the window closes without an event when the view leaves the corpse, so a watch every 250 ms runs ONLY while the tracker is hidden and gives it back (1.0)
once the window is off screen. Seen after a normal start 22:56: window open → tracker opacity 0.0, no text inside the grid; view turned away 120° →
opacity 1.0, the tracker on the frame. Hygiene: none. Functional run: real game, the window opened by the game on a real corpse, frames read.
TWINS: other panels under the window — none seen on these stands (the quest panel stays left of it by the kit layout).

## Decisions made without the owner

- `[AI]` by mandate (`[OWNER]` 22:39 «аналогичный вопрос про автономность работы»): way A of three, after the frames of A and B.
- `[AI]` render opacity, not visibility — the game switches the tracker's visibility itself.

## Links

`bugs/75_conan_quick_loot_selection_jumps_on_f_take.md` (the same window), `games/ConanExiles/mods/KrinikConanUI.md` (`krinik_ui_fixes`, the kit's
`W_QuickLootPanel` row), STATUS «NEW owner remarks».
