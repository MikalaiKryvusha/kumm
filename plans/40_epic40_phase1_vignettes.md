# Plan 40.1 — screen-edge vignettes (hunger, thirst, low health): three shkalas in «Моды Krinik'а», far left = off, shipped defaults

> **Created:** 2026-11-01 · **Parent:** `plans/40_EPIC_conan_1.0.0_unfinished_six.md` phase 1 (criterion 1); plan 39 B1; plan 36 W23
> **Status:** written 2026-11-01 by a helper agent at the chat close; nothing of it started — step R1 is next
> **Outbound:** the «barely visible» health value is the owner's taste — a review folder with three candidate strengths (step T6)

Basis, verbatim: `[OWNER]` 2026-10-30 ≈08:25 «мерцающая виньетка вокруг контура хкрана при голобе, жажде или нижком здоровье - должна интенсивность
регулироваться ползунком. Крайнее левое положение ползунков - ВЫКЛ полный соответствующей виньетки» · 2026-11-01 13:20 «по умолчанию в поставлке сборки
виньетки голота и жажды ВЫКЛ, виньетка нижкого здоровья тусклая, типа 10% или на каком значении она едва заметна».

## Goal vector (Achieve)

Today the game draws a flashing vignette around the screen edge on hunger, thirst and low health, and nothing of ours touches it; the 10-31 hub mockups showed
three rows «Виньетка: голод», «Виньетка: жажда», «Виньетка: мало здоровья» with no code behind them (plan 39 D5). Where we want to be: three shkalas on the
KrinikConanUI page of the hub; each scales its vignette's strength from 0 (fully off) to 100 % (the game's own look); a fresh install ships hunger 0, thirst 0,
low health at the value where it is barely visible; the strength changes on «Сохранить» without a restart and survives one; the section costs nothing while
no vignette is shown (HOUSE_RULES rule 7).

## Acceptance criteria (scenario form)

1. **Defaults — hunger.**
   - Situation. A fresh `Saved/KrinikSettings.lua` (no `ui_vig_*` key); the hero's food at 5 %, water 100 %, health 100 %, noon.
   - Action. The agent waits 10 s with no input.
   - Result. No hunger vignette on the screen edge in any of 5 frames over 10 s.
   - Check. `capture-window.ps1` ×5 → `edge-band.py` prints edge-band red excess ≤ the control frame (food 100 %) + 2 (0–255 scale) for all 5.
2. **Defaults — thirst.** As 1 with water at 5 %, food 100 %. Check: the same script, same bound.
3. **Defaults — low health.**
   - Situation. Fresh store; health at 15 %, food and water 100 %.
   - Action. The agent waits 10 s.
   - Result. A vignette is present but faint: its edge-band excess is > 0 and ≤ the value fixed at T6 by the owner's pick.
   - Check. `edge-band.py` over 5 frames: max excess in (2, N_T6]; the section's log line «виньетка здоровья: сила 0.10 (store default)».
4. **Each shkala scales its vignette** (one scenario per shkala: hunger, thirst, health).
   - Situation. The stat of that vignette at 5 % (health 15 %); the shkala at 0.
   - Action. The player moves the shkala to 50 % and presses «Сохранить».
   - Result. The vignette appears at about half the strength it has at 100 %.
   - Check. `edge-band.py` excess at 50 % within 35–65 % of the excess at 100 % (frames at 0, 50, 100 for each shkala); log «виньетка <name>: сила 0.50».
5. **Far left = off.** Situation: the stat at 5 % (health 15 %), shkala at 100 %. Action: the shkala to the far left, «Сохранить». Result: no vignette.
   Check: `edge-band.py` excess ≤ control + 2; the remote reads the vignette widget `GetVisibility()` = 1 (Collapsed) or its strength 0.
6. **Persists.** Situation: shkalas saved at 30 / 60 / 20. Action: the game is restarted. Result: the same strengths in the window and on screen.
   Check: `cat Saved/KrinikSettings.lua` has `ui_vig_hunger = 0.3`, `ui_vig_thirst = 0.6`, `ui_vig_health = 0.2`; the hub rows read by the remote; frames.
7. **No cost in play.** With all stats at 100 % the section runs no handler; with a vignette shown its worst handler ≤ 0.1 ms.
   Check: the section's minute summary in `UE4SS.log` — `n=0` with no vignette; `worst ≤ 0.10 ms` with one (game in front, phase 5 conditions).
8. **The three rows are in the window with «i».** Check: frame of the KrinikConanUI page at 1080p; the remote reads the texts of `Txt_KrinikLbl_ui_vig_hunger`, `Txt_KrinikLbl_ui_vig_thirst`, `Txt_KrinikLbl_ui_vig_health`.

## The stand (HOUSE_RULES rule 11)

| Part | Value | Set up by |
|---|---|---|
| Save | the live save (any; rule 6) — the 2026-10-31 16:56 copy if world entry breaks | `bash _config/save-restore.sh "D:/Games/Conan Exiles Mods/_save-backup/2026-10-31_1656-before-manager-check"` |
| Place | open ground, no enemies, companions or buildings within 60 m, plain sky at the edges of the frame | teleport by the remote + `bash _config/tp_ground.sh` (recon its arguments: `head -20 _config/tp_ground.sh`) |
| Time, weather | noon, clear | `pult.sh "lua FindFirstOf('BP_TimeOfDayManager_C'):SetTimeOfDay(12.0)"`; weather — recon the clear-weather call in `GAME_ARCHITECTURE_INTERNAL_MAP.md` (bench `clear=true`) |
| Hero | god on; food / water / health set per case and READ BACK | `bash _config/god-on.sh`; `h=p:GetHungerSystem(); h.FoodCurrent=5.0; h.DrinkCurrent=100.0` (the direct write holds, `AddFood` does not — game map); health — recon R4 |
| Creature | none | — |
| Input | none during a frame series (the idle vanity camera starts ≈ 2–4 min without input — keep series < 2 min) | — |
| Control frame | the same spot with all stats at 100 % | same calls |

## Steps

### Recon (≈ 2 h)

- [ ] R1. **What draws the hunger / thirst vignette.** Kit probe, read-only: `KIT_WIDGETS='W_FullScreenEffectContainer;W_FullScreenBuffEffect'
      "<UnrealEditor-Cmd>" … -run=PythonScript -Script=_config/devkit/kit-probe-tree.py -ModDevKit -NullRHI` → `kit-probe-tree.json`: the tree, the
      Image brushes (texture or material), opacity fields. Record: does the strength live in `RenderOpacity`, `ColorAndOpacity`, or a material parameter.
- [ ] R2. **Who drives it.** Bytecode of both widgets: `retoc-5.8 to-legacy --version UE5_7 --no-shaders --filter W_FullScreen <_paksview-3.0.1> <scratch>` →
      `uaj exports … VER_UE5_6` → `UAssetGUI tojson … VER_UE5_8` → `python -I -X utf8 _config/devkit/kismet-trace.py <asset> <exports.tsv> <json> <function>`
      for every function that sets opacity / plays an animation; note the buff → texture mapping (`T_BuffFullScreenEffect_HungerThirst` and the four
      temperature textures) and whether hunger and thirst share ONE widget instance (one texture «HungerThirst» — then two shkalas need a rule: strength =
      max of the active buffs' shkalas — write it into the notes).
- [ ] R3. **Live, hunger.** Stand as above, food 5 %: `pult.sh "lua for _,w in ipairs(FindAllOf('W_FullScreenBuffEffect_C') or {}) do print(w:GetFullName(),
      w:GetVisibility(), w.RenderOpacity) end"`; frames at food 5 %, 1 %, 0 %. **Find the threshold** at which the game starts the vignette — if vanilla shows
      nothing at 5 %, criterion 1–2's Situation moves to the first share where vanilla shows it (a justified Check edit, recorded in the commit — REQUIREMENTS
      rule 7) and the owner is told in one line.
- [ ] R4. **Low-health vignette — locate it.** (a) `retoc-5.8 list` over the 3.0.1 paks `| grep -i "lowhealth\|LowHP\|damage.*screen\|vignette\|FullScreen"`;
      (b) `UIMod_Hosav.md` — does Hosav's HUD draw its own low-health effect; (c) live: set health low — find the setter first: `pult.sh "funcs
      BasePlayerChar_C"` / the hero's health component `funcs` (record the call that works and its read-back in the game map, «Читы прогона» block); then
      `FindAllOf` over `W_FullScreen*` and any post-process material on the camera (`PostProcessSettings` WeightedBlendables) at health 15 %.
- [ ] R5. **The event to hang on.** A post-hook on the widget's own show/update function found in R2, or `NotifyOnNewObject` on its NATIVE parent class if the
      BP class is not loaded at mod start (trap paid 2026-11-01, `CorpseBase`). No poll (rule 7). Record in `KrinikConanUI.md`.
- [ ] R6. Write the findings into `games/ConanExiles/mods/KrinikConanUI.md` (new subsection «Vignettes») and the game map line; plan 36 W23 row → «recon done,
      route <X>» — same commit (rule 2).

### Implementation (≈ 1.5 h)

- [ ] I1. **Section** `ConanExiles/_unpacked/KrinikConanUI/ue4ss/Scripts/krinik_vignette.lua`: on the R5 event, per vignette instance: strength k =
      `settings.get("ui_vig_<hunger|thirst|health>", default)`; k = 0 → `SetVisibility(1)` (Collapsed); else the R1 property × k (opacity or material scalar
      via `GetDynamicMaterial():SetScalarParameterValue`). `settings.on_change` re-applies to live instances. `os.clock` around handlers, a minute summary
      `n / sum / worst` with its OWN error counter. Required from `main.lua` by `pcall(require)`.
- [ ] I2. **Defaults** in the section and in PAGES: `ui_vig_hunger` 0, `ui_vig_thirst` 0, `ui_vig_health` = the T6 pick (start value 0.10).
- [ ] I3. **Hub rows** in `krinik_mod_settings.lua` PAGES, page `ui`: three sliders, min 0, max 1, step 0.05, `scale = 100`, `unit = " %"`, labels from the
      mockup rows (plan 39 D5), «i» texts written after reading `researches/russian-writing/RUSSIAN_RULES.md` (russian-gate), the word «шкала» (rule 21),
      and «0 — виньетка выключена» in the info.
- [ ] I4. **Kit rows:** `_config/devkit/kit-krinik-modsettings.py` line 116 — append `("ui_vig_hunger","slider"), ("ui_vig_thirst","slider"),
      ("ui_vig_health","slider")` to the `ui` tuple; run the kit script TWICE (`-NullRHI`, GUID trap; report `kit-krinik-modsettings.json` «0 errors» on the
      second run); `python -I -X utf8 _config/devkit/kit-buildmod.py KrinikConanUI <out>`; copy the pak into `_unpacked/KrinikConanUI`;
      `python -I -X utf8 _config/mod-overrides.py <out.tsv> <pak>` lists `W_KrinikModSettings`.
- [ ] I5. Hygiene: `lua -e "assert(loadfile('…/krinik_vignette.lua'))"`; `python -I -X utf8 _config/check-lua-game-thread.py` → 0;
      `python -I -X utf8 _config/devkit/check-lua-templates.py` → 0; `lua _config/tests/test_krinik_settings.lua` green.
- [ ] I6. **Measuring tool** `ConanExiles/_config/edge-band.py <frame> [--control <frame>]`: mean of (R − (G+B)/2) over a band of 6 % of the frame's height
      along all four edges, minus the same over the centre third; prints one number. Desk test: a synthetic frame with a known red band.

### Test in the live game (≈ 1.5 h)

- [ ] T1. Cases V1–V10 (criteria 1–8 + the window frame + a restart) written FIRST into `testcases/TC_conan_vignettes_<YYYY-MM-DD>.md` (date = the day they
      are written; the testcase-gate refuses a run otherwise), with the stand block above.
- [ ] T2. `node D:/work/ai_sandbox/_tools/machine-lock.mjs take --who kumm --what "epic40 p1 vignettes" --minutes 60`; deploy (packaging step P2);
      `powershell -File _config/launch-bg.ps1` (or `launch-fg.ps1` by the owner's last word, rule 16); `bash _config/enter-world-remote.sh`.
- [ ] T3. Per case: stand calls, 5 frames `powershell -File _config/capture-window.ps1 -Out <scratch>/v<N>_<i>.jpg`, `edge-band.py`; the hub rows moved by the
      REAL mouse (`mouse-seq.ps1 -Seq "move:<fx>/<fy>,ldown,move:…,lup"` after `wait-input-idle.ps1 -Min 10`), «Сохранить» clicked.
- [ ] T4. A 20 s clip of one vignette going from 100 % to 0 % (rule 4): `bash SvarogsDream/tools/rec_clip.sh vignette_off 20 "<remote command>"`, HDR off first;
      watched before the verdict.
- [ ] T5. Restart case: `powershell -File _config/close-game.ps1` → relaunch → frames; then release the lock.
- [ ] T6. **The owner's pick:** frames of low health at 5, 10, 15 % strength side by side → `НА ОТСМОТР НИКОЛАЕМ/<N> виньетка здоровья/` (WebP, native 4K,
      «что смотреть» note), opened by `Invoke-Item`; the pick sets `N_T6` and the shipped default.
- [ ] T7. Run report `testcases/reports/<YYYY-MM-DD>_conan-vignettes.md` (TESTING_FRAMEWORK «An executed run produces its report»).

### Packaging into the build (≈ 0.5 h)

- [ ] P1. Source: `ConanExiles/_unpacked/KrinikConanUI/ue4ss/Scripts/krinik_vignette.lua`, `main.lua`, `krinik_mod_settings.lua`, the rebuilt
      `KrinikConanUI.pak` (git-ignored, rebuilt by I4), `_config/devkit/kit-krinik-modsettings.py`, `_config/edge-band.py`.
- [ ] P2. `modpack.json` entry `KrinikConanUI`: add `…/Scripts/krinik_vignette.lua` to `verify`; one sentence in `$comment_merge`.
      `powershell -File D:/work/ai_sandbox/KUMM/Deploy-ModPack.ps1 -PackDir D:/work/ai_sandbox/ConanExiles -Deploy -Only KrinikConanUI` then
      `… -Verify -PackDir …` → exit 0.
- [ ] P3. Same commit (rule 20): `KrinikConanUI.md` (section row + store keys), plan 36 W23 → DONE with the report, plan 39 B1, the guide
      `ConanExiles/docs/guide/guide-3.0.1.html` (the «Моды Krinik'а» rows), the hub mockup rows marked «работает» (rule 23). Pack commit + `git push origin main`;
      KUMM commit + push.

## Risks

- (a) Strength is baked in a material with no scalar parameter → the widget's `RenderOpacity` × k (coarser, but 0 still = off).
- (a) Hunger and thirst share one widget / texture → one strength for both while both are active; the rule (max of the two) goes into the «i» text.
- (a) The low-health effect is a camera post-process, not a widget → the strength is the blendable's weight; the event is the health change, not a widget birth.
- (b) Vanilla starts the vignette below 5 % → criterion 1–3 Situation moves (R3), owner told.
- (b) A new row makes the page taller than `MIN_HEIGHT` 845 → re-check the window at 720p (phase 6 also frames it).
- (c) The idle vanity camera hides the HUD mid-series — series under 2 min, or `EnableVanityCameraMode(false)` by the remote.

## Effort

≈ 5–6 h: recon 2 h · implementation and kit 1.5 h · live test 1.5 h · packaging and documents 0.5 h. Plus the owner's pick (T6) — his time.
