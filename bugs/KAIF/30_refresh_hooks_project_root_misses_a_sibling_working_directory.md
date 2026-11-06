# KAIF bug 30 — the refresh hooks name a marker in the WRONG folder when the shell's cwd is a sibling working directory outside the project

**Severity:** S3 (a false «no refresh witness» order every prompt; the agent may stamp a marker where no hook reads it) · **Version:** KAIF 2.9,
`.kaif/hooks/prompt-refresh-timer.mjs` (twins: `prompt-resume-word.mjs`, `session-start-refresh.mjs`, `stop-status-guard.mjs`) `projectRoot()` ·
**When:** 2026-11-06 11:53, KUMM (Conan build, a long /dayloop)
**Delivered upstream:** https://github.com/MikalaiKryvusha/KAIF/issues/194

## Symptom

The session had additional working directories (Claude Code: `D:\work\ai_sandbox\_tools`, siblings of the project `D:\work\ai_sandbox\KUMM`). After a
command ran there, the event's `cwd` was `D:\work\ai_sandbox\_tools`; the timer ordered «re-stamp D:\work\ai_sandbox\_tools\.kaif\refresh-marker.json»
on every prompt, although the project's own marker `KUMM\.kaif\refresh-marker.json` was fresh. The 2.9 fix (origin #94) walks UP from `cwd` to the folder
holding `.kaif/kaif.json` — right for a subfolder, but a SIBLING has no such ancestor, and the fallback is `cwd` itself.

## Repro

`'{"cwd":"<a sibling folder of the project>"}' | node .kaif/hooks/prompt-refresh-timer.mjs` with a fresh root marker → the order naming
`<sibling>\.kaif\refresh-marker.json`.

## Expected

When no ancestor of `cwd` holds `.kaif/kaif.json`, the root is the agent system's own project directory (Claude Code passes `CLAUDE_PROJECT_DIR` to every
hook), and only without it — `cwd`.

## Local remediation

KUMM, all four twins: `if (up === d) return process.env.CLAUDE_PROJECT_DIR || cwd;`. Checked 2026-11-06 12:3x: the same sibling event with
`CLAUDE_PROJECT_DIR=D:\work\ai_sandbox\KUMM` — silent (the fresh root marker read); without the variable — the old order (the control goes red).
