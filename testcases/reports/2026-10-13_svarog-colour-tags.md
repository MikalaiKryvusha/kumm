# Test run report — Svarog's Dream: цвета по смыслу через теги эффекта (первый срез) и знак автора в переводе состояний

**Created:** 2026-10-13 11:17 +03:00 · **Run by:** агент (Claude Opus 5.5) · **Version/build:** SvarogsDream `23e437a` + рабочая копия
(`EffectTags.cs`, `ItemWindow.cs`, `BuffTipColors.cs`, `Plugin.cs`, `CardTips.cs`, `Purse.cs`, `InstantTranslate.cs`); DLL md5 прогонов 1–2
`dc7fa956…`, прогона 2 после горячей выкладки и прогона 3 — `f873f150…`

## 1. Work

Первый срез плана цветов по смыслу (STATUS KUMM, пункт 1; правило владельца 2026-10-13 «По тяжести последствий» · «Строку целиком» ·
«Все окна разом»): знак эффекта из данных игры — свойства окна предмета (числа `ItemStats`), подсказки состояний (поле `BuffInfo` + buffID),
мягкий жёлтый в подсказках карточки героя и в кошельке. По пути найден и починен дефект перевода: строки состояний со знаком автора «+»/«-»
шли по-английски. Набор случаев — `testcases/TC_svarog_colour_tags_2026-10-13.md` (C1–C22), перепись — `SvarogsDream/docs/COLOUR_TAGS_CENSUS.md`.

## 2. Contour

Игра Svarog's Dream (GOG, `D:\Games\Svarog's Dream`), BepInEx + ScriptEngine, мод KrinikUIRework, словари XUnity из
`SvarogsDream/_config/xunity`; сейв владельца, точка сверки `_backups/svarog-saves-2026-10-13_0049-quit` (герой «Ева», ур. 11, голод 0).
Разрешение 1280×720 (удалённый стол владельца). REAL WORLD: accumulated — сейв владельца 00:49 с его героем и инвентарём, данные
откатываются после каждого прогона; data and machine — его машина и его установка игры; path — запуск игры и окна, которые он открывает
(инвентарь, наведение на ячейку, на шкалы и иконки состояний). Состояния Отравление / Кровотечение / Ночное Зрение включены пультом при
бессмертии героя — verified with real state taken from the real world (сейв владельца), путь их появления в игре не воспроизводился.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 0 | 2026-10-13 11:02 +03:00 | `bash tools/deploy-hot.sh` | 1 · без имени мода: MSB1003, BUILD FAILED; DLL положен руками после `dotnet build src/KrinikUIRework -c Release` |
| 1 | 2026-10-13 11:04 +03:00 | `bash tools/run-game.sh`; `bash tools/h.sh "give 274" … "hover …Slot+Prefab(Clone)#10" … "call BuffsManager ActivateBuffForTime Bleeding 90"` | 0 · окно предмета и карточка — по цвету; состояния со знаком — по-английски |
| 2 | 2026-10-13 11:10 +03:00 | `bash tools/run-game.sh` (после `translation_deploy.sh` с `sr:`); 11:13 `bash tools/deploy-hot.sh KrinikUIRework` | 0 · `sr:` не сработал; после правки ItLookup (RELOADED) — по-русски и по цвету |
| 3 | 2026-10-13 11:15 +03:00 | `bash tools/h.sh kill`; `bash tools/translation_deploy.sh`; `bash tools/run-game.sh`; наведения на 7 иконок | 0 · после перезапуска — всё по-русски и по цвету |
| 4 | 2026-10-13 11:20 +03:00 | `bash tools/run-game.sh`; `bash tools/h.sh "click UI/Enablers/CharacterPanel" "hover …ListOfTalents/Talent(Clone)#1"`; `bash tools/deploy-hot.sh KrinikUIRework` ×3 | 0 · подсказка черты: плохие — #FF4A4A вместо #FF7061 (Letters.Lift), после правки меткой — по правилу |
| 5 | 2026-10-13 11:27 +03:00 | `bash tools/h.sh kill`; `bash tools/run-game.sh`; те же наведения | 0 · после перезапуска — по правилу |
| 6 | 2026-10-13 11:31 +03:00 | `bash tools/run-game.sh`; `bash tools/h.sh "click …DevotionHeader" "click …Gods/God+(N)"` | 0 · «Преданность»: 4 жёлтым, 6 зелёным, 5 белым; журнал спамил |
| 7 | 2026-10-13 11:34 +03:00 | `bash tools/h.sh kill`; `bash tools/run-game.sh`; три бога | 0 · после перезапуска — то же, журнал по строке на смену |
| 8 | 2026-10-13 11:37 +03:00 | `bash tools/run-game.sh`; `bash tools/h.sh "click …MasteryHeader" "hover …<UIMastery>"` | 0 · поп-ап навыка: доступное действие зелёным, недоступное жёлтым |
| 9 | 2026-10-13 11:41 +03:00 | `bash tools/run-game.sh`; `bash tools/h.sh "give 1" … "give 30"` ×2, `"click UI/Enablers/Inventory"` | 0 · перевес 252,6/128 — число веса жёлтым |
| 10 | 2026-10-13 11:43 +03:00 | `bash tools/run-game.sh`; `bash tools/h.sh "give 430" "give 1" "hover …Slot+Prefab(Clone)#12"` | 0 · проклятый лук — свойство коралловым, Сапоги Охотника — «Быстрее на траве» зелёным |

## 4. Checks

Hygiene: `dotnet build src/KrinikUIRework -c Release` — успешно; `translation_deploy.sh` — выход 0 (глоссарий `--strict` зелёный).
Functional run: игра запущена трижды на сейве владельца; прочитаны кадры `shot` окна предмета (Сырое и Печёное Мясо, кольцо), подсказок
шкал «Здоровье» и «Сытость», всех иконок состояний, серия 24 кадров шкалы «Сытость»; цвета строк — из `dump` (col).

- C1–C5, C8, C9, C11, C12, C14–C16 — pass (цвета `#5CF266` / `#E8C66A` / `#FF7061` / нейтральный `#79b2ff` по `dump`).
- C13, C17, C22 — pass после перезапуска (прогон 3); C21 (`sr:`) — fail, снят и заменён C22.
- C18 (пульс контура 7 с) и C19 (пульс цифр 3 с) — pass по серии кадров; C20 (стрелка −20 %) — partial: стрелка не в дереве интерфейса.
- C23 (подсказка черты) — pass после перезапуска (прогон 5): позитив #5CF266, плохая #FF7061, описание не тронуто.
- C24 («Преданность», число отношений) — partial: 4/6/5 по правилу после перезапуска; 1–2 (красный) у героя нет.
- C25 (поп-ап навыка «Мастерства») — pass: «Щёлкните, чтобы открыть/повысить» #5CF266, недоступные #E8C66A.
- C6 (проклятая кузня, лук 430) и C7 (сапоги с бонусом хода) — pass в прогоне 10; C10 (перевес в кошельке) — pass в прогоне 9: #E8C66A.

## 5. Found

- Строки состояний со знаком автора («+Take damage over time.», «-Taking damage over time.», «+Remove night debuffs.») шли по-английски:
  ключи словаря баффов без знака, XUnity ищет подсказку целиком, а мгновенный перевод мода знак не отделял. Починено в
  `InstantTranslate.ItLookup` (баг KUMM 28, класс census-by-own-pattern: данные есть, ключ другой формы).
- Правило `sr:` в словаре для этих строк бесполезно (XUnity видит текст с тегами, загрузчик мода `sr:` не читает) — снято.
- Общий подъём цветов окна персонажа (`Letters.Lift` по TMP) переводил наш коралловый «хуже» в красный автора #FF4A4A —
  перекрывал покраску по знаку. Починено меткой `KrinikSignColor` (проход её пропускает).
- Свойство проклятого лука переведено повелительным «Получайте двойной урон…» — методичка просит третье лицо (баг 28, беклог перевода).
- «Проклятое Кольцо» (546) — кузня «Кольца Силы», не CursedItems: имя предмета не говорит о кузне.

## 6. Traces

Кадры — `SvarogsDream/_harness/ct_rawmeat.webp`, `ct_baked.webp`, `ct_cursed.webp`, `ct_hunger.webp`, `ct_health.webp`, листы
`ct_buffs_sheet.webp`, `ct_buffs2_sheet.webp`, `cu_buffs_sheet.webp`, `cw_buffs_sheet.webp`, `cx_buffs_sheet.webp`, серия `pz_00…23.webp`,
`ct_arrow_zoom.webp`, `cy_t1.webp`, `cr_t1.webp`, `dv_sheet.webp`, `dr_g*.webp`, `ms_k*.webp`, `pw_0.webp`, `c67_sheet2.webp`; журнал мода
`BepInEx/LogOutput.log` (строки `talent tip:`, `devotion relation:`); журнал пульта `SvarogsDream/_harness/out.txt`; случаи — `testcases/TC_svarog_colour_tags_2026-10-13.md`.

## 7. Verdict

partial — свойства предмета (еда, проклятая кузня, бонус хода), подсказки карточки героя, кошелёк, все виденные состояния, подсказка черты,
число отношений «Преданности» и поп-ап навыка «Мастерства» работают по правилу владельца и по-русски после перезапуска. Не дошли: красный
1–2 в «Преданности» (у героя нет такого бога), C20 (стрелка мерится не по дереву интерфейса). Не входили в срез: подписи черт под значками и
выбор героя, числа навыка, сообщения «Черта получена/снята», события мира, всплывающие слова боя, экран смерти и пять вопросов вкуса
(интервью #013).
