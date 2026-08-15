# EXPERIENCE — the agent's accumulated experience

> The agent's growing log of lessons. **Externalized memory of *what works and what doesn't*** — so a
> fresh, context-less session (or an autonomous loop) never repeats a dead end. Consult it BEFORE a task;
> append to it AFTER a meaningful attempt (success **or** failure). Grep, don't scroll.
>
> **Tags live inline on every entry** (not in a central list) — so one grep finds the experiences directly:
> `grep '#loop' EXPERIENCE.md` · `grep -i '#context\|#build' EXPERIENCE.md` · `grep '❌' -A4 EXPERIENCE.md`
> · `grep 'EXP-0007' EXPERIENCE.md`. Reuse an existing tag where one fits (grep to see what's in use).
>
> **Entry format (keep it short and grep-friendly).** Newest on top. Every entry starts with a stable id,
> an ISO date, an outcome marker (`✅` / `❌` / `❌→✅`), and inline `#tags`:
>
> ```
> ### EXP-0001 · 2026-01-01 · ✅ · #tag #area
> **Context:** one line — what was being done.
> **Tried / did:** the approach, briefly.
> **Result:** ✅/❌ — what happened.
> **Lesson:** the reusable takeaway (the reason this entry exists).   → link: bugs/NN · ideas/NN · plans/NN
> **Repro:** the ready-to-run command/check that verifies or applies the lesson — a weak session
>   executes a pasted command reliably, an essay it won't act on. REQUIRED since 2.1: a lesson
>   with no Repro line is not accepted (field-proven: lessons with a Repro command get executed,
>   essay-lessons get read and ignored). If the lesson genuinely has no command, say what to
>   OBSERVE instead — but say it as an action.
> **Trigger:** for class-level lessons — the decision point that must invoke this lesson, as
>   "writing X → run Y" (the lesson names WHERE it applies, instead of hoping to be remembered).
> **Not for:** the lesson's validity range — where it does NOT apply. A documented lesson is still a
>   hypothesis; applied outside its range it kills good ideas.
> ```
>
> **A lesson that repeats is a lesson that failed as text.** When the same class recurs in NEW code
> after its entry was recorded, the journal has proven insufficient — the lesson MUST become
> executable (a linter rule, a guard, a gate), and the entry gains the line
> `mechanized: <the tool>`. Two strikes → a mechanism, never a third reminder.
>
> The `#tags` are **trigger-tags**: before a task, grep by the task's tags and QUOTE the relevant
> lessons in your report (id + one line) — or state "no relevant lessons". An unquoted recall is
> unverifiable; `/fable-judge` checks for this line.
>
> Skill: `/experience` (capture a lesson · recall relevant lessons).

## Entries

### EXP-0009 · 2026-08-15 · ❌→✅ · #diagnosis #method #falsenegative #palworld
**Context:** охота на мерцание теней в Palworld. Гипотезы проверялись правкой `Engine.ini` →
деплой → заход владельца в игру. Четырнадцать заходов, до трёх ночи.
**Tried / did:** проверил через ini семь одиночных cvar-ов и две пачки. Все дали «не виновен».
Виновник нашёлся сразу, как только те же значения стали проверяться внутри рантайм-блока мода.
**Result:** ❌→✅ — все четырнадцать «не виновен» были ЛОЖНЫМИ: Palworld при входе в мир затирает
часть `Engine.ini` своими настройками, и проверяемые строки до сцены не доживали. Инструмент
проверки молча не работал, а его отрицательный ответ выглядел как знание.
**Lesson:** **отрицательный результат проверяет инструмент, а не только гипотезу.** Два-три
«не виновен» подряд по разным, независимым гипотезам — это сигнал, что не работает ПРОВЕРКА, и
дальше надо валидировать её, а не перебирать дальше. Валидация делается позитивным контролем:
взять заведомо действующее значение (у нас — весь блок мода целиком) и убедиться, что канал
вообще доносит изменения до наблюдаемого. Здесь позитивный контроль был доступен с самого начала
и был выполнен только на десятом заходе. Отдельно: знание о затирании лежало в манифесте пака
(комментарий к `ForceLumenGI`) и было прочитано в первый час — прочитать и применить снова
оказались разными действиями ([[EXP-0004]] про то же).   → link: pack commit `bad98f2`…`HEAD`
**Repro:** прежде чем верить «не виновен», применить заведомо работающее изменение тем же каналом
и увидеть эффект. Нет эффекта — канал мёртв, все прошлые отрицательные ответы аннулируются.
**Trigger:** второй подряд «не подтвердилось» по независимым гипотезам → проверять канал, не гипотезы.
**Not for:** случаи, где канал уже подтверждён позитивным контролем в этой же сессии.

### EXP-0008 · 2026-08-15 · ❌→✅ · #etw #presentmon #tooling #neighbours
**Context:** снять телеметрию FPS в забеге владельца через PresentMon.
**Tried / did:** запускал захват, он молча выходил с кодом 1 — без единой строки даже в чистый
stderr. Диагностику испортил дважды: сначала `2>&1` в PowerShell 5.1 (заворачивает stderr нативного
exe в ErrorRecord и глотает текст), потом `Stop-Process` по МАСКЕ `PresentMon*` — а на машине в этот
момент работали чужие захваты: системный NVIDIA FrameView и соседний проект KAGO с сессией `kago-pw2`.
**Result:** ❌ полчаса на инструмент → ✅ после трёх находок. Первая: `PresentMon_x64.exe` из
NVIDIA FrameViewSDK — служебная сборка под свой сервис, как standalone не работает; рабочий вариант —
тонкий CLI Intel с GitHub (0.9 МБ, подпись Intel). Вторая: **ETW-сессия переживает смерть процесса** —
после `Stop-Process` она остаётся `Running`, и следующий запуск с тем же именем падает молча;
закрывается `logman stop <name> -ets`. Третья: одна машина — несколько агентов, поэтому имя сессии
должно быть своим (`--session_name kumm-pm`), а `--stop_existing_session` глушит ЧУЖОЙ захват.
**Lesson:** на общей машине инструмент выбирает себе пространство имён и никогда не убивает процессы
по маске — только по PID, сверенному с `CommandLine`. Молчаливый выход нативного exe в PowerShell —
почти всегда проглоченный stderr, а не отсутствие ошибки.
**Repro:** `logman query -ets | Select-String 'Present|kumm|kago'` — показывает, чьи захваты живы;
`Get-CimInstance Win32_Process -Filter "Name='X.exe'" | ? CommandLine -match 'моя-сессия'` — мой ли это.
**Trigger:** запуск любого ETW-инструмента (PresentMon, xperf, wpr) → своё `--session_name` + проверка
`logman query -ets` до и после.
**Not for:** инструменты без ETW — там `Stop-Process` действительно достаточно.

### EXP-0007 · 2026-08-15 · ✅ · #ue5 #cvar #diagnosis #speed
**Context:** охота на мерцание теней: каждая проверка стоила цикла «правка ini → деплой → перезапуск
игры → дойти до места», то есть минут десять владельца за одну гипотезу.
**Tried / did:** вместо этого — консоль UE (у сборки она привязана: `ConsoleKeys=Tilde,F10`), где
cvar применяется МГНОВЕННО: стоя на месте артефакта, гипотезы перебираются по одной строке за секунды.
**Result:** ✅ цикл проверки сжался с ~10 минут до ~10 секунд, и все гипотезы проверяются в ОДНОЙ
сессии, при одном времени суток и одной сцене — то есть ещё и чище по условиям.
**Lesson:** ini — это способ ЗАКРЕПИТЬ найденное, а не способ его ИСКАТЬ. Ищут в консоли, в живой
сцене, по одному cvar-у; в файл едет уже победитель. Заодно консоль без значения печатает ТЕКУЩЕЕ
значение — единственный честный способ узнать, доехала ли строка ini до движка (секций в файле
несколько, и не все из них применяются).
**Repro:** в игре `~` → `r.Shadow.Virtual.Enable` (покажет живое значение) → `r.Shadow.Virtual.Enable 0`
(применится сразу).
**Trigger:** гипотеза о влиянии cvar-а на картинку → сначала консоль в живой сцене, потом ini.
**Not for:** cvar-ы, читаемые только при старте движка (RHI, DefaultGraphicsRHI, ConsoleKeys) — их
консолью не проверить, там цикл через перезапуск неизбежен.

### EXP-0006 · 2026-08-15 · ✅ · #palworld #mods #config #regression
**Context:** после деплоя средний FPS упал со 120 до 80. Подозрение падало на игровую погоду.
**Tried / did:** не гадал по симптому, а нашёл ЗАПИСЬ самого мода: Ultra Graphics 1.2.2 кладёт рядом
с конфигом `UltraGraphics_CVarOriginalValues.txt` — список значений, которые он перебил. Сверил его с
`Engine.ini`, с авторскими комментариями в `config.lua` и с `_config/Pareto-audit.md`.
**Result:** ✅ — 26 cvar-ов тюнинга были перезаписаны рантайм-блоком, которого в прошлой версии мода
не существовало (старый `Scripts/config.lua` — 246 строк, ни одного cvar-а).
**Lesson:** Lua-мод применяет cvar-ы ПОСЛЕ `Engine.ini` и потому всегда сильнее его. Обновление мода —
это потенциальная тихая правка графики сборки, а не только нового кода. Прежде чем объяснять просадку
внешними причинами (погода, драйвер, троттлинг), ищи, не оставил ли мод собственный протокол того, что
он изменил.   → link: pack commit `bc892d8` · `_config/Pareto-audit.md`
**Repro:** `Get-ChildItem <game>\Pal\Binaries\Win64\ue4ss\Mods -Recurse -Filter '*OriginalValues*'` —
непустой файл означает, что мод перебивает конфиг сборки прямо сейчас.
**Trigger:** обновление любого графического мода → после первого запуска сверить этот файл с `Engine.ini`.
**Not for:** pak-моды и моды без рантайм-доступа к консоли — они `Engine.ini` перебить не могут.

### EXP-0005 · 2026-08-15 · ❌→✅ · #windows #probe #hardware
**Context:** проба окружения — сколько VRAM у карты.
**Tried / did:** `Get-CimInstance Win32_VideoController` → `AdapterRAM` = 4 GB на RTX 5070 Ti.
**Result:** ❌ — поле 32-битное и переполняется, у любой карты >4 ГБ оно упирается в 4 ГБ. Реальные
16303 MiB показал `nvidia-smi` в той же пробе.
**Lesson:** у пробы окружения тоже есть цена доверия: WMI-поле может быть не «неточным», а структурно
неспособным вернуть правду. Для VRAM источник — `nvidia-smi`, WMI годится только на имя адаптера.
**Repro:** `nvidia-smi --query-gpu=name,driver_version,memory.total,power.limit --format=csv,noheader`
**Trigger:** любая проба «сколько памяти у GPU» → nvidia-smi, а не WMI.
**Not for:** машины без NVIDIA — там придётся мириться с WMI и помечать факт как приблизительный.

### EXP-0004 · 2026-08-15 · ❌→✅ · #shell #windows #crossshell #git
**Context:** коммит в git с длинным многострочным сообщением на русском.
**Tried / did:** `git commit -F - <<'EOF' ... EOF` — bash-heredoc, отправленный в инструмент PowerShell.
**Result:** ❌ — каскад ParserError: `<` в PowerShell зарезервирован, а русский текст движок принялся
разбирать как выражения. Досье окружения к тому моменту было прочитано — и не применено.
**Lesson:** прочитать досье и применить его — разные действия. PowerShell — это PowerShell: heredoc
`<<'EOF'`, `&&`, `$(...)` там не существуют. Многострочный текст (сообщение коммита, тело PR, документ)
доставляется в программу ФАЙЛОМ: записать `Write`-ом в скретчпад и передать `git commit -F <файл>` —
заодно кодировка не зависит от кодовой страницы консоли.   → link: [[EXP-0002]] · AGENT_GUIDE → Environment dossier
**Repro:** `git commit -F C:\...\scratchpad\msg.txt` вместо любой формы inline-heredoc.
**Trigger:** текст длиннее одной строки уходит в CLI → сначала файл, потом флаг `-F`/`--file`.
**Not for:** однострочные сообщения — `git commit -m "..."` работает и в PowerShell.

### EXP-0003 · 2026-08-15 · ✅ · #kaif #gates #placeholders
**Context:** KAIF 2.2 adaptation — the `placeholders` item lists only `.claude/` paths, but the gate
behind `checkpoint placeholders` also scans the four mirrored agent systems and the DECLARED sphere
library (`kaif-core.mjs:1355` `scanPlaceholders`).
**Tried / did:** grepped the whole tree for the placeholder strings instead of trusting the item's list,
filled all five agent systems, then hit the refusal on `.kaif/spheres/programming.md` and filled that too.
**Result:** ✅ — one refused checkpoint, then clean.
**Lesson:** the sphere library becomes a scanned surface only once `sphere <name>` is recorded. Record
the sphere EARLY: the refusal then lands on the placeholders item, where it is obvious, instead of at
`verify-final`, where it looks like a final-gate failure. Editing the `.agents/.grok/.cline/.roo` mirrors
by hand is safe but pointless — checkpoints re-sync them from the `.claude/` canon.   → link: upstream issue #3
**Repro:** `node .kaif/kaif-core.mjs checkpoint placeholders` — it prints every offending file by path.
**Trigger:** filling any KAIF placeholder → grep the tree for the literal, do not trust the item's list.
**Not for:** foreign sphere libraries — their template slots are intentional and are not scanned.

### EXP-0002 · 2026-08-15 · ❌→✅ · #shell #windows #crossshell
**Context:** comparing the pre-install `package.json` against the current one during the judge pass.
**Tried / did:** `git show HEAD:package.json > /tmp/pkg-old.json` in Git Bash, then read it from Windows Node.
**Result:** ❌ — `ENOENT: open 'D:\tmp\pkg-old.json'`. Git Bash's `/tmp` is not a path Windows Node can
resolve; the redirect succeeded and the read failed, so the failure surfaced one step late.
**Lesson:** the two shells are different worlds (`AGENT_GUIDE.md` → Environment dossier). Any file handed
from a Bash command to a Windows program needs a Windows-resolvable path — use the session scratchpad,
never `/tmp`.   → link: AGENT_GUIDE.md → "Document & text hygiene", face 4
**Repro:** `bash -c 'echo hi > /tmp/x'; node -e "require('fs').readFileSync('/tmp/x')"` → ENOENT.
**Trigger:** writing a file in one shell and reading it in another → use an absolute Windows path.
**Not for:** files created and consumed inside the SAME shell.

### EXP-0001 · 2026-01-01 · ✅ · #example #meta
**Context:** first task after KAIF was deployed into this project (example entry — replace with real ones).
**Tried / did:** wrote the first real lesson here in the canonical format.
**Result:** ✅ — the experience log is live and greppable.
**Lesson:** capture lessons at the level of *approach* (what worked / what to avoid), not defect detail
(that lives in `bugs/`); one short entry beats a long story.   → link: (none)
