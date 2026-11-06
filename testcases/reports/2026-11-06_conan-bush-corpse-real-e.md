# Run report — Conan: a corpse in a pickable bush, the real E (bug 80)

## Work
Bug 80's owed observation — a REAL E over a corpse lying in a pickable bush — against the owner's word (2026-11-03 19:57 «нужно ту плашку показывать, которая
сработает»; 2026-11-06 21:01 «тестируем E Взять над кустом с трупом»); cases `testcases/TC_conan_bush_corpse_real_e_2026-11-06.md` B1–B3.

## Contour
Conan Exiles 3.0.1, the owner's working game folder with the full build of 2026-11-06 (KrinikConanUI with `krinik_pickup_prompt` of bug 77/80 and the carousel
edit); the oasis save; 3840×2160; the game in front; the catalog plate waited out (22:00:04).

## Runs
- 2026-11-06 22:00 +03:00: `bash god-on.sh`; `pult.sh "lua … K2_TeleportTo(oasis) … SetTimeOfDay(12.0)"`; `quiet-stand.lua` (one Kappa killed); `pult.sh "lua return
  dofile('…/_config/bush-corpse.lua')"` → «bush at -78166 245799 -20073 (2.0 m from the hero, 308 probes); HumanoidNPCCharacter_20percentbigger_boss_C moved there and killed».
- 22:01: the tail of `loot-stand.sh` (corpse by bones, the hero 1.5 m off) → «humanoid corpse (b_head) at 3.4 m»; `bash loot-aim.sh` → «hit pitch -56.0 yaw -94.4 (step 8 of 70)».
- 22:01 B1: `capture-window.ps1 -Out b1.jpg`; remote read of `HB_KrinikPickup` and `IsModuleActive(ContainerInfo)`.
- 22:02 B2: `mouse-seq.ps1 -Seq "kdown:E,wait:90,kup:E,wait:1200"`; `capture-window.ps1 -Out b2.jpg`.
- 22:02 B3: Esc; five views by `SetControlRotation` offsets (dP/dY −8/25, −8/−25, 8/30, −15/40, 10/−35), the plate and the strip read after each; at the last
  view `capture-window.ps1 -Out b3.jpg`, a real E, `b3e.jpg`.

## Checks
- Hygiene: none (no code changed).
- Functional run: the real E key on the real build, frames and remote reads READ.
- B1 pass — the corpse strip «Нурус Тихорез … нажмите E, чтобы забрать предметы» and the quick-loot window; our plate visibility 1, opacity 0.00.
- B2 pass — the real E opened the corpse's loot window (7 items: weapon, helmet, chest, legs, boots, 13 arrows, an amulet); no bush item.
- B3 pass — strip on → plate hidden (2 views); strip off → plate visibility 3, opacity 1.00 (3 views); at the last one «E Взять» under the crosshair by a branch,
  the real E took it — «Ветка +1».

## Found
none — the strip and the plate never showed together, and each said what E did.

## Traces
`scratchpad/h69/b1.jpg`, `b2.jpg`, `b3.jpg`, `b3e.jpg`, `b3_pair.jpg` (session scratchpad).

## Verdict
pass — bug 80 closed.
