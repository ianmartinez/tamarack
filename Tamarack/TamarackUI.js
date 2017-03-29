function make(_tag)
{
	return document.createElement(_tag);
}

class tkControl 
{
	constructor() 
	{
		this.element = make("div");
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

	get innerHtml() {
		return this.element.innerHTML;
	}

	set innerHtml(_html) {
		this.element.innerHTML = _html;
	}

	getId() 
	{
		return this.element.id;
	}

	getElement() 
	{
		return this.element;
	}
	
	getClassList()
	{
		return this.element.classList;
	}

	addToElement(_destination) 
	{
		_destination.appendChild(this.getElement());
	}

	addTo(_destination) 
	{
		_destination.getElement().appendChild(this.getElement());
	}
	
	makeFullScreen()
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
	
	get width()
	{
		return this.element.getAttribute("width");
	}
	
	set width(_width)
	{
		this.element.setAttribute("width",_width);
	}
		
	get height()
	{
		return this.element.getAttribute("height");
	}

	set height(_height)
	{
		this.element.setAttribute("height",_height);
	}
	
	setDimensions(_width,_height) 
	{
		this.width = _width;
		this.height = _height;
	}
	
	clear()
	{
		while (this.element.firstChild) 
			this.element.removeChild(this.element.firstChild);
	}
}

class tkElement extends tkControl 
{
	constructor(_element) 
	{
		super(_element.id);
		this.element = _element;
	}
}

function makeElement() {
	return new tkElement(document.getElementById());
}


class tkText extends tkControl 
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
		return this.element.getAttribute("href");
	}

	set source(_source) 
	{
		this.element.setAttribute("href",_source);
	}
}

class tkButton extends tkText 
{
	constructor() 
	{
		super("button");
		this.element.className = "tkButton";
	}
}

class tkDiv extends tkControl 
{
	constructor() 
	{
		super();
		this.element = make("div");
	}
}

class tkMediaPlayer extends tkControl 
{
	constructor() 
	{
		super();
	}

	// Media source
	get source() 
	{
		return this.element.src;
	}

	set source(_source) 
	{
		this.element.src = _source;
	}
	
	// Controls
	hasControls()
	{
		return (this.element.hasAttribute("controls"));
	}
	
	setControls(_visibility)
	{
		if (this.hasControls() == true)
			this.element.removeAttribute("controls");
		
		if (_visibility == true)
		{
			var controls = document.createAttribute("controls"); 
			this.element.setAttributeNode(controls);
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
	
	get looping()
	{
		return this.element.loop;
	}
	
	set looping(_looping)
	{
		this.element.loop = _looping;
	}
	
	get muted()
	{
		return this.element.muted;
	}
	
	set muted(_muted)
	{
		this.element.muted = _muted;
	}
	
	get currentTime()
	{
		return this.element.currentTime;
	}
	
	set currentTime(_Time)
	{
		this.element.currentTime = _Time;
	}
	
	get duration()
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
		this.setControls(true);
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

class tkImage extends tkControl
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

class tkProgress extends tkControl
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

class tkMeter extends tkControl
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
		
		this.Value = _rating;
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

class tkSlide
{
	constructor()
	{
		/*	A <div> that contains the content that
		is brought up when the slide is shown	*/
		this.contentArea = make("div");
		this.contentArea.className = "slide fade";
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

class tkNotebook extends tkControl
{
	constructor() 
	{
		super();
		this.element = make("div"); 
		this.element.className = "container";
		
		this.tabBar = make("ul");
		this.tabBar.className = "nav nav-tabs";
		this.element.appendChild(this.tabBar);
		
		this.contentPanel = make("div");
		this.contentPanel.className = "tab-content";
		this.element.appendChild(this.contentPanel);
		this.activeIndex = 0;
		
		this.tabs = [];
	}
	
	addPage(_page)
	{
		this.tabBar.appendChild(_page.tabContainer);
		this.contentPanel.appendChild(_page.contentArea);
		this.tabs.push(_page);
		
		if (this.getIndex(_page) == this.activeIndex)
			this.active = _page;
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
		// Make all tabs inactive
		for(var i=0;i<this.tabBar.childNodes.length;i++)
			this.tabBar.childNodes[i].className = " ";
		for(var i=0;i<this.contentPanel.childNodes.length;i++)
			this.contentPanel.childNodes[i].className = "tab-pane fade";
		
		_page.tabContainer.className = "active";
		_page.contentArea.className = "tab-pane fade in active";

		this.activeIndex = this.getIndex(_page);
	}
	
	getIndex(_page)
	{
		return this.tabs.indexOf(_page);
	}
	
	goToIndex(_index)
	{
		this.active = this.tabs[_index];
	}
	
	back()
	{
		this.goToIndex(Math.max(0, this.activeIndex-1));		
	}
	
	next()
	{
		this.goToIndex(Math.min(this.tabs.length-1, this.activeIndex+1));		
	}
}

class tkSlideshow extends tkControl
{
	constructor()
	{
		super();
		this.element = make("div"); 
		this.element.className = "container";
		
		this.contentPanel = make("div");
		this.contentPanel.className = "tab-content";
		this.element.appendChild(this.contentPanel);
		this.activeIndex = 0;
		
		this.slides = [];
	}
	
	addPage(_page)
	{
		this.contentPanel.appendChild(_page.contentArea);
		this.slides.push(_page);
		
		if (this.getIndex(_page) == this.activeIndex)
			this.active = _page;
	}
	
	addPages()
	{
		for(var i=0;i<arguments.length;i++)
			this.addPage(arguments[i]);
	}
	
	removePage(_page)
	{
		this.contentPanel.removeChild(_page.contentArea);
		this.slides.splice(this.getIndex(_page),1);
		
		this.activeIndex = Math.max(0,activeIndex-1);
	}
	
	set active(_page)
	{
		// Make all pages inactive
		for(var i=0;i<this.contentPanel.childNodes.length;i++)
			this.contentPanel.childNodes[i].className = "slide fade";
		
		_page.contentArea.className = "show slide fade in";

		this.activeIndex = this.getIndex(_page);
	}
	
	getIndex(_page)
	{
		return this.slides.indexOf(_page);
	}
	
	goToIndex(_index)
	{
		this.active = this.slides[_index];
	}
	
	back()
	{
		this.goToIndex(Math.max(0, this.activeIndex-1));		
	}
	
	next()
	{
		this.goToIndex(Math.min(this.slides.length-1, this.activeIndex+1));		
	}
}