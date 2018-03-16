/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 2, maxerr: 50 */
/*global $, window, CSInterface, userID_start, userID_set, themeManager,
log, ptsToMM, ptsToInches */

$(document).ready(function () {
	'use strict';
	
	var csInterface = new CSInterface();
	
	function init() {
		themeManager.init();
	}
		
	
	//test only
	var writeID = function () {
		log('clicked write button');
		csInterface.evalScript('eval_XMP(' + '"TEST ID 12345"' + ')', function (res) {
			$("#message .text").html("wrote id: " + res).parent().fadeIn();
		});
	};
	
	var readID = function () {
		log('clicked read button');
		csInterface.evalScript('eval_XMP("")', function (res) {
			$("#message .text").html("read id: " + res).parent().fadeIn();
		});
	};
	//////
	
	
	
	
	//////////////////////////////////
	
	$('#currentID').click(function () {
		$('#noteDisplay').hide();
		$('#getUserID').show();
		$('#userID').focus();
	});
	
	$('#setUserIDform').submit(function (e) {
		// form uses html5 form validation
		e.preventDefault();
		userID_set($('#userID').val(), true);
		$('#getUserID').hide();
		$('#noteDisplay').show();
	});
    
	$("ul.tabs li").click(function () {
		$(this).find('button').blur(); // removes blue focus outline
		var tabset = '#' + $(this).attr("tabset");
		var dataTab = $(this).attr("data-tab");
		$(tabset).find('.tabs').filter(":first").find('.current').removeClass('current');
		$(tabset).children('.current').removeClass('current');
		$(this).addClass("current");
		$("#" + dataTab).addClass("current");
		if (tabset === '#noteTabs') {
			$('#btn_addNote').html('Add ' + dataTab.substr(3) + ' Note');
		}
	});
	
	$('#btn_link').click(function () {
		log('datalink: ' + $('input[name=linked_data]:checked').val());
		
		// tell db to make new record for this item, send filename(& other info?)
		// get response
		// populate tabs with recieved info, disabling #btn_link(cannot unlink data)
		//// set filename in preflight tab
		csInterface.evalScript('eval_getURLandName()', function (res) {
			res = JSON.parse(res);
			$('#preTitle').text(res[1]);
		});
	});
	
	$('#btn_split').click(function () {
		// duplicate file, prompt for necessary info
		// request new database record for split item
		// apply response to split item(add ID to xmp, load info, etc)
	});
	
	$('#btn_preflight').click(function () {
		log('clicked preflight');
		/*
		// run auto-preflight methods
		csInterface.evalScript('eval_fontList()', function (res) {
			console.log(res);
			csInterface.evalScript('eval_linkList()', function (res) {
				console.log(res);
				csInterface.evalScript('eval_hasEmbedded()', function (res) {
					console.log('has embedded:' + res);
				});
			});
		});
		*/
		
		//enable preflight controls
		$('.preCtrl').removeClass('disabled');
		
		//hide & show header buttons
		$('#btn_preflight').hide();
		$('#skipPre').hide();
		$('#btn_preImport').show();
	});
	
	$('#btn_skipPre').click(function () {
		log('clicked skipPre');
		//toggle btn_preflight
		$('#btn_preflight').prop('disabled', function (i, v) { return !v; });
	});
	
	$('#btn_getSelSize').click(function () {
		csInterface.evalScript('eval_selSize()', function (res) {
			res = JSON.parse(res);
			if (res[0] !== 'error') {
				$('#preSizeMM').text(ptsToMM(res[0], 3) + 'mm x ' + ptsToMM(res[1], 3) + 'mm');
				$('#preSizeIn').text(ptsToInches(res[0], 4) + '" x ' + ptsToInches(res[1], 4) + '"');
			} else {
				log(res[1]);
			}
		});
	});
	
	var preFonts;
	$('#btn_getFonts').click(function () {
		csInterface.evalScript('eval_fontList()', function (res) {
			res = JSON.parse(res);
			if (res[0] !== 'error') {
				preFonts = res[0];
				$('#preFonts').text('Fonts Used: ' + res[0].length);
				$('#preFontsUnk').text('Unknown Fonts: ' + res[1]);
			} else {
				log(res[1]);
			}
		});
	});
	
	var preLinked, preMissing;
	$('#btn_getLinks').click(function () {
		csInterface.evalScript('eval_linkList()', function (res) {
			res = JSON.parse(res);
			if (res[0] !== 'error') {
				preLinked = res[0];
				preMissing = res[1];
				$('#preLinks').text('Linked: ' + res[0].length);
				$('#preMissing').text('Missing: ' + res[1].length);
				$('#preEmbed').text('Has Embedded: ' + res[2]);
				
				$("btn_viewLinks").prop('disabled', false);
			} else {
				log(res[1]);
			}
		});
	});
	
	var prePantone, preCustom;
	$('#btn_getInks').click(function () {
		csInterface.evalScript('eval_inksList()', function (res) {
			res = JSON.parse(res);
			if (res[0] !== 'error') {
				prePantone = res[0];
				preCustom = res[1];
				$('#preInks').text('Pantone Inks: ' + res[0].length);
				$('#preCustom').text('Custom Inks: ' + res[1].length);
				$('#preMode').text('Color Mode: ' + res[2]);
				
				$("btn_viewLinks").prop('disabled', false);
			} else {
				log(res[1]);
			}
		});
	});
	
	$('#btn_viewFonts').click(function () {
		// display lists of linked and missing images
		log('clicked listFonts button');
		//generate content
		////get from server after query????
		$('#listFonts .popUpContent').html('Fonts: ' + preFonts.join(', '));
		
		//show popup
		$('#listFonts').show();
	});
	
	$('#btn_viewLinks').click(function () {
		// display lists of linked and missing images
		log('clicked listLinks button');
		//generate content
		////get from server after query????
		$('#listLinks .popUpContent').html('Linked: ' + preLinked.join(', ') + '<br/> Missing: ' + preMissing.join(', '));
		
		//show popup
		$('#listLinks').show();
	});
	
	$('#btn_viewInks').click(function () {
		// display lists of linked and missing images
		log('clicked listInks button');
		//generate content
		////get from server after query????
		$('#listInks .popUpContent').html('Pantone: ' + prePantone.join(', ') + '<br/> Custom: ' + preCustom.join(', '));
		
		//show popup
		$('#listInks').show();
	});
	
	$('.dismiss').click(function () {
		$(this).parent().hide();
	});
	
	/*test only
	$('#writeID').click(function () {
		writeID();
	});
	
	$('#readID').click(function () {
		readID();
	});
	*/
	
	//////////////////////////////////
	
	/*
	function onDocSaved(event) {
		log('doc saved');
		console.log(event.data);
	}
	*/
    
	function onDocDeactivated(event) {
		log('onDocDeActivated called');
		//console.log(event);
		
		// clear ui to get ready for next document
		// check if doc has been closed, if so, remove loaded info
		
	}
	
	function onDocActivated(event) {
		log('onDocActivated called');
		//console.log(event);
		
		log('datalink: ' + $('input[name=linked_data]:checked').val());
		
		// check if loaded info exists for this document
		// if loaded info exists, populate ui:
		//// add customer, job, item# to notes tab names
		// if no loaded info, check if doc has database id
		// if database id, request info, load info, and populate ui with response
		// if no database id, set #btn_link available to create database id
		
		
		
		
		//set link checkbox:
		//$('#btn_link').prop('checked', false);
		
	}
	
	//themeManager:
	init();
	
	//listen for ai document deactivations
	csInterface.addEventListener("documentAfterDeactivate", onDocDeactivated);
	
	//listen for ai document activations
	csInterface.addEventListener("documentAfterActivate", onDocActivated);
	
	//listen for ai document save
	//csInterface.addEventListener("documentAfterSave", onDocSaved);
	
	$(window).load(function () {
		// if ai opened by doubleclicking file, received 'documentAfterActivate' event will not contain relevent info
		// To remedy, if doc is open on window load we get relevent info & call onDocActivated
		csInterface.evalScript('eval_docIsOpen()', function (res) {
			log("docIsOpen result: " + res);
			if (res === 'true') {
				csInterface.evalScript('eval_getURLandName()', function (res) {
					log('getURLandName' + res);
					res = JSON.parse(res);
					log("the refresh result: " + res[0] + "  " + res[1]);
					//onDocActivated(res);
				});
			}
		});
	});
	
	// handle user id
	userID_start();
});