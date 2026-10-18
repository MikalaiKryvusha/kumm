# Bug 54 — ячейки второго набора красные после первой смены оружия

**Status:** 🔧 reproduced and the fix verified 2026-10-18 03:30–03:34 (`testcases/TC_svarog_night_batch3_2026-10-18.md`: B1–B3 on video, B0 and B4 by pult readings and a still frame): same skill in both sets, cast in one set, cooldown ends, swap → the twin stays dark-red with `IsOnCooldown` True and the skill cannot be cast (fix off); with the fix — clean, flag false, the skill casts; a running cooldown is kept. Open only for the owner's word: «вся панель» (all slots) is not yet explained — interview #024, Q1. (Earlier three variants 02:52–02:54 had an empty second set and proved nothing — judge, item 2.); the owner's path is asked in interview #024, Q1
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

## Judge 2026-10-18 (scratchpad judge1) — gaps in the story

- `UISlotCooldown.Start()` runs after `OnEnable` on the FIRST activation of a slot that was inactive since load and resets background, fill
  and text — so on the very first show the red may be wiped while `m_IsOnCooldown` stays true, which silently blocks casting
  (`SpellActivator.cs:446` checks `IsOnCooldown`). Our postfix runs inside `OnEnable` (before `Start`) and clears the flag, so it covers this too
  — not observed yet.
- The story explains only slots that hold the same skill as a used main-set slot, not "the whole panel" turning red. Unexplained.
- The control toggle `Hud/StaleCooldownFix` was left `false` after the control run and turned back on at 03:18; a guard now names such leftovers
  (`SvarogsDream/tools/cfg_run_diff.py`, called by `h.sh` on kill).
- Next run (batch 3): `slotspell 0` → `call SpellsActionManager AssignSpell 12 <id>` (same skill in the second set) → cast in the main set → wait
  out the cooldown → swap; once with the fix off, once on; video.
