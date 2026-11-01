# Test run report — Conan build: the screen-edge vignettes (hunger, thirst, low health) and their three shkalas in «Моды Krinik'а»

**Created:** 2026-11-01 14:23 +03:00 · **Run by:** the agent (Claude Opus 5.5) · **Version/build:** Conan Exiles 3.0.1 build 1.0.0 (pre-release), pack `D:/work/ai_sandbox/ConanExiles`, KrinikConanUI with the new section `krinik_vignette.lua` and the rebuilt kit pak (9 800 259 bytes)

## 1. Work

Plan `plans/40_epic40_phase1_vignettes.md` (epic 40 phase 1): recon of what draws the three vignettes, the section that scales each by its shkala (0 = off),
the shipped defaults (hunger 0, thirst 0, low health 0.10), three hub rows. Case set `testcases/TC_conan_vignettes_2026-11-01.md` (P1–P5, V1–V10). Along the
way the owner's remark of 14:08 on the hub's «i» circles was fixed (case V10).

## 2. Contour

The live game `D:\Games\Conan Exiles 3.0.1`, the game in FRONT (`launch-fg.ps1`), the live save (oasis −78166, 245999), god on, noon; the remote
`KrinikAgentRemote` (`_config/pult.sh`); real mouse `mouse-seq.ps1`; frames `capture.ps1` / `capture-window.ps1`; measure `_config/edge-band.py`. The machine lock
`kumm` 13:46–14:22. `REAL WORLD:` accumulated — the owner's build folder and save (the agent's to use, house rule 6), the store `Saved/KrinikSettings.lua`
deleted at the end (it held only the test's `ui_vig_hunger = 0.5`); data and machine — the owner's machine and game install; path — the player's: world entry,
the hub by its module, the real mouse on the shkalas and «Сохранить».

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-11-01 13:46 +03:00 | `powershell -File _config/launch-fg.ps1` + `bash _config/enter-world-remote.sh` | 0 · world in 24 s; recon P1–P5 |
| 2 | 2026-11-01 13:52 +03:00 | `bash _config/pult.sh "lua … c:ForEachProperty(…) … c:ForEachFunction(…)"` over `W_FullScreenBuffEffect_C` | CRASH — reporter closed by PID 14096 |
| 3 | 2026-11-01 13:56 +03:00 | `UnrealEditor-Cmd … -Script=…kit-krinik-modsettings.py … -NullRHI` ×2; `python -I -X utf8 _config/devkit/kit-buildmod.py KrinikConanUI <out>`; `Deploy-ModPack.ps1 -Deploy -Only KrinikConanUI` | run 1 exit 1 (GUID trap, 52), run 2 exit 0; build 0; verify 107 / 0 missing |
| 4 | 2026-11-01 14:00 +03:00 | launch + enter | the section loaded; health NOT taken (filter `WidgetTree_%d+%.` dropped the live effects) |
| 5 | 2026-11-01 14:01 +03:00 | filter fixed, redeploy, launch + enter; V3, V1, V2, V10 | «виньетка health: сила 0.10»; V1/V2 0.00 |
| 6 | 2026-11-01 14:06 +03:00 | `mouse-seq.ps1` drag of «Виньетка: голод» to 50 % + «Сохранить» | store written; «применено к 0» — FAIL (weak-keyed table) |
| 7 | 2026-11-01 14:07 +03:00 | table by full name, redeploy, restart; V8, V4, V7 | «загружен: голод 0.50»; «применено к 2»; op follows the shkala |
| 8 | 2026-11-01 14:14 +03:00 | kit ×2 with the square «i» box, build, deploy, launch + enter; V10 | run 1 exit 1 (GUID 8), run 2 exit 0; five «i» boxes 22.6 × 22.6 |
| 9 | 2026-11-01 14:20 +03:00 | health 15 %, op 0 / 0.05 / 0.10 / 0.15 / 0.25, `capture-window.ps1 -Width 3840` | review folder 48 written; `close-game.ps1` clean, no crash reporter |

## 4. Checks

Hygiene: `lua -e "assert(loadfile(…))"` on the three Lua files; `_config/check-lua-game-thread.py` 0; `_config/devkit/check-lua-templates.py` 0 of 44;
`lua _config/tests/test_krinik_settings.lua` PASS; `edge-band.py --selftest` ok (grey 0.00, framed 159.52).
Functional run: the live game in front, by the player's path — world entry, starving / thirst / wounds set by the remote, the hub opened, the shkalas dragged by
the real mouse and saved; READ: the section's log lines, the live widgets' `GetRenderOpacity()`, the store file, frames (edge-band, edge luma, diff maps, sheets
looked at). Case statuses — the TC file: P1–P5 pass; V1, V2, V7, V8, V9, V10 pass; V3, V4 partial (strength and proportion — the owner's eye); V5, V6 not run.

## 5. Found

- Crash on a reflection walk of `W_FullScreenBuffEffect_C` from Lua (13:52:26; the 13:31 crash read `Buff`) — avoided by design: the kind is decided from the
  hero's stats. Recorded in the research.
- The live effect widgets belong to the game instance, not to a widget tree — the template filter of EXP-0421 dropped them (fixed in the section).
- A weak-keyed Lua table loses UE4SS UObject wrappers at once — «Сохранить» applied to 0 effects (fixed; EXP entry).
- The hub's «i» was a lemon in rows built after the square SizeBox left the kit script (the owner 14:08) — fixed in the kit, all rows measured square.
- The pixel proportion at 50 % is not measurable on this stand (hunger fades in; the scene moves) — left to the owner's eye.

## 6. Traces

Scratch `D:/Temp/claude/d--work-ai-sandbox-KUMM/a8cd8fdc-f58e-43f7-99a8-ca26fe355086/scratchpad/vig/` (frames, `sheet_op.webp`, `hg_diff.webp`, `td_diff.webp`,
`sheet_v3.webp`, `sheet_v4.webp`, `hub_fixed_rows.webp`, traces, kit logs); the game log `ConanSandbox/Binaries/Win64/ue4ss/UE4SS.log` lines
`[KrinikConanUI:Vignette]`; crash `Saved/Crashes/UECC-Windows-…` 13:52; the owner's review `D:\Games\Conan Exiles Mods\НА ОТСМОТР НИКОЛАЕМ\48_vinetka_zdorovya_sila\`.

## 7. Verdict

partial — the mechanism works end to end on the player's path (defaults, shkala → live strength, far left = off, persistence, no cost while nothing shows);
open: the shipped low-health strength (the owner's pick, folder 48), the thirst and health shkalas not dragged by the mouse (V5, V6), the UI clip of rule 4
not recorded, and the 720p / 2K / 4K frames of the window (phase 6).
