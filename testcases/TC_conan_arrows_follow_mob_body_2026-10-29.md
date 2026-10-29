# TC — an arrow stuck in a moving mob stays in its body (plan 36 W13, item 42)

> **Created:** 2026-10-29 · **Parent:** plan 36 W13 · the owner's frames of a Kappa (2026-10-29: «вот видно стрелы торчащие из моба в воздухе» · «вот четко видно»)
> **Status:** run 2026-10-29 11:01–11:10 — the attachment hypothesis refuted; A3 blocked (next stand: a walking Kappa at 10 m, burst right after hits)
> **Outbound:** —

**Basis.** The owner's frames: an arrow hangs in the air half a metre beside a Kappa. Hypothesis: the game attaches the stuck copy
(`BP_DummyProjectile`) to the mob's mesh without a bone, so when the body moves the arrow keeps the mesh root's frame. Fix
(`KrinikConanArchery`): after the 15 cm push, re-attach the copy to the hit bone (`HitResultFromProjectile.BoneName`, KeepWorld).

**Stand.** The beach; god mode on; an adult Kappa (`BP_NPC_Wildlife_Kappa_Green_C`) frozen by `CustomTimeDilation = 0` while shooting
(so every arrow hits), then released (1.0) so it walks, turns and fights; aim by the remote at the capsule centre; shots by the REAL mouse
(`mouse-seq.ps1`). Dimensions: hit bone, attachment socket before/after, the arrow on a moving body. Not covered: rhino, elephant (next stand).

| # | Case | Steps | Expected | Status |
|---|---|---|---|---|
| A1 | The log names the bone and the socket | 3 shots into the frozen Kappa | «копия стрелы #N: … кость удара <bone>, прицеплена к CharacterMesh0, сокет None» — the hypothesis seen or refuted | pass 11:01 — REFUTED: «кость удара rig_bone_L_leg_J01, прицеплена к CharacterMesh0, сокет rig_bone_L_leg_J01» (the game attaches to the bone itself) |
| A2 | Re-attached to the bone | same shots | «перецеплена: true, сокет теперь <bone>» | dropped — the re-attach is a no-op; removed from the mod, the bone stays in the log (11:10 «в тушку: … кость rig_bone_L_leg_J01») |
| A3 | Arrows ride the body | release the Kappa, 10 s, frames every 2 s | every visible arrow touches the body on every frame | blocked — the released Kappa attacked the hero and hid behind him; 20 s later 0 stuck copies. Frozen frame 11:10: the arrow sits in the left thigh |
| A4 | Control | the 10:58 run before the fix | `GetAttachSocketName` before the re-attach | pass — the bone socket is already set before any edit of ours |
