# Test cases — Conan: enemy shouts «fly in» / flicker when shown (plan 36 W29, research)

> **Created:** 2026-10-31 · **Parent:** plan 36 W29 (`[OWNER]` «сообщения врагов когда показываются, словно есть какое-то мерцание на экране... словно
> оно откуда-то прилетакт - не нравится этот эффект» · 2026-10-30 ≈11:13)
> **Status:** written 2026-10-31 08:35 +03:00, before the run
> **Outbound:** the owner's eye on the frame strip

**Basis.** Recon 08:34: the shouts are game subtitles, `W_SubtitleEntryView_C`. A frame series at ≈ 7 fps misses 1–2-frame jumps (memory «мерцание UI —
видео 60 к/с»), so the appearance is recorded at 60 fps.

**Stand.** Game in FRONT (`launch-fg.ps1`; ddagrab captures the screen), oasis save, god on, the hero 3 m from the fighting boss; `ffmpeg ddagrab 60 fps`
25 s; then the subtitle area frame by frame.

| # | Case | Expected | Status | Observation |
|---|---|---|---|---|
| S1 | a shout appears on the 60 fps clip | at least one subtitle line appears within 25 s | pass | 08:37: three lines logged by the SetText hook («Не на того напал!», «Чтоб тебя!», «Умри!»); the clip 25 s 1920×1080 60 fps |
| S2 | what the appearance does, frame by frame | named: position / size / opacity over the first 30 frames (the «fly in»), and whether any frame flashes or jumps | pass | CORRECTED 08:56 by the owner («фраза крика приезжает снизу» · «а не появляется сразу на месте» · «это я видео как "мерцание"»): the FIRST visible frame (clip 4.733 s) draws the whole line ≈ 50 px LOWER, at the hotbar edge; the next frame (4.750) it stands in place, holds ≈ 1.95 s, vanishes in one frame (6.683 → 6.700); no fade, no backing. That one-frame jump up IS the owner's «flicker». (The first reading «appears in place, no motion» came from a 70 px crop that ended right above the low frame — wrong; a 240 px crop to the screen bottom shows it.) Review folder 24 (strip + 3 s clip), options А fade ≈ 0.15 s · Б a dark backing · В both — the owner's pick |
