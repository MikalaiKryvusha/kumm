# KAIF improvement request: an agent ends its turn with «shall I do my own next step?» — a field-proven Stop hook that refuses it

kaif-fp: canon `AGENT_GUIDE.md` → "Decisions the agent must NOT make alone" (task-level question) · refresh-hooks module (Stop) :: turn-ends-with-permission-question :: v2.7
**Delivered upstream:** https://github.com/MikalaiKryvusha/KAIF/issues/140
**Autocapture:** KAIF 2.7 · project KUMM · sphere `programming` · language `ru` (language pack) · tracking `origin` · agent
system claude-code · OS Windows 11 Pro 10.0.26200 · Node v24.15.0
**Dedup attestation:** `ls bugs/KAIF/` → 08 (#82) is the neighbour: owner-ask questions typed into chat bypass the `interviews/`
door, and it PROPOSED a Stop-time check without building one. This ticket is a different class — the question is not the
owner's at all, it asks permission for the agent's OWN next step — and it brings the hook built and proven.
`gh issue list --repo MikalaiKryvusha/KAIF --state all --search "permission question stop hook"` and `--search "Запустить
сейчас"` → no match.

## Gap

The canon lets the agent ask «exactly one pointed question» on task-level ambiguity. Agents stretch it into a habit: the
turn ends with «Запустить эту проверку сейчас?», «Сделать?», «Продолжаю?» — a question whose answer is always «yes, that is
your job». The agent then idles until the owner returns. A memory rule against it existed in this project
(«ход кончать, только если нужно его решение, иначе работать дальше», 2026-10-05) and did not hold.

Field case, this project, 2026-10-08: after a plan answer the agent ended with «Запустить эту проверку сейчас?». The
owner, verbatim: «Так. Давай изменим твои правила, и может хук напишем. Я тебе уже говорил про такое "Запустить эту проверку
сейчас?" - а ты не послушал меня, и продолжаешь задавать эти ненужные вопросы».

## Proposal

1. Canon, positive form at the decision point (end of turn): «read your last line; a question about YOUR next action —
   delete it and do the action, then report; a question that is genuinely the owner's goes to `interviews/` or carries an
   explicit marker».
2. The refresh-hooks module ships a Stop hook like ours: read the last assistant text (the `last_assistant_message`
   field when present, else the transcript the event names), take the last line, and when it ends with «?» and opens
   with an action verb of the agent (language-pack list: Запустить / Сделать / Продолжаю… · Shall I / Should I / Want me
   to…) — return `{"decision":"block","reason":…}` once (`stop_hook_active` prevents a loop). Declared exception: a
   marker such as `<!-- owner-decision -->` in the reply.

## Field evidence

- Hook: `tools/hooks/no-permission-question.mjs` in KUMM (`@guard` block with THREAT / PROVED-AGAINST / GAP /
  ON-REAL-PATH). Self-test `tools/test-guards.mjs` part H — 11 cases; a stub hook (always pass) turns 6 of them red.
- Real path: the session's own Claude Code transcript (JSONL), cut at the offending reply → `block`; the whole transcript
  (last line a statement) → pass.
- Lesson record: the owner's quote above; memory `no-permission-questions-just-do`.

## Local remediation

Built and wired (local `.claude/settings.local.json`, `hooks.Stop`); rule in `AGENT_GUIDE.md` → «Notes from the human»
and the Tools table. A future KAIF hook with the same contract replaces ours at the next update.
