const lorca = require('../lorca.js');

describe("Corpus frequency", function () {
  it("should return array of frequencies glued by sentences", function () {
    var doc = lorca('En verano hace calor. En invierno hace frío');
    var output = doc.sentences().words().corpusFrequency().get();  
    expect(output).toEqual([ [ 0.02775516, 0.00008453, 0.00075057, 0.00007254 ],
                            [ 0.02775516, 0.00004106, 0.00075057, 0.00007199 ] ]);
  });

  it("should return array of frequencies", function () {
    var doc = lorca('En verano hace calor. En invierno hace frío');
    var output = doc.words().corpusFrequency().get();  
    expect(output).toEqual([ 0.02775516, 0.00008453, 0.00075057, 0.00007254,
                             0.02775516, 0.00004106, 0.00075057, 0.00007199 ]);
  });

  it("should return array of frequencies", function () {
    var doc = lorca('En verano hace calor. En invierno hace frío');
    var output = doc.corpusFrequency().get();  
    expect(output).toEqual([ 0.02775516, 0.00008453, 0.00075057, 0.00007254,
                             0.02775516, 0.00004106, 0.00075057, 0.00007199 ]);
  });

  it("should return 0", function () {
    var doc = lorca('sdfgfdg');
    var output = doc.corpusFrequency().get();  
    expect(output).toEqual([ 0 ]);
  });

  it("should return array of 0", function () {
    var doc = lorca('sdfgfdg sdfi');
    var output = doc.corpusFrequency().get();  
    expect(output).toEqual([ 0, 0 ]);
  });

  it("should return array of frequencies", function () {
    var doc = lorca('sdfgfdg sdfi');
    var output = doc.words().corpusFrequency().get();  
    expect(output).toEqual([ 0, 0 ]);
  });

  it("should return array of frequencies", function () {
    var doc = lorca('sdfgfdg sdfi. sdf.');
    var output = doc.sentences().words().corpusFrequency().get();  
    expect(output).toEqual([ [ 0, 0 ], [ 0 ] ]);
  });

}); 