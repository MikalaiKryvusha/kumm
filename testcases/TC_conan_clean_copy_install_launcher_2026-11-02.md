# Test cases — the build's install, play and uninstall through the launcher on a copy of the clean game

> **Created:** 2026-11-02 · **Parent:** `[OWNER]` 2026-11-02 08:35–08:37 (HOUSE_RULES rules 25, 26); plan 40.7 criteria 2–4
> **Status:** written 08:39; not run
> **Outbound:** —

**Basis.** HOUSE_RULES rule 25 (a copy of the only Conan game folder in `D:\Instals\` (its name stays out of this public repository), never the original or the working game) and rule 26
(«Играть» closes the launcher, «Удалить сборку» keeps it open). The player's path: the bundle unpacked into the game folder, the launcher started from it.

**Stand.** `D:\Games\Conan_Exiles_3_0_1_clean_test` (robocopy of the clean game); the bundle by `Deploy-ModPack.ps1 -PackDir ConanExiles -Export
D:\Games\Conan_Exiles_3_0_1_clean_test\Krinik_Mod_Pack` (no zip); the launcher `Krinik_Mod_Pack\KrinikConanLauncher.exe`; buttons pressed by UI Automation
(Invoke) — the launcher's own window, no game input; the working game untouched (its folder listed before and after: same count). Machine lock taken.

**Dimensions.** States: fresh (no build) → installed → after uninstall. Buttons: «Установить сборку», «Играть», «Удалить сборку» (Yes). Not covered: the
archive volumes (plan 40.7 criterion 1 — later, by the owner's order), the world entry inside the copy (one run after this set if the install is green).

| ID | Situation | Action | Expected | Status | Observed |
|---|---|---|---|---|---|
| K1 | the copy, before the bundle | list the copy | the file list recorded (count, no krinik / ue4ss files) | — | — |
| K2 | K1 + the bundle exported into it | start the launcher | the gold «Установить сборку», no «Играть», no «Удалить сборку» | — | — |
| K3 | K2 | «Установить сборку» | install.cmd runs; when its window closes the launcher shows «Играть» and «Удалить сборку»; `-Verify` green in the install log; the uninstaller in the copy's root | — | — |
| K4 | K3 | «Играть» | the game process starts from the copy; the launcher process exits | — | — |
| K5 | K4, the game closed | start the launcher, «Удалить сборку», «Да» | the uninstaller runs; the launcher process STAYS; when the uninstaller's window closes the launcher shows the gold «Установить сборку» | — | — |
| K6 | K5 | list the copy | the K1 file set again plus the bundle folder; no krinik / ue4ss files outside the bundle | — | — |
| K7 | K1–K6 | list the working game | the same file count as before the run | — | — |
