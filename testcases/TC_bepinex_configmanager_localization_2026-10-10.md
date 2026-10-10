# Test cases — BepInEx.ConfigurationManager: поддержка языков и русский перевод (PR в BepInEx/BepInEx.ConfigurationManager)

> **Основание:** `[OWNER]` «BepInEx делаем им пр на русскую локализаци.» · «В этом чате BepInEx - собирай, тестируй, готовим пр» ·
> 2026-10-10 ≈23:30. Фон: issues #39, #81 — у программы нет своих языков.
>
> **Сборка:** форк `D:\work\ai_sandbox\_forks\BepInEx.ConfigurationManager` (ветка от `d783c04` «Version up to 19.0»):
> `Utilities/Localization.cs` (словарь по английским строкам, `ru`), настройка `General.Language` (`Auto` / `en` / `ru`), все строки окна —
> через `Localization.Tr`. Собраны оба варианта: BepInEx5 (Mono) и IL2CPP — 0 ошибок. **Сцена:** Svarog's Dream (Mono, BepInEx 5.4.23.5),
> сборка форка вместо оригинала (оригинал — `_backups/configmanager-19.0-original`); наш обход `KrinikModMenu/ConfigWindowRu` отступает,
> когда в программе есть `Localization`. Сейв владельца — копия; после прогона — `kill`, сейв 7/7, реестр.

| № | Шаг | Ожидается | Как смотрим | Статус |
|---|---|---|---|---|
| C1 | Запуск: журнал — программа загрузилась без ошибок; наш обход пишет «patch skipped» | строки журнала, исключений 0 | `LogOutput.log` | pass 23:37 — «Loading [Configuration Manager 19.0]», «config window ru: ConfigurationManager has its own languages — patch skipped», исключений 0 |
| C2 | Меню по Esc → «Настройки модов», `Language = Auto` на русской Windows | окно по-русски: «Настройки модов», «Обычные / Клавиши / Расширенные / Отладка», «Журнал», «Закрыть», «Поиск:», «Очистить», «Развернуть все»; кнопки целиком | кадр | pass 23:37 — `pr_sheet`: окно по-русски, кнопки полными словами и целиком, совет переносится второй строкой |
| C3 | Раскрыть мод: «Вкл / Выкл» у переключателей, «Сбросить» у настроек целиком | — | кадр | pass 23:38 — `pr_ru3_crop`: «Выкл», «Сбросить» целиком, второй совет по-русски |
| C4 | `Language = en` на лету (пульт `cfg com.bepis.bepinex.configurationmanager General Language en`) | окно по-английски, как оригинал 19.0 | кадр | pass 23:38 — `pr_en`: «Plugin / mod settings», «Normal settings», «Close» — как 19.0 |
| C5 | Обратно `Auto` | снова по-русски | кадр | pass 23:38 — `pr_auto`: снова по-русски |
| C6 | После: оригинальная программа 19.0 возвращена; `kill`, сейв 7/7, реестр 1280/720/1 | как до прогона | `sha256sum`, `cmp`, `reg query` | pass 23:39 — оригинал 19.0 возвращён (sha256 91b1c972…), сейв 7/7 без отката, реестр 1280/720/1; в .cfg осталась строка `Language = Auto` — 19.0 её не читает |
