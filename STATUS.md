# KUMM — Current Status

> This file is read by the AI agent before every task. Update it on every significant change of state.
> It is the PRIMARY handoff between sessions: a new agent session starts with empty context and must be
> able to get productive from this file alone. Write accordingly — concrete, with file paths and commands.
> 🧠 Prime thinking principle — `PHILOSOPHY.md` (SIMPLICITY: KISS + Occam). Read your working framework
> in `AGENT_GUIDE.md`.
>
> ⚠️ **STATUS is a SUMMARY of NOW, not a chronicle.** A status file that only ever grows turns into
> the project's history book, and the agent that came for a quick "where are we" drowns in it
> (field: a 2 300-line STATUS — "an abyss, not a summary"). The rules that keep it a summary:
>
> - **Every line passes two tests:** *"if I remove this line, will the next agent make a mistake?"*
>   and *"does a newcomer still read the whole file in one sitting?"* Soft target: **~200 lines**
>   (one-two screens of substance) — the guard is a warning, not a wall, but crossing it means a
>   trim is overdue.
> - **Closed work is MOVED OUT, not accumulated:** when a phase/session's entry is no longer "now",
>   move it VERBATIM into `PROJECT_HISTORY.md` (the chronicle — that is what it is for).
>   `/end-chat-soft` carries a "bonsai trim" step for exactly this (`/pause` stays ceremony-free by design).
> - **Leave the file the way you'd want to find it:** fresh summary of what works, what's in
>   progress, what's next, the pitfalls, and WHERE TO LOOK for the details (plans, bugs, history) —
>   pointers, not retellings.

---

## What's done (the short tail — older entries live in PROJECT_HISTORY.md)

> **06.10 день — Svarog's Dream, перевод и карточка навыка:** карточки навыков своим переводом (353 текста, 102 имени, правило на
> любое число); карточка растёт по тексту (видено в игре); термины держатся по всему словарю (294 → 0); 62 совета загрузки и 38
> эффектов переписаны; выбран шрифт «мудрости» Gabriela (`[OWNER]` «утверждено»). Отчёты —
> `testcases/reports/2026-10-06_svarog-skill-card-translation.md`, `…-grow.md`; летопись — запись 2026-10-06 14:29.
>
> **06.10 после 14:35 — предметы своим переводом** (по файлам, без игры): база предметов игры вынута в таблицу (721); 335 имён и
> 95 описаний не были переведены вовсе — теперь 720/721 имён (721-е пустое) и 295/295 описаний, комплекты одним именем, рамка
> окна предмета (качество, ковка). Аудит: потерянные числа 5 → 1, латиница 70 → 17, обрубки 69 → 10; «Дальность» — термин с
> правилом. Сборка `682b25c`…`465e632`, выложено в игру; в игре не смотрено.

---

## Where we are now

> 🎯 **Svarog's Dream — снова главное** (`[OWNER]` «в новом чате продолжим со Сварог Дрим» · 2026-10-05 ≈20:55): досье
> `games/SvarogsDream/README.md`; передача дел — блок «Первым делом» ниже (переводы; потом шрифт «мудрости» Gabriela).
>
> **Mafia II** (на паузе): сборка стоит, меню и графика проверены агентом; прицел, радио, Epilog, FPS — глазом владельца в
> сюжете (досье `games/Mafia2/README.md`, раздел «Дальше»); сюжет агенту не начинать (`[OWNER]` «не нужно игру начинать» ·
> ≈20:27).
>
> **Конан 2.2.3** — досье `games/ConanExiles/README.md`. Palworld — в ежедневном пользовании, правок не ждёт.
> **Oblivion Remastered запаркован до патча** — не ходить туда, пока владелец не скажет.

The engine works and the owner uses it daily for Palworld. What it does NOT have is any way to check
itself: there is no test of any kind, and both halves talk to the outside world (Nexus through a
browser, game folders on disk), so a fresh session cannot currently prove a change is safe without the
owner's eyes. That is the whole of the current focus — Phase 1 in `MASTER_PLAN.md`.

| Phase | Status | What's there |
|-------|--------|--------------|
| Phase 0 — the two halves | ✅ done | v0.1.0 in daily use |
| Phase 1 — trustworthy unattended | 🔲 next | no tests exist yet; the deterministic core is the target |
| Phase 2 — the second game | 🟢 **доказана на Конане** | движок принял Conan Exiles Enhanced **без единой правки**: слаг `conanexilesenhanced` из манифеста, `game_id` со страницы. Oblivion Remastered остаётся подготовленным (манифест на 168 модов), ждёт патча |
| Phase 3 — compatibility | 🔲 todo | источник конфликтов найден: `UnrealPak -List` из Dev Kit читает любой пак с Oodle (`researches/conan-devkit/`); работа — фаза 3 эпика `plans/06` |
| Phase 4 — optimization presets | 🔲 todo | |

## 🤖 Autonomous backlog pool (no human / no special hardware needed)

> Tasks the agent can do FULLY autonomously: write code → build → test on the harness → fix → commit,
> without the human and without resources only the human can provide. The loop skills
> (`/autoloop`, `/dayloop`, `/nightloop`) grind this pool.

- [ ] **Запуск-гард перед любыми тестами (блокер).** Импорт `kumm.mjs` ЗАПУСКАЕТ CLI: диспетчер команд
      лежит на верхнем уровне, и под `node --test` он получит путь тест-файла вместо команды, свалится
      в `default` и напечатает шапку в поток TAP. Пока гарда нет, юнит-тест написать нельзя — проверка
      разбора имён 15.08 делалась разовым скриптом в скретчпаде. Гард: сравнить
      `pathToFileURL(process.argv[1]).href` с `import.meta.url`. Правка механическая, но задевает
      ~250 строк отступов — поэтому отдельным заходом и с `node --check` после.
- [~] **Round-trip check for the archive naming scheme** — **ПОЛОВИНА СДЕЛАНА 08.09.2026.**
      `test-parse-archive.mjs` проверяет РАЗБОР: 17 случаев, из них девять настоящих имён живой
      библиотеки Palworld, четыре конановских с короткими id, вторая схема Nexus и отрицательный
      контроль. Поводом был баг 03 (`\d{4}` в id мода). **Осталось**: круговой ход
      `libraryName()` → `parseArchive()` — то есть проверить, что ЗАПИСЬ и ЧТЕНИЕ согласованы, а
      не только чтение. Тест уже умеет вырезать функции из `kumm.mjs` в обход запуска CLI —
      каркас для этого готов.
- [ ] **Cases for `sameFile`/`stamp` and `pickCard`** — upload-date comparison rounded to the minute;
      variant selection between Steam/Gamepass, Capped/plain, presets. Pure, autonomous.
- [~] **A fixture pack** — **разово собрана и окупилась 08.09.2026**: поддельный пак + библиотека
      из архивов, названных по схеме движка, + папка игры с одним файлом-признаком. Прогнана в трёх
      режимах (`-Deploy -DryRun`, боевая раскатка, `-Verify`) и нашла **четыре** дефекта
      переносимости за один заход (`bugs/03_DONE_*`, `EXP-0043`). **Осталось**: превратить разовый
      скрипт в постоянный прибор в репозитории — сейчас он жил в scratchpad и умер вместе с сессией.
      Это самый дешёвый оставшийся пункт Phase 1: строитель фикстуры уже написан один раз.
- [ ] **Close the packaging drift** — `package.json` `"files"` ships `kumm.mjs` without
      `Deploy-ModPack.ps1`, so `npm i -g` delivers half the engine. Verify with `npm pack --dry-run`.
- [ ] **A real `help` command** — the switch block, the header comment (lines 18–28) and the README
      table are three hand-maintained copies of one list. One source, the rest generated or checked.
- [ ] **`kumm status` after `close`** — confirm it reports cleanly rather than throwing; cheap, and it
      is the command a session runs first.
- [ ] **Warn when a mod overrides `Engine.ini` at runtime** — обе болезни 21.08 были невидимы движку:
      деплой сверил каждый файл и всё равно отгрузил сборку, чью графику Lua-мод переписывает в мире.
      Дешёвый первый срез не требует запущенной игры: просканировать исходники модов на
      `[SystemSettings]` и присваивания `r.*` и доложить, какие из них сталкиваются с `Engine.ini` пака.
      **Свежий довод из практики:** `r.ViewDistanceScale` живёт в ЧЕТЫРЁХ местах с ТРЕМЯ разными
      значениями (мод 1.0, `_config/Engine.ini.SystemSettings-tuned.ini` 2.6,
      `_config/Krinik-Palworld-UE5-Engine.ini` 2.2), и побеждает мод. Это конкретный автономный
      кусок Phase 3 (`MASTER_PLAN.md`).
      **И второй довод, из Конана 08.09.2026: соперник бывает не мод, а САМА ИГРА.** Прибор
      `ConanExiles/_config/check-conflicts.py` показал, что игра ставит `r.ViewDistanceScale` и
      `grass.CullDistanceScale` из групп качества, применяемых ПОЗЖЕ нашей секции, — то есть наши
      значения проигрывали молча. Прибор простой (сверка нашего ini со снимком журнала игры) и
      просится в движок как общая проверка, а не как скрипт одного пака.

---

## ❓ Awaiting human review (interviews / homework)

> Decisions the agent must not make alone (brand/UX/architecture), or actions only the human can do
> (test on real hardware, external accounts). Filed in `interviews/` and `homeworks/`.

- 🅿️ **Стрельба из лука «по-обливионски» — в дальнем ящике по слову владельца 12.09.** Не поднимать, пока он
      не скажет. Разведка — `researches/conan-archery/README.md`, запись в досье Конана.
- 🔴 **НЕ запускать `Clear-Quarantine.ps1 -Stamp 2026-08-17_2335 -Execute`**: в карантине единственный
      экземпляр сохранения Elden Ring и личное видео `ref.mp4`.
- 🧹 **Уборка 17.08 ждёт решений владельца:** образцы зловреда, задача RTSS, iTunes ради кодировщика OBS, три
      вещи из карантина. Ничего не восстанавливать без его слова. Полный текст — `PROJECT_HISTORY.md`, запись
      «2026-09-18 поздний вечер»; разбор — `researches/cleanup-2026-08-17/README.md`.
- ⏳ **Palworld `LoadingRange` стоит на ванильных 25600** — на что возвращать, владелец не назвал (предлагались
      51200 или 76800). Подробности там же в летописи.
- 🗺️ **Oblivion, до патча не срочно:** две строки мод-листа не сопоставлены с архивами, двух решейдов нет в
      библиотеке, консоль не открывается (не блокер). Подробности там же в летописи.
- 🕵️ **Строка «установка не из Steam» (досье Конана, летопись) — сверить с правилом обезличивания.** Словарь
      `tools/scrub-identity.mjs` её пропускает. Убрать ли её и нужна ли правка гейта — решение владельца;
      переписывать опубликованную историю агент сам не станет.
- 🧰 Anything needing a real Nexus login, a real game install, or the owner's own mod pack is his to
      run — the agent can build the fixture path but cannot verify the live path alone.

---

## Where to continue next session

> A concrete checklist so the next session (empty context) can start immediately: which files, which
> commands, what to verify first.

> ⚠️ Force-closed 2026-10-06 15:50: ceremonies skipped (judge pass, bonsai trim, README, showcase linters) — the first
> /end-chat-soft pays this debt. Standing falsehood: none («окаянный» в общем списке методички поправлен на месте, 15:42).
>
> **Первым делом новому чату (≈15:50) — записки и книги Сварога** (`[OWNER]` «в ново чате берум в работу» · 15:50):
> 1. Прочесть методичку `SvarogsDream/translation/STYLE.md` (хук `style-gate` без свежего чтения запись перевода не пустит);
>    уровень записок принят по пяти образцам (`[OWNER]` «Очень круто! Спасибо!» · ≈15:50) — образцы в истории чата нет, их тексты:
>    история «It all started when the crops…», «We've been starvin'…», «In the western hills, just beyond Bor…», «Sacred groves
>    now burned…», «Be it known to all citizens…» — перевести заново по методичке (переводы в файлы ещё НЕ записаны).
> 2. Источник — `SvarogsDream/translation/notes_en.tsv` (297 текстов, `tools/notes_extract.py`; ключ словаря = текст как есть,
>    `\r\n` буквами); без перевода 231 (рецепты 72, стихи 54, осколки памяти 46, истории 28, свитки 20, записки 11).
> 3. Сделать `translation/notes_ru.tsv` + `tools/notes_xunity.py` → `zz_notes.txt` по образцу `items_xunity.py` (сверка с базой,
>    непарные кавычки, конфликт ключей с поздними zz_*, `--add` партии), подключить в `translation_deploy.sh`, добавить
>    `notes_xunity.py … --add` в TOOLS хука `tools/hooks/style-gate.mjs` + случай в `tools/test-guards.mjs` (часть E).
> 4. Показ владельцу — таблицей в чате «английский | русский» по предложениям (память `translation-shown-side-by-side`).
> 5. Разведка стиля — `researches/svarogs-dream/archaic-style.md`; голоса фракций (язычники — народно, Дом Веры — церковно).

**Прежний блок (до 15:50)** — Svarog's Dream: переводы (`[OWNER]` «Закрывай чат. Продолжим переводы делать в новом чате» ·
2026-10-06, последнее сообщение чата до 14:29; «больше тебе такая лингвистическая работа»; «без отсмотра в игре» — переводы в игре
не смотреть, пока владелец не скажет иначе).
1. Прочесть досье `games/SvarogsDream/README.md`, раздел «Перевод — свой, по глоссарию»: где что лежит, `translation_deploy.sh`
   (генератор карточек → починщик → строгая проверка → копия в игру; красная проверка — выкладки нет), правила без тегов.
2. Очередь `SvarogsDream/translation/quality_report.md` почти пуста (≈15:08: обрубки 10, латиница 17, потерянные числа 1 — почти
   всё строки чужого сетевого ассета вроде «Mute Player», «Bathhouse», «[HOST]», которых игрок, по всей видимости, не видит, и
   подпись прежнего переводчика — убрана по его слову ≈15:20). Перезапуск: `<python>
   tools/translation_quality.py "D:/Games/Svarog's Dream" translation/glossary.tsv translation/quality_report.md`. Термины —
   только `glossary_report.md` (0, держать 0). Предметы — досье, раздел «Перевод», пункт «Предметы».
   **Дальше по переводам:** машинные диалоги и квесты (основная масса `_AutoGeneratedTranslations.txt`); советы — дружелюбнее;
   книги и записки — деревенским языком с редкой стариной, по авторскому тексту (методичка `STYLE.md`; разведка
   старославянских слов и оборотов — субагенты 06.10 ≈15:27, итог — `researches/svarogs-dream/archaic-style.md`). Случайные предметы с
   аффиксами — `ideas/11`, запаркована: `[OWNER]` «сильно позже, не сегодня не сейчас».
3. Как править: машинная строка — партией `tools/phrases_add.py "<игра>" <файл>` (`K:` ключ буква в букву · `RU:` · `OK:
   Термин — причина`) → `zz_krinik_terms.txt`; карточка навыка — `tools/spells_ru_add.py` → `spells_ru.tsv`; новое имя-термин —
   `glossary_*.tsv` (однословные и двусмысленные — точной строкой, не в глоссарий). Пишет `<python>` =
   `/d/work/ai_sandbox/_tools/unitypy-venv/Scripts/python.exe`, вывод — с `PYTHONIOENCODING=utf-8`.
4. Стиль — методичка `SvarogsDream/translation/STYLE.md` (читать первым делом; хук `style-gate` без неё перевод не пустит).
   Все переводы до 15:23 утверждены, `[AI]` сняты.
5. Потом — шрифт «мудрости» Gabriela (пункт (а) ниже).
- **Сделано 06.10:** Manrope везде — шрифт TMP у русификатора (`AutoTranslator/Config.ini` → `OverrideFontTextMeshPro=krinik_manrope`,
  копия старого конфига `Config.ini.bak-2026-10-06-rus_font`), старые `UI.Text` и меню — мод (`KrinikUIRework/Fonts.cs`, свой пакет
  `krinik_manrope_ttf`); «Прогресс» (`ProgressLayout.cs`) и статы инвентаря (`StatsLayout.cs`) — стиль принят; окно книги (`Notes.cs`).
- **Пересборка шрифтов** — досье `games/SvarogsDream/README.md`, раздел «Шрифт Manrope».
- **Перевод свой с 10:23** (DeepL выключен, глоссарий, «Помощь», советы, имена умений и талантов) — летопись, запись ниже
  этой даты; порядок работы — досье `games/SvarogsDream/README.md`, раздел «Перевод — свой, по глоссарию».
- **06.10 день** (умные карточки, карточка навыка своим переводом и растущая, советы, термины по словарю 294 → 0, эффекты,
  подписи классов) — летопись, запись «2026-10-06 14:29»; отчёты `testcases/reports/2026-10-06_svarog-skill-card-*.md`.
- **Очередь после переводов:** (а) **шрифт «мудрости» Gabriela** — выбран и утверждён (`[OWNER]` «В» · «утверждено» · между 14:03 и 14:18), охват:
  советы, письма, книги, заметки, журнал; технические окна с числами — Manrope; проба — правый нижний угол HUD (`ideas/07` п. 28;
  образцы — `SvarogsDream/gallery/game/2026-10-06_шрифт-мудрости/`); (б) переводы дальше (`[OWNER]` «больше тебе такая
  лингвистическая работа»): имена эффектов — сделаны (38, точными строками в `zz_krinik.txt`, SvarogsDream `f53740b`); дальше — предметы — сделаны (721,
  `items_ru.tsv`); (в) имена умений, талантов, предметов — утверждены (`[OWNER]` «Все твои переводы утвержаю, снимай ИИ» · ≈15:23).
- **Потом по чек-листу:** Альманах (записи) · События (запись) · карта; окно книги — бумага по размеру текста; в меню «Загрузить
  игру» заходит на мазок; иконка поверх «Мировой Порядок: 69%» на странице бога. **Каждую правку перевода смотреть в игре** —
  полное слово может не влезть («Состояние Души» в «Мастерстве» → исключение «Душа:»). Путь в дереве брать из дампа (`dump`).
- **Долги:** кто сдвигает числа «Прогресса» после раскладки — не найдено (не `ForceUIResizing`, опыт 09:31); держит настройка
  `Progress.HoldNumbers`. Проверять после чистого перезапуска игры — горячая перезагрузка оставляет старые компоненты и метки.
- ❓ **Ждёт слова владельца:** баг 20 (щелчок по жителю сквозь меню) — повтор, когда игра свободна.
- Прежняя очередь (часы под картой, настройки модов, совет загрузки, прокачка за 100) — летопись, запись 06.10 09:53.

0а. **Эпик 10 «красота меню»** — фазы 1–6 закрыты, фаза 7 («Квесты») доведена в эпике 13 (строка «Первым делом»), осталась
   фаза 8 (карта) и мелочи — `plans/10_EPIC_svarog_menu_beauty.md`, раздел «На завтра». Прошлое — `PROJECT_HISTORY.md`, запись
   2026-10-06 02:07 +03:00. До DONE бага 15 — увидеть подмену земли при ходьбе; FPS — проверить пробуждение дальних при подходе героя.
   Шейдер пересобирается: `E:\Unity\2020.3.49f1\Editor\Unity.exe -batchmode -nographics -quit -projectPath
   SvarogsDream/unity/KrinikShaders -executeMethod KrinikBuild.Bundles` (≈30 с).
0. **Svarog's Dream — переработка UI** — план и статусы `ideas/07_svarog_mods.md`; рулбук `SvarogsDream/docs/UI_RULEBOOK.md`
   ждёт «да» владельца; тикет `bugs/20`. Пути пульта: `click UI/Enablers/InfoPanel` · `UI/InfoPanel/InfoPanelHeader/<Map|Quests|
   Progress|Logs|Almanac|Help>Header` · `click UI/Enablers/CharacterPanel` · `UI/CharacterPanel/CharacterPanelHeader/<Devotion|
   Attributes|Mastery>Header`. Полный прежний текст пункта — летопись, запись 2026-10-06 14:29.
1. **Конан на 2.2.3 — хвосты переезда.** Досье, раздел «✅ 2026-10-02»: графика на 4K — глазом владельца,
   Doubled Storage Size своим модом (шаг 6а), PauseGame — вернуть, если автор перевыложит. Старая 2.1.1 удалена.
2. **Движок, фаза 1 — автономный беклог выше.** Первый пункт — запуск-гард в `kumm.mjs`, без него юнит-тест не
   написать. Перед работой: `git status`, `node --check kumm.mjs`, пункт через `/plan-task`.
3. **Баги — сначала `/check-backlog`.** Шесть файлов в `bugs/` без метки DONE, статусы — раздел «Open bugs»
   ниже. Единственный открытый баг самого движка — 06 (`-Only` обрезает `modlist.txt`).
4. **Следующее обновление KAIF** — после прохода `node tools/kaif-update-sweep.mjs <старый бандл> <новый бандл>`,
   пока исток не закрыл #72; навыки с нашими заполнениями сливает `node tools/kaif-update-merge-skills.mjs` (#73).
5. **Стражи этого проекта:** тронул любой — `node tools/test-guards.mjs` (48 случаев). Хуки (heredoc, методичка
   перевода `style-gate`) подключены в местных `.claude/settings.local.json`; в новом клоне запись берётся из `AGENT_GUIDE.md` → Tools.
   Слэш в аргументе `sed`/`echo` хук не видит (строка GAP в самом хуке): такие вставки сверять глазом сразу.
6. **Palworld** — в ежедневном пользовании, правок не ждёт. Досье `games/Palworld/README.md`; три замороженных
   опыта и правила замера — `PROJECT_HISTORY.md`, запись 12.09. **Oblivion** запаркован до патча.
7. **Два линтера KAIF красные по старым долгам, не по этой сессии.** `kaif-attribution-lint` — 11 мест, где слово
   владельца пересказано без цитаты (летопись, идеи 01/04/05, план 01, `researches/conan-devkit`), базы нет;
   `kaif-scenario-lint` — 2 (`plans/02`:38, `ideas/04`:160). Чинить цитатой из архива или принять базу
   `--write-baseline` — решение следующей сессии; `check` и `check --gate-budgets` при этом зелёные.

## Open bugs

Одиннадцать файлов без метки DONE (сверено 04.10 23:38 по `ls bugs`, плюс 18 и 19; 16 и 17 закрыты в этот вечер):

- 🔴 `bugs/20_svarog_world_click_through_open_menu.md` — щелчок по жителю сквозь открытое меню начинает разговор.
- 🔧 `bugs/15_svarog_whitish_world_against_low_sun.md` — белёсость земли против солнца: причина (блик стандартного шейдера)
  подтверждена, свой матовый шейдер в моде 2.1.0, прогон pass, 0.6 принято владельцем («да, 0.6 хорошо, оставляем» ·
  ≈10:22); до DONE — увидеть подмену земли при ходьбе.
- 🔴 `bugs/14_pickcard_exact_name_pins_old_file.md` — `kumm check` держится за старый файл, если автор когда-то
  вписал версию в имя файла (Bosses My New Besties, 02.10). Баг самого движка; план починки и кейс — в документе.
- 🟢 `bugs/13_conan_checker_nexus_403_system32_curl.md` — по существу закрыт 02.10: Nexus теперь закрыт Cloudflare
  для любого curl, Nexus читает `kumm check`; осталось поправить шапку прибора.
- 🔴 `bugs/06_deploy_only_truncates_modlist.md` — `-Only` молча обрезает `modlist.txt` и выключает остальные
  моды. Баг самого движка (`Deploy-ModPack.ps1`), воспроизводится каждый раз.
- 🟡 `bugs/07_conan_probe_kills_ue4ss_lua_layer.md` — симптом снят выключением мода, причина не найдена.
- 🔧 `bugs/08_conan_config_overrides_code.md` — починено, ждёт подтверждения владельцем.
- 🔬 `bugs/04_conan_camera_microjitter.md`, `bugs/05_conan_loadasset_delayed_abort.md` — разведка, без починки.
- ✅ `bugs/11_caption_plate_sized_per_frame.md` — закрыт по классу, метки DONE нет: оформить `/check-backlog`.

## KAIF — отправка и тикеты

Отправка в KAIF — без спроса владельца (`AGENT_GUIDE.md` → Push / GitHub authentication, его слово 18.09). Открытые
тикеты в истоке (#72, #73, #78, #80–#82, полевой отчёт #79) — летопись, запись «2026-10-04 вечер».
