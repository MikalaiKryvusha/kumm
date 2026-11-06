# Run report — Conan: Bosses My New Besties's boss placement ghost grafted into LBPR's thrall system

## 1. Work

Plan 45 step 8a — `[OWNER]` interview #034 Q2 = A + «если получится, то в LBPR нужно затянуть модельки из Bosses My New Besties» (2026-11-06 13:34).
Case set `testcases/TC_conan_thrall_ghost_graft_2026-11-06.md` (G1–G5). Basis: BMNB's `ShowThrallPlaceable` read byte-exact from its own container — a boss
(`Npc.Boss.Miniboss` / `Npc.Boss.WorldBoss`) placement ghost gets a fixed scale (1.2, 1.2, 1.2), others the thrall's own.

## 2. Contour

Conan Exiles 3.0.1, `D:\Games\Conan Exiles 3.0.1`, the build's mods; edited `No_Building_Placement_Restrictions.pak` md5 `70e6d4f524923f2187a85dc00b4e6c06`
(library `_krinik-modified/3755091710`, original `16b8951d…` in `_patch-originals`); background path, the owner's oasis save; tools `kismet-graft.py`,
`patch-mod-asset.py` (`graft:` line, `priority_view`, `zen_restore_deps`), `uaj rawput`, `_config/thrall-ghost-probe.lua`.

## 3. Runs

- 2026-11-06 13:4x–13:51 +03:00 offline: `python -I -X utf8 kismet-graft.py <game> <BMNB> <LBPR> ShowThrallPlaceable <out>`; `uaj rawput …`; `python -I -X utf8 patch-mod-asset.py build No_Building_Placement_Restrictions BP_ThrallSystemComponent <work> _config/krinik_patches/No_Building_Placement_Restrictions__BP_ThrallSystemComponent.tsv`.
- 2026-11-06 13:56 +03:00 launch 1 (`launch-bg.ps1`, `enter-world-remote.sh`): G1, G2; `StartMovingThrall(<hostile boss>)` → crash 13:59:43 (EXCEPTION_ACCESS_VIOLATION 0x10).
- 2026-11-06 14:00 +03:00 launch 2: `exec MakeMeAdmin`, `exec SpawnItem 25002 1`, `thrall-ghost-probe.lua` mode `use`; reading `PlaceableThrallActor` / `CurrentThrallBrushClass` by Lua → crash 14:08:36 (0x242).
- 2026-11-06 14:09 +03:00 launch 3: `use` ×7 (no risky reads), frames `capture-window.ps1` 14:14; game alive until closed by its PID 14:2x.

## 4. Checks

- Hygiene: the graft's self-checks — new bytecode parses whole, memory size 2616 → 2876 (= BMNB's +260), disk 3628 → 3964 (= BMNB's +336); 19/19 jumps of LBPR lead to the
  same statements by meaning; result vs BMNB differs only in LBPR's own edits, vs LBPR only in BMNB's lines; 28/29 exports byte-identical to LBPR's; build guards —
  to-zen control + original dependencies = LBPR's chunk byte-exact, the edited to-zen keeps the control's dependency sections, back-parse of the finished chunk = the
  patched legacy.
- Functional run: walked on the real game with the build — G1 pass (3 world entries, LBPR's container re-extracted, no error for the asset); G2 pass (live UFunction
  has 48 properties incl. the five grafted); G3 partial (in placement mode a human-size figure stands on open sand, frame `g2-Tavern_Barkeeper.jpg` — that it IS the
  placement ghost was not confirmed (opaque, no placement prompt in the frame), its scale number not read; 7 uses, 0 script warnings from `ShowThrallPlaceable` — no
  failure seen, which does not show the grafted lines running); G4 blocked; G5 not run (offline export compare only). Independent judge pass 2026-11-06 14:31 +03:00 (subagent, the
  build re-run from the recipe): VERIFIED WITH CAVEATS — the inner files of the rebuilt pak byte-identical to the deployed one (only the outer pak's file order
  differs), 19/19 jumps confirmed by its own alignment, the six grafted statements identical to BMNB's, `extract` now gives three different copies.

## 5. Found

1. `patch-mod-asset.py extract` returned the GAME's copy for a vanilla path a mod ships whole (both mods' `BP_ThrallSystemComponent` came out md5 `173b08c4…`, the
   vanilla one): retoc ranks the game's containers higher. Fixed — `priority_view` (the mod's container as `<Mod>_P`, the highest rank). Twins: builds of the two other
   vanilla-path paks (LegitReligious, Storage Reach Expanded) use `PATCH_VIEW` (only the mod) — not affected.
2. UAssetAPI 1.1.0 parses UE 5.8 function FProperties into garbage (names like sound-cue paths) — the graft reads them by bytes (43-byte base + tail per type).
3. retoc `to-zen` of this blueprint differs from the cooked chunk ONLY in the dependency sections (96 bytes, 24 entries fewer) — the original sections are put back.
   The finished chunk grows 97 120 → 113 137 bytes: UAssetAPI's write marks all names as export-data names, so the zen name map carries all 847 names instead of 403 —
   harmless (G1, G2 live; the back-parse guard holds).
4. Crash 1 (13:59) — `StartMovingThrall` on a hostile non-thrall NPC; control with the original pak NOT run, cause not proven. Crash 2 (14:08) — after Lua reads of
   `PlaceableThrallActor` / class properties; launch 3 with the same placement and without those reads stayed alive — the probe, most likely (not proven by a control).
   Both crash-report windows closed by PID (25448, 30136).
5. The ghost is built from the thrall ITEM's character layout: changing `ThrallInfo.SpawnTableId` to `Aesir_Boss` gives the same ghost (frames identical) — a boss ghost
   needs a recruited boss item.

6. G4 control run 2026-11-06 15:34-15:37 +03:00: thrall item template 505 (row Aesir_Boss) has the same ghost height with the original LBPR pak and with the graft (sheet `2026-11-06_conan-thrall-ghost-g4-sheet.webp` next to this report) - inconclusive, a boss-TAGGED ghost is still needed. The grafted pak restored after (md5 70e6d4f5...).

## 6. Traces

Frames `scratchpad/thrall/g2-Tavern_Barkeeper.jpg`, `g2-Aesir_Boss.jpg` (session scratchpad); crash folders
`Saved/Crashes/UECC-Windows-938D3278…_0000`, `UECC-Windows-5D8C70DB…_0000`; game log `ConanSandbox.log` 14:10–14:14 (`ShowThrallPlaceable` silent).

## 7. Verdict

partial — the grafted asset loads and its new locals are in the live function (G1, G2); seven placements of an ordinary thrall ran with no script warning (G3
partial — no failure seen, the grafted lines' effect not observed); the boss ghost's 1.2 itself (G4) is not observed: it waits for a
recruited boss item (BMNB's own function in play — already owed in STATUS); G5 not walked.
