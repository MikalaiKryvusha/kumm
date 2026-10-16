# KAIF improvement request: the hooks README smoke probe for the `resume` word gives a false negative when an agent runs it — offer a backslash-free probe line

kaif-fp: `.kaif/hooks/README.md` → "Wiring", step 3 (POSIX block) :: smoke-probe-backslash-layer :: v2.9
**Delivered upstream:** https://github.com/MikalaiKryvusha/KAIF/issues/151
**Autocapture:** KAIF 2.9 (updated 2.7 → 2.9, route `bootstrap`, 2026-10-16) · project KUMM · sphere `programming` · language `ru`
(language pack) · tracking `origin` · agent system claude-code · OS Windows 11 Pro 10.0.26200 · Node v24.15.0 · Git Bash
**Dedup attestation:** `ls bugs/KAIF/` → nothing on the hooks smoke; `gh issue list --repo MikalaiKryvusha/KAIF --state all
--search "smoke printf backslash"` → no match.

## Gap

Step 3 tells the agent to smoke the hooks by hand. POSIX line 2:

```
printf '{"prompt":"resume\\nplan the day"}' | node .kaif/hooks/prompt-resume-word.mjs
```

It must print the order to run `/resume`. Run by the agent through its Bash tool, it printed nothing. Measured: the tool layer
delivers `'a\\nb'` to the shell as `a\nb` (`printf '%s' 'a\\nb' | od -c` → `a \ n b`), so `printf` writes a RAW newline inside the
JSON string, the event does not parse, and the hook — correctly — stays silent. The README's own hint ("if the second line stays
silent, the event did not parse") points at the right place, but an agent reading it concludes the hook is broken or wastes the
minutes we spent. The smoke is run by agents far more often than by humans.

## Proposal

Add (or replace with) a probe that carries no backslash in any shell layer:

```
node -e "process.stdout.write(JSON.stringify({prompt:'resume'+String.fromCharCode(10)+'plan the day'}))" | node .kaif/hooks/prompt-resume-word.mjs
```

On this machine it printed the `/resume` order, exit 0.

## Field evidence

KUMM, 2026-10-16, after `wire-hooks`: timer, no-word and session-start probes behaved as the README says; the `resume` probe was
silent with the `printf` line and printed its order with the `node`-built JSON. The same backslash collapse is this project's
lesson EXP-0120 (escaping-layer).

## Local remediation (per the "defect in KAIF itself" contour, if applied)

None — the README is the framework's; the field report of this update names the working probe.
