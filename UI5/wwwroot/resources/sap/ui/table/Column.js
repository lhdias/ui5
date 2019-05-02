/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/core/Element','sap/ui/core/library','sap/ui/core/Popup','sap/ui/model/Filter','sap/ui/model/FilterOperator','sap/ui/model/FilterType','sap/ui/model/Sorter','sap/ui/model/Type','sap/ui/model/type/String','./TableUtils','./library','./ColumnMenu','sap/base/util/ObjectPath',"sap/base/util/JSTokenizer","sap/base/Log","sap/ui/thirdparty/jquery"],function(E,c,P,F,a,b,S,T,d,f,g,C,O,J,L,q){"use strict";var H=c.HorizontalAlign,h=g.SortOrder,V=c.ValueState;var j=E.extend("sap.ui.table.Column",{metadata:{library:"sap.ui.table",properties:{width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},minWidth:{type:"int",group:"Dimension",defaultValue:0},flexible:{type:"boolean",group:"Behavior",defaultValue:true,deprecated:true},resizable:{type:"boolean",group:"Behavior",defaultValue:true},hAlign:{type:"sap.ui.core.HorizontalAlign",group:"Appearance",defaultValue:H.Begin},sorted:{type:"boolean",group:"Appearance",defaultValue:false},sortOrder:{type:"sap.ui.table.SortOrder",group:"Appearance",defaultValue:h.Ascending},sortProperty:{type:"string",group:"Behavior",defaultValue:null},filtered:{type:"boolean",group:"Appearance",defaultValue:false},filterProperty:{type:"string",group:"Behavior",defaultValue:null},filterValue:{type:"string",group:"Behavior",defaultValue:null},filterOperator:{type:"string",group:"Behavior",defaultValue:null},defaultFilterOperator:{type:"string",group:"Behavior",defaultValue:null},filterType:{type:"any",group:"Misc",defaultValue:null},grouped:{type:"boolean",group:"Appearance",defaultValue:false},visible:{type:"boolean",group:"Appearance",defaultValue:true},name:{type:"string",group:"Appearance",defaultValue:null},showFilterMenuEntry:{type:"boolean",group:"Appearance",defaultValue:true},showSortMenuEntry:{type:"boolean",group:"Appearance",defaultValue:true},headerSpan:{type:"any",group:"Behavior",defaultValue:1},autoResizable:{type:"boolean",group:"Behavior",defaultValue:false}},defaultAggregation:"label",aggregations:{label:{type:"sap.ui.core.Control",altTypes:["string"],multiple:false},multiLabels:{type:"sap.ui.core.Control",multiple:true,singularName:"multiLabel"},template:{type:"sap.ui.core.Control",altTypes:["string"],multiple:false},menu:{type:"sap.ui.unified.Menu",multiple:false}},events:{columnMenuOpen:{allowPreventDefault:true,parameters:{menu:{type:"sap.ui.unified.Menu"}}}}}});j._DEFAULT_FILTER_TYPE=new d();j.prototype.init=function(){this._oSorter=null;this.mSkipPropagation={template:true};this._aTemplateClones=[];};j.prototype.exit=function(){this._destroyTemplateClones();C._destroyColumnVisibilityMenuItem(this.oParent);};j.prototype.setParent=function(p,A,s){C._destroyColumnVisibilityMenuItem(this.oParent);var r=E.prototype.setParent.apply(this,arguments);var m=this.getAggregation("menu");if(m&&typeof m._updateReferences==="function"){m._updateReferences(this);}return r;};j.prototype.invalidate=function(o){if(o!==this.getTemplate()&&!f.isA(o,"sap.ui.table.ColumnMenu")){E.prototype.invalidate.apply(this,arguments);}};j.prototype.setLabel=function(l){var o=l;if(typeof(l)==="string"){o=g.TableHelper.createLabel({text:l});}this.setAggregation("label",o);return this;};j.prototype.setTemplate=function(t){var o=t;if(typeof(t)==="string"){o=g.TableHelper.createTextView().bindProperty("text",t);}this.setAggregation("template",o);this.invalidate();this._destroyTemplateClones();var e=this.getParent();if(e&&e.invalidateRowsAggregation&&this.getVisible()==true){e.invalidateRowsAggregation();}return this;};j.prototype.getMenu=function(){var m=this.getAggregation("menu");if(!m){m=this._createMenu();this.setMenu(m);}return m;};j.prototype.invalidateMenu=function(){var m=this.getAggregation("menu");if(this._bMenuIsColumnMenu){m._invalidate();}};j.prototype._menuHasItems=function(){var m=this.getAggregation("menu");var t=this.getParent();var M=function(){return(this.isSortableByMenu()||this.isFilterableByMenu()||this.isGroupable()||(t&&t.getEnableColumnFreeze())||(t&&t.getShowColumnVisibilityMenu()));}.bind(this);return!!((m&&m.getItems().length>0)||M());};j.prototype.isFilterableByMenu=function(){return!!(this.getFilterProperty()&&this.getShowFilterMenuEntry());};j.prototype.isSortableByMenu=function(){return!!(this.getSortProperty()&&this.getShowSortMenuEntry());};j.prototype.isGroupable=function(){var t=this.getParent();return!!(t&&t.getEnableGrouping&&t.getEnableGrouping()&&this.getSortProperty());};j.prototype.setMenu=function(m){this.setAggregation("menu",m,true);this._bMenuIsColumnMenu=f.isA(m,"sap.ui.table.ColumnMenu");return this;};j.prototype._createMenu=function(){if(!this._defaultMenu){this._defaultMenu=new C(this.getId()+"-menu",{ariaLabelledBy:this});}return this._defaultMenu;};j.prototype.setSortProperty=function(v){this.setProperty("sortProperty",v);this.invalidateMenu();return this;};j.prototype.setSorted=function(e){this.setProperty("sorted",e,true);this._updateIcons();return this;};j.prototype.setSortOrder=function(t){this.setProperty("sortOrder",t,true);this._updateIcons();return this;};j.prototype.setFilterProperty=function(v){this.invalidateMenu();return this.setProperty("filterProperty",v);};j.prototype.setFiltered=function(e){this.setProperty("filtered",e,true);this._updateIcons();return this;};j.prototype.setFilterValue=function(v){this.setProperty("filterValue",v,true);var m=this.getMenu();if(this._bMenuIsColumnMenu){m._setFilterValue(v);}return this;};j.prototype.setFilterOperator=function(v){return this.setProperty("filterOperator",v,true);};j.prototype._openMenu=function(D,w){var m=this.getMenu();var e=this.fireColumnMenuOpen({menu:m});if(e){var i=P.Dock;var o=D;if(!D){D=this.getDomRef();o=this.getFocusDomRef();}m.open(!!w,o,i.BeginTop,i.BeginBottom,D,"none none");}};j.prototype.toggleSort=function(){this.sort(this.getSorted()&&this.getSortOrder()===h.Ascending);};j.prototype.sort=function(D,A){var t=this.getParent();if(t){t.pushSortedColumn(this,A);var n=D?h.Descending:h.Ascending;var e=t.fireSort({column:this,sortOrder:n,columnAdded:A});if(e){var s=t.getSortedColumns();var k=t.getColumns();for(var i=0,l=k.length;i<l;i++){if(s.indexOf(k[i])<0){k[i].setProperty("sorted",false,true);k[i].setProperty("sortOrder",h.Ascending,true);k[i]._updateIcons();delete k[i]._oSorter;}}this.setProperty("sorted",true,true);this.setProperty("sortOrder",n,true);this._oSorter=new S(this.getSortProperty(),this.getSortOrder()===h.Descending);var m=[];for(var i=0,l=s.length;i<l;i++){s[i]._updateIcons();m.push(s[i]._oSorter);}var B=t.getBinding("rows");if(B){if(this._updateTableAnalyticalInfo){this._updateTableAnalyticalInfo(true);}B.sort(m);}else{L.warning("Sorting not performed because no binding present",this);}}}return this;};j.prototype._updateIcons=function(){var t=this.getParent(),s=this.getSorted(),e=this.getFiltered();if(!t||!t.getDomRef()){return;}this.$().parents(".sapUiTableCHT").find('td[data-sap-ui-colindex="'+this.getIndex()+'"]:not([colspan]):not(.sapUiTableHidden):first').toggleClass("sapUiTableColFiltered",e).toggleClass("sapUiTableColSorted",s).toggleClass("sapUiTableColSortedD",s&&this.getSortOrder()===h.Descending);t._getAccExtension().updateAriaStateOfColumn(this);t._resetColumnHeaderHeights();t._updateRowHeights(t._collectRowHeights(true),true);};j.prototype._renderSortIcon=function(){this._updateIcons();};j.prototype._getFilter=function(){var o,p=this.getFilterProperty(),v=this.getFilterValue(),s=this.getFilterOperator(),e,i,t=this.getFilterType()||j._DEFAULT_FILTER_TYPE,I=t instanceof d,B;if(v){if(!s){B=v.match(/(.*)\s*\.\.\s*(.*)/);if(v.indexOf("=")==0){s=a.EQ;e=v.substr(1);}else if(v.indexOf("!=")==0){s=a.NE;e=v.substr(2);}else if(v.indexOf("<=")==0){s=a.LE;e=v.substr(2);}else if(v.indexOf("<")==0){s=a.LT;e=v.substr(1);}else if(v.indexOf(">=")==0){s=a.GE;e=v.substr(2);}else if(v.indexOf(">")==0){s=a.GT;e=v.substr(1);}else if(B){if(B[1]&&B[2]){s=a.BT;e=B[1];i=B[2];}else if(B[1]&&!B[2]){s=a.GE;e=B[1];}else{s=a.LE;e=B[2];}}else if(I&&v.indexOf("*")==0&&v.lastIndexOf("*")==v.length-1){s=a.Contains;e=v.substr(1,v.length-2);}else if(I&&v.indexOf("*")==0){s=a.EndsWith;e=v.substr(1);}else if(I&&v.lastIndexOf("*")==v.length-1){s=a.StartsWith;e=v.substr(0,v.length-1);}else{if(this.getDefaultFilterOperator()){s=this.getDefaultFilterOperator();}else{if(I){s=a.Contains;}else{s=a.EQ;}}e=v.substr(0);}if(!i){o=new F(p,s,this._parseFilterValue(e));}else{o=new F(p,s,this._parseFilterValue(e),this._parseFilterValue(i));}}else{o=new F(p,s,this._parseFilterValue(v));}}return o;};j.prototype.filter=function(v){var t=this.getParent();if(t&&t.isBound("rows")){var k=t.fireFilter({column:this,value:v});if(k){this.setProperty("filtered",!!v,true);this.setProperty("filterValue",v,true);var m=this.getMenu();if(this._bMenuIsColumnMenu){m._setFilterValue(v);}var n=[];var o=t.getColumns();for(var i=0,l=o.length;i<l;i++){var p=o[i],r;m=p.getMenu();try{r=p._getFilter();if(p._bMenuIsColumnMenu){m._setFilterState(V.None);}}catch(e){if(p._bMenuIsColumnMenu){m._setFilterState(V.Error);}continue;}if(r){n.push(r);}}t.getBinding("rows").filter(n,b.Control);this._updateIcons();}}return this;};j.prototype._parseFilterValue=function(v){var o=this.getFilterType();if(o){if(q.isFunction(o)){v=o(v);}else{v=o.parseValue(v,"string");}}return v;};j.prototype._restoreIcons=function(){this._updateIcons();};j.prototype.shouldRender=function(){return this.getVisible()&&!this.getGrouped()&&this.getTemplate()!=null;};j.PROPERTIES_FOR_ROW_INVALIDATION={visible:true,flexible:true,headerSpan:true};j.prototype.setProperty=function(n,v){var t=this.getParent();if(t&&t.invalidateRowsAggregation&&this.getProperty(n)!=v&&j.PROPERTIES_FOR_ROW_INVALIDATION[n]&&(this.getVisible()||n=="visible")){t.invalidateRowsAggregation();}return E.prototype.setProperty.apply(this,arguments);};j.prototype.setFilterType=function(t){var o=t;if(typeof(t)==="string"){try{var m=J.parseJS(t);if(typeof(m.type)==="string"){var e=O.get(m.type);o=e&&new e(m.formatOptions,m.constraints);}}catch(i){var e=O.get(t);o=e&&new e();}if(!(o instanceof T)){L.error("The filter type is not an instance of sap.ui.model.Type! Ignoring the filter type!");o=undefined;}}this.setProperty("filterType",o,true);return this;};j.prototype.getIndex=function(){var t=this.getParent();if(t){return t.indexOfColumn(this);}else{return-1;}};j.prototype._getFreeTemplateClone=function(){var o=null;for(var i=0;i<this._aTemplateClones.length;i++){if(!this._aTemplateClones[i]||this._aTemplateClones[i].bIsDestroyed){this._aTemplateClones.splice(i,1);i--;}else if(!o&&!this._aTemplateClones[i].getParent()){o=this._aTemplateClones[i];}}return o;};j.prototype.getTemplateClone=function(i){if(i==null){return null;}var o=this._getFreeTemplateClone();if(!o){var t=this.getTemplate();if(t){o=t.clone();this._aTemplateClones.push(o);}}if(o){o.data("sap-ui-colindex",i);o.data("sap-ui-colid",this.getId());var e=this.getParent();if(e){e._getAccExtension().addColumnHeaderLabel(this,o);}}return o;};j.prototype._destroyTemplateClones=function(){for(var i=0;i<this._aTemplateClones.length;i++){if(this._aTemplateClones[i]!=null&&!this._aTemplateClones[i].bIsDestroyed){this._aTemplateClones[i].destroy();}}this._aTemplateClones=[];};j.prototype._closeMenu=function(){var m=this.getAggregation("menu");if(m){m.close();}};j.prototype.setVisible=function(v){this.setProperty("visible",v);C._updateVisibilityIcon(this.getParent(),this.getIndex(),v);};return j;});
