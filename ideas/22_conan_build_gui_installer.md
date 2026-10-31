# Idea 22 — Conan build: a beautiful Windows GUI installer, later a self-updating launcher

> **Created:** 2026-10-31 · the owner's own idea, tossed in the chat during the «ОТЗЫВ» button run (verbatim below)
> **Parent:** plan 35 (the build turnkey, release 1.0.0) · today's installer — `install.cmd` + `install.ps1` written by `Deploy-ModPack.ps1 -Export`
> (`KUMM/Deploy-ModPack.ps1` ≈ lines 1297–1406, a console script)
> **Status:** 💡 2026-10-31 07:56 +03:00 — recorded; the owner's idea, so the direction is his; the LOOK is the taste class — mock-ups first
> **Outbound:** the mock-ups → the owner's eye (a review folder) before any code

## The owner's words (verbatim)

`[OWNER]` 2026-10-31 07:55–07:56: «еще будет здорово сделать для сборки GUI инсталятора красивый» · «окно виндовс» · «сфоном из нашей заставки» ·
«в будущем разовьем это до лаунчера, который сам умеет качать обновления себя и сборки» · 07:56 «пока просто визард простой установки сборки, сам
ее находит, сам устанавливает».

**Scope now (the owner, 07:56):** a simple wizard only — it finds the game itself and installs the build itself. The launcher is the later step.

## Goal vector (Achieve)

A player who unpacks the archive starts ONE file and sees a Windows window in the build's look instead of a console: the background from our intro
(`_config/branding/intro`, the wallpapers `_extras/Wallpapers`), both logos, the game folder found or picked, one button, a progress bar, a final
line. Later the same window grows into a launcher that updates itself and the build.

## Acceptance criteria (first step — the installer)

- Situation. A clean Windows 10/11 with the game at an unusual path; the archive unpacked.
  Action. The player double-clicks the installer.
  Result. A window (not a console) with the intro background and both logos; the game folder is found or chosen in a folder dialog; «Установить»
  installs; the window shows progress and «Готово» or the reason of a failure in Russian.
  Check. The run report frames at 1080p, 2K and 4K (plan 35 release gate), plus `-Verify` of the deployed folder: 0 missing.
- The installer does exactly what `install.ps1` does today — no second install logic (one source; the window is a face over it).
- No dependency the player must install first (Windows PowerShell 5.1 / .NET Framework WinForms or WPF are on every Windows 10/11).

## Open (to settle with mock-ups, not in code)

- Window look: size, where the logos stand, the button style (the «ОТЗЫВ» plate family?), fonts (Cardo / Forum / Cormorant SC — already in
  `_config/branding/fonts`).
- Later, the launcher: where updates come from (the build's release host), how it updates itself, what it shows (news, version, «Играть»). A separate
  plan when the installer is accepted.

## Decisions made without the owner

none yet
