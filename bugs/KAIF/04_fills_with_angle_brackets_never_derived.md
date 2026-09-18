# KAIF bug: a hand-filled slot whose VALUE contains `<` or `>` is never derived — `fills` stays `{}` and the fills-only skills come back as hand merges on every interval

kaif-fp: machinery `deriveFills` / `matchFills` (2.6, epic UR2) :: fills-not-derived-angle-brackets :: v2.7
**Delivered upstream:** https://github.com/MikalaiKryvusha/KAIF/issues/73
**Autocapture** (from `.kaif/kaif.json` + update receipt): KAIF 2.7 (updated 2.5 → 2.7, route `bootstrap`,
2026-09-18T17:59:31+03:00) · project KUMM · sphere `programming` · language `ru` (language pack, not
i18n-translated) · tracking `origin` · agent system claude-code · OS Windows 11 Pro 10.0.26200 · Node v24.15.0
**Dedup attestation:** searched `bugs/KAIF/` (`grep -ril 'fills' bugs/KAIF/` → only ticket 03, which
mentions fills in passing) and origin issues (`gh issue list --repo MikalaiKryvusha/KAIF --state all
--search "fills angle bracket"` → nothing; `--search "matchFills"` → nothing; `--state open --search "fills"`
→ only #72). The parent signal is #48 R2 (closed by 2.6); this is the case its fix does not cover. No match found.

Severity by the ladder: **S3** by cost (≈ 5 minutes here, a script did the merges) — filed as a ticket anyway
because the behaviour is a shipped, `[TESTED]`-marked claim of 2.6 that does not hold on this deployment.

## Expected per canon

The 2.7 update task, item `policy-changes`, 2.6 entry (2), verbatim:

> files that differ from their template ONLY by hand-filled slots (`<BUILD_COMMAND>`, `<TEST_HARNESS>`, the
> co-author line) are UNTOUCHED — they are replaced mechanically with the fills kept and retired mechanically
> when deprecated, so the three hand merges and one hand deprecation you did on every interval stop appearing
> in the task; the fills are derived from your disk and cached in `.kaif/deploy-manifest.json` as `fills`

## Got in the field

> **Correction, 2026-09-18 19:43 +03:00** (posted upstream as comment 5733169943 on #73, stamped
> 16:43:25Z): the sentence below is
> exact for `/autoloop` and `/dayloop` and too wide for `/nightloop` — that FILE also carried one local word
> in ANOTHER module (`handover` for `baton`, the #57 rename). It does not touch the defect: the module the task
> handed over in all three files — "The cycle" — differed from the 2.5 template by the fills alone. Found by
> the independent judge of this update, confirmed by
> `diff <(git show HEAD:.claude/skills/nightloop/SKILL.md) tpl25/.claude/skills/nightloop/SKILL.md`.

Before the update the three loop skills were exactly "2.5 template + fills" (the description line aside):

```
$ diff <(git show HEAD:.claude/skills/autoloop/SKILL.md) tpl25/.claude/skills/autoloop/SKILL.md | grep -v description:
62c62   < 4. **Build** (`node --check kumm.mjs`). …            > 4. **Build** (`<BUILD_COMMAND>`). …
64c64   < 6. **Verify autonomously** on the harness (`node kumm.mjs check --json / .\Deploy-ModPack.ps1 -Verify -PackDir <pack>; full table in AGENT_GUIDE.md "Test harness"`). …
        > 6. **Verify autonomously** on the harness (`<TEST_HARNESS>`). …
74c74   < 10. **Commit** …: `git add -A && git commit -m "<msg>" && git push` …   > …: `<COMMIT_COMMAND>` …
```

And still the task handed them over — `merge-modules`: `.claude/skills/autoloop/SKILL.md (1) ·
.claude/skills/dayloop/SKILL.md (1) · … · .claude/skills/nightloop/SKILL.md (1)`, each "carries local edits AND
upstream changed it", with the fills rendered as `-`/`+` lines. After the pass:

```
$ node -e "…JSON.parse(readFileSync('.kaif/deploy-manifest.json')).fills…"
{}
```

## Repro (deterministic)

The core's OWN `matchFills`, lifted verbatim from the deployed `.kaif/kaif-core.mjs` and run on a one-line module:

```
template: Build (`<BUILD_COMMAND>`), then verify on the harness (`<TEST_HARNESS>`).
fill WITHOUT angle brackets -> {"<BUILD_COMMAND>":"node --check kumm.mjs","<TEST_HARNESS>":"node kumm.mjs check --json"}
fill WITH "<pack>" inside    -> null
```

One slot value with `<…>` in it makes the WHOLE module unmatched, so its neighbour slot (`<BUILD_COMMAND>`,
a perfectly plain value) is not learned either.

## Cost and violated invariant

≈ 5 minutes per interval, forever, for every deployment whose harness or commit command names an argument
in angle brackets — `<pack>`, `<msg>`, `<file>` are how people write command synopses, so this is the common
case, not an edge. Violated invariant: **honest-green** in the small — the 2.6 code carries a `[TESTED]` marker
(polygon s21 B1–B6); I did not read the polygon, so this is an inference, not an observation: its fill values
presumably carry no angle brackets, since the function returns `null` on one — and **simplicity** (the hand
redoes what the machinery promises).

## What in KAIF led to this

`matchFills` builds each capture as `` `(?<${g}>[^\\n<>]+?)` `` and its own comment says why: "a capture never
spans `<`/`>`" — a guard against learning garbage from a literal `<YOUR AGENT/MODEL> <YOUR AGENT'S noreply
EMAIL>` pair. The guard is right for THAT pair and too wide for values: it also forbids every value that
legitimately contains a bracketed argument name. Suggested fix, smallest first: forbid only the KNOWN slot
literals inside a capture (a negative lookahead over `PLACEHOLDERS`) instead of the two characters; and add one
polygon case whose fill is `tool --dir <pack>`.

## Local remediation (per the "defect in KAIF itself" contour, if applied)

None in the machinery. The hand merge is scripted: `tools/kaif-update-merge-skills.mjs` builds "new template
+ this project's fills" and refuses a leftover placeholder; idempotent (second run prints `=`). The probe that
produced the Repro output is kept as `tools/kaif-update-probe-matchfills.mjs` — it prints both slots once the
capture is fixed upstream, which makes it the acceptance check of this ticket.
