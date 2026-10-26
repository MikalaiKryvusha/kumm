# Интервью #025 — Конан: как часто засады в сборке «из коробки»

> Topic: поставочные числа двух модов засад — Night Terrors и PvE Plus Ambush (ваш заказ «редко и случайно, из коробки», план 33 шаг 22;
> план 35 Г9)
> Source of the idea: разведка ассетов 2026-10-26 18:28–18:30 — где лежат умолчания и какие они сейчас
> Created: 2026-10-26 18:30 +03:00
> Status: **❓ ждёт ответа**

## Что сейчас стоит в модах (умолчания авторов)

| Мод | Что | Сейчас |
|---|---|---|
| Night Terrors | шанс засады ночью | 80 % |
| Night Terrors | часы засад | с 21 до 5 |
| PvE Plus Ambush | пауза между засадами | не меньше 1 ч + случайно до 20 мин |
| PvE Plus Ambush | шанс засады, когда пауза прошла | 50 % |
| PvE Plus Ambush | волн в засаде | до 5, шанс следующей волны 65 % |

Числа меняются в поставке мода (правка ассета, KRINIK MODIFIED); игрок с сохранёнными настройками мода меняет их в его окне сам.

## QUESTIONS

### Q1. Какие числа поставить?

**Answer target:** `plans/35_conan_build_turnkey_quality.md` → Г9

<!-- archaeology: node .kaif/tools/contour/review.mjs --search "засады редко случайно" → 45 hits · read: interview_008 (засады на дорогах MD — не то), plans/35 Г9 · prior: «редко и случайно, из коробки» — заказ владельца, план 33 шаг 22; чисел не называл -->

- **A) (рекомендую) Редко**
  - Situation. Вы играете соло ПвЕ вечер, 3 часа реального времени, ходите по миру.
  - Action. Засады срабатывают сами, вы ничего не настраиваете.
  - Result. PvE Plus Ambush — примерно одна засада за 2–3 часа (пауза 2 ч + случайно до 1 ч, шанс 35 %); ночью Night Terrors нападает
    в одну ночь из четырёх (шанс 25 %), часы прежние.
  - Check. `Default__MDC_AmbushWidget_C`: `ConfigSettingMinTimeBetween` 7200, `ConfigSettingMaxExtraTime` 3600, `AmbushChance` 0.35;
    `NightTerrorsAdminSettings` 80.0 → 25.0.
- **B) Умеренно**
  - Situation. Тот же вечер.
  - Action. То же.
  - Result. PvE Plus Ambush — засада примерно раз в 1,5–2 часа (пауза 1 ч 20 мин + до 40 мин, шанс 50 %); Night Terrors — в одну ночь из
    двух-трёх (шанс 40 %).
  - Check. `ConfigSettingMinTimeBetween` 4800, `ConfigSettingMaxExtraTime` 2400, `AmbushChance` 0.5; Night Terrors 80.0 → 40.0.
- **C) Оставить как у авторов**
  - Result. Числа из таблицы выше.
- **D) your own answer** — свои числа

**Answer:**
