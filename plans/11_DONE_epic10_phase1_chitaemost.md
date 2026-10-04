# Plan 11 — epic 10, phase 1: readability in one pass (Svarog's Dream menus)

> **Created:** 2026-10-04 23:46 +03:00 · **Parent:** `plans/10_EPIC_svarog_menu_beauty.md` — anchor: «1 | **Читаемость за один
> заход:** тёмные полосы списков вместо светлых; осветление цветных слов в тексте (ключевые слова «Помощи»); яркие числа в
> подсказке навыка» · **Status:** ✅ closed 2026-10-04 23:51 — A1–A5 pass (`testcases/reports/2026-10-04_svarog-epic10-phase1-readability.md`) · **Outbound:** frames before → after to the owner

## Goal vector (Achieve)

Text in the Help window, the Almanac lists and the skill tooltip reads at a glance: no light-on-light, no dark-on-dark.

## Acceptance criteria (Scale · Meter · Target)

| # | Where (frame) | Meter | Target | Before |
|---|---|---|---|---|
| A1 | Help section list «Статы…» (m06) | `tools/contrast.py` | ≥ 4.5 | 1.89 |
| A2 | Almanac gods list «Перун…» (m08) | `tools/contrast.py` | ≥ 4.5 | 1.67 |
| A3 | Help → «Навыки», keyword «Навыки» (m07) | `tools/contrast.py` | ≥ 4.5 | 1.24 |
| A4 | Skill tooltip numbers «30», «40» (m14) | `tools/contrast.py` | ≥ 4.5 | 2.26 / 2.13 |
| A5 | Control: Almanac CATEGORY bars stay coloured (phase 3 owns them); quest rows keep their colours | frame by eye | unchanged | — |

## Steps

- [x] 1. `Letters.cs` `Letter()`: grey "White bar" plates (saturation < 0.15) inside a dark window are darkened like buttons
      (`ButtonDarkness`); coloured bars untouched. Anchor: «тёмные полосы списков вместо светлых».
- [x] 2. `Letters.cs` `Letter()`: every TMP text of a dark window gets `KrinikTmpLift` (tag colours lifted on vertices, as in
      dialogues). Anchor: «осветление цветных слов в тексте».
- [x] 3. `KrinikTmpLift`: dark GREY tags (saturation < MinS, e.g. `#6D6D6D`) lift to a light neutral grey instead of being
      skipped — opt-in field, dialogues keep current behaviour. Anchor: «яркие числа в подсказке навыка».
- [x] 4. `Plugin.cs` tooltip styler `Style()`: TMP texts get `KrinikTmpLift` with the grey opt-in. Anchor: same.
- [x] 5. Build, hot reload, reopen windows, frames p1_* of A1–A5, measure, run report `testcases/reports/`, show owner.

Verification is the table above, measured on new frames; control A5 by eye.

## Risks

- (a) Lifting tags in ALL TMP of InfoPanel might brighten intentionally dark text on coloured quest bars → A5 control frame of
  Quests tab.
- (b) Darkening "White bar" could hit the selected-row highlight (game tints the selected bar) → frame with a selected row.
- (c) Hot reload leaves old components → reopen windows after reload (known from bug 17).

## Notes for later phases (found during recon)

- Phase 5: tooltip labels are a TRANSLATION defect — `ManaLbl` = «Мана Стоимость:» wraps to two lines, `CldLbl` = «:» (the
  cooldown label lost its word); fix in the translation file: «Мана:» / «Перезарядка:».

## Decisions made without the owner

- `[AI]` Light list bars are DARKENED (text stays light), not left light with dark text — one dark-paper style per window;
  the sheet offered both, the owner approved the sheet as a whole.
- `[AI]` Saturation threshold 0.3 for "grey bar": between the selected Help row (≈0.20 — darkens too, stays bluish) and the
  lilac «Существа» category (0.39 — keeps its colour until phase 3).
- `[AI]` Lifted grey for tag colours = (0.78, 0.78, 0.75): readable (6.79) yet quieter than the new value, so «30 → 40» keeps
  its "old → new" meaning.

## ✅ STATUS: DONE (2026-10-04 23:51 +03:00)

Hygiene: build without errors. Functional run: Help, Almanac, Quests and the skill tooltip in the owner's game — A1 7.03, A2
6.39, A3 5.68, A4 6.79 / 8.02, A5 colours kept. Report `testcases/reports/2026-10-04_svarog-epic10-phase1-readability.md`;
frames `SvarogsDream/gallery/game/2026-10-04_эпик10-фаза1-читаемость/`. The owner's word on the result — not yet.
