# TC — bug 84 by the player's path: does the hub stack two windows of one tab (Хар-ки, Карта) under real keys?

> **Created:** 2026-11-10 · **Parent:** `bugs/84_conan_trait_choice_dialog_under_attribute_tree.md` (the remote path stacks two `W_Attributes_C` — the game's on that
> path, control 03:22); the owner's stuck map came by the PLAYER's path (keys), which the remote does not walk (EXP-0473)
> **Status:** cases written 2026-11-10 09:16 +03:00 · **Outbound:** the verdict → bug 84

## Test basis

Bug 84: a second live window of one tab under the shown one (the trait dialog under the tree; the map stuck twice). Expected (the game's own rule, plan 48): ONE
window per tab in the viewport at a time. The question of this run: on the player's path — Tab opens the hub, E / Q switch tabs, Tab / Esc close — is a window
stacked, and is it our `krinik_hub_controller` (control: the section off) or the game.

## Stand

Game in FRONT (`launch-fg.ps1`), the owner away from the keyboard (`owner-idle.ps1` FREE, `mouse-seq.ps1` refuses otherwise), world entered by the remote, the
idle camera off (`EnableVanityCameraMode(false)`) before the first key; no enemies needed — nothing is fought. Counter: `_config/hub-dupes.lua` (live windows of
each hub tab class, in the viewport or not, with visibility and render opacity). Voice phrase at the run start (rule 13).

## Cases

| # | Controller | Real keys (mouse-seq) | Expected | Status | Seen |
|---|---|---|---|---|---|
| P1 | on (as shipped) | Tab → E → E (Хар-ки) → count | one `W_Attributes_C` in the viewport | pass (re-read) | 09:21: two in the viewport — ours SelfHitTestInvisible op 1 + the game's HitTestInvisible op 0 (+ our other pages HitTestInvisible op 0): the controller's design, ONE page draws and takes input. The expectation «one in the viewport» was wrong — re-read as «one page that draws or takes input» (`krinik_hub_controller.lua`) |
| P2 | on | then Tab (close) → Tab → E → E → count | as P1 re-read | pass | 09:25 after Tab: ours Collapsed, the game's out of the viewport; 09:32 reopened: as P1 |
| P3 | on | then Esc (close) → Tab → E → E → count | as P1 re-read | not run | Esc and Tab are the same close hook (`RegisterKeyBind`) |
| P4 | on | Tab → Q → Q (Карта) → M → count | the map page closes | pass | 09:26: map open — ours op 1 + the game's op 0; after M — ours Collapsed, the game's gone. Hypothesis «a close by another key leaves our page» refuted for M |
| P5 | on | M from the world → count → frame | — | pass | 09:27–09:29: M opens the HUB on «Карта», tabs on top (frame `m_map.jpg`); ours drawn, the game's held (frame with ours hidden: `m_map_game.jpg` — the game's map not drawn). Not the owner's «standalone map without tabs» |
| T1 | on | `ServerResetAttributeAll` (the game's refund, 112 free) → Tab → E → E → ten real «+» clicks on Авторитет → frame | the dialog readable | **fail — REPRODUCED** | 09:46: the tenth «+» opens «Выберите Черту» (`W_PerkSelection_C`, Modal, Visible, op 1) and the attribute tree's lines and pips draw OVER it (frame `t1_plus10.jpg`) — the owner's bug. 09:47 discriminator: our `W_Attributes_C` page (SelfHitTestInvisible op 1) set to op 0 → the dialog clean (`t1_ours_hidden.jpg`). Cause: `krinik_hub_controller` adds our pages at Z-order 41; every hub module and `PerkSelection` are Z 40 (DT_UIModuleTable, live). (The first tries 09:30–09:36 by `ServerGiveAttribute` opened no dialog — a raise past 10 must go through the «+».) |
| T2 | on, the fix (`Z_ORDER` 40) | T1's steps on the rebuilt build (deployed 09:49, fresh launch 09:50) | the dialog readable, no tree over it | **pass** | 10:0x: the tenth «+» opens «Выберите Черту» OVER the attribute page — the page behind dimmed by the game, no line or pip over the dialog's text (frame `t2.jpg`) |
| C1 | OFF (section commented out in the deployed `main.lua`, game restarted) | P2's keys | — | skipped | P1–P5 show no defect to separate |
| C2 | OFF | P4's keys | — | skipped | as C1 |

Dimensions: entry point (keys vs the remote — the remote done 03:20/03:22), close key (Tab, M), tab (Хар-ки, Карта), our controller on (off — not needed).
Not covered: mouse clicks on the tab buttons; the trait dialog (T1 blocked — stand); the owner's map «without tabs» (not reproduced by M, Tab, Q).

**Verdict (09:37):** on the player's keys the hub keeps ONE drawing page per tab and closes clean (P1, P2, P4, P5). Bug 84's two symptoms are not reproduced by
these paths; the remaining suspect is the Z-order of our pages (41) against the game's trait dialog — T1, with a clean stand.
