import websocket
import ssl
import json

ssl_opts = {"cert_reqs": ssl.CERT_NONE}
websocket.enableTrace(True)
ws = websocket.create_connection("wss://localhost:8000/ws/room/test/1", sslopt=ssl_opts)
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
