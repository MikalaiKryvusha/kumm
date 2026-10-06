# Run report — Svarog's Dream: бумага записки по тексту и сплошной фон подсказок

## 1. Work

автономный час по беклогу (`[OWNER]` «по всему беклогу моих идей работай автономно час» · ≈22:46). Записка — ideas/07 п. 25
(`[OWNER]` «сделай скриншот, это заметка» · 2026-10-04 ≈22:45); подсказки «Направления» и «Голод» — ideas/07 «увидел агент сам».
Набор случаев — `testcases/TC_svarog_owner_batch_2026-10-06_evening.md`, C40–C45.

## 2. Contour

игра `D:\Games\Svarog's Dream` (4K, сейв владельца, герой в Бору), мод `KrinikUIRework` горячей перезагрузкой
(ScriptEngine); SvarogsDream `3a000a0` (записка), `f61a4a1` (умолчание фона подсказок). Настройка игры
`Tooltips.BackgroundOpacity` переведена пультом 0.95 → 1 (в `BepInEx/config/krinik.svarogsdream.uirework.cfg` — 1, Grep 23:35).

## 3. Runs

2026-10-06 23:25–23:37 +03:00. Сборка и заливка — `bash tools/deploy-hot.sh KrinikUIRework` (RELOADED, четыре раза). Записка —
`h.sh "call CookingManager ShowPoetry \"Short note. Two lines\r\nonly.\" False False"` и та же команда с 12 строками, кадры
`shot note_s2`, `shot note_l2`, лист `note_sheet.webp`. Подсказки — `h.sh 'hover "UI/ActionBar/ActionBarMain/Action Bar/MiniMap/DirectionsTop"'`,
`h.sh "hover UI/ActionBar/ActionBarMain/AlwaysVisibleBars/Hunger" "wait 1.2" "shot …"`, вырезка `ffmpeg -vf crop=1100:640:2700:1520`,
яркость пикселей — PIL `getpixel`; `h.sh "cfg krinik.svarogsdream.uirework Tooltips BackgroundOpacity 1"`.

## 4. Checks

Hygiene: сборки без ошибок; `node tools/test-guards.mjs` — 83 из 83.
Functional run: записка и подсказки HUD в живой игре — показ методом игры и наведением пульта; кадры прочитаны глазом агента,
  просвечивание — замером пикселей и глазом.
- C40 короткая записка — бумага сжата к двум строкам, «ОК» под текстом (`note_sheet`, средний кадр) — pass.
- C41 длинная записка — бумага прежняя, 12 строк в поле (`note_sheet`, правый кадр) — pass.
- C42 «Направления» — заголовок и «2354м» раздельно, прямой шрифт (`c42_crop`) — pass.
- C43 «Голод» — текст целиком на подложке, поля со всех сторон (`c43_crop2`) — pass.
- C44 «Голод» не просвечивает — попытки 1–2 (холст поверх) fail, попытка 3 (альфа 1) pass (`c44_crop`, `c44_crop2`, `c44_crop3`).
- C45 откат холста — подсказка сплошная, на месте (`c45_crop2`) — pass.

## 5. Found

- Причина просвечивания — альфа фона 0.95, не порядок отрисовки: первая гипотеза построена на точке замера, легшей на собственный
  текст подсказки (EXP-0161).
- Межстрочный подсказки после серии горячих перезагрузок выше, чем в последнем кадре (высота описания 648 против 464, отношение
  ≈ 1.4 ≈ 1.2²). `[AI]` гипотеза: множитель копится перезагрузками; механизм не проверен — судить вид подсказок после чистого
  перезапуска игры.

## 6. Traces

кадры `SvarogsDream/_harness/`: `note_sheet.webp`, `c42_dir.webp`, `c42_crop.webp`, `c43_crop2.webp`, `c44_crop*.webp`,
`c45_crop2.webp` (вне git — `_harness/` в `.gitignore`).

## 7. Verdict

pass — C40–C43, C45; C44 pass с третьей попытки. Не покрыто: вид после чистого перезапуска игры; вкус бумаги записки — слово владельца.
