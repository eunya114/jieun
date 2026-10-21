// 에이전트 편집 폴더 1개: node guard-folder.mjs <폴더> [--deny <경로> ...]
// 에이전트 frontmatter 의 hooks 에서 부른다. 정해진 폴더 밖 쓰기를 막는다.
import { deny, targetPath } from './lib.mjs';

const args = process.argv.slice(2);
const dir = args[0].replace(/\/+$/, '');
const denied = args.flatMap((a, i) => (args[i - 1] === '--deny' ? [a] : []));

const p = targetPath();
if (!p) process.exit(0);
if (p !== dir && !p.startsWith(dir + '/')) deny('폴더', `${p}: 이 에이전트는 ${dir}/ 폴더만 고칠 수 있어요.`);
if (denied.includes(p)) deny('폴더', `${p}: 이 파일은 고칠 수 없어요.`);
process.exit(0);
