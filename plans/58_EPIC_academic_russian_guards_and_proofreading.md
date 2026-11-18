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
write-gate), the KUIPS mockup strings. Owner-facing: `interviews/*.md`, every `*_ru.md`, `homeworks/`, review pages. Chat and voice: the Stop gate from phase 3.

## Decisions made without the owner

`[AI]`: the order of phases (guards before the proofreading, so the proofreading is checked by them); build strings first in phase 5 (players read them).
