const readline = require('readline');
const fs = require('fs');
var afinn = JSON.parse(fs.readFileSync('../afinnen.json', 'utf8'));
var afinnOriginal = JSON.parse(fs.readFileSync('../afinnen.json', 'utf8'));
var afinnSpanish = JSON.parse(fs.readFileSync('./afinnShortSortedSpanish.json', 'utf8'));

const rl = readline.createInterface({
    input: fs.createReadStream('english.txt')
});

var english = {};
var i = 1;

rl.on('line', function (line) {
    english[line] = i;
    i++;
});

rl.on('close', () => {
    for(var token in afinn){
        if(english[token] != undefined){
            afinn[token] = english[token];
        } else {
            delete afinn[token]
        }
    }

    var sortable = [];
    for (var token in afinn) {
        sortable.push([token, afinn[token]]);
    }

    sortable.sort(function(a, b) {
        return a[1] - b[1];
    });

    var afinnSorted = {};
    var spanishKeys = Object.keys(afinnSpanish);
    for(var i = 0; i < sortable.length; i++){
        afinnSorted[sortable[i][0]] = spanishKeys[i];
    }

    var json = JSON.stringify(afinnSorted);
    fs.writeFile('afinnShortSortedTranslation.json', json, 'utf8');
})

