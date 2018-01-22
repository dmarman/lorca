'use strict';

class Sentimenter 
{
    constructor()
    {
        this.list = {};
    }

    afinn(array)
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