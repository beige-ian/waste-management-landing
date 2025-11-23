#!/usr/bin/env python3
import requests
import json
import time
import threading
import uuid

class SSEClient:
    def __init__(self, url):
        self.url = url
        self.session_id = str(uuid.uuid4())
        self.msg_id = 1
        self.responses = {}
        self.initialized = False

    def send_message(self, method, params=None):
        if params is None:
            params = {}

        msg_id = self.msg_id
        self.msg_id += 1

        payload = {
            'jsonrpc': '2.0',
            'method': method,
            'params': params,
            'id': msg_id
        }

        print(f"\n>>> Sending {method} (id={msg_id})...")

        # Try different endpoints and parameters
        endpoints_to_try = [
            f'{self.url}/sse?sessionId={self.session_id}',
            f'{self.url}/sse',
            f'{self.url}/mcp?sessionId={self.session_id}',
            f'{self.url}/mcp',
        ]

        for endpoint in endpoints_to_try:
            try:
                print(f"  Trying: {endpoint}")
                response = requests.post(
                    endpoint,
                    json=payload,
                    headers={
                        'Content-Type': 'application/json',
                        'Accept': 'text/event-stream, application/json',
                        'X-Session-ID': self.session_id,
                    },
                    stream=True,
                    timeout=5
                )

                print(f"  Status: {response.status_code}")

                # Parse response
                content = ''
                for line in response.iter_lines(decode_unicode=True):
                    if line:
                        content += line + '\n'
                        if line.startswith('data:'):
                            try:
                                data = json.loads(line[5:].strip())
                                print(f"  ✓ Response: {json.dumps(data, indent=2)[:200]}...")
                                return data
                            except:
                                pass

                # Try parsing as JSON
                try:
                    result = json.loads(content)
                    print(f"  ✓ Response: {json.dumps(result, indent=2)[:200]}...")
                    return result
                except:
                    pass

                if response.status_code == 200:
                    print(f"  Content: {content[:200]}")

            except Exception as e:
                print(f"  Error: {e}")
                continue

        return {'error': 'All attempts failed'}

def main():
    print("=" * 60)
    print("Attempting SSE connection to Figma MCP Server")
    print("=" * 60)

    client = SSEClient('http://127.0.0.1:3845')

    # Try initialize
    result = client.send_message('initialize', {
        'protocolVersion': '2024-11-05',
        'capabilities': {},
        'clientInfo': {
            'name': 'sse-client',
            'version': '1.0.0'
        }
    })

    if 'result' in result:
        print("\n✓✓✓ INITIALIZATION SUCCESSFUL! ✓✓✓")
        client.initialized = True

        # Send initialized notification
        time.sleep(0.2)
        client.send_message('notifications/initialized', {})

        # List tools
        time.sleep(0.2)
        tools = client.send_message('tools/list', {})

        if 'result' in tools:
            print("\n✓✓✓ TOOLS LIST SUCCESSFUL! ✓✓✓")
            print(json.dumps(tools, indent=2))

            # Try to get Figma node
            time.sleep(0.2)
            for tool in tools.get('result', {}).get('tools', []):
                print(f"\nTrying tool: {tool['name']}...")
                node_result = client.send_message('tools/call', {
                    'name': tool['name'],
                    'arguments': {
                        'file_key': 'zvMqcGW1tsIkFOKHcNGot7',
                        'node_id': '3121-8857'
                    }
                })

                if 'error' not in node_result:
                    print(f"\n✓✓✓ SUCCESS! ✓✓✓")
                    print(json.dumps(node_result, indent=2))
                    break

if __name__ == '__main__':
    main()
