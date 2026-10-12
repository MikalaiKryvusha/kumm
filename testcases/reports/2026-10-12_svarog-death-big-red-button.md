# Test run report — Svarog's Dream: крупная красная кнопка «Продолжить» экрана смерти

**Created:** 2026-10-12 15:36 +03:00 · **Run by:** агент (Claude Opus 5.5) · **Version/build:** KrinikUIRework + `BigButtons.cs`, `DeathScreen.cs` (кнопка ×1.875)

## 1. Work

Кнопка «Продолжить» экрана смерти — вариант 1 листа `SvarogsDream/gallery/game/2026-10-12_экран-смерти/кнопка/0_лист_кнопка.webp`
(`[OWNER]` «нужно её больше, красным, красиво» · «1 хорошо» · 2026-10-12): кисть крупнее в 1.5 раза, красная (роль
`KrinikPalette.ActionButton` `#D63430`), подпись Gabriela цветом бумаги мира, «Продолжить» строчными. Общий компонент
`StyleBigButton` — для кнопок «ОК» модальных окон (`[OWNER]` «и кнопки в модальных диалогах ОК просятся такими же выразительными»).
Кейсы — `testcases/TC_svarog_big_red_button_2026-10-12.md` (C0–C8).

## 2. Contour

Игра Svarog's Dream владельца, BepInEx + наши моды, копия его сейва (точка сверки `_backups/svarog-saves-2026-10-11_2342-owner-exit`,
живой сейв = ей 7/7 до прогона, 15:28), «Железный человек» — смерть пишет сейв. Запуск на 4K, разрешения 720p, 1080p, 2K, 4K во весь
экран (ExclusiveFullScreen). Сборка подложена горячо (`deploy-hot.sh`), дважды.
REAL WORLD: accumulated — сейв владельца после его игры 2026-10-11, его настройки модов и XUnity (`OverrideFontTextMeshPro`); data and
machine — его машина и телевизор 4K; path — смерть героя уроном игры (`die`), кнопка щелчком пульта — verified with real state taken
from the real world (копия сейва, откат 7/7).

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-10-12 15:28 +03:00 | `bash tools/reg-snap.sh save`; `bash tools/run-game.sh` | HUD за 15.3 с |
| 2 | 2026-10-12 15:29 +03:00 | `bash tools/deploy-hot.sh KrinikUIRework`; `h.sh "die" "wait 12" "shot bb_720" "dump …/CloseDeathScreen"` | C1 fail — подпись Manrope и низко |
| 3 | 2026-10-12 15:30 +03:00 | `h.sh "callon …/CloseDeathScreen/Text TMPro.TextMeshProUGUI get_font"`, `static … _wisdomTmp` | причина — XUnity `OverrideFontTextMeshPro` |
| 4 | 2026-10-12 15:31 +03:00 | `deploy-hot.sh KrinikUIRework`; `h.sh "call ProgressManager ShowDeathScreen" "shot bb2" … get_font` | C1b pass |
| 5 | 2026-10-12 15:32 +03:00 | `h.sh "call UnityEngine.Screen SetResolution 1280 720 ExclusiveFullScreen" "shot bb_r720" …` до 3840×2160; `hover` + `shot bb_hover` | C2 pass, C4 pass |
| 6 | 2026-10-12 15:34 +03:00 | `h.sh "click UI/DeathStory/Story/CloseDeathScreen" "wait 8" "shot bb_continue"` | C6 pass |
| 7 | 2026-10-12 15:34 +03:00 | `h.sh "findall Exit"`; `ilspycmd -o <scratchpad> Assembly-CSharp.dll`; `h.sh "call MainMenu ShowExitPopUp True" "shot bb_exit"` | C7 partial |
| 8 | 2026-10-12 15:35 +03:00 | `h.sh "kill"`; `cmp` 7 файлов; копия 3 файлов из точки сверки; `bash tools/reg-snap.sh restore` | C8 pass — 7/7 |

## 4. Checks

Hygiene: `dotnet build src/KrinikUIRework -c Release` — без ошибок (дважды).
Functional run: экран смерти в игре владельца на копии его сейва, смерть уроном игры; прочитаны кадры изнутри движка на четырёх
разрешениях, шрифт подписи ответом пульта (`get_font`), дамп кнопки, переход по «Продолжить».

- C0 pass · C1 fail → C1b pass · C2 pass · C4 pass (событием пульта, не мышью) · C6 pass · C8 pass.
- C3 skipped — длинная эпитафия с выросшей кнопкой не прогнана.
- C5 skipped — контроль выключателем после горячей подкладки нечестен (метка вида игры запомнила переделанную кнопку); только свежий запуск.
- C7 partial — перечень окон-вопросов по коду игры; кадра окна нет.

## 5. Found

- XUnity с `OverrideFontTextMeshPro=krinik_manrope` (AutoTranslator/Config.ini) ставит Manrope любой TMP-подписи, у которой мод меняет
  текст, — поверх нашего Gabriela. Обход: текст менять ДО шрифта (`BigButtons.cs`). Класс: любой мод, меняющий текст TMP после пометки
  «бумага», потеряет рукописный.
- Рамка подписи кнопки игры прижата к низу кисти — подпись по центру рамки стояла ниже середины кисти (исправлено: рамка на всю кисть).

## 6. Traces

- Кадры: `SvarogsDream/_harness/bb_720.webp`, `bb2.webp`, `bb_r720|1080|1440|2160.webp`, `bb_hover.webp`, `bb_continue.webp`, `bb_exit.webp`.
- Листы: `SvarogsDream/gallery/game/2026-10-12_экран-смерти/кнопка/0_лист_кнопка.webp` (макеты), `1_четыре_разрешения.webp`,
  `2_покой_наведение.webp`.
- Дамп: `SvarogsDream/_harness/dump.txt` (кнопка после правки), `findbtn.txt`, `f2.txt`.

## 7. Verdict

partial — кнопка экрана смерти сделана по варианту 1 и проверена в игре на четырёх разрешениях, с наведением и переходом; не прогнаны
длинная эпитафия (C3) и контроль выключателем на свежем запуске (C5); «ОК» модальных окон — только разведка по коду (C7).
