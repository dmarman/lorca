const lorca = require('../lorca.js');

describe("get concordance", function () {
  it("should return object with words", function () {
    var doc = lorca('En verano hace calor. En invierno hace frío');
    var output = doc.concordance().get();
    expect(output).toEqual({ en: 2, verano: 1, hace: 2, calor: 1, invierno: 1, frío: 1 });
  });
}); 

describe("get sorted concordance", function () {
  it("should return object with words sorted by freq", function () {
    var doc = lorca('En verano hace calor. En invierno hace frío');
    var output = doc.concordance().sort().get();
    expect(output).toEqual({ en: 2, hace: 2, verano: 1, calor: 1, invierno: 1, frío: 1 });
  });
}); 

describe("get sorted relative concordance", function () {
  it("should return object with words sorted by relative freq", function () {
    var doc = lorca('En verano hace calor. En invierno hace frío');
    var output = doc.concordance('relative').sort().get();
    expect(output).toEqual({ en: 0.25, hace: 0.25, verano: 0.125, calor: 0.125, invierno: 0.125, frío: 0.125 });
  });
}); 

describe("get sorted concordance with limit", function () {
  it("should return object with words limited by value", function () {
    var doc = lorca('En verano hace calor. En invierno hace frío');
    var output = doc.concordance().sort(3).get();
    expect(output).toEqual({ en: 2, hace: 2, verano: 1 });
  });
}); 
