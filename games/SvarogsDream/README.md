# Svarog's Dream — досье

> Своя сборка на BepInEx: `D:\work\ai_sandbox\SvarogsDream` (репозиторий `svarogs-dream-modpack`), игра
> `D:\Games\Svarog's Dream`. Что сейчас в работе — `STATUS.md`, пункты 0а и 0. Как устроены ИИ и живой мир игры —
> `researches/svarogs-dream/simulation.md`.

## Как агент работает с игрой сам

(Перенесено дословно из `STATUS.md` 2026-10-05; правится здесь.)

**Как работаю с игрой сам** (разрешение владельца — память `svarog-agent-runs-game-itself`): `tools/run-game.sh` ·
пульт `tools/h.sh "<команда>"…` (shot · dump · find/findall · hover/click · waitfor · cfg · kill; путь с пробелами — в
кавычках) · клик по миру — `tools/mouse.ps1 -X -Y -Button left|right|wheel` (правая — разговор, wheel `-Clicks ±N` — приближение камеры) · `tools/deploy-hot.sh
KrinikUIRework` (RELOADED) · кадр — `shot` пишет JPEG, `h.sh` сам переводит в WebP 90 (PNG — никогда, канон
`AGENT_GUIDE.md`) · сличение с макетом — только `tools/shoot_mockup.mjs` + `tools/pair.py` (целые окна, одно разрешение)
· закрывать `kill` (выход из меню пишет сейв; копия сейвов — `D:\work\ai_sandbox\_backups`) · пока игра открыта —
голосом (`tools/voice_say.py`, файл фразы — в `SvarogsDream/_harness/`) · сменил значение по умолчанию — правь и
`BepInEx/config/krinik.svarogsdream.*.cfg`. Слоты сумки: #0 сапоги, #2 лук, #7 удочка, #46 кольца, #47 туника.
Пособие по вёрстке Unity UI + TMP — `researches/unity-ugui-layout/` (греп по `TAG:`; ловушки — `12_pitfalls.md`).

## Замер кадра

- Пульт: `perf [сек]` (FPS, счётчики отрисовки, живые значки, персонажи, аниматоры, частицы), `prof [сек] [N]`
  (самые дорогие `Update` игры и модов), переключатели `animcull`, `particles`, `farchars`, `timescale`, `terrainshader`.
- Потоки игры: `powershell -File tools/threads.ps1 -Seconds 6` (в репозитории сборки).
- Правки без побочного состояния сравнивать переключением в одном мире; свет — при остановленном времени (EXP-0139).
