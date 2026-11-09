# KAIF bug 31 — the canon never states WHAT `AGENT_GUIDE.md` is, so the guide turns into a chronicle, a cheat sheet and a dump of the owner's raw messages — again, after #89

**Severity:** S2 (the re-read core document the agent reads before every task grows into noise; the owner had to stop the work and order a clean-up) ·
**Version:** KAIF 2.9, `framework/` template of `AGENT_GUIDE.md` (its header, "Authorship of a decision", "Notes from the human"), no guard ·
**When:** 2026-11-10 01:46 +03:00, KUMM (Conan build, a /dayloop)
**Related:** #89 (closed — added "The rulebook takes the rule, not the quote"), #184 (open — move verbatim owner words to provenance files)
**Delivered upstream:** https://github.com/MikalaiKryvusha/KAIF/issues/196

## Symptom

At 01:41–01:43 the owner gave a working rule in chat (code goes to an independent judge in rounds). The agent wrote it into `AGENT_GUIDE.md` → "Notes from the
human" as a rule WITH a paragraph of seven of the owner's raw chat lines. The owner selected the paragraph and answered (verbatim, Russian):
«вычиститт нахуй AGENT_GUIDE от сырого голоса пользователя !!!» · «КАИФ ДОЛЖЕН ТЕБЕ УСТАНАВЛИВАТЬ, ЧТО AGENT_GUID - тезисная методичка истин и логоворенностий,
инструкций, правил и ограничений по проекту» · «а не летопись» · «и не бесконечная шпоргалка» · «и не свалка сырых собщений пользователя» · «можешь в апстим КАИФ
баг поднять, что до сох пор КАИФ тебе это ясно не пояснял, и ты превратил этот документ в свалку».

The state of the document that day: 1 251 lines, 12 `[OWNER]` tags, 24 «…» Russian quotations, several field-incident stories told in prose (dates, file sizes,
who did what) — a chronicle inside the canon.

The owner then asked (01:47): «неужели нигде про это не сказано тебе в КАИФ?» — the honest answer: it IS said, in pieces, and the agent broke it anyway —
"The rulebook takes the rule, not the quote" (the guide, ~line 1 100); KUMM `HOUSE_RULES.md` rule 3 ("no rationale, no history, no quotes"); `STATUS.md`'s
"a summary, not a chronicle". What is NOT said anywhere is the identity of `AGENT_GUIDE.md` itself, and nothing guards it — a rule the agent knows and
still breaks is a missing guardrail, not a missing rule.

## Why it recurs after #89

1. **The document's identity is stated nowhere.** The template opens with "the canon of the project: the rules, the map, the commands, the conventions" —
   it says what the guide HOLDS, never what it is NOT. "Not a chronicle, not a cheat sheet, not a dump of the owner's messages" is the missing sentence.
2. **#89's cure is a bullet deep inside "Authorship of a decision"** (~line 1 100 of 1 250). The agent writing a new rule into "Notes from the human" never
   passes it; and the same section opens by demanding `[OWNER] "<verbatim>" · <date>` — which reads as "quote him".
3. **The template models the defect itself.** Its own sections carry field stories in prose (the 2026-09-08 binary overwrite, the 2026-09-12 log leak), and
   its "Notes from the human" skeleton invites the owner's words as content. An agent imitates the document it edits.
4. **No guard.** Nothing counts verbatim quotes or chronicle prose in the guide; the budget warning (lines) does not see WHAT grows.

## Expected

- The guide's first block states its identity as a rule: a thesis handbook of the project's truths, agreements, instructions, rules and constraints;
  never a chronicle (history → `PROJECT_HISTORY.md`), never a cheat sheet of recipes (→ `HOUSE_RULES*.md`, `researches/`), never a store of the owner's
  messages (verbatim → the chronicle or the interview; the guide keeps one provenance line `[OWNER] <date> · <where the verbatim lives>`).
- "Authorship of a decision" says the verbatim lives at the SOURCE (chat → chronicle entry, interview), and the canon carries only its address.
- A guard: `kaif-core check` (or the attribution lint) reddens on a «…» / "…" quotation of the owner and on a dated incident story inside `AGENT_GUIDE.md`,
  with a declared-exception marker; proven red on a guide with one pasted quote.
- The shipped template's field stories move to `KAIF_REFERENCE.md` §17 (where "why a rule exists" already lives).

## Local remediation

KUMM 2026-11-10: the owner's verbatim words moved out of `AGENT_GUIDE.md` into a `PROJECT_HISTORY.md` entry (verbatim, nothing lost); each rule kept as a
statement + one provenance line; field stories of the project's own sections cut to the rule; the identity block added at the top of the guide;
twins swept (`HOUSE_RULES.md`, `CLAUDE.md`). Guard — a local check (see the KUMM commit of this ticket).
