# Run report — BepInEx.ConfigurationManager PR #129: 23 перевода окна в игре, кадр на каждый язык

**Created:** 2026-10-14 19:26 +03:00 · **Run by:** агент (Claude Opus 5.5) · **Version/build:** форк `MikalaiKryvusha/BepInEx.ConfigurationManager`,
ветка `translations-20`: `c222312` (файлы) → `0421d3c` (короче подписи tl, sw, lv) → `1234297` (вёрстка кнопки сброса)

## 1. Work

PR #129 — 23 файла перевода XUnity под `ConfigurationManager.dll`. Основание: `[OWNER]` «протестировать бы, чтобы бля ПР был протестирован!
И написать, что каждую протестировали, и по каждой скриншот приложить!» · 2026-10-14. Кейсы K0–K1, L1–L23, V1–V2, R1 —
`testcases/TC_bepinex_configmanager_translations_23_2026-10-14.md`; разбор языков — `researches/bepinex-configmanager-translations/`.

## 2. Contour

- Svarog's Dream (Unity 2020.3.49f1 Mono, BepInEx 5.4.23.5), главное меню — мир не загружался, сейв не трогался.
- CM — сборки ветки PR: 1d4aa341 (K0, K1, первые языки) → e81864a9 (правка 1) → b2e1d434 (правки 1–2; кадры 22 языков) → f54ed440 (+ правка 3,
  строка цвета; кадры поиска и кадры en, sw на 4K). XUnity Core 5.3.1 с правкой #876 (25158a22) + `ICSharpCode.SharpZipLib.dll`,
  `EnableIMGUI=True`, `KrinikModMenu.dll` выключен. Файл языка — `AutoTranslator/Translation/ru/Text/Plugins/ConfigurationManager/ConfigurationManager.txt`
  (язык игры `ru`).
- Экран: 1280×720 (виртуальный, стрим владельца) до ≈19:17; после его отключения — 3840×2160, координаты мыши сдвинуты на +1280.
- REAL WORLD: accumulated — установка и настройки владельца (копии в `_backups/cm-2026-10-14-before-translations-23/`); data and machine — его
  машина; path — F8 в игре, как у игрока.

## 3. Runs

Время — по файлам кадров (`ls --time-style`), остальное ≈.

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-10-14 18:33–18:36 | копии; установка сборок; `Start-Process`; `keys.ps1 -Key F8`; `mouse.ps1 -X 631 -Y 189`; `h.sh "shot cmt_en"`; `keys.ps1 -Key ALT,R` | K0 pass; Alt+R без эффекта |
| 2 | 2026-10-14 ≈18:36–18:47 | `bash cmt_one.sh <lang>` (kill → файл → чистый запуск → F8 → раскрыть BepInEx → shot): ru, zh-CN, zh-TW, ja, ko, es, fr, pt | текст целый; «Сбросить» за краем у ru, ja, ko, es, fr, pt |
| 3 | 2026-10-14 ≈18:47–18:58 | правки 1–2, `dotnet build ConfigurationManager.sln -c Release -m:1`, `cmt_one.sh` es, en, ru, fr | обрезки нет, английский без изменений |
| 4 | 2026-10-14 ≈18:58–19:09 | `cmt_one.sh` на b2e1d434: zh-CN zh-TW ja ko es pt id de tr vi tl it sw pl uk be lt lv et ms nl ro (tl, sw, lv — повторно после укорочения подписей; nl — повторно, F8 ушла раньше готовности игры) | 23 pass |
| 5 | 2026-10-14 ≈19:10–19:20 | поиск «лу» (раскладка ru) + колесо: `cmt_sw_keys`, `cmt_en_keys`, `cmt_sw_keys2` (19:15); правка 3 → f54ed440; `XOFF=1280 cmt_one.sh sw`/`en` + поиск, кадры 4K `cmt_sw_color` (19:19), `cmt_en_color` | строка цвета: «Weka upya» целиком |
| 6 | 2026-10-14 ≈19:21–19:23 | `h.sh kill`; возврат CM, Core, `Config.ini`, мода; `rm` SharpZipLib и файла; `rmdir Plugins/…`; `reg-snap.sh restore`; `reg add` 1280×720 | R1 pass (реестр — руками) |

## 4. Checks

Hygiene: сборки BepInEx5 и IL2CPP — 0 ошибок; в zip 24 файла перевода (`BepInEx/Translation/<lang>/…`, сборка решения с `-m:1`; без `-m:1`
параллельная сборка двух проектов один раз упала на общей временной папке); ключи всех 23 файлов = ключи `ru` (скрипт).
Functional run: окно настроек модов по F8 в игре владельца, 23 языка + английский и русский контроли, каждый кадр прочитан глазом; лист всех 24
опубликованных вырезок прочитан глазом после публикации.
- K0 pass · K1 fail→обход (Alt+R не меняет язык; чистый запуск с файлом — меняет).
- L1–L23 pass — все строки окна на языке, буквы целые (CJK, хангыль, вьетнамские знаки, ı/İ, ș/ț, ў, балтийские), кнопки целиком.
- V1 pass — после трёх правок вёрстки обрезки нет ни в раскрытом BepInEx, ни в поиске с ползунками и цветом; V2 pass — английский без изменений.
- R1 pass — всё возвращено; реестр после `restore` был 3840×2160 из старого снимка, возвращён 1280×720/1.
- Не покрыто: подсказки назначения клавиш («Press any key», «Set...»), IL2CPP, другие игры.

## 5. Found

- **Вёрстка CM:** правая колонка оставляет место только под английское «Reset»; длинный перевод выдавливает кнопку за край и включает
  горизонтальную прокрутку — и у принятого `ru`. Три места: поля фиксированной ширины, перенос флажков без учёта отступов, поле цвета.
  Исправлено коммитом `1234297` (для английского окна — ноль изменений).
- **Подписи фильтров tl, sw, lv** длиннее окна → окно расширялось; укорочены (`0421d3c`).
- **Alt+R XUnity** не переводит окно на лету в этой сборке (5.3.1 + #876) — следа в журнале нет; не разбиралось.
- **`reg-snap.sh`:** «kept snapshot» молча держал снимок прошлой сессии (4K); теперь сравнивает с реестром и предупреждает (красный на старом
  снимке, тихий на совпадающем — проверено 19:2x).
- **Ошибка агента при публикации:** вырезки `en` и `sw` сделаны из кадров, перезаписанных запуском на 4K, по координатам 720p — в PR ушёл кусок
  меню вместо окна. Найдено на сверке, заменено (`8db7afc`, `en-final`, `sw-final`), ссылки в сообщении исправлены, все 26 ссылок — 200, лист
  прочитан глазом.

## 6. Traces

- Кадры: `SvarogsDream/_harness/cmt_*.webp`; вырезки окна — ветка `pr129-screenshots` форка (`e786afb`, `8db7afc`).
- PR: https://github.com/BepInEx/BepInEx.ConfigurationManager/pull/129 · сообщение с кадрами — issuecomment-6173031223.
- Журнал: `D:/Games/Svarog's Dream/BepInEx/LogOutput.log` — «Attempting to hook ConfigurationManager.ConfigurationManager.SettingsWindow to
  enable plugin specific translations» в каждом запуске.

## 7. Verdict

Pass: 23 языка проверены в игре, по кадру на каждый, кадры в PR. Вёрстка кнопки сброса исправлена отдельным коммитом. Не проверено: подсказки
назначения клавиш, IL2CPP.
