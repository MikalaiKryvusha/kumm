# План 22 — сценарий демо Svarog's Dream для авторов игры

> **Created:** 2026-10-12 (слово владельца: «и написать сценарий на демо»).
> **Parent:** `plans/21_svarog_demo_for_authors.md` (решения владельца, формат, как снимаем); летопись и числа —
> `researches/svarogs-dream/demo-chronicle-2026-10-04_12.md`.
> **Status:** ⏸ заменён сценарием v2 `plans/23_svarog_demo_script_v2.md` (2026-10-12, правки владельца). Был: черновик; голос синтезирован (59 сцен, ≈11 мин — `SvarogsDream/_harness/demo21/narration/`);
> 2026-10-12 18:04 смонтированы сцены 1–10, 12, 15–18, 20–25, 57–59 (черновик первой половины); 11, 13, 14, 19 и акты 4–7 — нет.
> **Outbound:** голос EN → синтез голосом C; ролик — авторам игры.

**Как читать.** Секунды — оценка; сцена длится столько, сколько звучит её фраза (голос C ≈ 2.4 слова в секунду) плюс 1.5 с тишины,
но не меньше 6 с. Длина ролика — ≈11–12 минут. «Было / стало» снимается в одной точке одной камерой: F9 (картинка игры), запуск без
модов или готовая пара из галереи (`SvarogsDream/gallery/game/…`). Камера — у героя, облёт медленный, время мира идёт.
Главная мысль ролика — слово владельца: «как в ИХ работу мы вложили нашу душу и руку помощи».

## Акт 0 — Привет (≈50 с)

| № | с | В кадре · как снять | Голос (EN) | По-русски | Источник |
|---|---|---|---|---|---|
| 1 | 10 | Бор на закате, медленный облёт; первые 4 с — только звук игры | Hi Ivan, hi Valentina! It's Mikalai again. | Привет, Иван и Валентина! Это снова Микалай. | — |
| 2 | 16 | Герой идёт лесом, камера медленно поднимается к небу | I've been playing games since I was seven — I'm thirty-three now. My big brother got me hooked on Neverwinter Nights, and I never stopped. I've also spent years in QA, so I notice every little thing that gets in a player's way. | Играю с семи лет, мне тридцать три. Брат подсадил на Neverwinter Nights — и я не остановился. Годы в QA: замечаю каждую мелочь, что мешает игроку. | слово владельца 2026-10-12; письмо 07.10 |
| 3 | 10 | Облёт; титр «Svarog's Dream · 9 days · 517 commits» | Nine days ago we only wanted to fix the night colours in your game. This is where it took us. | Девять дней назад мы хотели только поправить ночные цвета. Вот куда это нас привело. | git SvarogsDream |
| 4 | 14 | Бор днём, жители | We make these mods for ourselves for now, so the game you'll see is in Russian, and I'll tell you everything on screen. It's all your world — we only added our soul and a helping hand. | Моды пока делаем для себя, поэтому игра на русском — я расскажу всё, что в кадре. Это всё ваш мир, мы лишь вложили душу и руку помощи. | слово владельца 2026-10-12 |

## Акт 1 — Начали с ночного цвета (≈55 с)

| № | с | В кадре · как снять | Голос (EN) | По-русски | Источник |
|---|---|---|---|---|---|
| 5 | 10 | Ночь в Боре, F9: картинка игры 5 с | This is how it started. At night the camera's colour grading pushed the shadows into purple and the midtones into blue. | С этого началось. Ночью цветокор камеры уводил тени в пурпур, полутона — в синеву. | `researches/svarogs-dream/README.md` |
| 6 | 12 | Та же точка, F9 — наша картинка | Our first mod, at one in the morning on October fourth, replaced it with our own grading: one look for the day, one for the night, blended at dusk and dawn. | Первый мод, в час ночи 4 октября, заменил его своим: картинка дня и картинка ночи, смешанные в сумерках. | git, коммит 04.10 01:12 |
| 7 | 8 | Ночь, свет вокруг героя | At night a soft light follows the hero, so you see the path and keep the darkness. | Ночью мягкий свет вокруг героя: дорогу видно, тьма остаётся. | git 04.10 02:06 |
| 8 | 12 | Низкое солнце: земля белёсая → матовая (настройка мода вкл/выкл) | Against a low sun the ground turned milky white — the glare of the standard shader. We wrote our own matte ground shader, and it costs no frames. | Против низкого солнца земля белела — блик стандартного шейдера. Написали свой матовый шейдер земли, кадров он не стоит. | галерея `2026-10-05_матовая-земля` |
| 9 | 9 | Карта: сиреневая → цвета мира (пара `2026-10-04_карта-палитра`) | The map had extra blue baked into its texture. We moved it back to the colours of the world itself. | В текстуре карты был лишний синий — вернули ей цвета самого мира. | галерея `2026-10-04_карта-палитра` |

## Акт 2 — Камера открыла мир (≈70 с)

| № | с | В кадре · как снять | Голос (EN) | По-русски | Источник |
|---|---|---|---|---|---|
| 10 | 10 | Поворот камеры мышью, наклон до 10° | Then the camera. Now it turns around the hero and tilts almost down to eye level. | Потом камера: вращается вокруг героя и опускается почти до уровня глаз. | git 04.10, 10.10 |
| 11 | 9 | Пологий вид: взгляд над головой | It looks a metre above the hero's head, not at the feet — so a low view shows the horizon, not the grass. | Смотрит на метр выше головы, а не в ноги — пологий вид показывает горизонт, а не траву. | `SvarogsDream/README.md` |
| 12 | 16 | Медленный облёт 360° с холма: лес вдаль | And the world is far now. Five by five cells stay loaded instead of three by three. Real trees stand up to three hundred metres, and beyond them the forest melts into the haze. | Мир теперь далёкий: загружено 5×5 участков вместо 3×3, настоящие деревья до 300 м, дальше лес тает в дымке. | git 04.10 20:21, 11.10 14:53 |
| 13 | 9 | Отдаление: трава и кроны не редеют (пары `2026-10-11_трава-при-отдалении`, `…_листва-при-отдалении`) | Grass and treetops no longer thin out when you zoom out. | Трава и кроны больше не редеют при отдалении. | галерея 11.10 |
| 14 | 8 | Дальние соломенные крыши в дымке (пара `2026-10-12_дымка-белёсая/04`) | Even distant roofs sit in the same haze as the forest. | Даже дальние крыши — в той же дымке, что и лес. | галерея 12.10 |
| 15 | 10 | Пара `2026-10-09_небо/было-стало.webp`: чёрная полоса → небо | But a low camera showed one more thing: a black void above the horizon. So we had to build a sky. | Но пологая камера показала ещё одно — чёрную пустоту над горизонтом. Пришлось строить небо. | галерея `2026-10-09_небо` |

## Акт 3 — Небо и вода (≈100 с, слов мало — красота)

| № | с | В кадре · как снять | Голос (EN) | По-русски | Источник |
|---|---|---|---|---|---|
| 16 | 10 | День, облака, облёт вверх | You saw our sky in the last video, so just a reminder: | Небо вы видели в прошлом ролике, поэтому коротко: | письмо 09.10 |
| 17 | 10 | Закат малиновый, потом золотой (два вечера) | six moods by hour and weather, and two sunsets that take turns, | шесть настроений по часу и погоде, два заката по очереди, | `games/SvarogsDream/README.md` |
| 18 | 10 | Гроза, молния | rain with lightning, and your own thunder. | дождь с молниями и вашим же громом. | там же |
| 19 | 10 | Стайка птиц через небо | New since then: ten kinds of birds, each flying at its own time of day. | Новое с тех пор: десять видов птиц, у каждого своё время дня. | git 10.10 01:01 |
| 20 | 12 | Ночь в деревне (часы F10), северное сияние | Five auroras, | Пять северных сияний, | git 10.10 10:55 |
| 21 | 10 | Две луны | a second moon, and a moon that changes colour from night to night, | вторая луна, и луна меняет цвет от ночи к ночи, | демо v2, `2026-10-10_демо-4K/README.md` |
| 22 | 10 | Падающие звёзды | and falling stars. The whole sky is drawn on the graphics card and costs almost nothing. | и падающие звёзды. Всё небо считает видеокарта, и стоит оно почти ничего. | `testcases/TC_svarog_sky_v3_2026-10-09.md`, C21 |
| 23 | 8 | Дневная даль в белёсой дымке | The haze is light and pale now, not blue. | Дымка теперь светлая, белёсая, не синяя. | git 12.10 08:57 |
| 24 | 14 | Пруд: как у автора (отражение одного неба) → наше (земля и горы) | Water: its reflection camera only caught the sky. Now it reflects the hills and mountains too, for half a millisecond. Reflecting the whole scene would cost twenty frames per second, so we didn't. | Вода: камера отражения ловила только небо. Теперь в воде холмы и горы — за полмиллисекунды. Отражение всей сцены стоило бы 20 FPS, мы так не стали. | `researches/svarogs-dream/water-recon.md` |
| 25 | 12 | Медленный облёт на закате, без голоса | — | — | — |

## Акт 4 — Интерфейс (≈4 мин) — «было / стало» · почему лучше · на кого равнялись

| № | с | В кадре · как снять | Голос (EN) | По-русски | Источник |
|---|---|---|---|---|---|
| 26 | 16 | Открывается большое окно; врезкой — коллаж образцов из `gallery/refs` | Now the interface — this is where most of our hours went. We studied twenty-five great RPGs — Diablo, Path of Exile, Grim Dawn, World of Warcraft, FATE, Torchlight, Neverwinter Nights, Oblivion — and then went through your windows one by one. | Теперь интерфейс — сюда ушла большая часть часов. Изучили 25 больших RPG… и прошли ваши окна одно за другим. | `SvarogsDream/gallery/refs/README.md` |
| 27 | 12 | HUD было / стало | The HUD: a world clock by the minimap, a calm grey compass, a brighter minimap, and big hotkey numbers. Time and the way — without looking away from the world. | HUD: часы у миникарты, спокойный серый компас, миникарта ярче, крупные цифры клавиш. Время и путь — не отрываясь от мира. | git 09.10, 12.10 |
| 28 | 13 | Значки до горизонта → в 100 м (пара `2026-10-05_значки-и-лаг`) | World icons used to cover the whole horizon and cost up to seventeen milliseconds a frame. Now they are one size, appear within a hundred metres, and you click them like the object itself. | Значки покрывали весь горизонт и стоили до 17 мс кадра. Теперь одного размера, видны в 100 м и щёлкаются как сам предмет. | галерея `2026-10-05_значки-и-лаг` |
| 29 | 8 | Разговор жителей, пузыри | Speech bubbles fit their text, fade in softly and stay as long as the line needs. | Пузыри по длине текста, появляются мягко и держатся, сколько нужно строке. | git 06.10 02:04 |
| 30 | 7 | Бой: боевые надписи | Combat text is one and a half times bigger, and it speaks Russian too. | Боевые надписи в полтора раза крупнее — и тоже по-русски. | git 11.10 15:30 |
| 31 | 16 | Карточка предмета: было → четыре макета → итог | The item card. We gathered forty-six item cards from twenty-five games and drew our own: quality, protection and damage tiles, a clean stats table, price and weight in one place. Diablo IV was our model for clarity. | Карточка предмета: собрали 46 карточек из 25 игр и нарисовали свою… Образец ясности — Diablo IV. | летопись 04.10; рулбук, образцы |
| 32 | 10 | Сравнение с надетым | Comparing: what you wear stands next to what you hold, and every difference is green or red with an arrow. One glance — better or worse. | Сравнение: надетое рядом, каждая разница зелёная или красная со стрелкой. Один взгляд — лучше или хуже. | `SvarogsDream/README.md` |
| 33 | 14 | Инвентарь: «?» у стата, «Золото · Вес», сумка с прокруткой | In the inventory every stat has a question mark that explains how the number really works — we read it from your code. Gold shows in full, and the bag holds a hundred slots. | В инвентаре у каждого стата «?» — как число работает на самом деле, прочитали из вашего кода. Золото полностью, в сумке 100 ячеек. | `ideas/07`, п. 31–32 |
| 34 | 14 | Список было / стало (пары `2026-10-04_эпик10-фаза1-читаемость`) | Menus moved onto dark paper with light text. Text contrast went from one point nine to seven — the accessibility norm is four and a half. And we kept your rainbow stripes, just calmer. | Меню на тёмной бумаге со светлым текстом: контраст 1.9 → 7 при норме 4.5. Вашу радугу оставили, только спокойнее. | галерея эпика 10, фаза 1 |
| 35 | 14 | Окно персонажа: Прогресс, Атрибуты, Преданность, Мастерство | The character window: progress as clean tables, attributes as cards, the gods and the mastery trees in the same style. Numbers never run into labels. | Окно персонажа: прогресс таблицами, атрибуты карточками, боги и деревья мастерства в одном стиле. Числа не налезают на подписи. | git 06.10 |
| 36 | 7 | Карточка навыка с длинным описанием | A skill card grows with its text instead of cutting it. | Карточка навыка растёт по тексту, а не обрезает его. | git 06.10 14:11 |
| 37 | 12 | Карта, квесты, журнал, альманах | The map, quests, journal and almanac: every page as a card, each quest with a thin stripe in the colour of its kind. | Карта, квесты, журнал, альманах: страницы карточкой, квест с тонкой полосой цвета своего вида. | git 05.10 |
| 38 | 12 | Разговор на тёмной бумаге | In conversations the villager speaks in handwriting, answers shine in old gold, and there is always a 'Leave' button. | В разговоре житель говорит рукописью, ответы — старым золотом, и всегда есть «Уйти». | git 07.10 21:44 |
| 39 | 11 | Записка Gabriela, затем окно интерфейса Manrope | Two fonts for two voices: Manrope is the interface, and the handwritten Gabriela is the paper of your world — notes, books, the journal. | Два шрифта — два голоса: Manrope для интерфейса, рукописная Gabriela — бумага мира. | `games/SvarogsDream/README.md` |
| 40 | 7 | Вести мира | News of the world reads on a dark strip, in your own red and violet. | Вести мира — на тёмной полосе, вашими красным и фиолетовым. | git 09.10 09:29 |
| 41 | 10 | Подсказка обучения, совет загрузки | Tutorial tips and loading hints are larger and warmer, so a new player is drawn in, not pushed away. | Подсказки обучения и советы загрузки крупнее и теплее — новичка они затягивают, а не отталкивают. | git 06.10 |
| 42 | 9 | Выбор героя | Choosing a hero: dark cards, the name in copper, attributes in pairs. | Выбор героя: тёмные карточки, имя медью, атрибуты парами. | git 07.10 23:06 |
| 43 | 13 | Экран смерти было / стало (пара `2026-10-12_экран-смерти`) | The death screen — players see it often. Now it's one calm column: the portrait, the epitaph in handwriting, and a big red 'Continue'. | Экран смерти — игрок видит его часто. Теперь одна спокойная колонка: портрет, эпитафия рукописью, большая красная «Продолжить». | отчёт `2026-10-12_svarog-death-big-red-button.md` |
| 44 | 8 | Окно с «ОК» | Every 'OK' — a hundred and sixty-seven of them — got a brush stroke in its own window's colour. | Все 167 кнопок «ОК» — кистью в цвет своего окна. | STATUS, отчёт `2026-10-12_svarog-ok-buttons.md` |
| 45 | 9 | Настройки было / стало (пара `2026-10-10_настройки-в-игре`) | And the settings: every page in one calm rhythm. | И настройки: каждая страница в одном спокойном ритме. | git 12.10 16:29 |

## Акт 5 — Лица и слова (≈65 с)

| № | с | В кадре · как снять | Голос (EN) | По-русски | Источник |
|---|---|---|---|---|---|
| 46 | 20 | Лист 62 портретов «до / после», медленная панорама | Your heroes. As a kid I loved the painted portraits of Neverwinter Nights, and I wanted the same for yours. All sixty-two are in colour now — made with neural networks, checked one by one, and true to your drawings. | Ваши герои. В детстве я любил рисованные портреты Neverwinter Nights — и захотел такие же вашим. Все 62 в цвете: нейросети, проверка по одному, верность вашим рисункам. | `plans/20`; `researches/svarogs-dream/gemini-avatar-coloring.md` |
| 47 | 7 | Выбор героя в игре с цветными портретами | They already live in the game. | Они уже живут в игре. | STATUS (62/62 в игре) |
| 48 | 16 | Разговор: Alt+T — ваш английский ↔ наш русский | And the words. We turned off machine translation and wrote our own Russian, with a glossary and a light old-Slavic flavour: all 8,022 dialogue lines, 720 items, every note and book. | И слова. Выключили машинный перевод и написали свой, с глоссарием и лёгкой старославянской ноткой: все 8022 реплики, 720 предметов, все записки и книги. | `plans/14`; git 06.10 |
| 49 | 10 | Маска-клад: 8000 монет | One small fix of game logic: the mask treasure now pays the promised eight thousand coins — we reported it to you on Steam. | Одна правка логики: маска-клад платит обещанные 8000 — мы писали вам об этом в Steam. | отчёт `2026-10-07_svarog-fixes-mask-payout.md` |
| 50 | 6 | Меню паузы, кнопка «Настройки модов» | And every option is one click away, in the pause menu. | И любая настройка — в один щелчок из меню паузы. | `SvarogsDream/README.md` |

## Акт 6 — Честно о границе (≈45 с)

| № | с | В кадре · как снять | Голос (EN) | По-русски | Источник |
|---|---|---|---|---|---|
| 51 | 10 | Бор при отдалении; титр «18.7 → 59.6 FPS» | Performance. We won back a lot: in the heaviest place the game went from about nineteen to sixty frames per second. | Производительность: отыграли много — в самом тяжёлом месте с ~19 до 60 кадров. | отчёт `2026-10-05_svarog-perf-icons-characters.md` |
| 52 | 15 | Карточка «где кадр»: 2 из 16 потоков, видеокарта 12–35 %, кости 1641 из 1860 | But here we hit the ceiling. The game uses about two of sixteen processor threads, and the graphics card is busy only a third of the time. Almost the whole world runs on one main thread, and a big part of every frame goes to moving villagers' bones. | Но тут потолок: игра занимает ~2 потока из 16, видеокарта загружена на треть. Почти весь мир идёт в одном потоке, и большая часть кадра уходит на кости жителей. | летопись 05.10; `plans/19` |
| 53 | 15 | Спокойная сцена у реки | A mod is a layer on top — from outside we can't move that work to other threads. With the project itself, a newer Unity and animation in jobs, the same world could run much faster. If you ever want a hand with that, we'd love to help. | Мод — надстройка, снаружи эту работу на другие потоки не унести. С самим проектом — новым Unity, анимацией в задачах — мир шёл бы куда быстрее. Захотите помощи — будем рады. | `plans/19`; слово владельца 2026-10-12 |

## Акт 7 — Как мы работаем (≈35 с)

| № | с | В кадре · как снять | Голос (EN) | По-русски | Источник |
|---|---|---|---|---|---|
| 54 | 8 | Окно чата с Claude рядом с игрой (без путей и имён) | A confession: I vibe-code these mods with Claude, an AI agent. | Признание: эти моды я вайбкожу с Claude, ИИ-агентом. | слово владельца 2026-10-12 |
| 55 | 17 | Пульт открывает окна игры, лист кадров проверки | I describe what I want as a player. The agent writes the code, starts the game itself, opens every window, takes screenshots, measures — and only then shows me. Five hundred and seventeen commits in nine days. | Я говорю, чего хочу как игрок. Агент пишет код, сам запускает игру, открывает окна, снимает кадры, меряет — и только потом показывает мне. 517 коммитов за девять дней. | `games/SvarogsDream/README.md`; git |
| 56 | 7 | Облёт | My part is taste: where the eye stumbles, and what feels right. | Моя часть — вкус: где спотыкается глаз и что ощущается правильным. | память «красота — без швов» |

## Акт 8 — Спасибо (≈35 с)

| № | с | В кадре · как снять | Голос (EN) | По-русски | Источник |
|---|---|---|---|---|---|
| 57 | 14 | Закат у реки, облёт | Svarog's Dream is a miracle made by two people. We put our soul into it because it deserves it. | Svarog's Dream — чудо, сделанное двумя людьми. Мы вложили в него душу, потому что он того стоит. | письмо 07.10 |
| 58 | 12 | Ночное небо, облёт | Thank you, Ivan and Valentina. We are just getting started. | Спасибо, Иван и Валентина. Мы только начинаем. | — |
| 59 | 8 | Титр: «Mods — Mikalai Kryvusha, made with Claude · Svarog's Dream by VI Game Forge» | — | — | досье |

## Проверить перед записью

- Сумка на 100 ячеек — в игре сейчас? (07.10 «начато»; кадр до записи).
- 517 коммитов — пересчитать в день монтажа.
- Акт 7: кадр экрана без путей, имён файлов, профиля; лист — глазом до монтажа.
