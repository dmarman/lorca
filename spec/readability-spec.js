const lorca = require('../lorca.js');

describe("get readability ifsz", function () {
  it("should return 78", function () {
    var doc = lorca('En verano hace calor. En invierno hace frío');
    var output = doc.ifsz().get();
    expect(output).toEqual(78);
  });
}); 

describe("get readability ifsz grade", function () {
  it("should return Bastante Fácil", function () {
    var doc = lorca('En verano hace calor. En invierno hace frío');
    var output = doc.ifsz().grade().get();
    expect(output).toEqual('Bastante fácil');
  });
}); 
