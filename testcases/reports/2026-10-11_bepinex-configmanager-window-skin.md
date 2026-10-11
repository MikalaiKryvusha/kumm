# Run report — BepInEx.ConfigurationManager: тема окна отдельным модулем (WindowSkin) + наш KrinikModMenu как модуль темы

**Created:** 2026-10-11 11:25 +03:00 · **Run by:** агент (Claude Opus 5.5) · **Version/build:** форк CM, ветка `window-skin` от `d783c04`
(сборка BepInEx5 sha256 4d4a6095…); `KrinikModMenu` сборки 2026-10-11 11:21 (cd903eec…)

## 1. Work

Свойство `ConfigurationManager.WindowSkin` и именованные стили заголовков (`[OWNER]` «и делаем ПР по теме» · 2026-10-11); наш
`KrinikModMenu` отдаёт тему через него, без него — прежним путём. Случаи C1–C4 — `testcases/TC_bepinex_configmanager_window_skin_2026-10-11.md`.

## 2. Contour

- Svarog's Dream (Unity 2020.3.49f1, Mono, BepInEx 5.4.23.5), 1280×720, полный экран; окно по F8 (кнопка `KrinikModMenu` в меню — то же окно).
- REAL WORLD: accumulated — сейв и настройки владельца (сейв 7/7 с копией 23:57 до и после); data and machine — его машина; path — F8 в мире.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-10-11 11:19–11:22 | `dotnet build src/KrinikModMenu -c Release`; dll в `plugins/KrinikModMenu/` (старая — `_backups/krinikmodmenu-2026-10-11-before-windowskin`); CM 19.0; `bash tools/run-game.sh`; F8; `tools/h.sh "shot ws_c1"` | C1 |
| 2 | 2026-10-11 11:23–11:24 | `kill`; CM `window-skin`; `run-game.sh`; F8; `shot ws_c2`; `mouse.ps1 -X 631 -Y 526`; `shot ws_c2b` | C2 |
| 3 | 2026-10-11 11:24 | `tools/h.sh "cfg krinik.svarogsdream.modmenu Window Theme false" "shot ws_c3"` | C3 |
| 4 | 2026-10-11 11:25 | `cfg … Theme true`; `kill`; `reg-snap.sh restore`; CM 19.0; `cmp` сейва; `reg query` | C4 |

## 4. Checks

Hygiene: сборки CM (BepInEx5, IL2CPP) и `KrinikModMenu` — 0 ошибок.
Functional run: окно настроек модов в игре владельца, четыре кадра прочитаны глазом, журнал — исключений 0.

- C1 pass — новый мод + CM 19.0: тема как раньше.
- C2 pass — CM с `WindowSkin`: та же тема, заголовки модов и разделов золотом из именованных стилей.
- C3 pass — тема выключена: родной серый вид.
- C4 pass — всё возвращено, сейв 7/7, реестр 1280×720.

## 5. Found

- none — дефектов нет. Отличие пути `WindowSkin` от старого: под несдвинутым окном видно родное затемнение мира (старый путь гасил
  его, насильно ставя `_windowWasMoved`) — поведение самого CM, не дефект.

## 6. Traces

- Кадры: `SvarogsDream/_harness/ws_c1.webp`, `ws_c2.webp`, `ws_c2b.webp`, `ws_c3.webp`.
- Журнал: `D:/Games/Svarog's Dream/BepInEx/LogOutput.log`.

## 7. Verdict

Pass: `WindowSkin` даёт модулю темы всё, что наш мод брал Harmony и рефлексией; старая CM работает с новым модом как раньше.
