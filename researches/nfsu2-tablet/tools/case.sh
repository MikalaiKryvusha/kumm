#!/usr/bin/env bash
# case.sh <label> '<settings.ini json>' '<registry json>' — quit the game if it runs, apply the settings, Play → city,
# sample 20 s of driving twice, print the render-size lines of the game log and the thermal status.
cd "$(dirname "$0")"
A=/c/Android/Sdk/platform-tools/adb.exe
running=$(node cdp-eval.mjs isgame.js)
if [ "$running" = "yes" ]; then
  node cdp-keys.mjs F9 wait:1200
  $A -s ${TABLET:?set TABLET=ip:port} shell input tap 970 1190; sleep 2.5
  $A -s ${TABLET:?set TABLET=ip:port} shell input tap 1654 986; sleep 6
fi
bash setini.sh "$2" | cut -c1-400
{ printf 'window.__reg=%s;\n' "$3"; cat setreg.js; } > setreg_run.js && node cdp-eval.mjs setreg_run.js | tr '|' '\n' | grep -E "CarEnv|RoadRefl" | tr -d '\n'; echo
bash to_city.sh "$1"
sleep 5
node cdp-eval.mjs sample20.js
node cdp-eval.mjs rlog.js | grep -v "[roam]"
