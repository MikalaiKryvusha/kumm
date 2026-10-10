# Разведка — ожидание рабочих потоков и рассылка сдвигов в Svarog's Dream

> **Created:** 2026-10-10 · **Parent:** вопрос владельца в чате · **Status:** разведка · **Outbound:** ответ владельцу в чате

Без запуска игры. Локально прочитаны: снимок `SvarogsDream/_harness/prof_bor_after_{tree,self,threads}.txt` (Бор, ночь, 4K,
development-плеер, 300 кадров, кадр 15.85 мс), `prof_bor_walk_tree.txt`, `prof_bor_night_tree.txt`, отчёты
`testcases/reports/2026-10-10_svarog-{profile-after-icons,devplayer-map,far-parts,offscreen-agents,evening-batch}.md`,
EXP-0203…0210, `main-thread-profile-2026-10-10.md`, `main-thread-recon.md`, декомпиляция игры (ilspycmd). Источники — [U1]… внизу.
Пометка `[AI]` — вывод агента, не факт источника; `[гипотеза]` — числа нет, есть только замер, который его даст.

## 0. Коротко

1. **«Ожидание рабочих потоков» 3.39 мс — не ожидание отсечения, скиннинга или аниматоров.** По дереву снимка его парт-маркеры:
   рамки рендереров 1.43 мс (`UpdateAllRenderers` 1.16 + частицы 0.27) и рассылка сдвигов, подписанная стадиями интерфейса,
   1.37 мс (`UpdateRectTransform` 0.66 + `PlayerUpdateCanvases` 0.71); аниматоры, тени, отсечение, навигация — по 0.01–0.09.
2. **Рабочие потоки при этом простаивают:** 15 потоков `Worker 0…14` заняты по 0.55–0.58 мс за кадр 15.85 мс (≈3.5 %). Главный поток
   ждёт не нехватку рук, а латентность: планировщик Unity до 2021.3.14 будит рабочих семафором, и это дорого [U1]; дефект «простой
   CPU в `WaitForJobGroupID` до нескольких мс на кадр» Unity исправила только в 2022.3.64f1 / 6000.0.51f1 [U2].
3. **Рассылка сдвигов 2.33 мс своего** — это 8 точек синхронизации за кадр по 0.07–0.43 мс каждая (физика ×3, навигация ×2,
   отсечение, интерфейс ×2), и дорожает она от того, **сколько заинтересованных компонентов висит под двигающимся корнем**, а не от
   числа повёрнутых костей (наши EXP-0203/0205/0206 плюс устройство `TransformHierarchy` [U3][U4]).
4. **Радикального рычага без вида не видно.** Дешёвые и честные опыты: `JobsUtility.JobWorkerCount` на лету [U5]; кеш рамок у
   `LuxWater_ProjectorRenderer` (0.46 мс); затем перепись компонентов под корнем жителя. `OptimizeTransformHierarchy` — рискованно и
   по нашим же замерам бьёт по костям, которые почти бесплатны.

## 1. Кого ждёт главный поток — наш снимок `bor_after`

| Стадия → маркер ожидания | `Semaphore.WaitForSignal`, мс/кадр | Что внутри |
|---|---|---|
| `PostLateUpdate.UpdateAllRenderers` → `UpdateRendererBoundingVolumes` | 1.155 | рамки всех сдвинутых рендеров; главный поток сам делает ещё 0.276 |
| `PlayerUpdateCanvases` → `UGUI.UpdateBatches` → `TransformChangedDispatch` | 0.705 | рассылка сдвигов; своего у рассылки 0.126 |
| `PostLateUpdate.UpdateRectTransform` → `TransformChangedDispatch` | 0.664 | первая рассылка после записи костей аниматорами; своего 0.071 |
| `ParticleSystem.Update` → `UpdateRendererBoundingVolumes` | 0.273 | рамки частиц |
| прочие ≈20 мест (аниматоры `WriteJob` 0.094, тени, отсечение, `NavMeshObstacle`, скиннинг) | ≈0.6 | по 0.01–0.09 |
| **Итого** | **3.39** | на ходу `bor_walk` — 2.95; рисунок тот же (`UpdateAllRenderers` 1.12) |

- Рабочие за кадр делают ≈1.05 мс `UpdateRendererBoundingVolumes` и ≈0.98 мс `TransformChangedDispatch` суммарно на 15 потоков
  (`prof_bor_after_threads.txt`, верхние строки по потокам) — работа есть, но мелкая и размазанная. `[AI]` Ждать 1.16 мс работу,
  которой у каждого потока на 0.07 мс, — признак цепочек мелких заданий и цены пробуждения, а не объёма.
- Unity: `WaitForJobGroupID` на главном потоке — место, где он ждёт задания [U6]; после пробуждения семафором рабочий тратит время на
  переключение контекста, «Signaling to wake worker threads is expensive», а на задачах 0.5 мкс при 20+ рабочих выходит «nearly twice
  as slow», чем без системы заданий; исправлено в 2022.2 и 2021.3.14f1 [U1]. Наш плеер — 2020.3.49f1, старый планировщик.
- По умолчанию рабочих «as many … as there are virtual cores … minus one»; на платформах без резервного ядра «it can be better to
  reduce the amount» через `JobsUtility.JobWorkerCount` [U1]. Свойство пишется на лету, только вниз, до `JobWorkerMaximumCount` [U5].
- Отсюда снят вопрос 1 о «чьих заданиях ждём»: отсечение (`SceneCulling` 0.03), скиннинг (`SkinnedMeshFinalizeUpdate` 0.02),
  аниматоры (≈0.15 всех `WaitForSignal`), тени и непрозрачная отрисовка (0.03 + 0.08) — мелочь. Тени и 1450 отбрасывателей считаются на рабочих
  (`Shadows.CullShadowCastersWithoutUmbra` ≈0.034 на поток); у главного `Shadows.CullDirectionalShadowCasters` 0.026.

## 2. Рассылка сдвигов — механизм и наши факты

- Устройство по Unity: одна `TransformHierarchy` на каждый корень сцены; `TransformChangedDispatch` держит список «грязных» иерархий;
  «More root transforms are better since their checking is jobified»; плоские иерархии вместо глубоких (Unite Berlin 2018) [U3].
  Системы подписываются на конкретные трансформы вместо общей рассылки; рассылка — отложенная и в заданиях (Spotlight, 2017) [U4].
- Совет Spotlight: у того, что двигается каждый кадр, в детях только то, что зависит от позиции — «rendering, physics, audio»;
  «around 50 or so GameObjects per root». Кейс клиента: способности NPC вынесли из-под `NavAgent` — «~10 FPS» [U4] (в мс не дано).
- Наши точки рассылки за кадр (`bor_after`, своё время главного): отсечение 0.434 · физика `SyncColliderTransform` 0.331,
  `SyncRigidbodyTransform` 0.317, после шага 0.151 (физика идёт 0.8 раза за кадр) · навигация в симуляцию 0.421 и обратно 0.420 ·
  интерфейс 0.126 + 0.071. Итого 2.27 из 2.33.
- `[AI]` Три наших опыта вместе дают модель цены: URO (кости дальних реже) — сдвинутых трансформов −36 %, кадр тот же (EXP-0203);
  стоп записи позиции агента у дальних — −0.4…−0.7 мс, а у видимых в 40–80 м — −0.9…−1.1 (EXP-0205, EXP-0206). Кость без
  компонентов почти никому не интересна; сдвиг **корня** трогает каждый рендер, коллайдер, тело, холст под ним. Значит, цена ∝
  числу заинтересованных компонентов под двигающимися корнями, × 8 точек синхронизации. Модель не доказана — см. опыты К0, К4.
- Что висит под корнем жителя (декомпиляция): тело собрано из частей `PlayerBody.BodyPart` (12 частей: голова, лицо, грудь, руки,
  кисти, ноги, ступни, волосы…); снаряжение прячет части через `SetActive(false)` (`PlayerBody.SetBodyPartState`), волосы и доспех —
  отдельные `SkinnedMeshRenderer` через `BoneCombiner.AddLimb`; оружие, лук, факел — под `ItemHolders.weaponTransform`/`bowTransform`/
  `torchTransform`. В кадре 124 вызова `MeshSkinning.SkinOnGPU` — столько видимых скин-рендеров.
- Unity про такие тела: «Using two skinned meshes in place of a single one could roughly double the rendering time» [U7]. И дефект
  UUM-37730: `UpdateRendererBoundingVolumes` дольше при **выключенных** рендерерах в иерархии, Won't Fix для 2021.3, исправлен в
  2022.2.0a17 [U8] — `[AI]` 2020.3 старше, спрятанные части тела под снаряжением могут платить по нему.

## 3. Рычаги из вопроса — что годится

| Рычаг | Вердикт для нас | Почему |
|---|---|---|
| `JobsUtility.JobWorkerCount` на лету | **опыт К1** | пишется в рантайме, только вниз [U5]; старый планировщик дорого будит рабочих [U1] |
| Graphics Jobs выкл. (`gfx-enable-gfx-jobs=0`) | нет | в `MultiThreaded` промежуточные команды готовит главный поток, в `LegacyJobified` — рабочие [U9]; у нас рабочие уже делают `RenderDeferred.GBuffer` (≈0.04/поток) |
| DX12 / Native Graphics Jobs | нет, замерено | DX12 +1 мс главного потока (план 19, `TC_svarog_main_thread_2026-10-10.md` C1–C4) |
| `PlayerSettings.gpuSkinning` | уже вкл., в рантайме не меняется | `PlayerSettings` — API редактора [U10]; у игры `gpuSkinning` true (`main-thread-recon.md` §1) |
| `QualitySettings.skinWeights` | не про главный поток | скиннинг на видеокарте (`SkinOnGPU`); на главном `CalcMatrices` 0.16 мс |
| `AnimatorCullingMode` | **опыт К3** (уже мерен) | `CullUpdateTransforms` — вне экрана без записи трансформов [U11]; 94 «двигать всегда» — 0.8 мс в Баре (EXP-0210) |
| `keepAnimatorControllerStateOnDisable` | только если выключать аниматоры | без него выключение сбрасывает состояние [U12] |
| Отбор частиц | нет | Automatic + World space не отбирается вне экрана — By Design [U13]; но у нас вне кадра частицы ≈0.1–0.2 мс (`…particles-cost.md`) |
| Occlusion culling | нет | у игры нет данных Umbra (`CullObjectsWithoutUmbra` в снимке); запекание — в редакторе `[AI]` |
| LOD bias | нет, замерено | ×4.5 → 1 — шум (план 19); `LOD.ComputeLOD` 0.075 мс |
| Тени: дистанция, каскады, 1450 отбрасывателей | не про эти 5.7 мс | отбор отбрасывателей на рабочих (§1); тени ×3 → ×2 днём без выигрыша (план 19) |
| `QualitySettings.maxQueuedFrames` | нет | очередь кадров драйвера, задержка ввода против частоты [U14]; не задания |
| `Transform.hierarchyCapacity` | нет | ускоряет `SetParent` и `Destroy` больших иерархий [U15], не рассылку |
| Интерполяция тел | нет | в коде игры `Interpolate` только у эффекта `RFX4_PhysicsMotion` (декомпиляция) |
| `AnimatorUtility.OptimizeTransformHierarchy` | **опыт К6**, риск высокий | §4 |

## 4. `OptimizeTransformHierarchy` в рантайме — можно, но что сломается

- Можно: «A call to this function at runtime will re-initialize the animator»; функция убирает иерархию под объектом, и аниматор
  пишет матрицы прямо в скиннинг — «saving many CPU cycles»; `exposedTransforms` — список имён, которые останутся плоско под корнем [U16].
  В оптимизированном режиме «skinned Mesh matrix extraction is multi-threaded» [U17]; Unite 2016 — «greatly increase performance»,
  без чисел [U3]. Опубликованного замера в мс не нашёл.
- Что сломается у нас (декомпиляция):
  - `BoneCombiner` ищет кости по тегу `armature` обходом иерархии и строит новые `SkinnedMeshRenderer.bones` — после оптимизации
    костей нет: волосы и доспех при смене снаряжения не соберутся;
  - `HairObject` читает `SkinnedMeshRenderer.bones`;
  - `ItemHolders.weaponTransform`/`bowTransform`/`torchTransform` — точки крепления; их надо выставить через `exposedTransforms`, а
    уцелеют ли ссылки игры на них после перестройки — не проверено `[AI]`;
  - смена снаряжения в рантайме (`EquipmentHandler.EquipCharacter`, замена жителей фракцией) — нужен `DeoptimizeTransformHierarchy`
    до и повтор после; у Deoptimize есть дефекты с объектами на выставленных костях (падение) [U18] и «Bones do not match bindpose»
    после правки весов [U19];
  - аниматор переинициализируется — поза и состояние сбросятся на кадр `[AI]`.
- Главное возражение — наши же замеры: кости дешёвые (URO −36 % сдвигов → 0 мс, EXP-0203). Оптимизация срежет костную часть
  (`Animators.WriteJob` 0.12, `CalcMatrices` 0.16 и долю рассылки), но не сдвиг корня с рендерами. `[гипотеза]` ≤0.5 мс.

## 5. Что пишут про саму игру

- Новости разработчика о производительности — только про подгрузку с диска: «stuttering while a new area is loading», галка «World
  Preloading» (2023-12-16), подгрузка «a few square kilometers» на экране загрузки (2024-01-29), загрузка с диска (2024-05-17) [U20].
  Про главный поток, города и NPC в новостях ничего нет.
- Отзывы Steam (787 последних, английские и русские, поиск по fps/lag/stutter/performance/оптимиз) — 25 совпадений, около десятка
  жалоб на кадр [U21]: «extreme frame drops in one village to the east (pagan one…)» (152955950); «from 60 it drops to below 20 … I
  have to lower the graphics» (153055431); «lags hard even on low graphics» (188857300); «constantly chugging with fps drops, loading
  lag spikes» (185945038); «сильные просадки … когда были большие сражения» (215696040). `[AI]` «тормозит и на низких настройках» —
  обычный признак упора в процессор, но отзыв — не замер.
- Форум обсуждений Steam отдаёт поиск только после возрастного шлюза — не прочитан. Обзор RPG Codex — про игру, не про кадр [U22].
- Общий фон Unity: NPC с большой иерархией под `NavAgent` — кейс Spotlight [U4]; Rust: «Unity's CPU-side rendering was essentially
  clogging up our main thread» [U23].

## 6. Кандидаты по рангу

Все числа «было» — `bor_after` на development-плеере; release не сверен (C3 карты потока). Мерить по EXP-0206/EXP-0210: A-B
чередованием 6+ раз после 2–3 минут покоя, `perf 8`, счётчики рендеров и частиц совпадают.

| # | Кандидат | Ожидаемый выигрыш · основание | Риск | Как мерить |
|---|---|---|---|---|
| К0 | **Разбор таймлайна уже снятых `bor_after.raw`/`bor_walk.raw`** без игры: что делают рабочие в окна `WaitForSignal` главного (`RawFrameDataView`, время начала сэмплов по потокам) — `KrinikProfDump`, режим timeline | 0 мс сам по себе; решает, латентность это (→ К1) или цепочка заданий (→ К4–К5) | нет | текст «окно ожидания → сэмплы рабочих» |
| К1 | `JobsUtility.JobWorkerCount` 15 → 8 → 4 → 15 на лету | `[гипотеза]` часть из 3.39 мс; основание — цена пробуждения и конкуренции старого планировщика [U1], дефект простоя [U2]; потолка нет | низкий: вниз и обратно без перезапуска [U5]; при 4 работа рабочих (≈8 мс/кадр на 15) может удлинить отсечение и `GBuffer` | `h.sh "call Unity.Jobs.LowLevel.Unsafe.JobsUtility set_JobWorkerCount 8"` + `perf 8`, A-B-A ×6; затем `pcap` и разбивка `WaitForSignal` по §1 |
| К2 | Кеш рамок в `LuxWater_ProjectorRenderer.OnPreCull` (Harmony): читать `m_Rend.bounds` проекторов раз и обновлять при `transform.hasChanged` | ≤0.46 мс: под `OnPreCull` 21.9 вызова `UpdateRendererBoundingVolumes` за кадр, 0.456 мс (`bor_after`; на ходу метод 0.551) | низкий: пена и нормали воды; `[AI]` проекторы, скорее всего, неподвижны — сверить | `prof`/`pcap`: строка `LuxWater…OnPreCull`; `perf 8` A-B под ключом |
| К3 | 94 аниматора «двигать всегда» (не жители) → `CullUpdateTransforms` | 0.8 мс в Баре — замер `animcull transforms` (EXP-0210, вечерний прогон) | низкий-средний: что анимируют эти 94 — перечислить (`comps Animator`) | `animcull transforms|restore` + `perf 8` в Баре и Бору |
| К4 | Перепись компонентов под корнем жителя (`hierarchyCount`, рендеры вкл./выкл., коллайдеры, холсты, частицы, звук) → вынести лишнее из-под движущегося корня по Spotlight [U4] | `[гипотеза]` бьёт по 2.33 рассылки и 1.37 ожидания «интерфейса»; кейс Spotlight ≈10 FPS [U4], в мс нет | перепись — нет; вынос — средний (игра ищет части тела обходом `_body`, `FindBodyPart`) | новый пульт `hier <тип>`; опыт — выключить `Canvas` значков игры (`CharacterIcon`, `QuestCharacterIcon`, `EnemyHealthBar`) у жителей, A-B |
| К5 | Спрятанные части тела (`SetActive(false)`) — проверить UUM-37730 [U8] | `[гипотеза]`; дефект «значимо дольше» без чисел | опыт — низкий (счёт); правка — средний | пульт: число неактивных `SkinnedMeshRenderer` под жителями; опыт — `Destroy` спрятанных частей на копии сейва, `perf` и строка рамок в `pcap` |
| К6 | `OptimizeTransformHierarchy` для жителей без смены снаряжения, с `exposedTransforms` для `ItemHolders` | `[гипотеза]` ≤0.5 мс (§4): кости дешёвые по EXP-0203 | высокий: §4, сейв «Железного человека» | на копии сейва, 10 жителей, `tmoved` + `perf`, журнал исключений; затем смена снаряжения |
| К7 | Шаг физики 50 → 30 Гц (`Time.fixedDeltaTime` 0.02 → 0.033) | ≈0.5 мс арифметикой: физика 1.33 мс/кадр при 0.8 шага, станет ≈0.5 шага; `[AI]` | средний, меняет поведение: стрелы (`Arrow.OnCollisionEnter`), триггеры «глаз» ИИ, 4 аниматора в физическом шаге — решение владельца | `call UnityEngine.Time set_fixedDeltaTime 0.0333` + `perf 8`; бой и стрельба глазом |
| К8 | Один скин-рендер на жителя (слить части в меш с подмешами) | `[гипотеза]`; «two skinned meshes … roughly double the rendering time» [U7]; режет рамки, скиннинг, отсечение | высокий: пересборка при каждой смене снаряжения | `perf` (рендеры), `pcap` — `UpdateAllRenderers`, `SkinOnGPU` |

Не делать: Graphics Jobs выкл., DX12, `hierarchyCapacity`, `maxQueuedFrames`, LOD bias, отбор частиц вне кадра, «вне кадра реже» для
агентов (EXP-0206) — основания в §3. Режим питания Windows («Высокая производительность» против «Сбалансированной») может влиять на
пробуждение рабочих — `[гипотеза]` без источника по Unity; это настройка машины владельца, только с его слова.

## Источники

- [U1] Unity, «Improving job system performance scaling in 2022.2 – part 2: Overhead» (2023-03-14) — https://unity.com/blog/engine-platform/improving-job-system-performance-2022-2-part-2
- [U2] Issue 10294 «CPU has a high amount of idle time when waiting for jobs to complete» — https://issuetracker.unity.com/issues/10294/cpu-has-a-high-amount-of-idle-time-when-waiting-for-jobs-to-complete
- [U3] Конспект Unite 2016 «Let's Talk (Content) Optimization» и Unite Berlin 2018 «Unity's Evolving Best Practices» — https://gamedev.center/best-optimization-tips-by-unity-engineers-at-unite/
- [U4] Spotlight Team best practices: Optimizing the hierarchy (2017-06-29) — https://unity.com/blog/engine-platform/best-practices-from-the-spotlight-team-optimizing-the-hierarchy
- [U5] JobsUtility.JobWorkerCount 2020.3 — https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Unity.Jobs.LowLevel.Unsafe.JobsUtility.JobWorkerCount.html
- [U6] Job system troubleshooting (WaitForJobGroup) — https://docs.unity.cn/2018.3/Documentation/Manual/JobSystemTroubleshooting.html
- [U7] Modeling characters for optimal performance 2020.3 — https://docs.unity3d.com/2020.3/Documentation/Manual/ModelingOptimizedCharacters.html
- [U8] UUM-37730 «UpdateRendererBoundingVolumes process takes more time when disabled Renderers are used» — https://issuetracker-mig.prd.it.unity3d.com/issues/updaterendererbonudingvolumes-process-takes-more-time-when-disabled-renderers-are-used
- [U9] RenderingThreadingMode 2020.3 — https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Rendering.RenderingThreadingMode.html
- [U10] PlayerSettings.gpuSkinning 2020.3 — https://docs.unity3d.com/kr/2020.3/ScriptReference/PlayerSettings-gpuSkinning.html
- [U11] AnimatorCullingMode 2020.3 — https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AnimatorCullingMode.html
- [U12] Animator.keepAnimatorControllerStateOnDisable 2020.3 — https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Animator-keepAnimatorControllerStateOnDisable.html
- [U13] #UnityTips: ParticleSystem Performance – Culling — https://unity.com/blog/engine-platform/particlesystem-performance-culling-tips · issue 1384882 — https://issuetracker-mig.prd.it.unity3d.com/issues/particle-system-isnt-culled-off-screen-when-the-culling-mode-is-set-to-automatic-and-the-simulation-space-is-set-to-world
- [U14] QualitySettings.maxQueuedFrames 2020.3 — https://docs.unity3d.com/2020.3/Documentation/ScriptReference/QualitySettings-maxQueuedFrames.html
- [U15] Transform.hierarchyCapacity 2020.3 — https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Transform-hierarchyCapacity.html
- [U16] AnimatorUtility.OptimizeTransformHierarchy 2020.3 — https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AnimatorUtility.OptimizeTransformHierarchy.html
- [U17] FBX Importer, Rig tab (Optimize Game Objects) 2020.3 — https://docs.unity3d.com/2020.3/Documentation/Manual/FBXImporter-Rig.html
- [U18] Deoptimize падает при объекте со скин-рендером на выставленной кости — https://issuetracker-mig.prd.it.unity3d.com/issues/deoptimizetransformhierarchy-crashes-when-an-object-having-a-skinnedmeshrenderer-is-attached-to-an-exposed-bone
- [U19] «Bones do not match bindpose» после правки весов — https://issuetracker-mig.prd.it.unity3d.com/issues/animatorutility-skinnedmeshrenderer-with-modified-boneweights-breaks-animatorutility-dot-optimizetransformhierarchy
- [U20] Новости Svarog's Dream (Steam API, тексты постов) — https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=2004640&count=200&maxlength=0 ; пост 2023-12-16 — https://store.steampowered.com/news/app/2004640/view/3863589647906441314
- [U21] Отзывы Steam (номера — `recommendationid`) — https://store.steampowered.com/appreviews/2004640?json=1&filter=recent&language=english и `language=russian`
- [U22] RPG Codex Review: Svarog's Dream — https://rpgcodex.net/content.php?id=12427
- [U23] Rust, The Performance Update (2018) — https://rust.facepunch.com/blog/the-performance-update
