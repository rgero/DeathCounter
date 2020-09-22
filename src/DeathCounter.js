const FileProcessor = require('./FileProcessor.js');
const path = require('path');

class DeathCounter
{
  fileProcessor = new FileProcessor();
  currentlyCounting = false;
  deaths = 0;
  lastDeathDump = 0;

  // These codes are from here - https://css-tricks.com/snippets/javascript/javascript-keycodes/
  keybindings = {
    "increase": "105",
    "decrease": "103",
    "toggle" : "101",
    "dump" : "104",
    "exit" : "109"
  }
  desiredFolder = "./Stream_Files";
  filePaths = {
    "deaths" : path.join(this.desiredFolder, "Deaths.txt"),
    "donation" : path.join(this.desiredFolder, "Donation.txt"),
    "deathDump" : path.join(this.desiredFolder, "DeathDump.txt")
  }
  donationMultiplier = 0.22;

  loadSettings = (filePath) =>
  {
    let settings = this.fileProcessor.loadSettingsFile(filePath);

    // Process Keys
    if (settings["keybindings"])
    {
      for( const [key] of Object.entries(this.keybindings) )
      {
        if(settings["keybindings"][key])
        {
          this.keybindings[key] = settings["keybindings"][key]
        }
      }
    }

    // Process Target Folder
    if(settings["targetFolder"])
    {
      this.desiredFolder = settings["targetFolder"]
    }

    // Process File Paths
    if (settings["filePaths"])
    {
      for( const [key] of Object.entries(this.filePaths) )
      {
        if(settings["filePaths"][key])
        {
          this.filePaths[key] = path.join(this.desiredFolder, settings["filePaths"][key])
        }
      }
    }

    // Process Donation Multiplier
    if(settings["donationMultiplier"])
    {
      this.donationMultiplier = settings["donationMultiplier"]
    }

    //Check to see if stuff exists
    this.fileProcessor.checkDirectory(this.desiredFolder);
  }

  loadPastData = () => {
    this.deaths = this.fileProcessor.loadDeathData(this.filePaths["deaths"])
    this.lastDeathDump = this.deaths;
  }

  increase = () => {
    if(!this.currentlyCounting) {return};
    console.log("Death logged");
    this.deaths++;
    this.processFile();
  }

  decrease = () => {
    if(!this.currentlyCounting) {return};
    console.log("Death removed.");
    this.deaths--;
    this.processFile();
  }

  toggle = () => {
    console.log("Counting Toggled - %s", this.currentlyCounting ? "Stopped" : "Started");
    this.currentlyCounting = !this.currentlyCounting;
  }

  dumpDeaths = () => {

    let diffDeath = this.deaths - this.lastDeathDump;
    this.lastDeathDump = this.deaths;
    console.log("Deaths dumped : " + diffDeath.toString());
    let dumpString = diffDeath.toString() + "\n";
    this.fileProcessor.appendToFile(this.filePaths["deathDump"], dumpString);
  }

  processFile = () => {
    let donation = "$" + Math.floor(this.deaths * this.donationMultiplier);
    this.fileProcessor.writeToFile(this.filePaths["deaths"], "Deaths", this.deaths);
    this.fileProcessor.writeToFile(this.filePaths["donation"], "Donation", donation);
  }

  exit = () => {
    process.exit();
  }

  processKey = (inputKey) =>
  {
    switch(inputKey)
    {
      case this.keybindings["increase"]:
        this.increase();
        break;
      case this.keybindings["decrease"]:
        this.decrease();
        break;
      case this.keybindings["toggle"]:
        this.toggle();
        break;
      case this.keybindings["dump"]:
        this.dumpDeaths();
        break;
      case this.keybindings["exit"]:
        this.exit();
        break;
    }
  }
}

module.exports = DeathCounter;