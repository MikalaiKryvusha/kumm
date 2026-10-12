# Test run report — Svarog's Dream: экран смерти одной колонкой

**Created:** 2026-10-12 12:15 +03:00 · **Run by:** агент (Claude Opus 5.5) · **Version/build:** KrinikUIRework 1.3.0 + `DeathScreen.cs`

## 1. Work

Переделка экрана смерти (`ProgressManager.ShowDeathScreen` → `UI/DeathStory/Story`) по слову владельца 2026-10-10 и 2026-10-12:
колонка заголовок → портрет → эпитафия рукописным → кнопка; длинная эпитафия — портрет слева. Кейсы —
`testcases/TC_svarog_death_screen_2026-10-12.md` (C1–C7d), основание — рулбук `SvarogsDream/docs/UI_RULEBOOK.md` (Т1, Т2, Т3, Т7, В3, В9).

## 2. Contour

Игра Svarog's Dream владельца, BepInEx + наши моды, сейв владельца (точка сверки `_backups/svarog-saves-2026-10-11_2342-owner-exit`,
живой сейв = ей 7/7 до прогона), «Железный человек» — смерть пишет сейв, после каждого прогона откат. Разрешения 1280×720, 1920×1080,
2560×1440, 3840×2160 во весь экран (ExclusiveFullScreen). Мод подкладывался горячо (`deploy-hot.sh`) и копией в `BepInEx/scripts` перед
свежим запуском.
REAL WORLD: accumulated — сейв владельца после его игры 2026-10-11, его настройки модов; data and machine — его машина, его телевизор
4K; path — смерть героя настоящим уроном игры (`die`) и кнопка «Продолжить» щелчком пульта — verified with real state taken from the
real world (копия его сейва, откат 7/7).

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-10-12 11:55 +03:00 | `bash tools/run-game.sh`; `h.sh "die" "wait 12" "shot ds_before"`; `h.sh "dump UI/DeathStory"` | C1 pass — дерево экрана |
| 2 | 2026-10-12 12:00 +03:00 | `deploy-hot.sh KrinikUIRework`; `h.sh "call ProgressManager ShowDeathScreen" "shot ds_after"` (и `ds_after2`) | C2 fail → C2b pass |
| 3 | 2026-10-12 12:01 +03:00 | `h.sh "call UnityEngine.Screen SetResolution 1920 1080 ExclusiveFullScreen" … "shot ds_2160" …` | C3 pass |
| 4 | 2026-10-12 12:02 +03:00 | `h.sh "cfg krinik.svarogsdream.uirework DeathScreen Enabled False" "call ProgressManager ShowDeathScreen" "shot ds_ctrl"` | C4 fail (возврат неполный) |
| 5 | 2026-10-12 12:03 +03:00 | `h.sh "kill"`; откат 7/7; `run-game.sh`; `die`; `ds4_on/off/on2`; горячо `ds5_off/on` | C4b fail → C4c pass |
| 6 | 2026-10-12 12:06 +03:00 | `cmd.txt` из `long_cmd.py`: `settext "…/Description Text" <самая длинная эпитафия DumpPreview>`, `call KrinikUIRework.Plugin RelayoutDeath` | C7 fail, C7b fail |
| 7 | 2026-10-12 12:10 +03:00 | `h.sh "kill"`; откат 7/7; `run-game.sh`; `die`; длинная на 720p и 4K; короткая на четырёх разрешениях | C7c fail (шаг строк на 4K) |
| 8 | 2026-10-12 12:14 +03:00 | `deploy-hot.sh`; показ на 4K, смена 2K/1080p/720p при открытом экране; `textrows.py`; `click UI/DeathStory/Story/CloseDeathScreen` | C7d pass, C5 pass |
| 9 | 2026-10-12 12:15 +03:00 | `h.sh "kill"`; `cmp` 7 файлов с точкой сверки; `bash tools/reg-snap.sh restore` | C6 pass — 7/7, реестр |

## 4. Checks

Hygiene: `dotnet build src/KrinikUIRework -c Release` — без ошибок.
Functional run: экран смерти в игре владельца на копии его сейва, смерть настоящим уроном, кадры изнутри движка на четырёх
разрешениях; прочитаны кадры, высота букв и шаг строк (`tools/textrows.py`), контраст (`tools/contrast.py`), строки журнала
`death screen: …`, ответы пульта.

- C1 pass — дерево экрана снято.
- C2 fail → C2b pass — колонка; черта портрета ложилась на эпитафию → высота портрета с чертой.
- C3 pass — одна раскладка на четырёх разрешениях; 4K: буквы 61–62 px, контраст эпитафии 14.06, заголовка 5.22.
- C4 fail → C4b fail → C4c pass — выключатель возвращает вид игры целиком.
- C5 pass — «Продолжить» ведёт в Подземный Мир.
- C6 pass — сейв 7/7, реестр.
- C7 fail → C7b fail → C7c fail → C7d pass — длинная эпитафия на экране целиком; шаг строк 1.25 кегля на всех разрешениях.

## 5. Found

- Красная черта портрета шире рамки — ложилась на эпитафию (исправлено).
- Выключатель возвращал не всё (исправлено).
- Длинная эпитафия выходила за экран, низ резала прокрутка игры (исправлено).
- Прибавка ширины окну, содержимому и тексту складывалась трижды — текст размером ведёт раскладка игры (исправлено).
- Шаг строк Gabriela зависит от разрешения, на котором собран текст: на 4K строки впритык (исправлено для экрана смерти; записки,
  письма и журнал на 4K тем же глазом не проверены).

## 6. Traces

Кадры — `SvarogsDream/_harness/ds_*.webp`, `ds4_*`, `ds5_*`, `ds6_*`, `ds7_*`; галерея с README —
`SvarogsDream/gallery/game/2026-10-12_экран-смерти/`; дерево — `_harness/dump.txt`; журнал —
`D:\Games\Svarog's Dream\BepInEx\LogOutput.log`, строки `death screen: …`.

## 7. Verdict

pass — все кейсы закрыты на последней сборке; вкус (вид колонки, красный заголовка, размер портрета) — глаз владельца.
