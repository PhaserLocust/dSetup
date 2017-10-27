/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 2, maxerr: 50 */
/*global $, window */

/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "userID" }]*/

var userID;

var userID_set = function (uid, storeBool) {
	$('#currentID').text(uid);
	if (storeBool) {
		localStorage.setItem("userid", uid);
	}
	// console.log(Date() + ' User ID set to ' + uid);
};

// get and set userID
// info stored in localStorage, on mac: ~/library/Caches/CSXS/cep_cache
var userID_start = function () {
	if (typeof (Storage) !== "undefined") {
		var storedId = localStorage.getItem("userid");
		if (storedId === null || storedId === '') {
			// need user ID, display input
			$('#noteDisplay').hide();
			$('#getUserID').show();
		} else {
			// set ui with stored id
			userID_set(localStorage.userid, false);
		}
	} else {
		// console.log('Sorry! No Web Storage support...');
		userID_set('??', false);
	}
};