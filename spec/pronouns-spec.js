const lorca = require('../lorca.js');

describe("get pronouns", function () {
  it("should return array of pronouns", function () {
    var doc = lorca('Yo le canto a él. Él se rie.');
    var output = doc.pronouns().get();
    expect(output).toEqual([ 'yo', 'él', 'él' ]);
  });
}); 

describe("get pronouns of sentences", function () {
  it("should return array of pronouns grouped by sentences", function () {
    var doc = lorca('Yo le canto a él. Él se rie.');
    var output = doc.sentences().pronouns().get();
    expect(output).toEqual([ [ 'yo', 'él' ], [ 'él' ] ]);
  });
}); 

describe("get pronouns of words", function () {
  it("should return array of pronouns grouped by words", function () {
    var doc = lorca('Yo le canto a él . Él se rie.');
    var output = doc.words().pronouns().get();
    expect(output).toEqual([ [ 'yo' ], [], [], [], [ 'él' ], [ 'él' ], [], [] ]);
  });
}); 

describe("get pronouns percentage", function () {
  it("should return pronoun percentage", function () {
    var doc = lorca('Yo le canto a él . Él se rie.');
    var output = doc.pronouns().percentage().get();
    expect(output).toEqual(0.375);
  });
}); 

describe("get pronouns percentage by sentece", function () {
  it("should return array with pronoun percentage gathered by sentence", function () {
    var doc = lorca('Yo le canto a él . Él se rie.');
    var output = doc.sentences().pronouns().percentage().get();
    expect(output).toEqual([ 0.4, 0.3333333333333333 ]);
  });
}); 


