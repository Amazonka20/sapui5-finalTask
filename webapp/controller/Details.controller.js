sap.ui.define(
  [
    "finalproject/controller/BaseController",
    "finalproject/model/formatter",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
  ],
  function (BaseController, formatter, MessageToast, MessageBox) {
    "use strict";

    return BaseController.extend("finalproject.controller.Details", {
      formatter: formatter,
      onInit() {
        this.getRouter().getRoute("details").attachPatternMatched(this._onRouteMatched, this);
      },

      _onRouteMatched(oEvent) {
        const sId = oEvent.getParameter("arguments").orderID;
        this.getView().bindElement({
          path: `/Orders(${sId})`,
          parameters: { expand: "Customer,Items,Items/Product" },
        });
      },

      onDelete() {
        MessageBox.confirm("Delete this order?", {
          actions: [MessageBox.Action.YES, MessageBox.Action.NO],
          onClose: (sAction) => {
            if (sAction === MessageBox.Action.YES) {
              this._deleteOrder();
            }
          },
        });
      },

      onNavBack() {
        this.getRouter().navTo("main");
      },

      _deleteOrder() {
        const oContext = this.getView().getBindingContext();
        if (!oContext) return;

        oContext
          .delete()
          .then(() => {
            MessageToast.show("Order deleted successfully.");
            this.getRouter().navTo("main");
          })
          .catch(() => {
            MessageToast.show("Order deletion failed.");
          });
        oContext.getModel().submitChanges();
      },
    });
  }
);
