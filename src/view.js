/**
 * Requires: 
 *  tamarack/core
 */

/**
 * An enum representing the direction 
 * to place the child elements in a 
 * TkStack. 
 * @enum {String}
 */
const TkStackDirection = {
    HORIZONTAL: "tkstack-h",
    VERTICAL: "tkstack-v",
    HORIZONTAL_REVERSE: "tkstack-hr",
    VERTICAL_REVERSE: "tkstack-vr",
    FLOW: "tkstack-flow",
    FLOW_REVERSE: "tkstack-flowr"
};

/**
 * An enum representing the labout of
 * the text and icon in a TkLabel. 
 * 
 * If applied to any label, it affects
 * that label. If applied to a container,
 * it affect every label in that container.
 * @enum {String}
 */
const TkLabelLayout = {
    DEFAULT: "tklabel-default",
    ICON_TOP: "tklabel-icon-top",
    ICON_BOTTOM: "tklabel-icon-bottom",
    ICON_LEFT: "tklabel-icon-left",
    ICON_RIGHT: "tklabel-icon-right",
    ICON_ONLY: "tklabel-icon-only",
    TEXT_ONLY: "tklabel-text-only",
};

/**
 * An enum for the different classes of button style.
 * @enum {String}
 */
const TkButtonStyle = {
    NONE: "",
    PRIMARY: "tkprimary",
    SECONDARY: "tksecondary",
    SUCCESS: "tksuccess",
    DANGER: "tkdanger",
    WARNING: "tkwarning"
};

/**
 * An enum representing the
 * button clicked on a TkChoiceBox.
 */
const TkModalResult = {
    NOTHING: "Nothing",
    OK: "OK",
    CANCEL: "Cancel",
    CLOSE: "Close",
    ABORT: "Abort",
    IGNORE: "Ignore",
    YES: "Yes",
    NO: "No",
    RETRY: "Retry"
};

/**
 * Represents an HTML element and exposes additional 
 * functionality that makes manipulating elements easier.
 */
class TkView {

    /**
     * Create a TkView, either from an existing element or representing a new one.
     * 
     * @param {String|HTMLElement|TkView} [options.parent] The view's parent.
     * @param {String|HTMLElement|TkView} [options.from] If representing an existing element, where to find it, 
     * be it from a CSS selector (String), and existing element (HTMLElement), or another TkView.
     * @param {String} [options.tag] If representing a new element, the tag of the element to create.
     * @param {Any} [options.attributes] The attributes to set for the element, in the format of 
     * {"attribute1": "value1", "attribute2": "value2"}.
     * @param {Any} [options.events] The events to set for the element, in the format of 
     * {"event1": callback, "event2": callback}.
     * @param {String[]} [options.classes] An array of CSS classes for the view.
     * @param {String} [options.id] The id of the view.
     * @param {String} [options.style] The value of style attribute of the element to set.
     * @param {{String|HTMLElement|TkView}[]} [options.children] An array of children of this view.
     * @param {Boolean} [options.fill=false] If the view should fill its parent.
     * @param {Boolean} [options.visible=true] If the view is visible.
     * @param {Any} [options.data] The data associated with this view.
     */
    constructor(options = {}, additionalOptions = null) {
        if (additionalOptions !== null)
            Object.assign(options, additionalOptions);

        this._element = null;
        this._childViews = [];
        this._parentView = null;

        // If no tag is specified, default to <div>
        let tag = options.tag ?? "div";

        // Set the element
        if (options.from !== undefined) { // From an existing element
            if (TkObject.is(options.from, String)) { // Selector
                this._element = document.querySelector(options.from);
            } else if (TkObject.is(options.from, HTMLElement)) { // HTMLElement
                this._element = options.from;
            } else if (TkObject.is(options.from, TkView)) { // Other TkView
                this._element = options.from.e;
            }
        } else if (options.hasOwnProperty("from")) { // Error if specified but invalid value
            throw "ERROR: Source (options.from) was specified but has a value of undefined";
        } else { // Create a new element if no source is specified
            this._element = document.createElement(tag);
        }

        // Add an attribute showing that the HTML element
        // is controlled by a TkView
        this._element.setAttribute("tkview", "");

        // Set the parent, if specified
        if (options.parent !== undefined)
            this.parent = options.parent;
        else if (options.hasOwnProperty("parent")) // Error if specified but invalid value
            throw "ERROR: Parent (options.parent) was specified but has a value of undefined";

        // Add the CSS classes, if specified 
        if (options.classes !== undefined)
            this.addClass(...options.classes);

        // The view's id, if specified
        if (options.id !== undefined)
            this.id = options.id;

        // Add any attributes, if specified
        if (options.attributes !== undefined) {
            for (let attributeName of Object.keys(options.attributes)) {
                let value = options.attributes[attributeName];

                if (value == null)
                    this.addAttribute(attributeName);
                else
                    this.setAttribute(attributeName, value);
            }
        }

        // Store events created with TkView.on()
        this.events = [];

        // Add event handlers, if specified
        if (options.events !== undefined) {
            for (let eventName of Object.keys(options.events)) {
                let callback = options.events[eventName];
                this.on(eventName, callback);
            }
        }

        // Add the style attribute from options.style, if specified
        if (options.style !== undefined) {
            this.setAttribute("style", options.style);
        }

        // Add children, if specified
        if (options.children !== undefined) {
            this.add(...options.children);
        }

        // Fill, if specified
        if (options.fill)
            this.addAttribute("tk-fill");

        // Set visibility, if specified
        if (options.visible !== undefined)
            this.visible = options.visible;


        // Set data, if specified
        if (options.data !== undefined)
            this.data = options.data;
    }

    /**
     * Get all the TkViews currently in the DOM.
     * @type {TkView[]}
     */
    static get all() {
        let views = [];

        for (let viewElement of document.querySelectorAll("[tkview]"))
            views.push(new TkView({ from: viewElement }));

        return views;
    }

    /**
     * Internal only: The name of the view used internally by Tamarack.
     * 
     * @param {String} value The view name to be added.
     */
    addViewName(value) {
        this.addAttribute(value);
    }

    /**
     * The element of the view.
     * @type {HTMLElement}
     */
    get e() {
        return this._element;
    }

    set e(value) {
        // If there's a parent, set that as 
        // the new parent view
        if (value.parentElement)
            this._parentView = new TkView({ from: value.parentElement });

        // Point to the new element
        this._element = value;

        // Rebuild child view array
        this._childViews = this.childElementsAsViews;
    }

    /**
     * Find the first child element of this view's element
     * that matches a selector.
     * 
     * @param {String} selector The selector to query.
     */
    select(selector) {
        return this.e.querySelector(selector);
    }

    /**
     * Find the all child elements of this view's element
     * that match a selector.
     * 
     * @param {String} selector The selector to query.
     */
    selectAll(selector) {
        return this.e.querySelectorAll(selector);
    }

    /**
     * The tag name of the view's element.
     * @type {String}
     */
    get tag() {
        return this.e.tagName;
    }

    /**
     * Remove this element from its parent.
     */
    delete() {
        if (this._parentView)
            this._parentView.remove(this);
        else
            this.e.remove();
    }

    /**
     * Replace an existing child view with a new
     * 
     * @param {TkView} oldChild The old child view.
     * @param {TkView} newChild The new child view.
     */
    replace(oldChild, newChild) {
        if (!oldChild || !newChild)
            throw "Both the old child view and new child view must be specified";

        // Replace existing child
        oldChild.e.replaceWith(newChild.e);

        // Update child view data of this view
        for (let i = 0; i < this._childViews.length; i++) {
            if (this._childViews[i] == oldChild) {
                this._childViews[i] == newChild;
                continue;
            }
        }
    }

    /**
     * A list of child elements of the element.
     * @type {HTMLCollection}
     */
    get childElements() {
        return this.e.children;
    }

    /**
     * An array of child elements of the view's element, represented
     * as TkViews.
     * @type {TkView[]}
     */
    get childElementsAsViews() {
        let childElements = [];

        for (let childElement of this.e.children)
            childElements.push(new TkView({ from: childElement }));

        return childElements;
    }

    /**
     * An array of child views to the view's element.
     * @type {TkView[]}
     */
    get children() {
        let childViews = [];

        for (let childElement of this.e.children) {
            // Find the view representing this child, if it exists.
            let matchingView = this._childViews.find(view => view.e == childElement);

            // If it does, add it to the array. If not, create a new TkView and 
            // add it to the array.
            childViews.push(matchingView ?? new TkView({ from: childElement }));
        }

        return childViews;
    }

    /**
     * The parent element of the view's element, represented as a TkView.
     * It always returns a TkView, but when setting its value, it will also 
     * accept plain HTMLElements and CSS selectors.
     * @type {TkView}
     */
    get parent() {
        if (this._parentView != null) {
            return this._parentView;
        } else {
            let parentElement = this.e.parentElement;
            return (parentElement != null) ? new TkView({ from: parentElement }) : null;
        }
    }

    set parent(value) {
        // Remove from DOM
        this.delete();

        // Set the new parent
        if (TkObject.is(value, TkView)) { // Other TkView
            value.add(this);
        } else if (TkObject.is(value, String)) { // Selector
            document.querySelector(value)?.appendChild(this.e);
        } else if (TkObject.is(value, HTMLElement)) {  // HTMLElement
            value.appendChild(this.e);
        }
    }

    /**
     * Add child items to this view. The child items can be
     * other TkViews, HTMLElements, or CSS selectors representing
     * HTMLElements.
     * 
     * @param  {...String|HTMLElement|TkView} items The items to add.
     */
    add(...items) {
        for (let item of items) {
            if (TkObject.is(item, TkView)) { // Other TkView
                this.e.appendChild(item.e);
                item._parentView = this;
                this._childViews.push(item);
                this.trigger("childadded", item);
            } else if (TkObject.is(item, String)) { // Selector
                let selectedItem = document.querySelector(item);
                if (selectedItem)
                    this.e.appendChild(selectedItem);
                this.trigger("childadded", selectedItem);
            } else if (TkObject.is(item, HTMLElement)) { // HTMLElement
                this.e.appendChild(item);
                this.trigger("childadded", item);
            }
        }
    }

    /**
     * Remove child items from this view. The child items can be
     * other TkViews, HTMLElements, or CSS selectors representing
     * HTMLElements.
     * 
     * @param  {...String|HTMLElement|TkView} items The items to remove.
     */
    remove(...items) {
        for (let item of items) {
            if (TkObject.is(item, TkView)) { // Other TkView
                if (this.e.contains(item.e))
                    this.e.removeChild(item.e);
                item._parentView = null;
                TkArray.remove(this._childViews, item);
                this.trigger("childremoved", item);
            } else if (TkObject.is(item, String)) { // Selector
                let selectedItem = document.querySelector(item);
                if (selectedItem)
                    if (this.e.contains(selectedItem))
                        this.e.removeChild(selectedItem);
                this.trigger("childremoved", selectedItem);
            } else if (TkObject.is(item, HTMLElement)) { // HTMLElement
                if (this.e.contains(item))
                    this.e.removeChild(item);
                this.trigger("childremoved", item);
            }
        }
    }

    /**
     * Remove all children from this view.
     */
    clear() {
        // Remove views
        this.remove(...this._childViews);

        // Remove left over elements
        while (this.e.firstChild) {
            let firstChild = this.e.firstChild;
            this.e.removeChild(firstChild);
            this.trigger("childremoved", firstChild);
        }
    }

    /**
     * Attach an event handler to evenst on the element of
     * the view.
     * 
     * @param {String} eventName The names of the events (delimited by " ").
     * @param {function(TkView, Event)} callback The function to run when the event
     * is triggered. This function is passed target view.
     * @param {Boolean?} useCapture If this event will use capture.
     */
    on(eventName, callback, useCapture = false) {
        let eventNames = eventName.split(" ");
        let view = this;

        for (let eventName of eventNames) {
            let eventOptions = {
                name: eventName,
                callback: callback,
                adjustedCallback: (event) => callback(view, event)
            };
            this.events.push(eventOptions);
            this.e.addEventListener(eventName, eventOptions.adjustedCallback, useCapture);
        }
    }

    /**
     * Remove an event handler added with the on() function. 
     * If only the name is specified, than *all* event handlers with
     * the given event name will be removed.
     * 
     * @param {String} eventName The name of the event.
     * @param {function(TkView, Event)?} callback The callback. If null, all callbacks
     * with the event name will be removed
     */
    off(eventName, callback) {
        let matchingEvents = [];

        for (let event of this.events) {
            if (callback !== undefined) { // Removing a specific event by name *and* callback
                if (eventName === event.name && event.callback === callback) {
                    matchingEvents.push(event);
                    continue;
                }
            } else { // Removing all events by name
                if (eventName === event.name) {
                    matchingEvents.push(event);
                }
            }
        }

        for (let matchingEvent of matchingEvents) {
            this.e.removeEventListener(eventName, matchingEvent.adjustedCallback);
            this.events.splice(this.events.indexOf(matchingEvent), 1);
        }
    }

    /**
     * Trigger and event on the element of the view.
     * 
     * @param {String} eventName The name of the event to trigger.
     * @param {Object?} data The data of the event (event.detail).
     */
    trigger(eventName, data) {
        let event = (data === undefined)
            ? new Event(eventName) : new CustomEvent(eventName, { detail: data });
        return this.e.dispatchEvent(event);
    }

    /**
     * Iterate over each child view, ascending.
     * 
     * @param {function(TkView, Number)} callback The function to
     * run on each child TkView, passed the view and its index.
     */
    ascendChildren(callback) {
        TkArray.ascend(this.children, callback);
    }

    /**
     * Iterate over each child view, descending.
     * 
     * @param {function(TkView, Number)} callback The function to
     * run on each child TkView, passed the view and its index.
     */
    descendChildren(callback) {
        TkArray.descend(this.children, callback);
    }

    /**
     * Move an view up among the children of its parent.
     * @returns {Boolean} If the view's element was moved.
     */
    moveUp() {
        let parent = this.parent;

        if (parent && this.e.previousElementSibling) {
            parent.e.insertBefore(this.e, this.e.previousElementSibling);
            parent.trigger("childmoved", this);
            return true;
        }

        return false;
    }

    /**
     * Move an view down among the children of its parent.
     * @returns {Boolean} If the view's element was moved.
     */
    moveDown() {
        let parent = this.parent;

        if (parent && this.e.nextElementSibling) {
            parent.e.insertBefore(this.e.nextElementSibling, this.e);
            parent.trigger("childmoved", this);
            return true;
        }

        return false;
    }

    /**
     * Move an view to the top among the children of its parent.
     * @returns {Boolean} If the view's element was moved.
     */
    moveToTop() {
        let parent = this.parent;

        if (parent && parent.e.firstChild && parent.e.firstChild !== this.e) {
            parent.e.removeChild(this.e);
            parent.e.insertBefore(this.e, parent.e.firstChild);
            parent.trigger("childmoved", this);
            return true;
        }

        return false;
    }

    /**
     * Move an view to the bottom among the children of its parent.
     * @returns {Boolean} If the view's element was moved.
     */
    moveToBottom() {
        let parent = this.parent;

        if (parent && parent.e.lastChild !== this.e) {
            parent.e.removeChild(this.e);
            parent.e.appendChild(this.e);
            parent.trigger("childmoved", this);
            return true;
        }

        return false;
    }

    /**
     * @returns {CSSStyleDeclaration} The element's style.
     */
    get style() {
        return this.e.style;
    }

    /**
     * Get the computed value of one of the element's properties.
     * 
     * @param {String} propertyName The property's name.
     */
    getComputed(propertyName) {
        return window.getComputedStyle(this.e, null).getPropertyValue(propertyName);
    }

    /**
     * @returns {Boolean} If the active element in the document is the
     * view's element.
     */
    hasFocus() {
        return (document.activeElement == this.e);
    }

    /**
     * Focus the view.
     */
    focus() {
        this.e.focus();
    }

    /**
     * If the element is visible or not.
     * 
     * @type {Boolean}
     */
    get visible() {
        return this.getComputed("display") != "none";
    }

    set visible(value) {
        if (value)
            this.removeAttribute("tk-hide");
        else
            this.addAttribute("tk-hide");
    }

    /**
     * The CSS classes of the view's element. The setter 
     * will also accept a string array of class names.
     * @type {DOMTokenList}
     */
    get classes() {
        return this.e.classList;
    }

    set classes(value) {
        // Remove old classes
        this.clearClasses();

        // Add new ones
        if (TkObject.is(value, DOMTokenList)) { // An element.classList
            value.forEach((className) => this.e.classList.add(className));
        } else { // A bare array
            this.addClass(...value);
        }
    }

    /**
     * Remove all classes from the view's element.
     */
    clearClasses() {
        this.e.removeAttribute("class");
    }

    /**
     * Add classes to the class list of the view's element.
     * 
     * @param  {...String} classes The classes to add.
     */
    addClass(...classes) {
        classes.forEach((className) => {
            if (!this.hasClass(className) && className != "")
                this.e.classList.add(className);
        });
    }

    /**
     * Remove classes from the class list of the view's element.
     * 
     * @param  {...String} classes The classes to remove.
     */
    removeClass(...classes) {
        classes.forEach((className) =>
            this.e.classList.remove(className));
    }
    /**
     * Toggle classes in the class list of the view's element.
     * 
     * @param  {...String} classes The classes to toggle.
     */
    toggleClass(...classes) {
        classes.forEach((className) =>
            this.e.classList.toggle(className));
    }

    /**
     * Find the name of the class at a specific index in the class
     * list of the view's element.
     * 
     * @param {Number} index The index of the class.
     * 
     * @returns {String} The class name.
     */
    classAt(index) {
        return this.e.classList.item(index);
    }

    /**
     * Check if the class list of the view's element contains
     * a class with a given name.
     * 
     * @param {String} className The name of the class to search for.
     * 
     * @returns {Boolean} If the class list contains the class.
     */
    hasClass(className) {
        return this.e.classList.contains(className);
    }

    /**
     * Check if the view's element has an attribute.
     * 
     * @param {String} attribute The attribute's name.
     * 
     * @returns {Boolean} If the attribute was found.
     */
    hasAttribute(attribute) {
        return this.e.hasAttribute(attribute);
    }

    /**
     * Get the value of an attribute of the view's element.
     * 
     * @param {String} attribute The attribute's name.
     * 
     * @returns {String} The attribute's value.
     */
    getAttribute(attribute) {
        return this.e.getAttribute(attribute);
    }


    /**
     * Set the value of an attribute of the view's element.
     * 
     * @param {String} attribute The attribute's name.
     * @param {String} value The attribute's value.
     */
    setAttribute(attribute, value) {
        this.e.setAttribute(attribute, value);
    }

    /**
     * Remove attributes from the view's element.
     * 
     * @param {String} attributes The attributes' names.
     */
    removeAttribute(...attributes) {
        for (let attribute of attributes)
            this.e.removeAttribute(attribute);
    }

    /**
     * Add attributes to the view's element.
     * 
     * @param {String} attributes The attributes' names.
     */
    addAttribute(...attributes) {
        for (let attribute of attributes)
            this.e.setAttributeNode(document.createAttribute(attribute));
    }

    /**
     * Add an attributes if they don't exist, remove them if they do.
     * 
     * @param  {...String} attributes The attributes' names.
     */
    toggleAttribute(...attributes) {
        for (let attribute of attributes)
            this.e.toggleAttribute(attribute);
    }

    /**
     * Add a set of attributes if a condition is true, remove them
     * if it is not.
     * 
     * @param {Boolean} condition If the attribute should be added (true) or removed (false).
     * @param  {...String} attributes The attributes' names.
     */
    attributeIf(condition, ...attributes) {
        if (condition)
            this.addAttribute(...attributes);
        else
            this.removeAttribute(...attributes);
    }

    /**
     * Remove the old attributes found in an enum from the 
     * view's element and add new attribute it its place.
     * 
     * @param {Any} enumObject The enum to use.
     * @param {String} value The value from the enum to set as the attribute.
     */
    addAttributeFromEnum(enumObject, value) {
        for (let enumItem in enumObject)
            this.removeAttribute(enumObject[enumItem]);

        this.addAttribute(value);
    }

    /**
     * Find the attribute in the view's element that matches
     * an item in an enum.
     * 
     * @param {Any} enumObject The enum to search through.
     * @param {String} defaultValue The value of the enum to be used if no
     * attribute is found.
     * 
     * @returns {String} The name of the attribute if found, or the default
     * value.
     */
    getAttributeFromEnum(enumObject, defaultValue) {
        for (let enumItem in enumObject) {
            let enumItemValue = enumObject[enumItem];

            if (this.hasAttribute(enumItemValue))
                return enumItemValue;
        }

        return defaultValue;
    }

    /**
     * Get the "role" attribute of the view's element.
     * @type {String}
     */
    get role() {
        return this.getAttribute("role") ?? "";
    }

    set role(value) {
        this.setAttribute("role", value);
    }

    /**
     * Get the id of the view's element.
     * @type {String}
     */
    get id() {
        return this.e.id;
    }

    set id(value) {
        this.e.id = value;
    }

    /**
     * The inner HTML of the view's element.
     * @type {String}
     */
    get innerHtml() {
        return this.e.innerHTML;
    }

    set innerHtml(value) {
        this.e.innerHTML = value;
    }

    /**
     * The outer HTML of the view's element.
     * @type {String}
     */
    get outerHtml() {
        return this.e.outerHTML;
    }

    set outerHtml(value) {
        this.e.outerHTML = value;
    }

    /**
     * The inner text of the view's element.
     * @type {String}
     */
    get innerText() {
        return this.e.innerText;
    }

    set innerText(value) {
        this.e.innerText = value;
    }

    /**
     * If the document's current fullscreen element is 
     * the view's element.
     * @type {Boolean}
     */
    get isFullscreen() {
        return (TkDocument.fullscreenElement === this.e);
    }

    set isFullscreen(value) {
        TkDocument.fullscreenElement = (value) ? this.e : null;
    }

    /**
     * Toggle the fullscreen state of the view's element.
     */
    toggleFullscreen() {
        if (this.isFullscreen)
            TkDocument.fullscreenElement = null;
        else
            TkDocument.fullscreenElement = this.e;
    }

    /**
     * A simple way of storing data associated with a view.
     * Triggers "datachanged" when the data is set.
     * @type {Any}
     */
    get data() {
        return this._data;
    }

    set data(value) {
        this._data = value;
        this.trigger("datachanged", this._data);
    }

}

/**
 * A view holding a <div> element that
 * places child elements either vertically
 * or horizontally in a "stack".
 */
class TkStack extends TkView {

    /**
     * Create a TkStack.
     * 
     * @param {Object} options Same as TkView, minus options.tag.
     * @param {String} options.direction The direction of the child elements.
     */
    constructor(options) {
        super(options);
        this.addViewName("tkstack");

        this.direction = options.direction ?? TkStackDirection.VERTICAL;
    }

    /**
     * The direction of the child elements.
     * @type {TkStackDirection}
     */
    get direction() {
        return this.getAttributeFromEnum(TkStackDirection, TkStackDirection.VERTICAL);
    }

    set direction(value) {
        this.addAttributeFromEnum(TkStackDirection, value);
    }

}

/**
 * TODO: Split views between resizable columns/rows
 */
class TkSplit extends TkView {

}

/**
 * TODO: A group box with a TkLabel title
 */
class TkGroup extends TkView {

}

/**
 * A view representing a text element (<p>, <h1>, <span>, and so on...).
 */
class TkText extends TkView {

    /**
     * Create a TkText.
     * 
     * @param {String} tag The tag of the text element.
     * @param {Object} options Same as TkView, minus options.tag.
     * @param {String} options.text The text to set inside the element.
     */
    constructor(tag, options = {}) {
        super(options, { tag: tag });
        this.addViewName("tktext");

        this.textNode = document.createTextNode(options.text ?? "");
        this.e.appendChild(this.textNode);
    }

    /**
     * The text inside the element.
     * @type {String}
     */
    get text() {
        return this.textNode.nodeValue;
    }

    set text(value) {
        this.textNode.nodeValue = value;
    }

}

/**
 * A view representing an <img> element.
 */
class TkImage extends TkView {

    /*** 
     * Create a TkImage.
     * 
     * @param {Object} options Same as TkView, minus options.tag.
     * @param {String} options.source The image's source.
     * @param {String} options.alt The alternate text of the image.
     */
    constructor(options = {}) {
        super(options, { tag: "img" });
        this.addViewName("tkimage");

        if (options.source !== undefined)
            this.source = options.source;

        if (options.alt !== undefined)
            this.alt = options.alt;
    }

    /**
     * The source of the image.
     * @type {String}
     */
    get source() {
        return this.e.src;
    }

    set source(value) {
        this.e.src = value;
    }

    /**
     * The alternate text of the image.
     * @type {String}
     */
    get alt() {
        return this.e.alt;
    }

    set alt(value) {
        this.e.alt = value;
    }

}

/**
 * A view representing a root <div> with two children:
 * an <img> and a <span>.
 */
class TkLabel extends TkView {

    /**
     * Create a TkLabel.
     * 
     * @param {Object} options Same as TkView, minus options.tag.
     * @param {String} options.text The text of the label.
     * @param {String} options.icon The icon of the button.
     * @param {TkLabelLayout} options.layout The layout of the icon.
     * @param {Boolean} options.hideEmptyIcon If the icon should be hidden if 
     * its source is empty.
     * @param {String} options.iconName The name of the ionicon icon. 
     * Note: requires app-views.js and Ionicons. Overrides any value in options.icon.
     */
    constructor(options = {}) {
        super(options);
        this.addViewName("tklabel");

        // Add ionicon, if specified
        if (options.iconName !== undefined) {
            options.icon = new TkIcon({ name: options.iconName });
        }

        this._icon = options.icon ?? new TkView();
        this._icon.addViewName("tklabel-icon");
        this.add(this.icon);
        this.textView = new TkText("span", { parent: this });
        this.text = options.text ?? "";
        this.layout = options.layout ?? TkLabelLayout.DEFAULT;

        if (options.icon === undefined || options.icon === null) {
            this.showIcon = false;
        }
    }

    /**
     * The icon of the label.
     * @type {TkView}
     */
    get icon() {
        return this._icon;
    }

    set icon(value) {
        let newIcon = value;

        if (value) {
            this.replace(this._icon, newIcon);
        } else {
            newIcon = new TkView();
            this.replace(this._icon, newIcon);
        }
        this._icon.addViewName("tklabel-icon");

        this._icon = newIcon;
    }

    /**
     * If the icon is visible.
     * @type {Boolean}
     */
    get showIcon() {
        return this.icon.visible;
    }

    set showIcon(value) {
        this.icon.visible = value;
    }

    /**
     * The text inside the text view.
     * @type {String}
     */
    get text() {
        return this.textView.text;
    }

    set text(value) {
        this.textView.text = value;
    }

    /**
     * The layout of the icon and text.
     * @type {TkLabelLayout}
     */
    get layout() {
        return this.getAttributeFromEnum(TkLabelLayout, TkLabelLayout.DEFAULT);
    }

    set layout(value) {
        this.addAttributeFromEnum(TkLabelLayout, value);
    }

}

/**
 * A view representing an <a> element.
 */
class TkLink extends TkLabel {

    /**
     * Create a TkLink.
     * 
     * @param {Object} options Same as TkLabel.
     * @param {String} options.url The url of the link.
     */
    constructor(options = {}) {
        options.tag = "a";
        super(options);
        this.addViewName("tklink");

        this.url = options?.url ?? "#";
    }

    /**
     * @type {String} The URL (href) of the <a> element.
     */
    get url() {
        return this.getAttribute("href");
    }

    set url(value) {
        this.setAttribute("href", value);
    }

}

/**
 * A view representing a <button> element.
 * Allows setting the text and an icon.
 */
class TkButton extends TkView {

    /**
     * Create a TkButton.
     * 
     * @param {Object} options Same as TkView, minus options.tag.
     * @param {String} options.text The text of the button.
     * @param {String} options.icon The icon of the button.
     * @param {String} options.iconName The name of the ionicon icon. 
     * Note: requires app-views.js and Ionicons. Overrides any value in options.icon.
     * @param {TkLabel} options.label The TkLabel to use as the buttons content. Ignores
     * "text", "icon", "iconName" and layout options. 
     * @param {TkLabelLayout} options.layout The layout of the button.
     * and text.
     */
    constructor(options = {}) {
        super(options, { tag: "button" });
        this.addViewName("tkbutton");

        this.role = "button";

        if (options.label !== undefined) {
            this.label = options.label;
            this.add(this.label);
        } else {
            this.label = new TkLabel({ parent: this, icon: options.icon, iconName: options.iconName });
            this.layout = options.layout ?? TkLabelLayout.DEFAULT;
            this.text = options.text ?? "";
        }
    }

    /**
     * The text of the button.
     * @type {String}
     */
    get text() {
        return this.label.text;
    }

    set text(value) {
        this.label.text = value;
    }

    /**
     * The icon of the button.
     * @type {TkView}
     */
    get icon() {
        return this.label.icon;
    }

    set icon(value) {
        this.label.icon = value;
    }

    /**
     * The layout of the button's image and text.
     * @type {TkLabelLayout}
     */
    get layout() {
        return this.label.layout;
    }

    set layout(value) {
        this.label.layout = value;
    }

}

class TkField extends TkView {

    constructor(options = {}) {
        super(options);
        this.addViewName("tkfield");

        this.title = new TkText("span", { parent: this });
        this.title.addViewName("tkfield-title");

        if (options.title !== undefined)
            this.title.text = options.title;

        this.content = options.content ?? new TkText("span");
        this.add(this.content);
        this.content.addViewName("tkfield-content");
    }

}

/**
 * A TkNotebookPage is not a view but represents the
 * two views that make up a notebook page: the tab, 
 * which is a TkButton, and the content, which is a 
 * TkView.
 */
class TkNotebookPage {

    /**
     * Create a TkNotebookPage.
     * 
     * @param {Object} options The options object.
     * @param {String} options.title The tab's title.
     * @param {TkView[]} options.content An array of TkViews to be the page's content.
     * @param {TkNotebook} options.parent The parent notebook.
     * @param {Object} options.tabOptions The options object for 
     * creating the tab button, which is a TkButton.
     * @param {Object} options.contentOptions The options object for 
     * creating the content panel, which is a TkView. 
     */
    constructor(options = {}) {
        // Create the tab view
        this.tab = new TkButton(options.tabOptions);
        this.tab.addViewName("tknotebook-tab");
        this.tab.associatedPage = this;

        // Create the content view
        this.content = new TkView(options.contentOptions);
        this.content.addViewName("tknotebook-content");
        this.content.associatedPage = this;

        // Set the tab title, if specified
        if (options.title !== undefined)
            this.title = options.title;

        // Add this page to a notebook, if specified
        if (options.parent !== undefined)
            options.parent.add(this);

        // Add the page content, if specfied
        if (options.content)
            this.content.add(...options.content);

        // If this page is part of a notebook, make 
        // it the active tab when it is clicked
        let page = this;
        this.tab.on("click", () => {
            let notebook = this._parent;
            if (notebook != null) {
                notebook.active = page;
            }
        });
    }

    /**
     * The text displayed on the tab button.
     * @type {String}
     */
    get title() {
        return this.tab.text;
    }

    set title(value) {
        this.tab.text = value;
    }

    /**
     * If the page is shown in its parent notebook.
     * @type {Boolean}
     */
    get hidden() {
        // TODO
    }

    set hidden(value) {
        // TODO
    }

    /**
     * If the tab button can be clicked to open
     * the page.
     * @type {Boolean}
     */
    get disabled() {
        // TODO
    }

    set disabled(value) {
        // TODO
    }

    /**
     * The source of the tab button's image.
     * @type {String}
     */
    get image() {
        return this.tab.image;
    }

    set image(value) {
        this.tab.image = value;
    }

    /**
     * The notebook that this page belongs to.
     * @type {TkNotebook}
     */
    get parent() {
        return this._parent;
    }

    /**
     * If the tab page is visible.
     * @type {Boolean}
     */
    get active() {
        return this.tab.hasClass("active");
    }

    /**
     * If the tab page is visible.
     * 
     * _DO NOT_ set this directly on a TkNotebookPage, instead set the
     * active tab in a notebook via TkNotebook.active, which will handle 
     * the hiding of other pages correctly.
     * @type {Boolean}
     * @param {Boolean} value
     */
    set _active(value) {
        if (value) {
            this.tab.addClass("active");
            this.content.addClass("active");
        } else {
            this.tab.removeClass("active");
            this.content.removeClass("active");
        }
    }

}

/** 
 *	A view for managing a set of related pages, each with its own tab button
 *	and content panel.
 * 
 *	It is a root <div> with two <div> children: one which holds tab buttons for each page
 *	and another, which holds <div> elements that contain the content of each page.
 */
class TkNotebook extends TkView {

    /**
     * Create a TkNotebook.
     * 
     * @param {Object} options The options object.
     * @param {Boolean} options.wrap (default: true) If the page navigation should wrap around.
     * @param {Boolean} options.newestPageActive (default: false) If the notebook should 
     * jump to new pages when they are added.
     * @param {Object} options.tabAreaOptions The options object for creating the tab 
     * panel, which is a TkView. 
     * @param {Object} options.contentAreaOptions The options object for creating the content 
     * area panel, which is a TkView. 
     */
    constructor(options = {}) {
        super(options, { tag: "div" });
        this.addViewName("tknotebook");

        if (options.wrap === undefined)
            options.wrap = true;

        if (options.newestPageActive === undefined)
            options.newestPageActive = false;

        this.tabArea = new TkView(options.tabAreaOptions);
        this.tabArea.addViewName("tknotebook-tabarea");
        this.add(this.tabArea);

        this.contentArea = new TkView(options.contentAreaOptions);
        this.contentArea.addViewName("tknotebook-contentarea");
        this.add(this.contentArea);

        this._wrap = options.wrap;
        this._newestPageActive = options.newestPageActive;
        this.pages = [];
    }

    /**
     * Add pages and items to the notebook. If an item is not a TkNotebookPage, 
     * it will be passed on to TkView.add().
     * 
     * @param  {...TkNotebookPage|String|HTMLElement|TkView} items The pages/items to add.
     */
    add(...items) {
        for (let item of items) {
            if (TkObject.is(item, TkNotebookPage)) {
                let page = item;

                // Add the page to the notebook
                this.pages.push(page);
                this.tabArea.add(page.tab);
                this.contentArea.add(page.content);

                // Set this notebook as the page's parent
                page._parent = this;

                // Jump to the page if there is no page active
                // or if newestPageActive == true
                if (this.newestPageActive || this.active === null) {
                    this.active = page;
                } else {
                    page._active = false;
                }

                // Trigger the pageadded event
                this.trigger("pageadded");
            } else {
                super.add(item);
            }
        }
    }

    /**
     * Remove pages and items from the notebook. If an item is not a TkNotebookPage, 
     * it will be passed on to TkView.remove(). 
     * 
     * @param  {...TkNotebookPage|String|HTMLElement|TkView} items The pages/items to remove.
     */
    remove(...items) {
        for (let item of items) {
            if (TkObject.is(item, TkNotebookPage)) {
                let page = item;
                let oldActiveIndex = this.activeIndex;

                // Remove the page to the notebook
                this.pages.splice(this.pages.indexOf(page), 1);
                this.tabArea.remove(page.tab);
                this.contentArea.remove(page.content);

                // Set the page's parent to null
                page._parent = null;

                // Adjust the active index
                this.activeIndex = Math.max(0, oldActiveIndex - 1);

                // Trigger the pageremoved event
                this.trigger("pageremoved");

                // Trigger active changed event if the active index changed 
                if ((oldActiveIndex != this.activeIndex))
                    this.trigger("activechanged");
            } else {
                super.remove(item);
            }
        }
    }

    /**
     * Remove all pages from the notebook.
     */
    clear() {
        this.remove(...this.pages);
    }

    /**
     * The active page in the notebook. 
     * @type {TkNotebookPage}
     */
    get active() {
        let activeIndex = this.activeIndex;
        return (activeIndex == -1) ? null : this.pages[this.activeIndex];
    }

    set active(value) {
        if (value === undefined || value === null)
            return;

        // Unselect old page, if it exists.
        let oldActive = this.active;
        if (oldActive !== null) {
            oldActive._active = false;
        }

        // Select the new tab
        value._active = true;

        // Trigger the activechanged event
        this.trigger("activechanged");
    }

    /**
     * The index of the active page in the notebook.
     * @type {Number}
     */
    get activeIndex() {
        let index = -1;

        this.pages.forEach((page, i) => {
            if (page.active)
                index = i;
        });

        return index;
    }

    set activeIndex(value) {
        this.active = this.pages[value];
    }

    /**
     * Get the index of a page in the notebook.
     * 
     * @param {TkNotebookPage} page The page to look for.
     */
    indexOf(page) {
        return this.pages.indexOf(page);
    }

    /**
     * The number of pages in the notebook.
     * @type {Number}
     */
    get pageCount() {
        return this.pages.length;
    }

    /**
     * Whether or not to wrap around to the first or last page when
     * getting the next or previous page.
     * @type {Boolean}
     */
    get wrap() {
        return this._wrap;
    }

    set wrap(value) {
        this._wrap = value;
    }

    /**
     * If the notebook should automatically go to a newly added tab.
     * @type {Boolean}
     */
    get newestPageActive() {
        return this._newestPageActive;
    }

    set newestPageActive(value) {
        this._newestPageActive = value;
    }

    /**
     * The page index that comes before the current page.
     * @type {Number}
     */
    get previousPageIndex() {
        if (this.activeIndex - 1 < 0 && this.wrap)
            return this.pages.length - 1;
        else
            return Math.max(0, this.activeIndex - 1);
    }

    /**
     * The page index that comes after the current page.
     * @type {Number}
     */
    get nextPageIndex() {
        if (this.activeIndex + 1 >= this.pages.length && this.wrap)
            return 0;
        else
            return Math.min(this.pages.length - 1, this.activeIndex + 1);
    }

    /**
     * Go to the page before the current page.
     */
    goToPrevious() {
        this.activeIndex = this.previousPageIndex;
    }

    /**
     * Go to the page after the current page.
     */
    goToNext() {
        this.activeIndex = this.nextPageIndex;
    }

    /**
     * Go to the first page in the notebook.
     */
    goToFirst() {
        if (this.pageCount > 0)
            this.activeIndex = 0;
    }

    /**
     * Go to the last page in the notebook.
     */
    goToLast() {
        if (this.pageCount > 0)
            this.activeIndex = this.pages.length - 1;
    }

}

/**
 * A lightweight counterpart to TkNotebook
 * for when you have a set of views and
 * you only want one visible at a time.
 */
class TkSwitcher extends TkView {

    constructor(options = {}) {
        super(options);
        this.addViewName("tkswitcher");
    }

    /**
     * Add items to the switcher.
     * 
     * @param  {...String|HTMLElement|TkView} items The items to add.
     */
    add(...items) {
        for (let item of items) {
            // Hide new items.
            item.addAttribute("tk-hide");
            super.add(item);
        }
    }

    /**
     * The active item in the switcher. 
     * @type {...String|HTMLElement|TkView}
     */
    get active() {
        let activeIndex = this.activeIndex;
        return (activeIndex == -1) ? null : this.children[this.activeIndex];
    }

    set active(value) {
        if (value === undefined || value === null)
            return;

        // Unselect old view, if it exists.
        let oldActive = this.active;
        if (oldActive !== null) {
            oldActive.addAttribute("tk-hide");
        }

        // Show the new view
        if (TkObject.is(value, TkView)) { // TkView
            value.removeAttribute("tk-hide");
        } else if (TkObject.is(value, String)) { // Selector
            let item = document.querySelector(value);
            item.removeAttribute("tk-hide");
        } else if (TkObject.is(value, HTMLElement)) {  // HTMLElement
            value.removeAttribute("tk-hide");
        }

        // Trigger the activechanged event
        this.trigger("activechanged");
    }

    /**
     * The index of the active item in the switcher.
     * @type {Number}
     */
    get activeIndex() {
        let index = -1;

        this.children.forEach((view, i) => {
            if (!view.hasAttribute("tk-hide"))
                index = i;
        });

        return index;
    }

    set activeIndex(value) {
        this.active = this.children[value];
    }

    /**
     * Get the index of a item in the switcher.
     * 
     * @param {...String|HTMLElement|TkView} item The item to look for.
     */
    indexOf(item) {
        // Find the element to search for
        let searchItem = undefined;
        if (TkObject.is(item, TkView)) { // TkView
            searchItem = item.e;
        } else if (TkObject.is(item, String)) { // Selector
            searchItem = document.querySelector(item);
        } else if (TkObject.is(item, HTMLElement)) {  // HTMLElement
            searchItem = item;
        }

        for (let i = 0; i < this.childElements.length; i++) {
            if (this.childElements[i] == searchItem) {
                return i;
            }
        }

        return -1;
    }

    /**
     * The number of items in the switcher.
     * @type {Number}
     */
    get pageCount() {
        return this.childElements.length;
    }

}

/**
 * A view representing a <canvas> element.
 */
class TkCanvas extends TkView {

    constructor(options = {}) {
        super(options, { tag: "canvas" });
        if (options.width !== undefined)
            this.setAttribute("width", options.width);

        if (options.height !== undefined)
            this.setAttribute("height", options.height);
    }

    getContext(...context) {
        return this.e.getContext(...context);
    }

    toImage() {
        return this.e.toDataURL("image/png");
    }

    get width() {
        return this.getAttribute("width");
    }

    set width(value) {
        this.setAttribute("width", value);
    }

    get height() {
        return this.getAttribute("height");
    }

    set height(value) {
        this.setAttribute("height", value);
    }

}

/**
 * A list of items to be selected from.
 * 
 * TODO:
 *  - Multiple selection
 *  - Allow user re-ordering of items (dragging/arrow keys)
 */
class TkList extends TkStack {

    /**
     * Create a TkList.
     * 
     * @param {Object} options The options object.
     * @param {Boolean} options.wrap (default: true) If the selection should wrap around.
     */
    constructor(options = {}) {
        super(options);
        this.addViewName("tklist");
        this._wrap = options.wrap ?? true;

        let thisList = this;
        this.selectItemHandler = (item) => {
            thisList.selectedItem = item;
        };

        // Move up and down in the list with
        // the arrow keys
        this.e.tabIndex = 0;
        this.on("keydown", (view, event) => {
            let itemCount = view.children.length;
            if (itemCount == 0)
                return;

            let selectedIndex = view.selectedIndex;
            switch (event.code) {
                case "ArrowUp":
                    if (selectedIndex > 0)
                        view.selectedIndex--;
                    else if (view._wrap)
                        view.selectedIndex = itemCount - 1;

                    view.scrollToSelected();
                    event.preventDefault();
                    break;
                case "ArrowDown":
                    if (selectedIndex < itemCount - 1)
                        view.selectedIndex++;
                    else if (view._wrap)
                        view.selectedIndex = 0;

                    view.scrollToSelected();
                    event.preventDefault();
                    break;
            }
        }, true);
    }

    add(...items) {
        super.add(...items);

        for (let item of items) {
            item.on("click", this.selectItemHandler);
        }
    }

    remove(...items) {
        let selectedItem = this.selectedItem;

        for (let item of items) {
            super.remove(item);
            item.off("click", this.selectItemHandler);

            if (selectedItem == item) {
                this.trigger("selectedchanged");
            }
        }
    }

    /**
     * The selected item in the list. Always returns a TkView, but when setting 
     * the value, it can also accept CSS selectors or HTMLElements.
     * @type {TkView|String|HTMLElement}
     */
    get selectedItem() {
        let selectedIndex = this.selectedIndex;
        return (selectedIndex == -1) ? null : this.children[selectedIndex];
    }

    set selectedItem(value) {
        // Unselect old view, if it exists.
        let oldSelected = this.selectedItem;
        if (oldSelected !== null) {
            oldSelected.removeClass("selected");
        }

        if (value === undefined || value === null)
            return;

        // Select the new item
        if (TkObject.is(value, TkView)) { // TkView
            value.addClass("selected");
        } else if (TkObject.is(value, String)) { // Selector
            let item = document.querySelector(value);
            item.classList.add("selected");
        } else if (TkObject.is(value, HTMLElement)) {  // HTMLElement
            value.classList.add("selected");
        }

        // Trigger the selectedchanged event
        this.trigger("selectedchanged");

        // Trigger the indexchanged event
        this.trigger("indexchanged");
    }

    /**
     * The index of the selected item in the list.
     * @type {Number}
     */
    get selectedIndex() {
        let index = -1;

        this.children.forEach((view, i) => {
            if (view.hasClass("selected"))
                index = i;
        });

        return index;
    }

    set selectedIndex(value) {
        if (value === -1)
            this.selectedItem = null;
        else
            this.selectedItem = this.children[value];
    }

    /**
     * If the list selection should wrap around when selecting
     * by arrow keys and reaching either the start or end of the list.
     * @type {Boolean}
     */
    get wrap() {
        return this._wrap;
    }

    set wrap(value) {
        this._wrap = value;
    }

    /**
     * Scroll to the selected item in the list.
     * If no item is selected, scroll to the top of the list.
     */
    scrollToSelected() {
        let selectedItem = this.selectedItem;

        if (selectedItem !== null) {
            let scrollOptions = { block: "center", inline: "nearest" };
            selectedItem.e.scrollIntoView(scrollOptions);
        } else {
            this.e.scrollTop = 0;
        }
    }

}

class TkInput extends TkView {

    constructor(options = {}) {
        super(options, { tag: "input" });
        this.addViewName("tkinput");

        if (options.type !== undefined)
            this.type = options.type;

        if (options.name !== undefined)
            this.name = options.name;

        if (options.readOnly !== undefined)
            this.readOnly = options.readOnly;

        if (options.value !== undefined)
            this.value = options.value;

        if (options.min !== undefined)
            this.min = options.min;

        if (options.max !== undefined)
            this.max = options.max;

        if (options.value !== undefined)
            this.value = options.value;

        if (options.step !== undefined)
            this.step = options.step;
    }

    get type() {
        this.getAttribute("type");
    }

    set type(value) {
        this.setAttribute("type", value);
    }

    get name() {
        this.getAttribute("name");
    }

    set name(value) {
        this.setAttribute("name", value);
    }

    get readOnly() {
        return this.e.readonly;
    }

    set readOnly(value) {
        this.e.readonly = value;
    }

    get value() {
        return this.e.value;
    }

    set value(value) {
        this.e.value = value;
    }

    get valueAsNumber() {
        return this.e.valueAsNumber;
    }

    get min() {
        return this.e.min;
    }

    set min(value) {
        this.e.min = value;
    }

    get max() {
        return this.e.max;
    }

    set max(value) {
        this.e.max = value;
    }

    get step() {
        return this.e.step;
    }

    set step(value) {
        this.e.step = value;
    }

}

class TkSlider extends TkInput {

    constructor(options = {}) {
        super(options);
        this.addViewName("tkslider");

        this.type = "range";

        this.on("click", (slider) => slider.e.focus());
        this.on("keydown", (slider, event) => {
            let value = Number.parseFloat(slider.value);
            let max = Number.parseFloat(slider.max);
            let min = Number.parseFloat(slider.min);
            let step = Number.parseFloat(slider.step);

            switch (event.code) {
                case "ArrowLeft":
                    if (value > min) {
                        slider.value = Math.max(min, value - step);
                        this.trigger("change");
                    }

                    event.preventDefault();
                    break;
                case "ArrowRight":
                    if (value < max) {
                        slider.value = Math.min(max, value + step);
                        this.trigger("change");
                    }

                    event.preventDefault();
                    break;
            }
        }, true);
    }

}

/**
 * An input for numbers.
 */
class TkStepper extends TkInput {

    constructor(options = {}) {
        super(options);
        this.addViewName("tkstepper");
        this.type = "number";
    }

}

/* TODO */
class TkSwitch extends TkView {

}

/* TODO */
class TkProgress extends TkView {

    constructor(options = {}) {
        super(options, { tag: "div", viewName: "tkprogress" });
        this.addViewName("tkprogress");

        this.bar = new TkView({ parent: this });
        this.bar.addViewName("tkprogress-bar");

        this.valueText = new TkText("span", { parent: this.bar });
        this.valueText.addViewName("tkprogress-valuetext");
    }

    get max() {
        return null;
    }

    set max(value) {

    }

    get min() {
        return null;
    }

    set min(value) {

    }

    get useThresholds() {
        return null;
    }

    set useThresholds(value) {

    }

    get currentThreshold() {
        return null;
    }

    get showValue() {
        return null;
    }

    set showValue(value) {

    }

}

/**
 * TODO
 * 
 * Note: First version of tamarack had a mostly complete
 * version of this.
 */
class TkTextEdit extends TkView {

}

/**
 * A view that displays above other content on 
 * the page.
 */
class TkOverlay extends TkView {

    /**
     * Create a new TkOverlay.
     * 
     * @param {Object} [options] The options object (same as TkView, minus the tag option).
     * The "parent" option also defaults to "body", unless specified otherwise.
     * @param {Boolean} [options.hideContent=false] If the content view should be 
     * hidden.
     * @param {String} [options.message] The text to show inside of the content view.
     */
    constructor(options = {}) {
        // Redirect children into the content view
        let children = options.children ?? [];
        options.children = undefined;
        options.visible = false;
        // The parent is "body", unless specified
        options.parent = options.parent ?? "body";
        super(options);
        this.addViewName("tkoverlay");

        this.window = new TkView({ parent: this });
        this.window.addViewName("tkoverlay-window");

        // Content
        this.content = new TkView({ parent: this.window });
        if (options.hideContent === true)
            this.content.visible = false;
        this.content.addViewName("tkoverlay-content");
        if (options.message !== undefined)
            this.content.add(new TkText("p", { text: options.message }));
        this.content.add(...children);

        // Store the target when the mouse event started
        // to prevent firing when text selection
        // ends up in the overlay background
        this.on("mousedown", (modal, event) => {
            modal._lastMouseTarget = event.target;
        });

        // Close window when clicked outside
        this.on("click", (modal, event) => {
            // If the event was actually triggered
            // by the container and not a child view
            if (modal._lastMouseTarget === modal.e) {
                modal.close();
            }

            event.stopPropagation();
            modal._lastMouseTarget = null;
        });
    }

    show(callback) {
        this.parent.addClass("tkoverlay-open");
        this.visible = true;
        this.trigger("modalshown");
        this._callback = callback ?? null;
    }

    close() {
        this.parent.removeClass("tkoverlay-open");
        this.visible = false;
        this.trigger("modalclosed");

        if (this._callback)
            this._callback();
    }

}

/** 
 * A more specialized overlay. Provides common functionality, such as 
 * a titlebar and a footer.
 */
class TkModal extends TkOverlay {

    /**
     * Create a new TkModal.
     * 
     * @param {Object} [options] The options object (same as TkOverlay).
     * The "parent" option also defaults to "body", unless specified otherwise.
     * @param {TkView} [options.titleView] The view to show inside of the title (cannot
     * be used with "title" option, which overrides it).
     * @param {String} [options.title] The text to show inside of the titlebar (cannot
     * be used with "titleView" option, which is overriden by this option).
     * @param {String} [options.icon] The icon of the modal titlebar.
     * @param {String} [options.iconName] The name of the ionicon icon. 
     * Note: requires app-views.js and Ionicons. Overrides any value in options.icon.
     * @param {Boolean} [options.hideTitlebar=false] If the titlebar view should be 
     * hidden. If not specified and neither the "title" or "titleView" options are 
     * specified, then it defaults to "true".
     * @param {Boolean} [options.hideFooter=false] If the footer should be hidden.
     * If not specified and neither the "buttons" or "choices" options are 
     * specified, then it defaults to "true".
     * @param {Boolean} [options.closeButton=true] If the close button should be shown.
     * @param {TkButton[]} [options.buttons] The buttons to add to the footer.
     * @param {TkModalResult[]} [options.choices] The button choices to add.
     * @param {TkModalResult} [options.defaultChoice] The button choices to select
     * as the default choice from the "choices" option.
     */
    constructor(options = {}) {
        super(options);
        this.addViewName("tkmodal");

        // Titlebar
        this.titlebar = new TkView({ parent: this.window });
        this.titlebar.moveToTop();
        this.titlebar.addViewName("tkmodal-titlebar");
        let hasTitle = false;
        if (options.titleView !== undefined) {
            this.title = options.titleView;
            this.titlebar.add(this.title);
            hasTitle = true;
        } else if (options.title !== undefined) {
            this.title = new TkLabel({ parent: this, icon: options.icon, iconName: options.iconName, text: options.title });
            this.titlebar.add(this.title);
            hasTitle = true;
        }

        if (options.hideTitlebar === true || (options.hideTitlebar === undefined && !hasTitle)) {
            this.titlebar.visible = false;
        }
        if (options.closeButton === true) {
            this.closeButton = new TkButton({ parent: this.titlebar, text: "X" });
            let modal = this;
            this.closeButton.on("click", () => modal.close());
        }

        // Choice buttons
        this._choiceButtons = [];
        this._defaultButton = null;

        // Footer
        this.footer = new TkView({ parent: this.window });
        if (options.buttons !== undefined)
            this.footer.add(options.buttons);
        this.choices = options.choices ?? [];
        this.defaultChoice = options.defaultChoice ?? null;
        let hasFooterButtons = (this.choices.length > 0 || options.buttons !== undefined);
        this.footer.addViewName("tkmodal-footer");
        if (options.hideFooter === true || (options.hideFooter === undefined && !hasFooterButtons)) {
            this.footer.visible = false;
        }

        // The modal result
        this._result;
    }

    get result() {
        return this._result;
    }

    set result(value) {
        this._result = value;
    }

    get choices() {
        return this._choices;
    }

    set choices(value) {
        this._choices = value;

        // Remove existing choice buttons, if they exist
        if (this._choiceButtons.length > 0) {
            this.remove(...this._choiceButtons);
            this._choiceButtons = [];
        }

        // Add a new choice button for each
        let modal = this;
        for (let choice of value) {
            let choiceButton = new TkButton({
                parent: this.footer,
                attributes: { choice: choice },
                text: choice
            });

            choiceButton.on("click", (button) => {
                modal.closeWithResult(button.getAttribute("choice"));
            });

            this._choiceButtons.push(choiceButton);
        }
    }

    get defaultChoice() {
        return this._defaultButton.getAttribute("choice");
    }

    set defaultChoice(value) {
        for (let button of this._choiceButtons) {
            if (button.getAttribute("choice") === value) {
                button.addClass(TkButtonStyle.PRIMARY);
                this._defaultButton = button;
                this._defaultButton.focus();
            } else {
                button.addClass(TkButtonStyle.SECONDARY);
            }
        }
    }

    show(callback) {
        super.show(callback);
        this._defaultButton?.focus();
    }

    close() {
        this.result = TkModalResult.NOTHING;
        super.close(this._callback);
    }

    closeWithResult(result) {
        this.result = result;
        super.close(this._callback);
    }

    buttonFor(choice) {
        for (let button of this._choiceButtons)
            if (button.getAttribute("choice") === choice)
                return button;

        return null;
    }

    get defaultButton() {
        return this._defaultButton;
    }

    set defaultButton(value) {
        for (let child of this.footer.children) {
            if (TkObject.is(child, TkButton)) {
                if (child === value) {
                    child.addClass(TkButtonStyle.PRIMARY);
                    this._defaultButton = child;
                    this._defaultButton.focus();
                } else {
                    child.addClass(TkButtonStyle.SECONDARY);
                }
            }
        }
    }

    /**
     * 
     * @param {String} message The message to show as the content
     * @param {Object} options The options object
     * @param {String} [options.title] The title of the alert.
     * @param {Boolean} [options.okButton=true] If the OK button should be shown.
     */
    static alert(message, options = {}) {
        if (options.okButton === undefined)
            options.okButton = true;
        let choices = options.okButton ? [TkModalResult.OK] : [];
        let alertModal = new TkModal({
            message: message,
            title: options.title,
            choices: choices,
            defaultChoice: TkModalResult.OK
        });

        alertModal.on("modalclosed", () => alertModal.delete());
        alertModal.show();
    }

}

/**
 * A simple TkOverlay for showing an image/video/some other
 * media.
 */
class TkLightbox extends TkOverlay {

}

/**
 * Create a TkView from an existing node in the DOM with the attribute
 * [template={some-template-name}]. Fields representing views are automatically
 * generated for child elements with the attribute [view-name={someViewName}] and
 * can be accessed as this.someViewName.
 */
class TkTemplate extends TkView {

    /**
     * Create a new TkView from an existing DOM node.
     * 
     * @param {String} name The name in the [template={name}] attribute.
     * @param {Object} options The options object to pass to the parent class (TkView).
     * @param {Boolean} [options.disableFieldGeneration=false] If fields shouldn't 
     * be generated for every view with the [view-name] attribute.
     */
    constructor(name, options = {}) {
        super(options, { from: document.querySelector(`[template=${name}]`).cloneNode(true) });
        this.name = name;

        // Get its named views
        let namedViews = this.e.querySelectorAll(`[view-name]`);
        this.namedViews = [];

        for (let view of namedViews) {
            let viewName = view.getAttribute("view-name");
            let generatedView = new TkView({ from: view });
            this.namedViews.push({ name: viewName, element: generatedView });
            view.removeAttribute("view-name");

            // If disableFieldGeneration != false, then
            // the view can be accessed through this.{viewName}
            if (!options.disableFieldGeneration) {
                this[viewName] = generatedView;
            }
        }

        this.removeAttribute("template");
    }

    /**
     * Get a view from the template by name.
     * 
     * @param {String} name The name of the view to find.
     * @returns The view if a matching name was found, null if not.
     */
    viewFor(name) {
        for (let view of this.namedViews) {
            if (view.name === name)
                return view.e;
        }

        return null;
    }

}