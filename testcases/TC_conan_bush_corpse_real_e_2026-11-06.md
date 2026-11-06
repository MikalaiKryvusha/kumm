# TC — Conan: a corpse lying in a pickable bush — one prompt, and a real E does what it says (bug 80)

> **Created:** 2026-11-06 · **Parent:** `bugs/80_conan_pickup_prompt_beside_corpse_strip_in_bush.md` · **Status:** run 2026-11-06 22:00–22:03 — B1, B2, B3 pass; report `testcases/reports/2026-11-06_conan-bush-corpse-real-e.md`
> **Outbound:** —

## Test basis

`[OWNER]` 2026-11-03 19:57 «над трупом в кустах - чинить» · «нужно ту плашку показывать, которая сработает, или взятие куста, или открытие трупа»;
2026-11-06 21:01 «тестируем E Взять над кустом с трупом». The fix of 2026-11-03: our «E Взять» hides while the game's corpse strip is on screen (the game
targets an actor before the foliage probe — controller bytecode). Owed: a REAL E over a corpse in a bush.

## Stand

The oasis (`loot-stand.sh` steps: god, teleport, noon, `quiet-stand.lua`); `bush-corpse.lua` — a living humanoid moved into the nearest pickable bush
(the game's own foliage probe says yes) and killed there; the hero 1.5 m off the body; `loot-aim.sh` — the crosshair onto the body by the game's answer (the
corpse strip shows); the game in front; the build of 2026-11-06 (KrinikConanUI 1.5.x with the carousel edit). Catalog plate waited out.

## Cases

| # | Situation | Action | Expected (observable) | Status |
|---|---|---|---|---|
| B1 | The crosshair on the corpse in the bush, the corpse strip on screen | look (no key) | only the corpse strip: our «E Взять» plate hidden (remote: `HB_KrinikPickup` visibility ≠ 0/3 or opacity 0; frame) | PASS — see the bug status section |
| B2 | The same | a REAL E (`mouse-seq.ps1` `kdown:0x45,wait:80,kup:0x45`) | the corpse opens (its loot window on the frame); the hero's inventory gains no bush item | PASS — see the bug status section |
| B3 | The crosshair moved off the body onto the bush part beside it | look | the corpse strip gone → «E Взять» shown (frame) | PASS — see the bug status section |
