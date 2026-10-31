# Run report — Conan: the player's crash report carries no identifiers and keeps our mod names (plan 36 item 5, G13)

- **Work:** plan 36 §5 «Собрать отчёт.cmd», its done-criterion: a zip collected over real crash folders; a search of the unzipped zip for MachineId, LoginId,
  EpicAccountId, the computer name and `Users\<name>` finds 0; the `Krinik…` mod names are intact.
- **Contour:** `ConanExiles/_config/player-report/collect-report.ps1` (pack `9fd6016`) over the owner's game folder `D:\Games\Conan Exiles 3.0.1` (its real logs and
  `Saved\Crashes\UECC-Windows-…` folders); output into the session scratchpad. The manifest's `extras` ship the three files (`Собрать отчёт.cmd`,
  `collect-report.ps1`, `Если игра упала — как прислать отчёт.txt`) to the archive root.
- **Runs:** 2026-10-31 11:57 `powershell -File collect-report.ps1 -GameDir "D:\Games\Conan Exiles 3.0.1" -OutDir <scratch>\rep` → `Expand-Archive`; then
  `grep -r -i "Users[/\]<user>"`, `grep -r -i -w <computer>`, `grep -r -o -E "(MachineId|LoginId|EpicAccountId)[=:>] *[0-9A-Za-z|-]{8,}"`, `grep -o "Krinik[A-Za-z]*"`,
  `find -name '*.dmp'` over the unzipped tree.
- **Checks:**
  - Hygiene: none beyond the run.
  - Functional run: the collector run on the real game folder as a player runs it (without `-Feedback`); read — its closing lines and the unzipped files.
  - 22 files: `Logs/`, `Crashes/UECC-Windows-…` (3 of them shown), `UE4SS.log`, `modlist.txt`, `report.txt`. User-path hits 0, computer-name hits 0, ID values 0,
    dumps 0. `Krinik` names intact: KrinikAgentRemote, KrinikConanArchery, KrinikConanBench, KrinikConanGameplay, KrinikConanGraphics, KrinikConanUI, KrinikMenuProbe.
- **Found:** none.
- **Traces:** the unzipped tree in the session scratchpad `rep/x/`; the zip removed after the check.
- **Verdict:** pass.

REAL WORLD: accumulated — the owner's game folder with weeks of logs and crash folders; data and machine — his PC, his Windows user and computer name; path —
the same script the player starts from «Собрать отчёт.cmd». Verified on the real world; the `.cmd` wrapper itself was not double-clicked in this run.
