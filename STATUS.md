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

> **День 12.09.2026 — русский интерфейс мода Hosav и смерть бага 10.** Перевод HUD и панели
> настроек Hosav ЖИВЁТ в игре (622 ключа в 40 виджетах) — дорога оказалась штатной целью
> локализации движка россыпью, мимо пака, мод-загрузчика и UE4SS: `ConanExiles/_config/localization/`
> + `deploy-localization.py`, разбор `researches/conan-devkit/README.md` §7.3–7.4. Попутно починен
> `ftext_extract.py` (пропускал `FText` из байткода Blueprint: 794 ключа → 939), приняты интервью
> #002 «Добавление №1» и #003. **Баг 10 закрыт** одной строкой в `VTableLayout.ini` — причину
> назвал сопровождающий UE4SS в нашем тикете [#1421](https://github.com/UE4SS-RE/RE-UE4SS/issues/1421),
> решение отдано обратно наверх; Lua-слой сборки снова живой целиком. Разведка по «луку
> по-обливионски» сделана и отложена владельцем в дальний ящик. Ночная запись 12.09 и подробности
> двух закрытых пунктов перенесены в `PROJECT_HISTORY.md` дословно.

> v0.1.0, развёртывание KAIF 2.2 и обновление до **2.5** (2026-09-05, отчёт
> `reports/KAIF_UPDATES/KUMM_KAIF_2.5_UPDATE_REPORT.md`), сессии Palworld 15.08 и подготовка Oblivion —
> в `PROJECT_HISTORY.md`.

---

## Where we are now

> 🎯 **Активная игра сейчас — Conan Exiles Enhanced 2.1.1** (пак `D:\work\ai_sandbox\ConanExiles`,
> подробности — раздел «Третья игра» ниже). Palworld — в ежедневном пользовании владельца, правок
> не ждёт. **Oblivion Remastered запаркован до патча — игры на диске нет**, не ходить туда и не
> предлагать по ней работу, пока владелец не скажет.

The engine works and the owner uses it daily for Palworld. What it does NOT have is any way to check
itself: there is no test of any kind, and both halves talk to the outside world (Nexus through a
browser, game folders on disk), so a fresh session cannot currently prove a change is safe without the
owner's eyes. That is the whole of the current focus — Phase 1 in `MASTER_PLAN.md`.

| Phase | Status | What's there |
|-------|--------|--------------|
| Phase 0 — the two halves | ✅ done | v0.1.0 in daily use |
| Phase 1 — trustworthy unattended | 🔲 next | no tests exist yet; the deterministic core is the target |
| Phase 2 — the second game | 🟢 **доказана на Конане** | движок принял Conan Exiles Enhanced **без единой правки**: слаг `conanexilesenhanced` из манифеста, `game_id` со страницы. Oblivion Remastered остаётся подготовленным (манифест на 168 модов), ждёт патча |
| Phase 3 — compatibility | 🔲 todo | источник конфликтов найден: `UnrealPak -List` из Dev Kit читает любой пак с Oodle (`researches/conan-devkit/`); работа — фаза 3 эпика `plans/06` |
| Phase 4 — optimization presets | 🔲 todo | |

### 🗡️ Третья игра — Conan Exiles Enhanced 2.1.1

Пак: **`D:\work\ai_sandbox\ConanExiles`** · приватный GH `MikalaiKryvusha/conan-exiles-modpack` ·
игра `D:\Games\Conan Exiles` · библиотека `D:\Games\Conan Exiles Mods\mods` (вне git).
UE **5.6.1**, билд `++exiles+release-CL-373655`, установка не из Steam, BattlEye выключен.

**Не пересказываю — ДЕСЯТЬ документов в паке, `docs/`:** `01-графика-и-DLSS.md` (шкалы настроек,
снятые чтением бинарника; лестница приоритетов cvar-ов; **раздел 8 — пять проверок в игре**) ·
`02-моды-и-инструменты.md` (pak+utoc+ucas, `modlist.txt`, анонимный `steamcmd` appid 440900,
**Ratchet — script extender Конана на Lua**, Dev Kit) · `03-cvars-конана.md` + `dw-cvars/`
(**собственное пространство `dw.*`, 264 переменные слоя Dreamworld, нигде публично не описанные;
конспект ПОЛОН, все девять семей**) · `04-камера.md` (разведка со скептиками) ·
`05-каталог-модов-nexus.md` (все 40 модов Enhanced) · `06-интерфейс-модов.md` · `07-зум-камеры.md` ·
**`08-мастерская-steam.md` (каталог Steam: 5 735 модов, 1 150 Enhanced, топ-120 с описаниями)** ·
**`09-рекомендации-модов.md` (отбор под вкус владельца + таблица конфликтов)** ·
**`10-жизнь-мира.md` (как сделать симуляцию жизни дёшево — под идею 02)**.

**Приборы пака** (`_config/`, все на python): `read-applied-cvars.py` — игра сама печатает в
журнал, что и из какой секции применила · `check-conflicts.py` — сталкивается ли наш `Engine.ini`
с этим · `deploy-config.py` — раскатка конфигов по хешу с бэкапом · `verify-install.py` +
`test-verify-baseline.py` — целостность игры и проверка самой проверки · `check-digest.py` —
полнота конспекта · `scan-cvars.py` — сканер cvar-ов из бинарников.

**Что применено к игре:** 4K, кап 141, VSync off, DLSS с пресетом **M** (`r.NGX.DLSS.Preset=13`),
Reflex, дальность и листва через группы качества `sg.*=4`, объёмный туман выключен, консоль
починена, множитель опыта 5.0, **одиннадцать модов** (девять с Nexus + два из Мастерской 09.09).
**Графика, моды и камера проверены владельцем 08.09; два новых мода и зонд снаряда — НЕТ.**

➡️ **ОЧЕРЕДЬ РАБОТ — `plans/04_conan_ochered_zakazov.md`** (восемь пунктов тикетами, по слову
владельца «будем потиху в разных чатах чинить это»). Состояние на 10.09.2026 ~12:00:
**закрыты и приняты владельцем** — HUD Hosav (1), зум камеры (2), камера после смерти (3),
интерфейс +10%, инерция зума и щуп земли. **Пункт 5 (перки) решён и ждёт РЕШЕНИЯ владельца,
а не работы.** Красного не осталось. Предыдущая очередь — `plans/03_conan_next_session.md`.

🔑 **РАМКА, СНЯТАЯ СО СЛОВА ВЛАДЕЛЬЦА 10.09:** он ещё НЕ НАЧАЛ настоящую партию — играет в
тестовом режиме, «обнулить не страшно», и начнёт долгую партию, «когда моды все более-менее
сделаем». Пока это так, **опыты можно ставить смело**: выключать моды, ронять прогресс, менять
систему прокачки. Копии сохранений всё равно снимаются перед каждым таким опытом
(`D:\Games\Conan Exiles Mods\_save-backup\`). **Как только он объявит начало партии — рамка
закрывается, и цена любого опыта над сохранением становится настоящей.**

### 🧰 Dev Kit Конана — найден, изучен, ни разу не открывался окном (12.09.2026)

**Лежит в `F:\CEDevKit\CEUE5Devkit`** (169 ГБ, скачан 10.09, не через Epic). UE **5.8.2**,
лицензиатская ветка `++exiles+release-beta` CL **374980** — **новее игры** (CL 373655), это
риск (а) для модов-переопределений. Разведка — **`researches/conan-devkit/README.md`**,
эпик — **`plans/06_EPIC_conan_devkit_toolchain.md`**, первая фаза — `plans/07_epic06_phase0_chtenie.md`.

Доказано 12.09 запусками, не чтением: (1) **безоконный командлет с Python читает игру за
2 минуты** (`-run=PythonScript -NullRHI`; шейдеры компилирует только ОКНО) — кривая опыта
`DT_ExperienceSystemLevel` прочитана, 60 уровней, `researches/conan-devkit/DT_ExperienceSystemLevel.csv`;
(2) **`UnrealPak.exe` кита читает и распаковывает любой пак мода вместе с Oodle** — `UIMod_Hosav`
распакован (404 файла), в нём 369 английских фраз в 46 виджетах с ключами `FText`;
(3) штатная сборка модов — `RunUAT BuildMod` с обязательным `-ScriptDir=UE4\Build\ModDevKit.Automation`,
исходник конвейера лежит в ките; проверенный ключ — `-ScriptDir="<кит>/UE4/"` (exileforge).
**MCP/CLI к киту никто не прикручивал**; Epic «Unreal MCP», AI Assistant, Remote Control и
CmdLinkServer лежат в ките ЗАГЛУШКАМИ без бинарников, живой канал один — Python remote
execution — фаза 4 эпика. ⚠️ **Игра отвергает пакеты НОВЕЕ себя** («Version is too new»), а
кит новее игры — фаза 1 открывается офлайн-сверкой версий, не куком. Веб-разведка с
источниками — `researches/conan-devkit/web-recon.md` (греп по `NOT FOUND`, `too new`, `exileforge`).
Побочный след запуска: `zenserver.exe` живёт в фоне (порт 8558, `%LOCALAPPDATA%\UnrealEngine`),
остановить `zen.exe service down`. ⚠️ Оконный запуск кита — только по договорённости
с владельцем: окно отбирает экран удалённого стола на 30–60 минут шейдеров.

## 🤖 Autonomous backlog pool (no human / no special hardware needed)

> Tasks the agent can do FULLY autonomously: write code → build → test on the harness → fix → commit,
> without the human and without resources only the human can provide. The loop skills
> (`/autoloop`, `/dayloop`, `/nightloop`) grind this pool.

- [ ] **Запуск-гард перед любыми тестами (блокер).** Импорт `kumm.mjs` ЗАПУСКАЕТ CLI: диспетчер команд
      лежит на верхнем уровне, и под `node --test` он получит путь тест-файла вместо команды, свалится
      в `default` и напечатает шапку в поток TAP. Пока гарда нет, юнит-тест написать нельзя — проверка
      разбора имён 15.08 делалась разовым скриптом в скретчпаде. Гард: сравнить
      `pathToFileURL(process.argv[1]).href` с `import.meta.url`. Правка механическая, но задевает
      ~250 строк отступов — поэтому отдельным заходом и с `node --check` после.
- [~] **Round-trip check for the archive naming scheme** — **ПОЛОВИНА СДЕЛАНА 08.09.2026.**
      `test-parse-archive.mjs` проверяет РАЗБОР: 17 случаев, из них девять настоящих имён живой
      библиотеки Palworld, четыре конановских с короткими id, вторая схема Nexus и отрицательный
      контроль. Поводом был баг 03 (`\d{4}` в id мода). **Осталось**: круговой ход
      `libraryName()` → `parseArchive()` — то есть проверить, что ЗАПИСЬ и ЧТЕНИЕ согласованы, а
      не только чтение. Тест уже умеет вырезать функции из `kumm.mjs` в обход запуска CLI —
      каркас для этого готов.
- [ ] **Cases for `sameFile`/`stamp` and `pickCard`** — upload-date comparison rounded to the minute;
      variant selection between Steam/Gamepass, Capped/plain, presets. Pure, autonomous.
- [~] **A fixture pack** — **разово собрана и окупилась 08.09.2026**: поддельный пак + библиотека
      из архивов, названных по схеме движка, + папка игры с одним файлом-признаком. Прогнана в трёх
      режимах (`-Deploy -DryRun`, боевая раскатка, `-Verify`) и нашла **четыре** дефекта
      переносимости за один заход (`bugs/03_DONE_*`, `EXP-0043`). **Осталось**: превратить разовый
      скрипт в постоянный прибор в репозитории — сейчас он жил в scratchpad и умер вместе с сессией.
      Это самый дешёвый оставшийся пункт Phase 1: строитель фикстуры уже написан один раз.
- [ ] **Close the packaging drift** — `package.json` `"files"` ships `kumm.mjs` without
      `Deploy-ModPack.ps1`, so `npm i -g` delivers half the engine. Verify with `npm pack --dry-run`.
- [ ] **A real `help` command** — the switch block, the header comment (lines 18–28) and the README
      table are three hand-maintained copies of one list. One source, the rest generated or checked.
- [ ] **`kumm status` after `close`** — confirm it reports cleanly rather than throwing; cheap, and it
      is the command a session runs first.
- [ ] **Warn when a mod overrides `Engine.ini` at runtime** — обе болезни 21.08 были невидимы движку:
      деплой сверил каждый файл и всё равно отгрузил сборку, чью графику Lua-мод переписывает в мире.
      Дешёвый первый срез не требует запущенной игры: просканировать исходники модов на
      `[SystemSettings]` и присваивания `r.*` и доложить, какие из них сталкиваются с `Engine.ini` пака.
      **Свежий довод из практики:** `r.ViewDistanceScale` живёт в ЧЕТЫРЁХ местах с ТРЕМЯ разными
      значениями (мод 1.0, `_config/Engine.ini.SystemSettings-tuned.ini` 2.6,
      `_config/Krinik-Palworld-UE5-Engine.ini` 2.2), и побеждает мод. Это конкретный автономный
      кусок Phase 3 (`MASTER_PLAN.md`).
      **И второй довод, из Конана 08.09.2026: соперник бывает не мод, а САМА ИГРА.** Прибор
      `ConanExiles/_config/check-conflicts.py` показал, что игра ставит `r.ViewDistanceScale` и
      `grass.CullDistanceScale` из групп качества, применяемых ПОЗЖЕ нашей секции, — то есть наши
      значения проигрывали молча. Прибор простой (сверка нашего ini со снимком журнала игры) и
      просится в движок как общая проверка, а не как скрипт одного пака.

---

## ❓ Awaiting human review (interviews / homework)

> Decisions the agent must not make alone (brand/UX/architecture), or actions only the human can do
> (test on real hardware, external accounts). Filed in `interviews/` and `homeworks/`.

- ✅ **Интервью #002 — перевод мода «Hosav's Custom UI» ПРИНЯТ владельцем 2026-09-12 10:41** («ок, первая версия принята», четыре правки внесены в таблицу). Следующий шаг — не вычитка, а ОПЫТ: эстафета п. 1.
      234 строки таблицы (246 подписей интерфейса) с предложенным переводом (термины сверены со словарём игры из кита)
      и три вопроса формы (согласование · буквы компаса · тон подсказок). После ответа — опыт
      «свой `.locres` поверх мода» (фаза 2 эпика `plans/06`). Файл: `interviews/interview_002_hosav_ru_perevod.md`;
      источник строк — `researches/conan-devkit/hosav-ftext.csv` (794 ключа, 294 уникальных).
- 🅿️ **Стрельба из лука «по-обливионски» — В ДАЛЬНЕМ ЯЩИКЕ по слову владельца 12.09 ~15:50.**
      Разведка закончена и оказалась неожиданной: **механика уже в игре, обе половины.** Баллистика —
      `UConanProjectileMovementComponent`, `ProjectileGravityScale`, `ProjectileGravityCurve`,
      `ProjectileSpeedCurve`, зависимость от натяжения. Втыкание — отдельный чертёж
      `BP_DummyProjectile` с `K2_AttachToComponent`, `MyBoneName`, `PenetrationDepth`, `IsLootable`,
      `SetLifeSpan`, а в родителе `BP_BaseProjectile` — `ShouldAttach`, `SpawnAttached`,
      `DummyProjectileAttachedToCharacterLifetime`, `DummyProjectileOnGroundLifetime`. То есть задача,
      скорее всего, **не «сделать», а «настроить»**. Прочитаны ИМЕНА полей, не значения. Всё с адресами
      ассетов, тремя дорогами доставки и рисками — `researches/conan-archery/README.md`; наблюдение в
      игре владелец взял на себя — `homeworks/02_conan_strely_nablyudenie.md`. **Не поднимать, пока он
      не скажет.**
- ❓ **Интервью #001 — метрика поставки и каденция молитвы (KAIF 2.5), 2026-09-05.** Два вопроса, оба
      — настройки владельца, которые агент не выбирает сам: (1) ОДНА метрика поставки для
      `MASTER_PLAN.md` — предложен вектор «автономные проверки ядра 0 из 5 · игры на одном манифесте
      1 из 2», по слову владельца о векторе (issue #46 в origin KAIF); (2) каденция молитвы — полный
      текст перед каждой задачей (умолчание 2.5) или раз за сессию (выбор владельца в KAGO). Пока не
      отвечено — действуют предложение агента и умолчание. Файл: `interviews/interview_001_delivery-metric.md`.
- 🧫 **Образцы зловреда в `_MALWARE_DO_NOT_RESTORE\` — удалять насовсем или оставить: решение владельца.**
      Разбор обезвреживания `restore.ps1` и проверки машины (21.08) перенесён в хронику; команда
      удаления — в `_MALWARE_DO_NOT_RESTORE\ЧТО_ЗДЕСЬ.md`.
- 🔴 **Оставшееся предупреждение:** НЕ запускать `Clear-Quarantine.ps1 -Stamp 2026-08-17_2335
      -Execute`, пока не забраны три вещи ниже — там **единственный экземпляр** сохранения
      Elden Ring и личное видео `ref.mp4` (3.59 ГБ, съёмка с телефона 04.08.2024).
- 🎬 **Настройки OBS: виноват не карантин, а деинсталляция iTunes** (с ней ушёл кодировщик
      CoreAudio AAC, OBS молча свалился на `ffmpeg_aac`). Разбор и порядок возврата —
      `researches/cleanup-2026-08-17/README.md`. **Файл `basic.ini` целиком копировать нельзя** —
      там OAuth-токен YouTube. Вопрос владельцу: нужен ли CoreAudio настолько, чтобы ставить
      iTunes обратно.
- 🖱️ **Задача автозапуска RTSS снята уборкой и отсутствует.** Возврат одной командой:
      `.\restore.ps1 -Id task-rtss -Execute` из `F:\_QUARANTINE_C\2026-08-17_2325\deadweight\`
      (повышенная консоль). **Сначала спросить, нужна ли:** `MSIAfterburner` жива и сама поднимает
      RTSS — возврат может дать дубль.
- 📦 **Три вещи ждут возврата из карантина** (пробные прогоны выполнены, боевые НЕ запускались):
      `orphan-national-instruments` (432 МБ, продукт числится установленным, 11 записей LabVIEW в
      реестре, назначение пусто — вернуть штатно из повышенной консоли) · сохранение Elden Ring
      (57.9 МБ, единственный экземпляр в мире — забирать **копированием**, не штатным возвратом:
      он перемещает и лишает избыточности) · `ref.mp4` (личное видео, забрать к себе на E:, обратно
      на C: не возвращать).
- ⏳ **`LoadingRange` стоит на ванильных 25600, и владелец не назвал, на что возвращать.** Путь за день:
      153600 → 76800 → 51200 → 38400 → 25600. Последние два шага **не дали ничего измеримого** по
      `CPU busy`, а горизонт уплощили. Варианты, которые предлагались: 51200 или 76800. Правится в ДВУХ
      файлах: `UltraGraphics/config.lua` → `LoadingRange` и `HLODLoadingRange/Scripts/config.lua` → `Range`.
- 🗺️ **Две строки мод-листа Oblivion не сопоставлены с архивами** (`modpack.json` → `$unresolved`).
      «Костры наносят урон всем, не только игроку» — id 1701 отдаёт два файла (`Camp fire damage` и
      `Not so deadly trap`), какой из них эта строка, по именам не видно. «Локальная карта в высоком
      разрешении» — кандидат `Ultra Quality 4K All World Maps` (id 2020), но тот про карты мира.
      Догадку не писали намеренно. Спросить, когда дойдут руки до отбора модов, — до патча не срочно.
- 🎨 **Двух решейдов из мод-листа в библиотеке нет вовсе** — `Project O` и `BloodyFreak's Reshade`;
      качать заново, ссылок владелец не оставил.
- 🎮 **Консоль в игре не открывается** — НЕ блокер: работает мост ConsoleBridge (`EXP-0020`). Лог
      показывает, что ConsoleEnablerMod регистрирует Tilde/@/^/F10, то есть проблема на стороне ВВОДА,
      не мода. Чинить — низкий приоритет.
- 🧰 Anything needing a real Nexus login, a real game install, or the owner's own mod pack is his to
      run — the agent can build the fixture path but cannot verify the live path alone.

---

## Where to continue next session

> A concrete checklist so the next session (empty context) can start immediately: which files, which
> commands, what to verify first.

### 🗡️ Первым делом в новой сессии (после дня 2026-09-12)

0. 🩺 **ЕСЛИ МОДЫ «НЕ РАБОТАЮТ» — ПЕРВЫМ ДЕЛОМ ОДНА КОМАНДА, а не поиск своей ошибки:**
   ```
   grep 'StaticAlignment_Private' "D:/Games/Conan Exiles/ConanSandbox/Binaries/Win64/ue4ss/UE4SS.log"
   ```
   Нашлось — **проверить вторую командой:**
   ```
   grep -c '^Unknown_1$' "D:/Games/Conan Exiles/ConanSandbox/Binaries/Win64/ue4ss/VTableLayout.ini"
   ```
   Ноль — **вернуть эту строку** из `_unpacked/UE4SS/ue4ss/VTableLayout.ini` (секция `[FProperty]`,
   прямо над `GetMinAlignment`). Так выглядит затёртый обновлением UE4SS файл, и это самая
   вероятная причина возврата бага 10 (`bugs/10_DONE_*`, тикет
   [#1421](https://github.com/UE4SS-RE/RE-UE4SS/issues/1421)). ❌ **«Перезагрузить машину» —
   опровергнуто** (`EXP-0091`), не тратить на это время. Если строка НА МЕСТЕ, а фатал есть —
   значит игру перекуковали и раскладка vtable сдвинулась снова: перебор заново, по одной пустышке
   за запуск, вердикт — значение `FName Alignment` (обязано быть 4). Сторож в
   `_config/enter-world.ps1` говорит то же самое. `UE4SS.log` стирается при КАЖДОМ запуске —
   улики снимать до перезапуска.

1. ✅ **Сделано 12.09, трогать не нужно — только знать:** русский интерфейс мода Hosav
   (`ConanExiles/_config/localization/README.md`, раскатка `deploy-localization.py --check`) и
   закрытый баг 10 (`bugs/10_DONE_*`). У обоих ОДИН и тот же класс долга: **чужое обновление
   молча сотрёт нашу правку** — проверка целостности игры уносит два файла локализации, обновление
   UE4SS затирает `VTableLayout.ini`. Признаки и лечение — пункт 0 выше и оба README.
   **Ждёт владельца:** ничего; интервью #003 он принял целиком.

2. 🔲 **Фаза 0 эпика Dev Kit — `plans/07_epic06_phase0_chtenie.md`** (приборы чтения в
   `ConanExiles/_config/devkit/`): `devkit-run.ps1`, `dt-export.py`, `pak-inspect.py`, страж среды.
   Всё доказанное лежит в `researches/conan-devkit/` (`smoke-dump-xp.py`, `ftext_extract.py`,
   `textscan.py`, `glossary.py`) — переносить, а не переписывать. Оконный запуск кита — только
   по договорённости с владельцем (экран удалённого стола, 30–60 мин шейдеров).

3. 🟡 **Дождь (план 04 п. 4)** — цель найдена поимённо
   (`PersistentLevel.BP_Dynamic_Weather_Siptah_Rain_C....NS_Precipitation`), зонд Numpad 1 пишет
   в журнал (на экране ничем себя не выдаёт). Правка ещё не делалась.

4. 🟢 **Ждёт глаза владельца:** множители опыта подняты (`PlayerXPRateMultiplier=12`) — и ДОЛГ:
   пак не ведёт `ServerSettings.ini`, правка живёт только в папке игры (план 04 п. 5).

5. 🔧 **`[NOT-TESTED]`:** переживает ли глушение чужой камеры (`EAA_Zoom_C`) смерть и возрождение.

**Приборы пака, о которых стоит знать:** `_config/bisect-zoom.py` (деление сборки пополам правкой
`modlist.txt`, вердикт числом) · `_config/who-overwrites-table.py` (кто переписал строку таблицы, по
журналу) · `_config/backup/mods-asset-catalog.txt` (каталог 44 паков, 128 555 путей; теперь
ЛУЧШЕ — `UnrealPak -List` из кита, см. `EXP-0087`) · `_config/enter-world.ps1`, `capture.ps1`,
`close-game.ps1`, `input.ps1 -Key 0x09` (Tab), `run-camera-test.ps1 -WheelNotches 40`.
**Агент не может нажать ни одной клавиши мода** (`EXP-0082`) — управление через `agent-cmd.txt`.

**Правила, оплаченные Конаном:** сырой поиск строк по пакам всегда ложноотрицателен (Oodle) —
теперь паки распаковывает `UnrealPak` кита · каталог говорит кто ЧТО ВЕЗЁТ, не кто ПОБЕДИЛ
(`EXP-0077`) · зелёный опыт обязан уметь краснеть (`EXP-0074`) · «хук встал» ≠ «хук работает»
(`EXP-0071`) · снимай и смотри глазами (`EXP-0081`), зрение исчерпаемо (`EXP-0084`).

### 🎯 Четыре заказа владельца — состояние

| заказ | состояние |
|---|---|
| **графика** | ✅ **проверена владельцем**: «без экспоненциального тумана стало красивее и больше FPS», «тень от солнца стала плавная». Осталось: качество дальних теней и Люмен |
| **камера** | ✅ **сделана и проверена 08.09**: «получилось хорошо». Дрожь вылечена причиной, зум отобран у игры, смерть переживается. Разбор — `bugs/04` |
| **глубокая симуляция мира** | материал собран целиком (конспект `dw.*`, 264 из 264). Порядок работ: сперва стриминг (`dw.WCStreamAroundAllClientsInListenServer`), потом тик-рейты |
| **моды** | ✅ девять раскатаны и **проверены в игре 08.09**: игра монтирует все восемь паков (девятый — подмена файлов) |

### Состояние машины — только живое (остальное в хронике, запись 2026-09-08)

| Что | Состояние |
|---|---|
| Файл подкачки | **ПЕРЕНЕСЁН НА D: 21.08 ~22:45** по слову владельца. **Вступает в силу после перезагрузки** — до неё жив `C:\pagefile.sys`. Проверить ПОСЛЕ загрузки: `Get-CimInstance Win32_PageFileUsage` должен показать D:, осиротевший `C:\pagefile.sys` (9.8 ГБ) исчезнуть сам; не исчез — удалить вручную |
| Фоновая запись Game DVR | **выключена агентом 21.08** (было 1). Вернуть: `Set-ItemProperty 'HKCU:\System\GameConfigStore' -Name GameDVR_Enabled -Value 1` |
| Игровой режим Windows | **включён агентом 21.08** (было 0). Вернуть: `Set-ItemProperty 'HKCU:\Software\Microsoft\GameBar' -Name AutoGameModeEnabled -Value 0`. Испортятся сессии Parsec/Apollo — вернуть |
| HDR рабочего стола | **ВКЛЮЧЁН** и, вероятно, владельцем не замечен. **Не путать с `RTX HDR` в профиле драйвера — это два разных выключателя, гасить по одному** |
| G-SYNC | **выключен**, `Application State = Fixed Refresh Rate` — телевизор мерцает на VRR, обратно не включать |
| Lua 5.4.6 | **поставлен агентом 08.09** (`winget install DEVCOM.Lua`), лежит в `%LOCALAPPDATA%/Programs/Lua/bin`, в PATH НЕ добавлен. Зачем: гейт синтаксиса для Lua-модов (`luac.exe -p <файл>`) — до него правки мода проверялись «на глаз», и это уже стоило ошибки в живой игре. Снять: `winget uninstall DEVCOM.Lua` |
| Горячая перезагрузка модов UE4SS | **включена агентом 08.09** (`EnableHotReloadSystem = 1` в `ue4ss/UE4SS-settings.ini`, клавиша **Ctrl+R**). Экономит владельцу перезапуски игры при правках Lua. Вернуть: поставить `0` — файл во всём остальном совпадает с официальным конанским конфигом байт в байт |
| aria2 | поставлен агентом 08.09 (`winget install aria2.aria2`) ради выборочной загрузки из набора файлов |
| Три дерева git | `KUMM` · `Palworld` · **новое `ConanExiles`** — все чистые и запушены на 08.09.2026. Хэши смотреть `git log --oneline -5`, здесь они устареют от следующего коммита |
| ⚠ Найдено при закрытии 08.09 | у пака Palworld **четыре коммита от 31.08 лежали незапушенными месяц** (правки `UltraGraphics/config.lua`: дальность 3.0→2.0, набор 80/20, облака и высотный туман, откат теневой пары). Отправлены. Прошлый статус утверждал «оба дерева запушены» — утверждение было неверным. **Проверять `git rev-list --left-right --count origin/<ветка>...HEAD` при каждом закрытии, а не верить прошлой записи** |

**Долг по уборке 17.08 — доложить владельцу и получить три решения** (RTSS · iTunes ради
кодировщика OBS · три вещи из карантина). Разбор закончен и лежит в
`researches/cleanup-2026-08-17/README.md`, 377 строк с доказательствами. Начинать с двух
предупреждений по безопасности выше. **Ничего не восстанавливать без его слова.** Там же раздел
5 — семь дефектов в его собственной тулзе уборки, и это ему нужнее всего.

---

### 🎮 Palworld — открытые опыты (заморожены с 31.08, перенесены в хронику 12.09)

Три опыта (родной HDR игры · HDR рабочего стола отдельно · замер правок 31.08) и правила замера
(`_tools/perf-harness/README.md`, `felt.py` первым, сверка cvar мостом до и после, одно изменение за
заход) — дословно в `PROJECT_HISTORY.md`, запись 12.09. Досье: `games/Palworld/README.md`,
`researches/ue5-cvars/`, `plans/01_cpu_gt_panorama.md`. Если владелец хочет работу по движку
(Phase 1): `git status`, `node --check kumm.mjs`, первый пункт автономного беклога через `/plan-task`;
функции в `kumm.mjs`: `parseArchive` (450), `libraryName` (412), `sameFile`/`stamp` (541–543),
`pickCard` (548); раннер — `node:test`; живые вызовы Nexus в цикле запрещены.
**Патч Oblivion Remastered** — порядок в `README.md` сборки (`D:\work\ai_sandbox\OblivionRemastered`).

## Open bugs

✅ **`bugs/10` ЗАКРЫТ 12.09** — фатал UE4SS вылечен одной строкой в `VTableLayout.ini`
(`bugs/10_DONE_*`, тикет [#1421](https://github.com/UE4SS-RE/RE-UE4SS/issues/1421), уроки
`EXP-0095`/`EXP-0096`). Весь Lua-слой сборки снова живой: камера, гаситель модалки, HUD.

*(none open in the project's own code)*. Все три закрыты: `bugs/01_DONE_*` (замирания Palworld —
виновата была подкачка на системном диске) · `bugs/02_DONE_*` (агент уничтожил два бинарника
Конана, восстановлено и доказано хешами, класс закрыт правилом в `AGENT_GUIDE.md` и сторожем
`verify-install.py`) · **`bugs/03_DONE_*` (08.09.2026 — пять допущений «палворлдовской формы» в
движке; главное: разбор имени архива требовал ровно четырёх цифр в id мода, и движок не видел бы
ни одного архива Конана. Закрыт тестом на настоящих именах Palworld, 17 из 17)**.

Известный дефект, ждущий, когда его возьмут: **дрейф упаковки** — `package.json` `"files"` не
включает `Deploy-ModPack.ps1`, поэтому `npm i -g kumm` ставит половину движка (проверено:
`npm pack --dry-run` → 4 файла, 15.2 КБ).

Тикеты по самому фреймворку — все доставлены наверх, держатся до ретирования обновлением:
[KAIF#16](https://github.com/MikalaiKryvusha/KAIF/issues/16) (закрыт наблюдением 2026-09-05),
[#48](https://github.com/MikalaiKryvusha/KAIF/issues/48) (полевой отчёт 2.5),
[#42](https://github.com/MikalaiKryvusha/KAIF/issues/42) (+1 к граблям маршрута бутстрап),
[#57](https://github.com/MikalaiKryvusha/KAIF/issues/57) (термин «baton» → «handover»: не индустриальный и превращается в «батон» при переводе — заведён по прямому указанию владельца 09.09.2026),
[#17](https://github.com/MikalaiKryvusha/KAIF/issues/17) и
[#3](https://github.com/MikalaiKryvusha/KAIF/issues/3) (+1 к воротам плейсхолдеров).
⚠️ **Осознанное расхождение с origin по тикету #57** (`baton` → `handover`, 81 замена по слову
владельца 09.09.2026): следующему `/kaif-update` — это правка владельца, не грязь; якоря в
`.kaif/deploy-manifest.json` (строки 1766, 1813) на старые заголовки — при ненайденном якоре
СПРОСИТЬ, а не пропустить тихо. Полный разбор — `PROJECT_HISTORY.md`, запись 12.09. Проверка:
`grep -ro -i "baton" . --exclude-dir=.git | wc -l`. Грабля R2 — S3, живёт в `EXP-0035`.
