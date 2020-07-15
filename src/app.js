/**
 * Handles functionality needed for detecting the system
 * the app is running on and adding attributes to the
 * root <html> node at startup.
 */


/**
 * An enum representing the system
 * the app is running in.
 * @enum {String}
 */
const TkAppTarget = {
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
     * 
     * @param {Any} options The options object.
     * @param {Function?} options.whenLoaded The callback to run when the init
     * is complete.
     * @param {Boolean?} options.supportDarkMode (defaults to true) If dark mode is
     * automatically supported.
     */
    static init(options = {}) {
        TkDocument.whenLoaded(() => {
            let currentTarget = TkApp.target;
            let htmlNode = document.querySelector("html");
            htmlNode.setAttribute(currentTarget, "true");
            htmlNode.setAttribute("tkapp", "true");

            if (options.supportDarkMode !== false)
                htmlNode.setAttribute("tk-support-dark-mode", "true");

            if (options.whenLoaded !== undefined)
                options.whenLoaded();
        });
    }

    static get target() {
        if (TkApp.isElectron)
            return TkAppTarget.ELECTRON;
        else if (TkApp.isCordova)
            return TkAppTarget.CORDOVA;
        else
            return TkAppTarget.WEB;
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
        return !!window.cordova;
    }

    static get isWeb() {
        return !this.isCordova && !this.isElectron;
    }

}