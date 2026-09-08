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

> **Сессии 2026-09-08 (две подряд) — заведена и собрана третья игра, Conan Exiles Enhanced
> 2.1.1.** Пак `D:\work\ai_sandbox\ConanExiles`, игра `D:\Games\Conan Exiles`, приватный GH
> `conan-exiles-modpack`. Движок принял игру **без единой правки конфигов**; для модов правки
> потребовались — закрыты, `bugs/03_DONE_*`. Конспект `dw.*` полон (264 из 264), мод-лист из
> девяти раскатан, каталог Nexus снят. **Ничего не проверено в живой игре** — это и есть батон.
> **Стрижка бонсай выполнена 08.09.2026:** обе записи о заведении третьей игры ушли в
> `PROJECT_HISTORY.md` дословно. STATUS 379 строк при бюджете 200, и остаток проверен двумя
> тестами самого файла: это открытый беклог, шесть ожиданий владельца (включая два
> предупреждения по безопасности, которые резать нельзя), правила замеров, оплаченные ложным
> замером `EXP-0026`, и два игровых батона. Убери любую строку — следующая сессия ошибётся.
>
> **Инцидент S1 первой сессии:** агент уничтожил два бинарника игры; восстановлено, класс закрыт
> (`bugs/02_DONE_*`, `EXP-0036…0039`). Подробности обеих сессий — в `PROJECT_HISTORY.md`.
>
> v0.1.0 (the two halves) и развёртывание KAIF 2.2 закрыты, лежат в `PROJECT_HISTORY.md`.
> Три графические сессии Palworld 15.08 и подготовка Oblivion Remastered — там же.
> **KAIF обновлён 2.2 → 2.5 (2026-09-05, маршрут бутстрап)** — запись в хронике, полевой отчёт
> `reports/KAIF_UPDATES/KUMM_KAIF_2.5_UPDATE_REPORT.md`. Новое для сессий: символ веры и молитва в шапке
> `AGENT_GUIDE.md`; строки `FORK:` (развилка) и `DELIVERY:` (закрытие сессии, итерация цикла); лестница
> тяжести дефектов S1/S2/S3; пара `/end-chat-soft` · `/end-chat-force` вместо `/end-chat`. Бюджет STATUS —
> ~200 строк: стрижка бонсай выполнена при закрытии 2026-09-05 — закрытые записи 21.08–31.08 ушли в хронику дословно.

---

## Where we are now

The engine works and the owner uses it daily for Palworld. What it does NOT have is any way to check
itself: there is no test of any kind, and both halves talk to the outside world (Nexus through a
browser, game folders on disk), so a fresh session cannot currently prove a change is safe without the
owner's eyes. That is the whole of the current focus — Phase 1 in `MASTER_PLAN.md`.

| Phase | Status | What's there |
|-------|--------|--------------|
| Phase 0 — the two halves | ✅ done | v0.1.0 in daily use |
| Phase 1 — trustworthy unattended | 🔲 next | no tests exist yet; the deterministic core is the target |
| Phase 2 — the second game | 🟢 **доказана на Конане** | движок принял Conan Exiles Enhanced **без единой правки**: слаг `conanexilesenhanced` из манифеста, `game_id` со страницы. Oblivion Remastered остаётся подготовленным (манифест на 168 модов), ждёт патча |
| Phase 3 — compatibility | 🔲 todo | needs a research doc first |
| Phase 4 — optimization presets | 🔲 todo | |

### 🗡️ Третья игра — Conan Exiles Enhanced 2.1.1

Пак: **`D:\work\ai_sandbox\ConanExiles`** · приватный GH `MikalaiKryvusha/conan-exiles-modpack` ·
игра `D:\Games\Conan Exiles` · библиотека `D:\Games\Conan Exiles Mods\mods` (вне git).
UE **5.6.1**, билд `++exiles+release-CL-373655`, установка не из Steam, BattlEye выключен.

**Не пересказываю — шесть документов в паке, `docs/`:** `01-графика-и-DLSS.md` (шкалы настроек,
снятые чтением бинарника; лестница приоритетов cvar-ов; **раздел 8 — пять проверок в игре**) ·
`02-моды-и-инструменты.md` (pak+utoc+ucas, `modlist.txt`, анонимный `steamcmd` appid 440900,
**Ratchet — script extender Конана на Lua**, Dev Kit) · `03-cvars-конана.md` + `dw-cvars/`
(**собственное пространство `dw.*`, 264 переменные слоя Dreamworld, нигде публично не описанные;
конспект ПОЛОН, все девять семей**) · `04-камера.md` (разведка со скептиками) ·
`05-каталог-модов-nexus.md` (все 40 модов Enhanced со счётчиками).

**Приборы пака** (`_config/`, все на python): `read-applied-cvars.py` — игра сама печатает в
журнал, что и из какой секции применила · `check-conflicts.py` — сталкивается ли наш `Engine.ini`
с этим · `deploy-config.py` — раскатка конфигов по хешу с бэкапом · `verify-install.py` +
`test-verify-baseline.py` — целостность игры и проверка самой проверки · `check-digest.py` —
полнота конспекта · `scan-cvars.py` — сканер cvar-ов из бинарников.

**Что применено к игре:** 4K, кап 141, VSync off, DLSS с пресетом **M** (`r.NGX.DLSS.Preset=13`),
Reflex, дальность и листва через группы качества `sg.*=4`, объёмный туман выключен, консоль
починена, множитель опыта 5.0, **девять модов**. **Ничего из этого не проверено в живой игре.**

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

### 🗡️ Первым делом в новой сессии (после двух сессий Конана, 2026-09-08)

> Одной строкой: **сборка Конана собрана целиком и ни разу не запущена.** Девять модов лежат в
> игре, конфиги применены, скорость прокачки поднята — и ни одна из этих вещей не проверена
> глазами. Всё остальное ниже — про это.

1. **ЗАПУСК ИГРЫ — единственное, что двигает дело вперёд.** Проверять в этом порядке:
   1. открылась ли **консоль** (Insert / Tilde / F10) — без неё пункты 3–5 непроверяемы;
   2. **виден ли мод-лист** в Главном меню → Mods: ждём восемь модов в порядке
      `ConanSandbox/Mods/modlist.txt`;
   3. `r.NGX.DLSS.Preset` без значения → ждём `13`;
   4. `r.ViewDistanceScale` → **вот это главное новое.** Раньше ждали 2.0 и НЕ получили бы:
      игра ставит 1.1 из группы качества, которая применяется ПОЗЖЕ нашей секции. Поэтому
      подняты `sg.ViewDistanceQuality=4` и `sg.FoliageQuality=4` (Cinematic). Проверяется
      наблюдением, гипотеза не подтверждена;
   5. осталась ли дымка после выключенного объёмного тумана.
2. **После первого ВЫХОДА из игры — два прогона в паке Конана, именно в таком порядке:**
   ```
   cd D:\work\ai_sandbox\ConanExiles
   python _config/read-applied-cvars.py      # пересобрать снимок журнала
   python _config/check-conflicts.py         # столкновения нашего Engine.ini с игрой
   python _config/deploy-config.py --dry-run # что игра переписала в наших конфигах
   ```
   `check-conflicts.py` **до запуска показывал два столкновения** (`r.ViewDistanceScale`,
   `grass.CullDistanceScale`). После правки групп качества их быть не должно — если остались,
   переносить строки в `[/Script/ConanSandbox.SystemSettings]`, она применяется последней.
   `deploy-config.py --dry-run` отвечает на висящий вопрос, нужен ли `Engine.ini` флаг «только
   чтение» (`setReadOnly` пока `false`, осознанно).
3. **Перед любой автономной работой рядом с игрой** — `python _config/verify-install.py` в паке
   Конана. Теперь у него **код возврата** (0 — тревог нет, 1 — есть) и база объявленных
   исключений; ждём «ТРЕВОГ НЕТ», ожидаемо 90. Правило `AGENT_GUIDE.md` → Boundaries for
   subagents, оплачено багом 02.
4. **Скорость прокачки поднята в игре, а не модом:** `ServerSettings.ini` →
   `PlayerXPRateMultiplier` = **5.0** (было 1; оригинал в `_config/backup/`). Одно число, крутится
   в любую сторону. Владелец просил «уверенно быстро» под потолок в 1000 уровней — если окажется
   мало или много, менять здесь, а не искать мод.
5. ✅ **Конспект `dw.*` полон** — 264 имени из 264, все девять семей. Метод, который стоит
   переиспользовать: **справка Funcom к каждому cvar-у лежит в бинарнике игры** (`EXP-0041`,
   правило 2-бис в `ConanExiles/docs/dw-cvars/README.md`). Правило 2 канона уточнено
   наблюдением: `dw.*` приезжают из **четырёх** секций ini, а не из одной.
6. Проверка каркаса — `node .kaif/kaif-core.mjs check`.

### 🆕 Что изменилось в движке 2026-09-08 — читать перед правкой кода

1. **Движок умеет моды-паки.** `kind: "pak"` + `modsDir` + `modList` в манифесте: копирует
   `.pak`/`.utoc`/`.ucas` плоско и без переименования, генерирует `modlist.txt` из порядка
   `mods[]`. Ветка включается **только** при наличии `modsDir` — для Palworld не изменилось
   ничего. Проверка модов-паков идёт **по `modlist.txt`**, и она ловит осиротевший пак (лежит,
   но не в списке → не загрузится), чего поимённый `verify` не увидел бы.
2. **Закрыт баг 03 — пять допущений «палворлдовской формы»** (`bugs/03_DONE_*`). Главное:
   разбор имени архива требовал **ровно четырёх цифр** в id мода; у Конана они одно- и
   двузначные, то есть движок не видел бы **ни одного** его архива. Правка парная — `kumm.mjs` и
   `Deploy-ModPack.ps1`. **Регрессия закрыта тестом:** `node test-parse-archive.mjs`, 17 из 17,
   из них девять НАСТОЯЩИХ имён из живой библиотеки Palworld.
3. **`.rar` и `.7z`** распаковываются через 7-Zip, если он на машине есть (`.zip` по-прежнему
   силами .NET — правило нулевых зависимостей цело).
4. **`verify-install.py` больше не врёт.** На здоровой установке он печатал «БИТО 2,
   ОТСУТСТВУЕТ 78» (бонусы установки + подменённая библиотека). Теперь расхождения делятся на ТРЕВОГУ и ОЖИДАЕМОЕ по
   объявленным с причиной правилам с **закреплёнными хешами**; сторож `never_excepted`
   останавливает прибор, если правило случайно накроет файл игры. Проверка самой заглушки —
   `python _config/test-verify-baseline.py`, 13 из 13, оба контроля (`EXP-0042`).

### ⚠️ Три вещи, которые легко испортить по незнанию

- **`No-Intro-Splash` — не мод, а подмена файлов игры** (`EXP-0044`). Подлинники десяти роликов и
  `Splash.bmp` — **197 МБ** — сохранены в `D:\Games\Conan Exiles Mods\mods\_originals\` с
  `ЧТО_ЗДЕСЬ.md` и хешами. Возврат заставок — **копированием оттуда**; штатное удаление вернёт
  пустоту, а не подлинник. Его `install` записан ПОФАЙЛОВО намеренно: `-Remove` идёт по списку
  `to`, и папка `ConanSandbox` там означала бы стирание всей игры одной командой.
- **`Immersive Warriors Enhanced` конфликтует с кинематографической камерой** — так пишет сам
  автор («cinematic camera corrupts the animations»). Когда дойдут руки до заказа по камере
  (`ConanExiles/docs/04-камера.md`), это подозреваемый номер один.
- **Мод-лист собран из группы взаимоисключающих.** Взяты: `Level and Attribute Overhaul` (в нём
  уже есть `MrSerji's Level 1000`; исключает `Why Stop At 60` и `Why Are You Weak`),
  `Unnecessary Thrall Army` 100 (вместо `My Little Thrall Army` 10 — по слову владельца; откат
  минутный: заменить `nexusId` и передеплоить), `Resource Stimulus Package` (включает
  `Stone Drop Brimstone`). Добавлять из этих групп что-то ещё — значит устроить драку за одни
  таблицы.

### 🎯 Четыре заказа владельца — состояние (его формулировка, 08.09.2026)

| заказ | состояние |
|---|---|
| **графика** | применено в файлы; **ни разу не проверено в живой игре**. Свежее: дальность и листва подняты через группы качества (`sg.*=4`), потому что прибор показал — из `Engine.ini` они проигрывали |
| **камера** | только разведка (`docs/04-камера.md`), ничего не поставлено. Путь: UE4SS + свой Lua-мод по каркасу палворлдовского `CameraControl`, ≈100 МБ и 20–30 минут до вердикта |
| **глубокая симуляция мира** («чтобы движок работал как на мультиплеерных серверах») | материал собран целиком: семьи `ai-lod`, `net`, `stream`. **Ключевой вывод:** одиночная игра — listen-сервер, репликация в ней молчит (некому слать), поэтому рывки на базе идут НЕ оттуда. Порядок работ: сперва стриминг (`dw.WCStreamAroundAllClientsInListenServer`), потом тик-рейты — настраивать AI LOD в выгруженном мире бессмысленно |
| **моды** | ✅ **девять раскатаны** (9/9, 18 файлов, verify 19/0), `modlist.txt` собран из порядка манифеста. **Не проверены в игре.** Каталог Nexus снят целиком и оказался почти пуст — `docs/05-каталог-модов-nexus.md` |

### 🔜 Что напрашивается следующим (не начато)

- **Мастерская Steam не снята.** Без входа страница отдаёт 479 КБ разметки без единой карточки.
  Настоящий каталог Конана там, а не на Nexus. Нужен Steam-аккаунт владельца в отладочном Chrome
  (`node kumm.mjs launch --game conanexilesenhanced`, залогиниться, дальше `kumm eval`).
- **`ServerSettings.ini` пак не ведёт.** Мы владеем `Engine.ini`, `Game.ini`,
  `GameUserSettings.ini`, `Input.ini`; множитель опыта правился в живом файле напрямую. Решение
  «брать ли файл под пак» — за владельцем: игра переписывает его сама, и двойное владение
  кончится дракой.
- **Обобрать `Yerts Conan Lumen Enhanced` (№37)**, а не ставить: это чужой `Engine.ini`, он
  затрёт нашу сборку. Владелец сказал «мы сами настроим свой» — значит скачать, сравнить строка в
  строку и забрать только то, чего у нас нет.

### Состояние машины — только живое (остальное в хронике, запись 2026-09-08)

| Что | Состояние |
|---|---|
| Файл подкачки | **ПЕРЕНЕСЁН НА D: 21.08 ~22:45** по слову владельца. **Вступает в силу после перезагрузки** — до неё жив `C:\pagefile.sys`. Проверить ПОСЛЕ загрузки: `Get-CimInstance Win32_PageFileUsage` должен показать D:, осиротевший `C:\pagefile.sys` (9.8 ГБ) исчезнуть сам; не исчез — удалить вручную |
| Фоновая запись Game DVR | **выключена агентом 21.08** (было 1). Вернуть: `Set-ItemProperty 'HKCU:\System\GameConfigStore' -Name GameDVR_Enabled -Value 1` |
| Игровой режим Windows | **включён агентом 21.08** (было 0). Вернуть: `Set-ItemProperty 'HKCU:\Software\Microsoft\GameBar' -Name AutoGameModeEnabled -Value 0`. Испортятся сессии Parsec/Apollo — вернуть |
| HDR рабочего стола | **ВКЛЮЧЁН** и, вероятно, владельцем не замечен. **Не путать с `RTX HDR` в профиле драйвера — это два разных выключателя, гасить по одному** |
| G-SYNC | **выключен**, `Application State = Fixed Refresh Rate` — телевизор мерцает на VRR, обратно не включать |
| aria2 | поставлен агентом 08.09 (`winget install aria2.aria2`) ради выборочной загрузки из набора файлов |
| Три дерева git | `KUMM` · `Palworld` · **новое `ConanExiles`** — все чистые и запушены на 08.09.2026. Хэши смотреть `git log --oneline -5`, здесь они устареют от следующего коммита |
| ⚠ Найдено при закрытии 08.09 | у пака Palworld **четыре коммита от 31.08 лежали незапушенными месяц** (правки `UltraGraphics/config.lua`: дальность 3.0→2.0, набор 80/20, облака и высотный туман, откат теневой пары). Отправлены. Прошлый статус утверждал «оба дерева запушены» — утверждение было неверным. **Проверять `git rev-list --left-right --count origin/<ветка>...HEAD` при каждом закрытии, а не верить прошлой записи** |

**Долг по уборке 17.08 — доложить владельцу и получить три решения** (RTSS · iTunes ради
кодировщика OBS · три вещи из карантина). Разбор закончен и лежит в
`researches/cleanup-2026-08-17/README.md`, 377 строк с доказательствами. Начинать с двух
предупреждений по безопасности выше. **Ничего не восстанавливать без его слова.** Там же раздел
5 — семь дефектов в его собственной тулзе уборки, и это ему нужнее всего.

---

### 🎮 Игровой батон (Palworld) — открытые опыты

1. **Опыт Б — включить РОДНОЙ HDR игры** (`bUseHDRDisplayOutput=False`,
   `HDRDisplayOutputNits=1000`). Не «выключить HDR»: родной честнее по данным, а RTX HDR к
   приложению, отдающему HDR, перестаёт применяться САМ. Оговорка: игра идёт в окне
   (`FullscreenMode=2`), вывод HDR из UE5 в окне может не завестись — проверять.
2. **HDR рабочего стола** — вторым и отдельно: это разные выключатели.
3. **Замер после правок 31.08** (генерация кадров `Auto`, `r.ViewDistanceScale` 2.0 — ни одна не
   замерена) на той же панораме; прибор готов, сцену «пейзаж» владелец не назвал.

Порядок: ОДИН опыт за заход, перезапуск игры после каждой правки драйвера, значение сверять
мостом **до и после** каждого захвата (за отсутствие сверки заплачено ложным замером 22.08).

**Как мерить — обязательное чтение перед любым замером:**
`D:\work\ai_sandbox\_tools\perf-harness\README.md`. Коротко, но не вместо него:
- `felt.py` смотреть ПЕРВЫМ — абсолютные пороги. Относительный порог «2× от медианы» прячет рывки
  тем сильнее, чем хуже идёт игра, и агент на этом уже соврал владельцу (`EXP-0026`).
- Значение cvar-а сверять мостом **ДО и ПОСЛЕ** каждого захвата: `UltraGraphics` переприменяет весь
  свой блок при входе в мир, открытии карты и фаст-тревеле.
- Одно изменение за заход. PresentMon — своё имя ETW-сессии (сосед KAGO снимает ту же игру).
- Закрывать игру `CloseMainWindow()`, не `Stop-Process` — сохранение успевает записаться (проверено
  дважды: метка файла совпадает с моментом выхода).
- Агенту разрешено самому запускать и закрывать Palworld (слово владельца, 21.08). Меню он прокликать
  не может — экран агент видит только через `shot.ps1`, и на 4K с масштабом 300 % это неудобно.

**Если владелец хочет работу по движку** (Phase 1):
1. `git log --oneline -5` и `git status`. Сборки нет; `node --check kumm.mjs` — синтаксический гейт.
2. Взять первый пункт автономного беклога (запуск-гард), спланировать через `/plan-task`.
3. Функции живут в `kumm.mjs`: `parseArchive` (450), `libraryName` (412), `sameFile`/`stamp`
   (541–543), `pickCard` (548), `parseArgv` (59), `globToRe` (447).
4. Раннер проверок выбрать ДО написания проверок — у проекта ноль зависимостей, и это проектное
   ограничение (`MASTER_PLAN.md`). `node:test` встроен и ничего не стоит.
5. Никогда не гонять живые вызовы Nexus в цикле (`AGENT_GUIDE.md` → Live-path rule).

**Если вышел патч Oblivion Remastered** — порядок действий в `README.md` сборки
(`D:\work\ai_sandbox\OblivionRemastered`), семь шагов. Начинать с загрузчиков: они привязаны к версии
экзешника и ломаются патчем первыми.

**Досье и справочники по Palworld** (не пересказываю — там детали): `games/Palworld/README.md`
(железо, панель 4K@144, замеренная база) · `researches/ue5-cvars/` (конспект по cvar-ам UE5) ·
`README.md` самого пака (`D:\work\ai_sandbox\Palworld`, 89 КБ, разобраны прошлые артефакты) ·
`plans/01_cpu_gt_panorama.md` (лестница разгрузки игрового потока; **разморожен** — база 15.08 больше
не под вопросом, ступень 2 можно брать в работу).

---

## Open bugs

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
[#17](https://github.com/MikalaiKryvusha/KAIF/issues/17) и
[#3](https://github.com/MikalaiKryvusha/KAIF/issues/3) (+1 к воротам плейсхолдеров).
Грабля R2 — S3, живёт в `EXP-0035`; ждать те же три однострочных слияния навыков при следующем
`/kaif-update`.
