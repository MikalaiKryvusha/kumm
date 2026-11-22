# Bug 118 — the game crashes inside UE4SS (the Lua VM) while the hub stays open after entering the world

> **GitHub issue:** [#50](https://github.com/MikalaiKryvusha/Kriniks_Conan_Exiles_Enhanced_ModPack/issues/50) — the public tracker of this defect (HOUSE_RULES 44)

**Status:** 🔴 OPEN — localized by bisection to KrinikConanCamera; the per-second scene search replaced by a birth registry (pack `b42090f`), two clean
10-minute soaks, then **crash 7 at 17:45:04 with the fix in** (7 s after EAA opened, folder `UECC-Windows-F47D5DE3…`) — the search was not the whole cause.
Next: camera on with `mute_foreign_camera = false` (no tick calls on EAA's components), then the birth callback's thread (judge round 2, A2)
**Severity:** S1 (a crash — critical by HOUSE_RULES 38)
**Version/build:** the working build after 0.9.1-RC3 (pause `b7d984a`), Conan Exiles Enhanced 3.1.1 · **When/context:** 2026-11-22 15:48, the RC4 scope run (Esc over
mod windows, `testcases/TC_conan_rc4_scope_2026-11-22.md`)
**Fixing:** this session

## Symptom

The hub open (tab 0) and the `EAA_Armorsettings` window over it, opened by the remote's `ActivateModule`; the game crashes with `EXCEPTION_ACCESS_VIOLATION reading
address 0xffffffffffffffff`, the crash-report window opens. No remote command runs at that moment.

| # | Crash folder | Hub + EAA open at | Crash at | After |
|---|---|---|---|---|
| 1 | `UECC-Windows-66BBB1D6…` | 15:48:15 (EAA reopened; the hub open since 15:39) | 15:48:25 | 10 s |
| 2 | `UECC-Windows-19D8FA9C…` | 15:51:17 | 15:51:26 | 9 s |
| — | (no crash) | 15:54:09 | — (game stopped by me at 15:58) | — |
| 3 | `UECC-Windows-E2B20ED8…` | 15:54:09 (the same session) | 15:56:46 | 2 min 37 s |
| 4 | `UECC-Windows-1EE45BCE…` | 16:00:57 (fix 1) | 16:02:40 | 1 min 43 s |
| 5 | `UECC-Windows-FC1BFFC4…` | 16:04:30 (fixes 1 + 2) | 16:10:38 | 6 min 8 s |
| 6 | `UECC-Windows-641911EE…` | 16:12:27 (KrinikConanUI's Lua OFF: `enabled.txt` moved to `KUMM/.work/control_ui/`) | 16:19:55 | 7 min 28 s |

## Forensics

Every stack the same to the byte (`<PCallStack>` of `CrashContext.runtime-xml`; UE4SS offsets): game tick (`466aba`, `45d2ca`) → LuaMod delayed-action dispatcher
(`2fd818` / `2fc9d0` / `2fcb79`) → `Lua::call_function` (`b9f485`) → about five nested Lua VM frames (`c7288e` / `c71a7a` / `c7d55b` / `c71259` …) →
`process_lua_function` (`ba2b5c`, `b9ddd4`) → a UFunction call (`2c5340`) → a property push (`2ce376`) → the Lua VM (`c69e6e` → `c77a80`, the crash). The game log:
«Script Stack: [Empty] (no Blueprint code was executing on the crashing thread)». The same shape as the two unexplained crashes of bug 85 (2026-11-07, 2026-11-10).
No Lua of our mods runs off the game thread (`check-lua-game-thread.py` → 0; every RegisterKeyBind / LoopAsync hit is a comment).

## Root cause / Hypotheses

1. **Confirmed hazard, NOT this crash (refuted by crashes 5 and 6):** a Lua wrapper kept across frames passes `IsValid()` after the game destroyed its object and another object took the
   memory — logged live after fix 1: «экран загрузки по ссылке уже не он: на его месте W_HotkeyIcon_C — ссылка выброшена (1)» (16:00:55, 16:04:29), 7 s after the
   world entry's three loading screens were born. The pause section asked `IsInViewport()` of those wrappers 4×/s while the hub was open (code of `b7d984a`, today).
   Twin: the pickup prompt's `strips` (six interaction-prompt classes, asked every second). Both now check the class name before any call.
2. Crash 6 came with KrinikConanUI's Lua off: the crash does not live (only) in that mod. Left in the stand: KrinikConanCamera, KrinikConanArchery, KrinikConanLocomotion,
   KrinikConanGraphics, KrinikConanModPackManager, the dev remote KrinikAgentRemote and KrinikMenuProbe (dev-only, not shipped). A crash of the stand's dev mods would
   not reach players; a crash of a shipped mod would. I wrongly said «the crash lives in the UI mod» at 16:19 after one clean 7-minute window — corrected the same turn.

3. **Bisection (2026-11-22 16:23–17:00), hub + EAA open by the remote, every variant watched by PID:**

| Variant | Lua mods off | Result |
|---|---|---|
| all on (sessions 1–5) | — | 5 crashes in 5 long sessions (9 s … 6 min) |
| C | KrinikConanUI | crash 6 after 7 min 28 s |
| B1 | Camera, Locomotion, Archery | clean 10 min |
| B2 | Camera only | clean 10 min, then 24 min until the game closed normally (17:00:09 «Event loop end», not a crash) |

4. **The cause in KrinikConanCamera:** `keep_target_body` (a `LoopInGameThreadWithDelay` of 30 ms) → `pcall(mute_foreign_camera)` once a second →
   `FindAllOf("EAA_CamDistance_C")`, `FindAllOf("EAA_Zoom_C")` → `mute_one` → `IsComponentTickEnabled()` / `SetComponentTickEnabled(false)` on everything found —
   the same nesting as the stack (delayed action → pcall → body → pcall → search → call → UFunction). `EAA_Zoom_C` lives on EAA's actor `EAA_MC_C`, which the EAA
   window brings; the crashes came with that window open. A component search with method calls on its results already crashed UE4SS (the remote's guard,
   2026-10-26 09:23). Not proven which object exactly (no symbols of the Lua VM) — the mechanism is localized by the bisection and removed.

## Fix plan (or the fix, if done)

1. Done: KrinikConanCamera `mute_foreign_camera` — no scene search per second: the two classes are watched by `NotifyOnNewObject` once loaded (`StaticFindObject`
   of `/Game/Mods/EnhancedArmoryAndArsenal/Cam/EAA_Zoom.EAA_Zoom_C`, `…/EAA_CamDistance.EAA_CamDistance_C`), one search per class per session seeds the ones
   born before, the registry keeps `{ c, full name }`, and only a same-name object gets the tick calls. Seen 17:16:32: «слежка за рождением встала» ×2, «чужая
   камера заглушена: EAA_Zoom_C (раз 1)» — the muting still works.
2. Done (the hazard of hypothesis 1, judge round 1 findings 7, 8, 10, 13): the pause section's loading screens and the pickup prompt's strips are identified by the
   full name recorded at birth; the archery's `settle_if_stuck` checks the mesh and the anim instance, its `draw_montage` checks the anim's full name.
TWINS: searched `FindAllOf(` with a component class in the shipped Lua (`_unpacked/Krinik*`, the harness excluded; 50 FindAllOf sites in all) — 4 other sites,
all in KrinikConanCamera `main.lua`: 3021 (`NiagaraComponent`, a diagnostic command), 3123 (`SceneCaptureComponent2D`, a diagnostic), 3200 (the rain capture every
5 s — off: `rain_ortho_width = 0.0` in the shipped and the live `config.lua`), 3250 (a toggle, off by the same switch). Left as they are, listed.
Soak V1 (every mod on, the camera fix): hub + EAA 17:16:37 → 17:26:45 clean.
3. Owed: the second clean 10-minute soak with every mod on (V2 runs from 17:28:17); the judge's twin list (round 1, 23 rows — the camera's `arm` every 30 ms and `fp_cam` every frame first)
   as their own work; the KAIF-wide lesson EXP-0612.

## Decisions made without the owner

(filled at closing)

## Links

Bug 85 (the same stack shape) · EXP-0612 · issue #50 · `testcases/TC_conan_rc4_scope_2026-11-22.md`
