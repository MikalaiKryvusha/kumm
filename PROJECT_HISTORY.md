# KUMM — Project History (the chronicle)

> The APPEND-ONLY chronicle of how this project lived and grew: closed sessions, shipped phases,
> releases, big decisions in the order they happened. This is where `STATUS.md` sheds its past —
> STATUS stays a short live summary of NOW; everything finished moves HERE (the "bonsai trim" step
> of `/end-chat`).
>
> **Not required reading.** This file is NOT part of `/resume`'s canon set and not in the
> before-every-task minimum — open it only when you actually need the archaeology: how a decision
> came to be, what an old phase contained, when something shipped.
>
> **Chronicle rules (ADR discipline):**
> - **Append-only, newest on top.** A recorded entry is never edited to say something else —
>   history that can be rewritten is not history. Corrections come as NEW entries that reference
>   and supersede the old one.
> - An entry moves here VERBATIM from `STATUS.md` when its work closes — move, don't rewrite;
>   the entry already carries its dates, counters and file pointers.
> - Entries mention versions and dates freely — a chronicle legitimately speaks of old versions,
>   and the update machinery's stale-claims scan knows to leave this file alone.
> - When the file grows unwieldy, split by era: keep the newest era here, move older ones to
>   `PROJECT_HISTORY_<era>.md` files, and leave a one-line index at the top of this file
>   (the pattern large changelogs use).
>
> Living document — never DONE-tagged.

---

## Entries (newest first)

### Подготовка сборки Oblivion Remastered к патчу, 2026-08-15 ✅ (перенесено из STATUS 2026-08-21)

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

### Графическая сессия Palworld, 2026-08-15 ~09:00–13:30 +03:00 ✅ закрыта
Полный разбор — `games/Palworld/README.md` (досье) и `games/Palworld/tuning-2026-08-15-base-fps.md`
(журнал правок с порядком отката). Здесь только то, что закрылось.

- **Замерено, что панорама упирается в ИГРОВОЙ ПОТОК, а не в видеокарту.** Разбивка захвата по
  полосам частоты при выключенной генерации: на 25–45 к/с `CPU busy` 28.1 мс против `GPU busy` 6.2.
  Следствие, стоившее половины дня: снижение разрешения (шаг DLSS вниз) панораму не лечит.
- **Найдена настоящая причина «трава растёт перед носом»:** у Palworld своя подсистема листвы
  (`UPalFoliageGridModel`, `UPalFoliageISMComponentBase`), к которой движковые `grass.*` не относятся
  вовсе. Ручка — `pal.Foliage.RegisterInstances.TimeSlicing`. Урок `EXP-0017`.
- **Починен инструмент проверки:** `cvars-registered.txt` не содержал ни одного из 75 собственных
  cvar-ов игры (`pal.*`) — сканер читал только ASCII, а они широкие UTF-16. Новый
  `_config/scan-cvars-full.py`, список 4458 → 4668 имён. Урок `EXP-0016`.
- **Отозван вывод про «21 фантом»:** `[SystemSettings]` в `Engine.ini` до сцены ДОЕЗЖАЕТ; ненадёжны
  `[ConsoleVariables]` и `[/Script/Engine.RendererSettings]`. Цена ошибки — снятое
  `MaxCSMResolution=4096` вернуло «линию по земле» в тот же заход. Урок `EXP-0013`.
- **Задержка и генерация:** подтверждено скриншотом, что FG живёт только через замещение в NVIDIA App;
  при базе 30 и цели 80 кратность ~2.7 и даёт микромерцание листвы, шлейф и мыло по краям.
- **Ветка многопоточности закрыта:** из пяти включённых cvar-ов мод менял ровно один — остальные
  движок уже держал включёнными. Игровой поток не распараллеливается в принципе.
- **Заведён `researches/ue5-cvars/`** — постоянный конспект по cvar-ам UE5 на 920 КБ, девять разделов.
- **Заведены приватные репозитории сборок:** `palworld-modpack`, `oblivion-remastered-modpack`
  (в последний перенесён мод-лист владельца на ~150 модов из `Мои моды.odt`).

### FPS regression traced and tuned out, 2026-08-15 01:4x +03:00 ✅ measured: 100–130 FPS (was 80)
- Symptom: average FPS fell from ~120 (peaks 140) to ~80 after the 14 Aug deploy. **Cause was not the
  game's weather** but the pack's own mods: Ultra Graphics 1.2.2 introduced a runtime `CVars` block that
  applies AFTER `Engine.ini` and overwrote **26 lines** of the 31 Jul Pareto tuning.
- Fix (pack commit `bc892d8`): the block was reviewed line by line; cheaper-or-free author findings moved
  INTO `Engine.ini`, expensive ones rejected by name. `CVars.Enabled=false` in the mod.
- **Verified in game:** the owner's session read **100–130 FPS against 80**.
- **Shadow flicker — closed the same night** (pack `f6ab2fa`). Culprit: `r.InstanceCulling.OcclusionCull`.
  Cost of calm shadows, measured: GPU busy 7.21 ms vs 6.6, median 137.8 vs 142.
- Lesson recorded as `EXP-0009` (superseded in part by `EXP-0013`: `[SystemSettings]` does arrive).

### Latency and frame generation, 2026-08-15 03:xx–05:00 +03:00 ✅ measured
- Owner reported input lag "up to 120 ms". Measured: `input → photon` p50 41.6 / p95 75.5 / p99 91 ms.
- **Two agent conclusions were WRONG and retired** — `EXP-0011` (averages on a multimodal scene) and
  `EXP-0010` (PresentMon cannot label DLSS-G frames).
- **Fix and its measured result** (pack `2258d5a`, `54edbca`): NVIDIA App dynamic target 120 → 80, plus
  `D3D12.MaximumFrameLatency` 3 → 2 and `r.OneFrameThreadLag` 1 → 0. **Latency p50 41.6 → 26.8 ms, −36%.**
- **What did not move: the tails** — they are held by base frame rate, not by generation.
- **Panel measured: 3840×2160 @ 144 Hz.**

### v0.1.0 — the two halves, 2026-08-14/15 ✅
- `kumm.mjs` (637 lines, zero deps, Node ≥22): CDP transport to a dedicated debug-port Chrome;
  `launch`/`login`/`status`/`check`/`update`/`files`/`get`/`changelog`/`eval`/`close`.
  Downloads via the site's own `GenerateDownloadUrl` request — works on a free Nexus account.
- `Deploy-ModPack.ps1` (1003 lines, Windows PowerShell 5.1): resolves each mod's source, deploys into
  every target game folder, writes `Engine.ini` (per machine) and `steam_emu.ini` (per target),
  verifies itself. Interactive menu when run with no switches.
- Engine split from pack (`7ead876`, `a0bfa7f`): `-PackDir` / `--root`; the archive library may sit
  outside the pack entirely. This repo ships the ENGINE only — packs are private, with their own git.

### KAIF 2.2 deployed, 2026-08-15 01:0x +03:00 ✅
- Bootstrap clean: loader → sha256-verified machinery → mechanical deploy. 35 skills × 5 agent systems.
- Canonical name recorded as **KUMM** (owner's answer); sphere `programming`; tracking mode `origin`.
- Both maps, `MASTER_PLAN.md`, the environment dossier and the placeholder set filled by the agent.

### <date> — <session/phase/release title> <✅/🎉>
`<The entry as it lived in STATUS.md — verbatim: what was done, key numbers, file pointers.>`
