# Объёмный туман и облака (Volumetric Fog, Volumetric Cloud, Sky Atmosphere)

> **База конспекта.** Дефолты и формулы сверены по исходникам UE **5.3.2** (`Engine/Source/Runtime/Renderer/Private/`: `VolumetricFog.cpp`, `VolumetricFogVoxelization.cpp`, `VolumetricFogLightFunction.cpp`, `FogRendering.cpp`, `VolumetricCloudRendering.cpp`, `VolumetricRenderTarget.cpp`, `SkyAtmosphereRendering.cpp`, `LightShaftRendering.cpp`, `SkyAtmosphereComponent.cpp`, `VolumetricCloudComponent.cpp`, `LightComponent.cpp`, `SkyLightComponent.cpp`, шейдеры `VolumetricCloud.usf`, `VolumetricFog.usf`, `Engine/Config/BaseScalability.ini`). Облачные дефолты дополнительно сверены с 4.26 и 5.5.2 — за пять версий **ни один дефолт облаков не изменился**. Palworld — UE ~5.1; расхождения версий отмечены явно.
>
> **Соглашение о доверии.** Строки без пометки — сверены по коду. Пометка **†** означает: значение взято из класса компонента или из соседней подсистемы и в этой ревизии **по строке исходника не переподтверждено** — перед переносом в канон или в чужой билд сверить заново. Отдельно отмечено, что подтверждено дампом зарегистрированных имён Palworld (это доказывает **существование** имени, а не его значение).
>
> В этой ревизии исправлены два содержательных дефекта прежней версии: направление правки `DepthDistributionScale` против дальних ступеней (было указано наоборот) и самопротиворечивая трактовка `ShadowMap.MaxResolution`. Исправления встроены в текст, отдельного списка нет.

---

## Что это и когда сюда лезть

Пользователь видит одну «дымку». Движок рисует её **четырьмя независимыми подсистемами плюс двумя соседними**, и путаница между ними — источник большей части бесполезных правок.

1. **Volumetric Fog** — froxel-сетка (3D-текстура вокселей, выровненная по экрану) перед камерой, в которую инжектируется свет от источников. Она даёт лучи света сквозь листву, светящиеся конусы фонарей, «телесный» туман в лощине. Ограничена свойством компонента `VolumetricFogDistance` = 6000 см (**60 м** по умолчанию) и физически не может быть дымкой на горах в десяти километрах.
2. **Exponential Height Fog** (`r.Fog`) — аналитическая формула на весь кадр, без вокселей. Это и есть серая пелена на горизонте.
3. **Sky Atmosphere** — рэлеевское/ми-рассеяние: аэроперспектива (выцветание далёких объектов) и цвет неба. Вместе с (2) образует то, что называют «дымкой».
4. **Volumetric Cloud** — рейтрейс объёма облаков в собственный низкоразрешающий рендер-таргет (`r.VolumetricRenderTarget`) с репроекцией и композитингом поверх сцены.

И две подсистемы, которые **зовут теми же словами, но это не они**:

5. **Light Shafts** (`r.LightShaft*`, чекбоксы `Light Shaft Bloom` / `Light Shaft Occlusion` на DirectionalLight) — экранно-пространственные «божественные лучи» от солнца. Считаются радиальным блюром буфера, к объёмному туману отношения не имеют. **`r.VolumetricFog=0` их не убирает** — это первая по частоте ошибка адресации в этом разделе.
6. **Heterogeneous Volumes** (`r.HeterogeneousVolumes.*`, 5.2+; **есть в дампе Palworld**) — отдельный тракт для объёмных ассетов (VDB, дым). Никак не связан ни с froxel-туманом, ни с облаками, но при поиске по слову «Volumetric» вылезает первым. Сюда же — `r.VolumetricLightmap.*`: это **запечённое непрямое освещение**, слово «Volumetric» в имени случайно.

Лезть в раздел стоит, когда симптом один из: полосы/ступени в тумане и в небе, шлейф (ghosting) за движущимися огнями, крупный «пиксель» тумана вокруг фонаря, шум и кипение на облаках, мерцающие пятна облачных теней на земле, ступени аэроперспективы на дальнем склоне, облака поверх горы, «дымка не убирается».

Также сюда лезут за производительностью — и здесь главная ловушка, которую надо сформулировать точнее, чем это обычно делают:

- **Стоимость объёмного тумана не зависит от того, что видно вдали, но зависит от того, сколько источников света рядом.** Она равна `число froxel-ов × (интеграция + инжект каждого источника, попавшего в объём)`. Число froxel-ов — чистая функция рендер-разрешения. Открытый пейзаж без фонарей — самый дешёвый случай; коридор с двадцатью факелами при том же разрешении — самый дорогой.
- **Стоимость облаков зависит от доли неба на экране — но только в части первичной трассировки.** Проходы `ShadowMap` и `SkyAO` считаются в свои карты фиксированного разрешения и **платятся, даже когда камера смотрит в землю**. Утверждение «облака дороги ровно настолько, насколько видно небо» — неверно примерно на величину этих двух проходов.
- **Стоимость атмосферы с `FastSkyLUT=1` вообще не зависит от доли неба** — это фиксированный набор LUT-ов (порядок величины — единицы сотен тысяч сэмплов на кадр).

Поэтому «выключить туман, чтобы вытянуть панораму» — правка, которая на CPU-bound сцене не даёт ничего (см. «Почему объёмка дорога в панорамных сценах» и «Проверено нами», п. 1 и 9).

**Порядок диагностики, который экономит время.** Сперва определить, **какая из подсистем** рисует то, что не нравится:

```
showflag.VolumetricFog 0     // froxel-туман
showflag.Fog 0               // Height Fog (и объёмный вместе с ним — он его часть)
showflag.Atmosphere 0        // Sky Atmosphere
showflag.Cloud 0             // Volumetric Cloud
showflag.LightShafts 0       // «божественные лучи», НЕ объёмный туман
```

Они не требуют перезапуска и не трогают cvar-ы. **Оговорка, которой обычно нет в справочниках:** в Shipping-билде чужой игры консоль и `showflag`/`stat` часто недоступны без внешнего инжектора (UE4SS, `-console`, мод). Если `showflag` не отвечает — это не значит, что подсистемы нет; это значит, что у вас нет прибора, и правки пойдут вслепую. Достать прибор дешевле, чем перебирать cvar-ы.

---

## Таблица параметров

### 1. Volumetric Fog — ядро (`VolumetricFog.cpp`)

| cvar | дефолт | единица/шкала | что делает | цена | ловушки |
|---|---|---|---|---|---|
| `r.VolumetricFog` | **1** | bool | Разрешает подсистему целиком | Весь тракт: воксeлизация + инжект света + интеграция | Управляется группой **`sg.ShadowQuality`**, а не `sg.EffectsQuality` (см. «Как считается»). При `0` пропадают лучи света от источников, а горизонтная дымка **остаётся** — она не отсюда. Требует SM5+/deferred: в forward и на мобильном пути тракта нет |
| `r.VolumetricFog.GridPixelSize` | **16** | пикселей **рендер**-разрешения на сторону вокселя по XY | Задаёт XY-размер froxel-сетки: `ceil(RenderW/S) × ceil(RenderH/S)` | Обратно-квадратичная: 16→8 даёт ×4 вокселей и ×4 памяти | «Дефолт 8» из половины интернет-справочников — это **значение Epic-качества из `BaseScalability.ini` (`ShadowQuality@3`)**, а не дефолт кода. Клэмп `Max(1, S)`. При экстремальных разрешениях движок сам поднимает S, чтобы сетка влезла в `GMaxVolumeTextureDimensions` (на D3D11/12 — 2048 †). **Считается от разрешения рендера, а не окна**: DLSS/FSR удешевляют туман пропорционально |
| `r.VolumetricFog.GridSizeZ` | **64** | число слоёв по глубине | Третье измерение сетки | Линейная по слоям и по памяти | Слои распределены логарифмически (см. формулу): добавленные слои уходят преимущественно в ближнюю зону. Дальние «ступени» лечит **подъём** `DepthDistributionScale`, а не только Z |
| `r.VolumetricFog.DepthDistributionScale` | **32.0** | безразмерный `S` в `slice = log2(z·B + O)·S` | Перераспределяет слои по глубине без изменения их числа | **0** | Часто понимают как «дальность тумана» — неверно, дальность задаёт компонент. **Направление:** меньше `S` — слои плотнее у камеры и реже вдали; больше `S` — распределение стремится к линейному (при `S → ∞` оно ровно линейное). Значит ступени **вдали** лечит увеличение `S`, ступени **вплотную к камере** — уменьшение |
| `r.VolumetricFog.HistoryWeight` | **0.9** | вес истории `[0..1]` | Темпоральное накопление кадров | **0** | Главный источник **шлейфа/ghosting**. Применяется только если история валидна (`bTemporalHistoryIsValid`), иначе 0. Снижение веса — не бесплатно: эффективное число накопленных сэмплов `(1+w)/(1−w)` падает с ~19 при 0.9 до ~5.7 при 0.7, то есть шлейф меняется на шум (расчёт ниже) |
| `r.VolumetricFog.TemporalReprojection` | **1** | bool | Репроекция froxel-объёма из прошлого кадра | ~0 (экономит: без неё нужен супер-сэмплинг) | Выключение — не оптимизация, а обмен на шум; заодно отключает Halton-джиттер (см. `VolumetricFogTemporalRandom`) |
| `r.VolumetricFog.Jitter` | **1** | bool | Halton-смещение точки сэмпла внутри вокселя (base 2/3/5, период 1024 кадра) | 0 | Работает **только вместе с** `TemporalReprojection=1`; при `0` возвращаются жёсткие полосы по границам слоёв |
| `r.VolumetricFog.HistoryMissSupersampleCount` | **4** | число сэмплов, клэмп `Clamp(x,1,16)` | Сколько раз досчитать освещение для вокселей **без истории** (края экрана, каты, резкий поворот) | Всплеск при резких движениях камеры; ровный кадр не дорожает | Cine-уровень ставит 16. Это не «качество тумана вообще», а только качество на камера-катах и по кромке экрана |
| `r.VolumetricFog.LightScatteringSampleJitterMultiplier` | **0** | множитель мирового смещения | Дрожание мировой позиции сэмпла при генерации объёма | 0 | Не действует при `r.VolumetricFog.Jitter=0` (сказано в help-тексте) |
| `r.VolumetricFog.InjectShadowedLightsSeparately` | **1** | bool | Теневые источники инжектируются отдельным проходом | Экономит на нетеневых | Help-текст в исходнике скопирован от `r.VolumetricFog` («Whether to allow the volumetric fog feature») — по нему смысл параметра понять нельзя |
| `r.VolumetricFog.InverseSquaredLightDistanceBiasScale` | **1.0** | множитель добавки в знаменатель `1/d²` | Срезает пик обратно-квадратичного затухания вплотную к источнику | 0 | Лечит алиасинг «взрыва» яркости у самой лампы, а не общую яркость |
| `r.VolumetricFog.Emissive` | **1** | bool | Эмиссивная компонента материалов в тумане | Пермутация шейдера `USE_EMISSIVE` | Значима только если в сцене есть воксeлизуемые объёмные материалы (см. врезку о воксeлизации) |
| `r.VolumetricFog.ConservativeDepth` | **0** | bool | `[Experimental]` консервативный буфер глубины для пропуска работы | Может ускорить | Помечено экспериментальным в самом исходнике |
| `r.VolumetricFog.LightFunction` | **1** | bool | Генерировать атлас light function для тумана | Проход на атлас | — |
| `r.VolumetricFog.LightFunction.Resolution` | **128** | пикселей на тайл атласа | Разрешение каждой light function | Квадратичная | — |
| `r.VolumetricFog.LightFunction.LightFunctionCount` | **16** | штук за кадр | Максимум light function в кадре | Линейная | Свыше лимита источники теряют свою light function молча |
| `r.VolumetricFog.LightFunction.DirectionalLightSupersampleScale` | **2.0** | множитель разрешения | Супер-сэмплинг light function направленного света | Квадратичная | Help-текст в исходнике неверен («Scales the slice depth distribution» — скопирован от `DepthDistributionScale`) |
| `r.VolumetricFog.InjectRaytracedLights` | **0** | bool | Инжектировать источники с RT-тенями | Высокая | **Отсутствует в билде Palworld** (проверено по дампу зарегистрированных имён) |
| `r.VolumetricFog.VoxelizationSlicesPerGSPass` | **8** | слоёв за проход GS | Сколько Z-слоёв воксeлизуется за один geometry-shader проход | Влияет на число проходов | **`ECVF_ReadOnly`** — из консоли не меняется; требует перекомпиляции шейдеров воксeлизации. В ini имеет смысл только до старта RHI |
| `r.VolumetricFog.VoxelizationShowOnlyPassIndex` | **-1** | индекс прохода | Отладка: показать один проход воксeлизации | — | Отладочный |
| `r.VolumetricFog.UpsampleJitterMultiplier` | **0** | множитель (`FogRendering.cpp`) | Дрожание точки выборки при апсемпле 3D-тумана в полный кадр | 0 | Единственная ручка против «крупного пикселя» тумана, которая **ничего не стоит**; платите шумом |
| `r.FastVRam.VolumetricFog` | **1** † | bool | Класть объёмы тумана в быструю память (ESRAM/консоли) | — | На ПК фактически no-op; в дампе Palworld **есть**, но менять его на десктопе бессмысленно |

> **Чего в этом блоке нет ни одного cvar-а — и это важнее половины таблицы.**
> **(а) Воксeлизация плотности.** Локальные сгустки тумана задаются не cvar-ами, а **материалами домена `Volume`** на мешах и партиклах: они пишут extinction/albedo/emissive прямо в froxel-объём (`VolumetricFogVoxelization.cpp`). Если «туман неоднородный и его не берут cvar-ы» — вы правите не то: плотность лежит в ассетах.
> **(б) Источники света.** Свет попадает в туман, только если у компонента света `VolumetricScatteringIntensity > 0` (дефолт **1.0** †), а тень в тумане — только при `Cast Volumetric Shadow` (`bCastVolumetricShadow`, дефолт **true** †). Отдельного чекбокса «Affects Volumetric Fog» у света **нет** — его ищут и не находят. Статические (запечённые) источники в froxel-объём динамически не инжектируются: их вклад идёт только через `VolumetricFogStaticLightingScatteringIntensity` компонента тумана.
> **(в) Отражения.** Объёмный туман **не рисуется** в reflection capture, в planar reflections и в отражениях Lumen. «Туман есть в кадре, но не в отражении в воде» — не баг настроек.

### 2. Height Fog и общие переключатели (`FogRendering.cpp`)

| cvar | дефолт | единица/шкала | что делает | цена | ловушки |
|---|---|---|---|---|---|
| `r.Fog` | **1** | bool | Экспоненциальный высотный туман (и его применение к кадру) | Полноэкранный проход | **В билде Palworld имя не зарегистрировано** (наш дамп — см. разбор метода в «Проверено нами», п. 5а), строка в ini мертва. Объявлен как `ECVF_RenderThreadSafe`, **не** `ECVF_Scalability` †; косвенное подтверждение — `r.Fog` не встречается в `BaseScalability.ini` ни на одном уровне, то есть sg-группы его не трогают. Гасит **и** объёмный туман: froxel-объём применяется в том же проходе |
| `r.FogUseDepthBounds` | **true** | bool | Depth-bounds-тест в полноэкранном проходе тумана | Экономит пиксели | Отключать незачем, кроме отладки артефактов на границе. **Есть в дампе Palworld** |
| `r.VertexFoggingForOpaque` | **1** | bool | Вершинный туман для непрозрачных | — | `ECVF_ReadOnly`: из `[SystemSettings]` в рантайме не подействует. Именно из-за вершинного расчёта на крупных полигонах туман «ломается» по треугольникам |
| `r.Water.SingleLayer.UnderwaterFogWhenCameraIsAboveWater` | **false** | bool | Рисовать туман за поверхностью воды, когда камера над водой | ~0 | Лечит артефакт входа/выхода из воды, но ломает вид воды издали |
| `r.Water.SingleLayerWater.SupportCloudShadow` | **0** † | bool | Тени облаков на поверхности воды | Пермутация шейдера | `ECVF_ReadOnly` †. **Есть в дампе Palworld.** «Тени облаков есть на земле и нет на воде» — вот отсюда |
| `r.SupportCloudShadowOnForwardLitTranslucent` | **0** † | bool | Тени облаков на forward-освещённой полупрозрачности | Пермутация шейдера | `ECVF_ReadOnly` †. **Есть в дампе Palworld** |
| `r.LocalFogVolume.*` | — | — | Локальные объёмы тумана как отдельная подсистема | — | **Появилось в UE 5.4.** В 5.1/5.3 подсистемы нет вообще; отсутствие `r.LocalFogVolume.Render` в дампе Palworld — не особенность игры, а ожидаемое следствие версии |

### 3. Свойства компонента `ExponentialHeightFogComponent` — у них **нет cvar-ов**

Это критично: половина «не работающих» правок — попытка найти cvar на то, что вообще не cvar.

| свойство | дефолт | смысл |
|---|---|---|
| `bEnableVolumetricFog` | **false** | Объёмный туман включается **на компоненте**; `r.VolumetricFog=1` без него ничего не даёт |
| `VolumetricFogDistance` | **6000** (см = 60 м) | Дальняя граница froxel-объёма. Это `FarPlane` в формуле распределения слоёв. **Не «дальность видимости тумана», а длина, на которую растягиваются те же `GridSizeZ` слоёв** — см. врезку ниже |
| `VolumetricFogStartDistance` | 0 | Ближняя граница, подставляется как `NearPlane` |
| `VolumetricFogNearFadeInDistance` | 0 | Растворение у ближней границы |
| `VolumetricFogScatteringDistribution` | **0.2** | Анизотропия фазовой функции (`PhaseG`), UI-диапазон −0.9…0.9; ближе к 0 — изотропнее, лучше видны боковые лучи; ближе к 0.9 — свет резко собирается вперёд, «нимб» вокруг источника |
| `VolumetricFogExtinctionScale` | 1.0 | Множитель поглощения **поверх плотности, унаследованной от `FogDensity`** |
| `VolumetricFogAlbedo` | White | Альбедо частиц |
| `VolumetricFogEmissive` † | Black | Собственное свечение объёма |
| `VolumetricFogStaticLightingScatteringIntensity` | 1 | Единственный путь, которым запечённое освещение попадает в froxel-объём |
| `FogDensity` / `FogHeightFalloff` | **0.02 / 0.2** | Плотность и спад высотного тумана — вот **это** горизонтная пелена. **И одновременно источник плотности для объёмного тумана**: правка `FogDensity` меняет обе подсистемы сразу, что регулярно принимают за «cvar не сработал» |
| высота отсчёта | Z компонента/актора | «Уровень моря» тумана. Плотность ≈ `FogDensity · 2^(−FogHeightFalloff · (h − Z))` †. Туман «пропадает, когда поднимаешься» именно поэтому, а не из-за дальности |
| `SecondFogData.*` † | Density 0, Falloff 0.2, HeightOffset 0 | **Второй слой** высотного тумана. Про него не знают, и «странная вторая пелена на другой высоте» приходит отсюда |
| `FogMaxOpacity` | 1.0 | Потолок непрозрачности тумана. **На небо не действует** — небо рисуется за дальней плоскостью |
| `StartDistance` / `FogCutoffDistance` | 0 / **0 = выключено** | Начало тумана и жёсткая отсечка вдали. `FogCutoffDistance` даёт **видимый шов** — резкую границу в кадре, её часто принимают за артефакт LOD |
| `DirectionalInscatteringExponent` / `DirectionalInscatteringStartDistance` | 4.0 / 10000 | Солнечный «нимб» в тумане. При активной Sky Atmosphere и `r.SupportSkyAtmosphereAffectsHeightFog=1` цвет рассеяния приходит из атмосферы, и правка цветов на компоненте «перестаёт работать» |
| `InscatteringColorCubemap` † | none | Альтернативный источник цвета дымки; вместе с `FullyDirectionalInscatteringColorDistance` (100000) и `NonDirectionalInscatteringColorDistance` (1000) |

> **Почему нельзя просто «удлинить» объёмный туман.** Число слоёв `GridSizeZ` фиксировано. Подняв `VolumetricFogDistance` с 6000 до 100000 см, вы не добавили ни одного вокселя — вы растянули те же 64 слоя на 1 км. Средняя длина слоя выросла в ~17 раз, ближняя зона обеднела (перераспределение по `log2`), и вместо «дальнего объёмного тумана» получается мыло со ступенями. Дальний туман в UE — это Height Fog и аэроперспектива, и никакие правки froxel-сетки этого не меняют. Именно поэтому дефолт Epic — 60 м.

### 4. Volumetric Cloud (`VolumetricCloudRendering.cpp`)

| cvar | дефолт | единица/шкала | что делает | цена | ловушки |
|---|---|---|---|---|---|
| `r.VolumetricCloud` | **1** | bool | Рисовать компоненты облаков | Весь тракт | Нужен материал домена `Volume` на компоненте, иначе тракт не запускается вообще. **И нужна Sky Atmosphere в сцене** — облачный компонент берёт из неё радиус планеты и освещение; без атмосферы облаков просто нет † |
| `r.VolumetricCloud.ViewRaySampleMaxCount` | **768** | сэмплов на первичный луч | **Потолок** для числа шагов рейтрейса | Линейная по эффективному числу | **Главная ловушка раздела.** Эффективное = `min(96 · ViewSampleCountScale, этот cvar)`. При дефолтном `ViewSampleCountScale=1` реальный максимум — **96**, а `768 = 96 · 8` (максимум UI-ползунка). Снижение 768→256 **не делает ничего**; работать правка начинает строго ниже 96 |
| `r.VolumetricCloud.SampleMinCount` | **2** | сэмплов | Нижняя граница шагов на луч | — | Клэмп `Max(0, x)`. Спасает близкий к камере слой, если облака используются как низкий туман |
| `r.VolumetricCloud.DistanceToSampleMaxCount` | **15.0** | **километры** | Длина трассы, на которой число шагов дорастает от минимума до максимума | Обратная: **уменьшение = дороже** | Понимают наоборот. Это не «дальность облаков», а скорость набора плотности сэмплов. `Inv = 1 / max(1, 100000 · x)` |
| `r.VolumetricCloud.ReflectionRaySampleMaxCount` | **80** | сэмплов | Потолок для лучей в отражениях (в т.ч. в real-time-захвате skylight) | Линейная | Тот же паттерн: эффективное `min(96 · ReflectionViewSampleCountScale, 80)` |
| `r.VolumetricCloud.StepSizeOnZeroConservativeDensity` | **1** | множитель шага | Насколько увеличить шаг, встретив нулевую консервативную плотность | `>1` — заметно дешевле | При больших значениях появляется бандинг (сказано в help) |
| `r.VolumetricCloud.HighQualityAerialPerspective` | **0** | bool | Второй проход: аэроперспектива трассируется по пикселям облаков вместо выборки из LUT | **Дорого — целый второй проход** | Требует `EnableAerialPerspectiveSampling=1`, осмысленно только при `r.VolumetricRenderTarget=1` |
| `r.VolumetricCloud.DisableCompute` | **0** | bool | Запретить compute-путь трассировки | Пиксельный путь медленнее | `ECVF_Scalability` без `RenderThreadSafe`. Побочно отключает `EmptySpaceSkipping` и min/max-depth-путь |
| `r.VolumetricCloud.EmptySpaceSkipping` | **0** | bool | Пропуск пустых зон по предвычисленному объёму | Ускоряет разрежённые слои | Требует compute и typed-UAV-load `PF_R16F`. В UE 5.1 (Palworld) **есть**; `SampleCorners`/`StartTracingSliceBias` — уже нет |
| `r.VolumetricCloud.EmptySpaceSkipping.VolumeDepth` | **40.0** | километры | Глубина объёма, в котором ищется пустота | — | Должна покрывать слой облаков (`LayerBottomAltitude + LayerHeight`), иначе пропуск работает только для нижней части |
| `r.VolumetricCloud.EmptySpaceSkipping.SampleCorners` | 1 (5.2+) | 0 = только центры | Точность карты пустот | — | Отсутствует в 5.1 |
| `r.VolumetricCloud.EmptySpaceSkipping.StartTracingSliceBias` | 0.0 (5.2+) | слоёв | Сдвиг стартовой глубины | — | Отсутствует в 5.1 |
| `r.VolumetricCloud.HzbCulling` | **1** | bool | Не трассировать за непрозрачными по HZB | Большая экономия при закрытом небе, **ноль экономии в панораме** | **Есть в 4.26–5.1 (в т.ч. Palworld), в 5.3 удалён.** Должен быть выключен при `r.VolumetricRenderTarget.Mode=2` |
| `r.VolumetricCloud.Shadow.ViewRaySampleMaxCount` | **80** | сэмплов | Потолок шагов теневого луча внутри облака | Линейная, но **умножается на число первичных шагов** | Эффективное `min(10 · ShadowViewSampleCountScale, 80)`; при дефолтном scale = **10**. `80 = 10 · 8`. Это второй множитель в стоимости облаков, и его почти никогда не трогают |
| `r.VolumetricCloud.Shadow.ReflectionRaySampleMaxCount` | **24** | сэмплов | То же в отражениях | Линейная | — |
| `r.VolumetricCloud.Shadow.SampleAtmosphericLightShadowmap` | **1** | bool | Читать shadow map солнца при трассировке облаков | — | Даёт объёмные тени от гор в облаках |
| `r.VolumetricCloud.ShadowMap` | **1** | bool | Карта теней от облаков на землю | **Отдельный проход, платится независимо от того, видно ли небо** | Работает только если на DirectionalLight включён `Cast Cloud Shadows` (дефолт **выключен** †) |
| `r.VolumetricCloud.ShadowMap.MaxResolution` | **2048** | пикселей | **Потолок** разрешения карты | Квадратичная | Эффективное `min(512 · CloudShadowMapResolutionScale, 2048)` → при дефолтном scale=1 это **512**. Отсюда две несимметричные правки: **поднимать cvar выше 512 бесполезно** (нужен `CloudShadowMapResolutionScale` на свете), а **опускать ниже 512 — работает** и экономит квадратично |
| `r.VolumetricCloud.ShadowMap.RaySampleMaxCount` | **128.0** | сэмплов | Потолок шагов на луч карты теней | Линейная | Эффективное `max(4, min(16 · CloudShadowRaySampleCountScale, 128))`; при scale=1 — **16**. Та же несимметрия: вниз действует, вверх — нет |
| `r.VolumetricCloud.ShadowMap.RaySampleHorizonMultiplier` | **2.0** | множитель | Добавка сэмплов, когда солнце у горизонта | До ×2 на закате | Формула: `N + (M−1)·N·HorizonFactor`, где `HorizonFactor = clamp(0.2 / |dot(up, −lightDir)|, 0, 1)` |
| `r.VolumetricCloud.ShadowMap.SnapLength` | **20.0** | километры | Шаг привязки центра карты теней к сетке | 0 | Причина рывкового «прыжка» облачных теней при полёте: `floor((p + 0.5·snap)/snap)·snap`. **Сомнительная пара дефолтов:** шаг привязки 20 км при `CloudShadowExtent` 10 км † означает скачок больше размера самой карты — это случай, который надо мерить, а не наследовать; практический ориентир — держать `SnapLength` заметно меньше extent |
| `r.VolumetricCloud.ShadowMap.SpatialFiltering` | **1** | число итераций блюра, клэмп ≤4 | Сглаживание карты теней | Линейная по итерациям | Значение — не bool, а количество проходов |
| `r.VolumetricCloud.ShadowMap.TemporalFiltering.NewFrameWeight` | **1.0** | вес нового кадра `[0..1]` | Темпоральное накопление карты теней | 0 | **`1` = фильтр выключен.** В help прямо: «Experimental and needs more work so disabled by default». При включении трассировка идёт в **половину** разрешения карты |
| `r.VolumetricCloud.ShadowMap.TemporalFiltering.LightRotationCutHistory` | **10.0** | градусы | Поворот солнца, после которого история сбрасывается | — | Актуально только при `NewFrameWeight < 1` |
| `r.VolumetricCloud.ShadowMap.Debug` | 0 | bool | Показать карту теней облаков | — | Прибор: сразу видно, попадает ли ваша местность в extent карты |
| `r.VolumetricCloud.SkyAO` | **1** | bool | Затенение неба облаками (AO для skylight) | **Отдельный проход, тоже независимый от доли неба** | Нужен Skylight с включённым `Cloud Ambient Occlusion` (дефолт выключен †) |
| `r.VolumetricCloud.SkyAO.MaxResolution` | **2048** | пикселей | Потолок разрешения карты AO | Квадратичная | Эффективное `min(512 · CloudAmbientOcclusionMapResolutionScale, 2048)` → по умолчанию **512**, при `CloudAmbientOcclusionExtent` 150 км † это ~293 м на тексель: карта заведомо очень мягкая, и «размытое AO» — не дефект, а арифметика |
| `r.VolumetricCloud.SkyAO.TraceSampleCount` | **10** | сэмплов | Шагов на луч AO | Линейная | — |
| `r.VolumetricCloud.SkyAO.SnapLength` | **20.0** | километры | Привязка карты AO | 0 | Тот же механизм рывков, что у карты теней |
| `r.VolumetricCloud.SkyAO.Filtering` | **1** | bool | Дилатация/сглаживание карты AO | — | — |
| `r.VolumetricCloud.SkyAO.Debug` | 0 | bool | Показать карту AO | — | Прибор |
| `r.VolumetricCloud.EnableAerialPerspectiveSampling` | **1** | bool | Аэроперспектива на облаках | — | Без неё далёкие облака «вырезаны из бумаги» |
| `r.VolumetricCloud.EnableDistantSkyLightSampling` | **1** | bool | Вклад дальнего skylight | — | — |
| `r.VolumetricCloud.EnableAtmosphericLightsSampling` | **1** | bool | Вклад солнца/луны | — | При `0` облака становятся плоско-серыми |
| `r.VolumetricCloud.EnableLocalLightsSampling` | **0** | bool | Точечные источники освещают облака | **`[EXPERIMENTAL] Expenssive!`** (дословно в исходнике, с опечаткой) | Для катсцен, не для геймплея |
| `r.VolumetricCloud.LocalLights.ShadowSampleCount` | **12** | сэмплов | Тени от локальных источников в облаках | Очень дорого | Значим только при `EnableLocalLightsSampling=1` |
| `r.VolumetricCloud.Debug.SampleCountMode` | **0** | режим 0..5, `Clamp(x,0,5)` | Визуализация фактического числа сэмплов | — | Лучший инструмент, чтобы **увидеть**, а не гадать, где облака дороги |

### 4б. Свойства `UVolumetricCloudComponent` — здесь лежат настоящие значения †

Cvar-ы выше — **потолки**. Реальные числа берутся отсюда, и без этой таблицы весь блок облаков не поддаётся настройке.

| свойство | дефолт † | смысл и почему это важно |
|---|---|---|
| `Material` | none | Домен `Volume`. Пусто — облаков нет, никакие cvar-ы не помогут |
| `LayerBottomAltitude` | **5.0 км** | Нижняя граница слоя |
| `LayerHeight` | **10.0 км** | Толщина слоя. Вместе с предыдущим определяет длину луча у горизонта — главный драйвер цены в панораме |
| `TracingStartMaxDistance` | **350 км** | Насколько далеко может начаться трассировка |
| `TracingMaxDistance` | **50 км** | **Вот это** и есть «дальность облаков», которую ищут в `DistanceToSampleMaxCount` |
| `ViewSampleCountScale` | **1.0** | Множитель к базе 96. Единственный способ реально поднять качество первичного луча |
| `ReflectionViewSampleCountScale` | **1.0** | То же для отражений (база 96, потолок 80 — потолок ниже базы!) |
| `ShadowViewSampleCountScale` | **1.0** | Множитель к базе 10 для теневого луча внутри облака |
| `ShadowTracingDistance` | **15 км** | Длина теневого луча; за ней облако считается прозрачным |
| `StopTracingTransmittanceThreshold` | **0.005** | Ранний выход, когда луч уже почти не пропускает свет. **Механизм, объясняющий разброс цены:** плотное облако гасит луч за десяток шагов, редкая дымка не гасит его никогда и платит полный `SampleCountMax`. «Тонкие красивые облака» дороже «толстых» |
| `SkyLightCloudBottomOcclusion` | **0.5** | Затенение неба снизу |
| `bUsePerSampleAtmosphericLightTransmittance` | **false** | Заметно дороже, но убирает «плоский» цвет на закате |
| `PlanetRadius` | **6360 км** | Должен совпадать с атмосферой, иначе слой «не там» |

### 4в. Свойства света и skylight, задающие эффективные разрешения карт †

| свойство (компонент) | дефолт † | что задаёт |
|---|---|---|
| `bCastCloudShadows` (DirectionalLight) | **false** | Без него `r.VolumetricCloud.ShadowMap` не делает ничего |
| `CloudShadowMapResolutionScale` (DirectionalLight) | **1.0** | Множитель к базе 512 — **истинное** разрешение карты теней |
| `CloudShadowRaySampleCountScale` (DirectionalLight) | **1.0** | Множитель к базе 16 — истинное число шагов |
| `CloudShadowExtent` (DirectionalLight) | **10 км** | Размер карты в мире. **За его пределами теней облаков просто нет** — это, а не «баг», причина «тени облаков только рядом с игроком» |
| `CloudShadowStrength` / `...OnAtmosphereStrength` / `...OnSurfaceStrength` | **1.0** | Сила тени по трём приёмникам раздельно |
| `CloudShadowDepthBias` | **0.0** | Против самозатенения слоя |
| `bAtmosphereSunLight` / индекс солнца | true / 0 | Облака освещаются только «атмосферными» источниками с индексом 0 и 1 |
| `bCloudAmbientOcclusion` (SkyLight) | **false** | Без него `r.VolumetricCloud.SkyAO` не делает ничего |
| `CloudAmbientOcclusionMapResolutionScale` (SkyLight) | **1.0** | Множитель к базе 512 |
| `CloudAmbientOcclusionExtent` (SkyLight) | **150 км** | Размер карты AO в мире |
| `CloudAmbientOcclusionApertureScale` (SkyLight) | **0.05** | Раскрытие конуса AO |
| `bRealTimeCapture` (SkyLight) | **false** | Включает пересчёт кубмапы неба **каждый кадр**, вместе с облаками в ней (см. следующий блок) |

### 5. Volumetric Render Target — куда рисуются облака (`VolumetricRenderTarget.cpp`)

| cvar | дефолт | единица/шкала | что делает | цена | ловушки |
|---|---|---|---|---|---|
| `r.VolumetricRenderTarget` | **1** | bool | Рисовать облака в отдельный низкоразрешающий таргет с репроекцией | Экономит кратно | При `0` облака трассируются в полном разрешении — это не «качество», это цена ×16 по числу лучей относительно Mode 0 |
| `r.VolumetricRenderTarget.Mode` | **0** | режим 0..3, `Clamp(0,3)` | Задаёт разрешения трассировки и реконструкции | См. формулы ниже | Режим 2 и 3 **принудительно** ставят `UpsamplingMode=2`; режим 2 **не умеет пересекаться с непрозрачной геометрией** — облака рисуются поверх гор и деревьев. В 5.1 клэмп `Clamp(0,2)` |
| `r.VolumetricRenderTarget.UpsamplingMode` | **4** | 0..4 | 0 bilinear, 1 bilinear+jitter, 2 nearest+depth test, 3 bilinear+jitter+keep closest, **4 bilateral** | Малая | Значение перетирается режимами 2/3. Лечит **кайму по контуру**, а не смазывание при повороте — это разные артефакты |
| `r.VolumetricRenderTarget.UvNoiseSampleAcceptanceWeight` | **20.0** | вес | Порог отбраковки непохожих соседних сэмплов при джиттер-апсемпле | 0 | Клэмп `Max(0, x)`; действует только в режимах апсемпла с джиттером (1 и 3), в дефолтном режиме 4 — нет |
| `r.VolumetricRenderTarget.UvNoiseScale` | **0.5** (4.26/5.0/5.1) | множитель | Амплитуда джиттера UV | 0 | **Есть в Palworld, удалён к 5.3.** `ECVF_SetByScalability` |
| `r.VolumetricRenderTarget.PreferAsyncCompute` | **0** | bool | Считать облака на async-очереди | Может быть бесплатно при простое | Выигрыш есть только если в этот момент на графической очереди идёт работа, которой можно перекрыться, и если RHI/драйвер реально исполняет async параллельно. На «пустом» кадре — ноль |
| `r.VolumetricRenderTarget.ReprojectionBoxConstraint` | **0** | bool | Ограничить репроецированные данные окрестностью новых (neighborhood clamp, как в TAA) | ~0 | **Это** ручка против смазывания облаков при повороте камеры; ценой — возврат части шума |
| `r.VolumetricRenderTarget.MinimumDistanceKmToEnableReprojection` | **0.0** | километры (5.2+) | Ближе этой дистанции репроекция выключается | Ближние облака шумнее | Рекомендация из самого help: «One could start with a value of 4km» — лечит артефакты при пролёте сквозь слой. **Отсутствует в 5.1** (подтверждено дампом) |

### 6. Sky Atmosphere (`SkyAtmosphereRendering.cpp`)

| cvar | дефолт | единица/шкала | что делает | цена | ловушки |
|---|---|---|---|---|---|
| `r.SkyAtmosphere` | **1** | bool | Рисовать компоненты атмосферы | Весь тракт LUT-ов | — |
| `r.SupportSkyAtmosphere` | **1** | bool | Проектная настройка: код и шейдеры атмосферы | — | **`ECVF_ReadOnly`** — из `[SystemSettings]` в рантайме не подействует, читается через `FReadOnlyCVARCache` |
| `r.SupportSkyAtmosphereAffectsHeightFog` | **1** | bool | Разрешает атмосфере влиять на высотный туман | — | `ECVF_ReadOnly`. Именно эта связка делает горизонтную дымку «цветной» — и она же складывает две дымки: аэроперспектива и Height Fog суммируются, дальний план выцветает вдвое. Правильная ручка баланса — `HeightFogContribution` на компоненте атмосферы, а не выключение одной из подсистем |
| `r.SkyAtmosphere.SampleCountMin` | **2.0** | сэмплов | Минимум шагов рейтрейса неба | — | Клэмпится к 1 снизу |
| `r.SkyAtmosphere.SampleCountMax` | **32.0** | сэмплов | Потолок шагов | Линейная | Эффективное `min(32 · TraceSampleCountScale, cvar)`. `BaseScalability` на Epic ставит **128**, на Cine — 256, но при дефолтном `TraceSampleCountScale=1` реально останется **32**: обе строки самого Epic — no-op |
| `r.SkyAtmosphere.DistanceToSampleCountMax` | **150.0** | километры | На какой дистанции набирается максимум сэмплов | — | Аналог облачного `DistanceToSampleMaxCount`, с той же инверсией смысла |
| `r.SkyAtmosphere.SampleLightShadowmap` | **1** | bool | Учитывать shadow map солнца в рассеянии | — | Даёт объёмные лучи в атмосфере |
| `r.SkyAtmosphere.FastSkyLUT` | **1** | bool | Небо рисуется из LUT, а не рейтрейсом на пиксель | **Огромная экономия**, особенно в панораме (расчёт ниже) | При `1` теряются высокочастотные детали (тень Земли, узкий лоб рассеяния). `EffectsQuality@Cine` ставит **0** — то есть кинематографический пресет тихо переводит небо в режим «рейтрейс на каждый пиксель» |
| `r.SkyAtmosphere.FastSkyLUT.SampleCountMin` | **4.0** | сэмплов | Минимум шагов при построении LUT | — | — |
| `r.SkyAtmosphere.FastSkyLUT.SampleCountMax` | **32.0** | сэмплов | Потолок | Линейная | Тот же клэмп `min(32 · TraceSampleCountScale, cvar)` |
| `r.SkyAtmosphere.FastSkyLUT.DistanceToSampleCountMax` | **150.0** | километры | — | — | **Есть в дампе Palworld** |
| `r.SkyAtmosphere.FastSkyLUT.Width` | **192** | пикселей | Ширина LUT неба | Квадратичная, но копеечная | Ступени/полосы в небе лечатся именно этим |
| `r.SkyAtmosphere.FastSkyLUT.Height` | **104** | пикселей | Высота LUT неба | — | — |
| `r.SkyAtmosphere.AerialPerspective.DepthTest` | **1** | bool | Не писать пиксели ближе `StartDepth` | Экономит | — |
| `r.SkyAtmosphere.AerialPerspective.StartDepth` | **0.1** км † (**5.2+**) | километры | Ближняя граница аэроперспективы | 0 | **Отсутствует в дампе Palworld — и это ожидаемо**: параметр появился позже 5.1, а не был вырезан игрой. В 5.1 ту же роль играет свойство компонента |
| `r.SkyAtmosphere.AerialPerspectiveLUT.Width` | **32** | пикселей | XY froxel-объёма аэроперспективы (одно значение на **обе** оси; `.Height` не существует) | Квадратичная | — |
| `r.SkyAtmosphere.AerialPerspectiveLUT.DepthResolution` | **16.0** | слоёв | Число слоёв по глубине | Линейная | Ступени аэроперспективы на дальнем склоне — отсюда. `EffectsQuality@0` роняет до 8 |
| `r.SkyAtmosphere.AerialPerspectiveLUT.Depth` | **96.0** | километры | Длина объёма; дальше используется последний слой | 0 | Клэмп: `< 1 км → 1 км`. Длина слоя `= Depth / DepthResolution` = **6 км** по умолчанию |
| `r.SkyAtmosphere.AerialPerspectiveLUT.SampleCountMaxPerSlice` | **2.0** | сэмплов на слой | Качество интеграции в слое | Линейная | Эффективное `max(1, min(2 · TraceSampleCountScale, cvar))` |
| `r.SkyAtmosphere.AerialPerspectiveLUT.FastApplyOnOpaque` | **1** | bool | Применять дешёвый froxel-объём и к непрозрачным | Экономит | При `1` возможны артефакты на высокочастотных деталях; `Cine` ставит 0, и тогда каждый непрозрачный пиксель считает аэроперспективу сам — в панораме это весь экран |
| `r.SkyAtmosphere.TransmittanceLUT` | **1** | bool | Строить LUT пропускания | Копейки | — |
| `r.SkyAtmosphere.TransmittanceLUT.SampleCount` | **10.0** | сэмплов | Качество LUT пропускания | Копейки | `Cine` — 30 |
| `r.SkyAtmosphere.TransmittanceLUT.Width` / `.Height` | **256 / 64** | пикселей | Размер LUT | Копейки | — |
| `r.SkyAtmosphere.TransmittanceLUT.UseSmallFormat` | **0** | bool | R8G8B8A8 вместо float | Память | `EffectsQuality@0` включает — даёт бандинг на закате (8 бит на канал по всей шкале яркости заката) |
| `r.SkyAtmosphere.MultiScatteringLUT.SampleCount` | **15.0** | сэмплов | Качество многократного рассеяния | Копейки | — |
| `r.SkyAtmosphere.MultiScatteringLUT.HighQuality` | **0** | bool | 64 сэмпла вместо 2 | Заметно дороже | Дословно из help: «64 samples are used instead of 2» |
| `r.SkyAtmosphere.MultiScatteringLUT.Width` / `.Height` | **32 / 32** | пикселей | Размер LUT | Копейки | — |
| `r.SkyAtmosphere.DistantSkyLightLUT` | **1** | bool | Считать амбиентный вклад неба | Копейки | — |
| `r.SkyAtmosphere.DistantSkyLightLUT.Altitude` | **6.0** | километры | Высота выборки для амбиента | 0 | В части справочников имя пишут как `AltitudeInKm` — **такого имени нет** |
| `r.SkyAtmosphere.LUT32` | **0** | bool | Все LUT в fp32 вместо fp16/упакованных | Память/ПСП | Механизм: бандинг в небе — это квантование при хранении LUT, а не нехватка сэмплов. Поэтому LUT32 лечит полосы там, где подъём `SampleCountMax` не даёт ничего |
| `r.SkyAtmosphereASyncCompute` | **false** | bool | Строить LUT на async-очереди | Может быть бесплатно | Меняет **место прохода**: `BeforeOcclusion` вместо `BeforeBasePass`. Имя **без точки** после `SkyAtmosphere` — постоянный источник опечаток |
| `r.SkyAtmosphere.EditorNotifications` | 1 | bool | Предупреждения в редакторе | — | В игре бесполезен |

### 6б. Свойства `USkyAtmosphereComponent` †

| свойство | дефолт † | смысл |
|---|---|---|
| `TraceSampleCountScale` | **1.0** | Множитель к базам 32 и 2. **Без него ни одна строка `SampleCountMax` выше 32 не работает** |
| `AerialPespectiveViewDistanceScale` | **1.0** | Дальность аэроперспективы. Имя члена в исходнике **написано с опечаткой** (`Pespective`) — при грепе по коду это ловушка |
| `HeightFogContribution` | **1.0** | Сколько атмосферы попадает в Height Fog. Правильная ручка против «двойной дымки» |
| `MultiScatteringFactor` | **1.0** | Сила многократного рассеяния; 0 даёт «мёртвое» тёмное небо |
| `TransmittanceMinLightElevationAngle` | **−90°** | Обрезка пропускания у горизонта; лечит чёрное солнце под горизонтом |
| `BottomRadius` / `AtmosphereHeight` | **6360 км / 60 км** | Должны быть согласованы с `PlanetRadius` облаков |

### 7. Соседние подсистемы, которые принимают за объёмку

| cvar | дефолт † | что это на самом деле |
|---|---|---|
| `r.LightShaftQuality` | **1** | «Божественные лучи» от солнца — **экранно-пространственный** эффект (радиальный блюр), включается чекбоксами `Light Shaft Bloom` / `Light Shaft Occlusion` на DirectionalLight. Всё семейство `r.LightShaft*` **есть в дампе Palworld** |
| `r.LightShaftDownSampleFactor` | **2** | Понижение разрешения буфера лучей |
| `r.LightShaftNumSamples` | **12** | Число сэмплов радиального блюра |
| `r.LightShaftBlurPasses` | **3** | Число проходов |
| `r.LightShaftFirstPassDistance` | **0.1** | Длина первого прохода |
| `r.LightShaftAllowTAA` / `r.LightShaftRenderToSeparateTranslucency` | 1 / 0 | Взаимодействие с TAA и полупрозрачностью |
| `r.SkyLight.RealTimeReflectionCapture` | **1** | Пересчёт кубмапы неба в рантайме. **Скрытый потребитель облаков:** при `bRealTimeCapture` на Skylight облака трассируются ещё раз, по путям `ReflectionRaySampleMaxCount`/`Shadow.ReflectionRaySampleMaxCount`. Если облака дороже, чем следует из доли неба на экране, — смотреть сюда. Есть в дампе Palworld вместе с `.TimeSlice`, `.DepthBuffer`, `.ShadowFromOpaque` |
| `r.SkyLight.RealTimeReflectionCapture.TimeSlice` | **1** | Размазать захват по кадрам — первая правка, если захват дорог |
| `r.HeterogeneousVolumes.*` | — | Отдельный тракт объёмных ассетов (5.2+, **есть в дампе Palworld**). К froxel-туману и облакам отношения не имеет; без соответствующих ассетов в сцене ничего не стоит и ничего не даёт |
| `r.VolumetricLightmap.*` | — | Запечённое непрямое освещение. Слово «Volumetric» в имени — совпадение |

---

## Как считается

**1. Приоритеты применения (общее для всех cvar-ов, из `IConsoleManager.h`).** Порядок «слабый → сильный»:

```
SetByConstructor (0x00) < SetByScalability (0x01) < SetByGameSetting (0x02)
< SetByProjectSetting (0x03) < SetBySystemSettingsIni (0x04) < SetByDeviceProfile (0x05)
< SetByGameOverride (0x06) < SetByConsoleVariablesIni (0x07) < SetByCommandline
< SetByCode < SetByConsole
```

Ключевое: `[SystemSettings]` в `Engine.ini` **и** секция `[ConsoleVariables]` имеют **один и тот же** приоритет `SetBySystemSettingsIni` (комментарий в исходнике: «Used by the `[ConsoleVariables]` section of Engine.ini as well as FSystemSettings»). Оба **сильнее** любой scalability-группы (`sg.*`) — то есть строка `r.VolumetricFog.GridPixelSize=16` в `[SystemSettings]` переживает `sg.ShadowQuality=3`. Но обе слабее `SetByCode`/`SetByConsole` — если игра сама выставляет cvar в рантайме (мод, менеджер настроек, свой `ApplyCVarSettings`), ini проигрывает. Практическое следствие проверено нами: см. «Проверено нами», п. 4.

**2. Volumetric Fog — размер сетки и память.**

```
GridXY = ceil(RenderResolution / max(1, GridPixelSize))          // рендер-, не экранное разрешение
if (GridXY.X или .Y > GMaxVolumeTextureDimensions):              // 2048 на D3D11/12 †
    GridPixelSize = max(ceil(W/GMax), ceil(H/GMax))               // движок сам огрубляет сетку
GridZ  = max(1, GridSizeZ)
Число froxel-ов = GridXY.X · GridXY.Y · GridZ
```

Сетка строится от `View.GetSceneTexturesConfig().Extent`, то есть от **разрешения рендера до апскейла**. Значит DLSS/FSR **реально удешевляют туман** (в отличие от CPU-bound панорамы).

Примеры на 4K:
- нативно, дефолт: `3840/16 × 2160/16 × 64 = 240·135·64 ≈ 2.07 млн` froxel-ов;
- нативно, Epic-профиль (`GridPixelSize=8, GridSizeZ=128`): `480·270·128 ≈ 16.6 млн` — **×8**;
- DLSS Quality (рендер 2560×1440), дефолт: `160·90·64 ≈ 0.92 млн` — **×0.44** от нативного.

**Память, о которой обычно не пишут.** Тракт держит порядка пяти объёмных текстур (VBufferA/B воксeлизации, LightScattering + история, IntegratedLightScattering), в основном `PF_FloatRGBA` — грубо **≈40 байт на воксель** †. Тогда 2.07 млн froxel-ов ≈ **83 МБ**, а Epic-профиль на 4K ≈ **660 МБ** только под туман. Это оценка порядка, а не замер, но она объясняет, почему `GridPixelSize=4` на 4K способен уронить не кадры, а весь бюджет VRAM.

**Мультивид.** Каждый вид строит свой объём: сплит-скрин и VR умножают и цену, и память на число видов.

**3. Volumetric Fog — распределение слоёв по глубине** (`GetVolumetricFogGridZParams`, дословно):

```
slice = log2(z·B + O) · S,   где S = r.VolumetricFog.DepthDistributionScale (32)
N = max(NearClippingDistance, VolumetricFogStartDistance) + 9.5   // NearOffset = .095 · 100 см
F = VolumetricFogDistance                                          // 6000 см по умолчанию
O = (F − N · 2^((GridSizeZ−1)/S)) / (F − N)
B = (1 − O) / N
```

Отсюда четыре вывода.

Первое: **дальность тумана — это `F`, свойство компонента, а не cvar**; никакой `r.VolumetricFog.Distance` не существует.

Второе: слои логарифмические, поэтому удвоение `GridSizeZ` уплотняет в основном ближнюю зону.

Третье: `S` двигает слои, не добавляя их — это бесплатная ручка. **Направление легко проверить арифметикой** (`N≈10`, `F=6000`, `GridSizeZ=64`), и оно противоположно тому, что пишут в половине гайдов:

| `S` | середина шкалы слоёв (slice 31.5) приходится на | смысл |
|---|---|---|
| 16 | z ≈ **1230 см** | слои сгружены к камере, дальняя половина объёма почти без слоёв |
| **32** (дефолт) | z ≈ **2020 см** | компромисс |
| 64 | z ≈ **2510 см** | ближе к линейному, дальняя зона детальнее |

При `S → ∞` распределение вырождается в строго линейное. Значит: **ступени вдали лечит подъём `S`, ступени вплотную к камере — снижение `S`.**

Четвёртое: `NearOffset = 9.5 см` означает, что `VolumetricFogStartDistance=0` не даёт нулевой ближней плоскости — объём всегда начинается чуть впереди камеры.

**4. Volumetric Fog — темпоральная часть.**

```
HistoryWeight_effective = bTemporalHistoryIsValid ? r.VolumetricFog.HistoryWeight : 0
HistoryMissSuperSampleCount = Clamp(r.VolumetricFog.HistoryMissSupersampleCount, 1, 16)
RandomOffset = (Jitter && TemporalReprojection) ? Halton(frame&1023, {2,3,5}) : (0.5,0.5,0.5)
```

В шейдере: воксель, чей `HistoryUV` вышел за `[0..1]` (край экрана, поворот), считается `HistoryMissSuperSampleCount` раз вместо одного. Отсюда «дорожают именно повороты камеры», а не статичный кадр.

**Количественно про шлейф.** Экспоненциальное сглаживание с весом `w` гасит остаток как `w^n`; «время жизни» призрака до 5 % ≈ `ln(0.05)/ln(w)` кадров:

| `w` | кадров до 5 % | эффективное число накопленных сэмплов `(1+w)/(1−w)` |
|---|---|---|
| 0.95 | 58 | 39 |
| **0.9** (дефолт) | **28** | **19** |
| 0.75 | 10 | 7 |
| 0.6 | 6 | 4 |

Это и есть обмен, который в советах «поставьте 0.6» не проговаривают: шлейф укорачивается впятеро, но качество интеграции падает вчетверо-впятеро — вместо призрака появляется кипение. На 144 Гц 28 кадров — это 0.19 с, и субъективно шлейф заметен именно при быстром повороте, а не при ходьбе.

**5. Volumetric Cloud — число шагов луча** (`VolumetricCloud.usf`, дословно):

```
IStepCount = max(SampleCountMin,
                 SampleCountMax · saturate((TMax − TMin) · InvDistanceToSampleCountMax))
StepT = (TMax − TMin) / StepCount
```

где

```
SampleCountMax       = max(2, min(96 · ViewSampleCountScale,  r.VolumetricCloud.ViewRaySampleMaxCount))
ShadowSampleCountMax = max(2, min(10 · ShadowViewSampleCountScale, r.VolumetricCloud.Shadow.ViewRaySampleMaxCount))
InvDistanceToSampleCountMax = 1 / max(1, 100000 · r.VolumetricCloud.DistanceToSampleMaxCount)
```

`BaseViewRaySampleCount = 96`, `BaseShadowRaySampleCount = 10` — константы `UVolumetricCloudComponent`. UI-ползунки `*SampleCountScale` имеют `ClampMin 0.05`, `UIMax 8`. Отсюда «магия» дефолтов: `96·8 = 768`, `10·8 = 80`, `16·8 = 128` (карта теней), `512·4 = 2048` (разрешения карт). **Все эти cvar-ы — не значения, а потолки, которые при дефолтных настройках компонента не достигаются.** Это самая частая ошибка агентов в этом разделе: правка `ViewRaySampleMaxCount` 768→256 без изменения `ViewSampleCountScale` не меняет ни кадра, ни миллисекунды.

Второе следствие формулы: длина трассы `(TMax − TMin)` **насыщает** число шагов на 15 км. Дальше растёт только длина шага `StepT` — то есть далёкие облака не дорожают, а **грубеют** (бандинг). Направление правки против этого одно: **снижение** `DistanceToSampleMaxCount` = выйти на максимум раньше = дороже и чище; подъём — дешевле и грубее.

Третье, о чём не пишут: полная стоимость пикселя облака — это **произведение** первичных и теневых шагов, `до 96 × 10 = 960` выборок объёма на луч, плюс ранний выход по `StopTracingTransmittanceThreshold`. Именно поэтому редкая полупрозрачная дымка на горизонте дороже плотной кучёвки над головой.

**6. Volumetric Cloud — карта теней и SkyAO.**

```
ShadowMapResolution = min(512 · CloudShadowMapResolutionScale, r.VolumetricCloud.ShadowMap.MaxResolution)
SkyAOResolution     = min(512 · CloudAmbientOcclusionMapResolutionScale, r.VolumetricCloud.SkyAO.MaxResolution)
RayMapSampleCount   = max(4, min(16 · CloudShadowRaySampleCountScale, r.VolumetricCloud.ShadowMap.RaySampleMaxCount))
FinalSampleCount    = N + (RaySampleHorizonMultiplier − 1) · N · HorizonFactor
HorizonFactor       = clamp(0.2 / |dot(PlanetUp, −LightDir)|, 0, 1)
Snap: p = floor((p + 0.5·SnapLength·100000) / (SnapLength·100000)) · (SnapLength·100000)
```

При включённом темпоральном фильтре трассировка идёт в **половину** разрешения карты (`CloudShadowmapHalfResolution`).

**Размер текселя — то, что реально определяет «мыло»:**

```
метров на тексель = Extent(км)·1000 / Resolution
тени:  10 000 / 512  ≈ 19.5 м   ← при дефолтах
AO:   150 000 / 512  ≈ 293  м   ← при дефолтах
```

Из этого следует и то, почему `ShadowMap.MaxResolution` вверх «не работает» (упирается в `512·scale`), и то, почему AO облаков всегда мягкое, и то, что за пределами `CloudShadowExtent` теней облаков нет вовсе.

**7. Volumetric Render Target — фактические разрешения.**

| Mode | реконструкция | трассировка | итог при рендере 2560×1440 |
|---|---|---|---|
| **0** (дефолт) | view / 2 | reconstruct / 2 = view/4 | трассировка **640×360** |
| 1 | view / 1 | reconstruct / 2 = view/2 | трассировка 1280×720 |
| 2 | view / 1 | reconstruct / 4 = view/4 | 640×360, но **без пересечения с непрозрачными**, `UpsamplingMode`→2 |
| 3 | view / 1 | view / 1 | полное разрешение (кинематограф) |

`Mode = Clamp(Mode, 0, 3)` (в 5.1 — `Clamp(0, 2)`), `UpsamplingMode = (Mode==2||Mode==3) ? 2 : Clamp(UpsamplingMode, 0, 4)`. Переход 0→3 — это **×16** по числу трассируемых лучей.

**8. Sky Atmosphere — сэмплы и LUT-ы.**

```
SampleCountMax_eff        = min(32 · TraceSampleCountScale, r.SkyAtmosphere.SampleCountMax)
FastSkySampleCountMax_eff = min(32 · TraceSampleCountScale, r.SkyAtmosphere.FastSkyLUT.SampleCountMax)
APSampleCountPerSlice     = max(1, min(2 · TraceSampleCountScale, r.SkyAtmosphere.AerialPerspectiveLUT.SampleCountMaxPerSlice))
SliceLengthKm             = max(1, AerialPerspectiveLUT.Depth) / AerialPerspectiveLUT.DepthResolution   // 96/16 = 6 км
```

`SkyAtmosphereBaseSampleCount = 32`, `AerialPerspectiveBaseSampleCountPerSlice = 1`. Тот же паттерн «база компонента × scale, потолок cvar-ом» — и та же ловушка: **значения scalability выше 32 не работают без правки `TraceSampleCountScale` на компоненте**.

**Бюджет атмосферы в сэмплах за кадр при дефолтах** (это объясняет, почему её почти никогда не надо трогать):

```
TransmittanceLUT   256·64      × 10  ≈ 0.16 млн
MultiScatteringLUT  32·32      × 15  ≈ 0.015 млн
FastSkyLUT         192·104     × 32  ≈ 0.64 млн
AerialPerspective   32·32·16   ×  2  ≈ 0.03 млн
итого                              ≈ 0.85 млн выборок, независимо от разрешения экрана
```

**9. Кто кого перекрывает внутри раздела — сводка.**

- `sg.ShadowQuality` **перекрывает** `r.VolumetricFog`, `.GridPixelSize`, `.GridSizeZ`, `.HistoryMissSupersampleCount` (уровни 0 и 1 **выключают туман совсем**; 2 → 16/64/4; 3 → **8/128**/4; Cine → **4/128/16**). Объёмный туман **не принадлежит** `sg.EffectsQuality` — это первое, что понимают неверно.
- `sg.EffectsQuality` перекрывает весь блок `r.SkyAtmosphere.*` (уровень 0: `AerialPerspectiveLUT.DepthResolution=8`, `SampleCountMax=16`, `TransmittanceLUT.UseSmallFormat=1`; Cine: `FastSkyLUT=0`, `FastApplyOnOpaque=0`, `SampleCountMax=256`, `DepthResolution=32`). Из-за клэмпа `32·scale` строки `SampleCountMax` на Epic и Cine — no-op у самого Epic.
- **`r.VolumetricCloud.*` и `r.VolumetricRenderTarget.*` в эпиковом `BaseScalability.ini` не встречаются вовсе** — их никто не понижает автоматически, вся цена облаков задана компонентом и cvar-ами. Игра может иметь собственный `Scalability.ini`; это надо проверять по конкретному билду, а не предполагать.
- `r.Fog` в `BaseScalability.ini` также не встречается: sg-группы высотный туман не трогают.
- `[SystemSettings]` (и `[ConsoleVariables]`) сильнее любой `sg.*`-группы, но слабее рантайм-записи из кода игры или мода.
- Внутри тракта облаков: `r.VolumetricRenderTarget.Mode` 2/3 **принудительно** перетирает `UpsamplingMode`; `r.VolumetricCloud.DisableCompute=1` отключает и `EmptySpaceSkipping`, и min/max-depth-путь; `r.VolumetricCloud.HighQualityAerialPerspective` требует `EnableAerialPerspectiveSampling=1`; `ShadowMap`/`SkyAO` не считаются без соответствующих чекбоксов на свете и Skylight.
- `ECVF_ReadOnly` в этом разделе: `r.SupportSkyAtmosphere`, `r.SupportSkyAtmosphereAffectsHeightFog`, `r.VolumetricFog.VoxelizationSlicesPerGSPass`, `r.VertexFoggingForOpaque`, `r.Water.SingleLayerWater.SupportCloudShadow` †, `r.SupportCloudShadowOnForwardLitTranslucent` †. Их правка в рантайме бессмысленна, они читаются через `FReadOnlyCVARCache` при инициализации.

---

## Как это мерить, прежде чем крутить

Раздел, без которого все остальные — гадание.

| прибор | команда | что даёт |
|---|---|---|
| Кто горлышко | `stat unit` | Frame / Game / Draw / GPU. Если Game ≫ GPU — весь этот раздел вам не поможет |
| Цена подсистем | `stat gpu` | Отдельные счётчики `VolumetricFog`, `VolumetricRenderTarget` / `VolumetricCloud`, `SkyAtmosphere`, `LightShafts`. **Единственный честный способ** узнать, сколько ваши облака стоят в миллисекундах |
| Разбор кадра | `ProfileGPU` (Ctrl+Shift+,), `DumpGPU` (5.x) | Пер-проходное дерево: видно, что дороже — `ShadowMap`, `SkyAO` или первичная трассировка |
| Адресация артефакта | `showflag.VolumetricFog/Fog/Atmosphere/Cloud/LightShafts 0` | Какая подсистема рисует то, что не нравится |
| Сэмплы облаков | `r.VolumetricCloud.Debug.SampleCountMode 1..5` | Фактическое (а не потолочное) число шагов по экрану |
| Карты облаков | `r.VolumetricCloud.ShadowMap.Debug 1`, `r.VolumetricCloud.SkyAO.Debug 1` | Попадает ли местность в extent карт, и насколько они грубые |
| Воксeлизация | `r.VolumetricFog.VoxelizationShowOnlyPassIndex N` | Что именно пишет плотность в froxel-объём |

Методика A/B, без которой замер недействителен: менять **строго по одной строке**; читать перцентили, а не средний FPS; **выключать генерацию кадров** на время замера (см. «Проверено нами», п. 3); проверять, что правка вообще доехала (лог мода/`DumpCVars`), прежде чем объяснять её отсутствующий эффект.

---

## Почему объёмка дорога именно в панорамных сценах

Подсистемы ведут себя в панораме **по-разному**, и смешивать их в «объёмку» — верный способ потратить час впустую.

**Volumetric Fog в панораме не дорожает вообще.** Его цена — фиксированное число froxel-ов от рендер-разрешения (формула выше), плюс инжект по числу источников света, попавших в объём. Открытый пейзаж без фонарей — самый дешёвый случай: сетка та же, инжектировать почти нечего. Более того, туман кончается на `VolumetricFogDistance` (60 м по умолчанию), то есть в панораме покрывает исчезающе малую часть картинки. **Вывод: гасить `r.VolumetricFog` ради панорамы — правка не по адресу**; она вернёт кадры в тесной пещере с факелами, а не на горном хребте.

**Volumetric Cloud в панораме дорожает по четырём осям сразу.**
(а) *Доля экрана*: чем больше неба, тем больше пикселей идут в трассировку — а HZB-отсечение (`r.VolumetricCloud.HzbCulling`, где оно есть) в панораме бесполезно, потому что за небом нет непрозрачной геометрии, которая отсекла бы луч.
(б) *Длина луча*: у горизонта луч идёт через слой облаков почти по касательной, `(TMax − TMin)` максимальна, `saturate(...)` насыщается и **каждый такой пиксель платит полный `SampleCountMax`**, тогда как облако над головой пробивается коротким лучом и стоит доли этого.
(в) *Вторичные лучи*: у каждого шага есть теневой луч (до 10 сэмплов при дефолте) — множитель, а не слагаемое; на закате `RaySampleHorizonMultiplier` добавляет до ×2 сэмплов карте теней. Панорама на рассвете/закате — худший случай по определению.
(г) *Ранний выход не срабатывает*: у горизонта видна тонкая дымка, которая не набирает `StopTracingTransmittanceThreshold` и идёт до конца трассы.

Численно, Mode 0 на 4K нативно при 60 % неба: трассировка идёт в `960×540 = 518 тыс.` пикселей, из них ~311 тыс. небо, × до 96 первичных шагов ≈ **30 млн** выборок объёма, каждая со своим теневым лучом до 10 шагов — до **300 млн** вторичных. Для сравнения — вся атмосфера с LUT стоит **0.85 млн** выборок. Порядок разницы объясняет, почему в панораме режут облака, а не небо.

**Но часть цены облаков от панорамы не зависит вовсе** — и её обычно забывают: проходы `ShadowMap` (512² × ~16 сэмплов, до ×2 у горизонта) и `SkyAO` (512² × 10) считаются всегда, пока включены чекбоксы на свете и Skylight, даже когда камера смотрит в землю. Плюс, если у Skylight стоит `Real Time Capture`, облака трассируются **ещё раз** в кубмапу. Если `stat gpu` показывает большую цену облаков там, где неба почти нет, — виноваты именно эти три прохода, и лечатся они не `ViewRaySampleMaxCount`, а `r.SkyLight.RealTimeReflectionCapture.TimeSlice`, снижением `*MaxResolution` **ниже 512** и выключением ненужных чекбоксов.

**Sky Atmosphere в панораме дорожает только если выключен `FastSkyLUT`.** С LUT (дефолт) небо стоит фиксированные 192×104 выборки, сколько бы его ни было на экране. Без LUT (`EffectsQuality@Cine`) каждый пиксель неба — полноценный рейтрейс атмосферы. Считаем: 4K, 60 % неба = 5.0 млн пикселей × до 32 шагов ≈ **160 млн** выборок против 0.85 млн с LUT — разница **порядка ×200**. Туда же `FastApplyOnOpaque=0` на Cine: тогда аэроперспективу считает и каждый непрозрачный пиксель. Именно поэтому «включить Cine, там же красивее» — самый дорогой однокнопочный способ убить панораму.

Аэроперспектива живёт в froxel-объёме 32×32×16 и от панорамы не зависит вовсе, но её грубость (6 км на слой) **видна** именно в панораме — на дальнем склоне ступенями.

**И главный контекстный вывод для нашей машины.** Всё вышеперечисленное — цена на GPU. Наш собственный замер по полосам частоты показал, что на панораме сцена упирается в **игровой поток**: CPU busy 28.1 мс против GPU busy 6.2 мс на 25–45 к/с. При таком разрыве срезание объёмки на GPU **не сдвинет частоту вообще**, потому что видеокарта и так простаивает две трети времени кадра. Правильная последовательность: сперва замерить, где горлышко (`stat unit`, PresentMon, оверлей), и только если GPU busy сравним с CPU busy — идти в этот раздел. Иначе объёмка режется «в никуда», а картинка теряется по-настоящему.

---

## Симптом → причина

| Симптом | Механизм | Чем лечится | Что отличает эту причину от соседних |
|---|---|---|---|
| Объёмного тумана нет вообще, хотя `r.VolumetricFog=1` | `bEnableVolumetricFog=false` на компоненте, либо `sg.ShadowQuality ≤ 1` выключает подсистему | Чекбокс на `ExponentialHeightFogComponent`; `sg.ShadowQuality ≥ 2` | `showflag.VolumetricFog 0/1` не меняет ничего — рисовать нечего |
| Лампа/факел не даёт конуса в тумане | `VolumetricScatteringIntensity = 0`, статический (запечённый) свет, либо источник за `VolumetricFogDistance` | Свойство света; сделать свет Stationary/Movable; проверить дальность | Тень и пятно света **на геометрии есть**, объёма нет |
| Горизонтальные полосы/ступени поперёк объёма тумана **вдали**, «дышат» при движении вперёд | Логарифмическое распределение слоёв редеет к дальней границе | `r.VolumetricFog.GridSizeZ` вверх; **`DepthDistributionScale` вверх** (бесплатно, распределение линеаризуется) | Полосы перпендикулярны взгляду, **двигаются вместе с камерой**, гуще к дальней границе объёма |
| Ступени вплотную к камере, вдаль чисто | Слои растянуты слишком линейно (высокий `S`) либо `VolumetricFogDistance` задран | `DepthDistributionScale` вниз; вернуть `VolumetricFogDistance` к ~6000 | Зеркальный случай предыдущего — различать по тому, где именно ступени |
| Шлейф/призрак тянется за движущимся фонарём или за игроком в тумане | Темпоральное накопление с весом 0.9 — остаток гаснет ~28 кадров | `r.VolumetricFog.HistoryWeight` → 0.6…0.75, понимая, что эффективных сэмплов станет вчетверо меньше | Артефакт **исчезает, если постоять** несколько кадров; на статичной камере его нет |
| Крупный «квадратный пиксель» тумана вокруг источника света | Размер froxel по XY | `r.VolumetricFog.GridPixelSize` вниз (дорого, квадратично, ещё и память) **или** `r.VolumetricFog.UpsampleJitterMultiplier` вверх (бесплатно, платим шумом) | Размер блока **не меняется при движении** и строго пропорционален `GridPixelSize`; на 4K блоки вдвое мельче, чем на 1080p при том же cvar; при DLSS блоки крупнее, чем ожидаешь по разрешению окна |
| Туман резко обрывается на расстоянии, дальше — плоская дымка | `VolumetricFogDistance` компонента (6000 см) | Свойство компонента; **cvar-а не существует**. Поднимать без подъёма `GridSizeZ` бессмысленно (те же слои на большей длине) | Граница на фиксированном расстоянии **движется вместе с камерой**, как стена |
| Резкий шов тумана вдали, за ним вообще ничего | `FogCutoffDistance` компонента | Свойство компонента (0 = выключено) | Граница **привязана к миру**, а не к камере, и режет и дымку, и объём |
| Мерцание/шум в тумане, «кипящие» точки | `Jitter=1` без `TemporalReprojection`, либо `HistoryWeight` слишком мал | Вернуть `TemporalReprojection=1`; поднять `HistoryWeight` | Шум **высокочастотный и на месте**, в отличие от шлейфа, который тянется |
| Туман «ломается» по треугольникам на больших поверхностях | Вершинный туман для непрозрачных | `r.VertexFoggingForOpaque=0` (**ReadOnly**, только с рестарта) | Границы совпадают с рёбрами меша |
| Частицы/полупрозрачность «выпадают» из тумана, скачком меняют плотность | Полупрозрачность туманится по позиции объекта, а не по пикселю | Свойства материала (`Apply Fogging`), сортировка, `TranslucencySortPriority` | Скачок происходит при пересечении объектом слоя, а не по экрану |
| Дымка на горизонте не исчезла после `r.VolumetricFog=0` | Это не объёмный туман, а Exponential Height Fog + аэроперспектива Sky Atmosphere | `r.Fog=0` (если имя зарегистрировано), `FogDensity`/`FogCutoffDistance` компонента, `HeightFogContribution` атмосферы, `r.SupportSkyAtmosphereAffectsHeightFog=0` (ReadOnly, только с рестарта) | Дымка **лежит на далёких объектах**, за пределами `VolumetricFogDistance`; при `showflag.Fog 0` уходит, при `showflag.VolumetricFog 0` — нет |
| Дальний план выцветает вдвое сильнее, чем настроено | Аэроперспектива и Height Fog складываются | `HeightFogContribution` на компоненте атмосферы (не выключение одной из подсистем) | Пропорция «серости» меняется при `showflag.Atmosphere 0`, но дымка остаётся |
| Лучи от солнца сквозь листву остались после `r.VolumetricFog=0` | Это **Light Shafts** — экранный эффект на DirectionalLight | `r.LightShaftQuality=0` или чекбоксы `Light Shaft Bloom/Occlusion` на свете | Лучи исчезают по `showflag.LightShafts 0`; всегда идут строго от солнца и живут в экранном пространстве (обрезаются краем экрана) |
| Туман пропадает, когда поднимаешься на гору | Высотный спад `FogHeightFalloff` от Z актора тумана | Свойства компонента; второй слой `SecondFogData` | Плотность зависит от высоты камеры, а не от дальности |
| Ступени/бандинг по расстоянию на плавном дальнем склоне | 16 слоёв аэроперспективы на 96 км = 6 км на слой | `r.SkyAtmosphere.AerialPerspectiveLUT.DepthResolution` вверх; `.Depth` вниз | Ступени привязаны к **расстоянию до геометрии**, а не к экрану; видны на однородной поверхности |
| Полосы/кольца в самом небе, особенно на закате | Разрешение `FastSkyLUT` 192×104 и/или квантование при хранении LUT | `FastSkyLUT.Width/Height` вверх, `TransmittanceLUT.UseSmallFormat=0`, `r.SkyAtmosphere.LUT32=1` | Полосы **на небе, без геометрии**; если подъём `SampleCountMax` не помогает — это квантование, а не сэмплы |
| Небо стоит несколько миллисекунд в панораме | `FastSkyLUT=0` (пришло из `EffectsQuality@Cine`) | `r.SkyAtmosphere.FastSkyLUT=1`, `AerialPerspectiveLUT.FastApplyOnOpaque=1` | Цена растёт пропорционально доле неба на экране — единственный случай в атмосфере, когда это так |
| Шум/кипение на облаках, особенно вблизи и при полёте сквозь слой | Трассировка в 1/4 разрешения + репроекция прошлых кадров | `r.VolumetricRenderTarget.Mode` 0→1, `MinimumDistanceKmToEnableReprojection` ≈4 (5.2+) | Шум **только на облаках**, экранного пространства, усиливается при быстром движении |
| Облака «плывут»/смазываются при повороте камеры | Репроекция VRT без ограничения окрестностью | `r.VolumetricRenderTarget.ReprojectionBoxConstraint=1` | Смазывание **только при повороте**, статичная камера чистая. `UpsamplingMode` здесь ни при чём — он про кромку |
| Тёмная или светлая кайма по контуру облаков на фоне неба | Билатеральный/жёсткий апсемпл низкоразрешающего таргета | `r.VolumetricRenderTarget.UpsamplingMode`; `UvNoiseSampleAcceptanceWeight` (только в режимах 1/3) | Кайма шириной ровно в пиксель апсемпла, **на границе облака и неба**, статична |
| Облака рисуются **поверх** горы, дерева, здания | `r.VolumetricRenderTarget.Mode=2` не умеет пересекаться с непрозрачной геометрией | Mode 0/1/3; при Mode 2 выключить `HzbCulling` | Артефакт строго по силуэту геометрии на фоне неба |
| Ступенчатые полосы внутри самих облаков | Слишком длинный шаг: луч насытил `SampleCountMax` или `StepSizeOnZeroConservativeDensity` > 1 | `ViewSampleCountScale` на компоненте вверх; `StepSizeOnZeroConservativeDensity=1`; `DistanceToSampleMaxCount` вниз | Полосы **внутри** облачной массы, идут концентрически от камеры |
| Тени от облаков на земле мерцают/прыгают при движении | Снап карты теней с шагом 20 км при extent 10 км + низкое разрешение | `ShadowMap.SnapLength` вниз (заметно меньше `CloudShadowExtent`), `SpatialFiltering`, разрешение вверх через `CloudShadowMapResolutionScale` | Прыжок происходит **скачком при пересечении невидимой границы**, а не плавно |
| Тени облаков есть рядом с игроком и отсутствуют вдали | `CloudShadowExtent` = 10 км, карта конечна | Свойство DirectionalLight | Граница круглая/квадратная и **едет за камерой**; видна в `r.VolumetricCloud.ShadowMap.Debug 1` |
| Тени облаков есть на земле, но не на воде / не на полупрозрачности | `r.Water.SingleLayerWater.SupportCloudShadow` / `r.SupportCloudShadowOnForwardLitTranslucent` выключены (ReadOnly) | Проектные настройки + рестарт | Строго по материалу приёмника |
| Облачные тени размытые/мыльные | Эффективное разрешение карты = `512 · scale`, не cvar; 19.5 м на тексель | `CloudShadowMapResolutionScale` на DirectionalLight (cvar только потолок) | Подъём `ShadowMap.MaxResolution` **не даёт ничего** — верный признак, что упёрлись в `512 · scale` |
| Облака дороги, хотя неба почти не видно | Проходы `ShadowMap`, `SkyAO` и real-time-захват Skylight не зависят от доли неба | Чекбоксы на свете/Skylight; `*.MaxResolution` **ниже 512**; `r.SkyLight.RealTimeReflectionCapture.TimeSlice` | `stat gpu` показывает цену в `ShadowMap`/`SkyAO`/капчуре, а не в первичной трассировке |
| Облаков нет вовсе | Нет материала домена `Volume`, нет Sky Atmosphere в сцене, либо `r.VolumetricCloud=0` | Ассет/актор; cvar | `showflag.Cloud` ничего не меняет |
| Тени сквозь туман пропали, свет «протекает» | `SampleLightShadowmap=0`, `Cast Volumetric Shadow` снят, или свет не в списке инжектируемых | `r.VolumetricFog.InjectShadowedLightsSeparately=1`, `r.SkyAtmosphere.SampleLightShadowmap=1`, `r.VolumetricCloud.Shadow.SampleAtmosphericLightShadowmap=1`, чекбокс на свете | Тень есть на геометрии, но **отсутствует в объёме** |
| Правка `r.VolumetricCloud.ViewRaySampleMaxCount` не даёт ни FPS, ни изменений картинки | Cvar — потолок, эффективное значение `96 · ViewSampleCountScale` = 96 | Менять `ViewSampleCountScale` компонента, либо опустить cvar **ниже 96** | Проверяется прибором: `r.VolumetricCloud.Debug.SampleCountMode 1` показывает фактическое число сэмплов |
| Объёмного тумана нет в отражении в воде/зеркале | Он не рендерится в reflection capture и planar reflections | Никак (архитектурное ограничение) | Туман в кадре есть, в отражении отсутствует всегда, при любых настройках |

*Строки этой таблицы выведены из исходников и формул выше; экспериментом на нашей машине из них не проверена ни одна — наши проверенные замеры собраны отдельным разделом ниже.*

---

## Где документация Epic расходится с кодом

| Что утверждает документация/UI/help | Что в коде | Почему это важно |
|---|---|---|
| Агрегаторы и часть доков: дефолты `GridPixelSize=8`, `GridSizeZ=128` | В коде **16 и 64**; 8/128 — `ShadowQuality@3` | Агент «возвращает дефолт» и молча включает Epic-профиль (×8 froxel-ов, сотни МБ VRAM) |
| Volumetric Fog подаётся как «эффект»; scalability-документация не упоминает, что он отключается качеством теней | `BaseScalability.ini`, `ShadowQuality@0/1`: `r.VolumetricFog=0` | «Низкие тени» бесплатно убивают все лучи света, и никто не связывает одно с другим |
| Help `r.VolumetricFog.InjectShadowedLightsSeparately`: «Whether to allow the volumetric fog feature» | Текст скопирован от `r.VolumetricFog`, смысл параметра иной | По help-у параметр непознаваем; описания в интернете придуманы |
| Help `r.VolumetricFog.LightFunction.DirectionalLightSupersampleScale`: «Scales the slice depth distribution» | Скопирован от `DepthDistributionScale` | То же самое |
| Help `...ShadowMap.TemporalFiltering.NewFrameWeight`: имя говорит «вес нового кадра» | `1.0` = **фильтр выключен**, и это сказано ниже в том же help | Половина гайдов «включает» фильтр, ставя 1 |
| Документация и все агрегаторы подают `ViewRaySampleMaxCount=768`, `Shadow.ViewRaySampleMaxCount=80`, `ShadowMap.MaxResolution=2048` как рабочие значения | Это **потолки**: `min(база · scale, cvar)`, при дефолтном scale эффективны 96, 10, 512 | Целый класс «оптимизаций», не меняющих ни кадра |
| Epic сам пишет в `BaseScalability.ini` `r.SkyAtmosphere.SampleCountMax=128` (Epic) и 256 (Cine) | При `TraceSampleCountScale=1` эффективно остаётся 32 | Строки **самого Epic** — no-op; копировать их бессмысленно |
| Документация Volumetric Cloud: «тени облаков ложатся на землю» | Карта теней конечна: `CloudShadowExtent` ≈ 10 км вокруг вида, снап 20 км | «Тени только вокруг игрока» и рывки — не баг, а не описанная геометрия карты |
| Документация не описывает `r.VolumetricRenderTarget` вовсе | Режимы 0..3 меняют разрешение трассировки в 16 раз и в режиме 2 ломают пересечение с геометрией | Главная ручка цены облаков не документирована нигде, кроме исходника |
| Cine-пресет подаётся как «максимальное качество» | Он выключает `FastSkyLUT` и `FastApplyOnOpaque` | Переход на Cine в панораме может стоить порядок цены неба — и это нигде не предупреждено |
| Тултип `Volumetric Fog Distance` не поясняет связь с числом слоёв | Слоёв всегда `GridSizeZ`; дальность их только растягивает | «Увеличил дальность — стало хуже» выглядит парадоксом |
| Документация не упоминает, что объёмный туман отсутствует в reflection capture и planar reflections | Так и есть | Часы на поиск несуществующей настройки |
| Документация не упоминает, что плотность объёмного тумана наследуется от `FogDensity` | Наследуется, `VolumetricFogExtinctionScale` — множитель поверх | «Правлю объёмный туман — меняется горизонт» и наоборот |
| В исходнике `[EXPERIMENTAL] Expenssive!`, `AerialPespective...`, `r.SkyAtmosphereASyncCompute` без точки | Так и есть | Грепы и копипасты по «правильным» именам не находят ничего |

---

## Опыт сообщества

**Проверено практикой и подтверждается кодом.**
- Связка «`GridPixelSize` ↓ + `HistoryWeight` ↓» как единственный работающий рецепт против ghosting-а в тумане повторяется независимо в нескольких местах и точно соответствует механизму: шлейф даёт вес истории, а мелкий froxel делает остаток шлейфа менее «пятнистым». Автор Steam-гайда по Silent Hill 2 честно оговаривает, что идеальной комбинации не нашёл и что в отдельных локациях артефакт неустраним — это **пересказ опыта, а не замер**, но он совпадает с формулой (и с арифметикой `(1+w)/(1−w)`: платой за короткий шлейф всегда будет шум).
- «Не опускайте `GridPixelSize` ниже 4» — совпадает с эпиковым Cine-профилем (`ShadowQuality@Cine` ставит ровно 4). Ниже 4 — плотнее, чем кинематографический профиль Epic, цена растёт квадратично, и раньше кадров кончится VRAM.
- `r.VolumetricRenderTarget=0` как «фикс мыльных облаков» действительно работает и действительно стоит примерно ×16 по пикселям трассировки — цена подтверждается таблицей режимов. Аккуратнее делать то же через `Mode=3`.

**Мифы, опровергаемые исходником.**
- **«Дефолт `r.VolumetricFog.GridPixelSize` — 8, `GridSizeZ` — 128».** В коде — **16 и 64**; 8/128 — `ShadowQuality@3`.
- **«Понизьте `r.VolumetricCloud.ViewRaySampleMaxCount` с 768 до 128 — огромный выигрыш».** При дефолтном `ViewSampleCountScale=1` эффективное число уже **96**; выигрыш начинается **строго ниже 96**.
- **«`DistanceToSampleMaxCount` — это дальность прорисовки облаков, снижайте для FPS».** Наоборот: снижение заставляет набирать максимум сэмплов **раньше**, то есть делает облака дороже. Дальность задаётся `TracingMaxDistance`/`TracingStartMaxDistance` компонента.
- **«`r.VolumetricFog=0` уберёт дымку на горизонте».** Не уберёт: объёмный туман кончается на `VolumetricFogDistance` (60 м). Горизонт — это `r.Fog` и аэроперспектива.
- **«`r.VolumetricFog=0` уберёт лучи солнца сквозь листву».** Часто — нет: то, что видно, это **Light Shafts**, отдельная экранная подсистема со своим семейством `r.LightShaft*`.
- **«`r.VolumetricFog` живёт в `sg.EffectsQuality`».** Живёт в **`sg.ShadowQuality`**, уровни 0 и 1 выключают его полностью.
- **«Против дальних ступеней тумана надо понизить `DepthDistributionScale`».** Наоборот: понижение сгущает слои у камеры и **обедняет** дальнюю зону. Дальние ступени лечит **подъём** `S` (и `GridSizeZ`).
- **«`ShadowMap.TemporalFiltering.NewFrameWeight=1` включает темпоральный фильтр».** `1` — **выключено**.
- **«Просто поставьте `r.SkyAtmosphere.SampleCountMax=128 из Epic-профиля».** При `TraceSampleCountScale=1` эффективное значение останется 32 — no-op даже у самого Epic.
- **«Поднимите `ShadowMap.MaxResolution` до 4096, тени облаков станут чёткими».** Потолок выше `512 · CloudShadowMapResolutionScale` не действует. Зато **снижение** ниже 512 действует и экономит квадратично.
- **«Увеличьте `VolumetricFogDistance`, туман станет дальше».** Станет длиннее и грубее: слоёв не прибавится.
- **«Облака дороги, потому что видно небо».** Частично: `ShadowMap`, `SkyAO` и real-time-захват Skylight платятся независимо от того, куда смотрит камера.

---

## Проверено нами

*(Palworld 1.0.3, UE ~5.1, RTX 5070 Ti, Ryzen 7 5700G, 4K, DLSS, панель 144 Гц)*

**1. Панорама упирается в CPU, а не в объёмку.** Замер по полосам частоты: на панораме (25–45 к/с) **CPU busy 28.1 мс против GPU busy 6.2 мс** — игра упирается в **игровой поток**; мир грузится в один поток на Ryzen 7 5700G. Следствие, зафиксированное дословно: **снижение разрешения (DLSS) панораму не лечит**. Для этого раздела вывод жёсткий: любые правки объёмного тумана, облаков и атмосферы на такой сцене двигают загрузку GPU, которая и так не является горлышком.

**2. Сцена крайне неравномерна — средние бессмысленны.** CPU busy p50 = **0.48 мс** против p90 = **36 мс**. Любой замер «до/после» по объёмке, сделанный по среднему FPS, на этой сцене недействителен.

**3. Прибор врёт при генерации кадров.** Открытый Intel PresentMon **не метит кадры DLSS-G** — они приходят как Application. При включённой генерации `MsBetweenPresents` перестаёт показывать базовую частоту (давал «медиану 150 к/с» при лимите 141). База читается только с оверлея NVIDIA. Любой A/B-замер тумана/облаков при включённой FG надо делать по оверлею, иначе разница утонет в артефакте измерения.

**4. `Engine.ini [SystemSettings]` в Palworld доезжает до сцены.** Доказано прибором мода UE4SS, который логирует значение **до** перезаписи: он застал `grass.CullDistanceScale=4.0`, GuardBand 2.0/2.2, `ViewDistanceScale=2.2`, `MaxCSMResolution=1536` — ровно значения ini, которых нет больше нигде. **Но** `foliage.LODDistanceScale` застали равным 2.0 при 4 в ini — отдельные строки игра всё же перебивает. Секции `[ConsoleVariables]` и `[/Script/Engine.RendererSettings]` **ненадёжны**: `r.NGX.DLSS.DilateMotionVectors` лежал там и до сцены не дожил. Для нашего раздела: строки объёмки класть в `[SystemSettings]` и проверять по логу мода, а не верить, что применилось.

**5. Из 1173 присваиваний в нашем `Engine.ini` 764 задают cvar, которого в билде НЕТ.** Вывод класса: **всегда сверять имена со списком зарегистрированных в exe**.

**5а. Ограничения метода дампа — и почему вывод про `r.Fog` всё-таки держится.** `scan-cvars.py` извлекает **максимальные** прогоны печатных символов длиной ≥4, в ASCII и UTF-16. Отсюда два честных ограничения: (а) имена короче 4 символов не ловятся; (б) имя, склеенное в одну строку с другими данными, даёт ложное «нет». Возражение «`r.Fog` короткий, поэтому и не нашёлся» **не проходит**: длина 5 ≥ 4, а строковое пулирование MSVC не сливает `r.Fog` в `r.FogUseDepthBounds` (это префикс, а не суффикс, и нуль-терминатор разделяет литералы). То есть отсутствие `r.Fog` в дампе — сильный аргумент, хотя и не абсолютное доказательство. Проверка, закрывающая вопрос окончательно, — ввести `r.Fog` в живую консоль через UE4SS и посмотреть, отвечает ли она; это не сделано.

**6. Что из этого раздела реально существует в билде Palworld** (по дампу зарегистрированных имён из exe, 4458 имён; переподтверждено в этой ревизии):
- **Есть:** весь блок `r.VolumetricFog.*` (включая `LightFunction.Resolution`, `LightFunction.LightFunctionCount`, `LightFunction.DirectionalLightSupersampleScale`, `VoxelizationSlicesPerGSPass`, `UpsampleJitterMultiplier`, `LightScatteringSampleJitterMultiplier`, `ConservativeDepth`); весь `r.VolumetricCloud.*` включая `HzbCulling`, `EmptySpaceSkipping`, `EmptySpaceSkipping.VolumeDepth`, `SampleMinCount`, `LocalLights.ShadowSampleCount`, `Debug.SampleCountMode`, `ShadowMap.Debug`, `SkyAO.Debug`; весь `r.SkyAtmosphere.*` (включая `FastSkyLUT.DistanceToSampleCountMax` и `SampleCountMin`); `r.VolumetricRenderTarget.*` включая `UvNoiseScale` и `UvNoiseSampleAcceptanceWeight`; `r.FogUseDepthBounds`, `r.VertexFoggingForOpaque`, `r.SkyAtmosphereASyncCompute`, `r.SupportSkyAtmosphere`, `r.SupportSkyAtmosphereAffectsHeightFog`, `r.FastVRam.VolumetricFog`.
- **Есть и в конспекте прежде отсутствовало** (найдено в этой ревизии): всё семейство `r.LightShaft*` (`Quality`, `DownSampleFactor`, `BlurPasses`, `NumSamples`, `FirstPassDistance`, `AllowTAA`, `RenderToSeparateTranslucency`); `r.SkyLight.RealTimeReflectionCapture` + `.TimeSlice`, `.DepthBuffer`, `.ShadowFromOpaque`; `r.SupportCloudShadowOnForwardLitTranslucent`; `r.Water.SingleLayerWater.SupportCloudShadow`; всё семейство `r.HeterogeneousVolumes.*` (20 имён).
- **НЕТ:** **`r.Fog`** (!), `r.VolumetricFog.InjectRaytracedLights`, `r.VolumetricCloud.EmptySpaceSkipping.SampleCorners`, `r.VolumetricCloud.EmptySpaceSkipping.StartTracingSliceBias`, `r.VolumetricRenderTarget.MinimumDistanceKmToEnableReprojection`, `r.VolumetricRenderTarget.Scale`, `r.SkyAtmosphere.AerialPerspective.StartDepth`, `r.LocalFogVolume.Render`, а также две строки из нашего же ini: **`r.EnableAsyncComputeVolumetricFog`** и **`r.FogDensityVolumes.Parallel`** — обе мертвы.
- **Уточнение к трактовке отсутствий:** `EmptySpaceSkipping.SampleCorners`, `StartTracingSliceBias`, `MinimumDistanceKmToEnableReprojection`, `AerialPerspective.StartDepth` — параметры 5.2+, а `r.LocalFogVolume.*` — 5.4+. Их отсутствие в 5.1-билде **ожидаемо** и не является особенностью Palworld. Особенность Palworld — только `r.Fog` и `r.VolumetricFog.InjectRaytracedLights`.
- Отдельно зафиксировано в аудите Pareto дословно: «`r.Fog` — не зарегистрирован, закомментированная строка 1358 не сработала бы и после раскомментирования». План «убрать горизонтную дымку через `r.Fog=0`» в Palworld нереализуем через cvar; остаются свойства компонента (только модом/правкой ассета) и `showflag.Fog 0` через инжектор.

**7. Наши собственные строки объёмки в `Engine.ini` — почти все no-op.** `r.VolumetricFog.GridPixelSize=16` равно C++-дефолту; `r.VolumetricFog.Jitter=1` и `r.VolumetricFog.InjectShadowedLightsSeparately=1` тоже равны дефолтам. При этом ниже по файлу стоит `r.VolumetricFog=0` и `sg.ShadowQuality=1` — а по эпиковому `BaseScalability.ini` уровень `ShadowQuality@1` **сам выключает** объёмный туман. То есть три строки настройки тумана применяются к выключенной подсистеме, причём выключенной дважды. *(Статический разбор наших артефактов, не замер; у игры может быть свой `Scalability.ini`, это не проверялось.)*

**8. Объёмный туман входил в «пакет из шести дорогих строк», но отдельно не измерен.** Из аудита дословно: обратный эксперимент (Ultra Graphics 1.2.2 перебил 26 строк тюнинга, средний FPS упал со 120 до 80; после разбора находок поштучно владелец намерил 100–130 против 80) менял одновременно `InstanceCulling.OcclusionCull`, `HierarchicalScreenTraces.MaxIterations`, `ViewDistanceScale`, `LandscapeLOD*`, `TracingOctahedronResolution` **и `VolumetricFog`**. Честная формулировка: **пакет из шести строк стоит ~40 FPS на этой сцене**; вклад именно тумана **не измерен**. Методика «менять строго по одному пункту» здесь осталась невыполненной — и остаётся первым кандидатом на следующую сессию с `stat gpu`.

**9. Общий урок, переносимый на этот раздел (из соседних подсистем).** Расчёт по числу лучей систематически завышает выигрыш, когда в тракте есть клэмп: `r.Lumen.ScreenProbeGather.TracingOctahedronResolution` 8→16 стоил ~**0.3 мс**, а не «больше половины выигрыша», как давал расчёт — причина в клэмпе по `sqrt(PostProcessVolume.LumenFinalGatherQuality)`. В объёмке клэмпов ровно того же вида **шесть** (`96·scale`, `10·scale`, `16·scale`, `512·scale` дважды — тени и AO, `32·scale`), поэтому любой расчёт «во сколько раз подешевеет» здесь надо сначала проверять на то, достигается ли потолок вообще — прибором `r.VolumetricCloud.Debug.SampleCountMode` и счётчиками `stat gpu`.

**Чего мы НЕ проверяли и не должны утверждать:** ни один симптом из таблицы «Симптом → причина» на нашей машине не воспроизводился; цена объёмного тумана, облаков и атмосферы по отдельности в миллисекундах не снята ни разу; собственный `Scalability.ini` Palworld не извлекался; живой опрос cvar-ов через консоль игры не делался.

---

## Источники

**Исходники UE (высший приоритет).** Публичное зеркало `EpicGames/UnrealEngine` (сам репозиторий закрыт), версия **5.3.2**, сверено с 4.26 и 5.5.2:
- `Engine/Source/Runtime/Renderer/Private/VolumetricFog.cpp` — дефолты, `GetVolumetricFogGridSize`, `GetVolumetricFogGridZParams`, клэмпы истории.
- `Engine/Source/Runtime/Renderer/Private/VolumetricFogVoxelization.cpp`, `VolumetricFogLightFunction.cpp` — `VoxelizationSlicesPerGSPass=8`, `LightFunction.Resolution=128`, `LightFunctionCount=16`, `DirectionalLightSupersampleScale=2`, тракт материалов домена `Volume`.
- `Engine/Source/Runtime/Renderer/Private/FogRendering.cpp` — `r.Fog=1`, `r.FogUseDepthBounds=true`, `r.VolumetricFog.UpsampleJitterMultiplier=0`.
- `Engine/Source/Runtime/Renderer/Private/VolumetricCloudRendering.cpp` — все дефолты облаков, формулы `SampleCountMax`, разрешений карт теней/AO, горизонтного множителя, снапа.
- `Engine/Source/Runtime/Renderer/Private/VolumetricRenderTarget.cpp` — режимы и коэффициенты понижения разрешения.
- `Engine/Source/Runtime/Renderer/Private/SkyAtmosphereRendering.cpp` — все дефолты атмосферы, `SkyAtmosphereBaseSampleCount=32`, слои аэроперспективы.
- `Engine/Source/Runtime/Renderer/Private/LightShaftRendering.cpp` — семейство `r.LightShaft*` (соседняя подсистема, которую путают с объёмным туманом).
- `Engine/Shaders/Private/VolumetricCloud.usf` — формула `IStepCount`.
- `Engine/Shaders/Private/VolumetricFog.usf` — путь `HistoryMissSuperSampleCount`.
- `Engine/Source/Runtime/Engine/Classes/Components/VolumetricCloudComponent.h`, `SkyAtmosphereComponent.h`, `ExponentialHeightFogComponent.h` — `BaseViewRaySampleCount=96`, `BaseShadowRaySampleCount=10`, `TraceSampleCountScale`, клэмпы ползунков.
- `Engine/Source/Runtime/Engine/Private/Components/VolumetricCloudComponent.cpp`, `HeightFogComponent.cpp`, `SkyAtmosphereComponent.cpp`, `LightComponent.cpp`, `SkyLightComponent.cpp` — конструкторы с дефолтами компонентов, свойства облачных теней и AO на свете и Skylight.
- `Engine/Source/Runtime/Core/Public/HAL/IConsoleManager.h` — лестница `ECVF_SetBy*`.
- `Engine/Config/BaseScalability.ini` — блоки `[ShadowQuality@0..Cine]` (объёмный туман!) и `[EffectsQuality@0..Cine]` (атмосфера); отсутствие в нём `r.Fog`, `r.VolumetricCloud.*`, `r.VolumetricRenderTarget.*`.

**Документация Epic.**
- [Volumetric Fog in Unreal Engine](https://dev.epicgames.com/documentation/en-us/unreal-engine/volumetric-fog-in-unreal-engine)
- [Volumetric Cloud Component in Unreal Engine](https://dev.epicgames.com/documentation/unreal-engine/volumetric-cloud-component-in-unreal-engine)
- [Sky Atmosphere Component](https://dev.epicgames.com/documentation/en-us/unreal-engine/sky-atmosphere-component-in-unreal-engine)
- [Exponential Height Fog](https://dev.epicgames.com/documentation/en-us/unreal-engine/exponential-height-fog-in-unreal-engine)

**Агрегаторы cvar-ов (использовать с осторожностью — расходятся с кодом по дефолтам).**
- [UE 5.4.4 Setting & CVar Wiki — r.VolumetricFog](https://indxzero.github.io/ue544cvarwiki/articles/r.volumetricfog/), [r.VolumetricCloud](https://indxzero.github.io/ue544cvarwiki/articles/r.volumetriccloud/)
- [Unreal Directive — r.VolumetricFog.GridPixelSize](https://unrealdirective.com/resources/console-variables/r-volumetricfog-gridpixelsize/), [r.VolumetricFog.GridSizeZ](https://unrealdirective.com/resources/console-variables/r-volumetricfog-gridsizez/) — **приводят 8/128 как дефолты, это значения scalability, а не кода.**

**Сообщество (пересказ опыта, не замеры).**
- [Steam Guide: Improving Fog Quality + Reducing Ghosting](https://steamcommunity.com/sharedfiles/filedetails/?id=3417952221) — пресеты `GridSizeZ`/`GridPixelSize`/`HistoryWeight`; автор прямо оговаривает, что идеальной комбинации не нашёл.
- [Epic Forums: UE5 Sky Volumetric Lighting Ghosting](https://forums.unrealengine.com/t/ue5-sky-volumetric-lighting-ghosting-any-solution/1283444), [Help with strange artifacting/lag on Volumetric Fog](https://forums.unrealengine.com/t/help-with-strange-artifacting-lag-on-volumetric-fog/1877024)

**Наши артефакты (первичные данные).**
- `D:\work\ai_sandbox\Palworld\_config\cvars-registered.txt` — 4458 имён, извлечённых из shipping-exe Palworld. Метод и его границы — `scan-cvars.py` (максимальные прогоны печатных символов ≥4, ASCII и UTF-16); разбор ложных «нет» — «Проверено нами», п. 5а.
- `D:\work\ai_sandbox\Palworld\_config\scan-cvars.py` — сам сканер (нужен, чтобы оценивать силу вывода «имени нет»).
- `D:\work\ai_sandbox\Palworld\_config\check-live-cvars.py` — заготовка живого опроса cvar-ов; именно ею закрывается остаточное сомнение по `r.Fog`.
- `D:\work\ai_sandbox\Palworld\_config\Pareto-audit.md` — вывод про незарегистрированный `r.Fog`, разбор пакета из шести строк.
- `D:\work\ai_sandbox\Palworld\_config\Krinik-Palworld-UE5-Engine.ini` — строки 105, 204, 317, 406–408, 1126–1131.
- `D:\work\ai_sandbox\Palworld\_config\Latency-and-FrameGen-audit.md` — методика замеров и артефакты PresentMon при DLSS-G.