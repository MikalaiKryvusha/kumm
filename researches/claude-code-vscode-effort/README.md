# Research — why the effort setting vanished from the Claude Code VS Code extension

> **Created:** 2026-10-30 · **Parent:** owner's request 2026-10-30 · **Status:** web recon done; machine checked and the `model` key fixed 2026-10-30 07:59 — the panel not yet seen by eye · **Outbound:** —

## Most likely causes, ranked

1. **The `[1m]` model-id regression in extension 2.1.311 / 2.1.312 (open, not fixed in 2.1.314).**
   Release dates: 2.1.310 on 2026-10-23, 2.1.311 on 2026-10-26, 2.1.312 on 2026-10-27, 2.1.314 on 2026-10-30 (`gh release list`).
   The 2.1.311 changelog says: "Changed model names and IDs to drop the `[1m]` suffix and its label on models where the suffix has no effect; the suffix is still accepted" (https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md).
   If the `model` setting is `opus[1m]` or `sonnet[1m]`, the webview looks the model up by exact string match and finds no row. It then treats the model as not supporting effort. The Effort row and the Ultracode switch disappear from the `/` command menu, and the model pill shows no level. Effort is still applied: `CLAUDE_EFFORT` in Bash still shows the saved level. The `opus` setting itself can turn into `opus[1m]`: the reporter of #105607 says the CLI migration `migration_opus_to_opus1m` rewrites `opus` to `opus[1m]` for eligible accounts.
   - #105607 "VS Code extension: Effort and Ultracode controls missing for `[1m]` model selections (`opus[1m]` since 2.1.311)", opened 2026-10-28, OPEN, labels bug/area:ide/platform:vscode. It names 2.1.310 as the last working version and has confirmations on Linux and macOS. https://github.com/anthropics/claude-code/issues/105607
   - #105828 "VS Code extension hides the Effort control when the model setting is `opus[1m]`", opened 2026-10-29, OPEN, has repro. https://github.com/anthropics/claude-code/issues/105828
   - #105555 "bare /effort only prints usage instead of opening the Effort picker", opened 2026-10-28, OPEN. A commenter there describes the same missing slider. https://github.com/anthropics/claude-code/issues/105555
   - No maintainer has replied on any of these yet. The 2.1.314 changelog has no fix for this.
2. **The effort-unsupported latch (the extension decides the server refused effort).** #105828 mentions the extension log line "[effort] the server refused effort" as a separate state that hides the control. I found no issue describing that state in detail.
3. **Fallback to a model without effort support at a usage limit.** The Effort row vanishes instead of being greyed out. A new chat or Developer: Reload Window brings it back. This is #68088, opened 2026-06-12, on Windows 11, closed 2026-07-25 as stale and never fixed. https://github.com/anthropics/claude-code/issues/68088
4. **A model that does not support effort is selected.** The docs say the Effort row shows only "when the current model supports effort levels" and needs v2.1.257+ (https://code.claude.com/docs/en/vs-code). Supported models are Fable 5.1/5, Opus 5.5/5/4.8/4.7, Sonnet 5.5/5, Haiku 5.5, and Opus/Sonnet 4.6 (https://code.claude.com/docs/en/model-config).

## Workarounds (each from a source)

- In `~/.claude/settings.json`, change `"model": "opus[1m]"` to `"model": "opus"`, then open a new session (#105607). For Opus 5.5 the suffix has no effect anyway, since it has 1M context natively.
- In the panel, pick any other model and then pick Opus 5.5 again. This writes `"model": "opus"`. Re-clicking the model that is already checked does not help (#105607, comment of 2026-10-28).
- Typing `/model opus` brings the control back (#105828).
- Launching with `ANTHROPIC_MODEL=opus` does NOT help (#105607, comment of 2026-10-29).
- You can set effort without the slider:
  - `/effort <low|medium|high|xhigh|max|auto>` with a level works. A bare `/effort` only prints the usage line in the extension (#105555).
  - `modelSettings.<model>.effortLevel` in user settings, or `effortLevel`. `max` is not accepted in either key. A top-level user `effortLevel` is ignored for Opus 5.5 (model-config docs).
  - The env var `CLAUDE_CODE_EFFORT_LEVEL` overrides everything, but the extension label ignores it (#99121).
- Downgrade the extension to 2.1.310, the last working version per #105607.
- For cause 3: open a new chat or run Developer: Reload Window (#68088).

## What to check on the machine

1. The extension version (`anthropic.claude-code`). 2.1.311 or later means cause 1 can apply.
2. The `model` key in `~/.claude/settings.json` and in the project's `.claude/settings.json` / `settings.local.json`. Any `[1m]` suffix means cause 1.
3. The extension's Output log, searched for "[effort] the server refused effort" (cause 2).
4. Whether a usage limit or fallback happened in that session (cause 3), and which model the pill names (cause 4).

## Not confirmed

- I found no reproduction or report on Windows for cause 1. All reports are from macOS and Linux, but the code path is in the shared webview.
- #105607 also saw the symptom in a Fable 5.1 session, and its reporter could not explain it. A `fable[1m]` setting does not reproduce it.
- There is no maintainer response, no fix date, and no fix in 2.1.314.
- I found no Reddit or X threads from the last two months on this symptom. Searches returned only older GitHub mirrors.
- I don't know whether the `migration_opus_to_opus1m` migration re-adds `[1m]` after the manual workaround.
- The owner's actual settings and extension version were not read: this was a web-only task (done below, by the main session).

## This machine, checked 2026-10-30 07:59 +03:00

| Probe | Value | Verdict |
|---|---|---|
| Extension folder in `%USERPROFILE%\.vscode\extensions` | `anthropic.claude-code-2.1.314-win32-x64` (updated 2026-10-30 07:37) | inside the affected range (2.1.311+) |
| `model` in `%USERPROFILE%\.claude\settings.json` (→ `F:\Claude\.claude`) | `"opus[1m]"` | cause 1 matches exactly |
| Project `.claude/settings.json`, `settings.local.json` | no `model` key | — |
| `CLAUDE_CODE_EFFORT_LEVEL`, `ANTHROPIC_MODEL` | not set | — |
| Effort keys | top-level `effortLevel: "xhigh"`; `modelSettings.claude-opus-5-5.effortLevel: "high"` (per the model-config docs the per-model key wins for Opus 5.5) | the level in force for Opus 5.5 is `high`, not `xhigh` |

**Fix applied 2026-10-30:** `"model": "opus[1m]"` → `"opus"` in the user settings (backup in the session scratchpad,
`user-settings.backup-2026-10-30.json`). Safe for the context window: the changelog says "Added Claude Opus 5.5 (`claude-opus-5-5`),
now the default Opus model — 1M context" — the suffix adds nothing on Opus 5.5. Takes effect in a NEW session or after
"Developer: Reload Window". Not yet seen by eye: whether the Effort row is back in the extension's panel. Watch: the CLI migration
`migration_opus_to_opus1m` may write `opus[1m]` back (#105607) — if the row vanishes again, re-check this key first.
