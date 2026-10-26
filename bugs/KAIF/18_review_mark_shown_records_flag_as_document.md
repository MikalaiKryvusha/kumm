# KAIF bug: `review.mjs --mark-shown` records whatever word follows it as a document — `--transport`, `chat` — and says «Shown recorded»

kaif-fp: tools/contour/review.mjs :: mark-shown-unchecked-arg :: v2.9
**Delivered upstream:** https://github.com/MikalaiKryvusha/KAIF/issues/178
**Autocapture:** KAIF 2.9 · project KUMM · agent system claude-code (Claude Opus 5.5) · OS Windows 11 Pro 10.0.26200 · Node v24.15.0
**Dedup attestation:** `grep -ril "mark-shown" bugs/KAIF/` → none; `gh issue list -R MikalaiKryvusha/KAIF --state all --search "mark-shown"` → none.

## Symptom

Closing step 1b of `/resume` (I40–I42), the agent marked a question shown in chat. Two calls in a natural but wrong order both printed
success and wrote junk keys into `interviews/decisions/shown.json`, while the queue kept saying «НИ РАЗУ НЕ ПОКАЗАН»:

```
node .kaif/tools/contour/review.mjs interviews/interview_025_conan_ambush_frequency.md --mark-shown --transport chat
→ Shown recorded (I40): --transport · chat → interviews/decisions/shown.json      (key "--transport" written)
node .kaif/tools/contour/review.mjs interviews/interview_025_conan_ambush_frequency.md --mark-shown chat
→ Shown recorded (I40): chat · чат → interviews/decisions/shown.json             (key "chat" rewritten)
```

The same `shown.json` already carried a junk key `"chat"` from 2026-10-13 — the same slip by an earlier session, never noticed: the tool
said «recorded» then too.

## Root cause

`review.mjs` (2.9), the `--mark-shown` branch: `const doc = opt('--mark-shown'); if (!doc) usage();` — the value after the flag is taken
unchecked; a positional document before the flag is ignored; nothing checks that the value is not another flag and is an existing file.

## Expected

`--mark-shown` refuses (non-zero exit, nothing written) when its value starts with `--` or is not an existing file under the project root;
optionally accepts the positional document form the rest of the CLI uses.

## Local remediation (KUMM, 2026-10-26 19:30)

Three lines after `if (!doc) usage();`: refuse `doc.startsWith('--')` or a path that is not an existing file, exit 2, «nothing recorded».
Checked: `--mark-shown --transport chat` → exit 2; `<doc> --mark-shown chat` → exit 2; `--mark-shown interviews/nope.md` → exit 2;
`--mark-shown <doc> --transport чат` → recorded, exit 0. The new junk keys were reverted from `shown.json` by `git checkout`; the
pre-existing `"chat"` key of 2026-10-13 is left as found. To reconcile at the next `/kaif-update`.
