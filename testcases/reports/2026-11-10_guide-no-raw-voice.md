# Run report — the rulebook guard `guide-no-raw-voice` and the clean-up of AGENT_GUIDE / HOUSE_RULES / CLAUDE.md

## 1. Work

the guard `tools/hooks/guide-no-raw-voice.mjs` (KAIF #196) against its basis — the rule "the rulebook takes the rule, not the quote"
(`AGENT_GUIDE.md` → "Notes from the human", the thesis-handbook rule; `[OWNER]` 2026-11-10 01:46 · chronicle entry 2026-11-10 01:52). Cases: the
selftest set (16) and the real-event set (7, below).

## 2. Contour

KUMM working tree on the owner's machine (Windows 11, Node 24.15, Git Bash); the real rulebook files; the Claude Code client of this
session with the hook wired in `.claude/settings.local.json` (PreToolUse `Write|Edit|MultiEdit`) and `tools/hooks/pre-commit`.

## 3. Runs

- 2026-11-10 01:51 — `node tools/hooks/guide-no-raw-voice.mjs --check AGENT_GUIDE.md` on the guide BEFORE the clean-up → exit 1, 32 lines (the broken version).
- 01:55 — `--check HOUSE_RULES.md CLAUDE.md` before their clean-up → 66 + 1 lines.
- 01:59 — after the judge's fixes: `node tools/hooks/guide-no-raw-voice.mjs --selftest` → 16 checks, 0 failed; real events
  `node <scratchpad>/hook-cases.mjs` → 7/7 pass; `--check AGENT_GUIDE.md HOUSE_RULES.md CLAUDE.md` → clean, 3 files; `sh -n tools/hooks/pre-commit` → ok.
- ≈02:00 — the live client: a real `Edit` of `AGENT_GUIDE.md` adding the Russian line «Проверка стража» → REFUSED by the client with the guard's message
  (`new text:1165: Russian text (the owner's voice)`); the file unchanged.

## 4. Checks

Hygiene: selftest 43/43 after round 6 (16/16 after round 1: Cyrillic line; quote right after the tag; quote after a date; single quote; the creed marker named in prose does not open an
  exemption; creed block exempt; provenance line clean; `verbatim-ok` comment exempt; a bare `verbatim-ok:` word not; an edit inside the creed and a
  clean-up edit are not new hits; a new Russian line is; paths — case-folded, this repository only); `sh -n` of the pre-commit hook.
Functional run: the real PreToolUse events on the real files — a Russian line added to the guide → exit 2 (pass); an English quote under
  `[OWNER]` with a date → 2 (pass); an Edit inside the creed → 0 (pass); an English rule with a provenance line → 0 (pass); a Write of another
  project's `AGENT_GUIDE.md` → 0 (pass); a Write of `HOUSE_RULES.md` with a Russian line → 2 (pass); broken JSON → 0 (pass). The live client refused a
  real Edit (read: the refusal text). The pre-commit door is exercised by the commit of this work.

## 5. Found

- The first version (judge round 1, 8 findings, all confirmed by re-running the inputs): a quote after a date passed; a prose mention of the creed
  marker exempted the rest of the file; an Edit inside the creed was refused; any `AGENT_GUIDE.md` in any folder was judged and a lower-case name
  escaped; `--staged` without `-z` let a quoted non-ASCII path escape; the header claimed NOT YET; a guard crash was reported as a finding; a bare
  `verbatim-ok:` word exempted a line. All fixed; the selftest grew a case for each.
- The client printed the file name in lower case — fixed (display keeps the case, the comparison folds it).
- Rounds 2–6 (each finding re-run by its input before fixing): an injected creed-marker pair and a widened creed switched the guard off → the creed exemption removed
  from the hook and the staged gate (judging by difference makes it unnecessary); quotes before the tag, after a dash/colon, in closing curly or ASCII single quotes,
  wrapped onto the next line or in an attribution line under a blockquote → caught; an apostrophe was a false quote → not any more; `verbatim-ok` covering a quote or a
  Russian `[OWNER]` line, or with an empty reason → no longer an exception; a lone CR glued lines → split on CR too; a cp1251 / UTF-16 write passed `--staged` as
  replacement characters → "not UTF-8" is a finding (proven in a throwaway repo: PowerShell `Add-Content` of a Russian word → `--staged` exit 1); trailing-dot and
  `::$DATA` paths; a missing guard script reported as a finding → exit 3 path. Accepted as GAP (declared in the header): English words of the owner without quotes,
  a backtick wrapper, a quote without the tag, deliberate `verbatim-ok` on voice.
- Rulebook content cross-check (a separate reviewer, old vs new text): no rule lost a step, number, path or rule number; data strings (scan patterns of rule 14, the
  banned heading of rule 22, tool output lines of rules 9 and 30, the task name of rule 28, the README section name) and two provenance times were restored.

## 6. Traces

this report; the guard's header (`@guard` block); the chronicle entries 2026-11-10 01:52 and 01:55 (the removed passages, verbatim).

## 7. Verdict

pass — the guard refuses new raw voice on the real path (the live client, a staged commit in a throwaway repo) and lets the creed, the provenance lines and
clean-ups through; the review rounds are counted in the commit message.
