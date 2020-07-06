/**
 * Fonts are a complex topic, but these classes should 
 * cover about 90% of use cases. They're designed mostly for
 * use with a font picker to allow the user to pick 
 * a font and its attributes.
 */


/**
 * TkFont represents a font with the attributes
 * font-size, font-style, font-weight, text-decoration.
 * 
 * It also provides (via static methods) the ability
 * to detect available fonts on a system.
 * 
 * ***
 * TkFont and related classes are incomplete, so don't use them
 * in production.
 * ***
 */
class TkFont extends TkStateObject {

    /**
     * Create an new TkFont instance.
     * 
     * @param {Any} options The options object.
     * @param {TkFontSize} options.size The size of the font.  
     * @param {TkFontStyle} options.style The style of the font.
     * @param {TkFontWeight} options.weight The weight of the font.
     */
    constructor(options = {}) {
        super();

        // Size
        if (TkObject.is(options.size, String)) // Size from string value
            this._size = new TkFontSize(options.size);
        else // Size from TkFontSize object
            this._size = options.size ?? new TkFontSize("1rem");

        // Style
        if (TkObject.is(options.style, String)) // Style from string value
            this._style = new TkFontStyle(options.style);
        else // Style from TkFontStyle object
            this._style = options.style ?? new TkFontStyle("normal");

        // Weight
        if (TkObject.is(options.weight, String) || TkObject.is(options.weight, Number)) // Weight from string/number value
            this._weight = new TkFontWeight(options.weight);
        else // Weight from TkFontWeight object
            this._weight = options.weight ?? new TkFontWeight("normal");

        // TODO: Decoration

        this.hasIntialized = true;
        this.isValid = this.allValid;
    }

    /**
     * If all of the fields are valid.
     * @type {Boolean}
     */
    get allValid() {
        return this._size.isValid && this._style.isValid && this._weight.isValid;
    }

    /**
     * Search for a font family by name and see if it exists on this system.
     * 
     * @param {String} fontFamily The font family to search for.
     */
    static exists(fontFamily) {
        // Adapted from https://www.samclarke.com/javascript-is-font-available/

        // Create an invisible (to the user) container to test each font size in
        let fontContainer = new TkText("span", {
            text: "abcdefghijklmnopqrstuvwxyz0123456789".repeat(20),
            style: [
                "position: absolute",
                "width: auto",
                "font-size: 128px",
                "left: -99999px"
            ].join(" !important;")
        });

        // Function to get the width of the font
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
        return (getWidth("monospace") !== getWidth(`${fontFamily},monospace`))
            || (getWidth("sans-serif") !== getWidth(`${fontFamily},sans-serif`))
            || (getWidth("serif") !== getWidth(`${fontFamily},serif`));
    }

    /**
     * Get the common font families that are available 
     * on this system.
     * @type {String[]}
     */
    static get availableFamilies() {
        return TkFont.availableFrom(...TkCommonFontFamilies);
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

}

/**
 * An array of common font families.
 */
const TkCommonFontFamilies = ["arial", "calibri",
    "century gothic", "comic sans", "consolas", "courier",
    "dejavu sans", "dejavu serif", "georgia", "gill sans",
    "helvetica", "impact", "lucida sans", "myriad pro",
    "open sans", "palantino", "tahoma", "times new roman",
    "trebuchet", "verdana", "zapfino"];

/**
 * Enum for the type of font size.
 */
const TkFontSizeType = {
    NAMED: "", // x-small, larger, smaller
    REM: "rem", // 12rem
    EM: "em", // 12em
    PX: "px", // 12px
};

/**
 * Represents information about a font's size.
 */
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

    get named() {
        return "";
    }

    set named(value) {

    }

    get rem() {
        return 0;
    }

    set rem(value) {

    }

    get em() {
        return 0;
    }

    set em(value) {

    }


    get px() {
        return 0;
    }

    set px(value) {

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

/**
 * Enum for the font style.
 */
const TkFontStyleType = {
    NORMAL: "normal",
    ITALIC: "italic",
    OBLIQUE: "oblique"
};

/**
 * Class representing a font's style.
 */
class TkFontStyle extends TkStateObject {

    /**
     * Create as TkFontStyle representing a CSS font-style.
     * 
     * @param {String} value The CSS font-style string.
     */
    constructor(value) {
        super();

        // Set defaults
        this._style = TkFontStyleType.NORMAL;
        // Parse value string
        this.setString(value);
        this.hasIntialized = true;
    }

    /**
     * Parse a string and set this style to
     * match it, if it is valid.
     * 
     * @param {String} value The CSS font-style string to parse.
     */
    setString(value) {
        let normalizedValues = value.toLowerCase().trim().split(" ");
        let normalizedValue = normalizedValues[0];

        for (let styleType in TkFontStyleType) {
            let styleTypeValue = TkFontStyleType[styleType];
            if (styleTypeValue == normalizedValue) {
                this._style = styleTypeValue;
                this.isValid = true;
            }
        }
    }

    /**
     * The font's style.
     * @type {TkFontStyleType}
     */
    get style() {
        return this._style;
    }

    set style(value) {
        this._style = value;
    }

    toString() {
        return `${(this.style == TkFontStyleType.NORMAL) ? "" : this.style}`;
    }

}

class TkFontWeight extends TkStateObject {

    /**
     * Create a new TkFontWeight with a given value.
     * 
     * @param {Number|String} value Accepts any number between 1 and 1000
     * or the strings "normal" (400) or "bold" (700).
     */
    constructor(value) {
        super();

        this.setWeight(value);
    }

    /**
     * Parse a value and set it as the value of the font weight.
     * 
     * @param {Number|String} value Accepts any number between 1 and 1000
     * or the strings "normal" (400) or "bold" (700).
     */
    setWeight(value) {
        let normalizedValue = value.trim().toLowerCase();
        let parsedValue = parseInt(value);

        if (normalizedValue == "normal") {
            this._value = 400;
            this.isValid = true;
        } else if (normalizedValue == "bold") {
            this._value = 700;
            this.isValid = true;
        } else if (!isNaN(parsedValue) && TkNumber.in(parsedValue, 1, 1000)) {
            this._value = parsedValue;
            this.isValid = true;
        } else {
            this._value = 0;
            this.isValid = false;
        }
    }

    /**
     * The value, from 1-1000 of the font weight.
     * @type {Number}
     */
    get value() {
        return this._value;
    }

    set value(value) {
        if (TkNumber.in(value, 1, 1000)) {
            this._value = value;
            this.isValid = true;
        } else {
            this.isValid = false;
        }
    }

    toString() {
        return `${this.value}`;
    }

}