const lorca = require('../lorca.js');

describe("sentimenter", function () {
  it("selects afinn", function () {
    var doc = lorca('El plátano está malo.');
    var output = doc.sentiment('afinn');
    expect(output).toEqual(-0.75);
  });

  it("selects senticon", function () {
    var doc = lorca('El plátano está malo.');
    var output = doc.sentiment('senticon');
    expect(output).toEqual(-0.09375);
  });

  it("selects afinn as default", function () {
    var doc = lorca('El plátano está malo.');
    var output = doc.sentiment();
    expect(output).toEqual(-0.75);
  });
});

describe("sentimenter using afinn", function () {
  it("returns negative sentiment", function () {
    var doc = lorca('El plátano está malo.');
    var output = doc.sentiment();
    expect(output).toEqual(-0.75);
  });

  it("returns positive sentiment", function () {
    var doc = lorca('Me gusta la Navidad.');
    var output = doc.sentiment();
    expect(output).toEqual(0.5);
  });

  it("returns negative sentiment when negation", function () {
    var doc = lorca('No me gusta la Navidad.');
    var output = doc.sentiment();
    expect(output).toEqual(-0.6);
  });

  it("returns sentiment by sentences", function () {
    var doc = lorca('El plátano está muy bueno. Me gusta la navidad. Esto no ha sido magnífico.');
    var output = doc.sentences().sentiment();
    expect(output).toEqual([ 0.6, 0.5, -1.2 ]);
  });

  it("returns sentiment by word", function () {
    var doc = lorca('El plátano está muy bueno. Me gusta la navidad. Esto no ha sido magnífico.');
    var output = doc.words().sentiment();
    expect(output).toEqual([ 0, 0, 0, 0, 3, 0, 2, 0, 0, 0, -1, 0, 0, 5 ]);
  });

  it("returns sentiment by word gathered by sentence", function () {
    var doc = lorca('El plátano está muy bueno. Me gusta la navidad. Esto no ha sido magnífico.');
    var output = doc.sentences().words().sentiment();
    expect(output).toEqual([ [ 0, 0, 0, 0, 3 ], [ 0, 2, 0, 0 ], [ 0, -1, 0, 0, 5 ] ]);
  });

  it("return sentiment from more of one sentence", function () {
    var doc = lorca('El plátano está muy bueno. Me gusta la navidad. Esto no ha sido magnífico.');
    var output = doc.sentiment();
    expect(output).toEqual(-0.03333333333333329);
  });
});

describe("Sentimenter using senticon", function () {
  it("returns negative sentiment", function () {
    var doc = lorca('El plátano está malo.');
    var output = doc.sentiment('senticon');
    expect(output).toEqual(-0.09375);
  });

  it("returns positive sentiment", function () {
    var doc = lorca('Me gusta la Navidad.');
    var output = doc.sentiment('senticon');
    expect(output).toEqual(0.0665);
  });

  it("returns negative sentiment when negation", function () {
    var doc = lorca('No me gusta la Navidad.');
    var output = doc.sentiment('senticon');
    expect(output).toEqual(-0.1282 );
  });

  it("returns sentiment by sentences", function () {
    var doc = lorca('El plátano está muy bueno. Me gusta la navidad. Esto no ha sido magnífico.');
    var output = doc.sentences().sentiment('senticon');
    expect(output).toEqual([ 0.1, 0.0665, -0.2358 ]);
  });

  it("returns sentiment by word", function () {
    var doc = lorca('El plátano está muy bueno. Me gusta la navidad. Esto no ha sido magnífico.');
    var output = doc.words().sentiment('senticon');
    expect(output).toEqual([ 0, 0, 0, 0, 0.5, 0, 0.266, 0, 0, 0, -0.375, 0, 0, 0.804 ]);
  });

  it("returns sentiment by word gathered by sentence", function () {
    var doc = lorca('El plátano está muy bueno. Me gusta la navidad. Esto no ha sido magnífico.');
    var output = doc.sentences().words().sentiment('senticon');
    expect(output).toEqual([ [ 0, 0, 0, 0, 0.5 ], [ 0, 0.266, 0, 0 ], [ 0, -0.375, 0, 0, 0.804 ] ]);
  });

  it("return sentiment from more of one sentence", function () {
    var doc = lorca('El plátano está muy bueno. Me gusta la navidad. Esto no ha sido magnífico.');
    var output = doc.sentiment('senticon');
    expect(output).toEqual(-0.0231);
  });
}); 
