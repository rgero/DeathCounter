'use strict';
const path = require('path');
const fs = require('fs');
const ioHook = require('iohook');
const {PastDataLoader, WriteToFile} = require('./FileProcessor.js');

// Key Variables
// These codes are from here - https://css-tricks.com/snippets/javascript/javascript-keycodes/
var increaseCount = "105";           // Numpad 9
var decreaseCount = "103";           // Numpad 7
var toggleCounting = "101";          // Numpad 5
var dumpCount = "104";               // Numpad 8
var exitKey = '109';
var donationMultiplier = 0.22;
var desiredFolder = "Stream_Files";
var deathFilePath =   path.join(desiredFolder,'Deaths.txt');
var donationPath =    path.join(desiredFolder,'Donation.txt');
var deathDumpPath =   path.join(desiredFolder,'DeathDump.txt');

if (desiredFolder && !fs.existsSync(desiredFolder))
{
  fs.mkdirSync(desiredFolder);
}

var deaths = PastDataLoader(deathFilePath);
var lastDeathDump = deaths;
var currCounting = false;

ioHook.on("keyup", event => {
  var keyChar = event["rawcode"];

  if (currCounting){
    if (keyChar == increaseCount)
    {
      console.log("Death Logged");
      deaths++;
    }
    if (keyChar == decreaseCount)
    {
      console.log("Death removed");
      deaths--;
    }

    var donation = "$" + Math.floor(deaths*donationMultiplier);
    WriteToFile(deathFilePath, "Deaths", deaths);
    WriteToFile(donationPath, "Donation", donation);
  }
  if (keyChar == toggleCounting)
  {
    currCounting = !currCounting;
    console.log("Counting Toggled")
  }

  if (keyChar == dumpCount)
  {
    var diffDeath = deaths - lastDeathDump;
    lastDeathDump = deaths;
    console.log("Deaths dumped : " + diffDeath.toString());
    var dumpString = diffDeath.toString() + "\n";
    fs.appendFileSync(deathDumpPath, dumpString);
  }

  if (keyChar == exitKey)
  {
    ioHook.stop();
    process.exit();
  }

});
//Register and stark hook 
ioHook.start();