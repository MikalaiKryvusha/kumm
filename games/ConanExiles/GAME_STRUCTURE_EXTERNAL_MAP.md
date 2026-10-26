# Conan Exiles Enhanced 3.0.1 — внешняя карта: где что лежит

> **Created:** 2026-10-26 · **Parent:** правило «две карты на каждую игру» (`AGENT_GUIDE.md` → Notes from the human) · **Status:** заведена
> 2026-10-26 · **Outbound:** —

Пары путей и приборов, которые нужны почти каждый заход. Подробные документы пака — `D:\work\ai_sandbox\ConanExiles\docs\` (01–18).

| Что | Где |
|---|---|
| Игра | `D:\Games\Conan Exiles 3.0.1` (без подпапки `Conan Exiles`; путь — одно место: `ConanExiles/targets.json`, приборы читают через `_config/game_target.py`) |
| Паки модов | `ConanSandbox\Mods\*.pak` + `modlist.txt`; игра распаковывает их в `ConanSandbox\Saved\ExtractedMods\<Мод>-Windows.{pak,utoc,ucas}` |
| Lua-моды UE4SS | `ConanSandbox\Binaries\Win64\ue4ss\Mods\<Мод>\` (`enabled.txt`); исходники — `ConanExiles/_unpacked/<Мод>` |
| Журнал игры | `ConanSandbox\Saved\Logs\ConanSandbox.log` (время журнала = местное − 3 ч) |
| Журнал UE4SS | `ConanSandbox\Binaries\Win64\ue4ss\UE4SS.log` |
| Падения | `ConanSandbox\Saved\Crashes\UECC-*\` (`CrashContext.runtime-xml`, `ConanSandbox.log`) |
| Сохранения модов | `ConanSandbox\Saved\SaveGames\*.sav` (Damage Meter, Simple Minimap, Proximity Party …) |
| Перевод | `ConanSandbox\Content\Localization\Game\ru\Game.locres` (раскатка `_config/deploy-localization.py`) |
| Кит разработчика 2.2 | `F:\CEUE5Devkit` (`UnrealPak`, `UnrealEditor-Cmd`, исходные ассеты игры 2.2 в `UE4\Content`) |
| Пульт агента | `ue4ss\Mods\KrinikAgentRemote\cmd.txt` → `done.txt`; из оболочки — `bash ConanExiles/_config/pult.sh "<команда>"` |
| Канал мода камеры | `ue4ss\Mods\ConanCameraControl\agent-cmd.txt` (`ключ = значение`) |

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
| строки таблицы | `английский\tрусский` — текст свойств; `prop:<Имя>` или `prop:<Экспорт>/<путь>` — число или флаг; `lit:<английский>\t"<русский>"` — строка в байткоде |
| `kismet.py check / lits` | разбор байткода UE 5.8 с самопроверкой размера; литералы функций |
| `_tools/src/uaj` | UAssetAPI из консоли: `copy`, `exports`, `strings`, `setstr`, `func`, `tojson` |
| `_tools/retoc-5.8`, `_tools/repak` | контейнеры IoStore 5.8 и внешний пак V11 |

Правленые паки лежат в библиотеке `mods/_krinik-modified/<id>/`, в `modpack.json` у мода — поле `krinikModified` с командой пересборки:
Exiles Fishing (перевод панели), The Damage Meter (угол свёрнутого окна), Hosav's Custom UI (метрики сервера выключены).
