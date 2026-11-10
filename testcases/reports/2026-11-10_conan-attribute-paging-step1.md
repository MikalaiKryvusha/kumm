# Run report — Conan «Хар-ки»: the attribute bar pages by `Page` (plan 49 B2, step 1)

## 1. Work

The kit edit of `W_Attribute` (`ConanExiles/_config/devkit/kit-attribute-paging-edit.py`): an int member `Page` and the bar's value `FullValue − Page × 20` in
`UpdateView`. Basis: plan 49 (the owner's pick B2, 2026-11-09 19:58), cases `testcases/TC_conan_attribute_paging_step1_2026-11-10.md` P1–P4.

## 2. Contour

The Conan Exiles devkit (`F:\CEUE5Devkit`, mod mode, active mod KrinikConanUI); the working game `D:\Games\Conan Exiles 3.0.1` with the rebuilt `KrinikConanUI.pak`;
background launch, world by the remote, «Хар-ки» opened by the remote; machine lock held for each kit run and the game run.

## 3. Runs

- 2026-11-10 02:38–02:51 — kit probes: `kit-probe-bp-graph-api.py` (the graph-editing API exists), `kit-probe-w-attribute.py` (the tree of 26 widgets, the 25 nodes of
  `UpdateView`), `kit-probe-graph-editor-docs.py` (signatures).
- 02:54 — `UnrealEditor-Cmd … -run=PythonScript -Script=kit-attribute-paging-edit.py -ModDevKit -NullRHI`: member added, 5 links made, compiled, saved; links read back.
- 02:5x — `retoc to-legacy --filter W_Attribute` + `uaj tojson` + `kit-missing-refs.py` → 17 `/Game` packages, 0 missing; `FilesToCook=` line added (kit + copy).
- 02:56–02:59 — `python -I -X utf8 kit-buildmod.py KrinikConanUI <scratch>` → 15.8 MB pak; `mod-overrides.py` on it → 18 overrides incl. `W_Attribute`.
- 03:00 — `Deploy-ModPack.ps1 -PackDir ConanExiles -Deploy -Only KrinikConanUI`; voice phrase; `launch-bg.ps1`, `enter-world-remote.sh`; `attr-cap-probe.lua`
  (Agility 39 already); `ActivateModule(FName('Attributes'))`; `attr-page-probe.lua` page 0 / 1 / 0 with frames by `capture-window.ps1 -Width 3840`; `close-game.ps1`.

## 4. Checks

Hygiene: the kit compiled the blueprint; the pak lists the override.
Functional run: the live «Хар-ки» screen read on 4K frames — P1 bars full at page 0 (as vanilla past 20); P2 page 1: 25 → filled exactly to the first pip (5 of 20),
39 → 95 %; P3 page 0 again → the bar area differs from P1 by 0.45 mean grey level (the backdrop's noise); P4 untouched rows as in P1.

## 5. Found

- Every attribute row exists twice among the live `W_Attribute_C` (12 for 6 attributes) — recorded in the TC and plan 49 step 2 (the arrows must drive the shown one);
  likely bug 84's duplicated hub pages.
- Kit Python facts: `WidgetBlueprint.widget_tree` and `WidgetTree.root_widget` are not exposed (iterate `unreal.Widget` under `<asset>:WidgetTree.`);
  `BlueprintGraphEditor` is an object per graph (`get_graph_editor_by_name`); the `:` function path form works (`/Script/Engine.KismetMathLibrary:Multiply_IntInt`).

## 6. Traces

`ConanExiles/_config/devkit/kit-attribute-paging-edit.json`, `kit-probe-w-attribute.json`, `kit-probe-graph-editor-docs.json`, `kit-probe-bp-graph-api.json`; frames
P1/P2/P3 in the session scratchpad (`paging/`).

## 7. Verdict

pass — the page shifts the bar on the live screen and page 0 keeps the vanilla look; the arrows, label, wheel and pips are step 2.
