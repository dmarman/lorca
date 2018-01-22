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

var doc = lorca('En verano hace calor. En invierno hace frío. El verano me gusta');


console.log(doc.tfidf().sort().get());

//var output = doc.words().sentiment();
//console.log(output);
