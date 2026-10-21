// G1 화면 수 = 라우트 수
//   --mode spec    (P1) 명세가 있고, 명세 라우트 수 == PRD 화면 수
//   --mode subset  (P3) 만든 page가 모두 명세에 있음 (아직 다 만들지 않아도 됨)
//   --mode full    (P4) page 목록 == 명세 라우트 목록
import { appPages, isMain, latestSpec, normRoute, prdScreenCount, printResult, result, specRoutes } from './lib/harness.mjs';

export function run({ mode = 'full' } = {}) {
  const F = [];
  const spec = latestSpec();
  if (!spec) return result('G1', [{ msg: 'docs/????-??-??spec.md 명세가 없음 → P1' }]);
  const routes = specRoutes(spec);
  const want = prdScreenCount();
  if (!routes.length) F.push({ file: spec, msg: '"한눈에 보기" 표에서 라우트를 읽지 못함 → P1' });
  if (want !== null && routes.length !== want) F.push({ file: spec, msg: `명세 라우트 ${routes.length}개 ≠ PRD 화면 ${want}개 → P1` });
  const specSet = new Set(routes.map((r) => normRoute(r.route)));
  if (specSet.size !== routes.length) F.push({ file: spec, msg: '명세에 같은 라우트가 두 번 있음 → P1' });
  if (mode === 'spec') return result('G1', F, { note: `명세 ${routes.length}개 / PRD ${want}개` });

  const pages = appPages().filter((p) => !p.redirectOnly);
  for (const p of pages) if (!specSet.has(p.norm)) F.push({ file: p.file, msg: `명세에 없는 라우트 "${p.route}"` });
  if (mode === 'full') {
    const have = new Set(pages.map((p) => p.norm));
    for (const r of routes) if (!have.has(normRoute(r.route))) F.push({ msg: `명세 라우트 "${r.route}"(${r.name})의 page가 없음 → P3` });
    if (pages.length !== routes.length) F.push({ msg: `page ${pages.length}개 ≠ 명세 라우트 ${routes.length}개` });
  }
  return result('G1', F, { note: `page ${pages.length}개 / 명세 ${routes.length}개` });
}

if (isMain(import.meta.url)) {
  const i = process.argv.indexOf('--mode');
  const r = run({ mode: i > 0 ? process.argv[i + 1] : 'full' });
  printResult(r);
  process.exit(r.pass ? 0 : 1);
}
