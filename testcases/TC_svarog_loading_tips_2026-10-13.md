# Test cases — Svarog's Dream: наши советы экрана загрузки (35 новых + 14 правок авторских)

**Created:** 2026-10-13 15:45 +03:00 — до запуска игры · **Under test:** `KrinikUIRework/LoadingTips.cs` (новое: дописать советы в
`LoadingScreen.loadingTips`, подпись «Совет N:»), `LoadingLayout.cs` (`PatchLoadingTip`: сначала подпись, потом вёрстка),
`Restore.cs` (`BindLoadingTips`), `tools/loading_tips_build.py`, `tools/translation_deploy.sh`, `_config/xunity/zz_krinik_tips.txt`
(14 правок) · **Version/build:** SvarogsDream `6b40564` + рабочая копия
**Test basis:** `[OWNER]` «согласованы твои правки советов - внедряй» · 2026-10-13; лист `SvarogsDream/translation/loading_tips_ru.tsv`
(35), лист авторских `translation/loading_tips_author_proposal.tsv` (14 правок); устройство экрана —
`KUMM/games/SvarogsDream/GAME_ARCHITECTURE_INTERNAL_MAP.md` §2 (`Random.Range(0, loadingTips.Length)`, смена раз в 10 с).
**Сейв:** копия до прогона, после `kill` — `bash tools/save-check.sh --restore`, `bash tools/reg-snap.sh restore`.
**Измерения разделены:** журнал мода (`loading tips:`, `loading tip: ours #N`) ≠ вид (кадр `shot` экрана загрузки).

## Dimensions

- источник совета: авторский (1–61, перевод XUnity) · наш (62–96, подпись модом);
- настройка: `ExtraTips` вкл · выкл (контроль);
- файл советов: есть · нет (контроль: без файла — только авторские, без ошибок);
- не покрыто: все 96 советов глазом (рандом); проверяется счёт в журнале и несколько кадров.

## Cases

| # | Шаг | Ожидается | Измерение | Статус |
|---|---|---|---|---|
| L1 | Выкладка перевода `bash tools/translation_deploy.sh` | выход 0; `krinik_loading_tips_ru.txt` в корне игры, 35 советов + 2 строки шапки | вывод, `ls` | [NOT-TESTED] |
| L2 | Запуск игры, загрузка сейва, журнал BepInEx | строка `loading tips: ours 35 from …krinik_loading_tips_ru.txt` и `loading tips: 61 + 35 = 96` | журнал | pass · 16:23 прогон 1: журнал `loading tips: ours 35 from …krinik_loading_tips_ru.txt` и `loading tips: 61 + 35 = 96`, исключений 0 |
| L3 | Экран загрузки показывает наш совет (номер > 61) | текст начинается «Совет 6x:», дальше русский текст из листа, без «Tip» | журнал `loading tip: ours #N` + кадр `shot` | partial · 16:31 прогон 2: журнал `loading tip: ours #91` (наш совет выпал); кадра нет — пульт во время загрузки не отвечает (кадры `lt1–lt4` не сняты); следующий прогон — захват экрана ffmpeg ddagrab |
| L4 | Экран загрузки показывает авторский совет (номер ≤ 61) | «Совет N:» и русский перевод XUnity; для 14 правленых — новый текст | кадр | [NOT-TESTED] |
| L5 | Вёрстка нашего совета | совет под картиной, по центру, рукописным, как авторские; длинный совет не наезжает на полосу загрузки | кадр | [NOT-TESTED] |
| K1 | Контроль: `ExtraTips` = false (cfg), новая загрузка | в журнале нет `61 + 35`, номера советов ≤ 61 | журнал | [NOT-TESTED] |
