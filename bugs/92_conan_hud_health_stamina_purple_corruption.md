# Bug 92 — Conan HUD: the purple colour of the health and stamina bars must come back (it shows corruption)

**Status:** 🔴 OPEN · **Severity:** S2 · **Fixing:** after bug 91 / the attribute arrows (the owner's queue of 2026-11-10 morning)
**Version/build:** Conan 3.0.1 build, pack `ba5b348` · **When/context:** tossed by the owner mid-task, 2026-11-10 10:04 +03:00

## The owner's words

`[OWNER]` 2026-11-10 10:04 «и нужно будет вернуть фиолетовый цвет шкал здоровья и выносливости в ХУД, я понял, почему они были фиолетовыми»

## Reading `[AI]` (to be checked against the build's history first)

The purple part of the health and stamina bars is the game's way of showing CORRUPTION (the part of the bar corruption takes away — the HUD line «Здоровье
снижено на 430 HP / 50%»). An earlier change of ours or of a HUD mod's settings (Hosav, `krinik_hud_outline`, KrinikConanGraphics colours) made that part not purple.
First: `git log -S` in the pack for the bar colours and the owner's earlier word that changed them (bug 64 / plan 36 rows), then restore the purple natively.

## Decisions made without the owner

- none yet
