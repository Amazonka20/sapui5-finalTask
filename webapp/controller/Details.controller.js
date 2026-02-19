sap.ui.define(
  [
    "finalproject/controller/BaseController",
    "finalproject/model/formatter",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
  ],
  function (BaseController, formatter, MessageToast, MessageBox, JSONModel) {
    "use strict";

    return BaseController.extend("finalproject.controller.Details", {
      formatter: formatter,
      onInit() {
        const oViewModel = new JSONModel({
          editMode: false,
        });

        this.getRouter().getRoute("details").attachPatternMatched(this._onRouteMatched, this);
        this.getView().setModel(oViewModel, "view");
      },

      _onRouteMatched(oEvent) {
        const sId = oEvent.getParameter("arguments").orderID;
        this.getView().bindElement({
          path: `/Orders('${sId}')`,
          parameters: { expand: "Customer,Items,Items/Product" },
        });
        this.getModel("view").setProperty("/editMode", false);
      },

      onEdit() {
        this.getModel("view").setProperty("/editMode", true);
      },
      onCancel() {
        this.getModel().resetChanges();
        this.getModel("view").setProperty("/editMode", false);
      },
      onSave() {
        this.getModel().submitChanges({
          success: () => {
            MessageToast.show("Order updated.");
            this.getView().getModel("view").setProperty("/editMode", false);
          },
          error: () => {
            MessageToast.show("Update failed.");
          },
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
