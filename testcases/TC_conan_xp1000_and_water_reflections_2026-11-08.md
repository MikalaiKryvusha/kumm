# Test cases — Conan build: XP curve base 1000 · water reflections without the screen-space streak

**Created:** 2026-11-08 · **Under test:** (1) `KrinikConanGameplay` pak rebuilt with `XP_ANCHOR = 1000`; (2) reflection settings for the
white streak on the water beside a palm trunk · **Version/build:** Conan 3.0.1 build 0.9.0, game `D:\Games\Conan Exiles 3.0.1`
**Test basis:**
- XP: `[OWNER]` 2026-11-07 21:06 (chat, STATUS item 0c) — base 1000 instead of 500; 2026-11-08 12:21 «уровень 1000 делаеми». Law: XP per level = 1000 × L^0.5.
- Reflections: `[OWNER]` 2026-11-07 20:12 «отражение на воде в экранном пространстве, баг - за деревом белый след»; 2026-11-08 12:22 «Я боюсь, что лучи
  ОЧЕНЬ сильно просадят FPS» · «давай включать. пробовать. замерять на нашем демо пролёте». The look is the owner's verdict (taste class); the agent brings
  frames from one place and the flight numbers.

## 1. Goal vector

Achieve: levelling twice slower per level with the same law. Avoid: the white screen-space fallback streak on the water behind a trunk, without a visible
loss of reflection quality and without a large FPS drop on the `krinik-show` flight.

## 2. Requirements under test

| # | Requirement | Fit criterion |
|---|---|---|
| R1 | WHEN the hero is set to level L, the HUD shall show 1000 × √L XP to the next level | L = 65 → 8 062; L = 100 → 10 000 (±1 rounding) |
| R2 | The reflection variant offered shall not show the white streak behind the trunk | frame from one camera place, by eye; the streak visible in A |
| R3 | The offered variant's cost shall be measured on `krinik-show` | median FPS, 1 % low, stutters ≥ 50 ms — A-B-A-B pairs |

## 3. Coverage matrix

| Dimension | Values covered | NOT covered |
|---|---|---|
| level | 65, 100 | 10 000 (the builder's step 6 checks the table rows) |
| reflection method | A current · B `r.Lumen.Reflections.ScreenTraces 0` · C hardware RT reflections (if the game allows) | other water bodies than the oasis |
| time of day | 11:00 (the palm stand hour) | night, rain |

## 4. Cases

Stand: oasis save, god on (`god-on.sh`), `stand-keeper.sh` running, camera by `fixed-cam.lua`, hour 11:00, background path allowed (machine is the agent's).

| # | Steps | Expected | Status |
|---|---|---|---|
| L1 | remote `exec MakeMeAdmin`; `CheatManager:SetLevel(65)`; frame of the HUD XP line | «(8 062)» to the next | pass — 12:26 frame: badge 65, «XP: 345,1k / 353,1k (8 062)» (old pak gave 4 031 on 2026-10-31) |
| L2 | `SetLevel(100)`; frame | «(10 000)» | pass — 12:27 frame: badge 100, «661,4k / 671,4k (10 000)» |
| R0 | read live cvars: `r.Lumen.Reflections.ScreenTraces`, `r.RayTracing.Enable`, `r.Lumen.HardwareRayTracing`, `r.Lumen.Reflections.HardwareRayTracing`, `r.ReflectionMethod`, `r.SSR.Quality` | values recorded (what the game runs now) | pass — 12:27: ScreenTraces 1, RayTracing.Enable 0 (r.RayTracing 1), Lumen HWRT 1, Reflections.HWRT 1, LightingMode 0, ReflectionMethod 1, SSR.Quality 3 — Lumen runs software tracing |
| R1 | camera on the water with an occluder in front (the hero at the waterline −80500, 245900, fixed camera 3.5 m behind, 0.9 m up, 11:00); frames A current · B ScreenTraces 0 · C RT 1 · D RT 1 + ScreenTraces 0 · E C + LightingMode 2 | B / C / D show what the fallback is | pass (mechanism) — B: the whole water sky-white (the software fallback = the streak's colour); C, D: the shore reflected, warm, no white; E = C by eye. A at this camera had no visible streak (the hero is a low occluder); a palm-trunk camera not found yet. CORRECTED 14:35: the owner's frame (variant 4, behind a palm trunk at the oasis beach) shows the white streak beside the trunk — RT on does NOT remove it; the C/D frames proved only the hero-occluder case |
| R2 | `bench-flight.sh krinik-show` A, C, A, C (B too if C is not possible) | numbers per run; difference vs noise (±4 stutters, ≈1 FPS) | pass (measured; background path with `no-power-throttle.ps1`, 12:53–13:07) — median FPS A 53.9 / 57.0 · C 48.1 / 52.2 (−5, ≈ −9 %); GPU ms A 13.0 / 12.4 · C 14.1 / 13.7 (+1.2); CPU ms A 18.1 / 17.1 · C 20.3 / 18.7 (+1.7); hitches A 158 / 77 · C 108 / 80 (noise, warm-up trend); worst frame A 225 / 184 · C 141 / 141 ms. Front path not measured (owner at the keyboard) |
| R3 | (variant 5 cost) `rt_flights_cd.sh`: C-D-C-D on `krinik-show`, background, throttle off | D vs C numbers | skipped — stopped 13:27 for the owner's gallery order (G2): C3 measured (52.8 median, GPU 14.06, CPU 18.45, 88 hitches), D1 started and aborted by `stop`; the C-D pairs are re-run after the gallery |
| R4 | (owner 14:02) `rt_flights_345.sh`: now / 4 / 5 ×2 on `krinik-show`, background, throttle off | cost of 4 and of 5 vs now | pass — 14:05–14:26 (order now→4→5 ×2): median FPS now 46.4 / 52.9 (49.7) · v4 40.5 / 43.7 (42.1, −15 %) · v5 44.9 / 46.5 (45.7, −8 %); CPU ms now 19.8 · v4 23.2 (+3.5) · v5 21.3 (+1.5); GPU ms 13.8 · 15.7 (+1.8) · 15.2 (+1.4); hitches 170 · 237 · 187; worst 194–265 · 125–148 · 144–213 ms. CPU-bound in all (GPU ≈ 15 of ≈ 22 ms). Absolute numbers below the morning series (long session) — compare inside the series only; order fixed (now first), a drift would favour 5 |
| R5 | `set-reflections.sh 4` with the game in front for the owner's play; on his word `set-reflections.sh 5` | read-back «1 1» then «1 0»; the owner plays both | partial — 14:27 variant 4 read back «1 1», the hero at the oasis beach, game in front (`game-front.ps1` exit 0), voice call 14:28; variant 5 waits for his word |
| G1 | `view-scout.sh <out> "<name> X Y"`… at ~12 places (oasis, Nekhet, Overlook, springs, lakes, rivers, under palms) | one 2x2 sheet per place, the hero on the ground, water / panorama visible in at least one heading | pass — 13:3x, 12 places, 12 sheets; good: oasis beach / high, Overlook, Nekhet, Shattered Springs, Skyfall, Godsight, Crowngrove, the canyon at (−32653, 21022) (a sign slip of Imi's Cradle — a river canyon with palms), Priestking's Retreat at water level; unusable: Riversend (the camera under water), Eyelet Lake (inside an ice cave) |
| G2 | `rt-gallery.sh <out> "<name> X Y dz pitch yaw"` ×15 (owner 13:24: water and panoramas, under palms for the GI question) | 15 side-by-side images, left 5 (RT on, screen traces off), right 4 (RT on, traces on), the same view and hour; cvars back to RT 0 / traces 1 at the end | pass — 13:31–13:46, 16 pairs (review folder 74), cvars read back 0 / 1 after. Seen: far water by the waterfall (1, 3) sky-white in 5, rock-dark in 4; still water by rocks (14, 15) — 4 brighter and sharper rock reflections; panoramas, canopy, leaf shadows on sand — no visible difference; the springs view looks into rock (weak) |
| H1 | UIMod_Hosav rebuilt with four `flt:CorruptionProgressColor` rows (owner 2026-11-07 21:04 «блёклый серый»); game restarted; hero with reduced max health (the save already shows «Здоровье снижено на 100 HP / 50%»); frame of the HUD bars at 4K | the reduced share of both bars faded grey, the live part red / yellow as before | pass — 13:10 frame after the restart (pak deployed 13:09): both bars' right half faded grey, red / yellow unchanged (`HUD_before_after.webp`); the look is the owner's verdict |
| A1 | (plan 49 lever) remote: `ps.MaxAttributePointsSpent = 2`; `ServerGiveAttribute(19)` ×3; then 10 000 and ×1 | Agility stops at 2, then 3 | pass — 13:1x: «cap2: 2,2,2 \| cap10000: 3» |
| A2 | `ServerResetAttributeAll`; Vitality and Agility to 20, 21, 25; HUD frame each (idle camera off) | health / stamina keep growing past 20 | pass — health 100 / 350 / 360 / 400 (n = 0 / 20 / 21 / 25), stamina 50 / 60 / 60 / 62 (`attr_steps.webp`) |
| H0 | control: the frame of 12:26 (old pak) | the reduced share magenta | pass — `lv65_small.webp` 12:26: both bars' right half magenta |
