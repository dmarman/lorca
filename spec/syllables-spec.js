const lorca = require('../lorca.js');
const syllabler = require('../src/syllabler.js');
const fs = require('fs');

var doc = lorca('<p>En verano hace calor. En invierno hace frío</p>');

describe("lorca", function () {
  it("should return array of syllables", function () {
    var doc = lorca('<p>En verano hace calor. En invierno hace frío</p>');
    var output = doc.syllables().get();
    expect(output).toEqual([ 'en', 've', 'ra', 'no', 'ha', 'ce', 'ca', 'lor.', 'en', 'in', 'vier', 'no', 'ha', 'ce','frí', 'o.' ]);
  });

  it("should return array of sentences with array of syllables", function () {
    var doc = lorca('<p>En verano hace calor. En invierno hace frío</p>');
    var output = doc.sentences().syllables().get();
    expect(output).toEqual([ [ 'en', 've', 'ra', 'no', 'ha', 'ce', 'ca', 'lor.' ], [ 'en', 'in', 'vier', 'no', 'ha', 'ce', 'frí', 'o.' ] ]);
  });

  it("should return array of sentences with array of words with syllables", function () {
    var doc = lorca('<p>En verano hace calor. En invierno hace frío</p>');
    var output = doc.sentences().words().syllables().get();
    expect(output).toEqual([ [ [ 'en' ], [ 've', 'ra', 'no' ], [ 'ha', 'ce' ], [ 'ca', 'lor' ] ], [ [ 'en' ], [ 'in', 'vier', 'no' ], [ 'ha', 'ce' ], [ 'frí', 'o' ] ] ]);
  });

  it("should return array of sentences with array of words", function () {
    var doc = lorca('<p>En verano hace calor. En invierno hace frío</p>');
    var output = doc.words().syllables().get();
    expect(output).toEqual([ [ 'en' ], [ 've', 'ra', 'no' ], [ 'ha', 'ce' ], [ 'ca', 'lor' ], [ 'en' ], [ 'in', 'vier', 'no' ], [ 'ha', 'ce' ], [ 'frí', 'o' ] ]);
  });
}); 

describe("syllabler", function () {
    it("should test lots of words", function () {
        var testCases = JSON.parse(fs.readFileSync('./spec/testData/syllable_test_corpus.json'));
        for(var token in testCases){
            expect(testCases[token].syllables ).toEqual(syllabler(token));
        }
    });
}); 
