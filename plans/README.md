# `plans/` — detailed step-by-step plans

Detailed plans for individual pieces of work: single steps of the master plan, features, ideas, bugs,
research, procedures. The high-level roadmap is in `MASTER_PLAN.md` (root); here live the zoomed-in
plans that implement its steps. One `NN_<name>.md` per plan.

**For the owner:** you don't have to write here — the agent usually keeps the plans. You can drop in a plan if you
want to set *how* exactly something is done. Read them to see the agent's intended approach before execution.

**For the AI agent:** before non-trivial work, write a short plan here and follow it. Every plan
OPENS with a goal vector + acceptance criteria — written per `REQUIREMENTS_FRAMEWORK.md`; they
change as the work goes. Right after the H1 comes the lintable header meta: **Created:** · **Parent:** ·
**Status:** (with milestones) · **Outbound:** (`AGENT_GUIDE.md` → Document header meta). Number the files
(`NN_<name>.md`). A finished and verified plan gets the `DONE` tag in its name (`git mv NN_x.md
NN_DONE_x.md`) plus a status section. Reference documents (not closable tasks) are never tagged.

**Naming — an epic is visible in the backlog by its file name.** Heavy, composite, long work is planned
as an **epic** (`/plan-epic`), and its file carries the mark: **`NN_EPIC_<name>.md`**. The epic file holds
the phase-by-phase architectural description of the roadmap — *and no operational detail*. The detail
lives in its **children**: one operational plan per phase (R&D, testing, implementation, acceptance), and
each child names its parent in its own name — **`NN_epicMM_<phase>_<name>.md`**, where `MM` is the
parent epic's number. Only the nearest phase is detailed; the plan for phase N+1 is written when
phase N closes. Work that needed no epic stays a **standalone** plan: `NN_<name>.md`.
The convention applies going forward — old plans are not renamed: their numbers are already cited across
the history.
