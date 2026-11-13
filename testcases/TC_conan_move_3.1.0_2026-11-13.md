# TC — Conan: the build 1.0.0 WIP on Conan Exiles Enhanced 3.1.0 (plan 53)

> **Created:** 2026-11-13 · **Parent:** `plans/53_conan_move_3.1.0.md`, `researches/conan_patch_3_1_0/README.md` §3 · **Status:** written 19:1x, run when the install
> is complete · **Outbound:** —

**Test basis:** plan 53 acceptance criteria 1–6 (the owner's order 2026-11-13 18:50 «приступать к переносу сборки 1.0.0 WIP на неё»); the build's criteria 1–2 of
`MASTER_PLAN.md` (stable, no mod silently loses its function). No frame-time measurement (the owner's 18:52 word).
**Stand:** the 3.1.0 install in the owner's download folder (target of `targets.json`), the machine lock «kumm», background path (`launch-bg.ps1`) unless a case
needs real input; a NEW game for the world cases (a 3.0.1 save is not required — plan 33's precedent); remote `_config/pult.sh`.
**Dimensions covered:** start (loader, paks, menu) · world entry · every Krinik Lua mod's start line · the late-class risk on each foreign class we reach
(present-before-load vs loaded-by-us) · the hub pages of the four save-game authors · the map page's helper row · localization. Not covered here: the
gameplay soak (plan 47) and frame time (by the owner's word).

| # | Case | Expected | Status | Observed |
|---|---|---|---|---|
| S1 | UE4SS on the new exe | `ue4ss/UE4SS.log`: `Using engine version`, `Event loop start`, no «Failed to find» of a signature | not run | |
| S2 | the game accepts every pak | `ConanSandbox.log`: one `Mounting mod pak` per `modlist.txt` line, no `too old`; ModPackManager «СБОРКА: моды N/N» | not run | |
| S3 | every Krinik Lua mod starts | one start line per mod of `mods.txt` in `UE4SS.log`, 0 Lua errors before the main menu | not run | |
| S4 | the «missing imports» baseline | every new missing-import warning of the first start listed in the run report with its mod; ours = 0 | not run | |
| W1 | a new game reaches the world | the HUD (Hosav) and the crosshair born; a frame in the world; no crash window | not run | |
| L1 | Damage Meter page, the slot ABSENT (no `DamageMeter.sav`) | the hub's «Damage Meter» page shows the author's defaults (class defaults through `find_loaded`), not an empty page | not run | |
| L2 | the same page with the slot present | values = the slot's (unchanged path: `LoadGameFromSlot`) | not run | |
| L3 | Proximity Party and Simple Minimap pages | values shown on both | not run | |
| L4 | LLHighlight page, a save from a fresh slot | «Сохранить» writes `LLH_Settings.sav` (the class loaded by `find_loaded` when absent); log «llh: applied … saved: true» | not run | |
| L5 | our «Карта» page | Simple Minimap's helper row (custom markers) in the bottom bar; `S.helper` +1 | not run | |
| L6 | control for L1/L5: is the class loaded BEFORE our code touches it? | `pult.sh "lua return tostring(StaticFindObject('<class>'))"` right after the world entry — `nil` proves 3.1.0's late loading is real for that class (then L1/L5 prove the fix); a valid object means the old code would have worked too — the case is then not a proof of the fix | **run 2026-11-13 22:01** (`ConanExiles/_config/move310-checks.lua` by the remote, ≈ 50 s after the world entry, before any hub opening): all five valid — `DN_SG_SaveSettings`, `PrP_SAV_WindowSettings`, `SM_BP_SaveGame` (CDOs), `LLH_SAV_Settings_C`, `SM_UI_MapHelper_C` | the old code would have worked: no late loading for these classes at world entry; L1–L5 are regressions of the pages, not proofs of the fix |
| G1 | localization | `deploy-localization.py --check` «всё на месте»; `vanilla-override.py --check` against 3.1.0's `ru/Exiles_UI.locres` exit 0 | partial | 19:32: the game's table extracted by `repak get` from 3.1.0's `pakchunk0-Windows.pak` (1 934 227 bytes, 3.0.1: 1 867 377 — new strings); `vanilla-override.py … --check` — «0 entries would change», exit 0: every override still keys a live source hash. The deploy check waits for the deploy; the extraction is repeated and compared byte for byte once the download stops (a torrent writes pieces out of order — a pre-allocated pak may hold zeros) |
| V1 | the engine's `-Verify` on the 3.1.0 target | exit 0 | not run | |
