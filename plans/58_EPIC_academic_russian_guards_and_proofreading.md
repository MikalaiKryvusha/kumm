# Plan 58 — EPIC: the agent's Russian is academic and free of AI-Claude defects — guards, hooks, a skill, and a proofreading of every text the agent wrote

> **Created:** 2026-11-18 · on the owner's words 2026-11-18 09:00–09:02 (verbatim — `PROJECT_HISTORY.md` entry 2026-11-18 08:11)
> **Parent:** `HOUSE_RULES.md` rules 33 (dash), 35 (academic Russian); `researches/russian-writing/RUSSIAN_RULES.md`; the owner's portrait
> `D:/work/ai_sandbox/krinik_voice/AUTHOR_STYLOMETRY.md` (via `node .kaif/tools/kaif-voice-lint.mjs`)
> **Status:** 🔧 phase 1 started 2026-11-18 09:01 — a helper's web recon of how the Russian-speaking community criticises Claude's / LLM Russian
> **Outbound:** —

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
