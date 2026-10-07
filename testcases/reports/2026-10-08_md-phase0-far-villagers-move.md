# Test run report — Medieval Dynasty фаза 0: жители чужих деревень вдали от героя стоят

**Created:** 2026-10-08 01:25 +03:00 · **Run by:** агент (Claude Opus 5.5) · **Version/build:** Medieval Dynasty 2.7.0.3,
UE4SS 1161; пак: `KrinikBridge` v4 (`snap`/`moved`), `KrinikProbe` v2, `KrinikFastStart` v4

## 1. Work

Вторая половина шага 0.2 плана `plans/16_epic15_phase0_recon_and_stand.md`: двигаются ли жители чужих деревень, пока героя
нет рядом. Кейсы — `testcases/TC_md_phase0_far_villagers_move_2026-10-08.md` (C1–C5). Основа — жалоба игроков из
`researches/medieval-dynasty/web-recon.md` §B.1 («NPCs have always started to move when the character came close») и
вопрос мета-плана «мост ведёт готовых жителей».

## 2. Contour

Машина и сейв владельца («Быстрое сохранение», Оксбоу), герой у себя в деревне, клавиш не нажимали. REAL WORLD:
accumulated — его сейв; data and machine — его машина; path — его запуск игры (быстрый старт) и меню загрузки. Сейвы после
прогона совпали с копией `D:\Games\Medieval Dynasty Mods\_save-backup\2026-10-08_0045\` (48 .sav, sha256).

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-10-08 01:22 +03:00 | раскатка пака, запуск, «Загрузить игру» → F → F → «Начать игру» | карта Оксбоу за 5.19 с |
| 2 | 2026-10-08 01:23 +03:00 | `in.txt`: `snap BP_NPC_Multi_Village_C`, `snap BP_NPC_C`, `snap BP_PlayerCharacter_C` | запомнено 97 / 184 / 1 |
| 3 | 2026-10-08 01:24 +03:00 | `moved …` ×3 (через 41 с) | чужие 0 из 97; все NPC 68; герой 0 |
| 4 | 2026-10-08 01:24 +03:00 | `moved …` ×3 (через 64 с) | чужие 0 из 97; все NPC 72 (до 101 м); герой 0 |
| 5 | 2026-10-08 01:25 +03:00 | `CloseMainWindow` + `sha256sum` сейвов | закрыта за 5 с; сейвы целы |

## 4. Checks

Hygiene: стенд моста 15/15 (`tools/test-bridge.lua`), мутант порога движения краснеет.
Functional run: игра и сейв владельца; прочитаны `out.txt` моста и `probe.txt` зонда. C1–C5 pass.

## 5. Found

- **Жители чужих деревень вдали от героя заморожены:** за 41 и 64 с реального времени (≈20 и ≈40 игровых минут) из 97
  `BP_NPC_Multi_Village_C` не сдвинулся ни один, сдвиг ровно 0 см; ближние NPC за то же время сдвинулись (68 → 72, до 101 м).
  Это механизм «пустого мира», который игроки видели глазом.
- **Часы игры:** игровая минута = 2 реальные секунды, игровой час = 120 с, сутки = 48 мин (`village.minute` #1 → #10 за 18 с).
  Прошлый вывод «минутный хук молчит» — ложная тревога, исправлен в отчёте `2026-10-08_md-hdr-intro-faststart-probe.md`.

## 6. Traces

`ue4ss/Mods/KrinikBridge/out.txt`, `ue4ss/Mods/KrinikProbe/probe.txt` (машина владельца, вне git).

## 7. Verdict

pass — на Оксбоу при герое дома жители чужих деревень есть в памяти (97) и стоят неподвижно; дальность, на которой они
«оживают», не мерилась.
