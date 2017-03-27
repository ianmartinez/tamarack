var id_list = new Array();
class tkControl 
{
	constructor(_id) 
	{
		if (id_list.indexOf(_id) != -1)
			throw "Error: ID already registered with another control";
		else 
		{
			this.element = document.createElement("div");
			this.element.id = _id;
		}
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
}

class tkElement extends tkControl 
{
	constructor(_element) 
	{
		super(_element.id);
		this.element = _element;
	}
}

function makeElement(_id) {
	return new tkElement(document.getElementById(_id));
}


class tkText extends tkControl 
{
	constructor(_id,_tag) 
	{
		super(_id);
		
		this.element = document.createElement(_tag);
		this.textNode = document.createTextNode("");
		this.element.appendChild(this.textNode);
	}

	get text() 
	{
		return this.textNode.nodeValue;
	}
	
	set text(_String) 
	{
		this.textNode.nodeValue = _String;
	}
}

class tkLink extends tkText
{
	constructor(_id)
	{
		super(_id, "a");
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
	constructor(_id) 
	{
		super(_id,"a");
		this.element.className = "tkButton";
	}
}

class tkDiv extends tkControl 
{
	constructor(_id) 
	{
		super(_id);
		this.element = document.createElement("div");
	}
}

class tkMediaPlayer extends tkControl 
{
	constructor(_id) 
	{
		super(_id);
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
	constructor(_id)
	{
		super(_id);
		this.element = document.createElement("video"); 
	}
}

class tkAudioPlayer extends tkMediaPlayer
{
	constructor(_id)
	{
		super(_id);
		this.element = document.createElement("audio"); 
	}
}

class tkImage extends tkControl
{
	constructor(_id)
	{
		super(_id);
		this.element = document.createElement("img"); 
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
	constructor(_id)
	{
		super(_id);
		this.element = document.createElement("progress"); 
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
	constructor(_id)
	{
		super(_id);
		this.element = document.createElement("meter"); 
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
	constructor(_id,_Rating)
	{
		super(_id);
		
		this.Value = _Rating;
		this.max = 5;
		this.min = 0;
		this.optimum = 5;
		this.low =2;
		this.high = 4;
	}
}