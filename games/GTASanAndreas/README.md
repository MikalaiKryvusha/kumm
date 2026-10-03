# GTA San Andreas — досье

> Что мы знаем об установке игры и что уже чинили. Читается перед любой правкой в папке игры.
> Игра: `D:\Games\GTA San Andreas`, `gta_sa.exe` 1.0 US. Моды: modloader (`modloader\<раздел>\…`),
> CLEO 5.4 (+ CLEO+), ASI-плагины в `scripts\` (SilentPatch, FramerateVigilante, modloader.asi), сборка
> Vanilla Overhaul. Краши ловит CrashInfo v1.2 (MixMods): окно «Crash! Ah shit, here we go again.»,
> кнопка «Save to 'logs' folder» пишет `logs\gta_sa.exe_<дата>_<время>.log`.

## Как разбирать краш (сделано 2026-10-03, повторяемо)

1. **Журнал взять из окна, не нажимая кнопок:** UI Automation по PID процесса `gta_sa` отдаёт весь текст
   «Crash dump / Log» — регистры, стек, backtrace с именами функций (CrashInfo знает символы).
2. **Момент — по `cleo.log`:** строки «Unregistering custom script… / Cleaning up script data…» значат
   загрузку сейва или новую игру; краш сразу после них — краш при сносе мира.
3. **Адрес — в машинный код:** capstone (`pip install --target <scratchpad>\pylib capstone`) по файлу
   `gta_sa.exe`, VA → смещение по таблице секций. Код в файле совпадает с кодом в памяти.
   Свой скрипт НЕ называть `dis.py` — он затеняет модуль `dis`, и capstone падает на импорте.
4. **Готовый фикс искать в двух списках:** MTA `Client/multiplayer_sa/CMultiplayerSA_CrashFixHacks.cpp`
   (адреса HOOKPOS) и исходник SilentPatch (`SilentPatchSA/*.cpp`). Найдено там — ставить их; нет — своя ASI.
5. **Двойники:** тот же код в exe часто стоит дважды — искать байтовым шаблоном по всему `.text`.

## Починено

| Дата | Краш | Причина | Фикс |
|---|---|---|---|
| 2026-10-03 | `0x00645F40`, чтение `0x474`, `~CTaskSimpleCarOpenDoorFromOutside` | Баг игры: задача копа «открыть дверь снаружи» при выходе пишет флаг игроку через `FindPlayerPed()` без проверки; при загрузке сейва во время ареста из машины CJ уже удалён → запись в 0+0x474. Двойник — `0x0064AD63`. MTA чинит только соседа (`0x646026`), SilentPatch — ничего | `CopDoorLoadFix/` → `scripts\CopDoorLoadFix.asi`: проверка «игрок есть?» в обоих местах, 22 байта на месте; ставит только поверх точного оригинала, журнал `scripts\CopDoorLoadFix.log` |

Сборка: `games\GTASanAndreas\CopDoorLoadFix\build.cmd <папка>` (VS 2022, x86, без лишних DLL). Exe игры не
правится. Проверка, что заплатка встала, — журнал рядом с .asi: обе строки `patched`.

## Графика

Разведка 2026-10-03 — `researches/gtasa-graphics/README.md`. Коротко: сборка — Vanilla Overhaul, её картинка
держится на SkyGfx Extended, и на нём же стоит Proper Fixes. RenderHook требует снять SkyGfx, SkyGrad и
EffectLoader и не работает в SA-MP, поэтому в эту папку не ставится. HD-текстуры: RoSA Evolved (MixMods,
4 ГБ, под modloader, адаптирован под SA-MP; Proper Fixes должен стоять выше по приоритету).

## Не починено

- **2026-09-28 23:21, `0x0048A121`, чтение `0x46C`** — внутри CLEO-скрипта, опкод `0449` («в машине ли
  персонаж») по удалённому персонажу. Виноват какой-то CLEO-скрипт, не игра; какой — не найдено.
