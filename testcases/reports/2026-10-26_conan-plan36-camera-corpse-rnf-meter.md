# Test run report — Conan 3.0.1, plan 36: RNF smelters, crash-reporter closer, player report, camera vs corpses, Damage Meter

## 1. Work

Plan 36 items 2–5, 8, 30–31 and bugs/64 items 1, 11 (corpses), 21. Case set — `testcases/TC_conan_build_stability_compat_perf_2026-10-26.md`:
R3, CR1, DM0, DM1, P2, B7a, CAM1–CAM4, FP1. Basis: the owner's words in plan 36 and bugs/64 (corpses: «труп кролика - тоже не появляется
взаимодействий с камерой от третьего лица»; FPV: «почему камера от первого лица не делается?»; «и есть возможность дать FPV с луком в руках?»).

## 2. Contour

Conan Exiles Enhanced 3.0.1, pack `ConanExiles` (64 paks + Lua mods), the owner's machine, game in the background (window never
brought forward), pult `KrinikAgentRemote`, camera channel `ConanCameraControl/agent-cmd.txt`. Part of the session ran in the owner's own game
(he played, then: «игра твоя, если что, можешь тестить, только в фореграунд не толкай её»).

## 3. Runs

- 2026-10-26 20:29 `Deploy-ModPack.ps1 -Deploy -Only "Ragnar's New Factions","The Damage Meter"`, `launch-bg.ps1`, `enter-world-remote.sh`.
- 20:31–21:27 pult reads/calls (`pult.sh "lua …"`), `corpse-los.sh`, `corpse-prompt-test.sh A|B`, live camera configs via `agent-cmd.txt`.
- 21:34 `close-game.ps1` (game already closed by the owner), `deploy-config.py Game.ini GameUserSettings.ini`,
  `Deploy-ModPack.ps1 -Deploy -Only "The Damage Meter"`, 21:34:45 `launch-bg.ps1`, `enter-world-remote.sh`, 21:36–21:38 CAM4/FP1/DM1 checks.
- Off-game: `collect-report.ps1` on real logs (20:23), its mutant (exit 4), `test_reporter.ps1` decoys (20:21).

## 4. Checks

- Hygiene: `luac -p` camera `main.lua`; `uaj` rebuilt (vector field, parent-scoped prop, `func` serializer); patch builds report the exact counts.
- Functional run: walked in the game by pult and background frames — RNF live weight table; crash reporter on the real `close-game.ps1` path;
  Damage Meter windows by frames; corpse prompt A/B by frames; zoom by the game's own `CameraZoomIn/Out`; first person with the bow slot.
- R3 partial (weights 0 live; short run 0 errors; long run owed) · CR1 pass · DM0 pass after the owner's pick (window under the HUD, frame 20:44)
· DM1 fail → rebuilt (slider touches «Масштаб»; 64/20 build waits for deploy) · P2 partial (craft started by `CraftItems`, 3.0 s; owner: «медленно
на паузе делается») · CAM1 pass (A none / B «Разделать труп») · CAM2 pass · CAM3 pass · CAM4 partial · FP1 partial · player report pass (0 of 3
identifiers in the zip; mutant refused).

## 5. Found

1. Corpses in third person: the game sizes the interaction ray and the pickup start by the arm length and overwrites the mod's bonus; the
   camera's back offset in `SocketOffset.X` broke it — fixed by moving the offset into the arm (config.lua pack + game).
2. First person never switched with `zoom_min` 30 — fixed by the near limit 130 (owner's pick).
3. Zoom «spring» after the first fix attempt (bounds +125 put the owner's usual zoom into the 5-cm near band) — fixed by bounds 130–2125.
4. Damage Meter expanded window over the Hosav HUD — moved under the HUD (interview #026); corner dropdown «Top Left» English (new).
5. First person in combat is a native gameplay setting `AllowFirstPersonCamera` (False in the pack) — set True in the pack `Game.ini`.

## 6. Traces

Frames `D:\Temp\claude\d--work-ai-sandbox-KUMM\56181c6a-37ed-4e8b-a357-72e655c0662c\scratchpad\corpse\` (`t1_A`, `t1_B`, `t2_A`,
`cam4_far`, `fp1`, `dm1`, `dm1_win`), `…\shots3\`, `…\shots4\`, `…\win4k\`; review folder `D:\Games\Conan Exiles Mods\НА ОТСМОТР НИКОЛАЕМ\8 счётчик
урона — место окна 20-37\`; kit bytecode `…\scratchpad\kit\uht.txt`; logs `ConanSandbox.log`, `UE4SS.log` of the runs.

## 7. Verdict

partial — the corpse/camera/FPV class fixed and seen by frames; stone pickup and bow-in-first-person need the owner's real input;
the RNF long run and the Damage Meter 64/20 deploy are still owed.
