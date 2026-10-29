# Run report — 2026-10-29 — Conan: hub bottom bar and late mod elements on «Снаряжение»

## 1. Work

Two case sets of bug 64 item 17:
- `testcases/TC_conan_hub_bottom_bar_fishing_hosav_by_event_2026-10-29.md` (F1–F4, H1–H2, L1, C1, E1) — the fishing button by event, the Hosav button
  hidden on the carousel switch; basis — the owner's «почти на всех страницах его что-то да пляшет · особенно внизу, где кнопки» (16:1x).
- `testcases/TC_conan_hub_late_mod_elements_by_event_2026-10-29.md` (I1–I7) — the EAA emblem, the green gem, «Аксессуары», the EoT magic icons
  with the tab; basis — the owner's frame and «вот что обвел с задержкой появляется на экране, а не сразу при его открытии» (17:5x).

## 2. Contour

Conan Exiles 3.0.1, the owner's save, 4K, game in the background (launch-bg). Build: pack `fae3d52` + working tree — Exiles Fishing KRINIK
MODIFIED (0.3 s poll off), Enhanced Armory and Arsenal KRINIK MODIFIED (button `Delay 1.0` off, Accessory System `Delay 0.2` → 0.0015), Era of
Trials KRINIK MODIFIED (+ «Снаряжение» `Delay 0.1` off), `KrinikPauseGameInMenu` 0.8.0 → 0.9.0 → 0.9.1.

## 3. Runs

- 2026-10-29 16:53–17:00 — lock; `launch-bg.ps1`; `enter-world-remote.sh`; remote probes (`RegisterHook` print on `CheckInventory`, `CarouselWindow` Next/Prev/
  SetCarouselIndex); `pult.sh "lua …ActivateModule(FName('CharacterInventory'), true, false)"`; `call W_EFT_AdminButton_C_… CustomEvent`;
  `capture-window.ps1`; restart with 0.8.0. The 60 fps video was stopped by the owner (17:0x, «удали записи видео, пока пауза»; recordings deleted).
- 2026-10-29 17:51–18:10 — the owner's open game: `NotifyOnNewObject('/Script/UMG.UserWidget')` birth probe (time-gated), A-B by `SetGlobalTimeDilation`
  1.0 / 0.03, remote injection tests, `capture-burst.ps1 -Count 16 -IntervalMs 40`.
- 2026-10-29 18:12–18:37 — restarts with the built paks: `close-game.ps1`, `Deploy-ModPack.ps1 -Deploy -Only "<mod>"` one per call, `launch-bg.ps1`,
  `enter-world-remote.sh`, scratchpad `late_run.sh` (probes + hub open + Next/Prev × 6 + two bursts), `capture-window.ps1` for I5–I6;
  18:19:20 the game crashed in a remote recon call (below); 18:37 `close-game.ps1`, release, `deploy-config.py` (4 files restored).

## 4. Checks

Hygiene: `patch-mod-asset.py` builds (EoT: inner files byte-equal to the library pak except 4 bytes of the delay + hashes; Exiles Fishing: 8 bytes).
Functional run: the hub on the owner's save by the game's own calls (module activation, carousel Next/Prev — the E/Q path), births read from
the log, the first frames of the tab read from bursts, the buttons clicked by their handlers.

- F1–F3, H1, H2 — pass by the owner's eye 17:5x («это ок»).
- F4, C1, L1, E1 — pass (case file).
- I1–I7 — pass (case file); I1 passed on the third attempt after two fixes (the EAA copy of the Accessory System; the pause engaged on the tab event).

## 5. Found

- The hub pause (time dilation 0.03) stretches every mod's blueprint `Delay` 33× — the root of the late EAA / EoT / Accessory System elements.
- A remote call of the Accessory System resume point 61 crashed the game (18:19:20, `EXCEPTION_ACCESS_VIOLATION reading 0xffffffffffffffff`,
  crash reporter closed, PID 27168) — EXP-0371; the shipped path does not call it.
- The Accessory System library lives in two packs (EAA, Highmane's Arsenal) in different versions; the game loads the EAA copy.
- Edited paks grow without compression: EAA 131 → 362 MB (plan 36 item 14a).
- «Хар-ки»: the perk descriptions overlap («Берсерк» / «Кровожадный берсерк»).

## 6. Traces

`UE4SS.log` probe lines 16:55–18:36; scratchpad `f4.jpg`, `inj_sheet.webp`, `i2_sheet.webp`, `i2_732_crop.webp`, `b_u_trip.webp`, `f_trip.webp`,
`i6_acs.webp`, `i6_axe.webp`, `i5.webp`; crash folder `Saved/Crashes/UECC-Windows-C3D1EC914119E0E9EE8D61A0D5B1CC5D_0000`.

## 7. Verdict

pass — all cases; the vanilla button-width dance and the tooltip auto-wrap (class A) are not part of this run.
