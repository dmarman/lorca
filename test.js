const lorca = require('./lorca.js');

const fs = require('fs');

//var list = JSON.parse(fs.readFileSync('./dictionaries/frequencyListRAE50000.json', 'utf8'));

/*
var doc = lorca('');
var keys = Object.keys(list);
var stem = [];
for(var i = 0; i < keys.length; i++){
    stem.push(doc.stem(keys[i]));
}
doc.out = stem;
*/
//console.log(doc.concordance().sort(200).get());

var doc = lorca('En verano hace calor. En invierno hace frío');


console.log(doc.sentences().words().corpusFrequency().get());

//var output = doc.words().sentiment();
//console.log(output);
