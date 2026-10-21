// 커밋 게이트: git commit 은 .harness/report.json 이 PASS 이고, 검증 뒤 app/·components/·docs/·public/ 이 바뀌지 않았을 때만
// (이 폴더들에 바뀐 파일이 하나도 없으면 하네스 설정 커밋으로 보고 통과)
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { deny, input, ROOT } from './lib.mjs';
import { fingerprint } from '../../scripts/lib/harness.mjs';

const cmd = String(input.tool_input?.command || '');
if (!/\bgit\b(\s+-\S+(\s+\S+)?)*\s+commit\b/.test(cmd)) process.exit(0);

const GUARDED = ['app', 'components', 'docs', 'public'];
const changed = execFileSync('git', ['status', '--porcelain', '--', ...GUARDED], { cwd: ROOT, encoding: 'utf8' }).trim();
if (!changed) process.exit(0);

const file = path.join(ROOT, '.harness/report.json');
if (!fs.existsSync(file)) deny('커밋', '.harness/report.json 이 없어요. node scripts/verify-all.mjs --phase <P1~P5> 를 먼저 돌리세요.');
const report = JSON.parse(fs.readFileSync(file, 'utf8'));
if (!report.pass) {
  const failed = report.gates.filter((g) => !g.pass).map((g) => `${g.id}→${g.returnTo}`).join(', ');
  deny('커밋', `${report.phase} 게이트 실패(${failed}) 상태는 커밋할 수 없어요.`);
}
if (report.fingerprint !== fingerprint()) deny('커밋', `${report.phase} 검증 뒤에 파일이 바뀌었어요. verify-all 을 다시 돌리세요.`);
process.exit(0);
