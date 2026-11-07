# Test run report — owner-presence: is a person at the PC (owner-idle.ps1, the mouse-seq guard, the hook)

**Created:** 2026-11-07 12:39 +03:00 · **Run by:** the agent (Claude Opus 5.5) · **Version/build:** `_tools/owner-idle.ps1`, `ConanExiles/_config/mouse-seq.ps1` (guard),
`KUMM/tools/hooks/owner-presence.mjs`

## 1. Work

HOUSE_RULES rule 30 (the owner's words of 2026-11-07 12:36–12:37, verbatim there): BUSY when the keyboard / mouse was touched < 10 s ago → no real-input run;
FREE → test. Cases: O1 the probe says BUSY while the owner types; O2 `mouse-seq.ps1` refuses (exit 5, nothing sent) while BUSY and passes the guard at threshold 0;
O3 the hook refuses a real-input command while BUSY (exit 2) and notes the state into the context once per 5 minutes for other commands.

## 2. Contour

The owner's machine while he worked at it (12:36–12:38) — his real typing was the BUSY state. REAL WORLD: accumulated — his live session; data and machine — his
PC; path — the same commands the agent runs.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-11-07 12:37 +03:00 | `powershell -File mouse-seq.ps1 -Seq "wait:10" -MinIdle 100000` / `-MinIdle 0` | «OWNER AT THE KEYBOARD … nothing sent» / guard passed (then «no game process») |
| 2 | 2026-11-07 12:38 +03:00 | `powershell -File _tools/owner-idle.ps1` | exit 5 «BUSY idle 0,1 s» |
| 3 | 2026-11-07 12:38 +03:00 | `mouse-seq.ps1 … -MinIdle 100000` after the refactor (calls the probe) | exit 5, «OWNER AT THE KEYBOARD: BUSY idle 0,1 s … nothing sent» |
| 4 | 2026-11-07 12:39 +03:00 | `node tools/hooks/owner-presence.mjs < h1.json` (a `loot-take-clip.sh` command) · `< h2.json` (`git status`) twice | exit 2 refusal · the context note once · no note the second time |

## 4. Checks

- Hygiene: `.claude/settings.local.json` parsed after the hook entry.
- Functional run: the probe, the guard and the hook run on the owner's live machine while he typed; outputs and exit codes READ. FREE was seen only by the
  threshold-0 pass (he was typing the whole time).

## 5. Found

none

## 6. Traces

The outputs above (chat of 2026-11-07); the stamp `tools/hooks/.owner-presence-note.stamp` (git-ignored).

## 7. Verdict

pass — BUSY refusals on every path; FREE by threshold only. The hook goes live in the agent's client at the next session start (settings read at start).
