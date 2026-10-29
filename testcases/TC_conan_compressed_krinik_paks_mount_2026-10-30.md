# TC — the 12 KRINIK MODIFIED paks rebuilt with Oodle compression mount and work (plan 36 item 14a)

> **Created:** 2026-10-30 · **Parent:** plan 36 item 14a; STATUS handover 2026-10-29 22:58 item 4
> **Status:** run 2026-10-30 01:04–01:06 (after the container-header fix) — C1–C7 pass; the first install (00:47) FAILED C2 — see below.
> Report `testcases/reports/2026-10-30_conan-compressed-krinik-paks.md`
> **Outbound:** —

**Basis.** The edited paks were 2–3× the originals (uncompressed IoStore container). retoc now compresses (local commits 8e2eedf, 9391c3a);
`rebuild-krinik-paks.py --install` rebuilds by `krinikBuild`, guards: chunks byte-identical to the installed pak, the container header stored raw.
Acceptance of item 14a: the edited pak is no bigger than the original + 5 %, the game mounts it, the world loads.

**Stand.** The owner's save, 4K, game in front; FIRST a smoke by eye (launch → frame of the main menu), only then `enter-world-remote.sh`; hub by a real Tab.

| # | Case | Steps | Expected | Status |
|---|---|---|---|---|
| C0 | Smoke by eye | launch, frame after 50 s | main menu, no error dialog | pass 01:05 — `smoke1.jpg`: main menu. FAIL 00:47 (first install): «Incompatible Mods Detected», Player Ignores Follower Collision — compressed container header; the agent had skipped this case |
| C1 | Sizes | the summaries of the install runs | every new pak ≤ original + 5 % | pass — all 12 within +1 % of the original (IMM_WAR 332.5 / 342.2 MB, EoT 225.8 / 243.5, EAA 125.4 / 125.7, Fishing 209.2 / 211.2, Hosav 25.4 / 25.2 = +0.8 %) |
| C2 | Extract and mount | `ConanSandbox.log` | each of the 12 «Mounted container … <Mod>-Windows.utoc», no «Failed to mount» | pass 01:05 — 12 of 12 mounted, «Failed to mount» 0 |
| C3 | World | `enter-world-remote.sh` | the world loads, no crash | pass 01:06 — loaded in 22 s |
| C4 | HUD mods | frame in the world | Simple Minimap with coordinates, Hosav's top HUD, Arrow Quick Swap | pass — `c4_world` |
| C5 | Hub mods | Tab → «Снаряжение» | EAA emblem and «Аксессуары», Era of Trials icons, the two bottom buttons | pass — `c5_hub` |
| C6 | Mod windows | open the fishing panel; Esc | Russian panel with «ваниль», Esc closes only it | pass — `c6_fish`, `c6_esc` |
| C7 | Log | the whole run | no Lua errors in `UE4SS.log`, clean exit | pass — 0 Lua error lines, closed cleanly, no crash reporter |
