// G3 입력란 금지 (어기면 안 되는 것 1: PRD C-4, R-11)
// - textarea / select / contentEditable 0개
// - <input>은 components/ 안에서 type="checkbox"로만 허용
// - app/ 에서 <Checkbox>는 "변경 신청 확인" 라우트에만, 최대 1개 (--mode full 이면 정확히 1개)
// - 개인정보 필드 이름·라벨·값 0개
import { isMain, lineOf, normRoute, printResult, read, result, specRoutes, stripComments, walk } from './lib/harness.mjs';

const PII_NAME = /\b(userName|customerName|phone\w*|tel|mobile\w*|email\w*|card(Number|No|Num|Expiry|Holder)\w*|expir\w*|birth\w*|address\w*|ssn|resident\w*)\b/gi;
const PII_LABEL = /(연락처|휴대폰\s*번호|전화번호|이메일|카드\s*번호|유효\s*기간|주민\s*등록|생년월일|주소)/g;
const PII_VALUE = [/01\d-?\d{3,4}-?\d{4}/g, /[\w.+-]+@[\w-]+\.[\w.]+/g, /\b\d{4}-\d{4}-\d{4}-\d{4}\b/g];

// "변경 신청 확인" 라우트 → app 안의 폴더 경로 접두어
function confirmDir() {
  const r = (specRoutes() || []).find((x) => x.name.includes('변경 신청 확인'));
  if (!r) return null;
  return normRoute(r.route).split('/').filter(Boolean).map((s) => (s === ':param' ? '[^/]+' : s)).join('/');
}

export function run({ mode = 'full' } = {}) {
  const F = [];
  const files = [...walk('app'), ...walk('components')].filter((f) => /\.(t|j)sx?$/.test(f));
  const cdir = confirmDir();
  const inConfirm = (f) => cdir && new RegExp(`^app/(\\([^/]+\\)/)*${cdir}/`).test(f);
  let checkboxUses = 0;

  for (const f of files) {
    const code = stripComments(read(f));
    const add = (i, msg) => F.push({ file: f, line: lineOf(code, i), msg });
    for (const m of code.matchAll(/<(textarea|select)\b|contentEditable/g)) add(m.index, `입력 요소 "${m[0]}" 금지 (PRD C-4)`);
    for (const m of code.matchAll(/<input\b[^>]*>/g)) {
      if (!f.startsWith('components/')) add(m.index, '<input>은 app/에서 직접 쓰지 않음 → components/Checkbox 사용');
      else if (!/type\s*=\s*(\{\s*)?["'`]checkbox["'`]/.test(m[0])) add(m.index, '<input>은 type="checkbox"만 허용 (PRD C-4)');
    }
    if (f.startsWith('app/')) {
      for (const m of code.matchAll(/<Checkbox\b/g)) {
        checkboxUses++;
        if (!inConfirm(f)) add(m.index, 'Checkbox는 "변경 신청 확인" 화면에서만 사용');
      }
    }
    for (const m of code.matchAll(PII_NAME)) add(m.index, `개인정보 필드 이름 "${m[0]}" 금지 (PRD R-11)`);
    for (const m of code.matchAll(PII_LABEL)) add(m.index, `개인정보 입력 라벨 "${m[0]}" 금지 (PRD R-11)`);
    for (const re of PII_VALUE) for (const m of code.matchAll(re)) add(m.index, '개인정보로 보이는 값 금지 (값은 옮겨 적지 않음)');
  }
  if (checkboxUses > 1) F.push({ msg: `약관 Checkbox ${checkboxUses}개 → 1개만 허용 (PRD C-5)` });
  if (mode === 'full' && checkboxUses !== 1) F.push({ msg: `약관 Checkbox ${checkboxUses}개 → 변경 신청 확인 화면에 정확히 1개 (PRD C-5)` });
  return result('G3', F, { note: `파일 ${files.length}개, Checkbox ${checkboxUses}개` });
}

if (isMain(import.meta.url)) {
  const i = process.argv.indexOf('--mode');
  const r = run({ mode: i > 0 ? process.argv[i + 1] : 'full' });
  printResult(r);
  process.exit(r.pass ? 0 : 1);
}
