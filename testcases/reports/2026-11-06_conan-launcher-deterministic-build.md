# Test run report — the launcher builds from a clean public clone; deterministic build

**Created:** 2026-11-06 09:20 +03:00 · **Run by:** the agent (Claude Opus 5.5) · **Version/build:** public repo `Kriniks_Conan_Exiles_Enhanced_ModPack` at `c93946c` (release 0.9.0);
`_config/release/build-docs.py` of the private pack with `-deterministic`

## 1. Work

`[OWNER]` 2026-11-06 09:18 «они там пишут про способ сборки. У нас это есть? они поймут, как собрать?» — the Nexus quarantine notice asks for a link to the
source and the steps to build compiled code. Check: can a stranger build `KrinikConanLauncher.exe` from the public repository by written steps; can the
result be compared by hash.

## 2. Contour

A sparse clone of the public repo (`_config/release`, `_config/launcher`, `_config/branding/icon`, `docs/guide` + root files) in the session scratchpad; Python
3.14, the Visual Studio 2022 Roslyn `csc.exe` found by the script; .NET Framework 4.x of Windows.
REAL WORLD: accumulated — none (the reviewer's path is a fresh clone, which is what was walked); data and machine — the public repository as anyone sees it;
path — the reviewer's: clone → one command.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-11-06 09:19 +03:00 | `git clone --depth 1 --filter=blob:none --sparse …` · `git sparse-checkout set …` · `python _config/release/build-docs.py --no-pdf` | «лаунчер … 4326 КБ, версия сборки 0.9.0»; 4 429 824 B; SHA-256 `6a480e53…` |
| 2 | 2026-11-06 09:2x +03:00 | the same with `-deterministic` (the edited script copied into the clone), twice | both builds SHA-256 `d1d43330…` |

## 4. Checks

Hygiene: none beyond the runs.
Functional run: the reviewer's path walked on a fresh public clone; the exe written and its size and hash READ.
- The public repo holds everything the build needs (source, window images, icon, script) — the build passes with no file from outside. pass
- The size equals the released file in the Nexus archive (4 429 824 B). pass
- Without `-deterministic` the hash differs from the release (`6a480e53…` vs `24fb7eaf…`) — the compiler stamps each build. Expected, now explained in the letter.
- With `-deterministic` two builds give one hash. pass

## 5. Found

1. The 11-03 letter to Nexus gave the compiler command but did not name the build script and called the generated file `BuildInfo.cs` (it is `BuildInfo.g.cs`).
2. The README of the public repo has no build section.
3. The released 0.9.0 exe cannot be matched by hash (built without `-deterministic`).

## 6. Traces

The follow-up letter with full steps: `D:\Games\Conan Exiles Mods\Krinik_Mod_Pack_0_9_0_Nexus\nexus_support_quarantine_followup.txt`. The clone stays in the session scratchpad (`clean_clone`), swept by `scratch-sweep` after 24 h idle.

## 7. Verdict

pass — a stranger builds the launcher from the public repo by one command; the next release will be hash-comparable.
