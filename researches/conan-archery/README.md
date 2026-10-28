# Разведка — стрельба из лука «по-обливионски» в Conan Exiles Enhanced

> **Создан:** 2026-09-12 ~15:40 +03:00 · **Родитель:** вопрос владельца «насколько выполнима
> стрельба из лука по стилю Обливион — с баллистикой и втыканием стрел в объекты?» ·
> **Статус:** 🅿️ отложено по слову владельца 12.09 ~15:50; **2026-10-28 владелец поднял тему сам** (раздел «Физика стрелы
> оригинального Обливиона» ниже) — пока обсуждение, работа НЕ начиналась. Возобновлять — с `homeworks/02_conan_strely_nablyudenie.md` ·
> **Вовне:** → `homeworks/02` · `plans/06` (гейт кука)
>
> Читать целиком не нужно: **главный вывод в первом разделе**, остальное — доказательства и адреса.

## Физика стрелы оригинального Обливиона — веб-разведка 2026-10-28 (владелец: «есть возможность найти в интернете параметры физики, которая была прописана для стрелы в оригинальном Обливион?» · «и попытаться их перещетать на наш Unreal Engine 5 для конана?» · «пока обсуждаем»)

- **Скорость** (UESP CS wiki, `fArrowSpeedMult`, по умолчанию **1500** единиц/с): `скорость = Speed стрелы × fArrowSpeedMult × (fArrowWeakSpeed + (1 − fArrowWeakSpeed) × DrawMult)`,
  `DrawMult = min(1, fArrowBowTimerBase + fArrowBowTimerMult × время натяжки)`; от лука скорость не зависит — только от стрелы. Значения `fArrowWeakSpeed`,
  `fArrowBowTimerBase`, `fArrowBowTimerMult` страница не даёт — брать из `Oblivion.esm` (записи GMST).
- **Гравитация** — данные слабые: `fArrowGravityMult` 0,002 и `fArrowGravityBase` 0,3 — с обсуждения UESP без источника; замер участника (2011): вертикальная
  скорость стрелы доходит до −515 единиц/с за 3,065 с (его же вывод ускорения через t² арифметически неверен: v = a·t → ≈ −168 ед/с²). Моды: `fArrowGravityMin`
  0,05, `fArrowOptimalDistance` 1000 (ваниль). Цифры «скорость 3600, гравитация 0,35 в формах снаряда» с форума — по всей видимости Skyrim/Fallout: форм снаряда в
  Обливионе нет.
- **Все GMST стрелы с UESP (2026-10-28, страницы настроек CS wiki):** `fArrowSpeedMult` 1500 · `fArrowWeakSpeed` 0,01 · `fArrowBowTimerBase` 0,25 ·
  `fArrowBowTimerMult` 0,4 (полная натяжка за (1 − 0,25)/0,4 ≈ 1,9 с) · `fArrowGravityBase` 0,3 («базовая сила к земле») · `fArrowGravityMult` 0,002 («больше —
  дольше летит прямо») · `fArrowGravityMin` 0,05 (по проверке UESP не влияет) · `fArrowMaxDistance` 2000 / `fArrowOptimalDistance` 1000 (дальности NPC).
  Скорость: ненатянутая 1500 × (0,01 + 0,99 × 0,25) ≈ 386 ед/с ≈ 5,5 м/с, полная ≈ 21 м/с. **Не найдено:** формула гравитации из Base и Mult. `[AI]` гипотеза:
  доля = Base − Mult × скорость / 360 (сходится с «Base 1, Mult 0,24 гасит гравитацию» при 1500 ед/с и даёт 0,29 g против замеренных ≈ 0,25 g) — не
  подтверждена; закрыть замером дуги в оригинале (владелец готов скачать игру) или подбором на глаз в Конане.
- **Расширенный поиск формулы и Havok (2026-10-28, `[OWNER]` «неужели этого нет в сети?» · «и данных, как havok с этим работал»):** формулы гравитации стрелы
  в открытом доступе нет; устройство полёта стрелы в Havok Обливиона не описано (известно лишь, что стрела — физобъект с оболочкой столкновений из NIF).
  Сообщество знает только поведение: «Mult 0,002 → 1,0 — гравитация почти пропадает» ([GQ Arrows Fly Straight](https://www.nexusmods.com/oblivion/mods/29653)).
  Oblivion Remastered (UE5 поверх ядра Gamebryo): `Altar.ini` → `[VOblivionRuntimeSettings] ArrowGravityScale`, `[VOblivionInitialSettings]
  ArrowInitialSpeedMultiplier` (моды: 0,2 и 7700; ваниль не найдена — страница [Faster Arrows](https://www.nexusmods.com/oblivionremastered/mods/632) отдаёт 403).
  Точное значение — только замером: удобнее в Remastered (UE4SS-пульт, траектория снаряда каждые 50 мс, как замер лука Конана 28.10), ≈ 1 ч после установки.
- **Что переносить — слово владельца 2026-10-28:** `[OWNER]` «в конане скорость полёта мне нравится, не нравится грация» · «В обливионе стрелы летали как
  сонные мухи, но гравитация была приятной и понятной» · «Oblivion Remastered использует тот же старый движок под капотом, и ту же физику» · про дугу
  оригинала и Remastered: «ОНИ ОДИНАКОВЫ!». Значит: скорость — конановская (≈ 5000 см/с), падение — обливионовское; цель замера — Remastered (владелец
  скачает); скорость в замере сверить со старыми ≈ 21 м/с только как проверку прибора. У Конана гравитация — масштаб компонента 1,2 → 0,12 по натяжке
  и кривые `FC_BowProjectileGravCurve_15m/30m/45m` (выгрузка 2026-10-28: три ассета, ключи кривых `uaj tojson` не показал — разобрать при переносе).
- **Ванильные значения Remastered найдены (2026-10-28, `[OWNER]` «есть же моды по ремастеру в интернете» · «может там есть ванильные цифры»):** обсуждение
  мода [Faster Arrows](https://www.nexusmods.com/oblivionremastered/mods/632?tab=posts) (прочитано отладочным Chrome проекта, одна страница), ответ автора
  Gr3yFoX 03.05.2025 «Default values»: `ArrowInitialSpeedMultiplier=5000` (`[/Script/UE5AltarPairing.VOblivionInitialSettings]`), `ArrowGravityScale=0.55`
  (`[/Script/Altar.VOblivionRuntimeSettings]`), `MagicProjectileSpeedMultiplier=1950`; участник juanan23 (16.05.2025): `ArrowWeakSpeedMultiplier=0.001` по
  умолчанию; источник значений — `DefaultAltar.ini` игры (мод 421, GameLiberty, «Miscellaneous files»; или FModel). Числа в единицах UE5: скорость ≈ 5000 см/с —
  как у стрелы Конана (≈ 5000 см/с, замер 26.10); значит, разница ощущения — в гравитации: Remastered — постоянные 0,55 g (парабола), Конан — 1,2 g (без натяжки)
  … 0,12 g (полная) и кривые по дистанции. Перенос: постоянная `ProjectileGravityScale` 0,55 у стрелы в Конане; что делать с натяжкой — решить с владельцем
  (в Remastered натяжка, по-видимому, меняет скорость — `ArrowWeakSpeed`, — а не гравитацию). Замер в Remastered — проверка, не единственный источник.
- **Перевод в UE5:** единица Обливиона = 1/64 ярда ≈ 1,43 см (UE — 1 см): 1500 ед/с ≈ 21 м/с на полной натяжке; ускорение ≈ −168 ед/с² ≈ −2,4 м/с² (≈ 0,25 g) —
  в `ProjectileMovementComponent` Конана это `InitialSpeed`/`MaxSpeed` в см/с и `ProjectileGravityScale` = ускорение / 980. Точные значения — GMST из `Oblivion.esm`
  (на дисках машины 2026-10-28 не найден: поиск до глубины 6 на C–F) и замер нынешней стрелы Конана пультом (скорость и масштаб гравитации ещё не сняты).
- Источники: [fArrowSpeedMult](https://cs.uesp.net/wiki/FArrowSpeedMult) · [Talk:FArrowGravityMult](https://cs.uesp.net/wiki/Talk:FArrowGravityMult) ·
  [Oblivion talk:Marksman](https://en.uesp.net/wiki/Oblivion_talk:Marksman) · моды с изменёнными fArrow*: [52151](https://www.nexusmods.com/oblivion/mods/52151),
  [23484](https://www.nexusmods.com/oblivion/mods/23484).

## Главный вывод: это НЕ «реализовать», а «настроить»

Обе половины задачи в игре **уже есть**. Ни одна из них не требуется к написанию с нуля.

**Баллистика.** В `ConanSandbox-Win64-Shipping.exe` живут собственные классы Funcom —
`UConanProjectileMovementComponent` и `UConanProjectileRegistry` (поверх движковых
`ProjectileGravityScale`, `bIsHomingProjectile`, `OnProjectileBounce`, `OnProjectileStop`), а также
`ProjectileSpeed`, `ProjectileGravity`, `GetProjectileLaunchVelocity`, `AppendPredictedProjectilePath`.

**Втыкание.** Отдельный чертёж `BP_DummyProjectile` — «пустышка», которую снаряд порождает при
попадании.

## Доказательства — имена полей из самих чертежей

Снято китовым `UnrealPak` из `pakchunk1050-Windows.utoc` (извлечение 140 файлов за 0.04 с), затем
скан имён в `.uheader`. **Читались ИМЕНА, не значения и не графы.**

`Content/Items/Weapons/BP_BaseProjectile.uasset` (26 КБ в паке, 34 КБ распакованный заголовок):

| семья | поля |
|---|---|
| дуга | `ProjectileGravityScale`, `ProjectileGravityCurve`, `SetProjectileGravity`, `GravityMod` |
| скорость | `ProjectileSpeedCurve`, `InitialSpeed`, `ProjectileInitialSpeed`, `SetProjectileSpeed` |
| натяжение | `PowerChargeMod`, `MaxPowerChargeMod`, `OnRep_PowerChargeMod` |
| **втыкание** | `ShouldAttach`, `SpawnAttached`, `SpawnDummyProjectile`, `ShouldSpawnDummyProjectile`, `ProjectileDummyLifetime`, **`DummyProjectileAttachedToCharacterLifetime`**, **`DummyProjectileOnGroundLifetime`** |
| поломка/лут | `CanBreakOnImpact`, `BreakOnImpact`, `PercentageChanceToBreakOnImpact`, `ArrowItemDurability`, `IsLootable` |
| попадание | `AdjustImpactLocation`, `GetAdjustedProjectileImpactPosition`, `HandleImpactSound`, `HandleImpactParticle`, `SpawnDecal`, `M_decal_rock_impact_01` |
| рикошет | `ProjectileRicochetAngle`, `ShouldBounce`, `Perk_HasRicochetPerk` |

`Content/Items/Weapons/BP_DummyProjectile.uasset` (10 КБ / 15 КБ заголовок) — **и это ровно
обливионский набор:** `K2_AttachToComponent`, **`MyBoneName`**, **`PenetrationDepth`**, `IsLootable`,
`ItemDurability`, `HasBeenLooted`, `HasShattered`, `InteractableBox`, `SetLifeSpan`, `TimeToDestroy`,
`loot_ground`, `PhysMaterial`, `WaterPhysics`, `DestroyDummyIfAttachedObjectIsDestroyed`.

Читается так: стрела при попадании порождает пустышку, **цепляет её к КОСТИ попадания на заданную
глубину проникновения**, та живёт указанное время (отдельно — на персонаже и отдельно — на земле),
её можно подобрать, у неё есть прочность и шанс расколоться.

**Адреса, которые понадобятся при возобновлении** (все в `pakchunk1050-Windows.utoc`):
`Content/Items/Weapons/BP_BaseProjectile` · `Content/Items/Weapons/BP_DummyProjectile` ·
`Content/Items/Weapons/Bow/BP_Visual_BowProjectileBase` (+ варианты `_FireSparkArrows`,
`_LowBreakChance`) · `Content/Items/Weapons/Crossbow/BP_Visual_CrossbowProjectileBase` ·
`Content/Items/BP_ProjectileWeapon` · `Content/Items/Weapons/EProjectileFamilies` ·
`Content/Items/Weapons/Bow/Curve_BowPowerChargeProjectileTrailSize`.

## Настройкой снаружи не крутится

Проверено по нашим дампам: ни в `cvars-registered.txt`, ни в дампе бинарника, ни в `ServerSettings.ini`,
ни в пространстве `dw.*` нет ни `ProjectileGravity`, ни `ProjectileSpeed`. Значит дотянуться можно
только до ассета — через кук или через рантайм.

## Три дороги доставки

| дорога | цена | чем плоха |
|---|---|---|
| **UE4SS Lua** — выставлять поля на живом экземпляре при спавне, как это делает наш мод камеры | кука не нужно вовсе, откат мгновенный, конфликтов ноль | упирается в баг 10: Lua-слой заводится через раз (тикет [#1421](https://github.com/UE4SS-RE/RE-UE4SS/issues/1421)) |
| **Overlay-переопределение чертежа китом** | штатный путь Dev Kit, работает без нас | замена ассета ЦЕЛИКОМ: ссорит с любым модом, трогающим `BP_BaseProjectile`, и умирает на каждом перекуке Funcom. **И гейт: кук не проверен** |
| **`ModController` + слияние таблиц** | уживается с чужими модами | годится, только если числа лежат в таблице по типу боеприпаса — это НЕ проверено |

## Риски, по ярусам

1. 🔴 **Кук не проверен — единственный настоящий блокер постоянного мода.** Кит CL 374980 / UE 5.8.2
   новее игры CL 373655, а игра отвергает пакеты «слишком новые». Проверка офлайновая и дешёвая,
   она всё равно нужна для любого мода на киte — фаза 1 эпика `plans/06`.
2. 🔴 **`BP_BaseProjectile` — популярный ассет.** Переопределять целиком опасно; предпочесть узкий
   `BP_Visual_BowProjectileBase` или таблицу.
3. 🟡 **Числа неизвестны.** Прочитаны имена, не значения. Следующий шаг — безоконное чтение
   дефолтов китом (~3 мин) ИЛИ, что дешевле, наблюдение владельца (`homeworks/02`).
4. 🟡 **Производительность и репликация.** Много торчащих пустышек — цена кадра; в кооперативе
   встаёт вопрос, видят ли их другие. У владельца игра одиночная/кооп, вероятно неважно.

## Оценка выполнимости

| задача | оценка |
|---|---|
| дуга и скорость «как в Обливионе» | **низкая** — крутятся существующие поля и кривые |
| стрелы держатся дольше и в большем числе поверхностей | **низкая** — `*Lifetime` и условия `ShouldAttach` |
| подбор стрел из стены/трупа | **низкая-средняя** — `IsLootable`, `InteractableBox` уже есть |
| довести до ощущения «то самое» | **средняя** — подбор чисел итерациями, вкусовая работа |
| то, чего в системе нет вовсе (стрелы, переживающие лут трупа; своя физика древка) | **высокая** — нужен кук |

## Возобновление — три шага по порядку

1. `homeworks/02_conan_strely_nablyudenie.md` — наблюдение владельца, он взял его на себя.
2. Безоконное чтение дефолтов чертежей китом (`researches/conan-devkit/smoke-dump-xp.py` как образец).
3. Офлайновая сверка версий кит↔игра (фаза 1 эпика `plans/06`) — гейт для постоянного мода.
