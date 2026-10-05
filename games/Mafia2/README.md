# Mafia II (Classic) — досье

> Что стоит в игре, откуда взято и как откатить. Читается перед любой правкой в папке игры.
> Игра: `D:\Games\Mafia II`, классическая Mafia II Director's Cut, русская, `pc\mafia2.exe` (32 бит).
> Сборка владельца (его список, 2026-10-05): Friends for Life, Epilog, Uncut Radio, Dot crosshair, 4GB patch.
> «Hide minimap HUD» из списка снят словом владельца: `[OWNER]` «миникарту прятать НЕ НУЖНО! мне она НУЖНА!» · 2026-10-05.
> Пак (не в этом репозитории): `D:\Games\Mafia II Mods` — `mods\` архивы, `work\` распаковки, `stage\` то, что легло
> в игру, `backup\` подлинники, `tools\` приборы.

## Версии (сверено 2026-10-05)

| Мод | Версия | Откуда | Что кладёт |
|---|---|---|---|
| Friends for Life (zahar999, перепак Modded Games) | 2.22.20 | gamepressure (страница Nexus 115 снята администрацией) | `pc\dlcs\cnt_friends_for_life` (508), `edit\sdsconfig.bin`, `pc\sds\tables\tables.sds` |
| Epilog | 2021 | gamepressure (Nexus 137 снят) | 96 файлов поверх `cnt_friends_for_life`, `sdsconfig.bin`, `tables.sds`, `sds_ru\gui\gui-main.sds` |
| Uncut Radio (Modded Games) | 1.2 | gamepressure (Nexus 116 снят) | `pc\sds\music` (408 + 29), музыка и `ingame.sds` Joe's Adventures, `tables.sds`, патч для FFL |
| Small Static Dot Crosshair (VTEBE) | 1.1 (2025-11-02) | Nexus `mafia2/mods/572` | целый `pc\sds\tables\tables.sds` |
| 4GB Patch (NTCore) | 1.0.0.1 | ntcore.com | флаг Large Address Aware в `mafia2.exe` |

Свежее этих версий нигде не найдено. Скачивание с gamepressure: POST формы `FORM_TYPE=POBIERZ_ZA_DARMO` →
30 с ожидания → кнопки `downloadFile('<прямая ссылка metrocf.gameplay.pl>')`; прибор — `gp-geturl.mjs`
(скретчпад сессии 2026-10-05, логика здесь).

## Главный подвох — три мода пишут один `tables.sds`

Friends for Life, Epilog, Uncut Radio и прицел приносят СВОЙ целый `pc\sds\tables\tables.sds`, и по инструкциям
каждый затирает предыдущий. Сведено пофайлово (прибор `tools\sdscli` — обёртка над MafiaToolkit 2.36, нужен .NET 8):

- прицел меняет только `tables/weapons.tbl` — 21 байт, одно поле в строках 0–20 (шаг строки 240) → 2;
- Epilog = Friends for Life по содержимому; меняет 8 файлов, в `weapons.tbl` дописана 128-я строка, сдвига нет;
- патч Uncut Radio для FFL = таблицы Epilog + радио (`Playlists.xml`, `RadioCueDb.xml`, `InCarEffect.xml`);
- итог: таблицы патча Uncut Radio + правка прицела (`tools\merge_crosshair.py`), круг распаковка↔упаковка сверен.

То же с `ingame.sds`: Uncut Radio собран на другой версии игры (лишние стили управления, цвета пешеходов), поэтому
взяты файлы игры / Epilog 2021 и из Uncut только `ja_Playlists.xml` и `ja_RadioCueDb.xml`.
НЕ ставились: `update5` (стимовский exe + `steam_api.dll` + `Steamclient.dll`), копии для `sds_en`/`sds_fr`,
английские названия станций (`sds_en\text`), необязательная музыка меню.

## Установка и откат

`tools\build_stage.py` → `stage\` (1025 файлов) → `tools\install.py install`: 413 подлинников в
`backup\original\`, 612 новых файлов в квитанции `backup\install-receipt.json`, все 1025 сверены по md5.
Откат — `python tools\install.py uninstall`. `mafia2.exe` подлинник — `backup\original-exe\mafia2.exe`
(md5 `fa3fbcb8…`), после 4GB patch отличается тремя байтами. Сохранения до модов — `backup\saves-before-mods\`.

## Шаг автора мода — `update5` (поставлен владельцем 2026-10-05 ≈20:15)

Friends for Life по инструкции автора требует папку `update5` из своего архива. Её поставил сам владелец скриптом
`tools\install-update5.ps1`: 6 файлов в `pc\`, подлинники в `backup\original\pc\`, всё в квитанции
(replaced 416, added 615), 4GB patch заново наложен на новый `Mafia2.exe` (LAA=True).
Запуск 20:16: игра работает (не закрывается, как без этого шага).

## Что видено в игре (2026-10-05 20:25–20:37, запуски агента, сюжет не начинали)

`[OWNER]` «не нужно игру начинать» · 2026-10-05 ≈20:27 — проверка только меню и файлов.

- **Friends for Life загружается:** в главном меню пункт «ДРУЗЬЯ НА ВСЮ ЖИЗНЬ», окна «DLC не куплен» нет; в
  «Загружаемом контенте» строка «FRIENDS FOR LIFE BY ZAHAR» с галочкой, «Готов к игре».
- **Epilog** отдельной строкой не виден и не должен: он кладёт файлы внутрь `cnt_friends_for_life`. Глазом — только
  внутри кампании FFL (не открывали).
- **Прицел, радио** — в `tables.sds` / `ingame.sds`; `install.py verify` 1025/1025. Глазом — только в сюжете.
- Логов игра не пишет: за запуск меняются лишь `videoconfig.cfg` и `last.dat` (`%LOCALAPPDATA%\2K Games\Mafia II\Saves`).

## Графика — «очень высокая» (`[OWNER]` «мне очень высокую графику настрой» · 2026-10-05 ≈20:26)

- `Saves\videoconfig.cfg` — одна строка `0 0 <ширина> <высота> 1 0 0 1`; надёжно известны только поля 3–4.
  Было `1920 1080`, поставлено `3840 2160` (панель владельца 4K 144 Гц).
- Остальное — в зашифрованном `Saves\<профиль>\profile.dat`; правится только через меню «Настройки → Видео»
  (смена «Размытия окружения» = 1 байт + 4 байта контрольной суммы в конце). Не править руками.
- Выставлено в меню: 3840×2160, полный экран, верт. синхронизация вкл, сглаживание вкл, анизотропия 16x, тени
  «Высокий», размытие окружения (AO) **вкл** (было выкл — единственная правка), геометрия «Высокий», APEX PhysX «Высокий».
- PhysX на RTX 50: 32-битный GPU PhysX NVIDIA убрала в 2025, вернула для списка игр (Mafia II в нём) драйвером
  591.44; у владельца 616.92. FPS с PhysX «Высокий» в сюжете не мерили. Если просядет — проверить индикатор PhysX
  в панели NVIDIA (GPU или CPU).
- Подлинники до правки: `D:\Games\Mafia II Mods\backup\settings-before-graphics\` (`videoconfig.cfg`, `profile.dat`).
- Не сделано, на выбор владельца: принудительное сглаживание через NVIDIA Profile Inspector (бит `0x000D02C4`, игровое
  сглаживание тогда выкл), моды текстур/света (Old Time Reality — меняет и геймплей, рискованно).

## Как агент водит игру

- Меню читают **DirectInput и сырой ввод**: `keybd_event` без скан-кода и абсолютный курсор игра не видит, а клик
  мыши срабатывает по ПОДСВЕЧЕННОМУ пункту, а не под курсором. Водить клавишами по скан-кодам:
  `tools\di.ps1 -Scan 0xD0 -Repeat 4` (вниз), `0xC8` вверх, `0xCD` вправо, `0x1C` Enter, `0x01` Esc.
- Кадр — сразу WebP: `python tools\shot.py _harness\rNN.webp 1400`.
- Закрытие: `CloseMainWindow` игра игнорирует, через 15 с — `Stop-Process`.

## ▶ Дальше

Ждём глаз владельца в сюжете: прицел-точка, песни Uncut Radio, Epilog в кампании FFL, FPS на «Высоком» PhysX.
