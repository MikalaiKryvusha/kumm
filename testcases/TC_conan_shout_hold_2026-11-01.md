# Test cases — Conan: how long an enemy shout stays on screen (the hub slider «Сколько держится фраза врага»)

> **Created:** 2026-11-01 · **Parent:** STATUS "Where to continue", `[OWNER]` 2026-11-01 08:49 «я бы в мод UI криника вынес настройку времени задержки
> отображения фраз на экране» · **Status:** cases written 2026-11-01 11:24 +03:00; run 11:33–11:44 — H1–H7 pass (report
> `testcases/reports/2026-11-01_conan-shout-hold-slider.md`) · **Outbound:** —

**Basis.** The owner's word above. The game removes a shout line when its voice ends (0.9–1.75 s, report `2026-10-31_conan-shout-fade-in.md`). The new
slider `ui_shout_hold` (1 … 10 s, step 0.5, default 1) sets a MINIMUM: the mirror line stays at least that long after it appeared; a longer voice keeps it to
the voice's end (`[AI]` reading of «время задержки отображения»). Code: `krinik_shout_fade.lua` (`hide`, `hide_later`, log «фраза снята через X с»),
`krinik_mod_settings.lua` (the row), `kit-krinik-modsettings.py` (the row's widgets).

**Stand.** The oasis boss (`HumanoidNPCCharacter_20percentbigger_boss_C`, at ≈ (−80129, 241441, −20115) on 2026-11-01), the hero teleported 3 m from it, god on
(`_config/god-on.sh`), daytime; the kappas that bit the hero (`BP_NPC_Wildlife_Kappa*`) killed by the remote first; the boss attacks the hero and shouts in
combat. Game behind (`launch-bg.ps1`). The setting is changed by the hub's own slider — a REAL click (`wait-input-idle.ps1` + `mouse-seq.ps1`) after the
page switch is confirmed by the log line «page ui» (a click on an unconfirmed page hit the camera page once, see the report).

**Dimensions.** Slider value: default (1) · a middle value (4) · near the max (9.5). Voice length vs. hold: shorter (partition A, holds 4 and 9.5) · longer
(partition B — only at hold 1, where every voice ≥ 0.9 s). A new shout during the hold (state transition). Not covered: two renderers (split screen does not
exist in the build).

| # | Case | Steps | Expected | Status | Observed |
|---|---|---|---|---|---|
| H1 | The row on the hub page | open the hub (the remote), page KrinikConanUI | the last row «(i) Сколько держится фраза врага · в секундах», slider at 1; frame at 4K | pass | the last row as expected, slider at the left end, «1»; 4K frame (11:36) |
| H2 | The slider saves | drag to 4, «Сохранить» | `KrinikSettings.lua` holds `["ui_shout_hold"] = 4` | pass | real mouse on the track at 1/3, «Сохранить» → `["ui_shout_hold"] = 4` (11:36:54) |
| H3 | Hold 4: a short voice holds 4 s | combat with the boss, 10+ shouts | log «фраза снята через 3.9…4.1 с» for every shout not interrupted by the next one | pass | 12 lines 11:37:08–11:39:37, every one 4.00–4.01 s; applied at the save, no restart |
| H4 | Control — default 1 | `ui_shout_hold` absent (default), same combat | removal times 0.9…1.8 s — the voice's own length, as before | pass | 1.01, 1.20, 1.50, 1.53, 1.04, 1.31 s, and 1.99 s for the first shout |
| H5 | A new shout during the hold | hold 9.5, combat | the text changes to the new shout; the number of «снята» lines ≤ the number of shouts; no line stuck on screen after combat ends + 10 s | pass | ≈ 10 shouts a minute, «снята» lines only every 15–20 s (9.50–9.51 s); frames: «Умри!» → «Отведай смерть!» → «Не на того напал!» replaced in place; 13 s after the boss died — no text |
| H6 | By eye: the text stays and fades in place | a burst of frames around shouts | the line stands ≈ the hold in one place, then goes | pass | 30 s burst, 4 frames/s (the game behind — no screen clip): «Боги тебя побери!» in one place from 6.8 to 15.5 s of the burst; the 0.2 s fade itself — case S6 of 2026-10-31 |
| H7 | Cost | the minute summary line of the section | worst call ≤ 1 ms | pass | worst 1.000 ms (the os.clock step), 17–23 ms per 240–343 calls a minute; the first minute 3 ms — the one-off mirror build |
