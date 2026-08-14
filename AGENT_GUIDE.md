# KUMM — AI Agent Guide

This file is read by the AI agent before every task. It is the **canon** of the project: the rules,
the map, the commands, the conventions. Keep it accurate — a fresh agent session with empty context
relies entirely on this document to get to work.

> 🧠 **PRIME PRINCIPLE — SIMPLICITY (read `PHILOSOPHY.md`).** If something is taking a long time, it is
> NOT a hard task and NOT a library bug — the agent is DOING IT TOO COMPLEX because it did NOT UNDERSTAND
> THE TASK. Everything should be simple (KISS + Occam). Stuck → re-understand the task, find the
> built-in simple path, do NOT escalate complexity. A stall = "simplify your understanding," not "dig harder."

> 🤖 **AUTONOMOUS MODE.** When the human has stepped away / granted autonomy and there is no active
> interactive task, and `STATUS.md` has an open autonomous backlog — the agent SHOULD, on its own
> initiative, enter the appropriate loop skill (`/autoloop`, `/dayloop`, or `/nightloop` — or
> `/guarded-loop` when the owner asked for a protected run) and grind the
> backlog, committing progress and self-restarting after each task. Stop only on the skill's stop
> conditions. Do not enter a loop if the human just gave a specific interactive task.

---

## Before every task — checklist

```
1. Read STATUS.md                 # current state: what's done, where we are, what's next
2. Recall experience              # grep EXPERIENCE.md by the task's tags — don't repeat known dead ends (skill: /experience)
3. git status                     # what changed, what's uncommitted
4. git log --oneline -5           # where we are in history
5. Read MEMORY.md (if present)    # user profile, key decisions
6. Load ONLY the relevant slice   # use the Context router below — read the required minimum + task-type docs, not everything
7. Execute by the fable loop      # /fable-method: gates + forced artifacts (INTENT/AUTH/TWINS/PENDING); /fable-loop to orchestrate; /fable-judge before claiming done
8. Read the relevant plan         # plans/<feature>.md, if the task touches a specific feature. Code by citing the plan: before implementing a step, QUOTE the anchor line you are doing right now — if you can't name the line, that's scope drift caught BEFORE the diff. A HEAVY task with no plan yet → build the ladder first (Planning discipline below; /plan-task for ordinary work, /plan-epic for epics). Filing a plan/bug/idea → goal vector + acceptance criteria FIRST, per REQUIREMENTS_FRAMEWORK.md
9. Recon before code (external truth)  # the task rests on an external truth (an old/reference system, a foreign API, prod behavior, a vendor doc)? The FIRST artifact is a recon doc in researches/ — code is forbidden until it exists; then code by the document, not from recall. Recon docs are reused by every future session
10. Check the map & blast radius   # before editing code: PROJECT_ARCHITECTURE_INTERNAL_MAP.md — who is affected; update the map if relations change
11. Run the build (if touching code)   # node --check kumm.mjs
12. Use the test harness          # node kumm.mjs check --json / .\Deploy-ModPack.ps1 -Verify -PackDir <pack> — drive/observe the software without a human; full table in the "Test harness" section below
13. Comment the code              # comment blocks, classes, modules, important lines — with a test-status marker: fresh raw content gets [NOT-TESTED]; verified-by-observation flips to [TESTED: date · how] (TESTING_FRAMEWORK.md)
14. Reflect on bugs in bugs/      # one md per bug; follow BUG_FIXING_FRAMEWORK.md
15. Capture experience            # after a meaningful success/failure, append a lesson to EXPERIENCE.md (skill: /experience)
16. Periodically re-read the KEY canon documents — the re-read core (Document taxonomy below;
    triggers & witness — Context refresh below):
    - PHILOSOPHY.md   ← the simplicity principle; if stuck, go here first
    - AGENT_GUIDE.md
    - STATUS.md
    - GOAL.md
    - MASTER_PLAN.md
    - REQUIREMENTS_FRAMEWORK.md
    - TESTING_FRAMEWORK.md
    - BUG_FIXING_FRAMEWORK.md
    - PROJECT_STRUCTURE_EXTERNAL_MAP.md
    Edit them when it would make future autonomous work more effective. The agent operates across
    sessions that lose context — these docs must let a fresh session get productive from empty context.
17. Narrate in the chat, at least a little, in natural language — what you're doing right now — so the
    human can glance over and follow along.
18. Documents from the human (ideas, bugs, features): FIRST commit the original verbatim (git add +
    commit) — only then, in a following commit, fix typos and minimally restructure into a clean
    structured format for AI consumption (the human's voice and every thought preserved; their original
    wording stays reachable in git history). After implementing from such a document, write the status
    and the implementation date back into it.
19. Writing into the owner's artifact?   # text the human signs or reads as their own (docs, paper, site
    copy) → open the owner's voice portrait `AUTHOR_STYLOMETRY.md` when the project has one
    (/owner-voice) and run its checklist before handover; no portrait after a second style
    rejection → propose taking one
```

→ **`STATUS.md`** is the master state file. Update it after every significant task.

### Context router (progressive loading) — read only the slice you need

Don't read every document "just in case" — that fills the context you're trying to protect. Read the
**required minimum** always, then only the documents for the task type; fetch more on demand.

| Task type          | Read (minimum on top of the required minimum)                         |
|--------------------|-----------------------------------------------------------------------|
| **Required minimum (always)** | `STATUS.md` · `PHILOSOPHY.md` (the principle set) · this router · `EXPERIENCE.md` (grep by tag) |
| Bug                | `BUG_FIXING_FRAMEWORK.md` · `bugs/<this>` · the map (blast radius)     |
| Testing / verifying anything | `TESTING_FRAMEWORK.md` (the 7 principles · `[NOT-TESTED]`/`[TESTED]` markers) · the sphere's verification sections |
| Writing requirements / acceptance criteria / a goal vector | `REQUIREMENTS_FRAMEWORK.md` (the ten criteria · stop-word dictionary · fit criterion) |
| Feature / idea     | `ideas/<this>` · `MASTER_PLAN.md` · the relevant `plans/<this>`        |
| Refactor / edit    | `AGENT_GUIDE.md` · the two maps (blast radius)                         |
| Planning           | `MASTER_PLAN.md` · `GOAL.md` · open backlog · the Planning-discipline section (heavy → `/plan-epic`) |
| External truth involved (old system / foreign API / prod / vendor doc) | the recon doc in `researches/` — **create it first** if it doesn't exist (checklist step 9) |
| Writing into the owner's artifact (text the human signs or reads as their own) | `AUTHOR_STYLOMETRY.md` — the owner's voice portrait, when the project has one (`/owner-voice`) · the artifact's styleguide |

Sections in these documents are anchored — address a slice (`DOC.md#anchor`) rather than re-reading the
whole file. The required minimum is **not** subject to laziness: `PHILOSOPHY.md` always applies.

### Document taxonomy — the five tiers

Every document in the project sits in exactly one tier; the tier tells the agent what it owes the
document — re-read it, know it, follow its regulation, or leave it alone:

1. **KEY canon documents — the re-read core.** What the agent re-reads regularly and keeps fresh
   in context (checklist step 16; `/resume` reads the full set): `GOAL.md` · `AGENT_GUIDE.md` ·
   `PHILOSOPHY.md` · `REQUIREMENTS_FRAMEWORK.md` · `TESTING_FRAMEWORK.md` ·
   `BUG_FIXING_FRAMEWORK.md` · `STATUS.md` · `MASTER_PLAN.md` ·
   `PROJECT_STRUCTURE_EXTERNAL_MAP.md`. The key documents reference every other document of the
   framework — having read them, the agent knows what else exists and when to fetch it. NOTE two
   distinct sets: this re-read core (nine) is smaller than the SHIPPED key-document set (fourteen,
   Reference §5) — `PROJECT_ARCHITECTURE_INTERNAL_MAP.md`, `EXPERIENCE.md` (grepped by tag, never
   re-read whole), `PROJECT_HISTORY.md` (archaeology on demand), `KAIF_FRAMEWORK.md` and
   `KAIF_REFERENCE.md` ship as key documents but are fetched by the context router, not re-read on
   schedule.
2. **EXTENDED canon documents.** The rest of the framework's canon — the internal map, the
   chronicle, the reference, the experience journal, the sphere and adapter libraries. The agent
   may skip them when refreshing context, but knows they exist and works with them when the router
   points there.
3. **WORKING canon documents.** The dynamic documents born under the framework's regulations —
   plans, bugs, ideas, researches, interviews, homeworks, reports. Their form is set by their
   directory README and skill templates; their header — by the header-meta norm below.
4. **OTHER KAIF documents.** The "house rules": local agreements between this owner and the agent
   that modify or extend KAIF in this specific project. Local law — it governs here and travels
   nowhere.
5. **Project working documents.** Everything of the owner's project itself — code, assets,
   documents that are not the framework's. KAIF governs how the agent works on them, not what
   they are.

### Context refresh — the re-read rule and its witness

Rules read once at session start decay as the context fills and compacts — a long session ends up
holding a summary of the canon instead of the canon. The re-read core (tier 1 of the Document
taxonomy above) is therefore RE-READ, not remembered, at four triggers:

1. **The hour:** more than 60 minutes in a live session since the last refresh — refresh at least
   once per hour.
2. **A heavy task:** before starting a task that passes the heaviness test (Planning discipline
   below) in the same long-lived chat.
3. **After compaction / pause:** after a context compaction, a return from `/pause`, or a long
   idle gap.
4. **Ritual points:** `/resume` (the full canon pass), `/refresh-context`, and every iteration of
   the long loops (`/autoloop` · `/dayloop` · `/nightloop` · `/guarded-loop`).

A refresh is a VERIFIABLE ACTION, not a claim — recalling the rule does not prove following it.
The witness has two parts, both mandatory:

- **The marker** — `.kaif/refresh-marker.json`: `{ "at": "<ISO timestamp>", "docs": [<what was
  re-read>], "trigger": "hour|heavy-task|compaction|ritual:<name>" }`, rewritten by the agent at
  the moment of the refresh. Session state, never project history: its `.gitignore` line ships
  with the machinery's ignore-first set. Machine-readable by design — a judge or a hook reads the
  marker's age in one command.
- **The quote-acceptance** — updating the marker is legal ONLY together with quoting in the chat
  one concrete line from the re-read that is relevant to the current task ("refreshed: STATUS
  item 1 — '…'"). The quote proves the reading reached the task; the marker makes the fact
  checkable later.

A marker without the quote — or a claimed refresh with a stale marker — is fraud of the
false-`[TESTED]` class: `/fable-judge` hunts it (the refresh-witness hunt).

This markdown ritual is the complete contour on its own. On agent systems with lifecycle hooks,
the optional **refresh-hooks module** (`.kaif/hooks/`, wiring in its README) reinforces it
mechanically: an order to re-read after compaction, a marker-age timer on every prompt, a soft
once-per-session STATUS guard. Activation is an explicit owner opt-in; a deployment without
hooks never reddens.

### Environment dossier — the agent knows its machine from its own notes

A session that REMEMBERS the environment invents it: which shell is running, what `tar` actually
is in this PATH, which encoding a redirect writes. Those are facts about a machine, and facts are
PROBED, never recalled (`PHILOSOPHY.md` → observation instead of guessing). The dossier is the
section below: the agent fills it by running the probes, and every future session reads instead
of rediscovering — or stepping on what was already paid for.

**How to collect** (the procedure lives in `/refresh-context`; run it at deployment and whenever
the dossier goes stale). Probe six axes, and probe them **in every shell available separately** —
different shells are different worlds, and that difference is exactly what the dossier exists to
capture:

1. **OS / hardware** — OS version, CPU cores, RAM.
2. **Shells and encodings** — which shells exist, console codepage, the default ANSI encoding a
   redirect writes, each shell's locale.
3. **Toolchain** — language runtimes, package/build tools, VCS and their versions; and WHAT
   `tar` / `curl` / `find` resolve to in each shell (a system binary, a GNU tool, or a shell
   alias to something else entirely — check the command TYPE, not just its path).
4. **VCS policies** — line-ending policy, credential helper.
5. **Package managers** — what is available to install with.
6. **Behavioural quirks** — LINKS to the lessons already paid for (`EXPERIENCE.md` ids), never
   copies of them.

**Format.** One table, one row per fact, three columns — **fact → value → probe command** — so a
future session can re-derive any single value without re-deriving the procedure. The section
header carries three things: the **date the facts were taken**, the **regeneration command**, and
the **staleness rule**. A fact never probed is written `— not probed yet —`: a missing fact is
honest, an invented one is a defect (`PHILOSOPHY.md` → the three doors).

> **Environment dossier.** Taken: `2026-08-15` · Regeneration: `/refresh-context` → the dossier step
> (re-run the probes in column 3 and rewrite the values and this date) · **Staleness: facts older
> than four weeks are HYPOTHESES — re-probe before relying on them.**

| Fact | Value | Probe |
|---|---|---|
| OS | Windows 11 Pro, 10.0.26200.0 | `(Get-CimInstance Win32_OperatingSystem).Caption; [Environment]::OSVersion.Version` |
| CPU / RAM | 16 logical cores · 31.9 GB | `$env:NUMBER_OF_PROCESSORS`; `(Get-CimInstance Win32_ComputerSystem).TotalPhysicalMemory/1GB` |
| Shells available | **Windows PowerShell 5.1** (Desktop edition — `pwsh` is NOT installed) · **Git Bash 5.2.21** · `cmd` | `$PSVersionTable`; `Get-Command pwsh`; `bash --version` |
| Console / ANSI encoding | console output UTF-8; **system ANSI codepage 1251** — `Set-Content`/`Add-Content` default to 1251, so pass `-Encoding utf8` explicitly for any file another tool reads | `[Console]::OutputEncoding.WebName`; `(Get-ItemProperty 'HKLM:\SYSTEM\CurrentControlSet\Control\Nls\CodePage').ACP` |
| Locale per shell | PowerShell `ru-RU` (localized CIM strings, decimal comma) · Git Bash `LANG` unset | `(Get-Culture).Name`; `locale` |
| Runtimes and build tools | Node **v24.15.0** (project needs ≥22) · npm 10.8.2 · git 2.43.0.windows.1 · gh 2.95.0. No build toolchain — the project has none. | `node -v; npm -v; git --version; gh --version` |
| `tar` / `curl` / `find` per shell | **The two shells are different worlds.** PowerShell: `tar` → `C:\Windows\system32\tar.exe` (bsdtar — rejects `D:\…` paths as a remote host), `curl` → **an ALIAS for `Invoke-WebRequest`**, not the binary. Git Bash: `tar` → `/usr/bin/tar` GNU 1.35, `curl` → `/mingw64/bin/curl` 8.4.0 (real), `find` → `/usr/bin/find` (GNU). | `Get-Command tar,curl \| % {"$($_.CommandType) $($_.Definition)"}`; `type -p tar curl find` |
| VCS line-ending policy | `core.autocrlf = true` (CRLF in the working tree, LF in the repo) | `git config --get core.autocrlf` |
| Package manager | `winget` (system) · `npm` (JS). The project itself has **zero runtime dependencies** — there is nothing to install to run it. | `winget --version`; `npm -v` |
| Quirks paid for by incidents | `— none logged yet —` (first entries go to `EXPERIENCE.md`; link them here by id, never copy the text) | grep `EXPERIENCE.md` |

**The DRY boundary with "Document and text hygiene"** below: the dossier holds FACTS of the
machine (what is installed, what `tar` is, which encoding); hygiene holds RULES OF BEHAVIOUR
derived from incidents (text through files, read back what you wrote). The dossier links to
lessons by id and never copies their text; a behavioural rule discovered while probing goes to
hygiene or `EXPERIENCE.md`, and only its link stays here.

### Document header meta — the first screen answers "what is this"

A future session must understand any knowledge-directory document without reading its body. Every
WORKING canon document in `plans/`, `ideas/`, `researches/`, `homeworks/` opens with:

- **Line 1 — H1:** `# <Type> NN — <one-line essence>`.
- **Right after the H1 — a blockquote header** with fixed, lintable labels: **Created:** ISO date
  (plus by whom / on whose word, when it is not the project agent) · **Parent:** the parent or
  source (a plan, an idea, "owner's drive-by note") or `—` · **Status:** the living status WITH
  milestones (phase/step closure dates) · **Outbound:** what from this document must go where
  outside (a decision to the owner · an issue upstream · into a shipped template) or `—`.
  Optional **Descendants:** child documents — lintable when present, never required.

The header is meta, not a chronicle: brief history = milestones in **Status:** plus git history;
a prose changelog in a header is an unlintable drift pair. `bugs/` and `interviews/` keep their
own already-canonical header dialects (the `/report-bug` template header; `Topic:`/`Status:` read
by the questions guard) — one concept, one header, no second canonization. Root key documents
carry self-description as the first block after the H1 instead of the field schema. Each field is
either lintable or it is not in the schema; a header lint consults — it never blocks starting work.

### Contours — the project's large logical modules

A **contour** is a top-level logical module of the system or of the methodology itself — a
complete, closed stack of context on one direction (the update contour, the feedback contour, the
interactive review contour…). Its anatomy has four parts: **boundaries** (what is inside, what is
out) · **governance** (rules, conventions, standards, terminology) · **execution** (workflows,
scenarios, code artifacts, prompts) · **quality control** (done-criteria, obligations, checks).
Working "in contour X", the agent activates that contour's rules and tools and treats it as one
isolated subsystem with clear inputs and outputs. Name contours explicitly and watch their edges:
a contour whose boundary blurs is either reformulated or recorded as conscious debt with a backlog
address — never left unowned.

### Recon artifacts — when the task has an external truth

Three artifact types live in `researches/`, each replacing a specific kind of invention with
observation (a session that "remembers" a domain invents it):

- **Recon doc** (checklist step 9) — *describes* how the external truth actually works, read from the
  live source (old system's code, the running prod, the vendor doc) — never from recall. The first
  artifact of any task that rests on one; reused by every future session.
- **Canon map** — for any domain with facts (a game world, a product, a brand, an API): a table of
  entities → their roles → mappings, **approved by the owner**. The map precedes the canon: every edit
  is checked against it, ONLY the owner may change it, and a conflict between text and map = stop and
  ask. Key facts of the map deserve guards (`BUG_FIXING_FRAMEWORK.md` → Guards).
- **Parity inventory** — where a reference exists (an old system, a competitor, a brand book): a
  **countable** checklist, one row per element — `element → reference behavior → present in ours? →
  OK/bug`. The rule: **no inventory row — no code**; delivery is judged BY THE ROWS, not by impression.
  A recon doc *describes*; the inventory *counts* — a session can read a description and still invent,
  but it cannot argue with a row.

Adjacent, but NOT a fourth type: the **owner's voice portrait** — `AUTHOR_STYLOMETRY.md`, taken by
`/owner-voice`. It replaces the same
kind of invention with observation — the owner's own texts instead of a session "remembering" their
style — but it is a CANON document the owner accepts, and it is routed by task type ("writing into the
owner's artifact"), not by external truth.

### Task execution discipline — the fable loop

Any non-trivial task is executed by the **fable-method** loop (`.claude/skills/fable-method/`): classify
the ask → define done → gather evidence → decide → act surgically → verify by observation → report
outcome-first, with its gates and **forced artifacts** (`INTENT:` / `AUTH:` / `TWINS:` / `PENDING:`
lines at decision points — rules at decision points, not rules in lists, are what weak sessions actually
follow). Orchestrated work (parallel evidence fan-out, adversarial verifiers) uses `/fable-loop` — inside
the autonomous cycles, per backlog item. Whenever work is claimed complete (yours or another agent's),
run a **`/fable-judge`** pass before presenting it as done — mandatory in the loops and in `/release`.
**KAIF adds one obligation at step 5, and it is stated HERE rather than inside the loop's own text:**
verification is not only *observed*, it is *produced*. New behaviour ships together with the artifact
that checks it — test suite, checklist, fixture, guard — planned in the SAME step, never "later"
(`TESTING_FRAMEWORK.md` → "The work produces its own means of checking"). Step 5 of the vendored loop
asks you to observe a check; this line is what obliges you to have made one.

The addition lives here on purpose. These skills are vendored **verbatim** from
[fable-method](https://github.com/Sahir619/fable-method) (Sahir619, MIT) and are kept byte-identical so
the sync ritual in their headers can diff against upstream and port changes without a merge. Weaving a
KAIF-specific clause into their text would fork the vendor and quietly break that ritual — so the
project's own obligations attach at the CALL POINT, which is this section. The sphere library plays the
role of their domain adapters for the same reason.

### Planning discipline — the task ladder (`/plan-task` · `/plan-epic`)

Nearly everything in this industry has golden standards, best practices, published research — or at
least documented practitioner lore. **A major epic feature therefore starts with a web recon of the
industry's golden practices and a research doc in `researches/`** — this extends "recon before code"
(checklist step 9) from *external truth* to *industry knowledge*: the state of the art is an external
truth too, and a session that skips the sweep re-invents solved problems badly.

**The heaviness test** (checkable, not taste). A task is HEAVY when **≥2** of these hold:
touches ≥3 subsystems or canon documents · rests on an external truth or an industry standard ·
does not fit one session · changes shipped composition or public contracts · needs owner-level
decisions. Otherwise it is ordinary.

- **Ordinary → `/plan-task`:** ONE operational plan — goal, done-criteria, steps with checkboxes,
  verification-by-observation, risks. Small enough? The plan lives as a section right inside the
  idea/bug document itself. Ceremony must never outweigh the work.
- **Heavy → `/plan-epic`** — the full ladder, each rung an artifact:
  1. **Research** — industry sweep (web) + local recon + the project's requirements, synthesized
     into a research doc in `researches/`. No code, no meta-plan before it exists.
  2. **Meta-plan** — one epic plan in `plans/`: phases, order, gates, acceptance criteria;
     vision-level forks go to `/interview` (work on unblocked phases proceeds meanwhile).
  3. **Operational plans per phase** — R&D · testing · mock-ups · development · debugging ·
     acceptance. Detail ONLY the next phase; the plan for phase N+1 is written when phase N closes —
     never all upfront (they would be fiction by the time you reach them).
  4. **Trace** — every operational step cites its meta-plan anchor line (the citing rule of
     checklist step 8); a step you cannot anchor is scope drift caught before the diff.

The ladder is not ceremony for its own sake: research is where the epic gets its evidence base,
the meta-plan is where the owner sees the whole shape once, and phase-by-phase operational plans are
what keeps a context-losing session executing the RIGHT next step instead of re-deriving the epic.

### Languages — two audiences, two languages

Agent-internal documents (this guide, `PHILOSOPHY.md`, `BUG_FIXING_FRAMEWORK.md`, `STATUS.md`,
`EXPERIENCE.md`, the maps, working notes in `plans/`/`bugs/`/`researches/`, the skills) are written and
maintained in **English** — the language models read most reliably. Owner-facing documents (`GOAL.md`,
`KAIF_FRAMEWORK.md`, the directory READMEs) and every chat report to the owner are in
**ru**. Keep this split as you create new documents.

### Experience log — `EXPERIENCE.md`

`EXPERIENCE.md` is the agent's growing, grep-friendly log of lessons (externalized memory of what works and
what doesn't). **Recall** relevant entries before a task (grep by tag); **capture** a short lesson after any
meaningful success or failure — in loops, do both without waiting for the human. Skill: `/experience`.
Boundary: `bugs/` = one doc per defect; `EXPERIENCE.md` = short cross-task, approach-level lessons (incl.
successes). Living reference — never DONE-tagged.

---

## Project identity (CANON — use these, don't invent)

| Field | Value |
|-------|-------|
| **Name / brand** | `KUMM` — Krinik Universal Mod Manager (confirmed by the owner, 2026-08-15) |
| **Short name** | `KUMM` (uppercase in prose; `kumm` stays the npm package id and the CLI command) |
| **GitHub repository** | `https://github.com/MikalaiKryvusha/kumm.git` |
| **Local project folder** | `D:\work\ai_sandbox\KUMM` |
| **Author / owner** | `Mikalai Kryvusha` (KOT KRINIK) |
| **License** | `MIT` |
| **Owner's working language** | Russian — chat, `GOAL.md`, `README.md`, `KAIF_FRAMEWORK.md`, directory READMEs |

> Keep one canonical spelling for names/paths/URLs and use it everywhere. If you find an old/renamed
> identifier in historical docs, normalize it to the canonical value above.

---

## Goal of the project

KUMM is the engine, framework and toolset for semi-automatic modded game builds. It downloads mods from
Nexus Mods on a FREE account (through a real logged-in Chrome on a debug port, which is what gets past
Cloudflare and the premium-only download API), tracks what has gone stale, and deploys a mod pack into
one or more game installations, verifying the result. Owner and first user: Mikalai Kryvusha, currently
for Palworld, with Oblivion Remastered next. The engine ships publicly; a mod pack is a private
collection living in its own folder with its own git.

---

## Architecture — the map

Two halves that never call each other. Their only contract is `modpack.json` plus the archive naming
scheme. Neither keeps state of its own.

```
kumm.mjs             ← entry point, Node ≥22, zero deps. Nexus half: CDP → Chrome →
                        version check (`check`), download (`update`, `get`), page recon (`eval`)
Deploy-ModPack.ps1   ← PowerShell. Game half: unpack sources, copy into every target,
                        write Engine.ini / steam_emu.ini, verify. Interactive menu with no switches.
<pack>/modpack.json  ← THE state. nexusGame, gameExe, library, mods[]. Lives outside this repo.
```

**RULE:** the engine is stateless — everything is re-derived from the manifest and from the library's
file names on every run. **RULE:** the game is data (`nexusGame` / `gameExe`), never a hard-coded value.

Full file map and data flows live in `PROJECT_STRUCTURE_EXTERNAL_MAP.md`; the abstractions and their
invariants in `PROJECT_ARCHITECTURE_INTERNAL_MAP.md`.

---

## Build

```bash
node --check kumm.mjs
```

There is no build step: `kumm.mjs` is a zero-dependency ES module run directly by Node ≥22, and
`Deploy-ModPack.ps1` is a script. "Building" means syntax-checking both halves:

```powershell
node --check kumm.mjs                                                    # JS parses
$null = [System.Management.Automation.PSParser]::Tokenize(
          (Get-Content Deploy-ModPack.ps1 -Raw), [ref]$null)             # PS1 parses
npm pack --dry-run                                                       # what an install actually ships
```

Gotchas: Node ≥22 is required (built-in `WebSocket`). `Deploy-ModPack.ps1` is written for Windows
PowerShell 5.1 — do not "modernize" it with `??`, `?.`, or `&&`. The npm `files` list currently ships
`kumm.mjs` only, so `npm i -g` delivers half the engine (recorded in the truth↔mirror table).

---

## Test harness (how the agent observes & drives the software)

There is no automated suite yet, and the honest reason is that both halves talk to the outside world:
one to Nexus through a browser, the other to game folders on disk. **The harness therefore builds
downward from the network**: the pure functions come first, then a fixture pack, then the live path.
Growing it is open backlog work — see `STATUS.md`.

What exists and is verifiable without a human, today:

| Command | What it does |
|---------|--------------|
| `node --check kumm.mjs` | syntax gate on the Nexus half |
| `node kumm.mjs help` | command list — the mirror of the switch block; diff it against the README table |
| `node kumm.mjs status` | is the debug port alive, who is logged in (needs Chrome; prints, never throws) |
| `node kumm.mjs check --json --root <pack>` | machine-readable staleness table — the golden-output surface for a fixture pack |
| `node kumm.mjs files <modId> --game palworld` | reads a live Nexus page; the canary for markup drift |
| `node kumm.mjs eval <url> <js>` | DOM recon when Nexus changes markup (single quotes only inside the JS on Windows) |
| `.\Deploy-ModPack.ps1 -ListMods -PackDir <pack>` | manifest parses, mods enumerate — no filesystem writes |
| `.\Deploy-ModPack.ps1 -Deploy -DryRun -PackDir <pack>` | full deploy plan without touching a game folder |
| `.\Deploy-ModPack.ps1 -Verify -PackDir <pack>` | objective post-state check; exit code 1 on trouble |

**The deterministic core to test first** (pure, no network, no disk): `parseArchive` ↔ `libraryName`
(round-trip), `sameFile`/`stamp` (upload-date comparison), `pickCard` (variant selection),
`parseArgv`, `globToRe`. These carry the logic that actually breaks, and none of them need Chrome.

**A fixture pack** — a throwaway `modpack.json` plus an empty `mods/` of correctly-named zero-byte
files — drives `check --json`, `-ListMods` and `-Deploy -DryRun` end-to-end with no network and no game
installed. Build it under the scratchpad, never inside the repo.

**Live-path rule:** anything that touches Nexus is rate-limited courtesy toward someone else's server
(README, "Оговорки"). Never loop live calls in a test; hit one mod, once, and cache what you learned
into a recon doc in `researches/`.

---

## Git workflow

Work ONLY in `main` — no feature branches. Commit incrementally and often; to undo, use git history
(`git revert`, `git checkout <hash> -- <file>`), not branches. Push to `origin`
(`https://github.com/MikalaiKryvusha/kumm.git`).

> Reconciliation with the fable-method **authorization gate**: this deployed guide IS the owner's
> standing authorization for routine commits/pushes per the policy above. Everything beyond it —
> releases, deploys, external sends/publishes, force-pushes, deletions of shared data — still requires
> the owner's quoted words (an `AUTH:` line).

**Non-negotiable git hygiene (each rule exists because its violation burned a real project):**

- **`git diff --stat` before every commit — of the set that is ACTUALLY LEAVING.** Anything in it you
  did not intend to change — STOP and explain it first. This includes diffs *your tools* generated
  (lock files, manifests, formatters): an agent trusts its tools even more blindly than itself — read
  those diffs line by line. The rule is only executable if the set you inspect is the set that ships:
  a commit tool that stages everything (`git add -A`) AFTER your inspection makes the two different
  sets, and the field cost was two of the owner's files leaving under an agent's message minutes
  after he dropped them into the tree. So the tool NAMES its set out loud before committing, and a
  NEW file in the tree stops a sweeping commit rather than riding along — declare the set instead.
- **Ignore first, then the tool.** Any new tool, export, dump, key, or binary enters the project ONLY
  after its `.gitignore` line exists. A secret caught by a gate is a success of procedure; a secret
  caught by the owner is a failure of the framework.
- **The owner's originals are inviolable.** A document from the owner is committed verbatim BEFORE any
  edit (checklist step 18) — never "improve" an original that isn't safely in history yet.

## Commits

Style: `feat:`, `fix:`, `docs:`, `refactor:`, `ci:` + one line of what was done.

**A commit that touches test files carries a justification block:** *why this test changed and what it
now guards*. A test edit without it is fraud by default (`/fable-judge` hunts exactly this — the quiet
fitting of tests to new behavior is the most documented agent failure). After changing behavior, also
answer: could the old tests now pass for the WRONG reason? If yes — rebuild the fixtures so each test
guards what it claims to guard, and say so in the commit.

End every commit message with the co-author trailer:

```
Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
```

Substitute your own agent/model identity if you are not that model. There is no commit/version tool —
commit with plain `git`. Commit messages are written in Russian in this project's history; keep the
`feat:`/`fix:`/`docs:` prefix and the trailer in English.

## Document & text hygiene (field-paid rules)

**Each document answers its own question — and takes its shape from its own kin.** README: *"what
is this and how do I use it"* (the product, present tense). Release notes: *"what changed in THIS
version, do I upgrade"* (strictly the delta; anything general is a LINK to the README — the
mechanical check: a paragraph pasteable into the README unchanged belongs in the README).
`STATUS.md`: *"where are we now"* — the living SUMMARY of the present (soft target ~200 lines;
`check` warns above it). `PROJECT_HISTORY.md`: *"the closed past"* — the append-only chronicle:
closed sessions/phases/releases MOVE there verbatim (the `/end-chat` bonsai trim) instead of piling
up in STATUS. `EXPERIENCE.md` and the knowledge dirs: *"why / how it went"*.
Updating the README — draw on the current README and the owner's other repo storefronts (one
storefront handwriting, not the agent's); updating the notes — draw on THIS project's previous
notes (`gh release view <prev>`). Mixing these scopes is a defect, not a style choice.

### The storefront — text a stranger reads

The storefront (README, release notes, a release page, a landing page) differs from a working
document in one way: it is read by someone who took no part in the work and is not obliged to know
a single one of our words. The rules below are paid for by a wave of twenty-odd defects the owner
found by eye in a single pass, and by the owner's own root diagnosis: "it reads as if you write
English in Russian words."

1. **A translated half is written FROM THE MEANING, never from the draft.** Having written a
   paragraph in the second language, read every sentence aloud: would a living person say this? If
   it reads as a translation, throw it out and say the same thought again without looking at the
   first version. Calque comes from the source language's syntax, not its lexicon, so a glossary
   does not cure it.
2. **An instruction addresses the reader; it does not describe the universe.** "Drop", "Tell",
   "Approve", "Fill in" — imperative. Impersonal "the file is placed", "the agent is told" turns a
   manual into a rulebook for nobody. The rule applies in procedure sections; in descriptive
   sections the passive is legitimate, because there the actor is the machinery. And the
   instruction must be EXECUTABLE BY THE ONE IT ADDRESSES: "add `--mode anonymous` to the loader
   call" is addressed to a human who never calls the loader — the agent does. Write what the human
   SAYS to the agent instead.
3. **No text ABOUT THE DOCUMENT ITSELF.** "Each skill has a row of its own in Table 3", "the manual
   counts 14 documents", "this document is the user manual" — the reader sees the table and the
   document with their own eyes. A navigation pointer to a section is fine; a description of how
   the text is built is not.
4. **A number stands without excuses.** Provenance of a number lives in the working document; the
   storefront carries the number. "(measured in epic 1.5 against exact artifact sizes)", "every
   number below is a quote of this run", a counting method inside a table cell — these defend the
   author against a suspicion of lying, and they tell the reader that the author is making excuses.
   Exactly one exception: the WINDOW BOUNDARIES of a metric over a period — without them a correct
   number lies.
5. **Direct statement: no hint of a second level, no denial next to a number.** "In reality", "as a
   matter of fact", "strictly speaking" tell the reader there is a backstage and invite them in.
   "The same work would have cost $3 509, and that money was not paid" — the second half undermines
   the first. Two facts side by side beat any explanation between them.
6. **An internal word expands into a human name.** "Calendar" → "Time spent on the version",
   "the pair" → "the human + agent tandem", "Tokens" → "Tokens spent by the models". A project term
   that genuinely belongs is named at first use. In table row labels, compressing meaning is never
   allowed.
7. **One quantity, one row.** Metrics glued into one cell save space and cost readability; a table
   is allowed to grow threefold.
8. **An estimate stands on a NAMED rate.** Every estimate constant carries an external source in
   the comment next to it, and the range is never wider than the source allows. A twentyfold spread
   is not an estimate — it is an admission of not knowing, and it does not ship.
9. **Private names do not ship.** Names of the owner's projects, clients and internal systems are
   replaced by a pseudonym that preserves the COUNT of independent witnesses; the list of private
   names lives in an ignored file, because a list of private names is itself private data.
10. **Checking the SOURCE is not checking the PUBLICATION.** Rendering rules belong to the foreign
    medium: a GitHub release body preserves line breaks, a README joins them, a PDF re-flows to its
    own width. Once shipped — OPEN the result and read the first screen with your eyes; make it a
    step of the release ritual, not a wish.

**TEXT TRAVELS THROUGH FILES, NEVER THROUGH COMMAND-LINE ARGUMENTS.** Feeding a tool Cyrillic (or
any non-ASCII), curly quotes, emoji, multi-line content, markdown, JSON? Write a UTF-8 file and
pass the PATH. No `python -c "…text…"`, no `-m "…"`, no `echo "…" > file` with non-ASCII. One
class, four unlike faces — recognize it BY SYMPTOM, they hit every Windows project (and face 3
reproduces in JS/JSON/YAML anywhere):

1. `python -c` + non-ASCII → `SyntaxError: (unicode error)` — or WORSE, silent mojibake written to
   the file (the console encoding corrupts the argument before the program sees it);
2. backticks inside double quotes → the shell's command substitution eats chunks of text, prints
   "ok", and the document gets HOLES — no error at all; caught only by reading the result back;
3. Windows paths inside strings → `truncated \uXXXX escape` (`\w`, `\u` read as escapes);
4. different shells are different worlds: GNU tar takes `D:\…` for a remote host while bsdtar
   doesn't; a Git-Bash `/tmp` file is invisible to Windows Python; PowerShell 5 `Set-Content`
   writes ANSI by default. Know WHICH shell you are in; before running a foreign script on
   Windows, check what `tar`/`curl`/`find` actually resolve to in the current PATH; record in the
   project docs which shell the build runs from.

Companions: after ANY machine edit of a non-ASCII document — READ THE RESULT BACK (face 2 cannot be
caught otherwise); prefer the file tools (Write/Edit) over the shell for editing text — the shell
runs processes, it does not carry content.

**The rule binds the ARGUMENT, not the document.** It covers ANY non-ASCII in argv — including the
agent's own housekeeping strings: a `print()`/`echo` reporting progress from a throwaway script, a
run label, a debug message. The temptation to file those under "not covered" is strong (no document
is edited, nothing ships) — and that is exactly how sessions that KNOW the rule break it. The cost
is asymmetric: the tool succeeds, the exit code is 0, the files are intact — the only thing
corrupted is the output a HUMAN reads, so the agent never sees its own violation and hears about it
from the owner. Keep argv of throwaway scripts ASCII-only; when the output must carry non-ASCII,
print it from the body of a script FILE.

**The truth↔mirror pairs registry.** The costliest field defects were not complex code but DRIFT
between a source of truth and its mirror: a deploy manifest pinning an old engine version while
prod ran a newer one, a comment contradicting the compose file it describes, a producer's contract
diverging from its consumer. A weak session updates the side it SEES and does not know the other
side exists. Keep a light registry — a table, one row per pair:
`truth → mirror(s) → the one-line check command`. `/end-chat` and `/release` run the registry's
commands and stop on drift; any new "X must match Y" enters the registry the day it is born.
A mirrored/generated surface is edited at its SOURCE and rebuilt — never patched in place (the
patch dies on the next rebuild, and the pair drifts again).
Drift is caught only by CHECKING PAIRS — never by reading one file, however carefully.

**A stamp carries the DATE AND THE TIME.** A bare date answers "which day" and loses the ordering
inside it — and the day is exactly where a project's decisions collide: three decisions on one date
read as simultaneous, a closure looks like it preceded the decision that caused it, and the session
that rebuilds the story guesses the order. So every stamp of a MOMENT carries both, in the owner's
local time:

- **Prose:** `YYYY-MM-DD HH:MM ±HH:MM` (`2026-08-08 07:13 +03:00`). **Machine receipts:** the same
  moment as full local ISO 8601 (`2026-08-08T07:13:00+03:00`) — one convention, two renderings.
- **Two moments, told apart:** *decided* — when the owner's word was said; *recorded* — when it was
  written down or committed. They differ, and the difference is often the interesting part.
- **Unlogged precision is never invented.** The exact minute was not captured? Write an honest
  `≈ 2026-08-07 10:05 +03:00`. An invented number is worse than a missing one (the three-doors rule
  in `PHILOSOPHY.md`).
- **What is a stamp:** decisions, closures of tasks/phases/bugs, milestones in a document's status,
  receipts the machinery writes. **What is NOT** (a date is enough, and demanding time there is
  noise): schema fields whose format the header norm defines (`Created:` — an ISO date), identifiers
  (the date inside an `EXPERIENCE` entry key among them), and dates of EXTERNAL events (a vendor's
  release, a third-party deprecation) — those are not moments of our decision.
- **Forward-only, by construction.** The convention binds from the moment the project adopts it;
  older date-only stamps are history and are NEVER rewritten (append-only — a correction is a new
  entry). A guard for this rule scopes itself by the stamp's OWN date: stamps dated before the
  adoption stay silent without any baseline file to maintain.

## Push / GitHub authentication

Git uses the Windows Credential Manager (`credential.helper = manager`) and `gh` 2.95.0 is installed and
authenticated — so `git push` and `gh issue create` work without extra setup. If a push is rejected as
non-fast-forward: `git pull --rebase` → resolve → retry. If credentials are ever lost:
`gh auth login` then `gh auth setup-git`.

Filing tickets upstream (the KAIF feedback contour, checklist "A defect in KAIF ITSELF") goes through
`gh issue create --repo MikalaiKryvusha/KAIF`. That is an outward-facing send on the owner's behalf:
it needs their word (an `AUTH:` line), and the body travels through a `--body-file`, never through a
command-line argument (the Cyrillic-in-argv rule below).

---

## Tools

| Command | What it does |
|---------|--------------|
| `node --check kumm.mjs` | syntax gate on the Nexus half |
| `npm pack --dry-run` | what an `npm i -g` actually ships |
| `npm run kaif:version` | KAIF version deployed here |
| `npm run kaif:check` | KAIF health check (doc set, markers, STATUS size) |
| `npm run kaif:update` | pull a newer KAIF from origin |
| `node .kaif/tools/kaif-canon-lint.mjs check` | canon linter (owner's canon artifacts — none declared yet) |
| `node .kaif/tools/kaif-provenance.mjs check` | `[AI]` provenance marks integrity |
| `node .kaif/tools/kaif-requirements-lint.mjs` | acceptance-criteria linter for plans/bugs/ideas |
| `gh issue create --repo MikalaiKryvusha/KAIF --body-file <f>` | file a KAIF bug/improvement upstream |

---

## Backlog & the DONE tag

So that the file listing alone tells you what's open vs. closed — **insert the word `DONE` into the
filename after the number when a file's task is completed and verified:**

```
bugs/04_modal.md                →  bugs/04_DONE_modal.md
ideas/07_dev_menu.md      →  ideas/07_DONE_dev_menu.md
```

**Rule (do this every time you work with bug/idea files):**
- Finished a bug/idea and it is CONFIRMED closed (status ✅, verified) — rename immediately, inserting
  `DONE` after the number: `git mv <NN>_<name>.md <NN>_DONE_<name>.md`.
- A file in progress / partial / research-only — do NOT mark `DONE` (🔧/🟡/🔬 = not done yet).
- Use `git mv` (preserves history). Don't change the number.
- Reference docs in `plans/` (master_plan, project_map, etc.) are NOT tasks — never tag them DONE.
- **Closing any idea/bug/plan requires a "Decisions made without the owner" section** — every
  micro-decision the agent made solo while executing, and how it chose (or an explicit "none"). An agent
  silently makes dozens of such calls; this section puts them on the owner's table, where a divergence
  from the vision costs one line to fix instead of a rework — and it is the best generator of the
  owner's next questions. Unsettled assumptions (fable `PENDING:` lines) are settled here too: each one
  *confirmed / refuted / asked*, never silently dropped.

**Owner's drive-by notes mid-task go to the backlog, not into a task switch.** When the
owner tosses an idea/improvement/bug into the chat while you are working on something ELSE: capture it
as a document right away (`/propose-idea` → `ideas/`, `/report-bug` → `bugs/` — note the source in the
header: "tossed by the owner mid-task, <date>"), confirm in one chat line ("recorded in ideas/NN —
continuing the current task") and return to the interrupted work. Do not drop the current task for the
note, and do not hold it in your head until the session ends — a session's head is the worst storage
there is. Classify first: the note CONCERNS the current task → it is a clarification, apply it; it is
vision-level → `/fix-vision`; it is an explicit "switch to this" → switch.

**A batch of bugs from the owner is one process incident.** When the owner's manual test pass brings a
WAVE of bugs at once, the wave itself is a symptom that the process leaked — worth more than any bug in
it. Fix the bugs; and on the owner's explicit ask ("figure out why so many") open a **process document**
in `plans/` — `owner's verdict (verbatim) → honest diagnosis of the process → remedies as process
changes → steps with checkboxes` — and execute it alongside the fixes. Health metric: the owner's next
wave is SMALLER. If the waves don't shrink, the remedies aren't working — revise them. The goal is not
"zero bugs"; it is "the owner stops finding them in batches."

**Backlog revision skill — `/check-backlog`:** walks `bugs/` and `plans/`, collects everything without a
`DONE` tag as the open backlog, and tags genuinely-closed files DONE (with a status section appended).

**Bug reporting skill — `/report-bug`:** hit a defect during dev/test — file a dedicated md in `bugs/`
by the canon, per `BUG_FIXING_FRAMEWORK.md`. The agent keeps its own bug backlog — one doc per defect,
nothing lost.

**A defect in KAIF ITSELF — the five-step contour** (an owner's field decision, adopted as canon:
*"if the AI agent noticed a defect in the KAIF work methodology, fix it in the local KAIF — and file
a bug report to the neighboring KAIF project, to the AI agent developing KAIF; it will then be fixed
in KAIF in a coming update"*). When the rake exists because of how the framework itself is worded or
behaves — not because of this project's code:

1. **Prove it is a CLASS, not a one-off:** reproduce it deterministically and search where else the
   same mechanism bites (the twin check; neighbor deployments on disk are read-only evidence — never
   edit them).
2. **Fix it LOCALLY, without waiting for upstream:** patch the deployed wrapper here (the doc, skill
   or guardrail that misled you); a guard born from the fix is proved by mutation — it must go red on
   the broken version first (`BUG_FIXING_FRAMEWORK.md` → Guards).
3. **File the signal** — skill `/report-bug`, its framework branch: `bugs/KAIF/` by template A (bug
   report) / B (improvement request), dedup attestation first; delivery follows the deployment's
   tracking mode (origin — on the owner's behalf through the send gate; anonymous — local only,
   never reach for the origin).
4. **Point the ticket at the local fix** (its "Local remediation" field): your local divergence and
   the upstream fix must be reconcilable at the next `/kaif-update` — a noted divergence is a merge
   the update sees coming; a silent one is a conflict it steps into.
5. **Close the loop at home:** capture the reusable lesson in `EXPERIENCE.md` (skill `/experience` —
   the same discipline as after any meaningful failure), keep the defect visible in `bugs/KAIF/`
   until an update actually retires it, and add a `STATUS.md` line if it changes how the next
   session works.

**Proposing principles — a standing order.** The owner of KAIF explicitly directs deployed agents
to bring new methodologies, principles, standards and frameworks into KAIF when they are GENUINELY
battle-tested by real-world production use — and to recommend retiring what does not work in
practice and only gets in the way (`PHILOSOPHY.md` → "The principle set is battle-tested, not
sacred"). The channel is the same feedback loop: an improvement request (skill `/report-bug`,
template B) whose field evidence names where the practice is proven (projects, hours, sources);
the fate of every proposal is the KAIF owner's decision — the framework's vision belongs to its
author. The frame is blameless: a weak model's failure is a signal of a missing guardrail, never
"the model is dumb".

**Idea proposal skill — `/propose-idea`:** had a worthwhile idea that fits the master plan and the
human's vision — file it as an md in `ideas/` with status "❓ awaiting human approval." An
agent's idea is a contribution to the product VISION → implement ONLY after the human approves.

---

## Decisions the agent must NOT make alone — interviews

Before a significant new feature, and whenever a brand/UX/architecture fork appears, conduct an
**interview** with the human using the `/interview` skill: closed A/B/C questions, recommendation first,
answered by the human directly in `interviews/interview_NNN_<topic>.md`. Never make UI/UX/brand/
architecture decisions without confirmation. Everything else — decide yourself with sensible defaults
and report in the chat.

Rule of thumb: *is it cheap to reverse?* If yes — decide yourself. If it shapes brand/architecture/UX
for the long term — interview.

**The place of questions — a hard rule.** Everything the agent wants FROM the owner — a fork, a
review, an approval, an answer — lives ONLY in `interviews/` (or an explicitly named decision-queue
document), never in the tail of a plan, research, or bug file. The one exception stays: the single
pointed task-level question in chat (above). Field fact: this rule gets broken even by agents that
KNOW it — chat is cheaper in the moment — so a project that adopts the practice keeps a mechanical
guard ("no unanswered questions outside interviews; every interview carries a status"; a guard of a
text rule runs ~10 false hits per real one — exceptions are explicit, with the reason on the line),
and a tool counts as ADOPTED only when a ritual contains the executable command that shows
violations ("show all unanswered interviews") — in the field such a guard surfaced two questions
nobody saw, hanging 5 and 13 days. The optional interactive contour on top (HTML render of an
interview, recorded one-click decisions) is `/owner-reviews`; an answer's force never depends on
the transport (equivalence rule in `/interview`: HTML = md = chat).

**Showing is an action, not a link.** Whatever the agent wants the human to PERCEIVE — a recon
doc, a report, a render, a PDF, a mockup, an image, a sound — the agent OPENS ITSELF. For the
agent the work feels shown when the artifact EXISTS; for the human it is shown when it is BEFORE
THEIR EYES, and the action between those two states belongs to the agent, who knows the path and
the command (the owner doesn't and shouldn't). "Lies at path…", "opens by double-click", "see
file X" addressed to the human are banned as a way of showing; name the path AFTER the show, as a
footnote of where it landed — never as an errand. No separate show tool: the review contour opens
any markdown (the show contour = the question contour, `/owner-reviews` I15–I17); without the
contour, open the file with the system opener. **The executor of this check is THE AGENT ITSELF at
the moment of sending, and that is said plainly:** before sending a reply, grep it for
"double-click / opens offline / see file / lies at" next to an artifact extension — a hit means the
show was replaced by a link. No machine can do it: the text being checked is your reply, it never
lands on disk, and no repository tool can see it. An earlier wording of this line claimed the rule
was "guarded mechanically" — indicative, about a check that did not exist, and a weak session reads
such a sentence as a guarantee already met. Exactly one mechanical half exists and it is named:
questions to the owner are guarded by the questions-guard axis "a question that dispatches into a
document". Field words that paid for this rule: "I will NOT open it by double-click! You are
forcing me to dig through project files again!"

**A QUESTION IS SELF-SUFFICIENT — the subject of the decision lives INSIDE it.** The rule above
covers artifacts; a question is not an artifact, and the gap let the same grievance return through
it: an agent wrote "the goals are listed in `researches/18`" and believed it had shown them. It had
not. Whatever the owner is deciding ON — the list, the order, the wording, the numbers, the two
variants — is QUOTED INTO the question as a table, a list, or a citation, however long that makes
it. A reference alongside the quoted content is legitimate: it confirms rather than dispatches.
A reference INSTEAD of the content is the defect, and it is guarded mechanically, because the owner
had already said it many times before it was written down: "do not send me digging through MD
documents! An open question must be sufficient for me to understand the matter being decided!"

**The taste class — a criterion the agent cannot measure.** The canon covers measurable criteria
(verify by observation, `TESTING_FRAMEWORK.md`) and vision forks (`/interview`) — and between them
lies a third class: the acceptance criterion is a PERCEPTION adjective (beautiful, natural,
pleasant, readable, "feels right") — grep-detectable in the ask. There the agent does not conclude;
it **produces a MOCK-UP and files homework**: find the live best candidates → mock them QUICKLY on
OUR OWN material → hand the human an ARTIFACT to perceive (never a link, never someone else's
benchmark — a human judging sound needs sound, not a score; in the field both suggested demo URLs
turned out dead) → record the verdict as canon (the owner's taste is not re-litigated by the
agent). Comparison contract: all candidates on ONE same material, blind labels, the key stored
beside them. The homework doc carries two standing fields: *"ready to see/hear right now"* (paths
to artifacts) and *"verdicts already given"* (so no verdict is ever asked twice).

**Action permission ≠ identity authorship.** A blanket "go ahead, don't ask me" removes
confirmation FRICTION on actions; it never transfers authorship of IDENTITY — naming: release
codenames, product and feature names, slogans, any brand string a human reads first (the test: it
is read first and says how the product presents itself). Identity is NEVER the agent's decision,
under any breadth of approval — a wide "yes" quietly disguises a taste question as a technical
detail of shipping, which is exactly how the field incident happened. The right move under blanket
approval: do everything else and ask ONE pointed question about the name. The fallback: ship under
a neutral factual title — never a placeholder name (still a name someone must un-decide). Every
shipped name carries a source artifact (*owner · channel · date*), and a brand mistake is fixed
only by the owner — un-naming is a brand decision too. (`/release` Step 0 enforces this at the
decision point; `/fable-judge` hunts a shipped name with no source artifact.)

**Write-gate on the owner's canon artifacts** (rules, lore, brand texts, product docs — anything where
the owner's word IS the content): **new entities** (mechanics, facts, decisions) enter only through a
draft to the owner (interview/chat) and their "yes" — never straight into the canon; **mechanical edits**
under already-accepted decisions (renames, arithmetic, references, notation) go ahead immediately but
stay visible until the owner has reviewed them. Two-stage control: first the *intent* (before writing),
then the *text* (the owner's read-through). Nothing dissolves into the canon silently, and the corridor
for mechanical work stays wide (see the three-doors rule in `PHILOSOPHY.md`).

**Provenance marks — `[AI]…[/AI]` / `[AI-ed]…[/AI-ed]`** (canonical English strings, grep-friendly,
like `[NOT-TESTED]`). Everything the AI writes into the owner's canon artifacts carries a visible
paired mark: `[AI]…[/AI]` — written by the AI; `[AI-ed]…[/AI-ed]` — the owner's text, edited by the AI.
**A mark IS the acceptance queue:** only the owner's word removes it ("the chapter is accepted") — the
agent NEVER unmarks its own text. One mechanism buys three things: *trust* (the owner sees exactly what
is theirs vs. generated — proofreading becomes scanning marks, not rereading everything), *rollback*
(an unaccepted block is safe to remove), and *safety for future agents* (never take unaccepted `[AI]`
text for the owner's canon). The check is grep-cheap: AI text in a canon artifact without a mark — or a
mark removed without the owner's word — is a fraud `/fable-judge` hunts. Mark at write time. The check
IS mechanized (optional module, shipped): declare the canon in `.kaif/kaif.json`
(`"canonArtifacts": ["rules/", …]`) and wire `node .kaif/tools/kaif-provenance.mjs check` into your
gates — pair integrity + marks-only-in-declared-canon; `report` lists blocks awaiting acceptance;
`accept <file>` strips marks into the registry and carries the OWNER'S word only.

**The SHOWCASE is exempt, and the exemption is named by file.** `README` and the release notes never
carry provenance marks (owner's decision, quoted: *"README and the release notes are not subject to
the mandatory provenance-mark rules `[AI]`"*). The reason is mechanical, not aesthetic: these two are
PUBLISHED as-is, so a mark inside them ships scaffolding to every reader and reads as unfinished
work — while a mark's whole purpose is to be an internal acceptance queue. The queue for the showcase
is a different one and it stays mandatory: the owner PROOFREADS it (file the request as homework),
and until they do, the text is unaccepted exactly as a marked block would be. Two boundaries keep
this from eating the rule: the exemption lists FILES, never a category ("public documents" would
swallow the whole canon), and it covers only text ABOUT the product — the owner's own words quoted
inside the showcase stay their words and are edited only mechanically (orthography, links,
arithmetic).

**Strictness modes — slow is fine when it is visible.** Name the mode a piece of writing runs under:
- **draft** — fast, OUTSIDE the owner's canon: sketches, research notes, ideas, spikes. No
  styleguide, no marks, no canon linter — cheap by design. A draft never silently becomes canon.
- **canon** — anything entering the owner's canon artifacts walks the full pipeline: approved
  styleguide (`/derive-styleguide`) → write with provenance marks → canon linter green
  (`.kaif/tools/kaif-canon-lint.mjs check`, guards proven by `selftest`) → provenance gate green →
  the owner's acceptance.
Model split (mark it in skills and task items): mechanical steps — running linters and gates,
renames, arithmetic, re-syncs — any model; judgment steps — deriving the styleguide, canon wording,
acceptance calls — a strong model only. Everything machine-checkable is checked by CODE; LLMs keep
the judgment — this split is the operational face of one principle, `PHILOSOPHY.md` → «Code before
cognition» (80% deterministic / 20% the model); it is stated once there and applied here.

Task-level ambiguity (which of two deliverables did the human mean *right now*) is NOT an interview:
per fable-method Step 0, ask exactly **one pointed question** in the chat that states your recommended
interpretation. Interviews are for vision-level forks that outlive the task.

---

## Code style

Read the two engine files before writing in them — they have a strong, deliberate handwriting, and
matching it matters more than any rule below.

- **Comments explain WHY, in Russian, and name the field incident that paid for the line.** This is
  the project's signature: `// Дата загрузки надёжнее версии: авторы перезаливают файл, не трогая
  номер (WorldSettingsUnlocker)…`. A comment restating what the code says is noise; a comment naming
  the mod that broke the assumption is the project's memory. Keep them Russian in `kumm.mjs`; keep the
  English `.SYNOPSIS`/`.DESCRIPTION` in `Deploy-ModPack.ps1` English (Russian appears there only where
  it explains a Russian-language decision).
- **`kumm.mjs`:** ES modules, `node:` prefixes, 2 spaces, no semicolons, arrow one-liners for the tiny
  helpers (`norm`, `squash`, `stamp`, `sameFile`). Zero dependencies is a hard constraint, not a
  preference — a `package.json` `dependencies` key is a design change, not a commit.
- **`Deploy-ModPack.ps1`:** Windows PowerShell **5.1** — no `??`, no `?.`, no `&&`/`||`, no
  `-AsHashtable`. Verb-Noun function names, `Say`/`Head`/`Ok`/`Warn`/`Bad` for all output.
  `$ErrorActionPreference = 'Stop'`.
- **No magic numbers** — named constants with clear names.
- **The game is never hard-coded.** Anything Palworld-specific reads from the manifest (`nexusGame`,
  `gameExe`, `library`, `steamEmu`) with Palworld only as the documented fallback.
- **A parser and its writer change together.** `parseArchive` ↔ `libraryName` must round-trip; touching
  one without the other is the defect class this project is most exposed to.
- **Canonical order for everything compared or cached:** any output that is diffed, deduplicated, or
  cached must be deterministic — sorts with a full tie-break, serialization with sorted keys, no
  `Date.now()`/random in compared output. `check --json` is such an output.
- **Courtesy toward Nexus is a code rule, not a manner.** No batching, no retry storms, no parallel
  page loads; the tool reproduces exactly the request the site makes when a human clicks.

---

## Notes from the human

From this project's owner (recorded 2026-08-15, at the KAIF deployment):

- **Working language is Russian.** Chat, `GOAL.md`, `README.md`, `KAIF_FRAMEWORK.md` and the directory
  READMEs are Russian; agent-internal documents and the skills stay English (see "Languages" above).
  The README is the owner's own handwriting — edit it from the meaning, never as a translation, and
  never put `[AI]` marks in it.
- **This deployment is tied to origin.** Tracking mode `standard`: KAIF defects go upstream as tickets
  to `MikalaiKryvusha/KAIF` on the owner's behalf, through the send gate.
- The owner plays Palworld now and will play Oblivion Remastered next — the second game is the standing
  reason every game-specific value lives in the manifest instead of the code.

General guidance this framework was distilled from:
- Always check the current time and the log file's time before reading logs — read fresh logs, not stale ones.
- Work autonomously without interactive questions. If you need information from the human, write an
  interview document and pause the session (so the human is signaled to come answer), rather than blocking.
- If you find bugs in third-party libraries, file tickets for them via `gh` on the human's behalf.
- Actively test what you build, using whatever tooling lets you drive the software effectively.
- Periodically re-read and, where useful, improve your own guidance docs so a fresh session can be
  effective despite context loss. Steer and tune yourself toward maximum effectiveness and autonomy
  toward the stated goal.
