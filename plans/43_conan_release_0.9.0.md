# Plan 43 — the Conan 3.0.1 build released as 0.9.0, as it is

> **Created:** 2026-11-02 · **Parent:** the owner's order in chat 2026-11-02 18:40 (verbatim below); plans 39, 40 (phase 7), 41
> **Status:** started 2026-11-02 18:45 +03:00
> **Outbound:** the PlayGround page (a NEW page, the owner uploads — his account); the public GitHub repository of the build (README, tag) by his order

## The owner's words (verbatim, 2026-11-02 18:40–18:44)

`[OWNER]` «давай соберем сборку и выпустим версию 0.9.0» · «Все моды Krinik опускаем до версии 0.9.0» · «в Манул пишем главу Известные проблемы и плны на 1.0.0 - там
перечислим то, что не доделали» · «Выпускаем сборку в том виде, в котором есть» · «прошлая версия лежит тут
https://www.playground.ru/conan_exiles/file/conan_exiles_sborka_modov_krinik_1_0_0-1878730» · «мне нужно будет новую страницу делать, или редактировать эту и
перезаливать фото файлы и архивы?» · «"по её образцу." - с учетом нашего переписанного мануала, мы многое переделали» · «кадр титульника из мануала в виде картинки
нужно будет снять» · «и поставить героя нашего где-то в красивом месте днем, чтобы на красивую далину под ним смотрел в камере от третьего лица так, чтобы весь герой
помещался - и снять скриншот, это наша фишка - камера ссзади и в руках лук» · «и красивые хуб интерфейсы» · «худ» · «ну и обложку перегенерить с 0.9.0» ·
18:47 «нужно, чтобы в лаунчере под логотипами были написаны версия игры и версия сборки, прям как в глвном меню мы сделали» · «в описании сборки на ПлейГраунд в
самом верху описания нужно будет написать НОВАЯ ВЕРСИЯ !!! Сборка обновлена 02.11.2026».

## Goal vector (Achieve)

The 3.0.1 build ships today as it stands — no new fixes — under version 0.9.0, with an honest chapter of what is not done for 1.0.0, a checked archive and the
material for a new PlayGround page. Fit criteria:

| # | Criterion | Check |
|---|---|---|
| 1 | Every Krinik mod and the build say 0.9.0 | `modpack.json` packVersion 0.9.0; modinfo of the three paks 0.9.0; the logo line under «MOD PACK» reads 0.9.0 on a main-menu frame; the launcher title reads 0.9.0 |
| 2 | The guide has the chapter «Известные проблемы и планы на 1.0.0» and «Что нового» 0.9.0 | the PDF rebuilt, page read by eye |
| 3 | The volumes are made and self-checked | `make_volumes.sh` prints `OK: <N> files, hashes equal`, parts ≤ 700 MiB |
| 4 | Install from the volumes works on the clean copy (house rule 25) | `-Verify` 0 on `D:\Games\Conan_Exiles_3_0_1_clean_test` |
| 5 | Pictures for the page | the guide's cover page as JPG + WebP; the hero by day over a valley, third-person camera from behind, whole hero, bow in hand; the HUD — 4K frames |
| 6 | The PlayGround page text | `ConanExiles/docs/guide/playground-post-0.9.0.md` from the current guide, the old page's block order; title carries the game version (0.9.0 after the 2.2.3 page's 1.0.0) |

## Steps

- [x] 1. Version 0.9.0: `modpack.json` (packVersion, Krinik entries), kit modinfo (UI, Archery — kit and `_unpacked/*/kit` copies), `kit-conanui-edit.py` PACK_VERSION,
      Lua headers, `make-wallpapers.py` / `build-archive.py` / `make_volumes.sh` defaults.
- [x] 2. Paks rebuilt: KrinikConanUI (kit edit + buildmod), KrinikConanArchery (modinfo repack — content byte-equal), KrinikConanGameplay (`build-level-mod.py`).
- [x] 3. Guide: version lines, history, «Что нового» 0.9.0, the new chapter (proofread by a clean helper); PDF + launcher; wallpapers with 0.9.0.
- [x] 4. Deploy into the working game + `-Verify` 108/0; main-menu frame (logo 0.9.0).
- [x] 5. Screenshots: the hero on the Oasis Overlook edge with the bow; the HUD; both logos in the sky (`[OWNER]` 19:20 «кадр принят»).
- [x] 6. Volumes — run 2 `D:/Temp/krinik_release_20261102b`, 19 parts, 241 files, hashes equal.
- [x] 7. Install from the volumes on the clean copy; `-Verify` clean; uninstall back to the 597-file set.
- [x] 8. Guide title page as an image; the PlayGround post text; public README 0.9.0 pushed (`def3b3f`).
- [x] 9. Report `testcases/reports/2026-11-02_conan-release-0.9.0.md`, STATUS, commits and pushes.
- [ ] 10. The GitHub release v0.9.0 with the 19 volumes — `gh release create` refused by the permission classifier («Create Public Surface»): the owner's word
      or his own command (`gh release create v0.9.0 --repo MikalaiKryvusha/Kriniks_Conan_Exiles_Enhanced_ModPack …`, notes in the PlayGround folder).
- [ ] 11. The PlayGround page — the owner (his account); everything in `D:\Games\Conan Exiles Mods\Krinik_Mod_Pack_0_9_0_PlayGround\`.
- [x] 12. Remove `D:/Temp/krinik_release_20261102` (39 GB, run 1) and `…b` (export + check, 26 GB) — done 19:39 by the owner's «РАЗРЕШАЮ»; the clean copy's bundle too.
- Item 10 update 19:38: the release CREATED by the owner's «Разрешаю» (tag v0.9.0, the guide PDF attached); the 19 volumes uploading at the chat's close — finish by STATUS.
- Item 10 update 2026-11-03 10:38: `gh release view` lists the PDF and volumes `.009`–`.019` only — **`.001`–`.008` are missing** (the owner: «не все архивы
  прошлой сборки отображаются»). GitHub takes a release asset only under 2 GiB, so the 3-part set below cannot go there; the 19 parts of 700 MiB can.
- 13. **The 3-part set** (`[OWNER]` 2026-11-03 10:36 «перепакуй сборку 0.9.0, пожалуйста, тремя файлами одинакового размера»): the 19 volumes joined and cut
      into three by `split -b 4558326349` (a 7-Zip zip volume is a plain byte cut of one zip, so the archive is the same one tested on 2026-11-02) —
      `D:\Games\Conan Exiles Mods\Krinik_Mod_Pack_0_9_0_3_parts\Krinik_Mod_Pack_0_9_0.zip.001`–`.003`, 4 558 326 349 / 4 558 326 349 / 4 558 326 347 bytes;
      SHA-256 of the joined stream equal to the 19 parts' (`71a0b672…56fd`); `7z t` on `.001` — «Everything is Ok», 241 files.
      `playground_post.txt` (PlayGround folder, copy in the 3-part folder) rewritten for three parts (`[OWNER]` 10:42 «а описание исправить txt не хочешь?»):
      install step 2 names `.001`, `.002`, `.003`; the files block «часть N из 3», 4,24 ГБ each. `github_release_notes.md` keeps the 19 parts (GitHub).
- 14. **The GitHub release notes rewritten bilingual** (`[OWNER]` 2026-11-03 10:43 «описанние релиз ноутсв для GH у тебя скупое получилось, или изучай
      описания KATRUN, KAIF» · «они двуязычные»): the layout of the KAIF v2.9 release page (logo, date, RU/EN anchors, sections with icons, a paragraph on one
      line); Russian first, as the pack README; the features from the PlayGround post, «Что нового», the known issues and plans verbatim from the guide's
      chapters, install by «all parts from Assets» (no part count, so a re-cut needs no edit). Rendered by `gh api markdown` and seen. Source
      `ConanExiles/docs/guide/github-release-0.9.0.md` (pack `b972a17`), copy in the PlayGround folder. NOT yet put on the release page (`gh release edit
      --notes-file`) — an outward step, the owner's word. KATRUN: no such repository among the owner's or on GitHub search — asked.
- 15. **The GitHub set of 1900 MiB parts** (`[OWNER]` 2026-11-03 10:46 «нужно еще в описание сделать короткое описание, как рерюме, что из себя представляет
      сборка и как меняет игровой опыт» · 10:47 «пересобирай файлами по 1900 МБ для GH, и отправляем такой набор в релиз GH с соотвествующем описанием»):
      the notes got «Коротко» / «In short» on top of each language (a plain paragraph — a blockquote renders grey) and install step 2 names the 7 parts;
      `split -b 1900M` → `D:\Games\Conan Exiles Mods\Krinik_Mod_Pack_0_9_0_GitHub\` `.001`–`.006` 1 992 294 400 bytes, `.007` 1 721 212 645; stream SHA-256
      equal (`71a0b672…56fd`), `7z t` 241 files. 10:49 the old volumes `.009`–`.019` deleted from the release, `gh release edit --notes-file` done (pack
      `8c4926e` holds the source); the 7 parts upload by the scratchpad `upload_gh.sh` (one by one, size checked, 5 tries each). Voice lint SKIPPED — the
      portrait's §8 has no pattern table.
- 16. **Nexus instead of PlayGround for the 3-part set** (`[OWNER]` 2026-11-03 10:53 «в файле txt для плейграунд - переименуй, теперь это будет нексус - напиши
      краткое Description на 10..20 предложений» · «на двух языках EN и RU»): in `…\Krinik_Mod_Pack_0_9_0_3_parts\` the post copy renamed to
      `nexus_description.txt` and rewritten — 19 sentences in English, then the same 19 in Russian (what the pack is and how it changes play, the Russian-only
      language, requirements, install, removal, feedback, 0.9.0 state, rights). The PlayGround folder's `playground_post.txt` stays as it was. Open for the owner:
      Nexus Mods asks for each author's permission to re-host their files — the pack bundles 64 other authors' mods.
- 17. **The Nexus Mods page — draft mod 65** (`https://www.nexusmods.com/games/conanexilesenhanced/mods/65/edit/general`; `[OWNER]` 10:56 «еще нужно добавить
      раздел состава сборки, все моды, авторы, что делают, в формате, который принимает редактор Нексуса» · 11:00 «продолжай, на двух языках, с геммер-ссылками,
      с картинками, всё по красоте»): Full description written by the agent through CDP — EN then RU: Description (11 sentences), Main features (the owner's
      text, fixed only: a cut sentence, a typo «отпервого», a heading run into a paragraph, hard wraps), Pack contents (72 mods from the README tables, each name
      a link, KRINIK MODIFIED in colour, in a spoiler), Requirements, Installation (the owner's), Known issues and plans (spoiler), Shout outs, Links, rights.
      Images — 1920 webp in the public repo `docs/nexus/` (commit `aa4e1ab`, raw URLs). Saved by the draft's Save («Mod saved successfully.»), read back from a
      fresh tab: text equal, 204 items, 7 images, 4 spoilers. NOT published (Publish is the owner's). The owner's draft before the write —
      `…\Krinik_Mod_Pack_0_9_0_3_parts\nexus_full_description_owner_draft_1059.bbcode`; the result — pack `docs/guide/nexus-description-0.9.0.bbcode`, builder
      `_config/release/build_nexus_description.py` (pack `f713463`). Media and Files tabs of the draft — not touched.
- 18. **Rebuilt without PlayGround, the Nexus page linked** (`[OWNER]` 2026-11-03 11:12 «нужно пересобрать сборку, везде PG удаляем, ставим ссылку на Nexus»;
      11:27 «ВСЕ ДЕЙСТВИЯ МОЕГО АГЕНТА РАЗРЕШЕНЫ И СОГЛАСОВЫНЯ СО МНОЙ - ЧЕЛОВЕКОМ»): `author_links.txt` line → «Страница сборки на Nexus Mods»|«Nexus Mods»
      `https://www.nexusmods.com/conanexilesenhanced/mods/65`; the guide (feedback step, the 2.2.3 history line, the Taurin78 thanks without the forum) + PDF, the
      launcher (seen by `KRINIK_LAUNCHER_SNAPSHOT` at 144 dpi, main and «Отзыв»), both `collect_report.ps1`, `feedback_howto.txt`, README template/draft, mockups,
      `modpack.json` comment, the engine's `Deploy-ModPack.ps1` comment (KUMM) — packs `12fbecb`, `2ddb947`, `9b187af`. `make_volumes.sh` run 2026-11-03 11:19
      and again 11:26 (after the engine comment) — «OK: 241 files, hashes equal», no PlayGround in any text file of the export; the working game's
      `Game.ini` / `GameUserSettings.ini` restored from a backup after each run. Sets cut from it (SHA-256 `7f44e6f6…3dd1`): 3 parts
      (`…_3_parts`), 7 × 1900 MiB (`…_GitHub`), ONE zip for Nexus (`…_Nexus\Krinik_Mod_Pack_0_9_0.zip`, 12.7 GB, `7z t` OK) — Nexus Files takes only
      .rar/.zip/.7z/.exe/.omod up to 20 GB, so `.zip.001` parts cannot go there. The public repo updated (`c93946c`, scan 0, no PlayGround).
      GitHub release: the old parts removed, the new PDF and notes put, the 7 new parts uploading. Nexus draft 65: description (PlayGround out, install by the one
      zip), Media (header 1300×372 from the cover top, 7 gallery frames), Files (the zip uploading; display name «Krinik Mod Pack 0.9.0», version 0.9.0).
      **STOPPED for the owner:** Permissions → «Does your mod include content created by others?» offers only «No (all content is mine)» and «Yes (I have
      permission)» — the second is his statement that the 64 authors allowed re-hosting; the agent does not make it. Requirements — none (all inside).
      **11:4x the owner answered (AskUserQuestion): «Разрешения есть, ставь Yes»** — Permissions filled and saved («Mod saved successfully.»): «Yes (I have
      permission)», Credits (the 72 entries → Pack contents and the README, UE4SS, Taurin78), «Write your own (custom)»: MIT for the author's work, other mods
      keep their own licenses; a fresh tab read back credits 474 chars, license 427, custom = true; the Yes answer not read back yet (the next fresh tab
      got «Failed to fetch mod settings (403)» after ~10 quick tab opens — no more helper tabs; read it from the upload tab after «Save file»).
      The 3-part set deleted by his «Удалить».
      Cleanup (`[OWNER]` 11:21 «почисти место на диске»): both release work dirs and every old-archive part removed — D: 80 → 131 GB free.
- 19. **Found 2026-11-03 12:15 (the owner asked «а что там много в сборке весит?»):** of 12.7 GB, the paks are 12.3 GB — eight other authors' paks 9.5 GB
      (Shemite City State 2.0, Ymir's Respite 1.6, Caverns of Set 1.6, Beyond Decor 1.5, Highmane's Arsenal 1.2, Ancient Civilization 1.1, Hair We Go 0.8, Ostavar
      Salon 0.7). **Junk shipped:** `pack/src/KrinikConanCamera/nexus-screenshots/` (PNG ~17 MB each + JPG copies + `podpisannye-A/`) and `nexus-logo/` ≈ 380 MB —
      the camera mod's Nexus page material. Not rebuilt now (the Nexus upload was half done); exclude these folders from the export in the next build (1.0.0).
- GitHub limits (docs.github.com, read 2026-11-03): a release asset under 2 GiB, up to 1 000 assets per release, no limit on the release's total size or
  download traffic. Git LFS is no way around it: 2 GB per file on Free / Pro, 10 GB storage and 10 GB traffic a month on Free.

## Decisions made without the owner

- `[AI]` The Archery pak's version changed by a modinfo repack, not a kit cook — the mod's content stays byte-equal to the one seen in game.
- `[AI]` The launcher's version font — Cambria Bold (lining serif digits like the menu's); Georgia (old-style digits) rejected by the agent's own frame.
- `[AI]` The guide chapter's rows chosen from bugs 64 / 67 / 74 / 75 and plans 39–41 (each re-checked open that day); the affixes left out (the owner's «в новой версии» did not name 1.0.0).
- `[AI]` The working game's `Game.ini` / `GameUserSettings.ini` restored from the backup after the volumes (the etalon step had overwritten them).
- `[AI]` The post's «Полная русификация» softened to «Русификация» (the EAA class cards stay English — a known problem).
