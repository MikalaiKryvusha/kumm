# Run report — Conan hub: instant tab switch, the dark wave removed (bug 64 items 15/17)

## Work
The hub tab switch against the owner's acceptance of 2026-11-06 21:00 («Однга закрылась - в следующем кадре полностью отрисованная новая … ничего не прялет,
не открывается, не дорисовывается»); cases `testcases/TC_conan_hub_instant_switch_2026-11-06.md` (W1, W2, S1, L1, control C1).

## Contour
Conan Exiles 3.0.1 `D:\Games\Conan Exiles 3.0.1`, the build of 2026-11-06 with `KrinikConanUI.pak` build 1 (21:20, the CAROUSEL block of
`kit-conanui-edit.py`, range end on the key) and build 2 (21:37, range end + 1 tick); 3840×2160, HDR off for the recording; the hero in the oasis save; the hub
opened by the remote; tabs clicked with the REAL mouse (`mouse-seq.ps1`, the game in front); the catalog plate «Обновляется каталог обликов» waited out
before runs 3 and 4 (the owner 21:30).

## Runs
- 2026-11-06 21:26 +03:00 run 1 (build 1): `bash scratchpad/hub_run.sh`-equivalent — `ffmpeg -f lavfi -i ddagrab=framerate=144:draw_mouse=0 -c:v h264_nvenc -t 62`
  + `mouse-seq.ps1 -Seq "<11 clicks: Карта Таланты Снаряжение Базар Хар-ки Спутники Параметры Клан Путешествие Снаряжение Таланты, 4.5 s each>"`; analysis
  `python scratchpad/hub_switches.py run1.mp4`.
- 2026-11-06 21:41 +03:00 run 2 (build 2): `bash scratchpad/hub_run.sh run2`.
- 2026-11-06 21:47 +03:00 run 3 (build 2, hub slowdown off: `Saved/KrinikSettings.lua` `["ui_menu_slow"] = 1`): `bash scratchpad/hub_run.sh run3`.
- 2026-11-06 21:53 +03:00 run 4 (NO mod paks: `mv Mods/modlist.txt Mods/modlist.txt.off`): `bash scratchpad/hub_run.sh run4`; restored 21:54 (`modlist.txt`,
  the settings file from its copy).
- Before: the kit probes `kit-probe-carousel.py`, `kit-probe-hub-windows.py`; `mod-overrides.py` over the game's Mods (no mod ships `W_Carousel`, its material or a
  tab window); the folder-69 clips by `scratchpad/hub_anatomy.py`.

## Checks
- Hygiene: the built pak carries `/Content/UI/HUD/Carousel/W_Carousel.uasset` (`mod-overrides.py` on the pak, 21:23); the kit report reads the animation end
  3.33e-05 s, keys `MaskOffset` 0 → 1 (build 2).
- Functional run: 4 recorded passes × 11 real clicks over all 9 tabs, READ per real frame (luma, diff, blend coefficient) and as frame sheets.
- W1 «Снаряжение» → another tab, no dark band — build 1 no band but the backing stuck (fail), **build 2 pass**; the vanilla control (run 4) shows the band back
  (luma 89 → 34 over ≈ 260 ms) — the measure catches it.
- W2 back to «Снаряжение» — build 1 fail (the see-through hub lost, frame 21:31), **build 2 pass** (frame `inv_b2.jpg`).
- S1 the page complete in the next frame — **fail, vanilla**: every page assembles over 2–6 frames (Хар-ки perks on one line then unfold; Таланты empty cells,
  the header row jumps; Снаряжение panels missing 4 frames; leaving Снаряжение — 2–6 frames of the bare world under the empty page) — the same with the hub
  slowdown off (run 3) and with no mod paks (run 4).
- L1 nothing late on «Снаряжение» after +62 ms — partial (the +3.3 s strip on «Параметры» not read).

## Found
- The dark wave = vanilla `W_Carousel.AnimBackgroundFadeOut` (`MaskOffset` mask slide, 0.5 s) — fixed (instant) in `KrinikConanUI`.
- Build 1's own defect: a movie-scene playback range END is EXCLUSIVE — ending it on the last key never applies the end state (the backing stuck on
  «Снаряжение»); fixed in build 2.
- The page assembly over 2–6 frames is the game's own (not mods, not our slowdown) — the owner's fork.

## Traces
Recordings `scratchpad/h69/run1.mp4` … `run4.mp4`; frame sheets `r1_attr.webp`, `r1_feat.webp`, `r1_inv.webp`, `r2_leave_inv.webp`; frames `inv_now.jpg`
(build 1), `inv_b2.jpg` (build 2); kit reports `ConanExiles/_config/devkit/kit-probe-carousel.json`, `kit-probe-hub-windows.json`, `kit-conanui-edit.json`.

## Verdict
partial — the dark wave is gone and the see-through hub kept (W1, W2 pass on the owner's real build); the vanilla page assembly (S1) waits for the owner's choice.
