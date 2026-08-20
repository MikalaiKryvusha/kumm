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
>   `/end-chat` carries a "bonsai trim" step for exactly this (`/pause` stays ceremony-free by design).
> - **Leave the file the way you'd want to find it:** fresh summary of what works, what's in
>   progress, what's next, the pitfalls, and WHERE TO LOOK for the details (plans, bugs, history) —
>   pointers, not retellings.

---

## What's done (the short tail — older entries live in PROJECT_HISTORY.md)

> v0.1.0 (the two halves) and the KAIF 2.2 deployment closed and moved to `PROJECT_HISTORY.md`.

> Три графические сессии Palworld 15.08.2026 (регрессия FPS, латентность, большой разбор) закрыты и
> лежат в `PROJECT_HISTORY.md`. Всё для продолжения работы по игре — в **`games/Palworld/README.md`**
> (досье) и **`researches/ue5-cvars/`**; выжимка для рук — в эстафете ниже, пункты 6–12.

### Подготовка сборки Oblivion Remastered к патчу, 2026-08-15 ✅

Владелец удалил игру с диска — остались библиотека архивов (177 файлов) и его текстовый мод-лист.
Задача была снять инвентарь и подготовиться к дню, когда выйдет патч: накачать свежие версии и
собрать сборку заново.

- **Главное открытие: движок не читал эту библиотеку вообще — 0 файлов из 177.** У Nexus ДВЕ схемы
  имён, и библиотека, собранная руками через браузер, лежит во второй (`Имя-1921-3-5-1747646868.zip`,
  поля через дефис, в конце секунды Unix). `parseArchive` знал только ту, что пишет сам движок, и
  требовал ровно четырёхзначный `modId` — здесь они от двух до пяти цифр. Записано как `EXP-0018`.
- **Правки в `kumm.mjs`** (все проверены на живых данных, регрессии на Palworld нет):
  `parseArchive` разбирает обе схемы (168 из 177) · `library()` привязывает архив по маске
  `source.archive`, а `nexusId` только сужает поиск · `pickCard` отрезает служебный хвост в обеих
  схемах · наружу экспортированы два разборщика имён.
  **Зачем маска:** одна страница Nexus часто отдаёт несколько РАЗНЫХ файлов (`ArmorSkills` x2 и x10,
  UORP и его Deluxe, `Descension` и патч к нему). Привязка «по id» брала первый попавшийся и
  **в 19 случаях из 168 брала чужой файл**.
- **Собрано в сборке** (`D:\work\ai_sandbox\OblivionRemastered`, приватный репозиторий):
  `modpack.json` — 171 запись, 138 включённых (сборка июня 2025) и 33 выключенных (кандидаты и
  отработавшие версии) · `_config/library-inventory-2025.md` — тот же инвентарь для чтения глазами ·
  `README.md` — порядок действий на день патча, семь шагов.
- **Не сделано намеренно:** правил раскладки (`install`/`verify`) нет ни у одного мода, `targets.json`
  пуст. Игры на диске нет, а сборка после патча собирается заново — раскладка пишется, когда мод
  отобран. Манифест в режиме ОТСЛЕЖИВАНИЯ: `kumm check`/`update` его исполняют, `Deploy-ModPack.ps1` — нет.

---


## Where we are now

The engine works and the owner uses it daily for Palworld. What it does NOT have is any way to check
itself: there is no test of any kind, and both halves talk to the outside world (Nexus through a
browser, game folders on disk), so a fresh session cannot currently prove a change is safe without the
owner's eyes. That is the whole of the current focus — Phase 1 in `MASTER_PLAN.md`.

| Phase | Status | What's there |
|-------|--------|--------------|
| Phase 0 — the two halves | ✅ done | v0.1.0 in daily use |
| Phase 1 — trustworthy unattended | 🔲 next | no tests exist yet; the deterministic core is the target |
| Phase 2 — the second game | 🟡 подготовлена | Oblivion Remastered: инвентарь снят, манифест на 168 модов исполняется движком; ждёт патча и установки игры |
| Phase 3 — compatibility | 🔲 todo | needs a research doc first |
| Phase 4 — optimization presets | 🔲 todo | |

---

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
- [ ] **Round-trip check for the archive naming scheme** — `libraryName()` writes it, `parseArchive()`
      reads it; they must agree. Pure functions, no network, no disk. This is the single most exposed
      pair in the codebase. **Схем теперь две** (своя и Nexus-download, `EXP-0018`) — круговой ход
      проверяется для своей, разбор чужой — по образцам из библиотеки Oblivion. Идёт ПОСЛЕ гарда.
- [ ] **Cases for `sameFile`/`stamp` and `pickCard`** — upload-date comparison rounded to the minute;
      variant selection between Steam/Gamepass, Capped/plain, presets. Pure, autonomous.
- [ ] **A fixture pack** (throwaway `modpack.json` + zero-byte correctly-named archives, built under the
      scratchpad, never in the repo) driving `check --json`, `-ListMods` and `-Deploy -DryRun` with no
      network and no game installed.
- [ ] **Close the packaging drift** — `package.json` `"files"` ships `kumm.mjs` without
      `Deploy-ModPack.ps1`, so `npm i -g` delivers half the engine. Verify with `npm pack --dry-run`.
- [ ] **A real `help` command** — the switch block, the header comment (lines 18–28) and the README
      table are three hand-maintained copies of one list. One source, the rest generated or checked.
- [ ] **`kumm status` after `close`** — confirm it reports cleanly rather than throwing; cheap, and it
      is the command a session runs first.
- [ ] **Warn when a mod overrides `Engine.ini` at runtime** — the 15 Aug regression was invisible to the
      engine: deploy verified every file and still shipped a build whose graphics a Lua mod rewrote in
      the world. A cheap first cut needs no game running: scan each mod's source for `[SystemSettings]`
      or `r.*=` assignments and report which of them collide with the pack's `Engine.ini`. This is the
      concrete, autonomous slice of Phase 3 (`MASTER_PLAN.md`) — conflicts reported before launch.

---

## ❓ Awaiting human review (interviews / homework)

> Decisions the agent must not make alone (brand/UX/architecture), or actions only the human can do
> (test on real hardware, external accounts). Filed in `interviews/` and `homeworks/`.

- *(none open)* — the one identity question of the KAIF deployment (canonical name) was answered:
  **KUMM**, 2026-08-15.
- 🎮 **НЕ ПРОВЕРЕНА правка `pal.Foliage.RegisterInstances.TimeSlicing=0`.** Раскатана 15.08.2026, но
  владелец не смог протестировать: он на удалённом доступе, интернет слабый, нативной картинки не видит.
  Это ЕДИНСТВЕННАЯ правка дня, бьющая прямо в механизм «трава растёт перед носом» (справка игры:
  «0 = add all pending instances immediately»). **Первое, что нужно спросить у владельца в следующем
  чате.** Вопрос ровно один: дорастает ли трава на глазах. Цена, если пойдёт не так: работа,
  размазанная по тикам, соберётся в один → возможен рывок при въезде в чанк; тогда вернуть 1 и
  поднимать `pal.Foliage.RegisterInstances.BatchSize`.
- ⏳ **`LoadingRange` стоит на ванильных 25600, и владелец не назвал, на что возвращать.** Путь за день:
  153600 → 76800 → 51200 → 38400 → 25600. Последние два шага **не дали ничего измеримого** по
  `CPU busy`, а горизонт уплощили. Варианты, которые предлагались: 51200 или 76800. Правится в ДВУХ
  файлах: `UltraGraphics/config.lua` → `LoadingRange` и `HLODLoadingRange/Scripts/config.lua` → `Range`.
- 🎮 **Консоль в игре не открывается**, хотя `ConsoleKeys=Tilde,F10` прописаны в `Engine.ini` и
  `ConsoleEnablerMod` включён в `mods.txt`. С рабочей консолью проверка гипотезы занимает секунды
  вместо цикла «правка → деплой → перезапуск». Стоит починить ПЕРВЫМ делом — половина блужданий
  15.08 была бы не нужна.
- 🗺️ **Две строки мод-листа Oblivion не сопоставлены с архивами** (`modpack.json` → `$unresolved`).
  «Костры наносят урон всем, не только игроку» — id 1701 отдаёт два файла (`Camp fire damage` и
  `Not so deadly trap`), какой из них эта строка, по именам не видно. «Локальная карта в высоком
  разрешении» — кандидат `Ultra Quality 4K All World Maps` (id 2020), но тот про карты мира.
  Догадку не писали намеренно: в сборку молча уехал бы не тот мод. Спросить, когда дойдут руки
  до отбора модов, — до патча это не срочно.
- 🎨 **Двух решейдов из мод-листа в библиотеке нет вовсе** — `Project O` и `BloodyFreak's Reshade`;
  качать заново, ссылок владелец не оставил.
- 🧰 Anything needing a real Nexus login, a real game install, or the owner's own mod pack is his to
  run — the agent can build the fixture path but cannot verify the live path alone.

---

## Where to continue next session

> A concrete checklist so the next session (empty context) can start immediately: which files, which
> commands, what to verify first.

**If the owner is here and wants engine work** (the project's own roadmap, Phase 1):

1. `git log --oneline -5` and `git status`. There is no build; `node --check kumm.mjs` is the syntax gate.
2. Take the first autonomous-backlog item (the naming-scheme round trip). Plan it with `/plan-task` —
   it is ordinary, not heavy.
3. The functions live in `kumm.mjs`: `parseArchive` (line 450), `libraryName` (412), `sameFile`/`stamp`
   (541–543), `pickCard` (548), `parseArgv` (59), `globToRe` (447).
4. Decide the check runner BEFORE writing checks — the project has zero dependencies and that is a
   design constraint (`MASTER_PLAN.md` → Guiding principles). `node:test` + `node --test` is built in
   and costs nothing; anything requiring an install is an interview question, not an agent decision.
5. Never loop live Nexus calls while testing (`AGENT_GUIDE.md` → "Live-path rule").

**Если вышел патч Oblivion Remastered** — весь порядок действий лежит в `README.md` сборки
(`D:\work\ai_sandbox\OblivionRemastered`), семь шагов. Коротко: `kumm check --root <сборка>` из
удалённой папки движка (игра для сверки не нужна), читать вывод как список КАНДИДАТОВ, качать
выборочно по id — `kumm update` без аргументов возьмёт все 168 модов и флаг `enabled` не посмотрит.
Начинать с загрузчиков: они привязаны к версии экзешника и ломаются патчем первыми.

**Если владелец вернулся с игрой** (производительность, тени, латентность) — теперь есть ПЛАН:
**`plans/01_cpu_gt_panorama.md`** (лестница разгрузки игрового потока на панорамах, создан 21.08 по
просьбе владельца — `ideas/01_cpu_ue5_optimisation.md`). Ступень 1 применена в пак и в обе живые
копии (config.lua мода + Engine.ini в LOCALAPPDATA) 21.08: `r.SkeletalMeshLODBias` -1 → 0, фантом
`wp.Runtime.AsyncWorldPartitionSpatialHashStreaming` удалён. **[NOT-TESTED в игре]** — первая
сессия владельца: вопрос про траву (ниже), вердикт по дальним палам, замер панорамы, ступень 0
плана (консоль, stat unit, пробинг pal.*). Пять пунктов ниже — по-прежнему обязательное чтение.

6. **Сначала два документа, потом руки.** `games/Palworld/README.md` — досье сборки (железо, панель
   4K@144, замеренная база, чему нельзя верить в собственных цифрах). `researches/ue5-cvars/` —
   конспект по cvar-ам UE5, девять разделов; там же пять правил пользования. **И `README.md` самого
   пака** (`D:\work\ai_sandbox\Palworld`, 89 КБ) — в нём разобраны прошлые артефакты с таблицами
   тестов. 15.08 агент правил тени, не открыв раздел про тени, и предложил владельцу как свежую
   гипотезу тест, закрытый 31.07.
7. **Проверь, ТОТ ЛИ ЭТО СЛОЙ, прежде чем крутить значение.** У Palworld своя подсистема листвы:
   `grass.*` к ней не относятся вовсе (`EXP-0017`). И сверяй имена **пересобранным**
   `_config/cvars-registered.txt` (4668 имён): старый не содержал ни одного из 75 `pal.*` и выдавал
   уверенные ложноотрицательные ответы (`EXP-0016`). Позитивный контроль:
   `grep -ci '^pal\.' _config/cvars-registered.txt` → 95 (75 строчных `pal.*` + 20 `Pal.*`).
8. **Где cvar-ы работают.** `[SystemSettings]` в `Engine.ini` до сцены **доезжает** (доказано прибором);
   `[ConsoleVariables]` и `[/Script/Engine.RendererSettings]` — нет. Рабочее место для правок —
   блок `CVars` в `_unpacked/UltraGraphics/config.lua`, он применяется в загруженном мире и переживает
   фаст-тревел. **Прибор:** мод пишет `UltraGraphics_CVarOriginalValues.txt` — значения, которые застал
   ПЕРЕД перезаписью. Сверять и ВРЕМЯ файла. Правило прибора: значения по обе стороны должны
   ОТЛИЧАТЬСЯ, иначе гипотезы неразличимы (`EXP-0013`).
9. **Как мерить.** Intel PresentMon 2.5.1 (тонкий CLI; если пропал — заново с GitHub). Своё имя
   ETW-сессии обязательно: соседний KAGO снимает ту же игру под `kago-pw2`. Останавливать
   `logman stop <name> -ets`, никогда не `Stop-Process` по маске (`EXP-0008`). Читать медианы и
   перцентили, не средние (`EXP-0011`). **При включённой генерации базу мерить нельзя вообще:**
   PresentMon не метит кадры DLSS-G (`EXP-0010`), а `MsBetweenPresents` даёт бессмыслицу — в замере
   15.08 «медиану 150 к/с» при лимите 141. База читается только с оверлея NVIDIA.
10. **Сначала выясни, во что упирается сцена.** Разбивка захвата по полосам частоты 15.08: на панораме
    (25–45 к/с) `CPU busy` 28.1 мс против `GPU busy` 6.2 — **игра упирается в игровой поток**, и
    снижение разрешения там не помогает. Ryzen 7 5700G, мир грузится в один поток; распараллелить
    игровой поток нельзя, движок уже параллелен там, где умеет.
    **База для сравнения** (DLSS Performance, генерация ВЫКЛЮЧЕНА, смешанный заход): медиана
    83 настоящих кадра · 1% low 25.6 · `CPU busy` p50 10.3 / p95 55.4 · `GPU busy` p50 3.2 / p95 46.5.
    Захваты лежат в скретчпаде сессии 15.08 (`capture-*.csv`), скрипт разбора — `analyze.py` там же.
11. **Неразобранный пласт CPU-рычагов** (`pal.CustomURO.*`, `pal.ParallelAnimationUpdateTask`,
    `pal.BuildObjectPhysicsBudget.*`, `pal.ObjectCollector.UseSpatialGrid`,
    `pal.SignificanceManager.EnableSort`) — теперь ступень 2 плана `plans/01_cpu_gt_panorama.md`,
    с процедурой пробинга дефолтов прибором мода. Начинать оттуда, а не с движковых `r.*`.
12. **Дисциплина, которой 15.08 не хватило:** одно изменение за заход. За день трижды менялось по
    десять-двенадцать строк, и каждый раз результат оказывался неатрибутируемым; один раз это стоило
    возвращённого артефакта и часа работы.

---

## Open bugs

*(none in the project's own code)* — the known defect worth filing when someone picks it up is the
packaging drift: `package.json` `"files"` omits `Deploy-ModPack.ps1`, so `npm i -g kumm` installs the
Nexus half without the deploy half (verified: `npm pack --dry-run` → 4 files, 15.2 kB).

Framework tickets (not this project's code, kept visible until an update retires them):
- 🟡 `bugs/KAIF/01_package_json_reformatted_wholesale.md` — the `kaif:*` wiring re-serializes the whole
  `package.json`; 24 of 31 diff lines are whitespace-only. Semantically empty, accepted locally, filed
  upstream as [KAIF#16](https://github.com/MikalaiKryvusha/KAIF/issues/16). Expect it again at the next
  `/kaif-update`.
- The install's own field report went upstream as
  [KAIF#17](https://github.com/MikalaiKryvusha/KAIF/issues/17); the placeholder-gate rake was a known
  signal and got a +1 observation on [KAIF#3](https://github.com/MikalaiKryvusha/KAIF/issues/3) rather
  than a duplicate ticket.
