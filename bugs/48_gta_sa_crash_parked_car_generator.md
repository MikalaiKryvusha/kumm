# Bug 48 — GTA SA: падение 0x006F3EF5 — предел генераторов припаркованных машин

**Status:** 🔴 OPEN — записано, не разбиралось (`[OWNER]` «gta sa завис» · «сделай скриншот, нужно булдет починить потом» · 2026-10-14 ≈21:42)
**Severity:** S2 · **Version/build:** сборка `D:\work\ai_sandbox\GTASanAndreas` (CLEO 5.4.0, CLEO+ 1.2.0, 68 скриптов CLEO) · **When/context:**
2026-10-14 21:42, игра владельца; процесс `gta_sa` запущен 21:40:05, окно «Crash! Ah shit, here we go again.» (CrashInfo v1.2, MixMods)

## Symptom

Игра «зависла» — на деле упала: поверх окно CrashInfo, процесс жив (Responding = True), игра не идёт. Падение через ≈2,5 мин после
запуска.

## Forensics

Снимок экрана: `D:\work\ai_sandbox\GTASanAndreas\_crash\2026-10-14_2142\screen.webp` (3840×2160). Текст окна, переписанный с кадра:

```
Error: 0x006F3EF5
Problem: Limit of parked cars. The so-called "parked car generator".
Solution 1: Try to install Fastman92 Limit Adjuster, open the .ini and in "#Car generators = 500" remove the "#" ... and increase
            the number to about 550, 600 or even more.
Solution 2: Or simply decrease the parked cars, possibly you or mods have added too many parked cars on the map, even more poorly
            made cleo mods that each time you save the game it creates a new car, so it becomes a pile of parked cars in your save
            game ... take out such mods, and if it doesn't, you'll have to leave your save game behind and use another one.
Solution 3: Open the .ini of your Open Limit Adjuster and in "Vehicles" decrease the value in case above 200, leave between 110
            and 200. It has already been solved in 130.

GTA SA 1.0.0.0 US
Unhandled exception at 0x006F3EF5 in gta_sa.exe (+0x2f3ef5): 0xC0000005: Access violation reading location 0x207D527E.
EAX 0x207D5248 EBX 0x207EF020 ECX 0xFFFFD705 EDX 0x03CE70F8 EDI 0x00000009 ESI 0x00C27F30 EBP 0x0177F774 EIP 0x006F3EF5
ESP 0x0177F60C · Stack 0x0177F60C: 00000001 00C27F30 006F3F9E 00000000 0053C06F 0053BEE0
```

Окно просит не скриншот, а полный журнал — кнопка «Save to 'logs' folder» в самом окне (не нажималась: окно владельца).

## Hypotheses (ranked, не проверены)

1. Переполнен пул генераторов припаркованных машин (500 по умолчанию): скрипт CLEO, плодящий машину на каждое сохранение, или сам сейв
   накопил генераторы — CrashInfo называет это первым.
2. Предел `Vehicles` в ini Open Limit Adjuster выше 200 (решение 3 окна).

Догадка владельца: `[OWNER]` «видимо какой-то мод наш про машины бля ломает игру» · 2026-10-14 ≈21:43. Сверка того же часа: из 9 модов
в `modpack.json` про машины один — «Схема управления: вертолёт и мотоцикл» (config); наши правки сборки за последние коммиты —
управление и дальность пули (`weapon.dat`), машин на карту они не ставят. Под подозрением — 68 скриптов CLEO базовой сборки и сам сейв.
Проверить первым — список CLEO, ставящих машины (генераторы), и дату появления каждого.

## Fix plan

1. Журнал CrashInfo (`logs`), список CLEO-скриптов с генераторами машин, ini лимитов сборки — сверить с решениями 1–3.
2. Кейсы — до правки; прогон на копии сейва владельца.

## Decisions made without the owner

— (не начато)
