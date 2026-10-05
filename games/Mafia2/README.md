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

## ▶ Дальше (новый чат)

Спросить владельца, что он увидел в игре: есть ли в меню «Friends for Life» и в нём Epilog, точка-прицел, вырезанные
песни на радио. Глазами агент этот запуск не видел. После ответа — закрыть пункты досье или чинить по его словам.
