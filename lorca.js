'use strict';

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
        this.list = {};
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
        var stressedFound = false;
        var stressed = 0;
        var letterAccent = -1;

        var wordLength = word.length;
        var positions = [];
        var word = word;

        function process () {
            var numSyl = 0;

            // Look for syllables in the word
            for (var i = 0; i < wordLength;) {
                positions[numSyl++] = i;

                i = onset(i);
                i = nucleus(i);
                i = coda(i);

                if (stressedFound && stressed == 0) {
                    stressed = numSyl; // it marks the stressed syllable
                }
            }

            // If the word has not written accent, the stressed syllable is determined
            // according to the stress rules
            if (!stressedFound) {
                if (numSyl < 2) stressed = numSyl;  // Monosyllables
                else {                              // Polysyllables
                    var endLetter  = toLower(wordLength - 1);

                    if ((!isConsonant(wordLength - 1) || (endLetter == 'y')) ||
                        (((endLetter == 'n') || (endLetter == 's') && !isConsonant(wordLength - 2))))
                        stressed = numSyl - 1;  // Stressed penultimate syllable
                    else
                        stressed = numSyl;      // Stressed last syllable
                }
            }
        }

        function onset(pos) {
            var lastConsonant = 'a';

            while( pos < wordLength && (isConsonant(pos) && toLower(pos) != 'y') ) {
                lastConsonant = toLower(pos);
                pos ++;
            }

            // (q | g) + u (example: queso, gueto)
            if (pos < wordLength - 1) {
                if (toLower(pos) == 'u') {
                    if (lastConsonant == 'q') {
                        pos++;
                    } else if (lastConsonant == 'g') {
                        var letter = toLower(pos + 1);
                        if (letter == 'e' || letter == 'é' ||  letter == 'i' || letter == 'í') {
                            pos++;
                        }
                    }
                } else if ( toLower(pos) == 'ü' && lastConsonant == 'g')  {
                    // The 'u' with diaeresis is added to the consonant
                    pos++;
                }
            }

            return pos;
        }

        function nucleus(pos) {
            // Saves the type of previous vowel when two vowels together exists
            var previous = 0;
            // 0 = open
            // 1 = close with written accent
            // 2 = close

            if (pos >= wordLength) return pos; // ¡¿Doesn't it have nucleus?!

            // Jumps a letter 'y' to the starting of nucleus, it is as consonant
            if (toLower(pos) == 'y') pos++;

            // First vowel
            if (pos < wordLength) {
                switch (toLower(pos)) {
                    // Open-vowel or close-vowel with written accent
                    case 'á': case 'à':
                    case 'é': case 'è':
                    case 'ó': case 'ò':
                    letterAccent = pos;
                    stressedFound   = true;
                    // Open-vowel
                    case 'a': case 'e': case 'o':
                    previous = 0;
                    pos++;
                    break;
                    // Close-vowel with written accent breaks some possible diphthong
                    case 'í': case 'ì':
                    case 'ú': case 'ù': case 'ü':
                    letterAccent = pos;
                    pos++;
                    stressedFound = true;
                    return pos;
                    // Close-vowel
                    case 'i': case 'I':
                    case 'u': case 'U':
                    previous = 2;
                    pos++;
                    break;
                }
            }

            // If 'h' has been inserted in the nucleus then it doesn't determine diphthong neither hiatus
            var aitch = false;
            if (pos < wordLength) {
                if (toLower(pos) == 'h') {
                    pos++;
                    aitch = true;
                }
            }

            // Second vowel
            if (pos < wordLength) {
                switch (toLower(pos)) {
                    // Open-vowel with written accent
                    case 'á': case 'à':
                    case 'é': case 'è':
                    case 'ó': case 'ò':
                    letterAccent = pos;
                    if (previous != 0) {
                        stressedFound    = true;
                    }
                    // Open-vowel
                    case 'a':
                    case 'e':
                    case 'o':
                        if (previous == 0) {    // Two open-vowels don't form syllable
                            if (aitch) pos--;
                            return pos;
                        } else {
                            pos++;
                        }

                        break;

                    // Close-vowel with written accent, can't be a triphthong, but would be a diphthong
                    case 'í': case 'ì':
                    case 'ú': case 'ù':
                    letterAccent = pos;

                    if (previous != 0) {  // Diphthong
                        stressedFound    = true;
                        pos++;
                    }
                    else if (aitch) pos--;

                    return pos;
                    // Close-vowel
                    case 'i':
                    case 'u': case 'ü':
                    if (pos < wordLength - 1) { // ¿Is there a third vowel?
                        if (!isConsonant(pos + 1)) {
                            if (toLower(pos - 1) == 'h') pos--;
                            return pos;
                        }
                    }

                    // Two equals close-vowels don't form diphthong
                    if (toLower(pos) != toLower(pos - 1)) pos++;

                    return pos;  // It is a descendent diphthong
                }
            }

            // Third vowel?
            if (pos < wordLength) {
                if ((toLower(pos) == 'i') || (toLower(pos) == 'u')) { // Close-vowel
                    pos++;
                    return pos;  // It is a triphthong
                }
            }

            return pos;
        }

        function coda(pos) {

            if (pos >= wordLength || !isConsonant(pos)) {
                return pos; // Syllable hasn't coda
            } else if (pos == wordLength - 1)  { // End of word
                pos++;
                return pos;
            }

            // If there is only a consonant between vowels, it belongs to the following syllable
            if (!isConsonant(pos + 1)) return pos;

            var c1 = toLower(pos);
            var c2 = toLower(pos + 1);

            // Has the syllable a third consecutive consonant?
            if (pos < wordLength - 2) {
                var c3 = toLower(pos + 2);

                if (!isConsonant(pos + 2)) { // There isn't third consonant
                    // The groups ll, ch and rr begin a syllable

                    if ((c1 == 'l') && (c2 == 'l')) return pos;
                    if ((c1 == 'c') && (c2 == 'h')) return pos;
                    if ((c1 == 'r') && (c2 == 'r')) return pos;

                    // A consonant + 'h' begins a syllable, except for groups sh and rh
                    if ((c1 != 's') && (c1 != 'r') &&
                        (c2 == 'h'))
                        return pos;

                    // If the letter 'y' is preceded by the some
                    // letter 's', 'l', 'r', 'n' or 'c' then
                    // a new syllable begins in the previous consonant
                    // else it begins in the letter 'y'
                    if ((c2 == 'y')) {
                        if ((c1 == 's') || (c1 == 'l') || (c1 == 'r') || (c1 == 'n') || (c1 == 'c')) {
                            return pos;
                        }
                        pos++;

                        return pos;
                    }

                    // groups: gl - kl - bl - vl - pl - fl - tl
                    if ((((c1 == 'b')||(c1 == 'v')||(c1 == 'c')||(c1 == 'k')||(c1 == 'f')||(c1 == 'g')||(c1 == 'p')||(c1 == 't'))&&(c2 == 'l'))) {
                        return pos;
                    }

                    // groups: gr - kr - dr - tr - br - vr - pr - fr
                    if ((((c1 == 'b')||(c1 == 'v')||(c1 == 'c')||(c1 == 'd')||(c1 == 'k')||(c1 == 'f')||(c1 == 'g')||(c1 == 'p')||(c1 == 't'))&&(c2 == 'r'))) {
                        return pos;
                    }

                    pos++;

                    return pos;

                } else { // There is a third consonant
                    if ((pos + 3) == wordLength) { // Three consonants to the end, foreign words?
                        if ((c2 == 'y')) {  // 'y' as vowel
                            if ((c1 == 's') || (c1 == 'l') || (c1 == 'r') || (c1 == 'n') || (c1 == 'c')) {
                                return pos;
                            }
                        }

                        if (c3 == 'y') { // 'y' at the end as vowel with c2
                            pos++;
                        }
                        else {  // Three consonants to the end, foreign words?
                            pos += 3;
                        }
                        return pos;
                    }

                    if ((c2 == 'y')) { // 'y' as vowel
                        if ((c1 == 's') || (c1 == 'l') || (c1 == 'r') || (c1 == 'n') || (c1 == 'c'))
                            return pos;

                        pos++;
                        return pos;
                    }

                    // The groups pt, ct, cn, ps, mn, gn, ft, pn, cz, tz and ts begin a syllable
                    // when preceded by other consonant

                    if ((c2 == 'p') && (c3 == 't') ||
                        (c2 == 'c') && (c3 == 't') ||
                        (c2 == 'c') && (c3 == 'n') ||
                        (c2 == 'p') && (c3 == 's') ||
                        (c2 == 'm') && (c3 == 'n') ||
                        (c2 == 'g') && (c3 == 'n') ||
                        (c2 == 'f') && (c3 == 't') ||
                        (c2 == 'p') && (c3 == 'n') ||
                        (c2 == 'c') && (c3 == 'z') ||
                        (c2 == 't') && (c3 == 's') ||
                        (c2 == 't') && (c3 == 's'))
                    {
                        pos++;
                        return pos;
                    }

                    if ((c3 == 'l') || (c3 == 'r') ||    // The consonantal groups formed by a consonant
                        // following the letter 'l' or 'r' cann't be
                        // separated and they always begin syllable
                        ((c2 == 'c') && (c3 == 'h')) ||  // 'ch'
                        (c3 == 'y')) {                   // 'y' as vowel
                        pos++;  // Following syllable begins in c2
                    }
                    else
                        pos += 2; // c3 begins the following syllable
                }
            }
            else {
                if ((c2 == 'y')) return pos;

                pos +=2; // The word ends with two consonants
            }

            return pos;
        }

        function toLower(pos) {
            return word[pos].toLowerCase();
        }

        function isConsonant(pos)
        {
            return !/[aeiouáéíóúàèìòùüAEIOUÁÉÍÓÚÀÈÌÒÙÜ]/.test(word[pos]);
        }

        process();

        //this.positions = function () {
         //   return positions;
        //};

        var syllables = [];

        for (var i = 0; i < positions.length; i++) {
            var start = positions[i];
            var end = wordLength;
            if (positions.length > i+1) {
                end = positions[i + 1];
            }
            var seq = word.slice(start, end).replace(/ /, '').toLowerCase();
            syllables.push(seq);
        }

        return syllables;

    } 

    concordance(mode)
    {
        var tokens = this.words().get();
        var concordance = [];

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
        var sorted = [];
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
        var tonicRegex = /( |\b)(yo|tú|vos|usted|él|ella|ello|nosotros|nosotras|ustedes|ellos|ellas|mí|conmigo|ti|contigo|consigo)( |\b)/gi;
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

    calculateSentiment(array)
    {
        const fs = require('fs');
        var afinn = JSON.parse(fs.readFileSync('./dictionaries/afinnShortSortedSpanish.json', 'utf8'));

        var words = array;
        var score = 0;
        var negator = 1;

            words.forEach((token) => {
                if(afinn[token] != undefined){
                    score += negator*afinn[token];   
                    // TODO jamás, ni. 
                    if(token == 'no' || token == 'nunca'){
                        negator = -1;
                    }
                }
            });
        
        score = score/words.length;                     

        return score;
    }

    sentiment()
    {        
        if(this.out instanceof Array){
            for(var i = 0; i < this.out.length; i++){
                if(this.out[i] instanceof Array){
                    for(var j = 0; j < this.out[i].length; j++){
                        this.out[i][j] = this.calculateSentiment(this.trimWords(this.out[i][j]));
                    }
                } else {
                    // Sentence calculation
                    this.out[i] = this.calculateSentiment(this.trimWords(this.out[i]));                    
                }
            }
        } else {
            var sentences = this.sentences().get();
            var sentenceSentiments = this.sentiment();
            
            var add = (a, b) => {
                return a + b
            }

            this.out = sentenceSentiments.reduce(add)/sentenceSentiments.length;
        }
        
        return this.out;
    }
    
    // Beta
    trainSentiment(sentence, flag)
    {
        var tokens = this.trimWords(sentence);

        for(var i = 0; i < tokens.length; i++){
            if(this.list.hasOwnProperty(tokens[i])){
                if(flag === true){
                    this.list[tokens[i]].score += 1;
                } else {
                    this.list[tokens[i]].score -= 1;
                }
                this.list[tokens[i]].frequency += 1;                      
            } else {
                if(flag === true){
                    this.list[tokens[i]] = {score: 1, frequency: 1};
                } else {
                    this.list[tokens[i]] = {score: -1, frequency: 1};                    
                }
            }
        }

        this.output = {};

        for(var token in this.list){
            this.output[token] = this.list[token].score/this.list[token].frequency; 
        }
   
        return this.output;
    }

    // Beta
    guess(string)
    {
        var words = this.trimWords(string);
        var score = 0;
        
        words.forEach((item) => {
            if(this.output[item] != undefined){
                score += this.output[item];
            }
        });

        return score;
    }

}

module.exports = lorca;
