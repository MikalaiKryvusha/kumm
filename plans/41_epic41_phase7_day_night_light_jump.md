# Plan 41 · phase 7 — day/night: the light and sky jump the owner saw, explained (and fixed if it is ours)

> **Created:** 2026-11-01 · **Parent:** `plans/41_EPIC_conan_1.0.0_defects_and_stability.md` phase 7; `researches/conan-day-night/README.md` (run 1 done, run 2 owed);
> `[OWNER]` 2026-11-01 10:42 «мне словно показалось, что такая же проблема в смене ночи и дня как в Свароге - что источники света резко включаются, и словно небо
> резко меняет вид» · «может мне показалось» · «нужно изучить»; 13:28 «Ночь и день: скачок света, который вы видели, не объяснён»
> **Status:** written 2026-11-01 13:30 +03:00; not started
> **Outbound:** the finding → the owner in chat with the clip; a fade of the game's lights is a feature — his word first

## Goal vector (Achieve)

Run 1 (a beach without lights, 2026-11-01 11:03–11:10) found no step of the sky, but many one-frame spikes at night (a creature fighting the god-mode hero,
a lightning-like sky flash at 01:02 — Severe Weather Enhanced storms a candidate) and did not test lights at all. The agent's own `SetTimeOfDay` jumps of
10:21–10:33 are the first candidate for what the owner saw. Where we want to be: an interference-free dusk and dawn at a place WITH the game's lights,
recorded at 60 fps; every visible step named with its cause — the agent's time jumps, the game's own light switch, a mod (Severe Weather's storms / light,
our KrinikConanGraphics), or nothing; a cause in our build fixed and re-run.

## Acceptance criteria

1. **Interference-free dusk.** Situation: a camp with torches / braziers, no hostile within 50 m (checked by the remote), god on, the hero still, one
   `SetTimeOfDay(17.5)` then no touch. Action: 60 fps clip across the lights-on hour + a frame every 2 s until full night. Result: the clip and the series.
   Check: `dusk_analyze` per-frame luminance (whole / sky band / ground / bright pixels) with no ground spike from combat.
2. **Every step named.** Situation: the series. Action: each luminance step > the run-1 median noise × 5 looked at by eye on its frames. Result: cause per step
   (light popping on — which actor; sky — which mod's event; lightning — weather). Check: the step table in the research README with frame paths.
3. **Lights' switch mechanism.** Situation: a camp brazier actor. Action: the remote reads its class and how it turns on (a time-of-day event, a per-light check,
   intensity animated or set). Result: written in the README and the game map. Check: `funcs` / `dump` output quoted.
4. **Dawn too.** The same at `SetTimeOfDay(4.5)` across sunrise. Check: as 1–2.
5. **Ours fixed.** If a step comes from our build (a mod's light / exposure / weather default): fixed natively, the same clip re-run shows no step. Check:
   before / after clips side by side.

## Stand (house rule 11)

- Machine lock (≈ 75 min — two passes of ≈ 25 min game time each at 55.2 min per game day); launch by the owner's last path; the game in FRONT for the
  60 fps clip (`ddagrab`), after `wait-input-idle.ps1 -Min 10`.
- Place: a camp with the game's own lights — recon: a known NPC camp / city with braziers from the game map (`games/ConanExiles/GAME_STRUCTURE_EXTERNAL_MAP.md`)
  or SPAWN braziers / torches in front of the hero by the remote (rule 11.5a) on the clear beach of run 1 (-78471, 245900) — spawning removes the enemies of a camp.
- Hero: god on (`god-on.sh`), still, camera fixed by the remote (no drift — rule 11.6); enemies within 50 m killed by the remote and checked again before the clip.
- Weather: one pass with Severe Weather Enhanced as shipped; if a flash is seen — a second pass with the storm forced off (`dc SW_config …`, recon of the
  command in `games/ConanExiles/mods/` notes / TC `TC_conan_night_vanilla_light_2026-10-29.md`).
- Time scale untouched (memory «время не останавливать»): no `timescale 0`, no slomo.

## Steps

- [ ] 1. **RECON — tools.** `dusk_analyze.py` of run 1 lived in a scratchpad and is gone (`find D:/work/ai_sandbox -name dusk_analyze.py` → nothing, 2026-11-01 13:30):
      rewrite it into `researches/conan-day-night/dusk_analyze.py` (Pillow, per-frame mean luminance of whole / sky band / ground, bright-pixel count, a CSV and
      a step list); a 60 fps clip → frames by `ffmpeg -vf fps=60`.
- [ ] 2. **RECON — what in our build touches light.** Mod notes `KrinikConanGraphics.md` (exposure / blood / any light), Severe Weather Enhanced (`light enabled =
      False` default since 2026-10-29 — TC night vanilla light), any `r.` cvar in our `Engine.ini` / `dw-cvars` (`games/ConanExiles/dw-cvars`) that alters
      auto-exposure (`r.EyeAdaptation*`, `r.DefaultFeature.AutoExposure`).
- [ ] 3. **Case file** `testcases/TC_conan_day_night_light_jump_<date>.md` — criteria 1–5 as cases, stand first.
- [ ] 4. **TEST IN THE LIVE GAME — dusk pass, dawn pass**; the clip and the series; the log read once at the end; frames of every flagged step looked at by eye.
- [ ] 5. **RECON — the light mechanism** (criterion 3) on a brazier: class, functions (`funcs <brazier class>`), the time-of-day hook.
- [ ] 6. **FIX (only if a step is ours)** — native default in our shipment (rule 8): the mod's own setting / cvar; Lua never on a timer (rule 7). A step that is
      the GAME's (lights popping on at a set hour) is not fixed here: written in the README with the clip, the owner told; a fade is a feature — an idea file
      (`/propose-idea`) only if he asks.
- [ ] 7. **TEST the fix** — the same pass re-run; before / after clips.
- [ ] 8. **PACKAGING (if step 6 changed something)** — the edited pak / config into the pack; `modpack.json` note; `.\Deploy-ModPack.ps1 -Deploy -Only "<Mod>"
      -PackDir D:\work\ai_sandbox\ConanExiles` (or `deploy-config.py <ini>`); `-Verify`.
- [ ] 9. **Records** — `researches/conan-day-night/README.md` (run 2, the step table, the verdict, status «done»), run report
      `testcases/reports/<date>_conan-day-night-light-jump.md`, review folder «НА ОТСМОТР НИКОЛАЕМ/<N> смена дня и ночи/» with the clips; plan 39 C line; same commit.

## Risks

- (a) The jump may have been only the agent's `SetTimeOfDay` — then the verdict is «not the game, my time jumps» with the interference-free clip as proof.
- (a) A camp's NPCs may fight the hero (run 1 was voided at night by a creature) — spawned lights on a cleared beach are the safer stand.
- (b) Auto-exposure adapts over seconds — a «jump» on a 2-s series may be a smooth 1-s change; the 60 fps clip decides.
- (b) The clip takes the owner's screen for minutes — split into ≤ 60-s clips around the expected switch hours, the rest by background frames.

## Decisions made without the owner

(filled at the phase's close)
