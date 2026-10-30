# TC — Conan HUD: the temperature line coloured by heat (KrinikHudOutline, plan 36 W27)

> **Created:** 2026-10-30 · **Parent:** plan 36 W27; `[OWNER]` «при высоких температурах красить в красный, при низких - в зелёный. Норм - белые» · 2026-10-30 10:58
> **Status:** run 2026-10-30 11:12–11:18 — T1–T7 pass; report testcases/reports/2026-10-30_conan-hud-temperature-colour.md
> **Outbound:** the three colours — the owner's eye

**Basis.** Zones are the game's own steps, the ones Hosav picks its icon by (`W_SmoothHP::Get_TempImage`, bytecode 3.0.1): the hero's energy of
type 1 ≥ 20 → «тепло» and hotter (red), ≤ −20 → «холод» and colder (green), between → «комфорт», the heart icon (white). Event:
`BPEnergyReceiver::EnergyReceived`, ≈1 Hz. Fields: `TextBlock_TempText` (W_SmoothHP, W_SmoothHP_Cernter), `TextBlock_Temp` (W_TestHudOverlay).

**Stand.** The owner's save in the oasis; the hostile boss killed by the remote; the hero idle; time of day set by the remote (`exec` time
command) to move the energy across 20; HUD crop frames from `capture-window.ps1` at 3840.

| # | Case | Steps | Expected | Status |
|---|---|---|---|---|
| T1 | Hook set | world entry | log «температура: перехват EnergyReceived поставлен» | pass — 11:12:24 and 11:14:00 (both launches) |
| T2 | Zone at entry | first second in the world | log «температура: энергия E → зона Z, полей N (новые)» with N ≥ 2; the text colour on a HUD crop matches Z and the icon (heart = white, warm icon = red) | pass — 11:14:30 «энергия 15.9 → зона norm, полей 5 (новые)»; crop 11:1x: «30 °C» white beside the heart icon |
| T3 | Hot | noon (energy ≥ 20) | log «зона hot»; the text red on the crop, the warm icon beside it | pass — 11:16:44 «энергия 20.1 → зона hot»; crop 13:12 game time: «32 °C» red beside the warm thermometer |
| T4 | Back to normal | night or shade (energy < 20) | log «зона norm»; the text white | pass — 11:17:17 «энергия 14.3 → зона norm» after the time set to 02:00 (white shown on the T2 crop) |
| T5 | No spam | 60 s at a steady temperature | no new «температура:» lines while the zone holds | pass — no line from 11:14:30 for >2 min while the energy rose 15.9 → 17.4 |
| T7 | No flicker at the border | energy hovering around 20 (first run 11:12: 20.1 → 19.7 in 2 s flipped hot → norm) | with the 1-unit hysteresis: one zone line, no hot/norm flip while 19 < E < 20 | pass — one «hot» line at 20.1 and none at 20.5 / the rise; the first build without hysteresis flipped hot → norm at 20.1 → 19.7 (11:12) |
| T6 | Cold | a place with energy ≤ −20 | log «зона cold»; green text | pass — 11:17:29 «энергия -20.5 → зона cold» (desert night); crop 02:39 game time: «-8 °C» green beside the snowflake icon |
