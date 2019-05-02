/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Core"],function(C){"use strict";var c;var A=function(o){if(o){c=o;c.addDelegate(this._controlDelegate,false,this);}this.oRb=C.getLibraryResourceBundle("sap.f");};A.prototype._controlDelegate={onBeforeRendering:function(){this.attachDelegates();}};A.prototype.attachDelegates=function(){this._oDelegateSecondTitle={onAfterRendering:this.onAfterRenderingSecondTitle};this._oDelegateSearch={onAfterRendering:this.onAfterRenderingSearch};this._oDelegateNotifications={onAfterRendering:this.onAfterRenderingNotifications};this._oDelegateAvatar={onAfterRendering:this.onAfterRenderingAvatar};this._oDelegateProducts={onAfterRendering:this.onAfterRenderingProducts};this._oDelegateNavButton={onAfterRendering:this.onAfterRenderingNavButton};this._oDelegateMenuButton={onAfterRendering:this.onAfterRenderingMenuButton};if(c._oSecondTitle){c._oSecondTitle.addDelegate(this._oDelegateSecondTitle,false,this);}if(c._oSearch){c._oSearch.addDelegate(this._oDelegateSearch,false,this);}if(c._oNotifications){c._oNotifications.addDelegate(this._oDelegateNotifications,false,this);}if(c._oAvatarButton){c._oAvatarButton.addDelegate(this._oDelegateAvatar,false,this);}if(c._oProductSwitcher){c._oProductSwitcher.addDelegate(this._oDelegateProducts,false,this);}if(c._oNavButton){c._oNavButton.addDelegate(this._oDelegateNavButton,false,this);}if(c._oMenuButton){c._oMenuButton.addDelegate(this._oDelegateMenuButton,false,this);}};A.prototype.getRootAttributes=function(){return{role:"banner",label:this.oRb.getText("SHELLBAR_CONTAINER_LABEL")};};A.prototype.getCoPilotAttributes=function(){return{role:"button",label:this.oRb.getText("SHELLBAR_COPILOT_TOOLTIP")};};A.prototype.getEntityTooltip=function(e){return this.oRb.getText("SHELLBAR_"+e+"_TOOLTIP")||"";};A.prototype.updateNotificationsNumber=function(n){var t=this.getEntityTooltip("NOTIFICATIONS"),a=n?n+" "+t:t;c._oNotifications.setTooltip(a);c._oNotifications.$().attr("aria-label",a);};A.prototype.onAfterRenderingSecondTitle=function(){var $=c._oSecondTitle.$();$.attr("role","heading");$.attr("aria-level","2");};A.prototype.onAfterRenderingSearch=function(){c._oSearch.$().attr("aria-label",this.getEntityTooltip("SEARCH"));};A.prototype.onAfterRenderingNotifications=function(){var $=c._oNotifications.$(),t=this.getEntityTooltip("NOTIFICATIONS"),n=c._oNotifications.data("notifications"),a=n?n+" "+t:t;$.attr("aria-label",a);$.attr("aria-haspopup","dialog");};A.prototype.onAfterRenderingAvatar=function(){var $=c._oAvatarButton.$();$.attr("aria-label",this.getEntityTooltip("PROFILE"));$.attr("aria-haspopup","menu");};A.prototype.onAfterRenderingProducts=function(){var $=c._oProductSwitcher.$();$.attr("aria-label",this.getEntityTooltip("PRODUCTS"));$.attr("aria-haspopup","menu");};A.prototype.onAfterRenderingNavButton=function(){c._oNavButton.$().attr("aria-label",this.getEntityTooltip("BACK"));};A.prototype.onAfterRenderingMenuButton=function(){var $=c._oMenuButton.$();$.attr("aria-label",this.getEntityTooltip("MENU"));$.attr("aria-haspopup","menu");};A.prototype.exit=function(){if(c){c.removeDelegate(this._controlDelegate);}if(c._oSecondTitle){c._oSecondTitle.removeDelegate(this._oDelegateSecondTitle);}if(c._oSearch){c._oSearch.removeDelegate(this._oDelegateSearch);}if(c._oNotifications){c._oNotifications.removeDelegate(this._oDelegateNotifications);}if(c._oAvatarButton){c._oAvatarButton.removeDelegate(this._oDelegateAvatar);}if(c._oProductSwitcher){c._oProductSwitcher.removeDelegate(this._oDelegateProducts);}if(c._oNavButton){c._oNavButton.removeDelegate(this._oDelegateNavButton);}if(c._oMenuButton){c._oMenuButton.removeDelegate(this._oDelegateMenuButton);}};return A;});
