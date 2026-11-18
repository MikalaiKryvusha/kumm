# Интервью #040 — Порядок в репозитории сборки Конана

> Topic: что сделать с тяжёлыми скриншотами в истории, где держать арты сборки и в каком формате отдавать игрокам обои
> Source of the idea: слово владельца в чате 2026-11-18 15:14 «было бы хорошо, чтобы ты навёл порядок в локальном и удалённом репозитории» и 15:16 «какого … оно там лежит а не в репе проекта» (обои лежали в библиотеке модов)
> Created: 2026-11-18 15:35 +03:00
> Status: ✅ ОТВЕЧЕНО 2026-11-18 15:38 +03:00 на странице (Q1 B, Q2 A, Q3 свой ответ, Q4 A); Q1 и Q4 внесены 15:4x (пак `c8b177f`); Q2 ждёт, пока помощник по лаунчеру закоммитит `build-docs.py`; Q3 записан как правило формата

## Что уже сделано и что найдено

Репозиторий сборки `D:\work\ai_sandbox\ConanExiles` и его копия на GitHub (закрытый `conan-exiles-modpack`) весят около 550 МБ. Первый проход
порядка уже сделан (коммиты пака `8651fce`, `2ccd63f`): обои переехали из библиотеки модов в `_config/branding/`, журналы опытов, на которые
ссылаются баги, закоммичены, мусор инструментов закрыт правилами `.gitignore`, дубль схемы камеры и брошенный пак старого мода лука удалены.
Ниже остались четыре решения: они касаются истории репозитория, его структуры и того, что получает игрок.

## QUESTIONS

### Q1. Что сделать с пятнадцатью скриншотами страницы мода камеры в истории репозитория?

**Answer target:** `STATUS.md` → блок NOW, порядок в паке; история репозитория `conan-exiles-modpack`

**Origin:** агент нашёл при описи 2026-11-18 15:2x: папка `docs/camera-mod-page/nexus-screenshots/` хранит 15 PNG по 17–18 МБ, всего около 270 МБ;
они есть в дереве и в истории. Ваше правило о картинках требует WebP, PNG в репозитории не хранится.

<!-- archaeology: search "camer|screensho|histo|force|push" → 198 hits in 42 files · read: interviews 001, 037; plans 01, 03 — about the camera mod and git push routes, none about the size of the pack's history · prior: unrelated — the hits decide camera behaviour and push routes, no answer on history size or PNG screenshots exists -->

- **A) (рекомендую) Перевести скриншоты в WebP и вычистить старые PNG из истории**
  - Situation. Скриншоты занимают около 270 МБ из 550 МБ репозитория на GitHub.
  - Action. Агент переводит 15 PNG в WebP без потерь, убирает старые PNG из всех коммитов и по вашему слову отправляет новую историю на GitHub принудительным пушем.
  - Result. Репозиторий на GitHub становится меньше примерно на 270 МБ, картинки остаются с тем же качеством, номера старых коммитов меняются.
  - Check. `gh repo view MikalaiKryvusha/conan-exiles-modpack --json diskUsage` показывает число меньше прежних 564 473; `git ls-files "*.png"` в `docs/camera-mod-page/` пуст.
- **B) Перевести в WebP только в текущем дереве, историю не трогать**
  - Situation. Папка `nexus-screenshots` хранит 15 скриншотов по 18 МБ.
  - Action. Агент переводит скриншоты в WebP новым коммитом.
  - Result. Новые файлы лёгкие, но репозиторий на GitHub и каждая новая копия по-прежнему весят около 550 МБ.
  - Check. `git ls-files "*.png"` в папке пуст; размер на GitHub не меняется.
- **C) Оставить как есть**
  - Situation. Папка `nexus-screenshots` хранит 15 скриншотов по 18 МБ.
  - Action. Ничего не меняется.
  - Result. Репозиторий весит около 550 МБ, PNG остаются вопреки правилу о картинках.
  - Check. `git ls-files "*.png"` показывает 15 файлов.
- **D) свой ответ**

**Answer:** B) <!-- owner-review: by Mikalai Kryvusha (KOT KRINIK) · 18 ноября 2026, 15:38 (+03:00) -->

### Q2. Где держать арты сборки?

**Answer target:** структура пака; `modpack.json` → `extras`; пути в `_config/launcher/make-res.py` и `_config/branding/make-wallpapers.py`

**Origin:** ваш вопрос 2026-11-18 15:12 «где … наши арты?». Сейчас они разложены по пяти папкам: `_config/branding/` (логотипы, иконки, обои),
`_config/launcher/res/` (картинки лаунчера, их собирает скрипт из `branding`), `_config/release/published_0_9_0/nexus_media/` (страница 0.9.0 на Nexus),
`docs/camera-mod-page/` (страница мода камеры) и `docs/guide/` (скриншоты руководства; восемь кадров `hero_oasis` лежат вне git).

<!-- archaeology: search "folde|brandi" → 156 hits in 37 files · read: plans 02, 03, 35 — library folders and review folders, no decision about an art folder · prior: unrelated — the hits are mod-library and review folders, no answer on where the build's art lives -->

- **A) (рекомендую) Одна папка `art/` в корне пака для всех исходников артов**
  - Situation. Вы ищете оригинал обложки или логотипа.
  - Action. Агент переносит исходники в `art/logos`, `art/icons`, `art/wallpapers`, `art/wallpapers_source`, `art/screenshots` и переводит скрипты на новые пути; собранные копии остаются там, где их собирают (`launcher/res`) и публикуют (`published_0_9_0`).
  - Result. Любой арт сборки лежит в одной папке, от корня пака до файла два шага.
  - Check. `ls art/` показывает пять папок; сборка ресурсов лаунчера даёт `res/wallpaper.jpg` байт в байт.
- **B) Домом артов остаётся `_config/branding/`, туда же переезжают скриншоты руководства**
  - Situation. Вы ищете оригинал обложки или логотипа.
  - Action. Агент переносит восемь кадров `hero_oasis` в `_config/branding/screenshots/` и коммитит их.
  - Result. Арты лежат в одной папке, но внутри `_config`, рядом со скриптами.
  - Check. `git ls-files _config/branding` показывает логотипы, иконки, обои и скриншоты.
- **C) Оставить пять папок как есть**
  - Situation. Вы ищете оригинал обложки или логотипа.
  - Action. Агент только коммитит восемь кадров руководства на их месте.
  - Result. Арты остаются в пяти папках.
  - Check. `git status` чистый.
- **D) свой ответ**

**Answer:** A) <!-- owner-review: by Mikalai Kryvusha (KOT KRINIK) · 18 ноября 2026, 15:38 (+03:00) -->

### Q3. В каком формате отдавать игрокам обои?

**Answer target:** `modpack.json` → `extras` (папка `Wallpapers`), шаг выпуска 0.9.1 в `plans/55_EPIC_conan_build_0_9_1_for_3_1_1.md`

**Origin:** 2026-10-25 вы просили положить обои в сборку в качестве PNG. Агент 2026-10-30 сделал готовые обои с логотипами в JPEG качества 95,
и игроки 0.9.0 получили JPEG. Ваше правило о картинках при этом запрещает хранить PNG в репозитории.

<!-- archaeology: search "wallpap|jpeg|quali" → 24 hits in 15 files · read: interviews 011, 015, 025; plans 03, 04 — graphics quality settings, none about the wallpaper format · prior: the owner's word 2026-10-25 «в png качество» in the comment of modpack.json extras -->

- **A) (рекомендую) Игроки получают PNG, репозиторий хранит WebP без потерь**
  - Situation. Игрок распаковал архив сборки 0.9.1 и открыл папку `Wallpapers`.
  - Action. При сборке архива скрипт выпуска делает PNG из WebP без потерь.
  - Result. В папке три PNG (1080p, 2K, 4K) без потерь качества; архив больше примерно на 13 МБ; в репозитории PNG нет.
  - Check. В архиве `Wallpapers/*.png` три файла; `git ls-files "*.png"` в `_config/branding` пуст.
- **B) Оставить JPEG качества 95**
  - Situation. Игрок распаковал архив сборки 0.9.1 и открыл папку `Wallpapers`.
  - Action. Ничего не меняется.
  - Result. В папке три JPEG; на глаз разница с PNG почти не видна, архив меньше.
  - Check. В архиве `Wallpapers/*.jpg` три файла.
- **D) свой ответ**

**Answer:** D) — сейчас после апскейла в каком формате будут - в таком и поставляем. Мы же в лаунчер встраиваем WebP, и в документах мы везде пользуемся WebP, где можем. Где не моожем webp, там используем JPEG 95 <!-- owner-review: by Mikalai Kryvusha (KOT KRINIK) · 18 ноября 2026, 15:38 (+03:00) --> <!-- ru-ok: the owner's own answer, verbatim -->

### Q4. Что сделать со скриншотом `Без имени-1.jpg` в корне пака?

**Answer target:** корень пака; `_config/public_release/make_public_tree.py` (исключение файла из публичного дерева)

**Origin:** файл лежит в корне с 2026-09-09: это скриншот главного меню с окном «Играть без подключения», к задаче об этом окне. Публичное дерево
его исключает по имени. Имя нарушает правило имён файлов: кириллица и пробел.

<!-- archaeology: search "имени" → 32 hits in 17 files · read: interviews 012, 017 — names in Svarog's Dream, none about this file · prior: unrelated — the hits are names of Svarog's Dream characters and saves, no answer about this screenshot -->

- **A) (рекомендую) Переименовать в `offline_play_dialog_2026-09-09.jpg` и перенести в `docs/refs/`**
  - Situation. В корне пака лежит `Без имени-1.jpg`.
  - Action. Агент переносит файл и переносит вместе с ним исключение из публичного дерева.
  - Result. В корне остаются только файлы сборки; скриншот лежит среди справочных материалов и в публичное дерево не попадает.
  - Check. `ls` корня не показывает jpg; сборка публичного дерева не содержит `offline_play_dialog`.
- **B) Удалить файл**
  - Situation. В корне пака лежит `Без имени-1.jpg`.
  - Action. Агент удаляет его из репозитория.
  - Result. Скриншот остаётся только в истории git.
  - Check. `git ls-files` не показывает файл.
- **D) свой ответ**

**Answer:** A) <!-- owner-review: by Mikalai Kryvusha (KOT KRINIK) · 18 ноября 2026, 15:38 (+03:00) -->

## План после ответов

1. Q4 и Q2: перенос файлов, новые пути в скриптах и манифесте, сборка ресурсов лаунчера байт в байт, коммит и пуш.
2. Q3: шаг выпуска делает PNG из WebP; проверка содержимого архива.
3. Q1: перевод скриншотов в WebP; при ответе A вычистка истории и принудительный пуш только после вашего слова в этом интервью.
