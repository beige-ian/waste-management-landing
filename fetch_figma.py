#!/usr/bin/env python3
import requests
import json
import time

class MCPClient:
    def __init__(self, base_url):
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'Accept': 'application/json, text/event-stream'
        })
        self.msg_id = 1

    def call(self, method, params=None):
        if params is None:
            params = {}

        payload = {
            'jsonrpc': '2.0',
            'method': method,
            'params': params,
            'id': self.msg_id
        }
        self.msg_id += 1

        response = self.session.post(
            f'{self.base_url}/mcp',
            data=json.dumps(payload),
            stream=True
        )

        # Parse SSE response
        content = response.text
        if 'event:' in content:
            lines = content.split('\n')
            for line in lines:
                if line.startswith('data:'):
                    try:
                        return json.loads(line[5:].strip())
                    except:
                        continue

        try:
            return json.loads(content)
        except:
            return {'error': content}

    def initialize(self):
        result = self.call('initialize', {
            'protocolVersion': '2024-11-05',
            'capabilities': {},
            'clientInfo': {
                'name': 'figma-fetcher',
                'version': '1.0.0'
            }
        })
        # Send initialized notification
        time.sleep(0.1)
        self.session.post(
            f'{self.base_url}/mcp',
            data=json.dumps({
                'jsonrpc': '2.0',
                'method': 'notifications/initialized',
                'params': {}
            })
        )
        return result

    def list_tools(self):
        return self.call('tools/list', {})

    def get_figma_node(self, file_key, node_id):
        # Try different tool names
        tools_to_try = [
            'get_figma_node',
            'get_dev_resources',
            'get_figma_file',
            'figma_get_node',
            'figma_inspect'
        ]

        for tool_name in tools_to_try:
            print(f"Trying tool: {tool_name}")
            result = self.call('tools/call', {
                'name': tool_name,
                'arguments': {
                    'file_key': file_key,
                    'node_id': node_id
                }
            })

            if 'error' not in result or 'Unknown tool' not in str(result.get('error', {})):
                return result
            time.sleep(0.1)

        return result

def main():
    print("Connecting to Figma MCP Server...")
    client = MCPClient('http://127.0.0.1:3845')

    # Initialize
    print("\n1. Initializing...")
    init_result = client.initialize()
    print(f"✓ Server: {init_result.get('result', {}).get('serverInfo', {}).get('name', 'Unknown')}")
    time.sleep(0.2)

    # List tools
    print("\n2. Listing available tools...")
    tools_result = client.list_tools()
    if 'result' in tools_result and 'tools' in tools_result['result']:
        tools = tools_result['result']['tools']
        print(f"✓ Found {len(tools)} tools:")
        for tool in tools:
            print(f"  - {tool['name']}: {tool.get('description', 'No description')[:60]}")
    else:
        print(f"Error: {tools_result}")
        return

    time.sleep(0.2)

    # Get Figma node
    print("\n3. Fetching Figma node 3121-8857...")
    node_result = client.get_figma_node('zvMqcGW1tsIkFOKHcNGot7', '3121-8857')

    print("\n" + "="*60)
    print("RESULT:")
    print("="*60)
    print(json.dumps(node_result, indent=2))

if __name__ == '__main__':
    main()
