/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 2, maxerr: 50 */
/*global $, app */

/* functions used in main.js with csInterface.evalScript() begin with 'eval' */
/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "eval" }]*/

// adds JSON functionality to .jsx, for formatting complex objects to return:
#include "json2.jsx";

// returns bool
function eval_docIsOpen() {
  return app.documents.length > 0 ? 'true' : 'false';
}

// return array with info from active document
function eval_getURLandName() {
	var theArr = [];
	
	theArr[0] = 'file:///Volumes' + app.activeDocument.fullName.fullName;
	theArr[1] = app.activeDocument.name;
	
	//return value must be string...
	return JSON.stringify(theArr);
}

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
