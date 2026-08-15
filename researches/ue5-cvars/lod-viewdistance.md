# LOD, дальность вида и Nanite

> **Источник формул и дефолтов** — исходники UE **5.5.4** (публичное зеркало `Cyberyb/KuUE5.5`, `Engine/Build/Build.version` = 5.5.4; официальный `EpicGames/UnrealEngine` требует авторизации). Пути к файлам даны от `Engine/Source/Runtime/`.
>
> **Легенда происхождения каждого факта** (введена, потому что в первой редакции раздела всё было свалено в одну кучу «из исходников», хотя часть значений на деле бралась из машинного дампа другой версии):
>
> * `[код]` — прочитано в исходниках 5.5.4, строка указана.
> * `[дамп 5.4.4]` — дефолт и флаги из машинно извлечённого дампа cvar-ов UE **5.4.4** (`indxzero.github.io/ue544cvarwiki`). Между 5.4.4 и 5.5.4 дефолты могли поменяться — если значение критично, сверяйте в своём билде.
> * `[Epic]` — из документации Epic (цитата).
> * `[вывод]` — следствие из выписанной здесь формулы; отдельным замером не проверялось.
> * `[?]` — **не сверено**, помечено сознательно. Не переносите такие значения в ini как факт.
>
> **Дрейф версий — читать до всего остального.** Раздел описывает 5.5.4, дефолты частично из 5.4.4, а собственные замеры (блок «Проверено нами») сделаны на **Palworld, UE ~5.1**. Это три разных движка. Конкретно для 5.1 заведомо неверны или отсутствуют: `r.Nanite.Streaming.QualityScale.*` (автоскейлер качества стриминга Nanite — поздняя добавка, в 5.1 его нет `[?]`), `r.Nanite.DicingRate` и тесселяция Nanite (5.4+), `landscape.RenderNanite` (появился позже 5.1 `[?]`), часть `wp.Runtime.HLOD.Warmup*`. **Прежде чем объяснять замер на 5.1 формулой из 5.5.4, проверьте, что механизм в 5.1 вообще существует** — иначе получится красивое объяснение несуществующей связи.

## Что это и когда сюда лезть

Подсистема отвечает на один вопрос: **сколько геометрии доедет до растеризатора**. Она состоит из **семи** независимых трактов (в первой редакции их было названо четыре — этого мало, и именно из-за недосчитанных трактов возникает большая часть «cvar не работает»):

1. **Дистанционный кулинг примитивов** — `MaxDrawDistance`/`MinDrawDistance` умножаются на `r.ViewDistanceScale` (+ FOV-множитель).
2. **Дискретный LOD статик-мешей** — сравнение экранного радиуса с порогами `ScreenSize[LOD]`, масштабируемыми `r.StaticMeshLODDistanceScale` и FOV.
3. **Скелетные меши** — свой тракт (`r.SkeletalMeshLODBias`, `r.SkeletalMeshLODRadiusScale`), плюс сцепка с частотой обновления анимации.
4. **Ландшафт** — геометрическая прогрессия по `LOD0DistributionSetting`/`LODDistributionSetting`.
5. **Nanite** — LOD-ов нет, есть выбор кластеров по целевой длине ребра в пикселях (`r.Nanite.MaxPixelsPerEdge`) плюс **жёсткие потолки буферов кластеров**, при переполнении которых геометрия просто пропадает.
6. **HLOD** — свой конечный автомат с собственными дистанциями, который **не слушает** `r.ViewDistanceScale`.
7. **Инстансы / фолиаж / трава** (ISM, HISM, LandscapeGrass) — отдельные множители `foliage.LODDistanceScale`, `foliage.MinimumScreenSize`, `grass.CullDistanceScale`.

Плюс **теневой проход**, у которого свои пороги отсечения мелочи (`r.MinScreenRadiusForCSMDepth`, `r.Shadow.RadiusThreshold`) и свой `r.ForceLODShadow`. Формально это соседний раздел, но симптом «объект есть, тени от него нет» ловится именно здесь.

Сюда лезут, когда видно: объекты «выпрыгивают» из ниоткуда на фиксированной дистанции (это дистанционный кулинг, не LOD); модель на среднем плане заметно грубеет/дёргается силуэтом при движении камеры (переключение LOD); земля вдали превращается в грубые треугольники и «дышит» при движении (ландшафтный LOD); мелкая листва/детали Nanite «плавятся» в кашу на расстоянии (MaxPixelsPerEdge либо переполнение стримингового пула); куски Nanite-геометрии **мигают или исчезают целиком** в плотных сценах (переполнение буферов кластеров — это НЕ то же самое, что «плавятся»); дальние здания подменяются одним слепленным мешем (HLOD).

Обратный случай — когда нужно вернуть кадры: это самый дешёвый по риску артефактов рычаг после теней, но он бьёт по **игровому потоку и CPU-стороне рендера** (кулинг, relevance, число видимых примитивов), а не только по GPU.

Главная ловушка раздела в том, что тракты перекрываются частично и в разных направлениях: `r.StaticMeshLODDistanceScale` действует на статик-меши **и на Nanite**, но у ландшафта **намеренно сокращается** делением; `r.ViewDistanceScale` не действует на LOD вообще и не действует на примитивы без заданной cull distance; `r.ViewDistanceScale.SecondaryScale` по умолчанию **не работает вовсе** без второго cvar-а; FOV камеры молча множит все пороги LOD статик-мешей, Nanite и ландшафта, но **не** скелетников; а `Cull Distance Volume` на уровне молча **затирает** ваш `Max Draw Distance` у компонента ещё до того, как любой cvar что-то умножит. Ниже эти связи выписаны формулами.

---

## Таблица параметров

### A. Семейство `r.ViewDistanceScale` (дистанционный кулинг примитивов)

Объявлены в `Core/Private/HAL/ConsoleManager.cpp`, потребляются в `Engine/Private/UnrealEngine.cpp::ScalabilityCVarsSinkCallback()` и `Renderer/Private/SceneVisibility.cpp` `[код]`.

| cvar | дефолт | единица/шкала | что делает | цена | ловушки |
|---|---|---|---|---|---|
| `r.ViewDistanceScale` | `1.0` `[дамп 5.4.4]` | множитель дистанции; клэмп только снизу `Max(x, 0)` | Умножает `MaxCullDistance` **и `MinDrawDistance`** каждого примитива при фрустум-кулинге | Растёт число видимых примитивов → CPU relevance + draw calls; на нашей сцене это удар по игровому потоку, не по GPU | Действует **только** на примитивы, у которых cull distance задан (`MaxCullDistance < FLT_MAX`). На меши без Max Draw Distance не действует вообще. `0` = мир исчезает. Верхнего клэмпа нет. Флаги `ECVF_Scalability \| ECVF_RenderThreadSafe` `[дамп 5.4.4]`. **Отдельная ловушка: тем же множителем растёт `MinDrawDistance`** — подняв масштаб до 2.2, вы вдвое отодвигаете и *ближнюю* границу у тех примитивов, у кого она задана (типично — прокси/замещающие меши), и получаете дыру вблизи |
| `r.ViewDistanceScale.SecondaryScale` | `1.0` | множитель | Второй множитель поверх первого | — | **Игнорируется, пока `ApplySecondaryScale=0`** (дефолт). Самый частый холостой выстрел в этом семействе |
| `r.ViewDistanceScale.ApplySecondaryScale` | `0` | bool | Включает применение SecondaryScale | — | `ECVF_RenderThreadSafe` без `ECVF_Scalability` — из `Scalability.ini` не ставится |
| `r.ViewDistanceScale.FieldOfViewMinAngle` | `45.0` | градусы, клэмп `0..360` | Нижняя граница диапазона смешивания по FOV | — | Работает только при `MinAngleScale != MaxAngleScale` |
| `r.ViewDistanceScale.FieldOfViewMinAngleScale` | `1.0` | множитель, `Max(x,0)` | Значение множителя при FOV ≤ MinAngle | — | — |
| `r.ViewDistanceScale.FieldOfViewMaxAngle` | `90.0` | градусы, клэмп `0..360` | Верхняя граница диапазона | — | — |
| `r.ViewDistanceScale.FieldOfViewMaxAngleScale` | `1.0` | множитель, `Max(x,0)` | Значение при FOV ≥ MaxAngle; **и возвращаемое значение, когда Min==Max** | — | Если поднять только его, а MinAngleScale оставить 1.0 — получится плавная зависимость от FOV, а не константа. Чтобы получить глобальную константу, ставят **оба** Scale одинаковыми |
| `r.ViewDistanceScale.FieldOfViewAffectsHLOD` | `0` | bool | Распространяет FOV-множитель на дистанции переходов HLOD | — | По умолчанию `HLODState.FOVDistanceScaleSq = 1` — HLOD не реагирует на FOV |
| `r.ViewDistanceScale.SkeletalMeshOverlay` | `1.0` | множитель, `Max(x,0)` | Дальность рисования overlay-материала скелетных мешей | — | Итог **домножается** на `ViewDistanceScale` (см. формулы). К самому LOD скелетника отношения не имеет |

**Не-cvar, который бьёт сильнее всех cvar-ов этого семейства** (пропущено в первой редакции):

| сущность | где живёт | что делает | ловушка |
|---|---|---|---|
| `Cull Distance Volume` (`ACullDistanceVolume`) | актор на уровне; применяется в `UWorld::UpdateCullDistanceVolumes()` `[код, точные строки не выписаны]` | Пробегает компоненты внутри объёма и **перезаписывает** `CachedMaxDrawDistance` по таблице «размер объекта → дистанция» | Ваш `Desired Max Draw Distance` на компоненте после этого не значит ничего. Иммунитет даёт только `bAllowCullDistanceVolume = false` на компоненте. Проверка: `Max Draw Distance` в деталях компонента и фактическая дистанция исчезновения расходятся, а `r.ViewDistanceScale` при этом **работает** (он умножает уже перезаписанное значение) |
| `PrimitiveComponent::LDMaxDrawDistance` vs `CachedMaxDrawDistance` | `Engine/Classes/Components/PrimitiveComponent.h` | Первое — то, что вы задали; второе — то, что реально уезжает в `FPrimitiveSceneProxy` | Cvar множит **второе** |

### B. Статик-меши: дискретный LOD и сопутствующее

| cvar | дефолт | единица/шкала | что делает | цена | ловушки |
|---|---|---|---|---|---|
| `r.StaticMeshLODDistanceScale` | `1.0` `[дамп 5.4.4]` | множитель порога `ScreenSize`; клэмпа нет | Множит пороги переключения LOD. `2` = переход вдвое ближе, `0.5` = вдвое дальше | **Замерено нами: 1 → 0.1 стоит 0.1–0.3 мс** (см. оговорки в «Проверено нами») | Действует **и на Nanite** (через `ScreenMultiple`), но у **ландшафта сокращается** (см. формулы). Направление обратное интуиции: больше значение = хуже картинка. `ECVF_Scalability \| ECVF_RenderThreadSafe` `[дамп 5.4.4]`, объявлен в `Renderer/Private/SceneVisibility.cpp:150`. **Значение `0` — мина:** в ландшафтном тракте оно попадает в знаменатель (`Ratio = LOD0ScreenSize / scale`) `[вывод]` |
| `r.CalcLocalPlayerCachedLODDistanceFactor` | `1` | bool | Считать ли `View.LODDistanceFactor = FOV / DefaultFOV` | — | Ставя `0`, вы замораживаете LOD-пороги от изменений FOV (прицел, спринт, транспорт). Комментарий Epic в коде: «Should not be necessary since LOD is already based on screen size» — это легаси-двойная компенсация |
| `r.ForceLOD` | `-1` | индекс LOD, `-1` = выкл | Принудительный LOD для всех статик-мешей | диагностика | `EXPOSE_FORCE_LOD = !(UE_BUILD_SHIPPING \|\| UE_BUILD_TEST) \|\| WITH_EDITOR` — **в шипящей игре cvar-а не существует**. Ещё: **на Nanite, скелетники и ландшафт не действует** — у них свои `ForcedLodModel` / `ForcedLOD` |
| `r.ForceLODShadow` | `-1` | индекс LOD | То же, только для теневых проходов | диагностика | Та же оговорка про Shipping. Существование отдельного cvar-а — прямое доказательство того, что **LOD в теневом проходе выбирается отдельно от основного** |
| `r.MinScreenRadiusForDepthPrepass` | `0.03` `[дамп 5.4.4]`, `ECVF_RenderThreadSafe` | доля экрана (радиус) | Ниже порога меш выкидывается из depth prepass | + перерисовка | Поднимать = мелочь теряет ранний Z, а не исчезает. Слишком агрессивно — теряются крупные окклюдеры и растёт overdraw |
| `r.MinScreenRadiusForCSMDepth` | `0.01` `[дамп 5.4.4]`, `ECVF_RenderThreadSafe` | доля экрана | Ниже порога меш выкидывается из **CSM depth** | GPU ↓ | **Пропущено в первой редакции.** Это ответ на симптом «объект видно, тени от него на среднем плане нет» |
| `r.MinScreenRadiusForLights` | `0.03` | доля экрана | Отсечение мелких источников света | — | Соседний тракт, но тот же принцип «экранный радиус» |
| `r.LODFadeTime` | `0.25` | секунды | Длительность dithered-перехода LOD/кулинга | — | **Сам по себе не даёт плавности.** Дизеринг рисуется только если материал умеет его принять (`bDitheredLODTransition` / нода `Dither Temporal AA`) и включён TAA/TSR. С выключенным темпоральным сглаживанием вы увидите не растворение, а сетку из дырок `[вывод]` |
| `r.DistanceFadeMaxTravel` | `1000.0` | UU | Ширина полосы затухания за `MaxDrawDistance` | — | Объект живёт до `MaxDrawDistance*Scale + 1000`, поэтому «фактическая» дистанция всегда чуть больше расчётной |
| `r.DisableLODFade` | `0` | bool | Отключает затухание (FadeRadius = 0) | — | Включение даёт жёсткий поп-ин вместо растворения |

**Свойства ассета, без которых cvar-ы этого блока необъяснимы** (пропущены в первой редакции):

| свойство | где | что делает | ловушка |
|---|---|---|---|
| `LODScreenSize[i]` («Screen Size» в редакторе LOD) | `UStaticMesh` → `FStaticMeshSourceModel` | Порог, с которым сравнивается экранный радиус | Это **диаметр** проекции ограничивающей сферы, а не доля площади и не пиксели. Сравнение в коде идёт как `Square(ScreenSize*0.5) >= ScreenRadiusSq`, то есть радиус против радиуса |
| `bAutoComputeLODScreenSize` («Auto Compute LOD Distances») | `UStaticMesh` | Пересчитывает `ScreenSize` автоматически | **Пока включено, ваши ручные значения ScreenSize игнорируются.** Первое, что надо смотреть, когда «правка порогов ничего не дала» |
| `MinLOD` / `PerPlatformMinLOD` | `UStaticMesh`, `USkeletalMesh` | Нижняя граница индекса LOD на платформе | Поднимает пол независимо от всех cvar-ов; LOD0 может быть недостижим по построению |
| `r.StaticMesh.MinLodQualityLevel` / `r.SkeletalMesh.MinLodQualityLevel` | cvar, дефолт `-1` `[?]` | Выбор `MinLOD` по уровню качества, если ассет переведён на quality-level MinLOD | Существует в 5.x, но проект должен быть переключён на quality-level-схему; иначе не действует |

### C. Скелетные меши

`Engine/Private/SkeletalRender.cpp::FSkeletalMeshObject::UpdateMinDesiredLODLevel`, `Engine/Private/Components/SkinnedMeshComponent.cpp:4193` `[код]`.

| cvar | дефолт | единица/шкала | что делает | цена | ловушки |
|---|---|---|---|---|---|
| `r.SkeletalMeshLODBias` | `0`, `ECVF_Scalability` `[дамп 5.4.4]` | целое смещение индекса LOD | **Прибавляется** к вычисленному LOD | дёшево | Положительное = **хуже** качество (индекс LOD растёт = детализация падает). Справка Epic в коде нейтральна: «LOD bias for skeletal meshes (does not affect animation editor viewports)». Сопроводительная проза cvar-агрегаторов утверждает обратное («Positive values force higher-quality LODs») — **это прямая ошибка**, см. раздел про заблуждения. Контрольная проверка: `BaseScalability.ini` ставит `2` на самом низком качестве и `0` на высоком |
| `r.SkeletalMeshLODRadiusScale` | `1.0`, **клэмп `0.25 … 1.0`** `[код]` | множитель экранного радиуса, в квадрате | Множит экранный радиус перед сравнением с порогами | — | Значения **> 1 не работают**: клэмп режет. Улучшить LOD скелетников этим cvar-ом нельзя, только ухудшить |

Скелетный тракт **не использует** `View.LODDistanceFactor` и **не использует** `r.StaticMeshLODDistanceScale`. Он единственный учитывает `LODHysteresis` из ассета (при переходе на более детальный LOD порог поднимается на величину гистерезиса).

**Сцепка, о которой почти никто не знает** (пропущена в первой редакции): предсказанный LOD скелетника — это ещё и **вход в Update Rate Optimization**. `FAnimUpdateRateParameters` выбирает, сколько кадров пропустить, по таблице `LODToFrameSkipMap`, индексированной предсказанным LOD `[код, `Engine/Private/Animation/AnimUpdateRateManager.cpp` — механизм сверен, строки не выписаны]`. Следствия:

* `r.SkeletalMeshLODBias=2` экономит **не только треугольники, но и CPU на анимации** — дальние персонажи начинают обновляться реже. Это объясняет, почему на CPU-bound сцене этот cvar даёт больше, чем предсказывает подсчёт треугольников.
* И наоборот: `r.SkeletalMeshLODBias=0` ради «красивых NPC» возвращает не только геометрию, но и полную частоту анимации — цена ложится на игровой поток, а не на GPU.

**Порядок перекрытия для скелетника** (полная цепочка): `ForcedLodModel` (компонент, Blueprint) → LOD ведущего компонента (`LeaderPose`) → расчёт + `GSkeletalMeshLODBias` → подъём до `MinLodIndex` ассета/платформы → подъём до текущего стримингового LOD. Cvar в этой цепочке — **самое слабое звено**: любой `ForcedLodModel` в блюпринте его обнуляет.

### D. Ландшафт

`Landscape/Private/LandscapeRender.cpp`. Свойства — `Landscape/Classes/LandscapeProxy.h` `[код]`.

| cvar / свойство | дефолт | единица/шкала | что делает | цена | ловушки |
|---|---|---|---|---|---|
| `r.LandscapeLODDistributionScale` | `1.0` | множитель свойства `LODDistributionSetting` | Управляет знаменателем геометрической прогрессии для LOD ≥ 1 | Больше = плотнее сетка вдали = больше вершин/треугольников | Направление **обратное** статик-мешам: больше значение = LOD-ы дальше = лучше. Внизу стоит `Max(x, 1.01)`: занизив до `<1/3`, вы упираетесь в пол `1.01` и получаете почти неубывающую прогрессию (LOD0 «навсегда») — катастрофа по производительности, а не экономия. `ECVF_Scalability` |
| `r.LandscapeLOD0DistributionScale` | `1.0` | множитель свойства `LOD0DistributionSetting` | Только переход LOD0 → LOD1 | — | Тот же пол `Max(x, 1.01)` |
| `ALandscapeProxy::LOD0ScreenSize` | `0.5` | экранный размер (диаметр), UI-клэмп `0.1..10` | Стартовая точка прогрессии | — | Cvar-а для него в релизной сборке нет |
| `ALandscapeProxy::LOD0DistributionSetting` | `1.25` | UI-клэмп `1..10` | Знаменатель для LOD0→LOD1 | — | — |
| `ALandscapeProxy::LODDistributionSetting` | `3.0` | UI-клэмп `1..10` | Знаменатель для остальных LOD | — | — |
| `ALandscapeProxy::LODBlendRange` | `[?]` — **не сверено**, в первой редакции дефолт вообще не назван | доля LOD | Ширина морфинга между соседними LOD | — | Именно это свойство подменяет `landscape.OverrideLODBlendRange`. Если у вас «ландшафт дышит/плывёт», а прогрессия в порядке — смотреть сюда |
| `ALandscapeProxy::MaxLODLevel` | `-1` (без ограничения) `[?]` | индекс | Потолок LOD | — | При `>= 0` обрезает прогрессию сверху раньше, чем сработают cvar-ы |
| `ALandscapeProxy::bUseScalableLODSettings` | `false` | bool | Переключает на `ScalableLOD*` (по `sg.LandscapeQuality`) | — | **Если включено, оба cvar-а `r.Landscape*DistributionScale` полностью игнорируются** (ветка `if (Proxy->bUseScalableLODSettings)`). Это первое, что надо проверять, когда cvar «не действует» |
| `landscape.OverrideLOD0ScreenSize` | `-1.0` | абсолютное значение при `>0` | Жёсткая замена свойства на всех ландшафтах | — | `ECVF_Cheat` **и** `#if !UE_BUILD_SHIPPING` — в шипящей игре не существует; из `[SystemSettings]` не ставится даже в dev-сборке (чит-флаг) |
| `landscape.OverrideLOD0Distribution` | `-1.0` | абсолютное при `>0` | Замена `LOD0DistributionSetting`, **игнорирует** `r.LandscapeLOD0DistributionScale` | — | То же |
| `landscape.OverrideLODDistribution` | `-1.0` | абсолютное при `>0` | Замена `LODDistributionSetting`, **игнорирует** `r.LandscapeLODDistributionScale` | — | То же |
| `landscape.OverrideLODBlendRange` | `-1.0` | при `>0` | Замена `LODBlendRange` | — | То же |
| `landscape.RenderNanite` | `1` | bool | Рисовать ландшафт через Nanite | — | `ECVF_Scalability \| ECVF_RenderThreadSafe`. **При `1` вся таблица выше становится неактуальной**: детализацией правит `r.Nanite.MaxPixelsPerEdge`, а не `r.Landscape*DistributionScale`. Причём ландшафт в этом режиме перестаёт быть иммунным к `r.StaticMeshLODDistanceScale` — он уходит в Nanite-тракт, где этот cvar как раз действует `[вывод]`. Требует, чтобы ландшафт был собран с Nanite-данными; иначе тихий фолбэк на обычный тракт |
| `r.LandscapeUseAsyncTasksForLODComputation` | `1` | bool | Считать LOD-биасы компонентов в async-задачах | CPU | Выключение переносит работу на рендер-поток |
| `r.AllowLandscapeShadows` | `1` | bool | Тени от ландшафта | GPU | Соседний тракт |
| `landscape.DumpLODs` | — | команда | Дамп текущих LOD и статуса стриминга | диагностика | Лучший способ проверить, что правка вообще доехала |

### E. Nanite

`Renderer/Private/Nanite/NaniteCullRaster.cpp`, `NaniteShared.cpp`, `Engine/Private/Rendering/NaniteStreamingManager.cpp`, `Engine/Private/StaticMeshRender.cpp` `[код]`.

| cvar | дефолт | единица/шкала | что делает | цена | ловушки |
|---|---|---|---|---|---|
| `r.Nanite` | `1` | bool | Рисовать статик-меши через Nanite | — | `ECVF_Scalability`, дёргает пересоздание всех рендер-стейтов |
| `r.Nanite.ProxyRenderMode` | `0` | 0/1/2 | Что делать, если Nanite не поддержан: 0 — фолбэк на прокси-меш, 1 — не рисовать, 2 — не рисовать кроме редактора | — | При `1` «пропавшая геометрия» — это не кулинг. **И отдельно:** прокси-меш (fallback) — это НЕ цепочка LOD исходного ассета, а один меш, сгенерированный по `Fallback Relative Error`. Выключив Nanite, вы получаете не «старые LOD-ы», а один грубый меш |
| `r.Nanite.MaxPixelsPerEdge` | `1.0`, флаги **`ECVF_RenderThreadSafe` (без `ECVF_Scalability`)** `[дамп 5.4.4]` | длина ребра треугольника в **пикселях рендера** | Целевая детализация кластеров | Триангуляция ~ 1/значение², но **с насыщением** (см. ниже) | Три ловушки. (1) Пиксели **рендер-разрешения**, не выходного; автокомпенсация апскейла есть, но только для `TemporalUpscale` и с потолком ×4. (2) **Флага `ECVF_Scalability` нет → из `Scalability.ini` этот cvar не ставится**, попытка даёт `ensureMsgf` и отбрасывается. Многочисленные гайды «добавьте r.Nanite.MaxPixelsPerEdge в Scalability.ini» на этом ломаются; рабочие места — `[SystemSettings]`, DeviceProfiles, консоль. (3) Справка Epic говорит «the triangle edge length that the Nanite runtime targets» — на деле это **оценка сверху на уровне группы кластеров**, а не гарантия на каждый треугольник: отдельные треугольники бывают заметно крупнее и мельче цели |
| `r.Nanite.MinPixelsPerEdgeHW` | `32.0` | пиксели | Порог перехода на аппаратный растеризатор | Смена баланса SW/HW-растр | Снижение = больше треугольников через HW-путь |
| `r.Nanite.ImposterMaxPixels` | `5` | пиксели | Максимальный размер импостера | — | Работает вместе с `r.Nanite.Streaming.Imposters` |
| `r.Nanite.DicingRate` | `2.0` `[дамп/форум, в 5.5.4 построчно не сверено]` | пиксели | Размер микрополигонов при тесселяции Nanite | Очень дорого при снижении | `InvDiceRate = MaxPixelsPerEdge / DicingRate` — эти два cvar-а связаны. **Тесселяция Nanite появилась в 5.4** — в билдах 5.1–5.3 cvar-а нет |
| `r.Nanite.ViewMeshLODBias.Enable` | `1` | bool | Компенсировать временной апскейл (TSR/DLSS) сдвигом детализации | — | Работает **только** если `View.PrimaryScreenPercentageMethod == TemporalUpscale` |
| `r.Nanite.ViewMeshLODBias.Offset` | `0.0` | LOD-смещение, применяется как `Exp2(-Offset)` | Ручной сдвиг детализации при апскейле | +Offset дешевле | Экспонента: `Offset=1000` даёт `LODScaleFactor = 0` → `MaxPixelsPerEdgeMultipler = 1/0` → вся геометрия сваливается в корневые кластеры («картофель-мод» из форумов ARK) |
| `r.Nanite.ViewMeshLODBias.Min` | `-2.0` | LOD-смещение, потолок как `Exp2(-Min)` | Потолок компенсации: `-2` → максимум ×4 | — | Именно этот потолок ограничивает компенсацию DLSS Ultra Performance (×3 по стороне влезает, ×4 — впритык). Игры шлют сюда свои значения: S.T.A.L.K.E.R. 2 — `-2.8`, Lords of the Fallen — `-0.4151`/`-0.5670` в пресетах |
| **`r.Nanite.MaxCandidateClusters`** | `16777216` (`16 * 1048576`), `ECVF_RenderThreadSafe` `[дамп 5.4.4]` | штуки | Размер промежуточного буфера кандидатов до кулинга кластеров | VRAM | **Пропущено в первой редакции, а это отдельная и очень заметная причина «пропала геометрия».** При переполнении движок пишет в лог «Increase r.Nanite.MaxCandidateClusters to prevent potential visual artifacts». Epic прямо признаёт `[Epic]`: «There is no mechanism for dynamically resizing either of these buffers, or automatically scaling down quality on overflow, which can result in rendering artifacts … typically manifesting as **missing or blinking geometry**». Фактический максимум округляется вниз до кратного `NANITE_PERSISTENT_CLUSTER_CULLING_GROUP_SIZE` |
| **`r.Nanite.MaxVisibleClusters`** | `4194304` (`4 * 1048576`), `ECVF_RenderThreadSafe` `[дамп 5.4.4]` | штуки | Потолок видимых кластеров | VRAM | То же. Значения из гайдов вида `10485760`/`16777216` — это подъём под тяжёлые сцены, а не «прирост FPS» |
| **`r.Nanite.MaxNodes`** | `2097152` (`2 * 1048576`), `ECVF_RenderThreadSafe` `[дамп 5.4.4]` | штуки | Потолок узлов иерархии, обходимых за проход кулинга | VRAM | То же семейство, тот же класс артефакта |
| `r.Nanite.Culling.Frustum` | `1` | bool | Отсечение кластеров по фрустуму | — | Выключать только для диагностики |
| `r.Nanite.Culling.HZB` | `1` | bool | Отсечение по иерархическому буферу глубины | Выключение = резкий рост растеризации | Это отдельный GPU-тракт, не связанный с `r.NeverOcclusionTestDistance` |
| `r.Nanite.Culling.GlobalClipPlane` | `1` | bool | Отсечение за глобальной клип-плоскостью | — | Без эффекта при `r.AllowGlobalClipPlane=0`. **(В первой редакции имя этого cvar-а было напечатано с мягким переносом внутри слова — при копировании в ini получалась несуществующая переменная. Имя пишется слитно: `r.Nanite.Culling.GlobalClipPlane`.)** |
| `r.Nanite.Culling.DrawDistance` | `1` | bool | Учитывать per-instance draw distance | — | При `0` Nanite перестаёт слушаться cull distance инстансов. Существование этого cvar-а опровергает распространённое «Nanite игнорирует Max Draw Distance» |
| `r.Nanite.Culling.WPODisableDistance` | `1` | bool | Учитывать «WPO Disable Distance» инстансов | — | Дальняя листва перестаёт качаться — это здесь, а не в LOD |
| `r.Nanite.Culling.TwoPass` | `1` | bool | Двухпроходное окклюзионное отсечение | Выключение дороже | — |
| `r.Nanite.PrimaryRaster.PixelsPerEdgeScaling` | `30.0` | проценты, клэмп `1..100` | Нижняя граница динамического ухудшения MaxPixelsPerEdge при выходе за бюджет | — | При 30% и `MaxPixelsPerEdge=1` движок вправе временно уехать до ~3.3 |
| `r.Nanite.ShadowRaster.PixelsPerEdgeScaling` | `100.0` | проценты | То же для теневого растра | — | `100` = масштабирования нет |
| `r.Nanite.PrimaryRaster.TimeBudgetMs` | `kBudgetMsDisabled` (выкл) `[?]` — константу стоит развернуть в число при сверке | мс | Бюджет кадра для основного растра Nanite | — | Пока бюджет выключен, PixelsPerEdgeScaling ни на что не влияет |
| `r.Nanite.ShadowRaster.TimeBudgetMs` | `kBudgetMsDisabled` (выкл) `[?]` | мс | Бюджет для теневого растра | — | То же |
| `r.Nanite.Streaming.StreamingPoolSize` | `512` МБ, `ECVF_RenderThreadSafe \| ECVF_ReadOnly` `[дамп 5.4.4]`; справка: «Size of streaming pool in MB. Does not include memory used for root pages» | МБ | Размер пула стриминга (без корневых страниц) | VRAM | `ECVF_ReadOnly` — **меняется только до старта рендера** (Engine.ini, не консоль). Осторожно с приближением к лимиту ресурса GPU: корневые страницы живут отдельно, но в том же бюджете видеопамяти |
| `r.Nanite.Streaming.NumInitialRootPages` | `2048` | страницы | Начальное выделение корневых страниц | VRAM | `ECVF_ReadOnly`; растёт по требованию только при `DynamicallyGrowAllocations=1` |
| `r.Nanite.Streaming.NumInitialImposters` | `2048` | штуки | Начальное выделение импостеров | VRAM | `ECVF_ReadOnly` |
| `r.Nanite.Streaming.DynamicallyGrowAllocations` | `1` | bool | Разрешить рост выделений сверх начальных | — | `ECVF_ReadOnly` |
| `r.Nanite.Streaming.MaxPendingPages` | `128` | страницы | Потолок страниц «в полёте» | IO | `ECVF_ReadOnly` |
| `r.Nanite.Streaming.MaxPageInstallsPerFrame` | `128` | страницы/кадр | Потолок установок за кадр | Спайки | `ECVF_ReadOnly`; фактический предел = `Min(этого, MaxPendingPages)` |
| `r.Nanite.Streaming.Imposters` | `1` | bool | Грузить импостеры | Память | `ECVF_ReadOnly`; при наличии HLOD часто не нужны |
| `r.Nanite.Streaming.Async` | `1` | bool | Стриминг на воркере вместо рендер-потока | CPU | — |
| `r.Nanite.Streaming.AsyncCompute` | `1` | bool | GPU-работа стриминга в async compute | — | — |
| `r.Nanite.Streaming.QualityScale.MinPoolPercentage` | `70.0` `[?]` | % загрузки пула | Ниже порога качество ползёт вверх (`×1.01` за апдейт) | — | **Всё семейство `QualityScale.*` — поздняя добавка; в 5.1–5.3 его, скорее всего, нет.** Проверяйте наличие в своём билде до того, как объяснять им артефакт |
| `r.Nanite.Streaming.QualityScale.MaxPoolPercentage` | `85.0` `[?]` | % загрузки пула | Выше порога (2 кадра подряд) качество режется | — | **Это скрытый регулятор детализации.** Если пул переполнен, вся геометрия глобально грубеет независимо от `MaxPixelsPerEdge` |
| `r.Nanite.Streaming.QualityScale.MinQuality` | `0.3` `[?]`, клэмп `0.1..1.0` | доля | Нижняя граница автоскейла | — | `1.0` = полностью отключить автоскейл |
| `r.Nanite.Streaming.GPURequestsBufferMinSize` | `131072` | элементы | Мин. размер буфера GPU-обратной связи | — | Min=Max отключает динамику |
| `r.Nanite.Streaming.GPURequestsBufferMaxSize` | `1048576` | элементы | Макс. размер | — | — |
| `r.Nanite.Streaming.ReservedResources` | `0` | bool | Резервированные ресурсы GPU (экспериментально) | — | `ECVF_ReadOnly` |
| `r.Nanite.Streaming.ResetStreamingPool` | — | команда | Сброс пула на следующем апдейте | диагностика | — |

### F. HLOD

`Engine/Private/LODActor.cpp`, `Renderer/Private/SceneVisibility.cpp` (`UpdateHLODVisibility`), `Engine/Private/WorldPartition/HLOD/HLODRuntimeSubsystem.cpp` `[код]`.

| cvar | дефолт | единица/шкала | что делает | цена | ловушки |
|---|---|---|---|---|---|
| `r.HLOD` | — (команда) | `0/1`, либо `force N` | Включение/выключение системы HLOD или принудительный уровень | — | Это `FAutoConsoleCommand`, **не переменная**: из ini как `r.HLOD=0` не сработает. Обёрнута в `#if !(UE_BUILD_SHIPPING)` |
| `r.HLOD.MaximumLevel` | `-1` | индекс уровня | `-1` без ограничения; `0` запрещает показывать HLOD вместо мешей; `N` разрешает до N-го уровня | Память текстур ↓, draw calls ↑ | `ECVF_Scalability`. Тонкость: `LODLevel` у `ALODActor` **единично-базированный** (HLOD-уровень 0 в редакторе = `LODLevel 1`), поэтому `0` и отключает всё |
| `r.HLOD.DistanceOverride` | `"0.0"` | **строка** списка дистанций в UU | Переопределяет дистанции переходов по уровням: `"5000, 10000, 20000"` | — | Тип `FString`. Нули в списке означают «оставить дистанцию из ассета». Число элементов должно совпасть с числом уровней HLOD, иначе индекс не подберётся |
| `r.HLOD.DistanceOverrideScale` | `""` | строка множителей | Множит значения из `DistanceOverride` | — | Пусто = выключено; задумано для геймплейной логики, вне scalability |
| `r.HLOD.DitherPauseTime` | `0.5` | секунды | Пауза дизеринга при переходе | — | `ECVF_Scalability \| ECVF_RenderThreadSafe` |
| `r.HLOD.ForceDisableCastDynamicShadow` | `0` | bool | Снимает динамические тени со всех LODActor | Хорошая экономия на тенях вдали | `ECVF_ReadOnly` — только до старта |
| `r.HLOD.ListUnbuilt` | — | команда | Список несобранных HLOD | диагностика | — |
| `wp.Runtime.HLOD` | вкл | `0/1` | Загрузка/рендер HLOD в World Partition | — | В первой редакции названо командой; **в части веток 5.x это именно `TAutoConsoleVariable<int32>`** — `[?]`, сверьте в своём билде, от этого зависит, ставится ли оно из ini |
| `wp.Runtime.HLOD.WarmupEnabled` | `1` | bool | Прогрев ассетов HLOD перед выгрузкой ячейки | — | Отключение = мыло/пропажи в момент перехода |
| `wp.Runtime.HLOD.WarmupNumFrames` | `5` | кадры | Задержка выгрузки ячейки | — | `0` = прогрев выключен |
| `wp.Runtime.HLOD.WarmupVT` | `1` | bool | Прогрев виртуальных текстур | — | Требует `WarmupEnabled=1` |
| `wp.Runtime.HLOD.WarmupNanite` | `1` | bool | Прогрев Nanite | — | Требует `WarmupEnabled=1` |
| `wp.Runtime.HLOD.WarmupVTScaleFactor` | `2.0` | множитель | Во сколько раз больше просить VT | — | — |
| `wp.Runtime.HLOD.WarmupVTSizeClamp` | `2048` | тексели | Потолок запроса VT | — | — |

### G. Инстансы, фолиаж, трава (седьмой тракт — в первой редакции был свален в «смежное»)

| cvar | дефолт | что делает | ловушки |
|---|---|---|---|
| `foliage.LODDistanceScale` | `1.0` | Множитель дистанции LOD для HISM/фолиажа | Отдельный тракт от `r.StaticMeshLODDistanceScale`; смена дёргает `FGlobalComponentRecreateRenderStateContext` (пересоздание всех рендер-стейтов) — то есть правка в рантайме даёт хич. **Для Nanite-фолиажа не значит ничего**: у Nanite-меша нет дискретных LOD, и HISM с включённым Nanite уходит в Nanite-тракт целиком |
| `foliage.MinimumScreenSize` | `0.000005`, `ECVF_Scalability` `[дамп 5.4.4]`; справка: «This controls the screen size at which we cull foliage instances entirely» | Полное отсечение инстансов по экранному размеру | **Пропущен в первой редакции.** Дефолт настолько мал, что механизм фактически выключен; это дешёвый и грубый рычаг, если фолиаж режет CPU |
| `grass.CullDistanceScale` | `1.0` | Множитель всех дистанций отсечения травы | Ландшафтная трава — не ландшафтный LOD и не фолиаж; третий счёт |
| `grass.DensityScale` | `1.0` `[?]` | Множитель плотности травы | Бьёт сильнее, чем дистанция: площадь × плотность |
| `r.InstanceCulling.OcclusionCull` | `1` | Окклюзионное отсечение инстансов через HZB | Отдельный GPU-путь; `r.NeverOcclusionTestDistance` на него **не** действует (замерено нами) |

### H. Смежное (не наш раздел, но постоянно путается)

| cvar | дефолт | что делает | почему здесь |
|---|---|---|---|
| `r.Shadow.DistanceScale` | `1.0` `[?]`, `ECVF_Scalability` | Масштабирует дистанцию CSM направленного света | Постоянно путают с `r.ViewDistanceScale`: «дальность теней» и «дальность прорисовки» — разные счета и разные подсистемы |
| `r.Shadow.RadiusThreshold` | `0.03` `[?]` | Отсечение мелких объектов из теневых проходов | Симптом «мелочь перестала отбрасывать тень» |
| `wp.Runtime.OverrideRuntimeSpatialHashLoadingRange` | зависит от проекта | Радиус загрузки ячеек World Partition | Дальность **стриминга**, не прорисовки. Площадь растёт как квадрат радиуса |

---

## Как считается

### 0. Кто кого перекрывает: приоритеты установки cvar-ов

`Core/Public/HAL/IConsoleManager.h` (UE 5.5) `[код]`, от слабого к сильному:

```
Constructor(0) < Scalability(1) < GameSetting(2) < ProjectSetting(3) < SystemSettingsIni(4)
 < PluginLowPriority(5) < DeviceProfile(6) < PluginHighPriority(7) < GameOverride(8)
 < ConsoleVariablesIni(9) < Hotfix(10) < Preview(11) < Commandline(12) < Code(13) < Console(14)
```

Практические следствия, подтверждённые кодом:

* `Engine.ini [SystemSettings]` применяется как **SetBySystemSettingsIni(4)**, что **выше** `Scalability(1)`. Поэтому значение из `[SystemSettings]` **не может быть перебито** ни `sg.ViewDistanceQuality`, ни `Scalability.ini`.
* **Но `[SystemSettings]` — далеко не вершина, и в первой редакции это было сказано слишком оптимистично.** Его штатно перебивают: **DeviceProfile(6)** — то есть `DefaultDeviceProfiles.ini` самой игры, **GameOverride(8)**, `Engine/Config/ConsoleVariables.ini` секции `[Startup]` (9), Hotfix(10), командная строка (12), код (13/14). В шипящих UE-играх раздача cvar-ов через **DeviceProfiles — самый частый способ**, и он сильнее вашего `[SystemSettings]` без всякого кода. Это альтернативное (и более вероятное) объяснение нашего случая с `foliage.LODDistanceScale=4` в ini и `2.0` в сцене — раньше мы списывали это только на `SetByCode`. Различить можно: `DumpCVars`/`cvarlist` показывают `SetBy` для каждой переменной; запуск с `-dpcvars=foliage.LODDistanceScale=4` бьёт DeviceProfile, но не бьёт код.
* Приоритеты сравниваются как «>=»: **повторная запись на том же приоритете выигрывает**. Две строки в разных ini одного приоритета — побеждает та, что применена позже.
* `Engine.ini [ConsoleVariables]` применяется **тоже как SystemSettingsIni(4)** (`ConfigCacheIni.cpp:5862`), а не как ConsoleVariablesIni(9). Приоритет `ConsoleVariablesIni(9)` получает только отдельный файл `Engine/Config/ConsoleVariables.ini`, секции `[Startup]`/`[Startup_<Platform>]` (`ConfigCacheIni.cpp:5841`) — и только он вызывается с `bAllowCheating=true`.
* `ECVF_Cheat`-переменные из ini **игнорируются** (`ConfigUtilities.cpp::OnSetCVarFromIniEntry`, ветка `bAllowChange = !bCheatFlag || bAllowCheating`). Всё семейство `landscape.Override*` — чит-флаг, да ещё и вырезано из Shipping.
* `Scalability.ini` может ставить **только** cvar-ы с `ECVF_Scalability`/`ECVF_ScalabilityGroup` — иначе `ensureMsgf` и присвоение отбрасывается. **Практическое следствие для этого раздела:** `r.Nanite.MaxPixelsPerEdge`, `r.Nanite.ViewMeshLODBias.*`, `r.Nanite.Max*Clusters`, `r.ViewDistanceScale.ApplySecondaryScale`, `r.MinScreenRadiusFor*` — **не** `ECVF_Scalability`, и в группах Scalability они работать не будут.
* `ECVF_ReadOnly` (весь `r.Nanite.Streaming.*`, `r.HLOD.ForceDisableCastDynamicShadow`) читается один раз при инициализации: консоль их принимает, но эффекта нет.

Группа `ViewDistanceQuality` в `Engine/Config/BaseScalability.ini` (UE 5.5.4) `[код]`:

```ini
[ViewDistanceQuality@0]   r.SkeletalMeshLODBias=2   r.ViewDistanceScale=0.4
[ViewDistanceQuality@1]   r.SkeletalMeshLODBias=1   r.ViewDistanceScale=0.6
[ViewDistanceQuality@2]   r.SkeletalMeshLODBias=0   r.ViewDistanceScale=0.8
[ViewDistanceQuality@3]   r.SkeletalMeshLODBias=0   r.ViewDistanceScale=1.0
[ViewDistanceQuality@Cine] r.SkeletalMeshLODBias=0  r.ViewDistanceScale=10.0
```

Обратите внимание: базовая группа «дальности вида» состоит **всего из двух** cvar-ов, причём один из них — про скелетники. `r.StaticMeshLODDistanceScale`, `r.Landscape*DistributionScale` и cvar-ы Nanite в базовой Scalability.ini **не фигурируют** — игры добавляют их сами (и добавить `r.Nanite.MaxPixelsPerEdge` туда, как показано выше, нельзя). `foliage.LODDistanceScale` в группе `FoliageQuality` присутствует, но **закомментирован** во всех уровнях.

Соответствующие групповые cvar-ы, которыми это дёргается снаружи: `sg.ViewDistanceQuality`, `sg.FoliageQuality`, `sg.LandscapeQuality`, `sg.ShadowQuality`, `sg.GlobalIlluminationQuality` (все `ECVF_ScalabilityGroup`). Ползунок «Дальность прорисовки» в меню игры — это почти всегда `sg.ViewDistanceQuality`.

### 1. Дистанционный кулинг: `r.ViewDistanceScale`

`UnrealEngine.cpp::ScalabilityCVarsSinkCallback()` `[код]`:

```cpp
ViewDistanceScale        = Max(r.ViewDistanceScale, 0)
                         * (r.ViewDistanceScale.ApplySecondaryScale > 0
                            ? Max(r.ViewDistanceScale.SecondaryScale, 0) : 1.0f);
ViewDistanceScaleSquared = Square(ViewDistanceScale);

SkeletalMeshOverlayDistanceScale = Max(r.ViewDistanceScale.SkeletalMeshOverlay, 0) * ViewDistanceScale;
```

`UnrealEngine.h::FCachedSystemScalabilityCVars::CalculateFieldOfViewDistanceScale()`:

```cpp
if (!IsNearlyEqual(FieldOfViewMaxAngleScale, FieldOfViewMinAngleScale)) {
    t = (Clamp(FoV, MinAngle, MaxAngle) - MinAngle) / (MaxAngle - MinAngle);
    return Lerp(MinAngleScale, MaxAngleScale, t);
}
return FieldOfViewMaxAngleScale;      // <- при равных Scale возвращается MAX, не 1.0
```

`SceneVisibility.cpp:1367-1368` и `:3675` — итоговый множитель для основного прохода видимости:

```cpp
MaxDrawDistanceScale = GetCachedScalabilityCVars().ViewDistanceScale
                     * GetCachedScalabilityCVars().CalculateFieldOfViewDistanceScale(View.DesiredFOV);
```

и сам тест (`FrustumCull`, строки 837-869):

```cpp
bHasMaxDrawDistance = (Bounds.MaxCullDistance < FLT_MAX);
MaxDrawDistance     = Bounds.MaxCullDistance * MaxDrawDistanceScale;
MinDrawDistanceSq   = Square(Bounds.MinDrawDistance * MaxDrawDistanceScale);
FadeRadius          = (r.DisableLODFade ? 0 : r.DistanceFadeMaxTravel);   // 1000 UU
// отсекается, если ClosestDistSq > Square(MaxDrawDistance); полоса затухания до +FadeRadius
```

Три тонкости, на которых ловятся:

1. **`MinDrawDistance` умножается тем же множителем.** Подняли `r.ViewDistanceScale` до 2.2 — у примитивов с заданной ближней границей она тоже уехала в 2.2 раза. Симптом: вблизи появилась дыра там, где раньше стоял замещающий объект.
2. **Второй путь** `FViewInfo::IsDistanceCulled_AnyThread` (строка 425) применяет **только** `ViewDistanceScale` без FOV-множителя. То есть FOV-семейство действует не на все проверки дистанции — часть кода видит другую границу, чем основной проход.
3. **До всякого умножения** значение `Bounds.MaxCullDistance` могло быть перезаписано `Cull Distance Volume`-ом уровня. Cvar честно умножает — просто не то, что вы задавали в деталях компонента.

### 2. LOD статик-мешей

`LocalPlayer.cpp:1218-1225` — откуда берётся `View.LODDistanceFactor` `[код]`:

```cpp
if (r.CalcLocalPlayerCachedLODDistanceFactor != 0)
    LocalPlayerCachedLODDistanceFactor = ViewInfo.FOV / Max(0.01f, PlayerCameraManager ? DefaultFOV : 90.f);
else
    LocalPlayerCachedLODDistanceFactor = 1.f;
```

`SceneVisibility.cpp:1094`:

```cpp
LODScale = r.StaticMeshLODDistanceScale * View.LODDistanceFactor;
```

`SceneManagement.cpp:911-921, 1030-1119`:

```cpp
ScreenMultiple   = Max(0.5*Proj.M[0][0], 0.5*Proj.M[1][1]);
ScreenRadiusSq   = Square(ScreenMultiple * SphereRadius) / Max(1.0, DistSq);   // DistSq учитывает Proj.M[2][3] (орто)
// перебор мешей от худшего LOD к лучшему:
MeshScreenSize   = Mesh.ScreenSize * LODScale;
if (Square(MeshScreenSize * 0.5) >= ScreenRadiusSq) -> берём этот LOD
```

**Итоговая дистанция переключения**: `D_switch = 2·ScreenMultiple·R / (ScreenSize · r.StaticMeshLODDistanceScale · FOV/DefaultFOV)`, то есть `D_switch = D_базовая / (r.StaticMeshLODDistanceScale × FOV/DefaultFOV)`.

Следствия — в том числе те, которых в первой редакции не было:

* `r.StaticMeshLODDistanceScale = 2` → LOD-ы переключаются на **половине** дистанции.
* **`r.StaticMeshLODDistanceScale = 0` — не «выключить», а сломать.** В статик-мешевом тракте `MeshScreenSize` обнуляется и выбирается худший LOD; в ландшафтном тракте это значение стоит в знаменателе. Нижнего клэмпа нет `[вывод]`.
* Игрок, поставивший FOV 110 при `DefaultFOV=90`, получает множитель `1.22` — LOD-ы у него хуже. Компенсация: `r.StaticMeshLODDistanceScale = DefaultFOV/FOV`.
* **Обратная сторона того же:** прицеливание с сужением FOV до 40 даёт множитель `0.44` — LOD-ы становятся заметно лучше. Это удобный **бесплатный диагностический признак**: если при прицеливании детализация подскакивает, вы смотрите на LOD-тракт, а не на кулинг.
* **Пороги LOD не зависят от разрешения рендера.** В формуле нет ни `ViewRect`, ни screen percentage — только матрица проекции и дистанция. Это фундаментальная асимметрия с Nanite, где `ViewToPixels` содержит `ViewRect.Height()`: **DLSS/TSR портит детализацию Nanite и вообще не трогает пороги LOD обычных мешей** `[вывод]`. Отсюда типовая жалоба «после включения DLSS Nanite-камни поплыли, а LOD-деревья те же».
* **Пороги LOD зависят от соотношения сторон.** `ScreenMultiple` берёт `Max(M00, M11)`, а `M11` при фиксированном горизонтальном FOV растёт вместе с аспектом. То есть один и тот же меш на 21:9 и на 16:9 переключит LOD на **разной** дистанции `[вывод]`. Значения `ScreenSize`, выставленные художником в редакторном вьюпорте, «правильны» только для его аспекта.
* `ShowFlag.LOD = 0` (`View.Family->EngineShowFlags.LOD`) уводит выбор в ветку по умолчанию → **LOD0 на всём**. Это не «отключить LOD-подмену», а «зафиксировать максимум».
* `ForcedLODLevel >= 0` (через `r.ForceLOD`) обходит всю арифметику и клэмпится в `[MinLOD, MaxLOD]` доступных мешей.
* В конце всегда применяется `LODToRender.ClampToFirstLOD(CurFirstLODIdx)` — стриминг мешей может не дать показать LOD0, сколько бы вы ни просили. Сюда же добавляется `MinLOD`/`PerPlatformMinLOD` ассета.

### 3. LOD скелетных мешей

`SkeletalRender.cpp:130-165` + `SkinnedMeshComponent.cpp:4193` `[код]`:

```cpp
LODScale        = Clamp(r.SkeletalMeshLODRadiusScale, 0.25f, 1.0f);
ScreenRadiusSq  = ComputeBoundsScreenRadiusSquared(Bounds, View) * LODScale * LODScale;
// от худшего LOD к лучшему, с гистерезисом при улучшении:
ScreenSize      = LODInfo[L].ScreenSize + (L <= CurrentLOD ? LODInfo[L].LODHysteresis : 0);
if (Square(ScreenSize * 0.5) > ScreenRadiusSq) -> MinDesiredLODLevel = L;

NewPredictedLODLevel = Clamp(MeshObject->MinDesiredLODLevel + GSkeletalMeshLODBias, 0, MaxLODIndex);
NewPredictedLODLevel = Max(NewPredictedLODLevel, RenderData.PendingFirstLODIdx, RenderData.CurrentFirstLODIdx);
```

Полученный `PredictedLODLevel` дальше уходит **не только в рендер**: он же индексирует `LODToFrameSkipMap` в Update Rate Optimization, то есть управляет частотой обновления анимации и, косвенно, стоимостью на игровом потоке.

### 4. LOD ландшафта

`LandscapeRender.cpp:1432-1500` `[код]`:

```cpp
if (Proxy->bUseScalableLODSettings) {          // ветка ПОЛНОСТЬЮ игнорирует cvar-ы
    LOD0ScreenSize   = ScalableLOD0ScreenSize.GetValue(sg.LandscapeQuality);
    LOD0Distribution = ScalableLOD0DistributionSetting.GetValue(sg.LandscapeQuality);
    LODDistribution  = ScalableLODDistributionSetting.GetValue(sg.LandscapeQuality);
} else {
    LOD0ScreenSize   = Proxy->LOD0ScreenSize;                                     // 0.5
    LOD0Distribution = Proxy->LOD0DistributionSetting * GLandscapeLOD0DistributionScale;  // 1.25 * cvar
    LODDistribution  = Proxy->LODDistributionSetting  * GLandscapeLODDistributionScale;   // 3.00 * cvar
}
// (только !UE_BUILD_SHIPPING) landscape.OverrideLOD* заменяют значения целиком

Divider0 = Max(LOD0Distribution, 1.01f);
Ratio    = LOD0ScreenSize / r.StaticMeshLODDistanceScale;   // <- намеренное СОКРАЩЕНИЕ
LODScreenRatioSq[0] = Ratio²;   Ratio /= Divider0;          // порог LOD1
Divider  = Max(LODDistribution, 1.01f);
for (L = 1..MaxLOD) { LODScreenRatioSq[L] = Ratio²; Ratio /= Divider; }
```

То есть пороги — геометрическая прогрессия:

```
ScreenSize(LOD 0) = LOD0ScreenSize
ScreenSize(LOD 1) = LOD0ScreenSize / (1.25 · r.LandscapeLOD0DistributionScale)
ScreenSize(LOD N) = ScreenSize(LOD 1) / (3.0 · r.LandscapeLODDistributionScale)^(N-1)
```

и выбор (с дробным LOD для морфинга), `LandscapeRender.cpp:483-498, 4441-4457`:

```cpp
LODScale = View.LODDistanceFactor * r.StaticMeshLODDistanceScale;
SectionScreenSizeSq  = ComputeBoundsScreenRadiusSquared(...) / Max(LODScale², SMALL_NUMBER);
LODLevel = ComputeLODFromScreenSize(LODSettings, SectionScreenSizeSq);
// внутри: линейная доля между LOD0 и LOD1, дальше 1 + log_{Divider²}(LOD1ScreenSizeSq / ScreenSizeSq)
```

Деление на `r.StaticMeshLODDistanceScale` при построении таблицы и деление на `LODScale²` при выборе взаимно уничтожаются — **ландшафт намеренно иммунен к `r.StaticMeshLODDistanceScale`** (комментарий в коде: «Cancel out so that landscape is not affected by r.StaticMeshLODDistanceScale»). А вот `View.LODDistanceFactor` (FOV) **не** сокращается и на ландшафт действует.

Два уточнения, которых не было:

* **Сокращение точное только при неизменном cvar-е.** Таблица `LODScreenRatioSq` строится при пересборке LOD-настроек прокси, а `LODScale` берётся каждый кадр. Пока вы не трогаете cvar в рантайме — они сокращаются; в момент правки из консоли возможен кадр-другой рассогласования, пока таблица не пересобрана `[вывод]`.
* **Иммунитет исчезает при `landscape.RenderNanite=1`**: там ландшафт идёт по Nanite-тракту, где `r.StaticMeshLODDistanceScale` делит `ScreenMultiple` и никем не сокращается `[вывод]`.

**Порядок перекрытия для ландшафта:** `landscape.Override*` (чит, non-shipping) > `bUseScalableLODSettings` + `sg.LandscapeQuality` > свойство ассета × `r.Landscape*DistributionScale`. И поверх всего — `ForcedLODOverride` рендер-системы, `ForcedLOD` компонента, `MaxLODLevel` прокси, а также подъём до `MinStreamedLOD` по резидентным мипам хайтмапа.

### 5. Nanite

`DeferredShadingRenderer.cpp:1262-1279` `[код]`:

```cpp
LODScaleFactor = 1.0f;
if (View.PrimaryScreenPercentageMethod == TemporalUpscale && r.Nanite.ViewMeshLODBias.Enable != 0) {
    TemporalUpscaleFactor = SecondaryViewRectSize.X / ViewRect.Width();     // = выход / рендер
    LODScaleFactor = TemporalUpscaleFactor * Exp2(-r.Nanite.ViewMeshLODBias.Offset);
    LODScaleFactor = Min(LODScaleFactor, Exp2(-r.Nanite.ViewMeshLODBias.Min));   // дефолт: Min(x, 4)
}
MaxPixelsPerEdgeMultipler  = 1.0f / LODScaleFactor;
QualityScale               = Min(NaniteStreaming.GetQualityScaleFactor(), DynamicResFraction);
MaxPixelsPerEdgeMultipler /= QualityScale;
```

`NaniteShared.cpp:81-88, 124-131`:

```cpp
NaniteMaxPixelsPerEdge = r.Nanite.MaxPixelsPerEdge * MaxPixelsPerEdgeMultipler;
ViewToPixels           = 0.5f * ViewToClip.M[1][1] * ViewRect.Height();   // ВЫСОТА РЕНДЕРА, не выхода
LODScale               = ViewToPixels / NaniteMaxPixelsPerEdge;
LODScaleHW             = ViewToPixels / r.Nanite.MinPixelsPerEdgeHW;

ViewDistanceLODScale   = GetCachedScalabilityCVars().StaticMeshLODDistanceScale * View.LODDistanceFactor;
ScreenMultiple         = Max(Proj.M[0][0], Proj.M[1][1]) / ViewDistanceLODScale;
```

Что отсюда следует (и что почти всегда понимают неверно):

* **Nanite подчиняется `r.StaticMeshLODDistanceScale`.** Он делит `ScreenMultiple`, то есть занижает оценку экранного размера кластеров → выбираются более грубые. `r.StaticMeshLODDistanceScale=2` грубит и обычные меши, и Nanite.
* **Nanite подчиняется FOV** через тот же `View.LODDistanceFactor`.
* **`MaxPixelsPerEdge` — в пикселях рендера.** При DLSS/TSR компенсация делается автоматически множителем `выход/рендер`, но с потолком `Exp2(-Min) = 4` при дефолтном `Min=-2`. Если апскейл сильнее ×4 по стороне (или `Enable=0`, или апскейлер не зарегистрирован как `TemporalUpscale`), компенсации нет и геометрия грубеет пропорционально апскейлу. Отдельно: **DLSS/FSR, подключённые как spatial-апскейлер, а не как `TemporalUpscale`, компенсации не получают вообще** — это частый случай в модах, подменяющих апскейлер.
* **Квадратичная зависимость числа треугольников от `MaxPixelsPerEdge` имеет насыщение с обеих сторон.** Сверху — исходная плотность меша: `MaxPixelsPerEdge=0.1` не даст в 100 раз больше треугольников, чем `1.0`, если в ассете их просто нет; вы упрётесь в LOD0 и заплатите только за обход иерархии. Снизу — корневые кластеры: грубее корня уйти нельзя. Это тот же класс ошибки, что мы уже ловили на Lumen: **сначала ищем потолок, потом считаем цену** `[вывод]`.
* Автоматический **QualityScale стриминга** (если он есть в вашем билде) делит `MaxPixelsPerEdgeMultipler` независимо от всех ваших настроек: при загрузке пула > 85% два кадра подряд качество ползёт вниз до `MinQuality=0.3`, при < 70% — обратно вверх по 1% за апдейт. Диапазон ухудшения — до ~3.3× по длине ребра.
* **`DynamicResFraction` входит в тот же `Min`.** Если в игре включено динамическое разрешение, оно грубит Nanite ровно так же, как переполненный пул, и «плавающая» детализация может быть следствием динамического разрешения, а не стриминга.
* `r.Nanite.ViewMeshLODBias.Offset` экспоненциален. `Offset=1` = вдвое грубее, `Offset=1000` = деление на ноль в множителе, вся сцена в корневых кластерах.
* **Отдельно от всей этой арифметики стоят потолки буферов** (`MaxCandidateClusters`, `MaxVisibleClusters`, `MaxNodes`). Они не «ухудшают качество» — при переполнении кластеры просто не попадают в проход, и куски геометрии **пропадают или мигают**. Epic это документирует явно и подчёркивает, что автоматического снижения качества при переполнении нет `[Epic]`. Симптоматически это ни на что другое в разделе не похоже: артефакт зависит от плотности кадра, а не от дистанции.

### 6. HLOD

`SceneVisibility.cpp:5987-6060` (`UpdateHLODVisibility`) `[код]`:

```cpp
if (ScalabilityCVars.FieldOfViewAffectsHLOD)
     HLODState.FOVDistanceScaleSq = Square(ScalabilityCVars.CalculateFieldOfViewDistanceScale(View.DesiredFOV));
else HLODState.FOVDistanceScaleSq = 1.f;

bNearCulled = FurthestDistSq < Square(Bounds.MinDrawDistance) * FOVDistanceScaleSq;
bFarCulled  = ClosestDistSq  > Bounds.MaxDrawDistance² * FOVDistanceScaleSq;
bIsInDrawRange = !bNearCulled && !bFarCulled;
```

`r.ViewDistanceScale` в **этой** формуле отсутствует: конечный автомат HLOD (кто показывается — узел или дети) на него не смотрит. Более того, при `IsNodeForcedVisible` фрустум-кулинг вообще пропускает дистанционную проверку (`bShouldDistanceCull = false`, строки 782-792). Дистанции переходов HLOD задаются `LODDrawDistance` из сборки, либо переписываются `r.HLOD.DistanceOverride` (`LODActor.cpp:377`: нулевое значение в списке = «оставить из ассета»), масштабируются `r.HLOD.DistanceOverrideScale`, ограничиваются `r.HLOD.MaximumLevel`.

**Следствие, которое стоит проговорить:** раз `r.ViewDistanceScale` не участвует, а обычные меши он двигает — подняв его, вы получаете **рассинхрон**: детализированные меши живут дальше, чем раньше, но подмена на HLOD происходит там же, где и была. В полосе между старой и новой границей вы можете увидеть и HLOD-узел, и его детей одновременно (z-fighting, двойные силуэты) — это не баг сборки HLOD, это ваш cvar.

### 7. Сводка «кто на кого умножается»

| Тракт | Формула множителей | Что НЕ участвует |
|---|---|---|
| Кулинг примитива | `MaxCullDistance × r.ViewDistanceScale × [SecondaryScale] × FOV-scale` (+ полоса `r.DistanceFadeMaxTravel`); `MinDrawDistance` × тот же множитель | `r.StaticMeshLODDistanceScale`, `View.LODDistanceFactor`, разрешение |
| LOD статик-меша | `порог = ScreenSize[LOD] × r.StaticMeshLODDistanceScale × (FOV/DefaultFOV)`; сравнение с `Max(0.5·M00, 0.5·M11)·R / D` | `r.ViewDistanceScale`, **разрешение рендера** |
| LOD скелетного меша | `радиус² × Clamp(r.SkeletalMeshLODRadiusScale,0.25,1)²`, затем `LOD += r.SkeletalMeshLODBias` (и он же задаёт частоту URO) | `r.StaticMeshLODDistanceScale`, `View.LODDistanceFactor`, `r.ViewDistanceScale` |
| LOD ландшафта (не-Nanite) | `LOD0ScreenSize / (LOD0Dist×cvar) / (LODDist×cvar)^(N-1)`, множители с полом `1.01`; выбор делится на `(FOV × StaticMeshLODDistanceScale)²` | `r.StaticMeshLODDistanceScale` (сокращается), `r.ViewDistanceScale` |
| Ландшафт при `landscape.RenderNanite=1` | как Nanite | `r.Landscape*DistributionScale` |
| Nanite (детализация) | `MaxPixelsPerEdge × (1/LODScaleFactor) / Min(QualityScale, DynamicResFraction)`, сравнение через `ViewToPixels ∝ высота рендера` | `r.ViewDistanceScale` |
| Nanite (экранный размер инстанса) | `ScreenMultiple = Max(M00, M11) / (r.StaticMeshLODDistanceScale × FOV-factor)` | — |
| Nanite (потолки буферов) | жёсткие константы, ни на что не умножаются | всё вышеперечисленное; при переполнении — пропажа, а не деградация |
| HLOD | `дистанции узла × FOV-scale²` (только при `FieldOfViewAffectsHLOD=1`) | `r.ViewDistanceScale` |
| HISM/фолиаж (не-Nanite) | `foliage.LODDistanceScale`; отсечение по `foliage.MinimumScreenSize` | `r.StaticMeshLODDistanceScale` (отдельный тракт) |
| Трава ландшафта | `grass.CullDistanceScale`, `grass.DensityScale` | всё остальное |
| Overlay скелетника | `ScreenSize × r.ViewDistanceScale.SkeletalMeshOverlay × r.ViewDistanceScale` | — |
| Теневой проход | свои пороги: `r.MinScreenRadiusForCSMDepth`, `r.Shadow.RadiusThreshold`, `r.Shadow.DistanceScale`, `r.ForceLODShadow` | `r.ViewDistanceScale` |

### 8. Инструменты проверки (чего в первой редакции не было вовсе)

Половина утверждений вида «поставьте X — станет лучше» неопровержима без прибора. Минимальный набор:

| инструмент | что показывает | зачем в этом разделе |
|---|---|---|
| `stat initviews` | Frustum Cull / Occlusion Cull время, `Processed primitives`, `Visible static mesh elements`, `Relevance time` | **Главный прибор тракта кулинга.** Именно эти счётчики двигает `r.ViewDistanceScale`; на CPU-bound сцене цена видна тут, а не в GPU busy |
| `stat scenerendering` | общее время InitViews, число draw calls | второй по важности |
| `stat rhi` | треугольники/дроуколлы за кадр | проверить квадратичную гипотезу по `MaxPixelsPerEdge` |
| `NaniteStats` / `r.Nanite.ShowStats 1` | кластеры, треугольники Nanite, **high-water mark по буферам** | единственный способ отличить «переполнение буферов» от «переполнения пула» |
| Nanite Visualization → Clusters / Triangles / Overdraw | визуально: где кластеры крупные | проверка `MaxPixelsPerEdge` на глаз |
| `viewmode lodcoloration` (редактор) | цвет по индексу LOD | проверка `r.StaticMeshLODDistanceScale` без секундомера |
| `landscape.DumpLODs` | текущие LOD ландшафта и статус стриминга | проверка, что правка вообще доехала |
| `DumpCVars` / `cvarlist` | значение **и `SetBy`** для каждой переменной | различить «строка не доехала» и «доехала, но перебита DeviceProfile/кодом» |
| `-dpcvars=Name=Value` в командной строке | подмена значения на приоритете DeviceProfile | проверить гипотезу «меня бьёт DeviceProfile» |
| `freezerendering` | заморозить видимость и облететь камерой | увидеть, что именно отсеклось |

---

## Симптом → причина

| Видимый артефакт | Механизм | Чем лечится | Отличительное наблюдение |
|---|---|---|---|
| Объект появляется целиком «из воздуха» на фиксированной дистанции, без промежуточных стадий | Дистанционный кулинг по `MaxCullDistance` | `r.ViewDistanceScale` вверх; `r.DistanceFadeMaxTravel` для полосы затухания | Дистанция **не зависит от FOV** (если FOV-семейство в дефолте) и одинакова для всех копий меша |
| Тот же поп-ин, но `r.ViewDistanceScale` любого размера ничего не меняет | У примитива не задан Max Draw Distance → `bHasMaxDrawDistance=false` | Ничего в этом семействе; смотреть HLOD/стриминг World Partition (`wp.Runtime.OverrideRuntimeSpatialHashLoadingRange`) | Множитель ×10 не двигает границу ни на метр |
| Задали `Max Draw Distance` на компоненте — не соблюдается, но cvar на него действует | `Cull Distance Volume` перезаписал `CachedMaxDrawDistance` | `bAllowCullDistanceVolume=false` на компоненте либо правка объёма | Дистанция исчезновения зависит от **размера** объекта по таблице объёма |
| После подъёма `r.ViewDistanceScale` появилась дыра **вблизи** | Тем же множителем вырос `MinDrawDistance` | Вернуть масштаб либо править `MinDrawDistance` | Дыра ровно вокруг камеры, пропорциональна множителю |
| Силуэт модели «дёргается» ступенькой на среднем плане при подходе/отходе | Смена дискретного LOD статик-меша | `r.StaticMeshLODDistanceScale` вниз (0.5, 0.25) | Дистанция смены **меняется при смене FOV** (прицел ↔ бедро) — верный признак, что это LOD, а не кулинг |
| Переход между LOD не растворяется, а мигает сеткой точек | Дизеринг есть, темпорального сглаживания нет (или материал не поддерживает `bDitheredLODTransition`) | Включить TAA/TSR; проверить материал; `r.DisableLODFade=1` как честная альтернатива | Сетка регулярная, «шахматная» |
| Правка `ScreenSize` в редакторе LOD ничего не даёт | Включён `bAutoComputeLODScreenSize` | Снять галку «Auto Compute LOD Distances» | Значения возвращаются к прежним после реимпорта/сохранения |
| LOD-ступеньки у разных игроков на разной дистанции при одинаковых настройках | `View.LODDistanceFactor = FOV/DefaultFOV` (и/или разное соотношение сторон) | `r.CalcLocalPlayerCachedLODDistanceFactor=0` либо компенсация `r.StaticMeshLODDistanceScale` | Зависимость от ползунка FOV в меню; на 21:9 картина отличается от 16:9 |
| Персонажи/NPC грубеют, а окружение — нет | Скелетный тракт (`r.SkeletalMeshLODBias`, ползунок ViewDistanceQuality игры) | `r.SkeletalMeshLODBias=0`; `r.SkeletalMeshLODRadiusScale` ниже 1 делает только хуже | `r.StaticMeshLODDistanceScale` на них не влияет вообще |
| Дальние персонажи «дёргаются»/анимируются рывками | URO: частота обновления анимации выбрана по предсказанному LOD | `r.SkeletalMeshLODBias` вниз (ценой CPU) либо правка `LODToFrameSkipMap` | Рывки исчезают при приближении раньше, чем меняется силуэт |
| Земля вдали крупными треугольниками, рельеф «плывёт» при движении камеры | Прогрессия LOD ландшафта | `r.LandscapeLODDistributionScale` и `r.LandscapeLOD0DistributionScale` **вверх** (2–3): они увеличивают знаменатель, порог следующего LOD уезжает дальше, сетка вдали остаётся плотнее — ценой вершин и CPU на расчёт LOD-биасов | Артефакт только на ландшафте, статик-меши на том же расстоянии в порядке |
| Правка `r.Landscape*DistributionScale` не даёт ничего | `bUseScalableLODSettings=true` у прокси → cvar-ы в этой ветке не читаются | Только `sg.LandscapeQuality`; либо `landscape.Override*` (нет в Shipping) | Значение cvar-а меняется, `landscape.DumpLODs` показывает те же LOD |
| То же, но `bUseScalableLODSettings=false` | `landscape.RenderNanite=1`: ландшафт ушёл в Nanite-тракт | `r.Nanite.MaxPixelsPerEdge` | На ландшафт внезапно начинает действовать `r.StaticMeshLODDistanceScale` |
| Ландшафт стал ЖРАТЬ кадры после занижения distribution | Пол `Max(LODDistribution, 1.01)`: при `cvar<1/3` прогрессия почти не убывает | Вернуть ≥ 1.0 | FPS падает вместо роста — характерная «перевёрнутая» реакция |
| Мелкие детали Nanite (листья, трава) тают/пропадают вдали | `MaxPixelsPerEdge` в пикселях **рендера**, апскейл не скомпенсирован | `r.Nanite.MaxPixelsPerEdge` < 1; проверить `r.Nanite.ViewMeshLODBias.Enable=1` и `.Min` (по умолчанию потолок ×4) | Эффект усиливается при переключении DLSS на более агрессивный режим при том же выходном разрешении |
| Вся геометрия Nanite «мылится» именно в плотных сценах, а на пустых нормальная | Переполнение стримингового пула → авто-`QualityScale` до 0.3 (если механизм есть в билде) или динамическое разрешение | `r.Nanite.Streaming.StreamingPoolSize` вверх (ReadOnly, только через ini/старт); `QualityScale.MinQuality=1.0`; проверить динамическое разрешение | `MaxPixelsPerEdge` не меняет картину; деградация «дышит» по мере движения |
| Куски Nanite-геометрии **мигают или отсутствуют** в плотных кадрах | **Переполнение буферов кластеров/узлов** (`MaxCandidateClusters`, `MaxVisibleClusters`, `MaxNodes`) — автоскейла качества на этот случай в движке нет | Поднять соответствующий cvar (цена — VRAM); проверить high-water mark в `NaniteStats` | Пропадает **целиком**, а не грубеет; коррелирует с плотностью кадра, не с дистанцией; в логе — предупреждение «Increase r.Nanite.Max…» |
| Nanite-геометрия превратилась в блобы после правки ini | `r.Nanite.ViewMeshLODBias.Offset` с большим значением: `Exp2(-Offset) → 0` | Вернуть `Offset=0` | Артефакт мгновенный и тотальный, включая ближний план |
| Отключили Nanite ради «нормальных LOD» — стало хуже, чем было | Фолбэк — это один сгенерированный прокси-меш по `Fallback Relative Error`, а не цепочка LOD | Вернуть Nanite либо собрать реальные LOD в ассете | Качество падает **на всех дистанциях**, включая ближнюю |
| Дальние здания — один слепленный меш с плохими швами | HLOD-узел вместо детей | `r.HLOD.MaximumLevel=0` (дорого: возвращаются все дроуколлы и текстуры детей) или `r.HLOD.DistanceOverride` с большими дистанциями | На переход накладывается дизеринг длительностью `r.HLOD.DitherPauseTime` |
| HLOD переключается не там, где ожидалось, и `r.ViewDistanceScale` не помогает | Автомат HLOD использует только FOV-множитель, и то при `FieldOfViewAffectsHLOD=1` | `r.HLOD.DistanceOverride`/`DistanceOverrideScale` | Изменение `r.ViewDistanceScale` двигает поп-ин обычных мешей, но не момент подмены на HLOD |
| Видно и HLOD, и детализированные меши одновременно (двойные силуэты, z-fighting) | Подняли `r.ViewDistanceScale`, а границу HLOD он не двигает | Согласовать: `r.HLOD.DistanceOverrideScale` в ту же сторону | Полоса артефакта ровно между старой и новой дистанцией кулинга |
| Мерцание/пропадание инстансов и их теней | `r.InstanceCulling.OcclusionCull` (отдельный GPU-путь через HZB) | `r.InstanceCulling.OcclusionCull=0` | `r.NeverOcclusionTestDistance` **не действует** — проверено нами |
| Объект видно, тень от него на средней дистанции пропала | `r.MinScreenRadiusForCSMDepth` / `r.Shadow.RadiusThreshold` | Понизить порог (ценой GPU в теневом проходе) | Порог по **экранному радиусу**, поэтому мелкие объекты теряют тень раньше крупных на той же дистанции |
| `foliage.LODDistanceScale` не действует на конкретный меш | У этого меша включён Nanite | `r.Nanite.MaxPixelsPerEdge` / `r.StaticMeshLODDistanceScale` | Соседний не-Nanite фолиаж на ту же правку реагирует |
| Строка в ini «не доезжает» | cvar перебит **DeviceProfile(6)**/`GameOverride(8)`/`SetByCode(13)`, либо `ECVF_Cheat`, либо `ECVF_ReadOnly`, либо имени нет в билде, либо это не переменная, а команда | `DumpCVars` и смотреть `SetBy`; перенести в `[SystemSettings]`; попробовать `-dpcvars=` | Замер прибором ДО перезаписи отличает «не доехало» от «доехало и было перезаписано» |
| Cvar доехал, но эффекта нет, а картинка меняется от ползунка качества | Значение перебивается на **более высоком** приоритете при каждом применении пресета | Ставить на приоритете выше DeviceProfile (командная строка, `ConsoleVariables.ini [Startup]`) | Эффект «возвращается» ровно в момент открытия меню настроек |

---

## Расхождения документации Epic с реальным поведением

Отдельный блок — в первой редакции такие расхождения были рассыпаны по сноскам и часть не отмечена вовсе.

1. **`r.ViewDistanceScale`.** Справка в коде точна: «A primitive's MaxDrawDistance is scaled by this value». А страница Scalability Reference и вся вторичная литература говорят просто «view distance», из чего читатель выводит «дальность прорисовки всего». Не отмечено нигде: cvar **бездействует** на примитивах без cull distance и **дополнительно двигает `MinDrawDistance`**.
2. **`r.Nanite.MaxPixelsPerEdge`.** Справка: «The triangle edge length that the Nanite runtime targets, measured in pixels». Два умолчания: (а) пиксели — **рендер**-разрешения, не выходного; (б) «targets» относится к выбору уровня в иерархии групп кластеров, а не к каждому треугольнику. Ни то, ни другое в документации не сказано.
3. **«У Nanite нет LOD».** Формально верно (нет дискретной цепочки), но из этого повсеместно выводят «значит, LOD-cvar-ы Nanite не касаются». Код говорит обратное: `r.StaticMeshLODDistanceScale` и FOV делят `ScreenMultiple`, а `r.Nanite.ViewMeshLODBias.*` названы «LOD bias» неспроста.
4. **Потолки буферов кластеров.** Здесь документация как раз честна и прямо предупреждает про «missing or blinking geometry» при отсутствии динамического ресайза — но этот абзац лежит в «Nanite Technical Details», куда не заходит никто из тех, кто крутит `MaxPixelsPerEdge`. В большинстве гайдов по оптимизации эти cvar-ы отсутствуют.
5. **`bUseScalableLODSettings`.** Единственное место, где Epic признаёт, что `r.LandscapeLOD0DistributionScale` игнорируется, — примечание в Python API. В документации по ландшафту этого нет. Симптом «cvar не работает» из-за этого расследуют часами.
6. **`r.SkeletalMeshLODBias`.** Справка Epic нейтральна («LOD bias for skeletal meshes»), знак не объяснён — и в эту дыру провалились cvar-агрегаторы, которые пишут прямо противоположное (см. ниже). Документация не виновата в ошибке, но и не защищает от неё.
7. **Дефолты в агрегаторах — от версии к версии.** Дампы, на которые ссылаются все гайды, сделаны с 5.4.4. Раздел описывает 5.5.4. Игры бывают на 5.1–5.3. Совпадение дефолтов между этими версиями — предположение, а не факт.

---

## Заблуждения, которые обычно не разбирают

К уже перечисленным в «Опыте сообщества» добавлены те, что в первой редакции отсутствовали:

* **«LOD зависит от разрешения — понижу разрешение, станет дешевле по геометрии».** Для статик-мешей — нет: в формуле порога нет ни `ViewRect`, ни screen percentage. Понижение разрешения удешевляет растеризацию и шейдинг, но **не** уменьшает число выбранных треугольников. Для Nanite — наоборот, да: там `ViewToPixels` пропорционален высоте рендера, и понижение разрешения автоматически грубит геометрию (за что и введена компенсация `ViewMeshLODBias`).
* **«Screen Size — это доля площади экрана / проценты».** Это доля **диаметра** проекции ограничивающей сферы; сравнение внутри идёт как радиус против радиуса (`ScreenSize*0.5`).
* **«Пороги LOD одинаковы у всех».** Они зависят от матрицы проекции — то есть от FOV **и от соотношения сторон**. Ультраширокий монитор — другие дистанции переключения.
* **«`r.LODFadeTime` включает плавные переходы».** Он задаёт только длительность. Плавность даёт дизеринг + темпоральное сглаживание; без TAA/TSR вы получите дырчатую сетку, а не растворение.
* **«HLOD — это просто дальний LOD».** Это отдельный конечный автомат с собственными дистанциями, который не смотрит на `r.ViewDistanceScale` и по умолчанию не смотрит на FOV. Он выбирает не «какой меш», а «узел или его дети».
* **«Выключу Nanite — вернутся LOD-ы».** Вернётся один прокси-меш, сгенерированный по `Fallback Relative Error`. Если в ассете нет собранных LOD, выключение Nanite ухудшает картинку на всех дистанциях сразу.
* **«Nanite не поддерживает Max Draw Distance».** Поддерживает, через `r.Nanite.Culling.DrawDistance` (дефолт `1`).
* **«`r.ForceLOD 0` зафиксирует максимальное качество везде».** Только для статик-мешей, только вне Shipping, и всё равно поверх ляжет `ClampToFirstLOD` от стриминга и `MinLOD` ассета. На скелетники, ландшафт и Nanite он не действует.
* **«Пропала геометрия — значит, кулинг».** В Nanite самый неочевидный источник пропаж — переполнение буферов кластеров, где нет ни кулинга, ни деградации качества, ни автоматической подстройки.
* **«Cvar-ы Nanite можно раздать через Scalability.ini».** `r.Nanite.MaxPixelsPerEdge` и родственные не помечены `ECVF_Scalability`; из Scalability.ini они отбрасываются с `ensure`.
* **«`[SystemSettings]` сильнее всего».** Сильнее Scalability и ProjectSetting — да. Слабее DeviceProfile, GameOverride, `ConsoleVariables.ini [Startup]`, командной строки и кода.
* **«Скелетный LODBias экономит только треугольники».** Он же понижает частоту обновления анимации через URO — на CPU-bound сцене это основная часть выигрыша.

---

## Опыт сообщества

**Проверено кодом (наш разбор исходников опровергает распространённый совет):**

* «`r.ViewDistanceScale` увеличивает дальность прорисовки всего» — **неверно**. Только для примитивов с заданной cull distance. На LOD, на ландшафт, на HLOD-переходы и на дальность стриминга World Partition он не влияет.
* «`r.ViewDistanceScale.SecondaryScale=2` удваивает дальность» — **не работает** без `r.ViewDistanceScale.ApplySecondaryScale=1`. Значение попадёт в cvar и будет отброшено при расчёте.
* «`r.StaticMeshLODDistanceScale` не трогает Nanite, у Nanite нет LOD» — **неверно**: он делит `ScreenMultiple` в `CreatePackedView`.
* «`r.StaticMeshLODDistanceScale` улучшит ландшафт» — **неверно**: сокращается по построению (кроме случая `landscape.RenderNanite=1`).
* «`r.SkeletalMeshLODBias` положительный = лучше качество» — **наоборот**: значение прибавляется к индексу LOD. Это не абстрактная ошибка: страница `r.skeletalmeshlodbias` в популярном cvar-агрегаторе прямо пишет «Positive values force higher-quality LODs (better visuals, lower performance)» — и это **ложь**, опровергаемая двумя строками: `NewPredictedLODLevel = Clamp(MinDesiredLODLevel + GSkeletalMeshLODBias, 0, MaxLODIndex)` и `[ViewDistanceQuality@0] r.SkeletalMeshLODBias=2`. Дефолты и справки в таких агрегаторах извлечены машинно и надёжны; **проза вокруг них сгенерирована и проверке не подлежит**.
* «`r.SkeletalMeshLODRadiusScale=2` даст детализацию» — **нет**, клэмп `0.25..1.0`.
* «`r.LandscapeLODDistributionScale` поменьше = меньше нагрузка» — **наоборот**, и при значениях ниже ~1/3 включается пол `1.01`, после которого LOD-ы почти перестают деградировать.

**Советуют (без замеров, но механизм подтверждается кодом):**

* `r.Nanite.MaxPixelsPerEdge 4` как быстрый «режим производительности» для сравнения — фигурирует в оптимизационных заметках инженеров UE. Механизм верный: при вчетверо большей целевой длине ребра выбирается уровень иерархии с примерно вчетверо-шестнадцатикратно меньшим числом треугольников (площадь / ребро²), пока не упрёшься в корневые кластеры.
* `r.LandscapeLODDistributionScale=3`, `r.LandscapeLOD0DistributionScale=3` — типовой рецепт из Steam-гайдов по UE5-играм. Механизм: знаменатель прогрессии растёт втрое, каждый следующий порог уезжает дальше, плотная сетка держится на большей дистанции. Сработает только если у ландшафта выключен `bUseScalableLODSettings` **и** выключен `landscape.RenderNanite`.
* `r.HLOD.MaximumLevel=0` против «слепленных зданий» — механизм подтверждён (`LODActor.cpp:38-48`; `LODLevel` единично-базированный, поэтому `0` глушит все уровни), цена — рост числа draw calls и текстурной памяти.
* Подъём `r.Nanite.MaxCandidateClusters` / `MaxVisibleClusters` против мигающей геометрии — механизм подтверждён документацией Epic; цена — VRAM под промежуточные буферы, прироста FPS от этого ждать не надо.

**Проверили игроки/моддеры (значения взяты из реальных модов и пресетов игр — это факт о значениях, не о приросте):**

* S.T.A.L.K.E.R. 2, мод «Nanite tuning»: `r.Nanite.ViewMeshLODBias.Min=-2.8` (потолок компенсации ≈ ×6.96 вместо ×4).
* Lords of the Fallen: в пресетах качества мешей шипятся `r.Nanite.ViewMeshLODBias.Min = -0.4151 / -0.5670` (потолок ≈ ×1.33/×1.48) — то есть разработчик **ограничивает** компенсацию ради кадров.
* ARK (UE5): `r.Nanite.ViewMeshLODBias.Offset 1000` как «читерский» способ убрать геометрию. Механизм: `Exp2(-1000)=0` → множитель уходит в бесконечность. Работает, но это не настройка, а поломка.
* Форум Epic: «`r.ViewDistanceScale 0` делает весь мир невидимым» — подтверждается формулой (`Max(x,0)` и все дистанции в ноль). Уточнение: невидимыми становятся только примитивы с заданной cull distance — то, что «весь мир» пропадает, говорит лишь о том, что в тех сценах cull distance задана почти всем.

**Пересказ без проверки (использовать с осторожностью):** утверждения вида «`r.Nanite.Streaming.NumInitialRootPages 1024` даёт +N FPS» — cvar `ECVF_ReadOnly` и влияет на стартовое выделение VRAM, а не на кадровое время; прирост, если и есть, идёт от снижения давления на пул, а не напрямую.

---

## Проверено нами

*(Palworld 1.0.3, UE ~5.1, RTX 5070 Ti, Ryzen 7 5700G, 4K, DLSS, панель 144 Гц.)*

> **Общая оговорка, которой не было:** формулы выше сняты с 5.5.4, замеры — с ~5.1. Совпадение имён cvar-ов не гарантирует совпадения механизма. Каждый вывод ниже помечен по тому, насколько он зависит от версии.

1. **Engine.ini `[SystemSettings]` в Palworld ДОЕЗЖАЕТ до сцены.** Доказано прибором мода UE4SS, который логирует значение ДО перезаписи: он застал `grass.CullDistanceScale=4.0`, GuardBand 2.0/2.2, **`ViewDistanceScale=2.2`**, `MaxCSMResolution=1536` — ровно значения ini, которых нет больше нигде. НО `foliage.LODDistanceScale` застали равным **2.0 при 4 в ini**, то есть отдельные строки игра всё же перебивает. Секции `[ConsoleVariables]` и `[/Script/Engine.RendererSettings]` ненадёжны: `r.NGX.DLSS.DilateMotionVectors` лежал там и до сцены не дожил.
   *Механизм:* `[SystemSettings]` = `SetBySystemSettingsIni(4)` > `SetByScalability(1)`, поэтому ползунки качества игры его не перебивают. **Уточнение к первой редакции:** источником перезаписи `foliage.LODDistanceScale` мы назвали `SetByCode(13)`, но это не единственный кандидат — `DeviceProfile(6)`, `GameOverride(8)` и `ConsoleVariables.ini [Startup] (9)` тоже выше, а раздача через DeviceProfiles в шипящих играх встречается чаще, чем присвоение из кода. **Гипотеза не проверена.** Проверяется одной командой: `DumpCVars` и посмотреть поле `SetBy` у этой переменной.

2. **Из 1173 присваиваний в нашем Engine.ini 764 задают cvar, которого в билде НЕТ.** Вывод класса: всегда сверять имена со списком зарегистрированных в exe. Для этого раздела особенно актуально: `r.ForceLOD`, `r.ForceLODShadow`, `r.HLOD`, `wp.Runtime.HLOD` и всё семейство `landscape.Override*` в Shipping-сборке отсутствуют либо не являются переменными. Добавьте в эту проверку и версионный срез: `r.Nanite.DicingRate`, `r.Nanite.Streaming.QualityScale.*`, `landscape.RenderNanite` в 5.1 могут просто не существовать.

3. **`r.InstanceCulling.OcclusionCull=1` вызывает мерцание/пропадание динамических теней.** Цена выключения замерена: **GPU busy 7.21 мс против 6.6, медиана 137.8 против 142**. `r.NeverOcclusionTestDistance` на этот тракт **НЕ действует** — инстансное отсечение идёт отдельным GPU-путём через HZB.

4. **`r.StaticMeshLODDistanceScale` 1 → 0.1 стоит всего 0.1–0.3 мс.**
   *Что этот замер на самом деле показывает и чего не показывает.* Он измерен по GPU busy, тогда как наша же сцена (п. 6) упирается в игровой поток; изменение порогов LOD прибавляет работы и на CPU (relevance, число видимых элементов), и этой стороны мы не мерили — `stat initviews` не снимался. Кроме того, при десятикратном занижении порогов эффект может быть съеден потолком: если в кадре мало не-Nanite мешей с реальной цепочкой LOD, двигать пороги просто нечему, а Nanite-часть отреагировала бы через `ScreenMultiple` и была бы видна как рост треугольников в `stat rhi` — этого мы тоже не проверяли. **Корректная формулировка вывода: на нашей сцене цена по GPU пренебрежимо мала; утверждать, что «сцена не упирается в геометрию статик-мешей», по этому замеру нельзя.**

5. **Сцена Palworld крайне неравномерна: CPU busy p50 = 0.48 мс против p90 = 36.** Средние по такой выборке бессмысленны, читать только медианы и перцентили.

6. **Замер по полосам частоты: на панораме (25–45 к/с) CPU busy 28.1 мс против GPU busy 6.2** — игра упирается в ИГРОВОЙ ПОТОК. Следствие для этого раздела: **поднимать `r.ViewDistanceScale` на панорамах вдвойне опасно** — цена ложится на тот поток, который уже является узким местом; и наоборот, снижение разрешения (DLSS) панораму не лечит, а вот сокращение числа видимых примитивов — единственный рычаг, который здесь вообще что-то значит. Прибор для следующего захода — `stat initviews`, а не GPU busy.

7. **`wp.Runtime.OverrideRuntimeSpatialHashLoadingRange`: площадь земли растёт как КВАДРАТ радиуса.** 25600 ванильное, 76800 = 9× площади. Снижение с 38400 до 25600 **не дало измеримого выигрыша** по CPU busy — то есть дальность стриминга НЕ была главным расходом. Вывод: не путать дальность стриминга (сколько ячеек загружено) с дальностью прорисовки (`r.ViewDistanceScale`) — это разные подсистемы и разные счета.

8. **Методика замера (иначе выводы этого раздела не воспроизвести):** открытый Intel PresentMon **НЕ метит кадры DLSS-G**, они приходят как Application; при включённой генерации `MsBetweenPresents` перестаёт показывать базовую частоту (давал «медиану 150 к/с» при лимите 141). База читается только с оверлея NVIDIA.

9. **Побочный урок из соседнего раздела:** расчёт «по числу лучей/треугольников» систематически завышает цену. `r.Lumen.ScreenProbeGather.TracingOctahedronResolution` 8→16 стоил ~0.3 мс вместо «больше половины выигрыша» из расчёта — из-за клэмпа. В этом разделе аналогичные ограничители: `Clamp(r.SkeletalMeshLODRadiusScale, 0.25, 1)`, `Max(LODDistribution, 1.01)`, `Min(LODScaleFactor, Exp2(-Min))`, насыщение `MaxPixelsPerEdge` на корневых кластерах и на LOD0, жёсткие потолки `MaxCandidateClusters`/`MaxVisibleClusters`/`MaxNodes`. **Сначала ищем клэмп, потом считаем цену.**

**Чего мы ещё НЕ проверяли (честный список дыр в собственных данных):**

* Цена самого `r.ViewDistanceScale` — ни по GPU, ни по `stat initviews`. При том, что в нашем ini стоит `2.2`, это **самая большая непроверенная строка раздела**.
* Реальный источник перезаписи `foliage.LODDistanceScale` (код vs DeviceProfile).
* Наличие в билде 5.1 механизмов `QualityScale`, `landscape.RenderNanite`, тесселяции Nanite.
* Ландшафтный тракт целиком: `bUseScalableLODSettings` у ландшафтов Palworld не смотрели, `landscape.DumpLODs` не гоняли.
* Влияние `r.SkeletalMeshLODBias` на CPU через URO — прямой кандидат на выигрыш именно на нашей CPU-bound панораме, ни разу не замерен.
* Пороги теневого тракта (`r.MinScreenRadiusForCSMDepth`) — не трогали.

---

## Источники

**1. Исходники UE 5.5.4** (публичное зеркало `github.com/Cyberyb/KuUE5.5`, `Engine/Build/Build.version` = 5.5.4; официальный репозиторий `github.com/EpicGames/UnrealEngine` требует принятия EULA):

* `Engine/Source/Runtime/Engine/Private/UnrealEngine.cpp:806-874` — `ScalabilityCVarsSinkCallback()`, сборка `ViewDistanceScale`, FOV-параметров, `StaticMeshLODDistanceScale`, overlay-scale.
* `Engine/Source/Runtime/Engine/Public/UnrealEngine.h:400-441` — `FCachedSystemScalabilityCVars`, `CalculateFieldOfViewDistanceScale()`.
* `Engine/Source/Runtime/Renderer/Private/SceneVisibility.cpp:75-90, 150, 243-250, 409-453, 711-869, 1085-1100, 1366-1490, 3675, 5987-6060` — объявление `r.StaticMeshLODDistanceScale`, fade-cvar-ы, `FrustumCull`, `LODScale`, `UpdateHLODVisibility`.
* `Engine/Source/Runtime/Engine/Private/SceneManagement.cpp:911-1119` — `ComputeBoundsScreenRadiusSquared`, `ComputeStaticMeshLOD`, `ComputeLODForMeshes`.
* `Engine/Source/Runtime/Engine/Private/LocalPlayer.cpp:57-62, 805, 1217-1225` — `r.CalcLocalPlayerCachedLODDistanceFactor`, `LODDistanceFactor = FOV/DefaultFOV`.
* `Engine/Source/Runtime/Engine/Private/SkeletalRender.cpp:119-202` — `UpdateMinDesiredLODLevel`, клэмп `RadiusScale`, гистерезис.
* `Engine/Source/Runtime/Engine/Private/Components/SkinnedMeshComponent.cpp:53-56, 4035, 4074-4076, 4142-4266` — `GSkeletalMeshLODBias` и цепочка клэмпов `UpdateLODStatus_Internal`.
* `Engine/Source/Runtime/Engine/Private/Animation/AnimUpdateRateManager.cpp` — связь предсказанного LOD с `LODToFrameSkipMap` **(строки не выписаны, сверить)**.
* `Engine/Source/Runtime/Engine/Private/World.cpp` — `UWorld::UpdateCullDistanceVolumes()` и перезапись `CachedMaxDrawDistance` **(строки не выписаны, сверить)**.
* `Engine/Source/Runtime/Landscape/Private/LandscapeRender.cpp:75-235, 483-498, 1423-1534, 4432-4461` — `landscape.Override*`, `r.Landscape*DistributionScale`, построение `LODScreenRatioSquared`, `ComputeLODFromScreenSize`, `ComputeLODForView`.
* `Engine/Source/Runtime/Landscape/Classes/LandscapeProxy.h:510-540` — дефолты `LOD0ScreenSize=0.5`, `LOD0DistributionSetting=1.25`, `LODDistributionSetting=3.0`, `bUseScalableLODSettings=false`; **`LODBlendRange` и `MaxLODLevel` — не сверены**.
* `Engine/Source/Runtime/Renderer/Private/Nanite/NaniteCullRaster.cpp:142-380, 2838-2850` — `MaxPixelsPerEdge`, `MinPixelsPerEdgeHW`, `DicingRate`, `ImposterMaxPixels`, `Culling.*`, `PixelsPerEdgeScaling`, `TimeBudgetMs`, `MaxCandidateClusters`/`MaxVisibleClusters`/`MaxNodes`.
* `Engine/Source/Runtime/Renderer/Private/Nanite/NaniteShared.cpp:81-89, 118-190, 243-268` — `UpdateLODScales`, `ScreenMultiple`, `MaxPixelsPerEdgeMultipler`.
* `Engine/Source/Runtime/Renderer/Private/DeferredShadingRenderer.cpp:1262-1282` — `LODScaleFactor` и компенсация временного апскейла.
* `Engine/Source/Runtime/Engine/Private/Rendering/NaniteStreamingManager.cpp:36-238, 1192-1226, 3095-3105` — `r.Nanite.Streaming.*` и `FQualityScalingManager`.
* `Engine/Source/Runtime/Engine/Private/StaticMeshRender.cpp:110-133` — `r.Nanite`, `r.Nanite.ProxyRenderMode`.
* `Engine/Source/Runtime/Engine/Private/LODActor.cpp:38-76, 147-180, 234-241, 348-380` — все `r.HLOD.*`.
* `Engine/Source/Runtime/Engine/Private/WorldPartition/HLOD/HLODRuntimeSubsystem.cpp:32-141` — `wp.Runtime.HLOD*`.
* `Engine/Source/Runtime/Engine/Private/HierarchicalInstancedStaticMesh.cpp:95-102` — `foliage.LODDistanceScale`, `foliage.MinimumScreenSize`.
* `Engine/Source/Runtime/Core/Public/HAL/IConsoleManager.h:135-168` — порядок приоритетов `ECVF_SetBy*`.
* `Engine/Source/Runtime/Core/Private/Misc/ConfigCacheIni.cpp:3511, 5841-5866` и `Misc/ConfigUtilities.cpp:277-320` — какая секция ini с каким приоритетом применяется, отсев `ECVF_Cheat` и не-`Scalability` переменных.
* `Engine/Source/Runtime/RenderCore/Private/RenderCore.cpp:216-234` — `r.ForceLOD`/`r.ForceLODShadow` и их отсутствие в Shipping/Test.
* `Engine/Config/BaseScalability.ini` — группы `ViewDistanceQuality@0..3/Cine`, `FoliageQuality@0..3/Cine`.

**2. Документация Epic:**

* Scalability Reference — https://dev.epicgames.com/documentation/en-us/unreal-engine/scalability-reference-for-unreal-engine
* Nanite Virtualized Geometry — https://dev.epicgames.com/documentation/en-us/unreal-engine/nanite-virtualized-geometry-in-unreal-engine
* **Nanite Technical Details** — https://dev.epicgames.com/documentation/unreal-engine/nanite-technical-details — источник цитаты про `r.Nanite.MaxCandidateClusters`/`MaxVisibleClusters`: «There is no mechanism for dynamically resizing either of these buffers, or automatically scaling down quality on overflow, which can result in rendering artifacts from them being too small for scene complexity, and typically manifesting as missing or blinking geometry».
* Creating and Using LODs — https://dev.epicgames.com/documentation/en-us/unreal-engine/creating-and-using-lods-in-unreal-engine
* Landscape (Python API, отметка о том, что `bUseScalableLODSettings` игнорирует `r.LandscapeLOD0DistributionScale`) — https://dev.epicgames.com/documentation/en-us/unreal-engine/python-api/class/Landscape

**3. Агрегаторы cvar-ов** — **дефолты и текст справки извлечены из кода машинно (версия 5.4.4) и им можно верить; сопроводительная проза сгенерирована и содержит прямые ошибки**, эталонный пример — страница `r.skeletalmeshlodbias`, утверждающая «Positive values force higher-quality LODs», что опровергается кодом и `BaseScalability.ini`:

* UE 5.4.4 Setting & CVar Wiki — https://indxzero.github.io/ue544cvarwiki/ (использованные страницы: `r.viewdistancescale`, `r.staticmeshloddistancescale`, `r.skeletalmeshlodbias`, `r.minscreenradiusfordepthprepass`, `r.minscreenradiusforcsmdepth`, `r.nanite.maxpixelsperedge`, `r.nanite.maxcandidateclusters`, `r.nanite.maxvisibleclusters`, `r.nanite.maxnodes`, `r.nanite.streaming.streamingpoolsize`, `foliage.minimumscreensize`)
* UE5 Console Variables and Commands (дамп) — https://indxzero.github.io/ue544cvarhelp/
* Unreal Directive — https://unrealdirective.com/resources/console-variables/

**4. Форумы и моды (пересказ, механизм сверен с кодом, прирост не проверялся):**

* S.T.A.L.K.E.R. 2 «Nanite tuning» (`ViewMeshLODBias.Min=-2.8`) — https://www.nexusmods.com/stalker2heartofchornobyl/mods/1353
* ARK: `r.Nanite.ViewMeshLODBias.Offset 1000` — https://survivetheark.com/index.php?/forums/topic/713618-rnaniteviewmeshlodbiasoffset-1000-rwatersinglelayer-0-on/
* Lords of the Fallen, значения `ViewMeshLODBias.Min` в пресетах — https://steamcommunity.com/app/1501750/discussions/0/6644556627471070541/
* «r.ViewDistanceScale 0 makes the complete world invisible» — https://forums.unrealengine.com/t/r-viewdistancescale-0-makes-the-complete-world-invisible/82002
* «Nanite candidate cluster buffer overflow detected» — https://forums.unrealengine.com/t/nanite-candidate-cluster-buffer-overflow-detected/1267638
* Nanite Tessellation / Dicing (дефолт `r.Nanite.DicingRate` = 2) — https://forums.unrealengine.com/t/nanite-tessellation-dicing-disable-distance/2623536
* Steam-гайды по улучшению дальности прорисовки в UE-играх (`r.LandscapeLODDistributionScale=3`) — https://steamcommunity.com/sharedfiles/filedetails/?id=2874508340
* Nanite Streaming & Memory Budgets — https://medium.com/@GroundZer0/nanite-streaming-and-memory-budgets-managing-geometry-at-scale-4c54bfa5d5b1