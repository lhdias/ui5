/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/Utils","sap/ui/rta/appVariant/AppVariantUtils","sap/ui/core/BusyIndicator","sap/ui/thirdparty/jquery","sap/base/util/UriParameters"],function(F,A,B,q,U){"use strict";var a,o,r,c,C,d;var g=function(){return F.getAppDescriptor(r);};var t=function(e){return o.createDescriptor(e);};var T=function(D){if(D){d=null;B.show();d=q.extend({},D);return o.saveAppVariantToLREP(D);}else{return Promise.reject();}};var f=function(){return o.triggerCatalogAssignment(d);};var b=function(R){if(R&&R.response&&R.response.IAMId){return o.notifyKeyUserWhenTileIsReady(R.response.IAMId,d.getId());}return Promise.resolve();};sap.ui.getCore().getEventBus().subscribe("sap.ui.rta.appVariant.manageApps.controller.ManageApps","navigate",function(){if(a){a.destroy();a=null;}});return{onGetOverview:function(e){var D=g();return new Promise(function(h){var i=function(){A.publishEventBus();};sap.ui.require(["sap/ui/rta/appVariant/AppVariantOverviewDialog"],function(j){if(!a){a=new j({idRunningApp:D["sap.app"].id,isOverviewForKeyUser:e});}a.attachCancel(i);a.oPopup.attachOpened(function(){h(a);});a.open();});});},isOverviewExtended:function(){var u=new U(window.location.href);if(!u.get("sap-ui-xx-app-variant-overview-extended")){return false;}else{var m=u.get("sap-ui-xx-app-variant-overview-extended",true);if(m&&m.length){var M=m[0].toLowerCase();return M==='true';}}},isManifestSupported:function(){var D=g();return A.getManifirstSupport(D["sap.app"].id).then(function(R){return R.response;}).catch(function(e){var E=A.buildErrorInfo("MSG_APP_VARIANT_FEATURE_FAILED",e);E.overviewDialog=true;return A.showRelevantDialog(E,false);});},isPlatFormEnabled:function(R,s,l){r=R;c=l;var D=g();if(D["sap.app"]&&D["sap.app"].id){if(F.getUshellContainer()&&!A.isStandAloneApp()&&s==="CUSTOMER"){var i;if(D["sap.app"].crossNavigation&&D["sap.app"].crossNavigation.inbounds){i=A.getInboundInfo(D["sap.app"].crossNavigation.inbounds);}else{i=A.getInboundInfo();}if(i){return true;}}}return false;},getAppVariantDescriptor:function(R){r=R;var D=g();if(D["sap.app"]&&D["sap.app"].id){return A.getDescriptorFromLREP(D["sap.app"].id);}return Promise.resolve(false);},onSaveAsFromRtaToolbar:function(s,e){var D;if(s){D=g();}else{D=q.extend(true,{},C);C=null;}return new Promise(function(h){var p=function(){return o.processSaveAsDialog(D,s);};var i=function(){if(e){return o.copyUnsavedChangesToLREP(d.getId(),e);}return Promise.resolve();};var j=function(R){var u=F.getUshellContainer();if(u&&e){u.setDirtyFlag(false);}return o.showSuccessMessageAndTriggerActionFlow(d,s).then(function(){return b(R).then(h);});};sap.ui.require(["sap/ui/rta/appVariant/AppVariantManager"],function(k){if(!o){o=new k({rootControl:r,commandSerializer:c});}var P=[p,t,T,i,f,j];function l(m){return m.reduce(function(n,u){return n.then(u);},Promise.resolve()).catch(function(){return Promise.resolve(false);});}l(P);});});},onSaveAsFromOverviewDialog:function(e,s){var h=false;var D=g();if(e["sap.app"].id===D["sap.app"].id){h=true;}C=q.extend(true,{},e);e=null;return this.onSaveAsFromRtaToolbar(s,h);}};});
