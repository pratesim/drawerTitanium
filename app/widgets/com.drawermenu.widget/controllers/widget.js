var menuOpen = false;

var showhidemenu=function(){
	if (menuOpen){
		moveTo="0";
        opacityTo='1';
		menuOpen=false;
	}else{
		moveTo="300dp";
        opacityTo='0.40';
		menuOpen=true;
	}

	$.drawermainview.width=Ti.Platform.displayCaps.platformWidth;
	$.drawermainview.animate({
		left:moveTo,
        opacity: opacityTo,
		curve : Ti.UI.ANIMATION_CURVE_EASE_OUT,
		duration:150
	});
};

Ti.Gesture.addEventListener('orientationchange', function(e) {
    $.drawermainview.width=Ti.Platform.displayCaps.platformWidth;
});

exports.showhidemenu=showhidemenu;

exports.DRAWERMENU_STATUS_OPEN = true;
exports.DRAWERMENU_STATUS_CLOSE = false;

exports.getMenuStatus = function(){
    return menuOpen;
}