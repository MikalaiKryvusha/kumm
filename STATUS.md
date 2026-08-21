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
>   `/end-chat` carries a "bonsai trim" step for exactly this (`/pause` stays ceremony-free by design).
> - **Leave the file the way you'd want to find it:** fresh summary of what works, what's in
>   progress, what's next, the pitfalls, and WHERE TO LOOK for the details (plans, bugs, history) —
>   pointers, not retellings.

---

## What's done (the short tail — older entries live in PROJECT_HISTORY.md)

> v0.1.0 (the two halves) и развёртывание KAIF 2.2 закрыты, лежат в `PROJECT_HISTORY.md`.
> Три графические сессии Palworld 15.08 и подготовка Oblivion Remastered — там же.

### 🟢 Регрессия Palworld ЗАКРЫТА, 2026-08-21 (дневная сессия 09:00–11:15 +03:00)

Болезней было **две, независимые**, и ночью их принимали за одну — отсюда и неразрешимость.
**(1)** Фризы во ВСЕХ рисующих приложениях — повреждённый глобальный профиль драйвера NVIDIA;
лечится «Восстановить» в глобальных параметрах 3D (Quake: потеряно времени 44.7 % → 7.3 %, 1 % low
4.0 → 37.5 к/с). **Чем именно повреждён — НЕ установлено**, и «уборка сломала драйвер» повторять
нельзя: каталог `Drs` не менялся с 2022 года, а улику уничтожило само лечение (`EXP-0027`).
**(2)** Низкий кадр в Palworld — `r.ViewDistanceScale=2.6`, стоимость геометрическая; владелец
выбрал 1.0, применено (15.6 → 53.3 к/с).

Числа, отсеянные версии, хронология — `PROJECT_HISTORY.md`, запись «Дневная сессия Palworld,
2026-08-21». Уроки — `EXP-0022..0027`. Разборы — `researches/cleanup-2026-08-17/` (уборка диска,
377 строк) и `researches/nvidia-tuning/` (конспект по драйверу, 591 строка).

**Инструменты замера — `D:\work\ai_sandbox\_tools\perf-harness\`** (свой README, шесть скриптов,
15 захватов сессии). Дважды подряд харнесс умирал вместе с чатом — больше не умрёт.
**Читать его README перед любым разговором о производительности.**

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
| Phase 2 — the second game | 🟡 подготовлена | Oblivion Remastered: инвентарь снят, манифест на 168 модов исполняется движком; ждёт патча и установки игры |
| Phase 3 — compatibility | 🔲 todo | needs a research doc first |
| Phase 4 — optimization presets | 🔲 todo | |

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

- ✅ **ДОЛГ ПО ТРАВЕ ЗАКРЫТ 2026-08-22 ~01:30 +03:00.** Развязка оказалась НЕ той, что предлагалась:
      `grass.*` до листвы Palworld не доходит вовсе — у игры своя подсистема `UPalFoliageGridModel`
      (`EXP-0031`). Настоящая пара — `r.ViewDistanceScale` × `foliage.DensityScale`. Принято
      владельцем: **дальность 3.0, плотность 0.75** — на утёсе GPU busy **9.32 мс, 90.3 к/с** против
      исходных 17.45 мс и 55.9 к/с, то есть втрое дальше и вдвое быстрее. Записано в
      `_unpacked/UltraGraphics/config.lua` пака и разложено в игру (хэши сверены), коммит `8e18adb`.
      Отвергнуто владельцем по дороге: 0.25 и 0.5 — «жидко», «кое-где словно лысая земля».
- ✅ **Опасный `restore.ps1` обезврежен 21.08 по указанию владельца «вычисти вирусы и зловреды».**
      Скрипт в `F:\_QUARANTINE_C\2026-08-17_2325\deadweight\` переписан: явный список из восьми
      разрешённых записей, отказ по `removed != true`, отказ на весь класс `defender-exclusion`,
      отказ по префиксу `mal-` и по именам вредоносных политик; пробный прогон по умолчанию,
      боевой требует `-Execute` и повышенных прав. Пробный прогон: **8 восстановит, 30 откажет,
      2 пропустит**. Оригинал сохранён рядом как `restore.ps1.ORIGINAL-UNSAFE` — на него ссылается
      отчёт, **запускать его нельзя**. Образцы зловреда (5 задач-загрузчиков, дроппер, политики
      боковой установки расширения, `ext-xfinder`) вынесены в `_MALWARE_DO_NOT_RESTORE\` с
      разбором, что это было. **Машина проверена и чиста:** 14 путей зловреда отсутствуют, задачи
      сняты, в исключениях Defender их нет, дроппера и расширения нет ни в реестре, ни в профилях
      браузеров, заново ничего не завелось. Удаление образцов насовсем — решение владельца, команда
      лежит в `_MALWARE_DO_NOT_RESTORE\ЧТО_ЗДЕСЬ.md`.
- 🔴 **Оставшееся предупреждение:** НЕ запускать `Clear-Quarantine.ps1 -Stamp 2026-08-17_2335
      -Execute`, пока не забраны три вещи ниже — там **единственный экземпляр** сохранения
      Elden Ring и личное видео `ref.mp4` (3.59 ГБ, съёмка с телефона 04.08.2024).
- 🎬 **Настройки OBS: виноват не карантин, а деинсталляция iTunes.** Конфиг цел, в карантине OBS нет
      вовсе. Изменился один файл `basic.ini`: этап 2 уборки снёс iTunes, вместе с ним пропал
      кодировщик **CoreAudio AAC**, и OBS 20.08 молча свалился на `ffmpeg_aac` и переписал профиль.
      Хорошие значения живы в теневых копиях; **файл целиком копировать нельзя** — там же старый
      OAuth-токен YouTube и раскладка доков. Возвращать значения руками, и только после того, как
      кодировщик снова появится в системе. Единственный наблюдаемый путь к нему — переставить
      `D:\Soft\iTunes64Setup.exe` целиком; отдельного пакета Apple Application Support в нём нет
      (проверено). Спросить владельца, нужен ли ему CoreAudio настолько.
- 🖱️ **Задача автозапуска RTSS снята уборкой и до сих пор отсутствует.** RivaTuner на диске,
      процесс не запущен, копия задачи цела и валидна. Возврат — одной командой:
      `.\restore.ps1 -Id task-rtss -Execute` из `F:\_QUARANTINE_C\2026-08-17_2325\deadweight\`,
      повышенная консоль. **Сначала спросить, нужна ли она вообще:** задача `MSIAfterburner` жива и
      в состоянии Ready, а Afterburner сам поднимает RTSS — возврат может создать дубль запуска.
      Влияние на остаточные рывки НЕ измерялось; измерить после возврата, прибор готов.
- 💾 **Файл подкачки перенесён уборкой с D: на C: и снят с автоуправления** (17.08 ~23:44):
      `C:\pagefile.sys` 4096–65536 МБ, уже вырос до 14.4 ГБ. Это независимый источник рывков, и он
      на том самом диске, который сыплет в журнал `disk 51 — ошибка при страничной операции`
      (Kingston A2000, шесть событий 14–19.08). Решение за владельцем: вернуть на D: или закрепить
      фиксированный размер.
- 📦 **Три вещи ждут возврата из карантина** (пробные прогоны выполнены, боевые НЕ запускались):
      `orphan-national-instruments` (432 МБ, продукт числится установленным, 11 записей LabVIEW в
      реестре, назначение пусто — вернуть штатно из повышенной консоли) · сохранение Elden Ring
      (57.9 МБ, единственный экземпляр в мире — забирать **копированием**, не штатным возвратом:
      он перемещает и лишает избыточности) · `ref.mp4` (личное видео, забрать к себе на E:, обратно
      на C: не возвращать).
- 🧨 **ДВА ОПЫТА ЖДУТ СЛОВА ВЛАДЕЛЬЦА — самое ценное, что нашлось вечером 21.08.** Профиль
      приложения Palworld в базе драйвера прочитан (крупнейший долг конспекта закрыт, читалка —
      `_tools/nvidia-drs-reader/`, живую базу не трогали). Он **не пустой**, и обе находки бьют в
      кадр видеокарты, которая занята на ~99 % длины кадра:
      **(1) Замещение DLSS.** `DLSS - Enable DLL Override = On` + `Forced Preset Letter =
      Preset L (Transformer Gen 2)` поверх родной `nvngx_dlss` 3.1.30 из пака. Трансформерная
      модель дороже свёрточных. Это подозреваемый №1 из `EXP-0019`, найденный в базе.
      **(2) `RTX HDR - Enable = On` в Base Profile** — то есть для ВСЕХ процессов. Нейротонмаппер
      SDR → HDR на каждый кадр; все три условия его срабатывания выполнены (рабочий стол в HDR,
      игра отдаёт SDR, играем в окне). Цена не измерена — это механизм, не число.
      Поставлено человеком, не драйвером: из 5618 профилей такие переопределения несут десять, и
      все — игры владельца; `Preset L` встречается в базе один раз. Порядок опытов, предсказания и
      прибор контроля — `researches/nvidia-tuning/README.md`, раздел «Профиль приложения Palworld».
      **По одному опыту за заход, с перезапуском игры.**
- 🖥️ **Конспект по настройкам NVIDIA готов** — `researches/nvidia-tuning/README.md` (591 строка,
      13 разделов, каждая строка помечена достоверностью: ⚑ прочитано на этой машине · A вендор ·
      B замер третьей стороны; тир C — фольклор — вынесен в «Мифы» и в рекомендации не попадает).
      Пять действий, которые он ставит первыми, — доложить владельцу:
      **(1)** скопировать **все три** файла `C:\ProgramData\NVIDIA Corporation\Drs\` в место, куда
      не дотянется чистилка (гайды про «сохрани `nvdrsdb0.bin`» неполны — файлов три);
      **(2)** разрешение НЕ поднимать: у Palworld нет запаса по видеокарте — `GPU busy` 63.25 мс
      при кадре 64.03, это 98.8 %, а 4K это ×3.29 пикселей;
      **(3)** выключить **HDR рабочего стола** — он включён (**проверено независимо:** оверлей
      NVIDIA пишет `IsHdrActive:1` на десктопе, при том что в игре HDR выключен, это разные
      переключатели), и DWM тонмапит каждое SDR-окно, а владелец играет в окне;
      **(4)** «Максимальную производительность» в управлении питанием НЕ трогать — в драйвере
      610.88 это открытый баг NVIDIA [6007998] «may not be applied correctly»; Low Latency Mode
      оставить Off, его перекрывает Reflex; правки делать в «Программных настройках», потому что
      **для Palworld в базе драйвера есть профиль приложения** (проверено: строка найдена в
      `nvdrsdb0.bin`);
      **(5)** перед следующей серией замеров: Shader Cache Size = 10 ГБ, фоновая запись Game DVR
      выключена, оверлей NVIDIA App выключен, Игровой режим включён.
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

### Состояние машины на момент передачи (уточнено вечером 21.08 ~21:40 +03:00)

Проверено, не по памяти. Новый чат начинает отсюда:

| Что | Состояние |
|---|---|
| Palworld | закрыт штатно, сохранение записано 10:12:40 |
| Мод-пак | активен всеми тремя частями (загрузчик UE4SS, `~mods`, `Engine.ini`), `vanilla.ps1` без ключей это показывает |
| `r.ViewDistanceScale` | **1.0** — в источнике пака и в игре, файлы совпадают байт в байт |
| Глобальные параметры 3D (Base Profile) | заводские после «Восстановить», плюс восемь строк, которые оно само и записало (VSync, Tear Control, Preferred Refreshrate, Smooth AFR, четыре G-SYNC). **G-SYNC выключен**, `Application State = Fixed Refresh Rate` — телевизор мерцает на VRR, обратно не включать. **Исключение из «заводских»: `RTX HDR - Enable = On`** — оно пережило сброс и действует на все процессы |
| Профиль приложения Palworld | **НЕ пустой, 24 настройки** — замещение DLSS с `Preset L`, `Maximum Pre-Rendered Frames = 1`. Разбор и порядок опытов — `researches/nvidia-tuning/`, раздел «Профиль приложения Palworld». Правки для игры делать ЗДЕСЬ, а не в глобальных: профиль приложения перекрывает глобальный |
| Копия базы профилей драйвера | снята 21.08 20:53 в `_tools\nvidia-drs-backup\2026-08-21_post-restore\` (три файла + `update.bin`, sha256 сошлись). Читалка базы — `_tools\nvidia-drs-reader\`, она только читает |
| Фоновая запись Game DVR | **выключена агентом 21.08 ~21:35** (было 1). Вернуть: `Set-ItemProperty 'HKCU:\System\GameConfigStore' -Name GameDVR_Enabled -Value 1` |
| Игровой режим Windows | **включён агентом 21.08 ~21:35** (было 0). Вернуть: `Set-ItemProperty 'HKCU:\Software\Microsoft\GameBar' -Name AutoGameModeEnabled -Value 0`. Если испортятся сессии Parsec/Apollo — вернуть |
| Shader Cache Size | **не задан ни в Base Profile, ни где-либо** (во всей базе настройка встречается один раз, и не там). Рекомендация «явные 10 ГБ» не выполнена — это правка через панель, агент её сделать не может |
| Оверлей NVIDIA App | **включён**, не трогали — выключается только в самом App |
| HDR рабочего стола | **ВКЛЮЧЁН** и, вероятно, владельцем не замечен (в игре HDR выключен — это другой переключатель). Кандидат №3 конспекта. **Не путать с `RTX HDR` в профиле драйвера — это два разных выключателя, и гасить их надо по одному** |
| Задача автозапуска RTSS | **отсутствует**, снята уборкой; копия цела |
| Файл подкачки | **ПЕРЕНЕСЁН ОБРАТНО НА D: 21.08 ~22:45** по прямому разрешению владельца («Разрешаю, можешь переносить, потом перезагружу»). В реестре `PagingFiles = D:\pagefile.sys 0 0`, записи для C: нет. **Вступает в силу после перезагрузки** — до неё живым остаётся `C:\pagefile.sys`. Проверить ПОСЛЕ загрузки: `Get-CimInstance Win32_PageFileUsage` должен показать D:, а осиротевший `C:\pagefile.sys` (9.8 ГБ) — исчезнуть сам; не исчез — удалить вручную. Откат: вернуть запись для C: и убрать D:. Дампы ядра выключены (`CrashDumpEnabled = 0`), подкачка на C: ничего не держала |
| Parsec | возвращён (агент убивал его в ходе проверки) |
| Карантин уборки | `F:\_QUARANTINE_C`, 9.4 ГБ, **ничего не восстанавливалось** |
| Оба дерева git | чистые и запушены. Хэши здесь намеренно не записаны — они устаревают от следующего же коммита; смотреть `git log --oneline -5` в `KUMM` и в `D:\work\ai_sandbox\Palworld` |

**Первым делом — доложить владельцу два готовых разбора и получить четыре решения:**

1. **Доложить владельцу итог разбора уборки** — он закончен и лежит в
   `researches/cleanup-2026-08-17/README.md` (377 строк, с доказательствами и дословными выводами
   пробных прогонов). Начать с **двух предупреждений по безопасности** (раздел «Awaiting human
   review» выше), затем четыре его решения: RTSS, файл подкачки, iTunes ради кодировщика OBS,
   три вещи из карантина. **Ничего не восстанавливать без его слова.** Отдельно там же — семь
   дефектов в его собственной тулзе (раздел 5 отчёта), это ему нужнее всего: у сторожа нет понятия
   «настройки», `Remove-Product.ps1` не делает копий вообще, а сгенерированный `restore.ps1` опасен.
2. ✅ **Конспект по NVIDIA доложен вечером 21.08**, и по его пяти первым действиям сделано:
   копия базы профилей снята · Game DVR выключен · Игровой режим включён · `Fixed Refresh Rate`
   оказался уже выставленным «Восстановить». Остались **за владельцем**: Shader Cache 10 ГБ и
   оверлей NVIDIA App — обе правки живут в панели и в App, у агента туда рук нет.

### 🔜 С ЧЕГО НАЧАТЬ СЛЕДУЮЩУЮ СЕССИЮ (вечер 21.08 → ночь 22.08 закрылись на этом)

1. **Вернуть `Preset L` в замещении DLSS — прямая просьба владельца.** Опыт A проведён и закрыт:
   снятие замещения дало **−1.8 мс GPU** (19.4 → 17.6), но владелец посмотрел картинку и решил
   иначе, дословно: «картинка норм, сильно хуже не стала. я бы всё же хотел передовую модель
   использовать». Возврат — NVIDIA App → Графика → Palworld → «Замещение DLSS — предустановки
   модели» → «Пользовательское», Super Resolution → Preset L. После правки перезапуск игры;
   что переключатель лёг — проверять чтением базы (`_tools/nvidia-drs-reader/`), не интерфейсом.
2. **Опыт Б — RTX HDR, и он изменился в пользу владельца.** У Palworld ЕСТЬ свой HDR
   (`bUseHDRDisplayOutput=False`, `HDRDisplayOutputNits=1000` ⚑). Родной HDR и дешевле, и честнее
   по данным, а RTX HDR к приложению, отдающему HDR, применяться перестаёт САМ. То есть опыт —
   не «выключить HDR», а **«включить родной HDR игры»**: картинка остаётся, стоимость нейрофильтра
   уходит. Оговорка: игра идёт в окне (`FullscreenMode=2`), вывод HDR из UE5 в окне может не
   завестись — проверять, а не предполагать.
3. **HDR рабочего стола** — третьим и отдельно от пункта 2: это разные выключатели.

Порядок прежний: ОДИН опыт за заход, перезапуск игры после каждой правки драйвера, значение
сверять мостом **до и после** каждого захвата (за отсутствие сверки уже заплачено одним ложным
замером 22.08 — мод переприменил свой блок посреди серии).

**Если владелец за игрой — трава (см. «Awaiting human review», первый пункт).** Это единственное
незакрытое игровое дело; всё остальное по регрессии закрыто.

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

*(none in the project's own code)* — the known defect worth filing when someone picks it up is the
packaging drift: `package.json` `"files"` omits `Deploy-ModPack.ps1`, so `npm i -g kumm` installs the
Nexus half without the deploy half (verified: `npm pack --dry-run` → 4 files, 15.2 kB).

Framework tickets (not this project's code, kept visible until an update retires them):
- 🟡 `bugs/KAIF/01_package_json_reformatted_wholesale.md` — the `kaif:*` wiring re-serializes the whole
  `package.json`; 24 of 31 diff lines are whitespace-only. Semantically empty, accepted locally, filed
  upstream as [KAIF#16](https://github.com/MikalaiKryvusha/KAIF/issues/16). Expect it again at the next
  `/kaif-update`.
- The install's own field report went upstream as
  [KAIF#17](https://github.com/MikalaiKryvusha/KAIF/issues/17); the placeholder-gate rake was a known
  signal and got a +1 observation on [KAIF#3](https://github.com/MikalaiKryvusha/KAIF/issues/3) rather
  than a duplicate ticket.
