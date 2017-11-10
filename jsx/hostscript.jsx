/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 2, maxerr: 50 */
/*global $, app, remDupStr, beginsWith,
InkPrintStatus, DocumentColorSpace, XML*/

/* functions used in main.js with csInterface.evalScript() begin with 'eval' */
/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "eval" }]*/

// adds ES5 fuctionality ot .jsx
//@include "es5-shim.jsx";

// adds JSON functionality to .jsx, for formatting complex objects to return:
//@include "json2.jsx";

// helper functions
//@include "helpers.jsx";

//////////////////////////////////////////

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
// with multiple selected, seems to return different results than shown in info pallette.
// perhaps should round values before calculations to match ui?
// or should/can we get bounds of selection when multiple selected?

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
			
			//if live text inside envelope and cannot edit contents:
			//Error 1302: No such element Line: 110->  			if (thisStory.textFrames[j].layer.visible)
			
			if (thisStory.textFrames[j].layer.visible) {
				for (k = 0; k < thisStory.textFrames[j].characters.length; k++) {
					if (fontList.indexOf(thisStory.textFrames[j].characters[k].textFont.name) === -1) {
						fontList.push(thisStory.textFrames[j].characters[k].textFont.name);
						
					}
				}
			}
		}
	}
	alert(fontList);
	return JSON.stringify(fontList);
}

// returns linked file names 
// [[linked files],[missing links]]
// lists linked files used on visible layers of active document
// inaccessible images inside opacity masks are listed as unknown
// attempts to return names of missing links
function eval_linkList() {
	var doc = app.activeDocument;
	
	var linkCount = doc.placedItems.length; // includes duplicates...
	if (linkCount === 0) {
		alert('no placed items in doc');
		return 'false';
	}
	
	var hasOpacityMask = false, hasMissing = false;
	
	var i, thisLink, filePath, linkList = [], unknownCount = 1;
	for (i = 0; i < linkCount; i++) {
		thisLink = doc.placedItems[i];
		var thisLinkVis, thisLinkPri;
		//if placeditem inside opacity mask:
		//Error 1302: No such element Line:149-> when accessing placeditem's layer prop
		try {
			thisLinkVis = thisLink.layer.visible;
			thisLinkPri = thisLink.layer.printable;
		} catch (e) {
			hasOpacityMask = true;
			linkList.push('Unknown Placed Item ' + unknownCount);
			unknownCount++;
		}
		
		if (!hasOpacityMask && thisLinkVis && thisLinkPri) {
			try {
				// throws 'Error 9062: There is no file associated with this item' when link is missing
				filePath = decodeURI(thisLink.file);
				linkList.push(filePath.substring(filePath.lastIndexOf('/')+1));
			} catch (e) {
				alert(e);
				hasMissing = true;
			}
		}
	}
	
	if (hasMissing) {
		alert('missing = true')
		var missingList = findMissingLinkNames(doc);
	}
	
	alert(linkList);
	alert(missingList);
	return JSON.stringify([remDupStr(linkList), remDupStr(missingList)]);
}

// return array of missing linked file names
// compares doc.placeditems with XMPString info
function findMissingLinkNames(doc) {
	alert('called findMissingLinkNames');
	
	// get list of all linked images from XMP
  var x = new XML(doc.XMPString);
	var m = x.xpath('//xmpMM:Manifest//stRef:filePath')   
	var i, xmpLinks = [], mLength = m.length(); 
    
	if (m !== '') {
		for (i = 0; i < mLength; i++) {
			var linkPath = m[i];
			var linkName = File(linkPath).name;
			if (xmpLinks.indexOf(linkName) === -1) {
				xmpLinks.push(linkName);
			}
		}
	}

	// get list of all linked and raster images from Document, excluding linked with missing file property
	var count = doc.placedItems.length;
	var thisLink, filePath, linkList = [];
	for (i = 0; i < count; i++) {
		thisLink = doc.placedItems[i];
		try {
			// throws 'Error 9062: There is no file associated with this item' when link is missing
			filePath = decodeURI(thisLink.file);
			linkList.push(filePath.substring(filePath.lastIndexOf('/')+1));
		}
		catch (e) {
			alert('findMissing catch e');
		}
	}
	
	var thisName, parentName;
	count = doc.rasterItems.length;
	for (i = 0; i < count; i++) {
		thisLink = doc.rasterItems[i];
		thisName = thisLink.name;
		if (thisName !== '') {
			parentName = thisLink.parent.name;
			if (beginsWith(thisName, parentName)) {
				linkList.push(parentName);
			}
		}
	}
	
	// create array of all images from XMP not in document list
	var missingLinks = [];
	for (i = 0; i < xmpLinks.length; i++) {
		thisLink = xmpLinks[i];
		if (linkList.indexOf(thisLink) === -1) {
				missingLinks.push(thisLink);
		}
	}
	
	alert('missing: ' + missingLinks);
  return missingLinks;
}

// return 'true' or 'false' if document has raster items on visible printing layers
// raster items = embedded images
function eval_hasEmbedded() {
	var doc = app.activeDocument;
	
	var rastCount = doc.rasterItems.length;
	if (rastCount === 0) {
		alert('no raster items in doc');
		return 'false';
	}
	
	var i, thisRast;
	for (i = 0; i < rastCount; i++) {
		thisRast = doc.rasterItems[i];
		if (thisRast.layer.visible && thisRast.layer.printable) {
			alert('embedded true');
			return 'true';
		}
	}
}

// returns 'RGB' or 'CMYK' depending on color mode of current doc
function eval_colorMode() {
	var colorSpace = app.activeDocument.documentColorSpace;
	if (colorSpace === DocumentColorSpace.RGB) {
		colorSpace = 'RGB';
	} else {
		colorSpace = 'CMYK';
	}
	alert('colormode= ' + colorSpace);
	return colorSpace;
}

// return list of all inks used by current document's current state
// filters inks by printingStatus property, inks on non-printing and hidden layers are ignored
// returned list will include process CMY&K inks...
function eval_inksList() {
	var doc = app.activeDocument;
	
	var inkCount = doc.inkList.length;
	var i, thisInk, inkList = [];
	for(i = 0; i < inkCount; i++) {
		thisInk = doc.inkList[i];
		if (thisInk.inkInfo.printingStatus === InkPrintStatus.ENABLEINK) {
			inkList.push(thisInk.name);
		}
  }
	alert(inkList);
	return JSON.stringify(inkList);
}




