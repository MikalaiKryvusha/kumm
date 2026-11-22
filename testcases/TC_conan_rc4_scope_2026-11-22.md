# Test cases — Conan RC4 scope: Esc over other mods' windows, waystones and the dungeon on the final pause, the bow sprint with a sheathed bow, the archery error at death, the stuck map hunt

> **Created:** 2026-11-22 · **Parent:** the RC4 scope by the owner's word 2026-11-22 15:07 (STATUS «FIRST in the next chat»); issues #41 (bug 108), #21 (bug 79),
> #30 (bug 93), #49 (new), #23 (bug 84)
> **Status:** written 2026-11-22 15:37 +03:00 before the run
> **Outbound:** each issue is closed only after its cases pass by the player's path (HOUSE_RULES 44.3)

**Test basis.**
- Esc (#41, bug 108): ten mod windows opened over the hub swallow Esc; the expected behaviour is the vanilla one — Esc closes the top mod window and leaves the
  hub open (the owner 2026-11-18 19:40, bug 108 «Symptom»). The candidate mechanism: Slate tunnels every key press as `OnPreviewKeyDown` from the root down
  the focus path; `UUserWidget::NativeOnPreviewKeyDown` calls the blueprint event `OnPreviewKeyDown` through `ProcessEvent` — a UE4SS hook on
  `/Script/UMG.UserWidget:OnPreviewKeyDown` runs on the game thread (no key bind, not the crash class of bug 85). E0 proves or refutes it before any code.
- Waystones and the dungeon (#21, bug 79): `TimeDilation` 1.0 behind every in-game loading screen; the pause section must not take the loading screen for a menu.
- The bow sprint (#30, bug 93 S9): the sprint holds when RMB takes up a bow sheathed by its quick slot during the sprint.
- The archery error (#49): the heroine's death logs no «вид тела от первого лица: ошибка» line.
- The stuck map (#23, bug 84): the map never stays on screen without the hub tabs; at most one `W_FullscreenMap_C` in the viewport.

**Dimensions.** Esc: the ten windows of bug 108 (equivalence: windows that swallow Esc vs those that close by themselves — SM_UI_Settings, NightTerrorsSettings as
the control), Esc vs other keys (a key that is not Esc must pass untouched). Loading screens: waystone travel, a dungeon entrance and exit. Bow: the sheathe by the
quick-slot key mid-sprint, then RMB. Death: a weapon in hand vs an empty hand. Map: variants not tried yet — the map open when a loading screen starts, the map over a
dialogue, a mouse click on a hub tab with the map open. Not covered: a gamepad (no device on the stand), multiplayer.

## Stand

The build `D:\Games\Conan Exiles 3.1.1` (published RC3 bytes + the fixes since: pause `b7d984a`, camera `25dff5d`, Locomotion, this run's archery fix), background
path (`launch-bg.ps1`), the machine lock `kumm`, the owner's save (HOUSE_RULES 6). God on by `god-on.sh` except in the death case; `stand-keeper.sh` (600 m, every
20 s) for every case except the death case. Keys into the game's window by `post-key.ps1` (no real input) where the case allows; real keys by `mouse-seq.ps1` with the
game in front for S9 (the sprint needs held W + Shift). Reads by the remote (`pult.sh`): the UE4SS log lines, `IsInViewport` of the widgets, `TimeDilation`.

## Cases

| # | Situation | Action | Expected | Status | Seen |
|---|---|---|---|---|---|
| E0 | the hub open, `EAA_Armorsettings` opened over it by `ActivateModule`; a probe hook on `/Script/UMG.UserWidget:OnPreviewKeyDown` logging the widget class and the key | `post-key.ps1 -Key Escape` | the probe logs a line for the EAA window's class with the key Escape (the window is on the focus path) | **fail** (refuted, 15:39–15:47) | no probe line on a posted Esc (background) nor on a real Esc (`input.ps1`, the game in front for one press); hooks on `GUIModule:SlotESCPressed` and the escape-like input events of the controller and the hero silent too. Found instead (bug 108 «Recon 2026-11-22»): Esc reaches the game's escape stack (the vanilla popup on top closes); `SM_UI_Settings_C` closes because it listens for the «Escape» input action itself; EAA's own close handler `BndEvt__Button_81_…` closes EAA when called. E0b — bind «Escape» to that handler by `ListenForInputAction` — not run: every attempt met a crash of bug 118 first |
| E1 | the same, the fix in KrinikConanUI | Esc | the EAA window closes, the hub stays open, one log line names the window closed | not run | |
| E2 | each of the other nine windows of bug 108 over the hub | Esc | the window closes, the hub stays | not run | |
| E3 | `SM_UI_Settings` over the hub (closes by itself — control) | Esc | the window closes once; no second close, the hub stays | not run | |
| E4 | the EAA window over the hub | a key that is not Esc (Tab, a letter) | the window acts as before the fix; no close by our section | not run | |
| E5 | no mod window, the hub open | Esc | the hub closes as before (the fix does not touch it) | not run | |
| R21a | two waystones placed far apart, the heroine at one | travel by the waystone's own map to the other | the loading screen passes; 5 s after the arrival `TimeDilation` 1.0; no «ОТКРЫТ» for the loading screen; the heroine on her feet at the other waystone | not run | |
| R21b | the heroine set into the Wine Cellar trigger | the dungeon loads; then out through its exit | `tdil` 1.0 in every sample behind the loading screen, both ways; no «ОТКРЫТ» | not run | |
| S9 | the bow wielded and drawn once, then sheathed by its quick-slot key; W + Shift held, the sprint running | RMB | the sprint holds (substate 7 stays, the speed of the sprint), the BowSprint log line for the take | not run | |
| A49 | the heroine alive, a weapon in hand, god off, the stand keeper off | the heroine is killed by the remote (`KillCharacter`) | within 3 s after the death no «[KrinikConanArchery] вид тела от первого лица: ошибка» line; the respawn screen comes | **pass** (2026-11-22 19:55, pack after `e327b42`) | the bow in hand by quick slot 1 (log «взято оружие, тип 3»), first person («вид тела … вкл.»), `exec suicide` 19:55:08 (`KillCharacter` not needed): «вид тела от первого лица: выкл. (убрал оружие)», no «ошибка» line; `RespawnPointSelection` opened 19:55:10; the heroine respawned by herself 19:55:18. **Found beside it:** two `[Lua][Error] Tried setting member variable 'BrakingDecelerationWalking' / 'JumpZVelocity' but UObject instance is nullptr` at 19:55:09 — KrinikConanLocomotion wrote the dead pawn's movement component; fixed the same hour (row L2) |
| A49n | the same with an empty hand | the same | no error line | **pass** (19:59, with the locomotion fix) | `HasWeaponsEquipped` false, `exec suicide` 19:59:28: no archery error, no `[Error]` line at all, no «Проворство 8 → 0»; respawn screen 19:59:32–19:59:40; «герой появился: Проворство 8» 19:59:41 |
| L2 | added 19:56 (found in A49): KrinikConanLocomotion with the «no live movement component → the tick does nothing» guard deployed | a death by `exec suicide` | no «Tried setting member variable … nullptr» line; the new heroine gets her Agility's run and jump | **pass** (19:59, the A49n run) | see A49n |
| G1 | added 19:4x (bug 118): the remote with the `no-table-delegate` guard deployed | the Esc probe's command (`… _G.__el_bind=true … return dofile('…/esc_listen.lua')`) | refused with «отказ: ListenForInputAction…», the game alive | **pass** (19:53:45) | done.txt «fail», the log «ошибка: … отказ: ListenForInputAction с делегатом-таблицей…», the process alive |
| G2 | the same | `lua return 1+1` | `2` | **pass** (19:53:51) | |
| G3 | the same | `lua _G.__tab=0; return dofile('…/hubswitch/open-tab.lua')` | the hub opens (a clean file passes the guard) | **pass** | «activated; tab 0 in 400 ms» |
| M1 | the map tab open in the hub | a loading screen starts (admin teleport by the remote) with the map open | after the load at most one `W_FullscreenMap_C` in the viewport; Esc / Tab closes the map with the hub; the world takes input | not run | |
| M2 | the map open, a talker NPC 2 m off | a dialogue opens over the map (the remote starts the talk) | after the dialogue closes at most one map widget in the viewport; the map closes | not run | |

## Neighbours (HOUSE_RULES 39)

| # | Neighbour of | Action | Expected | Status | Seen |
|---|---|---|---|---|---|
| N1 | E1 (the same hook sees every key of every widget) | our own «Моды Krinik'а» window: Esc | it closes once by its own kit event (no double close) | not run | |
| N2 | E1 | the inventory hub with no mod window: typing into a hub search field (if any) and Tab | keys pass, Tab closes the hub | not run | |
| N3 | A49 (the archery first-person section) | first person, a bow taken up and sheathed | the first-person body look switches as before (the log «вид тела от первого лица: вкл. / выкл.») | not run | |
