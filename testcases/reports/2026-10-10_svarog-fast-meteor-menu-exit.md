# Run report — Svarog's Dream: быстрая падающая звезда (C46) и выход из мира в главное меню (C11 эпика 19)

## 1. Work

Хвосты, которые нашёл судья ночи (03:02):
- быстрая звезда kind 0 не была поймана в кадр (C46, `testcases/TC_svarog_sky_v3_2026-10-09.md`);
- правка `TickMainMenu` (`KrinikUIRework/MenuFonts.cs`, «в мире меню не искать») проверена только на холодном старте — C11 в
  `testcases/TC_svarog_main_thread_2026-10-10.md`.

Кода в этом прогоне не меняли: SvarogsDream `5695ac2`.

## 2. Contour

Игра `D:\Games\Svarog's Dream`, 3840×2160, DX11. Сейв владельца 02:15:41 (`_backups/svarog-saves-2026-10-10_0216-owner`). Выход в
меню записал сейв («Железный человек»). Он отложен в `_backups/svarog-saves-2026-10-10_0307-test-menu-exit`, сейв владельца
возвращён — sha256 4/4.

## 3. Runs

Запуск игры 2026-10-10 03:05 (`bash tools/run-game.sh`).

Пульт:
- `bash tools/h.sh "timescale 0"`, `"callon Camera CameraFollow SetMaxZoom"`, `"call KrinikCameraRework.Plugin TestFaceSun 10 90"`;
- `"call KrinikColorRework.Sky TestMeteorHold -1"`, `"call KrinikColorRework.Sky TestMeteorKind 0"`;
- `"call KrinikColorRework.Sky TestMeteorHold 0.35"` / `0.7` / `5`, `"shot f1"` / `f2` / `fn`;
- `"timescale 1"`, `"click UI/Enablers/MainMenu"`, `"click UI/MainMenu/MainMenu_Canvas/Buttons/MainMenu"`;
- `"click UI/MainMenu/MainMenu_Canvas/Dialog_Canvas/ExitGamePanel_MainMenu/Yes"`, `"shot mm2"`.

Закрытие — `"kill"`.

## 4. Checks

Hygiene: сборка не менялась (`dotnet build` трёх модов в 03:04 — 0 ошибок).

Functional run: игра запущена агентом с сейвом владельца; путь игрока — ночь в Бору, камера на небо; затем меню паузы → «В меню» →
«Да». Прочитано:
- кадры f1, f2, fn и их разность — штрих в верхней полосе кадра;
- кадр титульного меню mm2;
- журнал `menu: styled by tick`.

Итоги: C46 — быстрая поймана; C11 pass.

## 5. Found

1. Быстрая звезда (len 0.16, 0.45 с, наклон 50°, толщина 0.0004) видна коротким тонким штрихом с головой. Все три типа видны.
2. После выхода из мира поиск меню включается сам (`frame 8045, t 154,560`): `WorldState.Instance` после выгрузки мира — null.
3. Кнопка «В меню» — `UI/MainMenu/MainMenu_Canvas/Buttons/MainMenu`. Подтверждение — `…/Dialog_Canvas/ExitGamePanel_MainMenu/Yes`.
   `key Escape` пульт не знает.

## 6. Traces

- `SvarogsDream/_harness/`: `f1`, `f2`, `fn`, `pm1`, `pm2`, `mm2` (`.webp`).
- Журнал — `SvarogsDream/_harness/logs/2026-10-10_0305_Player-meteor-menu-exit.log`.

## 7. Verdict

C11 **pass** — выход из мира в меню, меню оформлено. C46 **partial** — быстрая звезда поймана застывшей (`TestMeteorHold`), серия из шести звёзд вживую и «быстрые и медленные различимы» не снимались — глаз владельца. Поправка после судьи 03:36: здесь стояло «pass» на всё.
