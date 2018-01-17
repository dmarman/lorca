const lorca = require('./lorca.js');

var doc = lorca('El plátano está muy bueno. Me gusta la navidad. Esto no ha sido magnífico.');

console.log(doc.sentences().words().get());
