# TC — every row of «Моды Krinik'а» moved by the player, saved, and its effect seen in the game

> **Created:** 2026-11-01 · **Basis:** plan `plans/40_epic40_phase2_hub_shkalas_audit.md` (criteria 1–5, 4a); `[OWNER]` 2026-11-01 13:23 «ты сделал шкалы
> настройки - якобы давая игрокам возможность это настраивать, но это ЕБАНАЯ показуха, потому что за этим нет кода и механики» · 14:18–14:20 sensible ends

## Stand

| Part | Value | Set up by |
|---|---|---|
| Launch | the game in front | `launch-fg.ps1`, `enter-world-remote.sh` |
| Hero | god on, food / water 100 read back | `god-on.sh`; `h.FoodCurrent=100.0` |
| Window | the hub by `ActivateModule('KrinikModSettings')`; page by a real click; shkalas by `mouse-seq.ps1` clicks on the track; «Сохранить и закрыть» by a real click | remote + real mouse |
| Camera config | the owner's tuned `ue4ss/Mods/KrinikConanCamera/config.lua` copied out before the run and back after, `cmp` equal | `cp` |
| Reads | the remote (`pult.sh "lua …"`): the hero's `ThirdPersonSpringArm` (the component the camera mod chose — its log «ВЫБРАН компонент»), `CameraThirdPerson`, hero fields; frames by `capture-window.ps1` | — |

## Cases (one per row; «before» read at the default, «after» after the real-mouse move and the save)

Before (14:39): height 80 (the owner's tuned value), side 0, distance 230 (the wheel), pitch −2, nearest 130, farthest 2125, zoom speed 9.

| ID | Row | Default → moved | Read | Expected | Status | Observed |
|---|---|---|---|---|---|---|
| H1 | Высота камеры | 80 → 150 | SpringArm `SocketOffset.Z` | 150 | pass | 14:40 → 150.0, but only after the inventory closed (the defect below); after the fix 14:42: 100 → 99.9 at «Сохранить и закрыть» itself |
| H2 | Сдвиг камеры вбок | 0 → 55 (the click gave 55) | SpringArm `SocketOffset.Y` | 55 | pass | 55.0 |
| H3 | Расстояние до героя | 230 → 490 | SpringArm `TargetArmLength` | 490 | pass | 490.0 |
| H4 | Наклон взгляда | −2 → 10 | `CameraThirdPerson.RelativeRotation.Pitch` | 10 | pass | 10.00 |
| H5 | Ближе всего к герою | 130 → 300 | hero `ThirdPersonCameraMinArmLength` (the game's own wheel limit) | 300 | pass | 300.0 |
| H6 | Дальше всего от героя | 2125 → 975 | hero `ThirdPersonCameraMaxArmLength` | 975 | pass | 975.0 |
| H7 | Резкий зум | off → on | the camera log; the arm 50 ms after one wheel click | the jump | partial | log «резкий true» — taken; the jump of one click not timed |
| H8 | Скорость зума | 9 → 20 | hero `TP_SpringArmInterpSpeed` | 20 | pass | 20.0 |
| H9 | Счётчик кадров | on → off | a frame of the top-right corner | empty | pass | the corner empty (`fps_corner.webp`); «83» stood there before |
| H10 | Мигание еды и воды | 10 % → 30 % | food 25 %: `Border_EatImage` content colour G | < 1, pulsing | pass | G 0.77, 0.57; log «food: пик 0.3» |
| H11 | Мигание веса | 90 % → 60 % | the hero carries 97 / 145 = 66 %: `Image_Weight_Blinking` alpha | > 0 | pass | 0.11, 0.23; log «weight: пик 0.3» (no spawn needed) |
| H12 | Мир замедляется в меню | 33 → 1, then 3 | the inventory by a real Tab: the pause log | 1 — no slowdown; 3 — 0.3333 | pass | 1: «ОТКРЫТ», no «замедление» line; 3: «замедление времени 0.3333» |
| H13 | Крафт в меню без замедления | on → off | the world at 0.3333: the hero `CraftingQueue.CraftTimeMultiplier` | 1.0 (craft slows with the world; on sets the dilation) | pass | 1.0000 |
| H14 | Сколько держится фраза врага | 1 → 5 s | log «фраза снята через X с» | X ≥ 5 | not run | needs a shouting enemy; seen earlier today (report `testcases/reports/2026-11-01_conan-shout-hold-slider.md`); the store got 5 |
| H15 | Полёт стрелы как в Oblivion | on → off | the archery log at the next aim; arrow speed at two draws | equal speeds when off | partial | log «настройки окна: баллистика false …»; speeds not measured |
| H16 | Стрелы не ломаются | on → off | a fired arrow's `CanBreakOnImpact` | true | partial | the same log line «стрелы не ломаются false»; no arrow fired |
| H17 | Обзор при прицеливании | 75 → 50 | RMB held 2 s by `mouse-seq.ps1`: `PlayerCameraManager:GetFOVAngle()` | 50 | pass | 50.0 |
| H18 | Размер HUD вверху экрана | 125 % → 150 % | log; live `W_SmoothHP` `RenderTransform.Scale` | 1.5 | pass | «масштаб HUD x1.50 (окно «Моды Krinik'а» …)» at the click (after the fix); 1.50 × 1.50 |
| H19 | Сколько лежит кровь на земле | 300 → 30 s | log «кровь лежит 30 с» at the next stain | 30 | partial | the store got 30; no melee hit made (G1 of 2026-10-31 saw 60 s work) |
| H20 | persistence | one row per page saved | restart | the values and effects hold | not run | (the vignette store held across a restart today — V8 of `TC_conan_vignettes_2026-11-01.md`) |
| H21 | close without saving | one row moved per page | «Закрыть без сохранения» | `KrinikSettings.lua` unchanged (`cmp`) | not run | |
| H22 | reset | three rows moved and saved | «Сбросить к исходным», «Сохранить» | the defaults' effects | not run | |

## Defect found and fixed in the run — «Сохранить и закрыть» did not reach the camera and the pack manager

The hub closed by `TryCloseWindow` (native); the camera and KrinikConanModPackManager take a saved set in a pre-hook of
`GUIModuleController:ActivateModule(…, false)`, which a native close never fires — the set waited for the next window the game closed (the inventory by Tab,
14:40). Fix: the hub calls `ActivateModule(FName("KrinikModSettings"), false, false)` from Lua after the close (`krinik_mod_settings.lua` `close_window`).
Seen 14:42: height 100 taken at the click; 14:45: HUD ×1.50 at the click. The 10-31 cases passed because the window was opened over the inventory, and the
inventory's close fired the hook.

State after the run: the store `KrinikSettings.lua` deleted (copy `store_after_audit.lua` in the session scratchpad), the owner's camera `config.lua`
restored from the copy, `cmp` equal.
