/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./library","sap/ui/core/Control","sap/m/ScrollBar","sap/ui/core/ResizeHandler","sap/ui/core/delegate/ScrollEnablement","sap/ui/Device","sap/f/DynamicPageTitle","./DynamicPageRenderer","sap/base/Log","sap/ui/dom/getScrollbarSize","sap/ui/core/library"],function(l,C,S,R,a,D,b,c,L,g,d){"use strict";var e=C.extend("sap.f.DynamicPage",{metadata:{library:"sap.f",properties:{preserveHeaderStateOnScroll:{type:"boolean",group:"Behavior",defaultValue:false},headerExpanded:{type:"boolean",group:"Behavior",defaultValue:true},toggleHeaderOnTitleClick:{type:"boolean",group:"Behavior",defaultValue:true},showFooter:{type:"boolean",group:"Behavior",defaultValue:false},fitContent:{type:"boolean",group:"Behavior",defaultValue:false}},aggregations:{title:{type:"sap.f.DynamicPageTitle",multiple:false},header:{type:"sap.f.DynamicPageHeader",multiple:false},content:{type:"sap.ui.core.Control",multiple:false},footer:{type:"sap.m.IBar",multiple:false},landmarkInfo:{type:"sap.f.DynamicPageAccessibleLandmarkInfo",multiple:false},_scrollBar:{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"}},dnd:{draggable:false,droppable:true},designtime:"sap/f/designtime/DynamicPage.designtime"}});function f(o){if(arguments.length===1){return o&&("length"in o)?o.length>0:!!o;}return Array.prototype.slice.call(arguments).every(function(O){return f(O);});}function h(E){var o;if(!E){return false;}o=E.getBoundingClientRect();return!!(o.width&&o.height);}var u=sap.ui.getCore().getConfiguration().getAnimation();var A=d.AccessibleLandmarkRole;e.HEADER_MAX_ALLOWED_PINNED_PERCENTAGE=0.6;e.HEADER_MAX_ALLOWED_NON_SROLLABLE_PERCENTAGE=0.6;e.HEADER_MAX_ALLOWED_NON_SROLLABLE_ON_MOBILE=0.3;e.FOOTER_ANIMATION_DURATION=350;e.BREAK_POINTS={TABLET:1024,PHONE:600};e.EVENTS={TITLE_PRESS:"_titlePress",TITLE_MOUSE_OVER:"_titleMouseOver",TITLE_MOUSE_OUT:"_titleMouseOut",PIN_UNPIN_PRESS:"_pinUnpinPress",VISUAL_INDICATOR_MOUSE_OVER:"_visualIndicatorMouseOver",VISUAL_INDICATOR_MOUSE_OUT:"_visualIndicatorMouseOut",HEADER_VISUAL_INDICATOR_PRESS:"_headerVisualIndicatorPress",TITLE_VISUAL_INDICATOR_PRESS:"_titleVisualIndicatorPress"};e.MEDIA={PHONE:"sapFDynamicPage-Std-Phone",TABLET:"sapFDynamicPage-Std-Tablet",DESKTOP:"sapFDynamicPage-Std-Desktop"};e.RESIZE_HANDLER_ID={PAGE:"_sResizeHandlerId",TITLE:"_sTitleResizeHandlerId",CONTENT:"_sContentResizeHandlerId"};e.DIV="div";e.HEADER="header";e.FOOTER="footer";e.prototype.init=function(){this._bPinned=false;this._bHeaderInTitleArea=false;this._bExpandingWithAClick=false;this._bSuppressToggleHeaderOnce=false;this._headerBiggerThanAllowedHeight=false;this._bMSBrowser=D.browser.internet_explorer||D.browser.edge||false;this._oScrollHelper=new a(this,this.getId()+"-content",{horizontal:false,vertical:true});};e.prototype.onBeforeRendering=function(){if(!this._preserveHeaderStateOnScroll()){this._attachPinPressHandler();}this._attachTitlePressHandler();this._attachVisualIndicatorsPressHandlers();this._attachVisualIndicatorMouseOverHandlers();this._attachTitleMouseOverHandlers();this._detachScrollHandler();};e.prototype.onAfterRendering=function(){var s,i;if(this._preserveHeaderStateOnScroll()){setTimeout(this._overridePreserveHeaderStateOnScroll.bind(this),0);}this._bPinned=false;this._cacheDomElements();this._detachResizeHandlers();this._attachResizeHandlers();this._updateMedia(this._getWidth(this));this._attachScrollHandler();this._updateScrollBar();this._attachPageChildrenAfterRenderingDelegates();this._resetPinButtonState();if(!this.getHeaderExpanded()){this._snapHeader(false);s=this.getHeader()&&!this.getPreserveHeaderStateOnScroll()&&this._canSnapHeaderOnScroll();if(s){i=this._getScrollBar().getScrollPosition();this._setScrollPosition(i?i:this._getSnappingHeight());}else{this._toggleHeaderVisibility(false);this._moveHeaderToTitleArea();}}this._updateToggleHeaderVisualIndicators();this._updateTitleVisualState();};e.prototype.exit=function(){this._detachResizeHandlers();if(this._oScrollHelper){this._oScrollHelper.destroy();}};e.prototype.setShowFooter=function(s){var r=this.setProperty("showFooter",s,true);this._toggleFooter(s);return r;};e.prototype.setHeaderExpanded=function(H){if(this._bPinned){return this;}if(this.getHeaderExpanded()===H){return this;}if(this.getDomRef()){this._titleExpandCollapseWhenAllowed();}this.setProperty("headerExpanded",H,true);return this;};e.prototype.setToggleHeaderOnTitleClick=function(t){var H=this.getHeaderExpanded(),r=this.setProperty("toggleHeaderOnTitleClick",t,true);t=this.getProperty("toggleHeaderOnTitleClick");this._updateTitleVisualState();this._updateToggleHeaderVisualIndicators();this._updateARIAStates(H);return r;};e.prototype.setFitContent=function(F){var r=this.setProperty("fitContent",F,true);if(f(this.$())){this._updateFitContainer();}return r;};e.prototype.getScrollDelegate=function(){return this._oScrollHelper;};e.prototype._overridePreserveHeaderStateOnScroll=function(){if(!this._shouldOverridePreserveHeaderStateOnScroll()){this._headerBiggerThanAllowedHeight=false;return;}this._headerBiggerThanAllowedHeight=true;if(this.getHeaderExpanded()){this._moveHeaderToContentArea(true);}else{this._adjustSnap();}this._updateScrollBar();};e.prototype._shouldOverridePreserveHeaderStateOnScroll=function(){return!D.system.desktop&&this._headerBiggerThanAllowedToBeFixed()&&this._preserveHeaderStateOnScroll();};e.prototype._toggleFooter=function(s){var F=this.getFooter();if(!f(this.$())){return;}if(!f(F)){return;}F.toggleStyleClass("sapFDynamicPageActualFooterControlShow",s);F.toggleStyleClass("sapFDynamicPageActualFooterControlHide",!s);this._toggleFooterSpacer(s);if(u){if(!s){this._iFooterAnimationTimeout=setTimeout(function(){this.$footerWrapper.toggleClass("sapUiHidden",!this.getShowFooter());}.bind(this),e.FOOTER_ANIMATION_DURATION);}else{if(this._iFooterAnimationTimeout){clearTimeout(this._iFooterAnimationTimeout);this._iFooterAnimationTimeout=null;}this.$footerWrapper.toggleClass("sapUiHidden",!this.getShowFooter());}setTimeout(function(){F.removeStyleClass("sapFDynamicPageActualFooterControlShow");},e.FOOTER_ANIMATION_DURATION);}this._updateScrollBar();};e.prototype._toggleFooterSpacer=function(t){var $=this.$("spacer");if(f($)){$.toggleClass("sapFDynamicPageContentWrapperSpacer",t);}if(f(this.$contentFitContainer)){this.$contentFitContainer.toggleClass("sapFDynamicPageContentFitContainerFooterVisible",t);}};e.prototype._toggleHeaderInTabChain=function(t){var o=this.getTitle(),i=this.getHeader();if(!f(o)||!f(i)){return;}i.$().css("visibility",t?"visible":"hidden");};e.prototype._snapHeader=function(i,U){var o=this.getTitle();if(this._bPinned&&!U){L.debug("DynamicPage :: aborted snapping, header is pinned",this);return;}L.debug("DynamicPage :: snapped header",this);if(this._bPinned&&U){this._unPin();this._togglePinButtonPressedState(false);}if(f(o)){o._toggleState(false,U);if(i&&this._bHeaderInTitleArea){this._moveHeaderToContentArea(true);}}if(!f(this.$titleArea)){L.warning("DynamicPage :: couldn't snap header. There's no title.",this);return;}this.setProperty("headerExpanded",false,true);if(this._hasVisibleTitleAndHeader()){this.$titleArea.addClass(D.system.phone&&o.getSnappedTitleOnMobile()?"sapFDynamicPageTitleSnappedTitleOnMobile":"sapFDynamicPageTitleSnapped");this._updateToggleHeaderVisualIndicators();this._togglePinButtonVisibility(false);}this._toggleHeaderInTabChain(false);this._updateARIAStates(false);};e.prototype._expandHeader=function(i,U){var o=this.getTitle();L.debug("DynamicPage :: expand header",this);if(f(o)){o._toggleState(true,U);if(i){this._moveHeaderToTitleArea(true);}}if(!f(this.$titleArea)){L.warning("DynamicPage :: couldn't expand header. There's no title.",this);return;}this.setProperty("headerExpanded",true,true);if(this._hasVisibleTitleAndHeader()){this.$titleArea.removeClass(D.system.phone&&o.getSnappedTitleOnMobile()?"sapFDynamicPageTitleSnappedTitleOnMobile":"sapFDynamicPageTitleSnapped");this._updateToggleHeaderVisualIndicators();if(!this.getPreserveHeaderStateOnScroll()){this._togglePinButtonVisibility(true);}}this._toggleHeaderInTabChain(true);this._updateARIAStates(true);};e.prototype._toggleHeaderVisibility=function(s,U){var E=this.getHeaderExpanded(),o=this.getTitle(),i=this.getHeader();if(this._bPinned&&!U){L.debug("DynamicPage :: header toggle aborted, header is pinned",this);return;}if(f(o)){o._toggleState(E);}if(f(i)){i.$().toggleClass("sapFDynamicPageHeaderHidden",!s);this._updateScrollBar();}};e.prototype._moveHeaderToContentArea=function(o){var i=this.getHeader();if(f(i)){i.$().prependTo(this.$wrapper);this._bHeaderInTitleArea=false;if(o){this._offsetContentOnMoveHeader();}}};e.prototype._moveHeaderToTitleArea=function(o){var i=this.getHeader();if(f(i)){i.$().appendTo(this.$titleArea);this._bHeaderInTitleArea=true;if(o){this._offsetContentOnMoveHeader();}}};e.prototype._offsetContentOnMoveHeader=function(){var o=Math.ceil(this._getHeaderHeight()),i=this._getScrollPosition(),j=this._getScrollBar().getScrollPosition(),n;if(!o){return;}if(!i&&j){n=this._getScrollBar().getScrollPosition();}else{n=this._bHeaderInTitleArea?i-o:i+o;}n=Math.max(n,0);this._setScrollPosition(n,true);};e.prototype._pin=function(){var $=this.$();if(this._bPinned){return;}this._bPinned=true;if(!this._bHeaderInTitleArea){this._moveHeaderToTitleArea(true);this._updateScrollBar();}this._updateToggleHeaderVisualIndicators();this._togglePinButtonARIAState(this._bPinned);if(f($)){$.addClass("sapFDynamicPageHeaderPinned");}};e.prototype._unPin=function(){var $=this.$();if(!this._bPinned){return;}this._bPinned=false;this._updateToggleHeaderVisualIndicators();this._togglePinButtonARIAState(this._bPinned);if(f($)){$.removeClass("sapFDynamicPageHeaderPinned");}};e.prototype._togglePinButtonVisibility=function(t){var o=this.getHeader();if(f(o)){o._setShowPinBtn(t);}};e.prototype._togglePinButtonPressedState=function(p){var o=this.getHeader();if(f(o)){o._togglePinButton(p);}};e.prototype._togglePinButtonARIAState=function(p){var o=this.getHeader();if(f(o)){o._updateARIAPinButtonState(p);}};e.prototype._resetPinButtonState=function(){if(this._preserveHeaderStateOnScroll()){this._togglePinButtonVisibility(false);}else{this._togglePinButtonPressedState(false);this._togglePinButtonARIAState(false);}};e.prototype._restorePinButtonFocus=function(){this.getHeader()._focusPinButton();};e.prototype._getScrollPosition=function(){return f(this.$wrapper)?Math.ceil(this.$wrapper.scrollTop()):0;};e.prototype._setScrollPosition=function(n,s){if(!f(this.$wrapper)){return;}if(this._getScrollPosition()===n){return;}if(s){this._bSuppressToggleHeaderOnce=true;}if(!this.getScrollDelegate()._$Container){this.getScrollDelegate()._$Container=this.$wrapper;}this.getScrollDelegate().scrollTo(0,n);};e.prototype._shouldSnapOnScroll=function(){return!this._preserveHeaderStateOnScroll()&&this._getScrollPosition()>=this._getSnappingHeight()&&this.getHeaderExpanded()&&!this._bPinned;};e.prototype._shouldExpandOnScroll=function(){var i=this._needsVerticalScrollBar();return!this._preserveHeaderStateOnScroll()&&this._getScrollPosition()<this._getSnappingHeight()&&!this.getHeaderExpanded()&&!this._bPinned&&i;};e.prototype._headerScrolledOut=function(){return this._getScrollPosition()>=this._getSnappingHeight();};e.prototype._headerSnapAllowed=function(){return!this._preserveHeaderStateOnScroll()&&this.getHeaderExpanded()&&!this._bPinned;};e.prototype._canSnapHeaderOnScroll=function(){var m=this._getMaxScrollPosition(),t=this._bMSBrowser?1:0;if(this._bHeaderInTitleArea){m+=this._getHeaderHeight();m-=t;}return m>this._getSnappingHeight();};e.prototype._getSnappingHeight=function(){return Math.ceil(this._getHeaderHeight()||this._getTitleHeight());};e.prototype._getMaxScrollPosition=function(){var $;if(f(this.$wrapper)){$=this.$wrapper[0];return $.scrollHeight-$.clientHeight;}return 0;};e.prototype._needsVerticalScrollBar=function(){var t=this._bMSBrowser?1:0;return this._getMaxScrollPosition()>t;};e.prototype._getOwnHeight=function(){return this._getHeight(this);};e.prototype._getEntireHeaderHeight=function(){var t=0,H=0,o=this.getTitle(),i=this.getHeader();if(f(o)){t=o.$().outerHeight();}if(f(i)){H=i.$().outerHeight();}return t+H;};e.prototype._headerBiggerThanAllowedToPin=function(i){if(!(typeof i==="number"&&!isNaN(parseInt(i)))){i=this._getOwnHeight();}return this._getEntireHeaderHeight()>e.HEADER_MAX_ALLOWED_PINNED_PERCENTAGE*i;};e.prototype._headerBiggerThanAllowedToBeFixed=function(){var i=this._getOwnHeight();return this._getEntireHeaderHeight()>e.HEADER_MAX_ALLOWED_NON_SROLLABLE_PERCENTAGE*i;};e.prototype._headerBiggerThanAllowedToBeExpandedInTitleArea=function(){var E=this._getEntireHeaderHeight(),i=this._getOwnHeight();if(i===0){return false;}return D.system.phone?E>=e.HEADER_MAX_ALLOWED_NON_SROLLABLE_ON_MOBILE*i:E>=i;};e.prototype._measureScrollBarOffsetHeight=function(){var H=0,s=!this.getHeaderExpanded(),i=this._bHeaderInTitleArea;if(this._preserveHeaderStateOnScroll()||this._bPinned||(!s&&this._bHeaderInTitleArea)){H=this._getTitleAreaHeight();L.debug("DynamicPage :: preserveHeaderState is enabled or header pinned :: title area height"+H,this);return H;}if(s||!f(this.getTitle())||!this._canSnapHeaderOnScroll()){H=this._getTitleHeight();L.debug("DynamicPage :: header snapped :: title height "+H,this);return H;}this._snapHeader(true);H=this._getTitleHeight();if(!s){this._expandHeader(i);}L.debug("DynamicPage :: snapped mode :: title height "+H,this);return H;};e.prototype._updateScrollBar=function(){var s,i,n;if(!D.system.desktop||!f(this.$wrapper)||(this._getHeight(this)===0)){return;}s=this._getScrollBar();s.setContentSize(this._measureScrollBarOffsetHeight()+this.$wrapper[0].scrollHeight+"px");i=this._needsVerticalScrollBar();n=this.bHasScrollbar!==i;if(n){s.toggleStyleClass("sapUiHidden",!i);this.toggleStyleClass("sapFDynamicPageWithScroll",i);this.bHasScrollbar=i;}setTimeout(this._updateFitContainer.bind(this),0);setTimeout(this._updateScrollBarOffset.bind(this),0);};e.prototype._updateFitContainer=function(n){var N=typeof n!=='undefined'?!n:!this._needsVerticalScrollBar(),F=this.getFitContent(),t=F||N;this.$contentFitContainer.toggleClass("sapFDynamicPageContentFitContainer",t);};e.prototype._updateScrollBarOffset=function(){var s=sap.ui.getCore().getConfiguration().getRTL()?"left":"right",o=this._needsVerticalScrollBar()?g().width+"px":0,F=this.getFooter();this.$titleArea.css("padding-"+s,o);if(f(F)){F.$().css(s,o);}};e.prototype._updateHeaderARIAState=function(E){var o=this.getHeader();if(f(o)){o._updateARIAState(E);}};e.prototype._updateTitleARIAState=function(E){var o=this.getTitle();if(f(o)){o._updateARIAState(E);}};e.prototype._updateARIAStates=function(E){this._updateHeaderARIAState(E);this._updateTitleARIAState(E);};e.prototype._updateMedia=function(w){if(w<=e.BREAK_POINTS.PHONE){this._updateMediaStyle(e.MEDIA.PHONE);}else if(w<=e.BREAK_POINTS.TABLET){this._updateMediaStyle(e.MEDIA.TABLET);}else{this._updateMediaStyle(e.MEDIA.DESKTOP);}};e.prototype._updateMediaStyle=function(s){Object.keys(e.MEDIA).forEach(function(m){var E=s===e.MEDIA[m];this.toggleStyleClass(e.MEDIA[m],E);},this);};e.prototype._toggleExpandVisualIndicator=function(t){var o=this.getTitle();if(f(o)){o._toggleExpandButton(t);}};e.prototype._focusExpandVisualIndicator=function(){var o=this.getTitle();if(f(o)){o._focusExpandButton();}};e.prototype._toggleCollapseVisualIndicator=function(t){var o=this.getHeader();if(f(o)){o._toggleCollapseButton(t);}};e.prototype._focusCollapseVisualIndicator=function(){var o=this.getHeader();if(f(o)){o._focusCollapseButton();}};e.prototype._updateToggleHeaderVisualIndicators=function(){var H,i,E,j=this._hasVisibleTitleAndHeader();if(!this.getToggleHeaderOnTitleClick()||!j){i=false;E=false;}else{H=this.getHeaderExpanded();i=H;E=D.system.phone&&this.getTitle().getAggregation("snappedTitleOnMobile")?false:!H;}this._toggleCollapseVisualIndicator(i);this._toggleExpandVisualIndicator(E);};e.prototype._updateTitleVisualState=function(){var t=this.getTitle(),T=this._hasVisibleTitleAndHeader()&&this.getToggleHeaderOnTitleClick();this.$().toggleClass("sapFDynamicPageTitleClickEnabled",T&&!D.system.phone);if(f(t)){t._toggleFocusableState(T);}};e.prototype._scrollBellowCollapseVisualIndicator=function(){var H=this.getHeader(),$,i,v,o;if(f(H)){$=this.getHeader()._getCollapseButton().getDomRef();i=$.getBoundingClientRect().height;v=this.$wrapper[0].getBoundingClientRect().height;o=$.offsetTop+i-v;this._setScrollPosition(o);}};e.prototype._hasVisibleTitleAndHeader=function(){var t=this.getTitle(),H=this.getHeader();return f(t)&&t.getVisible()&&f(H)&&H.getVisible()&&f(H.getContent());};e.prototype._getHeight=function(o){var $;if(!(o instanceof C)){return 0;}$=o.getDomRef();return $?$.getBoundingClientRect().height:0;};e.prototype._getWidth=function(o){return!(o instanceof C)?0:o.$().outerWidth()||0;};e.prototype._getTitleAreaHeight=function(){return f(this.$titleArea)?this.$titleArea.outerHeight()||0:0;};e.prototype._getTitleHeight=function(){return this._getHeight(this.getTitle());};e.prototype._getHeaderHeight=function(){return this._getHeight(this.getHeader());};e.prototype._preserveHeaderStateOnScroll=function(){return this.getPreserveHeaderStateOnScroll()&&!this._headerBiggerThanAllowedHeight;};e.prototype._getScrollBar=function(){if(!f(this.getAggregation("_scrollBar"))){var v=new S(this.getId()+"-vertSB",{scrollPosition:0,scroll:this._onScrollBarScroll.bind(this)});this.setAggregation("_scrollBar",v,true);}return this.getAggregation("_scrollBar");};e.prototype._cacheDomElements=function(){var F=this.getFooter();if(f(F)){this.$footer=F.$();this.$footerWrapper=this.$("footerWrapper");}this.$wrapper=this.$("contentWrapper");this.$contentFitContainer=this.$("contentFitContainer");this.$titleArea=this.$("header");this._cacheTitleDom();};e.prototype._cacheTitleDom=function(){var t=this.getTitle();if(f(t)){this.$title=t.$();}};e.prototype._adjustSnap=function(){var o,i,j,I,$=this.$();if(!f($)){return;}if(!h($[0])){return;}o=this.getHeader();i=!this.getHeaderExpanded();if(!o||!i){return;}j=!this._preserveHeaderStateOnScroll()&&this._canSnapHeaderOnScroll();I=i&&o.$().hasClass("sapFDynamicPageHeaderHidden");if(j&&I){this._toggleHeaderVisibility(true);this._moveHeaderToContentArea(true);}else if(!j&&!I){this._moveHeaderToTitleArea(true);this._toggleHeaderVisibility(false);}};e.prototype.ontouchmove=function(E){E.setMarked();};e.prototype._onChildControlAfterRendering=function(E){if(E.srcControl instanceof b){this._cacheTitleDom();this._deRegisterResizeHandler(e.RESIZE_HANDLER_ID.TITLE);this._registerResizeHandler(e.RESIZE_HANDLER_ID.TITLE,this.$title[0],this._onChildControlsHeightChange.bind(this));}setTimeout(this._updateScrollBar.bind(this),0);};e.prototype._onChildControlsHeightChange=function(){var n=this._needsVerticalScrollBar();if(n){this._updateFitContainer(n);}this._adjustSnap();if(!this._bExpandingWithAClick){this._updateScrollBar();}this._bExpandingWithAClick=false;};e.prototype._onResize=function(E){var o=this.getTitle(),i=this.getHeader(),j=E.size.width;if(!this._preserveHeaderStateOnScroll()&&i){if(this._headerBiggerThanAllowedToPin(E.size.height)||D.system.phone){this._unPin();this._togglePinButtonVisibility(false);this._togglePinButtonPressedState(false);}else{this._togglePinButtonVisibility(true);}if(this.getHeaderExpanded()&&this._bHeaderInTitleArea&&this._headerBiggerThanAllowedToBeExpandedInTitleArea()){this._expandHeader(false);this._setScrollPosition(0);}}if(f(o)){o._onResize(j);}this._adjustSnap();this._updateScrollBar();this._updateMedia(j);};e.prototype._onWrapperScroll=function(E){var s=Math.max(E.target.scrollTop,0);if(D.system.desktop){if(this.allowCustomScroll===true){this.allowCustomScroll=false;return;}this.allowInnerDiv=true;this._getScrollBar().setScrollPosition(s);this.toggleStyleClass("sapFDynamicPageWithScroll",this._needsVerticalScrollBar());}};e.prototype._toggleHeaderOnScroll=function(){if(this._bSuppressToggleHeaderOnce){this._bSuppressToggleHeaderOnce=false;return;}if(D.system.desktop&&this._bExpandingWithAClick){return;}if(this._preserveHeaderStateOnScroll()){return;}if(this._shouldSnapOnScroll()){this._snapHeader(true,true);}else if(this._shouldExpandOnScroll()){this._expandHeader(false,true);this._toggleHeaderVisibility(true);}else if(!this._bPinned&&this._bHeaderInTitleArea){var i=(this._getScrollPosition()>=this._getSnappingHeight());this._moveHeaderToContentArea(i);}};e.prototype._onScrollBarScroll=function(){if(this.allowInnerDiv===true){this.allowInnerDiv=false;return;}this.allowCustomScroll=true;this._setScrollPosition(this._getScrollBar().getScrollPosition());};e.prototype._onTitlePress=function(){if(this.getToggleHeaderOnTitleClick()&&this._hasVisibleTitleAndHeader()){this._titleExpandCollapseWhenAllowed(true);this.getTitle()._focus();}};e.prototype._onExpandHeaderVisualIndicatorPress=function(){this._onTitlePress();if(this._headerBiggerThanAllowedToBeExpandedInTitleArea()){this._scrollBellowCollapseVisualIndicator();}this._focusCollapseVisualIndicator();};e.prototype._onCollapseHeaderVisualIndicatorPress=function(){this._onTitlePress();this._focusExpandVisualIndicator();};e.prototype._onVisualIndicatorMouseOver=function(){var $=this.$();if(f($)){$.addClass("sapFDynamicPageTitleForceHovered");}};e.prototype._onVisualIndicatorMouseOut=function(){var $=this.$();if(f($)){$.removeClass("sapFDynamicPageTitleForceHovered");}};e.prototype._onTitleMouseOver=e.prototype._onVisualIndicatorMouseOver;e.prototype._onTitleMouseOut=e.prototype._onVisualIndicatorMouseOut;e.prototype._titleExpandCollapseWhenAllowed=function(U){var i;if(this._bPinned&&!U){return this;}if(this._preserveHeaderStateOnScroll()||!this._canSnapHeaderOnScroll()||!this.getHeader()){if(!this.getHeaderExpanded()){this._expandHeader(false,U);this._toggleHeaderVisibility(true,U);}else{this._snapHeader(false,U);this._toggleHeaderVisibility(false,U);}}else if(!this.getHeaderExpanded()){i=!this._headerBiggerThanAllowedToBeExpandedInTitleArea();this._bExpandingWithAClick=true;this._expandHeader(i,U);this.getHeader().$().removeClass("sapFDynamicPageHeaderHidden");if(!i){this._setScrollPosition(0);}this._bExpandingWithAClick=false;}else{var m=this._bHeaderInTitleArea;this._snapHeader(m,U);if(!m){this._setScrollPosition(this._getSnappingHeight());}}};e.prototype._onPinUnpinButtonPress=function(){if(this._bPinned){this._unPin();}else{this._pin();this._restorePinButtonFocus();}};e.prototype._attachResizeHandlers=function(){var i=this._onChildControlsHeightChange.bind(this);this._registerResizeHandler(e.RESIZE_HANDLER_ID.PAGE,this,this._onResize.bind(this));if(f(this.$title)){this._registerResizeHandler(e.RESIZE_HANDLER_ID.TITLE,this.$title[0],i);}if(f(this.$contentFitContainer)){this._registerResizeHandler(e.RESIZE_HANDLER_ID.CONTENT,this.$contentFitContainer[0],i);}};e.prototype._registerResizeHandler=function(H,o,i){if(!this[H]){this[H]=R.register(o,i);}};e.prototype._detachResizeHandlers=function(){this._deRegisterResizeHandler(e.RESIZE_HANDLER_ID.PAGE);this._deRegisterResizeHandler(e.RESIZE_HANDLER_ID.TITLE);this._deRegisterResizeHandler(e.RESIZE_HANDLER_ID.CONTENT);};e.prototype._deRegisterResizeHandler=function(H){if(this[H]){R.deregister(this[H]);this[H]=null;}};e.prototype._attachPageChildrenAfterRenderingDelegates=function(){var t=this.getTitle(),H=this.getHeader(),o=this.getContent(),p={onAfterRendering:this._onChildControlAfterRendering.bind(this)};if(f(t)){t.addEventDelegate(p);}if(f(o)){o.addEventDelegate(p);}if(f(H)){H.addEventDelegate(p);}};e.prototype._attachTitlePressHandler=function(){var t=this.getTitle();if(f(t)&&!this._bAlreadyAttachedTitlePressHandler){t.attachEvent(e.EVENTS.TITLE_PRESS,this._onTitlePress,this);this._bAlreadyAttachedTitlePressHandler=true;}};e.prototype._attachPinPressHandler=function(){var H=this.getHeader();if(f(H)&&!this._bAlreadyAttachedPinPressHandler){H.attachEvent(e.EVENTS.PIN_UNPIN_PRESS,this._onPinUnpinButtonPress,this);this._bAlreadyAttachedPinPressHandler=true;}};e.prototype._attachVisualIndicatorsPressHandlers=function(){var t=this.getTitle(),H=this.getHeader();if(f(t)&&!this._bAlreadyAttachedTitleIndicatorPressHandler){t.attachEvent(e.EVENTS.TITLE_VISUAL_INDICATOR_PRESS,this._onExpandHeaderVisualIndicatorPress,this);this._bAlreadyAttachedTitleIndicatorPressHandler=true;}if(f(H)&&!this._bAlreadyAttachedHeaderIndicatorPressHandler){H.attachEvent(e.EVENTS.HEADER_VISUAL_INDICATOR_PRESS,this._onCollapseHeaderVisualIndicatorPress,this);this._bAlreadyAttachedHeaderIndicatorPressHandler=true;}};e.prototype._attachVisualIndicatorMouseOverHandlers=function(){var H=this.getHeader();if(f(H)&&!this._bAlreadyAttachedVisualIndicatorMouseOverOutHandler){H.attachEvent(e.EVENTS.VISUAL_INDICATOR_MOUSE_OVER,this._onVisualIndicatorMouseOver,this);H.attachEvent(e.EVENTS.VISUAL_INDICATOR_MOUSE_OUT,this._onVisualIndicatorMouseOut,this);this._bAlreadyAttachedVisualIndicatorMouseOverOutHandler=true;}};e.prototype._attachTitleMouseOverHandlers=function(){var t=this.getTitle();if(f(t)&&!this._bAlreadyAttachedTitleMouseOverOutHandler){t.attachEvent(e.EVENTS.TITLE_MOUSE_OVER,this._onTitleMouseOver,this);t.attachEvent(e.EVENTS.TITLE_MOUSE_OUT,this._onTitleMouseOut,this);this._bAlreadyAttachedTitleMouseOverOutHandler=true;}};e.prototype._attachScrollHandler=function(){this._onWrapperScrollReference=this._onWrapperScroll.bind(this);this._toggleHeaderOnScrollReference=this._toggleHeaderOnScroll.bind(this);this.$wrapper.on("scroll",this._onWrapperScrollReference);this.$wrapper.on("scroll",this._toggleHeaderOnScrollReference);};e.prototype._detachScrollHandler=function(){if(this.$wrapper){this.$wrapper.off("scroll",this._onWrapperScrollReference);this.$wrapper.off("scroll",this._toggleHeaderOnScrollReference);}};e.prototype._formatLandmarkInfo=function(o,p){if(o){var r=o["get"+p+"Role"]()||"",s=o["get"+p+"Label"]()||"";if(r===A.None){r='';}return{role:r.toLowerCase(),label:s};}return{};};e.prototype._getHeaderTag=function(o){if(o&&o.getHeaderRole()!==A.None){return e.DIV;}return e.HEADER;};e.prototype._getFooterTag=function(o){if(o&&o.getFooterRole()!==A.None){return e.DIV;}return e.FOOTER;};return e;});
