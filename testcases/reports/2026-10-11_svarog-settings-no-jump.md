# Run report — Svarog's Dream: настройки в игре без прыжков при переключении

**Created:** 2026-10-11 17:26 +03:00 · **Run by:** агент (Claude Opus 5.5) · **Version/build:** `KrinikUIRework` сборки 2026-10-11 17:24:22
(до неё — сборка 2026-10-11 утра, контроль)

## 1. Work

Прыжок страниц настроек при переключении (`[OWNER]` «только прыгают при переключении» · 2026-10-11; рулбук К2). Случаи C1–C6 —
`testcases/TC_svarog_settings_main_tabs_2026-10-11.md`.

## 2. Contour

- Svarog's Dream (Unity 2020.3.49f1, Mono, BepInEx 5.4.23.5), 1280×720 полный экран, меню по Esc.
- Параллельно в Chrome :9223 шёл прогон раскраски портретов — игра его не касается.
- REAL WORLD: accumulated — сейв владельца (копия 23:57, после каждого прогона 7/7; первый запуск закрыт владельцем через меню —
  сейв записан, его файлы сохранены в `_backups/svarog-saves-2026-10-11_1720-owner-exit`, сейв откатан); data and machine — его машина;
  path — Esc → страницы настроек.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-10-11 17:19–17:20 | `bash tools/run-game.sh`; `h.sh "click UI/Enablers/MainMenu" … "shot mt_<страница>"` | C1; игру закрыл владелец |
| 2 | 2026-10-11 17:22–17:23 | `run-game.sh`; `click …/Buttons/Gameplay`; `click …/GameplayMenu/Options/btnPage3` `shot jmp_old` `wait 2` `shot jmp_old_settled`; `h.sh kill` | C3 (контроль) |
| 3 | 2026-10-11 17:24 | `bash tools/deploy-hot.sh KrinikUIRework` (игра закрыта) | C3b |
| 4 | 2026-10-11 17:24–17:26 | `run-game.sh`; переключения `btnPage3/1/2/4`, `Buttons/Video`, `Buttons/Controls`, `Buttons/Gameplay`, `shot` сразу после каждого; `h.sh kill`; `cmp` сейва; `reg-snap.sh restore` | C4, C5, C6 |

## 4. Checks

Hygiene: сборка `KrinikUIRework` — 0 ошибок.
Functional run: меню настроек в игре владельца, восемь первых кадров после переключения прочитаны глазом (лист `jmp_sheet`).

- C1 pass — кадры всех главных страниц (`mt_*`).
- C2 fail → исправлено — сейв перезаписан выходом владельца, откатан, 7/7.
- C3 pass (контроль) — на старой сборке первый кадр в раскладке игры.
- C3b pass — сборка выложена.
- C4 pass, C5 pass — на новой сборке первые кадры уже в нашей раскладке.
- C6 pass — сейв 7/7, реестр 1280×720 / 1.

## 5. Found

- Прыжок — исправлен (раскладка раз в секунду → в кадр смены).
- Близнецы того же устройства («раз в секунду» над интерфейсом), не проверены в этом прогоне: `MenuFonts.cs:82`, `Fonts.cs:261`,
  `Icons.cs:189`, `MapLayout.cs:381/384`.
- Пузырь реплики жителя наполовину уходит под чёрную колонку меню (кадр `mt_menu`).

## 6. Traces

- Кадры: `SvarogsDream/_harness/mt_*.webp`, `jmp_old.webp`, `jmp_old_settled.webp`, `jmp_new*.webp`, листы `jmp_old_pair.webp`, `jmp_sheet.webp`;
  галерея `SvarogsDream/gallery/game/2026-10-11_настройки-без-прыжков/`.

## 7. Verdict

Pass: страницы и подвкладки настроек раскладываются в кадр переключения; подвкладки 2–4 «Управления» по одной не перебирались.
