# Bug 54 — ячейки второго набора красные после первой смены оружия

**Status:** 🔧 fix by code in place; not reproduced by the agent (2026-10-18 02:52–02:54, three variants on video — `testcases/reports/2026-10-18_svarog-night-batch1.md`, B54-1); the owner's path is asked in interview #024, Q1
**Severity:** S2 (видимый брак интерфейса; навык второго набора, похоже, не применить до следующей смены)
**Version/build:** KrinikUIRework после SvarogsDream `8888d8b` + правка `PatchStaleCooldown` · **When/context:** 2026-10-18 ≈02:28, владелец в
запуске агента пробовал новую кнопку смены наборов (план 31, пункт 2)
**Fixing:** this session

## Symptom

`[OWNER]` «на первом переключении панелей покрылась красным вся панель» · «на повторных уже не было такого» · «видел запишешь» · 2026-10-18 ≈02:28.
Ожидалось: ячейки второго набора без красной заливки (перезарядки у них нет).

## Repro (deterministic — по коду, прогон ждёт)

1. Загрузка мира; навык X стоит и в основном наборе, и во втором.
2. Применить X из основного набора — у ячейки перезарядка (красный фон и заливка).
3. Дождаться конца перезарядки.
4. Сменить набор (клавиша X игры или кнопка ⇅) → ячейка X второго набора красная; повторная смена туда-обратно — чисто.

## Forensics

Журнал 02:27–02:30: `swap button: swapped, second set True/False` — 15 смен подряд (щёлкал владелец). Красный у ячеек игры даёт только
`UISlotCooldown` (`Color.red` в `StartCooldown` и `ResumeCooldown`, `UISlotCooldown.cs:177, 226`).

## Root cause (по декомпиляции 2026-10-18)

- `SpellActivator.HandleCasterSpellUI` (`SpellActivator.cs:483–492`) шлёт `StartCooldown` всем ячейкам с тем же номером навыка — и спрятанным ячейкам
  второго набора.
- `UISlotCooldown.StartCooldown` у выключенной ячейки красит фон (`backgroundImage.color = Color.red`), включает заливку `fillAmount = 1` и ставит
  `m_IsOnCooldown = true`, но корутину не запускает (`if (activeInHierarchy) StartCoroutine`).
- Корутина видимой ячейки по окончании стирает общую запись `spellCooldowns` (`OnCooldownCompleted`).
- Первый показ второго набора: `OnEnable` → `CheckForActiveCooldown` записи не находит и ничего не делает — красный и флаг «на перезарядке»
  остаются. `OnDisable` при следующей смене зовёт `InterruptCooldown(false)` и всё сбрасывает — поэтому повторные смены чисты.

Не проверено глазом: что красные ячейки — именно навыки, применённые до смены (кейс B54-1).

## Fix

`KrinikUIRework/HotbarDrag.cs`, `PatchStaleCooldown`: постфикс на `CheckForActiveCooldown` — если ячейка числится на перезарядке, а у её навыка
перезарядки нет (`GetRemainingTime() ≤ 0`), — `InterruptCooldown(false)`, ровно то, что игра делает в `OnDisable`. Выключатель `Hud/StaleCooldownFix`.
Кейсы — `testcases/TC_svarog_night_batch1_2026-10-18.md`, B54-1…B54-3; прогон — с записью видео (правило владельца 2026-10-18, `HOUSE_RULES.md` §1).

TWINS: searched `StartCooldown(` в декомпиляции и модах — 2 места: `SpellActivator.cs:489` (игра) и `HotbarDrag.StartCooldown` (наш `Cool` шлёт
перезарядку еды и зелья всем ячейкам с тем же номером — тот же класс, правка покрывает обоих: она в точке показа, не в точке рассылки).

## Decisions made without the owner

- `[AI]` Правка — в точке показа ячейки (`CheckForActiveCooldown`), а не запрет рассылки на спрятанные ячейки: игра хочет, чтобы перезарядка
  настигла двойника, если он появится раньше её конца (`ResumeCooldown`), — это поведение сохранено.

## Links

План 31, пункт 2 (кнопка наборов) · `GAME_ARCHITECTURE_INTERNAL_MAP.md` — строка «Панель быстрых действий» (перезарядка).
