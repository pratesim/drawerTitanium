module.exports = [ {
    isClass: true,
    priority: 10000.0055,
    key: "container",
    style: {
        orientationModes: [ Ti.UI.PORTRAIT, Ti.UI.LANDSCAPE_LEFT, Ti.UI.LANDSCAPE_RIGHT, Ti.UI.UPSIDE_PORTRAIT ],
        navBarHidden: true,
        exitOnClose: true,
        layout: "vertical",
        backgroundColor: "#cacaca",
        width: Ti.UI.FILL
    }
}, {
    isClass: true,
    priority: 10000.0057,
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
    priority: 10000.0058,
    key: "sectionLabel",
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
    priority: 10000.0059,
    key: "valueLabel",
    style: {
        font: {
            fontSize: "16dp"
        },
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        color: "#666666",
        top: "5dp",
        left: "0dp",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE
    }
}, {
    isClass: true,
    priority: 10000.006,
    key: "separationLine",
    style: {
        backgroundColor: "#494C4F",
        height: "3dp",
        width: Ti.UI.FILL,
        top: "0dp"
    }
}, {
    isId: true,
    priority: 100000.0056,
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
    priority: 100000.0061,
    key: "repoimage",
    style: {
        top: "5dp"
    }
} ];