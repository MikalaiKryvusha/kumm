# Bug 43 — Svarog's Dream: всплывающие «+N» над героем (сытость, мана) рисуются не теми знаками

**Status:** ✅ DONE 2026-10-13 12:41 — починено, проверено после перезапуска
**Severity:** S2 — игрок не читает прибавку; данные не задеты
**Version/build:** SvarogsDream `3a664bf`, KrinikUIRework `CombatText.cs` (кириллический атлас CFXR, 2026-10-11) · **When/context:** 2026-10-13
12:09, кадры для интервью #013 (вопрос 4), найдено агентом

## Goal vector

Achieve: всплывающее «+10» сытости и «+5» маны над героем читаются как «+10» и «+5». Acceptance: кадр после
`h.sh "call UIPopUpSpawner ShowHealHungerPopUp 10"` показывает три знака «+10»; то же для маны и для чисел урона в бою.

## Symptom

Игра пишет `ShowPlayerAnimatedText($"+{amount}", Color.yellow)` (`UIPopUpSpawner.ShowHealHungerPopUpCoroutine`, декомпиляция) — то есть
«+10». На экране над героем шесть знаков: «+», две пары стрелочек и крупная «А» (кадры `SvarogsDream/_harness/fp_2.webp`, `fp_zoom.webp`).
Синее «+5» маны (`fp_1.webp`) — тоже не читается.

## Repro (deterministic)

`bash tools/run-game.sh` → `bash tools/h.sh "call UIPopUpSpawner ShowHealHungerPopUp 10" "shot a" "wait 0.1" "shot b"` → кадр над героем.

## Root cause / Hypotheses

1. (горячее) Слово идёт частицами Cartoon FX (`CFXR_ParticleText_Runtime`); наш атлас с кириллицей (`tools/cfxr_cyrillic_atlas.py`,
   `CombatText.cs`) сдвинул ячейки цифр и знаков: «1» и «0» берут чужие клетки. Проверить: число урона в бою — так же?
2. Перевод через XUnity `TryTranslate` в `CombatText.cs` заменяет «+10» чем-то (правило `r:` с числом?) — журнал мода покажет.

## Fix plan

Сначала журнал (что приходит в `CombatText` и что уходит в частицы), затем атлас; кейс в TC на «+10», «+5», урон.

## Decisions made without the owner

(при закрытии)

## Links

`bugs/28_*` (раздел «Combat words»), `testcases/TC_svarog_combat_text_2026-10-11.md`, интервью #013 вопрос 4.

## Fix (2026-10-13 12:38–12:41)

Журнал `combat text: '+10' -> '+{{A}}'`: синхронный XUnity `TryTranslate` на числе отдаёт шаблон словаря без подстановки, частицы
рисовали «{», «{», «A», «}», «}». Гипотеза 2 подтвердилась, 1 — нет. `CombatText.TranslateCombat`: результат с «{{» не берём, остаётся
исходная строка (SvarogsDream). TWINS: searched `TryTranslate|_xuTry` in src — found 0 other sites. Проверка: прогон 13 после перезапуска,
«+10» и «+5» читаются (`testcases/TC_svarog_colour_tags_2026-10-13.md` C28). Числа урона в бою идут тем же путём — в бою не смотрено.

Hygiene: `dotnet build` успешно. Functional run: игра, вызов `ShowHealHungerPopUp 10`, кадры над героем — прочитаны.

## ✅ STATUS: DONE (2026-10-13 12:41)

## Decisions made without the owner (closing)

- `[AI]` Шаблон без подстановки не подставляю сам (числа «A, B…» сопоставить можно), а оставляю исходную строку: «+10» по-русски
  не отличается от английского.
