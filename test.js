const lorca = require('./lorca.js');

var doc = lorca('Los niños juegan muy bien con las niñas. El niño sa va a casa.');

var output = doc.words().sentiment();
console.log(output);