sap.ui.define(
  [
    "finalproject/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "finalproject/model/formatter",
  ],
  function (BaseController, JSONModel, MessageToast, MessageBox, formatter) {
    "use strict";

    return BaseController.extend("finalproject.controller.Details", {
      formatter: formatter,
      onInit() {
        const oViewModel = new JSONModel({
          editMode: false,
        });
        this.getView().setModel(oViewModel, "view");
        this.getRouter().getRoute("details").attachPatternMatched(this._onRouteMatched, this);
      },

      _onRouteMatched(oEvent) {
        const sId = oEvent.getParameter("arguments")?.orderID;
        const oModel = this.getModel();
        this.getView().unbindElement();

        if (sId) {
          oModel.setDeferredGroups(["editOrder"]);
          oModel.setChangeGroups({
            Order: { groupId: "editOrder", single: true },
            OrderItem: { groupId: "editOrder", single: true },
          });

          this.getView().bindElement({
            path: `/Orders('${sId}')`,
            parameters: { expand: "Customer,Items,Items/Product" },
          });
          this.getModel("view").setProperty("/editMode", false);
        } else {
          oModel.setDeferredGroups(["createOrder"]);
          oModel.setChangeGroups({
            Order: { groupId: "createOrder", single: true },
            OrderItem: { groupId: "createOrder", single: true },
          });

          this._oTransientContext = oModel.createEntry("/Orders", {
            properties: {
              CustomerID: null,
              OrderDate: new Date(),
              RequiredDate: null,
              ShippedDate: null,
              Freight: 0,
              Currency: "EUR",
            },
            groupId: "createOrder",
          });
          this.getView().setBindingContext(this._oTransientContext);
          this.getModel("view").setProperty("/editMode", false);
        }
      },

      onEdit() {
        this.getModel("view").setProperty("/editMode", true);
      },
      onDelete() {
        MessageBox.confirm(this.getI18nText("deleteConfirmMsg"), {
          actions: [MessageBox.Action.YES, MessageBox.Action.NO],
          onClose: (sAction) => {
            if (sAction === MessageBox.Action.YES) {
              this._deleteOrder();
            }
          },
        });
      },

      onSave() {
        if (!this._validateOrder()) {
          return;
        }
        this.getModel().submitChanges({
          groupId: "editOrder",
          success: () => {
            MessageToast.show(this.getI18nText("orderUpdatedMsg"));
            this.onNavBack();
          },
          error: () => MessageToast.show(this.getI18nText("orderUpdateFailedMsg")),
        });
      },
      onCancel() {
        this.onNavBack();
      },

      onCreateOrder() {
        if (!this._validateOrder()) {
          return;
        }
        const oModel = this.getModel();

        oModel.submitChanges({
          groupId: "createOrder",
          success: () => {
            MessageToast.show(this.getI18nText("orderCreatedMsg"));
            this.onNavBack();
          },
          error: () => {
            MessageToast.show(this.getI18nText("orderCreateFailedMsg"));
          },
        });
      },

      onAddProduct() {
        const oTable = this._getProductsTable();
        const oBinding = oTable.getBinding("items");

        oBinding.create({
          ProductID: "1",
          Quantity: 1,
        });
      },

      onNavBack() {
        const bEditMode = this.getModel("view").getProperty("/editMode");
        const oContext = this.getView().getBindingContext();

        if (bEditMode && oContext) {
          this.getModel().resetChanges([oContext.getPath()]);
        }

        this.getModel("view").setProperty("/editMode", false);
        this.getRouter().navTo("main");
      },

      _validateOrder() {
        const oContext = this._oTransientContext || this.getView().getBindingContext();
        if (!oContext) {
          return false;
        }

        const vCustomer = oContext.getProperty("CustomerID");
        const vOrderDate = oContext.getProperty("OrderDate");
        const vRequiredDate = oContext.getProperty("RequiredDate");

        this.byId("customerSelect").setValueState(vCustomer ? "None" : "Error");
        this.byId("orderDatePicker").setValueState(vOrderDate ? "None" : "Error");
        this.byId("requiredDatePicker").setValueState(vRequiredDate ? "None" : "Error");

        return !!vCustomer && !!vOrderDate && !!vRequiredDate;
      },

      _deleteOrder() {
        const oContext = this.getView().getBindingContext();
        if (!oContext) return;

        oContext
          .delete()
          .then(() => {
            MessageToast.show(this.getI18nText("orderDeletedMsg"));
            this.getRouter().navTo("main");
          })
          .catch(() => {
            MessageToast.show(this.getI18nText("orderDeleteFailedMsg"));
          });
        oContext.getModel().submitChanges();
      },

      _getProductsTable() {
        return this.byId("productsTable");
      },
    });
  }
);
