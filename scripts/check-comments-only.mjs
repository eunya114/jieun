// G7 P5(기획자 주석)에서 주석이 아닌 줄의 변경 0줄
//   --base <commit>  비교 기준 (기본: .harness/state.json의 lastPassCommit, 없으면 HEAD)
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import { abs, exists, isMain, printResult, result } from './lib/harness.mjs';

const COMMENT = /^\s*(\/\/|\/\*|\*|\*\/|\{\s*\/\*.*\*\/\s*\}|<!--)|^\s*$/;

export function run({ base } = {}) {
  if (!base && exists('.harness/state.json')) base = JSON.parse(fs.readFileSync(abs('.harness/state.json'), 'utf8')).lastPassCommit;
  base ||= 'HEAD';
  const F = [];
  let diff;
  try {
    diff = execFileSync('git', ['diff', '--unified=0', '--no-color', base, '--', 'app', 'components'], { cwd: abs('.'), encoding: 'utf8' });
  } catch (e) {
    return result('G7', [{ msg: `git diff 실패 (base ${base}): ${e.message.split('\n')[0]}` }]);
  }
  const untracked = execFileSync('git', ['ls-files', '--others', '--exclude-standard', 'app', 'components'], { cwd: abs('.'), encoding: 'utf8' }).trim();
  if (untracked) for (const f of untracked.split('\n')) F.push({ file: f, msg: 'P5에서 새 파일을 만들면 안 됨' });
  let file = '', line = 0;
  for (const l of diff.split('\n')) {
    if (l.startsWith('+++ ')) { file = l.slice(6); continue; }
    if (l.startsWith('--- ')) continue;
    const h = l.match(/^@@ -\d+(?:,\d+)? \+(\d+)/);
    if (h) { line = Number(h[1]); continue; }
    if (l.startsWith('-')) F.push({ file, line, msg: `코드 줄이 지워지거나 바뀜: ${l.slice(1, 60).trim()}` });
    else if (l.startsWith('+')) {
      if (!COMMENT.test(l.slice(1))) F.push({ file, line, msg: `주석이 아닌 줄이 추가됨: ${l.slice(1, 60).trim()}` });
      line++;
    }
  }
  return result('G7', F, { note: `기준 ${base}` });
}

if (isMain(import.meta.url)) {
  const i = process.argv.indexOf('--base');
  const r = run({ base: i > 0 ? process.argv[i + 1] : undefined });
  printResult(r);
  process.exit(r.pass ? 0 : 1);
}
