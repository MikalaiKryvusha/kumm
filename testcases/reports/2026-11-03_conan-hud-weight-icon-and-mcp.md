# Test run report — the HUD weight icon in Hosav's style; ModControlPanel out, LBPR's window in «Прочее»

**Created:** 2026-11-03 22:46 +03:00 · **Run by:** the agent (Claude Opus 5.5) · **Version/build:** pack ConanExiles after `d569d13` + this commit (KrinikConanUI kit pak
with `T_BuffIconEncumberance_T1`, `krinik_mods_button` with LBPR, the manifest without ModControlPanel)

## 1. Work

(1) `[OWNER]` 2026-11-03 20:14 «под иконкой перегруза тень слишком сильная, не такая, как под жаждой и голодом» · «Сделать однотипно легко всем иконкам худа».
(2) The guide's known issue «В окне ModControlPanel стоит надпись «Нет доступных виджетов»» — `[AI]` by mandate (`[OWNER]` 22:39 «аналогичный вопрос про
автономность работы»): the panel out of the build, LBPR's own window into «Настройки модов → Прочее».

## 2. Contour

The working game `D:\Games\Conan Exiles 3.0.1`, the owner's oasis save, a full `Deploy-ModPack.ps1 -Deploy` (72/72 mods, verify 107 present, 0 missing;
`modlist.txt` 65 lines, no ModControlPanel), a fresh start, the hero overloaded (199 / 145) with food and water at 0 % — all three icons blinking.
REAL WORLD: accumulated — the owner's working game and save; data and machine — his; path — the deployed paks loaded by a normal start.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-11-03 22:41 +03:00 | `rm …/Mods/ModControlPanel.pak` · `Deploy-ModPack.ps1 -PackDir D:/work/ai_sandbox/ConanExiles -Deploy` | 0 · «72/72 mods, 138 files · verify 107 present, 0 missing» |
| 2 | 2026-11-03 22:45 +03:00 | `launch-bg.ps1` · `enter-world-remote.sh` · `capture-window.ps1 -Width 3840` ×3 · `pult.sh "lua … Image_Weight … Blueprint_GetSizeX()"` | «T_BuffIconEncumberance_T1 256x256» |
| 3 | 2026-11-03 22:45 +03:00 | the game held in front (`mouse-seq.ps1 -Seq "wait:6000"`), `ActivateModule(FName('LBPRWidgetID'), true, false)`, `ddagrab` frame, `ActivateModule(…, false, false)` | the window on the frame |

## 4. Checks

Hygiene: `node --check _config/public_release/mods-table.mjs`, `py_compile build_nexus_description.py`, the manifest parsed (77 mods).
Functional run: the deployed build started normally; the HUD icons read on 4K background frames; LBPR's window opened by its module with the game in front
and read on a frame.

| Case | Status | Observed |
|---|---|---|
| W1 the weight icon's texture in game | pass | live `Image_Weight` brush → `T_BuffIconEncumberance_T1` 256 × 256 (was 64 × 64) |
| W2 the three icons look alike | pass | frames (3 phases of the blink): stomach, drop and weight each with a thin dark outline, no soft halo under the weight, red together in one phase |
| W3 the vanilla buff bar's encumbrance icon | not run | the same texture there — not looked at |
| M1 the build without ModControlPanel | pass | `modlist.txt` 65 lines, 0 «ModControlPanel»; deploy verify 0 missing |
| M2 LBPR's window opens by its module | pass | frame: «Меньше ограничений на строительство», tabs «Строительные Блоки · Размещаемые предметы · Рабы · О моде», «Сохранить» |
| M3 the entry in «Настройки модов → Прочее» by a real click | not run | the list row is data (`SUB.other`, `SLOTS` 7); the click path is the same as the other twelve windows |

## 5. Found

- LBPR's window is the author's full-screen, see-through panel over the HUD (frame M2) — not ours to judge without the owner's eye.

## 6. Traces

Frames in the session scratchpad (`icons_new.webp`, `lbpr2.webp`) — deleted after the commit.

## 7. Verdict

partial — W1, W2, M1, M2 pass; W3 and M3 not run (named above). The look of the new weight icon waits for the owner's eye.
