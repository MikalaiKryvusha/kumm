# Bug 71 — Conan: the main menu background is all white

**Status:** 🔴 OPEN · **Severity:** S2 · **Version/build:** KrinikConanUI kit pak with the W26 menu edit (pack 029881e and later)
**When/context:** 2026-10-31 00:10, the owner at the foreground demo: `[OWNER]` «ты видел, что в меню сломан фон?» · «все белое»
**Fixing:** next chat, first (the owner's debt)

## Symptom
The main menu shows a plain white background behind the logos and the buttons; the menu's video backdrop is gone. Every background frame of
2026-10-30 23:06–23:29 showed the same white — the agent wrote it off as «a background frame does not catch video» (a standing falsehood, corrected
2026-10-31 00:11 in review folder 14, `testcases/reports/2026-10-30_conan-menu-logos.md`, `TC_conan_menu_logos_2026-10-30.md`).

## Hypotheses (ranked)
1. **Our override of `W_MainMenu_MainMenu`** (kit, plan 36 W26): the kit copy of the widget may lose the menu's media setup — `Image_BinkPlayer`
   (in `Overlay_Content`) and its media/material, `MainMenuMoviePlayer` (log 2026-10-30 23:3x: «MainMenuMoviePlayer.OpenSource called with null MediaSource»).
   Control: deploy the pak WITHOUT the main-menu line (CookInfo) and look — white gone → confirmed.
2. The intro file `Content/Movies/.mp4` (KrinikIntro) — the menu player may pick an empty-named movie too. Control: remove `.mp4`, look.
3. No-Intro-Splash stubs (older; the owner saw a working backdrop before?) — check last.

## Repro
`launch-fg.ps1` → the main menu. A background frame (PrintWindow) shows white too — so the frame IS evidence here; compare with a control build.

## Links
plan 36 W26; `games/ConanExiles/mods/KrinikConanUI.md`; `games/ConanExiles/mods/KrinikIntro.md`.
