var tkVideoIcon = "";
function make(_tag)
{
	return document.createElement(_tag);
}

function findInReg(_reg,_id) {
	for(var i=0;i<_reg.length;i++) 
		if (_id == _reg[i].id) 
			return _reg[i];
}

class tkControl 
{
	constructor() 
	{
		this.element = make("div");
		this.element.id = "";
		this.extraWidth = 0;
		this.extraHeight = 0;
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
		if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) 
 			return true;
		return false;
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

	get width()
	{
		return this.getAttribute("width");
	}
	
	set width(_width)
	{
		this.setAttribute("width",_width);
		this.element.style.width = _width + this.extraWidth + "px";
	}
		
	get height()
	{
		return this.getAttribute("height");
	}

	set height(_height)
	{
		this.setAttribute("height",_height);
		this.element.style.height = _height + this.extraHeight + "px";
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

var videoFileIds = [];
var regVideoFiles = [];
function randomVideoFileId()
{
	var id = "video_file_" + random(0,100000000);
	while(videoFileIds.includes(id))
		id = "video_file_" + random(0,100000000);
	return id;
}

class tkVideoFile
{
	constructor(_source,_title,_thumb,_on_media_init)
	{
		regVideoFiles.push(this);
		this.source = _source;
		
		if(_title) 
			this.title  = _title
		else {
			var crumbs = source.split("/");
			this.title = crumbs[crumbs.length-1];
		}
		
		if (_thumb)
			this.thumb = _thumb;
		else 
			this.thumb = tkVideoIcon;
		
		this.onMediaInit = _on_media_init;
		this.id = randomVideoFileId();
		this.duration = 0;
		this.tempVideo = new tkNativeVideoPlayer();
		this.tempVideo.source = _source;
		this.tempVideo.id = this.id;
		this.tempVideo.addToElement(document.body);
		this.tempVideo.element.style.display = "none";
		
		this.tempVideo.element.addEventListener('loadedmetadata', function (e) {
			var mediaItem = findInReg(regVideoFiles,this.id);
			if (mediaItem) 
			{
				mediaItem.duration = this.duration;
				mediaItem.width = this.videoWidth;
				mediaItem.height = this.videoHeight;
				
				// Function to call when duration is set
				if(mediaItem.onMediaInit)
					mediaItem.onMediaInit();
				
				document.body.removeChild(this);
			}
		});
	}
	
	// functions should only be called within this.onMediaInit()
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
	
	getSource()
	{
		return this.source;
	}
	
	getTitle()
	{
		return this.title;
	}
	
	getThumb()
	{
		return this.thumb;
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
		
		if (resolution < thresh240p)
			return (_only_numbers) ? 144 : "144p";
		
		else if (resolution < thresh360p)
			return (_only_numbers) ? 240 : "240p";
		
		else if (resolution < thresh480p)
			return (_only_numbers) ? 360 : "360p";
		
		else if (resolution < thresh720p)
			return (_only_numbers) ? 480 : "480p";
		
		else if (resolution < thresh1080p)
			return (_only_numbers) ? 720 : "720p";
		
		else if (resolution < thresh1440p)
			return (_only_numbers) ? 1080 : "1080p";
		
		else if (resolution < thresh2160p)
			return (_only_numbers) ? 1440 : "1440p";
		
		else if (resolution < thresh4k)
			return (_only_numbers) ? 2160 : "2160p";
		
		else if (resolution < thresh8k)
			return (_only_numbers) ? 2160 : "4k";
		
		else
			return (_only_numbers) ? 4320 : "8k";	
		
	}
}
var videoIds = [];
var regVideo = [];
function randomVideoId()
{
	var id = "video_" + random(0,100000000);
	while(videoFileIds.includes(id))
		id = "video_" + random(0,100000000);
	return id;
}

var lastFocusedVideo;
var attachedGlobalVideoHandlers = false;

class tkVideoPlayer extends tkControl
{
	constructor()
	{
		super();
		this.element = make("div");
		this.id = randomVideoId();
		regVideo.push(this);

		this.oldWidth = 0;
		this.oldHeight = 0;

		this.element.className = "tkVideoPlayer";

		this.controlsPanel = make("div");
		this.controlsPanel.className = "tkVideoPlayerControls";
		this.extraHeight = 0;
		this.element.appendChild(this.controlsPanel);

	  	this.playPauseButton = make("a");
		this.playPauseButton.id = "play_pause_" + this.id;
		this.playPauseButton.className = "tkToolbarButton";
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

		this.fullscreenButton = make("a");
		this.fullscreenButton.id = "fullscreen_" + this.id;
		this.fullscreenButton.className = "tkToolbarButton";
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

		this.video = new tkNativeVideoPlayer();
		this.video.element.className = "tkVideoPlayerInternal";
		this.video.showControls = false;
		this.video.addToElement(this.element);

		// watch for fullscreen change
		var screen_change_events = "webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange";
		$(this.element).on(screen_change_events, function () {
			var control = findInReg(regVideo,this.id);
			if(!control.isFullscreen()) control.resetDimensions();
		});

		$(this.element).focus(function() {
			lastFocusedVideo = findInReg(regVideo,this.id);
		});

		var onKeyDown = function(e) {
			switch (e.keyCode) 
			{
				case 32: // space - toggle Play/Pause
					lastFocusedVideo.togglePlay();
					break;
				case 13: // enter - toggle Fullscreen
					lastFocusedVideo.toggleFullscreen();
					break;
			}
		};

		if (!attachedGlobalVideoHandlers) {
			window.addEventListener("keydown", onKeyDown, false);
			attachedGlobalVideoHandlers = true;
		}

		if (!lastFocusedVideo)
			lastFocusedVideo = this;
	}

	get lightsOut()
	{
		
	}
	
	set lightsOut(_lightsOut)
	{
		
	}
		
	// show controls
	
	get showControls()
	{
		
	}
	
	set showControls(_show)
	{
		
	}
	
	get showPlayPause()
	{
		
	}
	
	set showPlayPause(_show)
	{
		
	}
	
	get showTime()
	{
		
	}
	
	set showTime(_show)
	{
		
	}
	
	get showTrackBar()
	{
		
	}
	
	set showTrackBar(_show)
	{
		
	}
	
	get showVolume()
	{
		
	}
	
	set showVolume(_show)
	{
		
	}
	
	resetDimensions()
	{
		this.element.style.height = this.oldHeight;
		this.element.style.width = this.oldWidth;
	}

	toggleFullscreen()
	{
		super.toggleFullscreen();
		
		if(this.isFullscreen()) {
			this.oldHeight = this.element.style.height;
			this.oldWidth = this.element.style.width;

			this.element.className = "tkVideoPlayer fill";

			this.element.style.height = "100%";
			this.element.style.width = "100%";
		} else {
			this.element.className = "tkVideoPlayer";
			this.resetDimensions();
		}
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
			end of index is reached*/
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
			this.contentPanel.childNodes[i].className = "slide fade";
		
		_page.contentArea.className = "show slide fade in";

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

class tkListItem extends tkButton
{
	constructor()
	{
		super();
		this.e.className = "tkButton";
	}
	
	get checked()
	{
		
	}
	
	set checked(_checked)
	{
		
	}
}

class tkList extends tkControl 
{
	constructor() 
	{
		super();
		
		this.element = make("div");
		this.items = [];
		
		this.wrap = true;
	}
	
	addItem(_item)
	{
		this.element.appendChild(_item.element);
		this.items.push(_item);
		
		if (this.getIndex(_item) == this.activeIndex)
			this.active = _item;
	}
	
	addItems()
	{
		for(var i=0;i<arguments.length;i++)
			this.addItem(arguments[i]);
	}
	
	removeItem(_item)
	{
		this.element.removeChild(_item.element);
		this.items.splice(this.getIndex(_item),1);
		
		this.activeIndex = Math.max(0,activeIndex-1);
	}
	
	set active(_item)
	{
		if(!_item) return;
		for(var i=0;i<this.items.length;i++)
			if(_item==this.items[i])
				this.items[i].checked = true;

		this.activeIndex = this.getIndex(_item);
	}
	
	getActiveIndex()
	{
		for(var i=0;i<this.items.length;i++)
			if(_item.checked == true)
				return i;
	}
	
	getActive()
	{
		return this.items[this.getActiveIndex()];
	}
	
	getIndex(_item)
	{
		return this.items.indexOf(_item);
	}
	
	goToIndex(_index)
	{
		this.active = this.items[_index];
	}
	
	back()
	{
		if (this.getActiveIndex()-1 < 0 && this.wrap)
			this.goToIndex(this.items.length-1);
		else
			this.goToIndex(Math.max(0, this.getActiveIndex()-1));		
	}
	
	next()
	{
		if (this.getActiveIndex()+1 >= this.items.length && this.wrap)
			this.goToIndex(0);
		else
			this.goToIndex(Math.min(this.items.length-1, this.getActiveIndex()+1));		
	}
}