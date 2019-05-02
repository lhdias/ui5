/*
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/model/SelectionModel','./SelectionPlugin','../library'],function(S,a,l){"use strict";var b=l.SelectionMode;var c=a.extend("sap.ui.table.plugins.SelectionModelPlugin",{metadata:{events:{selectionChange:{parameters:{indices:{type:"int[]"},selectAll:{type:"boolean"}}}}}});c.prototype.init=function(){this.oSelectionModel=new S(this._getSelectionMode);this.oSelectionModel.attachEvent("selectionChanged",this._onSelectionChange,this);a.prototype.init.call(this);};c.prototype.exit=function(){var B=this._getBinding();if(B){B.detachEvent("change",this._onBindingChange);}if(this.oSelectionModel){this.oSelectionModel.destroy();this.oSelectionModel=null;}a.prototype.exit.call(this);};c.prototype.addSelectionInterval=function(i,I){if(!this.oSelectionModel||this._getSelectionMode()===b.None){return;}this.oSelectionModel.addSelectionInterval(i,I);};c.prototype.clearSelection=function(){if(this.oSelectionModel){this.oSelectionModel.clearSelection();}};c.prototype.getSelectedIndex=function(){if(this.oSelectionModel){return this.oSelectionModel.getLeadSelectedIndex();}return-1;};c.prototype.getSelectedIndices=function(){if(this.oSelectionModel){return this.oSelectionModel.getSelectedIndices();}return[];};c.prototype.getSelectableCount=function(){var B=this._getBinding();return B?B.getLength():0;};c.prototype.getSelectedCount=function(){return this.getSelectedIndices().length;};c.prototype.isIndexSelectable=function(i){var C=this._getLastIndex();return i>=0&&i<=C;};c.prototype.isIndexSelected=function(i){return this.getSelectedIndices().indexOf(i)!==-1;};c.prototype.removeSelectionInterval=function(i,I){if(this.oSelectionModel){this.oSelectionModel.removeSelectionInterval(i,I);}};c.prototype.selectAll=function(){if(!this.oSelectionModel||this._getSelectionMode()===b.None){return;}this.oSelectionModel.selectAll(this._getLastIndex());};c.prototype.setSelectedIndex=function(i){if(this._getSelectionMode()===b.None){return;}if(i===-1){this.clearSelection();}else{this.setSelectionInterval(i,i);}};c.prototype.setSelectionInterval=function(i,I){if(!this.oSelectionModel||this._getSelectionMode()===b.None){return;}this.oSelectionModel.setSelectionInterval(i,I);};c.prototype.setSelectionMode=function(s){var o=this._getSelectionMode();a.prototype._setSelectionMode.apply(this,arguments);if(this._getSelectionMode()!==o){this.clearSelection();}if(this.oSelectionModel){var i=(s===b.MultiToggle?S.MULTI_SELECTION:S.SINGLE_SELECTION);this.oSelectionModel.setSelectionMode(i);}return this;};c.prototype._getLastIndex=function(){if(!this._getBinding()){return 0;}return this._getBinding().getLength()-1;};c.prototype._onSelectionChange=function(e){var r=e.getParameter("rowIndices");var s=e.getParameter("selectAll");this.fireSelectionChange({rowIndices:r,selectAll:s});};c.prototype._setBinding=function(B){var C=this._getBinding();a.prototype._setBinding.call(this,B);if(C!==B){this._suspend();this.clearSelection();this._resume();if(B){B.attachEvent("change",this._onBindingChange,this);}if(C){C.detachEvent("change",this._onBindingChange);}}};c.prototype._onBindingChange=function(e){var r=typeof(e)==="object"?e.getParameter("reason"):e;if(r==="sort"||r==="filter"){this.clearSelection();}};return c;});
