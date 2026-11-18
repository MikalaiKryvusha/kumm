# Plan 58 — EPIC: the agent's Russian is academic and free of AI-Claude defects — guards, hooks, a skill, and a proofreading of every text the agent wrote

> **Created:** 2026-11-18 · on the owner's words 2026-11-18 09:00–09:02 (verbatim — `PROJECT_HISTORY.md` entry 2026-11-18 08:11)
> **Parent:** `HOUSE_RULES.md` rules 33 (dash), 35 (academic Russian); `researches/russian-writing/RUSSIAN_RULES.md`; the owner's portrait
> `D:/work/ai_sandbox/krinik_voice/AUTHOR_STYLOMETRY.md` (via `node .kaif/tools/kaif-voice-lint.mjs`)
> **Status:** 🔧 phase 1 DONE 2026-11-18 09:23 — `researches/russian-writing/AI_RUSSIAN_DEFECTS.md` (42 defects, 28 sources) and
> `MEASURING_RUSSIAN_TEXT.md` (Головин's communicative qualities, ФИПИ violation counts, readability for Russian, coherence); phases 2–3 STARTED 09:2x —
> the core's §8 + 11 rows from the catalogue, its own gate fixed (CRLF: 66 false lint-core findings → 0, selftest 17/17; core `2b99012` pushed),
> KAIF reads the KUMM clone of the core; the Stop hook `tools/hooks/ru-reply-check.mjs` (selftest 5/5, wired in `.claude/settings.local.json`).
> Next: a write gate for the build's text files; the measure from `MEASURING_RUSSIAN_TEXT.md` (violation classes, completeness, coherence) into a
> clean-reviewer brief; ru-text (MIT, model-applied skill) as the reviewer's reference; the A/B on the core's `eval/`; phase 5 proofreading.
> **Outbound:** —

## The first blind quality A/B (2026-11-18 10:28 +03:00) — criterion 6, run 1

Instrument: `krinik-stylometry/eval/quality/REVIEWER_BRIEF.md` (nine classes after Головин incl. completeness and coherence, ФИПИ-style counts, every record
quotes its place) + `eval/quality-prep.mjs` (blind sheets without the author's reference, key apart, sha freeze, quotes checked by script); TC
`testcases/TC_core_quality_ab_2026-11-18.md`. Run: none (no core) vs v22 (texts of 2026-09-25 written by «core 2.2 under test»), 24 tasks, two clean
reviewers (odd / even pairs, all six genres each). All 110 records (57 + 53) kept: every quote found in its text, also under the stricter checks of
the judged instrument (whole words, 3–12 words, typography matched without folding dashes and quotes). Corrected 2026-11-18 10:42 +03:00: this line said «141 quotes» at
10:28 (and so did the body of KUMM commit `64acdc7`); the reviewers' own totals are 57 and 53.

Numbers by the judged instrument (2026-11-18 10:42 +03:00; list numbers are no longer counted as words, so the per-1000 values moved by ≤ 0.2 against the 10:28 draft):

| Measure | none | v22 |
|---|---|---|
| Pairs judged better | 18 | 5 (1 tie) |
| Violations per 1000 words, all | 5.82 (22 / 3782) | 23.99 (88 / 3668) |
| Typography (hyphen for the dash, straight quotes) | 0 | 69 |
| Violations per 1000 words without typography | 5.82 (22) | 5.18 (19) |
| Completeness (полнота) | 10 | 4 |
| Coherence (связность) | 3 | 0 |
| Correctness (правильность) without typography | 4 | 12 («Так» = «например» without a comma ×5, status lines without a full stop ×3, …) |
| Seams of the current §8, per 1000 words (machine) | 8.20 | 0 |

Reading: (1) the typography loss belongs to the tested draft, not to the current core: «core 2.2 under test» carried ГЛ15 / ГЛ16 (write the author's
hyphen and straight quotes), the owner removed them the same day (core journal 2026-09-25, interview 039), and the stand's texts were never regenerated;
(2) without typography the variants are close (5.18 vs 5.82), the core cuts incomplete phrases (4 vs 10) and loses on punctuation; (3) both reviewers
named obtrusive repetition of nouns and terms in the core's texts as a reason for the verdict, every time on the v22 side (sheets 01, 05 · 02, 04; checked
against the key; repetition is not one of the nine classes) — a candidate side effect of the
§8 row against «тот же» («name the thing again»). Next: regenerate the 24 texts with the CURRENT core and repeat the A/B (run 2: `none_1118` written
2026-11-18 10:42 +03:00, `core_1118` in progress); the brief has a typography class of its own since 2026-11-18 10:42 +03:00.

## Goal vector (Avoid + Achieve)

Avoid: a Russian line of the agent — in the build, in a document for the owner, in the chat or the voice — that a Russian reader recognises as a neural
network's (calques of English syntax, telegraphic dashes, bureaucratese, the "not just X but Y" frame, filler, false enthusiasm, wrong collocations).
Achieve: three languages held by code and procedure, not by memory — academic strict Russian (every agent text), the absence of AI-Claude defects (every agent
text), the owner's voice by his portrait (every text of the build and every text he signs).

## Acceptance criteria

1. A catalogue of defects with sources exists: `researches/russian-writing/AI_RUSSIAN_DEFECTS.md` (each defect: example, why, fix).
2. A lint finds every machine-detectable defect of the catalogue: `python tools/ru_ai_lint.py <files>` (name to settle in phase 2) exits 1 on a hit; its
   self-test reddens on a fixture of each class and stays green on the norm's legal forms (two nominatives, direct speech, ranges).
3. Hooks: a PreToolUse hook refuses a Write / Edit of Russian text into the build's text files with a lint hit; a Stop hook reads the agent's last chat reply
   and refuses to stop on a hit (as `tools/hooks/no-permission-question.mjs` does), with a declared exception marker on the line.
4. A skill (`/academic-russian`, name to settle) walks the writing steps: portrait load → write → lint → clean-instance read → fix → show.
5. Every Russian text the agent wrote is inventoried (a table: file · author · audience · lines) and proofread; the lint is 0 on all of them or every kept
   line is in the allow list with its class; each proofread surface is seen in its real place (game, launcher window, PDF).

6. **The owner's stylometric core works** (the owner 09:05–09:06: it exists, the agent «uses» it, and it does not help — «проект стилометрического ядра
   пока что НЕ РАБОТАЕТ»). Facts of 2026-11-18: the core was not loaded once in this chat; `kaif-voice-lint check` reads files only, so no chat reply is ever
   checked; the portrait is a large prose document (87 KB) that a model follows poorly at the moment of writing. Fit: the core yields a compact set of
   machine-checkable rules that the write and Stop hooks of phase 3 apply to files AND to every chat reply; Scale — the owner's remarks about the agent's
   language per working day and lint hits per reply; Meter — the chronicle and the Stop hook's log; Target — both fall over the next working days.
   The core is cloned into `KUMM/krinik-stylometry/` (private repo `MikalaiKryvusha/krinik-stylometry`, git-ignored by KUMM; the owner 09:05 «ПРАВИТЬ И
   ДОРАБАТЫВАТЬ ЕГО»): its edits are committed and pushed in its own repository.
   **The core's purpose** (the owner 09:06): without the core the agent writes Russian badly, with it the agent must write beautifully. Check — an A/B on the
   same tasks: a text written with the core loaded and applied vs without it, judged blind by a clean instance against the measure of
   `MEASURING_RUSSIAN_TEXT.md` and the defect catalogue, the owner's eye last; start from the core's own `eval/` folder.

## Phases and gates

| Phase | What | Gate |
|---|---|---|
| 1 | Recon: the community's complaints, the editors' rules, the norm (Розенталь, Нора Галь, Ильяхов); merge into `RUSSIAN_RULES.md` | catalogue + method updated |
| 2 | The lint with self-test (classes from the catalogue; dash_lint's parser reused for build files) | self-test red / green per class |
| 3 | Hooks: write gate for build text files, Stop gate for the chat reply; wired in `.claude/settings.local.json`; `tools/test-guards.mjs` part | guards proven red on fixtures |
| 4 | The skill (steps, commands, exit conditions) | one real text written through it |
| 5 | Inventory of every agent-written Russian text and the proofreading, surface by surface (build strings first: launcher, report tool, hub, guide, README; then translations; then interviews and `_ru.md` copies) | lint 0 / allow list; seen in place |

## Inventory seeds (to complete in phase 5)

Build: `KrinikConanLauncher.cs` strings, `collect_report.ps1`, `feedback_howto.txt`, `krinik_mod_settings.lua`, `guide-3.1.1.html`, `README.template.md`,
`dm-fish-ru.tsv` (plan 56 pass 3), `asset-strings/*.tsv`, `eot-perks-ru.tsv`, `il-event-phrases-ru.tsv`, the Hosav table (interviews 002 / 003 — owner-accepted,
write-gate), the KUIPS mockup strings. **First material** (the owner 09:03, chronicle): the agent's chat messages of 2026-11-18 — a clean instance lists every
wrong phrase (incomplete, illogical, calqued, internal jargon, tautology, cliché, typo) with a correction; the patterns feed the lint and the Stop hook.
**The measure comes from the authorities, not from the owner's examples** (the owner 09:04: his five words of 09:03 were a direction, the measure is to be
found on the web): recon `researches/russian-writing/MEASURING_RUSSIAN_TEXT.md` (communicative qualities of speech after Б. Н. Головин, readability indices
adapted to Russian, editors' tools, coherence, norms of instructions and interface text); corrected 09:05 — at 09:04 this line wrongly called his examples «the measure». Owner-facing: `interviews/*.md`, every `*_ru.md`, `homeworks/`, review pages. Chat and voice: the Stop gate from phase 3.

## Decisions made without the owner

`[AI]`: the order of phases (guards before the proofreading, so the proofreading is checked by them); build strings first in phase 5 (players read them).
