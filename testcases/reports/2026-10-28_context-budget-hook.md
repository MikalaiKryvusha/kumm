# Run report — context-budget hook (watcher of the chat context window), 2026-10-28 23:26

**Created:** 2026-10-28 23:27 +03:00 · **Run by:** the agent (claude-opus-5-5) · **Version/build:** `.claude/hooks/context-budget.mjs` as written 2026-10-28 23:2x

## 1. Work

The hook from `D:\skill.md` deployed into KUMM by the owner's word of 2026-10-28 («разверни у нас такой хук… и самостоятельно закрывать чаты,
когда окно заканчивается»). Basis — the skill's threshold table: < 70 % silent · ≥ 70 % "no new big work" · ≥ 75 % "close the chat"
(here: `/end-chat-soft`) · ≥ 85 % "close now" (here: `/end-chat-force`), on every call; PreToolUse speaks once per new 5 % step below 85 %.

## 2. Contour

KUMM, Git Bash, Node v24.15.0. Data — the REAL transcript of this session
(`~/.claude/projects/d--work-ai-sandbox-KUMM/7ff945d4-….jsonl`, last main-session answer ≈ 221 k tokens). Window 1 000 000 by observation:
the previous chat of the same model (`claude-opus-5-5`, transcript `38323b75-…`) reached 689 183 tokens.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-10-28 23:26 +03:00 | `node .claude/hooks/context-budget.mjs --check` (also with `CONTEXT_BUDGET_WINDOW=1000000` and `=200000`) | 0 · 14/14 three times |
| 2 | 2026-10-28 23:26 +03:00 | `echo '{"hook_event_name":"UserPromptSubmit","session_id":"probe","transcript_path":"<this session>"}' \| CONTEXT_BUDGET_WINDOW=200000 node .claude/hooks/context-budget.mjs` | 0 · «110.4 % … СРОЧНО ЗАКРЫВАЙ ЧАТ … /end-chat-force» |
| 3 | 2026-10-28 23:26 +03:00 | same input, `PreToolUse`, same session state | 0 · same urgent line (≥ 85 % speaks on every call — by design) |
| 4 | 2026-10-28 23:26 +03:00 | same input, `UserPromptSubmit`, `CONTEXT_BUDGET_WINDOW=1000000` | 0 · silent (22 %) |
| 5 | 2026-10-28 23:26 +03:00 | same input, `UserPromptSubmit`, `CONTEXT_BUDGET_WINDOW=290000` | 0 · «76.1 % … ПОРА ЗАКРЫВАТЬ ЧАТ … /end-chat-soft» |
| 6 | 2026-10-28 23:26 +03:00 | `echo "not json" \| node .claude/hooks/context-budget.mjs` | 0 · silent |
| 7 | 2026-10-28 23:26 +03:00 | `node -e "JSON.parse(…'.claude/settings.json'…)"` | 0 · settings.json parses |

## 4. Checks

- **Hygiene:** self-check 14/14 at windows 200 k and 1 M, including the mutant without `cache_read` going red; settings.json parses.
- **Functional run:** the hook script walked on the real transcript of this session with the input Claude Code sends (runs 2–6): the line READ
  in each case matches the threshold table and names the project rituals. NOT walked: the hook being invoked BY Claude Code itself — hooks are
  picked up by a new session (`D:\skill.md`, step 6), and in this session the window is at ≈ 22 %, below the first threshold, so even a live
  invocation would be silent. First observation on the real path — the first time a session crosses 70 %.

| Case | Expected | Observed | Status |
|---|---|---|---|
| C1 — under 70 % silent | no output | run 4: no output | pass |
| C2 — 75–85 % soft close | «ПОРА ЗАКРЫВАТЬ ЧАТ», `/end-chat-soft` | run 5 | pass |
| C3 — ≥ 85 % urgent close | «СРОЧНО ЗАКРЫВАЙ ЧАТ», `/end-chat-force` | run 2 | pass |
| C4 — ≥ 85 % repeats on PreToolUse | line on every call | run 3 | pass |
| C5 — broken input | silent, exit 0 | run 6 | pass |
| C6 — invoked by Claude Code in a session that crosses 70 % | line in agent context | 2026-10-29 00:52, this session, PreToolUse on an Edit: «context-budget · контекст ≈ 701 тыс. токенов = 70.1 % окна 1000 тыс. Новую большую работу не начинай…» arrived as hook context (the hook was wired mid-session; Claude Code picked it up without a restart) | pass |

## 5. Found

None.

## 6. Traces

The command outputs above (chat of 2026-10-28 23:26); state files `D:\Temp\context-budget-probe*.json` removed after the run.

## 7. Verdict

pass — the script is verified on real data (2026-10-28), and its invocation by Claude Code on the real path was observed at 70.1 % (C6,
2026-10-29 00:52).
