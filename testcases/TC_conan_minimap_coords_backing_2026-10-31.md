# Test cases — Conan: minimap coordinates inside the ring on a backing (plan 36 W4, bugs/64 item 31)

> **Created:** 2026-10-31 · **Parent:** plan 36 W4 (`[OWNER]` «в миникарте коардинаты нужно будет переместить внутрь круга, сделать им подложку» · 2026-10-27 ≈00:1x)
> **Status:** written 2026-10-31 09:4x before the run; C1–C4 pass 09:48, C5 → release gate; the look waits for the owner (review folder 26)
> **Outbound:** the look → the owner's eye (review folder)

**Stand.** Game in front (`launch-fg.ps1`), oasis save (copy `_save-backup/2026-10-31_0944-before-w4-minimap`), world by `enter-world-remote.sh`, no
enemy near; frame by `capture-window.ps1`, crop of the minimap corner.

| # | Case | Expected | Status | Observation |
|---|---|---|---|---|
| C1 | mock-up by the remote | coordinates inside the ring on a plate, readable | pass | 09:45–09:47: plain dark plate (A) and clock-style plate, font 15 (B) — frames `cmp1/cmp3` |
| C2 | the section on a normal start | log «координаты внутри круга, на плашке часов»; the frame shows B inside the ring | pass | 09:48 after deploy + fresh start: the log line (1.000 ms), frame `after.webp` — «-78471, 245900» inside the ring on the clock plate, font 15 |
| C3 | nothing else moved | the clock, ±, settings, the map picture at the same pixels as before | pass | before/after crops side by side: clock, ±, gear and ring at the same places |
| C4 | cost | one rebuild per minimap creation, ≤ 1 ms, no loop | pass | one log line per creation, 1.000 ms (os.clock step 1 ms); no loop in the code |
| C5 | 4K | the plate and text inside the ring, text ≥ 36 px letter height (rule 17) | skipped | the run was 1080p; left to the plan 35 four-resolution release gate |
| C6 | the owner's pick 09:54: «простая демная подложка, шрифт коардинат больше, плашку выше» | a plain dark translucent plate, font 15, the plate higher inside the ring | pass | 09:55 deploy + fresh start: log «на тёмной подложке», frame `varA.webp` — black 0.55 plate, font 15, top inset 40 (was 60), inside the ring; review folder 26 file 4 |
| C7 | the owner 09:58–10:00: «можешь углы скруглить у плашки» · «меньше шрифт» · «и меньше отступы от текста в плашке» · «чтобы текст коардинат был тесно в плашке» · «и чтобы плашка не перекрывала край карты» · «красное кольцо сейчас перекрывает» | rounded plate, font smaller than 15, tight padding, the plate fully inside the ring | pass | 10:01 fresh start: RoundedBox r 6, font 12, padding 4/0, inset 52 — the plate clear of the red ring (`tight.webp`) |
| C8 | the owner 10:01: «и карту я просил выше и правее» · «засунуть ее плотнее в угол» | the ring closer to the top-right corner, same size | pass | 10:03 fresh start: `MinimapScale` RenderTranslation (+22, −20) — ring ≈ 2–3 px from the right edge (CORRECTED 10:16 by a measurement — «≈ 8 px» was an eyeball), 5 px from the top, same diameter (`cmp_final.webp`, review folder 26 file 5); moving the SLOT instead shrinks the ring (09:51, 09:58) |
| C9 | the owner 10:07: «чуть больше шрифт коардинат, на один пункт, и выше плашку» | font 13, the plate higher, still clear of the ring | pass — **ACCEPTED** | 10:09 fresh start: log «отступ 46, кегль 13», frame `f13b.webp`; the owner 10:09: «вот теперь хорошо» |
| C10 | the owner 10:13–10:15: «дай отступ миникарте, типа 4 пекселя от верха и от права» · «ты уже прям вплотную сделал - это не хорошо» · «на разных разрешениях это будет разная цифра» | the ring ≈ 4 px from the top and the right at 1080p, the gap in UI units (scales with the resolution) | pass | 10:18 fresh start, `ringgap.py` (rows/columns with ≥ 3 ring pixels): top 4, right 4–7 (the background noises the right edge; a 3× zoom shows ≈ 4–5); shift (17.6, −20) |
