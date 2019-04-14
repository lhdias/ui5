/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/Device','sap/ui/base/Object','sap/ui/core/ValueStateSupport','sap/ui/core/Popup','sap/ui/core/library',"sap/ui/thirdparty/jquery","sap/ui/dom/jquery/Aria"],function(D,B,V,P,c,q){"use strict";var a=c.ValueState;var b=B.extend("sap.m.delegate.ValueState",{constructor:function(C){B.apply(this,arguments);this._oControl=C;this._oPopup=null;}});b.prototype.open=function(){var C=this._oControl,p=this.getPopup(),m=this.createDom(),d=P.Dock,$=q(C.getDomRefForValueStateMessage());if(!C||!p||!m){return;}p.setContent(m);p.close(0);if(p.getContent()){p.getContent().style.maxWidth=C.getDomRef().offsetWidth+"px";}else{p.getContent().style.maxWidth="";}p.open(this.getOpenDuration(),d.BeginTop,d.BeginBottom,C.getDomRefForValueStateMessage(),null,null,D.system.phone?true:P.CLOSE_ON_SCROLL);var e=q(m);if($.offset().top<e.offset().top){e.addClass("sapMValueStateMessageBottom");}else{e.addClass("sapMValueStateMessageTop");}q(C.getFocusDomRef()).addAriaDescribedBy(this.getId());};b.prototype.close=function(){var C=this._oControl,p=this.getPopup();if(p){p.close(0);}if(C){q(C.getFocusDomRef()).removeAriaDescribedBy(this.getId());}};b.prototype.getId=function(){var C=this._oControl;if(!C){return"";}return(typeof C.getValueStateMessageId==="function")?C.getValueStateMessageId():C.getId()+"-message";};b.prototype.getOpenDuration=function(){var C=this._oControl;if(!C){return 0;}return(C.iOpenMessagePopupDuration===undefined)?0:C.iOpenMessagePopupDuration;};b.prototype.createPopup=function(i){i=i||this.getId();if(this._oPopup){return this._oPopup;}this._oPopup=new P(document.createElement("span"),false,false,false);this._oPopup.attachClosed(function(){q(document.getElementById(i)).remove();});this._oPopup.attachOpened(function(){var d=this._oPopup.getContent();if(d&&this._oControl){d.style.zIndex=this._getCorrectZIndex();}}.bind(this));return this._oPopup;};b.prototype.getPopup=function(){if(!this._oControl){return null;}return this.createPopup();};b.prototype.createDom=function(){var C=this._oControl;if(!C){return null;}var s=C.getValueState(),t=C.getValueStateText()||V.getAdditionalText(C),d="sapMValueStateMessage sapMValueStateMessage"+s,r=sap.ui.getCore().getLibraryResourceBundle("sap.m");if(s===a.Success||s===a.None){d="sapUiInvisibleText";t="";}var i=this.getId();var m=document.createElement("div");m.id=i;m.className=d;m.setAttribute("role","tooltip");m.setAttribute("aria-live","assertive");var A=document.createElement("span");A.id=i+"hidden";var I=D.browser.msie;if(I){A.className="sapUiHidden";A.setAttribute("aria-hidden","true");}else{A.className="sapUiPseudoInvisibleText";}if(s!==a.None){A.appendChild(document.createTextNode(r.getText("INPUTBASE_VALUE_STATE_"+s.toUpperCase())));}var T=document.createElement("span");T.id=i+"-text";if(!C.isA('sap.m.Select')&&I){T.setAttribute("aria-hidden","true");}T.appendChild(document.createTextNode(t));m.appendChild(A);m.appendChild(T);return m;};b.prototype.destroy=function(){if(this._oPopup){this._oPopup.destroy();this._oPopup=null;}this._oControl=null;};b.prototype._getCorrectZIndex=function(){var p=this._oControl.$().parents().filter(function(){var z=q(this).css('z-index');return z&&z!=='auto'&&z!=='0';});if(!p.length){return 1;}return parseInt(p.first().css('z-index'))+1;};return b;});
