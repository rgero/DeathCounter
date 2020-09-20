'use strict';
const ioHook = require('iohook');
const DeathCounter = require('./DeathCounter.js');

var counterObj = new DeathCounter();
counterObj.loadSettings("./src/Settings.json");
counterObj.loadPastData();

ioHook.on("keyup", event => 
{
  var keyChar = event["rawcode"].toString();
  counterObj.processKey(keyChar);
});

//Register and stark hook 
ioHook.start();