# Test run report — the presence probe tells the agent's own input from foreign input

**Created:** 2026-11-14 23:38 +03:00 · **Run by:** the agent (claude-opus-5-5) · **Version/build:** `D:/work/ai_sandbox/_tools/owner-idle.ps1` (new `-MarkOwn`, own-input
check), `ConanExiles/_config/mouse-seq.ps1` and `input.ps1` (call `-MarkOwn` after sending) — uncommitted

## 1. Work

The owner, 2026-11-14 23:23: «я не на клавиатуре. я к омп час неприкосался» — while the probe kept answering BUSY and refused real-input tests. Measured the
same minute: (a) the agent's own `mouse-seq.ps1` input reset `GetLastInputInfo`, so every second sequence within 10 s was refused (23:12, 23:16, 23:20);
(b) a foreign input arrives every ≈ 45–50 s with nothing between (23:23:48, 23:24:33, 23:25:23) — the remote-access hosts Parsec (`parsecd`) and Sunshine
(Apollo) run on the machine. The fix covers (a); (b) is recorded as a measured fact (≤ 10 s of BUSY in every ≈ 50 s).

## 2. Contour

The owner's machine, his session, the running background game (PID 29760, 3.1.0); `owner-idle.ps1` called as the hook `owner-presence.mjs` and both input
tools call it. REAL WORLD: accumulated — his live session with the remote-access hosts running; data and machine — his PC; path — the tools as the agent runs them.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-11-14 23:23:54–23:24:20 +03:00 | `owner-idle.ps1` × 8, 3 s apart, no input of ours | BUSY 5.4 / 9.0 s, then FREE — one foreign input at ≈ 23:23:48 |
| 2 | 2026-11-14 23:24:52–23:25:50 +03:00 | `owner-idle.ps1` × 30, 2 s apart | foreign inputs at ≈ 23:24:33 and 23:25:23 only |
| 3 | ≈ 2026-11-14 23:36 +03:00 | `owner-idle.ps1` → `mouse-seq.ps1 -Seq "kdown:0x7E,kup:0x7E,wait:200"` → `owner-idle.ps1` → `mouse-seq.ps1` (same) → `owner-idle.ps1` | FREE 40.0 s · exit 0 · FREE 1.2 s «the last input was the agent's own» · exit 0 (before the fix: exit 5) · FREE 1.2 s own |
| 4 | 2026-11-14 23:37:06–23:37:59 +03:00 | `owner-idle.ps1` × 16, 3 s apart (control) | foreign inputs at ≈ 23:37:03 and 23:37:53 → BUSY (not taken for own); FREE between |

## 4. Checks

Hygiene: NONE (no unit test for the PowerShell probe; the hook's own suite stubs the probe)
Functional run: the real tools on the owner's machine — two real-input sequences back to back (run 3) and the foreign keep-alive inputs (runs 2, 4); the probe's
lines READ each time

| Case | Status | Observation |
|---|---|---|
| own input right after a sequence → FREE | pass | run 3, «the last input was the agent's own» |
| a second sequence within 10 s is sent | pass | run 3, exit 0 (refused with exit 5 at 23:16 and 23:20 before the fix) |
| a foreign input after our mark → BUSY | pass | run 4, 23:37:03 and 23:37:53 |
| `input.ps1` marks its own input | not run | the mark is at the end of the script; no `input.ps1` send in this run |

**Added 2026-11-15 00:08 — the focus proof of `mouse-seq.ps1`:** after the owner's remote session closed (≈ 23:55, the keep-alive stopped) the foreground
stayed with `ShellExperienceHost`; the tool's RMB still reached the full-screen game under the cursor, but its keys went to the shell (23:47–23:52: keys 3 / 4
«did nothing»). Now the tool sends nothing unless the game window IS the foreground: run `mouse-seq.ps1 -Seq "kdown:0x7E,kup:0x7E,wait:200"` with the shell in
front → «GAME NOT IN FRONT: … nothing sent», exit 6 (seen 00:08). The send path with the game in front — not re-run after this edit.

## 5. Found

- the agent's own input was read as the owner's presence (fixed here);
- the remote-access hosts send one input every ≈ 50 s (measured, not filtered: the probe still answers BUSY for ≤ 10 s after each).

## 6. Traces

Probe lines in this chat's transcript (`85089563…jsonl`); the stamp `D:/work/ai_sandbox/_tools/agent-input-tick.txt`.

## 7. Verdict

partial — the own-input path and the foreign-input control pass on the real machine; `input.ps1`'s mark not exercised in this run.
