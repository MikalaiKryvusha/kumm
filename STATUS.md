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

> Подготовка Oblivion Remastered к патчу (15.08) закрыта и перенесена в `PROJECT_HISTORY.md`;
> порядок действий на день патча — `README.md` сборки (`D:\work\ai_sandbox\OblivionRemastered`).

### Ночная сессия Palworld, 2026-08-21 ~00:30–02:00 +03:00 — ❌ закрыта злым владельцем

Первый заход владельца в игру после 15.08. Ожидались проверки ступени 1 плана 01 — вместо этого
**игра оказалась сломана: 8–16 к/с** (медиана кадра ~61 мс) с первого же захода, до любых правок
на лету. Вся сессия ушла на диагностику; причина НЕ найдена; владелец закрыл чат словами «ты
сломал мне игры». Полный разбор и путь продолжения — эстафета ниже; уроки — `EXP-0019..0021`.

Что сделано и осталось в паке (закоммичено): **мод ConsoleBridge** — файловая консоль для агента
(команды + чтение живых cvar-ов без владельца; `EXP-0020`) · `TimeSlicing` возвращён к ванильной 1
(его цена «рывок при въезде в чанк» сработала дословно, но приговор строке НЕ вынесен — правка
делалась до читающего моста) · инструменты замера в скретчпаде 21.08 (analyze.py, correlate.py,
shot.ps1, focuslog.ps1).

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
- 🔴 **ГЛАВНОЕ, ПЕРВОЕ И ЕДИНСТВЕННОЕ ИГРОВОЕ ДЕЛО: Palworld идёт 8–16 к/с (21.08), причина не
  найдена.** Владелец зол и закрыл чат. НЕ предлагать ему графических правок, пока это не решено, —
  все замеры в больном состоянии меряют болезнь, а не правку (`EXP-0019`). План атаки — в эстафете.
- ✅ закрыт вопрос про `TimeSlicing=0` (15.08): цена «рывок при въезде в чанк» сработала — «жуткие
  фризы» в первом же заходе 21.08. Возвращён к ванильной 1 в config.lua (пак+игра, закоммичено).
  Оговорка: 8–16 к/с он НЕ объяснял (после возврата не изменилось ничего), приговор строке не
  вынесен — она просто вернулась к известному состоянию.
- ⏳ **`LoadingRange` стоит на ванильных 25600, и владелец не назвал, на что возвращать.** Путь за день:
  153600 → 76800 → 51200 → 38400 → 25600. Последние два шага **не дали ничего измеримого** по
  `CPU busy`, а горизонт уплощили. Варианты, которые предлагались: 51200 или 76800. Правится в ДВУХ
  файлах: `UltraGraphics/config.lua` → `LoadingRange` и `HLODLoadingRange/Scripts/config.lua` → `Range`.
- 🎮 **Консоль в игре не открывается** — но это больше НЕ блокер: 21.08 построен обходной путь,
  мод **ConsoleBridge** (файловая консоль: команды + чтение живых значений, `EXP-0020`). Сам дефект
  остаётся: лог показывает, что ConsoleEnablerMod регистрирует Tilde/@/^/F10, то есть проблема на
  стороне ВВОДА (удалёнка/перехват клавиш), не мода. Чинить — низкий приоритет при живом мосте.
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

**Если владелец вернулся с игрой — сначала РЕГРЕССИЯ 8–16 к/с (ночь 21.08), всё остальное потом.**
План `plans/01_cpu_gt_panorama.md` ЗАМОРОЖЕН до её решения (его база 15.08 снималась в здоровом
состоянии; ступень 1 применена и стоит: `SkeletalMeshLODBias=0`, фантом удалён — оба возврат к
ванили, к регрессии отношения не имеют: она была и после пола ВСЕХ настроек).

Что уже известно про регрессию (все пункты — замеры, не мнения; уроки `EXP-0019..0021`):
- Кадр ~61 мс. Карта: 96–103 % **3D-очереди**, 260 Вт, 2812 МГц, троттлинга нет, заводское
  состояние подтверждено соседом KAGO. Q2RTX на этой же карте накануне дал свою таблицу →
  **система здорова, болен Palworld**.
- Исключено замерами: фон/фокус · чужие процессы · пиксельная работа (ScreenPercentage 25 → ХУЖЕ,
  9 к/с) · весь набор пака (пол по всем строкам → 9 к/с) · Niagara-глушилка · перегрев.
  Единственный сдвиг: `r.DynamicGlobalIlluminationMethod 0` + `ReflectionMethod 0` → 8→13 к/с.
- ShowFlag-канал в шиппинге МЁРТВ (`EXP-0021`) — «оправдания» тени/листва/меши недействительны.
- Оверлей NVIDIA в момент болезни: DLSS SR «Предустановка L, Производительность (50%)», генерация
  выкл, LAT 207–255 мс. Игра шла В ОКНЕ бОльшую часть замеров (тракт Composed/Independent Flip —
  сравнивать режимы окна раздельно).

Порядок атаки на следующую сессию (по убыванию подозрения):
1. **Замещение DLSS в NVIDIA App** — владелец в эту ночь выключал там генерацию; «Предустановка L»
   (драйверный трансформер) стояла во время всех больных замеров. Попросить владельца поставить
   «Использовать настройку 3D-приложения» для SR — один клик — и снять один кусок PresentMon.
2. **Полноэкранный vs окно** — все чистые замеры ночи сняты в окне; пересдать базу в полном экране.
3. **Перезагрузка машины** — за ночь её ни разу не делали; дешёвый способ снять хвосты драйвера.
4. **Шейдерный кэш** — `%LOCALAPPDATA%\Pal\Saved\<...>` и кэш драйвера; пересборка PSO объясняет
   долгую 100 % загрузку 3D-очереди при любых настройках.
5. Обновления Windows/драйвера с 15.08 — `Get-HotFix | Sort InstalledOn`, панель NVIDIA.
Инструменты готовы: мост ConsoleBridge (`EXP-0020` — Repro-строка), PresentMon в `_tools/`
(своё имя сессии + `--stop_existing_session`, куски по 20 с), analyze.py/correlate.py/shot.ps1 в
скретчпаде 21.08. Пять пунктов ниже — по-прежнему обязательное чтение.

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
