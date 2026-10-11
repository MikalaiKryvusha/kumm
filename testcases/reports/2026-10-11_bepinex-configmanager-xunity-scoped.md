# Run report — BepInEx.ConfigurationManager PR #125, переделка по ответу мейнтейнера: файл XUnity под dll + постоянные объекты текста

**Created:** 2026-10-11 10:56 +03:00 · **Run by:** агент (Claude Opus 5.5) · **Version/build:** форк `MikalaiKryvusha/BepInEx.ConfigurationManager`,
ветка `xunity-scoped` от `d783c04` (19.0), локально, не отправлена; против оригинала 19.0 (sha256 91b1c972…)

## 1. Work

Способ мейнтейнера (ManlyMarco, PR #125, 2026-10-11T07:10Z): перевод файлом XUnity, ограниченным `ConfigurationManager.dll`, плюс наша
правка ширины `ImguiUtils.Content` (`[OWNER]` «делаем» · «или да, передавать постоянные объекты текста - ты прав» · 2026-10-11). Случаи
C1–C5 — `testcases/TC_bepinex_configmanager_xunity_scoped_2026-10-11.md`; разбор — `researches/bepinex-configmanager-pr125/README.md`.

## 2. Contour

- Игра Svarog's Dream (Unity 2020.3.49f1, Mono, BepInEx 5.4.23.5, XUnity.AutoTranslator по ReiPatcher), 1280×720, полный экран.
- На время прогона: `KrinikModMenu.dll` → `.off` (его обход `ConfigWindowRu` иначе переписал бы строки сам), XUnity `EnableIMGUI=True`,
  файл `AutoTranslator/Translation/ru/Text/Plugins/ConfigurationManager/ConfigurationManager.txt`; окно по F8 (родная тема и размер).
- REAL WORLD: accumulated — сейв и настройки владельца (сейв 7/7 с копией 23:57 до прогона); data and machine — его машина; path — F8 в мире.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-10-11 10:45–10:49 | `bash tools/run-game.sh`; `keys.ps1 -Key F8`; `tools/h.sh "shot cm_xua_c1"` (оригинал 19.0) | кадр `cm_xua_c1` |
| 2 | 2026-10-11 10:50 | `tools/h.sh "kill"`; `reg-snap.sh restore`; сборка форка `bin/BepInEx5/ConfigurationManager.dll` (sha256 550c900f…) в `plugins/` | ok |
| 3 | 2026-10-11 10:51–10:55 | `bash tools/run-game.sh`; `keys.ps1 -Key F8`; `tools/h.sh "shot cm_xua_c2"` | кадр `cm_xua_c2` |
| 4 | 2026-10-11 10:55–10:56 | `tools/h.sh "kill"`; возврат 19.0, мода, `Config.ini`, удаление `Plugins/`; `cmp` сейва; `reg query` | 7/7, 1280×720 |
| 5 | 2026-10-11 10:52–10:56 | `ilspycmd -t UnityEngine.GUILayout …IMGUIModule.dll` (`DoWindow`, `LayoutedWindow`) | причина C3 |
| 6 | 2026-10-11 11:05–11:09 | правка XUnity на `v5.3.1` (`dotnet build …Plugin.Core.csproj -c Release -f net35`, ресурсы — локальные заглушки вне git), `Plugin.Core.dll` (sha256 25158a22…) + `ICSharpCode.SharpZipLib.dll` в `Managed/`; CM 19.0; `bash tools/run-game.sh`; F8; `shot cm_xua_d1` | C6 |
| 7 | 2026-10-11 11:10–11:13 | `kill`; CM форка (550c900f…); `run-game.sh`; F8; `shot cm_xua_d2`; `mouse.ps1 -X 630 -Y 404`; `shot cm_xua_d2b` | C7 |
| 8 | 2026-10-11 11:15 | `kill`; возврат Core 5.3.1 (12130747…), CM 19.0, мода, `Config.ini`; `rm` SharpZipLib и `Plugins/`; `cmp` сейва; `reg query` | C8: 7/7, 1280×720 |

## 4. Checks

Hygiene: сборки BepInEx5 и IL2CPP — 0 ошибок.
Functional run: окно настроек модов в игре владельца по F8, прочитаны два кадра и журнал BepInEx.
- C1 pass — обрезка воспроизведена на оригинале: «Закрыті», «Чисто».
- C2 pass — сборка форка, тот же словарь: «Закрыть», «Чисто» целиком.
- C3 fail — файл под dll переводит только заголовок окна, содержимое — нет.
- C4 skipped — следствие C3.
- C5 pass — всё возвращено, сейв 7/7, реестр 1280×720.
- C6 pass — с правкой XUnity журнал: «Attempting to hook ConfigurationManager.ConfigurationManager.SettingsWindow to enable plugin
  specific translations»; содержимое окна по-русски из нашего файла, кнопки 19.0 обрезаны.
- C7 pass — правка XUnity + CM форка: всё по-русски и целиком, «Вкл/Выкл», «Сбросить», оба совета.
- C8 pass — всё возвращено, сейв 7/7, реестр 1280×720.

## 5. Found

- **Дефект XUnity (не ConfigurationManager):** перевод плагина не доходит до окон `GUILayout.Window`. `GUI_DoWindow_Hook` ищет перевод
  плагина по сборке `func.Method`, а `GUILayout.DoWindow` подаёт в `GUI.Window` обёртку `new LayoutedWindow(func, …).DoWindow` из
  `UnityEngine.IMGUIModule` (декомпиляция игры); функция плагина лежит в её поле `m_Func`. Похожая жалоба без ответа — XUnity #534.
- Обрезка подтверждена и снята правкой ширины (C1 против C2).

## 6. Traces

- Кадры: `SvarogsDream/_harness/cm_xua_c1.webp`, `cm_xua_c2.webp`, `cm_xua_d1.webp`, `cm_xua_d2.webp`, `cm_xua_d2b.webp`; вырезки — ветка `pr125-screenshots` форка CM.
- Журнал: `D:/Games/Svarog's Dream/BepInEx/LogOutput.log`, строка «Attempting to hook ConfigurationManager.ConfigurationManager.OnGUI to
  enable plugin specific translations».
- Исходник XUnity: `src/XUnity.AutoTranslator.Plugin.Core/Hooks/Managed/IMGUIHooks.cs` (`GUI_DoWindow_Hook`),
  `IMGUIPluginTranslationHooks.cs` (`HookIfConfigured`).

## 7. Verdict

Pass: правка ширины работает (C2, C7); дефект XUnity найден (C3) и снят правкой `GetPluginFunction` (C6, C7). По слову владельца
отправлено 11:17: XUnity PR #876, ветка PR #125 `ff3cbf8` + ответ мейнтейнеру. Не проверено: IL2CPP, `BlacklistedIMGUIPlugins` в игре,
сборка XUnity из `master` в игре (в игре — 5.3.1 с той же правкой; файлы хуков в 5.3.1 и `master` одинаковы).
