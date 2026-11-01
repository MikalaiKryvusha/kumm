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
| H7 | Резкий зум | off → on | the real camera-to-hero distance every 30 ms after one wheel click (`K2_GetComponentLocation` of `CameraThirdPerson` vs the hero) | the jump faster when on | pass | 14:54 off: 264 → 280 in ten steps (≈ 300 ms glide); on (real-mouse click + save, log «резкий true»): 280 → 299 in three steps (≈ 90 ms) |
| H8 | Скорость зума | 9 → 20 | hero `TP_SpringArmInterpSpeed` | 20 | pass | 20.0 |
| H9 | Счётчик кадров | on → off | a frame of the top-right corner | empty | pass | the corner empty (`fps_corner.webp`); «83» stood there before |
| H10 | Мигание еды и воды | 10 % → 30 % | food 25 %: `Border_EatImage` content colour G | < 1, pulsing | pass | G 0.77, 0.57; log «food: пик 0.3» |
| H11 | Мигание веса | 90 % → 60 % | the hero carries 97 / 145 = 66 %: `Image_Weight_Blinking` alpha | > 0 | pass | 0.11, 0.23; log «weight: пик 0.3» (no spawn needed) |
| H12 | Мир замедляется в меню | 33 → 1, then 3 | the inventory by a real Tab: the pause log | 1 — no slowdown; 3 — 0.3333 | pass | 1: «ОТКРЫТ», no «замедление» line; 3: «замедление времени 0.3333» |
| H13 | Крафт в меню без замедления | on → off | the world at 0.3333: the hero `CraftingQueue.CraftTimeMultiplier` | 1.0 (craft slows with the world; on sets the dilation) | pass | 1.0000 |
| H14 | Сколько держится фраза врага | 1 → 5 s | log «фраза снята через X с» | X ≥ 5 | not run | needs a shouting enemy; seen earlier today (report `testcases/reports/2026-11-01_conan-shout-hold-slider.md`); the store got 5 |
| H15 | Полёт стрелы как в Oblivion | on → off | the archery log per shot at draws 0 and 0.76 (`aim-shot.sh 300` / `1500`) at a frozen Kappa 8 m ahead | the speed depends on the draw when on, not when off | pass | 14:50 on: 2500 and 4389 cm/s; off (real-mouse untick + save): 5000 and 5000 cm/s |
| H16 | Стрелы не ломаются | on → off | a flying arrow's `CanBreakOnImpact` (a 50 ms probe during the shot); copies left after hits | true when off | partial | 14:52 off: the flying `BP_Visual_BowProjectileBase_C` carries `CanBreakOnImpact = true`, chance 0.65 — the row works on the field; but 8 of 8 arrows stuck in the Kappa with it off (the game breaks an arrow where it cannot stick, per the asset note in the game map) — the visible difference is on ground and rock, not on creatures; not shot there |
| H17 | Обзор при прицеливании | 75 → 50 | RMB held 2 s by `mouse-seq.ps1`: `PlayerCameraManager:GetFOVAngle()` | 50 | pass | 50.0 |
| H18 | Размер HUD вверху экрана | 125 % → 150 % | log; live `W_SmoothHP` `RenderTransform.Scale` | 1.5 | pass | «масштаб HUD x1.50 (окно «Моды Krinik'а» …)» at the click (after the fix); 1.50 × 1.50 |
| H19 | Сколько лежит кровь на земле | 300 → 60 s (run 3) | the stain of an arrow hit, frames at the hit and +91 s | gone after 60 s | pass | 15:01:47 the stain before the hero (`blood_a`), 15:03:18 the spot clean (`blood_ab.webp`); log «кровь лежит 60 с (окно … загрузка)»; run 2 had logged «30 с» |
| H20 | persistence | camera height 100, counter off, aim FOV 59, HUD 140 %, blood 60 s saved | restart | the values and effects hold | pass | 14:59 after a restart: `SocketOffset.Z` 100.0, the top-right corner empty, RMB `GetFOVAngle()` 59.0, `W_SmoothHP` scale 1.40, logs «кровь лежит 60 с … загрузка», «масштаб HUD x1.40 … загрузка», «обзор 59°» |
| H21 | close without saving | counter unticked + food blink moved | «Закрыть без сохранения» | no store file; the counter stays | pass | 14:57: log «closed (без сохранения)», `KrinikSettings.lua` absent, the corner shows «64» |
| H22 | reset | food 30 %, weight 60 %, shout 5 saved | «Сбросить к исходным», «Сохранить» | the defaults and their effects | pass | 14:58: the store had the three keys, after reset + save — empty; the window shows 10 % / 90 % / 1; the weight at 66 % stopped blinking («weight: выше порога», alpha 0.00 ×3) |

Stand of 14:48–14:54 (rows H7, H15, H16, H19): a green Kappa summoned, placed 8 m ahead and frozen by `_config/arrow-stand.sh summon / place 8 / freeze`; the bow in quick slot 1; shots by `_config/aim-shot.sh`.

## Defect found and fixed in the run — «Сохранить и закрыть» did not reach the camera and the pack manager

The hub closed by `TryCloseWindow` (native); the camera and KrinikConanModPackManager take a saved set in a pre-hook of
`GUIModuleController:ActivateModule(…, false)`, which a native close never fires — the set waited for the next window the game closed (the inventory by Tab,
14:40). Fix: the hub calls `ActivateModule(FName("KrinikModSettings"), false, false)` from Lua after the close (`krinik_mod_settings.lua` `close_window`).
Seen 14:42: height 100 taken at the click; 14:45: HUD ×1.50 at the click. The 10-31 cases passed because the window was opened over the inventory, and the
inventory's close fired the hook.

State after the run: the store `KrinikSettings.lua` deleted (copy `store_after_audit.lua` in the session scratchpad), the owner's camera `config.lua`
restored from the copy, `cmp` equal.

## Bug 73 — arrows hang in the air and vanish fast (`[OWNER]` 2026-11-01 15:06, seen on his screen during the H16 sand shots)

| ID | Situation | Action | Expected | Status | Observed |
|---|---|---|---|---|---|
| A1 | CONTROL: the archery Lua off (`enabled.txt` moved out) | 3 shots into the sand; the live copies' distance from `ImpactPoint` | the game's own placement | pass | 15:08: 62 cm (the arrow 76 cm from its nock — the tip in the sand); life 15 s |
| A2 | the mod on, ballistics on / off | the same | — | pass (cause found) | 187 cm with ballistics on (draw 0), 138 (draw 0.76), 187 with ballistics off (speed 5007) — not the speed |
| A3 | the mod on, `mesh_scale` 1 (experiment in the deployed copy) | the same | 62 | pass | 15:13: 62 cm — the cause is the ×3 arrow mesh: the game backs the copy off the hit by the bounds of `ProjectileMesh` (bytecode `GetAdjustedProjectileImpactPosition`) |
| A4 | the size restored in a pre-hook of `SpawnDummyProjectile` (two tries: the first static mesh, then `ProjectileMesh`) | the same | 62 | fail | the hook fired («масштаб 1.00»), the copy still at 187 cm — the bounds are taken earlier; the route dropped (no dead code left) |
| A5 | the fix: `mesh_scale` 1.0, the push «в тушку» removed | 3 shots into the sand, 2 into a frozen Kappa's head | 62 cm, nothing in the air | pass | 15:26–15:27: sand 62 / 62 / 62, frame `sand_after.webp` — three arrows stuck under the crosshair; Kappa head 62 / 62 |
| A6 | «стрелы быстро исчезают» | the copy's life span | — | game's own | 15 s with and without our mod (`GetLifeSpan()` 14.9 at birth, control A1) — the game's `ProjectileDummyLifetime`; a longer life is a new decision, asked |


### Bug 73, the owner's decision 16:18 — a stuck arrow lives 5 min, a hub row 1–30 min

Basis: `[OWNER]` 2026-11-01 16:18 «срок жизни стрел везде, и в земле, и в трупах, и в стенах нужжжжжжжжжен 5 минут - с возможностью настроить в модах стрельбы
из лука - в минутах, от 1, до 30» (corpses — with plan 40 phase 4). Stand: the live save's oasis spot, god on, food and water frozen by the remote, the bow in quick
slot 1 (key 1), shots into the sand by `_config/aim-shot.sh`; the copy's life read by the archery log line «копия стрелы #N … срок X с» (`GetLifeSpan()` 100 ms
after birth) and by the remote; the hub by the real mouse. Dimensions: the default (5), the low end (1), the store reload (save in the hub → next shot), the copy
still present past the game's 15 s.

| ID | Situation | Action | Expected | Status | Observed |
|---|---|---|---|---|---|
| L1 | the hub open on «KrinikConanArchery» | frame of the page | a row «Сколько стрела торчит в цели», value 5, hint «в минутах», «i» in its circle | pass | 17:33 frame (1080p): the fourth row of the page as expected |
| L2 | the store without the key (default) | a shot (a frozen green Kappa 8 m ahead instead of the sand — the camera looked at the horizon, the first arrow flew into the water) | the copy's life ≈ 300 s | pass | 17:36:32 «копия стрелы #1: удар в CharacterMesh0, кость rig_bone_kappa-head, от точки удара 62 см, срок 299.9 с». The first build set `ProjectileDummyLifetime` on the flying arrow — no such field there (the remote read a TrivialObject), the copy kept 14.9 s (17:33); the arrow's own fields are `DummyProjectileOnGroundLifetime` 30 and `DummyProjectileAttachedToCharacterLifetime` 15 — both set since |
| L3 | as L2 | the copy read again past 15 s | the copy alive (the game's own life was 15 s) | pass | 17:36:51: 1 copy, life left 279.7 s (20 s after birth) |
| L4 | the row moved to 1 by the real mouse, «Сохранить и закрыть» | a shot | the copy's life ≈ 60 s; the archery log «стрела торчит 1 мин» | pass | store `["arc_stuck_min"] = 1`; 17:40:50 «… стрела торчит 1 мин (номер настроек …)», copy #2 «срок 59.9 с» |
| L5 | the row back to 5, saved | a shot | ≈ 300 s again | pass | 17:41:33 «стрела торчит 5 мин», copy #3 «срок 299.9 с»; the key left the store (the default writes no key) — the owner's store as before the run |

Stand notes (17:37–17:40): the first key of every `mouse-seq.ps1` sequence is eaten by the window's activation (EXP-0412) — a harmless F13 (`kdown:0x7C`)
opens each sequence now; the save's bow in quick slot 1 broke during the stands (dim icon, key 1 did nothing) — a new «Мощный охотничий лук» by `exec MakeMeAdmin`
+ `exec SpawnItem 51405 1` landed in slot 3; the frozen Kappa walks again after an inventory visit — `arrow-stand.sh place 8` + `freeze` before every shot.

### Bug 73, the owner's scheme 16:23 — the physical arrow ×1, a visual ×3, joined at the tip

Stand: as the L cases (a frozen Kappa 8 m ahead, the bow in hand, every `mouse-seq.ps1` sequence opened by F13). Dimensions: placement of the copy (must not
change), the look in flight (×3, the tips together), errors and crashes, the trail.

| ID | Situation | Action | Expected | Status | Observed |
|---|---|---|---|---|---|
| V1 | `visual_scale` 3 | a shot at the Kappa's head | the copy 62 cm from the hit (as with ×1); no «крупная стрела: ошибка» in the log | pass | 17:50:06 copy #2 «rig_bone_kappa-head, от точки удара 62 см»; 17:48:52 a ground shot 62 cm; no error after the fix (the first build failed at `GetBoundingBox().Max` — nil from Lua; 17:46 the copy stood at 62 cm even then) |
| V2 | as V1 | a 60 fps video of the shot (ddagrab, desktop HDR off for the recording) | the flying arrow drawn ≈ 3× longer, its tip leading; the trail as before | pass | 17:50 frames 116–117: a long arrow, the big head at the aim point, the shaft back through the Kappa's head; frame 118 — the flight over (8 m ≈ 3 frames). The first video (17:48) was spoiled: the companion «Нурус Тихорез» killed the Kappa — frozen for the repeat (rule 11.6). The look → review folder 50 |
| V3 | as V1 | the section's log at the first visual arrow | mesh, scale, Z offset = maxZ × (1 − 3) | partial | 17:48:51 «крупная стрела: сетка SM_iron_arrow ×3.0, конец по Z 76.3 см, сдвиг -152.7 см»; ProjectileMesh hidden — seen in the frames (no second, small arrow), not read by the remote |
