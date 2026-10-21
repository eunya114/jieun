// 단계별 게이트를 돌리고 .harness/report.json 에 쓴다. 전부 통과하면 종료 코드 0.
//   node scripts/verify-all.mjs --phase P1|P2|P3|P4|P5 [--screen <화면 이름>]
// 같은 게이트가 3번 연속 실패하면 STOP 을 출력한다 (attempts 는 .harness/state.json 에 기록).
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import { abs, exists, fingerprint, printResult, result } from './lib/harness.mjs';
import * as routes from './check-routes.mjs';
import * as tokens from './check-tokens.mjs';
import * as forbidden from './check-forbidden.mjs';
import * as scenarios from './check-scenarios.mjs';
import * as commentsOnly from './check-comments-only.mjs';

const RETURN_TO = { G1: 'P1', G2: 'P2/P3', G3: 'P3', G4: 'P3', G5: 'P3', G7: 'P5' };

function npm(script) {
  if (!exists('node_modules')) return [{ msg: 'node_modules 없음 → npm install' }];
  const r = spawnSync('npm', ['run', script], { cwd: abs('.'), encoding: 'utf8', shell: true });
  if (r.status === 0) return [];
  const tail = `${r.stdout}\n${r.stderr}`.trim().split('\n').slice(-15).join('\n');
  return [{ msg: `npm run ${script} 실패 (exit ${r.status})\n${tail}` }];
}
const G5 = () => result('G5', [...npm('lint'), ...npm('build')]);

const PHASES = {
  P1: async () => [routes.run({ mode: 'spec' })],
  P2: async () => [tokens.run({ scope: 'components' }), G5()],
  P3: async () => {
    const out = [routes.run({ mode: 'subset' }), tokens.run({ scope: 'all' }), forbidden.run({ mode: 'subset' })];
    const g5 = G5();
    out.push(g5, await scenarios.run({ mode: 'subset', html: g5.pass }));
    return out;
  },
  P4: async () => {
    const out = [routes.run({ mode: 'full' }), tokens.run({ scope: 'all' }), forbidden.run({ mode: 'full' })];
    const g5 = G5();
    out.push(g5, await scenarios.run({ mode: 'full', html: g5.pass }));
    return out;
  },
  P5: async () => [commentsOnly.run(), tokens.run({ scope: 'all' }), G5()],
};

const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : undefined; };
const phase = arg('--phase');
if (!PHASES[phase]) {
  console.error('사용법: node scripts/verify-all.mjs --phase P1|P2|P3|P4|P5 [--screen <화면>]');
  process.exit(2);
}

const gates = await PHASES[phase]();
for (const g of gates) printResult(g);
const pass = gates.every((g) => g.pass);

fs.mkdirSync(abs('.harness'), { recursive: true });
const statePath = abs('.harness/state.json');
const state = exists('.harness/state.json') ? JSON.parse(fs.readFileSync(statePath, 'utf8')) : { attempts: {} };
state.attempts ||= {};
const stop = [];
for (const g of gates) {
  const k = `${phase}:${g.id}`;
  state.attempts[k] = g.pass ? 0 : (state.attempts[k] || 0) + 1;
  if (state.attempts[k] >= 3) stop.push(g.id);
}
fs.writeFileSync(statePath, JSON.stringify(state, null, 2) + '\n');

const report = {
  phase,
  screen: arg('--screen') ?? null,
  at: new Date().toISOString(),
  pass,
  fingerprint: fingerprint(),
  gates: gates.map((g) => ({ ...g, returnTo: g.pass ? null : RETURN_TO[g.id] })),
  stop,
};
fs.writeFileSync(abs('.harness/report.json'), JSON.stringify(report, null, 2) + '\n');

console.log(`\n${phase} ${pass ? 'PASS' : 'FAIL'} → .harness/report.json`);
if (stop.length) console.log(`STOP: ${stop.join(', ')} 3번 연속 실패. 사용자에게 보고하고 멈추세요.`);
process.exit(pass ? 0 : 1);
