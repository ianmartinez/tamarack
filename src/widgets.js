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
	 * 													   be it from a CSS selector (String), and existing element (HTMLElement),
	 * 													   or another TkWidget.
	 * @param {String} [options.tag] If representing a new element, the tag of the element to create.
	 * @param {Any} [options.attributes] The attributes to set for the element, in the format of 
	 * 									 {"attribute1": "value1", "attribute2": "value2"}
	 * @param {String} [options.className] The value of class attribute of the element to set.
	 * @param {String} [options.style] The value of style attribute of the element to set.		
	 */
    constructor(options = {}) {
		this._element = null;
		this._childWidgets = [];
		this._parentWidget = null;

		// Set the element
        if(options.from !== undefined) { // From an existing element
			if(TkObject.is(options.from, String)) { // Selector
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
		if(options.parent !== undefined)
			this.parent = options.parent;

        // Add the className, if specified
        if(options.className !== undefined)
			this.className = options.className;
			
		if (options.attributes !== undefined)
			for(let attributeName of Object.keys(options.attributes))
				this.setAttribute(attributeName, options.attributes[attributeName]);
				
		if (options.style !== undefined)
			this.setAttribute("style", options.style);
		
		// Add an attribute showing that the html element
		// is controlled by a TkWidget
        if(this._element != null)
            this._element.setAttribute("tk-widget", "");
    }

    get element() {
        return this._element;
    }

    set element(value) {
        this._element = value;
    }

    get e() {
        return this._element;
    }

    set e(value) {
        this._element = value;
	}
	
	delete() {
		if(this._parentWidget)
			this._parentWidget.remove(this);
		else
			this.e.remove();
	}

	get childElements() {
		return this.e.children;
	}

	get childElementsAsWidgets() {
		let childElements = [];

		for(let childElement of this.e.children)
			childElements.push(new TkWidget({from: childElement}));

		return childElements;
	}

    get children() {
		let childWidgets = [];

		for(let childElement of this.e.children) {
			// Find the widget representing this child, if it exists
			let matchingWidget = this._childWidgets.find(widget => widget.e == childElement);

			// If it does, add it to the array, if not create a new TkWidget and 
			// add it to the array
			childWidgets.push(matchingWidget ?? new TkWidget({from: childElement}));
		}

		return childWidgets;
	}
	
	get parent() {
		if(this._parentWidget != null) {
			return this._parentWidget;
		} else {
			let parentElement = this.e.parentElement;
			return (parentElement != null) ? new TkWidget({from: parentElement}) : null;
		}
	}

	set parent(value) {
		// Remove from DOM
		this.delete();

		// Set the new parent
		if(TkObject.is(value, TkWidget)) { // Other TkWidget
			value.add(this);
		} else if(TkObject.is(value, String)) { // Selector
			document.querySelector(value)?.appendChild(this.e);
		} else if(TkObject.is(value, HTMLElement)) {  // HTMLElement
			value.appendChild(this.e);
		}
	}

	add(...items) {		
		for(let item of items) {
			if(TkObject.is(item, TkWidget)) { // Other TkWidget
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

	remove(...items) {		
		for(let item of items) {
			if(TkObject.is(item, TkWidget)) { // Other TkWidget
				if(this.e.contains(item.e))
					this.e.removeChild(item.e); 
				item._parentWidget = null;
				TkArray.remove(this._childWidgets, item);
			} else if (TkObject.is(item, String)) { // Selector
				let selectedItem = document.querySelector(item);
				if (selectedItem)
				if(this.e.contains(selectedItem))
					this.e.removeChild(selectedItem);
			} else if (TkObject.is(item, HTMLElement)) { // HTMLElement
				if(this.e.contains(item))
					this.e.removeChild(item);
			}
		}
	}
	
	on(eventName, callback) {
		let widget = this;

		this.e.addEventListener(eventName, () => {
			callback(widget);
		});
	}

	trigger(eventName) {
		return this.e.dispatchEvent(new Event(eventName));
	}

    forEachChild(callback) {
		this.children.forEach(callback);
	}

	forEachChildDescending(callback) {
        TkArray.descend(this.children, callback);
	}

    get style() {
        return this.e.style;
    }

    getComputed(propertyName) {
		return window.getComputedStyle(this.e, null).getPropertyValue(propertyName);
	}
	
	hasFocus() {
		return (document.activeElement == this.e);
	}

	get className() {
		return this.e.className;
	}

	set className(value) {
		this.e.className = value;
    }
    
    addClass(...classes)	{
		classes.forEach((className) => {
			if(!this.hasClass(className))
				this.e.classList.add(className);
		});
	}

	removeClass(...classes)	{
		classes.forEach((className) => 
			this.e.classList.remove(className));
	}

	toggleClass(...classes)	{
		classes.forEach((className) => 
			this.e.classList.toggle(className));
	}

	classAt(index) {
		return this.e.classList.item(index);
	}

	hasClass(className) {
		return this.e.classList.contains(className);
    }

    hasAttribute(attribute) {
		return this.e.hasAttribute(attribute);
	}

	getAttribute(attribute) {
		return this.e.getAttribute(attribute);
	}

	setAttribute(attribute, value)	{
		this.e.setAttribute(attribute, value);		
	}

	removeAttribute(attribute)	{
		this.e.removeAttribute(attribute);
	}

	addAttribute(attribute) {
		this.e.setAttributeNode(document.createAttribute(attribute));
	}

	setAttributeNode(attributeNode) {
		this.e.setAttributeNode(attributeNode);
	}
    
    get role() {
		return this.getAttribute("role");
	}

	set role(role)	{
		this.setAttribute("role", role);
	}

    get innerHtml() {
		return this.e.innerHTML;
	}

	set innerHtml(value) {
		this.e.innerHTML = value;
	}
	
	get innerText() {
		return this.e.innerText;
	}

	set innerText(value) {
		this.e.innerText = value;
    }

	get isFullscreen() {
		return (TkDocument.fullscreenElement === this.e);
	}

	goFullscreen() {
		TkDocument.fullscreenElement = this.e;
	}

	toggleFullscreen() {
		if (this.isFullscreen)
			TkDocument.fullscreenElement = null;
		else
			TkDocument.fullscreenElement = this.e;
    }
    
    clear()	{
		// Remove widgets
		this.remove(...this._childWidgets);

		// Remove left over elements
		while (this.element.firstChild) 
			this.element.removeChild(this.element.firstChild);
    }
    
}