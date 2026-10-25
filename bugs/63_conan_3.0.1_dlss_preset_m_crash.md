# Bug 63 — Conan 3.0.1 crashes on the first DLSS frame with our `r.NGX.DLSS.Preset=13`

**Status:** ✅ fixed and verified 2026-10-25 17:03 (DONE after the owner plays a session)
**Severity:** S2 — a run lost, the owner saw the crash reporter window
**Version/build:** Conan Exiles Enhanced 3.0.1 (CL-379176), DLSS `nvngx_dlss.dll` 310.9.1, Streamline 2.14.1, pack `ConanExiles` `e2b5959`+
**When/context:** 2026-10-25 16:56, the first launch after `deploy-config.py` restored the owner's `GameUserSettings.ini` (DLSS instead of the auto-picked TSR)
**Fixing:** this session

## Symptom
The game dies 3 s after the mods mount, before the main menu: `Unhandled Exception: EXCEPTION_ACCESS_VIOLATION writing address 0x0000000000000000`,
`LogRHI: Error: Breadcrumbs 'RHIThread' - DLSS - PostProcessing`; Unreal's crash reporter opens on the owner's screen.

## Why it was never seen before
3.0.1 had been running on its own auto-picked settings since the move (TSR, quality 2–3, 1280×720 in the file, VSync, 60 fps cap): the pack's
`Game.ini` / `GameUserSettings.ini` had never been deployed to 3.0.1 — only `Engine.ini`. With TSR the DLSS line was inert.

## Repro and bisect (live, machine lock, `launch-bg.ps1`)
| Run | Live `Engine.ini` | Result |
|---|---|---|
| 16:56 | `r.NGX.DLSS.Enable=1` + `r.NGX.DLSS.Preset=13` (pack as is), `PerfBoostMode=DLSS` | crash, UECC report `…_0000` |
| 16:58 A | all `r.NGX.DLSS.*` commented | menu, alive 50 s |
| 16:59 B | `Enable=1`, `Preset` commented | menu, alive; world entered 17:01, alive, 70.8 fps median in 4K |
| 17:02 | the fixed pack deployed | menu, alive, `Creating NGX DLSS Feature … 2228x1253 → 3840x2160` |

## Root cause
Not established inside the DLSS runtime. Not the DLL age: 3.0.1 ships a NEWER DLSS (310.9) than 2.2.3 (310.6), which accepted preset M. Forcing the
preset through the cvar is what crashes 3.0.1; the game's own preset choice works.

## Fix
Pack `_config/Engine.ini`: both `r.NGX.DLSS.Preset=13` lines commented with the reason; `r.NGX.DLSS.Enable=1` kept.

## Guard
The class is "a config change reaches the game untested". Since 2026-10-25 the test hook `tools/hooks/test-after-code.mjs` makes every `.ini` edit
and every deploy a `game` debt that only a game run clears — this crash was caught by exactly that run. No cvar-specific guard: one cvar is an
instance, not the class.

## Decisions made without the owner
- `[AI]` Dropped preset M rather than trying K (11) or J (10): the game's own preset works and the owner judges the picture; a forced preset is a
  taste choice to offer him, not to guess.
- `[AI]` Did not deploy the pack's old `Input.ini` (263 action mappings of UE 5.6) to 3.0.1 on UE 5.8 with Enhanced Input.

## Links
`plans/33_conan_pereezd_3.0.1.md` · `testcases/TC_conan_3.0.1_new_mods_2026-10-25.md` (SW cases) · `ConanExiles/_config/Engine.ini`
