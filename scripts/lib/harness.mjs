// 하네스 공통 도구: 경로, 파일 찾기, 명세 읽기, 토큰 규칙, 지문(fingerprint)
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(process.env.CLAUDE_PROJECT_DIR || path.join(import.meta.dirname, '..', '..'));
export const rel = (p) => path.relative(ROOT, path.resolve(ROOT, p)).split(path.sep).join('/');
export const abs = (p) => path.join(ROOT, p);
export const exists = (p) => fs.existsSync(abs(p));
export const read = (p) => fs.readFileSync(abs(p), 'utf8');

export function walk(dir, exts) {
  const out = [];
  if (!exists(dir)) return out;
  for (const e of fs.readdirSync(abs(dir), { withFileTypes: true })) {
    const p = `${dir}/${e.name}`;
    if (e.isDirectory()) out.push(...walk(p, exts));
    else if (!exts || exts.includes(path.extname(e.name))) out.push(p);
  }
  return out.sort();
}

// ---------- 명세 / 라우트 ----------
export const SCREENS = ['요금제 목록', '요금제 상세', '변경 신청 확인', '변경 완료'];

export function latestSpec() {
  if (!exists('docs')) return null;
  const files = fs.readdirSync(abs('docs')).filter((f) => /^\d{4}-\d{2}-\d{2}spec\.md$/.test(f)).sort();
  return files.length ? `docs/${files.at(-1)}` : null;
}

export const normRoute = (r) =>
  ('/' + r.replace(/\?.*$/, '').split('/').filter(Boolean).map((s) => (/^(:|\[).+/.test(s) ? ':param' : s)).join('/')).replace(/\/+$/, '') || '/';

// 명세 "한눈에 보기" 표에서 { name, route } 목록을 읽는다
export function specRoutes(specPath = latestSpec()) {
  if (!specPath) return null;
  const text = read(specPath);
  const sec = text.split(/^## /m).find((s) => s.startsWith('한눈에 보기'));
  if (!sec) return [];
  const rows = [];
  for (const line of sec.split('\n')) {
    const cells = line.split('|').map((c) => c.trim());
    if (cells.length < 4 || !/^\d+$/.test(cells[1])) continue;
    const m = cells[3].match(/`([^`]+)`/);
    if (m) rows.push({ name: cells[2], route: m[1] });
  }
  return rows;
}

export function prdScreenCount() {
  const m = read('docs/PRD.md').match(/화면\s*(\d+)개/);
  return m ? Number(m[1]) : null;
}

// app/ 아래 page 파일 → 라우트. _폴더, (그룹), @슬롯 은 주소에서 뺀다
export function appPages() {
  return walk('app', ['.tsx', '.ts', '.jsx', '.js'])
    .filter((f) => /\/page\.(t|j)sx?$/.test(f))
    .filter((f) => !f.split('/').some((s) => s.startsWith('_')))
    .map((file) => {
      const segs = file.split('/').slice(1, -1).filter((s) => !/^\(.*\)$/.test(s) && !s.startsWith('@'));
      const src = read(file);
      const redirectOnly = /\bredirect\s*\(/.test(src) && !/<[A-Za-z]/.test(src);
      return { file, route: '/' + segs.join('/'), norm: normRoute('/' + segs.join('/')), redirectOnly };
    });
}

// ---------- 주석 지우기 (줄 번호 유지) ----------
export function stripComments(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/(^|[^:'"`\w])\/\/.*$/gm, (m, p) => p + ' '.repeat(m.length - p.length));
}
export const lineOf = (src, idx) => src.slice(0, idx).split('\n').length;

// ---------- 토큰 ----------
export function loadTokens() {
  return JSON.parse(read('docs/tokens.json'));
}
const key = (k) => k.split('/').pop();

// tokens.json → 허용 이름 모음
export function tokenSets(t = loadTokens()) {
  const semantic = Object.keys(t.semantic).map((k) => k.replace(/\//g, '-'));
  const spacing = Object.keys(t.spacing).map(key);
  const radius = Object.keys(t.radius).map(key);
  const text = Object.keys(t.typography).filter((k) => k.startsWith('font-size/')).map(key);
  const vars = new Set([
    ...semantic.map((s) => `--color-${s}`),
    ...spacing.map((s) => `--spacing-${s}`),
    ...radius.map((s) => `--radius-${s}`),
    ...text.map((s) => `--text-${s}`),
    '--font-sans',
  ]);
  return { semantic: new Set(semantic), spacing: new Set(spacing), radius: new Set(radius), text: new Set(text), vars };
}

const SPACING_PREFIX = /^-?(p[xytrblse]?|m[xytrblse]?|gap(-[xy])?|space-[xy]|inset(-[xy])?|top|right|bottom|left|start|end|w|h|min-w|min-h|max-w|max-h|size|basis|translate-[xy]|scroll-[mp][xytrblse]?|leading)-(.+)$/;
const SPACING_WORDS = new Set(['auto', 'full', 'screen', 'svh', 'dvh', 'lvh', 'svw', 'dvw', 'min', 'max', 'fit', 'none']);
const COLOR_PREFIX = /^(bg|text|border(-[trblxyse])?|ring|outline|fill|stroke|divide|placeholder|accent|caret|decoration)-(.+)$/;
const COLOR_WORDS = new Set(['transparent', 'current', 'inherit']);
const TEXT_WORDS = new Set(['left', 'center', 'right', 'justify', 'start', 'end', 'wrap', 'nowrap', 'balance', 'pretty', 'ellipsis', 'clip']);
const BORDER_WORDS = new Set(['0', 'solid', 'dashed', 'dotted', 'none', 'collapse', 'separate']);
const RADIUS_PREFIX = /^rounded(-(t|b|l|r|s|e|tl|tr|bl|br|ss|se|es|ee))?(-(.+))?$/;
const FONT_OK = new Set(['font-medium', 'font-semibold', 'font-bold', 'font-sans']);

// Tailwind 클래스 1개 검사. 문제가 없으면 null을 돌려준다
function checkClass(cls, sets) {
  const base = cls.split(':').pop().replace(/^!|!$/g, '');
  if (/\[/.test(base)) return base.includes('[390px]') ? null : `임의 값 클래스 "${cls}" 금지`;
  if (base.startsWith('font-')) return FONT_OK.has(base) ? null : `"${cls}": 굵기는 font-medium/semibold/bold만`;
  let m = base.match(RADIUS_PREFIX);
  if (m) return !m[4] || sets.radius.has(m[4]) || m[4] === 'none' ? null : `"${cls}": radius 토큰이 아님`;
  m = base.match(SPACING_PREFIX);
  if (m) {
    const v = m.at(-1);
    return sets.spacing.has(v) || SPACING_WORDS.has(v) || /^\d+\/\d+$/.test(v) ? null : `"${cls}": spacing 토큰이 아님`;
  }
  m = base.match(COLOR_PREFIX);
  if (m) {
    const [, pre, , v] = m;
    if (sets.semantic.has(v) || COLOR_WORDS.has(v)) return null;
    if (pre === 'text' && (sets.text.has(v) || TEXT_WORDS.has(v))) return null;
    if (pre.startsWith('border') && BORDER_WORDS.has(v)) return null;
    if (pre === 'bg' && /^(cover|contain|center|no-repeat|fixed|local|scroll)$/.test(v)) return null;
    if (pre === 'outline' && /^(none|0|hidden)$/.test(v)) return null;
    return `"${cls}": semantic 색 토큰이 아님`;
  }
  return null;
}

// 파일 내용에서 토큰 밖 값을 찾는다 → [{ line, msg }]
export function tokenViolations(src, file, sets = tokenSets()) {
  const out = [];
  const code = stripComments(src);
  const add = (idx, msg) => out.push({ file, line: lineOf(code, idx), msg });
  for (const m of code.matchAll(/#[0-9a-fA-F]{3,8}\b/g)) add(m.index, `색 직접 쓰기 "${m[0]}" 금지 → semantic 토큰`);
  for (const m of code.matchAll(/\b(rgba?|hsla?|oklch)\s*\(/g)) add(m.index, `색 함수 "${m[1]}()" 금지 → semantic 토큰`);
  for (const m of code.matchAll(/(?<![\w-])(\d*\.?\d+)(px|rem|em)\b/g)) {
    if (Number(m[1]) === 0 || m[0] === '390px') continue;
    add(m.index, `길이 직접 쓰기 "${m[0]}" 금지 → spacing/radius/font-size 토큰`);
  }
  for (const m of code.matchAll(/var\(\s*(--[\w-]+)/g)) if (!sets.vars.has(m[1])) add(m.index, `tokens.json에 없는 변수 "${m[1]}"`);
  if (/\.(t|j)sx?$/.test(file)) {
    for (const m of code.matchAll(/(["'`])((?:(?!\1)[^\\\n]|\\.)*)\1/g)) {
      let pos = m.index + 1;
      for (const cls of m[2].split(/(\s+)/)) {
        if (cls.trim() && /^[!-]?[a-z][\w:/.\[\]#%-]*$/.test(cls)) {
          const msg = checkClass(cls, sets);
          if (msg) add(pos, msg);
        }
        pos += cls.length;
      }
    }
  }
  return out;
}

export const TOKEN_SCOPE = (f) =>
  /^(app|components)\//.test(f) && /\.(tsx?|jsx?|mjs|css)$/.test(f) && f !== 'app/tokens.css';

// ---------- 지문: 커밋 게이트가 "검증 뒤 바뀐 파일 없음"을 확인할 때 쓴다 ----------
export function fingerprint() {
  const h = crypto.createHash('sha256');
  for (const dir of ['app', 'components', 'docs', 'public']) {
    for (const f of walk(dir)) h.update(f + '\0').update(fs.readFileSync(abs(f))).update('\0');
  }
  return h.digest('hex');
}

export const result = (id, failures, extra = {}) => ({ id, pass: failures.length === 0, failures, ...extra });

export function printResult(r) {
  console.log(`${r.pass ? 'PASS' : 'FAIL'} ${r.id}${r.note ? ` (${r.note})` : ''}`);
  for (const f of r.failures) console.log(`  - ${f.file ? `${f.file}${f.line ? ':' + f.line : ''} ` : ''}${f.msg}`);
}

export const isMain = (url) => !!process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(url);
