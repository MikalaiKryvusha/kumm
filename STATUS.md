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

> **Сессия 2026-09-08 — заведена третья игра, Conan Exiles Enhanced 2.1.1.** Игра перенесена в
> `D:\Games\Conan Exiles`, ярлык исправлен; пак `D:\work\ai_sandbox\ConanExiles` с приватным
> репозиторием `conan-exiles-modpack`; движок принял игру **без единой правки**. Применены
> настройки владельца (4K, кап 141, DLSS с пресетом M, дальность, туман, консоль) — **ни одна не
> проверена в живой игре**. Написаны конспекты `docs/01…03` и план `plans/02_conan_deploy_gaps.md`.
> **Инцидент S1:** агент уничтожил два бинарника игры; восстановлено, доказано хешами, класс
> закрыт (`bugs/02_DONE_*`, `AGENT_GUIDE.md` → Boundaries for subagents, `EXP-0036…0039`).
> Стрижка бонсай выполнена; STATUS 267 строк при бюджете 200 — остаток это живое: открытый
> беклог, ожидания владельца и два игровых батона, резать их ради числа было бы вредно.
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

### 🗡️ Третья игра — Conan Exiles Enhanced 2.1.1 (заведена 2026-09-08)

Пак: **`D:\work\ai_sandbox\ConanExiles`** · приватный GH `MikalaiKryvusha/conan-exiles-modpack` ·
игра `D:\Games\Conan Exiles` (перенесена туда 08.09, ярлык исправлен) · библиотека
`D:\Games\Conan Exiles Mods\mods`. UE **5.6.1**, билд `++exiles+release-CL-373655`, установка не из Steam.

**Не пересказываю — четыре конспекта в паке, `docs/`:** `01-графика-и-DLSS.md` (перечисления
настроек, снятые чтением бинарника; лестница приоритетов cvar-ов UE 5.6) ·
`02-моды-и-инструменты.md` (pak+utoc+ucas, `modlist.txt`, анонимный `steamcmd` appid 440900,
каталог Nexus, **Ratchet — script extender Конана на Lua**, Dev Kit) · `03-cvars-конана.md`
(**собственное пространство `dw.*` — 264 переменные слоя Dreamworld, нигде публично не
описанные**; девять семей, из них шесть расписаны в `docs/dw-cvars/`) · **`04-камера.md`**
(разведка с четырёх углов со скептиками).

**Про камеру коротко, чтобы не открывать документ ради вывода:** **UE4SS поддерживает UE 5.6 и
уже везёт штатный конфиг «Conan Exiles Enhanced»** — отдельного загрузчика под Конана искать не
надо. Рекомендованный путь: UE4SS экспериментальной сборки + свой Lua-мод по каркасу
палворлдовского `CameraControl`; цена ≈100 МБ и 20–30 минут до вердикта в `UE4SS.log`. Может не
сработать: запуск на клиенте `CL-373655` никем не подтверждён. Dev Kit закрыт по диску (оценки
160–226 ГБ против 66 свободных).

**Главный прибор сборки — `python _config/read-applied-cvars.py`:** игра сама печатает в журнал,
из какой секции что применила. Оттуда 58 штатных значений `dw.*` и карта из 21 секции. Секция
собственных переменных — `[/Script/ConanSandbox.SystemSettings]`, читается из `Engine.ini`
(доказано словами самой игры, строка 1638 её лога).

Что уже применено к игре: 4K, кап 141, VSync off, DLSS с пресетом **M** (`r.NGX.DLSS.Preset=13` —
это и есть «DLSS 4.5»), Reflex, дальность и листва подняты, объёмный туман выключен, **консоль
починена** (в Enhanced из `Input.ini` пропала секция клавиш). **Ничего из этого ещё не проверено в
живой игре** — это первое, что делает следующая сессия.

Движку KUMM для Конана не хватает двух вещей: генерации `modlist.txt` из порядка `mods[]` и
установки мода как ТРОЙКИ файлов (`.pak` + `.utoc` + `.ucas`, переименовывать нельзя).

---

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
- [ ] **Round-trip check for the archive naming scheme** — `libraryName()` writes it, `parseArchive()`
      reads it; they must agree. Pure functions, no network, no disk. This is the single most exposed
      pair in the codebase. **Схем теперь две** (своя и Nexus-download, `EXP-0018`) — круговой ход
      проверяется для своей, разбор чужой — по образцам из библиотеки Oblivion. Идёт ПОСЛЕ гарда.
- [ ] **Cases for `sameFile`/`stamp` and `pickCard`** — upload-date comparison rounded to the minute;
      variant selection between Steam/Gamepass, Capped/plain, presets. Pure, autonomous.
- [ ] **A fixture pack** (throwaway `modpack.json` + zero-byte correctly-named archives, built under the
      scratchpad, never in the repo) driving `check --json`, `-ListMods` and `-Deploy -DryRun` with no
      network and no game installed.
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

### 🗡️ Первым делом в новой сессии (после сессии Конана, 2026-09-08)

1. **Владелец ещё НЕ запускал игру после правок.** Всё, что применено — 4K, кап 141, DLSS с
   пресетом M, дальность, выключенный объёмный туман, починенная консоль — **непроверено**.
   Порядок пяти проверок расписан в паке: `ConanExiles/docs/01-графика-и-DLSS.md`, раздел 8.
2. **После первого выхода из игры** — `python _config/deploy-config.py --dry-run` в паке Конана:
   покажет, что игра переписала. Это ответ на вопрос, нужен ли `Engine.ini` флаг «только чтение»
   (в манифесте `setReadOnly` пока `false`, и это осознанно).
3. **Секцию `[/Script/ConanSandbox.SystemSettings]` проверить первой** при любом «правка не
   сработала»: `dw.*` живут именно там, а не в `[SystemSettings]` — три независимых источника.
4. **Перед любой автономной работой рядом с игрой** — `python _config/verify-install.py` в паке
   Конана (правило `AGENT_GUIDE.md` → Boundaries for subagents; оплачено багом 02).
5. **Подобрать хвост конспекта.** Ворквлоу по `dw.*` был остановлен, не дописав **три семьи из
   девяти**: `net` (18 имён), `stream` (13), `debug-db` (29). Шесть готовых лежат в
   `ConanExiles/docs/dw-cvars/`, полные (`python _config/check-digest.py` → 204 из 204 в
   готовых). Дописать три оставшихся — по образцу готовых, с пометками основания
   `[ИСТОЧНИК]`/`[ПО ИМЕНИ]`/`[АНАЛОГ]` и колонкой «как проверить». **Материал для них уже
   есть:** `_config/cvars-applied.txt` содержит штатные значения, прочитанные из журнала игры,
   в том числе всю семью `dw.nav.*` и `dw.OSD.Format`.
   Документ по камере (`docs/04-камера.md`) **готов и закоммичен**.
6. Проверка каркаса — `node .kaif/kaif-core.mjs check`.

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

*(none open in the project's own code)*. Оба закрыты: `bugs/01_DONE_*` (замирания Palworld — виновата
была подкачка на системном диске) и `bugs/02_DONE_*` (агент уничтожил два бинарника Конана,
восстановлено и доказано хешами, класс закрыт правилом в `AGENT_GUIDE.md` и сторожем
`verify-install.py`).

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
