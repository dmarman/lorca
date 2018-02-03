'use strict';

const stemmer = require('./stemmer.js');

class Sentimenter 
{
    constructor()
    {
        this.afinnList = require('../dictionaries/afinnShortSortedSpanish');
        this.senticonList = require('../dictionaries/senticon.json');
        this.list = {};
        this.afinnStem = {};
        this.senticonStem = {}
        
        for(var token in this.afinnList){
            this.afinnStem[stemmer.stem(token)] = this.afinnList[token];
        }

        for(var token in this.senticonList){
            this.senticonStem[stemmer.stem(token)] = this.senticonList[token].pol;
        }
    }

    getSentiment(array, type)
    {      
        if(type === 'afinn'){
            return this.afinn(array);
        } else if (type == 'senticon') {
            return this.senticon(array);
        }
    }

    afinn(array)
    {
        var words = array;
        var score = 0;
        var negator = 1;

        words.forEach((token) => {
            if(this.afinnStem[stemmer.stem(token)] != undefined){
                score += negator*this.afinnStem[stemmer.stem(token)];   
                // TODO jamás, ni. 
                if(token == 'no' || token == 'nunca'){
                    negator = -1;
                }
            }
        });
        
        score = score/words.length;                     

        return score;
    }

    senticon(array)
    {
        var words = array;
        var score = 0;
        var negator = 1;

        words.forEach((token) => {
            if(this.senticonStem[stemmer.stem(token)] != undefined){
                score += negator*this.senticonStem[stemmer.stem(token)];   
                // TODO jamás, ni. 
                if(token == 'no' || token == 'nunca'){
                    negator = -1;
                }
            }
        });
        
        score = score/words.length;                     

        return score;
    }

    // Beta
    train(sentence, flag)
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

module.exports = new Sentimenter;