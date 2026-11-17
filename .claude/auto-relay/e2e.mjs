// e2e — end-to-end check of the auto-relay chain: the hook is fed the JSON Claude Code sends, a fake project with its own git repo holds
// STATUS.md, and the detached opener runs dry (AUTO_RELAY_DRY=1 — it logs «would open» instead of opening a chat).
// Runs on COPIES of relay.mjs, relay-hook.mjs and the hooks they import, in KUMM/.work/ (the project's own scratch, never D:\Temp), so the live
// state.json and .kaif/autonomy.json are never touched.
//   node .claude/auto-relay/e2e.mjs      → «e2e: N/N», exit 0
import { spawnSync } from 'node:child_process';
import { writeFileSync, readFileSync, appendFileSync, rmSync, mkdirSync, mkdtempSync, copyFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SRC = join(dirname(fileURLToPath(import.meta.url)), '..', '..');   // <project>
mkdirSync(join(SRC, '.work'), { recursive: true });
const ROOT = mkdtempSync(join(SRC, '.work', 'auto-relay-e2e-'));         // fake project
for (const f of ['.claude/auto-relay/relay.mjs', '.claude/hooks/relay-hook.mjs', '.claude/hooks/context-budget.mjs', 'tools/hooks/farewell-capture.mjs',
  'tools/hooks/autonomy-guard.mjs']) { mkdirSync(dirname(join(ROOT, f)), { recursive: true }); copyFileSync(join(SRC, f), join(ROOT, f)); }
const RELAY = join(ROOT, '.claude/auto-relay/relay.mjs');
const HOOK = join(ROOT, '.claude/hooks/relay-hook.mjs');
const STATE = join(ROOT, '.claude/auto-relay/state.json');
const LOGF = join(ROOT, '.claude/auto-relay/relay.log');
const AUTONOMY = join(ROOT, '.kaif/autonomy.json');
const T = join(ROOT, 'transcript.jsonl');
const env = (sid) => ({ ...process.env, CLAUDE_CODE_SESSION_ID: sid, CLAUDE_PROJECT_DIR: ROOT, AUTO_RELAY_DRY: '1', AUTO_RELAY_QUIET_MS: '400',
  AUTO_RELAY_POLL_MS: '100', AUTO_RELAY_WAIT_MS: '20000' });
const relay = (args, sid = 'chat-1') => spawnSync(process.execPath, [RELAY, ...args], { env: env(sid), encoding: 'utf8' });
const hook = (input, sid = 'chat-1') => spawnSync(process.execPath, [HOOK], { input: JSON.stringify(input), env: env(sid), encoding: 'utf8' });
const git = (...a) => spawnSync('git', ['-C', ROOT, '-c', 'user.name=e2e', '-c', 'user.email=e2e@localhost', ...a], { encoding: 'utf8' });
const state = () => JSON.parse(readFileSync(STATE, 'utf8'));
const autonomy = () => { try { return JSON.parse(readFileSync(AUTONOMY, 'utf8')); } catch { return {}; } };
const logText = () => (existsSync(LOGF) ? readFileSync(LOGF, 'utf8') : '');
const sleep = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
const waitFor = (re, ms) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (re.test(logText())) return true; sleep(100); } return re.test(logText()); };
const count = (re) => (logText().match(new RegExp(re, 'g')) || []).length;
const results = [];
const ok = (name, c, extra = '') => results.push([name, !!c, extra]);

// Transcript records in the shape Claude Code writes them (KUMM transcripts, 2026-11-17).
const L = (o) => JSON.stringify(o);
const FAREWELL = 'Всё сделано. До встречи.\n\n<!-- farewell -->';
const ownerPrompt = L({ type: 'user', message: { content: 'закрывай' } });
const closureCall = L({ type: 'assistant', message: { content: [{ type: 'tool_use', id: 'sk1', name: 'Skill', input: { skill: 'end-chat-soft' } }] } });
const closureOk = L({ type: 'user', message: { content: [{ type: 'tool_result', tool_use_id: 'sk1', content: 'loaded' }] } });
const farewellRec = L({ type: 'assistant', message: { content: [{ type: 'text', text: FAREWELL }] } });
const summary = L({ type: 'system', subtype: 'stop_hook_summary' });
const blockedFeedback = [L({ type: 'user', isMeta: true, message: { content: 'Stop hook feedback:\nknowledge-hook · есть ли новое знание?' } }),
  L({ type: 'attachment', attachment: { type: 'hook_blocking_error', hookEvent: 'Stop' } })];
const writeT = (rows) => writeFileSync(T, rows.join('\n') + '\n');
const stop = (sid, last = FAREWELL) => hook({ hook_event_name: 'Stop', session_id: sid, transcript_path: T, last_assistant_message: last }, sid);

try {
  git('init', '-q');
  writeFileSync(join(ROOT, 'STATUS.md'), '# STATUS\n'); git('add', 'STATUS.md'); git('commit', '-q', '-m', 'old status');

  ok('hook silent while auto-relay is off', stop('chat-1').stdout === '' && !existsSync(STATE));
  sleep(1100);   // git %ct is in seconds: the run starts in a later second than the old commit
  ok('start: run ON, chat 1, bound to the chat, autonomy ON by the relay', relay(['start', '--task', 'demo', '--max', '2']).status === 0 && state().active
    && state().chain === 1 && state().sessionId === 'chat-1' && autonomy().on === true && /^auto-relay/.test(autonomy().by || ''));

  writeT([ownerPrompt, L({ type: 'assistant', message: { content: [{ type: 'text', text: 'Жду судью.' }] } })]);
  const plain = stop('chat-1', 'Жду судью.');
  ok('a plain stop (no farewell): no output, nothing opened', plain.stdout === '' && !/relay →/.test(logText()) && state().chain === 1);

  writeT([ownerPrompt, closureCall, closureOk, farewellRec, summary]);
  stop('chat-1');
  ok('farewell, but STATUS.md not committed in this chat: no relay, the reason logged', /no relay at this farewell: STATUS\.md is not committed/.test(logText())
    && state().chain === 1);

  writeFileSync(join(ROOT, 'STATUS.md'), '# STATUS\nhandover\n'); git('add', 'STATUS.md'); git('commit', '-q', '-m', 'handover');
  writeFileSync(join(ROOT, 'STATUS.md'), '# STATUS\nhandover\nuncommitted\n');
  stop('chat-1');
  ok('farewell with an uncommitted STATUS.md edit: no relay', count('no relay at this farewell: STATUS') === 2 && state().chain === 1);
  git('checkout', '-q', '--', 'STATUS.md');

  // STATUS is committed now: only the farewell mark separates a plain stop from a relay (the mutant «farewell = true» passed every case before this one).
  writeT([ownerPrompt, closureCall, closureOk, L({ type: 'assistant', message: { content: [{ type: 'text', text: 'Жду судью.' }] } })]);
  ok('STATUS committed, a stop WITHOUT the farewell mark (judge wait in the closure turn): nothing opened', stop('chat-1', 'Жду судью.').stdout === ''
    && !/relay →/.test(logText()) && state().chain === 1);
  writeT([ownerPrompt, farewellRec]);
  stop('chat-1');
  ok('STATUS committed, the mark but no accepted closure in the chat: nothing opened', !/relay →/.test(logText()) && state().chain === 1);

  stop('other');
  ok('the farewell of ANOTHER chat of the project opens nothing', !/relay →/.test(logText()) && state().chain === 1);

  // Risk 1 of the KAIF session: another Stop hook BLOCKS the farewell stop — the opener must wait while the old chat answers the hook.
  writeT([ownerPrompt, closureCall, closureOk, farewellRec, ...blockedFeedback]);
  const spawnRun = stop('chat-1');
  ok('farewell of this chat, STATUS committed: opener spawned, chain = 2, the hook prints nothing (never blocks)',
    spawnRun.stdout === '' && /relay → chat 2 of 2/.test(logText()) && state().chain === 2 && state().spawnedFrom === 'chat-1');
  ok('the opener waits for quiet', waitFor(/open: waiting for the old chat/, 5000));
  sleep(1500);
  ok('blocked stop («Stop hook feedback» last): no chat opened while the old chat works on', !/would open/.test(logText()));
  stop('chat-1');
  ok('a second farewell stop of the same chat: no second opener', count('relay →') === 1);
  appendFileSync(T, L({ type: 'assistant', message: { content: [{ type: 'text', text: 'Новых знаний нет.' }] } }) + '\n' + summary + '\n');
  ok('the old chat answered and went quiet: the next chat opens (dry) with «resume auto-relay continue»',
    waitFor(/\[dry\] would open a new chat .*resume auto-relay continue/, 8000));

  const order = hook({ hook_event_name: 'UserPromptSubmit', session_id: 'chat-2', prompt: 'resume auto-relay continue' }, 'chat-2');
  ok('the next chat\'s prompt gets the order: relay.mjs continue, then /resume', /ПРИКАЗ auto-relay: это чат 2 из 2/.test(order.stdout)
    && /relay\.mjs continue/.test(order.stdout) && /\/resume целиком/.test(order.stdout));
  writeFileSync(AUTONOMY, JSON.stringify({ on: false, by: 'closure skill' }));   // the closure switched the autonomy mode off in chat 1
  sleep(1100);
  ok('continue in chat 2: bound to chat 2, autonomy ON again', relay(['continue'], 'chat-2').status === 0 && state().sessionId === 'chat-2'
    && state().spawnedFrom === '' && autonomy().on === true);

  writeFileSync(join(ROOT, 'STATUS.md'), '# STATUS\nhandover 2\n'); git('add', 'STATUS.md'); git('commit', '-q', '-m', 'handover 2');
  writeT([ownerPrompt, closureCall, closureOk, farewellRec, summary]);
  const st = relay(['status'], 'chat-2');
  ok('status before the last farewell says the run ends with this chat', /the run ENDS with this chat \(chat limit 2 reached\)/.test(st.stdout));
  stop('chat-2');
  ok('chat limit 2 reached: run OFF, autonomy OFF, no opener', state().active === false && /limit/.test(state().stopReason || '')
    && autonomy().on === false && count('relay →') === 1);

  relay(['start', '--task', 'demo 2'], 'chat-3');
  const stopWord = hook({ hook_event_name: 'UserPromptSubmit', session_id: 'chat-3', prompt: 'стоп, хватит' }, 'chat-3');
  ok('the owner\'s stop word ends the run', state().active === false && /стоп/.test(stopWord.stdout) && autonomy().on === false);

  writeFileSync(AUTONOMY, JSON.stringify({ on: true, by: 'работай автономно' }));
  relay(['start', '--task', 'demo 3'], 'chat-4');
  writeFileSync(AUTONOMY, JSON.stringify({ on: true, by: 'работай автономно' }));   // the owner's own order after the start
  relay(['stop', '--reason', 'done'], 'chat-4');
  ok('stop leaves the owner\'s own autonomy order alone', state().active === false && autonomy().on === true && autonomy().by === 'работай автономно');

  const prose = hook({ hook_event_name: 'UserPromptSubmit', session_id: 'chat-4', prompt: 'как работает auto-relay continue?' }, 'chat-4');
  ok('prose about the relay is not an order', prose.stdout === '');
  ok('relay.log keeps the events', /start · chat 1 of 2/.test(logText()) && /continue · chat 2 of 2/.test(logText()) && /stopped: chat limit 2/.test(logText()));
} catch (e) {
  ok(`e2e crashed: ${e.message}`, false);
}

for (const [n, c, x] of results) console.log(`${c ? '✓' : '✗'} ${n}${x && !c ? ' · ' + x : ''}`);
const bad = results.filter((r) => !r[1]).length;
console.log(`e2e: ${results.length - bad}/${results.length}`);
if (bad) console.log(`relay.log of the run:\n${logText()}`);
rmSync(ROOT, { recursive: true, force: true, maxRetries: 3 });
process.exit(bad ? 1 : 0);
