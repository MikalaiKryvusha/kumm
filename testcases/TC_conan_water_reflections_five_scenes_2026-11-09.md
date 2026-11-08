# TC — Conan: water reflections on five still beach views — no reflection vs rays (and a third way if recon finds one), frames without the interface and one-minute FPS

> **Created:** 2026-11-09 · on the owner's word `[OWNER]` 2026-11-09 00:07 «поставь пожалуйста героя в 5 разных мест на карте у воды на пляже, смотри на воду» ·
> «чтобы вдали над водой явно что-то возвыщалось» · «без отражения» · «отражения лучами» · «отражение в экранном пространсте ПЛОХОЕ, не используем его. Можно поискать
> какие-то альтернативы» · «Снимай кадр без интерфейса. Затем возвращай интерфейс, ставь время 11 часов, и минуту стой - пиши FPS график» · «Померяем в среднем
> на статичных сценах в выборке по 5 сценам по минутному бенчу сколько разница в FPS»
> **Parent:** `TC_conan_overclock_baseline_and_pure_rays_2026-11-08.md` (fly-through cost of variant 6); review folder 75 (water with no reflection path)
> **Status:** 🟡 run 2026-11-09 01:02–01:39 — partial (delta_falls rays / sw to re-shoot); written 2026-11-09 00:10 +03:00
> **Outbound:** frames + the FPS table → the owner (review folder 76)

## 1. Goal vector

Achieve: the owner sees, on five beach views with something tall across the water, what the water looks like with no reflection and with rays (variant 6:
rays only), and how much the rays cost on still scenes — the mean over five one-minute captures.

## 2. Stand

Background path, world by the remote, `no-power-throttle.ps1` before the first capture, `stand-keeper.sh` on for the whole run (rule 11.6a), machine lock. Per scene:
`tp_ground.sh` to the shore point, `fixed-cam.lua` behind / above the hero looking over the water. Per setting: `set-reflections.sh <off|6>` with read-back; the
interface hidden by `EnableVanityCameraMode(true)` for the frame, back for the capture; 11:00 set before the frame and before the capture. Order per scene: off, 6
(a third way, if the recon `researches/conan-water-reflections/` names one, as the third setting).

## 3. Cases

| # | Case | Expected | Status |
|---|---|---|---|
| S0 | scouting: candidate shores (map vistas: oasis beach, Nekhet, Shattered Springs, Eyelet Lake, Priestking's Retreat, Imi's Cradle) — a sheet per place | five views: the hero at the water, something tall across it | — |
| H1 | the interface hidden by the idle-camera mode, frame | no HUD, hot bar, minimap, quest panel on the frame | — |
| W1–W5 | per scene: frame `off` and frame `6` without the interface | the same view; `off` — sky-coloured water; `6` — the far shore reflected | — |
| F1–F5 | per scene: 60 s PresentMon for `off` and for `6` with the interface | avg / median FPS, CPU / GPU ms per run | — |
| F6 | mean over the five scenes: `6` vs `off` | one number: the FPS difference on still scenes | — |
