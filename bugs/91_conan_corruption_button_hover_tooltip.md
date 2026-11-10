# Bug 91 — Conan «Хар-ки»: hovering the purple corruption «+» shows a stray «Оскверненные Характеристики» label in mid-screen

**Status:** 🔴 OPEN · **Severity:** S2 · **Fixing:** after the attribute arrows look pass (plan 49 step 2), same screen
**Version/build:** Conan 3.0.1 build, pack `ba5b348` · **When/context:** tossed by the owner mid-task, 2026-11-10 10:04 +03:00, with a crop of the purple diamond «+» right of the
Сила / Живучесть rows

## The owner's words

`[OWNER]` 2026-11-10 10:04 «вот с этим ещё баг будет, наведи на неё курсор, увидишь» (his crop: the purple circle with the diamond «+» — `LevelCorruptionButton`).

## Symptom (seen by the agent before the note)

On frames of 2026-11-10 09:33–09:35 (`attr_plus.jpg`, `attr_plus10.jpg` of the trait-dialog runs) the text «Оскверненные Характеристики» floats at x ≈ 1170–1515,
y ≈ 572 (1080p), over the right perk column, with no plate behind it — the cursor had passed over the corruption button of the Авторитет row.

## Plan

Stand: a hero with a corruption point available (the button shows), «Хар-ки» opened by keys, the real cursor over `LevelCorruptionButton` (`hover-watch.ps1`),
frames; control — our `krinik_hub_controller` off and the KrinikConanUI pak out (rule 24): is the label the game's tooltip drawn without its plate, or ours.

## Decisions made without the owner

- none yet
