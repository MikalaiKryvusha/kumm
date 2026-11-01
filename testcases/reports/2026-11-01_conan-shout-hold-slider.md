# Test run report — Conan: the hub slider «Сколько держится фраза врага» (how long an enemy shout stays on screen)

**Created:** 2026-11-01 11:46 +03:00 · **Run by:** the agent (Claude Opus 5.5) · **Version/build:** Conan 3.0.1 build, KrinikConanUI pak rebuilt 11:31 (kit), pack after `9685492` + this change

## 1. Work

`[OWNER]` 2026-11-01 08:49 «я бы в мод UI криника вынес настройку времени задержки отображения фраз на экране». A new hub row `ui_shout_hold` (1–10 s, step
0.5, default 1) read by `krinik_shout_fade.lua` at every shout: the mirror line stays at least that long after it appeared, a longer voice keeps it to its end.
Cases H1–H7 of `testcases/TC_conan_shout_hold_2026-11-01.md`.

## 2. Contour

The owner's machine, the live Conan Exiles 3.0.1 build (64 paks + Lua mods), KrinikConanUI deployed by `-Deploy -Only KrinikConanUI`, game behind
(`launch-bg.ps1`, PID 33224), world entered by `enter-world-remote.sh`, god on; the oasis boss's real combat shouts; the hub driven by a real mouse while the
owner's input was idle. REAL WORLD: accumulated — the owner's own install and save, the camera's own `config.lua`; data and machine — his PC; path — the player's
hub page and the game's real shouts. Verified on the real world.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-11-01 11:24–11:31 +03:00 | `UnrealEditor-Cmd … -Script=D:/…/kit-krinik-modsettings.py -ModDevKit -NullRHI` ×2; `python -I -X utf8 _config/devkit/kit-buildmod.py KrinikConanUI <scratch>` | pass 1 rc 1 (GUID trap, expected), pass 2 rc 0 — `Sld_ui_shout_hold` in the report; pak 9 730 681 bytes |
| 2 | ≈ 2026-11-01 11:31 +03:00 | `Deploy-ModPack.ps1 -PackDir . -Deploy -Only KrinikConanUI` | verify 106 present, 0 missing |
| 3 | 2026-11-01 11:32–11:35 +03:00 | `launch-bg.ps1`, `enter-world-remote.sh`, `god-on.sh`, remote teleport to the boss, kappas killed | world 24 s; default hold — H4 log |
| 4 | 2026-11-01 11:36–11:39 +03:00 | remote `ActivateModule(KrinikModSettings)`, `mouse-seq.ps1` page click, track click at 1/3, «Сохранить», Esc | H1, H2, H3 |
| 5 | 2026-11-01 11:41–11:44 +03:00 | the same with the track end + «Сохранить и закрыть»; `capture-burst.ps1 -Count 120 -IntervalMs 250`; boss killed by the remote | H5, H6; `close-game.ps1` — closed cleanly in 6.2 s |

## 4. Checks

Hygiene: both Lua files load (`lua -e "assert(loadfile(…))"`); `check-lua-templates.py` — 43 files, 0 findings; the kit script parses.
Functional run: the hub page read on a 4K frame (the new row last on KrinikConanUI), the store file read after the real «Сохранить», the section's log line
«фраза снята через X с» read for every shout at holds 1, 4 and 9.5, a 30 s frame burst of the subtitle band read by eye, a frame 13 s after the boss died.

| Case | Status | Observed |
|---|---|---|
| H1 the row | pass | «(i) Сколько держится фраза врага · в секундах», slider at 1 |
| H2 the save | pass | `["ui_shout_hold"] = 4` |
| H3 hold 4 | pass | 12 shouts, all 4.00–4.01 s, live without a restart |
| H4 control, default | pass | 1.01–1.99 s — the voice lengths |
| H5 replacement, no stuck line | pass | hold 9.5: replacements in place, «снята» only after the last shout of a burst; no text 13 s after the boss died |
| H6 by eye | pass | one line stands ≈ 9.5 s in place |
| H7 cost | pass | worst 1.000 ms per minute (the clock step), ≈ 0.07 ms per call |

## 5. Found

- An agent's own slip, not a defect of the mod: one click meant for the KrinikConanUI page did not switch the page (the window had opened 3 s earlier); the next
  click on the «same» row hit «Дальше всего от героя» on the camera page and «Сохранить и закрыть» handed the camera 2925 instead of 2125. The camera had not
  taken the set yet (it takes it when a game window closes); the next save with the camera unchanged wrote an empty set; the camera's `config.lua` stayed
  2125 (read after the run). The stand now confirms «page ui» in the log before any click on a row (written in the case file).
- The game save holds the hero without armour («Лёгкая / 0») — the open item of STATUS, not this change.

## 6. Traces

`UE4SS.log` 11:32–11:44 (lines `[KrinikConanUI:ShoutFade]`, `[KrinikConanUI:ModSettings]`); frames in the owner's review folder
`D:\Games\Conan Exiles Mods\НА ОТСМОТР НИКОЛАЕМ\44_kriki_vremya_na_ekrane\` (`1_stroka_v_okne_modov.webp`, `2_frazy_derzhatsya_9_5_s.webp`); the burst in the
session scratchpad. The store file `KrinikSettings.lua` (only the test key) removed after the run. Crash-report window: none.

## 7. Verdict

pass — the row, the save and the hold work in the live game at 1, 4 and 9.5 s; the default keeps the game's own timing. The owner's eye: the default value.
