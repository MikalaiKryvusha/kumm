# Svarog's Dream — досье

> Своя сборка на BepInEx: `D:\work\ai_sandbox\SvarogsDream` (репозиторий `svarogs-dream-modpack`), игра
> `D:\Games\Svarog's Dream`. Что сейчас в работе — `STATUS.md`, пункты 0а и 0. Как устроены ИИ и живой мир игры —
> `researches/svarogs-dream/simulation.md`; прокачка выше 100 и формулы — `researches/svarogs-dream/progression-uncap.md`.
>
> **Чужих модов нет — всё своё.** Мастерской Steam у игры нет (в категориях магазина app 2004640 нет «Steam Workshop», проверено
> 2026-10-07); на Nexus нет ни страницы игры, ни модов (`[OWNER]` «на нексусе нету игры и модов, я проверил» · 2026-10-07). Есть только
> трейнер XMODhub (читы). Разработчик — VI Game Forge, на форуме Steam отвечает lynxbird; ошибки автора чиним своим `KrinikFixes`.

## Как агент работает с игрой сам

(Перенесено дословно из `STATUS.md` 2026-10-05; правится здесь.)

**Как работаю с игрой сам** (разрешение владельца — память `svarog-agent-runs-game-itself`): `tools/run-game.sh` ·
пульт `tools/h.sh "<команда>"…` (shot · dump · find/findall · hover/click · waitfor · cfg · kill; путь с пробелами — в
кавычках) · клик по миру — `tools/mouse.ps1 -X -Y -Button left|right|wheel` (правая — разговор, wheel `-Clicks ±N` — приближение камеры) · ходьба героя — `tools/keys.ps1 -Key W -Ms 1500` (W/A/S/D, скан-кодом; клавиши окон — из настроек владельца: сумка на Tab, не на I по умолчанию) · `tools/deploy-hot.sh
KrinikUIRework` (RELOADED) · кадр — `shot` пишет JPEG, `h.sh` сам переводит в WebP 90 (PNG — никогда, канон
`AGENT_GUIDE.md`) · сличение с макетом — только `tools/shoot_mockup.mjs` + `tools/pair.py` (целые окна, одно разрешение)
· закрывать `kill` (выход из меню пишет сейв; копия сейвов — `D:\work\ai_sandbox\_backups`) · пока игра открыта —
голосом (`tools/voice_say.py`, файл фразы — в `SvarogsDream/_harness/`) · сменил значение по умолчанию — правь и
`BepInEx/config/krinik.svarogsdream.*.cfg`. Слоты сумки: #0 сапоги, #2 лук, #7 удочка, #46 кольца, #47 туника.
Пособие по вёрстке Unity UI + TMP — `researches/unity-ugui-layout/` (греп по `TAG:`; ловушки — `12_pitfalls.md`).
`h.sh` без игры отвечает «game not running» (код 2). Разговор с жителем — методом игры, не мышью: `comps Interactable 8` (пути,
расстояние, точка экрана) → `callon "<путь>" Interactable Interact True` (EXP-0155). Записка на экран её же байтами —
`call CookingManager ShowPoetry "<текст с \r\n>" False False`, поле текста `UI/ActionBar/ActionBarMain/UIRecipe/Poetry/PoetryMessage`.

## Небо (KrinikColorRework, раздел «Небо», с 2026-10-09)

Шейдер `Krinik/Sky/Gradient` (проект `unity/KrinikShaders`, пакет `krinik.shaders`; после правки шейдера — пересборка пакета и
ПЕРЕЗАПУСК игры: пакет занят запущенной игрой) + `src/KrinikColorRework/Sky.cs`. Шесть настроений по часу и погоде игры, два заката
(чередуются по дням), солнце, луна, звёзды, облака шумом, молнии с громом игры, дымка у горизонта (туман ExponentialSquared — вода
Lux Water считает туман формулой EXP2, EXP-0192). Разведка и уроки — `researches/svarogs-dream/sky-recon.md`; случаи —
`testcases/TC_svarog_sky_2026-10-09.md`. Пульт: `cfg krinik.svarogsdream.colorrework Sky ForceMood <Auto|Day|Dawn|Dusk|Night|Fog|Rain>`,
`Sky Sunset <Alternate|Raspberry|Golden>`, `call KrinikColorRework.Sky TestLightning`, `call KrinikColorRework.Sky TestFlashHold 4`;
ракурс неба — `call KrinikCameraRework.Plugin TestFaceSun 15 <угол от солнца>` (поле зрения ±25° — солнце на ±10°); ночь по часам —
`callon Managers/StandardManagers/WorldTimeManager WorldTime IncreaseTimeByOneHour True`; дождь игры — `callon
Managers/StandardManagers/WeatherManager WorldWeatherManager SetRainWithPrerain False`. После проверки вернуть `ForceMood = Auto`.

## Шрифт Manrope

Матовый шейдер земли (мод KrinikColorRework 2.1.0, баг 15) — тот же проект Unity: `E:\Unity\2020.3.49f1\Editor\Unity.exe -batchmode
-nographics -quit -projectPath SvarogsDream/unity/KrinikShaders -executeMethod KrinikBuild.Bundles` (≈30 с; перенесено из STATUS 07.10).

`E:\Unity\2020.3.49f1\Editor\Unity.exe -batchmode -nographics -quit -projectPath SvarogsDream/unity/KrinikShaders
  -executeMethod KrinikFonts.Build` → скопировать `Bundles/krinik_manrope` и `Bundles/ttf/krinik_manrope_ttf` в папку игры; в новом
  клоне сначала `python tools/unpack_unitypackage.py "<PackageCache>/com.unity.textmeshpro@3.0.6/Package Resources/TMP Essential Resources.unitypackage" unity/KrinikShaders`.
- **Шрифт мудрости Gabriela** (06.10) — тот же проект, `-executeMethod KrinikFonts.BuildWisdom` → `Bundles/wisdom/krinik_gabriela` в папку
  игры; настройка `Fonts.Wisdom`. Граница — кто говорит: бумага мира (журнал «События», описание квеста, легенда альманаха, окно
  записки, новости `WorldEvents`, совет загрузки) — Gabriela; интерфейс, подсказки обучения `GameTips`, карточки, диалоги — Manrope.
  Правило — `IsPaper` в `KrinikUIRework/Fonts.cs`; метка `KrinikLetter` для этого не годится (стоит и на диалогах).

## Перевод — свой, по глоссарию

- Онлайн-перевод выключен 2026-10-06 (`AutoTranslator/Config.ini`: `Endpoint=`, `FallbackEndpoint=`) — новые строки остаются
  английскими, пока не переведены руками. Машинный словарь `_AutoGeneratedTranslations.txt` — только чтение.
- Наши файлы — `SvarogsDream/_config/xunity/zz_*.txt` (грузятся после машинного, поздний перекрывает): `zz_krinik.txt` — правки
  руками, `zz_krinik_tips.txt` — советы загрузки, `zz_glossary.txt` — генерируется, руками не править.
- Термины — `translation/glossary.tsv`. Цикл правки: перевод в `zz_krinik*.txt` → `bash tools/translation_deploy.sh` (починщик,
  строгая проверка терминов, копия в игру; красная проверка — выкладки нет) → перезапуск игры → кадр экрана. Отчёт по всему
  словарю — `translation/glossary_report.md` (машинные фразы с термином не тем словом — очередь своего перевода).
- Ключи с числами: XUnity хранит строку на каждое сочетание чисел; на любое число — правило `r:"^Метка: ?(…)$"=…` (генератор
  делает их для меток-терминов). **Точный ключ сильнее правила:** машинная строка с тем же числом перебьёт правило — генераторы
  перекрывают такие ключи своей точной строкой (EXP-0149). **В образце правила нет тегов:** XUnity отдаёт правилу строку с
  разобранной разметкой — `<color…>x6 INT</color>` внутри «Scaling: … per 100 points.» переводится отдельным правилом на кусок.
  Проверять — числом, которого нет в машинном словаре.
- **Карточка навыка** (06.10): база умений игры → `translation/spells_en.tsv` (`tools/spells_extract.py`, нужен
  `TypeTreeGeneratorAPI`; перезапускать после обновления игры) · наш перевод → `translation/spells_ru.tsv` (шаблоны `_AMOUNT_` как в
  базе; третий столбец — разобранное ложное срабатывание проверки, «Термин — причина») · партии правок — `tools/spells_ru_add.py
  <файл>` (строки `EN:` / `RU:` / `OK:`) · `translation_deploy.sh` сам собирает `zz_spells.txt` (`tools/spells_xunity.py`). Имена
  умений и улучшений — в `glossary_skills.tsv`; односложные и двусмысленные («Hunt», «Ready») — в `spells_ru.tsv`. Число в
  шаблоне — без согласования: «залп из N стрел», «N золота», не «N стрел». Проверка без наведения — `settext`/`gettext` в поле
  `UI/CharacterPanel/MasteryPanel/MasterySkills/SpellTooltip/Description` открытой карточки (курсор — `cursor X Y`).
- **Машинные строки с неверным термином** (06.10: 294 → 0) — свой перевод в `zz_krinik_terms.txt`, партиями: `tools/phrases_add.py
  "<игра>" <файл>` (строки `K:` — ключ машинного словаря буква в букву, `RU:`, `OK: Термин — причина`). Список очереди —
  `translation/glossary_report.md` («другое слово»).
- **Предметы** (06.10 вечер): база игры → `translation/items_en.tsv` (`tools/items_extract.py`, 721 предмет = счёт
  `ItemDatabaseObject`; перезапускать после обновления игры) · наш перевод → `translation/items_ru.tsv` (поля `name` · `desc` ·
  `frame` — рамка окна предмета: качество, ковка, её описание) · партии — `tools/items_xunity.py "<игра>" --add <партия.tsv>` ·
  `translation_deploy.sh` сам собирает `zz_items.txt`. Генератор красный, если строки нет в базе, кавычки непарные или тот же
  ключ лежит в более позднем `zz_krinik*`/`zz_spells` (одно место на ключ). Ключи — как в `GameUI.ItemToolTip`: имя как есть,
  «(1h)» → «({{A}}h)», описание в кавычках. Правила имён — шапка `items_ru.tsv` (комплект одним именем, «Ожерелье Лисы» как
  «Кольцо Выпада», «(одноручный)» в роде имени). Случайно в предметах только качество 1–8, имена неизменны (идея 11 — аффиксы).
- **Стиль — методичка `SvarogsDream/translation/STYLE.md`** (все правила со словом владельца; главное — держаться авторского
  текста). Читать её перед любой правкой перевода — это держит хук `tools/hooks/style-gate.mjs`: без свежего `Read` методички
  запись перевода и партии не проходят. Переводы до 15:23 утверждены владельцем, пометки `[AI]` сняты.
- **Аудит качества** — `tools/translation_quality.py` (обрубки · латиница · потерянные числа «ЗМКЗ»); разобранные ложные
  срабатывания — `translation/quality_ok.tsv`; термины судит только `glossary_check.py`.
- **Карточка навыка растёт по тексту** (`FitSpellTip` в `KrinikUIRework/Plugin.cs`; настройки `Tooltips.SkillCard*`): шире, шрифт −5 %,
  рост вверх до 0.8 поля, дальше шрифт описания до 0.82. Проверка ступени «шрифт мельче» — `settext` длинного текста в описание
  открытой карточки, затем `call KrinikUIRework.Plugin RefitSpellTips` (после горячей перезагрузки пульт находит старый тип —
  перезапустить игру).

## Перевод диалогов партией

(Перенесено дословно из `STATUS.md` 2026-10-07 23:2x при мягком закрытии; правится здесь.)

Новая реплика игры → партией (`$PY` =
   `/d/work/ai_sandbox/_tools/unitypy-venv/Scripts/python.exe`, в нём `pymorphy3`):
   1. `STYLE.md` прочитать ЦЕЛИКОМ (хук `style-gate`, окно 60 мин и после каждой правки методички).
   2. Код файла: `ilspycmd -t <Класс> "<игра>/Svarog's Dream_Data/Managed/Assembly-CSharp.dll"` (`_tools/ilspycmd`) — что игра делает с
      выбором (флаг, талант, деньги, бой); такие варианты и загадки — дословно, загадка должна решаться по-русски (STYLE §2 п. 6).
   3. `python -I tools/dialogue_batch.py dump <Файл> <out>` → черновик «номер⇥русский» → `$PY -I tools/dialogue_batch.py pack …` →
      `$PY -I tools/dialogue_xunity.py "D:/Games/Svarog's Dream" --add <партия>`.
   4. `python -I tools/dialogue_gender_sweep.py <коммит до партии>`: каждую строку «suspects» и «address» — глазами (кто говорит и к
      кому; к герою без рода, но с «тобою/тебе»; пол говорящего не назван — его речь о себе без рода).
   5. `bash tools/translation_deploy.sh` — «ours 0» (ложное — в `glossary_exceptions_dialogue.tsv` с причиной), потом
      `$PY -I tools/translation_quality.py "<игра>" translation/glossary.tsv translation/quality_report.md` и `grep zz_dialogue` — пусто
      (ложное — `quality_ok.tsv`). Тире — только где оно есть у автора; числа «2,000» → «2 000», «2.000» как есть.
   Строка со вставкой — русский несёт те же «{…}» буква в букву; перевод — в контексте разговора, говорящий из кода (`Yell(<кто>, "…")`).

**Тексты из данных игры, не из кода** (2026-10-07): черты и герои выбора — `tools/data_texts_extract.py` → `translation/talents_en.tsv`,
`heroes_en.tsv`; перевод — `translation/selection_ru.tsv` → `tools/selection_xunity.py` (`--add <партия>`, в выкладке сам);
ключ — текст как есть, «\r» и «\n» буквами (EXP-0173). Перепись строк кода вне всех словарей — `tools/text_census.py` (баг 28).

## Замер кадра

- Пульт: `perf [сек]` (FPS, счётчики отрисовки, живые значки, персонажи, аниматоры, частицы), `prof [сек] [N]`
  (самые дорогие `Update` игры и модов), переключатели `animcull`, `particles`, `farchars`, `timescale`, `terrainshader`.
- Потоки игры: `powershell -File tools/threads.ps1 -Seconds 6` (в репозитории сборки).
- Правки без побочного состояния сравнивать переключением в одном мире; свет — при остановленном времени (EXP-0139).
