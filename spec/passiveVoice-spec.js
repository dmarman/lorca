const lorca = require('../lorca.js');

describe("check passive voice", function () {
  it("should return wether a sentence is passive", function () {
    var doc = lorca('El niño ha sido castigado.');
    var output = doc.isPassive().get();
    expect(output).toEqual(true);
  });
}); 

describe("check passive voice by sentence", function () {
  it("should return wether a sentence is passive gathered by sentence", function () {
    var doc = lorca('El niño ha sido castigado. La madre lo ha castigado.');
    var output = doc.sentences().isPassive().get();
    expect(output).toEqual([ true, false ]);
  });
}); 
