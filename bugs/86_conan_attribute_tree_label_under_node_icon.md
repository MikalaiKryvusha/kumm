# Bug 86 — the attribute tree: the «Осквернённые характеристики» label lies under a node icon; the side description runs off and overlaps

**Status:** 🔴 OPEN — recorded from the owner's frame
**Severity:** S3-visible (a UI seam the owner flagged; owner's debt → first in the UI queue)
**Version/build:** Conan Exiles 3.0.1 build · **When/context:** 2026-11-07 21:45 +03:00 — the owner's frame in chat (no words), while he played after the bug 85 deploy
**Fixing:** after bug 85's open items (the KrinikConanUI key-bind twins touch the same windows) — the attribute / perk tree screen

## Symptom (the frame, described — the image lives in the chat only)

- The character's attribute tree: the purple caption «Осквернённые Характеристики» (corrupted attributes) is drawn across a round brown node icon (a perk node
  with the «≡» glyph on a golden stem) — the icon covers the letters «Ха» of «Характеристики»; a purple diamond «+» button sits left of the caption.
- On the right, the description column («Второе дыхание … падает ниже … получите ис… Способность … полного исц…») is cut by the frame edge and its lines are
  overlapped by the caption row.
- Left: a column of small round node icons on a golden line.

## Expected

The caption sits clear of the node icons (its own row or a place without nodes); the description column stays inside the window, nothing overlaps.

## To do

1. Find which widget draws the caption (the vanilla «corrupted attributes» header of the attribute tree, or a mod's — UIMod_Hosav / EAA / our hub controller, bug 84)
   — control case with KrinikConanUI's Lua out (rule 24).
2. Frame at 4K and 1080p (rule 17), fix natively (rule 8), frame after.

## Cause found 2026-11-10 12:5x — the same defect as bug 91

The caption is the attribute ROW's own `CorruptionLabel` (W_Attribute, shown on hovering the row or its purple «+»), drawn with no plate from the diamond to the
right — over the right column's perk icons and text (the «Ха» under the «≡» node is the column's perk icon). The branch is the game's own (vanilla == ours,
the static control in bug 91). Reproduced by a real hover 2026-11-10 (bug 91). The fix is ONE: bug 91 — the owner's pick of four looks (review folder 81),
then the kit edit; this bug closes with it. The «description cut by the frame edge» part is the column's height — the column scrolls since 2026-11-10
(`SB_KrinikPerkScroll`, plan 49 step 4).

## Links

- `bugs/91_conan_corruption_button_hover_tooltip.md` — the same defect (the fix lives there).

- `bugs/84_conan_trait_choice_dialog_under_attribute_tree.md` (same screen) · `bugs/64_conan_mod_ui_wave_overlaps_untranslated.md`.
