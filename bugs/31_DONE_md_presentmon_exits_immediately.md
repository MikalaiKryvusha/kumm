# Bug 31 — PresentMon 1.9 (FrameView SDK) exits in ≈1 s with code 1 and writes no CSV, even elevated

**Status:** ✅ DONE 2026-10-08 14:55 — cause known since 2026-08-15 (EXP-0008): the FrameView SDK build is a service component, not a standalone tool; the Intel build `_tools/PresentMon-2.5.1-x64.exe` works (5904 frames, 14:53). The owner pointed to it («PresentMon мне кажется даже уже есть», «а KAGO»).
**Severity:** S2 (a measurement run lost; criterion 5 of phase 0 stays partial)
**Version/build:** `C:\Program Files\NVIDIA Corporation\FrameViewSDK\bin\PresentMon_x64.exe` FileVersion 1.9.12728.0 (came
with the NVIDIA driver; the dossier recorded 1.8.12407 on 2026-08-15) · Windows 11 Pro 10.0.26200 · **When/context:**
2026-10-08 14:44–14:47, plan 16 step 0.6 (criterion 5 «budgets»), Medieval Dynasty running.

## Symptom

Every capture ends after ≈1 s with exit code 1, no CSV, nothing on stdout/stderr. `--help` also exits 1 (prints help).

## Repro

```
& 'C:\Program Files\NVIDIA Corporation\FrameViewSDK\bin\PresentMon_x64.exe' --output_file $env:TEMP\t.csv --timed 4 --terminate_after_timed
# exit 1 after 1041 ms, no file
```

## Forensics — what was ruled out

1. **Not the rights.** The agent's shell is elevated: `whoami /groups` → «Высокий обязательный уровень» S-1-16-12288;
   `IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)` = True. The earlier verdict «session not elevated»
   (plan 16 step 0.6, two run reports, the dossier) came from `IsInRole('Administrator')` — a STRING role name, localized
   on a Russian Windows («Администраторы»), so always False. Corrected in place 2026-10-08 14:47.
2. **Not the missing console.** The elevated helper `MedievalDynasty/tools/pm-server.ps1` (own minimized console, admin=True)
   got the same: `job base60 60 s` → `done base60 exit 1` within the same second (14:45:47).
3. **Not the target filter.** With and without `--process_name Medieval_Dynasty-Win64-Shipping.exe`, with and without
   `--session_name`, with and without `--stop_existing_session` — the same.
4. A visible `cmd /k` window could not be read: the full-screen game covered it (frame 14:47).

5. **Game closed, visible console (2026-10-08 14:49, frame `D:/Games/Medieval Dynasty Mods/_shots/2026-10-08_1450_presentmon_console.webp`):**
   window «Администратор: C:\Windows\system32\cmd.exe» — PresentMon printed NOTHING and returned to the prompt; VS Code
   title «KUMM [Administrator]» confirms the elevation. So the FrameView build exits silently — hypothesis 1 gains weight.

## Hypotheses (ranked, not tested)

1. The FrameView SDK build of PresentMon is a component of NVIDIA FrameView and may refuse standalone capture (licence /
   service check) — horses: read its own message from a console that is not covered by the game (run with the game closed).
2. ETW session limit or a stale session named like PresentMon's — `logman query -ets` showed none containing «present».
3. Version 1.9 changed the CLI (flags accepted but a required one missing) — compare with `--help` of 1.9.

## Fix plan

Research first: run it with the game CLOSED in a visible console and read the message; if the FrameView build is the
cause, take the open-source PresentMon from GitHub (Intel, `GameTechDev/PresentMon`, a release exe) into its own folder.
Fallback that needs no PresentMon: the bridge `frames` already gives FPS and frame time from inside the game; the game
thread vs render split could come from the engine's own `stat unit`.

## Decisions made without the owner

- `[AI]` Stopped after three attempts instead of downloading another PresentMon on the spot — a download is a new tool in
  the owner's machine and deserves its own step.

## Links

Plan 16 step 0.6 · `AGENT_GUIDE.md` environment dossier, row «FPS measurement» · EXP-0183.

## ✅ STATUS: DONE (2026-10-08 14:55 +03:00)

Root cause: not a new defect — the dossier pointed to the FrameView build, and the session did not grep `EXPERIENCE.md` for
`#presentmon` before the work (EXP-0008 named this exact symptom on 2026-08-15). Fix: the dossier row now names the Intel
build first and the FrameView path as a dead end. Hygiene: — · Functional run: Intel PresentMon 60 s in the game, CSV read
(`testcases/reports/2026-10-08_md-phase0-budgets-presentmon.md`).

## Decisions made without the owner (closing)

- `[AI]` Closed as a known class instead of researching the FrameView build further — the working tool exists.
