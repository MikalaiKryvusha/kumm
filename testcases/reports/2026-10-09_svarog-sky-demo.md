# Run report — Svarog's Dream: демо-видео неба с голосом, сцены по 10 секунд

## 1. Work

ролик-демо раздела «Небо» мода `KrinikColorRework` для владельца; случаи — `testcases/TC_svarog_sky_demo_2026-10-09.md` (C0–C12);
основание — `[OWNER]` «запиши мне демо. Видео, разные планы, разные погоды, по 10 секунд … ты и видео пиши, и голосом озвучивай, что
показываешь» · 2026-10-09 ≈22:55.

## 2. Contour

игра `D:\Games\Svarog's Dream`, сейв владельца 17:46 (копия `_backups/svarog-saves-2026-10-09_1746-owner`, сверка до и после 7/7);
экран — поток Sunshine 1280×720 HDR (белый SDR = 3.0 scRGB); SvarogsDream `5174039` + `tools/rec_audio.py` (новый),
`tools/voice_say.py` (второй аргумент — только WAV); окружение `_tools/capture-venv` (Python 3.10, PyAudioWPatch 0.2.12.9).

## 3. Runs

Один прогон 2026-10-09 23:04–23:13. Запуск `bash tools/run-game.sh`; запись видео
`ffmpeg -f lavfi -i "ddagrab=output_idx=0:output_fmt=rgbaf16:framerate=30,hwdownload,format=rgbaf16le,format=gbrpf32le,exposure=exposure=-1.585,zscale=tin=linear:t=iec61966-2-1:pin=bt709:p=bt709:m=bt709,format=yuv420p" -c:v h264_nvenc -preset p5 -cq 18 rec.mkv`;
звук `capture-venv/Scripts/python.exe tools/rec_audio.py a.wav stop`; голос `_harness/demo/mark.sh <id>` (готовые WAV из
`voice_say.py <txt> <wav>`); пульт `bash tools/h.sh "call KrinikCameraRework.Plugin TestFaceSun <наклон> <угол>"`
`"callon Managers/StandardManagers/WeatherManager WorldWeatherManager SetRainWithPrerain False"` · `DisableRainSlowly False 0` ·
`SetTemporarySnowForDuration 120` · `"callon Managers/StandardManagers/WorldTimeManager WorldTime IncreaseTimeByOneHour True"` ·
`"cfg krinik.svarogsdream.colorrework Sky Sunset Raspberry|Golden|Alternate"` · `"cfg … Sky Haze false|true"` ·
`"call KrinikColorRework.Sky TestLightning"`; закрытие `bash tools/h.sh "kill"`; монтаж `python -I cut.py` (scratchpad) в 23:15.

## 4. Checks

Hygiene: NONE (кода мода не менялось; два инструмента проверены своими прогонами — C0).
Functional run: игра, сейв владельца, сцены настраивались пультом, каждая — кадр изнутри движка глазом до записи фразы; ролик
  прочитан листом кадров и громкостью голоса по клипам. C0 pass, C1 pass, C2 pass, C3 pass, C4 pass (гром — по низам записи), C5
  pass со второго вызова, C6 pass, C7 pass, C8 pass, C9 pass, C10 pass, C11 pass, C12 pass.

## 5. Found

(1) WASAPI-петля в тишине не отдаёт буферов — блокирующее чтение повисало, стоп-файл не виден; исправлено опросом и досыпкой тишины;
(2) синтез фразы ≈3.5 с — фразы готовятся заранее; (3) `SetTemporarySnowForDuration` сразу после `DisableRainSlowly` снега не даёт;
(4) ночью молния игры шлёт гром громкостью 0 (не разбирал); (5) владелец после демо: солнце на закате не опускается — причина в
`Sky.cs` (высота диска притянута к полосе неба в сумерки), план 18 «Небо»; (6) реестр разрешения игра переписала на 1280×720 —
возвращено.

## 6. Traces

ролик `SvarogsDream/gallery/game/2026-10-09_небо/демо-неба-с-голосом.mp4`, лист `демо-неба-лист.webp`; кадры
`SvarogsDream/_harness/d1_pair.webp`, `d2_a`, `d3_pair`, `d4_test`, `d5_test`, `d67_pair`, `d8_test`, `d9_test`, `d10_test`;
отметки сцен и сырьё (`marks.txt`, `rec.mkv`, `a.wav`) — scratchpad сессии `demo/`; журнал `BepInEx/LogOutput.log` строки
`sky: lightning`, `sky: thunder`, статус `fog=`/`moon=`.

## 7. Verdict

pass — ролик 114.9 с, 11 сцен с голосом, цвета как в игре; гром есть в записи по низам частот, человеком на слух не подтверждён.
