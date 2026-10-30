# Bug 71 — Conan: the main menu background is all white

**Status:** ✅ DONE · **Severity:** S2 · **Version/build:** KrinikConanUI kit pak with the W26 menu edit (pack 029881e and later)
**When/context:** 2026-10-31 00:10, the owner at the foreground demo: `[OWNER]` «ты видел, что в меню сломан фон?» · «все белое»
**Fixing:** next chat, first (the owner's debt)

## Symptom
The main menu shows a plain white background behind the logos and the buttons; the menu's video backdrop is gone. Every background frame of
2026-10-30 23:06–23:29 showed the same white — the agent wrote it off as «a background frame does not catch video» (a standing falsehood, corrected
2026-10-31 00:11 in review folder 14, `testcases/reports/2026-10-30_conan-menu-logos.md`, `TC_conan_menu_logos_2026-10-30.md`).

## Root cause (found 2026-10-31 00:27 +03:00, cases `testcases/TC_conan_main_menu_white_bg_2026-10-31.md`)
- **M2 (no mod paks):** the backdrop moves (desert, braziers) — the intro `.mp4` is innocent; the log line «MainMenuMoviePlayer.OpenSource called
  with null MediaSource» stands on the GOOD run too (and in the 12:29 log) — harmless noise, not evidence.
- **M1 (full build minus `KrinikConanUI.pak`):** the backdrop moves (snowy peaks) — our kit override of `W_MainMenu_MainMenu` is the cause.
- **Why:** the vanilla widget holds `BackgroundMovies` (6 × `BinkMediaPlayer` `/Game/Movies/TitleScreen_{Claws,Icefield,Jungle,UnnamedCity,Volcano,
  WineCellar}`) and `BackgroundMovieTextures` (6 × `BinkMediaTexture` `/Game/Movies/MediaTextures/TitleScreen_<X>_Tex`) and sets `Image_BinkPlayer`'s
  brush at run time; the mod kit has NO `/Game/Movies`, so the kit save wrote both arrays empty and `Image_BinkPlayer` drew its bare brush
  (`ResourceObject=None`, tint white) — the white screen. Read from the vanilla asset: `retoc-5.8 to-legacy --filter W_MainMenu_MainMenu` +
  `uaj tojson` (order and classes).
- **TWINS:** searched the vanilla imports of all seven widgets the kit pak overrides for `/Game` packages the kit lacks
  (`_config/devkit/kit-missing-refs.py`) — found 12, all in `W_MainMenu_MainMenu`; the six others: 0.

## Fix
`kit-conanui-edit.py` → `MENU_MOVIES`: placeholders of the same classes at the same paths (outside CookInfo), the two arrays set on the widget
in vanilla order; the game resolves the paths to its own movies. Guard: `kit-missing-refs.py` (red 12 on the vanilla main menu, green 0 on
`W_IngameMenu`).

## Hypotheses (ranked, before the runs)
1. **Our override of `W_MainMenu_MainMenu`** (kit, plan 36 W26): the kit copy of the widget may lose the menu's media setup — `Image_BinkPlayer`
   (in `Overlay_Content`) and its media/material, `MainMenuMoviePlayer` (log 2026-10-30 23:3x: «MainMenuMoviePlayer.OpenSource called with null MediaSource»).
   Control: deploy the pak WITHOUT the main-menu line (CookInfo) and look — white gone → confirmed.
2. The intro file `Content/Movies/.mp4` (KrinikIntro) — the menu player may pick an empty-named movie too. Control: remove `.mp4`, look.
3. No-Intro-Splash stubs (older; the owner saw a working backdrop before?) — check last.

## Repro
`launch-fg.ps1` → the main menu. A background frame (PrintWindow) shows white too — so the frame IS evidence here; compare with a control build.

## Links
plan 36 W26; `games/ConanExiles/mods/KrinikConanUI.md`; `games/ConanExiles/mods/KrinikIntro.md`.

## Decisions made without the owner
- `[AI]` Placeholders in the kit (not a Lua swap at run time): the asset route of HOUSE_RULES §1 rule 8 — the widget keeps vanilla behaviour, no polling.
- `[AI]` The control runs on the background path (launch-bg.ps1).

## ✅ STATUS: DONE (2026-10-31 00:45 +03:00)
Hygiene: the kit report reads 6 + 6 backdrop refs back after the compile; `kit-missing-refs.py` red 12 → green 0.
Functional run: the real main menu after the fix (00:35 burst, 35 frames): a moving volcano backdrop behind the logos and the buttons — report
`testcases/reports/2026-10-31_conan-main-menu-white-bg.md`.
REAL WORLD: accumulated — the owner's install with all 64 paks, his modlist (byte-equal to the original), his saves untouched; data and machine —
his game folder on this machine; path — the launcher's start into the main menu, as he starts it.
