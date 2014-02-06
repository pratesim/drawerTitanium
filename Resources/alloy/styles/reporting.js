module.exports = [ {
    isApi: true,
    priority: 1000.0068,
    key: "TextArea",
    style: {
        top: "5dp",
        left: "0dp",
        color: "white",
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        width: Ti.UI.FILL
    }
}, {
    isApi: true,
    priority: 1000.007,
    key: "Button",
    style: {
        font: {
            fontSize: "16dp"
        },
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        height: Ti.UI.SIZE,
        width: "50%"
    }
}, {
    isClass: true,
    priority: 10000.0063,
    key: "container",
    style: {
        orientationModes: [ Ti.UI.PORTRAIT, Ti.UI.LANDSCAPE_LEFT, Ti.UI.LANDSCAPE_RIGHT, Ti.UI.UPSIDE_PORTRAIT ],
        navBarHidden: true,
        exitOnClose: false,
        layout: "vertical",
        backgroundColor: "#cacaca",
        width: Ti.UI.FILL
    }
}, {
    isClass: true,
    priority: 10000.0065,
    key: "scrollContainer",
    style: {
        top: "20dp",
        left: "10dp",
        right: "10dp",
        layout: "vertical",
        backgroundColor: "transparent",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE
    }
}, {
    isClass: true,
    priority: 10000.0066,
    key: "inputLabel",
    style: {
        font: {
            fontSize: "16dp",
            fontWeight: "bold"
        },
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        color: "#BEBEBE",
        left: "0dp",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE
    }
}, {
    isClass: true,
    priority: 10000.0067,
    key: "separationLine",
    style: {
        backgroundColor: "#494C4F",
        height: "3dp",
        width: Ti.UI.FILL,
        top: "0dp"
    }
}, {
    isClass: true,
    priority: 10000.0069,
    key: "buttonGroup",
    style: {
        layout: "horizontal",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        backgroundColor: "transparent"
    }
}, {
    isId: true,
    priority: 100000.0064,
    key: "scrollView",
    style: {
        top: "0dp",
        layout: "vertical",
        width: Ti.UI.FILL,
        height: Ti.UI.FILL,
        backgroundGradient: {
            type: "linear",
            startPoint: {
                x: "0%",
                y: "0%"
            },
            endPoint: {
                x: "0%",
                y: "100%"
            },
            colors: [ {
                color: "#050607",
                offset: 0
            }, {
                color: "#272D33",
                offset: 1
            } ]
        }
    }
}, {
    isId: true,
    priority: 100000.0071,
    key: "repoimage",
    style: {
        top: "5dp",
        width: Ti.UI.FILL
    }
}, {
    isId: true,
    priority: 100000.0072,
    key: "takephoto",
    style: {
        left: "0%"
    }
}, {
    isId: true,
    priority: 100000.0073,
    key: "send",
    style: {
        right: "0%"
    }
} ];