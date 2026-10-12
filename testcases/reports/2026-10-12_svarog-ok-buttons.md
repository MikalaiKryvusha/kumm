# Test run report — Svarog's Dream: кнопки «ОК» во всех окнах (Г2: крупнее, рукописным, кисть светлее в родном тоне)

**Created:** 2026-10-12 16:07 +03:00 · **Run by:** агент (Claude Opus 5.5) · **Version/build:** KrinikUIRework + `BigButtons.cs` (`StyleOkButton`, `OkInside`, `ListButtons`), вызовы в `Letters.cs`, `Notes.cs`, `Tips.cs`

## 1. Work

«ОК» окон по слову владельца: `[OWNER]` «и кнопки в модальных диалогах ОК просятся такими же выразительными» · «а почему ОК красным ты
заебенил? в этом же диалоге подложка в оригинале другая» · «Г2 хорошо» · «и такие ОК будут во многих местах - найти» · 2026-10-12; окно
«Выход из игры?» — `[OWNER]` «тут не нужно трогать». Кейсы — `testcases/TC_svarog_ok_buttons_2026-10-12.md` (C1–C10).

## 2. Contour

Игра Svarog's Dream владельца, BepInEx + наши моды, копия его сейва (точка сверки `_backups/svarog-saves-2026-10-11_2342-owner-exit`, 7/7
до прогона), 1280×720 полный экран. Три запуска: перепись (15:58), горячая подкладка с проверкой окон (16:02–16:05), свежий запуск (16:07).
REAL WORLD: accumulated — сейв владельца после его игры 2026-10-11, его настройки модов; data and machine — его машина; path — окна
открыты пультом теми методами игры, что открывают их в игре (`OpenRecipeMessage`, `ShowPoetry`, `ShowStory`), подсказка и весть —
включением окна (стиль у них в `OnEnable`); закрытие — щелчком «ОК» — verified with real state taken from the real world.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-10-12 15:58 +03:00 | `run-game.sh`; `deploy-hot.sh KrinikUIRework`; `h.sh "call KrinikUIRework.Plugin ListButtons D:/…/_harness/buttons.tsv"`; `python ok_census.py buttons.tsv` | C1 pass — 1782 кнопки, «ОК» 167 |
| 2 | 2026-10-12 16:00 +03:00 | `h.sh "kill"`; `cmp` 7/7; `reg-snap.sh restore` | сейв не тронут |
| 3 | 2026-10-12 16:02 +03:00 | `run-game.sh`; `deploy-hot.sh`; `callon "UI/ActionBar/ActionBarMain/UIRecipe" GameUI.UIRecipeMessage OpenRecipeMessage 318 317 265 "…"`; `shot ok_recipe`; `dump …/CloseRecipes` | C2 pass |
| 4 | 2026-10-12 16:03 +03:00 | `call CookingManager ShowPoetry …`, `ShowStory …`, `call TipsManager ShowTip Movement 0`, `call WorldEventsManager ShowEventMessageManually Werewolves 0`, щелчки «ОК» | C3 pass, C4 fail (вылет за окно), C5/C6 blocked (подсказка прочитана, весть случилась) |
| 5 | 2026-10-12 16:05 +03:00 | `deploy-hot.sh` (OkInside); `ShowStory` + `shot ok_story2`; `active "UI/GamePopUps/GameTips/1-Movement" 1`; `active "UI/GamePopUps/WorldEvents/1-Werewolves" 1`; щелчки «ОК» | C4b fail (артефакт подкладки), C5b pass, C6b pass, C7 pass |
| 6 | 2026-10-12 16:06 +03:00 | `h.sh "kill"`; `cmp` 7/7 | сейв не тронут |
| 7 | 2026-10-12 16:07 +03:00 | свежий `run-game.sh`; `ShowStory` + `shot ok_story3`; `cfg krinik.svarogsdream.uirework Buttons BigOk False` + рецепт + `shot ok_ctrl` + `dump`; меню → «Выход из игры» + `shot ok_exit2`; `kill`; `cmp`; `reg-snap.sh restore` | C4c pass, C8 pass, C9 pass, C10 pass |

## 4. Checks

Hygiene: `dotnet build src/KrinikUIRework -c Release` — без ошибок.
Functional run: окна рецепта, записки, рассказа, обучающей подсказки и вести мира в игре владельца на копии его сейва; прочитаны кадры
изнутри движка, дампы кнопки (цвет, масштаб, подпись), цвет кисти в кадре, закрытие по щелчку «ОК».

- C1 pass — перепись: вести `WorldEvents/*/CloseMessage` (`Button_idle` 0.60, ≈134), подсказки `GameTips/*/CloseTip` (29), рецепт
  `CloseRecipes` (0.30), записка и рассказ `ClosePoetry` (0.07, 0.04), `Repeating/RepeatingOnDeaths/CloseMessage`.
- C2 pass — рецепт: кисть в кадре (122, 122, 120) — как Г2.
- C3 pass · C4 fail → C4b fail (артефакт горячей подкладки) → C4c pass на свежем запуске · C5b pass · C6b pass · C7 pass.
- C8 pass — выключатель возвращает кнопку игры по дампу один в один · C9 pass — «Выход из игры?» не тронут · C10 pass.

## 5. Found

- У рассказа «ОК» у правого края окна: ×1.5 вывело кисть за бумагу — исправлено (`OkInside`: сдвиг внутрь окна от места игры).
- После горячей подкладки метка новой сборки запоминает уже перекрашенную кнопку как «цвет игры» — кисть белая. Только при подкладке;
  на свежем запуске нет (C4c). Тот же класс, что C5 экрана смерти: контроль и первый показ — только на свежем запуске.
- Подсказку и весть игра показывает один раз: `ShowTip` молчит для прочитанной, `ShowEventMessageManually` — для случившейся и к тому
  же запускает событие (меняет мир). Для проверки — включение окна пультом `active`.

## 6. Traces

- Перепись: `SvarogsDream/_harness/buttons.tsv` (1782 строки).
- Кадры: `SvarogsDream/_harness/ok_recipe|ok_note|ok_story|ok_story2|ok_story3|ok_tip2|ok_news2|ok_after|ok_after2|ok_ctrl|ok_exit2.webp`.
- Листы: `SvarogsDream/gallery/game/2026-10-12_ок-модальные/3_ок_в_игре_720p.webp`, `4_ок_в_игре_720p_повтор.webp`,
  `5_рассказ_и_выход_свежий_запуск.webp`; макет Г2 — `2_рецепты_ок_родной_тон.webp`.

## 7. Verdict

partial — «ОК» пяти семейств окон по Г2 проверены в игре на 720p, контроль выключателем на свежем запуске, окно выхода не тронуто. Не
проверено: 1080p, 2K, 4K; наведение; вид на свежем запуске у подсказки и вести (снимались после горячей подкладки, но их кисти верные).
