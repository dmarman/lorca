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
        var output = doc.words().stem().get();
        expect(output).toEqual([ 'los', 'niñ', 'jueg', 'con', 'las', 'pelot' ]);
    });

    it('should perform stem on array of array', function() {
        var doc = lorca('Los niños juegan con las pelotas. Los profesores hablan del tiempo.');
        var output = doc.sentences().words().stem().get();
        expect(output).toEqual([ [ 'los', 'niñ', 'jueg', 'con', 'las', 'pelot' ],
                                    [ 'los', 'profesor', 'habl', 'del', 'tiemp' ] ]);
    });

    it('should perform stem on array and go to concordance sorted', function() {
        var doc = lorca('Los niños juegan con las niñas. El niño sa va a casa.');
        var output = doc.words().stem().concordance().sort().get();
        expect(output).toEqual({ niñ: 3, los: 1, jueg: 1, con: 1, las: 1, el: 1, sa: 1, va: 1, a: 1, cas: 1 });
    });

    it('should perform stem on array and go to relative concordance sorted', function() {
        var doc = lorca('Los niños juegan con las niñas. El niño sa va a casa.');
        var output = doc.words().stem().concordance('relative').sort().get();
        expect(output).toEqual({ niñ: 0.25, los: 0.08333333333333333, jueg: 0.08333333333333333, con: 0.08333333333333333,
         las: 0.08333333333333333, el: 0.08333333333333333, sa: 0.08333333333333333, va: 0.08333333333333333, a: 0.08333333333333333, 
         cas: 0.08333333333333333 });
    });

    it('should perform stem on array and go to relative concordance sorted limited to two', function() {
        var doc = lorca('Los niños juegan con las niñas. El niño sa va a casa.');
        var output = doc.words().stem().concordance('relative').sort(2).get();
        expect(output).toEqual({ niñ: 0.25, los: 0.08333333333333333 });
    });
    
    it('should perform stem on array and go to relative concordance sorted limited to two', function() {
        var doc = lorca('Los niños juegan con las niñas. El niño sa va a casa.');
        var output = doc.words().stem().concordance().sort(2).get();
        expect(output).toEqual({ niñ: 3, los: 1 });
    });
});