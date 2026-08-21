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

> v0.1.0 (the two halves) и развёртывание KAIF 2.2 закрыты, лежат в `PROJECT_HISTORY.md`.
> Три графические сессии Palworld 15.08 и подготовка Oblivion Remastered — там же.

### 🟢 Регрессия Palworld ЗАКРЫТА, 2026-08-21 (дневная сессия 09:00–10:30 +03:00)

«8–16 к/с и жуткие фризы», не решённое за ночь, разобрано до конца. Болезней было **две, они
независимы, и ночью их принимали за одну** — отсюда и неразрешимость.

| # | Болезнь | Причина | Лечение | Результат |
|---|---|---|---|---|
| 1 | Фризы во ВСЕХ рисующих приложениях (Palworld, Quake2RTX, видеоплеер) | Уборка диска C 18.08 удалила `%LOCALAPPDATA%\NVIDIA`; драйвер поднялся с повреждённым глобальным профилем и гнал свою работу в поток рендера приложения | Панель управления NVIDIA → Управление параметрами 3D → Глобальные параметры → **Восстановить** | Quake: потеряно времени **44.7 % → 7.3 %**, 1 % low **4.0 → 37.5 к/с** |
| 2 | Низкий кадр на панораме в Palworld | `r.ViewDistanceScale=2.6` в `UltraGraphics/config.lua` — стоимость **геометрическая**, поэтому глуха к разрешению и к `Engine.ini` | **1.0** по решению владельца, применено в пак и в игру 21.08 10:15 | **15.6 → 53.3 к/с**, GPU busy 63 → 18.6 мс |

Полный разбор с числами, отсеянными версиями и хронологией — `PROJECT_HISTORY.md`, запись
«Дневная сессия Palworld, 2026-08-21». Уроки — `EXP-0022..0026`.

**Инструменты замера вынесены из скретчпада** в `D:\work\ai_sandbox\_tools\perf-harness\`
(свой README, шесть скриптов, 15 захватов сессии). Дважды подряд харнесс умирал вместе с чатом —
больше не умрёт. **Читать его README перед любым разговором о производительности.**

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
- [ ] **Warn when a mod overrides `Engine.ini` at runtime** — обе болезни 21.08 были невидимы движку:
      деплой сверил каждый файл и всё равно отгрузил сборку, чью графику Lua-мод переписывает в мире.
      Дешёвый первый срез не требует запущенной игры: просканировать исходники модов на
      `[SystemSettings]` и присваивания `r.*` и доложить, какие из них сталкиваются с `Engine.ini` пака.
      **Свежий довод из практики:** `r.ViewDistanceScale` живёт в ЧЕТЫРЁХ местах с ТРЕМЯ разными
      значениями (мод 1.0, `_config/Engine.ini.SystemSettings-tuned.ini` 2.6,
      `_config/Krinik-Palworld-UE5-Engine.ini` 2.2), и побеждает мод. Это конкретный автономный
      кусок Phase 3 (`MASTER_PLAN.md`).

---

## ❓ Awaiting human review (interviews / homework)

> Decisions the agent must not make alone (brand/UX/architecture), or actions only the human can do
> (test on real hardware, external accounts). Filed in `interviews/` and `homeworks/`.

- 🌿 **ДОЛГ ПО ТРАВЕ — первое игровое дело следующей сессии.** `ViewDistanceScale` срезан 2.6 → 1.0,
      и он **тянет за собой дальность травы**. В августе такой срез (до 2.0) владелец отверг словами
      «трава опять растёт близко перед носом», трава им защищена: «траву не трогай». Развязка
      предложена, но НЕ проверена: оставить дальность 1.0 и вернуть траву отдельно через
      `grass.CullDistanceScale` (сейчас 6), поднимая ступенями и меряя цену каждой. **Судья — владелец,
      у агента для травы нет глаз** (класс вкуса, `AGENT_GUIDE.md`). Процедура: он стоит на утёсе,
      агент шлёт ступень через мост и меряет `felt.py`, он говорит, когда трава стала как надо.
- 🎬 **Настройки OBS слетели от той же уборки.** Владелец обнаружил это 21.08. Карантин уборки лежит
      в `F:\_QUARANTINE_C` (создан 17.08 23:35), тулза перемещала, а не удаляла, и рядом есть
      `Restore-Quarantine.ps1`. **Разбор запущен рабочим процессом в конце сессии и не дочитан** —
      начать следующую сессию с него (ниже, «Где продолжить», пункт 1).
- 🖥️ **Конспект по настройке NVIDIA App заказан владельцем** 21.08 («сделай разведку в сети и
      конспект, как настроить более оптимально»). Рабочий процесс запущен, результат должен лечь в
      `researches/nvidia-tuning/README.md`. Проверить, дописался ли файл.
- ⏳ **`LoadingRange` стоит на ванильных 25600, и владелец не назвал, на что возвращать.** Путь за день:
      153600 → 76800 → 51200 → 38400 → 25600. Последние два шага **не дали ничего измеримого** по
      `CPU busy`, а горизонт уплощили. Варианты, которые предлагались: 51200 или 76800. Правится в ДВУХ
      файлах: `UltraGraphics/config.lua` → `LoadingRange` и `HLODLoadingRange/Scripts/config.lua` → `Range`.
- 🗺️ **Две строки мод-листа Oblivion не сопоставлены с архивами** (`modpack.json` → `$unresolved`).
      «Костры наносят урон всем, не только игроку» — id 1701 отдаёт два файла (`Camp fire damage` и
      `Not so deadly trap`), какой из них эта строка, по именам не видно. «Локальная карта в высоком
      разрешении» — кандидат `Ultra Quality 4K All World Maps` (id 2020), но тот про карты мира.
      Догадку не писали намеренно. Спросить, когда дойдут руки до отбора модов, — до патча не срочно.
- 🎨 **Двух решейдов из мод-листа в библиотеке нет вовсе** — `Project O` и `BloodyFreak's Reshade`;
      качать заново, ссылок владелец не оставил.
- 🎮 **Консоль в игре не открывается** — НЕ блокер: работает мост ConsoleBridge (`EXP-0020`). Лог
      показывает, что ConsoleEnablerMod регистрирует Tilde/@/^/F10, то есть проблема на стороне ВВОДА,
      не мода. Чинить — низкий приоритет.
- 🧰 Anything needing a real Nexus login, a real game install, or the owner's own mod pack is his to
      run — the agent can build the fixture path but cannot verify the live path alone.

---

## Where to continue next session

> A concrete checklist so the next session (empty context) can start immediately: which files, which
> commands, what to verify first.

**Первым делом — два незакрытых хвоста 21.08:**

1. **Разбор уборки диска C.** Владелец: «настройки OBS слетели, может на диске F есть бекап?»
   Карантин — `F:\_QUARANTINE_C`, тулза — `D:\work\ai_sandbox\KRINIK_AI_DISK_CLEANUP_TOOL\`
   (логи прогона 17.08 в `reports/`, манифесты в карантине, `Restore-Quarantine.ps1 -List`).
   В манифесте ТРИ класса записей, и восстановимы не все: `move` вернётся, `delete-*` удалено
   насовсем, `native` (штатные команды вендоров) отката не имеет. Рабочий процесс `cleanup-forensics`
   был запущен в конце сессии — проверить, дописался ли его результат, иначе повторить разбор.
   **Ничего не восстанавливать без слова владельца.**
2. **Конспект по NVIDIA.** Проверить `researches/nvidia-tuning/README.md` — рабочий процесс
   `nvidia-tuning-recon` должен был его написать. Если файла нет или он куцый — доделать.

**Если владелец за игрой — трава (см. «Awaiting human review», первый пункт).** Это единственное
незакрытое игровое дело; всё остальное по регрессии закрыто.

**Как мерить — обязательное чтение перед любым замером:**
`D:\work\ai_sandbox\_tools\perf-harness\README.md`. Коротко, но не вместо него:
- `felt.py` смотреть ПЕРВЫМ — абсолютные пороги. Относительный порог «2× от медианы» прячет рывки
  тем сильнее, чем хуже идёт игра, и агент на этом уже соврал владельцу (`EXP-0026`).
- Значение cvar-а сверять мостом **ДО и ПОСЛЕ** каждого захвата: `UltraGraphics` переприменяет весь
  свой блок при входе в мир, открытии карты и фаст-тревеле.
- Одно изменение за заход. PresentMon — своё имя ETW-сессии (сосед KAGO снимает ту же игру).
- Закрывать игру `CloseMainWindow()`, не `Stop-Process` — сохранение успевает записаться (проверено
  дважды: метка файла совпадает с моментом выхода).
- Агенту разрешено самому запускать и закрывать Palworld (слово владельца, 21.08). Меню он прокликать
  не может — экран агент видит только через `shot.ps1`, и на 4K с масштабом 300 % это неудобно.

**Если владелец хочет работу по движку** (Phase 1):
1. `git log --oneline -5` и `git status`. Сборки нет; `node --check kumm.mjs` — синтаксический гейт.
2. Взять первый пункт автономного беклога (запуск-гард), спланировать через `/plan-task`.
3. Функции живут в `kumm.mjs`: `parseArchive` (450), `libraryName` (412), `sameFile`/`stamp`
   (541–543), `pickCard` (548), `parseArgv` (59), `globToRe` (447).
4. Раннер проверок выбрать ДО написания проверок — у проекта ноль зависимостей, и это проектное
   ограничение (`MASTER_PLAN.md`). `node:test` встроен и ничего не стоит.
5. Никогда не гонять живые вызовы Nexus в цикле (`AGENT_GUIDE.md` → Live-path rule).

**Если вышел патч Oblivion Remastered** — порядок действий в `README.md` сборки
(`D:\work\ai_sandbox\OblivionRemastered`), семь шагов. Начинать с загрузчиков: они привязаны к версии
экзешника и ломаются патчем первыми.

**Досье и справочники по Palworld** (не пересказываю — там детали): `games/Palworld/README.md`
(железо, панель 4K@144, замеренная база) · `researches/ue5-cvars/` (конспект по cvar-ам UE5) ·
`README.md` самого пака (`D:\work\ai_sandbox\Palworld`, 89 КБ, разобраны прошлые артефакты) ·
`plans/01_cpu_gt_panorama.md` (лестница разгрузки игрового потока; **разморожен** — база 15.08 больше
не под вопросом, ступень 2 можно брать в работу).

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
