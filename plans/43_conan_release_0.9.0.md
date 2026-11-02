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
- [ ] 12. Remove `D:/Temp/krinik_release_20261102` (39 GB, run 1) and `…b` (export + check, 26 GB) — the recursive delete was refused; the owner's way or file by file.

## Decisions made without the owner

- `[AI]` The Archery pak's version changed by a modinfo repack, not a kit cook — the mod's content stays byte-equal to the one seen in game.
- `[AI]` The launcher's version font — Cambria Bold (lining serif digits like the menu's); Georgia (old-style digits) rejected by the agent's own frame.
- `[AI]` The guide chapter's rows chosen from bugs 64 / 67 / 74 / 75 and plans 39–41 (each re-checked open that day); the affixes left out (the owner's «в новой версии» did not name 1.0.0).
- `[AI]` The working game's `Game.ini` / `GameUserSettings.ini` restored from the backup after the volumes (the etalon step had overwritten them).
- `[AI]` The post's «Полная русификация» softened to «Русификация» (the EAA class cards stay English — a known problem).
