const fs = require('fs');
const {pad} = require('./Pad.js');

class FileProcessor
{
  re = new RegExp('\\d.*')
  
  loadDeathData = (filePath, regExp = this.re) => {
    let retVal = 0;
    try {
      let data = fs.readFileSync(filePath);
      console.log("Previous file found!")
      let fileData = regExp.exec(data);
      retVal = parseInt(fileData[0])
      if (isNaN(retVal)) { retVal = 0 }
    }
    catch (e)
    {
      console.log(e.message)
      console.log("Previous file corrupted, recreating. Please update accordingly");
      this.createNewDeathFile(filePath);
    }
    return retVal;
  }

  createNewDeathFile = (filePath) => {
    let deathDefaultMessage = "Deaths: " + pad(0, ' ');
    fs.writeFileSync(filePath, deathDefaultMessage);
  }

  writeToFile = (filePath, prefix, count, offset=3) => {
      let dataString = prefix + ": " + pad(count.toString(), ' ', offset); 
      fs.writeFileSync(filePath, dataString)
  }

  appendToFile = (deathDumpPath, dumpString) => {
    fs.appendFileSync(deathDumpPath, dumpString);
  }

  checkDirectory = (desiredFolder) => {
    if (desiredFolder && !fs.existsSync(desiredFolder))
    {
      fs.mkdirSync(desiredFolder);
    }
  }

  loadSettingsFile = (filePath) => {
    try {
      console.log(process.cwd());
      let data = fs.readFileSync(filePath);
      let settings = JSON.parse(data);
      return settings;
    } catch {
      console.log("Error parsing settings - Using Defaults");
      return {};
    }
  }
}

module.exports = FileProcessor;