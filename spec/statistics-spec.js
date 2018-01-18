const lorca = require('../lorca.js');

describe("get number of words", function () {
  it("should return 8", function () {
    var doc = lorca('En verano hace calor. En invierno hace frío');
    var output = doc.words().get().length;
    expect(output).toEqual(8);
  });
}); 

describe("get number of sentences", function () {
  it("should return 2", function () {
    var doc = lorca('En verano hace calor. En invierno hace frío');
    var output = doc.sentences().get().length;
    expect(output).toEqual(2);
  });
}); 

describe("get words per sentence", function () {
  it("should return 4", function () {
    var doc = lorca('En verano hace calor. En invierno hace frío');
    var output = doc.wordsPerSentence().get();
    expect(output).toEqual(4);
  });
}); 

describe("get syllables per word", function () {
  it("should return 2", function () {
    var doc = lorca('En verano hace calor. En invierno hace frío');
    var output = doc.syllablesPerWord().get();
    expect(output).toEqual(2);
  });
}); 

describe("get syllables per sentence", function () {
  it("should return 8", function () {
    var doc = lorca('En verano hace calor. En invierno hace frío');
    var output = doc.syllablesPerSentence().get();
    expect(output).toEqual(8);
  });
}); 
