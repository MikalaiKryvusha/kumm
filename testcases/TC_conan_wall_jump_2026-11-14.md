# TC — Conan: Jump while climbing pushes the hero off the wall (KrinikConanLocomotion `krinik_wall_jump`)

> **Created:** 2026-11-14 · **Parent:** `games/ConanExiles/mods/KrinikConanLocomotion.md` PLAN row; the owner 2026-11-02 09:07 (verbatim in the game map «Climbing»)
> and 2026-11-14 09:54 · **Status:** written 15:3x, W2 measured before the section existed · **Outbound:** —

**Test basis:** the owner's design — «кнопка Прыжок должна выполнять прыжок героя прямо из состояния ползания … чуть-чуть отталкивается … в направлении вектора
нормали, и немножко - вверх». **Stand:** the desert arch (`bash tp_ground.sh 17929 244723`), god on, `_config/wall-stand.lua` (`find` puts the hero 60 cm off the
nearest vertical wall facing it; `climb` with `_G.__ws_climbcall=true` — the hero's own jump event + the native `Climb(false)` in the air starts the climb; `jumpwall`
presses the hero's own jump event on the wall and samples mode / place / speed every 0.1 s). The background twin of a real Space; W5 is the real key.

| # | Case | Steps | Expected | Status | Observed |
|---|---|---|---|---|---|
| W1 | jump on a wall | climb, then `jumpwall` | the log line «прыжок со стены: толчок 250 …»; mode 7 → 3 (falling) → 1; the place moves away from the wall along its normal ≈ 1.5–2.5 m and up before falling | **pass 15:34** | log «прыжок со стены: толчок 250 от стены по нормали (0.94, -0.35) и 350 вверх (1)»; mode 7 → 3; velocity (231, −87, 308); +156 cm off the wall and +63 cm at 0.7 s; clip `ConanExiles/_scratch/walljump/wj1.mp4` (frames: climbing → airborne off the wall → standing) |
| W2 | control: the game alone | the same press with no section (measured 15:2x before it was written) | the hero stays on the wall (mode 7, speed 0) | **pass** | `jumpwall` 15:2x: mode 7 for 1 s, velocity (0, 0, 0) — the game does nothing on Jump while climbing |
| W3 | a normal jump on foot | `InpActEvt_Jump` on the ground | an ordinary jump, no wall-jump log line | **pass 15:33** | a failed climb left the hero on the ground; `jumpwall` gave an ordinary jump (mode 1 → 3, vertical only, +101 cm) and no wall-jump line |
| W4 | not a wall in front | climb a slope / overhang, press | no push (log «впереди не стена» or nothing), the game's behaviour | **pass 15:38** | staged by turning the climbing hero 180° by the remote (forward = away from the wall): log «прыжок на стене: впереди не стена — оставлено игре (1)», mode 7 kept, speed 0 |
| W5 | the player's path | real Space while climbing (the PC free, the game in front) | as W1 | — | — |
| W7 | the release of the press that grabbed the wall (judge's blocker) | climb with the release AFTER the climb started (`_G.__ws_crel=0.5`) | the hero stays on the wall; a later press pushes | **pass 15:53** | rule «time on the wall ≥ 0.4 s» (the first fix by input-event stamps failed live 15:48 — StartJump runs inside the first event); grab release → mode 7 kept; the press 3 s later → «прыжок со стены … (1)», landed |
| W6 | the air shot still works | the bow, jump, shoot (two hooks on `StartJump`) | the Archery / AirCombat log lines as before | **partial 15:39** | the bow in hand (`BP_bow_2h_C@Socket_Bow`): AirCombat «прыжок с луком: выстрел в воздухе разрешён» (7)–(10) logged on the falls after the wall pushes of 15:34–15:35 — both sections work on the same jumps; a later ground jump unlogged (the section's 10-line log cap); an arrow in the air not fired |
