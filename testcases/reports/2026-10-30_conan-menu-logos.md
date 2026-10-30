# Run report — Conan: the build's logo and versions in the main menu and the Esc menu (plan 36 W26)

**Work.** The owner's words 2026-10-30 22:39–22:51 and 23:15 (plan 36 W26), cases `testcases/TC_conan_menu_logos_2026-10-30.md` (D1, M1, E1, V1, R1).

**Contour.** KrinikConanUI kit pak: `W_MainMenu_MainMenu` and `W_IngameMenu` gain `SB_KrinikLogo/Img_KrinikLogo` (texture
`/Game/Mods/KrinikConanUI/T_KrinikModpackLogo`, imported by `_config/devkit/import-logo-texture.py`) and two version lines
(`T_KrinikGameVersion` «3.0.1», `T_KrinikPackVersion` «1.0.0», 18 pt, the game's beige); Conan 3.0.1, full pack, background launch (window 1920×1080,
frames scaled to 3840). Live save backed up before each run (`_save-backup/2026-10-30_2305-…`, `…_2320-…-3`) and restored after (integrity ok).

**Runs.** (moments — frame file times)
- 22:57 `import-logo-texture.py` (kit, `-ModDevKit`) → `Mods/KrinikConanUI/Local/T_KrinikModpackLogo.uasset`; CookInfo + 3 lines (both menus, texture).
- Kit edit 1 (exit 1: «was added but did not get a GUID» per new widget) → kit edit 2 (Success, 0 errors) → `kit-buildmod.py` → `Deploy-ModPack.ps1 -Deploy -Only KrinikConanUI`.
- Run 1 (PID 22540): `launch-bg.ps1`, main-menu frame `m1` 23:06, `enter-world-remote.sh`, `ActivateModule(FName('IngameMenu'))`, frame `e1` 23:07.
- Kit edit 3 (Esc cap 400, one version line, 18 pt) → build → deploy (SHA1 equal). Run 2 (PID 34604): `m2` 23:13, `e2` 23:14.
- Kit edit 4 (each version under its own logo — the owner 23:15) → run 3 (PID 14312): `m3/e3` 23:21. Kit edit 5 (ours by its solid box) → run 4 (PID 23616): `m4/e4` 23:29.

**Checks.**
- Hygiene: kit «Success - 0 error(s)» on edits 2–5; `mod-overrides.py` 8 assets; deployed pak SHA1 = built (runs 2–4).
- Functional run: both menus shown in the live game (the main menu at start, the Esc menu by the remote), 4K frames read by eye.
- D1 pass · M1 fail on build 1 → pass on build 2 · E1 fail on build 1 (ours over the mod list panel) → pass on build 2 · V1 fail on build 3 (the soft
  shadow) → pass on build 4 · R1 skipped (the strip widget's steps unchanged).

**Found.**
1. Simple Modlist's panel in the Esc menu leaves ≈ 440 units between itself and the game's logo — our logo is capped to 400 wide there.
2. A widget added from Python logs «did not get a GUID» on the FIRST compile and the commandlet exits 1; the GUID is assigned and saved — the
   second run is clean (now in the script's comment).
3. Our logo texture carries a soft shadow outside its solid box (alpha ≥ 64: 39,35 – 1010,359 of 1024×388) — layout by the alpha box put «1.0.0» lower.
4. A background frame does not catch the main menu's video — the menu shows white behind the logos.
5. The Esc menu opened 2 s after world entry showed the HUD minimap over it (23:21); 3 s later — clean (stand timing).

**Traces.** Review folder `НА ОТСМОТР НИКОЛАЕМ\14 логотип сборки в меню игры` (four WebP + «что смотреть.md»); `_config/devkit/kit-conanui-edit.json`,
`import-logo-texture.json`. Crash window: none. The game closed by PID every run.

**Verdict.** pass — taste (size, place, digits) waits for the owner's eye.
