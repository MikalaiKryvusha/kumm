#!/usr/bin/env bash
# step.sh <name> <keys...> — press the keys (cdp-keys steps; parallel holds as "A+B:ms"), then a small 480px frame of the game area
cd "$(dirname "$0")"
args=()
for a in "$@"; do
  [ "$a" = "$1" ] && [ "${#args[@]}" -eq 0 ] && [ "$a" = "$1" ] && { args+=("__name__"); continue; }
  args+=("$a")
done
name=$1; shift
pids=()
for a in "$@"; do
  case "$a" in
    *+*:*) ms=${a##*:}; keys=${a%:*}; IFS='+' read -ra ks <<< "$keys"; for k in "${ks[@]}"; do node cdp-keys.mjs "$k:$ms" & pids+=($!); done; wait "${pids[@]}"; pids=();;
    *) node cdp-keys.mjs "$a";;
  esac
done
cmd //c "C:\Android\Sdk\platform-tools\adb.exe -s ${TABLET:?set TABLET=ip:port} exec-out screencap -p | magick png:- -crop 1980x1600+0+0 -resize 480x -quality 60 webp:shots\\$name.webp"
echo "shots/$name.webp"
