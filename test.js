const lorca = require('./lorca.js');

var doc = lorca('Los niños juegan con las pelotas. Los profesores hablan del tiempo.');

var output = doc.sentences().words().stem();
console.log(output);