/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([
	"sap/ui/base/EventProvider",
	"sap/base/Log"
], function (
	EventProvider,
	Log
) {
	"use strict";

	/**
	 * Constructor for a new <code>ServiceManager</code>.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * Parses an object and decides which services needs to be instantiated
	 * and handles their lifecycle.
	 * It also provides instances of the services by getService method.
	 *
	 * mServiceFactoryReferences object format:
	 *
	 *	"services": {
	 *		"Navigation": {
	 *			"factoryName": "demoapp.demoappservices.SampleNavigationFactory"
	 *		},
	 *		"SomeOtherService": {
	 *			"factoryName": "demoapp.demoappservices.SomeOtherServiceFactory"
	 * 		}
	 *	}
	 *
	 * @extends sap.ui.base.EventProvider
	 *
	 * @author SAP SE
	 * @version 1.64.0
	 *
	 * @constructor
	 * @param {Object} mServiceFactoryReferences A map with service descriptions.
	 * @param {Object} oServiceContext A context to be used for newly created service instances.
	 * @private
	 * @alias sap.ui.integration.util.ServiceManager
	 */
	var ServiceManager = EventProvider.extend("sap.ui.integration.util.ServiceManager", {
		metadata: {
			library: "sap.ui.integration"
		},
		constructor: function (mServiceFactoryReferences, oServiceContext) {
			if (!mServiceFactoryReferences) {
				throw new Error("Missing manifest services reference!");
			}
			if (!oServiceContext) {
				throw new Error("Missing context object");
			}
			this._mServiceFactoryReferences = mServiceFactoryReferences;
			this._mServices = {};
			this._oServiceContext = oServiceContext;
		}
	});

	/**
	 * Registers a service which can then be available by getService(sServiceName).
	 * @param {string|Object} vService The name of the service or a service configuration object.
	 * @param {Object} sInterface The interface of the service.
	 * @returns {Promise} A promise resolved when the service instance is ready.
	 */
	ServiceManager.prototype.registerService = function (vService, sInterface) {
		var sName = vService.name || vService,
			oServiceRef;

		if (!this._mServices[sInterface]) {
			this._mServices[sInterface] = {};
		}

		oServiceRef = this._mServices[sInterface][sName];

		if (!oServiceRef) {
			oServiceRef = {};
			oServiceRef.promise = ServiceManager._getService(this._oServiceContext, sName, this._mServiceFactoryReferences)
				.then(function (oServiceInstance) {
					oServiceRef.instance = oServiceInstance;
				}).catch(function (oError) {
					Log.error(oError.message);
				});

			this._mServices[sInterface][sName] = oServiceRef;

			return oServiceRef.promise;
		}

		return oServiceRef.promise;
	};

	/**
	 * Returns an instance of a service based on interface.
	 * If multiple services with the same interface are registered the first one will be used.
	 * @param {string} sServiceInterface The interface of the service to return an instance for.
	 * @param {string} [sServiceName] The name of the service inside sap.ui5/services. If not passed the first registered service will be returned.
	 * @returns {Promise} A promise resolved when the service instance is ready.
	 */
	ServiceManager.prototype.getService = function (sServiceInterface, sServiceName) {
		return new Promise(function (fnResolve, fnReject) {

			if (!sServiceInterface
				|| !this._mServices[sServiceInterface]
				|| !Object.keys(this._mServices[sServiceInterface])) {
				return Promise.reject(new Error("Invalid service"));
			}

			if (!sServiceName) {
				sServiceName = Object.keys(this._mServices[sServiceInterface])[0];
			}

			this._mServices[sServiceInterface][sServiceName].promise.then(function () {
				fnResolve(this._mServices[sServiceInterface][sServiceName].instance);
			}.bind(this)).catch(fnReject);
		}.bind(this));
	};

	ServiceManager.prototype.destroy = function () {
		this._mServices = null;
	};

	// Copied from Component.js
	// Creates an instance of a service based on the manifest settings
	ServiceManager._getService = function (oInstance, sName, mServices) {
		return new Promise(function (fnResolve, fnReject) {
			var oServiceEntry,
				sFactory;
			if (oInstance.bIsDestroyed) {
				return Promise.reject(new Error("Service " + sName + " could not be loaded as the requestor " + oInstance.getMetadata().getName() + " was destroyed."));
			}
			if (!mServices) {
				return Promise.reject(new Error("No Services declared"));
			} else {
				oServiceEntry = mServices[sName];
			}
			if (!oServiceEntry || !oServiceEntry.factoryName) {
				return Promise.reject(new Error("No Service '" + sName + "' declared or factoryName missing"));
			} else {
				sFactory = oServiceEntry.factoryName;
			}
			sap.ui.require(["sap/ui/core/service/ServiceFactoryRegistry"], function (ServiceFactoryRegistry) {
				// lookup the factory in the registry
				var oServiceFactory = ServiceFactoryRegistry.get(sFactory);
				if (oServiceFactory) {
					// create a new Service instance with the current Component as context
					oServiceFactory.createInstance({
						scopeObject: oInstance,
						scopeType: "component",
						settings: oServiceEntry.settings || {}
					}).then(function (oServiceInstance) {
						if (oServiceInstance.getInterface) {
							fnResolve(oServiceInstance.getInterface());
						} else {
							fnResolve(oServiceInstance);
						}
					}).catch(fnReject);
				} else {
					// the service factory could not be found in the registry
					var oError = new Error("ServiceFactory '" + sFactory + "' for Service '" + sName + "' not found in ServiceFactoryRegistry");
					oError._optional = oServiceEntry.optional;
					fnReject(oError);
				}
			});
		});
	};

	return ServiceManager;
});
