const lorca = require('../lorca.js');

describe("get prepositions", function () {
  it("should return array of prepositions", function () {
    var doc = lorca('<p>En verano hace calor. En invierno hace frío</p>');
    var output = doc.prepositions().get();
    expect(output).toEqual([ 'en', 'en' ]);
  });
}); 

describe("get prepositions in sentences", function () {
  it("should return array of prepositions in sentences", function () {
    var doc = lorca('<p>En verano hace calor. En invierno hace frío</p>');
    var output = doc.sentences().prepositions().get();
    expect(output).toEqual([ [ 'en' ], [ 'en' ] ]);
  });
}); 

describe("get prepositions in words", function () {
  it("should return array of prepositions divided by words", function () {
    var doc = lorca('<p>En verano hace calor. En invierno hace frío</p>');
    var output = doc.words().prepositions().get();
    expect(output).toEqual([ [ 'en' ], [], [], [], [ 'en' ], [], [], [] ]);
  });
}); 

describe("get prepositions percentage", function () {
  it("should return preposition percentage", function () {
    var doc = lorca('<p>En verano hace calor. En invierno hace frío</p>');
    var output = doc.prepositions().percentage().get();
    expect(output).toEqual(0.25);
  });
}); 

describe("get prepositions percentage by sentence", function () {
  it("should return array of prepositions percentage gathered by sentence", function () {
    var doc = lorca('<p>En verano hace calor. En invierno hace frío</p>');
    var output = doc.sentences().prepositions().percentage().get();
    expect(output).toEqual([ 0.25, 0.25 ]);
  });
}); 
