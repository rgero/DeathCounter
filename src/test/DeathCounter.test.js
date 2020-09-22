const DeathCounter = require('../DeathCounter.js');
const path = require('path');

let deathCounter, defaultKeyBindings, desiredFolder, filePaths, donationMultiplier;

beforeEach(()=>{
  deathCounter = new DeathCounter();
  defaultKeyBindings = {
      "increase": "105",
      "decrease": "103",
      "toggle" : "101",
      "dump" : "104",
      "exit" : "109"
  }
  desiredFolder = "./Stream_Files";
  filePaths = {
      "deaths" : path.join(desiredFolder, "Deaths.txt"),
      "donation" : path.join(desiredFolder, "Donation.txt"),
      "deathDump" : path.join(desiredFolder, "DeathDump.txt")
  };
  donationMultiplier = 0.22;

  currentlyCounting = false;
  deaths = 0;
  lastDeathDump = 0;
})

test("Testing Regular Constructor", ()=> {
  let testKeybindings = deathCounter.keybindings;
  let testFolder = deathCounter.desiredFolder;
  let testFilePaths = deathCounter.filePaths;
  let testDonation = deathCounter.donationMultiplier;
  let testToggle = deathCounter.currentlyCounting;
  let testDeaths = deathCounter.deaths;
  let testDump = deathCounter.lastDeathDump;

  expect(testFilePaths).toMatchObject(filePaths);
  expect(testFolder).toBe(desiredFolder);
  expect(testKeybindings).toMatchObject(defaultKeyBindings);
  expect(testDonation).toBe(donationMultiplier);
  expect(testToggle).toBe(currentlyCounting);
  expect(testDeaths).toBe(deaths);
  expect(testDump).toBe(lastDeathDump);
})