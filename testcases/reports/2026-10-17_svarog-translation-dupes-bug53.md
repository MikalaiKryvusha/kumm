# Run report — баг 53: один ключ перевода, один перевод

**Work:** страж `SvarogsDream/tools/xunity_dupes.py` в `translation_deploy.sh`, удаление 68 ручных дублей, шаблоны чисел в `dialogue_xunity.py` —
против кейсов `testcases/TC_svarog_translation_dupes_bug53_2026-10-17.md` (C1–C5, K1).

**Contour:** машина владельца; словари `SvarogsDream/_config/xunity`, выкладка в `D:/Games/Svarog's Dream/AutoTranslator/Translation/ru/Text`;
игра под замком «живой машины» (KUMM, 17:44–17:48); видеокарта на заводских настройках (KAGO откатил её после своего сбоя в 17:41).
Сейв — точка `_backups/svarog-saves-2026-10-17_1744-bug53-run`.

**Runs:** 2026-10-17: `python -I tools/xunity_dupes.py` до правки и после; `bash tools/translation_deploy.sh`; копия словарей с подложенным дублем —
`xunity_dupes.py <копия>`; `LOCK_MINUTES=15 bash tools/run-game.sh` (мир в 17:45:28), пульт `callon Managers/DataManagers/CharacterSelectionManager
CharacterSelectionManager InitializeCharacterSelection False`, `bash _harness/hover_traits.sh` (наведение на значки черт и `dump`), `shot
bug53_hunter_tip` (17:48:03), `h.sh "kill"` (17:48:13), `save-check.sh --restore`, `reg-snap.sh restore`.

**Checks:**
- Hygiene: страж красный на словарях до правки (72 ключа) и на копии с подложенным дублем (K1), зелёный после (0).
- Functional run: в игре открыто окно выбора героя; прочитаны подсказки девяти черт трёх героев из дерева интерфейса и кадром.
- C1 pass · C2 pass · C3 pass · C4 pass · C5 skipped (видимой разницы нет: побеждавший вариант оставлен) · K1 pass.

**Found:** 72 ключа с разными переводами вместо 9 из прошлой описи (та смотрела только `zz_krinik*.txt`); в 34 из них старый ручной текст
побеждал согласованный — описания черт с «вы», умения в повелительном, записки и письма. Комментарий «поздний перекрывает ранний» неверен в
семи местах (по коду XUnity побеждает первый по алфавиту).

**Traces:** кадры `SvarogsDream/_harness/sel_bug53.webp`, `SvarogsDream/_harness/bug53_hunter_tip.webp`; дамп интерфейса
`SvarogsDream/_harness/dump.txt`; код XUnity — декомпиляция `TextTranslationCache` (скретчпад сессии).

**Verdict:** pass — с оговоркой: совет загрузки и рецепты в записках глазом не смотрены (выпадают случайно); их ключи теперь единственные.
