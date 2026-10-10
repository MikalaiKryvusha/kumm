# Run report — страж «обратная кавычка в коде `python -c "…"` / `node -e "…"`» (класс escaping-layer, EXP-0199)

## 1. Work

`tools/hooks/no-backslash-heredoc.mjs` — второй рубеж того же хука: отказ (код 2), если в коде в двойных кавычках после
`python…/py/node… -c|-e "` стоит обратная кавычка. `tools/test-guards.mjs`, часть A — 4 формы отказа и 4 контроля.

Основание — два удара класса за ночь 2026-10-10:
- строка случая C49 потеряла куски, ушедшие в bash командами;
- путь отчёта в `python -c` выполнил markdown-отчёт как скрипт.

Канон: «два удара → механизм».

## 2. Contour

Репозиторий KUMM, Node v24, Git Bash на Windows 11. Хук уже зарегистрирован в местных настройках как Bash PreToolUse — файл
настроек не правился.

## 3. Runs

2026-10-10 03:17–03:19:
1. `node tools/test-guards.mjs`.
2. Мутант: строка сканера заменена на `return null;` через `sed -i`, `node tools/test-guards.mjs`, файл возвращён из копии
   (`scratchpad/hook.bak`), `node tools/test-guards.mjs`.
3. Живой вызов Bash: `python -c "print('<обратная кавычка>echo live-probe<обратная кавычка>')"`.

## 4. Checks

Hygiene: набор стражей 129 из 129.

Functional run: живой вызов инструмента Bash той же сессии — прочитан ответ хука («inline code in double quotes contains a backtick
… Do this instead: write the script with the Write tool»). Команда не выполнилась.

## 5. Found

1. Мутант «сканер всегда пуст» краснит ровно 4 названные формы отказа (125 из 129). Контроли зелёные, без мутанта — 129 из 129.
2. GAP: `bash -c "…"`, `perl -e`, `sed "…"`, `git commit -m "…"` и подстановку `$(…)` страж не судит.

## 6. Traces

Вывод `node tools/test-guards.mjs` в переписке сессии; ответ хука на живой вызов там же. Код —
`tools/hooks/no-backslash-heredoc.mjs` (раздел `@guard no-backtick-inline-code`).

## 7. Verdict

**pass.** Класс escaping-layer получил механизм на вторую форму; дыры названы в заголовке хука.
