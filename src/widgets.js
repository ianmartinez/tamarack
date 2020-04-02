/**
 * Requires: 
 *  tamarack/core
 */


/**
 * Represents an HTML element and exposes additional 
 * functionality that makes manipulating elements easier.
 */
class TkWidget {

	/**
	 * Create a TkWidget, either from an existing element or representing a new one.
	 * 
	 * @param {String|HTMLElement|TkWidget} [options.parent] The widget's parent.
	 * @param {String|HTMLElement|TkWidget} [options.from] If representing an existing element, where to find it, 
	 * be it from a CSS selector (String), and existing element (HTMLElement), or another TkWidget.
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
		this._childWidgets = [];
		this._parentWidget = null;

		// Set the element
		if (options.from !== undefined) { // From an existing element
			if (TkObject.is(options.from, String)) { // Selector
				this._element = document.querySelector(options.from);
			} else if (TkObject.is(options.from, HTMLElement)) { // HTMLElement
				this._element = options.from;
			} else if (TkObject.is(options.from, TkWidget)) { // Other TkWidget
				this._element = options.from.element;
			}
		} else if (options.tag !== undefined) { // Creating a new element
			this._element = document.createElement(options.tag);
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
		// is controlled by a TkWidget
		if (this._element != null)
			this._element.setAttribute("tk-widget", "");
	}

	/**
	 * Get all the TkWidgets currently in the DOM.
	 * @type {TkWidget[]}
	 */
	static get all() {
		let widgets = [];

		for (let widgetElement of document.querySelectorAll("[tk-widget]"))
			widgets.push(new TkWidget({ from: widgetElement }));

		return widgets;
	}

    /**
     * The element of the widget.
     * @type {HTMLElement}
     */
	get element() {
		return this._element;
	}

	set element(value) {
		// If there's a parent, set that as 
		// the new parent widget
		if (value.parentElement)
			this._parentWidget = new TkWidget({ from: value.parentElement });

		// Point to the new element
		this._element = value;

		// Rebuild child widget array
		this._childWidgets = this.childElementsAsWidgets;
	}

    /**
     * Shorthand for TkWidget.element The element of the widget.
     * @type {HTMLElement}
     */
	get e() {
		return this._element;
	}

	set e(value) {
		this.element = value;
	}

	/**
	 * The tag name of the widget's element.
	 * @type {String}
	 */
	get tag() {
		return this.e.tagName;
	}

	/**
	 * Remove this element from its parent.
	 */
	delete() {
		if (this._parentWidget)
			this._parentWidget.remove(this);
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
	 * An array of child elements of the widget's element, represented
	 * as TkWidgets.
     * @type {TkWidget[]}
	 */
	get childElementsAsWidgets() {
		let childElements = [];

		for (let childElement of this.e.children)
			childElements.push(new TkWidget({ from: childElement }));

		return childElements;
	}

	/**
	 * An array of child widgets to the widget's element.
     * @type {TkWidget[]}
	 */
	get children() {
		let childWidgets = [];

		for (let childElement of this.e.children) {
			// Find the widget representing this child, if it exists.
			let matchingWidget = this._childWidgets.find(widget => widget.e == childElement);

			// If it does, add it to the array. If not, create a new TkWidget and 
			// add it to the array.
			childWidgets.push(matchingWidget ?? new TkWidget({ from: childElement }));
		}

		return childWidgets;
	}

	/**
	 * The parent element of the widget's element, represented as a TkWidget.
	 * It always returns a TkWidget, but when setting its value, it will also 
	 * accept plain HTMLElements and CSS selectors.
     * @type {TkWidget}
	 */
	get parent() {
		if (this._parentWidget != null) {
			return this._parentWidget;
		} else {
			let parentElement = this.e.parentElement;
			return (parentElement != null) ? new TkWidget({ from: parentElement }) : null;
		}
	}

	set parent(value) {
		// Remove from DOM
		this.delete();

		// Set the new parent
		if (TkObject.is(value, TkWidget)) { // Other TkWidget
			value.add(this);
		} else if (TkObject.is(value, String)) { // Selector
			document.querySelector(value)?.appendChild(this.e);
		} else if (TkObject.is(value, HTMLElement)) {  // HTMLElement
			value.appendChild(this.e);
		}
	}

	/**
	 * Add child items to this widget. The child items can be
	 * other TkWidgets, HTMLElements, or CSS selectors representing
	 * HTMLElements.
	 * 
	 * @param  {...String|HTMLElement|TkWidget} items The items to add.
	 */
	add(...items) {
		for (let item of items) {
			if (TkObject.is(item, TkWidget)) { // Other TkWidget
				this.e.appendChild(item.e);
				item._parentWidget = this;
				this._childWidgets.push(item);
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
	 * Remove child items from this widget. The child items can be
	 * other TkWidgets, HTMLElements, or CSS selectors representing
	 * HTMLElements.
	 * 
	 * @param  {...String|HTMLElement|TkWidget} items The items to remove.
	 */
	remove(...items) {
		for (let item of items) {
			if (TkObject.is(item, TkWidget)) { // Other TkWidget
				if (this.e.contains(item.e))
					this.e.removeChild(item.e);
				item._parentWidget = null;
				TkArray.remove(this._childWidgets, item);
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
	 * Remove all children from this widget.
	 */
	clear() {
		// Remove widgets
		this.remove(...this._childWidgets);

		// Remove left over elements
		while (this.element.firstChild)
			this.element.removeChild(this.element.firstChild);
	}

	/**
	 * Attach an event handler to an event on the element of
	 * the widget.
	 * 
	 * @param {String} eventName The name of the even.
	 * @param {function(TkWidget)} callback The function to run when the event
	 * is triggered. This function is passed target widget.
	 */
	on(eventName, callback) {
		let widget = this;

		this.e.addEventListener(eventName, () => {
			callback(widget);
		});
	}

	/**
	 * Trigger and event on the element of the widget.
	 * 
	 * @param {String} eventName The name of the event to trigger.
	 */
	trigger(eventName) {
		return this.e.dispatchEvent(new Event(eventName));
	}

	/**
	 * Iterate over each child widget, ascending.
	 * 
	 * @param {function(TkWidget, Number)} callback The function to
	 * run on each child TkWidget, passed the widget and its index.
	 */
	ascendChildren(callback) {
		TkArray.ascend(this.children, callback);
	}

	/**
	 * Iterate over each child widget, descending.
	 * 
	 * @param {function(TkWidget, Number)} callback The function to
	 * run on each child TkWidget, passed the widget and its index.
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
	 * widget's element.
	 */
	hasFocus() {
		return (document.activeElement == this.e);
	}

	/**
	 * The class name string of the widget's element.
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
	 * Add classes to the class list of the widget's element.
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
	 * Remove classes from the class list of the widget's element.
	 * 
	 * @param  {...String} classes The classes to remove.
	 */
	removeClass(...classes) {
		classes.forEach((className) =>
			this.e.classList.remove(className));
	}
	/**
	 * Toggle classes in the class list of the widget's element.
	 * 
	 * @param  {...String} classes The classes to toggle.
	 */
	toggleClass(...classes) {
		classes.forEach((className) =>
			this.e.classList.toggle(className));
	}

	/**
	 * Find the name of the class at a specific index in the class
	 * list of the widget's element.
	 * 
	 * @param {Number} index The index of the class.
	 * 
	 * @returns {String} The class name.
	 */
	classAt(index) {
		return this.e.classList.item(index);
	}

	/**
	 * Check if the class list of the widget's element contains
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
	 * Check if the widget's element has an attribute.
	 * 
	 * @param {String} attribute The attribute's name.
	 * 
	 * @returns {Boolean} If the attribute was found.
	 */
	hasAttribute(attribute) {
		return this.e.hasAttribute(attribute);
	}

	/**
	 * Get the value of an attribute of the widget's element.
	 * 
	 * @param {String} attribute The attribute's name.
	 * 
	 * @returns {String} The attribute's value.
	 */
	getAttribute(attribute) {
		return this.e.getAttribute(attribute);
	}


	/**
	 * Set the value of an attribute of the widget's element.
	 * 
	 * @param {String} attribute The attribute's name.
	 * @param {String} value The attribute's value.
	 */
	setAttribute(attribute, value) {
		this.e.setAttribute(attribute, value);
	}

	/**
	 * Remove an attribute from the widget's element.
	 * 
	 * @param {String} attribute The attribute's name.
	 */
	removeAttribute(attribute) {
		this.e.removeAttribute(attribute);
	}

	/**
	 * Add an attribute from the widget's element.
	 * 
	 * @param {String} attribute The attribute's name.
	 * 
	 * @returns {Attr} The new attribute.
	 */
	addAttribute(attribute) {
		return this.e.setAttributeNode(document.createAttribute(attribute));
	}

	/**
	 * Get the "role" attribute of the widget's element.
	 * @type {String}
	 */
	get role() {
		return this.getAttribute("role") ?? "";
	}

	set role(role) {
		this.setAttribute("role", role);
	}

	/**
	 * The inner HTML of the widget's element.
	 * @type {String}
	 */
	get innerHtml() {
		return this.e.innerHTML;
	}

	set innerHtml(value) {
		this.e.innerHTML = value;
	}

	/**
	 * The outer HTML of the widget's element.
	 * @type {String}
	 */
	get outerHtml() {
		return this.e.outerHTML;
	}

	set outerHtml(value) {
		this.e.outerHTML = value;
	}

	/**
	 * The inner text of the widget's element.
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
	 * the widget's element.
	 * @type {Boolean}
	 */
	get isFullscreen() {
		return (TkDocument.fullscreenElement === this.e);
	}

	set isFullscreen(value) {
		TkDocument.fullscreenElement = (value) ? this.e : null;
	}

	/**
	 * Toggle the fullscreen state of the widget's element.
	 */
	toggleFullscreen() {
		if (this.isFullscreen)
			TkDocument.fullscreenElement = null;
		else
			TkDocument.fullscreenElement = this.e;
	}

}

/**
 * A widget holding <div> element.
 */
class TkPanel extends TkWidget {

	/**
	 * Create a TkPanel.
	 * 
	 * @param {Any} options Same as TkWidget, minus options.tag.
	 */
	constructor(options) {
		super(options, { tag: "div" });
		this.addAttribute("tk-panel");
	}

}

/**
 * A widget representing a text element (<p>, <h1>, <span>, and so on...).
 */
class TkText extends TkWidget {

	/**
	 * Create a TkText.
	 * 
	 * @param {String} tag The tag of the text element.
	 * @param {Any} options Same as TkWidget, minus options.tag.
	 * @param {String} options.text The text to set inside the element.
	 */
	constructor(tag, options) {
		super(options, { tag: tag });
		this.addAttribute("tk-text");
		this.textNode = document.createTextNode(options.text ?? "");
		this.element.appendChild(this.textNode);
	}

	/**
	 * The text insdie the element.
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
 * Widget representing an <a> element.
 */
class TkLink extends TkText {

	/**
	 * Create a TkLink.
	 * 
	 * @param {Any} options Same as TkWidget, minus options.tag.
	 * @param {String} options.text The text to set inside the element.
	 * @param {String} options.url The url of the link.
	 */
	constructor(options) {
		super("a", options);
		this.addAttribute("tk-link");
		this.url = options.url ?? "#";
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