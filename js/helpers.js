/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 2, maxerr: 50 */
/*global $*/

/* eslint no-unused-vars: 0 */

var debugLog = [Date() + ' begin log'];
function log(entry) {
	if (debugLog.length > 200) {debugLog.pop(); }
	debugLog.unshift(Date() + ' ' + entry);
	$('#log').html(debugLog.join('<br/>'));
}

function roundTo(decimalPlaces, number) {
	var factor = Math.pow(10, decimalPlaces),
		tempNum = number * factor,
		roundedTempNum = Math.round(tempNum);
	return roundedTempNum / factor;
}

function ptsToMM(points, decimalPlaces) {
	return roundTo(decimalPlaces, points / 2.83464567);
}

function ptsToInches(points, decimalPlaces) {
	return roundTo(decimalPlaces, 0.01388889 * points);
}