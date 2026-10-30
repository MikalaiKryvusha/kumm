# Research — token economy for a coding agent: a portable methodology

> **Created:** 2026-10-30 · **Parent:** the owner's order to write a token-saving methodology as a plain md guide for other agents (asked
> earlier, not written then — written 2026-10-30) · **Status:** written from KUMM's own measurements and incidents up to 2026-10-30 ·
> **Outbound:** a copy on the owner's desktop for hand-over to other agents

**What this is.** Rules an agent follows so that a long working chat does not burn its context window on reading, dumps and
repetition. Every rule below was paid for in this project (KUMM, Claude Code, Opus 5.5 with a 1M window) — the numbers are
measurements, not estimates. Read it once at the start of a project; the steps are written so that any agent can follow them.

## 1. Know the cost before you pay it

1. **Measure what a session entry costs.** Context = `input_tokens + cache_read_input_tokens + cache_creation_input_tokens` of
   the last main-session answer in the transcript `usage`. KUMM's `/resume` ritual measured 64 k → 181 k = **117 k tokens**
   (2026-10-29); the canon alone is ≈ 89 k (`node .kaif/kaif-core.mjs check` → `ℹ entry cost`).
2. **Watch the window with a hook, not by feel.** Install `context-budget` (source: `D:\skill.md`; KUMM copy
   `.claude/hooks/context-budget.mjs`): at 70 % — start nothing big; at 75 % — finish to a clean cut and close the chat with a
   handover; at 85 % — close now. Set `CONTEXT_BUDGET_WINDOW` to the real window (200 000 or 1 000 000) — a wrong window makes
   the hook silent forever.
3. **Close the chat before auto-compaction.** A compaction mid-task is an expensive summary that loses detail; a closed chat with a
   handover costs a fraction and loses nothing.

## 2. Read the slice, not the file

1. **Search first, then read the lines found.** `Grep` with `-n` → `Read` with `offset`/`limit`. A 1 228-line guide is ≈ 37 k tokens
   (it hit the 25 k read cap in one call); the section you need is 30 lines.
2. **Grep journals by tag, never read them whole.** An experience log of 4 360 lines or a chronicle of 5 035 lines is history:
   `grep -n "<tag>" EXPERIENCE.md`, then read the hit and its neighbours.
3. **Never read a transcript or a subagent output file directly.** A chat transcript is a JSONL of 2–20 MB (the previous chat:
   19.7 MB). Extract with a script that prints only what you need (`node -e` that filters records and prints 300 characters).
4. **Narrow the search path.** A glob over a whole work drive timed out after 20 s and returned nothing; name the project folder.

## 3. Keep command output small

1. **Every shell command ends with a limiter:** `| head -20`, `| tail -5`, `grep -c`, `wc -l`, `--stat`. A test suite prints only
   its failures and the final count (`grep -E "^FAIL|as expected"`).
2. **Ask a tool for the answer, not the data.** "Which files changed" → `git diff --stat`; "does it parse" → exit code; "how big"
   → one number.
3. **Long runs go to the background** and you read their result once when they finish. Never poll a log in a waiting loop — each
   poll re-reads the same lines into the context.

## 4. Delegate the reading, keep the conclusion

1. **Hand a wide search to a subagent** and receive its report, not its file dumps. 2026-10-30: a web recon cost the subagent 86 k
   tokens and 19 tool calls; the main chat received a 40-line report.
2. **Write the brief so the report is the answer:** goal, what is ruled out, where to look, the output format and a length cap,
   "say what you could not confirm".
3. **At most two helpers at a time**; cut big work into pieces and queue them. Do not repeat a delegated search yourself.

## 5. Make the documents cheap to read

1. **Documents the agent reads are in English** — the project's check counts ≈ 2.5 ASCII characters per token against ≈ 1.9 for
   Cyrillic, and models read English more reliably. The chat with the owner stays in his language.
2. **A status file is a summary of NOW, ≈ 200 lines.** Closed work moves verbatim into the chronicle; the status keeps pointers.
3. **Rules are statements, without rationale or history.** The "why" and the owner's verbatim words live in the chronicle; the
   rulebook the agent re-reads carries only what to do (KUMM `HOUSE_RULES.md`: 100 lines after the compaction of 2026-10-28).
4. **One fact in one place.** A copy costs tokens on every read and drifts; link to the one place instead.

## 6. Carry the handover in a file, not in a paste

1. **The closing message of a chat is captured by a Stop hook** into `FAREWELL_MESSAGE_FROM_THE_PREVIOUS_CHAT.md` (KUMM
   `tools/hooks/farewell-capture.mjs`: only the turn that ran the closing skill; the file is replaced whole, git-ignored).
2. **The next chat's first `/resume` reads that file** instead of the owner pasting it. The owner stops copying; the agent reads one
   short, fresh summary first.

## 7. Pictures and logs

1. **Images are WebP, downscaled to what the eye needs** (a frame sheet at 960 px width, not a 4K PNG). In a long chat images stop
   being readable — show variants to the owner instead of judging by eye.
2. **Logs: check the file time, then grep for the subsystem** — never `cat` a log.

## Checklist before each expensive step

- [ ] Do I need the whole file, or a grep hit and 30 lines around it?
- [ ] Does this command end with a limiter?
- [ ] Is this a wide search a subagent should do, returning only the conclusion?
- [ ] Is the context above 70 %? Then nothing big starts; above 75 % — close the chat with a handover.
