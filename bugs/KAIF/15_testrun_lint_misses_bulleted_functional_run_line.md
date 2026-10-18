# KAIF bug: `kaif-testrun-lint` does not see a bulleted `- Functional run:` line, so a pass report written in list form reddens `pass-without-functional-run`

kaif-fp: .kaif/tools/kaif-testrun-lint.mjs :: FUNCTIONAL_LINE regex :: v2.9
**Delivered upstream:** https://github.com/MikalaiKryvusha/KAIF/issues/161
**Autocapture:** KAIF 2.9 · project KUMM · sphere programming · language ru · tracking origin · agent system claude-code (Claude Opus 5.5) · OS Windows 11 Pro 10.0.26200 · Node v24.15.0
**Dedup attestation:** `ls bugs/KAIF/` → nothing on testrun-lint line form; `gh issue list --repo MikalaiKryvusha/KAIF --state all --search "testrun-lint Functional run bullet"` → #76 only (a field report, different class).

## Symptom

A run report whose Checks section opens with

```
- Hygiene: `dotnet build` … — Build succeeded.
- Functional run: … what was walked · on which contour · what was READ.
```

and whose Verdict is `pass` is refused: `pass-without-functional-run: Verdict says pass while Checks carries no "Functional run:" line`.
The same report with Verdict `partial` passes silently, so a project that writes the two lines as a list (we did, in seven reports of one
night) learns about the rule only on its first `pass`.

## Cause

`FUNCTIONAL_LINE = /^[^\S\n]*(?:Functional run|Функциональный прогон)[^\S\n]*:[^\S\n]*(.*)$/imu` (and `LINE_LABEL_RE` the same way)
allows only whitespace before the label — a list marker (`- `, `* `, `1. `) makes the line invisible.

## Repro

1. Copy any report with a filled Checks section, prefix the two lines with `- `, set Verdict to `pass`.
2. `node .kaif/tools/kaif-testrun-lint.mjs check` → `pass-without-functional-run`.
3. Remove the `- ` → green.

## Proposal

Accept an optional list marker before the label: `^[^\S\n]*(?:[-*+]|\d+[.)])?[^\S\n]*(?:Functional run|…)…` in both regexes, plus one
selftest case per language ("bulleted line counts"). The template could also say in one comment that the two lines are plain lines.

## Local remediation

Our report `testcases/reports/2026-10-18_svarog-night-batch7.md` was rewritten without the markers; lesson EXP-0315 in our `EXPERIENCE.md`.
No local patch to the deployed linter (the framework file stays byte-identical for the next `/kaif-update`).
