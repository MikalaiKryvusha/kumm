# Test run report — GTA SA: CopDoorLoadFix.asi (краш 0x645F40 при загрузке сейва во время ареста)

**Created:** 2026-10-03 08:49 +03:00 · **Run by:** the agent (Claude Opus 5.5) ·
**Version/build:** CopDoorLoadFix 1.0, собран MSVC 2022 x86 /O1 /MT, 90 112 байт

## 1. Work

Заплатка против краша владельца 2026-10-03 ≈08:40: игрок в машине, коп открывает дверь для ареста, игрок
грузит сейв → Access violation reading 0x474 в 0x00645F40 (`~CTaskSimpleCarOpenDoorFromOutside`). Основание —
журнал CrashInfo из окна краша, слова владельца в чате («я был в машине, меня вот-вот собирался полицейский
арестовать, я зашёл в меню и начал загружать сейв») и дизассемблер `gta_sa.exe` (досье
`games/GTASanAndreas/README.md`). Набора кейсов нет: проверялось, что заплатка встаёт и не ломает запуск.

## 2. Contour

Живая установка владельца `D:\Games\GTA San Andreas` со всеми его модами (modloader, CLEO 5.4, SilentPatch,
FramerateVigilante). `gta_sa.exe` не правился. ASI положен в `scripts\` новым файлом.
REAL WORLD: accumulated — его моды и сейвы; data and machine — его машина, его папка игры; path — обычный
запуск `gta_sa.exe`, как запускает он.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-10-03 08:47 +03:00 | `build.cmd <scratchpad>\asi-build` | 0 · `CopDoorLoadFix.asi` x86 (machine 0x14c) |
| 2 | 2026-10-03 08:48:21 +03:00 | `Start-Process "D:\Games\GTA San Andreas\gta_sa.exe"` | процесс 3116, окно «GTA: San Andreas», Responding=True |
| 3 | 2026-10-03 08:48 +03:00 | `readmem.ps1` (ReadProcessMemory 0x645F40 и 0x64AD63, по 22 байта) | оба адреса = `83c40485c0740f818874040000000000049090909090` |
| 4 | 2026-10-03 08:48:43 +03:00 | `Stop-Process -Name gta_sa` | игра закрыта |

## 4. Checks

Hygiene: сборка /W4 без предупреждений · capstone-разбор байтов заплатки: оба `je` ведут на 0x645F56 / 0x64AD79 — туда же, куда шла игра · исходная последовательность найдена в файле ровно в двух местах (поиск `call FindPlayerPed` → `+0x474`, 669 вызовов просмотрено)
Functional run: запуск живой игры владельца до главного меню; ПРОЧИТАНО — журнал `scripts\CopDoorLoadFix.log` (две строки `patched`), байты в памяти процесса, снимок экрана (главное меню, «CLEO v5.4.0 · 10 plugins»). Сценарий «арест из машины + загрузка сейва» НЕ пройден

| Case | Status | Observation |
|---|---|---|
| C1 заплатка встаёт на оба места | pass | журнал `patched` ×2; ReadProcessMemory показывает новые байты |
| C2 игра с заплаткой стартует | pass | главное меню на снимке, процесс отвечает |
| C3 загрузка сейва во время ареста из машины не падает | skipped | нужен живой арест; ждёт владельца в игре |

## 5. Found

- none — дефектов заплатки не найдено; исходный краш — баг самой игры (досье, раздел «Починено»)

## 6. Traces

Снимки и журнал окна краша — scratchpad сессии (`screen.png`, `screen2.png`, `crashinfo-dialog.txt`);
`D:\Games\GTA San Andreas\logs\gta_sa.exe_2026-10-03_08-41-11.log`; `D:\Games\GTA San Andreas\scripts\CopDoorLoadFix.log`.

## 7. Verdict

partial — заплатка стоит и запуск не ломает (C1, C2); сам краш (C3) не воспроизведён, подтвердит владелец в игре.
