# Run report — Conan HUD: the temperature line coloured by heat (KrinikHudOutline)

**Work.** Plan 36 W27 — the HUD temperature text red when hot, green when cold, white when normal; basis —
`testcases/TC_conan_hud_temperature_colour_2026-10-30.md` (T1–T7); the owner's word 2026-10-30 10:58.

**Contour.** Conan Exiles 3.0.1 with the build; KrinikHudOutline `Scripts/main.lua` deployed by copy (two launches: without and with the
1-unit hysteresis); the owner's save in the oasis; god mode on (intended by `exec God`, which does nothing in 3.0.1 — the hero was mortal; EXP-0381); time of day set by the remote
(`FindFirstOf('BP_TimeOfDayManager_C'):SetTimeOfDay(h)` — the console `SetTimeOfDay` does not exist in 3.0.1); machine lock per launch.

**Runs.**
- 11:07:34 launch (recon: `pult.sh` lua probes of the hero's components, `BPEnergyReceiver:GetEnergy(1)`, a `RegisterHook` counter on
  `EnergyReceived` — 6 calls in ≈5 s; a live recolour of the three fields).
- 11:11 relaunch with the first build — 11:12:53 hot at 20.1, 11:12:55 norm at 19.7 (the border flip that asked for hysteresis).
- 11:13 relaunch with the hysteresis; 11:15 `SetTimeOfDay(13.0)`; 11:17 `SetTimeOfDay(2.0)`; HUD crops by `capture-window.ps1 -Width 3840`.

**Checks.**
- Hygiene: none (Lua loaded by the game).
- Functional run: the mod's own zone lines in `UE4SS.log` read against the energy and the HUD crops read by eye (text colour beside the game's icon).
- T1 pass (hook set) · T2 pass (norm at entry, 5 fields, white beside the heart) · T3 pass (20.1 → hot, «32 °C» red beside the warm
  thermometer) · T4 pass (14.3 → norm) · T5 pass (no line for > 2 min while the zone held) · T6 pass (−20.5 → cold, «−8 °C» green beside
  the snowflake) · T7 pass (one hot line through 20.1–20.5; without hysteresis the first build flipped).

**Found.** The first build flipped hot/norm at the border (fixed in the same run by the hysteresis); none after.

**Traces.** `UE4SS.log` lines `[KrinikHudOutline] температура: …` 11:12:24–11:17:29; HUD crops in the session scratchpad (not kept).

**Verdict.** pass — the colour follows the game's own temperature steps and changes with the icon; the three colours wait for the owner's eye.
