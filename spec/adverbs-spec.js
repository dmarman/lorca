const lorca = require('../lorca.js');

describe("get adverbs", function () {
  it("should return array of adverbs", function () {
    var doc = lorca('En verano hace realmente calor. En invierno hace frío');
    var output = doc.adverbs().get();
    expect(output).toEqual([ 'realmente' ]);
  });
}); 

describe("get adverbs by sentence", function () {
  it("should return array of adverbs gathered by sentece", function () {
    var doc = lorca('En verano hace realmente calor. En invierno hace frío');
    var output = doc.sentences().adverbs().get();
    expect(output).toEqual([ [ 'realmente' ], [] ]);
  });
}); 

describe("get adverbs", function () {
  it("should return array of adverbs", function () {
    var doc = lorca('En verano hace realmente calor. En invierno hace frío');
    var output = doc.adverbs().percentage().get();
    expect(output).toEqual(0.1111111111111111);
  });
}); 

describe("get adverbs", function () {
  it("should return array of adverbs", function () {
    var doc = lorca('En verano hace realmente calor. En invierno hace frío');
    var output = doc.sentences().adverbs().percentage().get();
    expect(output).toEqual([ 0.2, 0 ]);
  });
}); 
