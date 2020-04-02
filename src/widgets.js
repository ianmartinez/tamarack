/**
 * Requires: 
 *  tamarack/core
 */

 
/**
 * Represents an HTML element and exposes additional 
 * functionality that makes manipulating elements easier.
 */
class TkWidget {

    constructor(options = {}) {
		this._element = null;
		this._childWidgets = [];
		this._parentWidget = null;

		// Set the element
        if(options.from !== undefined) { // From an existing element
			if(TkObject.is(options.from, String))
				this._element = document.querySelector(options.from);
			else if (TkObject.is(options.from, HTMLElement))
				this._element = options.from;
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
            this._element.setAttribute("tk-element", "");
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
		return this._childWidgets;
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
		if(TkObject.is(value, TkWidget)) {
			value.add(this);
		} else if(TkObject.is(value, HTMLElement)) {
			value.appendChild(this.e);
		}
	}

	add(...items) {		
		for(let item of items) {
			if(item instanceof TkWidget) {
				this.e.appendChild(item.e);
				item._parentWidget = this;
				this._childWidgets.push(item);
			} else if (item instanceof HTMLElement) {
				this.e.appendChild(item);
			}
		}
	}

	remove(...items) {		
		for(let item of items) {
			if(item instanceof TkWidget) {
				this.e.removeChild(item.e);
				item._parentWidget = null;
				TkArray.remove(this._childWidgets, item);
			} else if (item instanceof HTMLElement) {
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
    
    goFullscreen() {
		if (this.e.requestFullscreen)
			this.e.requestFullscreen();
		else if (this.e.mozRequestFullScreen) 
			this.e.mozRequestFullScreen();
		else if (this.e.webkitRequestFullscreen) 
			this.e.webkitRequestFullscreen();
	}

	exitFullscreen() {
		if (document.exitFullscreen) 
			document.exitFullscreen();
		else if (document.webkitExitFullscreen)
			document.webkitExitFullscreen();
		else if (document.mozCancelFullScreen)
			document.mozCancelFullScreen();
	}

	isFullscreen() {
		return (document.fullscreenElement == this.e 
				|| document.mozFullScreenElement == this.e 
				|| document.webkitFullscreenElement == this.e);
	}

	toggleFullscreen() {
		if (this.isFullscreen())
			this.exitFullscreen();
		else
			this.goFullscreen();
    }
    
    clear()	{
		while (this.element.firstChild) 
			this.element.removeChild(this.element.firstChild);
    }
    
}