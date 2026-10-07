# Test run report — Medieval Dynasty: UE4SS встаёт в игру

**Created:** 2026-10-07 23:42 +03:00 · **Run by:** агент (Claude Opus 5.5) · **Version/build:** Medieval Dynasty 2.7.0.3
(UE 4.27), UE4SS `experimental-latest` `v3.0.1-1161-g6eb3d9bc`

## 1. Work

Первый запуск Medieval Dynasty с UE4SS — фундамент эпика «живой мир» и проверка вывода разведки «логика в блюпринтах,
рефлексия открыта». Набор кейсов — `testcases/TC_medieval_dynasty_ue4ss_bootstrap_2026-10-07.md` (C1–C8). Основа —
слово владельца «качай UE4SS, ставь, пробуй подключить его и запустить игру» (чат 2026-10-07).

## 2. Contour

Установка игры владельца `<GAME>\Medieval Dynasty`, загрузчик — прокси `dwmapi.dll` + `ue4ss/` в
`Medieval_Dynasty/Binaries/Win64`, настройки UE4SS заводские. Слепок `Win64` до установки снят (4 файла, sha256), exe не
тронут. REAL WORLD: accumulated — профиль и сейвы владельца на месте, игра стартовала с его настройками графики;
data and machine — его машина, его установка; path — тот же запуск `Medieval_Dynasty.exe`, что у него.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-10-07 23:40 +03:00 | `Start-Process "<GAME>\Medieval Dynasty\Medieval_Dynasty.exe"` | процесс жив; меню игры на экране |

## 4. Checks

Hygiene: NONE — прогон целиком функциональный.
Functional run: игра запущена путём владельца; прочитаны `ue4ss/UE4SS.log` (681 строка), журнал игры
`%LOCALAPPDATA%\Medieval_Dynasty\Saved\Logs\Medieval_Dynasty.log` и два снимка экрана.

- C1 pass — процесс `Medieval_Dynasty-Win64-Shipping` жив через 30 с.
- C2 pass — журнал UE4SS создан этим запуском (23:40:05).
- C3 pass — `Found EngineVersion: 4.27`.
- C4 pass — сканы GUObjectArray, FName::ToString, FName::FName, StaticConstructObject найдены, `PS scan successful`.
- C5 pass — шесть Lua-модов запущены (CheatManagerEnablerMod, ConsoleCommandsMod, ConsoleEnablerMod, BPML_GenericFunctions,
  BPModLoaderMod, Keybinds).
- C6 pass — в 23:41 на экране меню игры с версией 2.7.0.3.
- C7 pass — в журнале игры ноль `Fatal error`/`AbortHandler`; `Map_MainMenu` за 0.198 с.
- C8 skipped — на экране открыты «Настройки → Графика», в игре владелец; его игру агент не закрывает.

## 5. Found

- `ConsoleManagerSingleton`: два кандидата, UE4SS не выбрал. Последствие — чтение и запись консольных переменных через
  UE4SS могут не работать. Не дефект запуска; проверить, когда понадобятся `r.*`/`t.*`.

## 6. Traces

`<GAME>\Medieval Dynasty\Medieval_Dynasty\Binaries\Win64\ue4ss\UE4SS.log` (на машине владельца, вне git); снимки — в
scratchpad сессии, в репозиторий не взяты (меню, ничего нового).

## 7. Verdict

pass — UE4SS встаёт в Medieval Dynasty 2.7.0.3 без правок настроек; закрытие игры (C8) не проверено, потому что в игре
владелец.
