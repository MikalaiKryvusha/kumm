# Test cases — the blind quality A/B of the stylometric core (`krinik-stylometry/eval/quality-prep.mjs` + `eval/quality/REVIEWER_BRIEF.md`)

**Created:** 2026-11-18 · **Under test:** the instrument that answers "does the core make the agent's Russian better?" · **Version/build:** core repo HEAD `57605a4` + the two new files
**Test basis:** plan 58 criterion 6 — "an A/B on the same tasks: a text written with the core loaded and applied vs without it, judged blind by a
clean instance against the measure of `MEASURING_RUSSIAN_TEXT.md` and the defect catalogue, the owner's eye last; start from the core's own `eval/`
folder"; `MEASURING_RUSSIAN_TEXT.md` §6 conclusion (each remark tied to a quality, the place quoted, violations counted by class); `BUG_FIXING_FRAMEWORK.md`
→ "A finding is not a finding until verified" (mechanical check before model judgment).

## 1. Goal vector

Achieve: a repeatable, blind count of Russian-language violations per 1000 words for two variants of the same 24 tasks, so "the core helps" becomes a
number with quotes behind it, not an impression.

## 2. Requirements under test

| # | Requirement | Fit criterion |
|---|---|---|
| R1 | WHEN `quality-prep.mjs <v1> <v2>` runs, it shall write one sheet per task with the brief and two texts and no author reference, and a key apart | 24 sheets; `grep -c Эталон` = 0 on every sheet; 12 of 24 pairs flipped |
| R2 | WHEN a verdict record's quote is not in its text or its class is not one of the nine, the tally shall drop it and list it | selftest case; real run lists dropped records |
| R3 | IF a text changed after the sheets were made, THEN the tally shall refuse with exit 1 | control case K1 |
| R4 | The tally shall map A/B to variants through the key, never by letter | selftest case; real run: wins add up to judged pairs minus ties |

## 3. Coverage matrix

| Dimension | Covered | NOT covered (risk) |
|---|---|---|
| Variants | none vs v22 (core 2.2) | the current core (2.2 + 11 catalogue rows of 2026-11-18) — needs a new generation run; v12, v20, v21 |
| Reviewers | two clean instances, odd / even pairs, all six genres each | inter-reviewer agreement on the SAME pair — not measured in this run (risk: one reviewer stricter than the other; both see both variants, so the bias is shared) |
| Quote matching | markup, dash kinds, quote kinds, ё/е, whitespace | a quote spanning a list-item break with a bullet — may be dropped falsely; counted in the dropped list, read by eye |

## 4. Cases

| # | Case (steps → expected) | Technique | Status + evidence |
|---|---|---|---|
| C1 | `node eval/quality-prep.mjs --selftest` → 6/6 | guess + partition | pass — 2026-11-18 10:14, 6/6 |
| C2 | `node eval/quality-prep.mjs none v22` → 24 sheets, 12 flipped, no «Эталон» on a sheet | boundary | pass — 2026-11-18 10:15: «пар: 24 · в обратном порядке: 12»; grep «Эталон» empty |
| C3 | Two reviewers write `verdicts_odd.json`, `verdicts_even.json` (12 keys each) → `--tally none v22` prints wins, violations per 1000 words by class, dropped records | use-case walk | [NOT-TESTED] — reviewers running |
| C4 | Read 5 random kept records against the texts by eye → each is a real violation of its class | error guessing | [NOT-TESTED] |

## 5. Control cases

| # | Control → expected | Status + evidence |
|---|---|---|
| K1 | Append one character to `eval/runs/v22/01_document.md` → `--tally none v22` exits 1 naming `v22:01`; `git checkout` the file → the sha check passes | pass — 2026-11-18 10:25 +03:00: «тексты изменились после подготовки листов: v22:01», exit 1; after the restore the tally stops only at «нет verdicts*.json» (exit 2) |

## 6. Verdict

Pending C3, C4, K1.
