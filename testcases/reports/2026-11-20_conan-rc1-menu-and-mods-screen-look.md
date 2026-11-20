# Test run report — 0.9.1-RC1 in the working game: the main menu's version line and the game's mods screen (rule 40.3)

**Created:** 2026-11-20 11:14 +03:00 · **Run by:** the agent (Claude Opus 5.5) · **Version/build:** pack `7c72d78` (RC1 deployed 2026-11-20 10:44 from `f381f3f` + `ce1f12b`, the paks' description from `7c72d78`), Conan Exiles Enhanced 3.1.1 CL-383549

## 1. Work

The two owed looks of STATUS «Where to continue» item 3: the main menu shows «0.9.1-RC1» under the Krinik logo, and the game's own mods screen shows a Krinik
pak's author, author URL and change note (`HOUSE_RULES.md` rule 40.3: «the main menu's mods screen of the working game is looked at once per release»).
Basis: rule 40 and plan 55 (the version 0.9.1-RC1 in the manifest and the Krinik mods).

## 2. Contour

The working build `D:\Games\Conan Exiles 3.1.1` (the one `targets.json` names), the game started by the background path, the machine lock `kumm` taken
11:09:24, released after the close. REAL WORLD: accumulated — the working game with the development saves (rule 6) and RC1 deployed over 0.9.1 at 10:44;
data and machine — the owner's machine, the working build; path — the player's main menu and its «Моды» button (the button pressed by the remote's call of
its own click event, the same event a mouse click fires).

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-11-20 11:09 +03:00 | `powershell -File ConanExiles/_config/launch-bg.ps1` | PID 32568, main menu reached |
| 2 | 2026-11-20 11:10 +03:00 | `powershell -File ConanExiles/_config/capture-window.ps1 -Out .work/rc1_look/menu_01.jpg -Width 1920` | frame of the main menu |
| 3 | 2026-11-20 11:11 +03:00 | `bash _config/pult.sh "call W_MainMenu_MainMenu_C_2147482039 BndEvt__W_MainMenu_MainMenu_B_Mods_K2Node_ComponentBoundEvent_1_SignalClicked__DelegateSignature WidgetTree_2147482038.B_Mods"` | exit 0, the mods screen opened |
| 4 | 2026-11-20 11:11–11:12 +03:00 | `bash _config/pult.sh "lua … ScrollBox (ModDetailView) :SetScrollOffset(500 / 792)"` + `capture-window.ps1` after each | the details panel scrolled, three frames |
| 5 | 2026-11-20 11:13 +03:00 | `powershell -File ConanExiles/_config/close-game.ps1` | exit 0, closed cleanly in 3.6 s, no crash reporter |

## 4. Checks

Hygiene: none (a look, no code changed).
Functional run: the working build's main menu and its «Моды» screen, by the player's path (the menu button's own click event), read on frames:

  - **M1 the version line — pass.** Under the Krinik Mod Pack logo stands «0.9.1-RC1»; under the game logo «3.1.1»; the right column «Версия #383 549/0»
    (`menu_01.webp`).
  - **M2 the mods screen, KrinikConanGraphics — pass.** «Сведения о моде»: «Название» KrinikConanGraphics; «Описание» the mod's sentence, then «Ещё пять
    модов сборки Krinik Mod Pack ставятся без пака, и в этом списке их нет: KrinikConanCamera, KrinikConanEngineTweaks, KrinikConanLocomotion,
    KrinikConanModPackManager и KrinikConanRussianTranslation.» (the `7c72d78` sentence, no dash); «Автор» «Кот Криник (KOT KRINIK)»; «URL автора»
    `https://www.nexusmods.com/conanexilesenhanced/mods/65`; «Список изменений» four lines (palm-leaf shadows no longer flicker; shadows follow the sun
    smoothly; the far shore, rocks and arches reflect in water; draw distance 1.5, was 2.0 in 0.9.0, about 5 % more frames per second) (`mods_02.webp`,
    `mods_04.webp`). The panel shows no version field; «Предпросмотр» is empty.
  - **M3 the other three Krinik paks (Archery, Gameplay, UI) — not looked at on screen this run;** their fields are covered by the guard on the game's Mods
    folder (4 / 4 ok, report `testcases/reports/2026-11-20_conan-krinik-pak-modinfo-fields.md`).

## 5. Found

none

## 6. Traces

Frames (WebP, kept until the RC1 release ships, then deleted): `KUMM/.work/rc1_look/menu_01.webp`, `KUMM/.work/rc1_look/mods_02.webp`,
`KUMM/.work/rc1_look/mods_04.webp`. The remote's answers are quoted in §3–§4.

## 7. Verdict

pass — M1 and M2 seen on the working game; M3 rests on the guard's file check, said above.
