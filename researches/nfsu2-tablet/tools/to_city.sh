#!/usr/bin/env bash
# to_city.sh <label> — Play → skip intro → title → main menu → career → garage → back to the city (by the garage);
# makes sure the game is in the driving state (drive=2, pause=0), settles 10 s, samples 20 s of FPS and shoots.
cd "$(dirname "$0")"
A=/c/Android/Sdk/platform-tools/adb.exe
$A -s ${TABLET:?set TABLET=ip:port} shell input tap 1280 994
sleep 35
node cdp-keys.mjs Enter wait:3000 Enter wait:5000 Enter wait:5000 Enter wait:4000 ArrowLeft wait:1500 Enter wait:4000 Enter wait:30000 Enter wait:3000 ArrowLeft wait:600 Enter wait:35000
for i in 1 2 3; do
  st=$(node cdp-eval.mjs drive.js); echo "state: $st"
  case "$st" in *"drive=2 pause=0"*) break;; esac
  # still in the garage menu or its dialog: confirm the return to the city again
  node cdp-keys.mjs Enter wait:3000 ArrowLeft wait:600 Enter wait:30000
done
sleep 10
{ echo 'window.__N=20;'; cat sample.js; } > sample20.js
node cdp-eval.mjs sample20.js
bash shot.sh "$1"
