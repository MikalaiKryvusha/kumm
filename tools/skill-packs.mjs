#!/usr/bin/env node
// skill-packs.mjs — the third-party skill packs KUMM uses, linked from D:/work/ai_sandbox/_tools into .claude/skills.
//
// The packs live in _tools, KUMM keeps only references (the owner's word 2026-11-20 21:47 «ставить в _tools … а в KUMM ссылаться»).
// A skill folder in .claude/skills may be a symlink to a directory elsewhere — the documented Claude Code way
// (code.claude.com/docs/en/skills.md, «Symlinked folders»: "Claude Code reads SKILL.md from the target").
// The links are machine-local (absolute paths of this machine) and git-ignored; this script recreates and checks them.
// Which skills were taken and why the others were not — researches/agent-skill-packs/README.md.
//
// Usage:  node tools/skill-packs.mjs check   (default) every link, its target, its SKILL.md name, the .gitignore line, the REA tool chain
//         node tools/skill-packs.mjs link    create or repair the links, then check
// Exit 0 = every line OK; 1 = at least one FAIL.
// [TESTED: 2026-11-20 · testcases/reports/2026-11-20_skill-packs-links.md — red with no links, red with no .gitignore lines, red on a repointed link, link repaired it, green 10/10]

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TOOLS = 'D:/work/ai_sandbox/_tools';
const SKILLS_DIR = path.join(ROOT, '.claude', 'skills');

// One line per linked skill: the folder name in .claude/skills (= the skill's frontmatter name) and its target.
const LINKS = [
  // obra/superpowers (MIT) — clone in _tools/superpowers; update: git -C D:/work/ai_sandbox/_tools/superpowers pull
  { name: 'systematic-debugging', target: `${TOOLS}/superpowers/skills/systematic-debugging` },
  { name: 'verification-before-completion', target: `${TOOLS}/superpowers/skills/verification-before-completion` },
  { name: 'receiving-code-review', target: `${TOOLS}/superpowers/skills/receiving-code-review` },
  { name: 'requesting-code-review', target: `${TOOLS}/superpowers/skills/requesting-code-review` },
  { name: 'writing-skills', target: `${TOOLS}/superpowers/skills/writing-skills` },
  // morluto/rea (MIT) — npm package in _tools/node24/rea; update: npm i -g rea-agents@<v> --prefix D:/work/ai_sandbox/_tools/node24/rea
  { name: 'reverse-engineer-anything', target: `${TOOLS}/node24/rea/node_modules/rea-agents/skills/reverse-engineer-anything` },
];

// Files the REA MCP registration (claude mcp add --scope local rea …) depends on.
const REA_CHAIN = [
  { what: 'portable Node 24.22 (REA needs >= 24.22.1; the global 24.15 serves pm2)', file: `${TOOLS}/node24/node-v24.22.2-win-x64/node.exe` },
  { what: 'REA entry script', file: `${TOOLS}/node24/rea/node_modules/rea-agents/scripts/rea.mjs` },
  { what: 'Ghidra 12.2 headless', file: `${TOOLS}/ghidra/ghidra_12.2_PUBLIC/support/analyzeHeadless.bat` },
  { what: 'JDK 25 (Ghidra 12.2 application.java.min=25), machine-wide', file: 'C:/Program Files/Microsoft/jdk-25.0.5.102-hotspot/bin/java.exe' },
];

const norm = (p) => path.resolve(p).toLowerCase();
let failed = 0;
const ok = (msg) => console.log(`OK   ${msg}`);
const fail = (msg) => { failed++; console.log(`FAIL ${msg}`); };

function skillName(dir) {
  const file = path.join(dir, 'SKILL.md');
  if (!fs.existsSync(file)) return null;
  const m = fs.readFileSync(file, 'utf8').match(/^name:\s*["']?([\w-]+)/m);
  return m ? m[1] : '';
}

function link() {
  for (const { name, target } of LINKS) {
    const at = path.join(SKILLS_DIR, name);
    if (!fs.existsSync(target)) { fail(`${name}: target missing ${target} — clone or install the pack first`); continue; }
    let st = null;
    try { st = fs.lstatSync(at); } catch { /* absent */ }
    if (st && !st.isSymbolicLink()) { fail(`${name}: ${at} is a real folder, not a link — left untouched`); continue; }
    if (st) {
      if (norm(fs.readlinkSync(at)) === norm(target)) continue;
      fs.unlinkSync(at); // a link to another target: repoint it
    }
    try {
      fs.symlinkSync(target, at, 'dir');
    } catch (e) {
      // A directory symlink needs admin rights or Developer Mode on Windows; a junction does not (the docs are silent on junctions).
      if (e.code !== 'EPERM') throw e;
      fs.symlinkSync(target, at, 'junction');
      console.log(`WARN ${name}: no right to create a symlink, made a junction instead`);
    }
    console.log(`LINK ${name} -> ${target}`);
  }
}

function check() {
  const ignore = fs.readFileSync(path.join(ROOT, '.gitignore'), 'utf8').split(/\r?\n/).map((l) => l.trim());
  for (const { name, target } of LINKS) {
    const at = path.join(SKILLS_DIR, name);
    let st = null;
    try { st = fs.lstatSync(at); } catch { /* absent */ }
    if (!st) { fail(`${name}: no link in .claude/skills — run: node tools/skill-packs.mjs link`); continue; }
    if (!st.isSymbolicLink()) { fail(`${name}: a real folder, not a link to ${target}`); continue; }
    const real = fs.readlinkSync(at);
    if (norm(real) !== norm(target)) { fail(`${name}: points to ${real}, expected ${target}`); continue; }
    const got = skillName(at);
    if (got === null) { fail(`${name}: the link is dead or the target has no SKILL.md`); continue; }
    if (got !== name) { fail(`${name}: SKILL.md says name "${got}"`); continue; }
    if (!ignore.includes(`.claude/skills/${name}`)) { fail(`${name}: .gitignore lacks ".claude/skills/${name}" — a machine-local link would be committed`); continue; }
    ok(`${name} -> ${target}`);
  }
  for (const { what, file } of REA_CHAIN) {
    if (fs.existsSync(file)) ok(`REA chain: ${what}`); else fail(`REA chain: ${what} — missing ${file}`);
  }
}

const cmd = process.argv[2] || 'check';
if (cmd === 'link') link();
else if (cmd !== 'check') { console.error('usage: node tools/skill-packs.mjs [check|link]'); process.exit(2); }
check();
console.log(failed ? `skill-packs: ${failed} FAIL` : 'skill-packs: all OK');
process.exit(failed ? 1 : 0);
