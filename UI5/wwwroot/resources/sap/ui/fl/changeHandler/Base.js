/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(function(){"use strict";var B={};B.setTextInChange=function(c,k,t,T){if(!c.texts){c.texts={};}if(!c.texts[k]){c.texts[k]={};}c.texts[k].value=t;c.texts[k].type=T;};B.markAsNotApplicable=function(n,a){var r={message:n};if(!a){throw r;}return Promise.reject(r);};return B;},true);
