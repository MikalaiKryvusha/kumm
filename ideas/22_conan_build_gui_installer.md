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

`[OWNER]` 2026-10-31 11:11 (tossed mid-task, during the «ОТЗЫВ» fix): «пусть в поставке игры будет наш exe лаунчер на будущее, и пусть ОТЗЫВ в нем
открывает красиво сообщение инструкцию для игрока, как и куда писать КРинику отзыв, и какую папку приложить» · 11:20 «сделаешь раздел со ссылками
автора в плейграунд и емейл мой».

**The launcher, as of 11:11–11:20:** an `.exe` in the build's delivery; its «ОТЗЫВ» opens a well-designed instruction for the player — how and where to
write to Krinik and which folder (the report zip) to attach; a section «Автор сборки» with the author's PlayGround page
and e-mail (both stand in the pack's `_config/player-report/collect-report.ps1`, `$AUTHOR_MAIL` and the closing lines — KUMM is public, the addresses stay there). Same look and DPI rules as the installer above.

**Launcher skeleton built [2026-10-31 15:46 +03:00]** (plan 35 G11 item 7): `ConanExiles/_config/launcher/KrinikConanLauncher.cs` → `bin/KrinikConanLauncher.exe` by
`_config/release/build-docs.py` — «Играть» (finds `ConanSandbox.exe` in its folder or up to 3 levels above), «Отзыв» (the instruction + «Собрать отчёт» running
`Собрать отчёт.cmd` beside it), «Автор сборки» from `author_links.txt` (same parser as the README), the version from `packVersion`; per-monitor DPI aware.
Its LOOK is a working draft in the guide's colours — the mock-ups below still decide it; not yet in the manifest's `extras` (the delivery waits for the look).

**The owner's look orders 2026-10-31 17:42** (on a frame of the skeleton): `[OWNER]` «я сказал в лаунчере на фоне наш волпейпер» · «без виндовского бордера и
кнопок» · «кастомная кнопка закрытия и сворачивания в стиле металла конана» · «бордер кастомный в стиле металла конана». The launcher is named
`KrinikConanLauncher` (17:34) and installs the build itself («Установить сборку», 17:37). Title as the guide: «Сборка модов Krinik Mod Pack 1.0.0 / для Conan
Exiles Enhanced 3.0.1», no repeated lines (17:21).

**The owner's layout pick 2026-10-31 18:22** — of the 10 mockups (recon `researches/conan-launcher-design/README.md`, pack `_config/launcher/mockups/mockups.html`):
`[OWNER]` «2, путь к игре над кнопкой, название вверх, ссылки вниз слева, кнопки в колонке справа, автор сборки - убрать заголовок» · «золотууууууую кайму и кнопки
не забудь от текущего лаунчера, углы у каймы не нужны». So: variant 2 (art on the whole window, darkening at the edges) — logos and the title at the top; a button column
at the bottom right: the game-path line, then «Играть», «Установить сборку», «Отзыв», «Удалить сборку»; the author links at the bottom left with no «Автор сборки»
heading; the current gold rod frame (no corner rivets) and the current metal plaque buttons and caption buttons. Mockup — variant 11 of `mockups.html`.
Open: the state-driven main button (asked 18:1x, no answer yet).

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
- **Readable at 1080p, 2K and 4K, DPI-aware, never pixelated, never tiny** (tossed by the owner mid-task 2026-10-31 09:31 +03:00, verbatim: `[OWNER]` «установщик сборки
  должен быть хорошо виден и на 1080 и на 2К и на 4К, и должен уважать выставленный в виндовс уровень масштаба интерфейсов, не превращаться в
  шакальные пиксели, и не быть слишком маленьким»). The installer SHALL declare per-monitor DPI awareness (PerMonitorV2) so Windows does not
  bitmap-stretch it; WHEN the Windows scale is 100 % / 150 % / 200 % / 300 %, the window SHALL size its layout, fonts and images by that scale (the
  owner's TV runs 300 %); images SHALL come from sources at least as large as the 4K × 300 % render (or vector), never upscaled small bitmaps.
  Check: frames of the window at 1080p 100 %, 2K 150 %, 4K 300 % — text height ≥ the Windows default UI text at that scale, no blurred edges on
  a 1:1 crop (owner's eye in a review folder). The same window also at **720p** — the owner, 09:31: `[OWNER]` «уважительное отношение ко всем
  разрешениям основным ряда соотношений 16 к 9 мы еще в свароге обсуждали» (the Svarog rule of 2026-10-09: 16:9 at 720p, 1080p, 2K, 4K — `MASTER_PLAN.md`;
  now `HOUSE_RULES.md` §1 rule 17 for everything we put on a screen). Numbers taken from the Svarog rulebook (`SvarogsDream/docs/UI_RULEBOOK.md`,
  read 2026-10-31 09:3x at the owner's «можешь поднять и почитать»): T1 — main text ≥ 36 px letter height on 4K (sofa target 52 px), i.e. ≥ 18 px at
  1080p, scaled with the resolution; T2 — contrast ≥ 4.5 : 1 (large text ≥ 3 : 1); principle 4 — the layout is dynamic, nothing set "in pixels" by hand;
  В9 — the same look at 1280×720, 1920×1080, 2560×1440, 3840×2160, frames as a 2×2 sheet. Meter: `python SvarogsDream/tools/textrows.py` (letter
  height), `SvarogsDream/tools/contrast.py` (WCAG).
- The installer does exactly what `install.ps1` does today — no second install logic (one source; the window is a face over it).
- No dependency the player must install first (Windows PowerShell 5.1 / .NET Framework WinForms or WPF are on every Windows 10/11).

## Open (to settle with mock-ups, not in code)

- **Decided by the owner:** the window has a copper-gold metal frame, like the Conan logos — `[OWNER]` 2026-10-31 09:33 «у окна инсталятора должна быть медно
  золотая обводка под металла, как в логотиапх конана». Source of the look: the game's logo `T_UI_ConanExiles_Enhanced_Logo` (our 3× master
  `conan-exiles-enhanced-logo-3x.webp`) — sample its metal gradient for the frame, drawn at the DPI scale (rule 17), never a stretched bitmap edge.
- Window look: size, where the logos stand, the button style (the «ОТЗЫВ» plate family?), fonts (Cardo / Forum / Cormorant SC — already in
  `_config/branding/fonts`).
- Later, the launcher: where updates come from (the build's release host), how it updates itself, what it shows (news, version, «Играть»). A separate
  plan when the installer is accepted.

## Decisions made without the owner

none yet
