# Figma MCP Server 통신 성공 보고서

날짜: 2025-11-22
작성자: Claude Code AI Assistant

---

## 요약

Figma Desktop MCP 서버와의 통신에 **완전히 성공**했습니다. Model Context Protocol (MCP)의 Streamable HTTP 전송 방식을 사용하여 Figma 디자인 데이터를 성공적으로 추출했습니다.

---

## 핵심 발견사항

### 1. MCP 프로토콜 구조

Figma MCP 서버는 **Streamable HTTP Transport** (MCP spec 2025-03-26) 방식을 사용합니다:

```
┌─────────────┐                    ┌──────────────┐
│   Client    │                    │ MCP Server   │
│             │                    │ (Figma App)  │
└──────┬──────┘                    └──────┬───────┘
       │                                  │
       │ POST /mcp                        │
       │ {"method": "initialize"}         │
       │─────────────────────────────────>│
       │                                  │
       │ SSE Stream + Mcp-Session-Id      │
       │<─────────────────────────────────│
       │                                  │
       │ POST /mcp                        │
       │ Header: Mcp-Session-Id: xxx      │
       │ {"method": "tools/call"}         │
       │─────────────────────────────────>│
       │                                  │
       │ SSE Stream with result           │
       │<─────────────────────────────────│
       │                                  │
```

### 2. 중요한 통신 규칙

#### Session ID 관리
- **Initialize 요청 시**: 서버가 응답 헤더에 `Mcp-Session-Id` 포함
- **이후 모든 요청**: 클라이언트가 헤더에 `Mcp-Session-Id` 반드시 포함
- Session ID 없으면 `HTTP 400: Invalid sessionId` 에러 발생

#### 응답 형식
- **Content-Type**: `text/event-stream` (Server-Sent Events)
- **메시지 형식**:
  ```
  event: message
  data: {"jsonrpc":"2.0","id":1,"result":{...}}
  ```

---

## 성공적으로 추출한 데이터

### 노드 5276:8625 (원스탑 서비스 섹션)

**구조**:
- Frame 9247 (메인 컨테이너)
  - Frame 9246 (텍스트 영역)
    - Chip: "원스탑 서비스"
    - Title: "분리수거장 설치부터 쓰레기 수거까지 전부 다 해드려요!"
    - Description: "원하는 날짜에, 음식물 쓰레기든..."
  - 풀필먼트 이미지

**생성된 React 코드**: ✅ 완료
**스크린샷**: ✅ 저장됨
**메타데이터**: ✅ XML 형식

### 노드 5276:8632 (비용 절감 섹션)

**구조**:
- Frame 9384 2 (메인 컨테이너)
  - 복잡한 벡터 그래픽 (쓰레기통 일러스트)
  - Frame 9246 (텍스트 영역)
    - Chip: "쓰레기 처리 비용 절감"
    - Title: "몸은 편안해 지고 비용은 절약되는 마법"
    - Description: "커버링 빌딩과 함께라면..."

**생성된 React 코드**: ✅ 완료
**스크린샷**: ✅ 저장됨
**메타데이터**: ✅ XML 형식

---

## 사용 가능한 MCP 도구

Figma MCP 서버가 제공하는 도구들:

| 도구 이름 | 설명 | 용도 |
|---------|------|------|
| **get_design_context** | UI 코드 생성 | React + Tailwind 코드 자동 생성 |
| **get_variable_defs** | 디자인 변수 추출 | 색상, 간격, 타이포그래피 토큰 |
| **get_screenshot** | 스크린샷 생성 | 시각적 참조 이미지 |
| **get_metadata** | 메타데이터 추출 | XML 형식의 구조 정보 |
| **get_figjam** | FigJam 데이터 | 다이어그램 메타데이터 |
| **get_code_connect_map** | 코드 매핑 | Figma 노드 ↔ 실제 컴포넌트 매핑 |

---

## 추출된 디자인 시스템

### 타이포그래피

```typescript
const typography = {
  'Lable/3': {
    family: 'Pretendard',
    style: 'Bold',
    size: 14,
    weight: 700,
    lineHeight: 20
  },
  'Title/1': {
    family: 'Pretendard',
    style: 'Bold',
    size: 36,
    weight: 700,
    lineHeight: 48
  },
  'Body/3': {
    family: 'Pretendard',
    style: 'Regular',
    size: 16,
    weight: 400,
    lineHeight: 24
  }
};
```

### 색상 토큰

```css
--alias/background/primary: #ffffff
--alias/background/brand/secondarynormal: #eaf2fe
--alias/border/accent/neutral/tertiarynormal: #f4f4f5
--alias/text/brand/primarynormal: #3385ff
--alias/text/accent/neutral/primaryheavy: #46474c
--alias/text/accent/neutral/primarystrong: #5a5c63
```

### 간격/반경

```css
--alias/spacing/4: 4px
--alias/spacing/6: 6px
--alias/spacing/8: 8px
--alias/spacing/10: 10px
--alias/spacing/16: 16px
--alias/spacing/56: 56px
--alias/radius/6: 6px
--alias/radius/40: 40px
```

---

## 이미지 에셋 관리

Figma MCP 서버는 이미지를 **localhost 서버**에서 제공합니다:

```javascript
// 예시
const img4X1 = "http://localhost:3845/assets/9427cf8e3d4ae01e27c6ee53be33d053e0b52e03.png";
const imgVector = "http://localhost:3845/assets/9f7c914f4b5c8ee312ee57e62489483489eed0ff.svg";

// 사용
<img src={img4X1} />
```

**주의사항**:
- 이미지는 Figma 앱이 실행 중일 때만 접근 가능
- 프로덕션 배포 전에 실제 에셋으로 교체 필요
- SVG와 PNG 모두 동일한 방식으로 처리

---

## 생성된 파일 목록

```
/Users/hamjeonghun/waste-management-landing/
├── figma-5276-8625-metadata.xml        (882 bytes)
├── figma-5276-8625-design.json         (4.6 KB)
├── figma-5276-8625-screenshot.json     (93 KB - base64 이미지)
├── figma-5276-8632-metadata.xml        (8.0 KB)
├── figma-5276-8632-design.json         (36 KB)
├── figma-5276-8632-screenshot.json     (340 KB - base64 이미지)
├── test-figma-mcp-streamable.cjs       (클라이언트 구현)
└── get-figma-design.cjs                (데이터 추출 스크립트)
```

---

## 구현된 클라이언트 코드

### 핵심 기능

```javascript
class FigmaMCPClient {
  // 1. 초기화 및 세션 ID 획득
  async initialize() {
    const response = await this.sendRequest('initialize', {
      protocolVersion: '2024-11-05',
      capabilities: { roots: { listChanged: true } },
      clientInfo: { name: 'client-name', version: '1.0.0' }
    });
    // response 헤더에서 Mcp-Session-Id 자동 추출
  }

  // 2. 디자인 컨텍스트 가져오기
  async getDesignContext(nodeId) {
    return this.sendRequest('tools/call', {
      name: 'get_design_context',
      arguments: {
        nodeId: '5276:8625',  // 콜론(:) 또는 하이픈(-) 모두 가능
        clientLanguages: 'javascript,html,css',
        clientFrameworks: 'react',
        forceCode: true
      }
    });
  }

  // 3. SSE 스트림 파싱
  handleSSEResponse(res, resolve, reject) {
    let buffer = '';
    res.on('data', (chunk) => {
      buffer += chunk;
      const lines = buffer.split('\n\n');
      buffer = lines.pop();

      for (const line of lines) {
        const message = this.parseSSEMessage(line);
        // event: message, data: {...}
      }
    });
  }
}
```

---

## 문제 해결 과정

### 문제 1: "Invalid request body for initialize request"
**원인**: SSE Transport 방식 오해 (POST 단독 사용 시도)
**해결**: Streamable HTTP 방식으로 전환 (POST + SSE 응답)

### 문제 2: "Invalid sessionId"
**원인**: 세션 ID 없이 tools/list 요청
**해결**: Initialize 응답 헤더에서 Mcp-Session-Id 추출 후 모든 요청에 포함

### 문제 3: Node.js ES Module 오류
**원인**: package.json에 "type": "module" 설정
**해결**: 파일 확장자를 .cjs로 변경 (CommonJS)

---

## 다음 단계 제안

### 1. 프로덕션 통합

```javascript
// 1. 디자인 토큰 추출
const tokens = extractDesignTokens(figmaData);
// → CSS Variables 또는 Tailwind config 생성

// 2. 컴포넌트 변환
const reactCode = convertToReactComponent(figmaData);
// → Tailwind → CSS Modules 또는 styled-components

// 3. 이미지 다운로드
const images = downloadFigmaAssets(figmaData);
// → localhost:3845 URL → 실제 파일 시스템
```

### 2. 자동화 워크플로우

```bash
# Figma 디자인 변경 시 자동 감지
node watch-figma-changes.cjs

# 변경 사항 자동 반영
git diff components/
git commit -m "Update: Figma design changes"
```

### 3. CI/CD 통합

```yaml
# .github/workflows/figma-sync.yml
name: Figma Design Sync
on:
  schedule:
    - cron: '0 */6 * * *'  # 6시간마다

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Sync Figma Design
        run: node scripts/sync-figma.cjs
```

---

## 참고 자료

### MCP 공식 문서
- Specification: https://spec.modelcontextprotocol.io
- Figma MCP: https://developers.figma.com/docs/figma-mcp-server/
- GitHub: https://github.com/modelcontextprotocol

### 관련 기술
- JSON-RPC 2.0: https://www.jsonrpc.org/specification
- Server-Sent Events: https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events
- Streamable HTTP: https://looselyconnected.wordpress.com/2025/05/26/mcp-streamable-http-spec/

---

## 결론

Figma MCP Server와의 통신에 **완전히 성공**했으며, 다음 항목들을 달성했습니다:

✅ MCP Streamable HTTP 프로토콜 구현
✅ Session ID 기반 상태 관리
✅ SSE 스트림 파싱 및 메시지 처리
✅ 노드 5276:8625, 5276:8632 데이터 추출
✅ React + Tailwind 코드 생성
✅ 디자인 토큰 추출 (색상, 타이포그래피, 간격)
✅ 메타데이터 및 스크린샷 저장

이제 이 데이터를 활용하여 실제 프로덕션 코드로 변환할 수 있습니다.

---

**문의사항이 있으시면 생성된 스크립트를 참고하세요**:
- `/Users/hamjeonghun/waste-management-landing/test-figma-mcp-streamable.cjs`
- `/Users/hamjeonghun/waste-management-landing/get-figma-design.cjs`
