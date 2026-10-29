# TC — quick batch: «XP :» thin space; KrinikOblivionLocomotion and KrinikFpsCounter on events (plan 36 W5a; plan 34 / W16)

> **Created:** 2026-10-29 · **Parent:** plan 36 W5 (a) (`[OWNER]` «XP и двоеточие слиплись» · 2026-10-28), plan 34 W16 (`[OWNER]` «да, но аккуратно. чтобы
> не сломать... нужно будет ретестировать после рефакторинга их» · 2026-10-29); order `[OWNER]` «сразу делаем много мелочей, что быстро делается и быстро тестируется» · 2026-10-29
> **Status:** run 2026-10-29 15:34–15:39 — all 9 pass (report `testcases/reports/2026-10-29_conan-quick-batch-xp-locomotion-fps.md`); finding: the hero's
> Agility (and every int stat 14–40) reads 0 in 3.0.1
> **Outbound:** —

**Basis.**
- XP: `Game.locres` entry `CD5B0E18…` «XP: {xpCurrent}…» → «XP{U+2009}: {xpCurrent}…» (`_config/devkit/locres-set-tr.py`, regress: 0 lost, 1 changed);
  source — KUMM interview #003 rows 299–300.
- `KrinikOblivionLocomotion` 0.3.0: the hero is cached; a scene search (`FindAllOf BasePlayerChar_C`) only after the event
  `NotifyOnNewObject(/Game/Characters/BasePlayerChar.BasePlayerChar_C)` or at mod start; `BP_ServerSettings_C` found once per world; the 1 s step reads
  only Agility of the cached hero. Counters in the minute report: «событий «новый герой» N, поисков героя по сцене M».
- `KrinikFpsCounter`: the counter is attached on `NotifyOnNewObject(W_NewHealthUI_C)` (+0.5 s); `PlayerController` cached; the 250 ms step has no scene search.

**Stand.** The owner's save, beach spot of the previous runs, 4K full screen, fresh launch, game in the background; re-entry by the agent (Esc by real input
after the owner's input idle — `_config/esc-when-idle.ps1`, then `CloseAndReturnToMainMenu` by the remote). No enemies needed. Techniques: state
transitions (fresh entry → re-entry), log reading, frame reading.
Not covered: death and respawn (the re-entry gives a new hero object by the same event path); Agility change by gear (the 1 s read is unchanged code).

| # | Case | Steps | Expected | Status |
|---|---|---|---|---|
| X1 | XP label with a gap | world entry, 4K frame of the HUD top | «XP» and «:» do not touch; the colon stands a thin gap after «P»; no box glyph | pass 15:36 — 4K frame: «XP : 119,43k / 119,51k (81)», a thin gap after «P», no box glyph |
| L1 | Locomotion subscribes | launch, `UE4SS.log` | «событие «новый герой» (…): подписано», «загружен 0.3.0» | pass 15:34:43 — both lines |
| L2 | Locomotion applies on entry | enter the world, log | «герой появился: Проворство N → бег …» once, `MaxWalkSpeed` logged | pass 15:35:42 — «герой появился: Проворство 0 → бег 450 …», `MaxWalkSpeed` 450.0 a second later (Agility 0 — the finding below) |
| L3 | No scene search while playing | minute report «СЧЁТ #k» after ≥ 2 min in the world | «поисков героя по сцене» does not grow between two reports while in the world (only entry/re-entry add) | pass 15:35:43–15:38:43 — reports #1–#3: «поисков героя по сцене 2» unchanged (mod start + entry event; the old code searched every second, ≈ 180 in 3 min) |
| L4 | Re-entry gives a new hero by the event | re-enter, log | event count grows, «герой появился» again with the new object, apply line present | pass 15:38:20 — new hero `BasePlayerChar_C_2147431996` (was `…2147460400`), natives re-read, «герой появился» again |
| L5 | Jump still raised | jump by the remote/real key, minute report | «прыжков героя» grows | pass 15:38:39 — `h:Jump()` by the remote → report #4 «прыжков героя 1» |
| F1 | FPS counter on entry by the event | log + frame top-right | «счётчик поставлен на HUD … (событие создания)», a number at the top-right corner | pass 15:35:44 — `W_NewHealthUI_C_2147458933`; frame: «61» top-right |
| F2 | FPS counter after re-entry | re-enter, log + frame | a NEW HUD name in the log, the number shown again | pass 15:38:22 — new HUD `W_NewHealthUI_C_2147430689`; frame: «60» top-right |
| G1 | No crash, no new errors | whole run, `UE4SS.log` grep «упал\|ОШИБКА\|Error» for our mods | none from KrinikOblivionLocomotion / KrinikFpsCounter | pass — 0 lines «упал/ОШИБ/не смог» of both mods; closed cleanly 15:39, no crash reporter |

**Finding (not a regression of this edit).** `GetIntStat(19, 0)` — and every id 14–40 — returns 0 on the owner's level-50 hero (remote, 15:36;
ids 0–8: 199, 195, 4, 354, 50, 99, 99, 100, 100). The 3.0.1 move test (`TC_conan_3.0.1_pereezd_2026-10-25.md`, R1) recorded the same «Проворство 0»
and passed it. Either the hero's attributes are really 0 (a 3.0 attribute reset — `ConanCharacter.ShowAttributeResetNotification` exists;
`IsAttributeVersionUpToDate` = true) or 3.0.1 keeps attributes elsewhere — then the Agility law of `KrinikOblivionLocomotion` does nothing in the build.
Next: read the attribute values in the character window and compare (KUMM plans/36, W16 row).
