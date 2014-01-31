module.exports = [ {
    isId: true,
    priority: 100000.0009,
    key: "mainView",
    style: {
        layout: "vertical",
        backgroundColor: "#cacaca"
    }
}, {
    isId: true,
    priority: 100000.001,
    key: "mainTopBar",
    style: {
        width: Ti.UI.FILL,
        height: "48dp",
        backgroundColor: "#333333",
        opacity: "0.8",
        layout: "horizontal"
    }
}, {
    isId: true,
    priority: 100000.0011,
    key: "menuButton",
    style: {
        width: "48dp",
        height: "48dp",
        backgroundColor: "#333333"
    }
}, {
    isId: true,
    priority: 100000.0012,
    key: "titleApp",
    style: {
        color: "white",
        font: {
            fontSize: "20dp"
        },
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
    }
}, {
    isId: true,
    priority: 100000.0013,
    key: "littleBar",
    style: {
        backgroundColor: "#3793B5",
        height: "3dp",
        width: Ti.UI.FILL
    }
} ];