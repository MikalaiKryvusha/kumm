# Test cases — Svarog's Dream: `terrainset` без значения; цена цифры уровня полосы моба — разовая или у каждой полосы (2026-10-17)

> **Created:** 2026-10-17 · **Parent:** находки запусков 4 и 11 (`testcases/TC_svarog_scan_wait_mobbar_2026-10-17.md` H1,
> `testcases/TC_svarog_dust_storm_bara_2026-10-17.md`) · **Status:** написаны до прогона

## Basis

Пульт `terrainset <свойство>` без значения падал `IndexOutOfRange` — починено (SvarogsDream `26a2eea`). Цифра уровня полосы моба стоила
0,74 мс одним куском (H1) — у первой полосы сеанса; если следующие полосы дешевле 0,3 мс, это разовая цена (шрифт), а не пик каждого боя
(бюджет `[OWNER]` «Лаги не допустимы в игре, когда герой бегает а игрок играет, воюет» · 2026-10-14).

## Dimensions

- Пульт: одно свойство с числом (`basemapDistance`).
- Полосы: кабаны у Града (первая полоса сеанса и ещё две-три), без бессмертия, герой отходит после появления полос.

## Cases

| ID | Steps | Expected | Evidence | Status |
|---|---|---|---|---|
| K1 | Чистый запуск (пульт `26a2eea`), `terrainset basemapDistance` | строка `terrainset basemapDistance = 1000..1000 on N terrains`, без `ERR` | вывод пульта | **pass** · 08:30 запуск 12: `terrainset basemapDistance = 1000..1000 on 22 terrains`, без `ERR` |
| K3 | Новый пульт `compsof`: чистый запуск, `compsof WorldAreas/Area (104-98)/Content/Humans`, `compsof WorldAreas/Area (104-98)/Content/Houses`, `compsof WorldAreas/Area (104-98)/Content/Monsters` | строки `children N, all M, components K` и типы компонентов; видно, контейнер ли `Humans` (только `Transform`) или со скриптом | вывод пульта | **pass** · 08:34 запуск 13: в участке 104-98 `Humans` нет (`ERR not found`); `Area (106-98)/Content/Humans` — `children 2, all 428, components 1` (`Transform`); `Houses` 0 детей, `Monsters` 2/28, `PickablePlants` 20/190 — все только `Transform`. Значит, дробление их берёт, и 1,2–1,6 мс на имени `Humans` в журнале очереди — включение самого контейнера после дробления; почему так дорого — не выяснено |
| K2 | Подойти к кабанам у Града (`walk -351.9,100.1,1350.6`, затем к `-346,100.1,1302.8`), журнал `mob bar first frames ms` | строк `level` с ценой > 0,3 мс — одна (первая полоса), у следующих полос строк нет | журнал | **blocked** · 08:31 запуск 12: полоса появилась у одного кабана (`[11]WildBoar (4)`, снова `level 0,74`), остальные героя не заметили — второй полосы не было, вопрос «разовая ли цена» не решён. Повторить в бою с несколькими врагами |
