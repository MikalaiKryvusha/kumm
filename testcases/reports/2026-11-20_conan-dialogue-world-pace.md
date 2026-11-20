# Run report — a talk with an NPC keeps the world at its normal pace (issue #3; case D0, D1, D2)

## Work

The change of `ConanExiles/_unpacked/KrinikConanUI/ue4ss/Scripts/krinik_pause_in_menu.lua` against cases D0, D1, D2 of
`testcases/TC_conan_hub_game_pages_map_journey_2026-11-20.md`. Basis: the owner's issue #3 (the world pauses during NPC talks), his report of 2026-11-20 20:02
(a chosen reply «did nothing» while the NPC's voice played) and his decision of 20:03 to remove the pause during talks. Two builds of the section: the first fix
(pack `dc79053`, `NO_SLOW_MODULES = { NPCDialogueWindow }`, event bookkeeping in the `ActivateModule` hook) and the second (working tree 20:04: the poll asks the
game `IsModuleActive` for `NPCDialogueWindow` and `NPCDialogueWindow2` while a full-screen UI is open).

## Contour

The owner's working game `D:\Games\Conan Exiles 3.1.1` on the 0.9.1-RC1 release build; the dev harness (`KrinikConanHarness`, the remote) installed for the run by
`Deploy-ModPack.ps1 -PackDir ConanExiles -Deploy -Only KrinikConanHarness` (verify: the 4 files of `KrinikConanMusic`, not in the release, missing — as before);
the second build deployed by `-Deploy -Only KrinikConanUI` 20:04, then `set-pak-modinfo.py` (66 / 66 after its cross-drive fix). The owner's world (the heroine,
level 24), god mode on for the run and off at its end (`god-on.sh off` → `bCanBeDamaged=true`); the stand — the oasis campfire NPC «Поборник Внешней тьмы»
(`BP_HumanoidDialogueNPC_C`, −82361, 231375) by `_config/dialogue-stand.lua` (`tp_ground.sh -78471 245900`, then `place`). 3840 × 2160 at 300 %, the game in front,
real E / Tab by `input.ps1`, a real click on «Попрощаться» (456, 1872).

## Runs

1. 2026-11-20 19:56 — `launch-fg.ps1` (PID 24672): the remote missing in the release game — closed by PID, the harness deployed.
2. 19:58 — `launch-fg.ps1` (PID 40864), `enter-world-remote.sh`, `god-on.sh`, `tp_ground.sh -78471 245900`, `pult.sh "lua _G.__ds_mode='place'; …dialogue-stand.lua"`.
3. 20:01 — D0: `input.ps1 -Key 0x45`; `pult.sh "lua _G.__ds_mode='speed'; …"` twice; `capture-window.ps1 -Out .work/d1/02_talk_open.jpg`; UE4SS log read from line 1957.
4. 20:02 — the live module table by `pult.sh "lua return dofile('D:/work/ai_sandbox/KUMM/.work/d1/modules.lua')"`; `IsModuleActive` of both windows read live.
5. 20:04 — the game closed by PID 40864, `Deploy-ModPack.ps1 -Deploy -Only KrinikConanUI`, `set-pak-modinfo.py`; 20:05 `launch-fg.ps1` (PID 35528), world entry.
6. 20:06–20:07 — D1: `rec_clip.sh d1_dialogue_fix 16`, `input.ps1 -Key 0x45`, `speed` twice, `IsModuleActive` read, the «Попрощаться» click, `input.ps1 -Key 0x09` twice
   with `speed` after each.
7. 20:08 — D2: `talkers.lua`, `tp_ground.sh 357600 153300`, `place` with `_G.__ds_class='BP_HumanoidDialogueNPC_Sorcerer_Companion_C'`, `input.ps1 -Key 0x45`, a frame.
8. 20:09 — the hero back by `tp_ground.sh -82309 231568`, `god-on.sh off`; the game closed by PID 35528, no crash-report window; the machine lock released.

## Checks

Hygiene: `luac -p krinik_pause_in_menu.lua` — ok; `check-lua-game-thread.py _unpacked/KrinikConanUI` — 0 worker-thread calls.
Functional run: the oasis campfire talk opened by a real E in the owner's world, the world's pace read by the remote and the mod's log, the hub opened by a real Tab
after the talk, a 16 s clip watched by its sheet.

- D0 — **fail as expected, and it found that the first fix missed:** the talk opened `NPCDialogueWindow2`; log «меню открыто: замедление времени 0.03» 20:01:13;
  dilation 0.0300; the time of day +0.0005 h in 2.5 s. The live `DT_UIModuleTable` (254 rows) names two NPC talk windows: `NPCDialogueWindow`, `NPCDialogueWindow2`.
- D1 — **pass:** «модуль NPCDialogueWindow2: открыт» 20:06:32 → «закрыт» 20:07:05 with no slowdown line between; dilation 1.0000 during the talk, the time of day
  +0.0221 h in 3.05 s (full pace); `IsModuleActive` W1 false · W2 true · full-screen true; after the talk a real Tab → 0.0300, Tab again → 1.0000.
- D2 — **blocked:** no NPC with reply options within reach (the campfire NPC: «Siptah», a DLC line, and «Попрощаться»; the nearest other talker sits in a
  corruption plant and opens no window — frame `05_sorcerer_talk.jpg`).

## Found

- The first fix of issue #3 (`dc79053`) did not cover the talk at the oasis campfire: it named only `NPCDialogueWindow`, and the game opened `NPCDialogueWindow2`.
  Fixed in the second build (D1 pass).
- `set-pak-modinfo.py` failed on the three Krinik paks — `os.replace` across drives (user TEMP on F:, the game on D:, WinError 17). Fixed by `shutil.move`; rerun
  66 / 66.
- The stand's own read of «dialogue open» asked only the first window — fixed in `dialogue-stand.lua` before D2.

## Traces

- Frames: `KUMM/.work/d1/01_before_talk.jpg`, `02_talk_open.jpg`, `03_after_farewell.jpg`, `04_sorcerer_before.jpg`, `05_sorcerer_talk.jpg`.
- Clip: `SvarogsDream/_harness/demo21/clips/d1_dialogue_fix.mkv` and its sheet `d1_dialogue_fix.sheet.webp`.
- Logs: `D:\Games\Conan Exiles 3.1.1\ConanSandbox\Binaries\Win64\ue4ss\UE4SS.log` of the runs 19:58 and 20:05 (overwritten at the next start; the lines are quoted
  above).

## Verdict

partial — D1 pass (the world keeps its pace during a talk, the hub still slows), D2 blocked (the owner's reply-option case waits for his NPC; issue #3 stays open
until my retest of D2 on a talker with reply options).
