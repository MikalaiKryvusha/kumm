# Bug 27 — Svarog's Dream: реплики героя над головой (PlayerCommentsManager) вне переписи — английские

**Status:** 🔴 OPEN
**Severity:** S2 — герой говорит по-английски в русской игре; данные не задеты
**Version/build:** SvarogsDream `2a4ed60` · **When/context:** 2026-10-07 ≈21:51, сообщено владельцем из своей игры во время
закрытия чата

## Symptom

`[OWNER]` «Fell that? Somoone watcing над головой героя на английском» · 2026-10-07 ≈21:51.

## Forensics

Декомпиляция `PlayerCommentsManager.cs` (2026-10-07): реплики героя — массивами `GetRandomShout(new string[7] { "Eyes in the dark,
stay sharp.", "Feel that? Something’s watching.", "The air’s heavy, …" … })`, литералов длиннее 6 знаков в файле — 53. Выемка
`tools/dialogue_extract.py` берёт массивы только вида `FluentString.FromStringArray(new string[n] { … })` (`ARR`), а сторож
`unread_calls` смотрит только вызовы `Write/Option/Yell/Say/Text` — оба мимо. Ни в `dialogue_en.tsv`, ни в машинном словаре строки нет.

## Root cause

Двойник бага 22 (`census-by-own-pattern`, EXP-0168): перепись ищет по своему шаблону, а реплики героя живут в другом шаблоне.

## Fix plan

1. Выемка: массивы литералов-аргументов `GetRandomShout(new string[n] { … })` (и проверить другие `new string[n] {` в коде реплик —
   найти ВСЕ места с массивами фраз, `grep -n "new string\[" decomp/*.cs`).
2. Сторож: считать и такие массивы непрочтёнными, если шаблон их не взял.
3. Перевести партией (голос героя, без рода — STYLE §1 п. 9), выложить, увидеть в игре.

## Decisions made without the owner

(при закрытии)

## Links

Баг 22 (выемка), EXP-0168, `SvarogsDream/tools/dialogue_extract.py`.
