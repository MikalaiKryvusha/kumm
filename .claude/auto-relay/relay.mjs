#!/usr/bin/env node
// auto-relay — a long autonomous run hops from chat to chat (Claude Code, VS Code extension, Windows 11). KUMM's local build of the KAIF
// skill from the owner's guide `KAIF/ideas/auto_relay_windows_guide.md` (KAIF e34fd93, decision №160), the owner's task relayed by the KAIF
// session 2026-11-17 11:02 («в KUMM мне УЖЕ нужен этот навык»). Three field changes against the guide, agreed with the KAIF session the same day:
//   1. ONE window gauge — `.claude/hooks/context-budget.mjs` (soft closure from 80 %, forced from 92 %). The relay has no threshold of its own.
//   2. ONE handover — the project's own closure: `/end-chat-soft` writes STATUS.md «Where to continue», the farewell hook files the farewell
//      (`tools/hooks/farewell-capture.mjs`). No HANDOVER.md: a second handover document is a pair to watch (DRY).
//   3. ONE entry — the next chat gets «resume auto-relay continue»: the resume-word hook orders /resume in full, `relay-hook.mjs` orders
//      `relay.mjs continue` first (binds the chat). The next chat opens only after the FAREWELL of an accepted closure (the `<!-- farewell -->`
//      mark), with STATUS.md committed after the chat started, and only when the old chat is QUIET (`open` below: ≥ 10 s without a write and the
//      last record a text answer) — a Stop blocked by another hook (autonomy-guard, knowledge-hook) never opens a second agent beside the first.
//
//   node .claude/auto-relay/relay.mjs start --task "<one line>" [--max 10]   # chat 1 of the run; the autonomy mode goes ON (.kaif/autonomy.json)
//   node .claude/auto-relay/relay.mjs continue                              # first command of every next chat: binds this chat, autonomy ON
//   node .claude/auto-relay/relay.mjs status                                # run state + whether the next chat would open after a farewell now
//   node .claude/auto-relay/relay.mjs stop --reason "<why>"                 # the run ends; the autonomy mode goes OFF if the relay set it
//   node .claude/auto-relay/relay.mjs open --transcript <path>              # spawned detached by the Stop hook: waits for quiet, runs open-chat.ps1
//   node .claude/auto-relay/relay.mjs --check                               # self-test of the decisions, no files touched
// Env: AUTO_RELAY_DRY=1 — `open` logs «would open» instead of opening a chat · AUTO_RELAY_QUIET_MS · AUTO_RELAY_POLL_MS · AUTO_RELAY_WAIT_MS.
// [NOT-TESTED] the live chain on the owner's machine — testcases/TC_auto_relay_2026-11-17.md
import { readFileSync, writeFileSync, statSync, mkdirSync, appendFileSync, openSync, readSync, fstatSync, closeSync, realpathSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

export const DIR = dirname(fileURLToPath(import.meta.url));
export const ROOT = join(DIR, '..', '..');
export const STATE = join(DIR, 'state.json');
export const LOG = join(DIR, 'relay.log');
export const AUTONOMY = join(ROOT, '.kaif', 'autonomy.json');
export const PROMPT = 'resume auto-relay continue';
export const sessionId = () => process.env.CLAUDE_CODE_SESSION_ID || '';

export const readState = () => { try { return JSON.parse(readFileSync(STATE, 'utf8')); } catch { return { active: false }; } };
export const writeState = (s) => { mkdirSync(DIR, { recursive: true }); writeFileSync(STATE, JSON.stringify(s, null, 2) + '\n'); };
export const log = (line) => { try { appendFileSync(LOG, `${new Date().toISOString()} ${line}\n`); } catch { /* no log, no harm */ } };
const now = () => new Date().toISOString();

// The next chat's prompt and the owner's stop word (the same words that switch the autonomy mode off — tools/hooks/autonomy-guard.mjs OFF).
export const CONTINUE_PROMPT = /^\s*(?:\/?resume\s+)?\/?auto-relay\s+continue(?![\w-])/i;

/** What the Stop hook does: { action: 'none'|'spawn'|'limit', reason }. f = { farewell, statusCommitted } measured by the hook. Never 'block':
 *  pushing an early stop is the autonomy guard's job. */
export function stopDecision(state, ev, f) {
  const none = (reason) => ({ action: 'none', reason });
  if (!state.active) return none('auto-relay is off');
  if (state.sessionId && ev.session_id && state.sessionId !== ev.session_id) return none('not the chat of the run');
  if (state.spawnedFrom && state.spawnedFrom === ev.session_id) return none('the next chat is already opening');
  if (!f.farewell) return none('not the farewell of an accepted closure');
  if (!f.statusCommitted) return none('STATUS.md is not committed after this chat started (or has uncommitted edits) — the handover is not saved');
  const max = state.maxChats || 10, chain = state.chain || 1;
  if (chain >= max) return { action: 'limit', reason: `chat limit ${max} reached` };
  return { action: 'spawn', reason: `chat ${chain + 1} of ${max}` };
}

/** STATUS.md handover is saved: its last commit is not older than the chat's start (git %ct is in seconds) and the tree has no edits of it. */
export const committedAfter = (commitSec, dirty, chatStartedAt) =>
  Number.isFinite(commitSec) && commitSec > 0 && commitSec >= Math.floor(Date.parse(chatStartedAt || 0) / 1000) && !dirty;

export function statusCommittedSince(root, chatStartedAt) {
  const env = { ...process.env, GIT_OPTIONAL_LOCKS: '0' };
  const ct = spawnSync('git', ['-C', root, 'log', '-1', '--format=%ct', '--', 'STATUS.md'], { encoding: 'utf8', env, windowsHide: true });
  const st = spawnSync('git', ['-C', root, 'status', '--porcelain', '--', 'STATUS.md'], { encoding: 'utf8', env, windowsHide: true });
  if (ct.status !== 0 || st.status !== 0) return false;
  return committedAfter(Number(String(ct.stdout).trim()), String(st.stdout).trim() !== '', chatStartedAt);
}

// Records that are bookkeeping of the harness, not a turn of the chat: they follow the final answer (stop_hook_summary) or precede a turn.
const BOOKKEEPING = new Set(['system', 'api-request', 'api-request-blob', 'last-prompt', 'ai-title', 'custom-title', 'session-owner', 'atis-latch',
  'summary', 'file-history-snapshot', 'tag']);

/** The old chat's turn is over: the last record of the main chat that is not bookkeeping is an assistant answer of text blocks only.
 *  A Stop blocked by another hook writes `user` (isMeta «Stop hook feedback») and `attachment` (hook_blocking_error) right after the answer;
 *  a running tool or thinking leaves a tool_use / thinking block last — none of them is «over» (KUMM transcript 437b6f7e, 2026-11-17). */
export function turnFinished(records) {
  for (let i = records.length - 1; i >= 0; i--) {
    const r = records[i];
    if (!r || r.isSidechain || BOOKKEEPING.has(r.type)) continue;
    if (r.type !== 'assistant') return false;
    const c = r.message && r.message.content;
    const bs = Array.isArray(c) ? c.filter(Boolean) : typeof c === 'string' ? [{ type: 'text', text: c }] : [];
    return bs.length > 0 && bs.every((b) => b.type === 'text');
  }
  return false;
}

export function tailRecords(path, bytes = 1024 * 1024) {
  const fd = openSync(path, 'r');
  try {
    const size = fstatSync(fd).size, len = Math.min(size, bytes), buf = Buffer.alloc(len);
    readSync(fd, buf, 0, len, size - len);
    const lines = buf.toString('utf8').split('\n');
    if (len < size) lines.shift();
    const out = [];
    for (const l of lines) { if (!l.trim()) continue; try { out.push(JSON.parse(l)); } catch { /* a line being written */ } }
    return out;
  } finally { closeSync(fd); }
}

/** autonomy mode: the relay turns it on for its chats and off only when it was the one that turned it on. */
export function setAutonomy(on, by) {
  let cur = {}; try { cur = JSON.parse(readFileSync(AUTONOMY, 'utf8')); } catch { /* none */ }
  if (!on && !(cur.on && String(cur.by || '').startsWith('auto-relay'))) return false;
  mkdirSync(dirname(AUTONOMY), { recursive: true });
  writeFileSync(AUTONOMY, JSON.stringify({ on, at: now(), by }));
  return true;
}

function arg(name, def) { const i = process.argv.indexOf(name); return i > 0 && process.argv[i + 1] ? process.argv[i + 1] : def; }
const sleep = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);

// `open`: wait until the old chat is quiet and its turn is over, then open the next chat (open-chat.ps1). Runs detached from the Stop hook.
function open() {
  const transcript = arg('--transcript', '');
  const quiet = Number(process.env.AUTO_RELAY_QUIET_MS) || 10_000;
  const poll = Number(process.env.AUTO_RELAY_POLL_MS) || 1_000;
  const wait = Number(process.env.AUTO_RELAY_WAIT_MS) || 30 * 60_000;
  const t0 = Date.now();
  log(`open: waiting for the old chat to go quiet (${quiet / 1000} s, the last record a text answer)`);
  while (Date.now() - t0 < wait) {
    if (!readState().active) { log('open: the run was stopped while waiting — no chat opened'); return 0; }
    let age = 0, done = false;
    try { age = Date.now() - statSync(transcript).mtimeMs; done = age >= quiet && turnFinished(tailRecords(transcript)); }
    catch (e) { log(`open FAILED: transcript unreadable (${e.code || e.message}) — open a chat and send «${PROMPT}» by hand`); return 1; }
    if (done) {
      if (process.env.AUTO_RELAY_DRY === '1') { log(`open: [dry] would open a new chat in ${ROOT} with «${PROMPT}»`); return 0; }
      if (process.platform !== 'win32') { log(`open: only Windows is wired — open a chat and send «${PROMPT}» by hand`); return 1; }
      const r = spawnSync('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-WindowStyle', 'Hidden', '-File', join(DIR, 'open-chat.ps1'),
        '-Folder', ROOT, '-Prompt', PROMPT], { stdio: 'ignore', windowsHide: true });
      log(`open: open-chat.ps1 exit ${r.status}`);
      return r.status === 0 ? 0 : 1;
    }
    sleep(poll);
  }
  log(`open FAILED: the old chat did not go quiet in ${wait / 60000} min — open a chat and send «${PROMPT}» by hand`);
  return 1;
}

function check() {
  const t = [];
  const ok = (name, c) => t.push([name, !!c]);
  const s = { active: true, chain: 1, maxChats: 3, sessionId: 'run' };
  const yes = { farewell: true, statusCommitted: true };
  ok('stop: inactive → none', stopDecision({ active: false }, { session_id: 'run' }, yes).action === 'none');
  ok('stop: farewell + STATUS committed → spawn', stopDecision(s, { session_id: 'run' }, yes).action === 'spawn');
  ok('stop: not a farewell → none (a judge-wait stop of the closure turn opens nothing)', stopDecision(s, { session_id: 'run' }, { ...yes, farewell: false }).action === 'none');
  ok('stop: STATUS not committed → none', stopDecision(s, { session_id: 'run' }, { ...yes, statusCommitted: false }).action === 'none');
  ok('stop: another chat of the project → none', stopDecision(s, { session_id: 'side' }, yes).action === 'none');
  ok('stop: no bound id (env missing) → the farewell chat spawns', stopDecision({ ...s, sessionId: '' }, { session_id: 'x' }, yes).action === 'spawn');
  ok('stop: second farewell stop of the same chat → none (one spawn per chat)', stopDecision({ ...s, spawnedFrom: 'run' }, { session_id: 'run' }, yes).action === 'none');
  ok('stop: chat limit → limit', stopDecision({ ...s, chain: 3 }, { session_id: 'run' }, yes).action === 'limit');
  ok('stop: never blocks', ![stopDecision(s, { session_id: 'run' }, { farewell: false, statusCommitted: false })].some((d) => d.action === 'block'));
  ok('STATUS committed in the start second counts', committedAfter(1700000000, false, new Date(1700000000_400).toISOString()));
  ok('STATUS committed before the chat → not saved', !committedAfter(1699999990, false, new Date(1700000000_000).toISOString()));
  ok('STATUS with uncommitted edits → not saved', !committedAfter(1700000100, true, new Date(1700000000_000).toISOString()));
  ok('STATUS never committed → not saved', !committedAfter(NaN, false, new Date(1700000000_000).toISOString()));
  const A = (blocks, extra = {}) => ({ type: 'assistant', ...extra, message: { content: blocks } });
  const txt = { type: 'text', text: 'До встречи. <!-- farewell -->' };
  ok('turn: farewell then stop_hook_summary → over', turnFinished([A([txt]), { type: 'system', subtype: 'stop_hook_summary' }]));
  ok('turn: farewell then «Stop hook feedback» (blocked) → not over', !turnFinished([A([txt]), { type: 'user', isMeta: true, message: { content: 'Stop hook feedback:\nx' } },
    { type: 'attachment', attachment: { type: 'hook_blocking_error' } }]));
  ok('turn: blocked, then a one-line answer → over', turnFinished([A([txt]), { type: 'user', isMeta: true, message: { content: 'Stop hook feedback' } }, A([{ type: 'text', text: 'Новых знаний нет.' }])]));
  ok('turn: a tool call last → not over', !turnFinished([A([txt]), A([{ type: 'tool_use', name: 'Bash' }])]));
  ok('turn: thinking last → not over', !turnFinished([A([{ type: 'thinking', thinking: '…' }])]));
  ok('turn: a subagent answer last is skipped', !turnFinished([A([{ type: 'tool_use', name: 'Agent' }]), A([txt], { isSidechain: true })]));
  ok('turn: an unknown record type last → not over (fail closed)', !turnFinished([A([txt]), { type: 'something-new' }]));
  ok('prompt: «resume auto-relay continue» is the continue order', CONTINUE_PROMPT.test(PROMPT) && CONTINUE_PROMPT.test('auto-relay continue')
    && CONTINUE_PROMPT.test('/auto-relay continue'));
  ok('prompt: prose about the relay is not the order', !CONTINUE_PROMPT.test('как работает auto-relay continue?') && !CONTINUE_PROMPT.test('auto-relay continued'));
  for (const [n, c] of t) console.log(`${c ? '✓' : '✗'} ${n}`);
  const bad = t.filter(([, c]) => !c).length;
  console.log(`auto-relay self-test: ${t.length - bad}/${t.length}`);
  return bad ? 1 : 0;
}

function status() {
  const s = readState();
  if (!s.active) return `auto-relay OFF${s.stopReason ? ` · last stop: ${s.stopReason}` : ''}`;
  const committed = statusCommittedSince(ROOT, s.chatStartedAt);
  const d = stopDecision(s, { session_id: s.sessionId }, { farewell: true, statusCommitted: committed });
  const next = d.action === 'spawn' ? `after the farewell the next chat opens itself (${d.reason})`
    : d.action === 'limit' ? `the run ENDS with this chat (${d.reason}) — say so in the farewell` : `the next chat will NOT open: ${d.reason}`;
  return `auto-relay ON · chat ${s.chain || 1} of ${s.maxChats || 10} · task: ${s.task}\n${next}`;
}

// Direct run: compare REAL paths — a junction or symlinked folder breaks a plain compare.
const directRun = () => { try { return fileURLToPath(import.meta.url) === realpathSync(process.argv[1]); } catch { return false; } };
if (process.argv[1] && directRun()) {
  const cmd = process.argv[2];
  const s = readState();
  let code = 0;
  if (cmd === '--check') code = check();
  else if (cmd === 'start') {
    const task = arg('--task');
    if (!task) { console.error('start needs --task "<one line>"'); process.exit(2); }
    writeState({ active: true, task, chain: 1, maxChats: Number(arg('--max', 10)), startedAt: now(), chatStartedAt: now(), sessionId: sessionId(),
      spawnedFrom: '' });
    setAutonomy(true, 'auto-relay start');
    log(`start · chat 1 of ${readState().maxChats} · session ${sessionId() || '(none)'} · task: ${task}`);
    console.log(`auto-relay ON · chat 1 of ${readState().maxChats} · autonomy ON · write the run block into STATUS.md «Where to continue» and commit it`);
  } else if (cmd === 'continue') {
    if (!s.task) { console.error('no auto-relay run in state.json — start one with /auto-relay <task>'); process.exit(2); }
    if (!s.active) { console.error(`the run is OFF (${s.stopReason || 'stopped'}) — nothing to continue; ask the owner`); process.exit(2); }
    writeState({ ...s, chatStartedAt: now(), sessionId: sessionId(), spawnedFrom: '' });
    setAutonomy(true, 'auto-relay continue');
    log(`continue · chat ${s.chain} of ${s.maxChats} · session ${sessionId() || '(none)'}`);
    console.log(`auto-relay chat ${s.chain} of ${s.maxChats} · autonomy ON · task: ${s.task}\nnow /resume in full, then the run block in STATUS.md «Where to continue»`);
  } else if (cmd === 'stop') {
    writeState({ ...s, active: false, stoppedAt: now(), stopReason: arg('--reason', '') });
    const off = setAutonomy(false, 'auto-relay stop');
    log(`stop · ${arg('--reason', '')}`);
    console.log(`auto-relay OFF${off ? ' · autonomy OFF' : ''}`);
  } else if (cmd === 'status') console.log(status());
  else if (cmd === 'open') code = open();
  else { console.error('usage: relay.mjs start|continue|status|stop|open|--check'); code = 2; }
  process.exit(code);
}
