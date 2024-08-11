from flask_socketio import SocketIO, send, disconnect

socketio = SocketIO(cors_allowed_origins=["http://localhost:6200"])

# Track clients connected to the websocket:
connected_clients = {}

# Socket heartbeat config 
HEARTBEAT_INTERVAL = 10
HEARTBEAT_TIMEOUT = 30

def send_heartbeat():
  while True:
      # Iterate over connected clients
      for client_id in list(connected_clients.keys()):
          # Get last heartbeat timestamp for the client
          last_heartbeat = connected_clients.get(client_id)
          # Check if the client has exceeded the heartbeat timeout
          if last_heartbeat and time.time() - last_heartbeat > HEARTBEAT_TIMEOUT:
              # Client has exceeded timeout, assume disconnection
              handle_disconnect(client_id)
          else:
              # Send heartbeat message to the client
              socketio.emit('heartbeat', {}, room=client_id)
      # Wait for the next heartbeat interval
      time.sleep(HEARTBEAT_INTERVAL)

@socketio.on('connect')
def handle_connect():
  print("Person connected", flush=True)


