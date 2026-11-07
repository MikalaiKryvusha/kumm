# Mod notes — KrinikConanLocomotion (ours: how the hero moves — jumps in combat, run and jump growing with the hero)

> **Created:** 2026-11-07 · on the owner's word (below) · **Parent:** HOUSE_RULES rule 19 (the Krinik set), `KrinikConanArchery.md` (jump shooting 0.7.0),
> `KrinikConanGameplay.md` (section `krinik_oblivion_locomotion`)
> **Status:** 🟡 in the build since 2026-11-07 11:06 (pack after `f59a5a2`) — melee in a jump M1–M5 pass (remote input events), the bow's air shot by real input
> open (M6); TC `testcases/TC_conan_locomotion_melee_jump_2026-11-07.md` · **Outbound:** —

**The owner's word, verbatim (2026-11-07 10:39 +03:00):** «Немного изменяем состав и структуру модов Krinik / ДОбавляем мод / KrinikConanLocomotion. В него входят:
/ - прыжки при стрельбе / - прыжки при махании холодным оружием / - развитие прыжка при прокачке / - развития ьега при прокачке / - ПЛАН: прыжки от карабкания по
стенам». The melee request itself, 2026-11-07 ≈10:10: «При прыжке с оружием ближнего боя - мечи и так далее - тоже нужно делать возможноть бить в воздухе, по
аналогии, как сделали стрельбу из лука в прыжке».

## What it holds

| Part | Came from | What it does |
|---|---|---|
| combat in a jump — the bow | `KrinikConanArchery` 0.7.0 (its section «стрельба в прыжке») | the bow fires in the air; a jump mid-draw takes off |
| combat in a jump — melee | new (section `krinik_air_combat`) | a melee weapon swings ONCE in the air (the combo advance window closed while airborne); a jump pressed mid-swing on the ground waits for the swing's end (the game's own rule — the owner 10:47) |
| run and jump growth | `KrinikConanGameplay` section `krinik_oblivion_locomotion` | +3 cm/s to run, sprint and jump per Agility point (as in Oblivion) |
| PLAN — a jump off a climbed wall | the owner's request of 2026-11-02 09:07 (game map «Climbing») | not built |

## How the combat jump works (the game's two refusals — game map, «Атака в воздухе»)

1. `BaseBPCombat::ActionTry` refuses an attack while substate 8 (falling) — a UE4SS hook on it runs AFTER its body, so the substate is left at take-off:
   `HandleOnMovementModeChanged` → movement mode 3 → `ExitSubstate(8)`, for the player with a weapon in hand.
2. `BasePlayerChar::CanJumpInternal` refuses while `IsAttacking()` — called from C++, a hook never fires; after a refused `StartJump` the attacking hero on the
   ground, not exhausted (substates 13, 14, 18), gets `LaunchCharacter(0, 0, JumpZVelocity)`.

## Melee — the owner's design (2026-11-07 10:47 +03:00, verbatim)

«делаем так: / - если началась анимация махания стоя на земле - пробел не действует, пока анимация не закончится / - если герой прыгнул и в воздухе нажимают
"Бить" герой в воздухе махает простой анимацией». So: NO launch mid-swing for melee (the bow keeps its launch); in the air one simple swing, not the combo.
Measured before the word (remote, 10:44–10:46, Меч Крома `sword2h_C` on `Socket_Main`, the hero's own input events `InpActEvt_PrimaryActionV2_*` / `InpActEvt_Jump_*`):
a ground swing plays the combo montages `DGS_ComboA2_AM` / `DGS_ComboB3_AM`; in the air the game refuses (control); with `ExitSubstate(8)` at take-off the swing
starts in the air and the jump arc is unchanged (z −19959 → −19870 → lands by +1200 ms, as without the swing); a jump pressed mid-swing on the ground is
REMEMBERED by the game and done right after the swing (seen: the hero airborne at the next probe's start) — kept as the game's behaviour `[AI]` (said to the
owner 10:48). `HasWeaponsEquipped()` is true with the sword in hand.

## Open

- **M6 try 2026-11-07 19:2x — FAILED TO EXERCISE (not a verdict on the mod):** `_config/m6-air-shot.sh` (owner-idle FREE → tp to the oasis → side `fixed-cam.lua` →
  `input.ps1 -Key 3` → 3 s window capture while `mouse-seq.ps1` sends Space · RMB down · LMB click · RMB up). The 12-frame sheet: the hero stands in one pose in all
  frames, no jump, no draw; the view stayed the normal third-person camera (the side camera did not apply); a game line «Всё пошло не так…» at the bottom (unread).
  The real keys did not reach the hero, or the focus did not hold. Next: check focus right before the sequence (the slow-shot path that worked 2026-11-02 runs with
  the game ALREADY in front), drop the fixed camera for this case, read what «Всё пошло не так…» is. After the run the foreground was handed back to VS Code.

- **NEXT FEATURE (the owner 2026-11-07 10:50, verbatim):** «и было бы хорошо, если бы если игрок попадает в тайминг при ComboStep >= 1, и нажимает в этот тайминг пробел -
  чтобы герой подпрыгивал с замахом меча за голову, нанося удат в падении из пряжка на землю» — a combo finisher: inside the combo advance window (combo step ≥ 1)
  Space = a leap with the sword raised over the head and a downward strike on landing. 10:50 «если это сейчас сложно - на будущее идея» → an idea for later.
  Found for it (10:51, the pak list of `IMM_WAR.pak`): the combo montages the hero plays with a greatsword are Immersive Warriors Enhanced's own
  (`/Game/Mods/IMM_WAR/Anims/ASM/Comb/Gswd/{L,H,FC}/DGS_Combo*_AM`), and the mod ships jump variants — `Gswd/FC/DGS_Skill_D_AM_Jmp`, `Gswd/H/DGS_ComboB5_AM_Jmp`,
  `BH/A/DH_Combo_A4_RM_AM_Jump` — the first candidates for the leap strike.
- **The air swing's animation** is chosen by the game + IMM_WAR's combo rows (`GetCombo`: the current `ComboID` chain or an opener); clearing `ComboID` to None
  before an air press still gave A3 / B3 (10:49) — the choice is not by the chain id alone. Shipped: one swing per jump, the animation left to the game; the look
  goes to the owner's eye on a clip; pinning one montage is the next step if he wants it.

- **FUTURE (the owner 2026-11-07 10:48, verbatim):** «возможно в будущем подумаем, как можно было бы анимацию удара на семле красиво прерывать и выполнять прыжок, если
  во время анимации нажали пробел» — not now; an idea for later (a blend out of the swing montage into the jump).

- Measured (TC above): the air swing keeps the jump arc (root motion does not hold the hero); the take-off reset (`ClearComboAdvanceWindow`) gives `light_c0` in
  the air even right after a ground combo; a second press inside the air swing plays the next step after landing (the game's queue). A hook on
  `ComboWindowOpen` never fires for the player — not used. Open: the bow's shot in the air by real input (M6 — the remote's LMB does not shoot the bow); the
  look of the air swing for the owner's eye (a clip); Immersive Warriors' combo set vs the vanilla montages — which one plays depends on the session (10:35
  `DGS_*`, 11:03 vanilla), not settled.
