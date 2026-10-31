# Run report — 2026-10-31 · the Archery page's re-read at an aim (item A1 of the hub's first-batch report)

## 1. Work

KrinikConanArchery re-reads the window's store when the hero enters the aim after «Сохранить» (`arc_settings_check` on the aim FOV event). Basis —
item A1 of `testcases/reports/2026-10-31_conan-hub-phase2-first-batch.md` (partial since 21:17: the aim never started after the hub was used by the remote).

## 2. Contour

Conan Exiles 3.0.1, the full build at pack `1d29d53` + the hub section of the working tree; background launch; the owner's save restored after;
the store removed after; machine lock `kumm` 22:43–22:46.

## 3. Runs

- 2026-10-31 22:43 — `launch-bg.ps1`, `enter-world-remote.sh`, `god-on.sh`; world time read by `pult.sh "lua return dofile('…/dil.lua')"`
  (`GameplayStatics:GetGlobalTimeDilation`) before the inventory, with it open, and after closing; `Sl_Krinik_arc_fov:SetValue(60, false)`; a real click
  «Сохранить и закрыть»; `ActivateModule('CharacterInventory', false)`; `mouse-seq.ps1 -Seq "rdown,wait:1500,lclick,wait:400,rup,wait:500"`.

## 4. Checks

Hygiene: none needed (no code changed for this run).
Functional run: a real right-button aim and a left-click shot in the live world after the hub save; the mod's log READ.

- Load: `настройки окна: … обзор 75° (загрузка)`.
- World time: 1.0000 → 0.0300 with the inventory open → 1.0000 after the remote close (the «slowed world» hypothesis refuted).
- After the aim: `настройки окна: баллистика true, стрелы не ломаются true, обзор 60° (номер настроек 1793475927)`, `прицел: обзор 60.0°`, the shot
  `#1 из лука, заряд 0.76`, `ПКМ отпущена — выход из прицела`.

## 5. Found

none in the mod — the evening's failure (21:12–21:17) was the stand's opener: its sequences began with `kdown 1`, a middle click or a real `I`; the bare
`rdown` sequence of the morning stands works after the hub as well.

## 6. Traces

`UE4SS.log` lines quoted above (22:44–22:45).

## 7. Verdict

pass — the re-read at an aim observed; item A1 closed.
