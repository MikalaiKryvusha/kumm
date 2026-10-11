# Test cases — BepInEx.ConfigurationManager PR #125, переделка: перевод файлом XUnity под dll + постоянные объекты текста

> **Основание:** ответ мейнтейнера в PR #125 (ManlyMarco, 2026-10-11T07:10Z: «adding scoped translation files to this repository
> would be the best way»); `[OWNER]` «делаем» · «или да, передавать постоянные объекты текста - ты прав» · 2026-10-11. Разбор —
> `researches/bepinex-configmanager-pr125/README.md`.
>
> **Сборка:** форк `D:\work\ai_sandbox\_forks\BepInEx.ConfigurationManager`, ветка `xunity-scoped` от `d783c04` (19.0): без словаря
> в коде; `ImguiUtils.Content(text)` — постоянный `GUIContent` для 21 надписи; файл
> `Translations/ru/Text/Plugins/ConfigurationManager/ConfigurationManager.txt`. **Сцена:** Svarog's Dream (Mono, BepInEx 5.4.23.5),
> окно по F8, **наш мод `KrinikModMenu` на время прогона выключен** (иначе его обход `ConfigWindowRu` сам перепишет строки, и опыт
> ничего не покажет); XUnity `EnableIMGUI=True`; файл перевода — в `AutoTranslator/Translation/ru/Text/Plugins/ConfigurationManager/`.
> Сейв перед прогоном 7/7 с `_backups/svarog-saves-2026-10-10_2357-state`; реестр — `reg-snap.sh`.
>
> Измерения: оригинал 19.0 против форка при одном и том же файле перевода (контрольный случай — C1); глобальный словарь XUnity не
> трогается (C3). Не покрыто: IL2CPP-игра (только сборка), другие языки, другие темы окна.

| № | Шаг | Ожидается | Как смотрим | Статус |
|---|---|---|---|---|
| C1 | Оригинал 19.0 + файл перевода, F8 | окно по-русски, но кнопки по ширине английского слова: «Закрыт…», «Очист…» (контроль: обрезка воспроизводится без правки) | кадр | pass 10:49 (обрезка есть) — `cm_xua_c1`: «Закрыті», «Чисто» обрезаны; но по-русски только заголовок «Настройки модов», остальное английское (см. C3); «Закрыть»/«Чисто» — из общего машинного словаря игры, не из нашего файла |
| C2 | Сборка форка + тот же файл, F8 | те же надписи по-русски, кнопки полными словами: «Закрыть», «Очистить», «Развернуть все» | кадр | pass 10:55 — `cm_xua_c2`: тот же словарь игры, «Закрыть» и «Чисто» целиком (в C1 — «Закрыті», «Чисто» обрезаны); правка ширины работает. Остальные надписи английские — дефект C3 |
| C3 | Журнал XUnity и глобальный словарь | перевод подхвачен как перевод плагина; в `Translation/ru/Text/*.txt` вне `Plugins/` строк «Close=» не прибавилось | `LogOutput.log`, `grep` | fail 10:50 — журнал: «Attempting to hook ConfigurationManager.ConfigurationManager.OnGUI to enable plugin specific translations», но содержимое окна файлом не переведено. Причина (исходник XUnity `GUI_DoWindow_Hook` + декомпиляция `GUILayout.DoWindow` игры): `GUILayout.Window` подаёт в `GUI.Window` обёртку `LayoutedWindow.DoWindow` из `UnityEngine.IMGUIModule` — XUnity ищет перевод плагина по сборке этой обёртки и не находит; перевод плагина действует только внутри `OnGUI` (заголовок) |
| C4 | Раскрыть мод (щелчок по имени) в форке | «Вкл/Выкл», «Сбросить» целиком; совет переносится второй строкой | кадр | skipped — файл под dll до содержимого окна не доходит (C3), смотреть нечего |
| C6 | Правка XUnity (`IMGUIWindowFunctions.GetPluginFunction`, сборка v5.3.1 + правка, только `Plugin.Core.dll` + `ICSharpCode.SharpZipLib.dll` рядом) + оригинал CM 19.0 + файл под dll, F8 | содержимое окна по-русски из НАШЕГО файла («Обычные», «Поиск:», «Развернуть все», совет); кнопки обрезаны (19.0 без правки ширины); в журнале — «Attempting to hook ConfigurationManager.ConfigurationManager.SettingsWindow» | кадр, журнал | pass 11:09 — журнал: строка 254 «Attempting to hook ConfigurationManager.ConfigurationManager.SettingsWindow to enable plugin specific translations» (в C3 её не было); `cm_xua_d1_crop` (4K): «Обычные», «Клавиши», «Расширенные», «Отладка», «Журнал», «Поиск:», совет по-русски из нашего файла; «Закрыті», «исти», «звернуть в» обрезаны |
| C7 | Правка XUnity + сборка форка CM (`092377c`) + файл, F8; раскрыть мод | всё по-русски и целиком: «Закрыть», «Очистить», «Развернуть все», «Вкл/Выкл», «Сбросить» | кадр | pass 11:13 — `cm_xua_d2`: «Обычные … Закрыть», «Поиск:», «Очистить», «Развернуть все» целиком, совет переносится второй строкой; `cm_xua_d2b` (раскрыт Krinik Fixes): «Вкл», «Выкл», «Сбросить» целиком, второй совет по-русски |
| C8 | После C6–C7: исходная `Plugin.Core.dll` (5.3.1) возвращена, `SharpZipLib` убрана, плюс всё из C5 | sha256 Core как до прогона; остальное как C5 | `sha256sum`, `cmp`, `reg query` | pass 11:15 — Core 5.3.1 sha256 12130747… (как копия до прогона), CM 19.0 91b1c972…, SharpZipLib нет, `KrinikModMenu.dll` на месте, `EnableIMGUI=False`, `Plugins/` нет, сейв 7/7, реестр 1280×720, полный экран |
| C5 | После: 19.0 возвращена, `KrinikModMenu` включён, `EnableIMGUI=False`, файл перевода убран; `kill`, сейв 7/7, реестр | как до прогона | `sha256sum`, `cmp`, `reg query` | pass 10:56 — 19.0 возвращена (sha256 91b1c972…), `KrinikModMenu.dll` на месте, `EnableIMGUI=False`, папки `Plugins/` нет, сейв 7/7, реестр 1280×720, полный экран |
