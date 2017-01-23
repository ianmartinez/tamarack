function GetRandom(min,max)
{
    min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function AddParameters(_url,_args,_vals) {
	let url = _url + "?";
	let max = Math.min(_args.length,_vals.length);
	for(var i=0; i<max; i++) {
		url += _args[i] + "=" + _vals[i];
		if (i < max-1) url += "&";
	}

	return url;
}

function GetParameterFromURL(name, url) 
{
	if (!url) 
	{
		url = window.location.href;
	}
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function GetParameter(name) {
	return GetParameterFromURL(name,GetUrl());
}
			
function GetUrl()
{
	return window.location.href;
}

// Document
function GetTitle()
{
	return document.title;
}


function SetTitle(_Title)
{
	return document.title = _Title;
}

// Output
var Output;

function SetOutput(_Output)
{
	Output = _Output;
}

function GetOutput()
{
	if (Output == null)
		Output = document.body;
	return Output;
}

function PutString(_String)
{
	var t = document.createTextNode(_String);
	GetOutput().appendChild(t);
	
	return t;
}

function PutLine(_String)
{
	if (_String == "undefined" || _String == null)
		_String = "";
	
	var t = document.createTextNode(_String);
	var br = document.createElement("br");
	GetOutput().appendChild(t);
	GetOutput().appendChild(br);
		
	return t;
}

function PutLines(_Strings)
{
	for (let str of _Strings)
		PutLine(str);
}

function PutHeader(_String, _Header)
{
	if(["h1","h2","h3","h4","h5","h6"].indexOf(_Header.toLowerCase()) != -1)
	{
		var h = document.createElement(_Header);
		var t = document.createTextNode(_String);
		h.appendChild(t);
		GetOutput().appendChild(h);
		
		return h;
	}
}