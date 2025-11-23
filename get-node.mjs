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
              console.log('✓ Session endpoint:', this.messageEndpoint);
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
      }, 30000); // 30 seconds for design context

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
  console.log('Fetching Figma node 3121-8857...\n');

  const client = new FigmaMCPClient();
  await client.openSSE();
  await new Promise(r => setTimeout(r, 500));

  // Initialize
  await client.sendMessage('initialize', {
    protocolVersion: '2024-11-05',
    capabilities: {},
    clientInfo: { name: 'node-fetcher', version: '1.0.0' }
  });

  await new Promise(r => setTimeout(r, 200));

  // Get design context
  console.log('Getting design context for node 3121-8857...\n');
  const result = await client.sendMessage('tools/call', {
    name: 'get_design_context',
    arguments: {
      fileKey: 'zvMqcGW1tsIkFOKHcNGot7',
      nodeId: '3121-8857'
    }
  });

  console.log('\n=== DESIGN DATA ===');
  console.log(JSON.stringify(result, null, 2));

  // Also try with different parameter names
  if (result.error) {
    console.log('\nTrying alternative parameters...\n');
    const result2 = await client.sendMessage('tools/call', {
      name: 'get_design_context',
      arguments: {
        file_key: 'zvMqcGW1tsIkFOKHcNGot7',
        node_id: '3121-8857'
      }
    });
    console.log(JSON.stringify(result2, null, 2));
  }
}

main().catch(console.error);
