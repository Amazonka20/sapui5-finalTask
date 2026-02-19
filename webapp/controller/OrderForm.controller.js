sap.ui.define(
  ["finalproject/controller/BaseController", "sap/ui/model/json/JSONModel", "sap/m/MessageToast"],
  function (BaseController, JSONModel, MessageToast) {
    "use strict";

    return BaseController.extend("finalproject.controller.OrderForm", {
      onInit() {
        const oViewModel = new JSONModel({
          editMode: false,
        });
        this.getView().setModel(oViewModel, "view");
        this.getRouter().getRoute("orderForm").attachPatternMatched(this._onRouteMatched, this);
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
          this.getModel("view").setProperty("/editMode", true);
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

      onSave() {
        if (!this._validateOrder()) {
          return;
        }
        this.getModel().submitChanges({
          groupId: "editOrder",
          success: () => {
            MessageToast.show("Order updated.");
            this.onNavBack();
          },
          error: () => MessageToast.show("Update failed."),
        });
      },
      onCancel() {
        this.onNavBack();
        const oContext = this.getView().getBindingContext();
        if (oContext) {
          this.getModel().resetChanges([oContext.getPath()]);
        }
        this.getModel("view").setProperty("/editMode", false);
      },

      onCreateOrder() {
        if (!this._validateOrder()) {
          return;
        }
        const oModel = this.getModel();

        oModel.submitChanges({
          groupId: "createOrder",
          success: () => {
            this.onNavBack();
          },
          error: (oError) => {
            console.log(oError);
          },
        });
      },

      onAddProduct() {
        // const oOrderContext = this._oTransientContext;
        // const sItemsPath = oOrderContext.getPath() + "/Items";

        // this.getModel().createEntry(sItemsPath, {
        //   properties: {
        //     ProductID: "2",
        //     UnitPrice: 0,
        //     Quantity: 1,
        //     Currency: "EUR",
        //   },
        //   groupId: "createOrder",
        // });

        const oTable = this._getProductsTable();
        const oBinding = oTable.getBinding("items");

        const oContext = oBinding.create({
          ProductID: "1",
          Quantity: 1,
        });
      },

      onNavBack() {
        this.getRouter().navTo("main");
      },

      // _initOrderItems() {
      //   const oTable = this._getProductsTable();
      //   const oModel = this.getModel();

      //   this.getView().setModel(oModel, "orderItem");

      //   const fnBind = () => {
      //     oTable.getItems().forEach((oRow) => {
      //       const oProduct = oRow.getBindingContext().getObject();

      //       const oContext = oModel.createEntry("/OrderItems", {
      //         properties: {
      //           OrderID: null,
      //           ProductID: oProduct.ID,
      //           UnitPrice: oProduct.Price,
      //           Quantity: 0,
      //         },
      //         groupId: "createOrderItems",
      //       });

      //       oRow.setBindingContext(oContext, "orderItem");
      //     });
      //   };

      //   if (oTable.getItems().length > 0) {
      //     fnBind();
      //   } else {
      //     oTable.attachEventOnce("updateFinished", fnBind);
      //   }
      // },

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

      _getProductsTable() {
        return this.byId("productsTable");
      },
    });
  }
);
