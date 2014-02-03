var win = $.winrepodetail;
var actionBar; 

win.addEventListener("open", function() {
	Ti.API.info('Window "segnala" aperta');
    if (Ti.Platform.osname === "android") {
        if (! $.winrepodetail.activity) {
            Ti.API.error("Can't access action bar on a lightweight window.");
        } else {
            actionBar = $.winrepodetail.activity.actionBar;
            if (actionBar) {
                actionBar.icon = "/images/icon.png";
                actionBar.title = "Degrado Ambientale";
                actionBar.navigationMode = Ti.Android.NAVIGATION_MODE_STANDARD;
                actionBar.displayHomeAsUp = true;
                actionBar.onHomeIconItemSelected = function() {
                    Ti.API.info("Home icon clicked!");
                    $.winrepodetail.close();
                };
            }
        }
    }
});

