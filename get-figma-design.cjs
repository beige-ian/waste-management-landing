#!/usr/bin/env node

/**
 * Figma 디자인 데이터 추출
 * 노드 ID: 5276:8625, 5276:8632
 */

const http = require('http');
const fs = require('fs');

class FigmaMCPClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.sessionId = null;
    this.requestId = 1;
  }

  async sendRequest(method, params = {}) {
    const message = {
      jsonrpc: '2.0',
      id: this.requestId++,
      method: method,
      params: params
    };

    console.log(`\n📤 요청: ${method}`);
    if (params.nodeId) {
      console.log(`   노드 ID: ${params.nodeId}`);
    }

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/event-stream'
    };

    if (this.sessionId && method !== 'initialize') {
      headers['Mcp-Session-Id'] = this.sessionId;
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
        if (method === 'initialize' && res.headers['mcp-session-id']) {
          this.sessionId = res.headers['mcp-session-id'];
          console.log(`✅ Session ID: ${this.sessionId}`);
        }

        const contentType = res.headers['content-type'] || '';

        if (contentType.includes('text/event-stream')) {
          this.handleSSEResponse(res, resolve, reject);
        } else {
          this.handleJSONResponse(res, resolve, reject);
        }
      });

      req.on('error', reject);
      req.write(requestData);
      req.end();
    });
  }

  handleJSONResponse(res, resolve, reject) {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      if (!data) {
        resolve({ status: res.statusCode, data: null });
        return;
      }

      try {
        const json = JSON.parse(data);
        if (json.error) {
          reject(new Error(`JSON-RPC Error: ${json.error.message}`));
        } else {
          resolve({ status: res.statusCode, data: json });
        }
      } catch (err) {
        reject(new Error(`JSON 파싱 실패: ${err.message}`));
      }
    });
  }

  handleSSEResponse(res, resolve, reject) {
    let buffer = '';
    const messages = [];

    res.on('data', (chunk) => {
      buffer += chunk;
      const lines = buffer.split('\n\n');
      buffer = lines.pop();

      for (const line of lines) {
        const message = this.parseSSEMessage(line);
        if (message) {
          messages.push(message);
        }
      }
    });

    res.on('end', () => {
      resolve({ status: res.statusCode, data: messages, isStream: true });
    });

    res.on('error', reject);
  }

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

  async initialize() {
    return this.sendRequest('initialize', {
      protocolVersion: '2024-11-05',
      capabilities: {
        roots: { listChanged: true }
      },
      clientInfo: {
        name: 'figma-design-extractor',
        version: '1.0.0'
      }
    });
  }

  async getDesignContext(nodeId) {
    return this.sendRequest('tools/call', {
      name: 'get_design_context',
      arguments: {
        nodeId: nodeId,
        clientLanguages: 'javascript,html,css',
        clientFrameworks: 'react',
        forceCode: true
      }
    });
  }

  async getMetadata(nodeId) {
    return this.sendRequest('tools/call', {
      name: 'get_metadata',
      arguments: {
        nodeId: nodeId,
        clientLanguages: 'javascript',
        clientFrameworks: 'react'
      }
    });
  }

  async getScreenshot(nodeId) {
    return this.sendRequest('tools/call', {
      name: 'get_screenshot',
      arguments: {
        nodeId: nodeId,
        clientLanguages: 'javascript',
        clientFrameworks: 'react'
      }
    });
  }
}

async function main() {
  const client = new FigmaMCPClient('http://127.0.0.1:3845/mcp');

  try {
    console.log('🚀 Figma MCP 클라이언트 시작\n');

    // 1. Initialize
    await client.initialize();

    // 추출할 노드 ID
    const nodeIds = ['5276:8625', '5276:8632'];

    for (const nodeId of nodeIds) {
      console.log('\n' + '='.repeat(70));
      console.log(`노드 ${nodeId} 데이터 추출 중...`);
      console.log('='.repeat(70));

      // Metadata 가져오기
      console.log('\n1️⃣ Metadata 추출...');
      const metadataResult = await client.getMetadata(nodeId);

      if (metadataResult.isStream) {
        const metadataMsg = metadataResult.data.find(m => m.event === 'message');
        if (metadataMsg && metadataMsg.data.result) {
          const metadata = metadataMsg.data.result.content[0].text;
          console.log('✅ Metadata 수신 완료');

          // 파일에 저장
          const metadataFile = `/Users/hamjeonghun/waste-management-landing/figma-${nodeId.replace(':', '-')}-metadata.xml`;
          fs.writeFileSync(metadataFile, metadata);
          console.log(`   저장: ${metadataFile}`);
        }
      }

      await new Promise(resolve => setTimeout(resolve, 500));

      // Design Context 가져오기
      console.log('\n2️⃣ Design Context 추출...');
      const designResult = await client.getDesignContext(nodeId);

      if (designResult.isStream) {
        const designMsg = designResult.data.find(m => m.event === 'message');
        if (designMsg && designMsg.data.result) {
          const content = designMsg.data.result.content;
          console.log('✅ Design Context 수신 완료');

          // 텍스트 콘텐츠 저장
          const textContent = content.filter(c => c.type === 'text');
          if (textContent.length > 0) {
            const designFile = `/Users/hamjeonghun/waste-management-landing/figma-${nodeId.replace(':', '-')}-design.json`;
            fs.writeFileSync(designFile, JSON.stringify(textContent, null, 2));
            console.log(`   저장: ${designFile}`);
          }

          // 이미지 콘텐츠 저장
          const imageContent = content.filter(c => c.type === 'image');
          if (imageContent.length > 0) {
            console.log(`   이미지 ${imageContent.length}개 발견`);
            imageContent.forEach((img, idx) => {
              const imageFile = `/Users/hamjeonghun/waste-management-landing/figma-${nodeId.replace(':', '-')}-image-${idx}.txt`;
              fs.writeFileSync(imageFile, JSON.stringify(img, null, 2));
              console.log(`   저장: ${imageFile}`);
            });
          }
        }
      }

      await new Promise(resolve => setTimeout(resolve, 500));

      // Screenshot 가져오기
      console.log('\n3️⃣ Screenshot 추출...');
      const screenshotResult = await client.getScreenshot(nodeId);

      if (screenshotResult.isStream) {
        const screenshotMsg = screenshotResult.data.find(m => m.event === 'message');
        if (screenshotMsg && screenshotMsg.data.result) {
          const content = screenshotMsg.data.result.content;
          console.log('✅ Screenshot 수신 완료');

          const imageContent = content.filter(c => c.type === 'image');
          if (imageContent.length > 0) {
            const screenshotFile = `/Users/hamjeonghun/waste-management-landing/figma-${nodeId.replace(':', '-')}-screenshot.json`;
            fs.writeFileSync(screenshotFile, JSON.stringify(imageContent[0], null, 2));
            console.log(`   저장: ${screenshotFile}`);
          }
        }
      }

      console.log(`\n✅ 노드 ${nodeId} 데이터 추출 완료!`);
    }

    console.log('\n' + '='.repeat(70));
    console.log('🎉 모든 데이터 추출 완료!');
    console.log('='.repeat(70));

  } catch (error) {
    console.error('\n❌ 오류 발생:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
