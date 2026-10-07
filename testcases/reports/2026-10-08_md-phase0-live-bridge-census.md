# Test run report — Medieval Dynasty, фаза 0 живой прогон: мост и перепись жителей

**Created:** 2026-10-08 00:54 +03:00 · **Run by:** агент (Claude Opus 5.5) · **Version/build:** Medieval Dynasty 2.7.0.3,
UE4SS 1161, `KrinikBridge` v1 (пак `18bbe9e`), движок KUMM с починкой `1a1dd3a`

## 1. Work

Шаги 0.1 (мост в игре) и 0.2 (живы ли дальние жители в памяти) плана `plans/16_epic15_phase0_recon_and_stand.md`.
Набор кейсов — `testcases/TC_md_phase0_live_bridge_census_2026-10-08.md` (C1–C9). Основа — карт-бланш владельца на игру
(2026-10-08 ≈00:44) и вопрос мета-плана «ведём готовых жителей или спавним».

## 2. Contour

Машина и установка владельца; сейв владельца «Быстрое сохранение» (карта Оксбоу, версия сейва 2.2.0.8). Перед прогоном
сейвы и конфиги скопированы в `D:\Games\Medieval Dynasty Mods\_save-backup\2026-10-08_0045\`. REAL WORLD: accumulated — его
сейвы и настройки; data and machine — его машина, его установка; path — его запуск игры и его меню загрузки; после
прогона сейвы и настройки сверены с копией — без изменений.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-10-08 00:45 +03:00 | `Deploy-ModPack.ps1 -Deploy -PackDir <pack>` | ok · 2/2 мода; лишний `Mods\PalModSettings.ini` → дефект движка, починен, повтор чист |
| 2 | 2026-10-08 00:46 +03:00 | `Start-Process Medieval_Dynasty.exe` + `in.txt: where` | мост загрузился; в меню `0 0 0` |
| 3 | 2026-10-08 00:52 +03:00 | меню: «Загрузить игру» → «Соло» → «Начать игру» (`tools/keys.ps1`, `tools/mouse.ps1`) | `LoadMap MP_Map/Map_Persistent_Multi` 5.36 с |
| 4 | 2026-10-08 00:53 +03:00 | `in.txt`: `where`, `count …` ×11, `get …` ×2 | ответы в `out.txt` (ниже) |
| 5 | 2026-10-08 00:54 +03:00 | `CloseMainWindow` + `sha256sum` сейвов, `diff` настроек | закрыта за 5 с; всё совпало |

## 4. Checks

Hygiene: NONE в этом прогоне (стенд моста — отчёт `2026-10-08_md-phase0-offline-bridge-stand-and-tick-bench.md`).
Functional run: игра запущена и загружена путём владельца; прочитаны `UE4SS.log`, журнал игры, `out.txt` моста и снимки
экрана HDR-путём (`SvarogsDream/tools/shot-hdr.ps1` + `hdr2webp.py`; GDI-снимок HDR-стола выходит блёклым и терял окно).

- C1 pass · C2 pass · C3 **fail** (в меню есть пешка) · C4 pass · C5 pass (20340 50436 4451) · C6 pass · C7 pass
  (`BP_NPC_C` 184: `BP_NPC_Multi_Village_C` 97, `BP_NPC_Bard_C` 3; `BP_BaseCharacter_C` 185; `Population` 80) · C8 pass
  (`TimeMultiplier` 1.0) · C9 pass.

## 5. Found

- **Дефект движка KUMM:** раскатка клала `Mods\PalModSettings.ini` в папку любой игры без `modsDir` — починен, `EXP-0176`.
- **Признак «мир загружен» в мосте неверен:** в главном меню Medieval Dynasty есть пешка (`where` → `0 0 0`). Чинить:
  ждать `BP_PlayerCharacter_C`.
- **Открыто:** `BP_Building_House_C` 0 и `BP_POI_Bandits_C` 0 в памяти при 50 и 35 в файле уровня Оксбоу — игра,
  видимо, заменяет их при загрузке другими классами; точек спавна зверей 603 против 604 в файле.
- **Замечание владельца во время прогона:** `[OWNER]` «что-то с HDR, тускло словно» · 2026-10-08 ≈00:48 — тусклая картинка
  игры на HDR-телевизоре; не разбиралось (вне задачи прогона), в беклог.

## 6. Traces

`<GAME>\Medieval Dynasty\Medieval_Dynasty\Binaries\Win64\ue4ss\UE4SS.log` и `...\ue4ss\Mods\KrinikBridge\out.txt` (машина
владельца, вне git); снимки — scratchpad сессии; копия сейвов — `D:\Games\Medieval Dynasty Mods\_save-backup\2026-10-08_0045\`.

## 7. Verdict

partial — мост работает в игре и перепись дала главный ответ фазы 0: **при герое дома в памяти живут 97 жителей чужих
деревень Оксбоу** (и 80 своих); контроль C3 упал — признак загрузки мира в мосте надо сменить.
