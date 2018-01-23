'use strict';

const fs = require('fs');
const stemmer = require('./src/stemmer.js');
const syllabler = require('./src/syllabler.js');
const sentimenter = require('./src/sentimenter.js');

var lorca = function(input)
{
    var wrapper = new Lorca();

    return wrapper.normalize(input);
}

class Lorca
{
    constructor()
    {
        this.input = '';
        this.text = '';
        this.out = '';
    }

    in()
    {
        return this.input;
    }

    get()
    {
        return this.out;
    }

    normalize(input)
    {
        if(input){
            this.input = input;
        } else {
            this.input = 'Texto de ejemplo. Añade tu texto en el método lorca(string)';
        }

        var fullStopTags = ['li', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'dd'];

        fullStopTags.forEach(function (tag) {
            input = input.replace("</" + tag + ">", ".");
        });

        this.out = input
            .replace(/<[^>]+>/g, "")				    // Strip tags
            .replace(/[,:;()\/&+]|\-\-/g, " ")          // Replace commas, hyphens etc (count them as spaces)
            .replace(/[\.!?]/g, ".")					// Unify terminators
            .replace(/^\s+/, "")						// Strip leading whitespace
            .replace(/[\.]?(\w+)[\.]?(\w+)@(\w+)[\.](\w+)[\.]?/g, "$1$2@$3$4")	// strip periods in email addresses (so they remain counted as one word)
            .replace(/[ ]*(\n|\r\n|\r)[ ]*/g, ".")	    // Replace new lines with periods
            .replace(/([\.])[\.]+/g, ".")			    // Check for duplicated terminators
            .replace(/[ ]*([\.])/g, ". ")				// Pad sentence terminators
            .replace(/\s+/g, " ")						// Remove multiple spaces
            .replace(/\s+$/, "")					    // Strip trailing whitespace
            .replace(/ nbsp/, "");

        if (this.out.slice(-1) != '.') {
            this.out += "."; // Add final terminator, just in case it's missing.
        }

        this.text = this.out;
     
        return this;
    }

    load()
    {
        this.out = this.text;

        return this;
    }

    sentences()
    {
        this.out = this.trimSentences(this.text);

        return this;
    }

    trimSentences(string)
    {
        return string.trim().match( /[^\.!\?]+[\.!\?]+/g );
    }

    trimWords(string)
    {
        return string.replace(/[#!¡¿?\-@\."”“’‘»«*'—%\[\]\|]/g, '').replace(/=/g, ' ').replace(/[0-9]+/g, '').trim().toLowerCase().split(/\s+/);
    }

    words()
    {
        if(this.out instanceof Array && !(this.out[0] instanceof Array)){
            for(var i = 0; i < this.out.length; i++){
                this.out[i] = this.trimWords(this.out[i]);
            }
        } else {
            this.out = this.trimWords(this.text);
        }
       
       return this;
    }

    uniqueWords()
    {
        var concordance = this.concordance().get();

        this.out = [];

        for(var token in concordance){
            this.out.push(token);
        }

        return this;
    }

    onceWords(){
        var concordance = this.concordance().get();

        this.out = [];

        for(var token in concordance){
            if(concordance[token] === 1){
                this.out.push(token);
            }
        }

        return this;
    }

    percentage()
    {
        var totalWords = this.trimWords(this.text).length;
        var outputWords = this.out.length;
        var sentences = this.trimSentences(this.text);

        for(var i = 0; i < this.out.length; i++){
            if(this.out[i] instanceof Array){
               this.out[i] = this.out[i].length/this.trimWords(sentences[i]).length;
            } else {
                this.out = outputWords/totalWords;
            }
        }

        return this;
    }

    syllables()
    {      
        if(this.out instanceof Array){
            for(var i = 0; i < this.out.length; i++){ 
                if(this.out[i] instanceof Array){
                    for(var j = 0; j < this.out[i].length; j++){
                        this.out[i][j] = this.trimSyllables(this.out[i][j]);
                    }
                } else {
                    this.out[i] = this.trimSyllables(this.out[i]);                
                }
            }
        } else {
            this.out = this.trimSyllables(this.out);
        }

       return this;
    }

    trimSyllables(word)
    {
        return syllabler(word);
    } 

    concordance(mode)
    {
        var tokens = this.words().get();
        var concordance = {};

        for(var i = 0; i < tokens.length; i++){
            if(concordance.hasOwnProperty(tokens[i])){
                concordance[tokens[i]] += 1; 
            } else {
                concordance[tokens[i]] = 1;
            }
        }

        if(mode == 'relative'){
            for(var token in concordance){
                concordance[token] = concordance[token]/Object.keys(tokens).length;
            }
        }
        
        this.out = concordance;

        return this;
    }

    sort(listMaxLength)
    {
        var sorted = {};
        var keys = Object.keys(this.out);
        var arr = this.out;
       
        keys.sort(function(a, b) {
            return arr[b] - arr[a];
        });

        if(listMaxLength == undefined || listMaxLength > keys.length){
            listMaxLength = keys.length;
        }

        for(var i = 0; i < listMaxLength; i++){
            sorted[keys[i]] = this.out[keys[i]];
        }
        
        this.out = sorted;

        return this;
    }

    wordsPerSentence()
    {
        var sentences = this.trimSentences(this.text).length;
        var words = this.trimWords(this.text).length;
        
        this.out = words/sentences;
        
        return this;
    }

    syllablesPerWord()
    {
        var syllables = this.trimSyllables(this.text).length;
        var words = this.trimWords(this.text).length;

        this.out = syllables/words;

        return this;
    }

    syllablesPerSentence()
    {
        this.out = this.wordsPerSentence().get()*this.syllablesPerWord().get();

        return this;
    }

    prepositions()
    {
        var prepositionRegex = /( |\b)(a|ante|bajo|cabe|con|contra|de|desde|en|entre|hacia|hasta|para|por|según|sin|so|sobre|tras)( |\b)/gi;

        // TODO add locuciones prepositivas
        var prepositionLocRegex = /( |\b)(acerca de|al lado de|alrededor de|antes de|a pesar de|cerca de|con arreglo a|con objeto de|debajo de|delante de|dentro de|después de|detrás de|encima de|en cuanto a|enfrente de|en virtud de|frente a|fuera de|gracias a|junto a|lejos de|por culpa de)( |\b)/gi;

        if(this.out instanceof Array) {
            for(var i = 0; i < this.out.length; i++){
                this.out[i] = this.out[i].match(prepositionRegex) || [];
            }
        } else {
            this.out = this.out.match(prepositionRegex) || [];
        }

        for(var n = 0; n < this.out.length; n++){
            if(this.out[n] instanceof Array){
                for(var k = 0; k < this.out[n].length; k++){
                    this.out[n][k] = this.out[n][k].toLowerCase().replace(/ /g, '');
                }
            } else {
                this.out[n] = this.out[n].toLowerCase().replace(/ /g, '');
            }
        }

        return this;
    }

    pronouns()
    {
        //TODO palabra con acento como míote ará match con mío, el acento no va bien
        //TODO add other pronouns
        var tonicRegex = /(yo|tú|vos|usted|él|ella|ello|nosotros|nosotras|ustedes|ellos|ellas|mí|conmigo|ti|contigo|consigo)/gi;
        var posesiveRegex = /( |\b)(mío|mía|míos|mías|tuyo|tuya|tuyos|tuyas|suyo|suya|suyos|suyas|nuestro|nuestra|nuestros|nuestras|vuestro|vuestra|vuestros|vuestras|suyo|suya|suyos|suyas)( |\b)/gi;
        var demostrativeRegex = /( |\b)(esta|este|esto|estos|estas|ese|esa|eso|esos|esas|aquel|aquella|aquello|aquellos|aquellas)( |\b)/gi;
        var indefiniteRegex = /( |\b)(uno|una|unos|unas|alguno|alguna|algo|algunos|algunas|ninguno|ninguna|nada|ningunos|ningunas|poco|poca|pocos|pocas|escaso|escasa|escasos|escasas|mucho|mucha|muchos|muchas|demasiado|demasiada|demasiados|demasiadas|todo|toda|todos|todas|varios|varias|otro|otra|otros|otras|mismo|misma|mismos|mismas|tan|tanto|tanta|tantos|tantas|alguien|nadie|cualquiera|quienquiera|demás|cualesquiera|quienesquiera)( |\b)/gi;

        if(this.out instanceof Array) {
            for(var i = 0; i < this.out.length; i++){
                this.out[i] = this.out[i].match(tonicRegex) || [];
            }
        } else {
            this.out = this.out.match(tonicRegex) || [];
        }

        for(var n = 0; n < this.out.length; n++){
            if(this.out[n] instanceof Array){
                for(var k = 0; k < this.out[n].length; k++){
                    this.out[n][k] = this.out[n][k].toLowerCase().replace(/ /g, '');
                }
            } else {
                this.out[n] = this.out[n].toLowerCase().replace(/ /g, '');
            }
        }

        return this;
    }

    adverbs()
    {
        var adverbRegex = /[a-zA-Z0-9áéíóúàèìòùñç]+mente\b/gi;

        if(this.out instanceof Array) {
            for(var i = 0; i < this.out.length; i++){
                this.out[i] = this.out[i].match(adverbRegex) || [];
            }
        } else {
            this.out = this.out.match(adverbRegex) || [];
        }

        for(var n = 0; n < this.out.length; n++){
            if(this.out[n] instanceof Array){
                for(var k = 0; k < this.out[n].length; k++){
                    this.out[n][k] = this.out[n][k].toLowerCase().replace(/ /g, '');
                }
            } else {
                this.out[n] = this.out[n].toLowerCase().replace(/ /g, '');
            }
        }

        return this;
    }

    isPassive()
    {
        var passiveRegex = /\b(es|son|está|están|eran|era|estaba|estaban|fue|fueron|estuvo|estuvieron|ha sido|han sido|ha estado|han estado|había sido|habían sido|había estado|habían estado|será|serán|estará|estarán|habrá sido|habrán sido|habrá estado|habrán estado|sería|serían|estaría|estarían|habría sido|habrían sido|habría estado|habrían estado) ([a-z]+ |)[a-z]+(ado|ados|ido|idos)\b/;

        if(this.out instanceof Array) {
            for(var i = 0; i < this.out.length; i++){
                this.out[i] = passiveRegex.test(this.out[i]) || false;
            }
        } else {
            this.out = passiveRegex.test(this.out) || false;
        }

        return this;
    }

    ifsz()
    {
        var syllablesPerWord = this.syllablesPerWord().get();
        var wordsPerSentence = this.wordsPerSentence().get();

        this.out = Math.round(Math.abs(206.835 - 62.3*syllablesPerWord - wordsPerSentence));

        return this;
    }

    grade()
    {
        if(this.out > 0 && this.out < 40){
            this.out = "Muy difícil";
            //this.infz.grade = "Universitario, Científico";
        } else if (this.out > 40 && this.out < 55){
            this.out = "Algo difícil";
            //this.infz.grade = "Bachillerato, Divulgación científica, Prensa especializada";
        } else if (this.out > 55 && this.out < 65){
            this.out = "Normal";
            //this.infz.grade = "E.S.O., Prensa general, Prensa deportiva";
        } else if (this.out > 65 && this.out < 80){
            this.out = "Bastante fácil";
            //this.infz.grade = "Educación primaria, Prensa del corazón, Novelas de éxito";
        } else if (this.out > 80){
            this.out = "Muy fácil";
            //this.infz.grade = "Educación primaria, Tebeos, Cómic";
        }

        return this;
    }

    find(word)
    {
        var regex = new RegExp(word, 'gi');

        if(this.out instanceof Array) {
            for(var i = 0; i < this.out.length; i++){
                this.out[i] = this.out[i].match(regex) || [];
            }
        } else {
            this.out = this.out.match(regex) || [];
        }

        for(var n = 0; n < this.out.length; n++){
            if(this.out[n] instanceof Array){
                for(var k = 0; k < this.out[n].length; k++){
                    this.out[n][k] = this.out[n][k].toLowerCase().replace(/ /g, '');
                }
            } else {
                this.out[n] = this.out[n].toLowerCase().replace(/ /g, '');
            }
        }

        return this.out;
    }

    readingTime(readingSpeed)
    {
        var speed = readingSpeed || 220;

        return 60*this.words().get().length/speed;
    }

    sentiment(type)
    {    
        type = type || 'afinn';

        if(this.out instanceof Array){
            for(var i = 0; i < this.out.length; i++){
                if(this.out[i] instanceof Array){
                    for(var j = 0; j < this.out[i].length; j++){                        
                        this.out[i][j] = sentimenter.getSentiment(this.trimWords(this.out[i][j]), type);
                    }
                } else {
                    // Sentence calculation
                    this.out[i] = sentimenter.getSentiment(this.trimWords(this.out[i]), type);
                }
            }
        } else {
            var sentences = this.sentences().get();
            var sentenceSentiments = this.sentiment(type);
            
            var add = (a, b) => {
                return a + b
            };

            this.out = sentenceSentiments.reduce(add)/sentenceSentiments.length;
        }
        
        return this.out;
    }

    stem(word)
    {
        if(word){
            return stemmer.stem(word);
        } else {
            if(this.out instanceof Array){
                for(var i = 0; i < this.out.length; i++){
                    if(this.out[i] instanceof Array){
                        for(var j = 0; j < this.out[i].length; j++){
                            this.out[i][j] = stemmer.stem(this.out[i][j]);
                        }
                    } else {
                        this.out[i] = stemmer.stem(this.out[i]);
                    }
                }
                return this;
            }
        }
    }

    corpusFrequency(token)
    {
        var list = JSON.parse(fs.readFileSync('./dictionaries/frequencyListRAE50000.json', 'utf8'));

        if(token){            
            return list[token];
        } else {
            if(!(this.out instanceof Array)){
                this.words().get();        
            }

            for(var i = 0; i < this.out.length; i++){
                if(this.out[i] instanceof Array){
                    for(var j = 0; j < this.out[i].length; j++){
                        if(list[this.out[i][j]] != undefined){
                            this.out[i][j] = list[this.out[i][j]];                                
                        } else {
                            this.out[i][j] = 0;                       
                        }
                    }
                } else {
                    if(list[this.out[i]] != undefined){
                        this.out[i]= list[this.out[i]];                                
                    } else {
                        this.out[i] = 0;                       
                    }
                }
            }
        }

        return this;
    }

    tfidf()
    {
        if(!(this.out instanceof Array)){
            var frequencies = this.words().concordance('relative').get();        
        }

        var idf = {};
        for (var token in frequencies){
            this.out[token] = -frequencies[token]/0.0001*Math.log(this.corpusFrequency(token)/0.001);
        }

        return this;
    }

}

module.exports = lorca;
