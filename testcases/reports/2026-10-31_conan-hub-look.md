# Run report — 2026-10-31 · the «Моды Krinik'а» hub window look (the owner's five remarks of 21:41)

## 1. Work

The look of the hub window against the approved mockup 5 and Svarog `docs/UI_RULEBOOK.md`; basis — the owner's five remarks («огромный», «кривые
кнопки инфо», «большие расстояния между опциями», «странный жирный шрифт», «некрасивый поп-ап при ховере», 2026-10-31 21:41–21:42) and the seam list
S1–S8 of `testcases/TC_conan_hub_look_2026-10-31.md` (cases L0–L11).

## 2. Contour

Conan Exiles 3.0.1 with the full build, the owner's save (copy `_save-backup/2026-10-31_1004-before-w13-arrows`, restored after each launch, integrity
ok); background launch; the remote `KrinikAgentRemote`; real mouse by `mouse-seq.ps1`; frames by `capture-window.ps1`. Builds: live tweaks on the
first pak (21:55–22:03), then pack `5f497ce` built twice (22:09, 22:20) and deployed by `Deploy-ModPack.ps1 -Deploy -Only KrinikConanUI`.

## 3. Runs

- 2026-10-31 21:53 — launch 1 (old pak): `launch-bg.ps1`, `enter-world-remote.sh`, `god-on.sh`; probes `lua return dofile('…/probe_fonts.lua')`,
  `probe_fontlist.lua`, live look `look.lua` with parameter files `p_crimson.lua`, `p_noto.lua`, `geo.lua`, `geo2.lua`, `measure.lua`; vanity check
  `FindFirstOf('GUIModuleController'):EnableVanityCameraMode(false)`.
- 2026-10-31 22:05 — kit ×2 `UnrealEditor-Cmd … -Script=…kit-krinik-modsettings.py -ModDevKit -NullRHI` (ok, 0 errors), `kit-buildmod.py KrinikConanUI`, deploy.
- 2026-10-31 22:10 — launch 2: the window opened by `ActivateModule('KrinikModSettings')`; real mouse `mouse-seq.ps1 -Seq "move:…,lclick,…"` on
  «i», «KrinikConanArchery», «KrinikConanGraphics», «Закрыть без сохранения»; `exec r.SetRes 1280x720f … 3840x2160f`.
- 2026-10-31 22:15 — kit ×2 and build again (list 290 / name box 258), deploy; 22:21 — launch 3, the window frame.

## 4. Checks

Hygiene: `luac -p` on the section — ok; `check-lua-game-thread.py` — 0 worker-thread calls; kit report `ok: true` four times; `mod-overrides.py` —
the same 8 vanilla overrides and our table.
Functional run: the window opened in the live world by the remote and walked with the real mouse; frames read at 4K; the section log read
(`window height 539`, `click: «i» ui_blink_food pinned`, `page arc`, `page gfx`, `closed (без сохранения)`).

| Case | Status |
|---|---|
| L0 fonts | pass — the labels were the engine's Roboto Bold; the game's serifs have no Cyrillic |
| L1 size by content | pass — width 1220 → 1240 in the final pak, height = the tallest live page |
| L2 row rhythm | pass — ≈ 44 units row to row |
| L3 font | pass — Noto Sans regular |
| L4 «i» | pass — circles |
| L5 plate | pass — opaque, gold rim, under the cursor |
| L6 greys · L7 values · L8 title | pass |
| L9 clicks | pass |
| L10 720p · 1080p · 2K · 4K | pass |
| L11 a name cut by one letter | fail on pak 1 → fixed, whole on pak 2 (frame f1) |

## 5. Found

1. The labels used the ENGINE's Roboto Bold (copied from a kit settings row) — fixed (Noto Sans).
2. Kit colours written as if sRGB — the «dark» plate rendered grey-brown — fixed (linear values).
3. The window hid itself under the idle vanity camera (`bHiddenDuringVanityMode` true) — fixed (false, as the vanilla inventory settings popup).
4. The Lua `NAME_BOX` stayed 268 when the kit box changed — the marquee did not start — fixed (258 in both).

## 6. Traces

Session scratchpad `seams/`: `t1`…`t7`, `b1`…`b4`, `res_*`, `f1` (4K WebP), the probe Lua files, kit logs `kit_*.log`, `kit2_*.log`, build logs.
The owner's review folder `D:\Games\Conan Exiles Mods\НА ОТСМОТР НИКОЛАЕМ\39_hub_look\` (before/after, mockup/game, 4K window, the plate, the four
resolutions, `what_to_look_at.md`).

## 7. Verdict

pass — every seam of the list fixed and seen in the built pak in the live game; the look itself (taste) waits for the owner's eye.

## Note 2026-11-01

The review folder `39_hub_look` was answered by the owner (chat 2026-11-01 04:40: the mockup beautiful, the game not) and removed; the fidelity pass and its
folder `41_hub_kak_maket` — `testcases/reports/2026-11-01_conan-hub-mockup-fidelity.md`.
