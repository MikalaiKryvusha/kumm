# Run report — fishing panel tooltips (flicker), the profile-slot hover translation, «(удерж.)»

- **Work:** cases `testcases/TC_conan_fishing_tooltip_translation_hold_2026-10-30.md` (plan 36 W17, W18, W10a). Basis — the owner's words of
  2026-10-30 quoted there.
- **Contour:** this machine, Conan 3.0.1 (`D:\Games\Conan Exiles 3.0.1`), the owner's save, 4K full screen, the game in front; pack
  `ConanExiles` with `Game.locres` rebuilt (kit `GatherText`, 104 s), JaarFishing pak = the recipe WITHOUT the tooltip asset (restored),
  `KrinikPauseGameInMenu` 0.13.0; machine lock 08:34–09:2x.
- **Runs:**
  - 08:40 — launch, menu frame, `enter-world-remote.sh` → **the game crashed while loading** (`ConanSandbox.log`: «ObjectSerializationError:
    /Game/Mods/JaarFishing/Tuning/W_EFT_Tooltip … TextBlock …»): the pak built with `addprop:Txt_Tip/WrapTextAt` — the name is not in the
    package name map, the zen header does not know it. The owner saw the hang («зависла загрузка»). Killed PID 24108 (no crash-report window),
    the previous pak restored to the library and the game (`cmp` equal).
  - 08:50 — relaunch with 0.13.0 (template fixed once at `ActivateModule`) → log «шаблона … пока нет»: the panel's classes load after the event.
  - 08:53–09:03 — baseline by `hover-watch.ps1` + `tooltip-bbox.py`: «Холод» first hover 553×96 → 457×125 (one line → two), repeats steady;
    after a panel re-open the same tip settles 490×80 (one line) — the layout depends on the previous frame. Remote probe: a template fix holds
    while the panel is open and is LOST after a re-open (the class is reloaded).
  - 09:06 — 0.13.0 final (on every open, 1 s after the event, `AutoWrapText` false + `WrapTextAt` 380 on the template and every live `Txt_Tip`),
    `Deploy-ModPack.ps1 -Deploy -Only KrinikPauseGameInMenu` (verify 99/0), relaunch, menu frame, world 22 s; `reopen-hover.ps1` ×3 short, ×3 long.
  - 09:10 — profile-slot hover frame.
  - 09:1x — the guard: `patch-mod-asset.py build JaarFishing W_EFT_Tooltip … JaarFishing__W_EFT_Tooltip.tsv` → «REFUSED … WrapTextAt …»,
    «сборка остановлена», exit 1, no pak; control — `rebuild-krinik-paks.py --only JaarFishing` → 754 chunks byte-identical, work dir removed.
- **Checks:**
  - Hygiene: kit compile 54441 → 54446 entries, `locres-regress.py` lost 0 / changed 0; `vanilla-override.py` 4 written; `deploy-localization.py
    --check` «всё на месте»; `check-lua-game-thread.py` 0 worker-thread calls.
  - Functional run: S1 pass (menu frames 08:41, 08:51, 09:07, no «Incompatible Mods»); S2 pass on the final build (world 22 s; the 08:41 crash is
    the defect found and removed). T1 pass — «Холод» 490×80 from the first frame, 3 of 3 re-opens (baseline: a one-line → two-line jump). T2
    partial — the long tip «Улов по уровню…» 844×215 settled, but in 1 of 3 re-opens the first frame has the BACKGROUND one line tall while the text
    is already 4 lines (≈22 ms, next frame correct) — a different, one-frame mechanism. T3 pass — «Ячейка набора: нажмите, чтобы выбрать её. Точкой
    (•) отмечен набор, который сейчас действует на сервере.». T4 (control) pass — before the fix the jump reproduced (first hover; after re-opens
    with the template reset). H1 not walked — no corpse or container at the stand; the 4 entries are in the deployed `Game.locres`.
- **Found:** (1) `addprop` with a name absent from the package name map crashes the game at mod load — guarded now (uaj REFUSED + the patcher
  stops; EXP-0377); (2) the fishing tooltip class is reloaded on every panel open — a one-time template fix does not hold; (3) residual one-frame
  background lag on long tips (1 of 3).
- **Traces:** scratchpad `D:/Temp/claude/d--work-ai-sandbox-KUMM/1b272a24-53f7-47dc-b6a6-0eecc7fc7750/scratchpad/` — `hw-base-*`, `hw-m-cold-*`,
  `hw-m-long-*`, `mlong2.webp`, `prof.webp`, `s1*-menu.jpg`, `guard-test3.log`; `ConanSandbox.log` 08:41 (the crash).
- **Verdict:** partial — the owner's flicker (one line → two) is gone on the tested tips, the translation is in, the crash class is guarded;
  the one-frame background lag on long tips and H1 remain for the owner's eye.
