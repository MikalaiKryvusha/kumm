# TC — ground blood stays up to 5 minutes (plan 36 W28)

> **Created:** 2026-10-30 · **Parent:** plan 36 W28; `[OWNER]` «спрайты крови на земле которые - нужно чтобы держались на земле до 5 минут до
> исчезночения» · «время настраивается ползунком в модах Krinik» · 2026-10-30 ≈10:59; recon — `researches/conan-blood-decals/README.md`
> **Status:** cases written 2026-10-30 12:1x, before the run; run 12:04–12:45 — mod 0.1.0 (second build) L1–L5 pass, L6 partial (report testcases/reports/2026-10-30_conan-lingering-blood.md)
> **Outbound:** the look of 5-minute blood — the owner's eye

**Goal (Achieve).** A ground blood stain (`M_blood_ground_decal`, placed by `GameplayStatics:SpawnDecalAtLocation` on a hit) stays on the ground for
the time set in our settings (default 300 s) instead of the game's own life; the cost stays inside the 1 ms CPU budget.

**Stand.** The owner's save (copied to the scratchpad before the launch), god by `bash _config/god-on.sh`, food and water filled by the remote;
the oasis boss `HumanoidNPCCharacter_20percentbigger_boss_C` (or any `HumanoidNPCCharacter_C` by exact class) moved 3.5 m in front of the hero,
made passive by `DetachFromControllerPendingDestroy()` and held by `CustomTimeDilation = 0.0001`; other creatures within 60 m removed
(`K2_DestroyActor`); the bow IN HAND checked on a frame (EXP-0378); shots by real input (`mouse-seq.ps1`); time of day 12:00 by the remote.
Techniques: observation of the game's default (B1), the change and its control (B2/B3), boundary of the count (B4).

| # | Case | Steps | Expected | Status |
|---|---|---|---|---|
| B1 | The game's own life and its caller | hook `SpawnDecalAtLocation`, filter `M_blood_ground_decal`, print `life` and the caller (`ctx` class); 3 hits | the default life in seconds and the blueprint that places the stain are named | pass — life 3.0 s, `BP_CollisionComponent.DoHandleHitFeedback` of the ATTACKER (a weapon hit); arrows lay none (12:13) |
| B2 | Life extended | the same hook sets `SetLifeSpan(300)` on the returned decal; hits; count the live `DecalComponent`s with that material at default+30 s | the stains of B2 still exist past the default life; a frame shows blood on the ground | fail as designed — `SetLifeSpan` is not callable from Lua; a pre-hook `life:set` does not reach the call; replaced by the fade route (L3) |
| B3 | Control | hook without `SetLifeSpan`; hits; count at default+30 s | the stains of B3 are gone at default life | pass — vanilla stain visible at +0.6 s, gone at +4.6 s (12:16, `burst2`) |
| B4 | Count cap | 30+ hits with the 300 s life; count the stains | either all stay, or the engine drops the oldest — the number is recorded | skipped — the mod caps itself at 200; a big-fight count — next run |
| B5 | No crash / no errors | the whole run | no crash, no Lua error lines | pass — three launches 12:04–12:45, no crash, no crash reporter |

**Mod KrinikLingeringBlood 0.1.0 (post-hook on the native `DecalComponent:SetFadeOut` → `SetFadeOut(297, 3)` + `SetFadeIn(-500, 1000)` on a blood
stain; the first build's `SetLifeSpan(300)` failed in game 12:32 — «attempt to call a TrivialObject value», not callable from Lua).** Stand corrections
learned in the 12:05–12:28 run: arrows on a creature lay NO ground blood (only weapon hits of `BP_CollisionComponent` do — the creature's hit on
the god hero is the source); a creature without its controller (`DetachFromControllerPendingDestroy`) or with `CustomTimeDilation` 0.0001 does not
hit at all; the game's idle camera (no real input ≈30 s) hides the HUD and orbits — a real Shift tap before each frame; Night Terrors spawn at
night — time 12:00 and remove them; after the hits the creature is REMOVED (`K2_DestroyActor`), the hero stays put (velocity read on the stand).

| # | Case | Steps | Expected | Status |
|---|---|---|---|---|
| L1 | Mod loads | world entry; `UE4SS.log` | «[KrinikLingeringBlood] загружен: кровь на земле лежит 300 с» | pass — 12:31:04 and 12:38:12 |
| L2 | Stain grows as in the game | a kappa hits the god hero; top-down frame within 3 s | a red stain under the hero, as in the vanilla frames of 12:15:27 | pass — 0.1.0 second build, 12:39:30 frame (+10 s) |
| L3 | Stain holds | creature removed; top-down frames of the same spot at +10, +60, +120, +180, +240, +290 s | the full red stain at every frame | pass — +10, +60, +120, +180, +285 s; the first build (`SetLifeSpan`) failed here: «attempt to call a TrivialObject value», no stain at +10 s (12:32) |
| L4 | Stain leaves at the hold time | frames at +310 and +330 s | no stain | pass — +305 and +330 s: sand only |
| L5 | Control (vanilla) | the 12:16 run with the ineffective pre-hook = vanilla life | stain gone by +4 s (`burst2`, 12:16:02 → 12:16:06) | pass by the 12:16 run — visible at +0.6 s, gone at +4.6 s |
| L6 | Cost | the minute summary in `UE4SS.log` | own time per stain ≪ 1 ms, worst < 0.2 ms | partial — the summary «4 stains, 1.000 ms, worst 1.000 ms» is the 1 ms step of `os.clock` on Windows, not a measurement: not a bound either (correction 13:08) — unmeasured, case G4; one hook call per stain |

**KrinikConanGraphics 0.1.0 (the blood mod renamed, Engine.ini moved in; the cap now evicts the OLDEST stain — `[OWNER]` «Нужно старые убирать,
а новые чтобы жили 5 минут» · 2026-10-30 ≈12:5x) + the XP «k» one decimal truncated (plan 36 W5c) + W30 recon.** Stand as above; for G3 a test
copy with `hold_cap = 3` is deployed, the real file after.

| # | Case | Steps | Expected | Status |
|---|---|---|---|---|
| G1 | Mod loads by its new name | world entry; `UE4SS.log` | «[KrinikConanGraphics] загружен», no `KrinikLingeringBlood` line | |
| G2 | Hold unchanged | one hit; top-down frame at +20 s | the stain is there | |
| G3 | Cap evicts the oldest | `hold_cap` 3; five hits | log: «лежит всего» never above 3; the oldest stains fade (frames), the newest stay | |
| G4 | Cost per stain | the remote runs the handler's body (material name, `SetFadeOut`, `SetFadeIn`, `GetFullName`) 1000 times on a live stain, `os.clock` around the loop | total / 1000 ≪ 1 ms (the 1 ms budget is for ALL mods in the worst frame) | |
| K1 | XP «k» one decimal, truncated | HUD frame of the XP line | «XP : 126,7k / 130,3k» form — one decimal | |
| W30a | Arrow hit parameters | hook `BP_CollisionComponent:TakeProjectileDamage`, one arrow into a creature | the parameter list printed (hit result / location) | |
