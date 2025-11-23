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
      }, 30000);

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
  console.log('Attempting to get Figma node data...\n');

  const client = new FigmaMCPClient();
  await client.openSSE();
  await new Promise(r => setTimeout(r, 500));

  await client.sendMessage('initialize', {
    protocolVersion: '2024-11-05',
    capabilities: {},
    clientInfo: { name: 'screenshot-fetcher', version: '1.0.0' }
  });

  await new Promise(r => setTimeout(r, 300));

  // Try without node ID - uses currently selected node
  console.log('Trying to get screenshot of currently selected node in Figma...\n');
  console.log('(Please select node 3121:8857 in Figma Desktop app!)\n');

  const screenshot = await client.sendMessage('tools/call', {
    name: 'get_screenshot',
    arguments: {
      nodeId: '',  // Empty = currently selected
      clientLanguages: 'typescript',
      clientFrameworks: 'react'
    }
  });

  if (screenshot.result) {
    console.log('\n✓✓✓ SUCCESS! Got screenshot! ✓✓✓\n');
    fs.writeFileSync('screenshot-result.json', JSON.stringify(screenshot, null, 2));
    console.log('Saved to: screenshot-result.json\n');
  } else {
    console.log('\n✗ Error:', screenshot.error);
    console.log('\nTrying get_metadata instead...\n');

    const metadata = await client.sendMessage('tools/call', {
      name: 'get_metadata',
      arguments: {
        nodeId: '',
        clientLanguages: 'typescript',
        clientFrameworks: 'react'
      }
    });

    if (metadata.result) {
      console.log('\n✓ Got metadata!\n');
      fs.writeFileSync('metadata-result.json', JSON.stringify(metadata, null, 2));
      console.log('Saved to: metadata-result.json\n');

      // Print preview
      if (metadata.result.content) {
        for (const item of metadata.result.content) {
          if (item.type === 'text') {
            console.log(item.text.substring(0, 500));
          }
        }
      }
    } else {
      console.log('\n✗ Metadata error:', metadata.error);
    }
  }

  process.exit(0);
}

main().catch(console.error);
