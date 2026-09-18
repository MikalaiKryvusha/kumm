# KAIF bug: "rename anchor not found on disk … the section arrives as new" — the section does NOT arrive, its upstream delta is dropped silently and never enters the update task

kaif-fp: machinery `update` / `install` (bootstrap) · rename map `renamesByVersion` :: upstream-delta-lost-silently :: v2.7
**Delivered upstream:** https://github.com/MikalaiKryvusha/KAIF/issues/72
**Autocapture** (from `.kaif/kaif.json` + update receipt): KAIF 2.7 (updated 2.5 → 2.7, route `bootstrap`,
2026-09-18T17:59:31+03:00) · project KUMM · sphere `programming` · language `ru` (language pack, not
i18n-translated) · tracking `origin` · agent system claude-code · OS Windows 11 Pro 10.0.26200 · Node v24.15.0
**Dedup attestation:** searched `bugs/KAIF/` (`grep -ril 'rename' bugs/KAIF/` → one hit,
`02_terminology_baton_should_be_handover.md` — the ticket that ASKED for this guard; related, not a
duplicate) and origin issues (`gh issue list --repo MikalaiKryvusha/KAIF --state all --search "rename anchor"`
→ #57 closed, #25 a field report; `--search "renamed heading arrives as new"` → nothing). No match found.

Severity by the ladder: **S2** — no data of the owner lost, but two obligations of the closing rituals
would have been absent from this deployment for a whole interval with every gate green.

## Expected per canon

The 2.7 update task, item `policy-changes`, verbatim:

> `update` applies a declared pair as ONE module: untouched → replaced under the new heading with a
> `renamed: <path> :: <old> → <new>` line in the log, edited → your text kept with ONE heading and a task
> item that names the rename and carries the diff, **an old anchor that is not on disk → a log line by name**.

And the log line itself promises a delivery:

> `⚠ rename anchor not found on disk: … (upstream renamed it to …; the section arrives as new)`

So for an absent old anchor the reader expects: the log line **and** the new section's content on disk
(or, where the new heading already exists with local text, a `merge-modules` item carrying the diff).

## Got in the field

This tree had ALREADY renamed the two headings by hand on 2026-09-09 — that was the "Local remediation"
of ticket 02 / origin #57 (`baton` → `handover`, the very rename 2.7 ships). So on disk the OLD anchor is
absent and the NEW heading is present, with the 2.5 body under it. The pass said:

```
⚠ rename anchor not found on disk: .claude/skills/end-chat-force/SKILL.md :: ## Step 1. The baton — only what must not be lost (upstream renamed it to ## Step 1. The handover — only what must not be lost; the section arrives as new)
↻ merged 1 module(s) into .claude/skills/end-chat-force/SKILL.md
⚠ rename anchor not found on disk: .claude/skills/end-chat-soft/SKILL.md :: ### Step 1. Record status & the baton in STATUS.md (upstream renamed it to ### Step 1. Record status & the handover in STATUS.md; the section arrives as new)
```

What actually happened, measured in a `git archive` sandbox copy right after the pass, before any hand merge:

```
$ git diff --cached --stat -- .claude/skills/end-chat-soft/SKILL.md
(empty — the pass did not modify the file at all)
gate-budgets          in the passed end-chat-soft: 0 | in the 2.7 template: 1
kaif-experience-lint  in the passed end-chat-soft: 0 | in the 2.7 template: 1
"standing falsehood line" in the passed end-chat-force: 0 | in the 2.7 template: 1
$ grep -c 'Step 1. Record status\|Step 1. The handover' KAIF_UPDATE_TASK.md
0
```

The 2.7 content of those two modules that never reached the tree:

- `/end-chat-soft` Step 1 — the `node .kaif/tools/kaif-experience-lint.mjs check` run (epic EL, #69), the
  reworded pairs-registry sentence, and the whole block "Then the budget DOOR — after the trim" with
  `node .kaif/kaif-core.mjs check --gate-budgets` (epic CB, #71): net +20 lines (the file goes 98 → 124
  lines by the merge tool's count, +6 of them in Step 5, which the task DID carry).
- `/end-chat-force` Step 1 — the bullet "The standing falsehood line" (epic SF, #67): +5 lines (56 → 61).

Nothing named them afterwards: the task's `merge-modules` item lists `end-chat-soft (1)` — that is Step 5 —
and does not list `end-chat-force` at all; `check` is green; `update-verify` judges "promised upstream
lines" only for modules that HAVE a diff in the task, so it cannot see a module the task never carried.
The loss was found only because this session diffed every deployed file against the extracted 2.7 bundle.

## Repro (deterministic)

1. Take any 2.5 deployment, `git archive HEAD | tar -x -C <sandbox>`, `git init` there.
2. In the sandbox rename the two headings by hand, bodies untouched:
   `## Step 1. The baton — only what must not be lost` → `## Step 1. The handover — only what must not be lost`
   (`.claude/skills/end-chat-force/SKILL.md`) and `### Step 1. Record status & the baton in STATUS.md` →
   `### Step 1. Record status & the handover in STATUS.md` (`.claude/skills/end-chat-soft/SKILL.md`). Commit.
3. Bootstrap to 2.7: `node KAIF-LOADER.mjs --lang <code> --source <v2.7 assets dir>`.
4. `grep -c 'gate-budgets' .claude/skills/end-chat-soft/SKILL.md` → `0`; `grep -c 'Step 1' KAIF_UPDATE_TASK.md`
   (minus the policy prose) → no module item. Exit code 0, log says "the section arrives as new".

## Cost and violated invariant

Cost here: ≈ 25 minutes (a full template sweep and a hand merge of two modules). Near-miss cost: a
deployment whose `/end-chat-soft` never runs the experience lint nor the budget door, and whose
`/end-chat-force` never asks for the standing falsehood — three 2.7 obligations silently absent, with
`check` and `update-verify` green. Violated invariants: **honest-green** (a green pass over a lost delta)
and **owner-work-safety** in its weak form (the local remediation the canon itself ordered in the
"defect in KAIF itself" contour, step 2, is exactly what triggers the loss).

## What in KAIF led to this

Read in the deployed 2.7 core, `.kaif/kaif-core.mjs` → `mergeModules` (function at line 1369). The rename
pair binds only when the OLD signature is on disk:

```js
for (const [o, n] of declared) if (onDisk.has(o) && !renameFrom.has(n)) { renameTo.set(o, n); renameFrom.set(n, o); }
// …"A declared rename whose OLD heading is nowhere on disk: the owner removed or translated that section.
//   …the new module takes the ordinary 'new in this release' road."
const renameMissing = declared.filter(([, n]) => !renameFrom.has(n))…
```

The comment names two causes — removed or translated — and misses the third: **the owner already
renamed it**. Then the disk module carries the NEW signature, and the per-module loop looks it up with
`const oldE = oldBySig.get(dm.signature)` → `undefined` (the old map knows that module only under the
OLD heading) while `newM = newBySig.get(dm.signature)` is found. In the "not untouched" branch every
arm that would make a task item needs `oldE` or `renamedTo`:

```js
if (newM && dSha === normSha(newFilled)) { /* already the new template */ }
else if (renamedTo && newM) …            // renamedTo is undefined — the old anchor is not on disk
else if (oldE && newM && …) …            // oldE is undefined
else if (oldE && !newM) …                // oldE is undefined
```

so the module falls through as "a module the deploy never shipped (owner-added section) — keep", with
no `divergedList` entry, hence no task item; and the "new in this release" insertion is skipped because
that signature is already on disk. The case "old anchor absent AND new anchor present" is a third state
the branch does not have — and the most likely one in the field, because the "defect in KAIF itself"
contour orders the local fix FIRST, and the local fix of a naming ticket is the rename.

Suggested fix, smallest first: for a declared pair `[o, n]` with `!onDisk.has(o) && onDisk.has(n)`, bind
`oldE = oldBySig.get(o)` for the disk module `n` and let the ordinary classification run (body equal to
the old template → replaced; edited → the "carries local edits AND upstream changed it" item with the
diff). And change the log sentence — "arrives as new" is a claim the code does not keep in this state.
Independently: let `update-verify` compare every deployed module that has a shipped signature against
the new template, not only the modules the task carried.

## Local remediation (per the "defect in KAIF itself" contour, if applied)

Applied 2026-09-18: both modules merged by hand to "2.7 template + this project's fills" with a script
that refuses unfilled placeholders and is idempotent (second run prints `=` for all seven files). Guard
used for the sweep and kept in the field report: `upstream-added-missing.mjs <disk> <tplOld> <tplNew>` —
lists every line added between two extracted bundles that is absent on disk; after the merge it prints
nothing for any deployed file except the intentionally translated creed line. Not mutation-proved as a
shipped guard — it is a one-off session tool, text in `reports/KAIF_UPDATES/KUMM_KAIF_2.7_UPDATE_REPORT.md`.

**Correction, 2026-09-18 18:18 +03:00 (the upstream comment is stamped 15:18:46Z) — the last sentence above
went out of date within the hour** (it is what the delivered issue body still says; the same correction is
posted there as comment 5732110277). The one-off tool became a repository guard,
`tools/kaif-update-sweep.mjs` (one command, two bundles in, no temp trees), with its `@guard` block, and it
WAS proven on the named broken version. The tool prints Russian; its summary lines verbatim:

```
-- сверено файлов: 81 · пропущено как документы владельца: 14 · нет на диске: 0 · недоехавших строк: 121     (exit 1)
-- сверено файлов: 81 · пропущено как документы владельца: 14 · нет на диске: 0 · недоехавших строк: 0       (exit 0)
НЕ ПРОЧЁЛ: нет файла <scratchpad>/nope.md                                                                   (exit 2)
```

Read as: files judged · skipped as owner documents · absent on disk · undelivered lines. Line 1 is the
sandbox right after the pass with no hand merge (11 files named), line 2 this tree after the hand merge,
line 3 an unreadable bundle path ("could not read", never "clean"). In the broken run both silently lost
modules are named although the update task never carried them. Run report:
`testcases/reports/2026-09-18_kaif-update-sweep.md` (`kaif-testrun-lint check` → 0 findings).
