# Run report — the first-person shadow always: the head and the sheathed bow hidden only from the player's own eyes, the camera never in the neck or the collar

## 1. Work

KrinikConanCamera, first-person section, after the owner's words 2026-11-22 13:10–13:11 (verbatim in `bugs/114_conan_hero_shadow_without_head.md`): the
neck-bone hide above 70° is a crutch — the shadow must exist always, from any light; the game is multiplayer — other players see the bow and every body part;
for the player himself the head and the bow on the back may be invisible but cast a shadow. Basis: the case set `testcases/TC_conan_fp_shadow_always_owner_no_see_2026-11-22.md`
(S1–S7, N1–N3) and the recon `researches/first-person-body-camera/README.md` §4.

## 2. Contour

The build `D:\Games\Conan Exiles 3.1.1` (0.9.1-RC3 bytes + the pack's working tree), background path (`launch-bg.ps1`), the machine lock `kumm`; the dry beach
`-82309 231568 -20000`, 10:00, god on; quick slots: the hunting bow 51405, the stone hatchet 51011; the chest piece 52442 «Нагрудник егеря». Code versions:
v1 (deployed 13:36), v2 (judge round 1 fixes, 13:46), v3 (judge round 2 fixes, 13:5x).

## 3. Runs

| # | Moment | Command | What it did |
|---|---|---|---|
| 1 | 2026-11-22 13:15–13:31 | `pult.sh "lua return dofile([[D:/work/ai_sandbox/KUMM/.work/tmp/fp_nosee_try.lua]])"` (`_G.__fnt` read / on), `KUMM/.work/fp_nosee/shot.sh`, `exec r.SetNearClipPlane <n>`, `AdjustableCamera:K2_SetWorldLocation(…)` by the remote | the live experiments before the code: owner-no-see + hidden shadow on the sheathed bow; the neck at 74–85° with no weapon, the bow, the axe, combat mode, the chest piece; near clip 15–60; the camera forward 5–20 cm |
| 2 | 2026-11-22 13:37–13:42 | v1: `MODE= bash shot.sh <name> <pitch> <yaw>`, `weapons_now.lua`, `exec suicide` | S1–S7 on v1 |
| 3 | 2026-11-22 13:48–13:52 | v2: the same commands | S1–S7, N1–N3 on v2; the per-frame cost by 2000 repeats in one remote call |
| 4 | see section 8 | v3: the same commands | the regression on v3 |

## 4. Checks

Hygiene: `luac -p main.lua` OK; `luac -l -l` — no new global writes (only the old `hold_calls`); `check-lua-game-thread.py` 0 worker-thread calls; three
independent judge rounds (findings in section 5).
Functional run: S1–S7 and N1–N2 walked on v1 and v2 in the real game by the remote on the background path, the frames read by eye and the flags read from
the live components (the case set's Seen column); N3 partial (the drawn aim needs a held right mouse button).

| Case | v1 | v2 |
|---|---|---|
| S1 shadow of the head, the bow and the axe; the bow not in the view | pass | pass |
| S2 no collar at 55 / 70 / 78 / 85, push 0 / 7.5 / 10 / 10 cm, the neck never hidden | pass | pass |
| S3 the axe in hand casts a shadow | — | pass |
| S4 the bow drawn: visible, flags off | pass | pass |
| S5 third person after looking up: the bow visible, the camera back to 0 | pass | pass |
| S6 the idle orbit: the bow visible, the head on, the camera 0 | pass | pass |
| S7 death in first person and respawn: no error, the push resumes | pass | pass |
| N1 third-person camera | — | pass |
| N2 «E Взять» in first person | — | pass |
| N3 the bow in hand in the view | — | partial (held, not aimed) |

The per-frame check costs 6.5 µs (2000 repeats of the tick's reads in one remote call) — 0.65 % of the 1 ms budget of all mods. The camera component does not
replicate (`bReplicates` false).

## 5. Found

- The morning's claim «OwnerNoSee removes the shadow too in this game» was wider than its probe (OwnerNoSee + CastShadow only) — corrected in five places (EXP-0610).
- The morning's «neck skin at 78–85°» was the medium armour's collar; with no armour the neck never enters the view (EXP-0611).
- A sheathed weapon taken after the third-person record had no shadow at all (`cast false`) — fixed by the main-mesh rule.
- A held weapon has no shadow in first person (the game turns it off) — fixed.
- `player_hero()` took the first controller found — on a listen-server host it could be another player's — fixed (`IsLocalController`).
- A near-clip raise cuts the hand from 20 cm — rejected as a way.
- Judge round 1: 7 findings, all confirmed and fixed (lost OwnerNoSee after a reload, the exit restore keyed by a cleared name, shadows on dark-by-design
  meshes, a game-hidden weapon, a stale camera base, the neck call inside the camera block, a corpse's camera). Judge round 2: 1 bug and 4 risks confirmed and
  fixed (no resume after a reload in first person, the reset through a forgotten camera, clearing flags others set, the base read at entry, dark-in-third-person
  item meshes); its nit on the previous build's leftovers declined (that build was never released). Judge round 3 — section 8.

## 6. Traces

Frames `KUMM/.work/fp_nosee/` (sheets `sheet_c`, `sheet_e`, `sheet_f`, `sheet_i`, `sheet_j` — the experiments; `sheet_v2_s1`, `sheet_v2_s2s4`, `sheet_v2_s56` — the
v2 cases); `UE4SS.log` of the build (lines `[KrinikConanCamera] первое лицо (…)`, `камера от первого лица: …`); the probes `KUMM/.work/tmp/fp_nosee_try.lua`,
`weapons_now.lua`, `hotbar_list.lua`, `find_rows.lua`.

## 7. Verdict

partial — every case passed on v1 and v2 by the player's path (the camera, the flags, the frames); N3's drawn aim and a second player's client are not covered
(no second client on this machine — the code guard is the local-controller rule and the non-replicated flags); the owner's eye on the look is still to come.

## 8. v3 and v4 regressions

- **v3 (judge round 2 fixes), 2026-11-22 13:57–13:59:** S1 (bow `noSee true · hidSh true`, the axe `cast true`, frame `v3_s1_p-40_y180.jpg` — the full shadow),
  S2 (85° → `rel X 10`, frame `v3_s2_p85.jpg` clean), S5 and S6 (bow `noSee false`, `rel X 0`), S7 (death at 85 in first person → respawn in first person
  `rel X 0`, 80° → 10, 0° → 0) — pass; no mod error in `UE4SS.log`. After the death no bow actor remains in the world (`FindAllOf('BP_bow_2h_C')` → 0): the
  game destroys the weapon actors — the judge's «corpse bow keeps OwnerNoSee» risk does not arise.
- **v4 (judge round 3 fixes: the constant camera base, the neck unhide on first-person entry in its own pcall), 2026-11-22 14:04:** S1 (flags as v3, frame
  `v4_s1_p-40_y180.jpg` — the full shadow with the head, the bow across the back, the axe; the bow not in the view), the push 85° → 10, 0° → 0, S5 and S6 —
  pass; no mod error. Judge round 4 — in the commit message.
