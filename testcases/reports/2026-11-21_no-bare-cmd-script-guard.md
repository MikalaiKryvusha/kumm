# Test run report — the guard no-bare-cmd-script and the machine PATH restore (bugs/116)

**Created:** 2026-11-21 20:55 +03:00 · **Run by:** the agent (Claude Opus 5.5) · **Version/build:** KUMM `tools/hooks/no-bare-cmd-script.mjs` (new)

## 1. Work

The guard `tools/hooks/no-bare-cmd-script.mjs` against its threat — a `.cmd` / `.bat` started by its bare name resolves through PATH (basis:
`bugs/116_agent_ran_nvm_installer_truncated_machine_path.md`, the verbatim command of 2026-11-21 20:38) — and the restore of the machine PATH it followed.

## 2. Contour

This machine (Windows 11 Pro 10.0.26200, Windows PowerShell 5.1 elevated, Git Bash); the Claude Code harness with `.claude/settings.local.json` →
PreToolUse, matcher `Bash|PowerShell`; the machine `Path` in `HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment`.

## 3. Runs

1. ≈2026-11-21 20:49 — `& KUMM/.work/path_incident/rebuild_machine_path.ps1` (reads only): 43 old entries, 26 raw kept, 17 restored, every raw entry
   checked against the old one.
2. ≈20:50 — the write of the rebuilt value (`New-ItemProperty … -PropertyType ExpandString`) and its read-back; ≈20:51 — WM_SETTINGCHANGE broadcast
   (`SendMessageTimeout` returned 1).
3. ≈20:51 — `Invoke-CimMethod Win32_Process Create` of `cmd.exe /d /c echo %PATH% … & where powershell & where gh & where node`.
4. ≈20:52 — `node tools/hooks/no-bare-cmd-script.mjs --selftest`.
5. ≈20:53 — the live PowerShell call `cmd.exe /d /c "kumm_guard_probe_7f3.cmd"` (a name that exists nowhere).
6. 21:00–21:15 — three judge rounds and their fixes: round 1 (8 findings: 7 missed forms fixed, the mention-refusal to GAP), round 2 (the broad checks
   refused ordinary commands → removed, the guard made narrow; blanks quadratic → fixed; import ran main → fixed), round 3 (5 groups of missed forms in
   scope → fixed; the regex version then took > 120 s on a 45 KB command → rewritten as a word parser). Final `--selftest`: 35 refused, 30 passed, the
   seven long hostile inputs together in 34 ms; the live probe of run 5 refused again ≈21:15.

## 4. Checks

Hygiene: run 4 — 6 forms refused (the verbatim 20:38 command among them), 5 full-path forms passed; the settings JSON parses.

Functional run: run 5 — the harness refused the live call with the guard's message (read); runs 2–3 — the written value equals the proposal, its
  expansion equals the 43 old entries; a process created fresh from the registry got PATH 2783 characters with `C:\WINDOWS\system32`, and
  `C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe`, `C:\Program Files\GitHub CLI\gh.exe`, `C:\Program Files\nodejs\node.exe` resolved (read).

## 5. Found

The incident itself (bugs/116); after the restore — none.

## 6. Traces

`KUMM/.work/path_incident/` — `machine_path_after_truncation.txt`, `machine_path_rebuilt.txt`, `machine_path_applied.txt`,
`machine_path_old_expanded_entries.txt`, `fresh_process_path.txt`, `nvm_PATH_txt_evidence.txt`, `nvm_settings_txt_evidence.txt`.

## 7. Verdict

pass — the guard refuses its threat on the live path; the machine PATH equals its state before 20:38. Open: the machine variables `NVM_HOME` (empty) and
`NVM_SYMLINK`, the files `D:\PATH.txt`, `D:\settings.txt` — their removal was refused by the auto-mode classifier and waits for the owner.
