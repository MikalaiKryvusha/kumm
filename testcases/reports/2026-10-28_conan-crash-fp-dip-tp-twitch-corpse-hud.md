# Run report — Conan 3.0.1 evening 2026-10-28: crash on rapid fire, FP dip, TP twitch, corpse prompt, HUD Hosav, rename

## 1. Work

the owner's evening items, case sets `testcases/TC_conan_bow_crash_fp_dip_tp_twitch_2026-10-28.md` (G1–G2, L1, C1–C2, D0–D3,
  J1–J2) and `testcases/TC_conan_corpse_prompt_left_of_quickloot_2026-10-28.md` (R1, F1–F2, X1, H1–H2, R2); bug 66, bug 64 item 32.
## 2. Contour

`D:\Games\Conan Exiles 3.0.1`, the agent's own run under the machine lock (kumm, taken 19:49 for 90 min), UE4SS v3.0.1 Beta; mods
  after the evening: 8 Lua mods on game-thread delays, `KrinikConanArchery` (was `KrinikArrowAim`), new kit mod `KrinikUIFixes` (build 2), Hosav
  pak rebuilt (`patch-mod-asset.py build`), `Game.locres` rebuilt (kit GatherText). Real input `_config/mouse-seq.ps1`; meters
  `_config/fov-sampler.lua`, `_config/rmb-case.sh`, `_config/corpse-loot-geom.sh`, `_config/capture-burst.ps1`, 4K frames `capture-window.ps1`.
## 3. Runs

2026-10-28 20:14 relaunch after the thread fix (`launch-bg.ps1`, `enter-world-remote.sh`); 20:16–20:29 D0, D1, J1, C1, C2, J2, D2
  (`bash rmb-case.sh <tag> <ms> "<seq>"`, `mouse-seq.ps1 -Seq "lclick,wait:190" ×240`); 20:25:16 relaunch (UI fixes build 1, bow edits);
  20:29 F2 build 1; 20:41:56 relaunch (UI fixes build 2, Hosav, locres, rename); 20:42–20:46 X1, H1, H2 (`capture-burst.ps1 -Count 60
  -IntervalMs 100`), F1, R2, D3.
## 4. Checks

  - `Hygiene:` `luac -p` on 8 mods; `check-lua-game-thread.py` red 31 → 0; `locres-regress.py` lost 0 changed 1; `deploy-localization.py --check`.
  - `Functional run:` the game walked by real mouse input and read from 4K frames, pult samples and UE4SS.log — C1/C2 no crash (36 and 28 arrows
    a minute, `Ref was not function` 0); J2 FOV 75,0° on every sample through three shots; D3 steady fire 74,0–77,6 cm (idle 74,1), first shot of a
    series still dips to 67,2 for ≈100 ms (partial); F1 strip ends at ≈1128, panel at 1180 (vanilla place); X1 «XP: 99 502 / 102,19k»; H1 no level
    pointers; H2 blink period 1,96 s vs 0,97 s at the native speed in the same run; R2 only `[KrinikConanArchery]` lines.
## 5. Found

- bug 66 (worker-thread delays crash UE4SS — fixed, guard);
- D3 first-shot dip (open, needs a «bow in hands» check);
- N1 — the corpse is not highlighted from a high third-person camera (twin of bug 64 item 11, open)
- the paks view held a stale
  `KrinikBowFixes-Windows.utoc` of the same size (fixed: `ensure_view` compares by `samefile`)
- `ConanModPackStatus` reports 11 mounted mods
  as missing (false alarm, not investigated).
## 6. Traces

`D:\Temp\claude\corpse-loot\` (`R1_module.jpg`, `F2_fp.jpg`, `F2_build2.jpg`), `D:\Temp\claude\hosav-hud\` (`hud2.jpg`, `burst\`,
  `burst_v2\`), `ue4ss/Mods/KrinikAgentRemote/fov-*.tsv` (D0–D3, J1–J2), crash folder `Saved/Crashes/UECC-Windows-5990…` (20:06:56).
## 7. Verdict

partial — the crash, the TP twitch, the corpse prompt, the HUD items and the rename pass; the FP first-shot dip remains; F3–F5
  and the control C1 of the corpse set not run.
