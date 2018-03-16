/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 2, maxerr: 50 */
/*global $, window, log*/

/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "userID" }]*/

var userID;

var userID_set = function (uid, storeBool) {
	$('#currentID').text(uid);
	if (storeBool) {
		localStorage.setItem("userid", uid);
	}
	log('user ID set to ' + uid);
};

// get and set userID
// info stored in localStorage, on mac: ~/library/Caches/CSXS/cep_cache
var userID_start = function () {
	if (typeof (Storage) !== "undefined") {
		var storedId = localStorage.getItem("userid");
		if (storedId === null || storedId === '') {
			log('request user ID');
			$('#getUserID').show();
		} else {
			userID_set(localStorage.userid, false);
			log('retrieved user ID');
		}
	} else {
		log('no web storage support for user ID');
		userID_set('??', false);
	}
};