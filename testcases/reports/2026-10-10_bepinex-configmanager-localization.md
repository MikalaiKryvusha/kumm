# Run report — BepInEx.ConfigurationManager: поддержка языков и русский перевод (PR #125)

**Created:** 2026-10-10 23:39 +03:00 · **Run by:** агент (Claude Opus 5.5) · **Version/build:** форк `MikalaiKryvusha/BepInEx.ConfigurationManager`,
ветка `localization-ru`, коммит `c70d20e` (от `d783c04` «Version up to 19.0»)

## 1. Work

- `[OWNER]` «BepInEx делаем им пр на русскую локализаци.» · «В этом чате BepInEx - собирай, тестируй, готовим пр» · 2026-10-10 ≈23:30.
- Случаи C1–C6 — `testcases/TC_bepinex_configmanager_localization_2026-10-10.md`.

## 2. Contour

- Сборки: `dotnet build ConfigurationManager/ConfigurationManager.csproj -c Release` (BepInEx5, net35) и
  `ConfigurationManager.IL2CPP/ConfigurationManager.IL2CPP.csproj` — пакеты восстановлены `nuget.exe restore` (packages.config) и
  `dotnet restore` с источниками nuget.org, BepInEx, IllusionMods.
- Игра: Svarog's Dream (Unity 2020.3, Mono, BepInEx 5.4.23.5), Windows на русском; сборка форка вместо оригинала 19.0 на время прогона.
- REAL WORLD: accumulated — игра и настройки модов владельца; data and machine — его машина; path — меню по Esc → «Настройки модов».

## 3. Runs

1. 2026-10-10 ≈23:30–23:36 — сборки двух вариантов, 0 ошибок; оригинал сохранён в `_backups/configmanager-19.0-original`
   (sha256 91b1c972…), сборка форка в `plugins/ConfigurationManager/`.
2. 2026-10-10 23:37–23:38 — `bash tools/run-game.sh`; `click UI/Enablers/MainMenu` → `…/Buttons/KrinikModSettings` → `shot pr_ru`;
   `cfg com.bepis.bepinex.configurationmanager General Language en|Auto` + `shot`; мышь `mouse.ps1 -X 630 -Y 327` (раскрыть мод) → `shot pr_ru3`.
3. 2026-10-10 ≈23:38 — `kill`, оригинал возвращён, сейв 7/7, реестр 1280/720/1.
4. 2026-10-10 ≈23:39 — `gh repo fork`, `git push fork localization-ru`, `gh pr create` → #125, `gh pr view 125` — OPEN, 5 файлов.

## 4. Checks

- Hygiene: обе сборки без ошибок.
- Functional run: окно в игре владельца, прочитаны кадры и журнал.
- C1–C6 — pass (подробно — файл случаев).

## 5. Found

- none — дефектов не найдено. Примечание: IL2CPP-сборка только собрана, в IL2CPP-игре не запускалась (сказано в описании PR).

## 6. Traces

- Кадры: `SvarogsDream/_harness/pr_ru.webp`, `pr_ru2.webp`, `pr_en.webp`, `pr_auto.webp`, `pr_ru3.webp`, лист `pr_sheet.webp`.
- PR: https://github.com/BepInEx/BepInEx.ConfigurationManager/pull/125.

## 7. Verdict

Pass: язык окна выбирается сам по системе (русская Windows — русский), переключается на лету, кнопки по русскому слову целиком; PR открыт.
Ответ мейнтейнеров — не в нашей власти.
