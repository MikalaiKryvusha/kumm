# KAIF improvement request: the mid-turn answer must NOT open by quoting the owner's words back to him

kaif-fp: AGENT_GUIDE "The owner's word mid-turn — the system signs its author" step 2 :: mid-turn-echo :: v2.9
**Delivered upstream:** https://github.com/MikalaiKryvusha/KAIF/issues/180
**Autocapture:** KAIF 2.9 · project KUMM · sphere programming · language ru · tracking origin · agent system claude-code (Claude Opus 5.5) · OS Windows 11 Pro 10.0.26200
**Dedup attestation:** `grep -ril "mid-turn\|first words" bugs/KAIF/` → none; `gh issue list -R MikalaiKryvusha/KAIF --state all --search "mid-turn in:title,body"` → empty;
`--search "\"first words\""` → empty.

## Gap

AGENT_GUIDE → "The owner's word mid-turn", step 2: «Answer it AT ONCE — your next output, before any further tool call — by its kind, AS TEXT,
**opening with its first words in «…»**». The agent obeys: every answer to a mid-turn message starts by echoing the owner's own words to him.

## Field evidence

KUMM, 2026-10-29 10:2x. The owner sent four short mid-turn notes while the agent closed old bugs; the agent opened each answer with his words in
quotes («Давно исправлено» — понял…, «Уверен, что исправлено» про падение в главном меню…). The owner, verbatim:
«"Уверен, что исправлено" про падение в главном меню · убери , где в KAif тебе сказано повторять то, что я написал. Не нужно повторять мои слова».
The echo costs the owner reading time and reads as a parrot, not as an answer; the system already shows him which message is being answered.

## Proposal

Step 2 reads: «Answer it AT ONCE — your next output, before any further tool call — by its kind, AS TEXT, **without repeating his words back to
him**». The judge's hunt "owner's word mid-turn ignored" keeps checking that an answer came, not that it quoted.

## Local remediation

KUMM `AGENT_GUIDE.md` step 2 rewritten the same minute (`[OWNER]` 2026-10-29, the KUMM chronicle entry of that day) — reconcile at the next
`/kaif-update`.
