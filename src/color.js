/**
 * Requires: 
 *  tamarack/core
 *  tamarack/views (only if you use fromProperty())
 * 
 * A class to make it simple to manage nearly every type of CSS color 
 * and easily convert between them: hex, hex w/ alpha, named CSS, HSL, HSLA, 
 * RGB, RGBA.
 * 
 * When creating a TkColor, you can pass any of these values 
 * to the constructor to create a TkColor representation of
 * it.
 * 
 * The TkColor class is mutable by design, so that it can be
 * easily used for the internals of a color picker. You can
 * set the value of any individual channel and all of the other
 * channels will be updated transparently in the background (i.e. 
 * setting the r value will update the corresponding HSL values
 * as well to match it).
 * 
 * TkColor also extends TkStateObject, which means it it emits events
 * when its state has changed (i.e. when the user enters an invalid color
 * that's then passed to the setString() function). When it enters an invalid
 * state (isValid == false), the "becameinvalid" event is emitted, but the last
 * valid color is still preserved because none of the invalid inputs were actually
 * committed.
 * 
 * Custom color names and their associated values may be 
 * registered via the TkColor.register() function so that 
 * they can be used across all TkColor instances.
 * 
 * @example <caption>For example, if you want to define brand color to be used:</caption>
 *      TkColor.register("brandcolor", "#b22222");
 *      let someColor = new TkColor("brandcolor");
 *      someColor.asHex(); // Returns "#b22222"
 *      someColor.asRgba(); // Returns rgba(178, 34, 34, 1)
 */
class TkColor extends TkStateObject {

    /**
     * Initialize a new TkColor object with a given color string.
     * 
     * @param {String} value The color string to parse for a valid color. 
     * Accepts the same values as CSS colors.
     * @param {Number} alpha (optional) The value to set for the alpha channel.
     * If the color string that was specified before sets its own alpha value, 
     * this will override it.
     */
    constructor(value, alpha) {
        super();

        this._h = 0;
        this._s = 0;
        this._l = 0;

        this._r = 0;
        this._g = 0;
        this._b = 0;

        this._a = 1;

        this.setString(value);

        // Override alpha value from this.setString() if specified
        // and in a valid range
        if (alpha !== undefined && TkNumber.in(alpha, 0, 1))
            this._a = alpha;

        this.hasIntialized = true;
    }

    /**
     * Parse a given CSS color string and set the color value 
     * to match it.
     * 
     * @param {String} colorString The string to parse for a valid color.
     */
    setString(colorString) {
        // Blank strings do nothing
        if (colorString.trim().length == 0) {
            this.isValid = false;
            return;
        }

        // Store old hsla
        let oldH = this._h;
        let oldS = this._s;
        let oldL = this._l;
        let oldA = this._a;

        let value = colorString.toLowerCase();
        let formatValue = (unformattedValue) => {
            // Strip out unneeded chars
            let toRemove = ["(", ")", "rgba", "hsla", "rgb", "hsl"];
            let formattedValue = unformattedValue;
            for (let removeStr of toRemove)
                formattedValue = formattedValue.replace(removeStr, "");

            return formattedValue;
        };

        try {
            if (value.startsWith("#")) { // hex
                this.setHex(value);
            } else if (value.startsWith("hsl")) { // hsl(a)
                let hslaValues = formatValue(value).split(",");

                let h = parseInt(hslaValues[0]);
                let s = parseInt(hslaValues[1]);
                let l = parseInt(hslaValues[2]);
                let a = (hslaValues.length == 4) ? parseFloat(hslaValues[3]) : 1;

                this.setHsla(h, s, l, a);
            } else if (value.startsWith("rgb")) { // rbg(a)
                let rgbaValues = formatValue(value).split(",");

                let r = parseInt(rgbaValues[0]);
                let g = parseInt(rgbaValues[1]);
                let b = parseInt(rgbaValues[2]);
                let a = (rgbaValues.length == 4) ? parseFloat(rgbaValues[3]) : 1;

                this.setRgba(r, g, b, a);
            } else { // named
                this.setName(value);
            }

            this.isValid = true;
        } catch (ex) {
            console.log(`Error parsing color: ${ex}`);

            // If the color hasn't been set before and 
            // there's an error interpreting the color,
            // default to black, else revert to last valid
            // color
            if (this.hasIntialized)
                this.setRgba(0, 0, 0, 1);
            else
                this.setHsla(oldH, oldS, oldL, oldA);

            // Set isValid flag to false
            this.isValid = false;
        }
    }

    /**
     * Red (0 - 255).
     * @type {Number}
     */
    get r() {
        return this._r;
    }

    set r(value) {
        this.setRgba(value, this._g, this._b, this._a);
    }

    /**
     * Green (0 - 255).
     * @type {Number}
     */
    get g() {
        return this._g;
    }

    set g(value) {
        this.setRgba(this._r, value, this._b, this._a);
    }

    /**
     * Blue (0 - 255).
     * @type {Number}
     */
    get b() {
        return this._b;
    }

    set b(value) {
        this.setRgba(this._r, this._g, value, this._a);
    }

    /**
     * Hue (0 - 360).
     * @type {Number}
     */
    get h() {
        return this._h;
    }

    set h(value) {
        this.setHsla(value, this._s, this._l, this._a);
    }

    /**
     * Saturation (0 - 100).
     * @type {Number}
     */
    get s() {
        return this._s;
    }

    set s(value) {
        this.setHsla(this._h, value, this._l, this._a);
    }

    /**
     * Lightness (0 - 100).
     * @type {Number}
     */
    get l() {
        return this._l;
    }

    set l(value) {
        this.setHsla(this._h, this._s, value, this._a);
    }

    /**
     * Alpha (0 - 1).
     * @type {Number}
     */
    get a() {
        return this._a;
    }

    set a(value) {
        this._a = value;
    }

    /**
     * Create an exact copy of this TkColor instance.
     * 
     * @returns {TkColor} A deep copy of this TkColor.
     */
    clone() {
        return new TkColor(this.asHsla());
    }

    /**
     * Check if another TkColor has an identical color to this one.
     * 
     * @param {TkColor} otherColor The color to compare to this one.
     * 
     * @returns {Boolean} If the color of this TkColor is identical to the other TkColor.
     */
    equals(otherColor) {
        return (otherColor.h == this._h
            && otherColor.s == this._s
            && otherColor.l == this._l
            && otherColor.a == this._a);
    }

    /**
     * Finds a color with a given name and sets it to be the current color.
     * Searches first for registered colors by a given name, then named CSS
     * colors after that.
     * 
     * @param {String} name The name of the color to search for. 
     */
    setName(name) {
        let formattedName = name.toLowerCase();
        let registeredColor = _TkRegisteredColors.get(formattedName);

        if (registeredColor)
            this.setString(registeredColor);
        else
            this.setCssName(formattedName);
    }

    /**
     * Get the name of the color that matches the value of this color.
     * 
     * @param {Boolean} ignoreAlpha (optional) If the alpha channel should be ignored when 
     * searching for a color from the registered colors and CSS named colors. Defaults to false.
     * 
     * @returns {String} The name of the color found or empty string if none is found.
     */
    asName(ignoreAlpha = false) {
        let hexValue = ignoreAlpha ? this.asSolidHex() : this.asHex();
        let matchingName = "";

        _TkRegisteredColors.forEach((value, key) => {
            if (value == hexValue)
                matchingName = key;
        });

        if (matchingName == "")
            matchingName = this.asCssName(ignoreAlpha);

        return matchingName;
    }

    /**
     * Set the value of this color to the value of a CSS color with a given
     * name.
     * 
     * @param {String} name The name of the CSS color to set.
     */
    setCssName(name) {
        let formattedName = name.toLowerCase();
        this.setHex(_TkCssColors[formattedName] ?? "");
    }

    /**
     * Get a named CSS color that has the same hex value as this color.
     * 
     * Note: Because named CSS colors don't have an alpha channel, this function
     * ignores it if ignoreAlpha == true. This is the default functionality.
     * 
     * @param {Boolean} ignoreAlpha (optional) If the alpha channel should be ignored.
     * 
     * @returns {String} The name of the CSS color that matches this color, 
     * or an empty string, if none is found.
     */
    asCssName(ignoreAlpha = true) {
        let hexValue = ignoreAlpha ? this.asSolidHex() : this.asHex();

        for (let cssColor in _TkCssColors)
            if (_TkCssColors[cssColor] == hexValue)
                return cssColor;

        return "";
    }

    /**
     * Set this color from a hex code.
     * 
     * @param {String} hex The hex code.
     */
    setHex(hex) {
        let rgba = TkColor.hexToRgba(hex);

        // Check if the converted RGBA values fall within expected ranges
        let validRgba = TkNumber.in(rgba.r, 0, 255) && TkNumber.in(rgba.g, 0, 255)
            && TkNumber.in(rgba.b, 0, 255) && TkNumber.in(rgba.a, 0, 1);

        if (validRgba) {
            this.setRgba(rgba.r, rgba.g, rgba.b, rgba.a);
            this.isValid = true;
        } else {
            this.isValid = false;
        }
    }

    /**
     * @param {Boolean} forceAlpha (optional) If the resulting hex code could should include 
     * an alpha channel, even if there is no transparency (alpha == 1), defaults to false.
     * 
     * @returns {String} The hex code representing this color.
     */
    asHex(forceAlpha = false) {
        return TkColor.rgbaToHex(this._r, this._g, this._b, this._a, forceAlpha);
    }

    /**
     * @returns The hex code representing this color, stripped of its alpha channel.
     */
    asSolidHex() {
        return TkColor.rgbaToHex(this._r, this._g, this._b);
    }

    /**
     * Set the color's hue, saturation, lightness, and alpha.
     * 
     * @param {Number} h The hue of the color (0 - 360).
     * @param {Number} s The saturation of the color (0 - 100).
     * @param {Number} l The lightness of the color (0 - 100).
     * @param {Number} a (optional) The alpha value (0 - 1), defaults to 1.
     */
    setHsla(h, s, l, a = 1) {
        // Check if the given params fall within valid ranges
        let validParams = TkNumber.in(h, 0, 360) && TkNumber.in(s, 0, 100)
            && TkNumber.in(l, 0, 100) && TkNumber.in(a, 0, 1);

        if (validParams) {
            let rgb = TkColor.hslaToRgba(h, s, l);

            this._r = rgb.r;
            this._g = rgb.g;
            this._b = rgb.b;

            this._h = h;
            this._s = s;
            this._l = l;

            this._a = a;

            this.isValid = true;
        } else {
            this.isValid = false;
        }
    }

    /**
     * Get the color as an hsla() string that can be used by CSS.
     * 
     * @param {Number} digits (optional) The number of digits to round each value to, defaults to 0.
     * 
     * @returns {String} The CSS hsla() value of this color.
     */
    asHsla(digits = 0) {
        return `hsla(${TkNumber.fixed(this._h, digits)}, ${TkNumber.fixed(this._s, digits)}%, ${TkNumber.fixed(this._l, digits)}%, ${TkNumber.fixed(this._a, digits)})`;
    }

    /**
     * Set the rgba of this color.
     * 
     * @param {Number} r The red value (0 - 255).
     * @param {Number} g The green value (0 - 255).
     * @param {Number} b The blue value (0 - 255).
     * @param {Number} a The alpha value (0 - 1).
     */
    setRgba(r, g, b, a = 1) {
        let hsla = TkColor.rgbaToHsla(r, g, b);

        // Check if the given parameters fall within valid ranges
        let validParams = TkNumber.in(r, 0, 255) && TkNumber.in(g, 0, 255)
            && TkNumber.in(b, 0, 255) && TkNumber.in(a, 0, 1);

        // Check if the converted HSLA values fall within valid ranges
        let validHsla = TkNumber.in(hsla.h, 0, 360) && TkNumber.in(hsla.s, 0, 100)
            && TkNumber.in(hsla.l, 0, 100);

        if (validParams && validHsla) {
            this._r = r;
            this._g = g;
            this._b = b;

            this._h = hsla.h;
            this._s = hsla.s;
            this._l = hsla.l;

            this._a = a;
            this.isValid = true;
        } else {
            this.isValid = false;
        }
    }

    /**
     * Get the color as an rgba() string that can be used by CSS.
     * 
     * @param {Number} digits (optional) The number of digits to round each value to, defaults to 0.
     * 
     * @returns {String} The rgba() string representing this color.
     */
    asRgba(digits = 0) {
        return `rgba(${TkNumber.fixed(this._r, digits)}, ${TkNumber.fixed(this._g, digits)}, ${TkNumber.fixed(this._b, digits)}, ${TkNumber.fixed(this._a, digits)})`;
    }

    /**
     * Get the luminance of this color.
     * 
     * @returns {Number} The color's luminance.
     */
    getLuminance() {
        let a = [this._r, this._g, this._b].map((v) => {
            v /= 255;

            return v <= 0.03928
                ? v / 12.92
                : Math.pow((v + 0.055) / 1.055, 2.4);
        });

        return (a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722) * this._a;
    }

    /**
     * Calculate the factor that this color contrasts with another color by.
     * 
     * @param {TkColor} otherColor The other color to contrast with.
     * 
     * @returns {Number} The contrast factor with the other color.
     */
    contrastWith(otherColor) {
        return (otherColor.getLuminance() + 0.05) / (this.getLuminance() + 0.05);
    }

    /**
     * @returns {Boolean} If this color is dark (i.e. contrasts with white by a factor > 2.5).
     */
    isDark() {
        return this.contrastWith(new TkColor("white")) > 2.5;
    }

    /**
     * @returns {Boolean} If this color is light (i.e. contrasts with white by a factor <= 2.5).
     */
    isLight() {
        return !this.isDark();
    }

    /**
     * @returns {Boolean} If this color is gray (i.e. has no saturation).
     */
    isGray() {
        return (TkArray.areElementsEqual([this._r, this._g, this._b]));
    }

    /**
     * Register certain color values to be used across all TkColor instances
     * through the setName() and asName() functions.
     * 
     * @param {String} name The name of the color.
     * @param {String} value The value to set is as.
     */
    static register(name, value) {
        let registeredColor = new TkColor(value);
        _TkRegisteredColors.set(name, registeredColor.asHex());
    }

    /**
     * Get the computed property of an element and if it's a color, create an new TkColor from it.            
     * 
     * @param {String|HTMLElement|TkView} from The target to read the property from, accepts the same values 
     * as options.from in the TkView constructor.
     * @param {String} propertyName The name of the property.
     * 
     * @returns {TkColor} The color extracted from that property, if it is a valid color, null if not.
     */
    static fromProperty(from, propertyName) {
        let propertyValue = new TkView({ from: from }).getComputed(propertyName);
        let extractedColor = new TkColor(propertyValue);

        return (extractedColor.isValid) ? extractedColor : null;
    }

    /**
     * Check if a string results in a valid color.
     * 
     * @param {String} colorString The color string to check.
     * 
     * @returns {Boolean} If the given string is a valid color.
     */
    static isColor(colorString) {
        let testColor = new TkColor(colorString);
        return testColor.isValid;
    }

    /**
     * Converts HSLA values to RGBA values.
     * 
     * @param {Number} h The hue of the color (0 - 360).
     * @param {Number} s The saturation of the color (0 - 100).
     * @param {Number} l The lightness of the color (0 - 100).
     * @param {Number} a (optional) The alpha value (0 - 1), defaults to 1.
     * @param {Number} digits (optional) The number of digits to round each value to, defaults to 3.
     * 
     * @returns {{r: Number, g: Number, b: Number, a: Number}} The converted RGBA values.
     */
    static hslaToRgba(h, s, l, a = 1, digits = 3) {
        let r, g, b;

        if (h > 0) h /= 360;
        if (s > 0) s /= 100;
        if (l > 0) l /= 100;

        if (s == 0) {
            r = g = b = l; // achromatic
        } else {
            let hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;

                return p;
            }

            let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            let p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return {
            r: TkNumber.fixed(r * 255, digits),
            g: TkNumber.fixed(g * 255, digits),
            b: TkNumber.fixed(b * 255, digits),
            a: TkNumber.fixed(a, digits)
        };
    }

    /**
     * Convert RGBA values to HSLA values.
     * 
     * @param {Number} r The red value (0 - 255).
     * @param {Number} g The green value (0 - 255).
     * @param {Number} b The blue value (0 - 255).
     * @param {Number} a (optional) The alpha value (0 - 1), defaults to 1.
     * @param {Number} digits (optional) The number of digits to round each value to, defaults to 3.
     * 
     * @returns {{ h: Number, s: Number, l: Number, a: Number }} The RGBA values converted to HSLA.
     */
    static rgbaToHsla(r, g, b, a = 1, digits = 3) {
        r /= 255, g /= 255, b /= 255;
        let max = Math.max(r, g, b);
        let min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max == min) {
            h = s = 0; // achromatic
        } else {
            let d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }

            h /= 6;
        }

        return {
            h: TkNumber.fixed(h * 360, digits),
            s: TkNumber.fixed(s * 100, digits),
            l: TkNumber.fixed(l * 100, digits),
            a: TkNumber.fixed(a, digits)
        };
    }

    /**
     * Convert a hex code to HSLA.
     * 
     * @param {String} hex The hex code.
     * 
     * @returns {{h: Number, s: Number, l: Number, a: Number}} The hex value converted to HSLA.
     */
    static hexToHsla(hex) {
        let rgba = TkColor.hexToRgba(hex);
        return TkColor.rgbaToHsla(rgba.r, rgba.g, rgba.b, rgba.a);
    }

    /**
     * Convert a hex code to RGBA.
     * 
     * @param {String} hex The hex code.
     * 
     * @returns {{r: Number, g: Number, b: Number, a: Number}} The hex value converted to RGBA.
     */
    static hexToRgba(hex) {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);

        // If #rrggbb or #rrggbbaa
        let hexRegex =
            (hex.length == 7) ? /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i
                : /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;

        let result = hexRegex.exec(hex);
        return result ? {
            r: Math.round(parseInt(result[1], 16)),
            g: Math.round(parseInt(result[2], 16)),
            b: Math.round(parseInt(result[3], 16)),
            a: result[4] ?? 1
        } : { r: -1, g: -1, b: -1, a: -1 };
    }

    /**
     * Convert HSLA values to a hex code.
     * 
     * @param {Number} h The hue of a color (0 - 360).
     * @param {Number} s The saturation of a color (0 - 100).
     * @param {Number} l The lightness of a color (0 - 100).
     * @param {Number} a (optional) The alpha of a color (0 - 1), defaults to 1.
     * @param {Boolean} forceAlpha (optional) If the resulting hex code should include an alpha channel, 
     * even if there is no transparency (alpha == 1), defaults to false.
     * 
     * @returns {String} The HSLA value as a hex code.
     */
    static hslaToHex(h, s, l, a = 1, forceAlpha = false) {
        let rgba = this.hslaToRgba(h, s, l, a);
        return this.rgbaToHex(rgba.r, rgba.g, rgba.b, rgba.a, forceAlpha);
    }

    /**
     * Convert RGBA values to a hex code.
     * 
     * @param {Number} r The red value of a color (0 - 255).
     * @param {Number} g The green value of a color (0 - 255).
     * @param {Number} b The blue value of a color (0 - 255).
     * @param {Number} a (optional) The alpha of a color (0 - 1), defaults to 1.
     * @param {Boolean} forceAlpha (optional) If the resulting hex code could should include an alpha channel, 
     * even if there is no transparency (alpha == 1), defaults to false.
     * 
     * @returns {String} The resulting hex code reprenting the color.
     */
    static rgbaToHex(r, g, b, a = 1, forceAlpha = false) {
        let hex = `#${((1 << 24) + (Math.round(r) << 16) + (Math.round(g) << 8) + Math.round(b)).toString(16).slice(1)}`;

        if (a < 1 || forceAlpha) // Include alpha if it has it or forceAlpha == true
            return hex + Math.round(a * 255).toString(16).padStart(2, "0");
        else
            return hex;
    }

}

/**
 * A map of colors that have been registered using the
 * TkColor.register() function. Values are stored in hex.
 * 
 * DO NOT access this directly, only use it through TkColor.
 */
let _TkRegisteredColors = new Map();


/**
 * A list of named CSS colors and their corresponding hex codes.
 */
let _TkCssColors = {
    "aliceblue": "#f0f8ff", "antiquewhite": "#faebd7", "aqua": "#00ffff", "aquamarine": "#7fffd4", "azure": "#f0ffff",
    "beige": "#f5f5dc", "bisque": "#ffe4c4", "black": "#000000", "blanchedalmond": "#ffebcd", "blue": "#0000ff", "blueviolet": "#8a2be2",
    "brown": "#a52a2a", "burlywood": "#deb887", "cadetblue": "#5f9ea0", "chartreuse": "#7fff00", "chocolate": "#d2691e", "coral": "#ff7f50",
    "cornflowerblue": "#6495ed", "cornsilk": "#fff8dc", "crimson": "#dc143c", "cyan": "#00ffff", "darkblue": "#00008b", "darkcyan": "#008b8b",
    "darkgoldenrod": "#b8860b", "darkgray": "#a9a9a9", "darkgreen": "#006400", "darkkhaki": "#bdb76b", "darkmagenta": "#8b008b",
    "darkolivegreen": "#556b2f", "darkorange": "#ff8c00", "darkorchid": "#9932cc", "darkred": "#8b0000", "darksalmon": "#e9967a",
    "darkseagreen": "#8fbc8f", "darkslateblue": "#483d8b", "darkslategray": "#2f4f4f", "darkturquoise": "#00ced1", "darkviolet": "#9400d3",
    "deeppink": "#ff1493", "deepskyblue": "#00bfff", "dimgray": "#696969", "dodgerblue": "#1e90ff", "firebrick": "#b22222",
    "floralwhite": "#fffaf0", "forestgreen": "#228b22", "fuchsia": "#ff00ff", "gainsboro": "#dcdcdc", "ghostwhite": "#f8f8ff",
    "gold": "#ffd700", "goldenrod": "#daa520", "gray": "#808080", "green": "#008000", "greenyellow": "#adff2f", "honeydew": "#f0fff0",
    "hotpink": "#ff69b4", "indianred ": "#cd5c5c", "indigo": "#4b0082", "ivory": "#fffff0", "khaki": "#f0e68c", "lavender": "#e6e6fa",
    "lavenderblush": "#fff0f5", "lawngreen": "#7cfc00", "lemonchiffon": "#fffacd", "lightblue": "#add8e6", "lightcoral": "#f08080",
    "lightcyan": "#e0ffff", "lightgoldenrodyellow": "#fafad2", "lightgrey": "#d3d3d3", "lightgreen": "#90ee90", "lightpink": "#ffb6c1",
    "lightsalmon": "#ffa07a", "lightseagreen": "#20b2aa", "lightskyblue": "#87cefa", "lightslategray": "#778899", "lightsteelblue": "#b0c4de",
    "lightyellow": "#ffffe0", "lime": "#00ff00", "limegreen": "#32cd32", "linen": "#faf0e6", "magenta": "#ff00ff", "maroon": "#800000",
    "mediumaquamarine": "#66cdaa", "mediumblue": "#0000cd", "mediumorchid": "#ba55d3", "mediumpurple": "#9370d8", "mediumseagreen": "#3cb371",
    "mediumslateblue": "#7b68ee", "mediumspringgreen": "#00fa9a", "mediumturquoise": "#48d1cc", "mediumvioletred": "#c71585",
    "midnightblue": "#191970", "mintcream": "#f5fffa", "mistyrose": "#ffe4e1", "moccasin": "#ffe4b5", "navajowhite": "#ffdead",
    "navy": "#000080", "oldlace": "#fdf5e6", "olive": "#808000", "olivedrab": "#6b8e23", "orange": "#ffa500", "orangered": "#ff4500",
    "orchid": "#da70d6", "palegoldenrod": "#eee8aa", "palegreen": "#98fb98", "paleturquoise": "#afeeee", "palevioletred": "#d87093",
    "papayawhip": "#ffefd5", "peachpuff": "#ffdab9", "peru": "#cd853f", "pink": "#ffc0cb", "plum": "#dda0dd", "powderblue": "#b0e0e6",
    "purple": "#800080", "rebeccapurple": "#663399", "red": "#ff0000", "rosybrown": "#bc8f8f", "royalblue": "#4169e1", "saddlebrown": "#8b4513",
    "salmon": "#fa8072", "sandybrown": "#f4a460", "seagreen": "#2e8b57", "seashell": "#fff5ee", "sienna": "#a0522d", "silver": "#c0c0c0",
    "skyblue": "#87ceeb", "slateblue": "#6a5acd", "slategray": "#708090", "snow": "#fffafa", "springgreen": "#00ff7f", "steelblue": "#4682b4",
    "tan": "#d2b48c", "teal": "#008080", "thistle": "#d8bfd8", "tomato": "#ff6347", "turquoise": "#40e0d0", "violet": "#ee82ee",
    "wheat": "#f5deb3", "white": "#ffffff", "whitesmoke": "#f5f5f5", "yellow": "#ffff00", "yellowgreen": "#9acd32"
};