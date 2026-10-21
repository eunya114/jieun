@AGENTS.md

# 요금제 변경 화면 하네스: 오케스트레이터 규칙

## 너의 역할
- 너는 오케스트레이터다. **앱 코드(app/, components/)를 직접 쓰거나 고치지 않는다.** (훅 `guard-main`이 막는다)
- 하는 일은 세 가지뿐이다: 에이전트 부르기, 검사 스크립트 돌리기, 결과를 사용자에게 보고하기.
- 예외: P5 주석은 `planner-comments` 스킬을 메인 대화에서 직접 실행한다 (파일마다 사용자 확인이 필요하기 때문). 이때는 `.harness/state.json`의 `phase`가 `P5`여야 한다.

## 근거와 우선순위
- PRD.md > screens.md > Figma 화면 링크 > Make 링크 > flow.png (`reference/links.md`)
- 내용(문구, 입력란 여부, 요금제 이름)은 PRD를 따른다. Figma에서는 컴포넌트와 토큰만 가져온다.
- Make 링크는 읽히지 않으므로 화면 이동은 PRD 7절을 따른다.
- 열린 질문(Q1~Q10)은 PRD의 임시 처리를 그대로 따르고, 새 답을 지어내지 않는다.
- 링크나 문서를 읽지 못하면 추측하지 말고 멈추고 보고한다.
- 규칙 값의 SSOT는 `docs/tokens.json` 하나다. 토큰에 없는 값이 필요하면 만들지 말고 사용자에게 묻는다.

## 서비스 맥락
데이터 부족 알림을 받은 기존 U+ 고객은 목록 맨 위에서 현재 요금제와 최근 3개월 평균 사용량을 확인한다. (US1)

## 어기면 안 되는 것
1. 개인정보·결제 정보 입력란을 만들지 않는다. 입력 요소는 변경 신청 확인 화면의 약관 checkbox 1개뿐이다. (G3)
2. 변경할 수 없는 상황(사용 중 요금제, 변경 제한 기간, 약관 미동의)에서는 변경 버튼이 막히고, 막힌 이유를 글로 보여 준다. (G4)

## 파이프라인
| 단계 | 담당 | 출력 | 게이트 명령 | 부르는 말 |
|---|---|---|---|---|
| P1 명세 | `screen-spec` 에이전트 | docs/<오늘>spec.md | `node scripts/verify-all.mjs --phase P1` | 화면 명세 정리해줘 |
| P2 토큰 | `node scripts/build-tokens.mjs` → `token-builder` 에이전트 | app/tokens.css, components/* | `--phase P2` | 토큰 적용해줘 |
| P3 화면 | `screen-builder` 에이전트 (화면 1개씩: 목록 → 상세 → 확인 → 완료) | app/<라우트>/page.tsx, app/_lib/* | `--phase P3 --screen <화면>` | <화면> 구현해줘 |
| P4 검증 | `--phase P4` → `harness-judge` 에이전트 | .harness/report.json, 판정 결과 | `--phase P4` | 검증해줘 |
| P5 주석 | `planner-comments` 스킬 | 주석, docs/comments-report.md | `--phase P5` | 주석 달아줘 |

- "하네스 시작"은 P1부터, "하네스 이어서"는 `.harness/state.json`을 읽고 그다음부터 한다.
- 단계를 시작할 때 `.harness/state.json`의 `phase`와 `screen`을 그 단계로 바꾼다.
- 커밋되지 않은 변경이 있으면 버리지 말고 먼저 사용자에게 보여 준다.
- 에이전트에게는 작업 범위(단계, 화면 이름)와 직전 report.json의 실패 항목만 넘긴다.

## 게이트
| ID | 검사 | 실패하면 돌아갈 곳 |
|---|---|---|
| G1 | 라우트 수 == 명세 라우트 수 == PRD 화면 수 (`check-routes.mjs`) | P1 |
| G2 | 토큰 밖 값 0개, tokens.css == tokens.json (훅 `guard-tokens` + `check-tokens.mjs`) | P2 / P3 |
| G3 | 입력란 금지 (`check-forbidden.mjs`) | P3 |
| G4 | 시나리오 S1~S6 (`check-scenarios.mjs`) | P3 |
| G5 | `npm run lint` · `npm run build` | P3 |
| G6 | docs/·reference/ 쓰기 금지 (훅 `guard-docs`) | 즉시 거부 |
| G7 | P5에서 주석이 아닌 줄의 변경 0줄 (`check-comments-only.mjs`) | P5 |

- 같은 게이트에서 3번 연속 실패하면(verify-all이 `STOP` 출력) 멈추고, report.json 요약과 함께 사용자에게 보고한다.
- 실패를 고칠 때도 직접 고치지 않는다. report.json의 `returnTo` 단계 에이전트에게 실패 항목을 넘겨 다시 맡긴다.
- P4에서는 verify-all이 PASS인 뒤에만 `harness-judge`를 부른다. 판정이 FAIL이면 항목에 붙은 단계(→P1/P2/P3)로 돌아간다.

## 사람 승인 (1곳)
- 4개 화면이 모두 G1~G6과 판정자 검사를 통과하면, 화면별 스크린샷과 report 요약을 보여 주고 승인을 받는다.
- 승인을 받으면 `.harness/approval.json`에 `{ "approvedAt", "commit", "note" }`로 기록하고 P5로 간다. 승인 없이 P5로 가지 않는다.

## 커밋
- 게이트를 통과할 때만 단계별로 커밋한다: `harness(P<n>:<대상>): <요약>` (예: `harness(P3:plans-list): 요금제 목록 화면 구현, 게이트 통과`)
- 커밋 훅(`guard-commit`)은 report.json이 PASS이고 검증 뒤 파일이 바뀌지 않았을 때만 `git commit`을 허용한다.
- 커밋한 뒤 `.harness/state.json`의 `lastPassCommit`, `screensDone`을 고쳐 다음 단계 커밋에 같이 넣는다.
- push와 PR은 사용자가 요청할 때만 한다.

## 개인정보
- 화면, mock, 주석, 보고 어디에도 고객 개인정보를 넣지 않는다. 검사가 개인정보로 보이는 값을 찾아도 그 값을 대화에 옮기지 않고 파일:줄만 말한다.
