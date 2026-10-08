# Recon — the owner's Simple MMO bot as the pattern for a game pilot «by anchors»

> **Created:** 2026-10-08 · **Parent:** plan `plans/17_md_anchor_pilot.md`, step 17.1; `[OWNER]` «как я делал с симпле
> мморпг, найдешь в моем GH» (chat, 2026-10-08 ≈09:53) · **Status:** 🔬 read 2026-10-08 10:40 (README + `main.py` outline) ·
> **Outbound:** —

Source: `github.com/MikalaiKryvusha/SMMO_automation` (README; `main.py` 1316 lines, `mail.py`; `images/` — button, title,
error and captcha templates). Read with `gh api …/contents/main.py`; function outline by grep, bodies not studied line by
line.

## What the bot does (as read)

- **Anchor = a picture** of a button, a screen title, a breadcrumb or an error toast (`images/attack_button.png`,
  `jobs_title.png`, `chats_breadcrrumb.png`, `failed_quest_toast.png`…), found with `pyautogui.locateOnScreen(image,
  confidence=…, region=…)`; the region narrows the search to a known part of the screen (travel area, control panel).
- **Primitives:** `wait_until_appears(image, init_conf, limit, sleep_time)`, `wait_and_click(image, timeout, int_conf,
  sleep_time, conf_lowering_step=0.02, delay_befor_click)` — the confidence is LOWERED step by step until the anchor is found
  or the time is out; `check_if_there_is_no(image, timeout)`; `wait_until_one_of_few_appears_and_return_it_name(images_list,
  …)` — «which of the known screens is this»; `scroll_page_down_until_see(image)`.
- **State → scenario:** `special_events_detection` names the current event by which anchor is visible (wave, catch, chop,
  salvage, mine, attack, item found, machine check), the main loop dispatches `battle_scenario`, `mining_scenario`,
  `wave_scenario`, `message_scenario`, `machine_error_scenario`, `do_quest_func`, `do_job`.
- **Errors are states too:** machine-error and hold-up crosses have their own templates and recovery buttons
  (`failure_machine_error_retry_button.png`, `battle_hold_up_close_cross.png`).
- **Call a human** when stuck (captcha): screenshot, voice (`gTTS` / `pyttsx3`, mp3 quotes) and an SMTP mail.
- **Statistics of delays:** response times and error rates with variance / moving deviation pick the wait intervals.
- **Telemetry:** Tkinter dashboard of the steps, `log.dat` duplicate of the console.

## What carries over to Medieval Dynasty (plan 17)

| Bot's practice | In our pilot |
|---|---|
| picture anchor + `locateOnScreen` | PRIMARY anchor = the game's widget by class and function through UE4SS (no focus, no pixels); picture anchor = fallback (OpenCV template on the HDR frame we already grab) — the owner's «если якори быстро читать не умеешь, то на Open CV» |
| `wait_until_appears` / `wait_and_click` with timeout | step `wait <Class> [sec]` → `call <Class> <Function>`; every step logged with time and result |
| «which of few screens» | `which <ClassA|ClassB|…>` — the visible top widget names the state (main menu, load list, Solo/Co-op, loading, world) |
| errors as states with recovery | known blocking windows (Epic offline window, «load old save?» `UI_LoadSaveAcceptation_C`) get their own step |
| call a human when stuck | voice line (`voice_say.py`) + a chat line; the owner's machine, not mail |
| delay statistics | measured step durations go to the log; waits come from them, not from guesses |

## Caveat the owner wrote himself

The bot broke the Simple MMO ToS and the account was banned (README disclaimer). Medieval Dynasty is single-player and the
pilot drives the owner's own copy for testing mods — no third party's rules are involved.
