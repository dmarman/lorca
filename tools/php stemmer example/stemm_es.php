<?php
/*

	Stemm_es a stemming class for spanish / Un lexemador para español
    Copyright (C) 2007  Paolo Ragone

    This library is free software; you can redistribute it and/or
    modify it under the terms of the GNU Lesser General Public
    License as published by the Free Software Foundation; either
    version 2.1 of the License, or (at your option) any later version.

    This library is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
    Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public
    License along with this library; if not, write to the Free Software
    Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA
	or go to: http://www.gnu.org/licenses/lgpl.txt

	You may contact me at pragone@gmail.com

*/

class stemm_es {

	function is_vowel($c) {
		return ($c == 'a' || $c == 'e' || $c == 'i' || $c == 'o' || $c == 'u' || $c == 'á' || $c == 'é' ||
			$c == 'í' || $c == 'ó' || $c == 'ú');
	}

	function getNextVowelPos($word, $start = 0) {
		$len = strlen($word);
		for ($i = $start; $i < $len; $i++)
			if (stemm_es::is_vowel($word[$i])) return $i;
		return $len;
	}

	function getNextConsonantPos($word, $start = 0) {
		$len = strlen($word);
		for ($i = $start; $i < $len; $i++)
			if (!stemm_es::is_vowel($word[$i])) return $i;
		return $len;		
	}

	function endsin($word, $suffix) {
		if (strlen($word) < strlen($suffix)) return false;
		return (substr($word, -strlen($suffix)) == $suffix);
	}

	function endsinArr($word, $suffixes) {
		foreach ($suffixes as $suff) {
			if (stemm_es::endsin($word, $suff)) return $suff;
		}
		return '';
	}

	function removeAccent($word) {
		return str_replace(array('á','é','í','ó','ú'), array('a','e','i','o','u'), $word);
	}

	function stemm($word) {
		$len = strlen($word);
		if ($len <=2) return $word;

		$word = strtolower($word);

		$r1 = $r2 = $rv = $len;
		//R1 is the region after the first non-vowel following a vowel, or is the null region at the end of the word if there is no such non-vowel.
		for ($i = 0; $i < ($len-1) && $r1 == $len; $i++) {
			if (stemm_es::is_vowel($word[$i]) && !stemm_es::is_vowel($word[$i+1])) { 
					$r1 = $i+2;
			}
		}

		//R2 is the region after the first non-vowel following a vowel in R1, or is the null region at the end of the word if there is no such non-vowel. 
		for ($i = $r1; $i < ($len -1) && $r2 == $len; $i++) {
			if (stemm_es::is_vowel($word[$i]) && !stemm_es::is_vowel($word[$i+1])) { 
				$r2 = $i+2; 
			}
		}

		if ($len > 3) {
			if(!stemm_es::is_vowel($word[1])) {
				// If the second letter is a consonant, RV is the region after the next following vowel
				$rv = stemm_es::getNextVowelPos($word, 2) +1;
			} elseif (stemm_es::is_vowel($word[0]) && stemm_es::is_vowel($word[1])) { 
				// or if the first two letters are vowels, RV is the region after the next consonant
				$rv = stemm_es::getNextConsonantPos($word, 2) + 1;
			} else {
				//otherwise (consonant-vowel case) RV is the region after the third letter. But RV is the end of the word if these positions cannot be found.
				$rv = 3;
			}
		}

		$r1_txt = substr($word,$r1);
		$r2_txt = substr($word,$r2);
		$rv_txt = substr($word,$rv);

		$word_orig = $word;

		// Step 0: Attached pronoun
		$pronoun_suf = array('me', 'se', 'sela', 'selo', 'selas', 'selos', 'la', 'le', 'lo', 'las', 'les', 'los', 'nos');	
		$pronoun_suf_pre1 = array('éndo', 'ándo', 'ár', 'ér', 'ír');	
		$pronoun_suf_pre2 = array('ando', 'iendo', 'ar', 'er', 'ir');
		$suf = stemm_es::endsinArr($word, $pronoun_suf);
		if ($suf != '') {
			$pre_suff = stemm_es::endsinArr(substr($rv_txt,0,-strlen($suf)),$pronoun_suf_pre1);
			if ($pre_suff != '') {
				$word = stemm_es::removeAccent(substr($word,0,-strlen($suf)));
			} else {
				$pre_suff = stemm_es::endsinArr(substr($rv_txt,0,-strlen($suf)),$pronoun_suf_pre2);
				if ($pre_suff != '' ||
					(stemm_es::endsin($word, 'yendo' ) && 
					(substr($word, -strlen($suf)-6,1) == 'u'))) {
					$word = substr($word,0,-strlen($suf));
				}
			}
		}
		
		if ($word != $word_orig) {
			$r1_txt = substr($word,$r1);
			$r2_txt = substr($word,$r2);
			$rv_txt = substr($word,$rv);
		}
		$word_after0 = $word;
		
		if (($suf = stemm_es::endsinArr($r2_txt, array('anza', 'anzas', 'ico', 'ica', 'icos', 'icas', 'ismo', 'ismos', 'able', 'ables', 'ible', 'ibles', 'ista', 'istas', 'oso', 'osa', 'osos', 'osas', 'amiento', 'amientos', 'imiento', 'imientos'))) != '') {
			$word = substr($word,0, -strlen($suf));	
		} elseif (($suf = stemm_es::endsinArr($r2_txt, array('icadora', 'icador', 'icación', 'icadoras', 'icadores', 'icaciones', 'icante', 'icantes', 'icancia', 'icancias', 'adora', 'ador', 'ación', 'adoras', 'adores', 'aciones', 'ante', 'antes', 'ancia', 'ancias'))) != '') {
			$word = substr($word,0, -strlen($suf));	
		} elseif (($suf = stemm_es::endsinArr($r2_txt, array('logía', 'logías'))) != '') {
			$word = substr($word,0, -strlen($suf)) . 'log';
		} elseif (($suf = stemm_es::endsinArr($r2_txt, array('ución', 'uciones'))) != '') {
			$word = substr($word,0, -strlen($suf)) . 'u';
		} elseif (($suf = stemm_es::endsinArr($r2_txt, array('encia', 'encias'))) != '') {
			$word = substr($word,0, -strlen($suf)) . 'ente';
		} elseif (($suf = stemm_es::endsinArr($r2_txt, array('ativamente', 'ivamente', 'osamente', 'icamente', 'adamente'))) != '') {
			$word = substr($word,0, -strlen($suf));
		} elseif (($suf = stemm_es::endsinArr($r1_txt, array('amente'))) != '') {
			$word = substr($word,0, -strlen($suf));
		} elseif (($suf = stemm_es::endsinArr($r2_txt, array('antemente', 'ablemente', 'iblemente', 'mente'))) != '') {
			$word = substr($word,0, -strlen($suf));
		} elseif (($suf = stemm_es::endsinArr($r2_txt, array('abilidad', 'abilidades', 'icidad', 'icidades', 'ividad', 'ividades', 'idad', 'idades'))) != '') {
			$word = substr($word,0, -strlen($suf));
		} elseif (($suf = stemm_es::endsinArr($r2_txt, array('ativa', 'ativo', 'ativas', 'ativos', 'iva', 'ivo', 'ivas', 'ivos'))) != '') {
			$word = substr($word,0, -strlen($suf));
		}

		if ($word != $word_after0) {
			$r1_txt = substr($word,$r1);
			$r2_txt = substr($word,$r2);
			$rv_txt = substr($word,$rv);
		}
		$word_after1 = $word;
		
		if ($word_after0 == $word_after1) {
			// Do step 2a if no ending was removed by step 1. 
			if (($suf = stemm_es::endsinArr($rv_txt, array('ya', 'ye', 'yan', 'yen', 'yeron', 'yendo', 'yo', 'yó', 'yas', 'yes', 'yais', 'yamos'))) != '' && (substr($word,-strlen($suf)-1,1) == 'u')) {
				$word = substr($word,0, -strlen($suf));
			}
			
			if ($word != $word_after1) {
				$r1_txt = substr($word,$r1);
				$r2_txt = substr($word,$r2);
				$rv_txt = substr($word,$rv);
			}
			$word_after2a = $word;
			
			// Do Step 2b if step 2a was done, but failed to remove a suffix. 
			if ($word_after2a == $word_after1) {
				if (($suf = stemm_es::endsinArr($rv_txt, array('en', 'es', 'éis', 'emos'))) != '') {
					$word = substr($word,0, -strlen($suf));
					if (stemm_es::endsin($word, 'gu')) {
						$word = substr($word,0,-1);
					}
				} elseif (($suf = stemm_es::endsinArr($rv_txt, array('arían', 'arías', 'arán', 'arás', 'aríais', 'aría', 'aréis', 'aríamos', 'aremos', 'ará', 'aré', 'erían', 'erías', 'erán', 'erás', 'eríais', 'ería', 'eréis', 'eríamos', 'eremos', 'erá', 'eré', 'irían', 'irías', 'irán', 'irás', 'iríais', 'iría', 'iréis', 'iríamos', 'iremos', 'irá', 'iré', 'aba', 'ada', 'ida', 'ía', 'ara', 'iera', 'ad', 'ed', 'id', 'ase', 'iese', 'aste', 'iste', 'an', 'aban', 'ían', 'aran', 'ieran', 'asen', 'iesen', 'aron', 'ieron', 'ado', 'ido', 'ando', 'iendo', 'ió', 'ar', 'er', 'ir', 'as', 'abas', 'adas', 'idas', 'ías', 'aras', 'ieras', 'ases', 'ieses', 'ís', 'áis', 'abais', 'íais', 'arais', 'ierais', '  aseis', 'ieseis', 'asteis', 'isteis', 'ados', 'idos', 'amos', 'ábamos', 'íamos', 'imos', 'áramos', 'iéramos', 'iésemos', 'ásemos'))) != '') {
					$word = substr($word,0, -strlen($suf));
				}
			}
		}

		// Always do step 3. 
		$r1_txt = substr($word,$r1);
		$r2_txt = substr($word,$r2);
		$rv_txt = substr($word,$rv);

		if (($suf = stemm_es::endsinArr($rv_txt, array('os', 'a', 'o', 'á', 'í', 'ó'))) != '') {
			$word = substr($word,0, -strlen($suf));
		} elseif (($suf = stemm_es::endsinArr($rv_txt ,array('e','é'))) != '') {
			$word = substr($word,0,-1);
			$rv_txt = substr($word,$rv);
			if (stemm_es::endsin($rv_txt,'u') && stemm_es::endsin($word,'gu')) {
				$word = substr($word,0,-1);
			}
		}
		
		return stemm_es::removeAccent($word);
	}
}
?>