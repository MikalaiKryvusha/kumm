# Run report — Conan «Хар-ки»: placeholder perks 21–40, the pips per page, the scrolling perk column, the arrows' real clicks

## Work

Plan 49 step 2 (the owner's order 2026-11-10 10:28: placeholders for 21–40 in one attribute, no stock pips on 21–40, the right list takes, shows and scrolls them)
and the owed checks of the arrows' look (V8). Basis: `testcases/TC_conan_placeholder_perks_21_40_2026-11-10.md` (P1–P7, C1, R, P2b, P6b) and
`testcases/TC_conan_attribute_paging_step2_2026-11-10.md` (D1, D2, M1, R1–R3, S9b).

## Contour

The Conan 3.0.1 build, the working game `D:\Games\Conan Exiles 3.0.1`, the pack `D:/work/ai_sandbox/ConanExiles` with KrinikConanUI rebuilt: kit `DT_KrinikPerks`
(`kit-krinik-perks.py`), `W_Attribute` canvas shown past page 0 (`kit-attribute-pips-pages.py`), `W_AttributeInfo` with `SB_KrinikPerkScroll`
(`kit-attribute-info-scroll.py`, two runs), Lua `krinik_attr_pips` + the merge `MERGES[2]` in `krinik_mod_settings`. The save of the stand: the hero with
Живучесть 25, Проворство 26, 61 free points. Background path (`launch-bg.ps1`), the front only for the real-input series.

## Runs

- 11:39:39 launch PID 6420 — the merge and the first look (`enter-world-remote.sh`, frames `p2_attrs.jpg`, `p5_col.jpg`).
- 12:02:32 launch PID 25888 — build 1 of the Lua (hook on `W_Attribute_C:UpdateView`) and the scroll pak.
- 12:07:2x launch — build 2 (native `/Script/ConanSandbox.AttributeEntry:UpdatePipIcons`); remote traces of the refresh order; the off-canvas X trial (frame `q4c`).
- 12:14:50 launch — build 3 (render translation); frames `q1c`, `q5c`, `res_1920x1080`, `res_2560x1440`, `res_1280x720` (`exec r.SetRes …f` by the remote), `p4c`.
- 12:3x the player path: `mouse-seq.ps1 -Seq "kdown:0x09 … kdown:E … kdown:E"` (Tab → E → E), then `mouse-seq.ps1 -Seq "move:0.5775/0.48,lclick,…,move:0.200/0.48,lclick,…,lclick,…,move:0.83/0.62,wheel:-3"` with a background remote log of every row's `Page` (`clk/pages.txt`) and frames (`clk/f*.jpg`).

## Checks

Hygiene: the kit scripts' JSON reports read back (`kit-krinik-perks.json` rows/stat/icon true; `kit-attribute-pips-pages.json` 2 nodes, compile true;
`kit-attribute-info-scroll.json` run 2 with 0 GUID errors); `kit-missing-refs.py` W_AttributeInfo — 0 missing; `mod-overrides.py` — no other mod ships the widgets.
Functional run: the game, the «Хар-ки» screen by the remote and by the player's keys, frames read by eye, the UE4SS log and the remote's reads of the live widgets.

- P1 pass — «perks merge (main menu): rows 48 -> 52».
- P2 fail → P2b pass — the C++ placed the 25–40 pips past the bar on the right column; after `krinik_attr_pips` nothing past the bar.
- P3 pass (build 3) — page 2: four pips at the quarters, no stock pip. Builds 1–2 failed: build 1 hooked UpdateView (UpdatePipIcons runs after it); build 2's
  one-callback hook on the native UpdatePipIcons was a PRE-hook — the game's pass set the pips Visible after it (found 12:3x by a two-callback trace).
- P4 pass — Проворство page 2 without pips.
- P5 partial → P6 / P6b pass — the column takes the four placeholders, scrolls by the remote and by a real wheel.
- C1 pass (the first run is the control: no scroll, pips past the bar).
- R / R1–R3 pass — 1080p, 2K, 720p keep the 4K layout.
- D1, D2 pass — dim arrows do nothing; M1 pass — the click pages only the row under the cursor; S9b — a reopen keeps the page.
- P7 not run — no effect by construction.

## Found

- A one-callback `RegisterHook` on a native UFunction is a PRE-hook (EXP-0504): the game's UpdatePipIcons set the pips Visible after our collapse. Fixed: the post
  callback; the render translation off-screen stays as the second guard. (Corrects this report's first wording «re-set outside hookable functions».)
- A far slot position of a canvas child shrinks the whole page (the canvas measures children) — not shipped.
- The remote path «open → close → open» stacks two `W_Attributes` instances (bug 84, known) — the frames set both to the same page.
- EAA adds `EAA_1/2/3` to the same `PerksTable` at world load — no shared row (`researches/mod-reconciliation/REGISTER.md`).

## Traces

Scratchpad frames (session 76acd34f): `p2_attrs.jpg`, `p5_col.jpg`, `q1c.jpg`, `q4c.jpg`, `q5c.jpg`, `q6c.jpg`, `res_*.jpg`, `p4c.jpg`, `t1.jpg`, `clk/f*.jpg`,
`clk/pages.txt`; UE4SS log lines `[KrinikConanUI:AttrPips]`, `[KrinikConanUI:ModSettings] perks merge`; the kit JSON reports next to the scripts in
`ConanExiles/_config/devkit/`.

## Verdict

pass — the placeholders 21–40 on Живучесть show on page 2 only, the column scrolls; the arrows' owed checks pass. Left: the look of the column's bar (the owner's
eye), the wheel over a ROW (not built — the kit refuses the nodes).
