# TC — Conan hub: fast tab switching (the owner's defect of 2026-11-07)

> **Created:** 2026-11-07 · on the owner's word 2026-11-07 ≈10:10 (verbatim: «при быстрром переключении табов ХАБА, иногда они иои не открываются, или
> открываются пустыми - не предусмотрена обработка события переключения. пока контроллер, видимо, еще не обработал предыдущее переключение»; 10:23 «я по E Q
> переключался, когда даги нашёл»)
> **Parent:** plan 48, KrinikConanUI section `krinik_hub_controller`; bug 64 item 15
> **Status:** run 2026-11-07 10:18–10:27 — F1 fail (before the fix), F2–F4 pass, F6 pass; report `testcases/reports/2026-11-07_conan-hub-fast-switch.md` · **Outbound:** —

## Test basis

The owner's word above; plan 48's acceptance «per tick exactly ONE page drawn, the old one until the new one». A burst of switches must end on exactly one
complete page of the LAST tab chosen, with no run of bare-world ticks after the last switch beyond the known «Снаряжение ↔ Параметры» gap (≤ 4 ticks).

## Stand

Background game (`launch-bg.ps1`), the oasis save, world entered by `enter-world-remote.sh`, «взведено» in `UE4SS.log` before the hub opens; the hub opened
by the remote (`ActivateModule(CharacterInventory, true, false)`); god on. Instruments — `ConanExiles/_config/hubswitch/fast-burst.lua` (bursts of 8–12 native
`SetCarouselIndex` switches, gaps 1 tick … 150 ms, every tick sampled) and `fast-burst-eq.lua` (the same with `NextCarouselWindow` / `PrevCarouselWindow` — E / Q).

## Dimensions

Gap between switches (partitions: next tick · 16–50 ms · 80–150 ms); target kind (ours → ours, ours → game page, game → game, the same tab twice); the
burst's last target (each of the 9); the switch path (by index — the click's native function; Next/Prev — E/Q). Not covered: real mouse clicks
(`ButtonPressed`) and real E/Q keys — the game in front.

## Cases

| # | Situation | Action | Expected | Status | Observation |
|---|---|---|---|---|---|
| F1 | the hub open, the build before the fix | 6 bursts by index (seed 7) | every burst `OK`; bare run after the last switch ≤ 4 ticks; overlay 0 | fail | 10:18: 4 of 6 OK, bursts 1 and 5 EMPTY (0 pages drawn for 65 ticks after the last switch); 8 false «хаб закрыт» lines while the hub stayed open — the defect reproduced |
| F2 | after the fix | the same 6 bursts (seed 7) | as F1 | pass | 10:22: 6 of 6 OK, bare 0, overlay 0, «хаб закрыт» 0 |
| F3 | after the fix | 12 bursts by index (seed 11) | as F1 | pass | 10:23: 12 of 12 OK, bare 0, overlay 0, «хаб закрыт» 0 |
| F4 | after the fix | a frame 1.5 s after burst 12 of F3 (last tab «Снаряжение») | the page complete, not the bare world | pass | bag, paperdoll, EoT icons, craft panel, hotbar on the frame |
| F6 | after the fix | 10 + 10 bursts by E/Q (seeds 5, 23) | as F1, the final tab as simulated on the ring of tabs | pass | 10:25 seed 5 — 10 of 10 match a ring of 9 (the tool's ring of 4, taken from the game map, was wrong — corrected); 10:27 seed 23 — 10 of 10 OK; bare 0, overlay 0 |
| F7 | after the fix, «Карта» | a frame of our «Карта» bottom bar | the Simple Minimap row centred on the bar as on the game's page | pass | 10:30 live slot change and 10:37 a fresh game with the code: «Новый маркер · Свои маркеры» level with «Сброс маркеров» |
