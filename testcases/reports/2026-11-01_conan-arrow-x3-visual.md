# Test run report — the ×3 visual arrow in flight joined to the ×1 physical arrow at the tip (bug 73, the owner's scheme 16:23)

**Created:** 2026-11-01 17:52 +03:00 · **Run by:** the agent (Claude Opus 5.5) · **Version/build:** pack ConanExiles after `c7361b0` (uncommitted at the run; committed with this
report): KrinikConanArchery Lua `add_visual_arrow`, `CFG.visual_scale` 3

## 1. Work

`[OWNER]` 2026-11-01 16:23 «значит лететь в воздухе должна физическая оригинальная стрела x1 размера, а визуальная модель лететь должна x3. Физическая стрела и
визуальная модель сввввввввввввввввязаны в наккооооооооооооооооонечникееееееее». Cases V1–V3 of `testcases/TC_conan_hub_rows_audit_2026-11-01.md`.

## 2. Contour

The live game 3.0.1 in front at 4K; the oasis spot; god on; a green Kappa 8 m ahead, frozen; the companion «Нурус Тихорез» frozen after he spoiled the first
recording; the bow (a spawned «Мощный охотничий лук», quick slot 3); shots by real mouse buttons; a 60 fps `ddagrab` video with the desktop HDR off for the
recording and back on after. Machine lock `kumm` 17:44–17:51.
REAL WORLD: accumulated — the owner's live save (its bow, the spawned bow, the companion); data and machine — his; path — the player's shot.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-11-01 17:46 +03:00 | `Deploy-ModPack.ps1 -Deploy -Only KrinikConanArchery`, `launch-fg.ps1`, `enter-world-remote.sh`, a shot by `mouse-seq.ps1` | «крупная стрела: ошибка … field 'Max'» (`GetBoundingBox()` without Min/Max in Lua); the copy at 62 cm |
| 2 | 2026-11-01 17:48 +03:00 | the fix (`GetBounds()`), redeploy, relaunch, a shot under `ffmpeg -f lavfi -i "ddagrab=output_idx=0:framerate=60" -t 4 …` | the log line of the visual arrow (offset −152.7 cm); the copy at 62 cm in the ground; the video spoiled by the companion's fight |
| 3 | 2026-11-01 17:50 +03:00 | `CLASS=HumanoidNPCCharacter_C bash arrow-stand.sh freeze`, `hdr.ps1 off`, a new Kappa, the same recording, `hdr.ps1 on` | the copy at 62 cm in the Kappa's head; frames 116–117 show the big arrow |

## 4. Checks

Hygiene: `lua -e "assert(loadfile(…))"` for the archery `main.lua`.
Functional run: real shots in the live game; read — the archery log (copy distance, the visual arrow line, errors) and the 60 fps video frame by frame.
V1 pass · V2 pass · V3 partial (the native mesh hidden is seen in the frames, not read by the remote).

## 5. Found

1. `StaticMesh:GetBoundingBox()` reaches Lua without `Min` / `Max` — the end of the arrow is taken from `GetBounds()` (Origin + BoxExtent).
2. Stand: the hero's companion killed the target during the first recording — frozen like the target for the repeat.
3. Stand: a desktop recording with HDR on is washed out — HDR off for the recording (house rule 4).

## 6. Traces

The UE4SS log lines `[KrinikConanArchery] крупная стрела …` 17:48:51 and `копия стрелы #1..#2` 17:48:52, 17:50:06; review folder
`SvarogsDream/НА ОТСМОТР НИКОЛАЕМ/50_strela_x3_v_polete/` (frames 115–118 WebP, the release slowed ×8).

## 7. Verdict

pass — the big arrow flies with its head at the aim point and the stuck copy stands where it stood; the look is the owner's taste (review folder 50).
