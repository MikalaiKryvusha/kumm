# KUMM — MASTER PLAN

> The roadmap: how we get from the project's **current state** to the vision in `GOAL.md`. A high-level,
> stepwise decomposition — phases and milestones, not day-to-day tasks (those live in `plans/`). Derived
> from `GOAL.md` by the agent at deploy and refreshed with `/revision` as the goal or the state changes.
>
> This is a **living reference**, not a task — never DONE-tagged.

---

## Vision (one line)

One command assembles, updates and repairs a modded game build — for any game, on a free Nexus account.

## What matters now

**The Conan 3.0.1 build — the main focus since 2026-10-26; other games are not a priority.** `[OWNER]` «все игры пока не в приоритере, мы работаем дат
сборкой конана» · «она 1_ должна работать стабильно 2_ моды не должны конфликтовать, должны быть рабочими 3_ не должно быть явных просадок
производительности из-за модов» · 2026-10-26. Acceptance criteria: (1) a long run with no crashes and no new errors in the log; (2) not one
table row where a mod silently loses its change without the owner's decision, and every mod's in-game function checked; (3) the build vs.
the game without paks — the difference stays within fly-through noise over A-B-A-B pairs, our Lua mods no more than 1 ms in the worst frame (Svarog's rule below).
The build is our turnkey product, and we edit other authors' mods in it directly: `[OWNER]` «это наш труд, кастомная сборка, починенная, адаптированная» · «продукт
под ключ» · «поэтому правим всё, что хотим» · «качественно и грамматно» · «как разведка Сворога учит - там мы сразу делали много неправильных
подходов, а потом научились ПРАВИЛЬНО» · 2026-10-26. How — `HOUSE_RULES.md` §1 "Other authors' mod interfaces are fixed natively" and
`researches/svarog-native-mod-architecture/`.

**Svarog's Dream — the main focus from 2026-10-09 to 2026-10-26.** `[OWNER]` «забей на Medieval Dynasty. Ты разве не видишь, что мы работаем дальше над
Сварогом, и я тебя по нему прошу делать и на нем сфокусироваться» · 2026-10-09 ≈13:25. Backlog — `plans/18_svarog_backlog_checklist.md`.
Svarog's interface rule: everything scales at 16:9 on 720p, 1080p, 2K, 4K, including a resolution change in a running game
(remote desktop): `[OWNER]` «Всё, что мы делаем, долэно корретно масштабироваться и работать на классическом сообтношении 16:9 и
классических разрешениях 1080p, 2K, 4K» · «ты не видишь, что ты сейчас не в 1080p, а в 720p ? Это то же соотношение 16:9, так что тоже
все должно корректно масштабироваться» · 2026-10-09. Medieval Dynasty (epic 15 below) is paused.
Svarog's mod-compute rule: whatever we clearly know how to compute on the GPU is computed there, not on the CPU — where the gain is
really justified: `[OWNER]` «всё, что можно и понятно как СЧИТАТь на GPU - нужно на нём считать, а не на CPU. Только где выигрыш реально
оправдан. на шейдерах, CUDA. У нас суппер можная GPU, многопоточная» · «и она отдыхает» · «а CPU грузится в одном потоке - и мы не можем
грузить главный поток дальше» · 2026-10-12 (that evening's measurement: main thread 21.5 ms per frame, GPU 24 % busy). Acceptance of new
mod work — `perf` on/off: the main thread costs no more, the cost moved to the GPU.
**CPU budget — 1 ms for all mods together, in any frame:** `[OWNER]` «2 мс - это неприемлимо. Маши моды все вместе не должны кушать
больше 1 мс процессорного времени НИКОГДА ни при каких условиях. Что можно - делаем на GPU, CUDA, но не на процессоре. Или очень
уважительными к процессору алгоритмами.» · 2026-10-14 ≈10:54. **Where it applies** — the owner's clarification: `[OWNER]` «При открытии - насрать.
Лаг допустим.» · «Лаги не допустимы в игре, когда герой бегает а игрок играет, воюет, при геймплее основном» · 2026-10-14 ≈14:45. The limit is
for the worst frame of core gameplay (running, combat, walking the world, streaming areas in on the move, villagers' lines), spikes included; opening
windows is outside it. (The earlier `[AI]` reading "window creation counts toward the same 1 ms" is revoked by this.)
**Mods extend the game, they are not crutches:** `[OWNER]` «нужно наши моды писать как продолжение игры, расширяющее её нативный код, а не как
костыли. Можно свои новые структуры данных заводить. улучшать и переписывать старые - все во благо оптимизации и эффективности
алгоритмов!!!!» · 2026-10-14 ≈21:00 (on plan 24's list: speech bubble 11–12 ms, scene searches every frame, a full pass over the letters window
every frame). A mod learns about game events at the game's lifecycle points (creation, show, area change), keeps its own registries and data
structures, and rewrites the game's slow spots instead of searching and recomputing everything every frame. Reconnaissance — `researches/svarog-native-mod-architecture/`.

**Epic 15 — the living world of Medieval Dynasty** (paused since 2026-10-09), phase 0 "reconnaissance and bench" (`plans/16`). The owner's word: `[OWNER]` «и начинаем эпик
по модинку моей любимой игры с ПУСТЫМ БЛЯТЬ МИРОМ - Medieval Dynasty! Сделаем мир ПОЛНЫМ И ЖИВЫМ!» · 2026-10-07 ≈23:35.
Meta-plan — `plans/15_EPIC_medieval_dynasty_living_world.md` (`[OWNER]` «метаплан принят» · 2026-10-08 ≈09:37); the metric is the
phase acceptance criteria in `plans/16`. Living-world rules the owner stated along the way (villagers walk the road and cut across only
when they must; knowledge, rumours and items pass only along trust) live in plan 15 and are not repeated here.

**Villagers' minds — a separate model, KARMA** (Krinik Agent Relations & Mind Approximation), public repository
https://github.com/MikalaiKryvusha/KARMA: `[OWNER]` «Давай KARMA И заведём публичный репозиторий под неё» · 2026-10-08. One
model, possibly several implementations; Medieval Dynasty is the first consumer, Unliminium and future games come next. In the epic
it is the parallel track K (choice of traits and needs → test scenarios → C# reference → phase 3's "Will"); walking on foot is phases 2–3,
rumours and items along trust are phase 4 (`plans/15`, phase table).

The engine (phases below) lives on: every new game of the epics is installed by it with no code change. Phase 1 is the autonomous
backlog for when there is no game work. Svarog's Dream and Mafia II are paused (STATUS).

## Guiding principles

- **The engine is stateless; the pack owns everything.** No database, no cache, no hidden config.
  Every fact is re-derived from `modpack.json` and from the library's file names on each run. This is
  what lets one engine serve many packs and many games (`PHILOSOPHY.md` → simplicity).
- **The game is data, never code.** Palworld is a default, not an assumption. Oblivion Remastered must
  cost a manifest, not a release.
- **Zero dependencies.** Node ≥22 and Windows PowerShell ship what the project needs. A dependency is a
  design change, not a commit.
- **Observation over trust.** A deploy verifies itself; staleness is decided by the file's upload date,
  not by a version string an author forgot to bump.
- **Courtesy toward Nexus.** The tool reproduces exactly the request the site makes on a human click —
  no batching, no click emulation, no premium bypass. This constraint shapes the architecture.

## From here to there — the phased path

### Phase 0 — the two halves ✅
- **Goal of the phase:** downloading from Nexus on a free account, and deploying a pack into a game,
  both working for Palworld.
- **Steps:** CDP transport through a dedicated Chrome profile · `check`/`update` against the library ·
  `Deploy-ModPack.ps1` with targets, `Engine.ini`, `steam_emu.ini` and self-verification · the engine
  split away from the pack (`-PackDir` / `--root`), so the pack keeps its own private git.
- **Status:** ✅ done — v0.1.0, three commits, in daily use by the owner.

### Phase 1 — an engine you can trust unattended 🔲
- **Goal of the phase:** the deterministic core is covered by checks a fresh session can run with no
  network, no Chrome and no game installed — so a change to the naming scheme or the variant picker
  cannot ship silently.
- **Steps:** round-trip check for `parseArchive` ↔ `libraryName` · cases for `sameFile`/`stamp` and
  `pickCard` (Steam vs Gamepass, Capped vs plain) · a fixture pack of zero-byte correctly-named
  archives driving `check --json`, `-ListMods` and `-Deploy -DryRun` · ~~close the packaging drift~~ (done
  2026-10-10: `npm pack --dry-run` ships both halves) · a real `help` command, since
  the switch block, the header comment and the README table are three copies of one list.
- **Status:** 🔲 todo — this is the phase the autonomous backlog is pointed at.

### Phase 2 — the second game 🔲
- **Goal of the phase:** Oblivion Remastered runs on a manifest alone, with no engine change. That is
  the only honest proof that "the game is data" holds.
- **Steps:** a manifest for the second game (`nexusGame`, `gameExe`, `library`) · run the whole cycle
  against it · fix whatever turns out to be Palworld-shaped in the code · record what a new game costs
  in a research doc, so the third game is cheaper than the second.
- **Status:** 🟢 proven — on Conan Exiles Enhanced, with no engine change (slug from the manifest, `game_id` from the
  page; STATUS); Medieval Dynasty became the third game the same way (EXP: the game is recognised by its `gameExe`).
  Oblivion Remastered stays prepared (manifest of 168 mods) and parked until its patch.

### Phase 3 — compatibility, the part that hurts 🔲
- **Goal of the phase:** the engine tells the owner *before* deploying which two mods will fight, and
  in what order they must land.
- **Steps:** file-overlap detection across mods at deploy planning time · load order / priority as a
  manifest field · conflicts reported by `-DryRun` instead of discovered in-game · known-conflict notes
  attached to the mod entry.
- **Status:** 🔲 todo — needs a research doc first (how the modding community actually resolves this
  for UE4SS-based games).

### Phase 4 — optimization as knowledge, not folklore 🔲
- **Goal of the phase:** engine and mod tuning (the `Engine.ini` contour today) becomes a reusable,
  documented set of presets instead of settings remembered by one person.
- **Steps:** presets named and versioned in the pack · what each setting buys, measured, in
  `researches/` · applying a preset is one flag.
- **Status:** 🔲 todo.

### Phase 5 — the goal is reached 🔲
- A new game build lands; the owner runs one command; mods update, conflicts are reported, the pack
  deploys into the new build and verifies itself. What is left for a human is the decisions — which
  mods, which presets — and nothing else.

## Decision log

`<Stamped, one line each: significant decisions and why — so a future session doesn't relitigate
them. A stamp is a MOMENT: date AND time in the owner's local clock (AGENT_GUIDE → Document & text
hygiene). Decided and recorded are two moments — tell them apart when they differ; write an honest
`≈` rather than an invented minute.>`

| Stamp | Decision | Why |
|------|----------|-----|
| 2026-08-14 23:57 +03:00 (recorded — commit `6ec673c`) | Reach Nexus through a real Chrome on a debug port (CDP), not an HTTP client | Cloudflare blocks plain requests and `download_link` is premium-only; a logged-in browser issuing the site's own `GenerateDownloadUrl` request is the only path that works on a free account without emulating clicks |
| 2026-08-14 23:57 +03:00 (recorded — commit `6ec673c`) | A dedicated Chrome profile in `%LOCALAPPDATA%\nexus-cdp\profile` | Chrome 136+ ignores the debug port on the default profile; `%LOCALAPPDATA%` rather than `%TEMP%` so a cleanup does not log the owner out |
| 2026-08-14 23:57 +03:00 (recorded — commit `6ec673c`) | Compare by the file's UPLOAD DATE, not by version string | Authors re-upload without bumping the number (WorldSettingsUnlocker), and a mod's header version differs from its file's (PauseOnMenu 1.0 vs 1.0.0) |
| 2026-08-15 00:33 +03:00 (recorded — commit `7ead876`), extended 00:44 (`a0bfa7f`) | Split the engine from the pack — `-PackDir` / `--root`, and let the library live outside the pack | The engine ships publicly; a pack is the owner's private collection with its own git |
| 2026-08-15 01:02 +03:00 (recorded) | Canonical name is **KUMM**; `kumm` stays the npm id and the CLI command | Identity is the owner's call, not the machinery's guess from `package.json` (owner's answer at the KAIF deployment) |
| 2026-08-15 01:02 +03:00 (recorded) | KAIF 2.2 deployed, sphere `programming`, tracking mode `origin` | The project is worked on across context-losing agent sessions; the framework externalizes the memory and discipline that a chat cannot keep |
| 2026-09-05 13:28 +03:00 (recorded) | KAIF updated 2.2 → 2.5 by the bootstrap route; the 2.3–2.5 rule changes accepted; the delivery metric PROPOSED, not yet the owner's | The project owner is the KAIF author — the framework's policy changes are his own origin decisions; the one per-project setting (the metric) is his call: interview #001 |
| 2026-09-18 18:06 +03:00 (recorded; the live pass ran at 17:59) | KAIF updated 2.5 → 2.7 by the bootstrap route. The delivery-metric line is REMOVED from this plan and interview #001 Q1 closes as superseded | `[OWNER]` "remove the DELIVERY feature from KAIF — projects started writing it, but I do not use it and see no value in it" · 2026-09-12 — the origin owner's word exactly as the 2.7 update task prints it, in English (the project owner is the KAIF author; whether the original was said in Russian the task does not say). The metric PROPOSED by the agent on 2026-09-05 was never ratified, so nothing of the owner's is lost. `[AI]` The other rule changes of 2.6–2.7 are taken as the framework author's own origin decisions; all twenty are listed for him in `KAIF_FRAMEWORK.md` → "All twenty rule changes of this interval" |

| 2026-10-07 ≈23:35 +03:00 (decided) · 2026-10-08 (recorded here) | Main focus — epic 15, the living world of Medieval Dynasty; Svarog's Dream paused | `[OWNER]` «и начинаем эпик по модинку моей любимой игры с ПУСТЫМ БЛЯТЬ МИРОМ - Medieval Dynasty! Сделаем мир ПОЛНЫМ И ЖИВЫМ!»; meta-plan accepted 2026-10-08 ≈09:37 |
| 2026-10-09 ≈13:25 +03:00 (decided) · recorded 13:30 | Main focus — Svarog's Dream; Medieval Dynasty paused; Svarog's interface — 16:9 on 720p, 1080p, 2K, 4K | `[OWNER]` «забей на Medieval Dynasty» · «мы работаем дальше над Сварогом» · «720p … тоже все должно корректно масштабироваться» |
| 2026-10-14 ≈14:45 +03:00 (decided) · recorded 14:47 | The 1 ms main-thread budget applies to core-gameplay frames; lag when opening windows is acceptable | `[OWNER]` «При открытии - насрать. Лаг допустим.» · «Лаги не допустимы в игре, когда герой бегает а игрок играет, воюет, при геймплее основном» |
| 2026-10-08 ≈13:15 +03:00 (decided) · recorded 13:18 | NPC minds — a separate reusable model, KARMA, in a public repository; the name and its expansion approved by the owner | `[OWNER]` «Давай KARMA И заведём публичный репозиторий под неё» · «Утверждено «Krinik's KARMA: A Psychological Model for Game AI Agents» KARMA (Krinik Agent Relations & Mind Approximation)» |
| 2026-10-16 22:30 +03:00 (live pass) | KAIF updated 2.7 → 2.9 by the bootstrap route; project facts moved from `AGENT_GUIDE.md` to `HOUSE_RULES.md`; the KAIF refresh hooks wired | `[AI]` The 2.8–2.9 rule changes are accepted with the version (the 2.9 rule: no question to the owner unless a rule collides with his recorded decision — none found); all nine are listed for him in `KAIF_FRAMEWORK.md` → "What changed in 2.8 and 2.9" |

---

> **Maintenance:** keep this in sync with reality. When `GOAL.md` or the project's state shifts materially,
> run `/revision` to re-derive the phases. The per-step detail plans that implement each phase live in
> `plans/`.
