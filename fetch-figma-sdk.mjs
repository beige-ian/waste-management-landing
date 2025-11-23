import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';

async function main() {
  console.log('Connecting to Figma MCP Server with official SDK...\n');

  try {
    // Create SSE transport
    const transport = new SSEClientTransport(
      new URL('http://127.0.0.1:3845/sse')
    );

    // Create client
    const client = new Client({
      name: 'figma-sdk-client',
      version: '1.0.0'
    }, {
      capabilities: {}
    });

    // Connect
    await client.connect(transport);
    console.log('✓ Connected to MCP server!\n');

    // List tools
    const tools = await client.listTools();
    console.log('✓ Available tools:');
    tools.tools.forEach(tool => {
      console.log(`  - ${tool.name}: ${tool.description || 'No description'}`);
    });

    // Find the right tool for getting Figma nodes
    const figmaTool = tools.tools.find(t =>
      t.name.includes('node') || t.name.includes('dev') || t.name.includes('inspect')
    );

    if (figmaTool) {
      console.log(`\n✓ Using tool: ${figmaTool.name}\n`);

      // Call the tool
      const result = await client.callTool({
        name: figmaTool.name,
        arguments: {
          file_key: 'zvMqcGW1tsIkFOKHcNGot7',
          node_id: '3121-8857'
        }
      });

      console.log('✓✓✓ SUCCESS! ✓✓✓');
      console.log('\nFigma Node Data:');
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.log('\n! Could not find appropriate tool');
      console.log('Available tools:', tools.tools.map(t => t.name));
    }

    await client.close();

  } catch (error) {
    console.error('Error:', error.message);
    console.error(error.stack);
  }
}

main();
