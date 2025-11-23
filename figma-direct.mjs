import http from 'http';

function post(path, data) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(data);
    const options = {
      hostname: '127.0.0.1',
      port: 3845,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream',
        'Content-Length': Buffer.byteLength(payload),
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        // Parse SSE format
        if (body.includes('event:')) {
          const lines = body.split('\n');
          for (const line of lines) {
            if (line.startsWith('data:')) {
              try {
                resolve(JSON.parse(line.substring(5).trim()));
                return;
              } catch (e) {}
            }
          }
        }

        try {
          resolve(JSON.parse(body));
        } catch (e) {
          resolve({ error: body });
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function main() {
  console.log('Direct HTTP connection to Figma MCP...\n');

  let msgId = 1;

  // Step 1: Initialize
  console.log('1. Initializing...');
  const init = await post('/mcp', {
    jsonrpc: '2.0',
    method: 'initialize',
    params: {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: { name: 'direct-client', version: '1.0.0' }
    },
    id: msgId++
  });

  if (init.result) {
    console.log('✓ Server:', init.result.serverInfo.name);
  } else {
    console.log('✗ Init failed:', init);
    return;
  }

  // Step 2: List resources (maybe they store files there?)
  console.log('\n2. Listing resources...');
  const resources = await post('/mcp', {
    jsonrpc: '2.0',
    method: 'resources/list',
    id: msgId++
  });

  console.log('Resources:', JSON.stringify(resources, null, 2).substring(0, 500));

  // Step 3: List prompts
  console.log('\n3. Listing prompts...');
  const prompts = await post('/mcp', {
    jsonrpc: '2.0',
    method: 'prompts/list',
    id: msgId++
  });

  console.log('Prompts:', JSON.stringify(prompts, null, 2).substring(0, 500));

  // Step 4: Read specific resource if available
  if (resources.result?.resources) {
    console.log('\n4. Trying to read resources...');
    for (const resource of resources.result.resources.slice(0, 3)) {
      console.log(`\nResource: ${resource.uri}`);
      const readResult = await post('/mcp', {
        jsonrpc: '2.0',
        method: 'resources/read',
        params: { uri: resource.uri },
        id: msgId++
      });
      console.log(JSON.stringify(readResult, null, 2).substring(0, 300));
    }
  }

  console.log('\n✓ Exploration complete');
}

main().catch(console.error);
