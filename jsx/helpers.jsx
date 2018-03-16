/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 2, maxerr: 50 */
/*global */

/* eslint no-unused-vars: 0 */

// returns array of strings with duplicates removed
function remDupStr(arr) {
	if (arr.length === 0) return arr;
	var seen = {};
	return arr.filter(function(item) {
		return seen.hasOwnProperty(item) ? false : (seen[item] = true);
	});
}

// returns bool, true if string begins w/substring
function beginsWith(strToFind, strToSearch) {
  return (strToSearch.substr(0, strToFind.length) === strToFind);
}