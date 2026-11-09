# Mod notes — KrinikConanEngineTweaks (ours: the build's engine fixes and engine tuning)

> **Created:** 2026-11-09 · on the owner's word (below) · **Parent:** HOUSE_RULES rule 19 (the Krinik set — the ninth mod), `researches/conan-hitch-profiler/README.md`,
> `researches/ue5-guru-tweaks-2026-11/README.md` · **Status:** ✅ in the build since 2026-11-09 22:07 (lines read back live); NPC pathing — the owner's eye PASS
> 22:16; 2026-11-10 02:17 — its own manifest entry, the engine merges its part (below), the guide and the README mod list carry it · **Outbound:** the build 1.0.0

**The owner's words, verbatim:** `[OWNER]` 2026-11-09 21:49 «все наши правки и тюнинг движка собираем в новый мод KrinikConanEngineTweaks» · 22:05 «обе фичи поставляем в
моде и сборке 1.0.0».

## What it ships (decided 22:05)

| Line | Where in the ini | Measured | Report |
|---|---|---|---|
| `bDoFullyAsyncNavDataGathering=True` | `[/Script/NavigationSystem.RecastNavMesh]` | flight hitches −48 %, worst frame −43 %, 1 % low +12 %, FPS same (front, A-B-B-A) | `testcases/reports/2026-11-09_conan-quickwin-n1-async-navmesh.md` |
| `niagara.CreateShadersOnLoad=1` | `[SystemSettings]` (read back as `Set CVar [[niagara.CreateShadersOnLoad:1]]`) | flight hitches −31 %, no FPS / RAM / VRAM cost (background, 3 pairs) | `testcases/reports/2026-11-09_conan-quickwins-shaders-on-load.md` |

| `p.Chaos.AccelerationStructureTimeSlicingMaxQueueSizeBeforeForce=100000` | `[SystemSettings]` | flight hitches −28 % (2026-11-06) — MOVED here from KrinikConanGraphics `[OWNER]` 2026-11-09 22:10 «да, хорошо» | `testcases/reports/2026-11-06_conan-quickwin-chaos-queue.md` |

## How it is built (since 2026-11-10 02:17)

- Manifest entry `KrinikConanEngineTweaks` (`kind: config`, `source.folder: _unpacked/KrinikConanEngineTweaks`, `engineIni: Engine.tweaks.ini`) — it places no files.
- KUMM `Deploy-ModPack.ps1` merges `Engine.tweaks.ini` into the build's `engineIni.file` (`_unpacked/KrinikConanGraphics/Engine.ini`) SECTION BY SECTION on `-WithEngineIni`
  (a part's `Key=Value` replaces the same key of the same section with a warning; new lines at the end of the section; a new section at the end of the file; each block
  opens with `; ===== KrinikConanEngineTweaks (…, merged by KUMM) =====`). `-Verify` prints «Engine.ini part of KrinikConanEngineTweaks in place» when every key line of the
  part is in the game's file. `-EngineIniOut <file>` writes the merged text; the pack's `_config/deploy-config.py` takes Engine.ini from it (one implementation).
- Disable the mod — `"enabled": false`: its part is not merged.
- Checked 2026-11-10: the merged text equals the previous shipped Engine.ini key for key (112 = 112, 0 differences); deployed by `deploy-config.py Engine.ini` 02:17
  (backup `_config/backup/2026-11-10_021727`); `-Verify` on the real pack — clean, the part in place. NOT re-read in a running game this time: the keys are the ones read
  back live 2026-11-09 22:07, only comments and block order changed.
- Fixture: `tools/fixture-pack.mjs` block «кусок Engine.ini» (7 checks; 6 go red on the engine before the merge).

## Built 2026-11-09 22:0x — the interim route (one shipped ini) — SUPERSEDED 2026-11-10

- Source of the mod's lines: `ConanExiles/_unpacked/KrinikConanEngineTweaks/Engine.tweaks.ini`.
- Shipped as two blocks marked `; ===== KrinikConanEngineTweaks … =====` inside `_unpacked/KrinikConanGraphics/Engine.ini` (after the `p.Chaos…` line in `[SystemSettings]`,
  and a `[/Script/NavigationSystem.RecastNavMesh]` section at the end) — a truth ↔ mirror pair: the blocks must match `Engine.tweaks.ini` (check: grep both lines in both files).
- Deployed `python _config/deploy-config.py Engine.ini` (sha256 `3132948eccd1…`, backup `_config/backup/2026-11-09_220645`); fresh front launch 22:06:56: `GetPropertyValue
  ('bDoFullyAsyncNavDataGathering')` = true · log `Set CVar [[niagara.CreateShadersOnLoad:1]]` · the physics queue `…:100000` still applied.

## How to build properly (decided 2026-11-10 — the merge above)
- The pack deploys ONE Engine.ini today: KrinikConanGraphics' `_unpacked/KrinikConanGraphics/Engine.ini` through the manifest's `engineIni` (Deploy-ModPack.ps1). A second
  mod's ini needs either a merge step in the deploy (several `engineIni` sources, KUMM engine change — case in `tools/fixture-pack.mjs`) or the lines kept in the one
  shipped file under a `; KrinikConanEngineTweaks` block. Read `Deploy-ModPack.ps1` `engineIni` handling first; decide by the simpler route that keeps the mod separate in the
  storefront's mod list.
- **NPC pathing — the owner's eye, PASS:** `[OWNER]` 2026-11-09 22:16 «мобы хорошо ходят, не вижу заметной разницы» (his play in the 22:07 launch, async gathering on).
- After deploy: read both lines back live (`GetPropertyValue('bDoFullyAsyncNavDataGathering')`, the log `Set CVar`); NPC pathing in play by eye (the owner); the guide and
  the README mod list get the mod (HOUSE_RULES rule 20).
