# Research — Dungeon Siege II on a modern 4K screen: dgVoodoo2, large UI, no Lossless Scaling

> **Created:** 2026-10-25 · on the owner's order of the new-chat sequence (STATUS "Where to continue", item 1: «соберём рабочий DS2»)
> **Parent:** STATUS.md item 1 (2026-10-25 18:2x); the owner's working portable build `D:\Games\Dungeon Siege II\_PORTABLE\README.txt`
> **Status:** recon done 2026-10-25 19:1x; experiment on a COPY of the folder in progress
> **Outbound:** frames to the owner for review; the winning setup → `_PORTABLE\restore.ps1`

## Goal vector

Achieve: DS2 + Broken World fills the 4K 144 Hz TV in fullscreen with a LARGE, readable UI, without Lossless Scaling.
Avoid: touching the owner's working build (`enshrouded.exe nointro=true fullscreen=false`, window 1366×768 + LS Anime4K ×1.5).

Acceptance (observed, not inferred):
1. Game launched from the copy reaches the BW main menu in fullscreen 3840×2160 — a frame of the screen shows it.
2. The UI in-world is visibly larger than native-4K rendering — frame comparison at the same spot.
3. The owner's working build still starts as before (window 1366×768) — run of `ЗАПУСК.bat` after the experiment.

## Source read 2026-10-25 — GenesisFR, DS2TroubleshootingGuide README (https://github.com/GenesisFR/DS2TroubleshootingGuide)

Section "Increase UI size" (verbatim steps):
- extract `dgVoodoo.conf`, `dgVoodooCpl.exe` and `MS\x86\D3D9.dll` into the game folder (32-bit DLL, next to the exe);
- `dgVoodooCpl.exe` → DirectX tab → Videocard `GeForce FX 5700 Ultra` («this will get rid of a warning at launch»);
- same tab → Resolution = the native resolution;
- «Set the game at the resolution you want the UI to be scaled to (typically 720p or lower)»;
- «These instructions won't work while running the game in windowed mode.»
- Known issues: crash at launch / slowdown on mouse move → disable third-party overlays and frame limiters; Windows cursor flicker
  mid-screen → tab out and back.

Config files (per USER, shared by every copy of the game on this machine):
- DS2: `%USERPROFILE%\Documents\My Games\Dungeon Siege 2\DungeonSiege2.ini`
- BW: `%USERPROFILE%\Documents\My Games\Dungeon Siege 2 Broken World\DungeonSiege2BrokenWorld.ini`
- `DS2VideoConfig.exe` edits only the DS2 ini — copy to the BW folder when playing BW.
- Keys seen in the guide: `fullscreen = false`, `maxfps = 0`, `x=0`, `y=0`; resolutions 1280x720, 1920x1080; height ≤ desktop − 40 in windowed.

Other facts from the guide: black portraits → resolution ≤ 1280×1024 or Cristi80's fix (Nexus 132); mouse-cursor fix for BW = the BW fix
(gist GenesisFR f3df7f09…); WineD3D alternative is up to 50 % slower to load; Fullscreenizer borderless breaks the fixed-resolution main menu.

## Consequences for this machine (agent's reading, to verify by run)

- The ini is shared with the owner's working build → the experiment does NOT edit it. The working shortcut already passes
  `nointro=true fullscreen=false` on the command line, so ini keys are accepted as `key=value` arguments; the copy gets
  `fullscreen=true width=… height=…` on its own command line. To verify: the copy's run honours them.
- Overlays on this machine that the guide's crash note covers: Lossless Scaling (autostart, minimized), NVIDIA app overlay, RTSS (if present),
  MSI Afterburner (crashed at logon 2026-10-25). Close/disable LS hotkey for the run.
- dgVoodoo2 latest: v2.87.5 (2026-09-15), `dgVoodoo2_87_5.zip` from github.com/dege-diosg/dgVoodoo2/releases.

## Existing mods — search 2026-10-25 19:2x (web search; Nexus/PCGamingWiki/WSGF answered 403 to direct fetch → snippets)

Owner's push: `[OWNER]` «а что, никаких модов для ds2 нет для 4K ? · на нексусе, на гитхабе · может уже всё сделано».

| Mod | Claim | Open questions |
|---|---|---|
| **Dungeon Siege 2 Remastered**, Nexus dungeonsiegeii #183, v0.5.1 (~2026-10-09) | menus and UI scaled for any resolution up to 4K/8K/ultrawide; optional AI-upscaled UI and textures; OpenSpy MP; crash fixes; installed by a Python script into a copy, patches the exe (0.5.0) | BW 2.30? MikleWorks Russian? conflicts with the cursor-fix exe (`enshrouded.exe`)? mechanism? |
| Resolution Fix, Cristi80, #132 | resolution list 800×600–1280×1024 → 640×480–1920×1080; "Plus" test file (2025-11-15) → up to 3840×2160; author: UI shrinks above 1080p | why 1080p is missing from our in-game list |
| Text Size Increased, KillerGremal, #24 v4.0 (Alpha) | larger text 1080p/1440p/4K; long text may cut | BW? Cyrillic? |
| Enhanced Fonts for DS2 BW, SiegeFactory, #164 v1.0 (2026-03-09) | one `SiegeFactoryEnhancedFonts.ds2res` into `Resources`; recommends dgVoodoo2 + #132 | Cyrillic glyphs may be lost (inference) |
| Enhanced UI HD Upscaled, #119 | ESRGAN `guiUpscale.ds2res`/`uiUpscale.ds2res` for 1080p, BW 2.3, includes #132; abandoned; no fonts/icons/portraits | — |

**#183 page read 2026-10-25 19:2x through the KUMM debug Chrome (`kumm.mjs eval`, logged out):** «menu and UI scaling for any
resolution, up to 4K, 8K and ultrawide» — HUD, inventory, tooltips, overhead names, loading screens, portraits, dialogue, options;
«Scaled cursor … fixes for cursor drift and relative mouse input»; Windowed/Fullscreen/Borderless selector; FOV by aspect; large
address aware. Install: extract ZIP to its own folder, run `Install-DungeonSiege2Remastered.py` (Python ≥3.10 with Tkinter), pick the
game folder; it patches `DungeonSiege2.exe` (`remaster.patch` / `remaster-gog.patch`), keeps `DungeonSiege2-Original.exe`, backs up
replaced files. **Requirement: «unmodified v2.3 DungeonSiege2.exe»** (Steam or GOG). UI pack `DS2HDUI.ds2res` + `DS2HD-Minimap.ds2res`
(1.1 GB, optional); game textures 14 × `DS2HD-*.ds2res` (7 GB download, optional). Known limitation named: Japanese language. Broken World
and Russian — not mentioned on the page. Owner's verdict on resolutions that drove it: `[OWNER]` «запустилось в 1080, но ui мелкий» (720p —
size right but blocky; 1080p — sharp but small) → only real UI scaling solves it.

**#183 files read 2026-10-25 19:3x (main file 896, 0.5.1, downloaded by `kumm get` to `D:\Games\_downloads\DS2-Remastered`):**
`Install-DungeonSiege2Remastered.py` EDITIONS — Steam original SHA256 `0176da88…68ae`, GOG `c17e1cc9…b4e2`, both **8 212 480 bytes**;
README «CD, Broken World, modified and other executable revisions are not supported by this patch. The installer verifies the entire
EXE before changing anything»; CHANGELOG «Remastered saves are separate from … Broken World saves; a new Remastered party is required».
The owner's `DungeonSiege2.exe` is another exe revision (23 408 640 bytes, the CD-edition size class) → refused, and BW is out of scope anyway. Verdict: #183 = base DS2 only, new party,
Steam/GOG exe; not for the owner's BW + Krinik. Fork to the owner (2026-10-25): A — BW on dgVoodoo + #132/#164; B — Remastered from
scratch; C — the old window + LS.

Other: no ini key for UI scale or cursor speed found (known keys: `fullscreen`, `width`, `height`, `bpp`, `maxfps`, `x`, `y`, `nointro`,
`noloadintro`, `nospacecheck`, `min_spec_warning` — Steam thread 2014 citing MS KB 903677). DXVK 2.7.1 fixed a DS2 menu bug, no 4K
reports. Fast mouse: no game key; the cursor moves in game pixels (inference) — lower the game's stretch factor or the OS/mouse speed.

## Experiment log

- **2026-10-25 19:06 — 1280×720 + dgVoodoo forced 3840×2160@144 (copy folder).** BW main menu fullscreen 4K, no black screen, no
  video-card warning (TC D1, D2 pass). Agent's click on «Продолжить» was ignored: in fullscreen the game reads the mouse directly
  (DirectInput-style), `SetCursorPos` + `mouse_event` do not move its cursor → world handed to the owner.
- **Owner in the world, 19:1x:** `[OWNER]` «разрешение низкое, посмотри экран · И фувствительности мыши высокие - пришлось пинимум
  поставить». Frame at 1:1: the 3D world IS rendered at 4K (crisp edges), the UI is drawn at the game resolution and stretched ×3 →
  blocky text; the cursor moves one GAME pixel per mouse count = 3 screen pixels → fast mouse. Both scale with the game resolution:
  1920×1080 → UI ×2, cursor ×2; 2560×1440 → ×1.5. Choice of the UI size vs sharpness is the owner's eye (taste class).
- Unused knob, for later: `[GeneralExt] Resampling` (`bilinear` default; `bicubic`, `lanczos-2/3`) filters dgVoodoo's own output scaling.
