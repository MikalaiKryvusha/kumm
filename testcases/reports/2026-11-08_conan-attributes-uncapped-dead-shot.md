# Run report — Conan: attributes past 20 by a pak edit of the cap, and «Верная рука» arrow speed ×1.2


## 1. Work

`testcases/TC_conan_attributes_uncapped_and_dead_shot_2026-11-08.md` — B1, B2, A0–A3, D1, D2 (the owner 2026-11-08 23:05 «(А) — правку пака скриптом» ·
«это имбаланс … процентов 20% прибавлял к скорости»; plan 49 criterion 1).

## 2. Contour

pack `ConanExiles`, `_config/devkit/build-level-mod.py` with the new step 4b (`vanilla_patches.py`); deployed by `Deploy-ModPack.ps1 -PackDir
D:\work\ai_sandbox\ConanExiles -Deploy -Only KrinikConanGameplay` (verify 113 present, 0 missing); game `D:\Games\Conan Exiles 3.0.1`, background path
(`launch-bg.ps1`, PID 15536, 23:38:58), world by the remote (40 s); the owner's save; machine lock `kumm`.

## 3. Runs

- 2026-11-08 23:27 A0 `pult.sh "lua _G.__attr={stat=19}; return dofile('…/attr-cap-probe.lua')"` on the build before the edit.
- 2026-11-08 23:36–23:38 B1 `python -I -X utf8 _config/devkit/build-level-mod.py --name KrinikConanGameplay --work <scratch>/glbuild3 --out _unpacked/KrinikConanGameplay`
  (two failed runs before it: the module path, then `name` overwritten by the chest-row loop in step 6 — both fixed).
- 2026-11-08 23:38 B2 `python -I -X utf8 guard_b2.py` (scratchpad): `PATCHES` with the old value 3.0.
- 2026-11-08 23:41 A1 / A2 the same probe, read and `target=26`; 23:42 A3 `ActivateModule(FName('Attributes'), true, false)` + `capture-window.ps1 -Width 3840`.
- 2026-11-08 23:44–23:47 D1: slot 3 by `InpActEvt_Shortcut2_K2Node_InputActionEvent_23`; `LaunchProjectile()` fires nothing now (the archery log silent ×2); real mouse
  refused twice (the owner at the keyboard, `owner-idle.ps1` BUSY — HOUSE_RULES rule 30); the shot by the hero's input events through the remote —
  `InpActEvt_SpecialActionV2_…_7` (RMB down) · 0.8 s · `InpActEvt_PrimaryActionV2_…_9` / `_10` (LMB) · `InpActEvt_SpecialActionV2_…_8` (RMB up); shot #1 without the
  trait; `BP_PerkSystemComponent_C:AddBranchedPerk(FName('Agility_10b'))` (ChosenBranchedPerks was empty — the 2026-11-08 13:1x `ServerResetAttributeAll` had
  dropped it); shots #2, #3 with it.

## 4. Checks

Hygiene: B1 step 6 — three tables 10 000 rows = generators, the chest table, «ванильные блюпринты … 2 из 2 = собранным» on Windows, WindowsServer,
  LinuxServer; edits — `MaxAttributePointsSpent 20 → 10000` (2 bytes @uexp+3124), `ExecuteUbergraph_BP_BaseProjectile 2.0 → 1.2` (8 bytes @uexp+23646). B2 — the
  build stops «число 3.0 не найдено в байткоде ExecuteUbergraph_BP_BaseProjectile».
Functional run: the live game on the background path:
  - A0 pass — «cap=20 before=25 free=53» (old build).
  - A1 pass — «cap=10000 before=25 free=53».
  - A2 pass — «calls=1 after=26 free=52»: the server took a point past 20.
  - A3 pass — the 4K frame of «Хар-ки»: «Проворство 26», «Живучесть 25», each row with its «+» node left of the bar; «Доступные очки (52/0)»; the bar full past 20
    (paging — plan 49's next step).
  - D1 pass — the archery log «скорость A → B» (A = the game's launch speed, B = after our draw scaling, charge 0): #1 without the trait 4979 → 2490; #2 / #3 with
    it 5999 → 3000 / 5999 → 2999 = ×1.2 (vanilla ×2 gave ≈ 9960 → ≈ 5000 on 2026-11-07).
  - D2 pass — the control is the 2026-11-07 log (4997–5004 with the trait): 3000 ≠ 5000, ratio 1.67 = 2.0 / 1.2.

## 5. Found

- `LaunchProjectile()` from the remote no longer shoots the held bow (it did on 2026-11-01) — the twin is the input-event sequence above (game map line).
- Two defects of my own build step, fixed in the run (Runs, B1).

## 6. Traces

frame `scratchpad/attr26.webp` (3840×2160) and `hand.webp`; `UE4SS.log` 23:46:36 – 23:47:0x «[KrinikConanArchery] #1…#3 из лука»; the built pak
`ConanExiles/_unpacked/KrinikConanGameplay/KrinikConanGameplay.pak` (1 100 944 bytes).

## 7. Verdict

pass — both edits seen working in the game. REAL WORLD: accumulated — the owner's save with Agility 26 / Vitality 25 and Dead Shot re-added by the
remote; data and machine — his game folder and save; path — the attribute window and a bow shot the way the game takes them (input events, not real mouse).

- 2026-11-09 00:0x D3 (the perk text, added after the owner asked): `vanilla-override.py` + `locres-regress.py` (54458 → 54459, lost 0) + deploy; the 4K frame of «Хар-ки» with the Agility column shows «Верная рука — Все метательное оружие и стрелы летят на 20% быстрее …» — pass.
