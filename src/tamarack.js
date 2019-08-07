


// The tamarackjs "namespace" - tk, for short
var tk = {};

// Enums
tk.LayoutDirection = Object.freeze({
	HORIZONTAL: 0,
	VERTICAL: 1
});

// Helper functions
tk.make = function(tag) {
	return document.createElement(tag);
};

tk.text = function(text) {
	return document.createTextNode(text);
};

tk.textElement = function(tag, text) {
	var element = tk.make(tag);
	element.appendChild(tk.text(text));
	return element;
}

tk.isDefined = function(object) {
	return typeof object !== "undefined";
}

tk.fallback = function(object, objectIfUndefined) {
	return tk.isDefined(object) ? object : objectIfUndefined;
}

tk.Size = class {
	width = 0;
	height = 0;

	constructor(width, height) {
		this.width = tk.fallback(width, 0);
		this.height = tk.fallback(height, 0);
	}

	getArea() {
		return this.width * this.height;
	}
}

tk.EventPair = class {
	targetElement = "";
	targetEvent = "";

	constructor(targetElement, targetEvent) {
		this.targetElement = targetElement;
		this.targetEvent = targetEvent;
	}
}

// System
tk.Timer = class {

}

tk.Array = class {

}

tk.Random = class {
	static integer(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	static decimal(min, max) {
		return Math.random() < 0.5 ? ((1-Math.random()) * (max-min) + min) : (Math.random() * (max-min) + min);
	}

	static item(...array) {
		return array[tk.Random.integer(0, array.length - 1)];
	}
}

tk.Number = class {
	static toPercent(value, max) {
		return ((value*100)/max);
	}

	static toPercentF(value, max)	{
		return this.toPercent(value, max) + "%";
	}

	static fromPercent(value, max)	{
		return ((value * max)/100);
	}
}

tk.Color = class {

}

tk.Element = class {
	_base; // The html element
	_eventMaps = [];

	constructor(element, options) {
		this._base = tk.isDefined(element) ? element : document.body; 

		if(tk.isDefined(options)) {
			if(tk.isDefined(options.className))
				this.className = options.className;

			if (tk.isDefined(options.attributes)) {
				var attributeNames = Object.keys(options.attributes);
				console.log(attributeNames)

				attributeNames.forEach(attributeName => 
					this._base.setAttribute(attributeName, options.attributes[attributeName]));
			}	

			if (tk.isDefined(options.style))
				this._base.setAttribute("style", options.style);
		}
	}

	static from(selector) {
		return new tk.Element(document.querySelector(selector));
	}

	get element() {
		return this._base;
	}

	set element(newElement) {
		this._base = newElement;
	}

	get e() {
		return this.element;
	}

	set e(newElement) {
		this.element = newElement;
	}

	on(eventName, callback) {
		var tkElement = this;

		if(tk.isDefined(this._eventMaps[eventName])) {
			var eventPair = this._eventMaps[eventName];
			eventPair.targetElement.addEventListener(eventPair.targetEvent, function() {
				callback(tkElement);
			});
		} else {
			this.element.addEventListener(eventName, function() {
				callback(tkElement);
			});
		}
	}

	trigger(eventName) {	
		if(tk.isDefined(this._eventMaps[eventName])) {
			var eventPair = this._eventMaps[eventName];
			console.log(eventPair)
			eventPair.targetElement.dispatchEvent(new Event(eventPair.targetEvent));
		} else {
			return this.element.dispatchEvent(new Event(eventName));
		}
	}

	get style() {
		return this.element.style;
	}

	getComputed(propertyName) {
		return window.getComputedStyle(this.element, null).getPropertyValue(propertyName);
	}
	
	hasFocus() {
		return (document.activeElement == this.element);
	}

	get innerHtml() {
		return this.element.innerHTML;
	}

	set innerHtml(innerHtml) {
		this.element.innerHTML = innerHtml;
	}

	makeFullscreen() {
		if (this.element.requestFullscreen)
			this.element.requestFullscreen();
		else if (this.element.msRequestFullscreen) 
			this.element.msRequestFullscreen();
		else if (this.element.mozRequestFullScreen) 
			this.element.mozRequestFullScreen();
		else if (this.element.webkitRequestFullscreen) 
			this.element.webkitRequestFullscreen();
	}

	exitFullscreen() {
		if (document.exitFullscreen) 
			document.exitFullscreen();
		else if (document.webkitExitFullscreen)
			document.webkitExitFullscreen();
		else if (document.mozCancelFullScreen)
			document.mozCancelFullScreen();
		else if (document.msExitFullscreen) 
			document.msExitFullscreen();
	}

	isFullscreen() {
		return (document.fullscreenElement == this.element 
			|| document.mozFullScreenElement == this.element 
			|| document.webkitFullscreenElement == this.element 
			|| document.msFullscreenElement == this.element);
	}

	toggleFullscreen() {
		if (this.isFullscreen())
			this.exitFullscreen();
		else
			this.makeFullscreen();
	}

	hasAttribute(attribute) {
		return this.element.hasAttribute(attribute);
	}

	getAttribute(attribute) {
		return this.element.getAttribute(attribute);
	}

	setAttribute(attribute, value)	{
		this.element.setAttribute(attribute, value);		
	}

	removeAttribute(attribute)	{
		this.element.removeAttribute(attribute);
	}

	addAttribute(attribute) {
		this.element.setAttributeNode(document.createAttribute(attribute));
	}

	setAttributeNode(attributeNode) {
		this.element.setAttributeNode(attributeNode);
	}

	get role() {
		return this.getAttribute("role");
	}

	set role(role)	{
		this.setAttribute("role", role);
	}

	addClass(...classes)	{
		classes.forEach((className) => 
			this.element.classList.add(className));
	}

	removeClass(...classes)	{
		classes.forEach((className) => 
			this.element.classList.remove(className));
	}

	toggleClass(...classes)	{
		classes.forEach((className) => 
			this.element.classList.toggle(className));
	}

	classAt(index) {
		return this.element.classList.item(index);
	}

	hasClass(className) {
		return this.element.classList.contains(className);
	}

	get className() {
		return this.element.className;
	}

	set className(className) {
		this.element.className = className;
	}

	add(...widgets) {		
		widgets.forEach((widget) => {			
			this.element.appendChild(widget.element);
			widget._parent = this;
		});
	}

	remove(...widgets) {		
		widgets.forEach((widget) => {			
			this.element.appendChild(widget.element);
			widget._parent = this;
		});
	}

	addElement(...elements) {
		elements.forEach((element) => {			
			this.element.appendChild(element);
		});
	}

	removeElement(...elements) {
		elements.forEach((element) => {			
			this.element.removeChild(element);
		});
	}

	clear()	{
		while (this.element.firstChild) 
			this.element.removeChild(this.element.firstChild);
	}

	/* Shorcuts to common styles so you
		can type:
		widget.color = "black";
				instead of
		widget.e.style.color = "black";
	*/
	get background() {
		return this.element.style.background;
	}

	set background(background) {
		this.element.style.background = background;
	}		
	
	get color() {
		return this.element.style.color;
	}

	set color(color) {
		this.element.style.color = color;
	}	
	
	get border() {
		return this.element.style.border;
	}

	set border(border) {
		this.element.style.border = border;
	}	
	
	get padding() {
		return this.element.style.padding;
	}

	set padding(padding) {
		this.element.style.padding = padding;
	}	
	
	get margin() {
		return this.element.style.margin;
	}

	set margin(margin) {
		this.element.style.margin = margin;
	}
	
	get display() {
		return this.element.style.display;
	}

	set display(display) {
		this.element.style.display = display;
	}

	get cursor() {
		return this.element.style.cursor;
	}

	set cursor(cursor) {
		this.element.style.cursor = cursor;
	}
} 

tk.View = class extends tk.Element {
	constructor(title, options) {
		super(document.body, options);

		if(tk.isDefined(title))
			this.title = title;

		// Events
		this._eventMaps["loaded"] = new tk.EventPair(document, "DOMContentLoaded");

	}

	/*
		Events:
		Loaded
		Closing
		Resize
		Fullscreen
	 */

	whenReady(callback) {
		if (this.hasLoaded) {
			callback();
		} else {
			document.addEventListener("DOMContentLoaded", callback);
		}
	}

	onExit(callback) {
		
	}

	get hasLoaded () {
		return document.readyState === "complete" 
			|| (document.readyState !== "loading" && !document.documentElement.doScroll);
	}

	get title()	{
		return document.title;
	}
	
	set title(title) {
		document.title = title;
	}

	get appIcon() {

	}

	set appIcon(appIcon) {

	}

	get icon()	{

	}
	
	set icon(icon) {

	}

	buildUrl(urlBase, args, values) {
		let url = urlBase + "?";
		let max = Math.min(args.length, values.length);

		for(var i=0; i<max; i++) {
			url += args[i] + "=" + values[i];
			if (i < max-1) url += "&";
		}

		return url;
	}

	parseUrl(name, url) {
		if (!url)
			url = window.location.href;
		
		name = name.replace(/[\[\]]/g, "\\$&");
		var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
			results = regex.exec(url);

		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, " "));
	}

	getParameter(name)	{
		return this.parseUrl(name, this.getUrl());
	}
				
	getUrl() {
		return window.location.href;
	}

	// Return a list of all stylesheets
	getStylesheets() {

	}

	addStylesheet(...stylesheet) {

	}

	removeStylesheet(...stylesheet) {

	}

	clearStylesheets(removeTamarackCss) {

	}

	hasStylesheet(stylesheet) {

	}

	// <style>
	addStyle(style) {

	}

	removeStyle(style) {

	}

	getSize() {

	}
}

tk.Widget = class extends tk.Element {	
	_parent; // The parent tk.Element of a tk.Widget

	constructor(tag, options) {
		super(tk.make(tk.fallback(tag, "div")), options);
		if(tk.isDefined(options)) {
			if(tk.isDefined(options.parent))
				options.parent.add(this);
		}
	}	

	getParent() {
		return this._parent;
	}
	
	getParentElement() {
		return this.element.parentNode;
	}

	addToElement(destinationElement) {
		destinationElement.appendChild(this.element);
	}

	addTo(destinationWidget) {
		destinationWidget.element.appendChild(this.element);
		this._parent = destinationWidget;
	}

	removeFromElement(destinationElement) {
		destinationElement.removeChild(this.element);
	}

	removeFrom(destinationWidget) {
		destinationWidget.element.removeChild(this.element);
		this._parent = null;
	}

	delete() {
		if(this.element.parentNode) {
			this.element.parentNode.removeChild(this.element);
			this._parent = null;
		}
	}

	get tooltip() {
		// TODO: PopperJs
		return "";
	}

	set tooltip(tooltipWidget) {
		// TODO: PopperJs
	}
}

tk.Text = class extends tk.Widget {
	constructor(tag, text, options) {
		super(tag, options);
		this.textNode = document.createTextNode(tk.fallback(text, ""));
		this.element.appendChild(this.textNode);
	}

	get text() {
		return this.textNode.nodeValue;
	}
	
	set text(value) {
		this.textNode.nodeValue = value;
	}
}

tk.Link = class extends tk.Text {
	constructor(text, url, options) {
		super("a", text, options);		
		this.url = tk.fallback(url, "#");		
	}

	get url() {
		return this.getAttribute("href");
	}

	set url(url) {
		this.setAttribute("href", url);
	}
}

tk.NotebookPage = class {
	constructor(title, id) {

	}
	
	get title() {
	}
	
	set title(text) {
	}

	get hidden() {

	}

	set hidden(hidden) {

	}

	get sheet() {

	}

	set sheet(tabSheet) {

	} 

	get button() {

	}

	set button(button) {

	} 

	get icon() {

	}

	set icon(icon) {

	}
}

tk.Notebook = class extends tk.Widget {
	constructor(options) {
		super(options);
	}
	
	addPage(...pages) {

	}
	
	removePage(...pages) {		

	}	

	clear() {

	}

	get active() {

	}

	set active(page) {

	}
	
	get activeIndex() {

	}
	
	set activeIndex(index) {

	}

	get tabsVisible() {

	}
	
	set tabsVisible(visible) {

	}
	
	indexOf(page) {

	}

	get pageCount() {

	}
		
	back() {
			
	}
	
	next() {

	}
}

tk.NotebookMenuPage = class extends tk.NotebookPage {

}

tk.NotebookMenu = class extends tk.Notebook {

}

tk.Layout = class extends tk.Widget {
	constructor(options) {
		this.direction = tk.fallback(options.direction, tk.LayoutDirection.HORIZONTAL);		
		this.resizable = tk.fallback(options.resizable, false);
		this.panels = tk.fallback(options.panels, []);		

		super(options);
	}

	get direction() {

	}

	set direction(layoutDirection) {

	}

	get resizable() {

	}

	set resizable(resizable) {

	}

	get panels() {

	}

	set panels(panels) {

	}
}

tk.Button = class extends tk.Text {
	constructor(text, options) {
		super("button", text, options);
		this.setAttribute("type", "button");
	}
}

// Used for both context and menu bars
tk.Menu = class extends tk.Widget {

}

// TextArea
tk.Edit = class extends tk.Widget {

}

// .group represents a group 
tk.Radio = class extends tk.Widget {

}

tk.Check = class extends tk.Widget {

}

tk.ListBox = class extends tk.Widget {

}

tk.GroupBox = class extends tk.Widget {

}

tk.ColorButton = class extends tk.Widget {

}

tk.Canvas = class extends tk.Widget {

}

tk.Slider = class extends tk.Widget {

}

tk.Input = class extends tk.Widget {

}

// Dialogs
tk.Dialog = class extends tk.Widget {

}

tk.ColorDialog = class extends tk.Dialog {

}

tk.FontDialog = class extends tk.Dialog {

}

tk.AboutDialog = class {
	static show() {

	}
}


// Media
tk.Image = class extends tk.Widget {

}

tk.MediaPlayer = class extends tk.Widget {

}

tk.AudioPlayer = class extends tk.MediaPlayer {

}

tk.VideoPlayer = class extends tk.MediaPlayer {

}

// Status 
tk.Progress = class extends tk.Widget {

}

tk.Meter = class extends tk.Widget {

}