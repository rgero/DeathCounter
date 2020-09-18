const { exception } = require('console');
const fs = require('fs');
const {pad} = require('./Pad.js');

let re = new RegExp('\\d.*')
function fileCheck(filePath, regExp = re)
{
  var retVal = 0;
  try {
    data = fs.readFileSync(filePath);
    console.log("Previous file found!")
    let fileData = regExp.exec(data);
    retVal = parseInt(fileData[0])
    if (isNaN(retVal)) { retVal = 0 }
  }
  catch
  {
    console.log("Previous file corrupted, recreating. Please update accordingly");
    createNewFile(filePath);
  }
  return retVal;
}

function createNewFile(filePath)
{
  let deathDefaultMessage = "Deaths: " + pad(0, ' ');
  fs.writeFileSync(filePath, deathDefaultMessage);
}

function writeToFile(filePath, prefix, count, offset=3)
{
    var dataString = prefix + ": " + pad(count.toString(), ' ', offset); 
    fs.writeFileSync(filePath, dataString)
}

exports.PastDataLoader = fileCheck;
exports.WriteToFile = writeToFile;