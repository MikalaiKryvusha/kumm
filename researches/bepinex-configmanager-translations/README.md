# Research — 24 translations of BepInEx.ConfigurationManager for a second upstream PR

> **Created:** 2026-10-14 · **Parent:** `researches/bepinex-configmanager-pr125/README.md` (our merged #125 put the `ru` file and the
> contributing rule into the repo); trigger — PR #128 (Arabic, by vfggf95565, 2026-10-13) ·
> **Status:** 📤 SENT — https://github.com/BepInEx/BepInEx.ConfigurationManager/pull/129 (23 languages, branch `translations-20`
> `c222312`, opened 2026-10-14 18:26 +03:00 — GitHub createdAt 15:26:37Z); Hausa dropped; tested in the game 2026-10-14 18:33–19:20, all 23 pass, one
> screenshot each in the PR (issuecomment-6173031223); layout fix `1234297`, shorter tl/sw/lv labels `0421d3c` ·
> **Outbound:** a PR to https://github.com/BepInEx/BepInEx.ConfigurationManager — AUTH: `[OWNER]` «Давай сделаем 15 локализаций на самые
> популярные языки мира, и сделаем ПР.» · «давай 20 языков сделаем» · «Обязательно сделать Украинский и Беларуские языки» · «польский» ·
> «литовский, латвийский, эстонский» · 2026-10-14

## The owner's words

- `[OWNER]` «по следам нашего ПР на бипинекс мод менеджер, там другой человек отправил ПР на Арабскую локализацию =) Наше дело живет.
  Давай сделаем 15 локализаций на самые популярные языки мира, и сделаем ПР.» · 2026-10-14 ≈18:05
- `[OWNER]` «давай 20 языков сделаем» · «это не сложно» · «если нужна консультация по переводам - гугли какой-нибудь бесплатный АПИ
  сервис» · «нужно будет потом строго перепроверить строки твоих переводов, адекватно ли составлены фразы на каждом из языков.
  Обязательно сделать Украинский и Беларуские языки» · «польский» · «литовский, латвийский, эстонский» · 2026-10-14 ≈18:14–18:19

## The repo's contribution rule (upstream README, ManlyMarco, commit 70ed5d6)

> If you wish to translate this plugin to your language go to the `Translations` folder, copy the `ru` folder and rename it to your
> language code, and edit the `ConfigurationManager.txt` file to replace existing translations with your own. When done send a PR
> with the new language folder.

So: the key set is exactly `ru`'s (23 lines incl. one regex). `gen.mjs` reads the keys from the `ru` file in order and refuses a row
with a different count — the key set matches by construction. #128 (Arabic) added BepInEx config names and "URL" beyond `ru`; we do not.

Folder names are XUnity `Language=` codes, Google style (XUnity's default endpoint list,
`src/Translators/GoogleTranslate/GoogleTranslateEndpoint.cs`): `zh-CN`, `zh-TW`, `pt`, not `zh-Hans` / `pt-BR`.

## Which languages — the rule

FORK: options <Ethnologue top N literally | Ethnologue order filtered to what the window can draw | gamer-weighted (Steam survey)> ·
price of error <a file that renders as broken glyphs in every game is worse than no file> · consulted <Ethnologue ranking (secondary
sources below); Unity issue tracker on complex scripts; the owner's explicit picks>.

1. Order: Ethnologue 2025 by total speakers (English, Mandarin, Hindi, Spanish, Standard Arabic, French, Bengali, Portuguese, Russian,
   Indonesian, Urdu, German, Japanese, Nigerian Pidgin, Egyptian Arabic, Marathi, Telugu, Turkish, Hausa, Tamil, then Yue, Vietnamese,
   Tagalog, Korean, Persian, Italian…) — sources: langoly.com/most-spoken-languages, money.it (ranks 13–20), fluentin3months.com.
2. Skipped: `en` (source), `ru` (exists), `ar` (PR #128), Nigerian Pidgin and Egyptian Arabic (no separate written UI standard).
3. **Skipped — scripts Unity IMGUI cannot draw**: Devanagari/Bengali/Telugu/Tamil (Hindi, Bengali, Marathi, Telugu, Tamil) need
   OpenType shaping (GSUB/GPOS) that Unity's legacy text and IMGUI never do — Unity issue tracker «Devanagari indic scripts are
   rendered incorrectly in editor/player», «Indic languages are displayed incorrectly when using TextMeshPro or Legacy text» (Active,
   Dec 2025), IMGUI report «Hindi characters not showing correctly» (Postponed); github.com/abusaadp/Unity3dHindiRenderer (cause: no
   GSUB/GPOS). Right-to-left (Urdu, Persian) — IMGUI has no bidi; #128 works around it with pre-shaped presentation forms in visual order.
   Thai and Yoruba — combining marks stack incorrectly in legacy text (`[AI]` not measured here; excluded on that risk).
4. Kept: Simplified + Traditional Chinese (Yue speakers read Traditional), Spanish, French, Portuguese, Indonesian, German, Japanese,
   Turkish, Hausa, Vietnamese, Filipino, Korean, Italian, Swahili, Malay, Dutch, Romanian; and the owner's picks — Ukrainian,
   Belarusian, Polish, Lithuanian, Latvian, Estonian. 24 in total. Machine check: no combining marks anywhere, every file NFC.

## Method

- `values.json` — the 24 rows (written by the agent, `[AI]`); `node gen.mjs <repo>` writes the files.
- `node backtranslate.mjs <repo> <out>` — every value back to English through `translate.googleapis.com` (client=gtx — the free endpoint
  XUnity itself uses), one request per language, 1.5 s apart → `backtranslation.md`. All 24 returned line-for-line.
- Four independent reviewers (clean subagents, read-only): be/uk/pl/lt/lv/et · zh-CN/zh-TW/ja/ko · es/fr/pt/it/ro/nl/de ·
  id/ms/tl/vi/tr/sw/ha. Findings → the table below; every accepted fix goes into `values.json` and is regenerated.

## Review findings

The owner, mid-review: `[OWNER]` «мог бы и сам проверить, без субагентов» · 2026-10-14 — two reviewers (CJK; es/fr/pt/it/ro/nl/de)
had reported, the other two were stopped and their languages reviewed by the agent itself. Every fix is a `[lang, index, old, new]`
row, applied by `fix.mjs`, which refuses a row whose old value does not match:

- `fixes_cjk.json` (12) — checkbox state as a state, not a command (已启用/已禁用, 已啟用/已停用); drag tip reworded, no 你 in zh-TW;
  one term for "settings" in the no-options line (all languages got this); ja: キー設定 (row length), すべて折りたたみ (pairs with 展開),
  割り当て… (設定 already means "settings").
- `fixes_rest.json` (73) — filter-row labels to one word where unambiguous; Set… uses the tooltip's verb (fr Attribuer, it Assegna,
  nl Toewijzen); fr U+00A0 before colons and Microsoft développer/réduire; nl uitvouwen/samenvouwen; pt neutral BR/PT wording; ro
  «Setări pentru pluginuri / moduri»; uk «назву моду»; et «mängimise ajal»; ms «Runtuhkan» (Kuncupkan is Indonesian).
- `fixes_ambig.json` (9) — the second back-translation exposed one-word labels that read as something else out of context: lt «Įprasti»
  (also "to get used to"), et «Täpsemad» ("more precise"), lv, tl → full forms back; vi «cài đặt» also means "install" → «tùy chọn»;
  tr «Ata…» also "ancestor" → «Tuş ata…»; sw «Kabidhi…» → «Weka kitufe…».
- Hausa removed: the agent cannot vouch for its phrasing, and the owner asked for languages «которые будут адекватно работать».

Final machine check: all 23 files have exactly the `ru` keys in order (26 lines each), NFC, no combining marks; `backtranslation.md`
is of the final files.

## Functional run

Done 2026-10-14 — run report `testcases/reports/2026-10-14_bepinex-configmanager-translations-23.md`, cases
`testcases/TC_bepinex_configmanager_translations_23_2026-10-14.md`. Each language: a clean start with its file as the plugin-specific file of the
game language (`ru`), F8, BepInEx expanded, frame read. Alt+R did not switch the language. Found: a translated Reset button pushed out of the
window (also with `ru`) — fixed in CM (`1234297`); tl/sw/lv filter labels too long — shortened (`fixes_width*.json`). Not covered: key-binding
prompts, IL2CPP.
