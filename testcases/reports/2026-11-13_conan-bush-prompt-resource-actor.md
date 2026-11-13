# Run report — Conan: «E Взять» over a bush E already touched (bug 96)

## Work

The owner's report 2026-11-13 11:09 (no «E Взять» over a bush, his frame) against the plate's contract «the plate shows exactly when E would take something»
(`krinik_pickup_prompt.lua` header, bug 77). Case set `testcases/TC_conan_no_take_prompt_bush_2026-11-13.md` — B1–B5 (the build as shipped) and F1–F7 (the fix).

## Contour

KrinikConanUI section `krinik_pickup_prompt` in the Conan Exiles 3.0.1 build (pack `ca3cdef` + the working-tree fix of the section), the game `D:\Games\Conan Exiles 3.0.1`,
background path, the owner's save `Game_1` (the oasis, hero at 108296, 201006), stand keeper on (god, NPCs within 600 m killed every 20 s), the bow in hand,
third person, arm 230–240. Machine lock taken 11:51 (kumm).

## Runs

1. 2026-11-13 11:51–12:09 +03:00 — the build as shipped: `powershell -File launch-bg.ps1` (PID 29300) · `bash enter-world-remote.sh` · probes by the remote
   (`bash pult.sh "lua return dofile('<scratchpad>/bush96*.lua')"`) · three real E presses `mouse-seq.ps1 -Seq "wait:400,kdown:E,wait:90,kup:E,wait:1500"` (11:57, 12:03,
   12:05, PC free by `owner-idle.ps1`) · `bash stand-keeper.sh` · frames `capture-window.ps1 -Width 1600`. Game closed by PID 29300 at 12:11.
2. 2026-11-13 12:11–12:17 +03:00 — the fix: `Deploy-ModPack.ps1 -PackDir D:\work\ai_sandbox\ConanExiles -Deploy -Only KrinikConanUI` (verify 114 present, 0 missing) ·
   `launch-bg.ps1` (PID 5200) · `enter-world-remote.sh` · `stand-keeper.sh` · F3 12:13, F4 and F5 12:14 (`tp_ground.sh 109391 202743` to a crocodile corpse and back),
   real E 12:15 and 12:16, F7 log read 12:16:47, cost by `bush96o.lua` (200 repeats) 12:17.

3. 2026-11-13 12:36–12:4x +03:00 — after judge round 1: the same deploy command (verify 114 present, 0 missing) · game closed by PID 5200, relaunched PID 2512 ·
   `enter-world-remote.sh` · `stand-keeper.sh` · `stone-stand.lua` (S1), `bush96c.lua` aims (S2, F3, F1), `tp_ground.sh` to a corpse (F5) and back · real E 12:40 (convert)
   and 12:4x (F4b, the camera inside the touched bush) by `mouse-seq.ps1` after `owner-idle.ps1` FREE.

## Checks

Hygiene: none (Lua, no build step; the deployed file grep — `actor_target` ×4).
Functional run: the game, the owner's save, the player's path (look at the bush, press E) — the plate read by the remote and by frames, the inventory read by template counts.

- B1 (trace from the camera) — the Visibility trace passes through leaves; the bush named by the foliage list: `GFL_Sarcobatus_Jungle01`, a `PickupFoliageComponent_C`.
- B2 untouched bush — the plate shown (probe true). Pass.
- B3 gates — `ContainerInfo` inactive, no prompt widget on screen. Pass.
- B4 real E #1 — instance #130 scale 2.14 → 0, item 13013 ×2, the game spawned `BP_ResourceActor_C` with the same mesh and scale at the same place; the plate dark
  over the visible bush (frame `b96_05`, the owner's frame); real E #3 there — 12001 7 → 9, 13015 3 → 5, foliage probe false. **Fail of the plate** — the defect.
- B5 control — the plate over an untouched bush (frame `b96_03`). Pass.
- F1 pass · F2 pass · F3 pass · F4 pass · F5 pass · F6 not run (no tool at the stand) · F7 pass — details in the TC table.
- Run 3 (the judge's round-1 fixes): S1 stone pass · S2 egg pass · F3 pass · F1 pass · F5 pass · F4 pass · F4b pass (the camera inside a touched bush makes it the
  game's E target whatever the view; the plate showed and a real E gathered 12001 +1, 13015 +2).

## Found

- Bug 96's cause: the plate copied only the foliage step of the game's E target; a pickup bush touched once becomes a `BP_ResourceActor_C` that E keeps
  gathering — fixed in the section (the actor branch first, `GetIsPickupResource`).

## Traces

Frames (session scratchpad, deleted at the close): `b96_01_spawn`, `b96_03_sarcobatus`, `b96_04_after_e`, `b96_05_taken_spot`, `b96_06_after_update`, `b96_07_sword_hidden`,
`b96_08_palm_hidden`, `b96_09_second_e`, `b96_f1_converted`, `b96_f3_untouched`, `b96_f4_sand`, `b96_f5_corpse`. `UE4SS.log` lines `[KrinikConanUI:PickupPrompt]` 12:16:17–12:16:43.
The owner's frame `Снимок экрана 2026-11-13 110924.png` (his Pictures\Screenshots). Bytecode pseudo-code of `UpdateHighlightTarget` — `uaj func` + `_config/devkit/kpseudo.py`.

## Verdict

pass — F1–F5 and F7 observed on the real game by the player's path; F6 not run (no resource actor of the tool kind at the stand; the answer is the game's own function).
