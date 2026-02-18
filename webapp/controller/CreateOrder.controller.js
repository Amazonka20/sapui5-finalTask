sap.ui.define(
  ["finalproject/controller/BaseController", "sap/ui/model/json/JSONModel"],
  function (BaseController, JSONModel) {
    "use strict";

    return BaseController.extend("finalproject.controller.CreateOrder", {
      onInit() {
        const oViewModel = new JSONModel({
          orderCreated: false,
        });
        this.getRouter().getRoute("createOrder").attachPatternMatched(this._onRouteMatched, this);

        this.getView().setModel(oViewModel, "view");
      },

      _onRouteMatched() {
        const oViewModel = this.getView().getModel("view");
        const oModel = this.getModel();

        oModel.setDeferredGroups(["createOrder", "createOrderItems"]);
        oViewModel.setProperty("/orderCreated", false);
        oModel.resetChanges();

        this._oTransientContext = this.getModel().createEntry("/Orders", {
          properties: {
            CustomerID: null,
            OrderDate: null,
            RequiredDate: null,
            ShippedDate: null,
            Freight: 0,
          },
          groupId: "createOrder",
        });
        this.getView().setBindingContext(this._oTransientContext);
        this._initOrderItems();
      },

      onCreateOrder() {
        if (!this._validateOrder()) {
          return;
        }
        const oModel = this.getModel();

        oModel.submitChanges({
          groupId: "createOrder",
          success: () => {
            this.getModel("view").setProperty("/orderCreated", true);
          },
          error: (oError) => {
            console.log(oError);
          },
        });
      },

      onAddItems() {
        const oModel = this.getModel();
        const oTable = this._getProductsTable();
        const iOrderId = this._oTransientContext.getProperty("OrderID");

        oTable.getItems().forEach((oRow) => {
          const oItemContext = oRow.getBindingContext("orderItem");
          if (!oItemContext) return;

          const iQuantity = oItemContext.getProperty("Quantity");
          if (iQuantity <= 0) {
            oItemContext.delete();
            return;
          }
          oItemContext.setProperty("OrderID", iOrderId);
        });

        oModel.submitChanges({
          groupId: "createOrderItems",
          success: () => {
            this.getRouter().navTo("main");
          },
          error: (oError) => {
            console.log(oError);
          },
        });
      },
      onNavBack() {
        const bOrderCreated = this.getModel("view").getProperty("/orderCreated");
        this.getRouter().navTo("main");
        if (!bOrderCreated) {
          this._oTransientContext?.delete();
        }
      },

      _initOrderItems() {
        const oTable = this._getProductsTable();
        const oModel = this.getModel();

        this.getView().setModel(oModel, "orderItem");

        const fnBind = () => {
          oTable.getItems().forEach((oRow) => {
            const oProduct = oRow.getBindingContext().getObject();

            const oContext = oModel.createEntry("/OrderItems", {
              properties: {
                OrderID: null,
                ProductID: oProduct.ID,
                UnitPrice: oProduct.Price,
                Quantity: 0,
              },
              groupId: "createOrderItems",
            });

            oRow.setBindingContext(oContext, "orderItem");
          });
        };

        if (oTable.getItems().length > 0) {
          fnBind();
        } else {
          oTable.attachEventOnce("updateFinished", fnBind);
        }
      },

      _validateOrder() {
        const oContext = this._oTransientContext;

        const vCustomer = oContext.getProperty("CustomerID");
        const vOrderDate = oContext.getProperty("OrderDate");
        const vRequiredDate = oContext.getProperty("RequiredDate");

        this.byId("customerSelect").setValueState(vCustomer ? "None" : "Error");
        this.byId("orderDatePicker").setValueState(vOrderDate ? "None" : "Error");
        this.byId("requiredDatePicker").setValueState(vRequiredDate ? "None" : "Error");

        return !!vCustomer && !!vOrderDate && !!vRequiredDate;
      },

      _getProductsTable() {
        return this.byId("productsTable");
      },
    });
  }
);
