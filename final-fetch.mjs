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
      }, 60000); // 60 seconds

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
  console.log('✓ Connecting to Figma MCP Server...\n');

  const client = new FigmaMCPClient();
  await client.openSSE();
  await new Promise(r => setTimeout(r, 500));

  console.log('✓ Initializing...\n');
  await client.sendMessage('initialize', {
    protocolVersion: '2024-11-05',
    capabilities: {},
    clientInfo: { name: 'final-fetcher', version: '1.0.0' }
  });

  await new Promise(r => setTimeout(r, 300));

  console.log('✓ Fetching design for node 3121:8857...\n');
  console.log('(This may take up to 60 seconds...)\n');

  const result = await client.sendMessage('tools/call', {
    name: 'get_design_context',
    arguments: {
      nodeId: '3121:8857',
      clientLanguages: 'typescript,javascript',
      clientFrameworks: 'react',
      forceCode: true
    }
  });

  if (result.result) {
    console.log('\n✓✓✓ SUCCESS! ✓✓✓\n');

    // Save to file
    fs.writeFileSync('figma-node-3121-8857.json', JSON.stringify(result, null, 2));
    console.log('Saved to: figma-node-3121-8857.json\n');

    // Print summary
    if (result.result.content) {
      for (const item of result.result.content) {
        if (item.type === 'text') {
          console.log('Design Data:');
          console.log(item.text.substring(0, 500));
          console.log('\n... (full data saved to file)\n');
        }
      }
    }
  } else {
    console.log('\n✗ Error:', result.error);
  }

  process.exit(0);
}

main().catch(console.error);
