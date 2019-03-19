/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/mvc/Controller","sap/m/Dialog","sap/m/Text","sap/m/Button","sap/m/ButtonType","sap/m/Input","sap/m/Label","sap/m/MessageBox","sap/ui/fl/support/apps/contentbrowser/lrepConnector/LRepConnector","sap/ui/fl/support/apps/contentbrowser/utils/DataUtils"],function(C,D,T,B,a,I,L,M,b,c){"use strict";return C.extend("sap.ui.fl.support.apps.contentbrowser.controller.ContentDetails",{oSelectedContentModel:undefined,oDataUtils:c,onInit:function(){this._initAndBindSelectedContentModel();var r=sap.ui.core.UIComponent.getRouterFor(this);r.getRoute("ContentDetails").attachMatched(this._onRouteMatched,this);r.getRoute("ContentDetailsFlip").attachMatched(this._onRouteMatched,this);},_initAndBindSelectedContentModel:function(){this.oSelectedContentModel=new sap.ui.model.json.JSONModel();this.getView().setModel(this.oSelectedContentModel,"selectedContent");},_onRouteMatched:function(r){var t=this;var R=r.getParameter("arguments");var m={};m.layer=R.layer;m.namespace=decodeURIComponent(R.namespace);m.fileName=R.fileName;m.fileType=R.fileType;if(m.namespace[m.namespace.length-1]!=="/"){m.namespace+="/";}var s=m.namespace+m.fileName+"."+m.fileType;var p=t.getView().getContent()[0];p.setBusy(true);return b.getContent(m.layer,s,null,null,true).then(t._onContentReceived.bind(t,m,p,s),function(){p.setBusy(false);});},_onContentReceived:function(m,p,s,d){var t=this;m.data=c.formatData(d,m.fileType);if(m.fileType){return b.getContent(m.layer,s,true).then(t._onContentMetadataReceived.bind(t,m,p),function(){p.setBusy(false);});}else{return Promise().resolve();}},_onContentMetadataReceived:function(m,p,o){m.metadata=o;this.oSelectedContentModel.setData(m);var d=sap.ui.getCore();var i=this.getView().createId("contentDetailsIconTabBar");var e=d.getElementById(i);if(e){var f=e.getItems()[0];if(e.getSelectedKey()!==f.getId()){e.setSelectedItem(f);}}p.setBusy(false);},onEditClicked:function(){var s=this.getView().getModel("selectedContent");var o=s.getData();var r=sap.ui.core.UIComponent.getRouterFor(this);r.navTo("ContentDetailsEdit",{"layer":o.layer,"namespace":encodeURIComponent(o.namespace),"fileName":o.fileName,"fileType":o.fileType});},onDeleteClicked:function(){var t=this;var d=new D({title:"{i18n>confirmDeletionTitle}",type:"Message",content:new T({text:"{i18n>questionFileDeletion}"}),beginButton:new B({text:"{i18n>confirm}",type:a.Reject,press:function(){d.close();t._selectTransportAndDeleteFile();}}),endButton:new B({text:"{i18n>cancel}",press:function(){d.close();}}),afterClose:function(){d.destroy();}});this.getView().addDependent(d);d.open();},_selectTransportAndDeleteFile:function(){var t=this;var s=this.getView().getModel("selectedContent");var o=s.getData();var S=o.layer;var d="";var f,p,g;o.metadata.some(function(m){if(m.name==="layer"){d=m.value;return true;}});o.metadata.some(function(m){if(m.name==="transportId"){f=m.value;return true;}});try{p=JSON.parse(o.data).packageName;}catch(e){}var n=o.namespace;var F=o.fileName;var h=o.fileType;if((d==="USER")||(d==="LOAD")||(d==="VENDOR_LOAD")||(!f&&(!p||p==="$TMP"))){g=undefined;t._deleteFile(d,n,F,h,g,S);}else if(f==="ATO_NOTIFICATION"){g=f;t._deleteFile(d,n,F,h,g,S);}else{var i=new I({placeholder:"Transport ID or ATO_NOTIFICATION"});var j=new D({title:"{i18n>transportInput}",type:"Message",content:[new T({text:"{i18n>transportInputDescription}"}),i],beginButton:new B({text:"{i18n>confirm}",type:a.Accept,press:function(){g=i.getValue();j.close();t._deleteFile(d,n,F,h,g,S);}}),endButton:new B({text:"{i18n>cancel}",press:function(){j.close();}}),afterClose:function(){j.destroy();}});this.getView().addDependent(j);j.open();}},_deleteFile:function(l,n,f,F,t,s){return b.deleteFile(l,n,f,F,t,s).then(function(){var r=sap.ui.core.UIComponent.getRouterFor(this);r.navTo("LayerContentMaster",{"layer":s,"namespace":encodeURIComponent(n)});}.bind(this));}});});