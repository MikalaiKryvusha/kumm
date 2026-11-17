#!/usr/bin/env node
// relay-hook — the hook of an auto-relay run (`.claude/auto-relay/relay.mjs`, skill /auto-relay), wired in .claude/settings.json:
//   UserPromptSubmit — a prompt «resume auto-relay continue» (sent by the opener into the next chat) gets the order: `relay.mjs continue` first, then
//                      /resume in full; the owner's stop word (autonomy-guard OFF: «стоп / пауза / хватит …») at the start of a prompt ends the run.
//   Stop             — the FAREWELL of an accepted closure (the `<!-- farewell -->` mark + an accepted /end-chat-soft|force, the same test the farewell
//                      hook and the autonomy guard use) in the run's chat, with STATUS.md committed after the chat started → spawn `relay.mjs open`
//                      detached: it waits until this chat is quiet and its turn is over, then opens the next chat. Never blocks a stop.
// The window gauge is NOT here: .claude/hooks/context-budget.mjs is the only one (soft closure from 80 %, forced from 92 %).
// Silent while the run is off. Any error → silent exit 0: a hook never breaks a session. Dry run for tests: env AUTO_RELAY_DRY=1 (passed to `open`).
// [NOT-TESTED] a live Stop of the extension — testcases/TC_auto_relay_2026-11-17.md
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { readState, writeState, stopDecision, statusCommittedSince, log, DIR, ROOT, CONTINUE_PROMPT, setAutonomy } from '../auto-relay/relay.mjs';
import { FAREWELL_MARK, closedEver } from '../../tools/hooks/farewell-capture.mjs';
import { OFF } from '../../tools/hooks/autonomy-guard.mjs';

const say = (event, text) => process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: event, additionalContext: text } }));

function spawnOpener(transcript) {
  spawn(process.execPath, [join(DIR, 'relay.mjs'), 'open', '--transcript', transcript], { detached: true, stdio: 'ignore', windowsHide: true,
    cwd: ROOT }).unref();
}

try {
  const input = JSON.parse(readFileSync(0, 'utf8'));
  const ev = input.hook_event_name;
  const state = readState();

  if (ev === 'UserPromptSubmit') {
    const prompt = String(input.prompt || '');
    if (CONTINUE_PROMPT.test(prompt)) {
      say(ev, state.active
        ? `ПРИКАЗ auto-relay: это чат ${state.chain || '?'} из ${state.maxChats || 10} автономного прогона «${state.task}». Первым действием `
          + '`node .claude/auto-relay/relay.mjs continue` (привязка чата, режим автономности), затем /resume целиком, затем блок прогона '
          + 'в STATUS.md «Where to continue» — продолжай с его следующего шага, автономно, до закрытия по окну (навык /auto-relay, режим «Продолжение»).'
        : 'auto-relay: прогон выключен (relay.mjs status) — продолжать нечего; /resume целиком и спроси владельца, что дальше.');
    } else if (state.active && OFF.test(prompt)) {
      writeState({ ...state, active: false, stoppedAt: new Date().toISOString(), stopReason: `the owner's stop word: ${prompt.slice(0, 60)}` });
      setAutonomy(false, 'auto-relay stop');
      log(`stop · the owner's stop word «${prompt.slice(0, 60)}»`);
      say(ev, 'auto-relay: слово владельца «стоп» — прогон выключен, следующий чат не откроется.');
    }
  } else if (ev === 'Stop' && state.active) {
    const last = typeof input.last_assistant_message === 'string' ? input.last_assistant_message : '';
    const marked = FAREWELL_MARK.test(last);
    const lines = marked && input.transcript_path ? readFileSync(input.transcript_path, 'utf8').split('\n') : [];
    const farewell = marked && closedEver(lines);
    const statusCommitted = farewell ? statusCommittedSince(ROOT, state.chatStartedAt) : false;
    const d = stopDecision(state, input, { farewell, statusCommitted });
    if (d.action === 'spawn') {
      writeState({ ...state, chain: (state.chain || 1) + 1, spawnedFrom: input.session_id || 'unknown', spawnedAt: new Date().toISOString() });
      log(`relay → ${d.reason} · from session ${input.session_id || '(none)'}`);
      spawnOpener(input.transcript_path);
    } else if (d.action === 'limit') {
      writeState({ ...state, active: false, stoppedAt: new Date().toISOString(), stopReason: d.reason });
      setAutonomy(false, 'auto-relay stop');
      log(`stopped: ${d.reason}`);
    } else if (marked) log(`no relay at this farewell: ${d.reason}`);   // only the farewell is worth a line: every other stop is normal
  }
} catch { /* silent: a hook never breaks the session */ }
process.exit(0);
