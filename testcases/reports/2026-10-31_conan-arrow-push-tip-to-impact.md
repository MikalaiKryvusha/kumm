# Run report — Conan: stuck arrows pushed tip-to-impact (Kappa, humanoids), arrows on the corpse

**Work.** Plan 36 W13, cases P4–P9 of `testcases/TC_conan_arrows_follow_mob_body_2026-10-31_push.md` (second and third slices). Basis — the owner's frames and
words: `[OWNER]` «вот видно стрелы торчащие из моба в воздухе» · «это моб ККаппа» · 2026-10-29; 2026-10-31 11:09 «мне показалось, что стрелы в капу начали
нормально втыкаться» · «я ее убил, и все стрелы пропали» · «что в регдоле трупа пропадают стрелы».

**Contour.** Game `D:\Games\Conan Exiles 3.0.1` (background path, the owner's last word), pack `ConanExiles` from `e536ce9` through `46e2069` to the uncommitted
bone cap and `tip_in_cm` −15 (KrinikConanArchery Lua hot-copied into the game folder between launches); the oasis save, restored from
`_save-backup/2026-10-31_1004-before-w13-arrows` after every exit; god mode by `god-on.sh`; targets: green Kappas summoned by `arrow-stand.sh summon`
(`CheatManager:Summon`), villagers `HumanoidNPCCharacter_C` brought 6 m before the camera by `arrow-stand.sh place`, frozen by `CustomTimeDilation 0`.
Machine lock `kumm` 10:54–11:20, 11:23–11:30, 11:30–11:40.

**Runs.**
- 10:54 / 11:01 / 11:23 / 11:26 / 11:30 / 11:35 / 11:37 `launch-bg.ps1` + `enter-world-remote.sh`; each closed by `close-game.ps1` (clean, no crash reporter).
- Shots: `mouse-seq.ps1 -Seq "rdown,wait:1500,lclick,wait:400,rup"`; side frames by the scratch scripts `w13/shot-side.sh`, `here-shot.sh`, `corpse-shot.sh`
  (hero moved to the side, hidden, `capture-window.ps1 -Width 3840`); copies read by `pult.sh "lua … FindAllOf('BP_DummyProjectile_C') …"`.
- 11:3x bytecode: `retoc-5.8 to-legacy --filter BP_DummyProjectile` → `uaj exports` → `UAssetGUI tojson VER_UE5_8` → `kismet-trace.py … ExecuteUbergraph_BP_DummyProjectile`.

**Checks.**
- Hygiene: `luac -p` on `main.lua` after each edit — ok; `check-lua-game-thread.py` — 0 worker-thread calls; the game copy `cmp`-equal to the source at the end.
- Functional run: real bow shots at living targets; read — the mod's «в тушку» log lines (push, bone depth, tip, mesh length, impact point), side frames at 4K,
  the copies' attach parent after the kill.
- P4 fail → finding (the copy is born 180–187 cm short of the impact point). P5 pass (Kappa, tip-to-impact). P6 partial (released Kappa did not walk).
  P7 fail → fixed → pass (humanoid thigh and chest went through with +10; −15 and the bone cap — inside). P8 the owner's symptom reproduced; P9 control — the game
  removes the arrows with the dead creature.

**Found.**
1. The arrow copy is born ≈ 1.8 m short of the hit — the arrow hung ≈ 1.1 m before the Kappa's snout (the owner's W13 symptom). Fixed by the tip-to-impact push.
2. The game's impact point lies 21–39 cm deeper than the visible skin; with +10 cm the arrow went through a human thigh and chest. Fixed: `tip_in_cm` −15 and the
   tip never past the hit bone.
3. Arrows leave the corpse: the copy binds `DestroyDummyIfAttachedObjectIsDestroyed` to the hit actor's `OnDestroyed`; the dead creature is destroyed — vanilla.
   With our push the two copies survived detached at 0 0 0 (they keep their lifespan). Keeping arrows on corpses — a feature, not started.
4. A summoned plain `HumanoidNPCCharacter_C` has no look; `Summon` cannot load an unloaded class («Failed to find class»).

**Traces.** Frames and sheets in the session scratchpad `w13/` (`s3_crop.webp` before, `f1_crop.webp` after, `h2_crop.webp`, `h3_crop.webp`, `h4_crop.webp`,
`k16_crop.webp`, `p8_sheet.webp`, `p9_sheet.webp`); `UE4SS.log` «в тушку» lines 10:57–11:39; bytecode trace `w13/bp2/uber.txt`. Window of crash reports: none
appeared.

**Verdict.** partial — the push is right on the Kappa's head and a human's thigh and chest by side frames; a walking body (P6) and other creatures (rhino,
elephant) not seen; arrows on corpses stay the game's behaviour.
