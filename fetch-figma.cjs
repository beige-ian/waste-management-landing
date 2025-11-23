const http = require('http');

async function callMCP(method, params = {}) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      jsonrpc: '2.0',
      method: method,
      params: params,
      id: Date.now()
    });

    const options = {
      hostname: '127.0.0.1',
      port: 3845,
      path: '/mcp',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream',
        'Content-Length': data.length
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        // Parse SSE format
        if (body.startsWith('event:')) {
          const lines = body.split('\n');
          const dataLine = lines.find(line => line.startsWith('data:'));
          if (dataLine) {
            body = dataLine.substring(5).trim();
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

async function main() {
  try {
    // Initialize
    console.log('Initializing MCP connection...');
    const initResult = await callMCP('initialize', {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: {
        name: 'figma-fetcher',
        version: '1.0.0'
      }
    });
    console.log('Init result:', JSON.stringify(initResult, null, 2));

    // List tools
    console.log('\nListing tools...');
    const toolsResult = await callMCP('tools/list', {});
    console.log('Tools:', JSON.stringify(toolsResult, null, 2));

    // Get node data for first design
    console.log('\nFetching node 3121-7912...');
    const node1 = await callMCP('tools/call', {
      name: 'get_figma_node',
      arguments: {
        file_key: 'zvMqcGW1tsIkFOKHcNGot7',
        node_id: '3121-7912'
      }
    });
    console.log('\n=== NODE 3121-7912 ===');
    console.log(JSON.stringify(node1, null, 2));

    // Get node data for second design
    console.log('\nFetching node 3121-7915...');
    const node2 = await callMCP('tools/call', {
      name: 'get_figma_node',
      arguments: {
        file_key: 'zvMqcGW1tsIkFOKHcNGot7',
        node_id: '3121-7915'
      }
    });
    console.log('\n=== NODE 3121-7915 ===');
    console.log(JSON.stringify(node2, null, 2));

  } catch (error) {
    console.error('Error:', error);
  }
}

main();
