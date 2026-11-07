#!/usr/bin/env bash
# shot.sh <name> — tablet screenshot to WebP (50 %) in the scratchpad's shots/ folder, plus the SoC/skin temperature line
cd "$(dirname "$0")" && mkdir -p shots
cmd //c "C:\Android\Sdk\platform-tools\adb.exe -s ${TABLET:?set TABLET=ip:port} exec-out screencap -p | magick png:- -resize 50% -quality 80 webp:shots\\$1.webp"
/c/Android/Sdk/platform-tools/adb.exe -s ${TABLET:?set TABLET=ip:port} shell 'dumpsys thermalservice | grep -E "Thermal Status|mName=SOC|mName=SKIN" | head -3' | tr -s ' \t\n' ' '
echo " -> shots/$1.webp"
