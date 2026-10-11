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
