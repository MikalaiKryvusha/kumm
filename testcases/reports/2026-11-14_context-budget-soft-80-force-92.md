# Test run report — context-budget closure ladder: soft from 80 %, force only from 92 %

**Created:** 2026-11-14 22:39 +03:00 · **Run by:** the agent (claude-opus-5-5) · **Version/build:** KUMM working tree after `b2e8cec` (uncommitted edits of
`.claude/hooks/context-budget.mjs`, `tools/hooks/autonomy-guard.mjs`, `tools/hooks/farewell-capture.mjs`, `tools/test-guards.mjs`)

## 1. Work

The owner's order of 2026-11-14 19:10 and 22:29 (verbatim — `PROJECT_HISTORY.md`, entry 2026-11-14 22:3x): from 80 % of the window finish the current work and
run the soft closure (judge, handover, trim, commit, push, farewell); the force closure only from 92 %, never earlier. Basis — the hook's own self-check cases
(`--check`: 27 in round 1, 36 in round 2, 37 in round 3) and `tools/test-guards.mjs` parts J (farewell, 14) and K (autonomy, 19), written with the change.

## 2. Contour

The two Claude Code hooks as the harness runs them (`node <hook>` with a hook event on stdin), on this machine's Node v24, window `CONTEXT_BUDGET_WINDOW` 1 000 000
(the shared `.claude/settings.json`) and 200 000 (the default). REAL WORLD: accumulated — this live session's transcript (`85089563…jsonl`, 24.7 % of the 1 M window
at the run) and the owner's live autonomy marker `.kaif/autonomy.json` (armed by his 22:33 «да, работай автономно в дневном лупе»); data and machine — his machine,
the real transcript; path — the hook commands the harness itself calls (PreToolUse on Skill, Stop). The thresholds 80 / 92 % themselves are not reachable in a live
session on demand — they are walked by the fixture transcripts of the self-checks.

## 3. Runs

All seven runs between 2026-11-14 22:33 and 22:37 +03:00 (the clock read 22:33 at the owner's message before run 1 and 22:37 after run 7; the minute of each run
was not probed separately).

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | ≈ 2026-11-14 22:3x +03:00 | `CONTEXT_BUDGET_WINDOW=1000000 node .claude/hooks/context-budget.mjs --check` | 0 · 27/27 |
| 2 | ≈ 2026-11-14 22:3x +03:00 | `CONTEXT_BUDGET_WINDOW=200000 node .claude/hooks/context-budget.mjs --check` | 0 · 27/27 |
| 3 | ≈ 2026-11-14 22:3x +03:00 | mutant `PCT_FORCE = 85` → `node .work/cbmut/.claude/hooks/context-budget.mjs --check` | 1 · 2 of 27 red (86 % soft, force-gate at 86 %) |
| 4 | ≈ 2026-11-14 22:3x +03:00 | mutant force gate disabled (`if (false)`) → same command | 1 · 1 of 27 red (force-gate at 86 %) |
| 5 | ≈ 2026-11-14 22:3x +03:00 | `node tools/test-guards.mjs` | 0 · 286 of 286 as expected (part K 16) |
| 6 | ≈ 2026-11-14 22:3x +03:00 | PreToolUse Skill `end-chat-force` / `end-chat-soft` / `dayloop` with this session's real `transcript_path` → `node .claude/hooks/context-budget.mjs` | 0 · force and soft denied «окно 24.7 % — меньше 80 %», dayloop silent |
| 7 | ≈ 2026-11-14 22:3x +03:00 | Stop with the real `transcript_path`, state `{"on":true}` → `node tools/hooks/autonomy-guard.mjs --state .work/tmp/ag-live.json` | 0 · block «окно 25 % < 80 % — не останавливайся» |

**Round 2 (after judge round 1, between 2026-11-14 22:46 and 22:51 +03:00):** the judge's findings — a REFUSED closure call counted as a closure by
`farewell-capture.mjs` / `autonomy-guard.mjs` (confirmed by reading `readTurn`, fixed: `is_error` tool_result clears it); closing words in the 70 / 75 % warnings
(confirmed, removed); thresholds not pinned (confirmed — boundary cases added); rounding up of the shown percent (confirmed, `shown()` floors to a tenth); the
owner's request inside the soft zone (wording fixed); a soft closure running at 92 % (wording added). Runs:

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 8 | ≈ 2026-11-14 22:4x +03:00 | `CONTEXT_BUDGET_WINDOW=1000000` / `200000` `node .claude/hooks/context-budget.mjs --check` | 0 · 36/36 at both windows |
| 9 | ≈ 2026-11-14 22:4x +03:00 | `node tools/test-guards.mjs` | 0 · 290 of 290 (part J + 2 refused-closure cases, part K 18) |
| 10 | ≈ 2026-11-14 22:4x +03:00 | mutants `PCT_FORCE = 90` · `PCT_SOFT = 81` · a warning tail «с 80 % — доделать работу и мягкое закрытие» · `shown()` = `toFixed(1)` | 1 each · 2 / 2 / 1 / 1 of 36 red (the last after adding the 91.96 % case) |
| 11 | ≈ 2026-11-14 22:4x +03:00 | mutant: `readTurn` ignores `is_error` → `node tools/test-guards.mjs` | 288 of 290 — J «a refused /end-chat-force is not a closure» and K «a refused closure keeps the mode on» red; file restored |
| 12 | ≈ 2026-11-14 22:5x +03:00 | runs 6 and 7 again on the live transcript | deny «окно 38.5 % — меньше 80 %»; Stop blocked «не останавливайся» |

## 4. Checks

Hygiene: final — self-check 37/37 at both windows · test-guards 292/292 (J 14, K 19) · mutation: round 1 two mutants, round 2 five, round 3 one («a refusal erases the earlier accepted closure» — J and K red) — each red on its target cases (runs 3, 4, 10, 11, 13)
Functional run: the two hooks driven by the harness's own event shape on the REAL transcript of this live session (runs 6, 7) — the deny reasons and the Stop
block READ verbatim; the 80–92 % zone walked only by fixture transcripts (a live session cannot be pushed to 80 % on demand)

| Case | Status | Observation |
|---|---|---|
| 72 / 78 % — warning only, no closing order | pass | «работай дальше», no «ЗАКРЫВАЙ / end-chat» |
| 82 % — «ПОРА ЗАКРЫВАТЬ МЯГКО», «доделай», `/end-chat-soft`, not «СРОЧНО» | pass | self-check |
| 86 % — still soft, not force; a new 5 % step speaks on PreToolUse | pass | self-check (red under the 85 % mutant) |
| 93 % — «СРОЧНО ЗАКРЫВАЙ ЧАТ» on every PreToolUse | pass | self-check |
| gate: soft at 78 % denied, soft at 82 % allowed | pass | self-check |
| gate: force at 86 % denied and pointed to `/end-chat-soft`; force at 93 % allowed; force at 86 % with `owner: «…»` allowed | pass | self-check (red under both mutants) |
| live gate on this session (24.7 %): both closures denied with the new text; another skill untouched | pass | run 6 |
| autonomy Stop: 76 / 79.9 % work on · 80.0 / 86 / 91.9 % close softly (`/end-chat-soft` named) · 92.0 % close by force (`/end-chat-force` named) | pass | part K |
| a refused closure call is not a closure; an accepted soft closure followed by a refused force still is (farewell written, the stop passes) | pass | parts J, K |
| the owner's request is still done at 80–92 % and from 92 % (the hook text says so) | pass | self-check |
| live autonomy Stop on this session: blocked, «не останавливайся» | pass | run 7 |

## 5. Found

Found by the independent judges (rounds 1–2) and fixed in this work, each re-run above — no bug document (S3 papercuts of a change still in flight):

- a closure call REFUSED by the gate counted as a closure (autonomy off, a false farewell) — `readTurn` reads the tool_result's `is_error`;
- then: a later refused call erased an earlier accepted closure — the refusal clears only its own call;
- closing words in the 70 / 75 % warnings (the 2026-10-31 class) — removed, the self-check bans the stems;
- thresholds not pinned by any case — boundary cases 79.9 / 80.0 / 91.9 / 92.0;
- the shown percent rounded up («окно 92 % — меньше 92 %») — floored to a tenth;
- the soft and force texts told the agent to defer the owner's request — both now say it is done at once;
- «autocompaction at ≈ 89 %» in the reference was wrong — measured ≈ 96.7 % (six auto compactions, 967–969 K of 1 M).

**Round 3 (between 2026-11-14 23:04 and 23:08 +03:00):**

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 13 | ≈ 2026-11-14 23:0x +03:00 | `--check` at both windows · `node tools/test-guards.mjs` · mutant «a refusal erases the earlier accepted closure» | 37/37 · 292/292 · mutant 290/292 (J + K red), restored |
| 14 | ≈ 2026-11-14 23:05 +03:00 | a throwaway scan of the project's transcripts for `compactMetadata.trigger: "auto"` | six auto compactions at 967 096 – 968 717 tokens; the highest context without one 940 031 |

## 6. Traces

Run outputs in this chat's transcript (`85089563-6b62-4081-9eda-4252a86e6fd3.jsonl`); the mutant copies under `.work/cbmut/` and `.work/tmp/ag-live.json` were deleted
after the runs.

**Seen live in this chat after the commit `30a8a12`:** 2026-11-14 23:51 the hook's real 70 % line «context-budget · контекст ≈ 700 тыс. токенов = 70.0 % окна
1000 тыс. Предупреждение: работай дальше в обычном темпе.»; 2026-11-15 00:0x the autonomy guard REFUSED a real Stop at 74.1 % with «не останавливайся. Бери
следующий пункт беклога … работай в обычном темпе» (no closing word); the farewell hook on the same transcript wrote nothing (no closure in the turn).

## 7. Verdict

partial — every case passes and the live path answers on the real transcript; the soft and force zones themselves are proven on fixtures only. The first live
crossing of 80 % in a real chat is the remaining observation (the hook's line and the agent's closure in that chat).
