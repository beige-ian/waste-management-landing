import http from 'http';

class FigmaMCPClient {
  constructor() {
    this.messageId = 1;
    this.messageEndpoint = null;
    this.responses = new Map();
  }

  openSSE() {
    return new Promise((resolve) => {
      const req = http.get({
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
              console.log('✓ Connected');
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
      const payload = JSON.stringify({
        jsonrpc: '2.0',
        method,
        params,
        id
      });

      this.responses.set(id, resolve);

      const timeout = setTimeout(() => {
        if (this.responses.has(id)) {
          this.responses.delete(id);
          reject(new Error('Timeout'));
        }
      }, 10000);

      const originalResolve = resolve;
      this.responses.set(id, (data) => {
        clearTimeout(timeout);
        originalResolve(data);
      });

      const req = http.request({
        hostname: '127.0.0.1',
        port: 3845,
        path: this.messageEndpoint,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
        }
      }, (res) => res.resume());

      req.on('error', reject);
      req.write(payload);
      req.end();
    });
  }
}

async function main() {
  const client = new FigmaMCPClient();
  await client.openSSE();
  await new Promise(r => setTimeout(r, 500));

  // Initialize
  await client.sendMessage('initialize', {
    protocolVersion: '2024-11-05',
    capabilities: {},
    clientInfo: { name: 'tool-checker', version: '1.0.0' }
  });

  await new Promise(r => setTimeout(r, 200));

  // List tools with FULL schema
  const tools = await client.sendMessage('tools/list', {});

  console.log('\n=== AVAILABLE TOOLS ===\n');
  if (tools.result?.tools) {
    for (const tool of tools.result.tools) {
      console.log(`\n📦 ${tool.name}`);
      console.log(`   Description: ${tool.description || 'N/A'}`);
      console.log(`   Input Schema:`, JSON.stringify(tool.inputSchema, null, 2));
    }
  }
}

main().catch(console.error);
