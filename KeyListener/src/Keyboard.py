import asyncio
import websockets
from pynput import keyboard

connected_clients = set()

def on_release(key):
  if key == keyboard.Key.f9:
    asyncio.run(send_message_to_clients("Death"))

  if key == keyboard.Key.esc:
    return False
  
async def send_message_to_clients(message):
    if connected_clients:
        await asyncio.wait([ws.send(message) for ws in connected_clients])

async def handler(websocket, path):
  connected_clients.add(websocket)
  try:
    async for message in websocket:
        pass
  finally:
      connected_clients.remove(websocket)

async def Playing():
  async with websockets.serve(handler, "localhost", 8080):
      with keyboard.Listener(on_release=on_release) as listener:
          listener.join()

asyncio.run(Playing())