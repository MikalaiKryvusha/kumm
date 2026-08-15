# DLSS, FSR, генерация кадров и задержка

**Легенда достоверности** (проставлена в колонке дефолта):

**✔** — **имя и текст справки** вытащены из строк самого шипящего билда (`Palworld-Win64-Shipping.exe`, UE 5.1 + плагины DLSS/Streamline/FSR2). Для *имени* это первичный источник, сильнее любой документации.
**⚑** — **числовое значение прочитано живьём** в загруженном мире (консоль/UE4SS), а не выведено из текста. Единственная категория, которой можно верить в колонке «дефолт».
**◇** — из документации Epic/NVIDIA/AMD или из устройства движка; в конкретном билде проверять.
**✖** — имя в билде ОТСУТСТВУЕТ (строка в ini ничего не делает).

**Три оговорки к методу, без которых легенда врёт:**

1. **✔ не доказывает дефолт.** Экстрактор достаёт из бинарника *строки*: имя и текст справки. Число, с которым cvar зарегистрирован, в строковую таблицу не попадает. Поэтому «дефолт 2 ✔» на самом деле означает «в тексте справки рядом со значением 2 стоит слово (default)» — это **проза Epic/NVIDIA, а не состояние вашего билда**. Автор справки правит текст и забывает число (и наоборот) регулярно. Ниже все такие дефолты помечены ✔, но читать их следует как «заявлено в справке».
2. **В этом разделе НЕТ ни одного ⚑.** Ни одно значение из таблиц не было прочитано из живого мира. Это главная дыра раздела, а не мелочь: п. 2 «Проверено нами» уже показал, что игра перебивает часть ini своим кодом, — значит расхождение «справка ↔ живое значение» здесь не гипотеза, а ожидаемое состояние.
3. **✖ надёжнее, чем ✔, но не абсолютно.** Отсутствие строки — сильное доказательство, но экстрактор ловит только то, что лежит в бинарнике целиком. Контрпример из нашего же дампа: `sg.GlobalIlluminationQuality.NumLevels` в списке есть, а `sg.GlobalIlluminationQuality` — нет, хотя движок его точно регистрирует. Симметрично: `r.Vsync` в списке есть, но это, скорее всего, строка из справки/лога, а регистрируется `r.VSync`. Вывод: **присутствие в дампе ≠ живой cvar, отсутствие ≠ железное «нет»; спорные случаи добивать чтением в мире.**

---

## Что это и когда сюда лезть

Подсистема отвечает на один вопрос: **сколько пикселей движок реально считает и сколько кадров реально рисует**. Всё остальное в разделе — производные от этого. UE5 рендерит сцену во внутреннем разрешении `PrimaryScreenPercentage`, затем темпоральный апскейлер (TSR, TAAU, DLSS-SR или FSR2) восстанавливает целевое разрешение, накапливая историю по джиттеру субпикселей. Апскейлер в UE5 — подключаемый: движок держит глобальный `GTemporalUpscaler`, и плагин DLSS его подменяет целиком. Отсюда главное следствие всего раздела: **при активном DLSS проходы TSR и TAA в графе кадра не создаются вообще**, а значит все `r.TSR.*` и `r.TemporalAA*` становятся мёртвым грузом — они прекрасно ставятся, прекрасно читаются обратно и ни на что не влияют.

**Но подмена не безусловна.** Темпоральный апскейлер (любой, включая DLSS) включается в тракт только тогда, когда режим апскейла — темпоральный, а он выбирается по методу сглаживания ◇:

```
AntiAliasingMethod ∈ {TAA(2), TSR(4)}  И  r.TemporalAA.Upsampling = 1
        → PrimaryScreenPercentageMethod = TemporalUpscale  → работает GTemporalUpscaler (DLSS)
иначе   → PrimaryScreenPercentageMethod = SpatialUpscale   → работает r.Upscale.Quality, DLSS ВЫПАДАЕТ
```

Отсюда ловушка, которой в разделе не было и которая стоит людям качества картинки: **`r.AntiAliasingMethod=0` («выключить размыливающий TAA») выключает и DLSS.** Внутреннее разрешение при этом остаётся прежним (58% или 50%), а восстанавливает его бикубик — то есть вы получаете честное мыло вместо мнимого. То же делает `r.TemporalAA.Upsampling=0` и `r.TemporalAA.Upscaler=0`.

Генерация кадров (DLSS-G, плагин Streamline) живёт ещё дальше по конвейеру — на уровне цепочки показа, а не рендера. Она интерполирует кадр между двумя настоящими, поэтому **обязана удерживать уже готовый кадр** до момента показа. Это не «бесплатные кадры»: экранная частота растёт, задержка растёт тоже. Reflex — второй кусок того же плагина, он подрезает очередь и разгоняет игровой поток так, чтобы кадр начинался как можно позже. Сюда же примыкает буферизация RHI (`RHI.MaximumFrameLatency`, `r.OneFrameThreadLag`, `r.GTSyncType`): это кадры, которые лежат в очереди и превращаются в задержку линейно.

И четвёртый слой, который перекрывает все три: **драйвер**. NVIDIA App/NVCP умеют молча подменить модель DLSS, включить или расширить генерацию кадров, навязать свой лимит частоты и свой режим низкой задержки — поверх любого вашего ini. Конфиг игры при этом не меняется и продолжает врать. См. §«Как считается», п. 9.

**Симптомы, которые лечатся здесь.** «Ватное» управление при высоком FPS на счётчике (кратность генерации + очередь кадров). Шлейфы и «мыло» за тонкими объектами в движении (векторы движения, пресет DLSS, `DilateMotionVectors`). Шлейф за травой и листвой (WPO-анимация без скоростей — `r.Velocity.EnableVertexDeformation`, `r.Velocity.EnableLandscapeGrass`). Мерцание/кипение на генерируемых кадрах вокруг интерфейса (теги UI для Streamline). Ненормально сильный motion blur при включённой генерации (`AdjustMotionBlurTimeScale`). Просадки, которые «не лечатся снижением разрешения» — признак, что упор в игровой поток, а не в GPU, и весь этот раздел бесполезен (см. §«Проверено нами», п. 9). И отдельный класс: **настройка выставлена, а ничего не изменилось** — почти всегда это либо фантомное имя, либо перекрытие по приоритету, либо инертный при DLSS cvar, либо замещение в драйвере.

---

## Таблица параметров

### A. Маршрутизация разрешения и апскейла

| cvar | дефолт | единица/шкала | что делает | цена | ловушки |
|---|---|---|---|---|---|
| `r.ScreenPercentage` | **0** ◇ (UE4 было 100) | % по каждой оси | Первичная доля разрешения. Билд: «To render in lower resolution and upscale for better performance… in percent, >0 and <=100, larger numbers are possible (supersampling)… <0 is treated like 100» ✔ | пиксели ~ доля², самый крупный рычаг GPU | В UE5 дефолт **не 100**. Пустое значение не значит «100%» — работает `r.ScreenPercentage.Mode`. Значение >0 переводит в ручной режим ◇. Справка про «>0 и <=100» врёт в обе стороны: реальный коридор задаёт апскейлер (см. §2а) |
| `r.ScreenPercentage.Mode` | 1 ✔ **(из прозы справки, не проверено)** | 0/1 | «0: Controls the view's screen percentage based on r.ScreenPercentage; 1: … based on displayed resolution with r.ScreenPercentage.Auto.\* (default)» ✔ | — | Самый недооценённый cvar раздела. **Но дефолт здесь спорный:** в стоковом UE5 игровой путь обычно уходит в Manual, а «(default)» в справке относится к редакторному сценарию. Косвенный аргумент из наших замеров: на 4K авто дало бы ~50%, а мы наблюдали устойчивые 58% — значит фактически режим был ручным. **Требует чтения живьём** |
| `r.ScreenPercentage.Auto.PixelCountMultiplier` | 1.0 ◇ | множитель к 1920×1080 | Целевой бюджет пикселей для авто-режима | — | На 4K авто-режим даёт около 50% при множителе 1 ◇. Прочих `r.ScreenPercentage.Auto.*` в билде нет — этот единственный |
| `r.ScreenPercentage.MinResolution` | 0.0 ◇ | вертикаль 16:9 | Нижний ограничитель авто-режима | — | 0 = ограничитель выключен |
| `r.ScreenPercentage.MaxResolution` | 0.0 ◇ | вертикаль 16:9 | «Controls the absolute maximum number of rendered pixel before any upscaling such that doesn't go higher than the specified 16:9 resolution» ✔ | — | Режет сверху даже ручной `r.ScreenPercentage` |
| `r.SecondaryScreenPercentage.GameViewport` | 0 ◇ | % | Вторичная доля: пространственный масштаб уже готовой картинки (DPI) | дешевле первичной | 0 = авто (1/DPIScale). Множится с первичной, а не заменяет её |
| `sg.ResolutionQuality` | 100 ◇ | 0..100 | **Группа scalability, которая пишет именно `r.ScreenPercentage`.** Ползунок «масштаб разрешения» в меню игры идёт сюда | — | **Пропущено в исходной версии раздела, а это половина жалоб «мой r.ScreenPercentage не применился».** Пишет с приоритетом `SetByScalability` (1) — то есть ваша строка в `[SystemSettings]` (4) его переживает. Обратное неверно: код игры (8) переживает вас |
| `r.TemporalAA.Upsampling` | 1 ✔ | 0/1 | «0: use spatial upscale pass independently of TAA; 1: TemporalAA performs spatial and temporal upscale as screen percentage method (default)» ✔ | — | При 0 апскейл делает `r.Upscale.Quality`, а темпоральный апскейлер (в т.ч. DLSS) из тракта выпадает |
| `r.TemporalAA.Upscaler` | 1 ✔ | 0/1 | «Choose the upscaling algorithm. 0: Forces the default temporal upscaler of the renderer; 1: GTemporalUpscaler which may be overridden by a third party plugin (default)» ✔ | — | **Это выключатель DLSS/FSR2 на уровне движка.** 0 = плагин отрезан, вернулись на TSR |
| `r.AntiAliasingMethod` | 4 = TSR ✔ | 0..4 | «Engine default (project setting) for AntiAliasingMethod… 0: off, 1: FXAA, 2: TAA, 3: MSAA (desktop forward only), 4: Temporal Super-Resolution (TSR, Default)» ✔ | — | Два разных факта, которые путают. (а) При активном DLSS значение **не доказывает ничего**: апскейлер подменён плагином, а cvar продолжает показывать 2 или 4. (б) Значения **0, 1, 3 выключают DLSS вообще** — темпорального апскейла в тракте не возникает, и внутренние 58% растягивает бикубик ◇ |
| `r.Upscale.Quality` | 3 ✔ | 0..5 | «0: Nearest, 1: Bilinear, 2: Directional blur…, 3: 5-tap Catmull-Rom bicubic (default), 4: 13-tap Lanczos 3, 5: 36-tap Gaussian» ✔ | 4–5 заметно дороже | Работает только на ПРОСТРАНСТВЕННОМ апскейле. При DLSS/TSR не участвует — **кроме случая, когда вы сами уронили тракт в spatial через `r.AntiAliasingMethod`** |
| `r.Upscale.Softness` | 1.0 ◇ | 0..1+ | Мягкость ядра пространственного апскейла ✔ | — | Пара к предыдущему; так же мертва при DLSS |
| `r.ViewTextureMipBias.Min` / `.Offset` | −2.0 / −0.3 ◇ | mip | Смещение mip-уровня материалов при апскейле: движок сам добавляет ≈ `log2(доля) + Offset`, зажимая снизу `Min` ◇ | — | **Механизм, который объясняет «почему при DLSS текстуры не мылятся сами по себе».** Именно его дёргает `r.FidelityFX.FSR2.AdjustMipBias`. Правка `r.Streaming.MipBias` для «резкости» — не тот рычаг: это стриминг, а не выборка |
| `r.VelocityOutputPass` | 0 ◇ | 0/1/2 | «0: во время depth pass (разделяет его на две фазы); 1: в обычном base pass (лишний GBuffer-таргет); 2: после base pass» ✔ | 1 стоит пропускной способности | Ключ к качеству любого темпорального апскейла |
| `r.Velocity.EnableVertexDeformation` | −1 ◇ (авто) | −1/0/1 | Писать ли скорости для геометрии, которую двигает World Position Offset ✔ | заметная на листве | **Пропущено в исходной версии, а это ровно тот cvar, которым лечится шлейф за травой и ветками.** `r.VelocityOutputPass` решает *где* писать скорость, а этот — *писать ли её вообще для WPO* |
| `r.Velocity.EnableLandscapeGrass` | 1 ◇ | 0/1 | Скорости для травы ландшафта ✔ | — | Пара к предыдущему; в травяных играх (Palworld) — первый подозреваемый по шлейфам |
| `r.BasePassOutputsVelocity` | — ✔ | — | «Deprecated CVar. Use r.VelocityOutputPass instead» ✔ | — | Строка из старых гайдов, живёт в сотнях ini впустую |
| `r.Velocity.ForceOutput` | 0 ✔ | 0/1 | «Force velocity output on all primitives. This can incur a performance cost unless r.VelocityOutputPass=1» ✔ | заметная | Отладочный инструмент: включили — шлейф пропал → виноваты скорости, дальше лечить точечно двумя строками выше |
| `r.DynamicRes.OperationMode` | 0 ◇ | 0/1/2 | 0 — выключено, 1 — включается игрой, 2 — принудительно | — | Динамика перетирает ваш `r.ScreenPercentage` каждые несколько кадров |
| `r.DynamicRes.FrameTimeBudget` | 33.3 ◇ | мс | Бюджет кадра, от которого пляшет эвристика | — | 33.3 = 30 к/с; под 144 Гц бессмысленно |
| `r.DynamicRes.MinScreenPercentage` / `MaxScreenPercentage` | 50 / 100 ◇ | % | Границы динамики | — | Динамика не выйдет за них, сколько ни проси |
| `r.DynamicRes.MinResolutionChangePeriod`, `.ChangePercentageThreshold`, `.TargetedGPUHeadRoomPercentage`, `.HistorySize`, `.UpperBoundQuantization`, `.FrameWeightExponent`, `.MaxConsecutiveOverbudgetGPUFrameCount`, `.GPUTimingMeasureMethod`, `.IncreaseAmortizationBlendFactor` | тонкая настройка ◇ | — | Гистерезис и инерция динамики ✔ | — | Все живые в билде и все пропущены в исходной таблице. Крутить только если динамика вообще включена, иначе — мёртвый груз |

### B. DLSS Super Resolution (`r.NGX.*`)

Полный перечень `r.NGX.*` в билде — 28 имён; ниже они все.

| cvar | дефолт | единица/шкала | что делает | цена | ловушки |
|---|---|---|---|---|---|
| `r.NGX.Enable` | 1 ◇ | 0/1 | Загружать ли библиотеку NGX вообще. «Can also be set on the command line via -ngxenable and -ngxdisable» ✔ | — | Отключает DLSS раньше, чем плагин что-либо решит |
| `r.NGX.Enable.AllowCommandLine` | 1 ◇ | 0/1 | Разрешает ли ключи `-ngxenable`/`-ngxdisable` ✔ | — | Пропущено в исходной версии. Если проект его отключил, ваш ключ командной строки молча игнорируется — редкий, но злой случай «команда есть, эффекта нет» |
| `r.NGX.DLSS.Enable` | 1 ◇ | 0/1 | «Enable/Disable DLSS entirely» ✔ | — | При 0 апскейлер откатывается на движковый (TSR) |
| `r.NGX.DLSS.Preset` | 0 ✔ | 0..15 | Выбор DL-модели: «0: Use default preset or ini value; 1: A … 7: G; 8,9: Unsupported; 10: J; 11: K; 12: L; 13: M; 14: N; 15: O» ✔ | нулевая по мс, разная по артефактам | Наличие пресетов J/K/L = трансформерная модель DLSS 4. **Но cvar только ПРОСИТ:** если загруженная `nvngx_dlss.dll` старше модели, запрос молча падает на дефолт DLL. А драйверное замещение (NVIDIA App → DLSS Override) подменяет и DLL, и пресет, полностью игнорируя эту строку. Проверять — экранным индикатором, он печатает и версию DLL, и букву пресета |
| `r.NGX.DLSSRR.Preset` | 0 ✔ | 0..15 | То же для Ray Reconstruction (список включает H и I) ✔ | — | Работает, только если `DenoiserMode=1` |
| `r.NGX.DLSS.DilateMotionVectors` | 1 ✔ | 0/1 | «0: pass low resolution motion vectors into DLSS-SR; 1: pass dilated high resolution motion vectors into DLSS-SR. This can help with improving image quality of thin details. (default)» ✔ | лишний проход плагина в выходном разрешении, десятые мс + полоса | **По умолчанию УЖЕ 1.** Строка `=0` в ini — не оптимизация, а понижение качества тонких деталей. Дилатация — проход *плагина*, а не движка: если объект вообще не пишет скорость, дилатировать нечего (см. §5). С DLSS-RR не поддерживается ◇ |
| `r.NGX.DLSS.AntiAccumulationBias` | 0.05 ✔ | пиксели | «Sub-pixel velocity bias magnitude for static pixels to prevent DLSS temporal over-accumulation when the camera is stationary. 0: disabled; >0: bias magnitude in pixels (default 0.05)» ✔ | нулевая | Лекарство от «залипания»/переконтраста статичной картинки при неподвижной камере |
| `r.NGX.DLSS.AutoExposure` | 1 ✔ | 0/1 | «0: Use the engine-computed exposure value… in some cases this may reduce artifacts; 1: Enable DLSS internal auto-exposure instead of the application provided one (default)» ✔ | нулевая | Имя **сменилось**: старое `r.NGX.DLSS.EnableAutoExposure` в этом билде ✖. Гайды из интернета ставят мёртвое имя. Механизм, зачем трогать: DLSS нормирует вход по яркости; если игра отдаёт свою экспозицию с задержкой в кадр, на резких вспышках лезет мерцание — тогда 1 лечит, а 0 лечит обратный случай (стабильная сцена, где внутренняя экспозиция «дышит») |
| `r.NGX.DLSS.DenoiserMode` | 0 ✔ | 0/1 | «0: off, no denoising (default); 1: DLSS-RR enabled» ✔ | RR дороже SR | Включение RR требует выключить встроенные денойзеры (`r.Lumen.Reflections.BilateralFilter=0` и др.) ◇ |
| `r.NGX.DLSS.BuiltInDenoiserOverride` | −1 ✔ | −1/0/1 | «-1: automatic, depending on r.NGX.DLSS.DenoiserMode (default); 0: skip all built-in denoising; 1: use built-in denoising» ✔ | — | Ручное 0 без RR = шум вместо картинки |
| `r.NGX.DLSS.EnableAlphaUpscaling` | −1 ✔ | −1/0/1 | «-1: based of r.PostProcessing.PropagateAlpha (default)». «Note: r.PostProcessing.PropagateAlpha MUST be enabled» ✔ | — | Для игр не нужно, для композитинга обязательно |
| `r.NGX.DLSS.ReleaseMemoryOnDelete` | 1 ✔ | 0/1 | «Enabling/disable releasing DLSS related memory on the NGX side when DLSS features get released.(default=1)» ✔ | VRAM ↔ рывки | 0 убирает рывок при смене режима ценой удержанной памяти |
| `r.NGX.FramesUntilFeatureDestruction` | 3 ◇ | кадры | Сколько кадров держать неиспользуемую фичу перед уничтожением ✔ | VRAM | Пара к предыдущему: при частой смене разрешения (динамика!) поднять, чтобы не пересоздавать фичу |
| `r.NGX.DLSS.FeatureCreationNode` / `FeatureVisibilityMask` | −1 / −1 ✔ | номер GPU | На каком GPU создаётся/виден DLSS ✔ | — | Только мульти-GPU |
| `r.NGX.DLSS.MinimumWindowsBuildVersion` | 16299 ✔ | build | «(default: 16299 for v1709…)» ✔ | — | Диагностика «DLSS не включается на старой Windows» |
| `r.NGX.DLSS.Reflections.TemporalAA` / `WaterReflections.TemporalAA` | 1 / 1 ◇ | 0/1 | Дополнительный TAA-проход по денойзенным отражениям ◇ | небольшая | Единственные `r.TemporalAA`-подобные штуки, которые при DLSS **живы** |
| `r.NGX.DLSS.BiasCurrentColorMask`, `…MaskStencilValue`, `…DisableSubsurfaceCheckerboard` | сервисные ◇ | — | Маска «доверять текущему кадру» по stencil; обход шахматной подповерхностки ✔ | — | Точечное лекарство от ghosting-а конкретного материала, не глобальная настройка |
| `r.NGX.LogLevel`, `r.NGX.RenameNGXLogSeverities`, `r.NGX.BinarySearchOrder`, `r.NGX.ProjectIdentifier` | сервисные ◇ | — | Тишина в логе, порядок поиска бинарников NGX, идентификатор проекта для NGX ✔ | — | `BinarySearchOrder` — единственный законный способ заставить игру взять *свою* DLL вместо драйверной; `RenameNGXLogSeverities` пропущен в исходной версии |
| `r.NGX.Automation.Enable` / `.NonGameViews` / `.ViewIndex` | 0 ◇ | — | Режим автоматизации/тестов плагина ✔ | — | Пропущены в исходной версии. Не для игроков, но объясняют часть строк в логе |
| `r.NGX.DLSS.Sharpness` | **✖ нет в билде** | — | Резкость DLSS | — | **Удалена.** NVIDIA: «DLSS sharpening is deprecated, future plugin versions will remove DLSS sharpening. Use the NIS plugin for sharpening instead» |
| `r.NGX.DLSS.PreferNISSharpen` | **✖ нет в билде** (в старых плагинах дефолт 2 ◇) | — | Выбор между резкостью DLSS и NIS | — | Копируется в ini из гайдов 2022 года. В современном плагине умерла вместе с NIS. NIS-плагина в этом билде нет вообще — ни одного `r.NIS.*` |
| `r.NGX.DLSS.Quality` | **✖ нет и не было** | — | — | — | Классический вымысел: **режима качества DLSS отдельным cvar-ом не существует**, его задаёт `r.ScreenPercentage` |

### C. Генерация кадров и Reflex (`r.Streamline.*`, `t.Streamline.*`)

Полный перечень — 43 имени `r.Streamline.*` + 6 `t.Streamline.*`; в исходной версии раздела не хватало четырнадцати, включая все выключатели загрузки.

| cvar | дефолт | единица/шкала | что делает | цена | ловушки |
|---|---|---|---|---|---|
| `r.Streamline.InitializePlugin` | 1 ◇ | 0/1 | Инициализировать ли Streamline вообще ✔ | — | **Пропущено в исходной версии.** Самый ранний рубильник: 0 = ни FG, ни Reflex, ни DeepDVC. Почти наверняка `ReadOnly` — из консоли не сработает, только из ini до старта ◇ |
| `r.Streamline.Load.DLSSG` / `.Reflex` / `.Latewarp` / `.DeepDVC` | 1 ◇ | 0/1 | Грузить ли конкретную фичу Streamline ✔ | — | **Пропущены в исходной версии.** Именно ими режут отдельную фичу, не убивая остальные (например, оставить Reflex без FG). Читаются на старте ◇ |
| `r.Streamline.DLSSG.Enable` | 0 ✔ | 0/1/2 | «DLSS-FG mode (default = 0): 0 off; 1 always on; 2 auto mode (on only when it helps)» ✔ | +задержка, +VRAM (порядка 1 ГБ ◇) | Дефолт — ВЫКЛЮЧЕНО. Игра включает FG своим кодом; если не включает — работает только замещение в драйвере. **Непроверенная гипотеза:** выставить 1 из мода в загруженном мире (`SetByConsole`) — единственный способ узнать, включится ли FG без драйвера. Мы этого не делали |
| `r.Streamline.DLSSG.FramesToGenerate` | 1 ✔ | 1..3 | «Number of frames to generate (default = 1)» ✔ | каждый +1 добавляет GPU-стоимость и роняет базу | 1 генерируемый кадр = «2x», 2 = «3x», 3 = «4x». **Уточнение к исходной формулировке:** расхождение на единицу — не между меню игры и cvar-ом (в Palworld `DLSSGeneratedFrames=1` тоже означает 2x), а между *числом генерируемых кадров* и *маркетинговой кратностью*. Путать их — и получается «поставил 3, жду 3x, получил 4x» |
| `r.Streamline.DLSSG.AdjustMotionBlurTimeScale` | 2 ✔ | 0/1/2 | «When DLSS-G is active, adjust the motion blur timescale based on the generated frames. 0: disabled; 1: enabled, not supporting auto mode; 2: enabled, supporting auto mode by using last frame's actually presented frames (default)» ✔ | нулевая | **Дефолт 2, а не 1.** Постановка `=1` — понижение: теряется поддержка авто-кратности |
| `r.Streamline.DLSSG.DynamicResolutionMode` | 0 ✔ | 0/1 | «Experimental: Pass in sl::DLSSGFlags::eDynamicResolutionEnabled (default = 0)» ✔ | — | Помечено экспериментальным самим плагином. Если у вас включена `r.DynamicRes.*` — FG об этом не знает, пока флаг не поднят |
| `r.Streamline.DLSSG.CheckStatusPerFrame` | true ✔ | bool | «Check the DLSSG status at runtime and assert if it's failing somehow» ✔ | микроскопическая | Оставить включённым: это ваш детектор «FG молча отвалился» |
| `r.Streamline.DLSSG.FullScreenMenuDetection` | false ✔ | bool | «Automatically disable DLSS-FG if full screen menus are detected» ✔ | — | Механизм: в полноэкранном меню кадры почти одинаковы, векторы движения нулевые, интерполятор строит кадр из шума → рябь. Детекция просто гасит FG на это время |
| `r.Streamline.DLSSG.RetainResourcesWhenOff` | false ✔ | bool | «Instruct DLSS-G to not release resources when turned off» ✔ | VRAM | Лечит рывок при вкл/выкл FG (в т.ч. при работе `FullScreenMenuDetection`) |
| `r.Streamline.DilateMotionVectors` | 0 ✔ | 0/1 | «0: pass low resolution motion vectors into DLSS Frame Generation (default); 1: pass dilated high resolution… improving image quality of thin details» ✔ | лишний проход | **Дефолт ПРОТИВОПОЛОЖЕН одноимённому у DLSS-SR (там 1).** Два похожих имени с разными дефолтами — источник половины ошибок в ini |
| `r.Streamline.MotionVectorScale` | 1 ✔ | множитель | «Scale DLSS Frame Generation motion vectors by this constant, in addition to the scale by 1/ the view rect size» ✔ | — | Множится ПОВЕРХ нормировки на размер вьюпорта. Не «резкость» и не «сила» — если поставить не 1, интерполятор поедет геометрически |
| `r.Streamline.TagUIColorAlpha` | true ✔ | bool | «Pass UI color and alpha into Streamline» ✔ | проход извлечения UI | Выключение = интерфейс размазывается по генерируемым кадрам. Строка `=0` в ini — прямой вред |
| `r.Streamline.TagUIColorAlphaThreshold` | 0.0 ✔ | 0..1 | «UI extraction pass alpha threshold value» ✔ | — | Порог, выше которого пиксель считается интерфейсом ◇. При 0 интерфейсом объявляется всё с ненулевой альфой. **Правка исходной версии:** «поднимать, если полупрозрачный HUD прилипает» — сомнительно и, вероятно, перевёрнуто. Поднятие порога *исключает* полупрозрачные пиксели из маски UI (лечит «замороженные» пятна сцены, ошибочно принятые за интерфейс); проблему смазанного полупрозрачного HUD оно, наоборот, усугубит. Направление проверять глазами, а не по гайду |
| `r.Streamline.TagBackbuffer` | true ✔ | bool | «Pass backbuffer extent into Streamline» ✔ | — | — |
| `r.Streamline.TagVelocities` | true ✔ | bool | «Pass motion vectors into Streamline» ✔ | — | Без них FG рисует кашу |
| `r.Streamline.TagSceneColorWithoutHUD` | true ✔ | bool | «Pass scene color without HUD into DLSS Frame Generation» ✔ | лишняя копия сцены | Пара к `TagUIColorAlpha` |
| `r.Streamline.TagCustomDepth` | false ✔ | bool | «Pass custom depth into Streamline» ✔ | — | — |
| `r.Streamline.ViewIndexToTag` | 0 ◇ | индекс | Какой вид тегировать ✔ | — | Пропущено в исходной версии; для сплит-скрина и мультивью |
| `r.Streamline.ClearSceneColorAlpha` | true ✔ | bool | «Clear alpha of scenecolor at the end of the Streamline view extension to allow subsequent UI drawcalls be represented correctly in the alpha channel» ✔ | — | Конфликтует с `r.PostProcessing.PropagateAlpha`: тот альфу бережёт, этот её обнуляет |
| `r.Streamline.ForceTagging` | false ✔ | bool | «Force tagging Streamline resources even if they are not required based on active Streamline features» ✔ | лишние копии | Только для отладки |
| `r.Streamline.FilterRedundantSetOptionsCalls` | 1 ◇ | 0/1 | Не дёргать Streamline повторно одинаковыми параметрами ✔ | — | Пропущено в исходной версии. Выключать только при отладке «плагин не видит мою настройку» |
| `r.Streamline.LogFunctions` / `.LogLevel` | 0 ◇ | — | Трассировка вызовов Streamline ✔ | лог пухнет | Пропущены; ваш инструмент, когда FG «не включается и не говорит почему» |
| `r.Streamline.CustomCameraNearPlane` / `FarPlane` | 0.01 / 75000.0 ✔ | см | «Used for internal DLSS Frame Generation purposes, does not need to match corresponding value used by engine» ✔ | — | Не обязаны совпадать с камерой движка |
| `r.Streamline.MaxNumSwapchainProxies` | −1 ✔ | −1/0/1..n | «-1: automatic, depending on enabled Streamline features (default); 0: no swap chain proxy. Likely means features needing one won't work» ✔ | — | 0 тихо убивает FG |
| `r.Streamline.ViewIdOverride` | −1 ✔ | −1/0/1 | Подмена view id, передаваемого в Streamline ✔ | — | Только для мультивью |
| `r.Streamline.Latewarp.Enable` | 1 ✔ | 0/1 | «Enable/disable Latewarp» ✔ | — | Reflex 2 Frame Warp. Наличие имени = очень свежий Streamline в билде. Работает только если игра отдаёт нужные данные и драйвер это поддерживает ◇ |
| `r.Streamline.Reflex.PredictiveRendering` / `.LateUpdateMode` | 0 ✔ / — | 0/1 | «Whether predictive rendering is enabled or not. (default = 0), since stock engine» ✔ | — | `.LateUpdateMode` пропущен в исходной версии — это способ поздней доводки камеры перед подачей в Reflex/Latewarp ◇ |
| `r.Streamline.Reflex.CameraPredictor`, `.ClipCorrection`, `.ClipRadius`, `.ActorDebug` | — ◇ | — | Внутренности предсказания камеры для Latewarp ✔ | — | Все четыре пропущены в исходной версии. Крутить незачем, но по ним видно, что Latewarp тут не декорация |
| `r.Streamline.UnregisterReflexPlugin` | 1 ◇ | 0/1 | «The existing NVAPI based UE Reflex plugin is incompatible with the DLSS Frame Generation based implementation… 1: unregister Reflex plugin modular features» ✔ | — | Два Reflex-а в одном билде несовместимы; трогать нельзя |
| `t.Streamline.Reflex.Enable` | 0 ✔ | 0/1 | «Enable Streamline Reflex extension. (default = 0)» ✔ | — | Сам по себе выключен… |
| `t.Streamline.Reflex.Auto` | 1 ✔ | 0/1 | «Enable Streamline Reflex extension when other SL features need it. (default = 1)» ✔ | — | …но включается автоматически, когда включают FG. Поэтому «я не включал Reflex» ничего не значит |
| `t.Streamline.Reflex.Mode` | 1 ✔ | 0/1/2 | «Streamline Reflex mode (default = 1): 0 off; 1 low latency; 2 low latency with boost» ✔ | 2 жрёт питание, на CPU-упоре может уронить частоту | Имя с префиксом **`t.`**, а не `r.` — `r.Streamline.Reflex.Mode` ✖ не существует. Boost поднимает частоты GPU при CPU-упоре — то есть лечит ровно наш случай п. 9, но ценой ватт |
| `t.Streamline.Reflex.HandleMaxTickRate` | true ✔ | bool | «Controls whether Streamline Reflex handles frame rate limiting instead of the engine (default = true)» ✔ | — | **Ограничитель кадров при активном Reflex — не движковый.** `t.MaxFPS` исполняет Reflex, и «странное» поведение лимита объясняется этим |
| `t.Streamline.Reflex.EnableLatencyMarkers` | 1 ✔ | 0/1 | «Enable Streamline PC Latency metrics» ✔ | — | Выключишь — потеряешь метрику input→photon в оверлее. Без маркеров Reflex работает в урезанном режиме: он не знает, где начался ввод ◇ |
| `t.Streamline.Reflex.EnableInEditor`, `r.Streamline.Editor.TagUIColorAlpha`, `r.Streamline.Editor.TagSceneColorWithoutHUD` | — ◇ | — | Редакторные двойники ✔ | — | В шипящем билде смысла не имеют; перечислены, чтобы не искать «почему у меня их два» |
| `r.Streamline.DeepDVC.Enable` / `Intensity` / `SaturationBoost` | — / — / 0.5 ✔ | 0..1 | Драйверная «живость» цвета ✔ | пост-проход | К задержке отношения не имеет, но лежит в том же плагине |

### D. FSR2 (`r.FidelityFX.FSR2.*`)

| cvar | дефолт | единица/шкала | что делает | цена | ловушки |
|---|---|---|---|---|---|
| `r.FidelityFX.FSR2.Enabled` | 1 ◇ | 0/1 | Включение плагина как темпорального апскейлера | — | Конкурирует с DLSS за один и тот же слот `GTemporalUpscaler`. **Кто победит — определяется порядком загрузки модулей, а не «приоритетом»**: последний зарегистрировавшийся выигрывает ◇. Держать оба включёнными — гарантированный источник «то так, то эдак» |
| `r.FidelityFX.FSR2.QualityMode` | 1 ✔ | 1..4 | «FSR2 Mode [1-4]… Default is 1 - Quality. 1 — Quality 1.5x; 2 — Balanced 1.7x; 3 — Performance 2.0x; 4 — Ultra Performance 3.0x» ✔ | доля² по пикселям | **Здесь режим задаётся режимом**, в отличие от DLSS, где режим задаётся `r.ScreenPercentage`. Смешивать подходы нельзя |
| `r.FidelityFX.FSR2.Sharpness` | 0 ✔ | 0.0..1.0 | «Range from 0.0 to 1.0, when greater than 0 this enables Robust Contrast Adaptive Sharpening Filter» ✔ | отдельный проход RCAS | Единственная живая резкость апскейлера в этом билде: у DLSS её больше нет. Движковая `r.Tonemapper.Sharpen` — отдельная история и работает при любом апскейлере |
| `r.FidelityFX.FSR2.AutoExposure` | 0 ◇ | 0/1 | «True to use FSR2's own auto-exposure, otherwise the engine's auto-exposure value is used» ✔ | — | Зеркало `r.NGX.DLSS.AutoExposure`, но с обратным дефолтом |
| `r.FidelityFX.FSR2.CreateReactiveMask` | 1 ✔ | 0/1 | «Enable to generate a mask from the SceneColor, GBuffer, SeparateTranslucency & ScreenspaceReflections that determines how reactive each pixel should be. Defaults to 1 (Enabled)» ✔ | проход маски | Выключение = шлейфы за прозрачным и отражениями |
| `r.FidelityFX.FSR2.DeDither` | 0 ✔ | 0/1/2 | «0 — Off; 1 — Full…; 2 — Hair only… requires the Deferred Renderer» ✔ | доп. проход | Лечит «сеточку» на волосах и dithered-LOD |
| `r.FidelityFX.FSR2.HistoryFormat` | 0 ✔ | 0/1 | «0 — PF_FloatRGBA (default); 1 — PF_FloatR11G11B10 to reduce bandwidth at the expense of quality» ✔ | 1 экономит полосу | Прямой аналог `r.TSR.History.R11G11B10` |
| `r.FidelityFX.FSR2.AdjustMipBias` | 1 ◇ | 0/1 | «Allow FSR2 to adjust the minimum global texture mip bias (r.ViewTextureMipBias.Min & r.ViewTextureMipBias.Offset)» ✔ | — | Выключение = мыло текстур при апскейле. Тот же механизм молча делает и DLSS — вот только у DLSS выключателя нет, и это отличие стоит помнить при сравнении картинок |
| `r.FidelityFX.FSR2.UseNativeDX12` / `UseNativeVulkan` | — ◇ | 0/1 | Идти в родной бэкенд FSR2 вместо реализации через RDG ✔ | — | Пропущены в исходной версии. Первое, что переключают, когда FSR2 даёт артефакты только на одном API |
| `r.FidelityFX.FSR2.ForceVertexDeformationOutputsVelocity` / `ForceLandscapeHISMMobility` | 0 ◇ | — | Плагинные двойники `r.Velocity.EnableVertexDeformation` / травы ✔ | заметная | Ровно то же лекарство от шлейфов за листвой, но со стороны FSR2 |
| `r.FidelityFX.FSR2.ReactiveMask*` (13 порогов), `UseSSRExperimentalDenoiser`, `EnabledInEditorViewport` | тонкая настройка ◇ | — | Пороги реактивности по roughness/luma/translucency | — | Крутить только по конкретному артефакту, иначе шум вместо истории |
| FSR3 / FSR3-FG, XeSS, NIS | **✖ в билде нет ни одного имени** | — | — | — | Важно для §«Опыт сообщества»: рассуждения про «FSR3 FG + Reflex» к этому билду не относятся вообще. Всё, что можно, — драйверная генерация поверх игры |

### E. TAA и TSR — что здесь живо и когда

| cvar | дефолт | единица/шкала | что делает | цена | ловушки |
|---|---|---|---|---|---|
| `r.TemporalAA.Quality` | 2 ✔ | 0/1/2 | «0: Disable input filtering; 1: Enable input filtering; 2: Enable input filtering, enable mobility based anti-ghosting (Default)» ✔ | малая | При DLSS **инертен** |
| `r.TemporalAA.HistoryScreenPercentage` | 100 ◇ | % | «Size of temporal AA's history» ✔ | 200 = вчетверо память истории | При DLSS инертен |
| `r.TemporalAACurrentFrameWeight` | 0.04 ◇ | 0..1 | «Weight of current frame's contribution to the history. Low values cause blurriness and ghosting, high values fail to hide jittering» ✔ | — | При DLSS инертен. Правки вида 0.2 — самый популярный «фикс мыла», который при DLSS не делает ничего |
| `r.TemporalAAFilterSize` | 1.0 ◇ | радиус | Радиус фильтра ресемплинга | — | При DLSS инертен |
| `r.TemporalAASamples` | 8 ◇ | шт. | Длина последовательности джиттера | — | При DLSS инертен: джиттер задаёт плагин |
| `r.TemporalAACatmullRom`, `r.TemporalAAPauseCorrect`, `r.TemporalAA.R11G11B10History`, `r.TemporalAA.UseMobileConfig` | 1 / 1 / 1 / 0 ◇ | 0/1 | Мелочи ядра TAA ✔ | — | При DLSS инертны (`UseMobileConfig` пропущен в исходной версии) |
| `r.TemporalAA.Algorithm`, `r.TemporalAASharpness`, `r.DefaultFeature.AntiAliasing` | **✖ нет в билде** | — | — | — | Три самых частых фантома из гайдов. `r.DefaultFeature.AntiAliasing` — имя из UE4, в UE5 заменено на `r.AntiAliasingMethod`. Проверено перечислением: в билде живы `r.DefaultFeature.AmbientOcclusion`, `.Bloom`, `.MotionBlur`, `.LensFlare`, `.AutoExposure*`, `.LightUnits` — и никакого `.AntiAliasing` |
| `r.TSR.History.ScreenPercentage` | 200 ◇ | % | «Size of TSR's history» ✔ | 200 = история в 2× выходного разрешения, крупная статья VRAM и полосы | Ставится группой `sg.AntiAliasingQuality`; при DLSS инертен |
| `r.TSR.History.UpdateQuality` | 3 ◇ | 0..3 | «Select the quality of the history update» ✔ | — | При DLSS инертен |
| `r.TSR.RejectionAntiAliasingQuality` | 1 ✔ | 0..2 | «Controls the quality of spatial anti-aliasing on history rejection (default=1)» ✔ | — | **Дефолт cvar-а 1, а scalability на Epic ставит 2** — наглядный случай «дефолт ≠ то, что вы увидите в игре» |
| `r.TSR.ShadingRejection.Flickering` (+ `.Period`, `.MaxParralaxVelocity`, `.AdjustToFrameRate`) | 1 ◇ (Period 3 ◇) | — | «Whether to enable the flickering detection heuristic» ✔ | — | При DLSS инертны |
| `r.TSR.Velocity.Extrapolation` | 1.0 ✔ | множитель | «Defines how much the velocity should be extrapolated on geometric discontinuities (Default = 1.0f)» ✔ | — | При DLSS инертен |
| `r.TSR.Velocity.WeightClampingPixelSpeed`, `r.TSR.Translucency.EnableResponiveAA`, `r.TSR.Translucency.HighlightLuminance` | — ◇ | — | Внутренности TSR ✔ | — | Пропущены в исходной версии; при DLSS так же инертны |
| `r.TSR.AsyncCompute` | 0 ✔ | 0..3 | «0: Disabled (default); 1: Only ClearPrevTextures pass; 2: … through DecimateHistory; 3: All passes» ✔ | 2–3 прячут часть работы | Значение зависит от версии UE; здесь читать из билда, а не из гайда |
| `r.TSR.WaveOps`, `r.TSR.History.R11G11B10`, `r.TSR.History.SeparateTranslucency`, `r.TSR.History.GrandReprojection` | 1 / 1 / 0 / 0 ◇ | — | Внутренности TSR 5.1 | — | `GrandReprojection` в 5.1 экспериментален |
| `r.Tonemapper.Sharpen` | 0 ◇ | 0..1+ | Резкость в тонемаппере, **после** апскейла, в выходном разрешении ✔ | почти нулевая | **Живёт при любом апскейлере, включая DLSS** — единственная универсальная резкость этого билда. Мимо неё проходят все гайды, потому что ищут `r.NGX.DLSS.Sharpness` |
| `r.FXAA.Quality` | 4 ✔ | 0..5 | Качество FXAA | — | Актуально только если `r.AntiAliasingMethod=1`, то есть в конфигурации, где DLSS уже выключен |
| `r.PostProcessAAQuality` | **✖ нет в билде** | — | — | — | В UE5 роль разошлась по `r.FXAA.Quality` и `r.TemporalAA.Quality`. Гайды продолжают его прописывать |
| `sg.AntiAliasingQuality` | 3 ◇ | 0..4 | Группа scalability, разом ставящая весь блок TSR/FXAA/TAA | — | Пишет с приоритетом `SetByScalability` — **самым низким из доступных снаружи** (ниже только `SetByConstructor`, то есть сам дефолт), см. §«Как считается» |

### F. Задержка и синхронизация

| cvar | дефолт | единица/шкала | что делает | цена | ловушки |
|---|---|---|---|---|---|
| `RHI.MaximumFrameLatency` | 3 ◇ (совпадает с дефолтом DXGI) | кадры 1..16 | «Number of frames that can be queued for render» ✔ | −1 кадр очереди ≈ −один базовый кадр задержки; риск просадки при неровном GPU | **Единственное живое имя очереди в этом билде.** Применяется на создании/пересоздании swap chain: правка из консоли в живом мире может не дать эффекта до смены разрешения или режима окна ◇ — из `Engine.ini` работает потому, что читается к моменту инициализации RHI. Механизм проседания FPS: короткая очередь = CPU чаще ждёт GPU, перекрытие работы теряется |
| `RHI.SyncWithDWM`, `RHI.SyncThreshold`, `RHI.SyncRefreshThreshold`, `RHI.RefreshPercentageBeforePresent`, `RHI.TargetRefreshRate`, `RHI.MaxSyncCounter` | — ◇ | — | Живая в этом билде группа синхронизации показа с композитором и целевой частотой ✔ | — | **Пропущена в исходной версии целиком.** Это те имена, которые в данном билде существуют вместо отсутствующего `rhi.SyncSlackMS`. `RHI.SyncWithDWM` актуален только для оконного/безрамочного режима с композитором; в `Hardware: Independent Flip` (наш случай) роли не играет |
| `D3D12.MaximumFrameLatency` | **✖ нет в билде** | — | — | — | Самая тиражируемая строка модерских гайдов по UE5 — и **фантом**. `D3D11.MaximumFrameLatency` здесь тоже ✖. Все живые `D3D12.*` в билде — про дескрипторные кучи, PSO-кэш, резидентность и трассировку лучей; ничего про очередь кадров |
| `r.OneFrameThreadLag` | 1 ◇ | 0/1 | «Whether to allow the rendering thread to lag one frame behind the game thread (0: disabled, otherwise enabled)» ✔ | 0 стоит пропускной способности: потоки перестают перекрываться | Ровно один кадр задержки. Выключение — самый честный размен «FPS за отзывчивость». **Важно:** это НЕ единственный кадр конвейера — RHI-поток и очередь драйвера остаются |
| `r.GTSyncType` | 0 ✔ | 0/1/2 | «0 — Sync the game thread with the render thread (default); 1 — with the RHI thread; 2 — with the GPU swap chain flip (only on supported platforms)» ✔ | 2 требует поддержки платформы | **Расхождение с документацией Epic, не отмеченное в исходной версии.** Epic рекомендует связку «2 + `rhi.SyncSlackMS`», но: (а) `rhi.SyncSlackMS` в этом билде ✖ — управлять запасом нечем; (б) режим 2 опирается на события флипа, которые на Windows реализованы не во всех RHI ◇, и при отсутствии поддержки молча вырождается в 0; (в) весь смысл режима 2 — в синхронизации с вертикальной синхронизацией, при `r.VSync=0` он бесполезен |
| `rhi.SyncSlackMS`, `rhi.SyncInterval` | **✖ нет в билде** | — | — | — | **Исправление исходной версии: обе строки были указаны как живые с дефолтами (10 и 1). В строковой таблице билда их нет.** Соответственно вся рекомендация Epic по тонкой настройке запаса перед vsync к этой сборке неприменима |
| `r.VSync` | 0 ✔ | 0/1 | «0: VSync is disabled.(default); 1: VSync is enabled» ✔ | — | На практике перетирается `bUseVSync` из `GameUserSettings.ini` при старте ◇. Строка `r.Vsync` в дампе тоже встречается, но считать её вторым живым cvar-ом без проверки нельзя — см. оговорку 3 к легенде |
| `r.FinishCurrentFrame` | 0 ◇ | 0/1 | «If on, the current frame will be forced to finish and render to the screen instead of being buffered. This will improve latency, but slow down overall performance» ✔ | очень дорого: конвейер схлопывается | Помощь измеряется единицами мс, потеря FPS — десятками процентов. При Reflex смысла нет вовсе: Reflex добивается того же, не убивая перекрытие |
| `t.MaxFPS` | 0 ✔ | к/с (float), ≤0 = без лимита | «Caps FPS to the given value. Set to <= 0 to be uncapped» ✔ | — | `FrameRateLimit` из `GameUserSettings.ini` пишется именно сюда — через `UEngine::SetMaxFPS` с приоритетом `SetByGameSetting` (2) ◇. **Следствие, которого не было в исходной версии: `t.MaxFPS` в `[SystemSettings]` (4) ЛОМАЕТ ползунок лимита в меню игры** — он будет двигаться и ничего не делать. При активном Reflex лимит исполняет Reflex (`HandleMaxTickRate=true`), а не движок |
| `bSmoothFrameRate`, `SmoothedFrameRateRange`, `bUseFixedFrameRate`, `FixedFrameRate` (`[/Script/Engine.Engine]`, не cvar-ы) | true, 22..62, false, 30 ◇ | к/с | Сглаживание и фиксация частоты кадров движком | — | Классическая причина «упёрлось в 62 кадра». Это **ini-свойства, а не cvar-ы** — искать в `Engine.ini`, а не в консоли. `bUseFixedFrameRate=true` даёт ещё более жёсткий потолок и в исходной версии не упомянут |
| `r.RHIThread.Enable` | 1 ◇ | 0/1 | Отдельный RHI-поток | — | Живое имя. `r.RHIThread`, `r.EnableMultiThreadedRendering`, `D3D12.MultithreadedCommandListBuilding` — ✖ фантомы |
| `r.SetFramePace` | 0 ◇ | к/с | Целевой темп показа для платформенного пейсера ✔ | — | Пропущен в исходной версии; на десктопе обычно не задействован, но имя живое |

---

## Как считается

### 1. Приоритеты: кто кого перекрывает (главное в разделе)

Каждое присваивание cvar-а несёт приоритет `ECVF_SetBy*`. **Установка с приоритетом НИЖЕ текущего просто игнорируется; равный — перезаписывает.** Порядок по возрастанию силы ◇:

```
SetByConstructor (0)        код регистрации, «дефолт»
SetByScalability (1)        sg.* и BaseScalability.ini
SetByGameSetting (2)        UGameUserSettings (в т.ч. FrameRateLimit → t.MaxFPS)
SetByProjectSetting (3)     [/Script/Engine.RendererSettings] в DefaultEngine.ini
SetBySystemSettingsIni (4)  [SystemSettings] в Engine.ini
SetByDeviceProfile (5)
SetByConsoleVariablesIni(6) [ConsoleVariables] в Engine.ini
SetByCommandline (7)        -dx12, -ngxdisable и т.п.
SetByCode (8)               прямые Set() из C++/Blueprint игры
SetByConsole (9)            консоль, UE4SS-моды, ExecuteConsoleCommand
```

Отсюда практические правила:

- **`[SystemSettings]` бьёт scalability и настройки игрового меню, но проигрывает коду игры.** Если игра при входе в мир сама пишет cvar через `Set(..., ECVF_SetByCode)` — ваша строка в ini мертва навсегда, хотя формально «применилась» на старте.
- **Это работает и во вред.** `t.MaxFPS`, `r.ScreenPercentage`, `r.VSync` в `[SystemSettings]` перестают слушаться меню игры: ползунок движется, значение не меняется. Игрок думает, что игра сломана.
- **`[ConsoleVariables]` формально выше `[SystemSettings]` (6 против 4), но применяется РАНЬШЕ — до загрузки модулей плагинов.** Cvar-ы `r.NGX.*` и `r.Streamline.*` на этот момент ещё не зарегистрированы. Наш замер это подтвердил (см. «Проверено нами», п. 1). Формулировка «уходит в никуда» — эмпирическая для этого билда; движок в принципе умеет откладывать значения незарегистрированных имён, но здесь это не сработало.
- **Мод, исполняющий консольные команды в загруженном мире (`SetByConsole`, 9), выигрывает у всех.** Это единственное место, где правка гарантированно доезжает до сцены.
- **Четвёртый путь, не упомянутый в исходной версии: командная строка.** `-ExecCmds="r.NGX.DLSS.Preset 11, r.Streamline.DLSSG.Enable 1"` выполняется после инициализации движка, то есть с приоритетом консоли и уже по зарегистрированным именам плагина. Для разовой проверки гипотезы это проще мода.
- И тривиальное, но регулярно ломающее людям день: **`DefaultEngine.ini` внутри pak и пользовательский `…\Saved\Config\Windows\Engine.ini` — разные файлы с разными приоритетами.** Игрок правит второй, гайд написан про первый.

Отдельный класс: `ECVF_ReadOnly` — такие cvar-ы принимают значение только из ini на старте и молча игнорируют консоль (по всем признакам сюда относятся `r.Streamline.InitializePlugin` и `r.Streamline.Load.*`). И `ECVF_RenderThreadSafe` — значение доезжает до рендер-потока со сдвигом на кадр.

### 2. Разрешение рендера

```
SecondaryViewSize   = DisplayResolution × (r.SecondaryScreenPercentage.GameViewport / 100)
                      при 0 → авто: 1 / DPIScale
PrimaryRenderSize   = SecondaryViewSize × PrimaryResolutionFraction
Пикселей на кадр    ~ PrimaryResolutionFraction²          <- квадрат, не линейно
```

`PrimaryResolutionFraction` берётся так ◇:

- `r.ScreenPercentage.Mode = 0` → `r.ScreenPercentage / 100`;
- `r.ScreenPercentage.Mode = 1` → авто по разрешению экрана: доля ≈ `sqrt(1920×1080 × r.ScreenPercentage.Auto.PixelCountMultiplier / DisplayPixelCount)`. На 4K при множителе 1 это около **50%**;
- явно заданный `r.ScreenPercentage > 0` переводит расчёт в ручной режим независимо от `Mode` ◇;
- затем результат зажимается `r.ScreenPercentage.MinResolution` / `MaxResolution` (обе 0 = зажим выключен);
- **и наконец зажимается коридором самого апскейлера — см. 2а;**
- динамика (`r.DynamicRes.*`) при `OperationMode ≠ 0` пересчитывает долю каждые несколько кадров в коридоре `[MinScreenPercentage, MaxScreenPercentage]` и **перетирает ваше значение**.

Числовой пример 4K: 58% → 2227×1253 → 0.336 от пикселей 4K. 50% → 1920×1080 → 0.25. То есть шаг «Баланс → Производительность» снимает **26% работы на пиксель**, а не 8, как кажется по разнице «58 против 50».

### 2а. Коридор доли, которого нет в справке

Справка `r.ScreenPercentage` обещает «>0 и <=100, больше — суперсэмплинг». Движок в это не верит: доля зажимается константами, зависящими от того, кто делает апскейл ◇:

```
пространственный апскейл   — широкий коридор
TAAU (движковый)           — примерно [50%, 200%]
TSR                        — примерно [25%, 200%]
сторонний апскейлер        — коридор объявляет САМ плагин (DLSS: до 33.3% ради Ultra Performance)
```

Практическое следствие, объясняющее целый класс «я поставил, а получилось другое»: **`r.ScreenPercentage=33.3` даёт настоящие 33.3% только пока DLSS жив.** Стоит плагину не инициализироваться (нет DLL, неподдерживаемый GPU, `r.NGX.DLSS.Enable=0`, `r.AntiAliasingMethod=0`) — та же строка тихо превратится в 50% (TAAU) или 25% (TSR), а картинка изменится непредсказуемо. Проверять — экранным индикатором DLSS: он печатает фактическое внутреннее разрешение.

### 3. Как `r.ScreenPercentage` превращается в режим DLSS

Плагин DLSS не имеет cvar-а «режим». NVIDIA: *«If DLSS is enabled, the plugin will internally set the best quality mode for the current screen percentage»*. То есть **вы задаёте долю, плагин выбирает ближайший поддерживаемый режим**:

| режим DLSS | доля | множитель по стороне | пикселей от 4K |
|---|---|---|---|
| DLAA | 100% | 1.0 | 1.00 |
| Quality | 66.7% | 1.5 | 0.44 |
| Balanced | 58% | ≈1.72 | 0.34 |
| Performance | 50% | 2.0 | 0.25 |
| Ultra Performance | 33.3% | 3.0 | 0.11 |

Движение здесь двустороннее, и это важнее самой таблицы: **пункт «качество DLSS» в меню игры не просто читает долю — он её ПИШЕТ.** Blueprint-функция плагина `SetDLSSMode` выставляет `r.ScreenPercentage` от своего имени, с приоритетом кода ◇, то есть выше вашей строки в `[SystemSettings]`. Именно так рождаются жалобы «плагин насильно ставит 66%»: это не баг, а меню игры, отработавшее позже вас и с большим приоритетом. Ползунок «масштаб разрешения» в том же меню пишет `sg.ResolutionQuality` → снова `r.ScreenPercentage`, но уже с приоритетом scalability (1), который ваш ini переживает. Два ползунка, один cvar, разные приоритеты — отсюда и «через раз».

FSR2 в этом же билде устроен **наоборот**: режим задаётся `r.FidelityFX.FSR2.QualityMode`, и уже он диктует долю — те же 1.5/1.7/2.0/3.0 ✔. Отсюда типовая ошибка: одновременно выставленные `QualityMode` и `r.ScreenPercentage` дают не то, что ожидали, потому что борются за одну величину с разных концов.

### 4. Почему `r.TemporalAA.*` и `r.TSR.*` при DLSS инертны

Цепочка сборки кадра ◇:

```
r.AntiAliasingMethod ∈ {2 TAA, 4 TSR}  → метод сглаживания темпоральный (иначе всё ниже не случится)
r.TemporalAA.Upsampling = 1            → апскейл делает темпоральный проход, а не r.Upscale.Quality
r.TemporalAA.Upscaler = 1              → разрешено взять GTemporalUpscaler, который может подменить плагин
плагин DLSS                            → подменяет GTemporalUpscaler на FDLSSSceneViewFamilyUpscaler
```

Когда подмена состоялась, в граф кадра добавляется проход DLSS, а проходы TSR/TAA **не добавляются вовсе**. Все `r.TSR.*` и `r.TemporalAA*` продолжают существовать, принимать значения и корректно читаться обратно — они просто некому не нужны. То же с `r.FXAA.Quality` и с самим `r.AntiAliasingMethod`: его значение при DLSS **не является доказательством того, какой апскейлер работает**.

Три уточнения, которых в исходной версии не хватало:

- **Инертность не вечная.** Стоит DLSS не подняться (старый драйвер, отсутствующая DLL, `r.NGX.Enable=0`, неподдерживаемый GPU) — и весь блок `r.TSR.*` мгновенно оживает, вместе с вашими старыми «оптимизирующими» правками из 2022 года. Мёртвый груз в ini — это заряженное ружьё, а не безобидный мусор.
- **Первые две строки цепочки — не «TAA-настройки», а маршрутизация.** `r.AntiAliasingMethod`, `r.TemporalAA.Upsampling`, `r.TemporalAA.Upscaler` живы при DLSS в том смысле, что любым из них DLSS выключается. Инертны только те `r.TemporalAA*`, что настраивают *сам алгоритм* TAA.
- **Проверять надо не readback, а индикатор.** Значение cvar-а читается верно в любом случае; единственное честное доказательство — экранный индикатор DLSS (внутреннее разрешение и версия DLL) либо `Streamline`-статус.

Как отрезать плагин честно: `r.TemporalAA.Upscaler=0` или `r.NGX.DLSS.Enable=0`. Оба — на старте, до создания вида. Что при DLSS всё-таки живо из «TAA-подобного»: `r.NGX.DLSS.Reflections.TemporalAA` и `r.NGX.DLSS.WaterReflections.TemporalAA` — это отдельные проходы самого плагина.

### 5. Векторы движения: три уровня, а не один

```
r.NGX.DLSS.DilateMotionVectors      = 1  (дилатация ВКЛЮЧЕНА)   ✔
r.Streamline.DilateMotionVectors    = 0  (дилатация ВЫКЛЮЧЕНА)  ✔
```

Первый — для апскейла (SR), второй — для генерации кадров (FG). Дилатация означает: вместо низкоразрешающих скоростей плагину отдают скорости полного разрешения, расширенные по глубине, — тонкие детали (провода, ветки, трава) перестают тянуть шлейф. Стоит одного лишнего прохода.

Масштаб скоростей для FG: итоговый множитель = `1 / ViewRectSize × r.Streamline.MotionVectorScale` ✔.

**Но дилатировать можно только то, что записано.** Уровни лечения, в порядке проверки:

1. **Пишется ли скорость вообще.** Анимация через World Position Offset (листва на ветру, трава, флаги) по умолчанию скорость не пишет — движок считает такую геометрию статичной. Рычаги: `r.Velocity.EnableVertexDeformation`, `r.Velocity.EnableLandscapeGrass` (со стороны FSR2 — `ForceVertexDeformationOutputsVelocity`, `ForceLandscapeHISMMobility`). Диагностика в один клик: `r.Velocity.ForceOutput=1` — если шлейф исчез, вопрос закрыт, дальше точечно.
2. **Где пишется.** `r.VelocityOutputPass` (0/1/2) — компромисс между лишним таргетом GBuffer и разделением depth pass.
3. **В каком разрешении отдаётся плагину.** Те самые два `DilateMotionVectors`.

Исходная версия сводила всё к пункту 2, и это ошибка адресации: `r.VelocityOutputPass` решает *где*, а не *писать ли вообще*.

### 6. Motion blur × генерация кадров

Выдержка motion blur в UE пропорциональна времени кадра. При генерации показанный интервал в (N+1) раз короче отрендеренного, поэтому без коррекции размытие получается в (N+1) раз сильнее нужного. `r.Streamline.DLSSG.AdjustMotionBlurTimeScale` эту коррекцию и делает, причём **дефолт уже правильный (2 — авто по фактически показанным кадрам прошлого кадра)** ✔. Значение 1 — это ХУЖЕ дефолта: «enabled, not supporting auto mode», то есть при динамической кратности коррекция промахивается. А динамическая кратность — ровно наш случай (см. «Проверено нами», п. 6), так что здесь это не теория.

### 7. Бюджет задержки

```
input→photon ≈ (ожидание опроса ввода)
             + N_pipeline × T_base
             + T_gpu
             + удержание генерацией
             + ожидание флипа (vsync/панель/VRR)

N_pipeline ≈ 1 (r.OneFrameThreadLag) + 1 (рендер/RHI) + RHI.MaximumFrameLatency
T_base     = 1 / базовая частота = 1 / (частота на экране ÷ кратность генерации)
```

Ключевое: **в формуле стоит T_base, а не время показанного кадра**. Генерация увеличивает число показов, но не сокращает T_base — поэтому «127 кадров на экране» при базе 42 ведут себя по руке как 42 кадра, ухудшенные удержанием интерполятора.

**Уточнение про кратность, которого в исходной версии не было и которое меняет вывод.** Удержание при генерации — это примерно один базовый кадр, и оно почти не растёт с кратностью: интерполятору нужны два соседних настоящих кадра независимо от того, сколько промежуточных он между ними нарисует. Что действительно растёт с кратностью — **стоимость генерации на GPU, которая роняет базу**, а падение базы бьёт по задержке напрямую через T_base. Поэтому правильная формулировка: «лишняя кратность вредна не удержанием, а тем, что она отъедает базу». Наш собственный замер это подтверждает (127→95 показанных при базе 42→47.6: база выросла именно потому, что сняли кратность).

Отсюда порядок приоритетов при охоте на «ватность»:

1. **кратность генерации** — снимает удержание и возвращает базу;
2. **очередь кадров** (`RHI.MaximumFrameLatency`, `r.OneFrameThreadLag`) — линейно, по одному T_base за кадр очереди;
3. **базовая частота** — единственное, что двигает хвосты p95/p99;
4. `r.FinishCurrentFrame` — последнее средство, платится десятками процентов FPS.

Reflex поверх этого держит очередь у GPU почти пустой и, при `t.Streamline.Reflex.HandleMaxTickRate=true` ✔, **сам исполняет ограничение частоты**. Поэтому связка «Reflex + `t.MaxFPS`» ведёт себя не как движковый лимитер, и попытки «поправить лимит в ini» дают неожиданные результаты.

### 8. Потолки частоты, которые обязаны быть согласованы

```
частота панели  ≥  лимит игры (t.MaxFPS / FrameRateLimit)  ≥  целевая частота генерации
```

Кадры выше частоты панели не отображаются вовсе. Целевая частота генерации выше лимита игры означает, что драйвер будет пытаться догенерировать до цели, которую игра ему не даст.

Скрытые потолки, о которых забывают:

- **`bSmoothFrameRate`/`SmoothedFrameRateRange` (22..62 ◇)** в `Engine.ini` — не cvar, в консоли не ищется. Плюс `bUseFixedFrameRate`.
- **Лимит драйвера** («Max Frame Rate» в NVCP/NVIDIA App, в т.ч. отдельный лимит для фоновых приложений) — применяется независимо от игры и без следа в её конфиге.
- **VRR, которого в исходной версии не было вообще.** С G-SYNC/FreeSync потолок не жёсткий, а коридор: кадры выше верхней границы диапазона уходят либо в разрыв (VSync off), либо в ожидание флипа (VSync on) — и второе стоит до одного интервала обновления задержки. Практика ◇: G-SYNC + VSync **on** + лимит на 3–5 к/с ниже частоты панели даёт минимальную задержку без разрывов; при активном Reflex этот лимит Reflex ставит сам, и ручной `t.MaxFPS` только мешает.
- **С генерацией кадров всё это делится на кратность.** Лимит 141 при 3x означает базу 47 — и именно база определяет ощущение. Ставить лимит «под панель» и радоваться числу на счётчике — самая распространённая ошибка настройки FG.

### 9. Как драйвер NVIDIA перекрывает настройки игры и как это обнаружить

Отдельный слой поверх всего раздела. Что именно драйвер умеет подменить ◇:

| что подменяется | где включается | видно ли в конфиге игры |
|---|---|---|
| модель/пресет DLSS-SR и сама DLL | NVIDIA App → DLSS Override → Model Presets | нет |
| **включение и кратность генерации кадров** (в т.ч. MFG 3x/4x поверх игровых 2x) | NVIDIA App → DLSS Override → Frame Generation | нет |
| режим низкой задержки | NVCP → Low Latency Mode (Off/On/Ultra) | нет |
| лимит частоты | NVCP/NVIDIA App → Max Frame Rate | нет |
| вертикальная синхронизация, G-SYNC, предпочитаемая частота | NVCP → профиль приложения | нет |
| драйверная генерация кадров без участия игры (Smooth Motion) | NVIDIA App | нет |

Все шесть строк объединяет одно: **игра о них не знает, её ini не меняется, и любой аудит конфига проходит мимо.**

Как обнаружить, по возрастанию надёжности:

1. **Экранный индикатор DLSS.** Реестр `HKLM\SOFTWARE\NVIDIA Corporation\Global\NGXCore`, `ShowDlssIndicator`. Печатает версию DLL, внутреннее разрешение, букву пресета и кратность FG — то есть ровно то, что скрывает замещение.
2. **Оверлей NVIDIA (Alt+R).** Помечает драйверный режим: у нас — «FG OVR», «DLSS ГК: Предустановка A, Динамическая 3x» при `DLSSGeneratedFrames=1` в конфиге игры.
3. **Какие DLL реально загружены в процесс.** Драйверное замещение подсовывает свою `nvngx_dlss.dll` мимо папки игры. Проверяется без сторонних утилит:
   ```powershell
   Get-Process Palworld-Win64-Shipping | ForEach-Object { $_.Modules } |
     Where-Object { $_.ModuleName -like 'nvngx*' -or $_.ModuleName -like 'sl.*' } |
     Format-Table ModuleName, FileName, FileVersion -AutoSize
   ```
   Путь вне `…\Pal\Binaries\Win64\` = замещение; заодно видна фактическая версия, а не заявленная.
4. **Контрольный опыт.** Переключить профиль на «Использовать настройку 3D-приложения» и посмотреть, что пропадёт. У нас пропала генерация целиком — это и доказало, что игра её не включает (см. п. 6 «Проверено нами»).
5. **Замер.** Лимит частоты, которого вы не ставили, и потолок ровно на круглом числе — почерк драйвера. Ищется по `MsBetweenDisplayChange` в PresentMon.

---

## Разбор частых заблуждений

Блок, которого в исходной версии не было. Всё ниже встречается в гайдах и на форумах постоянно и всё ниже неверно.

- **«DLSS — это анти-алиасинг, его можно выключить и оставить апскейл».** Наоборот: без темпорального метода сглаживания апскейл перестаёт быть темпоральным, и DLSS выпадает целиком (§«Что это», §4). `r.AntiAliasingMethod=0` при 58% даёт бикубик из 2227×1253 — то самое мыло, от которого человек и бежал.
- **«Генерация кадров разгружает GPU».** Она его нагружает: интерполяция — это работа. При упоре в GPU на 99% включение FG роняет базу и добавляет задержку сразу по двум статьям.
- **«Кратность 4x вчетверо ухудшает задержку».** Нет. Удержание — примерно один базовый кадр при любой кратности; ухудшение идёт через падение базы (§7).
- **«Reflex ускоряет рендер».** Reflex не делает кадр быстрее, он убирает ожидание в очереди и подбирает момент старта кадра. На CPU-упоре (наш случай, п. 9) он почти бесполезен; режим 2 (boost) там помогает только тем, что удерживает частоты GPU.
- **«FPS вырос — значит стало лучше».** При активной генерации счётчик показанных кадров вообще не характеризует отзывчивость. Делить на кратность обязательно.
- **«Оверлей показывает 3x, а в конфиге 1 — конфиг сломан».** Конфиг исправен и не является доказательством: работает драйвер (§9).
- **«DLSS экономит видеопамять».** DLSS-SR — немного да (внутренние буферы меньше), DLSS-G — уверенно нет: удержанный кадр, копии сцены без HUD, маски UI. Порядок величины — сотни мегабайт и выше ◇.
- **«Версия nvngx_dlss.dll в папке игры = версия DLSS, которая работает».** При замещении в драйвере — нет. Смотреть загруженный модуль, а не файл на диске.
- **«Шлейф лечится резкостью».** Резкость не восстанавливает историю. Шлейф — это векторы движения (§5) или пресет модели; резкость только делает шлейф контрастнее.
- **«Поставлю `r.ScreenPercentage=100` — DLSS отключится».** Нет, это DLAA: тот же плагин, доля 1.0. Чтобы отключить, нужен `r.NGX.DLSS.Enable=0` или `r.TemporalAA.Upscaler=0`.
- **«`r.Streaming.MipBias` сделает текстуры резче под DLSS».** Не тот механизм: за компенсацию mip при апскейле отвечают `r.ViewTextureMipBias.*`, и движок делает это сам.
- **«Cvar читается обратно, значит применился».** Readback подтверждает только запись в объект cvar-а. Он не доказывает ни того, что проход существует (§4), ни того, что значение доехало до сцены (п. 2 «Проверено нами»), ни того, что его не перекрыл драйвер (§9).
- **«PresentMon покажет сгенерированные кадры».** Не в этой связке (п. 7 «Проверено нами»).
- **«Лимит частоты в меню игры сильнее ini».** Наоборот: `[SystemSettings]` (4) сильнее `SetByGameSetting` (2). Ползунок будет двигаться впустую.
- **«FG стоит включать всегда, если игра умеет».** NVIDIA рекомендует базу не ниже ~60 к/с ◇; ниже растёт и артефактность, и относительный вклад удержания. При базе 42 (наш случай) FG — это косметика для счётчика.

---

## Симптом → причина

| симптом | механизм | чем лечить | что отличает от соседней причины |
|---|---|---|---|
| FPS на счётчике высокий, управление «ватное» | кратность генерации × очередь кадров: задержка считается от T_base | снизить кратность/целевую частоту FG; `RHI.MaximumFrameLatency` 3→2; `r.OneFrameThreadLag` 1→0 | Разделить счётчик показанных кадров на кратность. Если база <45 — виновата база, а не настройки FG |
| Задержка высока и БЕЗ генерации | буферизация RHI | те же два cvar-а очереди | Выключить FG и замерить: если LAT не упал — интерполятор ни при чём |
| Правка `RHI.MaximumFrameLatency` в живом мире ничего не дала | значение применяется на создании swap chain ◇ | прописать в `Engine.ini` и перезапустить, либо сменить режим окна/разрешение | Отличается от «фантомного имени» тем, что readback показывает новое значение, а задержка не двигается |
| Шлейф за тонкими объектами (провода, ветки) | низкоразрешающие векторы движения | `r.NGX.DLSS.DilateMotionVectors=1` (это дефолт — проверить, не выключили ли) | Шлейф за ВСЕМ подряд, включая статичную геометрию при движении камеры |
| Шлейф за травой, листвой, флагами | геометрия анимируется через WPO и скорость не пишет вовсе | `r.Velocity.EnableVertexDeformation`, `r.Velocity.EnableLandscapeGrass`; диагностика — `r.Velocity.ForceOutput=1` | Камера стоит, шлейф есть только на колышущемся. Дилатация тут не помогает: дилатировать нечего |
| Рябь и «дрожь» вокруг интерфейса на генерируемых кадрах | Streamline не получил тег UI | `r.Streamline.TagUIColorAlpha=1` (дефолт), `TagSceneColorWithoutHUD=1` | Артефакт привязан к HUD и исчезает при выключении FG, а не при смене качества |
| Куски сцены «замерзают» под полупрозрачным HUD | сцена ошибочно попала в маску UI по низкой альфе | поднять `r.Streamline.TagUIColorAlphaThreshold` | Обратный случай — смазанный полупрозрачный HUD — лечится в другую сторону; направление проверять глазами |
| Размытие в движении неестественно сильное после включения FG | выдержка motion blur не масштабирована на сгенерированные кадры | `r.Streamline.DLSSG.AdjustMotionBlurTimeScale=2` (дефолт; **не 1**) | Пропадает при `r.DefaultFeature.MotionBlur=0`, но возвращается вместе с блюром |
| Картинка мягче, чем ожидалось, резкость не крутится | у DLSS резкости больше нет | `r.Tonemapper.Sharpen` (работает при любом апскейлере) или FSR2 RCAS; для DLSS — сменить пресет | `r.NGX.DLSS.Sharpness` в билде отсутствует ✖ — команда принимается консолью как неизвестная |
| Правишь `r.TemporalAA*` / `r.TSR.*` — ничего не меняется | проходы TAA/TSR не создаются при активном DLSS | если нужно именно TSR — `r.TemporalAA.Upscaler=0` или `r.NGX.DLSS.Enable=0` | Значение читается обратно верно. Readback НЕ доказывает работу |
| Выключил TAA ради резкости — стало сильно хуже | вместе с методом сглаживания отключился темпоральный апскейл, 58% растянул бикубик | вернуть `r.AntiAliasingMethod=2/4` | Индикатор DLSS исчезает совсем — это и есть отличие от «просто мягкой картинки» |
| Разрешение не то, что просили | `r.ScreenPercentage.Mode` (авто), меню игры пишет поверх, динамика перетирает, или доля упёрлась в коридор апскейлера | `Mode=0` + явный процент; проверить `r.DynamicRes.OperationMode`; проверить, что DLSS вообще жив | Индикатор DLSS покажет фактическое внутреннее разрешение — по нему и различать |
| Ползунок в меню игры двигается, ничего не меняется | ваш `[SystemSettings]` (4) сильнее `SetByGameSetting` (2) | убрать строку из ini либо принять, что меню теперь декорация | Касается `t.MaxFPS`, `r.ScreenPercentage`, `r.VSync` в первую очередь |
| Частота упирается в ~62 | `bSmoothFrameRate` | `bSmoothFrameRate=False` в `[/Script/Engine.Engine]` | Это не cvar; в консоли не находится |
| Лимит кадров ведёт себя странно при Reflex | лимит исполняет Reflex, а не движок | `t.Streamline.Reflex.HandleMaxTickRate=false`, если нужен движковый | Проверяется выключением FG: без него Reflex отключается по `Auto` |
| Частота упёрлась в круглое число, которого нет ни в одном конфиге | лимит драйвера | NVCP/NVIDIA App → Max Frame Rate | В конфигах игры пусто, в PresentMon — идеально ровный потолок |
| Конфиг игры показывает одно, оверлей — другое | замещение в драйвере (NVIDIA App) | «Использовать настройку 3D-приложения» либо принять драйверную | Оверлей помечает драйверный режим («FG OVR», «Динамическая 3x») |
| Мерцание в полноэкранных меню/картах при FG | интерполяция почти статичного кадра с нулевыми скоростями | `r.Streamline.DLSSG.FullScreenMenuDetection=true` | Артефакт только в меню, в игре чисто |
| Рывок при каждом входе/выходе из меню после включения детекции меню | FG освобождает и заново создаёт ресурсы | `r.Streamline.DLSSG.RetainResourcesWhenOff=true`, `r.NGX.DLSS.ReleaseMemoryOnDelete=0` | Рывок строго на границе включения/выключения FG, а не в бою |
| `r.GTSyncType=2` не дал ничего | нет поддержки событий флипа в этом RHI, либо `r.VSync=0`, либо нечем задать запас (`rhi.SyncSlackMS` ✖) | оставить 0/1; задержку снимать очередью и Reflex | Отличие от фантома: имя живое, readback верный, эффекта нет |

---

## Опыт сообщества

**Проверено людьми на замерах / подтверждено вендором:**

- *DLSS-резкость удалена, а не спрятана.* NVIDIA в README плагина: «DLSS sharpening is deprecated, future plugin versions will remove DLSS sharpening. Use the NIS plugin for sharpening instead». Форумы датируют слом версией DLL 2.5.1. В нашем билде обоих cvar-ов уже нет ✖ — это не мнение, а проверка. Замена, которая работает всегда, — `r.Tonemapper.Sharpen`.
- *TSR-историю можно урезать вдвое почти бесплатно.* AMD (GPUOpen) рекомендует в `AntiAliasingQuality@3` снизить `r.TSR.History.ScreenPercentage` с 200 до 100. Рекомендация вендора с обоснованием по полосе — но при DLSS она бессмысленна, потому что TSR не работает.
- *Экранный индикатор DLSS — рабочий прибор.* Реестр `HKLM\SOFTWARE\NVIDIA Corporation\Global\NGXCore`, `ShowDlssIndicator`. Официальный `.reg` из репозитория NVIDIA/DLSS ставит `dword:00000001`; сообщество массово использует `1024` (0x400), объясняя это тем, что 1 включает индикатор для dev-DLL, а 0x400 — для обычных игровых.
- *Reflex и чужая генерация кадров несовместимы.* Позиция NVIDIA, растиражированная профильной прессой: Reflex Low Latency не поддерживает генерацию кадров, отличную от DLSS. **Оговорка к этому билду: FSR3/FSR3-FG здесь нет вообще, так что вопрос академический** — актуален он для драйверной Smooth Motion и сторонних модов.
- *Пресеты и модели.* Ходовое знание сообщества ◇: A–F/G — CNN-модели разных лет, J/K — трансформерные (DLSS 4), L/M/N/O — более свежие. Практический вывод один: буква имеет смысл только вместе с версией DLL, которую вы реально загрузили, а не с той, что лежит в папке игры.

**Советы без проверки (пересказ, относиться скептически):**

- Пакеты «оптимизации UE5» с десятками строк `r.TemporalAA*`, `r.PostProcessAAQuality`, `r.DefaultFeature.AntiAliasing`, `D3D12.MaximumFrameLatency`, `r.Streamline.*.Sharpness`. В нашем билде **большая часть этих имён отсутствует физически**, а живая часть инертна при DLSS. Копирование такого пакета в `Engine.ini` не улучшает и не ухудшает ничего — до того дня, когда DLSS не поднимется, и весь мёртвый блок оживёт разом.
- «Поставьте `r.NGX.DLSS.DilateMotionVectors=0` для FPS». Дефолт и так 1; выключение отдаёт качество тонких деталей за десятые доли миллисекунды.
- «`r.FinishCurrentFrame=1` убирает лаг». Формально верно (справка билда прямо это говорит), но там же написано «This will improve latency, but slow down overall performance». При Reflex — бессмысленно.
- «`r.GTSyncType=2` + `rhi.SyncSlackMS` — самая низкая задержка» (рекомендация **самой Epic**). Для этого билда неприменима: `rhi.SyncSlackMS` отсутствует, а режим 2 требует поддержки событий флипа и включённой вертикальной синхронизации. Пример того, как официальная документация движка расходится с конкретной сборкой.
- Жалобы «DLSS-плагин насильно ставит 66%» (форум NVIDIA) — это не баг, а описанный механизм: меню игры пишет `r.ScreenPercentage` от имени кода, поверх вашего ini.

---

## Проверено нами

Все числа — замеры на конкретной машине: Palworld 1.0.3 (UE ~5.1), RTX 5070 Ti (драйвер 610.88), Ryzen 7 5700G, панель 3840×2160 @ 144 Гц, DLSS SR пресет L «Баланс» (58%), генерация DLSS-G через замещение в NVIDIA App. Инструмент — Intel PresentMon 2.5.1, выборка 18 932 кадра одной цепочки показа, режим `Hardware: Independent Flip`.

**1. Имена cvar-ов надо сверять со списком зарегистрированных в exe.** Из 1173 присваиваний в нашем `Engine.ini` **764 задают cvar, которого в билде НЕТ**. Разбор строк справки самого `Palworld-Win64-Shipping.exe` подтвердил для этого раздела: `r.NGX.DLSS.Sharpness`, `r.NGX.DLSS.PreferNISSharpen`, `r.NGX.DLSS.Quality`, `r.NGX.DLSS.EnableAutoExposure`, `r.Streamline.NIS.Sharpness`, `r.Streamline.DLSS.Sharpness`, `r.Streamline.XeSS.Sharpness`, `r.Streamline.Reflex.Mode`, `r.TemporalAA.Algorithm`, `r.TemporalAASharpness`, `r.DefaultFeature.AntiAliasing`, `r.PostProcessAAQuality`, `D3D12.MaximumFrameLatency`, `D3D11.MaximumFrameLatency` — **отсутствуют**. Дополнено этой ревизией: **`rhi.SyncSlackMS` и `rhi.SyncInterval` тоже отсутствуют** (в прошлой версии раздела они стояли в таблице как живые с дефолтами 10 и 1 — ошибка). Живые аналоги: `r.NGX.DLSS.AutoExposure`, `t.Streamline.Reflex.Mode`, `r.AntiAliasingMethod`, `r.FXAA.Quality`, `RHI.MaximumFrameLatency`, `r.Tonemapper.Sharpen`.

**2. `Engine.ini [SystemSettings]` в Palworld доезжает до сцены — но не весь.** Доказано прибором мода UE4SS, который логирует значение ДО перезаписи: он застал `grass.CullDistanceScale=4.0`, GuardBand 2.0/2.2, `ViewDistanceScale=2.2`, `MaxCSMResolution=1536` — ровно значения ini, которых нет больше нигде. НО `foliage.LODDistanceScale` застали равным 2.0 при 4 в ini: отдельные строки игра перебивает своим кодом. **Секции `[ConsoleVariables]` и `[/Script/Engine.RendererSettings]` ненадёжны: `r.NGX.DLSS.DilateMotionVectors` лежал там и до сцены не дожил.**

**3. Задержка: −36% по медиане — но вклад не разложен.** `D3D12.MaximumFrameLatency` 3→2 и `r.OneFrameThreadLag` 1→0 дали input→photon p50 **41.6 → 26.8 мс**:

| | было (3x, очередь 3) | стало |
|---|---|---|
| input → photon p50 | 41.6 мс | **26.8 мс** |
| input → photon p95 | 75.5 | 73.4 |
| input → photon p99 | 91.0 | **93.9 (хуже)** |
| render → present p50 | 20.8 | 17.4 |
| GPU latency p50 | 20.4 | 16.9 |
| на экране, медиана | ~127 | 95.2 (1% low 36.6) |

**Три поправки, которые обязан знать любой, кто повторяет этот рецепт:**
- правок было ТРИ одновременно (кратность 3x→2x через цель генерации 120→80; `MaximumFrameLatency`; `OneFrameThreadLag`), поэтому вклад каждой неизвестен;
- имя `D3D12.MaximumFrameLatency` в этом билде **не зарегистрировано** — эта строка не могла внести вклад вообще. Правильное имя — `RHI.MaximumFrameLatency`, и оно не проверялось;
- **p99 ухудшился.** Рецепт «−36%» верен только для медианы; про хвосты честный итог — «не улучшилось, местами хуже».
- Отдельно: наш собственный `check-live-cvars.py` до сих пор держит `D3D12.MaximumFrameLatency` и `D3D12.MultithreadedCommandListBuilding` в списке `STARTUP_OK` — то есть инструмент аудита сам молча оправдывает два фантома. Чинить вместе с этим разделом.

Корректный протокол повтора: одна правка за заход, тот же маршрут, то же время суток, ≥3 прохода, сравнивать медианы и перцентили, а не средние.

**4. Медиану держала кратность и очередь, хвосты держит базовая частота.** После правок медиана упала на 36%, а p95/p99 **не сдвинулись**: `GPU busy` p95 = 33.5 мс, `CPU busy` p95 = 37.7 мс — в тяжёлых местах сцена идёт около 30 кадров. Никакая настройка генерации этого не лечит.

**5. Бюджет задержки сходится — но приборы не согласны между собой, и это надо развести.** Два числа для «того же самого»: оверлей NVIDIA показывал **LAT 67.6 мс**, PresentMon в том же режиме дал **p50 41.6 мс**. При базе ~42 к/с (24 мс) это 2.8 базовых кадра по оверлею и 1.7 — по PresentMon. Прошлая версия раздела брала «три базовых кадра» из оверлея, а таблицу — из PresentMon; так делать нельзя. Различие объяснимо (оверлей усредняет по окну и меряет по маркерам Reflex всю цепочку, PresentMon даёт распределение), но пока оно не воспроизведено сознательно — **арифметику «ровно три кадра очереди» считать неподтверждённой**. После правок цифры согласуются лучше: база ~47.6 (21 мс), LAT p50 26.8 → 1.3 базовых кадра.

**6. Драйвер молча перекрывает настройку игры.** `GameUserSettings.ini` содержит `DLSSGeneratedFrames=1` (то есть 2x), а фактически работало **3x**: NVIDIA App → «Замещение DLSS — режим генерации кадров», режим «Динамическая», цель 120, потолок «До 3x». Проверено дальше:
- выбор «Использовать настройку 3D-приложения» → генерация **пропала совсем**. Вывод: **Palworld не включает Frame Generation сам**, несмотря на `DLSSFrameGenerationMode=On` в своём конфиге; она живёт исключительно через замещение в драйвере;
- список кратностей в NVIDIA App начинается с 3x в обоих режимах — двойного там нет вовсе;
- **фактическую кратность задаёт целевая частота, а потолок — только потолок.** Снижение цели со 120 до 80 дало фактические ~2x. Прыжки между x2 и x3 — штатное поведение динамики при цели 80 (80÷3 ≈ 27, 80÷2 = 40 кадров базы).
**Вывод класса: конфиг игры не является доказательством того, что работает.**

**7. Открытый PresentMon НЕ метит кадры DLSS-G.** В захвате 18 932 кадра все имеют тип `Application`, ни одного сгенерированного — при заведомо работающей генерации (подтверждено оверлеем: «DLSS ГК: Предустановка A, Динамическая 3x»). Вывод «генерация не работает» был сделан и **отозван**. Более того, при включённой генерации `MsBetweenPresents` перестаёт показывать базовую частоту: медиана 0.99 мс («1010 показов в секунду») при реальных 115 отображённых кадрах по `MsBetweenDisplayChange`; в другом заходе колонка давала «медиану 150 к/с» при лимите 141. **Базовая частота читается только с оверлея NVIDIA или FrameView.** Отсутствие метки не есть отсутствие функции.

**8. `AntiAliasingType=AAM_TSR` в конфиге ничего не опровергает.** Это отдельное поле настроек, и оно не отменяет выбор DLSS в своём пункте. Считать его доказательством работы TSR было домыслом — ровно тот механизм, что описан в §4. Обратное, впрочем, тоже верно и важно: если бы это поле стояло в `AAM_None`, DLSS бы не работал вовсе (§«Что это»).

**9. Снижение разрешения не лечит панораму.** Замер по полосам частоты: на панораме (25–45 к/с) `CPU busy` 28.1 мс против `GPU busy` 6.2 — игра упирается в **игровой поток**. Ryzen 7 5700G, мир грузится в один поток. Следствие: DLSS и любой другой апскейл здесь бесполезны как лекарство; лечится только снижением CPU-нагрузки (дальности, драв-коллы, стриминг). Единственное, что из этого раздела там вообще уместно, — `t.Streamline.Reflex.Mode=2` (boost удерживает частоты GPU при CPU-упоре), и это не проверено.

**10. Сцена крайне неравномерна — читать только медианы и перцентили.** `CPU busy` p50 = 0.48 мс против p90 = 36. По средним однажды был сделан и отозван вывод «CPU стал боттлнеком». Нельзя сравнивать заходы в сцене, упёртой в лимит: ночь у статуи давала медиану 142 при лимите 141 — там разница настроек не видна в принципе, только по `GPU busy`.

**11. `r.ScreenPercentage=33.3` в performance-профиле был ошибкой.** Это DLSS Ultra Performance, внутренние 1280×720 на 4K-панели. Исправлено на 50. Дополнение этой ревизии: та же строка при неподнявшемся DLSS дала бы не 33.3%, а 50% или 25% — в зависимости от того, кто подхватил апскейл (§2а). То есть строка ещё и недетерминирована.

**12. Что в нашем собственном `Engine.ini` относилось к этому разделу и было мусором.** `r.NGX.DLSS.PreferNISSharpen=0`, `r.NGX.DLSS.Sharpness=0`, `r.Streamline.{NIS,DLSS,XeSS}.Sharpness=0`, `r.TemporalAASharpness=0`, `r.TemporalAA.Algorithm=1`, `r.DefaultFeature.AntiAliasing=2`, `D3D12.MaximumFrameLatency=2` — имена, которых в билде нет. `r.NGX.DLSS.DilateMotionVectors=0` — понижение относительно дефолта. `r.Streamline.TagUIColorAlpha=0` — прямой вред. Блок `r.TemporalAA*` (CatmullRom=0, CurrentFrameWeight=0.2, FilterSize=0.7, Samples=8) — имена живые, но при DLSS инертные **и опасные в день, когда DLSS не поднимется**.

**13. Про мультипоточность, по касательной к задержке.** Из пяти «включённых нами» многопоточных cvar-ов мод менял ровно ОДИН — остальные уже стояли в 1 по умолчанию. Живое имя — `r.RHIThread.Enable`; `r.RHIThread`, `r.EnableMultiThreadedRendering`, `D3D12.MultithreadedCommandListBuilding` в билде отсутствуют. «Фикс зависаний DX12», под который держали `MaximumFrameLatency=3`, наполовину состоял из несуществующих строк.

---

## Что в этом разделе ещё НЕ проверено

Честный список долгов — чтобы следующий читатель не принял ◇ за ⚑.

1. **Ни один дефолт не прочитан живьём.** Первоочередные кандидаты: `r.ScreenPercentage.Mode`, `r.ScreenPercentage`, `RHI.MaximumFrameLatency`, `r.OneFrameThreadLag`, `t.MaxFPS`, `r.Streamline.DLSSG.Enable`, оба `DilateMotionVectors`. Инструмент есть — блок CVars мода UE4SS плюс чтение до перезаписи.
2. **`RHI.MaximumFrameLatency` 3→2 не мерялся отдельным заходом** — весь эффект п. 3 приписан несуществующему имени и двум другим правкам.
3. **Гипотеза «FG включается из мода»**: `r.Streamline.DLSSG.Enable 1` через `SetByConsole` в загруженном мире. Если сработает — генерация перестанет зависеть от драйвера, и весь §9 станет опциональным.
4. **Коридор доли апскейлера (§2а)** взят из устройства движка, а не из этого билда. Проверяется за минуту: `r.ScreenPercentage=33.3` при `r.NGX.DLSS.Enable=0` и взгляд на `stat unit`/индикатор.
5. **Направление `TagUIColorAlphaThreshold`** — исходная рекомендация, по всей видимости, перевёрнута; проверяется глазами на полупрозрачном HUD.
6. **`t.Streamline.Reflex.Mode=2` на CPU-упоре (п. 9)** — единственная непроверенная надежда для панорамы.
7. **Правда ли `r.Vsync` — второй живой cvar**, или это строка из справки.

---

## Источники

**Первичный для этого билда** — строки, извлечённые из `D:\Games\Palworld-1.0.3\Pal\Binaries\Win64\Palworld-Win64-Shipping.exe` (UTF-16 и ASCII литералы); список имён — `D:\work\ai_sandbox\Palworld\_config\cvars-registered.txt` (4458 строк), генератор `scan-cvars.py`. **Ограничение метода**: даёт имена и тексты справки, не даёт зарегистрированных значений; отдельные имена в дамп не попадают (контрпример — `sg.GlobalIlluminationQuality`).

**Наши замеры и разборы:**
- `D:\work\ai_sandbox\Palworld\_config\Latency-and-FrameGen-audit.md` — латентность, генерация кадров, два отозванных вывода; расхождение оверлея (LAT 67.6) и PresentMon (p50 41.6)
- `D:\work\ai_sandbox\Palworld\_config\Pareto-audit.md` — экономия/потеря по cvar-ам, список несуществующих имён
- `D:\work\ai_sandbox\Palworld\_config\check-live-cvars.py` — сверка ini с живым блоком мода (**содержит устаревший `STARTUP_OK` с двумя фантомами — починить**)
- `d:\work\ai_sandbox\KUMM\games\Palworld\README.md` — досье сборки, замеренная база
- `d:\work\ai_sandbox\KUMM\games\Palworld\tuning-2026-08-15-base-fps.md` — правка 15.08.2026

**Epic:**
- [Low-Latency Frame Syncing in Unreal Engine](https://dev.epicgames.com/documentation/en-us/unreal-engine/low-latency-frame-syncing-in-unreal-engine) — `r.GTSyncType`, `r.OneFrameThreadLag`, `rhi.SyncSlackMS` (**последнего в нашем билде нет**)
- [Screen Percentage with Temporal Upscale in Unreal Engine](https://dev.epicgames.com/documentation/en-us/unreal-engine/screen-percentage-with-temporal-upscale-in-unreal-engine)
- [Temporal Super Resolution in Unreal Engine](https://dev.epicgames.com/documentation/unreal-engine/temporal-super-resolution-in-unreal-engine)
- [Scalability Reference for Unreal Engine](https://dev.epicgames.com/documentation/en-us/unreal-engine/scalability-reference-for-unreal-engine) — группы `sg.*`, включая `sg.ResolutionQuality`
- [Dynamic Resolution in Unreal Engine](https://dev.epicgames.com/documentation/en-us/unreal-engine/dynamic-resolution-in-unreal-engine)

**NVIDIA:**
- [README плагина DLSS Super Resolution / DLAA для UE (текст)](https://pastebin.com/XXs6Sng7) — дефолты `r.NGX.*`, депрекация резкости, выбор режима по screen percentage
- [DLSS Frame Generation Quick Start Guide (PDF)](https://d29g4g2dyqv443.cloudfront.net/sites/default/files/DLSS_Frame_Generation_Quick_Start_Guide.pdf)
- [Streamline: ProgrammingGuideDLSS_G.md](https://github.com/NVIDIA-RTX/Streamline/blob/main/docs/ProgrammingGuideDLSS_G.md) — теги UI/скоростей, требования к Reflex
- [NVIDIA/DLSS — utils/ngx_driver_onscreenindicator.reg](https://github.com/NVIDIA/DLSS/blob/main/utils/ngx_driver_onscreenindicator.reg)
- [Tips: Getting the Most out of the DLSS Unreal Engine Plugin](https://developer.nvidia.com/blog/tips-getting-the-most-out-of-the-dlss-unreal-engine-4-plugin/)
- [NVIDIA App: Global DLSS Overrides](https://www.nvidia.com/en-us/geforce/news/nvidia-app-global-dlss-overrides-rtx-40-series-smooth-motion/), [DLSS 4.5 Dynamic Multi Frame Generation](https://www.nvidia.com/en-us/geforce/news/nvidia-app-dlss-4-5-dynamic-multi-frame-generation-available-now/) — Alt+R, метка «OVR», Smooth Motion
- [Reflex SDK](https://developer.nvidia.com/performance-rendering-tools/reflex)

**Инженерные разборы:**
- [AMD GPUOpen — Unreal Engine Performance Guide](https://gpuopen.com/learn/unreal-engine-performance-guide/) — рекомендации по `AntiAliasingQuality@3`
- [Unreal Directive — Console Variables](https://unrealdirective.com/resources/console-variables/) — дефолты `r.ScreenPercentage` (0), `r.ScreenPercentage.MaxResolution` (0.0)
- [FRAMED. — UE5 Console Variables and Commands](https://framedsc.com/GeneralGuides/ue5_commands.htm)
- [Microsoft Learn — IDXGIDevice1::SetMaximumFrameLatency](https://learn.microsoft.com/en-us/windows/win32/api/dxgi/nf-dxgi-idxgidevice1-setmaximumframelatency) — дефолт очереди DXGI = 3, применение на уровне устройства/цепочки показа

**Форумы и сообщество (помечено как пересказ):**
- [Overclockers UK — DLSS DLL 2.5.1 disables sharpen](https://forums.overclockers.co.uk/threads/dlss-dll-version-2-5-1-completely-disables-dlss-sharpen-in-existing-games.18965062/)
- [NVIDIA Developer Forums — Unreal DLSS Plugin Forces Screen Percentage](https://forums.developer.nvidia.com/t/unreal-dlss-plugin-forces-screen-percentage-size-even-when-unlocked/188740)
- [PC Gamer — DLSS indicator registry tweak](https://www.pcgamer.com/nvidia-dlss-indicator/), [emoose/DLSSTweaks — ngx_driver_onscreenindicator_all.reg](https://github.com/emoose/DLSSTweaks/blob/master/external/ngx_driver_onscreenindicator_all.reg)
- [KitGuru — Reflex Low Latency и чужая генерация кадров](https://www.kitguru.net/gaming/joao-silva/nvidia-claims-reflex-low-latency-doesnt-work-with-other-frame-generation-technologies-like-fsr/)