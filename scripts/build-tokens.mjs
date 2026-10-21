// docs/tokens.json → app/tokens.css (Tailwind v4 @theme). 이 파일만 tokens.css를 만든다.
//   node scripts/build-tokens.mjs            app/tokens.css 쓰기
//   node scripts/build-tokens.mjs --check    커밋된 tokens.css와 같은지 확인만 (G2)
//   node scripts/build-tokens.mjs --out <p>  다른 경로에 쓰기 (점검용)
import fs from 'node:fs';
import path from 'node:path';
import { abs, exists, isMain, loadTokens, read, result, printResult } from './lib/harness.mjs';

const OUT = 'app/tokens.css';
const name = (k) => k.split('/').pop();
const css = (k) => k.replace(/\//g, '-');
const ref = (v) => v.replace(/\{primitive\.([^}]+)\}/g, (_, k) => `var(--primitive-${css(k)})`);

export function generate(t = loadTokens()) {
  const L = ['/* 자동 생성 파일: 손으로 고치지 마세요. 원본은 docs/tokens.json, 생성은 node scripts/build-tokens.mjs */', ''];
  L.push(':root {');
  for (const [k, v] of Object.entries(t.primitive)) L.push(`  --primitive-${css(k)}: ${v.$value};`);
  L.push('}', '', '@theme {');
  L.push('  --color-*: initial;', '  --spacing-*: initial;', '  --radius-*: initial;', '  --text-*: initial;', '');
  for (const [k, v] of Object.entries(t.semantic)) L.push(`  --color-${css(k)}: ${ref(v.$value)};`);
  L.push('');
  for (const [k, v] of Object.entries(t.spacing)) L.push(`  --spacing-${name(k)}: ${v.$value};`);
  L.push('');
  for (const [k, v] of Object.entries(t.radius)) L.push(`  --radius-${name(k)}: ${v.$value};`);
  L.push('');
  for (const [k, v] of Object.entries(t.typography)) {
    if (k.startsWith('font-size/')) L.push(`  --text-${name(k)}: ${v.$value};`);
    if (k.startsWith('font-family/')) L.push(`  --font-sans: "${v.$value}", sans-serif;`);
  }
  L.push('}', '');
  return L.join('\n');
}

export function check() {
  const want = generate();
  if (!exists(OUT)) return result('G2-sync', [{ file: OUT, msg: 'tokens.css가 없음 → node scripts/build-tokens.mjs' }]);
  const same = read(OUT).replace(/\r\n/g, '\n') === want;
  return result('G2-sync', same ? [] : [{ file: OUT, msg: 'tokens.json과 다름 (손으로 고쳤거나 다시 만들지 않음) → node scripts/build-tokens.mjs' }]);
}

if (isMain(import.meta.url)) {
  const args = process.argv.slice(2);
  if (args.includes('--check')) {
    const r = check();
    printResult(r);
    process.exit(r.pass ? 0 : 1);
  }
  const i = args.indexOf('--out');
  const out = i >= 0 ? path.resolve(args[i + 1]) : abs(OUT);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, generate());
  console.log(`tokens.css 생성: ${out}`);
}
