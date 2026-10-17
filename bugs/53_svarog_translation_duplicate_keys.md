# Bug 53 — Сварог: одна строка игры переведена в двух наших словарях по-разному, в игре виден не тот вариант

**Status:** 🔧 частично — совет «Keep in mind that enemies…» починен 2026-10-17 16:23; ещё 8 ключей ждут разбора
**Severity:** S2 · **Fixing:** следующий заход по переводу (после проверки, какой файл побеждает)
**Version/build:** перевод `SvarogsDream/_config/xunity/zz_krinik*.txt`, выкладка 2026-10-17 13:28 · **When/context:** 2026-10-17, слово владельца
`[OWNER]` «помните - обин из советов с этого начинается, с меленькой буквы»

## Symptom

Совет экрана загрузки шёл с маленькой буквы: «Совет N: помните, что враги, как и вы…». По методичке (`translation/STYLE.md`, «Советы»)
после «Совет N:» — с большой, и согласованный перевод этой строки с большой есть.

## Root cause

Один ключ — два перевода: старый в `zz_krinik.txt:135` («помните, что враги, как и вы, могут быть устойчивее к контролю») и согласованный
в `zz_krinik_tips.txt:39` («Помните, что у врагов тоже бывает высокое Сопротивление Контролю»). Владелец видел старый. Комментарий
`tools/translation_deploy.sh:4` говорит «поздний перекрывает ранний» — тогда победил бы `zz_krinik_tips.txt`; наблюдение говорит обратное.
Какой файл побеждает у XUnity — **не проверено** (гипотеза: первый по алфавиту, `zz_krinik.txt` раньше `zz_krinik_*.txt`).

## Inventory (скрипт по всем `zz_krinik*.txt`, 2026-10-17 16:21) — 9 ключей с разными переводами

| Ключ (начало) | Файлы |
|---|---|
| `Tip {{A}}: Keep in mind that enemies…` | zz_krinik.txt:135 · zz_krinik_tips.txt:39 — **починено: строка 135 удалена** |
| `Food Slot -` | zz_krinik.txt:481 · zz_krinik_terms.txt:122 (разница — двоеточие) |
| `Potion Slot -` | zz_krinik.txt:482 · zz_krinik_terms.txt:199 (двоеточие) |
| `Animal Form - ` | zz_krinik.txt:484 · zz_krinik_terms.txt:40 (двоеточие) |
| `Press the 'I' key … assign food to equipment slot` | zz_krinik_gametips.txt:17 · zz_krinik_help.txt:9 |
| `Towns are great for trading goods and services…` | zz_krinik_gametips.txt:34 · zz_krinik_terms.txt:250 |
| `The choices you make will affect your journey…` | zz_krinik_gametips.txt:37 · zz_krinik_terms.txt:245 |
| `<color=#BC1D11>Animal Form</color> … Equip a necklace…` | zz_krinik_gametips.txt:44 · zz_krinik_terms.txt:22 (и цвет заголовка разный) |
| `<color=#BC1D11>Game Settings</color> … Have you checked…` | zz_krinik_gametips.txt:61 · zz_krinik_terms.txt:23 |

## Fix plan

1. Проверить порядок XUnity на одном ключе: два разных перевода в двух файлах, кадр строки в игре — какой показан. Поправить комментарий
   `translation_deploy.sh:4` по наблюдению.
2. По каждому из 8 ключей оставить один перевод — согласованный (совет/подсказка — из `gametips_ru.tsv`, термин — из глоссария),
   второй удалить у его источника (`zz_krinik_gametips.txt` пишет `tools/gametips_xunity.py` — руками не править).
3. Страж: проверка дублей с разными переводами — в `translation_deploy.sh` перед копированием, красная останавливает выкладку.

## Decisions made without the owner

- `[AI]` Удалил старый перевод совета из `zz_krinik.txt`, оставил согласованный `zz_krinik_tips.txt` — по правилу методички «Совет N:,
  дальше с большой» и по согласованию советов 2026-10-13.
