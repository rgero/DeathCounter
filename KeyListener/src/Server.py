from flask import Flask, abort, g, request, make_response, redirect
from flask_cors import CORS

def create_server():
  app = Flask(__name__)
  CORS(app)  
  return app;

