/** Syllabler gets a word and outputs and array containing its syllables.
 *  This code belongs to https://github.com/vic/silabas.js
 */

const syllabler = function(word)
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

module.exports = syllabler;
