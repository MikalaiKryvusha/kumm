# Bug 64 — Conan 3.0.1: wave of mod UI defects found by the owner in 5 minutes (overlaps, untranslated strings, jitter)

**Status:** 🔴 OPEN · **Severity:** S2 (an owner's hour lost; his trust that "smoke passed" means "it looks right") ·
**Version/build:** Conan Exiles 3.0.1 CL-379176, pack `ConanExiles` 64 paks + 8 Lua mods, `Game.locres` of 2026-10-25 ·
**When/context:** 2026-10-26 08:58–09:04, smoke run 1 (`testcases/TC_conan_build_stability_compat_perf_2026-10-26.md`); the owner
entered the agent's game and reported by screenshots · **Fixing:** this session

## Goal vector
Avoid: the owner meets a mod UI defect the agent could have found. Done when every item below is fixed and seen fixed on a frame of the
same screen, and the two mechanical sweeps (untranslated literals, overlaps/clipping) report zero unexplained hits.

## The owner's words (verbatim, chat 2026-10-26)
«моды, которые мы поставили, нужно бы протестировать в игре, хотя бы smoke» · «если моды приносят UI - увидеть бы, что наши мереводы ровно
стали» · «а тут наложение» · «а тут долго было без текста почему-то» · «и тут наложение» · «пр переключении вкладок текста в кнопках
дергаются - такие же баги были в свароге, перавильно переводы подставлялись, словно ты эти же баги допустил» · «тут осталось без переводов» ·
«видишь как много косяков? и я их за 5 минут нашёл. А это ТЫ должен находить такое» · «и чинить»

## Items
| # | Where | Symptom | Cause (known / hypothesis) | Fix | Status |
|---|---|---|---|---|---|
| 1 | HUD | Damage Meter window lies over the Hosav HUD block (server FPS, ping, temperature show through; «Здоровье сни…» cut by its edge) | Damage Meter default position (saved in `Saved/SaveGames/DamageMeter.sav`) overlaps Hosav's top bar | — | open |
| 2 | Menu bottom bar | Hosav «Настройки интерфейса» button over the vanilla «Показать контент из DLC [␣]» button | `W_UI_SettingsButton_C` is added to the viewport at a fixed spot; 3.0 vanilla bar has the DLC toggle there (hypothesis) | — | open |
| 3 | Simple Minimap tutorial | «Закрыть» wider than its button; «Удерживайте F1 чтобы…» without a comma | our strings: row 1051 shared «Закрыть»; row 4561 rewritten 25.10 but not rebuilt | `key:521C94…` «Ясно» in `dm-fish-ru.tsv`; rebuild | fix written, not built |
| 4 | Simple Minimap marker tutorial | bullet lines appear only after a long delay; «NEW:» English; slide area black | `FadeInList` animation (author's); «NEW:» key `1B304F3E…` absent from the worklist; black slides — unknown | — | open |
| 5 | Fullscreen map bottom bar | SMM hint «Shift + мышь SMM Добавить свой маркер» over vanilla «Сброс маркеров [X]» | `SM_UI_MapHelper` placed over the 3.0 vanilla button; our longer strings widen it | shorten rows 4514/4515; move the widget | open |
| 6 | Menu tabs | text in buttons jitters when switching tabs | not `.locres` (static) and not `KrinikHudOutline` (HUD only) — to be seen on a frame-by-frame video | — | open |
| 8 | ESC pause menu | Simple Modlist panel («Список модов», «ID модов») lies over the vanilla menu column («Играть без подключения», «Организатор совместной игры», «Версия … Бэкенд») | `SML_UI_ModList` placement made for the old menu (hypothesis) | move the panel — our Lua, on the widget's creation event | open |
| 9 | ESC pause menu, Simple Modlist | mod list text too small to read (owner: «текст списка модов нужно крупнее для читаемости») | author's font size | larger font for the list rows — same Lua | open |
| 10 | HUD, Damage Meter collapsed | collapsed meter sits bottom-left; owner: «нужно сворачивать не в левый нижний угол, а в левый верхний» | author's collapsed position | move the collapsed button top-left — same Lua | open |
| 11 | World, third-person camera | stones and sticks cannot be picked up in third person, only in first (players complained; owner confirmed at a stone) | the game traces interaction from the CAMERA, length `InteractionDistance` 330 + `InteractionDistanceThirdPersonBonus` 55 — sized for the vanilla 200 cm camera; `ConanCameraControl` puts the camera at arm (60–1000) + 100 back. Control: pitch 0 / raise 0 — still not picked (owner 09:21); bonus 600 — picked (owner 09:2x) | camera mod recomputes the bonus on every zoom change: 55 + (arm + back − 200) + 315 → 5 m ahead of the hero at any zoom (owner: «5 метров - клевенько») | fixed; R1 pass 09:35, R2 (owner's path) waiting |
| 12 | World, enemies | health bars above mobs cover the mobs; owner: «нужно выше» | which mod — not yet identified (Hosav `W_EnemyHealthbar*`, SudoExile `TotNameplate` candidates) | the mod's own setting if any (rule §1 step 0), otherwise its asset | open |
| 7 | Parameters tab, magic school icons (Era of Trials) | tooltips English: «Entropic magic is dark, deceitful, and unfair…», «You have {0} Entropic Amp…» (six schools + Readiness) | string literals in blueprint bytecode of `EoT_W_CharInfoMagicDisplay` — not FText, `.locres` cannot reach them (class of Svarog bug 28; Hosav precedent — interview_003) | — | open |

## Process diagnosis (why the owner found them, not the agent)
The smoke checked the loader (64/64 mounted, 63 controllers) and one HUD frame; no tab, no mod window, no tooltip was walked; nothing
measured overlaps; untranslated text was searched only among FText entries, never among bytecode literals. Remedies — mechanical:
1. untranslated literals: scan every extracted mod for English sentences absent from `all-mods-ftext.csv`, per mod;
2. overlaps and clipping: pult script over visible text/button widgets — screen rectangles, pairs from different mods that intersect,
   texts whose desired width exceeds their slot;
3. a window walk with frames is part of every mod smoke (TC case list), done by the agent.

## Decisions made without the owner
- `[AI]` «Ясно» for the Simple Minimap tutorial button (fits 5 letters; «Закрыть» does not).
