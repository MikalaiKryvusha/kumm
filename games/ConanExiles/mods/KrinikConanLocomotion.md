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
| a jump off a climbed wall (section `krinik_wall_jump`, 2026-11-14 15:3x) | the owner's request of 2026-11-02 09:07 (game map «Climbing»); asked again `[OWNER]` 2026-11-14 09:54 «еще я хотел прыжки из карабкания по вертикальным поверхностям» | Jump while climbing (`MovementMode` 7 — the game itself does nothing on that press) → a forward trace finds the wall's normal → `CharacterMovement:ExitClimbing()` + `LaunchCharacter(normal × 250 + up × 350)`: ≈ 1.6 m off the wall, +63 cm at the top, a soft landing (W1, clip `_scratch/walljump/wj1.mp4`); hook — a post-hook on `BaseBPCombat_C:StartJump`, which fires on the wall too, at the same moment of the press as the game's own ground jump; not a wall in front (a ceiling, a slope) → nothing. TC `testcases/TC_conan_wall_jump_2026-11-14.md`; the numbers wait for the owner's eye (W5 by his Space) |
| sprint with the bow drawn (section `krinik_bow_sprint`, 2026-11-10 19:54 +03:00) | the owner 2026-11-07 20:50 · 2026-11-10 19:09 «Спринт с луком делаем» | one gate (player, Shift held, bow drawn 15 / 16, moving, the angle inside the `Sprint` row's window from `DT_CharacterMovement`, on the ground, not exhausted) opens two doors: the native `K2_CanSprint` post-hook → true, and `EvaluateMovement_RangeCombat` → false only when the game's own `EvaluateMovement_Sprint` said yes through OUR door in that call. Game map «The movement row». TC `testcases/TC_conan_bow_sprint_2026-11-10.md`; judge round 1: 10 findings, 8 confirmed and fixed (the gate, the forced flag, cost, table read, retry, angle check, cost line, header), 1 declined (`IsLocallyControlled` — single-player build, as air_combat), 1 to check by eye (the crosshair on the run). Cost after the rework: 2160 calls / min, 67 ms, worst ≤ 1 ms tick in the agent's minutes — CORRECTED 2026-11-13: the owner's play read «худший 2.000 мс» (judge round 2). **Build 4 (2026-11-13, bug 93):** the gate opens in substate 11 too (the draw's and the release's first substate) — a sprint started BEFORE the draw broke at the draw (the owner's order, never in the agent's cases); the nested `EvaluateMovement_Sprint` call dropped; per-hook registration retry. **Build 7 (2026-11-13 10:43):** S1b (sprint first, then draw, shot, sprint kept at 660), S3, S6 pass by real input on the owner's save (report `testcases/reports/2026-11-13_conan-bow-sprint-sprint-then-draw.md`); a third lever (a `WeaponEquipped` post-hook, builds 5–6) was removed — it never fired with a properly wielded bow. Open: S8 overloaded, S9 sheathed bow, the cost (worst 2 ms at a 1 ms clock step) |

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

- **M6 CLOSED 2026-11-10 19:10 +03:00 by the owner's own play** — `[OWNER]` 2026-11-10 19:10 «Я много раз прыгал и стрелял, работает, стрелы летят» · «супер механика получилась»:
  the bow's shot in a jump by real input works (arrows leave the bow in the air). The agent's synthetic-input attempts below stay as the history of the stand.
- **M6 try 2026-11-07 19:2x — FAILED TO EXERCISE (not a verdict on the mod):** `_config/m6-air-shot.sh` (owner-idle FREE → tp to the oasis → side `fixed-cam.lua` →
  `input.ps1 -Key 3` → 3 s window capture while `mouse-seq.ps1` sends Space · RMB down · LMB click · RMB up). The 12-frame sheet: the hero stands in one pose in all
  frames, no jump, no draw; the view stayed the normal third-person camera (the side camera did not apply); a game line «Всё пошло не так…» at the bottom (unread).
  The real keys did not reach the hero, or the focus did not hold. Next: check focus right before the sequence (the slow-shot path that worked 2026-11-02 runs with
  the game ALREADY in front), drop the fixed camera for this case, read what «Всё пошло не так…» is. After the run the foreground was handed back to VS Code.
  19:3x probe: `input.ps1 -Key 0x20` (game focused, «key 0x20 pressed x1») → the hero's Z stayed −20068 before and after (no jump) — real Space does not
  move the hero in this session at all; ~~suspect the hero's state~~ — CORRECTED 19:2x–19:3x, the cause is the input path:
  `input.ps1` brought the game forward at 19:26 (the hero jumped) but left VS Code in front at the next call (cause not read — its new owner-idle guard may have refused silently); `mouse-seq.ps1` sends to whatever window is in front — the Space probes of 19:2x–19:3x
  — CORRECTED by the mod log: the `input.ps1` press of 19:26 reached the game (the hero jumped); at most ONE space (the `mouse-seq` press made with VS Code in front) went to the owner's VS Code. `mouse-seq` sends scan codes (`KEYEVENTF_SCANCODE`); `input.ps1 -Key` uses `keybd_event` with no
  scan code (raw-input games may ignore it). NEXT for M6: bring the game forward with a tool that does it (`SetForegroundWindow` on the game window, as in
  `esc-when-idle.ps1`), check that the foreground IS the game, only then `mouse-seq`; give the foreground back after.
  19:3x: `_config/game-front.ps1` (new: owner-idle probe → Alt tap + `SetForegroundWindow` → «front <prev hwnd>» only when the game IS in front; `-Restore`) works —
  the game came forward and the focus went back each time. Its Alt tap counts as input, so `mouse-seq` right after it runs with `-MinIdle 0` (the probe was just done).
  Three real Space presses with the game verified in front (incl. 0.8 s after activation) — the hero's Z read by the remote stayed −20068. FIRST next: check the READER —
  a jump by the remote's input event (`InpActEvt_Jump_*`, worked in the morning) with the same Z probe; if Z does not move then either, the probe reads the wrong pawn.
  **19:3x CORRECTION by the UE4SS log:** the mod logged «прыжок с луком: выстрел в воздухе разрешён (7, 8)» at 19:24:59 (the m6-air-shot run) and «(9, 10)» at 19:26:00
  (the `input.ps1 -Key 0x20` press) — the hero DID jump with the bow and the air-shot permission fired; the remote Z probe is too slow (its answer comes after the
  landing), so «Z stayed −20068» proves nothing. No such line after 19:26 — the presses after `game-front.ps1` did not jump (its Alt tap = the game's dodge key may
  swallow them — check). NEXT: judge M6 by the mod's log line + a 60-fps clip around the press (not by remote Z); check the arrow left the bow (arrow count / a projectile).
  **19:37 result:** the bow by REAL input works on the ground — draw (RMB) and release (LMB) fired arrow #3 (Archery log «#3 из лука» 19:37:19); `mouse-seq` itself
  brings the game forward (Alt + SetForegroundWindow, lines 68–70) and gives the window back, so its Spaces went to the game, NOT to VS Code (the «spaces in VS Code»
  claim above is withdrawn). The JUMP by a synthetic Space is unreliable: 2 of ~7 presses jumped (19:24:59, 19:26:00 — the mod's «прыжок с луком» line), the scan-code
  and the new VK-only (`vkdown`/`vkup`, mouse-seq) Spaces after 19:28 did not; the idle (vanity) camera eats the first press (`EnableVanityCameraMode(false)` first).
  NEXT: find what the two jumping presses had (timing after focus? the bow state?) — e.g. hold Space 200+ ms, press it twice; judge by the mod's log line.

- **Sprint + bow at the same time (the owner 2026-11-07 20:50 «Спринт и стрельбу делаем возможными одновременно»; 2026-11-08 12:22 «очень хочется это») —
  recon 2026-11-08 12:3x (read-only, no run):** none of our Lua stops the sprint on draw / shot — `krinik_oblivion_locomotion.lua` only writes
  `PlayerSprintSpeedScale` on an Agility change (:208), `krinik_air_combat.lua` only exits substate 8 at take-off, Archery hooks `SetPowerCharge` / `EndPowerCharge`
  (play rate, FOV). The game: `EvaluateMovement_Sprint` = `TrySprint` AND `K2_CanSprint` AND «not in a substate» AND `EvaluateMovement_Range` (graph read 2026-09-13,
  `ideas/03` :388); substates (`ECharacterSubState.h`): Sprinting 7, Attacking 11, PowerCharge 15, ChargeHold 16 — a draw is an attack. Likely lever: the
  substate test inside `BaseBPCombat_C:EvaluateMovement_Sprint` (bytecode: `retoc to-legacy --filter BaseBPCombat` → `uaj exports` → `kismet-trace.py
  … EvaluateMovement_Sprint`, also `TrySprint`, `OnSubstateChanged_Sprint`). Unknown: which substates it refuses; whether aiming caps the speed separately
  (`MovementSpeedOverride`, `ConanCharacter.h:487`). Control case first (Krinik Lua off vs on: sprint, RMB, read `GetSubstateList()` + `MaxWalkSpeed`).
  **Bytecode read 2026-11-08 12:4x** (`retoc-5.8 to-legacy --filter BaseBPCombat|BasePlayerChar` of `_paksview-3.0.1`, `UAssetGUI tojson VER_UE5_8`, `kismet-trace.py`):
  `BaseBPCombat::EvaluateMovement_Sprint` = `TrySprint` (reads `bTrySprint`) AND `K2_CanSprint` AND NOT `InSubstate(18)` — no attack test there;
  `OnSubstateChanged_Sprint` on entering 7 stops the sprint only if `InSubstate(14)`, the rest is sigil timers (long jump 1.75 s, sprint cost). `BasePlayerChar`
  has NO `K2_CanSprint` override (its sprint functions: `SprintAction`, `ResetSprint`, `HandleSprintStamina`, input events) → the attack / aim refusal is in the
  NATIVE `AConanCharacter::K2_CanSprint` default (BlueprintNativeEvent) or a native exit of substate 7 on an attack substate. Next: a live probe — while
  drawing, call `K2_CanSprint` by the remote and read `Value`; if false, a UE4SS post-hook on the native `K2_CanSprint` that sets `Value = true` for the hero with
  a bow drawn is the lever (native function — its out param is written before the caller reads it, unlike EXP-0487's BP case); check the aim speed cap after.
  **Live probes 2026-11-09 19:0x–19:1x (remote, no real input; launch L1 of the quick-win series, after its flight):** `K2_CanSprint` is read through its out param
  (`p:K2_CanSprint(o)` → `o.Value`; a call without the table errors «expected 1 parameters»). A STANDING hero reads `false` — the stand-still probe
  (`sprint-probe.lua`) cannot test the bow. The moving twin `ConanExiles/_config/sprint-run-probe.lua` (`AddMovementInput` every tick on the game thread + `bTrySprint`
  for 2.2 s, sample at 1.5 s into `_G.__srp`): unarmed, no draw → `K2_CanSprint=true`, substates `7,39`, `MaxWalkSpeed` 734.7, speed 690.6 (walk 427.7).
  With the RMB-down event `InpActEvt_SpecialActionV2_…_7` and EMPTY hands → substate `11` (attack), speed 15, `K2_CanSprint=false` — an unarmed RMB attack, NOT the bow
  case. The hero's events found: `InpActEvt_Shortcut0…7_K2Node_InputActionEvent_25…18`, `InpActEvt_Sprint_…_16/17`, `InpActEvt_ToggleSprint_…_11/12`, `SetSprint`,
  `StartSprint`, `StopSprint`, `GetShortcutBarInventory`. Pressing the eight shortcut events left `Children` = light + unarmed fists (either the bar is empty or a weapon
  is not an attached child — not settled). NEXT: a bow into the hand (`exec SpawnItem` + equip, or read the bar), then `_G.__srp_draw=true`.
- **NEXT FEATURE (the owner 2026-11-07 10:50, verbatim):** «и было бы хорошо, если бы если игрок попадает в тайминг при ComboStep >= 1, и нажимает в этот тайминг пробел -
  чтобы герой подпрыгивал с замахом меча за голову, нанося удат в падении из пряжка на землю» — a combo finisher: inside the combo advance window (combo step ≥ 1)
  Space = a leap with the sword raised over the head and a downward strike on landing. 10:50 «если это сейчас сложно - на будущее идея» → an idea for later.
  Found for it (10:51, the pak list of `IMM_WAR.pak`): the combo montages the hero plays with a greatsword are Immersive Warriors Enhanced's own
  (`/Game/Mods/IMM_WAR/Anims/ASM/Comb/Gswd/{L,H,FC}/DGS_Combo*_AM`), and the mod ships jump variants — `Gswd/FC/DGS_Skill_D_AM_Jmp`, `Gswd/H/DGS_ComboB5_AM_Jmp`,
  `BH/A/DH_Combo_A4_RM_AM_Jump` — the first candidates for the leap strike.
- **TO DO — a SIMPLE air swing (the owner 2026-11-10 19:11 +03:00):** `[OWNER]` 2026-11-10 19:10 «такое же с мечо нужно будет, сейчас анимация махания слишком сложная в прыжке» ·
  «нужна простая» — the melee swing in a jump must play ONE simple swing montage (pinned), not the combo step the game / IMM_WAR picks. Queued after sprint + bow and the
  wall jump (STATUS NOW block). First: list the candidate one-swing montages per weapon class (vanilla light attack, e.g. the first step of the light combo) and
  how the air press can force one (`PlayAnimMontage` on the hero instead of the combo, or the combo row's id) — recon before code.
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
