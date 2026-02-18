sap.ui.define(
  [
    "finalproject/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "finalproject/model/formatter",
  ],
  (BaseController, formatter) => {
    "use strict";

    return BaseController.extend("finalproject.controller.Main", {
      formatter: formatter,
      onInit() {},

      onOrderPress(oEvent) {
        const sId = oEvent.getSource().getBindingContext().getProperty("OrderID");
        this.getRouter().navTo("details", { orderID: sId });
      },

      onBeforeRebindTable(oEvent) {
        const mBindingParams = oEvent.getParameter("bindingParams");
        mBindingParams.parameters.expand = "Customer";
      },
      onCreateOrder() {
        this.getRouter().navTo("createOrder");
      },
    });
  }
);
