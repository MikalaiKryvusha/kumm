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
| S3 | live methods of the native classes (`funcs SubtitleEntryView`, `funcs SubtitleRenderer`, `funcs W_SubtitleEntryView_C`) | named: which event shows a line, which hides it, whether the widget is reused or created per line, whether a duration is readable | pass | 09:12–09:2x: a NEW `W_SubtitleEntryView_C` per line (`NotifyOnNewObject`), BP events `SetText` (same tick) and `SetTextActive(true)` (8 ms … 197 ms later); visibility stays 4 throughout; no `SetTextActive(false)` — the native renderer removes the line with no event (`UserWidget:Destruct` hook silent); lifespan = voice length: 0.93–0.95 s «Чтоб тебя!», 1.41 «Отведай смерть!», 1.64–1.69 «Боги тебя побери!», 1.70–1.75 «Не на того напал!», 0.09 s when the next line replaces it; renderer native props `m_ActiveEntry`, `m_PendingEntryList`, functions only `SlotKillAllSubtitles`, `GetIsSubtitleVisible`, `Init/DeinitializeBindings` — no duration readable |
| S4 | the fix: the first visible frame of a new shout | the line's first non-transparent frame stands at its final place (±2 px), no frame ≈ 50 px low | pass | 09:22 clip `after2.mp4` (fix live by `dofile`): «Чтоб тебя!» first visible frame 19.550 s at rows 877–904, every following frame rows 877/878–904; crop reached row 980, nothing lower |
| S5 | fade in | opacity rises from 0 to full over ≈ 0.2 s (11–14 frames at 60 fps), the place does not change | pass | same clip, strip by eye: translucent → full in ≈ 9–10 frames (≈ 0.16 s; the first step lags the `SetTextActive` by the delay granularity), place unchanged; 400 ms after `SetTextActive` the line reads opacity 1.00 vis 4 |
| S6 | fade out | opacity falls from full to 0 over ≈ 0.2 s before the line is gone, the place does not change | pass | 09:40 clip `mirror.mp4` (section v2 — the mirror line, deployed, fresh start): «Чтоб тебя!» rises in ≈ 10 frames (26.55–26.72 s) and fades in ≈ 10 frames (27.53–27.70 s), same place throughout; «Не на того напал!» shown with the resolved verb form (the mirror's `GeneralText` formats the gender pattern); review folder 25 |
| S10 | the mirror stands where the game line stood | a test text in the mirror sits on the game line's rows | pass | 09:37 `capture-window.ps1`: «Проверка зеркала» at y ≈ 880–905 of 1080 (game line rows 877–904), centred above the hotbar |
| S7 | control: the fix switched off | the low first frame comes back (proves S4 observes the fix, not luck) | fail (not reproduced) | 09:24 and 09:28 control clips (birth opacity forced back to 1): 5 onsets — «Не на того напал!» ×2, «Чтоб тебя!» ×2, «Умри!» — all in place from the first frame; axes varied: HUD hidden / hotbar shown, 4 different lines, two clips. The morning low frame (S2) is not reproduced in 5 tries; the owner SAW it («приезжает снизу»), so the fix stays — it makes ANY first frame of a line invisible. Unknown condition — likely a replacement (a new line while the old one is still listed) or the first shout after world entry |
| S8 | cost | the fix's handlers ≤ 0.05 ms per shout in its own `os.clock` log; nothing runs between shouts | partial | by construction: one field write at birth, one hook call, ≈ 13 opacity steps per shout only during 0.2 s; the minute summary never printed in the run (logged only with shouts after a full minute) — not yet read |
| S9 | the deployed mod loads | `[KrinikConanUI] section krinik_shout_fade: loaded` in UE4SS.log after a normal start | pass | 09:30:34 after `Deploy-ModPack.ps1 -Deploy -Only KrinikConanUI` (11 files, 106 present) and `launch-fg.ps1` |

**Stand note (09:2x).** After `launch-fg.ps1` → `enter-world-remote.sh` → `god-on.sh` → teleport the whole game HUD stood hidden (visibility 2:
`W_NewHealthUI_C`, `WBP_MainHotbar_C`, `W_SubtitleRenderer_C` — no shouts on screen at all); `ToggleHUD(true|false)` of
`FunCombat_PlayerController_C` changed nothing; `SetVisibility(4)` on those widgets by the remote brought them back. Who hid it is unknown (input
action `HideGui` exists). Stand step: check `W_SubtitleRenderer_C` visibility before recording.
| S2 | what the appearance does, frame by frame | named: position / size / opacity over the first 30 frames (the «fly in»), and whether any frame flashes or jumps | pass | CORRECTED 08:56 by the owner («фраза крика приезжает снизу» · «а не появляется сразу на месте» · «это я видео как "мерцание"»): the FIRST visible frame (clip 4.733 s) draws the whole line ≈ 50 px LOWER, at the hotbar edge; the next frame (4.750) it stands in place, holds ≈ 1.95 s, vanishes in one frame (6.683 → 6.700); no fade, no backing. That one-frame jump up IS the owner's «flicker». (The first reading «appears in place, no motion» came from a 70 px crop that ended right above the low frame — wrong; a 240 px crop to the screen bottom shows it.) Review folder 24 (strip + 3 s clip), options А fade ≈ 0.15 s · Б a dark backing · В both — the owner's pick |
