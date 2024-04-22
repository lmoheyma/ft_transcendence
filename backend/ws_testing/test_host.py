import websocket
import json

websocket.enableTrace(True)
ws = websocket.create_connection("ws://localhost:8000/ws/room/test")
packet = {
"type" : "host",
"player1_pos_Y": 0,
"player1_score": 0,
"player2_pos_Y" : 0,
"player2_score" : 0,
"ball_pos_X" : 0,
"ball_pos_Y" : 0,
"ball_angle" : 0,
"ball_speed" : 0
}
ws.send(json.dumps(packet))
print("Sent.")
#print(ws.recv())
ws.close()
