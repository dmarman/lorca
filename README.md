# Lorca.js
Lorca is a NLP library for Spanish written in javascript.

## Installation
### Client-side

Download lorca.js from this repository and inclue it in your html. Start using it right away.

### Server-side
Not suported yet, but soon.

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
// [ 'En ', 've', 'ra', 'no', ' ha', 'ce ', 'ca', 'lor.', 
//   'En', ' in', 'vier', 'no', ' ha', 'ce ','frí', 'o.' ]

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
[ 'realmente' ]

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