# Run report — Svarog's Dream: окно выбора героя (цвета по трём героям, «Переброс», прокрутка, судьба, кнопки, межстрочный поп-апа черт)

## Work
Кейсы `testcases/TC_svarog_hero_select_across_2026-10-17.md` (H1–H9) по замечаниям владельца в чате 2026-10-17 между 11:16 и 11:37;
код — `SvarogsDream/src/KrinikUIRework/HeroSelect.cs`, `Plugin.cs` (`Style`), `src/Shared/KrinikPalette.cs` (`ChoiceButton`).

## Contour
Svarog's Dream (GOG), 3840×2160, BepInEx 5.4.23.5, XUnity (`ResizeUILineSpacingScale=0.80`). Игра владельца (PID 18848, окно выбора после
смерти) — выкладки 11:25 и 11:28 горячие; с 11:38 по слову владельца «комп твой, делай, тестируй» — точка сейвов
`_backups/svarog-saves-2026-10-17_1138-owner-hero-select` (7 из 7), `kill`, чистый запуск `deploy-cold.sh KrinikUIRework` + `run-game.sh`,
окно выбора — пультом, выкладка 11:42 горячая.

## Runs
- 2026-10-17 11:25 `bash tools/deploy-hot.sh KrinikUIRework`, `h.sh "shot hs_across1" "dump"`
- 2026-10-17 11:28 `bash tools/deploy-hot.sh KrinikUIRework`, `h.sh "shot hs_across2" "dump"`
- 2026-10-17 11:29 `tools/mouse.ps1 -Button move` на «Выбор» и «Переброс», `-Button wheel -Clicks -20 / -5` над судьбой; `h.sh "fieldon UI/CharacterSelection/Character3/Content/Scroll~Rect UnityEngine.UI.ScrollRect m_MovementType"`
- 2026-10-17 11:30 `h.sh "cfg krinik.svarogsdream.uirework HeroSelect ButtonHover 0.1" "call KrinikUIRework.Plugin StyleHeroCardsOnScreen"`
- 2026-10-17 11:33–11:35 наведения на 6 черт, `h.sh "callon UI/CharacterSelection/TalentToolTip/Description UnityEngine.UI.Text get_lineSpacing"`
- 2026-10-17 11:38 `h.sh kill`, `deploy-cold.sh KrinikUIRework`, 11:39 `run-game.sh`, 11:40 `h.sh "callon Managers/DataManagers/CharacterSelectionManager CharacterSelectionManager InitializeCharacterSelection False"`, 9 наведений с замером
- 2026-10-17 11:42 `deploy-hot.sh KrinikUIRework`, 11:43 4 наведения с замером

## Checks
Hygiene: `dotnet build src/KrinikUIRework -c Release` — Build succeeded (каждая сборка).
Functional run: окно выбора героя в игре на 4K, настоящая мышь, кадры пульта и значения из живого интерфейса (пульт) — прочитаны.
- H1 pass — цвета по атрибуту у трёх героев (Сила 26 / 19 / 14: зелёный / обычный / красный).
- H2 pass — «Переброс» справа от строки цены, рамку карточки не задевает.
- H3 pass — прокрутка `Clamped`, без инерции; владелец: «пружинка ушла, суппер».
- H4 pass — судьба (0.59, 0.51, 0.47), не копится.
- H5 pass — подсветка 0.1; владелец: «да, хочер суппер, нравится».
- H6 pass — исключений 0.
- H7 pass с оговоркой — зелёный как у игры с разницей 3–8 единиц.
- H8 fail — на чистом запуске межстрочный 0.768 (русификатор сжимает дважды); причина найдена.
- H9 pass — после правки «исходный не ниже 1.0» межстрочный 0.96 у всех черт, строки разошлись.

## Found
- Межстрочный поп-апа черт 0.768 / 0.6144: XUnity `TextTranslationInfo.ResizeUI` умножает на 0.8 всякий раз, когда значение ставил не он, а
  `Plugin.Style` запоминал сжатое как исходное — починено (`TipSpacingFloor`).
- Значение атрибута выше 95 игра превращает в 90 (`CharacterSelectionUI.GetScaledLevel`) — у автора, не правилось.

## Traces
`SvarogsDream/_harness/`: `owner_now_1115.webp`, `hs_across1.webp`, `hs_across2.webp`, `hs_hover_sheet.webp`, `hs_hover2.webp`,
`hs_scroll_a.webp`, `hs_scroll_b.webp`, `hs_tip_sheet.webp`, `ct_sheet.webp`, `ct_spacing_pairs.webp`; журнал `BepInEx/LogOutput.log`.

## Verdict
pass — H1–H7, H9; H8 fail, его причина починена и проверена H9. Не покрыто: 720p / 1080p / 2K, строка «не хватает Милостей».
