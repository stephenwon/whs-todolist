# Team CalTalk 스타일 가이드

**버전**: 1.0
**작성일**: 2025-11-27
**참조**: GitHub Repository UI 분석

---

## 목차

1. [디자인 철학](#1-디자인-철학)
2. [색상 시스템](#2-색상-시스템)
3. [타이포그래피](#3-타이포그래피)
4. [레이아웃](#4-레이아웃)
5. [컴포넌트](#5-컴포넌트)
6. [아이콘](#6-아이콘)
7. [상호작용](#7-상호작용)

---

## 1. 디자인 철학

### 1.1 핵심 원칙

- **명확성 (Clarity)**: 깔끔하고 명확한 정보 계층 구조
- **일관성 (Consistency)**: 전체 UI에서 일관된 디자인 패턴
- **접근성 (Accessibility)**: 모든 사용자가 쉽게 사용할 수 있는 인터페이스
- **효율성 (Efficiency)**: 최소한의 클릭으로 목표 달성

### 1.2 디자인 영감

GitHub 스타일의 클린하고 전문적인 인터페이스를 지향합니다.

---

## 2. 색상 시스템

### 2.1 Primary Colors

| 색상명 | HEX | RGB | 용도 |
|--------|-----|-----|------|
| **Primary Green** | `#2DA44E` | rgb(45, 164, 78) | 주요 액션 버튼, 성공 메시지 |
| **Dark Gray** | `#24292F` | rgb(36, 41, 47) | 헤더, 푸터, 주요 텍스트 |
| **Medium Gray** | `#57606A` | rgb(87, 96, 106) | 보조 텍스트, 아이콘 |
| **Light Gray** | `#F6F8FA` | rgb(246, 248, 250) | 배경, 카드 배경 |
| **Border Gray** | `#D0D7DE` | rgb(208, 215, 222) | 테두리, 구분선 |

### 2.2 Secondary Colors

| 색상명 | HEX | RGB | 용도 |
|--------|-----|-----|------|
| **Blue** | `#0969DA` | rgb(9, 105, 218) | 링크, 정보 강조 |
| **Red** | `#CF222E` | rgb(207, 34, 46) | 에러, 삭제 |
| **Orange** | `#FB8500` | rgb(251, 133, 0) | 경고, 진행 중 |
| **Purple** | `#8250DF` | rgb(130, 80, 223) | 특수 상태 |

### 2.3 Status Colors

| 상태 | 색상 | HEX | 용도 |
|------|------|-----|------|
| **성공** | Green | `#1A7F37` | 완료된 작업 |
| **경고** | Yellow | `#BF8700` | 주의 필요 |
| **에러** | Red | `#D1242F` | 오류 메시지 |
| **정보** | Blue | `#0969DA` | 정보성 메시지 |

### 2.4 Neutral Colors

```css
--color-canvas-default: #FFFFFF;
--color-canvas-subtle: #F6F8FA;
--color-border-default: #D0D7DE;
--color-border-muted: #E8EAED;

--color-fg-default: #24292F;
--color-fg-muted: #57606A;
--color-fg-subtle: #6E7781;
```

---

## 3. 타이포그래피

### 3.1 폰트 패밀리

```css
--font-family-base: -apple-system, BlinkMacSystemFont, "Segoe UI",
                     "Noto Sans", Helvetica, Arial, sans-serif;
--font-family-mono: "SF Mono", Monaco, "Cascadia Code", "Roboto Mono",
                    Consolas, monospace;
--font-family-korean: "Malgun Gothic", "맑은 고딕", AppleGothic, sans-serif;
```

### 3.2 폰트 크기

| 이름 | 크기 | 용도 |
|------|------|------|
| **Heading 1** | 32px / 2rem | 페이지 제목 |
| **Heading 2** | 24px / 1.5rem | 섹션 제목 |
| **Heading 3** | 20px / 1.25rem | 서브섹션 제목 |
| **Heading 4** | 16px / 1rem | 카드 제목 |
| **Body** | 14px / 0.875rem | 본문 텍스트 |
| **Small** | 12px / 0.75rem | 보조 정보, 타임스탬프 |
| **Tiny** | 11px / 0.6875rem | 라벨, 배지 |

### 3.3 폰트 굵기

```css
--font-weight-light: 300;
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

### 3.4 행간

```css
--line-height-condensed: 1.25;
--line-height-default: 1.5;
--line-height-relaxed: 1.625;
```

---

## 4. 레이아웃

### 4.1 간격 시스템 (Spacing)

8px 기반 시스템 사용:

| 이름 | 크기 | rem | 용도 |
|------|------|-----|------|
| **xs** | 4px | 0.25rem | 아이콘 간격 |
| **sm** | 8px | 0.5rem | 버튼 내부 패딩 |
| **md** | 16px | 1rem | 카드 패딩, 기본 여백 |
| **lg** | 24px | 1.5rem | 섹션 간격 |
| **xl** | 32px | 2rem | 큰 섹션 간격 |
| **2xl** | 48px | 3rem | 페이지 간격 |

```css
--spacing-0: 0;
--spacing-1: 4px;
--spacing-2: 8px;
--spacing-3: 12px;
--spacing-4: 16px;
--spacing-5: 20px;
--spacing-6: 24px;
--spacing-8: 32px;
--spacing-10: 40px;
--spacing-12: 48px;
```

### 4.2 컨테이너 너비

```css
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;
--container-2xl: 1440px;
```

### 4.3 브레이크포인트

```css
--breakpoint-sm: 640px;   /* 모바일 */
--breakpoint-md: 768px;   /* 태블릿 */
--breakpoint-lg: 1024px;  /* 데스크톱 */
--breakpoint-xl: 1280px;  /* 큰 화면 */
```

### 4.4 그리드 시스템

- 12컬럼 그리드 시스템
- 간격(Gap): 16px (1rem)

---

## 5. 컴포넌트

### 5.1 버튼 (Button)

#### Primary Button
```css
background: #2DA44E;
color: #FFFFFF;
border: 1px solid rgba(27, 31, 36, 0.15);
border-radius: 6px;
padding: 5px 16px;
font-size: 14px;
font-weight: 500;
```

**States:**
- Hover: `background: #2C974B;`
- Active: `background: #298E46;`
- Disabled: `opacity: 0.6; cursor: not-allowed;`

#### Secondary Button
```css
background: #FFFFFF;
color: #24292F;
border: 1px solid #D0D7DE;
border-radius: 6px;
padding: 5px 16px;
```

**States:**
- Hover: `background: #F6F8FA; border-color: #BBC0C4;`

#### Danger Button
```css
background: #CF222E;
color: #FFFFFF;
border: 1px solid rgba(27, 31, 36, 0.15);
border-radius: 6px;
```

### 5.2 입력 필드 (Input)

```css
background: #FFFFFF;
border: 1px solid #D0D7DE;
border-radius: 6px;
padding: 5px 12px;
font-size: 14px;
line-height: 20px;
```

**States:**
- Focus: `border-color: #0969DA; box-shadow: 0 0 0 3px rgba(9, 105, 218, 0.3);`
- Error: `border-color: #CF222E;`
- Disabled: `background: #F6F8FA; color: #8C959F;`

### 5.3 카드 (Card)

```css
background: #FFFFFF;
border: 1px solid #D0D7DE;
border-radius: 6px;
padding: 16px;
box-shadow: 0 1px 3px rgba(27, 31, 36, 0.12);
```

**Hover State:**
```css
box-shadow: 0 3px 8px rgba(27, 31, 36, 0.15);
border-color: #BBC0C4;
```

### 5.4 배지 (Badge)

#### Default Badge
```css
background: #DDF4FF;
color: #0969DA;
border-radius: 12px;
padding: 0 7px;
font-size: 12px;
font-weight: 500;
line-height: 18px;
display: inline-flex;
align-items: center;
```

#### Status Badges

**Success:**
```css
background: #DAFBE1;
color: #1A7F37;
```

**Warning:**
```css
background: #FFF8C5;
color: #9A6700;
```

**Error:**
```css
background: #FFEBE9;
color: #CF222E;
```

### 5.5 드롭다운 (Dropdown)

```css
background: #FFFFFF;
border: 1px solid #D0D7DE;
border-radius: 6px;
box-shadow: 0 8px 24px rgba(140, 149, 159, 0.2);
padding: 8px 0;
```

**Item:**
```css
padding: 8px 16px;
font-size: 14px;
color: #24292F;
```

**Item Hover:**
```css
background: #F6F8FA;
color: #0969DA;
```

### 5.6 탭 (Tabs)

```css
border-bottom: 1px solid #D0D7DE;
```

**Tab Item:**
```css
padding: 8px 16px;
font-size: 14px;
color: #57606A;
border-bottom: 2px solid transparent;
```

**Active Tab:**
```css
color: #24292F;
font-weight: 600;
border-bottom-color: #FD8C73;
```

### 5.7 모달 (Modal)

**Overlay:**
```css
background: rgba(27, 31, 36, 0.5);
backdrop-filter: blur(2px);
```

**Modal Container:**
```css
background: #FFFFFF;
border-radius: 12px;
box-shadow: 0 16px 48px rgba(27, 31, 36, 0.3);
max-width: 640px;
padding: 24px;
```

---

## 6. 아이콘

### 6.1 아이콘 시스템

- **아이콘 세트**: Octicons (GitHub Icons) 또는 Lucide React
- **기본 크기**: 16px × 16px
- **대체 크기**: 20px, 24px, 32px

### 6.2 아이콘 색상

- Default: `#57606A` (Medium Gray)
- Hover: `#24292F` (Dark Gray)
- Active: `#0969DA` (Blue)
- Disabled: `#8C959F` (Light Gray)

### 6.3 주요 아이콘

| 기능 | 아이콘 | 이름 |
|------|--------|------|
| 추가 | ➕ | plus |
| 편집 | ✏️ | pencil |
| 삭제 | 🗑️ | trash |
| 검색 | 🔍 | search |
| 설정 | ⚙️ | gear |
| 사용자 | 👤 | person |
| 체크 | ✓ | check |
| 닫기 | ✕ | x |

---

## 7. 상호작용

### 7.1 애니메이션

```css
--transition-fast: 0.1s ease;
--transition-base: 0.2s ease;
--transition-slow: 0.3s ease;
```

**사용 예:**
```css
transition: all var(--transition-base);
```

### 7.2 호버 효과

```css
/* 버튼 호버 */
transition: background-color 0.2s ease, border-color 0.2s ease;

/* 카드 호버 */
transition: box-shadow 0.2s ease, border-color 0.2s ease;

/* 링크 호버 */
transition: color 0.15s ease;
```

### 7.3 포커스 스타일

```css
outline: 2px solid #0969DA;
outline-offset: 2px;
```

### 7.4 그림자 (Shadows)

```css
--shadow-sm: 0 1px 3px rgba(27, 31, 36, 0.12);
--shadow-md: 0 3px 8px rgba(27, 31, 36, 0.15);
--shadow-lg: 0 8px 24px rgba(140, 149, 159, 0.2);
--shadow-xl: 0 16px 48px rgba(27, 31, 36, 0.3);
```

### 7.5 테두리 반경 (Border Radius)

```css
--radius-sm: 3px;
--radius-md: 6px;
--radius-lg: 8px;
--radius-xl: 12px;
--radius-full: 9999px;
```

---

## 8. 다크 모드

### 8.1 다크 모드 색상

```css
/* Dark Mode Colors */
--dark-canvas-default: #0D1117;
--dark-canvas-subtle: #161B22;
--dark-border-default: #30363D;
--dark-border-muted: #21262D;

--dark-fg-default: #C9D1D9;
--dark-fg-muted: #8B949E;
--dark-fg-subtle: #6E7681;
```

### 8.2 다크 모드 전환

```css
@media (prefers-color-scheme: dark) {
  /* 다크 모드 스타일 적용 */
}
```

또는 클래스 기반:
```css
.dark {
  /* 다크 모드 스타일 */
}
```

---

## 9. 반응형 디자인

### 9.1 모바일 우선 (Mobile First)

```css
/* 모바일 기본 스타일 */
.element {
  padding: 16px;
}

/* 태블릿 이상 */
@media (min-width: 768px) {
  .element {
    padding: 24px;
  }
}

/* 데스크톱 이상 */
@media (min-width: 1024px) {
  .element {
    padding: 32px;
  }
}
```

### 9.2 터치 친화적 디자인

- **최소 터치 영역**: 44px × 44px
- **버튼 간격**: 최소 8px
- **텍스트 크기**: 최소 14px (모바일)

---

## 10. 접근성 (Accessibility)

### 10.1 색상 대비

- **일반 텍스트**: 최소 4.5:1
- **큰 텍스트**: 최소 3:1
- **UI 컴포넌트**: 최소 3:1

### 10.2 포커스 인디케이터

모든 상호작용 요소에 명확한 포커스 상태 제공:
```css
:focus-visible {
  outline: 2px solid #0969DA;
  outline-offset: 2px;
}
```

### 10.3 스크린 리더 지원

- 의미 있는 `alt` 텍스트
- ARIA 레이블 사용
- 시맨틱 HTML 태그 사용

---

## 11. 코드 예제

### 11.1 버튼 컴포넌트 (React)

```jsx
const Button = ({ variant = 'primary', size = 'md', children, ...props }) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition';

  const variants = {
    primary: 'bg-green-600 text-white hover:bg-green-700',
    secondary: 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50',
    danger: 'bg-red-600 text-white hover:bg-red-700'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base'
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]}`}
      {...props}
    >
      {children}
    </button>
  );
};
```

### 11.2 카드 컴포넌트 (React)

```jsx
const Card = ({ children, hover = false }) => {
  return (
    <div className={`
      bg-white border border-gray-300 rounded-md p-4 shadow-sm
      ${hover ? 'hover:shadow-md hover:border-gray-400 transition' : ''}
    `}>
      {children}
    </div>
  );
};
```

---

## 12. 참고 자료

### 12.1 외부 리소스

- [GitHub Primer Design System](https://primer.style/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Material Design](https://material.io/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

### 12.2 도구

- **색상 도구**: [Coolors](https://coolors.co/)
- **대비 검사**: [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- **아이콘**: [Octicons](https://primer.style/foundations/icons), [Lucide](https://lucide.dev/)

---

**문서 종료**

버전: 1.0
최종 수정: 2025-11-27
