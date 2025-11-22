#!/usr/bin/env node

/**
 * Figma MCP Server SSE Transport Test
 *
 * MCP SSE 통신 방식:
 * 1. GET으로 SSE 연결 수립 → 서버가 'endpoint' 이벤트로 POST용 URL 전송
 * 2. 이후 모든 클라이언트 메시지는 해당 endpoint로 POST
 * 3. 서버 응답은 SSE 'message' 이벤트로 수신
 */

const http = require('http');
const { EventEmitter } = require('events');

class MCPSSEClient extends EventEmitter {
  constructor(baseUrl) {
    super();
    this.baseUrl = baseUrl;
    this.messageEndpoint = null;
    this.sseResponse = null;
    this.requestId = 1;
  }

  // SSE 연결 수립
  connect() {
    return new Promise((resolve, reject) => {
      console.log('🔌 SSE 연결 시도:', this.baseUrl);

      const req = http.request(this.baseUrl, {
        method: 'GET',
        headers: {
          'Accept': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive'
        }
      }, (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
          return;
        }

        console.log('✅ SSE 연결 성공');
        this.sseResponse = res;

        let buffer = '';
        res.setEncoding('utf8');

        res.on('data', (chunk) => {
          buffer += chunk;
          const lines = buffer.split('\n\n');
          buffer = lines.pop(); // 마지막 불완전한 메시지는 버퍼에 유지

          for (const line of lines) {
            this.parseSSEMessage(line);
          }
        });

        res.on('end', () => {
          console.log('🔌 SSE 연결 종료');
          this.emit('close');
        });

        res.on('error', (err) => {
          console.error('❌ SSE 연결 오류:', err);
          this.emit('error', err);
        });

        // endpoint 이벤트를 받을 때까지 대기
        this.once('endpoint', (endpoint) => {
          console.log('📍 메시지 엔드포인트 수신:', endpoint);
          resolve(endpoint);
        });
      });

      req.on('error', reject);
      req.end();
    });
  }

  // SSE 메시지 파싱
  parseSSEMessage(rawMessage) {
    const lines = rawMessage.split('\n');
    let event = 'message';
    let data = '';
    let id = null;

    for (const line of lines) {
      if (line.startsWith('event:')) {
        event = line.substring(6).trim();
      } else if (line.startsWith('data:')) {
        data += line.substring(5).trim();
      } else if (line.startsWith('id:')) {
        id = line.substring(3).trim();
      }
    }

    if (!data) return;

    console.log(`📨 SSE 이벤트 수신: ${event}`);

    if (event === 'endpoint') {
      this.messageEndpoint = data;
      this.emit('endpoint', data);
    } else if (event === 'message') {
      try {
        const jsonData = JSON.parse(data);
        console.log('📦 메시지 데이터:', JSON.stringify(jsonData, null, 2));
        this.emit('message', jsonData);
      } catch (err) {
        console.error('❌ JSON 파싱 실패:', data);
      }
    }
  }

  // 메시지 전송 (JSON-RPC)
  async sendMessage(method, params = {}) {
    if (!this.messageEndpoint) {
      throw new Error('Message endpoint not set. Connect first.');
    }

    const message = {
      jsonrpc: '2.0',
      id: this.requestId++,
      method: method,
      params: params
    };

    console.log('\n📤 메시지 전송:', JSON.stringify(message, null, 2));

    return new Promise((resolve, reject) => {
      const url = new URL(this.messageEndpoint);

      const req = http.request({
        hostname: url.hostname,
        port: url.port,
        path: url.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          console.log(`📥 POST 응답 (${res.statusCode}):`, data);

          if (res.statusCode === 200 || res.statusCode === 204) {
            // SSE 스트림에서 실제 응답을 받게 됨
            resolve({ status: res.statusCode, data: data });
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          }
        });
      });

      req.on('error', reject);
      req.write(JSON.stringify(message));
      req.end();
    });
  }

  close() {
    if (this.sseResponse) {
      this.sseResponse.destroy();
    }
  }
}

// 테스트 실행
async function main() {
  const client = new MCPSSEClient('http://127.0.0.1:3845/mcp');

  try {
    // 1. SSE 연결 및 endpoint 수신
    await client.connect();

    console.log('\n' + '='.repeat(60));
    console.log('단계 1: Initialize 요청');
    console.log('='.repeat(60));

    // 2. Initialize 요청
    client.once('message', (response) => {
      console.log('✅ Initialize 응답 수신');

      setTimeout(async () => {
        console.log('\n' + '='.repeat(60));
        console.log('단계 2: Tools List 요청');
        console.log('='.repeat(60));

        // 3. Tools list 요청
        client.once('message', (response) => {
          console.log('✅ Tools List 응답 수신');

          setTimeout(async () => {
            console.log('\n' + '='.repeat(60));
            console.log('단계 3: Resources List 요청');
            console.log('='.repeat(60));

            // 4. Resources list 요청
            client.once('message', (response) => {
              console.log('✅ Resources List 응답 수신');

              setTimeout(() => {
                console.log('\n✅ 모든 테스트 완료');
                client.close();
                process.exit(0);
              }, 1000);
            });

            await client.sendMessage('resources/list', {});
          }, 1000);
        });

        await client.sendMessage('tools/list', {});
      }, 1000);
    });

    await client.sendMessage('initialize', {
      protocolVersion: '2024-11-05',
      capabilities: {
        roots: { listChanged: true }
      },
      clientInfo: {
        name: 'test-client',
        version: '1.0.0'
      }
    });

  } catch (error) {
    console.error('❌ 오류 발생:', error);
    client.close();
    process.exit(1);
  }
}

// 에러 핸들러
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled rejection:', err);
  process.exit(1);
});

main();
