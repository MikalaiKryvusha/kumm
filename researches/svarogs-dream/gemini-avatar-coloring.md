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

Следом: `[OWNER]` «по всем, у кого я говорил, что пока нет норм вырианта - старые можешь удалять» · 2026-10-12 ≈12:47. `[AI]` прочтение — Эма,
Марина-писарь, Милутин, Иво (у Тисы, Веселинки, Видомира уже удалено); исходники идущих правок оставлены. Удалены: Эма v2, v3-edit, v5-vivid ·
Марина-писарь v2, v3-pure · Милутин v3-pure · Иво v2, v3-edit, v4-stare. Остались: Эма v4-pure, v6-art · Марина-писарь v4-clean, v5-human ·
Милутин v2 (+ новые v4) · Иво v5-pure, v6-clean.

Эма: `[OWNER]` «Эма в6 арт хорошо! Чуть-чуть накинь сам фильтром насыщенности и консраста» · 2026-10-12 ≈12:48 — фильтром PIL (без
Gemini) три силы: v7-tone-a (насыщенность ×1.08, контраст ×1.05), v7-tone-b (×1.15, ×1.08), v7-tone-c (×1.22, ×1.12); лист «Ema, the widow -
тон.webp» в папке отсмотра, выбор — владельца. Затем `[OWNER]` «Эму оригинал, чистый в6 + самый контрастный, и еще насыщенности
открой» — v7-tone-d (насыщенность ×1.35, контраст ×1.12), лист «Ema, the widow - тон 2.webp»: оригинал · v6-art · c · d.
`[OWNER]` «эма Д принята» · 2026-10-12 ≈12:50 — `_chosen.tsv` v7-tone-d, в игре. Класс: правка Gemini «живописнее» + свой фильтр
насыщенности и контраста дали то, чего не дал `HERO_VIVID` («перебор»).
`[OWNER]` «стойко в6 принят!» · 2026-10-12 ≈12:50 — v6-clean (v5-pure без чёрных точек, свет реалистичнее), `_chosen.tsv`, в игре.

После правок «реализма» (2026-10-12 ≈12:51–12:52), все три — правка готовой версии с оригиналом вторым вложением (`REF=original`):
- Ружа: `[OWNER]` «Ружа в3 рил хорошо, но не хватает впалых щек и смотрит в камеру» → v3-real → v4-hollow (`ask_ruza2.txt`): впалые щёки,
  взгляд мимо зрителя к ПРАВОЙ стороне картинки, как на оригинале.
- Тиса: `[OWNER]` «Тиса смотрит в камеру! И худощавее нужно!» · «и моложе тису» → v4-real → v5-thin (`ask_tisa2.txt`): около 26 лет,
  худое узкое лицо, взгляд исподлобья к ЛЕВОЙ стороне картинки; `look_age` 26 в `art/heroes_color_prompts.tsv` (данные игры — 36).
- Веселинка: `[OWNER]` «Веселинке чище кожу и смотреть не в камеру» → v6-real → v7-clean (`ask_veselinka4.txt`).

- Милутин: `[OWNER]` «Милутин в4 почти получился! - взгляд карий вне камеры, убрать бородавку - остальное сохранить!!!!» · 2026-10-12
  ≈12:52 — `[AI]` это v4-pure (`HERO_PURE=1`, `look_age` 55; бородавка у бороды справа на картинке есть только у неё) → v7-brown
  (`ask_milutin2.txt`), без оригинала вторым вложением, чтобы не тянуть остальное.
  `[OWNER]` «Милутин в5 не тов, не карие глаза, опять в камеру смотрит» · ≈12:54 — v5-strict отвергнута; глаза в таблице промптов
  были `grey` → `brown`; строка «He looks away from the viewer» в notes строгий промпт не берёт (только `HERO_STRICT_NOTES=1`).
  `[OWNER]` «Милутин в6 вообще не то! удалить!» — удалены v6-younger и отвергнутая v5-strict; остались v1, v2, v4-closer, v4-pure
  (исходник v7-brown).
  `[OWNER]` «Милутин в7 почти получился, взгляд не так сильно в сторону, а прямее» · ≈12:57 — v7-brown → v8-straight (`ask_milutin3.txt`).
  `[OWNER]` «Милутив в оригинале с более тяжелыми веками» · «и более прямо смотрит, не так сильно в сторону» · ≈13:00 — v8-straight →
  v9-lids (`ask_milutin4.txt`, `REF=original`): тяжёлые веки и взгляд прямее.
  `[OWNER]` «милутин в9 почти хорошо - больше качества и чуть-чуть поднять глаза и в сторону, как на оригинале» · ≈13:05 — v9-lids →
  v10-sharp (`ask_milutin5.txt`, `REF=original`).
  `[OWNER]` «милутин почти получился, чуть арт стиля добавить. в10 шарп почти приняли» · ≈13:08 — v10-sharp → v11-art (`ask_milutin6.txt`,
  по образцу Эмы `ask_ema3.txt`: «только чуть-чуть», без перенасыщения).
  `[OWNER]` «Милутин всё еще шакальный. не хватает качетсва» · ≈13:11 — причина: цепочка из пяти правок (v4-pure → v7 → v8 → v9 → v10 →
  v11), каждая перерисовывает копию 768 px — мыло копится. Всё одобренное (карие глаза, тяжёлые веки, взгляд чуть вверх и в сторону, без
  бородавки, `look_age` 55, чёткая живопись) — в `notes`; одним заходом с оригинала v12-strict и v12-pure (`q_milutin_2026-10-12.txt`).
  Класс: больше 2–3 правок подряд — качество падает; одобренные приметы переносить в `notes` и рисовать заново.
  `[OWNER]` «милутин в12 получился, берём» · ≈13:13 — v12-strict (готова была только она), `_chosen.tsv`, в игре; лист тонов
  «Milutin, the priest - тон.webp» (v12-tone-a/b/c) — на выбор, если нужна сочность. Затем `[OWNER]` «в12 пур принят милутина» ·
  ≈13:20 — v12-pure вместо v12-strict.

### 2026-10-12 ≈13:25–13:35 — новый аккаунт `/u/3/`; Видомир «1 в 1, но в реализм» принят

Владелец дал новый аккаунт Gemini (`/u/3/`, боковая панель свёрнута — новый чат переходом по адресу; при первой вставке картинки — окно
согласия «Creating content from images and files» → Agree). `[OWNER]` «в 14 екзакт хорошо, теперь повысить качество» → v15-hq («улучши
качество» по v14-exact) — Gemini перерисовал лицо заново. `[OWNER]` «пробуй видомира, пробуй другие промпты. Как сделать 1 в 1 но в
реализм» → три формулировки (`tools/queue_vidomir_real.sh`): A — ч/б оригинал «реставрация и раскраска старого фото», B — v14-exact «ретушь
в фото, ничего не двигать», C — ч/б оригинал «реалистичный портрет маслом поверх рисунка, по линиям, как калька». `[OWNER]` «Вот в16 рил ц
хорошо» — v16-real-c, `_chosen.tsv`, в игре. Класс: ч/б оригинал как ПЕРВАЯ картинка правки + «по линиям, как калька» держит лицо
и асимметрию лучше перерисовки с промптом-описанием.

Ружа: `[OWNER]` «ружи оставь в2, в3-пур, в8-ц тон» · «их нужно объединить» → v11-mix (три картинки в одном чате Gemini `/u/3/`, «blend
the three evenly», цвета третьей) — `[OWNER]` «смесь суппер! но смотреть чуть-чуть в сторону, как в в8» · «и губки сжать чуть-чуть» →
v12-mix-gaze (смесь + v8 образцом взгляда) → v13-mix-lips. `[OWNER]` «попроси чат гпт в8 тон ц сохранить кадр 1 в 1 но нарисовать тоном
и стилем, как в в11 микс» · «и точно такое же у гемини попроси» → v14-style-gpt (ChatGPT, вкладка `chatgpt.com`, бесплатный тариф;
выгрузка — `tools/gpt_image_grab.js` через `eval` пульта) и v14-style-gemini. `[OWNER]` «ружа гпт принята!» — v14-style-gpt. Класс: ChatGPT
держит кадр первой картинки точнее Gemini при переносе стиля со второй.

**Итог 2026-10-12 ≈14:00 — все 18 приняты.** Иво: `[OWNER]` «нарисуйте его в арте» · «в5 пур мне нравится, но не хватает арт стиля» ·
«нет, ты перемудрил с "мазками"» · «на втором кажре нет мазков в Ружи, а ты их заказал» (агент дописал «видимые мазки» от себя — образец их
не имел; урок: стиль образца не описывать своими словами, «как на второй картинке») → v12-art-light (Gemini, `ask_ivo_art_light.txt`:
лёгкая цифровая живопись без мазков и холста) — `[OWNER]` «в12 арт лайт принят». Вторая ловушка: ChatGPT упёрся в лимит, а выгрузка
взяла последнюю крупную картинку страницы — вложенную Ружу (удалена); ждать картинок больше, чем вложений. Лист «до | после» —
`tools/portraits_before_after.py`.

Хвост 2026-10-12 ≈13:35–13:52: Петар v4-real, Марина-писарь v6-gpt-shadows (ChatGPT: v5-human + ч/б оригинал вторым — «верни тени как в
оригинале, без болезненного вида») приняты. Иво: ChatGPT «реалистичнее, кадр 1 в 1» по v5 → v7-gpt-real; `[OWNER]` «словно разрешение
низкое?» · «словно пиксель арт» — замер резкости: v7 самая резкая (412 против 311 у v6), «пиксели» — фотозерно ChatGPT. `[OWNER]`
«ультрашарп беленсреалистичнее не нужно, это все же арт» → апскейл локально: Real-ESRGAN ncnn-vulkan
(`D:\work\ai_sandbox\_tools\realesrgan-ncnn\realesrgan-ncnn-vulkan.exe`, релиз v0.2.5.0) + модели Upscayl `ultrasharp-4x` и
`ultramix-balanced-4x` (`_tools/realesrgan-ncnn/models`); ×4 до 4096 → Lanczos к 1024: v9-ultrasharp, v9-ultramix — зерно ушло, черты
1 в 1. Команда: `realesrgan-ncnn-vulkan.exe -i in.jpg -o out.webp -n ultrasharp-4x -m <models> -f webp`.

### 2026-10-12 ≈13:15–13:20 — лимит Gemini на всех трёх аккаунтах; раскраска 1 в 1 своим скриптом

После ≈90 картинок за день — «limit» на `/u/1/`, `/u/2/` и `/app`. `[OWNER]` «видомир не получается. нужно оригинал 1 в 1
перерисовывать!» · «не ту щёку оно рисует ему напухщей!» — Gemini пять раз путал щёку и симметризовал лицо. Свой путь без нейросети —
`SvarogsDream/tools/colorize_exact.py`: яркость каждого пикселя с оригинала, цвет — градиент кожи в овале лица (+ шея, уши, кроме бумаги
фона), нейтральные волосы и фон, мягкие пятна примет (глаза, круги, синяк, губы) по координатам оригинала (`_harness/vid_spec.json`).
Видомир v14-exact — форма, взгляд и опухоль ровно как на оригинале. Отложено до сброса лимита: Тиса v11-strict строже (`ask_tisa7.txt`),
Ружа — объединить v2, v3-pure, v8-tone-c (ждёт ответа владельца, что от какой брать; остальные версии Ружи удалены по слову «ружи
оставь в2, в3-пур, в8-ц тон»).
- Ружа: `[OWNER]` «Ружа в4 почти получилась - более сжатые губки сделать и взгляд не в сторону в прямой стальной вперёд вне камеры!» ·
  ≈12:55 — v4-hollow → v5-steel (`ask_ruza3.txt`), без оригинала.
  `[OWNER]` «Ружа в5 почти хорошо. У нее более пухленькие губки в оригинале и взгляд чуть сильнее в сторону» · ≈12:59 — v5-steel →
  v6-lips (`ask_ruza4.txt`, `REF=original`).
  `[OWNER]` «Ружа - взгляд перенаправить прямее, суровее» · ≈13:03 (это и было «перепутанное» замечание, сказанное под именем Тисы) —
  v6-lips → v7-stern (`ask_ruza5.txt`).
  `[OWNER]` «В оригинале Ружа уверенная в себе, строга, собрана. У нас получилась уставшая и смотрит слишком прямо. В оригинале она за кадр
  смотрит» · ≈13:07 — правка v6-lips → v8-composed (`ask_ruza6.txt`, `REF=original`) и заново с оригинала `HERO_STRICT=1 HERO_STRICT_NOTES=1`
  v8-strict; в `notes` — настрой и взгляд за кадр к ПРАВОЙ стороне картинки. Класс: «суровее» модель рисует усталостью — настрой
  называть прямо («уверенная, собранная, не уставшая»).
  `[OWNER]` «ружа почти получилась, не туда смотрит. В оригинале чеко видно ее взгляд» · «вот!» · ≈13:10 — разбор глаз оригинала крупно
  (`_harness/ruza_eyes.webp`): радужки у верхнего века, под ними полоска белка, по горизонтали почти центр → взгляд чуть ВВЕРХ поверх
  камеры, едва вправо. Прежние просьбы «к правой стороне» уводили глаза вбок. Правки v8-composed → v9-gaze и v8-strict → v9-strict-gaze
  (`ask_ruza7.txt`, `REF=original`). Класс: направление взгляда брать с оригинала по положению радужки (вверх/вниз тоже), а не словом «в сторону».
  `[OWNER]` «м8 стрикт Ружи хорошо! добавить арт стиля и сочности» · ≈13:10 — v8-strict → v10-art (`ask_ruza8.txt`, живопись «чуть-чуть»)
  и свой фильтр по v8-strict: v8-tone-a/b/c (насыщенность ×1.15/1.28/1.40, контраст ×1.06/1.10/1.12), лист «Ruza, the merceneary - тон.webp».
  `[OWNER]` «ружа в8 тон ц» · ≈13:12 — v8-tone-c, `_chosen.tsv`, в игре. Второй раз подряд (после Эмы) принят свой фильтр самой сильной
  силы: насыщенность ×1.35–1.40 при контрасте ×1.12 — исходная раскраска Gemini для владельца бледновата. Класс взгляда: «не в камеру» ≠ «в сторону» — прямой взгляд вдаль сквозь зрителя.
- Тиса: `[OWNER]` «у тисы взгялд прямой стальной суровый вне камеры сделать, уже лицо, впалые щеки!» · ≈12:56 — v5-thin → v6-steel
  (`ask_tisa3.txt`), без оригинала.
  `[OWNER]` «Тиса не получилась взглядои и молодостью» · ≈12:59 — v6-steel на вид ≈35, взгляд почти в камеру. Класс: цепочка правок держит
  возраст первой версии — возраст правкой не сбросить. Заново с оригинала: `HERO_STRICT=1 HERO_STRICT_NOTES=1` v7-strict и
  `HERO_PURE=1 HERO_STRICT_NOTES=1` v7-pure, обе с `look_age` 26 (`q_tisa_2026-10-12.txt`).
  `[OWNER]` «тиса - взгляд перенаправить прямо, но не в камеру!» · «суровый» · ≈13:02 — v7-strict → v8-stern (`ask_tisa4.txt`); в `notes`
  «смотрит чуть в сторону» заменено на «прямо, сурово, чуть мимо зрителя». Затем `[OWNER]` «ТИСА ПОЛУЧИЛАСЬ!» · «Я перепутал!» ·
  «тиса в7 почти хорошо, чуть моложе сделать!» — правка взгляда отменена (просьба `ask_tisa4.txt` переписана на «чуть моложе», `notes`
  возвращены); `[AI]` «в7» не различает две v7 — моложе обе: v7-strict → файл с именем v8-stern (имя строки очереди; переименовать в
  v8-young-strict после прогона) и v7-pure → v8-young-pure. Затем `[OWNER]` «тиса в7 плохо, откати» · ≈13:03 — обе v7 удалены; две правки
  «моложе» в очереди падают сами («нет исходника»). У Тисы остались v2 (`[OWNER]` «пока лучше всего»), v4-real, v5-thin, v6-steel.
  Ошибка агента (EXP-0223): `[OWNER]` «Тиса в7 стрикт хороша была» · «Тиса вс стрикт почти хорошо - убрать складки на бровях, и чутьч-чуть
  моложе» · ≈13:05 — v7-strict восстановлена с листа `_harness/color/cmp_53_v7-strict.webp` (клетка 400 px → 1024, мягче оригинала);
  просьба `ask_tisa4.txt` — без складок между бровями и чуть моложе; результат строки очереди называется v8-stern (имя оставлено — так
  подписан лист, который видел владелец; по смыслу это «моложе, без складок»).
  `[OWNER]` «тиса в8 стерн плохо, сильно идеальная и смотрит в камеру» · ≈13:07 — от v7-strict ещё раз мягко: v9-soft (`ask_tisa5.txt`) —
  складки чуть мягче, моложе на год-два, не идеализировать, взгляд не трогать. Класс: «моложе» и «убрать складки» модель читает как
  «идеальная кожа» и сбрасывает взгляд в камеру — просить в малых долях и запрещать идеализацию прямо.
  `[OWNER]` «тиса у нас уставшая, а в оригинале строга и собрана. Почти в9 софт получилось» · ≈13:09 — v9-soft → v10-composed
  (`ask_tisa6.txt`): настрой «строгая, собранная, не уставшая», взгляд не трогать.
  `[OWNER]` «тиса почти получилась... не угадаил с внешностьью» · ≈13:11 — правки увели черты; всё одобренное — в `notes` (черты оригинала,
  строгая и собранная, без складок, без идеализации, `look_age` 26); одним заходом с оригинала v11-strict и v11-pure (`q_tisa2_2026-10-12.txt`).
  `[OWNER]` «тиса в11 стрикт получилась» · ≈13:15 — v11-strict, `_chosen.tsv`, в игре; лист тонов v11-tone-a/b/c на выбор.
  Итог класса: принятые за день Тиса, Милутин, Веселинка, Ружа — строгий промпт с приметами в `notes` одним заходом с оригинала (Ружа — +
  свой фильтр сочности); цепочки правок дали только «почти». Полный размер v7-strict — в истории чатов Gemini аккаунта `/u/1/`.
- Веселинка: `[OWNER]` «Веселинка почти получилась - но взгляд её правее отправить, и ухмылка чуть-чуть сильнее» · ≈12:57 — v7-clean →
  v8-smirk (`ask_veselinka5.txt`); `[AI]` «её правее» прочитано как к ЕЁ правой стороне = левее на картинке.
  `[OWNER]` «Веселинка не получилась взглдом и вертами» · ≈13:00 — цепочка из трёх правок увела черты. В `notes` таблицы промптов (было
  пусто) — черты как на оригинале, чистая кожа, взгляд мимо камеры к ЛЕВОЙ стороне картинки, полуулыбка; заново с оригинала
  `HERO_STRICT=1 HERO_STRICT_NOTES=1` v9-strict и `HERO_PURE=1 HERO_STRICT_NOTES=1` v9-pure (`q_veselinka_2026-10-12.txt`).
- Марина-невольница: `[OWNER]` «Марина трейл получилась!» · ≈12:55 — v5-bow (скулы и губы бантиком с оригинала), `_chosen.tsv`, в игре.
- Видомир: `[OWNER]` «видомир в7 убрать тени - это у него круги должны быть от усталости, а не тени, и ЕГО ПРАВУЮ щеку сделать с опухолью,
  как в оригинале! словно зуб опух!» · 2026-10-12 ≈12:53 — `[AI]` это v7-pure (тёмная обводка глаз, как макияж; у v7-strict её нет) →
  v8-swollen (`ask_vidomir3.txt`, `REF=original`): круги под глазами вместо теней, опухоль — его правая щека = ЛЕВАЯ сторона картинки.
  `[OWNER]` «Видомиру напухло две щеки!!! А нужно одну блять!!! !» · ≈12:58 — v8-swollen → v9-one-cheek (`ask_vidomir4.txt`, `REF=original`):
  асимметрия прямым текстом, вторая щека названа худой с чёткой скулой. Класс: модель симметризует лицо — асимметричную примету
  описывать обеими сторонами, не одной. `[OWNER]` «и глоза ему светло голубые» — в ту же просьбу и в таблицу промптов (`light blue`).
  `[OWNER]` «У видомира опять не та щека раздута» · «рисуй по оригиналу» · ≈13:01 — v9-one-cheek почти симметричен; правки опухоль не
  дают. `notes` переписаны (круги под глазами вместо «мягких теней», асимметрия обеими сторонами); заново с оригинала
  `HERO_STRICT=1 HERO_STRICT_NOTES=1` v10-strict и `HERO_PURE=1 HERO_STRICT_NOTES=1` v10-pure (`q_vidomir_2026-10-12.txt`).
  `[OWNER]` «видомир в10 почти хорошо - ЕГО ПРАВАЯ ЩЕКА, наша на фото СЛЕВА, возле губ видно как разбита!» · «в10 стрикт!» · «не пур, пур
  гавно» · ≈13:06 — v10-strict → v11-battered (`ask_vidomir5.txt`, `REF=original`): отёк и лёгкая побитость у левого (на картинке) угла губ.
  `[AI]` v10-pure не удалена — «гавно» не «удали» (EXP-0223).
  `[OWNER]` «его бы более в реализам, в остальном охуенно!» · ≈13:12 — `[AI]` «его» прочитано как Видомир v11-battered (последний мужской
  портрет без слова владельца) → v12-real (`ask_vidomir6.txt`): реализм, опухоль и асимметрия названы прямо, взгляд не в камеру. Класс: «рисуй по оригиналу» + строгий промпт с приметами дал лицо; примету
  добивает правка.

Класс: просьба «больше реализма» поворачивает взгляд в камеру и стирает приметы оригинала (Ружа, Тиса, Веселинка, Марина-невольница) —
в каждую такую правку дописывать «не в камеру, как на оригинале» и приметы лица, оригинал — вторым вложением.

Милутин: `[OWNER]` «Милутин пока не получается» · «слишком старый» · 2026-10-12 ≈12:49. Причина — в данных игры 68 лет, на оригинале на вид
≈55 (класс Косты): `look_age` 55 в `art/heroes_color_prompts.tsv`; попытки — `HERO_PURE=1` v4-pure и `HERO_STRICT=1` v5-strict (обе с 55),
правка v2 → v6-younger (`ask_milutin_younger.txt`).

Марина-невольница: `[OWNER]` «Марина пока не получается, в4 рил хорошо, но скулы и губки бабочки пропали» · 2026-10-12 ≈12:50. На оригинале —
высокие острые скулы со впадинами, лицо к подбородку уже, губы маленькие пухлые бантиком; в v4-real лицо круглее, губы шире. Правка v4-real →
v5-bow с оригиналом вторым вложением (`REF=original`, `ask_marina_thrall2.txt`). Класс: «больше реализма» скругляет черты — приметы
лица после такой правки сверять с оригиналом.
