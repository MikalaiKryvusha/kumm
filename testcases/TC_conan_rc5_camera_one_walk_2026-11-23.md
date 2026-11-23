# Test cases — Conan 0.9.1-RC5: one walk per view switch in KrinikConanCamera (issue #53) and its neighbours

> **Created:** 2026-11-23 · **Parent:** `plans/62_conan_0_9_1_release_readiness.md` (step #53, the owner's word 2026-11-23 11:49) · issue #53
> **Status:** cases written 2026-11-23 12:12 +03:00, before the run

## Basis

- Issue #53: the first switch to the first-person view after world entry cost 2–4.5 ms (R53 of 2026-11-23 01:23, three walks of the hero's mesh tree in
  one event); the owner's budget is 1 ms of CPU for all mods in a gameplay frame, spikes included (`MASTER_PLAN.md`).
- The change: the shadow restore and the third-person record are merged into the pass (`fp_pass`); `EventOnThirdPersonChange` waits 0.1 s and is
  dropped when `SwitchToFirstPersonCamera` / `SwitchToThirdPersonCamera` already made its pass for the same hero and view.
- Control: R53 of `testcases/TC_conan_rc4_retest_published_2026-11-23.md` (the RC4 mod, the same game and save) — three pass lines per switch, 4.5 ms.

## Stand

The build `D:\Games\Conan Exiles 3.1.1` (RC4 mods), KrinikConanCamera `Scripts/main.lua` copied from the pack's source over the installed one (the owner's
`config.lua` untouched), the machine lock `kumm`. The cost is measured with the game IN FRONT (HOUSE_RULES 11.6f): `launch-fg.ps1`, the view switched by
the REAL key P (`mouse-seq.ps1` `kdown:P,wait:60,kup:P`), the idle camera off first (`EnableVanityCameraMode(false)`). God on by `god-on.sh`; the hour
10:00 (`SetTimeOfDay(10.0)`); the gear (bow 51402, stone hatchet 51011) spawned by the remote after `exec MakeMeAdmin` (`exec SpawnItem <id> 1`) — the
heroine of the owner's save lost hers on the R48 corpse (STATUS N2). Reads: the `[KrinikConanCamera]` lines of `ue4ss/UE4SS.log` (they arrive late —
read once after a wait), frames by `capture-window.ps1`.

Dimensions: the direction (third → first, first → third), the first switch after world entry vs later ones, the path (Switch* by the real key vs
`EventOnThirdPersonChange` alone — the idle camera), the neighbours of the pass (the shadows, the sheathed bow, a weapon change in first person). Not
covered: a respawn straight into first person and a mod reload in first person (the HUD-birth and load paths call `sync_view` directly — unchanged).

## Cases

| # | Situation | Action | Expected | Status | Observation |
|---|---|---|---|---|---|
| K1 | world entered, third person, the first switch of the session | the real key P | ONE pass line «первое лицо (вид: первое лицо)» with «тень возвращена N», N ≥ 1, and no pass line «(вид: смена лица)» for this switch; the camera's lines of the switch span ≤ 1 ms by the log stamps | **pass** (12:14:51, the game in front) | one line «первое лицо (вид: первое лицо): тень возвращена 8 · невидимым своим дана тень 2 … просмотрено 22; ошибок 0; 1 мс», no «смена лица» line; R53 (the RC4 control) had three lines over 4.5 ms. The span of one line is not measurable by stamps — the precise time is K3's |
| K2 | first person | the real key P | ONE pass line «(вид: третье лицо)» and «тень: записано … (вид: третье лицо, в том же обходе)», no «смена лица» pass; span ≤ 1 ms | **pass** (12:15:1x) | «тень: записано сеток с тенью 9, своих видимых 8 (вид: третье лицо, в том же обходе)» — the same 9 / 8 as the HUD-birth record; the pass «просмотрено 20; ошибок 0; 0 мс»; 0 «смена лица» lines |
| K3 | third person | ten real presses of P, 3 s apart | every switch: one pass line; the worst span of the ten ≤ 1 ms (the owner's rule counts spikes) | **fail** (12:20:53–12:21:22) | a temporary log line at the pass start in the GAME COPY only (stamps resolve 0.1 µs; os.clock steps 1 ms): every switch ONE pass, 0 «смена лица»; the pass 1.812, 1.271, 1.459, 1.361, 3.063, 0.985, 0.860, 0.972, 1.306, 0.781 ms — mean 1.387, max 3.063 (`.work/rc5/k3_lines.txt`). Micro-benchmarks in the same game (`.work/rc5/walk_bench.lua`, `write_bench.lua`): one walk of the 23 nodes with the pass's reads 0.1–0.35 ms, SetCastShadow 0.02 ms — the walk and the writes do not explain 1.4 ms |
| K3b | third person | ten real presses of P; the temporary probe also logs the Lua heap, a line after the walk, and STOPS the garbage collector during every second pass | where the time goes: the walk (start → «обход готов») vs the rest; the passes with the collector stopped vs running | **done** (12:25) | the walk is the pass: walk 0.62–1.27 ms of total 0.67–1.38 ms; the collector stopped (1.236, 1.112, 1.098, 0.817, 0.844, 1.060) vs running (1.377, 1.141, 0.998, 0.665, 0.758, 0.798) — no difference; the heap 572–775 KB; the passes get cheaper after the first ones (`.work/rc5/k3b_lines.txt`). The walk's string work (full names of owners and of every parent up to the sheath) is the suspect → the owner and leader checks moved to addresses |
| K3c | third person | twelve real presses of P on the address-based pass (probe: pass start, walk done) | every pass ≤ 1 ms | **fail** (12:28:4x) | 0.788–1.296 ms, mean 1.152 — no gain from addresses (`.work/rc5/k3c_lines.txt`); the address change is reverted. One walk costs ≈ 1 ms in the mod's hook (the remote's benchmark of the same walk: 0.1–0.35 ms — the gap is not explained) |
| K8 | the clean pack script after the judge's round 1 (the record after the first-person pass, the restore inside the per-mesh protected call, the deferred event keeps its hero), no probe | P → first person, P → third person, then `SetThirdPerson(true)` from first person | K1, K2 and K7 hold: one pass per switch with «тень возвращена N» / «записано … в том же обходе», one «смена лица» pass for the event alone | **pass** (12:38:00–12:38:11) | «(вид: первое лицо): тень возвращена 10 · просмотрено 25» · «тень: записано сеток с тенью 11, своих видимых 8 (вид: третье лицо, в том же обходе)» + one pass · first person again one pass · `SetThirdPerson(true)` → one «(вид: смена лица)» pass; no error line. God off in the save after the run (`god-on.sh off`), the game quit by `exec quit`, no crash window |

| K9 | the script after the judge's round 2 (the deferred event checked by data before its object is touched; the map load forgets it), a fresh world entry (a map load) | P → first person, P → third person, then `SetThirdPerson(true)` from first person | as K8: one pass per switch, one «смена лица» pass for the event alone, no error line, no «отложенный проход отменён» line | **pass** (13:00:39–13:00:50) | «(вид: первое лицо): тень возвращена 10 · просмотрено 25 … 4 мс» (the first switch after the world entry, os.clock steps 1 ms) · «записано … 11, 8 (вид: третье лицо, в том же обходе)» + one pass · first person one pass «2 мс» · `SetThirdPerson(true)` → one «(вид: смена лица)» pass; no error, no «отменён» line; god stayed off in the save |

## Verdict

One walk per view switch in both directions and for the idle-camera event (K1, K2, K7, K8), the neighbours hold (K4–K6). The switch costs 0.67–1.38 ms
(K3, K3b, K3c; the RC4 control: three walks, ≈ 3–4.5 ms) — the 1 ms is not reached: one walk costs ≈ 1 ms in the mod's hook, and neither
the collector nor the full-name strings explain it. **Accepted** by the owner 2026-11-23 12:44: a view switch is a one-off action, outside the 1 ms budget,
which binds what happens often in the flow of play (`MASTER_PLAN.md`).
| K4 | first person, 10:00, the sun behind | the view pitched −55 at yaw 180 | the ground shadow shows the head and the shoulders (a frame looked at) | **pass** (12:16) | `.work/rc5/frames/k4_fp_down_yaw180.jpg`: the shadow on the sand shows the head and the shoulders |
| K5 | first person, the bow sheathed (the hatchet in hand) | the view pitched up 60° | no bow in the frame; in third person (control) the bow is on her back | **pass** (12:16:5x; control — R4 of the RC4 retest) | `.work/rc5/frames/k5_fp_up_hatchet.jpg`: the hatchet in hand, sky and palms, no bow; the pass «оружие взято … убранного скрыто от глаз 2 … корней обхода 3; просмотрено 9» |
| K6 | first person | the hero's weapon slot changed (hatchet → bow) | the pass «оружие взято» walks only the attached actors («корней обхода N»), the bow is visible in hand — N2 of STATUS | **pass** (12:17:09) | «оружие взято … возвращено 2 … корней обхода 2; просмотрено 7; 0 мс»; `fp-shadow-flags.lua`: `BP_bow_2h_C · SkeletalMeshComponent · sock Socket_Bow · vis 1 · noSee 0` — in the hand, visible, the owner sees it. The frames (`k6_*.jpg`) do not show the bow: the neutral first-person stance holds it below the view (issue #52, deferred by the owner); a draw was refused «Нечем стрелять» (no arrows spawned) |
| K7 | third person, no Switch* | the remote fires the view event alone (`EventOnThirdPersonChange` through `SetThirdPerson` or the idle camera) | one pass line «(вид: смена лица)» about 0.1 s later | **pass** (12:18:39) | `SetThirdPerson(true)` from first person → one line «первое лицо (вид: смена лица)…» and no Switch* line |

## Neighbours (HOUSE_RULES 39)

K4–K7 are the neighbours of the pass: the shadow restore (bug 98), the head's shadow (#13), the sheathed bow (#4), the weapon change and the idle camera.
