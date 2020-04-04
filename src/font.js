// Getting detected fonts
// see https://www.bramstein.com/writing/detecting-system-fonts-without-flash.html

class TkFont extends TkStateObject {

    constructor(value) {
        this.hasIntialized = true;
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
     */
    static get linked() {
        return null;
    }

}