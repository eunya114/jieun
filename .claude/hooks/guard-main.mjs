// 역할 경계: 메인 대화(오케스트레이터)는 app/ · components/ 를 직접 고치지 않는다.
// 서브에이전트 호출(agent_id 있음)은 통과. P5(기획자 주석)는 메인이 스킬을 직접 실행하므로 통과.
import fs from 'node:fs';
import path from 'node:path';
import { deny, input, ROOT, targetPath } from './lib.mjs';

const p = targetPath();
if (!p || !/^(app|components)\//.test(p)) process.exit(0);
if (input.agent_id || input.agent_type) process.exit(0);

let phase = null;
try {
  phase = JSON.parse(fs.readFileSync(path.join(ROOT, '.harness/state.json'), 'utf8')).phase;
} catch {}
if (phase === 'P5') process.exit(0);

deny('역할', `${p}: 오케스트레이터는 앱 코드를 직접 고치지 않아요. P2는 token-builder, P3는 screen-builder 에이전트에게 맡기세요.`);
