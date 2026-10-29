# TC — ConanModPackStatus: no main-thread freeze every 2 s

> **Created:** 2026-10-29 · **Parent:** the owner's report «есть какие-то фризы раз в 3 секунды примерно» · «я просил писать моды уважительно к главному потоку» (2026-10-29)
> **Status:** run 2026-10-29 10:47 — pass (F5 partial), report `testcases/reports/2026-10-29_conan-modpackstatus-freeze.md`
> **Outbound:** —

**Basis.** Before the fix (PresentMon 30 s, hero idle in the world, 2026-10-29 10:4x): 14 spikes of 107–124 ms CPU, period 2.12 s;
median frame 11.7 ms. Cause: `ConanModPackStatus` tick every 2 s for the whole session — full read of `ConanSandbox.log` (2 MB, 30 ms),
two passes over 1928 `UserWidget` with names (26 ms each). Fix: the tick lives only `cfg.checks` ticks, the pak count stops once all
paks are found, the HUD scale runs on the creation of `W_SmoothHP_C` (NotifyOnNewObject), the menu hiding on the creation of the main menu.

**Stand.** The same place as the "before" run (beach, palms, hero idle, no enemies near), same game build, hero not moved; the
measurement starts ≥ 70 s after the world loaded (the tick has ended). Dimensions covered: idle world frame times, the HUD scale on
world entry. Not covered: death/respawn HUD re-creation (no death on the stand), exit to the main menu (case F5 — done if cheap).

| # | Case | Steps | Expected | Status |
|---|---|---|---|---|
| F1 | No periodic freeze | PresentMon 30 s, hero idle | 0 frames > max(2.5 × median, 20 ms) with a ≈ 2.1 s period; p99 well below 100 ms | pass 10:47 — 0 spikes, max 20.9 ms (before 14 × 107–124 ms) |
| F2 | The tick ends and reports its cost | `UE4SS.log` | «наблюдение окончено: СБОРКА: моды 66/66 · самый долгий тик N мс» | pass 10:46:50 — worst tick 141 ms in the first minute (loading) |
| F3 | HUD scale still applied | log + frame of the HUD | «масштаб HUD по созданию: N мс» and «HUD W_SmoothHP_C: … масштаб выставлен»; the HUD on the frame the same size as before (×1.25) | pass 10:47 — frame matches the 10:28 frame |
| F4 | Control: the old mod gives the freeze | the "before" run above | 14 spikes, period 2.12 s | pass (10:4x) |
| F5 | Main menu elements still hidden after exit to the menu | exit to menu by the remote, frame | side bar and border hidden; «меню по созданию: N мс» in the log | partial — startup menu: 2 of 2 hidden by the event (57 ms, in the menu); exit to menu not run |
