# Design.md

현재 파일의 변수, 로컬 텍스트 스타일, Components 섹션 및 390×844 모바일 화면을 기준으로 정리한다.

- 단위는 별도 표기가 없으면 px이다.
- 모든 변수 컬렉션은 현재 `Default` 모드만 정의되어 있다.
- 표의 용도는 토큰의 의미와 실제 사용 예를 종합했다. 직접 사용을 확인하지 못한 스타일은 별도로 표시한다.
- 컴포넌트 정의와 화면별 적용값이 다른 경우 각각 구분한다.

## 1. 색 팔레트

### 1.1 적용 원칙

- UI에는 역할에 맞는 semantic 토큰을 사용한다.
- semantic 토큰은 대부분 primitive 색상 변수를 참조한다.
- 값이 같아도 역할이 다르면 토큰을 구분한다. 예: `text/accent`, `icon/accent`, `fill/primary`.
- 현재 다크 모드나 별도 테마는 정의되어 있지 않다.

### 1.2 텍스트

| semantic 토큰 | 값 | 참조 primitive | 쓰는 곳 |
| --- | --- | --- | --- |
| `text/primary` | #181A1B | `gray/900` | 제목, 본문 주요 정보, 요금제명, 가격, Secondary 버튼 레이블 |
| `text/secondary` | #66707A | `gray/600` | 설명, 보조 정보, Tag 레이블 |
| `text/tertiary` | #878787 | `gray/500` | 할인 전 가격 등 낮은 위계의 정보 |
| `text/accent` | #FF2E98 | `pink/500` | 할인율, 단계 표시 등 강조 텍스트 |
| `text/on-dark` | #FFFFFF | `gray/0` | Primary 버튼, 어두운 배경의 Chip 및 선택된 FilterChip |
| `text/error` | #E30036 | `red/500` | 입력 오류 메시지 |
| `text/placeholder` | #B7BDC4 | `gray/400` | 입력 전 안내 및 Input의 텍스트 |
| `text/on-disabled` | #66707A | `gray/600` | 비활성 상태의 텍스트용 |

주의: Input의 `filled`, `caution` 변형에서도 입력값에 `text/placeholder`가 연결되어 있다. 현재 정의를 기록한 것이며, 입력 완료 상태가 자동으로 `text/primary`로 전환되는 구조는 아니다.

### 1.3 배경과 표면

| semantic 토큰 | 값 | 참조 primitive | 쓰는 곳 |
| --- | --- | --- | --- |
| `bg/surface` | #FFFFFF | `gray/0` | Header, 카드, BottomCTA, 기본 선택 항목 |
| `surface/default` | #FFFFFF | `gray/0` | Secondary 버튼의 기본 배경 |
| `bg/default` | #F7F7F7 | `gray/100` | 기본 중립 배경, 선택된 OptionItem 배경 |
| `bg/subtle` | #EFF1F3 | `gray/200` | 비활성 Input, benefit Chip, 진행률 트랙 |
| `bg/inverse` | #2D2D2D | `gray/800` | 반전된 어두운 표면용 |
| `bg/accent-subtle` | #FFF5FA | `pink/50` | 할인·절약 정보 Chip |
| `bg/error-subtle` | #FFF0F3 | `red/50` | 오류 안내의 약한 배경용 |

`bg/surface`와 `surface/default`는 같은 색상이지만 별도 토큰으로 존재한다.

### 1.4 테두리와 구분선

| semantic 토큰 | 값 | 참조 primitive | 쓰는 곳 |
| --- | --- | --- | --- |
| `border/default` | #D9DCDF | `gray/300` | 기본 Input, 카드, Secondary 버튼, 선택 전 항목 |
| `border/subtle` | #EFF1F3 | `gray/200` | List/Row 하단 구분선, BottomCTA 경계, Tag 배경 |
| `border/strong` | #181A1B | `gray/900` | 강한 경계가 필요한 요소용 |
| `border/medium` | #66707A | `gray/600` | 선택된 Card/Plan 및 OptionItem 테두리 |
| `border/divider` | rgba(0, 0, 0, 0.10) | `black/10` | 반투명 검정 구분선용 |
| `border/focus` | #FF2E98 | `pink/500` | Input 포커스 경계 |
| `border/error` | #E30036 | `red/500` | Input 오류 경계 |

현재 선택 카드와 선택 옵션의 테두리는 핑크가 아니라 `border/medium`이다.

### 1.5 채움과 브랜드

| semantic 토큰 | 값 | 참조 primitive | 쓰는 곳 |
| --- | --- | --- | --- |
| `fill/primary` | #FF2E98 | `pink/500` | Primary 버튼, 활성 Checkbox, 선택 라디오, 진행률 바 |
| `fill/primary-hover` | #E6007E | `pink/600` | Primary 버튼 Hover |
| `fill/accent` | #E6007E | `pink/600` | 진한 강조 채움용 |
| `fill/secondary` | #181A1B | `gray/900` | package Chip, 선택된 FilterChip |
| `fill/tertiary` | #EFF1F3 | `gray/200` | 중립 보조 채움용 |
| `fill/disabled` | #D9DCDF | `gray/300` | 비활성 버튼 배경 |
| `fill/disabled-strong` | #B7BDC4 | `gray/400` | 더 강한 비활성 채움용 |
| `brand/primary` | #FF2E98 | `pink/500` | 브랜드 대표색 |

### 1.6 아이콘과 효과

| semantic 토큰 | 값 | 참조 primitive | 쓰는 곳 |
| --- | --- | --- | --- |
| `icon/default` | #66707A | `gray/600` | 기본 보조 아이콘 |
| `icon/strong` | #181A1B | `gray/900` | 강조 아이콘 |
| `icon/primary` | #000000 | `gray/950` | 검정 기본 아이콘 |
| `icon/accent` | #FF2E98 | `pink/500` | 강조 아이콘, 현재 sale Chip 레이블에도 사용 |
| `icon/on-dark` | #FFFFFF | `gray/0` | 어두운 배경 위 아이콘 |
| `icon/disabled` | #D9DCDF | `gray/300` | 비활성 아이콘 |
| `icon/error` | #E30036 | `red/500` | 오류 아이콘 |
| `effect/shadow-subtle` | rgba(0, 0, 0, 0.05) | 직접 색상 값 | 약한 그림자 색상 |

`effect/shadow-subtle`은 색상 토큰이다. 이 변수만으로 그림자의 위치, 블러, 확장값까지 정의되지는 않는다.

## 2. 타이포 스케일

### 2.1 공통 정의

- 글꼴: `Noto Sans KR`
- 자간: 모든 로컬 텍스트 스타일이 0%
- 굵기: Medium 500 / SemiBold 600 / Bold 700
- 줄높이: 모든 로컬 텍스트 스타일이 고정 px 값
- 크기뿐 아니라 줄높이와 굵기까지 포함한 텍스트 스타일을 적용한다.

### 2.2 텍스트 스타일

| 텍스트 스타일 | 크기 / 줄높이 | 굵기 | 쓰는 곳 |
| --- | --- | --- | --- |
| `heading/h1` | 32 / 44 | Bold 700 | 최상위 제목용. 확인한 Components 및 모바일 화면에서 직접 사용 예 없음 |
| `heading/h2` | 28 / 40 | Bold 700 | Card/Price의 주요 금액 |
| `heading/h3` | 24 / 32 | Bold 700 | 요금제 추천 제목, 처리 중·실패 화면의 주요 제목 |
| `heading/h4` | 20 / 28 | Bold 700 | root Header, 폼 섹션 제목, 신청 완료 제목 |
| `subtitle/bold` | 18 / 26 | Bold 700 | 요금제명, 주요 가격, 할인율, 선택된 OptionItem 제목 |
| `subtitle/default` | 18 / 26 | SemiBold 600 | default Header 제목 |
| `body/strong` | 16 / 24 | SemiBold 600 | 활성 버튼 레이블, Input 입력값, 기본 OptionItem 제목 |
| `body/medium` | 16 / 24 | Medium 500 | 비활성 버튼 레이블, 실패 화면의 본문 안내 |
| `body/small-strong` | 14 / 21 | SemiBold 600 | List/Row 값, 선택된 FilterChip 레이블 |
| `body/small-medium` | 14 / 21 | Medium 500 | 카드·옵션 설명, 입력 오류 메시지, 기본 FilterChip 레이블 |
| `caption/medium` | 13 / 18 | Medium 500 | 월 요금 레이블, 할인 전 금액, 보조 안내 |
| `caption/bold` | 13 / 18 | Bold 700 | Tag, sale Chip, StepProgress 단계 레이블 |
| `caption/small` | 12 / 16 | Medium 500 | 작은 보조 정보용. 확인한 범위에서 직접 사용 예 없음 |
| `caption/small-bold` | 12 / 16 | Bold 700 | 작은 강조 정보용. 확인한 범위에서 직접 사용 예 없음 |
| `caption/mini` | 10 / 14 | SemiBold 600 | benefit 및 package Chip 레이블 |
| `specimen/weight-medium` | 32 / 44 | Medium 500 | 글꼴 굵기 비교용 표본 스타일 |
| `specimen/weight-semibold` | 32 / 44 | SemiBold 600 | 글꼴 굵기 비교용 표본 스타일 |

`specimen/*`는 굵기 비교용으로 구분하며, 일반 UI 제목 스타일로 대체 사용하지 않는다.

### 2.3 타이포 변수

| 변수 | 값 |
| --- | --- |
| `font-family/family-font` | Noto Sans KR |
| `font-size/heading-h1` | 32 |
| `font-size/heading-h2` | 28 |
| `font-size/heading-h3` | 24 |
| `font-size/heading-h4` | 20 |
| `font-size/subtitle` | 18 |
| `font-size/body` | 16 |
| `font-size/body-small` | 14 |
| `font-size/caption` | 13 |
| `font-size/12` | 12 |
| `font-size/caption-mini` | 10 |

줄높이와 굵기는 별도 변수 컬렉션이 아니라 텍스트 스타일 정의를 기준으로 한다.

### 2.4 현재 적용 시 주의점

- OptionItem은 선택 시 제목이 `body/strong`에서 `subtitle/bold`로 바뀐다. 굵기뿐 아니라 크기와 줄높이도 달라진다.
- FilterChip은 선택 시 `body/small-medium`에서 `body/small-strong`으로 바뀐다.
- Button의 Disabled는 활성 상태의 `body/strong` 대신 `body/medium`을 사용한다.
- Input 기본 변형의 숨겨진 안내문에는 `heading/h4`가 연결되어 있지만, caution의 표시 오류문은 `body/small-medium`이다. 기본 변형에서 안내문을 표시할 때 같은 규격이라고 가정하지 않는다.

## 3. 간격·레이아웃

### 3.1 390×844 모바일 기본 구조

| 항목 | 기준 |
| --- | --- |
| 화면 기준 크기 | 390 × 844 |
| 기본 구조 | Header → 세로 본문 → 필요 시 하단 동작 영역 |
| Header | 높이 56, 전체 너비 390 |
| 기본 본문 좌우 여백 | 16 |
| 기본 콘텐츠 너비 | 358 = 390 − 16 × 2 |
| 넓은 여백을 쓰는 화면 | 좌우 24, 콘텐츠 너비 342 |
| 기본 본문 상하 여백 | 화면에 따라 16 또는 24 |
| 일반 콘텐츠 묶음 간격 | 12, 16, 24 |
| 요금제 카드 목록 간격 | 16 |

390×844는 확인한 모바일 프레임의 기준 크기다. 별도의 공통 상태 표시줄이나 OS 안전 영역 높이가 변수로 정의되어 있지는 않다.

### 3.2 간격 토큰

모든 토큰은 이름의 숫자와 동일한 px 값을 가진다.

| 구분 | 정의된 토큰 |
| --- | --- |
| 미세 간격 | `spacing/0`, `spacing/2`, `spacing/4`, `spacing/6` |
| 요소 내부 간격 | `spacing/8`, `spacing/10`, `spacing/12` |
| 기본 패딩·목록 간격 | `spacing/16`, `spacing/20`, `spacing/24`, `spacing/28` |
| 큰 묶음 간격 | `spacing/32`, `spacing/40`, `spacing/48` |
| 큰 여백 | `spacing/56`, `spacing/60`, `spacing/64`, `spacing/80` |

실제 사용 예:

- 4: 옵션 제목과 설명 사이, Chip 상하 패딩
- 8: Card/Plan 내부 간격, BottomCTA 버튼 사이
- 10: Input field 내부 간격, sale Chip 좌우 패딩
- 12: Input과 오류문 사이, 폼 요소 묶음 간격, OptionItem 내부 간격
- 16: 모바일 기본 좌우 여백, 카드 목록 간격
- 20: Card/Plan 내부 패딩, OptionItem 좌우 패딩
- 24: 상세 화면 본문 여백, 버튼 좌우 패딩
- 32: BottomCTA 하단 패딩
- 48: 실패 안내 화면 본문 상단 여백

### 3.3 모서리 토큰

정의된 값:

`radius/0`, `radius/2`, `radius/4`, `radius/5`, `radius/6`,
`radius/8`, `radius/10`, `radius/12`, `radius/16`, `radius/20`,
`radius/24`, `radius/32`, `radius/40`, `radius/999`, `radius/full`

- `radius/full` = 9999
- 그 외 토큰은 이름의 숫자와 동일한 값

| 적용 요소 | 실제 반경 |
| --- | --- |
| Header, BottomCTA, Input 외곽 | 0 |
| benefit·package Chip | 4 |
| sale Chip | 6 |
| Button | 8 |
| OptionItem, Card/Price | 12 |
| Card/Plan | 16 |
| Tag | 999 |
| FilterChip, 라디오, 진행률 트랙 | 9999 |

### 3.4 Header와 하단 영역

#### Header

- 크기: 390 × 56
- 패딩: 상하 4, 좌우 16
- default: 뒤로가기 24 × 24, 제목, 우측 24 × 24 균형 공간
- default 내부 간격: 8
- root: 제목과 Logo 배치, 내부 간격 12

#### BottomCTA 원본 정의

| Layout | 크기 | 패딩: 상 / 우 / 하 / 좌 | 내부 간격 |
| --- | --- | --- | --- |
| `single` | 390 × 97 | 12 / 16 / 32 / 16 | 8 |
| `double` | 390 × 97 | 12 / 16 / 32 / 16 | 8 |
| `price` | 390 × 139 | 16 / 16 / 32 / 16 | 12 |

- 배경: `bg/surface`
- 경계: `border/subtle`
- 내부 주요 버튼: xl, 높이 52
- single 버튼 너비: 358
- double 버튼 너비: 보조 약 132.7, 주요 약 217.3, 사이 간격 8
- price는 금액 행 아래에 전체 너비 버튼을 배치한다.

#### 실제 모바일 화면의 차이

완성 화면에는 BottomCTA 원본과 별도로 구성된 하단 영역도 있다.

- 신청 완료·입력 오류: 높이 92, 상단 16 / 좌우 16 / 하단 24
- 신청 폼·실패 안내: 높이 125인 세로 구성
- 요금제 상세: 높이 154, 상단 16 / 좌우 16 / 하단 32

따라서 모든 하단 영역을 하나의 고정 높이로 간주하지 않는다. 재사용 시 원본 컴포넌트 규격과 화면별 구성을 구분한다.

### 3.5 콘텐츠와 높이 처리

- 본문은 세로 Auto Layout을 기본으로 구성한다.
- 폼·카드·행의 기본 너비는 358이며, 일반 모바일 본문 폭에 맞춘다.
- 카드의 높이는 설명, 할인 정보, 프로모션 표시 여부에 따라 달라질 수 있다.
- 실제 추천 화면의 Card/Plan 인스턴스는 높이 189, 원본은 223~224다.
- 긴 본문을 구현할 때는 하단 동작 영역과 겹치지 않도록 본문 스크롤 영역을 분리한다. 이는 구현 지침이며 현재 프로토타입 동작이 설정되었다는 의미는 아니다.

## 4. 컴포넌트 용법

### 4.1 공통 규칙

- Components 섹션의 재사용 컴포넌트를 기준으로 한다.
- 상태는 정의된 Variant로 전환하고, 노출된 텍스트·Boolean 속성으로 내용을 조정한다.
- 아래 속성명은 Figma 표시 이름 기준이며 내부 식별 접미사는 생략한다.
- 정의되지 않은 상태나 속성이 이미 제공되는 것으로 가정하지 않는다.
- Variant 존재는 시각적 상태 정의이며, 자동 전환 동작이나 입력 검증 기능을 의미하지 않는다.
- 표시되는 가격, 원가, 할인율, 프로모션은 서로 일치시킨다.

### 4.2 Button

**변형**

- `Type`: `Primary` / `Secondary`
- `Size`: `sm` / `lg` / `xl`
- `State`: `Default` / `Hover` / `Disabled`
- 총 18개 조합

**속성**

| 속성 | 유형 | 기본값 |
| --- | --- | --- |
| `Label` | Text | 로그인 |

세트 속성 기본값은 `Primary / xl / Default`이다.

**규격**

| Size | 높이 | 상하 패딩 | 좌우 패딩 |
| --- | --- | --- | --- |
| `sm` | 기본 40 | 8 | 24 |
| `lg` | 48 | 12 | 24 |
| `xl` | 52 | 16 | 24 |

- 공통 반경: 8
- Primary Default: `fill/primary` + `text/on-dark`
- Primary Hover: `fill/primary-hover`
- Secondary Default: `surface/default` + `border/default` + `text/primary`
- Secondary Hover: `bg/subtle`
- Disabled 배경: `fill/disabled`
- 활성 레이블: `body/strong`
- Disabled 레이블: `body/medium`

**사용 규칙**

- 주요 진행 동작은 Primary, 보조 동작은 Secondary를 사용한다.
- 하단 주요 동작은 xl, 카드 내부 보조 동작은 sm 사용 예가 있다.
- 너비는 레이블과 배치에 따라 조정한다. 예시 원본 너비 93을 고정 너비로 취급하지 않는다.
- Secondary sm의 Default·Hover는 실제 높이가 42이며 Disabled는 40이다. 모든 sm 변형이 동일한 실측 높이는 아니다.

### 4.3 Input

**변형**

`State`: `default` / `focus` / `filled` / `caution` / `disabled`

**속성**

| 속성 | 유형 | 기본값 |
| --- | --- | --- |
| `errorMessage` | Boolean | false |

**규격과 상태**

- 기본 너비: 358
- field 높이: 58
- field 패딩: 상하 12, 좌 2, 우 0
- field 내부 간격: 10
- field와 message 사이: 12
- 반경: 0
- 기본 전체 높이: 58
- caution 전체 높이: 91

| State | 표시 |
| --- | --- |
| `default` | `border/default`, 입력 전 텍스트 |
| `focus` | `border/focus` |
| `filled` | 입력값 표시, `border/default` |
| `caution` | `border/error`, 오류 아이콘 및 `text/error` 메시지 |
| `disabled` | `bg/subtle`, `border/default` |

**사용 규칙과 연결 제한**

- 오류는 `caution` 변형을 기준으로 표현한다.
- `errorMessage`는 default·focus·filled·disabled의 message 표시 여부에 연결되어 있다.
- caution의 message는 표시 상태지만 해당 Boolean 연결이 없다. `errorMessage=false`만으로 caution 메시지가 숨겨진다고 가정하지 않는다.
- 입력값·플레이스홀더·오류 문구를 바꾸는 Text 속성은 노출되어 있지 않다.
- 입력값 색상과 숨겨진 안내문의 텍스트 스타일에는 상태 간 불일치가 있으므로 1장과 2장의 주의점을 함께 적용한다.

### 4.4 Checkbox

- `State`: `default` / `active`
- 기본 크기: 24 × 24
- 별도 Text·Boolean 속성 없음

**사용 규칙**

- 미선택은 default, 선택은 active를 사용한다.
- active는 `fill/primary` 채움과 체크 표시를 사용한다.
- 선택 개수나 동의 문구는 Checkbox 자체 속성에 포함되어 있지 않으므로 외부 레이아웃에서 구성한다.
- disabled·오류 변형은 정의되어 있지 않다.

### 4.5 Chip과 Tag

#### Chip

- `Type`: `benefit` / `package` / `sale`
- 기본 Type: `sale`
- 레이블용 Text 속성은 노출되어 있지 않다.

| Type | 배경 / 텍스트 | 텍스트 스타일 | 패딩: 상하 / 좌우 | 반경 |
| --- | --- | --- | --- | --- |
| `benefit` | `bg/subtle` / `text/primary` | `caption/mini` | 4 / 6 | 4 |
| `package` | `fill/secondary` / `text/on-dark` | `caption/mini` | 4 / 6 | 4 |
| `sale` | `bg/accent-subtle` / `icon/accent` | `caption/bold` | 4 / 10 | 6 |

- benefit: 혜택 가치 안내
- package: 패키지 분류
- sale: 절약 금액·할인 프로모션 안내
- 선택 필터 용도로는 Chip 대신 FilterChip을 사용한다.
- 원본 프레임 높이는 benefit·package 20, sale 24다. 텍스트 줄높이와 상하 패딩 합계보다 작으므로 높이만으로 내용 수용을 보장하지 않는다.

#### Tag

- 단일 컴포넌트, 변형·노출 속성 없음
- 예시 크기: 48 × 26
- 패딩: 상하 4, 좌우 12
- 반경: 999
- 배경: `border/subtle`
- 텍스트: `caption/bold`, `text/secondary`
- 추천 여부와 같은 짧은 상태 표시에 사용한다.

### 4.6 Header

**변형·속성**

- `Type`: `default` / `root`
- `Title`: Text, 기본값 `맞춤 요금제 추천`

**사용 규칙**

- default: 하위 화면용. 뒤로가기 아이콘과 제목을 배치한다.
- root: 최상위 화면용. 제목과 Logo를 배치한다.
- default 제목: `subtitle/default`
- root 제목: `heading/h4`
- 크기와 여백은 3.4의 Header 규격을 따른다.

### 4.7 List/Row

**변형·속성**

- `Type`: `default` / `check`
- `Label`: Text, 기본값 `데이터`
- `Value`: Text, 기본값 `무제한`

**규격**

- 원본 크기: 358 × 46
- 패딩: 상하 12, 좌우 4
- 내부 간격: 12
- 하단 경계: 1, `border/subtle`
- Value: `body/small-strong`

**사용 규칙**

- 라벨과 값을 나란히 보여주는 정보 목록에 사용한다.
- check 변형은 이름과 달리 체크 아이콘이 아니라 6 × 6 원형 bullet을 포함한다.
- check를 동의 Checkbox나 선택 상태로 취급하지 않는다.

### 4.8 Card/Price

Components 섹션에 배치된 원격 컴포넌트 인스턴스다.

- 크기: 358 × 124
- 패딩: 20
- 내부 간격: 4
- 반경: 12
- 확인된 Variant 및 노출 속성 없음

**구성**

- 월 요금 레이블: `caption/medium`
- 주요 금액: `heading/h2`
- 할인율: `subtitle/bold`
- 원가·프로모션 설명: `caption/medium`

**사용 규칙**

- 상세 화면의 요금 요약에 사용한다.
- Card/Plan의 속성이 Card/Price에도 제공된다고 가정하지 않는다.
- 금액 및 할인 정보를 변경할 때 관련 텍스트를 함께 확인한다.

### 4.9 BottomCTA

**변형**

`Layout`: `single` / `double` / `price`

**속성**

| 속성 | 유형 | 기본값 |
| --- | --- | --- |
| `Amount` | Text | 월 85,000원 |
| `AmountLabel` | Text | 월 납부 금액 |

**사용 규칙**

- single: 주요 동작 하나
- double: 보조 동작과 주요 동작 두 개
- price: 금액 요약과 주요 동작
- 내부 버튼은 Button 인스턴스이며 기본 xl이다.
- 버튼 문구와 상태는 내부 Button의 속성으로 조정한다. BottomCTA 최상위 속성에는 버튼 Label이 별도로 노출되어 있지 않다.
- 원본 치수와 실제 화면의 하단 영역 차이는 3.4를 따른다.

### 4.10 Card/Plan

**변형**

`State`: `default` / `selected`

**속성**

| 속성 | 유형 | 기본값 |
| --- | --- | --- |
| `Name` | Text | 넉넉 무제한 |
| `Desc` | Text | 데이터 무제한 · 통화 무제한 · 넷플릭스 포함 |
| `Discount` | Text | 15% |
| `Price` | Text | 월 85,000원 |
| `Original` | Text | 월 100,000원 |
| `Badge` | Boolean | true |
| `Promo` | Boolean | true |
| `Sale` | Boolean | true |

**규격**

- 너비: 358
- 원본 높이: default 223 / selected 224
- 패딩: 20
- 내부 간격: 8
- 반경: 16
- 배경: 두 상태 모두 `bg/surface`
- default 경계: 1, `border/default`
- selected 경계: 1.5, `border/medium`

**사용 규칙**

- 요금제 목록에서 이름, 설명, 가격 및 보조 혜택을 함께 표시한다.
- `Sale`은 할인율과 원가 표시 여부에 연결된다.
- `Promo`는 프로모션 Chip 표시 여부에 연결된다.
- `Badge` 속성은 정의되어 있으나 현재 badge 레이어의 표시 여부에 연결되어 있지 않다. false로 변경하면 자동으로 숨겨진다고 가정하지 않는다.
- selected는 핑크 배경이나 핑크 테두리로 바뀌지 않는다.
- 상세 동작에는 내부 Secondary sm Button을 사용한다.
- 표시 정보에 따라 인스턴스 높이는 달라질 수 있다.

### 4.11 OptionItem

**변형·속성**

- `State`: `default` / `selected`
- `Title`: Text
- `Desc`: Text

기본 내용:
- Title: `데이터를 많이 써요`
- Desc: `영상·게임을 자주 봐서 무제한이 필요해요`

**규격**

- 너비: 358
- 원본 높이: default 83 / selected 86
- 패딩: 상하 16, 좌우 20
- 내부 간격: 12
- 제목·설명 간격: 4
- 반경: 12
- 라디오: 22 × 22

| 상태 | 배경 | 경계 | 제목 |
| --- | --- | --- | --- |
| default | `bg/surface` | 1, `border/default` | `body/strong` |
| selected | `bg/default` | 1.5, `border/medium` | `subtitle/bold` |

**사용 규칙**

- 설명이 있는 단일 선택 항목에 사용한다.
- 선택 시 라디오 채움은 `fill/primary`로 바뀐다.
- 선택 시 제목 크기와 전체 높이도 바뀌므로 인접 항목의 레이아웃 변화를 고려한다.
- 선택 가능 개수와 상태 전환은 컴포넌트 외부에서 관리한다.

### 4.12 StepProgress

- `Step`: `1` / `2` / `3`
- 기본값: `1`
- 크기: 358 × 30
- 레이블·트랙 간격: 8
- 레이블: `caption/bold`, `text/accent`
- 트랙: 높이 4, `bg/subtle`, 반경 9999
- 진행 바: `fill/primary`

| Step | 레이블 | 진행 바 너비 |
| --- | --- | --- |
| 1 | STEP 1 / 3 | 119 |
| 2 | STEP 2 / 3 | 239 |
| 3 | STEP 3 / 3 | 358 |

**사용 규칙**

- 3단계 흐름에 사용한다.
- 레이블과 진행 바를 따로 수정하기보다 Step 변형을 함께 전환한다.
- 다른 단계 수나 임의 진행률을 위한 속성은 정의되어 있지 않다.

### 4.13 FilterChip

**변형·속성**

- `State`: `default` / `selected`
- `Label`: Text, 기본값 `데이터 많이`

**규격**

- 높이: 40
- 패딩: 상하 8, 좌우 16
- 반경: 9999
- 너비: 레이블과 상태에 따라 변경

| 상태 | 배경 | 텍스트 | 경계 |
| --- | --- | --- | --- |
| default | `bg/surface` | `body/small-medium`, `text/primary` | 1, `border/default` |
| selected | `fill/secondary` | `body/small-strong`, `text/on-dark` | 없음 |

**사용 규칙**

- 목록 조건을 선택·해제하는 필터에 사용한다.
- 정보 표시용 Chip·Tag와 구분한다.
- 단일 선택 또는 다중 선택 여부는 외부에서 관리한다.

### 4.14 Icon과 Logo

| 컴포넌트 | 원본 크기 | 용도 |
| --- | --- | --- |
| `icon/arrowLeft` | 24 × 24 | 뒤로가기 |
| `icon/check` | 24 × 24 | 체크 표시 |
| `icon/doneMark` | 64 × 64 | 완료 상태 강조 |
| `Logo` | 32 × 24 | Header의 브랜드 표시 |

- 위 컴포넌트는 별도 Variant나 노출 속성이 없다.
- Header 및 상태 안내에서는 기존 아이콘 인스턴스를 재사용한다.
- 아이콘 크기와 터치 영역은 같은 개념이 아니다. 위 값은 시각적 컴포넌트 크기이며 별도 터치 영역 규격은 확인되지 않았다.
