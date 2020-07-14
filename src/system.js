/* Handle differences between Web/Electron/Cordova */


/**
 * An enum representing the system
 * the app is running in.
 * @enum {String}
 */
const TkSystemType = {
    WEB: "web",
    ELECTRON: "electron",
    CORDOVA: "cordova"
};

class TkEnvironment {

    /**
     * Set up attributes on root <html> node to 
     * allow for CSS selectors to be environment-
     * specific.
     * 
     * Attributes are the same as the string value
     * returned by TkEnviroment.system.
     */
    static init() {
        TkDocument.whenLoaded(() => {
            let currentSystem = TkEnvironment.system;
            let htmlNode = document.querySelector("html");
            htmlNode.setAttribute(currentSystem, "true");
        });
    }

    static get system() {
        if (TkEnvironment.isElectron)
            return TkSystemType.ELECTRON;
        else if (TkEnvironment.isCordova)
            return TkEnvironment.CORDOVA;
        else
            return TkEnvironment.WEB;
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