# KUMM — Current Status

> This file is read by the AI agent before every task. Update it on every significant change of state.
> It is the PRIMARY handoff between sessions: a new agent session starts with empty context and must be
> able to get productive from this file alone. Write accordingly — concrete, with file paths and commands.
> 🧠 Prime thinking principle — `PHILOSOPHY.md` (SIMPLICITY: KISS + Occam). Read your working framework
> in `AGENT_GUIDE.md`.
>
> ⚠️ **STATUS is a SUMMARY of NOW, not a chronicle.** A status file that only ever grows turns into
> the project's history book, and the agent that came for a quick "where are we" drowns in it
> (field: a 2 300-line STATUS — "an abyss, not a summary"). The rules that keep it a summary:
>
> - **Every line passes two tests:** *"if I remove this line, will the next agent make a mistake?"*
>   and *"does a newcomer still read the whole file in one sitting?"* Soft target: **~200 lines**
>   (one-two screens of substance) — the guard is a warning, not a wall, but crossing it means a
>   trim is overdue.
> - **Closed work is MOVED OUT, not accumulated:** when a phase/session's entry is no longer "now",
>   move it VERBATIM into `PROJECT_HISTORY.md` (the chronicle — that is what it is for).
>   `/end-chat-soft` carries a "bonsai trim" step for exactly this (`/pause` stays ceremony-free by design).
> - **Leave the file the way you'd want to find it:** fresh summary of what works, what's in
>   progress, what's next, the pitfalls, and WHERE TO LOOK for the details (plans, bugs, history) —
>   pointers, not retellings.

---

## What's done (the short tail — older entries live in PROJECT_HISTORY.md)

> 07–08.10 и Medieval Dynasty до паузы; Сварог 09.10 день и небо до 10.10 02:03 — летопись, запись 2026-10-10 03:38; сессия 10.10 с 14:37 — запись 2026-10-10 16:31. Сварог: вечер 10.10 (18:46–21:48) и карта потока эпика 19 — летопись, запись 2026-10-11 00:46; чат с 2026-10-10 23:42 — там же.
---

## Where we are now

> 🎯 **Сборка Конана 3.0.1 — главное с 2026-10-26 ≈08:30, все прочие игры не в приоритете.** `[OWNER]` «все игры пока не в приоритере, мы
> работаем дат сборкой конана» · «она 1_ должна работать стабильно 2_ моды не должны конфликтовать, должны быть рабочими 3_ не должно быть
> явных просадок производительности из-за модов» · 2026-10-26. Порядок работ — «Where to continue», пункт 0.
>
> **Svarog's Dream — главное до 2026-10-26, с 2026-10-09** (`[OWNER]` «забей на Medieval Dynasty … мы работаем дальше над Сварогом» · 2026-10-09 ≈13:25;
> масштаб: 16:9 на 720p, 1080p, 2K, 4K — `MASTER_PLAN.md`). Medieval Dynasty — на паузе, абзац ниже — для возврата.
>
> **Medieval Dynasty (на паузе)** — пак `D:/work/ai_sandbox/MedievalDynasty`, эпик 15 (`plans/15_…`, фаза 0 — `plans/16_…`),
> баг 29 (HDR) открыт; чек-лист возврата — летопись, записи 2026-10-09 19:41 и 2026-10-10 03:38.
>
> **Svarog's Dream** — досье `games/SvarogsDream/README.md`, беклог `plans/18_svarog_backlog_checklist.md`. Правила прогона — `HOUSE_RULES.md`
> §5 «Прогон Сварога»: с 2026-10-18 сейвы в распоряжении агента (владелец не играет на прохождение, интервью #022, Q5), после `h.sh kill` —
> `bash tools/reg-snap.sh restore`; читы пульта — только внутри прогона, с плашкой (Q6); время не останавливать (память
> `svarog-no-timescale-zero`); HDR, если выключал для записи, — `powershell -File tools/hdr.ps1 on`.
>
> **Mafia II** — на паузе, досье `games/Mafia2/README.md` (раздел «Дальше»); сюжет агенту не начинать.
>
> **Конан 2.2.3** — досье `games/ConanExiles/README.md`. Palworld — в ежедневном пользовании, правок не ждёт.
> **Oblivion Remastered запаркован до патча** — не ходить туда, пока владелец не скажет.

The engine works and the owner uses it daily for Palworld. It checks its pure core (the first test since 2026-09-08, four since 2026-10-14):
`node test-parse-archive.mjs`, `test-archive-roundtrip.mjs`, `test-pick-card.mjs`, `test-help-commands.mjs` (exit 0 = green), and the game
half runs on a fake pack — `node tools/fixture-pack.mjs` (`-ListMods`, `-Deploy -DryRun`, a real `-Deploy` and `-Verify`, paks after `-Only`:
20 checks since 2026-10-15, all 20 passed on 2026-10-16). Not covered yet: the live Nexus path (Chrome) — Phase 1 in `MASTER_PLAN.md`.

| Phase | Status | What's there |
|-------|--------|--------------|
| Phase 0 — the two halves | ✅ done | v0.1.0 in daily use |
| Phase 1 — trustworthy unattended | 🟡 in progress | 2026-10-14: four regression tests of the pure core + launch guard + fixture stand; 2026-10-15: the stand deploys and runs `-Verify` (20 checks, bug 46 DONE); left — Engine.ini warning |
| Phase 2 — the second game | 🟢 **доказана на Конане** | движок принял Conan Exiles Enhanced **без единой правки**: слаг `conanexilesenhanced` из манифеста, `game_id` со страницы. Oblivion Remastered остаётся подготовленным (манифест на 168 модов), ждёт патча |
| Phase 3 — compatibility | 🔲 todo | источник конфликтов найден: `UnrealPak -List` из Dev Kit читает любой пак с Oodle (`researches/conan-devkit/`); работа — фаза 3 эпика `plans/06` |
| Phase 4 — optimization presets | 🔲 todo | |

## 🤖 Autonomous backlog pool (no human / no special hardware needed)

> Tasks the agent can do FULLY autonomously: write code → build → test on the harness → fix → commit,
> without the human and without resources only the human can provide. The loop skills
> (`/autoloop`, `/dayloop`, `/nightloop`) grind this pool.

- Сделанные пункты пула (запуск-гард, круговой ход имён архивов, кейсы `pickCard`, команда `help`, учебный пак на 20 проверок) — летопись,
  записи 2026-10-14 23:22 и 2026-10-16 23:39.
- [ ] **Warn when a mod overrides `Engine.ini` at runtime** — обе болезни 21.08 были невидимы движку:
      деплой сверил каждый файл и всё равно отгрузил сборку, чью графику Lua-мод переписывает в мире.
      Дешёвый первый срез не требует запущенной игры: просканировать исходники модов на
      `[SystemSettings]` и присваивания `r.*` и доложить, какие из них сталкиваются с `Engine.ini` пака.
      Доводы из практики (Palworld `r.ViewDistanceScale` в четырёх местах; Конан — соперник сама игра) — летопись,
      запись 2026-10-06 23:38, раздел «Доводы к пункту Engine.ini».

---

## ❓ Awaiting human review (interviews / homework)

> Decisions the agent must not make alone (brand/UX/architecture), or actions only the human can do
> (test on real hardware, external accounts). Filed in `interviews/` and `homeworks/`.

- 🅿️ **Стрельба из лука «по-обливионски» — в дальнем ящике по слову владельца 12.09.** Не поднимать, пока он
      не скажет. Разведка — `researches/conan-archery/README.md`, запись в досье Конана.
- 🧹 Уборка дисков 2026-10-25 — «решать вам» отчётов `C:\REVISIONS\…_ИТОГ.md`, `D:\REVISIONS\…_ИТОГ.md` на владельце (летопись, 2026-10-25 22:15).
- 🔴 **НЕ запускать `Clear-Quarantine.ps1 -Stamp 2026-08-17_2335 -Execute`**: в карантине единственный
      экземпляр сохранения Elden Ring и личное видео `ref.mp4`.
- 🗂️ **Старые вопросы к владельцу** (уборка 17.08 — зловред, RTSS, iTunes, карантин; Palworld `LoadingRange` 25600 — на что вернуть;
      Oblivion — строки мод-листа и решейды; строка «установка не из Steam» и правило обезличивания) — летопись, запись 2026-10-12 19:22.
- 🧰 Anything needing a real Nexus login, a real game install, or the owner's own mod pack is his to
      run — the agent can build the fixture path but cannot verify the live path alone.

---

## Where to continue next session

> A concrete checklist so the next session (empty context) can start immediately: which files, which
> commands, what to verify first.

> **ПОРЯДОК НОВОГО ЧАТА** (`[OWNER]` «работай автономно 2 часа затем передача дел в новый чат» · 2026-10-26 ≈17:40). Ход 26.10 до 15:52 и
> прежний пункт 0 — летопись, запись 2026-10-26 19:38. Правила: `HOUSE_RULES.md` §1 — кино «выключено» действует до обратного слова; объём работы —
> в часах; правки чужих модов — нативно (KRINIK MODIFIED, `modpack.json` → `krinikModified`, таблицы `ConanExiles/_config/localization/asset-strings/`;
> приборы `dbl:`/`flt:`/`rawf:`/`lit:`/`prop:` — `HOUSE_RULES.md` §6, строка «Байткод модов Конана»). После каждого выхода из игры — эталон настроек:
> `python -I -X utf8 _config/deploy-config.py GameUserSettings.ini` (иначе игра оставит разрешение прогона).
> 0. **Сборка Конана 3.0.1 к релизу 1.0.0 — план 35 (`plans/35_conan_build_turnkey_quality.md`).** Решения владельца 26.10 вечером (план 35: Г5,
>    Г7, Г10–Г12, Б3, Б4, Б7): версия 1.0.0; архив — тома ≤ 700 МБ (8 паков больше 700 МБ → многотомный zip 7-Zip `-tzip -mx0 -v700m`, Г10); README
>    для PlayGround — PDF на «выцветшей старинной бумаге», стр. 1–2 на витрину, в исправлениях благодарность Taurin78 (Г11); крафт в инвентаре
>    на паузе — ускорить (Г12); хаб — без мерцаний и прыжков (Б4). Порядок владельца: техдолги → перевод → прогон по миру → тома и README.
>    **Сделано 26.10 16:54–19:40 и проверено в игре** (кейсы `testcases/TC_conan_build_stability_compat_perf_2026-10-26.md`): подсказки школ
>    магии EoT по-русски (T2b); миникарта у угла, координаты целы 4K и 1080p (M2); кнопка Hosav «Настройки интерфейса» только на «Снаряжении»,
>    по событию, на линии «Закрыть» (H9); «Настройка рыбалки»; меню славы и рейтинг доспехов EAA, «Настройки миникарты», «Донат» — без наложений
>    (bugs/64 п. 22, 24, 25), «Сохранить/Отмена» в окнах миникарты и Damage Meter (U7); журнал всех наших Lua-модов (LM1); долгий прогон 59 мин —
>    17 облётов и 17 хабов, падений 0 (S1e; боя не было). Отчёт — `testcases/reports/2026-10-26_conan-evening-locres-minimap-hub-windows-longrun.md`.
>    **Дальше, по порядку (часы):** (1) Ragnar's New Factions: `RNF_Shared_WeightedSpawns` ссылается на 4 плавильщиков `RNF_NPC_WadaiFlesheaters_Smelter1–4`,
>    чьих таблиц спавна нет (ошибка автора): убрать ряды или добавить таблицы, KRINIK MODIFIED — ≈ 1 ч;
>    (2) Г12 крафт: один настоящий крафт «Бечевки» при открытом хабе (пульт крафт не ставит — кейс P1), замер, включить `CRAFT_SPEEDUP` — ≈ 1 ч;
>    (3) Б4: та же съёмка хаба на игре без паков (эталон), эмблема-«поздняк» (bugs/64 п. 26), деление по пакам — ≈ 2–3 ч; Б7: кнопку рыбалки
>    к Hosav и в её вид (вставляет `BPC_EFT_Tuning.Graft` в `ButtonContainerRight`) — ≈ 2 ч; (4) bugs/64 п. 21 ползунок Damage Meter, п. 23 карточки
>    классов EAA (текст нарисован в текстурах) — ≈ 2–4 ч; (5) цена модов q4 A-B-A-B — ≈ 1–2 ч; (6) архив на чистой игре и тома — ≈ 1–2 ч;
>    (7) README-PDF — после 1–6. Приборам: `close-game.ps1` и `long-run.sh` пусть сами закрывают `CrashReportClient` после падения
>    (`[OWNER]` «убирай за собой окна креш репортов, пожалуйста» · 2026-10-26 ≈19:39; правило — `HOUSE_RULES.md` §1) — 0,3 ч. Ждут владельца: интервью #025 (частота засад; прибор `rawf:` готов), «table» на карточке рыбы.
> 1. **Конан, главный поток — очередь замеров** (`[OWNER]` «Замеры ручек подгрузки … Ветка появления NPC … Эталон на чистой игре без паков модов» ·
>    «можно начинать их грузить дальше по дистанции, но больше кадров выделять. У меня много врам и рам»): пачки `ConanExiles/_config/bench-batches/`
>    (README — порядок до/после каждой): q1 (на лету) сделана 02:18 — бюджет подгрузки и пул текстур 8 ГБ в шуме, «без ткани» повтором
>    q3b опровергнут (40 против 36); шум облёта 36–52 рывка — решают только пары A-B-A-B (EXP-0335). Дальше q2 `s.AsyncPostLoadEnabled`,
>    q3 `p.Chaos.EnableAsyncInitBody`, q4 без паков модов. Разбор — `researches/conan-main-thread/README.md` §3–4.
> 2. **План 34 — переписать наши моды Конана** (`plans/34_conan_mods_cpu_respect.md`): по правилам Unliminium — события вместо опроса, общий
>    реестр `KrinikCore`, бюджет на кадр, самозамер; цена модов сейчас ≈ 0,4 мс, перехваты UE4SS ≈ 0. Выбор пути (шаг 3) — владельцу с цифрами.
> 3. Открыто с 25.10: обводка HUD резкая на 2 пикселя (`KrinikHudOutline`, не начато); окно Lore & Loot (и AMR, Emberlight, Pickup+, Horti) голым
>    `ActivateModule` не открывается — открыть их путём игрока; совместимость `ConanExiles/docs/17` (недостающие пакеты, Ancient Civ vs TDI, предмет
>    51420); масштаб DLSS 0,58 — показать владельцу.
> 4. **KAGO** (его агенту, не нам): `bugs/154` п.1 — `disarm()` не убирает расписку; перепроверка ⚖️ на драйвере 621.01 по рецепту STATUS KAGO.
>
> Сборка Конана 3.0.1 — 64 пака + 8 Lua-модов, всё монтируется (план 33; прежний «PARKED-ПОРЯДОК» — летопись, 2026-10-25 22:15).
> **Сварог ждёт за Конаном** (по порядку возврата): 00000 — волна багов владельца 2026-10-18 (план 32, баги 55–62, кнопка ⇅; летопись 2026-10-26 19:38);
> 0000–000 — пункты 17.10 (J4, J5, G1, поп-апы, волосы, хранилища, советы, кадры, HUD C3/C4/K1; летопись 2026-10-25 12:07); 00 — план 27
> (`plans/27_svarog_random_hero_traits.md`: починки 8–10 `AuthorBugs.cs` в бою, кейс R8; окно «Новый герой», «Защита Велеса», Staggered, атрибут > 95 → 90).
>
> Сварог: бюджет процессора 1 мс (замеры 17.10), пункты 0/2/3 от 17.10 и точка сверки сейвов — летопись, запись 2026-10-25 18:30 (дословно); правило бюджета — `MASTER_PLAN.md`.
>
> **Порядок прогона Сварога** (точка сейвов, запуск, откат, где живут моды, виртуальный экран) — `HOUSE_RULES.md` → §5, строка «Прогон Сварога».
>
> **Решено для MVP** — прыжок и падение: идея 17 (`[OWNER]` «давай примем для MVP, чтобы с чего-то начать» · 2026-10-14); ждут владельца — летопись 15:19.

## Open bugs

Файлов без метки DONE — 29 (2026-10-18 13:45):

- 🔴 `bugs/64_conan_mod_ui_wave_overlaps_untranslated.md` — интерфейс модов сборки Конана 3.0.1, 26 пунктов: открыты 4, 5, 6, 12, 13 (частично),
  15–18, 21 (ползунок Damage Meter), 23 (карточки классов EAA — текст в текстурах), 26 (поздняя эмблема в хабе); закрыты кадром 2, 3, 7, 7b, 8–11,
  14, 16, 19, 20, 22, 24, 25 — порядок работ в плане 35.
- 🔴 Баги владельца 55–62 (2026-10-18 13:35–13:43, волна за 5 минут игры) — `bugs/55_…` – `bugs/62_…`; порядок и план 32 — пункт 00000 выше.

- 🔧 `bugs/54_svarog_second_set_red_after_first_swap.md` — красная ячейка второго набора после первой смены: воспроизведено и правка подтверждена
  2026-10-18 (B1–B3 на видео, B0 и B4 — пультом и кадром; `PatchStaleCooldown`); владелец путь «вся панель» не помнит (интервью #024, Q1 — «1 А»):
  DONE 2026-10-25, если за неделю его игры красное не вернётся.

- 🔧 `bugs/51_svarog_water_reflection_flips_with_camera.md` — вода у Бары: причина найдена пультом камеры 2026-10-17 (все плоскости делили одну
  камеру отражения Lux по имени `_WaterPlane`), починено; оранжевые полосы под мостками убраны; ждёт глаза владельца.
- 🔧 `bugs/50_svarog_camera_sways_with_hero_breathing.md` — камера качалась с дыханием героя; починено и доказано замером (размах 0,0419 → 0),
  выложено; ждёт глаза владельца.
- 🔧 `bugs/49_svarog_jump_through_hidden_house_wall.md` — прыжок сквозь стены домов (у стен нет коллайдеров вовсе); правка `PhantomWall`
  выложена 2026-10-16, владелец: «работает»; до DONE — W3, W5.

- 🔧 `bugs/52_gta_sa_gang_war_pickups_vanish.md` — вещи в войне банд исчезали (пул пикапов полон); таймеры действуют, заплатка 1.1 ждёт запуска — п. 0а.

- 🔧 `bugs/48_gta_sa_crash_parked_car_generator.md` — GTA SA падала на пуле машин 400 (наша правка 03.10); пулы и дальности переставлены по
  слову владельца, в игре не проверено.

- 🔧 `bugs/47_svarog_mvp_jumps_bugs.md` — прыжок: по WASD (п. 1) и вверх по склону владельца (п. 3) — прогнано 2026-10-17, pass (B2, B3d); бег по
  клику — B4b pass; B1 (тележка, п. 4) — не найдена; скала поднимает на 2,7 м — интервью 018; п. 2 (не соскальзывает с края вниз) — не начат.

- 🔧 `bugs/44_svarog_grass_loses_volume_top_down.md` — трава сверху: починено 2026-10-17 (травинки держат наклон, как у камеры под 55°;
  настройка `Terrain.GrassTopDown`), «до/после» с одного места; ждёт глаза владельца.
- 🔧 `bugs/45_svarog_hot_reload_leaks_portraits_game_crash.md` — горячие выкладки копили портреты; 2026-10-17 вечером несколько выкладок подряд:
  через 3 с +373 МБ (выше предела кейса M1), через 1,5 мин — ниже исходной; утечки не видно, критерий M1 — пересмотреть, нужен второй вечер.

- 🔧 `bugs/40_svarog_mountain_reflection_pops_with_camera_angle.md` — горы в воде пропадали при повороте камеры; владелец решил
  (`[OWNER]` «НЕТ, ЭТО НЕПРИЕМЛЕМО!!! Ну НЕЛЬЗЯ НАМ ГРУЗИТЬ ГЛАВНЫЙ ПОТОК» · 2026-10-13 — в баге, строка 3): главный
  поток не грузить — отражение экраном (SSPR) включено по умолчанию, камера Lux снимает только небо; ждёт проверки в игре и его глаза.
- 🔧 `bugs/41_svarog_far_trees_lose_haze_when_game_recreates_materials.md` — дымка на дальних деревьях слетала, когда игра пересоздаёт
  материалы; сторож своих материалов с одним пересканом, починено 22:02; что пересоздаёт — не найдено; ждёт глаза владельца за сеанс.
- 🔴 `bugs/38_svarog_traveler_runs_lake_bottom_and_vanishes.md` — путник бежит по дну водоёма; исчезание починено 2026-10-12.
- 🔴 `bugs/29_md_hdr_menu_washed_after_auto_hdr.md` — HDR: Auto HDR выключен для exe, мир принят, инвентарь (UI) пересвечен.
- 🔴 `bugs/28_svarog_code_strings_outside_all_dictionaries.md` — строки кода игры вне всех словарей (класс бага 27): 1106 → 65 → 192 → **79**
  (2026-10-11 00:13: подстановки переведены, остались склейки; пять близнецов в правилах XUnity починены); C7 перевода богов в игре не прогнан.
- 🔧 `bugs/15_svarog_whitish_world_against_low_sun.md` — белёсость земли против солнца: причина (блик стандартного шейдера)
  подтверждена, свой матовый шейдер в моде 2.1.0, прогон pass, 0.6 принято владельцем («да, 0.6 хорошо, оставляем» ·
  ≈10:22); до DONE — увидеть подмену земли при ходьбе.
- 🔧 `bugs/14_pickcard_exact_name_pins_old_file.md` (починено 2026-10-15, ждёт живого `kumm check`) — `kumm check` держится за старый файл, если автор когда-то
  вписал версию в имя файла (Bosses My New Besties, 02.10). Баг самого движка; план починки и кейс — в документе.
- 🔧 `bugs/06_deploy_only_truncates_modlist.md` (починено 2026-10-15 на стенде, ждёт живой раскатки `-Only`) — `-Only` молча обрезает `modlist.txt` и выключает остальные
  моды. Баг самого движка (`Deploy-ModPack.ps1`), воспроизводится каждый раз.
- 🟡 `bugs/07_conan_probe_kills_ue4ss_lua_layer.md` — симптом снят выключением мода, причина не найдена.
- 🔧 `bugs/08_conan_config_overrides_code.md` — починено, ждёт подтверждения владельцем.
- 🔬 `bugs/04_conan_camera_microjitter.md`, `bugs/05_conan_loadasset_delayed_abort.md` — разведка, без починки.

## KAIF — отправка и тикеты

KAIF 2.9 с 2026-10-16 (с 2.7 одним шагом; отчёт `reports/KAIF_UPDATES/KUMM_KAIF_2.9_UPDATE_REPORT.md`): факты проекта — в
`HOUSE_RULES.md`, хуки KAIF подключены в `.claude/settings.json` (клиент читает их при старте сессии). Отправка в KAIF — без спроса
владельца (`AGENT_GUIDE.md` → Notes from the human, его слово 18.09). Тикеты #72, #73, #78–#82 закрыты истоком в 2.8 (`bugs/KAIF/03–08_DONE_*`);
открыты #140 (`bugs/KAIF/09_*`, исток перенёс его в 2.10) и три тикета этого обновления — #150–#152 (`bugs/KAIF/10–12_*`).
