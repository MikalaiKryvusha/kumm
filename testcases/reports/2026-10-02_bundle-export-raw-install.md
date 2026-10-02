# Test run report — one-zip build bundle installed into a raw game

**Created:** 2026-10-02 16:47 +03:00 · **Run by:** the agent (Claude Opus 5.5) ·
**Version/build:** `Deploy-ModPack.ps1` with the new `-Export / -ConfigFrom / -Zip` (this commit); Conan Exiles
Enhanced 2.2.3 (CL-378132); bundle `Krinik-Conan-2.2.3.zip`, 6 969 745 320 bytes

## 1. Work

The owner's ask of 2026-10-02: «упаковать в зип, который запуском одного скрипта запускается и ставится в 2.2.3
сырую», configs included («да, класть»). Under test: `-Export` (every enabled mod resolved by the same
`Resolve-ModSource` as a deploy and stored unpacked), `-ConfigFrom` (the install's `*.ini` as a `files` mod), `-Zip`,
and the generated `install.cmd` / `install.ps1`.

## 2. Contour

A RAW copy of the game built from the owner's live install by the release's SHA-1 manifest (`CE_25639639.sha1`):
the 512 game files of the manifest plus the 4 Steam-emulator files the release ships unlisted; `Content\Paks` as hard
links (read-only for game and deploy), the rest copied; the 10 splash files from the stored originals. Location
`D:\Games\_test-raw-2.2.3\Conan Exiles` — removed after the run. The owner's save copied in to reach the world (real
state taken from the real world).

REAL WORLD: accumulated — none in the target by design (raw install), the owner's save and his live configs carried
by the bundle; data and machine — the owner's desktop, his mod library as the export source; path — unzip →
`install.cmd <game folder>` → game launch → Continue. The "other machine" itself was not available: same PC, fresh folder.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-10-02 ≈16:36 +03:00 | `.\Deploy-ModPack.ps1 -PackDir D:\work\ai_sandbox\ConanExiles -Export 'D:\Games\Conan Exiles Mods\_bundle\Krinik-Conan-2.2.3' -ConfigFrom 'D:\Games\Conan Exiles 2.2.3\Conan Exiles' -Zip` | 0 · 50 mods, 168 files, zip 6 647 MB |
| 2 | 2026-10-02 ≈16:40 +03:00 | `python make_raw.py build` then `python make_raw.py verify` (scratchpad) | 510/512 SHA-1 equal; 2 = `steam_api64.dll` replaced by the release itself (its `.rne` twins carry the manifest hashes) |
| 3 | 2026-10-02 ≈16:42 +03:00 | `[IO.Compression.ZipFile]::ExtractToDirectory(<zip>, 'D:\Games\_test-raw-2.2.3')` | unzipped in 34 s |
| 4 | 2026-10-02 ≈16:42 +03:00 | `cmd /c '"…\Krinik-Conan-2.2.3\install.cmd" "D:\Games\_test-raw-2.2.3\Conan Exiles"'` | 0 · 50/50 mods, 165 files, verify 71 present 0 missing |
| 5 | 2026-10-02 16:43:27 +03:00 | `_config\enter-world.ps1 -TimeoutSec 420 -GameDir 'D:\Games\_test-raw-2.2.3\Conan Exiles'` | 0 · "in the world after 72 s and 4 click(s)" |
| 6 | 2026-10-02 ≈16:47 +03:00 | `_config\close-game.ps1` | "closed cleanly in 4,1 s" |

## 4. Checks

Hygiene: PSParser on `Deploy-ModPack.ps1` — 0 errors; `node --check kumm.mjs` — 0; zip CRC test — 174 entries, none bad.
Functional run: unzip and `install.cmd` into a raw 2.2.3, game launched from that folder (process path confirmed
`D:\Games\_test-raw-2.2.3\…`), world entered; READ — install summary, UE4SS log, game log, one screenshot in the world.

| Case | Status | Observation |
|---|---|---|
| Target is raw | pass | 510/512 manifest hashes; the 2 others are the release's own replacement, their originals match |
| install.cmd on a raw game | pass | `50/50 mods, 165 files  \|  verify 71 present, 0 missing`, exit 0 |
| No 7-Zip needed | pass | Edit Appearance (`.rar` in the library) shipped unpacked; the install read no archive |
| All paks mounted | pass | game log: 43 × `Mounting mod pak file`, 0 × `too old`; `[ConanModPackStatus] СБОРКА: моды 43/43` |
| UE4SS + 4 Lua mods | pass | `Using engine version: 5.8` · `FName Alignment: 0x4` · `Event loop start` · start lines of all four |
| Our level table | pass | HUD XP `35 722 / 37 866` — row 23 of our generator ends at 37 866 |
| Configs from the bundle | pass | 5 ini files in `Saved\Config\Windows` before the first launch (deployed as mod "Game config") |
| install.cmd without an argument | skipped | the auto-detect / prompt branch was not walked |
| A second physical machine | blocked | not available; the raw folder on the same PC stands in for it |

## 5. Found

- `install.cmd` auto-detect looks only at the bundle's parent and itself: unpacked next to the game folder (not inside
  it) the user is asked for the path — by design, said in README.txt; no defect filed.
- none other.

## 6. Traces

- the bundle: `D:\Games\Conan Exiles Mods\_bundle\Krinik-Conan-2.2.3.zip`
- logs and the test folder were removed with the test copy; screenshot `raw1.png` — session scratchpad only

## 7. Verdict

**pass** for the raw-install path on this PC; the prompt branch of `install.cmd` and a second machine are not covered.
