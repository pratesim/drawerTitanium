module.exports = [ {
    isId: true,
    priority: 100000.0013,
    key: "mainView",
    style: {
        layout: "vertical",
        backgroundColor: "#cacaca"
    }
}, {
    isId: true,
    priority: 100000.0014,
    key: "mainTopBar",
    style: {
        width: Ti.UI.FILL,
        height: "48dp",
        backgroundColor: "#222222",
        opacity: "1",
        layout: "horizontal"
    }
}, {
    isId: true,
    priority: 100000.0015,
    key: "appIcon",
    style: {
        width: "34dp",
        height: "34dp",
        left: "-24dp",
        backgroundImage: "/images/icon.png"
    }
}, {
    isId: true,
    priority: 100000.0016,
    key: "menuButton",
    style: {
        left: "0dp",
        width: "48dp",
        height: "48dp",
        backgroundColor: "transparent"
    }
}, {
    isId: true,
    priority: 100000.0017,
    key: "titleApp",
    style: {
        left: "10dp",
        color: "white",
        font: {
            fontSize: "22dp"
        },
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
    }
}, {
    isId: true,
    priority: 100000.0018,
    key: "littleBar",
    style: {
        backgroundColor: "#1B1B1B",
        height: "3dp",
        width: Ti.UI.FILL
    }
} ];