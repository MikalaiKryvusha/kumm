# Research — Conan 3.0.1: what the engine does inside a hitch frame (per-hitch ETW profile)

> **Created:** 2026-11-09 · **Parent:** the owner's question 2026-11-09 19:39 «можно будет профайлером померить фризы? найти бутылочное горлышко - что делает движок в
> моменты фризных кадров» · **Status:** method written 2026-11-09 19:57; first try (WPR `CPU+GPU`, 19:41) dropped 5 038 727 events in a 23 GB file — void, deleted ·
> **Outbound:** the per-hitch table → the owner (chat)

## Goal vector (Achieve)
For every frame ≥ 50 ms of a `krinik-show` flight: which thread held it (game thread, render thread, RHI, workers, driver) and in which module (the game exe,
`nvwgf2umx.dll`, `ntoskrnl.exe` file I/O, `UE4SS.dll` / our Lua), so the next quick win targets the real bottleneck instead of a guess.
Acceptance: a table «hitch time · duration · top thread · top modules with sample share» for ≥ 20 hitches of one flight, from a trace with 0 lost events (or the
loss stated and below 1 %).

## What is already known (do not repeat)
- `researches/conan-main-thread/README.md` §2А: one whole-flight WPR (`wpr -start CPU`) — 6 GB / 3 min, 71 508 events lost; by module over the whole flight: exe 57 %
  of the game, NVIDIA driver 15 %, kernel 14 %, `UE4SS.dll` 3.4 %. No per-thread, no per-hitch split. `xperf` needs `-tle` when events were lost, or it prints nothing.
- The Shipping exe has no PDB: functions inside the exe are not named (module level only); Windows and NVIDIA modules resolve through the MS symbol server.
- `stat` commands and Unreal Insights are compiled out of this build (§2 of the same file).

## Method (one flight, ≈ 60 s of capture to keep the file small)
1. Kernel logger with big buffers, sampled profile at 1 ms + context switches with stacks:
   `xperf -on PROC_THREAD+LOADER+PROFILE+CSWITCH+DISPATCHER -stackwalk Profile+CSwitch+ReadyThread -BufferSize 1024 -MinBuffers 512 -MaxBuffers 2048 -f <k.etl>`
2. A user session for the frames (present events only):
   `xperf -start kumm-present -on Microsoft-Windows-DXGI+Microsoft-Windows-DxgKrnl:0x1 -BufferSize 1024 -MinBuffers 64 -f <u.etl>`
3. The flight (`bench-flight.sh krinik-show <label>`), then `xperf -stop kumm-present -stop -d <merged.etl>`.
4. Hitches from the SAME trace: `PresentMon --etl_file <merged.etl> --process_name ConanSandbox-Win64-Shipping.exe --output_file <p.csv>` → frames ≥ 50 ms with their
   start time (alignment with xperf's µs clock checked on the first frame before trusting it).
5. Per hitch: `xperf -tle -i <merged.etl> -a profile -detail -range <T1> <T2>` (modules) and `-a activityintervals -thread -range <T1> <T2>` (threads).

## Gaps
- Alignment of PresentMon's frame times with xperf's `-range` clock — to be checked on the trace (step 4).
- Function names inside the exe are not available; a hot exe region can only be named by address range.
