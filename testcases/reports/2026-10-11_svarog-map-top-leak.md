# Run report — «грязь над картой»: наше небо проступало в полосе над вкладками меню

**Created:** 2026-10-11 12:32 +03:00 · **Run by:** агент (Claude Opus 5.5) · **Version/build:** KrinikColorRework 2.2.0 + правка `Sky.cs`
(сборка 2026-10-11 ≈12:30)

## 1. Work

`[OWNER]` «Грязь над картой - какая-то часть мира словно вверху просачивается» · 2026-10-10 ≈23:33. Случаи —
`testcases/TC_svarog_map_top_leak_2026-10-11.md` (C1–C4).

## 2. Contour

- Svarog's Dream, 1280×720, полный экран, сейв владельца у Бары, время идёт; экран карты — `call InfoPanelEnabler OpenCloseInfoPanelMap`.
- REAL WORLD: accumulated — сейв владельца (7/7 до и после); data and machine — его машина; path — экран карты, как его открывает игрок.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-10-11 12:27–12:29 | `run-game.sh`; `call InfoPanelEnabler OpenCloseInfoPanelMap`; `shot mt_map`; `dump UI/InfoPanel`; `cfg … Sky Enabled false` + `shot mt_nosky`; `comps Camera 10` | куски неба и воды в полосе; без неба их нет |
| 2 | 2026-10-11 12:29 | `ilspycmd -t InfoPanelEnabler`, `-t PerformanceImprovementsHelper` | `Camera.main.cullingMask = 0` под MapPanel / InfoPanels |
| 3 | 2026-10-11 12:30–12:31 | правка `Sky.cs`; `dotnet build src/KrinikColorRework`; `run-game.sh`; карта открыть / закрыть, `shot mf_*`; журнал «sky off / sky on» | полоса чёрная |
| 4 | 2026-10-11 12:31 | `kill`; `reg-snap.sh restore`; `cmp` сейва | 7/7 |

## 4. Checks

Hygiene: сборка мода — 0 ошибок.
Functional run: экран карты в игре владельца при идущем времени, кадры прочитаны глазом и замером верхней полосы.

- C1 pass — найдено: в полосе над вкладками куски неба и воды (максимум 153/177/199); источник — наше небо (без него — чисто).
- C2 skipped — источник найден на экране карты.
- C4 pass — после правки: полоса чёрная (максимум 3/3/3), журнал «sky off: camera back to Skybox» при открытой карте и «sky on» после.
- C3 pass — сейв 7/7, реестр 1280×720.

## 5. Found

- Наше небо подменяло очистку камеры и при погашенном мире (`cullingMask = 0`) — исправлено. Остальные вкладки (Квесты, Прогресс…)
  гасят мир тем же вызовом (`InfoPanels`) — правка их покрывает, кадрами не снимались. 1080p–4K не снимались: причина не зависит от
  разрешения (очистка кадра камерой).

## 6. Traces

- Кадры: `SvarogsDream/_harness/mt_map.webp`, `mt_top.webp`, `mt_top_nosky.webp`, `mf_map.webp`, `mf_world2.webp`; галерея —
  `SvarogsDream/gallery/game/2026-10-11_грязь-над-картой/`.

## 7. Verdict

Pass: «грязь над картой» найдена и снята; другие вкладки и разрешения — тем же механизмом, кадрами не проверены.
