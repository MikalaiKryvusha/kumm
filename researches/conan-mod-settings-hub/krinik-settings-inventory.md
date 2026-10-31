# Research — every tunable setting of our own Conan Lua mods (the rows of the «Моды Krinik'а» hub)

> **Created:** 2026-10-31 · **Parent:** plan 38 phase 2 · **Status:** first pass from the sources 2026-10-31 20:2x (read only, no code edited); live
> behaviour of the «apply without restart» routes is read from the code, not tried in game · **Outbound:** —

**Scope.** Our Lua mods in `D:\work\ai_sandbox\ConanExiles\_unpacked\`: KrinikConanCamera, KrinikConanModPackManager, KrinikConanUI (nine sections),
KrinikConanGraphics, KrinikConanArchery, KrinikConanGameplay. Notes read first: `games/ConanExiles/mods/KrinikConan{UI,Camera,Graphics,ModPackManager,
Archery,Gameplay}.md`. The harness mods (KrinikConanHarness) are the agent's instruments and are left out. `KrinikConanGraphics/Engine.ini` (361 lines,
the engine reads it at start, deployed through the manifest's `engineIni`) is engine configuration, not a Lua setting — out of this inventory.

**Path shorthands** (all under `D:\work\ai_sandbox\ConanExiles\_unpacked\`):

| Short | File |
|---|---|
| `CAM` | `KrinikConanCamera/Scripts/main.lua` (3213 lines) |
| `CAMCFG` | `KrinikConanCamera/config.lua` (the pack's shipped file) |
| `MPM` | `KrinikConanModPackManager/ue4ss/Scripts/main.lua` |
| `MPMCFG` | `KrinikConanModPackManager/ue4ss/config.lua` |
| `UI/<s>` | `KrinikConanUI/ue4ss/Scripts/<s>.lua` |
| `GFX` | `KrinikConanGraphics/ue4ss/Scripts/main.lua` |
| `ARC` | `KrinikConanArchery/ue4ss/Scripts/main.lua` |
| `GPL` | `KrinikConanGameplay/ue4ss/Scripts/krinik_oblivion_locomotion.lua` |

**The one finding that shapes the hub.** Only TWO of our mods read a settings file at all: KrinikConanCamera and KrinikConanModPackManager. Every row the
plan names for phase 2 (blood time, the FPS counter on/off, the HUD blink thresholds, the vignette) is today a constant in code or does not exist — they
are in table C («candidates»), not table A. The FPS counter has no on/off variable at all (`UI/krinik_fps_counter:89-115` attaches and updates it
unconditionally); the hub's checkbox row for it only logs the click (`UI/krinik_mod_settings:26`, `:101-103`). The vignette (plan 36 W23) has no code in
any of our mods (a search for `vignette|виньет` over `_unpacked/` hits only the camera's Nexus page draft).

The hub rule that frames the «apply» column: values are NOT applied live while the player moves a row — they apply on «Сохранить» (plan 38, 19:06,
`plans/38_EPIC_conan_mod_settings_hub.md:18-20`). «Apply without restart» below therefore means «what the mod must do when the hub saves».

## A. Settings that already exist in a file (player-facing) — 17 rows

Camera values: the shipped `CAMCFG` value wins over the code default (`CAM:345-352`), so the «default» column gives the shipped value and the code
fallback. The camera loads `config.lua` once at load (`CAM:1875` → `load_config` `CAM:321-366`); afterwards `cfg` lives in memory and the numpad edits it.

| # | Mod | Key (file:line) | Type → control | Default | Read when | Apply without restart (on «Сохранить») | Label (RU) | «i» (RU) |
|---|---|---|---|---|---|---|---|---|
| A1 | Camera | `offset_y` (`CAMCFG:5`, code `CAM:50`) | number, cm → шкала | 0.0 (code 0.0) | load; then every `apply()` writes `SocketOffset` (`CAM:640`) | set `cfg.offset_y`, call `apply()` (`CAM:628`), as Num 5 does (`CAM:2038-2042`) | Сдвиг камеры вбок | При нуле камера стоит строго за спиной героя, сдвиг вправо или влево даёт вид из-за плеча. |
| A2 | Camera | `offset_z` (`CAMCFG:6`, `CAM:51`) | number, cm → шкала | 75.0 (code 45.0; the owner's live file 80.0) | load; `apply()` (`CAM:640`) | `cfg.offset_z` + `apply()` | Высота камеры | Насколько выше героя висит камера. |
| A3 | Camera | `offset_x` (`CAMCFG:4`, `CAM:49`) | number, cm → шкала | 0.0 (code −175.0) | load; `apply()` (`CAM:640`); also the pickup reach (`CAM:618`) | `cfg.offset_x` + `apply()`. **Keep out of the hub or lock at 0:** a back shift in `SocketOffset` took the corpse prompt away; the back distance lives in the arm length (`CAM:603-610`) | Сдвиг камеры вперёд и назад | Двигает камеру ближе к спине героя или дальше от неё. |
| A4 | Camera | `arm_length` (`CAMCFG:7`, `CAM:52`) | number, cm → шкала; −1 = the game's own | 315.0 (code −1) | load; written into `TargetArmLength` only with `apply(true)` or while the wheel has not been used (`CAM:648-650`) | `cfg.arm_length`, `apply(true)`, `desired_zoom = cfg.arm_length` — the +/− keys' route (`CAM:2056-2057`) | Расстояние до героя | Расстояние, которое ставят клавиши «+» и «−» цифрового блока; колесо мыши приближает и отдаляет камеру как обычно. |
| A5 | Camera | `camera_pitch` (`CAMCFG:21`, `CAM:150`) | number, degrees → шкала | −2.0 (code 0.0) | load; `apply()` → `apply_camera_pitch` (`CAM:633`, `:584`); kept by the watch (`CAM:1214-1232`) | `cfg.camera_pitch` + `apply()` | Наклон взгляда | Наклоняет камеру вверх или вниз, не сдвигая её; ноль — как в игре без мода. |
| A6 | Camera | `zoom_min` (`CAMCFG:33`, `CAM:103`) | number, cm → шкала | 130.0 (code 60.0) | at camera capture (`CAM:1674`) and every 30 ms by the target keeper, written only on a mismatch (`CAM:1140`, loop `CAM:1567`) | set `cfg.zoom_min` — the keeper writes it within 30 ms | Ближе всего к герою | Самое близкое расстояние колеса мыши; ещё ближе камера переходит к виду от первого лица. |
| A7 | Camera | `zoom_max` (`CAMCFG:34`, `CAM:104`) | number, cm → шкала | 2125.0 (code 2000.0) | as A6 (`CAM:1675`, `:1141`) | set `cfg.zoom_max` — the keeper writes it | Дальше всего от героя | Самое дальнее расстояние, на которое колесо мыши отводит камеру. |
| A8 | Camera | `zoom_step_ratio` (code only `CAM:187`; saved by `write_config` `CAM:398`; NOT in `CAMCFG`, present in the owner's live file) | number → шкала; 0 = the old three bands | 0.15 (code) | every keeper pass (`CAM:1120-1125`) | set `cfg.zoom_step_ratio` — live | Шаг колеса вдали | Насколько крупнее становится каждый щелчок колеса, когда камера уже далеко; рядом с героем шаг остаётся мелким. |
| A9 | Camera | `own_arm_length` (`CAMCFG:43`, `CAM:227`) | bool → флажок | false | every keeper pass (`CAM:1475`) | set `cfg.own_arm_length` — live | Резкий зум | Включено — колесо переставляет камеру сразу; выключено — камера доезжает плавно. |
| A10 | Camera | `zoom_interp_speed` (`CAMCFG:37`, `CAM:222`) | number → шкала; ≤ 0 means «jump at once» in Unreal (`CAM:220-221`) | 9.0 (code 0.0001) | capture (`CAM:1677`) and keeper (`CAM:1139`) | set `cfg.zoom_interp_speed` — live; has effect only while A9 is off (`CAM:1472-1474`) | Плавность зума | Как быстро камера доезжает до нового расстояния после щелчка колеса. |
| A11 | Camera | `interact_reach_extra_cm` (code only `CAM:203`; saved `CAM:399`; NOT in `CAMCFG`, present in the owner's live file) | number, cm → шкала | 65.0 (code) | when the arm length moves by ≥ 5 cm (`CAM:611-626`, read `:619`) | set the key, call `apply()` (it clears the written mark, `CAM:630`) — the next zoom write recalculates | Дальность подбора | На каком расстоянии перед героем подбираются камни и растения. |
| A12 | Camera | `disable_collision_test` (`CAMCFG:14`, `CAM:251`) | bool → флажок | false (code true) | at camera capture only (`CAM:1753-1756`) | ON: `rescan()` (Ctrl+Num 0, `CAM:2165`) re-captures and writes it. OFF after ON: **restart needed** — the code never writes `bDoCollisionTest = true` back | Камера проходит сквозь стены | Включено — камера не прижимается к герою у стен и скал, но может заглянуть за стену. |
| A13 | Camera | `disable_camera_lag` (`CAMCFG:12`, `CAM:75`) | bool → флажок | true | at camera capture only (`CAM:1757-1763`) | as A12: ON by `rescan()`; OFF after ON — **restart needed** (no write-back of the lag flags) | Камера без запаздывания | Включено — камера держится за героем жёстко и не дрожит, когда герой стоит. |
| A14 | Camera | `step_position` (`CAMCFG:8`, `CAM:54`) | number, cm → шкала | 5.0 | captured into the key bindings at load (`CAM:2028-2035`) | **restart needed** (the step is a closure argument of `nudge`, `CAM:1865-1872`) | Шаг сдвига с клавиатуры | На сколько сдвигается камера одним нажатием 8, 2, 4, 6, 9 или 3 цифрового блока. |
| A15 | Camera | `step_arm` (`CAMCFG:9`, `CAM:55`) | number, cm → шкала | 10.0 | captured at load (`CAM:2167-2168`) | **restart needed** | Шаг расстояния с клавиатуры | На сколько меняется расстояние одним нажатием «+» или «−» цифрового блока. |
| A16 | Camera | `step_pitch` (`CAMCFG:22`, `CAM:153`) | number, degrees → шкала | 1.0 | captured at load (`CAM:2082-2083`, `:2099-2100`) | **restart needed** | Шаг наклона с клавиатуры | На сколько градусов меняется наклон одним нажатием 7 или 1 цифрового блока. |
| A17 | ModPackManager | `hud_scale` (`MPMCFG:84`, code `MPM:99`) | number, × → шкала; 0 = off | 1.25 (code 0) | load (`MPM:1105`); applied in the first `checks` ticks (`MPM:1204`) and on every birth of `W_SmoothHP_C` — that subscription exists only if the value was > 0 at load (`MPM:1267-1275`) | a new value > 0: set `cfg.hud_scale`, call `apply_hud_scale()` (`MPM:807`; it writes only on a mismatch, `MPM:832`). 0 ↔ > 0: **restart needed** (subscription at load; 0 returns early, `MPM:809`, without restoring ×1.0) | Размер HUD вверху экрана | Увеличивает блок здоровья, выносливости и запасов вверху экрана, не трогая остальной интерфейс. |

**Rows per mod (A):** KrinikConanCamera 16 · KrinikConanModPackManager 1 · all others 0.

## B. File keys that are NOT for the player (internal, diagnostic, build housekeeping) — 61 keys

Listed so the count is complete; no hub row proposed.

| Mod | Keys (file:line) | Count | Why not a player row |
|---|---|---|---|
| Camera | `preset_saved`, `preset_offset_x/y/z`, `preset_arm_length`, `preset_target_x/y/z`, `preset_pitch` (`CAMCFG:23-31`, `CAM:273-281`) | 9 | the SAVED pose, written by Num / (`CAM:2112-2126`), applied by Num 0 (`CAM:2128-2147`) — data, not a setting; in the hub it could be two buttons («Запомнить», «Вернуть»), not rows |
| Camera | `target_offset_x/y/z` (`CAMCFG:18-20`, `CAM:125-127`) | 3 | a duplicate of `offset_z` that the game fights every frame (`CAM:105-123`); Ctrl+5 zeroes it (`CAM:2087-2093`) |
| Camera | `reapply_enabled`, `reapply_interval_ms`, `prefer_per_frame` (`CAMCFG:10-11,13`) | 3 | the hold mechanism, chosen at load (`CAM:2817-2830`) |
| Camera | `set_pull_target`, `target_recheck_ms`, `try_source_table` (`CAMCFG:15-17`) | 3 | the pull-target fight with the game; `try_source_table` is a crash candidate (`CAM:87-91`) |
| Camera | `zoom_step`, `zoom_step_near`, `zoom_step_near_count`, `zoom_step_mid`, `zoom_step_far`, `zoom_step_far_count` (`CAMCFG:35,38-42`) | 6 | the wheel-step law; with A8 > 0 only `zoom_step_near` and the `zoom_step_mid > 0` gate are used (`CAM:1113-1131`) |
| Camera | `zoom_cap_own` (`CAMCFG:32`) | 1 | off by measurement (`CAM:253-257`) |
| Camera | `zoom_default` (`CAMCFG:36`, `CAM:194`) | 1 | **dead key:** written by `write_config` (`CAM:396`) but read nowhere (no `cfg.zoom_default` in `CAM`) |
| Camera | `rain_ortho_width` (`CAMCFG:44`) | 1 | rain capture probe, 0 = untouched (`CAM:228-229`) |
| Camera | `mute_foreign_camera` (`CAMCFG:45`) | 1 | the conflict switch against EAA's camera (`CAM:259-264`, read `:971`) |
| Camera | `force_component_name`, `logging_enabled` (`CAMCFG:46-47`) | 2 | diagnostics |
| ModPackManager | `modlist_path`, `gamelog_path`, `mode`, `class_path`, `text_field`, `lamp_via_modal`, `lamp_at_check`, `lamp_seconds`, `lamp_hide_buttons`, `viewport_z` (`MPMCFG:7-30`) | 10 | the «is my build alive» line and its lamp; `mode = "off"` (`MPMCFG:13`) |
| ModPackManager | `probe_at_check`, `survey_loaded`, `survey_limit`, `probe_report`, `probe_widget_prefix`, `probe_widget_report`, `probe_world_classes`, `probe_find_classes`, `probe_find_hints`, `probe_classes` (`MPMCFG:33-120`) | 10 | probes |
| ModPackManager | `hud_scale_class`, `hud_pivot_x`, `hud_pivot_y`, `hud_pin` (`MPMCFG:85-107`) | 4 | the pivot and the class of A17; a pivot change alone is not applied while the scale already matches (`MPM:832-835`) |
| ModPackManager | `hide_offline_modal`, `hide_method`, `hide_window_ms`, `hide_menu_elements` (`MPMCFG:127-134`) | 4 | menu housekeeping, the owner's orders of 09.09 and 2026-10-25 |
| ModPackManager | `checks`, `check_interval_ms`, `logging_enabled` (`MPMCFG:141-143`) | 3 | the start-up chain |

Camera 30 + ModPackManager 31 = 61 keys; with the 16 + 1 of table A every key of both files is counted (Camera 46 = the `write_config` order list
`CAM:377-404`; ModPackManager 32 keys in `MPMCFG`).

## C. Hard-coded constants that look like they SHOULD be tunable — candidates

All are Lua `local` constants or fields of a `local CFG` table: no file is read for them today. Values are the current code values; ranges are given only
where the code or the owner names one — the rest is the owner's decision. «Wish» marks a row the plan or the owner asks for that has NO variable in code.

| # | Mod · section | Constant (file:line) | Type → control | Value now | Read when | Apply without restart (on «Сохранить») | Label (RU) | «i» (RU) |
|---|---|---|---|---|---|---|---|---|
| C1 | UI · fps_counter | **wish — no variable.** The counter is attached on every HUD birth (`UI/krinik_fps_counter:89-103`) and updated every 250 ms (`:105-115`) unconditionally | bool → флажок | always on | — | add a flag; on save: `text:SetVisibility(1)` (Collapsed) / `3` (as at `:63`), and the loop body returns early when off | Счётчик кадров в углу экрана (the hub's existing label, `UI/krinik_mod_settings:26`) | Показывает в правом верхнем углу, сколько кадров в секунду рисует игра. |
| C2 | UI · fps_counter | `FONT_SIZE` (`UI/krinik_fps_counter:26`) | number, pt → шкала | 16 | once per HUD birth (`:52`) | `SetFont` on the live `text` with the new size (the same steps as `:51-56`) | Размер счётчика кадров | Размер цифр счётчика кадров. |
| C3 | UI · hud_blink | `FOOD_ZONE` (`UI/krinik_hud_blink:26`) | number, share → шкала | 0.10 («на 10%», the owner, `:4-5`) | every 250 ms tick (`:75`) | live — the next tick | С какого запаса еды и воды мигать | Когда еды или воды остаётся меньше этой доли, значок начинает тускло мигать; к нулю мигание набирает полную яркость. |
| C4 | UI · hud_blink | `WEIGHT_ZONE` (`UI/krinik_hud_blink:27`) | number, share → шкала | 0.90 («на 10% от макс веса») | every tick (`:84`) | live — the next tick | С какой ноши мигать весу | Когда ноша доходит до этой доли предела, значок веса начинает мигать. |
| C5 | UI · hud_blink | `DIM` (`UI/krinik_hud_blink:28`) | number, 0…1 → шкала | 0.25 ([AI], waits for the owner's eye — notes `KrinikConanUI.md` «Open») | at a brightness-step change (`:45`, `:49-63`) | reset `last = {}` (as the HUD birth does, `:102`) — the next tick replays every blink | Яркость первого мигания | Как ярко мигает значок в самом начале; у предела мигание всегда во всю силу. |
| C6 | UI · hud_blink | `SPEED` (`UI/krinik_hud_blink:29`) | number → шкала | 0.30 | at a step change (`:59`) | as C5. **Caution:** Hosav's own blink at the limit runs at 0.30 by a pak edit (`:8-9`, `:13-14`); changing ours alone gives two speeds | Скорость мигания | Как часто мигают значки еды, воды и веса. |
| C7 | UI · shout_fade | `FADE_S` (`UI/krinik_shout_fade:28`) | number, s → шкала | 0.20 («типа 200мс», the owner, `:4`) | every fade step (`:61`) | live — the next shout | Плавность появления криков | За сколько секунд крик врага на экране проявляется и гаснет. |
| C8 | UI · hud_outline | `OUTLINE_SIZE` (`UI/krinik_hud_outline:16`) | number, pt → шкала | 1 (the owner, 2026-10-26, `:15`) | once per HUD birth, two passes (`:44`, birth hook `:113-124`) | the next HUD birth (death, re-entry into the world); a live pass would have to clear `done` and reset only the outline | Обводка текста HUD | Толщина чёрной обводки цифр HUD; с ней цифры читаются на ярком небе и песке. |
| C9 | UI · hud_outline | `FONT_SCALE` (`UI/krinik_hud_outline:23`) | number, × → шкала | 1.1 (`:17-22`) | once per HUD birth (`:46`) — multiplies the CURRENT size | the next HUD birth only; a pass on a live HUD would multiply again (unless the base sizes are kept) | Крупность текста HUD | Насколько крупнее обычного написаны цифры HUD. |
| C10 | UI · pause_in_menu | `MENU_DILATION` (`UI/krinik_pause_in_menu:92`) | number → шкала; 1.0 = no slow-down | 0.03 (the owner's number, `:91`) | every 250 ms poll (`:606`, loop `:622`); written when it differs from the applied value (`:612`) | live — the next poll. **Range floor:** 0.0001 lost clicks in menus (bug 12, `:74-82`); 0.01 kept them alive (`:81`) | Замедление мира в меню | Пока открыты инвентарь, сундук или станция, мир почти стоит: голод, жажда и враги ждут героя. |
| C11 | UI · pause_in_menu | `ESC_DILATION` (`UI/krinik_pause_in_menu:93`) | number → шкала | 0.0001 (`:83-85`) | every poll (`:605`) | live — the next poll | Замедление мира в меню паузы | Пока открыто меню по Esc, мир стоит. |
| C12 | UI · pause_in_menu | `CRAFT_SPEEDUP` (`UI/krinik_pause_in_menu:382`) | bool → флажок | true (the owner 26.10, `:376-377`) | at every dilation change (`:384`, call `:615`) | live — the next menu open or close; the multiplier is read at an item START (`:378-381`), an item already in work keeps its pace | Крафт в меню без замедления | Пока мир в меню почти стоит, вещи, которые изготавливает герой, готовятся за обычное время. |
| C13 | Graphics · blood | `CFG.hold_s` (`GFX:47`) | number, s → шкала | 300 (plan 36 W28: «до 5 минут», «время настраивается ползунком в модах Krinik») | on every stain (`GFX:100`, `:103`, `:108`) | live for NEW stains; lying stains keep their lifetime. **Range floor:** `hold_s − fade_s` is a delay (`GFX:103`), so `hold_s ≥ fade_s` (3.0, `GFX:49`); the owner's ceiling is 5 minutes | Сколько лежит кровь на земле | Сколько пятна крови после боя остаются на земле, прежде чем исчезнуть. |
| C14 | Graphics · blood | `CFG.hold_cap` (`GFX:48`) | number → шкала | 200 ([AI], a GPU budget knob) | on every stain (`GFX:99`) | live | Пятен крови на земле, не больше | Сколько пятен крови лежит одновременно; самые старые исчезают первыми. |
| C15 | Archery | `CFG.aim_fov_deg` (`ARC:95`) | number, degrees → шкала | 75 (the owner, `ARC:93-94`) | on every aim FOV event (`ARC:742-743`) | live — the next aim | Обзор при прицеливании | Насколько приближается вид, когда герой целится из лука правой кнопкой мыши. |
| C16 | Archery | `CFG.ballistics` (`ARC:118`) | bool → флажок | true (W15, `ARC:113-117`) | on every arrow (`ARC:337`) | live — the next arrow | Полёт стрелы как в Oblivion | Чем сильнее натянута тетива, тем быстрее летит стрела; поправку на дугу берёт на себя стрелок. |
| C17 | Archery | `CFG.min_speed_share` (`ARC:120`) | number, 0…1 → шкала | 0.5 ([AI]; the owner's candidates 0.4 / 0.5 / 0.6, `ARC:116-117`) | on every arrow (`ARC:339`) | live | Скорость стрелы без натяжения | Как быстро летит стрела, выпущенная сразу, без натяжения тетивы. |
| C18 | Archery | `CFG.arrow_gravity` (`ARC:119`) | number → шкала | 0.55 (Oblivion Remastered value, `ARC:116`) | on every arrow (`ARC:350`, `:353`) | live | Тяжесть стрелы | Насколько круто стрела уходит вниз в полёте. |
| C19 | Archery | `CFG.no_break` (`ARC:57`) | bool → флажок | true («бесит», `ARC:29-30`) | on every arrow (`ARC:277`) | live | Стрелы не ломаются | Стрела не ломается при попадании и остаётся торчать в цели. |
| C20 | Archery | `CFG.mesh_scale` (`ARC:58`) | number, × → шкала | 3.0 («до x3», `ARC:30-31`) | on every arrow (`ARC:279`) | live | Размер стрелы | Во сколько раз стрела крупнее обычной, чтобы её было видно в полёте. |
| C21 | Archery | `CFG.trail_opacity` (`ARC:59`) | number, 0…1 → шкала | 0.35 | once per launch, on the first arrow (`ARC:268`, gate `:359`) — computed from the native value (`NATIVE_FADE_START × …`) | re-run `tune_templates` (clear `templates_done`, `ARC:144`); idempotent because it starts from the native constant | Заметность следа стрелы | Насколько ярко виден след за летящей стрелой. |
| C22 | Archery | `CFG.trail_width` (`ARC:60`) | number → шкала | 0.1 («сделай трассер 0.1») | as C21 (`ARC:260`) | as C21 | Толщина следа стрелы | Насколько широк след за летящей стрелой. |
| C23 | Archery | `CFG.glint_scale` (`ARC:112`) | number, × → шкала | 1.5 (`ARC:507-508`) | once per launch, on the first aim (`ARC:724`); multiplies the CURRENT template sizes (`ARC:524`) | **restart needed** («повтор умножил бы ещё раз», `ARC:509-510`) unless the native sizes are kept | Размер блеска полного натяжения | Насколько велик блеск на наконечнике, когда тетива натянута до конца. |
| C24 | Archery | `CFG.jump_shooting` (`ARC:903`) | bool → флажок | true (0.7.0, `ARC:898-902`) | once at load (`ARC:951`, hooks `:952-`) | **restart needed** to turn on; off needs a guard flag inside the handlers | Стрельба в прыжке | Герой стреляет из лука в прыжке, а прыжок посреди натяжения не сбивает выстрел. |
| C25 | Archery | `CFG.fp_shift_ms` (`ARC:89`) | number, ms → шкала | 500 (the owner, `ARC:87-88`) | on every camera shift (`ARC:584`) | live | Плавность прицеливания от первого лица | За сколько камера от первого лица переходит к прицелу и обратно. |
| C26 | Archery | `CFG.tip_in_cm` (`ARC:110`) | number, cm → шкала | −15 («вкус — глаз владельца», `ARC:107-109`) | on every stuck arrow (`ARC:450`) | live | Глубина застрявшей стрелы | Насколько глубоко стрела уходит в тело после попадания. |
| C27 | Gameplay | `CM_PER_POINT` (`GPL:48`) | number, cm/s → шкала | 3 (the owner 13.09, `GPL:48`) | in the speed formulas (`GPL:56`, `:65`, `:66`) — written only when Agility changes (`GPL:233`), 1 s loop (`GPL:252`); the load line says «Правки — только перезапуском игры» (`GPL:325`) | set the value and clear the cached Agility (`current_n`, `GPL:233`) — the next 1 s tick rewrites speed and jump | Прибавка скорости за Проворство | На сколько быстрее бегает и выше прыгает герой за каждое очко Проворства. |
| C28–C30 | UI (future) | **wish — no code.** Plan 36 W23: three vignette intensities (hunger · thirst · low health), «Крайнее левое положение ползунков - ВЫКЛ полный» | number → шкала, the far left = off | — | — | recon first: which widget or material draws each vignette and what drives it (W23) | Виньетка голода · Виньетка жажды · Виньетка ранения | (for hunger; thirst and health swap the noun) Насколько сильно мигают края экрана, когда герою не хватает еды; крайнее левое положение шкалы выключает мигание. |

**Rows per mod (C):** KrinikConanUI 12 (C1–C12; C1 is a wish without a variable) + 3 vignette wishes without code (C28–C30) · KrinikConanGraphics 2 ·
KrinikConanArchery 12 · KrinikConanGameplay 1 · KrinikConanModPackManager 0 · KrinikConanCamera 0 (its tunables are already in the file, table A).

**Looked at and NOT proposed** (so nobody re-checks them): the temperature thresholds `TEMP_HOT/COLD/HYST` (`UI/krinik_hud_outline:137`) mirror the game's
own icon steps (`:128-131`) — tuning them would split the colour from the icon; the temperature colours (`:138-142`) wait for the owner's eye, not for a
row; the minimap plate (`UI/krinik_minimap_coords:19-27`) is the owner's picked look of 2026-10-31 09:54–10:25, built once per map birth (`:38` returns
after the first move); the feedback plate (`UI/krinik_feedback:25-26`) and `krinik_ui_fixes` constants are layout fixes; the blood material window
`start`/`rise` (`GFX:51-52`) and the arrow-blood decal (`GFX:140-146`) are measured numbers, not taste; Archery `lift_k`, `probe_cm`, `min_aim_cm`,
`max_from_cam_cm`, `arrow_len_cm`, `into_body_*`, `fp_*_offset`, `fp_hip_*`, `release_*`, `keep_aim`, `hold_aim_on_redraw`, `drop_grav_curve`, `log_shots`,
`check_landing`, `summary_s` (`ARC:50-129`) are measurements or switches of fixes; Gameplay `BASE_RUN/SPRINT/JUMP`, `ATHLETICISM` (`GPL:49-52`) are game
facts. Section switches with no variable (arrow blood `GFX:197-199`, shout fade, minimap plate, temperature colour) could become «on/off» rows later —
none exists in code.

## D. Existing persistence — what is saved today, where, and when it is read

| Mod | File (game path) | Read | Written | Notes |
|---|---|---|---|---|
| KrinikConanCamera | `ue4ss/Mods/KrinikConanCamera/config.lua` (beside `Scripts/`, `CAM:43-44`) | once at load (`CAM:1875`); the file wins over code, every overridden key is printed (`CAM:330-362`) | BY THE MOD, the whole `cfg`, 1.2 s after the last numpad change (`CAM:417-428`, writer `:368-415`) | a key missing from the `order` list silently vanishes from the file (`CAM:381-385`); `zoom_default` is saved but never read. The owner's live file lives in the GAME folder and differs from the pack's (offset_z 80; it has `zoom_step_ratio` and `interact_reach_extra_cm`) — notes `KrinikConanCamera.md` «The owner's live config» |
| KrinikConanCamera | `ue4ss/Mods/KrinikConanCamera/agent-cmd.txt` (`CAM:3132`) | polled once a second (`CAM:3186-3205`) | by the agent (stand channel) | `key = value` lines, typed by the current value, then `apply()` (`CAM:3135-3184`) — **a working live-apply route already**; deliberately NOT `config.lua` to avoid a «mod writes — sees — re-applies» loop (`CAM:3123-3125`). It does not schedule an autosave: the values reach `config.lua` only with the next numpad save |
| KrinikConanCamera | `ue4ss/Mods/KrinikConanCamera/ConanCameraControl/config.lua` | never (a nested legacy copy; UE4SS loads `Mods/<mod>/Scripts/main.lua`) | — | a stale second `config.lua` with other numbers (offset_x −100, zoom 30…1000) — a trap for any store that searches by file name |
| KrinikConanModPackManager | `ue4ss/Mods/KrinikConanModPackManager/config.lua` (`MPM:39-40`) | once at load (`MPM:1105`, `load_config` `:158-171`); takes only keys present in `defaults` (`MPMCFG:3-5`) | never («Мод только читает этот файл и никогда его не переписывает», `MPMCFG:1`) | the owner's live copy in the game folder is byte-equal to the pack's today (diff 2026-10-31 20:2x) |
| KrinikConanModPackManager | `probe-report.txt`, `widget-report.txt` (`MPM:281-284`, `:455-458`) | — | probe output | diagnostics, not settings |
| KrinikConanArchery | `ue4ss/Mods/KrinikConanArchery/test_rmb.txt` (`ARC:498`) | on a FOV reset event (`ARC:500-505`) | by the agent | a stand stand-in for a held RMB, not a setting |
| KrinikConanUI, KrinikConanGraphics, KrinikConanGameplay | — | — | — | no settings file; every value is a code constant |
| The hub window (KrinikConanUI kit) | — | — | — | `Chk_KrinikFps` toggles are only logged (`UI/krinik_mod_settings:89-103`); no store (notes `KrinikConanUI.md` «Open») |

**A cross-mod channel that exists but is unused.** Our UE4SS build has `ModRef:SetSharedVariable` / `ModRef:GetSharedVariable` (used by the bundled
`ue4ss/Mods/shared/UEHelpers/UEHelpers.lua:18,23`; the name is in `UE4SS.dll`); none of our mods calls it directly (ModPackManager only `require`s
UEHelpers, `MPM:273-276`, which uses it inside for its own cache). `[AI]` Each UE4SS mod runs in its own Lua state —
KrinikConanUI's sections share `_G` among themselves (`UI/krinik_hud_outline:182-191` uses `_G.__krinik_temp_*`), so the hub (a KrinikConanUI
section) reaches the UI sections by a direct call, but Camera, Graphics, Archery, Gameplay and ModPackManager only through a file or a shared variable.
`[AI]` Which value types `SetSharedVariable` carries in this build (UEHelpers stores a UObject) is unchecked — a one-line probe decides.

## E. The cleanest shared store (proposal, `[AI]`)

1. **One file, outside every mod folder:** `ConanSandbox/Saved/KrinikSettings.lua` (a `return { camera = {…}, graphics = {…}, … }` table, the
   camera's own `dofile` pattern `CAM:321-366`). Redeploys recreate mod folders (the owner's configs had to be carried over at both renames — notes
   `KrinikConanCamera.md`, `KrinikConanModPackManager.md`); `Saved/` survives them. Written only by the hub (KrinikConanUI) on «Сохранить».
2. **Every mod reads it once at load** — today only Camera (`CAM:1875`) and ModPackManager (`MPM:1105`) read anything, both at load; the others
   start from code constants. Missing keys fall back to the code value, as both loaders do now.
3. **Live apply without polling:** on «Сохранить» the hub bumps a version (`SetSharedVariable("KrinikSettingsVersion", n)` if numbers pass; else the
   file is re-read at each mod's own rare event). Each mod compares the version at a moment it already runs: Camera — its 30 ms keeper
   (`CAM:1567`); Graphics — per stain (`GFX:91`); Archery — per arrow / per aim; Gameplay — its 1 s tick (`GPL:252`); ModPackManager — HUD birth
   (`MPM:1268`); KrinikConanUI sections — a direct call from the hub (same Lua state). No new timer (criterion 6 of plan 38).
4. **Camera keeps `config.lua` for the numpad:** on a version change it merges the store's camera keys into `cfg` and calls `apply()` — the route
   `agent-cmd.txt` already proves (`CAM:3135-3184`) — then its own autosave writes `config.lua` consistently; the hub must not write `config.lua` directly
   (the mod rewrites the whole file from memory, `CAM:405-412`).
5. **Restart-only rows are marked in the hub** (A12/A13 off, A14–A16, A17 0 ↔ > 0, C23, C24 on): the «i» or a note says «после перезапуска игры».
