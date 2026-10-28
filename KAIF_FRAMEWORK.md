# KAIF in KUMM — the framework deployed here

> **What this document is.** A high-level description of **the KAIF framework as deployed and used in this
> project** — the project's "technologies and frameworks" page, where KAIF is now one of the technologies.
> The agent writes it **after a successful KAIF injection** (the self-extracting core is deleted as soon as this
> document exists — see the KAIF lifecycle). From then on, work in the project is organized *through*
> KAIF, and this file is its human-readable summary.
>
> Written in English (owner's decision of 2026-10-28: chat in Russian, all documentation in English). **A living
> reference — never `DONE`-tagged.** Keep the version line current.

---

## What KAIF is

KAIF (Krinik AI Framework) is **a context-loss-resilient, autonomy-disciplining operating framework for the
human–AI tandem**. It moves the agent's working memory and discipline into this repository — a small set of
markdown documents, directory conventions and repeatable slash skills — so that any fresh agent session
resumes with full context, works autonomously within clear bounds, and accumulates knowledge instead of
losing it. It is not code; it is *a process captured in files the agent reads*.

## Why it is here — what it gives the project

- **No cold starts.** A new session reads `AGENT_GUIDE.md` + `STATUS.md` and is productive at once.
- **Knowledge survives.** Bugs, decisions, research and ideas become durable documents, not a lost chat.
- **Bounded autonomy.** The agent grinds the backlog on its own and escalates only owner-level decisions.
- **A shared method.** The human is the visionary (`GOAL.md`), the agent is the executor; KAIF is the interface between them.

## How it works here — the moving parts

| Part | Role in this project |
|-------|---------------------|
| `AGENT_GUIDE.md` | The canon the agent reads before every task. |
| `PHILOSOPHY.md` | How the agent thinks (KISS + Occam + an extended set of principles). |
| `REQUIREMENTS_FRAMEWORK.md` / `TESTING_FRAMEWORK.md` / `BUG_FIXING_FRAMEWORK.md` | Requirements shape what is wanted, testing checks the work against it, bug fixing closes the gap. |
| `GOAL.md` / `MASTER_PLAN.md` | The vision and the phased path to it. |
| `STATUS.md` | Live state — updated after every significant task. |
| `PROJECT_STRUCTURE_EXTERNAL_MAP.md` / `PROJECT_ARCHITECTURE_INTERNAL_MAP.md` | The external and internal maps. |
| `plans/ ideas/ bugs/ researches/ interviews/ homeworks/ reports/` | Knowledge directories (each with its own README). |
| `.claude/skills/` (or your agent system's equivalent) | Repeatable rituals (`/resume`, `/pause`, loops, …). |
| `.kaif/kaif.json` | Deployment marker: version, sphere, agent, tracking. |

## Deployment record

| Field | Value |
|------|----------|
| **KAIF version** | 2.9 — updated from 2.7 on 2026-10-16, version 2.8 passed in the same step (bootstrap route; report `reports/KAIF_UPDATES/KUMM_KAIF_2.9_UPDATE_REPORT.md`) |
| **Injected** | 2026-08-15 |
| **How the injection went** | Mechanically and without failures. `KAIF-LOADER.mjs` fetched the machinery from the origin release, both halves matched by sha256, the core deployed 8 root documents, 7 knowledge directories and 35 skills across five agent systems. One cognitive task of 9 items was left to the agent: study the project, fill the maps and placeholders, derive MASTER_PLAN from GOAL. |
| **Sphere** | programming |
| **Agent systems** | claude-code · codex · grok-build · cline · zoo-code |
| **Working language** | Russian (`ru`) in chat; since 2026-10-28 all project and KAIF documentation in English (owner's decision) |
| **Tracking** | origin — https://github.com/MikalaiKryvusha/KAIF |

The `ru` language pack is incomplete by design: the 8 owner documents and the skill triggers are localized, while
skill bodies and the agent's internal documents ship in English (`AGENT_GUIDE.md`, both map frameworks,
`STATUS.md`, `EXPERIENCE.md`, `MASTER_PLAN.md` and others). That is intentional — models read English more
reliably. Since 2026-10-28 the owner's decision extends this to all documentation; only the chat stays in Russian:
`[OWNER]` «ИИ агент продолжает общаться с владельцем на РУССКОМ в чате, но а своих документах рабочих ИИ агент пишет докуметацию проекта и KAIF на английском языке» · 2026-10-28.

## What changed in 2.8 and 2.9 for this project (update of 2026-10-16)

Two versions in one step — 2.8 and 2.9. What you will notice:

- **A new file, `HOUSE_RULES.md` — the house rules.** `AGENT_GUIDE.md` now describes the agent's working method, and
  the KUMM facts moved to the house rules: the verification-bench commands, the table of tools and hooks, the machine
  dossier, the push recipe. The file was written in Russian; `/resume` reads it on entering a session.
- **KAIF hooks are wired.** The new `.claude/settings.json` holds four hooks: one that orders a canon re-read after
  context compaction or clearing, an hourly re-read timer, a hook on the word `resume` at the start of a message, and a
  soft `STATUS.md` guard at the end of a turn. For Codex, `.codex/hooks.json` carries two of them: the re-read after
  compaction and the timer. Hooks can be switched off with `"hooks": "off"` in `.kaif/kaif.json`. The 2.8 hook that
  stopped the agent on every word of yours mid-work is removed in 2.9; we never had it installed.
- **Your word mid-work.** The agent answers at once, in text, and keeps working. The word "stop" (`стоп`) still
  stops the agent.
- **Chat closure and release carry KUMM's commands.** `/end-chat-soft`, `/end-chat-force` and `/release` now hold our
  steps instead of the template stubs: syntax check of both halves, core tests, step-by-step commit. The engine has had
  no releases yet, and `/release` says so.
- **Each git step is a separate command.** `git add`, `git commit` and `git push` are no longer chained on one line:
  the automatic permission mode rejects such a chain.
- **The stamp's time comes from the clock**, via the same command that writes the stamp.

### All rule changes in this update

The new version's rules are accepted together with the version, without questions to you (rule 7 below). The agent may
ask you only if a rule contradicts a decision you recorded yourself; this update found no such contradiction.

1. [2.8] The field report of every update and install goes to KAIF at once, without asking you. In KUMM this has been
   so since 2026-09-18 by your word; now it is KAIF canon.
2. [2.8] The size gate at chat closure lets an over-budget document through only while it is shrinking:
   `check --gate-budgets` records the debt in `.kaif/budget-baseline.json`, and growth, stagnation or a new overflow
   stop the closure. This file is committed together with the closure.
3. [2.8] The questions page does not close after saving: you can answer one question, leave the window open and
   come back to the rest later.
4. [2.8] When the agent needs you to do something yourself or to answer quickly, it calls you: a sound, a console
   line, a voice. Quiet hours are respected. A request left only in the chat counts as a violation for the judge.
5. [2.8] "Not reproduced" is written only after a search for the conditions under which the defect recurs: at least
   three variants, each with its own outcome. A defect report for a developer follows template C: description, steps,
   expected result, actual result.
6. [2.8] A document that accumulates your words verbatim (for example, `GOAL.md`) can be declared an archive, and its
   budget is then counted on the digest. Only your word declares it; in KUMM no archive is declared.
7. [2.9] The new version's rules are accepted together with the version. The agent names them in the field report and
   in the farewell, but asks you no questions about them.
8. [2.9] Hooks that KAIF ships are wired by the agent at once, without asking.
9. [2.9] If the decision-authorship linter arrives without a recorded debt (baseline), the agent records the inherited
   debt once, without asking. KUMM already had a baseline. Of six new "by the owner's word" lines without a quote, four
   got your quote or its address, two got a note that the decision is still yours to make. The debt is unchanged — 12
   lines: 7 in the chronicle, 5 in ideas, plans and researches.

## What changed in 2.7 for this project (update of 2026-09-18)

Two versions in one step — 2.6 and 2.7. What the owner will notice:

- **The word `resume` on the first line is an order.** The agent first runs `/resume` in full and only then
  takes the task written below it. A line about this was added to `CLAUDE.md` and `AGENTS.md`.
- **The `DELIVERY:` line is gone.** Delivery tracking was removed by the origin owner's word of 2026-09-12. The
  metric block was taken out of `MASTER_PLAN.md`. The metric question in interview #001 is closed as having lost its
  subject; the one live question left there is the prayer cadence.
- **Whose decision it is shows in the signature.** The owner's word is recorded as a dated quote:
  `[OWNER] «…» · дата`. An agent's decision is signed `[AI]`. "Do as you see fit" is a mandate, and it is
  recorded as an agent's decision under that mandate.
- **"Tested" means a functional run** along the user's path, with the result read. Linters, unit tests and
  self-tests are called hygiene. Every executed run leaves a report in `testcases/reports/`.
- **A question to the owner is asked only after searching his past answers.** A new interview will not open without
  a mark of a search through `interviews/`, `GOAL.md` and the plans. Interviews opened before 2026-09-18 are not
  judged by this rule.
- **A falsehood is corrected where it was left.** Both closure rituals ask by name: "Standing falsehood: none"
  or a list of the places where it was corrected.
- **Chat closure got stricter.** `/end-chat-soft` checks the experience log for repeated lessons and,
  after trimming `STATUS.md`, runs the line-budget gate `check --gate-budgets`.
- **The approval contour arrives ready-made** — `.kaif/tools/contour/` and the one-page contract
  `.kaif/INTERACTIVE_CONTOUR_SPEC.md`; no need to build our own. It has not been used here yet.
- **New but optional**: the linters `kaif-attribution-lint`, `kaif-experience-lint`,
  `kaif-testrun-lint`, `kaif-voice-lint`, `kaif-ranking-lint`; a fourth hook `prompt-resume-word.mjs`
  (the hooks module is not wired in this project).
- **The word "handover"**, to which we renamed our `baton` on 2026-09-09 per ticket #57, is now
  in the delivery itself as well. The divergence from origin is gone.

### All twenty rule changes of this interval

The update task requires putting every rule change before the owner, and the task itself is erased after the
update. So the full list is here. `[AI]` All twenty were accepted by the agent as the framework author's
decisions at origin: the project owner is the KAIF author. Any of them is revoked by your word.

From 2.6:

1. Text for the owner is written in the customer's language. Epic codes, plan addresses, tool names and flags
   live only in the Check line and in the technical note.
2. "Done" about something already in production is said after a check on the owner's real world, not on a clean bench.
3. A fresh owner remark does not become the top priority by itself. `/what-next` answers in a
   fixed form: the metric and the main phase first.
4. The delivery line became a derived vector. Revoked by item 10.
5. The approval contour arrives as a ready-made generator; no need to build our own.
6. The agent's unease at an owner's proposal is a reason for reconnaissance, not for the verdict "this is impossible".
7. Update machinery: the loader rejects an unknown flag before downloading, the rehearsal receipt works on the
   bootstrap route, fillings are derived from disk, stale version mentions are named.

From 2.7:

8. The owner's word is recorded as a dated quote; an agent's decision is signed `[AI]`.
9. `[AI]…[/AI]` marks are legitimate in any draft the agent brings to the owner.
10. Delivery tracking removed: no `DELIVERY:` line, no `delivery` command, no systems registry.
11. Contour: a document is checked with `--check` before the page opens; an entered decision is marked
    at once; live questions are shown first; the "Save" button floats at the top right.
12. Every executed run leaves a seven-field report in `testcases/reports/`.
13. Text the owner reads as his own is written by the portrait of his voice and checked against it.
    This project has no portrait; the rule is dormant for now.
14. A heading renamed in an update replaces the old one instead of duplicating it; the hand-off of work is called handover.
15. "Tested" means a functional run; a claim is no wider than the observation behind it.
16. The contour page is launched by a command from the skill and survives the death of its process, keeping the draft.
17. A ticket about a defect of KAIF itself is delivered in the same move it is filed, without separate permission.
18. Only the `--close` command closes a live page; the contour window lives in its own browser profile
    inside the project; an unknown flag is rejected before the page is shown.
19. A live question of a new interview opens only with a mark of a search through past answers.
20. `check` counts the line budget over lines the project wrote itself, and got the `--gate-budgets` gate.

What of this already fired here on 2026-09-18: items 7, 8, 10, 12, 14, 15, 17 and 20. Two fired with a
defect: item 14 became ticket #72, and item 7's promise about fillings became ticket #73.

## What changed in 2.5 for this project (update of 2026-09-05)

<!-- KAIF-VERSION-OK: исторический раздел — описывает прошлое обновление 2.2 → 2.5; строка `DELIVERY:` и метрика из него отозваны в 2.7, см. раздел выше -->
Three versions in one step — 2.3, 2.4 and 2.5. What the owner will notice:

- **The creed and the prayer** sit in the header of `AGENT_GUIDE.md`; the agent says them in the chat on entering a
  session and before a non-trivial task. The cadence is the owner's setting (interview #001).
- **Two mandatory lines** in the agent's reports: `FORK:` at an engineering fork (options · cost of
  error · whom it consulted) and `DELIVERY:` at session closure and in every iteration of autonomous loops —
  on ONE metric from `MASTER_PLAN.md`. The metric was proposed by the agent and awaits the owner's word.
- **A defect severity ladder** S1 / S2 / S3 in `BUG_FIXING_FRAMEWORK.md`: the full package only for
  harm to hardware, data or trust; S3 is one line in the experience log.
- **Chat closure** is a pair: `/end-chat-soft` (unhurried, all ceremonies) and `/end-chat-force` (urgent, with
  recorded debt); `/end-chat` is gone.
- **New but optional**: the `/team-deployment` skill (a team of agents — not used here),
  the linters `kaif-guard-lint` and `kaif-scenario-lint` in `.kaif/tools/`, the scenario form of an acceptance criterion
  "Situation · Action · Result · Check" in `REQUIREMENTS_FRAMEWORK.md`.
- **Machinery**: a KAIF defect ticket is delivered to origin by `node .kaif/kaif-core.mjs report
  <тикет>` without separate permission; `node .kaif/kaif-core.mjs check` warns when key documents exceed
  their line budget (`STATUS.md` ~200).

Update history (both by the bootstrap route, the live counters matched the sandbox):

- 2.5 → 2.7, 2026-09-18 — field report `reports/KAIF_UPDATES/KUMM_KAIF_2.7_UPDATE_REPORT.md`.
<!-- KAIF-VERSION-OK: строка истории — называет прошлое обновление и его отчёт по имени файла -->
- 2.2 → 2.5, 2026-09-05 — field report `reports/KAIF_UPDATES/KUMM_KAIF_2.5_UPDATE_REPORT.md`.

## Living with KAIF (the lifecycle)

`/kaif-version` (check for updates) · `/kaif-update` (respectful migration from origin) · `/kaif-fork`
(develop your own) · `/kaif-switch-origin` · `/kaif-remove` (partial keeps your artifacts, or
full — always respectful). Backed by the npm handles `kaif:*`.

<!-- KAIF:AUTHOR-NOTE:BEGIN — this whole region is stripped mechanically on anonymous installs -->
---

## A note from the author

> KAIF был придуман и разработан как вынужденная необходимость (Николай Кривуша) Криником при совместной
> работе в режиме вайбкодинга с Claude над программным продуктом в конце жаркого июня 2026 года, в
> г. Минск. Дата рождения KAIF — 30 июня 2026 г.

*(English:)*

> KAIF was conceived and built out of necessity by **Krinik (Mikalai Kryvusha / Николай Кривуша)** during
> vibe-coding sessions with Claude on a software product, at the end of a hot June 2026, in Minsk.
> **KAIF's birthday is 30 June 2026.**
<!-- KAIF:AUTHOR-NOTE:END -->
