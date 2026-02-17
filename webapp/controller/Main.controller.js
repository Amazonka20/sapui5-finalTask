sap.ui.define(
  [
    "finalproject/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "finalproject/model/formatter",
  ],
  (BaseController, JSONModel, Filter, FilterOperator, formatter) => {
    "use strict";

    return BaseController.extend("finalproject.controller.Main", {
      formatter: formatter,
      onInit() {
        const oUI = new JSONModel({
          selectedFilterKey: "",
        });
        this.getView().setModel(oUI, "view");
      },

      onPress(oEvent) {
        const sId = oEvent.getSource().getBindingContext().getProperty("OrderID");
        this.getRouter().navTo("details", { orderID: sId });
      },
      onFilter() {
        const oBindingList = this.byId("orderList").getBinding("items");
        const iCustomerId = this.getModel("view").getProperty("/selectedFilterKey");

        const oFilter = new Filter("CustomerID", FilterOperator.EQ, iCustomerId);
        if (iCustomerId) {
          oBindingList.filter([oFilter]);
        } else {
          oBindingList.filter([]);
        }
      },
    });
  }
);
