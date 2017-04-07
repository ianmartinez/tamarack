function getTamarackVersion() 
{
	return 0.3;
}

function isTamarackBeta()
{
	return true;
}

function random(min,max)
{
    min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomRGB()
{
	return "rgb(" + random(0,255) + "," + random(0,255) + "," + random(0,255) + ")";
}

function randomRGBA()
{
	return "rgba(" + random(0,255) + "," + random(0,255) + "," + random(0,255) + "," + Math.random() + ")";
}

function addParameters(_url,_args,_vals) {
	let url = _url + "?";
	let max = Math.min(_args.length,_vals.length);
	for(var i=0; i<max; i++) {
		url += _args[i] + "=" + _vals[i];
		if (i < max-1) url += "&";
	}

	return url;
}

function getParameterFromURL(_name, _url) 
{
	if (!url) 
	{
		_url = window.location.href;
	}
	_name = _name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + _name + "(=([^&#]*)|&|#|$)"),
		results = regex.exec(_url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function getParameter(_name) {
	return getParameterFromURL(_name,getUrl());
}
			
function getUrl()
{
	return window.location.href;
}

function say(_text)
{
	return document.createTextNode(_text);
}

class tkDocument 
{	
	constructor() 
	{
		this.output = document.body;
	}
		
	// Document
	get title()
	{
		return document.title;
	}


	set title(_title)
	{
		return document.title = _title;
	}

	put(_str)
	{
		var t = document.createTextNode(_str);
		this.output.appendChild(t);
		
		return t;
	}

	putLine(_string)
	{
		if (_string == "undefined" || _string == null)
			_string = "";
		
		var t = document.createTextNode(_string);
		var p = document.createElement("p"); 
		p.appendChild(t);
		this.output.appendChild(p);
			
		return p;
	}

	putLines(_strings)
	{
		for (let str of _strings)
			this.putLine(str);
	}

	putHeader(_string, _header)
	{
		if(["h1","h2","h3","h4","h5","h6"].indexOf(_header.toLowerCase()) != -1)
		{
			var h = document.createElement(_header);
			var t = document.createTextNode(_string);
			h.appendChild(t);
			this.output.appendChild(h);
			
			return h;
		}
	}

	setBackground(_background)
	{
		document.body.style.backgroundColor = _background;
	}

	setBackgroundColor(_background)
	{
		document.body.style.background = _background;
	}

	setBackgroundGradient(_angle_deg,_start,_end)
	{
		document.body.style.background = "linear-gradient(" + _angle_deg + "deg," + _start  + "," + _end + ") fixed";
	}

	setBackgroundImage(_background)
	{
		document.body.style.backgroundImage = _background;
	}

	setBackgroundImageCover(_image)
	{
		document.body.style.background = "url(" + _image + ") no-repeat center center fixed";
	}

	clearBackground()
	{
		document.body.style.background = null;
	}
}

// enums
var tkDialogResult = {
  NOTHING: 0,
  OK: 1,
  CANCEL: 2,
  ABORT: 3,
  IGNORE: 4,
  YES: 5,
  NO: 6,
  RETRY: 7
};

var tkColorMode = {
  RGB: 0,
  RGBA: 1,
  HSL: 2,
  HSLA: 3
};

// global functions
function make(_tag)
{
	return document.createElement(_tag);
}

function findInReg(_reg,_id) {
	for(var i=0;i<_reg.length;i++) 
		if (_id == _reg[i].id) 
			return _reg[i];
	return null;
}

function isFullscreenRunning()
{
	if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) 
 			return true;
		return false;
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
	
	removeFromElement(_destination) 
	{
		_destination.removeChild(this.getElement());
	}

	removeFrom(_destination) 
	{
		_destination.getElement().removeChild(this.getElement());
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

	exitFullscreen()
	{
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if (document.msExitFullscreen) {
			document.msExitFullscreen();
		}
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
		$(this.element).slideToggle(200);
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

function makeElement(_elem) {
	return new tkElement(_elem);
}

function makeElementId(_id) {
	return new tkElement(document.getElementById(_id));
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
		return this.getAttribute("href");
	}

	set source(_source) 
	{
		this.setAttribute("href",_source);
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

class tkNativeVideoPlayer extends tkMediaPlayer
{
	constructor()
	{
		super();
		this.element = make("video"); 
		this.showControls = true;
	}	
}

class tkVideoInfo
{
	constructor(_source,_resolution,_duration,_title)
	{
		this.source = _source;
		this.resolution = _resolution;
		this.duration = _duration;
		this.title = (_title) ? _title : _source;
	}

	getFormattedDuration()
	{
		var durationSeconds = this.duration.toFixed(0);
		var hours   = Math.floor(durationSeconds / 3600);
		var minutes = Math.floor((durationSeconds - (hours * 3600)) / 60);
		var seconds = durationSeconds - (hours * 3600) - (minutes * 60);

		if (hours   < 10) {hours   = "0" + hours;}
		if (minutes < 10) {minutes = "0" + minutes;}
		if (seconds < 10) {seconds = "0" + seconds;}
		
		var hoursString = (hours != "00") ? hours + ':' : "";
		return hoursString + minutes + ':' + seconds;
	}
}

// must be called in the tkVideo.load event has fired
function extractVideoInfo(_video,_title)
 {
	return new tkVideoInfo(_video.src, new tkResolution(_video.videoWidth, _video.videoHeight), _video.duration, _title);
}

class tkResolution
{
	constructor(_width,_height)
	{
		this.width = _width;
		this.height = _height;
	}
	
	getWidth()
	{
		return this.width;
	}
	
	getHeight()
	{
		return this.height;
	}
	
	getResolution()
	{
		return this.getWidth() + "x" + this.getHeight();
	}
	
	getResolutionBracket(_only_numbers)
	{
		var thresh144p = 256 * 144; // 36,864
		var thresh240p = 426 * 240; // 102,240 
		var thresh360p = 640 * 360; // 230,400
		var thresh480p = 854 * 480; // 409,920
		var thresh720p = 1280 * 720; // 921,600
		var thresh1080p = 1920 * 1080; // 2,073,600
		var thresh1440p = 2560 * 1440; // 3,686,400
		var thresh2160p = 3840 * 2160; // 8,294,400
		var thresh4k = 4096 * 2160; // 8,847,360
		var thresh8k = 7680 * 4320; // 33,177,600
		
		var resolution = this.getWidth() * this.getHeight();
		
		if (resolution < thresh240p-(thresh240p*0.1))
			return (_only_numbers) ? 144 : "144p";
		
		else if (resolution < thresh360p-(thresh360p*0.1))
			return (_only_numbers) ? 240 : "240p";
		
		else if (resolution < thresh480p-(thresh480p*0.1))
			return (_only_numbers) ? 360 : "360p";
		
		else if (resolution < thresh720p-(thresh720p*0.1))
			return (_only_numbers) ? 480 : "480p";
		
		else if (resolution < thresh1080p-(thresh1080p*0.1))
			return (_only_numbers) ? 720 : "720p";
		
		else if (resolution < thresh1440p-(thresh1440p*0.1))
			return (_only_numbers) ? 1080 : "1080p";
		
		else if (resolution < thresh2160p-(thresh2160p*0.1))
			return (_only_numbers) ? 1440 : "1440p";
		
		else if (resolution < thresh4k-(thresh4k*0.1))
			return (_only_numbers) ? 2160 : "2160p";
		
		else if (resolution < thresh8k-(thresh8k*0.1))
			return (_only_numbers) ? 2160 : "4k";
		
		else
			return (_only_numbers) ? 4320 : "8k";
	}
}

var videoIds = [];
var regVideo = [];
var tkLightsOutDiv;
function randomVideoId()
{
	var id = "video_" + random(0,100000000);
	while(videoIds.includes(id))
		id = "video_" + random(0,100000000);
	return id;
}

class tkVideoPlayer extends tkControl
{
	constructor()
	{
		super();
		this.element = make("div");
		this.id = randomVideoId();
		this.element.className = "tkVideoPlayer";
		regVideo.push(this);

		this.innerPanel = make("div");
		this.innerPanel.className = "tkVideoInnerPanel";
		this.element.appendChild(this.innerPanel);

		this.controlsPanel = make("div");
		this.controlsPanel.id = "controls_" + this.id;
		this.controlsPanel.className = "tkVideoPlayerControls";
		this.innerPanel.appendChild(this.controlsPanel);

	  	this.playPauseButton = make("button");
		this.playPauseButton.id = "play_pause_" + this.id;
		this.playPauseButton.className = "tkVideoButton";
		this.playPauseButton.setAttribute("role","button");
		this.controlsPanel.appendChild(this.playPauseButton);
	  	this.playPauseButtonIcon = make("img");
		this.playPauseButtonIcon.className = "tkToolbarIconSmall";
		this.pauseIconFile = "../icons/actions_dark/22/media-playback-pause.svg";
		this.playIconFile = "../icons/actions_dark/22/media-playback-start.svg";
		this.playPauseButtonIcon.src = this.playIconFile;
		this.playPauseButton.appendChild(this.playPauseButtonIcon);
		this.playPauseButton.onclick = function() {
			findInReg(regVideo,this.id.replace("play_pause_","")).togglePlay();
		};

		this.fullscreenButton = make("button");
		this.fullscreenButton.id = "fullscreen_" + this.id;
		this.fullscreenButton.className = "tkVideoButton";
		this.fullscreenButton.setAttribute("role","button");
		this.controlsPanel.appendChild(this.fullscreenButton);
	  	this.fullscreenButtonIcon = make("img");
		this.fullscreenButtonIcon.className = "tkToolbarIconSmall";
		this.fullscreenIconFile = "../icons/actions_dark/22/zoom-fullscreen.svg";
		this.fullscreenButtonIcon.src = this.fullscreenIconFile;
		this.fullscreenButton.style.float = "right";
		this.fullscreenButton.appendChild(this.fullscreenButtonIcon);
		this.fullscreenButton.onclick = function() {
			findInReg(regVideo,this.id.replace("fullscreen_","")).toggleFullscreen();
		};

		this.lightsOutButton = make("button");
		this.lightsOutButton.id = "lightsOut_" + this.id;
		this.lightsOutButton.className = "tkVideoButton";
		this.lightsOutButton.setAttribute("role","button");
		this.controlsPanel.appendChild(this.lightsOutButton);
	  	this.lightsOutButtonIcon = make("img");
		this.lightsOutButtonIcon.className = "tkToolbarIconSmall";
		this.lightsOutIconFile = "../icons/actions_dark/22/games-hint.svg";
		this.lightsOutButtonIcon.src = this.lightsOutIconFile;
		this.lightsOutButton.style.float = "right";
		this.lightsOutButton.appendChild(this.lightsOutButtonIcon);
		this.lightsOutButton.onclick = function() {
			findInReg(regVideo,this.id.replace("lightsOut_","")).toggleLightsOut();
		};

		this.video = new tkNativeVideoPlayer();
		this.video.element.className = "tkVideoPlayer shadow";
		this.video.showControls = false;
		this.video.id =  "video_element_" + this.id;
		this.video.addToElement(this.innerPanel);
		this.video.loop = true;
		
		this.video.element.addEventListener ("dblclick", function(e) {
			findInReg(regVideo,this.id.replace("video_element_","")).togglePlay();
		}, false);

		this.element.onmouseenter = function() {
			findInReg(regVideo,this.id).showControls = true;
		};

		this.element.onmouseleave = function() {
			findInReg(regVideo,this.id).showControls = false;
		};
		
		if (!tkLightsOutDiv) 
		{
			tkLightsOutDiv = make("div");
			tkLightsOutDiv.className = "tkLightsOutDiv";
			tkLightsOutDiv.id = "lights_out_" + this.id;
			tkLightsOutDiv.style.display = "none";
			tkLightsOutDiv.style.zIndex = 99999;

			tkLightsOutDiv.addEventListener ("click", function(e) {
				findInReg(regVideo,this.id.replace("lights_out_","")).lightsOut = false;
			}, false);

			document.body.appendChild(tkLightsOutDiv);
		}

		var screen_change_events = "webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange";
		var vid = this;
		$(document).on(screen_change_events, function () {
			vid.showLightsOut = (!vid.isFullscreen());
		});
	}

	set loaded(_on_load) 
	{
		var vid = document.getElementById(this.video.id);
		$(document).ready(function() {
			$(vid).on('loadedmetadata', function() {
				_on_load();
			});
		});
	}

	get lightsOut()
	{
		return (tkLightsOutDiv.style.display != "none");
	}
	
	set lightsOut(_lightsOut)
	{
		if (_lightsOut) {
			this.oldZIndex = this.element.style.zIndex;
			this.element.style.zIndex = tkLightsOutDiv.style.zIndex + 1;
			$(tkLightsOutDiv).fadeIn();
		} else {
			this.element.style.zIndex = this.oldZIndex;
			$(tkLightsOutDiv).fadeOut();
		}
	}

	toggleLightsOut()
	{
		if (this.lightsOut)
			this.lightsOut = false;
		else
			this.lightsOut = true;
	}
	
	get showControls()
	{
		return (this.controlsPanel.style.display != "none");
	}
	
	set showControls(_show)
	{
		if (_show)
			$(this.controlsPanel).fadeIn();
		else
			$(this.controlsPanel).fadeOut();
	}
	
	get showLightsOut()
	{
		return (this.lightsOutButton.style.display != "none");
	}
	
	set showLightsOut(_show)
	{
		if (_show)
			this.lightsOutButton.style.display = "inline-block";
		else
			this.lightsOutButton.style.display = "none";
	}

	isFullscreen()
	{
		return (document.fullscreenElement == this.innerPanel 
				|| document.mozFullScreenElement == this.innerPanel 
				|| document.webkitFullscreenElement == this.innerPanel 
				|| document.msFullscreenElement == this.innerPanel);
	}

	makeFullscreen()
	{
		var innerPanel = new tkElement(this.innerPanel);
		innerPanel.makeFullscreen();
		this.showLightsOut = false;
	}

	exitFullscreen()
	{
		var innerPanel = new tkElement(this.innerPanel);
		innerPanel.exitFullscreen();
		this.showLightsOut = true;
	}

	toggleFullscreen()
	{
		var innerPanel = new tkElement(this.innerPanel);

		if (this.isFullscreen())
			this.exitFullscreen();
		else
			this.makeFullscreen();	

		this.showLightsOut = (!isFullscreenRunning());
	}

	// direct calls to video control
	get source()
	{
		return this.video.source;
	}

	set source(_source) 
	{
		this.video.source = _source;
	}
	
	get autoplay()
	{
		return this.video.autoplay;
	}
	
	set autoplay(_enabled)
	{
		this.video.autoplay = _enabled;
	}
	
	isPaused()
	{
		return this.video.isPaused();
	}
	
	play()
	{
		this.video.play();
		this.playPauseButtonIcon.src = this.pauseIconFile;
	}
	
	pause()
	{
		this.video.pause();
		this.playPauseButtonIcon.src = this.playIconFile;
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
		return this.video.loop;
	}
	
	set loop(_loop)
	{
		this.video.loop = _loop;
	}
	
	get mute()
	{
		return this.video.mute;
	}
	
	set mute(_mute)
	{
		this.video.mute = _mute;
	}
	
	get currentTime()
	{
		return this.video.currentTime;
	}
	
	set currentTime(_time)
	{
		this.video.currentTime = _time;
	}
	
	getDuration()
	{
		return this.video.getDuration();
	}
	
	get playbackRate()
	{
		return this.video.playbackRate;
	}
	
	set playbackRate(_rate)
	{
		this.video.playbackRate = _rate;
	}
	
	getNetworkState()
	{
		return this.video.getNetworkState();
	}
	
	getReadyState()
	{
		return this.video.getReadyState();
	}
	
	getSeekable()
	{
		return this.video.getSeekable();
	}
	
	isSeeking()
	{
		return this.video.isSeeking();
	}
	
	get textTracks()
	{
		return this.video.textTracks;
	}
	
	set textTracks(_tracks)
	{
		this.video.textTracks = _Tracks;
	}
	
	get volume()
	{
		return this.video.volume;
	}
	
	set volume(_volume)
	{
		this.video.volume = _volume;
	}
	
	canPlay(_type)
	{
		return this.video.canPlay(_type);
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
		
		/*	Whether or not to wrap around when the
			end of index is reached*/
		this.wrap = true;
		
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
		if(!_page) return;
		// Make all tabs inactive
		for(var i=0;i<this.tabBar.childNodes.length;i++)
			this.tabBar.childNodes[i].className = " ";
		for(var i=0;i<this.contentPanel.childNodes.length;i++)
			this.contentPanel.childNodes[i].className = "tab-pane fade";
		
		_page.tabContainer.className = "active";
		_page.contentArea.className = "tab-pane fade in active";

		this.activeIndex = this.getIndex(_page);
	}
	
	getActiveIndex()
	{
		for(var i=0;i<this.tabBar.childNodes.length;i++)
			if (this.tabBar.childNodes[i].classList.contains("active"))
				return i;
	}
	
	getActive()
	{
		return this.tabs[this.getActiveIndex()];
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
		if (this.getActiveIndex()-1 < 0 && this.wrap)
			this.goToIndex(this.tabs.length-1);
		else
			this.goToIndex(Math.max(0, this.getActiveIndex()-1));		
	}
	
	next()
	{
		if (this.getActiveIndex()+1 >= this.tabs.length && this.wrap)
			this.goToIndex(0);
		else
			this.goToIndex(Math.min(this.tabs.length-1, this.getActiveIndex()+1));		
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
		
		/*	Whether or not to wrap around when the
			end of index is reached */
		this.wrap = true;
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
		if(!_page) return;
		// Make all pages inactive
		for(var i=0;i<this.contentPanel.childNodes.length;i++) 
			this.contentPanel.childNodes[i].className = "slide";
		
		_page.contentArea.className = "show slide";

		this.activeIndex = this.getIndex(_page);
	}
	
	getActiveIndex()
	{
		for(var i=0;i<this.contentPanel.childNodes.length;i++)
			if (this.contentPanel.childNodes[i].classList.contains("show"))
				return i;
	}
	
	getActive()
	{
		return this.slides[this.getActiveIndex()];
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
		if (this.getActiveIndex()-1 < 0 && this.wrap)
			this.goToIndex(this.slides.length-1);
		else
			this.goToIndex(Math.max(0, this.getActiveIndex()-1));		
	}
	
	next()
	{
		if (this.getActiveIndex()+1 >= this.slides.length && this.wrap)
			this.goToIndex(0);
		else
			this.goToIndex(Math.min(this.slides.length-1, this.getActiveIndex()+1));		
	}
}

var tkDialogLightsOutDiv;
class tkDialog extends tkControl
{
	constructor()
	{
		super();
		this.element = make("div"); 
		this.element.className = "tkDialog shadow";
		
		this.contentArea = make("div");
		this.contentArea.className = "tkDialogContentArea";
		this.element.appendChild(this.contentArea);

		this.buttonArea = make("div");
		this.buttonArea.className = "tkDialogButtonArea";
		this.element.appendChild(this.buttonArea);
		
		/* 	An array of tkDialogResult listing 
			the buttons that are shown */
		this.choices = [tkDialogResult.OK];
		this.choicesButtons = [];

		if (!tkDialogLightsOutDiv) 
		{
			var dialog = this;
			tkDialogLightsOutDiv = make("div");
			tkDialogLightsOutDiv.className = "tkLightsOutDiv";
			tkDialogLightsOutDiv.id = "dialog_lights_out";
			tkDialogLightsOutDiv.style.display = "none";
			tkDialogLightsOutDiv.style.zIndex = 99999;

			document.body.appendChild(tkDialogLightsOutDiv);
		}

		this.element.style.zIndex = tkDialogLightsOutDiv.style.zIndex + 1;
		this.isOpen = false;
	}
	
	addContent(_content)
	{
		this.contentArea.appendChild(_content);
	}
	
	removeContent(_content)
	{
		this.contentArea.removeChild(_content);
	}

	/*	Returns a tkDialogResult that 
		corresponds to the button clicked */
	show(_on_dialog_result)
	{
		this.isOpen = true;
		$(tkDialogLightsOutDiv).fadeIn();
		this.element.style.display = "none";
		this.addToElement(document.body);
		this.slide();

		if(!_on_dialog_result) _on_dialog_result = function() {};
		
		// Make sure to clear buttons from previous opening
		var buttonArea = makeElement(this.buttonArea);
		buttonArea.clear();
		
		var dialog = this;

		tkDialogLightsOutDiv.onclick = function() {
			dialog.close();
			_on_dialog_result(tkDialogResult.NOTHING);
		};

		this.choicesButtons = [];
		for(var i=0;i<this.choices.length;i++) 
		{
			var button = new tkButton();
			var result = tkDialogResult.NOTHING;

			switch (this.choices[i]) 
			{
				case tkDialogResult.NOTHING:
					continue;
					break;
				case tkDialogResult.OK:
					button.text = "OK";
					button.element.onclick = function() {
						result = tkDialogResult.OK;
						_on_dialog_result(result);
						dialog.close();
					};
					break;
				case tkDialogResult.CANCEL:
					button.text = "Cancel";
					button.element.className = "tkRedButton";
					button.element.onclick = function() {
						result = tkDialogResult.CANCEL;
						_on_dialog_result(result);
						dialog.close();
					};
					break;
				case tkDialogResult.ABORT:
					button.text = "Abort";
					button.element.className = "tkRedButton";
					button.element.onclick = function() {
						result = tkDialogResult.ABORT;
						_on_dialog_result(result);
						dialog.close();
					};
					break;
				case tkDialogResult.IGNORE:
					button.text = "Ignore";
					button.element.className = "tkRedButton";
					button.element.onclick = function() {
						result = tkDialogResult.IGNORE;
						_on_dialog_result(result);
						dialog.close();
					};
					break;
				case tkDialogResult.YES:
					button.text = "Yes";
					button.element.onclick = function() {
						result = tkDialogResult.YES;
						_on_dialog_result(result);
						dialog.close();
					};
					break;
				case tkDialogResult.NO:
					button.text = "No";
					button.element.className = "tkRedButton";
					button.element.onclick = function() {
						result = tkDialogResult.NO;
						_on_dialog_result(result);
						dialog.close();
					};
					break;
				case tkDialogResult.RETRY:
					button.text = "Retry";
					button.element.onclick = function() {
						result = tkDialogResult.RETRY;
						_on_dialog_result(result);
						dialog.close();
					};
					break;
			}

			this.buttonArea.appendChild(button.element);
			this.choicesButtons.push(button);
		}

		document.onkeyup = function(e) {
			if (e.keyCode == 27) { // esc
				if(tkDialogLightsOutDiv.style.display != "none")
					dialog.close();
			}
		};
	}

	close()
	{
		this.isOpen = false;
		$(tkDialogLightsOutDiv).fadeOut();
		this.removeFromElement(document.body);
		this.slide();
	}
}

class tkColorDialog extends tkDialog
{
	constructor()
	{
		super();

		this.choices = [tkDialogResult.OK,tkDialogResult.CANCEL];

		this.palette = [];
		this.showPalette = true;
		this.customPalette = [];
		this.showCustomPalette = false;

		this.color = "black";
		this.colorMode = tkColorMode.HSLA;
	}
}