# Plan 41 · phase 1 — bug 64 truth pass: the twelve open rows re-observed on today's build

> **Created:** 2026-11-01 · **Parent:** `plans/41_EPIC_conan_1.0.0_defects_and_stability.md` phase 1; `[OWNER]` 2026-11-01 13:28 «аналогично, пишем эпик планы и
> операционные планы»
> **Status:** written 2026-11-01 13:30 +03:00; not started
> **Outbound:** bug 64 rows and plan 39 C corrected; the rows still open feed phases 4, 5, 6

## Goal vector (Achieve)

Plan 39 C lists twelve bug 64 rows as open; several of those rows say «fixed» in their own text (5, 16, 26), one says a build waits for deploy (21), one says
its English line is already Russian (4, «НОВОЕ:» in T1). Where we want to be: every one of the twelve rows has a status observed today on the build that is
deployed now — fixed (with a frame), open (with a frame showing the defect), or partly — so phases 4–6 fix only what is really broken.

## Acceptance criteria

1. **A row says fixed and is fixed.** Situation: the row's screen reached the way the row describes (hub tab, map, window). Action: the agent opens it on
   today's build. Result: the defect is not there. Check: a frame (motion rows — a 60 fps clip) in the run report; the row's status line «re-seen 2026-11-…, report …».
2. **A row says fixed and is not.** Same situation. Result: the defect is there. Check: the frame; the row reopened with the observation; the phase that fixes it named.
3. **An open row is open.** Same. Result: the defect reproduces; its frame becomes the «before» of the fixing phase. Check: frame path in the row.
4. **The documents agree.** Situation: all twelve observed. Action: bug 64 rows and plan 39 C edited. Result: no row says «fixed» without a frame of today,
   plan 39 C lists only rows still open. Check: `grep -n "^| \(4\|5\|6\|12\|13\|15\|16\|17\|18\|21\|23\|26\) |" bugs/64_conan_mod_ui_wave_overlaps_untranslated.md` read row by row.

## Stand (house rule 11)

- Machine lock (≈ 60 min); `launch-bg.ps1` (or `launch-fg.ps1` if the owner's last word was «впереди»); `enter-world-remote.sh`; `god-on.sh`; `tp_ground.sh` to a
  clear beach spot (the 2026-11-01 run 1 place (-78471, 245900) — enemies checked, killed by the remote if present).
- Mob for row 12: spawned by the remote 5 m ahead, frozen (`arrow-stand.sh summon / place 5 / freeze` — the Kappa stand of 2026-10-31).
- Motion rows (6, 15, 16, 17, 26): the 60 fps screen clip `ffmpeg -f lavfi -i ddagrab=framerate=60:draw_mouse=0 -c:v h264_nvenc <out>.mp4` with the game in FRONT
  (ddagrab sees the screen, not the window) — the owner's screen is taken for ≤ 30 s: `wait-input-idle.ps1 -Min 10` first; real Q/E by `mouse-seq.ps1`.
- Windows: `walk-mod-windows.sh <dir> SM_MarkerTutorial DN_UI_Settings EAA_…` (module names from the game map / `DT_UIModuleTable`).

## Steps

- [ ] 1. **RECON — the row list.** Read rows 4, 5, 6, 12, 13, 15, 16, 17, 17a, 18, 21, 23, 26 of bug 64; for each write ONE line into the case file: the screen,
      how to reach it by the remote, what «fixed» looks like on a frame. Recon for 21: is the 2026-10-26 21:39 build (slider 64, padding 20) deployed? —
      `md5sum` of `ConanExiles/_krinik-modified/<DamageNumber id>/*.pak` vs the game's mod folder copy (the id by `.\Deploy-ModPack.ps1 -ListMods -PackDir D:\work\ai_sandbox\ConanExiles`).
- [ ] 2. **Case file** `testcases/TC_conan_bug64_truth_pass_<date>.md` — one case per row (B4, B5, B6, B12, B13, B15, B16, B17, B18, B21, B23, B26), the stand
      section first.
- [ ] 3. **TEST IN THE LIVE GAME** (one session):
  - [ ] B4 — `SM_MarkerTutorial`: burst `capture-burst.ps1 -Count 30 -IntervalMs 100` from the open — when do the bullet lines appear; are the slides black;
        «НОВОЕ:» present.
  - [ ] B5 — fullscreen map footer: «Новый маркер» clear of «Сброс маркеров [X]» (frame).
  - [ ] B6, B15, B16, B17, B26 — ONE 60 fps clip: hub open on «Снаряжение», E ×8, Q ×8 (1.2 s each), close; then the Esc menu tabs. Frames extracted per
        switch (`ffmpeg -vf select`), looked at by eye: the emblem / gem / «Аксессуары» / EoT icons on the first full frame, the Hosav button only on
        «Снаряжение», bottom-bar width, tab text.
  - [ ] B12 — the frozen mob at 5 m and 12 m: frames; whose bar it is (pult `dump EnemyHealthbar` / `dump TotNameplate`).
  - [ ] B13 — the five windows named in the row (magic school, demonic scrolls, enchanting, camera zoom toggle, «Поддержать автора»): frames; count how
        many of the 98 candidates in `ConanExiles/_config/compat/ui-overflow-candidates.tsv` sit in windows reachable today (the rest — phase 4).
  - [ ] B18 — the EAA menu button tooltip: `hover-watch.ps1 -At <fx/fy> -Dir <dir>` (a hover tooltip is not seen by a background capture).
  - [ ] B21 — `walk-mod-windows.sh <dir> DN_UI_Settings`: the opacity shkala vs «Масштаб».
  - [ ] B23 — the EAA class menu: frame of the cards.
- [ ] 4. **Run report** `testcases/reports/<date>_conan-bug64-truth-pass.md` (work · contour · runs · checks · found · traces · verdict); frames as webp.
- [ ] 5. **Records in the same commit** (rule 20): each of the twelve rows — status + «re-seen <date>, report …»; plan 39 C rewritten to the rows still open;
      the epic's phases 4–6 scope lines corrected if rows closed.

No FIX and no PACKAGING in this phase: a defect found is a «before» frame for phases 4–6.

## Risks

- (a) The 60 fps clip takes the owner's screen — keep it ≤ 30 s, after `wait-input-idle.ps1`; if he is at the machine — ask the path (house rule 16), do not switch it silently.
- (b) A bare `ActivateModule` of a window without its mod's entry can crash (PackRat 2026-10-26 18:03) — only the modules `walk-mod-windows.sh` already opened safely.
- (b) Row 13's candidate list may be stale (strings shortened since 2026-10-26) — this phase only counts; phase 4 walks.

## Effort

2–3 h (recon 0.5 h, one game session 1–1.5 h, report and row edits 0.5–1 h).

## Decisions made without the owner

(filled at the phase's close)
