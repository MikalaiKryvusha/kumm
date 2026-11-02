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
| V4 | `visual_scale` 3; the companion moved 8 m BEHIND the hero and frozen (it stood in the V2 frame); a frozen Kappa 30 m ahead; the aiming camera behind the hero | a 60 fps video of one shot, the flight whole in the clip, cut around the flight and slowed ×4 | the ×3 arrow seen flying away from the hero across ≥ 10 frames, the tip leading, from the bow to the Kappa; nothing in front of the camera | — | the owner 2026-11-01 20:37 +03:00 on the V2 video: «здесь не видно вылета» — 35 frames, the companion's face in front, the shot not in the clip |
| V3 | as V1 | the section's log at the first visual arrow | mesh, scale, Z offset = maxZ × (1 − 3) | partial | 17:48:51 «крупная стрела: сетка SM_iron_arrow ×3.0, конец по Z 76.3 см, сдвиг -152.7 см»; ProjectileMesh hidden — seen in the frames (no second, small arrow), not read by the remote |

### The cursor key's name (the owner 2026-11-01 20:37-20:38: «это же не клавиша мыши, а клавиша клавиатуры» · «Клавиша вызова курсора»)

Stand: the game in the BACKGROUND (the owner 20:38 «работай с игрой в фоне»), the world entered by the remote, frames by `capture-window.ps1` / `capture-burst.ps1`.

| ID | Situation | Action | Expected | Status | Observed |
|---|---|---|---|---|---|
| K1 | `Game.locres` after `locres-fixes-2026-11-01b.tsv` deployed | open The Damage Meter settings window by the remote | the key row reads «Клавиша вызова курсора», fits its line | pass | 20:41 frame: the label fits above the F1 box; the F1 box overlapped by «Частота обновления полос (только вид)» → K3 |
| K2 | as K1 | open the Simple Minimap settings window by the remote | the key row reads «Клавиша вызова курсора», fits its line | pass | 20:42 frame: «Клавиша вызова курсора» with F1 beside it |
| K3 | `dm-fish-ru.tsv` rows 58–59 + `locres-fixes-2026-11-01c.tsv` deployed, the game relaunched | open The Damage Meter settings window | «Частота обновления полос» stays in its column, the F1 box clear | pass | 20:45 frame at 4K: clear (report `testcases/reports/2026-11-01_conan-cursor-key-name.md`) |

### The menu logo tone and the minimap place (the owner 2026-11-01 20:46-20:51 and 20:46-20:48)

Stand: the game in the background; the main menu and the oasis save, frames by `capture-window.ps1` at 4K; positions found by template matching of the source textures.

| ID | Situation | Action | Expected | Status | Observed |
|---|---|---|---|---|---|
| L1 | `T_KrinikModpackLogo` from `make-pack-logo.py <out> 1.3` (dark fill matched to the game logo), KrinikConanUI pak rebuilt | the main menu, measure the dark fill (source luminance < 70) of both logos in one frame | KRINIK dark-fill percentiles within 2 of CONAN; gold unchanged | pass | 21:02 frame: CONAN 5 / 11 / 19 / 31, KRINIK 6 / 12 / 19 / 30 (before 11 / 17 / 25 / 38); review folder 52 |
| M1 | `krinik_minimap_coords.lua` `BOTTOM_INSET` 60 → 52, `CORNER_SHIFT` (16, −16.3) → (10, −10.3) | enter the world, frame the minimap | the ring further from the top and right edges (≈ 6 px more at 1080p), the coordinate plate lower, not touching the clock plate | pass | 21:03 frame at 4K: top gap 33 → 48 px, right 33 → 44 px; the coordinate plate ≈ 12 px above the clock plate |

### The ×3 arrow hidden at impact (the owner 2026-11-01 21:07 «нашу x3 мгновенно нужно скрывать, когда происходит слолкновение, и показывать только настоящую x1»)

Stand: the game in the background; a frozen green Kappa 28 m ahead in the water, nobody before the camera; the shot by the remote `LaunchProjectile()` (the
background twin of the real-mouse shot, found 21:05); for the video only the flying arrow actor slowed (`CustomTimeDilation` 0.1 on that one actor — the
world runs at normal time).

| ID | Situation | Action | Expected | Status | Observed |
|---|---|---|---|---|---|
| V5 | `StopProjectileInternal` hook in `add_visual_arrow` | one shot into the ground / the Kappa, read the remote right after impact | the log «гашение крупной стрелы при ударе: подписано»; the flying actor's own ×3 mesh `IsVisible` false within the impact frame; the stuck ×1 copy visible | partial | 21:10:37 log «гашение крупной стрелы при ударе: подписано» at the first shot; the remote read of the big mesh after impact found none (my query did not tell our component apart) — the look decided by V6 |
| V6 | as V5 | the owner plays: shots into the ground, rocks, enemies | the ×3 arrow seen in flight; after impact only the ×1 copy (no big arrow beside it) | pass | the owner's own run 21:11–21:13: `[OWNER]` «да, суппер работает!» · «и земля, и камни, и враги» (the agent's 60 fps recording 21:10 caught the owner's desktop and was deleted unwatched) |

### The pickup prompt «E Взять» (plan 42; the owner 2026-11-01 21:14–21:34)

Stand: the game in the background, the oasis save, god on; the crosshair turned onto pickup foliage by `SetControlRotation`; frames by `capture-window.ps1`; the prompt's
own log lines; the hub log.

| ID | Situation | Action | Expected | Status | Observed |
|---|---|---|---|---|---|
| P1 | section `krinik_pickup_prompt` deployed | enter the world | log «плашка «E Взять» в прицеле», «компонентов подбираемой растительности: N» (N > 200 at the oasis), no error | pass | 21:38:53, 21:43:28, 21:46: both lines, 281 components, no error |
| P2 | the crosshair on a stone / branch / fibre within the game's pickup line | wait 1.5 s | the plate «E Взять» under the crosshair (frame) | pass | 21:39 frame: «E Взять» under the crosshair 1.5 m from a stone (backing 0.55 hardly seen on sand → 0.85) |
| P3 | the crosshair on open sand / sky | wait 1.5 s | no plate | redefined | 21:40: the plate stayed with the crosshair in the SKY beside the stone — and E there DID take the stone (weight 97.64 → 97.70): the game's search is a 2 m sphere along a 90 cm probe that starts at the hero (camera + view × arm — CORRECTED 21:53), not the aim; the prompt tells the truth. Control «no plate» = no pickup within reach — 21:47 frame: no plate |
| P4 | as P2 | press E (the owner, or a real key) | the item taken; within ≈ 1 s the plate goes if nothing else is in reach | pass | 21:40: a real E (`mouse-seq.ps1`) took the stone; the plate stayed — fibre and branches still in reach |
| P5 | a minute of play | read the section's summary line | the worst check ≤ 1 ms; per-minute own time logged | partial | 21:39 all in one frame: 204 ms / 60, worst 6 ms (FindFirstOf every second + a 30 m near sphere) → cached controller and hero, a 6 m sphere, the near refresh on its own half-second frame: 21:47 20 ms / 60 = 0.33 ms a check, worst 3 ms (os.clock step 1 ms — not concluded); 21:50 the check body repeated 100× in the live game: **check 0.120 ms, near refresh slice 0.180 ms** (each on its own frame once a second); the A-B flight (rule 7 acceptance) is still owed |
| P6 | pack `ac31b3a` deployed (the backing only under the word, `[OWNER]` 21:57) | a stone in reach, wait 1.5 s, a 4K frame of the crosshair area | the E key in its own thin frame with no dark under it; the soft backing (alpha 0.35) only behind «Взять» | pass | 22:19 4K frame (review folder 54): E in its own thin rim, nothing dark under it; the backing only behind «Взять». Seen: the backing reads as a rectangle with slightly soft sides — put to the owner |
| P7 | the owner's case: stones at the hero's feet, the camera raised above the hero (pitch ≈ −50°) | wait 1.5 s, a frame | the plate shows (E takes a stone from there — checked by a real E and the weight) | pass | 22:19: stand `SM_rock_small04` 60 cm west of the hero, pitch −50 — plate shown; a real E (`mouse-seq.ps1`) → weight 97.60 → 97.66 (a stone taken) |
| P8 | as P6 | the hero walks away until nothing is in reach | the plate fades out (no snap) within ≈ 1.2 s (1 s check + 0.2 s fade) | pass | **22:41 by the player's path:** the hero 60 cm from a stone, a real E every 2.9 s (`mouse-seq.ps1`), plate and weight read after each: E1 97.66 → 97.72, plate on; E2, E3 weight unchanged, plate on; E4 97.78 — nothing left in reach, plate `Collapsed`, opacity 0.00 (the fade ran to its end and collapsed); E5–E8 unchanged, plate off. E2–E3 taking nothing while a stone was still in reach (E4 took it with no move) — the game's own pickup busy between presses, not the probe; the smoothness of the fade itself is the owner's eye in game. Earlier (22:23): a real S for 4 s took the hero 13 m away — plate still on, and rightly: more pickup stones 2–3 m away (frame). The oasis has no clear sand near the stand; a teleport to a «no pickup within 5 m» spot landed under the ruins → the game's undermesh teleport and a 90 s in-game loading screen (22:20:02 → 22:22:31), the crosshair (and our plate) re-created after it — the plate rebuilt itself (log 22:22:32). «No plate when nothing is in reach» stays proven by the 21:47 frame; the fade itself — the owner's eye in game |
| P9 | the flight bench, one route, the same save | A-B-A-B: section on / section off (`krinik_pickup_prompt.lua` moved out) | median `MsCPUBusy` and stutters of «on» no worse than «off» beyond flight noise (EXP-0335) | — | — |
| P11 | defect found 22:30 in flight A1: the section's component list grew 281 → 1976 while 281 were loaded (unloaded ones never left the list; the near cycle stretched from 14 to ≈ 100 s) → fix: an invalid component leaves the list in the near refresh | the reference flight `krinik-show` (streams the whole route in and out), then the hero back at the oasis | the summary line's «из N» within 2 × the loaded count read by the remote (16 foliage actors, `PickupFoliageComponent_C`) | pass | 22:40, after a warm-up and a measured flight with the fix: list 634, loaded 590 (before the fix, after one flight: 1976 vs 281) |
| P12 | the owner's pick 22:48 «вариант 3» (review folder 55): `KEY_GAP` 6 in the source, deployed after the A-B | a restart, a stone in reach, a 4K frame | E's rim 6 units from the backing's text edge — the frame matches `03_zazor_6.webp` of folder 55 | pass | 23:14 4K frame after the restart: E's rim close to «Взять», as variant 3 |
| P10 | an enemy near the hero with its health bar shown, a pickup in reach | a frame | the plate and the enemy's health bar do not cover each other | partial | 23:16 frame: a Kappa 8 m ahead — its bar «73 / 73» 60 px (1080p) above the plate, no cover; 23:19 frame: a Kappa beside the hero — its bar «31 / 31» on the plate's line, ending 50 px left of «E», no cover. The bar is drawn over the creature in the world, so a creature right under the crosshair can bring it onto the plate; not staged yet — the owner's eye on frames 23:16 / 23:19 decides whether to move the plate |

### Hub mode — one window, the hub named by the list (plan 40.3 I6.1, Lua part; `krinik_mod_settings.lua` + `krinik_mods_button.lua`)

Stand: the live game, the inventory open by a real Tab, the list «Настройки модов» by a real click (`mouse-seq.ps1`); frames by `capture-window.ps1`; the hub log.

| ID | Situation | Action | Expected | Status | Observed |
|---|---|---|---|---|---|
| H1 | the list open | click «Моды Krinik'а» | the window titled «МОДЫ KRINIK'А · НАСТРОЙКИ», the same live pages as before the change (camera, UI, archery, pack manager, graphics), log «page …» of the first | pass | 23:15 real Tab, real clicks on «Настройки модов» and «Моды Krinik'а»: frame — «МОДЫ KRINIK'А · НАСТРОЙКИ», the five pages, no Damage Meter page; log «page cam», filled in 9 ms (and «slider not found» ×4 for the dm rows not in the kit — fixed: pages not live are not filled; 23:26 after a restart — 0 such lines, filled in 7 ms) |
| H2 | the inventory open, no list click | the remote `ActivateModule(KrinikModSettings)` | Krinik's hub (the default when no hub is named) — same as H1 | pass | 23:15:38 after a real Esc: the remote opening reads the title «МОДЫ KRINIK'А · НАСТРОЙКИ», page cam |
| H3 | H1 then H2 | — | the second opening does not keep a hub from the first (`_G.__krinik_hub` cleared at fill) | pass | H2 ran right after H1 with the default hub; the variable is cleared at fill (code) — a Xevyr-then-remote order waits for the Xevyr pages |

### The Damage Meter page in the Xevyr hub (plan 40.3 I6.1 kit + I6.3 adapter)

Stand: the live game, the inventory open; the hub opened as Xevyr's by the remote (`_G.__krinik_hub` is the list's variable — the list's Xevyr entry is still a sub-list), real mouse in the window; the author's own window `DN_UI_SettingsWindow_C` opened by its module to read the result.

| ID | Situation | Action | Expected | Status | Observed |
|---|---|---|---|---|---|
| D1 | the kit rebuilt with the dm rows, deployed | open the hub as Xevyr's | the title «МОДЫ XEVYR'А · НАСТРОЙКИ», one page «The Damage Meter» with 8 rows, values = the author's slot (or its defaults) | pass | 2026-11-02 00:25 (opened by the shared variable `KrinikHubRequest` from the remote): title, one page, 8 rows; values 100 %, 85 %, off, off, on, on, 0,2, 7 = the mod's defaults. Seam seen: the mod's name stands mid-height in the left list, not at the top |
| D2 | D1 | move «Пауза до новой стычки» to 10 by the real mouse, «Сохранить» | the log «saved through the author's window»; the author's own window then shows 10 s | pass | 00:25 a real click on the track + «Сохранить»: the log line; the mod's slot `segmentTimer` 10.00 (00:27 again → 5, slot 5) |
| D3 | D2 | a 60 fps clip of the save | the author's window does not flash over ours, or the flash is measured | partial | 00:25 the author's window STAYED OPEN behind ours (its lines showed through the panel) → fixed: its module closed after its SaveSettings; 00:27 module inactive, frame clean. A one-frame flash during the save — not measured (no 60 fps clip) |
| D4 | D1 | open the Krinik hub, «Сохранить» | the author's window does NOT open (the dm save runs only from its own hub) | — | — |

### The left list of a hub with few pages (seam of D1, 2026-11-02)

Stand: the live game in the world (HUD born — a window opened during the world load is not filled: log «module opened, but no visible …», the 00:30 run), the inventory open by a real Tab; the hub opened by the remote (`KrinikHubRequest`); a frame of the window at 4K; the remote reads `GetDesiredSize` / slot alignments of `SB_KrinikList`, `SC_KrinikMods`, `HB_KrinikModItem_dm`.

| ID | Situation | Action | Expected | Status | Observed |
|---|---|---|---|---|---|
| L0 | the hub opened as Xevyr's by the remote after the HUD is born | read the list's widgets by the remote + a frame | the cause of the mid-height name named by numbers (which box is taller than its content and how it aligns) | pass | 07:29 frame: the name mid-height. Every slot Fill (V=0) — not an alignment; the list's desired height 214 for one 53-unit name: the five Krinik rows `HB_KrinikModItem_<key>` stayed visible (4) at 32 each — only their border was collapsed, the hidden bar Image kept its height. Collapsing them by the remote: desired 54, the name at the top (frame 07:30). The 00:30 «empty window» was a window opened during the world load (log «module opened, but no visible …»), not the alignment edit |
| L1 | the fix deployed | open the hub as Xevyr's | the single name «The Damage Meter» at the TOP of the list, level with the page title | pass | 07:32 after a restart (fill 11 ms): «The Damage Meter» at the top, level with the page title, 4K frame |
| L2 | L1 | open the hub as Krinik's | the five names from the top as before, no shift | pass | 07:32 (fill 22 ms): the five Krinik names from the top, the camera page selected, the long pack-manager name runs as designed |

### The other four Xevyr pages (plan 40.3 I6.3, 2026-11-02)

Basis: recon `researches/conan-mod-settings-hub/xevyr-settings-recon.md` §2–§5 (rows, ranges, defaults, the apply path of each mod). Stand: as L0 (world, HUD born,
the hub opened as Xevyr's by the remote); values set by a real mouse click on a track or a box where the case says «change», otherwise by the remote
(`SetValue` on our `Sld_Krinik_<id>` / a click on `Brd_KrinikChk_<id>`); «Сохранить» by a real click; the mod read back by the remote (its slot, its component,
its controller). Partitions: a page per adapter way (window: PrP, SM; call: LLH, AMR); a changed vs an unchanged page; a slider vs a check row.
Not covered: colour, dropdown and key rows (not built — I6.2); a dedicated server (AMR's RPC runs on the listen host here).

| ID | Situation | Action | Expected | Status | Observed |
|---|---|---|---|---|---|
| X1 | the kit rebuilt with the four pages, deployed | open the hub as Xevyr's | the list «Al-Merayah Reborn · Lore & Loot Highlight · Proximity Party · Simple Minimap · The Damage Meter» from the top; each page shows its own rows (the title over the rows = the selected name) | pass | 07:52 (fill 17 ms, «page amr»): the five names alphabetical from the top, Al-Merayah's 13 rows; real clicks on the other four names — each page its own rows under its own title (sheet `x1_sheet`) |
| X2 | X1 | read every page's values vs the mod (slot / component / controller by the remote) | each row = the mod's value (defaults where the player never saved) | pass | probe 07:51 vs the frames: PrP on / 80 % / 40 м / 5; SM off / on / 85 % / 250 / on / on; LLH on / on / 100 % (no slot yet — read from the component); AMR six on, 3000, 30, 30, 20, 20, 25, 3; DM as D1 (pause 5 — the value the previous chat's D2 run left) |
| X3 | X1, Proximity Party | change «Радиус отслеживания» to 30 м, «Сохранить» | log «prp: saved through the author's window»; slot `trackRadius` 3000; the player component `DetectionRange` 3000 | pass | 07:53:32 the log line; slot 3000, component 3000 — the author's `SaveSetting` reads the slider (no window field needed) |
| X4 | X1, Simple Minimap | change «Масштаб» to 70 %, «Сохранить» | slot `UIScale` 0.70; the minimap smaller on a frame | pass | slot 0.70; the ring visibly smaller on the 4K frame pair `x4_pair` (07:52 vs 07:53) |
| X5 | X1, Lore & Loot | change «Яркость подсветки» to 50 %, «Сохранить» | log «llh: applied by UpdateSettings, slot … saved: true»; the component `HighlightIntensity` 0.5; `LLH_Settings.sav` exists | pass | the log «slot LLH_Settings saved: true»; the slot now exists — 0.5, the component 0.5 |
| X6 | X1, Al-Merayah | change «Размер отряда контратаки» to 5 and «Возрождение: стены» to 40, «Сохранить» | log «amr: ServerSaveSettings sent»; the controller `CounterAttackSize` 5, `BattlementRespawnCD` 40, `BaileyRespawnCD` unchanged 20 (the argument order) | pass | the log line; the controller `CounterAttackSize` 5, `BattlementRespawnCD` 40, `BaileyRespawnCD` 20 — the battlement / bailey order is right |
| X7 | X3–X6 saved | «Сохранить» again with no change | log «… unchanged — the mod is not written» for every Xevyr page; no author window opens | pass | 07:54:08: «amr / llh / prp / sm / dm unchanged — the mod is not written» |
| X8 | X3–X6 | put the changed values back to the defaults, «Сохранить» | the mods hold their defaults again | pass | probe after the save: PrP 4000, SM 0.85, LLH 1.0 (slot and component), AMR battlement 20, size 3; frame 07:54 — no author window left behind ours |

### Colour rows, the palette popup and the key capture (plan 40.3 I6.2, 2026-11-02)

Basis: the owner's 07:20–07:23 decisions on mockups 8–9 (plan 40 I6.2): the palette and the busy-key refusal are popups over the window, no row moves; «Отмена» · «Принять»; no caption under an accepted key; the refusal fades in, holds 5 s, fades out. Recon trace of the Damage Meter's SaveSettings (each colour button's `Color`; the key selector's chord). Stand: as X1; real clicks on swatches, palette cells and buttons; a key pressed by `mouse-seq.ps1` (`kdown:/kup:`); the mods read back by the remote. Partitions: a single-colour row (call way — Lore & Loot; window way — Damage Meter theme) vs the nine-colour row; a free key vs a key the game binds; accept vs cancel vs a click outside.

| ID | Situation | Action | Expected | Status | Observed |
|---|---|---|---|---|---|
| C1 | the kit rebuilt, the hub as Xevyr's | the Damage Meter, Lore & Loot and Simple Minimap pages | the colour rows show the mods' colours (swatch + name), the nine follower swatches, the key rows show «F1»; the rows stand in the author's order | pass | 08:12 frames: colour rows with the mods' colours, nine follower swatches, «F1» in both key rows, rows in the author's order (kit pass 2 re-ordered the dm and llh pages). Seams found and fixed in the second build (08:25): names by linear distance (pure red «золото») → by sRGB, far colours «свой цвет»; the name sat on the box's bottom edge → the box padded at the sides only, the swatch 10 high centred |
| C2 | C1, Lore & Loot | a click on «Цвет подсветки знаний» | the palette opens at the cursor OVER the page; the rows below do not move (frame before/after); «было» = the current colour | pass | 08:13 frame pair: the palette over the page at the swatch, the rows below in place, «было» = red. Seam fixed: all 16 cells had the chosen rim (a transparent BrushColor kept the outline) → the cell brush drawn only on the chosen one; seen 08:25 — the rim on «чёрный» only |
| C3 | C2 | a click on a swatch («голубой»), «Принять», «Сохранить» | the row's swatch turns blue; log «llh: applied …»; the component and the slot `LoreHighlightColor` ≈ the palette's blue, alpha 1 | pass | log «llh: applied by UpdateSettings, slot LLH_Settings saved: true»; slot and component lore = (0.038, 0.114, 0.198, 1.00) = the palette's «голубой» linear |
| C4 | C2 | open again, pick a swatch, «Отмена»; open again, a click outside the plate | the row keeps its colour both times; the plate closes | pass | 08:14: «palette closed unchanged» after «Отмена» and after a click outside; the row kept «голубой» |
| C5 | C1, Damage Meter | the theme colour → «синий», «Сохранить» | log «dm: saved through the author's window»; the slot `ThemeColor` RGB = the palette's blue, alpha 0.4 | pass | log «dm: saved through the author's window»; slot `ThemeColor` (0.020, 0.043, 0.125, 0.40) = «синий», the alpha set by the author's save |
| C6 | C1, Damage Meter | follower bar 3 → «зелёный», «Сохранить» | slot `FollowerColors[3]` = the green, the other eight unchanged | pass | 08:26 (after the snapshot fix): bar 4 → (0.076, 0.198, 0.038, 0.70), the other eight unchanged; a SECOND edit after that save also written (bar 4 → «голубой»). The first try 08:15 said «dm unchanged» — the saved values shared the window's list; fixed (`snapshot`) |
| C7 | C1, Simple Minimap | a click on the key box, press F2, «Сохранить» | the box shows «F2», no caption under it; slot `mouseHotkey` F2 | pass | F2 is bound by the game (refused — right); F6: the box shows «F6», no caption; slot `mouseHotkey` F6 after «Сохранить» |
| C8 | C7 | a click on the key box, press a key the game binds (Tab) | the box keeps the old key; the plate «Эта клавиша уже занята» at the box, fades in, ≈ 5 s, fades out; no row moves | partial | LeftAlt (sent by mouse-seq's bring-to-front) and Tab refused: the box kept its key, the plate «Эта клавиша уже занята» under the box, rows in place; visible at 0.1, 1, 3, 5.5 s, gone at 6.5 s. The fade itself not measured (needs a 60 fps clip). The game binds 90 keys (InputSettings): free F1, F3–F12, I, U, 9, 0 |
| C9 | C3–C7 | put the colours and keys back (reset or picks), «Сохранить» | the mods hold their former values | pass | «Сбросить к исходным» on three pages + «Сохранить»: DM theme, bars, key, SM key, LLH colours back to the mods' defaults; DM pause back to the mod's default 7 |
