const lorca = require('../lorca.js');

describe("get negative sentiment", function () {
  it("should return -0.75", function () {
    var doc = lorca('El plátano está malo.');
    var output = doc.sentiment();
    expect(output).toEqual(-0.75);
  });
}); 

describe("get positive sentiment", function () {
  it("should return 0.5", function () {
    var doc = lorca('Me gusta la Navidad.');
    var output = doc.sentiment();
    expect(output).toEqual(0.5);
  });
}); 

describe("get negative sentiment when negation", function () {
  it("should return 0.5", function () {
    var doc = lorca('No me gusta la Navidad.');
    var output = doc.sentiment();
    expect(output).toEqual(-0.6);
  });
}); 

describe("get sentiment by sentences", function () {
  it("should return array of sentiments", function () {
    var doc = lorca('El plátano está muy bueno. Me gusta la navidad. Esto no ha sido magnífico.');
    var output = doc.sentences().sentiment();
    expect(output).toEqual([ 0.6, 0.5, -1.2 ]);
  });
}); 

describe("get sentiment by word", function () {
  it("should return array of sentiments", function () {
    var doc = lorca('El plátano está muy bueno. Me gusta la navidad. Esto no ha sido magnífico.');
    var output = doc.words().sentiment();
    expect(output).toEqual([ 0, 0, 0, 0, 3, 0, 2, 0, 0, 0, -1, 0, 0, 5 ]);
  });
}); 

describe("get sentiment by word gathered by sentence", function () {
  it("should return array of sentences with sentiments", function () {
    var doc = lorca('El plátano está muy bueno. Me gusta la navidad. Esto no ha sido magnífico.');
    var output = doc.sentences().words().sentiment();
    expect(output).toEqual([ [ 0, 0, 0, 0, 3 ], [ 0, 2, 0, 0 ], [ 0, -1, 0, 0, 5 ] ]);
  });
}); 

describe("get sentiment from more of one sentence", function () {
  it("should return value", function () {
    var doc = lorca('El plátano está muy bueno. Me gusta la navidad. Esto no ha sido magnífico.');
    var output = doc.sentiment();
    expect(output).toEqual(-0.03333333333333329);
  });
}); 
