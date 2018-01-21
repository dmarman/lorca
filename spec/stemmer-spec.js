const lorca = require('../lorca.js');
const fs = require('fs');

var doc = lorca('');

describe('porter stemmer', function() {
    it('should perform stem of file', function() {
        fs.readFileSync('./spec/testData/stemm_test_corpus.txt').toString().replace(/\r/g, '\n').split('\n').forEach(
            function(line) {
                if (line) {
                    var fields = line.split(' ');
                    var stemmed = doc.stem(fields[0]);
                    expect(stemmed).toEqual(fields[1]);
                }
            }
        );
    });
});