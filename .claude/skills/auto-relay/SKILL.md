---
name: auto-relay
description: "A long autonomous task that does not fit in one chat: the agent works on its own, closes the chat by the project's own closure when the window fills (/end-chat-soft from 80 %, /end-chat-force from 92 %), and the hook opens a NEW VS Code chat that continues the work from STATUS.md. Use on «работай автономно с созданием новых чатов автоматически», «длинная автономная задача на много чатов», «/auto-relay <task>», «auto-relay», and ALWAYS when a message is «resume auto-relay continue» or starts with «auto-relay continue» (the previous chat's hook sent it). Trigger aliases (ru): «работай автономно с созданием новых чатов», «эстафета чатов», «автоэстафета»"
---

# /auto-relay — autonomous work that hops from chat to chat

KUMM's local build of the KAIF skill (the owner's guide `D:/work/ai_sandbox/KAIF/ideas/auto_relay_windows_guide.md`, KAIF `e34fd93`, decision №160).
The parts: `.claude/auto-relay/relay.mjs` (the run's state, `state.json`), `.claude/hooks/relay-hook.mjs` (Stop + UserPromptSubmit),
`.claude/auto-relay/open-chat.ps1` (the opener), `.claude/auto-relay/e2e.mjs` (the chain on copies). The log of a run — `.claude/auto-relay/relay.log`.

**What is the project's own here (one of each):** the window gauge is `.claude/hooks/context-budget.mjs`; the handover is STATUS.md «Where to continue» +
the farewell file; the entry is the resume word. The relay adds only the chain: after the farewell of an accepted closure it opens the next chat
with «resume auto-relay continue», once this chat is quiet.

Modes: `/auto-relay <task>` — start · «resume auto-relay continue» — the next chat (the opener types it) · `/auto-relay stop` — switch off.

## Start (`/auto-relay <task>`)

1. Frame the task so it can be done without the owner: the **goal** in one line, the **done criteria** (each checked by a command or an observation),
   the **boundaries** (what not to touch; outward sends — releases, Nexus, mail — only with the owner's explicit «да»). If the task cannot start
   without the owner's answer, ask ONE question now; no more questions after that.
2. `node .claude/auto-relay/relay.mjs start --task "<goal in one line>" [--max 10]` — `--max` is how many chats in a row at most (the owner's number,
   if he named one). The command switches the autonomy mode on (`.kaif/autonomy.json`): `tools/hooks/autonomy-guard.mjs` now refuses every early stop.
3. Write the **run block** as the first item of STATUS.md «Where to continue»: `AUTO-RELAY RUN — <goal>` · chat N of M · done criteria (checkboxes) ·
   boundaries · done so far (with the proof: command, output, commit) · **next step** (file, command, expected result) · traps tried · questions to the owner.
   Commit it.
4. Work.

## Work (every chat of the run)

- The loop: step → verify by observation (a run, a test, the output) → commit → refresh the run block in STATUS.md at every milestone. It is the
  insurance against an auto-compaction or a broken chat.
- Do not stop for a question: write it into the run block, take the next step that does not depend on the answer. Everything rests on the owner →
  `node .claude/auto-relay/relay.mjs stop --reason "waiting for the owner: <what>"`, call him by voice (HOUSE_RULES rule 13), end with
  `<!-- autonomy-pause: <why> -->`.
- The window: `context-budget` speaks at 70 / 75 % (warnings — work on), orders the soft closure from 80 %, the forced one from 92 %. There is no
  other threshold.

## Handover (the project's closure)

1. When `context-budget` orders it, run `/end-chat-soft` in full (from 92 % `/end-chat-force`) — the judge, the STATUS handover with the run block up to
   date, the bonsai trim, commit, push. **STATUS.md must be committed in this chat with no edits left**, or the next chat will not open.
2. Right before the farewell: `node .claude/auto-relay/relay.mjs status`. It says one of three: the next chat opens itself · the run ENDS with this chat
   (the chat limit) · the next chat will NOT open (and why — fix it: usually STATUS.md not committed). The farewell says that line to the owner instead
   of asking him to open a chat.
3. The farewell ends with `<!-- farewell -->`, as always. After it — nothing. The Stop hook starts the opener: it waits until this chat is quiet
   (≥ 10 s without a write and the last record a text answer — a stop blocked by another hook waits for your one-line answer), until the owner's
   keyboard and mouse are idle 3 s, raises the VS Code window, opens a new chat with «resume auto-relay continue» and presses Enter only if that
   window is in front. A failure is a `FAILED` line in `relay.log`; the owner then sends «resume auto-relay continue» by hand.

## Continue («resume auto-relay continue»)

1. `node .claude/auto-relay/relay.mjs continue` — binds this chat to the run, switches the autonomy mode on.
2. `/resume` in full (the resume word orders it).
3. The run block in STATUS.md «Where to continue»: check that the previous chat's last commit is there and the «next step» is not done yet; continue
   from it.

## Final

All done criteria met and verified → `node .claude/auto-relay/relay.mjs stop --reason "<result>"` → the run block in STATUS.md replaced by a short
result line → report to the owner: what was done, by what observation it was verified, how many chats it took, what stays unverified.
