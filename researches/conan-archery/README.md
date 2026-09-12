# Разведка — стрельба из лука «по-обливионски» в Conan Exiles Enhanced

> **Создан:** 2026-09-12 ~15:40 +03:00 · **Родитель:** вопрос владельца «насколько выполнима
> стрельба из лука по стилю Обливион — с баллистикой и втыканием стрел в объекты?» ·
> **Статус:** 🅿️ **ОТЛОЖЕНО В ДАЛЬНИЙ ЯЩИК по слову владельца 12.09 ~15:50.** Разведка закончена,
> работа НЕ начиналась. Возобновлять — с `homeworks/02_conan_strely_nablyudenie.md` ·
> **Вовне:** → `homeworks/02` · `plans/06` (гейт кука)
>
> Читать целиком не нужно: **главный вывод в первом разделе**, остальное — доказательства и адреса.

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
