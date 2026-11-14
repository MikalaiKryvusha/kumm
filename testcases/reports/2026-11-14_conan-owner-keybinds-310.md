# Test run report — Conan 3.1.0: the owner's six key bindings restored (plan 53 step 14)

**Created:** 2026-11-14 12:19 +03:00 · **Run by:** the agent (Claude Opus 5.5) · **Version/build:** Conan Exiles Enhanced 3.1.0 (`++exiles+release-CL-383024`), the Krinik build
66/66 mods, pack `ConanExiles` working tree of 2026-11-14 (file `_config/Input.ini` = the owner's live 3.0.1 file, sha256 `92293cfcc253e36d…`)

## 1. Work

The owner's key bindings did not move to 3.1.0 (found 2026-11-14 11:12 — the 3.1.0 `Saved/Config/Windows` had no `Input.ini`, the game ran on defaults).
Basis: his live 3.0.1 `Input.ini` (2026-11-13 12:50) and the game's `DefaultInput.ini`; cases `testcases/TC_conan_owner_keybinds_310_2026-11-14.md` (K0–K8, K0c,
K5c, K2c). Before the run: all seven input configs of `pakchunk0-Windows.pak` hashed in 3.0.1 and 3.1.0 — byte-identical; no other of the 38 3.1.0 paks carries
one; `_config/input-edits.py` read his file = the defaults + exactly six edits (crouch, dodge, heavy attack, three chats). So his whole file went in.

## 2. Contour

The owner's 3.1.0 game `D:\Games\Conan Exiles 3.1.0` (junction to his download folder), his world (Continue — the oasis shore at 103335, 204569), the hero
overloaded 203 / 76 (268 %), the bow in hand; background launch `launch-bg.ps1`, world entry `enter-world-remote.sh`, `stand-keeper.sh` (god on); real input by
`mouse-seq.ps1` through `loot-take-clip.sh` (120 fps capture, HDR off), only with `owner-idle.ps1` FREE; machine lock «kumm» 11:59–12:16.
`REAL WORLD:` accumulated — his 3.1.0 install with 66 mods, his world save, his 3.0.1 key file — verified on the real world; data and machine — his PC, his save,
his file — verified on the real world; path — his own: the game's start, Continue, real keys — verified on the real world (the background launch path and the
remote world entry differ from his desktop shortcut and mouse click; the key path itself is his).

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-11-14 11:55 +03:00 | `repak get <3.0.1 and 3.1.0>/…/pakchunk0-Windows.pak <7 input configs> \| sha256sum` | 7 × SAME |
| 2 | 2026-11-14 11:56 +03:00 | `python -I -X utf8 _config/input-edits.py "<3.0.1>/…/Input.ini" DefaultInput_310.ini` (+ default vs itself, + a missing file) | 0 · six edits; control 0 edits; missing file exit 2 |
| 3 | 2026-11-14 11:57 +03:00 | `python -I -X utf8 _config/deploy-config.py Input.ini` (after `--dry-run`) | 0 · ЗАПИСАН, game = pack by `cmp` |
| 4 | 2026-11-14 12:00 +03:00 | `launch-bg.ps1` → `pult.sh "lua return dofile('…/_config/keybinds-live.lua')"` | game PID 10400 · the six keys live (K0) |
| 5 | 2026-11-14 12:02 +03:00 | `SEC=19 SEQ="kdown:0x87,…,kdown:0x6D,…,kdown:0x6A,…,kdown:0x0D,…,kdown:0xA2,…(×2),kdown:C,…,x1down,…,mdown,wait:1400,mup,…" bash _config/loot-take-clip.sh .work/keybinds/k_clip.mkv` | 0 · 1578 frames; K1–K7 read from sheets |
| 6 | 2026-11-14 12:07 +03:00 | `SEC=13 SEQ="…,kdown:0xA4,…,x1down,…,Ctrl+T ×2" bash _config/loot-take-clip.sh .work/keybinds/k_clip2.mkv` | 0 · 1100 frames; K5c, K5 again |
| 7 | 2026-11-14 12:08 +03:00 | `pult.sh "exec quit"` → `input-edits.py "<3.1.0>/…/Input.ini" …` + `cmp` | game exited ≈ 8 s; file rewritten 12:08, byte-identical (K8) |
| 8 | 2026-11-14 12:09 +03:00 | file moved to `.work/keybinds/`; `launch-bg.ps1` → `keybinds-live.lua` | PID 12100 · the defaults live (K0c) |
| 9 | 2026-11-14 12:14 +03:00 | `SEC=12 SEQ="…,kdown:0x6A,…,kdown:0x1B,…,kdown:0x0D,…,kdown:0x1B,…" bash _config/loot-take-clip.sh .work/keybinds/k_control.mkv` | 0 · 1007 frames; the chat panel «Local» opened on numpad * (K2c) |
| 10 | 2026-11-14 12:16 +03:00 | `pult.sh "exec quit"` → `deploy-config.py Input.ini` → `cmp` | game exited ≈ 6 s; the game had written an empty diff file; the owner's file back, game = pack |

## 4. Checks

`Hygiene:` `input-edits.py` on three inputs (owner 6, default vs itself 0, the empty game-written file 0 after the fix — before it 166, finding 2) and a missing
file (exit 2); `node tools/test-guards.mjs` 280 of 280 (part G — the stamp-gate v3 cases, red before v3).
`Functional run:` the owner's 3.1.0 game with his world, real keys by his path, read on video frame sheets (2 fps, `.work/keybinds/sheet_*.jpg`) and the live
mapping table through the remote.

| Case | Status | Observation |
|---|---|---|
| K0 live table with the file | pass | `CrouchMode=…,LeftControl · DodgeActionV2=…,ThumbMouseButton · SecondaryActionV2=…,MiddleMouseButton · GlobalChat=None · GuildChat=None · VicinityChat=None · Jump=…,SpaceBar` |
| K0c the same without the file | pass | C · LeftAlt · LeftControl · Enter · Subtract · Multiply — the read tells the states apart |
| K1 numpad − | pass | the camera moved closer (KrinikConanCamera), no chat panel |
| K2 numpad * · K3 Enter | pass | no chat panel on any frame; K2c proves the panel is visible in this capture |
| K2c numpad * on the defaults | pass | the chat panel «Local» bottom-left, frames 2.0–9.0 |
| K4 Left Ctrl ×2 | pass | crouched, then standing; the bow not drawn |
| K5 side button | pass — by the game's refusal | «Вы перегружены» each time (the dodge refused for weight); no roll seen — the hero is overloaded |
| K5c Left Alt | pass | nothing |
| K6 middle button | pass | the bow drawn while held, the shot on release |
| K7 C | pass | no crouch |
| K8 after the game's own exit | pass | rewritten byte-identical |

## 5. Found

1. **The previous chat's claim «3.1.0 adds new actions, the old file must not be copied whole» was false** — the defaults are byte-identical, `HideGUI`/`HideGui`
   is one FName; corrected in plan 53 step 14 and STATUS (EXP-0525).
2. **`input-edits.py` first version read an empty game-written file as 166 removed actions** — the game writes only the header when nothing differs; fixed (an
   absent array kind = defaults), re-run: 0.
3. **The pack's `_config/Input.ini` was a stale 2.1.1 copy** that a bare `deploy-config.py` run would have shipped over the owner's keys — replaced by his file.
4. **Voice file names carried felt times up to 77 min ahead of the clock** (52 files, 2026-11-08…14) — renamed by their write time; `stamp-gate.mjs` v3 refuses
   such a name (EXP-0526); it caught the next one at 12:16.
5. Ctrl+T (`ToggleChatWindow`) shows nothing in single player — not a chat control (noted in the tools reference).

## 6. Traces

Clips and sheets — `KUMM/.work/keybinds/` (`k_clip.mkv`, `k_clip2.mkv`, `k_control.mkv`, `sheet_a/b/c/ctl.jpg`, `pair_crouch.jpg`; working files, removed when the
item closes); the game-written empty file — `ConanExiles/_config/backup/2026-11-14_121638/Input.ini`; the defaults — `KUMM/.work/input310/DefaultInput_301.ini`,
`DefaultInput_310.ini`; voice — `voice/2026-11-14_11-59-49_…`, `12-05-40_…`, `12-10-55_…`, `12-16-21_…`.

## 7. Verdict

**pass** — all six edited bindings act by their real keys in the 3.1.0 game, the old keys do not, and the defaults control shows the observation can fail;
the dodge is proven by the game's own refusal (overloaded hero), a full roll is left for the owner's play. No crash; no crash-report window opened.
