const lorca = require('../lorca.js');

describe("get results of search", function () {
  it("should return verano", function () {
    var doc = lorca('En verano hace calor. En invierno hace frío');
    var output = doc.find("verano");
    expect(output).toEqual([ 'verano' ]);
  });
});

describe("get results of search by sentence", function () {
  it("should return array of results gathered by sentence", function () {
    var doc = lorca('En verano hace calor. En invierno hace frío');    
    var output = doc.sentences().find("verano");
    expect(output).toEqual([ [ 'verano' ], [] ]);
  });
});
