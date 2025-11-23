const http = require('http');

// Keep-alive agent to reuse connection
const agent = new http.Agent({ keepAlive: true });

let sessionId = Date.now();

async function callMCP(method, params = {}, useSSE = true) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      jsonrpc: '2.0',
      method: method,
      params: params,
      id: sessionId++
    });

    const options = {
      hostname: '127.0.0.1',
      port: 3845,
      path: useSSE ? '/sse' : '/mcp',
      method: 'POST',
      agent: agent,
      headers: {
        'Content-Type': 'application/json',
        'Accept': useSSE ? 'text/event-stream' : 'application/json, text/event-stream',
        'Content-Length': data.length,
        'Connection': 'keep-alive'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        // Parse SSE format
        if (body.includes('event:')) {
          const lines = body.split('\n');
          for (const line of lines) {
            if (line.startsWith('data:')) {
              try {
                const parsed = JSON.parse(line.substring(5).trim());
                resolve(parsed);
                return;
              } catch (e) {
                // Continue to next line
              }
            }
          }
        }
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          resolve(body);
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  try {
    // Initialize via SSE
    console.log('Initializing MCP connection via SSE...');
    const initResult = await callMCP('initialize', {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: {
        name: 'figma-fetcher',
        version: '1.0.0'
      }
    }, true);

    console.log('✓ Initialized');
    await sleep(100);

    // Send initialized notification
    console.log('Sending initialized notification...');
    await callMCP('notifications/initialized', {}, false);
    await sleep(100);

    // List tools
    console.log('Listing tools...');
    const toolsResult = await callMCP('tools/list', {}, false);

    if (toolsResult.result && toolsResult.result.tools) {
      console.log('✓ Available tools:', toolsResult.result.tools.map(t => t.name).join(', '));
    }
    await sleep(100);

    // Get node data
    console.log('\nFetching Figma node 3121-8857...');
    const nodeResult = await callMCP('tools/call', {
      name: 'get_dev_resources',
      arguments: {
        file_key: 'zvMqcGW1tsIkFOKHcNGot7',
        node_ids: ['3121:8857']
      }
    }, false);

    console.log('\n=== FIGMA NODE DATA ===');
    console.log(JSON.stringify(nodeResult, null, 2));

    // Try alternative method
    if (nodeResult.error) {
      console.log('\nTrying alternative method: get_figma_file...');
      const fileResult = await callMCP('tools/call', {
        name: 'get_figma_file',
        arguments: {
          file_key: 'zvMqcGW1tsIkFOKHcNGot7'
        }
      }, false);
      console.log('\n=== FILE DATA ===');
      console.log(JSON.stringify(fileResult, null, 2));
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    agent.destroy();
  }
}

main();
