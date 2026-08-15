# KUMM — Current Status

> This file is read by the AI agent before every task. Update it on every significant change of state.
> It is the PRIMARY handoff between sessions: a new agent session starts with empty context and must be
> able to get productive from this file alone. Write accordingly — concrete, with file paths and commands.
> 🧠 Prime thinking principle — `PHILOSOPHY.md` (SIMPLICITY: KISS + Occam). Read your working framework
> in `AGENT_GUIDE.md`.
>
> ⚠️ **STATUS is a SUMMARY of NOW, not a chronicle.** A status file that only ever grows turns into
> the project's history book, and the agent that came for a quick "where are we" drowns in it
> (field: a 2 300-line STATUS — "an abyss, not a summary"). The rules that keep it a summary:
>
> - **Every line passes two tests:** *"if I remove this line, will the next agent make a mistake?"*
>   and *"does a newcomer still read the whole file in one sitting?"* Soft target: **~200 lines**
>   (one-two screens of substance) — the guard is a warning, not a wall, but crossing it means a
>   trim is overdue.
> - **Closed work is MOVED OUT, not accumulated:** when a phase/session's entry is no longer "now",
>   move it VERBATIM into `PROJECT_HISTORY.md` (the chronicle — that is what it is for).
>   `/end-chat` carries a "bonsai trim" step for exactly this (`/pause` stays ceremony-free by design).
> - **Leave the file the way you'd want to find it:** fresh summary of what works, what's in
>   progress, what's next, the pitfalls, and WHERE TO LOOK for the details (plans, bugs, history) —
>   pointers, not retellings.

---

## What's done (the short tail — older entries live in PROJECT_HISTORY.md)

> v0.1.0 (the two halves) and the KAIF 2.2 deployment closed and moved to `PROJECT_HISTORY.md`.

### FPS regression traced and tuned out, 2026-08-15 01:4x +03:00 ✅ measured: 100–130 FPS (was 80)
- Symptom: average FPS fell from ~120 (peaks 140) to ~80 after the 14 Aug deploy. **Cause was not the
  game's weather** but the pack's own mods: Ultra Graphics 1.2.2 introduced a runtime `CVars` block that
  applies AFTER `Engine.ini` and overwrote **26 lines** of the 31 Jul Pareto tuning. The mod logs what it
  overwrote itself — `UltraGraphics_CVarOriginalValues.txt` beside its config; the pre-1.2.2
  `Scripts/config.lua` (246 lines) held no cvars at all, so it is a regression of the update.
- Fix (pack commit `bc892d8`, redeployed into both targets): the block was reviewed line by line, not
  rolled back wholesale. Cheaper-or-free author findings moved INTO `Engine.ini` (reflection roughness
  0.25 + fade 0.25, `SmoothBias`, reflections temporal 8, translucency volume 8/1/2, BentNormal-off +
  SSAO-on, DLSS motion-vector dilation); the expensive ones were rejected by name with reasons
  (`OcclusionCull=0`, `MaxIterations=128`, `TracingOctahedronResolution=16`, `ViewDistanceScale=4`,
  `LandscapeLOD*=4`, `VolumetricFog=1`). `CVars.Enabled=false` in the mod; Ultra Weather untouched.
- **Verified in game:** the owner's session read **100–130 FPS against 80**; the mod did not rewrite
  `UltraGraphics_CVarOriginalValues.txt` this run (it kept the previous session's timestamp), which is
  the independent proof that nothing is being overridden. Marker flipped to `[TESTED]`; the result is
  written up in the pack's `_config/Pareto-audit.md` → section 6.
- **Shadow flicker — closed the same night** (pack `f6ab2fa`). Culprit: `r.InstanceCulling.OcclusionCull`,
  exactly the line the mod's author documents as causing "dynamic shadows to disappear or flicker at
  certain viewing distances and/or angles". Cost of calm shadows, measured: GPU busy 7.21 ms vs 6.6,
  median 137.8 vs 142 — about four frames.
- **The finding that outlives the fix:** `[SystemSettings]` lines **do not survive into the scene** —
  Palworld overwrites part of `Engine.ini` with its own graphics settings on world load (the pack's
  `ForceLumenGI` exists for that reason). Fourteen owner sessions of "one cvar per run via ini" produced
  fourteen FALSE acquittals. Graphics cvars now live in the mod's runtime `CVars` block
  (`_unpacked/UltraGraphics/config.lua`); `Engine.ini` keeps start-of-engine settings (DX12, ConsoleKeys,
  hang fixes) and the same values as documentation. Lesson recorded as `EXP-0009`.

### Latency and frame generation, 2026-08-15 03:xx–05:00 +03:00 ✅ measured
- Owner reported input lag "up to 120 ms" and a mushy feel. Measured with PresentMon: `input → photon`
  p50 41.6 / p95 75.5 / p99 91 ms — the 120 is the tail of a real distribution, not a fluke.
- **Two agent conclusions were WRONG and are retired** — both recorded as lessons because the class
  repeats: (a) "CPU is the bottleneck" from averages (`EXP-0011`: the same sample had CPU busy p50 =
  0.48 ms against p90 = 36 — averages describe a multimodal scene and mean nothing); (b) "frame
  generation is not working" from an empty `FrameType` column (`EXP-0010`: open PresentMon simply
  cannot label DLSS-G frames; the owner's overlay could, and he was right).
- **What the overlay showed:** DLSS SR "Balanced" at 58% of 4K, and frame generation at **3x** — not
  because the game asked (its `DLSSGeneratedFrames=1` means 2x) but because **NVIDIA App was
  overriding it** ("Замещение DLSS", dynamic mode, target 120). The driver silently outranks the game.
- **Fix and its measured result** (pack `2258d5a`, `54edbca`): dynamic target 120 → 80 (which yields
  ~2x, since the multiplier is a ceiling and the target sets the real ratio), plus
  `D3D12.MaximumFrameLatency` 3 → 2 and `r.OneFrameThreadLag` 1 → 0 in `Engine.ini` (these are read at
  RHI init, so `Engine.ini` DOES work for them). **Latency p50 fell 41.6 → 26.8 ms, −36%.**
- **What did not move: the tails** (p95 73.4, p99 93.9). They are held by base frame rate, not by
  generation: `GPU busy` p95 = 33.5 ms, `CPU busy` p95 = 37.7 ms. Only lowering graphics load moves them.
- **Panel measured: 3840×2160 @ 144 Hz** (a TV). The game's `FrameRateLimit=141` is correct; the
  generation target of 80 leaves half the panel unused. Full write-up with numbers, retired
  conclusions and "what not to trust" lives in the pack: `_config/Latency-and-FrameGen-audit.md`.
- Also this session, **deployed but NOT yet confirmed by the owner** — say so, don't claim them done:
  - **Aim camera** `aim_offset_y` 0 → 45 (the mod's own recommendation for a centred camera; ПКМ
    should now shift to the shoulder). Deployed to the target and verified in the file; the owner
    tested other things that run and never reported back on this one.
  - **Streaming range halved** 153600 → 76800, synchronised across `HLODLoadingRange/Scripts/config.lua`
    and `UltraGraphics/config.lua` (they must match — the manifest says so). Effect on the 1% low
    problem not measured yet.
- **Confirmed:** the 1.0.2.101103 build deleted at the owner's request — 38.4 GB freed, `targets.json`
  lists one target, `-Verify` clean (20 checks, 0 missing).

---

## Where we are now

The engine works and the owner uses it daily for Palworld. What it does NOT have is any way to check
itself: there is no test of any kind, and both halves talk to the outside world (Nexus through a
browser, game folders on disk), so a fresh session cannot currently prove a change is safe without the
owner's eyes. That is the whole of the current focus — Phase 1 in `MASTER_PLAN.md`.

| Phase | Status | What's there |
|-------|--------|--------------|
| Phase 0 — the two halves | ✅ done | v0.1.0 in daily use |
| Phase 1 — trustworthy unattended | 🔲 next | no tests exist yet; the deterministic core is the target |
| Phase 2 — the second game | 🔲 todo | waits on the owner starting Oblivion Remastered |
| Phase 3 — compatibility | 🔲 todo | needs a research doc first |
| Phase 4 — optimization presets | 🔲 todo | |

---

## 🤖 Autonomous backlog pool (no human / no special hardware needed)

> Tasks the agent can do FULLY autonomously: write code → build → test on the harness → fix → commit,
> without the human and without resources only the human can provide. The loop skills
> (`/autoloop`, `/dayloop`, `/nightloop`) grind this pool.

- [ ] **Round-trip check for the archive naming scheme** — `libraryName()` writes it, `parseArchive()`
      reads it; they must agree. Pure functions, no network, no disk. This is the single most exposed
      pair in the codebase.
- [ ] **Cases for `sameFile`/`stamp` and `pickCard`** — upload-date comparison rounded to the minute;
      variant selection between Steam/Gamepass, Capped/plain, presets. Pure, autonomous.
- [ ] **A fixture pack** (throwaway `modpack.json` + zero-byte correctly-named archives, built under the
      scratchpad, never in the repo) driving `check --json`, `-ListMods` and `-Deploy -DryRun` with no
      network and no game installed.
- [ ] **Close the packaging drift** — `package.json` `"files"` ships `kumm.mjs` without
      `Deploy-ModPack.ps1`, so `npm i -g` delivers half the engine. Verify with `npm pack --dry-run`.
- [ ] **A real `help` command** — the switch block, the header comment (lines 18–28) and the README
      table are three hand-maintained copies of one list. One source, the rest generated or checked.
- [ ] **`kumm status` after `close`** — confirm it reports cleanly rather than throwing; cheap, and it
      is the command a session runs first.
- [ ] **Warn when a mod overrides `Engine.ini` at runtime** — the 15 Aug regression was invisible to the
      engine: deploy verified every file and still shipped a build whose graphics a Lua mod rewrote in
      the world. A cheap first cut needs no game running: scan each mod's source for `[SystemSettings]`
      or `r.*=` assignments and report which of them collide with the pack's `Engine.ini`. This is the
      concrete, autonomous slice of Phase 3 (`MASTER_PLAN.md`) — conflicts reported before launch.

---

## ❓ Awaiting human review (interviews / homework)

> Decisions the agent must not make alone (brand/UX/architecture), or actions only the human can do
> (test on real hardware, external accounts). Filed in `interviews/` and `homeworks/`.

- *(none open)* — the one identity question of the KAIF deployment (canonical name) was answered:
  **KUMM**, 2026-08-15.
- 🎮 **Raise the BASE frame rate, then set the generation target under the panel** — the one open
  performance task, and it needs the owner because it trades picture for feel. Base is ~30–42 real
  renders/s; latency tails follow it directly. Order of leverage, measured or reasoned:
  DLSS SR "Balanced" (58%) → "Performance" (50%) · shadows `r.Shadow.MaxCSMResolution` 4096 → 2048
  (vanilla is 1536) · grass/foliage distances (`grass.CullDistanceScale=4`,
  `foliage.LODDistanceScale=4`, CPU side). With base at 55–60, the target can go to 138 under the
  144 Hz panel and still need only ~2.3x. **Do NOT raise the multiplier to buy smoothness** — it costs
  latency, proven this session.
- ⏳ **Verify the halved streaming range** (76800, was 153600). Deployed but not yet measured against
  the 1% low problem (36.6 при median 95.2 — the spikes are streaming, not rendering).
- 🧰 Anything needing a real Nexus login, a real game install, or the owner's own mod pack is his to
  run — the agent can build the fixture path but cannot verify the live path alone.

---

## Where to continue next session

> A concrete checklist so the next session (empty context) can start immediately: which files, which
> commands, what to verify first.

**If the owner is here and wants engine work** (the project's own roadmap, Phase 1):

1. `git log --oneline -5` and `git status`. There is no build; `node --check kumm.mjs` is the syntax gate.
2. Take the first autonomous-backlog item (the naming-scheme round trip). Plan it with `/plan-task` —
   it is ordinary, not heavy.
3. The functions live in `kumm.mjs`: `parseArchive` (line 450), `libraryName` (412), `sameFile`/`stamp`
   (541–543), `pickCard` (548), `parseArgv` (59), `globToRe` (447).
4. Decide the check runner BEFORE writing checks — the project has zero dependencies and that is a
   design constraint (`MASTER_PLAN.md` → Guiding principles). `node:test` + `node --test` is built in
   and costs nothing; anything requiring an install is an interview question, not an agent decision.
5. Never loop live Nexus calls while testing (`AGENT_GUIDE.md` → "Live-path rule").

**If the owner comes back about the game** (performance, shadows, latency) — read this first, it will
save you his evening:

6. **The pack is at `D:\work\ai_sandbox\Palworld`** (private, own git, no remote). Read
   `_config/Latency-and-FrameGen-audit.md` and `_config/Pareto-audit.md` §6 before touching anything —
   they carry the measured prices and the retired conclusions.
7. **`Engine.ini` is NOT where graphics cvars take effect.** Palworld overwrites them on world load.
   Working values live in the `CVars` block of `_unpacked/UltraGraphics/config.lua`; `Engine.ini` keeps
   what is read at engine start (DX12, ConsoleKeys, hang fixes, `MaximumFrameLatency`) and the same
   graphics values as documentation. Testing a graphics hypothesis via `Engine.ini` returns a FALSE
   "not guilty" — that cost the owner fourteen sessions (`EXP-0009`).
8. **How to measure:** Intel PresentMon 2.5.1 (thin CLI, downloaded to the session scratchpad; get it
   again from GitHub if gone). Own ETW session name is mandatory — a neighbour project (KAGO) captures
   the same game under `kago-pw2`, and NVIDIA FrameView runs its own. Never `Stop-Process` by mask;
   stop your session with `logman stop <name> -ets`, or the next launch dies silently (`EXP-0008`).
9. **Read the numbers by medians and percentiles, never by averages** (`EXP-0011`), and remember the
   frame-generation multiplier: what the counter shows is displayed frames, real renders are that
   divided by the multiplier. Frame type is read from the owner's NVIDIA overlay, not from PresentMon
   (`EXP-0010`).
10. **Baseline to compare against** (night, same scene, 4K@144, DLSS Balanced, generation ~2x):
    latency p50 26.8 / p95 73.4 ms · displayed median 95.2 · 1% low 36.6 · GPU busy p50 6.7 / p95 33.5 ·
    CPU busy p50 6.4 / p95 37.7.

---

## Open bugs

*(none in the project's own code)* — the known defect worth filing when someone picks it up is the
packaging drift: `package.json` `"files"` omits `Deploy-ModPack.ps1`, so `npm i -g kumm` installs the
Nexus half without the deploy half (verified: `npm pack --dry-run` → 4 files, 15.2 kB).

Framework tickets (not this project's code, kept visible until an update retires them):
- 🟡 `bugs/KAIF/01_package_json_reformatted_wholesale.md` — the `kaif:*` wiring re-serializes the whole
  `package.json`; 24 of 31 diff lines are whitespace-only. Semantically empty, accepted locally, filed
  upstream as [KAIF#16](https://github.com/MikalaiKryvusha/KAIF/issues/16). Expect it again at the next
  `/kaif-update`.
- The install's own field report went upstream as
  [KAIF#17](https://github.com/MikalaiKryvusha/KAIF/issues/17); the placeholder-gate rake was a known
  signal and got a +1 observation on [KAIF#3](https://github.com/MikalaiKryvusha/KAIF/issues/3) rather
  than a duplicate ticket.
