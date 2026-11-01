# Mod notes — JaarFishing («[Enhanced] Exiles Fishing», KRINIK MODIFIED)

> **Created:** 2026-10-30 · **Parent:** plan 36 W18a (difficulty captions); the mod-notes lock (KAIF #186); written from the manifest entry and the game map
> (`GAME_ARCHITECTURE_INTERNAL_MAP.md` lines ≈57–60, ≈440–444, ≈463–470, the fish card)
> **Status:** living notes — the ONE place for this mod's internals
> **Outbound:** —

**What it is.** A fishing mini-game mod with a server admin panel («Настройка рыбалки»). Its own text table `DT_ExilesFishing_Texts` (struct
`S_ExilesFishing_Texts`) is read by the fish, the codex, the mini-game and `JaarFishing_ActorComponent`; the author's translations (FR `3724537904`, DE, ES,
PT) are table paks. The admin panel (`BPC_EFT_Tuning`, `W_EFT_FishCard`) does NOT read that table — literal strings in bytecode.

## Where things are

- Our patched pak: built by `_config/devkit/rebuild-krinik-paks.py --only JaarFishing` (manifest field `krinikBuild`: assets `W_EFT_Panel`, `BPC_EFT_Tuning`,
  `W_EFT_AdminButton`, `W_EFT_FishCard`, `DT_FishRanges`, `DT_Fishing_UIModule` with their tables `_config/localization/asset-strings/JaarFishing__<asset>.tsv`,
  `_config/localization/fishranges-ru.tsv`).
- Panel module: `ExilesFishingTuning` (row in `DT_UIModuleTable`); the panel's classes load AFTER `ActivateModule ExilesFishingTuning` and reload on every
  open (a template edit is lost after a re-open); the panel builds its 34 tooltips at birth.

## Our edits (KRINIK MODIFIED)

| Asset | Edit | Why |
|---|---|---|
| `W_EFT_Panel`, `BPC_EFT_Tuning`, `W_EFT_FishCard`, `DT_FishRanges` | Russian: panel texts, difficulty / step / place names, 51 fish names; literal strings in bytecode (`lit:` rows, `kismet.py`) | translation (2026-10-26) |
| `W_EFT_AdminButton` | caption «Настройка рыбалки» | the owner's word 2026-10-26 |
| `BPC_EFT_Tuning` | both 0.3 s timers `CheckInventory` → 1e9; `Graft` is NOT called since 2026-11-01 — the «Настройка рыбалки» button is gone from the inventory bar; the panel opens from «Настройки модов» → «Рыбалка» (`KrinikConanUI` section `krinik_mods_button`; `[OWNER]` 15:49 «настройки рыбалки … оттуда уходят») | no polling (2026-10-29) |
| tooltip `W_EFT_Tooltip` | not edited (a splice `addprop` of `WrapTextAt` crashed the game, EXP-0377); the wrap is fixed by our Lua 1 s after the open | flicker (W17) |

Difficulty names (W_EFT_Panel table rows 42–45): Easy «Легко» · Relaxed «Спокойно» · Seasoned «Строже» · Vanilla «Ваниль» — the captions under the
difficulty slider (W18a).

## The difficulty block of `W_EFT_Panel` (read 2026-10-30 16:4x from the extracted JSON, 521 exports)

`LeftCol` (VerticalBox): slot 0 `S_Diff` (section title, size 15, letter spacing 30) · slot 1 `PresetRow` (HorizontalBox: `Slider_Preset` — Max 3.0,
Step 1.0, `MouseUsesStep`, i.e. four positions — Fill; then `Size_Btn_Custom` 120 × 34 with padding Left 14) · slot 2 `PresetLabels` (HorizontalBox, slot
padding Right 134 = the button 120 + 14, so the labels span exactly the slider) · slot 3 `Txt_PresetState` (size 18).
`PresetLabels`: four Fill slots with weights **1 · 2 · 2 · 1** → `Txt_Preset0` «Легко», `Txt_Preset1` «Спокойно», `Txt_Preset2` «Строже», `Txt_Preset3`
«Ваниль» (HitTestInvisible). The weights put the middle two centres under the slider's 1/3 and 2/3 stops and leave the ends 1/6 each — the ends must be
left / right justified to sit under 0 and 1. Russian words are wider than the English ones, so a word wider than its share runs into the next (W18a).
**Seen in the game 2026-10-30 16:39 (frame, 4K):** the captions already stand where the design puts them — «Спокойно» centred under the 1/3 stop,
«Строже» under 2/3, «Ваниль» right-aligned under the end (setting the justification live to Left · Center · Center · Right changed nothing — it is
already so). What the owner sees as «run together / uneven» is the GAPS: «Легко Спокойно» and «Строже Ваниль» almost touch, a wide gap between
«Спокойно» and «Строже». Equal gaps and «under the stops» cannot both hold with these words at this slider width — a taste fork for the owner (W18a).

## Open

- W18a DONE 2026-10-30 16:46 by our Lua (`KrinikConanUI:PauseGameInMenu` 0.14.0 `fix_fishing_captions`, 1 s after every open): `Txt_Preset0` = the four words joined by « | », centred, `Txt_Preset1..3` collapsed — one line exactly the slider width (report `testcases/reports/2026-10-30_conan-fishing-difficulty-captions.md`); the look waits for the owner. The request was — the owner (2026-10-30 ≈08:15): «вот тут подписи сложности нужно чем-то
  разделить, может вертикальными чертами и расставить на равномерном расстоянии, это подпись к ползунку». Layout of the caption row — not read yet.
