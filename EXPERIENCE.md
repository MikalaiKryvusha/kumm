# EXPERIENCE — the agent's accumulated experience

> The agent's growing log of lessons. **Externalized memory of *what works and what doesn't*** — so a
> fresh, context-less session (or an autonomous loop) never repeats a dead end. Consult it BEFORE a task;
> append to it AFTER a meaningful attempt (success **or** failure). Grep, don't scroll.
>
> **Tags live inline on every entry** (not in a central list) — so one grep finds the experiences directly:
> `grep '#loop' EXPERIENCE.md` · `grep -i '#context\|#build' EXPERIENCE.md` · `grep '❌' -A4 EXPERIENCE.md`
> · `grep 'EXP-0007' EXPERIENCE.md`. Reuse an existing tag where one fits (grep to see what's in use).
>
> **Entry format (keep it short and grep-friendly).** Newest on top. Every entry starts with a stable id,
> an ISO date, an outcome marker (`✅` / `❌` / `❌→✅`), and inline `#tags`:
>
> ```
> ### EXP-0001 · 2026-01-01 · ✅ · #tag #area
> **Context:** one line — what was being done.
> **Tried / did:** the approach, briefly.
> **Result:** ✅/❌ — what happened.
> **Lesson:** the reusable takeaway (the reason this entry exists).   → link: bugs/NN · ideas/NN · plans/NN
> **Repro:** the ready-to-run command/check that verifies or applies the lesson — a weak session
>   executes a pasted command reliably, an essay it won't act on. REQUIRED since 2.1: a lesson
>   with no Repro line is not accepted (field-proven: lessons with a Repro command get executed,
>   essay-lessons get read and ignored). If the lesson genuinely has no command, say what to
>   OBSERVE instead — but say it as an action.
> **Trigger:** for class-level lessons — the decision point that must invoke this lesson, as
>   "writing X → run Y" (the lesson names WHERE it applies, instead of hoping to be remembered).
> **Not for:** the lesson's validity range — where it does NOT apply. A documented lesson is still a
>   hypothesis; applied outside its range it kills good ideas.
> ```
>
> **A lesson that repeats is a lesson that failed as text.** When the same class recurs in NEW code
> after its entry was recorded, the journal has proven insufficient — the lesson MUST become
> executable (a linter rule, a guard, a gate), and the entry gains the line
> `mechanized: <the tool>`. Two strikes → a mechanism, never a third reminder.
>
> The `#tags` are **trigger-tags**: before a task, grep by the task's tags and QUOTE the relevant
> lessons in your report (id + one line) — or state "no relevant lessons". An unquoted recall is
> unverifiable; `/fable-judge` checks for this line.
>
> Skill: `/experience` (capture a lesson · recall relevant lessons).

## Entries

### EXP-0003 · 2026-08-15 · ✅ · #kaif #gates #placeholders
**Context:** KAIF 2.2 adaptation — the `placeholders` item lists only `.claude/` paths, but the gate
behind `checkpoint placeholders` also scans the four mirrored agent systems and the DECLARED sphere
library (`kaif-core.mjs:1355` `scanPlaceholders`).
**Tried / did:** grepped the whole tree for the placeholder strings instead of trusting the item's list,
filled all five agent systems, then hit the refusal on `.kaif/spheres/programming.md` and filled that too.
**Result:** ✅ — one refused checkpoint, then clean.
**Lesson:** the sphere library becomes a scanned surface only once `sphere <name>` is recorded. Record
the sphere EARLY: the refusal then lands on the placeholders item, where it is obvious, instead of at
`verify-final`, where it looks like a final-gate failure. Editing the `.agents/.grok/.cline/.roo` mirrors
by hand is safe but pointless — checkpoints re-sync them from the `.claude/` canon.   → link: upstream issue #3
**Repro:** `node .kaif/kaif-core.mjs checkpoint placeholders` — it prints every offending file by path.
**Trigger:** filling any KAIF placeholder → grep the tree for the literal, do not trust the item's list.
**Not for:** foreign sphere libraries — their template slots are intentional and are not scanned.

### EXP-0002 · 2026-08-15 · ❌→✅ · #shell #windows #crossshell
**Context:** comparing the pre-install `package.json` against the current one during the judge pass.
**Tried / did:** `git show HEAD:package.json > /tmp/pkg-old.json` in Git Bash, then read it from Windows Node.
**Result:** ❌ — `ENOENT: open 'D:\tmp\pkg-old.json'`. Git Bash's `/tmp` is not a path Windows Node can
resolve; the redirect succeeded and the read failed, so the failure surfaced one step late.
**Lesson:** the two shells are different worlds (`AGENT_GUIDE.md` → Environment dossier). Any file handed
from a Bash command to a Windows program needs a Windows-resolvable path — use the session scratchpad,
never `/tmp`.   → link: AGENT_GUIDE.md → "Document & text hygiene", face 4
**Repro:** `bash -c 'echo hi > /tmp/x'; node -e "require('fs').readFileSync('/tmp/x')"` → ENOENT.
**Trigger:** writing a file in one shell and reading it in another → use an absolute Windows path.
**Not for:** files created and consumed inside the SAME shell.

### EXP-0001 · 2026-01-01 · ✅ · #example #meta
**Context:** first task after KAIF was deployed into this project (example entry — replace with real ones).
**Tried / did:** wrote the first real lesson here in the canonical format.
**Result:** ✅ — the experience log is live and greppable.
**Lesson:** capture lessons at the level of *approach* (what worked / what to avoid), not defect detail
(that lives in `bugs/`); one short entry beats a long story.   → link: (none)
