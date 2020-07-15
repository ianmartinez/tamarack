/*  Handles views managing toolbars, menus, and icons */


/**
 * An enum representing the system
 * the app is running in.
 * @enum {String}
 */
const TkAppType = {
    WEB: "web",
    ELECTRON: "electron",
    CORDOVA: "cordova"
};

class TkApp {


    /**
     * Set up attributes on root <html> node to 
     * allow for CSS selectors to be environment-
     * specific.
     * 
     * Attributes are the same as the string value
     * returned by TkEnviroment.system.
     * 
     * Also adds [tkapp] attribute.
     */
    static init() {
        TkDocument.whenLoaded(() => {
            let currentSystem = TkApp.target;
            let htmlNode = document.querySelector("html");
            htmlNode.setAttribute(currentSystem, "true");
            htmlNode.setAttribute("tkapp", "true");
        });
    }

    static get target() {
        if (TkApp.isElectron)
            return TkAppType.ELECTRON;
        else if (TkApp.isCordova)
            return TkApp.CORDOVA;
        else
            return TkApp.WEB;
    }

    static get isElectron() {
        // Renderer process
        if (typeof window !== "undefined" && typeof window.process === "object" && window.process.type === "renderer") {
            return true;
        }

        // Main process
        if (typeof process !== "undefined" && typeof process.versions === "object" && !!process.versions.electron) {
            return true;
        }

        // Detect the user agent when the `nodeIntegration` option is set to true
        if (typeof navigator === "object" && typeof navigator.userAgent === "string" && navigator.userAgent.indexOf("Electron") >= 0) {
            return true;
        }

        return false;
    }

    // TODO: Detect Cordova
    static get isCordova() {
        return false;
    }

    static get isWeb() {
        return !this.isCordova && !this.isElectron;
    }
}

class TkToolbar extends TkStack {

    constructor(options = {}) {
        options.direction = options.direction ?? TkStackDirection.FLOW;
        super(options);
        this.addViewName("tktoolbar");
        this.buttonLayout = options.layout ?? TkLabelLayout.ICON_TOP;
    }
    
    /**
     * The layout of the TkButtons on the toolbar.
     * @type {TkLabelLayout}
     */
    get buttonLayout() {
        return this.getAttributeFromEnum(TkLabelLayout, TkLabelLayout.ICON_TOP);
    }

    set buttonLayout(value) {
        this.addAttributeFromEnum(TkLabelLayout, value);
    }

}

/**
 * A simple wrapper to make using Ionicons (https://ionicons.com/) 
 * with tamarack easy. Note: use need to include the Ionicons script
 * to use TkIcon.
 */
class TkIcon extends TkView {

    /**
     * Create a new <ion-icon> element backed by a TkView.
     * 
     * @param {Any} options Same as TkView, minus the tag option.
     * @param {String} name The name of the Ionicon.
     */
    constructor(options = {}) {
        // Add name to attributes option
        if(options.attributes === undefined)
            options.attributes = {};
        options.attributes.name = options.name;

        // Send it to the TkView constructor
        super(options, { tag: "ion-icon" });

        // Add the view name TkIcon
        this.addViewName("tkicon");
    }

}

/* TODO */
class TkMenuBar extends TkView {

}

/* TODO */
class TkMenu extends TkView {

}