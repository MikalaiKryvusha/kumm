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
