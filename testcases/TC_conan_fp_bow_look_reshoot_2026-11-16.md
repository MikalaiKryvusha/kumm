# TC — Conan: the first-person bow look A / B re-shot in an open view (interview #036)

> **Created:** 2026-11-16 · on the owner's word 18:05 (`[OWNER]` «и ы снимал скриншоты с луком уперевшись героем в стену - это очень и очень низкокачественныое демо тобой
> для владельца проекта» · «ничего там не понятно» · «когда герой в стену смотрит»; review folder 87, the frames A/B/V of 2026-11-14 23:17 — the hero facing a rock)
> **Parent:** `plans/52_conan_first_person_body_look.md` step 4 · `interviews/interview_036_conan_fp_bow_look_tuning.md` · **Status:** ✅ shot 2026-11-16 18:27, page shown 18:29 (the game closed by its PID 12200 18:28, no crash window; the lock released) · **Outbound:** the page → the owner

## Goal

The owner chooses look A or B from frames where the bow and the hands read at once against an open view (memory `review-frames-open-view-not-wall`).

## Stand

The owner's last save (Continue), background path (`launch-bg.ps1`, the owner is in chat — no real input); the machine lock taken; god on (`god-on.sh`); the idle orbit
off (`GUIModuleController:EnableVanityCameraMode(false)`); the hero's equipped bow taken into the hands by the remote `BasePlayerChar_C:ToggleWieldWeapon()` (game map
«Wield / sheathe WITHOUT input»); first person; the look switched by `_config/fp-look-pp.lua` (`on`, `neck`, `spine`): A = neck 0.5 · spine 0.85, B = neck 1.0 · spine 1.0,
V (vanilla) = Active off. The view: a yaw chosen by frames at pitch 0 so the open landscape fills the frame (no rock or wall within ≈ 10 m ahead); daylight; the same spot and
yaw for every variant. Frames `capture-window.ps1 -Width 3840` → WebP; each frame looked at by the agent before the page.

## Cases

| # | Case | Expected | Status |
|---|---|---|---|
| R0 | Pick the view: pitch 0 at several yaws | one yaw with the landscape open ahead | **pass** 18:24 — yaws 159 / 249 / 69 face the rock, 339 the open oasis; two boulders at the feet → the hero moved 8 m along 339 onto open sand (18182, 244749); frame `scan2_m55` |
| R1 | V · pitch −55 | sand / ground only, no bow (vanilla baseline) | **pass** 18:27 — sand and the water edge, no bow; the bow hand 78° off the centre (half view 37.5°) |
| R2 | A · pitch −55 | a bow limb at the lower edge | **pass** 18:27 — a bow limb at the lower-left edge, its middle under the quick bar; 36° |
| R3 | B · pitch −55 | the bow and the hand on its grip at the bottom | **pass** 18:27 — the bow across the bottom, the hand with the ring on the grip; 32° |
| R4 | V · pitch −80 | ground only | **pass** 18:27 — a foot and sand only; 77° |
| R5 | A · pitch −80 | the bow across the lower third, the hand and forearm | **pass** 18:27 — the bow and both hands in the lower third; 18° |
| R6 | B · pitch −80 | both hands and the bow fill the lower half | **pass** 18:27 — the bow higher, both arms whole; 11° |
| R7 | The page: one HTML (template `.kaif/_explain-page-template.html`), the question on top, a caption under each frame | opened for the owner | **pass** 18:29 — review folder 88 `88_vid_luka_na_prostore/index.html` (frames embedded, 8.9 MB), looked at by a headless shot first, opened by `Invoke-Item`; whether it is on his screen — his word |
