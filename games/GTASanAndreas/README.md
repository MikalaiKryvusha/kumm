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

## Настройки, изменённые по слову владельца

| Дата | Что | Где | Откат |
|---|---|---|---|
| 2026-10-03 | Время жизни выпавшего из NPC оружия и денег ×100: `TimePickupShort = 2000000` (было `-1` = 20000 мс), `TimePickupMoney = 3000000` (было `-1` = 30000 мс) | `modloader\Gameplay\MixSets.ini`, секция `[Densities]` | `MixSets.ini.2026-10-03.bak` рядом |
| 2026-10-03 | `NumDesiredLoadedVeh = 100` (было `-1` → `stream.ini` «vehicles 12»); ×3 дальности: машины `VehDespawnOnScr` 540, `VehDespawnOffScr` 255, `VehDrawDist` 480; люди `PedSpawnOnScr` 301.5, `PedSpawnOffScr` 187.5, `PedDespawnOnScr` 345, `PedDespawnOffScr` 223.5, `PedDrawDist` 330; `PedWeaponDrawDist = 12` (оружие в IDE 30/50/100) | то же | `MixSets.ini.2026-10-03_before-distances.bak` |
| 2026-10-03 | Дальность объектов карты ×3 (Project2DFX `[IDETweaker]`): `AllNormalObjectsDrawDistance` 400→1200, `GenericObjectsDrawDistance` 200→600; растительность не трогали (LOD деревьев у Proper Fixes) | `modloader\Graphics\SALodLights.ini` | `SALodLights.ini.2026-10-03.bak` |

Появление МАШИН в MixSets не настраивается (только удаление); где в коде (`CCarCtrl::GenerateOneRandomCar` 0x430050) — не найдено.
Полный каталог MixSets на русском — `mixsets-catalogue.md`.

Почему именно эти ключи — по коду, не по описанию: MixSets пишет их в `0x457236` / `0x457250` (`ReadIni.cpp`);
там в `CPickups::GenerateNewOne` прибавка к `CTimer` для типа 4 (`PICKUP_ONCE_TIMEOUT`) и 8 (`PICKUP_MONEY`);
`CPed::CreateDeadPedWeaponPickups` даёт тип 4, `CreateDeadPedMoney` → `CreateSomeMoney` — тип 8 (gta-reversed).
`TimePickupLong` (тип 5) к выпадению из NPC не относится. В SA-MP MixSets эти значения не пишет (`!inSAMP`).
Применяется при запуске или в игре чит-командой `SETS` (перечитать ini). Проверка — чтение памяти процесса:
`0x457236` и `0x457250` должны показать 2000000 и 3000000.

## Графика

Разведка 2026-10-03 — `researches/gtasa-graphics/README.md`. Коротко: сборка — Vanilla Overhaul, её картинка
держится на SkyGfx Extended, и на нём же стоит Proper Fixes. RenderHook требует снять SkyGfx, SkyGrad и
EffectLoader и не работает в SA-MP, поэтому в эту папку не ставится. HD-текстуры: RoSA Evolved (MixMods,
4 ГБ, под modloader, адаптирован под SA-MP; Proper Fixes должен стоять выше по приоритету).

### RoSA — УСТАНОВЛЕН 2026-10-03 ≈09:30 +03:00 по слову владельца «примени, с бекапом»; запуском НЕ проверен

Сделано по плану ниже: Proper Fixes VO → `D:\Games\GTA San Andreas Mods\_backup\2026-10-03_rosa\Proper Fixes (VO)`
(124 файла, байты сверены), на его месте Proper Fixes для RoSA (123 файла = архиву, без PS2 Grass / Race maps /
cuts.img — как было у VO); `modloader\RoSA Project Evolved` (108 файлов = архиву); `modloader.ini` +
`rosa project evolved = 45`. Откат по шагам — `ОТКАТ.txt` в папке бэкапа. Proper Player Retex и «(For SAMP)» НЕ
ставились. SA Optimized Map Proper Fixes для RoSA — подмножество `txdp.ide` RoSA (1368 общих, 0 расхождений).
Картинки «до/после» с MixMods — `D:\Games\GTA San Andreas Mods\_RoSA comparisons` (настоящие сравнения — `COMPARE_*`).

(История: скачан по слову владельца 2026-10-03 «качай, будем потом ставить RoSA».)

**Слово владельца после первой игры** `[OWNER]` «как были текстуры земли, асфальта - дерьмом, так и остались» · 2026-10-03.
Замер (скретчпад `ground.py`): из 918 .txd с землёй/дорогами 624 берутся из ОТДЕЛЬНЫХ файлов VO (PS2-фикс карты),
294 — из RoSA; у 291 версия RoSA крупнее той, что в игре (`lanroad` VO 256 / RoSA 512, `vegasroads` 256→1024).
Анизотропия уже максимум (MixSets `ForceAnisotropic = 1`, `Anisotropic = -1`). Сравнения на файлах владельца —
`_RoSA comparisons\MY_BUILD_*.png`. Готово к установке по слову владельца: `D:\Games\GTA San Andreas Mods\RoSA Ground
Override` — 269 .txd RoSA отдельными файлами, приоритет 70 > Map 65 (инструкция `ПРОЧТИ.txt`, отбор в
`_override_manifest.json`). RoSA не перерисовывает землю: та же картинка, резче.
**Поставлено 2026-10-03 ≈09:55 по слову «ставь»**: папка в `modloader\RoSA Ground Override`, `rosa ground override = 70`;
итог 268 .txd — `cs_scrapyard.txd` оставлен VO (ничья с `Missions` = 70, это фикс катсцены). Откат — `ОТКАТ.txt`.
Запуском не проверено.

Лежит в библиотеке модов владельца `D:\Games\GTA San Andreas Mods\`:
- `(Lower Resolution) RoSA Evolved - July.7z` — 1 343 292 091 байт, SHA256 `366A0721…C59FDA62`; самая свежая
  БЕСПЛАТНАЯ сборка (Patreon-пост 2026-07-15, readme «Evolved v1.4»). Полное разрешение и август/сентябрь —
  только по подписке автора (Patreon/Boosty); во всех открытых постах март–июль только облегчённая версия.
- `Proper Fixes - for RoSA Evolved.7z` — 333 356 169 байт, SHA256 `f3e41a48…047987ed`, 583 файла; MixMods,
  страница обновлена 16/07/26, Google Drive `1Y8-4QC3Id48Os5GHsYx5MO6tUHCP6LdP`. Readme: «Version for use with
  RoSA Evolved only». Обязателен в паре с RoSA. Оба архива прошли `7z t`.

План установки (разбор — `researches/gtasa-graphics/README.md` §4b), только когда игра закрыта:
1. Снимок: копия `modloader\modloader.ini`; папку `modloader\Map\modpacks\Proper Fixes` из VO ПЕРЕНЕСТИ
   (не удалять) в `D:\Games\GTA San Andreas Mods\_backup\`.
2. Поставить Proper Fixes для RoSA на её место (`Map\modpacks\`, приоритет Map 65 > RoSA — так требует автор:
   «otherwise your game will crash»).
3. Распаковать из архива RoSA папку `modloader\RoSA Project Evolved` в `modloader\`; «(For SAMP)» — отдельно,
   если нужен SA-MP; Proper Player Retex (`player.img` 897 МБ) — по желанию.
4. В `modloader.ini` → `[Profiles.Default.Priority]` строка `RoSA Project Evolved = 45`: тогда `weapon.dat` и
   `generic\vehicle.txd` из VO (папки без приоритета = 50) выигрывают у RoSA, а Proper Fixes (65) остаётся выше.
   `IgnoreFiles` для этого НЕ годится — он выключает файл с таким именем во всех модах.
5. Проверка: `modloader.log` (RoSA и Proper Fixes загружены, без ошибок) → запуск → кадры с текстурами.
   Краш на старте: чистить кэш `%localappdata%\modloader` (совет автора); ошибка `ImgLimitAdjuster` — у RoSA
   свой `SimpleLimitAdjuster_IMGfiles.asi` в `RoSA Project Evolved - Scripts`.

Чего ждать: из 4012 текстур RoSA видно ~1971; машины, оружие, 1328 текстур карты (PS2-фикс VO), интерфейс
остаются от VO, потому что отдельные файлы modloader всегда ставит выше `.img`.

## Не починено

- **2026-09-28 23:21, `0x0048A121`, чтение `0x46C`** — внутри CLEO-скрипта, опкод `0449` («в машине ли
  персонаж») по удалённому персонажу. Виноват какой-то CLEO-скрипт, не игра; какой — не найдено.
