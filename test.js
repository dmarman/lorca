const lorca = require('./lorca.js');
const readline = require('readline');
const fs = require('fs');

var doc = lorca('Yo le canto a él. Él se rie.');

const rl = readline.createInterface({
    input: fs.createReadStream('./tools/php stemmer example/stemm_test_corpus.txt', 'utf-8')
});

var words = [];
var i = 0;

rl.on('line', function (line) {
    words.push(line.split(/ /));
    i++;
});

var fails = 0;

rl.on('close', function(){
    // for(var i = 0; i < words.length; i++){
    //     //console.log(words[i][0], words[i][1]);
    //     if(doc.stemmer(words[i][0]) != words[i][1]){
    //         console.log('[' + words[i][0] + ']: should: ', words[i][1], '    is: ' + doc.stemmer(words[i][0]));
    //         fails++;
    //     }
    // }
    // console.log(fails, i);

});



var output = doc.stemmer('méxicoquerétaro');
console.log(output);