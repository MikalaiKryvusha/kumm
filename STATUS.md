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

> **04.10 день — Svarog's Dream: агент сам водит игру, партия UI, рулбук.** Пульт `KrinikDevHarness` + ScriptEngine
> (горячая перезагрузка), голос Silero eugene и хук `voice-reminder`. Проверено кадрами: окно сравнения (вкладка
> «Надето», яркие «лучше/хуже» поверх перевода, расширение, склейка), письма тёмные, подсказки HUD по тексту, цифры
> клавиш, кнопки HUD с подписями. Окно предмета ручными сдвигами — тупик (`EXP-0128`) → вариант Б, своё окно на
> движке раскладки. Образцы 12 игр в HDR (`EXP-0129`), канон мода — рулбук `SvarogsDream/docs/UI_RULEBOOK.md`.

> **04.10 ночь — новая игра Svarog's Dream (Unity 2020.3 Mono, GOG), своя сборка.** Разведка `researches/svarogs-dream/`;
> сборка `D:\work\ai_sandbox\SvarogsDream` (приватный `svarogs-dream-modpack`, последний коммит `30be6ac`): BepInEx 5.4.23.5
> (+ `dll_search_path_override = BepInEx\core` и `HideManagerGameObject = true`), Configuration Manager 19 (F8 и кнопка
> в меню паузы), пять своих модов — `KrinikColorRework` (картинка день/ночь, свет героя, мини-карта), `KrinikCameraRework`
> (СКМ, отдаление, трава `_ScaleFade`), `KrinikUIRework` (подсказки, HUD), `KrinikModMenu`, протоколы `src/Shared/KrinikConfig.cs`
> и `KrinikDiag.cs` (пульс и состояние в журнале BepInEx). Слова владельца после запусков: «сработало» (цветокор, трава
> после HideManagerGameObject), поворот на СКМ и отдаление работают, «Настройки модов получилось выровнять». Уроки — `EXP-0127`. GTA SA: дальность пуль ещё ×3 (досье).

---

## Where we are now

> 🎯 **Последняя сессия (04.10) — Svarog's Dream**, своя сборка на BepInEx: `D:\work\ai_sandbox\SvarogsDream`, игра
> `D:\Games\Svarog's Dream`; передача дел — пункт 1 «Where to continue».
>
> **Conan Exiles Enhanced 2.2.3** (пак `D:\work\ai_sandbox\ConanExiles`, игра
> `D:\Games\Conan Exiles 2.2.3\Conan Exiles`, подробности — досье `games/ConanExiles/README.md`). Переезд сделан
> 02.10; старая 2.1.1 (`D:\Games\Conan Exiles`) удалена по слову владельца «можешь удалять старый конан». Palworld — в
> ежедневном пользовании владельца, правок не ждёт. **Oblivion Remastered запаркован до патча —
> игры на диске нет**, не ходить туда и не предлагать по ней работу, пока владелец не скажет.

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

### 🗡️ Конан — досье `games/ConanExiles/README.md`

✅ Переезд на 2.2.3 сделан 02.10.2026 (`plans/09`). Всё живое по Конану — итог переезда и что после него открыто,
пак и его приборы, Dev Kit, мерцание теней (на 2.2.3 осталось — слово владельца 02.10), справочник долгов и правил,
оплаченных граблями, — в досье. Свежесть модов с Nexus — только `node kumm.mjs check --root D:\work\ai_sandbox\ConanExiles`
(curl Nexus больше не пускает).

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

0. **Svarog's Dream — ГЛОБАЛЬНАЯ МИССИЯ: переработка UI в лучшую, читаемую, понятную, красивую и удобную форму**
   (слово владельца 04.10; план, пункты и статусы — `ideas/07_svarog_mods.md`).
   **КАНОН МОДА — рулбук `SvarogsDream/docs/UI_RULEBOOK.md`** (`[OWNER]` «на него ты будешь ориентироваться при
   разработке мода переработки интерфейса»; черновик агента, ждёт «да» владельца — правила с `[OWNER]` уже его слово).
   **Первым делом в новом чате — подробный разбор лучших практик** по образцам (`[OWNER]` «В новом чате начнём с
   детального описания и анализа лучших практик»): `SvarogsDream/gallery/refs/` — 77 кадров из 25 игр, 46 с карточками
   предметов (`card__*`), в каждой папке README с первыми наблюдениями; итог разбора — в рулбук. **Затем код варианта Б**
   (`[OWNER]` «написание кода — начнём уже в новом чате»): своё окно
   предмета на движке раскладки Unity (Layout Group / Content Size Fitter) по рулбуку — «вёрстка должна быть
   динамичной, почти как HTML» (ручные сдвиги в `src/KrinikUIRework/Compare.cs` — тупик, `EXP-0128`). Первым — кадр на
   сапогах (ячейка инвентаря #0) и кольцах (#46) владельцу. Образцы — `SvarogsDream/gallery/refs/index.html`.
   **Как работаю с игрой сам** (разрешение владельца — память `svarog-agent-runs-game-itself`): `tools/run-game.sh`
   (запуск → «Продолжить» → ожидание HUD) · пульт `tools/h.sh "<команда>"…` (shot · dump · find/findall · hover/click ·
   waitfor · callon · cfg · kill) · `tools/deploy-hot.sh KrinikUIRework` (ScriptEngine, печатает RELOADED) · кадр →
   `tools/shot2webp.py` · закрывать **`kill`** (выход из меню пишет сейв; копия сейвов — `D:\work\ai_sandbox\_backups`).
   Пока игра открыта — **голосом** (`tools/voice_say.py`, Silero eugene, темп 0.90; хук `tools/hooks/voice-reminder.mjs`
   напоминает) и окно игры вперёд. Снимки чужих игр — только `tools/shot-hdr.ps1` + `hdr2webp.py` (`EXP-0129`).
   **Сменил значение по умолчанию — правь и `BepInEx/config/krinik.svarogsdream.*.cfg`** или ставь пультом `cfg`.
   Сделано 04.10 и проверено кадром — `ideas/07`, история кадров — `SvarogsDream/gallery/game/`. Написано, но в игре не
   проверено: пауза при открытом инвентаре (после правки `isClosed`), надписи над головами, плашки навыка и
   подобранного, мини-карта днём (пункт 15 — не начат).
   Решения владельца ждут: **(а)** преследование врагов у него на СКМ (`gameSettings` KeyCodes[38] = Mouse2) —
   переназначить в «Управлении», камеру на 4/5 или развести модом; **(б)** свой перевод ~11 000 строк
   (`translation/untranslated.txt`, DeepL русификатора отвечает «Too many requests») силами Claude — дорогой, только по
   слову; имя мода — `KrinikRussianLocalosation` или `…Localization` (уточнить). **Когда возьмёмся за перевод — две
   задачи, не одна** (слово владельца 04.10, «не сегодня, на будущее»): `[OWNER]` «мы будем переводить то, что
   недопереведено НО И ДОПОЛНИТЕЛЬНО: то, что в моде перевода уже переведено - проверить корректность и адекватность этих
   переводов, вероятно, там местами может быть плохо переведено и нужно исправлять» (`translation/translated.tsv`).
1. **Конан на 2.2.3 — хвосты переезда.** Досье, раздел «✅ 2026-10-02»: графика на 4K — глазом владельца,
   Doubled Storage Size своим модом (шаг 6а), PauseGame — вернуть, если автор перевыложит. Старая 2.1.1 удалена.
2. **Движок, фаза 1 — автономный беклог выше.** Первый пункт — запуск-гард в `kumm.mjs`, без него юнит-тест не
   написать. Перед работой: `git status`, `node --check kumm.mjs`, пункт через `/plan-task`.
3. **Баги — сначала `/check-backlog`.** Шесть файлов в `bugs/` без метки DONE, статусы — раздел «Open bugs»
   ниже. Единственный открытый баг самого движка — 06 (`-Only` обрезает `modlist.txt`).
4. **Следующее обновление KAIF** — после прохода `node tools/kaif-update-sweep.mjs <старый бандл> <новый бандл>`,
   пока исток не закрыл #72; навыки с нашими заполнениями сливает `node tools/kaif-update-merge-skills.mjs` (#73).
5. **Стражи этого проекта:** тронул любой — `node tools/test-guards.mjs` (36 случаев). Хук Bash подключён в
   местных `.claude/settings.local.json`; в новом клоне запись берётся из `AGENT_GUIDE.md` → Tools.
   Слэш в аргументе `sed`/`echo` хук не видит (строка GAP в самом хуке): такие вставки сверять глазом сразу.
6. **Palworld** — в ежедневном пользовании, правок не ждёт. Досье `games/Palworld/README.md`; три замороженных
   опыта и правила замера — `PROJECT_HISTORY.md`, запись 12.09. **Oblivion** запаркован до патча.
7. **Два линтера KAIF красные по старым долгам, не по этой сессии.** `kaif-attribution-lint` — 11 мест, где слово
   владельца пересказано без цитаты (летопись, идеи 01/04/05, план 01, `researches/conan-devkit`), базы нет;
   `kaif-scenario-lint` — 2 (`plans/02`:38, `ideas/04`:160). Чинить цитатой из архива или принять базу
   `--write-baseline` — решение следующей сессии; `check` и `check --gate-budgets` при этом зелёные.

## Open bugs

Восемь файлов без метки DONE (сверено 02.10 по `ls bugs`):

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

Известный дефект движка, ждущий, когда его возьмут: **дрейф упаковки** — `package.json` `"files"` не включает
`Deploy-ModPack.ps1`, поэтому `npm i -g kumm` ставит половину движка (`npm pack --dry-run` → 4 файла).

## KAIF — отправка и тикеты

**Отправка в KAIF не спрашивает владельца — его слово 18.09:** «ОТПРАВКА В KAIF ВСЕГДА РАЗРЕШЕНА И ОБЯЗАТЕЛЬНА!!!!
БЕЗ ДОПОЛНИТЕЛЬНОГО ЗАПРОСА РАЗРЕШЕНИЯ У ВЛАДЕЛЬЦА!!!» Тикеты, запросы, полевые отчёты, поправки — командой
`node .kaif/kaif-core.mjs report <файл>` (`AGENT_GUIDE.md` → Push / GitHub authentication).

Открыты в истоке, все от 18.09: [#72](https://github.com/MikalaiKryvusha/KAIF/issues/72) — обновление теряет
дельту модуля с заголовком, переименованным самим проектом; [#73](https://github.com/MikalaiKryvusha/KAIF/issues/73)
— заполнения с `<…>` не выводятся; #78 — текст поставки держал полевой отчёт у владельца; #80 — шум линтера
опыта; #81 — песочница равна проходу лишь с точностью до окончаний строк; #82 — вопрос владельцу в чате не
проходит проверку археологии. Полевой отчёт 2.7 — #79. Прежний список тикетов — летопись, запись 18.09.
