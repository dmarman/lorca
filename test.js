const lorca = require('./lorca.js');
const sentimenter = require('./src/sentimenter.js');

var doc = lorca('El plátano está malo.');

console.log(doc.sentiment('senticon'));

console.log(doc.load().sentiment());