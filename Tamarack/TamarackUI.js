var IdList = new Array();

class tkControl 
{
	constructor(_Id) 
	{
		if (IdList.indexOf(_Id) != -1)
			throw "Error: ID already registered with another control";
		else 
		{
			this.Element = document.createElement("div");
			this.Element.id = _Id;
		}
	}

	get InnerHtml() {
		return this.Element.innerHTML;
	}

	set InnerHtml(_html) {
		this.Element.innerHTML = _html;
	}

	GetId() 
	{
		return this.Element.id;
	}

	GetElement() 
	{
		return this.Element;
	}
	
	GetClassList()
	{
		return this.Element.classList;
	}

	AddElementTo(_Destination) 
	{
		_Destination.appendChild(this.GetElement());
	}

	AddTo(_Destination) 
	{
		_Destination.GetElement().appendChild(this.GetElement());
	}
	
	RequestFullscreen()
	{
		if (this.Element.requestFullscreen)
			this.Element.requestFullscreen();
		else if (this.Element.msRequestFullscreen) 
		  this.Element.msRequestFullscreen();
		else if (this.Element.mozRequestFullScreen) 
		  this.Element.mozRequestFullScreen();
		else if (this.Element.webkitRequestFullscreen) 
		  this.Element.webkitRequestFullscreen();
	}	
	
	get Width()
	{
		return this.Element.getAttribute("width");
	}
	
	set Width(_Width)
	{
		this.Element.setAttribute("width",_Width);
	}
	
	
	get Height()
	{
		return this.Element.getAttribute("height");
	}

	
	set Height(_Height)
	{
		this.Element.setAttribute("height",_Height);
	}
}

class tkElement extends tkControl 
{
	constructor(_Element) 
	{
		super(_Element.id);
		this.Element = _Element;
	}
}

function MakeElement(_id) {
	return new tkElement(document.getElementById(_id));
}


class tkText extends tkControl 
{
	constructor(_Id,_Tag) 
	{
		super(_Id);
		
		this.Element = document.createElement(_Tag);
		this.TextNode = document.createTextNode("");
		this.Element.appendChild(this.TextNode);
	}

	get Text() 
	{
		return this.TextNode.nodeValue;
	}
	
	set Text(_String) 
	{
		this.TextNode.nodeValue = _String;
	}
}

class tkLink extends tkText
{
	constructor(_Id)
	{
		super(_Id, "a");
	}
		
	// Link source
	get Source() 
	{
		return this.Element.getAttribute("href");
	}

	set Source(_Source) 
	{
		this.Element.setAttribute("href",_Source);
	}
}

class tkButton extends tkText 
{
	constructor(_Id) 
	{
		super(_Id,"button");
	}
}

class tkDiv extends tkControl 
{
	constructor(_Id) 
	{
		super(_Id);
		
		this.Element = document.createElement("div");
	}
}

class tkMediaPlayer extends tkControl 
{
	constructor(_Id) 
	{
		super(_Id);
	}

	// Media source
	get Source() 
	{
		return this.Element.src;
	}

	set Source(_Source) 
	{
		this.Element.src = _Source;
	}
	
	// Controls
	HasControls()
	{
		return (this.Element.hasAttribute("controls"));
	}
	
	SetControls(_Visibility)
	{
		if (this.HasControls() == true)
			this.Element.removeAttribute("controls");
		
		if (_Visibility == true)
		{
			var ControlAtt = document.createAttribute("controls"); 
			this.Element.setAttributeNode(ControlAtt);
		}
	}
	
	IsPaused()
	{
		return this.Element.paused;
	}
	
	Play()
	{
		this.Element.play();
	}
	
	Pause()
	{
		this.Element.pause();
	}
	
	IsLooping()
	{
		return this.Element.loop;
	}
	
	SetLooping(_Looping)
	{
		this.Element.loop = _Looping;
	}
	
	IsMuted()
	{
		return this.Element.muted;
	}
	
	SetMuted(_Muted)
	{
		this.Element.muted = _Muted;
	}
	
	get CurrentTime()
	{
		return this.Element.currentTime;
	}
	
	set CurrentTime(_Time)
	{
		this.Element.currentTime = _Time;
	}
	
	GetDuration()
	{
		return this.Element.duration;
	}
	
	get PlaybackRate()
	{
		return this.Element.playbackRate;
	}
	
	set PlaybackRate(_Rate)
	{
		this.Element.playbackRate = _Rate;
	}
	
	GetNetworkState()
	{
		return this.Element.networkState;
	}
	
	GetReadyState()
	{
		return this.Element.readyState;
	}
	
	GetSeekable()
	{
		return this.Element.seekable;
	}
	
	IsSeeking()
	{
		return this.Element.seeking;
	}
	
	get TextTracks()
	{
		return this.Element.textTracks;
	}
	
	set TextTracks(_Tracks)
	{
		this.Element.textTracks = _Tracks;
	}
	
	get Volume()
	{
		return this.Element.volume;
	}
	
	set Volume(_Volume)
	{
		this.Element.volume = _Volume;
	}
	
	CanPlay(_Type)
	{
		return this.Element.csnPlsyType(_Type);
	}
}

class tkVideoPlayer extends tkMediaPlayer
{
	constructor(_Id)
	{
		super(_Id);
		
		this.Element = document.createElement("video"); 
	}
}

class tkAudioPlayer extends tkMediaPlayer
{
	constructor(_Id)
	{
		super(_Id);
		
		this.Element = document.createElement("audio"); 
	}
}

class tkImage extends tkControl
{
	constructor(_Id)
	{
		super(_Id);
		
		this.Element = document.createElement("img"); 
	}
	
	// Image source
	get Source() 
	{
		return this.Element.src;
	}

	set Source(_Source) 
	{
		this.Element.src = _Source;
	}
	
	// Image alternative text
	get Alt() 
	{
		return this.Element.alt;
	}

	set Alt(_Alt) 
	{
		this.Element.alt = _Alt;
	}
}

class tkProgress extends tkControl
{
	constructor(_Id)
	{
		super(_Id);
		
		this.Element = document.createElement("progress"); 
	}
	
	get Max()
	{
		return this.Element.max;
	}
	
	set Max(_Max)
	{
		this.Element.max = _Max;
	}
	
	get Value()
	{
		return this.Element.value;
	}
	
	set Value(_Value)
	{
		this.Element.value = _Value;
	}
}

class tkMeter extends tkControl
{
	constructor(_Id)
	{
		super(_Id);
		
		this.Element = document.createElement("meter"); 
	}
	
	get Value()
	{
		return this.Element.value;
	}
	
	set Value(_Value)
	{
		this.Element.value = _Value;
	}
	
	get High()
	{
		return this.Element.high;
	}
	
	set High(_High)
	{
		this.Element.high = _High;
	}
	
	get Low()
	{
		return this.Element.low;
	}
	
	set Low(_Low)
	{
		this.Element.low = _Low;
	}
	
	get Max()
	{
		return this.Element.max;
	}
	
	set Max(_Max)
	{
		this.Element.max = _Max;
	}
	
	get Min()
	{
		return this.Element.min;
	}
	
	set Min(_Min)
	{
		this.Element.min = _Min;
	}
	
	get Optimum()
	{
		return this.Element.optimum;
	}
	
	set Optimum(_Optimum)
	{
		this.Element.optimum = _Optimum;
	}
}

class tkReviewMeter extends tkMeter
{
	constructor(_Id,_Rating)
	{
		super(_Id);
		
		this.Value = _Rating;
		this.Max = 5;
		this.Min = 0;
		this.Optimum = 5;
		this.Low =2;
		this.High = 4;
	}
}