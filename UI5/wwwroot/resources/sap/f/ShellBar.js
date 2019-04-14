/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Control","./shellBar/Factory","./shellBar/AdditionalContentSupport","./shellBar/ResponsiveHandler","./shellBar/Accessibility","./ShellBarRenderer"],function(C,F,A,R,a){"use strict";var S=C.extend("sap.f.ShellBar",{metadata:{library:"sap.f",interfaces:["sap.f.IShellBar"],properties:{title:{type:"string",group:"Appearance",defaultValue:""},secondTitle:{type:"string",group:"Appearance",defaultValue:""},homeIcon:{type:"sap.ui.core.URI",group:"Appearance",defaultValue:""},showMenuButton:{type:"boolean",group:"Appearance",defaultValue:false},showNavButton:{type:"boolean",group:"Appearance",defaultValue:false},showCopilot:{type:"boolean",group:"Appearance",defaultValue:false},showSearch:{type:"boolean",group:"Appearance",defaultValue:false},showNotifications:{type:"boolean",group:"Appearance",defaultValue:false},showProductSwitcher:{type:"boolean",group:"Appearance",defaultValue:false},notificationsNumber:{type:"string",group:"Appearance",defaultValue:""}},aggregations:{menu:{type:"sap.m.Menu",multiple:false,forwarding:{getter:"_getMenu",aggregation:"menu"}},profile:{type:"sap.f.Avatar",multiple:false,forwarding:{getter:"_getProfile",aggregation:"avatar"}},additionalContent:{type:"sap.f.IShellBar",multiple:true,singularName:"additionalContent"},_overflowToolbar:{type:"sap.m.OverflowToolbar",multiple:false,visibility:"hidden"}},events:{homeIconPressed:{parameters:{icon:{type:"sap.m.Image"}}},menuButtonPressed:{parameters:{button:{type:"sap.m.Button"}}},navButtonPressed:{parameters:{button:{type:"sap.m.Button"}}},copilotPressed:{parameters:{image:{type:"sap.m.Image"}}},searchButtonPressed:{parameters:{button:{type:"sap.m.Button"}}},notificationsPressed:{parameters:{button:{type:"sap.m.Button"}}},productSwitcherPressed:{parameters:{button:{type:"sap.m.Button"}}},avatarPressed:{parameters:{avatar:{type:"sap.f.Avatar"}}}}}});A.apply(S.prototype);S.prototype.init=function(){this._oFactory=new F(this);this._bOTBUpdateNeeded=true;this._oOverflowToolbar=this._oFactory.getOverflowToolbar();this.setAggregation("_overflowToolbar",this._oOverflowToolbar);this._oToolbarSpacer=this._oFactory.getToolbarSpacer();this._oControlSpacer=this._oFactory.getControlSpacer();this._oResponsiveHandler=new R(this);this._aOverflowControls=[];this._oAcc=new a(this);};S.prototype.onBeforeRendering=function(){var n=this.getNotificationsNumber();this._assignControlsToOverflowToolbar();if(this.getShowNotifications()&&n!==undefined){this._updateNotificationsIndicators(n);}};S.prototype.exit=function(){this._oResponsiveHandler.exit();this._oFactory.destroy();this._oAcc.exit();};S.prototype.setHomeIcon=function(s){if(s){if(!this._oHomeIcon){this._oHomeIcon=this._oFactory.getHomeIcon();}this._oHomeIcon.setSrc(s);}else{this._oHomeIcon=null;}this._bOTBUpdateNeeded=true;return this.setProperty("homeIcon",s);};S.prototype.setTitle=function(t){this._sTitle=t;if(t){if(!this._oMegaMenu){this._oMegaMenu=this._oMegaMenu=this._oFactory.getMegaMenu();}this._oMegaMenu.setText(t);}else{this._oMegaMenu=null;}this._bOTBUpdateNeeded=true;return this.setProperty("title",t);};S.prototype.setSecondTitle=function(t){if(t){if(!this._oSecondTitle){this._oSecondTitle=this._oFactory.getSecondTitle();}this._oSecondTitle.setText(t);}else{this._oSecondTitle=null;}this._bOTBUpdateNeeded=true;return this.setProperty("secondTitle",t);};S.prototype.setShowCopilot=function(s){if(s){if(!this._oCopilot){this._oCopilot=this._oFactory.getCopilot();}}else{this._oCopilot=null;}this._bOTBUpdateNeeded=true;return this.setProperty("showCopilot",s);};S.prototype.setShowSearch=function(s){if(s){if(!this._oSearch){this._oSearch=this._oFactory.getSearch();}}else{this._oSearch=null;}this._bOTBUpdateNeeded=true;return this.setProperty("showSearch",s);};S.prototype.setShowNotifications=function(s){if(s){if(!this._oNotifications){this._oNotifications=this._oFactory.getNotifications();}}else{this._oNotifications=null;}this._bOTBUpdateNeeded=true;return this.setProperty("showNotifications",s);};S.prototype.setShowProductSwitcher=function(s){if(s){if(!this._oProductSwitcher){this._oProductSwitcher=this._oFactory.getProductSwitcher();}}else{this._oProductSwitcher=null;}this._bOTBUpdateNeeded=true;return this.setProperty("showProductSwitcher",s);};S.prototype.setShowNavButton=function(s){if(s){if(!this._oNavButton){this._oNavButton=this._oFactory.getNavButton();}}else{this._oNavButton=null;}this._bOTBUpdateNeeded=true;return this.setProperty("showNavButton",s);};S.prototype.setShowMenuButton=function(s){if(s){if(!this._oMenuButton){this._oMenuButton=this._oFactory.getMenuButton();}}else{this._oMenuButton=null;}this._bOTBUpdateNeeded=true;return this.setProperty("showMenuButton",s);};S.prototype.setNotificationsNumber=function(n){if(this.getShowNotifications()&&n!==undefined){this._updateNotificationsIndicators(n);this._oAcc.updateNotificationsNumber(n);}return this.setProperty("notificationsNumber",n,true);};S.prototype._assignControlsToOverflowToolbar=function(){var b;if(!this._oOverflowToolbar){return;}if(!this._bOTBUpdateNeeded){return;}this._aOverflowControls=[];this._oOverflowToolbar.removeAllContent();if(this._oNavButton){this._oOverflowToolbar.addContent(this._oNavButton);}if(this._oMenuButton){this._oOverflowToolbar.addContent(this._oMenuButton);}if(this._oHomeIcon){this._oOverflowToolbar.addContent(this._oHomeIcon);}if(this._oMegaMenu){this._oOverflowToolbar.addContent(this._oMegaMenu);}if(this._oSecondTitle){this._oOverflowToolbar.addContent(this._oSecondTitle);}if(this._oControlSpacer){this._oOverflowToolbar.addContent(this._oControlSpacer);}if(this._oCopilot){this._oOverflowToolbar.addContent(this._oCopilot);}this._oOverflowToolbar.addContent(this._oToolbarSpacer);if(this._oSearch){this._oOverflowToolbar.addContent(this._oSearch);this._aOverflowControls.push(this._oSearch);}if(this._oNotifications){this._oOverflowToolbar.addContent(this._oNotifications);this._aOverflowControls.push(this._oNotifications);}b=this.getAdditionalContent();if(b){b.forEach(function(c){this._oOverflowToolbar.addContent(c);this._aOverflowControls.push(c);}.bind(this));}if(this._oAvatarButton){this._oOverflowToolbar.addContent(this._oAvatarButton);}if(this._oProductSwitcher){this._oOverflowToolbar.addContent(this._oProductSwitcher);this._aOverflowControls.push(this._oProductSwitcher);}this._bOTBUpdateNeeded=false;};S.prototype._updateNotificationsIndicators=function(n){this._oOverflowToolbar._getOverflowButton().data("notifications",n,true);this._oNotifications.data("notifications",n,true);};S.prototype._getProfile=function(){this._oAvatarButton=this._oFactory.getAvatarButton();return this._oAvatarButton;};S.prototype._getMenu=function(){if(!this._oMegaMenu){this._oMegaMenu=this._oFactory.getMegaMenu();}return this._oMegaMenu;};S.prototype._getOverflowToolbar=function(){return this._oOverflowToolbar;};return S;},true);
