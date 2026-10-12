# Research — coloring the 62 hero portraits with Gemini image models (Nano Banana)

> **Created:** 2026-10-11 (owner's question in chat: can the Gemini API free pool color the hero avatars, or by hand in the browser) ·
> **Parent:** `plans/18_svarog_backlog_checklist.md` line «Портреты 62 героев — раскрашивает владелец» ·
> **Status:** recon done 2026-10-11 16:27; route not chosen — owner's call (money vs browser) ·
> **Outbound:** decision to the owner (paid API key vs his logged-in AI Studio in the debug Chrome)

## Source material (observed)

- `SvarogsDream/art/heroes_avatars_original/` — 62 files, `<Name>, the <role>.webp`, 512×512, RGB, grey pencil-like
  portraits (looked at `Adam, the builder.webp`).

## Facts from the official pricing page (fetched 2026-10-11, https://ai.google.dev/gemini-api/docs/pricing)

| Model id | Name | Free tier (API) | Standard | Batch |
|---|---|---|---|---|
| `gemini-2.5-flash-image` | Nano Banana | Not available | $0.039 / image ≤1024 | — · **deprecated, shut down 2026-10-02** |
| `gemini-3.1-flash-image` | Nano Banana 2 | Not available | $0.045 0.5K · $0.067 1K · $0.101 2K · $0.151 4K | $0.022 · $0.034 · $0.050 · $0.076 |
| `gemini-3.1-flash-lite-image` | Nano Banana 2 Lite | Not available | ≈$0.0336 / 1K | ≈$0.0168 / 1K |
| `gemini-3-pro-image` | Nano Banana Pro | Not available | $0.134 1K/2K · $0.24 4K | $0.067 · $0.12 |

- Same page: «Google AI Studio usage is free of charge in all available regions» — the WEB UI is free, the API for image
  models is not.
- Rate-limit page: image models are limited in images per minute (IPM); free-tier numbers are shown only inside AI Studio
  (`aistudio.google.com/rate-limit`) — not observed.

## Cost of the 62 portraits by API (arithmetic, one image per hero)

- Nano Banana 2, 1K, standard: 62 × $0.067 = $4.15; batch: 62 × $0.034 = $2.11.
- Nano Banana Pro, 2K, standard: 62 × $0.134 = $8.31; batch: $4.15.
- Re-rolls multiply this (3 tries per hero ≈ ×3).

## Routes

1. **API with a paid key** (billing on the AI Studio project) — script reads the folder, sends portrait + prompt, saves WebP.
   Repeatable, cheapest in time; costs dollars, not tens of dollars.
2. **AI Studio web UI in the debug Chrome** (KUMM's own CDP pattern, as with Nexus) — owner logs in, agent drives the page:
   upload, prompt, download, one hero at a time. Free; slower; daily limits of the UI not observed; Google's terms on
   automating the web UI — NOT checked yet, check before the run.
3. By hand — the owner, 62 times.

## Owner's choice (2026-10-11, chat)

`[OWNER]` «давай это сделааем =) Я залогинюсь, ты изучишь его возможности, поотправляешь тестовые промпты и картинки - как
промпт написать лучше для этой системы - погугли. Нужно те примитивные ЧБ аватары превратить в красивые цветные в игровом
стиле, типа как в первом Невервинтер Найтс было» — route 2, AI Studio web UI in a debug Chrome.

## Terms check (before the run)

- `aistudio.google.com/robots.txt` (fetched): `Disallow: /prompts/`, `/app`, `/library`, `/rate-limit` … — rules for CRAWLERS.
- Google ToS (third-party summary, conductatlas.com): forbids automated access «in violation of robots.txt or similar
  machine-readable instructions». No AI-Studio clause about driving the UI found. Our use = the owner's own logged-in session,
  one request at a human pace, no crawling — grey zone; risk of an account flag named to the owner, accepted by his «давай».

## Official prompting guidance (ai.google.dev/gemini-api/docs/image-generation, fetched 2026-10-11)

- Style transfer template: «Transform the provided photograph of [subject] into the artistic style of [artist/art style].
  Preserve the original composition but render it with [description of stylistic elements].»
- Edit template: «Using the provided image of [subject], please [add/remove/modify] [element] … Ensure the change is …»
- Inpainting: «… change only the [element] … Keep everything else in the image exactly the same, preserving the original
  style, lighting, and composition.»
- Best practices: be hyper-specific (describe, don't tag); give context and intent (purpose of the image); iterate in
  multi-turn; semantic negative prompts (describe the wanted state positively, not «no X»); camera language for framing.
- Full sentences, not keyword lists. Russian is a supported prompt language, English is the safe default.
- Reference images: Pro takes up to 3 STYLE references; Flash models up to 5 character images — consistency of 62 portraits
  can come from feeding one approved colored portrait as the style reference.
- Output sizes 1K/2K/4K (uppercase K); 512 only on Nano Banana 2.

## NWN1 portrait style — what is known (web, weak sources)

- BioWare art lead Marc Holmes: stylized, borrowing from manga, historical references and 3rd-edition D&D art (Todd
  Lockwood) — gamebanshee interviews. No primary source on the portrait technique itself. Working description for prompts:
  painted digital fantasy portrait, head and shoulders, dark moody background, warm rim light, painterly brushwork.
  `[AI]` this description is the agent's reading, to be judged by the owner's eye on test images.

## Prompt draft v1 (`[AI]`, built on the official style-transfer template; to be tested on 3–5 heroes)

`{name}` and `{role}` come from the file name `<Name>, the <role>.webp`.

```
Transform the provided black-and-white pencil portrait of {name}, the {role}, a villager of a dark Slavic fantasy world,
into a full-color painted character portrait in the style of the classic BioWare RPG portraits of Neverwinter Nights (2002)
and Baldur's Gate II: a hand-painted digital oil painting with visible painterly brushwork, a rich but earthy palette,
warm firelight falling from one side, a soft cool rim light on the other, and a dark atmospheric background that fades
into deep shadow. Keep the face, its features, age, expression, hairstyle and head pose exactly as in the original, and
keep the head-and-shoulders framing. Dress the character in clothing that suits a {role} of a medieval Slavic village.
This is a square portrait for the hero selection screen of a role-playing game.
```

## What the site actually allows (observed 2026-10-11 ≈16:35, owner's account, free)

- AI Studio Playground: every image model is gated — Nano Banana 2.1 / 2 / Pro / old Nano Banana marked «Paid»; Nano Banana 2 Lite
  is not marked but shows «Upgrade to unlock Nano Banana 2 Lite», Run disabled. Text model Gemini 3 Flash Preview is gated too
  («only available in the Playground via a Google AI Plan or an API key»). The owner used to color in the Playground — closed since.
- The Gemini app (gemini.google.com, «Gemini Авто») colors images for free: portrait in, 1024×1024 out in ≈40–60 s.
- Driver: `SvarogsDream/tools/aistudio_cdp.mjs` (port 9223, own profile `%LOCALAPPDATA%\aistudio-cdp\profile`): `paste` puts the
  image in as a clipboard paste (no OS file dialog on the owner's screen); the preview appears with a delay of seconds — a second
  paste answers «файл уже загружен»; check the preview by a shot before sending. The result is taken through canvas (the blob URL
  refuses `fetch`).

## Prompt trials on Adam (sheets `SvarogsDream/art/heroes_avatars_color_tests/Adam - sheet 0N.webp`)

| # | Prompt (short) | Result | Owner |
|---|---|---|---|
| v1 | long NWN/BioWare brief (above) | painted, face kept; invented axe, hammer badge, workshop | «слишком перегруженный» |
| v3 | «Restore and colorize this black-and-white photo.» | photo-real modern man, grey background | «второй вариант лучше всего, но чуть-чуть нужно игрового славянского вайба» |
| v4 | v3 + «as a medieval Slavic villager, painted in the style of a classic fantasy RPG character portrait» | izba, scarf, banner «SLAVIC VILLAGER» | «опять по фото перегиб» |
| v5 | v3 + «as a painted RPG portrait of a medieval Slavic peasant. Keep the face and the plain background.» | painted, wool, embroidered collar, plain bg | «вот сейчас неплохо получилось» · «только как-то он постарел» |
| v6 | v5 + «the age» | still older, grey hair, wrinkles | — |
| v7 | v5 + «exactly as young … same smooth skin and hair color» | younger than original, blond, doll skin, likeness drops | «слишком молодой получился и мультяшный, и изменилась расстановка» — wants between v6 and v7, framing kept |
| v8 | «…painted RPG portrait of a medieval Slavic peasant, with natural muted colors. Keep the same face, age and hair, the same framing and composition as the original, and the plain background.» | muted, painted, middle age; eyes at 0.48 of height vs 0.47 in the original — framing kept; hair lighter than the original | «нет. старик получился. На оригинале это человек в расцвете сил. И читай их биографию, там же возраста написаны!» |
| v9 | v8 with «a 32-year-old … in the prime of life» (age from game data) | framing and muted colors kept; still reads ~40 to the agent's eye (stubble, eye folds) | «хорошо получилось, но глаза... редкие оранжевые глаза у славян» |
| v11 | v9 + «builder … stern and weary, with light brown hair, grey-blue eyes» | eyes right; «weary» added wrinkles | «опять слишком старый получился. В оригинале у него нет мешков под глазами и морщин» |
| v12 | v11 without «weary», «blond hair, grey-green eyes» (owner: «этот чувак блондин … с серыми или зелёными глазами») | eyes and hair right, still aged | — |
| v13 | v12 + «His skin is smooth and firm, with no wrinkles and no bags under the eyes, exactly as in the original.» | ~30, no wrinkles, framing kept, painted not cartoon; light stubble of the original lost | — |

Owner's rule for the per-hero prompt (2026-10-11): `[OWNER]` «если в их биографии глаза не написаны, но смотри на оригинал фото, и
предполагай национальность, темперамент, и подходящий цвет волос» · «цвет подходящий глаз». So each prompt carries: age (game data),
role, hair and eye colour read from the original, and the smooth-skin sentence (the painted style ages faces by default).

Tool note: the background Gemini tab renders neither the paste preview nor the answer without focus — `aistudio_cdp.mjs` now
emulates focus on every command; `grab <out> <secs>` waits for the finished image (v12 came in 3 s once focused).

## Hero data (age, gender, hair) — `SvarogsDream/art/heroes.tsv`

`tools/heroes_extract.py` reads StoryCharacter from the game data: 63 heroes, fields `characterAge`, `isMaleGender`, `hairColor`
(id 0–4, mapping to a colour NOT known yet), `hairType`, `characterStory`, stats. Ages range 14 (Vidomir) … 72 (Arsenije); Adam 32.
Ages go into the prompt per hero.

## Open

- The prompt text the owner wrote — not found in the repos yet (grep «раскрас|gemini|nano» over KUMM and SvarogsDream: only
  the plan-18 line).

## Классы правил v2 — из отсмотра v1 владельцем (2026-10-11 вечер)

Владелец просмотрел листы «было | стало» и назвал 22 героя на перерисовку (v1 не удаляем — `[OWNER]` «старые v1 варианты не
удаляем»), затем: `[OWNER]` «из моих рекомендаций составь КЛАССЫ руководств, которые могут на все твои промпты распространиться» ·
«давай пока для теста троих перерисуем». Классы — `[AI]` разбор агента по его замечаниям; судит глаз владельца.

| Класс | Чем болел v1 | Герои (слово владельца) | Как ушло в промпт |
|---|---|---|---|
| К1 Сходство черт | модель сглаживает лицо к «среднему красивому»: теряет выразительность глаз, губ, скул, впалых щёк | Анна «чуть ближе, чтобы на себя была похожа по чертам лица»; Иво «чуть не похож на себя»; Лана «черты более выразительные, губы, глаза»; Марина-невольница «губки бабочкой, скулы»; Милутин «чуть не попали во внешность»; Петар «внешность не передали»; Лав, Миленко | общая фраза «keep every facial feature» (была); на героя — `notes`: назвать его отличительные черты словами |
| К2 Национальность | по умолчанию в таблице «Slavic», модель рисует нейтрального европейца | Эма «определить её национальность»; Ян «словно перс, я не уверен. Посмотришь»; Коста «словно из центральной Европы… получился датчанин или американец»; Лав; Мацей «афганскую внешность» | столбец `origin` — конкретный народ, а не «Slavic» по умолчанию; плюс черты лица словами в `notes` |
| К3 Взгляд и чувство | модель ставит взгляд в камеру и спокойное лицо | Андрей «взгляд вверх вправо мимо кадра»; Борис «более безумный взгляд и приоткрытый рот»; Ева «более грустная»; Милица «тревожный взгляд вне камеры»; Милутин «взгляд вне камеры»; Петко «жалкий и подавленный» | общая фраза: выражение, настроение и направление взгляда — как в оригинале; на героя — `notes` |
| К4 Не приукрашивать | живописный стиль делает героя «моделью»: чистым, причёсанным, красивым | Ясен «красивый модник… в оригинале потрёпанный, помятый, суровый»; Петко «у нас красавец» | общая фраза «do not make the face more handsome than it is»; `skin=lines` — морщины оригинала при любом возрасте |
| К5 Ничего не добавлять | модель дорисовывает руки, ремни, мешки, украшения, кожные бугорки | Блаж «убрать руку с воротника»; Ядран «убрать висюльку справа с волос»; Мацей «странный мешок сзади»; Ясен «без ремня на плечах»; Милутин «неприятные бугорки на лице» | общая фраза «add nothing that is not in the original: no hands, straps, bags, hair ornaments or props» |
| К6 Ничего не терять | особые приметы оригинала пропадают | Андрей «не хватает религиозно-фанатичной надписи на лбу»; Милица «один глаз закрыт локоном»; Милица «более впалые щёки» | `notes`: назвать примету и «как в оригинале» |
| К7 Кадр | голова уезжает, меняется масштаб | Марина-писарь «композиция не совпала»; Миленко «ушла композиция» | общая фраза о кадре (была); проверка кода — кандидат: совпадение ч/б v2 с оригиналом |
| К8 Цвет волос и глаз | агент читает цвет по ч/б и ошибается | Иво «убийце нужны серые глаза»; Иосиф «глаза темнее, коричневые»; Милица «не блонд, а светлый каштан»; Ясен «седой кучерявой» | правка столбцов `hair` / `eyes` словом владельца |

Пробная тройка (`[AI]` выбор — по герою на разные классы): Андрей (К3 + К6), Ясен (К4 + К5 + К8), Коста (К2).
Машинерия: `SvarogsDream/tools/hero_prompt.py` (общие фразы К3–К5, столбцы `skin` и `notes`), прогон
`VER=v2 ONLY="4 21 24" GEMINI_TAB=/u/1/ bash tools/color_heroes.sh` → `art/heroes_avatars_color/<имя> v2.webp`. Риск из EXP-0216:
каждое добавленное слово меняет лицо — общие фразы проверяются на тройке, прежде чем идти на остальных.

### Пробная тройка — итоги (2026-10-11 вечер)

| Герой | Версия | Что сделали | Слово владельца |
|---|---|---|---|
| Андрей | v2 | общие К3–К5 + `notes`: надпись на лбу, взгляд фанатика вверх-вправо | `[OWNER]` «Андрей хорошо!» — принят (взгляд всё же в камеру) |
| Ясен | v2 | `hair` «wild messy curly white», `skin=lines` | `[OWNER]` «Ясен v2 не похож. Оригинал уже, волосы вверху, ты не видишь?» |
| Ясен | v3 | форма причёски отдельной фразой («stands up high on top… short at the sides»), лицо «long, narrow and gaunt… exactly as narrow as in the original» | `[OWNER]` «Ясен - вот теперь это то!!!!!!!» — принят |
| Коста | v2 | `origin` «Central European» | `[OWNER]` «ну опять не та национальность косты!» |
| Коста | v3-czech / v3-polish | черты лица словами + нрав из биографии игры («burly, hard-drinking market brawler»); народ — на выбор владельцу | ждёт |

Уроки: слово о народе лицо не двигает — двигают названные черты (Коста v2 ≈ v1); слово о волосах модель додумывает формой
(«curly» → кудрявая шапка вширь) — писать форму причёски и ширину лица.
Автоматизация: `color_heroes.sh` после каждой готовой картинки собирает лист `_harness/color/cmp_<n>_<ver>.webp`
(`tools/portrait_compare.py`) — `[OWNER]` «напиши автоматизацию!!! это же браузер!!!!!».
| Коста | v3 оба | — | `[OWNER]` «Коста не похож. В оригинале он молодцеват, чистая кожа» |
| Коста | v4-czech / v4-polish | `skin=smooth` (гладкая кожа при 50 годах), «hale, vigorous and dashing, younger than his years»; «драчун-выпивоха» снят | ждёт |

Урок К4б «не старить по числу»: возраст из данных игры — для пропорций, а вид кожи — с картинки. Правило «старше 45 —
морщины оригинала» модель читала как разрешение морщинить (Коста v2, v3 ×2); нрав из биографии («hard-drinking brawler») старит
тоже. Столбец `skin`: `lines` — потрёпан при любом возрасте, `smooth` — свеж при любом возрасте, пусто — по возрасту.
| Коста | v4 / v5 / v6 / v7 | v4 «лучше, но не то»; v5-polish, v5-finnish «не похож»; v6 строгий «старит сильно.... борода неплохо получилась»; v7 строгий + на вид 35 и гладкая кожа | `[OWNER]` «херня» о v7, затем по листу всех версий: «давай возьмем v7 и идём дальше» — принят v7 |

Урок К2 (Коста, 7 заходов): название народа лицо не меняет, меняют цвет бороды, возраст и кожа; строгий промпт «повтори народ, черты,
взгляд оригинала» (`HERO_STRICT=1`) держит лицо, но старит без явной фразы о возрасте на вид. Выбор из многих версий — лист всех версий
героя (`tools/portrait_variants.py`), не по одной. Принятые версии — `SvarogsDream/art/heroes_avatars_color/_chosen.tsv`.
Остальные 19 — очередь `tools/redraw_queue.sh` (v2 = классы + поправки), листы открываются владельцу сами.

### Вечер 2026-10-11 — итог прогона

Раскрашены все 62 (40–62 впервые), 18 героев перерисованы по поправкам, в игре все 62. Принято владельцем: Андрей v2, Ясен v3,
Коста v7-strict-young, Милица v2, Борис v2-strict («СУППЕР»), Тина v1 («СУППЕР»). Наблюдения по способам:
- строгий промпт (`HERO_STRICT=1`) держит лицо лучше всего (Борис, Коста), но старит — к нему `look_age`;
- поправка словами (`notes`) работает на форме и приметах (Ясен, Эма, Ядран, Ружа), слабо — на выразительности (Лана v2);
- правка готовой версии диалогом (`tools/edit_hero.sh`) меняет одно, не трогая остального (Стойко v3-edit, Милица v2-scar);
  для приметы оригинала — `REF=original`, оригинал вторым вложением;
- отказ Gemini «interests of third-party content providers» (Борис v2) обошёл строгий промпт;
- лимит бесплатного аккаунта ≈ 30 картинок в день; генерация 11–37 с.
Очередь на 12.10 — `SvarogsDream/tools/queue_tomorrow.sh`.

### 2026-10-12 — отсмотр 18 непринятых (слово владельца дословно, ≈12:20)

Перед отсмотром прошли: 10 правок `queue_next_day.sh`, Видомир `v6-vivid`, 11 героев `HERO_PURE=1 HERO_VIVID=1` (`q_pure_2026-10-12.txt`),
все «ok» на вкладке `/u/1/` — лимит за ночь сбросился.

| Герой | `[OWNER]` | Что сделано |
|---|---|---|
| Ана | «в5 - принято» | `_chosen.tsv` v5-pure |
| Эма | «вивид - перебор. И красоты художественной не добавлено.» | правка v4-pure → v6-art (`ask_ema3.txt`) |
| Иво | «оставь справа слева 5 6 для сравнения от оригинала» | лист «v5-pure · оригинал · v6-clean» в папке отсмотра; `[AI]` прочтение — файлы не удалялись |
| Лав | «в4 берем» | v4-green |
| Марина-писарь | «в4 выглядит как наркоман - нужно более человеческий вид просить» | правка v4-clean → v5-human (`ask_marina2.txt`) |
| Марина-невольница | «в3 хорошо, но чуть больше в реализм нужно» | правка v3-pure → v4-real (`ask_real.txt`) |
| Миленко | «в3 ОК» | v3-pure |
| Милутин | «в3 плохо, в2 пока ближе. Ещё пробуем.» | `[AI]` две попытки: v2 → v4-closer с оригиналом (`REF=original`, `ask_closer.txt`) и `HERO_PURE=1` без сочности v4-pure |
| Петар | «в3 хорошо, чуть боле реализма и черные волосы на лице» | правка v3-pure → v4-real (`ask_petar.txt`) |
| Петко | «в2 берем» | v2 |
| Ружа | «в2 хорошо. чуть реализма добавить» | правка v2 → v3-real |
| Стойко | «в5 хорошо - убрать черные точки с лица, света реалистичнее» | правка v5-pure → v6-clean (`ask_stojko3.txt`) |
| Тиса | «в2 пока лучше всего. еще пробуем, остальные варианты удаляй» | удалены v1, v2-strict, v3-pure; правка v2 → v4-real |
| Велин | «в2 стрикт ОК» | v2-strict |
| Веселинка | «в1 пока лучше всего, пробуем еще, остальное удаляй» | удалены v2-eyes, v3-gaze, v4-pure, v5-clean; правка v1 → v6-real |
| Видак | «в2 ОК» | v2 |
| Видомир | «все удаляй, ни одного норм пока нет» | удалены все 8 версий и его файл в игре (до новой — портрет автора); заново `HERO_PURE=1` v7-pure и `HERO_STRICT=1` v7-strict |
| Желько (Карпентер) | «в2 ОК» | `[AI]` v2-strict — единственная v2 у него |

Класс правок: «чуть больше реализма» — у четырёх героев из восьми недопринятых; сочность `HERO_VIVID` у Эмы — «перебор» без
художественности. Очередь — `SvarogsDream/tools/queue_2026-10-12b.sh`.
