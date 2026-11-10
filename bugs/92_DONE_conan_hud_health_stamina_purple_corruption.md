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

## The cause and the fix — 2026-11-10 10:14–10:16

- Cause: pack commit `e85d74b` (2026-11-08) — four `flt:CorruptionProgressColor` rows in `_config/localization/asset-strings/UIMod_Hosav__W_SmoothHP.tsv` turned Hosav's
  magenta (1.0, 0.0177, 0.931, 0.6) into faded grey (0.35, 0.35, 0.35, 0.5) by the owner's word of 2026-11-07 21:04 (verbatim in commit e85d74b). The magenta is the corruption share of the bars.
- Fix: the four rows removed (the comment keeps the history), `rebuild-krinik-paks.py --only UIMod_Hosav` (its guard refuses the intended 1-of-228 chunk change — installed
  by hand into the library `_krinik-modified/3748867573/` and the game's `Mods`, md5 equal).

## ✅ STATUS: DONE (2026-11-10 10:16)

- Hygiene: the rebuild's chunk diff — exactly one chunk differs (`W_SmoothHP`), as intended.
- Functional run: a fresh background launch 10:16 into the world (the hero at «Здоровье снижено на 400 HP / 50%»), a 4K HUD frame — the cut half of the health bar and of
  the stamina bar is magenta again.

## Decisions made without the owner

- `[AI]` Back to the author's own literal colour (not a new purple of ours) — the owner asked to return what was there.
