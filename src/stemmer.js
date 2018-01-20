'use strict';

class Stemmer
{
    constructor(){
        
    }

    isVowel(c)
    {
        var regex = /[aeiouáéíóú]/gi;

        return regex.test(c);
    }

    nextVowelPosition(word, start = 0)
    {
        var length = word.length;

        for(var position = start; position < length; position++){
            if(this.isVowel(word[position])){
                return position;
            }            
        }

        return length;
    }

    nextConsonantPosition(word, start = 0)
    {
        var length = word.length;

        for(var position = start; position < length; position++){
            if(!this.isVowel(word[position])){
                return position;
            }            
        }

        return length;
    }

    endsIn(word, suffix)
    {
        if(word.length < suffix.length){
            return false;
        }

        return (word.slice(-suffix.length) === suffix);
    }

    endsInArr(word, suffixes)
    {
        var matches = [];
        for(var i in suffixes) {
            if(this.endsIn(word, suffixes[i])){
                matches.push(suffixes[i]);
            }
        }
        var longest = matches.sort(function (a, b) {
            return b.length - a.length;
        })[0];

        if(longest){
            return longest
        } else {
            return '';
        }
    }

    removeAccent(word)
    {
        var accentedVowels = ['á', 'é', 'í', 'ó', 'ú'];        
        var vowels = ['a', 'e', 'i', 'o', 'u'];

        for(var i in accentedVowels){
            word = word.replace(accentedVowels[i], vowels[i]);
        }

        return word;
    }

    stemm(word)
    {
        var length = word.length;

        if(length < 2){
            return word;
        }

        word.toLowerCase();

        var r1, r2, rv;
        r1 = length;
        r2 = length;
        rv = length;
        
        // R1 is the region after the first non-vowel following a vowel, or is the null region 
        // at the end of the word if there is no such non-vowel.
        for(var i = 0; i < (length - 1) && r1 == length; i++){
            if(this.isVowel(word[i]) && !this.isVowel(word[i + 1])){
                r1 = i + 2;
            }
        }

        // R2 is the region after the first non-vowel following a vowel in R1, 
        // or is the null region at the end of the word if there is no such non-vowel. 
        for(var i = r1; i < (length - 1) && r2 == length; i++){
            if(this.isVowel(word[i]) && !this.isVowel(word[i + 1])){
                r2 = i + 2;
            }
        }

        if(length > 3){
            if(!this.isVowel[word[1]]){
				// If the second letter is a consonant, RV is the region after the next following vowel
                rv = this.nextVowelPosition(word, 2) + 1;                
            } else if (this.isVowel(word[0]) && this.isVowel(word[1])){
				// or if the first two letters are vowels, RV is the region after the next consonant
                rv = this.nextConsonantPosition(word, 2) + 1;
            } else {
				//otherwise (consonant-vowel case) RV is the region after the third letter. 
                //But RV is the end of the word if these positions cannot be found.
                rv = 3;
            }
        }

        var r1Text = word.slice(r1); 
        var r2Text = word.slice(r2); 
        var rvText = word.slice(rv); 
        var originalWord = word;

        // Step 0: Attached pronoun
        var pronounSuffix = ['me', 'se', 'sela', 'selo', 'selas', 'selos', 'la', 'le', 'lo', 'las', 'les', 'los', 'nos'];
        var pronounSuffixPre1 = ['éndo', 'ándo', 'ár', 'ér', 'ír'];
        var pronounSuffixPre2 = ['endo', 'ando', 'ar', 'er', 'ir'];

        var suffix = this.endsInArr(word, pronounSuffix);

        if(suffix != ''){

            var preSuffix = this.endsInArr(word.slice(0, -suffix.length), pronounSuffixPre1);     
            if(preSuffix != ''){
                word = this.removeAccent(word.slice(0, -suffix.length));
            } else {
                preSuffix = this.endsInArr(word.slice(0, -suffix.length), pronounSuffixPre2);     
                if(preSuffix != '' || 
                    (this.endsIn(word, 'yendo')) && 
                    (word.slice(0, -suffix.length) == 'u')){
                        word = word.slice(0, -suffix.length);
                }
            }
            
        }

        if(word != originalWord){
            r1Text = word.slice(r1); 
            r2Text = word.slice(r2); 
            rvText = word.slice(rv);
        }

        var wordAfter0 = word;

//        console.log(r1Text, r2Text, rvText);

        if((this.endsInArr(r2Text, ['anza', 'anzas', 'ico', 'ica', 'icos', 'icas', 'ismo', 'ismos', 'able', 'ables', 'ible', 'ibles', 'ista', 'istas', 'oso', 'osa', 'osos', 'osas', 'amiento', 'amientos', 'imiento', 'imientos'])) != '') 
        {
			word = word.slice(0, -this.endsInArr(r2Text, ['anza', 'anzas', 'ico', 'ica', 'icos', 'icas', 'ismo', 'ismos', 'able', 'ables', 'ible', 'ibles', 'ista', 'istas', 'oso', 'osa', 'osos', 'osas', 'amiento', 'amientos', 'imiento', 'imientos']).length);	
		} 
        else if ((this.endsInArr(r2Text, ['icadora', 'icador', 'icación', 'icadoras', 'icadores', 'icaciones', 'icante', 'icantes', 'icancia', 'icancias', 'adora', 'ador', 'ación', 'adoras', 'adores', 'aciones', 'ante', 'antes', 'ancia', 'ancias'])) != '') 
        {
            word = word.slice(0, -this.endsInArr(r2Text, ['icadora', 'icador', 'icación', 'icadoras', 'icadores', 'icaciones', 'icante', 'icantes', 'icancia', 'icancias', 'adora', 'ador', 'ación', 'adoras', 'adores', 'aciones', 'ante', 'antes', 'ancia', 'ancias']).length);	
		} 
        else if ((this.endsInArr(r2Text, ['logía', 'logías'])) != '') 
        {
			word = word.slice(0, -this.endsInArr(r2Text, ['logía', 'logías']).length) + 'log';
		} 
        else if ((this.endsInArr(r2Text, ['ución', 'uciones'])) != '') 
        {
			word = word.slice(0, -this.endsInArr(r2Text, ['ución', 'uciones']).length) + 'u';
		} 
        else if ((this.endsInArr(r2Text, ['encia', 'encias'])) != '') 
        {
			word = word.slice(0, -this.endsInArr(r2Text, ['encia', 'encias']).length) + 'ente';
		} 
        else if ((this.endsInArr(r2Text, ['ativamente', 'ivamente', 'osamente', 'icamente', 'adamente'])) != '') 
        {
			word = word.slice(0, -this.endsInArr(r2Text, ['ativamente', 'ivamente', 'osamente', 'icamente', 'adamente']).length);
		} 
        else if ((this.endsInArr(r1Text, ['amente'])) != '') 
        {
			word = word.slice(0, -this.endsInArr(r1Text, ['amente']).length);
		} 
        else if ((this.endsInArr(r2Text, ['antemente', 'ablemente', 'iblemente', 'mente'])) != '') 
        {
			word = word.slice(0, -this.endsInArr(r2Text, ['antemente', 'ablemente', 'iblemente', 'mente']).length);
		} 
        else if ((this.endsInArr(r2Text, ['abilidad', 'abilidades', 'icidad', 'icidades', 'ividad', 'ividades', 'idad', 'idades'])) != '') 
        {
			word = word.slice(0, -this.endsInArr(r2Text, ['abilidad', 'abilidades', 'icidad', 'icidades', 'ividad', 'ividades', 'idad', 'idades']).length);
		}
        else if ((this.endsInArr(r2Text, ['ativa', 'ativo', 'ativas', 'ativos', 'iva', 'ivo', 'ivas', 'ivos'])) != '') 
        {
			word = word.slice(0, -this.endsInArr(r2Text, ['ativa', 'ativo', 'ativas', 'ativos', 'iva', 'ivo', 'ivas', 'ivos']).length);
		}

        if(word != wordAfter0){
            r1Text = word.slice(r1); 
            r2Text = word.slice(r2); 
            rvText = word.slice(rv);
        }
        var wordAfter1 = word;

        if(wordAfter0 === wordAfter1){

            // Do step 2a if no ending was removed by step 1. 
            var suf = this.endsInArr(rvText, ['ya', 'ye', 'yan', 'yen', 'yeron', 'yendo', 'yo', 'yó', 'yas', 'yes', 'yais', 'yamos']);

			if(suf != '' && (word.slice(0 - suf.length - 1, 1) == 'u')){
				word = word.slice(0, -suf.length);
			}

            if(word != wordAfter1){
				r1Text = word.slice(r1); 
                r2Text = word.slice(r2); 
                rvText = word.slice(rv);
			}

			var wordAfter2a = word;
            // Do Step 2b if step 2a was done, but failed to remove a suffix. 
			if (wordAfter2a == wordAfter1) {
				if ((this.endsInArr(rvText, ['en', 'es', 'éis', 'emos'])) != '') {
					word = word.slice(0, -this.endsInArr(rvText, ['en', 'es', 'éis', 'emos']).length);
					if (this.endsIn(word, 'gu')) {
						word = word.slice(0, -1);
					}
				} else if (this.endsInArr(rvText, ['arían', 'arías', 'arán', 'arás', 'aríais', 'aría', 'aréis', 'aríamos', 'aremos', 'ará', 'aré', 'erían', 'erías', 'erán', 'erás', 'eríais', 'ería', 'eréis', 'eríamos', 'eremos', 'erá', 'eré', 'irían', 'irías', 'irán', 'irás', 'iríais', 'iría', 'iréis', 'iríamos', 'iremos', 'irá', 'iré', 'aba', 'ada', 'ida', 'ía', 'ara', 'iera', 'ad', 'ed', 'id', 'ase', 'iese', 'aste', 'iste', 'an', 'aban', 'ían', 'aran', 'ieran', 'asen', 'iesen', 'aron', 'ieron', 'ado', 'ido', 'ando', 'iendo', 'ió', 'ar', 'er', 'ir', 'as', 'abas', 'adas', 'idas', 'ías', 'aras', 'ieras', 'ases', 'ieses', 'ís', 'áis', 'abais', 'íais', 'arais', 'ierais', '  aseis', 'ieseis', 'asteis', 'isteis', 'ados', 'idos', 'amos', 'ábamos', 'íamos', 'imos', 'áramos', 'iéramos', 'iésemos', 'ásemos']) != '') {
                    word = word.slice(0, -this.endsInArr(rvText, ['arían', 'arías', 'arán', 'arás', 'aríais', 'aría', 'aréis', 'aríamos', 'aremos', 'ará', 'aré', 'erían', 'erías', 'erán', 'erás', 'eríais', 'ería', 'eréis', 'eríamos', 'eremos', 'erá', 'eré', 'irían', 'irías', 'irán', 'irás', 'iríais', 'iría', 'iréis', 'iríamos', 'iremos', 'irá', 'iré', 'aba', 'ada', 'ida', 'ía', 'ara', 'iera', 'ad', 'ed', 'id', 'ase', 'iese', 'aste', 'iste', 'an', 'aban', 'ían', 'aran', 'ieran', 'asen', 'iesen', 'aron', 'ieron', 'ado', 'ido', 'ando', 'iendo', 'ió', 'ar', 'er', 'ir', 'as', 'abas', 'adas', 'idas', 'ías', 'aras', 'ieras', 'ases', 'ieses', 'ís', 'áis', 'abais', 'íais', 'arais', 'ierais', '  aseis', 'ieseis', 'asteis', 'isteis', 'ados', 'idos', 'amos', 'ábamos', 'íamos', 'imos', 'áramos', 'iéramos', 'iésemos', 'ásemos']).length);
                }
			}
        }

        r1Text = word.slice(r1); 
        r2Text = word.slice(r2); 
        rvText = word.slice(rv);

        if ((this.endsInArr(rvText, ['os', 'a', 'o', 'á', 'í', 'ó'])) != '') {
			word = word.slice(0, -this.endsInArr(rvText, ['os', 'a', 'o', 'á', 'í', 'ó']).length);
		} else if ((this.endsInArr(rvText , ['e','é'])) != '') {
			word = word.slice(0, -1);
			rvText = word.slice(rv);
			if (this.endsIn(rvText, 'u') && this.endsIn(word, 'gu')) {
				word = word.slice(0, -1);
			}
		}
		
		return this.removeAccent(word);
    }

}

module.exports = new Stemmer;