# TC — the «Моды Krinik'а» window opens over the character UI with no dimming

> **Created:** 2026-11-01 · **Basis:** `[OWNER]` 2026-11-01 08:42 «нужно открывать поверх UI первоснажа, как и рыбался открывается - ты сделал какое-то
> затенение - не нужно» (STATUS handover, remark a) · **Mod notes:** `games/ConanExiles/mods/KrinikConanUI.md`

## Stand

- Place: the owner's save, world entered by `enter-world-remote.sh`; god on (`god-on.sh`); background launch (`launch-bg.ps1`).
- No creature needed; daytime (the frame must show the world behind the window to judge a dimming).
- Openers by the remote: `ActivateModule(FName('CharacterInventory'), true, false)`, `…('ExilesFishingTuning', …)`, `…('KrinikModSettings', …)`.
- Frames: `capture-window.ps1 -Width 3840` (native 4K).

## Cases

| ID | Situation | Action | Expected | Status | Observed |
|---|---|---|---|---|---|
| D1 | the inventory open | open the fishing settings window | the reference: how the game draws a mod Modal window over the inventory (dimming or not) | pass | 09:08: the inventory slots and the beach visible around the fishing window; no dark layer |
| D2 | the inventory open | open our window | the same as D1: the inventory visible behind, no extra dark layer | pass | the inventory visible around and faintly through our .94 panel — the same as D1 |
| D3 | the world, nothing open | open our window | record what the player would see (the frame of folder 41 was taken this way) | pass | mean brightness outside the window before / after: 149.0 / 146.9, 97.9 / 95.8, 113.8 / 113.0 — noise; our window adds NO dimming |
| D4 | after the fix | D2 again | no dark layer beyond what D1 shows; frame beside D1 | skipped | no fix needed: nothing dims |

## The taller window (`[OWNER]` 2026-11-01 08:42 «по высоте увеличить размер окна»; `MIN_HEIGHT` in `krinik_mod_settings.lua`)

| ID | Situation | Action | Expected | Status | Observed |
|---|---|---|---|---|---|
| H1 | a fresh game start with the deployed section | open the inventory, then our window | the log line «window height 845 (the tallest live page …, mockup 5 845)»; the window between the inventory's tab row and its button bar | pass | 09:13:48 and again 09:27:01 after the pak rebuild: «window height 845 (the tallest live page 575, mockup 5 845)»; frames: between the tab row and the button bar |
| H2 | the window open | switch to every page | the height stays (a page switch never resizes) | skipped | the override is set once at fill, before `select_page`; a switch only changes the switcher index (code read) — no real-mouse run this time |

## The «i» — variant 5 (`[OWNER]` 2026-11-01 09:13 «(i) - 5»; kit `sans_bold` in `kit-krinik-modsettings.py`)

| ID | Situation | Action | Expected | Status | Observed |
|---|---|---|---|---|---|
| I1 | the rebuilt pak, the window open on the camera page | look at every row's «i» | Noto Sans Bold upright «i», no outline, in the thin circle — like row 5 of the variants sheet; all rows alike | pass | 09:27 frame (4K), crop of the eight camera rows: all eight the bold upright sans «i» of variant 5 |
| I2 | the window open | hover and click an «i» | the explanation plate opens as before | skipped | needs a real mouse with the game in front (the owner's screen); only the letter's font changed — the hover target `Brd_KrinikInfo_<id>` is untouched |

## The «i» column (`[OWNER]` 2026-11-01 09:33 «давай (i) перенесем в одну колонку слева от настроек … (i) Название опции, доп описание»)

| ID | Situation | Action | Expected | Status | Observed |
|---|---|---|---|---|---|
| C1 | the rebuilt pak; the window open | look at every page (5 mods) | every row «(i) label hint … control»; the «i» of all rows in one vertical column at the left edge; labels start in one column | pass | 09:41–09:42, five 4K frames (pages switched by the remote): every row «(i) label hint … control», the «i» in one column, labels aligned; the kit's first run re-ordered 18 rows, the second 0 |
| C2 | the window open | hover an «i» | the plate opens at the cursor as before | skipped | needs a real mouse on the owner's screen; the hover target `Brd_KrinikInfo_<id>` is the same widget, only its place in the row changed |

## Finding

The dark backdrop of review folder 41 (frames 05:18–05:20) is the game's NIGHT (minimap clock 05:20) behind a window opened by the remote in the world, not
a layer of ours. What the owner's remark really asks is the PLAYER's door: the fishing window is opened from the inventory by its own button («Настройка
рыбалки», bottom bar); ours has no button yet — plan 38 phase 1, the inventory button «Настройки модов».
