/*
    tamarack/core is a collection of classes used by all other tamarack modules.
*/

/**
 * Stores info about tamarack.
 */
class Tamarack {

    /**
     * Get the tamarack version.
     */
    static get version() {
        return 0.3;
    }

}

/**
 * The sane approach would be to extend EventTarget, but since
 * Safari is really embracing its role as the new Internet Explorer, 
 * we can't do that.
 * 
 * Instead create a document fragment as a delegate and
 * attach/dispatch events from that.
 */
class TkEmitter {

    constructor() {
        let delegate = document.createDocumentFragment();
        let functions = ["addEventListener", "dispatchEvent", "removeEventListener"];

        // Map the class functions to the delegate functions
        functions.forEach(func => this[func] = (...args) => delegate[func](...args));
    }

}

/**
 * Represents an object whose state can be tracked by
 * emitting events when its validity has changed.
 */
class TkStateObject extends TkEmitter {

    /**
     * Create a TkStateObject.
     * 
     * @param {Object} options The options object.
     * @param {Boolean} options.hasIntialized If the object has been fully initialized.
     * @param {Boolean} options.isValid If the object is in a valid state.
     */
    constructor(options = {}) {
        super();

        this._hasIntialized = options.hasIntialized ?? false;
        this._isValid = options.isValid ?? false;

        this.becameInvalid = new Event("becameinvalid");
        this.becameValid = new Event("becamevalid");
        this.onInitialize = new Event("oninitialize");
    }

    /**
     * If the object has been fully initialized.
     * @type {Boolean}
     */
    get hasIntialized() {
        return this._hasIntialized;
    }

    set hasIntialized(value) {
        this._hasIntialized = value;
        this.dispatchEvent(this.onInitialize);
    }

    /**
     * If the object is in a valid state.
     * @type {Boolean}
     */
    get isValid() {
        return this._isValid;
    }

    set isValid(value) {
        let oldValid = this._isValid;
        this._isValid = value;

        // If the valid flag has changed, dispach
        // the corresponding event
        if (this._isValid != oldValid) {
            if (this._isValid)
                this.dispatchEvent(this.becameValid);
            else
                this.dispatchEvent(this.becameInvalid);
        }
    }

}

/**
 * A class of static functions dealing with JavaScript objects.
 */
class TkObject {

    /**
     * Check if a type exists
     * 
     * @param {Any} type The type to check.
     */
    static typeExists(type) {
        return typeof type === "function";
    }

    /**
     * Check if an object is an instance of a type.
     * 
     * @param {Any} obj The object whose type is being checked.
     * @param {Any} type The type to check.
     * 
     * @returns {Boolean} If the object is an instance of the type.
     */
    static is(obj, type) {
        let normalizedType = type.name.toLowerCase();

        switch (normalizedType) {
            case "string":
                return TkObject.isString(obj);
            case "boolean":
                return TkObject.isBool(obj);
            default:
                return typeof (obj) === type.name || obj instanceof type;
        }
    }

    /**
     * If an object is a boolean.
     * 
     * @param {Any} obj The object to check.
     * 
     * @returns {Boolean} If the object is a boolean.
     */
    static isBool(obj) {
        return typeof (obj) === "boolean" || obj instanceof Boolean;
    }

    /**
     * If an object is a string.
     * 
     * @param {Any} obj The object to check.
     * 
     * @returns {Boolean} If the object is a string.
     */
    static isString(obj) {
        return typeof (obj) === "string" || obj instanceof String;
    }

    /**
     * If an object is an array.
     * 
     * @param {Any} obj The object to check.
     * 
     * @returns {Boolean} If the object is an array.
     */
    static isArray(obj) {
        return (obj.constructor === Array);
    }

}

/**
 * A static class containing functions to work with
 * arrays.
 */
class TkArray {

    /**
     * Check if all elements in an array are equal.
     * 
     * @param {Any[]} array The array to check.
     * 
     * @returns {Boolean} If all items are the same.
     */
    static areElementsEqual(array) {
        for (var i = 0; i < array.length; i++)
            for (var j = 0; j < array.length; j++)
                if (array[i] !== array[j])
                    return false;

        return true;
    }

    /**
     * Remove an element from an array.
     * 
     * @param {Any[]} array The array to remove an element from.
     * @param {Any} element The element to remove.
     */
    static remove(array, element) {
        array.splice(array.indexOf(element), 1);
    }

    /**
     * Remove an element at an index from an array.
     * 
     * @param {Any[]} array The array to remove an element from.
     * @param {Number} index The index of the element to remove.
     */
    static removeAt(array, index) {
        array.splice(index, 1);
    }

    /**
     * Loop over an array from 0 to the last index.
     * 
     * @param {Any[]} array The array to loop over.
     * @param {Function(Any, Number)} callback A callback that it passed each element in the 
     * array, along with its index.
     */
    static ascend(array, callback) {
        for (let i = 0; i < array.length; i++)
            callback(array[i], i);
    }

    /**
     * Loop over an array from the last down to 0.
     * 
     * @param {Any[]} array The array to loop over.
     * @param {Function(Any, Number)} callback A callback that it passed each element in the 
     * array, along with its index.
     */
    static descend(array, callback) {
        for (let i = array.length - 1; i >= 0; i--)
            callback(array[i], i);
    }

    /**
     * Pick a random element from an array.
     * 
     * @param  {...Any} array The array to use.
     * 
     * @returns {Any} A random element of the array.
     */
    static random(...array) {
        return array[TkNumber.random(0, array.length - 1)];
    }

    /**
     * Move an item from one position in an array to
     * another.
     * 
     * @param {Any[]} array The array to modify.
     * @param {Number} fromIndex The index of the item to move.
     * @param {Number} toIndex The index of the item's destination.
     */
    static move(array, fromIndex, toIndex) {
        let element = array[fromIndex];
        array.splice(fromIndex, 1);
        array.splice(toIndex, 0, element);
    }

}

/**
 * A static class containing functions to work with 
 * numbers.
 */
class TkNumber {

    /**
     * Get a number rounded to a fixed number of decimals.
     * 
     * @param {Number} number The number to round.
     * @param {Number} digits The number of digits after the decimal point.
     * @param {Number} base (default: 10) The base of the number.
     * 
     * @returns {Number} The rounded number.
     */
    static fixed(number, digits, base = 10) {
        var pow = Math.pow(base, digits);
        return Math.round(number * pow) / pow;
    }

    /**
     * Check if a number is in a range, inclusive.
     * 
     * @param {Number} number The number to check.
     * @param {Number} from The lower bound.
     * @param {Number} to The upper bound.
     * 
     * @returns {Boolean} If the number is in range.
     */
    static in(number, from, to) {
        return (number >= from && number <= to);
    }

    /**
     * Pick a random number in a range, inclusive.
     * 
     * @param {Number} min The minimum number.
     * @param {Number} max The maximum number.
     * 
     * @returns {Number} A random number.
     */
    static random(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);

        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Pick a random number in a range, inclusive and with decimals.
     * 
     * @param {Number} min The minimum number.
     * @param {Number} max The maximum number.
     * 
     * @returns {Number} A random number with decimals.
     */
    static randomDecimal(min, max) {
        return Math.random() < 0.5 ?
            ((1 - Math.random()) * (max - min) + min) : (Math.random() * (max - min) + min);
    }

    /**
     * Get the percentage that a value is of a max value.
     * 
     * @param {Number} value The value.
     * @param {Number} max The max value.
     * @param {Number?} digits If specified, round to the number of digits after the decimal point.
     */
    static toPercent(value, max, digits = null) {
        let result = ((value * 100) / max);
        return (digits === null) ? result : TkNumber.fixed(result, digits);
    }

    /**
     * Get the percentage as a string (i.e. with a %).
     * 
     * @param {Number} value The value.
     * @param {Number} max The max value.
     * @param {Number?} digits If specified, round to the number of digits after the decimal point.
     */
    static toPercentStr(value, max, digits = null) {
        return `${this.toPercent(value, max, digits)}%`;
    }


    /**
     * Get value from a percentage.
     * 
     * @param {Number} value The value.
     * @param {Number} max The max value.
     */
    static fromPercent(value, max) {
        return ((value * max) / 100);
    }

}

/**
 * A static class containing functions to simplify document manipulation.
 */
class TkDocument {

    /**
     * Clear every child from the document.body.
     */
    static clear() {
        // Remove left over elements
        while (document.body.firstChild)
            document.body.removeChild(document.body.firstChild);
    }

    /**
     * Get the <head> element of the document.
     * @type {HTMLElement}
     */
    static get headElement() {
        return document.querySelector("head");
    }

    /**
     * Get the favicon element of the document, if it exists.
     * @type {HTMLElement}
     */
    static get iconElement() {
        return document.querySelector("link[rel='icon']");
    }

    /**
     * The source of the document's icon. Set to null to make
     * transparent.
     * @type {String}
     */
    static get icon() {
        let iconElement = TkDocument.iconElement;
        return (iconElement != null) ? iconElement.getAttribute("href") : "";
    }

    static set icon(value) {
        // Interpret a null value as a transparent image.
        //
        // This is needed because Chrome caches the old favicon
        // even *after* the browser's cache is cleared,
        // so this provides an easy way to reset it.
        if (value === null) {
            value = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9oFFAADATTAuQQAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAEklEQVQ4y2NgGAWjYBSMAggAAAQQAAGFP6pyAAAAAElFTkSuQmCC";
        }

        // Find the favicon element if it exists
        let iconElement = TkDocument.iconElement;

        if (iconElement != null) { // The favicon exists, so change it
            iconElement.setAttribute("href", value);
        } else { // The favicon doesn't already exist, so make a new one
            let headElement = TkDocument.headElement;
            iconElement = document.createElement("link");
            iconElement.setAttribute("rel", "icon");
            iconElement.setAttribute("href", value);
            headElement.appendChild(iconElement);
        }
    }

    /**
     * If the document is currently fullscreen.
     * 
     * @type {Boolean}
     */
    static get isFullscreen() {
        return (TkDocument.fullscreenElement === document.documentElement);
    }

    static set isFullscreen(value) {
        TkDocument.fullscreenElement = (value) ? document.documentElement : null;
    }

    /**
     * Switch between fullscreen and regular states.
     */
    static toggleFullscreen() {
        if (this.isFullscreen)
            TkDocument.fullscreenElement = null;
        else
            TkDocument.fullscreenElement = document.documentElement;
    }

    /**
     * The fullscreen element of the document.
     * 
     * @type {HTMLElement}
     */
    static get fullscreenElement() {
        if (document.fullscreenElement)
            return document.fullscreenElement;
        else if (document.mozFullScreenElement)
            return document.mozFullScreenElement;
        else if (document.webkitFullscreenElement)
            document.webkitFullscreenElement;

        return null;
    }

    static set fullscreenElement(element) {
        if (element === null) { // Exit fullscreen
            if (document.exitFullscreen)
                document.exitFullscreen();
            else if (document.webkitExitFullscreen)
                document.webkitExitFullscreen();
            else if (document.mozCancelFullScreen)
                document.mozCancelFullScreen();
        } else { // Go fullscreen
            if (element.requestFullscreen)
                element.requestFullscreen();
            else if (element.mozRequestFullScreen)
                element.mozRequestFullScreen();
            else if (element.webkitRequestFullscreen)
                element.webkitRequestFullscreen();
        }
    }

    /**
     * Call a function when the document has loaded.
     *       
     * @param {Function} callback The function to call when the document has loaded.
     */
    static whenLoaded(callback) {
        if (document.readyState !== "loading") {
            callback();
        } else {
            document.addEventListener("DOMContentLoaded", callback);
        }
    }

    /**
     * @returns {Boolean} If the system is in dark mode.
     */
    static isInDarkMode() {
        return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    }

    /**
     * Attach an event to run when a switch is detected in the appearance.
     * Either to light mode or dark mode.
     * 
     * @param {function(MediaQueryListEvent):void} callback The callback to run with this event.
     */
    static onChangeDarkMode(callback) {
        window.matchMedia("(prefers-color-scheme: dark)").addListener(callback);
    }

    /**
     * Update the attribute on the HTML element to either [dark-mode]
     * or [light-mode].
     */
    static updateDarkModeAttribute() {
        let htmlNode = document.querySelector("html");
        if (TkDocument.isInDarkMode()) {
            htmlNode.removeAttribute("light-mode");
            htmlNode.setAttribute("dark-mode", "");
        } else {
            htmlNode.setAttribute("light-mode", "");
            htmlNode.removeAttribute("dark-mode");
        }
    }

}

// Update the dark mode attribute so that tamarack.css dark mode works
// and attach handler to watch for change
TkDocument.updateDarkModeAttribute();
TkDocument.onChangeDarkMode(() => TkDocument.updateDarkModeAttribute());