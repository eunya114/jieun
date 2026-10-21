// 훅 공통: stdin JSON 읽기, 대상 경로를 프로젝트 기준 상대 경로로, 거부(exit 2)
import fs from 'node:fs';
import path from 'node:path';

export const input = JSON.parse(fs.readFileSync(0, 'utf8') || '{}');
export const ROOT = path.resolve(process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd());

// Write/Edit/MultiEdit/NotebookEdit 대상 파일. 프로젝트 밖이면 '..'로 시작한다
export function targetPath() {
  const t = input.tool_input || {};
  const p = t.file_path || t.notebook_path || t.path;
  if (!p) return null;
  return path.relative(ROOT, path.resolve(ROOT, p)).split(path.sep).join('/');
}

// 이번 호출로 파일에 새로 들어갈 글자들
export function newText() {
  const t = input.tool_input || {};
  if (typeof t.content === 'string') return t.content;
  if (typeof t.new_string === 'string') return t.new_string;
  if (Array.isArray(t.edits)) return t.edits.map((e) => e.new_string || '').join('\n');
  if (typeof t.new_source === 'string') return t.new_source;
  return '';
}

export function deny(gate, msg) {
  process.stderr.write(`[하네스 ${gate}] ${msg}\n`);
  process.exit(2);
}
