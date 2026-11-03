# KAIF bug 29 — the contour's voice call says the owner's name twice when the call text already opens with it

**Severity:** S3 (the owner's ear) · **Version:** KAIF 2.9, `.kaif/tools/contour/review.mjs` `callDoor()` · **When:** 2026-11-03 22:38, KUMM (Conan build)
**Delivered upstream:** https://github.com/MikalaiKryvusha/KAIF/issues/191

## Symptom

`review.mjs --call "Николай, два вопроса в чате: …"` spoke «Николай, Николай, два вопроса…»: `callDoor` always prefixes `cfg.callName + ', '`, and the
agent, addressing the owner the natural way, opened the text with the same name. The owner, rendered from Russian: «again Nikolai, Nikolai» · «why do you
say my name twice?» (KUMM chat, 2026-11-03 22:38).

## Repro

`node .kaif/tools/contour/review.mjs --call "<callName>, test." --dry-run` → `CALL (dry run, no sound): <callName>, <callName>, test.` (before the fix).

## Expected

The name is spoken once: a call text that already opens with `callName` (case-insensitive) is not prefixed again. The skill text of `/owner-reviews` (the
`--call` line) says the tool adds the name itself — the agent writes only the request.

## Local remediation

KUMM `.kaif/tools/contour/review.mjs` `callDoor()`: `named = body.toLowerCase().startsWith(callName.toLowerCase())` → no prefix. Checked by dry runs
2026-11-03 22:3x: «Николай, проверка без звука.» and «проверка без звука.» both give «Николай, проверка без звука.».
