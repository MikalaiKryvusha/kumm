# Test run report — Exiles Fishing admin panel: bytecode string literals translated by an own Kismet relinker
**Created:** 2026-10-26 13:14 +03:00 · **Run by:** the agent (Claude Opus 5.5) ·
**Version/build:** Conan Exiles Enhanced 3.0.1, `ConanExiles/_config/devkit/kismet.py` (new), `patch-mod-asset.py` with `lit:` lines

## 1. Work
Case T4 (bugs/64 item 7): the 9 English literals of the fishing admin panel shown on the owner's screenshot 12:51 («Fishing Power:»,
«Min FP», «table», «(vanilla», «Average bite wait», «Per hour…», «EMPTY»). Basis: the owner's choice `[OWNER]` «Свой пересчёт байткода»
· 2026-10-26; acceptance — panel Russian on a frame, opens without a crash.

## 2. Contour
Agent's machine; mod assets extracted from the original `_patch-originals/JaarFishing.pak`; game 3.0.1 launched by the agent in the
background (launch-bg + enter-world-remote), panel opened by a direct call.

## 3. Runs
- 2026-10-26 ≈13:00–13:08 `python -I -X utf8 _config/devkit/kismet.py check <asset> <exports.tsv>` and coverage over 7 assets
- 2026-10-26 ≈13:09 trial `kismet.patch_uexp` on `BPC_EFT_Tuning` and `W_EFT_FishCard` (scratch `ktry.py`)
- 2026-10-26 13:10 `python -I -X utf8 _config/devkit/patch-mod-asset.py build JaarFishing W_EFT_Panel <work> …Panel.tsv …Tuning.tsv BPC_EFT_Tuning …AdminButton.tsv W_EFT_AdminButton …FishCard.tsv W_EFT_FishCard`
- 2026-10-26 13:11 `close-game.ps1`, `cp` pak into the library and `ConanSandbox/Mods`, 13:12 `launch-bg.ps1`, `enter-world-remote.sh`
- 2026-10-26 13:13 `bash _config/pult.sh "lua … ActivateModule(FName('ExilesFishingTuning'), true, false)"`, `capture-window.ps1`

## 4. Checks
Hygiene: the walker's own self-check — in-memory size by the walk = the number in the function header, on 190 of 190 functions
(fishing, Hosav button and library, EAA template, including ubergraphs); after the replacement every function of both assets walks and
matches again.
Functional run: the real game, the owner's path (the panel the owner opened at 12:51) — the frame was READ.

| Case | Status | Observation |
|---|---|---|
| Walker coverage | pass | 190/190 match; the one early miss (`ProfSlotText`) was TextConst kind 4 with one string, fixed |
| Replacement | pass | 12 literals replaced in `FPText`, `WaitText`, `TierText`, `PerHourText`, `PresetText`, `ProfSlotText`, `ProfStore`, `Init` |
| Trailing spaces | fail → fixed | first build lost the trailing space (the file writer trims line ends); Russian value now in quotes |
| T4 in game | pass | log: new container extracted, no fatal; frame 13:13 — «Мастерство рыбака: 60», «Мастерство от 0», «исходно 80,0», «(исходно 22,98 %)», «Среднее ожидание клёва: 22,8 с (исходно 22,8 с)», «В час (оценка, 20 с на схватку)», «— пусто —» |

## 5. Found
- TextConst kind 4 in UE 5.8 carries one string (not «string table + two strings»).
- The Write tool trims trailing spaces at line ends — Russian values that end with a space go in quotes.
- `test-after-code` hook on the real path: `cp` into `ConanSandbox/Mods` created `deploy:copy JaarFishing.pak`, the launch cleared it.

## 6. Traces
Frame `D:\Games\Conan Exiles Mods\НА ОТСМОТР НИКОЛАЕМ\5 рыбалка по-русски 13-13\panel.webp`; build output
`D:\Temp\claude\d--work-ai-sandbox-KUMM\eeaa02cd-eb9f-44a3-800e-8a2ca913f679\scratchpad\fishbuild4\`; game log `ConanSandbox/Saved/Logs/ConanSandbox.log`.

## 7. Verdict
pass — the panel is Russian in the game and opens without a crash. Not walked: changing a value and «Применить на сервере» after the patch.
