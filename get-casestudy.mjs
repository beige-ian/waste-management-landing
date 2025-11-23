import http from 'http';
import fs from 'fs';

class FigmaMCPClient {
  constructor() {
    this.messageId = 1;
    this.messageEndpoint = null;
    this.responses = new Map();
  }

  openSSE() {
    return new Promise((resolve) => {
      http.get({
        hostname: '127.0.0.1',
        port: 3845,
        path: '/sse',
        headers: { 'Accept': 'text/event-stream', 'Cache-Control': 'no-cache' }
      }, (res) => {
        let buffer = '';
        res.on('data', (chunk) => {
          buffer += chunk.toString();

          if (!this.messageEndpoint && buffer.includes('/messages?')) {
            const match = buffer.match(/\/messages\?[^\s\n]+/);
            if (match) {
              this.messageEndpoint = match[0];
              resolve();
            }
          }

          const lines = buffer.split('\n');
          buffer = lines.pop();

          for (const line of lines) {
            if (line.startsWith('data:')) {
              const dataContent = line.substring(5).trim();
              if (dataContent.startsWith('/messages')) continue;
              try {
                const data = JSON.parse(dataContent);
                if (data.id && this.responses.has(data.id)) {
                  this.responses.get(data.id)(data);
                  this.responses.delete(data.id);
                }
              } catch (e) {}
            }
          }
        });
      });
    });
  }

  sendMessage(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.messageId++;
      const payload = JSON.stringify({ jsonrpc: '2.0', method, params, id });

      this.responses.set(id, resolve);

      const timeout = setTimeout(() => {
        if (this.responses.has(id)) {
          this.responses.delete(id);
          reject(new Error('Timeout'));
        }
      }, 60000);

      const originalResolve = resolve;
      this.responses.set(id, (data) => {
        clearTimeout(timeout);
        originalResolve(data);
      });

      http.request({
        hostname: '127.0.0.1',
        port: 3845,
        path: this.messageEndpoint,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
        }
      }, (res) => res.resume()).on('error', reject).end(payload);
    });
  }
}

async function main() {
  console.log('✓ Figma MCP 서버에 연결 중...\n');

  const client = new FigmaMCPClient();
  await client.openSSE();
  await new Promise(r => setTimeout(r, 500));

  console.log('✓ 초기화 중...\n');
  await client.sendMessage('initialize', {
    protocolVersion: '2024-11-05',
    capabilities: {},
    clientInfo: { name: 'casestudy-fetcher', version: '1.0.0' }
  });

  await new Promise(r => setTimeout(r, 300));

  console.log('✓ 노드 3121-7911 디자인 가져오는 중...\n');
  console.log('(Figma 데스크톱 앱에서 해당 노드를 선택해주세요!)\n');

  const screenshot = await client.sendMessage('tools/call', {
    name: 'get_screenshot',
    arguments: {
      nodeId: '3121-7911',
      clientLanguages: 'typescript',
      clientFrameworks: 'react'
    }
  });

  if (screenshot.result) {
    console.log('\n✓✓✓ 성공! 스크린샷을 가져왔습니다! ✓✓✓\n');
    fs.writeFileSync('casestudy-result.json', JSON.stringify(screenshot, null, 2));
    console.log('저장 완료: casestudy-result.json\n');
  } else {
    console.log('\n✗ 에러:', screenshot.error);
  }

  process.exit(0);
}

main().catch(console.error);
