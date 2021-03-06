/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/base/ManagedObject","sap/ui/dt/ElementUtil","sap/ui/dt/Util"],function(M,E,U){"use strict";var O={};var S='sap.ui.dt.ElementOverlay';var a='sap.ui.dt.AggregationOverlay';var o={};var A={};O.getOverlay=function(e){var I=(typeof e==="string"?e:E.getElementInstance(e)&&E.getElementInstance(e).getId());return o[I]||A[I];};O.getOverlays=function(){return U.objectValues(o);};O.register=function(b){if(!i(b)){var l='sap.ui.dt.OverlayRegistry#register';var e=new Error(l+' / Attempt to register illegal overlay');e.name=l;throw e;}o[b.getId()]=b;if(b.getMetadata().getName()===S){A[b.getAssociation('element')]=b;}};O.deregister=function(b){if(!i(b)){var l='sap.ui.dt.OverlayRegistry#deregister';var e=new Error(l+' / Attempt to deregister illegal overlay');e.name=l;throw e;}delete o[b.getId()];if(b.getMetadata().getName()===S){delete A[b.getAssociation('element')];}};O.hasOverlays=function(){return!jQuery.isEmptyObject(o);};function i(b){return(b instanceof M&&[S,a].indexOf(b.getMetadata().getName())>-1);}return O;},true);
