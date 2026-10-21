// G2 토큰 밖 값 거부: app/ · components/ 에 쓰는 순간, 새로 들어가는 글자에서 토큰 밖 값을 찾으면 막는다
import { deny, newText, targetPath } from './lib.mjs';
import { TOKEN_SCOPE, tokenViolations } from '../../scripts/lib/harness.mjs';

const p = targetPath();
if (!p) process.exit(0);
if (p === 'app/tokens.css') deny('G2', 'app/tokens.css 는 자동 생성 파일이에요. docs/tokens.json 을 고친 뒤 node scripts/build-tokens.mjs 로 만들어요.');
if (!TOKEN_SCOPE(p)) process.exit(0);

const v = tokenViolations(newText(), p);
if (v.length) {
  const list = v.slice(0, 10).map((x) => `  - (새 글자 ${x.line}번째 줄) ${x.msg}`).join('\n');
  deny('G2', `${p}: 토큰 밖 값 ${v.length}개\n${list}\n쓸 수 있는 이름은 app/tokens.css 에 있어요. 필요한 토큰이 없으면 멈추고 보고하세요.`);
}
process.exit(0);
