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
| 13 | Mod menus (magic school, demonic scrolls, enchanting, camera zoom toggle, «Поддержать автора») | our Russian is wider than the buttons; owner: «беда с нашими текстами · нужно учить кнопки расширяться а текста переноситься» | fixed-size buttons sized for English | native: auto-wrap / size-to-content in the widget asset; else a shorter string | open |
| 14 | HUD quick bar | shown after opening the hub's Equipment tab, then disappears; owner: «какой-то мод её неверно закрывает» | a mod hides/collapses the action bar (hypothesis) | find by bisect | open |
| 15 | Hub (inventory/character menu), Q/E tab switching | the whole hub «пляшет»; owner: «явный признак того, что моды построены на перехватах и инжекциях НЕПРАВИЛЬНО · такие же проблемы постоянно ловили в Свароге» | mods injecting widgets into the hub on tab events (hypothesis) | bisect by frame video of tab switching | open |
| 16 | Hub bottom-left, Hosav «Настройки интерфейса» | appears and disappears; owner: «Она должна отображаться только на табе хаба "Снаряжение" а на других табах эта кнопка не нужна» | `W_UI_SettingsButton_C` added to the viewport, visibility toggled by Hosav on some event | show only with the Equipment tab — native | open |
| 17 | Hub, several mods (e.g. Era of Trials magic school icons in the character view) | elements appear and disappear with a delay; owner: «появляются и исччезают разные элементы ХАБА с задержкой · по разным модам · это проблема того, как они инжектируются» | mods inject widgets into the hub on a timer/delay after it opens (hypothesis; 3.0 hub sends no inventory module events — log 10:11–10:15 shows only `XCS_Panel`, `ExilesFishingTuning`) | native: zero the delay constants in the mods' assets | open |
| 18 | EAA menu button tooltip «Открывает меню EAA» | plain grey UMG tooltip, owner: «поп-ап подсказка не в стиле игры - нужно в стиле игры сделать» | `ToolTipText` of the button instead of the game's tooltip widget | native: the game tooltip widget in the asset | open |
| — | Hero name «еуые» on the inventory panel, floating name, paperdoll | not a defect: the test character's name («test» typed in the Russian layout) | — | — | fine |
| — | Building placement at max zoom (twin of 11) | owner 09:4x: «костёр смотрит и следует ровно за прицелом» | — | — | fine, not broken |
| 7 | Parameters tab, magic school icons (Era of Trials) | tooltips English: «Entropic magic is dark, deceitful, and unfair…», «You have {0} Entropic Amp…» (six schools + Readiness) | string literals in blueprint bytecode of `EoT_W_CharInfoMagicDisplay` — not FText, `.locres` cannot reach them (class of Svarog bug 28; Hosav precedent — interview_003) | — | open |

## Item 11 — the camera-relative searches (twin check, owner's question «какие ещё поиски в игре есть, и они могли сломаться»)
The game builds the interaction ray in `FunCombat_PlayerController_C::GetLineTraceStartAndEndFromCamera(Distance)` — start = the camera,
direction = screen centre (the crosshair). Every distance measured along it was sized for the vanilla camera at 200 cm. Read 2026-10-26
from the live controller / hero / build system (pult, reflection only):

| Search | Value | Camera-relative? | State |
|---|---|---|---|
| interact (branches, chests, notes, water — `UpdateHighlightTarget`) | `InteractionDistance` 330 + `InteractionDistanceThirdPersonBonus` 55 | yes (direct call: start = camera) | compensated by the camera mod |
| stones, fibre (foliage instances) | `PickupInteractionDistance` 25, sphere 200 — native `PickupGatheringOneInstance` | yes (owner: «ветки берет, камни - нет»; 1450 by hand → «сейчас коррекно») | compensated by the camera mod |
| lenient check after the hit | `dw.BaseLenientInteractionDistance` 500 — hit point ↔ HERO (`InteractionLenientDistanceCheck`) | no | fine |
| world widgets | `WidgetInteraction` on `CameraThirdPerson`, `InteractionDistance` 2180 at arm 1680 | game recomputes it (arm + 500) | fine |
| building placement | `BuildSystemComponent::m_BuildRange` 2000, `m_DestructRange` 5000 | to test — owner asked 09:45 | open |
| thrall commands | `CommandRange` 3000, radius 50 | probably (trace from camera) — test | open |
| target lock, engagement, cries for help | `TargetLockRange` 2500 etc. | hero-relative | fine |

Wrong attempts, kept so nobody repeats them: camera pitch/raise to 0 — no effect; `TraceOrigin` (arrow on the hero's head) re-attached to
the camera — broke third-person interaction completely (reverted).

## Process diagnosis (why the owner found them, not the agent)
The smoke checked the loader (64/64 mounted, 63 controllers) and one HUD frame; no tab, no mod window, no tooltip was walked; nothing
measured overlaps; untranslated text was searched only among FText entries, never among bytecode literals. Remedies — mechanical:
1. untranslated literals: scan every extracted mod for English sentences absent from `all-mods-ftext.csv`, per mod;
2. overlaps and clipping: pult script over visible text/button widgets — screen rectangles, pairs from different mods that intersect,
   texts whose desired width exceeds their slot;
3. a window walk with frames is part of every mod smoke (TC case list), done by the agent.

## Decisions made without the owner
- `[AI]` «Ясно» for the Simple Minimap tutorial button (fits 5 letters; «Закрыть» does not).
