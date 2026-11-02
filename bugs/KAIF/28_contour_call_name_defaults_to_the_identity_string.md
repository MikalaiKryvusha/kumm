# KAIF improvement 28 — the contour's voice call addresses the owner by the identity string («Name Surname (ALIAS)») unless `contour.callName` is set

**Severity:** S3 (the owner's ear: a call he could not use) · **Version:** KAIF 2.9, `.kaif/tools/contour/review.mjs` `--call`, `INTERACTIVE_CONTOUR_SPEC.md`
line 110 · **When:** 2026-11-02 12:45–13:57, KUMM (Conan build)
**Delivered upstream:** https://github.com/MikalaiKryvusha/KAIF/issues/190

## Symptom

`review.mjs --call` spoke «Mikalai Kryvusha (KOT KRINIK), …» — `contour.callName` defaults to `ownerName`, and `ownerName` comes from the AGENT_GUIDE identity
table, whose «Author / owner» cell holds the legal name with the alias in parentheses. The owner, rendered from Russian: «Nikolai is enough to call me» ·
«just NIKOLAI» · «without Kryvusha» · «without the aka» (KUMM chat, 2026-11-02 12:45 and 13:57). A second KAIF project of the same owner (UnliminiumTheDigitalGame)
had already set `contour.callName` by hand — the same correction paid twice.

## Expected

1. The default spoken address is a SHORT name, never the identity string: `callName` falls back to the first word of `ownerName` with any parenthesised alias
   and «aka …» removed — or the install / update task asks once «how should the voice call you?» and writes `contour.callName`.
2. The spec (line 110) says so, with the example «Name Surname (ALIAS)» → «Name».
3. The voice text is the project's language; a call text in another language than the voice is refused or warned (the same day a Russian voice read an
   English call text: «I did not understand what you said»).

## Local remediation

KUMM `.kaif/kaif.json` → `"contour": { "callName": "Николай", "spokenProjectName": "Кумм" }` (commit `bb53187`); calls in Russian only (agent memory).
