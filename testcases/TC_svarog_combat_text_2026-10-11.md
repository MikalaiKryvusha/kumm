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
