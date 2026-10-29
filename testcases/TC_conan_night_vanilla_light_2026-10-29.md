# TC — night: the game's own light, not Severe Weather's, from the box (plan 36 W12, item 40)

> **Created:** 2026-10-29 · **Parent:** plan 36 W12 · `[OWNER]` «а что со светом, почему ночью темно? нет светимости неба» · «исплавляем его ночное освещение. возвращаем ваниль» (2026-10-26)
> **Status:** run 2026-10-29 11:16–11:42 — L1–L4 pass; the night look waits for the owner's eye
> **Outbound:** —

**Basis.** `dc SW_config disable_custom_GI` → `SW_ModController` event «SW_config light»(False); the choice is not saved (no properties of the
controller in `Game_0.db`). Fix: the shipped default `light enabled = False` (`asset-strings/SevereWeatherEnhanced__SW_ModController.tsv`,
KRINIK MODIFIED pak).

**Stand.** The beach, the owner's save, time set by the remote (`BP_TimeOfDayManager_C:SetTimeOfDay(23.0)`), clear sky if possible; frames by
`capture-window.ps1`; control by the mod's own command. Dimensions: fresh launch with the new pak, night light, the command still works.

| # | Case | Steps | Expected | Status |
|---|---|---|---|---|
| L1 | The new default is live after a fresh launch | remote: `FindFirstOf('SW_ModController_C')['light enabled']` | false | pass 11:16 — «light enabled = false» on a fresh launch |
| L2 | Night frame — vanilla sky light | time 23:00, frame | the sky and the ground lit as in vanilla (brighter than the 2026-10-26 04:21 frame with the mod light) | pass by the agent's eye 11:17 (23:14 in game: the sky glow and the sand lit) — the look is the owner's verdict |
| L3 | Control: the mod light on by its command | `dc SW_config enable_custom_GI`, re-enter if needed, frame | darker night, as before the fix | pass 11:42 — the console `dc SW_config enable_custom_GI` does NOT reach the mod (variable stays false, also as admin and after a re-entry); the controller event called directly by the remote `c['SW_config light'](c, true)` → true: the same pose at 23:11 — mean brightness 21 (mod light) vs 41 (our default), the mod's night is near black; set back to false (the event marks the value for the world save) |
| L4 | The game log | `ConanSandbox.log` | no new errors about SevereWeatherEnhanced | pass — 0 errors; the «index 0 … length 0» warning is the author's (1 before, 1 after); «imperfect hashmap» — on every repacked mod |
