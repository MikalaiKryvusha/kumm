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

## Links

- `bugs/84_conan_trait_choice_dialog_under_attribute_tree.md` (same screen) · `bugs/64_conan_mod_ui_wave_overlaps_untranslated.md`.
