/**
 * Handles functionality needed for detecting the platform
 * the app is running on and adding attributes to the
 * root <html> node at startup.
 */


/**
 * The root view of the app.
 */
let TkAppRootView = null;
/**
 * The area where toolbars are placed.
 */
let TkAppToolbarView = null;
/**
 * The view surrounding the content view.
 */
let TkAppContentOuterView = null;
/**
 * Where most of the app's views will go, except
 * for toolbars and sidebars.
 */
let TkAppContentView = null;

/**
 * An enum representing the platform
 * the app is running in.
 * @enum {String}
 */
const TkPlatform = {
    WEB: "web",
    ELECTRON: "electron",
    CORDOVA: "cordova"
};

const TkDevice = {
    DESKTOP: "desktop",
    ANDROID: "android",
    IPHONE: "iphone",
    IPAD: "ipad"
};

/**
 * Static functions related to an App's environment.
 */
class TkApp {

    /**
     * Set up attributes on root <html> node to allow for CSS 
     * selectors to be environment-specific.
     * 
     * Attributes are the same as the string value
     * returned by TkApp.platform.
     * 
     * Also adds [tkapp] attribute.
     * 
     * @param {Object} options The options object.
     * @param {Function} [options.whenLoaded] The callback to run when the init
     * is complete.
     * @param {Boolean} [options.supportDarkMode=true] If dark mode is
     * automatically supported.
     * @param {Boolean} [options.iOSToolbarOnBottom=true] If TkToolbars are
     * automatically moved to the bottom on iOS.
     * @param {Boolean} [options.createAppViews=true] If views are automatically created
     * to layout the app.
     * @param {TkView|String|HTMLElement} [options.rootParent="body"] The root view's parent.
     */
    static init(options = {}) {
        // Create layout elements
        if (options.createAppViews !== false) {
            TkAppRootView = new TkView({ parent: TkView.viewFrom(options.rootParent ?? "body"), id: "tkapp-root-view" });
            TkAppToolbarView = new TkView({ parent: TkAppRootView, id: "tkapp-toolbar-view" });
            TkAppContentOuterView = new TkView({ parent: TkAppRootView, id: "tkapp-content-outer-view" });
            TkAppContentView = new TkView({ parent: TkAppContentOuterView, id: "tkapp-content-view" });
        }

        TkDocument.whenLoaded(() => {
            let htmlNode = document.querySelector("html");
            htmlNode.setAttribute("tkapp", "true");
            let currentPlatform = TkApp.platform;
            let currentDevice = TkApp.device;
            htmlNode.setAttribute(currentPlatform, "true");
            htmlNode.setAttribute(currentDevice, "true");

            if (options.supportDarkMode !== false)
                htmlNode.setAttribute("tk-support-dark-mode", "true");

            if (options.iOSToolbarOnBottom !== false && TkApp.isIOS)
                htmlNode.setAttribute("tk-ios-toolbar-on-bottom", "true");

            if (options.whenLoaded !== undefined)
                options.whenLoaded();
        });
    }

    static get supportDarkMode() {
        return document.querySelector("html").hasAttribute("tk-support-dark-mode");
    }

    static set supportDarkMode(value) {
        if (value)
            document.querySelector("html").setAttribute("tk-support-dark-mode", "true");
        else 
            document.querySelector("html").removeAttribute("tk-support-dark-mode");
    }

    /**
     * Get the platform that the app is running on.
     * @type {TkPlatform}
     */
    static get platform() {
        if (TkApp.isElectron)
            return TkPlatform.ELECTRON;
        else if (TkApp.isCordova)
            return TkPlatform.CORDOVA;
        else
            return TkPlatform.WEB;
    }

    /**
     * If the current app is running on Electron.
     * @type {Boolean}
     */
    static get isElectron() {
        // Renderer process
        if (typeof window !== "undefined" && typeof window.process === "object" && window.process.type === "renderer") {
            return true;
        }

        // Main process
        if (typeof process !== "undefined" && typeof process.versions === "object" && !!process.versions.electron) {
            return true;
        }

        // Detect the user agent when the "nodeIntegration" option is set to true
        if (typeof navigator === "object" && typeof navigator.userAgent === "string" && navigator.userAgent.indexOf("Electron") >= 0) {
            return true;
        }

        return false;
    }

    /**
     * If the current app is running on Apache Cordova.
     * @type {Boolean}
     */
    static get isCordova() {
        return !!window.cordova;
    }

    /**
     * If the current app is running in a web browser.
     * @type {Boolean}
     */
    static get isWeb() {
        return !TkApp.isCordova && !TkApp.isElectron;
    }

    static get device() {
        if (TkApp.isDesktop)
            return TkDevice.DESKTOP;
        else if (TkApp.isAndroid)
            return TkDevice.ANDROID;
        else if (TkApp.isIPhone)
            return TkDevice.IPHONE;
        else if (TkApp.isIPad)
            return TkDevice.IPAD;
    }

    static get isDesktop() {
        return !TkApp.isAndroid && !TkApp.isIPhone && !TkApp.isIPad;
    }

    /**
     * If the app is running on Android.
     * @type {Boolean}
     */
    static get isAndroid() {
        return navigator.userAgent.match(/Android/i) !== null;
    }

    /**
     * If the app is running on an iPhone.
     * @type {Boolean}
     */
    static get isIPhone() {
        for (let device of ["iPhone", "iPod"])
            if (navigator.platform.includes(device))
                return true;

        return false;
    }

    /**
     * If the app is running on an iPad.
     * @type {Boolean}
     */
    static get isIPad() {
        return navigator.platform.includes("iPad") || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    }

    /**
     * If the app is running on an iOS/iPadOS device.
     * @type {Boolean}
     */
    static get isIOS() {
        return TkApp.isIPad || TkApp.isIPhone;
    }


    /**
     * If iOSToolbarOnBottom was set as true when TkApp.init() was 
     * called (which is thedefault functionality) and the current 
     * device is running on iOS/iPadOS.
     * @type {Boolean}
     */
    static get wantsToolbarOnBottom() {
        return TkApp.isIOS && document.querySelector("html").hasAttribute("tk-ios-toolbar-on-bottom");
    }

}