var Alloy=require('alloy');

exports.getMainView=function(){
	return Alloy.createController('mainview');;
};

exports.getMenuView=function(){
	var v=Alloy.createController('menuview');
	
	return v;
};

exports.getMenuButton=function(args){
	var v=Ti.UI.createView({
		height: args.h,
		width: args.w,
		backgroundColor: 'transparent'
	});
	
	var b=Ti.UI.createView({
		height: "20dp",
		width: "20dp",
		left: "0",
		backgroundImage: "/ic_drawer.png"
	});
	
	v.add(b);
	
	return v;
};
