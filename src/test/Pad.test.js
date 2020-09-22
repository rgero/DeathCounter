const {pad} = require('../Pad.js')

test("Testing the Pad function with single digit", ()=>{
  var number = 1
  var testChar = "0"
  var baseline = "001"
  var test = pad(number, testChar);
  expect(test).toMatch(baseline);
})

test("Testing the Pad function with tens", ()=>{
  var number = 10
  var testChar = "0"
  var baseline = "010"
  var test = pad(number, testChar);
  expect(test).toMatch(baseline);
})

test("Testing the Pad function with hundreds", ()=>{
  var number = 100
  var testChar = "0"
  var baseline = "100"
  var test = pad(number, testChar);
  expect(test).toMatch(baseline);
})

test("Testing the Pad function with over padding", ()=>{
  var number = 1000
  var testChar = "0"
  var baseline = "1000"
  var test = pad(number, testChar);
  expect(test).toMatch(baseline);
})

test("Testing the Pad function with optional", ()=>{
  var number = 1
  var testChar = "0"
  var baseline = "000001"
  var test = pad(number, testChar, 6);
  expect(test).toMatch(baseline);
})