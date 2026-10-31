# Conan Exiles Enhanced 3.0.1 — внешняя карта: где что лежит

> **Created:** 2026-10-26 · **Parent:** правило «две карты на каждую игру» (`AGENT_GUIDE.md` → Notes from the human) · **Status:** заведена
> 2026-10-26 · **Outbound:** —

Пары путей и приборов, которые нужны почти каждый заход. Подробные документы пака — `D:\work\ai_sandbox\ConanExiles\docs\` (01–18).

| Что | Где |
|---|---|
| Игра | `D:\Games\Conan Exiles 3.0.1` (без подпапки `Conan Exiles`; путь — одно место: `ConanExiles/targets.json`, приборы читают через `_config/game_target.py`) |
| Запуск | `ConanSandbox\Binaries\Win64\ConanSandbox-Win64-Shipping.exe` без ключей, рабочая папка — его же (так запускает `_config/launch-bg.ps1`); ярлык владельца «Conan Exiles» на рабочем столе — та же цель (2026-10-28, по его просьбе) |
| Паки модов | `ConanSandbox\Mods\*.pak` + `modlist.txt`; игра распаковывает их в `ConanSandbox\Saved\ExtractedMods\<Мод>-Windows.{pak,utoc,ucas}` |
| Lua-моды UE4SS | `ConanSandbox\Binaries\Win64\ue4ss\Mods\<Мод>\` (`enabled.txt`); исходники — `ConanExiles/_unpacked/<Мод>` |
| Журнал игры | `ConanSandbox\Saved\Logs\ConanSandbox.log` (время журнала = местное − 3 ч) |
| Журнал UE4SS | `ConanSandbox\Binaries\Win64\ue4ss\UE4SS.log` |
| Падения | `ConanSandbox\Saved\Crashes\UECC-*\` (`CrashContext.runtime-xml` — стек и текст, `ConanSandbox.log` бывает, `CrashReportClient.ini`, `UEMinidump.dmp` ≈1,8 МБ или 0 байт); окно отчёта — `Engine\Binaries\Win64\CrashReportClient.exe`, закрывает `_config/close-crash-reporter.ps1` (по PID, только запущенные после отметки `launch-bg.ps1`) |
| Опознаватели в журналах (2026-10-26) | `CrashContext.runtime-xml`: `MachineId`, `LoginId`, `EpicAccountId`, пути `BaseDir`/`RootDir`/`Modules`; `ConanSandbox.log`: `LogInit: Computer:`, `LogInit: User:`, `MachineId=`, IPv4 серверов в сетевых строках. Имя пользователя Windows автора сборки — начало имён наших модов (`Krinik…`): подстановка по всему тексту портит журнал. Обезличивает `_config/player-report/collect_report.ps1` (collect_report.cmd в архиве) |
| Сохранения модов | `ConanSandbox\Saved\SaveGames\*.sav` (Damage Meter, Simple Minimap, Proximity Party …) |
| Сохранение мира (одиночная игра) | `ConanSandbox\Saved\Game_0.db` — SQLite в режиме WAL (рядом во время игры `Game_0.db-wal`, `-shm`); игра сама крутит `Game_0_backup_1…22.db`. Копии агента — `D:\Games\Conan Exiles Mods\_save-backup\<дата_время>-<зачем>\`. **Возврат — только `bash _config/save-restore.sh <папка копии>`** (игра закрыта; удаляет `-wal/-shm`, проверяет целостность; `--check` — проверка живой базы). Голый `cp` поверх базы после падения испортил её 2026-10-30 15:40 («database disk image is malformed» → «Продолжить» молчит, в журнале `No save game profiles found`) |
| Перевод | `ConanSandbox\Content\Localization\Game\ru\Game.locres` (раскатка `_config/deploy-localization.py`) |
| Кит разработчика 2.2 | `F:\CEUE5Devkit` (`UnrealPak`, `UnrealEditor-Cmd`, исходные ассеты игры 2.2 в `UE4\Content`) |
| Пульт агента | `ue4ss\Mods\KrinikAgentRemote\cmd.txt` → `done.txt`; из оболочки — `bash ConanExiles/_config/pult.sh "<команда>"` |
| Re-entry by the agent (2026-10-29) | `_config/esc-when-idle.ps1` (real Esc after the owner's input idle; `W_IngameMenu_C` does not exist before it) → `pult.sh "call W_IngameMenu_C_<N> CloseAndReturnToMainMenu"` → `_config/enter-world-remote.sh` (the second entry loads in ≈ 2–5 s) |
| Канал мода камеры | `ue4ss\Mods\ConanCameraControl\agent-cmd.txt` (`ключ = значение`) |
| Клавиши мода камеры (нумпад) | 8/2 вперёд/назад · 4/6 вбок · 9/3 выше/ниже · 7/1 наклон · +/− дистанция · 5 — вбок в 0 · Ctrl+5 — наклон в 0 · / — записать посадку · 0 — применить · Ctrl+/ — сброс до заводской (с 2026-10-26 23:4x) · Ctrl+0 — найти камеру заново; посадка сама пишется в `Mods\ConanCameraControl\config.lua` |
| Оптимизированный Engine.ini сборки | с 2026-10-30 — файл мода графики `ConanExiles/_unpacked/KrinikConanGraphics/Engine.ini` (поле `engineIni.file` манифеста, `_config/deploy-config.py`, `_config/check-conflicts.py`); до того `_config/Engine.ini` |
| Привязки клавиш игры | `ConanSandbox\Saved\Config\Windows\Input.ini` (CRLF, понимает `Key=None`) — ЕДИНСТВЕННЫЙ живой источник в 3.0.1: `_config/Input.ini` пака — старый, от UE 5.6, `deploy-config.py` его сознательно не возит (2026-10-25). В живом файле — раскладка игры и правки владельца (уворот — боковая кнопка мыши, его слово 23:4x). Править при закрытой игре, с копией в `_config/backup/`. 2026-10-26 23:47: чат гильдии (нумпад −) и чат поблизости (нумпад *) → `None`. Правая кнопка — прицел `SpecialActionV2`; левый Ctrl — тяжёлая атака `SecondaryActionV2` (с луком — выстрел) |

## Приборы совместимости (`ConanExiles/_config/compat/`, 2026-10-26)

| Прибор | Что даёт |
|---|---|
| `smoke-loader.py` | смонтирован ли каждый пак, поднят ли контроллер каждого мода, ошибки слияния таблиц — с названием мода |
| `missing-names-from-kit.py`, `missing-names-from-headers.py`, `missing-by-mod.py` | имена недостающих пакетов из журнала (по киту 2.2 и по заголовкам модов) и разбивка по модам |
| `untranslated-literals.py` | английские фразы в файлах модов вне FText — то, что `.locres` не переведёт |
| `KrinikAgentRemote/Scripts/ui_check.lua` | английский текст в видимых полях открытого экрана |
| `missing-bytecode-ftext.py` | FText с ключом в байткоде, которых нет в описи `all-mods-ftext.csv` (для `.locres`) |

## Правка чужих модов (`ConanExiles/_config/devkit/`, KRINIK MODIFIED, 2026-10-26)

| Прибор | Что делает |
|---|---|
| `patch-mod-asset.py extract / build` | ассет мода из оригинала (`D:\Games\Conan Exiles Mods\_patch-originals\<Мод>.pak`) → правка → склейка куска → новый пак в `<work>/out`; таблицы правок — `_config/localization/asset-strings/<Мод>__<Ассет>.tsv` |
| строки таблицы | `английский\tрусский` — текст свойств; `prop:<Имя>` или `prop:<Экспорт>/<путь>` — число или флаг; `lit:<английский>\t"<русский>"` — строка в байткоде; `dbl:`/`flt:`/`int:<функция>[@n]` — число в байткоде (`int:` — целое, с 2026-10-30); `bool:<функция>@<n>\t<было>\t<стало>` — n-й True/False функции (порядок `kismet-trace.py`); ряды таблиц данных — `delrow:<ряд>`, `fname:<ряд>/<свойство>`, `enum:<ряд>/<свойство>\t<Тип::было>\t<Тип::стало>` (2026-10-30) |
| `kismet.py check / lits` | разбор байткода UE 5.8 с самопроверкой размера; литералы функций |
| `_tools/src/uaj` | UAssetAPI из консоли: `copy`, `exports`, `strings`, `setstr`, `func`, `tojson` |
| `_tools/retoc-5.8`, `_tools/repak` | контейнеры IoStore 5.8 и внешний пак V11 |

Rebuild of all edited paks (2026-10-30): `python -I -X utf8 _config/devkit/rebuild-krinik-paks.py [--only <Мод>] [--install]` — reads the machine field
`krinikBuild` (`{"args": [<Мод>, <Ассет>, <таблица>, …], "env": {…}}`) of each mod in `modpack.json`, builds into `REBUILD_WORK`, and installs only when every
container chunk is byte-identical to the installed pak (proved red against the untouched original: 3 of 199 chunks differ). `retoc-5.8/retoc.exe` compresses
with Oodle since 2026-10-30 (local commit 8e2eedf of `_tools/src/retoc`; the uncompressed one — `retoc-2026-10-26-nocompress.exe`).

Правленые паки лежат в библиотеке `mods/_krinik-modified/<id>/`, в `modpack.json` у мода — поле `krinikModified` с командой пересборки:
Exiles Fishing (перевод панели), The Damage Meter (угол свёрнутого окна), Hosav's Custom UI (метрики сервера выключены).
