# Test cases — боевые надписи крупнее и по-русски

> **Основание:** `[OWNER]` «сообщения в бою Miss и прочие - больше размер, и нужно локализовать» · 2026-10-11 (очередь 14:55, ③).
>
> **Что известно из кода:** надписи — `GameUI.UIPopUpSpawner`; по умолчанию частицы Cartoon FX (`CFXR_ParticleText_Runtime`, набор букв
> «A–Z 0–9 !?-.#@$», кириллицы нет; текст переводится `ToUpper()`), в режиме «старых надписей» — TextMeshPro. Перевод: `miss/immune/
> resistant` перекрыты в `zz_krinik_terms.txt`, `blocked/undying/indomitable/executed/Enraged/run!` — в `zz_krinik.txt` (2026-10-11 15:27).
> **Сборка:** KrinikUIRework `CombatText.cs` («Боевые надписи: размер» 1.5), пульт `popup <слово|число>`, `cfxrfont`.
> **Сцена:** сейв владельца, время идёт, герой у Бары. После — `kill`, сейв 7/7 против `_backups/svarog-saves-2026-10-10_2357-state`
> (откат при расхождении), реестр.

| № | Шаг | Ожидается | Как смотрим | Статус |
|---|---|---|---|---|
| C1 | `popup miss`, `popup 123` при размере 1 и 1.5 | ×1.5 заметно крупнее, не обрезано | кадры `ct_*`, вырезка | pass 15:28 — 1080p: «MISS» и «123» при ×1.5 заметно крупнее, целиком, обводка цела (`ct_sheet`); журнал `combat text x1,5: 11 changed, particle popups 10, tmp prefab 54` |
| C2 | `popup промах` (кириллица в частицах) | подтвердить: частицы кириллицу не рисуют (ошибка «Failed to generate animated text») | журнал | pass 15:28 — `Failed to generate animated text for: промах` (Player.log): частицы кириллицу не рисуют, надписи нет вовсе |
| C3 | `cfxrfont` — атлас букв | набор букв, размер атласа, шейдер; картинка атласа — разведка своих русских букв | вывод, `cfxr_font.png` | pass 15:28 — шрифт `cfxr ParticleFont AmazGoDaBold`, 68 знаков (ASCII, без строчных), атлас 4949×72 RGBA32 в одну строку, шейдер `Cartoon FX/Remaster/Particle Ubershader`; каналы: G — верх заливки, R — низ (градиент color1/color2), B — обводка (цвет фона), A — покрытие |
| C4 | После: `kill`, сейв 7/7, реестр | как до прогона | `cmp`, `reg query` | pass 15:29 — сейв 7/7, реестр вернул |
| C5 | Сборка: атлас `krinik_cfxr_cyr.png` (33 заглавные, Rubik Black Italic, каналы как у игры — `tools/cfxr_cyrillic_atlas.py`), «Боевые надписи по-русски»; `popup miss`, `popup blocked`, `popup immune`, `popup Enraged` | «ПРОМАХ», «БЛОК», «ИММУНИТЕТ», «В ЯРОСТИ» тем же мультяшным видом; журнал `combat text cyrillic: +33 letters … valid True` | кадры `cr_*`, журнал | fail 15:34 — буквы дописаны (`+33 letters … now 101, ppu 100, valid True`), но перевод не вызван: `XUnity TryTranslate not found` (Type.GetType с именем сборки); правка — поиск по загруженным сборкам (C5b) |
| C5b | Горячая выкладка с правкой поиска XUnity; те же `popup` | слова по-русски; журнал `XUnity found … TryTranslate ok` | кадры `cr2_*`, журнал | pass 15:35 — «ПРОМАХ», «БЛОК», «ИММУНИТЕТ», «В ЯРОСТИ» мультяшным видом с обводкой (`cr2_sheet`); журнал `XUnity found, translator AutoTranslationPlugin, TryTranslate ok`. Найден брак: горячая перезагрузка копит размер (заготовка 54 → 81, частицы ×2.25) — исходный размер теперь в глобальном числе шейдеров (C5c) |
| C5c | Свежий запуск игры: `popup miss`, `popup 77` | размер ×1.5 от игры (заготовка 54), не больше; цифры как были | кадры `cr3_*`, журнал | pass 15:36 — свежий запуск: заготовка 54 (×1.5 от 36), «ПРОМАХ», «77», «БЕССМЕРТИЕ» (`cr3_sheet`) |
| C6 | Число `popup 77` после расширения шрифта | цифры как были | кадр | pass 15:36 — «77» как было (`cr3_sheet`) |
| C7 | После: `kill`, сейв 7/7, реестр | как до прогона | `cmp`, `reg query` | pass 15:37 — сейв 7/7, реестр вернул |
