/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/base/DataType','sap/ui/core/Component','sap/ui/core/ComponentContainer','sap/ui/core/library',"sap/base/Log","sap/base/util/ObjectPath","sap/base/strings/camelize"],function(D,C,a,b,L,O,c){"use strict";var d=b.ComponentLifecycle;var e=a.getMetadata();var f=function(){};f.run=function(){var E=f._find();for(var i=0,l=E.length;i<l;i++){var o=E[i];L.debug("Parsing element "+o.outerHTML,"","sap/ui/core/ComponentSupport");var s=f._parse(o);f._applyDefaultSettings(s);L.debug("Creating ComponentContainer with the following settings",JSON.stringify(s,0,2),"sap/ui/core/ComponentSupport");new a(s).placeAt(o);o.removeAttribute("data-sap-ui-component");}};f._find=function(){return document.querySelectorAll("[data-sap-ui-component]");};f._parse=function(E){var s={};for(var i=0,l=E.attributes.length;i<l;i++){var A=E.attributes[i];var p=/^data-((?!sap-ui-component).+)/g.exec(A.name);if(p){var k=c(p[1]);var v=A.value;if(k!=="id"){var P=e.getProperty(k);var o=!P&&e.getEvent(k);if(!P&&!o){throw new Error("Property or event \""+k+"\" does not exist in sap.ui.core.ComponentContainer");}if(P){var t=D.getType(P.type);if(!t){throw new Error("Property \""+P.name+"\" has no known type");}v=t.parseValue(v);}else if(o){var g=O.get(v);if(typeof g!=="function"){throw new Error("Callback handler for event \""+o.name+"\" not found");}v=g;}}s[k]=v;}}return s;};f._applyDefaultSettings=function(s){s.async=true;if(s.manifest===undefined||s.manifest==="true"){s.manifest=true;}else if(s.manifest==="false"){L.error("Ignoring \"manifest=false\" for ComponentContainer of component \""+s.name+"\" as it is not supported by ComponentSupport. "+"Forcing \"manifest=true\"","","sap/ui/core/ComponentSupport");s.manifest=true;}s.lifecycle=s.lifecycle===undefined?d.Container:s.lifecycle;s.autoPrefixId=s.autoPrefixId===undefined?true:s.autoPrefixId;};f.run();return f;});