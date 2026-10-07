# Test run report — Svarog's Dream: эпитафия героя и события мира по-русски

**Created:** 2026-10-07 18:54 +03:00 · **Run by:** агент (Claude Opus 5.5) · **Version/build:** SvarogsDream `e5a1191` +
`src/KrinikUIRework/Epitaph.cs` (сборка 18:47, 317 440 байт, в `BepInEx/scripts` с 18:48)

## 1. Work

Эпитафия героя по-русски (крючок на `ProgressManager.GetGeneratedCharacterDeathMessage`, род по полу, убийца в творительном
падеже, согласование чисел) и вести мира нашим словарём (`zz_worldevents.txt`, 136 текстов). Набор случаев —
`testcases/TC_svarog_epitaph_worldevents_2026-10-07.md` (C1–C5, K1); основание — эпик `plans/14_EPIC_svarog_dialogues_translation.md`,
операционный план фаз 4 и 6 (критерии Э1, Э2, С1, С2).

## 2. Contour

Игра `D:\Games\Svarog's Dream` (GOG, 7.x + дополнение), BepInEx 5.4.23.5, сейв владельца (героиня Милица); мод интерфейса из
`BepInEx/scripts`, словари из `_config/xunity` выложены `translation_deploy.sh` в 18:39. Игра закрыта командой пульта `kill` —
без записи сейва: проверочные смерти и записи журнала в сейв владельца не попали.
REAL WORLD: accumulated — сейв владельца с прошлыми записями журнала (машинный русский в них — см. C5); data and machine — его
сейв, его машина; path — экран смерти и окно вестей, как их видит игрок (вызов пультом вместо смерти и наступления события).

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-10-07 18:49 +03:00 | `bash tools/run-game.sh` | мир с HUD за 15,7 с |
| 2 | 2026-10-07 18:50 +03:00 | `bash tools/h.sh "call KrinikUIRework.Epitaph DumpPreview D:/work/ai_sandbox/SvarogsDream/_harness/epitaph_preview.txt"` | `lines 3028 latin 0` |
| 3 | 2026-10-07 18:50 +03:00 | `bash tools/h.sh "call ProgressManager ShowDeathScreen" "wait 3" "shot ep_death_ru"` | кадр, русская эпитафия |
| 4 | 2026-10-07 18:50 +03:00 | `bash tools/h.sh "cfg krinik.svarogsdream.uirework Translation Epitaph false" "call ProgressManager ShowDeathScreen" "wait 3" "shot ep_death_k1" "cfg krinik.svarogsdream.uirework Translation Epitaph true"` | кадр, английский текст автора |
| 5 | 2026-10-07 18:51 +03:00 | `bash tools/h.sh "call WorldEventsManager ShowEventMessageManually Werevolves 0" "wait 3" "shot we_werewolves"` | окно не показано: событие уже было в мире |
| 6 | 2026-10-07 18:52 +03:00 | `bash tools/h.sh "active UI/GamePopUps/WorldEvents/1-Werewolves 1" "wait 2" "shot we_werewolves2"` | кадр окна вестей |
| 7 | 2026-10-07 18:52 +03:00 | `bash tools/h.sh "active UI/GamePopUps/WorldEvents/53-SwordsUp 1" "wait 2" "shot we_swordsup" "active UI/GamePopUps/WorldEvents/53-SwordsUp 0"` | кадр окна вестей с числом |
| 8 | 2026-10-07 18:53 +03:00 | `bash tools/h.sh "click UI/Enablers/InfoPanel" "wait 1" "click UI/InfoPanel/InfoPanelHeader/LogsHeader" "wait 2" "shot we_journal"`; `tools/mouse.ps1 -X 413 -Y 1052 -Button left`; `bash tools/h.sh "shot we_journal_entry"` | кадр записи журнала |
| 9 | 2026-10-07 18:54 +03:00 | `bash tools/h.sh "kill"` | процессов игры 0 |

## 4. Checks

Hygiene: сборка `dotnet build src/KrinikUIRework -c Release` — успешна, новых предупреждений нет; генератор `worldevents_xunity.py`
— 136/136, глоссарий 0, качество 0, тире 0.
Functional run: игра с сейвом владельца; экран смерти вызван пультом и прочитан с кадра (русский, затем контроль — английский);
два окна вестей включены пультом и прочитаны с кадров; журнал «События» открыт, запись прошлой вести прочитана с кадра.

| Case | Status | Observation |
|---|---|---|
| C1 | pass | `lines 3028 latin 0`; прочитаны ветви: «одолев 21 волну», «Сразила 101 чудище», «Убил 11 человек», «в возрасте 21 года», «собрано 21 растение» |
| C2 | pass | «Милица умерла в возрасте 29 лет. Дух вёл её 9 дней. Добыла 17 зверей. Сразила 5 чудищ. Вернула в могилу 9 мертвецов…» |
| K1 | pass | выключено: «Milica died at the age of 29. Controlled by the spirit for 9 days…» — те же ветви строка в строку |
| C3 | pass с оговоркой | «ВЕСТИ МИРА», «Ночами в лесах замечают оборотней…»; окно включено пультом, а не методом игры (метод запускает событие в мире) |
| C4 | pass с той же оговоркой | «Цены на оружие выросли на 50%: северные земли охватила война…» |
| C5 | fail | прошлая весть в журнале — машинный русский, буква в букву значение машинного словаря: записан в сейв уже переведённым |

## 5. Found

- Журнал хранит текст вести в момент события, уже подменённый XUnity: прошлые записи сейва останутся машинным русским, словарь их
  не перепишет (XUnity не трогает русские строки). Лечение — мод заменяет при показе журнала машинный текст нашим по таблице
  «ключ → машинный → наш»; заведено в план 14, фаза 6, шаг С-4.
- Окно вестей автора: первая длинная строка упирается в края серой плашки, красный автора (#BC1D11) тёмный на сером — в
  `ideas/07`, п. 36.

## 6. Traces

- Кадры `SvarogsDream/_harness/ep_death_ru.webp`, `ep_death_k1.webp`, `we_werewolves2.webp`, `we_swordsup.webp`, `we_journal.webp`,
  `we_journal_entry.webp` (вне git, `_harness/`)
- Предпросмотр всех ветвей `SvarogsDream/_harness/epitaph_preview.txt`
- Журнал `D:\Games\Svarog's Dream\BepInEx\LogOutput.log` сеанса 18:49–18:54

## 7. Verdict

partial — эпитафия и окна вестей по-русски увидены в игре, а журнал «События» для прошлых вестей остаётся машинным (C5 fail), и
наступление новой вести своим ходом не проверено.
