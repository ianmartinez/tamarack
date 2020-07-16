/**
 * Handles functionality needed for detecting the platform
 * the app is running on and adding attributes to the
 * root <html> node at startup.
 */


/**
 * An enum representing the platform
 * the app is running in.
 * @enum {String}
 */
const TkAppPlatform = {
    WEB: "web",
    ELECTRON: "electron",
    CORDOVA: "cordova"
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
     * @param {Any} options The options object.
     * @param {Function?} options.whenLoaded The callback to run when the init
     * is complete.
     * @param {Boolean?} options.supportDarkMode (defaults to true) If dark mode is
     * automatically supported.
     */
    static init(options = {}) {
        TkDocument.whenLoaded(() => {
            let currentPlatform = TkApp.platform;
            let htmlNode = document.querySelector("html");
            htmlNode.setAttribute(currentPlatform, "true");
            htmlNode.setAttribute("tkapp", "true");

            if (options.supportDarkMode !== false)
                htmlNode.setAttribute("tk-support-dark-mode", "true");

            if (options.whenLoaded !== undefined)
                options.whenLoaded();
        });
    }

    /**
     * Get the platform that the app is running on.
     * @type {TkAppPlatform}
     */
    static get platform() {
        if (TkApp.isElectron)
            return TkAppPlatform.ELECTRON;
        else if (TkApp.isCordova)
            return TkAppPlatform.CORDOVA;
        else
            return TkAppPlatform.WEB;
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
        return !this.isCordova && !this.isElectron;
    }

}