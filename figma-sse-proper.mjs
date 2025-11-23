import http from 'http';

class FigmaMCPClient {
  constructor() {
    this.sessionId = null;
    this.cookies = [];
    this.messageId = 1;
    this.sseConnection = null;
    this.responses = new Map();
  }

  // Open SSE connection with GET
  openSSEConnection() {
    return new Promise((resolve, reject) => {
      console.log('Opening SSE connection...');

      const req = http.get({
        hostname: '127.0.0.1',
        port: 3845,
        path: '/sse',
        headers: {
          'Accept': 'text/event-stream',
          'Cache-Control': 'no-cache',
        }
      }, (res) => {
        console.log(`SSE connection status: ${res.statusCode}`);
        console.log('Headers:', res.headers);

        // Extract message endpoint from SSE data
        let messageEndpoint = null;

        // Extract session info from headers or cookies
        if (res.headers['set-cookie']) {
          this.cookies = res.headers['set-cookie'];
          console.log('Cookies:', this.cookies);
        }

        if (res.headers['x-session-id']) {
          this.sessionId = res.headers['x-session-id'];
          console.log('Session ID:', this.sessionId);
        }

        this.sseConnection = res;

        let buffer = '';
        res.on('data', (chunk) => {
          buffer += chunk.toString();
          console.log('Raw SSE data:', buffer.substring(0, 200));

          // Check for endpoint message
          if (!messageEndpoint && buffer.includes('/messages?')) {
            const match = buffer.match(/\/messages\?[^\s\n]+/);
            if (match) {
              messageEndpoint = match[0];
              console.log('✓ Found message endpoint:', messageEndpoint);
              this.messageEndpoint = messageEndpoint;
            }
          }

          // Parse SSE messages
          const lines = buffer.split('\n');
          buffer = lines.pop(); // Keep incomplete line in buffer

          let eventData = {};
          for (const line of lines) {
            if (line.startsWith('event:')) {
              eventData.event = line.substring(6).trim();
            } else if (line.startsWith('data:')) {
              const dataContent = line.substring(5).trim();
              // Skip if it's just the endpoint path
              if (dataContent.startsWith('/messages')) {
                continue;
              }
              try {
                const data = JSON.parse(dataContent);
                console.log('\n<<< SSE Message:', JSON.stringify(data).substring(0, 200));

                if (data.id && this.responses.has(data.id)) {
                  this.responses.get(data.id)(data);
                  this.responses.delete(data.id);
                }
              } catch (e) {
                console.log('Parse error for:', dataContent.substring(0, 50));
              }
            } else if (line.startsWith('id:')) {
              eventData.id = line.substring(3).trim();
            }
          }
        });

        res.on('end', () => {
          console.log('SSE connection closed');
        });

        res.on('error', (err) => {
          console.error('SSE error:', err);
          reject(err);
        });

        resolve();
      });

      req.on('error', reject);
    });
  }

  // Send message via POST
  async sendMessage(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.messageId++;
      const payload = JSON.stringify({
        jsonrpc: '2.0',
        method,
        params,
        id
      });

      console.log(`\n>>> Sending ${method} (id=${id})`);

      // Set up response handler BEFORE sending
      this.responses.set(id, resolve);

      // Timeout
      const timeout = setTimeout(() => {
        if (this.responses.has(id)) {
          this.responses.delete(id);
          reject(new Error('Timeout waiting for response'));
        }
      }, 15000);

      // Clear timeout when we get response
      const originalResolve = resolve;
      this.responses.set(id, (data) => {
        clearTimeout(timeout);
        originalResolve(data);
      });

      const headers = {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      };

      // Add cookies if we have them
      if (this.cookies.length > 0) {
        headers['Cookie'] = this.cookies.join('; ');
      }

      // Add session ID if we have it
      if (this.sessionId) {
        headers['X-Session-ID'] = this.sessionId;
      }

      const requestPath = this.messageEndpoint || '/sse';
      console.log(`Using endpoint: ${requestPath}`);

      const req = http.request({
        hostname: '127.0.0.1',
        port: 3845,
        path: requestPath,
        method: 'POST',
        headers
      }, (res) => {
        console.log(`POST response status: ${res.statusCode} (waiting for SSE response...)`);
        // Don't wait for POST body - response comes via SSE!
        res.resume(); // Drain the response
      });

      req.on('error', (err) => {
        clearTimeout(timeout);
        reject(err);
      });
      req.write(payload);
      req.end();
    });
  }

  async initialize() {
    const result = await this.sendMessage('initialize', {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: {
        name: 'persistent-client',
        version: '1.0.0'
      }
    });

    // Send initialized notification
    await new Promise(resolve => setTimeout(resolve, 200));
    http.request({
      hostname: '127.0.0.1',
      port: 3845,
      path: '/sse',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': this.cookies.join('; '),
      }
    }, () => {}).end(JSON.stringify({
      jsonrpc: '2.0',
      method: 'notifications/initialized',
      params: {}
    }));

    return result;
  }

  async listTools() {
    return await this.sendMessage('tools/list', {});
  }

  async callTool(name, args) {
    return await this.sendMessage('tools/call', {
      name,
      arguments: args
    });
  }

  close() {
    if (this.sseConnection) {
      this.sseConnection.destroy();
    }
  }
}

async function main() {
  const client = new FigmaMCPClient();

  try {
    // Open SSE connection first
    await client.openSSEConnection();
    await new Promise(resolve => setTimeout(resolve, 500));

    // Initialize
    console.log('\n=== INITIALIZING ===');
    const init = await client.initialize();
    if (init.result) {
      console.log('✓ Initialized:', init.result.serverInfo.name);
    } else {
      console.log('✗ Init failed:', init);
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    // List tools
    console.log('\n=== LISTING TOOLS ===');
    const tools = await client.listTools();
    if (tools.result?.tools) {
      console.log('✓ Tools:');
      tools.result.tools.forEach(t => console.log(`  - ${t.name}`));

      // Try each tool
      for (const tool of tools.result.tools) {
        console.log(`\n=== TRYING TOOL: ${tool.name} ===`);
        try {
          const result = await client.callTool(tool.name, {
            file_key: 'zvMqcGW1tsIkFOKHcNGot7',
            node_id: '3121-8857'
          });

          if (result.result) {
            console.log('\n✓✓✓ SUCCESS! ✓✓✓');
            console.log(JSON.stringify(result, null, 2));
            break;
          } else {
            console.log('Error:', result.error?.message || 'Unknown error');
          }
        } catch (e) {
          console.log('Exception:', e.message);
        }

        await new Promise(resolve => setTimeout(resolve, 300));
      }
    } else {
      console.log('✗ Tools list failed:', tools);
    }

  } catch (error) {
    console.error('Fatal error:', error);
  } finally {
    client.close();
  }
}

main();
