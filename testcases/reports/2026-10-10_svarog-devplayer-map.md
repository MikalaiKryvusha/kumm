# Run report — Svarog's Dream: development-плеер, карта главного потока, кнопка «Быстрое Перемещение»

## 1. Work

Эпик 19, критерий 1 «Карта главного потока» (`plans/19_EPIC_svarog_main_thread_offload.md`) — `[OWNER]` «давай поставим девеломнент
плеер» · 2026-10-10 ≈09:18; кнопка карты — `[OWNER]` «Быстрое Перемещение - так и оставить. Можно нопку сделать шире.» · 2026-10-10
≈09:10. Случаи — `testcases/TC_svarog_devplayer_map_2026-10-10.md` (C1–C13, K1).

## 2. Contour

- Игра `D:\Games\Svarog's Dream`, Unity 2020.3.49f1, DX11. Плеер — `UnityPlayer.dll` + `WinPixEventRuntime.dll` из
  `E:\Unity\2020.3.49f1\…\Variations\win64_development_mono`; управляемые библиотеки игры не тронуты.
- Сейв владельца 02:15 (Бор, ночь, «Железный человек»), копия `_backups/svarog-saves-2026-10-10_0918-pre-devplayer` (7 файлов).
- Экран: виртуальный 1280×720 (стрим), игра — `ExclusiveFullScreen` 3840×2160.
- SvarogsDream после `b3fdbe3`: `MapLayout.cs` (колонка шире, `LabelPad`, `WidenCardLeft`), `KrinikPalette.Hex` без API Unity,
  пульт `pmark` и `tmoved`, `tools/player-swap.sh`.

## 3. Runs

- 09:20–09:23 — запуск 1 (`bash tools/run-game.sh`), UI-мод не поднялся; горячая выкладка `bash tools/deploy-hot.sh KrinikUIRework` —
  NOT RELOADED; `bash tools/h.sh "kill"`.
- 09:23–09:26 — запуск 2: `bash tools/h.sh "call UnityEngine.Screen SetResolution 3840 2160 ExclusiveFullScreen"`
  `"callon Camera CameraFollow SetMaxZoom"` `"pmark 8 45"`; A/B `"cfg krinik.svarogsdream.uirework Icons Enabled false"`,
  `"animcull complete"`, `"particles pause"` — каждый с `"pmark 6 60"`.
- 09:26–09:35 — запуск 3 (новый пульт): `"tmoved 1 30"`; `"farchars 40|100|150"` и
  `"cfg krinik.svarogsdream.camerarework DrawDistance ShadowDistanceFactor 1|2"` — каждый с `"tmoved 1 5"` `"pmark 6 60"`;
  `"perf 4"`; карта — `"click UI/Enablers/InfoPanel"` `"click UI/InfoPanel/InfoPanelHeader/MapHeader"` `"shot …"`, две горячие выкладки
  UI-мода (RELOADED), `SetResolution 1280 720 | 1920 1080 | 2560 1440 | 3840 2160 ExclusiveFullScreen` с кадрами, контроль
  `"cfg krinik.svarogsdream.uirework Pages MapLayout false|true"`; `"kill"` 09:35.
- 09:36–09:37 — `reg add … Fullscreen mode … 1`, `bash tools/player-swap.sh status|release|dev|release`.

## 4. Checks

Hygiene: сборки `dotnet build` UI-мода, меню модов, пульта — без ошибок.
Functional run: игра на development-плеере, сейв владельца, мир, карта — прочитаны журналы (`LogOutput.log`, `Player.log`), ответы пульта
и кадры 4K изнутри движка.

- C1 fail (UI-мод не поднялся на development — UnityException из `KrinikPalette.Hex`).
- C9 blocked (горячая выкладка не выгружает недосозданный экземпляр).
- C10 pass.
- C2 pass.
- C11 pass.
- C3 blocked (сцена — ночь, опора — день).
- C4 pass.
- C5 fail (подпись упирается в концы мазка).
- C12 fail (календарь разъехался).
- C13 pass.
- C6 pass.
- C7 pass.
- K1 pass.
- C8 pass.

## 5. Found

1. **Development-плеер нашёл наш дефект:** `KrinikPalette.Hex` (ColorUtility) в статических полях плагина — UnityException «not allowed
   to be called from a MonoBehaviour constructor»; release пропускал молча. Исправлено разбором «#RRGGBB» на чистом C#.
2. **Карта главного потока** (Бор ночью, 4K, отдаление до предела; development; `_harness/pmark_base_night4k.txt`): кадр 28.0 мс.

   | Маркер | мс/кадр |
   |---|---|
   | FinishFrameRendering | 10.2 |
   | Camera.Render | 9.9 |
   | Culling | 5.8 |
   | WaitForJobGroupID | 9.3 |
   | **TransformChangedDispatch** | **7.3** |
   | WaitForLastPresent | 5.3 |
   | UpdateRendererBoundingVolumes | 3.2 |
   | холсты | ≈2.8 |
   | Terrain.Details | 1.9 |
   | скрипты | 1.8 |
   | физика | 1.8 |
   | NavMesh | 1.4 |
   | AIUpdate | 1.2 |
   | аниматоры | 0.85 |

   102 стадии PlayerLoop = 100 % Main Thread.
3. **Кто двигает трансформы** (`tmoved`): 1860 из 8547 за кадр — кости жителей 1641, UI 151, навигация 58.
4. **Полоса 150–300 м** (видны ли эти жители в кадре — кадром не проверено) стоит ≈3–4 мс. `farchars 150`: кадр 19.1 → 15.3 мс — Dispatch 7.4 → 3.6, ожидание потоков
   7.7 → 4.9, физика 1.7 → 0.5. Полосы 40–150 м почти бесплатны.
5. **Значки UI-мода** — ≈1.7 мс: выкл. — Dispatch −1.15, холсты −0.96.
6. **Тени ×2** = ×1 по цене: −1.2 мс (рамки рендереров 3.3 → 2.1).
7. **Частицы** — ≈0.9 мс на рамках.
8. **Кнопка карты** — колонка шире влево на ≈200 px 4K, кегль игры, поле ¾ высоты кнопки, календарь на линии.
9. **Реестр:** `ExclusiveFullScreen` переписал «Fullscreen mode» на 0 — возвращено 1.

## 6. Traces

- Кадры `SvarogsDream/_harness/`:
  - `dev_first.webp`;
  - `map_dev_4k_a|b|c(_col|_half).webp`;
  - `mapc6_4k`, `mapc7_720|1080|1440|2160`, `mapc6c7_sheet.webp`;
  - `mapk1_off|on|sheet.webp`.
- Маркеры: `pmark_base_night4k.txt`, `pmark.txt`.
- Журналы: `BepInEx/LogOutput.log` («Krinik UI Rework] loaded»); `Player.log` (UnityException, «Multi-casting … WindowsPlayer»).

## 7. Verdict

partial — карта потока и кнопка карты: pass по своим случаям (C2, C4, C11, C13, C6, C7, K1); цена development-плеера против release (C3)
в одной сцене не снята.
