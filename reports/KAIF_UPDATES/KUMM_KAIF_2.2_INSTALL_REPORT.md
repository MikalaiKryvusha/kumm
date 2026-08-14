# KUMM — KAIF 2.2 install field report

> Project KUMM (Krinik Universal Mod Manager) · fresh install, thin-loader route · lang `ru` ·
> mode `standard` (origin-tracked) · Windows 11 Pro 10.0.26200 · Node v24.15.0 · agent claude-code
> (Claude Opus 5, 1M context), 4 systems mirrored · 2026-08-15, ≈ 01:00–01:15 +03:00.
> Every number below is a command's output.

## 1. Chronology with numbers

| Step | Result |
|---|---|
| `node -v` | v24.15.0 (≥18 satisfied, no install needed) |
| `KAIF-LOADER.mjs` written verbatim from the thin `KAIF.md` | byte-identical to the `FILE:` block — verified by extracting the block with `awk` and `diff`, not by eye |
| `node KAIF-LOADER.mjs --lang ru` | **exit 0**, single run, no retries |
| Artefacts fetched from `releases/latest/download` | `KAIF-CORE.mjs` 173 265 B · `KAIF-CORE-BUNDLE.md` 794 062 B — both sha256 ok |
| Machinery version | 2.2 (released 2026-08-08) |
| Files deployed | 236 new paths · 2 tracked files modified (`.gitignore` seeded ignore-first, `package.json` wired with `kaif:*`) · 1 kept (`GOAL.md`, pre-existing) |
| Manifest check | `✅ manifest satisfied: 79 files + 144 agent artifacts present` |
| Skills | 35 per system × 5 systems (`.claude` `.agents` `.grok` `.cline` skills + `.roo/commands`); 152 mirror copies re-synced twice during adaptation |
| `ru` language pack | 8 owner docs localized; 15 documents + all 35 skill bodies arrived in English by design |
| Adaptation task | 9 items, all checkpoints recorded; **1 gate refusal** (see §2) |
| Placeholder fill | 22 files: `AGENT_GUIDE.md` + 4 skills × 5 systems + `.kaif/spheres/programming.md` |
| Owner questions asked | 1 (canonical project name — answered **KUMM**) |

Project baseline at install time: 3 commits, first at 2026-08-14 23:57 +03:00 — KAIF landed on a
project roughly one hour old. Engine: `kumm.mjs` 637 lines, `Deploy-ModPack.ps1` 1003 lines, zero
runtime dependencies, no build step and no tests of any kind.

## 2. Friction and rakes

**R1 — the placeholder gate scans a surface the task item does not list.** Already filed upstream as
issue #3 from project KAGO (2026-08-09); this run is a **+1 observation**, not a new ticket. Verbatim:

```
$ node .kaif/kaif-core.mjs checkpoint placeholders
↻ re-synced 152 system skill copies from the canon
✖ placeholder <BUILD_COMMAND> still in .kaif/spheres/programming.md
✖ checkpoint placeholders REFUSED: 1 literal placeholder(s) remain on disk (listed above) — fill them in the canonical copies, then re-run
```

New detail this run adds to #3: **the refusal's timing depends on item order.** `scanPlaceholders`
(`kaif-core.mjs:1366`) adds the sphere library only when the marker's sphere is set and not `TODO`.
The task lists `sphere` as item 6 and `placeholders` as item 3 — so an agent working the items in the
printed order declares no sphere yet, the gate passes, and the refusal surfaces later at
`verify-final`, where it reads as a final-gate failure rather than as an unfilled slot. This run
recorded the sphere early, which is why the refusal landed on the item it belongs to. Recommending the
sphere be recorded before the placeholder item would cost one word of ordering and remove the
misleading late failure.

Cost: ~3 minutes. The gate behaved well — it named the exact file, so recovery needed no investigation.

**R2 — `kaif:*` wiring re-serializes the whole `package.json`.** New signal; filed as
`bugs/KAIF/01_package_json_reformatted_wholesale.md` (template B) and delivered upstream. The install
announces `+ wired kaif:* handles into package.json`; the diff is 31 lines, of which **5 are the
intended `scripts` block and 24 are whitespace-only rewrites** of the owner's compact hand-formatting.
Semantically empty, verified:

```
semantically identical apart from scripts: true
keys added: scripts
keys removed: (none)
```

It matters because the deployed `AGENT_GUIDE.md` orders the agent to stop at exactly this: *"Anything
in it you did not intend to change — STOP and explain it first. This includes diffs your tools
generated."* The framework's own machinery is what makes its own rule fire on the deployment's first
commit.

**R3 — no friction, recorded because it is load-bearing.** The `ru` pack's incompleteness warning is
long, arrives before any success line, and enumerates 15 documents "arriving in ENGLISH and needing
manual transfer". It reads at first glance like a partial failure with a manual task attached. It is
neither — it is by design, and the design is right (models read English more reliably). One word —
`INFO:` — ahead of it would settle that in the reader's first second.

## 3. What confused a cold agent (top 3)

1. **Where do `study` findings get RECORDED?** The item says *"Study the project gradually and record
   findings (what it is, build/test commands, architecture) — this replaces the old
   KAIF_DEPLOYMENT_PLAN.md"* and names no destination file. Every other item names its targets. This
   run put them in `AGENT_GUIDE.md` (Goal, Architecture, Build, Test harness, dossier) and the two
   maps; that is a guess, and a different agent would guess differently.
2. **Which copies are canonical?** The item lists `.claude/` paths only, but the same placeholders sit
   in `.agents/`, `.grok/`, `.cline/` and `.roo/`. Editing all five turned out to be harmless — the
   next checkpoint re-syncs the mirrors from the `.claude/` canon — but the task file never says the
   mirrors are generated, so an agent cannot know whether hand-editing them is required, wasted, or
   harmful. It is the second of the three.
3. **`<BUILD_COMMAND>` for a project with no build.** The gate demands a value; the honest value is
   "there isn't one". Filled with the syntax gate (`node --check kumm.mjs`) plus an explicit note in
   `AGENT_GUIDE.md` that no build step exists. A "not applicable, and here is why" affordance would be
   more honest than a command chosen to satisfy a scan.

## 4. Final state and judge verdict

**VERIFIED WITH CAVEATS.**

| Claim | What was observed |
|---|---|
| Loader written verbatim | `awk` extraction of the `FILE:` block + `diff` → byte-identical |
| Machinery authentic | both artefacts matched the manifest's sha256; checksum gate never bypassed |
| Deployment complete | `kaif check` → `manifest satisfied: 79 files + 144 agent artifacts present` |
| Placeholders gone | `checkpoint placeholders` → `placeholder scan ran clean` |
| Blast radius contained | `git status --porcelain` → 2 tracked files modified, both by the machinery; no engine file touched |
| Engine still parses | `node --check kumm.mjs` → OK · PowerShell tokenizer on `Deploy-ModPack.ps1` → 0 parse errors |
| Outward-facing action authorized | `AUTH:` owner said — *"По окончанию - отчёт в KAIF issues рипозиторий gh"* — covers the upstream delivery of this report and the tickets; nothing else was sent |

**Caveats — what a judge could NOT re-run here:**

- **The live Nexus path is UNVERIFIABLE in this session.** `kumm check`/`update`/`files` need a running
  debug-port Chrome logged into a Nexus account and the owner's private pack. Not assumed working —
  merely unchanged, which the diff proves.
- **The deploy path is UNVERIFIABLE in this session.** `Deploy-ModPack.ps1` needs a real game
  installation to verify against. Same standing: unchanged, not proven.
- **The 35 skills are deployed but not yet invocable.** The client reads its command list at startup,
  so `/fable-judge` could not be invoked as a skill this run; the judge pass was executed by reading
  `.claude/skills/fable-judge/SKILL.md` and running its steps by hand. The skills themselves are
  present on disk and manifest-checked; their invocation is unverified until the client restarts.

**Frauds hunted, none found:** no test file exists to weaken; no completion claimed without its command
output; scope stayed inside the deployment (the engine's two halves are byte-unchanged); the one
outward-facing action carries the owner's quoted words; no new binaries or dumps entered git; the
tool-generated diffs were read line by line and one of them became R2. Experience recall: no prior
lessons existed at task start (`EXPERIENCE.md` held only the seeded example); two were captured during
the run — `EXP-0002` (cross-shell `/tmp`) and `EXP-0003` (the placeholder gate's real scan set).

**Recommended action:** none blocking. The two upstream signals are filed. The project's own first
priority is unrelated to KAIF and now recorded in `STATUS.md`: KUMM has no automated check of any kind,
and its most exposed pair — `parseArchive` ↔ `libraryName` — is pure, network-free, and testable today.
