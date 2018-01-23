[![npm](https://img.shields.io/npm/v/lorca-nlp.svg)](https://www.npmjs.com/package/lorca-nlp) [![Packagist](https://img.shields.io/packagist/l/doctrine/orm.svg)]()

# Lorca.js
Lorca is a NLP library for Spanish written in javascript. Tokenization,
concordance, stemmer, statistics, sentiment analysis, readability, tf-idf and more!

## Installation
### Client-side

Not suported yet, but soon.

### Server-side

Run:

```bash
$ npm install lorca-nlp
```

Start using the library like:
```javascript
const lorca = require('lorca-nlp');

var doc = lorca('esto es un test');

doc.words().get();
// [ 'esto', 'es', 'un', 'test' ]
```

## API Concept

This library lets concatenate different methods to the document you are working on. Each time a method
is executed, its output is stored in the doc object. If you need to execute methods more than once
 you have to make use of the ```load()``` method. This will reload the original document in the doc object.

 ```javascript
 var doc = lorca('En verano hace calor. En invierno hace frío');

 // This stores the concordance output in the doc object.
 var concordance = doc.concordance().sort().get();

 // If you now need the words of your document, you must reload it with load().
 var originalWords = doc.load().words().get();
 ```

## Text tokenization

Extract sentences, words or syllables.

```javascript
var doc = lorca('En verano hace calor. En invierno hace frío');

doc.get();
// En verano hace calor. En invierno hace frío.

doc.sentences().get();
// [ 'En verano hace calor.', ' En invierno hace frío.' ]

doc.words().get();
// [ 'en', 'verano', 'hace', 'calor', 'en', 'invierno', 'hace', 'frío' ]

doc.syllables().get();
// [ 'en', 've', 'ra', 'no', 'ha', 'ce', 'ca', 'lor.', 'en', 'in', 'vier', 'no', 'ha', 'ce','frí', 'o.' ]

doc.uniqueWords().get();
// [ 'en', 'verano', 'hace', 'calor', 'invierno', 'frío' ]

doc.onceWords().get();
// [ 'verano', 'calor', 'invierno', 'frío' ]
```

Group the output by sentence, word or both.

```javascript
doc.sentences().words().get();
// [ [ 'en', 'verano', 'hace', 'calor' ],
//   [ 'en', 'invierno', 'hace', 'frío' ] ]

doc.sentences().words().syllables().get();
/*
 [ [ [ 'en' ],
     [ 've', 'ra', 'no' ],
     [ 'ha', 'ce' ],
     [ 'ca', 'lor' ] ],
   [ [ 'en' ],
     [ 'in', 'vier', 'no' ],
     [ 'ha', 'ce' ],
     [ 'frí', 'o' ] ] ]
*/

doc.sentences().syllables().get();
// [ [ 'En ', 've', 'ra', 'no', ' ha', 'ce ', 'ca', 'lor.' ],
//   [ ' En', ' in', 'vier', 'no', ' ha', 'ce ', 'frí', 'o.' ] ]

doc.words().syllables().get();
/*
[ [ 'en' ],
  [ 've', 'ra', 'no' ],
  [ 'ha', 'ce' ],
  [ 'ca', 'lor' ],
  [ 'en' ],
  [ 'in', 'vier', 'no' ],
  [ 'ha', 'ce' ],
  [ 'frí', 'o' ] ]
*/
```

### Prepositions

Extract prepositions from text, sentences or words.

```javascript
doc.prepositions().get();
// [ 'en', 'en' ]

doc.sentences().prepositions().get();
// [ [ 'en' ], [ 'en' ] ]

doc.words().prepositions().get();
// [ [ 'en' ], [], [], [], [ 'en' ], [], [], [] ]
```

### Pronouns

Extract pronouns from text, sentences or words.

```javascript
var doc = lorca('Yo le canto a él. Él se rie.');

doc.pronouns().get();
// [ 'yo', 'él', 'él' ]

doc.sentences().pronouns().get();
// [ [ 'yo', 'él' ], [ 'él' ] ]

doc.words().pronouns().get()
// [ [ 'yo' ], [], [], [], [ 'él' ], [ 'él' ], [], [] ]

doc.pronouns().percentage().get();
// 0.375

doc.sentences().pronouns().percentage().get();
// [ 0.4, 0.3333333333333333 ]
```

### Adverbs

Extract adverbs from text, sentences or words.

```javascript
var doc = lorca('En verano hace realmente calor. En invierno hace frío');

doc.adverbs().get();
// [ 'realmente' ]

doc.sentences().adverbs().get();
// [ [ 'realmente' ], [] ]
```

## Pasive Voice

Test whether a sentence is passive.

```javascript
var doc = lorca('El niño ha sido castigado.');
doc.isPassive().get();
// true

var doc = lorca('El niño ha sido castigado. La madre lo ha castigado.');
doc.sentences().isPassive().get();
// [ true, false ]
```

## Concordance

Get the word frequency of a document. The concordance method accepts the mode ```'relative'``` which outputs the relative frequency of the words. It is posible to sort the output by frequency and to shorten the output array with the method ```sort()```.

```javascript
var doc = lorca('En verano hace calor. En invierno hace frío');

doc.concordance().get();
// [ en: 2, verano: 1, hace: 2, calor: 1, invierno: 1, 'frío': 1 ]

doc.concordance().sort().get();
// [ en: 2, hace: 2, verano: 1, calor: 1, invierno: 1, 'frío': 1 ]

doc.concordance('relative').sort().get();
// [ en: 0.25, hace: 0.25, verano: 0.125 calor: 0.125, invierno: 0.125, 'frío': 0.125 ]

doc.concordance().sort(3).get();
// [ en: 2, hace: 2, verano: 1 ]

// Get the relative frequency from a huge corpus given by RAE.
doc.words().corpusFrequency().get();
// [ 0.02775516,
//   0.00008453,
//   0.00075057,
//   0.00007254,
//   0.02775516,
//   0.00004106,
//   0.00075057,
//   0.00007199 ]

doc.sentences().words().corpusFrequency().get();
// [ [ 0.02775516, 0.00008453, 0.00075057, 0.00007254 ],
// [ 0.02775516, 0.00004106, 0.00075057, 0.00007199 ] ]
```

## Statistics

Get basic statistics of a text.

```javascript
var doc = lorca('En verano hace calor. En invierno hace frío');

doc.words().get().length;
// 8

doc.sentences().get().length;
// 2

doc.wordsPerSentence().get();
// 4

doc.syllablesPerWord().get()
// 2

doc.syllablesPerSentence().get()
// 8

doc.uniqueWords().percentage().get();
// 0.75

doc.onceWords().percentage().get();
// 0.5

doc.prepositions().percentage().get();
// 0.25

doc.sentences().prepositions().percentage().get();
// [ 0.25, 0.25 ]
```

## Readability

### IFSZ Index

```javascript
doc.ifsz().get();
// 78

doc.ifsz().grade().get();
// Bastante fácil
```

## Sentiment

### AFINN

Disclaimer: It uses a semi-automated translation of the original AFINN list. The list only contains words that are inside the 10.000 most used words. It has a total of 885 words. The ```sentiment()``` method calculates the relative value of each sentece and then it returns the relative values of those sentences. 
Positive values mean a positive sentiment and negative values mean negative sentiment.

The sentiment algorithm stems the text input in order to reach a wider spectrum of words.

```javascript
var doc = lorca('El plátano está malo.');

doc.sentiment();
// -0.75

var doc = lorca('Me gusta la navidad.');

doc.sentiment();
// 0.5

var doc = lorca('El plátano está muy bueno. Me gusta la navidad. Esto no ha sido magnífico.');

doc.sentences().sentiment();
// [ 0.6, 0.5, -1.2 ]

doc.words().sentiment();
// [ 0, 0, 0, 0, 3, 0, 2, 0, 0, 0, -1, 0, 0, 5 ]

doc.sentences().words().sentiment()
// [ [ 0, 0, 0, 0, 3 ], [ 0, 2, 0, 0 ], [ 0, -1, 0, 0, 5 ] ]

doc.sentiment();
// -0.03333333333333329
```

### ML-SENTICON

This method uses a powerful lemma-level lexicon created in 2014 by [Fermín L. Cruz, José A. Troyano, Beatriz Pontes and F. Javier Ortega](https://www.sciencedirect.com/science/article/pii/S0957417414001997?via%3Dihub). 

```javascript
var doc = lorca('El plátano está malo.');

doc.sentiment('senticon');
// -0.09375
```

## Stemmer

Get the stem of any word in Spanish. The stemmer is based on the [Porter](http://snowball.tartarus.org/algorithms/spanish/stemmer.html) algorithm.
You can also get the stemed concordance of your document.

```javascript
doc.stem('recomendaciones');
// recomend

var doc = lorca('Los niños juegan con las pelotas');
doc.words().stem().get();
// [ 'los', 'niñ', 'jueg', 'con', 'las', 'pelot' ]

var doc = lorca('Los niños juegan con las pelotas. Los profesores hablan del tiempo.');
doc.sentences().words().stem().get();
// [ [ 'los', 'niñ', 'jueg', 'con', 'las', 'pelot' ],
//   [ 'los', 'profesor', 'habl', 'del', 'tiemp' ] ]

var doc = lorca('Los niños juegan con las niñas.');
doc.words().stem().concordance().sort().get();
// { 'niñ': 2, los: 1, jueg: 1, con: 1, las: 1 }
```

## tf-idf

The tf-idf has batteries included. It leverages a big frequency list to get the main words of any text.

```javascript
var doc = lorca('En verano hace calor. En invierno hace frío. El verano me gusta');

doc.tfidf().sort().get();
// { verano: 4117.747963402167,
//   invierno: 2660.600722826124,
//   frío: 2192.690048750771,
//   calor: 2186.3476209394835,
//   gusta: 2068.4919519114765,
//   hace: 478.20393517589827,
//   me: -748.0756841870855,
//   el: -2833.037926222993,
//   en: -5539.036281420974 }

doc.tfidf().sort(2).get();
// { verano: 4117.747963402167,
//   invierno: 2660.600722826124 }
```

## Reading Time

Get the reading time of a text in seconds. You can pass a reading speed as
an argument in the ```readingtime(400)```  in words per minute. If no reading
speed is given, it will use default value of 220 wpm.

```javascript
var doc = lorca('El niño ha sido castigado. La madre lo ha castigado.');

doc.readingTime();
// 2.72
```

## Search

Search any word in the text. You can use Regex too.

```javascript
var doc = lorca('En verano hace calor. En invierno hace frío');

doc.find("verano");
// [ 'verano' ]

doc.sentences().find("verano");
// [ [ 'verano' ], [] ]
```

## Testing

```bash
$ npm test
```

## Thanks to

[Vic](https://github.com/vic/silabas.js) - for his Spanish hyphenator in javascript. 
Cruz, Fermín L., José A. Troyano, Beatriz Pontes, F. Javier Ortega. [Building layered, multilingual sentiment lexicons at synset and lemma levels](https://www.sciencedirect.com/science/article/pii/S0957417414001997?via%3Dihub), Expert Systems with Applications, 2014. For their senticon list in sentiment analysis.