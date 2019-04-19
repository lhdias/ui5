jQuery.sap.registerPreloadedModules({
	"name": "ui5.Component-preload",
	"version": "2.0",
	"modules": {
		"ui5/Component.js": "sap.ui.define([\r\n    \"sap/ui/core/UIComponent\",\r\n    \"sap/ui/model/json/JSONModel\",\r\n    \"sap/ui/Device\"\r\n], function (UIComponent, JSONModel, Device) {\r\n    \"use strict\";\r\n\r\n    return UIComponent.extend(\"ui5.Component\", {\r\n\r\n        metadata: {\r\n            manifest: \"json\"\r\n        },\r\n  \r\n\r\n        init: function () {\r\n            jQuery.sap.require(\"sap.m.MessageBox\");\r\n            jQuery.sap.require(\"sap.m.MessageToast\");\r\n\r\n            var oModel = new JSONModel(Device);\r\n            oModel.setDefaultBindingMode(\"OneWay\");\r\n\r\n            this.setModel(oModel, \"device\");\r\n\r\n            UIComponent.prototype.init.apply(this, arguments);\r\n\r\n            this.getRouter().initialize();\r\n\r\n        },\r\n      \r\n        destroy: function () {\r\n            UIComponent.prototype.destroy.apply(this, arguments);\r\n        }\r\n\r\n     \r\n    });\r\n\r\n});",
		"ui5/controller/App.controller.js": "sap.ui.define([\r\n   \"sap/ui/core/mvc/Controller\"\r\n], function (Controller) {\r\n   \"use strict\";\r\n        return Controller.extend(\"ui5.controller.App\", {\r\n     \r\n      \r\n   });\r\n});",
		"ui5/controller/NotFound.controller.js": "sap.ui.define([\r\n   \"sap/ui/core/mvc/Controller\"\r\n], function (Controller) {\r\n   \"use strict\";\r\n   return Controller.extend(\"ui5.controller.NotFound\", {\r\n      onInit: function () {\r\n      }\r\n   });\r\n});",
		"ui5/controller/Overview.controller.js": "sap.ui.define([\r\n    \"sap/ui/core/mvc/Controller\",\r\n    \"sap/ui/core/routing/History\"\r\n], function (Controller, History) {\r\n    \"use strict\";\r\n\r\n        return Controller.extend(\"ui5.controller.Overview\", {\r\n\r\n        onInit: function () {\r\n            this.getView().addStyleClass(\"sapUiSizeCompact\"); // make everything inside this View appear in Compact mode\r\n\r\n            //this.getView().bindElement(\"/Books\");\r\n\r\n        },\r\n\r\n        onErrorCall: function (oError) {\r\n            if (oError.statusCode === 500 || oError.statusCode === 400 || oError.statusCode === \"500\" || oError.statusCode === \"400\") {\r\n                var errorRes = JSON.parse(oError.responseText);\r\n                if (!errorRes.error.innererror) {\r\n                    sap.m.MessageBox.alert(errorRes.error.message.value);\r\n                } else {\r\n                    if (!errorRes.error.innererror.message) {\r\n                        sap.m.MessageBox.alert(errorRes.error.innererror.toString());\r\n                    } else {\r\n                        sap.m.MessageBox.alert(errorRes.error.innererror.message);\r\n                    }\r\n                }\r\n                return;\r\n            } else {\r\n                sap.m.MessageBox.alert(oError.response.statusText);\r\n                return;\r\n            }\r\n\r\n        },\r\n        /**The following methods could be added to a reusable base controller\r\n                 * Convenience method for accessing the router in every controller of the application.\r\n                 * @public\r\n                 * @returns {sap.ui.core.routing.Router} the router for this component\r\n                 */\r\n        getRouter: function () {\r\n            return this.getOwnerComponent().getRouter();\r\n        },\r\n\r\n        /**\r\n         * Convenience method for getting the view model by name in every controller of the application.\r\n         * @public\r\n         * @param {string} sName the model name\r\n         * @returns {sap.ui.model.Model} the model instance\r\n         */\r\n        getModel: function (sName) {\r\n            return this.getView().getModel(sName);\r\n        },\r\n\r\n        /**\r\n         * Convenience method for setting the view model in every controller of the application.\r\n         * @public\r\n         * @param {sap.ui.model.Model} oModel the model instance\r\n         * @param {string} sName the model name\r\n         * @returns {sap.ui.mvc.View} the view instance\r\n         */\r\n        setModel: function (oModel, sName) {\r\n            return this.getView().setModel(oModel, sName);\r\n        },\r\n\r\n\r\n        /**\r\n         * Event handler for navigating back.\r\n         * It there is a history entry we go one step back in the browser history\r\n         * If not, it will replace the current entry of the browser history with the master route.\r\n         * @public\r\n         */\r\n        onNavBack: function () {\r\n            var sPreviousHash = History.getInstance().getPreviousHash();\r\n\r\n            if (sPreviousHash !== undefined) {\r\n                history.go(-1);\r\n            } else {\r\n                this.getRouter().navTo(\"master\", {}, true);\r\n            }\r\n        }\r\n\r\n    });\r\n\r\n       \r\n});",
		"ui5/view/App.view.xml": "<mvc:View\r\n   controllerName=\"ui5.controller.App\"\r\n   xmlns=\"sap.m\"\r\n   xmlns:core=\"sap.ui.core\"\r\n   xmlns:mvc=\"sap.ui.core.mvc\"\r\n   displayBlock=\"true\">\r\n   <App id=\"app\"/>\r\n</mvc:View>",
		"ui5/view/NotFound.view.xml": "<mvc:View\r\n   controllerName=\"ui5.Controllers.NotFound\"\r\n   xmlns=\"sap.m\"\r\n   xmlns:mvc=\"sap.ui.core.mvc\">\r\n   <MessagePage\r\n      title=\"{i18n>NotFound}\"\r\n      text=\"{i18n>NotFound.text}\"\r\n      description=\"{i18n>NotFound.description}\"/>\r\n</mvc:View>",
		"ui5/view/Overview.view.xml": "<core:View xmlns=\"sap.m\" \r\n           xmlns:mvc=\"sap.ui.core.mvc\" \r\n           xmlns:u=\"sap.ui.unified\" \r\n           xmlns:core=\"sap.ui.core\"\r\n           xmlns:smartFilterBar=\"sap.ui.comp.smartfilterbar\"\r\n\t         xmlns:smartTable=\"sap.ui.comp.smarttable\" \r\n           controllerName=\"ui5.controller.Overview\">\r\n  <u:Shell id=\"myShell\">\r\n      <u:content>\r\n        <smartFilterBar:SmartFilterBar\r\n            id=\"smartFilterBar\"\r\n            entityType=\"Book\"\r\n            persistencyKey=\"SmartFilterPKey\">\r\n          <smartFilterBar:controlConfiguration>\r\n            <smartFilterBar:ControlConfiguration\r\n              key=\"Id\" visibleInAdvancedArea=\"true\"\r\n              preventInitialDataFetchInValueHelpDialog=\"false\">\r\n            </smartFilterBar:ControlConfiguration>\r\n          </smartFilterBar:controlConfiguration>\r\n        </smartFilterBar:SmartFilterBar>\r\n        <smartTable:SmartTable\r\n          id=\"oTable\"\r\n          header=\"Test List\"\r\n          editable=\"false\"\r\n          entitySet=\"Books\"\r\n          showRowCount=\"true\"\r\n          enableAutoBinding=\"true\"\r\n          showFullScreenButton=\"true\"\r\n          useVariantManagement=\"true\"\r\n          useTablePersonalisation=\"true\"\r\n          persistencyKey=\"SmartTablePKey\"\r\n          tableType=\"ResponsiveTable\" >\r\n          <smartTable:layoutData>\r\n            <FlexItemData growFactor=\"1\" baseSize=\"0%\"/>\r\n          </smartTable:layoutData>\r\n        </smartTable:SmartTable>\r\n      </u:content>\r\n  </u:Shell>\r\n</core:View>\r\n"
	}
});