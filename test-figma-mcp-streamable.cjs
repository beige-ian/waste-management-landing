#!/usr/bin/env node

/**
 * Figma MCP Server - Streamable HTTP Transport 구현
 *
 * MCP Streamable HTTP 프로토콜 (2025-03-26 spec):
 * 1. POST로 initialize 요청 → 서버가 Mcp-Session-Id 헤더 반환
 * 2. 이후 모든 요청에 Mcp-Session-Id 헤더 포함 필수
 * 3. 응답은 일반 JSON 또는 SSE 스트림 형태
 */

const http = require('http');

class FigmaMCPClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.sessionId = null;
    this.requestId = 1;
  }

  // JSON-RPC 요청 전송
  async sendRequest(method, params = {}) {
    const message = {
      jsonrpc: '2.0',
      id: this.requestId++,
      method: method,
      params: params
    };

    console.log('\n' + '='.repeat(70));
    console.log(`📤 요청: ${method}`);
    console.log('='.repeat(70));
    console.log(JSON.stringify(message, null, 2));

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/event-stream'
    };

    // Initialize 이후에는 세션 ID 포함
    if (this.sessionId && method !== 'initialize') {
      headers['Mcp-Session-Id'] = this.sessionId;
      console.log(`🔑 Session ID: ${this.sessionId}`);
    }

    return new Promise((resolve, reject) => {
      const url = new URL(this.baseUrl);
      const requestData = JSON.stringify(message);

      const req = http.request({
        hostname: url.hostname,
        port: url.port,
        path: url.pathname,
        method: 'POST',
        headers: {
          ...headers,
          'Content-Length': Buffer.byteLength(requestData)
        }
      }, (res) => {
        console.log(`\n📥 응답: HTTP ${res.statusCode}`);
        console.log('📋 헤더:', JSON.stringify(res.headers, null, 2));

        // Initialize 응답에서 세션 ID 추출
        if (method === 'initialize' && res.headers['mcp-session-id']) {
          this.sessionId = res.headers['mcp-session-id'];
          console.log(`✅ Session ID 획득: ${this.sessionId}`);
        }

        const contentType = res.headers['content-type'] || '';

        // SSE 스트림 처리
        if (contentType.includes('text/event-stream')) {
          this.handleSSEResponse(res, resolve, reject);
        } else {
          // 일반 JSON 응답 처리
          this.handleJSONResponse(res, resolve, reject);
        }
      });

      req.on('error', (err) => {
        console.error('❌ 요청 실패:', err);
        reject(err);
      });

      req.write(requestData);
      req.end();
    });
  }

  // 일반 JSON 응답 처리
  handleJSONResponse(res, resolve, reject) {
    let data = '';
    res.setEncoding('utf8');

    res.on('data', chunk => data += chunk);

    res.on('end', () => {
      if (!data) {
        console.log('✅ 응답: (빈 응답)');
        resolve({ status: res.statusCode, data: null });
        return;
      }

      try {
        const json = JSON.parse(data);
        console.log('✅ 응답 데이터:');
        console.log(JSON.stringify(json, null, 2));

        if (json.error) {
          reject(new Error(`JSON-RPC Error: ${json.error.message} (code: ${json.error.code})`));
        } else {
          resolve({ status: res.statusCode, data: json });
        }
      } catch (err) {
        console.log('📄 응답 원문:', data);
        reject(new Error(`JSON 파싱 실패: ${err.message}`));
      }
    });
  }

  // SSE 스트림 응답 처리
  handleSSEResponse(res, resolve, reject) {
    console.log('📡 SSE 스트림 수신 중...');

    let buffer = '';
    const messages = [];

    res.setEncoding('utf8');

    res.on('data', (chunk) => {
      buffer += chunk;
      const lines = buffer.split('\n\n');
      buffer = lines.pop(); // 마지막 불완전한 메시지는 버퍼에 유지

      for (const line of lines) {
        const message = this.parseSSEMessage(line);
        if (message) {
          console.log('📨 SSE 메시지:', JSON.stringify(message, null, 2));
          messages.push(message);
        }
      }
    });

    res.on('end', () => {
      console.log('✅ SSE 스트림 완료');
      resolve({ status: res.statusCode, data: messages, isStream: true });
    });

    res.on('error', reject);
  }

  // SSE 메시지 파싱
  parseSSEMessage(rawMessage) {
    const lines = rawMessage.split('\n');
    let event = 'message';
    let data = '';

    for (const line of lines) {
      if (line.startsWith('event:')) {
        event = line.substring(6).trim();
      } else if (line.startsWith('data:')) {
        data += line.substring(5).trim();
      }
    }

    if (!data) return null;

    try {
      return {
        event: event,
        data: JSON.parse(data)
      };
    } catch (err) {
      return {
        event: event,
        data: data
      };
    }
  }

  // Initialize
  async initialize() {
    return this.sendRequest('initialize', {
      protocolVersion: '2024-11-05',
      capabilities: {
        roots: {
          listChanged: true
        }
      },
      clientInfo: {
        name: 'figma-mcp-test-client',
        version: '1.0.0'
      }
    });
  }

  // Tools 목록 조회
  async listTools() {
    return this.sendRequest('tools/list', {});
  }

  // Resources 목록 조회
  async listResources() {
    return this.sendRequest('resources/list', {});
  }

  // Prompts 목록 조회
  async listPrompts() {
    return this.sendRequest('prompts/list', {});
  }

  // Tool 호출
  async callTool(name, args = {}) {
    return this.sendRequest('tools/call', {
      name: name,
      arguments: args
    });
  }

  // Resource 읽기
  async readResource(uri) {
    return this.sendRequest('resources/read', {
      uri: uri
    });
  }
}

// 테스트 실행
async function main() {
  const client = new FigmaMCPClient('http://127.0.0.1:3845/mcp');

  try {
    // 1. Initialize
    console.log('\n🚀 Figma MCP 클라이언트 시작\n');
    await client.initialize();

    // 2. Tools 목록
    await new Promise(resolve => setTimeout(resolve, 500));
    const toolsResult = await client.listTools();

    if (toolsResult.data && toolsResult.data.result && toolsResult.data.result.tools) {
      console.log('\n🔧 사용 가능한 도구:');
      toolsResult.data.result.tools.forEach(tool => {
        console.log(`  - ${tool.name}: ${tool.description || '(설명 없음)'}`);
      });
    }

    // 3. Resources 목록
    await new Promise(resolve => setTimeout(resolve, 500));
    const resourcesResult = await client.listResources();

    if (resourcesResult.data && resourcesResult.data.result && resourcesResult.data.result.resources) {
      console.log('\n📦 사용 가능한 리소스:');
      resourcesResult.data.result.resources.forEach(resource => {
        console.log(`  - ${resource.uri}: ${resource.name || '(이름 없음)'}`);
      });
    }

    // 4. Prompts 목록
    await new Promise(resolve => setTimeout(resolve, 500));
    const promptsResult = await client.listPrompts();

    if (promptsResult.data && promptsResult.data.result && promptsResult.data.result.prompts) {
      console.log('\n💬 사용 가능한 프롬프트:');
      promptsResult.data.result.prompts.forEach(prompt => {
        console.log(`  - ${prompt.name}: ${prompt.description || '(설명 없음)'}`);
      });
    }

    // 5. 특정 도구 테스트 (get_design_context가 있다면)
    if (toolsResult.data && toolsResult.data.result && toolsResult.data.result.tools) {
      const hasDesignContext = toolsResult.data.result.tools.some(t => t.name === 'get_design_context');

      if (hasDesignContext) {
        console.log('\n🎨 get_design_context 도구 테스트...');
        await new Promise(resolve => setTimeout(resolve, 500));

        // Figma 파일 URL에서 노드 ID 추출
        // 예: https://www.figma.com/design/UrB2dTBdv1SwKu8WBnYpri/커버링-홈페이지?node-id=5276-8625
        const testResult = await client.callTool('get_design_context', {
          // 실제 Figma 선택된 노드가 있어야 동작할 수 있음
        });

        console.log('결과:', testResult);
      }
    }

    console.log('\n✅ 모든 테스트 완료!');

  } catch (error) {
    console.error('\n❌ 오류 발생:', error.message);
    process.exit(1);
  }
}

// 에러 핸들러
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled rejection:', err);
  process.exit(1);
});

main();
