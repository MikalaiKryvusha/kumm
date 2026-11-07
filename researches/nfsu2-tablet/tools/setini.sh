#!/usr/bin/env bash
# setini.sh '<json of changes>' — apply settings.ini changes on the tablet page (null = back to the template default)
cd "$(dirname "$0")"
{ printf 'window.__nfsChanges = %s;\n' "$1"; cat setini.js; } > setini_run.js
node cdp-eval.mjs setini_run.js
