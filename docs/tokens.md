<!--
[파일] 디자인 토큰 설명 (docs/tokens.json)
목적: 화면을 만들 때 쓰는 색·글자 크기·간격·모서리 값을 기획자도 알아볼 수 있게 풀어 쓴 문서예요.
      tokens.json은 주석을 달 수 없는 형식(JSON)이라, 원본은 그대로 두고 설명을 이 파일에 따로 모았어요.
관련 유저 스토리: 해당 없음 (모든 화면이 함께 쓰는 공통 값이에요)
화면 상태: 해당 없음
들어오는 곳: docs/design.md (토큰을 어디에 쓰는지 정리한 문서)
나가는 곳: 화면 코드 (색·크기 값을 직접 쓰지 않고 이 토큰 이름으로 가져다 써요)
-->

# 디자인 토큰 설명

> 원본: [tokens.json](tokens.json) · 쓰는 곳 자세히: [design.md](design.md)
> 원본은 고치지 않았어요. 이 문서는 설명만 담고 있어요.

## 토큰이 뭐예요?

**토큰**은 "자주 쓰는 디자인 값에 붙인 이름"이에요. 화면 코드에 `#FF2E98` 같은 값을 직접 쓰지 않고 `fill/primary`처럼 이름으로 쓰면, 나중에 색을 바꿀 때 이 파일 한 곳만 고치면 모든 화면이 같이 바뀌어요.

tokens.json은 5묶음으로 되어 있어요.

| 묶음 | 뜻 | 개수 |
|---|---|---|
| `primitive` | **물감 통**. 쓸 수 있는 색 자체 (회색 10단계, 핑크, 빨강 등) | 17 |
| `semantic` | **용도 이름**. "본문 글자색", "버튼 배경색"처럼 어디에 쓰는지로 붙인 이름. 대부분 물감 통의 색을 가리켜요 | 38 |
| `typography` | 글꼴과 글자 크기 | 11 |
| `spacing` | 요소 사이 간격, 안쪽 여백 | 18 |
| `radius` | 모서리 둥글기 | 15 |

화면에서는 **용도 이름(semantic)을 써요.** 값이 같아도 용도가 다르면 이름을 나눠 둬서, 예를 들어 "버튼 색만 바꾸기"가 가능해요.

---

## 1. 물감 통 (primitive)

| 이름 | 값 | 설명 |
|---|---|---|
| `gray/950` | #000000 | 검정 |
| `gray/900` | #181A1B | 거의 검정. 제목·본문 글자 |
| `gray/800` | #2D2D2D | 진한 회색. 어두운 배경 |
| `gray/600` | #66707A | 중간 회색. 보조 설명 글자 |
| `gray/500` | #878787 | 연한 중간 회색. 덜 중요한 글자 |
| `gray/400` | #B7BDC4 | 연한 회색. 입력 칸 안내 글자 |
| `gray/300` | #D9DCDF | 더 연한 회색. 테두리, 비활성 버튼 |
| `gray/200` | #EFF1F3 | 아주 연한 회색. 구분선, 약한 배경 |
| `gray/100` | #F7F7F7 | 거의 흰색. 화면 기본 배경 |
| `gray/0` | #FFFFFF | 흰색. 카드·헤더 배경 |
| `pink/500` | #FF2E98 | **U+ 브랜드 핑크**. 주요 버튼, 강조 |
| `pink/600` | #E6007E | 진한 핑크. 버튼을 누르기 직전(마우스 올림) 색 |
| `pink/50` | #FFF5FA | 아주 연한 핑크. 강조 정보의 약한 배경 |
| `pink/25` | #FFF8F5 | 가장 연한 핑크 (→ [확인 필요] 1) |
| `red/500` | #E30036 | 빨강. 오류 |
| `red/50` | #FFF0F3 | 아주 연한 빨강. 오류 안내 배경 |
| `black/10` | 검정 10% 투명 | 은은한 구분선 |

## 2. 용도 이름 (semantic)

### 글자색 (`text/…`)
| 이름 | 색 | 어디에 써요 |
|---|---|---|
| `text/primary` | gray/900 | 제목, 요금제 이름, 가격 등 주요 정보 |
| `text/secondary` | gray/600 | 설명, 보조 정보 |
| `text/tertiary` | gray/500 | 가장 덜 중요한 정보 |
| `text/accent` | pink/500 | 강조하고 싶은 글자 |
| `text/on-dark` | gray/0 | 핑크 버튼·어두운 배경 위 흰 글자 |
| `text/error` | red/500 | 오류 메시지 |
| `text/placeholder` | gray/400 | 입력 칸에 미리 적힌 안내 글자 |
| `text/on-disabled` | gray/600 | 누를 수 없는 상태의 글자 |

### 배경색 (`bg/…`, `surface/…`)
| 이름 | 색 | 어디에 써요 |
|---|---|---|
| `bg/surface` | gray/0 | 헤더, 카드, 하단 버튼 영역 (→ [확인 필요] 2) |
| `surface/default` | gray/0 | 흰 테두리 버튼 배경 (→ [확인 필요] 2) |
| `bg/default` | gray/100 | 화면 기본 배경 |
| `bg/subtle` | gray/200 | 누를 수 없는 입력 칸, 약한 배경 |
| `bg/inverse` | gray/800 | 어두운 배경 |
| `bg/accent-subtle` | pink/50 | 강조 정보의 약한 핑크 배경 |
| `bg/error-subtle` | red/50 | 오류 안내의 약한 빨강 배경 |

### 테두리·구분선 (`border/…`)
| 이름 | 색 | 어디에 써요 |
|---|---|---|
| `border/default` | gray/300 | 카드, 입력 칸, 흰 버튼의 기본 테두리 |
| `border/subtle` | gray/200 | 목록 줄 사이 구분선 |
| `border/medium` | gray/600 | **고른 요금제 카드**의 테두리 (핑크가 아니라 회색이에요) |
| `border/strong` | gray/900 | 아주 진한 테두리 |
| `border/divider` | black/10 | 은은한 구분선 |
| `border/focus` | pink/500 | 지금 입력 중인 칸의 테두리 |
| `border/error` | red/500 | 잘못 입력한 칸의 테두리 |

### 채움색 (`fill/…`, `brand/…`)
| 이름 | 색 | 어디에 써요 |
|---|---|---|
| `fill/primary` | pink/500 | **핑크 주요 버튼** (예: "이 요금제로 변경"), 체크된 체크박스 |
| `fill/primary-hover` | pink/600 | 핑크 버튼에 마우스를 올렸을 때 |
| `fill/accent` | pink/600 | 진한 핑크 강조 |
| `fill/secondary` | gray/900 | 검정 칩, 고른 필터 칩 |
| `fill/tertiary` | gray/200 | 연한 회색 채움 |
| `fill/disabled` | gray/300 | 누를 수 없는 버튼 배경 |
| `fill/disabled-strong` | gray/400 | 더 진한 비활성 배경 |
| `brand/primary` | pink/500 | U+ 브랜드 대표색 |

### 아이콘 (`icon/…`)
| 이름 | 색 | 어디에 써요 |
|---|---|---|
| `icon/default` | gray/600 | 기본 아이콘 |
| `icon/strong` | gray/900 | 진한 아이콘 |
| `icon/primary` | gray/950 | 검정 아이콘 |
| `icon/accent` | pink/500 | 강조 아이콘 |
| `icon/on-dark` | gray/0 | 어두운 배경 위 흰 아이콘 |
| `icon/disabled` | gray/300 | 누를 수 없는 아이콘 |
| `icon/error` | red/500 | 오류 아이콘 |

### 효과
| 이름 | 값 | 어디에 써요 |
|---|---|---|
| `effect/shadow-subtle` | 검정 5% 투명 | 아주 약한 그림자 색 (→ [확인 필요] 3) |

## 3. 글자 (typography)

- 글꼴 `font-family/family-font`: **Noto Sans KR** (모든 화면 공통)
- 글자 크기:

| 이름 | 크기 | 어디에 써요 |
|---|---|---|
| `font-size/heading-h1` | 32px | 가장 큰 제목 |
| `font-size/heading-h2` | 28px | 큰 금액 표시 |
| `font-size/heading-h3` | 24px | 화면 큰 제목 |
| `font-size/heading-h4` | 20px | 섹션 제목, 완료 제목 |
| `font-size/subtitle` | 18px | 요금제 이름, 주요 가격 |
| `font-size/body` | 16px | 기본 본문, 버튼 글자 |
| `font-size/body-small` | 14px | 카드 설명, 목록 값 |
| `font-size/caption` | 13px | 작은 안내, 태그 |
| `font-size/12` | 12px | 더 작은 보조 정보 |
| `font-size/caption-mini` | 10px | 아주 작은 칩 글자 |

(→ [확인 필요] 4)

## 4. 간격 (spacing)

이름의 숫자가 곧 크기(px)예요. 예: `spacing/16` = 16px.

| 구분 | 토큰 | 주로 쓰는 곳 |
|---|---|---|
| 아주 좁은 간격 | 0, 2, 4, 6 | 제목과 설명 사이, 칩 안쪽 |
| 요소 안쪽 간격 | 8, 10, 12 | 카드 안 요소 사이, 버튼 사이 |
| 기본 여백 | 16, 20, 24, 28 | **화면 좌우 여백(16)**, 요금제 카드 사이(16), 카드 안쪽(20) |
| 큰 묶음 간격 | 32, 40, 48 | 하단 버튼 아래 여백(32) |
| 아주 큰 여백 | 56, 60, 64, 80 | 큰 빈 공간 |

## 5. 모서리 둥글기 (radius)

이름의 숫자가 곧 크기(px)예요. 숫자가 클수록 더 둥글어요.

- 0, 2, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40
- `radius/999`, `radius/full`(9999px): 양 끝이 완전히 둥근 알약 모양 (→ [확인 필요] 5)

---

## [확인 필요] 목록

| # | 위치 | 내용 | 근거 |
|---|---|---|---|
| 1 | `tokens.json:16` `pink/25` | 물감 통에는 있지만 이를 가리키는 용도 이름이 없어요. 쓰지 않는 색인지, 용도 이름이 빠진 건지 확인이 필요해요. | tokens.json semantic 전체 |
| 2 | `tokens.json:32`, `:53` `bg/surface`, `surface/default` | 둘 다 흰색이고 이름 규칙도 달라요(`bg/` vs `surface/`). 일부러 나눈 건지, 하나로 합쳐도 되는지 확인이 필요해요. | design.md 1.3 |
| 3 | `tokens.json:59` `effect/shadow-subtle` | 다른 용도 이름과 달리 물감 통을 가리키지 않고 값을 직접 적었어요. 또 색만 있고 그림자 위치·퍼짐 정도는 없어요. | design.md 1.6 |
| 4 | `tokens.json:61-72` typography | 글자 크기만 있고 **줄 높이와 굵기**는 없어요. design.md에는 텍스트 스타일(예: `subtitle/bold` = 18/26, Bold)로 정의되어 있어서, 개발할 때 어디 값을 따를지 정해야 해요. 이름 규칙도 하나만 다르게 숫자예요(`font-size/12`). | design.md 2.2, 2.3 |
| 5 | `tokens.json:102`, `:107` `radius/full`, `radius/999` | 둘 다 "완전히 둥글게"라는 뜻이라 겹쳐요. 어느 쪽을 쓸지 정하면 좋아요. | design.md 3.3 |
