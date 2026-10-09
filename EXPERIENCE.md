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
> class: <slug from the class list below — the UNIT OF RECURRENCE>
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
> **The deadline is RUN, not remembered** (2.7, epic EL; origin issue #69 — a field audit of one
> project's journal: 14 of 15 failure classes recurred AFTER their lesson was written, five lessons
> written 6–17 times in different words, 5.8 % mechanized): `node .kaif/tools/kaif-experience-lint.mjs
> check` reads the `class:` field as the UNIT of recurrence and reddens on the SECOND failure entry of
> one class with no `mechanized:`, naming the class and both entries by id. Two fates clear it, both
> WRITTEN: name the guard in the entry (`mechanized: <the tool>`), or re-check the price once for the
> WHOLE class and declare it — `<!-- class-ok: <slug> — <why it is not cheaply possible> -->` (an empty
> declaration is itself a finding; the declared classes are printed on the summary line and that list
> only shrinks). A third record is never a fate. It also warns when
> `mechanized:` names a command this project does not contain, and when a slug is outside the list
> below; `--shrink EXP-NNNN` collapses a MECHANIZED entry to one line pointing at its guard (shows by
> default, `--yes` writes — the text itself stays in the git history). The command belongs in the
> closing ritual (`/end-chat-soft`).
>
> **The class list of this journal** — a CONTROLLED list, not a closed one: pick a slug from it, and
> when a lesson genuinely brings a new class, add the slug here in the same write (the linter warns
> about an unlisted slug, it never refuses). The starter list below is what a field audit had already
> measured (origin issue #69) — replace and grow it with your project's own classes.
>
> <!-- classes: question-already-answered, guard-not-proven-against-threat, shown-as-link,
>      claim-before-evidence, owner-decision-not-applied, text-in-agents-world,
>      etalon-from-dirty-tree, shell-lied, escaping-layer, twins-missed,
>      field-dropped-in-rebuild, tool-silent-refusal, template-not-instance, census-from-observed, cases-after-run,
     census-by-own-pattern, hook-after-event, mod-breaks-game-flow -->
>
> | Class slug | The failure it names |
> |---|---|
> | `question-already-answered` | the owner is asked what his own past word, the goal doc or a run already decided |
> | `guard-not-proven-against-threat` | a guard shipped without being seen red on the threat it claims to stop |
> | `shown-as-link` | showing replaced by a link or a path instead of the thing itself |
> | `claim-before-evidence` | a claim written wider than the observation behind it |
> | `owner-decision-not-applied` | a decision the owner gave is recorded and not carried into the artifact |
> | `text-in-agents-world` | text written for the agent's own world instead of the owner's |
> | `etalon-from-dirty-tree` | a reference/etalon captured from a tree that was not clean |
> | `shell-lied` | the shell or the tool swallowed/rewrote what was passed to it |
> | `escaping-layer` | one escaping level lost between the tool and the file |
> | `twins-missed` | one of two layers/copies moved and the twin stayed behind |
> | `field-dropped-in-rebuild` | a field or section silently lost when an artifact was regenerated |
>
> The `#tags` are **trigger-tags**: before a task, grep by the task's tags and QUOTE the relevant
> lessons in your report (id + one line) — or state "no relevant lessons". An unquoted recall is
> unverifiable; `/fable-judge` checks for this line.
>
> Skill: `/experience` (capture a lesson · recall relevant lessons).

## Entries

### EXP-0188 · 2026-10-09 · ❌→✅ · #svarogsdream #ui #unity #resolution #rdp #xunity #harness
class: stand-differs-from-owner-world
**Context:** владелец играет по удалённому столу в 1080p и видел «беды со многими UI решениями и текстами»; агент все окна
проверял только на 4K, где игра запускается.
**Tried / did:** запуск на 4K → `call UnityEngine.Screen SetResolution 1920 1080 Windowed` на лету → 2K → снова 4K, кадр HUD после
каждого шага (лист); затем меню на 1080p.
**Result:** ❌ два дефекта, которых на 4K не видно: кнопки HUD уезжали при смене разрешения (мод масштабировал от `localPosition`,
а Unity её пересчитывает при новом размере родителя — «игра переставила» ловилось ложно), и русификатор XUnity
(`EnableUIResizing`) ставил подписям меню `Wrap` — на 1080p две строки. ✅ место в `anchoredPosition`, подписям меню — `Overflow`.
**Lesson:** **окно проверяется не на одном разрешении, а на смене разрешения у запущенной игры: удалённый стол меняет его на лету.
Всё, что мод запомнил в пикселях или в `localPosition` при старте, — подозреваемый. Порядок: 4K → 1080p → 2K → 4K, кадр после
каждого шага, листом.**
**Repro:** `h.sh "call UnityEngine.Screen SetResolution 1920 1080 Windowed"` (перегрузка с `FullScreenMode`; `False` пульт не
разбирает); обратно — `3840 2160 FullScreenWindow`. **Trigger:** любая правка вёрстки HUD или окон мода. **Not for:** —
mechanized: none — кандидат: команда пульта `res4` (обход четырёх разрешений с кадрами)

### EXP-0187 · 2026-10-09 · ❌ · #svarogsdream #hotreload #harness #verdict
class: stale-stand
**Context:** прогон окон мода с пятью горячими выкладками `deploy-hot.sh` подряд в одной игре.
**Tried / did:** после пятой выкладки — проверка меню на 1080p.
**Result:** ❌ меню вдруг прямым шрифтом, на подписях тройные `KrinikPaper`, проход меню не писал в журнал — стенд «помнил»
прошлые сборки. Чистый перезапуск той же сборки — всё верно.
**Lesson:** **горячая выкладка — для поиска, вердикт — только на чистом запуске игры: после 3–4 выкладок подряд перезапуск перед
итоговым кадром.**
**Repro:** — **Trigger:** серия `deploy-hot.sh` в одном запуске. **Not for:** —
mechanized: none

### EXP-0186 · 2026-10-09 · ❌ · #stamps #clock #claim #hooks #scripts
class: claim-before-evidence
**Context:** статусы тест-кейсов Сварога писались скриптом `node tcset.mjs <json>` из scratchpad — минуя Write/Edit.
**Tried / did:** время в статусе — «по ощущению» (09:18, 09:39, 10:03 при часах 09:17, 09:38, 10:02).
**Result:** ❌ хук `stamp-gate` ловит только Write/Edit — запись через `node` прошла дважды; поймано самим агентом по `date` позже.
**Lesson:** **время в любую запись — из `date` той же команды; скрипт, который пишет статусы, берёт время сам (`new Date()`), а не из текста агента.**
**Repro:** — **Trigger:** любой пакетный писатель статусов/отчётов вне Write/Edit. **Not for:** —
mechanized: none — кандидат: писатель статусов подставляет время сам

### EXP-0185 · 2026-10-09 · ❌→✅ · #svarogsdream #ui #tmp #worldspace #ztest #shader #bubbles
class: fix-by-property-unverified
**Context:** баг 26 — пузыри речи в мире: плашка (UI/Default) поверх крыш и кольев, буквы TMP под ними, хотя у обоих
`unity_GUIZTestMode = Always`.
**Tried / did:** три правки свойством глубины (баг 23, порядок холста, каждый кадр на общем материале) — каждая «по коду»; затем
журнал материала, TAA выкл., постобработка выкл., чтение собранных шейдеров UnityPy — всё опровергнуто.
**Result:** ❌ свойство стояло (z8 в журнале), буквы всё равно резало; ✅ шейдер `TextMeshPro/Mobile/Distance Field Overlay` из
сборки игры (ZTest Always зашит, очередь 4000) — буквы целы, контроль «выкл.» снова режет. Почему свойство не сработало — не
установлено.
**Lesson:** **«поверх всего» для текста TMP в мире — шейдером Overlay, а не свойством материала: проверь сначала, что состояние
зашито в шейдер (UnityPy: `m_ParsedForm…m_State.zTest`), и переключай опыт настройкой — A/B в одном мире за минуту. Запись
свойства без журнала «что на деле рисуется» — правка вслепую.**
**Repro:** scratchpad `shader_ztest.py <Data>`; пульт `cfg krinik.svarogsdream.uirework Dialogue BubbleOverlayShader true|false`.
**Trigger:** любой текст или значок в мировом холсте, который должен быть поверх геометрии.
**Not for:** экранные холсты (Overlay-режим холста и так рисует поверх).
mechanized: none — кандидат: перенести `shader_ztest.py` в `SvarogsDream/tools/`

### EXP-0184 · 2026-10-08 · ❌→✅ · #mediedynasty #presentmon #measurement #loading #claim
class: claim-before-evidence
**Context:** база кадра «все моды» Medieval Dynasty, 14:53: захват 60 с через 15 с после «мир загружен» маршрута пилота.
**Tried / did:** медиана 10,03 мс записана в отчёт, план, STATUS; ваниль и «только UE4SS» потом дали 10,9 — моды «ускоряли» кадр.
**Result:** ❌ первые 29 % кадров базы — экран загрузки (GPU busy 1,8 мс, интервал 8,3 мс): «мир загружен» маршрут решает по
ответу моста «герой есть», а экран загрузки висит ещё 13–45 с. ✅ чистый захват — 10,91 мс, три состава в пределах 0,05 мс;
ложь исправлена в пяти местах.
**Lesson:** **число, которое противоречит здравому смыслу (моды ускоряют кадр), — сначала проверка годности замера, потом вывод.
Годность захвата кадров: доля кадров с GPU busy < 5 мс по времени — 0 % в мире, сплошной кусок в начале = экран загрузки;
захват начинать по снимку экрана, не по признаку из памяти игры.**
**Repro:** `light_frames.py` (scratchpad 2026-10-08; логика — доля `MsGPUBusy < 5` по 5-секундным срезам) на `_pm/pm-mods-on-60.csv`.
**Trigger:** любой захват PresentMon после загрузки сейва.
**Not for:** —
mechanized: none — кандидат: проверка доли лёгких кадров в `pm_stats.py` пака

### EXP-0183 · 2026-10-08 · ❌→✅ · #windows #admin #locale #powershell #environment
class: claim-before-evidence
**Context:** замер кадра PresentMon в фазе 0 Medieval Dynasty стоял «заблокированным: нет прав администратора» с ночи.
**Tried / did:** проверка `IsInRole('Administrator')` → False; вывод записан в план, два отчёта и досье.
**Result:** ❌ ложь: оболочка агента повышена (`whoami /groups` — «Высокий обязательный уровень» S-1-16-12288). Строковое
имя роли локализовано — на русской Windows группа «Администраторы», строка 'Administrator' не находит её никогда. ✅ исправлено
на месте 2026-10-08 14:47 (досье, план 15, план 16, два отчёта); владельца зря позвали нажать UAC.
**Lesson:** **права проверять перечислением `[Security.Principal.WindowsBuiltInRole]::Administrator` или уровнем целостности, а не
строкой; а «нет прав» — подтверждать отказом самого инструмента, прежде чем звать владельца.**
**Repro:** `([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)`; `whoami /groups | Select-String S-1-16-`
**Trigger:** любая проверка прав в PowerShell на этой машине.
**Not for:** —
mechanized: none — проверка в `pm-server.ps1` уже через перечисление

### EXP-0182 · 2026-10-08 · ❌ · #testcases #guard-gap #mediedynasty #hooks
class: claim-before-evidence
**Context:** короткий прогон Medieval Dynasty (износ вещи, 14:15) сразу после двух прогонов с кейсами.
**Tried / did:** ожидание сказал в чате, файл кейсов не записал, запустил `route-pilot-load.ps1`.
**Result:** ❌ кейсы легли файлом ПОСЛЕ прогона (честно помечено в отчёте); хук `testcase-gate` молчал — он знает только
`deploy-hot.sh` / `run-game.sh` сборки Svarog, маршрутов Medieval Dynasty не видит.
**Lesson:** **короткий прогон — тоже прогон: файл кейсов до запуска; хук покрывает не все игры — его GAP теперь назван.**
**Repro:** `grep -n "deploy-hot\|run-game\|route-" tools/hooks/testcase-gate.mjs` — `route-` не найдено.
**Trigger:** любой запуск игры агентом.
**Not for:** чтение журналов без запуска.
mechanized: `tools/hooks/testcase-gate.mjs` v2.3 (2026-10-08) — `route-*-load.ps1` из Bash и PowerShell; ручной `Start-Process` exe не видит

### EXP-0181 · 2026-10-08 · ✅ · #research #recon #formulas #psyche #mediedynasty
class: recon-by-snippets
**Context:** псих-разведка для модуля «Воля»: формулы «Большая пятёрка → настроение PAD» из статьи ALMA (Gebhard, 2005).
**Tried / did:** формулу не переписал как есть, а проверил знаки по психологии и по первоисточнику Мехрабиана (1996, ур. 4).
**Result:** ✅ в ALMA пятый член подписан «Neuroticism», а по знакам и по Мехрабиану это эмоциональная УСТОЙЧИВОСТЬ: с подписью
как есть невротик выходит довольным и спокойным. Поймано до кода — `researches/medieval-dynasty/recon-psyche.md` §2.
**Lesson:** **формула из чужой статьи переносится только после проверки знака каждого члена по смыслу и по первоисточнику, из
которого она взята;** подписи переменных кочуют между статьями с ошибками, а коэффициенты — без. Поисковые выжимки формул не
дают вовсе: PDF читать целиком (`pdftotext`; закрытый для curl сайт отдаёт PDF через WebFetch, файл ложится в `tool-results/`).
**Repro:** подставить крайнего субъекта (N = 1, остальные 0) в перенесённую формулу и сверить угол PAD с описанием автора
модели («anxiety … displeasure, high arousal, and submissiveness»).
**Trigger:** переношу в код или в конспект формулу из чужой статьи.
**Not for:** формулы, которые сразу проверяются прогоном с наблюдаемым итогом.
mechanized: none — проверка смысла знака остаётся за моделью; в коде модуля — кейс «невротик в покое: неприятно и возбуждённо»

### EXP-0180 · 2026-10-08 · ❌ · #stamps #clock #claim #bash #guard-gap
class: claim-before-evidence
**Context:** автономный час 10:05–11:05: штампы времени в отчётах, кейсах, конспектах.
**Tried / did:** время «на глаз» в тексте, записанном через Bash (`cat >>`, `sed -i`), и в Write.
**Result:** ❌ четыре штампа впереди часов за час («10:22» при 10:17, «≈10:28» при 10:22, «≈10:40» при 10:38, «10:42» при 10:40);
хук `stamp-gate` поймал два — те, что шли через Write; два через Bash прошли и были найдены только глазом и исправлены на месте.
**Lesson:** **время в тексте — только из `date` той же команды, никогда «прикинул»; любая запись штампа через Bash — сразу
`date` в той же строке (`$(date +%H:%M)`)**. Хук видит Write/Edit, не Bash — это его GAP, и он стоит здесь второй раз (EXP-0174).
**Repro:** heredoc в Bash со штампом сегодняшнего дня на 10 минут вперёд от часов — хук его не видит; коммит-гейт смотрит только KUMM.
**Trigger:** любой штамп сегодняшнего времени в тексте.
**Not for:** время, снятое из журнала программы (`pilot-out.txt`, `wake-out.txt`) — оно уже из часов.
mechanized: none — кандидат: разбор штампа и в хуке на Bash (heredoc и `sed -i` с датой)

### EXP-0179 · 2026-10-08 · ❌→✅ · #mediedynasty #ai #steering #metric #roads
class: wrong-proxy
**Context:** руль жителя через распорядок (KUMM план 16, шаг 0.2b): переписать места занятий и ждать, что житель «станет ближе к цели».
**Tried / did:** критерий «ближе к герою на ≥ 100 м за 120 с»; три прогона дали «задержку 3 мин», «развернулся», «ушёл и вернулся».
**Result:** ❌ метрика лгала: по коду `BP_NPC:SetPath` дальше 150 м игра ведёт по ДОРОГАМ (`GetPathToTarget`), и дистанция по прямой
колеблется на петлях; «мебельное» занятие (`IsFurniture`) ведёт к мебели, а не к месту. ✅ ближний житель (161 м) дошёл прямо за 110 с.
**Lesson:** **движение ИИ по дорогам мерить прибытием или прогрессом по пути, а не дистанцией по прямой**; прежде чем объявлять «не
работает», прочесть, КАК игра строит путь (функция пути, порог дистанции). И сравнения — на одном и том же сейве: игра пишет автосейв
во время прогона, и маршрут «загрузить последний» уносит прошлый прогон в следующий.
**Repro:** `goto BP_NPC_Multi_Village_C 5 sched` + `trackall` каждые 10 с у жителей в 400–550 м — дистанции ходят ±60 м.
**Trigger:** проверка, что NPC идёт к цели дальше пары сотен метров.
**Not for:** цели ближе порога прямого пути (150 м у Medieval Dynasty).
mechanized: none — критерий шага 0.2b переписывается на «прибытие / прогресс по пути» в плане 16

### EXP-0178 · 2026-10-08 · ❌ · #shell #python #windows #hang
class: shell-lied
**Context:** правка файла цепочкой в Git Bash: `python - 2>/dev/null; node -e "…"`.
**Tried / did:** «пустой» `python -` (остаток от черновика) перед `node`.
**Result:** ❌ команда висела до тайм-аута 120 с дважды: на этой машине `python` в Git Bash без numpy и, похоже, ждёт stdin; `node` не запускался.
**Lesson:** **никаких `python -` без heredoc и без надобности; правка текста — инструментом Edit, а не склейкой строк в оболочке**
(там же `\n` через bash → node превращается в перевод строки внутри строки Lua — стенд падал «unfinished string» трижды).
**Repro:** `python - 2>/dev/null; echo done` в Git Bash — `done` не печатается до тайм-аута.
**Trigger:** однострочник в Bash, правящий файл.
**Not for:** —
mechanized: none

### EXP-0177 · 2026-10-08 · ❌→✅ · #ue4ss #out-params #ufunction #lua #mediedynasty
class: wrong-api-assumption
**Context:** мост KrinikBridge v9 читает занятие жителя геттером игры `AIMulti_GetCurrentActivity(out Success: Bool, out Activity: Struct)` (UE4SS 3.0.1-1161).
**Tried / did:** одна таблица на оба out-параметра → «UFunction expected 2 parameters, received 1»; две таблицы и чтение `outS.Success` / `outA.Activity` → у всех «нет занятия», причина не видна.
**Result:** ❌ ответ «нет занятия» прятал, что прочитано на самом деле; ✅ диагностика ключей таблиц показала: **все out-значения ложатся в ПЕРВУЮ таблицу** — простые под именем параметра (`Success`), поля out-структуры развёрнуты рядом на том же уровне (`ActivityID_33_<GUID>`, `TransformLocation_13_<GUID>`…), вторая таблица пуста. После правки у разбуженных жителей прочитано 5 из 5.
**Lesson:** **в UE4SS 1161 передавать по таблице на каждый out-параметр (иначе ошибка, а по уроку пака Palworld — порча кадра параметров), а читать всё из первой; поля пользовательской структуры — с GUID-хвостом.** Ответ «нет данных» обязан нести диагностику (что лежит в таблицах), иначе он не отличает «пусто в игре» от «читаю не тот ключ».
**Repro:** любой UFunction с двумя out-параметрами, второй — структура: после вызова `pairs(t1)` покажет и `Success`, и поля структуры, `pairs(t2)` — пусто.
**Trigger:** вызов из Lua UE4SS функции игры с out-параметрами.
**Not for:** возвращаемое значение (`ReturnParm`) — оно приходит результатом вызова.
mechanized: стенд `MedievalDynasty/tools/test-bridge.lua` повторяет раскладку (заглушка кладёт всё в первую таблицу и падает на одной таблице на два параметра); мутант «читать только вторую» краснеет

### EXP-0176 · 2026-10-08 · ❌→✅ · #engine #palworld-shaped #proxy #deploy #mediedynasty
class: wrong-proxy
**Context:** первая раскатка третьей игры (Medieval Dynasty) движком KUMM.
**Tried / did:** `Deploy-ModPack.ps1 -Deploy` — движок положил в папку игры `Mods\PalModSettings.ini` и посоветовал смотреть `Pal\Binaries\…\UE4SS.log`.
**Result:** ❌ признак «нет `modsDir` ⇒ Palworld» (исправление бага 03 после Конана) ложен для любой игры без `modsDir`; ✅ признак — манифест без `gameExe` (Palworld — игра по умолчанию); файл удалён, повторная раскатка папку `Mods` не создала.
**Lesson:** **признак «чего нет» ловит не одну игру, а все, у кого этого нет; игру опознавать по тому, ЧТО ЕСТЬ (её `gameExe`), а не по отсутствию чужого ключа.** Каждая новая игра — фикстура для движка: баг 03 нашёл Конан, этот — Medieval Dynasty.
**Repro:** раскатка пака без `modsDir` и с `gameExe` ≠ Palworld → `Test-Path <игра>\Mods\PalModSettings.ini` должно быть False.
**Trigger:** движок принимает новую игру.
**Not for:** —
mechanized: none — ветка Palworld прогоном не перепроверена (контроль упал на неверном пути пака), только логикой

### EXP-0175 · 2026-10-08 · ❌→✅ · #recall #grep #truncation #notes #owner
class: false-negative-search
**Context:** владелец: «Wayward считает NPC на GPU, в девблоках было»; агент искал по своим конспектам трёх проектов.
**Tried / did:** `grep -rl wayward <три проекта> | head -20` — двадцать строк заняли json-файлы кэша Game Of Dream; файлы KUMM в выдачу не попали. Агент пошёл в веб и записал «связи не найдено».
**Result:** ❌ ложь в двух документах; разведчик нашёл, что разбор девлога лежал в `researches/svarogs-dream/living-world/02b_rpg_worlds.md` с 09.09. ✅ исправлено на месте (`f4b8ccd`).
**Lesson:** **«не нашёл у себя» верно только для поиска без обрезки: сначала свой проект отдельно, без `head`, потом соседние.** Обрезка выдачи — тоже фильтр, и он молча выбрасывает ответ.
**Repro:** `grep -rl -i <слово> --include=*.md D:/work/ai_sandbox/KUMM | grep -v worktrees` — без `head`, кэш исключён.
**Trigger:** владелец говорит «мы это уже искали» или тема знакомая — поиск по своим конспектам до веба.
**Not for:** поиск по коду, где выдача сотнями строк заведомо.
mechanized: none — память `write-every-finding-into-notes`

### EXP-0174 · 2026-10-07 · ❌→✅ · #stamps #clock #claim #midnight #guard-gap
class: claim-before-evidence
**Context:** цитата владельца в разведку Medieval Dynasty у полуночи; время вписано по ощущению «≈00:00» без `date`.
**Tried / did:** штамп «2026-10-08 ≈00:00»; `date` после записи показал 2026-10-07 23:59.
**Result:** ❌ хук `stamp-gate` пропустил (завтрашняя дата для него — законный план) и коммит тоже; ✅ пойман сразу по `date`, исправлен на месте (`1aa7da1`).
**Lesson:** **у полуночи дата — такое же число из часов, как минута: «≈00:00» значит «ещё не знаю, какой день».** `date` — до записи, не после.
**Repro:** `date "+%Y-%m-%d %H:%M %:z"` прямо перед любой цитатой со штампом после 23:30.
**Trigger:** штамп между 23:30 и 00:30.
**Not for:** штампы, взятые из журнала или вывода команды.
mechanized: none — дыра записана в GAP `tools/hooks/stamp-gate.mjs`; [[EXP-0160]]

### EXP-0173 · 2026-10-07 · ❌→✅ · #svarogsdream #translation #xunity #keys #extract
class: escaping-layer
**Context:** судьбы героев выбора из данных игры (`tools/data_texts_extract.py`) → свой словарь `zz_selection.txt`.
**Tried / did:** выемка писала «\n» буквами, а «\r» выбрасывала.
**Result:** ❌ у 25 текстов переносы «\r\n»: точный ключ не совпадал, XUnity находил строку запасным путём и склеивал строки
пробелами (судьба Ясена одним абзацем, кадр hs7). ✅ «\r» буквами в ключе, ключи таблицы перевода пересобраны скриптом.
**Lesson:** **ключ словаря — текст как есть, со всеми управляющими знаками буквами; «текст переведён, но склеен» — ключ не точный.**
**Repro:** `grep -c 'r' translation/heroes_en.tsv` после выемки — строки с «\r» есть; `gettext` текста в игре — «\n» на месте.
**Trigger:** новая выемка текста для XUnity из данных или кода; переведённый текст в игре без переносов.
**Not for:** строки, которые игра собирает сама (`$"…"`).
mechanized: none — правило в коде выемки (esc)

### EXP-0172 · 2026-10-07 · ❌→✅ · #svarogsdream #ui #harmony #postfix #gameflow
class: mod-breaks-game-flow
**Context:** окно выбора героя — оформление карточки в постфиксе `CharacterSelectionUI.PopulateCharacters`.
**Tried / did:** в постфиксе приведение `(RectTransform)` дочернего объекта, среди которых была метка мода — простой Transform.
**Result:** ❌ исключение постфикса ушло в цикл игры: первая карточка заполнилась, две другие остались заглушками игры («Quisque
vehicula…», белые портреты, уровень 150) — герой выбирался бы из заглушки. В журнале BepInEx ничего. ✅ try/catch на каждом
входе мода в ход игры (постфиксы, Awake) с записью в журнал мода (SvarogsDream `de7af27`).
**Lesson:** **постфикс Harmony — часть метода игры: его исключение обрывает её цикл; вход мода в ход игры — всегда в try/catch.**
**Repro:** бросить исключение в постфиксе `PopulateCharacters` — вторая и третья карточки с заглушками (кадр hs4).
**Trigger:** новый Harmony-постфикс на метод, который игра зовёт в цикле или от которого зависит состояние.
**Not for:** —
mechanized: none — правило в HeroSelect.cs; прибора «постфикс без try/catch» нет

### EXP-0171 · 2026-10-07 · ❌→✅ · #svarogsdream #ui #unity #scriptengine #flicker #launch
class: hook-after-event
**Context:** главное меню при запуске игры на миг прямым шрифтом и крупно, потом письменным (`[OWNER]` · 2026-10-07 ≈21:53).
**Tried / did:** в коде стоял крючок на `MainMenuOutOfGame.Start` и секундный таймер «на всякий случай»; причину угадывать не стал —
запись экрана 60 к/с от запуска и строка журнала с `Time.frameCount` в загрузке мода, в крючке и в таймере.
**Result:** ❌ журнал: мод загружен на кадре 1 (t 20,6 с), крючок на `Start` не сработал ни разу — меню прошло `Start` раньше мода;
оформлял таймер на кадре 2, а кадр 1→2 длится 132 мс (на видео 6 и 3 кадра). ✅ оформление в конце `Awake` мода — в тот же кадр, до
отрисовки: «styled by tick, frame 1», вспышки нет (SvarogsDream, баг KUMM 24).
**Lesson:** **мод из `BepInEx/scripts` (ScriptEngine) грузится после первой сцены: крючок на `Start`/`Awake` объектов сцены при
запуске мимо — то, что уже стоит на экране, оформлять в `Awake` самого мода; первые кадры игры длинные, «через кадр» — это видно.**
**Repro:** `grep -n "loaded, frame\|menu: " "<игра>/BepInEx/LogOutput.log"` после запуска — кадр загрузки мода и кадр оформления.
**Trigger:** крючок Harmony на `Start`/`Awake`/`OnEnable` объекта первой сцены в моде из scripts; «на мгновение мигает при запуске».
**Not for:** окна, которые открываются позже загрузки мода (там крючок срабатывает).
mechanized: none — правило в коде (`Plugin.Awake` → `TickMainMenu`); прибора «крючок не сработал» нет

### EXP-0170 · 2026-10-07 · ❌→✅ · #svarogsdream #translation #census #extract #guard #twins
class: census-by-own-pattern
**Context:** реплики героя над головой по-английски (`[OWNER]` «Fell that? Somoone watcing…» · ≈21:51) — после бага 22 и его сторожа.
**Tried / did:** сторож бага 22 считал непрочитанным только вызов `Write/Option/Yell/Say/Text` с литералом; реплики героя жили в
`GetRandomShout(new string[n] {…})` и в `playerComment = "…"` → `Yell(playerComment)` — литерала в вызове нет, сторож молчал.
**Result:** ❌ второй удар класса: 53 фразы вне переписи. ✅ выемка берёт оба вида, сторож — любой массив фраз аргументом; и прибор
против класса целиком: `tools/text_census.py` — все литералы кода против всех словарей → 1106 строк вне словарей (баг 28).
**Lesson:** **сторож шаблона ловит только формы вызова, которые знает; знаменатель перевода считается по ВСЕМ литералам кода против
ВСЕХ словарей — тогда шаблон выемки не может спрятать строку.**
**Repro:** `python -I tools/text_census.py "D:/Games/Svarog's Dream" translation/text_census.tsv` → «unknown N», список по файлам.
**Trigger:** игрок видит английскую строку, которой «нет» в переписи; новая выемка текста по шаблону.
**Not for:** строки, которые игра собирает подстановкой (`$"…{x}…"`) — их прибор не считает.
mechanized: SvarogsDream/tools/text_census.py (перепись по литералам) + dialogue_extract.py (ANY_ARR — массивы фраз, код 1); GAP:
присваивания полям, кроме `playerComment`, сторож выемки не видит — их ловит только перепись

### EXP-0169 · 2026-10-07 · ❌→✅ · #svarogsdream #ui #unity #tmp #fallback #worldspace #hotreload
class: twins-missed
**Context:** пузырь реплики над головой жителя (холст в мире) должен рисоваться поверх крыш; так было сделано 05.10 (`40c118f`).
**Tried / did:** ставили `unity_GUIZTestMode = Always` основному материалу шрифта текста; потом шрифт всей игры сменили на Manrope (`4d53e90`).
**Result:** ❌ у домов пузырь — белая плашка без букв (баг 23): русские глифы рисует подобъект `TMP_SubMeshUI` запасного шрифта своим
материалом, «поверх» на него не распространялось. ✅ после `ForceMeshUpdate()` то же значение — материалам всех подобъектов.
Попутно: горячая перезагрузка не меняет компонент, уже висящий на живом объекте (пузырь создан старой сборкой) — правку
MonoBehaviour мерить после перезапуска или на новом объекте (тот же класс, что EXP-0162).
**Lesson:** **настройка материала текста TMP касается и подобъектов `TMP_SubMeshUI`: глифы запасного шрифта рисуются ими, а не
основным мешем — смена шрифта переносит текст туда незаметно.**
**Repro:** `h.sh 'dump "<путь к тексту>" 3'` — строка `TMP UI SubObject [<шрифт> Material (Instance)]` под текстом = глифы идут подобъектом.
**Trigger:** правка `fontMaterial`/`fontSharedMaterial` (ZTest, dilate, цвет обводки) у текста, где возможна кириллица или запасной шрифт.
**Not for:** текст без запасных шрифтов (все глифы в основном атласе).
mechanized: SvarogsDream/src/KrinikUIRework/BubbleBox.cs (Fit — подобъекты: ZTest и утолщение); двойники обойдены в баге 23 (TWINS); GAP: для окна предмета и поп-апов вывод «запасного шрифта нет» — по коду, в игре не проверен

### EXP-0168 · 2026-10-07 · ❌→✅ · #svarogsdream #translation #census #extract #guard
class: census-by-own-pattern
**Context:** перевод диалогов шёл по переписи «7731 реплика» из `dialogue_extract.py` (шаблон вызова `Write/Yell/Option(…, "…")`).
**Tried / did:** сутки считал покрытие от этого знаменателя; на партии русалок увидел в коде `Yell(Rusalka1, "Lay in the sun…")`
— строки в таблице нет.
**Result:** ❌ шаблон знал только паузу перед литералом: говорящий первым аргументом (≈350 вызовов) и `cond ? "…" : "…"` выпали —
290 реплик, боги в Ирии, жена Йована в начале игры. ✅ шаблон + сторож `unread_calls` в выемке (SvarogsDream `90c7844`, баг 22).
**Lesson:** **перепись, которая ищет по шаблону, обязана считать и то, что шаблон не взял: каждый вызов-кандидат с литералом либо
прочитан, либо назван — иначе знаменатель врёт молча.**
**Repro:** `$PY -I tools/dialogue_extract.py "D:/Games/Svarog's Dream" <out>` → «unread calls 0», код 0.
**Trigger:** новая выемка текста из кода регуляркой по вызовам; странный пропуск строки посреди переведённого диалога.
**Not for:** выемки из сцен и ассетов (там перечисление объектов, а не шаблон по тексту).
mechanized: SvarogsDream/tools/dialogue_extract.py — unread_calls (код 1)

### EXP-0167 · 2026-10-07 · ❌ · #stamps #clock #claim #hooks
class: claim-before-evidence
**Context:** день 07.10 14:12–17:06: строки STATUS, глоссария, летописи со временем слова владельца или события.
**Tried / did:** писал короткие штампы по ощущению: «показано в чате 07.10 ≈14:30» (часы 14:27), «до 15:15» (15:20), «≈16:50» (16:36),
«поправка 17:10» (17:06).
**Result:** ❌ четыре штампа на 4–14 минут мимо часов; все поймал сам перечиткой, хук `stamp-gate` молчал — он смотрит только форму
`ГГГГ-ММ-ДД ЧЧ:ММ`, а короткие «07.10 ≈ЧЧ:ММ», «до ЧЧ:ММ», «ЧЧ:ММ» в прозе ему не видны.
**Lesson:** **перед любым ЧЧ:ММ в тексте — `date` в той же команде; короткая форма штампа тоже штамп.**
**Trigger:** «≈», «до», «в» + ЧЧ:ММ в STATUS, глоссарии, летописи, сообщении коммита.
**Not for:** время из вывода прибора или журнала.
mechanized: tools/hooks/stamp-gate.mjs — только полная форма; GAP: короткие штампы без даты не проверяются (расширить хук — пункт беклога)

### EXP-0166 · 2026-10-07 · ❌→✅ · #svarogsdream #translation #choices #recon
class: key-form-after-game-rewrite
**Context:** игра в рифмы у поэта на острове (`IslandPoet`): герой выбирает последнее слово строки.
**Tried / did:** переложил варианты под русскую рифму (Луна, Мешок, Струя, Рядом) по правилу «шутку — шуткой», код не открыв.
**Result:** ❌ `[OWNER]` «в этих стихах на выбор переводи дословно» · «этом может быть в игре ключ» · 2026-10-07; декомпиляция
`Compose()`: ругательство + cock + pee → талант Vulgar с шансом 0.9 — рифма прятала, какие ответы грубые. ✅ дословно (`c6309aa`).
**Lesson:** **варианты выбора переводятся после чтения кода: что игра делает с ответом (флаг, талант, ветка) — то и должно
читаться в русском слове.**
**Trigger:** `Option(...)` с `Do(...)`/флагом в файле диалога; загадки, рифмы, викторины.
**Not for:** варианты-реплики без последствий («(Уйти)», вопросы к жителю).
mechanized: none — шаг в методичке STYLE §2 «Имена предметов» п. 6

### EXP-0165 · 2026-10-07 · ❌→✅ · #svarogsdream #translation #gender #address #overcorrection
class: rule-half-applied
**Context:** правка рода героя в репликах (STYLE §1 п. 9 «к герою без рода, но с обращением»), разбор 34 подозрений и партии 07.10.
**Tried / did:** уводил глагол от героя в безличное и страдательное: «ты нанял меня» → «нанят я», «You have given everything» → «Всё
отдано», «Told ye» → «Говорил же».
**Result:** ❌ `[OWNER]` «нанят я тобою - я просил местоимения» · 2026-10-07: род ушёл вместе с героем. ✅ 19 строк с «тобою», «тебе»,
«твои» (SvarogsDream `e9670c3`), включая две правки прошлой сессии («Загадка моя тобою разгадана»).
**Lesson:** **обход рода меняет форму глагола, а не адресата: «нанят я тобою», «Всё тобою отдано»; творительный «тобою» и дательный
«тебе» рода не несут.**
**Trigger:** в английской реплике NPC есть you/your/ye, а в русском черновике нет ни местоимения, ни глагола на -шь.
**Not for:** повелительное («Ступай к осаде»), реплики самого героя.
mechanized: SvarogsDream/tools/dialogue_gender_sweep.py (строка «address: N», красная на таблице 02046c2)

### EXP-0164 · 2026-10-07 · ❌ · #svarogsdream #translation #gender #overcorrection
class: rule-overapplied
**Context:** правило «к герою без рода» (STYLE §1 п. 9) в партиях диалогов 07.10.
**Tried / did:** обходил и слова-роли автора: «minion» → «шестёрка», «traveler» → «С дороги, видно?», «hero» → «гордость».
**Result:** ❌ `[OWNER]` «прислужник - не имеет рода, это профессия. Ты что, русския язык не знаешь? Я могу сказать Доктор Марина
Ивановна» (2026-10-07 ≈12:26). Возвращены 6 + 11 реплик (SvarogsDream `5e65295`, `51f757f`).
**Lesson:** **род выдают глагол в прошедшем и краткое прилагательное, а не имя-роль: «путник», «друг», «герой», «прислужник» к
Яне законны; обход роли уводит от автора.**
**Trigger:** в черновике к герою стоит существительное мужского рода.
**Not for:** слова с парой по полу у самого автора («lad», «Brother/Sister» с ветвлением в коде).
mechanized: none — правило в методичке STYLE.md §1 п. 9

### EXP-0163 · 2026-10-07 · ❌→✅ · #svarogsdream #translation #xunity #keys #recon
class: key-form-after-game-rewrite
**Context:** словарь реплик диалогов писал ключ буквой кода игры: `Option("Not yet. (Leave)")` → «Not yet. (Leave)=…».
**Tried / did:** при подготовке партии лавок машинный словарь показал ключ «…<color=#8C0A0A>(Leave)</color>»; декомпиляция
`Fluent/OptionsPresenter.cs` — игра после `text = OptionText` делает девять `text.Replace("(Leave)", "<color…>")`.
**Result:** ❌ 98 наших вариантов: цвет автора терялся (точный ключ подставлялся раньше `Replace`), а при опоздании перевода
окрашенный ключ не находился. ✅ генератор красит русскую подпись сам и пишет второй ключ в окраске игры; `dialogue_keycheck.py`
сверяет с ключами XUnity: 0/17 → 17/17 (SvarogsDream `e2e6713`, баг 21).
**Lesson:** **форма ключа — это текст в момент показа, а не строка в коде: перед конвейером словаря искать, что игра делает с
текстом ПОСЛЕ присваивания (`Replace`, `Format`, теги), и сверять с ключами, которые XUnity записал сам.**
**Repro:** `grep -c -F "(Leave)</color>=" _AutoGeneratedTranslations.txt` — 25, простых «(Leave)=» — 0.
**Trigger:** любой новый генератор словаря XUnity по строкам из кода игры.
**Not for:** строки, которые игра показывает как есть (реплики `Write`/`Yell` без подписей).
mechanized: SvarogsDream/tools/dialogue_keycheck.py (в translation_deploy.sh)

### EXP-0162 · 2026-10-07 · ❌→✅ · #svarogsdream #ui #unity #canvasgroup #popup #hotreload
class: shared-state-two-owners
**Context:** общее проявление поп-апов (KrinikPopup: CanvasGroup.alpha 0 → 1 за 100 мс) повешено на все подсказки игры в `Style()`.
**Tried / did:** окно предмета мода прячет карточку игры той же альфой её CanvasGroup (0), а проявление поднимало её до 1.
**Result:** ❌ `[OWNER]` «оригинальная карточка предмета начала показываться» · «она показывается с анимацией 100мс - анимация может
повлияла» (2026-10-07 ≈00:08): карточка игры вставала поверх нашей; после горячих перезагрузок на одном объекте висели 3–4 KrinikPopup
прошлых сборок, каждый крутил ту же альфу. ✅ на заменённую карточку проявление не вешается, экземпляры прошлых сборок снимаются (`02fa0f9`).
**Lesson:** **новый общий механизм, пишущий в свойство объекта игры, сначала ищет других писателей того же свойства (`grep` по имени
свойства: `alpha`, `CanvasGroup`) — у одного состояния один хозяин.**
**Repro:** наведение на предмет в инвентаре — две карточки (`SvarogsDream/_harness/item1_s.webp`).
**Trigger:** компонент, который ставит alpha/enabled/position на ЧУЖИЕ объекты всем подряд.
**Not for:** свои объекты мода, у которых другой писатель невозможен.
mechanized: SvarogsDream/src/KrinikUIRework/PopupLook.cs (KrinikPopup.Off — снять на заменённых, экземпляры прошлых сборок по имени типа)

### EXP-0161 · 2026-10-06 · ❌→✅ · #svarogsdream #ui #measure #pixels #hotreload
class: probe-point-unchecked
**Context:** подсказка «Голод» у шара HUD казалась полупрозрачной — сквозь неё читались цифры клавиш (C44).
**Tried / did:** замерил яркость пикселей по координатам вырезки, не глядя, на что легла точка: «100%» сферы на подложке — 234 из
255 → вывод «HUD рисуется поверх подсказки» → две попытки с холстом `overrideSorting` (порядок +50, затем 30000).
**Result:** ❌ точка «pct_in» легла на собственный белый текст подсказки («регенерации»), а не на «100%»; порядок ни при чём, обе
попытки без эффекта. ✅ настоящая причина — альфа фона 0.95: на тёмной подложке 5 % яркой цифры уже читаются; `cfg` 1.0 — сплошная.
Попутно: после серии горячих перезагрузок высота описания была 648 против 464 в последнем кадре (≈ 1.2²; гипотеза — множитель
копится перезагрузками, не проверена).
**Lesson:** **точку замера сначала увидеть на кадре (обвести/вырезать 20×20), потом верить числу; гипотезу «порядок или альфа»
различает дешёвый контроль — выкрутить альфу до 1 — до правки кода.**
**Repro:** `_harness/c44_crop2.webp`, область x 40–120, y 470–530 — там «регенерации», не «100%».
**Trigger:** любой вывод из `getpixel`/яркости области; «просвечивает» в UI.
**Not for:** замеры по всей области с известным содержимым (ffmpeg-яркость окна при фейде).
mechanized: none — дешёвый контроль записан в C44 (попытка 3); прибора «покажи точки замера» нет

### EXP-0160 · 2026-10-06 · ❌ · #stamps #clock #claim #svarogsdream
class: claim-before-evidence
**Context:** вечер 21:44–23:24, пачка правок Сварога; штампы времени в тест-кейсах, коде, интервью, STATUS, рулбуке.
**Tried / did:** писал «≈22:25», «23:01», «22:52» по ощущению — до вызова `date`.
**Result:** ❌ около десяти раз за вечер штамп на 1–4 минуты впереди часов; ловил сам перечиткой, один раз — страж коммита KUMM;
в коде SvarogsDream, тест-кейсах до коммита и рулбуке страж не стоит вовсе. Повтор EXP-0137 — урок без механизма не держит.
**Lesson:** **время в тексте — только из `date` в ТОЙ ЖЕ команде, где пишется штамп; минуту не угадывать.**
**Repro:** `grep -n "22:5[0-9]" <файл>` сразу после `date` = 22:48 — штамп впереди.
**Trigger:** любой штамп HH:MM в документе, комментарии, тест-кейсе.
**Not for:** время из вывода прибора (журнал пульта, `date`).
mechanized: tools/hooks/stamp-gate.mjs (PreToolUse на Write|Edit|MultiEdit: сегодняшний штамп позже часов — отказ до записи;
2026-10-07 — после ещё двух промахов за утро: «09:45» при 09:34, «09:51» при 09:49)

### EXP-0159 · 2026-10-06 · ❌→✅ · #svarogsdream #ui #unity #fade #outline #popup
class: hidden-layer-shows-through
**Context:** плавное появление поп-апов (CanvasGroup.alpha 0 → 1 за 100 мс), карточка навыка «Мастерства».
**Tried / did:** проявление CanvasGroup поверх карточки с каймой `Outline` (и под ней — исходная подложка игры до конца раскладки).
**Result:** ❌ запись 60 к/с: первые кадры — светло-оливковая вспышка: `Outline` рисует копии подложки золотом ПОД ней, непрозрачная
подложка их прятала, полупрозрачная — нет; плюс первые 6 кадров — исходный вид до `KrinikTooltipFit.Settle`. ✅ кайма — четырьмя
полосами поверх краёв (`KrinikEdge`), проявление ждёт устоявшейся раскладки.
**Lesson:** **всё, что прячется «под непрозрачным», вылезает при прозрачности: перед фейдом убрать слои под подложкой, а не накрыть.**
**Repro:** `ffmpeg -f gdigrab -framerate 60 …` + наведение мышью; яркость области карточки по кадрам — скачок вверх = вспышка.
**Trigger:** любая анимация прозрачности окна с Outline/Shadow или со скрытым «под» слоем.
**Not for:** окна без фейда.
mechanized: SvarogsDream/src/KrinikUIRework/PopupLook.cs (KrinikEdge, KrinikPopup ждёт Settle)

### EXP-0158 · 2026-10-06 · ❌→✅ · #svarogsdream #translation #xunity #popup #latency
class: translator-delay
**Context:** карточка навыка открывалась английской строкой и через секунду становилась русской (`[OWNER]` «вот это меня бесит»).
**Tried / did:** сначала держал окно прозрачным, пока текст не устоится (два кадра) — не помогает: перевод приходит через ~1 с.
**Result:** ❌ README XUnity: «When it sees a new text, it will always wait one second before it queues a translation request» —
сразу срабатывают только точные ключи; строки с числами и тегами идут правилами `r:` и шаблонами через эту очередь. Синхронный
`TryTranslate` правил не применяет. ✅ мод сам переводит подсказку в момент заполнения: точные ключи, шаблоны `{{A}}`, правила `r:`
из словаря игры (`InstantTranslate.cs`); замер пультом — русский в кадр показа, 18 карточек «Меткого Стрелка».
**Lesson:** **английский кадр перед русским — не баг вёрстки, а задержка русификатора; лечится своим синхронным переводом.**
**Repro:** `h.sh "hover <навык>" "dump <карточка>"` в один кадр — `Scaling:` английская без мгновенного перевода.
**Trigger:** любой текст с числами/тегами, который игра пишет в момент показа окна.
**Not for:** строки с точным ключом в словаре — те переводятся сразу.
mechanized: SvarogsDream/src/KrinikUIRework/InstantTranslate.cs

### EXP-0157 · 2026-10-06 · ❌→✅ · #svarogsdream #ui #popup #hover #harness
class: popup-steals-pointer
**Context:** «Мастерство»: курсор неподвижен на навыке — карточка мигала (запись экрана владельца).
**Tried / did:** наша карточка растёт вверх и встаёт под курсор; наведение пультом (`h.sh hover`) этого не показывает — нужна мышь.
**Result:** ❌ курсор «ушёл» с навыка на карточку → игра её прячет → курсор снова на навыке → показ, по кругу. ✅ `CanvasGroup.
blocksRaycasts = false` на корне поп-апа (`KrinikPopup`): карточка не ловит мышь; запись 3 с — карточка во всех кадрах.
**Lesson:** **поп-ап не должен ловить мышь; подсветка и наведение проверяются настоящей мышью (`mouse.ps1 -Button move`), не пультом.**
**Repro:** `mouse.ps1 -X <навык> -Button move` + `ffmpeg … -t 3` — карточка пропадает в части кадров.
**Trigger:** любой поп-ап, который может накрыть элемент, на котором стоит курсор.
**Not for:** окна, открываемые щелчком (их наведение не держит).
mechanized: SvarogsDream/src/KrinikUIRework/PopupLook.cs (KrinikPopup)

### EXP-0156 · 2026-10-06 · ❌→✅ · #testing #process #kaif #svarogsdream #harness
class: cases-after-run
**Context:** вечер прогонов окна персонажа Svarog's Dream (≈30 сборок, кадры, отчёт) — 20:12–21:24.
**Tried / did:** гонял игру и снимал кадры, отчёт `testcases/reports/…` написал после, таблицу случаев в нём — задним числом.
**Result:** ❌ `[OWNER]` «Ты тест кейсы пишешь, как КАИФ обязывает?» · ≈21:25 — нет: документа `testcases/TC_*.md` до прогона не было,
набора по техникам и названных дыр — тоже. ✅ документ `TC_svarog_character_window_cards.md`, контрольный случай K1 прогнан;
хук `testcase-gate.mjs` не пускает прогон без свежего документа случаев (проверен в живой сессии).
**Lesson:** **прогон в игре — по случаям, написанным до него; отчёт после прогона не заменяет тест-кейсы.**
**Repro:** `echo run-game.sh` при документе TC старше 90 мин → хук останавливает команду.
**Trigger:** любая сборка с выкладкой или запуск игры для проверки.
**Not for:** кадр по ходу работы пультом в уже запущенной игре.
mechanized: tools/hooks/testcase-gate.mjs

### EXP-0155 · 2026-10-06 · ❌→✅ · #svarogsdream #harness #dialogue #input
class: proxy-path-blocked
**Context:** проверка реплик в игре — нужен разговор с жителем; ходьба щелчком мыши (`tools/mouse.ps1`) и `call GreetingsTexts Run`.
**Tried / did:** `call GreetingsTexts Run` (первый попавшийся житель) — `NullReferenceException` в `Fluent.OptionsPresenter.Show`;
два левых щелчка по земле — герой не сдвинулся (кадры одинаковые).
**Result:** ✅ `callon "<путь жителя>" Interactable Interact True` открыл разговор наёмника и пузырь коровы — тот же метод, что зовёт
правый щелчок; путь и точку экрана даёт новая команда пульта `comps <Тип> [N]`.
**Lesson:** **разговор в Свароге открывать методом игры `Interactable.Interact` у конкретного жителя, а не `Run()` скрипта и не
мышью:** скрипт без настройки взаимодействия падает, мышь зависит от фокуса и окна.
**Repro:** `h.sh "comps Interactable 8"` → `h.sh "callon \"<путь>\" Interactable Interact True"`.
**Trigger:** любая проверка реплик, торговли, разговора в игре агентом.
**Not for:** проверка самого щелчка мыши по жителю (баг 20) — там нужна мышь.
mechanized: none — почему мышь не дошла до игры, не разобрано

### EXP-0154 · 2026-10-06 · ❌→✅ · #svarogsdream #harness #process #owner-eye
class: act-without-checking-target
**Context:** закрыть игру командой пульта `h.sh "kill"`.
**Tried / did:** послал `kill`, не проверив процесс — владелец уже закрыл игру сам; клиент ждал ответа 180 с.
**Result:** ❌ `[OWNER]` «твой скрипт убивал то, чего нет» · «ибо ты не проверил, открыто ли то, что ты убить хочешь» · 2026-10-06 ≈17:59.
✅ `h.sh` сам проверяет процесс игры до посылки и раз в 2 с в ожидании: «game not running», код 2, за 0,5 с.
**Lesson:** **перед действием над процессом — проверить, что он есть; и делает это инструмент, а не память агента.**
**Repro:** закрыть игру, `bash tools/h.sh "kill"` → до правки 180 с тишины.
**Trigger:** любая команда пульта или убийство процесса.
**Not for:** —
mechanized: SvarogsDream/tools/h.sh (alive(): tasklist до посылки и в цикле ожидания)

### EXP-0153 · 2026-10-06 · ❌→✅ · #svarogsdream #translation #gender #twins
class: twins-missed
**Context:** перевод реплик диалогов Svarog's Dream; героем бывает и женщина (Яна), а английское «you saved me» рода не несёт.
**Tried / did:** перевёл приветствия (357) и выложил; на второй партии (боевые выкрики) заметил «Ты сделал неверный выбор» и
перепроверил уже выложенное.
**Result:** ❌ в приветствиях 16 обращений к герою в мужском роде («Ты меня спас!», «Худой ты больно», «Своё место ты
заслужил»). ✅ класс вычищен по всем файлам партии: «вы» в прошедшем («Вы меня спасли!»), существительное, безличная фраза;
речь говорящего о себе — его родом.
**Lesson:** **к герою — без рода: английское «you» в прошедшем времени по-русски выдаёт пол, а пол героя переводчик не знает.**
Где код сам ветвит пол (him/her, his/her) — свои варианты, остальное — без рода.
**Repro:** `grep -n "Вы меня спасли" SvarogsDream/translation/dialogue_ru.tsv` (до правки — «Ты меня спас!»).
**Trigger:** любая реплика, обращённая к герою, с глаголом в прошедшем или кратким прилагательным.
**Not for:** речь говорящего о себе (стражник «я тебя видел»); строки с ветвлением пола в коде.
mechanized: none — правило предложено владельцу для методички (STYLE §8), машиной не проверяется

### EXP-0152 · 2026-10-06 · ❌→✅ · #svarogsdream #translation #xunity #numbers #recon
class: escaping-layer
**Context:** свой перевод записок Svarog's Dream точными ключами XUnity («Day 1: …», рецепты «…60 minutes…»).
**Tried / did:** записал точные ключи, проверки генератора зелёные; потом увидел в исключениях глоссария машинный ключ
рецепта с «{{A}}» и сверил: в `Config.ini` русификатора `TemplateAllNumberAway=True`.
**Result:** ❌ записки с отдельным числом вне тегов машинный словарь хранит шаблоном («Bake lamb meat for {{A}} minutes…»,
«…round {{A}}.»), а «around 2AM» и цифры внутри тега цвета — как есть; наш точный ключ для 102 текстов мог не сработать.
✅ генератор пишет вторую строку шаблоном, числа русской строки — той же буквой; шаблон рекорда арены совпал с ключом XUnity
по md5.
**Lesson:** **при TemplateAllNumberAway ключ текста с числом — шаблон, а не текст: писать обе строки и сверять форму с ключом,
который записал сам XUnity.** Зелёные проверки своего генератора не знают, как игра ищет ключ.
**Repro:** `grep -a "^Bake lamb" <игра>/AutoTranslator/Translation/ru/Text/_AutoGeneratedTranslations.txt` → «{{A}} minutes».
**Trigger:** любой генератор точных ключей для XUnity, когда в тексте есть числа.
**Not for:** шаблоны-правила `r:` (EXP-0149).
mechanized: SvarogsDream/tools/notes_xunity.py (templated(): строка шаблоном на каждый текст с числом)

### EXP-0151 · 2026-10-06 · ❌→✅ · #svarogsdream #translation #xunity #extract
class: field-dropped-in-rebuild
**Context:** выемка текстов записок из игры (UnityPy) в таблицу — источник ключей словаря.
**Tried / did:** извлекатель брал `text.strip()`; сверил ключи таблицы с машинным словарём побайтно (`od -c`).
**Result:** ❌ указ о Вите в словаре — «…morality.\r\n», в таблице хвост срезан. ✅ ключ — текст как есть; после перевыемки
совпадений по точному ключу 45, а не 44. **Поправка 2026-10-06 17:52 — проверка в игре:** вывод «перевод по такому ключу игра не
нашла бы» был ВЫВЕДЕН из сверки файлов, а не увиден, и он неверен: указ без хвоста перевёлся так же, как с хвостом (в словаре
только форма с хвостом) — XUnity срезает пробельные символы по краям сам (отчёт
`testcases/reports/2026-10-06_svarog-wisdom-font-and-translation-keys.md`, А1).
**Lesson:** **ключ словаря — текст, который игра отдаёт переводчику; хвостовые пробелы и переносы XUnity срезает сам, внутренние —
не проверены, поэтому ключ — как есть.** Сверять выемку с ключами, которые XUnity уже записал сам, — и ЛЮБОЙ вывод «игра не
найдёт» проверять в игре: сверка двух файлов говорит о файлах, а не о том, как игра ищет ключ.
**Repro:** `grep "Be it known" translation/notes_en.tsv | cut -f3 | od -c | tail` против той же строки словаря.
**Trigger:** любая выемка текста из игры под ключи XUnity.
**Not for:** —
mechanized: SvarogsDream/tools/notes_extract.py (без strip(), печать при табуляции в тексте)

### EXP-0150 · 2026-10-06 · ❌→✅ · #svarogsdream #translation #census #recon
class: census-from-observed
**Context:** очередь перевода Сварога строилась по машинному словарю XUnity — по строкам, которые прежний переводчик успел
увидеть в игре; онлайн-перевод выключен.
**Tried / did:** вынул базу предметов игры (`ItemDatabaseObject`, UnityPy; 166 из 721 читаются только без проверки длины схемы) и
сверил каждое имя и описание со словарём.
**Result:** ❌ по словарю дыр не было видно: 335 из 721 имени и 95 описаний в нём не было вовсе — в игре они шли бы
по-английски, а отчёт качества их не видел. ✅ таблица из базы → свой перевод 720/721 + 295/295, генератор печатает покрытие.
**Lesson:** **охват перевода считается по ИСТОЧНИКУ игры (её базам данных), а не по словарю увиденного — словарь показывает,
что криво, но молчит о том, чего нет.** Счёт сверять с самой базой (721 ссылка = 721 строка таблицы), иначе тихо теряется
четверть (схема UnityPy короче данных → ValueError → «не предмет»).
**Repro:** `<python> tools/items_extract.py "<игра>" translation/items_en.tsv` (печатает items 721) →
`<python> tools/items_xunity.py "<игра>"` (печатает names N/721 · descriptions N/295).
**Trigger:** любая база текста в игре с XUnity (предметы, умения, квесты, Альманах) — сначала вынуть базу, потом переводить.
**Not for:** текст, который игра собирает на лету из кусков (там шаблон, EXP-0149).
mechanized: SvarogsDream/tools/items_xunity.py (покрытие по базе при каждой выкладке)

### EXP-0149 · 2026-10-06 · ❌→✅ · #svarogsdream #translation #xunity #regex #recon
class: template-not-instance
**Context:** свой перевод карточки навыка Svarog's Dream при выключенном онлайн-переводе; машинный словарь хранил описание
строкой на каждое увиденное число («Deal <color=#008914>50</color> damage…» → «Сделка 50 урона»).
**Tried / did:** прочёл код карточки (`SpellToolTip`, декомпиляция) — игра подставляет `_AMOUNT_` в шаблон до показа; вынул
шаблоны из базы умений (`SpellDatabase`, UnityPy + TypeTreeGenerator) и сделал правило `r:` на шаблон. Первый `settext` в игре.
**Result:** ❌ «x7 DEX» осталось машинным: в словаре лежал точный ключ `x{{A}} DEX`, а точный ключ XUnity сверяет раньше правил;
вторая строка улучшения («…\nReduce this skill mana cost…») не переводилась — игра склеивает две строки в одну надпись. ✅ генератор
перекрывает каждый совпавший машинный ключ точной строкой и делает правило на склейку. Поправка 14:10: масштабирование
«по-русски» шло только через перекрытые машинные ключи — правило с тегом `<color…>` в образце не срабатывало ни разу («x6 INT»
осталось английским): XUnity (HandleRichText) отдаёт правилу строку с разобранной разметкой, кусок внутри тега — отдельная
строка. ✅ правило на обёртку («Scaling:(.+) per 100 points») и на кусок («x(…) INT») — «Интеллект ×6» на любом числе.
**Lesson:** **текст, который игра собирает кодом, переводится по ШАБЛОНУ из её данных, а не по строкам, которые машина успела
увидеть; правило-регулярка не работает, пока рядом лежит точный ключ того же текста — его надо перекрыть; и в образце правила
не бывает тегов разметки — куски внутри тегов переводятся своими правилами.** Проверять правило на числе, которого нет в
машинном словаре, — иначе «работает» может оказаться точным ключом. Сборку текста
(подстановки, склейки, хвосты) читать в коде игры до перевода.
**Repro:** `settext <поле карточки> Scaling: <color=#308C68>x7 DEX</color> per 100 points.` → `gettext` при машинном `x{{A}} DEX`.
**Trigger:** перевод строк с числами, именами или склейками в игре с XUnity.
**Not for:** постоянные строки без подстановок — им хватает точного ключа.
mechanized: SvarogsDream/tools/spells_xunity.py (перекрытие машинных ключей, правило на склейку)

### EXP-0148 · 2026-10-06 · ❌→✅ · #svarogsdream #translation #layout #owner-eye
class: twins-missed
**Context:** правка обрубков перевода в `zz_krinik.txt` («Закл порядка» → «Заклинания Порядка»).
**Tried / did:** полное слово вместо обрубка, без взгляда в игру.
**Result:** ❌ «Заклинания Порядка» легло на «20 %» (кадр ms0) — обрубок стоял из-за тесного поля. ✅ короче по смыслу: «Порядок:».
**Lesson:** **правка перевода — это правка вёрстки: каждую смотреть кадром в игре; поле не растёт вместе со словом.**
**Repro:** вкладка «Мастерство» (`click UI/CharacterPanel/CharacterPanelHeader/MasteryHeader`), низ справа — подпись и число не касаются.
**Trigger:** любая строка в `zz_krinik.txt`, длиннее прежней.
**Not for:** тексты, которые раскладывает наш мод (их место считает раскладка).
mechanized: none — шаг «каждую правку перевода смотреть в игре» стоит в STATUS «Где продолжить» и в разборе translation-redesign.md

### EXP-0147 · 2026-10-06 · ❌ · #svarogsdream #ui #owner-eye #refs
class: guide-on-shelf-unread
**Context:** цвета и вёрстка статов «Прогресса» — подбирал наугад (бирюза, мята, полосы строк).
**Tried / did:** палитры «на вкус» без образцов.
**Result:** ❌ `[OWNER]` «все какое-то одноображно нежно кремовое...» · «Я ТЕБЕ СКИДЫВАЛ КУЧУ ПРИМЕРОВ КРАСИВЫХ ИНТЕРФЕЙСОВ» · «иди в
библиотеку наших референсов за прекрасным» (≈08:52–08:54). ✅ по `gallery/refs/` (TL2 «Arcane Statistics», окно персонажа WoW,
Ведьмак 3): заголовок раздела выделен, число прижато вправо — и владелец: «да, теперь красиво».
**Lesson:** **перед вкусовой правкой окна — открыть 2–3 образца того же рода из `SvarogsDream/gallery/refs/` и назвать в отчёте,
что взято.** Повтор класса [[EXP-0143]] (пособие по Unity UI): готовое знание лежало рядом и не открывалось.
**Repro:** `ls SvarogsDream/gallery/refs/*/ | grep -i "stat\|character"` — образцы окон статов.
**Trigger:** любая задача «сделать красиво» в Сварог.
**Not for:** механические правки (обрезка, наложение) — там рулбук.
mechanized: testcases/TC_svarog_ui_beauty.md — пункт «Композиция … сравнение с образцом жанра из gallery/refs/» в проходе каждого экрана

### EXP-0146 · 2026-10-06 · ❌→✅ · #svarogsdream #ui #owner-eye #report
class: shown-as-link
**Context:** после смены шрифта открыл владельцу лист из 15 кадров экранов.
**Tried / did:** сырьё вместо находок — «посмотри сам».
**Result:** ❌ `[OWNER]` «ну и что это ты мне открыл за картинку? что мне с этим делать? Ты не ведишь, где плохо?» · «и где нужно
править, двигать, изменять размеры» (≈08:33). ✅ сам назвал поломки экрана, исправил, показал «было → стало».
**Lesson:** **владельцу — только находки и исправленное «было → стало»; лист сырых кадров — рабочий материал агента.**
**Repro:** перед показом картинки ответить себе: какой вопрос владельцу она закрывает; нет вопроса — не показывать.
**Trigger:** собираюсь открыть владельцу лист кадров.
**Not for:** выбор вкуса (лист вариантов шрифта — уместен: «выбери букву»).
mechanized: none — рулбук мода, раздел 10 «кадр было → стало … только после этого — владельцу»

### EXP-0145 · 2026-10-06 · ❌→✅ · #display #dpi #vibepollo #probe #windows
class: shell-lied
**Context:** проверка бага 19 — вернул ли Vibepollo телевизор 4K после отключения владельца.
**Tried / did:** запись `[System.Windows.Forms.Screen]::AllScreens` каждые 5 с из PowerShell.
**Result:** ❌ запись показывала `DISPLAY1 1280x720` и после успешного возврата. ✅ драйвер (`Win32_VideoController`) — 3840×2160
@144; та же проба с `SetProcessDPIAware` — `3840x2160`. Масштаб рабочего стола 300 %: 3840 / 3 = 1280.
**Lesson:** **размер экрана меряется DPI-aware процессом или по `Win32_VideoController`; без DPI-awareness при 300 % 4K выглядит
как 1280×720 — и это не виртуальный экран.**
**Repro:** без `SetProcessDPIAware` и с ним — `Screen.AllScreens` в одном сеансе: 1280x720 против 3840x2160.
**Trigger:** любая проба разрешения экрана на этой машине.
**Not for:** кадр игры — `shot` пульта пишет кадр в размере рендера игры, он от масштаба не зависит.
mechanized: none — строка в досье окружения `AGENT_GUIDE.md` («Display at probe time»)

### EXP-0144 · 2026-10-06 · ❌→✅ · #svarogsdream #ui #unity #harmony #ordering #owner-eye
class: twins-missed
**Context:** плавное скрытие пузыря речи (`PatchYellFadeOut`) откладывает `YellHandler.CloseCanvas` игры на секунду угасания.
**Tried / did:** прошлая сессия чинила пропавший значок над жителем веткой `OnDisable` — по догадке, без кода игры.
**Result:** ❌ значок пропадал снова. ✅ код игры (`Fluent/YellHandler.cs:77`) ищет значок на каждой фразе `GetComponentInChildren`,
который выключенных не видит; отложенное закрытие фразы 1 оставляло значок спрятанным к началу фразы 2 — возвращать было нечего.
**Lesson:** **откладывая функцию игры, прочитай, кто идёт за ней следом и что он ищет: перенос по времени меняет порядок, а
`GetComponentInChildren`/`Find` без `includeInactive` молча теряют спрятанное.** Перед новой фразой — выполнить отложенное
сразу. Проверка «фича или баг»: включить объект пультом и посмотреть, снимает ли его сама игра.
**Repro:** разговор с RockSeller → «Уйти» → `findall RandomConversationMark` через 12 с — `(off)` до `c98a907`.
**Trigger:** патч Harmony, который задерживает или пропускает метод игры (Prefix → false).
**Not for:** крючки Postfix, не меняющие порядок вызовов.
mechanized: none — шаг «прочитать код игры по `acs/` до правки» стоит в досье

### EXP-0143 · 2026-10-06 · ❌→✅ · #svarogsdream #ui #unity #tmp #layout #translation #recon
class: guide-on-shelf-unread
**Context:** свой пузырь речи по тексту (`KrinikUIRework/BubbleBox.cs`): плашка — по размеру реплики.
**Tried / did:** размер считал вручную `GetPreferredValues` по тексту игры, четыре захода: якоря, ширина, перенос, порядок.
**Result:** ❌ первая фраза каждый раз одной строкой шире плашки — перевод (XUnity) подменял строку после подгонки. Владелец:
«может пора тебе руководство по C# почитать? мы для этого его собирали». ✅ В пособии `researches/unity-ugui-layout/` готово:
`pitfall.translator-after-layout` (ровно этот симптом) и рецепт `ugui.csf.fit-group-with-child-text` (группа + ContentSizeFitter,
у текста LayoutElement.preferredWidth = min(ширина без переноса, предел)). Свой текст + рецепт — с первого прогона.
**Lesson:** **перед кодом интерфейса Unity — `grep TAG:` по пособию `researches/unity-ugui-layout/` (и `12_pitfalls.md`) по
словам задачи; ручной размер по тексту в моде с переводчиком — запрещённый путь, размер держит раскладка.** Повтор класса
[[EXP-0142]]: оба урока — «перед кодом посмотри, как это делается по-родному».
**Repro:** реплика жителя с переводом из словаря; размер плашки, посчитанный в момент показа, — строка на экране шире.
**Trigger:** любая задача на вёрстку, текст, размер по содержимому в модах Unity этого проекта.
**Not for:** окна, где перевода нет и текст задаёт сам мод.
mechanized: none — пункт «прочитай пособие» стоит в досье `games/SvarogsDream/README.md`; в STATUS — строка «перед кодом UI»

### EXP-0142 · 2026-10-06 · ❌ · #svarogsdream #ui #unity #bepinex #architecture #flicker #owner-eye
class: repaint-after-build
**Context:** мод интерфейса Svarog's Dream (`KrinikUIRework`) переоформляет окна игры; вечер 2026-10-05/06 владелец ловил
мигание: «словно подмена родного нашим с лагом выполняется», затем кнопка, подсказки, раскрытие квеста — по одному.
**Tried / did:** мод устроен «маляром»: игра строит окно по своему образцу, мод потом находит элементы и перекрашивает —
обходом окна по таймеру (каждый кадр 2 с, дальше раз в 0.5 с) и крючками на отдельные функции; плашки и стрелки ставятся
по ЗАМЕРУ строки. Чинил каждое мигание своим крючком (список квестов, смена вкладок, подсказки).
**Result:** ❌ каждое новое место того же класса мигало снова; замер у новой строки возможен лишь через 1–3 кадра, а обход
замера сломал стрелки. Владелец: «весь вечер не делаем новые моды, а ловим бля баги в старых!» · «поменять нахуй подход!»
**Lesson:** **мод, меняющий вид Unity-интерфейса, правит ОБРАЗЦЫ (префабы в памяти) один раз при загрузке и верстает
средствами раскладки Unity (якоря, LayoutElement, поля) — копии рождаются в нашем виде, подмене негде взяться.**
Перекраска по факту и вёрстка по замеру всегда на кадр позже игры. Повтор класса [[EXP-0128]] («пять правок одного окна =
сигнал сменить способ») — на уровне всего мода: второе мигание того же рода = остановиться и сменить устройство, а не
ставить третий крючок.
**Repro:** `SvarogsDream/tools/flicker.sh <имя> 8 "click …QuestsHeader" "wait 1.5"` — вторая смена кадра через 2–6 кадров.
**Trigger:** проектирую мод интерфейса Unity-игры или чиню второе «мигание» в нём.
**Not for:** то, что игра меняет на ходу (цвет по виду квеста, текст) — там крючок сразу после функции игры, в том же кадре.
mechanized: SvarogsDream/tools/flicker.sh (прибор, не гард: одна смена на действие — критерий приёмки)

### EXP-0141 · 2026-10-05 · ❌→✅ · #mafia2 #input #directinput #harness #menus
class: tool-silent-refusal
**Context:** Mafia II (2010, 32 бит) — пройти меню «Настройки → Видео» и «Загружаемый контент» без начала сюжета.
**Tried / did:** приборы Конана: `input.ps1 -Click` (абсолютный курсор + клик) и `-Key` (`keybd_event` без скан-кода).
**Result:** ❌ курсор игры не двигается; клик срабатывает по ПОДСВЕЧЕННОМУ пункту (вместо «Настройки» открылся выбор
ячейки «Истории»); Esc и Backspace без скан-кода игра не видит — прибор каждый раз печатает «pressed». ✅ SendInput с
`KEYEVENTF_SCANCODE` (`D:\Games\Mafia II Mods\tools\di.ps1 -Scan 0xD0`) — меню идёт клавишами, каждое нажатие видно на кадре.
**Lesson:** **«нажато» в выводе прибора ввода — не наблюдение: после первого нажатия в новой игре снять кадр и убедиться,
что экран сменился.** Игра на DirectInput / сыром вводе требует скан-кодов и относительной мыши; клик в таком меню
выбирает подсвеченное, а не то, что под курсором.
**Repro:** `tools\di.ps1 -Scan 0x01` (Esc) против `input.ps1 -Key 0x1B` в меню Mafia II, кадр `tools\shot.py` после каждого.
**Trigger:** первый заход агентом в меню новой игры.
**Not for:** игры на Slate/UMG и прочие меню на оконных сообщениях — там `input.ps1` работает (Конан).
mechanized: none — проверка «кадр после первого нажатия» — шаг досье игры, не гард

### EXP-0140 · 2026-10-05 · ❌→✅ · #research #recon #epic #sources #owner-eye #svarogsdream
class: recon-by-snippets
**Context:** разведка индустрии под эпик «мир Сварога живёт без героя» (как устроены Рейнджеры, A-Life, Обливион, Кенши, Wayward Realms).
**Tried / did:** шесть поисковых запросов, выводы — по выжимкам поисковика, ни одной прочитанной страницы, ни кода, ни архитектуры; про Wayward Realms написал «не найдено, скорее наоборот».
**Result:** ❌ владелец: «какая-то разведка у тебя убогая и слабая получилась» · «даже примера архитектуры и кода нет» · «это на научный документ тянет, а ты пару сайтиков прочитал только!» · «в сиседнем проекте Unliminium мы документов накачали на целую докторскую!». И «не найдено» оказалось ложью: разработчики Wayward Realms это прямо сказали в своём видео. ✅ переделка: сначала корпус соседнего проекта (Unliminium), затем пять исследователей параллельно по темам, каждый читает первоисточники (декомпиляция SR HD, исходники OpenXRay, PDF Game AI Pro, расшифровки видео), с цитатами; итог — папка из шести документов и архитектура с кодом на C#.
**Lesson:** **разведка под эпик — это прочитанные первоисточники (код, доклады, слова разработчиков) с цитатами, а не выжимки поисковика; «не найдено» по выжимкам — не вердикт.** Перед внешним поиском — свои и соседние корпуса (Unliminium, researches/).
**Repro:** темы → по исследователю на тему с брифом «читать страницы (WebFetch/curl/pdftotext), минимум 8–10 источников, URL + цитата, непроверенное помечать» → сводка в `researches/<тема>/` с архитектурой.
**Trigger:** нужна разведка индустрии под эпик или под вопрос владельца «как это сделано у других».
**Not for:** точечная справка (одна команда, одна версия) — там хватает одного источника.
mechanized: none — правило лестницы `/plan-epic` (разведка до мета-плана) уже есть; не хватило глубины, а не шага

### EXP-0139 · 2026-10-05 · ❌→✅ · #svarogsdream #fps #measurement #streaming #baseline
class: etalon-from-dirty-tree
**Context:** замер правок производительности Svarog's Dream свежими запусками (по EXP-0132), по прогону на вариант.
**Tried / did:** сравнивал FPS прогонов между собой: 23 → 35 → 66 FPS «от правок».
**Result:** ❌ 66 FPS прогона 3 оказались не правкой: герой стоит на мосту на границе участков, центр подгрузки мода
камеры перескакивает 97-100 ↔ 98-100, и внешнее кольцо 5×5 меняет состав — персонажей 87 или 395, растений 100 или 686,
в одном запуске сразу, в другом через минуту. ✅ правки сравнены переключением на лету в ОДНОМ состоянии мира:
18.7 → 27.7 → 29.4 → 30.8 FPS и обратно 29.9. Второе лицо того же класса в тот же вечер (баг 15): пара кадров «блеск
земли есть / нет» снята с разницей 22 с, а солнце игры за это время поднялось (игровой час — 60 с) — «сильная находка»
оказалась восходом и отозвана; честная пара при застывшем времени разницы не дала.
**Lesson:** **свежий запуск не даёт одинакового мира, если мир подгружается вокруг героя: перед каждым замером печатать
счётчики живого (персонажи, растения, рендереры) — разные счётчики значат разные миры.** Правки без побочного состояния
сравнивать переключением в одном мире; запусками — только то, что меняет мир. Свет и картинку сравнивать только при
остановленном времени игры (A → B → A, и A2 обязан совпасть с A).
**Repro:** пульт `perf 6` печатает строку счётчиков; в журнале — `stream=r2 at <ряд>-<столбец> enabledByUs=<N>`; время —
`timescale 0` перед парой кадров, `timescale 1` после.
**Trigger:** сравниваю FPS двух запусков игры с подгрузкой мира участками.
**Not for:** сцены без подгрузки (меню, подземелье одним куском).
mechanized: SvarogsDream/src/KrinikDevHarness/Plugin.cs (perf — счётчики в каждой строке замера; timescale — остановка времени)

### EXP-0138 · 2026-10-05 · ❌→✅ · #svarogsdream #fps #unity #profiler #worldspace #ui
class: per-object-work-every-frame
**Context:** «лагает через минуту и при взгляде вдаль» — Svarog's Dream, свои моды на BepInEx, обычная (не отладочная)
сборка Unity 2020.3.
**Tried / did:** первая мысль — дальность рисовки (трава 500, тени ×3, кусты ×4.5) и подгрузка 5×5. Прибор вместо мысли:
загрузка видеокарты `nvidia-smi`, профайлер Unity из игры (`ProfilerRecorder`), свой профайлер скриптов (Harmony-секундомер
на каждом `Update`), переключатели движковой части.
**Result:** ✅ видеокарта 12–35 % — упор в процессор; дальность рисовки почти бесплатна (кусты 0, тени ~1 мс). Главный груз
— НАШ мод: ≈700 значков в мире, у каждого свой холст, мод каждый кадр двигал каждый — ≈17 мс; отсечение по дальности —
18.7 → 27.7 FPS. Скрипты игры в сумме 3 мс; аниматоры «двигать всегда» вне экрана ~2–4 мс; жизнь ≈400 персонажей кольца
5×5 ≈15 мс. Обычная сборка Unity отдаёт `ProfilerRecorder` только счётчики отрисовки — время скриптов n/a, камеры 0.
**Lesson:** **сначала «процессор или видеокарта» (загрузка видеокарты), потом «скрипты или движок» (свой секундомер на
Update), потом переключатели по одной подсистеме — и только потом правка.** Свой мод, трогающий каждый объект мира каждый
кадр, — первый подозреваемый: холст в мире, у которого каждый кадр меняют масштаб или место, пересобирается.
**Repro:** `h.sh "perf 8" "prof 8 30" "animcull transforms" "perf 6" "farchars 300" "perf 6"` (в SvarogsDream).
**Trigger:** «лагает», «FPS просел» в Unity-игре с нашими модами.
**Not for:** UE4SS/Lua-игры (Палворлд, Конан) — там свои приборы (`_tools/perf-harness`).
mechanized: SvarogsDream/src/KrinikDevHarness/Plugin.cs (perf, prof, animcull, particles, farchars)

### EXP-0137 · 2026-10-05 · ❌ · #stamps #clock #claim #svarogsdream
class: claim-before-evidence
**Context:** быстрый ночной цикл «правка → кадр → отчёт» по эпику 10; в отчёты, планы и комментарии кода шли штампы времени.
**Tried / did:** время писал «на глаз» — каким оно будет к коммиту.
**Result:** ❌ шесть раз за сессию штамп впереди часов (23:40 при 23:38, 23:47 при 23:46, 23:53 при 23:51, 00:01 при 00:00, 00:20 при 00:18, 00:38 при 00:35); один раз остановил страж коммита KUMM, остальные — я сам перед коммитом; комментарии кода SvarogsDream страж не видит вовсе.
**Lesson:** **штамп пишется ПОСЛЕ `date`, а время события — из файла события (`ls -l --time-style=+%H:%M <кадр>`), никогда «как будет».** Быстрый цикл — именно то место, где голова забегает вперёд часов.
**Repro:** `date "+%Y-%m-%d %H:%M %:z"` перед строкой со штампом; для прогона — `ls -l --time-style=+%H:%M _harness/<кадр>.webp`.
**Trigger:** пишу в отчёт, план, статус или комментарий кода строку с временем.
**Not for:** даты внешних событий и поле `Created:` (дата без времени).
mechanized: tools/check-claim-before-evidence.mjs (только коммиты KUMM; репозиторий SvarogsDream не охвачен — кандидат на тот же хук)

### EXP-0136 · 2026-10-04 · ❌→✅ · #svarogsdream #ui #unity #contrast #color #twins
class: text-color-blind-to-background
**Context:** тексту реплик над головами мод ставил чёрный цвет; в бумажных окнах мод осветляет весь тёмный текст под тёмную бумагу.
**Tried / did:** один цвет на все случаи, без взгляда на подложку под конкретным текстом.
**Result:** ❌ над героем — чёрное на его тёмной полосе (`[OWNER]` «чёрный с чёрным текстом» · 2026-10-04 23:10, `bugs/16`); в «Помощи» и «Альманахе» — светлый текст на светлых полосах, контраст 1.67–1.89 (обход меню). ✅ пузырь: цвет по яркости своей полосы — 14.98.
**Lesson:** **цвет текста выбирается по ЕГО подложке, а не по окну и не «всегда такой»: в одном окне встречаются и светлые, и тёмные плашки.** Число контраста с кадра — до показа, не впечатление.   → link: `bugs/16_DONE_*` · лист `SvarogsDream/gallery/game/2026-10-04_вкладки-меню/index.html` (беды 2–3)
**Repro:** `python tools/contrast.py <кадр.webp> x0 y0 x1 y1` (в SvarogsDream) — ниже 4.5 у основного текста = дефект.
**Trigger:** мод красит текст игры (цвет, подъём тёмного) — проверить кадром каждую подложку, на которой этот текст встречается.
**Not for:** свои окна мода с одной подложкой.
mechanized: none — замер `SvarogsDream/tools/contrast.py`; закрытие класса в бумажных окнах — первый пункт порядка работ листа, ждёт слова владельца

### EXP-0135 · 2026-10-04 · ❌→✅ · #svarogsdream #ui #unity #hover #eventsystem #owner-eye
class: hover-state-not-cleared
**Context:** подсветка ответов в разговоре (свои цвета вместо аниматора игры) — «наведён ИЛИ выбран».
**Tried / did:** выбор EventSystem считался вторым источником подсветки — на случай клавиатуры.
**Result:** ❌ `[OWNER]` «остаётся выделение пункта цветом ховера. даже если убрать курсор» · 2026-10-04 23:15: игра при наведении делает пункт выбранным и не снимает выбор. ✅ уход курсора снимает и выбор, поставленный наведением (`bugs/17`).
**Lesson:** **в Unity наведение и выбор — разные состояния, а игры часто ставят выбор наведением; подсветка от выбора живёт, пока его кто-то не снимет.** Проверять подсветку настоящим курсором: навести → увести → кадр + `call EventSystem get_currentSelectedGameObject`.
**Repro:** `tools/mouse.ps1 -X <x> -Y <y> -Button move` → `tools/h.sh "call EventSystem get_currentSelectedGameObject" "shot a"` → курсор в мир → то же; после ухода должно быть `void`.
**Trigger:** свой эффект наведения на элементе игры (`IPointerEnterHandler` + `ISelectHandler`).
**Not for:** элементы без выбора (картинки, тексты без `Selectable`).
mechanized: none — проверка в отчёте `testcases/reports/2026-10-04_svarog-dialogue-hover-sticks.md`

### EXP-0134 · 2026-10-04 · ❌→✅ · #svarogsdream #ui #unity #worldspace #hotreload #dialogue #owner-eye
class: etalon-from-dirty-tree
**Context:** реплики жителей над головами (холст в мире) крупнее по слову владельца; мод грузится горячо (ScriptEngine).
**Tried / did:** множитель от «исходного» размера холста, исходный — в словаре мода при первом показе; затем полоса тянулась под текст.
**Result:** ❌ владелец: «то большие, то огромные» · «можешь их блять угомонить и сделать одного размера?» · «Аааа!!! от масштаба камеры!!!». Три причины: новая сборка после горячей перезагрузки брала уже увеличенный прошлой размер за исходный (×2 × 1.3); игра даёт жителям разный масштаб (0.0029 и 0.0116); пузырь в мире растёт при приближении камеры. ✅ исходные значения — в скрытой дочерней метке на самом объекте (переживает перезагрузку), уже раздутые распознаются по точным множителям; размер — по факту на экране: каждый кадр мерить высоту полосы через камеру и подгонять к 180 px на 4K.
**Lesson:** **«исходное» значение объекта игры читается один раз и хранится НА объекте, а не в памяти мода — иначе каждая горячая перезагрузка берёт за эталон уже изменённое.** Размер всего, что живёт в мире и должно читаться как интерфейс, задаётся мерой на экране, а не множителем: у каждого объекта свой масштаб, и камера меняет его каждый кадр.   → link: `testcases/reports/2026-10-04_svarog-dialogue-dark-paper.md` · `ideas/07` п. 23
**Repro:** в журнале игры `grep -a "bubble " LogOutput.log` — поле `home=` равно исходному игры (0.0029 / 0.0116), а не увеличенному.
**Trigger:** мод меняет размер/цвет объекта игры и грузится горячо; объект живёт в мире, а должен читаться как интерфейс.
**Not for:** свои объекты мода (их исходное — в коде).
mechanized: SvarogsDream/src/KrinikUIRework/Dialogue.cs (метка KrinikHome + KrinikBubbleSize)

### EXP-0133 · 2026-10-04 · ❌→✅ · #svarogsdream #ui #mockup #parity #unity #tmp #linear #owner-eye
class: claim-before-evidence
**Context:** окно предмета Svarog's Dream кодом (Unity UGUI + TMP) по утверждённому HTML-макету; первые кадры в игре.
**Tried / did:** сравнил кадр игры с макетом на глаз и сказал «почти как макет»; владелец: «в макетах … сильно ровнее и красивее», «разве ты не видишь, что плохо?», «неужели я вижу, что макет красивее сильно, а ты не видишь?».
**Result:** ❌ «почти» было впечатлением. ✅ сличение ЦЕЛЫХ окон в одном разрешении (макет в 4K, `deviceScaleFactor: 3`) и мерка DOM макета вскрыли шесть причин сразу: синтетический жирный TMP прибавляет `boldSpacing` к каждой букве (браузер — нет); игра смешивает полупрозрачное в ЛИНЕЙНОМ пространстве (зебра 5.5 % белого: браузер #2f, игра #4b) — подложки считать заранее поверх цвета карточки; у `VerticalLayoutGroup` `childForceExpandHeight` по умолчанию true — группа объявляет себя гибкой и забирает пустоту; ряд плиток делится поровну только при `preferredWidth = 0` + `flexibleWidth = 1`; CSS `line-height` в TMP — полями и `lineSpacing` по метрикам шрифта; колонки макета — max-content каждой карточки (343.25 и 368), а не общая. Итог владельца: «стало красиво!».
**Lesson:** **соответствие макету утверждается только сличением: оба кадра в одном разрешении, целиком, рядом, плюс числа из DOM макета; «почти как макет» без этого — заявление шире наблюдения.** HTML → Unity UI не переносится 1:1 по значениям CSS: цветовое пространство, синтетический жирный и умолчания групп раскладки — три ловушки, которые невидимы в коде и видны только на паре кадров.   → link: `testcases/reports/2026-10-04_svarog-item-window-parity.md` · `ideas/08` Р34–Р42 · `researches/unity-ugui-layout/` (пособие)
**Repro:** `node tools/shoot_mockup.mjs _harness/mock.webp boots lines --measure` → `h.sh "hover <слот>" "shot game"` → `python tools/pair.py _harness/mock.webp _harness/game.webp _harness/pair.webp --view 0.35` (в SvarogsDream).
**Trigger:** код по утверждённому макету показан в игре; хочу написать «как в макете» / «почти как макет».
**Not for:** вкусовые варианты без макета (там вердикт владельца по листу вариантов, `EXP-0131`).
mechanized: SvarogsDream/tools/shoot_mockup.mjs + SvarogsDream/tools/pair.py

### EXP-0132 · 2026-10-04 · ❌→✅ · #svarogsdream #fps #measurement #hotswitch #baseline
class: etalon-from-dirty-tree
**Context:** цена дальности рисовки в FPS (владелец: «fps сильно просел»); рычаги камеры переключались пультом `cfg` в запущенной игре.
**Tried / did:** замер «всё новое» → переключение травы 750 → 250 на лету → замер: 54 → 26 FPS, обратно на 750 — всё равно 22; выглядело, будто дешёвая настройка дороже дорогой.
**Result:** ❌ горячее переключение само портило состояние (пересборка травы, подгрузка участков не откатывалась); владелец: «переключения на горячую что-то ломают». ✅ свежий запуск на каждый вариант (`fpsrun.sh`: правка cfg → запуск → ракурс → `wait 30` → `fps 8` → `kill`): 250 → 76, 750 → 56, все прочие рычаги — 0.
**Lesson:** **цена настройки меряется со свежего запуска, а не переключением на лету: горячее переключение — это ещё одно изменение состояния, и оно попадает в замер.** Первый замер «через 20 с после входа» тоже грязный: мир ещё догружается.
**Repro:** вариант на запуск, одинаковый ракурс пультом (`TestFaceSun 15 0`), `wait 30` после входа, `fps 8` (средний и 1 % худших).
**Trigger:** нужно сравнить FPS двух настроек мода.
**Not for:** настройки без побочного состояния (цвет, яркость) — их можно сравнивать на лету.
mechanized: none — прибор `fps` в пульте `SvarogsDream/src/KrinikDevHarness/Plugin.cs`; сценарий `fpsrun.sh` жил в скретчпаде

### EXP-0131 · 2026-10-04 · ❌→✅ · #mockup #taste #owner-eye #showing #html
**Context:** HTML-макет своего окна предмета Svarog's Dream для выбора владельцем (дом стиля NDim: один файл, кнопки вариантов, съёмка Playwright).
**Tried / did:** первый круг — разбор 46 карточек, шрифт и цвета из игры, четыре варианта, 26 кадров и правки до показа: ≈40 минут без единого показа.
**Result:** ❌ владелец: «ты мне собираешься черновик показать? почему так долго? это же просто макет?». ✅ дальше — короткие круги: его фраза → правка → съёмщик (кадры + проверка координат окна) → один взгляд на кадр → открыть страницу; 15 кругов за час, итог — «Твой дизайн ОЧЕНЬ НРАВИТСЯ!!!!».
**Lesson:** **макет показывать ранним черновиком, доводить кругами по слову владельца; моя проверка перед каждым показом — одна: прибор координат (окно в границах) + один кадр глазом, а не весь лист.** Вкус решает он ([[EXP-0128]]); долгая шлифовка до первого показа — шлифовка не того.
**Trigger:** делаю макет или любой вкусовой артефакт для владельца.
class: artifact-for-eye-unchecked
mechanized: none — съёмщик макетов был разовым скриптом в scratchpad (`shoot.mjs` по образцу `ndim/tools/shoot-mockups.mjs`)

### EXP-0130 · 2026-10-04 · ❌ · #refs #research #images #showing #owner-eye
**Context:** галерея образцов интерфейсов для мода Svarog's Dream; цель — карточки предметов крупных игр.
**Tried / did:** скачал скриптом 33 кадра (база Interface In Game, промо Steam), глазом посмотрел два, остальные положил в галерею и в таблицу «чему учимся» по названиям файлов.
**Result:** ❌ владелец: «то, что ты добавил по torchlight-ii не отображает карточки предметов — разве ты не проверил?», «world-of-warcraft тоже» — проверка листом миниатюр: карточка есть на 14 из 33. Он же за минуту нашёл нужное поиском картинок Google «world of warcraft item ui». Кадры помечены `card__`/`other__` («убирать не нужно, а помечай»).
**Lesson:** **искать образцы ЭЛЕМЕНТА поиском картинок по имени элемента («<игра> item tooltip»), а не базами полных экранов; каждый скачанный кадр — глазом, листом миниатюр, ДО таблицы выводов.** Повтор класса [[EXP-0081]]: «файл скачан» ≠ «в файле то, что нужно».
**Trigger:** собираю примеры чужого интерфейса для владельца.
class: artifact-for-eye-unchecked
mechanized: none — правило в `SvarogsDream/gallery/refs/README.md` («Как искать»); лист миниатюр — разовый скрипт

### EXP-0129 · 2026-10-04 · ❌→✅ · #hdr #screenshot #capture #windows #ffmpeg #showing
**Context:** владелец открыл чужие игры (For The King, Beyond the Map) и попросил снять их экран для галереи примеров; рабочий стол у него в HDR.
**Tried / did:** (1) GDI `CopyFromScreen` — кадр 1280×720 (масштаб 300 %) и **засвеченный**; (2) Game Bar Win+Alt+PrtScn — выключен, файла нет; (3) NVIDIA Alt+F1 синтетическими клавишами — оверлей их не ловит; (4) после первого HDR-снимка BtM в кадре оказался VS Code — окно игры не вышло вперёд, а кадр ушёл в галерею.
**Result:** ✅ `ffmpeg -f lavfi -i "ddagrab=output_idx=0:output_fmt=rgbaf16,hwdownload,format=rgbaf16le" -frames:v 1 -f rawvideo` — сырой линейный scRGB 16 бит (3840×2160×8 байт) → тонмап: деление на уровень белого (99.5-й перцентиль яркости), мягкое сжатие светов, sRGB. Цвета как на экране владельца. Плюс проверка «вперёд вышла именно игра» до съёмки.
**Lesson:** **на HDR-рабочем столе любой 8-битный захват (GDI, BitBlt, обычный DDA) врёт яркостью — снимать только в float и тонмапить самому; а кадр для глаза проверяется глазом ДО того, как лечь в галерею** ([[EXP-0081]]: «файл создан» ≠ «в файле то, что заказано»). Свои Unity-моды снимаются изнутри движка (`ScreenCapture`) — там HDR нет вовсе.
**Repro:** `SvarogsDream/tools/shot-hdr.ps1 -Process <exe> -Out x.raw` → `tools/hdr2webp.py x.raw 3840 2160 out.webp`.
**Trigger:** нужен снимок чужой игры или любого окна на машине владельца.
**Not for:** кадры собственных модов Unity — там пульт `shot`.
class: hdr-washed-desktop-capture
mechanized: SvarogsDream/tools/shot-hdr.ps1 (float-захват, отказ при чужом окне впереди)

### EXP-0128 · 2026-10-04 · ❌→✅ · #ui #layout #unity #taste #owner-eye
**Context:** правка окна сравнения предметов Svarog's Dream: мерил строку → двигал элемент → снимал → следующая правка.
**Tried / did:** «абсолютная вёрстка» по одному элементу: ужать строку, перенести строку, расширить карточку, сдвинуть плашку, склеить фоны. Каждая правка рождала новую поломку (монетка вне коробки, щель под «Надето», разные размеры названий, плавающая дыра), а проверял я «влезло ли», а не «красиво ли» — владелец: «неужели ты не видишь!!!», «почему я вижу, а ты не видишь».
**Result:** ✅ владелец сформулировал корень: «вёрстка должна быть динамичной, почти как HTML» — решение: своё окно на движке раскладки Unity (Layout Groups, ContentSizeFitter) по образцам гигантов (Diablo IV, FTK, Beyond the Map — `SvarogsDream/gallery/refs`).
**Lesson:** **окно, свёрстанное игрой вручную, не чинится точечными сдвигами — каждое исправление ломает соседа; пять правок одного окна подряд = сигнал перейти на движок раскладки.** И кадр для глаза оценивается как КОМПОЗИЦИЯ (пустоты, единый размер, баланс, всё ли «прилеплено»), а не только «ничего не обрезано»; до вёрстки — образцы лучших игр жанра.
**Trigger:** третья правка подряд одного и того же окна интерфейса; владелец говорит «плохо», а я не вижу почему.
class: point-fix-layout-cascade
mechanized: SvarogsDream/docs/UI_RULEBOOK.md (правило В8 + чек-лист раздела 10)

### EXP-0127 · 2026-10-04 · ❌→✅ · #svarogsdream #unity #bepinex #xunity #imgui #perf #diag
class: plugin-loaded-but-not-running
**Context:** своя сборка Svarog's Dream (Unity 2020.3 Mono) на BepInEx 5 рядом с русификатором XUnity (ReiPatcher): моды картинки, камеры, меню, интерфейса.
**Tried / did:** пять промахов подряд, каждый закрыт наблюдением, не догадкой: (1) прелоадер упал на старом `MonoMod.Utils` из `Managed` русификатора; (2) плагины «loaded», Harmony-патчи работали, а `Update` не шёл ни разу; (3) файл ресайза XUnity без единого срабатывания; (4) трава исчезала при отдалении, хотя `detailObjectDistance` = 250; (5) фризы раз в 2–5 с.
**Result:** ✅ (1) `doorstop_config.ini` → `dll_search_path_override = BepInEx\core`; (2) `BepInEx.cfg` → `HideManagerGameObject = true` (игра уничтожала `BepInEx_Manager`); (3) путь в `*resizer.txt` — от КОРНЯ сцены (`UIResizeAttachment.TryGetUIResize` бросает поиск на первом несовпадении), команда родителя наследуется детьми; (4) траву гасит не Unity, а шейдер Nature Shaders `_ScaleFade` = (100, 20) у материалов; (5) `Resources.FindObjectsOfTypeAll` по таймеру → только по событиям (загрузка сцены, смена числа террейнов, настройка).
**Lesson:** **«loaded» в журнале — не доказательство работы.** Каждый мод с первого дня пишет пульс (`alive:` при первом реальном `Update`) и строку состояния с ФАКТИЧЕСКИ поставленными значениями — молчание тогда видно сразу; так и пойманы (2) и bloom 11 на паузе. Дорогие поиски по всей игре — никогда по таймеру. Чужой конвейер (XUnity, шейдер) — читать его исходник/материалы до второй попытки.   → link: `D:\work\ai_sandbox\SvarogsDream` · `src/Shared/KrinikDiag.cs` · `researches/svarogs-dream/README.md`
**Repro:** `grep -E 'alive|status|event' "<игра>/BepInEx/LogOutput.log"` после выхода из игры.
**Trigger:** новый плагин BepInEx / Unity-мод в чужой игре; «мод не работает», а журнал говорит «loaded».
**Not for:** UE4SS/Lua-моды Палворлда и Конана — там другой загрузчик и свои грабли.
**Mechanization:** протокол `KrinikDiag` (пульс, состояние раз в 30 с, события) в сборке; `HideManagerGameObject` и путь поиска Doorstop — в `_config/` сборки.
mechanized: D:\work\ai_sandbox\SvarogsDream\src\Shared\KrinikDiag.cs (репозиторий svarogs-dream-modpack)

### EXP-0126 · 2026-10-03 · ❌→✅ · #gtasa #recon #catalogue #textures #modloader #mixsets
class: catalogue-label-instead-of-decision
**Context:** владелец просил паки HD-текстур для своей сборки GTA SA (Vanilla Overhaul); я проверил один (RoSA), а четыре других отдал списком с припиской «совместимость не проверял».
**Tried / did:** после слов владельца [OWNER] «Их совместимость с вашей сборкой я не проверял. Почему? Считаешь, что нахуй надо работать?» · 2026-10-03 — открыл страницу и список файлов каждого, RoSA скачал и сличил с деревом modloader скриптом (TXD-имена, IMG-каталоги, txdp).
**Result:** ❌ первая выдача была ложной по сути: три «пака» — целые перепакованные игры (11.7 · 17 · 28.8 ГБ), один — модпак со снятой страницей Nexus, пятый (настоящий) без файлов. ✅ RoSA измерен: весь в `.img`, а modloader всегда ставит `.img` ниже отдельных файлов → видна половина (1971 из 4012), белых текстур нет. Время жизни дропа (следующая просьба) уже было ключом в MixSets — заплатка не понадобилась.
**Lesson:** **пункт списка с пометкой «не проверял» — это недоделанная работа, а не честность.** Каждая строка каталога несёт решение: что это · как ставится · что требует · подвох. «Пак текстур» на ModDB проверяется по списку файлов («full version», «unrar and play» = целая игра). И перед своей заплаткой — грепнуть уже стоящие конфиги (MixSets, OLA) по ключу.   → link: `researches/gtasa-graphics/README.md` §4a–4b · `games/GTASanAndreas/README.md` · память `catalogues-need-decisions-not-labels`
**Repro:** `python rosa_vs_vo.py <RoSA>` и `rosa_gaps.py` (скретчпад 2026-10-03, логика описана в §4b) · `grep -n -i pickup modloader/Gameplay/MixSets.ini`.
**Trigger:** собираю список вариантов для владельца и хочу написать «не проверял» / «не смотрел» у любой строки.
**Not for:** списков, где владелец сам просил только названия.
**Mechanization:** `none-cheap: правило в памяти уже было (catalogues-need-decisions-not-labels); текст ответа владельцу не ложится на диск, машине его не проверить — держит только проход по строкам до отправки`.

### EXP-0125 · 2026-10-02 · ❌→✅ · #conan #retoc #uassetapi #versions #tools #falseok #levelmod
class: tool-silent-refusal
**Context:** пересборка `KrinikLevelUncapped` под Конан 2.2.3 (UE 5.8): retoc 0.1.5 знает версии только до UE5_7, досье велело «после 2.2.0 — собирать китом».
**Tried / did:** вместо кита — проба кругом без правок на доноре MrS 1.0.5 (сварен под 5.8): `to-legacy UE5_7` → `to-zen UE5_7`, распаковка UnrealPak кита и сверка пакетов. Потом UAssetGUI `tojson`.
**Result:** ✅ у трёх таблиц `.uexp` и `.uheader` байт в байт как у донора. ❌ UAssetGUI на ассете 5.8 вышел с кодом 0, ничего не напечатал и JSON не записал. Контроль на доноре 1.0.4 (5.6) — JSON пишется, то есть инструмент жив. Сверка заголовков 5.6 и 5.8 одной таблицы: отличается ОДНО поле, FileVersionUE5 1017 → 1018 (смещение 16). ✅ подмена версии на входе и возврат на выходе — сборка прошла все проверки скрипта, в игре шкала опыта совпала с генератором.
**Lesson:** **«нужен новый инструмент» проверяется кругом без правок на свежем образце, а не по списку поддерживаемых версий.** Список retoc кончался на 5.7, а формат таблиц в 5.8 не менялся. И отдельно: код 0 без вывода — не успех; прибор, зовущий чужую утилиту, проверяет её АРТЕФАКТ (файл есть), а не код возврата.   → link: `_config/devkit/build-level-mod.py` (`set_ue5_version`, `uasset_json`) · `plans/09_conan_pereezd_2.2.3.md` · [[EXP-0109]] · [[EXP-0116]]
**Repro:** `retoc to-legacy --version UE5_7 --filter <мод> <представление> <out>` → `retoc to-zen --version UE5_7 <out> <x.utoc>` → `UnrealPak <x.utoc> -Extract <dir>` для обоих и пофайловое сравнение.
**Trigger:** новая версия движка и утилита «её не поддерживает» → сперва круг на образце новой версии; утилита молчит с кодом 0 → контроль на старом образце и сверка заголовков.
**Not for:** ассетов с изменённой сериализацией (блюпринты — у них круг НЕ сошёлся; для них путь — кит).
**Mechanization:** `guard: build-level-mod.py — uasset_json падает с текстом, если UAssetGUI не записал JSON; set_ue5_version проверяет прежнее значение поля`.
mechanized: D:\work\ai_sandbox\ConanExiles\_config\devkit\build-level-mod.py (uasset_json, set_ue5_version)

### EXP-0124 · 2026-09-25 · ❌→✅ · #conan #recon #mods #workshop #nexus #versions
class: claim-before-evidence
**Context:** разведка 18.09 и повторная 25.09 — какие моды сборки Конана пересобраны под 2.2.x. Прибор `check-mod-updates.py` спрашивает каждый мод в ОДНОМ источнике — там, откуда он записан в манифест.
**Tried / did:** 18.09 разведка записала Immersive Warriors Enhanced «единственной настоящей потерей», а More Katanas — отставшим: их страницы Nexus не обновлялись с августа. 25.09 я повторил этот вывод владельцу в чате.
**Result:** ❌ вывод был шире наблюдения: наблюдалась страница Nexus, а утверждалось про мод. Во `modinfo.json` внутри обоих паков лежит `steamWorkshopFileIds` — у авторов есть копии в Мастерской, и обе перевыложены после патча (More Katanas 1.1.2 — 16.09, IWE 1.1.0 — 21.09). ✅ скачал обе анонимным steamcmd в скретчпад и прочёл заголовки `zen_versions.py`: UE5 **1018** у обеих (у прежней копии More Katanas с Nexus — 1017; у IWE с Nexus заголовок не читался, по `modinfo.json` кит 1001 → 1002). Настоящих потерь из пяти отставших осталась одна (Doubled Storage Size, удалён из Мастерской).
**Lesson:** **дата на одной витрине — не состояние мода.** Авторы Конана часто выкладывают в Мастерскую и на Nexus, и витрины расходятся на недели. Прежде чем назвать мод «не пересобранным», прочитать `steamWorkshopFileIds` из его `modinfo.json` и спросить каждый id. А решающий признак — не дата, а версия пакета в заголовке: UE5 1017 — сварено под 2.1.x, 1018 — под 2.2.x.   → link: `researches/conan-2.2.0-gotovnost/README.md` (поправка 25.09) · `games/ConanExiles/README.md` · [[EXP-0109]]
**Repro:** `repak get <мод>.pak ConanSandbox/Mods/modinfo.json` (или `UnrealPak <мод>.pak -Extract <папка>`) → поле `steamWorkshopFileIds`; каждый id — в `GetPublishedFileDetails`; сомнение в «пересобран» снимает `UnrealPak <Мод>-Windows.utoc -Extract <папка> -Filter=*/DT/*` и `python _config/devkit/zen_versions.py <таблица>.uheader`.
**Trigger:** пишешь «не пересобран», «отстал», «потеря» про чужой мод → сперва все витрины из `modinfo.json`, потом заголовок.
**Not for:** модов, у которых в `modinfo.json` один источник, — там дата витрины и есть лучший доступный ответ (с оговоркой прибора: свежая дата не доказывает, что мод работает).
**Mechanization:** `none-cheap: страж штампов (tools/check-claim-before-evidence.mjs) этот вид не видит; механизм — второй источник в самом приборе check-mod-updates.py (чтение steamWorkshopFileIds), он записан в досье шагом дня переезда`.

### EXP-0123 · 2026-09-25 · ❌→✅ · #windows #curl #python #subprocess #nexus #tools
class: shell-lied
**Context:** прибор готовности модов Конана зовёт `subprocess.run(["curl", ...])` для страниц Nexus; 25.09 он пометил «НЕ ПРОЧЁЛ» все восемь модов Nexus, хотя 18.09 читал их.
**Tried / did:** тот же URL и та же строка браузера из bash — `200`; из Python — `403`. `shutil.which("curl")` из Python показывал Git curl.
**Result:** ❌→✅ `CreateProcess` на Windows ищет голое имя в System32 РАНЬШЕ, чем в `PATH`: из Python приходил `C:\Windows\System32\curl.exe` (8.21.0), и ему Nexus отвечает 403; Git curl (8.4.0) получает страницу. Обёртка с явным путём дала 40 из 45 и «Не прочитано: 0». Почему 18.09 работало: curl в System32 датирован 2026-08-05, раньше рабочего прогона, — значит, скорее всего, поменялась сторона Nexus (точно не установлено).
**Lesson:** **голое имя программы в `subprocess` на Windows — не то, что видишь в оболочке.** `which` и `shutil.which` читают `PATH`, а запуск идёт по порядку `CreateProcess`, где System32 первый. Проверка «из bash работает» ничего не говорит о том, что запустит Python. Внешний инструмент в приборе — по явному пути, и печатать, какой взят.   → link: `bugs/13_conan_checker_nexus_403_system32_curl.md` · [[EXP-0116]]
**Repro:** `python -c "import subprocess;print(subprocess.run(['curl','-V'],capture_output=True).stdout.decode().splitlines()[0])"` — строка `(Windows)` значит System32; сравнить с `curl -V` из оболочки.
**Trigger:** пишешь `subprocess.run(["<имя>", ...])` в приборе под Windows → явный путь или печать `-V` в шапке прогона.
**Not for:** программ, которых в System32 нет (`python`, `git`, `node`) — у них порядок поиска не подменяет бинарник.
**Mechanization:** `none-cheap: первый удар класса по этой грани; починка прибора (явный путь + печать в шапке) — критерий приёмки бага 13`.

### EXP-0122 · 2026-09-18 · ❌→✅ · #owner #questions #archaeology #kaif #feedback
class: question-already-answered
**Context:** closing the KAIF 2.7 update; the final chat reply listed three things "awaiting your word": two guards against my own repeated errors, sending the field report upstream, the prayer cadence (interview #001 Q2).
**Tried / did:** put all three to the owner in the tail of a chat message — labels in my vocabulary, links instead of the matter, no scenario, nothing searched first.
**Result:** ❌ the owner answered with questions: «Что тебе KAIF обо всём этом говорит, к чему тебя обязывает?» and «тебе каиф не говорит, что отчёты в исток идут без слов владельца?» — then ordered it written into the report that he had to rub my nose in it. The search I then ran settled two of three without him: the guards (the canon's "two strikes → a mechanism"; his 2026-09-12 «кодом, проверками, хуками»), the report (origin #15; this project's own #48 "under the standing authorization"; 18 field reports upstream). The third was a real owner setting — and `review.mjs --queue --list` showed it waiting 13 days, NEVER shown. ✅ guards built, report and ticket delivered (#79, #78), Q2 shown properly.
**Lesson:** "awaiting your word" is a CLAIM that the canon and the owner's past words do not already decide the matter — the same claim the 2.7 archaeology door checks for interviews, and a chat reply passes no door. Run the search per ask BEFORE writing the line; what survives goes to `interviews/` as a scenario and is shown, the rest is done.   → link: `bugs/KAIF/05_*` (origin #78) · `reports/KAIF_UPDATES/KUMM_KAIF_2.7_UPDATE_REPORT.md` R6 · `interviews/interview_001_delivery-metric.md`
**Repro:** `node .kaif/tools/contour/review.mjs --queue --list` (a NEVER SHOWN line = a question owed); per ask: `grep -rniE "<the ask's words>" interviews/ GOAL.md MASTER_PLAN.md plans/ AGENT_GUIDE.md` and, for anything about KAIF itself, `gh issue list --repo MikalaiKryvusha/KAIF --state all --search "<words>"`.
**Trigger:** typing «ждёт вашего слова», «awaiting your word», «shall I», «отправлять ли» in a reply → stop and run the Repro for each item.
**Not for:** task-level ambiguity about what the owner meant RIGHT NOW (fable Step 0: one pointed question with a recommendation).
**Mechanization:** `none-cheap: first classed strike of this class in this journal — no fate owed yet; the machine for the chat surface does not exist (the reply never lands on disk); an improvement request for a Stop-time check is filed upstream as origin #82 (bugs/KAIF/08_*)`.

### EXP-0121 · 2026-09-18 · ❌→✅ · #claims #stamps #tested #judge
class: claim-before-evidence
**Context:** KAIF 2.5 → 2.7 update; writing a guard header, two tickets, a run report and the field report in one long session.
**Tried / did:** typed a fact INTO a document before the observation that would produce it — FIVE times in one session: a `[TESTED]` marker with "25 lines in two files" before the guard ever ran (the run said 121 in 11); a DONE stamp `18:25` typed at 18:15; a correction stamp `≈18:35` typed at 18:18; a run-report `Создан 18:20` typed at 18:16; "run 4" named in a tool header before run 4 existed. And one claim WIDER than its observation: "the live pass is byte-equal to the rehearsal" — observed were equal counters, a byte-identical task file and a 3-line log diff; the TREES differed in line endings (sandbox CRLF from `git archive` under `autocrlf=true`, live LF).
**Result:** ❌ every one of them read as plausible. ✅ two caught by my own read-back, three stamps and the "byte-equal" sentence by an INDEPENDENT clean-context judge (finding F1, F4) — before the commit.
**Lesson:** writing about a run and running it are two acts, and the writing hand is faster. The same session that had just recorded this lesson repeated it ten minutes later — and twice more while BUILDING the guard against it (`[TESTED]` in the headers of two unrun tools; a DONE stamp `20:14` typed at 20:13) — text does not hold this class. What held it: a judge who re-ran everything and compared my stamps with `ls -l` and the GitHub comment time; now also the commit gate. And one more face the same evening: the guards' FIRST version carried honest `[TESTED]` markers over real runs — and a universal claim ("refuses a heredoc whose body carries a backslash") over a 10-case set; a second judge walked past it with `<<\EOF`, live. A claim is as wide as the case set behind it: the fix was a suite in the repository (`tools/test-guards.mjs`) that goes red on the first version.   → link: `ideas/06_DONE_strazhi_ot_lzhi_obolochki_i_chasov.md` · `reports/KAIF_UPDATES/KUMM_KAIF_2.7_UPDATE_REPORT.md` §5 · `testcases/reports/2026-09-18_claim-and-heredoc-guards.md`
**Repro:** `date '+%Y-%m-%d %H:%M %:z'` immediately BEFORE typing any stamp, paste its output; for a number — the command's output is on screen before the sentence is written. Check after the fact: `ls -l --time-style='+%H:%M:%S' <file>` against the stamps inside it.
**Trigger:** fingers on `[TESTED`, `Created:`, `Создан:`, `STATUS: DONE (`, "byte-equal", "identical", or any count → stop, run, paste.
**Not for:** the owner's quoted dates and external events (a release time from `gh release view`) — those are copied, not observed by me.
mechanized: tools/check-claim-before-evidence.mjs
<!-- The two mechanical halves (a today-stamp ahead of the clock; a dated [TESTED marker without an existing run report) run in tools/hooks/pre-commit since 2026-09-18. The rest of the class (a stamp in the past, a claim wider than its observation) has no cheap machine — the independent judge pass stays its mechanism. -->

### EXP-0120 · 2026-09-18 · ❌→✅ · #shell #heredoc #backslash #windows
class: escaping-layer
**Context:** KAIF update; a Node merge script written to the scratchpad through a QUOTED bash heredoc (`cat > f.mjs <<'EOF'`).
**Tried / did:** trusted the quoted heredoc to carry the text verbatim — although [[EXP-0029]] and the agent's own memory note both say it does not on this machine.
**Result:** ❌ `\\` collapsed to `\`: the fill `'.\\Deploy-ModPack.ps1'` became `'.\Deploy-ModPack.ps1'` (JavaScript then drops the backslash: `.Deploy-ModPack.ps1`), and a regex class `[\\/]` lost a level. ✅ caught by grepping the written file before the first `--write`; rewritten with the Write tool, backslash built as `String.fromCharCode(92)`. SECOND strike of this class.
**Lesson:** a second strike means the text failed — this rule is known, recorded twice, and was still broken under load. It needs a machine, not a third sentence.   → link: [[EXP-0029]] · `ideas/06_DONE_strazhi_ot_lzhi_obolochki_i_chasov.md`
**Repro:** `grep -n 'Deploy-ModPack' <the file you just wrote>` — one backslash where you typed two = the layer ate it.
**Trigger:** a script body contains `\` → the Write tool; a backslash INSIDE generated code → `String.fromCharCode(92)`.
**Not for:** pure-ASCII bodies without backslashes — a quoted heredoc carries them fine.
mechanized: tools/hooks/no-backslash-heredoc.mjs
<!-- A PreToolUse hook on Bash, wired in .claude/settings.local.json on 2026-09-18; a live call with a backslash in a heredoc body was refused by the harness in the same session. A new clone must add the hook entry to its local settings again (AGENT_GUIDE → Tools). -->

### EXP-0119 · 2026-09-18 · ❌→✅ · #shell #eol #grep #windows
class: shell-lied
**Context:** KAIF update; deciding which line endings a merge script must write back.
**Tried / did:** measured with `grep -c $'\r' <file>` in Git Bash and built a table "every file is CRLF" from it.
**Result:** ❌ grep reported 116 CR lines for a file with ZERO CR bytes — `autoloop`, `dayloop` and `AGENT_GUIDE.md` are LF. ✅ caught when the merge script's own count disagreed; resolved by counting bytes.
**Lesson:** on this machine the shell is not a measuring instrument for bytes. Bytes are counted by a program that reads bytes — or by git, which already knows.   → link: `AGENT_GUIDE.md` → Document & text hygiene, face 4
**Repro:** `git ls-files --eol -- <file>` (columns `i/` index, `w/` working tree) — or `node -e "const s=require('fs').readFileSync(process.argv[1]);let cr=0,lf=0;for(const b of s){if(b===13)cr++;if(b===10)lf++}console.log('CR',cr,'LF',lf)" <file>`.
**Trigger:** about to decide anything by line endings → `git ls-files --eol`, never `grep $'\r'`.
**Not for:** files outside a git tree — there only the byte count works.
mechanized: git ls-files --eol

### EXP-0118 · 2026-09-18 · ✅ · #kaif #update #fills #ticket
class: claim-before-evidence
**Context:** the 2.7 task handed `/autoloop`, `/dayloop`, `/nightloop` to the hand again although 2.6 promised that files differing only by hand-filled slots are replaced mechanically ([[EXP-0035]] predicted they would keep coming).
**Tried / did:** read `fills` in the new `.kaif/deploy-manifest.json` (→ `{}`), read `deriveFills`/`matchFills` in the core, then RAN the core's own `matchFills` lifted verbatim on a one-line module with and without `<pack>` in the value.
**Result:** ✅ cause proven, not guessed: the capture is `[^\n<>]+?`, so a fill that contains a bracketed argument (`-PackDir <pack>`, `-m "<msg>"`) unmatches the WHOLE module and the plain neighbour slot is not learned either. Filed and delivered as origin #73 (`bugs/KAIF/04_*`).
**Lesson:** a mechanism suspected in someone else's code is cheap to confirm by lifting the function and calling it — twenty lines, one minute, and the ticket carries an output instead of a theory.   → link: `bugs/KAIF/04_fills_with_angle_brackets_never_derived.md` · origin #73
**Repro:** `node tools/kaif-update-probe-matchfills.mjs .kaif/kaif-core.mjs` → `null` for the value with `<pack>` while #73 is open; both slots learned once upstream fixes the capture.
**Trigger:** writing "most likely cause" into a ticket about foreign code → lift the function and run it before the sentence is written.
**Not for:** functions with heavy closure state — lifting costs more than reading; then quote the lines and say "read, not run".
**Mechanization:** `none-cheap: the fix belongs upstream (#73); until then expect the three loop skills as hand items and merge them with tools/kaif-update-merge-skills.mjs (check its FILES and FILLS against the new interval first)`.

### EXP-0117 · 2026-09-18 · ✅ · #kaif #update #renames #guard #sandbox
class: field-dropped-in-rebuild
**Context:** KAIF 2.5 → 2.7 by the bootstrap route; the pass exited 0, `check` was green, the live run matched the sandbox byte for byte — and two modules had silently lost their upstream delta.
**Tried / did:** did NOT stop at the task list: extracted both release bundles and diffed EVERY deployed file against the 2.7 template. `/end-chat-soft` Step 1 (the `kaif-experience-lint` run, the `check --gate-budgets` door) and `/end-chat-force` Step 1 (the standing-falsehood line) were absent from disk AND from `KAIF_UPDATE_TASK.md`. Cause read in `mergeModules`: this tree had renamed those headings itself on 2026-09-09 (the local remediation of #57), so the old anchor was absent, the new one present, `oldE` came back `undefined` and no branch made a task item.
**Result:** ✅ both modules merged by script; class filed and delivered as origin #72 (`bugs/KAIF/03_*`); the sweep became a repository guard proven red on the untouched sandbox (121 lines / 11 files, exit 1) and green on the live tree (0, exit 0).
**Lesson:** the update task shows what the classifier NOTICED; what it lost is invisible from inside. After any KAIF pass the truth is "bundle vs disk", and a log line that says "arrives as new" is a claim to check, not a delivery. A local fix that pre-empts an upstream rename is exactly what triggers the loss.   → link: `bugs/KAIF/03_rename_anchor_absent_upstream_delta_lost.md` · origin #72 · `testcases/reports/2026-09-18_kaif-update-sweep.md`
**Repro:** `gh release download v<old> --repo MikalaiKryvusha/KAIF --pattern KAIF-CORE-BUNDLE.md` (and `v<new>`, into two dirs) → `node tools/kaif-update-sweep.mjs <old bundle> <new bundle>` → must end with `недоехавших строк: 0`, exit 0.
**Trigger:** `KAIF-BOOT: loader exit 0` or `update` finished → run the sweep BEFORE the first checkpoint, read its list as the hand's to-do, run it again after the merges.
**Not for:** owner-seeded documents (STATUS, GOAL, MASTER_PLAN, the maps, directory READMEs) — the tool skips them by name, their templates are skeletons, not content.
mechanized: tools/kaif-update-sweep.mjs

### EXP-0116 · 2026-09-18 · ❌→✅ · #tools #honesty #falseok #network #conan
**Context:** писал `_config/check-mod-updates.py` — прибор, который спрашивает у Steam и Nexus, пересобраны ли моды сборки под патч 2.2.0.
**Tried / did:** Steam читался через `urllib`, Nexus — тоже. Первый прогон напечатал складную таблицу: «готовы 34, ждём 11», и среди «ждём» стояли все восемь модов Nexus с прочерком вместо даты.
**Result:** ❌ вывод был ЛОЖЬЮ. `urllib` на Nexus падал с `CERTIFICATE_VERIFY_FAILED: certificate has expired` — в связке сертификатов Python протух корень для их цепочки. Прибор ловил исключение, получал пустую строку и печатал «ЖДЁМ». Пять модов, перевыложенных ещё 17.09, он записал в неготовые. Заметил только потому, что ручной счёт через `curl` десятью минутами раньше дал другие числа. ✅ после: транспорт для Nexus переведён на `curl` (берёт хранилище Windows), состояние «НЕ ПРОЧЁЛ» отделено от «ЖДЁМ», код возврата 1 теперь и на непрочитанных. Стало 38 из 45, сошлось с ручным счётом.
**Lesson:** **неудача измерения, напечатанная как результат измерения, — худший вид отчёта: он выглядит как вывод.** У всякого прибора, который ходит вовне, состояний не два, а три: ответ «да», ответ «нет» и «связи не было». Третье НЕЛЬЗЯ сваливать во второе — «не смог прочитать» и «прочитал, там старое» ведут к противоположным решениям. И отдельно: падение сети — не всегда блокировка; сперва прочитать текст исключения. Здесь «Nexus нас режет» оказалось «у нас протух сертификат», и лечится оно сменой транспорта, а НЕ отключением проверки сертификата.
  → link: `researches/conan-2.2.0-gotovnost/` · [[EXP-0112]]
**Repro:** `grep -n "except" _config/*.py` — у каждого перехвата спросить: что печатается дальше, отличимо ли это от настоящего отрицательного ответа. Неотличимо — дефект.
**Trigger:** пишешь прибор, который спрашивает внешний источник → заведи третье состояние «не прочёл» ПЕРЕД первым прогоном, а не после того, как соврал.
**Not for:** чтения с диска в своём же репозитории — там отсутствие файла и есть настоящий ответ.

### EXP-0115 · 2026-09-18 · ❌ · #manifest #conan #recon #staleknowledge
**Context:** разведка по патчу 2.2.0: какие моды сборки уже пересобраны авторами, стоит ли обновляться сейчас.
**Tried / did:** прочитал массив `mods` из `modpack.json`, посчитал по нему и доложил владельцу: «Level and Attribute Overhaul обновлялся 20 июня, это твой становой мод, без него партию начинать нельзя».
**Result:** ❌ владелец поправил одной фразой: «Level 1000 — а мы ж переделали, свой написали». Оба мода MrSerji в манифесте стоят `"enabled": false` — №29 снят 10.09 за пустые перки и украденный русский перевод, №15 снят 13.09, его место занял наш форк `KrinikLevelUncapped`. В живом `modlist.txt` их нет. Названный мной блокер не существовал; после пересчёта по включённым моды вообще перестали быть тормозом переезда, и рекомендация развернулась с «жди» на «обновляйся».
**Lesson:** **каталог сборки — это НЕ то, что стоит в игре.** В манифесте лежит и история решений: выключенные моды остаются записями вместе с разбором, ПОЧЕМУ выключены, — и это правильно, но читающий обязан фильтровать. Состав считается по `enabled` и сверяется с живым `modlist.txt`, иначе доклад владельцу опирается на мод, который он сам выбросил неделю назад. Отдельная цена ошибки: она была не в числе, а в ВЫВОДЕ — один несуществующий блокер развернул рекомендацию на противоположную.
  → link: `researches/conan-2.2.0-gotovnost/` · `_config/check-mod-updates.py`
**Repro:** `python -c "import json;d=json.load(open('modpack.json',encoding='utf-8'));print([m['name'] for m in d['mods'] if not m.get('enabled',True)])"` — сверить с `D:\Games\Conan Exiles\ConanSandbox\Mods\modlist.txt`.
**Trigger:** докладываешь владельцу про состав сборки → сперва отфильтруй по `enabled` и сверься с `modlist.txt`.
**Not for:** вопросов про историю решений («почему этот мод не взяли») — там как раз нужны выключенные записи целиком.

### EXP-0112 · 2026-09-16 · ❌ · #debug #hypothesis #control #falseok #conan #bug12
**Context:** баг 12 — модалка выбора перка мертва. Журнал давал почти приговор моду паузы: он поставил `SetGlobalTimeDilation(0.0001)` за 1,6 с до открытия модуля `PerkSelection`.
**Tried / did:** чтобы не чинить по совпадению во времени, пошёл искать КОНТРОЛЬ — место, где тот же механизм действует, а симптома нет. Нашёл в ките: меню ESC (`W_IngameMenu`) собрано на ТЕХ ЖЕ `WBP_ButtonBase` и том же делегате `SignalClicked`, а под 0.0001 оно «работает». Записал ведущую гипотезу как ОПРОВЕРГНУТУЮ.
**Result:** ❌ **опыт опроверг опровержение.** A/B в игре на одном сейве: мод паузы выключен — тот же клик по тому же пункту срабатывает (Сила 9 → 10, очки 12 → 11). Замедление И БЫЛО причиной. Мой «контроль» был ложным: никто никогда не НАЖИМАЛ кнопку в ESC-меню под 0.0001 — владелец наблюдал там только то, что время стоит, а закрывал меню клавишей. Я принял «окно открывается и выглядит живым» за «его кнопки работают».
**Lesson:** **контроль, который никто не ИСПОЛНЯЛ, — не контроль, а предположение в костюме доказательства.** Метод (искать место, где механизм действует без симптома) верный и дешёвый, но засчитывать его можно только если в контроле выполнено РОВНО ТО ЖЕ ДЕЙСТВИЕ, что ломается в опыте: не «меню открывалось», а «в меню нажимали кнопку и она сработала». Проверка перед тем, как объявить гипотезу опровергнутой: назови в контроле действие, наблюдателя и момент. Не можешь назвать все три — контроля нет, иди ставить опыт.
  → link: `bugs/12_DONE_conan_perk_dialog_dead_under_pause.md` · [[EXP-0074]] · [[EXP-0113]]
**Repro:** `grep -n "ОПРОВЕРГНУТО" bugs/*.md` — у каждого опровержения рядом обязаны стоять действие, наблюдатель и время наблюдения; их отсутствие и есть признак ложного контроля.
**Trigger:** собираешься написать «гипотеза опровергнута», опираясь на то, что где-то рядом «всё работает».
**Not for:** опровержения ЧТЕНИЕМ данных (нет колонки в таблице, нет строки в файле) — там контроль не нужен, факт проверяется сам.

### EXP-0113 · 2026-09-16 · ❌ · #ue4ss #lua #native #crash #conan
**Context:** лечение бага 12: мод раз в 250 мс спрашивал у игры `gmc:IsModuleActive(name)`, чтобы узнать, открыта ли модалка. Вызов был обёрнут в `pcall`, как и весь остальной опрос.
**Tried / did:** запустил игру с этой правкой.
**Result:** ❌ игра упала на загрузке мира: `EXCEPTION_ACCESS_VIOLATION reading address 0x70`, стек целиком из кадров `UE4SS.dll`. Причина — неверный тип аргумента у нативной функции (строка вместо FName).
**Lesson:** **`pcall` НЕ защищает от нативного кода.** Он ловит ошибки Lua; нарушение доступа внутри UE4SS/движка — это падение ПРОЦЕССА, и обёртка про него не узнает. Значит цена ошибки в сигнатуре нативного вызова — не «тихо не сработает», а «игра умрёт», и в цикле опроса это умножается на частоту. Правило: новый нативный вызов в цикле не заводить, пока признак можно взять из УЖЕ работающего источника (здесь — перехват `ActivateModule`, который и так печатал имя модуля); если нативный вызов всё же нужен — сперва один раз вне цикла, с проверкой, что игра вообще ответила.
  → link: `bugs/12_DONE_conan_perk_dialog_dead_under_pause.md` · `ConanExiles/_unpacked/KrinikPauseGameInMenu` · [[EXP-0060]] · [[EXP-0052]]
**Repro:** `grep -n "pcall(function() .*:.*(" ConanExiles/_unpacked/*/Scripts/*.lua` — каждый такой вызов в ЦИКЛЕ обязан иметь рядом запись, что его сигнатура наблюдалась работающей, а не предполагалась.
**Trigger:** добавляешь в цикл опроса вызов нативной функции игры, которую раньше не вызывал.
**Not for:** нативные вызовы, уже отработавшие в этой сборке (`IsFullscreenGUIActive`, `IsValid`) — они проверены наблюдением.

### EXP-0114 · 2026-09-16 · ❌ · #lua #scope #repeat #mechanize #conan
**Context:** в том же лечении завёл таблицу `modal_open`, объявил её НИЖЕ функции `on_activate`, которая её читает.
**Tried / did:** запустил, открыл модалку.
**Result:** ❌ `attempt to index a nil value (global 'modal_open')` — исключение молча не сработало, а весь остальной мод выглядел зелёным.
**Lesson:** **этот класс в проекте УЖЕ оплачен дважды** ([[EXP-0072]]; та же грабля 09.09 в `ConanModPackStatus`, где `checks` попало в замыкание как nil и заказ владельца молча не работал). Третий раз — значит журнал как текст не сработал, и по канону (`EXPERIENCE` → «урок, который повторяется») лекарство должно стать исполняемым, а не ещё одним напоминанием. **Механизация:** перед раскаткой Lua гонять `luac -p` (уже делается) И проверять порядок — все `local`, читаемые из функций, объявлены выше первой читающей функции. Пока проверка не написана, действует правило руками: блок состояния мода — ОДИН, в начале файла, новые имена дописываются туда, а не по месту.
  → link: `ConanExiles/_unpacked/KrinikPauseGameInMenu/Scripts/main.lua` · [[EXP-0072]] · `bugs/12_DONE_*`
**Repro:** `python ConanExiles/_config/lua-globals.py <файл>` — прибор уже есть; дополнить его проверкой «local объявлен выше первого использования» и гонять перед каждой раскаткой Lua.
**Trigger:** добавляешь в Lua-мод новую переменную состояния.
**Not for:** локальные переменные внутри одной функции — там порядок виден глазом.

### EXP-0111 · 2026-09-13 · ❌→✅ · #ue4ss #gui #timedilation #conan #idea05
**Context:** мод KrinikPauseGameInMenu: замедлять время, пока `GUIModuleController.IsFullscreenGUIActive()` = true.
**Tried / did:** первая версия замедляла по одному признаку. Запуск 23:00 — главное меню тоже полноэкранное: время 0.0001 в меню, вход в мир не пошёл. Добавил «только при живом герое». Запуск 23:06 — экран загрузки мира тоже полноэкранный, а герой уже жив: загрузка встала на 82 %. Добавил «взвод»: пауза разрешена только после того, как в мире интерфейс хоть раз увиден закрытым.
**Result:** ✅ 23:08 — вход в мир чистый, Tab замораживает мир (два снимка через 20 с совпали до цифры), закрытие возвращает 1.0.
**Lesson:** признак «открыт полноэкранный интерфейс» в игре шире «открыто меню игрока»: главное меню и экран загрузки — тоже он. Мод, который меняет ход времени по такому признаку, обязан отсечь всё, что бывает ДО момента «игрок в мире и управляет»; самый дешёвый способ — взвод по первому наблюдению «интерфейс закрыт при живом герое». Каждый запуск проверять полным путём «меню → загрузка → мир», а не только окном, ради которого мод писался.   → link: ideas/05 · `ConanExiles/_unpacked/KrinikPauseGameInMenu`
**Repro:** журнал UE4SS после входа в мир обязан содержать `взведено` раньше первого `меню открыто`; `grep "KrinikPauseGameInMenu\] (взведено|меню)" UE4SS.log`.
**Trigger:** пишешь мод, который по состоянию интерфейса меняет время, ввод или камеру.
**Not for:** признаки, привязанные к конкретному модулю по имени (`IsModuleActive("IngameMenu")`) — у них этих ложных срабатываний нет.

### EXP-0110 · 2026-09-13 · ❌→✅ · #iostore #retoc #uassetapi #datatable #conan #idea04 #falseok
**Context:** мод KrinikLevelUncapped: таблицы MrS на 1000 строк разобраны retoc → UAssetGUI JSON → 10 000 строк → обратно. Офлайн-проверка зелёная (строки, данные, импорты) — игра упала при загрузке меню: «DT_FeatsPerLevel: Bad name index 1016/1007».
**Tried / did:** разобрал словарь Zen-заголовка: 1007 имён, как у MrS. Причина — поле `NamesReferencedFromExportDataCount`: retoc to-zen кладёт в словарь пакета только первые N имён (дальше служебные имена импортов), retoc to-legacy записал N = 1007, UAssetAPI переносит поле из JSON без пересчёта. Первая догадка «retoc режет хвост» (вставить имена раньше) не помогла — счётчик остался прежним. Исправление: вставлять новые имена в блок и увеличивать счётчик на число вставленных.
**Result:** ✅ словарь 10 007–10 008 имён; в сборщик добавлена проверка «имён в словаре пакета ≥ строк», она краснеет на сборке, уронившей игру (1007 < 10 000).
**Lesson:** при правке ассета через JSON-посредника поля-СЧЁТЧИКИ заголовка не пересчитываются сами: добавил элементы в массив — найди каждый счётчик, который его описывает. Офлайн-проверка «значения = генератор» читала тот же легаси-ассет, где имена были, и потому не видела, что в Zen их нет: проверять надо ИТОГОВЫЙ формат, который читает игра.   → link: ideas/04 · `ConanExiles/_config/devkit/build-level-mod.py` (`zen_name_count`)
**Repro:** `python ConanExiles/_config/devkit/build-level-mod.py --name <имя> --work <пустая> --out <папка>` — шаг 6 печатает «имён в словаре пакета N ≥ строк».
**Trigger:** добавляешь строки/имена в ассет через UAssetGUI/UAssetAPI JSON и собираешь retoc to-zen.
**Not for:** правка значений без новых имён (числа в существующих строках) — словарь не растёт.
mechanized: `build-level-mod.py` → `zen_name_count` в шаге 6

### EXP-0109 · 2026-09-13 · ✅ · #devkit #versions #uheader #iostore #conan #idea04
**Context:** мод на 10 000 уровней; вопрос — примет ли игра (UE 5.6.1, CL 373655) пакет, сваренный китом 5.8.2-beta (CL 374980).
**Tried / did:** вместо варки — два чтения заголовков: блок версий Zen-заголовка `.uheader` мода, который игра грузит (MrS_Level1000, извлечён `UnrealPak -Extract` кита из `.utoc`), и шапка `FPackageFileSummary` у `.uasset`, сохранённых самим китом.
**Result:** ✅ за минуту и без кука: игра грузит UE5 **1017** (лиц. 5), кит сохраняет UE5 **1018** (лиц. 5) → сваренный китом пакет попадёт под «Version is too new». Решение пути принято наблюдением.
**Lesson:** совместимость версий пакетов проверяется ЧТЕНИЕМ двух заголовков, а не пробной варкой: образец «что игра принимает» — любой живой мод, образец «что пишет кит» — его собственные сохранённые ассеты. **Но расхождение — это факт, а не приговор («не можем»):** владелец справедливо взорвался («скачали официальный Dev Kit и не можем мод собрать! Иди гуглить!»). За пять минут поиска нашлось объяснение: кит — для патча 2.2.0 (UE 5.8.2, выход «на следующей неделе» по посту Funcom 11.09), а игра на диске 2.1.1. Официальный инструмент, который «не работает», почти всегда рассчитан на другую версию — сначала найти, НА КАКУЮ, и только потом предлагать обходные пути.   → link: ideas/04 (Ш2) · plans/06 (фаза 1, риск (а)) · web-recon.md §3
**Repro:** `python ConanExiles/_config/devkit/zen_versions.py <мод>.uheader` (блок с 52-го байта: ZenVersion, UE4, UE5, Licensee, CustomVersions) и `python ConanExiles/_config/devkit/uasset_versions.py F:\CEDevKit\CEUE5Devkit\UE4\Content\Systems\Progression` — сравнить UE5.
**Trigger:** собираешься варить мод китом, который новее игры (после обновления кита или игры — повторить).
**Not for:** новые ассеты кита на старых версиях (Engine/Content 1009) — показывают возраст файла, а не версию писателя; брать недавно сохранённые ассеты игры в ките.

### EXP-0108 · 2026-09-13 · ❌→✅ · #tools #parsers #t3d #falseok #devkit
**Context:** трасса `MaxAcceleration` по T3D выдала множитель «InternalWasCorpseCreated» — бессмыслица.
**Tried / did:** посчитал определения узлов: в T3D героя 21 703 определения на 8 164 имени, 7 206 имён повторяются — имя уникально только внутри графа, а `t3d_trace.py` хранил узлы по одному имени. Ключ сделан (граф, имя); эталоны трасс до и после сняты и сравнены.
**Result:** ✅ после исправления: разгон = `ApplyNewAccelerationRate.Value × BP_ServerSettings_C.PlayerMovementAccelerationMultiplier` (проверено в игре), условие перка в формуле бега — `CheckHasGrit15Perk`, третья запись `MaxWalkSpeed` — `MovementSpeedOverride`. Ядро формулы бега и литералы прыжка не изменились — их держали живые замеры.
**Lesson:** самодельный разборщик надо проверять на СЛУЧАЙНОМ совпадении имён, а не только на удачном ответе: прибор, давший однажды правдоподобную формулу, молча перемешивал графы, и спасло то, что главные выводы шли через замер в игре. Бессмысленное имя в выводе прибора — сигнал дефекта прибора, а не странности игры.   → link: `researches/conan-devkit/t3d_trace.py` · [[EXP-0094]] · [[EXP-0099]]
**Repro:** посчитать повторы имён узлов в T3D (`Begin Object Name=` по всем графам) — если есть, ключ таблицы обязан включать граф.
**Trigger:** пишешь разборщик формата, где имена локальны для контейнера (граф, пакет, функция).
**Not for:** —

### EXP-0107 · 2026-09-13 · ✅ · #lua #declaration #guard #mechanized #ue4ss
**Context:** в зонде атрибутов новая функция читала три имени (`tier_boost`, `jump_calls`, `apply_boosts`), объявленные НИЖЕ неё — класс EXP-0051 и EXP-0072 в третий раз. Пойман глазом до запуска.
**Tried / did:** `luac -l -p` печатает каждое обращение к глобальному имени (`GETTABUP _ENV "имя"`); всё, что не встроенное Lua и не API UE4SS, — дефект. Оформлено прибором `ConanExiles/_config/lua-globals.py`, доказано красным на искусственном файле, исключение — строкой `-- lua-globals: allow имя` в самом файле.
**Result:** ✅ зонд чист; на моде камеры прибор нашёл НАСТОЯЩИЙ дефект: вызов `apply_zoom_range` в строке 990 стоит выше `local function` в строке 1589 и молча ничего не делает (путь «игра забрала цель камеры»).
**Lesson:** третий повтор класса — сигнал, что урок-текст не работает; механизм из одной команды по байткоду ловит его целиком и бесплатно, включая старый код, который никто не перечитывал. Прогонять перед каждой раскаткой Lua-мода.   → link: `ConanExiles/_config/lua-globals.py` · [[EXP-0051]] · [[EXP-0072]]
**Repro:** `python ConanExiles/_config/lua-globals.py <main.lua>` — выход 1 и список имён, если есть.
**Trigger:** правка любого Lua-мода UE4SS перед раскаткой в игру.
**Not for:** намеренные глобальные имена — их объявлять строкой-исключением, а не расширять общий список.
mechanized: `ConanExiles/_config/lua-globals.py`

### EXP-0106 · 2026-09-13 · ✅ · #conan #falldamage #datalever #vibe #idea03
**Context:** прыжок x4 (подъём 14.4 м) снимал 128 из 260 здоровья, x8 убивал — высокий прыжок ломался уроном от падения (риск №3 идеи 03).
**Tried / did:** кит выгрузил `BaseBPCombat`; `t3d_members.py` показал цепочку `ServerEndFalling → ShouldApplyFallDamage → CalculateFallDamagePercent → ApplyFallDamage` и её переменные; зонд прочитал их у героя и масштабировал тем же множителем, что прыжок.
**Result:** ✅ процент = (|Vz| − `MinDamageVelocity`) / (`DeadlyFallVelocity` − Min), родные −1000/−2400; формула дала 126 при наблюдённых 128. С порогами x4 прыжок 1680 — без урона, с порогами x8 прыжок на 57 м — без урона.
**Lesson:** предел, который «ломает» рост, почти всегда задан ПОРОГОМ в данных рядом с формулой; масштаб порога тем же множителем, что и рост, — недостающее простое правило вместо потолка (вайб владельца). Скорость приземления после прыжка на ровном месте равна JumpZ — поэтому хватает одного множителя на оба.   → link: `ideas/03_*` («Автономный час») · [[EXP-0104]] · memory `owner-vibe-nothing-caps`
**Repro:** зонд: `Alt+Numpad *` дважды → пробел → сторож `Alt+Numpad −` не показывает `hp=` после `mode=1`.
**Trigger:** рост характеристики упирается в урон, штраф или смерть.
**Not for:** падения с настоящих обрывов — там масштаб порога тоже снижает урон, это надо показать владельцу как следствие.

### EXP-0105 · 2026-09-13 · ✅ · #ue4ss #hooks #native #respawn #literal #idea03
**Context:** JumpZ, записанный в компонент, игра время от времени возвращала на 420; ступени перегруза после смерти оказывались родными.
**Tried / did:** (1) кит: в `BaseBPCombat` прыжок пишут только `SigilLongJumpEnable` (630) и `SigilLongJumpDisable` (420) литералами, вторую зовут `TakeHealthDamage`, `OnSubstateChanged_Sprint`, `ServerAction`; (2) пре-хук на нативный `/Script/Engine.Character:Jump` ставит JumpZ перед прыжком; (3) `NotifyOnNewObject` на BP-класс `/Game/Characters/BasePlayerChar.BasePlayerChar_C` после входа в мир.
**Result:** ✅ хук сработал на каждый прыжок, после урона вернул 1680 из 420, подъём 1438 при расчётных 1440; смерть создаёт НОВЫЙ объект героя с родными значениями, подписка его поймала, переприменение дало x4 на новом объекте.
**Lesson:** когда игра пишет ЛИТЕРАЛ, данных для правки нет — действуй в МОМЕНТ ИСПОЛЬЗОВАНИЯ: пре-хук нативной функции, которая это значение читает. Нативные функции движка этот UE4SS перехватывает, события блюпринта — нет. «Записал один раз» не переживает смерть: герой — новый объект, переприменять по его появлению; подписка на BP-класс работает, на C++-класс (12.09) — нет.   → link: `ideas/03_*` · `ConanExiles/_unpacked/ConanAttributeProbe` · [[EXP-0104]] · [[EXP-0071]]
**Repro:** `python researches/conan-devkit/t3d_trace.py <BaseBPCombat.utf8.t3d> JumpZVelocity 14` — два литерала; в игре: сторож + пробел, строки `ПРЫЖОК хук` в `UE4SS.log`.
**Trigger:** значение, записанное модом, игра «иногда» возвращает; или запись не переживает смерть/загрузку.
**Not for:** значения, которые игра читает из данных (ступени перегруза) — там достаточно записи в данные и переприменения при появлении.

### EXP-0104 · 2026-09-13 · ❌→✅ · #ue4ss #hooks #blueprint #datalever #idea03
**Context:** идея 03 — умножить бег Конана поверх формулы игры; формула пишет `MaxWalkSpeed` внутри события `ApplyNewMovementSpeed`.
**Tried / did:** `RegisterHook` на оба пути события (объявление в C++ `/Script/ConanSandbox.ConanCharacter:` и переопределение в блюпринте `BasePlayerChar_C:`) с пост-колбэком, счётчиком срабатываний и отчётом через 60 с (урок EXP-0071 применён).
**Result:** ❌ оба «встали», за минуту `cpp=0 bp=0`, пока `MaxWalkSpeed` пересчитывался дважды — отчёт поймал это сам, без ложного «работает». ✅ Вместо перехвата — ДАННЫЕ, которые формула читает: `GetEncumbranceSpeedMultiplier` выбирает `EncumbranceTier0..4SpeedMultiplier` (переменные на герое). Все пять x2 → бег 729 = 450×2×0.81, проценты игры остались внутри, значение держится, ни хука, ни цикла.
**Lesson:** когда перехватить формулу нельзя, раскрути в графе, какие ПЕРЕМЕННЫЕ она читает, и пиши в них: запись в данные переживает любой пересчёт, а перехват в этой сборке UE4SS для событий блюпринта мёртв. Счётчик с отложенным отчётом окупился за 60 секунд — держать его в каждом перехвате.   → link: `ideas/03_conan_atributy_kak_v_morrowind.md` · `ConanExiles/_unpacked/ConanAttributeProbe` · [[EXP-0071]] · [[EXP-0099]]
**Repro:** `python researches/conan-devkit/t3d_members.py <BasePlayerChar.utf8.t3d> GetEncumbranceSpeedMultiplier` — список переменных и вызовов функции (T3D выгружает `bp_speed.py`); писать в найденные переменные из Lua и мерить серией `Alt+Numpad +`.
**Trigger:** собираешься вешать `RegisterHook` на функцию/событие блюпринта Конана, чтобы поправить результат.
**Not for:** нативные функции движка `/Script/Engine.*` — их этот UE4SS хукает (мод камеры).

### EXP-0103 · 2026-09-13 · ❌ · #measurement #proxy #falseok #controlcase #idea03
**Context:** вчерашний вывод идеи 03: «запись RunSpeed x2 → игра через ~40 с пересчитала MaxWalkSpeed 263 → 364.5, x1.38, формулу надо снять».
**Tried / did:** 13.09 мерил не поле, а само движение — серией координат, контроль и опыт подряд.
**Result:** ❌ вывод был ложным: `MaxWalkSpeed` стоя 325, на бегу 450 — отношение 1.385, и 325×0.81 = 263.25, 450×0.81 = 364.5 ТОЧНО. «Пересчёт после записи» был переходом «стоит → бежит» у голодного героя; RunSpeed x2 бег не изменил вовсе (450 до и после).
**Lesson:** **поле, прочитанное в один момент, — не величина, а её снимок в неизвестном состоянии.** Прежде чем приписать изменение СВОЕЙ записи, проверь отношение чисел против известных переходов состояния (стоит/бежит, сыт/голоден) и поставь контроль без записи в тех же условиях. Совпадение «до третьего знака» с чужим переходом — улика против своей гипотезы.   → link: `ideas/03_*` («Шаг 2, утро 13.09») · [[EXP-0074]] · [[EXP-0065]]
**Repro:** `python ConanExiles/_config/speed-from-log.py` на двух сериях подряд (родное → запись) — сравнивать медиану `|v|`, а не `MaxWalkSpeed` из одиночного чтения.
**Trigger:** видишь, что значение поля «изменилось после записи» → раздели на известные множители состояния и сделай контрольную серию без записи.
**Not for:** поля, которые игра не пересчитывает (например, записанные ступени перегруза держатся как есть).

### EXP-0102 · 2026-09-13 · ❌→✅ · #harness #input #dodge #altgr #measurement #conan
**Context:** замер разбега зондом: чтение по `Alt+Numpad .` до и после удержания W.
**Tried / did:** (1) Alt+клавиша — как вчера; (2) правый Alt через `VK_RMENU` с флагом расширенной клавиши; (3) серия точек, запущенная одной клавишей ДО разбега.
**Result:** ❌ (1) `LeftAlt` у Конана — `DodgeActionV2`: каждое чтение кувыркало героя (|v| 926, −21 выносливости), замер мерил кувырки. ❌ (2) до зонда не дошло: `GetAsyncKeyState` в момент нажатия показал `VK_MENU=1` И `VK_CONTROL=1` — на этой машине правый Alt работает как AltGr, UE4SS видит Ctrl+Alt. ✅ (3) кувырок занимает первые 6 точек (928→0), бег — ровное плато `|v|`.
**Lesson:** модификатор, которым харнесс «адресует» мод, сам может быть игровым действием — сверяй модификаторы с `ActionMappings` игры так же, как клавиши. А правый Alt на машине владельца = Ctrl+Alt. Замер движения — серией точек, запущенной ДО действия, а не чтениями в его середине.   → link: `ConanExiles/_config/speed-from-log.py` · `ConanExiles/_unpacked/ConanAttributeProbe` · [[EXP-0082]] · [[EXP-0097]]
**Repro:** `grep -n "Key=LeftAlt\|Key=LeftShift\|Key=LeftControl" "<GAME>/Saved/Config/Windows/Input.ini"` перед выбором модификатора; для замера — `input.ps1 -Key 0x6B -Alt` → пауза 1.5 с → `input.ps1 -Key 0x44 -HoldMs 2500` → `speed-from-log.py`.
**Trigger:** вешаешь клавишу мода с модификатором или меряешь движение героя нажатиями.
**Not for:** чтения, где герой стоит и положение не важно (атрибуты) — там кувырок безвреден.

### EXP-0101 · 2026-09-13 · ✅ · #conan #input #ini #chat
**Context:** снять чат (Enter, Num *, Num −) — вчерашние строки `-ActionMappings` в `Input.ini` не сработали (EXP-0098).
**Tried / did:** меню игры «Настройки → Управление → Общение», крестик у трёх привязок; затем сверка хешей `Saved/` и кадры в мире.
**Result:** ✅ игра переписала `Input.ini` ПОЛНЫМ массивом (256 `ActionMappings`) с `Key=None` у трёх действий; голые Num * и Enter чат больше не открывают; запись пережила выход.
**Lesson:** у Конана переназначение клавиш надёжно делает само меню — оно пишет полный массив, а не дифф-удаление. Нужна правка раскладки файлом — бери за образец то, что записало меню, и держи этот файл в паке, иначе `deploy-config.py` вернёт старое.   → link: `ConanExiles/_config/Input.ini` · [[EXP-0098]]
**Repro:** `grep -n "VicinityChat\|GuildChat\|GlobalChat" "<GAME>/Saved/Config/Windows/Input.ini"` — у всех трёх `Key=None`.
**Trigger:** снимать или переназначать клавиши Конана.
**Not for:** `ConsoleKeys` — они в том же файле и работают строками.

### EXP-0100 · 2026-09-13 · ❌→✅ · #git #revert #amend #falseok
**Context:** откатывал свой незапушенный коммит в паке Конана.
**Tried / did:** `git revert --no-edit <sha> -q` и сразу за ним `git commit --amend -m "Revert …"`.
**Result:** ❌ — `revert` не знает `-q`, напечатал справку и НЕ выполнился; `--amend` переписал сообщение самого откатываемого коммита. Получился коммит «Revert» с той самой правкой внутри. Поймано `git show --stat` перед докладом; не запушено — снято `reset --soft HEAD~1` + `restore`.
**Lesson:** не склеивать две git-команды так, что вторая молча доделывает несостоявшуюся первую. После любого отката — `git show --stat HEAD`: сообщение ничего не доказывает, доказывает диф.
**Repro:** `git show --stat HEAD` после revert — в дифе должно быть обратное изменение.
**Trigger:** откат, amend, rebase — любое переписывание истории.
**Not for:** —

### EXP-0099 · 2026-09-13 · ✅ · #devkit #blueprint #t3d #formula #unreal
**Context:** как Конан считает скорость бега — из C++ отражения видно только имена полей, не формулу.
**Tried / did:** безоконный кит выгрузил блюпринт героя в T3D (`AssetExportTask`, 148 МБ, **UTF-16**); свой трассировщик `t3d_trace.py` разобрал узлы/пины/связи и раскрутил поток данных назад от записи `MaxWalkSpeed`.
**Result:** ✅ за один проход — формула целиком: `NewSpeed × Agi15Perk × Snare × Emote × Encumbrance`, база приходит из C++ через событие `ApplyNewMovementSpeed`.
**Lesson:** «как устроено» у блюпринта Конана читается текстом без окна редактора: T3D + трассировка назад от интересующей записи. Первая выборка по подстроке ничего не нашла из-за UTF-16 — перекодируй перед поиском.   → link: `researches/conan-devkit/bp_speed.py` · `researches/conan-devkit/t3d_trace.py` · `ideas/03_*`
**Repro:** `python researches/conan-devkit/t3d_trace.py <file.utf8.t3d> ApplyNewMovementSpeed 12`
**Trigger:** нужна формула / логика блюпринта игры, а не только имена полей.
**Not for:** логика внутри C++ (`UpdateMaxMovementSpeed` сам) — её T3D не показывает.

### EXP-0098 · 2026-09-13 · ❌ · #conan #input #ini #chat #falseok
**Context:** владелец: «чат бы вообще убрать». Одиночная игра, Numpad * открывал чат поверх клавиш модов.
**Tried / did:** пять строк `-ActionMappings=(…)` в `Saved/Config/Windows/Input.ini`, дословно как в игровом `DefaultInput.ini` (извлечён `UnrealPak` из `pakchunk0`).
**Result:** ❌ — строки пережили выход игры, но Numpad * всё равно открыл чат. Откачено.
**Lesson:** у Конана привязки из `Input.ini` не последнее слово — «строка на месте» ≠ «привязка снята». Проверять кадром в игре, а не содержимым файла.
**Repro:** после правки — в игре голая Numpad * и снимок: панель «Local» не должна появиться.
**Trigger:** снимать/переназначать клавиши Конана.
**Not for:** `ConsoleKeys` — те из `Input.ini` работают (консоль F10/Insert).

### EXP-0097 · 2026-09-12 · ✅ · #harness #input #ue4ss #keybind #devkit #attributes #idea03
**Context:** идея 03 — прочитать атрибут живого героя из Lua; адрес неизвестен, герой ещё не качан (все нули не отличают верный адрес от неверного).
**Tried / did:** (1) адрес спросил не у игры, а у Dev Kit безоконным Python-командлетом: `dir(unreal)` → у кого есть `get_int_stat`, плюс номера `CharIntStatID`/`StatModifierMode`; (2) в игре атомарно: Tab → «Хар-ки» → вложил очки РАЗНЫМ числом (1/2/3/4, потом 4 в шестой) → Numpad . → греп журнала.
**Result:** ✅ — `ConanCharacter:GetIntStat(id, mode)` и `StatHolder` героя дают одно и то же; все шесть номеров кита совпали с экраном (Сила 17, Проворство 19, Живучесть 14, Выдержка 15, Мастерство 16, Авторитет 27; FULL=0 с бонусами, BASE=1). **И второе:** нажатие Numpad . через `input.ps1` ДОШЛО до `RegisterKeyBind` зонда (дважды) — вопреки `EXP-0082`. Вероятная разница (НЕ проверена A/B): зонд вешает СЫРОЙ код `0x6E`, а мод камеры в те дни брал таблицу `Key.*`, у которой в этой сборке нумпад сдвинут (`Key.NUM_ZERO` = 0x69); и 12.09 после бага 10 UE4SS другой.
**Lesson:** адрес поля/функции C++ у игры на UE спрашивай у кита через отражение Python (2 мин, без окна), а не перебором в живой игре. Для сверки адреса значения делай РАЗНЫМИ — одинаковые (нули) ничего не доказывают. И `EXP-0082` («клавиши модов недоступны агенту») больше не абсолютно: сырой код клавиши до `RegisterKeyBind` доходит — проверяй одной клавишей, прежде чем строить обход.   → link: `ideas/03_conan_atributy_kak_v_morrowind.md` · `ConanExiles/_unpacked/ConanAttributeProbe` · [[EXP-0082]]
**Repro:** `input.ps1 -Key 0x6E` при запущенном зонде → `grep "ЧТЕНИЕ (Numpad .)" ue4ss/UE4SS.log`.
**Trigger:** нужен адрес чего-то внутри игры Конана · собираешься проверять мод нажатием клавиши.
**Not for:** блюпринт-переменные, которых нет в C++ отражении кита — их кит показывает только после загрузки ассета.

### EXP-0095 · 2026-09-12 · ✅ · #ue4ss #vtable #upstream #ticket #askthemaintainer #bug10
**Context:** баг 10 (фатал UE4SS на своей инициализации) держал мёртвым весь Lua-слой сборки трое суток. Своими силами: четыре кандидата из веб-разведки сняты, механизм назван по строкам DLL, лечения нет. Дальше упирались в чужой закрытый подмодуль.
**Tried / did:** оформили тикет апстриму — с двумя ДОСЛОВНО совпадающими журналами (живой и мёртвый, нормализованные), тремя «здоровыми» значениями с общими младшими битами, списком уже отсечённого и отдельным абзацем «чего мы НЕ доказали». Сопровождающий ответил через час, назвал механизм в двух фразах и выдал пошаговый порядок отладки. Первая же пустышка `Unknown_1` в `[FProperty]` над `GetMinAlignment` дала `FName Alignment: 0x4`.
**Result:** ✅ решено за час после ответа: 4 запуска из 4 с правкой, контроль без неё — снова мусор. Проверка размещения через Live View пройдена (свойства живого `PlayerInput` читаются, игра цела). Решение отдано наверх.
**Lesson:** **когда упёрся в ЧУЖОЙ закрытый код — тикет автору дешевле пятого слепого ключа, и окупается он качеством улик, а не вежливостью.** Сработали ровно три вещи: (1) пара журналов «живой против мёртвого», нормализованная по адресам и времени, — она доказывает, что все наблюдаемые шаги одинаковы; (2) неправдоподобное значение в УДАЧНОМ прогоне с общими младшими битами — по нему автор сразу опознал вызов чужой виртуальной функции; (3) честный абзац «чего мы НЕ доказали», который снял с него ложный след (наш прежний вывод про Lua-зонд). Полезно и обратное правило: **сначала исчерпай то, что можно снять журналом без запусков** — иначе тикет выглядит как «сделайте за меня».   → link: `bugs/10_DONE_ue4ss_fname_alignment_fatal.md` · [UE4SS#1421](https://github.com/UE4SS-RE/RE-UE4SS/issues/1421) · [[EXP-0092]]
**Repro:** прежде чем писать автору: нормализуй два журнала (`sed -E 's/^\[[0-9: .-]+\] //; s/0x[0-9a-fA-F]+/0xADDR/g'`) и приложи их пару; назови значение, которое НЕ должно быть таким; выдели отдельно то, что не доказано.
**Trigger:** дефект внутри чужой библиотеки, свои кандидаты исчерпаны, исходник закрыт → тикет с парой журналов, а не следующий слепой перебор.
**Not for:** дефекты в своём коде и случаи, где журнал ещё не вычитан до конца — там тикет отнимет чужое время вместо своего.

> **Развязка того же дня, 13:25 UTC — тикет закрыт коммитом.** Через **14 минут** после нашего
> ответа сопровождающий внёс нашу строку в ШТАТНЫЙ конанский конфиг апстрима
> ([`3fe75235`](https://github.com/UE4SS-RE/RE-UE4SS/commit/3fe752355dd240e09e50c6e4ad4524053da555c7),
> «fix: Conan Exiles Enhanced intermittent crash»), а сообщение коммита пересказало наш диагноз
> дословно. Полный цикл — от «лечения нет, баг открыт» до исправления в чужом релизе для ВСЕХ
> игроков Конана — занял **два часа**. Усиление урока: тикет с уликами не просто дешевле слепого
> перебора, он ещё и **чинит проблему у всех остальных**, а найденное нами перестаёт быть нашим
> личным костылём, который надо оберегать от обновлений. Долг «обновление затрёт правку»
> перевернулся в «обновление её принесёт».

### EXP-0096 · 2026-09-12 · ❌→✅ · #harness #input #keyboard #layout #gui
**Context:** проверка исправления требовала пройти по отладочному окну UE4SS (ImGui): правый клик по строке поиска, две галки, ввод слова `player`.
**Tried / did:** `input.ps1` умел только левый клик и одиночные клавиши по кодам. Послал P-L-A-Y-E-R кодами клавиш.
**Result:** ❌ в поле появилось **«здфнук»** — у владельца по умолчанию РУССКАЯ раскладка, а `keybd_event` шлёт КЛАВИШУ, которую раскладка превращает в свой символ. ✅ добавлены `-RightClick` и `-Type` (SendInput с `KEYEVENTF_UNICODE` — шлёт СИМВОЛ и раскладке не подчиняется); после этого весь путь по окну прошёл.
**Lesson:** **стенд, который «умеет нажимать клавиши», не умеет ПЕЧАТАТЬ, пока не шлёт Unicode: коды клавиш проходят через раскладку пользователя.** На машине владельца это не редкий случай, а умолчание. И шире: любой ввод текста в чужое окно проверяй ГЛАЗАМИ на снимке — «команда выполнилась без ошибки» не значит «в поле то, что нужно» (`EXP-0082` в новом обличье).   → link: `ConanExiles/_config/input.ps1` · [[EXP-0082]]
**Repro:** `input.ps1 -Type "player"` — и снимок экрана следом; если в поле кириллица, значит используется путь клавиш, а не Unicode.
**Trigger:** надо ввести ТЕКСТ (не одну клавишу) в окно игры или отладочной консоли → только `-Type`, и обязательно кадр после.
**Not for:** игровые клавиши и сочетания — там нужен именно код клавиши, раскладка не участвует.

### EXP-0094 · 2026-09-12 · ❌→✅ · #tools #parsers #shapes #nosuchstring #unreal #ftext
**Context:** владелец посмотрел на готовую панель и спросил: «а класс брони `Light` перевести можешь?». В документах уже лежал мой ответ: «нет — такой строки в ключах `FText` мода нет вовсе, мод складывает её на лету».
**Tried / did:** прежде чем повторить ответ, распаковал мод заново и поискал слово в сырых байтах — не по CSV, а по файлам.
**Result:** ❌ ответ был неверен: `Light` лежит рядом с 32-символьным ключом, то есть это обычный `FText`. ✅ причина — мой собственный прибор: `ftext_extract.py` знал ОДНУ форму сериализации (в данных ассета, с префиксом длины) и не знал вторую — литералы, вкомпилированные в БАЙТКОД Blueprint (`EX_TextConst 0x29` + тип `0x01` + три `EX_StringConst 0x1F` без префиксов длины, порядок source, key, namespace). Прибор починен: 794 ключа → 939, +65 строк, среди них вся шапка HUD. Переведено и проверено на экране в тот же час.
**Lesson:** **«такой строки нет» стоит ровно столько, сколько форм знает твой сканер — это утверждение о ПРИБОРЕ, а не о данных.** Отрицательный вывод из разбора обязан называть, что именно разбиралось: «в форме A такой строки нет» — честно, «такой строки нет» — нет. И проверяется он не повторным чтением своего же CSV, а поиском по сырым байтам: тридцать секунд против неверного ответа, записанного в документ.   → link: `researches/conan-devkit/README.md` §7.4 · `interviews/interview_003_hosav_hud_bytecode.md` · [[EXP-0093]]
**Repro:** прежде чем сказать «этого в данных нет», грепни СЫРЫЕ файлы на само слово. Нашлось — у прибора слепое пятно, а не у данных.
**Trigger:** собираешься ответить «невозможно / такого нет», опираясь на выход своего разборщика → сперва сырой поиск и перечисление форм, которые разборщик знает.
**Not for:** случаи, где отрицание доказано полной моделью формата (например, файл целиком разобран по спецификации без остатка).

### EXP-0093 · 2026-09-12 · ✅ · #localization #unreal #pak #modloader #doors #occam
**Context:** русский интерфейс мода Hosav. Мод-загрузчик Конана отверг `.locres` внутри пак-мода по белому списку имён (`EXP-0090`), и путь считался закрытым до скукованного Blueprint — то есть до целой фазы эпика.
**Tried / did:** перебрал двери по одной, каждую — отдельным запуском с кадром панели мода. (1) тот же файл РОССЫПЬЮ поверх пути игры; (2) своя цель локализации, прописанная `+LocalizationPaths` в `Saved/Config/Windows/Engine.ini`; (3) **штатная цель `Game`: `Content/Localization/Game/{Game.locmeta, ru/Game.locres}`, без единой правки конфига**.
**Result:** (1) ❌ бесполезно — в Unreal **пак выигрывает у файла на диске** (`FPakPlatformFile::FileExists` сперва ищет в смонтированных паках), а нужная цель лежит в `pakchunk0`; (2) ❌ секцию игра прочитала и даже сохранила при своём выходе, но менеджер локализации цель не взял; (3) ✅ **работает**, панель мода целиком по-русски, проверено повторно с убранными строками конфига.
**Lesson:** **когда чужая система запретила путь, ищи не обход, а ШТАТНУЮ дверь того же движка — она обычно требует нуля настройки.** `%GAMEDIR%Content/Localization/Game` входит в пути локализации по умолчанию, этой цели нет ни в одном паке игры (значит правило «пак выигрывает» не срабатывает), а `.locres` россыпью читается: запрет на файлы вне пака — это список расширений `uasset/umap/uexp/ubulk/upipelinecache/ushaderbytecode`, локализации в нём нет. Обход, который строили (кук Blueprint с `PolyglotDataToText`), оказался дороже двери, стоявшей открытой.   → link: `researches/conan-devkit/README.md` §7.3 · `ConanExiles/_config/localization/README.md` · [[EXP-0090]]
**Repro:** прежде чем строить обход запрета: выпиши ВСЕ штатные пути движка для этого класса данных и проверь, какой из них (а) не занят паком и (б) уже включён по умолчанию.
**Trigger:** загрузчик/валидатор чужой системы отказал по имени или пути → перечисли штатные точки расширения движка, начиная с тех, где конфиг не нужен вовсе.
**Not for:** случаи, где данные обязаны быть в паке (ассеты через кук) — там дверь ровно одна.

### EXP-0092 · 2026-09-12 · ✅ · #debug #logs #experiments #cost #webrecon
**Context:** веб-разведка по фаталу UE4SS выдала четыре кандидата-лечения «по одному ключу за запуск» (`bugs/10`). Каждый запуск игры отбирает у владельца экран удалённого стола.
**Tried / did:** перед тем как ставить ключи 2 и 3 (`DebugBuild = false`, `Stats = false`), заглянул в журнал прошлого падения и поискал, что движок УЖЕ определил сам.
**Result:** ✅ оба сняты без единого запуска: в журнале стоят `[PS] Found BuildConfiguration: Shipping` → `Build configuration: shipping, detected` и `[PS] Found Stats: Off` → `Stats: off, detected`. Ключи поставили бы ровно то, что уже стоит. Сэкономлено два запуска; ключ 1 проверен запуском и тоже опровергнут — журнал прогона с ним **дословно совпал** с журналом без него.
**Lesson:** **настройка, которая ФОРСИРУЕТ значение, проверяется журналом, а не опытом: если журнал печатает, что это значение уже определено, эксперимент заранее пуст.** И обратное, сильное: два журнала, нормализованные по адресам и времени, — это прибор. Их `diff` отвечает «изменила ли правка хоть что-нибудь» точнее любого впечатления, и он же показал, что мёртвый и живой запуски идут дословно одинаково вплоть до строки отказа.   → link: `bugs/10_ue4ss_fname_alignment_fatal.md` · [[EXP-0091]]
**Repro:** `norm() { sed -E 's/^\[[0-9: .-]+\] //; s/0x[0-9a-fA-F]+/0xADDR/g' "$1"; }` и `diff <(norm a.log) <(norm b.log)` — правка, не изменившая нормализованный журнал, не изменила ничего.
**Trigger:** очередной кандидат — это ключ конфигурации вида «форсировать X» → сперва грепнуть журнал на то, что движок сам определил про X.
**Not for:** ключи, меняющие ПОВЕДЕНИЕ, а не значение (там журнал до опыта молчит).

### EXP-0091 · 2026-09-12 · ❌ · #ue4ss #reboot #cause #coincidence #bug10
**Context:** баг 10 записал лечение «перезагрузить машину» — по одному удачному запуску после перезагрузки 10.09.
**Tried / did:** 12.09 UE4SS упал тем же фаталом; владелец перезагрузил машину; запуск сразу после — тот же фатал.
**Result:** ❌ — «лечение» было совпадением. Ровно тот класс, о котором предупреждал EXP-0080 (совпадение по времени ≠ причина), и всё же он попал в документ как лечение, а из документа — в STATUS и в сторож.
**Lesson:** **лечение, доказанное ОДНИМ удачным исходом перемежающегося отказа, — это гипотеза, и записывать его надо словом «гипотеза», с числом наблюдений.** Перемежающийся отказ подтверждает лечение только серией: N применений подряд без отказа против известной частоты отказов (10.09 — семь мёртвых на два живых). Один зелёный после перезагрузки при базовой частоте 2 из 9 ничего не доказывает.   → link: `bugs/10_ue4ss_fname_alignment_fatal.md` · [[EXP-0080]]
**Repro:** прежде чем писать «лечение», спроси: сколько раз применял и сколько раз отказ вернулся бы без него? Меньше трёх применений — пиши «гипотеза (1 из 1)».
**Trigger:** отказ перемежающийся (иногда работает, иногда нет) и найдено «лечение» → в документ идёт счётчик наблюдений, а не глагол «проверено».
**Not for:** детерминированные отказы, где один прогон с лечением и один без него — уже полное доказательство.

### EXP-0090 · 2026-09-12 · ❌→✅ · #devkit #pak #whitelist #localization #modloader
**Context:** перевод мода Hosav решили подложить своим `.locres` поверх игрового: обёртка мода с файлом по пути игры `Content/Localization/Exiles_UI/ru/Exiles_UI.locres`.
**Tried / did:** собрал по образцу `BuildMod.cs`, раскатал, владелец запустил игру.
**Result:** ❌ — `Mod pak file … failed check (Error: Filename '../../../ConanSandbox/Content/Localization/…' is not allowed in pak)`: загрузчик модов Конана проверяет каждое имя файла в платформенном паке по белому списку; подмена файла игры по пути запрещена по замыслу. ✅ — путь понят: перевод в пак-моде идёт только через скукованный Blueprint с `PolyglotDataToText` (узел есть в exe), а без кука — только Lua-подмена текстов виджетов.
**Lesson:** **у загрузчика модов есть своя политика поверх движка: то, что Unreal примет (пак смонтируется, файл переопределится), мод-лоадер игры может запретить по имени файла — читай его сообщения (`ValidateMod_*`) ДО того, как строить путь на переопределении.** Список запретов лежит в строках exe; их надо было прочитать до сборки, а не после.   → link: `researches/conan-devkit/README.md` §7.2 · `researches/conan-devkit/web-recon.md`
**Repro:** `python researches/conan-devkit/strings.py <exe> | grep -i "ValidateMod_\|MountMod_"` — перечень проверок загрузчика до первой сборки.
**Trigger:** мод должен ПЕРЕОПРЕДЕЛИТЬ файл игры (не ассет через кук, а файл по пути) → сперва строки `ValidateMod_*` загрузчика, потом сборка.
**Not for:** переопределение ассетов через кук (`Mods/<Mod>/Content/<путь>` → `/Game/<путь>`) — это штатный путь Dev Kit, загрузчик его ждёт.

### EXP-0089 · 2026-09-12 · ❌→✅ · #devkit #unrealpak #pak-version #repak #version-skew
**Context:** пак мода собран `UnrealPak.exe` из кита 5.8 и отдан игре (билд 5.6-ветки).
**Tried / did:** запуск игры.
**Result:** ❌ — `Invalid pak file version (12) … Verify your installation`, игра показала пустую модалку «Incompatible Mods» (имя пака в списке не напечатала — падение случилось в читателе пака, а не в валидаторе). ✅ — пересобран `repak --version V11` (trumank, MIT, `_tools/repak`), формат принят.
**Lesson:** **инструмент кита новее игры пишет форматы, которых игра не читает — не только пакеты (custom versions), но и контейнер `.pak` целиком; версию пака смотри в футере ДО раскатки (`pakfooter.py`: у всех живых модов 11), а ключа «писать старую версию» у UnrealPak нет.** Это первое подтверждённое проявление риска «кит новее игры» из эпика — на уровне контейнера, ещё до кука.   → link: `plans/06_EPIC_conan_devkit_toolchain.md` (риск а) · `ConanExiles/_config/devkit/make-loc-mod.py`
**Repro:** `python <scratch>/pakfooter.py <новый.pak> <живой мод.pak>` — версии обязаны совпасть; иначе `repak pack --version V11`.
**Trigger:** собираешь `.pak` для игры инструментом из кита другой версии → сверь версию футера с живым модом до раскатки.
**Not for:** паки, которые собирает сам `BuildMod` кита под ту же версию игры, что и кит.

### EXP-0088 · 2026-09-12 · ✅ · #devkit #unreal #headless #cost #fear #harness
**Context:** Dev Kit Конана (169 ГБ) лежал нетронутым два дня; пак `docs/02` и STATUS несли «первый запуск — 30–60 минут компиляции шейдеров», и оконный запуск отбирал бы экран владельца на удалённом столе.
**Tried / did:** вместо окна — безоконный командлет: `UnrealEditor-Cmd.exe <uproject> -run=PythonScript -Script=<py> -EnablePlugins=PythonScriptPlugin -unattended -nopause -NullRHI -nosplash -abslog=<log>`, запущен `Start-Process` со скрытым окном, журнал прочитан ОДИН раз после завершения.
**Result:** ✅ — 1 мин 52 с от старта до `Exiting`, скрипт 20 мс, кривая опыта прочитана; шейдеры не компилировались вовсе.
**Lesson:** **цена «первого запуска» редактора Unreal — это цена ОКНА (шейдеры под живой RHI), а не цена движка; командлет с `-NullRHI` платит только инициализацию.** Записанная в документах страшная цифра относилась к другому режиму, и два дня инструмент лежал из-за неё. Проверять цену режима, который нужен, а не самого дорогого.   → link: `researches/conan-devkit/README.md` §7 · `plans/06_EPIC_conan_devkit_toolchain.md`
**Repro:** `researches/conan-devkit/smoke-dump-xp.py` тем же командлетом → `XP_DUMP_DONE ok=True` в журнале и `xp_curve.json` рядом со скриптом.
**Trigger:** нужен ответ от редактора/движка чужого инструмента (таблица, список ассетов, свойства) → сначала командлет без окна, оконный запуск — плановое событие с владельцем.
**Not for:** всё, что действительно требует рендера или PIE (снимок экрана из редактора, проверка материала глазом).

### EXP-0087 · 2026-09-12 · ✅ · #devkit #pak #oodle #vendor-tool #parser #twins
**Context:** содержимое паков Конана считалось нечитаемым («сжато Oodle, у UE5 он статически в exe»), для имён был написан свой разбор `.utoc` (`utoc-index.py`) со счётным сторожем; кривую опыта хотелось прочесть своим парсером `.uasset`.
**Tried / did:** посмотрел, что лежит в самом ките: `Engine/Binaries/Win64/UnrealPak.exe`. `-List` и `-Extract` на обёртке мода и на внутреннем `.utoc` — в скретчпад.
**Result:** ✅ — обёртка `ChestLabels.pak` перечислена и распакована за 0.3 с, контейнер `UIMod_Hosav-Windows.utoc` распакован за 0.06 с: 404 файла, 46 МБ, Oodle снят; числа опыта прочёл сам редактор кита, а не мой парсер.
**Lesson:** **прежде чем писать парсер чужого бинарного формата — проверь, не привёз ли вендор свой инструмент в том же комплекте; лицензиатский формат (5.8 Funcom) правильно читает только вендорский код.** Свой парсер остаётся запасным путём для машины без кита. Та же дверь, что в EXP-0078 (сперва диск, потом память): сперва инструмент вендора, потом свой.   → link: [[EXP-0078]] · `researches/conan-devkit/README.md` §3.3
**Repro:** `UnrealPak.exe "<игра>\ConanSandbox\Mods\<мод>.pak" -List` → 11 строк (3×pak/utoc/ucas + manifest.json + modinfo.json); `UnrealPak.exe <Мод>-Windows.utoc -Extract <скретчпад>` → `.uheader`/`.uexp` на ассет. Писать ТОЛЬКО в скретчпад или пак.
**Trigger:** нужно содержимое `.pak`/`.utoc`/`.uasset` игры на UE → `UnrealPak -List/-Extract` из кита раньше любого своего кода.
**Not for:** зашифрованные контейнеры (ключ вырезан из поставки, `-IniKeyDenylist=aes.key`) — там и вендорский инструмент без ключа бессилен.

### EXP-0086 · 2026-09-11 · ❌ · #restore #interrupt #harness #owner #guard
**Context:** чтобы снять кадр с родной камерой игры, сценарий выключает камерный мод и возвращает его в `finally`. Возврат стоял ПОСЛЕДНИМ — после закрытия игры и паузы в пять секунд.
**Tried / did:** прогон был остановлен владельцем. `finally` начал выполняться, дошёл до паузы — и на ней остановка его прервала.
**Result:** ❌ — мод остался выключенным. Владелец увидел закрывшуюся игру и решил, что она упала; журнал же показывает упорядоченное завершение и ноль новых крешдампов — игру закрыл сам сценарий. Но камера у владельца была бы мертва при следующем запуске, и симптом выглядел бы как сломанная сборка.
**Lesson:** **возврат чужого состояния, который зависит от того, доживёт ли сценарий до своей последней строки, — это не возврат, а надежда.** Три правила, оплаченные этим: (1) в блоке восстановления ВОЗВРАТ ИДЁТ ПЕРВЫМ, а уборка после — каждая секунда до возврата это окно, в которое остановка стоит владельцу; (2) у любого обратимого выключения обязана быть ОТДЕЛЬНАЯ команда возврата, которую можно позвать руками, и сценарий печатает её в начале прогона, а не в конце; (3) дверь, через которую состояние используется дальше, должна САМА отказываться работать в испорченном состоянии и называть его — иначе о поломке узнают по симптому, а не по причине.   → link: [[EXP-0080]] · mechanized: `_config/enter-world.ps1` (сторож MOD LEFT DISABLED), `_config/nexus/mod-on.ps1`
**Repro:** остановить прогон в разные моменты и проверить состояние мира после каждой остановки — а не только после успешного прохода.
**Trigger:** пишешь сценарий, который ВРЕМЕННО портит чужое состояние (выключает мод, переименовывает файл, правит конфиг) → возврат первым в finally, отдельная команда возврата, и сторож на двери, которая этим состоянием пользуется.
**Not for:** изменения, которые сами по себе безвредны при незавершённом прогоне — временный файл в скретчпаде, копия для чтения.

### EXP-0085 · 2026-09-10 · ❌ · #series #uniformity #owner #requirements #guard
**Context:** владелец сказал про подпись кадров: «тень не на всю ширину внизу картинки, а на ту область, где текст — и не шире». Я выполнил это буквально: плашка строится по габариту своей подписи.
**Tried / did:** подписал четырнадцать кадров, посмотрел глазами несколько штук — каждый по отдельности выглядел ровно так, как просили, и я счёл работу сделанной.
**Result:** ❌ — «на разных картинках размер плашки разный... ЭТО БАГ!». Замер по всем четырнадцати: от 1134 до 1525 px, разброс 391 px, десятая часть ширины кадра. Каждый кадр по отдельности требованию отвечал, а НАБОР — нет.
**Lesson:** **требование, сказанное про один экземпляр, почти всегда имеет вторую половину — про набор, — и её не произносят вслух, потому что она очевидна человеку.** «Не шире текста» — про кадр; «одинаково на всех» — про серию, и владелец не назвал это, пока не увидел разнобой. Практический признак класса: делаешь ПАРТИЮ однотипных артефактов, и хоть одно их свойство выводится из содержимого КАЖДОГО. Такое свойство обязано считаться один раз на партию. И вторая половина урока — про проверку: я смотрел кадры ПООДИНОЧКЕ, а дефект жил только в сравнении. Артефакты серии проверяются рядом друг с другом, иначе глаз честно смотрит и честно ничего не видит.   → link: [[EXP-0081]] · `bugs/11_caption_plate_sized_per_frame.md` · mechanized: `_config/nexus/plate-check.py` (`@guard plate-uniform`)
**Repro:** посчитать спорное свойство по всем элементам партии и посмотреть на разброс — одно число вместо четырнадцати взглядов.
**Trigger:** делаешь серию однотипных артефактов (кадры, карточки, страницы, экспорты) → выпиши свойства, которые обязаны совпадать у всех, и считай каждое ОДИН раз на серию, а не на элемент.
**Not for:** артефакты, которые по замыслу подгоняются под содержимое — всплывающая подсказка, ярлык у объекта, тултип: там подгонка и есть требование.

### EXP-0084 · 2026-09-10 · ❌ · #taste #owner #blind #variants #cost
**Context:** владелец попросил стиль подписей «как в старом заходе». Скрипт того захода умер вместе с сессией, остались только кадры.
**Tried / did:** снял стиль замером пикселей (где подложка, какой яркости, какой высоты текст) и переделал подписи. Не то. Переделал ещё раз. Не то. Пошёл на третий круг.
**Result:** ❌ — «ты неверно сейчас сделал!», три круга подряд. Причина не в замерах: к тому моменту API перестал принимать картинки на чтение ВООБЩЕ (отклонял даже кусок 800×184), то есть я правил ВСЛЕПУЮ артефакт, который судят глазом. Замер даёт числа, но не даёт увидеть результат своей же правки.
**Lesson:** **когда возможность СМОТРЕТЬ кончилась, слепая итерация по вкусовому критерию — не работа, а трата чужого времени, и признать это надо ВСЛУХ и СРАЗУ.** Правильный ход при исчерпанном зрении ровно один: перестать угадывать и предъявить владельцу НЕСКОЛЬКО вариантов на одном материале, чтобы он назвал букву — один круг вместо пяти. И отдельно: замер пикселей заменяет память о стиле, но НЕ заменяет взгляд на собственный результат; путать эти две вещи — это и есть слепая правка с видом уверенности.   → link: [[EXP-0081]] · `plans/05_conan_nexus_publication.md`
**Repro:** перед правкой артефакта для глаза — проверить, можешь ли ты его открыть. Не можешь → варианты владельцу, а не правка.
**Trigger:** критерий приёмки — вкусовое прилагательное («красиво», «как там», «суперский стиль»), а посмотреть на результат нечем → сделай 3-4 варианта одним листом и спроси букву.
**Not for:** машинно проверяемые свойства (разрешение, различность кадров, наличие подписи) — там числа честнее взгляда и слепота не мешает.

### EXP-0083 · 2026-09-10 · ❌→✅ · #engine #assumptions #source #unreal #naming
**Context:** в моде камеры было поле «ось вращения» (`TargetOffset`) с комментарием «камера продолжает смотреть в ту же точку, меняется РАКУРС». Владелец: «ось наклона... мне показалась неработающей».
**Tried / did:** прошлая сессия приняла имя поля за его смысл и лечила симптом — дописала УДЕРЖАНИЕ, чтобы игра не возвращала своё. Удержание заработало: 12 300 возвратов за семь минут. Владелец увидел результат мгновенно — «и дёргалась камера, когда ты её поднял».
**Result:** ❌→✅ — заголовок Unreal, дословно: `Offset at start of spring, applied in world space`. Это СДВИГ связки в мировых координатах; поворот в нём не участвует вовсе. Проверено кадром при 200: горизонт остался посередине экрана, герой уехал за нижний край. То есть поле было дублем `offset_z`, а «лечение» — покадровой дракой, породившей ту самую дрожь, которую этот же проект лечил в баге 04. Настоящий угол нашёлся у ДРУГОГО объекта: у камеры `bUsePawnControlRotation = false`, её относительный поворот свободен, и записанные −12° держатся сами, без единой повторной записи.
**Lesson:** **имя поля — это гипотеза о его смысле, а не смысл; смысл лежит в объявлении движка, и стоит он одного запроса.** Два признака, по которым эта ошибка опознаётся раньше расплаты: (1) лечение требует УДЕРЖАНИЯ — то есть ты дерёшься с движком за поле, которое, возможно, просто делает не то; (2) у «починенного» появляется цена в записях за секунду. Считай эту цену ВСЛУХ: редкая правка после чужого сброса — единицы в минуту, покадровая драка — сотни в секунду, и это разные вещи, а не оттенки одной.
**Repro:** прежде чем удерживать чужое поле — процитируй его объявление у вендора и назови, что оно меняет: положение или поворот.
**Trigger:** пишешь сторож, возвращающий значение чужому объекту → сперва докажи, что поле вообще делает то, чего ты от него ждёшь, и посчитай частоту возвратов.
**Not for:** поля, чьё поведение уже снято собственным замером в этом же проекте.

### EXP-0082 · 2026-09-10 · ❌ · #harness #testing #falseok #input #ue4ss
**Context:** мод камеры вешает всё управление на нумпад, владелец добавил правило «Ctrl — это дополнительные опции». Агент неделю «проверял» камеру, посылая нажатия через `input.ps1`.
**Tried / did:** послал Numpad 1 — в журнале мода ничего. Решил, что дело в моём Ctrl, — но и голая клавиша не дошла. Ни виртуальной клавишей, ни скан-кодом через SendInput, ни при удержании 300 мс, при включённом NumLock и игре в фокусе.
**Result:** ❌ — до ИГРЫ нажатия доходят (Tab открыл инвентарь), до UE4SS нет. Значит **все прежние камерные опыты «с нумпада» были холостым ходом**, а слово «проверил» — неправдой. Отсюда же и три одинаковых кадра прошлого захода под тремя разными подписями: настройка не менялась ни разу, менялись только подписи. Лечение — канал без клавиш: мод раз в секунду читает файл `ключ = значение`.
**Lesson:** **орган управления, который харнесс НАЖАТЬ НЕ МОЖЕТ, не проверяется никем — и это не пробел в покрытии, а источник ложного «проверено».** Отказ бесшумен с обеих сторон: скрипт печатает «key pressed» и выходит с нулём, мод молчит, потому что до него ничего не дошло. Поэтому у любого нового органа управления первым делом проверяется НЕ его логика, а сама доставка: нажми и найди в журнале строку, которую это нажатие обязано родить. Нет строки — дальше тестировать нечего. И общий вывод: если управление живёт только на клавишах, у мода обязан быть второй вход — файл, команда, что угодно, — иначе автономная проверка невозможна в принципе.
**Repro:** послать нажатие и грепнуть журнал на строку, которую оно печатает. Пусто — доставка сломана, а не логика.
**Trigger:** собираешься проверять что-то нажатием клавиши → сперва докажи одной клавишей, что нажатия вообще доходят до ТОГО СЛОЯ, который их читает (игра и загрузчик модов — разные слои).
**Not for:** органы управления, которые харнесс дёргает напрямую вызовом функции, минуя ввод.

### EXP-0081 · 2026-09-10 · ❌ · #artifacts #verification #showing #owner #cost
**Context:** владелец заказал серию игровых кадров для страницы мода: ваниль, наш мод, разные настройки камеры, с подписями на двух языках.
**Tried / did:** снял девять кадров, наложил подписи, отдал владельцу. Смотрел глазами ДВА из девяти - остальные проверил по факту «файл создан, размер ненулевой».
**Result:** ❌ - проверил владелец, и вскрылось: кадр «настолько близко, насколько хочется» оказался видом ОТ ПЕРВОГО ЛИЦА (персонажа в кадре нет вовсе); три кадра наклона оказались ОДИНАКОВЫМИ, потому что настройка не удерживалась, - и подписи на них утверждали разницу, которой не было; заказанной «панорамы сверху вниз» не было снято ни одной. Слово владельца: «ты их снимай и смотри глазами, получил ли ты то, что ХОТЕЛ получить, выглядит ли оно так».
**Lesson:** **артефакт, который делается ДЛЯ ГЛАЗА, проверяется ТОЛЬКО глазом - и глазом агента ПЕРВЫМ, а не владельца.** «Файл создан» и «в файле то, что заказано» - разные утверждения, и для картинки второе не выводится из первого никак: у неё нет ни кода возврата, ни лога. Это тот же класс, что ложный `[TESTED]`, только вместо теста - взгляд. Хуже всего не пустой кадр, а ПРАВДОПОДОБНЫЙ: три одинаковых кадра с разными подписями выглядят как работа и врут ровно до момента, когда на них посмотрят. И практическое: смотреть надо СРАЗУ после съёмки - к концу длинного чата API перестал принимать картинки («many-image request»), то есть возможность посмотреть ИСЧЕРПАЕМА, и копить просмотр на конец нельзя.   → link: `plans/05_conan_nexus_publication.md` · [[EXP-0074]]
**Repro:** после каждого снятого кадра открыть его и ответить себе одним словом: «я хотел именно это?». Не ответил - переснять, а не подписывать.
**Trigger:** делаешь артефакт, который владелец будет СМОТРЕТЬ или СЛУШАТЬ (кадр, схема, рендер, звук) → открой его сам, до отправки, и сверь с тем, что собирался получить.
**Not for:** машинные артефакты с проверяемым результатом - там код возврата, диф и счётчик честнее взгляда.

### EXP-0080 · 2026-09-10 · ❌→✅ · #diagnosis #blame #ownership #controlcase #method
**Context:** владелец: «модалка не закрылась... ты что-то сломал, я понял это по модалке». Незадолго до этого я деплоил новую версию мода и запускал загрузку Dev Kit.
**Tried / did:** ПЕРВЫМ делом бросился откатывать свою правку. Только потом прочитал журнал - и он за минуту показал, что упал сам UE4SS, до того как существует хоть один Lua-мод. Дальше я построил версию «виновата загрузка» на совпадении по времени (десять удачных запусков до неё, два мёртвых после) и выдал её владельцу. Владелец: «загрузка не может ломать игру, это ты притянул за уши». Контрольный опыт с ПОЛНОСТЬЮ остановленной загрузкой - снова отказ. Версия мертва.
**Result:** ❌→✅ - причина найдена перебором с исключением по ОДНОЙ переменной за раз (семь запусков): мой Lua, процессы Epic, Chrome, загрузка, правка конфига, файлы игры (сторож целостности), файлы UE4SS (sha1 против эталона) - все сняты. Лечение - перезагрузка машины. Спусковой крючок так и не назван, и это записано честно.
**Lesson:** **два разных промаха в одном разборе, и оба про ответственность, а не про технику.** Первый: услышав «ты сломал», я стал ОПРАВДЫВАТЬСЯ рассуждением («Lua грузится позже, значит не он») вместо двухминутной ПРОВЕРКИ - откатить и запустить. Рассуждение, даже верное, не снимает подозрения; снимает только опыт, и делать его надо ПЕРВЫМ, потому что он же и самый быстрый. Второй: не найдя причины, я схватился за самое заметное совпадение по времени и выдал корреляцию за причину - при том что у самого в журнале опыта записано обратное. Признак этого промаха один и он опознаётся мгновенно: в объяснении есть слова «началось после того, как», но нет опыта, где подозреваемого ВЫКЛЮЧИЛИ. И третье, мелкое, но дорогое: **«не знаю причину» - законный итог разбора**, если перечислено, что именно исключено и чем; выдуманная причина хуже отсутствующей, потому что её запишут в документы.   → link: [[EXP-0073]] · [[EXP-0074]]
**Repro:** список подозреваемых, и по каждому - опыт с ВЫКЛЮЧЕНИЕМ ровно его одного; результат каждого записывать до следующего.
**Trigger:** владелец говорит «ты сломал» → сперва откат и запуск, только потом слова. И: собрался объяснить отказ совпадением по времени → сперва выключи подозреваемого и покажи, что отказ ушёл.
**Not for:** случаи, где выключение подозреваемого дороже самого отказа; там граница называется вслух.

### EXP-0079 · 2026-09-10 · ❌→✅ · #ue4ss #modding #flaky #uninitialised #reboot
**Context:** UE4SS перестал стартовать в Конане: `Fatal Error: [FName::StaticAlignment] StaticAlignment_Private is not valid`. Семь запусков подряд, все мёртвые; утром того же дня десять запусков подряд удачных, файлы на диске те же байт в байт.
**Tried / did:** сверил журнал здорового и мёртвого запуска, отбросив метки времени.
**Result:** ✅ - журналы СОВПАДАЮТ дословно (все сканы находят всё, отличаются только адреса от рандомизации) до одной строки. Здоровый печатает `FName Alignment: 0x2684C788`, после перезагрузки `0x997C788`, мёртвый не печатает ничего и падает. **Оба «здоровых» значения - мусор**: выравнивание бывает 4 или 8, а не сотни миллионов. UE4SS читает НЕИНИЦИАЛИЗИРОВАННУЮ переменную и проверяет её лишь на «не ноль». Лечится ПЕРЕЗАГРУЗКОЙ.
**Lesson:** **у отказа, где «на диске ничего не менялось, а поведение изменилось», первым подозреваемым идёт неинициализированное состояние в чужом коде - и опознаётся оно по НЕПРАВДОПОДОБНОМУ значению в удачном прогоне, а не по сообщению в неудачном.** Сообщение об ошибке говорит, что значение невалидно; на причину указывает то, что в РАБОЧЕМ случае оно тоже бессмысленное. Отсюда практический ход: при плавающем отказе сличать журнал удачного и неудачного прогона ЦЕЛИКОМ, и смотреть не на строку падения, а на строку, которой в неудачном НЕТ.
**Repro:** `sed 's/^\[[0-9: .-]*\] *//' good.log > g; то же для bad.log > b; diff g b` - метки времени и адреса отбрасываются, остаётся суть.
**Trigger:** чужой загрузчик/инжектор падает на «значение невалидно», а файлы не менялись → сличи журналы целиком, найди значение в удачном прогоне и спроси, правдоподобно ли ОНО. Дальше - перезагрузка как первое лечение.
**Not for:** отказы, где файлы или версии действительно менялись - там сперва сверка хешей.

### EXP-0078 · 2026-09-10 · ❌→✅ · #powershell #tooling #silentfailure #windows
**Context:** консольный загрузчик на PowerShell для владельца - отдельное окно с процентами и скоростью. Окно открывалось и падало, владелец видел «найден: []» и ошибку разбора аргументов.
**Tried / did:** три дефекта подряд, и все три - свойства ИМЕННО Windows PowerShell 5.1, а не логики: (1) `$ErrorActionPreference='Stop'` плюс `2>&1` от НАТИВНОЙ программы - каждая её строка stderr заворачивается в ErrorRecord и обрывает скрипт, а `legendary` печатает свои INFO именно в stderr; (2) параметр `$App` и локальная `$app` - ОДНА переменная, потому что имена в PowerShell не различают регистр: `$app = $null` стёр параметр, и в программу ушло пустое имя; (3) `--json` у инструмента печатается вперемешку со служебными строками, и `ConvertFrom-Json` молча давал не то.
**Result:** ❌→✅ - после трёх правок загрузка пошла. Цена: владелец три раза смотрел на окно, которое не работает.
**Lesson:** **скрипт-обёртка вокруг чужой консольной программы на Windows PowerShell 5.1 ломается НЕ логикой, а тремя свойствами самой оболочки — и все три молчат.** Отсюда три правила на такую обёртку: `ErrorActionPreference` держать `Continue` и проверять `$LASTEXITCODE` явно; НИКОГДА не заводить локальную переменную, отличающуюся от параметра только регистром; и разбирать вывод чужой программы как ТЕКСТ, а не доверять её `--json`. Плюс общее: **перед запуском чужой программы проверяй, что переданный ей аргумент НЕ ПУСТ** — пустая строка проходит все проверки типов и падает уже внутри чужого разбора, где сообщение говорит о ней, а не о причине.
**Repro:** прогнать скрипт ВНУТРИ сессии агента с захватом вывода, а не только `Start-Process` в отдельное окно: в отдельном окне ошибка видна владельцу, а агенту - нет.
**Trigger:** пишешь .ps1-обёртку вокруг exe → сразу ставь `Continue`, проверь имена параметров на совпадение по регистру с локальными, и прогони скрипт с захватом вывода ДО того, как показывать окно владельцу.
**Not for:** PowerShell 7+ (там поведение stderr от нативных программ другое) и чистые cmdlet-скрипты без вызова exe.

### EXP-0077 · 2026-09-10 · ❌→✅ · #catalogue #evidence #ownership #controlcase #modding
**Context:** вопрос владельца «кто вызывает Placeholder Perk, может комбинация наших модов?». Офлайн-каталог имён показал, что перковые таблицы везут ДВА мода, и из этого был сделан вывод «пустые слоты - цена их наложения».
**Tried / did:** вместо того чтобы доложить этот вывод, добрал две другие улики (кто монтируется в ВАНИЛЬНЫЙ путь, и кто по журналу игры реально переписывает строки), а потом поставил контроль - выключил подозреваемого и снял тот же экран.
**Result:** ❌→✅ - вывод про наложение оказался НЕВЕРЕН. Конфликта нет вовсе: виновник не переписывает ни одной чужой строки, он подменяет ванильное окно интерфейса и рисует СВОИ заглушки. Контроль показал два разных экрана одного персонажа, и вопрос закрылся.
**Lesson:** **каталог имён отвечает, кто ЧТО ВЕЗЁТ, и НЕ отвечает, кто ПОБЕДИЛ - это два разных вопроса, и второй решается журналом игры и выключением.** Соблазн силён именно потому, что каталог даёт красивый список из двух кандидатов, а «оба правят одно и то же, вот и конфликт» звучит как объяснение. Признак подмены вопроса: в выводе стоит слово «наложение», «конфликт» или «оба», а измерения, показывающего ПОРЯДОК или ПОБЕДИТЕЛЯ, за ним нет. Практическое различение в модах на Unreal: мод, монтирующийся в СВОЮ папку (`Content/Mods/<имя>/`), чужого не трогает; мод, монтирующийся в ВАНИЛЬНЫЙ путь, подменяет игру - и этот список короткий, его стоит снимать первым.   → link: `plans/04_conan_ochered_zakazov.md` · [[EXP-0074]] · [[EXP-0076]]
**Repro:** `grep -v "/Mods/" каталог.txt` - кто лезет в ванильные пути; `who-overwrites-table.py` - кто переписал строку по журналу игры; выключение подозреваемого - кто на самом деле рисует экран.
**Trigger:** каталог назвал двух и больше владельцев одной сущности → НЕ писать «конфликт». Сперва спросить, кто побеждает, и проверить выключением.
**Not for:** случаи, где журнал прямо печатает перезапись строки с именем мода - там владелец назван измерением, а не догадкой.

### EXP-0076 · 2026-09-10 · ❌→✅ · #diagnosis #bisect #catalogue #cost #owner
**Context:** баг 09 - зум камеры Конана уезжал за предел; вечер 09.09 ушёл на семь правок своего мода впустую, следующий шаг был размечен как деление сборки пополам на 35 модов, 5-6 запусков игры владельцем.
**Tried / did:** перед первым запуском потратил минуту на офлайн-каталог имён по всем 44 пакам и грепнул подозреваемых по `camera|springarm|zoom`.
**Result:** ✅ - из семнадцати модов виновной половины камерные ассеты везёт РОВНО ОДИН (`Cam/EAA_Zoom.uasset`, `UI/Buttons/toggle_camera_zoom.uasset`). Перебор схлопнулся с шести запусков до двух.
**Lesson:** **деление пополам не обязано быть слепым - ранжируй половины бесплатным признаком ПЕРЕД первым запуском.** Бисекция гарантирует log2(n) шагов и потому кажется оптимальной; но она не пользуется ничем, что уже лежит на диске. Минута каталога стоила дешевле одного запуска игры, а сэкономила четыре - и каждый из них это чужое время, а не своё. Правило: пока перебор требует ЧЕЛОВЕКА или запуска тяжёлой программы, сперва спроси, нет ли признака, который отсортирует кандидатов даром.   → link: `bugs/09_DONE_conan_zoom_runaway.md` · [[EXP-0074]]
**Repro:** `python researches/ue5-iostore-index/utoc-index.py "<моды>/"*.pak` с приписыванием имени пака к каждому пути, дальше греп по теме симптома.
**Trigger:** собрался делить сборку/конфиг/список пополам → сперва проверь, нет ли дешёвого признака, по которому кандидаты ранжируются без запуска.
**Not for:** случаи, где признака нет вовсе - тогда честная бисекция и есть кратчайший путь.

### EXP-0075 · 2026-09-10 · ❌→✅ · #docs #ownnotes #recon #cost
**Context:** искали виновника бага 09 два вечера; на второй он был назван делением сборки пополам - Enhanced Armory and Arsenal.
**Tried / did:** после находки перечитал собственные документы пака.
**Result:** ❌ - ответ лежал записанным СУТКИ. В `modpack.json` у записи EAA стоял `$comment_risk`: «у мода есть СВОЙ Extended Camera Zoom… Если зум начнёт вести себя иначе - подозреваемый номер один», и `plans/03` повторял это же словами «лечится удалением EAA из манифеста». Мод был «снят с подозрения» сырым поиском строк по пакам - методом, про который в этом же проекте УЖЕ записано, что он ложноотрицателен всегда.
**Lesson:** **прежде чем строить дорогой перебор, грепни СВОИ документы по имени симптома - проект часто уже назвал подозреваемого и забыл.** Опасность не в том, что записи нет, а в том, что она есть и её отменили негодной проверкой: снятое подозрение выглядит как закрытый вопрос и больше не перечитывается. Отсюда практическое следствие: **снятие подозрения обязано называть МЕТОД, которым оно снято** - тогда следующая сессия видит «снято сырым поиском по пакам» и понимает цену этих слов, вместо голого «проверено, не виноват».   → link: `bugs/09_DONE_conan_zoom_runaway.md` · [[EXP-0073]]
**Repro:** `grep -rin "<симптом|подозреваемый>" modpack.json plans/ bugs/ docs/` до первого запуска чего бы то ни было.
**Trigger:** берёшь в работу баг, у которого есть история → первым делом греп своих документов по теме, и отдельно проверь, КАК снимались прежние подозрения.
**Not for:** свежий симптом в свежем коде, у которого истории нет.

### EXP-0074 · 2026-09-10 · ❌→✅ · #testing #controlcase #falsegreen #harness #sensitivity
**Context:** лечение бага 09 - глушение чужого камерного компонента. Прогон харнессом дал «максимум цели 1000, предел держится». Работа выглядела сделанной.
**Tried / did:** вместо объявления победы прогнал КОНТРОЛЬ - тот же опыт с ВЫКЛЮЧЕННЫМ лечением.
**Result:** ❌→✅ - контроль дал 980, то есть «предел держится» и БЕЗ лечения. Проверка не умела провалиться. Причина: харнесс крутил колесо 12 щелчков по умолчанию, а этого хватает ровно до предела 1000 - симптом начинается дальше. С 40 щелчками контроль показал 2100 и скачущую штангу, а с лечением - ровно 1000.0 и неподвижную. Только после этого зелёный что-то значил.
**Lesson:** **зелёный опыт обязан сперва доказать, что умеет краснеть - и типичная причина ложного зелёного не логика, а НЕДОСТАТОЧНАЯ АМПЛИТУДА воздействия.** Умолчания харнесса подобраны под прошлую задачу и молча становятся слепым пятном новой: параметр «12 щелчков» не выглядит как решение о чувствительности, но является им. Признак, по которому ловится: контроль и опыт дают ОДИН и тот же результат - это не подтверждение, а сообщение «моё воздействие ничего не задевает».   → link: `bugs/09_DONE_conan_zoom_runaway.md` · [[EXP-0065]] · [[EXP-0071]]
**Repro:** выключить лечение одним ключом и повторить прогон; одинаковый результат = опыт слеп, поднимать амплитуду, пока контроль не покраснеет.
**Trigger:** прогон подтвердил лечение → НЕ докладывать, пока контрольный прогон без лечения не показал симптом. Умолчания харнесса при этом проверять как часть опыта, а не как обстановку.
**Not for:** случаи, где выключить лечение дороже, чем оно стоит; там граница называется вслух.

### EXP-0073 · 2026-09-10 · ❌ · #diagnosis #ownership #wrongplace #owner #cost
**Context:** владелец весь вечер сообщал «камера дёргается, предела нет»; агент семь раз подряд правил СВОЙ мод камеры.
**Tried / did:** зажим предела в стороже, потом в другой ветке, потом покадрово, потом перехватом функции блюпринта — пять хуков.
**Result:** ❌ — ни одна правка не помогла. Владелец назвал причину сам: «пока модов из стима не наставили, а был только наш рукописный мод вчера — всё хорошо было с зумом. Был лимит, не было рывков». Измерение подтвердило: наш мод пишет ВСЁ, что должен (журнал: щуп выключен «да», предел записан), и симптом остаётся.
**Lesson:** **прежде чем чинить свой код, спроси, КОГДА поломка появилась.** Один вопрос владельцу — «а раньше работало?» — отделяет регрессию своего кода от чужого вмешательства и стоит одной строки; его отсутствие стоило вечера. Признак, что чинишь не там: правки ложатся верно, журнал показывает, что они применены, а симптом не двигается. Это не «правка недостаточная» — это «правка не в том слое». Свой код читать проще чужого, и агент ищет под фонарём; ЛЕГЧЕ не значит ВЕРНЕЕ.   → link: `bugs/09_conan_zoom_runaway.md` · `plans/04_conan_ochered_zakazov.md`
**Repro:** сверить дату появления симптома с `git log --date=short --pretty='%ad %s'` своего мода И со списком того, что ставилось в тот день (у пака — `modpack.json`, у Мастерской — время папок в `_workshop/`). Если симптом старше своих правок — чинить не своё.
**Trigger:** владелец жалуется на поведение, которое трогает твой код → ПЕРВЫЙ вопрос: «когда это работало в последний раз и что менялось между тем и этим?» — до чтения своего кода, не после.
**Not for:** свежая функция, которой вчера не существовало, — там регрессия по определению своя.

### EXP-0072 · 2026-09-10 · ❌ · #lua #scope #silentfailure #pcall #ue4ss
**Context:** зажим предела зума в моде камеры: код написан верно, стоит в верном месте, и не работает.
**Tried / did:** рядом со записью стоял счётчик срабатываний `zoom_cap_hits = zoom_cap_hits + 1`, а объявление `local zoom_cap_hits = 0` лежало НИЖЕ по файлу — в конце.
**Result:** ❌ — в Lua имя, объявленное ниже места использования, равно `nil`; арифметика падает; окружающий `pcall` ошибку глотает. Зажим молча не работал и не оставил в журнале НИ ОДНОЙ строки, пока владелец видел камеру на 10 060 при пределе 1000. Класс уже был описан ДВАЖДЫ в комментариях этого же файла (EXP-0051) — и агент наступил в него снова.
**Lesson:** **у этого отказа ровно один признак — ТИШИНА там, где ждёшь строку, и её легко принять за «условие не сработало».** Отсюда правило сильнее, чем «объявляй выше»: любая ветка, которая ДОЛЖНА была сработать, обязана печатать хоть что-то — иначе «не выполнилась» и «выполнилась и упала» неразличимы. И второе: `pcall` вокруг чужого вызова заодно глушит СВОИ ошибки в том же блоке; оборачивать надо вызов, а не логику вокруг него.
**Repro:** `luac -p файл.lua` синтаксис пройдёт — он этого НЕ ловит. Ловится грепом: `grep -n "^local ИМЯ" файл.lua` и сверкой номера строки с первым использованием; либо строкой-доказательством внутри ветки.
**Trigger:** пишешь в Lua-моде новую ветку со счётчиком или накопителем → объяви его рядом с остальным состоянием модуля, ВЫШЕ всех использований, и добавь в ветку печать.
**Not for:** языки с подъёмом объявлений (JS `var`, Python на уровне модуля) — там этот класс выглядит иначе.
mechanized: `ConanExiles/_config/lua-globals.py` (2026-09-13, [[EXP-0107]])

### EXP-0071 · 2026-09-10 · ❌→✅ · #ue4ss #hooks #blueprint #falseok #measurement
**Context:** предел зума решили ставить перехватом функции блюпринта персонажа — `CameraZoomOut`, имя снято разведкой метаданных класса.
**Tried / did:** `RegisterHook` по пути функции; вернул успех — записали «перехват стоит».
**Result:** ❌ — перехват НЕ СРАБОТАЛ ни разу, пока цель уезжала на 3820. Расширили до пяти точек (`CameraZoomOut`, `CameraZoomIn`, оба `InpActEvt_Zoom*`, `AdjustCameraToSpringArm`) — встали все пять, сработало ноль за 30 секунд. Вывод: UE4SS 3.0.1 в этой сборке функции блюпринта не перехватывает.
**Lesson:** **«хук встал» и «хук работает» — РАЗНЫЕ утверждения, и первое ничего не доказывает.** `RegisterHook` не возвращает ошибку на функцию, которую в итоге никто не вызовет, поэтому успех установки — не доказательство, а обещание. Любой перехват обязан приносить СЧЁТЧИК СРАБАТЫВАНИЙ и сам кричать, если счётчик ноль. И следствие для перебора: цикл, останавливающийся на первом «успехе», до настоящего кандидата может не дойти — вешай на всех и считай каждого.
**Repro:** через 30 секунд после установки напечатать сумму срабатываний; ноль = перехвата нет, что бы ни говорила установка.
**Trigger:** ставишь RegisterHook → в тот же заход добавь счётчик вызовов и отложенную проверку «сработал ли».
**Not for:** нативные функции движка (`/Script/Engine.*`) — их этот же UE4SS хукает исправно, мод камеры на них и живёт.

### EXP-0070 · 2026-09-10 · ❌→✅ · #config #override #silentfailure #guard #owner
**Context:** три лекарства от дрожи камеры были написаны в код мода 09.09 и объявлены применёнными; владелец три часа повторял «что-то мешает».
**Tried / did:** сверили блок `defaults` в `main.lua` с рабочим `config.lua` в игре.
**Result:** ❌→✅ — семь расхождений, из них три — ровно те лекарства (`zoom_interp_speed` код 0.0001 / файл 9.0, `disable_collision_test` true / false, `prefer_per_frame` true / false). Мод сам переписывает `config.lua` при подкрутке с нумпада и пишет туда ВСЕ ключи, поэтому значение, однажды попавшее в файл, навсегда побеждает код.
**Lesson:** **у пары «умолчания в коде + файл настроек» файл всегда сильнее, и это молчит.** Правка выглядит сделанной, в игру не доезжает, и снаружи неотличима от «починили — не помогло». Лечится не аккуратностью, а ПЕЧАТЬЮ: программа при старте сама называет каждый ключ, где файл перебил код. Печатать надо МИМО выключателя журнала — иначе файл, перебивший и его, заглушит сообщение ровно в том случае, ради которого оно заведено. Ключи, которые правит сам пользователь, в этот список не идут: сторож, кричащий на норму, перестают читать.
**Repro:** `python` сверкой блока `defaults` из главного файла с файлом настроек — печатать только различающиеся ключи; в самой программе — строка «config перебил N настроек кода» при старте.
**Trigger:** правишь умолчание в коде программы, у которой есть файл настроек, который она же и пишет → сверь файл ПЕРЕД тем, как объявить правку применённой.
**Not for:** конфиги, которые программа только читает и никогда не пишет, — там файл меняет человек осознанно.

### EXP-0069 · 2026-09-09 · ❌→✅ · #docs #catalogue #owner #usefulness
**Context:** собрал каталог 120 модов Мастерской; геймплейным написал настоящие строки, а косметике поставил ярлык в одно слово — «причёски», «боевые раскраски», «косметика».
**Tried / did:** сдал таблицу владельцу как готовую работу.
**Result:** ❌ — «причёски — вот это описание по-твоему? Я могу подтереться такими описаниями». И раньше, про первую редакцию: «полная хуйня без описания того, как мод работает, какие боли лечит, какие у него особенности».
**Lesson:** **список, по которому нельзя принять решение, — это не документ, а оглавление.** Ранг, имя и категория не говорят ничего: выбирают по тому, ЧТО вещь делает, КАК она открывается, ЧТО требует и В ЧЁМ ПОДВОХ. И правило распространяется на ВСЕ строки, включая те, что мне лично неинтересны: ярлык на «неважной» половине обесценивает весь документ, потому что читатель не знает заранее, какая половина важна ему. Проверка перед сдачей: **можно ли по моей строке решить «брать или не брать»?** Если нет — это ярлык. Побочная польза оказалась крупнее самой переделки: только при чтении ПОЛНЫХ описаний вскрылось, что треть каталога висит на модах с пометкой «Single Player/Coop is NOT supported», то есть владельцу недоступна в принципе.   → link: `ConanExiles/docs/08-мастерская-steam.md`
**Repro:** взять любую строку каталога и спросить: что она даёт человеку, который выбирает? «Причёски» — ничего.
**Trigger:** пишешь список/каталог/сравнение → у каждой строки должно быть «что делает · как открывается · что требует · подвох».
**Not for:** оглавления и указатели, где строка ОБЯЗАНА быть короткой, — но там и обещания «описания» нет.

### EXP-0068 · 2026-09-09 · ❌→✅ · #tooling #scraping #silentfailure #validation
**Context:** снимал описания 120 страниц Мастерской циклом через свой Chrome; каждая итерация дописывала ответ в файл.
**Tried / did:** два прохода по 60 страниц, десять минут работы.
**Result:** ❌ — Chrome отвалился в начале прохода, и все 120 «карточек» оказались строкой `[error] нет CDP на :9222`, аккуратно записанной в файл на место данных. Обнаружилось только при разборе: «с полным описанием: 0». Десять минут и два прохода — впустую.
**Lesson:** **цикл, который пишет ответ инструмента в файл, обязан проверять КАЖДЫЙ ответ на признак данных, а не на факт записи.** Ошибка инструмента — это тоже текст, он так же успешно дописывается, и файл выглядит полным: нужный размер, нужное число записей, ровная структура. Дёшево лечится одной строкой после батча: `grep -c '"data":{"t":' файл` — считать не записи, а ВАЛИДНЫЕ записи, и сравнивать с ожидаемым числом. То же правило спасло бы раньше: тот же класс, что и «прибор, который льстит» (EXP-0065), только здесь врёт не метрика, а сборщик.   → link: [[EXP-0065]]
**Repro:** убить Chrome посреди цикла — файл продолжит расти, счётчик строк будет верным, данных не будет.
**Trigger:** пишешь цикл «инструмент -> файл» длиннее десяти итераций → добавь проверку валидных записей после каждого батча.
**Not for:** одиночные вызовы, где ответ виден глазами сразу.

### EXP-0067 · 2026-09-09 · ❌→✅ · #recon #sources #video #subtitles
**Context:** владелец сказал, что Wayward Realms считает мир на видеокарте и держит графовую базу связей. Я искал подтверждение веб-поиском и не нашёл — записал в конспект «поиском не подтверждено».
**Tried / did:** три поисковых запроса по статьям, обзорам и форумам; нашлись только общие фразы вроде «система на 10 млн NPC».
**Result:** ❌→✅ — владелец указал, где искать: **их собственный YouTube-канал**. `yt-dlp --write-auto-subs --skip-download` на двух видео дал субтитры, и в девлоге «Foundations For A Living Breathing World» приём описан голосом полностью: текстура 1024×1024, пиксель = NPC, положение пикселя = его ID, каналы RGB = координаты X/Y/Z, миллион NPC, пространственные запросы как операции над картинкой; плюс графовая база для квестов. Владелец был прав целиком, я — нет.
**Lesson:** **если у разработчика есть девлоги, первоисточник — субтитры его видео, а не статьи о нём.** Технические подробности живут в получасовом ролике, где их проговаривают вслух; в статьи попадает пересказ, из которого детали вычищены. Веб-поиск по такой теме даёт ложноотрицательный результат: он ищет по тексту страниц, а нужное сказано голосом. Стоимость проверки мала — `yt-dlp` кладёт субтитры за секунды, и получасовое видео превращается в 30 КБ текста, по которому можно грепать. Правило: прежде чем записать «подтверждения не нашёл» про продукт, у которого есть канал, — сними субтитры и поищи в них.   → link: `ConanExiles/docs/10-жизнь-мира.md` · [[EXP-0064]]
**Repro:** `yt-dlp --write-auto-subs --sub-langs "en.*" --skip-download --sub-format vtt <url>`, затем убрать таймкоды и повторы и грепать по терминам.
**Trigger:** собираешься написать «в открытых источниках этого нет» про игру, движок или инструмент → проверь, ведёт ли автор видео-девлоги.
**Not for:** темы без видео-первоисточника; и помни, что автосубтитры перевирают имена собственные и термины — цифры и общий смысл верны, точное написание надо сверять.

### EXP-0066 · 2026-09-09 · ❌→✅ · #tooling #deploy #silentfailure #scope
**Context:** добавлял два мода Мастерской в сборку Конана; чтобы не гонять раскатку целиком, запустил её с фильтром `-Only "три мода"`.
**Tried / did:** `Deploy-ModPack.ps1 -Deploy -Only "<три мода>"` — раскатать только новое.
**Result:** ❌ — три мода встали, и ровно этим **выключили семь уже стоявших**. У Конана порядок загрузки это ФАЙЛ `modlist.txt`, а не содержимое папки; раскатка пересобирает его из переданного списка модов, и `-Only` урезал не только работу, но и хозяина порядка. Паки остались лежать в папке и не грузились бы вовсе. Поймала собственная проверка: семь строк `pak not in modlist (will NOT load)` и код возврата 1.
**Lesson:** **флаг, сужающий РАБОТУ, не имеет права сужать владение ОБЩИМ артефактом.** Если инструмент собирает глобальный файл (список загрузки, индекс, манифест) из списка обработанных элементов, то любой фильтр молча делает этот файл неполным — и последствие проявится не там, где была команда. Признак опасности: в коде есть глобальный артефакт, который пишется ПОСЛЕ цикла по элементам. Правило: при фильтре либо сливать с существующим файлом, либо не трогать его и сказать об этом вслух.   → link: `bugs/06_deploy_only_truncates_modlist.md`
**Repro:** пак с несколькими pak-модами и `modList` в манифесте → `-Deploy -Only "<один мод>"` → в `modlist.txt` одна строка вместо всех.
**Trigger:** собираешься запустить раскатку/сборку с фильтром (`-Only`, `--filter`, `--just`) → сперва спроси, какие ОБЩИЕ файлы она перепишет.
**Not for:** Palworld — там моды грузятся содержимым папки `~mods`, списка не существует и дефекта нет.

### EXP-0065 · 2026-09-09 · ❌→✅ · #tooling #measurement #selfdeception #baseline
**Context:** писал прибор, который считает по базе сохранения, чем занят мир Конана, — чтобы у заказа «оживить мир» была измеренная точка отсчёта.
**Tried / did:** классификатор «это событие мира или живность» по имени объекта; первый прогон напечатал «СОБЫТИЯ МИРА: 92».
**Result:** ❌→✅ — 92 оказались строками с именем ровно `"0"`, служебной записью игры. Заметил только потому, что сверил число с соседней таблицей: в `actor_position` ровно 92 строки. После правки настоящая цифра — **ноль**.
**Lesson:** **прибор, который подтверждает желаемое, обязан проверяться отдельно и первым.** Ошибка была не в коде, а в направлении: она льстила — показывала, что жизнь в мире есть, тогда как её ноль. Такую ошибку не находят перечитыванием кода, её находят **сверкой с независимым числом** (здесь — количеством строк в другой таблице). Правило: у всякой новой метрики найди второй, не связанный с ней способ получить ту же величину, и сойдись с ним ДО того, как метрика станет базой сравнения.   → link: `ConanExiles/_config/read-world-events.py`
**Repro:** `python _config/read-world-events.py` — строка «СОБЫТИЯ МИРА»; сверить с `select count(*) from actor_position`.
**Trigger:** написал прибор, и первый же прогон дал приятную цифру → ищи независимую сверку, прежде чем радоваться.
**Not for:** приборы, чей результат неприятен — там смещение работает в другую сторону, и первый подозреваемый уже ты сам.

### EXP-0064 · 2026-09-09 · ❌ · #web #auth #falsedata #verification
**Context:** собирал карточки модов Мастерской Steam обычной веб-выборкой, без входа в аккаунт.
**Tried / did:** прочитать страницы модов и записать в конспект, что они собой представляют.
**Result:** ❌ — страницы вернулись не ошибкой, а **осмысленной заглушкой**: «этот предмет несовместим с Conan Exiles Enhanced» и «нарушает правила сообщества, виден только вам». Обе фразы ложные. На их основании в конспект попало, что мод `Reforge Legendaries` снят за нарушение, а `Emberlight` несовместим. Проверка залогиненным браузером: оба живы, помечены Enhanced, обновлены в августе, 7 036 и 16 048 подписчиков.
**Lesson:** **анонимная выборка ресурса, у которого есть вид «для вошедшего», врёт правдоподобно, а не заметно.** Она не отдаёт 403 — она отдаёт связный текст, который читается как факт и переживает вычитку. Единственная защита: **снимать сведения тем же доступом, каким пользуется владелец**, а если это невозможно — помечать их как непроверенные. Соседний признак того же класса: тот же ресурс отвечает 429 уже на пятой странице подряд, то есть анонимный путь ещё и не масштабируется.   → link: `ConanExiles/docs/08-мастерская-steam.md` · [[EXP-0063]]
**Repro:** открыть `steamcommunity.com/sharedfiles/filedetails/?id=3741684658` без входа и с входом — сравнить текст про совместимость.
**Trigger:** собираешься записать в конспект факт о чужом ресурсе, снятый анонимно → проверь тем доступом, который есть у владельца.
**Not for:** страницы, у которых нет персонального вида (документация, GitHub) — там анонимная выборка честна.

### EXP-0063 · 2026-09-09 · ❌→✅ · #recon #auth #assumption #cost
**Context:** 08.09 снимал каталог модов Конана. Nexus дал 40 модов; Мастерскую Steam снять не удалось, и я записал в конспект «страница отдаёт разметку без единой карточки — Steam требует вход», после чего сборка собиралась из этих сорока.
**Tried / did:** через сутки, по прямому вопросу владельца, попробовал ещё раз — с его входом в аккаунт в профиле нашего Chrome.
**Result:** ❌→✅ — каталог открылся полностью: **5 735 модов, из них 1 150 с меткой Enhanced**. Против сорока. Всё, что отделяло нас от него, — **одна минута владельца**.
**Lesson:** **«требует вход» — это не преграда, а цена, и цену надо назвать вслух, а не записывать в недоступное.** Ошибку сделало не наблюдение (оно было верным), а вывод из него. Коварство в том, как выглядит стена: страница вернулась с правильным заголовком «Мастерская Steam для Conan Exiles Enhanced» и нулём карточек — **ни редиректа, ни ошибки, ни надписи «войдите»**. Цена промаха: сборка, собранная из огрызка в 40 модов вместо каталога в 1 150, и три ошибочных утверждения в конспектах. Правило: прежде чем объявить источник недоступным, проверь состояние входа ЯВНО (`#account_pulldown` и подобное) и предложи владельцу минуту его времени.   → link: `ConanExiles/docs/08-мастерская-steam.md`
**Repro:** `node kumm.mjs eval "https://steamcommunity.com/" '(document.querySelector("#account_pulldown")||{}).innerText'` — пусто значит не залогинен, и лечится это входом, а не кодом.
**Trigger:** источник отдал пустой список, но валидную страницу → первым делом проверь вход, а не разметку и не защиту.
**Not for:** источники, где вход владельца недоступен или запрещён правилами, — там «недоступно» честный вывод.

### EXP-0062 · 2026-09-09 · ❌ · #ue4ss #hotreload #crash #method #accumulation
**Context:** ночь правок мода камеры; каждую правку подхватывали горячей перезагрузкой Ctrl+R, не перезапуская игру.
**Tried / did:** десятки итераций «правка -> Ctrl+R -> проверка глазом».
**Result:** ❌ — игра оборвалась с EXCEPTION_ACCESS_VIOLATION по адресу 0x8ee1, стек из одних кадров UE4SS. Журнал показал причину числом: **мод стартовал в сессии 38 раз**. Каждый старт заводит вечный цикл сторожа на 30 мс через LoopInGameThreadWithDelay, а ОТМЕНИТЬ такой цикл нечем — API остановки у него нет. То есть в игровом потоке крутилось 38 сторожей разом, больше тысячи вызовов в секунду: ровно условия EXP-0052 и открытого дефекта UE4SS #1180.
**Lesson:** **горячая перезагрузка НЕ откатывает то, что мод завёл: вечные циклы и хуки переживают её и НАКАПЛИВАЮТСЯ.** Ctrl+R выглядит как «перезапустить мод», а на деле это «запустить ещё один экземпляр поверх». Для модов без вечных циклов она безвредна и экономит время; для мода с LoopInGameThreadWithDelay или самоперезапускающейся цепочкой каждая перезагрузка добавляет постоянную нагрузку, и игра падает не на правке, а НАКОПЛЕНИЕМ — то есть подозрение падает на последнюю правку, которая ни при чём. Проверка: сравнить в журнале число стартов мода с числом остановок и с ожидаемым «один». Правило: мод с вечным циклом подхватывать ТОЛЬКО перезапуском игры.   → link: [[EXP-0052]] · `ConanExiles/_unpacked/ConanCameraControl/`
**Repro:** `grep -c "starting mod" UE4SS.log` против `grep -c "Stopping mod" UE4SS.log` — и сверить с тем, сколько раз мод должен был стартовать. Больше одного за сессию при вечном цикле = накопление.
**Trigger:** собираешься проверить правку мода UE4SS через Ctrl+R → сперва посмотри, заводит ли мод вечный цикл или хук; если да, перезапускай игру.
**Not for:** моды, которые только читают файлы и не заводят циклов и хуков, — там горячая перезагрузка честно экономит время.

### EXP-0061 · 2026-09-09 · ❌ · #ue4ss #umg #crash #hypothesis #stop
**Context:** после того как создание виджета уронило игру, выдвинута версия «виноват граф `Construct` у выбранного класса»; разведкой отобран класс БЕЗ `Construct` и со своей функцией `SetText`.
**Tried / did:** создал `WBP_MapText_C` через `UWidgetBlueprintLibrary::Create` + `AddToViewport`.
**Result:** ❌ — тот же крэш, совпадение до секунды (показ назначен на 01:54:29.5, дамп `crash_2026_09_09_01_54_29`), и на этот раз владелец был В МИРЕ, а не в меню. Версия про `Construct` опровергнута: падает сама связка Create+AddToViewport в этой сборке. Пятый способ показа из пяти.
**Lesson:** **когда отказала ЦЕЛАЯ СЕМЬЯ способов, следующая гипотеза внутри той же семьи почти всегда стоит дороже, чем выход из семьи.** Каждая из пяти попыток была разумной и каждая опиралась на разбор предыдущей — но все пять делили одно непроверенное допущение: что мод под UE4SS вообще может нарисовать своё в этой сборке. Проверять надо было ДОПУЩЕНИЕ СЕМЬИ, а не перебирать её членов. Практический признак, что пора выходить: третий отказ подряд, каждый со своим правдоподобным объяснением. И цена промедления считается не в своём времени, а в чужом: за вечер владелец пережил семь обрывов игры, и почти все — цена агентских проверок, а не его игры.   → link: `ConanExiles/docs/06-интерфейс-модов.md` · [[EXP-0060]]
**Repro:** `ls <игра>/Binaries/Win64/ue4ss/*.dmp` — имя дампа содержит время до секунды; сверить с секундой, на которую мод планировал действие. Совпадение = вина вызова, а не обстановки.
**Trigger:** третий подряд отказ в одной и той же семье способов → останови перебор и проверь допущение, общее для всей семьи; если проверить нечем — уходи на путь без риска.
**Not for:** случаи, где отказы РАЗНОРОДНЫ (разные подписи, разные моменты) — там перебор внутри семьи ещё осмыслен.

### EXP-0060 · 2026-09-09 · ❌ · #ue4ss #widgets #crash #hypothesis #docs
**Context:** показать свою надпись в главном меню Конана; конспект `docs/06` называл правильным маршрут «создать СВОЙ экземпляр виджет-класса игры и добавить во вьюпорт».
**Tried / did:** собрал всё по фактам — класс из оффлайн-каталога, поле из разведки, управление этим окном доказано на практике — и создал экземпляр через `UWidgetBlueprintLibrary::Create` + `AddToViewport`.
**Result:** ❌ — **пятый крэш игры за вечер**, и на этот раз мгновенный: мод загружен в 01:46:18.69, показ назначен на 01:46:29.8, файл дампа называется `crash_2026_09_09_01_46_29`. В журнале мода о лампе НИ ОДНОЙ строки — ни успеха, ни отказа, то есть игра умерла между входом в функцию и первой записью. Все ЧЕТЫРЕ известных способа показать своё на экране в этой игре теперь отказали.
**Lesson:** **«маршрут выглядит правильным» — это гипотеза, а не результат, даже когда её полтора экрана обосновывает собственный конспект проекта.** Конспект убедительно объяснял, почему этот путь лучше трёх провалившихся — и был неверен. Документ, написанный по разбору отказов, наследует их авторитет, хотя проверен ровно настолько же, насколько и они, то есть никак. Практическое следствие: помечать в конспектах НЕПРОВЕРЕННЫЕ маршруты так же явно, как провалившиеся, и не давать им расти в уверенности от одного пересказа к другому. И второе, дешёвое: **отсутствие записи в журнале — это тоже показание.** Ни успеха, ни отказа между входом в функцию и первым `log` — значит смерть внутри вызова, и время дампа доказывает это точнее любого стека.   → link: `ConanExiles/docs/06-интерфейс-модов.md`
**Repro:** `ls <игра>/Binaries/Win64/ue4ss/*.dmp` — имя файла дампа содержит время до секунды; сверить с временем, на которое мод планировал действие.
**Trigger:** собираешься сделать шаг, который документ проекта называет правильным, но никто ни разу не выполнял → относись к нему как к опыту: отдельный заход, выключено по умолчанию, владелец предупреждён.
**Not for:** маршруты, уже проверенные наблюдением в этой же игре, — у них статус другой.

### EXP-0059 · 2026-09-09 · ❌ · #ue4ss #crash #recon #safety #promise
**Context:** разведочный режим мода: узнать устройство классов-виджетов игры, объявлен агентом безопасным («только метаданные»).
**Tried / did:** перечислял имена свойств и функций (это правда безопасно), но для НЕзагруженных классов добавил `LoadAsset` — синхронную загрузку ассета.
**Result:** ❌ — **четвёртый крэш игры по вине агента**: `Abort signal received`, `AbortHandler` в журнале игры через **27 секунд** после вызова, когда мод уже молчал. Отсрочка и увела бы подозрение в сторону: рядом стояла строка про TPM, которая выглядит виновником, но встречается и в трёх старых журналах успешных запусков, — а `AbortHandler` не встречается ни в одном, кроме этого. Диагноз: неудачная синхронная загрузка оставляет битый пакет, спотыкается об него позже сборщик мусора.
**Lesson:** **разведка смотрит на то, что игра сделала САМА, и не просит её сделать ничего.** Граница между «безопасно» и «рискованно» проходит не по названию стадии и не по тому, читаем мы или пишем, а по одному вопросу: ЗАСТАВЛЯЕТ ЛИ эта строка игру что-то делать. Перечислить имена — нет. Загрузить ассет — да, и место такой строки в рискованной половине со всеми церемониями. Ошибка была не в вызове, а в ОБЕЩАНИИ: агент положил действие внутрь половины, которую сам объявил наблюдением, и владелец запускал игру, доверяя этому слову. И отдельно: **отсроченный крэш ищется сверкой со СТАРЫМИ журналами** — «что есть в этом запуске и чего нет ни в одном прежнем» развело настоящую улику и совпадение за одну команду.   → link: `bugs/05_conan_loadasset_delayed_abort.md`
**Repro:** `grep -a -c "AbortHandler" <игра>/Saved/Logs/*.log` — строка, которая есть ТОЛЬКО в подозрительном запуске, и есть улика; та, что есть и в старых, — совпадение.
**Trigger:** пишешь «безопасную» разведку в чужой игре → пройди по каждой строке с вопросом «заставляет ли она игру что-то делать»; если да — строке место в рискованной стадии, а обещание безопасности надо снять.
**Not for:** свои собственные объекты, созданные модом, — с ними действие законно; запрет касается имущества игры.

### EXP-0058 · 2026-09-09 · ❌→✅ · #parsing #binaryformat #falsepositive #guard
**Context:** разбор индекса каталога в контейнере UE5 `.utoc` — поиск начала индекса по строке точки монтирования.
**Tried / did:** искал ОДНО вхождение ОДНОЙ строки `../../../` и разбирал от него.
**Result:** ❌→✅ — прочитался **1 контейнер из 37**, остальные молча объявлены «без индекса»: у большинства точка монтирования другая (`../../../ConanSandbox/Content/`), а у мелких доборных уходит вглубь до конкретной папки. Плюс та же последовательность байт встречается внутри самих данных, то есть первое вхождение — не обязательно индекс. Лечение: пробовать ВСЕ вхождения и принимать первый разбор, который сошёлся.
**Lesson:** **у разбора чужого бинарного формата «по якорю» обязан быть сторож, иначе неудача выглядит как успех.** Пустой результат сам по себе не отличим от «в этом файле ничего нет» — 36 контейнеров отрапортовали именно так и были бы приняты за правду. Сторож должен быть СЧЁТНЫМ, а не структурным: обход дерева обязан дать ровно столько путей, сколько заявлено файлов в заголовке. Ложный разбор почти никогда не сойдётся по количеству, а вот «правдоподобно выглядящие» строки выдаёт легко.   → link: `researches/ue5-iostore-index/`
**Repro:** `python researches/ue5-iostore-index/utoc-index.py "<игра>/Content/Paks/"*.utoc | grep -c "^#"` — число строк-сводок обязано равняться числу контейнеров, и ни одна не должна говорить «индекс каталога не найден».
**Trigger:** пишешь разбор бинарного формата по найденному якорю → добавь счётную проверку итога и перебирай все вхождения якоря, а не первое.
**Not for:** форматы с честным версионированным заголовком, где смещения вычисляются, а не угадываются — там сторож полезен, но якорь не нужен вовсе.

### EXP-0057 · 2026-09-09 · ✅ · #ue4ss #recon #offline #widgets #cost
**Context:** моду под UE4SS нужно имя класса виджета игры, чтобы показать надпись; вечер 08.09 искал его перебором объектов в живой памяти.
**Tried / did:** посмотрел, нет ли того же ответа на диске: разобрал индекс каталога контейнеров `.utoc` игры.
**Result:** ✅ — индекс лежит ОТКРЫТЫМ текстом (шифрования нет, флаги `0x09`, GUID ключа нулевой). За секунды снят полный каталог: **138 424 ассета из 37 контейнеров**, среди них все виджеты игры с путями. Сверка с наблюдением: класс `W_MainMenu_MainMenu_C`, виденный накануне в живой памяти, нашёлся оффлайн как `UI/Widgets/MainMenu/W_MainMenu_MainMenu.uasset`. Цена прошлого пути за тот же ответ — **три крэша игры и «0 из 376»**.
**Lesson:** **прежде чем искать что-то в памяти чужой игры — посмотри, не лежит ли это на диске.** Перебор живых объектов стоит крэшей и требует человека за клавиатурой; тот же ответ по ИМЕНАМ обычно лежит в открытом индексе ассетов и достаётся бесплатно, заранее и в одиночку. Порядок дешевле обратного: сперва диск, потом память, и в память идти уже с готовым именем. Граница честная: оффлайн даёт имена, но не содержимое — ассеты сжаты Oodle, а у UE5 он слинкован в exe статически, отдельной библиотеки в поставке игры нет.   → link: `researches/ue5-iostore-index/` · пак Конана `docs/06-интерфейс-модов.md`
**Repro:** `python researches/ue5-iostore-index/utoc-index.py "<игра>/Content/Paks/"*.utoc > assets.txt` — затем `grep -E "/(W|WBP)_[^/]*\.uasset$" assets.txt`.
**Trigger:** собираешься перебирать объекты в памяти игры ради ИМЕНИ (класса, ассета, виджета) → сперва сними каталог ассетов с диска.
**Not for:** вопросы о СОСТОЯНИИ живой игры (что сейчас загружено, какое значение у свойства) — на них диск не отвечает.

### EXP-0056 · 2026-09-08 · ❌→✅ · #windows #tasklist #falsenegative #harness #selftest
**Context:** прибор замера производительности ждал запуска игры и «честно» докладывал, что она не запустилась.
**Tried / did:** проверка шла как `tasklist | grep -qi "ConanSandbox-Win64-Shipping.exe"`.
**Result:** ❌→✅ — табличный вывод `tasklist` ОБРЕЗАЕТ имя образа на 25 символах, а имя игры — 31. Совпадение
не наступало НИКОГДА: игра шла десять минут, а прибор смотрел мимо и врал без единой ошибки. Лечится
форматом CSV (`/FO CSV /NH`, имя не режется) и `MSYS2_ARG_CONV_EXCL='*'`, иначе Git Bash подменяет ключ
`/FO` на путь и tasklist молча отдаёт пустоту.
**Lesson:** детектор, который не умеет видеть, обязан КРИЧАТЬ, а не ждать. В любой сторож добавляется
самопроверка на заведомо присутствующем объекте — без неё «не нашёл» неотличимо от «не умею искать».
**Repro:** `MSYS2_ARG_CONV_EXCL='*' tasklist /FI "IMAGENAME eq tasklist.exe" /FO CSV /NH | grep -qi tasklist.exe`

### EXP-0055 · 2026-09-08 · ❌→✅ · #unreal #interpolation #api #gotcha
**Context:** нужно было ОСТАНОВИТЬ штатное сглаживание игры, чтобы её записи в цель перестали влиять.
**Tried / did:** первым порывом — поставить скорость сглаживания в 0.
**Result:** ❌ — в Unreal у `FInterpTo` скорость `<= 0` означает «прыгнуть сразу в цель», то есть ровно
обратное «замри». Помогло исчезающе малое положительное число.
**Lesson:** «ноль» в чужом API не обязан значить «выключено»; у сглаживания он часто значит «мгновенно».
Проверять смысл граничного значения, а не додумывать его.   → link: ConanExiles/docs/07-зум-камеры.md

### EXP-0054 · 2026-09-08 · ❌→✅ · #config #save #silentloss #ue4ss
**Context:** мод сам переписывает свой `config.lua` при подкрутке с клавиш.
**Tried / did:** добавил в конфиг два новых ключа и полчаса не мог понять, почему настройка «не действует».
**Result:** ❌→✅ — сохранение пишет файл по ФИКСИРОВАННОМУ списку полей, и ключ, которого в списке нет,
молча исчезает при первом же автосохранении. Выглядит как «правка не подействовала».
**Lesson:** если код умеет ПЕРЕЗАПИСЫВАТЬ свой конфиг — список полей сохранения это часть контракта;
новый ключ добавляется в ДВА места, иначе он живёт до первого сохранения.
**Repro:** `grep -n "order = {" -A 12 <мод>/Scripts/main.lua` — сверить со списком умолчаний.

### EXP-0053 · 2026-09-08 · ❌→✅ · #watchdog #falsepositive #time #selfinflicted
**Context:** сторож должен был заметить, что лечение не работает, и вернуть прежнее поведение.
**Tried / did:** считал ТРИ ПРОВЕРКИ подряд, на которых камера не там, где надо.
**Result:** ❌ — после каждого спринта он ловил ЗАКОННЫЙ переход (камера ехала на место), объявлял
лечение неудачным и включал обратно ту самую болезнь. Владелец видел это как «после спринта появилась
дрожь»: сторож своими руками возвращал баг.
**Lesson:** сторож обязан считать ВРЕМЯ и молчать во время законных переходных состояний, а не считать
проверки. Иначе он превращается в генератор регрессий.   → link: bugs/04_conan_camera_microjitter.md

### EXP-0052 · 2026-09-08 · ❌ · #ue4ss #timers #crash #idle
**Context:** после перехода на новое лечение старое удержание стало не нужным, но таймер остался крутиться.
**Tried / did:** оставил таймер 16 мс работать вхолостую (функция выходила первой строкой) и добавил
сверху сторожа на 20 вызовов в секунду.
**Result:** ❌ — два потока заданий в одну очередь UE4SS уронили игру через несколько минут нормальной
работы (`EXCEPTION_ACCESS_VIOLATION`, стек из кадров UE4SS; открытый баг UE4SS #1180 — падение в
`process_simple_actions` при накладывающихся `ExecuteInGameThread`).
**Lesson:** холостой таймер — не «просто лишний вызов», а вклад в очередь, и цена ему крэш. Механизм,
ставший ненужным, надо ОСТАНАВЛИВАТЬ, а не оставлять вращаться.

### EXP-0051 · 2026-09-08 · ❌ · #lua #closures #declaration #order
**Context:** отложенный вызов разведочной функции из мода UE4SS.
**Tried / did:** написал `ExecuteWithDelay(..., function() ExecuteInGameThread(probe) end)` ВЫШЕ того
места, где `local function probe` объявлена.
**Result:** ❌ — `LUA_ERRRUN` на каждом заходе: локальная функция, объявленная позже места вызова,
попадает в замыкание как `nil` (в журнале это выглядело как `No overload found for ExecuteInGameThread`).
**Lesson:** в Lua порядок объявления локальных функций значит буквально то, что значит. Либо вызов ниже
определения, либо предварительное объявление `local f` и присваивание `f = function() ... end`.

### EXP-0050 · 2026-09-08 · ❌ · #pcall #crash #enumeration #ue4ss
**Context:** нужно было понять устройство чужого объекта в игре.
**Tried / did:** перебрал ВСЕ свойства персонажа и читал их значения, обернув каждое чтение в `pcall`.
**Result:** ❌ — игра упала (`EXCEPTION_ACCESS_VIOLATION 0x7378`, стек из кадров UE4SS). `pcall` ловит
ошибки Lua, но НЕ падение внутри движка, поэтому обёртка не защищала ни от чего.
**Lesson:** перебирать можно МЕТАДАННЫЕ (имена, типы, смещения) — это безопасно; читать значения можно
только у полей, известных поимённо. «Обернул в pcall» ≠ «безопасно».
   → link: ConanExiles/docs/06-интерфейс-модов.md

### EXP-0049 · 2026-09-08 · ❌→✅ · #instrument #selfproving #measurement #diagnosis
**Context:** мод писал значение в игру и раз в секунду печатал «в компоненте = хотим», что читалось как
доказательство работы.
**Tried / did:** полтора часа строил гипотезы поверх этого показания.
**Result:** ❌→✅ — чтение шло ПОСЛЕ собственной записи, в том же вызове, то есть доказывало само себя.
Перенос чтения ПЕРЕД записью мгновенно дал настоящую картину: между нашими записями игра утаскивала
значение на 10–37 см, и по постоянному соотношению осей вычислилась её цель — с точностью до двух
сантиметров от того, что потом нашлось поимённо.
**Lesson:** прибор, который читает после собственной записи, измеряет себя, а не мир. Всякое «работает»
должно опираться на чтение ДО вмешательства.   → link: bugs/04_conan_camera_microjitter.md

### EXP-0048 · 2026-09-08 · ❌→✅ · #instrument #falsenegative #grep #logs #diagnosis
**Context:** разбор чужого журнала (игра, UE4SS) — половина работы сессии свелась к «есть ли в логе такая строка».
**Tried / did:** искал `grep "Creating NGX DLSS Feature"`. Ноль совпадений — и я трижды построил на этом ноле диагноз: «DLSS не запускается», «моя правка сломала DLSS», «нужна переустановка драйвера».
**Result:** ❌→✅ — в журнале строка написана **`Creating   NGX DLSS Feature`, с ТРЕМЯ пробелами**. DLSS работал всё время. Три диагноза подряд были построены на артефакте моего же шаблона поиска. Владелец платил за это перезапусками игры.
**Lesson:** **ноль совпадений — это НЕ наблюдение, это отсутствие наблюдения.** Разница между «события не было» и «мой шаблон не подошёл» неразличима по выводу, а выводы из них противоположны. Шаблон поиска по ЧУЖОМУ журналу обязан быть проверен на строке, которая там ЗАВЕДОМО есть: нашлась контрольная — можно верить отрицательному результату, не нашлась — чинить шаблон, а не строить теории. Тот же класс, что [[EXP-0038]] (отбраковка без отрицательного контроля), но с другой стороны: там глушили лишнее, здесь не увидели нужного.   → link: пак Конана `_config/`, сессия 08.09.2026
**Repro:** перед любым `grep -c ... == 0`-выводом прогнать `grep -c <заведомо присутствующая строка>` по тому же файлу. Ноль на контроле = шаблон или кодировка, а не факт. Для пробелов помогает `grep -E "слово +слово"` вместо литерального пробела.
**Trigger:** делаешь вывод из ОТСУТСТВИЯ строки в чужом файле → сперва положительный контроль на этом же файле.
**Not for:** свои собственные логи с известным форматом — там шаблон и формат писала одна рука.

### EXP-0047 · 2026-09-08 · ❌ · #edit #truncation #scripted #verification #selfinflicted
**Context:** правил Lua-мод скриптами на Python: вырезать блок по индексам `t.index(...)` и вставить новый.
**Tried / did:** одна из правок собирала результат как `t[:начало] + новое` — без хвоста. Проверял после каждой правки баланс скобок и `function`/`end`.
**Result:** ❌ — правка раскладки клавиш **обрезала файл**, снеся блок удержания камеры, который стоял ниже. Файл остался СИНТАКСИЧЕСКИ БЕЗУПРЕЧНЫМ и функционально пустым: баланс сошёлся, потому что удалён был целый согласованный кусок. Владелец запускал игру трижды, а я построил на этом два ложных диагноза («хук работает», «хук не вызывается») — обоих объектов в файле уже не было.
**Lesson:** **скрипт, который правит файл по индексу, обязан проверять, что ОСТАЛОСЬ, а не только что вставлено.** Структурная проверка целостности (скобки, ключевые слова) этот класс не ловит ПО ПОСТРОЕНИЮ: удаление согласованного блока баланс не нарушает. Дешёвая защита — список обязательных якорей: после каждой правки убедиться, что все ключевые функции и вызовы на месте, и что длина файла не уменьшилась неожиданно. И отдельно: проверять надо файл В ЦЕЛИ, а не только в исходнике — раскатка добавляет ещё одно место, где можно потерять.   → link: пак Конана `_unpacked/ConanCameraControl/`
**Repro:** после правки — `for part in <список якорей>; do grep -c "$part" ФАЙЛ; done`, и то же самое по файлу в цели после раскатки. Ноль на любом якоре = правка съела лишнее.
**Trigger:** пишешь скрипт с `t[:i] + новое` или `t[i:j] = ...` → добавь в тот же скрипт проверку якорей ПОСЛЕ записи.
**Not for:** правки через полную перезапись известного содержимого (шаблон целиком) — там терять нечего.

### EXP-0046 · 2026-09-08 · ❌→✅ · #library #constants #ue4ss #assumption #owner
**Context:** привязка клавиш нумпада в Lua-моде через таблицу `Key` библиотеки UE4SS.
**Tried / did:** взял `Key.NUM_ZERO` и `Key.NUM_NINE` как очевидно правильные. Когда поведение не сошлось (пересбор компонента срабатывал вместе со сменой дистанции), искал ошибку в СВОЕЙ логике. Владелец сказал: «поищи в интернете, удивишься».
**Result:** ❌→✅ — в нашей сборке UE4SS 1127 таблица содержит **`NUM_ZERO = 0x69`, а 0x69 это VK_NUMPAD9**. Правильное значение 0x60. Обе константы указывали на ОДНУ физическую клавишу. Известный дефект: issue #633, чинился дважды — PR #716 (13.12.2024) и PR #762 (31.01.2025); наша сборка от 29.12.2024, второй фикс в неё не попал. Перевёл все привязки на сырые коды Windows.
**Lesson:** **имя константы в чужой библиотеке — это утверждение автора, а не факт.** Когда поведение расходится с именем, проверять надо ЗНАЧЕНИЕ константы, а не свою логику вокруг него — иначе разбор уходит в сторону надолго. И второе, не менее важное: **владелец сказал «поищи», и был прав** — двухминутный поиск по имени константы нашёл готовое issue с номером и датами, тогда как я тратил заходы на перестройку собственных рассуждений. Дата влития патча против даты сборки — решающая проверка, и она делается одной командой.   → link: пак Конана `_unpacked/ConanCameraControl/Scripts/main.lua`
**Repro:** `gh api repos/<OWNER>/<REPO>/pulls/<N> --jq '{merged_at, title}'` и сравнить с датой публикации своей сборки (`gh api repos/.../releases/tags/<tag> --jq .published_at`). Патч позже сборки = дефект живой.
**Trigger:** поведение чужой библиотеки не сходится с именем её константы → искать issue по имени константы ДО того, как перестраивать свой код.
**Not for:** библиотеки, собранные из исходников самим, — там значение видно прямо.

### EXP-0045 · 2026-09-08 · ❌→✅ · #ue4ss #lua #structs #silentfailure #hooks
**Context:** свой Lua-мод для UE4SS: писал смещение камеры в свойство `SocketOffset` пружинной штанги и вешал удержание на хук тика.
**Tried / did:** (1) `arm.SocketOffset.X = v` — по полям; (2) `RegisterHook("/Script/Engine.Actor:ReceiveTick", fn)` и счёл установку успехом.
**Result:** ❌→✅ — оба хода МОЛЧА не работали. (1) UE4SS отдаёт структурное свойство КОПИЕЙ: правка полей копии в объект не попадает, ошибки нет. Правильно — присваивать структуру целиком: `arm.SocketOffset = { X=…, Y=…, Z=… }`. Простое float-свойство (`TargetArmLength`) при этом писалось нормально, что и маскировало дефект. (2) `RegisterHook` вернул успех, а функция не вызвалась НИ РАЗУ (блюпринтовый Event Tick идёт только у тех акторов, у кого он есть в графе).
**Lesson:** **в UE4SS два разных молчаливых отказа, и оба выглядят как «работает».** Структурное свойство пишется ЦЕЛИКОМ, иначе запись уходит в копию. Хук, который ВСТАЛ, и хук, который РАБОТАЕТ — разные утверждения, и `RegisterHook` про второе ничего не говорит. Лечится не аккуратностью, а приборами: считать вызовы хука и через N секунд включать запасной путь, если их ноль; и печатать ОБРАТНОЕ ЧТЕНИЕ — что реально лежит в свойстве против того, что мы туда клали. Обратное чтение развело три отказа, до того неразличимых: запись не прошла · игра перебила · удержание не запускалось. Все три случились в одну сессию.   → link: пак Конана `_unpacked/ConanCameraControl/Scripts/main.lua`
**Repro:** в моде — строка вида `log("в компоненте: X=%.1f … | хотим: X=%.1f … | вызовов=%d", …)` раз в секунду. Совпало и вызовов много = держим; разошлось = перебивают; вызовов ноль = удержание не работает.
**Trigger:** пишешь свойство объекта UE через UE4SS Lua → структуру присваивай целиком и добавь обратное чтение. Вешаешь хук → считай вызовы, не верь факту установки.
**Not for:** чтение свойств — там копия безвредна.

### EXP-0044 · 2026-09-08 · ❌→✅ · #mods #gamefiles #irreversible #backup #integrity
**Context:** мод `No-Intro-Splash` из выбора владельца, 6 КБ, «пропускает заставки» — выглядел самым безобидным в наборе и стоял первым в порядке загрузки.
**Tried / did:** перед раскаткой заглянул ВНУТРЬ архива, а не поверил названию и описанию.
**Result:** ❌→✅ — это вообще не мод: ни одного `.pak`, вместо этого **подмена файлов самой игры** — десять роликов и `Splash.bmp` заглушками по 392 байта. Десять из них числятся в манифесте целостности установки. Поставь как есть — и получишь: (1) десять ложных тревог в сверке целостности; (2) невозвратимую потерю 197 МБ оригиналов; (3) при штатном `-Remove` **стирание файлов игры**, потому что удаление идёт по списку `to`.
**Lesson:** **«мод» — это не гарантия, что ставится ДОБАВЛЕНИЕ.** Часть модов работает подменой файлов игры, и такой мод необратим по построению: удаление вернёт пустоту, а не подлинник. Три обязательных шага перед раскаткой любого мода, чей архив содержит пути ВНУТРЬ папки игры: сохранить подлинники вне репозитория и вне игры → объявить их в базе целостности с причиной и закреплённым хешем → записать установку ПОФАЙЛОВО, никогда папкой. Последнее не про аккуратность, а про катастрофу: `"to": "ConanSandbox"` означает, что `-Remove` сотрёт всю игру одной командой.   → link: [[EXP-0042]] · [[EXP-0039]] · пак Конана `modpack.json` → No-Intro-Splash
**Repro:** до раскатки — `python -c "import zipfile;print([i.filename for i in zipfile.ZipFile(A).infolist()])"`. Нет ни одного `.pak`/`.utoc`/`.ucas`, зато есть пути вида `<Игра>/Content/...` — это подмена, а не мод. После раскатки контроль: `python _config/verify-install.py` обязан печатать «ТРЕВОГ НЕТ».
**Trigger:** берёшь мод в сборку → загляни в архив ДО раскатки. Пути внутрь папки игры → три шага выше, и ни одного из них не пропускать.
**Not for:** моды, кладущие только свои файлы в отдельную папку модов (`.pak` в `Mods/`, Lua в `ue4ss/Mods/`) — там удаление обратимо, и церемония не нужна.

### EXP-0043 · 2026-09-08 · ❌→✅ · #fixture #portability #secondgame #regression #phase2
**Context:** движок KUMM учили ставить моды второй игре (Conan Exiles Enhanced). Проверить хотелось, не трогая ни настоящую игру, ни библиотеку владельца.
**Tried / did:** собрал ФИКСТУРУ в scratchpad — поддельный пак, поддельная библиотека из архивов, названных по схеме движка, и поддельная папка игры с одним файлом-признаком. Прогнал по ней `-Deploy -DryRun`, потом боевую раскатку, потом `-Verify`.
**Result:** ❌→✅ — фикстура нашла **четыре** дефекта за один прогон, и ни один не был бы виден чтением кода. Главный: разбор имени архива требовал modId из **ровно четырёх цифр** — у Palworld они такие (2972…3762), у Конана одно- и двузначные (1, 29, 41), то есть движок не увидел бы **ни одного** его архива. Плюс `PalModSettings.ini` писался в чужую цель, путь к `Engine.ini` всегда считался абсолютным (у Конана он относительный папке игры), а прощание звало смотреть несуществующий лог.
**Lesson:** **дефект переносимости не читается глазами — он ловится вторым экземпляром.** Код, написанный под одну игру, выглядит общим ровно до первого прогона под вторую: константы прячутся не в именах, а в допущениях о ФОРМЕ данных (сколько цифр в id, абсолютный путь или относительный). Фикстура из пустых файлов правильной ФОРМЫ стоит двадцати минут и заменяет собой и настоящую игру, и риск её испортить. И второе: правку парной функции («пишет» ↔ «читает») закрывать тестом на НАСТОЯЩИХ именах из живой библиотеки — иначе починка второй игры ломает первую, которой владелец пользуется ежедневно.   → link: `test-parse-archive.mjs` · `MASTER_PLAN.md` → Phase 2 · [[EXP-0018]]
**Repro:** `node test-parse-archive.mjs` в KUMM — 17 случаев, из них девять настоящих имён Palworld (включая ловушки, где ИМЯ мода само содержит версию: «Camera Control 1.0.4 3659 1.0.4 …»), четыре конановских с короткими id и отрицательный контроль на мусоре. Ждём 17 из 17.
**Trigger:** заводишь в движок вторую игру / второго клиента / второй формат → СНАЧАЛА фикстура из пустых файлов правильной формы, и только потом код. Прогон по ней — до первого касания настоящих данных.
**Not for:** задачи, где вся суть в содержимом файлов, а не в их форме (разбор реального сохранения, декодирование текстур) — пустая фикстура там не докажет ничего.

### EXP-0042 · 2026-09-08 · ❌→✅ · #safety #falsealarm #verification #baseline #instrument
**Context:** `verify-install.py` — предохранитель целостности игры, заведённый после уничтожения двух бинарников (`bugs/02`, [[EXP-0039]]) и обязательный ПЕРЕД любой автономной работой рядом с игрой.
**Tried / did:** запустил его как ворота перед работой и не поверил выводу на слово: разобрал все 80 расхождений поимённо.
**Result:** ❌→✅ — на ЗДОРОВОЙ установке прибор печатал «БИТО 2, ОТСУТСТВУЕТ 78». Все 80 объяснились: 78 — бонусные материалы установщика (артбук, 68 треков, 8 обоев), которые владелец намеренно не качал выборочной загрузкой; 2 — `steam_api64.dll`, подменённая библиотека Steam API. Настоящих повреждений ноль, 500 файлов из 500 сошлись.
**Lesson:** **предохранитель, который кричит на здоровой системе, ХУЖЕ отсутствующего.** Настоящая порча спрячется среди ложных строк, а следующая сессия научится не смотреть на вывод — и уничтожится ровно та польза, ради которой прибор писали. Лечится не «поправить порог», а тремя вещами: (1) исключение — это ОБЪЯВЛЕНИЕ С ПРИЧИНОЙ, а не молчаливый игнор; (2) у исключения по хешу хеш ЗАКРЕПЛЯЕТСЯ, иначе повторная подмена пройдёт незамеченной; (3) сторож `never_excepted` со списком файлов, которых правила не смеют накрывать, — при попытке прибор ОСТАНАВЛИВАЕТСЯ. Плюс: правило, не покрывшее ничего, докладывается как устаревшее, иначе список гниёт.   → link: пак Конана `_config/verify-baseline.json` · [[EXP-0038]] (тот же принцип отбраковки) · [[EXP-0039]]
**Repro:** `python _config/verify-install.py` в паке Конана — ждём «ТРЕВОГ НЕТ», код возврата 0. Доказательство, что глушилка не глушит лишнего: `python _config/test-verify-baseline.py` — 13 проверок, оба контроля (положительный: бонусные материалы и подменённая библиотека глушатся; отрицательный: пропавший экзешник, битая dll, подменённая библиотека с ДРУГИМ хешем и рядовой файл игры дают тревогу; испорченная база останавливает прибор).
**Trigger:** пишешь или запускаешь любой проверочный инструмент (целостность, линтер, аудит) → первым делом прогони его на ЗАВЕДОМО здоровом объекте. Вывод не пустой — это дефект инструмента, и чинить его надо до того, как на него начнут полагаться.
**Not for:** инструменты, у которых ненулевой вывод и есть норма (счётчики, статистика). Там правило не про молчание, а про то, чтобы тревога была отделима от фона.

### EXP-0041 · 2026-09-08 · ✅ · #binary #cvar #documentation #observation #conan #method
**Context:** 60 переменных `dw.*` трёх семей конспекта, по которым внешние источники пусты: из трёх дампов (конфиг Funcom 2017, клиентский дамп консоли 2017, веб-поиск) нашлось ОДНО имя из шестидесяти.
**Tried / did:** вместо описаний «по имени» полез в бинарник за справкой, которую UE печатает по `help <имя>` — она хранится в файле рядом с именем переменной.
**Result:** ✅ — справка разработчиков снята для **58 имён из 60**. Разделы опираются на слова самих Funcom, а не на догадки. Побочно: найден адрес внутренней вики Funcom и словарь токенов экранного оверлея, а также подтверждено, что в сборке включён режим разработчика.
**Lesson:** **если игра/библиотека регистрирует переменные с текстом справки, этот текст ЛЕЖИТ В БИНАРНИКЕ, и его можно прочитать за минуту вместо дня рассуждений по имени.** Но извлечение имеет два подвоха, и оба ловятся только контролем: (1) **раскладка `…<справка A><имя A><справка B><имя B>…`** — брать надо ближайшую строку, ЗАКАНЧИВАЮЩУЮСЯ ДО начала имени; наивная «ближайшая строка» отдаёт справку СОСЕДА (поймано на блоке `dw.OSD.*`, где порядок читается глазами); (2) **если справка одной ручки упоминает ИМЯ другой** — поиск по имени находит это вхождение раньше настоящего и выдаёт пару ПЕРЕКРЁСТНО (так пара `dw.MemoryPressure*` едва не была описана наоборот; разрешено плотным дампом области с адресами). Контроля нужно два: позитивный на блоке с известным порядком и проверка на дубли — одна справка, доставшаяся двум именам, верна максимум для одного.   → link: [[EXP-0037]] (тот же ход: шкала перечисления из бинарника вместо подбора) · [[EXP-0038]] · пак Конана `docs/dw-cvars/README.md` → правило 2-бис
**Repro:** найти имя в бинарнике (искать и как `latin-1`, и как `utf-16-le`), собрать строки в окне ~900 байт ПЕРЕД ним, взять первую подходящую, заканчивающуюся до имени. Контроль: блок с заведомо известным порядком должен дать ≥6 попаданий из 7; одинаковая справка у двух имён — сигнал разбирать плотным дампом. Скрипты сессии 08.09.2026, пак Конана.
**Trigger:** нужно описать настройку/переменную закрытого продукта, и внешних источников нет → СНАЧАЛА искать справку в бинарнике, и только потом писать «[ПО ИМЕНИ]». Вывод по имени — последнее средство, а не первое.
**Not for:** продукты, где справка не компилируется в бинарник (сборки со срезанными строками, языки без строковых литералов справки), и случаи, где документация уже есть — там чтение бинарника дороже и менее надёжно.

### EXP-0040 · 2026-09-08 · ❌→✅ · #git #handoff #closure #verification
**Context:** закрытие чата, шаг «оба дерева git чистые и запушены» — так было записано в `STATUS.md` прошлой сессией.
**Tried / did:** вместо того чтобы поверить записи, выполнил `git rev-list --left-right --count origin/<ветка>...HEAD` по всем трём репозиториям.
**Result:** ❌→✅ — у пака Palworld оказалось **четыре коммита от 31.08, незапушенных месяц** (правки `UltraGraphics/config.lua`). Отправлены. Рабочее дерево при этом было ЧИСТЫМ, то есть `git status` показывал полный порядок и ничего не сообщал.
**Lesson:** «чисто» и «запушено» — разные утверждения, и `git status` отвечает только на первое. Коммит без пуша живёт на одной машине и виден только счётчиком ahead; месяц работы держался на одном диске, потому что предыдущее закрытие записало вывод, а не проверку. Запись в статусе о состоянии репозитория — это ПРОШЛОЕ состояние, и её нельзя переносить в новое закрытие копированием.   → link: `STATUS.md` → состояние машины
**Repro:** `for r in <репозитории>; do cd "$r"; git rev-list --left-right --count "origin/$(git branch --show-current)...HEAD"; done` — вторая цифра не ноль значит есть неотправленное.
**Trigger:** любое закрытие сессии, шаг «запушено» → выполнить счётчик по КАЖДОМУ дереву проекта, включая паки, а не только по основному.
**Not for:** репозитории без origin — там счётчик неприменим, и это надо сказать словами, а не выдавать за ноль.

### EXP-0039 · 2026-09-08 · ❌ · #subagent #boundaries #dataloss #s1 #conan
**Context:** девять параллельных агентов писали разделы конспекта по cvar-ам Конана; параллельно веб-разведчик выгружал строки из бинарников игры.
**Tried / did:** в промпте агентам был назван путь ВЫВОДА конспекта — и больше никаких границ.
**Result:** ❌ — агент перенаправил свой отчёт в сканируемый файл (`> "$f"` вместо `>> report`), уничтожив `ConanSandbox-Win64-Shipping.exe` (192 МБ) и `Dreamworld.dll` (5.6 МБ). Код возврата 0, ни одной ошибки. Игра перестала запускаться.
**Lesson:** подагент соблюдает границы, названные В ЕГО ПРОМПТЕ, а не те, что были в голове у родителя. Назвать путь вывода — не то же самое, что запретить писать в другие места. Разбор бинарников и массовых файлов вообще не отдавать подагенту: скрипт задаёт имя выходного файла КОНСТАНТОЙ рядом с объявлением, а цикл оболочки строит его из имени входного — в этом и весь класс дефекта.   → link: bugs/02_agent_overwrote_game_binaries.md · AGENT_GUIDE.md → «Boundaries for subagents»
**Repro:** воспроизведение класса одной строкой — `for f in *.exe *.dll; do echo "x" > "$f"; done` (НЕ запускать в живом дереве). Защита: перед и после любого автономного пакета — `python _config/verify-install.py` в паке Конана; печатает счётный список файлов на перекачку с эталонными хешами.
**Trigger:** порождаешь агента, чья задача касается папки игры, библиотеки владельца или любого дерева, которого проект не создавал → вставь в промпт границу дословно (AGENT_GUIDE, три обязательства) и сними слепок целостности до запуска.
**Not for:** агенты, работающие только в репозитории проекта и в scratchpad, — там граница уже совпадает с рабочей папкой.

### EXP-0038 · 2026-09-08 · ✅ · #cvar #tooling #scanner #conan #completeness
**Context:** нужен список зарегистрированных cvar-ов новой игры (Conan Exiles Enhanced), по образцу палворлдовского сканера.
**Tried / did:** НЕ взял палворлдовский сканер как есть: в нём список префиксов зашит руками (`r|s|p|au|pal|Lumen|…`), а собственное пространство имён Конана было неизвестно. Написал сканер БЕЗ знания префиксов: ловит любой идентификатор формы `<слово>.<слово>`, а ложные семьи отбраковывает ПО НАБЛЮДЕНИЮ и с указанием причины.
**Result:** ✅ — найдено собственное пространство `dw.*` (264 переменные, слой Dreamworld компании Funcom), которого нет ни в одной открытой документации. Независимая выгрузка, сделанная вторым инструментом по списку движковых префиксов, не содержит **ни одного** из них — то есть жёсткий список пропустил бы всю специфику игры целиком.
**Lesson:** список префиксов — это ответ, а не вопрос. Сканер новой игры обязан находить пространства имён наблюдением и печатать статистику по префиксам; отбракованное складывать в отдельный файл С ПРИЧИНОЙ, а не выбрасывать молча. Лишнее имя стоит дня работы не по адресу; выброшенное молча — того же дня и без следа, куда смотреть.   → link: [[EXP-0016]] · пак Конана `_config/scan-cvars.py`
**Repro:** `python _config/scan-cvars.py` в паке Конана; контроль — положительный (`dw.EnableAILODSystem` в `cvars-registered.txt`) и **отрицательный** (`Icons.AddCircle` в `cvars-rejected.txt`, не в registered). Без второго контроля отбраковка недоказуема.
**Trigger:** заводится новая игра → сканер cvar-ов пишется без зашитых префиксов, семьи определяются после первого прогона.
**Not for:** игры, у которой пространство имён уже известно и подтверждено живой консолью, — там жёсткий список дешевле и точнее.

### EXP-0037 · 2026-09-08 · ✅ · #binary #enums #settings #observation #conan
**Context:** в `GameUserSettings.ini` Конана настройки хранятся числами (`DLSSQuality=5`, `TSRResolutionQuality=5`), и без шкалы эти числа бессмысленны; поставить DLSS «на глазок» значило бы угадывать.
**Tried / did:** вместо догадки — вытащил из экзешника ВСЕ строки вида `E<Имя>::<Значение>` и сгруппировал по перечислениям.
**Result:** ✅ — шкалы получены целиком: `UDLSSMode` (0 Off … 4 Quality, 5 Balanced …), `EPerformanceBoostMode`, `ELowLatencyMode`, `EGraphicsQuality` (есть уровень **Cinematic**), `EStreamlineDLSSGMode` (**есть мультигенерация On2X/3X/4X**), `EDLSSPreset` (A…O). Шкала `DLSSQuality` дополнительно подтверждена сходимостью: `FSRQuality=2`, `XeSSQuality=3`, `DLSSQuality=5` по трём РАЗНЫМ перечислениям дают одно и то же «Balanced» — три независимых свидетеля.
**Lesson:** значение перечисления в конфиге читается из бинарника за минуту, и это дешевле любой догадки. Искать надо не одно значение, а ВСЮ шкалу: только целая шкала показывает, что индекс 5 у DLSS и у TSR значит разное. Проверка на сходимость по нескольким ключам одного умолчания — готовый способ убедиться, что взята правильная шкала.
**Repro:** `re.finditer(r"\b(E[A-Za-z0-9_]{2,40})::([A-Za-z0-9_]{1,48})\b", …)` по бинарнику, декодировать и как latin-1, и как utf-16-le с обоими сдвигами; сгруппировать по имени перечисления. Скрипт-образец — в паке Конана.
**Trigger:** в конфиге игры встретилось числовое значение настройки, смысл которого неочевиден → читать шкалу из бинарника, а не подбирать.
**Not for:** значения, которые игра показывает словами в собственном меню, — там достаточно посмотреть глазами.

### EXP-0036 · 2026-09-08 · ❌→✅ · #powershell #argv #downloads #quoting
**Context:** выборочная загрузка двух файлов из большого набора: `aria2c --select-file=85,86 …` через PowerShell.
**Tried / did:** передал аргумент без кавычек. Клиент минутами показывал `CN:0` — я искал причину в сети, VPN и трекерах.
**Result:** ❌ — PowerShell разобрал `85,86` как массив и передал ДВА аргумента: `--select-file=85` и отдельный `86`, который клиент принял за адрес: `Unrecognized URI or unsupported protocol: 86`. Ошибка была видна только при `--console-log-level=info`. После закавычивания (`"--select-file=85,86"`) пиры подключились сразу.
**Lesson:** запятая внутри аргумента нативной команды в PowerShell — оператор массива. Любой аргумент с запятой, двоеточием или скобками передавать ТОЛЬКО закавыченным целиком: `"--flag=a,b"`. И отдельно: при «ничего не происходит» первым делом поднимать уровень лога инструмента, а не строить теории о сети — теория о VPN стоила двадцати минут, а строка ошибки лежала на поверхности.   → link: [[EXP-0004]] (тот же класс: оболочка ≠ переносчик содержимого)
**Repro:** `& aria2c "--select-file=85,86" …` — с кавычками; проверка `--console-log-level=info` покажет `Unrecognized URI` при поломке.
**Trigger:** пишешь нативной команде аргумент, содержащий запятую → закавычь его целиком.
**Not for:** аргументы без разделителей — их PowerShell передаёт как есть.

### EXP-0035 · 2026-09-05 · ✅ · #kaif #update #placeholders
**Context:** the 2.5 update task handed `/autoloop`, `/dayloop`, `/nightloop` to the hand as "carries local edits" and kept `/end-chat` as an edited deprecated artifact — the only local difference in all four is the placeholder fill the 2.2 adaptation required (`<BUILD_COMMAND>`, `<TEST_HARNESS>`, the trailer).
**Tried / did:** compared the 2.2 manifest's `shas` snapshot with `git HEAD` for the four files — equal for all four; the pristine template sha differs; the agent-filled slots are not in the manifest's `values`.
**Result:** ✅ — three one-line module merges and one five-path `git rm`, ≈ 10 minutes; S3 by the ladder, signal carried in the 2.5 field report (R2), no ticket.
**Lesson:** expect the same three modules and any deprecated placeholder-filled skill to come back as hand items on EVERY interval until the origin classifies "template + fills" as untouched; budget ten minutes, do not investigate them as real edits.   → link: reports/KAIF_UPDATES/KUMM_KAIF_2.5_UPDATE_REPORT.md §2 R2
**Repro:** `node -e` compare of `.kaif/deploy-manifest.json → shas[f]` with `sha256(git show HEAD:f)` for each module file the task lists — equal means "fills only".
**Trigger:** a KAIF update task lists a skill whose only local content is a filled placeholder → merge the one upstream line, skip the diagnosis.
**Not for:** modules the owner actually reworded — those need the real merge.
**Mechanization:** `none-cheap: the fix belongs upstream (fills-aware classification, field report §4 wish 2)`.

### EXP-0034 · 2026-09-05 · ❌→✅ · #permissions #scratchpad #shell
**Context:** preparing a sandbox copy of the tree for the KAIF update with `rm -rf "$SB"; mkdir -p "$SB"; git archive …` in one command.
**Tried / did:** ran the compound command through the Bash tool.
**Result:** ❌ — the WHOLE command was denied: `.claude/settings.local.json` denies `Bash(rm -rf:*)`, deny beats allow, and a denied compound runs none of its parts. Re-run without the removal → ✅.
**Lesson:** never compose `rm -rf` into a command that also does the real work; scratch trees get a fresh directory name instead of a wipe.   → link: `.claude/settings.local.json` deny list · [[EXP-0002]]
**Repro:** `SB="<scratchpad>/sandbox-$(date +%H%M%S)"; mkdir -p "$SB"; git archive HEAD | tar -x -C "$SB"` — no removal needed.
**Trigger:** writing any command containing `rm -rf` on this machine → drop it or run it alone, expecting the refusal.
**Not for:** single-file `rm` and `git rm` — allowed.
**Mechanization:** `mechanized: the deny list itself — it fired as designed; the lesson is how to compose around it`.

### EXP-0033 · 2026-09-05 · ✅ · #kaif #update #templates
**Context:** the update task's `owner-conventions` item names seven owner documents whose TEMPLATES changed in 2.3–2.5 but shows no diff (owner content is never touched mechanically).
**Tried / did:** extracted every `FILE:` block of the 2.2 and 2.5 release bundles with a 20-line parser (`extract-bundle.mjs`, text in the 2.5 field report §6) and ran `git diff --no-index` over the two template trees.
**Result:** ✅ — 43 template files changed overall; for the seven owner documents the whole delta was three lines (two `/end-chat` → `/end-chat-soft`, one new delivery-metric line in `MASTER_PLAN.md`); maps, `GOAL.md` and `KAIF_FRAMEWORK.md` templates unchanged.
**Lesson:** the release bundle is the only complete template baseline on disk; diffing two extracted bundles turns "conventions changed" into an exact line list.   → link: reports/KAIF_UPDATES/KUMM_KAIF_2.5_UPDATE_REPORT.md §6
**Repro:** `node extract-bundle.mjs <bundle-old> tplA && node extract-bundle.mjs <bundle-new> tplB && git diff --no-index tplA/STATUS.md tplB/STATUS.md` (bundles: `gh release download v<X> --repo MikalaiKryvusha/KAIF --pattern KAIF-CORE-BUNDLE.md`).
**Trigger:** a KAIF update task item that names files without a diff → extract both bundles and diff the templates before touching the owner's copy.
**Not for:** files the machinery replaced or merged — their diffs are already in the task.
**Mechanization:** `none-cheap: the extractor is 20 lines and lives in the report; promote it to _tools/ if a third update needs it`.

### EXP-0032 · 2026-09-05 · ✅ · #kaif #update #bootstrap #rehearsal
**Context:** KAIF 2.2 → 2.5, three versions in one hop; the deployed 2.2 core's `update` would run the interval with the OLD core, so the bootstrap route (thin `KAIF.md` → loader → 2.5 core) was taken.
**Tried / did:** real bootstrap in a `git archive` sandbox copy with a local `--source` dir holding the sha256-verified release assets → copied the sandbox receipt to `.kaif/update-rehearsal.json` → live bootstrap with the same `--source`.
**Result:** ✅ — `rehearsal verdicts loaded … (1 file(s))`, live counters equal to the sandbox (23 replaced · 12 merged · 11 added · 55 kept), 0 `verdict-mismatch`; the two run logs differ only by the rehearsal line and two git-ignored rules files absent from the archive.
**Lesson:** on the bootstrap route the canon's `--rehearsal <receipt>` flag is REFUSED by `install`'s whitelist (origin issue #42) AFTER the loader has already swapped the core in — the receipt at the default path is the binding that works; a local `--source` makes sandbox and live byte-deterministic.   → link: origin issue #42 · reports/KAIF_UPDATES/KUMM_KAIF_2.5_UPDATE_REPORT.md
**Repro:** `cp <sandbox>/.kaif/last-update.json .kaif/update-rehearsal.json && node KAIF-LOADER.mjs --lang ru --source <release-assets-dir>`; verify with `grep -c "rehearsal verdicts loaded" <live-log>` → 1 and `grep -c "^- \*\*verdict-mismatch" KAIF_UPDATE_TASK.md` → 0.
**Trigger:** any KAIF update taken by the thin-`KAIF.md` route → sandbox first, receipt to the default path, never the `--rehearsal` flag.
**Not for:** the `update` route (the flag is legal there) and intervals where the deployed core is already ≥ 2.5 (its own `diff --source` records the rehearsal).
**Mechanization:** `none-cheap: the fix belongs upstream (#42, open); until then the workaround is the one cp in Repro`.

### EXP-0031 · 2026-08-22 · ❌→✅ · #palworld #foliage #wrongknob #positivecontrol #ownerwasright
**Context:** владелец: «трава опять растёт перед носом, хочу сильно дальше». Очевидная ручка —
`grass.CullDistanceScale`, она и в конфиге мода стоит, и в эстафете названа развязкой долга.
**Tried / did:** лестница 6 → 12 → 16 → 20 → 24 → 32 → 40, каждая ступень с захватом. Плюс
`grass.DensityScale` от 1.0 до 0.2. Двенадцать замеров.
**Result:** ❌ — цена росла честно (GPU busy 17.4 → 53.4 мс), **трава не приближалась ни на метр**.
Владелец трижды: «радиус продолжает жёстко её отсекать». Ответ лежал в конфиге ЭТОГО ЖЕ мода,
записанный 15.08: у Palworld своя подсистема листвы (`UPalFoliageGridModel`), а все 22 cvar-а
`grass.*` живут только в `ALandscapeProxy::UpdateGrass` и в этот код не заходят. Я grep-нул мод по
`grass`, увидел свои строки и не дочитал двести строк до абзаца, который прямо это говорит.
Настоящая пара — `r.ViewDistanceScale` (дальность) × `foliage.DensityScale` (плотность):
3.0 при 0.75 дало **9.32 мс и 90.3 к/с** против 17.45 мс и 55.9 к/с на исходном 1.0/1.0.
**Lesson:** **грепом по имени настройки ты находишь СВОИ строки, а не чужое объяснение.** Прежде
чем строить лестницу по параметру — прочитай раздел документа, где он живёт, целиком: соседний
абзац может отменять весь замысел. И второе: когда владелец ТРИЖДЫ говорит «не работает», а прибор
показывает растущую цену, — прав владелец. Цена росла, потому что рычаг двигал ДРУГОЙ слой; это
не подтверждение гипотезы, а её опровержение, прочитанное наоборот.
   → link: пак `_unpacked/UltraGraphics/config.lua` (решение записано у обеих строк) · [[EXP-0021]]
   (тот же класс: канал проверяется раньше гипотез) · [[EXP-0022]]
**Repro:** позитивный контроль, которым это доказано за десять секунд: `foliage.CullAll 1` —
трава обязана исчезнуть ВСЯ. Исчезла → система `foliage.*`, `grass.*` мёртв. Не исчезла → искать
дальше. Такой контроль стоило поставить ПЕРВЫМ, а не двенадцатым.
**Trigger:** правишь параметр по лестнице и на второй ступени эффекта нет, хотя цена растёт →
поставь команду с заведомо видимым эффектом в той же подсистеме, прежде чем строить третью ступень.
**Not for:** параметры, чей эффект уже подтверждён наблюдением в этой же сессии.

### EXP-0030 · 2026-08-22 · ❌→✅ · #windows #pagefile #systemdisk #stutter #diagnosis
**Context:** Palworld: медиана здоровая (53–58 к/с), а поверх неё остановки по 0.4–2.0 с, съедавшие
до 34 % времени. Владелец: «очень сильно тормозит и лагает компьютер», «что-то радикально
неправильно работает в системе». `stall.py` при этом чист — ОС отзывчива.
**Tried / did:** исключил замерами перекомпиляцию шейдеров (кэш цел), ошибки диска (за 3 часа
ноль), систему целиком. Осталась память: игра держала 9411 МБ приватно при 4398 резидентных,
коммит 40 ГБ на 32 ГБ физической. Уборка 17.08 перенесла файл подкачки с D: на **C:** — системный
диск, где живут Windows, Defender, образ WSL и VS Code. Вернул на D:, перезагрузка.
**Result:** ❌→✅ — замирания исчезли **полностью**. Доказательство не в первом замере после
перезагрузки (там менялось четыре вещи разом), а в третьем: коммит **50 ГБ**, жёсткая подкачка
**463 страницы/с**, 498 процессов, Docker и 37 окон VS Code, 31-я минута сессии — то есть условия
ХУЖЕ тех, что ломали машину, — и **ноль замираний** при 0.5 % потерь.
**Lesson:** **файл подкачки на системном диске — самостоятельный источник многосекундных
остановок, и выглядит он как «тормозит весь компьютер» при полностью отзывчивой ОС.** Отпечаток
класса: кадр 600–2000 мс, `CPU busy` то равен кадру, то мал (чистое ожидание), `GPU busy` ровно
свои 18 мс, `stall.py` чист, и всё это НАРАСТАЕТ по ходу сессии — потому что растёт вытеснение
рабочего набора. Второй слой урока про доказательство: перезагрузка меняет всё сразу, поэтому
исправление доказывается не «после стало лучше», а **воспроизведением ХУДШИХ условий без симптома**.
   → link: `bugs/01_DONE_palworld_multisecond_stalls.md` · [[EXP-0024]] (stall.py как разделитель)
**Repro:** признак — `\Memory\Committed Bytes` больше физической памяти + большой разрыв между
приватной и резидентной памятью игры. Лечение — вынести подкачку с системного диска, перезагрузка.
**Trigger:** «тормозит весь компьютер», а `stall.py` чист → посмотреть, где лежит файл подкачки и
насколько вытеснен рабочий набор игры, ДО перебора графических настроек.
**Not for:** машины, где коммит заметно меньше физической памяти — там вытеснения нет.

### EXP-0029 · 2026-08-21 · ❌→✅ · #shell #windows #crossshell #encoding #heredoc
**Context:** писал разборочные скрипты на Python через `cat > file.py <<'PY' ... PY` в инструменте
Bash. В путях Windows и в регулярках были обратные слэши.
**Tried / did:** три скрипта подряд приехали битыми: `d[0x6c:0x6e]` дошёл целым, а
`BK + '\\' + gen` превратился в `BK + '\' + gen` (SyntaxError), `'\x00\x00'` — в `'\x00'`,
`r'^\s*(...)'` — в `r'^s*(...)'`. Одна вставка markdown-текста уехала ещё тише: путь
`D:\work\ai_sandbox\_tools\...` записался в документ как `D:\worki_sandbox\_tools` с BEL внутри —
файл записался, код возврата 0, увидел только при чтении назад.
**Result:** ❌→✅ — **инструмент Bash в этой среде ополовинивает обратные слэши даже в закавыченном
heredoc (`<<'PY'`)**, где сам bash их трогать не должен. Лечение: в скриптах — только прямые слэши
(Python на Windows их принимает) и `bytes([0,0])`/`chr()` вместо `\x`-литералов; текст в документы —
инструментом Write/Edit, не через шелл.
**Lesson:** это четвёртая грань класса «текст ходит файлами, а не аргументами» (`AGENT_GUIDE.md`),
и самая подлая: закавыченный heredoc выглядит как гарантия дословности, поэтому его не проверяют.
Симптом различается по цене: в коде — громкий SyntaxError, в тексте — тихая порча с зелёным кодом
возврата. Правило простое: **обратный слэш не проходит через этот шелл**. Нужен слэш в результате —
пиши файл файловым инструментом.
   → link: [[EXP-0012]] (тот же класс через PowerShell) · [[EXP-0004]] · [[EXP-0002]] ·
   `AGENT_GUIDE.md` → Document & text hygiene
**Repro:** `cat > t.py <<'PY'` с телом `print(r'a\sb')` → в файле окажется `print(r'asb')`.
**Trigger:** пишешь через шелл что угодно с обратным слэшем (путь Windows, регулярка, escape) →
переключись на Write/Edit или перепиши без слэшей.
**Not for:** ASCII-текст без слэшей — heredoc для него нормален.

### EXP-0028 · 2026-08-21 · ✅ · #nvidia #forensics #readonly #reverse #instrument
**Context:** надо было узнать, что лежит в профиле приложения Palworld в базе драйвера. Штатный путь
один — NVIDIA Profile Inspector, но он **пишет** в живую базу, а мы посреди расследования и уже
однажды на этом обожглись (`EXP-0027`: лечение уничтожило улику).
**Tried / did:** снял копию всех трёх файлов `Drs\*.bin`, и разбирал **копию**. Формат NVIDIA не
документирует, но он поддался за три пробы: запись профиля `u16 0x0053 · u16 size · u32 ? · u32
count · u32 →имя`, настройка 16 байт с маркером `A4 00 10 00`, запись приложения `0x016E` с
указателем на профиль. Имена настроек взял из двух публичных таблиц Profile Inspector
(`CustomSettingNames.xml`, `NvApiDriverSettings.h`) — **скачал таблицы, а не инструмент**.
**Result:** ✅ — 5618 профилей разобрано, профиль Palworld прочитан целиком (24 настройки), два
поколения базы сдиффены. Нашлось замещение DLSS с `Preset L (Transformer Gen 2)` поверх родной
3.1.30 из пака и `RTX HDR - Enable = On` в Base Profile. Живая база не тронута ни разу.
**Lesson:** **когда единственный «штатный» инструмент пишет туда, куда ты пришёл смотреть, — бери
не инструмент, а его таблицы.** Открытый проект почти всегда отдаёт свои справочники отдельными
файлами, и они-то и есть ценность; сам бинарь чаще всего просто рисует их поверх API. Второй слой:
разбирать надо КОПИЮ, и тогда обратимость перестаёт быть вопросом вообще. Третье, техническое:
строку UTF-16 ищи до **выровненного** `00 00` — невыровненный поиск съедает последний символ
(`Palworld` → `Palworl`), и это молчаливая ошибка, потому что имя остаётся правдоподобным.
   → link: `_tools/nvidia-drs-reader/` (инструмент со своим README) · `researches/nvidia-tuning/`
   (раздел «Профиль приложения Palworld») · EXP-0027 (снимок ДО правки)
**Repro:** `python _tools/nvidia-drs-reader/drs.py profile <копия nvdrsdb1.bin> palworld-win64-shipping.exe`
**Trigger:** нужен внутренний стейт закрытой системы → сначала спроси, есть ли путь чтения копии
через чужие таблицы, и только потом ставь инструмент, который пишет.
**Not for:** ПРАВКА этих настроек — её всё равно делает панель, App или Inspector; читалка не пишет.

### EXP-0027 · 2026-08-21 · ❌ · #causality #forensics #evidence #retracted #nvidia
**Context:** поправка к `EXP-0025`. Я объявил причиной системных фризов «уборка удалила папку NVIDIA
и повредила базу профилей драйвера». Основание: папка `%LOCALAPPDATA%\NVIDIA` пересоздана 18.08 в
21:24, полное сканирование Defender стартовало 18.08 в 21:25:20 — **совпадение до минуты**. Плюс
лечение сработало: «Восстановить» дало измеренное восьмикратное улучшение.
**Tried / did:** отдельный разбор пошёл читать, что уборка на самом деле трогала: код тулзы, её
каталог целей, журналы прогонов, манифесты карантина, метки файлов.
**Result:** ❌ — причинная связь **не подтвердилась**. У каталога `C:\ProgramData\NVIDIA
Corporation\Drs`, где и лежит база профилей, время записи до сих пор **27.06.2022**: ни один файл
там не появлялся и не исчезал. В каталоге целей тулзы NVIDIA упоминается ровно дважды — `DXCache` и
`GLCache`, обе подпапки кэша шейдеров. Базу профилей она не знает вовсе. Хуже: проверить, менялось
ли СОДЕРЖИМОЕ `nvdrsdb0.bin` (это не меняет время каталога), **уже нечем — моё же лечение 21.08
затёрло метки файлов**, а самая ранняя теневая копия от 18.08 23:39 сделана уже после уборки.
**Lesson:** два урока, и второй дороже.
(1) **Совпадение по времени — не причинность, даже совпадение до минуты, даже когда лечение
сработало.** «Восстановить» чинит ЛЮБОЙ повреждённый профиль независимо от того, кто его повредил;
успех лечения ничего не говорит о происхождении болезни. Правильная формулировка была бы:
«профиль был повреждён — доказано лечением; чем именно — не установлено».
(2) **Лечение уничтожает улику. Снимай состояние ДО того, как чинишь** — иначе вопрос «а что
собственно было сломано» закрывается навсегда. Здесь хватило бы одной копии `Drs\*.bin` перед тем,
как просить владельца нажать кнопку. Стоило бы это десяти секунд.
   → link: `researches/cleanup-2026-08-17/README.md` · EXP-0025 (исправляемая запись) · EXP-0023
   (тот же класс — вывод, который держался не на том, на чём казалось)
**Repro:** перед необратимой правкой состояния: `Copy-Item <файлы состояния> <скретчпад>` и назвать
их в отчёте. Проверка причинности постфактум — сравнить время записи КАТАЛОГА (меняется при
появлении/исчезновении записи) со временем записи ФАЙЛА (меняется при правке содержимого).
**Trigger:** пишешь «X сломал Y» → назови наблюдение, которое это доказывает, отдельно от
наблюдения, что Y был сломан. Нет второго — пиши «причина не установлена».
**Not for:** —

### EXP-0026 · 2026-08-21 · ❌ · #measurement #instrument #threshold #ownerwasright #falsenegative
**Context:** мерил плавность Palworld. Свой `hitches.py` считал рывком кадр **вдвое длиннее
медианы**. Отчитался владельцу: «рывки в игре кончились, 0.2 фриза в секунду». Ответ: «в смысле
кончились? Прямо сейчас рывок на рывке!!! Лагает ужасно!»
**Tried / did:** пересчитал те же захваты **абсолютным** порогом (33/50/100/250 мс) вместо
относительного.
**Result:** ❌ — владелец был прав, прибор врал. При медиане 64 мс порог уезжал на 128 мс, и
отчётливый удар в 120 мс в счёт НЕ попадал. По честному порогу тот же захват: **13.4 кадра в
секунду длиннее 33 мс и 98.7 % времени в кадрах длиннее 50 мс.** Не «0.2 рывка», а почти всё время.
**Lesson:** **порог, отмасштабированный по медиане, делает больного пациента здоровым на бумаге:**
чем хуже идёт игра, тем выше поднимается планка и тем чище отчёт. Пороги восприятия — абсолютные,
человек не нормирует на медиану. И вторая половина урока, словесная: «рывки кончились» про 15 к/с —
ложь, как её ни считай; ровные 64 мс на кадр И ЕСТЬ непрерывный рывок, а не гладкая база с
выбросами. Когда владелец противоречит прибору о том, ЧТО ОН ВИДИТ, — прав владелец: он измеряет
восприятие напрямую, а прибор — через модель восприятия, которую написал агент.
   → link: `_tools/perf-harness/felt.py` (написан из-за этого урока) · EXP-0011 (медианы, не средние)
**Repro:** `python _tools/perf-harness/felt.py "base=a.csv" "test=b.csv"` — колонка «кадров >33 мс в
секунду» читается ПЕРВОЙ. Порог 2× от медианы больше не использовать для отчёта человеку.
**Trigger:** пишешь человеку вывод о плавности / «стало лучше» → сперва посчитай абсолютным
порогом; относительные пороги — только для сравнения двух настроек между собой.
**Not for:** сравнение GPU busy или пропускной способности — там относительные метрики законны.

### EXP-0025 · 2026-08-21 · ❌→✅ · #nvidia #driver #profile #systemwide #stutter #cleanup
> ⚠️ **ЧАСТИЧНО ИСПРАВЛЕНА — читать вместе с `EXP-0027`.** Лечение и его восьмикратный эффект
> подтверждены и остаются в силе. **Причина НЕ подтверждена:** база профилей драйвера уборкой не
> удалялась (каталог `Drs` не менялся с 2022 года), а связь «уборка → повреждённый профиль» держалась
> на совпадении времени и рассыпалась при проверке.
**Context:** после уборки диска C (17–18.08) появились фризы во ВСЕХ приложениях, которые рисуют:
Palworld, Quake2RTX, видеоплеер. Владелец: «раньше такого не было».
**Tried / did:** замерил профиль остановки: поток рендера жжёт 300–490 мс CPU, `GPU busy` 19 мс,
`CPU wait` 0.3 мс, загрузка машины 11 %, свободные ядра. Нашёл: уборка удалила папку
`%LOCALAPPDATA%\NVIDIA` целиком (18.08 21:24, минута в минуту с полным сканированием Defender), а
`nvdrsdb0.bin` — база профилей драйвера — переписана. Попросил владельца нажать **Панель управления
NVIDIA → Управление параметрами 3D → Глобальные параметры → Восстановить**.
**Result:** ❌→✅ — Quake, те же 30 с: фризы >100 мс **33 → 4**, потеряно времени **44.7 % → 7.3 %**,
1 % low **4.0 → 37.5 к/с**. Восьмикратно.
**Lesson:** **повреждённый глобальный профиль драйвера NVIDIA выглядит как системная болезнь
машины, а лечится одной кнопкой.** Отпечаток класса, по которому его узнают: поток рендера ЖЖЁТ
процессор (а не ждёт — `CPU wait` ≈ 0), видеокарта простаивает, страдает КАЖДОЕ рисующее
приложение независимо от движка и API, при этом сама ОС полностью отзывчива. Механизм: без
исправного профиля драйвер гонит свою работу в поток вызывающего приложения вместо своего
(«Оптимизация с использованием потоков» и соседи). Побочный эффект «Восстановить», о котором надо
предупреждать ЗАРАНЕЕ: оно вернёт и G-SYNC/«Технологию монитора» — у владельца телевизор мерцает
на VRR, и он получил мерцание сразу после моего совета.
   → link: `researches/nvidia-tuning/` · STATUS (эстафета 21.08)
**Repro:** признак — `python _tools/perf-harness/hitches.py <csv>` даёт «CPU-side N : GPU-side 0» при
`stall.py` чистом. Лечение — «Восстановить» в глобальных параметрах 3D; сразу после этого проверить
G-SYNC и вернуть его как было.
**Trigger:** фризы В НЕСКОЛЬКИХ несвязанных 3D-приложениях сразу → сначала профиль драйвера, потом
всё остальное. Особенно если недавно чистили `%LOCALAPPDATA%`.
**Not for:** просадка в одной конкретной игре — там причина в игре.

### EXP-0024 · 2026-08-21 · ✅ · #diagnosis #method #discriminator #stall #harness
**Context:** фризы во всех играх. Подозреваемых было восемь: диск, антивирус, драйверы-фильтры,
Memory Integrity, WSL2, стриминг-хосты, оверлеи, планировщик. Перебирать по одному — часы.
**Tried / did:** написал `stall.py` — поток, который просит поспать 1 мс и меряет, сколько его на
самом деле не пускали. Запустил ЕГО и игру ОДНОВРЕМЕННО, в одном тридцатисекундном окне.
**Result:** ✅ — Quake потерял 48.9 % времени на остановках, детектор не задержался **ни разу**
свыше 50 мс. Одним опытом отпали разом: планировщик, процессор, память, диск, драйверы-фильтры,
антивирус. Осталось: графический стек рисующего процесса.
**Lesson:** **опыт, который делит пространство гипотез пополам, стоит десяти, которые проверяют по
одной.** Перед перебором подозреваемых спроси: есть ли наблюдение, отделяющее «болеет система» от
«болеет приложение»? Здесь оно стоило двадцати строк на Python и тридцати секунд. Второй слой того
же урока: у детектора НЕТ графики, и именно поэтому он доказателен — прибор должен быть сделан из
другого материала, чем то, что он проверяет.
   → link: `_tools/perf-harness/stall.py`
**Repro:** `python _tools/perf-harness/stall.py 30` во время нагрузки. Чист + приложение встаёт →
болезнь в графическом стеке процесса. Грязен → болезнь общесистемная.
**Trigger:** «тормозит вообще всё» → сперва stall.py, до любого перебора служб и драйверов.
**Not for:** не отличает GPU-нагрузку от CPU-нагрузки внутри приложения — для этого `hitches.py`.

### EXP-0023 · 2026-08-21 · ❌ · #measurement #statistic #retracted #falsenegative #palworld
**Context:** в ночной эстафете 21.08 записано как установленный факт: «Q2RTX на этой же карте
накануне дал свою таблицу → **система здорова, болен Palworld**». Весь план атаки строился на этом.
**Tried / did:** прогнал Q2RTX под PresentMon и посмотрел не на медиану, а на выбросы.
**Result:** ❌ — вывод отозван. По медиане Quake и правда выглядел нормально: 54.5 к/с. А фризов
было **0.8 в секунду по 200–460 мс**, CPU-сторона 186 : GPU-сторона 1 — та же болезнь, что у
Palworld. Владелец подтвердил глазами: «лаги и в квейке». Система была больна всё это время;
контрольный замер её оправдал, потому что смотрели не на ту статистику.
**Lesson:** **контрольный опыт проверяет ровно ту статистику, которую в нём посмотрели.** «Другое
приложение работает нормально» — не вывод, пока не сказано, ЧТО в нём померили. Здесь искали
плавность, а сравнили пропускную способность: медиана к рывкам почти нечувствительна — одно
замирание в 460 мс среди тысячи кадров её не двигает вовсе. Формулировать контроль надо симметрично
симптому: жалоба на рывки → сравнивать распределение хвоста, не центр.
   → link: EXP-0019 (там этот ошибочный вывод и записан) · EXP-0026 (соседний дефект того же
   семейства — не та метрика) · EXP-0011
**Repro:** контроль на соседнем приложении гнать через `felt.py` — он показывает и центр, и хвост
рядом, так что подмену статистики видно.
**Trigger:** пишешь «X здоров, потому что Y работает нормально» → назови метрику и убедись, что она
та же, что в жалобе.
**Not for:** —

### EXP-0022 · 2026-08-21 · ❌→✅ · #palworld #ue5 #viewdistance #geometric #regression #retracted
**Context:** «регрессия 8–16 к/с», не решённая за ночную сессию. Утром вернулся к ней на здоровой
машине с мостом и PresentMon.
**Tried / did:** лестница по `r.ViewDistanceScale` на фиксированной точке (утёс, панорама), значение
сверялось мостом ДО и ПОСЛЕ каждого захвата.
**Result:** ❌→✅ — **2.6 → 15.6 к/с (GPU busy 63 мс) · 2.0 → 23.4 · 1.0 → 53.3 (GPU busy 18.6 мс).**
Медиана на 2.6 воспроизвелась дважды (15.5 и 15.6). Владелец выбрал 1.0, применено в пак.
Одновременно ОТОЗВАНА ночная атрибуция «Lumen даёт 8→13 к/с»: выключение
`r.DynamicGlobalIlluminationMethod` + `ReflectionMethod` на фиксированной точке дало **55.96 → 56.87
мс, то есть ноль**.
**Lesson:** `r.ViewDistanceScale` — главный рычаг кадра на панораме, и стоимость у него
**геометрическая**, а не пиксельная. Отсюда три следствия, каждое из которых ночью выглядело
загадкой: снижение разрешения не помогает (`ScreenPercentage 25` сделало хуже) · «пол» по всем
строкам `Engine.ini` не помогает, потому что мод ставит значение уже в загруженном мире ·
выключение Lumen не помогает. Профиль класса: `GPU busy` ≈ длине кадра, разброс мизерный
(63.3/65.7/69.4 — p50/p95/max), и он НЕ реагирует на разрешение. Долг: срез тянет за собой дальность
травы, которую владелец просил не трогать; развязка через `grass.CullDistanceScale` предложена, не
проверена.
   → link: `plans/01_cpu_gt_panorama.md` · пак `_unpacked/UltraGraphics/config.lua` (решение записано
   в комментарии у строки) · EXP-0019 (там ночная ошибочная атрибуция)
**Repro:** мост: `r.ViewDistanceScale <N>` → захват 25 с → `?r.ViewDistanceScale` → `felt.py`.
Сверять значение ПОСЛЕ захвата обязательно: `UltraGraphics` переприменяет весь блок при входе в мир,
открытии карты и фаст-тревеле, и утром это испортило один замер.
**Trigger:** просадка кадра, не реагирующая на разрешение → проверять дальность прорисовки и
геометрию, а не пиксельные настройки.
**Not for:** сцены без дальнего горизонта (пещеры, интерьеры) — там рычаг ничего не даст.

### EXP-0021 · 2026-08-21 · ❌ · #palworld #showflag #deadchannel #shipping #falsenegative
**Context:** охота на просадку до 8–15 к/с. Через мост слал `ShowFlag.*` (DynamicShadows,
InstancedFoliage, StaticMeshes, PostProcessing, Rendering) — пять «оправданий» подряд, ноль эффекта.
**Tried / did:** после пятого нуля вспомнил EXP-0009 и проверил сам канал: `ShowFlag.StaticMeshes 0`
обязан выпотрошить мир видимо — не выпотрошил.
**Result:** ❌ — все пять «оправданий» аннулированы. ShowFlag-команды в шиппинг-сборке Palworld,
судя по всему, вырезаны; `KismetSystemLibrary:ExecuteConsoleCommand` при этом «исполняет» ЛЮБУЮ
строку без ошибки — канал не отличает сработавшую команду от пустой.
**Lesson:** `(исполнено)` от Kismet — не доказательство действия. Доказательство — только чтение
значения обратно (`GetConsoleVariable*Value`) или видимый эффект на экране. `r.*`-cvar-ы в этой
сборке работают (проверено чтением); `ShowFlag.*` — считать мёртвыми, пока кто-то не покажет обратное.
   → link: plans/01_cpu_gt_panorama.md · EXP-0009 (тот же класс: канал проверяется раньше гипотез)
**Repro:** мост ConsoleBridge: `?имя` до, команда, `?имя` после — значения обязаны отличаться.
Для флагов без чтения — скриншот до/после (`shot.ps1` в скретчпаде 21.08).
**Trigger:** второй подряд «не подтвердилось» через ЛЮБОЙ канал исполнения команд → проверить канал
командой с заведомо видимым/читаемым эффектом, потом продолжать.
**Not for:** каналы, уже доказанные чтением в этой же сессии.

### EXP-0020 · 2026-08-21 · ❌→✅ · #palworld #ue4ss #bridge #harness #console
**Context:** консоль в сборке не открывается (ConsoleEnablerMod регистрирует Tilde/@/^/F10 — лог
подтверждает, — но нажатия до игры не доходят). Каждая гипотеза стоила цикла «правка → деплой →
перезапуск» (~10 мин), владелец за клавиатурой нужен был на каждый заход.
**Tried / did:** написал UE4SS-мод ConsoleBridge: раз в 2 с читает `in.txt` рядом с собой, исполняет
строки, `?имя` читает значение; ответы в `out.txt` и UE4SS.log.
**Result:** ❌→✅ — v1 на `LoopAsync` (чужой поток — сосед DungeonBossRespawnMapTimer в своём коде
прямо пишет, что это ломало Lua-стейт) и без чтения; v2 на `ExecuteInGameThreadWithDelay` с
перевзводом таймера В КОНЦЕ обработки + чтение тремя геттерами Kismet. Позитивный контроль пройден:
движок вернул наши неванильные 2.6/6.0. Пять правок Lumen/облаков применены и подтверждены чтением
без единого перезапуска.
**Lesson:** файловый мост = консоль для агента: команды и ЧТЕНИЕ живых значений без владельца за
клавиатурой. Правила: Lua только на игровом потоке; `PalPlayerController:ConsoleCommand` здесь
строку НЕ возвращает — читать геттерами `KismetSystemLibrary:GetConsoleVariable*Value`; пустой ответ
геттера неотличим от несуществующего имени — имена сверять по `_config/cvars-registered.txt`.
   → link: пак `_unpacked/ConsoleBridge/` (в манифесте, задокументирован)
**Repro:** `printf '?r.ViewDistanceScale\n' > <игра>/ue4ss/Mods/ConsoleBridge/in.txt` → через 2–4 с
ответ в `out.txt` рядом. Не удалять `out.txt` во время записи — мод пишет в него.
**Trigger:** нужна проверка/правка cvar-а в живой игре → мост, не ini-цикл; ini — для закрепления
победителя (EXP-0007).
**Not for:** cvar-ы, читаемые только на старте движка (RHI и т.п.), — им по-прежнему нужен перезапуск.

### EXP-0019 · 2026-08-21 · ❌ · #palworld #regression #measurement #open
**Context:** первый заход владельца после 15.08. «Жуткие фризы» с ПЕРВОГО захода, до любых правок
на лету. Замеры: медиана кадра ~61 мс (8–16 к/с) против медианы 83 к/с в базе 15.08.
**Tried / did:** за сессию исключено ЗАМЕРАМИ: фон/фокус (кадр одинаков в фокусе и в фоне) ·
посторонние процессы (игра держит 96–103 % GPU сама) · перегрев/андервольт/кривая (KAGO: карта
заводская, троттлинга нет) · пиксельная работа (ScreenPercentage 25 → стало ХУЖЕ, 9 к/с) · весь
графический набор пака (пол по всем строкам → 9 к/с) · Niagara (глушилка — ноль) · динамические
тени/листва/меши через ShowFlag (аннулировано — EXP-0021). Единственный реальный сдвиг:
`r.DynamicGlobalIlluminationMethod 0` + `ReflectionMethod 0` = 8→13 к/с. GPU: 96 % на «3D»-очереди,
260 Вт, 2812 МГц — настоящая работа. Сосед KAGO накануне получил на этой же карте свою таблицу в
Q2RTX → система здорова, болен Palworld.
**Result:** ❌ — причина НЕ найдена. Открытый вопрос с планом в эстафете (STATUS.md).
**Lesson:** регрессия сидит вне графических настроек пака и вне сцены: профиль «96 % 3D-очереди,
260 Вт, кадр 61 мс при 1080p внутреннего разрешения, на четверти пикселей ХУЖЕ» не объясняется ни
одной ручкой, которую мы крутили. Подозреваемые в порядке: драйверное замещение DLSS из NVIDIA App
(«Предустановка L» — сегодня трогали соседний переключатель генерации) · изменение Windows/драйвера
с 15.08 · что-то в самом сейве/сцене. Мерить в ОКОННОМ и полноэкранном режимах раздельно — тракты
подачи разные.
   → link: STATUS.md (эстафета) · скретчпад 21.08: capture.csv, lumen-ab.csv, report*.md
**Repro:** база пересчитывается: PresentMon 2.5.1 (`_tools/`), СВОЁ имя сессии + `--stop_existing_session`,
куски по 20 с (файл занят, пока пишется); разбор `analyze.py` (скретчпад 21.08) — медианы, полосы,
десятисекундные вёдра.
**Trigger:** любые выводы о производительности Palworld → сперва проверить, не в этом ли состоянии
машина (8–15 к/с), иначе все замеры — про болезнь, а не про правку.
**Not for:** выводы о правках пака 15.08 — та база снималась в здоровом состоянии.

### EXP-0018 · 2026-08-15 · ❌→✅ · #library #naming #falsenegative #kumm #positivecontrol
**Context:** подготовка сборки Oblivion Remastered к патчу. В `README` сборки было записано авансом:
«имена — штатная схема Nexus, то есть `kumm.mjs` разбирает их как есть, без переименования».
**Tried / did:** прежде чем строить манифест на 168 модов, прогнал `parseArchive` по всем 177 именам
библиотеки — просто чтобы увидеть число разобранных.
**Result:** ❌ **0 из 177.** Схем имён у Nexus ДВЕ: та, что пишет сам движок при загрузке
(поля через пробел, `Имя 3659 1.0.0 2026-07-12T21-35Z токен.zip`), и та, что даёт кнопка Download
на сайте (`Имя-1921-3-5-1747646868.zip`, поля через дефис, в конце секунды Unix). Библиотека, собранная
руками через браузер, вся во второй. Плюс `modId` жёстко требовался четырёхзначным — а в этой игре
он бывает от двух до пяти цифр. → ✅ после правки разбираются обе схемы, 168 из 177.
**Lesson:** **утверждение о совместимости, записанное в документ, — это гипотеза, а не факт**, даже если
его написал ты сам и оно звучит очевидно. Стоимость проверки здесь была одна команда, цена непроверки —
манифест на 168 модов, который молча не нашёл бы ни одного архива и на весь список сказал бы «версия ?».
Тот же класс, что `EXP-0016`: инструмент, отвечающий «не найдено», обязан быть проверен на заведомо
существующем объекте. **Позитивный контроль перед доверием — не ритуал, а способ не строить на песке.**
   → link: [[EXP-0016]] · D:\work\ai_sandbox\OblivionRemastered\README.md
**Repro:** `node -e "import('file:///d:/work/ai_sandbox/KUMM/kumm.mjs').then(async k=>{const fs=await import('node:fs/promises');const d=await fs.readdir('D:/Games/Oblivion Remastered Mods',{withFileTypes:true});const f=d.filter(x=>x.isFile()).map(x=>x.name);console.log(f.filter(x=>k.parseArchive(x)).length+' из '+f.length)})"`
→ должно быть `168 из 177` (вывод идёт ПОСЛЕ шапки CLI — импорт файла запускает диспетчер команд).
Ноль означает, что разбор снова разошёлся с библиотекой.
**Trigger:** беру библиотеку архивов, собранную НЕ этим движком → сначала посчитать, сколько имён он
разбирает, и только потом строить манифест.
**Not for:** библиотеки, которые движок наполнял сам, — там схема имён его собственная по построению.

### EXP-0016 · 2026-08-15 · ❌ · #tooling #verification #falsenegative #incomplete
**Context:** весь день сверял имена cvar-ов со списком `_config/cvars-registered.txt` и уверенно
докладывал «живой» / «нет в exe». В том числе доложил владельцу, что **собственных cvar-ов у игры нет** —
проверил `Pal.*`, нашёл 20 штук, все про сохранения.
**Tried / did:** после прямого требования владельца («ты неверно понимаешь параметры, отправляйся на
разведку») прочитал строки ИЗ САМОГО exe, а не из списка.
**Result:** ❌ — в exe **75** cvar-ов `pal.*`, и **ни одного** из них в списке. Старый сканер читал только
ASCII, а имена `pal.*` лежат широкими строками UTF-16. Среди пропущенных — `pal.Foliage.*`, которые
управляют ровно той подсистемой, что владелец просил чинить (см. `EXP-0017`), плюс целый пласт
CPU-рычагов: `pal.CustomURO.*`, `pal.BuildObjectPhysicsBudget.*`, `pal.camera.GliderLandscapeLODStabilization`.
**Lesson:** **неполный инструмент проверки опаснее отсутствующего.** Отсутствие инструмента видно и
заставляет искать; неполнота выдаёт уверенные ложноотрицательные ответы, и на них строятся планы.
Инструмент, который отвечает «нет», обязан быть проверен на заведомо существующем объекте — то есть
нужен ПОЗИТИВНЫЙ КОНТРОЛЬ, прежде чем верить его отрицаниям.
   → link: researches/ue5-cvars/README.md → правило 1
**Repro:** `python _config/scan-cvars-full.py` в паке — читает ASCII и UTF-16, печатает статистику по
префиксам в stderr. Позитивный контроль: `grep -ci '^pal\.' _config/cvars-registered.txt` должен дать 95
(75 строчных `pal.*` + 20 `Pal.*`); если 20 или 0 — список собран сломанным сканером.
**Trigger:** инструмент проверки отвечает «такого нет» → прогони его на заведомо существующем образце
(строка, которую ты видишь глазами в другом источнике). Не проверил — не ссылайся на его отрицания.
**Not for:** инструменты, чьи ответы всегда положительные — там неполнота даёт молчание, а не ложь.

### EXP-0017 · 2026-08-15 · ❌→✅ · #palworld #engine-vs-game #assumption
**Context:** владелец жаловался, что трава «растёт перед носом, метрах в десяти». Полдня двигал
`grass.CullDistanceScale` (4 → 6), гвард-бэнды, `MinTimeToKeepGrass`, `MaxCreatePerFrame` — значения
применялись (подтверждено прибором), а симптом не двигался.
**Tried / did:** разведка по exe (6 параллельных агентов + адверсариальные скептики).
**Result:** ❌→✅ — растительность у игрока **не является ландшафтной травой Unreal**. У Palworld своя
подсистема: `UPalFoliageGridModel`, `UPalFoliageISMComponentBase`, `UPalFoliageType_InstancedStaticMesh`.
Все 22 cvar-а `grass.*` живут только в `ALandscapeProxy::UpdateGrass` и в этот код не заходят — они
двигали ДРУГОЙ, дальний слой. Отсюда наблюдение владельца «стала расти дальше, но всё ещё видно».
Настоящая ручка — `pal.Foliage.RegisterInstances.TimeSlicing`, справка игры: «0 = add all pending
instances immediately», то есть инстансы регистрировались порциями за тик — это и есть «дорастание».
**Lesson:** **игра на UE — это не UE.** Студия может подменить целую подсистему своей, и тогда движковые
cvar-ы применяются честно, но к другому объекту. Признак: значение применилось (проверено прибором), а
симптом не сдвинулся ни на шаг. Это не «мало покрутил» — это не тот слой.
   → link: researches/ue5-cvars/grass-foliage.md
**Repro:** искать в exe классы с префиксом игры: `python -c "import re;d=open(EXE,'rb').read();
print(sorted(set(re.findall(r'UPal[A-Za-z]+', d.decode('latin-1','ignore')))))"` — увидишь, какие
подсистемы студия написала сама.
**Trigger:** cvar применился (прибор подтверждает), а симптом не изменился ВООБЩЕ → проверь, тот ли это
слой; ищи собственную подсистему игры, прежде чем крутить значение дальше.
**Not for:** случаи, где симптом сдвинулся хоть немного — тогда слой верный, просто мало.

### EXP-0013 · 2026-08-15 · ❌ · #config #verification #instrument #retracted
> **ВЫВОД ОТОЗВАН В ТОТ ЖЕ ДЕНЬ.** Оставлен целиком, потому что отозванный вывод дороже стёртого:
> без него следующая сессия повторит тот же заход.

**Context:** сверил `Engine.ini [SystemSettings]` построчно с живым блоком `CVars` мода и объявил, что
21 строка тюнинга «до сцены не доживает» — включая `r.Shadow.MaxCSMResolution=4096` и всю дальность травы.
На этом основании снял 4096 (поставил ванильные 1536) и срезал `MaxCascades` 4 → 3.
**Tried / did:** в качестве «прибора» поставил 1536 ОДНОВРЕМЕННО и в `Engine.ini`, и в живой блок,
рассчитывая прочитать исходное значение в `UltraGraphics_CVarOriginalValues.txt`.
**Result:** ❌ — вывод неверен, и опровергла его игра, а не прибор: в первом же заходе вернулась «линия
по земле», которую 31.07 вылечили именно четырьмя тысячами. Значит 4096 **доезжали** до сцены.
Позже прибор подтвердил прямо: мод застал `grass.CullDistanceScale=4.0`, `GuardBand 2.0/2.2`,
`ViewDistanceScale=2.2` — ровно значения `Engine.ini`, которых нет больше нигде. **`[SystemSettings]`
до сцены ДОЕЗЖАЕТ.** Ненадёжны `[ConsoleVariables]` и `[/Script/Engine.RendererSettings]`
(`r.NGX.DLSS.DilateMotionVectors` лежал там и не дожил). Исключение найдено одно:
`foliage.LODDistanceScale` застали равным 2.0 при 4 в ini — эту строку игра действительно перебивает.
**Lesson:** ошибка была не в сверке, а в приборе. **Поставив одно и то же значение с обеих сторон, я
сделал две гипотезы неразличимыми** — «ini доехал» и «игра поставила свой дефолт» дают одинаковое
показание. Прибор обязан РАЗВОДИТЬ гипотезы: значения по обе стороны должны отличаться, иначе измерения
не происходит. Вторая ошибка процедурная: лечение этой самой линии было записано в README пака
(89 КБ, раздел «Линия по земле: шов между каскадами теней») с таблицей тестов — я правил тени, не
открыв документ, посвящённый теням, и предложил владельцу как свежую гипотезу тест, закрытый 31.07.
   → link: games/Palworld/README.md · researches/ue5-cvars/shadows.md
**Repro:** сверка живёт: `python _config/check-live-cvars.py` в паке — печатает ФАНТОМЫ, КОНФЛИКТЫ и
«только в живом блоке», выход 1 при расхождении. Но её вывод — это карта расхождений, **а не приговор
«не применяется»**: строка может отсутствовать в живом блоке и при этом прекрасно работать из ini.
**Trigger:** строишь «прибор» для проверки гипотезы → убедись, что при разных гипотезах он даёт РАЗНЫЕ
показания. Одинаковое значение с обеих сторон — не эксперимент.
**Not for:** случаи, где значения обязаны совпадать по другой причине (синхронизация двух конфигов) —
там совпадение это цель, а измерять надо иначе.

### EXP-0012 · 2026-08-15 · ❌ · #shell #windows #encoding #powershell #crossshell
**Context:** сгенерировал `make-settings.ps1` с русским комментарием внутри here-string, владелец его выполнил.
**Tried / did:** записал `.ps1` инструментом Write (UTF-8 **без BOM**), внутри `Set-Content -Encoding utf8`.
**Result:** ❌ — в записанном JSON вместо русского «Р Р°Р·СЂРµС€РµРЅРёСЏ». Windows PowerShell 5.1 читает
`.ps1` без BOM как ANSI (CP1251), то есть текст испортился ЕЩЁ ПРИ ЧТЕНИИ СКРИПТА, а `-Encoding utf8`
честно сохранил уже испорченное. Реакция владельца: «ты не знаешь своего окружения?».
**Lesson:** `-Encoding utf8` на выходе не спасает, если вход прочитан как ANSI — кодировка ломается на
том конце, который не проверяют. В скриптах для PS 5.1 держать **только ASCII**, а любой не-ASCII текст
писать в целевой файл напрямую инструментом Write, минуя PowerShell.   → link: EXP-0002 (тот же класс:
два шелла — два мира)
**Repro:** `powershell -NoProfile -Command "Get-Content <файл>.ps1 -TotalCount 3"` — если русский в выводе
битый, файл нужен с BOM. Проверить BOM: `python -c "print(open(r'<файл>','rb').read(3)==b'\xef\xbb\xbf')"`.
**Trigger:** пишешь `.ps1`/`.bat` с не-ASCII содержимым → либо сохрани с BOM, либо оставь в скрипте
только ASCII и вынеси текст в файл, записанный напрямую.
**Not for:** PowerShell 7+ (`pwsh`) — он читает скрипты как UTF-8 по умолчанию, ловушки нет.

### EXP-0011 · 2026-08-15 · ✅ · #telemetry #metrics #averages #framegen
**Context:** пятиминутный срез Palworld: средние показали CPU busy 11.63 мс против GPU 10.34, из чего
был сделан вывод «процессор стал боттлнеком, андервольтить CPU».
**Tried / did:** посмотрел не средние, а перцентили той же выборки: CPU busy p50 = 0.48 мс при p90 = 36 мс,
GPU busy p50 = 2.73 при p90 = 32.
**Result:** ✅ вывод отозван. Разрыв медианы и хвоста в семьдесят раз означает не «упор в CPU», а крайне
неравномерную сцену: дешёвые кадры в помещении и на паузе рядом с тяжёлыми на открытом мире.
Средние здесь описывают смесь и не значат ничего.
**Lesson:** в игровой телеметрии **среднее — почти всегда ложь**: распределение кадров многомодальное
(меню, помещение, открытый мир, стриминг), и одно число по нему не строится. Решения принимаются по
медиане и перцентилям, а сравнения между заходами — только при сопоставимой длине и сцене. Отдельно:
если включена генерация кадров, метрики без `--track_frame_type` смешивают настоящие кадры со
сгенерированными, и тогда врут уже сами данные, а не их сводка.   → link: pack `_config/Latency-and-FrameGen-audit.md`
**Repro:** `$s = $vals | Sort-Object; $s[[int]($n*0.5)]` рядом с `Measure-Object -Average` — если они
расходятся в разы, среднее выбрасывается.
**Trigger:** любой вывод о боттлнеке по средним → пересчитать по p50/p95, прежде чем говорить владельцу.
**Not for:** однородные синтетические бенчмарки, где сцена постоянна.

### EXP-0010 · 2026-08-15 · ❌ · #telemetry #tooling #falsepositive #dlss
**Context:** жалоба на задержку до 120 мс. В захвате PresentMon все 18 932 кадра имели
`FrameType = Application`, ни одного сгенерированного.
**Tried / did:** объявил владельцу, что DLSS Frame Generation не работает, и подкрепил это строкой
`AntiAliasingType=AAM_TSR` в `GameUserSettings.ini`.
**Result:** ❌ — неверно. Владелец возразил: оверлей NVIDIA показывает работающую генерацию. Проверка
подтвердила его: **открытый PresentMon не помечает кадры DLSS-G** (для этого нужен приватный API
NVIDIA, им пользуется FrameView), и запасная проверка «отношение рендеров к показам» тоже развалилась —
`MsBetweenPresents` дал медиану 0.99 мс, то есть «1010 показов в секунду» при реальных 115.
**Lesson:** **отсутствие метки в телеметрии — не доказательство отсутствия явления.** Инструмент
молчит и когда явления нет, и когда он его не умеет видеть; различить эти два случая можно только
позитивным контролем или вторым независимым источником. Здесь второй источник был у владельца перед
глазами (оверлей), и спросить его стоило ДО того, как объявлять вывод. Отдельно: `AAM_TSR` не
опровергает DLSS — это другое поле, и трактовать его как доказательство было домыслом, а не чтением.
   → link: pack `_config/Latency-and-FrameGen-audit.md`, раздел 1
**Repro:** долю кадров DLSS-G смотреть в оверлее NVIDIA или FrameView; PresentMon использовать для
времён кадра, задержек и перцентилей, но не для ответа «работает ли генерация».
**Trigger:** вывод вида «функция не работает» на основании ПУСТОТЫ в данных → сперва доказать, что
инструмент вообще способен эту функцию увидеть.
**Not for:** случаи, где инструмент подтверждённо умеет различать искомое.

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
**Повтор 2026-10-08:** тупик со сборкой FrameView пройден заново (баг 31): досье указывало на неё, а журнал по `#presentmon`
до работы не прочитан; нашёл владелец («PresentMon мне кажется даже уже есть», «а KAGO»). mechanized: досье теперь называет
первой сборку Intel `_tools/PresentMon-2.5.1-x64.exe`, путь FrameView — как тупик.

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
