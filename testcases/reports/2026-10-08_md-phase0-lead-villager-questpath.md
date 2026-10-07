# Test run report — Medieval Dynasty фаза 0: квестовый путь не ведёт обычного жителя

**Created:** 2026-10-08 02:01 +03:00 · **Run by:** агент (Claude Opus 5.5) · **Version/build:** Medieval Dynasty 2.7.0.3,
UE4SS 1161; пак: `KrinikWake` v2 (`goto`, `track`), `KrinikBridge` v8, `KrinikProbe` v2, `KrinikFastStart` v4

## 1. Work

Шаг 0.2 плана `plans/16_epic15_phase0_recon_and_stand.md` и FORK «где считается мир» мета-плана 15: разбуженного жителя
нужно уметь направить («мост будит нужных и ставит им цель»). Кандидат из офлайн-разведки — интерфейсный вызов
`AIMulti_SetQuestPath(Destination)`, которым квесты водят жителей. Кейсы —
`testcases/TC_md_phase0_lead_villager_2026-10-08.md` (C1–C5).

## 2. Contour

Машина и сейв владельца («Быстрое сохранение», Оксбоу), герой у себя в деревне, клавиш не нажимали. REAL WORLD:
accumulated — его сейв; data and machine — его машина; path — его запуск игры (быстрый старт) и меню загрузки. Запись —
только в память игры; закрыта без сохранения, сейвы сверены с копией
`D:\Games\Medieval Dynasty Mods\_save-backup\2026-10-08_0045\` (48 .sav, sha256).

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-10-08 01:57 +03:00 | раскатка (5/5), запуск, загрузка; `where`; `goto BP_NPC_Multi_Village_C 5` | ведомых 5, ошибок 0, контрольных 5 |
| 2 | 2026-10-08 01:59 +03:00 | `track` через ≈30 с; `stages` | ведомые 1105 → 1105 м; разбужено 10 |
| 3 | 2026-10-08 01:59 +03:00 | `track` через ≈60 с; закрытие | ведомые 1105 → 1105 м; контроль 492 → 500 м |
| 4 | 2026-10-08 02:00 +03:00 | `sha256sum` сейвов | 48 сейвов целы |
| 5 | 2026-10-08 02:00 +03:00 | офлайн: байткод `SetQuestPath` (`BP_NPC_Multi_Village`), функции `AIC_NPC` | причина и следующий кандидат |

## 4. Checks

Hygiene: стенд `tools/test-wake.lua` 10/10, мутант «путь не задан» краснеет.
Functional run: игра и сейв владельца, `wake-out.txt` и `out.txt`. C1, C4, C5 pass; C2, C3 fail — ведомые не пошли.

## 5. Found

- **`AIMulti_SetQuestPath` обычного жителя не ведёт.** Вызов прошёл без ошибок у пятерых, но за 60 с ни один не
  приблизился (1105 → 1105 м). Контроль (только разбуженные) тоже почти стоял (492 → 500 м) — в этот час жители мало
  ходили, поэтому «путь их заморозил» по пяти жителям не утверждается.
- **Причина — офлайн:** внутренний `SetQuestPath` ищет ID жителя в `DT_QuestMultiNPCsRoads` (2 строки — квестовые
  `NPC_Q_M551`, `NPC_Q_F226`), берёт заранее записанную дорогу квеста и ближайшую к цели точку. Для остальных 95
  жителей вызов пуст. Это квестовые рельсы, а не общий «иди туда».
- **Следующий кандидат:** у контроллера `AIC_NPC` есть общий `AI_SetPath(CheckDistance, Distance, Destination)` и
  чтение пути `AI_GetPaths`/`AI_GetPathsPoint`; у blackboard — `SetBlackboardValues_MultiState` (4 = «Go to Location»).
  Проверять отдельным кейсом.
- **Рядом нашлось:** таблицы распорядка `DT_Multi_Village_*SeasonsBehavior` (по сезонам) и вызов
  `AIMulti_ChangeBehavior(NewBehaviorDT)` — жителю можно сменить распорядок целиком. Для «Рейнджеров» эпика это готовый
  рычаг профессии.

## 6. Traces

`ue4ss/Mods/KrinikWake/wake-out.txt`, `ue4ss/Mods/KrinikBridge/out.txt` (машина владельца, вне git).

## 7. Verdict

fail по цели кейса (житель не пошёл), pass по разведке: причина найдена в байткоде, следующий кандидат назван.
