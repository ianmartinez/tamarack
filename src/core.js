/*
    tamarack/core is a collection of classes used by all other tamarack modules.
*/

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
 * emitting events when it has changed.
 */
class TkStateObject extends TkEmitter {

    constructor(options = {}) {
        super();

        this._hasIntialized = options.hasIntialized ?? false;
        this._isValid = options.isValid ?? false;

        this.becameInvalid = new Event("becameInvalid");
        this.becameValid = new Event("becameValid");
        this.onInitialize = new Event("onInitialize");
    }

    get hasIntialized() {
        return this._hasIntialized;
    }

    set hasIntialized(value) {
        this._hasIntialized = value;
        this.dispatchEvent(this.onInitialize);
    }

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

class TkObject {

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

    static isBool(obj) {
        return typeof (obj) === "boolean" || obj instanceof Boolean;
    }

    static isString(obj) {
        return typeof (obj) === "string" || obj instanceof String;
    }

    static isArray(obj) {
        return (obj.constructor === Array);
    }

}

/**
 * A static class containing functions to work with
 * arrays.
 */
class TkArray {

    static areElementsEqual(array) {
        for (var i = 0; i < array.length; i++)
            for (var j = 0; j < array.length; j++)
                if (array[i] !== array[j])
                    return false;

        return true;
    }

    static remove(array, element) {
        array.splice(array.indexOf(element), 1);
    }

    static removeAt(array, index) {
        array.splice(index, 1);
    }

    static ascend(array, callback) {
        for (let i = 0; i < array.length; i++)
            callback(array[i], i);
    }

    static descend(array, callback) {
        for (let i = array.length - 1; i >= 0; i--)
            callback(array[i], i);
    }

	static random(...array) {
		return array[TkNumber.random(0, array.length - 1)];
    }
    
}

/**
 * A static class containing functions to work with 
 * numbers.
 */
class TkNumber {

    static fixed(number, digits, base = 10) {
        var pow = Math.pow(base, digits);
        return Math.round(number * pow) / pow;
    }

    static in(number, from, to) {
        return (number >= from && number <= to);
    }

    static random(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);

		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	static randomDecimal(min, max) {
		return Math.random() < 0.5 ? 
			((1-Math.random()) * (max-min) + min) : (Math.random() * (max-min) + min);
	}

}

class TkDocument {

    static get title() {
        return document.title;
    }

    static set title(value) {
        document.title = value;
    }

    static get icon() {
        return "";
    }

    static set icon(value) {

    }

    static get isFullscreen() {
        return (TkDocument.fullscreenElement === document.documentElement);
    }

    static set isFullscreen(value) {
        TkDocument.fullscreenElement = (value) ? document.documentElement : null;
    }

    static toggleFullscreen() {
        if (this.isFullscreen)
            TkDocument.fullscreenElement = null;
        else
            TkDocument.fullscreenElement = document.documentElement;
    }

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
     * 
     * @param {*} callback 
     */
    static whenLoaded(callback) {
        document.addEventListener("DOMContentLoaded", callback);
    }

    /**
     * @returns {Boolean} If the system is in dark mode.
     */
    static isInDarkMode() {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    /**
     * Attach an event to run when a switch is detected in the appearance.
     * Either to light mode or dark mode.
     * 
     * @param {function(MediaQueryListEvent):void} callback The callback to run with this event.
     */
    static onChangeDarkMode(callback) {
        window.matchMedia('(prefers-color-scheme: dark)').addListener(callback);
    }

}