/* global QUnit */
QUnit.config.autostart = false;

sap.ui.require(["finalproject/test/integration/AllJourneys"
], function () {
	QUnit.start();
});
