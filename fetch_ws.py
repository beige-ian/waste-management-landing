#!/usr/bin/env python3
import socket
import json
import base64
import hashlib
import struct
import time

def create_websocket_key():
    return base64.b64encode(bytes([i for i in range(16)])).decode()

def parse_websocket_frame(data):
    if len(data) < 2:
        return None

    opcode = data[0] & 0x0F
    masked = (data[1] & 0x80) != 0
    payload_len = data[1] & 0x7F

    offset = 2
    if payload_len == 126:
        payload_len = struct.unpack(">H", data[2:4])[0]
        offset = 4
    elif payload_len == 127:
        payload_len = struct.unpack(">Q", data[2:10])[0]
        offset = 10

    if masked:
        mask = data[offset:offset+4]
        offset += 4

    payload = data[offset:offset+payload_len]

    if masked:
        decoded = bytearray()
        for i in range(len(payload)):
            decoded.append(payload[i] ^ mask[i % 4])
        payload = bytes(decoded)

    return payload.decode('utf-8', errors='ignore')

def create_websocket_frame(text):
    payload = text.encode('utf-8')
    frame = bytearray()
    frame.append(0x81)  # Text frame

    length = len(payload)
    if length < 126:
        frame.append(0x80 | length)  # Masked
    elif length < 65536:
        frame.append(0x80 | 126)
        frame.extend(struct.pack(">H", length))
    else:
        frame.append(0x80 | 127)
        frame.extend(struct.pack(">Q", length))

    # Masking key
    mask = bytes([0, 0, 0, 0])
    frame.extend(mask)
    frame.extend(payload)

    return bytes(frame)

def try_websocket():
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.connect(('127.0.0.1', 3845))

    key = create_websocket_key()
    request = f"""GET /mcp HTTP/1.1\r
Host: 127.0.0.1:3845\r
Upgrade: websocket\r
Connection: Upgrade\r
Sec-WebSocket-Key: {key}\r
Sec-WebSocket-Version: 13\r
\r
"""

    sock.send(request.encode())
    response = sock.recv(4096).decode()

    print("WebSocket handshake response:")
    print(response)

    if '101' in response:
        print("\n✓ WebSocket connected!")

        # Send initialize
        init_msg = json.dumps({
            'jsonrpc': '2.0',
            'method': 'initialize',
            'params': {
                'protocolVersion': '2024-11-05',
                'capabilities': {},
                'clientInfo': {'name': 'ws-client', 'version': '1.0'}
            },
            'id': 1
        })

        sock.send(create_websocket_frame(init_msg))
        time.sleep(0.5)

        response = sock.recv(8192)
        result = parse_websocket_frame(response)
        print("\nInitialize response:")
        print(result)

        return True

    sock.close()
    return False

print("Attempting WebSocket connection...")
try:
    success = try_websocket()
    if not success:
        print("WebSocket upgrade failed")
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
