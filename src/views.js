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
 * the text and image in a TkLabel.
 * @enum {String}
 */
const TkLabelLayout = {
    IMAGE_TOP: "tklabel-image-top",
    IMAGE_BOTTOM: "tklabel-image-bottom",
    IMAGE_LEFT: "tklabel-image-left",
    IMAGE_RIGHT: "tklabel-image-right",
    IMAGE_ONLY: "tklabel-image-only",
    TEXT_ONLY: "tklabel-text-only",
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
     * @param {String} [options.className] The value of class attribute of the element to set.
     * @param {String} [options.style] The value of style attribute of the element to set.
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
                this._element = options.from.element;
            }
        } else  { // Create a new element if no tag is specified
            this._element = document.createElement(tag);
        }

        // Set the parent, if specified
        if (options.parent !== undefined)
            this.parent = options.parent;

        // Add the className, if specified
        if (options.className !== undefined)
            this.className = options.className;

        if (options.attributes !== undefined)
            for (let attributeName of Object.keys(options.attributes))
                this.setAttribute(attributeName, options.attributes[attributeName]);

        if (options.style !== undefined)
            this.setAttribute("style", options.style);

        // Add an attribute showing that the html element
        // is controlled by a TkView
        if (this._element != null)
            this._element.setAttribute("tkview", "");


        // Store events
        this.events = [];
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
     * The element of the view.
     * @type {HTMLElement}
     */
    get element() {
        return this._element;
    }

    set element(value) {
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
     * Shorthand for TkView.element The element of the view.
     * @type {HTMLElement}
     */
    get e() {
        return this._element;
    }

    set e(value) {
        this.element = value;
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
            } else if (TkObject.is(item, String)) { // Selector
                let selectedItem = document.querySelector(item);
                if (selectedItem)
                    this.e.appendChild(selectedItem);
            } else if (TkObject.is(item, HTMLElement)) { // HTMLElement
                this.e.appendChild(item);
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
            } else if (TkObject.is(item, String)) { // Selector
                let selectedItem = document.querySelector(item);
                if (selectedItem)
                    if (this.e.contains(selectedItem))
                        this.e.removeChild(selectedItem);
            } else if (TkObject.is(item, HTMLElement)) { // HTMLElement
                if (this.e.contains(item))
                    this.e.removeChild(item);
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
        while (this.element.firstChild)
            this.element.removeChild(this.element.firstChild);
    }

    /**
     * Attach an event handler to an event on the element of
     * the view.
     * 
     * @param {String} eventName The name of the event.
     * @param {function(TkView, Event)} callback The function to run when the event
     * is triggered. This function is passed target view.
     * @param {Boolean?} useCapture If this event will use capture.
     */
    on(eventName, callback, useCapture = false) {
        let view = this;
        let eventOptions = {
            name: eventName,
            callback: callback,
            adjustedCallback: (event) => callback(view, event)
        };
        this.events.push(eventOptions);

        this.e.addEventListener(eventName, eventOptions.adjustedCallback, useCapture);
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
     */
    trigger(eventName) {
        return this.e.dispatchEvent(new Event(eventName));
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
     * The class name string of the view's element.
     * 
     * @type {String}
     */
    get className() {
        return this.e.className;
    }

    set className(value) {
        this.e.className = value;
    }

    /**
     * Add classes to the class list of the view's element.
     * 
     * @param  {...String} classes The classes to add.
     */
    addClass(...classes) {
        classes.forEach((className) => {
            if (!this.hasClass(className))
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
     * 
     * @returns {Attr} The new attribute.
     */
    addAttribute(...attributes) {
        for (let attribute of attributes)
            this.e.setAttributeNode(document.createAttribute(attribute));
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
     * @param {Any} options Same as TkView, minus options.tag.
     * @param {String} options.direction The direction of the child elements.
     */
    constructor(options) {
        super(options);
        this.addAttribute("tkstack");

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
 * A view representing a text element (<p>, <h1>, <span>, and so on...).
 */
class TkText extends TkView {

    /**
     * Create a TkText.
     * 
     * @param {String} tag The tag of the text element.
     * @param {Any} options Same as TkView, minus options.tag.
     * @param {String} options.text The text to set inside the element.
     */
    constructor(tag, options = {}) {
        super(options, { tag: tag });
        this.addAttribute("tktext");

        this.textNode = document.createTextNode(options.text ?? "");
        this.element.appendChild(this.textNode);
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
 * A view representing an <a> element.
 */
class TkLink extends TkText {

    /**
     * Create a TkLink.
     * 
     * @param {Any} options Same as TkView, minus options.tag.
     * @param {String} options.text The text to set inside the element.
     * @param {String} options.url The url of the link.
     */
    constructor(options = {}) {
        super("a", options);
        this.addAttribute("tklink");

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
 * A view representing an <img> element.
 */
class TkImage extends TkView {

    /*** 
     * Create a TkImage.
     * 
     * @param {Any} options Same as TkView, minus options.tag.
     * @param {String} options.source The image's source.
     * @param {String} options.alt The alternate text of the image.
     */
    constructor(options = {}) {
        super(options, { tag: "img" });
        this.addAttribute("tkimage");

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
     * @param {Any} options Same as TkView, minus options.tag.
     * @param {String} options.text The text of the label.
     * @param {String} options.image The image source of the label.
     * @param {TkLabelLayout} options.layout The layout of the image.
     * and text.
     */
    constructor(options = {}) {
        super(options);
        this.addAttribute("tklabel");

        this.imageView = new TkImage({ parent: this });
        this.textView = new TkText("span", { parent: this });
        this.layout = TkLabelLayout.IMAGE_LEFT;
        this.text = options.text ?? "";
        this.image = options.image ?? "";
        this.layout = options.layout ?? TkLabelLayout.IMAGE_LEFT;
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
     * The source of the image in the image
     * view.
     * @type {String}
     */
    get image() {
        return this.imageView.source;
    }

    set image(value) {
        if (value == null || value.trim() == "") {
            this.imageView.addAttribute("tk-hide");
        } else {
            this.imageView.removeAttribute("tk-hide");
        }

        this.imageView.source = value;
    }

    /**
     * The layout of the image and text.
     * @type {TkLabelLayout}
     */
    get layout() {
        return this.getAttributeFromEnum(TkLabelLayout, TkLabelLayout.IMAGE_LEFT);
    }

    set layout(value) {
        this.addAttributeFromEnum(TkLabelLayout, value);
    }

}

/**
 * A view representing a <button> element.
 * Allows setting the text and an image.
 */
class TkButton extends TkView {

    /**
     * Create a TkButton.
     * 
     * @param {Any} options Same as TkView, minus options.tag.
     * @param {String} options.text The text of the button.
     * @param {String} options.image The image source of the button's image.
     * @param {TkLabelLayout} options.layout The layout of the button.
     * and text.
     */
    constructor(options = {}) {
        super(options, { tag: "button" });
        this.addAttribute("tkbutton");

        this.role = "button";
        this.labelView = new TkLabel({ parent: this });
        this.text = options.text ?? "";
        this.image = options.image ?? "";
        this.layout = options.layout ?? TkLabelLayout.IMAGE_LEFT;
    }

    /**
     * The text of the button.
     * @type {String}
     */
    get text() {
        return this.labelView.text;
    }

    set text(value) {
        this.labelView.text = value;
    }

    /**
     * The source of the button's image.
     * @type {String}
     */
    get image() {
        return this.labelView.image;
    }

    set image(value) {
        this.labelView.image = value;
    }

    /**
     * The layout of the button's image and text.
     * @type {TkLabelLayout}
     */
    get layout() {
        return this.labelView.layout;
    }

    set layout(value) {
        this.labelView.layout = value;
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
     * @param {Any} options The options object.
     * @param {String} options.title The tab's title.
     * @param {TkView[]} options.content An array of TkViews to be the page's content.
     * @param {TkNotebook} options.parent The parent notebook.
     * @param {Any} options.tabOptions The options object for 
     * creating the tab button, which is a TkButton.
     * @param {Any} options.contentOptions The options object for 
     * creating the content panel, which is a TkView. 
     */
    constructor(options = {}) {
        // Create the tab view
        this.tab = new TkButton(options.tabOptions);
        this.tab.addAttribute("tknotebook-tab");
        this.tab.associatedPage = this;

        // Create the content view
        this.content = new TkView(options.contentOptions);
        this.content.addAttribute("tknotebook-content");
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
     * @param {Any} options The options object.
     * @param {Boolean} options.wrap (default: true) If the page navigation should wrap around.
     * @param {Boolean} options.newestPageActive (default: false) If the notebook should 
     * jump to new pages when they are added.
     * @param {Any} options.tabAreaOptions The options object for creating the tab 
     * panel, which is a TkView. 
     * @param {Any} options.contentAreaOptions The options object for creating the content 
     * area panel, which is a TkView. 
     */
    constructor(options = {}) {
        if (options.wrap === undefined)
            options.wrap = true;

        if (options.newestPageActive === undefined)
            options.newestPageActive = false;

        super(options, { tag: "div" });
        this.addAttribute("tknotebook");

        this.tabArea = new TkView(options.tabAreaOptions);
        this.tabArea.addAttribute("tknotebook-tabarea");
        this.add(this.tabArea);

        this.contentArea = new TkView(options.contentAreaOptions);
        this.contentArea.addAttribute("tknotebook-contentarea");
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
        this.addAttribute("tkswitcher");
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
            searchItem = item.element;
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
 */
class TkList extends TkStack {

    /**
     * Create a TkList.
     * 
     * @param {Any} options The options object.
     * @param {Boolean} options.wrap (default: true) If the selection should wrap around.
     */
    constructor(options = {}) {
        super(options);
        this.addAttribute("tklist");
        this._wrap = options.wrap ?? true;

        let thisList = this;
        this.selectItemHandler = (item) => {
            thisList.selectedItem = item;
        };

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

                    break;
                case "ArrowDown":
                    if (selectedIndex < itemCount - 1)
                        view.selectedIndex++;
                    else if (view._wrap)
                        view.selectedIndex = 0;

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
        super.add(...items);

        for (let item of items) {
            item.off("click", this.selectItemHandler);
        }
    }

    /**
     * The selected item in the list. Always returns a TkView, but when setting 
     * the value, it can also accept CSS selectors or HTMLElements.
     * @type {TkView|String|HTMLElement}
     */
    get selectedItem() {
        let selectedIndex = this.selectedIndex;
        return (selectedIndex == -1) ? null : this.children[this.selectedIndex];
    }

    set selectedItem(value) {
        if (value === undefined || value === null)
            return;

        // Unselect old view, if it exists.
        let oldSelected = this.selectedItem;
        if (oldSelected !== null) {
            oldSelected.removeClass("selected");
        }

        // Select the new item
        if (TkObject.is(value, TkView)) { // TkView
            value.addClass("selected");
        } else if (TkObject.is(value, String)) { // Selector
            let item = document.querySelector(value);
            item.classList.add("selected");
        } else if (TkObject.is(value, HTMLElement)) {  // HTMLElement
            value.classList.add("selected");
        }

        // Trigger the activechanged event
        this.trigger("selectedchanged");
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

}