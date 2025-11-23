import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { default: EventSource } = require('eventsource');
import fetch from 'node-fetch';

let messageId = 1;
const pendingRequests = new Map();

function sendMessage(eventSource, method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = messageId++;
    const message = {
      jsonrpc: '2.0',
      method,
      params,
      id
    };

    pendingRequests.set(id, { resolve, reject });

    // Send via POST to /sse
    fetch('http://127.0.0.1:3845/sse', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message)
    }).catch(reject);

    // Timeout after 10 seconds
    setTimeout(() => {
      if (pendingRequests.has(id)) {
        pendingRequests.delete(id);
        reject(new Error('Request timeout'));
      }
    }, 10000);
  });
}

async function main() {
  console.log('Connecting to Figma MCP via raw SSE...\n');

  const es = new EventSource('http://127.0.0.1:3845/sse', {
    headers: {
      'Content-Type': 'application/json'
    }
  });

  es.onopen = () => {
    console.log('✓ SSE connection opened\n');
  };

  es.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log('Received:', JSON.stringify(data).substring(0, 200));

      if (data.id && pendingRequests.has(data.id)) {
        const { resolve } = pendingRequests.get(data.id);
        pendingRequests.delete(data.id);
        resolve(data);
      }
    } catch (e) {
      console.error('Parse error:', e);
    }
  };

  es.onerror = (error) => {
    console.error('SSE error:', error);
  };

  // Wait for connection
  await new Promise(resolve => setTimeout(resolve, 1000));

  try {
    // Initialize
    console.log('\n1. Initializing...');
    const initResult = await sendMessage(es, 'initialize', {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: {
        name: 'raw-sse-client',
        version: '1.0.0'
      }
    });
    console.log('✓ Initialized:', initResult.result?.serverInfo?.name);

    await new Promise(resolve => setTimeout(resolve, 200));

    // Send initialized notification
    fetch('http://127.0.0.1:3845/sse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'notifications/initialized',
        params: {}
      })
    });

    await new Promise(resolve => setTimeout(resolve, 200));

    // List tools
    console.log('\n2. Listing tools...');
    const toolsResult = await sendMessage(es, 'tools/list', {});

    if (toolsResult.result?.tools) {
      console.log('✓ Available tools:');
      toolsResult.result.tools.forEach(tool => {
        console.log(`  - ${tool.name}`);
      });

      // Try each tool
      for (const tool of toolsResult.result.tools) {
        console.log(`\n3. Trying tool: ${tool.name}...`);
        try {
          const nodeResult = await sendMessage(es, 'tools/call', {
            name: tool.name,
            arguments: {
              file_key: 'zvMqcGW1tsIkFOKHcNGot7',
              node_id: '3121-8857'
            }
          });

          if (nodeResult.result) {
            console.log('\n✓✓✓ SUCCESS! ✓✓✓');
            console.log(JSON.stringify(nodeResult, null, 2));
            break;
          }
        } catch (e) {
          console.log(`  Error: ${e.message}`);
        }

        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    es.close();
  }
}

main();
