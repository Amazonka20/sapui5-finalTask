sap.ui.define(
  ["sap/ui/core/format/DateFormat", "sap/base/strings/formatMessage"],
  (DateFormat, formatMessage) => {
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
      formatTitle(sPattern, sFallback, sValue) {
        if (sValue) {
          return formatMessage(sPattern, [sValue]);
        }
        return sFallback;
      },
      formatMessage: formatMessage,
    };
  }
);
