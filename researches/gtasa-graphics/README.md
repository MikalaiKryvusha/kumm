# Research — GTA SA graphics: RenderHook vs the owner's Vanilla Overhaul build, and HD texture packs

> **Created:** 2026-10-03 (owner's ask in chat: «разберу совместимость RenderHook с вашей сборкой перед
> установкой — да, изучи вопрос» and «и поищи паки текстур высокого разрешения»)
> **Parent:** chat recon of GitHub graphics mods for SA, same session; dossier `games/GTASanAndreas/README.md`
> **Status:** 🟢 recon complete 2026-10-03 · texture packs checked against the build the same day (§4a, §4b) — nothing installed, nothing changed in the game folder
> **Outbound:** → the owner: decision whether to try RenderHook in a separate game copy and whether to
> install RoSA Evolved (download is his — Patreon/Boosty public post)

## 1. The owner's build (observed on disk 2026-10-03)

`D:\Games\GTA San Andreas` is **Grand Theft Auto: San Andreas [Vanilla Overhaul]** — a modloader modpack.
Its manual: "Rendering is performing thanks to the SkyGfx Extended plugin" (six profiles SkyGfx1–6) and
"Full SAMP and MTA support". ASI loader: Silent's ASI Loader 1.3 (`vorbisFile.dll`), not Ultimate ASI Loader.

Graphics-relevant plugins: `modloader/Graphics/` — `skygfx.asi` (SkyGfx 4.2b Extended 1.7), `skygrad.asi`,
`EffectLoader.asi`, `FxsFuncs.asi`, `SALodLights.asi` (Project2DFX), `RubbishSA.asi`;
`modloader/Map/modpacks/Proper Fixes` (MixMods, 2025) whose readme says:
"REQUIRES SkyGfx Extended with buildingPipe=PS2 (default) (otherwise there will be a lot of bugs)" and
"REQUIRES Open Limit Adjuster"; `modloader/Performance/III.VC.SA.LimitAdjuster.asi` (Open Limit Adjuster,
`OutsideWorldWaterBlocks = 500` active at line 23); `modloader/Multiplayer/` (SA-MP-only plugins) and the
`SAMP\`, `MTA SA 1.6\` folders. No fastman92 limit adjuster, no ENB, no Moonloader, no ImVehFt.
modloader priorities: compatibility 100 · performance 95 · addons 90 · graphics 75 · missions 70 · map 65 ·
characters 60 · multiplayer 55.

## 2. RenderHook — what exists

| Fact | Source |
|---|---|
| Two lines: old DX11 (SA only, "can't really build it anymore") and new Vulkan + `vk_nv_ray_tracing`, "runs only on RTX hardware" | GitHub README `petrgeorgievsky/gtaRenderHook` (278 ★, MIT) |
| No GitHub Releases; binaries only as CI artifacts. Latest successful run 2026-06-14 has **0 artifacts** (90-day retention passed) | `gh api …/actions/runs/27505645176/artifacts` → `total_count 0` |
| Commits resumed June 2026 (normals fix, sampler cache, crash stack traces) | `gh api …/commits` |
| Wiki: "Development status: Inactive"; "A 100% vulkan version is in making, however no one published working binaries yet" (SA) | gtamods.com/wiki/Renderhook, Wayback 2026-02-01 (live page is behind Cloudflare) |
| The downloadable SA build is DX11 `rh2018_05_11`, 0.54 MB, "Requires a graphics card that supports DirectX 10", "incompatible with various graphic mods", "Does not work in SAMP" | libertycity.net/files/gta-san-andreas/117512-renderhook.html |
| Issues: #21 "Abandoned and incompatible" (2024, RTX 4070 SUPER); #22 IVF incompatible, mission markers disappear, Project2DFX bug "renderhookfix doesn't always work" | GitHub issues |
| Grass is disabled by RenderHook, no easy way back; ENB incompatible; SA-MP uses DX9 functions → incompatible | wiki FAQ |

## 3. Compatibility of RenderHook with THIS build (wiki list × disk inventory)

| Mod in the build | Wiki verdict | Consequence |
|---|---|---|
| SkyGfx Extended (`skygfx.asi`) | ❌ | must be removed — it is VO's whole rendering; Proper Fixes then "a lot of bugs" |
| SkyGrad (`skygrad.asi`) | ❌ | must be removed |
| Effect Loader (`EffectLoader.asi`) | ❌ | must be removed |
| SA-MP (`SAMP\`, `modloader/Multiplayer`) | ❌ | multiplayer from this folder breaks |
| MTA (`MTA SA 1.6\`) | ❌ | — |
| Open Limit Adjuster | ✅ with fix | comment out `OutsideWorldWaterBlocks` (water bug) |
| Project2DFX (`SALodLights.asi`) | ✅ requires fix | `RenderHookFix.SA.asi` (Junior_Djjr) |
| FxsFuncs, ImprovedMove, 2 Player Deluxe (`2pl_*` scripts) | ✅ | — |
| SilentPatch, MixSets, FramerateVigilante, ImprovedStreaming, GInputSA, ModelVariations, PedsExtender, RubbishSA, ProperFixes.asi, RoadsignFontHD, WheelCamSA, MovingSirenLightsSA, IndieVehSmoke, HeliFix, CLEO 5 + CLEO+, CrashInfo, CopDoorLoadFix | not in list | unknown — "not tested yet" per wiki FAQ |
| Silent's ASI Loader 1.3 | — | RH README names Ultimate ASI Loader; whether RH loads under Silent's — not checked |

**Verdict.** RenderHook does not fit this build: installing it means removing VO's rendering core
(SkyGfx Extended) plus SkyGrad and EffectLoader, which in turn breaks Proper Fixes by its own readme, and
losing SA-MP in this folder. The only downloadable SA build is from 2018 (DX11), the RTX branch has no SA
binaries. The sane way to try it is a **separate clean copy** of the game, not this one.

## 4. HD texture packs

| Pack | What | Size · date | Notes |
|---|---|---|---|
| **RoSA Evolved v1.5** (MixMods, Jéssica Natália) | global HD retexture 2K/4K; hand-made + original HD sources + reviewed upscales; includes Proper Vehicles/Characters/Weapons/Interiors Retex and Proper Radar | 4 GB · page updated 5/12/25, monthly updates on the 15th | "O mod vem pronto pra usar com ModLoader"; "Já vem adaptado para SAMP"; Proper Fixes must have HIGHER priority than RoSA "senão dará erro" and must be the Proper Fixes version made for RoSA; free public build is 2 months behind Patreon/Boosty; reupload forbidden; author says ~20–30 % of 11 000 textures are at the 2024+ standard |
| Proper Vehicles Retex v2.1 | all cars, .txd only (no .dff) | 46 / 78 / 157 / 360 MB (512 / 1024 / 2048) · 2022-04-10 | already inside RoSA |
| Proper Characters Retex | 133 peds | 22 MB · 2022-07-24 | already inside RoSA |
| Proper Vegetation Retex | trees 1K/2K | 25 MB · 2021 | superseded by RoSA (its own page says so) |
| "San Andreas Reimagined" (Kadakash) | a modpack, not a texture pack | 4.6 GB · 2021-02-13 | does not fit — §4a |
| "AI Remaster" (flyaway888) | a full game repack | 28.84 GB · 2021-08-15 | does not fit — §4a |
| Original Textures Enhanced | a full game repack + ReShade | 11.7 GB · ModDB 2024-02-04 | does not fit — §4a |
| HD Optimized textures | a full game repack + ReShade | ~17 GB · ModDB 2022-07-12 | does not fit — §4a |

### 4a. What each "pack" actually is (checked 2026-10-03 — the first pass above listed four of them unchecked)

| Pack | What it really is | Fits VO? |
|---|---|---|
| RoSA Evolved | modloader mod, everything inside `.img` (§4b) | yes, with conditions §4b |
| flyaway888 "GTA San Andreas AI Remaster" (moddb `gta-san-andreas-ai-remaster`) | a FULL GAME repack: 5 parts "full version", 28.84 GB; comments: crash at the end of the loading bar, cannot save, LV airport textures fail | no — replaces the game |
| Kadakash "San Andreas Reimagined (TOTAL CONVERSION)" | a modpack (textures + "thousands of bug fixes" + widescreen); Nexus `gtasanandreas/mods/2494` "removed by a member of staff"; mirrors are password rars | no — a rival modpack, source deleted |
| Original Textures Enhanced (ModDB, 2024-02) | a FULL GAME repack with ReShade: part1 9 GB + part2 2.73 GB, "unrar only part1 then you are ready to play" | no — replaces the game |
| HD Optimized textures (ModDB, 2022-07) | a FULL GAME repack with ReShade: 7 + 7 + 3.13 GB, "download all parts, unrar and play" | no — replaces the game |
| Inverno Nuclear "AI Enhanced Textures" (GTAForums 2020, moddb `ai-enhanced-textures-for-gta-san-andreas`) | a real pack (`.img` + fastman92 ImgLimitAdjuster, OLA, MixSets StreamMemory 1024, Load Whole Map) | no — ModDB: "No files were found" |

### 4b. RoSA against the build — measured on the free July 2026 build

Downloaded the public Patreon post 2026-07-15 ("LOWER RESOLUTION VERSION", mediafire, 1 343 292 091 bytes,
readme "Version: Evolved v1.4"); August and September posts are patron-only (`current_user_can_view` false).
Contents: `rosa_evolved_a.img` 1.99 GB, `gta3.img` 356 MB, `proper_interior_retex.img` 401 MB, `gta_int.img`
61 MB, cutscene imgs, `generic\vehicle.txd`, `txdp.ide` (its own SA Optimized Map), `data\weapon.dat`,
`SimpleLimitAdjuster_IMGfiles.asi`, `(For SAMP)\…\SAMP.img`, optional Proper Player Retex (`player.img` 897 MB).
Scripts: `scratchpad/rh/rosa_vs_vo.py`, `rosa_gaps.py`, `txdnames.py` (RW TXD texture-name reader), `imgdir.py`.

1. **The rule that decides everything** — RoSA readme: "ModLoader considers .img files to always have
   priority below all other files. So, avoid installing original texture mods in modloader as they will
   remove HD textures." RoSA is all `.img`; every loose `.txd`/`.dff` VO ships beats it whatever the numbers.
2. **Overlap, RoSA 4012 txd vs VO loose txd**: Map 1328 · Vehicles 252 (all) · Missions 177 · Display 144 ·
   Characters 78 · Weapons 51 (all) · Graphics 11 → 2041 RoSA textures stay hidden, ~1971 become visible.
   VO's `Map\models\gta3.img` folder (1211 loose txd) is mostly "Map Textures Fix — PS2 to PC".
3. **No white textures from mixing**: after resolving RoSA's txdp parents, every non-map txd where RoSA lacks
   a texture name VO has comes with RoSA's own same-name `.dff` (weapons 17/17, vehicles 4/4, missions 35/36,
   peds 5/6); VO-only `.dff` meeting a RoSA `.txd`: 0. And loose VO pairs win as pairs anyway.
4. **Models**: RoSA ships 15 333 `.dff` (inside its imgs) — the whole map, all 253 VO vehicles, 30 weapons,
   47 peds, 77 mission models. Loose VO models win, so VO's model fixes survive; against Proper Fixes (also
   `.img`) the numbers DO matter — hence the author's rule below.
5. **Proper Fixes**: VO ships the regular Proper Fixes 2025 (its own `SA Optimized Map`). RoSA requires
   "the specific version of Proper Fixes adapted to RoSA" with priority above RoSA (tutorial: "otherwise your
   game will crash") and "This mod already includes SA Optimized Map … Remove it if you use it". So installing
   RoSA = replacing a core VO component.
6. **`weapon.dat`**: VO `Weapons\data\weapon.dat` (WeaponDAT Fix) ≠ RoSA's (chainsaw flags, SPAS/TEC9/MP5/AK47/M4
   offsets and anim groups); both loose, both priority 50 → undefined winner. VO's weapon models win, so keep
   VO's file: `IgnoreFiles` → RoSA's `weapon.dat`.
7. **Already satisfied by VO**: 1.0 US · StreamMemory ≥ 1024 (MixSets 2048, ImprovedStreaming forced 2000) ·
   IMG limit adjuster ships inside RoSA · SA-MP via its own `(For SAMP)` folder. MTA: "not possible" (MTA does
   not use modloader, so it is simply unaffected).
8. **Licence**: personal install fine; "It is not allowed to use this mod in other mods or modpacks".

## 5. Sources

- https://github.com/petrgeorgievsky/gtaRenderHook (README, issues #18 #20 #21 #22, Actions)
- https://web.archive.org/web/20260201035635/https://gtamods.com/wiki/Renderhook
- https://libertycity.net/files/gta-san-andreas/117512-renderhook.html
- https://www.mixmods.com.br/2023/07/rosa-project-evolved-remaster-texturas-hd/
- https://www.mixmods.com.br/2022/04/sa-sade-proper-vehicles-retex/
- https://www.mixmods.com.br/2022/07/sa-proper-characters-retex-hd-peds-remaster/
- https://www.mixmods.com.br/2021/07/proper-vegetation-retex-vegetacao-com-texturas-hd/
- https://www.dsogaming.com/news/grand-theft-auto-san-andreas-gets-a-4-6gb-ai-enhanced-hd-texture-pack/
- https://www.dsogaming.com/mods/final-version-of-the-ai-upscaled-hd-texture-pack-for-grand-theft-auto-san-andreas-released/
- https://www.moddb.com/mods/gta-san-andreas-original-textures-enhanced · https://www.moddb.com/mods/gta-san-andreas-hd-optimized-textures
