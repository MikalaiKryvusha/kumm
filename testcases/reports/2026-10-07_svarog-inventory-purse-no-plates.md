# Test run report — Svarog's Dream: низ инвентаря «Золото · Вес» без синих подложек

**Created:** 2026-10-07 10:41 +03:00 · **Run by:** агент (Claude Opus 5.5) · **Version/build:** SvarogsDream `a11e5b0` + правка
`Purse.cs`, `ItemWindow.cs` (LabeledBox без подложки, цвет подписи параметром)

## 1. Work

Правка владельца к ideas/07 п. 30: `[OWNER]` «Лист «было → стало»: было-стало_низ.webp, некрасиво. Эти синие подложки не нужны в
инвентаре» · 2026-10-07 ≈10:37. Случаи C14–C16 — `testcases/TC_svarog_inventory_2026-10-07.md`, написаны до прогона.

## 2. Contour

Игра владельца, его сейв (копия — `D:\work\ai_sandbox\_backups\svarog-saves-2026-10-07_0934`), мод из `BepInEx/scripts`, экран
3840×2160. REAL WORLD: accumulated — сейв владельца (золото 1614, вес 105,6/144), его конфиг модов; data and machine — его машина;
path — окно инвентаря, наведение настоящей мышью.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-10-07 10:39 +03:00 | `bash tools/run-game.sh`; `bash tools/h.sh "click UI/Enablers/Inventory" "wait 1.5" "shot nb_after"` | 0 · подложек нет, строка мельче «Сортировать» |
| 2 | 2026-10-07 10:40 +03:00 | `bash tools/h.sh "cfg krinik.svarogsdream.uirework Inventory PurseScale 0.9"` (и 1) → переоткрытие → `shot nb_0.9`, `nb_1`, `nb_final` | 0.9 выбран |
| 3 | 2026-10-07 10:40 +03:00 | `powershell -File tools/mouse.ps1 -X 3000 -Y 1290 -Button move` → `shot nb_card`; `bash tools/h.sh "kill"` | карточка прежняя; игра закрыта |

## 4. Checks

Hygiene: `dotnet build` KrinikUIRework — Build succeeded
Functional run: окно инвентаря в игре владельца — прочитаны кадры низа окна при 0.7 / 0.9 / 1, высоты букв по кадру 4K, карточка предмета под мышью

| Case | Status | Observation |
|---|---|---|
| C14 | pass | «Золото 1614 🪙   Вес 105,6/144» без подложек, подпись цветом статов; размер 0.9 |
| C15 | pass | середина «Вес» 1723,5 px, «Сортировать» 1724,5 px |
| C16 | pass | «Цена 25 · Вес 0,2» в карточке — на синих плашках, как прежде |

## 5. Found

- none

## 6. Traces

`D:\work\ai_sandbox\SvarogsDream\_harness\nb_after.webp`, `nb_scale_sheet.webp`, `nb_final.webp`, `nb_card_s.webp`.

## 7. Verdict

pass — подложки сняты, строка стоит с «Сортировать», карточка не задета; вкус (размер 0.9) — глаз владельца.
