# Field report: KUMM — KAIF 2.7 → 2.9 update (bootstrap route bound by --rehearsal, two versions in one hop, language-pack ru deployment, Windows 11)

**Delivered upstream:** https://github.com/MikalaiKryvusha/KAIF/issues/153

> Project KUMM (Krinik Universal Mod Manager) · **route `bootstrap`** (thin `KAIF.md` → `KAIF-LOADER.mjs` → the 2.9 core, local
> `--source` of the sha256-verified release assets, `--rehearsal <sandbox receipt>`) · lang `ru`, language-pack deployment · tracking
> `origin` · 5 agent systems · Windows 11 Pro 10.0.26200 · Node v24.15.0 · Git Bash · agent claude-code (Claude Opus 5.5, 1M context) ·
> 2026-10-16 22:28 – (final gate in §5) +03:00. **Two versions in one hop** — 2.8 was never deployed here. Fourth KAIF lifecycle run on
> this deployment (install 2.2 on 2026-08-15, 2.2 → 2.5 on 2026-09-05, 2.5 → 2.7 on 2026-09-18). Every number below is a command's output.

**Deviations first.** None from the framework's side that cost a merge or lost a line: the pass was mechanical, the rehearsal predicted
it (counters, task file), the 2.8 fixes of our own tickets #72 and #73 worked in the field, and the bundle-vs-disk sweep found nothing
outside `AGENT_GUIDE.md`, the file whose 11 modules the task carried for the hand merge. The 2.9 anchoring of the ignore lines (#130)
was confirmed live: it un-hid two pointer files of this tree. The executor's deviation leads: our own sweep gave a false positive on
multi-line template slots, and **my first fix of it blinded the guard to real losses** — an independent judge proved it with a mutant;
the second version is re-proven on that mutant (R1). Framework-side, small: the withdrawn-phrases recheck keeps listing records of the
withdrawal (R2); the hooks README smoke probe gives a false negative when an agent runs it through a tool layer that eats a backslash
(R3); the 2.8 table move left 44 English table rows to render into the owner's language by hand (R4); the pass substituted this
project's fills into the reference's own explanation of the slots (R6).

## 1. Chronology with numbers

| Step | Result |
|---|---|
| Entry | the creed and the prayer said in chat; `AGENT_GUIDE.md` and `STATUS.md` read whole; the 2.7 field report and `EXPERIENCE.md` lessons EXP-0032/0033/0035/0117/0118 recalled before the first command |
| Pre-flight | marker `2.7`, `tracking: origin`; `git status --porcelain` → 1 line (an untracked owner PDF, outside the update); `gh release list` → `v2.9` Latest, published `2026-10-16T16:34:45Z` |
| Assets | `gh release download v2.9` → `KAIF-CORE.mjs` 428 432 B, `KAIF-CORE-BUNDLE.md` 1 953 491 B, `KAIF.md` 15 353 B; `sha256sum` of core (`e3d627b1…`) and bundle (`ce089603…`) equal the pins in `kaif-manifest.json`; the v2.7 bundle downloaded for the sweep |
| Route | bootstrap, not `update`: the `update` route would run the interval with the deployed 2.7 core, i.e. without the 2.8 fixes of #72/#73 and without the 2.9 withdrawn-places listing (release notes 2.8 item 6, 2.9 item 6) |
| Loader | lifted from `KAIF.md` by `awk` between the six-backtick fences → 9 386 B, 149 lines, `node --check` OK |
| Sandbox | `git -c core.autocrlf=false archive HEAD \| tar -x` → 894 files, 23 MB; `node KAIF-LOADER.mjs --lang ru --source <rel-2.9>` → **exit 0**; `pre-update backup: 100 file(s)`; `hand-filled slots recognized (4)`; `AGENT_GUIDE.md: baseFound 30 of 30, ceiling 4 → merged`; `bootstrap classified … 49 replaced, 12 modules merged in-place, 2 added, 51 kept`; `KAIF_UPDATE_TASK.md (11 items, 2 files with module diffs)` |
| Live pass | same loader, same `--source`, `--rehearsal <sandbox>/.kaif/last-update.json` → **exit 0**; `rehearsal verdicts loaded … (1 file(s))`; counters identical; the two logs minus `= kept existing` differ by 3 lines (the rehearsal line; `.roo/rules/kaif.md` and `.clinerules/kaif.md` — written in the SANDBOX only: live they already existed, hidden from git by the bare `KAIF.md` ignore line on this case-insensitive git, so `git archive` never exported them; origin #130, which 2.9's `/KAIF.md` anchoring cured — both now show as new files and are committed with this update); `cmp` of the two task files → identical; `grep -c "^- \*\*verdict-mismatch"` → 0 |
| Sweep (own guard, EXP-0117) | `node tools/kaif-update-sweep.mjs <2.7 bundle> <2.9 bundle>` right after the pass → `сверено файлов: 83 · … · недоехавших строк: 65` (= files judged 83, undelivered lines 65), all 65 in `AGENT_GUIDE.md`, the file whose 11 modules the task carried (lines not mapped to modules one by one); after the merge → 4 (R1) → after the second version of the tool fix → 0, exit 0 |
| Hand merge | `AGENT_GUIDE.md` 11 modules, `reports/README.md` 1 module (our 2.7 local divergence is now the template's own text). The 2.8 move: the filled tables of "Test harness" (9 command rows + the core-to-test-first paragraph + fixture pack), "Environment dossier" (15 rows), "Tools" (20 rows) and the push recipe → new `HOUSE_RULES.md` (Russian, 130 lines at the final gate); "Goal of the project" → pointer to `GOAL.md`; "Architecture — the map" → the invariant only (its diagram and both rules were already in the two maps). `AGENT_GUIDE.md` 1 419 → 1 226 lines at the final gate. Creed, prayer and the prayer-cadence line untouched |
| Standing falsehood cured on the move | the guide's "There is no automated suite yet" — false since 2026-09-08 (`test-parse-archive.mjs`, `0a11fff`; four `test-*.mjs` since 2026-10-14); rewritten in the guide and in `HOUSE_RULES.md`. Found by the judge: `STATUS.md`, the fixture tool's header and my first `HOUSE_RULES.md` row still said the stand had "10 checks, no deploy, no `-Verify`" — `node tools/fixture-pack.mjs` → 20 `OK` lines including a real `-Deploy` and `-Verify` (since `84e4ba4`, 2026-10-15); corrected in all four places |
| Instruction slots (2.9 `check`) | `check` named 7 template instruction slots never filled since the 2.2 install: `/end-chat-soft` steps 3–4, `/end-chat-force` step 2, `/release` steps 2, 3, 4, 6 → replaced with this project's commands (no release tool and no release yet — said so in step 6) |
| wire-hooks | `node .kaif/kaif-core.mjs wire-hooks` → `4 of 4 KAIF hooks added; a new file` (`.claude/settings.json` did not exist; the project's own hooks live in the git-ignored `settings.local.json`); `review.mjs --search` before it → 12 hits in 5 files, none an owner decision about hooks; Codex by hand: `.codex/hooks.json` from `sample-codex-hooks.json` (SessionStart compact/clear + UserPromptSubmit timer); Grok reads `.claude/settings.json`; Cline and Zoo Code have no hook mechanism (README table) |
| Hook smoke (README step 3) | from the project root: timer → its JSON order (`last refresh 834 min ago`); resume-word → silent with the README's `printf` line (R3), its order with a JSON built by `node`; no leading word → silent; session-start (`{"source":"compact"}`) → its order. All exit 0 |
| Closing gates | attribution lint `STOPS`: 6 NEW findings, all lines written 2026-10-10…14 before this update; `--write-baseline` refused to adopt them without `--adopt-new` (good); all 6 grounded instead — 4 by the owner's verbatim quote/address on the line (found in the same documents, beyond ±2 lines), 2 by `attribution-ok` (lines that say the owner WILL decide). Then `--write-baseline` → 12 entries in the 2.9 fingerprint format, debt unchanged. Experience lint → `0 findings`, the history folded into one line (`88 failure entries … predate the first classed entry`) |
| withdrawn-phrases | 13 places listed by the task: 4 skill mirrors (`AGENT_GUIDE.md → Tools`) cured by `sync`; `ideas/06_DONE_*` re-pointed to `HOUSE_RULES.md`; 8 are records of the 2.7 withdrawal (history sections of `KAIF_FRAMEWORK.md`, a decision-log row of `MASTER_PLAN.md`, the context of the closed interview #001) and stay; `checkpoint recheck` lists the same 8 (R2) |
| Tickets | origin #72 #73 #78 #80 #81 #82 CLOSED → `bugs/KAIF/03–08` tagged DONE after a field check each (03 not re-exercised — no pre-renamed heading this interval; 04 by the probe below; 06 by the fold line; 07 by the skill text; 08 by `--search`); #140 OPEN (deferred to 2.10 by the origin) → `09` stays open |
| #73 acceptance | `node tools/kaif-update-probe-matchfills.mjs .kaif/kaif-core.mjs` → the fill with `<pack>` is derived (`"<TEST_HARNESS>":"Deploy-ModPack.ps1 -Verify -PackDir <pack>"`), not `null`; the three loop skills moved as `replaced … (fills kept)` |
| Owner queue | `review.mjs --queue --list` → 4 interviews waiting (011–014), each already shown; no owner debt |
| Gates | `sync` → `re-synced 175 system skill copies`; `check` → `✅ manifest satisfied: 102 files + 152 agent artifacts present`, `entry cost: … ~ 95k tokens — 10 %`; `node tools/test-guards.mjs` → `151 of 151 as expected`; checkpoints `policy-changes` … `recheck` (9 of 11) recorded, `stale-claims` and `closing-gates` and `recheck` executed by the checkpoint itself |

## 2. Rakes — severity, verbatim evidence, cost, repro

### R1 — S2 — executor-side: the sweep's false positive, and my first fix that blinded the guard

Not a framework defect. `tools/kaif-update-sweep.mjs` skipped one-line placeholders but not the continuation lines of a multi-line
instruction slot the project had replaced with its own text (`недоехавших строк` = undelivered lines):

```
## AGENT_GUIDE.md — не доехало строк: 4
  529: prefer deterministic reproduction and objective verification over eyeballing.>` Grow this tooling
 1070: `<High-signal guidance from the project owner that changes how the framework itself works here — each note in rule
```

**First fix (22:39), wrong:** any line with inline code starting `` `<letter `` opened a "slot", and an unclosed one hid the rest of
the file. My cases only checked that the 61 pre-merge lines stayed red. The independent judge deleted two real 2.9 lines (not slots)
in a copy of the tree: the patched tool said `недоехавших строк: 0`, exit 0; the HEAD tool named both. His breadth probe: the rule hid
106 lines new in 2.9 (about 8 of them real slot lines) and never closed in 4 files. The guard had been weakened into issuing false
confidence — the exact class `TESTING_FRAMEWORK.md` gate 5 names.

**Second fix (23:08):** a slot is `` `<Capitalised-word … `` with no backtick to the end of its line; `` >` `` or a blank line closes
it. Cases with addressees named before the run: the judge's mutant → both lines named, exit 1; the pre-merge sandbox → 61, exit 1;
the live tree → 0, exit 0; an unreadable input → exit 2; breadth → 8 hidden new lines, all genuine slot lines, 0 unclosed slots. Run
report: `testcases/reports/2026-09-18_kaif-update-sweep.md` §8. Cost ≈ 35 minutes, of which ≈ 20 the judge's.

### R2 — S3 — withdrawn-phrases lists records of the withdrawal on every recheck

After the edits, `checkpoint recheck` still prints 8 places, all of which RECORD the 2.7 withdrawal rather than build on it:

```
ℹ withdrawn phrases (2.7 → 2.9) — places left now: The machinery found 8 place(s) …
    · KAIF_FRAMEWORK.md:112 «DELIVERY:»          (- **Строки `DELIVERY:` больше нет.** — "there is no DELIVERY: line any more")
    · MASTER_PLAN.md:136 «delivery metric»       (a decision-log row of 2026-09-05)
    · interviews/interview_001_delivery-metric.md:12 «DELIVERY:»   (context of an interview whose status is closed)
```

The task's own rule says such lines "stay as they are", but nothing lets a project declare it, so the same 8 come back on every
future interval. Wish: honour a marker on the line (as `KAIF-VERSION-OK` does for stale claims), or skip interviews whose status the
queue already reads as closed and decision-log tables. Cost ≈ 5 minutes per interval. No separate ticket: the same class is R4 of
the Unliminium 2.8 → 2.9 field report (#148) — this is the second field for it.

### R3 — S3 — the hooks README smoke gives a false negative through an agent's tool layer

**Ticket: #151** (`bugs/KAIF/11_*`).

`.kaif/hooks/README.md` step 3, POSIX block, line 2: `printf '{"prompt":"resume\\nplan the day"}' | node .kaif/hooks/prompt-resume-word.mjs`
must print the order; it printed nothing. Cause, measured: the agent's Bash tool layer delivered `'a\\nb'` to the shell as `a\nb`
(`printf '%s' 'a\\nb' | od -c` → `a \ n b`), so `printf` produced a raw newline inside the JSON string and the hook (correctly) stayed
silent on invalid JSON. With a JSON built by `node` the hook prints its order. The recipe is right for a human shell; the smoke is run
by agents. Wish: a backslash-free probe line, e.g.
`node -e "process.stdout.write(JSON.stringify({prompt:'resume'+String.fromCharCode(10)+'plan the day'}))" | node .kaif/hooks/prompt-resume-word.mjs`.
Cost ≈ 5 minutes.

### R4 — S3 — the 2.8 move of project facts into the owner's language is a hand translation the task does not mention

**Ticket: #152** (`bugs/KAIF/12_*`). An independent judge found one rendered row whose Russian inverted a guard's logic and ≈ 23
smaller language defects in the first draft — all fixed before the commit.

`.kaif/_house-rules-template.md` says the copy "is written in the project's working language, headings included"; the rows the 2.8
migration moves out of `AGENT_GUIDE.md` are English (44 table rows here — 9 + 15 + 20, several of them paragraph-long hook descriptions with the
owner's quotes). The `language-arrivals` item names only the template file, and the 2.8 news says "move your tables … into
`HOUSE_RULES.md`" without saying that on a language-pack deployment the move is a rendering. Done here by hand: headings Russian with
the English section name in parentheses (the guide and the skills point at the English names), commands, paths and quotes verbatim.
Wish: one sentence in the 2.8 migration note, or English section names kept as anchors in the skeleton. Cost ≈ 25 minutes.

### R5 — observation — the shared `<TEST_HARNESS>` fill now points two hops away

This project's `<TEST_HARNESS>` fill ends `full table in AGENT_GUIDE.md "Test harness"`; after the 2.8 move that section holds a pointer
to `HOUSE_RULES.md`. Changing the fill means changing it in all four files that carry it, or the next update stops recognizing it, so it
was kept. Wish (cheap): the 2.8 migration note could name fills that point at a moved section.

### R6 — S3 — the pass filled this project's values into the reference's explanation of the slots

**Ticket: #150** (`bugs/KAIF/10_*`).

Found by the judge. At HEAD, `.kaif/KAIF_REFERENCE.md` (line 297) explained the slots the machinery cannot fill by naming them:
`<BUILD_COMMAND>`, `<TEST_HARNESS>`. After the pass (line 308) the same sentence reads:

```
slots the machinery could not fill (`node --check kumm.mjs`, `node kumm.mjs check --json / … full table in AGENT_GUIDE.md "Test harness"`, the co-author line)
```

The sandbox copy shows the same text, so the machinery did it, not the hand merge: the fills derived for the project were applied
to text that names the placeholders as placeholders. Harmless here, wrong in principle — the reference now explains the slots with
one project's values. Wish: never apply fills inside a sentence that names the slots (a marker, or the reference's own list of
slot names exempt from substitution). Cost ≈ 0 for us; left as delivered.

## 3. What was exercised vs NOT

**Exercised:** the bootstrap route with `--rehearsal <receipt>` and a local `--source` (0 mismatches) · the sandbox export with
`core.autocrlf=false` · fills with `<`/`>` derived (#73 fix) · the rename map on two untouched files (`.kaif/hooks/README.md`,
`.kaif/INTERACTIVE_CONTOUR_SPEC.md`: `renamed … replaced with the file`) · the 2.8 house-rules move · withdrawn-places listing in the task
and in `checkpoint recheck` · `wire-hooks` on a missing `.claude/settings.json` · a Codex sample merged by hand · the hook smoke ·
`kaif-attribution-lint` refusing to adopt NEW findings, then the 2.9 baseline format · the instruction-slot axis of `check` · the
experience-lint fold · `review.mjs --search` and `--queue --list` · the executing checkpoints (`stale-claims`, `closing-gates`, `recheck`) ·
`sync` · `report` (this report).

**NOT exercised:** the `update` route · `--baseline` · `--force` · `--channel main` · the `verdict-mismatch` freeze · `diff --render` ·
`owner-voice-core` and `kaif-voice-lint` (no `AUTHOR_STYLOMETRY.md` here — SKIPPED; `HOUSE_RULES.md` and the `KAIF_FRAMEWORK.md` section
were written by the project's Russian-writing rules, not by a portrait) · `archives` · the contour page, `--wait`, `--call` · the explain-page
template · retired-hook removal (never wired here) · `/team-deployment`.

## 4. Wishes for the next version (by cost, descending)

1. **A declared "record" for withdrawn phrases** (R2) — a line marker or a rule that skips closed interviews and decision logs.
2. **The 2.8 migration note for language-pack deployments** (R4) — say the moved rows are rendered, or keep English anchors.
3. **A backslash-free smoke line in `.kaif/hooks/README.md`** (R3).
4. **Name fills that point at a moved section** in the migration note (R5).
5. **Positive signal to keep:** the sandbox predicted the live pass for the third interval in a row on this deployment (2.5, 2.7,
   2.9); the 2.8 fixes of #72 and #73 held in the field; the 2.9 anchoring of the ignore lines (#130) un-hid this tree's
   `.clinerules/kaif.md` and `.roo/rules/kaif.md`, which a bare `KAIF.md` line had kept out of git since 2026-09-18; `kaif-attribution-lint --write-baseline` refusing to bury new findings is the
   right default — it made the executor ground six lines instead of hiding them.

### R5a — observation — the release step-6 code comment is kept verbatim on purpose

The first judge asked to make the `# bump version (in version.json or your manifest)` comment of `/release` step 6 say
`package.json`. Doing so turned our sweep red (`.claude/skills/release/SKILL.md — не доехало строк: 1`, the line is new in 2.9), so the
comment was reverted to the template wording; the step's own prose names `package.json`. A deliberate local edit of a NEW
upstream line is indistinguishable, for the sweep, from a lost one — kept that way.

## 5. Final state and the judge verdict

**Final state (gate at 2026-10-16 23:30 +03:00).** `.kaif/kaif.json`: KAIF 2.9 (released 2026-10-16), tracking origin, lang ru, history
`2.7 → 2.9, route bootstrap, 2026-10-16T22:30:33+03:00`. `check` → `✅ manifest satisfied: 102 files + 152 agent artifacts present`
(its one warning — this report not yet delivered); sweep → `недоехавших строк: 0`, exit 0; `kaif-attribution-lint` → new 0, debt 12;
`kaif-guard-lint` → OK, 10 blocks; `node tools/test-guards.mjs` → `151 of 151 as expected`; `node tools/fixture-pack.mjs` → 20 `OK`.
Engine files, `README.md`, `GOAL.md`, `package.json` untouched. KAIF tickets of this update: #150, #151, #152 (all OPEN).

`REAL WORLD:` accumulated — the update ran on the owner's live tree, verified there (`check`, the sweep, the lints, the mirrors).
Data and machine — the owner's agent client: the refresh-timer hook wired into the new `.claude/settings.json` FIRED in this very
session on the owner's next prompt ("KAIF context refresh (timer: last refresh 857 min ago …)"), so Claude Code reads the file; the
other three hooks are smoked by hand only. Codex (`.codex/hooks.json`), Grok Build, Cline, Zoo Code — never run here: not verified
there, waits for a session of each. Path — the first `/end-chat-soft` runs `check --gate-budgets` with the 2.8 ratchet; it was run as
the LAST step of this update (below).

**The rule changes of this interval — accepted with the version, none collides with a recorded owner's decision:**
1. [2.8] The field report of every update and install is sent to KAIF without asking the owner — in KUMM since 2026-09-18 by his word.
2. [2.8] The closing gate of the size budgets is a ratchet over `.kaif/budget-baseline.json`.
3. [2.8] The owner's question page stays open after a save; answers are saved one at a time.
4. [2.8] When the agent needs the owner's hands or a quick answer, it calls (sound → banner → voice); quiet hours hold.
5. [2.8] "Not reproduced" only after a hunt of at least three variants; developer bug reports take template C.
6. [2.8] An owner's verbatim archive may be declared and judged by its digest — not declared in KUMM.
7. [2.9] Rule changes of a release are accepted with the version and named in the report and the farewell, not asked.
8. [2.9] Delivered hooks are wired without asking (`wire-hooks` here: 4 hooks into a new `.claude/settings.json`; Codex by hand).
9. [2.9] An attribution lint arriving without a baseline records the inherited debt once — here the baseline existed; 6 new
   findings were grounded instead, debt stays 12.
For the owner, in Russian: `KAIF_FRAMEWORK.md` → «Что изменилось в 2.8 и 2.9».

**Judge verdicts.** Two independent clean-context passes, read-only on the project.

First pass, 22:47–23:05 +03:00 — quoted verbatim (first line, summary; full text with the claims table in
`.kaif/last-update.json` → `judgeVerdict`):

> REFUTED — narrow: the migration itself reproduces, but four claims fail as worded and one project guard was weakened into blindness
>
> The framework update reproduces: the core and bundle match the v2.9 pins and GitHub's own asset digests, the loader was lifted
> verbatim, the rehearsal predicted the live pass (counters, task file byte-identical modulo checkpoints), and every project-own line
> of `AGENT_GUIDE.md` that left the guide is accounted for. […] The refutation is narrow, but it is real: 1. The update sweep guard
> was weakened. […] 2. The project's own pre-commit gate refuses the update as it stands. […] 3. A reversed fact in claim 4 and in
> the field report. 4. A new standing falsehood and a logic-inverting translation in `HOUSE_RULES.md`. Two over-wide statements in the
> owner-facing `KAIF_FRAMEWORK.md` section. Each fix below takes minutes. After F1–F6 are fixed, the update is acceptable.

Findings F1–F13 and their fate: F1 the weakened sweep — second version, proven on the judge's mutant (R1); F2 `[TESTED]` without a
report path — fixed, the commit gate exits 0; F3 the reversed pointer-file fact — corrected (§1), #130 confirmed; F4 "10 checks, no
deploy" in four places — corrected after running the stand (20 `OK`), a fifth place found by the second judge (N1) corrected too;
F5 the inverted testcase-gate logic in Russian — fixed; F6 two over-wide sentences for the owner — fixed; F7 pointers to the moved
tables — re-pointed, the `<TEST_HARNESS>` fill kept (R5); F8 the fills in the reference — R6, ticket #150; F9 a date — fixed; F10
two commit recipes — a house-rules row says how the old chained fill is run; F11 an adjacent quote — the decision's own words cited;
F12 ~34 Russian defects — fixed; F13 `HOUSE_RULES.md` added to the three lists of Russian documents.

Second pass, judging the fixes (its results are from the tree as of 23:24–23:27 +03:00) — quoted verbatim (first line and the per-finding line):

> VERIFIED WITH CAVEATS. All 13 findings are fixed, or kept on purpose with the reason written down, and the fixes broke nothing
> load-bearing. […] F1 — PASS (caveats C1, C2). I built my own mutant, deleting three real 2.9 lines and naming them before the run
> […] The patched sweep names exactly these 3, exit 1. […] F2 — PASS. F3 — PASS. F4 — PASS. F5 — PASS. F6 — PASS. F7 — PASS.
> F8 — PASS. F9 — PASS. F10 — PASS with caveat C3. F11 — PASS. F12 — PASS with exceptions (N3). F13 — PASS (note C4).

Its caveats and new findings, all closed before the commit: C1 the blind spot moved into the guard's GAP field and §8 names the
"Grow this tooling" tail; C2 the commands written into §8; C3 — R5a above; C4 the agent's addition inside the owner's note signed
`[AI]`; N1 the map line corrected; N2 the mutant's usage line and comment corrected; N3 ten Russian residuals fixed (six in `HOUSE_RULES.md`, four in the `KAIF_FRAMEWORK.md` section); N4 the line
counts refreshed; N5 the decision-log row moved to the end of its table. Full texts: `.kaif/last-update.json` → `judgeVerdict`.

**After delivery (the last two steps of the task):** `node .kaif/kaif-core.mjs update-verify` → `✅ update-verify passed — the update
is complete and self-cleaned`; `module audit: 62 files match their deployed cut; 46 modules differ, 10 template modules absent, 483
modules are yours`. Its two advisories, stated as it asks: `promised upstream line not found on disk … AGENT_GUIDE.md :: **RULE:**
\`<state the key architectural invariant …` — the slot is filled with this project's invariant (the two halves, no state, the game
is data); `promised upstream line stands on disk with local edits … Co-Authored-By: Claude <noreply@anthropic.com>` — the line carries
the model name, as this project's commits do. Then `node .kaif/kaif-core.mjs check --gate-budgets` → exit 0; it wrote
`.kaif/budget-baseline.json` with `"docs": {}` — every re-read core document within its budget.
