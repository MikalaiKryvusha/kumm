# Test run report — Medieval Dynasty: HDR, без заставок, быстрый старт, зонд часов

**Created:** 2026-10-08 01:18 +03:00 · **Run by:** агент (Claude Opus 5.5) · **Version/build:** Medieval Dynasty 2.7.0.3,
UE4SS 1161; пак `MedievalDynasty`: `tools/hdr.py`, `tools/intro.py`, `KrinikFastStart` v4, `KrinikProbe` v1, `KrinikBridge` v3

## 1. Work

Слова владельца: `[OWNER]` «тускло игра отображается!!! хдр сломан!» · «нужно чинить настройки графики!» (≈00:58) · «убери
вступительные ролики все, пусть игра максимально быстро запускается без роликов» (≈01:03). И шаги 0.3 и 0.4 плана
`plans/16_epic15_phase0_recon_and_stand.md`. Кейсы — `testcases/TC_md_phase0_probe_and_hdr_world_2026-10-08.md` (C1–C8).

## 2. Contour

Машина, установка, настройки и сейв владельца («Быстрое сохранение», Оксбоу). Копия сейвов и конфигов —
`D:\Games\Medieval Dynasty Mods\_save-backup\2026-10-08_0045\`. REAL WORLD: accumulated — его сейвы и конфиги; data and
machine — его машина и HDR-телевизор; path — его запуск игры. Изменено в его мире: `GameUserSettings.ini`
(`bUseHDRDisplayOutput=True`), `Engine.ini` (`[SystemSettings] r.AllowHDR=1`), 4 файла заставок `.bk2` → `.bk2.off`,
3 мода UE4SS. Сейвы — без изменений (sha256).

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-10-08 00:57 +03:00 | запуск без UE4SS (`dwmapi.dll` → `.off`), HDR-кадр меню | p99.5 324 нит — как с UE4SS: UE4SS не виноват |
| 2 | 2026-10-08 00:59 +03:00 | правка двух конфигов (HDR on), запуск, HDR-кадр меню | журнал «HDR output is supported»; p99 266 → 798 нит |
| 3 | 2026-10-08 01:04 +03:00 | `python -I tools/intro.py off`, запуск | Map_MainMenu через 5 с (было 15) |
| 4 | 2026-10-08 01:07–01:14 +03:00 | `KrinikFastStart` v1→v4, запуск без нажатий | v4: меню через ~6 с, окна Epic нет |
| 5 | 2026-10-08 01:15–01:18 +03:00 | загрузка сейва (атомарно, со снимком на шаг), зонд `KrinikProbe` | 9 хуков; `village.load`, `npc.timeofday`; минутный — нет |
| 6 | 2026-10-08 01:18 +03:00 | контроль: `KrinikFastStart/enabled.txt` → `.off`, запуск | заставка и окно Epic снова ждут клавишу |

## 4. Checks

Hygiene: `luac -p` всех модов; стенд моста `tools/test-bridge.lua` 12/12, старый v1 на нём краснеет.
Functional run: игра запущена путём владельца шесть раз; прочитаны `UE4SS.log`, журнал игры, `probe.txt`, сырые HDR-кадры
(`tools/hdr-stats.py`) и снимки после тон-маппинга. C1 pass · C2 pass · C3 **fail** (минутный хук молчит) · C4 pass ·
C5 pass · C6 pass (v4) · C7 pass · C8 pass.

## 5. Found

- Тусклость — SDR-вывод самой игры (`bUseHDRDisplayOutput=False`, `r.AllowHDR` нет в конфигах игры), не UE4SS.
- Заставки при запуске — 4 отдельных файла `Content/Movies/*.bk2` (AsyncLoadingScreen): переименование экономит 10 с.
- «Нажмите любую кнопку» и окно Epic — состояния `UI_MainMenu_C`, а не отдельные виджеты (`UI_IntroScreen_C` в памяти нет):
  v1–v3 мода искали не там; v4 — `AnyKey(SpaceBar)` + `DestroyEosLoggingWindow`.
- `BP_VillageManager:OnTimeUpdate` — таймер 10 Гц; `OnMinuteUpdate` за ~110 с не сработал — открыто.
- Инструменты снимка жмут Alt, а Alt в игре — «Режим проверки»: подписи на экране переключаются при каждом снимке.
- В HDR белый интерфейс и арт загрузки упираются в пик ТВ (798 нит) — может резать глаз; вкус владельца.

## 6. Traces

`ue4ss/UE4SS.log`, `ue4ss/Mods/KrinikProbe/probe.txt`, журнал игры `%LOCALAPPDATA%\Medieval_Dynasty\Saved\Logs`; сырые кадры
и снимки — scratchpad сессии; пак — коммиты `9fb7731`, `0a2e5f4`, `76597ae`, `57ac5c5`.

## 7. Verdict

partial — HDR включён и измерен, заставок нет, быстрый старт работает и проходит контроль; вкус HDR — за владельцем
(вердикт не получен); минутный такт деревни не пойман зондом.

## Поправка 2026-10-08 01:24

Вывод «`village.minute` молчит — открыто» (C3, раздел 5, вердикт) **неверен**: зонд v1 писал каждый 60-й вызов, а игровая минута длится 2 реальные секунды — 60 вызовов набираются за 120 с, а смотрели ~110 с. Зонд v2 (первый и каждый 10-й вызов) в 01:23 увидел `village.minute` #1 и #10 за 18 с — отчёт `2026-10-08_md-phase0-far-villagers-move.md`. C3 следует читать как **pass с поправкой**: минутный хук работает.

## Поправка 2026-10-08 09:35

Вывод «HDR включён, p99 меню 266 → 798 нит» как починка тусклости **неверен в двух местах**. (1) 798 нит давал не HDR
игры, а Auto HDR Windows, растянувший её вывод: с выключенным для игры Auto HDR пик того же меню — 360 нит (прогон H5,
`testcases/TC_md_hdr_washed_menu_2026-10-08.md`). (2) Мерили только пик, а жалоба владельца — серое, высветленное меню
после закрытия уведомления Auto HDR (`bugs/29_md_hdr_menu_washed_after_auto_hdr.md`); пик этого не видит.
