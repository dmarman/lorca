const lorca = require('./lorca.js');

var doc = lorca('Yo le canto a él. Él se rie.');

var output = doc.words().pronouns().get();


console.log(output);