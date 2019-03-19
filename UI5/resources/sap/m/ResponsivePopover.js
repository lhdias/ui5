/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./Dialog','./Popover','./library','sap/ui/core/Control','sap/ui/core/IconPool','sap/ui/base/ManagedObject','sap/ui/Device','./ResponsivePopoverRenderer',"sap/ui/thirdparty/jquery"],function(D,P,l,C,I,M,a,R,q){"use strict";var b=l.DialogType;var c=l.PlacementType;var d=C.extend("sap.m.ResponsivePopover",{metadata:{library:"sap.m",properties:{placement:{type:"sap.m.PlacementType",group:"Misc",defaultValue:c.Right},showHeader:{type:"boolean",group:"Misc",defaultValue:true},title:{type:"string",group:"Misc",defaultValue:null},icon:{type:"sap.ui.core.URI",group:"Misc",defaultValue:null},modal:{type:"boolean",group:"Misc",defaultValue:null},offsetX:{type:"int",group:"Misc",defaultValue:null},offsetY:{type:"int",group:"Misc",defaultValue:null},showArrow:{type:"boolean",group:"Appearance",defaultValue:true},contentWidth:{type:"sap.ui.core.CSSSize",group:"Misc",defaultValue:null},contentHeight:{type:"sap.ui.core.CSSSize",group:"Misc",defaultValue:null},horizontalScrolling:{type:"boolean",group:"Misc",defaultValue:true},verticalScrolling:{type:"boolean",group:"Misc",defaultValue:true},showCloseButton:{type:"boolean",group:"Misc",defaultValue:true},resizable:{type:"boolean",group:"Dimension",defaultValue:false}},defaultAggregation:"content",aggregations:{content:{type:"sap.ui.core.Control",multiple:true,singularName:"content"},customHeader:{type:"sap.m.IBar",multiple:false},subHeader:{type:"sap.m.IBar",multiple:false},beginButton:{type:"sap.m.Button",multiple:false},endButton:{type:"sap.m.Button",multiple:false},_popup:{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"}},associations:{initialFocus:{type:"sap.ui.core.Control",multiple:false},ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"},ariaDescribedBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaDescribedBy"}},events:{beforeOpen:{parameters:{openBy:{type:"sap.ui.core.Control"}}},afterOpen:{parameters:{openBy:{type:"sap.ui.core.Control"}}},beforeClose:{parameters:{openBy:{type:"sap.ui.core.Control"},origin:{type:"sap.m.Button"}}},afterClose:{parameters:{openBy:{type:"sap.ui.core.Control"},origin:{type:"sap.m.Button"}}}}}});d.prototype.init=function(){var t=this;this._bAppendedToUIArea=false;var s={resizable:t.getResizable(),beforeOpen:function(e){t.fireBeforeOpen({openBy:e.getParameter('openBy')});},afterOpen:function(e){t.fireAfterOpen({openBy:e.getParameter('openBy')});},beforeClose:function(e){t.fireBeforeClose({openBy:e.getParameter('openBy'),origin:e.getParameter('origin')});},afterClose:function(e){t.fireAfterClose({openBy:e.getParameter('openBy'),origin:e.getParameter('origin')});}};if(a.system.phone){this._aNotSupportedProperties=["placement","modal","offsetX","offsetY","showCloseButton"];s.stretch=true;s.type=b.Standard;this._oControl=new D(this.getId()+"-dialog",s);}else{this._aNotSupportedProperties=["icon","showCloseButton"];this._oControl=new P(this.getId()+"-popover",s);}this.setAggregation("_popup",this._oControl);this._oControl.addStyleClass("sapMResponsivePopover");this._oDelegate={onBeforeRendering:function(){var S=this.getShowCloseButton(),h=this._oControl._getAnyHeader(),n,p,r;if(!S||!a.system.phone){this._removeCloseButton(h);return;}if(!this._bContentChanged){return;}this._bContentChanged=false;if(h){this._insertCloseButton(h);}else{n=this._getSingleNavContent();if(!n){return;}p=n.getCurrentPage();r=this._getRealPage(p);if(r&&(h=r._getAnyHeader())){this._insertCloseButton(h);}n.attachEvent("navigate",this._fnOnNavigate,this);}}};this._oPageDelegate={onAfterShow:function(){var r=t._getRealPage(this),h;if(r&&(h=r._getAnyHeader())){t._insertCloseButton(h);}}};this._fnOnNavigate=function(e){var p=e.getParameter("to");if(p){p.addEventDelegate(this._oPageDelegate,p);}};this._oControl.addEventDelegate(this._oDelegate,this);this._oControl._removeChild=function(o,A,S){var p,i;if((A==="content")&&(o instanceof sap.m.NavContainer)){p=o.getPages();for(i=0;i<p.length;i++){p[i].removeEventDelegate(t._oPageDelegate);}o.detachEvent("navigate",t._fnOnNavigate,t);}C.prototype._removeChild.apply(this,arguments);};};d.prototype.openBy=function(p){if(!this._bAppendedToUIArea&&!this.getParent()){var s=sap.ui.getCore().getStaticAreaRef();s=sap.ui.getCore().getUIArea(s);s.addContent(this,true);this._bAppendedToUIArea=true;}if(a.system.phone){return this._oControl.open();}else{return this._oControl.openBy(p);}};d.prototype.exit=function(){if(this._oCloseButton){this._oCloseButton.destroy();this._oCloseButton=null;}if(this._oControl){this._oControl.removeEventDelegate(this._oDelegate);this._oControl.destroy();this._oControl=null;}};d.prototype._getCloseButton=function(){if(!this._oCloseButton){var t=this;this._oCloseButton=new sap.m.Button(this.getId()+"-closeButton",{icon:I.getIconURI("decline"),press:function(){t._oControl._oCloseTrigger=this;t.close();}});}return this._oCloseButton;};d.prototype.addContent=function(o){this._bContentChanged=true;this.addAggregation("content",o);};d.prototype.clone=function(){var o=C.prototype.clone.apply(this,arguments),e=this.getAggregation('_popup').getContent();for(var i=0;i<e.length;i++){o.addContent(e[i].clone());}return o;};d.prototype._getSingleNavContent=function(){var e=this.getContent();while(e.length===1&&e[0]instanceof sap.ui.core.mvc.View){e=e[0].getContent();}if(e.length===1&&e[0]instanceof sap.m.NavContainer){return e[0];}else{return null;}};d.prototype._getRealPage=function(p){var r=p,e;while(r){if(r instanceof sap.m.Page){return r;}if(r instanceof sap.ui.core.mvc.View){e=r.getContent();if(e.length===1){r=e[0];continue;}}r=null;}return r;};d.prototype._insertCloseButton=function(h){var o=this._getCloseButton(),i;if(h&&h.addContentRight){i=h.getAggregation("contentRight",[]).length;h.insertAggregation("contentRight",o,i);}};d.prototype._removeCloseButton=function(h){var o=this._getCloseButton();if(h){h.removeAggregation("contentRight",o);}};d.prototype._firstLetterUpperCase=function(v){return v.charAt(0).toUpperCase()+v.slice(1);};d.prototype._lastIndexOfUpperCaseLetter=function(v){var i,s;for(i=v.length-1;i>=0;i--){s=v.charAt(i);if(s===s.toUpperCase()){return i;}}return-1;};d.prototype._oldSetProperty=d.prototype.setProperty;d.prototype.setProperty=function(p,v,s){this._oldSetProperty(p,v,true);var S="set"+this._firstLetterUpperCase(p);if(this._aNotSupportedProperties.indexOf(p)===-1&&S in this._oControl){this._oControl[S](v);}return this;};d.prototype._oldSetModel=d.prototype.setModel;d.prototype.setModel=function(m,n){this._oControl.setModel(m,n);return this._oldSetModel(m,n);};d.prototype._createButtonFooter=function(){if(this._oFooter){return this._oFooter;}this._oFooter=new sap.m.Toolbar(this.getId()+"-footer",{content:[new sap.m.ToolbarSpacer()]});return this._oFooter;};d.prototype._setButton=function(p,B){if(this._oControl instanceof P){var g="get"+this._firstLetterUpperCase(p)+"Button",o=this[g](),f=this._createButtonFooter(),s="_o"+this._firstLetterUpperCase(p)+"Button",i=(p.toLowerCase()==="begin"?0:1),O=(p.toLowerCase()==="begin"?"getEndButton":"getBeginButton");if(o){f.removeContent(o);}if(B){if(!f.getParent()){this._oControl.setFooter(f);}f.insertContent(B,i+1);}else{var e=this[O]();if(!e){f.destroy();this._oFooter=null;}}this[s]=B;return this;}else{var A=p.toLowerCase()+"Button";return this.setAggregation(A,B);}};d.prototype._getButton=function(p){if(this._oControl instanceof P){var s="_o"+this._firstLetterUpperCase(p)+"Button";return this[s];}else{var g="get"+this._firstLetterUpperCase(p)+"Button";return this._oControl[g]();}};d.prototype.setBeginButton=function(B){this._oControl.setBeginButton(B);return this._setButton("begin",B);};d.prototype.setEndButton=function(B){this._oControl.setEndButton(B);return this._setButton("end",B);};d.prototype.setShowCloseButton=function(s){var h=this._oControl._getAnyHeader();if(s){this._insertCloseButton(h);}else{this._removeCloseButton(h);}this.setProperty("showCloseButton",s,true);return this;};d.prototype.getBeginButton=function(){return this._getButton("begin");};d.prototype.getEndButton=function(){return this._getButton("end");};["bindAggregation","validateAggregation","setAggregation","getAggregation","indexOfAggregation","insertAggregation","addAggregation","removeAggregation","removeAllAggregation","destroyAggregation","setAssociation","getAssociation","addAssociation","removeAssociation","removeAllAssociation"].forEach(function(n){d.prototype[n]=function(){var L=this._lastIndexOfUpperCaseLetter(n),m,r;if(q.type(arguments[0])==="string"){if(L!==-1){m=n.substring(0,L)+this._firstLetterUpperCase(arguments[0]);if(this._oControl&&this._oControl[m]){r=this._oControl[m].apply(this._oControl,Array.prototype.slice.call(arguments,1));return r===this._oControl?this:r;}else{return C.prototype[n].apply(this,arguments);}}}r=this._oControl[n].apply(this._oControl,arguments);return r===this._oControl?this:r;};});["invalidate","close","isOpen","addStyleClass","removeStyleClass","toggleStyleClass","hasStyleClass","getDomRef","setBusy","getBusy","setBusyIndicatorDelay","getBusyIndicatorDelay","addEventDelegate"].forEach(function(n){d.prototype[n]=function(){if(this._oControl&&this._oControl[n]){if(n==="invalidate"&&arguments[0]===this._oControl){return C.prototype.invalidate.apply(this,arguments);}var r=this._oControl[n].apply(this._oControl,arguments);return r===this._oControl?this:r;}};});d.prototype._applyContextualSettings=function(){M.prototype._applyContextualSettings.call(this,M._defaultContextualSettings);};return d;});