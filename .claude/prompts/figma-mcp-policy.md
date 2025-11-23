# Figma MCP 구현 정책

## 🎯 핵심 규칙 (절대 위반 금지)

### 1. MCP 도구 사용 순서 (필수)
```
1순위: get_design_context (디자인 스펙, CSS)
2순위: get_metadata (메타데이터)
3순위: get_screenshot (시각 확인용)
```

**중요**: screenshot만 보고 추측하지 말 것! 반드시 design_context로 정확한 스펙을 먼저 가져올 것.

### 2. 구현 정확도 100% 원칙
- ❌ Tailwind 근사값 사용 금지
- ❌ 색상/치수 추측 금지
- ✅ 정확한 HEX 코드 (#66C7FF, #171719 등)
- ✅ 정확한 픽셀 값 (480px, 40px 등)
- ✅ 인라인 스타일로 정확도 보장

### 3. 필수 확인 항목
- [ ] 색상: 정확한 HEX 값
- [ ] 치수: 정확한 픽셀 값
- [ ] 폰트: family, size, weight, line-height, letter-spacing 모두 일치
- [ ] 간격: padding, gap, margin 정확히 일치
- [ ] Border-radius: 8px, 40px 등 정확한 값

### 4. 프로젝트 디자인 토큰
```css
/* 색상 */
Primary: #23AFFF, #66C7FF, #1AA3FF
Neutral: #171719, #46474C, #5A5C63, #C2C4C8, #DBDCDF, #F7F7F8
White: #FFFFFF

/* 타이포 */
Font: Pretendard
Letter-spacing: -0.005em

/* 간격 */
4px, 6px, 8px, 12px, 16px, 24px, 40px, 48px, 80px, 120px

/* Radius */
8px (인풋/버튼), 40px (카드)
```

## 📋 작업 플로우

1. Figma 노드 ID 확인
2. `get_design_context` 호출로 스펙 확보
3. `get_screenshot` 호출로 레이아웃 확인
4. 스펙 100% 일치하도록 구현
5. 시각적 검증

## 💡 기억할 것

**"추측하지 말고, 스펙을 가져와라"**

자세한 내용은 `FIGMA_IMPLEMENTATION_GUIDE.md` 참고
