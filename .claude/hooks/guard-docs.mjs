// G6 문서 보호: docs/ 는 명세(docs/YYYY-MM-DDspec.md)와 docs/comments-report.md 만, reference/ 는 전부 쓰기 금지
import { deny, targetPath } from './lib.mjs';

const p = targetPath();
if (p && p.startsWith('reference/')) deny('G6', `${p}: reference/ 는 읽기 전용이에요.`);
if (p && p.startsWith('docs/') && !/^docs\/\d{4}-\d{2}-\d{2}spec\.md$/.test(p) && p !== 'docs/comments-report.md') {
  deny('G6', `${p}: docs/ 에는 화면 명세(docs/YYYY-MM-DDspec.md)와 docs/comments-report.md 만 쓸 수 있어요. 원본 문서는 사람이 고쳐요.`);
}
process.exit(0);
