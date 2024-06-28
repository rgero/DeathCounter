import Server
from services import socketio
from Keyboard import keyboard_listener
import threading

if __name__ == '__main__':
  listener_thread = threading.Thread(target=keyboard_listener.start)
  listener_thread.start()

  app = Server.create_server()
  socketio.init_app(app)
  app.run(host='0.0.0.0', port=8080, debug=True)

