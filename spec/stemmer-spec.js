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

    it('should perform stem on array', function() {
        var doc = lorca('Los niños juegan con las pelotas');
        var output = doc.words().stem();
        expect(output).toEqual([ 'los', 'niñ', 'jueg', 'con', 'las', 'pelot' ]);
    });

    it('should perform stem on array of array', function() {
        var doc = lorca('Los niños juegan con las pelotas. Los profesores hablan del tiempo.');
        var output = doc.sentences().words().stem();
        expect(output).toEqual([ [ 'los', 'niñ', 'jueg', 'con', 'las', 'pelot' ],
                                    [ 'los', 'profesor', 'habl', 'del', 'tiemp' ] ]);
    });
});