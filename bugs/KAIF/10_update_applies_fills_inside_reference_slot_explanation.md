# KAIF bug: the update substitutes the project's fills into `.kaif/KAIF_REFERENCE.md`'s own explanation of the slots

kaif-fp: machinery fills substitution (`deriveFills` / fold-back on replace) · `.kaif/KAIF_REFERENCE.md` :: fills-applied-inside-slot-explanation :: v2.9
**Delivered upstream:** https://github.com/MikalaiKryvusha/KAIF/issues/150
**Autocapture:** KAIF 2.9 (updated 2.7 → 2.9, route `bootstrap`, 2026-10-16) · project KUMM · sphere `programming` · language `ru`
(language pack) · tracking `origin` · agent system claude-code · OS Windows 11 Pro 10.0.26200 · Node v24.15.0
**Dedup attestation:** `ls bugs/KAIF/` → 04_DONE (#73) is the neighbour (fills with `<`/`>` were NOT derived); this is the
opposite side — derived fills applied where they must not be. `gh issue list --repo MikalaiKryvusha/KAIF --state all --search
"fills applied reference slots"` and `--search "fills substituted KAIF_REFERENCE"` → no ticket.

## Expected per canon

`.kaif/KAIF_REFERENCE.md` explains, in its own prose, which slots the machinery cannot fill — by naming them. The shipped 2.9
bundle (`KAIF-CORE-BUNDLE.md` line 3426) reads: "adaptation task filled into slots the machinery could not fill
(`<BUILD_COMMAND>`, `<TEST_HARNESS>`, …". The deployed reference should say the same.

## Got in the field

After the 2.7 → 2.9 bootstrap pass, `.kaif/KAIF_REFERENCE.md` line 308:

```
adaptation task filled into slots the machinery could not fill (`node --check kumm.mjs`, `node kumm.mjs check --json / .\Deploy-ModPack.ps1 -Verify -PackDir <pack>; full table in AGENT_GUIDE.md "Test …
```

At HEAD (2.7) the same sentence (line 297) still carried `<BUILD_COMMAND>`, `<TEST_HARNESS>`. The rehearsal copy shows the same
substitution, so it is the machinery, not the hand merge. The loader printed `hand-filled slots recognized (4): <BUILD_COMMAND>,
<TEST_HARNESS>, <YOUR AGENT/MODEL>, <YOUR AGENT'S noreply EMAIL>` and logged `replaced .kaif/KAIF_REFERENCE.md (fills kept)`.

## Repro (deterministic)

1. A deployment whose fills include `<BUILD_COMMAND>` / `<TEST_HARNESS>` (any project after its adaptation task).
2. Update by the bootstrap route to 2.9 (`node KAIF-LOADER.mjs --lang <code> --source <release assets>`).
3. `grep -n "slots the machinery could not fill" .kaif/KAIF_REFERENCE.md` → the project's values, not the slot names.

## Cost and violated invariant

Cost for us ≈ 0 (noticed by an independent judge, left as delivered). Invariant: a fill replaces a SLOT, never the name of a slot
quoted as a name. The reference now explains the mechanism with one project's values, and the next reader cannot tell which
words were slots.

## What in KAIF led to this

"Fills kept" is applied to every occurrence of the placeholder string in the file, including the reference's prose that quotes
the placeholders as examples.

## Proposal

Exempt quoted slot names from substitution — e.g. a marker on the line (`<!-- slot-names -->`), or the reference's slot list kept
as a set the fold-back skips.

## Local remediation (per the "defect in KAIF itself" contour, if applied)

None — the file is the framework's; left as the machinery wrote it so the next update sees no local edit.
