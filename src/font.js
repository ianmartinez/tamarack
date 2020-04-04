// Getting detected fonts
// see https://www.bramstein.com/writing/detecting-system-fonts-without-flash.html

class TkFont extends TkStateObject {

    constructor(value) {
        this.hasIntialized = true;
    }

    static exists(fontFamily) {
        // Adapted from https://www.samclarke.com/javascript-is-font-available/
        let fontContainer = new TkText("span", {
            text: "abcdefghijklmnopqrstuvwxyz".repeat(20),
            style: [
                "position: absolute",
                "width: auto",
                "font-size: 128px",
                "left: -99999px"
            ].join(" !important;")
        });

        let getWidth = (fontName) => {
            fontContainer.style.fontFamily = fontName;
            fontContainer.parent = "body";
            let width = fontContainer.e.clientWidth;
            fontContainer.delete();

            return width;
        };

        // Return if any of the default fonts' (monospace, serif, sans-serif) sizes 
        // are different from the font family we're searching for. If they are,
        // the font should exist.
        return (getWidth("monospace") !== getWidth(fontFamily + ",monospace"))
            || (getWidth("sans-serif") !== getWidth(fontFamily + ",sans-serif"))
            || (getWidth("serif") !== getWidth(fontFamily + ',serif'));
    }

    /**
     * Get the common fonts that are available 
     * on this system.
     * @type {TkFont}
     */
    static get common() {
        return null;
    }

    /**
     * Get all the linked fonts in the current document.
     * @type {TkFont}
     */
    static get linked() {
        return null;
    }

}