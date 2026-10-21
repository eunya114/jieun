// G4 시나리오 판정 (어기면 안 되는 것 2: 변경할 수 없으면 변경 버튼이 막힘)
//   1부: app/_lib/plans.ts · mock.ts 계산 함수를 직접 불러 PRD 인수 조건과 비교
//   2부: 빌드된 앱을 next start로 띄우고 ?scenario=S1~S6 화면의 HTML을 검사 (--no-html 로 건너뜀)
// 아직 만들지 않은 화면의 HTML 검사는 건너뛴다 (P3 진행 중). --mode full 이면 건너뛴 화면도 실패.
import { spawn } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { abs, appPages, exists, isMain, normRoute, printResult, result, specRoutes } from './lib/harness.mjs';

const PORT = Number(process.env.HARNESS_PORT || 3100);
const LIB = ['app/_lib/mock.ts', 'app/_lib/plans.ts'];

async function libChecks(F) {
  if (!LIB.every(exists)) return F.push({ msg: `계약 파일 없음: ${LIB.filter((f) => !exists(f)).join(', ')} → P3` }), null;
  let mock, lib;
  try {
    mock = await import(pathToFileURL(abs(LIB[0])).href);
    lib = await import(pathToFileURL(abs(LIB[1])).href);
  } catch (e) {
    return F.push({ msg: `app/_lib 불러오기 실패 (다른 파일 import·enum 금지): ${e.message.split('\n')[0]}` }), null;
  }
  const eq = (id, got, want) => {
    if (JSON.stringify(got) !== JSON.stringify(want)) F.push({ msg: `${id}: 기대 ${JSON.stringify(want)}, 실제 ${JSON.stringify(got)}` });
  };
  const safe = (id, fn) => {
    try { fn(); } catch (e) { F.push({ msg: `${id}: 실행 오류 ${e.message}` }); }
  };
  const P = (n) => mock.plans?.find((p) => p.name === n || p.name === `${n} 요금제`);
  const [basic, std, unl] = ['기본', '표준', '무제한'].map(P);
  if (!basic || !std || !unl) return F.push({ msg: 'mock.plans에 기본/표준/무제한 요금제가 없음 (PRD 6-2)' }), null;
  const S = mock.scenarios || {};
  for (const k of ['S1', 'S2', 'S3', 'S4', 'S5', 'S6']) if (!S[k]) F.push({ msg: `mock.scenarios.${k} 없음 (PRD 6-3)` });

  safe('R-3 1GB당 금액', () => {
    eq('R-3 표준 1GB당 금액', lib.pricePerGB(std), 1930);
    eq('R-3 기본 1GB당 금액', lib.pricePerGB(basic), 3800);
    eq('R-3 무제한 1GB당 금액', lib.pricePerGB(unl), '무제한');
  });
  safe('금액 표기', () => eq('금액 표기 29000', lib.formatWon(29000), '29,000원'));
  safe('R-4 차이', () => eq('R-4 현재 표준 → 기본 카드', lib.diffText(basic, std), { fee: '월 10,000원 줄어듦', data: '데이터 10GB 줄어듦' }));
  safe('R-1 추천', () => {
    const rec = (k) => lib.recommendedPlanId(mock.plans, lib.averageUsage(S[k].usageGB));
    eq('R-1 S1 추천', rec('S1'), std.id);
    eq('R-1 S2 추천', rec('S2'), basic.id);
    eq('R-1 S3 추천', rec('S3'), unl.id);
    eq('R-2 S5 기록 1개월', S.S5.usageGB.length, 1);
    eq('R-2 S5 평균 = 그 달 값', lib.averageUsage(S.S5.usageGB), S.S5.usageGB[0]);
    eq('Q8 기록 없음 → 추천 없음', lib.recommendedPlanId(mock.plans, lib.averageUsage([])), null);
  });
  safe('S4 목록 밖 요금제', () => eq('S4 현재 요금제가 판매 목록 밖', mock.plans.some((p) => p.id === S.S4.currentPlan.id), false));
  safe('R-8 변경 가능일', () => {
    eq('R-8 10월 20일 → 11월 20일', lib.changeAvailableFrom('2026-10-20'), '2026-11-20');
    eq('Q4 1월 31일 → 2월 마지막 날', lib.changeAvailableFrom('2026-01-31'), '2026-02-28');
  });
  safe('canChange', () => {
    const s2 = lib.canChange(S.S2, std.id);
    eq('R-10 S2 사용 중 요금제 변경 막힘', s2.ok, false);
    if (!String(s2.reason).includes('지금 사용 중인 요금제예요')) F.push({ msg: 'R-10 S2 막힌 이유 문구 "지금 사용 중인 요금제예요" 없음 (PRD D-7)' });
    const s3 = lib.canChange(S.S3, unl.id);
    eq('R-8 S3 제한 기간 변경 막힘', s3.ok, false);
    if (!/부터 변경할 수 있어요/.test(String(s3.reason))) F.push({ msg: 'R-8 S3 막힌 이유 문구 "○월 ○일부터 변경할 수 있어요" 없음 (PRD D-8)' });
    eq('S1 표준으로 변경 가능', lib.canChange(S.S1, std.id).ok, true);
  });
  safe('R-12 실패 시 유지', () => {
    eq('S6 failChange', S.S6.failChange, true);
    const before = JSON.stringify([S.S6.currentPlan.id, S.S6.lastChangedAt]);
    const target = mock.plans.find((p) => p.id !== S.S6.currentPlan.id);
    const r = lib.changePlan(S.S6, target.id);
    eq('R-12 S6 변경 실패', r.ok, false);
    eq('R-12 S6 요금제·마지막 변경일 그대로', JSON.stringify([r.scenario.currentPlan.id, r.scenario.lastChangedAt]), before);
  });
  return { mock, std, unl };
}

// ---------- HTML ----------
const buttons = (html) =>
  [...html.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/g)].map((m) => ({ attrs: m[1], text: m[2].replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ') }));
const isDisabled = (b) => /\sdisabled(=|\s|$)/.test(' ' + b.attrs);
const count = (html, s) => html.split(s).length - 1;

async function startServer() {
  const bin = abs('node_modules/next/dist/bin/next');
  if (!exists('node_modules/next/dist/bin/next')) throw new Error('node_modules 없음 → npm install');
  if (!exists('.next/BUILD_ID')) throw new Error('.next 빌드 없음 → npm run build (G5) 먼저');
  const p = spawn(process.execPath, [bin, 'start', '-p', String(PORT)], { cwd: abs('.'), stdio: 'ignore' });
  for (let i = 0; i < 60; i++) {
    try { await fetch(`http://localhost:${PORT}/`); return p; } catch { await new Promise((r) => setTimeout(r, 1000)); }
  }
  p.kill();
  throw new Error(`next start가 60초 안에 뜨지 않음 (port ${PORT})`);
}

async function htmlChecks(F, ctx, mode) {
  const routes = specRoutes() || [];
  const built = new Set(appPages().map((p) => p.norm));
  const R = (name) => routes.find((r) => r.name.includes(name));
  const url = (r, planId, sc) => {
    const p = r.route.replace(/\?.*$/, '').replace(/(:\w+|\[[^\]]+\])/g, planId);
    return `http://localhost:${PORT}${p}?scenario=${sc}&planId=${planId}`;
  };
  const cases = [];
  const add = (screen, planId, sc, fn) => {
    const r = R(screen);
    if (!r) return F.push({ msg: `명세에 "${screen}" 라우트 없음` });
    if (!built.has(normRoute(r.route))) return mode === 'full' && F.push({ msg: `"${screen}" page 없음 → HTML 검사 불가` });
    cases.push({ id: `${screen} ${sc}`, u: url(r, planId, sc), fn });
  };
  const { std, unl } = ctx;
  add('요금제 목록', std.id, 'S2', (h) => count(h, '사용 중') >= 1 || 'S2 목록에 "사용 중" 없음 (PRD L-6)');
  add('요금제 목록', std.id, 'S4', (h) => count(h, '사용 중') === 0 || 'S4 목록에 "사용 중"이 있음 (PRD L-6 인수 조건)');
  const changeBtn = (h) => buttons(h).find((b) => b.text.includes('이 요금제로 변경'));
  add('요금제 상세', std.id, 'S2', (h) => (changeBtn(h) && isDisabled(changeBtn(h)) && h.includes('지금 사용 중인 요금제예요')) || 'S2 표준 상세: 변경 버튼 disabled + "지금 사용 중인 요금제예요" 필요 (PRD D-7)');
  add('요금제 상세', unl.id, 'S3', (h) => (changeBtn(h) && isDisabled(changeBtn(h)) && /부터 변경할 수 있어요/.test(h)) || 'S3 상세: 변경 버튼 disabled + "○월 ○일부터 변경할 수 있어요" 필요 (PRD D-8)');
  add('요금제 상세', std.id, 'S1', (h) => (changeBtn(h) && !isDisabled(changeBtn(h))) || 'S1 표준 상세: 변경 버튼이 있어야 하고 막히면 안 됨 (PRD D-5)');
  add('변경 신청 확인', std.id, 'S1', (h) => {
    const b = buttons(h).find((x) => x.text.trim() === '요금제 변경' || x.text.includes('요금제 변경'));
    if (!b || !isDisabled(b)) return '확인 화면 첫 상태: "요금제 변경" 버튼이 disabled여야 함 (PRD C-6)';
    const inputs = [...h.matchAll(/<input\b[^>]*>/g)].map((m) => m[0]);
    return (inputs.length === 1 && /type="checkbox"/.test(inputs[0])) || `확인 화면 입력 요소 ${inputs.length}개 → 약관 checkbox 1개만 (PRD C-4)`;
  });
  add('변경 완료', std.id, 'S1', () => true);

  if (!cases.length) return;
  let server;
  try { server = await startServer(); } catch (e) { return F.push({ msg: e.message }); }
  try {
    for (const c of cases) {
      const res = await fetch(c.u, { redirect: 'follow' });
      const h = await res.text();
      if (res.status >= 500) { F.push({ msg: `${c.id}: HTTP ${res.status}` }); continue; }
      const ok = c.fn(h);
      if (ok !== true) F.push({ msg: `${c.id}: ${ok}` });
      if (!c.id.startsWith('변경 신청 확인') && /<(input|textarea|select)\b/.test(h)) F.push({ msg: `${c.id}: 입력 요소가 있음 (PRD C-4)` });
    }
  } finally {
    server.kill();
  }
}

export async function run({ mode = 'full', html = true } = {}) {
  const F = [];
  const ctx = await libChecks(F);
  if (ctx && html) await htmlChecks(F, ctx, mode);
  return result('G4', F, { note: html ? '계산 + HTML' : '계산만' });
}

if (isMain(import.meta.url)) {
  const i = process.argv.indexOf('--mode');
  const r = await run({ mode: i > 0 ? process.argv[i + 1] : 'full', html: !process.argv.includes('--no-html') });
  printResult(r);
  process.exit(r.pass ? 0 : 1);
}
