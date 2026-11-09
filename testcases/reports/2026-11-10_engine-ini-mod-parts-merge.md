# Run report — a mod's own part of Engine.ini, merged by the engine (KrinikConanEngineTweaks gets its manifest entry)

## 1. Work

KUMM `Deploy-ModPack.ps1`: the per-mod field `engineIni` (a part file in the mod's `source.folder`), merged section by section into the pack's `engineIni.file`
on `-WithEngineIni`; `-Verify` checks each part key per section; `-EngineIniOut <file>`; the pack's `_config/deploy-config.py` takes Engine.ini from it. Basis: the
handover item «the deploy merge of several ini sources so the mod ships its own file» (STATUS, 2026-11-09 22:45) and the mod notes
`games/ConanExiles/mods/KrinikConanEngineTweaks.md` («decide by the simpler route that keeps the mod separate in the storefront's mod list»).

## 2. Contour

The fixture stand `tools/fixture-pack.mjs` (temp packs, no game, no network) and the owner's real Conan pack `D:/work/ai_sandbox/ConanExiles` with its real target
`D:\Games\Conan Exiles 3.0.1` (game closed during the run); Windows PowerShell 5.1, Node 24.15.

## 3. Runs

- 2026-11-10 02:05 — `node tools/fixture-pack.mjs` → 41 OK, 3 МИМО (stand defects: a target-name prefix in two regexes, no enabled mod left in the control case).
- 02:08 — after the stand fixes: 44/44. Control: `KUMM_DEPLOY=<HEAD Deploy-ModPack.ps1> node tools/fixture-pack.mjs` → 6 of the 7 new checks red (the 7th, a disabled
  mod = byte copy, is green on both by design).
- 02:12 — `Deploy-ModPack.ps1 -PackDir ConanExiles -EngineIniOut <scratch>/merged-Engine.ini`; `node <scratch>/ini-diff.mjs merged HEAD-Engine.ini` → 112 = 112 key lines,
  0 differences; vs the game's live file → 0 missing, 6 lines the game adds itself (`[WindowsApplication.Accessibility]`).
- 02:17 — `python _config/deploy-config.py Engine.ini` → written, backup `_config/backup/2026-11-10_021727`; `Deploy-ModPack.ps1 -PackDir ConanExiles -Verify` →
  «3.0.1: Engine.ini part of KrinikConanEngineTweaks in place», «Verify clean».
- 02:26 — the player's path on the real game: `Deploy-ModPack.ps1 -PackDir ConanExiles -Deploy -Only KrinikConanEngineTweaks -WithEngineIni` → «wrote … + the Engine.ini
  parts of KrinikConanEngineTweaks», verify 113 present, 0 missing.
- From 02:31 to 02:33 — the live game (machine lock, background `launch-bg.ps1`, `enter-world-remote.sh`; voice phrase first): `pult.sh` → `async gathering=true`; the game log
  `Set CVar [[niagara.CreateShadersOnLoad:1]]` and `[[p.Chaos.AccelerationStructureTimeSlicingMaxQueueSizeBeforeForce:100000]]`; `close-game.ps1` (no crash report);
  `-Verify` on the file the game rewrote on exit → part in place. Cases `testcases/TC_conan_engine_tweaks_merged_ini_live_2026-11-10.md` E1–E4 pass.
- 02:21 — after the judge's round 1 fixes: `node tools/fixture-pack.mjs` → 47/47; `deploy-config.py --dry-run Engine.ini` → «совпадает» (the same bytes as deployed);
  the real `-Verify` again → part in place, clean.

## 4. Checks

Hygiene: `PSParser.Tokenize` of the script — no errors; `node --check tools/fixture-pack.mjs`.
Functional run: the fixture walks the user's path (deploy with `-WithEngineIni`, `-Verify`, `-EngineIniOut`) on temp packs — merge by section (key replaced, new line at
the section end, new section at the file end, the pack's comments kept), the override warning, the fragment-only mod's deploy line, `-Verify` green, `-Verify` red when
the game lost a part line, green when the game rewrote the file without comments and with spaces around «=», a base with a repeated section (the key replaced in both
copies, the new line in the last), a part without a section refused, the disabled-mod control. On the real pack: the merged text read key for key against the shipped
Engine.ini and the game's file; the real deploy and the real `-Verify` read.

## 5. Found

- Judge round 1 (all confirmed): a base/appendFile pack would drop parts silently; a repeated base section let the part's value lose; a part without a section was lost;
  `-Verify` compared raw lines (false greens/reds); warnings did not reach the owner through `deploy-config.py`; a disabled mod printed «its part goes into Engine.ini».
  Fixed; the fixture got a case for each reachable one. Declined as cosmetic: a comment above a replaced key lands at the section end; two label lines when a part has
  the same section twice; override warnings repeat per target.
- Judge round 2 (all confirmed): a key before the part's first section was moved into it; a disabled mod named in -Only lost its part silently; the player's
  installer does not merge parts (Engine.ini reaches the player through the -ConfigFrom snapshot — the manifest comment now says so); -Remove left the keys without a
  word; comments claimed «every part line»; verify repeated the merge warnings. Fixed (the fixture 50/50); the installer path is documented, not changed.
- Judge round 3 (all confirmed): a part replacing a multi-value key (Conan's 90 `Paths=` in `[Core.System]`) would collapse it — now refused (a repeat inside ONE section
  copy; once in each of two copies stays «last wins»); the base/appendFile refusal sat only in the `engineIni.file` branch — moved to the top of `Write-EngineIniFile`;
  a broken part crashed `-Verify` — now a [FAIL]. Fixture 53/53.
- Judge round 4: «the merge engine itself has no defects»; two low message findings fixed (the dry-run plan now builds the text, so a refusal shows before a deploy;
  verify names array lines it does not check; «missing or different»). Declined as cosmetic: cp866 decoding of PowerShell failure text in `deploy-config.py`, an empty
  backup folder after a failed build, the bundle's deploy line «written with -WithEngineIni».

## 6. Traces

This report; the fixture output (`node tools/fixture-pack.mjs`); `ConanExiles/_config/backup/2026-11-10_021727` (the game's Engine.ini before the deploy).

## 7. Verdict

pass — the merge, the verify and the export path work on the stand; on the real game the player's deploy wrote the merged file, the running game read all three
settings, and the verify stayed green on the file the game rewrote on exit.
