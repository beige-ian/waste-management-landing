# Figma MCP 구현 가이드

## 📋 목적
Figma MCP를 통해 디자인을 완벽하게 구현하기 위한 표준 작업 절차 및 정책

---

## 🎯 핵심 원칙

### 1. 정확성 우선
- **추측 금지**: 색상, 치수, 폰트 등 모든 값은 정확한 스펙 기반으로 구현
- **100% 일치**: Figma 디자인과 구현 결과가 완전히 동일해야 함
- **스펙 우선, 시각 보조**: 디자인 스펙을 먼저 확보하고 스크린샷은 참고용으로만 사용

### 2. MCP 도구 활용 순서
```
1순위: get_design_context (디자인 스펙, CSS 정보)
2순위: get_metadata (메타데이터, 구조 정보)
3순위: get_screenshot (시각적 확인용)
```

---

## 🔧 표준 작업 절차

### Step 1: MCP 서버 연결
```javascript
// FigmaMCPClient 초기화
const client = new FigmaMCPClient();
await client.openSSE();
await client.sendMessage('initialize', {
  protocolVersion: '2024-11-05',
  capabilities: {},
  clientInfo: { name: 'implementation-client', version: '1.0.0' }
});
```

### Step 2: 디자인 스펙 가져오기
```javascript
// 우선순위 1: get_design_context로 정확한 스펙 가져오기
const designContext = await client.sendMessage('tools/call', {
  name: 'get_design_context',
  arguments: {
    nodeId: 'NODE_ID',
    clientLanguages: 'typescript',
    clientFrameworks: 'react',
    forceCode: true
  }
});
```

### Step 3: 스크린샷으로 시각적 확인
```javascript
// 보조용: get_screenshot로 레이아웃 확인
const screenshot = await client.sendMessage('tools/call', {
  name: 'get_screenshot',
  arguments: {
    nodeId: 'NODE_ID',
    clientLanguages: 'typescript',
    clientFrameworks: 'react'
  }
});
```

### Step 4: 스펙 기반 구현
- CSS 스펙 파일이 있으면 **정확히 그대로** 구현
- 인라인 스타일로 정확한 값 적용
- Tailwind 대신 정확한 픽셀/색상 값 사용

---

## 📐 구현 체크리스트

### 색상 (Colors)
- [ ] HEX 값 정확히 일치 (예: #66C7FF, #171719, #F7F7F8)
- [ ] 투명도(opacity) 정확히 적용
- [ ] hover/active 상태 색상 확인

### 치수 (Dimensions)
- [ ] width, height 픽셀 단위로 정확히 일치
- [ ] max-width, min-width 확인
- [ ] aspect-ratio 필요시 적용

### 간격 (Spacing)
- [ ] padding 정확히 일치
- [ ] gap 정확히 일치
- [ ] margin 정확히 일치

### 타이포그래피 (Typography)
- [ ] font-family 정확히 일치
- [ ] font-size 정확히 일치
- [ ] font-weight 정확히 일치
- [ ] line-height 정확히 일치
- [ ] letter-spacing 정확히 일치

### 레이아웃 (Layout)
- [ ] display (flex, grid 등) 정확히 일치
- [ ] flex-direction, justify-content, align-items 확인
- [ ] border-radius 정확히 일치
- [ ] border 스타일, 두께, 색상 확인

### 애니메이션 (Animation)
- [ ] transition 효과 구현
- [ ] hover 상태 구현
- [ ] active 상태 구현
- [ ] 필요시 @keyframes 애니메이션 추가

---

## ⚠️ 주의사항

### 하지 말아야 할 것
❌ Tailwind 클래스로 대충 근사값 사용
❌ 스크린샷만 보고 색상/치수 추측
❌ "비슷하면 됐지" 마인드
❌ 디자인 스펙 무시하고 임의로 수정

### 해야 할 것
✅ 정확한 HEX 색상 코드 사용
✅ 정확한 픽셀 값 사용
✅ Figma CSS 스펙 그대로 구현
✅ 인라인 스타일로 정확도 보장
✅ 구현 후 스펙과 1:1 비교 검증

---

## 📝 구현 예시

### ❌ 잘못된 구현 (추측 기반)
```tsx
<div className="bg-blue-500 rounded-xl p-4">
  <h2 className="text-4xl font-bold">제목</h2>
</div>
```

### ✅ 올바른 구현 (스펙 기반)
```tsx
<div style={{
  background: '#23AFFF',
  borderRadius: '40px',
  padding: '40px',
  width: '480px'
}}>
  <h2 style={{
    fontFamily: 'Pretendard',
    fontWeight: 700,
    fontSize: '40px',
    lineHeight: '52px',
    letterSpacing: '-0.005em',
    color: '#171719'
  }}>
    제목
  </h2>
</div>
```

---

## 🔄 워크플로우 요약

```
1. Figma 노드 ID 확인
   ↓
2. get_design_context로 스펙 가져오기
   ↓
3. get_screenshot로 레이아웃 확인
   ↓
4. 스펙 100% 일치하도록 구현
   ↓
5. 시각적 검증 (스크린샷과 비교)
   ↓
6. 코드 리뷰 (스펙과 1:1 대조)
```

---

## 🎨 프로젝트별 디자인 시스템

### 색상 팔레트
```css
/* Primary */
#23AFFF - 메인 블루
#66C7FF - 라벨 블루
#1AA3FF - 액센트 블루

/* Neutral */
#171719 - 제목 (거의 검정)
#46474C - 라벨/부제목
#5A5C63 - 본문
#C2C4C8 - Placeholder
#DBDCDF - Border
#F7F7F8 - 배경

/* White */
#FFFFFF - 카드/인풋 배경
```

### 타이포그래피
```css
Font Family: Pretendard
Letter Spacing: -0.005em (일관됨)

Display 1: 40px / 700 / 52px line-height
Heading 1: 20px / 700 / 28px line-height
Body 1: 16px / 400 / 24px line-height
Label 1: 14px / 700 / 20px line-height
```

### 간격 시스템
```
4px, 6px, 8px, 12px, 16px, 24px, 40px, 48px, 80px, 120px
```

### Border Radius
```
8px - 인풋, 버튼
40px - 카드
```

---

## 📞 체크포인트

매 구현마다 다음 질문에 YES로 답할 수 있어야 함:

1. ✅ Figma CSS 스펙을 확보했는가?
2. ✅ 모든 색상이 정확한 HEX 값인가?
3. ✅ 모든 치수가 정확한 픽셀 값인가?
4. ✅ 폰트 스펙이 완전히 일치하는가?
5. ✅ 간격/여백이 정확히 일치하는가?
6. ✅ hover/active 상태가 구현되었는가?
7. ✅ 반응형이 필요하면 구현했는가?

---

## 🚀 다음 작업 시 필수 확인사항

1. 이 문서 먼저 읽기
2. MCP 도구 순서 지키기 (design_context → screenshot)
3. 정확한 스펙 기반 구현
4. 추측 절대 금지
5. 구현 후 스펙 대조 검증

---

## 📌 마지막 업데이트
- 날짜: 2025-11-23
- 작성자: Claude Code
- 버전: 1.0

**중요**: 이 가이드는 모든 Figma 디자인 구현의 기준이 됩니다. 예외 없이 따라야 합니다.
