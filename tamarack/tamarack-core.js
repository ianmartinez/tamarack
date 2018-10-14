// To make jQuery work in Electron
if(typeof require == 'function') window.$ = window.jQuery = require('./../jquery/jquery.min.js');

// Tamarack
function getTamarackVersion() 
{
	return 0.6;
}

function makeParagraphs(_input) 
{
	var html_string = "";
	var lines = _input.split("\n");
	for(var i=0;i<lines.length;i++)
		html_string += "<p>" + lines[i] + "</p>";
	
	return html_string;
}

function createLinearGradient(_angle_deg,_colors)
{
	var gradient = "linear-gradient(" + _angle_deg + "deg";
	for(var i=0;i<_colors.length;i++)
		gradient += ("," + _colors[i] + " " + toPercent(i,_colors.length));
	return gradient + " )";
}

function toPercent(_value,_max)
{
	return ((_value*100)/_max) + "%";
}

function toPercentNum(_value,_max)
{
	return ((_value*100)/_max);
}

function fromPercent(_value,_max)
{
	return ((_value*_max)/100);
}

function say(_text) 
{
	return document.createTextNode(_text);
}

function sayP(_text) 
{
	var textNode = document.createTextNode(_text);
	var p = make("p");
	p.appendChild(textNode);
	return p;
}

function sayLine(_text,_tag) 
{
	var textNode = document.createTextNode(_text);
	var element = make(_tag);
	element.appendChild(textNode);
	return element;
}

// global functions
function make(_tag) 
{
	return document.createElement(_tag);
}

function random(_min,_max) 
{
    _min = Math.ceil(_min);
	_max = Math.floor(_max);
	return Math.floor(Math.random() * (_max - _min + 1)) + _min;
}

function randomRgb() 
{
	return "rgb(" + random(0,255) + "," + random(0,255) + "," + random(0,255) + ")";
}

function randomRgba() 
{
	return "rgba(" + random(0,255) + "," + random(0,255) + "," + random(0,255) + "," + Math.random() + ")";
}

function compareArray(_arr) 
{
	for(var i=0;i<_arr.length;i++)
		for(var j=0;j<_arr.length;j++)
			if (_arr[i]!=_arr[j])
				return false;
	return true;
}

function isArray(_arr) 
{
	return (_arr.constructor === Array);
}

class tkFont 
{
	constructor(_family,_size,_weight,_style) 
	{
		this.family = _family;
		this.size = _size;
		this.weight = _weight;
		this.style = _style;
		this.variant = "";
	}

	getCss() 
	{
		return this.style + " " + 
		this.variant + " " +
		this.weight + " " +
		this.size + " " +
		this.family;
	}
}

class tkColor 
{
	constructor(_css) 
	{
		this.r = 0;
		this.g = 0;
		this.b = 0;

		this.h = 0;
		this.s = 0;
		this.l = 0;

		this.a = 1;

		if(_css)
			this.parse(_css);
	}

	equals(_other) 
	{
		if(	_other.h == this.h && _other.s == this.s && _other.l == this.a && _other.a == this.a)
			return true;
		return false;
	}

	isColor(_color)
	{
		if (_color === "" || _color === "inherit" || _color === "transparent") 
			return false;

		var image = make("img");
		image.style.color = "rgb(0, 0, 0)";
		image.style.color = _color;

		if (image.style.color !== "rgb(0, 0, 0)") 
			return true; 

		image.style.color = "rgb(255, 255, 255)";
		image.style.color = _color;
		return (image.style.color !== "rgb(255, 255, 255)");
	}
	
	randomize()	
	{
		this.fromRgba(random(0,255),random(0,255),random(0,255),Math.random());
	}

	randomizeOpaque() 
	{
		this.fromRgba(random(0,255),random(0,255),random(0,255),1);
	}

	clone()	
	{
		var new_color = new tkColor();
		new_color.fromHsla(this.h,this.s,this.l,this.a);
		return new_color;
	}

	fromRgba(_r,_g,_b,_a) 
	{
		var hsl = this.rgbToHsl(_r,_g,_b);
		this.r = _r;
		this.g = _g;
		this.b = _b;

		this.h = hsl[0];
		this.s = hsl[1];
		this.l = hsl[2];

		this.a = _a;
	}

	fromHsla(_h,_s,_l,_a) 
	{
		var rgb = this.hslToRgb(_h,_s,_l);
		this.r = rgb[0];
		this.g = rgb[1];
		this.b = rgb[2];

		this.h = _h;
		this.s = _s;
		this.l = _l;

		this.a = _a;
	}

	fromHex(_hex) 
	{
		var rgb = this.hexToRgb(_hex);
		this.fromRgba(rgb[0],rgb[1],rgb[2],this.a);
	}

	parse(_input)
	{
		if(_input.startsWith("#")) {
			this.fromHex(_input);
		} else if (_input.startsWith("hsl")) {
			var trimmed = _input.replace("hsla(","");
			trimmed = trimmed.replace("hsl(","");
			trimmed = trimmed.replace(")","");
			var chunks = trimmed.split(",");
			if (chunks.length == 3) // hsl
				this.fromHsla(parseInt(chunks[0]),parseInt(chunks[1]),parseInt(chunks[2]),1);
			else if (chunks.length == 4) //hsla 
				this.fromHsla(parseInt(chunks[0]),parseInt(chunks[1]),parseInt(chunks[2]),parseFloat(chunks[3]),1);
		} else if (_input.startsWith("rgb")) {
			var trimmed = _input.replace("rgba(","");
			trimmed = trimmed.replace("rgb(","");
			trimmed = trimmed.replace(")","");
			var chunks = trimmed.split(",");
			if (chunks.length == 3) // rgb
				this.fromRgba(parseInt(chunks[0]),parseInt(chunks[1]),parseInt(chunks[2]),1);
			else if (chunks.length == 4) //rgba
				this.fromRgba(parseInt(chunks[0]),parseInt(chunks[1]),parseInt(chunks[2]),parseFloat(chunks[3]),1);
		} else {
			this.fromRgba(0,0,0,0);
		}
	}

	getHslaCss()
	{
		return "hsla(" + this.h.toFixed(0) + ", " + this.s.toFixed(0) + "%, " + this.l.toFixed(0) + "%, " + this.a.toFixed(2) + ")";
	}

	getRgbaCss()
	{
		return "rgba(" + this.r.toFixed(0) + ", " + this.g.toFixed(0) + ", " + this.b.toFixed(0) + ", " + this.a.toFixed(2) + ")";
	}

	getHexCss()
	{
		return this.rgbToHex(this.r,this.g,this.b);
	}

	hslToRgb(h, s, l)
	{
		var r, g, b;

		if(h>0) h /= 360;
		if(s>0) s /= 100;
		if(l>0) l /= 100;

		if(s == 0) {
			r = g = b = l; // achromatic
		} else {
			var hue2rgb = function hue2rgb(p, q, t) {
				if(t < 0) t += 1;
				if(t > 1) t -= 1;
				if(t < 1/6) return p + (q - p) * 6 * t;
				if(t < 1/2) return q;
				if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
				return p;
			}

			var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
			var p = 2 * l - q;
			r = hue2rgb(p, q, h + 1/3);
			g = hue2rgb(p, q, h);
			b = hue2rgb(p, q, h - 1/3);
		}

		return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
	}

	rgbToHsl(r, g, b)
	{
		r /= 255, g /= 255, b /= 255;
		var max = Math.max(r, g, b), min = Math.min(r, g, b);
		var h, s, l = (max + min) / 2;

		if(max == min) {
			h = s = 0; // achromatic
		} else {
			var d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
			switch(max) {
				case r: h = (g - b) / d + (g < b ? 6 : 0); break;
				case g: h = (b - r) / d + 2; break;
				case b: h = (r - g) / d + 4; break;
			}
			h /= 6;
		}

		return [h*360, s*100, l*100];
	}

	hexToRgb(_hex)
	{
		// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
		var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
		_hex = _hex.replace(shorthandRegex, function(m, r, g, b) {
			return r + r + g + g + b + b;
		});

		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(_hex);
		return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
	}

	rgbToHex(_r,_g,_b)
	{
		return "#" + ((1 << 24) + (_r << 16) + (_g << 8) + _b).toString(16).slice(1);
	}

	isDark()
	{
		return (this.l <= 50 && this.a > 0.4);
	}
	
	isLight()
	{
		return (!this.isDark());
	}

	isGray()
	{
		return (compareArray([this.r,this.g,this.b]));
	}
}

// A control can be any html element
class tkControl
{	
	constructor() 
	{
		this.element = document.body;
		this.element.id = "";
	}
	
	get id() 
	{
		return this.element.id;
	}
	
	set id(_id) 
	{
		this.element.id = _id;
	}
	
	get style()
	{
		return this.element.style;
	}
	
	// shorthand for this.element
	get e()
	{
		return this.element;
	}
	
	set e(_e)
	{
		this.element = _e;
	}

	get innerHtml() 
	{
		return this.element.innerHTML;
	}

	set innerHtml(_html) 
	{
		this.element.innerHTML = _html;
	}
	
	// fullscreen
	makeFullscreen()
	{
		if (this.element.requestFullscreen)
			this.element.requestFullscreen();
		else if (this.element.msRequestFullscreen) 
		  this.element.msRequestFullscreen();
		else if (this.element.mozRequestFullScreen) 
		  this.element.mozRequestFullScreen();
		else if (this.element.webkitRequestFullscreen) 
		  this.element.webkitRequestFullscreen();
	}	

	exitFullscreen()
	{
		if (document.exitFullscreen) 
			document.exitFullscreen();
		else if (document.webkitExitFullscreen)
			document.webkitExitFullscreen();
		else if (document.mozCancelFullScreen)
			document.mozCancelFullScreen();
		else if (document.msExitFullscreen) 
			document.msExitFullscreen();
	}

	isFullscreen()
	{
		return (document.fullscreenElement == this.element 
				|| document.mozFullScreenElement == this.element 
				|| document.webkitFullscreenElement == this.element 
				|| document.msFullscreenElement == this.element);
	}

	toggleFullscreen()
	{
		if (this.isFullscreen())
			this.exitFullscreen();
		else
			this.makeFullscreen();
	}

	// attributes	
	hasAttribute(_attribute)
	{
		return this.element.hasAttribute(_attribute);
	}
	
	getAttribute(_attribute)
	{
		return this.element.getAttribute(_attribute);
	}
	
	setAttribute(_attribute,_value)
	{
		this.element.setAttribute(_attribute,_value);		
	}
	
	removeAttribute(_attribute)
	{
		this.element.removeAttribute(_attribute);
	}
	
	addAttribute(_attribute)
	{
		var attribute = document.createAttribute(_attribute); 
		this.element.setAttributeNode(attribute);
	}

	setAttributeNode(_attribute)
	{
		this.element.setAttributeNode(_attribute);
	}

	get width()
	{
		return this.getAttribute("width");
	}
	
	set width(_width)
	{
		this.setAttribute("width",_width);
		this.element.style.width = _width + "px";
	}
		
	get height()
	{
		return this.getAttribute("height");
	}

	set height(_height)
	{
		this.setAttribute("height",_height);
		this.element.style.height = _height + "px";
	}
	
	setSize(_width,_height) 
	{
		this.width = _width;
		this.height = _height;
	}

	get padding() 
	{
		return this.element.style.padding;
	}

	set padding(_padding) 
	{
		this.element.style.padding = _padding;
	}
	
	get margin() 
	{
		return this.element.style.margin;
	}

	set margin(_margin) 
	{
		this.element.style.margin = _margin;
	}
		
	clear()
	{
		while (this.element.firstChild) 
			this.element.removeChild(this.element.firstChild);
	}

	// class
	addClass()
	{
		for (var i=0;i<arguments.length;i++)
			this.element.classList.add(arguments[i]);
	}

	removeClass()
	{
		for (var i=0;i<arguments.length;i++)
			this.element.classList.remove(arguments[i]);
	}

	toggleClass(_class)
	{
		this.element.classList.toggle(_class);
	}

	classAt(_index)
	{
		this.element.classList.item(_index);
	}

	hasClass(_class)
	{
		return this.element.classList.contains(_class);
	}

	get className()
	{
		return this.element.className;
	}

	set className(_class_name)
	{
		this.element.className = _class_name;
	}

	add()
	{
		for (var i=0;i<arguments.length;i++)
			this.element.appendChild(arguments[i].element);
	}

	addElement(_element)
	{
		for (var i=0;i<arguments.length;i++)
			this.element.appendChild(arguments[i]);
	}

	remove()
	{
		for (var i=0;i<arguments.length;i++)
			this.element.removeChild(arguments[i].element);
	}

	removeElement()
	{
		for (var i=0;i<arguments.length;i++)
			this.element.removeChild(arguments[i]);
	}
}


// A widget is a control that is associated with an element besides document.
class tkWidget extends tkControl
{
	constructor()
	{
		super();
		this.element = make("div");
		this.tooltipElement = null;
	}

	addToElement(_destination) 
	{
		_destination.appendChild(this.element);
	}

	addTo(_destination) 
	{
		_destination.element.appendChild(this.element);
	}
	
	removeFromElement(_destination) 
	{
		_destination.removeChild(this.element);
	}

	removeFrom(_destination) 
	{
		_destination.element.removeChild(this.element);
	}

	// animations
	fadeIn()
	{
		$(this.element).fadeIn(150);
	}

	fadeOut()
	{
		$(this.element).fadeOut(150);
	}

	slide()
	{
		$(this.element).slideToggle(250);
	}

	// element to display on mouse hover
	get tooltip()
	{
		return this.tooltipData;
	}

	set tooltip(_tooltip)
	{
		if (_tooltip)
		{
			this.tooltipElement = make("span");
			this.tooltipData = _tooltip;
			this.tooltipElement.appendChild(this.tooltipData);
			this.addElement(this.tooltipElement);
			
			this.tooltipElement.classList.add("tkTooltip");
			var tooltipElement = this.tooltipElement;
			this.element.addEventListener ("mouseover", function(e) {
				tooltipElement.classList.add("visible");
			}, false);
			
			this.element.addEventListener ("mouseout", function(e) {
				tooltipElement.classList.remove("visible");
			}, false);
		} else {
			this.removeElement(this.tooltipElement);
			this.tooltipData = null;
			this.tooltipElement = null;
		}
	}
}

class tkDocument extends tkControl
{	
	constructor() 
	{
		super();
		this.element = document.body;
	}
	
	get title()
	{
		return document.title;
	}
	
	set title(_title)
	{
		return document.title = _title;
	}

	setBackground(_background)
	{
		this.style.backgroundColor = _background;
	}

	setBackgroundColor(_background)
	{
		this.style.background = _background;
	}

	setBackgroundGradient(_angle_deg,_start,_end)
	{
		this.style.background = "linear-gradient(" + _angle_deg + "deg," + _start  + "," + _end + ") fixed";
	}

	setBackgroundImage(_background)
	{
		this.style.backgroundImage = _background;
	}

	setBackgroundImageCover(_image)
	{
		this.style.background = "url(" + _image + ") no-repeat center center fixed";
	}

	clearBackground()
	{
		this.style.background = null;
	}

	buildUrl(_url,_args,_vals) 
	{
		let url = _url + "?";
		let max = Math.min(_args.length,_vals.length);
		for(var i=0; i<max; i++) {
			url += _args[i] + "=" + _vals[i];
			if (i < max-1) url += "&";
		}

		return url;
	}

	parseUrl(_name, _url) 
	{
		if (!_url)
			_url = window.location.href;
		
		_name = _name.replace(/[\[\]]/g, "\\$&");
		var regex = new RegExp("[?&]" + _name + "(=([^&#]*)|&|#|$)"),
			results = regex.exec(_url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, " "));
	}

	getParameter(_name) 
	{
		return this.parseUrl(_name,this.getUrl());
	}
				
	getUrl()
	{
		return window.location.href;
	}
	
	isFullscreen() 
	{
		if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) 
				return true;
			return false;
	}
}

class tkElement extends tkWidget 
{
	constructor(_element) 
	{
		super(_element.id);
		this.element = _element;
	}
}

function makeElement(_elem) 
{
	return new tkElement(_elem);
}

function makeElementFromId(_id) 
{
	return new tkElement(document.getElementById(_id));
}

class tkText extends tkWidget 
{
	constructor(_tag) 
	{
		super();
		
		this.element = make(_tag);
		this.textNode = document.createTextNode("");
		this.element.appendChild(this.textNode);
	}

	get text() 
	{
		return this.textNode.nodeValue;
	}
	
	set text(_string) 
	{
		this.textNode.nodeValue = _string;
	}
}

class tkLink extends tkText
{
	constructor()
	{
		super("a");
	}
		
	// Link source
	get source() 
	{
		return this.getAttribute("href");
	}

	set source(_source) 
	{
		this.setAttribute("href",_source);
	}
}

class tkButton extends tkWidget
{
	constructor(_button_type) 
	{
		super();

		this.element = make("button");
		this.element.type = "button";
		this.className = ((_button_type) ? _button_type : "btn btn-primary");
		
		this.imageWidget = new tkImage();
		this.imageWidget.className = "tkButtonImage";
		this.element.appendChild(this.imageWidget.element);
		this.imageWidget.e.style.display = "none";

		this.textWidget = new tkText("p");
		this.textWidget.className = "tkButtonText";
		this.element.appendChild(this.textWidget.element);
	}	

	get image()
	{
		return this.image.source;
	}

	set image(_image)
	{
		if(_image)
			this.imageWidget.e.style.display = "inline";
		else {			
			this.imageWidget.e.style.display = "none";
			return;
		}

		this.imageWidget.source = _image;
	}

	get text()
	{
		return this.textWidget.text;
	}

	set text(_text)
	{
		this.textWidget.text = _text;
	}
}

class tkDiv extends tkWidget 
{
	constructor() 
	{
		super();
		this.element = make("div");
	}
}

class tkMediaPlayer extends tkWidget 
{
	constructor() 
	{
		super();
	}

	get source() 
	{
		return this.element.src;
	}

	set source(_source) 
	{
		this.element.src = _source;
	}
	
	get showControls()
	{
		return (this.hasAttribute("controls"));
	}
	
	set showControls(_visible)
	{
		if (this.showControls == true)
			this.removeAttribute("controls");
		
		if (_visible)
			this.addAttribute("controls");
	}
	
	get autoplay()
	{
		return (this.hasAttribute("autoplay"));
	}
	
	set autoplay(_enabled)
	{
		if (this.autoplay == true)
			this.removeAttribute("autoplay");
		
		if (_enabled)
		{
			var auto = document.createAttribute("autoplay"); 
			this.setAttributeNode(auto);
		}
	}
	
	isPaused()
	{
		return this.element.paused;
	}
	
	play()
	{
		this.element.play();
	}
	
	pause()
	{
		this.element.pause();
	}

	togglePlay() 
	{
		if(this.isPaused()) 
			this.play();
		else
			this.pause();
	}
	
	get loop()
	{
		return this.element.loop;
	}
	
	set loop(_loop)
	{
		this.element.loop = _loop;
	}
	
	get mute()
	{
		return this.element.muted;
	}
	
	set mute(_mute)
	{
		this.element.muted = _mute;
	}
	
	get currentTime()
	{
		return this.element.currentTime;
	}
	
	set currentTime(_time)
	{
		this.element.currentTime = _time;
	}
	
	getDuration()
	{
		return this.element.duration;
	}
	
	get playbackRate()
	{
		return this.element.playbackRate;
	}
	
	set playbackRate(_rate)
	{
		this.element.playbackRate = _rate;
	}
	
	getNetworkState()
	{
		return this.element.networkState;
	}
	
	getReadyState()
	{
		return this.element.readyState;
	}
	
	getSeekable()
	{
		return this.element.seekable;
	}
	
	isSeeking()
	{
		return this.element.seeking;
	}
	
	get textTracks()
	{
		return this.element.textTracks;
	}
	
	set textTracks(_tracks)
	{
		this.element.textTracks = _Tracks;
	}
	
	get volume()
	{
		return this.element.volume;
	}
	
	set volume(_volume)
	{
		this.element.volume = _volume;
	}
	
	canPlay(_type)
	{
		return this.element.canPlayType(_type);
	}
}

class tkVideoPlayer extends tkMediaPlayer
{
	constructor()
	{
		super();
		this.element = make("video"); 
		this.showControls = true;
	}	
}

class tkAudioPlayer extends tkMediaPlayer
{
	constructor()
	{
		super();
		this.element = make("audio"); 
	}
}

class tkImage extends tkWidget
{
	constructor()
	{
		super();
		this.element = make("img"); 
	}
	
	// Image source
	get source() 
	{
		return this.element.src;
	}

	set source(_source) 
	{
		this.element.src = _source;
	}
	
	// Image alternative text
	get alt() 
	{
		return this.element.alt;
	}

	set alt(_alt) 
	{
		this.element.alt = _alt;
	}
}

class tkProgress extends tkWidget
{
	constructor()
	{
		super();
		this.element = make("progress"); 
	}
	
	get max()
	{
		return this.element.max;
	}
	
	set max(_max)
	{
		this.element.max = _max;
	}
	
	get value()
	{
		return this.element.value;
	}
	
	set value(_value)
	{
		this.element.value = _value;
	}
}

class tkMeter extends tkWidget
{
	constructor()
	{
		super();
		this.element = make("meter"); 
	}
	
	get value()
	{
		return this.element.value;
	}
	
	set value(_value)
	{
		this.element.value = _value;
	}
	
	get high()
	{
		return this.element.high;
	}
	
	set high(_high)
	{
		this.element.high = _high;
	}
	
	get low()
	{
		return this.element.low;
	}
	
	set low(_low)
	{
		this.element.low = _low;
	}
	
	get max()
	{
		return this.element.max;
	}
	
	set max(_max)
	{
		this.element.max = _max;
	}
	
	get min()
	{
		return this.element.min;
	}
	
	set min(_min)
	{
		this.element.min = _min;
	}
	
	get optimum()
	{
		return this.element.optimum;
	}
	
	set optimum(_optimum)
	{
		this.element.optimum = _optimum;
	}
}

class tkReviewMeter extends tkMeter
{
	constructor(_rating)
	{
		super();
		
		this.value = _rating;
		this.max = 5;
		this.min = 0;
		this.optimum = 5;
		this.low = 2;
		this.high = 4;
	}
}

class tkNotebookPage
{
	constructor(_title,_id)
	{
		// A <li> that holds the tab button
		this.tabContainer = make("li");
		this.tabContainer.className = "nav-item";
		
		// A <a> that makes up the tab button
		this.tab = make("a");
		this.tab.className = "nav-link";
		this.tab.setAttribute("data-toggle","tab");
		this.tab.role = "tab";
		this.tabContainer.appendChild(this.tab);
		this.tab.setAttribute("href","#"+_id);
		
		// Text node to hold title text
		this.titleTextNode = document.createTextNode(_title);
		this.tab.appendChild(this.titleTextNode);
		
		/*	A <div> that contains the content that
			is brought up when the tab is clicked	*/
		this.contentArea = make("div");
		this.contentArea.id = _id;
		this.contentArea.role = "tabpanel";
		this.contentArea.className = "tab-pane fade";
	}
	
	get title()
	{
		return this.titleTextNode.nodeValue;
	}
	
	set title(_string)
	{
		this.titleTextNode.nodeValue = _string;
	}
	
	addContent(_content)
	{
		this.contentArea.appendChild(_content);
	}
	
	removeContent(_content)
	{
		this.contentArea.removeChild(_content);
	}
}

class tkNotebook extends tkWidget
{
	constructor() 
	{
		super();
		this.element = make("div"); 
		this.element.className = "tkNotebook";
		
		this.tabBar = make("ul");
		this.tabBar.className = "nav nav-tabs";
		this.tabBar.role = "tablist";
		this.element.appendChild(this.tabBar);
		
		this.contentPanel = make("div");
		this.contentPanel.className = "tab-content";
		this.element.appendChild(this.contentPanel);
		
		/*	Whether or not to wrap around when the
			end of index is reached*/
		this.wrap = true;

		/* Whether to jump to a newly added tab */
		this.newestTabActive = false;
		
		this.tabs = [];
		this.activeIndex = 0;
	}
	
	addPage(_page)
	{
		this.tabBar.appendChild(_page.tabContainer);
		this.contentPanel.appendChild(_page.contentArea);
		this.tabs.push(_page);
		
		if (this.newestTabActive)
			this.active = _page;
		else if (this.active == undefined)
			this.activeIndex = 0;
	}
	
	addPages()
	{
		for(var i=0;i<arguments.length;i++)
			this.addPage(arguments[i]);
	}
	
	removePage(_page)
	{
		this.tabBar.removeChild(_page.tabContainer);
		this.contentPanel.removeChild(_page.contentArea);
		this.tabs.splice(this.getIndex(_page),1);
		
		this.activeIndex = Math.max(0,activeIndex-1);
	}
	
	set active(_page)
	{
		if(!_page) return;
		// Make all tabs inactive
		for(var i=0;i<this.tabBar.childNodes.length;i++) {
			this.tabBar.childNodes[i].className = "nav-item";
			this.tabBar.childNodes[i].firstChild.className = "nav-link";
		}
		for(var i=0;i<this.contentPanel.childNodes.length;i++)
			this.contentPanel.childNodes[i].className = "tab-pane fade";
		
		_page.tabContainer.className = "nav-item active";
		_page.tab.className = "nav-link active show";
		_page.contentArea.className = "tab-pane fade show active";
	}
	
	get activeIndex()
	{
		for(var i=0;i<this.tabBar.childNodes.length;i++)
			if (this.tabBar.childNodes[i].firstChild.classList.contains("active"))
				return i;
	}
	
	set activeIndex(_index)
	{
		this.active = this.tabs[_index];
	}
	
	getActive()
	{
		return this.tabs[this.activeIndex];
	}
	
	getIndex(_page)
	{
		return this.tabs.indexOf(_page);
	}
		
	back()
	{
		if (this.activeIndex-1 < 0 && this.wrap)
			this.activeIndex = this.tabs.length-1;
		else
			this.activeIndex = Math.max(0, this.activeIndex-1);		
	}
	
	next()
	{
		if (this.activeIndex+1 >= this.tabs.length && this.wrap)
			this.activeIndex = 0;
		else
			this.activeIndex = Math.min(this.tabs.length-1, this.activeIndex+1);		
	}
}

class tkListItem extends tkText
{
	constructor()
	{
		super("li");
		this.element.className = "list-group-item";

		var item = this;
		this.clickEvent = item.toggleSelected;
		this.element.addEventListener('mouseup', function () {
			item.clickEvent();
		});
	}
	
	toggleSelected() 
	{
		this.selected = !(this.selected);
	}

	get selected()
	{
		return this.hasClass("active");
	}

	set selected(_selected)
	{
		if(_selected)
			this.addClass("active");
		else
			this.removeClass("active");
	}
}

class tkList extends tkWidget
{
	constructor()
	{
		super();
		this.element = make("ul");
		this.element.className = "list-group";

		this.items = [];
		this.allowMultipleSelection = false;
	}
	
	get allowMultipleSelection()
	{
		return this.allow_multiple_selection;
	}

	set allowMultipleSelection(_allow_multiple_selection)
	{
		if (!_allow_multiple_selection && this.selected.length > 1)
			this.selected = this.selected[0];
		this.allow_multiple_selection = _allow_multiple_selection;
	}
	
	selectFirstAvailable()
	{
		if(this.selectionExists && this.items.length > 0)
			this.selected = [this.items[0]];
	}
	
	addItem(_item)
	{
		this.element.appendChild(_item.element);
		this.items.push(_item);

		// select only this item & deselect all others when clicked if allowMultipleSelection is false
		var list = this;
		_item.element.addEventListener('mouseup', function () {
			if(!list.allowMultipleSelection) 
				list.selected = [_item];
		});
		
		this.selectFirstAvailable();
	}
	
	removeItem(_item)
	{
		this.items.splice(_item,1);
		this.element.removeChild(_item.element);
		
		this.selectFirstAvailable();
	}

	// returns array of selected items
	get selected()
	{
		var selectedItems = [];
		for(var i=0;i<this.items.length;i++)
			if (this.items[i].selected)
				selectedItems.push(this.items[i]);
		return selectedItems;
	}

	set selected(_selected)
	{
		this.deselectAll();
		
		for(var i=0;i<_selected.length;i++)
		 {
			 var currentItem = this.items.find((item) => item == _selected[i])
			 if (currentItem) 
			 {
				 currentItem.selected = true;
				 if (!this.allowMultipleSelection) break;
			 }
		 }
	}

	get selectionExists()
	{
		for(var i=0;i<this.items.length;i++)
			if (this.isSelected(this.items[i])) 
				return true;			
				
		return false;		
	}
	
	// return true if all items are selected
	isSelected(_items)
	{
		for(var i=0;i<_items.length;i++)
		{
		 if (this.items.indexOf(_items[i]) == -1) return false;


		 var currentItem = this.items.find((item) => item == _items[i])
		 if (!currentItem.selected) return false;
		}

		 return true;
	}

	deselectAll()
	{
		for(var i=0;i<this.items.length;i++)
			this.items[i].selected = false;
	}

	selectAll()
	{
		this.selected = this.items;
	}
}

class tkRibbon extends tkNotebook
{
	constructor()
	{
		super();
		this.tabBar.className = "nav nav-tabs ribbon ribbon-tabs";
		this.contentPanel.className = "ribbon-content";
	}
}

class tkRibbonPage
{
	constructor(_title,_id)
	{
		// A <li> that holds the tab button
		this.tabContainer = make("li");
		
		// A <a> that makes up the tab button
		this.tab = make("a");
		this.tab.setAttribute("data-toggle","tab");
		this.tabContainer.appendChild(this.tab);
		this.tab.setAttribute("href","#"+_id);
		
		// Text node to hold title text
		this.titleTextNode = document.createTextNode(_title);
		this.tab.appendChild(this.titleTextNode);
		
		/*	A <div> that contains the content that
			is brought up when the tab is clicked	*/
		this.contentArea = make("div");
		this.contentArea.id = _id;
		this.contentArea.className = "tab-pane fade";
	}
	
	get title()
	{
		return this.titleTextNode.nodeValue;
	}
	
	set title(_string)
	{
		this.titleTextNode.nodeValue = _string;
	}
	
	addContent(_content)
	{
		this.contentArea.appendChild(_content);
	}
	
	removeContent(_content)
	{
		this.contentArea.removeChild(_content);
	}
}

class tkRibbonGroup extends tkWidget
{
	constructor()
	{
		super();
		this.element = make("div");
		this.className = "tkRibbonGroup";

		this.contentArea = make("div");
		this.contentArea.className = "fill";
		this.contentArea.style.display = "inline-flex";
		this.element.appendChild(this.contentArea);

		this.groupTitle = make("span");
		this.groupTitle.className = "tkRibbonGroupTitle";
		this.element.appendChild(this.groupTitle);

		this.groupTitleTextNode = document.createTextNode("");
		this.groupTitle.appendChild(this.groupTitleTextNode);
	}

	get title()
	{
		return this.groupTitleTextNode.nodeValue;
	}
	
	set title(_string)
	{
		this.groupTitleTextNode.nodeValue = _string;
	}

	addButton(_button)
	{
		_button.className = "tkRibbonButton";
		this.contentArea.appendChild(_button);
	}

	removeButton(_button)
	{
		this.contentArea.removeChild(_button);
	}
}

class tkSlideshow extends tkNotebook
{
	constructor()
	{
		super();
		this.element.className = this.element.className + " tkSlide";
	}
}

class tkSlider extends tkWidget
{
	constructor()
	{
		super();

		this.element = make("input");
		this.className = "tkSlider";
		this.setAttribute("type","range");
	}
	
	get min()
	{
		return this.e.min;
	}
	
	set min(_min)
	{		
		this.e.min = _min;
	}
	
	get max() 
	{
		return this.e.max;
	}
	
	set max(_max)
	{
		this.e.max = _max;
	}
	
	get value()
	{
		return this.e.value;
	}
	
	set value(_value)
	{
		this.e.value = _value;	
	}
	
	get step()
	{
		return this.e.step;
	}
	
	set step(_step)
	{
		this.e.step = _step;		
	}
	
	get valueAsNumber()
	{
		return this.e.valueAsNumber;
	}
}

class tkTextEdit extends tkText
{
	constructor()
	{
		super("textarea");
		this.className = "tkTextEdit";

		var textEdit = this;
		this.element.addEventListener('mouseup', function () {
			textEdit.selected_text = this.value.substring(this.selectionStart, this.selectionEnd)
		});
	}

	// Characters, not pixels
	get width()
	{
		return this.getAttribute("cols");
	}
	
	set width(_width)
	{
		this.setAttribute("cols",_width);
	}
		
	get height()
	{
		return this.getAttribute("rows");
	}

	set height(_height)
	{
		this.setAttribute("rows",_height);
	}
	
	setSize(_width,_height) 
	{
		this.width = _width;
		this.height = _height;
	}

	get resizable()
	{
		return !this.hasClass("noResize");
	}

	set resizable(_resizable)
	{
		if (_resizable)
			this.removeClass("noResize")
		else
			this.addClass("noResize")
	}

	get autofocus()
	{
		return this.hasAttribute("autofocus");
	}

	set autofocus(_autofocus)
	{
		if (this.autofocus == true)
			this.removeAttribute("autofocus");
		
		if (_autofocus)
		{
			var attr = document.createAttribute("autofocus"); 
			this.setAttributeNode(attr);
		}
	}

	get disabled()
	{
		return this.hasAttribute("disabled");
	}

	set disabled(_disabled)
	{
		if (this.disabled == true)
			this.removeAttribute("disabled");
		
		if (_disabled)
		{
			var attr = document.createAttribute("disabled"); 
			this.setAttributeNode(attr);
		}
	}

	get maxLength()
	{
		return this.getAttribute("maxLength");
	}

	set maxLength(_max_length)
	{
		this.setAttribute("maxLength",_max_length);
	}

	get placeholder()
	{
		return this.getAttribute("placeholder");
	}

	set placeholder(_text)
	{
		this.setAttribute("placeholder",_text);
	}

	get readOnly()
	{
		return this.hasAttribute("readonly");
	}

	set readOnly(_read_only)
	{
		if (this.readOnly == true)
			this.removeAttribute("readonly");
		
		if (_read_only)
		{
			var attr = document.createAttribute("readonly"); 
			this.setAttributeNode(attr);
		}
		this.setAttribute("readonly",_read_only);
	}

	getSelectedText()
	{
		return this.selected_text;
	}
	
	get text() 
	{
		return this.e.value;
	}
	
	set text(_string) 
	{
		this.e.value = _string;
	}
}

// Forms
class tkInput extends tkWidget
{
	constructor()
	{
		super();
		this.element = make("input"); 
	}

	get type()
	{
		this.getAttribute("type");
	}

	set type(_type)
	{
		this.setAttribute("type",_type);
	}

	get name()
	{
		this.getAttribute("name");
	}

	set name(_name)
	{
		this.setAttribute("name",_name);
	}
	
	get readOnly()
	{
		return this.e.readonly;
	}
	
	set readOnly(_read_only)
	{
		this.e.readonly = _read_only;
	}
}

class tkTextInput extends tkInput
{
	constructor()
	{
		super();
		this.type = "text";
		this.className = "tkTextInput";
	}
	
	get text()
	{
		return this.e.value;
	}
	
	set text(_text)
	{
		this.e.value = _text;
	}
			
	get defaultText()
	{
		return this.e.defaultValue;
	}
	
	set defaultText(_default_value)
	{
		this.e.defaultValue = _default_value;
	}
	
	get placeholder()
	{
		return this.e.placeholder;
	}
	
	set placeholder(_placeholder)
	{
		this.e.placeholder = _placeholder;
	}
	
	get maxLength()
	{
		return this.e.maxLength;
	}
	
	set maxLength(_max_length)
	{
		this.e.maxLength = _read_only;
	}
}

class tkRange extends tkInput 
{
	constructor()
	{
		super();
		this.type = "range";
	}
}