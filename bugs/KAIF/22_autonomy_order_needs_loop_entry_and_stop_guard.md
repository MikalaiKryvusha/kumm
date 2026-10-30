# KAIF improvement request: «work autonomously» must enter the day loop at once, and a Stop guard must refuse a voluntary stop until the context-budget closure

kaif-fp: AGENT_GUIDE "AUTONOMOUS MODE" + skills/dayloop + hooks/ :: autonomy-order-stop :: v2.9
**Delivered upstream:** https://github.com/MikalaiKryvusha/KAIF/issues/182
**Autocapture:** KAIF 2.9 · project KUMM · sphere programming · language ru · tracking origin · agent system claude-code (Claude Opus 5.5, 1 M window) · OS Windows 11 Pro 10.0.26200 · Node v24.15.0
**Dedup attestation:** `grep -ril "autonom" bugs/KAIF/` → 21 (farewell hook — the closure's output, not the loop entry); the origin issues searched by
`gh issue list -R MikalaiKryvusha/KAIF --state all --search "autonomous stop"` and `--search "dayloop"` before filing (see the delivery line).

## Gap

`AGENT_GUIDE` → "AUTONOMOUS MODE" says the agent SHOULD enter a loop skill when the human granted autonomy, and «Do not enter a loop if the human just
gave a specific interactive task». An owner message that carries tasks AND «работай автономно» falls between the two; the agent did the tasks, then
ended every turn with a report. `/dayloop`'s Russian triggers carry «работай сам, я занят» but not the plain «работай автономно». No shipped hook
refuses a voluntary stop under an autonomy order, so the chat never reached the context-budget closure and no farewell was filed.

## Field evidence

KUMM, 2026-10-30: «я закончил, комп твой» · «работай автономно» (08:34, no end time). The agent stopped at ≈ 68 % of a 1 M window «at a natural cut»,
judging the context «large» by feel (the context-budget hook warns at 70 %, closes at 75 %). The owner, verbatim: «Я давал тебе команду работать
автономно, не задал время, до которого работать - это значит я ожидал: ты работаешь автономно; когда окно контекста переполняется - ты начинаешь
завершать дела, и начинаешь закрытие чата; по закрытию чата пишешь прощальное сообщение в документ FAREWELL_MESSAGE_FROM_THE_PREVIOUS_CHAT.md» ·
«Почему так не сработало?».

## Proposal

1. Prose: the autonomy order («work autonomously», «работай автономно», «работай сам», «автопилот») = enter `/dayloop` at once, after the tasks of the
   same message; the loop ends only by the owner's word or by the context-budget closure.
2. `/dayloop`: add «работай автономно» to the triggers; name the context-budget closure (75 % → `/end-chat-soft`) among the stop conditions.
3. Ship a Stop + UserPromptSubmit hook in the refresh-hooks module (together with the context-budget hook and the farewell hook of #181): the order
   switches a session marker ON, «стоп/пауза» switches it OFF; while ON a stop is refused — under 75 % «work on», from 75 % «close the chat»; a turn
   that ran the closure skill passes; a declared `<!-- autonomy-pause: <why> -->` passes (everything left waits for the owner, who was called).
4. Never estimate the window by feel — read the context-budget hook's number.

## Local remediation

KUMM 2026-10-30: `tools/hooks/autonomy-guard.mjs` (wired locally; self-test `tools/test-guards.mjs` part K, 10 cases, a never-blocking mutant reddens
3; on the real transcript at 71 % it returned «block … не останавливайся»); `farewell-capture.mjs` made import-safe; `AGENT_GUIDE.md` "AUTONOMOUS MODE"
carries the KUMM rule; EXP-0379. Reconcile at the next `/kaif-update`.
