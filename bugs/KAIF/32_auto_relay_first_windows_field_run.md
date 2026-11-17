# KAIF field report — auto-relay (decision №160): the first Windows 11 deployment and its live findings

**Type:** improvement request · field report (template B) · **Found:** 2026-11-17 11:21–11:40 +03:00 · **Project:** KUMM (KAIF 2.9 deployment)
**Subject:** `ideas/auto_relay_windows_guide.md` (KAIF `e34fd93`) — built in KUMM as commit `c795f0c` (`.claude/auto-relay/*`, `.claude/hooks/relay-hook.mjs`,
`.claude/skills/auto-relay/SKILL.md`), the deviations agreed with the KAIF session `kaif-6d` 2026-11-17 11:26.
**Delivered upstream:** https://github.com/MikalaiKryvusha/KAIF/issues/198

## What the field build changed against the guide (candidates for 2.10)

1. **One window gauge.** The relay has no threshold: the project's context hook (soft closure from 80 %, forced from 92 %) is the only one.
2. **One handover.** No `HANDOVER.md`: STATUS «Where to continue» + the farewell file of the closure skills. The skill writes a «run block» into STATUS.
3. **One entry.** The next chat gets `resume auto-relay continue`: the resume-word hook orders /resume, the relay hook orders `relay.mjs continue` first.
4. **The spawn trigger is the farewell, not `ready`.** The Stop hook starts the opener only on the marked farewell (`<!-- farewell -->`) of an accepted
   closure, with STATUS.md committed after the chat started (git `%ct` ≥ chat start and no edits — the KAIF session's risk 2), once per chat.
5. **The opener waits for quiet** (the KAIF session's risk 1 — a Stop blocked by another hook): a detached `relay.mjs open` polls the transcript and opens
   only when it is ≥ 10 s without a write AND the last non-bookkeeping record is an assistant answer of text blocks. A blocked Stop writes
   `user` (isMeta «Stop hook feedback») + `attachment` (`hook_blocking_error`) right after the answer (seen in a KUMM transcript), so it waits for the
   chat's one-line answer. Unknown record types → wait (fail closed). e2e case + mutant red.
6. **The relay hook never blocks**; pushing an early stop stays with the project's autonomy guard (the relay switches its marker on in start/continue).
7. **The owner's keyboard first:** the opener raises nothing and presses nothing until keyboard + mouse were idle 3 s (`GetLastInputInfo`).
8. **`code <folder>` without `-r`** (agreed with the KAIF session).

## Live findings on Windows 11 (VS Code 1.123.0, extension 2.1.326)

- `CLAUDE_CODE_SESSION_ID` IS in the agent's command environment → §6 risk «id not visible» is closed on Windows.
- `os.tmpdir()` in hooks and in Bash = the harness TEMP (here `F:\Temp`), not the `env.TEMP` of `settings.local.json`.
- The extension 2.1.326 keeps the handler: `case "/open"` → `claude-vscode.primaryEditor.open(session, prompt)`; the prompt is not sent.
- **VS Code runs elevated** («… - Visual Studio Code [Administrator]»), the agent's shells at High integrity (S-1-16-12288). SendKeys from a non-elevated
  process into an elevated window is blocked (UIPI) — a manual §5 step 4 from a normal terminal would fail falsely.
- **FOUR VS Code windows were open** (four projects). `Start-Process vscode://anthropic.claude-code/open?prompt=…` with another project's window in
  front: the foreground stayed that other window, and **no tab with the text was found in the KUMM window nor in the front window** (captured by
  `PrintWindow`; two other windows not checked). The guide assumes the link lands in «the last active window»; with several projects open the
  relay must first make its own window the last active one (`code <folder>` before the link — the opener does that; L1 by hand skipped it) — to verify.
- A capture note for the guide's checks: a non-DPI-aware PowerShell gets 1/3-size `GetWindowRect` on a 4K screen at 300 % — call `SetProcessDPIAware`.

## Not verified yet (KUMM continues)

L1 with `code <folder>` first; L2 (the opener with Enter into a new chat); L3 (a real chain: closure → next chat → `relay.mjs continue`); whether the
extension's Stop hook runner lets a detached child outlive the hook (the opener logs «open: waiting…» first, so L3 shows it).

## Local remediation

Built and committed in KUMM `c795f0c`; self-test 22/22, e2e 21/21 (mutants M1–M3 red), the project's guard suite 308/308. Cases —
KUMM `testcases/TC_auto_relay_2026-11-17.md`.
