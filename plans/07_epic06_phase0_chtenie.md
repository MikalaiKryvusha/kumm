# План 07 — эпик 06, фаза 0: безоконный читатель игры и модов

> **Создан:** 2026-09-12 ~00:45 +03:00
> **Родитель:** `plans/06_EPIC_conan_devkit_toolchain.md` → «Фаза 0 — Чтение»
> **Статус:** 🔲 не начат · доказательства уже есть: кривая опыта прочитана 12.09 (`researches/conan-devkit/`), пак `ChestLabels` и `UIMod_Hosav` распакованы штатным `UnrealPak`
> **Вовне:** —

## Вектор цели (Achieve)

От «правда игры добывается по именам файлов, содержимое паков не читается» — к «любая таблица
игры и любой пак мода читаются одной командой из скретчпада или пака, без окна редактора».

## Критерии приёмки

| # | Критерий | Шкала · Прибор · Цель |
|---|---|---|
| P0.1 | `devkit-run.ps1` запускает командлет без окна и возвращает код | код возврата и наличие строки `Python script executed successfully` в журнале · сам скрипт · **0 и строка есть**; время ≤ 3 мин |
| P0.2 | `dt-export.py` экспортирует названные таблицы | CSV-файлов на выходе · `ls _config/devkit/exports/` · **5 из 5**: `DT_ExperienceSystemLevel`, `DT_FeatsPerLevel`, `DT_MonsterXP`, `DT_AttributeSystem`, `DT_ExilesJourneyXPTable` |
| P0.3 | `dt-export.py --list` перечисляет таблицы по маске | строк в списке для маски `Progression/DT_*` · вывод скрипта · **≥ 20** (в папке 24 файла `DT_*`) |
| P0.4 | `pak-inspect.py` читает все живые паки | модов с прочитанным `modinfo.json` и числом ассетов · `pak-inspect.py --all` · **44 из 44** |
| P0.5 | матрица переопределений посчитана | строк «ассет вне `/Mods/<имя>/` → мод» · `overrides.csv` · **≥ 1** (MrS известен заранее — контроль, что матрица умеет краснеть) |
| P0.6 | страж среды называет расхождения | вывод `devkit-env.py` · **печатает CL кита и игры и слово `MISMATCH`** (сейчас они разные) |

Сценарий для P0.2 (форма «Ситуация · Действие · Результат · Проверка»):

- Ситуация. Кит лежит в `F:\CEDevKit\CEUE5Devkit`, редактор не запущен, `exports/` пуст.
- Действие. Агент запускает `.\devkit-run.ps1 -Python dt-export.py -- /Game/Systems/Progression/DT_ExperienceSystemLevel`.
- Результат. В `exports/` появляется `DT_ExperienceSystemLevel.csv` с 60 строками, у 12-й строки `LevelStart` = 61825.
- Проверка. `python -c "import csv;r=list(csv.DictReader(open('exports/DT_ExperienceSystemLevel.csv')));print(len(r),r[11]['LevelStart'])"` печатает `60 61825`.

## Что уже доказано (не переделывать)

- Запуск: `UnrealEditor-Cmd.exe <uproject> -run=PythonScript -Script=<py> -EnablePlugins=PythonScriptPlugin -unattended -nopause -NullRHI -nosplash -stdout -FullStdOutLogOutput -abslog=<log>` — 1 мин 52 с, скрипт 20 мс. Образец: `researches/conan-devkit/smoke-dump-xp.py`.
- В `unreal.DataTableFunctionLibrary` есть `get_data_table_row_names`, `get_data_table_column_names`, `get_data_table_column_as_string`; **нет** `export_data_table_to_csv` (проверено — `AttributeError`). CSV собираем сами из колонок.
- `UnrealPak.exe <обёртка>.pak -List | -Extract <dir>` и `UnrealPak.exe <Мод>-Windows.utoc -List | -Extract <dir>` работают; распаковка контейнера даёт `.uheader` + `.uexp` (+ `.ubulk`) на ассет — Zen-формат, содержимое расжато.

## Шаги

- [ ] **Ш1. Папка приборов.** `ConanExiles/_config/devkit/` + `README.md` (что · как · что требует · подвох на каждый прибор); `.gitignore` для `exports/*.json` не нужен — CSV мелкие и полезны в git.
- [ ] **Ш2. `devkit-env.py`.** Печатает: путь кита, `Build.version` (CL, ветка), CL игры из exe (регэксп `++exiles+release-CL-\d+` в UTF-16), место на C:/F:, жив ли `zenserver.exe`, есть ли USN-журнал на F:. Слово `MISMATCH` при разных CL. Проверка на сломанной версии: подменить путь к exe на любой другой файл → `GAME CL: not found`, код 2.
- [ ] **Ш3. `devkit-run.ps1`.** Параметры `-Python <py>`, `-Args`, `-TimeoutMin` (умолч. 10), `-Log`. Страж: ≥ 10 ГБ на C: и ≥ 20 на F:, иначе отказ. `-ddc=NoShared` в пробе: если убирает 10-секундный таймаут `fileserver.ci-net.internal` — оставить. Скрытое окно, журнал в `_config/devkit/logs/<дата>.log`, код возврата процесса + грепаемый маркер `DEVKIT_RUN_OK`. Проверка красным: скрипт с `raise` → код ≠ 0 и маркера нет.
- [ ] **Ш4. `dt-export.py`** (Unreal Python). Аргументы: пути таблиц; `--list <маска>` через `unreal.AssetRegistryHelpers` (класс `DataTable`). CSV: `RowName` + колонки с отрезанным GUID-хвостом (`LevelStart_3_AA3E…` → `LevelStart`), сортировка строк как в таблице. Выход в `_config/devkit/exports/<имя>.csv`. Первый прогон — пять таблиц P0.2; золотой контроль: `DT_ExperienceSystemLevel.csv` побайтно равен `researches/conan-devkit/DT_ExperienceSystemLevel.csv` (кроме имени колонок).
- [ ] **Ш5. `pak-inspect.py`.** Команды: `list <pak>` (обёртка → `modinfo`, платформы, внутренний список с сжатием) · `extract <pak> <dir>` (обёртка и Windows-контейнер) · `--all` по `modlist.txt` игры → `mods-registry.csv` (имя, автор, версия, Steam id, `devkitRevisionNumber`, число ассетов) и `overrides.csv` (ассеты, смонтированные ВНЕ `/Content/Mods/<папка>/` — то есть переопределения ванильных путей, с именем мода). Граница: чтение из папки игры, запись только в `<dir>` внутри скретчпада или пака; сторож в коде отказывается писать под `D:\Games`.
- [ ] **Ш6. `textscan.py`** (перенос из скретчпада, доказан 12.09 на `UIMod_Hosav`): английские фразы по `.uexp` распакованного мода, счёт на файл. Нужен фазе 2 для «кто везёт непереведённый текст».
- [ ] **Ш7. Сверка с журналом игры.** `overrides.csv` против `who-overwrites-table.py` (09.09: 46 спорных строк): матрица обязана назвать MrS как единственного, кто монтирует в `UI/Inventory/Attributes/` — уже известный факт как контроль, что прибор краснеет.
- [ ] **Ш8. Документы.** README приборов; `STATUS.md` — раздел «Dev Kit»; правка `plans/04` п. 6 (локализация у игры ЕСТЬ); пак `docs/02` §4 — актуальный абзац (169 ГБ, `F:`, безоконный запуск, `-ScriptDir`).
- [ ] **Ш9. Уроки** в `EXPERIENCE.md`: «сперва штатный инструмент вендора, потом свой парсер» и «страх шейдеров — только про окно».

## Проверка по наблюдению

Каждый прибор доказывается на СЛОМАННОЙ версии до зелёного (Ш2, Ш3, Ш7 — названы). Итог фазы —
таблица P0.1–P0.6 с наблюдёнными числами, а не галочками.

## Риски

- (а) Место: DDC на C: растёт с каждым новым типом ассетов, который трогает скрипт (текстуры —
  дорого). Экспорт таблиц текстур не касается. Страж в Ш3.
- (б) `zenserver.exe` остаётся жить; команда остановки печатается стражем среды.
- (в) `get_data_table_column_as_string` отдаёт структуры строкой `(A=1,B=2)` — для вложенных
  структур CSV будет с одной «жирной» колонкой; резать не пытаться, это уже потребитель.
