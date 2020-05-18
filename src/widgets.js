/**
 * Requires: 
 *  tamarack/core
 */

/**
 * An enum representing the direction 
 * to place the child elements in a 
 * TkStack.
 * 
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
			this._element.setAttribute("tkwidget", "");
	}

	/**
	 * Get all the TkWidgets currently in the DOM.
	 * @type {TkWidget[]}
	 */
	static get all() {
		let widgets = [];

		for (let widgetElement of document.querySelectorAll("[tkwidget]"))
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
	 * Remove attributes from the widget's element.
	 * 
	 * @param {String} attributes The attributes' names.
	 */
	removeAttribute(...attributes) {
		for (let attribute of attributes)
			this.e.removeAttribute(attribute);
	}

	/**
	 * Add attributes to the widget's element.
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
	 * widget's element and add new attribute it its place.
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
	 * Find the attribute in the widget's element that matches
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
	constructor(options = {}) {
		super(options, { tag: "div" });
		this.addAttribute("tkpanel");
	}

}

/**
 * A widget holding a <div> element that
 * places child elements either vertically
 * or horizontally in a "stack".
 */
class TkStack extends TkPanel {

	/**
	 * Create a TkStack.
	 * 
	 * @param {Any} options Same as TkWidget, minus options.tag.
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
 * A widget representing an <a> element.
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
 * A widget representing an <img> element.
 */
class TkImage extends TkWidget {

	/*** 
	 * Create a TkImage.
	 * 
	 * @param {Any} options Same as TkWidget, minus options.tag.
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
 * A widget representing a root <div> with two children:
 * an <img> and a <span>.
 */
class TkLabel extends TkPanel {

	/**
	 * Create a TkLabel.
	 * 
	 * @param {Any} options Same as TkWidget, minus options.tag.
	 * @param {String} options.text The text of the label.
	 * @param {String} options.image The image source of the label.
	 * @param {TkLabelLayout} options.layout The layout of the image.
	 * and text.
	 */
	constructor(options = {}) {
		super(options);
		this.addAttribute("tklabel");

		this.imageWidget = new TkImage({ parent: this });
		this.textWidget = new TkText("span", { parent: this });
		this.layout = TkLabelLayout.IMAGE_LEFT;
		this.text = options.text ?? "";
		this.image = options.image ?? "";
		this.layout = options.layout ?? TkLabelLayout.IMAGE_LEFT;
	}

	/**
	 * The text inside the text widget.
	 * @type {String}
	 */
	get text() {
		return this.textWidget.text;
	}

	set text(value) {
		this.textWidget.text = value;
	}

	/**
	 * The source of the image in the image
	 * widget.
	 * @type {String}
	 */
	get image() {
		return this.imageWidget.source;
	}

	set image(value) {
		if (value == null || value.trim() == "") {
			this.imageWidget.addAttribute("tk-hide");
		} else {
			this.imageWidget.removeAttribute("tk-hide");
		}

		this.imageWidget.source = value;
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
 * A widget representing a <button> element.
 * Allows setting the text and an image.
 */
class TkButton extends TkWidget {

	/**
	 * Create a TkButton.
	 * 
	 * @param {Any} options Same as TkWidget, minus options.tag.
	 * @param {String} options.text The text of the button.
	 * @param {String} options.image The image source of the button's image.
	 * @param {TkLabelLayout} options.layout The layout of the button.
	 * and text.
	 */
	constructor(options = {}) {
		super(options, { tag: "button" });
		this.addAttribute("tkbutton");

		this.role = "button";
		this.labelWidget = new TkLabel({ parent: this });
		this.text = options.text ?? "";
		this.image = options.image ?? "";
		this.layout = options.layout ?? TkLabelLayout.IMAGE_LEFT;
	}

	/**
	 * The text of the button.
	 * @type {String}
	 */
	get text() {
		return this.labelWidget.text;
	}

	set text(value) {
		this.labelWidget.text = value;
	}

	/**
	 * The source of the button's image.
	 * @type {String}
	 */
	get image() {
		return this.labelWidget.image;
	}

	set image(value) {
		this.labelWidget.image = value;
	}

	/**
	 * The layout of the button's image and text.
	 * @type {TkLabelLayout}
	 */
	get layout() {
		return this.labelWidget.layout;
	}

	set layout(value) {
		this.labelWidget.layout = value;
	}

}

/**
 * A TkNotebookPage is not a widget but represents the
 * two widgets that make up a notebook page: the tab, 
 * which is a TkButton, and the content, which is a 
 * TkPanel.
 */
class TkNotebookPage {

	/**
	 * Create a TkNotebookPage
	 * 
	 * @param {Any} options The options object.
	 * @param {String} options.title The tab's title.
	 * @param {Any} options.tabOptions The options object for 
	 * creating the tab button, which is a TkButton.
	 * @param {Any} options.contentOptions The options object for 
	 * creating the content panel, which is a TkPanel. 
	 */
	constructor(options = {}) {		
		// Create the tab widget
		this.tab = new TkButton(options.tabOptions);
		this.tab.addAttribute("tkNotebookPageTab");
		this.tab.associatedPage = this;

		// Create the content widget
		this.content = new TkPanel(options.contentOptions);
		this.tab.addAttribute("tkNotebookPageContent");
		this.content.associatedPage = this;

		if (options.title !== undefined)
			this.title = options.title;	
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
	 * If the tab page is visible
	 * 
	 * Do NOT set this directly on a TkPage, instead set the
	 * active tab in a notebook via TkNotebook.activePage.
	 * @type {Boolean}
	 */
	get activated() {
		return this.tab.hasClass("active");
	}

	set activated(value) {
		if(value) {
			this.tab.addClass("active");
			this.content.visible = true;
		} else {
			this.tab.removeClass("active");
			this.content.visible = false;
		}
	}

}

