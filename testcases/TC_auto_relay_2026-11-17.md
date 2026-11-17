# Test cases — the auto-relay skill: a long autonomous run hops from chat to chat (KAIF decision №160)

**Created:** 2026-11-17 · **Under test:** `.claude/auto-relay/relay.mjs`, `.claude/hooks/relay-hook.mjs`, `.claude/auto-relay/open-chat.ps1`,
`.claude/skills/auto-relay/SKILL.md`, the wiring in `.claude/settings.json`, the export of `OFF` from `tools/hooks/autonomy-guard.mjs` ·
**Version/build:** KUMM after `d5f102b` + this work; VS Code 1.123.0, extension `anthropic.claude-code` 2.1.326, Windows 11, VS Code elevated
(«KUMM - Visual Studio Code [Administrator]»), the agent's shells at the high integrity level (S-1-16-12288)
**Test basis:** the owner's guide `KAIF/ideas/auto_relay_windows_guide.md` (KAIF `e34fd93`) §5 acceptance and §6 risks; the owner's task relayed by the KAIF
session 2026-11-17 11:02 (STATUS «FIRST NEXT CHAT — item 1», checks 1–6); the KAIF session's two extra risks of 11:26 (a Stop blocked by another hook;
STATUS freshness by a commit, not by mtime).

## 1. Goal vector

Achieve: when the owner starts `/auto-relay <task>`, every chat of the run closes by the project's own closure, and after its farewell a new chat opens by
itself in the same VS Code window and continues from STATUS.md — with no second window gauge, no second handover document, never two agents at once,
never a key pressed into the owner's work.

## 2. Requirements under test

| # | Requirement (EARS sentence) | Fit criterion (Scale · Meter · Target) |
|---|---|---|
| R1 | WHEN the run's chat ends with the marked farewell of an accepted closure AND STATUS.md is committed after the chat started, the Stop hook shall start the opener | `relay.log` «relay → chat N of M» · e2e · present |
| R2 | WHILE the old chat is not quiet (a write < 10 s ago, or the last record not a text answer), the opener shall not open a chat | e2e: a blocked stop («Stop hook feedback» last) opens nothing for 1.5 s, opens after the one-line answer |
| R3 | IF the stop is not a farewell, or another chat's, or STATUS.md is not committed / has edits, THEN nothing shall open | e2e, self-test · 0 openers |
| R4 | The relay hook shall never block a stop | e2e: Stop stdout empty in every case |
| R5 | WHEN the next chat gets «resume auto-relay continue», the hook shall order `relay.mjs continue`, then /resume | e2e: the order text |
| R6 | WHEN the chat limit is reached or the owner says a stop word, the run shall end and the autonomy mode the relay set shall go off | e2e |
| R7 | The opener shall press nothing while the owner's keyboard / mouse were used < 3 s ago, and Enter only into this project's VS Code window | live run L2 · `relay.log` «idle … s», «sent … to 'KUMM - Visual Studio Code…'» |
| R8 | The deep link shall open a new chat tab with the text, not sent | live run L1 · the owner's eye / the new session's transcript absent |
| R9 | The old hooks shall behave as before (the autonomy guard, the farewell hook, the budget gauge) | `node tools/test-guards.mjs` 308/308 · `context-budget.mjs --check` 38/38 |

## 3. Cases

| ID | Case | Expected | Status |
|---|---|---|---|
| S1 | `node .claude/auto-relay/relay.mjs --check` | `auto-relay self-test: 22/22` | — |
| E1 | `node .claude/auto-relay/e2e.mjs` (copies in `KUMM/.work/`, own git repo, dry opener) | `e2e: 19/19`, the scratch folder gone | — |
| G1 | `node tools/test-guards.mjs` · `node .claude/hooks/context-budget.mjs --check` after the `OFF` export | 308/308 · 38/38 | — |
| M1 | mutant: `turnFinished` skips `user` records | E1 «blocked stop: no chat opened» goes red | — |
| M2 | mutant: the Stop hook spawns without the farewell mark | E1 «a plain stop … nothing opened» goes red | — |
| L1 | the deep link by hand: `Start-Process "vscode://anthropic.claude-code/open?prompt=…"` | a new chat tab with the text, not sent | — |
| L2 | the opener by hand: `open-chat.ps1 -Folder <KUMM> -Prompt "Ответь одним словом: открылся"` from the elevated shell | the new chat answers; `relay.log` «sent» | — |
| L3 | the live chain: a run's real closure → the next chat opens by itself and runs `relay.mjs continue` | `relay.log` relay → open → sent; the new chat's first command `continue` | — |
| C5 | `CLAUDE_CODE_SESSION_ID` in the agent's shell (check 5) | not empty | — |
| C4 | the hooks' `os.tmpdir()` (check 4) | `F:\Temp`, never `D:\Temp`; the relay keeps no tmp memory at all | — |

## 4. Not covered (risks named)

- The extension's Stop hook kills a detached child when the hook exits — only L3 shows it (the opener writes «open: waiting…» first).
- A Windows foreground lock when the owner is in another app (a game, a browser): the window may not come forward → `FAILED`, Enter not sent; the owner
  sends «resume auto-relay continue» by hand. Seen only in L3 with another app in front.
- An unknown future transcript record type after the farewell makes the opener wait (fail closed) until the 30-minute `FAILED`.
