# Run report — Conan: enemy shouts appear in place and fade in (plan 36 W29)

- **Work:** the owner's decision 08:56 (`[OWNER]` «должна сразу на месте появляться,можно с фейдом небольшим, типа 200мс, и такой же фейд на скрытие» ·
  «без всяких перемещений по экрану») against cases S3–S9 of `testcases/TC_conan_shout_flicker_2026-10-31.md`; the new Lua section
  `krinik_shout_fade` of KrinikConanUI (pack commit `02f4b82`).
- **Contour:** the owner's machine, Conan Exiles 3.0.1 build (64 paks + Lua mods), game in FRONT (`launch-fg.ps1`), oasis save (copy
  `_save-backup/2026-10-31_0909-before-w29-fade`, restored after the run, integrity ok), god on, the hero 3 m from the oasis boss
  (`HumanoidNPCCharacter_20percentbigger_boss_C`); 1920×1080 screen capture by `ffmpeg ddagrab` 60 fps.
- **Runs:**
  - 2026-10-31 09:05–09:08 — Dev Kit probes `kit-probe-subtitle.py`, `kit-probe-native-class.py` (`UnrealEditor-Cmd … -run=PythonScript -ModDevKit -NullRHI`).
  - 09:12–09:20 — remote probes: `pult.sh "funcs SubtitleRenderer"`, `ForEachFunction` / `ForEachProperty` of the native classes, hooks on
    `W_SubtitleEntryView_C:SetText/SetTextActive`, `NotifyOnNewObject(SubtitleEntryView)` lifespan watch, `UserWidget:Destruct` hook.
  - 09:20:05 — `pult.sh "lua dofile([[…/krinik_shout_fade.lua]])"`; 09:22 — `ffmpeg -f lavfi -i "ddagrab=…:framerate=60,…" -t 25 after2.mp4`.
  - 09:24 and 09:28 — control clips `control.mp4`, `control2.mp4` (40 s each) with birth opacity forced back to 1 by a remote `NotifyOnNewObject`.
  - 09:29 — `Deploy-ModPack.ps1 -PackDir ConanExiles -Deploy -Only KrinikConanUI`; 09:30 — `launch-fg.ps1`, UE4SS.log read; game closed by PID 30224.
- **Checks:**
  - Hygiene: `check-lua-game-thread.py` — 0 worker-thread calls; `lua-globals.py` — only the UE4SS global `ExecuteInGameThreadWithDelay`.
  - Functional run: the live game, the boss's real combat shouts, read on 60 fps frames by eye and by a per-frame white-text row scan
    (`textframes.py`): S3 pass (lifecycle named), S4 pass (first visible frame at rows 877–904, nothing lower), S5 pass (rise ≈ 0.16 s by eye,
    opacity 1.00 at +400 ms), S6 blocked (no removal event, no readable end), S7 fail-not-reproduced (5 control onsets all in place, HUD hidden and
    shown), S8 partial (minute summary not read), S9 pass (section loads from `main.lua` after the deploy).
- **Found:**
  - The whole game HUD stood hidden after world entry by the remote (visibility 2 on HUD, hotbar, subtitle renderer) — cause unknown, recorded in the game map.
  - The morning low first frame did not reproduce in 5 control onsets — its condition is unknown; the fix hides any first frame.
  - Fade-out cannot be done on the game's own line (no event at removal) — needs a mirror line.
- **Traces:** clips and strips in the session scratchpad `w29/` (`after2.mp4`, `control.mp4`, `control2.mp4`, `frames_in.webp`, `ctrl_umri.webp`,
  `c2_onset1.webp`, `c2_onset2.webp`); `UE4SS.log` lines 09:20:05 and 09:30:34; probe reports `_config/devkit/kit-probe-subtitle.json`.
  Window of crash reports: none appeared.
- **Verdict:** partial — appearing in place and the fade-in work in the live game; the fade-out is not built.

REAL WORLD: accumulated — the owner's own build and save (restored copy); data and machine — his PC and game install; path — the game's real
combat shouts on screen, the deployed mod loaded at a normal start. Verified on the real world.
