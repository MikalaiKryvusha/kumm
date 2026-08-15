меша достаточно плотный (`r.DistanceFields.DefaultVoxelDensity`, `Distance Field Resolution Scale` ассета). У большого меша с редким SDF 10-сантиметровая стена протечёт и вблизи — и это **расхождение документации с реальным поведением, за которое чаще всего принимают «баг Lumen»**.

### Surface Cache: разрешение карты и бюджет обновления

```
TexelDensityScale = r.LumenScene.SurfaceCache.CardTexelDensityScale
                    * (FastCameraMode ? 0.2 : 1.0)
                    * PPV.LumenSurfaceCacheResolution

MaxProjectedSize  = min( TexelDensityScale * MaxExtent * Card.ResolutionScale / ViewerDistance,
                         CardMaxTexelDensity * MaxExtent )

MinCardResolution = Clamp( round( CardMinResolution / PPV.LumenSceneDetail ), 1, 1024 )
CardMaxDistance   = MaxCardDistanceFromCamera + CardCaptureMargin

бюджет захвата (страницы) ∝ 1 / sqrt( Clamp(CardCaptureFactor, 1, 1024) )
    и одновременно ограничен CardCapturesPerFrame (300) — это draw calls, CPU
бюджет освещения          = PhysicalAtlasSize / round( UpdateFactor / LumenSceneLightingUpdateSpeed )
                            отдельно для DirectLighting (32) и Radiosity (64)
```

То есть **разрешение карты падает как 1/расстояние**, ограничено сверху `CardMaxTexelDensity` вблизи и `CardMaxResolution` абсолютно, а снизу отсекается порогом `MinCardResolution` (который тем ниже, чем выше `LumenSceneDetail`). Два бюджета захвата (тексели и число захватов) действуют **одновременно**, и упереться можно в любой: в сцене из множества мелких объектов первым кончается `CardCapturesPerFrame`, в сцене из немногих крупных — текселевый бюджет.

### Память Lumen (чего в разделе не было)

Порядок величины, чтобы понимать, что именно съело VRAM:

```
Surface Cache ≈ AtlasSize² × (число слоёв атласа: альбедо, нормали, emissive, глубина,
                              прямое освещение, косвенное/радиосити, итоговое)
                4096² при нескольких слоях — это сотни МБ, а не «16 МБ»
Radiance Cache ≈ (ProbeAtlasResolutionInProbes × FinalProbeResolution)² × (radiance + видимость неба)
                 при дефолтах (128×34)² ≈ 4352² на слой
Global SDF     ≈ Resolution³ × число клипмапов × размер вокселя-текселя
                 252³ ≈ 16 млн вокселей НА КЛИПМАП — главный ответ на «почему LumenSceneViewDistance так дорого»
Mesh SDF атлас  — отдельно, зависит от контента, к Lumen-cvar не сводится
```

Ручки памяти по убыванию отдачи: `SurfaceCache.AtlasSize`, `LumenSceneViewDistance` (число клипмапов Global SDF), `GlobalSDF.Resolution`, `RadianceCache.ProbeResolution`/`ProbeAtlasResolutionInProbes`, `NumFramesToKeepUnusedPages`.

### Radiosity

```
ProbeSpacing_эфф = ProbeSpacing / (LumenSceneLightingQuality >= 6 ? 2 : 1)
зондов           = SurfaceCacheTexels / ProbeSpacing_эфф²
лучей на зонд    = Clamp( HemisphereProbeResolution * sqrt(clamp(LumenSceneLightingQuality, 0.5, 4)), 1, 16 )²
```

`HemisphereProbeResolution` 4→3 — это 16→9 лучей на зонд, −44% работы прохода. `ProbeSpacing` 4→8 — это в 4 раза меньше зондов. Обе ручки перемножаются: GI@2 применяет обе сразу. Что при этом теряется механически: второй отскок становится грубее по направленности (меньше лучей) и по пространству (реже зонды) — интерьеры темнеют и «плоснут», причём **не мгновенно, а по мере обновления кэша**, поэтому оценивать правку сразу после её применения нельзя.

### Reflections: кто кого перебивает по шероховатости

```
MaxRoughnessToTrace = min( PPV.LumenMaxRoughnessToTraceReflections, r.Lumen.Reflections.MaxRoughnessToTraceClamp )
if (r.Lumen.Reflections.MaxRoughnessToTrace >= 0)
        MaxRoughnessToTrace = r.Lumen.Reflections.MaxRoughnessToTrace     // затирает всё
MaxRoughnessToTraceForFoliage = r.Lumen.Reflections.MaxRoughnessToTraceForFoliage
InvRoughnessFadeLength = 1 / Clamp(RoughnessFadeLength, 0.001, 1)
```

Порядок именно такой: сначала `min` c кламп-ручкой, потом **безусловная** перезапись, если основной cvar неотрицателен. Дефолт `−1` существует ровно для того, чтобы «не участвовать».

**Почему это главная ручка цены отражений:** трассируются только пиксели, прошедшие порог. Стоимость прохода ∝ доле экрана ниже порога, а распределение шероховатости по кадру нелинейно — в типичной сцене между 0.3 и 0.4 лежит большой кусок поверхностей. Поэтому шаг 0.4→0.3 может стоить больше, чем 0.6→0.5, и предсказать это без гистограммы шероховатости нельзя: **мерить**.

### Skylight leaking и Diffuse Color Boost (оба часто понимают неверно)

```
TracingParameters.DiffuseColorBoost           = 1.0 / max(PPV.LumenDiffuseColorBoost, 1.0)
TracingParameters.SkylightLeaking             = PPV.LumenSkylightLeaking
TracingParameters.SkylightLeakingRoughness    = r.Lumen.SkylightLeaking.Roughness            (0.3)
TracingParameters.InvFullSkylightLeakingDistance = 1 / clamp(PPV.LumenFullSkylightLeakingDistance, 0.1, MaxTraceDistance)
```

`DiffuseColorBoost` уходит в шейдер **как показатель степени ≤ 1**, а не как множитель: альбедо возводится в степень `1/boost`. Boost=2 превращает альбедо 0.25 в 0.5, а 0.81 — в 0.9: тёмное подтягивается сильнее светлого, картинка «выцветает». Это не эквивалент «умножить GI на 2» и не заменяет корректную экспозицию.

`SkylightLeaking` — не «немного света в интерьер», а **подмешивание скайлайта туда, где Lumen не нашёл освещённой поверхности**, с нарастанием по дистанции трассы. Отсюда его характерный вид: плоское, ненаправленное, одинаковое во всех углах свечение — по нему его и опознают в чужой игре.

### Порядок урезания (по убыванию отдачи, с механизмом)

Порядок не универсальный, но выведен из модели стоимости, а не из вкуса. После каждого шага — замер по медианам, иначе смысла нет.

| шаг | что | почему именно это | что теряем |
|---|---|---|---|
| 0 | Убедиться, что сцена GPU-упёрта (`stat unit`, CPU vs GPU busy) | Иначе всё дальнейшее — ноль | — |
| 1 | `Reflections.MaxRoughnessToTraceForFoliage` → 0 | Убирает трассы с огромной площади экрана в мире с растительностью | Отражения на листве (визуально почти незаметно) |
| 2 | `Reflections.DownsampleFactor` 1→2 | Четверть трасс отражений | «Кипение» на воде в движении — **первый кандидат на откат** |
| 3 | `RadianceCache.ProbeResolution` 32→16 | 1024→256 лучей на пробу кэша, дальний свет и так низкочастотный | Дальний GI грубее, заметнее «попы» при движении |
| 4 | `Radiosity.HemisphereProbeResolution` 4→3 | 16→9 лучей, −44% прохода второго отскока | Интерьеры темнее и грязнее, проявляется не сразу |
| 5 | `ScreenProbeGather.SpatialFilterNumPasses` 3→2 | Полноразрешающий фильтр, не масштабируется с D | Больше шума в тени |
| 6 | `TranslucencyVolume.GridPixelSize` 32→64 | В 4 раза меньше ячеек, если в сцене много VFX | Освещение дыма/частиц грубее |
| 7 | `TraceDistanceScale` 1.0→0.8 | Линейно по длине всех программных лучей | Дальний вклад пропадает, сцена слегка светлеет |
| 8 | `ScreenProbeGather.DownsampleFactor` 16→32 | Самая крупная ручка — вчетверо меньше зондов | **Самая заметная потеря**: блочность в тени, усиливается апскейлером и генерацией кадров. У нас забракован Парето-аудитом (измерение №7) |
| CPU-ветка | `SurfaceCache.MeshCardsMergeInstances=1`, `MeshCardsMinSize` ↑, `CardCapturesPerFrame` ↓, `LumenSceneViewDistance` ↓, при HWRT — `r.RayTracing.Culling` | Единственные ручки Lumen, которые двигают render thread | Мелочь выпадает из GI, дальняя сцена не отдаёт свет |

### Ловушки версий

- 5.0–5.2: `r.Lumen.ScreenProbeGather.ScreenSpaceBentNormal.*` → в 5.3/5.4 переименовано в `...ShortRangeAO.*`.
- `IrradianceFormat`, `StochasticInterpolation`, `MaxRoughnessToTraceClamp` — поздние добавления; в UE 5.1 их может не быть. Соответственно `r.Lumen.Reflections.MaxRoughnessToTrace` в 5.1 имеет **положительный** дефолт и работает не «по-новому» (не как «−1 = не переопределять») `[сверить]`.
- В 5.1 нумерация `r.Lumen.HardwareRayTracing.LightingMode` отличается от 5.3+ `[сверить]` — перенос цифры между версиями меняет смысл.
- В 5.5+ появились `r.Lumen.Reflections.DownsampleCheckerboard`, `r.Lumen.ScreenProbeGather.IntegrateDownsampleFactor`, `r.Lumen.FinalGatherMethod` — в 5.4.4 их **нет**.
- Часть имён `r.LumenScene.*` в 5.0 шла без сегмента `SurfaceCache` (`r.LumenScene.CardCaptureFactor` и т.п.).
- Нумерация режимов `r.Lumen.Visualize` менялась между версиями — не переносить.
- Вывод класса из измерения №2 действует без исключений: **имя проверяется в конкретном exe, а не в этом конспекте**.

---

## Симптом → причина

| симптом | механизм | чем лечить | как отличить от соседней причины |
|---|---|---|---|
| Крупнозернистое «кипение» непрямого света в тени, блоки размером ровно N пикселей | слишком редкая сетка зондов + темпорал не успевает | ↓ `ScreenProbeGather.DownsampleFactor`, ↑ `SpatialFilterNumPasses`, ↑ `Temporal.MaxFramesAccumulated` | **Измерить размер блока в пикселях РЕНДЕРА** (с поправкой на апскейл): если он равен текущему `DownsampleFactor` — это он и есть |
| Шум/светлячки точками, одиночные яркие пиксели | одиночные лучи попадают в мелкий яркий emissive | ↓ `ScreenProbeGather.MaxRayIntensity` (40), `Radiosity.MaxRayIntensity` (40), `Reflections.MaxRayIntensity` (100) | Светлячки не привязаны к сетке и не исчезают от `DownsampleFactor`; исчезают от клампа интенсивности с потерей энергии |
| Шлейф/«призрак» за движущимся персонажем в GI | темпоральное накопление принимает старую историю | ↓ `Temporal.MaxFramesAccumulated`, `Temporal.FastUpdateModeUseNeighborhoodClamp=1`, `RejectBasedOnNormal=1` | Длина шлейфа ≈ числу отрисованных кадров накопления; при `Temporal 0` пропадает, но появляется шум по всему кадру |
| Отражения тянутся дольше, чем GI | у отражений своя константа накопления 32 против 10 | ↓ `Reflections.Temporal.MaxFramesAccumulated` и **синхронно** `Temporal.MaxRayDirections` | Артефакт только на зеркальных/влажных поверхностях, GI при этом чистый |
| «Дышащие», медленно проявляющиеся квадраты на стенах и полу | обновление Surface Cache/радиосити амортизировано по кадрам | ↓ `Radiosity.UpdateFactor`, ↓ `DirectLighting.UpdateFactor`, ↑ `LumenSceneLightingUpdateSpeed` | Сетка привязана **к объектам**, а не к экрану: при движении камеры пятна едут вместе с геометрией. Тест: `SurfaceCache.Freeze 1` — если «дыхание» замерло, это оно |
| Розовые/пурпурные области в визуализации покрытия Surface Cache | нет покрытия картами | `[актив]` ↓ `SurfaceCache.MeshCardsMinSize`, ↓ `CardMinResolution`, проверить `MeshCardsMergeInstances`, ↑ `AtlasSize`; `[ассет]` ↑ Max Lumen Mesh Cards у меша | Видно **только** в визуализации; в обычном кадре проявляется как отсутствие вклада объекта в GI. Номер режима визуализации сверять с версией |
| Свет протекает сквозь тонкую стену/пол | Global SDF воксель толще стены; Mesh SDF действует только первые 180 см | `r.Lumen.TraceMeshSDFs=1` + `TraceMeshSDFs.Allow=1` + `ScreenProbeGather.TraceMeshSDFs=1`, ↑ `GlobalSDF.Resolution`, ↓ `GlobalSDF.ClipmapExtent` | Протечка **зависит от расстояния до камеры**: вблизи (<180 см) чисто, дальше начинается, и усиливается ступенями на границах клипмапов. Если протечка есть и вблизи — это `SkylightLeaking`, `SurfaceBias` или редкий SDF самого меша |
| Интерьеры полностью чёрные | сначала — нет покрытия картами или свет не находит путь; и только потом — «мало отскоков» | по порядку: покрытие Surface Cache → `r.LumenScene.DirectLighting=1` → `r.LumenScene.Radiosity=1` → `LumenMaxTraceDistance`/`TraceDistanceScale` → и **лишь в конце** `LumenSkylightLeaking`, `LumenDiffuseColorBoost` | Протечка через leaking — плоская, без направленности; недостаток отскоков — с направленностью, но тёмный; отсутствие карт — объект вообще не отдаёт свет ни при каком освещении |
| Мерцающая трава/листва в тени | экранные трассы попадают в высокочастотную альфа-тестовую геометрию с шумной глубиной | `HZBTraversal.SkipFoliageHits` (дефолт 1), `TwoSidedFoliageBackfaceDiffuse`, `ShortRangeAO.ScreenSpace.FoliageOcclusionStrength` | Мерцание идёт по кадрам **на месте**, а не движется с камерой. **Наше измерение №4: `SkipFoliageHits` 1→0 не влияет на артефакты, привязанные к камере** |
| Освещение заметно меняется при повороте камеры, объект «подсвечивается», когда попадает на экран | экранные трассы дают вклад только для того, что на экране; за кадром работает более грубый мировой путь | диагностика: `ScreenProbeGather.ScreenTraces 0` (дороже, но убирает зависимость от кадра); лечение — покрытие Lumen Scene, `LumenSceneViewDistance`, HWRT | Артефакт воспроизводится **поворотом камеры без движения**; при `ScreenTraces 0` исчезает |
| Персонаж не отбрасывает непрямую тень, не подсвечивает пол, «парит» | у скелетного меша нет Mesh SDF и карт — при SWRT его в Lumen Scene просто нет | принципиально — HWRT; паллиатив — `ShortRangeAO` (контактные тени), экранные трассы | Проверяется остановкой: статичный персонаж всё равно не даёт GI-тени, тогда как статик-меш рядом даёт |
| Emissive-меш/лампа не светит в GI | нет карт (мелкий меш), отсечён порогами, или луч зарезан клампом яркости | ↓ `SurfaceCache.MeshCardsMinSize`, ↓ `MeshSDF.RadiusThreshold`, ↑ `MaxRayIntensity`; правильное решение — реальный источник света | Проверить покрытие в визуализации: если карт нет — никакая яркость материала не поможет |
| GI не совпадает с анимированной листвой/тканью | World Position Offset не участвует в захвате Surface Cache | смириться либо снизить амплитуду WPO `[ассет]` | Рассинхрон **стационарный по фазе анимации**, не мерцание |
| Отражения пропадают на средне-шероховатых материалах | пиксель выше `MaxRoughnessToTrace` | ↑ `MaxRoughnessToTraceClamp`, ↑ PPV `LumenMaxRoughnessToTraceReflections`, ↑ `ForFoliage`; проверить, не стоит ли `MaxRoughnessToTrace >= 0` (перебивает всё) | Граница **резкая по материалу**, ширина перехода задаётся `RoughnessFadeLength`; при экранной причине граница шла бы по краю экрана |
| Дыра в specular: слишком гладко для «rough specular», слишком шероховато для трассировки | рассогласование `Reflections.MaxRoughnessToTrace` и `ScreenProbeGather.MaxRoughnessToEvaluateRoughSpecular` | привести пороги в соответствие, расширить `RoughnessFadeLength` | Полоса по шероховатости, а не по экрану и не по расстоянию |
| Отражения обрываются у краёв экрана, «вырезанные» силуэты за передним объектом | закончились экранные трассы / дизокклюзия: за объектом нет данных SceneColor | `Reflections.DistantScreenTraces=1`, `SampleSceneColorAtHit=1`, HWRT | Артефакт мигрирует **вместе с рамкой кадра** при повороте камеры — Lumen-отражения остаются частично экранными |
| «Кипение» на воде после урезаний | `Reflections.DownsampleFactor=2` без живого темпорала | вернуть `DownsampleFactor=1` **или** включить `Reflections.Temporal` | Пропадает при возврате DownsampleFactor в тот же заход |
| GI «отстаёт» при быстром полёте камеры | Surface Cache и Radiance Cache не успевают обновиться в пределах бюджета | `r.LumenScene.FastCameraMode=1` (режет плотность карт ×0.2 и разрешение проб/сетки ÷2, зато сходится быстрее), ↑ `NumProbesToTraceBudget`, ↓ `UpdateFactor` | Артефакт появляется **только в движении** и рассасывается за секунду после остановки |
| После смены дня/ночи освещение «доезжает» секунду | обновление кэша амортизировано; ускорение включается отдельно | `r.LumenScene.PropagateGlobalLightingChange=1`, ↑ `LumenSceneLightingUpdateSpeed` | Привязано к событию смены освещения, а не к движению камеры. Побочный эффект включения — пики кадрового времени |
| Пропали контактные тени, объекты «парят» | выключен ShortRangeAO | `ScreenProbeGather.ShortRangeAO=1`, при необходимости `ApplyDuringIntegration=1` (помнить: форсит SH3 и дорожает) | Отсутствует именно короткий градиент у основания объекта; крупная окклюзия при этом на месте |
| Мелочь (камни, мусор, трава) исчезла из GI после правки | подняты `MeshSDF.RadiusThreshold` / `MeshCardsMinSize`, либо включён `MeshCardsMergeInstances` | вернуть пороги; при слиянии — это ожидаемая цена | Объекты видны, но не отдают и не принимают локальный отражённый свет; в визуализации карт у них ничего нет |
| Включили HWRT — просела частота, GPU при этом не загружен | апдейты RT-сцены и BLAS при большом числе инстансов — это CPU/render thread | `r.RayTracing.Culling` и его `.Radius`/`.Angle`, ↓ числа инстансов | `stat unit`: растёт Draw, а не GPU |
| Вырос VRAM после правок Lumen | атласы Surface Cache / Radiance Cache / клипмапы Global SDF | ↓ `SurfaceCache.AtlasSize`, ↓ `LumenSceneViewDistance`, ↓ `GlobalSDF.Resolution`, ↓ `RadianceCache.ProbeAtlasResolutionInProbes` | `r.LumenScene.Stats 1`; тест `ForceEvictHiResPages 1` |
| Прямая линия/ступень по земле, привязанная к камере | **не Lumen.** Шов между каскадами CSM | `r.Shadow.MaxCSMResolution` 4096, `r.Shadow.CSM.TransitionScale`, `r.Shadow.DistanceScale` | **Выключение Lumen GI целиком артефакт не убирает** (наше измерение №4). Это и есть разделяющий признак |
| Урезали Lumen — частота не выросла | сцена упирается в CPU | сначала `stat unit`: Game thread или Draw? Если Game — Lumen ни при чём вовсе; если Draw — работают только CPU-ручки Lumen Scene | Наше измерение №9: на панораме CPU busy 28.1 мс против GPU busy 6.2 — GPU-ручки бесполезны. Разделение Game/Draw у нас **ещё не сделано**, поэтому CPU-ветка Lumen формально не исключена |

---

## Опыт сообщества

**Проверено и подтверждено первоисточником (Epic, документация и код):**

- `r.Lumen.ScreenProbeGather.DownsampleFactor` — главная ручка стоимости Final Gather. Арифметика зондов: 16→32 = **вчетверо** меньше зондов. Epic при этом заявляет примерно двукратный шаг стоимости между уровнями `sg.GlobalIlluminationQuality` — **это не противоречие, а разные величины**: уровень качества меняет много параметров сразу, а фильтрация, интеграция и Lumen Scene не масштабируются как 1/D². Ожидать «вчетверо дешевле GI» от одного этого cvar — ошибка расчёта того же класса, что наше измерение №5.
- `r.Lumen.Reflections.MaxRoughnessToTraceForFoliage` — Epic прямо рекомендует опустить до 0 как раннюю экономию в сценах с растительностью. Дефолт 0.2, на RQ@3 = 0.4.
- `r.LumenScene.DirectLighting.MaxLightsPerTile` — рекомендованный Epic способ снять чувствительность к общему числу источников; допустимы только 4/8/16/32.
- Epic рекомендует **отключать Detail Tracing (`r.Lumen.TraceMeshSDFs 0`) в открытых мирах с плотной растительностью** — то есть «0» здесь не деградация, а другой режим. Обмен: протечки на тонкой геометрии.
- Software RT трассирует по индивидуальным Mesh SDF «первые два метра», дальше — Global SDF. Число из кода: 180 см.
- Lumen Scene по умолчанию покрывает ~200 м (`LumenSceneViewDistance` 20000 см), расширяется до ~800 м; Far Field — до ~1 км, и он только для HWRT.
- Статический свет с Lumen не работает: вклад Static Lights отключается полностью.
- Переполнение атласа Radiance Cache даёт **неправильный рендер**, а не деградацию (help-текст Epic).

**Где документация Epic расходится с поведением (и это надо держать в голове):**

- «Стены не тоньше 10 см» — верно только в зоне Mesh SDF (первые 180 см) и только при достаточной плотности SDF самого меша. Дальше действует Global SDF с вокселем ~20 см на клипмапе 0 и вдвое больше на каждой следующей октаве.
- «Первые два метра» — в коде 180 см, а не 200.
- «Фиксированная стоимость Lumen ~N мс» — цена делится на резолюшн-зависимую и резолюшн-независимую части; вторая (Lumen Scene) не падает от снижения разрешения вообще, а вдобавок имеет CPU-составляющую, которой в перф-гайде нет.
- «Lumen Reflections заменяют SSR» — Lumen-отражения **начинаются с экранной трассы** (`Reflections.ScreenTraces=1`) и наследуют экранные артефакты дизокклюзии. «Без SSR-артефактов» — маркетинг, а не поведение.
- Ползунки PPV в UI ограничены 0.25…2, а формулы в коде проверяют пороги 4.0 и 6.0 — из редактора эти ветки недостижимы, из чужой игры тем более. Документация про них молчит.
- Документация описывает `LumenDiffuseColorBoost` как усиление непрямого света; в коде это **показатель степени для альбедо**, эффект нелинейный и обесцвечивающий.

**Советовали (без замера, работает не у всех):**

- `r.Lumen.ScreenProbeGather.ScreenTraces.HZBTraversal.SkipFoliageHits 0` против мерцания травы — совет из документации к пакам растительности и форумных тредов. У нас (измерение №4) на артефакт, за который его брали, не подействовал вообще.
- `r.Lumen.ScreenProbeGather.ScreenTraces.HZBTraversal 0` — там же; выключает точный обход HZB целиком, тонкие объекты начинают пропускаться. Классический случай «лечим симптом, ломаем механизм».
- `StochasticInterpolation=1` + `SpatialFilterNumPasses=2` как «рекомендованный набор» — совпадает с тем, что Epic ставит на GI@2, но подаётся в статьях как универсальный совет для любого уровня.
- Skylight Min Occlusion = 1.0 против мерцания травы — автор статьи утверждает, что тестировал; механизм (скайлайт перестаёт выдавать околонулевую окклюзию на тонких листьях) правдоподобен, но это правка ассета `[ассет]`, а не cvar, и в чужой игре недоступна.

**Мифы, которые ломаются об исходники:**

- «`r.Lumen.Reflections.MaxRoughnessToTrace=0` выключает отражения» — нет. Выделенные лучи перестают пускаться, но rough specular продолжает приходить из Screen Probe Gather. Выключают `r.Lumen.Reflections.Allow=0` или `r.ReflectionMethod`.
- «`LumenFinalGatherQuality=2` удваивает плотность зондов» — нет, порог в коде **6.0**. При 2 меняется только число лучей (через `sqrt`) и джиттер (порог 4.0).
- «Поднять `TracingOctahedronResolution` до 32 — будет лучше» — нет, кламп [4, 16], а нестандартные значения ещё и рискуют отключить importance sampling.
- «`sg.GlobalIlluminationQuality 0` выключает Lumen целиком» — выключает только GI (`DiffuseIndirect.Allow=0`); отражения живут в `sg.ReflectionQuality`, **а Lumen Scene продолжает считаться, пока хоть один из двух методов — Lumen**.
- «Достаточно написать `r.Lumen.HardwareRayTracing=1` в ini, и в игре включится рейтрейсинг» — нужны ещё RT-шейдеры в билде, `r.RayTracing=1` на старте RHI и DX12. Дефолт cvar в коде — **0**.
- «Выключить экранные трассы, чтобы сэкономить» — экранная трасса дешевле мировой; выключение переносит все лучи в SDF/BVH и делает кадр дороже.
- «Понизил разрешение / включил DLSS — Lumen подешевел пропорционально» — подешевели Final Gather, отражения и объём прозрачного; Lumen Scene (Surface Cache, DirectLighting, Radiosity, захваты карт) не подешевел вообще.
- «Персонаж не отбрасывает непрямую тень — надо покрутить bias» — при программной трассировке скелетных мешей в Lumen Scene **нет**; крутить нечего.
- «Emissive-материал = источник света в Lumen» — только через карты Surface Cache; мелкий объект без карт не светит совсем, а яркий точечный — режется `MaxRayIntensity`.
- «Пересобрал Reflection Captures, отражения Lumen станут точнее» — Lumen их не использует (кроме опции Hit Lighting при HWRT).
- «`r.Lumen.DiffuseIndirect.Allow=0` убирает всю стоимость Lumen» — не убирает Lumen Scene, если отражения — Lumen.
- «Скопировать конфиг из гайда по другой игре» — измерение №2: 764 из 1173 наших строк называли cvar, которого в билде нет. Форумные «оптимизационные ini» состоят из таких строк на 60%+, и их «эффект» — плацебо.

---

## Проверено нами

*(Palworld 1.0.3, UE ~5.1 (версия не подтверждена прибором), RTX 5070 Ti, Ryzen 7 5700G, 4K, DLSS, панель 144 Гц. Читать только медианы и перцентили — измерение №8: CPU busy p50 = 0.48 мс против p90 = 36, среднее по такой выборке бессмысленно.)*

> Нумерация приведена в соответствие со ссылками в тексте раздела и с `games/Palworld/README.md`. В прежней редакции локальный список и внутренние ссылки (№1, №2, №4, №5, №8, №9) указывали на разные измерения — при чтении «по ссылке» это давало неверный источник.

1. **`Engine.ini [SystemSettings]` в Palworld доезжает до сцены** — доказано прибором мода UE4SS, логирующим значение ДО перезаписи: он застал `grass.CullDistanceScale=4.0`, GuardBand 2.0/2.2, `ViewDistanceScale=2.2`, `MaxCSMResolution=1536` — ровно значения ini, которых нет больше нигде. **Но** `foliage.LODDistanceScale` застали равным 2.0 при 4 в ini: отдельные строки игра перебивает. Секции `[ConsoleVariables]` и `[/Script/Engine.RendererSettings]` ненадёжны: `r.NGX.DLSS.DilateMotionVectors` лежал там и до сцены не дожил.
2. **Из 1173 присваиваний в нашем `Engine.ini` 764 задают cvar, которого в билде НЕТ.** Вывод класса: всегда сверять имена со списком зарегистрированных в exe, прежде чем обсуждать значение.
3. **Файл может врать про живое состояние.** В живом блоке мода `r.Lumen.ScreenProbeGather.TraceMeshSDFs` стоял **0**, при том что документация правки утверждала 1. Читать надо то, что применяется, а не то, что написано.
4. **Lumen не при чём в артефакте «прямая линия по земле, привязанная к камере».** Тесты, которые НЕ помогли и тем исключили классы гипотез: `HZBTraversal.SkipFoliageHits` 1→0; `r.Lumen.TraceMeshSDFs.TraceDistance` 180→800; `MeshSDF.RadiusThreshold` 0.025→0.01 (**единица измерения этого cvar у нас не сходится с дампом 5.4.4, где значение 30 — до сверки считать тест непроверенным по инструменту**); **выключение Lumen GI целиком**. Лечение оказалось теневым: `MaxCSMResolution` 4096 (главное лекарство), `CSM.TransitionScale` 2.0, `Shadow.DistanceScale` 1.5; снятие 4096 возвращает артефакт в тот же заход.
5. **`r.Lumen.ScreenProbeGather.TracingOctahedronResolution` 8 → 16 стоит ~0.3 мс**, а не «больше половины выигрыша», как предсказывал расчёт по числу лучей. Причина установлена по исходнику: кламп `Clamp(round(sqrt(LumenFinalGatherQuality) × cvar), 4, 16)`.
6. **Правка 15.08.2026 — гипотезы, замера ПОСЛЕ ещё нет** (записано дословно в `games/Palworld/tuning-2026-08-15-base-fps.md`): `RadianceCache.ProbeResolution` 32→16 (лучей на пробу 1024→256), `RadianceCache.NumProbesToTraceBudget` 300→200, `Radiosity.HemisphereProbeResolution` 4→3 (16→9 лучей, −44% работы прохода), `r.Lumen.TraceDistanceScale` 1→0.8, `HZBTraversal.MaxIterations` 32→24 (дефолт UE 5.4 = 50; **значение 32 в нашем ini означает, что кто-то его уже правил, либо в 5.1 дефолт другой — сверить**), `r.Lumen.Reflections.DownsampleFactor` 1→2. Отдельно зафиксирован порядок отката: `Reflections.DownsampleFactor` → 1 первым, если на воде появится кипение в движении.
7. **`r.Lumen.ScreenProbeGather.DownsampleFactor=16` намеренно не тронут.** Шаг до 32 экономит заметно, но Парето-аудит забраковал его по картинке: разреженная сетка зондов вместе с DLSS и генерацией кадров усиливает темпоральные артефакты в тени и под листвой. Механизм: зонды считаются в пикселях рендера, апскейлер растягивает блок, а генерация кадров удваивает время жизни каждого артефакта на экране.
8. **Прибор и статистика.** Открытый Intel PresentMon не метит кадры DLSS-G (приходят как Application); при включённой генерации `MsBetweenPresents` перестаёт показывать базовую частоту (давал «медиану 150 к/с» при лимите 141). Базовая частота читается только с оверлея NVIDIA. Распределение сильно скошено: CPU busy p50 = 0.48 мс против p90 = 36 — работать только с медианами и перцентилями, среднее бессмысленно.
9. **Смежное, но обязательное к учёту при любых Lumen-правках:** на панораме (25–45 к/с) CPU busy 28.1 мс против GPU busy 6.2 — игра упирается в CPU (Ryzen 7 5700G, мир грузится в один поток). Никакая экономия на **GPU-части** Lumen там частоту не поднимет; снижение разрешения через DLSS тоже не лечит. **Уточнение к прежней формулировке «никакая экономия на Lumen»:** у Lumen есть render-thread составляющая (захваты карт, обновление Lumen Scene, при HWRT — апдейты RT-сцены), и она этим измерением НЕ исключена. Чтобы закрыть вопрос, нужен `stat unit` с разделением Game/Draw — этого замера у нас пока нет.

---

## Открытые вопросы (не закрыты этим разделом)

1. **Версия движка Palworld 1.0.3** — «~5.1» не подтверждена прибором. До подтверждения любые дефолты из дампа 5.4.4 применительно к этой игре — гипотезы.
2. **Единица `r.Lumen.DiffuseIndirect.MeshSDF.RadiusThreshold`** — 30 (дамп 5.4.4) против 0.025 (наш журнал правок). Одно из двух неверно или относится к разным версиям/cvar.
3. **Разделение Game thread / Render thread на панораме** — без него нельзя утверждать, что CPU-ветка Lumen (п. «Порядок урезания», CPU-ветка) бесполезна.
4. **Список фактически зарегистрированных `r.Lumen.*` в exe Palworld** — есть только доля фантомов по всему ini (65%), но не поимённая карта по Lumen. Пока её нет, каждая правка Lumen в этой игре — с вероятностью большей нуля правка ничего.
5. **Помеченные `[сверить]` значения** — по ним раздел не является источником истины.
6. **Замер ПОСЛЕ правки 15.08.2026** (измерение №6) не сделан; без него шесть изменённых cvar остаются гипотезами, а не знанием.

---

## Источники

1. UE Setting & Cvar Wiki (дамп исходников **UE 5.4.4** с цитатами объявлений `FAutoConsoleVariableRef`/`TAutoConsoleVariable`, значениями по умолчанию, флагами ECVF и ссылками на файл:строку) — https://indxzero.github.io/ue544cvarwiki/ ; страницы вида `…/articles/r.lumen.screenprobegather.downsamplefactor/`. Отсюда взяты все дефолты без пометки `[сверить]` и все процитированные фрагменты кода (`LumenScreenProbeGather.cpp`, `LumenReflections.cpp`, `LumenSceneLighting.cpp`, `LumenSceneRendering.cpp`, `LumenTracingUtils.cpp`, `LumenDiffuseIndirect.cpp`, `LumenRadianceCache*`, `LumenTranslucencyVolumeLighting.cpp`, `LumenHardwareRayTracingCommon.cpp`).
2. `Engine/Config/BaseScalability.ini` — секции `[GlobalIlluminationQuality@0..3, @Cine]` и `[ReflectionQuality@0..3, @Cine]`, дословно: https://gist.github.com/AltimorTASDK/2c59a9f2a69ede0c3ea2c17da0d4830b
3. Epic, Lumen Performance Guide — https://dev.epicgames.com/documentation/en-us/unreal-engine/lumen-performance-guide-for-unreal-engine
4. Epic, Lumen Technical Details — https://dev.epicgames.com/documentation/en-us/unreal-engine/lumen-technical-details-in-unreal-engine
5. Epic, Lumen Global Illumination and Reflections (настройки PostProcessVolume, ограничения: скелетные меши, WPO, emissive, статический свет) — https://dev.epicgames.com/documentation/en-us/unreal-engine/lumen-global-illumination-and-reflections-in-unreal-engine
6. Epic, Mesh Distance Fields (предусловия программной трассировки, плотность вокселей, двусторонняя генерация) — https://dev.epicgames.com/documentation/en-us/unreal-engine/mesh-distance-fields-in-unreal-engine
7. Epic API, `EConsoleVariableFlags` (лестница приоритетов `SetBy*`, `ECVF_ReadOnly`) — https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/Core/EConsoleVariableFlags
8. Epic, Console Variables in C++ — https://dev.epicgames.com/documentation/unreal-engine/console-variables-cplusplus-in-unreal-engine
9. Форум Epic, «Foliage Grass flickering in the shadow UE5 Lumen» (пересказ, не проверено нами) — https://forums.unrealengine.com/t/foliage-grass-flickering-in-the-shadow-ue5-lumen/562118
10. Dre Dyson, разбор мерцания листвы под Lumen (автор заявляет о тесте; нами не воспроизведено) — https://dredyson.com/fix-foliage-grass-flickering-in-shadow-ue5-lumen-in-under-5-minutes-the-quick-complete-step-by-step-guide-that-actually-works-tested-proven-method/
11. Наши измерения: `d:\work\ai_sandbox\KUMM\games\Palworld\README.md`, `d:\work\ai_sandbox\KUMM\games\Palworld\tuning-2026-08-15-base-fps.md`, `d:\work\ai_sandbox\KUMM\EXPERIENCE.md`.