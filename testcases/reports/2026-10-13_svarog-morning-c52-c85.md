# Test run report — Svarog's Dream: night build check and owner's live UI review (C52–C85)

**Created:** 2026-10-13 09:37 +03:00 · **Run by:** the agent (Claude Opus 5.5), owner watching and reviewing live ·
**Version/build:** SvarogsDream `3f53c37` → `62a50d0` (KrinikUIRework hot-deployed after each fix; three full restarts)

## 1. Work

The night build of 2026-10-13 (pulse 10 s, minimap arrow A, class badge → Mastery, buff/effect translations, SSPR defaults, water
surface setting) and every fix the owner asked for during the run (popup font back to Manrope + weight, glued numbers, attribute
pieces translated, Mastery header hover zone, colours by meaning, bag tint, almanac jump, bag outline, "Sort" label). Case set:
`testcases/TC_svarog_hero_card_2026-10-12.md` C52–C85, K1.

## 2. Contour

Svarog's Dream on the owner's machine, owner's save (Ironman) restored to `_backups/svarog-saves-2026-10-13_0049-quit` after every
kill; 4K fullscreen, DX11. REAL WORLD: accumulated — the owner's own save and settings; data and machine — his PC, his game install;
path — the same game window he plays in (he was playing alongside during the run).

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-10-13 08:12 +03:00 | `bash tools/run-game.sh` | 0 · world loaded, night field |
| 2 | 2026-10-13 08:58 +03:00 | `bash tools/h.sh "kill"` + `SAVE_POINT=… bash tools/save-check.sh --restore` + `bash tools/run-game.sh` | 0 · restart for clean checks |
| 3 | 2026-10-13 09:33 +03:00 | `bash tools/h.sh "kill"` + `save-check.sh --restore` + `run-game.sh` | 0 · restart (hot reload left the old card) |
| 4 | 2026-10-13 09:35 +03:00 | `bash tools/h.sh "kill"` + `save-check.sh --restore` + `run-game.sh` | 0 · restart for C84 |
| 5 | 2026-10-13 09:36 +03:00 | `bash tools/h.sh "kill"` + `save-check.sh --restore` + `bash tools/reg-snap.sh restore` | 0 · game closed, save 10/10 |

Between runs: `bash tools/deploy-hot.sh KrinikUIRework` after each fix; probes by the harness (`shot`, `dump`, `callon`), real mouse
(`tools/mouse.ps1`), screen video (`ffmpeg ddagrab` 60 fps) for C72 and C83.

## 4. Checks

Hygiene: build of KrinikUIRework green on every deploy; `node .kaif/tools/kaif-experience-lint.mjs check` 0 findings
Functional run: the agent walked the owner's game — hero card, buffs, Mastery, bag, map, events, almanac — on the owner's save, READ
in-engine frames (`shot`), the UI tree (`dump`), the BepInEx log and screen videos; the owner judged taste live («хорошо»).

| Case | Status | Observation |
|---|---|---|
| C52 | pass | outline red channel 31.5 → 41.8 → 16.4 → 33.3, half period ≈5 s |
| C53 | pass, then cancelled by the owner | Gabriela/Manrope roles in `dump`; owner: «рукописный не подходит им» |
| C54, C55 | skipped | cancelled by the owner |
| C56 | pass | default true, both Lux cameras cullingMask 0 |
| C57 | partial | (night run) not re-checked |
| C58 | fail → C65 | arrow tinted dark by GameSettingsManager |
| C59 | pass | badge click → Mastery, hover → class popup |
| C60 | partial | «Истощение», «Ведомый Ветром», «В Воде» Russian; «Промокший» needs rain |
| C61 | partial | two epitaphs Russian; other glue not met |
| C62, C63 | blocked | water by day not reached |
| C64 | partial | 12 bag items Russian; no special-effect items in the bag |
| C65 | pass | (96,218,97) from the first frame after restart |
| C66 | pass | one «name wrapped» line per open |
| C67 | pass (then superseded by C69) | Gabriela marks reached native popups |
| C68 | pass | red / yellow `#E8C66A` / green in the buff tooltip |
| C69 | partial | Manrope Bold in buff and skill popups; card tips not re-shot |
| C70 | pass | «100 урона» wraps together |
| C71 | pass | icon and caption open the class description |
| C72 | fail | title white ≈0.47 s on skill-to-skill hover → bug 42 |
| C73 | partial | «Не хватает…» `#E8C66A` |
| C74 | partial | strips inside the frame on 4K |
| C75 | partial | LevelupText x = separator x (265) |
| C76 | pass | «Сила ×5 Интеллект ×1 Храбрость ×3» |
| C77 | pass | Bold three shows in a row |
| C78 | pass | bottom margin ≈30 vs top ≈38 |
| C79, C82 | pass — owner's eye | world −30 %, card −10 % («хорошо») |
| C80 | pass | all 8 map time texts Gabriela |
| C81 | not run | events date columns |
| C83 | partial | no jump; one height; width still varies |
| C84 | pass | «Сортировать» dx 49 to the slot column |
| C85 | pass | outline (0.77, 0.64, 0.38) |
| K1 | pass | save 7/7 game files (10/10 with logs) after every kill, registry restored |

## 5. Found

- The game re-tints the minimap arrow on every settings apply (fixed, C65).
- Native popups styled through `Plate` never reached `HandTexts` (fixed, C67) — later the owner cancelled handwriting in popups.
- Weight step accumulated per show (fixed, C77); buff tip trailing newline and late line spacing (fixed, C78).
- XUnity's cache translates the wrapper and leaves colour-tag pieces English (fixed in instant translation, C76).
- Almanac page shown in the game layout for one frame before ours (fixed, C83).
- Bug 42 — skill title white then red (open).
- Hot reload leaves components of the previous build — verdicts only after a restart (EXP-0239).

## 6. Traces

Frames and sheets — `SvarogsDream/_harness/` (c52_*, c58_*, c65_*, c60_*, r_buff_*, sp_*, c76*, c71_c74_sheet, dm_sheet, s8, c84c_crop,
c85_crop); videos — `_harness/c72/hover.mkv`, `_harness/c83/gods.mkv`; log — `D:/Games/Svarog's Dream/BepInEx/LogOutput.log`.

## 7. Verdict

partial — most cases pass on the owner's save and two taste calls were accepted by the owner live; C62/C63 (water by day), C81, the
rest of C83 and bug 42 remain open.
