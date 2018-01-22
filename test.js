const lorca = require('./lorca.js');

var doc = lorca('Los niños juegan con las niñas. El niño sa va a casa.');

var output = doc.words().stem().concordance('relative').sort().get();
console.log(output);