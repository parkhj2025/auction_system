# 디자인 토큰 v1 — Phase 7 prototype 단계 2

> **작성일**: 2026-04-26
> **대상 파일**: [src/app/globals.css](../src/app/globals.css) `@theme` 블록
> **패턴**: Tailwind v4 CSS-first (tailwind.config.ts 미사용 — CLAUDE.md §12 정합)
> **검증**: 베타 1·2·3호 dev 서버 회귀 0 / 컴포넌트 직접 수정 0

---

## 1. 토큰 사용 원칙

### 1-1. 시맨틱 vs 표현

토큰은 **시맨틱**과 **표현** 두 종류로 분리한다.

| 분류 | 사용 시점 | 예 |
|------|-----------|-----|
| **시맨틱** | 의미 기반 — 무엇을 말하려는지 | `--color-success` (완료/긍정), `--color-danger` (위험/에러), `--color-info` (안내) |
| **표현** | 시각 기반 — 어떻게 보여줄지 | `--color-brand-600` (브랜드 메인), `--color-ink-900` (제목 컬러) |

**원칙**: 새 컴포넌트는 **시맨틱 토큰을 우선**. 표현 토큰은 브랜드·중립 팔레트에만 사용.

### 1-2. 접근성 (WCAG AA)

모든 시맨틱 컬러는 **흰 배경 위 4.5:1 이상** 대비를 만족 (본문 기준):

| 토큰 | 색 | 흰 배경 대비 |
|------|----|--------------|
| `--color-success` | `#15803d` | ≈ 5.8:1 |
| `--color-warning` | `#854d0e` | ≈ 7.2:1 |
| `--color-danger` | `#b91c1c` | ≈ 6.0:1 |
| `--color-info` | `#1d4ed8` | ≈ 8.4:1 |

`--color-ink-300`(#cbd5e1)은 흰 배경 위 1.5:1로 **본문 텍스트 사용 금지**(비활성/구분선 전용).

### 1-3. Tailwind v4 namespace 매핑

| @theme 토큰 | Tailwind utility | 비고 |
|-------------|------------------|------|
| `--color-*` | `bg-*`, `text-*`, `border-*` | 자동 매핑 |
| `--text-*` | `text-display`, `text-h1` 등 | 자동 매핑 |
| `--radius-*` | `rounded-md`, `rounded-xl` | 자동 매핑 |
| `--shadow-*` | `shadow-card`, `shadow-elevated` | 자동 매핑 |
| `--ease-*` | `ease-out`, `ease-in` | 자동 매핑 |
| `--duration-*` | namespace 밖 | `duration-[var(--duration-base)]` |
| `--z-*` | namespace 밖 | `z-[var(--z-modal)]` |

---

## 2. 컬러

### 2-1. 브랜드 블루 11단계 (`--color-brand-{50..950}`)

| 단계 | hex | 용도 |
|------|-----|------|
| 50 | `#eff6ff` | 매우 연한 배경 |
| 100 | `#dbeafe` | hover 배경 |
| 200 | `#bfdbfe` | 보조 |
| 300 | `#93c5fd` | 보조 |
| 400 | `#60a5fa` | 보조 |
| 500 | `#3b82f6` | 보조 강조 |
| **600** | `#2563eb` | **메인 — CTA, 링크, focus ring** |
| 700 | `#1d4ed8` | hover 진한 |
| 800 | `#1e40af` | 진한 헤딩 |
| 900 | `#1e3a8a` | 매우 진한 |
| 950 | `#172554` | 거의 검정 |

### 2-2. 중립 ink 5단계 (`--color-ink-{100..900}`)

| 단계 | hex | 용도 | AA 본문 |
|------|-----|------|--------|
| 900 | `#0f172a` | 제목 | ✓ 18:1 |
| 700 | `#334155` | 본문 | ✓ 9.7:1 |
| 500 | `#64748b` | 보조 텍스트 | ✓ 4.7:1 |
| 300 | `#cbd5e1` | **비활성·구분선만**. 본문 사용 금지 | ✗ 1.5:1 |
| 100 | `#f1f5f9` | 배경 | — |

### 2-3. 시맨틱 4종 (단계 2 신규)

기능 표현 전용. 기능에 맞는 토큰만 사용한다 — 장식적 사용 금지.

| 토큰 | 텍스트 색 | 배경(soft) | 대표 용도 |
|------|----------|-----------|----------|
| `--color-success` | `#15803d` | `#dcfce7` | 완료 메시지, 긍정 지표(수익 +) |
| `--color-warning` | `#854d0e` | `#fef3c7` | 주의 안내, 정책 변경 |
| `--color-danger` | `#b91c1c` | `#fee2e2` | 폼 에러, 거절 알림, 위험 지표 |
| `--color-info` | `#1d4ed8` | `#eff6ff` | 정보 안내, 도움말, tooltip |

**사용 예 (Tailwind v4 utility)**:
```tsx
<div className="bg-[var(--color-danger-soft)] text-[var(--color-danger)] border-[var(--color-danger)]">
  보증금이 부족합니다.
</div>
```

### 2-4. accent 3종 (deprecated 후보)

기존 컴포넌트가 다수 의존하므로 색상은 그대로 보존. 단계 3 컴포넌트 마이그레이션 시점에 시맨틱으로 교체 검토.

| 토큰 | 색 | 마이그레이션 후보 |
|------|----|-------------------|
| `--color-accent-red` | `#dc2626` | `--color-danger` (`#b91c1c`)로 교체 — 미세 톤 차이 발생 |
| `--color-accent-green` | `#16a34a` | `--color-success` (`#15803d`)로 교체 — 미세 톤 차이 발생 |
| `--color-accent-yellow` | `#ffd600` | 강조 표현용으로 유지 또는 brand 톤 흡수 |

### 2-5. cat (제거됨)

`--color-cat-{danger|edu|safe}`는 **단계 2에서 제거**. 사용처 0이라 안전.

---

## 3. 보더 반경 (`--radius-{xs..2xl}`)

| 토큰 | px | 용도 |
|------|-----|------|
| `xs` | 4 | 포커스 링 모서리, 작은 칩 |
| `sm` | 6 | 입력 필드, 작은 버튼 |
| `md` | 10 | 일반 카드, CTA 버튼 |
| `lg` | 14 | 큰 카드 |
| `xl` | 20 | 모달, 히어로 박스 |
| `2xl` | 28 | 매우 큰 sheet |

---

## 4. 그림자 (단계 2 확장)

| 토큰 | 강도 | 용도 |
|------|------|------|
| `--shadow-subtle` | 매우 약함 | 1px line + 거의 안 보이는 lift |
| `--shadow-card` | 약함 | 일반 카드 |
| `--shadow-elevated` | 중간 | 모달 위 카드, 강조 카드 |
| `--shadow-lift` (deprecated) | 약 | 기존 컴포넌트 호환용 |

**원칙**: 그림자는 정보 위계 표현용. 장식 금지.

---

## 5. 타이포 스케일 (단계 2 신규)

| 토큰 | size | 권장 line-height | 용도 |
|------|------|------------------|------|
| `--text-display` | 48 | 1.1 (`leading-[3.3rem]`) | 페이지 대형 헤더 (홈 히어로) |
| `--text-h1` | 36 | 1.15 | 페이지 H1 (DetailHero) |
| `--text-h2` | 30 | 1.2 | 섹션 H2 |
| `--text-h3` | 24 | 1.25 | 서브 헤딩 |
| `--text-h4` | 20 | 1.3 | 카드 제목 |
| `--text-body` | 16 | 1.625 (`leading-7`) | 본문 (모바일 최소) |
| `--text-body-sm` | 14 | 1.5 | 보조 본문, 캡션 위 |
| `--text-caption` | 12 | 1.4 | 캡션, 메타 |
| `--text-numeric` | 24 | 1.0 (tight) | 숫자 강조 (가격) |

**원칙**:
- 본문 16px 미만 금지 (모바일 자동 줌 회피).
- 한글 가독성: leading 1.625 이상.
- 숫자: `tabular-nums` 항상 동반.

---

## 6. 모션 토큰 (단계 2 신규)

### 6-1. 시간

| 토큰 | ms | 용도 |
|------|-----|------|
| `--duration-fast` | 150 | hover, focus, 작은 토글 |
| `--duration-base` | 250 | 일반 트랜지션 (모달 등장, 탭 전환) |
| `--duration-slow` | 400 | 복잡 트랜지션 (페이지 전환) |

### 6-2. 이징 함수

| 토큰 | 곡선 | 용도 |
|------|------|------|
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | 진입 (자연스러운 도착) |
| `--ease-in` | `cubic-bezier(0.7, 0, 0.84, 0)` | 퇴장 |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | 양방향 토글 |

### 6-3. prefers-reduced-motion 대응

`globals.css`에 `@media (prefers-reduced-motion: reduce)`로 모든 duration을 `0.01ms`로 강제. 사용자 설정 존중.

### 6-4. 사용 예

```tsx
<div className="transition-colors duration-[var(--duration-fast)] ease-out hover:bg-brand-50">
  ...
</div>
```

---

## 7. z-index 5단계 (단계 2 신규)

| 토큰 | 값 | 용도 |
|------|-----|------|
| `--z-base` | 0 | 기본 흐름 |
| `--z-dropdown` | 10 | 드롭다운, 팝오버 |
| `--z-sticky` | 20 | sticky 헤더, 모바일 하단 CTA |
| `--z-modal` | 40 | 모달, sheet, 오버레이 |
| `--z-toast` | 50 | 토스트 알림 (최상단) |

```tsx
<div className="z-[var(--z-modal)] fixed inset-0 ...">
```

---

## 8. 단계 2 변경 요약

| 항목 | 이전 | 단계 2 |
|------|------|--------|
| 시맨틱 컬러 | 없음 | success / warning / danger / info 4종 + soft 변형 (AA 통과) |
| 모션 토큰 | 없음 | duration 3단계 + ease 3종 + prefers-reduced-motion |
| z-index | 없음 | 5단계 |
| 타이포 스케일 | 없음 | 9 size (display ~ caption + numeric) |
| 그림자 | 2단계 (card / lift) | 4단계 (subtle / card / elevated / lift) |
| `--color-cat-*` | 6 alias | **제거** (사용처 0) |
| `--color-accent-*` | 6 색 | 유지 (deprecated 후보, 단계 3에서 마이그레이션) |
| brand / ink / radius / 폰트 | — | **변경 없음** (회귀 0) |

---

## 9. 회귀 검증

`globals.css` 토큰만 추가/제거. 컴포넌트 코드 0 변경.

| 검증 | 결과 |
|------|------|
| `pnpm exec tsc --noEmit` | 0 에러 |
| `pnpm exec eslint` | 0 에러 |
| `pnpm build` | 정상 |
| 베타 1호 `/analysis/2024-505827` dev | HTTP 200 |
| 베타 2호 `/analysis/2024-527667` dev | HTTP 200 |
| 베타 3호 `/analysis/2025-507598` dev | HTTP 200 |

---

## 10. 단계 3 마이그레이션 메모

- `--color-cat-*` 제거됨 — 컴포넌트 사용 없으므로 무영향.
- `--color-accent-*`는 시맨틱과 미세 톤 차이로 단계 3 컴포넌트 재작성 시 시맨틱 토큰으로 교체 검토.
- `text-*` namespace utility 신규 매핑이 기존 코드와 충돌 안 함 (Tailwind v4 fallback이 기본 size 사용).
- 모션·z-index는 namespace 밖이라 신규 코드만 영향.

---

## 11. 변경 이력

| 버전 | 날짜 | 변경 |
|------|------|------|
| v1 | 2026-04-26 | Phase 7 prototype 단계 2 신설. 시맨틱 4종 + 모션 + z-index + 타이포 스케일 추가. cat 제거. accent 보존(deprecated 후보). |
