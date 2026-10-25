# Run report — the testing hook test-after-code ported from Unliminium

- **Work:** `tools/hooks/test-after-code.mjs` — port of Unliminium's hook (the owner's word 2026-10-25 «возьми оттуда хук в KUMM про цикл
  код - тесты - правки»); basis — the hook's own `@guard` block (THREAT / PROVED-AGAINST) and the Unliminium original's behaviour.
- **Contour:** this machine, Claude Code session in `D:\work\ai_sandbox\KUMM`; hook wired in the git-ignored `.claude/settings.local.json`
  (`PostToolUse` `Write|Edit|MultiEdit|Bash|PowerShell`, `Stop`); state `.kaif/test-debt.json`.
- **Runs:**
  - 2026-10-25 ≈11:09 — `node tools/hooks/test-after-code.mjs --selftest`;
  - the same minute — mutant: `sed` drops the debt write → `node <scratchpad>/mutant/tools/hooks/test-after-code.mjs --selftest`;
  - 11:11 — live: Edit of `tools/hooks/test-after-code.mjs` in this session, then `node tools/hooks/test-after-code.mjs --selftest`.
- **Checks:**
  - Hygiene: none beyond the selftest itself (no linter run).
  - Functional run: the hook on the real path — the session's own Edit and Bash events. After the Edit the context received
    «test-after-code · ТЫ НАПИСАЛ КОД — ПРОТЕСТИРУЙ ЕГО … Непроверено: KUMM/tools/hooks/test-after-code.mjs»; after the selftest run —
    «прогон засчитан для: KUMM/tools/hooks/test-after-code.mjs … непроверенного кода нет». pass.
  - Selftest 14 steps: .md is not debt · a file outside ai_sandbox is not debt · first code edit → full order · second → short order
    with the count · `py_compile` and `--check` do not clear · Stop with debt → block · repeated Stop without new edits → silence ·
    a game launch clears game code but not a tool · running the tool clears it · Stop without debt → silence · `Deploy-ModPack.ps1` is
    `engine` · a game run does not clear engine code · `fixture-pack.mjs` clears it · the Svarog console `h.sh` clears `.cs` game code.
    pass.
  - Mutant (no debt write): red on 6 points — no short order, Stop not blocked, wrong game clear, game run cleared a tool,
    Deploy-ModPack not engine, game run cleared engine. pass (the check can fail).
- **Found:** none in the hook. Side finding: the house-rules row was first written through a Python one-liner and the backslash path
  turned into `D:\work<BEL>i_sandbox` — fixed to forward slashes (known class, memory `bash-heredoc-collapses-backslashes`).
- **Traces:** this session's hook messages (chat context); `node tools/hooks/test-after-code.mjs --status` → `test debt: none`.
- **Verdict:** pass — the hook orders a test after a code edit and clears the debt on a run of its kind, on the live path. Not walked:
  the `Stop` block on the live path (exercised by the selftest only) and the game-kind clear by a real game launch.
