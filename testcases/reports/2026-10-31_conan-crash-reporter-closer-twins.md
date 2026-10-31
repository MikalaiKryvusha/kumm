# Run report — Conan: the crash-reporter closer takes only the agent's own reporter (twin processes)

- **Work:** plan 36 item 4 «Приборы закрывают окно отчёта о падении сами»; its done-criterion: a twin process started after the run's start is closed, one
  started before is left. Basis — `[OWNER]` «убирай за собой окна креш репортов, пожалуйста» · 2026-10-26 ≈19:39 (`HOUSE_RULES.md` §1 rule 9).
- **Contour:** `ConanExiles/_config/close-crash-reporter.ps1` (called by `close-game.ps1` and `long-run.sh`), Windows PowerShell 5.1; three copies of
  `C:\Windows\System32\PING.EXE` named `KummCrashTwin.exe` in the session scratchpad — two in a fake «game folder» `twin\game\`, one in `twin\other\`. No game,
  no file written into the game folder.
- **Runs:** 2026-10-31 11:45:18 twin A started (`-n 90 127.0.0.1`); 11:45:20 the «launch» moment taken; 11:45:21 twin B in `game\`, twin C in `other\`; then
  `powershell -File close-crash-reporter.ps1 -Since '2026-10-31 11:45:20' -GameDir <scratch>\twin\game -Name KummCrashTwin`; `Get-Process -Name KummCrashTwin`.
- **Checks:**
  - Hygiene: none beyond the run.
  - Functional run: the closer run against live processes; read — its three output lines and the surviving PIDs.
  - A (before the launch): «started 11:45:18 before the agent launch 11:45:20 - left» — pass. B (after, inside): «crash reporter closed, pid 10608» — pass.
    C (after, outside the game folder): «not of this game (…\twin\other\…) - left» — pass. Alive after: A and C only.
  - The real path in today's runs: every `close-game.ps1` printed «crash reporter: none of the agent's run (since …)» (10:59, 11:20, 11:26, 11:28, 11:34, 11:37, 11:40).
- **Found:** none.
- **Traces:** the command output above (this report); twins removed file by file after the run.
- **Verdict:** pass — the closer takes only a reporter of this game started after the agent's launch, by PID.

REAL WORLD: accumulated — the owner's machine with his own processes running; data and machine — his PC; path — the same script `close-game.ps1` calls after
every agent run. Verified on the real machine with twin processes; a real crash reporter was not part of this run.
