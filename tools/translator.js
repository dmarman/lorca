const https = require('https');
const fs = require("fs");

var contents = fs.readFileSync("../afinnen.json");
var words = JSON.parse(contents);

translate('edge');


function translate(word){
    https.get('https://glosbe.com/gapi/translate?from=eng&dest=es&format=json&phrase=' + word, (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
            data += chunk;
        });
        resp.on('end', () => {
            console.log(JSON.parse(data).tuc[0].phrase.text);
        });
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
}

