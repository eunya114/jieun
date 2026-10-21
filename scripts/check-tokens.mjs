// G2 토큰 밖 값 0개 + tokens.css가 tokens.json과 같음
//   --scope components  (P2) components/만 검사
//   --scope all         (P3~) app/ + components/ 검사
import { isMain, printResult, read, result, TOKEN_SCOPE, tokenSets, tokenViolations, walk } from './lib/harness.mjs';
import { check as checkSync } from './build-tokens.mjs';

export function run({ scope = 'all' } = {}) {
  const sets = tokenSets();
  const dirs = scope === 'components' ? ['components'] : ['app', 'components'];
  const F = [...checkSync().failures];
  let n = 0;
  for (const f of dirs.flatMap((d) => walk(d)).filter(TOKEN_SCOPE)) {
    n++;
    F.push(...tokenViolations(read(f), f, sets));
  }
  return result('G2', F, { note: `파일 ${n}개` });
}

if (isMain(import.meta.url)) {
  const i = process.argv.indexOf('--scope');
  const r = run({ scope: i > 0 ? process.argv[i + 1] : 'all' });
  printResult(r);
  process.exit(r.pass ? 0 : 1);
}
