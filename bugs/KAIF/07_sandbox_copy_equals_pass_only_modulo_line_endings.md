# KAIF improvement request: "the copy IS the pass" holds only modulo line endings on a Windows tree with core.autocrlf=true — say so in /kaif-update, or give a recipe that keeps them

kaif-fp: skill `/kaif-update` step 2 (the sandbox copy) :: rehearsal-claim-wider-than-observation :: v2.7
**Delivered upstream:** https://github.com/MikalaiKryvusha/KAIF/issues/81
**Autocapture:** KAIF 2.7 (updated 2.5 → 2.7, route `bootstrap`, 2026-09-18) · project KUMM · sphere `programming` ·
language `ru` (language pack) · tracking `origin` · agent system claude-code · OS Windows 11 Pro 10.0.26200 · Node v24.15.0
**Dedup attestation:** `ls bugs/KAIF/` → nothing on the sandbox; `gh issue list --repo MikalaiKryvusha/KAIF --state all
--search "sandbox line endings autocrlf"` and `--search "git archive CRLF rehearsal"` → #23 (KAGO: `update` writes LF
into a CRLF working tree — a different surface, the live pass itself) and field reports #41, #79. No match found.

## Gap

`/kaif-update` step 2, verbatim: «The sandbox copy — not a model of the pass but the pass itself: export the tree
(`git archive HEAD | tar -x -C <tmpdir>`) … in the field the live pass matched the sandbox byte for byte.»

On this deployment the executor repeated the claim ("byte-equal to its rehearsal") and an independent judge refuted
it. Observed:

```
sandbox PHILOSOPHY.md: 257 CR of 17554 B        live PHILOSOPHY.md: 0 CR of 17297 B
the two .kaif/deploy-manifest.json: `shas` differ in 210 of 252 entries (the judge's JSON compare)
equal: counters (30 · 26 · 11 · 55), the verdicts, the task file (byte-identical), the run logs (3-line diff)
```

`git archive HEAD | tar -x` on a tree with `core.autocrlf=true` writes CRLF files; the live framework files of this
deployment are LF. No verdict changed — `normSha`, `fileShaNorm` and `normEol` normalize before hashing — but the
`oldShas` branch for v1 manifests compares a raw `fileSha` (read in the core, not run), so a tree on that branch
could see the rehearsal and the live pass disagree.

## Proposal (smallest first)

1. One sentence in step 2: "on Windows with `core.autocrlf=true` the copy equals the pass modulo line endings —
   compare counters, verdicts and the task file, not the trees".
2. Or a recipe that keeps the endings. `git -c core.autocrlf=false archive HEAD | tar -x` is the executor's GUESS —
   not tried here, so it is offered as a hypothesis for the origin's polygon, not as a fix.

## Field evidence

This project's update, 2026-09-18; the judge's claims table row 6 (VERIFIED WITH CAVEATS, finding F1); field report
#79, R5. Cost: one false sentence in `STATUS.md` and in the report, corrected before the commit.

## Local remediation

The wording in this project's `STATUS.md` and field report now says "counters equal, task file byte-identical,
trees equal modulo line endings".
