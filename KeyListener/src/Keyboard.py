from pynput import keyboard
from services import socketio

def on_release(key):
  if key == keyboard.Key.f9:
    socketio.emit("Death")
  
keyboard_listener = keyboard.Listener(on_release=on_release)