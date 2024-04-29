import websocket
import json

websocket.enableTrace(True)
ws = websocket.create_connection("ws://localhost:8000/ws/room/test/2")
print("Receiving ...")
#ws.send(json.dumps(packet))
print(ws.recv())
ws.close()
