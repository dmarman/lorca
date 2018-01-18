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

require_once 'stemm_es.php';

$lines = file('stemm_test_corpus.txt');

$now = time();
foreach ($lines as $line) {
	$part = split(' ', $linea);
	$st = stemm_es::stemm($part[0]);
	if ($st != $part[1]) {
		print "Word: " . $part[0] . ", stem: " . $st . ", ";
		print "expected: " . $part[1];
		print " -- BAD<HR>";
	}
}

print "<BR>Stemmed: " . count($lines) . " words in " . (time() - $now) . " secs";

?>