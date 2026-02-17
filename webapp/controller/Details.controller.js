sap.ui.define(["finalproject/controller/BaseController"], function (BaseController) {
  "use strict";

  return BaseController.extend("finalproject.controller.Details", {
    onInit() {
      this.getRouter().getRoute("details").attachPatternMatched(this._onRouteMatched, this);
    },

    _onRouteMatched(oEvent) {
      const sId = oEvent.getParameter("arguments").orderID;
      this.getView().bindElement({
        path: `/Orders(${sId})`,
        parameters: { expand: "Customer" },
      });
    },
  });
});
