# Bug 118 — the game crashes inside UE4SS (the Lua VM) while the hub stays open after entering the world

> **GitHub issue:** [#50](https://github.com/MikalaiKryvusha/Kriniks_Conan_Exiles_Enhanced_ModPack/issues/50) — the public tracker of this defect (HOUSE_RULES 44)

**Status:** ✅ CAUSE PROVEN 2026-11-22 19:31 — **not a defect of the build: the crash is our own dev probe** `KUMM/.work/tmp/esc_listen.lua` with `_G.__el_bind`
(bug 108's E0b spike: `ListenForInputAction` with a Lua-table delegate), sent by the agent remote. Reproduced twice on demand, each 1.5 s after the command,
with the stack byte-identical to crashes 1–7 (47 frames, md5 `6a69582e`): 19:28:44 with every mod on, 19:31:12 with KrinikConanCamera OFF. Without the probe:
10 min + 15 EAA reopen cycles clean (camera mute off), the shipped-state soak runs (section «Root cause (proven)»). The camera's birth registry (`b42090f`) stays
as a cheaper design (EFFICIENT_CODE §2.6), not as a crash fix. Issue #50 to close with this finding.
**Severity:** S1 as filed; as found — a crash of a dev tool only, players never send this call (the build ships no `ListenForInputAction` from Lua)
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

**All seven stacks are one call site (read 2026-11-22 19:04).** The 47 frames of `<PCallStack>` are byte-identical in crashes 1–7 (one md5 over the offset
lists, `KUMM/.work/bug118/stack_*.txt`), before the birth registry and after it. So the registry changed nothing on the crashing path: the crash site never was the
per-second search itself. The Lua nesting it shows, from the delayed action up: Lua fn L0 → `pcall` (frames `c82251 c6995c c718a4…`, a protected call) → L1 →
a C function at `c8203d` that calls Lua UNPROTECTED (`c68b08 c71259`, no `c6995c`/`c718a4`) → L2 → `pcall` → L3 → a UE4SS method (`ba2b5c`) → UFunction →
the return-value push → crash. The camera's old mute path (`pcall(keep_target_body)` → `pcall(mute_foreign_camera)` → `mute_one` → `pcall(IsComponentTickEnabled)`)
has no unprotected C call between the pcalls, so it does not fit the stack either. Not identified yet: which Lua-library function sits at `c8203d` (a function
called directly by Lua code that calls a Lua function back, e.g. `pairs` with `__pairs`, `dofile`, `load` with a reader, `table.sort`, `string.gsub`, `require`).

**The frames identified (2026-11-22 19:1x, capstone over `UE4SS.dll`, tool `KUMM/.work/bug118/tools/dis.py`):** `c7a2b0` is `luaV_execute` (its dispatch
`jmp rcx` and the loop back to `c7a3b0`); `c7d55b` its OP_CALL site, `c7db79` its OP_TAILCALL site; `c72770` calls the C function (`call r15` at `c7288e`);
`c82251` is `luaB_pcall` (`lua_pcallk` with `MULTRET`, ctx 0, a continuation); `c8203d` is **`luaB_dofile`** (`lua_callk(L, 0, LUA_MULTRET, 0, dofilecont)`, then
`lua_gettop`). Read bottom-up, every crash is: a game-thread action → `pcall(F1)` → F1 does **`return dofile(<file>)`** (a tail call) → the file's chunk →
`pcall(F3)` → F3 calls a UObject method → the UFunction runs → UE4SS pushes a parameter back to Lua → crash. That is the shape of the agent remote's
`lua … return dofile('…')` (`run` → `pcall(lua_chunk)` → the chunk's tail call).

**The file is our own Esc probe, in all seven crashes.** Every `UEMinidump.dmp` (crashes 1–7) holds the remote command `lua _G.__el_module='EAA_Armorsettings';
_G.__el_bind=true; _G.__el_handler='BndEvt__Button_81_K2Node_ComponentBoundEvent_63_OnButtonClickedEvent__DelegateSignature'; return dofile('D:/work/ai_sandbox/
KUMM/.work/tmp/esc_listen.lua')` (tool `.work/bug118/tools/dmpstr.py`); crash 7's dump also holds the name `ListenForInputAction`. With `__el_bind` the probe
runs `pcall(function() root:ListenForInputAction(FName("Escape"), 0, true, { Object = root, FunctionName = FName(handler) }) end)` — a UFunction whose last
parameter is a delegate (`FOnInputAction`) passed as a Lua table. That matches the stack to the frame. **Hypothesis 5 (to be proven by a repro):** the crash is
this dev probe of bug 108 (the E0b case), not a mod of the build; the «every attempt met crash 118 first» of bug 108 read the order backwards. The bisection
variants that stayed clean (B1, B2, V1, V2, and today's runs with `mute_foreign_camera = false`) are the runs where the bind was not sent — to check by a repro.

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

## Root cause (proven 2026-11-22 19:28–19:31)

The crash is the agent's own probe of bug 108, sent by the remote: `lua _G.__el_module='EAA_Armorsettings'; _G.__el_bind=true; _G.__el_handler='BndEvt__Button_81_…';
return dofile('D:/work/ai_sandbox/KUMM/.work/tmp/esc_listen.lua')`. The file calls `root:ListenForInputAction(FName("Escape"), 0, true, { Object = root,
FunctionName = FName(handler) })` inside `pcall`; UE4SS runs the UFunction and crashes while pushing a parameter back to Lua (the delegate, by the stack's last
UE4SS frames `2c5340` → `2ce376`). `pcall` cannot catch it: the access violation is native.

| Run | Mods | Probe | Result |
|---|---|---|---|
| 18:59–19:09 | all on, camera `mute_foreign_camera = false` | no | clean 10 min (hub + EAA open) |
| 19:13–19:28 | the same session | no | 15 cycles «close EAA, reopen, hold 38 s» clean |
| 19:28:44 | the same session | **yes** | crash 1.5 s later (reporter 19:28:46), stack 47 frames, md5 `6a69582e` — equal to crashes 1–7 |
| 19:31:12 | all on, **KrinikConanCamera OFF** (0 camera log lines) | **yes** | crash 1.5 s later (19:31:14), the same md5 |
| 19:33:20–19:51:13 | the shipped state (camera on, mute on, registry `b42090f`; log «слежка за рождением встала» ×2, «чужая камера заглушена: EAA_Zoom_C») | no | clean: 10 min with hub + EAA open (to 19:43:30), then 8 cycles «close EAA, reopen, hold 38 s» |

**Why the bisection pointed at the camera.** Every run that crashed had the probe sent; the clean variants (B1, B2, V1, V2) were soaks in which it was not
sent. The variants differed by the probe, not by the mods, and the record of the runs did not list the remote commands, so the difference stayed invisible.
Bug 108 wrote «every attempt met a crash of bug 118 first» — the attempts were the crash. The three statements of cause made on 2026-11-22 (the probe hooks
15:48, the UI mod 16:19, the camera search 17:1x) each rested on one variable chosen by the agent, while the variable that really changed was the agent's own
command.

**How it was found.** Not by more bisection: by reading the evidence the crash leaves. (1) The stacks of all crashes compared by hash — one call site.
(2) The frames inside `UE4SS.dll` disassembled (capstone; `luaV_execute`, `luaB_pcall`, `luaB_dofile` recognised by their code) — the shape «`pcall` →
`return dofile` → `pcall` → UFunction» is the remote's `lua … return dofile(…)`. (3) The strings of every `UEMinidump.dmp` — the probe's command in all seven.
(4) A repro on demand, twice, one of them without the suspected mod.

## Fix plan (or the fix, if done)

0. **The fix of the crash: none needed in the build.** The probe is a dev file in `KUMM/.work/tmp/`; it is never shipped and never sent again
   outside a repro (bug 108 records the dead end: a Lua-table delegate into `ListenForInputAction` crashes UE4SS natively).

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

- `[AI]` 2026-11-22 19:3x: the camera's birth registry of EAA's components (`b42090f`) stays in the build although it fixed nothing of this crash: it
  replaces a per-second scene search with an event (EFFICIENT_CODE §2.5–2.6), and the shipped-state soak runs on it. Its code comment is corrected.
- `[AI]` 2026-11-22 19:3x: the twin list of judge round 1 / round 2 (23 rows of «a wrapper kept across frames») is no longer owed AS bug 118's work; the
  hazard of hypothesis 1 is real on its own (seen live: a loading-screen wrapper pointing at `W_HotkeyIcon_C`) and its fixes stay.

## Links

Bug 85 (the same stack shape) · EXP-0612 · issue #50 · `testcases/TC_conan_rc4_scope_2026-11-22.md`
