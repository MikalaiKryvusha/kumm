# KAIF bug 26 — the context-budget closure at 75 % made the agent wind down at 70 %: the owner wants warnings at 70 / 75 and the closure at 85

**Severity:** S2 (owner's working time lost: the agent wrote a farewell-style summary and stopped taking work at 70 % of a 1M window)
**Version:** KAIF 2.9 + the KUMM-local `.claude/hooks/context-budget.mjs` and `tools/hooks/autonomy-guard.mjs` (closure tickets #181–#183 family) ·
**When:** 2026-10-31 21:26, KUMM dayloop
**Delivered upstream:** https://github.com/MikalaiKryvusha/KAIF/issues/188

## Symptom

The hook said at 70 %: «Новую большую работу не начинай: доводи текущую до логического среза — на 75 % пора закрывать чат», and `CLAUDE.md` said «at 75 % —
close the chat with a handover». The agent took the 70 % line as the start of the closure: it summarized the session, declared an autonomy pause and stopped
picking new backlog items with 30 % of the window left. The owner: «давай ка переделаем твой навык. на 70 и 75 я просил лишь предупреждать, а не закрываться» ·
«ты слишком рано закрываешься» (2026-10-31 21:26).

## Expected

70 % and 75 % are WARNINGS ONLY — the agent keeps its normal pace and keeps the status file fresh; the closure starts at 85 %. A warning text must not carry
closing vocabulary («доводи до среза», «пора закрывать»): a weak or tired session reads it as the order.

## Local remediation (KUMM, 2026-10-31, commit `24b3400`)

- `context-budget.mjs`: the 70 / 75 % messages say «Предупреждение: работай дальше; чат закрывается только на 85 %»; self-check cases 72 / 78 % demand
  «работай дальше» and refuse any closing order (14/14).
- `autonomy-guard.mjs`: the Stop guard blocks a voluntary stop until `PCT_FORCE` (85 %), not `PCT_CLOSE` (75 %); `tools/test-guards.mjs` part K — 76 % blocks with
  «work on», 86 % with «close» (184/184).
- `CLAUDE.md`, `AGENT_GUIDE.md` (autonomous mode) moved to the same boundary. Seen live on the owner's next prompts at 72.6–75.0 %.

## Proposal for the origin

Ship the budget hook with one closure threshold and warnings that never use closing words; make the thresholds a deployment setting the owner states in his
own words at install (some owners want the soft closure early, this one wants work to the end).
