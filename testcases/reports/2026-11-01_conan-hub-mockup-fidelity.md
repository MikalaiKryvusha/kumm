# Run report — 2026-11-01 · the «Моды Krinik'а» window reaches mockup 5 (the fidelity pass)

## 1. Work

Cases `testcases/TC_conan_hub_mockup_fidelity_2026-11-01.md` (parity rows P1–P11, functional F1–F10, the side-by-side V1); basis — the approved mockup 5
(`_config/settings_hub/mockups/mockups.html?v=5`, its CSS) and the owner's word `[OWNER]` «из этого кадра явно видно, что макет красивый, а реализация в
игре - нет» · 2026-11-01 04:40.

## 2. Contour

Conan Exiles 3.0.1 with the full build; background launch; the owner's save copied to `D:\Games\_save-backup\2026-11-01_0505-before-hub-fidelity`
(Game_0.db + every mod .sav) before and restored after; the remote `KrinikAgentRemote`; real mouse `mouse-seq.ps1`; frames `capture-window.ps1`.
Builds: pak 1 (05:08, the first fidelity kit) and pak 2 (05:16, text sizes and the footer order), both by `kit-krinik-modsettings.py` (runs 3–8 clean)
+ `kit-buildmod.py KrinikConanUI`, deployed by `Deploy-ModPack.ps1 -Deploy -Only KrinikConanUI` (verify 106 present, 0 missing).

## 3. Runs

- 2026-11-01 04:55–04:58 — `kit_import_font.py` twice: the font factory crashed the commandlet both times (`Assertion failed: CurrentApplication.IsValid()`),
  with and without `-NullRHI`; replaced by the game's own PT Serif (`retoc list --path pakchunk1110-Windows.utoc`).
- 05:00–05:16 — `UnrealEditor-Cmd … -Script=_config/devkit/kit-krinik-modsettings.py -ModDevKit -NullRHI` ×8 (runs 1–2 exit 1: a SizeBox added into the
  «i» Border orphaned the text; fixed; runs 3–8 exit 0, 0 GUID errors), `python -I -X utf8 _config/devkit/kit-buildmod.py KrinikConanUI <out>` ×2.
- 05:09 — game run 1 (pak 1): `launch-bg.ps1`, `enter-world-remote.sh`, `god-on.sh`, `pult.sh "lua FindFirstOf('GUIModuleController'):ActivateModule(…)"`,
  `mouse-seq.ps1 -Seq "move:…,lclick,…"` (page, checkbox, slider drag `ldown,move,lup`, save, reset, close), `capture-window.ps1 -Width 3840`.
- 05:17 — game run 2 (pak 2): the same + «i» click, `pult.sh "exec r.SetRes 1280x720f"` … `3840x2160f`, close and a world click; `close-game.ps1`;
  `save-restore.sh <backup>`, every `.sav` copied back and compared (`cmp`, 0 differ); `KrinikSettings.lua` removed (the owner had none).

## 4. Checks

Hygiene: `luac -p` ok; `check-lua-game-thread.py` — 0 worker-thread calls; kit report `ok: true`; `mod-overrides.py` — the same 8 vanilla overrides + our table.
Functional run: the window walked with the real mouse in the live world on both paks; frames read at 4K; the section log read.

| Case | Status |
|---|---|
| P1 panel · P4 rules · P9 buttons | pass — flat near-black panel, thin light rim and rules, flat dark buttons (frames h1, h5) |
| P2 font | pass — PT Serif for Cyrillic and Latin (frame h1) |
| P3 title | pass — bold «МОДЫ KRINIK'А», grey dot, regular «НАСТРОЙКИ», letter-spaced |
| P5 list | pass — dark box, light bar, bright name on the selected mod (frames g2, h5) |
| P6 slider · P7 value | pass after pak 2 — thin track, narrow light thumb, plain values with the unit; pak 1 overflowed («2125» → «212») |
| P8 checkbox · P10 «i» | pass |
| P11 plate | pass — dark, light rim, title in capitals (frame h3) |
| F1–F7 | pass — see the case file (drag 90 → 70 %, check toggle, store 2 keys, reopen, reset, close without save, page click) |
| F8 «i» | pass by a click (pinned plate); a hover could not be shown — `mouse-seq` hands the focus back and the game reads hover only with focus |
| F9 720p · 1080p · 2K · 4K | pass — the same layout, nothing cut (sheet `res_sheet`) |
| F10 closed | pass — «watch stopped (window closed)»; a world click after it logged nothing |
| V1 side by side | looked at by the agent: the same look; the owner's eye — review folder `41_hub_kak_maket` |

## 5. Found

1. Pak 1: the mockup's own text sizes overflowed the build's longer rows («2125» cut, a slider pushed out) and made every mod name a marquee — fixed in pak 2
   (the mockup's ratios at label 19, slider 180).
2. Pak 1: «Сбросить к исходным» stood at the right — the reused spacer kept its old place — fixed (spacer and buttons re-added in the mockup order).
3. The kit cannot import a font (no SlateApplication in the commandlet) — not needed: the game cooks PT Serif (EXP-0420).

## 6. Traces

Session scratchpad `fid/` (g1–g5 pak 1, h1–h6 pak 2, `res_*`, `V1_maket_i_igra.webp`), kit logs `kit_hub_1…8.log`, build logs `build_ui*.log`.
The owner's review folder `D:\Games\Conan Exiles Mods\НА ОТСМОТР НИКОЛАЕМ\41_hub_kak_maket\` (replaces `39_hub_look`).

## 7. Verdict

pass — every parity row and functional case seen in the built pak in the live game; the look itself (taste) waits for the owner's eye.
