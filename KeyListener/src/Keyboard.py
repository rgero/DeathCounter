from pynput import keyboard
from services import socketio

def on_release(key):
  if key == keyboard.Key.f9:
    socketio.emit("Death")

  if key == keyboard.Key.f8:
    socketio.emit("Submit")
  
keyboard_listener = keyboard.Listener(on_release=on_release)