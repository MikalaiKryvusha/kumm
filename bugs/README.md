# `bugs/` — defects, difficulties, breakages

One document per defect: symptom, deterministic reproduction, forensics, root
cause/hypotheses, fix history, status. The agent's own durable bug backlog — nothing gets lost,
any bug can be picked up from scratch by a future session. One `NN_<name>.md` per bug.

**For the owner:** you can file a bug in plain words (what is wrong, how to reproduce it) — the agent
will structure it. Browse the directory to see the known defects and their status.

**For the AI agent:** hit a defect during work/tests — file a document by the canon (the `/report-bug` skill;
method — `BUG_FIXING_FRAMEWORK.md`), however small. A bug document carries an observable acceptance criterion
for the fix — what will be SEEN working after the fix (`REQUIREMENTS_FRAMEWORK.md`). While open — no `DONE` tag. Fixed **and verified** —
`git mv NN_x.md NN_DONE_x.md` and add a `## ✅ STATUS: DONE (дата и время)` section. After 3 failed blind fix
attempts — stop and switch to research (`/bug-research`).

**The `bugs/KAIF/` subdirectory** — defects and improvement requests about **the KAIF framework
itself**, not about this project. When a failure traces back to a hole in KAIF (a rule misled,
a guardrail was missing, the machinery broke) — file a document there by the same bug canon,
**strictly in English** (these documents address the KAIF developer). Before filing —
deduplicate: search `bugs/KAIF/` first; origin-tracked deployments also search the
origin issue tracker and send confirmed signals upstream, detached ones keep everything
local.
