# Test run report — «Клавиша вызова курсора» in The Damage Meter and Simple Minimap, and the refresh-rate label that ran over the key box

**Created:** 2026-11-01 20:45 +03:00 · **Run by:** the agent (Claude Opus 5.5) · **Version/build:** pack ConanExiles, `Game.locres` after `locres-fixes-2026-11-01b.tsv` and `-01c.tsv`

## 1. Work

`[OWNER]` 2026-11-01 20:37 «ну так это же не клавиша мыши, а клавиша клавиатуры» · 20:38 «Клавиша вызова курсора». Cases K1–K3 of
`testcases/TC_conan_hub_rows_audit_2026-11-01.md` (section «The cursor key's name»).

## 2. Contour

The live game 3.0.1 in the BACKGROUND (`launch-bg.ps1`, the owner 20:38 «работай с игрой в фоне»), the world entered by `enter-world-remote.sh`; the mods' settings
windows opened by the remote (`ActivateModule(FName('DN_UI_Settings'|'SM_UI_Settings'))`); frames by `capture-window.ps1` (PrintWindow, 4K window).
REAL WORLD: accumulated — the owner's live save and mod saves; data and machine — his; path — the mod's own settings window as the player opens it (the hub's
«Моды Xevyr'а» opens the same module).

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-11-01 20:40 +03:00 | `locres-set-tr.py Game/ru/Game.locres locres-fixes-2026-11-01b.tsv`; `locres-regress.py` | 2 entries changed, 0 lost |
| 2 | 2026-11-01 20:41 +03:00 | `Deploy-ModPack.ps1 -Deploy -Only KrinikConanRussianTranslation`, `launch-bg.ps1`, `enter-world-remote.sh`, the two windows | K1 label right, the key box overlapped (K3); K2 pass |
| 3 | 2026-11-01 20:43 +03:00 | `dm-fish-ru.tsv` rows 58–59, `locres-set-tr.py … locres-fixes-2026-11-01c.tsv` (the tool learnt the two letters `\n`) | 2 entries changed (one of them a three-line tooltip) |
| 4 | 2026-11-01 20:44 +03:00 | redeploy, relaunch in the background, the Damage Meter window again | K3 pass |

## 4. Checks

Hygiene: `locres-regress.py` 0 lost both times; `modpack.json` parses.
Functional run: the two settings windows in the live game, frames read at 4K.
K1 pass — «Клавиша вызова курсора» fits its line above the F1 box. K2 pass — Simple Minimap «Клавиша вызова курсора» with F1 beside it. K3 pass — after the fix
«Частота обновления полос» stays in its column, the F1 box is clear (before: «Частота обновления полос (только вид)» ran left over it).

## 5. Found

1. The Damage Meter label «Частота обновления полос (только вид)» (our translation of «Bar refresh rate (visual only)») ran left over the key box — the
   label is right-aligned to its slider. «(только вид)» moved into the row's tooltip: «Как часто обновлять полосы — только их вид, подсчёт урона не меняется».
2. `locres-set-tr.py` could not replace a multi-line entry — it now reads the two letters `\n` as a line break, as `dm-fish-ru.tsv` does.

## 6. Traces

Frames (session scratchpad, removed after the commit): `k1_crop.webp` (the overlap), `k1b_crop.webp` (fixed), `k2.webp` (Simple Minimap).

## 7. Verdict

pass — the owner's name stands in both mods; the overlap found on the way is fixed and seen fixed.
