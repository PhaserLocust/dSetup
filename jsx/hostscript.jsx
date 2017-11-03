/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 2, maxerr: 50 */
/*global $, app */

/* functions used in main.js with csInterface.evalScript() begin with 'eval' */
/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "eval" }]*/

// adds ES5 fuctionality ot .jsx
//@include "es5-shim.jsx";

// adds JSON functionality to .jsx, for formatting complex objects to return:
//@include "json2.jsx";

// returns bool
function eval_docIsOpen() {
  return app.documents.length > 0 ? 'true' : 'false';
}

// return array with name info from active document
function eval_getURLandName() {
	var theArr = [];
	
	theArr[0] = 'file:///Volumes' + app.activeDocument.fullName.fullName;
	theArr[1] = app.activeDocument.name;
	
	//return value must be string...
	return JSON.stringify(theArr);
}

// read & write to document metadata, specifically user id string
function eval_XMP(idValue) {
	var XMPtool = {
    ns : "http://www.clddigital.com/suiteD/setup",
    prefix : "dsup:",
		doc : '',
    f : new Object(),
    read : function (prop) {
			if (xmpLib === undefined) {
				var xmpLib = new ExternalObject('lib:AdobeXMPScript');
			}
			var xmpFile = new XMPFile(this.f.fsName, XMPConst.UNKNOWN, XMPConst.OPEN_FOR_READ);
			var xmpPackets = xmpFile.getXMP();
			var xmp = new XMPMeta(xmpPackets.serialize());
			return xmp.getProperty(this.ns, prop).toString();
		},
    write : function (prop, val) { //f:fileObject, arg1:String, arg2:String
			if (xmpLib === undefined) {
				var xmpLib = new ExternalObject('lib:AdobeXMPScript');
			}
			var xmpFile = new XMPFile(this.f.fsName, XMPConst.UNKNOWN, XMPConst.OPEN_FOR_UPDATE);
			var xmp = xmpFile.getXMP();
			var mt = new XMPMeta(xmp.serialize());
			XMPMeta.registerNamespace(this.ns, this.prefix);
			mt.setProperty(this.ns, prop, val);
			if (xmpFile.canPutXMP(xmp)) {
				xmpFile.putXMP(mt);
			}
			// update open file dom
			this.doc.XMPString = mt.serialize(XMPConst.SERIALIZE_USE_COMPACT_FORMAT);
			// file must be saved, otherwise XMP changes will be lost
			this.doc.saved = false;
			return 'ok';
		}
  };
	
	XMPtool.doc = app.activeDocument;
	XMPtool.f = XMPtool.doc.fullName;
	
	if (idValue === '') {
		//read ID
		return XMPtool.read("ID");
	} else {
		//write ID
		return XMPtool.write("ID", idValue);
	}
}

// return width and height of selection of active document
function eval_selSize() {
	var sel = app.activeDocument.selection;
	var selCount = sel.length;
	if (selCount === 0) {return JSON.stringify(['error', 'no selection'])}
	var i, thisObj;
	var left = sel[0].left, top = sel[0].top, right = (left + sel[0].width), bottom = (top - sel[0].height);
	for (i = 1; i < selCount; i++) {
		thisObj = sel[i];
		if (thisObj.left < left) {left = thisObj.left}
		if (thisObj.top > top) {top = thisObj.top}
		if (thisObj.left + thisObj.width > right) {right = thisObj.left + thisObj.width}
		if (thisObj.top - thisObj.height < bottom) {bottom = thisObj.top - thisObj.height}
	}
	
	alert([right - left, top - bottom]);
	return JSON.stringify([right - left, top - bottom]);
}

// return list of fonts used on visible layers of active document
function eval_fontList() {
	var doc = app.activeDocument;
	
	var i, j, k, thisStory, fontList = [];
	var storyCount = doc.stories.length;
	if (storyCount === 0) {
		alert('no fonts in doc');
		return 'false';
	}
	
	for (i = 0; i < storyCount; i++) {
		thisStory = doc.stories[i];
		for (j = 0; j < thisStory.textFrames.length; j++) {
			if (thisStory.textFrames[j].layer.visible) {
				for (k = 0; k < thisStory.textFrames[j].characters.length; k++) {
					if (fontList.indexOf(thisStory.textFrames[j].characters[k].textFont.name) === -1) {
						fontList.push(thisStory.textFrames[j].characters[k].textFont.name);
						
						//if font not missing, outline text?
						
					}
				}
			}
		}
	}
	alert(fontList);
	return JSON.stringify(fontList);
}

// return list of linked files used on visible layers of active document
function eval_linkList() {
	var doc = app.activeDocument;
	
	var i, thisLink, filePath, linkList = [];
	var linkCount = doc.placedItems.length;
	if (linkCount === 0) {
		alert('no placed items in doc');
		return 'false';
	}
	
	for (i = 0; i < linkCount; i++) {
		thisLink = doc.placedItems[i];
		if (thisLink.layer.visible && thisLink.layer.printable) {
			filePath = decodeURI(thisLink.file);
			linkList.push(filePath.substring(filePath.lastIndexOf('/')+1));
		}
	}
	alert(linkList);
	return JSON.stringify(linkList);
}

// return 'true' or 'false' if document has raster items on visible printing layers
function eval_hasEmbedded() {
	var doc = app.activeDocument;
	
	var i, thisRast;
	var rastCount = doc.rasterItems.length;
	if (rastCount === 0) {
		alert('no raster items in doc');
		return 'false';
	}
	
	for (i = 0; i < rastCount; i++) {
		thisRast = doc.rasterItems[i];
		if (thisRast.layer.visible && thisRast.layer.printable) {
			alert('embedded true');
			return 'true';
		}
	}
}
