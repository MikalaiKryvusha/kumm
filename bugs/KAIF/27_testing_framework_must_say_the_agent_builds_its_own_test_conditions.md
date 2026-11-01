# KAIF improvement 27 — TESTING_FRAMEWORK should say plainly: the test conditions are the agent's to build, by itself, on the machine it was given

**Severity:** S2 (owner's working time: the agent reported «four rows need a stand with a frozen creature» as if the stand were the owner's matter)
**Version:** KAIF 2.9, `TESTING_FRAMEWORK.md` · **When:** 2026-11-01 14:47, KUMM (Conan build, the settings-window audit)
**Delivered upstream:** https://github.com/MikalaiKryvusha/KAIF/issues/189

## Symptom

Closing a run, the agent listed four settings rows whose effect it had not observed and wrote «для этих четырёх нужен стенд с замороженным существом» — a
need, not an action. The project already had the tools for exactly that stand (`arrow-stand.sh summon / place / freeze`) and a house rule «the agent prepares
its own test stand» (KUMM `HOUSE_RULES.md` rule 11, born from the same owner's earlier words «СОЗДАВАЙ СЕБЕ САМ ТЕСТОВЫЕ УСЛОВИЯ!!!» · 2026-11-01 08:45). The
owner: «В твоем распоряжении целый комп с игрой, что нужно, то себе и настраивай» · «об этом фреймворк тестирования КАИФ тебе должен говорить - что ты волен
настраивать себе тестовые условия» (2026-11-01 14:47).

## Expected

`TESTING_FRAMEWORK.md` (the canon every project inherits, not a house rule a project must invent after a miss) states, in the executable form of the canon:

1. **The test conditions are the agent's to build.** The stand — data, state, place, actors, inputs, time — is set up by the agent itself with whatever the
   machine it was given allows (cheats, remotes, spawners, fixtures, a scratch copy of the data); a missing condition is a step of the run, never an item handed
   to the owner.
2. **An unobserved case is reported with the stand step that was not done yet and is done next**, not as «needs a stand».
3. The only limits are the project's own boundaries (the owner's data that must not change, destructive actions, outward acts) — named in the house rules.

## Local remediation (KUMM)

`HOUSE_RULES.md` rule 11 already says it (steps 1–7, 5a «SPAWNED by the remote … never asked of the owner»); the agent built the stand in the same turn.
This ticket asks the origin to carry the rule in the shipped testing canon, so a fresh deployment does not pay for it again.

## Proposal for the origin

A short section «The stand is the agent's» in `TESTING_FRAMEWORK.md` next to «What the word "test" means», with the three steps above and a judge hunt:
«an unobserved case closed as "needs a stand" while the stand's tools exist».
