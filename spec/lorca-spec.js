const lorca = require('../lorca.js');

var doc = lorca('<p>En verano hace calor. En invierno hace frío</p>');

describe("get text", function () {
  it("should return cleaned text", function () {
    var output = doc.get();
    expect(output).toEqual('En verano hace calor. En invierno hace frío.');
  });
}); 

describe("get text after load", function () {
  it("should return cleaned text after reloading", function () {   
    var output = doc.load().get();
    expect(output).toEqual('En verano hace calor. En invierno hace frío.');
  });
}); 

describe("get sentences", function () {
  it("should return array of sentences", function () {
    var doc = lorca('<p>En verano hace calor. En invierno hace frío</p>');
    var output = doc.sentences().get();
    expect(output).toEqual([ 'En verano hace calor.', ' En invierno hace frío.' ]);
  });
}); 

describe("get words", function () {
  it("should return array of words", function () {
    var doc = lorca('<p>En verano hace calor. En invierno hace frío</p>');
    var output = doc.words().get();
    expect(output).toEqual([ 'en', 'verano', 'hace', 'calor', 'en', 'invierno', 'hace', 'frío' ]);
  });
}); 

describe("get syllables", function () {
  it("should return array of syllables", function () {
    var doc = lorca('<p>En verano hace calor. En invierno hace frío</p>');
    var output = doc.syllables().get();
    expect(output).toEqual([ 'en', 've', 'ra', 'no', 'ha', 'ce', 'ca', 'lor.', 'en', 'in', 'vier', 'no', 'ha', 'ce','frí', 'o.' ]);
  });
}); 

describe("get unique words", function () {
  it("should return array of unique words", function () {
    var doc = lorca('<p>En verano hace calor. En invierno hace frío</p>');
    var output = doc.uniqueWords().get();
    expect(output).toEqual([ 'en', 'verano', 'hace', 'calor', 'invierno', 'frío' ]);
  });
}); 

describe("get once words", function () {
  it("should return array of once words", function () {
    var doc = lorca('<p>En verano hace calor. En invierno hace frío</p>');
    var output = doc.onceWords().get();
    expect(output).toEqual([ 'verano', 'calor', 'invierno', 'frío' ]);
  });
}); 