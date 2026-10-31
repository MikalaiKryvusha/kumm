# Run report — Conan: the hero's craft keeps its real speed while the inventory slows the world (plan 35 G12, plan 36 item 3)

- **Work:** case P2 of `testcases/TC_conan_build_stability_compat_perf_2026-10-26.md`. Basis — `[OWNER]` «мир замедлен, но крафт быстрый в инвентаре - нужно
  подумать, как лучше сделать» · «я за то, чтобы в инвентаре ускорить» · 2026-10-26; the done-criterion of plan 36 §3: a short recipe with the inventory open is
  ready in its own real seconds while the world stays slowed.
- **Contour:** game `D:\Games\Conan Exiles 3.0.1` (background path), the oasis save (restored after), `KrinikConanUI` section `krinik_pause_in_menu`
  (inventory slows the world to 0.03); `MakeMeAdmin` + `SpawnItem 12001 100` (plant fiber); the inventory opened by
  `ActivateModule(FName('CharacterInventory'), true, false)`; the recipe «Грубая повязка» (10 plant fiber) and «Сделать» clicked by the real mouse
  (`mouse-seq.ps1`); the queue read from frames by a pixel script (slot 1: item present, progress bar length). Machine lock `kumm` 11:47–11:55.
- **Runs:**
  - 11:50 craft 1 started with the multiplier 1.0 (the mod's switch off): bar 30 → 34 px in 4 s (≈ 1 px/s of 54 — about a minute per bandage); the multiplier
    set to 0.03 by the remote in the middle — no change; set to 33.3 — the item finished at its own pace (≈ 11:51:00).
  - 11:51:3x craft 2 started with 33.3: bar ≈ 0–1 px after 40 s — the multiplier scales the DURATION and is read at the item's START.
  - 11:52 queue cleared, the multiplier 0.03 by the remote, craft 3: bar 16 px at 0.76 s, 38 at 1.74 s, done at 2.72 s.
  - 11:54 the mod switch on (`CRAFT_SPEEDUP = true`), relaunch: inventory opened → log «крафт героя: CraftTimeMultiplier = 0.03»; craft 4 by the real click:
    bar 18 px at 0.87 s, 44 at 1.99 s, done by 3.05 s; inventory closed → log «крафт героя: CraftTimeMultiplier = 1.0».
- **Checks:**
  - Hygiene: `luac -p` on the section — ok.
  - Functional run: a real bandage craft in the open inventory through the mod; read — the mod's log lines, the queue slot on frames every ≈ 1 s.
  - P2 pass: with the inventory open (world 0.03) the bandage is ready in ≈ 2.5–3 s of real time with the mod, ≈ 1 min without it; the multiplier returns
    to 1.0 when the inventory closes.
- **Found:** the multiplier is read when an item STARTS — an item started before the inventory opened keeps the slow pace; a queue of several items picks up the
  current multiplier per item.
- **Traces:** `UE4SS.log` lines «крафт героя: CraftTimeMultiplier = …» 11:54; frames `g12_*.jpg` and `g12_bar.py` in the session scratchpad.
- **Verdict:** pass.

REAL WORLD: accumulated — the owner's own build and oasis save (restored copy); data and machine — his PC and game install; path — the inventory craft by the
real mouse, opened by the remote instead of the key (a synthetic «I» did not reach the game). The game's base time of the bandage recipe was not read from data.
