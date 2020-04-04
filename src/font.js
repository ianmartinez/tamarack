// Getting detected fonts
// see https://www.bramstein.com/writing/detecting-system-fonts-without-flash.html

class TkFont extends TkStateObject {

    constructor(value) {
        this.hasIntialized = true;
    }

    static exists(fontFamily) {
        // Adpted from https://www.samclarke.com/javascript-is-font-available/
        let width;
        let body = document.body;

        let container = document.createElement('span');
        container.innerText = 
            "abcdefghijklmnopqrstuvwxyz".repeat(20);
        container.style.cssText = [
            'position:absolute',
            'width:auto',
            'font-size:128px',
            'left:-99999px'
        ].join(' !important;');

        var getWidth = function (fontFamily) {
            container.style.fontFamily = fontFamily;

            body.appendChild(container);
            width = container.clientWidth;
            body.removeChild(container);

            return width;
        };

        // Pre compute the widths of monospace, serif & sans-serif
        // to improve performance.
        var monoWidth  = getWidth('monospace');
        var serifWidth = getWidth('serif');
        var sansWidth  = getWidth('sans-serif');

        return monoWidth !== getWidth(_family + ',monospace') 
            || sansWidth !== getWidth(_family + ',sans-serif') 
            || serifWidth !== getWidth(_family + ',serif');
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