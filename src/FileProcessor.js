const { exception } = require('console');
const fs = require('fs');
const {pad} = require('./Pad.js');

let re = new RegExp('\\d.*')
function fileCheck(filePath, regExp = re)
{
  var retVal = 0;
  fs.readFile(filePath, 'utf8', function (err,data) {
      if (err) {
        createNewFile(filePath);
      } 
      else 
      {
        console.log("Previous file found!")
        let fileData = regExp.exec(data);
        try {
          retVal = parseInt(fileData[0])
        } 
        catch
        {
          console.log("Previous file corrupted, recreating. Please update accordingly");
          createNewFile(filePath);
        }
        if (isNaN(retVal)) { retVal = 0 }
      }
    }
  );
  return retVal;
}

function createNewFile(filePath)
{
  let deathDefaultMessage = "Deaths: " + pad(0, ' ');
  fs.writeFile(filePath, deathDefaultMessage, (err)=> {
      if (err) throw err;
  })
}

function writeToFile(filePath, prefix, count, offset=3)
{
    var dataString = prefix + ": " + pad(count.toString(), ' ', offset); 
    fs.writeFile(filePath, dataString, (err)=> {
      if (err) throw err;
    })
}

exports.PastDataLoader = fileCheck;
exports.WriteToFile = writeToFile;