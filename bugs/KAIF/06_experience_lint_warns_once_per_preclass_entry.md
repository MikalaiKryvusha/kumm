# KAIF improvement request: kaif-experience-lint prints one warning per pre-2.7 failure entry — 88 lines of noise above the one line that matters, on every closing ritual

kaif-fp: tool `.kaif/tools/kaif-experience-lint.mjs` (`check`) · `/end-chat-soft` :: advisory-noise-buries-signal :: v2.7
**Delivered upstream:** https://github.com/MikalaiKryvusha/KAIF/issues/80
**Autocapture:** KAIF 2.7 (updated 2.5 → 2.7, route `bootstrap`, 2026-09-18) · project KUMM · sphere `programming` ·
language `ru` (language pack) · tracking `origin` · agent system claude-code · OS Windows 11 Pro 10.0.26200 · Node v24.15.0
**Dedup attestation:** `ls bugs/KAIF/` → no ticket on the lint; `gh issue list --repo MikalaiKryvusha/KAIF --state all
--search "experience-lint warnings no-class"` and `--search "experience lint pre-2.7 entries"` → only field reports
#76 (NDim: the lint said SKIPPED there, no warnings) and #79 (this project's report, R3). No match found.

## Gap

The release notes promise the rules judge only entries that carry `class:` — «entries written before 2.7, with no
`class:`, are outside the field rules, so the first 2.7 lesson does not stop the closing ritual on the journal's
history». The rules keep that promise: 0 findings. The WARNINGS do not. This journal after today's first six
classed entries:

```
$ node .kaif/tools/kaif-experience-lint.mjs check
experience-lint: 120 entries · 6 classed · 5 classes · 10 mechanized · class list 11 slugs
⚠ no-class: EXP-0116 (line 151): a failure entry with no `class: <slug>` — recurrence cannot be counted for it
… (88 such lines, EXP-0116 down to EXP-0002)
✅ experience-lint OK — EXPERIENCE.md, 0 findings, 88 warning(s) above
```

`/end-chat-soft` Step 1 now runs this command on every closing. The line an agent must act on — a second failure of
one class without a mechanism — will sit under 88 lines about history that, by the release's own words, is out of
scope. That is the "warning printed for weeks and acted on once" shape the same release fixed for the budget
warning (epic CB, #71).

## Proposal

Collapse the pre-class history into ONE line and keep the per-entry list behind a flag:

```
⚠ 88 failure entries carry no `class:` and predate the first classed one — outside the field rules; list: --verbose
```

Optionally the same line names the cheapest way down (`--shrink` does not apply — they are not mechanized; a
batch "classify the last N" helper would). A new failure entry WITHOUT `class:` written after the first classed
one stays a per-entry warning — that is a real finding.

## Field evidence

This project, 2026-09-18, the first closing ritual under 2.7; the numbers above are the command's output. Cost: none
yet — the risk is the next session skimming past the one red line.

## Local remediation

None: the lint is framework code. The field report (#79, R3) carries the same observation.
