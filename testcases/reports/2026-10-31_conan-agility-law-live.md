# Run report — Conan: the Athleticism law of KrinikConanGameplay seen live with points spent (idea 03, plan 36 item 27)

- **Work:** plan 36 item 27 (ideas 03, 04, 05 against the build) — the one function never seen live: run speed and jump growing with Athleticism. Basis — idea 03
  (`[OWNER]` «чем выше Ловкость, тем выше прыжок и быстрее бег», its header) and the merge report `2026-10-30_conan-krinik-conan-gameplay-merge.md`
  («Not checked: … a run with Agility above 0»).
- **Contour:** game `D:\Games\Conan Exiles 3.0.1` (background path), the oasis save (the hero with 54 unspent points, all six attributes 0), restored after;
  `KrinikConanGameplay` section `krinik_oblivion_locomotion` (law: run 450 + 3 per point, jump 420 + 3 per point). Machine lock `kumm` 12:02–12:06.
- **Runs:** 12:03 `launch-bg.ps1` → world → `god-on.sh` → `exec MakeMeAdmin`; tries that did NOT change the stat: `exec SetStat Athleticism 20`,
  `exec SetStat Agility 20`, `exec SetAttribute Athleticism 20`, `CheatManager:SetStat('Athleticism'|'Agility', 20)` (read back `GetIntStat(19,0)` = 0);
  then the player's path: hub by `ActivateModule(FName('CharacterInventory'), true, false)` → the «Хар-ки» tab clicked (`mouse-seq.ps1 move:0.35/0.036`) →
  the «+» of «Проворство» clicked 10 times (`move:0.191/0.357`, 4 registered) → `GetIntStat(19,0)`, `CharacterMovement.MaxWalkSpeed`, `JumpZVelocity`; hub closed.
- **Checks:**
  - Hygiene: none.
  - Functional run: points spent in the character window by the real mouse; read — the mod's log lines and the hero's movement values by the remote.
  - Athleticism 2 / 3 / 4 → `MaxWalkSpeed` 296.4 / 298.4 / 300.3 (≈ +2 per point = the native speed × (450 + 3N) / 450, «x1.0267» at 4); `JumpZVelocity` 432 at 4
    (= 420 + 3 × 4). pass.
- **Found:** `SetStat` (console or cheat manager) does not raise an attribute in 3.0.1 — attributes move only through the character window's points.
- **Traces:** `UE4SS.log` lines «Проворство 3 → 4: … бег 462 (x1.0267) … взлёт 432» and «скорость сменилась: MaxWalkSpeed 296.4 / 298.4 / 300.3»; frame `a_attr.jpg` in
  the session scratchpad.
- **Verdict:** pass.

REAL WORLD: accumulated — the owner's own build and oasis save (restored after: the spent points are not kept); data and machine — his PC and game install;
path — the character window's «+» by the real mouse, as a player spends points.
