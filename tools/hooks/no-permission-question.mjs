#!/usr/bin/env node
// no-permission-question.mjs — хук Claude Code (Stop): агент не заканчивает ход вопросом-разрешением о СВОЕЙ ЖЕ работе
// («Запустить эту проверку сейчас?», «Сделать…?», «Хотите, чтобы я…?», «Shall I…?»). Слово владельца 2026-10-08 ≈11:10:
// `[OWNER]` «Так. Давай изменим твои правила, и может хук напишем. Я тебе уже говорил про такое "Запустить эту проверку
// сейчас?" - а ты не послушал меня, и продолжаешь задавать эти ненужные вопросы». Правило в памяти было
// (owner-question-answer-first: «ход кончать, только если нужно его решение, иначе работать дальше») и не держало —
// урок без механизма не держит; хук держит в момент остановки.
//
// Как: событие Stop на stdin → transcript_path (JSONL) → последний текст ассистента → его последняя непустая строка.
// Если она кончается «?» и это предложение агентом своего следующего шага — вывод {"decision":"block","reason":…}:
// Claude Code не даёт остановиться и передаёт причину агенту. stop_hook_active = true (агент уже продолжил по этому
// хуку) — пропуск, чтобы не зациклить. Настоящий вопрос владельцу (развилка видения) — в interviews/, а в чате — со
// строкой-меткой `<!-- owner-decision -->` в реплике: объявленное исключение.
//
//   node no-permission-question.mjs      # событие Stop на stdin; на любом неожиданном — молча 0: хук не ломает сессию
//
// @guard no-permission-question
// THREAT:         агент кончает ход вопросом «сделать ли мне X?», где X — его собственная работа, и простаивает до ответа
// PROVED-AGAINST: tools/test-guards.mjs, часть H — без хука (файл отсутствует / всегда 0) блокирующие случаи красные;
//                 с хуком: «Запустить эту проверку сейчас?» (дословно 2026-10-08), «Хотите, чтобы я…?», «Shall I…?» → block;
//                 отчёт с точкой, вопрос в середине, метка owner-decision, stop_hook_active, мусор → пропуск
// GAP:            вопрос, оформленный не последней строкой (после него — строка без «?»), и разрешение без глагола-действия в
//                 начале («Ок?», «Норм?») не видны; формулировки вне словаря глаголов — держит память и судья
// ON-REAL-PATH:   2026-10-08 11:16 +03:00 — настоящий журнал этой сессии (JSONL Claude Code), обрезанный на реплике «Запустить эту
//                 проверку сейчас?», → block; на том же журнале целиком (последняя реплика — утверждение) → пропуск. Подключён в
//                 местных .claude/settings.local.json (hooks.Stop). Живое событие Stop с блокировкой в сессии — ещё не наблюдалось
import { readFileSync } from 'node:fs';

// Глагол-действие агента в начале последней фразы (инфинитив — «Запустить…?», первое лицо — «Запускаю?»).
const VERBS = [
  'запустить', 'перезапустить', 'сделать', 'начать', 'продолжить', 'проверить', 'взять', 'перейти', 'записать',
  'закоммитить', 'запушить', 'отправить', 'исправить', 'починить', 'применить', 'добавить', 'удалить', 'прогнать',
  'собрать', 'открыть', 'показать', 'написать', 'делать', 'приступить', 'браться', 'заняться', 'двигаться', 'идти',
  'оформить', 'завести', 'подготовить', 'включить', 'выключить', 'поставить', 'загрузить', 'развернуть',
  'запускаю', 'делаю', 'начинаю', 'продолжаю', 'беру', 'приступаю', 'иду',
];
// \b в JS видит только латинскую границу слова — для кириллицы граница записана явно: начало строки или пробел.
const PHRASES = [
  /хотите,?\s+(?:чтобы|что бы)\s+я/i, /(?:^|\s)мне\s+(?:[а-яё]+\s+)?(?:сделать|запустить|продолжить|начать|взять|проверить)/i,
  /(?:^|\s)давай(?:те)?\s+я(?:\s|$)/i, /(?:^|\s)можно\s+(?:я|начинать|приступать|запускать|продолжать)(?:\s|\?|$)/i, /(?:^|\s)нужно\s+ли\s+мне(?:\s|$)/i,
  /\b(?:shall|should)\s+i\b/i, /\b(?:do\s+)?you\s+want\s+me\s+to\b/i, /\bwant\s+me\s+to\b/i, /\bwould\s+you\s+like\s+me\s+to\b/i,
];

function lastAssistantText(path) {
  const lines = readFileSync(path, 'utf8').split('\n');
  for (let i = lines.length - 1; i >= 0; i--) {
    if (!lines[i].trim()) continue;
    let rec;
    try { rec = JSON.parse(lines[i]); } catch { continue; }
    if (rec.type !== 'assistant') continue;
    const content = rec.message && rec.message.content;
    const parts = Array.isArray(content) ? content.filter((c) => c && c.type === 'text').map((c) => c.text) : (typeof content === 'string' ? [content] : []);
    const text = parts.join('\n').trim();
    if (text) return text;
  }
  return '';
}

export function isPermissionOffer(text) {
  if (!text || text.includes('<!-- owner-decision -->')) return false;
  // последняя строка без хвостовой разметки («**…?**», «_…?_», «…?»»)
  const last = (text.split('\n').map((l) => l.trim()).filter(Boolean).pop() || '').replace(/[*_`»"\s]+$/, '');
  if (!last.endsWith('?')) return false;
  // последняя фраза строки: после последней точки / восклицания перед вопросом
  const sentence = last.split(/(?<=[.!])\s+/).pop().replace(/^[*_>#\-\s«"]+/, '').toLowerCase();
  const first = (sentence.split(/[\s,]+/)[0] || '').replace(/[?!.…:;]+$/, '');
  if (VERBS.includes(first)) return true;
  return PHRASES.some((re) => re.test(sentence));
}

try {
  const event = JSON.parse(readFileSync(0, 'utf8') || '{}');
  if (event.stop_hook_active) process.exit(0);
  const text = typeof event.last_assistant_message === 'string' && event.last_assistant_message
    ? event.last_assistant_message
    : (event.transcript_path ? lastAssistantText(event.transcript_path) : '');
  if (isPermissionOffer(text)) {
    process.stdout.write(JSON.stringify({
      decision: 'block',
      reason: 'no-permission-question: ход закончен вопросом-разрешением о твоей же работе. Владелец (2026-10-08): «продолжаешь задавать эти ненужные вопросы». Не спрашивай — делай этот шаг сейчас и докладывай результат. Настоящая развилка видения — в interviews/ (или пометь реплику <!-- owner-decision -->).',
    }));
  }
  process.exit(0);
} catch {
  process.exit(0);
}
