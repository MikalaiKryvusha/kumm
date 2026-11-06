# Run report — Conan: Quick Win candidate `p.MaxPayloadSize=10000000` (from OblivionRemasteredPerformanceFix) — not taken

## 1. Work

Recon `researches/conan-oblivion-perffix-recon/README.md` shortlist item 1 (their gain ≈ 1.2 ms of game thread); acceptance `HOUSE_RULES.md` rule 7.

## 2. Contour

Conan Exiles 3.0.1 with the build (incl. the q6 line), the owner's save, background path; the value is read at start-up → A-B-A-B ACROSS launches: A = Conan's default
100000 (Constructor), B = 10000000 by `ini-temp.py add <live Engine.ini> q7|q7b …`; batch `ConanExiles/_config/bench-batches/q7-maxpayload.txt` (warm-up + 2 flights).

## 3. Runs

- 2026-11-06 16:04–16:15 +03:00 A · 16:16–16:28 B (log `p.MaxPayloadSize = "1e+07" LastSetBy: SystemSettingsIni`) · 16:28–16:40 A · 16:41–16:53 B; `bash bench-batch.sh bench-batches/q7-maxpayload.txt` each.
- After each B: `diff <ini>.bak-<label> <ini>` showed only the added line → `cp <ini>.bak-<label> <ini>` (ini-temp's revert refused — EXP-0466).

## 4. Checks

Hygiene: none.
Functional run: four launches on the real game, the bench's numbers READ — A: fps 53.3/52.7, 52.1/51.3; stutters ≥50 ms 50/63, 50/70 (mean 58); CPU 16.61/16.87,
17.05/17.30 ms. B: fps 52.7/54.6, 51.2/51.2; stutters 65/58, 96/76 (mean 74); CPU 16.81/16.26, 17.26/17.15 ms.

## 5. Found

1. No gain: CPU the same within the noise, stutters not lower (B's mean higher). Conan's map has no Oblivion-like mass of shapes over 1 km, as the recon warned.
2. All four launches drift worse over the afternoon (A 53 → 51 fps) — only the pairing makes the comparison fair.

## 6. Traces

Bench lines (session tasks b2k13suuz, bka11a326, b3yptdqxc, bhf0m5nct); `Saved/Logs/ConanSandbox.log` cvar lines per launch; the live `Engine.ini` back to its backup.

## 7. Verdict

fail — the candidate does not help Conan; not taken. The build keeps only the q6 line.
