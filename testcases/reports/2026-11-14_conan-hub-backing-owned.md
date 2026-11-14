# Test run report — Conan hub: the backing owned by the hub controller (bug 101, items 1–2)

**Created:** 2026-11-14 13:29 +03:00 · **Run by:** the agent (Claude Opus 5.5) · **Version/build:** Conan 3.1.0 CL 383024; KrinikConanUI pak rebuilt 13:23 with
`CAROUSEL_NOOP`, `krinik_hub_controller.lua` with `set_backing` / `assert_backing` / `S.hold_backing`

## 1. Work

Bug 101 items 1–2: a page over the bare world when switching to / from «Снаряжение». Basis: plan 48 acceptance (every switch one frame, no blend, no late change
except the hovered tab label). Three recordings by real clicks over all nine tabs: before (`audit1`), Lua-only attempts (`fix1`, `fix2`), the kit fix (`fix3`).

## 2. Contour

The owner's 3.1.0 game and world, background launch, the hub opened by the remote, real mouse clicks by `hub_run.sh` (144 fps capture, HDR off), owner-idle FREE,
machine lock «kumm». `REAL WORLD:` accumulated — his install, his world — verified on the real world; data and machine — his PC — verified on the real world;
path — real clicks on the tab row (his path), the hub opened by the remote instead of Tab — verified with real state.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-11-14 12:38 +03:00 | `bash _config/hubswitch/hub_run.sh audit1` (+ `hub_switches.py` by hand) | 17 switches; two-step switches around «Снаряжение» |
| 2 | 2026-11-14 12:59 +03:00 | `bash _config/hubswitch/hub_run.sh fix1` | unchanged — the game's fade wrote after our tick (log 13:07) |
| 3 | 2026-11-14 13:12 +03:00 | `bash _config/hubswitch/hub_run.sh fix2` | the bare world 56 ms + an extra state; reverted |
| 4 | 2026-11-14 13:17 +03:00 | `UnrealEditor-Cmd … -Script=…kit-conanui-edit.py …`, `python -I -X utf8 _config/devkit/kit-buildmod.py KrinikConanUI <out>` | 0 · keys `0.0..0.0`; pak built |
| 5 | 2026-11-14 13:23 +03:00 | `Deploy-ModPack.ps1 -Deploy -Only KrinikConanUI`; `set-pak-modinfo.py <Mods>` | pak game = source; 66 / 66 |
| 6 | 2026-11-14 13:26 +03:00 | `bash _config/hubswitch/hub_run.sh fix3` | every switch one frame (below) |

## 4. Checks

`Hygiene:` the kit run «0 error(s)»; the pak differs from the 11:24 build. `Functional run:` the hub in the owner's world, real clicks, every switch read by
`hub_switches.py` on the 144 fps recording; the backing read live by `_config/carousel-backing.lua` (`MaskOffset` 1 on «Снаряжение», written by our controller).

| Switch | audit1 (before) | fix3 (after) |
|---|---|---|
| Таланты → Снаряжение | 14.333 + 14.500 — 166 ms the old page over the world | 14.632 — 1 frame, blend 0, late 0 |
| Снаряжение → Базар | 19.042 + 19.076 — blend 0.28, the page over the world | 19.160 — 1 frame, clean |
| Путешествие → Снаряжение | 48.535 + 48.701 | 48.833 — 1 frame, clean |
| Снаряжение → Таланты | 53.347 + 53.417 — blend 0.45 | 53.444 — 1 frame, blend 0; late +69 ms in a top band (open, item 4) |
| → Параметры | blend 0.69, late +56 / +76 / +111 ms | blend 0.69, late +35 / +69 / +104 ms (item 3, not this fix) |

## 5. Found

1. The carousel's own fade writes the backing after the hub's switch tick — a Lua write cannot win that race (fix1, fix2); the fade made a no-op fixes it.
2. Still open: the «Параметры» portrait completes late (item 3); a top band changes 69 ms after Снаряжение → Таланты, small strips under the tab row 28–69 ms (item 4).

## 6. Traces

Recordings `ConanExiles/_scratch/hubswitch/h69/audit1.mp4`, `fix1.mp4`, `fix2.mp4`, `fix3.mp4`; frame sheets `KUMM/.work/keybinds/g1_sheet.jpg`,
`fix1_sheet.jpg`; kit log `KUMM/.work/keybinds/kit-edit.log`; the fix2 controller `KUMM/.work/keybinds/krinik_hub_controller_bug101_fix2.lua`.

## 7. Verdict

**pass** for bug 101 items 1–2 (every switch to and from «Снаряжение» one frame, no page over the bare world); **partial** for the bug as a whole (items 3–4 open).
