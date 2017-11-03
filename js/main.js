/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 2, maxerr: 50 */
/*global $, window, CSInterface, userID_start, userID_set, themeManager */

$(document).ready(function () {
	'use strict';
	
	var csInterface = new CSInterface();
	
	function init() {
		themeManager.init();
	}
		
	
	//test only
	var writeID = function () {
		console.log('clicked write button');
		csInterface.evalScript('eval_XMP(' + '"TEST ID 12345"' + ')', function (res) {
			$("#message .text").html("wrote id: " + res).parent().fadeIn();
		});
	};
	
	var readID = function () {
		console.log('clicked read button');
		csInterface.evalScript('eval_XMP("")', function (res) {
			$("#message .text").html("read id: " + res).parent().fadeIn();
		});
	};
	//////
	
	
	
	
	//////////////////////////////////
	
  $('#setUserID').click(function () {
		userID_set($('#userID').val(), true);
		$('#getUserID').hide();
		$('#noteDisplay').show();
	});
    
	$('#currentID').click(function () {
		$('#noteDisplay').hide();
		$('#getUserID').show();
		$('#userID').focus();
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

		console.log('datalink: ' + $('input[name=linked_data]:checked').val());
		
		// tell db to make new record for this item
		// get response
		// populate tabs with recieved info, disabling #btn_link(cannot unlink data)
	});
	
	$('#btn_split').click(function () {
		// duplicate file, prompt for necessary info
		// request new database record for split item
		// apply response to split item(add ID to xmp, load info, etc)
	});
	
	$('#btn_getFonts').click(function () {
		console.log('clicked fonts button');
		csInterface.evalScript('eval_fontList()', function (res) {
			console.log(res);
		});
	});
	
	$('#btn_getSelSize').click(function () {
		console.log('clicked get size button');
		csInterface.evalScript('eval_selSize()', function (res) {
			console.log(res);
		});
	});
	
	$('#btn_getLinks').click(function () {
		console.log('clicked get links button');
		csInterface.evalScript('eval_linkList()', function (res) {
			console.log(res);
			csInterface.evalScript('eval_hasEmbedded()', function (res) {
				console.log('has embedded:' + res);
			});
		});
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
		console.log(Date() + ' doc saved');
		console.log(event.data);
	}
	*/
    
	function onDocDeactivated(event) {
		console.log('onDocDeActivated called');
		console.log(event);
		
		// clear ui to get ready for next document
		// check if doc has been closed, if so, remove loaded info
		
	}
	
	function onDocActivated(event) {
		console.log('onDocActivated called');
		console.log(event);
		
		console.log('datalink: ' + $('input[name=linked_data]:checked').val());
		
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
		console.log(Date() + ' window loaded');
	});
	
	// handle user id
	userID_start();
});