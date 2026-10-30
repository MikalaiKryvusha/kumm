# Run report — Conan: the corpse prompt on two lines (W6) and the quick-loot window size (W10a)

## 1. Work

Plan 36 W6 and W10a against `testcases/TC_conan_corpse_prompt_two_lines_2026-10-30.md` (cases M1, B1, P1, P1b, P1c, S1/C1, Q1). Basis: the owner's
words «переносить на две строки … со слова "или"» and «(удерживайте) … сократить до (удерж.)» (2026-10-30 08:32).

## 2. Contour

Conan Exiles 3.0.1 with the build, background launch path (`launch-bg.ps1`, the owner's word 18:23); KrinikConanUI kit pak rebuilt four times
(`kit-conanui-edit.py` + `kit-buildmod.py`: pad 2 → 8 → 1, label «(удерж.)»), `Game.locres` with the override row (54 451 entries); saves: the owner's copies
`_save-backup/2026-10-30_1831-before-w6-corpse-prompt` (oasis) and `…_1915-before-w6-w10a-run` (his play 18:55–19:0x), each restored by `save-restore.sh`;
mixer volume 1 %; machine lock 18:29–19:4x (released 18:5x–19:08 while the owner played his own game, PID 22920 — not touched).

## 3. Runs

- 2026-10-30 18:32–18:54 run 1: `launch-bg.ps1` · `enter-world-remote.sh` · `god-on.sh` · `corpse-stand.sh 50` · a crocodile killed (`KillCharacter` by full name) · `corpse-loot-geom.sh b1b` (B1) · remote size read (M1, blocked) · `close-game.ps1` · kit pad 2 · deploy · run 2 18:48–18:54 `corpse-loot-geom.sh p1n` (P1).
- 2026-10-30 19:15–19:24 run 3 (pad 8): `corpse-loot-geom.sh p1b`; a teleport into geometry held «Delaying playing state» 19:17:52–19:19:24.
- 2026-10-30 19:27–19:31 run 4 (pad 1): `corpse-prompt-shot.sh p1c` + retries (P1c).
- 2026-10-30 19:33–19:43 runs 5–6 (control `Game.locres` without the break): `corpse-prompt-shot.sh c1` (the exiles' camp spot failed — live NPCs and occlusion), the oasis save → `c1` (C1); `WidgetSwitcherTooltips:SetActiveWidgetIndex(0|1)` + `capture-window.ps1 -Width 3840` (Q1); the pack `Game.locres` redeployed (byte-equal).

## 4. Checks

Hygiene: kit reports `ok=True` each pass; `mod-overrides.py` on the built pak — 5 vanilla widgets incl. `W_ActionTutorial` (the first build had 4: CookInfo trap); `locres-regress.py` 54450 → 54451, lost 0, changed 0.
Functional run: walked in the live game in the background, frames READ: B1 pass (one line); M1 blocked (`GetDesiredSize`/`GetCachedGeometry` not callable from Lua) → by frame; P1 two lines pass; P1b fail (icon too high); P1c pass (two lines, plate within 1 px); S1/C1 pass (one line, plate 1055–1116 vs 1056–1117); Q1 pass by remote (window edges 3722/1608 equal in both states, «(удерж.)» shown).

## 5. Found

- The kit cooks only `Local/CookInfo.ini` entries — a new vanilla widget was silently left out of the pak (fixed: its line added).
- My first icon detector caught background (grass, blood) and reported «12.5 px low» — wrong; pad 8 built on it set the icon 14.5 px too high (refuted by the plate-edge measure `_config/plate-measure.py`).
- Our kit pak wrote «Забрать все (удерживайте)» over the translated label (fixed: «(удерж.)»).
- `K2_SetActorLocation` with the teleport flag / into geometry triggers the game's teleport state and a ≈ 90 s loading screen (`corpse-prompt-shot.sh` moves without the flag, 150 cm above).

## 6. Traces

Frames `D:\Temp\claude\d--work-ai-sandbox-KUMM\34cf4362-…\scratchpad\w6\` (`b1b`, `p1n`, `p1b`, `p1c`, `c1`, `ql_0`, `ql_1`); the owner's review folder
`D:\Games\Conan Exiles Mods\НА ОТСМОТР НИКОЛАЕМ\11 подсказка над трупом и окно лута`; kit reports `_config/devkit/kit-conanui-edit.json`, `kit-probe-action-tutorial.json`,
`kit-probe-quickloot.json`; game log `ConanSandbox.log` 19:17–19:19 (teleport state). Crash reporter: none of the agent's runs.

## 7. Verdict

pass (W6 layout and its control; W10a size by remote) — the owner's eye on the two-line look and his real wheel on the loot window are pending.
