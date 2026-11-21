# Bug 116 — the agent ran nvm's install.cmd by its bare name; it truncated the machine PATH to 1024 characters

**Status:** ✅ machine PATH restored and verified 2026-11-21 ≈20:50; the guard's live refusal ≈20:53 · two leftovers wait for the owner's word (below)
**Severity:** S1 — the owner's machine harmed (system PATH lost 17 entries, among them `%SystemRoot%\system32`)
**Version/build:** Windows 11 Pro 10.0.26200, Windows PowerShell 5.1 (the agent's shell is elevated) · **When/context:** 2026-11-21 20:38 +03:00, preparing the
retest of 0.9.1-RC3 on the published release (`testcases/TC_conan_rc3_published_retest_2026-11-21.md`, case P0)

## Symptom

The agent wanted to install RC2 into the test copy from its bundle and sent, in the PowerShell tool:
`Push-Location "$g\Krinik_Mod_Pack_0_9_1_RC2"; cmd.exe /d /s /c "install.cmd `"$g`" < nul"`. The call hung for 10 minutes; its output held
«WARNING: The data being saved is truncated to 1024 characters.» and «SUCCESS: Specified value was saved.» ×3; a Notepad window with `\settings.txt` opened on
the owner's screen (child of the cmd).

## Root cause

1. The processes of this agent session carry `NoDefaultCurrentDirectoryInExePath=1` (probed 2026-11-21 ≈20:58). With it, cmd never looks for a bare
   command name in its current directory. PowerShell did hand the bundle folder to the child (probe: `Push-Location <dir>; cmd.exe /d /c cd` prints
   `<dir>`). Correction 2026-11-21 ≈20:59: the first text of this item blamed `Push-Location` for not moving the child's directory — the judge of the
   guard doubted it and the probe refuted it.
2. So `cmd /c install.cmd` with a bare name went straight to PATH and found `%APPDATA%\nvm\install.cmd` (nvm-windows' manual installer, 2023-01-26).
3. That script reads the nvm folder with `set /P` (stdin `nul` → empty), then from the elevated shell: `setx /M NVM_HOME ""`, `setx /M NVM_SYMLINK
   "C:\Program Files\nodejs"`, `echo PATH=%PATH% > \PATH.txt`, `setx /M PATH "<machine Path>;%NVM_HOME%;%NVM_SYMLINK%"` — setx keeps 1024 characters —,
   writes `\settings.txt` and opens it in Notepad. With the current drive D: the files landed in `D:\`.

## Forensics

- Machine `Path` after: REG_EXPAND_SZ, 1024 characters (saved: `KUMM/.work/path_incident/machine_path_after_truncation.txt`); no `ControlSet002`, no
  backup of the hive.
- The old value survived in the environment of every process started before 20:38 (the Claude Code host): process PATH = old expanded machine PATH + `;` +
  expanded user PATH (`D:\PATH.txt` holds the same, copy `.work/path_incident/nvm_PATH_txt_evidence.txt`).

## Fix (done)

1. `KUMM/.work/path_incident/rebuild_machine_path.ps1` (reads only): the user part cut off the process PATH → 43 old machine entries; the first 26 kept in
   their raw form from the truncated value, each checked to expand to the old entry at the same place; the 17 lost entries appended (`C:\WINDOWS…` written
   back as `%SystemRoot%…`).
2. Written as REG_EXPAND_SZ (1705 characters), read back: equal to the proposal, its expansion equal to the old 43 entries; WM_SETTINGCHANGE broadcast
   (Explorer had received the truncated value from setx).
3. Check: a process created fresh by WMI (`Win32_Process.Create`, environment built from the registry) has PATH 2783 characters with `C:\WINDOWS\system32`;
   `where powershell`, `where gh`, `where node` resolve.
4. Notepad (PID 33916) closed by PID.

## Leftovers — the auto-mode classifier refused their removal; they wait for the owner's word

- Machine variables `NVM_HOME` (empty string) and `NVM_SYMLINK` (`C:\Program Files\nodejs`): harmless — the user variables of the same names override them;
  whether they existed in the machine scope before 20:38 is not known.
- `D:\PATH.txt` and `D:\settings.txt` (nvm's output files, copies in `.work/path_incident/`).

## Guard

`tools/hooks/no-bare-cmd-script.mjs` (PreToolUse, Bash | PowerShell): refuses `cmd /c <bare name>.cmd|.bat` and `Start-Process <bare name>.cmd|.bat`;
`--selftest` refuses the verbatim 20:38 command and 5 more forms, passes 5 full-path forms; the live refusal ≈20:53. GAP — in its `@guard` block.

TWINS: searched `cmd /c` with a `.cmd`/`.bat` name in `KUMM/tools`, `KUMM/.work/rc3`, `KUMM/.work/uninst`, `ConanExiles/_config` — found 0 bare-name sites
(the launcher and `live.mjs` pass full paths); the class lived in the agent's ad-hoc shell commands, which the guard now covers.

## Decisions made without the owner

- `[AI]` the machine PATH restored at once, without asking: the lost entries broke `system32` for every new process; the truncated value is kept for an undo.
- `[AI]` the lost entries under `C:\WINDOWS` written back as `%SystemRoot%\…` (the Windows default form); the rest as absolute paths, as the process held them.

## Links

EXP-0601 · `testcases/TC_conan_rc3_published_retest_2026-11-21.md` · HOUSE_RULES 15 (cleanup), 2 (knowledge)
