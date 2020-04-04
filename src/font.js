/**
 * Fonts are a complex topic, but these classes should 
 * cover about 90% of use cases.
 */


class TkFont extends TkStateObject {

    constructor(options = {}) {
        super();

        // Size
        if (TkObject.is(options.size, String)) // Size from string value
            this.size = new TkFontSize(options.size);
        else // Size from TkFontSize object
            this.size = options.size ?? new TkFontSize("1rem");

        // Style
        if (TkObject.is(options.style, String)) // Style from string value
            this.style = new TkFontStyle(options.style);
        else // Style from TkFontStyle object
            this.style = options.style ?? new TkFontStyle("normal");

        this.weight = options.weight ?? 500;
        this.hasIntialized = true;
        this.isValid = this.size.isValid && this.style.isValid;
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
     * Get the common font families that are available 
     * on this system.
     * @type {String[]}
     */
    static get availableFamilies() {
        return TkFont.availableFrom(...this.commonFamilies);
    }

    /**
     * Get the font families that are available 
     * on this system from a set of font families.
     * @type {String[]}
     */
    static availableFrom(...fontFamilies) {
        let available = [];

        for (let fontFamily of fontFamilies)
            if (TkFont.exists(fontFamily))
                available.push(fontFamily);

        return available;
    }

    /**
     * An array of common font families.
     */
    static commonFamilies = ["arial", "calibri",
        "century gothic", "comic sans", "consolas", "courier",
        "dejavu sans", "dejavu serif", "georgia", "gill sans",
        "helvetica", "impact", "lucida sans", "myriad pro",
        "open sans", "palantino", "tahoma", "times new roman",
        "trebuchet", "verdana", "zapfino"];

}

const TkFontSizeType = {
    NAMED: "", // x-small, larger, smaller
    REM: "rem", // 12rem
    EM: "em", // 12em
    PX: "px", // 12px
};

class TkFontSize extends TkStateObject {

    constructor(value) {
        super();

        this._fontString = value;
        this._fontSizeType = TkFontSize.getType(value);
        this.hasIntialized = true;
        this.isValid = this._fontSizeType !== null;
    }

    get sizeType() {
        return this._fontSizeType;
    }

    get px() {
        return "";
    }

    get px() {
        return "";
    }

    static getType(value) {
        // Regex to match values with numbers
        let numberRegex = /(?!.{12})\d+(?:\.\d+)?/;

        if (numberRegex.test(value)) { // If is has a number
            for (let sizeType in TkFontSizeType) {
                let sizeTypeValue = TkFontSizeType[sizeType];

                if (sizeTypeValue != TkFontSizeType.NAMED) {
                    // Combine the number regex with the value of the size type
                    // and allow a space in between
                    let sizeRegex = new RegExp(numberRegex.source + "[ ]?" + sizeTypeValue);
                    if (sizeRegex.test(value))
                        return sizeTypeValue;
                }
            }
        } else { // If not, assume it's something like "xx-small"
            return TkFontSizeType.NAMED;
        }

        return null; // The font size is invalid
    }

}

const TkFontStyleType = {
    NORMAL: "normal",
    ITALIC: "italic",
    OBLIQUE: "oblique"
}

class TkFontStyle extends TkStateObject {

    constructor(value) {
        super();

        this._style = TkFontStyleType.NORMAL;
        this._obliqueAngle = 0;
        this.fromString(value);
        this.hasIntialized = true;
    }

    fromString(value) {
        let normalizedValues = value.toLowerCase().trim().split(" ");
        let normalizedValue = normalizedValues[0];

        for (let styleType in TkFontStyleType) {
            let styleTypeValue = TkFontStyleType[styleType];
            if (styleTypeValue == normalizedValue) {
                let styleValid = true;

                if (normalizedValues.length > 1) {
                    let parsedOblique = parseInt(normalizedValues[1]);

                    if (isNaN(parsedOblique))
                        styleValid = false;
                    else
                        this._obliqueAngle = parsedOblique;
                }

                if (styleValid)
                    this._style = styleTypeValue;

                this.isValid = styleValid;
            }
        }
    }

}