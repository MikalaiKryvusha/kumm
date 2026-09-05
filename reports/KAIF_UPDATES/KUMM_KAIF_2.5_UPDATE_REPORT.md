# KUMM — KAIF 2.2 → 2.5 update field report

> Project KUMM (Krinik Universal Mod Manager) · **route `bootstrap`** (thin `KAIF.md` → `KAIF-LOADER.mjs` →
> the 2.5 core, local `--source` of the sha256-verified release assets) · lang `ru`, language-pack
> deployment (8 owner docs localized, canon and skills English — NOT i18n-translated) · tracking `origin` ·
> 5 agent systems · Windows 11 Pro 10.0.26200 · Node v24.15.0 · Git Bash · agent claude-code (Claude
> Fable 5.1) · 2026-09-05, ≈ 13:20–15:30 +03:00. **Three versions in one hop** — 2.3 and 2.4 were never
> deployed here. Second KAIF lifecycle run on this deployment (install 2.2 on 2026-08-15, origin issue #17).
> Every number below is a command's output. Delivered to the origin: see the footer.

## 1. Chronology with numbers

| Step | Result |
|---|---|
| Pre-flight | `git status --porcelain` → empty; `.kaif/kaif.json` → `2.2`, `tracking: origin`; `gh release list` → `v2.5` latest, published `2026-09-04T13:16:03Z` |
| Assets | `gh release download v2.5` → `KAIF-CORE.mjs` 237 569 B, `KAIF-CORE-BUNDLE.md` 978 102 B, `KAIF.md` 11 983 B, `kaif-manifest.json`, `kaif-module-map.json`; `sha256sum` of core and bundle equal to the manifest pins |
| Preview by the OLD (2.2) core | `node .kaif/kaif-core.mjs diff --source <v2.5 dir>` → `diff vs 2.5: 26 file(s) carry upstream static-module changes; 41 — nothing to do` (AGENT_GUIDE 13 modules, KAIF_REFERENCE 9, TESTING 5, REQUIREMENTS 4, 18 skills 1–5 each); no rehearsal file written — the 2.2 core predates the feature |
| Sandbox — the real pass in a copy | `git archive HEAD \| tar -x -C <tmp>` → 264 files; loader extracted from the thin `KAIF.md` → 6 016 B, `node --check` OK; `node KAIF-LOADER.mjs --lang ru --source <v2.5 dir>` → **exit 0**; `pre-update backup: 78 file(s)`; `bootstrap classified against the surviving deploy manifest: 23 replaced, 12 modules merged in-place, 11 added, 55 kept`; one wholesale verdict `AGENT_GUIDE.md: baseFound 27 of 27, ceiling 4 → merged`; `KAIF_UPDATE_TASK.md (12 items, 4 files with module diffs)`, 7 modules for the hand; `1 deprecated artifact(s) kept`; sandbox `check` after `sync` → `89 files + 152 agent artifacts`, warnings only (language mix, STATUS 345/200) |
| Rehearsal binding | the sandbox receipt (`<copy>/.kaif/last-update.json`, 375 B) copied to `.kaif/update-rehearsal.json` — the `--rehearsal` flag is refused on this route (R1) |
| Live pass | same loader, same `--source` → **exit 0**; `⟳ rehearsal verdicts loaded from .kaif/update-rehearsal.json (1 file(s))`; counters identical to the sandbox; `diff` of the two run logs minus `= kept existing` → 3 lines (the rehearsal line; `.roo/rules/kaif.md` and `.clinerules/kaif.md` written in the sandbox only — git-ignored, so absent from the archive); task files byte-identical; `grep -c "^- \*\*verdict-mismatch"` → 0 |
| Template delta (the owner-conventions item names files, shows no diff) | every `FILE:` block of both bundles extracted (161 files in 2.2, 171 in 2.5); `git diff --no-index tpl22 tpl25` → `43 files changed, 2360 insertions(+), 179 deletions(-)`; for the seven owner documents the whole delta is **3 lines**: `/end-chat` → `/end-chat-soft` in the STATUS and PROJECT_HISTORY headers, one new `Delivery metric` line in MASTER_PLAN; maps, `GOAL.md`, ru `KAIF_FRAMEWORK.md` unchanged |
| Hand merge | one exact-string patcher (`FIND` must match once, nothing written unless every patch matches): `✅ 20 patches applied to 11 files` — AGENT_GUIDE +143 lines (creed + prayer as ONE anchored block, WORKING-UNTIL, `FORK` in checklist item 7, the fourth door in item 9, the authorization carve-out), the `DELIVERY:` item in `/autoloop` `/dayloop` `/nightloop`, the trailer fill in `/end-chat-soft`, STATUS, PROJECT_HISTORY, MASTER_PLAN (metric line + decision row), KAIF_FRAMEWORK (version row + a 2.5 section), the external map (35 → 38 skills), EXPERIENCE (3 entries); `/end-chat` removed from the canon and four mirrors by `git rm` |
| Verbatim check of the lifted blocks | PRAYER block `diff` against the template → identical (37 lines); WORKING-UNTIL and carve-out → identical; the three `Short chat report` items → identical to the 2.5 skill templates |
| Final gate | `update-verify` → `✅ update-verify passed — the update is complete and self-cleaned`; `module audit: 62 files match their deployed cut; 38 modules differ, 10 template modules absent, 54 modules are yours` (the 10 absent are owner-document headings replaced by content — STATUS, GOAL, MASTER_PLAN phases); 15 advisory "promised upstream line" warnings — all placeholder lines, see R2; installer files self-removed (`KAIF.md`, `KAIF-LOADER.mjs`, `KAIF_UPDATE_TASK.md`, `.kaif/install/`); the judge verdict lives in `.kaif/last-update.json → judgeVerdict` |
| Checkpoints | 12 of 12 recorded; `placeholders` → `re-synced 175 system skill copies … placeholder scan ran clean`; `stale-claims` → `scan ran clean` (one line found and fixed: `KAIF_FRAMEWORK.md:48`); `recheck` → `check ran green` |
| Gates | `sync` → `re-synced 175 system skill copies`; `check` → `✅ manifest satisfied: 89 files + 152 agent artifacts present`, two advisory warnings (`37 of 37 skills are English`, `STATUS.md: 356 lines against its budget of ~200`); `kaif-guard-lint selftest` → `8 cases, every rule red on its fixture`; `kaif-scenario-lint selftest` → `33 cases, 7 rules × 2 languages`; both `check` → `SKIPPED … (exit 3)` (no markers, no scenarios yet); `report --dry-run` on the 2.2-era ticket → `already delivered: …/issues/16 — nothing sent (idempotent)` |
| Nothing lost | Cyrillic census over 15 owner-side files, HEAD → disk: **0 losses**; `git diff --name-only HEAD -- kumm.mjs Deploy-ModPack.ps1 README.md GOAL.md package.json bugs/ ideas/ researches/ homeworks/ plans/` → empty; `node --check kumm.mjs` → OK |

**Route choice, with its forced line** (2.5's FORK rule, applied to the update itself):
`FORK: options (a) kaif-core update with the deployed 2.2 core · (b) thin-KAIF.md bootstrap with the 2.5 core · price of error: without the 2.5 backup tree and numbered verdicts a mis-merge in the diverged files is visible only after the fact, and a refused live run leaves a version-skewed core · consulted: the skill's own route note, the 2.5 release notes, and the three field reports from this machine (origin #41, #43, #45 — all chose (b))`. Chosen: (b).

**Experience recall** (consulted during the work, quoted here): `EXP-0003` — the placeholder gate scans the mirrors and the declared sphere; edit only the `.claude/` canon and let the checkpoint re-sync — followed. `EXP-0002`/`EXP-0029` — a file handed from Git Bash to a Windows program needs a Windows-resolvable path — the session scratchpad was used for every artifact. The recall came late (see the judge's finding 2).

## 2. Rakes — severity, verbatim evidence, cost, repro

### R1 — S2 — the rehearsal binding is unreachable on the bootstrap route; the receipt at the default path works; the record is never consumed

**Already filed as origin issue #42** (NDim Space, 2026-09-04; +1 from Unliminium the same day). This run is a **third-project confirmation with two new details**, posted as a comment on #42 (https://github.com/MikalaiKryvusha/KAIF/issues/42#issuecomment-5551270934), no new ticket.

Not re-triggered here on purpose — the refusal was known — so the evidence is the working path and the second face:

```
$ cp <sandbox>/.kaif/last-update.json .kaif/update-rehearsal.json
$ node KAIF-LOADER.mjs --lang ru --source <v2.5 dir>
⟳ rehearsal verdicts loaded from .kaif/update-rehearsal.json (1 file(s)) — a file whose live verdict differs is frozen
⟳ AGENT_GUIDE.md: baseFound 27 of 27, ceiling 4 → merged (…)
⟳ bootstrap classified against the surviving deploy manifest: 23 replaced, 12 modules merged in-place, 11 added, 55 kept
$ ls -la --time-style=+%H:%M:%S .kaif/update-rehearsal.json .kaif/kaif.json
-rw-r--r-- 1 <user> 197121 488 13:28:29 .kaif/kaif.json
-rw-r--r-- 1 <user> 197121 375 13:28:28 .kaif/update-rehearsal.json   <- survived the update it rehearsed
```

New detail 1: the binding works with a receipt of **one** verdict — a language-pack deployment has a single wholesale candidate (`AGENT_GUIDE.md`), and the load/compare path is exercised the same way. New detail 2: a local `--source` directory holding the three release assets makes the sandbox and the live pass byte-deterministic (same bytes, no network between them); with the release channel the two runs would fetch twice. Cost here: **0 minutes** — the workaround was read from #42 before the first live command. Repro: any bootstrap update on 2.5.

### R2 — S3 — files that differ from the template ONLY by their deploy-time fills are classified as owner edits on every interval

New signal; no origin issue names it (`gh issue list --state all --search "placeholder"` → #3 the gate's scan surface, #4, #6, #8 — none about fill-induced divergence). **S3 by the ladder** (cost ≈ 10 minutes, no run lost) → one EXPERIENCE line and this section, no bug document.

The task listed `/autoloop`, `/dayloop`, `/nightloop` as modules that *"carry local edits AND upstream changed it"* and `/end-chat` as a deprecated artifact that *"carries local edits: remove it yourself"*. The only local difference in all four is the placeholder fill the 2.2 adaptation task REQUIRED (`<BUILD_COMMAND>` → `node --check kumm.mjs`, `<TEST_HARNESS>` → the harness line, `<YOUR AGENT/MODEL>` → the trailer). The machinery's own install snapshot says nothing changed since:

```
$ node -e '…compare .kaif/deploy-manifest.json (2.2) shas vs git HEAD…'
.claude/skills/autoloop/SKILL.md    snapshot sha: 5fed5b9821cd  HEAD sha: 5fed5b9821cd  tpl sha: f04131049133
.claude/skills/dayloop/SKILL.md     snapshot sha: bd745e2b871e  HEAD sha: bd745e2b871e  tpl sha: c43297d25c2e
.claude/skills/nightloop/SKILL.md   snapshot sha: b616e4642748  HEAD sha: b616e4642748  tpl sha: 1c9d4a6afb01
.claude/skills/end-chat/SKILL.md    snapshot sha: df528c0a0879  HEAD sha: df528c0a0879  tpl sha: 3fff69820a02
values: {"<PROJECT_NAME>","<SHORT_NAME>","<AUTHOR>","<REPO_URL>","<LOCAL_PATH>","<LICENSE>","<COMMIT_COMMAND>","<OWNER_LANGUAGE>"}
```

The `shas` snapshot equals HEAD for all four (untouched since install); the module classification compares against the pristine template, and the agent-filled slots (`<BUILD_COMMAND>`, `<TEST_HARNESS>`, `<YOUR AGENT/MODEL>`) are not in `values`, so the machinery cannot re-derive "template + fills" and hands the module to the agent. Effect: three one-line merges and one five-path `git rm` on EVERY interval, for files the owner never edited; the same three modules will come back next time. Repro: any deployment whose adaptation filled a skill placeholder; run any update and read the `merge-modules` item.
The final gate says the same thing in its own words — `update-verify` counts the template's placeholder lines as "promised upstream lines" and finds the FILLED lines instead:

```
$ node .kaif/kaif-core.mjs update-verify
⚠ promised upstream line not found on disk (unmerged?): .claude/skills/autoloop/SKILL.md :: 4. **Build** (`<BUILD_COMMAND>`). If errors — fix them, don't commit broken st
⚠ promised upstream line not found on disk (unmerged?): .claude/skills/autoloop/SKILL.md :: 6. **Verify autonomously** on the harness (`<TEST_HARNESS>`). Look at the resu
⚠ promised upstream line not found on disk (unmerged?): .claude/skills/dayloop/SKILL.md :: 3. **Do it**: code → build (`<BUILD_COMMAND>`) → deploy → test on the harness 
⚠ promised upstream line not found on disk (unmerged?): .claude/skills/nightloop/SKILL.md :: 3. **Do it**: code → build (`<BUILD_COMMAND>`) → deploy → test on the harness 
⚠ 15 upstream line(s) from the module diffs are absent on disk — merge them or state why in the judge verdict
…
✅ update-verify passed — the update is complete and self-cleaned.
```

Stated here, as the gate asks: the 15 lines are absent because their placeholders are filled — merging them would UNFILL the skills. Advisory only (the gate passed), but a weaker agent reading "unmerged?" would paste the placeholders back.


### R3 — S3 — a module flagged "upstream changed it" whose template did not change

The task listed `AGENT_GUIDE.md → ## Project identity` among the four modules to merge. Extracting that module from both templates: `diff id22.txt id25.txt` → identical (16 lines each). The diff the task printed was the project's values against the placeholders — nothing upstream to fold in. Cost: one diff read, ≈ 1 minute. Likely the same root as R2 (values-filled module ≠ template module → "local edits", and the "upstream changed" half of the sentence is not checked against the previous template).

### R4 — S3 — executor-side: the refresh witness and the recall line were not produced at task start

Recorded by the judge (§5, findings 1–2), reproduced here so the origin sees the honest shape of a real pass: a heavy task started on a marker from 2026-08-21, no quote-acceptance line, the experience grep run late. The canon's contour is right; the executor skipped it. No framework action.

### R5 — S3 — environment, not KAIF

(a) The project's deny list refuses `Bash(rm -rf:*)`, and a compound command containing it is refused WHOLE — `rm -rf "$SB"; mkdir -p "$SB"; git archive …` ran nothing; re-run without the removal (`EXP-0034`). (b) An 85-line Bash tool script of seven `<<'EOF'` here-documents failed to parse (`unexpected EOF while looking for matching '`) and wrote nothing; the same content went through the editor's Write tool. Cause not found; named so the next agent on this machine does not repeat the experiment.

## 3. What was exercised vs NOT

**Exercised:** the bootstrap route on a language-pack (non-translated) deployment · a local `--source` directory for the loader · sandbox rehearsal end to end with the receipt-at-default-path binding (loaded, matched, 0 mismatches) · pre-update backup (78 files) · crash journal written and removed · anchored blocks arriving as ONE task item with the creed rendered in the owner's language · a deprecation with a named successor, removed by hand · `language-arrivals` listing 6 English files · unconditional `stale-claims` (one line) · executing checkpoints (placeholders, stale-claims, recheck, judge with `--verdict-file`, field-report) · `sync` (175 copies) · `check` with the line-budget and language-mix warnings · both new linters' selftests and their `check` on a tree without markers · `report --dry-run` on an already-delivered ticket · template-delta extraction from two bundles.

**NOT exercised:** the `update` route · `resume` · `--baseline` · `--force` · `--channel main` · `report` live delivery (no new ticket: R2/R3 are S3 by the ladder, R1 dedupes to #42) · the `verdict-mismatch` freeze (no mismatch occurred) · the unpaired-anchor red of `check` (the tree had no anchored block before) · `/team-deployment` and its references (read, left English) · the hooks module · `kaif-guard-lint` / `kaif-scenario-lint` on real content · the `DELIVERY:` line in anger — the metric is PROPOSED, not ratified (interview #001).

## 4. Wishes for the next version (by cost, descending)

1. **Close #42 in the machinery** — accept `--rehearsal` on `install` and call `consumeRehearsal()` on the bootstrap path; refuse an unknown pass-through flag in the LOADER before the core is swapped. Three projects on one machine now carry the same field note.
2. **Fills-aware classification (R2/R3).** Record every filled placeholder at the `placeholders` checkpoint (the gate already scans them) into the manifest's `values`; at update time compare a module against `template + fills`, and when equal treat it as untouched — replace with `new template + fills`, retire a deprecated one mechanically. Three of this run's seven hand merges and the one deprecation vanish; the "upstream changed it" half of the module sentence should be decided template-vs-template.
3. **Let `diff --source` on a pre-2.5 core write the rehearsal** (or document the sandbox → default-path route in the skill body): the interval INTO 2.5 is exactly where the binding is first needed and where the old core cannot produce it.
4. **A one-word pointer in the language-pack warning** — the same wish as the 2.2 install report (#17, R3): the "INCOMPLETE BY DESIGN" paragraph still arrives before any success line and still reads like a partial failure on first sight.
5. **Positive signal to keep:** the sandbox predicted the live pass exactly on a second, differently-shaped deployment (language pack, one wholesale candidate) — the byte-accurate preview the skill promises held again, and the `--source` directory made "the copy IS the pass" literally true.

## 5. Final state and the judge verdict

**Final state.** `.kaif/kaif.json`: KAIF 2.5 (released 2026-09-04), tracking origin, lang ru, projectName KUMM, history `2.2 → 2.5, route bootstrap, 2026-09-05T13:28:29+03:00`. Manifest green (89 + 152), 37 skills in 5 systems, no mirror drift. Owner content untouched, engine byte-unchanged. Two owner decisions parked in `interviews/interview_001_delivery-metric.md` (the ONE delivery metric — a two-component vector proposed on the owner's own #46 reasoning; the prayer cadence). Advisory debts named in `STATUS.md`: the file is 356 lines against ~200 — the bonsai trim belongs to the next `/end-chat-soft`.

**Judge verdict, quoted verbatim** (`/fable-judge` over this update, 2026-09-05; the executor and the judge are the same session, which the verdict says in its findings):

> VERIFIED WITH CAVEATS
>
> The update is real and the tree is sound: KAIF 2.5 is stamped, the machinery on disk is the release artifact, every hand-merged block is byte-identical to the 2.5 template, and nothing the owner wrote lost a character. Three findings stand against the executor's own discipline, none against the migration.
>
> […claims table — every row a command's output; frauds hunted — weakened checks (no tests exist), false completion, scope creep, unauthorized action, new binaries, identity without an author: none found…]
>
> **Findings against the executor (caveats, recorded as found)**
>
> 1. **Refresh witness not produced.** This is a heavy task (114 tracked files touched) and the canon requires the re-read ritual with its two-part witness before it. `.kaif/refresh-marker.json` still reads `2026-08-21T18:30:00+03:00 · ritual:/resume`; no quote-acceptance line was written at task start. […] Not back-dated; recorded here.
> 2. **Experience recall was late and unquoted at the start.** […] `EXP-0003` […] and `EXP-0002`/`EXP-0029` […] were read during the work and applied […] but the recall line the judge looks for was not printed before the first command.
> 3. **Debris to clear before the commit.** `.kaif/update-rehearsal.json` survived the update it rehearsed […] remove by hand. `.kaif/last-update.json` is untracked while the two sibling deployments on this machine track theirs — add it.
>
> **Could not verify here:** the live Nexus path and the deploy path — need a logged-in debug-port Chrome and an installed game. Unchanged, which the diff proves; not proven working. The three new skills are on disk and manifest-checked but not invocable until the client restarts.
>
> **Recommended action:** commit as one update commit after removing the rehearsal record and adding the receipt; deliver the field report to the origin under the owner's quoted words; the two owner decisions stay open in interview #001. No fix is required for the migration itself.

Both debris items were cleared before the commit; the full verdict text is in the `judge` checkpoint's verdict file.

## 6. Appendix — the bundle extractor used for the template delta

```js
// extract-bundle.mjs <bundle.md> <outdir> — writes every FILE: block of a KAIF bundle to <outdir>/<path>
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
const [bundle, out] = process.argv.slice(2);
const lines = readFileSync(bundle, 'utf8').split('\n');
let i = 0, n = 0;
while (i < lines.length) {
  const m = lines[i].match(/^> \*\*FILE: `([^`]+)`\*\*/);
  if (!m) { i++; continue; }
  const path = m[1]; i++;
  while (i < lines.length && !lines[i].startsWith('``````')) i++;
  i++;
  const body = [];
  while (i < lines.length && lines[i] !== '``````') body.push(lines[i++]);
  i++;
  const dest = join(out, path);
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, body.join('\n') + '\n');
  n++;
}
console.log(`${n} files → ${out}`);
```

Usage: `gh release download v2.2 --repo MikalaiKryvusha/KAIF --pattern KAIF-CORE-BUNDLE.md` (and v2.5), then `node extract-bundle.mjs <bundle> tpl22`, `git diff --no-index tpl22 tpl25`.

---

**Delivered to the origin:** https://github.com/MikalaiKryvusha/KAIF/issues/48 (issue #48, 2026-09-05); +1 observation on issue #42: https://github.com/MikalaiKryvusha/KAIF/issues/42#issuecomment-5551270934
