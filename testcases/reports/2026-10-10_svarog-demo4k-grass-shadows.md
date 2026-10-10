# Run report — Svarog's Dream: трава и тени A/B, демо в 4K с голосом

## 1. Work

Решения владельца по траве и теням и демо красоты — `[OWNER]` «Про траву шейдером - согласен, если в красоте не проиграем, а в кадрах
выиграем» · «давай демо запишем … по 10 секунд на сцену … монтироватть … по 5 секунл на сцену» · 2026-10-10 ≈09:10. Случаи —
`testcases/TC_svarog_demo4k_grass_2026-10-10.md` (C1–C7).

## 2. Contour

- Игра `D:\Games\Svarog's Dream`, release-плеер (`tools/player-swap.sh status` → `94c7a4d7913e…`), SvarogsDream `352168b`.
- 4K `ExclusiveFullScreen` на виртуальном экране 1280×720 (стрим).
- Сейв владельца 02:15 (Бор), копия `_backups/svarog-saves-2026-10-10_0918-pre-devplayer`.
- Время мира — ≈1 игровой час за минуту; прогон 03:20 → 23:09 игры.

## 3. Runs

- 09:39 — `bash tools/run-game.sh`; `SetResolution 3840 2160 ExclusiveFullScreen`.
- 09:40–09:41 — пробная запись `ffmpeg -f lavfi -i "ddagrab=output_idx=0:framerate=30" -t 3 -c:v h264_nvenc …`; float-захват
  (`output_fmt=rgbaf16`) — максимум 1.0; сверка с `shot`.
- 09:41 — `IncreaseTimeByOneHour` ×6.
- 09:42–09:48 — трава и тени: `cfg … DrawDistance GrassDistance 500|400|300`, `GrassFade 480|380|280`, `Terrain FarGrassFrom 480|380|280`,
  `ShadowDistanceFactor 3|2`; кадры при `timescale 0` с одного ракурса (`TestFaceSun 12 90`); `perf 8` A-B-A с паузой.
- 09:48–09:58 — запись: `ffmpeg … ddagrab … -c:v h264_nvenc -preset p5 -cq 20 rec.mkv`, звук `tools/rec_audio.py a.wav stop`;
  15 отметок `mark.sh <id>` (голос `ffplay` из WAV `voice_say.py <txt> <wav>`).
  - Сцены пультом: `TestFaceSun`, `TestBirds 0`, `SetRainWithPrerain False`, `TestLightning` ×2, `DisableRainSlowly`,
    `SetTemporarySnowForDuration 120` ×2, `Sky ForceMood Fog|Auto`, `Sky Sunset Raspberry|Golden`, `timescale 0`, `TestNight 0`,
    `TestAurora 1|-1`, `TestMeteorKind 0|1|2`, `SetMaxZoom`, карта.
  - `taskkill //IM ffmpeg.exe //F`, `kill`.
- 09:58–10:04 — перепаковка `ffmpeg -i rec.mkv -c copy rec_ix.mkv`; монтаж `python -I cut.py demo-4k.mp4`,
  `python -I cut2.py demo-4k-v1.mp4` (скрипты в scratchpad сессии `demo/`).

## 4. Checks

Hygiene: NONE (код модов не менялся).
Functional run: игра на сейве владельца в 4K, кадры `shot` и запись экрана прочитаны глазом; ролик проверен листом кадров каждой
секунды и громкостью по сценам.

- C1 pass с находкой.
- C2 fail по красоте.
- C3 fail.
- C4 partial.
- C5 pass.
- C6 pass (v1).
- C7 pass.

## 5. Found

1. **Трава 300 м** (+ шейдер от 280) — Main Thread −2.3 мс (23.95/23.27/24.11 → 21.35; FPS 42 → 46.7). Но холм за оврагом и средняя
   даль желтеют и лысеют. 400 м — −1.2 мс, местами желтеет. Оставлено 500.
2. **Тени ×2 днём** — без выигрыша (×3 21.99/21.75, ×2 22.88), дальний лес светлее и плоский. Оставлено ×3.
3. **Кадр движка (`shot`) темнее экрана:** мир ≈0.6 от записи экрана, интерфейс одинаков (`hud_cmp.webp`).
4. **Белая полоса ночью есть:** светящийся белый туман над лесом при отдалении, наклон 12–25° (ночная правка C52/C50 не помогла).
5. **Диск луны срезан справа** вертикальной линией; ночное небо в записи бурое.
6. **Птицы, дождь, сияние, падающие звёзды** в 5-секундных окнах не видны — сцены не вошли в v1. Дождь начинается через ≈20 с после
   `SetRainWithPrerain`; снег — со второго вызова после остановки дождя.
7. Реестр «Fullscreen mode» снова переписан на 0 `ExclusiveFullScreen` — возвращено 1.

## 6. Traces

- Ролик — `SvarogsDream/gallery/game/2026-10-10_демо-4K/демо-4K-v1.mp4` (55 с, 3840×2160), `…-лист.webp`, находки там же.
- Трава и тени — `SvarogsDream/gallery/game/2026-10-10_трава-тени/`.
- Кадры `SvarogsDream/_harness/`:
  - `grassA|B|C`, `g3_500|400|300`, `s450|300`;
  - `pv01…pv10`, `demo_c1`, `cal_shot`.
- Сырьё и разбор — scratchpad сессии `demo/`:
  - `rec_ix.mkv`, `a.wav`, `marks.txt`, `v0.txt`;
  - `sheet.webp`, `claims.webp`, `f14_strip.webp`, `sky1012.webp`.

## 7. Verdict

partial:
- трава и тени решены по наблюдению (оставлены 500 и ×3);
- демо v1 собрано из 11 проверенных сцен;
- четыре сцены не вышли, ночь показала два живых дефекта.
