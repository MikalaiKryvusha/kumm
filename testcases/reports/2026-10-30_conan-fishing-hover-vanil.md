# Test run report — gold hover outline on «Настройка рыбалки»; «ваниль» on the fish card

**Created:** 2026-10-30 00:34 +03:00 · **Run by:** the agent (Claude Opus 5.5) ·
**Version/build:** Conan Exiles 3.0.1 + the Conan build; `KrinikPauseGameInMenu` 0.12.0; `JaarFishing.pak` KRINIK MODIFIED built 2026-10-30 00:30
(`W_EFT_FishCard`: «table» → «ваниль», `BaseSize` 66 → 92, `EditSize` 76 → 66)

## 1. Work

STATUS handover items 2 (hover outline, the owner's «да, не хватает обводки») and 3 (the fish-card word). Cases —
`testcases/TC_conan_fishing_hover_outline_and_vanil_label_2026-10-30.md` (H1–H5, V1).

## 2. Contour

The live game on the owner's save, 4K, game in front, real cursor and keys; machine lock `kumm` 00:18–00:33.
REAL WORLD: accumulated — the owner's save and mod settings; data and machine — his save, his machine; path — Tab → «Снаряжение» → the bottom bar and the
fishing panel, as he opens them — verified on the real world.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-10-30 00:19 +03:00 | remote reads (`pult.sh "lua …"`): look tree, `ImgFrame` / `ImgBackground` materials and their `PercentHover` | the hover glow is the materials' `PercentHover`; the look hit-testable eats the click (panel did not open) |
| 2 | 2026-10-30 00:22 +03:00 | `pult.sh "lua <fishbtn-hover-experiment.lua as one line>"` (own Overlay by `StaticConstructObject` + hovered brush) | the game crashed (`EXCEPTION_ACCESS_VIOLATION reading 0x70`, UE4SS stack, `UECC-Windows-24DE904D4C62A3B3048F91BBA82E0B5E_0000`); crash window closed, PID 28276 |
| 3 | 2026-10-30 00:24 +03:00 | remote, one step per call: `size:SetContent(look)`; `Overlay_16:AddChildToOverlay(e.Btn_Open)`; `look:SetVisibility(4)`; `hovtest.ps1 -Tag h` | hover gold on the right button, click opens the panel |
| 4 | 2026-10-30 00:24–00:30 +03:00 | remote `SetWidthOverride` on all 62 cards: 100, 88, 93, then 92 + `EditSize` 66; `scroll.ps1` | 92/66 keeps labels and the longest names whole |
| 5 | 2026-10-30 00:31 +03:00 | relaunch with the shipped 0.12.0 + pak; `seq.ps1 'key:0x09'`; `hovtest.ps1 -Tag m`; frame of the cards; `seq.ps1 'key:0x1B','key:0x45','key:0x45','key:0x51','key:0x51'`; `hovtest.ps1 -Tag t` | all pass |

## 4. Checks

Hygiene: `patch-mod-asset.py` build guards green, «W_EFT_FishCard: заменено строк: 2», «'table ' → 'ваниль '».
Functional run: walked Tab → «Снаряжение» → cursor away / on fishing / on Hosav / click / tab cycle by real input on the live game, read the 4K row strips
(`mhov.jpg`, `thov.jpg`), the panel frames (`mv1c.jpg`, `t-click.jpg`) and the «нижний ряд» / module lines of `UE4SS.log`.

- H1 pass · H2 pass · H3 pass · H4 pass · H5 pass · V1 pass.

## 5. Found

- An `Overlay` built from Lua by `StaticConstructObject` (or the struct copy in the same call) crashed the game — the remote experiment ran as one call, so
  the guilty step is not known; the shipped way uses the look's own `Overlay_16` and creates nothing.
- The look's 66-unit label box was sized for the English «table 80.0»: the Russian word pushed the number under the field.

## 6. Traces

Scratchpad of session 075c1f98: `hov.jpg`, `mhov.jpg`, `thov.jpg`, `v2c…v6.jpg`, `scroll.jpg`, `mv1c.jpg`, `t-click.jpg`; crash folder above; `UE4SS.log`
2026-10-30 00:31:14 «загружен 0.12.0», 00:32:09 and 00:33:01 «нижний ряд», 00:32:15 «модуль ExilesFishingTuning: открыт».

## 7. Verdict

pass — every case passed with the shipped code on the live game; the owner's eye pending (taste: the look of the gold frame and the close «ваниль 100»).
