# Stand tools — nfsu2.xyz on the owner's tablet (plan 50)

Run from Git Bash in this folder. Prerequisites:

```bash
export TABLET=<tablet LAN address>:<wireless-debugging port>   # the port changes after a reboot; the owner gives it
C:/Android/Sdk/platform-tools/adb.exe connect $TABLET
C:/Android/Sdk/platform-tools/adb.exe -s $TABLET forward tcp:9333 localabstract:chrome_devtools_remote
```

The nfsu2.xyz web app must be open on the tablet (its page is found by URL in `http://127.0.0.1:9333/json/list`). `magick` (ImageMagick) is on PATH.

| Tool | What it does |
|---|---|
| `cdp-eval.mjs <file.js>` | evaluates a JS file in the nfsu2.xyz page, prints the result |
| `cdp-keys.mjs <steps…>` | key presses into the page: `Enter`, `ArrowUp:8000` (held 8 s), `wait:ms`, `click:<button text>`, `eval:<file>` |
| `setini.sh '<json>'` | rewrites live lines of OPFS `/save/settings.ini` (`null` = back to the template default) |
| `setreg.js` | sets DWORDs of OPFS `/save/registry.txt` from `window.__reg` (prepend `window.__reg={…};`); the game must not be running |
| `to_city.sh <label>` | Play → intro → title → main menu → career → garage → back to the city; waits for `drive=2`, samples 20 s, shoots |
| `case.sh <id> '<ini json>' '<reg json>'` | one case: quit the game if running, apply settings, `to_city.sh`, a second sample, render lines of the log |
| `sample.js` | median / worst FPS and frame ms of the page's `#fps` counter over `window.__N` seconds (needs `fps_counter = detailed`) |
| `drive.js` · `isgame.js` | the counter's `drive` / `pause` state · whether the game is running |
| `step.sh <name> <keys…>` | key holds (parallel as `A+B:ms`) then a 480 px frame — the closed-loop steering step |
| `shot.sh <name>` | a WebP frame of the tablet + the thermal status line |
| `rlog.js` · `peekreg.js` | render/resolution lines of the current game log · the registry text |

Quit the game through the site menu (F9 → «Выйти из игры» → confirm), never by reloading the page: Chrome's "Reload site?" dialog freezes CDP.
| `trace-pacing.mjs [s]` | a CDP Chrome trace (viz): intervals between presented frames (`Display::DrawAndSwap`) — frame pacing |
