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

| 2026-10-03 | Потолки ×10: `VehLimit` 45→255 (байт, максимум), `PedLimit` 25→250; пулы OLA `[SALIMITS]` `Peds`/`PedIntelligence` 140→400, `Vehicles` 110→400 | MixSets.ini; `Performance\III.VC.SA.LimitAdjuster.ini` | `MixSets.ini.2026-10-03_before-limits.bak`, `III.VC.SA.LimitAdjuster.ini.2026-10-03.bak` |
| 2026-10-03 | Память подгрузки 2048→**4096** по слову «срочно давай 4 Гб, я запущу потестить» — ПРЕДУПРЕЖДЁН: 4 ГБ = весь потолок 32-битного процесса (exe с флагом LAA), ждём падение при заполнении | MixSets `StreamMemory`, OLA `MemoryAvailable`, Improved Streaming `StreamMemoryForced` | `*.2026-10-03_before-4gb.bak` у всех трёх |
| 2026-10-03 23:47 | Дальность полёта пуль ×2: колонка D (`weaponRange`) у всех 37 строк `INSTANT_HIT` — пистолеты 30/35→60/70, дробовики 40→80, Uzi/TEC9 →60/70, MP5 →80/90, AK47 70→140, M4 90→180, винтовка/снайперка 100→200, миниган 75→150; колонку C (`targetRange` — дальность захвата цели) не трогали. Снайперке эта колонка не указ: её пуля — снаряд со скоростью 16 и жизнью 1000 мс (`CWeapon::FireSniper` / `CBulletInfo::AddBullet`, gta-reversed), поэтому `SniperBulletLife = 2000`. Игра берёт `weapon.dat` из склейки modloader (`%LOCALAPPDATA%\modloader\…\gta3.std.data\0\weapon.dat`): мод Weapons перекрывает RoSA во всех 53 строках | `modloader\Weapons\data\weapon.dat`; `MixSets.ini` `[Weapons]` | `*.2026-10-03_before-range-x2.bak` у обоих |
| 2026-10-04 01:13 | Дальность полёта пуль ещё ×3 (итого ×6 к стоку) по слову «дистанции стрельбы ещё в три раза повысь для всего»: колонка D у 37 строк `INSTANT_HIT` и двух ракетомётов — пистолеты 60/70→180/210, дробовики 80→240, Uzi/TEC9 →180/210, MP5 →240/270, AK47 140→420, M4 180→540, винтовка/снайперка 200→600, миниган 150→450, RPG/Heat-seeker 55→165; `SniperBulletLife` 2000→6000. Колонку C и не стреляющее (броски, огнемёт, баллончики, камера) не трогали. Скрипт `tools/weapon_range.py` сборки GTA; сверено построчно: изменено 39 строк из 172, только колонка D. В игре не проверено | `modloader\Weapons\data\weapon.dat`; `modloader\Gameplay\MixSets.ini` | `*.2026-10-04_before-range-x3.bak` у обоих |
| 2026-10-16 23:23 | **Время жизни выпавших вещей и денег — 10 минут** (`[OWNER]` «и сократи время жидни предметов и денег до 10 минут» · 2026-10-16): `TimePickupShort` 2000000 → 600000, `TimePickupMoney` 3000000 → 600000; `[AI]` `TimePickupLong` −1 (120000) → 600000 — бронежилеты и аптечки войны банд (тип 5) тоже 10 минут, для них это продление с 2 минут. Память игры 23:51 — 600000 по трём адресам. Баг 52, раздел «Пикапы» ниже | `modloader\Gameplay\MixSets.ini`, `[Densities]` | `MixSets.ini.2026-10-16_before-pickups-10min.bak` рядом |
| 2026-10-14 ≈22:16 | Машины — логичная цепочка (`[OWNER]` «сделай по машинам логично» · 2026-10-14): `VehDrawDist` 225→160, `VehDespawnOnScr` 255→180; `VehDespawnOffScr` 112.5 оставлен. Почему: машины появляются кодом игры на ≈160 м (`CCarCtrl::GenerateOneRandomCar`, 160 × множитель камеры — множитель не замерян), ключа появления в MixSets нет; при видимости 225 они рождались на виду, а удаление 255 держало невидимые машины в пуле 200. Теперь появление ≈160 = видимость 160 < удаление 180 (как сборка до нас: 160/180). Дальние машины видны на 160 м, а не на 225 — цена | MixSets.ini | `MixSets.ini.2026-10-14_before-cars-logic.bak` |
| 2026-10-14 ≈22:13 | Люди: `PedDespawnOnScr` 140→160 (`[OWNER]` «переделай логично» · 2026-10-14, на замечание агента: появление в кадре 150 дальше удаления 140 — родившихся на 140–150 м игра стирала бы сразу). Цепочка теперь: вне кадра появление 100 < удаление 110; в кадре появление 150 = видимость 150 < удаление 160 | MixSets.ini | `MixSets.ini.2026-10-14_before-peds-owner.bak` (до всех правок людей вечера) |
| 2026-10-14 ≈22:12 | **Люди — значения владельца** (`[OWNER]` «Пулы людей и их ИИ = 300 · Предел людей = 200 · Дальность появления (в кадре / вне кадра) = 150 / 100 · Дальность удаления (в кадре / вне кадра) = 140 / 110 · Дальность видимости = 150» · 2026-10-14): OLA `[SALIMITS]` `Peds`/`PedIntelligence` 400→300; MixSets `PedLimit` 250→200, `PedSpawnOnScr/OffScr` 75.75/63.75→150/100, `PedDespawnOnScr/OffScr` 97.5/81.75→140/110, `PedDrawDist` 90→150. Комментарии «Owner 2026-10-03: x3 (was …)» у этих ключей в ini остались старыми | MixSets.ini; `Performance\III.VC.SA.LimitAdjuster.ini` | `*.2026-10-14_before-peds-owner.bak` у обоих |
| 2026-10-14 ≈22:09 | **Откат отменён, пул машин 400 → 200** (`[OWNER]` «а можем вернуть, как было, и поствить Пул машин в Open Limit Adjuster 400 = 200 ?» · 2026-10-14): оба ini — из `*.2026-10-14_before-cars-peds-rollback.bak` (всё как до отката: плотности, пределы 255/250, дальности, пулы людей 400), затем OLA `[SALIMITS]` `Vehicles = 200` — верх диапазона 110–200 из окна CrashInfo. Строка ниже — история | `Performance\III.VC.SA.LimitAdjuster.ini` | `*.2026-10-14_before-cars-peds-rollback.bak` (там `Vehicles = 400`) |
| 2026-10-14 ≈22:05 | **ОТКАТ машин и людей** (отменён в 22:09, строка выше) к значениям сборки до правок 2026-10-03 (`[OWNER]` «почени сейчас. давай откатим дистанции по машинам и их количествам на стоковые значения. Только машины, и людей, не дистанцию оружия» · 2026-10-14) после падения 0x006F3EF5 (bugs/48): MixSets `VehDensity` 1.45→1.2, `VehPopulationMult` 2.0→1.2, `VehLimit` 255→-1, `NumDesiredLoadedVeh` 100→-1, `VehDespawnOnScr/OffScr` 255/112.5→180/85, `VehDrawDist` 225→160, `PedDensityExt` 1.5→2.0, `PedPopulationMult` 1.5→2.0, `PedLimit` 250→-1, люди появление 75.75/63.75→100.5/62.5, удаление 97.5/81.75→115/74.5, видимость 90→110; OLA `[SALIMITS]` `Peds`/`PedIntelligence` 400→140, `Vehicles` 400→110. Оружие (`weapon.dat`, `SniperBulletLife`, `PedWeaponDrawDist`) и подбор (`TimePickup*`) не тронуты. `[AI]` «сток» прочитан как вид сборки до наших правок; ванильные значения игры (в скобках ini: 170/75/150, плотность 1.0) — следующим шагом, если владелец скажет | MixSets.ini; `Performance\III.VC.SA.LimitAdjuster.ini` | `*.2026-10-14_before-cars-peds-rollback.bak` у обоих |
| 2026-10-03 | Дальность ПОЯВЛЕНИЯ машин 160→480: своя заплатка `scripts\CarSpawnDistance.asi` + `.ini` (`[Main] Distance=480.0`) | `CarSpawnDistance/` | убрать два файла |

**Итог 2026-10-03 ≈12:00 после краша при разворачивании и падения FPS** — `[OWNER]` «fps мгры сильно просел... нужно
уменьшать», «делать может икс полтора от стока»: все дальности = сток игры ×1.5 (машины удаление 255/112.5, видимость 225,
появление 240 через CarSpawnDistance.ini; люди появление 75.75/63.75, удаление 97.5/81.75, видимость 90; оружие ×3);
население × плотность: люди 1.5×1.5, машины 2.0×1.45; объекты карты 400/200 и память 2048/2000 — как утром; остались
100 моделей машин, потолки 255/250, пулы 400. Сверено построчно с утренними бэкапами. Краш 11:4x: `std.bank.dll`
(modloader) → `RtlFreeHeap` на испорченной куче по адресу 0xA400D800 (≈2,56 ГБ) при разворачивании — гипотеза: память
(4 ГБ подгрузки + население ×9); текст окна — `logs\gta_sa.exe_2026-10-03_11-45_alt-tab_crashinfo-dialog.txt`.
Грабли: `[regex]::Replace(s, pat, rep, 1)` в PowerShell — это `IgnoreCase`, а не «один раз» (заменяет ВСЕ совпадения).

**CarSpawnDistance СНЯТ 2026-10-03 ≈12:10** — `[OWNER]` «нет машин на улицах, что-то накрутили плохо»: пустые улицы
появились ровно с первым запуском заплатки. Подменённое число — 6-й аргумент `CCarCtrl::GenerateCarCreationCoors2`
(0x424210, в gta-reversed безымянный `arg6`), а не доказанная «дальняя граница появления». Файлы — в
`D:\Games\GTA San Andreas Mods\_backup\2026-10-03_CarSpawnDistance_removed`; в живой игре исходные байты возвращены
WriteProcessMemory (`d8 0d 70 89 85 00`). Исходник в `CarSpawnDistance/` оставлен как запись неудачи — НЕ ставить.

Появление машин: `CCarCtrl::GenerateOneRandomCar` (0x430050) — `fld [0xB6F11C]` (множитель генерации камеры) ×
`fmul [0x858970]` (160.0, общая константа), ближняя граница `push 38.0`. Заплатка перенаправляет операнд в 0x43040F на своё
число; журнал `scripts\CarSpawnDistance.log`. [NOT-TESTED]
Полный каталог MixSets на русском — `mixsets-catalogue.md`.

Почему именно эти ключи — по коду, не по описанию: MixSets пишет их в `0x457236` / `0x457250` (`ReadIni.cpp`);
там в `CPickups::GenerateNewOne` прибавка к `CTimer` для типа 4 (`PICKUP_ONCE_TIMEOUT`) и 8 (`PICKUP_MONEY`);
`CPed::CreateDeadPedWeaponPickups` даёт тип 4, `CreateDeadPedMoney` → `CreateSomeMoney` — тип 8 (gta-reversed).
`TimePickupLong` (тип 5) к выпадению из NPC не относится. В SA-MP MixSets эти значения не пишет (`!inSAMP`).
Применяется при запуске или в игре чит-командой `SETS` (перечитать ini). Проверка — чтение памяти процесса:
`0x457236` и `0x457250` должны показать 2000000 и 3000000.

## Пикапы — пул на 620 слотов (разобрано 2026-10-16, баг 52)

- Массив `CPickups::aPickUps` по адресу `0x9788C0`: 620 слотов по 0x20 байт, тип пикапа — байт +0x1C. Массив целиком пишется в сейв
  (блок 6). Сколько занято — `python -I games/GTASanAndreas/tools/sa_pickups_in_save.py <GTASAsfN.b>` (в сейве
  владельца 2026-10-16 23:20 — 619 из 620, из них постоянных пикапов карты 511).
- При полном пуле `CPickups::GenerateNewOne` (`0x456F20`) затирает ПЕРВЫЙ по порядку слот с деньгами; если денег нет — ПЕРВЫЙ слот
  выпавшего (типы 4, 5); нет и их — пикап не создаётся. Отсюда «вещь появилась и исчезла».
- **Срок выпавшего проверяется только в пределах 100 м от камеры** (`CPickup::IsVisible`, gta-reversed `Pickup.cpp`): брошенное дальше
  не исчезает никогда и держит слот. В сейве владельца 2026-10-16 из 108 выпавших слотов 102 уже просрочены. Пул забивается этим,
  какой бы ни была жизнь пикапа; освобождает такие слоты только заплатка ниже.
- Таймеры по типам (`0x457211` и дальше): тип 4 — выпавшее оружие (+20000 мс, `0x457236`), тип 5 — бронежилеты и аптечки войны банд
  (+120000, `0x457243`), тип 8 — деньги (+30000, `0x457250`). MixSets пишет эти три адреса ключами `TimePickupShort`, `TimePickupLong`,
  `TimePickupMoney`.
- Open Limit Adjuster предел пикапов не поднимает; fastman92 Limit Adjuster 7.6 умеет (`[IPL]` `Enable pickup limit patch`, `Pickups`),
  но его поведение с сейвами не описано — по развилке бага 52 владелец выбрал свою заплатку (вариант А).
- **`scripts\PickupOldestFirst.asi` 1.1 — лежит с 2026-10-16 23:53, в игре ещё не запускалась** (выбор владельца «А»): при полном пуле
  затирается выпавшая вещь, которая исчезла бы раньше всех, а не первая по порядку. Версия 1.0 (23:36) не встала: ждала байты `31 DB`,
  в exe `33 DB` (та же `xor ebx, ebx`), журнал запуска 23:39 — `skipped: bytes differ`; лежит как `.asi.v1-wrong-bytes.off`, удалить
  после закрытия игры. Исходник и сборка — `PickupOldestFirst/` (`build.cmd <папка>`, VS 2022
  x86). Ставится только поверх родных байтов `0x457000`; журнал `scripts\PickupOldestFirst.log` (`patched` / `skipped`). Снять —
  удалить `.asi`. Проверка в запущенной игре: `python -I games/GTASanAndreas/tools/check_pickup_patch.py`.

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
