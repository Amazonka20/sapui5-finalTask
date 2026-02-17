sap.ui.define(["sap/ui/core/format/DateFormat"], (DateFormat) => {
  "use strict";
  return {
    formatDate(sValue) {
      if (!sValue) return "-";
      const oDate = new Date(sValue);
      if (oDate.getTime() === 0) return "-";
      return DateFormat.getDateInstance({
        pattern: "dd MMM yyyy",
      }).format(oDate);
    },
  };
});
